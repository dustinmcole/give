# Salesforce Integration Research — Give Platform

> **Research Date:** 2026-02-28
> **Purpose:** Technical patterns for syncing Give fundraising data into Salesforce NPSP and Nonprofit Cloud (NPC)
> **Author:** Dustin Cole / Datawake

---

## Table of Contents

1. [Salesforce REST API — Auth, Rate Limits, Upsert](#1-salesforce-rest-api)
2. [Change Data Capture (CDC)](#2-change-data-capture-cdc)
3. [Platform Events](#3-platform-events)
4. [Outbound Messages / Flow](#4-outbound-messages--flow)
5. [NPSP Key Objects for Donation Platforms](#5-npsp-key-objects)
6. [Salesforce Nonprofit Cloud (NPC) Objects](#6-salesforce-nonprofit-cloud-npc-objects)
7. [Deduplication Strategy](#7-deduplication-strategy)
8. [External IDs — Best Practices](#8-external-ids)
9. [Recommended Connector Architecture](#9-recommended-connector-architecture)
10. [Decision Summary](#10-decision-summary)

---

## 1. Salesforce REST API

### Overview

Salesforce exposes two primary sync-oriented APIs:
- **REST API** — synchronous, per-record or small batch operations (up to 200 records via sObject Collections)
- **Bulk API 2.0** — asynchronous, high-volume batch processing (tens of thousands of records)

For a fundraising platform connector processing individual donation events in near-real-time, **REST API + sObject Collections** is the right primary tool. Bulk API 2.0 is relevant for initial data imports or backfills.

---

### OAuth Flows for Server-to-Server Auth

Two viable flows for a server-to-server integration with no user interaction:

#### Option A: OAuth 2.0 JWT Bearer Flow (Recommended)

Best for: Maximum security, no stored secrets, certificate-based identity.

**How it works:**
1. Generate an RSA key pair. Upload the public cert (X.509) to the Salesforce Connected App.
2. Your server signs a JWT with the private key containing:
   - `iss` — Connected App client ID
   - `sub` — Salesforce username of the integration user
   - `aud` — `https://login.salesforce.com` (or `test.salesforce.com` for sandbox)
   - `exp` — expiration (max 3 minutes from now)
3. POST the signed JWT to `https://<mydomain>.my.salesforce.com/services/oauth2/token` with `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer`
4. Salesforce returns a bearer access token (no refresh token — just re-sign the JWT when it expires)

**Setup requirements:**
- Create a Connected App in Salesforce (Setup → App Manager)
- Enable "Use digital signatures" — upload public cert
- Pre-authorize the integration user via profile/permission set
- No user interaction ever required

#### Option B: OAuth 2.0 Client Credentials Flow

Best for: Simpler setup, no certificate management, adequate for lower-security contexts.

**How it works:**
1. Connected App issues a client ID + client secret
2. POST to token endpoint: `POST /services/oauth2/token` with `grant_type=client_credentials`, `client_id`, `client_secret`
3. Connected App must be configured with "Admin Pre-Approved" policy and a designated Run-As User
4. Returns bearer access token. No refresh token — re-request as needed (or on 401)

**Recommended retry pattern:** Attempt the call → if 401, re-request token → retry once.

---

### REST API — Key Endpoints

```
Base URL: https://<mydomain>.my.salesforce.com/services/data/vXX.0/

# Single record upsert by external ID
PATCH /sobjects/{ObjectType}/{ExternalIdField}/{ExternalIdValue}

# Batch upsert up to 200 records (mixed success allowed)
PATCH /composite/sobjects/{ObjectType}/{ExternalIdField}
Body: { "allOrNone": false, "records": [...] }

# Composite graph — chain dependent operations (e.g., create Contact → create Opportunity referencing new ContactId)
POST /composite/graph

# sObject Collections — up to 200 records per call, multiple object types
POST /composite/sobjects  (insert)
PATCH /composite/sobjects  (update)
```

**Composite Graph API** is particularly useful for creating a donor and their first donation atomically — it supports reference IDs so you can reference a newly-created Contact ID in the same request without a second round-trip.

---

### Rate Limits

| Edition | Daily REST API Calls (24h) | Notes |
|---------|---------------------------|-------|
| Enterprise (incl. Power of Us) | 100,000 base | Increases with additional licenses |
| Unlimited | 100,000 base | Same baseline, higher per-license add |
| Developer | 15,000 | Dev orgs only |

**Bulk API 2.0 limits:**
- 15,000 batch submissions per 24 hours (shared between Bulk API and Bulk API 2.0)
- Max 150 MB per job upload
- Best for operations with 2,000+ records; use REST sObject Collections for < 2,000

**Practical implication for Give:** At scale (say 10,000 donations/day), each donation requiring ~3 API calls (Contact upsert, Opportunity upsert, Payment upsert) = 30,000 calls/day. This is within the Enterprise limit but warrants monitoring. Use sObject Collections batching to reduce call count.

---

### Upsert Operations (External ID Concept)

External ID fields are custom fields marked as "External ID" and optionally "Unique" in Salesforce. They allow upsert-by-external-ID without needing to know the Salesforce record ID.

```
PATCH /services/data/v59.0/sobjects/Opportunity/Give_Donation_ID__c/don_abc123

Body:
{
  "Name": "John Smith Donation 2026-02-28",
  "Amount": 100.00,
  "CloseDate": "2026-02-28",
  "StageName": "Closed Won",
  "AccountId": "001xxxxxxxxxxxx"
}
```

If a record with `Give_Donation_ID__c = "don_abc123"` exists → update it. If not → create it.

This is **idempotent** — safe to replay on retry without creating duplicates.

---

## 2. Change Data Capture (CDC)

### What It Is

CDC is Salesforce's mechanism for broadcasting record changes (create, update, delete, undelete) as streaming events to external subscribers. An external system subscribes to a channel and receives a message whenever a Salesforce record changes.

**Direction:** Salesforce → External system (outbound from Salesforce)
**Use for Give:** Detecting when a nonprofit admin modifies a recurring donation in Salesforce (e.g., pauses it), so Give can act on that change.

### How It Works

1. In Salesforce Setup → Change Data Capture, select which objects to enable CDC on (e.g., `npe03__Recurring_Donation__c`, `Contact`, `Opportunity`)
2. External client subscribes to the Pub/Sub API (gRPC-based) on a channel like `/data/npe03__Recurring_DonationChangeEvent`
3. When a record changes, Salesforce publishes a change event with:
   - `ChangeType`: `CREATE`, `UPDATE`, `DELETE`, `UNDELETE`
   - `ChangedFields`: list of fields that changed (for UPDATE)
   - All current field values (or just changed fields, depending on config)
   - `RecordId`: Salesforce record ID

### Pub/Sub API (Modern Approach)

The old EMP Connector (CometD/Bayeux) has been superseded by the **Pub/Sub API**, a gRPC-based streaming API. This is the recommended approach.

```
Protocol: gRPC + Apache Avro (binary, efficient)
Languages: Node.js, Python, Java, Go, C++ (all via gRPC)

npm: salesforce-pubsub-api-client
PyPI: salesforce-pubsub-api-client (Python)
```

**Auth:** Same OAuth token from above — pass as gRPC metadata.

**Subscription channels:**
```
/data/ChangeEvents          — all objects
/data/ContactChangeEvent    — Contacts only
/data/OpportunityChangeEvent
/data/npe03__Recurring_DonationChangeEvent   — NPSP Recurring Donations
```

### CDC Availability on Nonprofit Editions

CDC requires **Enterprise Edition or higher**. Nonprofits receiving 10 donated licenses via the Power of Us program receive Enterprise Edition licenses — **CDC is available to them**.

There is an allocation limit on how many CDC events can be delivered per hour (varies by edition and add-ons). For Give's use case (monitoring Salesforce-side changes to push back to Give), the volume will be low enough not to hit allocations.

### Event Retention

CDC events are retained for **3 days** (72 hours). If your subscriber goes offline and reconnects within that window, it can replay missed events using a `replayId`.

---

## 3. Platform Events

### What They Are

Platform Events are custom, developer-defined Salesforce events. Unlike CDC (which is automatic), Platform Events require explicit publishing — via Apex code, Flow, or REST API call.

**Direction:** Bidirectional (Salesforce → external, or external → Salesforce)

### CDC vs Platform Events — Decision Matrix

| Criterion | Change Data Capture | Platform Events |
|-----------|--------------------|--------------------|
| Setup | No-code — enable objects in Setup | Requires custom event object + Apex/Flow trigger |
| Direction | Salesforce → external only | Both directions |
| Schema | Auto-generated from object fields | You define fields |
| Noise | Publishes ALL changes (even batch ETL jobs) | Only what you explicitly publish |
| Filtering | Filtered Streams (Winter '23+) can reduce delivery | Controlled at publish time |
| Inbound | Not supported | External can POST to `/services/data/vXX.0/sobjects/Give_Event__e` |
| Use case | Data replication, sync | Behavior-driven events, inbound triggers |

### Recommendation for Give

- **CDC** for outbound monitoring: detect when a nonprofit admin changes a recurring donation, closes an Opportunity, or updates a Contact in Salesforce — and reflect that back in Give.
- **Platform Events** (if building a managed package): publish a `GiveDonationReceived__e` event from inside Salesforce that other Flows/Apex in the org can subscribe to. Or use inbound Platform Events to trigger Salesforce automation when Give webhooks arrive.

For the initial API-based connector (no managed package), CDC alone is sufficient. Platform Events become relevant if building a managed package.

---

## 4. Outbound Messages / Flow

### Status (2024+)

**Workflow Rules** are deprecated — you cannot create new ones as of Winter '23. However, **Outbound Messages themselves are still fully supported** and can now be triggered via Flow Builder instead.

### What Outbound Messages Do

When triggered, Salesforce sends a SOAP XML message via HTTP POST to an external endpoint you specify. The message contains the record's field values at time of trigger.

**Direction:** Salesforce → external
**Protocol:** SOAP/XML (not JSON — this is a legacy mechanism)

### Current Relevance for Give

Low. Outbound Messages are:
- SOAP-based (not JSON), requiring XML parsing on the receiving end
- One-way with no easy retry visibility
- Superseded by CDC + Pub/Sub API for real-time outbound

**Verdict:** Skip Outbound Messages. Use CDC via Pub/Sub API for Salesforce → Give notifications. Reserve Flows for internal Salesforce automation (e.g., a Flow that creates a receipt Task when an Opportunity closes).

---

## 5. NPSP Key Objects

NPSP (Nonprofit Success Pack) is a managed package that adds nonprofit-specific objects and behavior on top of core Salesforce. Most nonprofits today still run NPSP. The key API prefixes are `npe01__`, `npe03__`, and `npsp__`.

### Contact → Donor

Standard Salesforce object. NPSP extends it with custom fields.

**Key fields for donor sync:**
```
FirstName
LastName
Email                          -- standard
npe01__HomeEmail__c            -- NPSP home email
npe01__WorkEmail__c
npe01__Preferred_Email__c      -- 'Personal', 'Work', 'Alternate'
npe01__PreferredPhone__c
Phone
MailingStreet
MailingCity
MailingState
MailingPostalCode
MailingCountry
AccountId                      -- links to Household Account
npsp__Do_Not_Contact__c        -- BOOLEAN
Give_Donor_ID__c               -- YOUR EXTERNAL ID FIELD (custom)
```

**Important:** In NPSP, Contacts are associated with a **Household Account** (not the organization). The Household Account is auto-created by NPSP when you insert a Contact with the Household account model enabled.

### Account → Household / Organization

NPSP uses two Account record types:
- **Household Account** (`HH_Account` record type): auto-created, named "{LastName} Household". One per household. Contacts within a household share this Account.
- **Organization Account**: for corporate/foundation donors. Contact is associated as an Affiliation.

**You almost never create Household Accounts directly.** NPSP creates and manages them. When you insert a Contact with no AccountId, NPSP's trigger creates the Household Account automatically.

For corporate donors: create a Contact, create an Organization Account, then create an `npe5__Affiliation__c` record linking the Contact to the Organization as their employer.

### Opportunity → Donation

The core donation record. This is a standard Salesforce object — NPSP adds behavior around it.

**Required fields:**
```
Name         -- string, e.g. "John Smith $100 Donation 2026-02-28"
Amount       -- decimal
CloseDate    -- date (use donation date, not processing date)
StageName    -- MUST be "Closed Won" for completed donations
AccountId    -- Household Account ID of the donor
```

**Recommended additional fields:**
```
ContactId (npsp__Primary_Contact__c)  -- NPSP's primary contact lookup
CampaignId                            -- links to Campaign
npe03__Recurring_Donation__c          -- links to parent recurring plan (if installment)
Type                                   -- 'Credit Card', 'ACH', etc. (picklist)
Description
Give_Donation_ID__c                   -- YOUR EXTERNAL ID (e.g., "don_abc123")
Give_Charge_ID__c                     -- Stripe charge ID for reconciliation
```

**StageName:** For NPSP, "Closed Won" triggers all the rollup logic (total giving, last gift date on Contact/Account). Do not use any other stage for completed donations. For pending/failed, use a stage like "Pledged" or create a custom stage.

**NPSP auto-creates a Payment record** (`npe01__OppPayment__c`) when an Opportunity is created. If you also want to write your own payment data, you can update the auto-created payment or set NPSP to not auto-create.

### Campaign → Fundraising Campaign

Standard Salesforce object. Use it to represent Give campaigns (peer-to-peer campaigns, donation forms, events).

```
Name
StartDate
EndDate
IsActive           -- boolean
ExpectedRevenue
ActualCost
Give_Campaign_ID__c   -- YOUR EXTERNAL ID
```

**CampaignMember** object links Contacts to Campaigns (opt-ins, etc.) — relevant for email marketing sync but not required for donation data.

### Recurring Donation — `npe03__Recurring_Donation__c`

NPSP's recurring donation object. When created, NPSP auto-generates a series of Opportunity installment records.

**Key fields:**
```
npe03__Contact__c                          -- donor Contact lookup
npe03__Organization__c                     -- org Account (if org donor)
npe03__Amount__c                           -- per-installment amount
npe03__Installment_Period__c               -- 'Monthly', 'Quarterly', 'Yearly', 'Weekly'
npe03__Recurring_Donation_Campaign__c      -- Campaign lookup
npe03__Next_Payment_Date__c               -- when next installment is expected
npsp__PaymentMethod__c                     -- 'Credit Card', 'ACH'
npsp__Status__c                            -- 'Active', 'Lapsed', 'Closed', 'Paused'
npsp__Day_of_Month__c                      -- day of month for monthly donations
Give_Recurring_Plan_ID__c                  -- YOUR EXTERNAL ID
```

**Note on Enhanced Recurring Donations (ERD):** NPSP added "Enhanced" recurring donations which added the `Paused` status, flexible installment scheduling, and a better data model. Orgs must opt into ERD. Your connector should check whether the target org has ERD enabled and handle both.

**NPSP auto-creates installment Opportunities** based on the recurring donation. Each installment Opportunity will have `npe03__Recurring_Donation__c` set to the parent recurring donation ID. When Give processes a payment for an installment, you should match it to the auto-generated installment Opportunity (match by amount + close date) and mark it "Closed Won" — or create a new Opportunity if no match.

### GAU Allocation — `npsp__Allocation__c` → Donation Designations

When a donor designates their gift to a specific fund (e.g., "Scholarship Fund" or "General Operations"), that split is stored as an Allocation record linking the Opportunity to a General Accounting Unit (GAU).

**npsp__General_Accounting_Unit__c (the fund itself):**
```
Name
npsp__Active__c    -- boolean
Give_Fund_ID__c    -- YOUR EXTERNAL ID
```

**npsp__Allocation__c (the allocation record):**
```
npsp__Opportunity__c                  -- parent Opportunity
npsp__General_Accounting_Unit__c      -- the fund
npsp__Amount__c                       -- dollar amount allocated
npsp__Percent__c                      -- percentage (use one or the other)
```

For a $100 donation split 60% to Fund A and 40% to Fund B, create:
- 1 Opportunity for $100
- 2 `npsp__Allocation__c` records: one $60 / Fund A, one $40 / Fund B

NPSP validates that allocations don't exceed the Opportunity Amount.

### Payment — `npe01__OppPayment__c`

NPSP auto-creates one payment record per Opportunity. You can update it or create additional payment records for partial payments.

**Key fields:**
```
npe01__Opportunity__c          -- parent Opportunity (lookup)
npe01__Payment_Amount__c       -- decimal
npe01__Payment_Date__c         -- date
npe01__Paid__c                 -- boolean (set true for completed)
npe01__Payment_Method__c       -- 'Credit Card', 'Check', 'ACH'
npsp__Gateway_Payment_ID__c    -- payment processor charge ID (Stripe charge ID)
npsp__Total_Transaction_Fees__c  -- processor fees
npsp__Batch_Number__c          -- payout/batch reference
Give_Payment_ID__c             -- YOUR EXTERNAL ID
```

---

## 6. Salesforce Nonprofit Cloud (NPC) Objects

NPC is Salesforce's next-generation nonprofit platform, rebuilt on core Salesforce (not a managed package). It launched fundraising features in Spring '24. It uses different object API names from NPSP.

### Key Architectural Difference: Person Accounts

NPSP uses **Contacts + Household Accounts** (Contact-centric). NPC defaults to **Person Accounts** (a Contact and Account rolled into one record). This is a fundamental data model difference.

In NPC, a donor is a Person Account with fields from both Contact and Account on a single record. This affects how you link donation records.

### NPC Fundraising Objects

| NPC Object | Equivalent NPSP Object | Description |
|-----------|------------------------|-------------|
| `GiftTransaction` | `Opportunity` + `npe01__OppPayment__c` | Completed donation transaction |
| `GiftEntry` | (no direct equiv.) | Gift before processing — audit trail |
| `GiftCommitment` | `npe03__Recurring_Donation__c` | Recurring donation plan |
| `GiftCommitmentSchedule` | (installment scheduling) | Frequency/schedule for commitment |
| `GiftDesignation` | `npsp__General_Accounting_Unit__c` | Fund (the designation target) |
| `GiftTransactionDesignation` | `npsp__Allocation__c` | Junction: transaction → designation |
| `GiftTribute` | (custom in NPSP) | In-honor-of / In-memory-of |
| `DonorGiftSummary` | (rollup fields on Contact) | Aggregated giving summary per donor |
| `GiftRefund` | (custom in NPSP) | Refund record |

**API version requirement:** NPC fundraising objects require API version 59.0+.

### NPC Business Process API (BPAPI)

NPC exposes high-level REST endpoints for third-party payment processors to create gifts — more abstracted than writing directly to objects:

```
POST /services/apexrest/npc/fundraising/v1/gifts
```

This API handles the business logic of creating GiftEntry → GiftTransaction → GiftCommitment records in the correct sequence, rather than requiring the external system to know the full object model.

**Recommendation:** Use BPAPI for NPC integrations rather than direct DML on NPC objects. It's more stable as NPC evolves.

### Compatibility Between NPSP and NPC

The two are **not compatible** — different object names, different data models (Contact+HH vs Person Account). A connector must support both separately. Based on market research:

- Majority of nonprofits today still run NPSP
- NPC adoption is growing but slowly — many ISVs haven't released NPC-compatible versions yet
- Salesforce has committed to keeping NPSP supported with no end-of-life date set
- **Build NPSP first.** Add NPC support once NPSP integration is solid. Abstract the connector layer so you can swap object mappings.

---

## 7. Deduplication Strategy

The hardest problem in any donor sync. Creating duplicate Contact records in Salesforce is easy and infuriating to clean up.

### Layer 1: External ID (Primary Defense)

Always write your platform's donor ID to a custom External ID field on Contact (`Give_Donor_ID__c`). Use `PATCH /sobjects/Contact/Give_Donor_ID__c/{give_id}` for all Contact upserts.

If the Contact was created by Give originally, the external ID will always match — zero duplicates.

The problem is the **first-time sync** for existing Salesforce contacts. This requires a match-then-link strategy.

### Layer 2: Email Matching (First-Time Sync)

Before creating a new Contact, query Salesforce for existing Contacts with matching email:

```
SELECT Id, FirstName, LastName, Email, Give_Donor_ID__c
FROM Contact
WHERE Email = 'donor@example.com'
   OR npe01__HomeEmail__c = 'donor@example.com'
   OR npe01__WorkEmail__c = 'donor@example.com'
LIMIT 5
```

If exactly 1 result → link by writing `Give_Donor_ID__c` to that Contact and update records.
If 0 results → create new Contact.
If 2+ results → flag for manual review (write to an error/review queue).

### Layer 3: Salesforce Native Duplicate Management

Salesforce has built-in **Matching Rules** and **Duplicate Rules** (Setup → Duplicate Management):

- **Matching Rules:** define what makes two records "the same" (exact email match, fuzzy name match, phone match)
- **Duplicate Rules:** define what to do when a match is found (block, warn, report)

When you call the REST API to insert a Contact, Salesforce can optionally run duplicate detection and return `duplicateResults` in the response. You can check this before committing.

However, relying on Salesforce's native duplicate detection via API is slow and may not match your exact logic. **Better approach:** do email lookup pre-insert in your own code, as described in Layer 2.

### Layer 4: Fuzzy Matching (Fallback)

For cases where a donor uses a different email address than what's in Salesforce:

Option A: Query by `FirstName + LastName + MailingPostalCode` combination — low false positive rate.
Option B: Use a third-party deduplication tool (Dedupe, RingLead, Insycle) — these are managed packages that run in the Salesforce org. An ISV building a connector cannot rely on these being installed.

**Recommendation for Give connector v1:**
- Layer 1 (external ID) + Layer 2 (email lookup) handles 95%+ of cases
- Flag unresolvable cases to a review queue — write them to a custom `GiveSyncError__c` object or log externally
- Do NOT attempt to create a Contact if the match is ambiguous — surface to the nonprofit admin

### Layer 5: NPSP's Built-in Deduplication

NPSP has its own duplicate detection on Contact creation (checks name + email). Configure it to "Report" rather than "Block" so your API calls don't get rejected, while still logging potential duplicates.

---

## 8. External IDs

### What They Are

A Custom Field in Salesforce marked as "External ID" (and ideally "Unique"). Enables:
1. `PATCH /sobjects/ObjectType/ExternalIdField/ExternalIdValue` — upsert by your ID
2. Cross-object reference by external ID in Composite API calls
3. Idempotent retries — safe to retry the same operation

### Required External ID Fields to Create in Nonprofit's Org

Give should create these via a managed package or setup guide:

| Salesforce Object | Field API Name | Field Label | Type |
|------------------|---------------|-------------|------|
| Contact | `Give_Donor_ID__c` | Give Donor ID | Text(255), ExternalID, Unique |
| Opportunity | `Give_Donation_ID__c` | Give Donation ID | Text(255), ExternalID, Unique |
| Opportunity | `Give_Charge_ID__c` | Give Charge ID | Text(255), ExternalID, Unique |
| npe03__Recurring_Donation__c | `Give_Plan_ID__c` | Give Plan ID | Text(255), ExternalID, Unique |
| npe01__OppPayment__c | `Give_Payment_ID__c` | Give Payment ID | Text(255), ExternalID |
| npsp__General_Accounting_Unit__c | `Give_Fund_ID__c` | Give Fund ID | Text(255), ExternalID, Unique |
| Campaign | `Give_Campaign_ID__c` | Give Campaign ID | Text(255), ExternalID, Unique |

### Best Practices

- **Always mark External ID fields as Unique** (Salesforce enforces database uniqueness — prevents accidental duplicates via concurrent writes)
- **One External ID per record** — if you store both `Give_Donation_ID` and `Stripe_Charge_ID`, only make one the External ID field (the one you use for upserts); the other can be a regular text field
- **Namespace if building a managed package:** `give__Give_Donation_ID__c` — avoids conflicts with other packages

### Composite API with External ID References

You can create dependent records in a single API call using reference IDs, avoiding multiple round-trips:

```json
POST /composite/graph
{
  "graphs": [{
    "graphId": "donation-sync",
    "compositeRequest": [
      {
        "referenceId": "newContact",
        "method": "PATCH",
        "url": "/services/data/v59.0/sobjects/Contact/Give_Donor_ID__c/don_abc123",
        "body": { "FirstName": "Jane", "LastName": "Smith", "Email": "jane@example.com" }
      },
      {
        "referenceId": "newOpportunity",
        "method": "PATCH",
        "url": "/services/data/v59.0/sobjects/Opportunity/Give_Donation_ID__c/txn_xyz789",
        "body": {
          "Name": "Jane Smith $100 Donation 2026-02-28",
          "Amount": 100.00,
          "CloseDate": "2026-02-28",
          "StageName": "Closed Won",
          "AccountId": "@{newContact.AccountId}",
          "npsp__Primary_Contact__c": "@{newContact.id}"
        }
      }
    ]
  }]
}
```

The `@{newContact.id}` syntax references the ID from the previous step in the same request.

---

## 9. Recommended Connector Architecture

### API-Based Connector vs Managed Package

| Approach | Pros | Cons |
|----------|------|------|
| **External API Connector** (code runs on Give's servers) | No Salesforce code required of customer; Give controls all logic; easier to update | Customer must OAuth-authorize Give; Give bears API rate limit responsibility; no visibility into customer's org changes |
| **Managed Package** (code runs inside Salesforce) | Closer integration; can use Apex triggers and Flows; no rate limit concerns (Apex doesn't count against API limits the same way) | Requires Salesforce package publishing/AppExchange review; customer installs package; harder to update; Apex skill required |

**Recommendation for Give v1:** External API Connector. Ship faster, maintain centrally, no AppExchange friction. A managed package can be added later to enable inbound sync (Salesforce → Give) via CDC.

---

### Sync Direction

**Give → Salesforce (Primary):** Every donation event in Give pushes to Salesforce.

**Salesforce → Give (Optional, v2):** Detect when a nonprofit admin updates a recurring donation in Salesforce (via CDC) and reflect that in Give. Challenging to build reliably — out of scope for v1.

---

### Event-Driven Architecture

Trigger sync from Give's existing webhook/event system:

```
Give Event (internal)
  → Webhook/Event Bus
    → Salesforce Sync Worker
      → Dedup check (email lookup)
      → Build Composite API request
      → POST to Salesforce
      → Handle response
        → Success: store SF record IDs in Give DB
        → Partial failure: retry failed records
        → Auth failure (401): refresh token, retry once
        → Rate limit (429): exponential backoff queue
```

### Queue Design

Use a persistent queue (Redis, BullMQ, or a simple Postgres job table) for all Salesforce API calls:

```
give_sf_sync_jobs table:
  id
  nonprofit_id
  give_record_type   -- 'donation', 'recurring_plan', 'donor', 'refund'
  give_record_id
  payload            -- JSON of what to sync
  status             -- 'pending', 'in_flight', 'done', 'error', 'dead_letter'
  attempt_count
  next_attempt_at
  sf_record_id       -- populated on success
  error_message
  created_at
  updated_at
```

**Retry policy:**
- Attempt 1: immediate
- Attempt 2: 30 seconds
- Attempt 3: 5 minutes
- Attempt 4: 30 minutes
- Attempt 5: 2 hours
- After 5 failures: dead letter — alert the nonprofit admin in Give dashboard

### Sync Sequence for a New One-Time Donation

```
1. GET/PATCH Contact by Give_Donor_ID__c
   → If not found by external ID, query by email
   → If still not found, INSERT Contact
   → Store Salesforce Contact ID + Account ID (Household Account auto-created)

2. PATCH Opportunity by Give_Donation_ID__c
   → Amount, CloseDate, StageName="Closed Won", AccountId, npsp__Primary_Contact__c

3. PATCH npe01__OppPayment__c by Give_Payment_ID__c
   → Link to Opportunity, set paid=true, store Stripe charge ID

4. If donation has fund designations:
   → PATCH/POST npsp__Allocation__c records for each fund split
```

Wrap steps 1-4 in a **Composite Graph request** where possible to reduce round-trips from 4 API calls to 1.

### Sync Sequence for a Recurring Donation Setup

```
1. Upsert Contact (same as above)
2. PATCH npe03__Recurring_Donation__c by Give_Plan_ID__c
   → npe03__Contact__c, npe03__Amount__c, npe03__Installment_Period__c, npsp__Status__c="Active"
   → NPSP auto-creates future installment Opportunities
3. When each installment payment succeeds in Give:
   → Find the auto-generated installment Opportunity by date + amount match
   → Update it to StageName="Closed Won"
   → Upsert the Payment record
```

### Sync Sequence for a Refund

```
1. Find the Opportunity by Give_Donation_ID__c
2. Update Amount to (original - refund amount), or:
   → If full refund: update StageName to "Refunded" (custom stage) or Amount to $0
3. Update Payment record: set npe01__Paid__c = false (if full refund)
```

### Token Management

Store one OAuth token per Nonprofit Salesforce org connection:

```
give_sf_connections table:
  id
  nonprofit_id
  instance_url        -- https://orgname.my.salesforce.com
  access_token        -- encrypted at rest
  token_type          -- 'jwt' or 'client_credentials'
  expires_at          -- for JWT: track exp; for client_creds: time of issue + 2 hours typical
  private_key_id      -- for JWT: reference to key vault entry
  client_id
  client_secret       -- encrypted, only for client_creds flow
  created_at
  updated_at
```

**Never store unencrypted tokens.** Use envelope encryption (AWS KMS, Vault, etc.).

---

## 10. Decision Summary

| Question | Decision | Rationale |
|----------|----------|-----------|
| Auth flow | **JWT Bearer** preferred; Client Credentials as fallback | JWT has no stored secret — higher security for customer orgs |
| REST vs Bulk API | **REST + sObject Collections** (batch 200) for realtime; Bulk API 2.0 for initial imports | Realtime donations are small volume; Bulk API is async and has latency |
| CDC vs Platform Events | **CDC** for Salesforce→Give (future v2); not needed for v1 | In v1 sync is only Give→Salesforce |
| Outbound Messages | **Skip** | SOAP-based, superseded by CDC |
| NPSP vs NPC | **Build NPSP first**; abstract layer for NPC later | NPSP is still majority market share |
| Dedup strategy | **External ID primary; email lookup fallback** | 95%+ coverage; flag ambiguous for manual review |
| Connector type | **External API connector** (code on Give's servers) | Faster to ship; no AppExchange required |
| Queue/retry | **Persistent job queue** with exponential backoff | API calls must not be fire-and-forget |
| External IDs to create | 7 custom fields (see Section 8 table) | Required in customer org; document in setup guide |

---

## Sources

- [OAuth 2.0 JWT Bearer Flow for Server-to-Server Integration — Salesforce Help](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_jwt_flow.htm&language=en_US&type=5)
- [Invoke REST APIs with the Salesforce Integration User and OAuth Client Credentials — Salesforce Developers Blog](https://developer.salesforce.com/blogs/2024/02/invoke-rest-apis-with-the-salesforce-integration-user-and-oauth-client-credentials)
- [Subscribe with Pub/Sub API — Change Data Capture Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/cdc_subscribe_pubsub_api.htm)
- [Integration Using Change Data Capture and Platform Events — Salesforce Ben](https://www.salesforceben.com/integration-using-change-data-capture-and-platform-events/)
- [Design Considerations for Change Data Capture and Platform Events — Salesforce Developers Blog](https://developer.salesforce.com/blogs/2022/10/design-considerations-for-change-data-capture-and-platform-events)
- [Change Data Capture versus Platform Events — SFDCWallah](https://sfdcwallah.com/2023/07/04/change-data-capture-versus-platform-events-in-salesforce-a-comparison/)
- [GiftTransaction — Nonprofit Cloud Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.nonprofit_cloud.meta/nonprofit_cloud/npc_fundraising_api_objects_gifttransaction.htm)
- [Fundraising Standard Objects — Nonprofit Cloud Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.nonprofit_cloud.meta/nonprofit_cloud/npc_fundraising_standard_objects.htm)
- [Fundraising Business APIs — Nonprofit Cloud Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.nonprofit_cloud.meta/nonprofit_cloud/npc_fundraising_business_api_rest_reference.htm)
- [Salesforce Nonprofit Cloud vs. NPSP — Salesforce Ben](https://www.salesforceben.com/salesforce-nonprofit-cloud-vs-npsp-what-you-need-to-know/)
- [NPC vs NPSP: The Choice is Yours — Arkus Inc](https://www.arkusinc.com/archive/2024/npc-vs-npsp-the-choice-is-yours)
- [Upsert Records Using sObject Collections — REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_composite_sobjects_collections_upsert.htm)
- [Bulk API 2.0 Limits — Salesforce Developers](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/bulk_common_limits.htm)
- [Salesforce API Rate Limits — Coefficient](https://coefficient.io/salesforce-api/salesforce-api-rate-limits)
- [WeGive NPSP Technical Documentation (field mappings reference)](https://help.wegive.com/salesforce-npsp-technical-documentation)
- [Fundraise Up Salesforce NPSP Objects](https://fundraiseup.com/docs/salesforce-npsp-objects/)
- [Fundraise Up Salesforce NPC Objects](https://fundraiseup.com/docs/salesforce-npc-objects/)
- [Manage Recurring Donations — Salesforce Trailhead](https://trailhead.salesforce.com/content/learn/modules/opportunity-settings-in-nonprofit-success-pack/manage-recurring-donations-npsp)
- [Enhanced Recurring Donations in NPSP — Salesforce Ben](https://www.salesforceben.com/enhanced-recurring-donations-in-salesforce-npsp/)
- [Outbound Messages — Salesforce Developers](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_om_outboundmessaging.htm)
- [Salesforce to Retire Workflow Rules and Process Builder — Salesforce Ben](https://www.salesforceben.com/salesforce-to-retire-workflow-rules-and-process-builder/)
- [Pub/Sub API — Salesforce Developers](https://developer.salesforce.com/docs/platform/pub-sub-api/guide/intro.html)
- [salesforce-pubsub-api-client — npm](https://www.npmjs.com/package/salesforce-pubsub-api-client)
- [Stripe Subscriptions & Payments → Salesforce NPSP n8n Workflow — WildAmer](https://wildamer.com/project/n8n-stripe-subscription-payments-salesforce-npsp-integration)
