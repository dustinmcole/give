import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { healthRoutes } from "./routes/health.js";
import { waitlistRoutes } from "./routes/waitlist.js";
import { orgRoutes } from "./routes/orgs.js";
import { campaignRoutes } from "./routes/campaigns.js";
import { donationRoutes } from "./routes/donations.js";
import { donorRoutes } from "./routes/donors.js";
import { stripeRoutes } from "./routes/stripe.js";
import { clerkWebhookRoutes } from "./routes/clerk-webhooks.js";
import { clerkAuth, requireOrgAccess } from "./middleware/auth.js";
import type { AuthVariables } from "./middleware/auth.js";
import { publicRateLimit, authRateLimit } from "./middleware/rate-limit.js";
import { internalError, logServerError } from "./lib/errors.js";

const app = new Hono<{ Variables: AuthVariables }>();

// ─── Global Middleware ─────────────────────────────────────
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "*",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Public Routes (no auth required) ─────────────────────

// Health check
app.route("/api/health", healthRoutes);

// Waitlist signup — public, rate limited
app.use("/api/waitlist", publicRateLimit);
app.route("/api/waitlist", waitlistRoutes);

// Stripe webhooks & connect — exempt from rate limiting (Stripe IPs are trusted)
// Must stay public; signature verification happens inside the route handler.
app.route("/api/stripe", stripeRoutes);

// Clerk webhooks — verified by svix signature, not Clerk JWT
// Note: no clerkAuth middleware — Clerk calls this directly
app.route("/api/webhooks/clerk", clerkWebhookRoutes);

// ─── Campaign Route Auth ───────────────────────────────────
//
// Public (no auth):
//   GET  /api/campaigns/:id        — donation page loads campaign data
//   GET  /api/campaigns/:id/public — public campaign embed
//
// Protected (Clerk JWT required):
//   POST   /api/campaigns          — create campaign
//   PATCH  /api/campaigns/:id      — update campaign

app.use("/api/campaigns", async (c, next) => {
  if (c.req.method !== "POST") return next();
  return clerkAuth(c, next);
});

app.use("/api/campaigns/:id", async (c, next) => {
  if (c.req.method !== "PATCH") return next();
  return clerkAuth(c, next);
});

// Rate limit campaign mutations (authenticated) and reads (public)
app.use("/api/campaigns", async (c, next) => {
  if (c.req.method === "POST") return authRateLimit(c, next);
  return publicRateLimit(c, next);
});
app.use("/api/campaigns/:id", async (c, next) => {
  if (c.req.method === "PATCH") return authRateLimit(c, next);
  return publicRateLimit(c, next);
});

app.route("/api/campaigns", campaignRoutes);

// ─── Donation Route Auth ───────────────────────────────────
//
// Public (no auth):
//   POST /api/donations          — anonymous donor checkout (10 req/min per IP)
//   GET  /api/donations/:id      — donation confirmation page
//
// Protected (Clerk JWT required):
//   GET  /api/donations          — org dashboard lists donations by orgId

app.use("/api/donations", async (c, next) => {
  if (c.req.method !== "GET") return next();
  return clerkAuth(c, next);
});

// Public POST (donation creation) — strict limit to mitigate card-testing attacks
app.use("/api/donations", async (c, next) => {
  if (c.req.method === "GET") return authRateLimit(c, next);
  return publicRateLimit(c, next);
});
// Confirmation page GET by id — public, moderate limit
app.use("/api/donations/:id", publicRateLimit);

app.route("/api/donations", donationRoutes);

// ─── Organization Route Auth ───────────────────────────────
//
// POST /api/orgs is public (onboarding — user may not be in DB yet)
app.use("/api/orgs/:id", async (c, next) => {
  return clerkAuth(c, next);
});
app.use("/api/orgs/:id", requireOrgAccess("id"));

app.use("/api/orgs/:idOrSlug/:rest{.*}", async (c, next) => {
  return clerkAuth(c, next);
});
app.use("/api/orgs/:idOrSlug/:rest{.*}", requireOrgAccess("idOrSlug"));

// All org routes are authenticated — apply auth rate limit
app.use("/api/orgs/*", authRateLimit);
app.use("/api/orgs", authRateLimit);

app.route("/api/orgs", orgRoutes);

// ─── Donor Route Auth ─────────────────────────────────────
// Auth enforced within the route handler via clerkAuth middleware
app.use("/api/donors/*", authRateLimit);
app.use("/api/donors", authRateLimit);
app.route("/api/donors", donorRoutes);

// ─── 404 catch-all ────────────────────────────────────────
app.notFound((c) => {
  return c.json(
    {
      error: "NOT_FOUND",
      message: "The requested resource does not exist",
      statusCode: 404,
    },
    404
  );
});

// ─── Global error handler ─────────────────────────────────
// Catches any unhandled exceptions thrown from route handlers.
// Never leaks stack traces to clients; logs full details server-side.
app.onError((err, c) => {
  logServerError("Unhandled exception", {
    path: c.req.path,
    method: c.req.method,
    error: err,
  });
  const body = internalError();
  return c.json(body, body.statusCode as 500);
});

// ─── Start server ─────────────────────────────────────────
const port = parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Give API running on http://localhost:${info.port}`);
});

export default app;
