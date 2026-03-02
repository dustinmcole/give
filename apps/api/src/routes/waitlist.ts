import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import { waitlistCreateLimiter, getClientIp } from "../lib/rate-limit.js";
import { getResend, getFromEmail } from "../lib/email.js";
import {
  buildWaitlistConfirmationHtml,
  buildWaitlistConfirmationText,
} from "../emails/waitlist-confirmation.js";

export const waitlistRoutes = new Hono();

// ─── Validation Schema ────────────────────────────────────

const createWaitlistEntrySchema = z.object({
  orgName: z.string().min(1, "Organization name is required").max(200),
  email: z.string().email("Invalid email address"),
  estimatedVolume: z
    .enum([
      "Under $10K",
      "$10K–$50K",
      "$50K–$100K",
      "$100K–$500K",
      "$500K+",
    ])
    .optional(),
  currentPlatform: z
    .enum([
      "Zeffy",
      "Givebutter",
      "Classy",
      "Blackbaud",
      "DonorPerfect",
      "Other",
      "None",
    ])
    .optional(),
});

// ─── POST /api/waitlist ───────────────────────────────────

waitlistRoutes.post("/", async (c) => {
  // Rate limiting — 5 requests per IP per hour
  const ip = getClientIp(c);
  if (!waitlistCreateLimiter.check(ip)) {
    return c.json(
      {
        error: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
        statusCode: 429,
      },
      429
    );
  }

  // Parse & validate body
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        error: "INVALID_JSON",
        message: "Request body must be valid JSON.",
        statusCode: 400,
      },
      400
    );
  }

  const parsed = createWaitlistEntrySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        error: "VALIDATION_ERROR",
        message: "Invalid request data.",
        details: parsed.error.flatten().fieldErrors,
        statusCode: 400,
      },
      400
    );
  }

  const { orgName, email, estimatedVolume, currentPlatform } = parsed.data;

  // Check for existing entry
  const existing = await prisma.waitlistEntry.findUnique({
    where: { email },
  });

  if (existing) {
    // Return success silently — don't leak that an email is already registered
    return c.json({
      success: true,
      message: "You're on the list! We'll be in touch soon.",
    });
  }

  // Create waitlist entry
  const entry = await prisma.waitlistEntry.create({
    data: {
      orgName,
      email,
      estimatedVolume: estimatedVolume ?? null,
      currentPlatform: currentPlatform ?? null,
    },
  });

  // Send confirmation email (non-blocking — don't fail the signup if email fails)
  try {
    const resend = getResend();
    await resend.emails.send({
      from: getFromEmail(),
      to: email,
      subject: "You're on the Give waitlist! 🎉",
      html: buildWaitlistConfirmationHtml({ orgName, email }),
      text: buildWaitlistConfirmationText({ orgName, email }),
    });
  } catch (emailErr) {
    // Log but don't fail the request
    console.error("Waitlist confirmation email failed:", emailErr);
  }

  return c.json(
    {
      success: true,
      message: "You're on the list! We'll be in touch soon.",
      id: entry.id,
    },
    201
  );
});
