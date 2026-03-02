"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ─── Types ────────────────────────────────────────────────

export interface TrendPoint {
  date: string;       // "YYYY-MM-DD"
  amountCents: number;
  count: number;
}

interface DonationTrendChartProps {
  data: TrendPoint[];
}

// ─── Helpers ──────────────────────────────────────────────

function formatDollars(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatShortDate(iso: string): string {
  // "2026-02-01" → "Feb 1"
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Custom Tooltip ───────────────────────────────────────

interface TooltipEntry {
  date: string;
  amountCents: number;
  count: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: TooltipEntry }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const amountCents: number = payload[0]?.value ?? 0;
  const count: number = payload[0]?.payload?.count ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{formatShortDate(label ?? "")}</p>
      <p className="text-give-primary font-medium">{formatDollars(amountCents)}</p>
      <p className="text-gray-500">
        {count} donation{count !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────

export function DonationTrendChart({ data }: DonationTrendChartProps) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
        <svg
          className="w-10 h-10 mb-2 opacity-40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
        <p className="text-sm">No donation data yet</p>
        <p className="text-xs mt-1">Data will appear once donations come in.</p>
      </div>
    );
  }

  // Find max for Y-axis domain padding
  const maxCents = Math.max(...data.map((d) => d.amountCents));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          // Show ~6 ticks evenly spaced
          interval={Math.max(0, Math.floor(data.length / 6) - 1)}
        />
        <YAxis
          tickFormatter={(v: number) => formatDollars(v)}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={72}
          domain={[0, Math.round(maxCents * 1.15) || 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="amountCents"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
