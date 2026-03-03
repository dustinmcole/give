import { Hono } from "hono";
import { z } from "zod";
import { prisma, Prisma } from "@give/db";
import { requireOrgAccess } from "../middleware/auth.js";
import type { AuthVariables } from "../middleware/auth.js";

export const donorRoutes = new Hono<{ Variables: AuthVariables }>();

// ── Validation Schemas ────────────────────────────────────

const listDonorsSchema = z.object({
  orgId: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tag: z.string().optional(),
  campaignId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  frequency: z.enum(["one_time", "recurring"]).optional(),
  sortBy: z
    .enum(["totalGivenCents", "lastDonationAt", "donationCount", "firstDonationAt", "createdAt"])
    .default("lastDonationAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const exportDonorsSchema = z.object({
  orgId: z.string().min(1),
  search: z.string().optional(),
  tag: z.string().optional(),
  campaignId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  frequency: z.enum(["one_time", "recurring"]).optional(),
});

// ── CSV helpers ───────────────────────────────────────────

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

function formatDateYMD(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

// ── Build where clause ────────────────────────────────────

function buildDonorWhere(params: {
  orgId: string;
  search?: string;
  tag?: string;
  campaignId?: string;
  startDate?: string;
  endDate?: string;
  frequency?: "one_time" | "recurring";
}): Prisma.DonorWhereInput {
  const { orgId, search, tag, campaignId, startDate, endDate, frequency } = params;
  const where: Prisma.DonorWhereInput = { orgId };

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (tag) {
    where.tags = { some: { name: { equals: tag, mode: "insensitive" } } };
  }

  if (campaignId || startDate || endDate || frequency) {
    const donationsFilter: Prisma.DonationWhereInput = {};
    if (campaignId) donationsFilter.campaignId = campaignId;
    if (startDate || endDate) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      donationsFilter.createdAt = dateFilter;
    }
    if (frequency === "recurring") {
      donationsFilter.frequency = { not: "ONE_TIME" };
    } else if (frequency === "one_time") {
      donationsFilter.frequency = "ONE_TIME";
    }
    where.donations = { some: donationsFilter };
  }

  return where;
}

// ── GET / — List Donors ───────────────────────────────────

donorRoutes.get("/", requireOrgAccess("orgId"), async (c) => {
  const query = listDonorsSchema.safeParse({
    orgId: c.req.query("orgId"),
    page: c.req.query("page"),
    limit: c.req.query("limit"),
    search: c.req.query("search"),
    tag: c.req.query("tag"),
    campaignId: c.req.query("campaignId"),
    startDate: c.req.query("startDate"),
    endDate: c.req.query("endDate"),
    frequency: c.req.query("frequency"),
    sortBy: c.req.query("sortBy"),
    sortOrder: c.req.query("sortOrder"),
  });

  if (!query.success) {
    return c.json({ error: "Validation failed", details: query.error.flatten() }, 400);
  }

  const { orgId, page, limit, sortBy, sortOrder, ...filters } = query.data;
  const skip = (page - 1) * limit;
  const where = buildDonorWhere({ orgId, ...filters });

  try {
    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where,
        include: { tags: { select: { name: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.donor.count({ where }),
    ]);

    return c.json({
      data: donors,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Error listing donors:", err);
    return c.json({ error: "Failed to list donors" }, 500);
  }
});

// ── GET /export — CSV Export ──────────────────────────────

donorRoutes.get("/export", requireOrgAccess("orgId"), async (c) => {
  const query = exportDonorsSchema.safeParse({
    orgId: c.req.query("orgId"),
    search: c.req.query("search"),
    tag: c.req.query("tag"),
    campaignId: c.req.query("campaignId"),
    startDate: c.req.query("startDate"),
    endDate: c.req.query("endDate"),
    frequency: c.req.query("frequency"),
  });

  if (!query.success) {
    return c.json({ error: "Validation failed", details: query.error.flatten() }, 400);
  }

  const { orgId, ...filters } = query.data;
  const where = buildDonorWhere({ orgId, ...filters });

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { slug: true },
    });

    if (!org) return c.json({ error: "Organization not found" }, 404);

    const EXPORT_LIMIT = 50_000;
    const rows: string[] = [
      buildCsvRow(["First Name","Last Name","Email","Phone","Total Given","Donation Count","First Donation","Last Donation","Tags"]),
    ];

    let cursor: string | undefined;
    let totalExported = 0;
    let truncated = false;

    while (true) {
      const batch = await prisma.donor.findMany({
        where,
        include: { tags: { select: { name: true } } },
        orderBy: { id: "asc" },
        take: Math.min(1000, EXPORT_LIMIT - totalExported),
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      });

      if (batch.length === 0) break;

      for (const donor of batch) {
        rows.push(buildCsvRow([
          donor.firstName, donor.lastName, donor.email, donor.phone ?? "",
          (donor.totalGivenCents / 100).toFixed(2), donor.donationCount,
          formatDateYMD(donor.firstDonationAt), formatDateYMD(donor.lastDonationAt),
          donor.tags.map((t) => t.name).join("; "),
        ]));
      }

      totalExported += batch.length;
      cursor = batch[batch.length - 1].id;
      if (totalExported >= EXPORT_LIMIT) { truncated = true; break; }
      if (batch.length < 1000) break;
    }

    if (truncated) {
      rows.push(buildCsvRow([`[Export truncated at ${EXPORT_LIMIT} rows. Apply filters to export smaller batches.]`]));
    }

    const csv = rows.join("\r\n");
    const date = new Date().toISOString().slice(0, 10);
    const filename = `donors-${org.slug}-${date}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Error exporting donors:", err);
    return c.json({ error: "Failed to export donors" }, 500);
  }
});

// ── GET /:id — Donor Detail + Donation History ────────────

donorRoutes.get("/:id", requireOrgAccess("orgId"), async (c) => {
  const { id } = c.req.param();
  const orgId = c.req.query("orgId") ?? "";
  const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query("limit") ?? "20", 10)));

  try {
    const donor = await prisma.donor.findUnique({
      where: { id },
      include: { tags: { select: { id: true, name: true } } },
    });

    if (!donor || donor.orgId !== orgId) {
      return c.json({ error: "Donor not found" }, 404);
    }

    const [donations, donationTotal] = await Promise.all([
      prisma.donation.findMany({
        where: { donorId: id, orgId },
        include: { campaign: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.donation.count({ where: { donorId: id, orgId } }),
    ]);

    const avgGiftCents = donor.donationCount > 0
      ? Math.round(donor.totalGivenCents / donor.donationCount)
      : 0;

    return c.json({
      data: { donor: { ...donor, avgGiftCents }, donations },
      meta: { page, limit, total: donationTotal, totalPages: Math.ceil(donationTotal / limit) },
    });
  } catch (err) {
    console.error("Error fetching donor:", err);
    return c.json({ error: "Failed to fetch donor" }, 500);
  }
});
