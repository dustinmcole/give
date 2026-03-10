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
 * Create a Stripe Customer on a connected account.
 */
export async function createStripeCustomer(
  email: string,
  name: string,
  stripeAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.Customer> {
  return stripe.customers.create(
    { email, name, metadata },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Create a Stripe Price (inline product) for a subscription on a connected account.
 */
export async function createSubscriptionPrice(
  amountCents: number,
  currency: string,
  interval: "month" | "year" | "week",
  stripeAccountId: string,
  productName: string
): Promise<Stripe.Price> {
  return stripe.prices.create(
    {
      currency,
      unit_amount: amountCents,
      recurring: { interval },
      product_data: { name: productName },
    },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Create a Stripe Subscription on a connected account.
 * Returns the subscription with the latest invoice's payment intent expanded.
 */
export async function createSubscription(
  customerId: string,
  priceId: string,
  applicationFeePercent: number,
  stripeAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create(
    {
      customer: customerId,
      items: [{ price: priceId }],
      application_fee_percent: applicationFeePercent,
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      metadata,
    },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Cancel a Stripe Subscription immediately.
 */
export async function cancelSubscription(
  subscriptionId: string,
  stripeAccountId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(
    subscriptionId,
    {},
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Update the amount of a Stripe Subscription (replace the price item).
 */
export async function updateSubscriptionAmount(
  subscriptionId: string,
  newAmountCents: number,
  currency: string,
  interval: "month" | "year" | "week",
  stripeAccountId: string,
  productName: string
): Promise<Stripe.Subscription> {
  // Create a new price for the new amount
  const newPrice = await createSubscriptionPrice(
    newAmountCents,
    currency,
    interval,
    stripeAccountId,
    productName
  );

  // Get current subscription to find the item ID
  const sub = await stripe.subscriptions.retrieve(
    subscriptionId,
    {},
    { stripeAccount: stripeAccountId }
  );

  return stripe.subscriptions.update(
    subscriptionId,
    {
      items: [
        {
          id: sub.items.data[0]?.id,
          price: newPrice.id,
        },
      ],
      proration_behavior: "create_prorations",
    },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Create a Stripe Billing Portal session for a customer.
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
  stripeAccountId: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create(
    {
      customer: customerId,
      return_url: returnUrl,
    },
    { stripeAccount: stripeAccountId }
  );
}

/**
 * Compute application_fee_percent from fixed fee cents and total amount cents.
 */
export function computeApplicationFeePercent(
  platformFeeCents: number,
  totalCents: number
): number {
  if (totalCents === 0) return 0;
  return Math.round((platformFeeCents / totalCents) * 10000) / 100;
}
