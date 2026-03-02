/**
 * Seed script for Give platform — Hope Community Foundation sample data.
 * Idempotent: checks for existing org before creating. Run with `pnpm db:seed`.
 */

import { PrismaClient } from "@prisma/client";
import type {
  DonationFrequency,
  DonationStatus,
  PaymentMethodType,
} from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
  return d;
}

/**
 * Calculate realistic fee breakdown for a donation.
 * Processing: 2.9% + $0.30 (Stripe card rate)
 * Platform: 1% (BASIC plan)
 */
function calcFees(
  amountCents: number,
  coverFees: boolean,
  paymentMethod: PaymentMethodType
): {
  processingFeeCents: number;
  platformFeeCents: number;
  netAmountCents: number;
  totalChargedCents: number;
} {
  // ACH is cheaper: 0.8% capped at $5
  const processingFeeCents =
    paymentMethod === "ACH"
      ? Math.min(Math.round(amountCents * 0.008), 500)
      : Math.round(amountCents * 0.029 + 30);
  const platformFeeCents = Math.round(amountCents * 0.01); // 1% BASIC plan
  const totalFeeCents = processingFeeCents + platformFeeCents;

  if (coverFees) {
    // Donor covers fees — total charged is amount + fees, nonprofit gets full amount
    return {
      processingFeeCents,
      platformFeeCents,
      netAmountCents: amountCents,
      totalChargedCents: amountCents + totalFeeCents,
    };
  }
  return {
    processingFeeCents,
    platformFeeCents,
    netAmountCents: amountCents - totalFeeCents,
    totalChargedCents: amountCents,
  };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database with Hope Community Foundation data...\n");

  // ── 1. Organization ───────────────────────────────────────────────────────
  const existingOrg = await prisma.organization.findUnique({
    where: { slug: "hope-community" },
  });

  if (existingOrg) {
    console.log(`⚠️  Organization "Hope Community Foundation" already exists (id: ${existingOrg.id}). Skipping seed.`);
    console.log("   To re-seed, delete the org with slug 'hope-community' first.\n");
    return;
  }

  const org = await prisma.organization.create({
    data: {
      name: "Hope Community Foundation",
      slug: "hope-community",
      ein: "12-3456789",
      website: "https://hopecommunity.org",
      logoUrl: "https://placehold.co/200x200?text=HCF",
      planTier: "BASIC",
      status: "ACTIVE",
      stripeAccountId: "acct_test_hope",
      stripeOnboarded: true,
      payoutSchedule: "WEEKLY",
      defaultCurrency: "usd",
      coverFeesDefault: false,
    },
  });
  console.log(`✅ Organization: ${org.name} (${org.id})`);

  // ── 2. User + OrgMember ───────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: "demo@give.test" },
    update: {},
    create: {
      email: "demo@give.test",
      firstName: "Demo",
      lastName: "Admin",
      clerkId: "user_test_demo",
      emailVerified: true,
    },
  });
  await prisma.orgMember.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: {},
    create: { userId: user.id, orgId: org.id, role: "OWNER" },
  });
  console.log(`✅ User: ${user.firstName} ${user.lastName} <${user.email}> [OWNER]`);

  // ── 3. Campaigns ─────────────────────────────────────────────────────────
  const [campaignAnnual, campaignYouth, campaignBuilding] = await Promise.all([
    prisma.campaign.create({
      data: {
        title: "Annual Fund 2026",
        slug: "annual-fund-2026",
        description:
          "Our flagship annual giving campaign supports core programs including food assistance, " +
          "housing support, and community health initiatives for families in need.",
        type: "DONATION",
        status: "ACTIVE",
        goalAmountCents: 5_000_000, // $50,000
        raisedAmountCents: 0,       // updated after donations
        donationCount: 0,
        coverImageUrl: "https://placehold.co/1200x630?text=Annual+Fund+2026",
        color: "#1D4ED8",
        showDonorRoll: true,
        showGoal: true,
        startDate: daysAgo(60),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        suggestedAmounts: [2500, 5000, 10000, 25000],
        allowCustomAmount: true,
        allowRecurring: true,
        orgId: org.id,
      },
    }),
    prisma.campaign.create({
      data: {
        title: "Youth Scholarship Program",
        slug: "youth-scholarship-program",
        description:
          "Help us provide college scholarships to promising students from low-income families " +
          "in our community. Every $500 covers one semester of textbooks.",
        type: "DONATION",
        status: "ACTIVE",
        goalAmountCents: 2_500_000, // $25,000
        raisedAmountCents: 0,
        donationCount: 0,
        coverImageUrl: "https://placehold.co/1200x630?text=Youth+Scholarship",
        color: "#15803D",
        showDonorRoll: true,
        showGoal: true,
        startDate: daysAgo(30),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        suggestedAmounts: [5000, 10000, 25000, 50000],
        allowCustomAmount: true,
        allowRecurring: true,
        orgId: org.id,
      },
    }),
    prisma.campaign.create({
      data: {
        title: "Building Renovation",
        slug: "building-renovation",
        description:
          "Our 40-year-old community center needs critical renovations to continue serving " +
          "over 5,000 families annually. Help us build a space that lasts another 40 years.",
        type: "DONATION",
        status: "DRAFT",
        goalAmountCents: 50_000_000, // $500,000
        raisedAmountCents: 0,
        donationCount: 0,
        coverImageUrl: "https://placehold.co/1200x630?text=Building+Renovation",
        color: "#92400E",
        showDonorRoll: true,
        showGoal: true,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        suggestedAmounts: [10000, 50000, 100000, 500000],
        allowCustomAmount: true,
        allowRecurring: false,
        orgId: org.id,
      },
    }),
  ]);
  console.log(`✅ Campaigns: "${campaignAnnual.title}" [ACTIVE], "${campaignYouth.title}" [ACTIVE], "${campaignBuilding.title}" [DRAFT]`);

  // ── 4. Donors (15–20) ─────────────────────────────────────────────────────
  type DonorDef = {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    anonymous?: boolean;
    tags: string[];
  };

  const donorDefs: DonorDef[] = [
    { email: "margaret.holloway@gmail.com",    firstName: "Margaret",  lastName: "Holloway",  phone: "+15559001001", tags: ["Major Donor", "Board"] },
    { email: "james.okonkwo@outlook.com",      firstName: "James",     lastName: "Okonkwo",   phone: "+15559001002", tags: ["Major Donor", "Monthly"] },
    { email: "patricia.nguyen@yahoo.com",      firstName: "Patricia",  lastName: "Nguyen",    phone: "+15559001003", tags: ["Monthly", "Volunteer"] },
    { email: "robert.steinberg@gmail.com",     firstName: "Robert",    lastName: "Steinberg", phone: "+15559001004", tags: ["Major Donor", "Board"] },
    { email: "linda.washington@proton.me",     firstName: "Linda",     lastName: "Washington",phone: "+15559001005", tags: ["Board", "Event Attendee"] },
    { email: "carlos.reyes@gmail.com",         firstName: "Carlos",    lastName: "Reyes",     phone: "+15559001006", tags: ["Monthly"] },
    { email: "susan.patel@gmail.com",          firstName: "Susan",     lastName: "Patel",     phone: "+15559001007", tags: ["Volunteer", "Event Attendee"] },
    { email: "michael.chen@gmail.com",         firstName: "Michael",   lastName: "Chen",      phone: "+15559001008", tags: ["Major Donor"] },
    { email: "karen.bishop@icloud.com",        firstName: "Karen",     lastName: "Bishop",    phone: "+15559001009", tags: ["Event Attendee"] },
    { email: "david.morrison@gmail.com",       firstName: "David",     lastName: "Morrison",  phone: null,           tags: ["Monthly"] },
    { email: "emily.jackson@gmail.com",        firstName: "Emily",     lastName: "Jackson",   phone: "+15559001011", tags: ["Volunteer"] },
    { email: "thomas.garcia@hotmail.com",      firstName: "Thomas",    lastName: "Garcia",    phone: "+15559001012", tags: [] },
    { email: "sarah.kim@gmail.com",            firstName: "Sarah",     lastName: "Kim",       phone: "+15559001013", tags: ["Event Attendee", "Volunteer"] },
    { email: "william.oduya@gmail.com",        firstName: "William",   lastName: "Oduya",     phone: null,           tags: [] },
    { email: "jennifer.walsh@gmail.com",       firstName: "Jennifer",  lastName: "Walsh",     phone: "+15559001015", tags: ["Major Donor", "Monthly"] },
    { email: "mark.brennan@gmail.com",         firstName: "Mark",      lastName: "Brennan",   phone: "+15559001016", tags: ["Board"] },
    { email: "jessica.lee@outlook.com",        firstName: "Jessica",   lastName: "Lee",       phone: "+15559001017", tags: ["Volunteer"] },
    { email: "anonymous.donor@give.test",      firstName: "Anonymous", lastName: "Donor",     phone: null, anonymous: true, tags: [] },
  ];

  const donors: Array<{ id: string; email: string; firstName: string; lastName: string }> = [];
  for (const def of donorDefs) {
    const { tags, anonymous, phone, ...rest } = def;
    const donor = await prisma.donor.create({
      data: { ...rest, phone: phone ?? null, anonymous: anonymous ?? false, orgId: org.id },
    });
    for (const tagName of tags) {
      await prisma.donorTag.create({ data: { donorId: donor.id, name: tagName } });
    }
    donors.push(donor);
  }
  console.log(`✅ Donors: ${donors.length} created with tags`);

  // ── 5. Donations (50–75) ─────────────────────────────────────────────────
  // Target: 90% SUCCEEDED / 5% PENDING / 5% FAILED
  //         70% ONE_TIME / 25% MONTHLY / 5% QUARTERLY
  //         80% CARD / 15% ACH / 5% APPLE_PAY
  //         ~65% Annual Fund funded, ~30% Youth Scholarship funded

  interface DonationSpec {
    donorIdx: number;
    campaign: typeof campaignAnnual | typeof campaignYouth;
    amountCents: number;
    status: DonationStatus;
    frequency: DonationFrequency;
    paymentMethod: PaymentMethodType;
    daysBack: number;
    coverFees?: boolean;
    dedicationType?: string;
    dedicationName?: string;
    dedicationMessage?: string;
  }

  const specs: DonationSpec[] = [
    // ── Annual Fund 2026 — target ~$32,500 raised (65% of $50k) ─────────
    // Major donors
    { donorIdx: 0,  campaign: campaignAnnual, amountCents: 500000,  status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "ACH",       daysBack: 55, coverFees: false, dedicationType: "in_honor", dedicationName: "The Hope Community" },
    { donorIdx: 3,  campaign: campaignAnnual, amountCents: 250000,  status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "ACH",       daysBack: 50, coverFees: true },
    { donorIdx: 7,  campaign: campaignAnnual, amountCents: 200000,  status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 45, coverFees: false },
    { donorIdx: 14, campaign: campaignAnnual, amountCents: 100000,  status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 60, coverFees: true },
    { donorIdx: 14, campaign: campaignAnnual, amountCents: 100000,  status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 30, coverFees: true },
    { donorIdx: 14, campaign: campaignAnnual, amountCents: 100000,  status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 1,  coverFees: true },
    // Regular donors
    { donorIdx: 1,  campaign: campaignAnnual, amountCents: 50000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 60, coverFees: false },
    { donorIdx: 1,  campaign: campaignAnnual, amountCents: 50000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 30, coverFees: false },
    { donorIdx: 1,  campaign: campaignAnnual, amountCents: 50000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 2,  coverFees: false },
    { donorIdx: 5,  campaign: campaignAnnual, amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 55, coverFees: false },
    { donorIdx: 5,  campaign: campaignAnnual, amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 25, coverFees: false },
    { donorIdx: 9,  campaign: campaignAnnual, amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 45, coverFees: false },
    { donorIdx: 9,  campaign: campaignAnnual, amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 15, coverFees: false },
    { donorIdx: 4,  campaign: campaignAnnual, amountCents: 15000,   status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 40, coverFees: true,  dedicationType: "in_memory", dedicationName: "Eleanor Washington", dedicationMessage: "In loving memory of a lifelong community servant." },
    { donorIdx: 6,  campaign: campaignAnnual, amountCents: 10000,   status: "SUCCEEDED", frequency: "QUARTERLY", paymentMethod: "CARD",      daysBack: 88, coverFees: false },
    { donorIdx: 6,  campaign: campaignAnnual, amountCents: 10000,   status: "SUCCEEDED", frequency: "QUARTERLY", paymentMethod: "CARD",      daysBack: 3,  coverFees: false },
    { donorIdx: 10, campaign: campaignAnnual, amountCents: 10000,   status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "APPLE_PAY", daysBack: 20, coverFees: true },
    { donorIdx: 11, campaign: campaignAnnual, amountCents: 7500,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 35, coverFees: false },
    { donorIdx: 12, campaign: campaignAnnual, amountCents: 5000,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 28, coverFees: false },
    { donorIdx: 13, campaign: campaignAnnual, amountCents: 5000,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "ACH",       daysBack: 42, coverFees: false },
    { donorIdx: 16, campaign: campaignAnnual, amountCents: 2500,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 10, coverFees: false },
    { donorIdx: 17, campaign: campaignAnnual, amountCents: 5000,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "APPLE_PAY", daysBack: 7,  coverFees: true },
    { donorIdx: 8,  campaign: campaignAnnual, amountCents: 10000,   status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 15, coverFees: false },
    // Pending / failed
    { donorIdx: 2,  campaign: campaignAnnual, amountCents: 15000,   status: "PENDING",   frequency: "ONE_TIME",  paymentMethod: "ACH",       daysBack: 1,  coverFees: false },
    { donorIdx: 15, campaign: campaignAnnual, amountCents: 25000,   status: "PENDING",   frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 1,  coverFees: false },
    { donorIdx: 11, campaign: campaignAnnual, amountCents: 5000,    status: "FAILED",    frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 12, coverFees: false },
    { donorIdx: 13, campaign: campaignAnnual, amountCents: 2500,    status: "FAILED",    frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 22, coverFees: false },

    // ── Youth Scholarship Program — target ~$7,500 raised (30% of $25k) ─
    { donorIdx: 3,  campaign: campaignYouth,  amountCents: 100000,  status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "ACH",       daysBack: 28, coverFees: false },
    { donorIdx: 0,  campaign: campaignYouth,  amountCents: 50000,   status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 25, coverFees: true,  dedicationType: "in_honor", dedicationName: "Future Scholars Everywhere" },
    { donorIdx: 7,  campaign: campaignYouth,  amountCents: 50000,   status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "ACH",       daysBack: 20, coverFees: false },
    { donorIdx: 14, campaign: campaignYouth,  amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 29, coverFees: true },
    { donorIdx: 14, campaign: campaignYouth,  amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 1,  coverFees: true },
    { donorIdx: 1,  campaign: campaignYouth,  amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 29, coverFees: false },
    { donorIdx: 1,  campaign: campaignYouth,  amountCents: 25000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 2,  coverFees: false },
    { donorIdx: 4,  campaign: campaignYouth,  amountCents: 15000,   status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 18, coverFees: false },
    { donorIdx: 5,  campaign: campaignYouth,  amountCents: 10000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 28, coverFees: false },
    { donorIdx: 5,  campaign: campaignYouth,  amountCents: 10000,   status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 1,  coverFees: false },
    { donorIdx: 6,  campaign: campaignYouth,  amountCents: 10000,   status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "APPLE_PAY", daysBack: 14, coverFees: true },
    { donorIdx: 8,  campaign: campaignYouth,  amountCents: 7500,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 10, coverFees: false },
    { donorIdx: 9,  campaign: campaignYouth,  amountCents: 5000,    status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 28, coverFees: false },
    { donorIdx: 9,  campaign: campaignYouth,  amountCents: 5000,    status: "SUCCEEDED", frequency: "MONTHLY",   paymentMethod: "CARD",      daysBack: 1,  coverFees: false },
    { donorIdx: 10, campaign: campaignYouth,  amountCents: 5000,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 6,  coverFees: false },
    { donorIdx: 11, campaign: campaignYouth,  amountCents: 2500,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 22, coverFees: false },
    { donorIdx: 12, campaign: campaignYouth,  amountCents: 2500,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "APPLE_PAY", daysBack: 16, coverFees: true },
    { donorIdx: 13, campaign: campaignYouth,  amountCents: 2500,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 8,  coverFees: false },
    { donorIdx: 15, campaign: campaignYouth,  amountCents: 5000,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "ACH",       daysBack: 25, coverFees: false },
    { donorIdx: 16, campaign: campaignYouth,  amountCents: 2500,    status: "SUCCEEDED", frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 12, coverFees: false },
    { donorIdx: 2,  campaign: campaignYouth,  amountCents: 10000,   status: "SUCCEEDED", frequency: "QUARTERLY", paymentMethod: "CARD",      daysBack: 85, coverFees: false },
    { donorIdx: 2,  campaign: campaignYouth,  amountCents: 10000,   status: "SUCCEEDED", frequency: "QUARTERLY", paymentMethod: "CARD",      daysBack: 5,  coverFees: false },
    // Pending / failed
    { donorIdx: 16, campaign: campaignYouth,  amountCents: 5000,    status: "PENDING",   frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 0,  coverFees: false },
    { donorIdx: 17, campaign: campaignYouth,  amountCents: 2500,    status: "FAILED",    frequency: "ONE_TIME",  paymentMethod: "CARD",      daysBack: 5,  coverFees: false },
  ];

  console.log(`\n📋 Creating ${specs.length} donations...`);
  let idx = 0;
  for (const spec of specs) {
    const donor = donors[spec.donorIdx]!;
    const createdAt = daysAgo(spec.daysBack);
    const fees = calcFees(spec.amountCents, spec.coverFees ?? false, spec.paymentMethod);

    await prisma.donation.create({
      data: {
        amountCents: spec.amountCents,
        currency: "usd",
        status: spec.status,
        frequency: spec.frequency,
        ...fees,
        coverFees: spec.coverFees ?? false,
        paymentMethod: spec.paymentMethod,
        stripePaymentIntentId: `pi_seed_${org.id.slice(-4)}_${donor.id.slice(-4)}_${idx.toString().padStart(3, "0")}`,
        dedicationType: spec.dedicationType ?? null,
        dedicationName: spec.dedicationName ?? null,
        dedicationMessage: spec.dedicationMessage ?? null,
        donorId: donor.id,
        campaignId: spec.campaign.id,
        orgId: org.id,
        createdAt,
        updatedAt: createdAt,
      },
    });
    idx++;
  }
  console.log(`✅ Created ${specs.length} donations`);

  // ── 6. Update campaign aggregate caches ───────────────────────────────────
  console.log("\n📊 Updating campaign aggregates...");
  for (const campaign of [campaignAnnual, campaignYouth, campaignBuilding]) {
    const agg = await prisma.donation.aggregate({
      where: { campaignId: campaign.id, status: "SUCCEEDED" },
      _sum: { amountCents: true },
      _count: { id: true },
    });
    const raised = agg._sum.amountCents ?? 0;
    const count = agg._count.id;
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { raisedAmountCents: raised, donationCount: count },
    });
    const pct = campaign.goalAmountCents
      ? ((raised / campaign.goalAmountCents) * 100).toFixed(1)
      : "—";
    console.log(`  "${campaign.title}": $${(raised / 100).toFixed(2)} raised (${pct}% of goal, ${count} donations)`);
  }

  // ── 7. Update donor aggregate caches ─────────────────────────────────────
  console.log("\n📊 Updating donor aggregates...");
  for (const donor of donors) {
    const agg = await prisma.donation.aggregate({
      where: { donorId: donor.id, status: "SUCCEEDED" },
      _sum: { amountCents: true },
      _count: { id: true },
      _min: { createdAt: true },
      _max: { createdAt: true },
    });
    await prisma.donor.update({
      where: { id: donor.id },
      data: {
        totalGivenCents: agg._sum.amountCents ?? 0,
        donationCount: agg._count.id,
        firstDonationAt: agg._min.createdAt,
        lastDonationAt: agg._max.createdAt,
      },
    });
  }
  console.log(`  Updated aggregates for ${donors.length} donors`);

  console.log("\n✨ Seed complete!");
  console.log(`   Org:       Hope Community Foundation (${org.id})`);
  console.log(`   User:      demo@give.test [OWNER]`);
  console.log(`   Campaigns: 3 (2 ACTIVE, 1 DRAFT)`);
  console.log(`   Donors:    ${donors.length}`);
  console.log(`   Donations: ${specs.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
