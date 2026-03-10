"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Subscription {
  donationId: string;
  subscriptionId: string | null;
  amountCents: number;
  frequency: string;
  status: string;
  campaign: { id: string; title: string; slug: string };
  org: { id: string; name: string; logoUrl: string | null };
  createdAt: string;
}

interface ManageData {
  donor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subscriptions: Subscription[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

const FREQUENCY_LABELS: Record<string, string> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUAL: "Annual",
  ONE_TIME: "One-time",
};

const STATUS_COLORS: Record<string, string> = {
  SUCCEEDED: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  FAILED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function ManagePage() {
  const params = useParams();
  const token = params.donorToken as string;

  const [data, setData] = useState<ManageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [updateAmount, setUpdateAmount] = useState<{
    subscriptionId: string;
    value: string;
  } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/manage/${token}`)
      .then((r) => r.json())
      .then((d: ManageData & { error?: string }) => {
        if (d.error) {
          setError(d.error);
        } else {
          setData(d);
        }
      })
      .catch(() => setError("Failed to load subscription data."))
      .finally(() => setLoading(false));
  }, [token]);

  async function openPortal() {
    setActionLoading("portal");
    try {
      const res = await fetch(`${API_URL}/api/manage/${token}/portal`, {
        method: "POST",
      });
      const d = await res.json();
      if (d.portalUrl) {
        window.location.href = d.portalUrl;
      } else {
        setError(d.error ?? "Failed to open billing portal.");
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function cancelSubscription(subscriptionId: string) {
    setActionLoading(`cancel-${subscriptionId}`);
    try {
      const res = await fetch(`${API_URL}/api/manage/${token}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      const d = await res.json();
      if (d.success) {
        setSuccessMsg("Your recurring donation has been cancelled.");
        setData((prev) =>
          prev
            ? {
                ...prev,
                subscriptions: prev.subscriptions.map((s) =>
                  s.subscriptionId === subscriptionId
                    ? { ...s, status: "FAILED" }
                    : s
                ),
              }
            : prev
        );
      } else {
        setError(d.error ?? "Failed to cancel subscription.");
      }
    } finally {
      setActionLoading(null);
      setCancelConfirm(null);
    }
  }

  async function updateDonationAmount(
    subscriptionId: string,
    amountStr: string
  ) {
    const newAmountCents = Math.round(parseFloat(amountStr) * 100);
    if (isNaN(newAmountCents) || newAmountCents < 100) {
      setError("Please enter a valid amount (minimum $1.00).");
      return;
    }

    setActionLoading(`update-${subscriptionId}`);
    try {
      const res = await fetch(`${API_URL}/api/manage/${token}/update-amount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, newAmountCents }),
      });
      const d = await res.json();
      if (d.success) {
        setSuccessMsg(`Donation amount updated to ${formatCents(newAmountCents)}.`);
        setData((prev) =>
          prev
            ? {
                ...prev,
                subscriptions: prev.subscriptions.map((s) =>
                  s.subscriptionId === subscriptionId
                    ? { ...s, amountCents: newAmountCents }
                    : s
                ),
              }
            : prev
        );
        setUpdateAmount(null);
      } else {
        setError(d.error ?? "Failed to update amount.");
      }
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">Loading your donations…</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">!</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load
          </h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <p className="text-xs text-gray-400">
            This link may be invalid or expired. Please check your receipt email
            for the correct link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-give-primary tracking-tight">
            Give
          </Link>
          <span className="text-sm text-gray-500">Manage your donations</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {data && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Hi {data.donor.firstName} 👋
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage your recurring donations below, or{" "}
                <button
                  onClick={openPortal}
                  disabled={actionLoading === "portal"}
                  className="text-give-primary underline hover:no-underline disabled:opacity-50"
                >
                  {actionLoading === "portal"
                    ? "Opening portal…"
                    : "open the full billing portal"}
                </button>{" "}
                to update your payment method.
              </p>
            </div>

            {successMsg && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-800 text-sm flex items-center gap-2">
                <span>✓</span>
                <span>{successMsg}</span>
                <button
                  onClick={() => setSuccessMsg(null)}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 text-sm flex items-center gap-2">
                <span>!</span>
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            )}

            {data.subscriptions.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-sm">
                  No active recurring donations found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.subscriptions.map((sub) => {
                  const isCancelled = sub.status === "FAILED";
                  return (
                    <div
                      key={sub.donationId}
                      className="bg-white rounded-xl border border-gray-200 p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatCents(sub.amountCents)}{" "}
                            <span className="font-normal text-gray-500">
                              / {FREQUENCY_LABELS[sub.frequency] ?? sub.frequency}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {sub.campaign.title} · {sub.org.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Started{" "}
                            {new Date(sub.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                            STATUS_COLORS[sub.status] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {isCancelled ? "Cancelled" : sub.status.charAt(0) + sub.status.slice(1).toLowerCase()}
                        </span>
                      </div>

                      {!isCancelled && sub.subscriptionId && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                          {/* Update amount */}
                          {updateAmount?.subscriptionId === sub.subscriptionId ? (
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                min="1"
                                step="0.01"
                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-give-primary"
                                value={updateAmount.value}
                                onChange={(e) =>
                                  setUpdateAmount({
                                    subscriptionId: sub.subscriptionId!,
                                    value: e.target.value,
                                  })
                                }
                                placeholder={(sub.amountCents / 100).toFixed(2)}
                              />
                              <button
                                disabled={
                                  actionLoading === `update-${sub.subscriptionId}`
                                }
                                onClick={() =>
                                  updateDonationAmount(
                                    sub.subscriptionId!,
                                    updateAmount.value
                                  )
                                }
                                className="px-3 py-1.5 bg-give-primary text-white rounded-md text-sm font-medium disabled:opacity-50 hover:bg-give-primary/90"
                              >
                                {actionLoading === `update-${sub.subscriptionId}`
                                  ? "Saving…"
                                  : "Save"}
                              </button>
                              <button
                                onClick={() => setUpdateAmount(null)}
                                className="px-3 py-1.5 text-gray-500 rounded-md text-sm hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setUpdateAmount({
                                  subscriptionId: sub.subscriptionId!,
                                  value: (sub.amountCents / 100).toFixed(2),
                                })
                              }
                              className="text-sm text-give-primary font-medium hover:underline"
                            >
                              Change amount
                            </button>
                          )}

                          {/* Cancel */}
                          {cancelConfirm === sub.subscriptionId ? (
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-sm text-gray-700">
                                Cancel your recurring donation?
                              </span>
                              <button
                                disabled={
                                  actionLoading === `cancel-${sub.subscriptionId}`
                                }
                                onClick={() =>
                                  cancelSubscription(sub.subscriptionId!)
                                }
                                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50 hover:bg-red-700"
                              >
                                {actionLoading === `cancel-${sub.subscriptionId}`
                                  ? "Cancelling…"
                                  : "Yes, cancel"}
                              </button>
                              <button
                                onClick={() => setCancelConfirm(null)}
                                className="px-3 py-1.5 text-gray-500 rounded-md text-sm hover:text-gray-700"
                              >
                                Keep it
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setCancelConfirm(sub.subscriptionId!)
                              }
                              className="text-sm text-red-500 font-medium hover:underline"
                            >
                              Cancel donation
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
