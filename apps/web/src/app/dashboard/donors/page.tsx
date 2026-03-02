"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { listDonors } from "@/lib/api";
import type { Donor } from "@/lib/api";
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

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Skeleton ─────────────────────────────────────────────

function DonorRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-50 last:border-0">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="h-4 bg-gray-100 rounded w-32" />
        </div>
      </td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
      <td className="py-4 px-4 text-right"><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
      <td className="py-4 px-4 text-right"><div className="h-4 bg-gray-100 rounded w-8 ml-auto" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
      <td className="py-4 px-6"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
    </tr>
  );
}

// ─── Page Component ───────────────────────────────────────

export default function DonorsPage() {
  const { orgId, loading: orgLoading, error: orgError } = useCurrentOrg();
  const { getToken } = useAuth();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [donorsError, setDonorsError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!orgId) return;
    setDonorsLoading(true);
    setDonorsError(null);

    listDonors(orgId, getToken)
      .then((data) => setDonors(data))
      .catch((err: unknown) => {
        setDonorsError(err instanceof Error ? err.message : "Failed to load donors");
      })
      .finally(() => setDonorsLoading(false));
  }, [orgId]);

  const loading = orgLoading || donorsLoading;

  const filtered = donors.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.firstName.toLowerCase().includes(q) ||
      d.lastName.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const hasNoDonors = !loading && donors.length === 0 && !donorsError;
  const hasNoResults = !loading && donors.length > 0 && filtered.length === 0;

  if (orgError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        Error loading organization: {orgError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading
              ? "Loading donors\u2026"
              : `${donors.length} donor${donors.length === 1 ? "" : "s"} in your organization.`}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
          />
        </div>
      </div>

      {/* ── Error ────────────────────────────────────── */}
      {donorsError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Error loading donors: {donorsError}
        </div>
      )}

      {/* ── Empty State ──────────────────────────────── */}
      {hasNoDonors && (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
          <p className="text-gray-900 font-semibold mb-1">No donors yet</p>
          <p className="text-gray-500 text-sm">Share your campaign to start receiving donations.</p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────── */}
      {(loading || donors.length > 0) && !donorsError && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Donor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Total Given</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Donations</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">First Gift</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Last Gift</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <DonorRowSkeleton key={i} />)
                  : filtered.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-give-primary/10 flex items-center justify-center text-xs font-bold text-give-primary flex-shrink-0">
                              {d.firstName.charAt(0)}{d.lastName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{d.firstName} {d.lastName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-500">{d.email}</td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatCurrency(d.totalGivenCents)}</td>
                        <td className="py-4 px-4 text-right text-gray-600">{d.donationCount}</td>
                        <td className="py-4 px-4 text-gray-400">{formatDate(d.firstDonationAt)}</td>
                        <td className="py-4 px-4 text-gray-400">{formatDate(d.lastDonationAt)}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {d.tags.map((tag) => (
                              <span key={tag} className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                {hasNoResults && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      No donors match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
