"use client";

import { useEffect, useState } from "react";

export interface CurrentOrg {
  id: string;
  name: string;
  slug: string;
}

interface UseCurrentOrgResult {
  org: CurrentOrg | null;
  orgId: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches the current user's organization via the /api/me/org Next.js route.
 * Automatically redirects to /onboarding if the user has no org (404).
 */
export function useCurrentOrg(): UseCurrentOrgResult {
  const [org, setOrg] = useState<CurrentOrg | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrg() {
      try {
        const res = await fetch("/api/me/org", { cache: "no-store" });

        if (cancelled) return;

        if (res.status === 401) {
          // Middleware handles redirecting unauthenticated users, but guard here
          return;
        }

        if (res.status === 404) {
          // User has no org → redirect to onboarding
          window.location.href = "/onboarding";
          return;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(
            (body as { error?: string }).error ?? `HTTP ${res.status}`
          );
        }

        const data = (await res.json()) as CurrentOrg;
        if (!cancelled) setOrg(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchOrg();

    return () => {
      cancelled = true;
    };
  }, []);

  return { org, orgId: org?.id ?? null, loading, error };
}
