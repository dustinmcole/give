# Migration Tooling Research

> **Last updated:** 2026-02-28
> **Status:** Research complete — ready for implementation planning
> **Priority:** Round 1 (fast-follow after MVP)

---

## Executive Summary

We researched data export and migration capabilities across five competing platforms: **Givebutter**, **Zeffy**, **Donorbox**, **Give Lively**, and **Classy (GoFundMe Pro)**. Key findings:

- **All platforms export CSV.** This is the universal common denominator. Our import tool must accept CSV as the primary format.
- **API access varies wildly.** Classy has 40+ API resources; Givebutter has a usable REST API; Donorbox has a paid API add-on; Zeffy and Give Lively have **zero API access**.
- **Recurring donation migration is the hardest problem.** Payment tokens are platform-specific. Stripe-to-Stripe transfers are possible but require coordination. PayPal recurring plans cannot be migrated at all.
- **Every platform traps design/content data.** Campaign pages, email templates, form designs, and communication history are universally non-exportable.
- **Donor deduplication by email** is the standard across all platforms. Our import should match on email + orgId.

---

## 1. Competitor Export Capabilities

### 1.1 Givebutter

**Export formats:** CSV only (download from dashboard, links expire in 48-72 hours)

**Donor export fields:**
| Field | Maps to Give |
|-------|-------------|
| Contact ID | (external reference) |
| Prefix | — (not in our schema) |
| First Name | `Donor.firstName` |
| Middle Name | — (not in our schema) |
| Last Name | `Donor.lastName` |
| Suffix | — (not in our schema) |
| Date of Birth | — |
| Gender | — |
| Company | — |
| Title | — |
| Primary Email | `Donor.email` |
| Primary Phone | `Donor.phone` |
| Address Line 1 | — (not in our schema yet) |
| Address Line 2 | — |
| City / State / Postal Code / Country | — |
| Recurring Contribution | (derived from donations) |
| Total Contribution | `Donor.totalGivenCents` |
| Tags | `DonorTag.name` |
| Notes | — |
| Household | — |
| Date Created (UTC) | `Donor.createdAt` |

**Donation export fields:**
| Field | Maps to Give |
|-------|-------------|
| Campaign | `Campaign.title` (lookup) |
| Reference # | (external reference) |
| First Name / Last Name / Email | Donor lookup |
| Amount | `Donation.amountCents` |
| Fee | `Donation.processingFeeCents` |
| Fee Covered | `Donation.coverFees` |
| Donated | `Donation.netAmountCents` |
| Payout | — |
| Method | `Donation.paymentMethod` |
| Status | `Donation.status` |
| Frequency | `Donation.frequency` |
| Recurring Plan ID | `Donation.stripeSubscriptionId` |
| Dedication Type / Name | `Donation.dedicationType` / `dedicationName` |
| Transaction date UTC | `Donation.createdAt` |
| UTM Source / Medium / Campaign | — (not tracked yet) |
| Anonymous Hide Name | `Donor.anonymous` |
| Fund ID / Fund Code / Fund Name | — (designation, future) |

**API:** REST API with Bearer token auth. 100 req/60s rate limit. Endpoints for contacts, transactions, plans, campaigns, funds. Read and write access. 9 webhook event types.

**Not exportable:** Email campaign content/stats, communication history, campaign page designs, form customizations, file attachments, pledges, segment/filter configs, user accounts/permissions, receipt templates.

**Migration notes:**
- API-based migration is feasible (GET contacts → GET transactions → GET plans)
- 10,000-contact org ≈ 100 minutes to fully extract via API at rate limit
- **Stripe recurring plans** can potentially migrate at the Stripe level (re-attaching PaymentMethods). However, Givebutter processes payments through both Stripe and Adyen — check the `Method` field. Only Stripe-processed plans are eligible for payment token migration; Adyen plans require donor re-subscription.
- PayPal recurring plans CANNOT be migrated

---

### 1.2 Zeffy

**Export formats:** CSV/Excel only (large exports emailed to org's account email)

**Donor export fields (13 total — very thin):**
| Field | Maps to Give |
|-------|-------------|
| First Name | `Donor.firstName` |
| Last Name | `Donor.lastName` |
| Email | `Donor.email` |
| Phone | `Donor.phone` |
| Address / City / Region / Postal Code / Country | — (not in our schema yet) |
| Company Name | — |
| Tags | `DonorTag.name` |
| Note | — |
| Language | — |

**Donation export fields:**
| Field | Maps to Give |
|-------|-------------|
| Amount | — (total paid including Zeffy's voluntary tip — do NOT use as donation amount) |
| Donation amount | `Donation.amountCents` (actual gift, excluding tip) |
| Payment method | `Donation.paymentMethod` |
| Payment status | `Donation.status` |
| Refunded amount | — |
| Campaign title | `Campaign.title` (lookup) |
| Eligible amount | — (tax-deductible portion) |
| In honor of | `Donation.dedicationName` |
| Rate title (item name) | — |

> **Important:** Zeffy separates "Amount" (gross paid including platform tip) from "Donation amount" (actual gift). Always use `Donation amount` for `amountCents`. Using "Amount" will inflate giving totals by ~4% (average tip rate).

**API:** **None.** Zeffy has no public API. Only integration is Zapier with 2 triggers (Get Donations, Get Order) — no actions, no bulk historical access.

**Not exportable:** Active recurring payment methods/subscriptions (biggest pain point — donors must re-subscribe manually), Stripe tokens, campaign designs, email history/analytics, engagement scores, membership renewal schedules, auction bid history.

**Migration notes:**
- CSV upload is the ONLY extraction path — no "connect your account" flow possible
- Zeffy's data model is simple (13 contact fields, no custom fields) making CSV mapping straightforward
- Recurring subscription migration is impossible — must build donor re-engagement workflow
- Payment tokens are platform-specific and cannot transfer between Stripe Connect accounts

---

### 1.3 Donorbox

**Export formats:** CSV only (customizable column selection)

**Donor export fields:**
| Field | Maps to Give |
|-------|-------------|
| id | (external reference) |
| first_name | `Donor.firstName` |
| last_name | `Donor.lastName` |
| email | `Donor.email` |
| phone | `Donor.phone` |
| address / city / state / zip_code / country | — (not in our schema yet) |
| employer / occupation | — |
| donations_count | `Donor.donationCount` |
| last_donation_at | `Donor.lastDonationAt` |
| total | `Donor.totalGivenCents` |

**Donation export fields:**
| Field | Maps to Give |
|-------|-------------|
| id | (external reference) |
| campaign.name | `Campaign.title` (lookup) |
| donor.email | Donor lookup |
| amount | `Donation.amountCents` |
| recurring | `Donation.frequency` |
| status | `Donation.status` |
| stripe_charge_id | (external reference) |
| processing_fee | `Donation.processingFeeCents` |
| currency | `Donation.currency` |
| designation | — (fund allocation, future) |
| donation_date | `Donation.createdAt` |
| comment | — |
| anonymous_donation | `Donor.anonymous` |
| interval | `Donation.frequency` (map: "1 M" → MONTHLY, "3 M" → QUARTERLY, "1 Y" → ANNUAL) |
| utm_source / utm_campaign | — |
| questions | — (custom form responses) |

**API:** REST API with Basic HTTP auth. $17/month add-on. 60 req/min rate limit. Endpoints for campaigns, donations, donors, plans, events, tickets. Read-only for most resources.

**Webhooks:** 3 events — donation_completed, donation_updated, ticket_created.

**Not exportable:** Communication records, internal notes, donor tags, donor segments, supporter timeline, Donor Moments alerts, receipt history, duplicate merge history, custom form/campaign designs, email templates. PayPal recurring subscriptions cannot be migrated.

**Migration notes:**
- API-based migration works but requires the org to have the $17/mo add-on
- Pagination: max 100 per page, 60 req/min — a 10,000-donation org takes ~17 minutes
- Stripe recurring migration takes 4-6 weeks and requires coordination between nonprofit, Donorbox, and Stripe
- Donorbox tracks richer CRM data than what's in the API (notes, tags, communication logs) — all lost on migration

---

### 1.4 Give Lively

**Export formats:** CSV only ("Line Items (All)" report — 80+ columns, one row per donation)

**Donor fields (embedded in transaction rows — must deduplicate):**
| Field | Maps to Give |
|-------|-------------|
| First Name | `Donor.firstName` |
| Last Name | `Donor.lastName` |
| Email | `Donor.email` |
| Donor Phone Number | `Donor.phone` |
| Donor Mailing Street/City/State/Zip/Country | — |
| Anonymous to Public | `Donor.anonymous` |

**Donation fields:**
| Field | Maps to Give |
|-------|-------------|
| Line Item ID | (external reference) |
| Original Amount | `Donation.amountCents` |
| Gross Amount | `Donation.totalChargedCents` |
| Covered Transaction Fee Amount | `Donation.coverFees` (boolean: > 0 = true) |
| Transaction Fee Amount | `Donation.processingFeeCents` |
| Platform Fee Amount | `Donation.platformFeeCents` |
| Net Amount | `Donation.netAmountCents` |
| Payment Status | `Donation.status` |
| Payment Method | `Donation.paymentMethod` |
| Frequency | `Donation.frequency` ("one-time" → ONE_TIME, "monthly" → MONTHLY) |
| Payment Platform Charge ID | (Stripe charge ID — external reference) |
| Payment Platform Subscription ID | `Donation.stripeSubscriptionId` |
| Page Name | `Campaign.title` (lookup) |
| Page Type | `Campaign.type` (map: "Campaign"→DONATION, "Event"→EVENT, "Fundraiser"→PEER_TO_PEER, "Team"→PEER_TO_PEER, "Nonprofit"→DONATION) |
| Dedication Name / Type | `Donation.dedicationType` / `dedicationName` |
| UTM Source | — |
| Referrer URL | — |
| Sf Opportunity ID | — (Salesforce reference, not imported) |

**API:** **None.** No public API, no webhooks, no developer documentation. Only integrations are Salesforce (AppExchange, hourly batch) and Zapier (3 triggers, no actions).

**Not exportable:** Donor communication history, form/page designs, email templates, P2P fundraiser content, widget configurations, Salesforce sync logs. Recurring subscription active/paused/cancelled status is NOT in the CSV.

**Migration notes:**
- CSV is the only path — no automated "connect and pull" migration
- **Critical:** Export is one-row-per-donation, not one-row-per-donor. A donor with 50 gifts = 50 rows. Must aggregate by email to create donor records.
- Recurring status must be inferred from payment history (look for regular monthly charges)
- **Stripe account portability is the ace card:** Give Lively nonprofits have their own Stripe accounts. They can potentially disconnect from Give Lively and connect to Give without losing payment methods, recurring subscriptions, or payout history. This is the strongest migration lever for this platform.

---

### 1.5 Classy (GoFundMe Pro)

**Export formats:** CSV (customizable columns, all report types). Also full REST API with JSON responses.

**Donor export fields:**
| Field | Maps to Give |
|-------|-------------|
| Supporter ID | (external reference) |
| First Name | `Donor.firstName` |
| Last Name | `Donor.lastName` |
| Email | `Donor.email` |
| Phone | `Donor.phone` |
| Address 1/2, City, State, Zip, Country | — |
| Gender | — |

**Donation export fields:**
| Field | Maps to Give |
|-------|-------------|
| Transaction ID | (external reference) |
| Donation Gross Amount | `Donation.amountCents` |
| Donation Net Amount | `Donation.netAmountCents` |
| Classy Fees Amount + Fees Amount | `Donation.platformFeeCents` + `Donation.processingFeeCents` |
| Is Donor Covered Fee | `Donation.coverFees` |
| Payment Method / Payment Type | `Donation.paymentMethod` |
| Transaction Status | `Donation.status` |
| Currency Code | `Donation.currency` |
| Anonymous | `Donor.anonymous` |
| Comment | — |
| Designation Name | — (fund allocation, future) |
| Recurring Donation Plan ID | `Donation.stripeSubscriptionId` |
| Transaction Frequency | `Donation.frequency` |
| Campaign Name | `Campaign.title` (lookup) |
| Purchased Date | `Donation.createdAt` |
| Dedication Type / Name / Message | `Donation.dedicationType` / `dedicationName` / `dedicationMessage` |

**API:** Full REST API (OAuth 2.0). 40+ resources. Official Node.js and PHP SDKs. Endpoints for organizations, campaigns, transactions, supporters, recurring plans, fundraising pages/teams, dedications, designations, and more. Full CRUD on most resources.

**Not exportable:** Campaign page designs/templates, email campaign content/history/analytics, engagement scores, workflow/automation configs, comment threads, domain masking configs.

**Migration notes:**
- Richest API among all competitors — automated migration via API is highly feasible
- Recurring donation token transfer requires Classy Professional Services, PGP encryption, SFTP, ~1 month timeline. Expect 8-11% soft decline rate.
- Official Node.js SDK (`classy-node`) available for building migration tools

---

## 2. Comparison Matrix

| Capability | Givebutter | Zeffy | Donorbox | Give Lively | Classy |
|-----------|-----------|-------|----------|------------|--------|
| **CSV export** | Yes | Yes | Yes | Yes | Yes |
| **API access** | REST (free) | None | REST ($17/mo) | None | REST (OAuth) |
| **API rate limit** | 100/60s | N/A | 60/min | N/A | Rate-limited |
| **Webhooks** | 9 events | None | 3 events | None | Via API |
| **Donor fields** | 30+ | 13 | 18 | 15 | 12+ |
| **Custom fields** | Yes | No | Yes (questions) | No | Yes (questions) |
| **Donor tags** | Yes | Yes | No (in export) | No | No |
| **Address data** | Yes | Yes | Yes | Yes | Yes |
| **Recurring plan export** | Yes (separate) | Partial | Yes (separate) | Inferred only | Yes |
| **Stripe recurring migration** | Yes (Stripe-based only) | No | Yes (4-6 weeks) | Yes (own Stripe) | Yes (requires Pro Services) |
| **PayPal recurring migration** | No | No | No | N/A | N/A |
| **Dedication/tribute data** | Yes | Partial | No | Yes | Yes |
| **UTM tracking** | Yes | No | Yes | Yes | No (in export) |
| **SDK available** | No | No | No | No | Yes (Node.js, PHP) |

---

## 3. Universal CSV Import Schema

Our import tool should accept a single CSV format that maps cleanly from any competitor. Nonprofits can either export from their current platform and upload directly (we auto-detect the source), or use our universal template.

### 3.1 Donor Import Template

```csv
email,first_name,last_name,phone,address_line1,address_line2,city,state,postal_code,country,company,tags,notes,anonymous,external_id,source_platform,created_at
```

| Column | Required | Type | Notes |
|--------|----------|------|-------|
| `email` | **Yes** | string | Primary dedup key (unique per org) |
| `first_name` | **Yes** | string | |
| `last_name` | **Yes** | string | |
| `phone` | No | string | Any format accepted, normalized on import |
| `address_line1` | No | string | Street address |
| `address_line2` | No | string | Apt/suite/unit |
| `city` | No | string | |
| `state` | No | string | State/province/region |
| `postal_code` | No | string | Zip code |
| `country` | No | string | ISO 2-letter code preferred, full name accepted |
| `company` | No | string | Corporate/org donor name |
| `tags` | No | string | Pipe-delimited: `"major-donor\|board-member\|gala-2024"` |
| `notes` | No | string | Free-text notes |
| `anonymous` | No | boolean | `true`/`false`, `yes`/`no`, `1`/`0` |
| `external_id` | No | string | ID from source platform (for reference/dedup) |
| `source_platform` | No | string | `givebutter`, `zeffy`, `donorbox`, `givelively`, `classy`, `other` |
| `created_at` | No | datetime | ISO 8601 or `MM/DD/YYYY`. Defaults to import time. |

### 3.2 Donation Import Template

```csv
donor_email,amount,currency,status,frequency,payment_method,campaign_name,cover_fees,processing_fee,platform_fee,net_amount,dedication_type,dedication_name,dedication_message,anonymous,external_id,stripe_charge_id,source_platform,donated_at
```

| Column | Required | Type | Notes |
|--------|----------|------|-------|
| `donor_email` | **Yes** | string | Must match a donor record (import donors first) |
| `amount` | **Yes** | decimal | Dollar amount (e.g., `50.00`). Converted to cents internally. |
| `currency` | No | string | ISO 4217 code. Default: `usd` |
| `status` | No | string | `succeeded`, `refunded`, `failed`, `disputed`. Default: `succeeded` |
| `frequency` | No | string | `one_time`, `monthly`, `quarterly`, `annual`. Default: `one_time` |
| `payment_method` | No | string | `card`, `ach`, `apple_pay`, `google_pay`. Default: `card` |
| `campaign_name` | No | string | Matched to existing campaign by name, or creates a new one |
| `cover_fees` | No | boolean | Whether donor covered fees |
| `processing_fee` | No | decimal | Stripe/processor fee amount |
| `platform_fee` | No | decimal | Platform fee amount |
| `net_amount` | No | decimal | Net to nonprofit. If omitted, calculated from amount - fees. |
| `dedication_type` | No | string | `in_honor` or `in_memory` |
| `dedication_name` | No | string | Honoree/memorial name |
| `dedication_message` | No | string | |
| `anonymous` | No | boolean | Donor chose to be anonymous for this donation |
| `external_id` | No | string | Transaction ID from source platform |
| `stripe_charge_id` | No | string | Original Stripe charge ID (for reconciliation) |
| `source_platform` | No | string | `givebutter`, `zeffy`, `donorbox`, `givelively`, `classy`, `other` |
| `donated_at` | **Yes** | datetime | ISO 8601 or `MM/DD/YYYY`. When the donation was made. |

### 3.3 Campaign Import Template

```csv
name,slug,description,type,goal_amount,currency,start_date,end_date,external_id,source_platform
```

| Column | Required | Type | Notes |
|--------|----------|------|-------|
| `name` | **Yes** | string | Campaign title |
| `slug` | No | string | URL slug. Auto-generated from name if omitted. |
| `description` | No | string | Campaign description |
| `type` | No | string | `donation`, `peer_to_peer`, `event`, `membership`. Default: `donation` |
| `goal_amount` | No | decimal | Fundraising goal in dollars |
| `currency` | No | string | Default: `usd` |
| `start_date` | No | datetime | |
| `end_date` | No | datetime | |
| `external_id` | No | string | Campaign ID from source platform |
| `source_platform` | No | string | Platform identifier |

---

## 4. Competitor Field Mapping to Prisma Schema

### 4.1 Givebutter → Give

**Donor mapping:**
```
Givebutter CSV              →  Give Prisma Model
─────────────────────────────────────────────────
Primary Email               →  Donor.email (dedup key)
First Name                  →  Donor.firstName
Last Name                   →  Donor.lastName
Primary Phone               →  Donor.phone
Total Contribution          →  Donor.totalGivenCents (×100)
Tags                        →  DonorTag[] (split comma-separated)
Date Created (UTC)          →  Donor.createdAt
Anonymous Hide Name         →  Donor.anonymous
Address Line 1/2            →  (future: Donor.address fields)
City/State/Postal/Country   →  (future: Donor.address fields)
Company                     →  (future: Donor.company)
```

**Donation mapping:**
```
Givebutter CSV              →  Give Prisma Model
─────────────────────────────────────────────────
Amount                      →  Donation.amountCents (×100)
Fee                         →  Donation.processingFeeCents (×100)
Fee Covered (amount)        →  Donation.coverFees (boolean)
Donated                     →  Donation.netAmountCents (×100)
Payout                      →  (informational only)
Method                      →  Donation.paymentMethod (map: "credit_card"→CARD, "ach"→ACH)
Status                      →  Donation.status (map: "succeeded"→SUCCEEDED, etc.)
Frequency                   →  Donation.frequency (map: "Monthly"→MONTHLY, "Quarterly"→QUARTERLY, "Yearly"→ANNUAL)
Currency                    →  Donation.currency
Campaign                    →  Campaign lookup by title → Donation.campaignId
Transaction date UTC        →  Donation.createdAt
Dedication Type             →  Donation.dedicationType (map: "In Honor Of"→"in_honor", "In Memory Of"→"in_memory")
Dedication Name             →  Donation.dedicationName
Recurring Plan ID           →  Donation.stripeSubscriptionId (if migrating Stripe)
Reference #                 →  (stored as external reference)
```

### 4.2 Zeffy → Give

**Donor mapping:**
```
Zeffy CSV                   →  Give Prisma Model
─────────────────────────────────────────────────
Email                       →  Donor.email (dedup key)
First Name                  →  Donor.firstName
Last Name                   →  Donor.lastName
Phone                       →  Donor.phone
Tags                        →  DonorTag[] (split by delimiter)
Note                        →  (future: Donor.notes)
Company Name                →  (future: Donor.company)
Address/City/Region/Postal  →  (future: Donor.address fields)
```

**Donation mapping:**
```
Zeffy CSV                   →  Give Prisma Model
─────────────────────────────────────────────────
Donation amount             →  Donation.amountCents (×100) ← use this field, NOT "Amount"
Amount                      →  (skip — includes voluntary Zeffy tip)
Payment method              →  Donation.paymentMethod (map: "card"→CARD, "ach"→ACH,
                               "applePayOrGooglePay"→APPLE_PAY or GOOGLE_PAY*,
                               "pad"→ACH, "cash"/"cheque"/"transfer"→CARD as fallback)
Payment status              →  Donation.status (map: "Succeeded"→SUCCEEDED,
                               "Monthly"/"Yearly"→SUCCEEDED, "Past Due"→FAILED,
                               "Stopped"→SUCCEEDED, "Refunded"→REFUNDED)
Campaign title              →  Campaign lookup by title → Donation.campaignId
Eligible amount             →  (informational — tax-deductible portion)
In honor of                 →  Donation.dedicationName + dedicationType="in_honor"
```

*Zeffy's `applePayOrGooglePay` method cannot be differentiated. Default to `APPLE_PAY`; log as ambiguous for reporting.

**Note:** Zeffy has no standalone recurring plan export. Recurring status is embedded in the payment status field ("Monthly", "Yearly", "Monthly + New", "Yearly + New"). Filter for these values to identify recurring donors.

### 4.3 Donorbox → Give

**Donor mapping:**
```
Donorbox CSV/API            →  Give Prisma Model
─────────────────────────────────────────────────
email                       →  Donor.email (dedup key)
first_name                  →  Donor.firstName
last_name                   →  Donor.lastName
phone                       →  Donor.phone
donations_count             →  Donor.donationCount
last_donation_at            →  Donor.lastDonationAt
total                       →  Donor.totalGivenCents (×100, extract from currency array)
address/city/state/zip/country → (future: Donor.address fields)
employer/occupation         →  (future fields)
```

**Donation mapping:**
```
Donorbox CSV/API            →  Give Prisma Model
─────────────────────────────────────────────────
amount                      →  Donation.amountCents (×100)
recurring                   →  (boolean — if true, check interval field for frequency)
interval                    →  Donation.frequency (map: "1 M"→MONTHLY, "3 M"→QUARTERLY,
                               "1 Y"→ANNUAL, "1 W"→ONE_TIME*)
status                      →  Donation.status (map: "paid"→SUCCEEDED, "migrated"→SUCCEEDED,
                               "refunded"→REFUNDED, "failed"/"fraud"/"blocked"→FAILED,
                               "charge_pending"/"paypal_pending"/"paypal_processing"/"pending"→PROCESSING)
processing_fee              →  Donation.processingFeeCents (×100)
currency                    →  Donation.currency
donation_date               →  Donation.createdAt
anonymous_donation          →  (per-donation anonymity — see schema gap note below*)
designation                 →  (future: fund allocation)
campaign.name               →  Campaign lookup → Donation.campaignId
stripe_charge_id            →  (external reference / reconciliation)
comment                     →  (future: Donation.comment)
```

*Note: Donorbox supports weekly recurring (`"1 W"`) which Give does not. Import as ONE_TIME with a note, or add WEEKLY to the DonationFrequency enum.

*Per-donation anonymity (`anonymous_donation`): Our Prisma schema only has `anonymous` on the `Donor` model, not on `Donation`. Setting Donor.anonymous=true would hide the donor across all gifts, which is wrong for a donor who gives anonymously on one gift only. This needs a schema addition: `anonymous Boolean @default(false)` on the `Donation` model.

**Recurring Plan mapping (Donorbox Plans CSV):**
```
Donorbox Plans CSV          →  Give Prisma Model
─────────────────────────────────────────────────
id                          →  (external reference)
status                      →  (active plans flag recurring donations for re-engagement)
amount                      →  (recurring gift amount for re-engagement emails)
frequency                   →  Donation.frequency (same interval mapping as above)
donor.email                 →  Donor lookup
campaign.name               →  Campaign lookup
started_at                  →  (plan start date — informational)
next_donation_date          →  (used to generate re-engagement timing)
payment_method              →  (Stripe vs PayPal — determines if Stripe migration is possible)
```

### 4.4 Give Lively → Give

**Donor mapping (deduplicate by email across all rows):**
```
Give Lively CSV             →  Give Prisma Model
─────────────────────────────────────────────────
Email                       →  Donor.email (dedup key — CRITICAL: one row per donation, not per donor)
First Name                  →  Donor.firstName
Last Name                   →  Donor.lastName
Donor Phone Number          →  Donor.phone
Anonymous to Public         →  Donor.anonymous
Donor Mailing Street/City/State/Zip/Country → (future: Donor.address fields)
```

**Donation mapping:**
```
Give Lively CSV             →  Give Prisma Model
─────────────────────────────────────────────────
Original Amount             →  Donation.amountCents (×100)
Gross Amount                →  Donation.totalChargedCents (×100)
Transaction Fee Amount      →  Donation.processingFeeCents (×100)
Platform Fee Amount         →  Donation.platformFeeCents (×100) (Give Lively = $0 currently)
Net Amount                  →  Donation.netAmountCents (×100)
Covered Transaction Fee Amt →  Donation.coverFees (> 0 = true)
Payment Status              →  Donation.status (map: "paid"→SUCCEEDED, "refunded"→REFUNDED,
                               "failed"→FAILED)
Payment Method              →  Donation.paymentMethod (map: "card"→CARD, "ach"→ACH,
                               "apple_pay"→APPLE_PAY, "google_pay"→GOOGLE_PAY)
Frequency                   →  Donation.frequency (map: "one-time"→ONE_TIME, "monthly"→MONTHLY)
Payment Platform Charge ID  →  (Stripe charge reference — external)
Payment Platform Sub ID     →  Donation.stripeSubscriptionId
Page Name                   →  Campaign lookup → Donation.campaignId
Page Type                   →  Campaign.type (map: "Campaign"→DONATION, "Event"→EVENT,
                               "Fundraiser"→PEER_TO_PEER, "Team"→PEER_TO_PEER,
                               "Nonprofit"→DONATION)
Dedication Type             →  Donation.dedicationType
Dedication Name             →  Donation.dedicationName
Order Date                  →  Donation.createdAt
```

> **Note on recurring:** Give Lively does not include subscription active/paused/cancelled status in the CSV export. Infer recurring donors by the presence of a `Payment Platform Subscription ID` (`sub_xxx`) — if populated, the donation is part of a recurring series. The most recent donation per subscription ID indicates the last charge date.

### 4.5 Classy (GoFundMe Pro) → Give

**Donor mapping:**
```
Classy CSV/API              →  Give Prisma Model
─────────────────────────────────────────────────
Email                       →  Donor.email (dedup key)
First Name                  →  Donor.firstName
Last Name                   →  Donor.lastName
Phone                       →  Donor.phone
Address 1/2/City/State/Zip  →  (future: Donor.address fields)
Supporter ID                →  (external reference)
```

**Donation mapping:**
```
Classy CSV/API              →  Give Prisma Model
─────────────────────────────────────────────────
Donation Gross Amount       →  Donation.amountCents (×100)
Donation Net Amount         →  Donation.netAmountCents (×100)
Fees Amount                 →  Donation.processingFeeCents (×100)
Classy Fees Amount          →  Donation.platformFeeCents (×100)
Is Donor Covered Fee        →  Donation.coverFees
Payment Method              →  Donation.paymentMethod
Transaction Status          →  Donation.status
Currency Code               →  Donation.currency
Transaction Frequency       →  Donation.frequency
Campaign Name               →  Campaign lookup → Donation.campaignId
Purchased Date              →  Donation.createdAt
Anonymous                   →  Donor.anonymous
Dedication Type/Name/Message→  Donation.dedicationType/Name/Message
Designation Name            →  (future: fund allocation)
Recurring Donation Plan ID  →  Donation.stripeSubscriptionId
Transaction ID              →  (external reference)
```

---

## 5. Edge Cases & Migration Challenges

### 5.1 Recurring Donation Migration

This is the single hardest problem. Options by scenario:

| Scenario | Approach | Complexity |
|----------|----------|-----------|
| **Org uses Stripe on both platforms** | Transfer PaymentMethods via Stripe. Clone subscriptions on our Connect platform. | Medium — requires Stripe coordination |
| **Org owns their Stripe account (Give Lively)** | Disconnect from old platform, connect to Give. Existing subscriptions continue. | Low — best-case scenario |
| **PayPal recurring** | Cannot migrate. Donors must cancel and re-subscribe. | N/A — provide email templates |
| **Classy Pro Services required** | PGP key exchange, SFTP transfer, ~1 month. 8-11% soft decline rate. | High — Classy controls the process |
| **No payment migration** | Import historical data only. Send re-engagement emails to recurring donors with pre-filled forms matching their amount/frequency. | Low — fallback for all platforms |

**Recommended approach for MVP import tool:**
1. Import all historical donation data (CSV) — mark imported donations with `source_platform` metadata
2. For Stripe-based recurring plans, provide a guided Stripe migration flow
3. For non-Stripe or complex cases, generate a "recurring donor re-engagement kit": email templates + pre-filled donation links per donor matching their previous amount/frequency

### 5.2 Historical Transaction Import

Imported transactions should:
- Use status `SUCCEEDED` (they already happened) unless the CSV says `refunded`/`failed`
- NOT trigger Stripe payment processing (these are records, not new charges)
- NOT send receipt emails (the original platform already sent them)
- **Update `Donor.totalGivenCents` and `Donor.donationCount`** — historical gifts should count toward lifetime giving totals
- **Not be linked to active campaigns' `raisedAmountCents`** by default — historical data imports into a separate "Imported History" context so they don't artificially inflate a currently running campaign's thermometer. Offer an opt-in: "Include historical donations in campaign totals?"
- Store `external_id` and `source_platform` for audit trail
- Store `stripe_charge_id` from original platform for reconciliation if provided
- Populate `Donor.firstDonationAt` / `lastDonationAt` from the imported date range

### 5.3 Donor Deduplication

**Strategy: email + orgId is the primary key.**

| Scenario | Resolution |
|----------|-----------|
| Same email, different names | Update to most recent name (or prompt user) |
| Same email across CSV rows (Give Lively) | Merge into single donor, aggregate totals |
| No email provided | Create donor with generated placeholder; flag for manual review |
| Same person, different emails | Cannot auto-detect. Provide post-import merge tool. |
| Donor exists in Give already | Match by email, update fields (don't create duplicate), append donations |

### 5.4 Campaign Matching

Imported donations reference campaigns by name. Resolution order:
1. Exact match on campaign `title` within the org → link donation
2. Fuzzy match (case-insensitive, trimmed) → suggest to user
3. No match → create new campaign with `status: ENDED` + type `DONATION` as a catch-all, or assign to a default "Imported Donations" campaign

### 5.5 Currency Handling

- All amounts in CSV are dollars/euros/etc. — convert to cents on import (×100)
- If `currency` column is missing, default to org's `defaultCurrency`
- Multi-currency orgs (rare at our target market): import preserves original currency per donation

### 5.6 Data We Can't Import (Schema Gaps)

Our current Prisma schema lacks fields for some commonly exported data. These should be considered for schema additions before building the import tool:

| Data | Source Platforms | Schema Addition Needed |
|------|-----------------|----------------------|
| **Mailing address** | All 5 | Add `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `country` to `Donor` |
| **Company/employer** | Givebutter, Zeffy, Donorbox, Classy | Add `company` to `Donor` |
| **Notes** | Givebutter, Zeffy | Add `notes` to `Donor` |
| **Designation/fund** | Givebutter, Donorbox, Classy | New `Designation` model or field on `Donation` |
| **UTM tracking** | Givebutter, Donorbox, Give Lively | Add `utmSource`, `utmMedium`, `utmCampaign` to `Donation` |
| **External reference IDs** | All 5 | Add `externalId`, `sourcePlatform` to `Donor` and `Donation` |
| **Donor comment** | Donorbox, Classy | Add `comment` to `Donation` |
| **Weekly recurring** | Donorbox | Add `WEEKLY` to `DonationFrequency` enum |
| **Per-donation anonymity** | Donorbox, Classy | Add `anonymous Boolean @default(false)` to `Donation` model. Current schema only has `anonymous` on `Donor`, which applies globally. Some donors give anonymously for only one gift. |

---

## 6. Import Tool UX Design (Recommended)

### 6.1 Flow

```
Step 1: Choose source
  → "Which platform are you migrating from?"
  → [Givebutter] [Zeffy] [Donorbox] [Give Lively] [Classy] [Other / CSV]

Step 2: Upload files
  → Platform-specific instructions ("In Givebutter, go to Contacts → Export → Download CSV")
  → Upload: Donors CSV, Donations CSV, Recurring Plans CSV (optional)
  → Or: use our universal template

Step 3: Auto-detect & map columns
  → System detects source format from column headers
  → Shows field mapping preview with our schema
  → User can adjust mappings manually

Step 4: Preview & validate
  → Show: "Found 2,341 donors, 8,492 donations, 156 recurring plans"
  → Flag issues: "23 rows missing email (will be skipped)", "5 duplicate emails (will be merged)"
  → Highlight: "Campaign 'Spring Gala 2024' doesn't exist — create it?"

Step 5: Import
  → Progress bar with real-time counts
  → "Importing donors... 2,341 / 2,341 ✓"
  → "Importing donations... 8,492 / 8,492 ✓"
  → "Skipped 23 rows (no email). Download skipped rows CSV."

Step 6: Recurring donor re-engagement (if applicable)
  → "We found 156 recurring donors. Their subscriptions can't auto-transfer."
  → "Generate personalized re-engagement emails?" → [Yes, generate kit]
  → Produces email template + CSV with donor name, email, previous amount, frequency, pre-filled form link
```

### 6.2 Auto-Detection Logic

Detect source platform by matching CSV column headers. Use a scoring approach — match 2 of 3 "fingerprint" columns to confirm the source (single-column matches are too fragile). Fall back to manual selection if no match.

| Fingerprint columns (match 2 of 3) | Source |
|-------------------------------------|--------|
| `Contact ID` + `Engage Email Subscribed` + `Household` | Givebutter (contacts) |
| `Reference #` + `Recurring Plan ID` + `Fee Covered` | Givebutter (transactions) |
| `Recurring Plan ID` + `Start_at` + `Last_transaction` | Givebutter (recurring plans) |
| `Region` + `Language` + `Company Name` | Zeffy (contacts) |
| `Rate title` + `Eligible amount` + `Scan date` | Zeffy (itemized payments) |
| `donations_count` + `last_donation_at` + `employer` | Donorbox (donors) |
| `stripe_charge_id` + `paypal_transaction_id` + `first_recurring_donation` | Donorbox (donations) |
| `plan_id` + `next_donation_date` + `started_at` | Donorbox (recurring plans) |
| `Line Item ID` + `Payment Platform Charge ID` + `Page Type` | Give Lively |
| `Classy Fees Amount` + `Fundraising Page ID` + `Designation ID` | Classy (transactions) |
| `Supporter ID` + `Member ID` + `Member Email` | Classy (supporters) |

### 6.3 Import Order

Files must be imported in this sequence to satisfy foreign key relationships:

1. **Campaigns CSV** (optional) — create campaign records first
2. **Donors CSV** — create donor records
3. **Donations CSV** — link donations to existing donors and campaigns

If a donation references a donor email that doesn't exist yet, either skip it (log as error) or auto-create a minimal donor record and flag for review. The UI should enforce this order and disable "Import Donations" until donors have been imported.

---

## 7. Implementation Priority

### Phase 1: CSV Import (Round 1 — ship with basic CRM)
- Universal CSV template (donors + donations + campaigns)
- Auto-detect Givebutter, Zeffy, Donorbox, Give Lively, Classy formats
- Field mapping UI with preview
- Donor deduplication by email
- Validation & error reporting
- Import progress tracking

### Phase 2: API-Based Migration (Round 1 fast-follow)
- Givebutter "connect and pull" (REST API)
- Classy "connect and pull" (OAuth + REST API)
- Donorbox API migration (for orgs with API add-on)

### Phase 3: Stripe Recurring Migration (Round 2)
- Guided Stripe PaymentMethod transfer flow
- Give Lively Stripe account re-connection
- Recurring donor re-engagement email kit (for non-Stripe cases)

### Phase 4: One-Click Migration (Round 2-3)
- Fully automated migration wizard per platform
- Real-time sync during transition period
- Migration status dashboard with per-record tracking

---

## Sources

### Givebutter
- [Contact export help](https://help.givebutter.com/en/articles/5497866)
- [Transaction export help](https://help.givebutter.com/en/articles/2219206)
- [Recurring plan export help](https://help.givebutter.com/en/articles/5497861)
- [Payout details export](https://help.givebutter.com/en/articles/5276580)
- [Webhook documentation](https://help.givebutter.com/en/articles/8828428)
- [API reference](https://docs.givebutter.com/reference/reference-getting-started)
- [Migration features](https://givebutter.com/features/importing-and-migration)

### Zeffy
- [Data export help](https://support.zeffy.com/how-do-i-export-my-data-for-accounting)
- [Payment export help](https://support.zeffy.com/how-do-i-export-my-donation/ticketing-data-how-do-i-export-data-from-my-donation-campaign/ticketing-event-can-i-export-donor-data)
- [API status (none)](https://support.zeffy.com/do-you-have-an-open-source-api)
- [Zapier integration](https://support.zeffy.com/integrating-zeffy-with-zapier)
- [Contact import template](https://support.zeffy.com/importing-contacts-into-zeffy)
- [Payments import template](https://support.zeffy.com/importing-payments)
- [Transaction statuses](https://support.zeffy.com/understanding-transaction-statuses)

### Donorbox
- [CSV export help](https://donorbox.zendesk.com/hc/en-us/articles/360020294192)
- [API documentation (GitHub)](https://github.com/donorbox/donorbox-api)
- [API endpoints wiki](https://github.com/donorbox/donorbox-api/wiki/Endpoints)
- [Webhook documentation](https://donorbox.zendesk.com/hc/en-us/articles/4733681068820)
- [Stripe recurring migration](https://donorbox.zendesk.com/hc/en-us/articles/360020294132)
- [Donor management features](https://donorbox.org/donor-management)

### Give Lively
- [Line Items (All) report](https://www.givelively.org/resources/learn-how-to-use-the-new-line-item-all-report)
- [Donor data download](https://www.givelively.org/resources/download-donor-data-from-nonprofit-admin-portal)
- [CSV column mapping](https://www.givelively.org/resources/map-downloadable-csv-donor-data-columns-to-line-items-all-report)
- [Stripe export supplemental](https://www.givelively.org/resources/export-donor-data-from-stripe)
- [Salesforce integration fields](https://www.givelively.org/resources/see-our-salesforce-integration-logic-and-fields-1-3)
- [Zapier integration](https://www.givelively.org/resources/review-the-zapier-integrations-zap-triggers-and-templates)

### Classy (GoFundMe Pro)
- [Export/share reports](https://prosupport.gofundme.com/hc/en-us/articles/37288784005403)
- [Transaction reports](https://prosupport.gofundme.com/hc/en-us/articles/37288784255771)
- [Supporter reports](https://prosupport.gofundme.com/hc/en-us/articles/37288801499419)
- [Fields and columns defined](https://prosupport.gofundme.com/hc/en-us/articles/37288767911835)
- [API documentation](https://developers.gofundme.com/pro/docs/)
- [classy-node SDK](https://github.com/classy-org/classy-node)
- [Salesforce integration objects](https://prosupport.gofundme.com/hc/en-us/articles/37288800815771)
- [Recurring donation migration](https://prosupport.gofundme.com/hc/en-us/articles/37288801758107)
