"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCampaign } from "@/lib/api";
import type { Campaign } from "@/lib/api";
import EmbedCodePanel from "@/components/EmbedCodePanel";

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
    month: "long",
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

// Mock campaigns (same set as edit page, for dev fallback)
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_1",
    orgId: "org_1",
    title: "Annual Fund 2026",
    slug: "annual-fund-2026",
    description: "Our flagship annual fundraising campaign supporting all programs.",
    type: "donation",
    status: "active",
    goalCents: 500_000_00,
    raisedCents: 324_850_00,
    donationCount: 189,
    currency: "usd",
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-02-28T00:00:00Z",
    org: { id: "org_1", name: "Example Nonprofit", slug: "example-nonprofit" },
  },
  {
    id: "camp_2",
    orgId: "org_1",
    title: "Building Campaign",
    slug: "building-campaign",
    description: "Funds to renovate and expand our community center.",
    type: "donation",
    status: "active",
    goalCents: 1_000_000_00,
    raisedCents: 412_300_00,
    donationCount: 67,
    currency: "usd",
    createdAt: "2025-11-01T00:00:00Z",
    updatedAt: "2026-02-28T00:00:00Z",
  },
];

// ─── Tabs ─────────────────────────────────────────────────

type Tab = "overview" | "embed";

// ─── Page ─────────────────────────────────────────────────

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    async function load() {
      try {
        const data = await getCampaign(id);
        setCampaign(data);
      } catch {
        const mock = MOCK_CAMPAIGNS.find((c) => c.id === id);
        if (mock) {
          setCampaign(mock);
        } else {
          setError("Campaign not found.");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-give-primary border-t-transparent" />
      </div>
    );
  }

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

  const pct =
    campaign.goalCents > 0
      ? Math.min((campaign.raisedCents / campaign.goalCents) * 100, 100)
      : 0;
  const statusStyle = STATUS_STYLES[campaign.status] ?? STATUS_STYLES["draft"]!;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ─────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/campaigns" className="hover:text-gray-700 transition-colors">
          Campaigns
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate">{campaign.title}</span>
      </div>

      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {campaign.title}
            </h1>
            <span
              className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusStyle.classes}`}
            >
              {statusStyle.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(campaign.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/donate/${campaign.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View
          </Link>
          <Link
            href={`/dashboard/campaigns/${id}/edit`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-4 py-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Raised", value: formatCurrency(campaign.raisedCents) },
          { label: "Goal", value: campaign.goalCents > 0 ? formatCurrency(campaign.goalCents) : "—" },
          { label: "Donations", value: campaign.donationCount.toLocaleString() },
          { label: "Progress", value: campaign.goalCents > 0 ? `${pct.toFixed(0)}%` : "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 px-5 py-4"
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ──────────────────────────────────────── */}
      <div className="border-b border-gray-100">
        <nav className="flex gap-1">
          {(
            [
              { id: "overview" as const, label: "Overview" },
              {
                id: "embed" as const,
                label: (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Embed
                  </span>
                ),
              },
            ] as { id: Tab; label: React.ReactNode }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-give-primary text-give-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Overview tab ──────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Type</dt>
                <dd className="mt-0.5 text-gray-900 capitalize">
                  {campaign.type.replace(/_/g, " ")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Currency</dt>
                <dd className="mt-0.5 text-gray-900 uppercase">{campaign.currency}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Slug</dt>
                <dd className="mt-0.5 text-gray-900 font-mono">{campaign.slug}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Last updated</dt>
                <dd className="mt-0.5 text-gray-900">{formatDate(campaign.updatedAt)}</dd>
              </div>
              {campaign.description && (
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-500">Description</dt>
                  <dd className="mt-0.5 text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {campaign.description}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Progress bar */}
          {campaign.goalCents > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Fundraising Progress</h2>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{formatCurrency(campaign.raisedCents)} raised</span>
                <span className="text-gray-400">{pct.toFixed(1)}% of {formatCurrency(campaign.goalCents)}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-give-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Embed tab ─────────────────────────────────── */}
      {activeTab === "embed" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">
              Embed this campaign
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a donation form to any website. Choose your preferred embed
              method below.
            </p>
          </div>
          <EmbedCodePanel campaignId={campaign.id} />
        </div>
      )}
    </div>
  );
}
