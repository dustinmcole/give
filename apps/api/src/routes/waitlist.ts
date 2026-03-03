import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import { conflict, internalError, validationError, logServerError } from "../lib/errors.js";

export const waitlistRoutes = new Hono();

// ─── Validation Schema ─────────────────────────────────────
const waitlistSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  email: z.string().email("Valid email is required"),
  estimatedVolume: z.string().optional(),
  currentPlatform: z.string().optional(),
});

// ─── POST /api/waitlist ────────────────────────────────────
waitlistRoutes.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(validationError("Invalid JSON body"), 400);
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(validationError(parsed.error.flatten().fieldErrors), 400);
  }

  const { orgName, email, estimatedVolume, currentPlatform } = parsed.data;

  try {
    await prisma.waitlistEntry.create({
      data: { orgName, email, estimatedVolume, currentPlatform },
    });

    // TODO: Send confirmation email via Resend

    return c.json({ success: true, message: "You're on the waitlist!" }, 201);
  } catch (err: unknown) {
    // Prisma unique constraint violation — email already exists
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return c.json(conflict("This email is already on the waitlist."), 409);
    }
    logServerError("Waitlist signup error", { error: err, path: "/api/waitlist" });
    return c.json(internalError(), 500);
  }
});
