import type { CreateDonationInput } from "@give/shared";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Auth Token Resolver ──────────────────────────────────
//
// Accepts an optional token getter (e.g. Clerk's `getToken()` from
// `useAuth()` in client components, or a resolved token string from
// server components). When omitted the request is unauthenticated,
// which is correct for public endpoints (donation page, public campaign).

export type TokenGetter =
  | (() => Promise<string | null>)
  | string
  | null
  | undefined;

async function resolveToken(token: TokenGetter): Promise<string | null> {
  if (!token) return null;
  if (typeof token === "string") return token;
  return token();
}

async function request<T>(
  path: string,
  options?: RequestInit & { token?: TokenGetter }
): Promise<T> {
  const { token, ...fetchOptions } = options ?? {};
  const resolvedToken = await resolveToken(token);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ─── Campaign ────────────────────────────────────────────

export interface Campaign {
  id: string;
  orgId: string;
  title: string;
  slug: string;
  description: string;
  type: "donation" | "peer_to_peer" | "event" | "membership";
  status: "draft" | "active" | "paused" | "ended";
  goalCents: number;
  raisedCents: number;
  donationCount: number;
  currency: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  org?: {
    id: string;
    name: string;
    slug: string;
    ein?: string | null;
  };
}

/** Public — no token needed (donation page loads campaign data) */
export function getDonationCampaign(id: string): Promise<Campaign> {
  return request<Campaign>(`/api/campaigns/${id}`);
}

/** Protected — requires auth token */
export function listCampaigns(
  orgId: string,
  token: TokenGetter
): Promise<Campaign[]> {
  return request<{ data: Campaign[] }>(`/api/orgs/${orgId}/campaigns`, { token }).then(
    (r) => r.data
  );
}

export interface CreateCampaignInput {
  title: string;
  slug: string;
  description?: string;
  type?: Campaign["type"];
  status?: Campaign["status"];
  goalAmountCents?: number;
  orgId: string;
  coverImageUrl?: string | null;
  color?: string | null;
  showDonorRoll?: boolean;
  showGoal?: boolean;
  allowRecurring?: boolean;
  allowCustomAmount?: boolean;
  suggestedAmounts?: number[];
  startDate?: string | null;
  endDate?: string | null;
}

export interface UpdateCampaignInput {
  title?: string;
  slug?: string;
  description?: string;
  type?: Campaign["type"];
  status?: Campaign["status"];
  goalAmountCents?: number | null;
  coverImageUrl?: string | null;
  color?: string | null;
  showDonorRoll?: boolean;
  showGoal?: boolean;
  allowRecurring?: boolean;
  allowCustomAmount?: boolean;
  suggestedAmounts?: number[];
  startDate?: string | null;
  endDate?: string | null;
}

/** Public — no token needed (donation page loads campaign) */
export function getCampaign(id: string): Promise<Campaign> {
  return request<Campaign>(`/api/campaigns/${id}`);
}

/** Protected — requires auth token */
export function createCampaign(
  input: CreateCampaignInput,
  token: TokenGetter
): Promise<Campaign> {
  return request<Campaign>("/api/campaigns", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

/** Protected — requires auth token */
export function updateCampaign(
  id: string,
  input: UpdateCampaignInput,
  token: TokenGetter
): Promise<Campaign> {
  return request<Campaign>(`/api/campaigns/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
    token,
  });
}

// ─── Donation ────────────────────────────────────────────

export interface Donation {
  id: string;
  campaignId: string;
  amountCents: number;
  currency: string;
  frequency: string;
  status: string;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
  coverFees: boolean;
  createdAt: string;
}

export interface DonationDetail {
  id: string;
  amountCents: number;
  totalChargedCents: number;
  currency: string;
  frequency: string;
  status: string;
  coverFees: boolean;
  receiptNumber: string | null;
  createdAt: string;
  donor: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    anonymous: boolean;
  };
  campaign: {
    id: string;
    title: string;
    slug: string;
    color: string | null;
    description: string | null;
  };
  org: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    website: string | null;
  };
}

export interface CreateDonationResponse {
  donationId: string;
  clientSecret: string;
}

/** Public — donors are anonymous visitors */
export function createDonation(
  input: CreateDonationInput
): Promise<CreateDonationResponse> {
  return request<CreateDonationResponse>("/api/donations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Public — confirmation page (no auth needed) */
export function getDonation(id: string): Promise<DonationDetail> {
  return request<DonationDetail>(`/api/donations/${id}`);
}

/** Protected — org dashboard lists donations */
export function listDonations(
  orgId: string,
  token: TokenGetter
): Promise<Donation[]> {
  return request<Donation[]>(`/api/donations?orgId=${orgId}`, { token });
}

// ─── Donor ───────────────────────────────────────────────

export interface Donor {
  id: string;
  orgId: string;
  email: string;
  firstName: string;
  lastName: string;
  totalGivenCents: number;
  donationCount: number;
  firstDonationAt: string | null;
  lastDonationAt: string | null;
  tags: string[];
  createdAt: string;
}

/** Protected — org dashboard */
export function listDonors(
  orgId: string,
  token: TokenGetter
): Promise<Donor[]> {
  return request<{ data: Donor[] }>(`/api/orgs/${orgId}/donors`, { token }).then(
    (r) => r.data
  );
}

// ─── Organization Stats ──────────────────────────────────

/** Donation shape returned by the org stats endpoint (includes nested donor/campaign) */
export interface DashboardDonation extends Omit<Donation, "donorName" | "donorEmail"> {
  donorName?: string;
  donorEmail?: string;
  donor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    anonymous: boolean;
  };
  campaign?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface OrgStats {
  totalRaisedCents: number;
  totalDonors: number;
  activeCampaigns: number;
  donationsThisMonth: number;
  recentDonations: DashboardDonation[];
}

/** Protected — org dashboard */
export function getOrgStats(
  orgId: string,
  token: TokenGetter
): Promise<OrgStats> {
  return request<OrgStats>(`/api/orgs/${orgId}/stats`, { token });
}

// ─── Organization ────────────────────────────────────────

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  email: string;
  ein?: string;
  website?: string;
}

export interface CreateOrganizationResponse {
  org: {
    id: string;
    name: string;
    slug: string;
    stripeAccountId: string;
    status: string;
  };
  onboardingUrl: string;
}

/** Public — onboarding (user account may not exist in DB yet) */
export function createOrganization(
  input: CreateOrganizationInput
): Promise<CreateOrganizationResponse> {
  return request<CreateOrganizationResponse>("/api/orgs", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ─── Organization (get + update) ─────────────────────────

export interface Org {
  id: string;
  name: string;
  slug: string;
  ein: string | null;
  website: string | null;
  logoUrl: string | null;
  planTier: "BASIC" | "PRO";
  status: "ONBOARDING" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  stripeAccountId: string | null;
  stripeOnboarded: boolean;
  payoutSchedule: "DAILY" | "WEEKLY" | "MONTHLY" | "MANUAL";
  defaultCurrency: string;
  coverFeesDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrgInput {
  name?: string;
  slug?: string;
  website?: string | null;
  logoUrl?: string | null;
  payoutSchedule?: "DAILY" | "WEEKLY" | "MONTHLY" | "MANUAL";
  defaultCurrency?: string;
  coverFeesDefault?: boolean;
  status?: "ONBOARDING" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
}

/** Protected — org dashboard */
export function getOrg(id: string, token: TokenGetter): Promise<Org> {
  return request<Org>(`/api/orgs/${id}`, { token });
}

/** Protected — org dashboard */
export function updateOrg(
  id: string,
  input: UpdateOrgInput,
  token: TokenGetter
): Promise<Org> {
  return request<Org>(`/api/orgs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
    token,
  });
}
