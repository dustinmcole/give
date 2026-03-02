"use client";

import { useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

// Give brand appearance for Stripe Elements
const appearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#2563eb",
    colorBackground: "#ffffff",
    colorText: "#111827",
    colorDanger: "#dc2626",
    colorSuccess: "#16a34a",
    colorTextPlaceholder: "#9ca3af",
    borderRadius: "8px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSizeBase: "14px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "2px solid #e5e7eb",
      boxShadow: "none",
      padding: "12px 16px",
      transition: "border-color 0.15s ease",
    },
    ".Input:focus": {
      border: "2px solid #2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
      outline: "none",
    },
    ".Input--invalid": {
      border: "2px solid #dc2626",
    },
    ".Label": {
      color: "#374151",
      fontWeight: "500",
      marginBottom: "6px",
    },
    ".Tab": {
      border: "2px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: "none",
    },
    ".Tab:hover": {
      borderColor: "#2563eb",
    },
    ".Tab--selected": {
      borderColor: "#2563eb",
      color: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
    },
    ".TabIcon--selected": {
      fill: "#2563eb",
    },
    ".TabLabel--selected": {
      color: "#2563eb",
    },
  },
};

interface StripeProviderProps {
  clientSecret: string;
  stripeAccount: string;
  children: React.ReactNode;
}

export default function StripeProvider({
  clientSecret,
  stripeAccount,
  children,
}: StripeProviderProps) {
  // Load Stripe with the connected account for Stripe Connect
  const stripePromise = useMemo(
    () =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "", {
        stripeAccount,
      }),
    [stripeAccount]
  );

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
