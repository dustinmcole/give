import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@give/db";
import { verifyManageToken } from "../lib/manage-token.js";
import {
  cancelSubscription,
  updateSubscriptionAmount,
  createBillingPortalSession,
} from "../lib/stripe.js";

export const manageRoutes = new Hono();

// ─── GET /:token — Get donor subscriptions ────────────────

manageRoutes.get("/:token", async (c) => {
  const token = c.req.param("token");
  const decoded = verifyManageToken(token);

  if (!decoded) {
    return c.json({ error: "Invalid or expired management link" }, 401);
  }

  const { donorId, orgId } = decoded;

  try {
    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        donations: {
          where: {
            orgId,
            stripeSubscriptionId: { not: null },
            frequency: { not: "ONE_TIME" },
          },
          distinct: ["stripeSubscriptionId"],
          orderBy: { createdAt: "desc" },
          include: {
            campaign: {
              select: { id: true, title: true, slug: true },
            },
            org: {
              select: { id: true, name: true, logoUrl: true },
            },
          },
        },
      },
    });

    if (!donor) {
      return c.json({ error: "Donor not found" }, 404);
    }

    return c.json({
      donor: {
        id: donor.id,
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email,
      },
      subscriptions: donor.donations.map((d) => ({
        donationId: d.id,
        subscriptionId: d.stripeSubscriptionId,
        amountCents: d.amountCents,
        frequency: d.frequency,
        status: d.status,
        campaign: d.campaign,
        org: d.org,
        createdAt: d.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error fetching donor subscriptions:", err);
    return c.json({ error: "Failed to fetch subscriptions" }, 500);
  }
});

// ─── POST /:token/portal — Create Stripe Billing Portal session ──

manageRoutes.post("/:token/portal", async (c) => {
  const token = c.req.param("token");
  const decoded = verifyManageToken(token);

  if (!decoded) {
    return c.json({ error: "Invalid or expired management link" }, 401);
  }

  const { donorId, orgId } = decoded;

  try {
    // Find a recent donation to get the stripeCustomerId and stripeAccountId
    const donation = await prisma.donation.findFirst({
      where: {
        donorId,
        orgId,
        stripeCustomerId: { not: null },
      },
      include: {
        org: { select: { stripeAccountId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!donation?.stripeCustomerId || !donation.org.stripeAccountId) {
      return c.json({ error: "No billing data found for this donor" }, 404);
    }

    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const session = await createBillingPortalSession(
      donation.stripeCustomerId,
      `${baseUrl}/manage/${token}`,
      donation.org.stripeAccountId
    );

    return c.json({ portalUrl: session.url });
  } catch (err) {
    console.error("Error creating billing portal session:", err);
    return c.json({ error: "Failed to create portal session" }, 500);
  }
});

// ─── POST /:token/cancel — Cancel a subscription ──────────

const cancelSchema = z.object({ subscriptionId: z.string().min(1) });

manageRoutes.post("/:token/cancel", async (c) => {
  const token = c.req.param("token");
  const decoded = verifyManageToken(token);

  if (!decoded) {
    return c.json({ error: "Invalid or expired management link" }, 401);
  }

  const { donorId, orgId } = decoded;

  const body = await c.req.json().catch(() => null);
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "subscriptionId is required" }, 400);
  }

  const { subscriptionId } = parsed.data;

  try {
    // Verify the subscription belongs to this donor/org
    const donation = await prisma.donation.findFirst({
      where: { donorId, orgId, stripeSubscriptionId: subscriptionId },
      include: { org: { select: { stripeAccountId: true } } },
    });

    if (!donation) {
      return c.json({ error: "Subscription not found" }, 404);
    }

    if (!donation.org.stripeAccountId) {
      return c.json({ error: "Organization payment setup incomplete" }, 400);
    }

    await cancelSubscription(subscriptionId, donation.org.stripeAccountId);

    // Update donation status in DB (webhook will also fire, but update optimistically)
    await prisma.donation.updateMany({
      where: { orgId, stripeSubscriptionId: subscriptionId },
      data: { status: "FAILED" },
    });

    return c.json({ success: true, message: "Subscription cancelled" });
  } catch (err) {
    console.error("Error cancelling subscription:", err);
    return c.json({ error: "Failed to cancel subscription" }, 500);
  }
});

// ─── POST /:token/update-amount — Update subscription amount ─

const updateAmountSchema = z.object({
  subscriptionId: z.string().min(1),
  newAmountCents: z.number().int().positive().min(100),
});

manageRoutes.post("/:token/update-amount", async (c) => {
  const token = c.req.param("token");
  const decoded = verifyManageToken(token);

  if (!decoded) {
    return c.json({ error: "Invalid or expired management link" }, 401);
  }

  const { donorId, orgId } = decoded;

  const body = await c.req.json().catch(() => null);
  const parsed = updateAmountSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      400
    );
  }

  const { subscriptionId, newAmountCents } = parsed.data;

  try {
    const donation = await prisma.donation.findFirst({
      where: { donorId, orgId, stripeSubscriptionId: subscriptionId },
      include: {
        org: { select: { stripeAccountId: true, name: true } },
        campaign: { select: { title: true } },
      },
    });

    if (!donation) {
      return c.json({ error: "Subscription not found" }, 404);
    }

    if (!donation.org.stripeAccountId) {
      return c.json({ error: "Organization payment setup incomplete" }, 400);
    }

    const interval =
      donation.frequency === "ANNUAL"
        ? "year"
        : "month";

    await updateSubscriptionAmount(
      subscriptionId,
      newAmountCents,
      donation.currency,
      interval,
      donation.org.stripeAccountId,
      `${donation.campaign.title} — donation`
    );

    // Update local donation record amount
    await prisma.donation.update({
      where: { id: donation.id },
      data: { amountCents: newAmountCents },
    });

    return c.json({
      success: true,
      message: "Subscription amount updated",
      newAmountCents,
    });
  } catch (err) {
    console.error("Error updating subscription amount:", err);
    return c.json({ error: "Failed to update subscription amount" }, 500);
  }
});
