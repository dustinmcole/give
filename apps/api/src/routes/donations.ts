import { Hono } from "hono";
import { z } from "zod";
import { prisma, Prisma } from "@give/db";
import type { PlanTier as PrismaPlanTier } from "@give/db";
import { calculateFees } from "../lib/fees.js";
import { getApplicationFeeAmount } from "../lib/fees.js";
import { createPaymentIntent } from "../lib/stripe.js";
import type { PlanTier, PaymentMethod } from "@give/shared";
import { requireOrgAccess } from "../middleware/auth.js";
import type { AuthVariables } from "../middleware/auth.js";

export const donationRoutes = new Hono<{ Variables: AuthVariables }>();

// ─── CSV Helpers ──────────────────────────────────────────

function csvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRow(fields: (string | number | null | undefined)[]): string {
  return fields.map(csvField).join(",");
}

function formatDateYMD(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

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
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  campaignId: z.string().optional(),
  status: z
    .enum(["PENDING", "PROCESSING", "SUCCEEDED", "FAILED", "REFUNDED", "DISPUTED"])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const exportDonationsSchema = z.object({
  orgId: z.string().min(1),
  campaignId: z.string().optional(),
  status: z
    .enum(["PENDING", "PROCESSING", "SUCCEEDED", "FAILED", "REFUNDED", "DISPUTED"])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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

    // Create donation record
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

    // Create Stripe PaymentIntent on the connected account
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

    // Update donation with Stripe PaymentIntent ID
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
    page: c.req.query("page"),
    limit: c.req.query("limit"),
    campaignId: c.req.query("campaignId"),
    status: c.req.query("status"),
    startDate: c.req.query("startDate"),
    endDate: c.req.query("endDate"),
  });

  if (!query.success) {
    return c.json(
      { error: "Validation failed", details: query.error.flatten() },
      400
    );
  }

  const { orgId, page, limit, campaignId, status, startDate, endDate } =
    query.data;
  const skip = (page - 1) * limit;

  const where: Prisma.DonationWhereInput = {
    orgId,
    ...(campaignId ? { campaignId } : {}),
    ...(status ? { status } : {}),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  };

  try {
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
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
      prisma.donation.count({ where }),
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

// ─── GET /export — Export Donations as CSV ───────────────

donationRoutes.get("/export", requireOrgAccess("orgId"), async (c) => {
  const query = exportDonationsSchema.safeParse({
    orgId: c.req.query("orgId"),
    campaignId: c.req.query("campaignId"),
    status: c.req.query("status"),
    startDate: c.req.query("startDate"),
    endDate: c.req.query("endDate"),
  });

  if (!query.success) {
    return c.json(
      { error: "Validation failed", details: query.error.flatten() },
      400
    );
  }

  const { orgId, campaignId, status, startDate, endDate } = query.data;

  const where: Prisma.DonationWhereInput = {
    orgId,
    ...(campaignId ? { campaignId } : {}),
    ...(status ? { status } : {}),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  };

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { slug: true },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const EXPORT_LIMIT = 50_000;

    const rows: string[] = [];
    rows.push(
      buildCsvRow([
        "Date",
        "Donor Name",
        "Donor Email",
        "Amount",
        "Fees",
        "Net Amount",
        "Campaign",
        "Frequency",
        "Payment Method",
        "Status",
        "Cover Fees",
        "Receipt Number",
      ])
    );

    let cursor: string | undefined;
    let totalExported = 0;
    let truncated = false;

    while (true) {
      const batch = await prisma.donation.findMany({
        where,
        include: {
          donor: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              anonymous: true,
            },
          },
          campaign: { select: { title: true } },
        },
        orderBy: { id: "asc" },
        take: Math.min(1000, EXPORT_LIMIT - totalExported),
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      });

      if (batch.length === 0) break;

      for (const d of batch) {
        const donorName = d.donor.anonymous
          ? "Anonymous"
          : `${d.donor.firstName} ${d.donor.lastName}`;
        const donorEmail = d.donor.anonymous ? "" : d.donor.email;
        const totalFeesCents = d.processingFeeCents + d.platformFeeCents;

        rows.push(
          buildCsvRow([
            formatDateYMD(d.createdAt),
            donorName,
            donorEmail,
            (d.amountCents / 100).toFixed(2),
            (totalFeesCents / 100).toFixed(2),
            (d.netAmountCents / 100).toFixed(2),
            d.campaign.title,
            d.frequency,
            d.paymentMethod ?? "",
            d.status,
            d.coverFees ? "Yes" : "No",
            d.receiptNumber ?? "",
          ])
        );
      }

      totalExported += batch.length;
      cursor = batch[batch.length - 1].id;

      if (totalExported >= EXPORT_LIMIT) {
        truncated = true;
        break;
      }

      if (batch.length < 1000) break;
    }

    if (truncated) {
      rows.push(
        buildCsvRow([
          `[Export truncated at ${EXPORT_LIMIT} rows. Please apply filters to export smaller batches.]`,
        ])
      );
    }

    const csv = rows.join("\r\n");
    const date = new Date().toISOString().slice(0, 10);
    const filename = `donations-${org.slug}-${date}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Error exporting donations:", err);
    return c.json({ error: "Failed to export donations" }, 500);
  }
});
