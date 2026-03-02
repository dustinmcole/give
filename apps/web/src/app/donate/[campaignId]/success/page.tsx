"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
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

// ─── Social share URL helpers ─────────────────────────────

function twitterShareUrl(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

function facebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

function linkedinShareUrl(url: string, text?: string): string {
  const base = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  return text ? `${base}&summary=${encodeURIComponent(text)}` : base;
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

function SuccessSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-5" />
        </div>
      </div>
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="w-20 h-20 rounded-full mx-auto" />
          <Skeleton className="w-64 h-9 mx-auto" />
          <Skeleton className="w-48 h-5 mx-auto" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── Payment status types ─────────────────────────────────

type PaymentStatus = "verifying" | "succeeded" | "failed" | "skipped";

async function verifyPaymentIntent(
  clientSecret: string,
  paymentIntentId: string
): Promise<PaymentStatus> {
  try {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );
    if (!stripe) return "skipped";

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    if (!paymentIntent) return "skipped";

    if (paymentIntent.id !== paymentIntentId) return "failed";
    return paymentIntent.status === "succeeded" ? "succeeded" : "failed";
  } catch {
    return "skipped";
  }
}

// ─── Failed Payment Banner ────────────────────────────────

function FailedBanner({ campaignId }: { campaignId: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment failed
        </h1>
        <p className="text-gray-500 mb-6">
          Your payment was not completed. No charge was made. Please try again
          with a different payment method.
        </p>
        <Link
          href={`/donate/${campaignId}`}
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-give-primary text-white font-semibold hover:bg-give-primary-dark transition-colors"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}

// ─── Success Content ─────────────────────────────────────

function SuccessContent({
  donation,
  campaignId,
}: {
  donation: DonationDetail;
  campaignId: string;
}) {
  const brandColor = donation.campaign.color ?? "#2563eb";
  const isRecurring = donation.frequency !== "ONE_TIME";
  const campaignUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/donate/${campaignId}`
      : `https://givewith.us/donate/${campaignId}`;
  const shareTitle = `Support ${donation.campaign.title}`;
  const shareDescription = `I just donated to ${donation.campaign.title} via ${donation.org.name}! 💙 Join me in supporting this cause.`;
  const shareText = shareDescription;
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(campaignUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = campaignUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 print:border-gray-300">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <span className="font-semibold text-gray-900">
              {donation.org.name}
            </span>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-give-primary transition-colors print:hidden"
          >
            Powered by{" "}
            <span className="font-semibold text-give-primary">Give</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8 print:py-6">
        {/* ── Hero ─────────────────────────────────────── */}
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${brandColor}1a` }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: brandColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Thank you, {donation.donor.firstName}!
          </h1>
          <p className="text-gray-500 text-lg">
            Your generosity makes a real difference for{" "}
            <span className="font-medium text-gray-700">
              {donation.campaign.title}
            </span>
            .
          </p>
        </div>

        {/* ── Receipt Card ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full" style={{ backgroundColor: brandColor }} />
          <div className="p-6 space-y-1">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Donation Summary
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-gray-500">Amount</dt>
                <dd className="font-semibold text-gray-900 text-base">
                  {formatCents(
                    donation.totalChargedCents || donation.amountCents
                  )}
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
                <dd className="font-medium text-gray-900">
                  {formatDate(donation.createdAt)}
                </dd>
              </div>
              {donation.receiptNumber && (
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <dt className="text-gray-500">Receipt #</dt>
                  <dd className="font-mono text-gray-700">
                    {donation.receiptNumber}
                  </dd>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <dt className="text-gray-500">Confirmation to</dt>
                <dd className="font-medium text-gray-900">
                  {donation.donor.email}
                </dd>
              </div>
            </dl>
          </div>

          {/* Receipt email note */}
          <div className="px-6 pb-5">
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2.5">
              📧 A tax receipt has been sent to{" "}
              <span className="font-medium text-gray-600">
                {donation.donor.email}
              </span>
              .
            </p>
          </div>
        </div>

        {/* ── Recurring Info ────────────────────────────── */}
        {isRecurring && (
          <div
            className="rounded-xl px-5 py-4 flex gap-3 items-start print:hidden"
            style={{ backgroundColor: `${brandColor}0d` }}
          >
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: brandColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div className="text-sm" style={{ color: brandColor }}>
              <p className="font-semibold mb-0.5">Recurring donation set up!</p>
              <p style={{ color: brandColor, opacity: 0.8 }}>
                Your {friendlyFrequency(donation.frequency).toLowerCase()}{" "}
                donation of{" "}
                {formatCents(
                  donation.totalChargedCents || donation.amountCents
                )}{" "}
                will be automatically processed. You can manage or cancel it at
                any time by contacting {donation.org.name}.
              </p>
            </div>
          </div>
        )}

        {/* ── Social Sharing ────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 print:hidden">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Spread the word
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Help {donation.campaign.title} reach more supporters by sharing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Twitter/X */}
            <a
              href={twitterShareUrl(shareText, campaignUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-medium text-gray-600 group"
              aria-label="Share on X / Twitter"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X / Twitter</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookShareUrl(campaignUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-medium text-gray-600 group"
              aria-label="Share on Facebook"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinShareUrl(campaignUrl, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-medium text-gray-600 group"
              aria-label="Share on LinkedIn"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-medium text-gray-600 group cursor-pointer"
              aria-label="Copy campaign link"
            >
              {copied ? (
                <svg
                  className="w-5 h-5 text-give-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              <span>{copied ? "Copied!" : "Copy link"}</span>
            </button>
          </div>
        </div>

        {/* ── Action Buttons ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <Link
            href={`/donate/${campaignId}`}
            className="flex-1 text-center py-3.5 px-6 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            Make another donation
          </Link>
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
          <button
            type="button"
            onClick={() => window.print()}
            className="sm:flex-none flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-sm cursor-pointer"
            aria-label="Print receipt"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
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
            <Link
              href="/"
              className="text-give-primary font-medium hover:underline"
            >
              Give
            </Link>
          </span>
          <span className="text-xs">Fundraising that&apos;s fair.</span>
        </div>
      </footer>

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

// ─── Inner page (uses hooks that require Suspense) ────────

function SuccessPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();

  const campaignId = params.campaignId as string;
  const donationId = searchParams.get("donationId");
  const paymentIntentId = searchParams.get("payment_intent");
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const redirectStatus = searchParams.get("redirect_status");

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("verifying");
  const [donation, setDonation] = useState<DonationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Stripe redirected back with a failed status, show failure immediately
    if (redirectStatus === "failed") {
      setPaymentStatus("failed");
      setLoading(false);
      return;
    }

    // Verify payment intent when we have a client secret (3DS / redirect flows)
    if (clientSecret && paymentIntentId) {
      verifyPaymentIntent(clientSecret, paymentIntentId).then((status) => {
        setPaymentStatus(status);
        if (status === "failed") {
          setLoading(false);
          return;
        }
        // Load donation details
        if (donationId) {
          getDonation(donationId)
            .then(setDonation)
            .catch((err) =>
              setError(
                err instanceof Error
                  ? err.message
                  : "Failed to load donation details."
              )
            )
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });
      return;
    }

    // Direct flow (non-redirect): just load the donation
    setPaymentStatus("succeeded");
    if (donationId) {
      getDonation(donationId)
        .then(setDonation)
        .catch((err) =>
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load donation details."
          )
        )
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [donationId, paymentIntentId, clientSecret, redirectStatus]);

  // Still loading
  if (loading || paymentStatus === "verifying") {
    return <SuccessSkeleton />;
  }

  // Payment failed
  if (paymentStatus === "failed") {
    return <FailedBanner campaignId={campaignId} />;
  }

  // Donation lookup failed — payment succeeded but we can't show details
  if (error || !donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank you for your donation!
          </h1>
          <p className="text-gray-500 mb-6">
            Your payment was received. A confirmation will be sent to your
            email shortly.
          </p>
          <Link
            href={`/donate/${campaignId}`}
            className="text-give-primary font-medium hover:underline"
          >
            ← Back to campaign
          </Link>
        </div>
      </div>
    );
  }

  return <SuccessContent donation={donation} campaignId={campaignId} />;
}

// ─── Main Export ─────────────────────────────────────────

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessPageInner />
    </Suspense>
  );
}
