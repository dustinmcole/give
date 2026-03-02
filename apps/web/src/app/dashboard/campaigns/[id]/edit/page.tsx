"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCampaign, updateCampaign } from "@/lib/api";
import type { Campaign, UpdateCampaignInput } from "@/lib/api";

// ── Helpers ───────────────────────────────────────────────

// Mock campaigns for development fallback (same as detail page)
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
  {
    id: "camp_3",
    orgId: "org_1",
    title: "Youth Programs",
    slug: "youth-programs",
    description: "Supporting after-school and summer youth programming.",
    type: "donation",
    status: "active",
    goalCents: 75_000_00,
    raisedCents: 52_100_00,
    donationCount: 104,
    currency: "usd",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-28T00:00:00Z",
  },
  {
    id: "camp_4",
    orgId: "org_1",
    title: "Gala 2026",
    slug: "gala-2026",
    description: "Annual gala fundraiser event.",
    type: "event",
    status: "draft",
    goalCents: 200_000_00,
    raisedCents: 0,
    donationCount: 0,
    currency: "usd",
    createdAt: "2026-02-20T00:00:00Z",
    updatedAt: "2026-02-20T00:00:00Z",
  },
  {
    id: "camp_5",
    orgId: "org_1",
    title: "End-of-Year Appeal 2025",
    slug: "end-of-year-appeal-2025",
    description: "Year-end giving campaign for tax-deductible donations.",
    type: "donation",
    status: "ended",
    goalCents: 150_000_00,
    raisedCents: 163_200_00,
    donationCount: 241,
    currency: "usd",
    createdAt: "2025-10-15T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "camp_6",
    orgId: "org_1",
    title: "Spring Walkathon",
    slug: "spring-walkathon",
    description: "Community walkathon to raise funds for local parks.",
    type: "peer_to_peer",
    status: "paused",
    goalCents: 50_000_00,
    raisedCents: 18_750_00,
    donationCount: 34,
    currency: "usd",
    createdAt: "2026-02-10T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z",
  },
];

// ── Form State ────────────────────────────────────────────

interface FormState {
  title: string;
  slug: string;
  description: string;
  type: Campaign["type"];
  status: Campaign["status"];
  goalDollars: string; // human-readable dollars
  coverImageUrl: string;
}

function campaignToForm(c: Campaign): FormState {
  return {
    title: c.title,
    slug: c.slug,
    description: c.description ?? "",
    type: c.type,
    status: c.status,
    goalDollars: c.goalCents > 0 ? String(Math.round(c.goalCents / 100)) : "",
    coverImageUrl: c.coverImageUrl ?? "",
  };
}

// ── Page Component ────────────────────────────────────────

export default function CampaignEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Load campaign ───────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const data = await getCampaign(id);
        setCampaign(data);
        setForm(campaignToForm(data));
      } catch {
        // Fall back to mock data for development
        const mock = MOCK_CAMPAIGNS.find((c) => c.id === id);
        if (mock) {
          setCampaign(mock);
          setForm(campaignToForm(mock));
        } else {
          setLoadError("Campaign not found.");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ── Handlers ────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setSaveError(null);

    const goalCents = form.goalDollars
      ? Math.round(parseFloat(form.goalDollars) * 100)
      : null;

    const payload: UpdateCampaignInput = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      status: form.status,
      goalAmountCents: goalCents ?? undefined,
      coverImageUrl: form.coverImageUrl.trim() || null,
    };

    try {
      await updateCampaign(id, payload);
      router.push(`/dashboard/campaigns/${id}`);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save campaign. Please try again."
      );
      setSaving(false);
    }
  }

  // ── Render ───────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-give-primary border-t-transparent" />
      </div>
    );
  }

  if (loadError || !campaign || !form) {
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
          {loadError ?? "Campaign not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Breadcrumb ─────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/campaigns" className="hover:text-gray-700 transition-colors">
          Campaigns
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link
          href={`/dashboard/campaigns/${id}`}
          className="hover:text-gray-700 transition-colors truncate"
        >
          {campaign.title}
        </Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      {/* ── Header ────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Campaign</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the details for &ldquo;{campaign.title}&rdquo;.
        </p>
      </div>

      {/* ── Form ──────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
              placeholder="e.g. Annual Fund 2026"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1.5">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={form.slug}
              onChange={handleChange}
              pattern="^[a-z0-9][a-z0-9-]*[a-z0-9]$"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
              placeholder="e.g. annual-fund-2026"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all resize-none"
              placeholder="Describe your campaign and what funds will support..."
            />
          </div>

          {/* Type + Status (2-col) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all bg-white"
              >
                <option value="donation">Donation</option>
                <option value="peer_to_peer">Peer-to-Peer</option>
                <option value="event">Event</option>
                <option value="membership">Membership</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          {/* Goal Amount */}
          <div>
            <label htmlFor="goalDollars" className="block text-sm font-medium text-gray-700 mb-1.5">
              Fundraising Goal (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                $
              </span>
              <input
                id="goalDollars"
                name="goalDollars"
                type="number"
                min="1"
                step="1"
                value={form.goalDollars}
                onChange={handleChange}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
                placeholder="50000"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Leave blank for no goal / open-ended campaign.
            </p>
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Image URL
            </label>
            <input
              id="coverImageUrl"
              name="coverImageUrl"
              type="url"
              value={form.coverImageUrl}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* ── Save Error ─────────────────────────────── */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">
            {saveError}
          </div>
        )}

        {/* ── Actions ───────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/dashboard/campaigns/${id}`}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
