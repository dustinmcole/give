---
owner: give-coord
last_updated: 2026-03-02
---

# Salesforce Data Model Reference

Give supports migration from both Salesforce NPSP (legacy) and NPC (new). Import tools must handle both.

## Model Comparison

| Concept | NPSP (Legacy) | NPC (New) | Give Equivalent |
|---------|--------------|-----------|-----------------|
| Donor records | Contacts + Account/Household model | Person Accounts | Donor |
| Gifts | Opportunities | Gift Commitments + Gift Transactions | Gift |
| Recurring | Recurring Donations object | Gift Commitments with schedule | RecurringGift |
| Campaigns | Standard Campaigns | Standard Campaigns | Campaign |
| Custom fields | On Contact/Opportunity | On Person Account/Gift Transaction | CustomFieldValue |
| Relationships | Relationships object | Actionable Relationship Center | Household + SoftCredit |

## Import Considerations
- NPSP uses a Contact + Account/Household model — donors are Contacts linked to Household Accounts
- NPC uses Person Accounts — each donor is a single record (Account + Contact merged)
- Both use standard Campaigns
- Custom field mapping requires user-defined field mapping during import
- Test imports with sample data from BOTH NPSP and NPC exports
- Duplicate detection: match on email, then name+address

## Competitor Migration Paths
- Bloomerang: CSV export → Give import
- Bonterra (EveryAction): API or CSV
- Blackbaud: RE NXT API or CSV
- Microsoft F&E: retiring Dec 2026 — CSV migration targets
