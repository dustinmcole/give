// Give — Shared Types & Constants

// ─── Pricing ────────────────────────────────────────────
export const PLATFORM_FEE_BASIC = 0.01; // 1%
export const PLATFORM_FEE_PRO = 0.02; // 2%

export const STRIPE_CARD_RATE = 0.022; // 2.2% nonprofit rate
export const STRIPE_CARD_FIXED = 0.30; // $0.30 per transaction
export const STRIPE_ACH_RATE = 0.008; // 0.8%
export const STRIPE_ACH_CAP = 5.0; // $5.00 max

export type PlanTier = "basic" | "pro";

export function getPlatformFeeRate(tier: PlanTier): number {
  return tier === "pro" ? PLATFORM_FEE_PRO : PLATFORM_FEE_BASIC;
}

// ─── Donation ───────────────────────────────────────────
export type DonationFrequency = "one_time" | "monthly" | "quarterly" | "annual";

export type PaymentMethod = "card" | "ach" | "apple_pay" | "google_pay";

export type DonationStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded"
  | "disputed";

export interface CreateDonationInput {
  amount: number; // in cents
  currency: string;
  frequency: DonationFrequency;
  paymentMethod: PaymentMethod;
  coverFees: boolean;
  campaignId: string;
  donor: {
    email: string;
    firstName: string;
    lastName: string;
    anonymous: boolean;
  };
  dedication?: {
    type: "in_honor" | "in_memory";
    name: string;
    message?: string;
  };
}

// ─── Campaign ───────────────────────────────────────────
export type CampaignType = "donation" | "peer_to_peer" | "event" | "membership";

export type CampaignStatus = "draft" | "active" | "paused" | "ended";

// ─── Organization ───────────────────────────────────────
export type OrgStatus = "onboarding" | "active" | "suspended" | "deactivated";

// ─── Fee Calculation ────────────────────────────────────
export interface FeeBreakdown {
  donationAmount: number; // cents
  processingFee: number; // cents
  platformFee: number; // cents
  totalCharged: number; // cents — what the donor pays
  netToOrg: number; // cents — what the nonprofit receives
}

export function calculateFees(
  amountCents: number,
  paymentMethod: PaymentMethod,
  tier: PlanTier,
  coverFees: boolean
): FeeBreakdown {
  const platformRate = getPlatformFeeRate(tier);

  let processingRate: number;
  let processingFixed: number;

  if (paymentMethod === "ach") {
    const achFee = Math.min(amountCents * STRIPE_ACH_RATE, STRIPE_ACH_CAP * 100);
    processingRate = 0;
    processingFixed = achFee;
  } else {
    processingRate = STRIPE_CARD_RATE;
    processingFixed = STRIPE_CARD_FIXED * 100; // convert to cents
  }

  if (coverFees) {
    // Donor covers fees — gross up the charge so nonprofit gets the full amount
    // total = (amount + fixedFee) / (1 - processingRate - platformRate)
    const totalCharged = Math.ceil(
      (amountCents + processingFixed) / (1 - processingRate - platformRate)
    );
    const processingFee =
      paymentMethod === "ach"
        ? Math.round(processingFixed)
        : Math.round(totalCharged * processingRate + processingFixed);
    const platformFee = Math.round(totalCharged * platformRate);

    return {
      donationAmount: amountCents,
      processingFee,
      platformFee,
      totalCharged,
      netToOrg: amountCents,
    };
  } else {
    // Nonprofit absorbs fees
    const processingFee =
      paymentMethod === "ach"
        ? Math.round(processingFixed)
        : Math.round(amountCents * processingRate + processingFixed);
    const platformFee = Math.round(amountCents * platformRate);
    const netToOrg = amountCents - processingFee - platformFee;

    return {
      donationAmount: amountCents,
      processingFee,
      platformFee,
      totalCharged: amountCents,
      netToOrg,
    };
  }
}
