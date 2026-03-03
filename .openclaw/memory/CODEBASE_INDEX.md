# Codebase Index

> Auto-generated. Last updated: 2026-03-03T05:24:11Z

## File Map
| File | Lines | First Export |
|------|-------|-------------|
| apps/api/src/emails/donation-receipt.ts | 318 | export interface DonationReceiptData { |
| apps/api/src/index.ts | 132 | — |
| apps/api/src/lib/email.ts | 21 | export function getFromEmail(): string { |
| apps/api/src/lib/errors.ts | 107 | export interface ApiError { |
| apps/api/src/lib/fees.ts | 13 | export { calculateFees } from "@give/shared"; |
| apps/api/src/lib/rate-limit.ts | 94 | export interface RateLimiter { |
| apps/api/src/lib/receipt-number.ts | 35 | export async function generateReceiptNumber( |
| apps/api/src/lib/sanitize.ts | 83 | — |
| apps/api/src/lib/stripe.ts | 74 | export const stripe = new Stripe(process.env.STRIPE_SECRET_K |
| apps/api/src/middleware/auth.ts | 137 | export type AuthVariables = { |
| apps/api/src/routes/campaigns.ts | 443 | export const campaignRoutes = new Hono(); |
| apps/api/src/routes/clerk-webhooks.ts | 198 | export const clerkWebhookRoutes = new Hono(); |
| apps/api/src/routes/donations.ts | 312 | export const donationRoutes = new Hono(); |
| apps/api/src/routes/donors.ts | 235 | export const donorRoutes = new Hono<{ Variables: AuthVariabl |
| apps/api/src/routes/health.ts | 10 | export const healthRoutes = new Hono(); |
| apps/api/src/routes/orgs.ts | 395 | export const orgRoutes = new Hono(); |
| apps/api/src/routes/reporting.ts | 184 | export const reportingRoutes = new Hono<{ Variables: AuthVar |
| apps/api/src/routes/stripe.ts | 470 | — |
| apps/api/src/routes/verify-ein.ts | 99 | export const verifyEinRoutes = new Hono(); |
| apps/web/src/app/api/me/org/route.ts | 40 | export async function GET() { |
| apps/web/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx | 9 | export default function Page() { |
| apps/web/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx | 9 | export default function Page() { |
| apps/web/src/app/dashboard/campaigns/[id]/edit/page.tsx | 440 | — |
| apps/web/src/app/dashboard/campaigns/new/page.tsx | 662 | — |
| apps/web/src/app/dashboard/campaigns/page.tsx | 246 | — |
| apps/web/src/app/dashboard/donors/[id]/page.tsx | 592 | — |
| apps/web/src/app/dashboard/donors/page.tsx | 201 | — |
| apps/web/src/app/dashboard/layout.tsx | 55 | export default function DashboardLayout({ |
| apps/web/src/app/dashboard/page.tsx | 285 | — |
| apps/web/src/app/dashboard/settings/page.tsx | 661 | — |
| apps/web/src/app/donate/[campaignId]/page.tsx | 145 | export default async function DonatePage({ params }: DonateP |
| apps/web/src/app/donate/[campaignId]/success/page.tsx | 668 | — |
| apps/web/src/app/donate/[campaignId]/thank-you/page.tsx | 451 | — |
| apps/web/src/app/error.tsx | 38 | export default function Error({ |
| apps/web/src/app/layout.tsx | 32 | export const metadata: Metadata = { |
| apps/web/src/app/not-found.tsx | 32 | export default function NotFound() { |
| apps/web/src/app/onboarding/campaign/page.tsx | 20 | export default function OnboardingStep3() { |
| apps/web/src/app/onboarding/complete/page.tsx | 13 | export default function OnboardingComplete() { |
| apps/web/src/app/onboarding/layout.tsx | 29 | export default function OnboardingLayout({ |
| apps/web/src/app/onboarding/page.tsx | 323 | — |
| apps/web/src/app/onboarding/refresh/page.tsx | 13 | export default function OnboardingRefresh() { |
| apps/web/src/app/onboarding/stripe/page.tsx | 18 | export default function OnboardingStep2() { |
| apps/web/src/app/page.tsx | 480 | — |
| apps/web/src/app/privacy/page.tsx | 103 | export const metadata = { |
| apps/web/src/app/terms/page.tsx | 119 | export const metadata = { |
| apps/web/src/components/DashboardSidebar.tsx | 298 | — |
| apps/web/src/components/DonationForm.tsx | 633 | — |
| apps/web/src/components/DonationTrendChart.tsx | 140 | export interface TrendPoint { |
| apps/web/src/components/GoalThermometer.tsx | 53 | export default function GoalThermometer({ |
| apps/web/src/components/StripeProvider.tsx | 97 | — |
| apps/web/src/hooks/useCurrentOrg.ts | 73 | export interface CurrentOrg { |
| apps/web/src/lib/api.ts | 507 | export type TokenGetter = |
| apps/web/src/middleware.ts | 22 | export default clerkMiddleware(async (auth, request) => { |
| packages/db/prisma/seed.ts | 406 | — |
| packages/db/src/index.ts | 18 | export const prisma = |
| packages/shared/src/index.ts | 124 | export const PLATFORM_FEE_BASIC = 0.01; // 1% |

## Hot Files (most changed in 30 days)
     11 apps/web/src/lib/api.ts
      6 apps/api/src/index.ts
      5 apps/web/src/components/DonationForm.tsx
      4 apps/web/src/app/onboarding/page.tsx
      4 apps/web/src/app/dashboard/donors/page.tsx
      4 apps/api/src/routes/donations.ts
      4 apps/api/package.json
      3 packages/db/prisma/schema.prisma
      3 apps/web/src/app/dashboard/page.tsx
      3 apps/web/src/app/dashboard/campaigns/page.tsx
      3 apps/web/package.json
      3 apps/api/src/routes/stripe.ts
      3 apps/api/src/routes/orgs.ts
      3 apps/api/src/routes/campaigns.ts
      2 packages/db/package.json

## Package Structure
- apps/api/package.json (@give/api)
- apps/web/package.json (@give/web)
- packages/db/package.json (@give/db)
- packages/shared/package.json (@give/shared)
