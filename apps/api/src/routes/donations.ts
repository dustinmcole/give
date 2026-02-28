import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import type { PlanTier as PrismaPlanTier } from "@give/db";
import { calculateFees } from "../lib/fees.js";
import { getApplicationFeeAmount } from "../lib/fees.js";
import { createPaymentIntent } from "../lib/stripe.js";
import type { PlanTier, PaymentMethod } from "@give/shared";

export const donationRoutes = new Hono();

const createDonationSchema = z.object({
  amount: z.number().int().positive().min(100),
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
  dedication: z.object({
      type: z.enum(["in_honor", "in_memory"]),
      name: z.string().min(1),
      message: z.string().optional(),
    }).optional(),
});

const listDonationsSchema = z.object({
  orgId: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

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

function planTierToShared(tier: PrismaPlanTier): PlanTier {
  return tier === "PRO" ? "pro" : "basic";
}

donationRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON body" }, 400);

  const parsed = createDonationSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "Validation failed", details: parsed.error.flatten() }, 400);

  const input = parsed.data;

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: input.campaignId },
      include: { org: true },
    });

    if (!campaign) return c.json({ error: "Campaign not found" }, 404);
    if (campaign.status !== "ACTIVE") return c.json({ error: "Campaign is not active" }, 400);

    const org = campaign.org;
    if (!org.stripeAccountId || !org.stripeOnboarded) return c.json({ error: "Organization has not completed payment setup" }, 400);

    const fees = calculateFees(input.amount, input.paymentMethod as PaymentMethod, planTierToShared(org.planTier), input.coverFees);

    const donor = await prisma.donor.upsert({
      where: { email_orgId: { email: input.donor.email, orgId: org.id } },
      update: { firstName: input.donor.firstName, lastName: input.donor.lastName, anonymous: input.donor.anonymous },
      create: { email: input.donor.email, firstName: input.donor.firstName, lastName: input.donor.lastName, anonymous: input.donor.anonymous, orgId: org.id },
    });

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

    const paymentIntent = await createPaymentIntent(fees.totalCharged, applicationFee, org.stripeAccountId, {
        donationId: donation.id, campaignId: campaign.id, orgId: org.id, donorId: donor.id,
    });

    await prisma.donation.update({
      where: { id: donation.id },
      data: { stripePaymentIntentId: paymentIntent.id, status: "PROCESSING" },
    });

    return c.json({
        donationId: donation.id,
        clientSecret: paymentIntent.client_secret,
        stripeAccountId: org.stripeAccountId,
        fees: {
          donationAmount: fees.donationAmount, processingFee: fees.processingFee, platformFee: fees.platformFee, totalCharged: fees.totalCharged, netToOrg: fees.netToOrg,
        },
      }, 201);
  } catch (err) {
    return c.json({ error: "Failed to create donation" }, 500);
  }
});

donationRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: { donor: { select: { id: true, email: true, firstName: true, lastName: true, anonymous: true } }, campaign: { select: { id: true, title: true, slug: true } }, org: { select: { id: true, name: true, slug: true } } },
    });
    if (!donation) return c.json({ error: "Donation not found" }, 404);
    return c.json(donation);
  } catch (err) {
    return c.json({ error: "Failed to fetch donation" }, 500);
  }
});

donationRoutes.get("/", async (c) => {
  const query = listDonationsSchema.safeParse({ orgId: c.req.query("orgId"), page: c.req.query("page"), limit: c.req.query("limit") });
  if (!query.success) return c.json({ error: "Validation failed", details: query.error.flatten() }, 400);
  const { orgId, page, limit } = query.data;
  const skip = (page - 1) * limit;
  try {
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({ where: { orgId }, include: { donor: { select: { id: true, firstName: true, lastName: true, email: true, anonymous: true } }, campaign: { select: { id: true, title: true, slug: true } } }, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.donation.count({ where: { orgId } }),
    ]);
    return c.json({ data: donations, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return c.json({ error: "Failed to list donations" }, 500);
  }
});
