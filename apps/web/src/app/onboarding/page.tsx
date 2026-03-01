"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrganization } from "@/lib/api";

export default function OnboardingStep1() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
      setError("Slug must be lowercase alphanumeric with hyphens, and cannot start or end with a hyphen");
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("A valid Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await createOrganization({
        name: formData.name,
        slug: formData.slug,
        email: formData.email,
      });

      // On success: redirect to /onboarding/stripe?orgId=NEW_ID
      router.push(`/onboarding/stripe?orgId=${response.org.id}`);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to create organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            This will be your donation page URL: give.fund/{formData.slug || "hope-foundation"}
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
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Continue to Stripe Setup"}
        </button>
      </form>
    </div>
  );
}
