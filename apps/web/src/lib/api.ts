import type { CreateDonationInput } from "@give/shared";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
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

export function getDonationCampaign(id: string): Promise<Campaign> {
  return request<Campaign>(`/api/campaigns/${id}`);
}

export function listCampaigns(orgId: string): Promise<Campaign[]> {
  return request<Campaign[]>(`/api/orgs/${orgId}/campaigns`);
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

export function getCampaign(id: string): Promise<Campaign> {
  return request<Campaign>(`/api/campaigns/${id}`);
}

export function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  return request<Campaign>("/api/campaigns", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCampaign(
  id: string,
  input: UpdateCampaignInput
): Promise<Campaign> {
  return request<Campaign>(`/api/campaigns/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
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

export function createDonation(
  input: CreateDonationInput
): Promise<CreateDonationResponse> {
  return request<CreateDonationResponse>("/api/donations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getDonation(id: string): Promise<DonationDetail> {
  return request<DonationDetail>(`/api/donations/${id}`);
}

export function listDonations(orgId: string): Promise<Donation[]> {
  return request<Donation[]>(`/api/orgs/${orgId}/donations`);
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
  firstDonationAt: string;
  lastDonationAt: string;
  tags: string[];
  createdAt: string;
}

export function listDonors(orgId: string): Promise<Donor[]> {
  return request<Donor[]>(`/api/orgs/${orgId}/donors`);
}

// ─── Organization Stats ──────────────────────────────────

export interface OrgStats {
  totalRaisedCents: number;
  totalDonors: number;
  activeCampaigns: number;
  donationsThisMonth: number;
  recentDonations: Donation[];
}

export function getOrgStats(orgId: string): Promise<OrgStats> {
  return request<OrgStats>(`/api/orgs/${orgId}/stats`);
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

export function getOrg(id: string): Promise<Org> {
  return request<Org>(`/api/orgs/${id}`);
}

export function updateOrg(id: string, input: UpdateOrgInput): Promise<Org> {
  return request<Org>(`/api/orgs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

// ─── EIN Verification ────────────────────────────────────

export interface EinVerificationResult {
  valid: boolean;
  name?: string;
  city?: string;
  state?: string;
  deductibility?: string;
  status?: string;
  revoked?: boolean;
  error?: string;
}

export function verifyEin(ein: string): Promise<EinVerificationResult> {
  const normalized = ein.replace(/\D/g, "");
  return request<EinVerificationResult>(`/api/verify-ein/${normalized}`);
}
