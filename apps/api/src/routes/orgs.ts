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

