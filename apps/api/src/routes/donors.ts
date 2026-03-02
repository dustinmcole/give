import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import { clerkAuth } from "../middleware/auth.js";
import type { AuthVariables } from "../middleware/auth.js";

export const donorRoutes = new Hono<{ Variables: AuthVariables }>();

// ─── Validation Schemas ───────────────────────────────────

const listDonorsSchema = z.object({
  orgId: z.string().min(1),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum([
      "lastDonationAt",
      "firstDonationAt",
      "totalGivenCents",
      "donationCount",
      "createdAt",
      "firstName",
      "lastName",
      "email",
    ])
    .default("lastDonationAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  tag: z.string().optional(),
});

// ─── GET / — List Donors for Org ─────────────────────────

donorRoutes.get("/", clerkAuth, async (c) => {
  const query = listDonorsSchema.safeParse({
    orgId: c.req.query("orgId"),
    search: c.req.query("search"),
    page: c.req.query("page"),
    limit: c.req.query("limit"),
    sortBy: c.req.query("sortBy"),
    sortOrder: c.req.query("sortOrder"),
    tag: c.req.query("tag"),
  });

  if (!query.success) {
    return c.json(
      { error: "Validation failed", details: query.error.flatten() },
      400
    );
  }

  const { orgId, search, page, limit, sortBy, sortOrder, tag } = query.data;
  const skip = (page - 1) * limit;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    orgId,
  };

  // Search filter: partial match on firstName, lastName, or email
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // Tag filter
  if (tag) {
    where.tags = {
      some: { name: { equals: tag, mode: "insensitive" } },
    };
  }

  try {
    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where,
        include: {
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
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
