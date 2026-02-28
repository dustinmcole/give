import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/**
 * Create a Stripe Connect Express account for a nonprofit org.
 */
export async function createConnectAccount(
  orgName: string,
  email: string
): Promise<Stripe.Account> {
  return stripe.accounts.create({
    type: "express",
    country: "US",
    email,
    business_type: "non_profit",
    company: {
      name: orgName,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
      us_bank_account_ach_payments: { requested: true },
    },
    metadata: {
      platform: "give",
    },
  });
}

/**
 * Generate an account link for Stripe Connect onboarding / dashboard access.
 */
export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
): Promise<Stripe.AccountLink> {
  return stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });
}

/**
 * Create a PaymentIntent on a connected account with an application fee.
 */
export async function createPaymentIntent(
  amountCents: number,
  applicationFeeCents: number,
  stripeAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    application_fee_amount: applicationFeeCents,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  }, {
    stripeAccount: stripeAccountId,
  });
}
