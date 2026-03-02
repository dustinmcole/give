"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────

interface DonorTag {
  id: string;
  name: string;
}

interface DonationRecord {
  id: string;
  amountCents: number;
  frequency: string;
  status: string;
  paymentMethod: string | null;
  createdAt: string;
  campaign: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

interface DonorDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  anonymous: boolean;
  totalGivenCents: number;
  donationCount: number;
  avgGiftCents: number;
  givingFrequency: "one-time" | "occasional" | "regular" | "monthly";
  firstDonationAt: string | null;
  lastDonationAt: string | null;
  tags: DonorTag[];
  donations: {
    data: DonationRecord[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
}

// ── Mock Data ─────────────────────────────────────────────

const MOCK_DONORS: Record<string, DonorDetail> = {
  dnr_1: {
    id: "dnr_1",
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.m@example.com",
    phone: "+1 (555) 234-5678",
    anonymous: false,
    totalGivenCents: 1_250_000,
    donationCount: 8,
    avgGiftCents: 156_250,
    givingFrequency: "regular",
    firstDonationAt: "2024-06-15T00:00:00Z",
    lastDonationAt: "2026-02-28T14:23:00Z",
    tags: [
      { id: "tag_1", name: "Major Donor" },
      { id: "tag_2", name: "Monthly" },
    ],
    donations: {
      data: [
        {
          id: "don_1",
          amountCents: 250_000,
          frequency: "ONE_TIME",
          status: "SUCCEEDED",
          paymentMethod: "CARD",
          createdAt: "2026-02-28T14:23:00Z",
          campaign: { id: "camp_1", title: "Annual Fund 2026", slug: "annual-fund-2026" },
        },
        {
          id: "don_2",
          amountCents: 200_000,
          frequency: "ONE_TIME",
          status: "SUCCEEDED",
          paymentMethod: "ACH",
          createdAt: "2026-01-15T10:00:00Z",
          campaign: { id: "camp_1", title: "Annual Fund 2026", slug: "annual-fund-2026" },
        },
        {
          id: "don_3",
          amountCents: 150_000,
          frequency: "MONTHLY",
          status: "SUCCEEDED",
          paymentMethod: "CARD",
          createdAt: "2025-12-01T09:00:00Z",
          campaign: { id: "camp_2", title: "Building Campaign", slug: "building-campaign" },
        },
        {
          id: "don_4",
          amountCents: 100_000,
          frequency: "ONE_TIME",
          status: "SUCCEEDED",
          paymentMethod: "CARD",
          createdAt: "2025-09-15T11:30:00Z",
          campaign: { id: "camp_3", title: "Youth Programs", slug: "youth-programs" },
        },
        {
          id: "don_5",
          amountCents: 200_000,
          frequency: "ONE_TIME",
          status: "SUCCEEDED",
          paymentMethod: "ACH",
          createdAt: "2025-06-01T08:00:00Z",
          campaign: { id: "camp_1", title: "Annual Fund 2026", slug: "annual-fund-2026" },
        },
        {
          id: "don_6",
          amountCents: 100_000,
          frequency: "ONE_TIME",
          status: "SUCCEEDED",
          paymentMethod: "CARD",
          createdAt: "2025-03-10T14:00:00Z",
          campaign: { id: "camp_3", title: "Youth Programs", slug: "youth-programs" },
        },
        {
          id: "don_7",
          amountCents: 150_000,
          frequency: "ONE_TIME",
          status: "SUCCEEDED",
          paymentMethod: "CARD",
          createdAt: "2024-11-20T16:45:00Z",
          campaign: { id: "camp_2", title: "Building Campaign", slug: "building-campaign" },
        },
        {
          id: "don_8",
          amountCents: 100_000,
          frequency: "ONE_TIME",
          status: "SUCCEEDED",
          paymentMethod: "CARD",
          createdAt: "2024-06-15T12:00:00Z",
          campaign: { id: "camp_1", title: "Annual Fund 2026", slug: "annual-fund-2026" },
        },
      ],
      pagination: { page: 1, limit: 20, total: 8, totalPages: 1 },
    },
  },
  dnr_2: {
    id: "dnr_2",
    firstName: "James",
    lastName: "Kim",
    email: "james.kim@example.com",
    phone: null,
    anonymous: false,
    totalGivenCents: 735_000,
    donationCount: 12,
    avgGiftCents: 61_250,
    givingFrequency: "monthly",
    firstDonationAt: "2023-11-01T00:00:00Z",
    lastDonationAt: "2026-02-27T18:45:00Z",
    tags: [
      { id: "tag_3", name: "Monthly" },
      { id: "tag_4", name: "Board" },
    ],
    donations: {
      data: [],
      pagination: { page: 1, limit: 20, total: 12, totalPages: 1 },
    },
  },
};

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

function formatFrequency(freq: string): string {
  const map: Record<string, string> = {
    ONE_TIME: "One-time",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    ANNUAL: "Annual",
  };
  return map[freq] ?? freq;
}

function isRecurring(freq: string): boolean {
  return freq === "MONTHLY" || freq === "QUARTERLY" || freq === "ANNUAL";
}

function RecurringBadge({ frequency }: { frequency: string }) {
  if (!isRecurring(frequency)) return null;
  return (
    <span
      title="Recurring donation"
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 ml-1.5"
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Recurring
    </span>
  );
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

function formatStatus(status: string): { label: string; classes: string } {
  const map: Record<string, { label: string; classes: string }> = {
    SUCCEEDED: { label: "Succeeded", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    PENDING: { label: "Pending", classes: "bg-amber-50 text-amber-700 border-amber-200" },
    PROCESSING: { label: "Processing", classes: "bg-blue-50 text-blue-700 border-blue-200" },
    FAILED: { label: "Failed", classes: "bg-red-50 text-red-700 border-red-200" },
    REFUNDED: { label: "Refunded", classes: "bg-gray-50 text-gray-600 border-gray-200" },
  };
  return map[status] ?? { label: status, classes: "bg-gray-50 text-gray-600 border-gray-200" };
}

function getFrequencyLabel(freq: DonorDetail["givingFrequency"]): string {
  const map = {
    "one-time": "One-time",
    occasional: "Occasional",
    regular: "Regular",
    monthly: "Monthly",
  };
  return map[freq];
}

// ── Add Tag Modal ─────────────────────────────────────────

function AddTagModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    onAdd(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Tag</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Major Donor, Monthly, Board..."
              autoFocus
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark disabled:opacity-50 rounded-lg transition-colors"
            >
              {loading ? "Adding…" : "Add Tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────

export default function DonorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Use mock data for development; replace with API call when wired up
  const [donor, setDonor] = useState<DonorDetail | null>(
    MOCK_DONORS[id] ?? MOCK_DONORS["dnr_1"] ?? null
  );
  const [showAddTag, setShowAddTag] = useState(false);
  const [page, setPage] = useState(1);

  if (!donor) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        Donor not found.
      </div>
    );
  }

  const initials = `${donor.firstName.charAt(0)}${donor.lastName.charAt(0)}`;
  const pagination = donor.donations.pagination;
  const pagedDonations = donor.donations.data.slice((page - 1) * 20, page * 20);

  function handleAddTag(name: string) {
    // Optimistic update; in production POST to /api/donors/:id/tags
    const newTag: DonorTag = { id: `tag_${Date.now()}`, name };
    setDonor((prev) =>
      prev ? { ...prev, tags: [...prev.tags, newTag] } : prev
    );
    setShowAddTag(false);
  }

  function handleRemoveTag(tagId: string) {
    // Optimistic update; in production DELETE /api/donors/:id/tags/:tagId
    setDonor((prev) =>
      prev ? { ...prev, tags: prev.tags.filter((t) => t.id !== tagId) } : prev
    );
  }

  return (
    <div className="space-y-6">
      {showAddTag && (
        <AddTagModal
          onClose={() => setShowAddTag(false)}
          onAdd={handleAddTag}
        />
      )}

      {/* ── Back nav ───────────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/donors"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Donors
        </Link>
      </div>

      {/* ── Header Card ────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-give-primary/10 flex items-center justify-center text-xl font-bold text-give-primary flex-shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {donor.firstName} {donor.lastName}
              </h1>
              {donor.anonymous && (
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  Anonymous
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap gap-4 text-sm text-gray-500">
              <a
                href={`mailto:${donor.email}`}
                className="flex items-center gap-1.5 hover:text-give-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                {donor.email}
              </a>
              {donor.phone && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  {donor.phone}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {donor.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-give-primary/10 text-give-primary"
                >
                  {tag.name}
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-0.5 hover:text-give-primary-dark transition-colors"
                    aria-label={`Remove tag ${tag.name}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={() => setShowAddTag(true)}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-give-primary hover:text-give-primary transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add tag
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col sm:items-end gap-2">
            <a
              href={`mailto:${donor.email}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 hover:border-give-primary hover:text-give-primary px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Send email
            </a>
            <button
              onClick={() => setShowAddTag(true)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 hover:border-give-primary hover:text-give-primary px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
              </svg>
              Add tag
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Given", value: formatCurrency(donor.totalGivenCents) },
          { label: "Donations", value: donor.donationCount.toString() },
          { label: "Avg Gift", value: formatCurrency(donor.avgGiftCents) },
          { label: "First Gift", value: formatDate(donor.firstDonationAt) },
          { label: "Last Gift", value: formatDate(donor.lastDonationAt) },
          { label: "Frequency", value: getFrequencyLabel(donor.givingFrequency) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Giving History Table ────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Giving History
          </h2>
          <span className="text-sm text-gray-400">
            {pagination.total} donation{pagination.total !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-6 font-medium text-gray-500">Date</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Frequency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pagedDonations.length > 0 ? (
                pagedDonations.map((don) => {
                  const status = formatStatus(don.status);
                  return (
                    <tr key={don.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-500">
                        {formatDate(don.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(don.amountCents)}
                      </td>
                      <td className="py-4 px-4">
                        {don.campaign ? (
                          <Link
                            href={`/donate/${don.campaign.id}`}
                            className="text-give-primary hover:underline"
                          >
                            {don.campaign.title}
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        <span className="inline-flex items-center">
                          {formatFrequency(don.frequency)}
                          <RecurringBadge frequency={don.frequency} />
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.classes}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {formatPaymentMethod(don.paymentMethod)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No donation history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Page {page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-300 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
