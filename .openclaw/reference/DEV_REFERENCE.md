# DEV REFERENCE CARD

**For dev, QA, and documentation agents. Read before every task.**
**Coordinator brief: `./DREAM_CYCLE.md` | Full vision: `./VISION.md`**

---

## WHAT WE'RE BUILDING

AI-native nonprofit fundraising platform. 1% fee on card donations, no subscriptions. Best donation form in the market. AI embedded in everything. Supports migration from Salesforce NPSP, Salesforce NPC, Bloomerang, Bonterra, Blackbaud, and others.

---

## ARCHITECTURE RULES (Non-Negotiable)

1. **API-first.** Every feature is an API endpoint first, then a UI. The dashboard is a client of our own API.
2. **Event-driven.** Every action emits an event (donation received, donor created, email sent, etc.). Events drive webhooks, automations, AI, and analytics.
3. **Multi-tenant.** Single codebase, shared infrastructure, isolated data. Each nonprofit's data is logically segregated and encrypted at rest.
4. **AI-aware.** Every data point should feed the AI feature store. If you're tracking data, consider what model it will feed.
5. **Mobile-first.** Design for mobile, then expand for desktop. Never the reverse.
6. **Stripe Connect.** All payments flow through Stripe Connect. We never touch card data. Our 1% fee uses Stripe's application fee mechanism.

---

## DESIGN RULES

- **Donation form loads <2 seconds on 3G mobile.** This is a hard requirement.
- **No clutter.** Every extra field on a form costs conversions. Question every input.
- **WCAG 2.1 AA minimum.** High contrast, keyboard nav, screen reader support, ARIA labels.
- **No tutorials.** If a feature needs explanation, redesign it. Progressive disclosure — show what's needed now, hide the rest.
- **No emojis in donor-facing UI.** Professional, trustworthy, clean.

---

## SECURITY RULES

- Card data never touches our servers (Stripe client-side tokenization, PCI SAQ A).
- All data encrypted at rest (AES-256) and in transit (TLS 1.3).
- Field-level encryption for sensitive PII (SSN, bank account numbers).
- AI-generated donor communications require human review by default.
- AI must never fabricate donor data — names, amounts, dates, history must come from the database.
- Log all data access. Audit trail for every record change.

---

## SALESFORCE COMPATIBILITY

We support migration from BOTH Salesforce products. Know the difference:

| | NPSP (Legacy) | NPC (New) |
|--|--------------|-----------|
| Donor records | Contacts + Account/Household model | Person Accounts |
| Gifts | Opportunities | Gift Commitments + Gift Transactions |
| Recurring | Recurring Donations object | Gift Commitments with schedule |
| Campaigns | Standard Campaigns | Standard Campaigns |
| Custom fields | On Contact/Opportunity | On Person Account/Gift Transaction |
| Relationships | Relationships object | Actionable Relationship Center |

Import tools must map from both models into our unified data model. Test imports with sample data from both NPSP and NPC exports.

---

## KEY DOMAIN TERMS

Get these wrong and features break. Full glossary in `VISION.md` section 10.

| Term | What It Means | Why It Matters to Code |
|------|--------------|----------------------|
| **Soft Credit** | Attributing a gift to someone who didn't pay (spouse, solicitor) | Gift records need a `soft_credit` array, not just one donor FK |
| **Gift Split** | One donation split across multiple funds | Gift model needs a line-items pattern, not a single fund FK |
| **Pledge** | Promise to give X over time with a payment schedule | Separate pledge entity with child payment records. Track balance. |
| **LYBUNT** | Gave last year, not this year | Critical report. Needs year-over-year giving comparison query. |
| **SYBUNT** | Gave some prior year, not this year | Same pattern, wider date range. |
| **Household** | Linked individuals (spouses, family) | Household-level giving totals + individual records. Joint salutations. |
| **Designation/Fund** | Where the money goes (program, campaign) | Every gift must have at least one designation. Required for accounting. |
| **DAF** | Donor Advised Fund — giving vehicle via Fidelity/Schwab/etc | Separate payment method. Larger gifts (6x avg). Via DAFpay/Chariot API. |
| **Tribute Gift** | "In honor of" or "In memory of" someone | Needs honoree record, notification flag, and tribute type field. |
| **Matching Gift** | Employer matches employee donation | Track match status: eligible → submitted → received. Doubles revenue. |
| **Moves Management** | Pipeline stages for major gift prospects | Identification → Cultivation → Solicitation → Stewardship. Kanban-like. |
| **EIN** | Nonprofit's IRS tax ID number | Required on every tax receipt. Stored at org level. |
| **501(c)(3)** | Tax-exempt charity designation | Required statement on every tax receipt: "No goods or services were provided..." |

---

## DATA MODEL ESSENTIALS

Core entities and their relationships (implement in this order):

```
Organization (tenant)
  ├── User (staff member, has role/permissions)
  ├── Donor
  │     ├── belongs_to: Household (optional)
  │     ├── has_many: Gifts
  │     ├── has_many: Communications
  │     ├── has_many: Tasks/Interactions
  │     ├── has_many: Custom Field Values
  │     └── has_one: AI Donor Score (computed)
  ├── Gift
  │     ├── belongs_to: Donor
  │     ├── has_many: Gift Line Items (designations/splits)
  │     ├── belongs_to: Campaign (optional)
  │     ├── belongs_to: Pledge (optional)
  │     ├── has_one: Tribute (optional)
  │     ├── has_many: Soft Credits
  │     └── payment_method: card | ach | daf | check | cash | stock | in_kind
  ├── Fund/Designation
  ├── Campaign
  ├── Pledge (has_many: Gifts as payments)
  ├── Communication (email sent, has tracking)
  ├── DonationForm (config, embed settings)
  └── Event (Phase 3)
```

**Critical:** Gifts are NOT simple `donor + amount + date` records. They have line items (splits), soft credits, tributes, matching gift status, pledge linkage, and payment method details. Build the data model right from day one or everything downstream breaks.

---

## TESTING REQUIREMENTS

- Every API endpoint has automated tests.
- Donation flow has end-to-end tests covering: one-time card, recurring card, ACH, DAF, form abandonment, fraud detection trigger.
- Import tools tested against real export files from NPSP, NPC, Bloomerang, and CSV.
- Mobile responsiveness tested at 320px, 375px, 414px, 768px widths.
- Load time tested on simulated 3G connection.
- All AI-generated content tested for: no fabricated data, appropriate tone, correct merge fields.
- Tax receipts validated for IRS compliance (EIN present, 501(c)(3) statement, date, amount, "no goods or services" language).

---

## WHEN IN DOUBT

- **Ask:** "Would a nonprofit development director be embarrassed showing this to a donor?" If yes, redesign.
- **Ask:** "Is this simpler than how Bloomerang/Blackbaud does it?" If not, simplify.
- **Ask:** "What AI could make this feature smarter?" If nothing, you might be missing something.
- **Check:** `VISION.md` for full context on any feature area.
- **Check:** `DREAM_CYCLE.md` for current priorities and coordinator decisions.

---

*This document is maintained by the coordinator. If you find it outdated, flag it.*
