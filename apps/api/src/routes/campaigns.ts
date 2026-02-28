import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";

export const campaignRoutes = new Hono();

// ─── Validation Schemas ───────────────────────────────────

const createCampaignSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  description: z.string().optional(),
  type: z.enum(["donation", "peer_to_peer", "event", "membership"]).default("donation"),
  status: z.enum(["draft", "active", "paused", "ended"]).default("draft"),
  goalAmountCents: z.number().int().positive().optional(),
  orgId: z.string().min(1),
  coverImageUrl: z.string().url().optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a valid hex color")
    .optional(),
  showDonorRoll: z.boolean().default(true),
  showGoal: z.boolean().default(true),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  suggestedAmounts: z.array(z.number().int().positive()).default([2500, 5000, 10000, 25000]),
  allowCustomAmount: z.boolean().default(true),
  allowRecurring: z.boolean().default(true),
});

const updateCampaignSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/)
    .optional(),
  description: z.string().optional(),
  type: z.enum(["donation", "peer_to_peer", "event", "membership"]).optional(),
  status: z.enum(["draft", "active", "paused", "ended"]).optional(),
  goalAmountCents: z.number().int().positive().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .nullable()
    .optional(),
  showDonorRoll: z.boolean().optional(),
  showGoal: z.boolean().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  suggestedAmounts: z.array(z.number().int().positive()).optional(),
  allowCustomAmount: z.boolean().optional(),
  allowRecurring: z.boolean().optional(),
});

// ─── Map shared types to Prisma enums ─────────────────────

const CAMPAIGN_TYPE_MAP = {
  donation: "DONATION",
  peer_to_peer: "PEER_TO_PEER",
  event: "EVENT",
  membership: "MEMBERSHIP",
} as const;

const CAMPAIGN_STATUS_MAP = {
  draft: "DRAFT",
  active: "ACTIVE",
  paused: "PAUSED",
  ended: "ENDED",
} as const;

// ─── POST / — Create Campaign ─────────────────────────────

campaignRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = createCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  const input = parsed.data;

  try {
    // Verify org exists
    const org = await prisma.organization.findUnique({
      where: { id: input.orgId },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    // Check for slug uniqueness within the org
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        orgId_slug: {
          orgId: input.orgId,
          slug: input.slug,
        },
      },
    });

    if (existingCampaign) {
      return c.json(
        { error: "A campaign with this slug already exists for this organization" },
        409
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: input.title,
        slug: input.slug,
        description: input.description ?? null,
        type: CAMPAIGN_TYPE_MAP[input.type],
        status: CAMPAIGN_STATUS_MAP[input.status],
        goalAmountCents: input.goalAmountCents ?? null,
        orgId: input.orgId,
        coverImageUrl: input.coverImageUrl ?? null,
        color: input.color ?? null,
        showDonorRoll: input.showDonorRoll,
        showGoal: input.showGoal,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        suggestedAmounts: input.suggestedAmounts,
        allowCustomAmount: input.allowCustomAmount,
        allowRecurring: input.allowRecurring,
      },
    });

    return c.json(campaign, 201);
  } catch (err) {
    console.error("Error creating campaign:", err);
    return c.json({ error: "Failed to create campaign" }, 500);
  }
});

// ─── GET /:id — Get Campaign with Stats ──────────────────

campaignRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    if (!campaign) {
      return c.json({ error: "Campaign not found" }, 404);
    }

    // Aggregate donation stats
    const stats = await prisma.donation.aggregate({
      where: { campaignId: id, status: "SUCCEEDED" },
      _sum: { amountCents: true },
      _count: true,
    });

    return c.json({
      ...campaign,
      stats: {
        totalRaisedCents: stats._sum.amountCents ?? 0,
        successfulDonations: stats._count,
        goalProgress: campaign.goalAmountCents
          ? Math.round(
              ((stats._sum.amountCents ?? 0) / campaign.goalAmountCents) * 100
            )
          : null,
      },
    });
  } catch (err) {
    console.error("Error fetching campaign:", err);
    return c.json({ error: "Failed to fetch campaign" }, 500);
  }
});

// ─── PATCH /:id — Update Campaign ─────────────────────────

campaignRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");

  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = updateCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  const input = parsed.data;

  try {
    // Verify campaign exists
    const existing = await prisma.campaign.findUnique({ where: { id } });

    if (!existing) {
      return c.json({ error: "Campaign not found" }, 404);
    }

    // If slug is being changed, check uniqueness within the org
    if (input.slug && input.slug !== existing.slug) {
      const slugConflict = await prisma.campaign.findUnique({
        where: {
          orgId_slug: {
            orgId: existing.orgId,
            slug: input.slug,
          },
        },
      });

      if (slugConflict) {
        return c.json(
          { error: "A campaign with this slug already exists for this organization" },
          409
        );
      }
    }

    // Build update data, mapping enums where needed
    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.type !== undefined) updateData.type = CAMPAIGN_TYPE_MAP[input.type];
    if (input.status !== undefined) updateData.status = CAMPAIGN_STATUS_MAP[input.status];
    if (input.goalAmountCents !== undefined) updateData.goalAmountCents = input.goalAmountCents;
    if (input.coverImageUrl !== undefined) updateData.coverImageUrl = input.coverImageUrl;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.showDonorRoll !== undefined) updateData.showDonorRoll = input.showDonorRoll;
    if (input.showGoal !== undefined) updateData.showGoal = input.showGoal;
    if (input.startDate !== undefined) {
      updateData.startDate = input.startDate ? new Date(input.startDate) : null;
    }
    if (input.endDate !== undefined) {
      updateData.endDate = input.endDate ? new Date(input.endDate) : null;
    }
    if (input.suggestedAmounts !== undefined) updateData.suggestedAmounts = input.suggestedAmounts;
    if (input.allowCustomAmount !== undefined) updateData.allowCustomAmount = input.allowCustomAmount;
    if (input.allowRecurring !== undefined) updateData.allowRecurring = input.allowRecurring;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
    });

    return c.json(campaign);
  } catch (err) {
    console.error("Error updating campaign:", err);
    return c.json({ error: "Failed to update campaign" }, 500);
  }
});

// ─── GET /:id/public — Public Campaign Data ──────────────

campaignRoutes.get("/:id/public", async (c) => {
  const id = c.req.param("id");

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        type: true,
        status: true,
        goalAmountCents: true,
        raisedAmountCents: true,
        donationCount: true,
        coverImageUrl: true,
        color: true,
        showDonorRoll: true,
        showGoal: true,
        startDate: true,
        endDate: true,
        suggestedAmounts: true,
        allowCustomAmount: true,
        allowRecurring: true,
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            coverFeesDefault: true,
          },
        },
      },
    });

    if (!campaign) {
      return c.json({ error: "Campaign not found" }, 404);
    }

    if (campaign.status === "DRAFT") {
      return c.json({ error: "Campaign is not published" }, 404);
    }

    // Get recent donors for donor roll (if enabled)
    let recentDonors: Array<{
      firstName: string;
      lastName: string;
      amountCents: number;
      createdAt: Date;
      anonymous: boolean;
    }> = [];

    if (campaign.showDonorRoll) {
      const recentDonations = await prisma.donation.findMany({
        where: {
          campaignId: id,
          status: "SUCCEEDED",
        },
        select: {
          amountCents: true,
          createdAt: true,
          donor: {
            select: {
              firstName: true,
              lastName: true,
              anonymous: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      recentDonors = recentDonations.map((d) => ({
        firstName: d.donor.anonymous ? "Anonymous" : d.donor.firstName,
        lastName: d.donor.anonymous ? "" : d.donor.lastName.charAt(0) + ".",
        amountCents: d.amountCents,
        createdAt: d.createdAt,
        anonymous: d.donor.anonymous,
      }));
    }

    return c.json({
      ...campaign,
      recentDonors,
      goalProgress: campaign.goalAmountCents
        ? Math.round(
            (campaign.raisedAmountCents / campaign.goalAmountCents) * 100
          )
        : null,
    });
  } catch (err) {
    console.error("Error fetching public campaign:", err);
    return c.json({ error: "Failed to fetch campaign" }, 500);
  }
});
