"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { DonationTrendChart } from "@/components/DonationTrendChart";
import {
  getReportingOverview,
  type ReportingOverview,
} from "@/lib/api";

const DEMO_ORG_ID = process.env.NEXT_PUBLIC_DEMO_ORG_ID ?? "";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatPct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="w-10 h-10 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-7 w-28 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-20 bg-gray-100 rounded" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
      <div className="h-4 w-40 bg-gray-100 rounded mb-6" />
      <div className="h-[220px] bg-gray-50 rounded" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-give-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">No donations yet</h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        Once your first donation comes in, you&apos;ll see trends and analytics here.
      </p>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, color, bg, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-gray-400">{sub}</div>
    </div>
  );
}

interface CampaignBarProps {
  title: string;
  raisedCents: number;
  count: number;
  maxCents: number;
}

function CampaignBar({ title, raisedCents, count, maxCents }: CampaignBarProps) {
  const pct = maxCents > 0 ? (raisedCents / maxCents) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-800 truncate">{title}</span>
          <span className="text-sm font-semibold text-gray-900 ml-2 flex-shrink-0">
            {formatCurrency(raisedCents)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-give-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0 w-16 text-right">
            {count} gift{count !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { getToken } = useAuth();
  const [data, setData] = useState<ReportingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!DEMO_ORG_ID) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) { setError("Not authenticated"); return; }
        const overview = await getReportingOverview({ orgId: DEMO_ORG_ID, token });
        if (!cancelled) setData(overview);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [getToken]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back. Here&apos;s how your fundraising is doing.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div><h1 className="text-2xl font-bold text-gray-900">Overview</h1></div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          Failed to load dashboard data: {error}
        </div>
      </div>
    );
  }

  if (!DEMO_ORG_ID || !data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back. Here&apos;s how your fundraising is doing.</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  const { summary, dailyTrend, campaignBreakdown } = data;
  const hasData = summary.totalDonations > 0;
  const maxCampaignRaised = Math.max(...campaignBreakdown.map((c) => c.raisedCents), 0);

  const STAT_CARDS: StatCardProps[] = [
    {
      label: "Total Raised",
      value: formatCurrency(summary.totalRaisedCents),
      sub: `Avg ${formatCurrency(summary.avgDonationCents)} per gift`,
      color: "text-give-primary",
      bg: "bg-blue-50",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Donors",
      value: summary.totalDonors.toLocaleString(),
      sub: `${formatPct(summary.donorRetentionRate)} retention rate`,
      color: "text-give-accent",
      bg: "bg-emerald-50",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: "Active Campaigns",
      value: summary.activeCampaigns.toString(),
      sub: `${summary.recurringDonorCount} recurring donors`,
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      label: "Total Donations",
      value: summary.totalDonations.toLocaleString(),
      sub: `Avg ${formatCurrency(summary.avgDonationCents)} per gift`,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back. Here&apos;s how your fundraising is doing.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => <StatCard key={card.label} {...card} />)}
      </div>
      {!hasData && <EmptyState />}
      {hasData && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Donation Trends</h2>
              <span className="text-xs text-gray-400">Last 30 days</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Daily donation totals</p>
            <DonationTrendChart data={dailyTrend} />
          </div>
          {campaignBreakdown.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Campaign Breakdown</h2>
              <div className="space-y-4">
                {campaignBreakdown
                  .sort((a, b) => b.raisedCents - a.raisedCents)
                  .map((c) => (
                    <CampaignBar
                      key={c.campaignId}
                      title={c.title}
                      raisedCents={c.raisedCents}
                      count={c.count}
                      maxCents={maxCampaignRaised}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
