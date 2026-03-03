/**
 * In-memory rate limiting middleware for Hono.
 *
 * Limits:
 *   - Public endpoints:        10 req/min per IP
 *   - Authenticated endpoints: 100 req/min per user ID
 *   - Stripe webhook:          exempt
 *
 * Upgrade path: swap the `store` Map for a Redis client.
 */

import type { Context, MiddlewareHandler, Next } from "hono";

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix ms
}

interface RateLimitOptions {
  /** Max requests allowed in the window. */
  limit: number;
  /** Window duration in milliseconds. */
  windowMs: number;
  /**
   * Derive the rate-limit key from the request context.
   * Return `null` to skip rate limiting for this request.
   */
  keyFn: (c: Context) => string | null;
}

const store = new Map<string, RateLimitEntry>();

/** Purge expired entries to prevent unbounded memory growth. */
function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

// Purge every 5 minutes.
setInterval(purgeExpired, 5 * 60 * 1_000).unref();

function createRateLimiter(options: RateLimitOptions): MiddlewareHandler {
  const { limit, windowMs } = options;

  return async (c: Context, next: Next): Promise<Response | void> => {
    const key = options.keyFn(c);

    // null key → exempt from rate limiting
    if (key === null) {
      return next();
    }

    const now = Date.now();
    let entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 1, resetAt: now + windowMs };
      store.set(key, entry);
    } else {
      entry.count += 1;
    }

    const remaining = Math.max(0, limit - entry.count);
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1_000);

    c.header("X-RateLimit-Limit", String(limit));
    c.header("X-RateLimit-Remaining", String(remaining));
    c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1_000)));

    if (entry.count > limit) {
      c.header("Retry-After", String(retryAfterSec));
      return c.json(
        {
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please retry after the indicated time.",
            details: { retryAfterSeconds: retryAfterSec },
          },
        },
        429
      );
    }

    return next();
  };
}

/** Returns the best-effort client IP from common proxy headers. */
function getClientIp(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    c.req.header("x-real-ip") ??
    "unknown"
  );
}

/**
 * Rate limiter for public endpoints (e.g. donation creation).
 * 10 requests per minute per IP.
 */
export const publicRateLimit: MiddlewareHandler = createRateLimiter({
  limit: 10,
  windowMs: 60_000,
  keyFn: (c) => `public:${getClientIp(c)}:${c.req.path}`,
});

/**
 * Rate limiter for authenticated endpoints.
 * 100 requests per minute per authenticated user ID.
 * Falls back to IP if no user ID is available.
 */
export const authRateLimit: MiddlewareHandler = createRateLimiter({
  limit: 100,
  windowMs: 60_000,
  keyFn: (c) => {
    // AuthVariables set by clerkAuth middleware
    const userId =
      (c.get("userId" as never) as string | undefined) ?? getClientIp(c);
    return `auth:${userId}:${c.req.path}`;
  },
});

/**
 * No-op sentinel — explicitly marks a route as exempt from rate limiting.
 * Use on Stripe webhook routes.
 */
export const rateLimitExempt: MiddlewareHandler = createRateLimiter({
  limit: Infinity,
  windowMs: 60_000,
  keyFn: () => null,
});
