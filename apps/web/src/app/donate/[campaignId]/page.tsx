import type { Metadata } from "next";
import { getDonationCampaign } from "@/lib/api";
import GoalThermometer from "@/components/GoalThermometer";
import DonationForm from "@/components/DonationForm";
import SocialShare from "@/components/SocialShare";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────

interface DonatePageProps {
  params: Promise<{ campaignId: string }>;
}

// ─── Data fetcher (shared by metadata + page) ─────────────

async function fetchCampaign(campaignId: string) {
  try {
    return await getDonationCampaign(campaignId);
  } catch {
    return null;
  }
}

// ─── Open Graph / SEO metadata ────────────────────────────

export async function generateMetadata(
  { params }: DonatePageProps
): Promise<Metadata> {
  const { campaignId } = await params;
  const campaign = await fetchCampaign(campaignId);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://givewith.us";
  const canonicalUrl = `${appUrl}/donate/${campaignId}`;

  if (!campaign) {
    return {
      title: "Campaign not found | Give",
      description: "This campaign may have ended or the link may be incorrect.",
    };
  }

  const rawDescription = campaign.description ?? "";
  const ogDescription =
    rawDescription.length > 200
      ? rawDescription.slice(0, 197) + "…"
      : rawDescription;

  const ogImage = campaign.coverImageUrl ?? `${appUrl}/og-default.png`;

  return {
    title: `${campaign.title} | Give`,
    description: ogDescription || `Support ${campaign.title} on Give.`,
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: campaign.title,
      description: ogDescription || `Support ${campaign.title} on Give.`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: campaign.title,
        },
      ],
      siteName: "Give",
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description: ogDescription || `Support ${campaign.title} on Give.`,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────

export default async function DonatePage({ params }: DonatePageProps) {
  const { campaignId } = await params;
  const campaign = await fetchCampaign(campaignId);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Campaign not found
          </h1>
          <p className="text-gray-500 mb-6">
            This campaign may have ended or the link may be incorrect.
          </p>
          <Link href="/" className="text-give-primary font-medium hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://givewith.us";
  const canonicalUrl = `${appUrl}/donate/${campaignId}`;

  const donationCountLabel =
    campaign.donationCount === 1
      ? "1 donation"
      : `${campaign.donationCount.toLocaleString()} donations`;

  const rawDescription = campaign.description ?? "";
  const shareDescription =
    rawDescription.length > 200
      ? rawDescription.slice(0, 197) + "…"
      : rawDescription;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-give-primary tracking-tight"
          >
            Give
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure donation</span>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* ── Campaign Info (left) ─────────────────── */}
          <div className="lg:col-span-3 space-y-8">
            {campaign.coverImageUrl && (
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={campaign.coverImageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {campaign.title}
              </h1>
              <p className="mt-1 text-sm text-gray-400">{donationCountLabel}</p>
            </div>

            <GoalThermometer
              raisedCents={campaign.raisedCents}
              goalCents={campaign.goalCents}
            />

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>

            {/* ── Social Share ─────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                Help spread the word
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Share this campaign to help{" "}
                {campaign.org?.name ?? "this organization"} reach more
                supporters.
              </p>
              <SocialShare
                url={canonicalUrl}
                title={campaign.title}
                description={shareDescription}
              />
            </div>
          </div>

          {/* ── Donation Form (right) ────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Make a donation
              </h2>
              <DonationForm
                campaignId={campaignId}
                orgEin={campaign.org?.ein ?? null}
                orgName={campaign.org?.name}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>
            Powered by{" "}
            <Link
              href="/"
              className="text-give-primary font-medium hover:underline"
            >
              Give
            </Link>
          </span>
          <span>Fundraising that&apos;s fair.</span>
        </div>
      </footer>
    </div>
  );
}
