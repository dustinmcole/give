# Give — Development Guide

> Comprehensive guide for all developers and Claude terminals working on Give.
> Read PLAN.md for product strategy. Read GITHUB.md for branch/PR workflow. This file covers the technical how.

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/dustinmcole/give.git
cd give
pnpm install

# 2. Set up environment
cp .env.example .env
# Fill in: DATABASE_URL, STRIPE keys, etc. (see Environment Variables below)

# 3. Generate Prisma client + push schema to DB
pnpm db:generate
pnpm db:push

# 4. Run everything
pnpm dev
# → Frontend: http://localhost:3000
# → API: http://localhost:3001
# → API health: http://localhost:3001/api/health
```

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/give?schema=public` |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (use test mode) | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret | `whsec_...` |
| `NEXT_PUBLIC_API_URL` | Yes | API base URL for frontend | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | Yes | Frontend base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe pub key (exposed to browser) | `pk_test_...` |
| `PORT` | No | API server port (default: 3001) | `3001` |
| `APP_URL` | No | Used by API for Stripe callback URLs | `http://localhost:3000` |

### Stripe Test Mode Setup

1. Create a Stripe account at https://dashboard.stripe.com
2. Enable **Connect** in the Stripe dashboard (Settings → Connect → Get Started)
3. Get test keys from Developers → API Keys
4. For webhooks locally: `stripe listen --forward-to localhost:3001/api/stripe/webhooks`
5. Use the webhook signing secret from the CLI output

---

## Monorepo Structure

```
give/
├── apps/
│   ├── web/                 # Next.js 15 frontend
│   │   ├── src/app/         # App Router pages
│   │   ├── src/components/  # React components
│   │   └── src/lib/         # Utilities, API client
│   └── api/                 # Hono backend API
│       ├── src/routes/      # Route handlers (orgs, campaigns, donations, stripe)
│       └── src/lib/         # Stripe helpers, fee calculation
├── packages/
│   ├── shared/              # Types, constants, fee calculation logic
│   │   └── src/index.ts     # All exports (PlanTier, FeeBreakdown, calculateFees, etc.)
│   └── db/                  # Prisma schema + client
│       ├── prisma/schema.prisma
│       └── src/index.ts     # Prisma client singleton + re-exported types
├── docs/                    # Mintlify documentation
├── PLAN.md                  # Product strategy & roadmap (always read first)
├── CLAUDE.md                # Rules for all Claude terminals
├── GITHUB.md                # Branch/PR/deploy workflow
├── DEVELOPMENT.md           # This file
└── turbo.json               # Build orchestration
```

### Package Dependency Graph

```
@give/web ──→ @give/shared
@give/api ──→ @give/shared
@give/api ──→ @give/db
@give/db  ──→ (prisma)
```

---

## Database

### Prisma Commands

```bash
pnpm db:generate    # Regenerate Prisma client after schema changes
pnpm db:push        # Push schema to DB (dev only — no migrations)
pnpm db:migrate     # Create a migration (use for production-ready changes)
pnpm db:studio      # Open Prisma Studio GUI (http://localhost:5555)
```

### Schema Overview (packages/db/prisma/schema.prisma)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Organization** | Nonprofit account | slug, ein, planTier, stripeAccountId, status |
| **User** | Admin/team member | email, passwordHash, emailVerified |
| **OrgMember** | User ↔ Org junction | role (OWNER, ADMIN, EDITOR, VIEWER) |
| **Campaign** | Fundraising campaign | title, slug, type, status, goalAmountCents, raisedAmountCents |
| **Donor** | Donor record (per org) | email, totalGivenCents, donationCount |
| **DonorTag** | Donor segmentation | name (unique per donor) |
| **Donation** | Transaction record | amountCents, status, frequency, fees, stripePaymentIntentId |

### Schema Change Workflow

1. Edit `packages/db/prisma/schema.prisma`
2. Run `pnpm db:generate` to regenerate client types
3. Run `pnpm db:push` to apply to dev database
4. Verify in Prisma Studio: `pnpm db:studio`
5. For production: use `pnpm db:migrate` to create a migration file

---

## API (apps/api)

### Architecture

- **Framework:** Hono (lightweight, edge-compatible)
- **Validation:** Zod schemas on all inputs
- **Database:** Prisma client from `@give/db`
- **Payments:** Stripe SDK with Connect

### Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/orgs` | POST | Create organization |
| `/api/orgs/:id` | GET | Get org with stats |
| `/api/orgs/:idOrSlug/campaigns` | GET | List org campaigns |
| `/api/campaigns` | POST | Create campaign |
| `/api/campaigns/:id` | GET, PATCH | Get/update campaign |
| `/api/campaigns/:id/public` | GET | Public campaign data (for donation pages) |
| `/api/donations` | POST, GET | Create donation / list by org |
| `/api/donations/:id` | GET | Get donation details |
| `/api/stripe/connect` | POST | Create Stripe Connect account |
| `/api/stripe/connect/refresh/:orgId` | GET | Refresh onboarding link |
| `/api/stripe/webhooks` | POST | Stripe webhook handler |

### Adding a New Route

1. Create `apps/api/src/routes/myroute.ts`
2. Export a `Hono` instance with route handlers
3. Register in `apps/api/src/index.ts`: `app.route("/api/myroute", myRoutes)`
4. Add Zod validation schemas for all inputs
5. Use `prisma` from `@give/db` for database access

### Stripe Webhook Flow

```
Stripe Event → POST /api/stripe/webhooks → Signature verified → Handler dispatched
  ├─ payment_intent.succeeded → Update donation to SUCCEEDED, update donor/campaign aggregates
  ├─ payment_intent.payment_failed → Update donation to FAILED
  └─ account.updated → Update org Stripe onboarding status
```

---

## Frontend (apps/web)

### Architecture

- **Framework:** Next.js 15 with App Router
- **React:** v19
- **Styling:** Tailwind CSS v4 (PostCSS)
- **Payments:** @stripe/react-stripe-js + @stripe/stripe-js

### Theme Colors

Defined in `apps/web/src/app/globals.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-give-primary` | `#2563eb` (blue-600) | Buttons, links, headers |
| `--color-give-accent` | `#10b981` (emerald-500) | Success states, highlights |
| `--color-give-bg` | `#f8fafc` (slate-50) | Page backgrounds |
| `--color-give-text` | `#0f172a` (slate-900) | Body text |

### Page Structure

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/` | `app/page.tsx` | Complete | Landing page (hero, pricing, features) |
| `/donate/[campaignId]` | `app/donate/[campaignId]/page.tsx` | Complete (UI) | Public donation page |
| `/dashboard` | `app/dashboard/page.tsx` | Mock data | Overview stats |
| `/dashboard/campaigns` | `app/dashboard/campaigns/page.tsx` | Mock data | Campaign list |
| `/dashboard/donors` | `app/dashboard/donors/page.tsx` | Mock data | Donor list with search |
| `/dashboard/donations` | — | Missing | Needs to be created |
| `/dashboard/settings` | — | Missing | Needs to be created |

### API Client

`apps/web/src/lib/api.ts` — Fetch wrapper with typed functions:
- `getDonationCampaign(id)` → Campaign data for donation pages
- `createDonation(data)` → POST donation, returns clientSecret
- `listCampaigns(orgId)`, `listDonations(orgId)`, `listDonors(orgId)`
- `getOrgStats(orgId)` → Dashboard summary stats

### Component Conventions

- Client components: `"use client"` directive at top
- Server components: default (no directive needed)
- Shared components: `src/components/`
- Page-specific components: inline or co-located

---

## Shared Package (packages/shared)

### Exports

**Constants:**
- `PLATFORM_FEE_BASIC` (0.01), `PLATFORM_FEE_PRO` (0.02)
- `STRIPE_CARD_RATE` (0.022), `STRIPE_CARD_FIXED` (0.30)
- `STRIPE_ACH_RATE` (0.008), `STRIPE_ACH_CAP` (5.00)

**Types:** `PlanTier`, `DonationFrequency`, `PaymentMethod`, `DonationStatus`, `CampaignType`, `CampaignStatus`, `OrgStatus`

**Interfaces:** `CreateDonationInput`, `FeeBreakdown`

**Functions:**
- `calculateFees(amountCents, paymentMethod, planTier, coverFees)` → `FeeBreakdown`
- `getPlatformFeeRate(tier)` → number

---

## Fee Calculation Logic

This is critical business logic shared between frontend (UI display) and backend (actual charging).

```
Card donation ($100, Basic tier, no fee coverage):
  Processing: $100 × 2.2% + $0.30 = $2.50
  Platform:   $100 × 1% = $1.00
  Net to org: $100 - $2.50 - $1.00 = $96.50
  Donor pays: $100.00

ACH donation ($100, Basic tier, donor covers fees):
  Gross-up:   ($100 + $0) / (1 - 0.008 - 0.01) = $101.83
  Processing: $101.83 × 0.8% = $0.81
  Platform:   $101.83 × 1% = $1.02
  Net to org: $100.00
  Donor pays: $101.83
```

---

## CI/CD

### GitHub Actions (`.github/workflows/ci.yml`)

Runs on every push to `main` and every PR:
1. Install deps (`pnpm install --frozen-lockfile`)
2. Generate Prisma client
3. Type check shared package (`tsc --noEmit`)
4. Type check API (`tsc --noEmit`)
5. Build web (`next build`)

### Vercel Deployment

- **Production:** auto-deploys on merge to `main`
- **Preview:** auto-deploys on every PR
- **URL:** give-web.vercel.app (production)
- **Framework:** Next.js (auto-detected)

---

## Code Conventions

### TypeScript
- Strict mode everywhere
- Zod for runtime validation on all API inputs
- Prisma types re-exported from `@give/db`
- Shared types from `@give/shared`

### API Patterns
- Return `c.json({ error: "message" }, statusCode)` for errors
- Use Zod `.safeParse()` for validation (never throw)
- Wrap DB/Stripe calls in try/catch, log errors, return 500
- All money values in **cents** (integer) — never floats

### Naming
- Database fields: `camelCase`
- API request/response: `camelCase`
- Prisma enums: `UPPER_SNAKE_CASE`
- Shared types: `snake_case` (to match API conventions)
- Files: `kebab-case` or `camelCase` (match existing patterns)

### Money Handling
- **Always use integer cents.** `$100.00` = `10000`
- Never store or calculate with floating point dollars
- Convert to display format only at the UI layer: `(cents / 100).toFixed(2)`
- Fee calculation uses cents throughout (`packages/shared/src/index.ts`)

---

## Current Implementation Status

### Complete (production-ready code)
- Database schema (Prisma) — 7 models, all relationships, indexes
- API routes — all CRUD endpoints, Stripe Connect, webhooks
- Fee calculation — card, ACH, cover-the-fee, correct gross-up math
- Landing page — full design, pricing, competitive positioning
- DonationForm component — UI complete (amounts, frequency, donor info, fee display)
- GoalThermometer component — animated progress bar
- Dashboard layouts — sidebar nav, responsive shell
- CI pipeline — type check + build on every PR
- Vercel deployment — production + preview

### Needs Implementation (MVP blockers)
- **Authentication** — no auth library, no login/signup, no API middleware
- **Stripe Elements** — DonationForm has placeholder, not wired to Stripe.js
- **Dashboard real data** — all pages use mock data, API client not connected
- **Email receipts** — webhook handler has TODO placeholder
- **Onboarding flow** — signup/Stripe Connect wizard pages don't exist
- **Salesforce integration** — nothing started (see PLAN.md Section 8)
- **Donations dashboard page** — route exists in sidebar but no page component
- **Settings page** — route exists in sidebar but no page component

---

## Testing Strategy

### Not Yet Implemented — Here's the Plan

**Unit tests** (Vitest):
- Fee calculation logic (`packages/shared`)
- API route handlers (mock Prisma + Stripe)
- React components (React Testing Library)

**Integration tests:**
- API endpoints with test database
- Stripe webhook handling with mock events

**E2E tests** (Playwright, later):
- Full donation flow
- Onboarding flow
- Dashboard CRUD

### Running Tests (when added)
```bash
pnpm test              # Run all tests
pnpm --filter @give/shared test   # Run shared package tests only
pnpm --filter @give/api test      # Run API tests only
```
