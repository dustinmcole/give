"use client";

import { useState } from "react";
import {
  calculateFees,
  type DonationFrequency,
  type PaymentMethod,
  type FeeBreakdown,
} from "@give/shared";
import { createDonation } from "@/lib/api";

interface DonationFormProps {
  campaignId: string;
  orgTier?: "basic" | "pro";
}

const SUGGESTED_AMOUNTS = [25, 50, 100, 250, 500, 1000];

const FREQUENCY_OPTIONS: { value: DonationFrequency; label: string }[] = [
  { value: "one_time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export default function DonationForm({
  campaignId,
  orgTier = "basic",
}: DonationFormProps) {
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const [paymentMethod] = useState<PaymentMethod>("card");
  const [coverFees, setCoverFees] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const effectiveAmountDollars = isCustom
    ? parseFloat(customAmount) || 0
    : amount ?? 0;
  const effectiveAmountCents = Math.round(effectiveAmountDollars * 100);

  let fees: FeeBreakdown | null = null;
  if (effectiveAmountCents > 0) {
    fees = calculateFees(effectiveAmountCents, paymentMethod, orgTier, coverFees);
  }

  function handleSuggestedAmount(dollars: number) {
    setAmount(dollars);
    setIsCustom(false);
    setCustomAmount("");
  }

  function handleCustomFocus() {
    setIsCustom(true);
    setAmount(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!effectiveAmountCents || effectiveAmountCents < 100) {
      setError("Please enter at least $1.00.");
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createDonation({
        amount: effectiveAmountCents,
        currency: "usd",
        frequency,
        paymentMethod,
        coverFees,
        campaignId,
        donor: {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          anonymous: false,
        },
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 bg-give-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-give-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600">
          Your ${effectiveAmountDollars.toFixed(2)} donation has been submitted.
          You will receive a receipt at {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Amount Selector ─────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Donation Amount
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {SUGGESTED_AMOUNTS.map((dollars) => (
            <button
              key={dollars}
              type="button"
              onClick={() => handleSuggestedAmount(dollars)}
              className={`py-3 px-4 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer ${
                !isCustom && amount === dollars
                  ? "border-give-primary bg-give-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-give-primary/50"
              }`}
            >
              ${dollars.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            $
          </span>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Other amount"
            value={customAmount}
            onFocus={handleCustomFocus}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setIsCustom(true);
              setAmount(null);
            }}
            className={`w-full pl-7 pr-4 py-3 rounded-lg border-2 text-sm transition-all ${
              isCustom
                ? "border-give-primary ring-2 ring-give-primary/20"
                : "border-gray-200"
            } focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20`}
          />
        </div>
      </div>

      {/* ── Frequency ───────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Frequency
        </label>
        <div className="grid grid-cols-4 gap-1 bg-gray-100 rounded-lg p-1">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFrequency(opt.value)}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer ${
                frequency === opt.value
                  ? "bg-white text-give-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Donor Info ──────────────────────────────────── */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Your Information
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
          />
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
        />
      </div>

      {/* ── Cover the Fee ───────────────────────────────── */}
      {fees && (
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={coverFees}
              onChange={(e) => setCoverFees(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-give-primary focus:ring-give-primary accent-give-primary"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                Cover the transaction fees
              </span>
              <span className="text-gray-500 block mt-0.5">
                Adding ${formatCents(fees.processingFee + fees.platformFee)} ensures
                100% of your ${effectiveAmountDollars.toFixed(2)} donation reaches
                the nonprofit.
              </span>
            </div>
          </label>

          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Donation</span>
              <span>${formatCents(fees.donationAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing fee</span>
              <span>${formatCents(fees.processingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee ({orgTier === "pro" ? "2" : "1"}%)</span>
              <span>${formatCents(fees.platformFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-200">
              <span>You pay</span>
              <span>${formatCents(fees.totalCharged)}</span>
            </div>
            <div className="flex justify-between font-semibold text-give-accent">
              <span>Nonprofit receives</span>
              <span>${formatCents(fees.netToOrg)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Placeholder ─────────────────────────── */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-400">
          Stripe Elements payment form will appear here
        </p>
      </div>

      {/* ── Error ───────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting || effectiveAmountCents < 100}
        className="w-full py-4 px-6 rounded-lg bg-give-primary text-white font-semibold text-base hover:bg-give-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting
          ? "Processing..."
          : fees
            ? `Donate $${formatCents(fees.totalCharged)}`
            : "Donate"}
      </button>
    </form>
  );
}
