import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import type { PlanTier as PrismaPlanTier } from "@give/db";
import { calculateFees } from "../lib/fees.js";
import { getApplicationFeeAmount } from "../lib/fees.js";
import {
  createPaymentIntent,
  createStripeCustomer,
  createSubscriptionPrice,
  createSubscription,
  computeApplicationFeePercent,
} from "../lib/stripe.js";
import type { PlanTier, PaymentMethod } from "@give/shared";
import { generateManageToken } from "../lib/manage-token.js";

export const donationRoutes = new Hono();

// ─── Validation Schemas ───────────────────────────────────

const createDonationSchema = z.object({
  amount: z.number().int().positive().min(100), // minimum $1.00
  currency: z.string().default("usd"),
  frequency: z.enum(["one_time", "monthly", "quarterly", "annual"]),
  paymentMethod: z.enum(["card", "ach", "apple_pay", "google_pay"]),
  coverFees: z.boolean(),
  campaignId: z.string().min(1),
  donor: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    anonymous: z.boolean().default(false),
  }),
  dedication: z
    .object({
      type: z.enum(["in_honor", "in_memory"]),
      name: z.string().min(1),
      message: z.string().optional(),
    })
    .optional(),
});

const listDonationsSchema = z.object({
  orgId: z.string().min(1),
  campaignId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Map shared types to Prisma enums ─────────────────────

const FREQUENCY_MAP = {
  one_time: "ONE_TIME",
  monthly: "MONTHLY",
  quarterly: "QUARTERLY",
  annual: "ANNUAL",
} as const;

const PAYMENT_METHOD_MAP = {
  card: "CARD",
  ach: "ACH",
  apple_pay: "APPLE_PAY",
  google_pay: "GOOGLE_PAY",
} as const;

// Map donation frequency to Stripe interval
const FREQUENCY_TO_INTERVAL: Record<
  "monthly" | "quarterly" | "annual",
  "month" | "year" | "week"
> = {
  monthly: "month",
  quarterly: "month", // Stripe doesn't support quarterly natively — we use monthly x3 workaround
  annual: "year",
};

function planTierToShared(tier: PrismaPlanTier): PlanTier {
  return tier === "PRO" ? "pro" : "basic";
}

// ─── POST / — Create Donation ─────────────────────────────

donationRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = createDonationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  const input = parsed.data;

  try {
    // Look up the campaign and its org
    const campaign = await prisma.campaign.findUnique({
      where: { id: input.campaignId },
      include: { org: true },
    });

    if (!campaign) {
      return c.json({ error: "Campaign not found" }, 404);
    }

    if (campaign.status !== "ACTIVE") {
      return c.json({ error: "Campaign is not active" }, 400);
    }

    const org = campaign.org;

    if (!org.stripeAccountId || !org.stripeOnboarded) {
      return c.json(
        { error: "Organization has not completed payment setup" },
        400
      );
    }

    // Calculate fees
    const fees = calculateFees(
      input.amount,
      input.paymentMethod as PaymentMethod,
      planTierToShared(org.planTier),
      input.coverFees
    );

    // Find or create donor for this org
    const donor = await prisma.donor.upsert({
      where: {
        email_orgId: {
          email: input.donor.email,
          orgId: org.id,
        },
      },
      update: {
        firstName: input.donor.firstName,
        lastName: input.donor.lastName,
        anonymous: input.donor.anonymous,
      },
      create: {
        email: input.donor.email,
        firstName: input.donor.firstName,
        lastName: input.donor.lastName,
        anonymous: input.donor.anonymous,
        orgId: org.id,
      },
    });

    const isRecurring = input.frequency !== "one_time";

    if (isRecurring) {
      // ── Recurring: Stripe Subscription ──────────────────

      const interval =
        FREQUENCY_TO_INTERVAL[
          input.frequency as "monthly" | "quarterly" | "annual"
        ];

      // For quarterly, use 3-month interval_count
      const intervalCount = input.frequency === "quarterly" ? 3 : 1;

      // Create or reuse a Stripe customer on the connected account
      const stripeCustomer = await createStripeCustomer(
        donor.email,
        `${donor.firstName} ${donor.lastName}`,
        org.stripeAccountId,
        {
          donorId: donor.id,
          orgId: org.id,
        }
      );

      // Create a price for this amount + interval
      const price = await createStripeSubscriptionPrice(
        fees.totalCharged,
        input.currency,
        interval,
        intervalCount,
        org.stripeAccountId,
        `${campaign.title} — ${input.frequency} donation`
      );

      // Application fee percent for Connect
      const appFeePercent = computeApplicationFeePercent(
        fees.platformFee,
        fees.totalCharged
      );

      // Create donation record first (PENDING)
      const donation = await prisma.donation.create({
        data: {
          amountCents: fees.donationAmount,
          currency: input.currency,
          status: "PENDING",
          frequency: FREQUENCY_MAP[input.frequency],
          paymentMethod: PAYMENT_METHOD_MAP[input.paymentMethod],
          processingFeeCents: fees.processingFee,
          platformFeeCents: fees.platformFee,
          netAmountCents: fees.netToOrg,
          coverFees: input.coverFees,
          totalChargedCents: fees.totalCharged,
          dedicationType: input.dedication?.type ?? null,
          dedicationName: input.dedication?.name ?? null,
          dedicationMessage: input.dedication?.message ?? null,
          donorId: donor.id,
          campaignId: campaign.id,
          orgId: org.id,
          stripeCustomerId: stripeCustomer.id,
        },
      });

      // Create Stripe Subscription
      const subscription = await createSubscription(
        stripeCustomer.id,
        price.id,
        appFeePercent,
        org.stripeAccountId,
        {
          donationId: donation.id,
          campaignId: campaign.id,
          orgId: org.id,
          donorId: donor.id,
        }
      );

      // Extract PaymentIntent client_secret from the latest invoice
      const latestInvoice = subscription.latest_invoice as
        | { payment_intent?: { client_secret?: string | null } }
        | null;
      const clientSecret =
        latestInvoice?.payment_intent?.client_secret ?? null;

      // Update donation with subscription ID
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          stripeSubscriptionId: subscription.id,
          status: "PROCESSING",
        },
      });

      // Generate management token for self-service portal link
      // TODO: include this token in receipt email (Resend integration pending)
      const manageToken = generateManageToken(donor.id, org.id);
      const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
      const manageUrl = `${baseUrl}/manage/${manageToken}`;

      return c.json(
        {
          donationId: donation.id,
          clientSecret,
          stripeAccountId: org.stripeAccountId,
          subscriptionId: subscription.id,
          manageUrl,
          fees: {
            donationAmount: fees.donationAmount,
            processingFee: fees.processingFee,
            platformFee: fees.platformFee,
            totalCharged: fees.totalCharged,
            netToOrg: fees.netToOrg,
          },
        },
        201
      );
    } else {
      // ── One-time: Stripe PaymentIntent ───────────────────

      const donation = await prisma.donation.create({
        data: {
          amountCents: fees.donationAmount,
          currency: input.currency,
          status: "PENDING",
          frequency: FREQUENCY_MAP[input.frequency],
          paymentMethod: PAYMENT_METHOD_MAP[input.paymentMethod],
          processingFeeCents: fees.processingFee,
          platformFeeCents: fees.platformFee,
          netAmountCents: fees.netToOrg,
          coverFees: input.coverFees,
          totalChargedCents: fees.totalCharged,
          dedicationType: input.dedication?.type ?? null,
          dedicationName: input.dedication?.name ?? null,
          dedicationMessage: input.dedication?.message ?? null,
          donorId: donor.id,
          campaignId: campaign.id,
          orgId: org.id,
        },
      });

      const applicationFee = getApplicationFeeAmount(fees.platformFee);

      const paymentIntent = await createPaymentIntent(
        fees.totalCharged,
        applicationFee,
        org.stripeAccountId,
        {
          donationId: donation.id,
          campaignId: campaign.id,
          orgId: org.id,
          donorId: donor.id,
        }
      );

      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
          status: "PROCESSING",
        },
      });

      return c.json(
        {
          donationId: donation.id,
          clientSecret: paymentIntent.client_secret,
          stripeAccountId: org.stripeAccountId,
          fees: {
            donationAmount: fees.donationAmount,
            processingFee: fees.processingFee,
            platformFee: fees.platformFee,
            totalCharged: fees.totalCharged,
            netToOrg: fees.netToOrg,
          },
        },
        201
      );
    }
  } catch (err) {
    console.error("Error creating donation:", err);
    return c.json({ error: "Failed to create donation" }, 500);
  }
});

// ─── GET /:id — Get Donation by ID ───────────────────────

donationRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            anonymous: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
            slug: true,
            color: true,
            description: true,
          },
        },
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            website: true,
          },
        },
      },
    });

    if (!donation) {
      return c.json({ error: "Donation not found" }, 404);
    }

    return c.json(donation);
  } catch (err) {
    console.error("Error fetching donation:", err);
    return c.json({ error: "Failed to fetch donation" }, 500);
  }
});

// ─── GET / — List Donations for Org ──────────────────────

donationRoutes.get("/", async (c) => {
  const query = listDonationsSchema.safeParse({
    orgId: c.req.query("orgId"),
    campaignId: c.req.query("campaignId"),
    page: c.req.query("page"),
    limit: c.req.query("limit"),
  });

  if (!query.success) {
    return c.json(
      { error: "Validation failed", details: query.error.flatten() },
      400
    );
  }

  const { orgId, campaignId, page, limit } = query.data;
  const skip = (page - 1) * limit;
  const whereClause = campaignId ? { orgId, campaignId } : { orgId };

  try {
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where: whereClause,
        include: {
          donor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              anonymous: true,
            },
          },
          campaign: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.donation.count({ where: whereClause }),
    ]);

    return c.json({
      data: donations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error listing donations:", err);
    return c.json({ error: "Failed to list donations" }, 500);
  }
});

// ─── GET /recurring — Recurring donors & MRR metrics ─────

donationRoutes.get("/recurring/metrics", async (c) => {
  const orgId = c.req.query("orgId");
  if (!orgId) {
    return c.json({ error: "orgId is required" }, 400);
  }

  try {
    // All active recurring donations (unique subscriptions)
    const recurringDonations = await prisma.donation.findMany({
      where: {
        orgId,
        stripeSubscriptionId: { not: null },
        frequency: { not: "ONE_TIME" },
        status: "SUCCEEDED",
      },
      distinct: ["stripeSubscriptionId"],
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // MRR: normalize all frequencies to monthly equivalent
    const mrrCents = recurringDonations.reduce((sum, d) => {
      switch (d.frequency) {
        case "MONTHLY":
          return sum + d.amountCents;
        case "QUARTERLY":
          return sum + Math.round(d.amountCents / 3);
        case "ANNUAL":
          return sum + Math.round(d.amountCents / 12);
        default:
          return sum;
      }
    }, 0);

    // Failed/churned subscriptions in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const churnedCount = await prisma.donation.count({
      where: {
        orgId,
        stripeSubscriptionId: { not: null },
        status: "FAILED",
        updatedAt: { gte: thirtyDaysAgo },
      },
    });

    return c.json({
      recurringDonors: recurringDonations.length,
      mrrCents,
      churnedLast30Days: churnedCount,
      donors: recurringDonations,
    });
  } catch (err) {
    console.error("Error fetching recurring metrics:", err);
    return c.json({ error: "Failed to fetch recurring metrics" }, 500);
  }
});

// ─── Helpers ──────────────────────────────────────────────

// Wrapper to support quarterly (interval_count=3) via stripe.prices.create
async function createStripeSubscriptionPrice(
  amountCents: number,
  currency: string,
  interval: "month" | "year" | "week",
  intervalCount: number,
  stripeAccountId: string,
  productName: string
) {
  const { stripe } = await import("../lib/stripe.js");
  return stripe.prices.create(
    {
      currency,
      unit_amount: amountCents,
      recurring: { interval, interval_count: intervalCount },
      product_data: { name: productName },
    },
    { stripeAccount: stripeAccountId }
  );
}
