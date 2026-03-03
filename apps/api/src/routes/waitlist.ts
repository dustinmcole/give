import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";

export const waitlistRoutes = new Hono();

const WaitlistSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  orgName: z.string().min(1, { message: "Organization name is required" }).max(200),
});

waitlistRoutes.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } }, 400);
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      400
    );
  }

  const { email, orgName } = parsed.data;

  try {
    const entry = await prisma.waitlistEntry.upsert({
      where: { email },
      update: { orgName },
      create: { email, orgName },
    });

    // TODO: Send confirmation email via Resend (deferred)

    return c.json({ success: true, id: entry.id }, 201);
  } catch (err) {
    console.error("[waitlist] DB error:", err);
    return c.json({ error: { code: "INTERNAL_ERROR", message: "Failed to save waitlist entry" } }, 500);
  }
});
