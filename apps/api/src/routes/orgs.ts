import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import { createConnectAccount, createAccountLink } from "../lib/stripe.js";

export const orgRoutes = new Hono();

// ─── Validation Schemas ───────────────────────────────────

const createOrgSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Slug must be lowercase alphanumeric with hyphens, and cannot start or end with a hyphen"
    ),
  ein: z
    .string()
    .regex(/^\d{2}-\d{7}$/, "EIN must be in XX-XXXXXXX format")
    .optional(),
  website: z.string().url().optional(),
  email: z.string().email(), // for Stripe Connect account
});

// ─── POST / — Create Organization ─────────────────────────

orgRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = createOrgSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  const { name, slug, ein, website, email } = parsed.data;

  try {
    // Check for slug uniqueness
    const existingSlug = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return c.json({ error: "An organization with this slug already exists" }, 409);
    }

    // Create Stripe Connect Express account
    const stripeAccount = await createConnectAccount(name, email);

    // Create organization in database
    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        ein: ein ?? null,
        website: website ?? null,
        stripeAccountId: stripeAccount.id,
        status: "ONBOARDING",
      },
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
        org,
        onboardingUrl: accountLink.url,
      },
      201
    );
  } catch (err) {
    console.error("Error creating organization:", err);
    return c.json({ error: "Failed to create organization" }, 500);
  }
});

// ─── GET /:id — Get Organization by ID ───────────────────

orgRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            campaigns: true,
            donations: true,
            donors: true,
          },
        },
      },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    // Compute aggregate stats
    const stats = await prisma.donation.aggregate({
      where: { orgId: id, status: "SUCCEEDED" },
      _sum: { amountCents: true },
      _count: true,
    });

    return c.json({
      ...org,
      stats: {
        totalRaisedCents: stats._sum.amountCents ?? 0,
        successfulDonations: stats._count,
        campaignCount: org._count.campaigns,
        donorCount: org._count.donors,
      },
    });
  } catch (err) {
    console.error("Error fetching organization:", err);
    return c.json({ error: "Failed to fetch organization" }, 500);
  }
});

// ─── GET /:idOrSlug/campaigns — List Campaigns for Org ───

orgRoutes.get("/:idOrSlug/campaigns", async (c) => {
  const idOrSlug = c.req.param("idOrSlug");

  try {
    // Try to find by ID first, then by slug
    let org = await prisma.organization.findUnique({
      where: { id: idOrSlug },
      select: { id: true },
    });

    if (!org) {
      org = await prisma.organization.findUnique({
        where: { slug: idOrSlug },
        select: { id: true },
      });
    }

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const campaigns = await prisma.campaign.findMany({
      where: { orgId: org.id },
      orderBy: { createdAt: "desc" },
    });

    return c.json({ data: campaigns });
  } catch (err) {
    console.error("Error listing campaigns for org:", err);
    return c.json({ error: "Failed to list campaigns" }, 500);
  }
});

// ─── GET /me — Resolve Current User's Org ─────────────────
// Expects X-Clerk-User-Id header forwarded by the Next.js /api/me/org route.

orgRoutes.get("/me", async (c) => {
  const clerkUserId = c.req.header("x-clerk-user-id");

  if (!clerkUserId) {
    return c.json({ error: "Missing x-clerk-user-id header" }, 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: {
        memberships: {
          include: {
            org: { select: { id: true, name: true, slug: true } },
          },
          take: 1,
        },
      },
    });

    if (!user || user.memberships.length === 0) {
      return c.json({ error: "No organization found for this user" }, 404);
    }

    return c.json(user.memberships[0]!.org);
  } catch (err) {
    console.error("Error resolving user org:", err);
    return c.json({ error: "Failed to resolve user org" }, 500);
  }
});

// ─── GET /:id/stats — Dashboard Stats ────────────────────

orgRoutes.get("/:id/stats", async (c) => {
  const id = c.req.param("id");

  try {
    const org = await prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRaised, totalDonors, activeCampaigns, donationsThisMonth, recentDonations] =
      await Promise.all([
        prisma.donation.aggregate({
          where: { orgId: id, status: "SUCCEEDED" },
          _sum: { amountCents: true },
        }),
        prisma.donor.count({ where: { orgId: id } }),
        prisma.campaign.count({ where: { orgId: id, status: "ACTIVE" } }),
        prisma.donation.count({
          where: {
            orgId: id,
            status: "SUCCEEDED",
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.donation.findMany({
          where: { orgId: id, status: "SUCCEEDED" },
          orderBy: { createdAt: "desc" },
          take: 10,
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
              select: { id: true, title: true, slug: true },
            },
          },
        }),
      ]);

    return c.json({
      totalRaisedCents: totalRaised._sum.amountCents ?? 0,
      totalDonors,
      activeCampaigns,
      donationsThisMonth,
      recentDonations,
    });
  } catch (err) {
    console.error("Error fetching org stats:", err);
    return c.json({ error: "Failed to fetch org stats" }, 500);
  }
});

// ─── GET /:id/donors — List Donors for Org ────────────────

orgRoutes.get("/:id/donors", async (c) => {
  const id = c.req.param("id");
  const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query("limit") ?? "50", 10)));
  const skip = (page - 1) * limit;

  try {
    const org = await prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where: { orgId: id },
        include: { tags: { select: { name: true } } },
        orderBy: { totalGivenCents: "desc" },
        skip,
        take: limit,
      }),
      prisma.donor.count({ where: { orgId: id } }),
    ]);

    const data = donors.map((d) => ({
      id: d.id,
      orgId: d.orgId,
      email: d.email,
      firstName: d.firstName,
      lastName: d.lastName,
      totalGivenCents: d.totalGivenCents,
      donationCount: d.donationCount,
      firstDonationAt: d.firstDonationAt?.toISOString() ?? null,
      lastDonationAt: d.lastDonationAt?.toISOString() ?? null,
      tags: d.tags.map((t) => t.name),
      createdAt: d.createdAt.toISOString(),
    }));

    return c.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Error listing donors:", err);
    return c.json({ error: "Failed to list donors" }, 500);
  }
});

// ─── PATCH /:id — Update Organization ────────────────────

const updateOrgSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Slug must be lowercase alphanumeric with hyphens"
    )
    .optional(),
  website: z.string().url().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  payoutSchedule: z.enum(["DAILY", "WEEKLY", "MONTHLY", "MANUAL"]).optional(),
  defaultCurrency: z.string().min(3).max(3).optional(),
  coverFeesDefault: z.boolean().optional(),
  status: z
    .enum(["ONBOARDING", "ACTIVE", "SUSPENDED", "DEACTIVATED"])
    .optional(),
});

orgRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");

  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = updateOrgSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  try {
    const existing = await prisma.organization.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: "Organization not found" }, 404);
    }

    // If slug is changing, check uniqueness
    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const slugConflict = await prisma.organization.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (slugConflict) {
        return c.json(
          { error: "An organization with this slug already exists" },
          409
        );
      }
    }

    const org = await prisma.organization.update({
      where: { id },
      data: parsed.data,
    });

    return c.json(org);
  } catch (err) {
    console.error("Error updating organization:", err);
    return c.json({ error: "Failed to update organization" }, 500);
  }
});

