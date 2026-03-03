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
import { calculateFees } from "@give/shared";
import type { PaymentMethod as SharedPaymentMethod, PlanTier } from "@give/shared";

export const stripeRoutes = new Hono();

// --- In-memory processed event IDs (idempotency) ---
// Prevents double-processing if Stripe retries a webhook event.
// MVP: in-memory set. For multi-instance, move to Redis or DB.
const processedEventIds = new Set<string>();

// --- Validation Schemas ---

const connectSchema = z.object({
  orgId: z.string().min(1),
  email: z.string().email(),
});

// --- POST /connect - Create Stripe Connect Account ---

stripeRoutes.post("/connect", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    const err = badRequest("Request body must be valid JSON");
    return c.json(err, 400);
  }

  // Sanitize
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

// --- GET /connect/refresh/:orgId - Refresh Onboarding Link ---

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

// --- POST /webhooks - Stripe Webhook Handler ---
// Resilience rules:
//  1. Always return 200 after successful signature verification - never 5xx
//  2. Catch errors per-event so one bad event does not block others
//  3. Skip already-processed event IDs (idempotency)

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
    // Hono gives us the raw body for webhook signature verification
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

  // Idempotency: skip already-processed events
  if (processedEventIds.has(event.id)) {
    console.log(`Stripe webhook: skipping already-processed event ${event.id}`);
    return c.json({ received: true, skipped: true });
  }

  // Dispatch - catch per-event errors so we always return 200
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

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        // Log unhandled event types for debugging, but return 200
        console.log(`Unhandled webhook event type: ${event.type}`);
    }
  } catch (err) {
    // Log the error but do NOT propagate - webhook handlers must never return 5xx
    logServerError(`Error handling Stripe webhook ${event.type}`, {
      path: c.req.path,
      method: c.req.method,
      eventId: event.id,
      eventType: event.type,
      error: err,
    });
  }

  // Mark as processed only after successful dispatch attempt
  processedEventIds.add(event.id);

  return c.json({ received: true });
});

// --- Webhook Handlers ---

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

  // For subscription donations, the initial payment is handled by
  // invoice.payment_succeeded. Skip here to avoid double-counting.
  const existing = await prisma.donation.findUnique({
    where: { id: donationId },
  });
  if (!existing) {
    console.warn(`payment_intent.succeeded: donation ${donationId} not found`);
    return;
  }
  if (existing.stripeSubscriptionId) {
    // Subscription payment - handled by invoice.payment_succeeded
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

  // Update donor and campaign aggregates
  await updateDonorAndCampaignAggregates(donation);

  // Send donation receipt email
  await sendReceiptEmail(donationId, donation.orgId);
}

/**
 * invoice.payment_succeeded
 *
 * Fired for every successful invoice (initial + renewals).
 * For the initial payment, the Donation record already exists (created in POST /donations).
 * For renewals we create a new Donation record so the org gets a full ledger.
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : (invoice.subscription as Stripe.Subscription | null)?.id;

  if (!subscriptionId) {
    // Not a subscription invoice - ignore
    return;
  }

  const paymentIntentId =
    typeof invoice.payment_intent === "string"
      ? invoice.payment_intent
      : (invoice.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

  // Find the earliest Donation record for this subscription
  const existingDonation = await prisma.donation.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    include: { donor: true, campaign: true, org: true },
    orderBy: { createdAt: "asc" },
  });

  if (!existingDonation) {
    console.warn(
      `invoice.payment_succeeded: no donation found for subscription ${subscriptionId}`
    );
    return;
  }

  // If this payment_intent matches the one already on the initial donation,
  // this is the initial payment - just update status to SUCCEEDED.
  if (
    paymentIntentId &&
    existingDonation.stripePaymentIntentId === paymentIntentId
  ) {
    await prisma.donation.update({
      where: { id: existingDonation.id },
      data: { status: "SUCCEEDED" },
    });
    await updateDonorAndCampaignAggregates(existingDonation);
    await sendReceiptEmail(existingDonation.id, existingDonation.orgId);
    return;
  }

  // This is a renewal - recalculate fees from actual invoice amount
  // instead of copying stale fee data from the original donation.
  const invoiceAmountCents = invoice.amount_paid;
  const paymentMethodMap: Record<string, SharedPaymentMethod> = {
    CARD: "card", ACH: "ach", APPLE_PAY: "apple_pay", GOOGLE_PAY: "google_pay",
  };
  const sharedPaymentMethod: SharedPaymentMethod =
    paymentMethodMap[existingDonation.paymentMethod ?? "CARD"] ?? "card";
  const orgTier: PlanTier =
    (existingDonation.org.planTier?.toLowerCase() as PlanTier) ?? "basic";
  const fees = calculateFees(
    invoiceAmountCents,
    sharedPaymentMethod,
    orgTier,
    existingDonation.coverFees
  );

  const renewalDonation = await prisma.donation.create({
    data: {
      amountCents: fees.donationAmount,
      currency: existingDonation.currency,
      status: "SUCCEEDED",
      frequency: existingDonation.frequency,
      paymentMethod: existingDonation.paymentMethod,
      processingFeeCents: fees.processingFee,
      platformFeeCents: fees.platformFee,
      netAmountCents: fees.netToOrg,
      coverFees: existingDonation.coverFees,
      totalChargedCents: fees.totalCharged,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: existingDonation.stripeCustomerId,
      stripePaymentIntentId: paymentIntentId,
      donorId: existingDonation.donorId,
      campaignId: existingDonation.campaignId,
      orgId: existingDonation.orgId,
    },
  });

  await updateDonorAndCampaignAggregates({
    id: renewalDonation.id,
    amountCents: renewalDonation.amountCents,
    campaignId: renewalDonation.campaignId,
    donorId: renewalDonation.donorId,
    orgId: renewalDonation.orgId,
  });
  await sendReceiptEmail(renewalDonation.id, renewalDonation.orgId);

  console.log(
    `Renewal donation ${renewalDonation.id} created for subscription ${subscriptionId}`
  );
}

/**
 * invoice.payment_failed
 *
 * Mark the most recent PROCESSING donation for this subscription as FAILED.
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : (invoice.subscription as Stripe.Subscription | null)?.id;

  if (!subscriptionId) return;

  const donation = await prisma.donation.findFirst({
    where: { stripeSubscriptionId: subscriptionId, status: "PROCESSING" },
    orderBy: { createdAt: "desc" },
  });

  if (!donation) {
    console.warn(
      `invoice.payment_failed: no PROCESSING donation for subscription ${subscriptionId}`
    );
    return;
  }

  await prisma.donation.update({
    where: { id: donation.id },
    data: { status: "FAILED" },
  });

  console.log(
    `Donation ${donation.id} marked FAILED for subscription ${subscriptionId}`
  );
}

/**
 * customer.subscription.deleted
 *
 * A subscription has been cancelled (by org, donor, or due to repeated failures).
 * Logged for now; a future cancellation UI feature will surface this.
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const donation = await prisma.donation.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    orderBy: { createdAt: "asc" },
  });

  if (!donation) {
    console.warn(
      `customer.subscription.deleted: no donation for subscription ${subscription.id}`
    );
    return;
  }

  console.log(
    `Subscription ${subscription.id} cancelled (donation ${donation.id}, org ${donation.orgId})`
  );
  // Future: create a cancellation event / notify org (#45)
}

/**
 * customer.subscription.updated
 *
 * Handles plan changes (e.g. amount or interval updated).
 * Logged for now; full subscription management is issue #45.
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(
    `Subscription ${subscription.id} updated. Status: ${subscription.status}`
  );
  // Future: sync updated amount/interval to Donation records (#45)
}

/**
 * Sends a donation receipt email for the given donation.
 * Generates a receipt number, updates the donation record, and emails the donor.
 * Errors are logged but never thrown - we never fail a webhook due to email issues.
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
      logServerError(`sendReceiptEmail: donation ${donationId} not found`, {
        donationId,
      });
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
      subject: `Your donation receipt from ${donation.org.name} - ${receiptNumber}`,
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

    // Mark receipt as sent
    await prisma.donation.update({
      where: { id: donationId },
      data: { receiptSentAt: new Date() },
    });

    console.log(
      `Receipt email sent for donation ${donationId} to ${donation.donor.email} (receipt: ${receiptNumber})`
    );
  } catch (err) {
    // Never propagate - a failed email must not fail the webhook
    logServerError(
      `Unexpected error sending receipt email for donation ${donationId}`,
      { donationId, error: err }
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

// --- Shared Helpers ---

/**
 * Increment donor and campaign aggregate counters after a successful payment.
 */
async function updateDonorAndCampaignAggregates(donation: {
  id: string;
  donorId: string;
  campaignId: string;
  amountCents: number;
  orgId: string;
}) {
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
}

async function getFirstDonationDate(donorId: string): Promise<Date> {
  const first = await prisma.donation.findFirst({
    where: { donorId, status: "SUCCEEDED" },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  return first?.createdAt ?? new Date();
}
