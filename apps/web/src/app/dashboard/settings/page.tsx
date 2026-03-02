"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { getOrg, updateOrg, type Org, type UpdateOrgInput } from "@/lib/api";

// ── Hardcoded demo org ID — replace with session/context once auth lands ──────
// In production this comes from the user session / org context provider.
const DEMO_ORG_ID = process.env.NEXT_PUBLIC_DEMO_ORG_ID ?? "demo";

// ── Toast ──────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let _toastId = 0;

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  }, []);
  return { toasts, addToast };
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 pointer-events-auto",
            t.type === "success" ? "bg-emerald-600" : "bg-red-600",
          ].join(" ")}
        >
          {t.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Confirmation Modal ─────────────────────────────────────────────────────────

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  busy,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={[
        "bg-white rounded-xl border p-6 space-y-6",
        danger ? "border-red-200" : "border-gray-100",
      ].join(" ")}
    >
      <div>
        <h2
          className={[
            "text-base font-semibold",
            danger ? "text-red-700" : "text-gray-900",
          ].join(" ")}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1.5"
    >
      {children}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors";
const disabledCls =
  "w-full px-3 py-2 text-sm border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed";

// ── Form types ─────────────────────────────────────────────────────────────────

type PayoutSchedule = "DAILY" | "WEEKLY" | "MONTHLY" | "MANUAL";

interface FormState {
  name: string;
  slug: string;
  website: string;
  logoUrl: string;
  payoutSchedule: PayoutSchedule;
  defaultCurrency: string;
  coverFeesDefault: boolean;
}

function orgToForm(org: Org): FormState {
  return {
    name: org.name,
    slug: org.slug,
    website: org.website ?? "",
    logoUrl: org.logoUrl ?? "",
    payoutSchedule: org.payoutSchedule,
    defaultCurrency: org.defaultCurrency,
    coverFeesDefault: org.coverFeesDefault,
  };
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [org, setOrg] = useState<Org | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toasts, addToast } = useToast();

  const hasChanges =
    org !== null &&
    form !== null &&
    JSON.stringify(orgToForm(org)) !== JSON.stringify(form);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrg(DEMO_ORG_ID, getToken)
      .then((data: Org) => {
        if (!cancelled) {
          setOrg(data);
          setForm(orgToForm(data));
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          console.error(err);
          setLoadError(
            "Failed to load organization settings. Is the API running?"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!form || !org) return;
    setSaving(true);
    try {
      const payload: UpdateOrgInput = {
        name: form.name,
        slug: form.slug,
        website: form.website || null,
        logoUrl: form.logoUrl || null,
        payoutSchedule: form.payoutSchedule,
        defaultCurrency: form.defaultCurrency,
        coverFeesDefault: form.coverFeesDefault,
      };
      const updated = await updateOrg(org.id, payload, getToken);
      setOrg(updated);
      setForm(orgToForm(updated));
      addToast("success", "Settings saved successfully.");
    } catch (err: unknown) {
      addToast(
        "error",
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!org) return;
    setDeactivating(true);
    try {
      const updated = await updateOrg(org.id, { status: "DEACTIVATED" }, getToken);
      setOrg(updated);
      setForm(orgToForm(updated));
      setShowDeactivateModal(false);
      addToast("success", "Organization has been deactivated.");
    } catch (err: unknown) {
      addToast(
        "error",
        `Failed to deactivate: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setDeactivating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span className="text-sm">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  if (!org || !form) return null;

  const isDeactivated = org.status === "DEACTIVATED";

  return (
    <>
      <ToastContainer toasts={toasts} />

      <ConfirmModal
        open={showDeactivateModal}
        title="Deactivate organization?"
        description="This will mark your organization as deactivated. Existing campaigns will stop accepting donations. This can be reversed by contacting support."
        confirmLabel="Yes, deactivate"
        busy={deactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setShowDeactivateModal(false)}
      />

      <div className="space-y-8">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization profile, payment settings, and more.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {hasChanges && (
              <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && (
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* ── Organization Details ────────────────────────── */}
        <Section
          title="Organization Details"
          description="Basic information about your nonprofit."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <FieldLabel htmlFor="org-name">Organization name</FieldLabel>
              <input
                id="org-name"
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="My Nonprofit"
                className={inputCls}
              />
            </div>

            {/* Slug */}
            <div>
              <FieldLabel htmlFor="org-slug">URL slug</FieldLabel>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-400 pointer-events-none select-none">
                  give.app/
                </span>
                <input
                  id="org-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setField(
                      "slug",
                      e.target.value.toLowerCase().replace(/\s+/g, "-")
                    )
                  }
                  placeholder="my-nonprofit"
                  className={`${inputCls} pl-[72px]`}
                />
              </div>
            </div>

            {/* EIN -- read-only after set */}
            <div>
              <FieldLabel htmlFor="org-ein">
                EIN
                {org.ein && (
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    (read-only)
                  </span>
                )}
              </FieldLabel>
              <input
                id="org-ein"
                type="text"
                value={org.ein ?? "Not set"}
                readOnly
                disabled
                className={disabledCls}
              />
              {org.ein && (
                <p className="mt-1 text-xs text-gray-400">
                  EIN cannot be changed after it has been set. Contact support
                  if needed.
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <FieldLabel htmlFor="org-website">Website</FieldLabel>
              <input
                id="org-website"
                type="url"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
                placeholder="https://www.example.org"
                className={inputCls}
              />
            </div>

            {/* Logo URL */}
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="org-logo">Logo URL</FieldLabel>
              <input
                id="org-logo"
                type="url"
                value={form.logoUrl}
                onChange={(e) => setField("logoUrl", e.target.value)}
                placeholder="https://cdn.example.org/logo.png"
                className={inputCls}
              />
              {form.logoUrl && (
                <div className="mt-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logoUrl}
                    alt="Logo preview"
                    className="h-12 w-12 rounded-lg object-contain border border-gray-100 bg-gray-50"
                    onError={(e) => {
                      (
                        e.currentTarget as HTMLImageElement
                      ).style.display = "none";
                    }}
                  />
                  <span className="text-xs text-gray-400">Preview</span>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* ── Payment Settings ────────────────────────────── */}
        <Section
          title="Payment Settings"
          description="Configure how donations are processed and paid out to your organization."
        >
          {/* Stripe connection status */}
          <div
            className={[
              "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm",
              org.stripeOnboarded
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-amber-50 border-amber-200 text-amber-800",
            ].join(" ")}
          >
            <span
              className={[
                "w-2 h-2 rounded-full shrink-0",
                org.stripeOnboarded ? "bg-emerald-500" : "bg-amber-500",
              ].join(" ")}
            />
            <div className="flex-1 min-w-0">
              <span className="font-medium">
                {org.stripeOnboarded
                  ? "Stripe connected"
                  : "Stripe not connected"}
              </span>
              {!org.stripeOnboarded && (
                <span className="text-amber-700 ml-1">
                  Complete onboarding to accept donations.
                </span>
              )}
            </div>
            {!org.stripeOnboarded && (
              <a
                href={`/onboarding?orgId=${org.id}`}
                className="shrink-0 text-xs font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900"
              >
                Continue setup
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Payout schedule */}
            <div>
              <FieldLabel htmlFor="payout-schedule">Payout schedule</FieldLabel>
              <select
                id="payout-schedule"
                value={form.payoutSchedule}
                onChange={(e) =>
                  setField("payoutSchedule", e.target.value as PayoutSchedule)
                }
                className={inputCls}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="MANUAL">Manual</option>
              </select>
              <p className="mt-1.5 text-xs text-gray-400">
                How often Stripe transfers funds to your bank account.
              </p>
            </div>

            {/* Default currency */}
            <div>
              <FieldLabel htmlFor="default-currency">
                Default currency
              </FieldLabel>
              <select
                id="default-currency"
                value={form.defaultCurrency}
                onChange={(e) => setField("defaultCurrency", e.target.value)}
                className={inputCls}
              >
                <option value="usd">USD - US Dollar</option>
                <option value="cad">CAD - Canadian Dollar</option>
                <option value="gbp">GBP - British Pound</option>
                <option value="eur">EUR - Euro</option>
                <option value="aud">AUD - Australian Dollar</option>
              </select>
            </div>
          </div>

          {/* Cover-fees toggle */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.coverFeesDefault}
              onClick={() =>
                setField("coverFeesDefault", !form.coverFeesDefault)
              }
              className={[
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 shrink-0 mt-0.5",
                form.coverFeesDefault ? "bg-blue-600" : "bg-gray-200",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                  form.coverFeesDefault
                    ? "translate-x-[18px]"
                    : "translate-x-[3px]",
                ].join(" ")}
              />
            </button>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Suggest "Cover fees" by default
              </span>
              <p className="mt-0.5 text-xs text-gray-400">
                Pre-checks the cover-fees option on donation forms, encouraging
                donors to cover processing costs.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Danger Zone ─────────────────────────────────── */}
        <Section
          title="Danger Zone"
          description="Irreversible actions that affect your organization."
          danger
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Deactivate organization
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                Pause all active campaigns and stop accepting donations. Contact
                support to reactivate.
              </p>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              disabled={isDeactivated}
              className="shrink-0 px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isDeactivated
                ? "Organization deactivated"
                : "Deactivate organization"}
            </button>
          </div>
        </Section>
      </div>
    </>
  );
}
