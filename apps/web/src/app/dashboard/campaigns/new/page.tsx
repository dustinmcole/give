"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { createCampaign } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // strip special chars
    .replace(/[\s_]+/g, "-")          // spaces/underscores → hyphens
    .replace(/-{2,}/g, "-")           // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");         // trim leading/trailing hyphens
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && slug.length >= 2;
}

function isValidHex(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

// ─── Section wrapper ──────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id?: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-4 cursor-pointer group"
    >
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-10 h-6 rounded-full transition-colors ${
            checked ? "bg-give-primary" : "bg-gray-200"
          }`}
        />
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// ─── Form state ───────────────────────────────────────────

interface FormState {
  title: string;
  slug: string;
  description: string;
  type: "donation" | "peer_to_peer" | "event" | "membership";
  status: "draft" | "active";
  goalDollars: string;
  coverImageUrl: string;
  color: string;
  showDonorRoll: boolean;
  showGoal: boolean;
  allowRecurring: boolean;
  allowCustomAmount: boolean;
  startDate: string;
  endDate: string;
}

const DEFAULT_FORM: FormState = {
  title: "",
  slug: "",
  description: "",
  type: "donation",
  status: "draft",
  goalDollars: "",
  coverImageUrl: "",
  color: "#2563eb",
  showDonorRoll: true,
  showGoal: true,
  allowRecurring: true,
  allowCustomAmount: true,
  startDate: "",
  endDate: "",
};

// ─── Page ─────────────────────────────────────────────────

export default function NewCampaignPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  // ── Auto-generate slug from title ──────────────────────
  useEffect(() => {
    if (!slugEdited && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }));
    }
  }, [form.title, slugEdited]);

  // ── Field update helper ────────────────────────────────
  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    set("title", e.target.value);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugEdited(true);
    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  }

  // ── Validation ──────────────────────────────────────────
  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.title.trim()) {
      newErrors.title = "Campaign name is required.";
    }

    if (!form.slug.trim()) {
      newErrors.slug = "URL slug is required.";
    } else if (!isValidSlug(form.slug)) {
      newErrors.slug =
        "Slug must be 2+ characters: lowercase letters, numbers, and hyphens only — not starting or ending with a hyphen.";
    }

    if (form.goalDollars) {
      const v = parseFloat(form.goalDollars);
      if (isNaN(v) || v <= 0) {
        newErrors.goalDollars = "Goal must be a positive number.";
      }
    }

    if (form.coverImageUrl && !form.coverImageUrl.startsWith("http")) {
      newErrors.coverImageUrl = "Cover image must be a valid URL starting with http(s).";
    }

    if (form.color && !isValidHex(form.color)) {
      newErrors.color = "Color must be a valid hex code (e.g. #2563eb).";
    }

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      newErrors.endDate = "End date must be after the start date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError(null);
    setIsSubmitting(true);

    const goalCents = form.goalDollars
      ? Math.round(parseFloat(form.goalDollars) * 100)
      : undefined;

    try {
      await createCampaign({
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        status: form.status,
        goalAmountCents: goalCents,
        orgId: "org_placeholder", // replaced by Clerk auth in production
        coverImageUrl: form.coverImageUrl.trim() || null,
        color: form.color && isValidHex(form.color) ? form.color : null,
        showDonorRoll: form.showDonorRoll,
        showGoal: form.showGoal,
        allowRecurring: form.allowRecurring,
        allowCustomAmount: form.allowCustomAmount,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      }, getToken);

      router.push("/dashboard/campaigns?created=1");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to create campaign. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  const previewSlug = form.slug || "your-campaign-slug";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Breadcrumb ──────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/dashboard/campaigns"
          className="hover:text-gray-700 transition-colors"
        >
          Campaigns
        </Link>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-900 font-medium">New Campaign</span>
      </div>

      {/* ── Header ──────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
        <p className="mt-1 text-sm text-gray-500">
          Launch a new fundraising campaign for your organization.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>

        {/* ── Basic Info ────────────────────────────────── */}
        <Section
          title="Basic Info"
          description="The name and description donors will see on your campaign page."
        >
          {/* Title */}
          <Field
            id="title"
            label="Campaign Name"
            required
            error={errors.title}
          >
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              maxLength={255}
              autoFocus
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/20 transition-all ${
                errors.title
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-give-primary"
              }`}
              placeholder="e.g. Annual Fund 2026"
            />
          </Field>

          {/* Slug */}
          <Field
            id="slug"
            label="URL Slug"
            required
            hint={`Campaign URL: give.fund/your-org/${previewSlug}`}
            error={errors.slug}
          >
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={handleSlugChange}
              maxLength={100}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-give-primary/20 transition-all ${
                errors.slug
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-give-primary"
              }`}
              placeholder="annual-fund-2026"
            />
          </Field>

          {/* Description */}
          <Field id="description" label="Description">
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all resize-none"
              placeholder="Tell donors what you're raising funds for and how it will make a difference…"
            />
          </Field>

          {/* Type + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="type" label="Campaign Type">
              <select
                id="type"
                value={form.type}
                onChange={(e) =>
                  set("type", e.target.value as FormState["type"])
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
              >
                <option value="donation">Donation</option>
                <option value="peer_to_peer">Peer-to-Peer</option>
                <option value="event">Event</option>
                <option value="membership">Membership</option>
              </select>
            </Field>

            <Field id="status" label="Initial Status">
              <select
                id="status"
                value={form.status}
                onChange={(e) =>
                  set("status", e.target.value as FormState["status"])
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
              >
                <option value="draft">Draft — not visible publicly</option>
                <option value="active">Active — live and accepting donations</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* ── Fundraising Goal ──────────────────────────── */}
        <Section
          title="Fundraising Goal"
          description="Optional. Displays a progress thermometer on the campaign page."
        >
          <Field
            id="goalDollars"
            label="Goal Amount (USD)"
            hint="Leave blank for an open-ended campaign with no goal."
            error={errors.goalDollars}
          >
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
                $
              </span>
              <input
                id="goalDollars"
                type="number"
                min="1"
                step="1"
                value={form.goalDollars}
                onChange={(e) => set("goalDollars", e.target.value)}
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/20 transition-all ${
                  errors.goalDollars
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-give-primary"
                }`}
                placeholder="50000"
              />
            </div>
          </Field>

          {/* Live goal preview */}
          {form.goalDollars && parseFloat(form.goalDollars) > 0 && (
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 mb-2 font-medium">Preview</p>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-give-primary" style={{ width: "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                $0 raised of ${parseFloat(form.goalDollars).toLocaleString()} goal
              </p>
            </div>
          )}
        </Section>

        {/* ── Branding ──────────────────────────────────── */}
        <Section
          title="Branding"
          description="Customize the look of your campaign page."
        >
          {/* Cover Image URL */}
          <Field
            id="coverImageUrl"
            label="Cover Image URL"
            hint="Paste a direct HTTPS image URL. Displayed as a full-bleed hero on the campaign page."
            error={errors.coverImageUrl}
          >
            <input
              id="coverImageUrl"
              type="url"
              value={form.coverImageUrl}
              onChange={(e) => set("coverImageUrl", e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/20 transition-all ${
                errors.coverImageUrl
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-give-primary"
              }`}
              placeholder="https://example.com/campaign-cover.jpg"
            />
          </Field>

          {/* Color picker */}
          <Field
            id="colorText"
            label="Brand Color"
            hint="Used for buttons, progress bars, and accents on the campaign page."
            error={errors.color}
          >
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={isValidHex(form.color) ? form.color : "#2563eb"}
                onChange={(e) => set("color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
                aria-label="Pick brand color"
              />
              <input
                id="colorText"
                type="text"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                maxLength={7}
                className={`w-36 px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-give-primary/20 transition-all ${
                  errors.color
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-give-primary"
                }`}
                placeholder="#2563eb"
              />
              {isValidHex(form.color) && (
                <div
                  className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: form.color }}
                  aria-hidden="true"
                />
              )}
            </div>
          </Field>
        </Section>

        {/* ── Settings ──────────────────────────────────── */}
        <Section
          title="Settings"
          description="Control what donors see and how they can give."
        >
          <div className="space-y-5">
            <Toggle
              id="showGoal"
              label="Show fundraising goal"
              description="Display the progress bar and goal amount on the campaign page."
              checked={form.showGoal}
              onChange={(v) => set("showGoal", v)}
            />
            <Toggle
              id="showDonorRoll"
              label="Show donor roll"
              description="Show recent donors' names and amounts on the campaign page."
              checked={form.showDonorRoll}
              onChange={(v) => set("showDonorRoll", v)}
            />
            <Toggle
              id="allowRecurring"
              label="Allow recurring donations"
              description="Let donors choose monthly, quarterly, or annual giving."
              checked={form.allowRecurring}
              onChange={(v) => set("allowRecurring", v)}
            />
            <Toggle
              id="allowCustomAmount"
              label="Allow custom amounts"
              description="Let donors enter any amount beyond the suggested presets."
              checked={form.allowCustomAmount}
              onChange={(v) => set("allowCustomAmount", v)}
            />
          </div>
        </Section>

        {/* ── Schedule ──────────────────────────────────── */}
        <Section
          title="Schedule"
          description="Optional start and end dates. Leave blank to run the campaign indefinitely."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="startDate" label="Start Date">
              <input
                id="startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-give-primary focus:ring-2 focus:ring-give-primary/20 transition-all"
              />
            </Field>

            <Field id="endDate" label="End Date" error={errors.endDate}>
              <input
                id="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => {
                  set("endDate", e.target.value);
                  setErrors((prev) => ({ ...prev, endDate: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/20 transition-all ${
                  errors.endDate
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-give-primary"
                }`}
              />
            </Field>
          </div>
        </Section>

        {/* ── Global Error ──────────────────────────────── */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
            <svg
              className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* ── Actions ───────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 pb-8">
          <Link
            href="/dashboard/campaigns"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : form.status === "draft" ? (
                "Save Draft"
              ) : (
                "Create & Launch"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
