# Salesforce Integration — Research & Design

> **Status:** Research complete. Architecture designed. Priority: P1 fast-follow (ship within 3 months of launch). NPSP + NPC both in v1.
> **Last updated:** 2026-02-28
> **Research sessions:** 4 parallel agents — nonprofit landscape, competitor analysis, AppExchange requirements, technical architecture

---

## 1. Nonprofit Salesforce Landscape

### Market Penetration

Salesforce reports approximately **40,000–55,000 nonprofits and education organizations** globally (bundled together in their reporting). Against ~1.8 million US 501(c)(3)s, that's roughly **3–4% overall market penetration** — but the real figure among tech-enabled nonprofits who use any CRM is meaningfully higher.

The critical nuance for Give's target market: **Salesforce skews heavily toward mid-to-large nonprofits.** The practitioner consensus is clear:

- Minimum practical org size **without in-house Salesforce expertise**: $1M–2M+ revenue, 10+ staff
- Minimum practical org size **with an in-house admin or developer**: ~$500K revenue, 5+ staff
- Implementation costs alone ($7,000–$30,000 minimum, $100,000+ for complex orgs) price out most sub-$1M nonprofits
- The free Power of Us licenses (10 free Enterprise Edition licenses for eligible nonprofits) draw in small orgs who then find implementation insurmountable without a paid consultant

**Bottom line:** Our primary target (small nonprofits <$5M revenue, <50 employees) is mostly NOT on Salesforce. They use Bloomerang, DonorPerfect, or spreadsheets. Salesforce integration is a mid-market unlock — meaningful for orgs in the $1M–$10M range with dedicated Salesforce infrastructure.

### NPSP vs. Nonprofit Cloud — Which Matters More

This distinction is critical for building the right integration.

**NPSP (Nonprofit Success Pack)** — the incumbent:
- A free managed package (technically 6 packages) installed on top of Salesforce Sales Cloud
- Has existed since ~2012; the dominant Salesforce nonprofit product for over a decade
- API namespace prefixes: `npe01__`, `npe03__`, `npe4__`, `npe5__`, `npsp__`
- **Feature development officially ended March 2023** when Nonprofit Cloud launched
- Still fully supported — no announced EOL — but will receive no new features
- Estimated installed base: **35,000+ fundraising organizations**
- Uses **Household Accounts**: one Account record represents a family/household, multiple Contacts share it
- Data model: Contact → AccountId (Household Account) → Opportunity (Donation)

**Nonprofit Cloud / Agentforce Nonprofit (NPC)** — the future:
- Launched March 2023 (Program Management); **Fundraising module launched October 2023**
- A ground-up rebuild — native industry cloud, not a managed package add-on
- **Rebranded to "Agentforce Nonprofit"** in late 2025 (branding only)
- Uses **Person Accounts** instead of Household Accounts — a fundamental data model change
- More powerful but significantly more complex and expensive ($60–$100/user/month vs. free NPSP)
- A 2025 survey of 75 nonprofit Salesforce consulting firms found: only **25% have completed any NPC implementation**, 60% believe NPC is more complex than NPSP

**Migration reality:** Very few existing NPSP orgs are actively migrating to NPC. The Household → Person Account transformation is painful, expensive, and disruptive. NPC is gaining traction among **new** Salesforce customers, not via migration from NPSP.

**Build decision: Support both NPSP and NPC in v1.** The connector detects which platform flavor the org is running during OAuth setup (by checking for NPSP namespace packages vs. NPC object availability), then routes to the appropriate sync path. The object-mapping layer is abstracted so both paths share the same queue, auth, and dedup logic. NPC in v1 — alongside NPSP — is a genuine differentiator: Give Lively doesn't support NPC, Donorbox and Givebutter don't either. Only Classy and Funraise do, and Classy charges $250/month.

### Power of Us Program (Nonprofit Pricing)

Any qualifying 501(c)(3) can apply at salesforce.com/company/power-of-us and receive:
- **10 free Agentforce Nonprofit Enterprise Edition licenses** (as of December 2025, replacing the former NPSP-based free licenses)
- **80% discount** on additional licenses (~$12/user/month for Enterprise, ~$20/user/month for Unlimited, vs. $60/$100 list price)

True cost of ownership for a nonprofit Salesforce implementation: $15,000–$150,000+ when you account for consulting, data migration, third-party add-ons (email, wealth screening, event management), and ongoing admin.

---

## 2. Competitor Analysis

### Comparison Table

| Platform | AppExchange | Package | Direction | Frequency | NPSP | NPC | Price | Stars |
|----------|------------|---------|-----------|-----------|------|-----|-------|-------|
| **Give Lively** | Yes | Managed | One-way | Hourly batch | Yes | No | Free | 5.0/5 (7 reviews) |
| **Givebutter** | No | None | Zapier only | Near real-time (Zapier) | N/A | N/A | Zapier fee | — |
| **GoFundMe Pro (Classy)** | Yes (2 listings) | Managed | Bidirectional* | Near real-time | Yes | Yes | $250/mo | 4.58/5 (12 reviews) |
| **Donorbox** | No | None | One-way | Near real-time | Yes | Yes | $50/mo | — |
| **Funraise** | Yes | Managed (OSS) | One-way | Real-time | Yes | Yes | Free | No reviews yet |

### Give Lively — The Benchmark to Beat

Give Lively's Salesforce integration is their #1 selling point. Understanding its strengths and weaknesses is essential.

**What it does:**
- One-way sync: Give Lively → Salesforce only
- Objects synced: Contact, Opportunity, Campaign, NPSP Recurring Donations (if enabled), Ticket Tiers, Ticket Purchases, GAU Allocations, OpportunityContactRoles
- NPSP-specific field mapping: npsp email fields (Personal/Work/Alternate), Honoree Contact
- Syncs hourly — records pushed at the half-hour mark every hour (1:30, 2:30, etc.)
- Manual sync trigger available from the "Salesforce Home" tab

**Weaknesses (where Give can beat them):**
- **Hourly batch sync** is a real architectural limitation. Salesforce admins running reconciliations mid-day or monitoring Giving Tuesday in real-time see data that's up to 59 minutes stale.
- **One-way only** — no bidirectional sync. Can't push Salesforce contact updates back to Give Lively.
- **No NPC support** as of early 2026. As Salesforce pushes nonprofits toward Agentforce Nonprofit, Give Lively's integration will age out.
- State and Country Picklist feature must be disabled before setup — a configuration friction point for orgs using that feature.
- NPSP Recurring Donations require manual enablement by Give Lively support — not on by default.

**AppExchange listing:** [Give Lively for Salesforce](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000FABSeUAP) — 5.0★ (7 reviews). Low review count but perfect score. 1,000+ nonprofits using it per their marketing.

### Givebutter — Zapier Only (Their #1 Weakness)

Givebutter has no native Salesforce integration and no AppExchange listing. Their integration page advertises "Salesforce" but clicking through lands on a Zapier setup guide. Salesforce is a Premium app on Zapier, requiring a paid Zapier plan.

An independent 8-platform fundraising review (118group.com) scored Givebutter 11/18 on integrations with this explicit note: *"Our only complaint about GiveButter is its lack of native integrations. It seemingly relies on Zapier to do much of the work in this area."*

Community posts in the Salesforce Trailblazer Community asking specifically about Givebutter + Salesforce confirm this is an active pain point for nonprofits evaluating the platform. For any nonprofit already running Salesforce, Zapier-based integrations are second-class citizens — more fragile, more expensive, more configuration burden, and harder for Salesforce admins to troubleshoot.

### GoFundMe Pro (Classy) — Premium, Bidirectional, Expensive

The most enterprise-grade integration of the group. Two separate managed packages on AppExchange — one for NPSP, one for NPC.

**NPSP package objects:** Contact (Supporter), Opportunity (Donation — with "Donation" record type), Campaign (with Campaign Hierarchy for P2P/team fundraising), npe03__Recurring_Donation__c (custom Classy Recurring Donors object), custom objects for Questions/Answers, Related Entities (event attendees).

**Bidirectional capability:** Classy → Salesforce for all donation/supporter data; Salesforce → Classy for offline Opportunities and Contact field updates via "Bidirectional Supporter Sync."

**Weaknesses:**
- $250/month company-wide — a non-trivial add-on for small/mid nonprofits
- One Capterra reviewer: *"The Salesforce integration is incredibly wonky. Not using best practices there."*
- Since GoFundMe acquisition (Classy became GoFundMe Pro May 6, 2025), product velocity has reportedly slowed
- Sync slows on high-volume days (Giving Tuesday)
- NPC version not yet at full NPSP feature parity

### Donorbox — Solid but Invisible

No AppExchange listing, so not discoverable through the Salesforce admin channel. $50/month add-on. Supports both NPSP and NPC. Near-real-time (event-triggered, not batch). One-way only.

Technically sound but positioned as a paid add-on without the trust signal of an AppExchange listing.

### Funraise — Most Technically Modern

AppExchange listing, open-source managed package (GitHub repo), real-time sync, NPSP + NPC support. Free to install. The open-source approach is a trust signal for Salesforce consultants who want to audit what's being installed in their client's org.

No AppExchange reviews yet, limiting social proof. But architecturally, this is the closest to what Give should build.

### Strategic Gap

No fundraising platform offers:
- Free Salesforce integration (Give Lively is free, but...)
- Real-time sync (not hourly batch)
- Bidirectional sync
- NPSP + NPC support
- AppExchange listing for discoverability

Give can own all five. Give Lively gets two. Classy gets four but costs $250/month. Funraise gets four but has zero social proof yet.

---

## 3. Integration Architecture

### Object Mapping

#### NPSP Object Map

| Give Object | Salesforce Object | API Name | Notes |
|-------------|------------------|----------|-------|
| Donor | Contact | `Contact` | Never create without AccountId — NPSP auto-creates Household Account |
| Household | Account (Household) | `Account` | Auto-created by NPSP; DO NOT create directly |
| Organization donor | Account (Organization) + Affiliation | `npe5__Affiliation__c` | For corporate donors |
| Donation | Opportunity | `Opportunity` | StageName MUST be "Closed Won" for NPSP rollups |
| Donation (payment) | Payment | `npe01__OppPayment__c` | NPSP auto-creates; we update with Stripe charge ID |
| Recurring plan | Recurring Donation | `npe03__Recurring_Donation__c` | NPSP auto-generates installment Opps |
| Fund/designation | General Accounting Unit | `npsp__General_Accounting_Unit__c` | Fund target (Annual Fund, Capital Campaign, etc.) |
| Split gift | GAU Allocation | `npsp__Allocation__c` | Junction: Opportunity → GAU. One per fund in the split. |
| Campaign | Campaign | `Campaign` | Standard object |

#### NPC Object Map (v1)

| Give Object | NPC Object | API Name |
|-------------|-----------|----------|
| Donor | Person Account | `Account` (PersonAccount RecordType) |
| Donation | Gift Transaction | `GiftTransaction` |
| Recurring plan | Gift Commitment + Gift Commitment Schedule | `GiftCommitment`, `GiftCommitmentSchedule` |
| Fund/designation | Gift Designation | `GiftDesignation` |
| Split gift | Gift Transaction Designation | `GiftTransactionDesignation` |
| Campaign | Outreach Source Code | `OutreachSourceCode` |

**NPC note:** Use the NPC Business Process API (`POST /services/apexrest/npc/fundraising/v1/gifts`) rather than writing directly to NPC objects. More stable as NPC evolves.

**Flavor detection at setup:** After OAuth, query `GET /services/data/v59.0/query?q=SELECT+Id+FROM+ApexClass+WHERE+NamespacePrefix='npsp'+LIMIT+1` — if results exist, org is on NPSP. If zero results, check for GiftTransaction object availability to confirm NPC. Store the detected flavor in `give_sf_connections.sf_flavor` (`npsp` | `npc`) and route all subsequent syncs accordingly.

### Sync Direction: One-Way v1, Bidirectional v2

**v1 (launch):** Give → Salesforce only.
- All donation events push to Salesforce immediately
- Contact creates/updates flow from Give into Salesforce
- No inbound: Salesforce changes don't flow back to Give

**v2 (post-launch):** Bidirectional.
- Subscribe to Salesforce Change Data Capture (CDC) via Pub/Sub API (gRPC)
- Monitor: `npe03__Recurring_Donation__c` for pauses/cancellations made by Salesforce admins
- Monitor: `Contact` for email/address updates made in Salesforce
- Reflect back in Give's donor records

**CDC implementation:** Subscribe to channels like `/data/npe03__Recurring_DonationChangeEvent`. 72-hour event retention with replayId for reconnect recovery. Requires Enterprise Edition (available to Power of Us nonprofits).

### Sync Frequency: Real-Time (Event-Triggered)

Give Lively's hourly batch is a known pain point. We sync immediately on each donation event. A queue handles retries.

### OAuth & Authentication

**Primary: JWT Bearer Flow (recommended)**
- Give holds an RSA private key; nonprofit uploads our public X.509 certificate to their Salesforce Connected App
- No stored secrets; the certificate is the credential
- Sign a short-lived JWT (3-minute expiry) on each auth cycle
- No user interaction required after initial setup

**Fallback: Client Credentials Flow**
- POST client_id + client_secret to Salesforce token endpoint
- Connected App must have a designated Run-As Integration User
- Simpler to set up; slightly less secure (secret must be stored)

### Sync Sequence: One-Time Donation

```
1. PATCH Contact by Give_Donor_ID__c (External ID upsert)
   → Not found → email lookup (Home + Work + Alternate email fields)
   → 0 matches → create new Contact (NPSP auto-creates Household Account)
   → 1 match → link Give_Donor_ID__c to existing Contact
   → 2+ matches → write to error queue, surface in Give dashboard for admin resolution
   → Store SF Contact ID + auto-created Household Account ID

2. PATCH Opportunity by Give_Donation_ID__c
   → Amount, CloseDate = donation date, StageName = "Closed Won"
   → AccountId = Household Account ID from step 1
   → npsp__Primary_Contact__c = Contact ID from step 1
   → CampaignId (if donation is campaign-linked)
   → Give_Charge_ID__c = Stripe charge ID

3. UPDATE npe01__OppPayment__c (NPSP auto-created with each Opp)
   → npe01__Paid__c = true
   → npsp__Gateway_Payment_ID__c = stripe_ch_xxx
   → npsp__Total_Transaction_Fees__c = processing fee amount
   → Give_Payment_ID__c = internal payment ID

4. If fund-designated:
   → UPSERT npsp__Allocation__c for each fund split
   → npsp__Opportunity__c, npsp__General_Accounting_Unit__c, npsp__Amount__c

Use Composite Graph API to chain steps 1-2 in a single HTTP call.
Use @{newContact.AccountId} reference to get the NPSP-created Household Account ID
without a second round-trip.
```

### Sync Sequence: Recurring Donation Plan

```
1. Upsert Contact (same as above)
2. PATCH npe03__Recurring_Donation__c by Give_Plan_ID__c
   → npe03__Amount__c, npe03__Installment_Period__c, npe03__Contact__c
   → npsp__Status__c = "Active"
   → NPSP auto-generates future installment Opportunities

Per installment payment:
3. Find NPSP-generated installment Opp (query by amount + close date proximity)
4. Update StageName = "Closed Won" on installment Opp
5. Update auto-created npe01__OppPayment__c with Stripe charge ID
```

### Deduplication Strategy (Layered)

The hardest problem in donor sync — must not create duplicate Contacts in the nonprofit's Salesforce org.

| Layer | Method | Coverage |
|-------|--------|----------|
| External ID | Upsert by `Give_Donor_ID__c` — idempotent | All Give-sourced donors (100% of future) |
| Email lookup | Query Contact WHERE Email OR HomeEmail OR WorkEmail = donor email | First-time sync of existing donors |
| Ambiguous match | 2+ email matches → error queue → admin resolves in Give dashboard | Edge cases (duplicate Contacts in SF) |
| Fuzzy fallback | Query FirstName + LastName + MailingPostalCode | Donors who used different emails |

**Rule:** Never create a Contact if the match is ambiguous. Write to review queue, surface in Give dashboard. Giving admins agency to resolve is better than silently creating duplicates.

### External ID Fields (Required in Customer's Salesforce Org)

These 7 custom fields must exist in the nonprofit's org. Created during the Give Salesforce setup process (either via managed package or a documented setup script).

| Object | Field API Name | Label | Type |
|--------|---------------|-------|------|
| Contact | `Give_Donor_ID__c` | Give Donor ID | Text(255), External ID, Unique |
| Opportunity | `Give_Donation_ID__c` | Give Donation ID | Text(255), External ID, Unique |
| Opportunity | `Give_Charge_ID__c` | Give Charge ID | Text(255) |
| npe03__Recurring_Donation__c | `Give_Plan_ID__c` | Give Plan ID | Text(255), External ID, Unique |
| npe01__OppPayment__c | `Give_Payment_ID__c` | Give Payment ID | Text(255), External ID |
| npsp__General_Accounting_Unit__c | `Give_Fund_ID__c` | Give Fund ID | Text(255), External ID, Unique |
| Campaign | `Give_Campaign_ID__c` | Give Campaign ID | Text(255), External ID, Unique |

If/when we build a managed package: namespace as `give__Give_Donation_ID__c` etc.

### Connector Architecture: External API (Not Managed Package)

**v1 decision: External API connector** (Give's servers call Salesforce REST API).

Rationale:
- Give controls all logic; updates and bug fixes deploy instantly without nonprofit touching anything
- No AppExchange security review required to ship v1
- Simpler for early adopters to set up (OAuth handshake + Connected App, no package install)
- Tradeoff: Give's servers bear API rate limits (100,000 calls/24h on Enterprise; at ~3 calls/donation, supports ~33,000 donations/day before batching needed)

**v2 consideration: Thin managed package** for AppExchange listing.
- Connected App definition + Named Credentials + configuration UI components
- Actual sync logic stays on Give's servers
- Package is primarily plumbing — enables AppExchange listing and discoverability

### Queue Architecture (Non-Negotiable)

All Salesforce sync jobs must go through a persistent queue. Never fire-and-forget.

```
give_sf_sync_jobs:
  id, nonprofit_id, give_record_type (donation|donor|campaign|plan),
  give_record_id, payload (JSON), status, attempt_count,
  next_attempt_at, sf_record_id, error_message, created_at, updated_at

statuses: pending → in_flight → done | error → dead_letter
```

**Retry schedule:** immediate → 30s → 5min → 30min → 2h → dead letter at attempt 5

Dead-letter jobs surface as alerts in the Give dashboard ("X donations failed to sync — review required").

### API Approach by Volume

| Volume | API | Notes |
|--------|-----|-------|
| Real-time donations | REST + sObject Collections (batch up to 200) | Primary path |
| Initial historical import | Bulk API 2.0 | 15,000 batch submissions/24h |
| Inbound SF changes (v2) | Pub/Sub API (gRPC + CDC) | Bidirectional only |

---

## 4. AppExchange Strategy

### Is AppExchange Required?

No — but it's a significant trust and discoverability advantage for the Salesforce segment.

AppExchange is the **primary software discovery channel for Salesforce nonprofit admins**. When a Salesforce-running nonprofit searches for a fundraising integration, they go to AppExchange first, not Google. Competitors listed there (Give Lively, Funraise, Classy) have a discovery advantage over non-listed tools (Givebutter, Donorbox).

An AppExchange listing signals:
- Salesforce has reviewed and approved the integration
- The security review badge ("Security Reviewed") is a visible trust signal
- Access to the nonprofit-specific [AppExchange collection](https://appexchange.salesforce.com/mktcollections/industry-collections/nonprofits/) that nonprofit Salesforce admins browse

However: An AppExchange listing requires a managed package, not just an API-based connector. We can ship the connector without AppExchange listing, then pursue the listing afterward.

### What a Listing Requires

1. **Salesforce ISV Partner registration** — Free. Sign up at partners.salesforce.com, agree to SPPA + PADA agreements, receive a Partner Business Org.

2. **2nd Generation Managed Package (2GP)** — Minimum viable package: Connected App definition, Named Credentials, LWC configuration components. All actual sync logic can run on Give's servers. No requirement to run Apex inside Salesforce.

3. **Security Review** — The most rigorous step. Salesforce's product security team does automated scanning + manual penetration testing. Common failure reasons:
   - CRUD/FLS enforcement (most common by far — Apex code accessing records without checking user permissions)
   - Outdated JavaScript libraries (RetireJS scan)
   - Hardcoded credentials or secrets in code
   - TLS configuration issues (must score A on Qualys SSL Scanner)
   - SOQL injection vulnerabilities

   First submission pass rate is under 50%. Plan for one resubmission cycle.

4. **Listing creation** — Days once approved. Goes live ~30 minutes after clicking Publish.

### Timeline

| Phase | Duration |
|-------|----------|
| ISV Partner registration | Few days – several weeks |
| Package development + security prep | 4–8 weeks (given that sync logic is already built) |
| Pre-queue checks + security review queue | 5–6 weeks |
| First submission review | Likely fails — 2–4 weeks remediation |
| Resubmission + approval | 3–5 weeks |
| Listing live | Days |
| **Total** | **4–6 months from start** |

**Start AppExchange process immediately after shipping the API connector.** Given the 4–6 month timeline, beginning at month 2 means AppExchange listing arrives around month 6–8.

### Cost

| Item | Amount |
|------|--------|
| Security Review (paid app, first submission) | $999 |
| Security Review (resubmission, code changes required) | $999 |
| Budgeted total (two attempts) | ~$2,000 |
| Revenue share (on AppExchange Checkout transactions) | 15% |

The 15% revenue share only applies to transactions processed *through AppExchange Checkout*. Give's 1%/2% platform fee is charged directly to nonprofits, outside of AppExchange Checkout — this revenue share likely doesn't apply to Give's fee model. Confirm with Salesforce legal during partner registration.

---

## 5. MVP vs. Full Integration

### MVP (v1) — What to Build First

Ship this within 3 months of launch:

| Feature | Implementation |
|---------|---------------|
| One-way sync: Give → Salesforce | External API connector |
| Org flavor detection | Query at setup: NPSP namespace check → NPC object check → store `sf_flavor` |
| NPSP: Contact sync (donor create/update) | PATCH Contact by `Give_Donor_ID__c`; email dedup fallback; let NPSP auto-create Household Account |
| NPSP: Opportunity sync (donation) | PATCH Opportunity by `Give_Donation_ID__c`; StageName = "Closed Won" |
| NPSP: Payment record sync | Update auto-created `npe01__OppPayment__c` with Stripe charge ID |
| NPSP: Recurring donation sync | PATCH `npe03__Recurring_Donation__c`; match installment Opportunities |
| NPSP: Campaign sync | PATCH Campaign by `Give_Campaign_ID__c` |
| NPC: Donor sync | Upsert Person Account by `Give_Donor_ID__c` |
| NPC: Donation sync | POST to NPC Business Process API (`/npc/fundraising/v1/gifts`); maps to GiftTransaction |
| NPC: Recurring plan sync | Create GiftCommitment + GiftCommitmentSchedule |
| NPC: Campaign sync | Upsert OutreachSourceCode by `Give_Campaign_ID__c` |
| Real-time trigger | Queue job on each donation event; sync within seconds |
| Error queue + dashboard alerts | Surface failed syncs for admin resolution |
| NPSP support | Yes |
| NPC support | Yes |
| Bidirectional sync | No (v2) |
| AppExchange listing | No (apply in parallel; goes live ~6 months later) |

**Setup flow for nonprofit:** OAuth connect → Give detects NPSP vs. NPC automatically → sync starts. Duration: ~5 minutes.

**Not in MVP:** GAU Allocations (fund split sync), P2P fundraiser sync, event registrant sync, bidirectional sync. These add complexity without being the core use case.

### v1.5 — Add-on for Pro Tier

Ship within 6 months of launch:

- GAU Allocation sync for split gifts (designate to multiple funds)
- Fundrasing page / campaign member sync for P2P
- Event registrant sync
- AppExchange listing (managed package)

### v2 — Full Vision

Ship within 12 months of launch:

- Bidirectional sync (Salesforce CDC → Give)
  - Recurring donation status changes (pauses, cancels made by Salesforce admins)
  - Contact field updates (address changes, email changes made in Salesforce)
  - Offline Opportunities created in Salesforce → reflected in Give as manual donations
- AI-assisted field conflict resolution (surfaces mapping issues with suggested fixes)
- Wealth scoring data sync (prospect data into Give's donor CRM)
- Soft Credit sync (credit P2P fundraisers in Salesforce)
- Org-level configuration in the Give dashboard (field mapping customization, sync rules, object filters)
- GAU Allocation field mapping customization per fund

---

## 6. Priority Recommendation

### Argument for Keeping at P2 (Post-Launch, Pro Tier)

- Our primary target market (small nonprofits, <$5M revenue) is **not primarily on Salesforce**. Salesforce's nonprofit penetration is ~3–4% overall, concentrated in the $1M–$10M+ range.
- Building it properly (with queue, deduplication, NPSP compliance) is a real engineering investment — at least 3–4 sprints.
- v1 launch focus should be nailing donation forms, recurring giving, payouts, and basic CRM. Adding Salesforce complexity early dilutes focus.
- AppExchange listing alone is 4–6 months of non-technical overhead.

### Argument for Upgrading to Fast-Follow P1

- **Give Lively's #1 selling point is Salesforce integration.** Any nonprofit evaluating Give vs. Give Lively who runs Salesforce will block on this missing feature. We cannot effectively compete in the mid-market without it.
- **Givebutter's biggest weakness is Zapier-only Salesforce.** Documented as their primary integration complaint in independent reviews. Give can eat their Salesforce-using customers.
- **The technical MVP is achievable in 3–4 weeks** of focused work using an external API connector approach. It doesn't require a managed package or AppExchange listing to start delivering value.
- **The beta strategy explicitly targets a "mix of Salesforce and non-Salesforce" nonprofits.** We need it for beta to be representative.
- **Classy charges $250/month** for theirs. A free, real-time, NPSP-native integration is a genuine differentiator — not just a checkbox.
- **NPC is the emerging battlefield.** Give Lively doesn't support NPC. Givebutter doesn't. Only Classy ($250/month) and Funraise (no reviews yet) do. Shipping NPC support in v1 alongside NPSP creates an immediate, durable differentiator.
- **40,000+ Salesforce nonprofits represent a reachable market** — Salesforce admin communities (Trailblazer Community, Nonprofit Trailblazers group) are concentrated and reachable for demand generation.

### Recommendation: Upgrade to P1.5 — Fast-Follow, Not Day 1

**Do not build this before launch.** Core platform solidity (donation forms, recurring, payouts, CRM, migration tools) must come first. A buggy Salesforce connector at launch is worse than no connector.

**Ship the MVP connector within 60–90 days of launch** — in the same sprint cycle as Zapier integration, positioned as a Pro tier feature that's free for all users during beta.

**Start AppExchange partner registration immediately after the connector ships.** The 4–6 month review timeline means a listing in month 6–8 if started at month 2. This is the right sequencing.

| Timeline | Milestone |
|----------|-----------|
| Launch (Month 0) | Core platform: donation forms, recurring, payouts, CRM, migration, Zapier |
| Month 2–3 | Salesforce MVP connector ships (NPSP + NPC, real-time, one-way, Contact + Opp + Campaign + Recurring, auto flavor detection) |
| Month 2 | Start Salesforce ISV Partner registration (parallel) |
| Month 3 | Begin AppExchange managed package development + security review prep |
| Month 4–5 | Submit to AppExchange security review |
| Month 6 | GAU Allocations + P2P sync + event sync (v1.5) |
| Month 6–8 | AppExchange listing live |
| Month 9–12 | Bidirectional sync (CDC + Pub/Sub API) (v2) |

**Revised priority:** Move Salesforce integration from **P2 → P1 (fast-follow)**, targeting release within 60–90 days of launch. Keep it off the critical path for Day 1 launch. Position it as the first major post-launch Pro feature.

**The competitive pitch once it ships:** *"Native Salesforce integration — free. Real-time, not hourly. Works with both NPSP and Nonprofit Cloud (Agentforce Nonprofit). No Zapier required. No $250/month add-on. Just connect and sync."*

---

## Appendix: Key NPSP Field Reference

### Critical Behaviors

- **Never create a Household Account directly.** Insert Contact with no AccountId; NPSP trigger auto-creates `{LastName} Household` Account.
- **StageName must be "Closed Won"** on Opportunity to trigger NPSP rollups (Total Giving, Last Gift Date, etc.). Any other StageName and the donation won't be counted in giving summaries.
- **Enhanced Recurring Donations (ERD):** Some orgs have it enabled (adds `Paused` status, flexible scheduling), some don't. Connector must detect and handle both variants.
- **NPSP email fields:** Three custom email fields — `npe01__HomeEmail__c`, `npe01__WorkEmail__c`, `npe01__AlternateEmail__c`. Standard Email field mirrors the preferred one. Query all four for deduplication.

### Key API Patterns

```javascript
// Composite Graph API — upsert Contact + Opportunity in one call
POST /services/data/v59.0/composite/graph
{
  "graphs": [{
    "graphId": "donation-sync",
    "compositeRequest": [
      {
        "referenceId": "donor",
        "method": "PATCH",
        "url": "/sobjects/Contact/Give_Donor_ID__c/usr_abc123",
        "body": { "FirstName": "Jane", "LastName": "Smith", "Email": "jane@example.org" }
      },
      {
        "referenceId": "donation",
        "method": "PATCH",
        "url": "/sobjects/Opportunity/Give_Donation_ID__c/don_xyz789",
        "body": {
          "Name": "Jane Smith $100 Donation 2026-02-28",
          "Amount": 100.00,
          "CloseDate": "2026-02-28",
          "StageName": "Closed Won",
          "AccountId": "@{donor.AccountId}",
          "npsp__Primary_Contact__c": "@{donor.id}",
          "Give_Charge_ID__c": "ch_stripe_xxx"
        }
      }
    ]
  }]
}
```

`@{donor.AccountId}` is the NPSP-auto-created Household Account ID — available immediately because the Contact upsert is processed first within the same graph request.

---

*Sources: Salesforce Ben, Watthamlett Consulting NPC Survey, Trailhead NPSP Data Model, WeGive NPSP Docs, GoFundMe Pro Developer Docs, Give Lively AppExchange, Funraise GitHub, AppExchange ISV Partner Guide, Salesforce Developer Docs (REST API, CDC, Composite Graph), 118group 8-platform review, nonprofitmadeeasy.org 2025 donation platform comparison.*
