---
owner: give-coord
last_updated: 2026-03-02
---

# Nonprofit Domain Glossary

All agents must use these terms correctly in code, UI, docs, and communications.

## Terminology

| Term | Definition | Code/UI Implications |
|------|-----------|---------------------|
| **Gift / Donation** | A financial contribution from a donor | Use in UI/docs. Code models: Gift, Donation |
| **Donor** | Person who makes a gift | NOT "customer" or "user" |
| **Organization / Nonprofit** | The entity receiving gifts | NOT "company" or "client" |
| **Designation / Fund** | Where the money goes (program, campaign) | Every gift needs at least one. Required for accounting. |
| **Recurring Gift** | Ongoing periodic donation | NOT "subscription" |
| **Campaign** | Fundraising initiative with a goal | NOT "project" |
| **Acknowledgment / Receipt** | Thank-you + tax documentation | NOT "invoice" |
| **Gift Split** | One donation split across multiple funds | Needs line-items pattern, not single fund FK |
| **Soft Credit** | Attributing a gift to someone who did not pay (spouse, solicitor) | Gift records need soft_credit array |
| **Pledge** | Promise to give X over time with payment schedule | Separate entity with child payment records |
| **LYBUNT** | Last Year But Unfortunately Not This (year) | Year-over-year giving comparison query |
| **SYBUNT** | Some Year But Unfortunately Not This (year) | Wider date range version of LYBUNT |
| **Household** | Linked individuals (spouses, family) | Household-level giving totals + individual records |
| **DAF** | Donor Advised Fund (Fidelity/Schwab/etc.) | Separate payment method. Avg gift 6x larger. Via DAFpay/Chariot API. |
| **Tribute Gift** | "In honor of" or "In memory of" someone | Needs honoree record, notification flag, tribute type |
| **Matching Gift** | Employer matches employee donation | Track status: eligible, submitted, received |
| **Moves Management** | Pipeline stages for major gift prospects | Identification, Cultivation, Solicitation, Stewardship |
| **EIN** | Nonprofit IRS tax ID number | Required on every tax receipt. Stored at org level. |
| **501(c)(3)** | Tax-exempt charity designation | Required statement on tax receipts |

## UI Copy Rules
- "Gift" or "donation" → NOT "payment" or "transaction"
- "Donor" → NOT "customer" or "user"
- "Organization" or "nonprofit" → NOT "company" or "client"
- "Recurring gift" → NOT "subscription"
- "Acknowledgment" or "receipt" → NOT "invoice"
- No emojis in donor-facing UI
