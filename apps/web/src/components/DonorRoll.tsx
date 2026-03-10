"use client";

import { RecentDonor } from "@/lib/api";

interface DonorRollProps {
  donors: RecentDonor[];
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function initials(donor: RecentDonor): string {
  if (donor.anonymous) return "A";
  return (donor.firstName[0] ?? "") + (donor.lastName[0] ?? "");
}

function displayName(donor: RecentDonor): string {
  if (donor.anonymous) return "Anonymous";
  return `${donor.firstName} ${donor.lastName}`.trim();
}

export default function DonorRoll({ donors }: DonorRollProps) {
  if (donors.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 rounded-full bg-give-primary/10 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-give-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700">Be the first to donate!</p>
        <p className="text-xs text-gray-400 mt-1">Your generosity starts a movement.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-50">
      {donors.map((donor, i) => (
        <li key={i} className="flex items-center gap-3 py-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-give-primary/80 to-give-accent/80 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-white uppercase">
              {initials(donor)}
            </span>
          </div>
          {/* Name + time */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName(donor)}
            </p>
            <p className="text-xs text-gray-400">{timeAgo(donor.createdAt)}</p>
          </div>
          {/* Amount */}
          <span className="text-sm font-semibold text-give-primary flex-shrink-0">
            {formatCurrency(donor.amountCents)}
          </span>
        </li>
      ))}
    </ul>
  );
}
