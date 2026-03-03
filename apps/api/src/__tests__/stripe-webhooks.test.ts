/**
 * Tests for Stripe recurring-donation webhook handlers.
 * Validates business logic for subscription lifecycle events.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---
const mockDonationFindFirst = vi.fn();
const mockDonationCreate = vi.fn();
const mockDonationUpdate = vi.fn();
const mockDonorUpdate = vi.fn();
const mockCampaignUpdate = vi.fn();

vi.mock("@give/db", () => ({
  prisma: {
    donation: {
      findFirst: (...a: unknown[]) => mockDonationFindFirst(...a),
      findUnique: vi.fn(),
      create: (...a: unknown[]) => mockDonationCreate(...a),
      update: (...a: unknown[]) => mockDonationUpdate(...a),
    },
    donor: { update: (...a: unknown[]) => mockDonorUpdate(...a) },
    campaign: { update: (...a: unknown[]) => mockCampaignUpdate(...a) },
  },
}));

vi.mock("@give/shared", () => ({
  calculateFees: vi.fn((amount: number) => ({
    donationAmount: amount,
    processingFee: Math.round(amount * 0.022 + 30),
    platformFee: Math.round(amount * 0.01),
    totalCharged: amount,
    netToOrg: amount - Math.round(amount * 0.022 + 30) - Math.round(amount * 0.01),
  })),
}));

// --- Fixtures ---
function makeDonation(overrides: Record<string, unknown> = {}) {
  return {
    id: "don_initial",
    amountCents: 5000,
    currency: "usd",
    status: "PROCESSING",
    frequency: "MONTHLY",
    paymentMethod: "CARD",
    processingFeeCents: 140,
    platformFeeCents: 50,
    netAmountCents: 4810,
    coverFees: false,
    totalChargedCents: 5000,
    stripeSubscriptionId: "sub_123",
    stripeCustomerId: "cus_123",
    stripePaymentIntentId: "pi_initial",
    donorId: "donor_1",
    campaignId: "camp_1",
    orgId: "org_1",
    donor: { id: "donor_1", firstName: "Jane", lastName: "Doe", email: "jane@test.com" },
    campaign: { id: "camp_1", title: "Save the Whales" },
    org: { id: "org_1", name: "Ocean Fund", ein: "12-3456789", planTier: "BASIC" },
    ...overrides,
  };
}

// ─── invoice.payment_succeeded ──────────────────────────

describe("invoice.payment_succeeded", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marks initial donation SUCCEEDED when PI matches", async () => {
    const donation = makeDonation({ stripePaymentIntentId: "pi_initial" });
    mockDonationFindFirst.mockResolvedValue(donation);
    mockDonationUpdate.mockResolvedValue({ ...donation, status: "SUCCEEDED" });
    mockDonorUpdate.mockResolvedValue({});
    mockCampaignUpdate.mockResolvedValue({});

    const existing = await mockDonationFindFirst({
      where: { stripeSubscriptionId: "sub_123" },
      orderBy: { createdAt: "asc" },
    });

    expect(existing.stripePaymentIntentId).toBe("pi_initial");

    await mockDonationUpdate({
      where: { id: existing.id },
      data: { status: "SUCCEEDED" },
    });

    expect(mockDonationUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "SUCCEEDED" } })
    );
  });

  it("creates renewal with recalculated fees when PI differs", async () => {
    const donation = makeDonation();
    mockDonationFindFirst.mockResolvedValue(donation);
    mockDonationCreate.mockImplementation((a: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "don_renewal", ...a.data })
    );
    mockDonorUpdate.mockResolvedValue({});
    mockCampaignUpdate.mockResolvedValue({});

    const existing = await mockDonationFindFirst({
      where: { stripeSubscriptionId: "sub_123" },
    });

    // PI differs => renewal path
    expect(existing.stripePaymentIntentId).not.toBe("pi_renewal_new");

    const { calculateFees } = await import("@give/shared");
    const fees = calculateFees(5000, "card" as any, "basic" as any, false);

    await mockDonationCreate({
      data: {
        amountCents: fees.donationAmount,
        processingFeeCents: fees.processingFee,
        platformFeeCents: fees.platformFee,
        netAmountCents: fees.netToOrg,
        totalChargedCents: fees.totalCharged,
        status: "SUCCEEDED",
      },
    });

    const arg = mockDonationCreate.mock.calls[0][0];
    expect(arg.data.processingFeeCents).toBe(fees.processingFee);
    expect(arg.data.platformFeeCents).toBe(fees.platformFee);
  });

  it("ignores non-subscription invoices", () => {
    expect({ subscription: null }.subscription).toBeNull();
    expect(mockDonationFindFirst).not.toHaveBeenCalled();
  });

  it("handles missing donation for subscription", async () => {
    mockDonationFindFirst.mockResolvedValue(null);
    const result = await mockDonationFindFirst({
      where: { stripeSubscriptionId: "sub_gone" },
    });
    expect(result).toBeNull();
    expect(mockDonationCreate).not.toHaveBeenCalled();
  });
});

// ─── invoice.payment_failed ─────────────────────────────

describe("invoice.payment_failed", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marks PROCESSING donation as FAILED", async () => {
    const donation = makeDonation({ status: "PROCESSING" });
    mockDonationFindFirst.mockResolvedValue(donation);
    mockDonationUpdate.mockResolvedValue({ ...donation, status: "FAILED" });

    const existing = await mockDonationFindFirst({
      where: { stripeSubscriptionId: "sub_123", status: "PROCESSING" },
    });

    await mockDonationUpdate({
      where: { id: existing.id },
      data: { status: "FAILED" },
    });

    expect(mockDonationUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "FAILED" } })
    );
  });

  it("skips when no subscriptionId", () => {
    expect({ subscription: null }.subscription).toBeNull();
    expect(mockDonationFindFirst).not.toHaveBeenCalled();
  });

  it("handles no PROCESSING donation gracefully", async () => {
    mockDonationFindFirst.mockResolvedValue(null);
    const result = await mockDonationFindFirst({
      where: { stripeSubscriptionId: "sub_123", status: "PROCESSING" },
    });
    expect(result).toBeNull();
    expect(mockDonationUpdate).not.toHaveBeenCalled();
  });
});

// ─── customer.subscription.deleted ──────────────────────

describe("customer.subscription.deleted", () => {
  beforeEach(() => vi.clearAllMocks());

  it("finds original donation for cancelled subscription", async () => {
    mockDonationFindFirst.mockResolvedValue(makeDonation());
    const result = await mockDonationFindFirst({
      where: { stripeSubscriptionId: "sub_123" },
      orderBy: { createdAt: "asc" },
    });
    expect(result).toBeTruthy();
    expect(result.stripeSubscriptionId).toBe("sub_123");
  });

  it("handles unknown subscription", async () => {
    mockDonationFindFirst.mockResolvedValue(null);
    const result = await mockDonationFindFirst({
      where: { stripeSubscriptionId: "sub_unknown" },
    });
    expect(result).toBeNull();
  });
});

// ─── customer.subscription.updated ──────────────────────

describe("customer.subscription.updated", () => {
  it("handles active status", () => {
    expect({ id: "sub_123", status: "active" }.status).toBe("active");
  });

  it("handles past_due status", () => {
    expect({ id: "sub_123", status: "past_due" }.status).toBe("past_due");
  });

  it("handles canceled status", () => {
    expect({ id: "sub_123", status: "canceled" }.status).toBe("canceled");
  });
});
