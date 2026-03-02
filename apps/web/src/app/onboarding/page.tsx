"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createOrganization, verifyEin, type EinVerificationResult } from "@/lib/api";

// ─── EIN Verification Status ──────────────────────────────

type EinStatus =
  | "idle"
  | "verifying"
  | "valid"
  | "invalid"
  | "revoked"
  | "error";

interface EinState {
  status: EinStatus;
  orgName?: string;
  city?: string;
  state?: string;
}

// ─── Auto-format EIN as XX-XXXXXXX ───────────────────────

function formatEin(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

export default function OnboardingStep1() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    ein: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [einState, setEinState] = useState<EinState>({ status: "idle" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "ein") {
      const formatted = formatEin(value);
      setFormData((prev) => ({ ...prev, ein: formatted }));
      // Reset EIN state when user edits the field
      if (einState.status !== "idle") {
        setEinState({ status: "idle" });
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Verify EIN on blur if 9 digits are present
  const handleEinBlur = useCallback(async () => {
    const digits = formData.ein.replace(/\D/g, "");
    if (digits.length !== 9) return; // Not enough digits yet

    setEinState({ status: "verifying" });
    try {
      const result: EinVerificationResult = await verifyEin(digits);

      if (result.revoked) {
        setEinState({ status: "revoked" });
      } else if (result.valid) {
        setEinState({
          status: "valid",
          orgName: result.name,
          city: result.city,
          state: result.state,
        });
      } else {
        setEinState({ status: "invalid" });
      }
    } catch {
      setEinState({ status: "error" });
    }
  }, [formData.ein]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.name.trim()) {
      setError("Organization Name is required");
      return;
    }
    if (!formData.slug.trim()) {
      setError("Organization Slug is required");
      return;
    }
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(formData.slug)) {
      setError(
        "Slug must be lowercase alphanumeric with hyphens, and cannot start or end with a hyphen"
      );
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("A valid Email is required");
      return;
    }

    // Validate EIN format if provided
    const einDigits = formData.ein.replace(/\D/g, "");
    if (formData.ein.trim() && einDigits.length !== 9) {
      setError("EIN must be 9 digits in XX-XXXXXXX format");
      return;
    }

    // Block submit for revoked orgs
    if (einState.status === "revoked") {
      setError(
        "This organization's tax-exempt status has been revoked. Please contact the IRS before proceeding."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await createOrganization({
        name: formData.name,
        slug: formData.slug,
        email: formData.email,
        ein: formData.ein.trim() || undefined,
      });

      router.push(`/onboarding/stripe?orgId=${response.org.id}`);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(
        err.message || "Failed to create organization. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── EIN feedback UI ──────────────────────────────────

  const renderEinFeedback = () => {
    switch (einState.status) {
      case "verifying":
        return (
          <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
            <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Checking IRS records…
          </p>
        );
      case "valid":
        return (
          <p className="mt-1.5 text-xs text-green-700 flex items-center gap-1">
            <span aria-hidden>✅</span>
            <span>
              Verified: <strong>{einState.orgName}</strong>
              {einState.city && einState.state
                ? ` · ${einState.city}, ${einState.state}`
                : ""}
            </span>
          </p>
        );
      case "invalid":
        return (
          <p className="mt-1.5 text-xs text-amber-700 flex items-center gap-1">
            <span aria-hidden>⚠️</span>
            EIN not found in IRS records — you can still continue and add it
            later.
          </p>
        );
      case "revoked":
        return (
          <p className="mt-1.5 text-xs text-red-700 flex items-center gap-1">
            <span aria-hidden>🚫</span>
            This organization&apos;s tax-exempt status has been revoked by the
            IRS.
          </p>
        );
      case "error":
        return (
          <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
            <span aria-hidden>⚠️</span>
            Verification service unavailable — you can still continue.
          </p>
        );
      default:
        return null;
    }
  };

  const einBorderClass =
    einState.status === "valid"
      ? "border-green-400 focus:border-green-500 focus:ring-green-200"
      : einState.status === "revoked"
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : einState.status === "invalid"
      ? "border-amber-400 focus:border-amber-500 focus:ring-amber-200"
      : "border-gray-300 focus:ring-give-primary/20 focus:border-give-primary";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-900">
        Step 1: Organization Details
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Tell us about your nonprofit so we can set up your account.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Hope Foundation"
            className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-give-primary/20 focus:border-give-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Slug
          </label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g. hope-foundation"
            className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-give-primary/20 focus:border-give-primary transition-colors"
          />
          <p className="mt-1 text-xs text-gray-400">
            This will be your donation page URL: give.fund/
            {formData.slug || "hope-foundation"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. hello@hopefoundation.org"
            className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-give-primary/20 focus:border-give-primary transition-colors"
          />
        </div>

        {/* ─── EIN Field ─────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            EIN (Employer Identification Number)
            <span className="ml-1.5 text-xs font-normal text-gray-400">
              Optional
            </span>
          </label>
          <input
            type="text"
            name="ein"
            value={formData.ein}
            onChange={handleChange}
            onBlur={handleEinBlur}
            placeholder="XX-XXXXXXX"
            maxLength={10}
            inputMode="numeric"
            autoComplete="off"
            className={`block w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 transition-colors ${einBorderClass}`}
          />
          <p className="mt-1 text-xs text-gray-400">
            Your organization&apos;s 9-digit IRS tax ID. Found on your IRS
            determination letter.
          </p>
          {renderEinFeedback()}
          {einState.status === "idle" && (
            <p className="mt-1 text-xs text-gray-400">
              <button
                type="button"
                className="text-give-primary underline hover:no-underline"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, ein: "" }))
                }
                tabIndex={-1}
              >
                Skip for now, add later in Settings
              </button>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || einState.status === "revoked"}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Continue to Stripe Setup"}
        </button>
      </form>
    </div>
  );
}
