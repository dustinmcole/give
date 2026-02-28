export { calculateFees } from "@give/shared";
export type { FeeBreakdown, PlanTier, PaymentMethod } from "@give/shared";

/**
 * Compute the Stripe application_fee_amount from a fee breakdown.
 *
 * The application fee is what Give (the platform) collects via Stripe Connect.
 * This is the platform fee only -- Stripe processing fees are deducted
 * separately by Stripe from the connected account's charge.
 */
export function getApplicationFeeAmount(platformFeeCents: number): number {
  return Math.round(platformFeeCents);
}
