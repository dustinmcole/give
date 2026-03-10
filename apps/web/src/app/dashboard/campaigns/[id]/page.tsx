"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { getCampaign, listDonations } from "@/lib/api";
import type { Campaign, Donation, DonationListItem } from "@/lib/api";
import GoalThermometer from "@/components/GoalThermometer";
import CampaignQRCode from "@/components/CampaignQRCode";

// ─── Helpers ──────────────────────────────────────────────

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function statusColor(status: Campaign["status"]): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    case "paused":
      return "bg-yellow-100 text-yellow-700";
    case "ended":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function friendlyFreq(freq: string): string {
  const map: Record<string, string> = {
    ONE_TIME: "One-time",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    ANNUAL: "Annual",
  };
  return map[freq] ?? freq;
}

// ─── Stat Card ────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function CampaignDetailPage() {
  const params = useParams();
  const { getToken, orgId } = useAuth();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<DonationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [donationPageUrl, setDonationPageUrl] = useState(`/donate/${id}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDonationPageUrl(`${window.location.origin}/donate/${id}`);
    }
  }, [id]);

  const load = useCallback(async () => {
    try {
      const [campaignData, donationRes] = await Promise.all([
        getCampaign(id),
        orgId
          ? listDonations(orgId, getToken, { campaignId: id, limit: 10 })
          : Promise.resolve({ data: [] as DonationListItem[], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
      ]);
      setCampaign(campaignData);
      setDonations(donationRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaign.");
    } finally {
      setLoading(false);
    }
  }, [id, orgId, getToken]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Loading ────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-give-primary border-t-transparent" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────

  if (error || !campaign) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Campaigns
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4">
          {error ?? "Campaign not found."}
        </div>
      </div>
    );
  }

  // ── Computed stats ────────────────────────────────────

  const avgDonationCents =
    campaign.donationCount > 0
      ? Math.round(campaign.raisedCents / campaign.donationCount)
      : 0;

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ───────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/campaigns" className="hover:text-gray-700 transition-colors">
          Campaigns
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate">{campaign.title}</span>
      </div>

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{campaign.title}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor(campaign.status)}`}
            >
              {campaign.status}
            </span>
          </div>
          {campaign.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{campaign.description}</p>
          )}
        </div>
        <Link
          href={`/dashboard/campaigns/${id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Campaign
        </Link>
      </div>

      {/* ── Stats Row ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Raised"
          value={formatCents(campaign.raisedCents)}
          sub={campaign.goalCents ? `of ${formatCents(campaign.goalCents)} goal` : undefined}
        />
        <StatCard
          label="Donors"
          value={campaign.donationCount.toLocaleString()}
          sub="total donations"
        />
        <StatCard
          label="Avg Donation"
          value={avgDonationCents > 0 ? formatCents(avgDonationCents) : "—"}
        />
        <StatCard
          label="Status"
          value={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        />
      </div>

      {/* ── Goal Thermometer ─────────────────────────── */}
      {campaign.goalCents > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Fundraising Progress</h2>
          <GoalThermometer
            raisedCents={campaign.raisedCents}
            goalCents={campaign.goalCents}
          />
        </div>
      )}

      {/* ── Main Grid ────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Recent Donations ───────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Donations</h2>
            <Link
              href="/dashboard/donations"
              className="text-xs text-give-primary hover:underline font-medium"
            >
              View all
            </Link>
          </div>

          {donations.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">
              No donations yet for this campaign.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 text-gray-900">
                        {d.donor?.anonymous ? (
                          <span className="text-gray-400 italic">Anonymous</span>
                        ) : (
                          d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : 'Unknown'
                        )}
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">
                        {formatCents(d.amountCents)}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {friendlyFreq(d.frequency)}
                      </td>
                      <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Right Column ───────────────────────────── */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-600">Donation Link</p>
                  <p className="text-xs text-gray-400 truncate">{donationPageUrl}</p>
                </div>
                <CopyButton value={donationPageUrl} label="Copy" />
              </div>

              <a
                href={donationPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-give-primary border border-give-primary/20 hover:bg-give-primary/5 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Public Page
              </a>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">QR Code</h2>
            <CampaignQRCode url={donationPageUrl} campaignSlug={campaign.slug} />
          </div>

          {/* Embed Code */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Embed Code</h2>
            <code className="block bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono break-all select-all leading-relaxed">
              {`<iframe src="${donationPageUrl}" width="100%" height="700" frameborder="0"></iframe>`}
            </code>
            <CopyButton
              value={`<iframe src="${donationPageUrl}" width="100%" height="700" frameborder="0"></iframe>`}
              label="Copy Embed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
