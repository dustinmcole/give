import type { Metadata } from "next";
import { getDonationCampaign } from "@/lib/api";
import DonationForm from "@/components/DonationForm";
import EmbedResizer from "@/components/EmbedResizer";

// ─── Types ────────────────────────────────────────────────

interface EmbedPageProps {
  params: Promise<{ campaignId: string }>;
  searchParams: Promise<{ theme?: string }>;
}

// ─── Data fetcher ─────────────────────────────────────────

async function fetchCampaign(campaignId: string) {
  try {
    return await getDonationCampaign(campaignId);
  } catch {
    return null;
  }
}

// ─── Metadata ─────────────────────────────────────────────

export async function generateMetadata({
  params,
}: EmbedPageProps): Promise<Metadata> {
  const { campaignId } = await params;
  const campaign = await fetchCampaign(campaignId);
  return {
    title: campaign ? `Donate to ${campaign.title}` : "Donate",
    robots: { index: false, follow: false },
  };
}

// ─── Page ─────────────────────────────────────────────────

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const { campaignId } = await params;
  const { theme } = await searchParams;
  const isDark = theme === "dark";

  const campaign = await fetchCampaign(campaignId);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://givewith.us";

  // ── Theming ───────────────────────────────────────────
  const bg = isDark ? "#1a1a2e" : "transparent";
  const cardBg = isDark ? "#16213e" : "#ffffff";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#374151" : "#f3f4f6";

  // ── Not found ─────────────────────────────────────────
  if (!campaign) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: bg, color: textPrimary }}
      >
        <div className="text-center">
          <p className="font-semibold text-lg mb-1">Campaign not found</p>
          <p style={{ color: textSecondary }} className="text-sm">
            This campaign may have ended or the link may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* EmbedResizer sends postMessage height updates to parent */}
      <EmbedResizer />

      <div
        className="w-full min-h-screen"
        style={{ background: bg }}
        data-embed-theme={isDark ? "dark" : "light"}
      >
        <div className="w-full p-4 sm:p-6">
          {/* ── Org / Campaign header ───────────────────── */}
          <div
            className="rounded-2xl border p-5 mb-4"
            style={{
              background: cardBg,
              borderColor,
              color: textPrimary,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              {campaign.org?.name && (
                <span
                  className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{
                    background: isDark ? "#1e3a5f" : "#eff6ff",
                    color: isDark ? "#93c5fd" : "#2563eb",
                  }}
                >
                  {campaign.org.name}
                </span>
              )}
            </div>
            <h1
              className="text-lg font-bold leading-snug mb-1"
              style={{ color: textPrimary }}
            >
              {campaign.title}
            </h1>
            {campaign.description && (
              <p
                className="text-sm leading-relaxed line-clamp-3"
                style={{ color: textSecondary }}
              >
                {campaign.description}
              </p>
            )}

            {/* ── Progress bar ──────────────────────────── */}
            {campaign.goalCents > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5" style={{ color: textSecondary }}>
                  <span>
                    ${(campaign.raisedCents / 100).toLocaleString()} raised
                  </span>
                  <span>
                    goal: ${(campaign.goalCents / 100).toLocaleString()}
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: isDark ? "#374151" : "#e5e7eb" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((campaign.raisedCents / campaign.goalCents) * 100, 100)}%`,
                      background: "#2563eb",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Donation form ───────────────────────────── */}
          <div
            className="rounded-2xl border p-5"
            style={{
              background: cardBg,
              borderColor,
            }}
          >
            <h2
              className="text-base font-semibold mb-4"
              style={{ color: textPrimary }}
            >
              Make a donation
            </h2>
            <DonationForm
              campaignId={campaignId}
              orgEin={campaign.org?.ein ?? null}
              orgName={campaign.org?.name}
            />
          </div>

          {/* ── Powered-by footer ───────────────────────── */}
          <div className="mt-4 text-center">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: textSecondary }}
            >
              Powered by Give · Fundraising that&apos;s fair
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
