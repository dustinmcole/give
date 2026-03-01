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
}

export function getDonationCampaign(id: string): Promise<Campaign> {
  return request<Campaign>(`/api/campaigns/${id}`);
}

export function listCampaigns(orgId: string): Promise<Campaign[]> {
  return request<Campaign[]>(`/api/orgs/${orgId}/campaigns`);
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

export interface CreateDonationResponse {
  id: string;
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

export function listDonations(orgId: string): Promise<{ data: Donation[] }> {
  return request<{ data: Donation[] }>(`/api/donations?orgId=${orgId}`);
}

export function getRecentDonations(orgId: string, limit: number = 5): Promise<{ data: Donation[] }> {
  return request<{ data: Donation[] }>(`/api/donations?orgId=${orgId}&limit=${limit}`);
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
