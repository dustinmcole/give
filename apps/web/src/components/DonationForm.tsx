"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import {
  calculateFees,
  STRIPE_CARD_RATE,
  STRIPE_ACH_RATE,
  STRIPE_ACH_CAP,
  type DonationFrequency,
  type PaymentMethod,
  type FeeBreakdown,
} from "@give/shared";
import { createDonation } from "@/lib/api";
import StripeProvider from "@/components/StripeProvider";

interface DonationFormProps {
  campaignId: string;
  orgTier?: "basic" | "pro";
  orgEin?: string | null;
  orgName?: string;
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

/** Calculate how much the nonprofit saves when donor pays via ACH vs card. */
function calculateAchSavings(amountCents: number): number {
  const cardFee = Math.round(amountCents * STRIPE_CARD_RATE + 30); // $0.30 fixed
  const achFee = Math.min(Math.round(amountCents * STRIPE_ACH_RATE), STRIPE_ACH_CAP * 100);
  return Math.max(0, cardFee - achFee);
}

// --- Step 1: Collect donor info and amount -----------------

interface DonorInfoStepProps {
  campaignId: string;
  orgTier: "basic" | "pro";
  orgEin?: string | null;
  orgName?: string;
  onComplete: (
    clientSecret: string,
    donationId: string,
    stripeAccountId: string,
    amountCents: number,
    fees: FeeBreakdown,
    paymentMethod: PaymentMethod
  ) => void;
}

function DonorInfoStep({
  campaignId,
  orgTier,
  orgEin,
  orgName,
  onComplete,
}: DonorInfoStepProps) {
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [coverFees, setCoverFees] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmountDollars = isCustom
    ? parseFloat(customAmount) || 0
    : amount ?? 0;
  const effectiveAmountCents = Math.round(effectiveAmountDollars * 100);

  let fees: FeeBreakdown | null = null;
  if (effectiveAmountCents > 0) {
    fees = calculateFees(effectiveAmountCents, paymentMethod, orgTier, coverFees);
  }

  const achSavingsCents =
    effectiveAmountCents > 0 ? calculateAchSavings(effectiveAmountCents) : 0;

  const amountError =
    effectiveAmountCents < 100 ? "Please enter at least $1.00." : null;
  const firstNameError = !firstName.trim() ? "First name is required." : null;
  const lastNameError = !lastName.trim() ? "Last name is required." : null;
  const emailError = !email.trim()
    ? "Email is required."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Please enter a valid email address."
      : null;

  const isFormValid =
    !amountError && !firstNameError && !lastNameError && !emailError;

  function showError(field: string): boolean {
    return submitAttempted || touched[field] === true;
  }

  function handleBlur(field: string): void {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSuggestedAmount(dollars: number): void {
    setAmount(dollars);
    setIsCustom(false);
    setCustomAmount("");
    setTouched((prev) => ({ ...prev, amount: true }));
  }

  function handleCustomFocus(): void {
    setIsCustom(true);
    setAmount(null);
  }

  function handlePaymentMethodChange(method: PaymentMethod): void {
    setPaymentMethod(method);
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isFormValid) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createDonation({
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

      const finalFees = calculateFees(
        effectiveAmountCents,
        paymentMethod,
        orgTier,
        coverFees
      );
      onComplete(
        result.clientSecret,
        result.donationId,
        result.stripeAccountId,
        effectiveAmountCents,
        finalFees,
        paymentMethod
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Amount Selector */}
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
            onBlur={() => handleBlur("amount")}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setIsCustom(true);
              setAmount(null);
            }}
            className={`w-full pl-7 pr-4 py-3 rounded-lg border-2 text-sm transition-all ${
              isCustom
                ? "border-give-primary ring-2 ring-give-primary/20"
                : showError("amount") && amountError
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-gray-200"
            } focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20`}
          />
        </div>
        {showError("amount") && amountError && (
          <p className="mt-1.5 text-xs text-red-600">{amountError}</p>
        )}
      </div>

      {/* Frequency */}
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

      {/* Payment Method Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handlePaymentMethodChange("card")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
              paymentMethod === "card"
                ? "border-give-primary bg-give-primary/5 text-give-primary"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Card
          </button>
          <button
            type="button"
            onClick={() => handlePaymentMethodChange("ach")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
              paymentMethod === "ach"
                ? "border-give-primary bg-give-primary/5 text-give-primary"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Bank Transfer
          </button>
        </div>

        {/* ACH savings message */}
        {paymentMethod === "ach" && achSavingsCents > 0 && (
          <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-green-800 font-medium">
              Save the nonprofit ${formatCents(achSavingsCents)} by paying via bank transfer
            </p>
          </div>
        )}

        {/* ACH timing note */}
        {paymentMethod === "ach" && (
          <p className="mt-1.5 text-xs text-gray-500">
            Bank transfers take 3-5 business days to process and confirm.
          </p>
        )}
      </div>

      {/* Donor Info */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Your Information
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => handleBlur("firstName")}
              className={`w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all ${
                showError("firstName") && firstNameError
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-gray-200"
              }`}
            />
            {showError("firstName") && firstNameError && (
              <p className="mt-1 text-xs text-red-600">{firstNameError}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => handleBlur("lastName")}
              className={`w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all ${
                showError("lastName") && lastNameError
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-gray-200"
              }`}
            />
            {showError("lastName") && lastNameError && (
              <p className="mt-1 text-xs text-red-600">{lastNameError}</p>
            )}
          </div>
        </div>
        <div>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all ${
              showError("email") && emailError
                ? "border-red-400 ring-2 ring-red-100"
                : "border-gray-200"
            }`}
          />
          {showError("email") && emailError && (
            <p className="mt-1 text-xs text-red-600">{emailError}</p>
          )}
        </div>
      </div>

      {/* Cover the Fee */}
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
                Adding ${formatCents(fees.processingFee + fees.platformFee)}{" "}
                ensures 100% of your ${effectiveAmountDollars.toFixed(2)}{" "}
                donation reaches the nonprofit.
              </span>
            </div>
          </label>

          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Donation</span>
              <span>${formatCents(fees.donationAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                Processing fee{" "}
                {paymentMethod === "ach" ? "(0.8% ACH, max $5)" : "(2.2% + $0.30)"}
              </span>
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || (submitAttempted && !isFormValid)}
        className="w-full py-4 px-6 rounded-lg bg-give-primary text-white font-semibold text-base hover:bg-give-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting
          ? "Preparing..."
          : fees
            ? `Continue — $${formatCents(fees.totalCharged)}`
            : "Continue to Payment"}
      </button>

      {/* Trust Indicators */}
      <TrustIndicators orgEin={orgEin} orgName={orgName} />
    </form>
  );
}

// --- Step 2: Stripe PaymentElement + confirm ---------------

interface PaymentStepInnerProps {
  donationId: string;
  fees: FeeBreakdown;
  campaignId: string;
  paymentMethod: PaymentMethod;
  onBack: () => void;
}

function PaymentStepInner({
  donationId,
  fees,
  campaignId,
  paymentMethod,
  onBack,
}: PaymentStepInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isAch = paymentMethod === "ach";

  async function handleConfirm(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!stripe || !elements) {
      setStripeError(
        "Payment system is not ready. Please wait a moment and try again."
      );
      return;
    }

    if (!paymentReady) {
      setStripeError("Please complete your payment details above.");
      return;
    }

    setStripeError(null);
    setIsSubmitting(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setStripeError(
          submitError.message ?? "Please check your payment details."
        );
        setIsSubmitting(false);
        return;
      }

      const returnUrl = `${window.location.origin}/donate/${campaignId}/thank-you?donationId=${donationId}`;

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
      });

      // confirmPayment redirects on success — reaching here means failure.
      if (confirmError) {
        setStripeError(
          confirmError.message ?? "Payment failed. Please try again."
        );
      }
    } catch (err) {
      setStripeError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-6" noValidate>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Payment summary */}
      <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-green-800">Total charge</span>
        <span className="text-lg font-bold text-green-700">
          ${formatCents(fees.totalCharged)}
        </span>
      </div>

      {/* ACH pending notice */}
      {isAch && (
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-800">
            <p className="font-semibold mb-0.5">Bank transfer confirmation takes 3-5 business days</p>
            <p className="text-blue-700">
              You&apos;ll receive an email confirmation once your payment clears. The nonprofit will receive your donation shortly after.
            </p>
          </div>
        </div>
      )}

      {/* Stripe PaymentElement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Details
        </label>
        {!stripe && (
          <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
            <div className="inline-block w-5 h-5 border-2 border-give-primary border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-sm text-gray-400">Loading payment form...</p>
          </div>
        )}
        <PaymentElement
          onReady={() => setPaymentReady(true)}
          onChange={() => { if (stripeError) setStripeError(null); }}
          options={{ layout: "tabs" }}
        />
        {submitAttempted && !paymentReady && !stripeError && (
          <p className="mt-1.5 text-xs text-red-600">
            Please complete your payment details.
          </p>
        )}
      </div>

      {/* Payment error */}
      {stripeError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {stripeError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !stripe || !elements}
        className="w-full py-4 px-6 rounded-lg bg-give-primary text-white font-semibold text-base hover:bg-give-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting
          ? isAch
            ? "Initiating bank transfer..."
            : "Processing payment..."
          : isAch
            ? `Authorize Bank Transfer — $${formatCents(fees.totalCharged)}`
            : `Complete Donation — $${formatCents(fees.totalCharged)}`}
      </button>

      {!stripe && (
        <p className="text-center text-xs text-amber-600 font-medium">
          Payment form is loading. The button will activate when ready.
        </p>
      )}
    </form>
  );
}

interface PaymentStepProps extends PaymentStepInnerProps {
  clientSecret: string;
  stripeAccount: string;
}

function PaymentStep({ clientSecret, stripeAccount, ...innerProps }: PaymentStepProps) {
  return (
    <StripeProvider clientSecret={clientSecret} stripeAccount={stripeAccount}>
      <PaymentStepInner {...innerProps} />
    </StripeProvider>
  );
}

// --- Trust Indicators (shared) -----------------------------

function TrustIndicators({ orgEin, orgName }: { orgEin?: string | null; orgName?: string }) {
  return (
    <div className="pt-4 border-t border-gray-100 space-y-3">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>SSL Secured</span>
        </div>
        <span className="text-gray-200 text-xs">|</span>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>256-bit Encryption</span>
        </div>
        <span className="text-gray-200 text-xs">|</span>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-[#635bff] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
          </svg>
          <span>Powered by Stripe</span>
        </div>
      </div>
      {orgEin && (
        <p className="text-center text-xs text-gray-400">
          <span className="font-medium text-gray-500">{orgName ?? "This organization"}</span>{" "}
          is a registered 501(c)(3) nonprofit. EIN: <span className="font-mono">{orgEin}</span>.{" "}
          Your donation may be tax-deductible.
        </p>
      )}
      <p className="text-center text-xs text-gray-400">
        By donating, you agree to our{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-give-primary underline hover:text-give-primary-dark">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

// --- Root component ----------------------------------------

export default function DonationForm({
  campaignId,
  orgTier = "basic",
  orgEin,
  orgName,
}: DonationFormProps) {
  const [step, setStep] = useState<"info" | "payment">("info");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [fees, setFees] = useState<FeeBreakdown | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("card");

  function handleInfoComplete(
    secret: string,
    id: string,
    accountId: string,
    _amountCents: number,
    feeBreakdown: FeeBreakdown,
    paymentMethod: PaymentMethod
  ): void {
    setClientSecret(secret);
    setDonationId(id);
    setStripeAccountId(accountId);
    setFees(feeBreakdown);
    setSelectedPaymentMethod(paymentMethod);
    setStep("payment");
  }

  function handleBack(): void {
    setStep("info");
    setClientSecret(null);
    setDonationId(null);
    setStripeAccountId(null);
  }

  if (step === "payment" && clientSecret && donationId && stripeAccountId && fees) {
    return (
      <PaymentStep
        clientSecret={clientSecret}
        stripeAccount={stripeAccountId}
        donationId={donationId}
        fees={fees}
        campaignId={campaignId}
        paymentMethod={selectedPaymentMethod}
        onBack={handleBack}
      />
    );
  }

  return (
    <DonorInfoStep
      campaignId={campaignId}
      orgTier={orgTier}
      orgEin={orgEin}
      orgName={orgName}
      onComplete={handleInfoComplete}
    />
  );
}
