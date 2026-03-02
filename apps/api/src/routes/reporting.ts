import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import { requireOrgAccess } from "../middleware/auth.js";
import type { AuthVariables } from "../middleware/auth.js";

export const reportingRoutes = new Hono<{ Variables: AuthVariables }>();

// ─── Validation ────────────────────────────────────────────

const overviewQuerySchema = z.object({
  orgId: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ─── GET /overview — Reporting Overview ───────────────────
//
// Returns aggregated donation stats for an org:
//   - summary totals
//   - daily trend (last 30 days by default)
//   - campaign breakdown
//   - payment method breakdown

reportingRoutes.get(
  "/overview",
  requireOrgAccess("orgId"),
  async (c) => {
    const query = overviewQuerySchema.safeParse({
      orgId: c.req.query("orgId"),
      startDate: c.req.query("startDate"),
      endDate: c.req.query("endDate"),
    });

    if (!query.success) {
      return c.json(
        { error: "Validation failed", details: query.error.flatten() },
        400
      );
    }

    const { orgId, startDate, endDate } = query.data;

    // Default: last 30 days
    const now = new Date();
    const defaultEnd = new Date(now);
    defaultEnd.setHours(23, 59, 59, 999);

    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 29);
    defaultStart.setHours(0, 0, 0, 0);

    const trendStart = startDate ? new Date(startDate) : defaultStart;
    const trendEnd = endDate ? new Date(endDate) : defaultEnd;

    try {
      // ── Summary aggregates ──────────────────────────────

      const [summaryAgg, donorCount, activeCampaigns, recurringCount] =
        await Promise.all([
          prisma.donation.aggregate({
            where: { orgId, status: "SUCCEEDED" },
            _sum: { amountCents: true },
            _count: true,
          }),
          prisma.donor.count({ where: { orgId } }),
          prisma.campaign.count({ where: { orgId, status: "ACTIVE" } }),
          prisma.donation.groupBy({
            by: ["donorId"],
            where: { orgId, status: "SUCCEEDED", frequency: { not: "ONE_TIME" } },
          }),
        ]);

      const totalRaisedCents = summaryAgg._sum.amountCents ?? 0;
      const totalDonations = summaryAgg._count;
      const avgDonationCents =
        totalDonations > 0 ? Math.round(totalRaisedCents / totalDonations) : 0;

      // Donor retention: donors with >1 donation / total donors
      const repeatDonors = await prisma.donor.count({
        where: { orgId, donationCount: { gt: 1 } },
      });
      const donorRetentionRate =
        donorCount > 0 ? repeatDonors / donorCount : 0;

      // ── Daily trend (raw donations in range) ────────────

      const trendDonations = await prisma.donation.findMany({
        where: {
          orgId,
          status: "SUCCEEDED",
          createdAt: { gte: trendStart, lte: trendEnd },
        },
        select: { amountCents: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });

      // Build a map of date → { amountCents, count }
      const trendMap = new Map<
        string,
        { amountCents: number; count: number }
      >();

      // Pre-fill every date in the range with zeros
      const cursor = new Date(trendStart);
      while (cursor <= trendEnd) {
        const key = cursor.toISOString().slice(0, 10);
        trendMap.set(key, { amountCents: 0, count: 0 });
        cursor.setDate(cursor.getDate() + 1);
      }

      for (const d of trendDonations) {
        const key = d.createdAt.toISOString().slice(0, 10);
        const entry = trendMap.get(key) ?? { amountCents: 0, count: 0 };
        entry.amountCents += d.amountCents;
        entry.count += 1;
        trendMap.set(key, entry);
      }

      const dailyTrend = Array.from(trendMap.entries()).map(
        ([date, { amountCents, count }]) => ({ date, amountCents, count })
      );

      // ── Campaign breakdown ───────────────────────────────

      const campaignDonations = await prisma.donation.groupBy({
        by: ["campaignId"],
        where: { orgId, status: "SUCCEEDED" },
        _sum: { amountCents: true },
        _count: true,
      });

      const campaignIds = campaignDonations.map((c) => c.campaignId);
      const campaigns = await prisma.campaign.findMany({
        where: { id: { in: campaignIds } },
        select: { id: true, title: true },
      });

      const campaignTitleMap = new Map(campaigns.map((c) => [c.id, c.title]));

      const campaignBreakdown = campaignDonations.map((c) => ({
        campaignId: c.campaignId,
        title: campaignTitleMap.get(c.campaignId) ?? "Unknown",
        raisedCents: c._sum.amountCents ?? 0,
        count: c._count,
      }));

      // ── Payment method breakdown ─────────────────────────

      const pmDonations = await prisma.donation.groupBy({
        by: ["paymentMethod"],
        where: { orgId, status: "SUCCEEDED" },
        _sum: { amountCents: true },
        _count: true,
      });

      const paymentMethodBreakdown = pmDonations.map((p) => ({
        method: p.paymentMethod ?? "UNKNOWN",
        count: p._count,
        amountCents: p._sum.amountCents ?? 0,
      }));

      // ── Response ─────────────────────────────────────────

      return c.json({
        summary: {
          totalRaisedCents,
          totalDonors: donorCount,
          totalDonations,
          activeCampaigns,
          avgDonationCents,
          recurringDonorCount: recurringCount.length,
          donorRetentionRate: Math.round(donorRetentionRate * 100) / 100,
        },
        dailyTrend,
        campaignBreakdown,
        paymentMethodBreakdown,
      });
    } catch (err) {
      console.error("Error fetching reporting overview:", err);
      return c.json({ error: "Failed to fetch reporting data" }, 500);
    }
  }
);
