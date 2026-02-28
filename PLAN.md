# Give — Master Planning Document

> **Last updated:** 2026-02-28
> **Status:** Research & Planning Phase
> **Owner:** Dustin Cole / Datawake

---

## 1. Vision & Positioning

**What Give is:** A modern nonprofit fundraising platform that competes directly with Givebutter, Give Lively, and Zeffy.

**Core differentiator:** Transparent, honest, ultra-low platform fees instead of deceptive donor tip models or expensive subscriptions.

| Tier | Platform Fee | What's Included |
|------|-------------|-----------------|
| **Basic** | **1%** | Full fundraising suite — donation forms, events, P2P, CRM, reporting |
| **Pro** | **2%** | Everything in Basic + advanced automation, AI tools, premium integrations, priority support |

**Why this wins:**
- **vs. Zeffy (0% + tips):** Zeffy's "free" model hides a 15-17% default tip that confuses donors and erodes trust. Give charges 1% transparently — donors know exactly where their money goes.
- **vs. Givebutter (0% + tips or 3%):** Givebutter's tip model has the same donor confusion problem. Their no-tip option charges 3%. Give undercuts at 1%.
- **vs. Give Lively (0% + tips):** Philanthropist-funded model with sustainability questions. Limited features. Give offers more for less.
- **vs. Classy/GoFundMe Pro ($299/mo + 2.2%):** Prohibitively expensive for small/mid nonprofits. Give has zero monthly fees.
- **vs. Donorbox (2.95% platform fee):** Nearly 3x Give's basic rate.

**The pitch:** "100% of your donation goes to the cause. We charge the nonprofit 1% — not the donor 17%."

---

## 2. Target Market

**Primary:** Small to mid-sized U.S. 501(c)(3) nonprofits with <50 employees and <$5M annual revenue.

**Secondary:** Schools, religious organizations, community groups, sports teams, social enterprises.

**Beachhead strategy:** Win the organizations currently frustrated by Zeffy's donor tip complaints and Givebutter's fee confusion. Target nonprofits processing $50K-$2M/year online — big enough to care about platform quality, small enough to be price-sensitive.

---

## 3. Revenue Model & Unit Economics

### Fee Structure
| Payment Method | Processing Fee (passed through) | Platform Fee |
|---------------|-------------------------------|-------------|
| Credit/Debit Card | ~2.2% + $0.30 (Stripe nonprofit rate) | 1% or 2% |
| ACH/Bank Transfer | 0.8% capped at $5 (Stripe) | 1% or 2% |
| Apple Pay / Google Pay | Same as card | 1% or 2% |

### Revenue Projections (illustrative)
| Scenario | Annual Donations Processed | Avg Platform Fee | Annual Revenue |
|----------|---------------------------|-----------------|---------------|
| Year 1 (500 orgs, $100K avg) | $50M | 1.2% | $600K |
| Year 2 (2,000 orgs, $150K avg) | $300M | 1.3% | $3.9M |
| Year 3 (5,000 orgs, $200K avg) | $1B | 1.4% | $14M |

### Cost Structure (key items to model)
- Stripe processing (passed through to nonprofit, not our cost)
- Infrastructure (hosting, CDN, database)
- Stripe Connect platform fees
- Customer support
- Marketing & sales
- Engineering team

### Open Questions — Revenue
- [ ] Should donors have the option to cover the 1% platform fee? (Like "cover the fee" checkboxes)
- [ ] Free trial period? Or free up to $X in donations?
- [ ] Annual billing discount for Pro tier?
- [ ] Enterprise/custom tier for very large orgs?

---

## 4. Feature Prioritization

### Tier 1 — MVP (Launch Requirements)
These are table stakes. Cannot launch without them.

| Feature | Priority | Notes |
|---------|----------|-------|
| **Customizable donation forms** | P0 | One-time + recurring (monthly, quarterly, annual). Embeddable widget + hosted page. Mobile-optimized. |
| **Payment processing** | P0 | Credit/debit, ACH, Apple Pay, Google Pay via Stripe Connect |
| **Donor management (basic CRM)** | P0 | Contact profiles, giving history, tags/segments, search, export |
| **Automated tax receipts** | P0 | Customizable email receipts with org branding. IRS-compliant substantiation. |
| **Campaign/fundraising pages** | P0 | Branded pages with goal thermometer, donor roll, social sharing, QR codes |
| **Recurring giving management** | P0 | Donor portal to manage/update/cancel recurring gifts. Retry failed payments. |
| **Basic reporting & analytics** | P0 | Donation totals, trends, campaign performance, donor retention rates |
| **Nonprofit onboarding** | P0 | Self-service signup, Stripe Connect setup, 501(c)(3) verification |
| **Org dashboard** | P0 | Central hub for all campaigns, donors, finances |
| **Multi-user access** | P0 | Role-based permissions (admin, editor, viewer) |
| **Cover-the-fee option** | P0 | Let donors optionally cover processing + platform fees |
| **Payouts/disbursements** | P0 | Automatic daily/weekly payouts to nonprofit bank account (no manual withdrawal) — this is a Givebutter weakness |

### Tier 2 — Fast Follow (Weeks After Launch)
| Feature | Priority | Notes |
|---------|----------|-------|
| **Peer-to-peer fundraising** | P1 | Supporter-created pages, team pages, leaderboards |
| **Event ticketing** | P1 | Ticket tiers, check-in, virtual event support |
| **Email campaigns** | P1 | Basic newsletters, donor communications, templates |
| **Text-to-donate** | P1 | SMS short code → donation form link |
| **Embeddable widgets** | P1 | Drop-in donation forms for any website (WordPress, Squarespace, etc.) |
| **Data import/migration** | P1 | CSV import + migration tools from Givebutter, Zeffy, Donorbox, etc. |
| **Zapier integration** | P1 | Connect to 6,000+ apps as a bridge until native integrations exist |

### Tier 3 — Growth Features (Pro Tier)
| Feature | Priority | Notes |
|---------|----------|-------|
| **Auctions** | P2 | Silent auction, mobile bidding, auto-payment |
| **Advanced automation/workflows** | P2 | Drip sequences, triggered emails, donor journey automation |
| **AI-powered donor insights** | P2 | Prospect scoring, churn prediction, suggested actions |
| **Native integrations** | P2 | Salesforce, Mailchimp, QuickBooks, HubSpot — native, not just Zapier |
| **Advanced reporting** | P2 | Custom reports, donor segmentation, cohort analysis |
| **Memberships** | P2 | Tiered membership programs with auto-renewal |
| **Online store** | P2 | Merch/product sales with inventory management |
| **Raffles & lotteries** | P2 | Ticket bundles, drawing management |
| **Custom domains** | P2 | White-label donation pages on the nonprofit's domain |
| **Direct mail** | P2 | Physical letter campaigns from within the platform |
| **Multi-currency / international** | P2 | For nonprofits with global donor bases |

### Tier 4 — Long-Term Differentiators
| Feature | Priority | Notes |
|---------|----------|-------|
| **Embedded giving (on-site conversion)** | P3 | Donate without leaving the nonprofit's site — 28% revenue lift per Fundraise Up |
| **AI virtual engagement officer** | P3 | AI-driven personalized donor outreach at scale |
| **Volunteer management** | P3 | Track volunteers alongside donors (gap across all competitors) |
| **Grant management** | P3 | Track grant applications, deadlines, reporting (no competitor does this well) |
| **Advocacy tools** | P3 | Petition, letter campaigns, combined with fundraising |
| **Planned giving / legacy** | P3 | Bequests, estate gifts |
| **Crypto / stock donations** | P3 | Alternative asset acceptance |
| **Native mobile app** | P3 | Admin app for nonprofit staff |

---

## 5. Competitive Advantages to Build

### Day 1 Advantages
1. **Transparent pricing** — No donor tips, no hidden fees, no gotchas. 1% is 1%.
2. **Automatic payouts** — Daily/weekly bank deposits without manual withdrawal (Givebutter requires manual initiation).
3. **Modern UX** — Clean, fast, beautiful. Not enterprise-clunky.
4. **ACH promotion** — Actively encourage ACH donations (0.8% vs 2.2% card fees) to save nonprofits money.

### Medium-Term Advantages
5. **Native API from day one** — Public REST API + webhooks. Zeffy has no API. Givebutter relies on Zapier.
6. **Seamless migration** — One-click data import from competitors. Make switching painless.
7. **Developer-friendly** — Embeddable components, API-first design, webhook events.

### Long-Term Moats
8. **AI-native platform** — Built with AI from the ground up, not bolted on.
9. **Unified data model** — Donors, volunteers, events, campaigns, grants all connected.
10. **Community/ecosystem** — Template marketplace, integration directory, nonprofit community.

---

## 6. Technical Architecture (Preliminary)

### Guiding Principles
- **API-first** — Every feature accessible via API. Frontend is a consumer of the API.
- **Multi-tenant SaaS** — Single codebase, isolated data per organization.
- **Event-driven** — Webhook-native. Every action emits events for integrations.
- **Edge-optimized** — Fast globally. Donation forms must load in <1 second.

### Proposed Tech Stack (To Be Validated)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js (React) + Tailwind CSS | SSR for SEO, fast page loads, huge ecosystem, easy hiring |
| **Backend API** | Node.js (TypeScript) or Go | Node for velocity + ecosystem; Go if performance is critical path |
| **Database** | PostgreSQL | Reliable, scalable, great for relational data (donors, orgs, transactions) |
| **Cache** | Redis | Session management, rate limiting, real-time features |
| **Search** | PostgreSQL full-text (start) → Elasticsearch (scale) | Don't over-engineer early |
| **Queue/Events** | BullMQ (Redis-backed) or SQS | Async processing: receipts, webhooks, reports |
| **File Storage** | S3 / Cloudflare R2 | Campaign images, receipts, exports |
| **Hosting** | Vercel (frontend) + Railway or Fly.io (API) | Or AWS if we need full control |
| **Payments** | Stripe Connect (Express or Custom) | Industry standard for marketplace/platform payments |
| **Email** | Resend or Postmark (transactional) + custom (campaigns) | Reliable delivery for receipts |
| **Auth** | Clerk or Auth.js | SSO, MFA, role-based access |
| **Monitoring** | Sentry + Axiom or Datadog | Error tracking + observability |
| **CI/CD** | GitHub Actions | Standard, well-supported |

### Key Architecture Decisions Needed
- [ ] **Stripe Connect account type:** Express (simpler, Stripe-hosted onboarding) vs Custom (full control, more work)?
- [ ] **Monorepo vs polyrepo?** Leaning monorepo (Turborepo) for velocity.
- [ ] **Multi-tenant data isolation:** Shared database with org_id foreign keys (simpler) vs schema-per-tenant (stronger isolation)?
- [ ] **Server-side rendering strategy:** Full SSR, ISR, or static for public pages + SPA for dashboard?
- [ ] **Real-time:** WebSockets for live donation feeds, or SSE, or polling?

---

## 7. Stripe Connect Strategy

Stripe Connect is the backbone. Key decisions:

### Account Types
| Type | Onboarding | Branding | Payout Control | Complexity |
|------|-----------|----------|---------------|------------|
| **Express** | Stripe-hosted (fast) | Stripe-branded dashboard for nonprofits | Stripe manages | Low |
| **Custom** | We build it | Fully white-labeled | We control | High |

**Recommendation:** Start with **Express** for speed to market. Migrate to Custom later for full control.

### Fee Flow (1% Basic Tier Example)
```
Donor pays: $100.00 donation + optional fee coverage
  → Stripe processing: ~$2.50 (2.2% + $0.30)
  → Give platform fee: $1.00 (1%)
  → Nonprofit receives: $96.50

With donor fee coverage:
  → Donor pays: $103.62 (covers processing + platform fee)
  → Stripe processing: ~$2.58
  → Give platform fee: $1.00
  → Nonprofit receives: $100.00
```

### Stripe Connect Features to Leverage
- **Automatic payouts** — Configure daily/weekly to nonprofit's bank
- **Dispute handling** — Stripe manages chargebacks
- **1099 tax reporting** — Stripe handles for connected accounts
- **Payment methods** — Cards, ACH, Apple Pay, Google Pay, Link all built in
- **Radar** — Fraud detection included
- **Nonprofit discount** — 2.2% + $0.30 (vs standard 2.9% + $0.30)

---

## 8. Competitive Intelligence Summary

### Givebutter
- **Strengths:** Feature-rich (CRM, events, auctions, P2P), 70K+ nonprofits, $7B+ processed, profitable
- **Weaknesses:** Donor tip confusion (default 15%), basic CRM, Zapier-dependent integrations, manual payouts, limited customization
- **Pricing:** Free (tips enabled) or 3% (tips disabled) + $29-$279/mo for Plus tier
- **Tech:** AWS, Adyen (payments), React-based frontend

### Zeffy
- **Strengths:** 100% free for nonprofits, 100K+ users, $2B+ raised, covers all basics
- **Weaknesses:** No API, aggressive 15-17% default donor tip, basic reporting, limited customization, lightweight CRM, sustainability questions
- **Pricing:** $0 (funded by voluntary donor tips averaging ~4% when given, ~2/3 of donors tip)
- **Tech:** React + Node.js

### Give Lively
- **Strengths:** Genuinely free (philanthropist-funded), good Salesforce integration, values-driven
- **Weaknesses:** Only 9K nonprofits, no API, no native CRM (only Salesforce), 2 page templates, no auction/store, no mobile app
- **Pricing:** $0 platform fee, Stripe processing fees apply (~2.2% + $0.30)
- **Tech:** Ruby on Rails, Heroku, Stripe

### Market Opportunity
- Online fundraising tools market: **$1.28B (2024) → $7.25B (2033)**, 21% CAGR
- Heavy consolidation (Blackbaud, Bonterra acquiring everyone) creates opportunity for modern challenger
- 57% of nonprofit traffic is mobile — mobile optimization is critical
- ACH is massively underutilized (0.8% vs 2.2% card fees)

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stripe dependency | High | Abstract payment layer; consider Adyen as backup |
| Race to zero pricing | High | Compete on value/features, not just price. 1% is already near floor. |
| Slow nonprofit adoption | Medium | Migration tools, free trial, content marketing, nonprofit community partnerships |
| Regulatory complexity (state registration) | Medium | Build compliance tools into platform; partner with compliance services |
| Zeffy/Givebutter copy our pricing | Medium | First-mover advantage in transparent pricing; build moat via API + integrations |
| Security/data breach | Critical | SOC 2 compliance from day 1, PCI via Stripe, security audits |
| Scaling payment operations | Medium | Stripe handles most complexity; plan for volume-based Stripe negotiations |

---

## 10. Open Questions & Decisions Needed

### Business
- [ ] Company structure — LLC? C-Corp? (if seeking VC funding, C-Corp is standard)
- [ ] Name/brand — "Give" is extremely generic. Domain availability? Trademark?
- [ ] Do we need 501(c)(3) verification for onboarding, or accept all orgs?
- [ ] Donor fee coverage — opt-in or opt-out by default?
- [ ] Free tier/trial — any free usage before the 1% kicks in?

### Product
- [ ] What does the donation form builder look like? Drag-and-drop? Template-based?
- [ ] How much campaign page customization? Full WYSIWYG or structured templates?
- [ ] Real-time donation feed for events — how critical for MVP?
- [ ] Donor portal — self-service from day 1 or admin-managed?

### Technical
- [ ] Monorepo structure and tooling
- [ ] Stripe Connect account type (Express vs Custom)
- [ ] Database multi-tenancy approach
- [ ] Hosting provider selection
- [ ] Domain and infrastructure setup

---

## 11. Milestones (Draft)

| Phase | Milestone | Target |
|-------|-----------|--------|
| **0 — Foundation** | Tech stack validated, repo setup, Stripe Connect sandbox | Week 1-2 |
| **1 — Core** | Donation forms + payment processing + basic dashboard working | Week 3-6 |
| **2 — CRM** | Donor management, receipts, reporting | Week 7-9 |
| **3 — Campaigns** | Fundraising pages, P2P, embeddable widgets | Week 10-12 |
| **4 — Polish** | Onboarding flow, migration tools, documentation | Week 13-14 |
| **5 — Beta** | Private beta with 10-20 nonprofits | Week 15-16 |
| **6 — Launch** | Public launch | Week 17-18 |

---

## 12. Documentation & Community

### Documentation — Mintlify (DECIDED)
**Platform:** Mintlify (mintlify.com)
**Why:** Best-in-class design, native OpenAPI/API playground, MDX support, custom domain on free tier, LLM-ready indexing. Used by Anthropic, Cursor, Perplexity.
**Cost:** Free tier to start → $250/mo Pro when team editing + analytics needed.
**Location:** `docs/` directory in monorepo, deployed via Mintlify.

**Doc structure:**
- Getting Started (quickstart, onboarding guide)
- Product Guides (campaigns, donation forms, donor management, events, P2P)
- API Reference (auto-generated from OpenAPI spec)
- Integrations (Stripe, Zapier, webhooks)
- Billing & Pricing (transparent fee explanation)

### Changelog / Roadmap / Feature Voting — Featurebase (DECIDED)
**Platform:** Featurebase (featurebase.app)
**Why:** All three features (changelog, public roadmap, feature voting) in one tool for $49/mo flat. AI duplicate detection. No usage-based pricing. Beats Canny ($359/mo) on value.
**Integration:** Embed Featurebase widgets in the Give app + link from footer/nav.

**Pages to integrate:**
- `/changelog` — Product updates, new features, fixes
- `/roadmap` — Public development pipeline (Planned → In Progress → Done)
- `/feedback` — Feature request voting board where users comment and upvote

**Alternatives considered and rejected:**
- Canny ($359/mo for comparable features — too expensive for startup)
- Frill ($75/mo for all features — thinner feature set)
- Nolt ($29/mo — feedback only, no changelog/roadmap)
- Build-it-yourself (3-4 weeks engineering, better spent on core product)

---

## 13. Research Archive

Detailed competitive research was conducted on 2026-02-28 covering:
- Givebutter (features, pricing, weaknesses, tech stack)
- Give Lively (features, pricing, weaknesses, tech stack)
- Zeffy (features, pricing, tip controversy, tech stack)
- Market sizing ($1.28B → $7.25B, 21% CAGR)
- Payment processing landscape (Stripe nonprofit rates, ACH opportunity)
- Regulatory requirements (PCI DSS 4.0.1, state charitable solicitation)
- 15+ additional competitors mapped

Full research notes available on request. Key sources indexed from Givebutter.com, Zeffy.com, GiveLively.org, G2, Capterra, industry reports.

---

## Changelog

| Date | Update | Terminal/Session |
|------|--------|-----------------|
| 2026-02-28 | Initial planning document created. Competitive research complete. Feature prioritization drafted. | Initial session |
| 2026-02-28 | Monorepo initialized (Turborepo + pnpm). Shared types/fee calc package created. Prisma schema designed (orgs, users, donors, donations, campaigns). | Initial session |
| 2026-02-28 | Backend API complete: Hono server, 5 route groups (health, orgs, campaigns, donations, stripe), Stripe Connect integration, webhook handling, fee calculation. | Initial session |
| 2026-02-28 | Documentation (Mintlify) and changelog/roadmap (Featurebase) platforms decided. Docs scaffolding started. | Initial session |
| 2026-02-28 | Frontend scaffolding in progress: Next.js 15, landing page, donation form, dashboard, donor/campaign pages. | Initial session |
| 2026-02-28 | Frontend COMPLETE: Landing page (hero, features, pricing, comparison table), donation page with fee calculator, dashboard (overview, campaigns, donors), DonationForm + GoalThermometer components, API client. | Initial session |
| 2026-02-28 | Mintlify docs COMPLETE: 25 pages — intro, quickstart, pricing, 6 guides, 4 integration pages, 12 API reference pages. mint.json configured with full navigation. | Initial session |
| 2026-02-28 | ALL packages type-check clean (zero TS errors across shared, db, api, web). Prisma client generated. Project ready for `pnpm dev`. | Initial session |
