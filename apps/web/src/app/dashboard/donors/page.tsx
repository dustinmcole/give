"use client";

import { useState } from "react";

// ── Mock Data ─────────────────────────────────────────────
const donors = [
  {
    id: "dnr_1",
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.m@example.com",
    totalGivenCents: 12_500_00,
    donationCount: 8,
    firstDonationAt: "2024-06-15T00:00:00Z",
    lastDonationAt: "2026-02-28T14:23:00Z",
    tags: ["Major Donor", "Monthly"],
  },
  {
    id: "dnr_2",
    firstName: "James",
    lastName: "Kim",
    email: "james.kim@example.com",
    totalGivenCents: 7_350_00,
    donationCount: 12,
    firstDonationAt: "2023-11-01T00:00:00Z",
    lastDonationAt: "2026-02-27T18:45:00Z",
    tags: ["Monthly", "Board"],
  },
  {
    id: "dnr_3",
    firstName: "Maria",
    lastName: "Lopez",
    email: "maria.l@example.com",
    totalGivenCents: 3_200_00,
    donationCount: 5,
    firstDonationAt: "2025-01-10T00:00:00Z",
    lastDonationAt: "2026-02-27T10:30:00Z",
    tags: ["Event Attendee"],
  },
  {
    id: "dnr_4",
    firstName: "David",
    lastName: "Robinson",
    email: "david.r@example.com",
    totalGivenCents: 25_000_00,
    donationCount: 3,
    firstDonationAt: "2025-06-01T00:00:00Z",
    lastDonationAt: "2026-02-26T16:12:00Z",
    tags: ["Major Donor", "Corporate"],
  },
  {
    id: "dnr_5",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@example.com",
    totalGivenCents: 1_800_00,
    donationCount: 15,
    firstDonationAt: "2023-03-22T00:00:00Z",
    lastDonationAt: "2026-02-25T09:00:00Z",
    tags: ["Monthly", "Volunteer"],
  },
  {
    id: "dnr_6",
    firstName: "Michael",
    lastName: "O'Brien",
    email: "michael.ob@example.com",
    totalGivenCents: 5_000_00,
    donationCount: 2,
    firstDonationAt: "2025-12-01T00:00:00Z",
    lastDonationAt: "2026-01-15T11:20:00Z",
    tags: ["Year-End"],
  },
  {
    id: "dnr_7",
    firstName: "Aisha",
    lastName: "Patel",
    email: "aisha.p@example.com",
    totalGivenCents: 9_750_00,
    donationCount: 6,
    firstDonationAt: "2024-09-10T00:00:00Z",
    lastDonationAt: "2026-02-20T15:30:00Z",
    tags: ["Major Donor"],
  },
];

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

export default function DonorsPage() {
  const [search, setSearch] = useState("");

  const filtered = donors.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.firstName.toLowerCase().includes(q) ||
      d.lastName.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
          <p className="mt-1 text-sm text-gray-500">
            {donors.length} donors in your organization.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
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
            placeholder="Search by name, email, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
          />
        </div>
      </div>

      {/* ── Donor Table ────────────────────────────────── */}
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
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Total Given
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Donations
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  First Gift
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Last Gift
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-500">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-give-primary/10 flex items-center justify-center text-xs font-bold text-give-primary flex-shrink-0">
                        {d.firstName.charAt(0)}
                        {d.lastName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {d.firstName} {d.lastName}
                      </span>
                    </div>
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400"
                  >
                    No donors match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
