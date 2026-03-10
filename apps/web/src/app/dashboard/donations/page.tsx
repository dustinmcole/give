"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { listDonations, listCampaigns } from "@/lib/api";
import type { DonationListItem, Campaign } from "@/lib/api";
import { useCurrentOrg } from "@/hooks/useCurrentOrg";

// ── Helpers ───────────────────────────────────────────────

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPaymentMethod(method: string | null): string {
  if (!method) return "—";
  const map: Record<string, string> = {
    CARD: "Card",
    ACH: "ACH",
    APPLE_PAY: "Apple Pay",
    GOOGLE_PAY: "Google Pay",
  };
  return map[method] ?? method;
}

function formatFrequency(freq: string): string {
  const map: Record<string, string> = {
    ONE_TIME: "One-time",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    ANNUAL: "Annual",
  };
  return map[freq] ?? freq;
}

// ── Status badge ──────────────────────────────────────────

function StatusBadge({ status }: { status: string }): React.ReactElement {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-50 text-green-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    PENDING: "bg-yellow-50 text-yellow-700",
    FAILED: "bg-red-50 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-600",
  };
  const label: Record<string, string> = {
    COMPLETED: "Completed",
    PROCESSING: "Processing",
    PENDING: "Pending",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };
  const cls = styles[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label[status] ?? status}
    </span>
  );
}

// ── Types ─────────────────────────────────────────────────

type SortField = "createdAt" | "amountCents" | "status";
type SortOrder = "asc" | "desc";

// ── Sort header ───────────────────────────────────────────

interface SortHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
  onSort: (field: SortField) => void;
  align?: "left" | "right";
}

function SortHeader({ label, field, currentSort, currentOrder, onSort, align = "left" }: SortHeaderProps): React.ReactElement {
  const active = currentSort === field;
  return (
    <th
      className={`py-3 px-4 font-medium text-gray-500 cursor-pointer select-none hover:text-gray-700 transition-colors ${align === "right" ? "text-right" : "text-left"}`}
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

// ── Skeleton row ──────────────────────────────────────────

function RowSkeleton(): React.ReactElement {
  return (
    <tr className="animate-pulse border-b border-gray-50 last:border-0">
      <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-32" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
      <td className="py-4 px-4 text-right"><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
      <td className="py-4 px-4"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
    </tr>
  );
}

// ── Slide-over detail panel ───────────────────────────────

interface DetailPanelProps {
  donation: DonationListItem | null;
  onClose: () => void;
}

function DetailPanel({ donation, onClose }: DetailPanelProps): React.ReactElement | null {
  if (!donation) return null;

  const donorName = donation.donor
    ? `${donation.donor.firstName} ${donation.donor.lastName}`
    : "Anonymous";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Donation Detail</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Amount */}
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(donation.amountCents)}</p>
            <p className="text-sm text-gray-500 mt-1">{formatFrequency(donation.frequency)}</p>
            <div className="mt-2 flex justify-center">
              <StatusBadge status={donation.status} />
            </div>
          </div>

          {/* Details */}
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Donor</dt>
              <dd className="font-medium text-gray-900">{donorName}</dd>
            </div>
            {donation.donor && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-700">{donation.donor.email}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Campaign</dt>
              <dd className="text-gray-700">{donation.campaign?.title ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Payment method</dt>
              <dd className="text-gray-700">{formatPaymentMethod(donation.paymentMethod)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total charged</dt>
              <dd className="text-gray-700">{formatCurrency(donation.totalChargedCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Cover fees</dt>
              <dd className="text-gray-700">{donation.coverFees ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Date</dt>
              <dd className="text-gray-700">{formatDate(donation.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">ID</dt>
              <dd className="font-mono text-xs text-gray-400">{donation.id}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────

export default function DonationsPage(): React.ReactElement {
  const { orgId, loading: orgLoading, error: orgError } = useCurrentOrg();
  const { getToken } = useAuth();

  const [donations, setDonations] = useState<DonationListItem[]>([]);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);

  const [selectedDonation, setSelectedDonation] = useState<DonationListItem | null>(null);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, campaignFilter, startDate, endDate, sortBy, sortOrder]);

  // load campaigns for filter dropdown
  useEffect(() => {
    if (!orgId) return;
    listCampaigns(orgId, getToken)
      .then(setCampaigns)
      .catch(() => {/* non-critical */});
  }, [orgId, getToken]);

  const fetchDonations = useCallback(async (): Promise<void> => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await listDonations(orgId, getToken, {
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        campaignId: campaignFilter || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        sortBy,
        sortOrder,
      });
      setDonations(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }, [orgId, getToken, page, debouncedSearch, statusFilter, campaignFilter, startDate, endDate, sortBy, sortOrder]);

  useEffect(() => {
    void fetchDonations();
  }, [fetchDonations]);

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
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const params = new URLSearchParams({ orgId });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (statusFilter) params.set("status", statusFilter);
    if (campaignFilter) params.set("campaignId", campaignFilter);
    if (startDate) params.set("startDate", new Date(startDate).toISOString());
    if (endDate) params.set("endDate", new Date(endDate).toISOString());
    params.set("format", "csv");
    params.set("limit", "10000");

    // Build CSV client-side from current data (API CSV export endpoint optional)
    const headers = ["Donor Name", "Email", "Amount", "Campaign", "Status", "Payment Method", "Date"];
    const rows = donations.map((d) => [
      d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : "Anonymous",
      d.donor?.email ?? "",
      formatCurrency(d.amountCents),
      d.campaign?.title ?? "",
      d.status,
      formatPaymentMethod(d.paymentMethod),
      formatDate(d.createdAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading
              ? "Loading donations…"
              : pagination
              ? `${pagination.total.toLocaleString()} donation${pagination.total === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={!orgId || donations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-give-primary bg-white transition-all"
        >
          <option value="">All statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Processing</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        {campaigns.length > 0 && (
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-give-primary bg-white transition-all"
          >
            <option value="">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
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
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Donor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <SortHeader label="Amount" field="amountCents" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSort} align="right" />
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Campaign</th>
                  <SortHeader label="Status" field="status" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                  <SortHeader label="Date" field="createdAt" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                  : donations.map((d) => {
                      const donorName = d.donor
                        ? `${d.donor.firstName} ${d.donor.lastName}`
                        : "Anonymous";
                      return (
                        <tr
                          key={d.id}
                          className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                          onClick={() => setSelectedDonation(d)}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {d.donor && (
                                <div className="w-8 h-8 rounded-full bg-give-primary/10 flex items-center justify-center text-xs font-bold text-give-primary flex-shrink-0">
                                  {d.donor.firstName.charAt(0)}{d.donor.lastName.charAt(0)}
                                </div>
                              )}
                              <span className="font-medium text-gray-900">{donorName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-500">{d.donor?.email ?? "—"}</td>
                          <td className="py-4 px-4 text-right font-semibold text-gray-900">
                            {formatCurrency(d.amountCents)}
                          </td>
                          <td className="py-4 px-4 text-gray-600">{d.campaign?.title ?? "—"}</td>
                          <td className="py-4 px-4"><StatusBadge status={d.status} /></td>
                          <td className="py-4 px-4 text-gray-500">{formatPaymentMethod(d.paymentMethod)}</td>
                          <td className="py-4 px-4 text-gray-400">{formatDate(d.createdAt)}</td>
                        </tr>
                      );
                    })}
                {!isLoading && donations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-sm font-medium">No donations found</p>
                      <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
              <p className="text-sm text-gray-500">
                {(pagination.page - 1) * pagination.limit + 1}&ndash;
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total.toLocaleString()}
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
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
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

      {/* ── Detail slide-over ──────────────────────────── */}
      <DetailPanel donation={selectedDonation} onClose={() => setSelectedDonation(null)} />
    </div>
  );
}
