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
import {
  badRequest,
  validationError,
  notFound,
  internalError,
  logServerError,
  logClientError,
} from "../lib/errors.js";
import { normalizeEmail } from "../lib/sanitize.js";

export const stripeRoutes = new Hono();

// ─── In-memory processed event IDs (idempotency) ─────────
const processedEventIds = new Set<string>();

// ─── Validation Schemas ───────────────────────────────────

const connectSchema = z.object({
  orgId: z.string().min(1),
  email: z.string().email(),
});

// ─── POST /connect — Create Stripe Connect Account ────────

stripeRoutes.post("/connect", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    const err = badRequest("Request body must be valid JSON");
    return c.json(err, 400);
  }

  if (typeof body.email === "string") body.email = normalizeEmail(body.email);

  const parsed = connectSchema.safeParse(body);
  if (!parsed.success) {
    const err = validationError(parsed.error.flatten());
    return c.json(err, 400);
  }

  const { orgId, email } = parsed.data;

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      const err = notFound("Organization");
      return c.json(err, 404);
    }

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

    const stripeAccount = await createConnectAccount(org.name, email);

    await prisma.organization.update({
      where: { id: orgId },
      data: { stripeAccountId: stripeAccount.id },
    });

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
    logServerError("Error creating Stripe Connect account", {
      path: c.req.path,
      method: c.req.method,
      statusCode: 500,
      error: err,
    });
    const body = internalError("Failed to create Stripe Connect account");
    return c.json(body, 500);
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
      const err = notFound("Organization");
      return c.json(err, 404);
    }

    if (!org.stripeAccountId) {
      const err = badRequest("Organization has no Stripe Connect account");
      return c.json(err, 400);
    }

    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const accountLink = await createAccountLink(
      org.stripeAccountId,
      `${baseUrl}/onboarding/refresh?orgId=${org.id}`,
      `${baseUrl}/onboarding/complete?orgId=${org.id}`
    );

    return c.json({ onboardingUrl: accountLink.url });
  } catch (err) {
    logServerError("Error refreshing onboarding link", {
      path: c.req.path,
      method: c.req.method,
      statusCode: 500,
      error: err,
    });
    const body = internalError("Failed to refresh onboarding link");
    return c.json(body, 500);
  }
});

// ─── POST /webhooks — Stripe Webhook Handler ──────────────

stripeRoutes.post("/webhooks", async (c) => {
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    const err = badRequest("Missing stripe-signature header");
    logClientError("Stripe webhook missing signature", {
      path: c.req.path,
      method: c.req.method,
      statusCode: 400,
    });
    return c.json(err, 400);
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logServerError("STRIPE_WEBHOOK_SECRET not configured", {
      path: c.req.path,
      method: c.req.method,
      statusCode: 500,
    });
    const body = internalError("Webhook not configured");
    return c.json(body, 500);
  }

  let event: Stripe.Event;

  try {
    const rawBody = await c.req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logClientError("Stripe webhook signature verification failed", {
      path: c.req.path,
      method: c.req.method,
      statusCode: 400,
      error: message,
    });
    const body = badRequest("Invalid signature");
    return c.json(body, 400);
  }

  if (processedEventIds.has(event.id)) {
    console.log(`Stripe webhook: skipping already-processed event ${event.id}`);
    return c.json({ received: true, skipped: true });
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

      // ── Subscription / Invoice events ────────────────────

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }
  } catch (err) {
    logServerError(`Error handling Stripe webhook ${event.type}`, {
      path: c.req.path,
      method: c.req.method,
      eventId: event.id,
      eventType: event.type,
      error: err,
    });
  }

  processedEventIds.add(event.id);

  return c.json({ received: true });
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

  const donation = await prisma.donation.update({
    where: { id: donationId },
    data: {
      status: "SUCCEEDED",
      stripePaymentIntentId: paymentIntent.id,
    },
  });

  await prisma.donor.update({
    where: { id: donation.donorId },
    data: {
      totalGivenCents: { increment: donation.amountCents },
      donationCount: { increment: 1 },
      lastDonationAt: new Date(),
      firstDonationAt: await getFirstDonationDate(donation.donorId),
    },
  });

  await prisma.campaign.update({
    where: { id: donation.campaignId },
    data: {
      raisedAmountCents: { increment: donation.amountCents },
      donationCount: { increment: 1 },
    },
  });

  await sendReceiptEmail(donationId, donation.orgId);
}

/**
 * Handle invoice.paid — fires for every successful subscription billing cycle.
 * Creates a new Donation record for the cycle (after the first one).
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) {
    console.warn("invoice.paid without subscriptionId:", invoice.id);
    return;
  }

  // Find the original "seed" donation for this subscription
  const seedDonation = await prisma.donation.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    orderBy: { createdAt: "asc" },
    include: { org: true },
  });

  if (!seedDonation) {
    console.warn(
      "invoice.paid: no donation found for subscription",
      subscriptionId
    );
    return;
  }

  // If this is the first invoice (billing cycle 1), just mark the seed donation SUCCEEDED
  const existingSucceeded = await prisma.donation.count({
    where: { stripeSubscriptionId: subscriptionId, status: "SUCCEEDED" },
  });

  if (existingSucceeded === 0) {
    // First payment — update the seed donation
    const updated = await prisma.donation.update({
      where: { id: seedDonation.id },
      data: { status: "SUCCEEDED" },
    });

    await updateDonorAndCampaignAggregates(updated);
    await sendReceiptEmail(updated.id, updated.orgId);
    return;
  }

  // Subsequent billing cycles — create a new Donation record
  const newDonation = await prisma.donation.create({
    data: {
      amountCents: seedDonation.amountCents,
      currency: seedDonation.currency,
      status: "SUCCEEDED",
      frequency: seedDonation.frequency,
      paymentMethod: seedDonation.paymentMethod,
      processingFeeCents: seedDonation.processingFeeCents,
      platformFeeCents: seedDonation.platformFeeCents,
      netAmountCents: seedDonation.netAmountCents,
      coverFees: seedDonation.coverFees,
      totalChargedCents: seedDonation.totalChargedCents,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: seedDonation.stripeCustomerId,
      donorId: seedDonation.donorId,
      campaignId: seedDonation.campaignId,
      orgId: seedDonation.orgId,
    },
  });

  await updateDonorAndCampaignAggregates(newDonation);
  await sendReceiptEmail(newDonation.id, newDonation.orgId);
}

/**
 * Handle invoice.payment_failed — update donation status and notify donor.
 * Stripe will retry automatically based on Smart Retries settings.
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) {
    console.warn("invoice.payment_failed without subscriptionId:", invoice.id);
    return;
  }

  const donation = await prisma.donation.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    orderBy: { createdAt: "desc" },
  });

  if (!donation) {
    console.warn(
      "invoice.payment_failed: no donation found for subscription",
      subscriptionId
    );
    return;
  }

  // Mark as failed (Stripe will retry — do not permanently cancel yet)
  await prisma.donation.update({
    where: { id: donation.id },
    data: { status: "FAILED" },
  });

  // TODO: send failed payment notification email to donor via Resend
  console.log(
    `Recurring payment failed for subscription ${subscriptionId}. ` +
      `Donor: ${donation.donorId}. Stripe will retry automatically.`
  );
}

/**
 * Handle customer.subscription.deleted — subscription was cancelled (by donor or after retry exhaustion).
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  // Find all donations for this subscription and mark them
  const donations = await prisma.donation.findMany({
    where: { stripeSubscriptionId: subscriptionId },
    include: { donor: { select: { email: true, firstName: true } } },
  });

  if (donations.length === 0) {
    console.warn(
      "customer.subscription.deleted: no donations found for subscription",
      subscriptionId
    );
    return;
  }

  await prisma.donation.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "FAILED" },
  });

  const donor = donations[0]?.donor;
  console.log(
    `Subscription ${subscriptionId} cancelled for donor ${donor?.email ?? "unknown"}.`
  );

  // TODO: send subscription cancellation confirmation email via Resend
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

  const org = await prisma.organization.findUnique({
    where: { stripeAccountId: account.id },
  });

  if (!org) {
    console.warn("account.updated for unknown Stripe account:", account.id);
    return;
  }

  const isOnboarded = account.charges_enabled && account.payouts_enabled;

  const updateData: Record<string, unknown> = {
    stripeOnboarded: isOnboarded,
  };

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

async function updateDonorAndCampaignAggregates(donation: {
  donorId: string;
  campaignId: string;
  amountCents: number;
}) {
  await Promise.all([
    prisma.donor.update({
      where: { id: donation.donorId },
      data: {
        totalGivenCents: { increment: donation.amountCents },
        donationCount: { increment: 1 },
        lastDonationAt: new Date(),
        firstDonationAt: await getFirstDonationDate(donation.donorId),
      },
    }),
    prisma.campaign.update({
      where: { id: donation.campaignId },
      data: {
        raisedAmountCents: { increment: donation.amountCents },
        donationCount: { increment: 1 },
      },
    }),
  ]);
}

async function sendReceiptEmail(
  donationId: string,
  orgId: string
): Promise<void> {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: true,
        campaign: true,
        org: true,
      },
    });

    if (!donation) {
      logServerError(`sendReceiptEmail: donation ${donationId} not found`, {
        donationId,
      });
      return;
    }

    let receiptNumber = donation.receiptNumber;
    if (!receiptNumber) {
      receiptNumber = await generateReceiptNumber(orgId, donation.createdAt);
      await prisma.donation.update({
        where: { id: donationId },
        data: { receiptNumber },
      });
    }

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
      logServerError(`Failed to send receipt email for donation ${donationId}`, {
        donationId,
        error,
      });
      return;
    }

    await prisma.donation.update({
      where: { id: donationId },
      data: { receiptSentAt: new Date() },
    });

    console.log(
      `Receipt email sent for donation ${donationId} to ${donation.donor.email} (receipt: ${receiptNumber})`
    );
  } catch (err) {
    logServerError(
      `Unexpected error sending receipt email for donation ${donationId}`,
      { donationId, error: err }
    );
  }
}

async function getFirstDonationDate(donorId: string): Promise<Date> {
  const first = await prisma.donation.findFirst({
    where: { donorId, status: "SUCCEEDED" },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  return first?.createdAt ?? new Date();
}
