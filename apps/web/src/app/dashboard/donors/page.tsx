"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { listDonors, exportDonorsCsvUrl } from "@/lib/api";
import type { Donor, DonorListMeta } from "@/lib/api";
import { useCurrentOrg } from "@/hooks/useCurrentOrg";

// ── Helpers ───────────────────────────────────────────────

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

// ── Types ─────────────────────────────────────────────────

type SortField = "totalGivenCents" | "lastDonationAt" | "donationCount" | "firstDonationAt";
type SortOrder = "asc" | "desc";
type FrequencyFilter = "" | "one_time" | "recurring";

// ── Sort header ───────────────────────────────────────────

interface SortHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
  onSort: (field: SortField) => void;
  align?: "left" | "right";
}

function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
  align = "left",
}: SortHeaderProps): React.ReactElement {
  const active = currentSort === field;
  return (
    <th
      className={`py-3 px-4 font-medium text-gray-500 cursor-pointer select-none hover:text-gray-700 transition-colors ${
        align === "right" ? "text-right" : "text-left"
      }`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`text-xs ${active ? "text-give-primary" : "text-gray-300"}`}>
          {active ? (currentOrder === "desc" ? "↓" : "↑") : "↕"}
        </span>
      </span>
    </th>
  );
}

// ── Skeleton ──────────────────────────────────────────────

function DonorRowSkeleton(): React.ReactElement {
  return (
    <tr className="animate-pulse border-b border-gray-50 last:border-0">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="h-4 bg-gray-100 rounded w-32" />
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-gray-100 rounded w-40" />
      </td>
      <td className="py-4 px-4 text-right">
        <div className="h-4 bg-gray-100 rounded w-16 ml-auto" />
      </td>
      <td className="py-4 px-4 text-right">
        <div className="h-4 bg-gray-100 rounded w-8 ml-auto" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
      </td>
      <td className="py-4 px-6">
        <div className="h-5 bg-gray-100 rounded-full w-20" />
      </td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────

export default function DonorsPage(): React.ReactElement {
  const { orgId, loading: orgLoading, error: orgError } = useCurrentOrg();
  const { getToken } = useAuth();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [meta, setMeta] = useState<DonorListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("lastDonationAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [frequency, setFrequency] = useState<FrequencyFilter>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortOrder, frequency, startDate, endDate]);

  const fetchDonors = useCallback(async (): Promise<void> => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await listDonors(orgId, getToken, {
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
        frequency: frequency || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      setDonors(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load donors");
    } finally {
      setLoading(false);
    }
  }, [orgId, getToken, page, debouncedSearch, sortBy, sortOrder, frequency, startDate, endDate]);

  useEffect(() => {
    void fetchDonors();
  }, [fetchDonors]);

  function handleSort(field: SortField): void {
    if (sortBy === field) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }

  function handleExportCsv(): void {
    if (!orgId) return;
    const url = exportDonorsCsvUrl(orgId, {
      search: debouncedSearch || undefined,
      frequency: frequency || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    });
    window.open(url, "_blank");
  }

  const isLoading = orgLoading || loading;

  if (orgError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        Error loading organization: {orgError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading
              ? "Loading donors\u2026"
              : meta
              ? `${meta.total.toLocaleString()} donor${meta.total === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={!orgId}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email\u2026"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
          />
        </div>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as FrequencyFilter)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-give-primary bg-white transition-all"
        >
          <option value="">All donors</option>
          <option value="recurring">Recurring</option>
          <option value="one_time">One-time</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          title="From date"
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-give-primary bg-white transition-all"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          title="To date"
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-give-primary bg-white transition-all"
        />
      </div>

      {/* ── Error ──────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── Table ──────────────────────────────────────── */}
      {!error && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-6 font-medium text-gray-500">
                    Donor
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Email
                  </th>
                  <SortHeader
                    label="Total Given"
                    field="totalGivenCents"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortHeader
                    label="Gifts"
                    field="donationCount"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortHeader
                    label="First Gift"
                    field="firstDonationAt"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="Last Gift"
                    field="lastDonationAt"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="text-left py-3 px-6 font-medium text-gray-500">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <DonorRowSkeleton key={i} />
                    ))
                  : donors.map((d) => (
                      <tr
                        key={d.id}
                        className="hover:bg-gray-50/60 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <Link
                            href={`/dashboard/donors/${d.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-give-primary/10 flex items-center justify-center text-xs font-bold text-give-primary flex-shrink-0">
                              {d.firstName.charAt(0)}
                              {d.lastName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-give-primary transition-colors">
                              {d.firstName} {d.lastName}
                            </span>
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-gray-500">{d.email}</td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-900">
                          {formatCurrency(d.totalGivenCents)}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600">
                          {d.donationCount}
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {formatDate(d.firstDonationAt)}
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {formatDate(d.lastDonationAt)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {d.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                {!isLoading && donors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <p className="text-gray-500 text-sm font-medium">
                        No donors found
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Try adjusting your filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
              <p className="text-sm text-gray-500">
                {(meta.page - 1) * meta.limit + 1}&ndash;
                {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                {meta.total.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  {meta.page} / {meta.totalPages}
                </span>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
