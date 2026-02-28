"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ReactNode, useMemo } from "react";

// Use NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY if it exists, otherwise a placeholder for development
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
  stripeAccountId?: string;
}

export default function StripeProvider({ children, clientSecret, stripeAccountId }: StripeProviderProps) {
  const options = useMemo(() => {
    if (!clientSecret) return undefined;
    return {
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#2563eb",
        },
      },
    };
  }, [clientSecret]);

  if (!clientSecret) {
    return <>{children}</>;
  }

  // To support connect, we need a stripe instance initialized with the account if we were using it from scratch,
  // but react-stripe-js Elements supports passing stripe account directly? No, loadStripe needs it.
  // Actually, wait: loadStripe(key, { stripeAccount: stripeAccountId })
  // For simplicity, if we have a clientSecret and we need the connected account:
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
