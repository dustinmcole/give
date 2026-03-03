# Give — Build Execution Prompts

> Each prompt below is a self-contained task for a Claude terminal.
> Read this file to understand ordering and parallelism, then copy individual prompts into terminals.

---

## Execution Order

```
PHASE 1 — Foundation (all parallel)
├── Prompt 1: Authentication (Clerk)
├── Prompt 2: Stripe Elements integration
├── Prompt 3: Email receipt service
└── Prompt 4: Salesforce SFDX project setup

PHASE 2 — Wiring (after Prompt 1 completes)
├── Prompt 5: Onboarding flow (needs auth)
├── Prompt 6: Dashboard → real data (needs auth)
└── Prompt 7: Salesforce backend integration (can start after Prompt 4)

PHASE 3 — Polish (after Phase 2)
├── Prompt 8: Salesforce field mapping UI + sync engine
└── Prompt 9: Missing pages + final wiring
```

### Dependency Map

| Prompt | Depends On | Can Run With |
|--------|-----------|--------------|
| 1 (Auth) | Nothing | 2, 3, 4 |
| 2 (Stripe Elements) | Nothing | 1, 3, 4 |
| 3 (Email) | Nothing | 1, 2, 4 |
| 4 (SF SFDX Setup) | Nothing | 1, 2, 3 |
| 5 (Onboarding) | 1 | 6, 7 |
| 6 (Dashboard Data) | 1 | 5, 7 |
| 7 (SF Backend) | 4 | 5, 6 |
| 8 (SF Mapping UI) | 7 | 9 |
| 9 (Polish) | 5, 6 | 8 |

---

## PHASE 1 — Foundation (All Parallel)

---

### PROMPT 1: Authentication with Clerk

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, and DEVELOPMENT.md first. Follow all project rules (feature branches, conventional commits, update PLAN.md).

## Task: Add authentication using Clerk

### Context
- Frontend: Next.js 15 (App Router) at apps/web
- API: Hono at apps/api
- No auth exists currently — dashboard pages are unprotected, API has no auth middleware
- Users belong to organizations via OrgMember model (see packages/db/prisma/schema.prisma)

### Requirements

**1. Install and configure Clerk**
- Add `@clerk/nextjs` to apps/web
- Create Clerk middleware in apps/web (middleware.ts)
- Protect all /dashboard/* routes — redirect to sign-in if not authenticated
- Public routes: /, /donate/*, /api/*

**2. Sign-up / Sign-in pages**
- Create /sign-in and /sign-up pages using Clerk's <SignIn /> and <SignUp /> components
- Style them to match the Give brand (blue primary #2563eb, clean/modern)
- After sign-up, redirect to /onboarding (we'll build this page later — for now just redirect to /dashboard)
- After sign-in, redirect to /dashboard

**3. API authentication middleware**
- Add a JWT verification middleware to the Hono API
- Clerk issues JWTs — verify them on the API side using Clerk's JWKS endpoint or the `@clerk/backend` package
- Create a middleware that extracts the user ID from the JWT and attaches it to the Hono context
- Apply this middleware to all /api/* routes EXCEPT: /api/health, /api/stripe/webhooks, /api/campaigns/:id/public, /api/donations (POST — the donation creation endpoint is public)
- The middleware should return 401 for missing/invalid tokens on protected routes

**4. User + Org context**
- After Clerk auth, sync the Clerk user to our User table in Prisma (create on first sign-in via webhook or on-demand)
- Add a Clerk webhook handler: POST /api/webhooks/clerk to handle user.created events
- In the dashboard, fetch the current user's org membership and make it available via React context or Clerk's org feature
- Update the dashboard layout header to show real user name and org name instead of hardcoded values

**5. Update the API client**
- Update apps/web/src/lib/api.ts to include the Clerk session token in Authorization header for all authenticated requests
- Use Clerk's `getToken()` on the client side

### Environment Variables to Add
Add to .env.example:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_WEBHOOK_SECRET

### Branch: feat/auth-clerk

### Important Notes
- Do NOT modify the Prisma schema's User model structure — Clerk user ID should be stored in a new `clerkId` field added to the User model
- Keep the donation form public (no auth required to donate)
- The /api/stripe/webhooks endpoint must remain public (no auth) because Stripe calls it
- Run `pnpm db:generate` and `pnpm db:push` after any schema changes
- Verify CI passes: type check + build
```

---

### PROMPT 2: Stripe Elements Frontend Integration

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, and DEVELOPMENT.md first. Follow all project rules.

## Task: Wire up Stripe Elements in the donation form

### Context
- The DonationForm component exists at apps/web/src/components/DonationForm.tsx
- It already handles: amount selection, frequency, donor info, cover-the-fee checkbox, fee display
- It has a placeholder where Stripe card input should go
- The API already creates a PaymentIntent and returns a clientSecret (see apps/api/src/routes/donations.ts)
- @stripe/react-stripe-js and @stripe/stripe-js are already installed in apps/web

### Requirements

**1. Add Stripe Elements provider**
- Create a StripeProvider wrapper component at apps/web/src/components/StripeProvider.tsx
- Initialize Stripe with NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Use the Elements provider with the appearance API styled to match Give's brand

**2. Update DonationForm to use Stripe Elements**
- The current flow in DonationForm.tsx:
  1. User fills in amount, frequency, donor info
  2. User clicks "Donate"
  3. Form submits to API which creates PaymentIntent
  4. API returns clientSecret
  5. ??? (this is where Stripe Elements needs to work)

- Implement the two-step payment flow:
  Step 1: Collect donor info + amount → POST to /api/donations → get clientSecret
  Step 2: Use clientSecret to confirm payment with Stripe Elements

- Use the Payment Element (not individual CardElement) — it automatically supports cards, ACH, Apple Pay, Google Pay
- Wrap the donation page in StripeProvider
- After successful payment confirmation, show a success message with donation details
- Handle payment errors gracefully (show error message, allow retry)

**3. Handle Stripe Connect**
- The PaymentIntent is created on the connected account (nonprofit's Stripe account)
- When confirming payment on the frontend, you need to pass the connected account's stripeAccount ID
- The API should return the connected Stripe account ID along with the clientSecret
- Update the API response in apps/api/src/routes/donations.ts to include stripeAccountId

**4. Payment states**
- Loading state while PaymentIntent is being created
- Payment form state (showing Stripe Elements)
- Processing state while payment is being confirmed
- Success state with receipt info (donation ID, amount, org name)
- Error state with message and retry button

**5. Mobile optimization**
- The Payment Element should work on mobile
- Ensure the form doesn't shift/jump when Stripe Elements loads
- Test at mobile viewport sizes

### Branch: feat/stripe-elements

### Important Notes
- The donation page is PUBLIC — no auth required
- The /donate/[campaignId] page.tsx fetches campaign data and passes it to DonationForm
- Don't break the existing fee calculation display — it should still show correct fee breakdown
- For the connected account, the API needs to return the org's stripeAccountId in the donation response
- The Stripe publishable key is NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env var
- Verify CI passes: type check + build
```

---

### PROMPT 3: Email Receipt Service

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, and DEVELOPMENT.md first. Follow all project rules.

## Task: Implement automated tax receipt emails

### Context
- The Stripe webhook handler at apps/api/src/routes/stripe.ts already handles payment_intent.succeeded
- It currently has a TODO placeholder: `console.log("TODO: Queue receipt email...")`
- Donations are stored in the database with all fee details
- Donors have email addresses

### Requirements

**1. Set up Resend for transactional email**
- Add the `resend` npm package to apps/api
- Create apps/api/src/lib/email.ts with a Resend client initialization
- Add RESEND_API_KEY to .env.example
- Add a FROM_EMAIL env var (e.g., "receipts@give.to" or whatever domain)

**2. Create the tax receipt email**
- Create apps/api/src/emails/donation-receipt.ts
- The receipt must be IRS-compliant for 501(c)(3) tax deductions. Include:
  - Organization name and EIN
  - Donor name
  - Donation amount (the amount the DONOR paid, not net to org)
  - Date of donation
  - Statement: "No goods or services were provided in exchange for this contribution"
  - Receipt/confirmation number
  - Note: The above statement should be configurable per donation in the future, but hardcode it for now
- Use a clean HTML email template — plain, professional, no heavy design
- Include the Give platform footer: "Powered by Give — transparent fundraising at give.to"

**3. Wire up the webhook handler**
- In handlePaymentIntentSucceeded (apps/api/src/routes/stripe.ts):
  - After updating donation status and aggregates, send the receipt email
  - Fetch the full donation with donor and org details
  - Call the email sending function
  - Update the donation record: set receiptSentAt timestamp and generate a receiptNumber
  - If email fails, log the error but don't fail the webhook (donation is still successful)

**4. Receipt number generation**
- Format: `GIVE-{YEAR}-{SEQUENTIAL_NUMBER}` (e.g., GIVE-2026-000001)
- Use the donation's creation timestamp for the year
- Sequential number can be a simple auto-increment per org, or use the donation count
- Must be unique per organization

**5. Resend error handling**
- If Resend is not configured (no API key), log a warning and skip email sending
- Don't let email failures break the webhook response — Stripe expects 200
- Log email send success/failure for debugging

### Branch: feat/email-receipts

### Important Notes
- The webhook handler must remain fast — Stripe expects response within a few seconds
- For now, send emails synchronously in the webhook handler; we'll add a queue later if needed
- Don't modify the webhook signature verification logic
- Add RESEND_API_KEY and FROM_EMAIL to .env.example
- Verify CI passes: type check + build
```

---

### PROMPT 4: Salesforce SFDX Project Setup

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, DEVELOPMENT.md, and PLAN.md (especially Section 8: Salesforce Integration Strategy) first. Follow all project rules.

## Task: Set up the Salesforce managed package project (SFDX)

### Context
Give's Salesforce integration is a core MVP feature — a managed package listed on AppExchange that syncs donors, donations, campaigns, and recurring gifts to Salesforce. It must support BOTH:
- NPSP (Nonprofit Success Pack) — Contact + Household Account, Opportunity, npe03__Recurring_Donation__c
- Nonprofit Cloud / Agentforce Nonprofit (NPC) — Person Account, Gift Transaction, Gift Commitment

See PLAN.md Section 8 for the full object mapping tables and architecture diagram.

### Requirements

**1. Create the SFDX project**
- Create a new directory: packages/salesforce/
- Initialize with: sfdx force:project:create --name give-salesforce --template standard
- Or manually create the sfdx-project.json and directory structure
- Use namespace prefix: `give` (we'll register this with Salesforce later)
- Set API version to 62.0 (latest)

**2. Project structure**
```
packages/salesforce/
├── sfdx-project.json
├── README.md
├── force-app/
│   └── main/
│       └── default/
│           ├── classes/           # Apex classes
│           ├── lwc/               # Lightning Web Components
│           ├── triggers/          # Apex triggers
│           ├── objects/           # Custom objects & fields
│           ├── permissionsets/    # Permission sets
│           ├── labels/            # Custom labels
│           └── staticresources/   # Static resources
├── config/
│   └── project-scratch-def.json  # Scratch org definition
└── scripts/                       # Setup/deployment scripts
```

**3. Scratch org definition**
- Create config/project-scratch-def.json
- Features needed: ContactsToMultipleAccounts, PersonAccounts (for NPC testing)
- Include NPSP dependencies if possible, or document manual NPSP installation steps
- Edition: Developer

**4. Custom objects and fields for sync metadata**
- Create custom object: Give_Sync_Log__c
  - Fields: Record_Id__c (text), Object_Type__c (text), Sync_Direction__c (picklist: Inbound/Outbound), Status__c (picklist: Success/Failed/Pending), Error_Message__c (long text), Give_Record_Id__c (text, external ID), Synced_At__c (datetime)
  - Purpose: Audit trail of all sync operations

- Create custom object: Give_Connection__c
  - Fields: Give_Org_Id__c (text, external ID), API_Endpoint__c (URL), Is_Active__c (checkbox), Last_Sync_At__c (datetime), Data_Model__c (picklist: NPSP/NPC), Connected_At__c (datetime)
  - Purpose: Stores the connection between SF org and Give org
  - Limit: 1 per org (enforce in Apex)

- Add custom fields to standard/NPSP objects:
  - Contact: Give_Donor_Id__c (text, external ID, unique)
  - Account: Give_Org_Donor_Id__c (text, external ID, unique)
  - Opportunity: Give_Donation_Id__c (text, external ID, unique)
  - Campaign: Give_Campaign_Id__c (text, external ID, unique)

**5. Apex foundation classes**
- GiveDataModelDetector.cls — Detects whether the org uses NPSP or NPC
  - Check if npe01__OppPayment__c object exists (NPSP indicator)
  - Check if GiftTransaction object exists (NPC indicator)
  - Return enum: NPSP, NPC, UNKNOWN
  - Cache the result in a custom metadata type or static variable

- GiveSyncService.cls — Abstract sync service interface
  - Methods: syncDonor(), syncDonation(), syncRecurringDonation(), syncCampaign()
  - Factory method: getSyncService() → returns NPSP or NPC implementation based on detected model

- GiveNPSPSyncService.cls — NPSP implementation (stub for now)
  - Implements GiveSyncService methods
  - Maps to: Contact, Opportunity, npe03__Recurring_Donation__c, Campaign

- GiveNPCSyncService.cls — NPC implementation (stub for now)
  - Implements GiveSyncService methods
  - Maps to: Person Account, Gift Transaction, Gift Commitment, Campaign

- GiveApiClient.cls — HTTP callout to Give REST API
  - Methods: getDonation(), getDonor(), getCampaign(), updateDonor()
  - Uses Named Credential for auth (Give_API named credential)
  - Handles JSON serialization/deserialization

**6. Permission set**
- Create GiveIntegrationUser permission set
  - Access to all Give custom objects and fields
  - Access to Contact, Account, Opportunity, Campaign (standard objects)
  - API access enabled

**7. Add to monorepo config**
- Update pnpm-workspace.yaml if needed (SFDX projects don't use pnpm, but the directory should be acknowledged)
- Add a note in DEVELOPMENT.md about the Salesforce package location and setup

### Branch: feat/salesforce-sfdx-setup

### Important Notes
- This is a Salesforce DX project, NOT a Node.js package. It uses Apex (Java-like), not TypeScript.
- The package will eventually be submitted to AppExchange as a 2nd-generation managed package (2GP)
- All Apex classes need corresponding test classes (min 75% coverage for AppExchange). Create stub test classes for now.
- Use the `give` namespace prefix in sfdx-project.json but DON'T hardcode it in Apex code — use namespace-agnostic references where possible
- Custom objects need __c suffix, custom fields on standard objects need __c suffix
- For NPSP objects, reference them with the npe01/npe03/npsp namespace prefixes
- For NPC objects (Gift Transaction, Gift Commitment), these are standard objects in NPC-enabled orgs
- Verify the project structure is valid: `sfdx force:source:convert` should not error
```

---

## PHASE 2 — Wiring (After Prompt 1 Completes)

---

### PROMPT 5: Nonprofit Onboarding Flow

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, and DEVELOPMENT.md first. Follow all project rules.

PREREQUISITE: Authentication (Clerk) must be implemented first (Prompt 1 / feat/auth-clerk branch must be merged).

## Task: Build the nonprofit self-service onboarding flow

### Context
- Auth is now in place (Clerk) — users can sign up and sign in
- The API can create organizations and set up Stripe Connect (see apps/api/src/routes/orgs.ts and stripe.ts)
- After signup, users need to: create their org → connect Stripe → configure their first donation form

### Requirements

**1. Onboarding wizard pages (apps/web)**
Create a multi-step onboarding flow at /onboarding/*:

**Step 1: /onboarding — Organization Details**
- Org name (required)
- Org slug (auto-generated from name, editable, validated for uniqueness)
- EIN (optional for now — "Add later" option)
- Website URL (optional)
- Logo upload (optional, use a placeholder if skipped)
- "Continue" button → creates org via API, assigns current user as OWNER

**Step 2: /onboarding/stripe — Payment Setup**
- Explain what Stripe Connect is: "Connect your bank account to receive donations"
- Show fee transparency: "Processing fees (2.2% + $0.30 cards, 0.8% ACH) + 1% Give platform fee"
- "Connect with Stripe" button → calls POST /api/stripe/connect → redirects to Stripe-hosted onboarding
- Handle return from Stripe: /onboarding/complete?orgId=... → check if onboarding is done
- If not done: show "Finish Stripe Setup" button to re-enter Stripe onboarding
- If done: auto-advance to Step 3

**Step 3: /onboarding/campaign — Create First Campaign**
- Campaign title (required)
- Description (text area)
- Goal amount (optional — "No goal" toggle)
- Campaign type: default to "Donation" for MVP
- "Create & Go to Dashboard" button → creates campaign via API → redirects to /dashboard

**2. Onboarding layout**
- Clean, focused layout (no dashboard sidebar)
- Progress indicator showing steps 1-2-3
- Give branding (logo, colors)
- "Skip for now" option on Steps 2 and 3 (but Stripe is needed to actually process donations)

**3. Stripe Connect callback pages**
- /onboarding/complete — Return URL after Stripe onboarding
  - Check org status via API
  - If stripeOnboarded: show success, proceed to Step 3
  - If not: show "Setup incomplete" with retry button
- /onboarding/refresh — Refresh URL (Stripe redirects here if link expires)
  - Fetch new onboarding link and redirect back to Stripe

**4. API updates (if needed)**
- The org creation endpoint already exists (POST /api/orgs)
- Add slug uniqueness check endpoint: GET /api/orgs/check-slug/:slug → { available: boolean }
- Ensure the org creation flow links the current Clerk user as OWNER in OrgMember table

**5. Post-onboarding redirect**
- After Clerk sign-up: redirect to /onboarding
- After Clerk sign-in (existing user with org): redirect to /dashboard
- Store the user's orgId in Clerk metadata or fetch from our API on each dashboard load

### Branch: feat/onboarding-flow

### Important Notes
- The onboarding flow is for NONPROFIT ADMINS, not donors
- Keep it fast — minimize required fields. We can collect more info later.
- The Stripe Connect Express onboarding is hosted by Stripe — we redirect there and back
- Logo upload can be a simple file input for now (upload to local storage or skip entirely for MVP)
- Don't over-design — this is functional onboarding, not a marketing page
- Verify CI passes: type check + build
```

---

### PROMPT 6: Dashboard Real Data + State Management

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, and DEVELOPMENT.md first. Follow all project rules.

PREREQUISITE: Authentication (Clerk) must be implemented first (Prompt 1 / feat/auth-clerk branch must be merged).

## Task: Replace all mock data in the dashboard with real API calls

### Context
- Dashboard pages exist at apps/web/src/app/dashboard/ (overview, campaigns, donors)
- They all use hardcoded mock data
- The API client exists at apps/web/src/lib/api.ts with typed functions
- Auth is now in place — we have the user's identity and org membership

### Requirements

**1. Determine the current user's organization**
- After auth, we need to know which org the user belongs to
- Create a React context or hook: useOrg() → { orgId, orgName, role, loading }
- Fetch from API on dashboard mount: look up user's OrgMember record
- If user has no org → redirect to /onboarding
- If user has multiple orgs → use the first one (org switcher is future work)

**2. Dashboard overview page (apps/web/src/app/dashboard/page.tsx)**
- Replace mock stats with real data from GET /api/orgs/:id (which returns totalRaised, donationCount, etc.)
- Replace mock recent donations with real data from GET /api/donations?orgId=...&limit=5
- Add loading states (skeleton/shimmer)
- Add empty states ("No donations yet — share your donation link to get started")

**3. Campaigns page (apps/web/src/app/dashboard/campaigns/page.tsx)**
- Replace mock campaigns with GET /api/orgs/:orgId/campaigns
- Keep the status badges, progress bars, and table layout
- Add a working "Create Campaign" button → navigate to /dashboard/campaigns/new
- Create /dashboard/campaigns/new page with a campaign creation form:
  - Title, slug (auto-generated), description, goal amount, cover image URL, start/end dates
  - POST to /api/campaigns → redirect to campaigns list

**4. Donors page (apps/web/src/app/dashboard/donors/page.tsx)**
- Need a donor list API endpoint — add GET /api/donors?orgId=...&page=...&limit=...&search=... to the API
  - Return: donor list with totalGiven, donationCount, lastDonationAt, tags
  - Support search by name or email
  - Paginated
- Replace mock donors with real API data
- Keep the search functionality but wire it to the API search parameter

**5. Create Donations page (apps/web/src/app/dashboard/donations/page.tsx)**
- This page is missing — create it
- Table of all donations for the org (GET /api/donations?orgId=...)
- Columns: date, donor name, amount, campaign, status, payment method
- Paginated with page controls
- Status badges (succeeded=green, pending=yellow, failed=red, refunded=gray)
- Click a row → show donation detail (modal or slide-over with full info + fees)

**6. Data fetching pattern**
- Use React Server Components where possible (fetch in the component with async/await)
- For interactive features (search, pagination), use client components with fetch
- Don't add a state management library (no Redux, no Zustand) — use React's built-in patterns
- For the API client, add the auth token header (Clerk's getToken())

**7. Create Settings page (apps/web/src/app/dashboard/settings/page.tsx)**
- Basic org settings page:
  - Org name, slug, EIN, website, logo (read-only for now, or editable with PATCH /api/orgs/:id)
  - Plan tier display (Basic 1% or Pro 2%)
  - Payout schedule (daily/weekly/monthly)
  - Stripe Connect status and link to Stripe dashboard
  - Donation form URL (shareable link)
- Don't over-build — this is a settings view, not a full admin panel

### Branch: feat/dashboard-real-data

### Important Notes
- You'll need to add a GET /api/donors endpoint to the API (it doesn't exist yet)
- The API client at apps/web/src/lib/api.ts already has function signatures — update them if needed
- Don't break the existing dashboard layout (sidebar, header)
- Empty states are important — new orgs will have zero data
- Loading states are important — prevent layout shift
- All money values come from the API in cents — convert to dollars for display: (cents / 100).toFixed(2)
- Verify CI passes: type check + build
```

---

### PROMPT 7: Salesforce Backend Integration (API Side)

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, DEVELOPMENT.md, and PLAN.md (especially Section 8: Salesforce Integration Strategy) first. Follow all project rules.

PREREQUISITE: Salesforce SFDX project must be set up (Prompt 4 / feat/salesforce-sfdx-setup branch should be merged or in progress).

## Task: Build the Salesforce integration backend in the Give API

### Context
- The Salesforce managed package (packages/salesforce) handles the Salesforce-side logic
- This task is the Give API side: managing SF connections, triggering syncs, handling OAuth
- Nonprofits connect their Salesforce org from the Give dashboard
- When donations/donors are created/updated, we sync them to Salesforce in real time

### Requirements

**1. Database schema updates (packages/db/prisma/schema.prisma)**

Add these models:

```prisma
model SalesforceConnection {
  id                String   @id @default(cuid())
  orgId             String   @unique
  org               Organization @relation(fields: [orgId], references: [id])
  salesforceOrgId   String   @unique  // The SF org's 18-char ID
  instanceUrl       String             // e.g., https://na1.salesforce.com
  accessToken       String             // Encrypted in production
  refreshToken      String             // Encrypted in production
  dataModel         String             // "NPSP" or "NPC"
  isActive          Boolean  @default(true)
  lastSyncAt        DateTime?
  connectedAt       DateTime @default(now())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model SyncLog {
  id              String   @id @default(cuid())
  orgId           String
  org             Organization @relation(fields: [orgId], references: [id])
  objectType      String   // "donor", "donation", "campaign", "recurring_donation"
  giveRecordId    String   // ID of the record in Give
  sfRecordId      String?  // ID of the record in Salesforce (null if failed)
  direction       String   // "outbound" (Give→SF) or "inbound" (SF→Give)
  status          String   // "success", "failed", "pending"
  errorMessage    String?
  syncedAt        DateTime @default(now())

  @@index([orgId, syncedAt])
  @@index([giveRecordId])
}
```

Also add to Organization model:
```prisma
  salesforceConnection  SalesforceConnection?
  syncLogs              SyncLog[]
```

Run `pnpm db:generate` and `pnpm db:push` after schema changes.

**2. Salesforce OAuth flow**

Create apps/api/src/routes/salesforce.ts with these endpoints:

- GET /api/salesforce/auth/:orgId
  - Generate Salesforce OAuth authorization URL
  - Redirect user to Salesforce login
  - OAuth params: client_id, redirect_uri, response_type=code, scope (api, refresh_token, offline_access)
  - State parameter: encode orgId for the callback

- GET /api/salesforce/callback
  - Handle OAuth callback from Salesforce
  - Exchange authorization code for access_token + refresh_token
  - Query Salesforce to get the org ID and instance URL
  - Detect data model (NPSP vs NPC) by querying for NPSP objects
  - Create SalesforceConnection record
  - Redirect to /dashboard/settings?sf=connected

- POST /api/salesforce/disconnect/:orgId
  - Revoke the access token
  - Set isActive=false on the connection
  - Don't delete — keep for audit trail

- GET /api/salesforce/status/:orgId
  - Return connection status, data model detected, last sync time
  - Test the connection by making a simple API call to SF

**3. Salesforce sync service**

Create apps/api/src/lib/salesforce-sync.ts:

- syncDonorToSalesforce(donorId, orgId)
  - Fetch donor from DB
  - Fetch SF connection for org
  - Based on data model (NPSP vs NPC):
    - NPSP: Upsert Contact using Give_Donor_Id__c as external ID
    - NPC: Upsert Person Account using Give_Donor_Id__c as external ID
  - Log result to SyncLog

- syncDonationToSalesforce(donationId, orgId)
  - Fetch donation with donor and campaign
  - Based on data model:
    - NPSP: Create Opportunity (Closed Won), create npe01__OppPayment__c
    - NPC: Create Gift Transaction
  - Link to Campaign if exists
  - Log result to SyncLog

- syncCampaignToSalesforce(campaignId, orgId)
  - Upsert Campaign using Give_Campaign_Id__c as external ID
  - Log result to SyncLog

- refreshAccessToken(connectionId)
  - Use refresh_token to get new access_token
  - Update SalesforceConnection record
  - Handle refresh failure (mark connection as inactive)

**4. Wire sync into existing flows**

- In the Stripe webhook handler (handlePaymentIntentSucceeded):
  - After updating donation status and sending receipt
  - Check if org has an active SF connection
  - If yes: call syncDonorToSalesforce() and syncDonationToSalesforce()
  - If sync fails, log error but don't fail the webhook

- In campaign creation (POST /api/campaigns):
  - After creating campaign in DB
  - Check if org has an active SF connection
  - If yes: call syncCampaignToSalesforce()

**5. Salesforce API helper**

Create apps/api/src/lib/salesforce-api.ts:

- A simple wrapper around Salesforce REST API calls
- Methods: query(soql), create(sobject, data), update(sobject, id, data), upsert(sobject, externalIdField, externalId, data)
- Handle auth (Bearer token), instance URL, API version (v62.0)
- Handle token refresh on 401
- JSON serialization/deserialization

### Environment Variables to Add
Add to .env.example:
- SALESFORCE_CLIENT_ID (Connected App consumer key)
- SALESFORCE_CLIENT_SECRET (Connected App consumer secret)
- SALESFORCE_REDIRECT_URI (OAuth callback URL, e.g., http://localhost:3001/api/salesforce/callback)

### Branch: feat/salesforce-api-integration

### Important Notes
- Access/refresh tokens should be stored encrypted in production — for MVP, plain text in DB is acceptable but add a TODO comment
- Salesforce API rate limits: 15,000 API calls per 24 hours for most orgs. Real-time sync is fine at MVP scale.
- Use composite requests or bulk API for batch operations in the future
- The sync should be fire-and-forget from the webhook handler's perspective — don't block the webhook response
- Salesforce REST API base: {instanceUrl}/services/data/v62.0/
- External ID upsert: PATCH /services/data/v62.0/sobjects/{SObject}/{ExternalIdField}/{ExternalIdValue}
- Verify CI passes: type check + build
```

---

## PHASE 3 — Polish

---

### PROMPT 8: Salesforce Field Mapping UI + Sync Engine Completion

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, DEVELOPMENT.md, and PLAN.md (Section 8) first. Follow all project rules.

PREREQUISITE: Salesforce backend integration must be implemented (Prompt 7 / feat/salesforce-api-integration must be merged).

## Task: Build the Salesforce settings UI and complete the sync engine

### Requirements

**1. Salesforce connection UI in dashboard settings**

Add a Salesforce section to /dashboard/settings (or create /dashboard/settings/salesforce):

- **Not connected state:**
  - "Connect Salesforce" button
  - Brief explanation: "Sync donors, donations, and campaigns to your Salesforce org in real-time"
  - Shows: "Supports both NPSP and Nonprofit Cloud"

- **Connected state:**
  - Connection status (green dot + "Connected to [SF org name]")
  - Data model detected: "NPSP" or "Nonprofit Cloud"
  - Last sync timestamp
  - "Disconnect" button (with confirmation dialog)
  - Link to sync log

**2. Field mapping UI**

Create /dashboard/settings/salesforce/mapping page:

- Show default field mappings based on data model (NPSP or NPC)
- Display as a two-column table: Give Field ↔ Salesforce Field
- For MVP: show the mappings as read-only (no custom mapping yet)
- Group by object: Donors, Donations, Campaigns, Recurring Donations
- This gives nonprofits visibility into what's being synced and how

**3. Sync log viewer**

Create /dashboard/settings/salesforce/logs page:

- Table of recent sync operations from SyncLog
- Columns: timestamp, object type, Give record, SF record, direction, status
- Filter by: status (success/failed), object type
- For failed syncs: show error message
- "Retry" button on failed syncs (re-trigger the sync for that record)
- Paginated, most recent first

**4. API endpoints for SF settings**

Add to apps/api/src/routes/salesforce.ts:

- GET /api/salesforce/mappings/:orgId → Return field mappings for the org's data model
- GET /api/salesforce/logs/:orgId?page=1&limit=20&status=&objectType= → Paginated sync logs
- POST /api/salesforce/retry/:syncLogId → Retry a failed sync operation

**5. Complete the sync engine**

Ensure all sync operations in apps/api/src/lib/salesforce-sync.ts are fully implemented:
- Donor sync: full field mapping (name, email, phone → Contact/Person Account fields)
- Donation sync: amount, date, payment method, campaign attribution, fee fields → Opportunity/Gift Transaction
- Campaign sync: title, description, goal, dates → Campaign object
- Recurring donation sync: frequency, amount, status → Recurring Donation/Gift Commitment
- Handle errors gracefully and log everything to SyncLog

### Branch: feat/salesforce-field-mapping-ui

### Important Notes
- The field mapping UI is READ-ONLY for MVP. Editable custom mappings come in Round 1.
- The sync log should show real data from the SyncLog table
- Keep the UI simple — this is a settings page, not a dashboard
- Verify CI passes: type check + build
```

---

### PROMPT 9: Missing Pages + Final Wiring + Polish

```
You are working on Give, a nonprofit fundraising platform. The codebase is a TypeScript monorepo at /Users/dustin/projects/datawake-give.

Read CLAUDE.md, GITHUB.md, and DEVELOPMENT.md first. Follow all project rules.

PREREQUISITE: Auth, onboarding, and dashboard real data should all be merged (Prompts 1, 5, 6).

## Task: Final polish pass — fill gaps, fix wiring, ensure end-to-end flow works

### Requirements

**1. Donation page improvements**
- Ensure /donate/[campaignId] works end to end:
  - Fetches campaign data from public API
  - Shows campaign info (title, description, cover image, goal thermometer)
  - DonationForm with Stripe Elements processes payment
  - Success state shows confirmation + receipt message
- Handle edge cases:
  - Campaign not found → 404 page
  - Campaign not active → "This campaign is no longer accepting donations"
  - Org hasn't completed Stripe setup → "Donations coming soon"

**2. QR code generation for campaigns**
- On the campaign detail page in the dashboard, show a QR code that links to the public donation page
- Use a QR code library (e.g., `qrcode` npm package or `next/image` with a QR API)
- Allow downloading the QR code as PNG
- This is a key feature for events and printed materials

**3. Social sharing**
- On the public donation page, add social sharing buttons/links:
  - Copy link
  - Share to Facebook
  - Share to Twitter/X
  - Share to LinkedIn
- Use native share API on mobile (navigator.share)

**4. Dashboard navigation polish**
- Ensure all sidebar links work and navigate correctly
- Active state on current page
- Mobile responsive sidebar (hamburger menu)
- Breadcrumbs where appropriate

**5. 404 and error pages**
- Create apps/web/src/app/not-found.tsx — custom 404 page
- Create apps/web/src/app/error.tsx — custom error boundary
- Style them consistently with Give branding

**6. Landing page → signup flow**
- "Get Started Free" button on landing page → /sign-up
- After sign-up → /onboarding (verify this flow works end to end)
- "Log In" button → /sign-in
- After sign-in → /dashboard (verify)

**7. Favicon and metadata**
- Add a Give favicon (simple "G" in brand blue, or a heart icon)
- Update metadata in apps/web/src/app/layout.tsx:
  - Title: "Give — Transparent Nonprofit Fundraising"
  - Description: "The fundraising platform that charges 1%, not 17%. Donation forms, CRM, Salesforce integration — all included."
  - Open Graph tags for social sharing

**8. Responsive audit**
- Test all pages at mobile (375px), tablet (768px), and desktop (1280px)
- Fix any layout breakages
- Ensure donation form works well on mobile
- Dashboard should be usable on tablet

### Branch: feat/polish-and-wiring

### Important Notes
- This is a polish pass, not new features. Focus on making existing features work smoothly.
- Test the full flow: landing page → sign up → onboarding → create campaign → share link → donor donates → receipt email → shows in dashboard
- Don't add features that aren't in the MVP list
- Verify CI passes: type check + build
```

---

## Post-MVP Prompts (Queue These for Round 1)

These are not needed for launch but should be queued:

- **Prompt 10:** Donor CRM (basic) — contact profiles, giving history, tags, search, export
- **Prompt 11:** Campaign pages — branded fundraising pages with goal thermometers, donor rolls
- **Prompt 12:** Reporting — donation totals/trends, campaign performance, donor retention
- **Prompt 13:** Recurring giving management — donor self-service portal
- **Prompt 14:** Multi-user access — role-based permissions
- **Prompt 15:** Embeddable widgets — donation form embed code for external sites
- **Prompt 16:** Data import/migration — CSV import + competitor migration tools
- **Prompt 17:** Salesforce custom field mapping — editable field mapper UI
- **Prompt 18:** AppExchange submission — security review prep, listing assets, submission

---

## Tips for Running These Prompts

1. **Phase 1 can fully parallelize** — run Prompts 1-4 in four separate terminals simultaneously
2. **Phase 2 starts when Prompt 1 merges** — Prompts 5 and 6 can run in parallel; Prompt 7 can start after Prompt 4
3. **Phase 3 starts when Phase 2 is done** — Prompts 8 and 9 can run in parallel
4. **Each prompt creates its own feature branch** — merge conflicts should be minimal since they touch different files
5. **Merge order matters** — merge Prompt 1 first, then 2/3/4 in any order, then 5/6/7, then 8/9
6. **After each merge** — other terminals should `git pull origin main` to get the latest
