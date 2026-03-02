import Link from "next/link";

// ── Mock Data ─────────────────────────────────────────────
const campaigns = [
  {
    id: "camp_1",
    title: "Annual Fund 2026",
    status: "active" as const,
    goalCents: 500_000_00,
    raisedCents: 324_850_00,
    donationCount: 189,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "camp_2",
    title: "Building Campaign",
    status: "active" as const,
    goalCents: 1_000_000_00,
    raisedCents: 412_300_00,
    donationCount: 67,
    createdAt: "2025-11-01T00:00:00Z",
  },
  {
    id: "camp_3",
    title: "Youth Programs",
    status: "active" as const,
    goalCents: 75_000_00,
    raisedCents: 52_100_00,
    donationCount: 104,
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "camp_4",
    title: "Gala 2026",
    status: "draft" as const,
    goalCents: 200_000_00,
    raisedCents: 0,
    donationCount: 0,
    createdAt: "2026-02-20T00:00:00Z",
  },
  {
    id: "camp_5",
    title: "End-of-Year Appeal 2025",
    status: "ended" as const,
    goalCents: 150_000_00,
    raisedCents: 163_200_00,
    donationCount: 241,
    createdAt: "2025-10-15T00:00:00Z",
  },
  {
    id: "camp_6",
    title: "Spring Walkathon",
    status: "paused" as const,
    goalCents: 50_000_00,
    raisedCents: 18_750_00,
    donationCount: 34,
    createdAt: "2026-02-10T00:00:00Z",
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

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your fundraising campaigns.
          </p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-5 py-2.5 rounded-lg"
        >
          Create Campaign
        </Link>
      </div>

      {/* ── Campaign Table ─────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-6 font-medium text-gray-500">
                  Campaign
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Progress
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Donations
                </th>
                <th className="text-right py-3 px-6 font-medium text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => {
                const pct =
                  c.goalCents > 0
                    ? Math.min((c.raisedCents / c.goalCents) * 100, 100)
                    : 0;
                const statusStyle = STATUS_STYLES[c.status] ?? STATUS_STYLES.draft;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <Link
                        href={`/donate/${c.id}`}
                        className="font-medium text-gray-900 hover:text-give-primary transition-colors"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusStyle.classes}`}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="min-w-[180px]">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>{formatCurrency(c.raisedCents)}</span>
                          <span>{formatCurrency(c.goalCents)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-give-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {pct.toFixed(0)}%
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">
                      {c.donationCount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-400">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
