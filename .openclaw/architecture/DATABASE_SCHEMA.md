---
owner: give-dev
last_updated: 2026-03-02
---

# Database Schema

## Core Conventions
- All tables: id (cuid), organizationId, createdAt, updatedAt
- Soft delete: deletedAt for donor and donation records
- Foreign keys enforced at database level
- Prisma 6 ORM — migrations via pnpm --filter db prisma migrate dev

## Core Entities (implement in this order)

```
Organization (tenant)
  ├── User (staff member, has role/permissions)
  ├── Donor
  │     ├── belongs_to: Household (optional)
  │     ├── has_many: Gifts
  │     ├── has_many: Communications
  │     └── has_one: AI Donor Score (computed)
  ├── Gift (donation)
  │     ├── belongs_to: Donor
  │     ├── has_many: GiftLineItems (designations/fund splits)
  │     ├── has_many: SoftCredits
  │     └── belongs_to: Campaign (optional)
  ├── Campaign
  │     ├── has_many: Gifts
  │     └── has_many: CampaignPages (peer-to-peer)
  ├── Fund / Designation
  │     └── has_many: GiftLineItems
  └── DonationForm (configuration)
        └── has_many: Gifts
```

## Salesforce Compatibility

Import tools must map from both NPSP and NPC models:

| Concept | NPSP (Legacy) | NPC (New) | Give |
|---------|--------------|-----------|------|
| Donor | Contact + Account/Household | Person Account | Donor |
| Gift | Opportunity | Gift Transaction | Gift |
| Recurring | Recurring Donations | Gift Commitment + schedule | RecurringGift |
| Campaign | Standard Campaign | Standard Campaign | Campaign |

## Tables
(give-dev: update this as you create Prisma models)
