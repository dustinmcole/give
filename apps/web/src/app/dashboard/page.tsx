import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getOrgStats, getRecentDonations } from "@/lib/api";
import { redirect } from "next/navigation";

// ── Helpers ───────────────────────────────────────────────
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
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Skeletons ─────────────────────────────────────────────
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}

function DonationsSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 animate-pulse">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="divide-y divide-gray-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-gray-200"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Data Components ───────────────────────────────────────
async function DashboardStats({ orgId }: { orgId: string }) {
  try {
    const stats = await getOrgStats(orgId);
    
    const STAT_CARDS = [
      {
        label: "Total Raised",
        value: formatCurrency(stats.totalRaisedCents || 0),
        change: "Lifetime",
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
        value: (stats.totalDonors || 0).toLocaleString(),
        change: "Total supporters",
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
        value: (stats.activeCampaigns || 0).toString(),
        change: "Currently running",
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        ),
      },
      {
        label: "Donations This Month",
        value: (stats.donationsThisMonth || 0).toString(),
        change: "This month",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">
                {card.label}
              </span>
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="mt-1 text-xs text-gray-400">{card.change}</div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
        Failed to load organization statistics.
      </div>
    );
  }
}

async function DashboardRecentDonations({ orgId }: { orgId: string }) {
  try {
    const response = await getRecentDonations(orgId, 5);
    const recentDonations = response.data || [];

    return (
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Donations
          </h2>
          {recentDonations.length > 0 && (
            <Link
              href="/dashboard/donations"
              className="text-sm text-give-primary font-medium hover:underline"
            >
              View all
            </Link>
          )}
        </div>
        
        {recentDonations.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No donations yet</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              Your recent donations will appear here. Share your campaign link to get started.
            </p>
            <Link
              href="/dashboard/campaigns"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-give-primary rounded-lg hover:bg-give-primary/90 transition-colors"
            >
              View Campaigns
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentDonations.map((d: any) => {
              const donorName = d.donor?.anonymous ? "Anonymous" : `${d.donor?.firstName || ""} ${d.donor?.lastName || ""}`.trim() || "Unknown Donor";
              const initial = donorName.charAt(0).toUpperCase() || "?";
              
              return (
                <div
                  key={d.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-give-primary/10 flex items-center justify-center text-sm font-bold text-give-primary flex-shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {donorName}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {d.campaign?.title || "General Donation"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(d.amountCents)}
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(d.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
        Failed to load recent donations.
      </div>
    );
  }
}

// ── Main Page ─────────────────────────────────────────────
export default async function DashboardOverview() {
  const session = await auth();
  const orgId = session?.orgId;

  if (!orgId) {
    // If no org context, we could show an error or redirect.
    // Assuming there's an organization selection flow or fallback.
    return (
      <div className="p-8 text-center text-gray-500">
        Please select an organization to view your dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here&apos;s how your fundraising is doing.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats orgId={orgId} />
      </Suspense>

      <Suspense fallback={<DonationsSkeleton />}>
        <DashboardRecentDonations orgId={orgId} />
      </Suspense>
    </div>
  );
}
