import { Hono } from "hono";
import { z } from "zod";
import { prisma, Prisma } from "@give/db";
import { requireOrgAccess } from "../middleware/auth.js";
import type { AuthVariables } from "../middleware/auth.js";

export const donorRoutes = new Hono<{ Variables: AuthVariables }>();

// ─── Validation Schemas ───────────────────────────────────

const listDonorsSchema = z.object({
  orgId: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tag: z.string().optional(),
});

const exportDonorsSchema = z.object({
  orgId: z.string().min(1),
  search: z.string().optional(),
  tag: z.string().optional(),
});

// ─── Helper: escape CSV field ─────────────────────────────

function csvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Wrap in quotes if contains comma, quote, or newline
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
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

// ─── GET / — List Donors for Org ─────────────────────────

donorRoutes.get("/", requireOrgAccess("orgId"), async (c) => {
  const query = listDonorsSchema.safeParse({
    orgId: c.req.query("orgId"),
    page: c.req.query("page"),
    limit: c.req.query("limit"),
    search: c.req.query("search"),
    tag: c.req.query("tag"),
  });

  if (!query.success) {
    return c.json(
      { error: "Validation failed", details: query.error.flatten() },
      400
    );
  }

  const { orgId, page, limit, search, tag } = query.data;
  const skip = (page - 1) * limit;

  const where: Prisma.DonorWhereInput = {
    orgId,
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(tag ? { tags: { some: { name: { equals: tag, mode: "insensitive" } } } } : {}),
  };

  try {
    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where,
        include: {
          tags: { select: { name: true } },
        },
        orderBy: { lastDonationAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.donor.count({ where }),
    ]);

    return c.json({
      data: donors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error listing donors:", err);
    return c.json({ error: "Failed to list donors" }, 500);
  }
});

// ─── GET /export — Export Donors as CSV ──────────────────

donorRoutes.get("/export", requireOrgAccess("orgId"), async (c) => {
  const query = exportDonorsSchema.safeParse({
    orgId: c.req.query("orgId"),
    search: c.req.query("search"),
    tag: c.req.query("tag"),
  });

  if (!query.success) {
    return c.json(
      { error: "Validation failed", details: query.error.flatten() },
      400
    );
  }

  const { orgId, search, tag } = query.data;

  const where: Prisma.DonorWhereInput = {
    orgId,
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(tag ? { tags: { some: { name: { equals: tag, mode: "insensitive" } } } } : {}),
  };

  try {
    // Fetch org slug for filename
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { slug: true },
    });

    if (!org) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const EXPORT_LIMIT = 50_000;

    // Use cursor-based pagination for large datasets
    const rows: string[] = [];
    const header = buildCsvRow([
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Total Given",
      "Donation Count",
      "First Donation",
      "Last Donation",
      "Tags",
    ]);
    rows.push(header);

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
        rows.push(
          buildCsvRow([
            donor.firstName,
            donor.lastName,
            donor.email,
            donor.phone ?? "",
            (donor.totalGivenCents / 100).toFixed(2),
            donor.donationCount,
            formatDateYMD(donor.firstDonationAt),
            formatDateYMD(donor.lastDonationAt),
            donor.tags.map((t) => t.name).join("; "),
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
