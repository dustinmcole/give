"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getDonation, type DonationDetail } from "@/lib/api";
import SocialShare from "@/components/SocialShare";

// ─── Helpers ──────────────────────────────────────────────

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function friendlyFrequency(freq: string): string {
  const map: Record<string, string> = {
    ONE_TIME: "One-time",
    MONTHLY: "Monthly recurring",
    QUARTERLY: "Quarterly recurring",
    ANNUAL: "Annual recurring",
  };
  return map[freq] ?? freq;
}

// ─── Loading Skeleton ─────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

function ThankYouSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-5" />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <Skeleton className="w-20 h-20 rounded-full mx-auto" />
          <Skeleton className="w-64 h-9 mx-auto" />
          <Skeleton className="w-48 h-5 mx-auto" />
        </div>

        {/* Receipt card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-4" />
            </div>
          ))}
        </div>

        {/* Share section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <Skeleton className="w-40 h-5" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="flex-1 h-10 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────

export default function ThankYouPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.campaignId as string;
  const donationId = searchParams.get("donationId");

  const [donation, setDonation] = useState<DonationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!donationId) {
      setError("No donation ID provided.");
      setLoading(false);
      return;
    }

    getDonation(donationId)
      .then(setDonation)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load donation details."))
      .finally(() => setLoading(false));
  }, [donationId]);

  if (loading) return <ThankYouSkeleton />;

  if (error || !donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">{error ?? "Could not load donation details."}</p>
          <Link href={`/donate/${campaignId}`} className="text-give-primary font-medium hover:underline">
            ← Back to campaign
          </Link>
        </div>
      </div>
    );
  }

  // Brand color — use campaign color or fall back to Give blue
  const brandColor = donation.campaign.color ?? "#2563eb";
  const isRecurring = donation.frequency !== "ONE_TIME";
  const campaignUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/donate/${campaignId}`
      : `https://givewith.us/donate/${campaignId}`;
  const shareTitle = `Support ${donation.campaign.title}`;
  const shareDescription = `I just donated to ${donation.campaign.title} via ${donation.org.name}! 💙 Join me in supporting this cause.`;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 print:border-gray-300">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Org logo / name */}
          <div className="flex items-center gap-3">
            {donation.org.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={donation.org.logoUrl}
                alt={donation.org.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: brandColor }}
              >
                {donation.org.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-gray-900">{donation.org.name}</span>
          </div>

          {/* Powered by Give (hidden on print) */}
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-give-primary transition-colors print:hidden"
          >
            Powered by <span className="font-semibold text-give-primary">Give</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8 print:py-6">

        {/* ── Hero ─────────────────────────────────────── */}
        <div className="text-center">
          {/* Animated checkmark circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${brandColor}1a` /* 10% opacity */ }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: brandColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Thank you, {donation.donor.firstName}!
          </h1>
          <p className="text-gray-500 text-lg">
            Your generosity makes a real difference for{" "}
            <span className="font-medium text-gray-700">{donation.campaign.title}</span>.
          </p>
        </div>

        {/* ── Receipt Card ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Colored top accent bar */}
          <div className="h-1.5 w-full" style={{ backgroundColor: brandColor }} />

          <div className="p-6 space-y-1">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Donation Summary</h2>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-gray-500">Amount</dt>
                <dd className="font-semibold text-gray-900 text-base">
                  {formatCents(donation.totalChargedCents || donation.amountCents)}
                </dd>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-gray-500">Campaign</dt>
                <dd className="font-medium text-gray-900 text-right max-w-[60%]">
                  {donation.campaign.title}
                </dd>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-gray-500">Frequency</dt>
                <dd className="font-medium text-gray-900">
                  {friendlyFrequency(donation.frequency)}
                </dd>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-gray-500">Date</dt>
                <dd className="font-medium text-gray-900">{formatDate(donation.createdAt)}</dd>
              </div>

              {donation.receiptNumber && (
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <dt className="text-gray-500">Receipt #</dt>
                  <dd className="font-mono text-gray-700">{donation.receiptNumber}</dd>
                </div>
              )}

              <div className="flex justify-between items-center py-2">
                <dt className="text-gray-500">Confirmation to</dt>
                <dd className="font-medium text-gray-900">{donation.donor.email}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ── Recurring Info (if applicable) ───────────── */}
        {isRecurring && (
          <div
            className="rounded-xl px-5 py-4 flex gap-3 items-start print:hidden"
            style={{ backgroundColor: `${brandColor}0d` /* 5% opacity */ }}
          >
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: brandColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div className="text-sm" style={{ color: brandColor }}>
              <p className="font-semibold mb-0.5">Recurring donation set up!</p>
              <p style={{ color: brandColor, opacity: 0.8 }}>
                Your {friendlyFrequency(donation.frequency).toLowerCase()} donation of{" "}
                {formatCents(donation.totalChargedCents || donation.amountCents)} will
                be automatically processed. You can manage or cancel it at any time by
                contacting {donation.org.name}.
              </p>
            </div>
          </div>
        )}

        {/* ── Social Sharing ────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 print:hidden">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Spread the word</h2>
          <p className="text-sm text-gray-500 mb-4">
            Help {donation.campaign.title} reach more supporters by sharing.
          </p>
          <SocialShare
            url={campaignUrl}
            title={shareTitle}
            description={shareDescription}
          />
        </div>

        {/* ── Action Buttons ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          {/* Make another donation */}
          <Link
            href={`/donate/${campaignId}`}
            className="flex-1 text-center py-3.5 px-6 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            Make another donation
          </Link>

          {/* Learn more about org */}
          {donation.org.website && (
            <a
              href={donation.org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3.5 px-6 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Learn more about {donation.org.name}
            </a>
          )}

          {/* Print receipt */}
          <button
            type="button"
            onClick={() => window.print()}
            className="sm:flex-none flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-sm cursor-pointer"
            aria-label="Print receipt"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print receipt</span>
          </button>
        </div>

      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 mt-8 print:hidden">
        <div className="max-w-2xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>
            Powered by{" "}
            <Link href="/" className="text-give-primary font-medium hover:underline">
              Give
            </Link>
          </span>
          <span className="text-xs">Fundraising that&apos;s fair.</span>
        </div>
      </footer>

      {/* ── Print-only styles ─────────────────────────── */}
      <style>{`
        @media print {
          body { font-size: 12pt; }
          header { border-bottom: 1px solid #ccc !important; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:py-6 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
