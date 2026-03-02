import { Hono } from "hono";
import { Webhook } from "svix";
import { prisma } from "@give/db";

export const clerkWebhookRoutes = new Hono();

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

clerkWebhookRoutes.post("/", async (c) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not configured");
    return c.json({ error: "Webhook not configured" }, 500);
  }

  // Extract Svix signature headers
  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: "Missing Svix signature headers" }, 400);
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
    console.error("Clerk webhook signature verification failed:", message);
    return c.json({ error: "Invalid signature" }, 400);
  }

  try {
    switch (event.type) {
      case "user.created":
        await handleUserCreated(event);
        break;

      case "user.updated":
        await handleUserUpdated(event);
        break;

      case "user.deleted":
        handleUserDeleted(event);
        break;

      default:
        // Log unhandled event types, but return 200
        console.log(`Unhandled Clerk webhook event type: ${(event as { type: string }).type}`);
    }

    return c.json({ received: true });
  } catch (err) {
    console.error(`Error handling Clerk webhook ${event.type}:`, err);
    return c.json({ error: "Webhook handler failed" }, 500);
  }
});

// ─── Webhook Handlers ─────────────────────────────────────

async function handleUserCreated(event: ClerkUserCreatedEvent) {
  const { id: clerkId, email_addresses, first_name, last_name, image_url } =
    event.data;

  const email = email_addresses[0]?.email_address ?? "";

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

  console.log(`User provisioned for clerkId: ${clerkId} (${email})`);
}

async function handleUserUpdated(event: ClerkUserUpdatedEvent) {
  const { id: clerkId, email_addresses, first_name, last_name, image_url } =
    event.data;

  const email = email_addresses[0]?.email_address ?? "";

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

  console.log(`User updated for clerkId: ${clerkId}`);
}

function handleUserDeleted(event: ClerkUserDeletedEvent) {
  // MVP: log only, no delete to preserve donation/activity history
  console.warn(
    `user.deleted received for clerkId: ${event.data.id} — skipping DB deletion (MVP policy)`
  );
}
