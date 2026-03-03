/**
 * Simple in-memory rate limiter (token-bucket style).
 *
 * MVP implementation — upgrade to Redis for multi-instance deployments.
 * Each limiter instance tracks requests per IP address within a sliding window.
 */

interface BucketEntry {
  count: number;
  resetAt: number; // epoch ms when the window expires
}

export interface RateLimiter {
  /**
   * Check whether the given key (typically an IP) is within the limit.
   * Returns true if allowed, false if rate-limited.
   */
  check(key: string): boolean;
}

/**
 * Create a rate limiter.
 *
 * @param maxRequests  Maximum requests allowed per window
 * @param windowMs     Window duration in milliseconds
 */
export function createRateLimiter(
  maxRequests: number,
  windowMs: number
): RateLimiter {
  const buckets = new Map<string, BucketEntry>();

  // Periodically prune expired entries to avoid memory leaks.
  // We use a lazy cleanup approach: entries are pruned on each `check` call
  // when they're expired, plus a periodic sweep every 5 minutes.
  const sweepInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      if (entry.resetAt <= now) {
        buckets.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  // Allow the interval to be garbage-collected when there are no more references
  // (e.g., in tests). Won't block Node.js from exiting.
  if (sweepInterval.unref) {
    sweepInterval.unref();
  }

  return {
    check(key: string): boolean {
      const now = Date.now();
      let entry = buckets.get(key);

      if (!entry || entry.resetAt <= now) {
        // Start a fresh window
        entry = { count: 1, resetAt: now + windowMs };
        buckets.set(key, entry);
        return true;
      }

      entry.count += 1;
      return entry.count <= maxRequests;
    },
  };
}

// ─── Pre-configured limiters ──────────────────────────────

/** POST /api/donations — 10 req/min per IP */
export const donationCreateLimiter = createRateLimiter(10, 60 * 1000);

/** POST /api/orgs — 5 req/min per IP */
export const orgCreateLimiter = createRateLimiter(5, 60 * 1000);

/** GET /api/verify-ein — 20 req/min per IP */
export const verifyEinLimiter = createRateLimiter(20, 60 * 1000);

/** POST /api/waitlist — 5 req/hour per IP */
export const waitlistCreateLimiter = createRateLimiter(5, 60 * 60 * 1000);

// ─── Hono Helper ─────────────────────────────────────────

import type { Context } from "hono";

/**
 * Extract the client IP from a Hono context.
 * Checks standard proxy headers before falling back to the socket address.
 */
export function getClientIp(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    c.req.header("x-real-ip") ??
    "unknown"
  );
}
