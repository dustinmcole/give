import Link from "next/link";

// ── Mock Data ─────────────────────────────────────────────
const stats = {
  totalRaised: 124_850_00, // cents
  totalDonors: 342,
  activeCampaigns: 5,
  donationsThisMonth: 89,
};

const recentDonations = [
  {
    id: "don_1",
    donorName: "Sarah M.",
    amount: 250_00,
    campaign: "Annual Fund 2026",
    date: "2026-02-28T14:23:00Z",
    status: "succeeded",
  },
  {
    id: "don_2",
    donorName: "Anonymous",
    amount: 100_00,
    campaign: "Building Campaign",
    date: "2026-02-28T12:10:00Z",
    status: "succeeded",
  },
  {
    id: "don_3",
    donorName: "James K.",
    amount: 500_00,
    campaign: "Annual Fund 2026",
    date: "2026-02-27T18:45:00Z",
    status: "succeeded",
  },
  {
    id: "don_4",
    donorName: "Maria L.",
    amount: 50_00,
    campaign: "Youth Programs",
    date: "2026-02-27T10:30:00Z",
    status: "succeeded",
  },
  {
    id: "don_5",
    donorName: "David R.",
    amount: 1000_00,
    campaign: "Building Campaign",
    date: "2026-02-26T16:12:00Z",
    status: "succeeded",
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
    hour: "numeric",
    minute: "2-digit",
  });
}

const STAT_CARDS = [
  {
    label: "Total Raised",
    value: formatCurrency(stats.totalRaised),
    change: "+12% this month",
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
    value: stats.totalDonors.toLocaleString(),
    change: "+24 new this month",
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
    value: stats.activeCampaigns.toString(),
    change: "2 ending soon",
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
    value: stats.donationsThisMonth.toString(),
    change: "Avg $140 per gift",
    color: "text-purple-600",
    bg: "bg-purple-50",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here&apos;s how your fundraising is doing.
        </p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────── */}
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
              <div
                className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center ${card.color}`}
              >
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="mt-1 text-xs text-gray-400">{card.change}</div>
          </div>
        ))}
      </div>

      {/* ── Recent Donations ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Donations
          </h2>
          <Link
            href="/dashboard/donations"
            className="text-sm text-give-primary font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentDonations.map((d) => (
            <div
              key={d.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-full bg-give-primary/10 flex items-center justify-center text-sm font-bold text-give-primary flex-shrink-0">
                  {d.donorName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {d.donorName}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {d.campaign}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(d.amount)}
                </div>
                <div className="text-xs text-gray-400">{formatDate(d.date)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
