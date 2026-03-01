import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { healthRoutes } from "./routes/health.js";
import { orgRoutes } from "./routes/orgs.js";
import { campaignRoutes } from "./routes/campaigns.js";
import { donationRoutes } from "./routes/donations.js";
import { stripeRoutes } from "./routes/stripe.js";
import { clerkWebhookRoutes } from "./routes/clerk-webhooks.js";
import { clerkAuth } from "./middleware/auth.js";
import type { AuthVariables } from "./middleware/auth.js";

const app = new Hono<{ Variables: AuthVariables }>();

// ─── Middleware ────────────────────────────────────────────
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "*",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("*", async (c, next) => {
  const path = c.req.path;
  const method = c.req.method;

  // Public routes that bypass auth
  const isPublic =
    path === "/api/health" ||
    path.endsWith("/public") ||
    (path === "/api/donations" && method === "POST") ||
    path.startsWith("/api/stripe") ||
    path.startsWith("/api/webhooks/clerk");

  if (isPublic) {
    return next();
  }

  // Require auth for everything else
  return clerkAuth(c, next);
});

// ─── Routes ───────────────────────────────────────────────
app.route("/api/health", healthRoutes);
app.route("/api/orgs", orgRoutes);
app.route("/api/campaigns", campaignRoutes);
app.route("/api/donations", donationRoutes);
app.route("/api/stripe", stripeRoutes);
// Note: no clerkAuth middleware — Clerk calls this directly
app.route("/api/webhooks/clerk", clerkWebhookRoutes);

// ─── 404 catch-all ────────────────────────────────────────
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// ─── Global error handler ─────────────────────────────────
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// ─── Start server ─────────────────────────────────────────
const port = parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Give API running on http://localhost:${info.port}`);
});

export default app;
