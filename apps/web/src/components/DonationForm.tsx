"use client";

import { useState } from "react";
import {
  calculateFees,
  type DonationFrequency,
  type PaymentMethod,
  type FeeBreakdown,
} from "@give/shared";
import { createDonation } from "@/lib/api";
import StripeProvider from "./StripeProvider";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

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

function formatCents(cents: number): string { return (cents / 100).toFixed(2); }

function StripeCheckoutForm({
  onSuccess, onCancel, clientSecret, email
}: { onSuccess: () => void, onCancel: () => void, clientSecret: string, email: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setError(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-complete",
        receipt_email: email,
      },
      redirect: "if_required",
    });
    if (error) {
      setError(error.message || "An error occurred");
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-700 text-sm bg-red-50 p-3 rounded">{error}</div>}
      <div className="flex gap-4">
        <button type="button" onClick={onCancel} className="w-1/3 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
        <button disabled={!stripe || isProcessing} type="submit" className="w-2/3 py-3 rounded-lg bg-give-primary text-white font-semibold hover:bg-give-primary-dark disabled:opacity-50">
          {isProcessing ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </form>
  );
}

export default function DonationForm({ campaignId, orgTier = "basic" }: DonationFormProps) {
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
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);

  const effectiveAmountDollars = isCustom ? parseFloat(customAmount) || 0 : amount ?? 0;
  const effectiveAmountCents = Math.round(effectiveAmountDollars * 100);

  let fees: FeeBreakdown | null = null;
  if (effectiveAmountCents > 0) {
    fees = calculateFees(effectiveAmountCents, paymentMethod, orgTier, coverFees);
  }

  async function handleInitialSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!effectiveAmountCents || effectiveAmountCents < 100) return setError("Please enter at least $1.00.");
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return setError("Please fill in all fields.");

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await createDonation({
        amount: effectiveAmountCents, currency: "usd", frequency, paymentMethod, coverFees, campaignId,
        donor: { email: email.trim(), firstName: firstName.trim(), lastName: lastName.trim(), anonymous: false },
      });
      // createDonation returns { clientSecret, stripeAccountId, ... }
      setClientSecret(res.clientSecret);
      setStripeAccountId(res.stripeAccountId);
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
          <svg className="w-8 h-8 text-give-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600">Your ${effectiveAmountDollars.toFixed(2)} donation has been submitted.</p>
      </div>
    );
  }

  if (clientSecret) {
    return (
      <StripeProvider clientSecret={clientSecret} stripeAccountId={stripeAccountId || undefined}>
        <StripeCheckoutForm 
          clientSecret={clientSecret} 
          email={email} 
          onSuccess={() => setSuccess(true)} 
          onCancel={() => { setClientSecret(null); setStripeAccountId(null); }} 
        />
      </StripeProvider>
    );
  }

  return (
    <form onSubmit={handleInitialSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Donation Amount</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {SUGGESTED_AMOUNTS.map((dollars) => (
            <button key={dollars} type="button" onClick={() => { setAmount(dollars); setIsCustom(false); setCustomAmount(""); }} className={`py-3 px-4 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer ${!isCustom && amount === dollars ? "border-give-primary bg-give-primary text-white" : "border-gray-200 bg-white text-gray-700 hover:border-give-primary/50"}`}>${dollars.toLocaleString()}</button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input type="number" min="1" step="0.01" placeholder="Other amount" value={customAmount} onFocus={() => { setIsCustom(true); setAmount(null); }} onChange={(e) => { setCustomAmount(e.target.value); setIsCustom(true); setAmount(null); }} className={`w-full pl-7 pr-4 py-3 rounded-lg border-2 text-sm transition-all ${isCustom ? "border-give-primary ring-2 ring-give-primary/20" : "border-gray-200"} focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Frequency</label>
        <div className="grid grid-cols-4 gap-1 bg-gray-100 rounded-lg p-1">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => setFrequency(opt.value)} className={`py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer ${frequency === opt.value ? "bg-white text-give-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{opt.label}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Your Information</label>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20" />
          <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20" />
        </div>
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20" />
      </div>
      {fees && (
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={coverFees} onChange={(e) => setCoverFees(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-give-primary focus:ring-give-primary accent-give-primary" />
            <div className="text-sm">
              <span className="font-medium text-gray-900">Cover the transaction fees</span>
              <span className="text-gray-500 block mt-0.5">Adding ${formatCents(fees.processingFee + fees.platformFee)} ensures 100% reaches the nonprofit.</span>
            </div>
          </label>
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      <button type="submit" disabled={isSubmitting || effectiveAmountCents < 100} className="w-full py-4 px-6 rounded-lg bg-give-primary text-white font-semibold text-base hover:bg-give-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
        {isSubmitting ? "Processing..." : fees ? `Continue to Payment ($${formatCents(fees.totalCharged)})` : "Continue"}
      </button>
    </form>
  );
}
