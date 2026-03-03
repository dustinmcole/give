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

/**
 * Create or retrieve a Stripe Customer on a connected account.
 */
export async function createOrFindCustomer(
  email: string,
  name: string,
  stripeAccountId: string
): Promise<Stripe.Customer> {
  // Search for existing customer by email on the connected account
  const existing = await stripe.customers.list(
    { email, limit: 1 },
    { stripeAccount: stripeAccountId }
  );

  if (existing.data.length > 0) {
    return existing.data[0];
  }

  return stripe.customers.create(
    { email, name, metadata: { platform: "give" } },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Map donation frequency to Stripe interval parameters.
 */
export function frequencyToInterval(
  frequency: "monthly" | "quarterly" | "annual"
): { interval: Stripe.PriceCreateParams.Recurring.Interval; interval_count: number } {
  switch (frequency) {
    case "monthly":
      return { interval: "month", interval_count: 1 };
    case "quarterly":
      return { interval: "month", interval_count: 3 };
    case "annual":
      return { interval: "year", interval_count: 1 };
  }
}

/**
 * Create a Stripe Subscription on a connected account with an inline price.
 * Uses payment_behavior: "default_incomplete" so the initial PaymentIntent
 * can be confirmed by the frontend before the subscription activates.
 */
export async function createSubscription(
  customerId: string,
  amountCents: number,
  frequency: "monthly" | "quarterly" | "annual",
  applicationFeePercent: number,
  stripeAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.Subscription> {
  const { interval, interval_count } = frequencyToInterval(frequency);

  // Create an inline price (Stripe subscription items use price ID, not price_data)
  const price = await stripe.prices.create(
    {
      currency: "usd",
      unit_amount: amountCents,
      recurring: { interval, interval_count },
      product_data: {
        name: "Recurring Donation",
        metadata: { platform: "give" },
      },
    },
    { stripeAccount: stripeAccountId }
  );

  return stripe.subscriptions.create(
    {
      customer: customerId,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: ["card"],
      },
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: applicationFeePercent,
      metadata,
    },
    { stripeAccount: stripeAccountId }
  );
}
