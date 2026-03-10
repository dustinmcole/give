import { getPublicCampaign } from "@/lib/api";
import GoalThermometer from "@/components/GoalThermometer";
import DonationForm from "@/components/DonationForm";
import DonorRoll from "@/components/DonorRoll";
import CampaignQRCode from "@/components/CampaignQRCode";
import Link from "next/link";

interface DonatePageProps {
  params: Promise<{ campaignId: string }>;
}

async function fetchCampaign(campaignId: string) {
  try {
    return await getPublicCampaign(campaignId);
  } catch {
    return null;
  }
}

export default async function DonatePage({ params }: DonatePageProps) {
  const { campaignId } = await params;
  const campaign = await fetchCampaign(campaignId);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Campaign not found</h1>
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

  const org = campaign.org;
  const donationCountLabel =
    campaign.donationCount === 1
      ? "1 donation"
      : `${campaign.donationCount.toLocaleString()} donations`;


  const coverBg = campaign.coverImageUrl
    ? undefined
    : `linear-gradient(135deg, ${campaign.color ?? "#6366f1"} 0%, ${campaign.color ?? "#8b5cf6"}cc 100%)`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {org?.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={org.logoUrl}
                alt={org.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: campaign.color ?? "#6366f1" }}
              >
                {org?.name?.[0] ?? "G"}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900">{org?.name ?? "Give"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="hidden sm:inline">Secure donation</span>
          </div>
        </div>
      </header>

      {/* ── Cover Image / Hero ──────────────────────────── */}
      <div
        className="w-full h-52 sm:h-72 md:h-80 relative overflow-hidden"
        style={coverBg ? { background: coverBg } : undefined}
      >
        {campaign.coverImageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={campaign.coverImageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Overlay for text legibility on images */}
        {campaign.coverImageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        )}
      </div>

      {/* ── Main ───────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── LEFT: Campaign Info ─────────────────────── */}
          <div className="lg:col-span-3 space-y-8 order-1">
            {/* Title + count */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {campaign.title}
              </h1>
              <p className="mt-1.5 text-sm text-gray-400">{donationCountLabel}</p>
            </div>

            {/* Goal thermometer */}
            {campaign.showGoal && campaign.goalAmountCents > 0 && (
              <GoalThermometer
                raisedCents={campaign.raisedAmountCents}
                goalCents={campaign.goalAmountCents}
              />
            )}

            {/* Description */}
            {campaign.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {campaign.description}
                </p>
              </div>
            )}

            {/* Donor Roll */}
            {campaign.showDonorRoll && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Recent donors</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2">
                  <DonorRoll donors={campaign.recentDonors} />
                </div>
              </div>
            )}

            {/* Social Sharing */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Share this campaign</h2>
              <div className="flex flex-wrap gap-2">
                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://give.app/donate/${campaignId}`)}&text=${encodeURIComponent(`Support: ${campaign.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                  Share on X
                </a>
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://give.app/donate/${campaignId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#1877f2] text-white hover:bg-[#166fe5] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
                {/* Copy link */}
                <button
                  onClick={() => navigator.clipboard.writeText(`https://give.app/donate/${campaignId}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy link
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Scan to donate</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm inline-flex p-4">
                <CampaignQRCode
                  url={`https://give.app/donate/${campaignId}`}
                  campaignSlug={campaign.slug}
                  size={160}
                />
              </div>
            </div>

            {/* Org Trust Indicators */}
            {org && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">About the organization</h2>
                <div className="flex items-start gap-4">
                  {org.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={org.logoUrl}
                      alt={org.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: campaign.color ?? "#6366f1" }}
                    >
                      {org.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{org.name}</p>
                    {org.ein && (
                      <p className="text-xs text-gray-500 mt-0.5">EIN: {org.ein}</p>
                    )}
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Verified 501(c)(3)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Donation Form ─────────────────────── */}
          <div className="lg:col-span-2 order-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Make a donation</h2>
              <DonationForm
                campaignId={campaignId}
                orgEin={org?.ein ?? null}
                orgName={org?.name}
              />
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>
            Powered by{" "}
            <Link href="/" className="text-give-primary font-medium hover:underline">Give</Link>
          </span>
          <span>Fundraising that&apos;s fair.</span>
        </div>
      </footer>
    </div>
  );
}
