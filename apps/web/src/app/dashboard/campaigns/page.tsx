"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { listCampaigns } from "@/lib/api";
import type { Campaign } from "@/lib/api";
import { useCurrentOrg } from "@/hooks/useCurrentOrg";

// ─── Helpers ──────────────────────────────────────────────

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  active: {
    label: "Active",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  draft: {
    label: "Draft",
    classes: "bg-gray-50 text-gray-600 border-gray-200",
  },
  paused: {
    label: "Paused",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  ended: {
    label: "Ended",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

// ─── Skeleton ─────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-50 last:border-0">
      <td className="py-4 px-6">
        <div className="h-4 bg-gray-100 rounded w-40" />
      </td>
      <td className="py-4 px-4">
        <div className="h-5 bg-gray-100 rounded-full w-16" />
      </td>
      <td className="py-4 px-4">
        <div className="h-2 bg-gray-100 rounded-full w-full max-w-[180px]" />
      </td>
      <td className="py-4 px-4 text-right">
        <div className="h-4 bg-gray-100 rounded w-10 ml-auto" />
      </td>
      <td className="py-4 px-6 text-right">
        <div className="h-4 bg-gray-100 rounded w-24 ml-auto" />
      </td>
    </tr>
  );
}

// ─── Page Component ───────────────────────────────────────

export default function CampaignsPage() {
  const { getToken } = useAuth();
  const { orgId, loading: orgLoading, error: orgError } = useCurrentOrg();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    setCampaignsLoading(true);
    setCampaignsError(null);

    listCampaigns(orgId, getToken)
      .then((data) => {
        setCampaigns(data);
      })
      .catch((err: unknown) => {
        setCampaignsError(
          err instanceof Error ? err.message : "Failed to load campaigns"
        );
      })
      .finally(() => {
        setCampaignsLoading(false);
      });
  }, [orgId, getToken]);

  const loading = orgLoading || campaignsLoading;
  const hasNoCampaigns = !loading && campaigns.length === 0 && !campaignsError;

  if (orgError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        Error loading organization: {orgError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your fundraising campaigns.
          </p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-5 py-2.5 rounded-lg"
        >
          Create Campaign
        </Link>
      </div>

      {/* ── Error State ─────────────────────────────────── */}
      {campaignsError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Error loading campaigns: {campaignsError}
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────── */}
      {hasNoCampaigns && (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-give-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-give-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-1">No campaigns yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Create your first campaign to start fundraising.
          </p>
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-give-primary text-white text-sm font-semibold hover:bg-give-primary-dark transition-colors"
          >
            Create Campaign
          </Link>
        </div>
      )}

      {/* ── Campaign Table ─────────────────────────────── */}
      {(loading || campaigns.length > 0) && !campaignsError && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-6 font-medium text-gray-500">
                    Campaign
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Progress
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">
                    Donations
                  </th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} />)
                  : campaigns.map((c) => {
                      const pct =
                        c.goalCents > 0
                          ? Math.min((c.raisedCents / c.goalCents) * 100, 100)
                          : 0;
                      const statusStyle =
                        STATUS_STYLES[c.status] ?? STATUS_STYLES["draft"]!;

                      return (
                        <tr
                          key={c.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <Link
                              href={`/donate/${c.id}`}
                              className="font-medium text-gray-900 hover:text-give-primary transition-colors"
                            >
                              {c.title}
                            </Link>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusStyle.classes}`}
                            >
                              {statusStyle.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="min-w-[180px]">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>{formatCurrency(c.raisedCents)}</span>
                                <span>{formatCurrency(c.goalCents)}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-give-primary transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {pct.toFixed(0)}%
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            {c.donationCount.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-right text-gray-400">
                            {formatDate(c.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
