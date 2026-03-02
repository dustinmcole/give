import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

// --- Frequency to Stripe interval map ---

export interface StripeInterval {
  interval: "month" | "year";
  interval_count: number;
}

const FREQUENCY_INTERVAL_MAP: Record<string, StripeInterval> = {
  monthly: { interval: "month", interval_count: 1 },
  quarterly: { interval: "month", interval_count: 3 },
  annual: { interval: "year", interval_count: 1 },
};

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

/**
 * Create (or retrieve existing) a Stripe Customer on the connected account.
 * Searches by email to avoid duplicate customers.
 */
export async function findOrCreateCustomer(
  email: string,
  name: string,
  stripeAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.Customer> {
  // Search for existing customer by email on connected account
  const existing = await stripe.customers.search(
    { query: `email:"${email}"`, limit: 1 },
    { stripeAccount: stripeAccountId }
  );

  if (existing.data.length > 0) {
    return existing.data[0]!;
  }

  return stripe.customers.create(
    {
      email,
      name,
      metadata,
    },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Create a Stripe Subscription for a recurring donation.
 * Uses default_incomplete payment_behavior so the initial PaymentIntent
 * is returned and can be confirmed via the Payment Element.
 *
 * Returns the Subscription (with latest_invoice expanded to payment_intent).
 */
export async function createSubscription(options: {
  customerId: string;
  amountCents: number;
  currency: string;
  frequency: "monthly" | "quarterly" | "annual";
  applicationFeePercent: number;
  stripeAccountId: string;
  metadata: Record<string, string>;
}): Promise<Stripe.Subscription> {
  const {
    customerId,
    amountCents,
    currency,
    frequency,
    applicationFeePercent,
    stripeAccountId,
    metadata,
  } = options;

  const intervalConfig = FREQUENCY_INTERVAL_MAP[frequency];
  if (!intervalConfig) {
    throw new Error(`Unsupported frequency: ${frequency}`);
  }

  // Create a one-off product for this donation subscription
  const product = await stripe.products.create(
    { name: "Recurring Donation" },
    { stripeAccount: stripeAccountId }
  );

  return stripe.subscriptions.create(
    {
      customer: customerId,
      items: [
        {
          price_data: {
            currency,
            unit_amount: amountCents,
            product: product.id,
            recurring: {
              interval: intervalConfig.interval,
              interval_count: intervalConfig.interval_count,
            },
          },
        },
      ],
      application_fee_percent: applicationFeePercent,
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      metadata,
    },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Compute application_fee_percent from platform fee and total amount.
 * Returns a percentage (0-100) rounded to 2 decimal places.
 */
export function computeApplicationFeePercent(
  platformFeeCents: number,
  totalChargedCents: number
): number {
  if (totalChargedCents === 0) return 0;
  return Math.round((platformFeeCents / totalChargedCents) * 100 * 100) / 100;
}
