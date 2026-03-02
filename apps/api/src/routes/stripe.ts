import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import {
  stripe,
  createConnectAccount,
  createAccountLink,
} from "../lib/stripe.js";
import { getResend, getFromEmail } from "../lib/email.js";
import { generateReceiptNumber } from "../lib/receipt-number.js";
import {
  buildDonationReceiptHtml,
  buildDonationReceiptText,
} from "../emails/donation-receipt.js";
import type Stripe from "stripe";

export const stripeRoutes = new Hono();

// ─── Validation Schemas ───────────────────────────────────

const connectSchema = z.object({
  orgId: z.string().min(1),
  email: z.string().email(),
});

// ─── POST /connect — Create Stripe Connect Account ────────

stripeRoutes.post("/connect", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = connectSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  const { orgId, email } = parsed.data;

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    // If org already has a Stripe account, just generate a new onboarding link
    if (org.stripeAccountId) {
      const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
      const accountLink = await createAccountLink(
        org.stripeAccountId,
        `${baseUrl}/onboarding/refresh?orgId=${org.id}`,
        `${baseUrl}/onboarding/complete?orgId=${org.id}`
      );

      return c.json({
        stripeAccountId: org.stripeAccountId,
        onboardingUrl: accountLink.url,
        alreadyExists: true,
      });
    }

    // Create new Stripe Connect account
    const stripeAccount = await createConnectAccount(org.name, email);

    // Save Stripe account ID to org
    await prisma.organization.update({
      where: { id: orgId },
      data: { stripeAccountId: stripeAccount.id },
    });

    // Generate onboarding link
    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const accountLink = await createAccountLink(
      stripeAccount.id,
      `${baseUrl}/onboarding/refresh?orgId=${org.id}`,
      `${baseUrl}/onboarding/complete?orgId=${org.id}`
    );

    return c.json(
      {
        stripeAccountId: stripeAccount.id,
        onboardingUrl: accountLink.url,
      },
      201
    );
  } catch (err) {
    console.error("Error creating Stripe Connect account:", err);
    return c.json({ error: "Failed to create Stripe Connect account" }, 500);
  }
});

// ─── GET /connect/refresh/:orgId — Refresh Onboarding Link

stripeRoutes.get("/connect/refresh/:orgId", async (c) => {
  const orgId = c.req.param("orgId");

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    if (!org.stripeAccountId) {
      return c.json(
        { error: "Organization has no Stripe Connect account" },
        400
      );
    }

    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const accountLink = await createAccountLink(
      org.stripeAccountId,
      `${baseUrl}/onboarding/refresh?orgId=${org.id}`,
      `${baseUrl}/onboarding/complete?orgId=${org.id}`
    );

    return c.json({ onboardingUrl: accountLink.url });
  } catch (err) {
    console.error("Error refreshing onboarding link:", err);
    return c.json({ error: "Failed to refresh onboarding link" }, 500);
  }
});

// ─── POST /webhooks — Stripe Webhook Handler ──────────────

stripeRoutes.post("/webhooks", async (c) => {
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    return c.json({ error: "Missing stripe-signature header" }, 400);
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return c.json({ error: "Webhook not configured" }, 500);
  }

  let event: Stripe.Event;

  try {
    // Hono gives us the raw body for webhook signature verification
    const rawBody = await c.req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return c.json({ error: "Invalid signature" }, 400);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        // Log unhandled event types for debugging, but return 200
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (err) {
    console.error(`Error handling webhook ${event.type}:`, err);
    return c.json({ error: "Webhook handler failed" }, 500);
  }
});

// ─── Webhook Handlers ─────────────────────────────────────

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  const donationId = paymentIntent.metadata?.donationId;
  if (!donationId) {
    console.warn(
      "payment_intent.succeeded without donationId in metadata:",
      paymentIntent.id
    );
    return;
  }

  // Update donation status
  const donation = await prisma.donation.update({
    where: { id: donationId },
    data: {
      status: "SUCCEEDED",
      stripePaymentIntentId: paymentIntent.id,
    },
  });

  // Update donor aggregates
  await prisma.donor.update({
    where: { id: donation.donorId },
    data: {
      totalGivenCents: { increment: donation.amountCents },
      donationCount: { increment: 1 },
      lastDonationAt: new Date(),
      firstDonationAt: await getFirstDonationDate(donation.donorId),
    },
  });

  // Update campaign aggregates (cached totals)
  await prisma.campaign.update({
    where: { id: donation.campaignId },
    data: {
      raisedAmountCents: { increment: donation.amountCents },
      donationCount: { increment: 1 },
    },
  });

  // Send donation receipt email
  await sendReceiptEmail(donationId, donation.orgId);
}

/**
 * Sends a donation receipt email for the given donation.
 * Generates a receipt number, updates the donation record, and emails the donor.
 * Errors are logged but never thrown — we never fail a webhook due to email issues.
 */
async function sendReceiptEmail(
  donationId: string,
  orgId: string
): Promise<void> {
  try {
    // Fetch full donation with related data
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: true,
        campaign: true,
        org: true,
      },
    });

    if (!donation) {
      console.error(`sendReceiptEmail: donation ${donationId} not found`);
      return;
    }

    // Generate receipt number if not already set
    let receiptNumber = donation.receiptNumber;
    if (!receiptNumber) {
      receiptNumber = await generateReceiptNumber(orgId, donation.createdAt);
      await prisma.donation.update({
        where: { id: donationId },
        data: { receiptNumber },
      });
    }

    // Build receipt template data
    const receiptData = {
      orgName: donation.org.name,
      orgEin: donation.org.ein,
      donorFirstName: donation.donor.firstName,
      donorLastName: donation.donor.lastName,
      donorEmail: donation.donor.email,
      amountCents: donation.amountCents,
      currency: donation.currency,
      donationDate: donation.createdAt,
      receiptNumber,
      campaignName: donation.campaign.title,
      dedicationType: donation.dedicationType,
      dedicationName: donation.dedicationName,
    };

    const html = buildDonationReceiptHtml(receiptData);
    const text = buildDonationReceiptText(receiptData);

    // Send via Resend
    const resend = getResend();
    const fromEmail = getFromEmail();

    const { error } = await resend.emails.send({
      from: `${donation.org.name} via Give <${fromEmail}>`,
      to: donation.donor.email,
      subject: `Your donation receipt from ${donation.org.name} — ${receiptNumber}`,
      html,
      text,
    });

    if (error) {
      console.error(
        `Failed to send receipt email for donation ${donationId}:`,
        error
      );
      return;
    }

    // Mark receipt as sent
    await prisma.donation.update({
      where: { id: donationId },
      data: { receiptSentAt: new Date() },
    });

    console.log(
      `Receipt email sent for donation ${donationId} to ${donation.donor.email} (receipt: ${receiptNumber})`
    );
  } catch (err) {
    // Never propagate — a failed email must not fail the webhook
    console.error(
      `Unexpected error sending receipt email for donation ${donationId}:`,
      err
    );
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
) {
  const donationId = paymentIntent.metadata?.donationId;
  if (!donationId) {
    console.warn(
      "payment_intent.payment_failed without donationId in metadata:",
      paymentIntent.id
    );
    return;
  }

  await prisma.donation.update({
    where: { id: donationId },
    data: { status: "FAILED" },
  });

  console.log(
    `Donation ${donationId} payment failed. Reason: ${paymentIntent.last_payment_error?.message ?? "unknown"}`
  );
}

async function handleAccountUpdated(account: Stripe.Account) {
  if (!account.id) return;

  // Find the org with this Stripe account
  const org = await prisma.organization.findUnique({
    where: { stripeAccountId: account.id },
  });

  if (!org) {
    console.warn(
      "account.updated for unknown Stripe account:",
      account.id
    );
    return;
  }

  // Check if onboarding is complete
  const isOnboarded =
    account.charges_enabled && account.payouts_enabled;

  const updateData: Record<string, unknown> = {
    stripeOnboarded: isOnboarded,
  };

  // Move org to ACTIVE once Stripe onboarding is complete
  if (isOnboarded && org.status === "ONBOARDING") {
    updateData.status = "ACTIVE";
  }

  await prisma.organization.update({
    where: { id: org.id },
    data: updateData,
  });

  console.log(
    `Organization ${org.id} (${org.name}) Stripe status updated. Onboarded: ${isOnboarded}`
  );
}

// ─── Helpers ──────────────────────────────────────────────

async function getFirstDonationDate(
  donorId: string
): Promise<Date> {
  const first = await prisma.donation.findFirst({
    where: { donorId, status: "SUCCEEDED" },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  return first?.createdAt ?? new Date();
}
