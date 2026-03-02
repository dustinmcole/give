import { Hono } from "hono";
import { Webhook } from "svix";
import { prisma } from "@give/db";
import {
  badRequest,
  internalError,
  logServerError,
  logClientError,
} from "../lib/errors.js";

export const clerkWebhookRoutes = new Hono();

// ─── In-memory processed event IDs (idempotency) ─────────
// Prevents double-processing if Clerk retries a webhook event.
const processedEventIds = new Set<string>();

// ─── Clerk Webhook Event Types ────────────────────────────

interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses: ClerkEmailAddress[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

interface ClerkUserUpdatedEvent {
  type: "user.updated";
  data: {
    id: string;
    email_addresses: ClerkEmailAddress[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

interface ClerkUserDeletedEvent {
  type: "user.deleted";
  data: {
    id: string;
    deleted: boolean;
  };
}

type ClerkWebhookEvent =
  | ClerkUserCreatedEvent
  | ClerkUserUpdatedEvent
  | ClerkUserDeletedEvent;

// ─── POST / — Clerk Webhook Handler ──────────────────────
// Resilience rules:
//  1. Always return 200 after successful signature verification — never 5xx
//  2. Catch errors per-event so one bad event doesn't block others
//  3. Skip already-processed event IDs (idempotency)

clerkWebhookRoutes.post("/", async (c) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logServerError("CLERK_WEBHOOK_SECRET is not configured", {
      path: c.req.path,
      method: c.req.method,
    });
    const body = internalError("Webhook not configured");
    return c.json(body, 500);
  }

  // Extract Svix signature headers
  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    const err = badRequest("Missing Svix signature headers");
    logClientError("Clerk webhook missing Svix headers", {
      path: c.req.path,
      method: c.req.method,
      statusCode: 400,
    });
    return c.json(err, 400);
  }

  // Verify webhook signature
  let event: ClerkWebhookEvent;

  try {
    const rawBody = await c.req.text();
    const wh = new Webhook(webhookSecret);
    event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logClientError("Clerk webhook signature verification failed", {
      path: c.req.path,
      method: c.req.method,
      statusCode: 400,
      error: message,
    });
    const body = badRequest("Invalid signature");
    return c.json(body, 400);
  }

  // Idempotency: skip already-processed events
  if (processedEventIds.has(svixId)) {
    console.log(`Clerk webhook: skipping already-processed event ${svixId}`);
    return c.json({ received: true, skipped: true });
  }

  // Dispatch — catch per-event errors so we always return 200
  try {
    switch (event.type) {
      case "user.created":
        await upsertUserFromClerk(event.data);
        console.log(`User provisioned for clerkId: ${event.data.id}`);
        break;

      case "user.updated":
        await upsertUserFromClerk(event.data);
        console.log(`User updated for clerkId: ${event.data.id}`);
        break;

      case "user.deleted":
        handleUserDeleted(event);
        break;

      default:
        // Log unhandled event types, but return 200
        console.log(`Unhandled Clerk webhook event type: ${(event as { type: string }).type}`);
    }
  } catch (err) {
    // Log the error but do NOT propagate — webhook handlers must never return 5xx
    logServerError(`Error handling Clerk webhook ${event.type}`, {
      path: c.req.path,
      method: c.req.method,
      svixId,
      eventType: event.type,
      error: err,
    });
  }

  // Mark as processed
  processedEventIds.add(svixId);

  return c.json({ received: true });
});

// ─── Shared Upsert Logic ──────────────────────────────────

type ClerkUserData = ClerkUserCreatedEvent["data"] | ClerkUserUpdatedEvent["data"];

async function upsertUserFromClerk(data: ClerkUserData) {
  const { id: clerkId, email_addresses, primary_email_address_id, first_name, last_name, image_url } = data;

  // Prefer the primary email address; fall back to first in list
  const email =
    email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ??
    email_addresses[0]?.email_address ??
    "";

  await prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      avatarUrl: image_url ?? null,
    },
    update: {
      email,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      avatarUrl: image_url ?? null,
    },
  });
}

// ─── Webhook Handlers ─────────────────────────────────────

function handleUserDeleted(event: ClerkUserDeletedEvent) {
  // MVP: log only, no delete to preserve donation/activity history
  console.warn(
    `user.deleted received for clerkId: ${event.data.id} — skipping DB deletion (MVP policy)`
  );
}
