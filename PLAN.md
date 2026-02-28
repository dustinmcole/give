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
- [x] Annual billing discount for Pro tier? **DECIDED: Not at launch.** Pure percentage model has no flat fee to bill annually. Keep "no monthly fees" positioning. Revisit at month 6-12 if Pro tier gains flat-fee premium features. If added later, use ~17% discount (2 months free) on flat fee only -- transaction percentages always bill monthly in arrears. See Research Archive for full analysis.
- [x] Enterprise/custom tier for very large orgs? (RESEARCHED -- see enterprise pricing strategy below)

### Enterprise / Custom Pricing Strategy (Researched 2026-02-28)

**Trigger point:** Enterprise pricing becomes necessary at ~$5M+ in annual online donations. Below that, 1% is unbeatable in the market.

**Recommended model (Hybrid -- volume-based tiered %, no monthly fee):**

| Tier | Monthly Fee | Platform Fee | Eligibility |
|------|------------|-------------|-------------|
| **Basic** | $0 | 1% | All orgs |
| **Pro** | $0 | 2% | All orgs |
| **Enterprise** | $0 | 0.75% ($2-5M), 0.5% ($5-10M), custom ($10M+) | $2M+/year, annual contract |

Enterprise includes: Dedicated account manager, SSO/SAML, white-label, custom domains, SLA, multi-org/chapter management, advanced API limits, priority 24/7 support, migration services.

Floor: 0.25% (below this, unit economics break down). At $10M/year @ 0.5% = $50K revenue. At $25M @ 0.25% = $62.5K revenue.

**Why no monthly fee at enterprise:** Maintains Give's core brand promise. Differentiates from Classy ($299/mo), Donorbox ($150/mo), Blackbaud ($999/mo). Nobody else offers $0 monthly across all tiers.

**Key insight:** Nobody publishes transparent enterprise pricing in this space -- everything is behind "Contact Sales." Give could differentiate by publishing volume-based tiers openly.

**Competitor enterprise pricing comparison:**

| Competitor | Enterprise Model | Approximate Cost at $5M Volume |
|-----------|-----------------|-------------------------------|
| Givebutter | No enterprise tier (3% or tips) | $150K (at 3%) or $0 (tips) |
| Classy/GoFundMe Pro | $299/mo + ~4.4% | ~$223K/yr |
| Blackbaud | Flat subscription, custom quoted | $50K-$150K/yr |
| Fundraise Up | 4% (Quick Start) or custom (Enterprise) | $200K (QS) or custom |
| Donorbox | $150/mo + 1.75% (Pro) or custom (Premium) | ~$89K/yr (Pro) |
| **Give** | **$0/mo + 0.75%** | **$37.5K/yr** |

See Section 13 (Research Archive) for full enterprise pricing competitive research.

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
| **Data import/migration** | P1 | CSV import + migration tools from Givebutter, Zeffy, Donorbox, Give Lively, Classy. Universal CSV template designed. Auto-detect source format from column headers. Full research in `docs/migration-research.md`. |
| **Zapier integration** | P1 | Connect to 6,000+ apps as a bridge until native integrations exist |

### Tier 3 — Growth Features (Pro Tier)
| Feature | Priority | Notes |
|---------|----------|-------|
| **Auctions** | P2 | Silent auction, mobile bidding, auto-payment |
| **Advanced automation/workflows** | P2 | Drip sequences, triggered emails, donor journey automation |
| **AI-powered donor insights** | P2 | Prospect scoring, churn prediction, suggested actions |
| **Salesforce integration** | P1 (fast-follow) | Native NPSP connector — real-time, free. Ship within 60–90 days of launch. Beat Give Lively's hourly batch. Full design in `docs/salesforce-integration.md`. |
| **Other native integrations** | P2 | Mailchimp, QuickBooks, HubSpot — native, not just Zapier |
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

> Full research and rationale for all business decisions: `docs/business-decisions.md`

### Business
- [x] **Company structure** — **California LLC for now.** Convert to Delaware C-Corp when VC term sheet arrives or employee stock options are needed. File directly with CA SOS ($70). Elect S-Corp taxation when net profit consistently exceeds ~$70K/year. Skip Stripe Atlas for now. (DECIDED)
- [ ] Name/brand — "Give" is extremely generic. Domain availability? Trademark?
- [x] **501(c)(3) verification for onboarding** — **DECIDED (researched 2026-02-28):** Yes — EIN lookup against IRS Pub 78 + EO BMF at signup. Auto-approve if EIN is in Pub 78 (deductibility code A). Flag edge cases (churches, fiscal sponsors) for structured self-certification. Do NOT require IRS determination letter upload at signup — adds friction and is unnecessary given free IRS bulk data. Use Pactman Nonprofit Check Plus API (free tier: 200 checks/month; $0 marginal cost at low volume) as implementation shortcut, or self-host the IRS bulk data. Cross-check auto-revocation list to block revoked orgs. See Section 13 (Research Archive) for full 501(c)(3) verification research.
- [x] **Donor fee coverage** — **Opt-in (unchecked) by default.** Allow orgs to configure pre-checked as an org-level setting. Default copy: "Add $[amount] so 100% of your gift reaches [org name]." Animated nudge in Round 1. AI-adaptive prompting in Round 2/3 Pro. (DECIDED)
- [x] **Free tier/trial** — **First $10,000 in donations fee-free per org.** Enforced via EIN deduplication. All features available from day one — not a feature gate. CAC = $100/org vs. $702 industry average. Copy: "Your first $10,000: zero platform fees. Then just 1%, always." (DECIDED)
- [x] **Annual billing for Pro** — **Do not launch with annual billing.** Pure percentage model has nothing to prepay. "No monthly fees" positioning must not be diluted by inventing a flat fee. Revisit at month 6–12 if Pro gains flat-fee premium features; use ~17% discount on flat fee only. (DECIDED)
- [x] **Enterprise tier** — **Volume-based, triggered at $2M+/year in donations. $0 monthly across all tiers.** Tiers: 0.75% ($2M–$5M), 0.5% ($5M–$10M), custom/min 0.25% ($10M+). Annual contract required. Features: dedicated AM, SSO, white-label, SLA, multi-org, priority support. Publish pricing openly. (DECIDED)

### Product
- [x] What does the donation form builder look like? Drag-and-drop? Template-based? **DECIDED (informed by competitive UX teardown):** Template-based at MVP with 2-3 polished templates. No drag-and-drop — competitors don't have it either and it's high engineering cost for low value. Structured fields: colors (primary/secondary/accent — beat Give Lively's 1 color), logo, impact descriptions per amount tier, cover-the-fee copy. See `docs/competitive-ux-teardown.md`.
- [x] How much campaign page customization? Full WYSIWYG or structured templates? **DECIDED:** Structured templates at MVP. Multiple brand colors, hero image, description, video embed, goal thermometer, donor wall. Full WYSIWYG is Round 2. Key insight: Give Lively only has 2 templates and 1 color — easy to beat.
- [x] Real-time donation feed for events — how critical for MVP? **DECIDED:** Not MVP. Round 1 fast-follow. Givebutter's live display (confetti, big screen) is impressive but not a launch blocker. QR codes for events ARE MVP.
- [x] Donor portal — self-service from day 1 or admin-managed? **DECIDED:** Admin-managed at MVP. Stripe's customer portal handles recurring updates/cancels. Custom donor portal (Give Lively has a good one — 3-year history + tax summaries) is Round 1.
- [x] Donation checkout flow design? **DECIDED (informed by competitive UX teardown):** 2-3 step checkout. Step 1: amount + frequency + fund. Step 2: donor info + payment + cover-the-fee. Step 3: branded confirmation. Beat Givebutter's 10-step flow and Zeffy's hidden-tip single page. Zero tip prompts. Form data must persist across browser refresh (learn from Give Lively). See `docs/competitive-ux-teardown.md`.
- [x] Embeddable widget strategy? **DECIDED (informed by competitive UX teardown):** Ship 3+ widget types at Round 1: inline form, popup modal, floating button. Full-width responsive (beat Givebutter's 420px cap). Retain nonprofit branding in embeds (beat Zeffy's stripped embeds). Support WordPress, Squarespace, Wix, Webflow. See `docs/competitive-ux-teardown.md`.
- [x] Thank-you / confirmation page? **DECIDED (informed by competitive UX teardown):** Fully branded and customizable from MVP. Org colors, logo, custom message, rich text, next steps, social sharing. Exploit Givebutter's fixed-yellow weakness. See `docs/competitive-ux-teardown.md`.

### Technical
- [ ] Monorepo structure and tooling
- [ ] Stripe Connect account type (Express vs Custom)
- [ ] Database multi-tenancy approach
- [ ] Hosting provider selection
- [ ] Domain and infrastructure setup
- [x] **Salesforce integration architecture** — **DECIDED (2026-02-28).** See `docs/salesforce-integration.md`. Priority upgraded P2 → P1 fast-follow (ship Month 2–3 post-launch). Key decisions: (1) External API connector (not managed package) for v1 — Give servers call Salesforce REST API; (2) JWT Bearer OAuth for server-to-server auth; (3) Composite Graph API for atomic Contact + Opp upsert in single call; (4) Real-time event-triggered sync — not hourly batch like Give Lively; (5) NPSP first, NPC in v2; (6) External ID upsert + email fallback deduplication; (7) Persistent job queue with exponential backoff + dead letter at attempt 5; (8) 7 custom External ID fields required in customer org; (9) Start AppExchange ISV Partner registration at Month 2 — listing live ~Month 6–8 given 4–6 month review timeline. 15% AppExchange Checkout revenue share likely doesn't affect Give's fee model (confirm with Salesforce legal).

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
| **Post-Launch Month 2** | Start Salesforce ISV Partner registration (parallel track) | Month 2 |
| **Post-Launch Month 2–3** | Salesforce MVP connector ships: NPSP, real-time, Contact + Opp + Campaign + Recurring | Month 2–3 |
| **Post-Launch Month 3** | Begin AppExchange managed package + security review prep | Month 3 |
| **Post-Launch Month 4–5** | Submit AppExchange security review | Month 4–5 |
| **Post-Launch Month 6** | GAU Allocations + P2P sync + event sync (Salesforce v1.5) | Month 6 |
| **Post-Launch Month 6–8** | AppExchange listing live (if review passes) | Month 6–8 |
| **Post-Launch Month 9–12** | NPC (Agentforce Nonprofit) support + bidirectional sync (Salesforce v2) | Month 9–12 |
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

### Salesforce Integration Research (2026-02-28)

Comprehensive research across 4 parallel agents: nonprofit Salesforce landscape, competitor integration analysis, AppExchange requirements, and technical architecture. Full design document at `docs/salesforce-integration.md`. Key findings:

**Market landscape:**
- ~40,000–55,000 nonprofits globally on Salesforce, ~3–4% overall US nonprofit penetration — concentrated in $1M–$10M+ revenue orgs
- NPSP (Nonprofit Success Pack) has 35,000+ users; feature dev ended March 2023 but no EOL. Still 95%+ of the installed base.
- Salesforce Nonprofit Cloud (NPC / Agentforce Nonprofit) launched Oct 2023 — only 25% of consulting firms have completed any NPC implementation. Future direction, minimal current adoption.
- Small nonprofits (<$500K revenue) are poor Salesforce fits due to $7K–$30K implementation costs

**Competitor matrix:**
- **Give Lively:** Free, AppExchange-listed (5.0★), NPSP-only, one-way, hourly batch sync — their #1 selling point, and their biggest weakness is the 60-min data lag
- **Givebutter:** Zapier only, no AppExchange listing — documented as their #1 weakness by independent reviewers
- **Classy/GoFundMe Pro:** $250/month, near-real-time, bidirectional (partial), NPSP + NPC, AppExchange (4.58★)
- **Donorbox:** $50/month, near-real-time, one-way, no AppExchange listing
- **Funraise:** Free, real-time, open-source managed package on AppExchange, NPSP + NPC — most technically modern

**Architecture decisions:**
- v1: External API connector (Give servers → Salesforce REST API). No managed package required to ship.
- JWT Bearer OAuth for server-to-server auth (no stored secrets)
- Composite Graph API for atomic Contact + Opportunity upsert in a single HTTP round-trip
- Real-time event-triggered sync (not hourly batch — beats Give Lively)
- 7 custom External ID fields in customer's Salesforce org for idempotent upserts
- Layered dedup: External ID primary → email lookup fallback → error queue for ambiguous matches
- Persistent job queue: pending → in_flight → done | error → dead letter (alert admin at attempt 5)
- NPSP first; abstract object-mapping layer for NPC in v2
- v2: Bidirectional via Salesforce CDC + Pub/Sub API (gRPC) — 72h event retention, replayable

**AppExchange strategy:**
- 4–6 months from partner registration to live listing
- $999 security review fee (paid app); plan $2,000 for one resubmission
- 15% AppExchange Checkout revenue share (likely doesn't affect Give's percentage-fee model — confirm with legal)
- Can ship API connector WITHOUT AppExchange listing — start ISV Partner registration at Month 2, listing live at Month 6–8
- Trust signal: AppExchange is the primary discovery channel for nonprofit Salesforce admins

**Priority change: P2 → P1 fast-follow.** Ship NPSP connector within 60–90 days of launch. Start AppExchange registration in parallel.

### Competitive UX Teardown (2026-02-28)
Deep analysis of all three main competitors' public-facing donation experiences. Full teardown at `docs/competitive-ux-teardown.md`. Key findings:

**Givebutter:**
- 10-step checkout flow (massive conversion friction)
- 15% default donor tip pre-selected, with BBB complaints and class action investigation
- $100 donation costs donors $118.60 with default tip + processing
- Generic yellow thank-you page, zero customization
- Manual payouts, no native Salesforce, 420px widget max width
- Strong points: supporter feed/donor wall, payment breadth, recurring upsell, dynamic suggested amounts

**Zeffy:**
- Single-page flow (good) but inserts 15-17% tip at payment step (bad)
- Nonprofits **cannot** modify or remove the tip suggestion — it's their sole revenue
- Embedded forms strip all branding (logo, images, description removed)
- Monday-only payouts, no API, no Salesforce, limited customization
- 87+ G2 review mentions of "surprise donations," "confusing process," and "donor drop-offs"
- Strong points: zero fees for nonprofits, quick setup, event ticketing

**Give Lively:**
- 3-page stepped form with breadcrumbs (best form architecture of the three)
- Tip toggle OFF by default (most ethical), but anchors at 9% when activated
- 5-7 day application-gated onboarding (gatekeeping, faith-based orgs denied)
- Only 2 templates, 1 brand color, no API, no built-in CRM
- Strong points: data persistence across refresh, ACH promotion, donor portal, Text-to-Donate, Shift4 option

**Product decisions informed by teardown:**
- 2-3 step checkout (beat Givebutter's 10, Zeffy's hidden tip, Give Lively's 3)
- Zero tip prompts — ever. This is our core differentiator.
- Fully branded, customizable thank-you page (exploit Givebutter's yellow weakness)
- Form data persistence across browser refresh (learn from Give Lively)
- 3+ embeddable widget types with full branding (beat all competitors)
- Dynamic suggested amounts with impact descriptions (learn from Givebutter)
- ACH promotion in payment selection (learn from Give Lively)
- Instant self-service signup (exploit Give Lively's 5-7 day wait)

Full research notes available on request. Key sources indexed from Givebutter.com, Zeffy.com, GiveLively.org, G2, Capterra, industry reports.

### AI-Native Platform Strategy Research (2026-02-28)

Comprehensive deep-dive into 8 AI application areas for Give. Key strategic conclusions:

**Immediate (Day 1 / MVP) AI features — no org data required:**
1. AI-optimized suggested donation amounts using contextual signals (device, location, time, referral source, page context)
2. AI-generated campaign page copy, appeal letters, thank-you emails (Claude API)
3. Smart defaults (donation frequency, cover-the-fee opt-in) based on anonymous behavioral data
4. Donation form A/B testing framework with automated winner selection

**Short-term (with minimal org data, ~3-6 months of platform data):**
5. RFM-based donor scoring (Recency, Frequency, Monetary)
6. Basic churn risk flags (no donation in X months relative to pattern)
7. Personalized re-engagement email timing and content
8. Campaign goal-setting recommendations based on platform-wide benchmarks

**Medium-term (with sufficient org + platform data, 6-12 months):**
9. Full propensity models: upgrade likelihood, major gift identification, churn prediction (gradient boosted trees)
10. Uplift modeling on donation forms (causal inference via R-learner — what Fundraise Up does)
11. Donor lifetime value prediction (requires 12-18 months of giving history)
12. Campaign success prediction using multimodal signals (text, images, timing)

**Long-term differentiators:**
13. AI virtual engagement officer (autonomous donor outreach at scale)
14. Cross-org anonymized data pool (platform-wide intelligence that improves for all orgs)
15. Grant writing assistant with funder matching
16. Board reporting automation with AI narrative generation

**Technical implementation plan:**
- Uplift modeling: Uber's CausalML (Python) or build TypeScript equivalent
- Donor scoring: scikit-learn gradient boosted trees or XGBoost, served via Python microservice
- Content generation: Claude API (Anthropic) with per-org system prompts incorporating brand voice examples
- Behavioral optimization: Custom A/B testing framework with multi-armed bandit for continuous optimization
- Cold start: Platform-wide anonymous behavioral aggregate as prior, progressive profiling via micro-interactions

**Key competitive insight:** Fundraise Up is the only competitor doing real ML (uplift modeling, causal inference). Everyone else is either LLM wrappers or marketing claims. Give can match Fundraise Up's approach at the form level from day 1 by using platform-wide anonymous data, then surpass them by combining real ML with LLM-powered content generation.

### Donorbox Data Export & Migration Analysis (2026-02-28)
Comprehensive analysis of Donorbox's data export formats, API endpoints, webhook events, and migration limitations. Key findings:
- **CSV Exports:** Three export types (Donations, Supporters, Recurring Plans) with customizable columns. Filterable by time period, payment status, intervals, payment source, currencies, campaigns, name/email.
- **API:** 6 REST endpoints (campaigns, donations, donors, plans, events, tickets/purchases). Basic auth (email + API key). 60 req/min rate limit. Pagination (50 default, 100 max). $17/mo add-on cost.
- **Donor API fields:** id, created_at, updated_at, first_name, last_name, email, phone, address, city, state, zip_code, country, employer, occupation, comment, donations_count, last_donation_at, total (currency + value).
- **Donation API fields:** campaign (id, name), donor (full contact), amount, formatted_amount, converted_amount, recurring, first_recurring_donation, amount_refunded, stripe_charge_id/paypal_transaction_id, status, donation_type, donation_date, anonymous_donation, gift_aid, designation, comment, donating_company, currency, converted_currency, processing_fee, utm_campaign, utm_source, plan_id + interval (recurring only), questions array.
- **Plans API fields:** id, campaign, donor, type, amount, payment_method, started_at, last_donation_date, next_donation_date, status. Intervals: 1W/2W/1M/3M/1Y.
- **Webhooks:** 3 event types (donation_completed, donation_updated, ticket_created). JSON payloads mirror API fields.
- **Non-exportable CRM data:** Communication records, donor segments/groups, donor timeline/activity history, internal notes, custom tags, receipt history, Donor Moments configs, duplicate merge history, offline transactions.
- **Migration constraints:** PayPal recurring not migratable. Stripe recurring takes 4-6 weeks. API requires paid add-on.
- **Takeaway for Give:** Core transactional data well-covered by API. CRM-layer data (notes, communications, tags, segments) has zero API exposure -- nonprofits migrating lose relationship history. Migration tool should ingest CSV exports + optionally verify via API.

### Classy (GoFundMe Pro) Data Export & Migration Analysis (2026-02-28)
Comprehensive analysis of Classy's data export formats, API endpoints, and migration limitations. Classy rebranded to GoFundMe Pro after GoFundMe acquisition.

- **CSV Exports:** All reports exportable as .CSV. Report types: Transactions, Supporters, Recurring Giving Plans, Campaigns, Attendees, Payouts, Live Events. Columns are fully customizable (add/remove/reorder). Custom question answers also exportable.
- **API:** RESTful API v2 at `api.classy.org/2.0`. OAuth 2.0 auth (client_id + client_secret → bearer token). Rate-limited (headers: X-RateLimit-Limit/Remaining/Reset). Paginated responses. SDKs: Node.js (classy-node), PHP, Python. Now documented at developers.gofundme.com.
- **API Resources (40+):** Organizations, Campaigns, Transactions, Supporters, Members, Recurring Donation Plans, Fundraising Pages, Fundraising Teams, Dedications, Designations, Questions, Answers, Registrations, Ticket Types, Promo Codes, Ecards, Posts, Stories, Updates, Comments, Likes, Feed Items, Messages, Assets, Blocks, Activities, Soft Credits, Appeal Sets, Donation Matching Plans, Groups, Workflows, Domain Masking.
- **Transaction/Donation fields:** Transaction ID, Purchased Date, Refunded Date, Donation Net Amount, Donation Gross Amount, Overhead Net Amount, Classy Fees Amount, Fees Amount, Raw Adjustment Amount, Raw Donation Gross Amount, Raw Flex Rate Amount, Raw Initial Gross Amount, Is Donor Covered Fee, Payment Method, Payment Type, Card Type, Card Last Four, Card Expiration, Currency Code, Transaction Status, Payment Processor Reference/Transaction ID, Payment Processor Response, Payment Processor Fees Amount, Billing First/Last Name, Billing Address 1/2, Billing City/State/Zip/Country, Updated Date, Created Date, Anonymous flag, Comment.
- **Transaction Item fields:** Transaction Item ID, Final Price, Raw Overhead Amount, Type, Product ID/Name, Quantity, Raw Price, Raw Final Price, Price, Designation ID/Name/Description/Program External ID, Recurring Donation Plan ID, Parent Transaction ID, Fundraising Campaign ID, Transaction Frequency.
- **Supporter/Donor fields:** Supporter ID, First Name, Last Name, Email, Address 1/2, City, State, Zip, Country, Phone, Gender.
- **Campaign/Registrant fields:** Campaign ID, Organization ID, Fundraising Team/Page ID, Member ID, Registrant ID/First Name/Last Name/Email/Address/City/State/Zip/Country/Phone/Mobile/Gender/Website/Blog/Date of Birth/TShirt Size, Total Gross Amount, Campaign Name, Fundraising Page Name/Status/Title, Team Name, Member Name/Email.
- **Dedication/Honoree fields:** DedicationID, DedicationType, DedicationFirstName/LastName/Name, DedicationMessage, DedicationEmailAddress, DedicationCity/State/PostalCode/Country/Address, DedicationIsGiftAmountMsgIncluded, HonoreeFirstName/LastName/HonoreeName.
- **Custom fields:** Supported via Q-prefixed columns for custom question answers.
- **Recurring Donation Plans:** API endpoint at `/recurring-donation-plans/{id}` with history endpoint. Reports include status (Active/Failing/Paused), amount, frequency, next charge date. Migration service available through Classy Professional Services -- uses PGP-encrypted token files transferred via SFTP. Standard 8-11% soft decline rate during migration.
- **Salesforce Integration Objects:** Custom objects synced: Classy Supporter, Gift Transaction, Recurring Donor, Related Entity (attendees/fundraising pages/teams), Custom Questions/Answers, Gift Transaction Designation, Gift Tribute. Maps to standard Contact/Account/Opportunity/Campaign objects in NPSP.
- **Data Layer/Analytics:** Google Tag Manager integration with events: classy_page_view, supporter_loaded, purchase, add_to_cart. Webhooks in open beta.
- **Non-exportable/lost data during migration:**
  - Campaign page designs, templates, and visual layouts (proprietary builder)
  - Email campaign content, templates, send history, and performance metrics
  - Message recipient lists and engagement stats
  - Supporter engagement scores and behavioral analytics
  - Page view counts and traffic analytics (must use GA4 separately)
  - Fundraising page/team page designs and customizations
  - Stripe payment tokens (require Classy-mediated PGP token migration process)
  - Workflow/automation configurations
  - Promo code usage history
  - Comment threads and social interactions (likes, feed items)
  - Domain masking configurations
  - Classy Mode / branded checkout settings
  - Internal credential sets and API app configurations
  - GoFundMe cross-platform donation data
- **Migration constraints:** Payment token migration requires Professional Services engagement (not self-service). Recurring donation migration involves PGP key exchange between old/new processors. Only active recurring plans should be migrated (expired cards, canceled plans excluded). Token migration takes ~1 month minimum. No bulk data export request process documented -- must use report exports + API.
- **Takeaway for Give:** Classy has a rich API (40+ resources, full CRUD) that makes automated migration feasible for transactional and supporter data. The migration challenge is primarily: (1) recurring payment token transfer (requires Classy PS engagement and processor coordination), (2) campaign page designs are proprietary and non-portable, (3) email/communication history and engagement analytics are not exportable. Our migration tool should target: CSV report imports for quick migration + API-based migration for verified, automated data pull. Recurring donor migration will require a guided process with Classy's team.

### Annual vs Monthly Billing Research (2026-02-28)
Comprehensive research on whether annual billing makes sense for a percentage-based fundraising platform. Covered competitor billing models, SaaS benchmarks, and hybrid pricing patterns.

**Competitor billing structures:**
- Givebutter: No subscription for core product (free with tips or 3% flat fee). Plus tier is contact-based ($29-$279/mo), no public annual discount.
- Donorbox: Hybrid model -- $80/mo or $820/yr (~15% annual discount) PLUS 1.75-2.95% platform fee per transaction.
- Classy/GoFundMe Pro: $299/mo + 2.2% platform fee. Annual terms negotiated via sales.
- Bloomerang: Annual billing only, $125/mo ($1,500/yr). Pure subscription, no percentage fees.
- Zeffy & Give Lively: Free (tip/philanthropy funded). No billing structure.

**SaaS annual discount benchmarks:**
- Median annual prepay discount: 18% (Vendr 2024 data)
- Most popular structure: "2 months free" (~16.7%)
- Sweet spot: 15-20% -- optimizes adoption (52-67%) while maintaining margins
- Discounts beyond 25% show diminishing returns (only +3 percentage points adoption, significant margin erosion)

**Annual billing churn impact:**
- Monthly subscribers churn 2-3x more than annual
- Annual subscribers have 43% higher LTV
- 5% monthly churn compounds to ~46% annual loss; annual plans show ~2.5% annual churn
- 22% of monthly users convert to annual if shown value within 90 days (SaaStr)

**Key finding for percentage-based models:**
- Pure percentage fees cannot be billed annually -- there is nothing to prepay when revenue is usage-based
- Industry standard: subscription component bills monthly/annually, transaction percentage always bills monthly in arrears
- 46-61% of SaaS companies use hybrid (subscription + usage) pricing
- Adding a flat fee just to enable annual billing changes core positioning

**Decision: Do NOT launch with annual billing.**
- "No monthly fees, just 1%" positioning is a killer differentiator -- do not dilute it
- No flat fee component exists to bill annually
- Engineering time (2-4 weeks for subscription billing) better spent on core features
- Revisit at month 6-12 when Pro tier feature differentiation may justify a flat fee
- If added later: ~17% discount (2 months free) on Pro flat fee only, transaction percentages remain usage-based

### 501(c)(3) Verification Research (2026-02-28)

Comprehensive research on IRS data sources, third-party APIs, competitor onboarding flows, and recommended implementation for Give's nonprofit verification during signup.

**IRS Data Sources -- All Free, No API Key Required**

IRS Publication 78 (Pub 78) is the primary verification source. It is the authoritative IRS list of organizations eligible to receive tax-deductible charitable contributions. Download: `https://apps.irs.gov/pub/epostcard/data-download-pub78.zip` (pipe-delimited ASCII). Updated monthly. Fields: EIN, org name, city, state, country, deductibility code. Code A = deductible (501(c)(3) public charities). Code B = not deductible. Code C = deductible by treaty (foreign orgs). If EIN is in Pub 78 with code A, org is confirmed eligible for tax-deductible donations. Covers ~1.5M orgs. Does NOT include churches (auto-exempt) or certain group-exempt subordinates.

IRS EO BMF (Exempt Organizations Business Master File) is a supplemental source covering all 1,935,635 tax-exempt organizations including 501(c)(4), 501(c)(6), etc. Download per state: `https://www.irs.gov/pub/irs-soi/eo_[STATE].csv`. Regional files: `eo1.csv` through `eo4.csv`. Updated monthly (last 02/10/2026). Fields: EIN, name, address, NTEE code, foundation type, ruling date, filing requirement, subsection code. No API -- CSV only.

IRS Auto-Revocation List is the block list of organizations whose tax-exempt status was automatically revoked for failing to file required annual returns for 3 consecutive years. Download: `https://apps.irs.gov/pub/epostcard/data-download-revocation.zip`. Updated monthly. Fields: EIN, name, location, exemption type, effective revocation date. Cross-check every signup EIN against this list and block or manually review any match.

IRS TEOS (apps.irs.gov/app/eos) provides individual web lookups but there is NO public machine-readable REST API. All programmatic access is via the bulk downloads above.

**Third-Party APIs**

Pactman Nonprofit Check Plus API is the recommended MVP shortcut. It aggregates IRS BMF + Pub 78 + OFAC + Auto-Revocation into a single EIN-lookup REST API. Launched May 2025; self-service portal added December 2025. Free tier: 200 checks/month, no credit card required. Paid: Premier and Custom tiers (pricing via sales). Returns 40+ fields as structured JSON. Ideal for MVP -- free tier covers early signup volume, no dependency on IRS file parsing. Plan to migrate to self-hosted IRS bulk data at ~200+ signups/month.

ProPublica Nonprofit Explorer API is useful for enrichment but not primary verification. `https://projects.propublica.org/nonprofits/api/v2` -- EIN lookup: `GET /organizations/{EIN}.json`. Free, no key required. Returns financial data, 990 filings back to 2001, executive compensation. Rate limits undocumented (25 results/page). Use post-signup to enrich nonprofit profiles for donor-facing transparency, not as the verification gate.

Candid/GuideStar API is overkill for basic verification. Essentials API: $4,800+/year. Charity Check API (IRS + state compliance): $2,750+/year. Premier API: $9,900+/year. Requires sales engagement; not self-serve. Do NOT use for basic verification when Pub 78 is free and authoritative. Consider Charity Check API only for a future Pro tier verified-badge or enterprise compliance product.

**Competitor Onboarding Flows**

Givebutter uses Candid for verification. Auto-approve requires org's Candid profile linked to EIN and signup email domain matching the Candid database URL. Fallback: upload IRS Determination Letter (1-3 business day manual review). Weakness: email domain matching fails for Gmail users; Candid dependency blocks orgs without a Candid profile.

Zeffy requires EIN + exact name match. Accepts all 501(c) categories -- not restricted to 501(c)(3). Low friction. Fiscal sponsors supported.

Give Lively auto-cross-references IRS EO BMF + Pub 78 + Auto-Revocation -- exactly the right sources. Restricted to 501(c)(3) public charities. Also checks California AG + CA Franchise Tax Board. 5-7 day manual review is their biggest weakness. Their data sources are right; their process is too slow. Give replicates the data sources with instant approval.

Stripe nonprofit processing discount (2.2% + $0.30) requires EIN or determination letter plus confirmation that >80% of volume is tax-deductible donations. Application via nonprofit@stripe.com -- manual. Opportunity: batch-apply on behalf of verified Give orgs during onboarding as a differentiator.

Donorbox accepts any EIN with no document upload -- near-zero verification bar. Not a model to follow.

**Edge Cases**

Churches are automatically tax-exempt and not required to appear in Pub 78 or EO BMF, though many do. Handling: self-certification checkbox, require EIN, flag for manual spot-check if absent from IRS databases.

Fiscal sponsors: require the sponsor's EIN (the verified 501(c)(3)), not the project's. Require upload of a fiscal sponsorship agreement. Follow Givebutter's parent-EIN + documentation model.

Foreign orgs: MVP is U.S.-only. Flag foreign country in IRS data and require manual review. Future: support via DAF partnership (CAF America, Myriad USA).

Orgs pending 501(c)(3) status: allow signup with EIN + self-attestation, hold payouts until verification completes, surface status prominently in dashboard.

501(c)(4) and other types: launch with 501(c)(3) only. Build path for c4/c5/c6 later with appropriate receipt language (donations not deductible).

**Ongoing Monitoring**

Re-query Pub 78 + auto-revocation annually for all active orgs. If an active org appears on the revocation list: pause new campaign creation, block donation forms, email org admin with explanation and reinstatement instructions, allow 30-day cure window before full suspension. Use ProPublica to flag orgs not filing a 990 in 3+ years as an early warning.

**Recommended Implementation**

Phase 1 -- MVP (Pactman API): (1) User enters EIN; (2) Pactman API lookup; (3) Pub 78 code A = auto-approve instantly; (4) Auto-revocation list match = block with message; (5) EO BMF only (non-501(c)(3)) = present org type, allow with different receipt language; (6) Not found = church self-certification, determination letter upload, or pending state. EIN is the deduplication key for the $10K free tier.

Phase 2 -- Self-host IRS bulk data (at ~200+ signups/month): Ingest Pub 78 + EO BMF + Auto-Revocation monthly. Store in PostgreSQL indexed on EIN. Run nightly diff to detect status changes on active Give accounts.

Cost comparison: IRS bulk data (self-hosted) = free, monthly. ProPublica API = free, monthly lag. Pactman free tier = 200/month free, paid above. Candid Charity Check = $2,750+/year. Candid Essentials = $4,800+/year. Decision: Pactman for MVP, self-hosted at scale. Never pay Candid for basic EIN verification.

### Salesforce Integration Architecture Research (2026-02-28)

Full technical research at `docs/salesforce-integration-research.md`. Covers REST API auth flows, CDC, Platform Events, Outbound Messages, NPSP/NPC object schemas, deduplication strategy, External IDs, and recommended connector architecture.

**Key findings summary:**

**Auth:** JWT Bearer Flow (RFC 7523) is the gold standard for server-to-server. Client uploads X.509 cert to Connected App; server signs JWT with private key; no stored secrets. Alternative: OAuth 2.0 Client Credentials flow (client_id + client_secret, simpler setup).

**API strategy:** REST API + sObject Collections for real-time donation sync (up to 200 records per call, PATCH by external ID). Composite Graph API for atomic multi-record operations (create Contact + Opportunity in one call). Bulk API 2.0 for initial imports (> 2,000 records, async). Enterprise Edition limit: 100,000 API calls/24h.

**CDC:** Salesforce broadcasts record changes to external subscribers via Pub/Sub API (gRPC + Apache Avro). External app subscribes to `/data/npe03__Recurring_DonationChangeEvent` etc. Available on Enterprise Edition (which Power of Us nonprofits receive for free). 72-hour event retention with replay. Use for future v2 Salesforce→Give sync.

**Platform Events vs CDC:** CDC is no-code and ideal for data replication outbound from Salesforce. Platform Events are developer-defined and support inbound (external→Salesforce) triggering. Use CDC for v2 outbound sync; skip Platform Events unless building a managed package.

**Outbound Messages:** SOAP-based, legacy. Workflow Rules deprecated (Winter '23+); Outbound Messages still work via Flow Builder. Not recommended — use CDC instead.

**NPSP object model:** Contact (donor), Household Account (auto-created by NPSP), Opportunity (donation — must have `StageName="Closed Won"` to trigger rollups), `npe03__Recurring_Donation__c` (recurring plan), `npsp__Allocation__c` (fund designation split), `npe01__OppPayment__c` (payment record with Stripe charge ID). NPSP auto-creates Payment and installment Opportunities.

**NPC object model:** Different from NPSP. `GiftTransaction` (not Opportunity), `GiftCommitment` (not npe03__), `GiftTransactionDesignation`, `DonorGiftSummary`. Person Accounts (not Contact + HH Account). Business Process API (BPAPI) available for third-party integrators. NPC adoption still < NPSP — build NPSP first.

**Dedup strategy:** External ID (Give_Donor_ID__c) as primary key for idempotent upserts. Email lookup as fallback when no external ID exists. Flag multi-match cases to review queue. Native Salesforce Duplicate Management as supplemental layer.

**External ID fields to create (7):** `Give_Donor_ID__c` on Contact, `Give_Donation_ID__c` + `Give_Charge_ID__c` on Opportunity, `Give_Plan_ID__c` on Recurring Donation, `Give_Payment_ID__c` on Payment, `Give_Fund_ID__c` on GAU, `Give_Campaign_ID__c` on Campaign. All Text(255), ExternalID, Unique.

**Connector architecture:** External API connector (Give's servers call Salesforce API). Persistent job queue (Postgres or Redis) with exponential backoff (5 attempts, dead-letter after). One OAuth token record per connected Salesforce org, encrypted at rest. Sync sequence per donation: (1) upsert Contact, (2) upsert Opportunity, (3) upsert Payment, (4) upsert Allocations if designated — wrap in Composite Graph for single round-trip.

---

## 14. AI Strategy — Core Platform Pillar

> **Thesis:** Give is not a fundraising platform with AI features. It is an AI-native fundraising platform. Every workflow has AI woven into it. Removing the AI would break the product. This is the primary long-term moat — built from day one, not bolted on later.

### The Market Gap

| Tier | Platform | Real AI? | Price |
|------|---------|---------|-------|
| Enterprise | Blackbaud, Bonterra | Yes (agentic, autonomous) | $999+/mo |
| Mid-market | GoFundMe Pro | Yes (190M donor ML model) | $299/mo + 2.2% |
| Premium | Fundraise Up | Yes (uplift modeling, causal inference) | 4% fee |
| **SMB (our market)** | **Givebutter, Zeffy, Donorbox, Give Lively** | **No. Zero real AI.** | **0–1.75%** |

**The opportunity:** First platform in the SMB tier with real AI — genuine ML optimization and agentic workflows included at 1–2%.

**Fundraise Up proves the model:** AI-optimized forms achieve +26.76% recurring conversion, +4.2% avg donation, 87% fee coverage opt-in. They charge 4%. We include it at 2%.

---

### Philosophy: Three AI Layers

```
Layer 1 — ALWAYS ON (silent, zero user interaction)
  Every form optimizes itself. Every donation triggers enrichment.
  Every payment failure queues a recovery sequence.

Layer 2 — SURFACED (proactive insights, human reviews and approves)
  Dashboard shows AI narratives, not just charts.
  "3 donors about to lapse — here's who to call."
  AI drafts the email; user sends it.

Layer 3 — CONVERSATIONAL (on-demand, open-ended)
  "Why did Q4 donations drop?"
  "Draft an end-of-year appeal for donors who gave $500+ last year."
  "Show me donors who attended our gala but haven't given online."
```

---

### Feature Inventory

#### A. Donation Forms (Layer 1 — Always On)

**Smart Suggested Amounts** *(Pro, MVP)*
- Personalize the 3–4 amounts per visitor: device, referral source, time of day, geography, org's historical distribution
- Cold start: cross-platform NTEE category benchmarks; warm (100+ donations): per-org model refreshed nightly
- Served at edge — zero added latency
- Fundraise Up result: +4.2% average donation

**Recurring Conversion Uplift** *(Pro, MVP)*
- Uplift modeling (causal inference, not classification) — only show monthly-first to the ~20% "Upgraders" where the intervention actually causes conversion
- Implementation: R-learner (Uber's CausalML library); cross-platform anonymized data bootstraps cold start
- Fundraise Up result: +26.76% recurring conversion, zero decline in one-time donations

**Adaptive Fee Coverage** *(Basic, MVP)*
- Optimize fee coverage presentation: placement, copy, default state
- Fundraise Up achieves 87% opt-in vs ~40% with standard checkbox

**Fraud Detection** *(Basic, MVP)*
- Pre-Stripe layer: catch card testing and bot attacks before hitting Stripe Radar
- Platform-wide fraud signal sharing (org-anonymized)

**Form A/B Optimization** *(Pro, Round 1)*
- Auto-test headline, impact statement, amount layout, button text
- AI evaluates variants and allocates traffic to winners

#### B. Donor CRM (Layer 2 — Surfaced Insights)

**Donor Health Score** *(Pro, Round 1)*
- 0–100 score per donor synthesizing: giving recency, frequency, amount trend, email engagement, event attendance, recurring status
- Updates after every interaction; displayed as colored indicator on every record

**Churn Prediction** *(Pro, Round 1)*
- Flag lapse risk 60–90 days before it happens
- Dashboard: "3 donors at churn risk" → one-click → who, why, and a drafted re-engagement email
- Research benchmark: 12% avg retention improvement with AI-timed interventions

**Smart Segmentation** *(Pro, Round 1)*
- AI auto-creates and maintains: Major Gift Prospects, Lapsed Recurring, Upgrade Candidates, First-Time Givers, Event-Only Donors
- Real-time updates as donor behavior changes

**Donor Enrichment Agent** *(Pro, Round 1)*
- Triggered on every new donor: employer lookup, public records, giving capacity tier, philanthropic interests
- Org-controlled opt-in; disclosed in privacy policy

**Natural Language Queries** *(Pro, Round 1)*
- "Show donors who gave $500+ last year but not yet this year" → instant filtered table
- Claude API with database tool use; no filter UI required

**Suggested Next Actions** *(Pro, Round 1)*
- Per-donor card: "Jane gave her largest gift 11 months ago — overdue for a personal thank-you. Draft one?"
- One-click: draft email, log call, add task

#### C. Campaign Builder (Layer 2 + Layer 3)

**AI Campaign Launch Assistant** *(Pro, MVP)*
- Org describes campaign in one sentence → AI generates: headline, story, impact statement, goal amount, suggested amounts, social share copy
- Brand voice: few-shot prompted with org's existing content (website, past campaigns)
- Everything is a starting point — org edits freely

**Goal Prediction** *(Pro, Round 1)*
- "Based on your donor base and past campaigns: $18K–$24K in 30 days"
- Updates daily; "You're 23% behind pace — here's what similar orgs do to recover"

**Campaign Performance Narrative** *(Pro, Round 1)*
- Daily AI-written summary — not charts, actual interpretation
- "Day 7: $8,400 raised. 18% first-time givers. Recurring below your average — consider promoting monthly."

#### D. Communications (Layer 1 + Layer 2)

**Zero-Prompt Thank-You Drafts** *(Pro, MVP)*
- Superhuman pattern: every donation automatically generates a draft personalized thank-you — waiting in the queue, no prompting required
- Personalized by: gift amount, first/recurring/upgrade, campaign, donor history ("Your 4th gift this year…")
- **AI drafts. Human approves. Never auto-sends. Non-negotiable.**

**Automated Receipt Personalization** *(Basic, MVP)*
- Tax receipts include personalized language: first-time welcome, milestone recognition, recurring anniversary acknowledgment

**Appeal Generator** *(Pro, Round 1)*
- Full email series from a brief: initial ask, mid-campaign, final-day urgency, post-campaign thank-you
- Subject line variants for A/B testing included

**Re-Engagement Sequences** *(Pro, Round 1)*
- Churn-flagged donor → AI drafts 3-email sequence → org approves → activates
- If donor responds: sequence pauses, org notified

#### E. Dashboard — Narrative Intelligence (Layer 2)

**Daily Digest / Morning Briefing** *(Pro, Round 1)*
- Replaces chart staring with a narrative: "Good morning. Yesterday: 12 donations, $1,840. Maria upgraded to monthly. David's recurring payment failed — recovery email drafted."
- Written from actual data every morning. Like a development assistant who reviewed everything overnight.

**Anomaly Detection** *(Pro, Round 1)*
- Alert if donation volume drops 20%+ vs trailing 4-week average, churn spikes, or campaign underperforms
- Every alert: what happened, likely causes, recommended action

**Benchmark Comparison** *(Pro, Round 1)*
- "Your avg gift is $87 — 12% above average for food banks your size"
- "Your recurring rate is 18% — below the 26% average. Here's how to improve it."
- Powered by anonymized aggregate data across all Give orgs

#### F. Onboarding (Layer 1)

**EIN Auto-Lookup** *(Basic, MVP)*
- Enter EIN → auto-fill org name, address, ruling date, NTEE code from IRS Business Master File

**Domain Enrichment** *(Basic, MVP)*
- Extract logo, brand colors, description from org's website — form looks professional in 60 seconds

**Conversational Onboarding** *(Pro, MVP)*
- AI guide replaces multi-step wizard: "I see you're an education nonprofit in Portland. Set up your form with your colors and logo. Want me to suggest impact statements?"

**Migration Assistant** *(Basic, Round 1)*
- Upload competitor CSV → AI maps columns, flags issues, previews → "847 donors found. 23 duplicate emails — here's how I'd resolve them. Ready to import?"

#### G. Campaign Marketing Tools (Layer 2 + Layer 3)

The full campaign marketing suite — not just the donation form, but everything the org needs to drive traffic to it. Nonprofits spend hours on this manually. AI makes it instant.

**Social Media Content Generator** *(Pro, Round 1)*
- Campaign launch → AI generates a full social media pack: Facebook post, Instagram caption, LinkedIn update, Twitter/X thread, story script
- Milestone auto-posts: "We hit 50% of goal!" → AI drafts celebratory post with donor stats, ready to copy-paste or schedule
- Donor spotlight generator: "47 donors gave this week — draft a thank-you post" → AI writes it, org approves
- Platform-specific tone: LinkedIn is professional, Instagram is warm, X is punchy — AI adapts copy per platform
- Hashtag suggestions based on campaign type and org category

**Ad Creative Generator** *(Pro, Round 1)*
- Facebook/Instagram ad copy: headline (40 chars), primary text (125 chars), description — multiple variants for A/B testing
- Google Ads copy: 3 headlines (30 chars each) + 2 descriptions (90 chars each) — formatted exactly for Google Ads interface
- AI generates 3–5 variants per ad type; org picks favorites or runs all as a test
- Ad creative brief for visuals: "Hero image should show [specific scene]. Mood: warm, hopeful. Avoid stock photo clichés. Color palette: [org colors]." Paired with every ad copy set so designers or Canva users know exactly what to create.
- All copy grounded in the campaign's actual goal, story, and impact data from Give

**Google Ad Grants Optimizer** *(Pro, Round 2)*
- Nonprofits get $10K/month in free Google Ads via Google Ad Grants — but 90%+ waste most of it
- AI manages the grant: keyword research, ad group structure, bid optimization, Quality Score improvement
- Identifies high-intent keywords ("donate to food bank Portland", "[org name] volunteer") vs wasteful broad terms
- Generates compliant ad copy (Google Ad Grants has strict CTR requirements — must maintain >5% CTR or account is suspended)
- Weekly performance report: spend used, clicks, conversions, wasted spend recovered
- This alone justifies the Pro tier for any nonprofit using Google Ad Grants

**Email Campaign Builder** *(Pro, Round 1)*
- Full multi-email sequences, not one-off appeals
- Campaign types: Year-End Appeal, Giving Tuesday, Event Promotion, Monthly Recurring Push, Major Donor Cultivation, Lapsed Donor Reactivation
- Each sequence: 3–6 emails with optimal send timing, subject lines, preview text, body copy, CTA
- Segmented variants: the same campaign generates different copy for major donors, first-time donors, recurring donors, lapsed donors — each feels personal
- Subject line A/B variants: 2–3 options per email with AI-predicted open rate based on org's historical open rates
- All emails pull real data: campaign stats, donor name, giving history, impact statements

**Giving Tuesday Campaign Kit** *(Pro, Round 1)*
- Giving Tuesday is the single highest-volume fundraising day for most nonprofits
- One-click kit generation: donation page config, full social media calendar (30 days of posts), email sequence (pre-launch, day-of countdown, day-of launch, mid-day update, final hours, thank-you), ad copy pack, matching gift ask template
- Org provides: campaign goal, matching gift partner (if any), key program to highlight
- AI handles everything else

**Matching Gift Detection & Prompts** *(Pro, Round 2)*
- On checkout, detect if donor's employer offers matching gifts (database of 30K+ companies)
- Auto-generate matching gift submission instructions personalized to the donor's employer
- Post-donation email includes: "Your employer [Company] matches gifts! Here's how to double your impact: [specific steps]"
- Track and remind if donor hasn't submitted their match within 30 days

#### H. Operational AI (Layer 3)

**Board Report Generator** *(Pro, Round 2)*
- "Generate our Q3 board report" → 2-page PDF narrative with charts; org reviews before distributing

**Grant Writing Assistant** *(Pro, Round 2)*
- Upload RFP → AI drafts narrative sections grounded in org's actual Give data

**Financial Forecasting** *(Pro, Round 2)*
- "At your current pace: $340K this year — $40K below goal. To close the gap: increase monthly giving 15% or run one more campaign."

---

### Agent Architecture

```
EVENT BUS (BullMQ / Redis)
  donation.created      → enrichment_agent, thank_you_draft_agent
  payment.failed        → recovery_agent
  donor.at_risk         → reengagement_agent
  campaign.launched     → monitoring_agent, marketing_kit_agent
  campaign.milestone    → social_post_draft_agent (50%, 75%, goal hit)
  giving_tuesday.30days → campaign_kit_agent

Background Agents        Scheduled (Cron)       Interactive Agent
• Enrichment             • Daily digest          • "Ask Give" chat UI
• Recovery drafts        • Churn scan            • Natural language queries
• Fraud pre-screen       • Form config refresh   • Report generation
• Thank-you draft gen    • Anomaly detection     • Campaign AI assistant
• Social milestone posts • Benchmark compute     • Ad creative generator
• Matching gift detect   • Ad Grants optimizer   • Email sequence builder

                    ↓ all route through ↓

                       Claude API
                    Haiku  → high-volume simple tasks
                    Sonnet → standard generative tasks
                    Opus   → complex reasoning, reports
```

---

### Tech Stack (AI Layer)

| Component | Technology |
|-----------|-----------|
| LLM | Claude API (Anthropic) |
| Chat / streaming in Next.js | Vercel AI SDK v4 |
| Background agent queue | BullMQ (Redis) |
| Uplift modeling (recurring conv.) | CausalML (Uber OSS) + Python microservice |
| Vector / semantic search | pgvector (PostgreSQL extension) |
| Per-org AI memory | pgvector + structured JSON in PostgreSQL |
| Edge-served form config | Cloudflare Workers / Vercel Edge |

---

### Cold Start Strategy

New orgs have zero historical data. AI must work on day 1.

| Phase | Data | AI Behavior |
|-------|------|-------------|
| Day 1 (0 donations) | None | NTEE benchmarks for amounts; content gen from org description; platform-wide fraud signals |
| 50+ donations | Early | Per-org amount distribution; A/B testing activates; churn baseline established |
| 500+ donations | Meaningful | Full per-org ML; uplift model calibrated; meaningful benchmarks |

**The flywheel:** Every donation is training data. Cross-org models improve as Give scales. Competitors can't copy this without the same user base.

---

### New Database Tables Required

```sql
-- Behavioral events (ML training data)
ai_events (id, org_id, donor_id, form_id, event_type, properties jsonb, created_at)
-- event_type: form_view, amount_selected, fee_covered, recurring_shown, recurring_converted

-- Pre-computed form config (refreshed nightly, served at edge)
ai_form_config (org_id, form_id, suggested_amounts jsonb, uplift_threshold float, updated_at)

-- Donor AI scores (refreshed nightly)
donor_scores (donor_id, org_id, health_score int, churn_risk float,
              upgrade_prob float, enrichment jsonb, updated_at)

-- AI-generated drafts awaiting review
ai_drafts (id, org_id, donor_id, draft_type, content text,
           metadata jsonb, status, created_at)
-- draft_type: thank_you, appeal, receipt, reengagement, board_report

-- Per-org AI memory (conversational agent persistent context)
org_ai_memory (org_id, memory_key, content text,
               embedding vector(1536), updated_at)
```

---

### Pricing / Tier Placement

| Feature | Basic (1%) | Pro (2%) |
|---------|-----------|---------|
| EIN auto-lookup + domain enrichment | ✓ | ✓ |
| Adaptive fee coverage | ✓ | ✓ |
| Personalized receipt language | ✓ | ✓ |
| Fraud detection (pre-Stripe) | ✓ | ✓ |
| Smart suggested amounts | — | ✓ |
| Recurring conversion uplift | — | ✓ |
| Zero-prompt thank-you drafts | — | ✓ |
| Conversational onboarding | — | ✓ |
| Campaign launch AI assistant | — | ✓ |
| Donor health scores | — | ✓ |
| Churn prediction + alerts | — | ✓ |
| Smart segmentation | — | ✓ |
| Donor enrichment agent | — | ✓ |
| Natural language queries | — | ✓ |
| Daily digest / morning briefing | — | ✓ |
| Anomaly detection | — | ✓ |
| Benchmark comparison | — | ✓ |
| Appeal generator | — | ✓ |
| Re-engagement sequences | — | ✓ |
| "Ask Give" chat interface | — | ✓ |
| Social media content generator | — | Round 1 |
| Ad creative generator (FB/IG/Google) | — | Round 1 |
| Email campaign builder (sequences) | — | Round 1 |
| Giving Tuesday campaign kit | — | Round 1 |
| Google Ad Grants optimizer | — | Round 2 |
| Matching gift detection + prompts | — | Round 2 |
| Board report generator | — | Round 2 |
| Grant writing assistant | — | Round 2 |
| Financial forecasting | — | Round 2 |

**The pitch:** "Smart suggested amounts increase average gifts 4%. Recurring uplift increases monthly conversion 26%. The extra 1% Pro fee costs you nothing — the AI earns its keep."

---

### Hard Rules (Non-Negotiable)

1. **AI drafts. Humans send.** No AI feature sends an email, takes an action, or contacts a donor without explicit org approval. One wrong email to a major donor is catastrophic.
2. **Every output is grounded in real data.** No hallucinated stats or projections. Every number traces back to actual Give data.
3. **Show the reasoning.** "Flagged as churn risk because: last donation was 287 days ago (avg: 94 days), email open rate dropped from 68% to 12%." Trust is built through transparency.
4. **Chat accelerates, never gates.** Donor list, dashboard, and campaign tools work perfectly without AI. AI makes them faster and smarter — never the only path.

### MVP Revised (Every Feature Has AI Baked In)

| Original MVP Feature | AI Layer Added |
|---------------------|----------------|
| Donation forms | Smart amounts + adaptive fee coverage + fraud detection |
| Payment processing | Fraud pre-screening + intelligent card retry |
| Automatic payouts | Anomaly alert if payout amount is unusual |
| Cover-the-fee checkbox | AI-optimized copy and placement |
| Tax receipts | Personalized acknowledgment language |
| Nonprofit onboarding | EIN auto-lookup + domain enrichment + conversational setup |
| Org dashboard | Daily narrative digest + anomaly detection |
| Salesforce integration | AI maps field conflicts and suggests resolutions |

---

## Changelog

| Date | Update | Terminal/Session |
|------|--------|-----------------|
| 2026-02-28 | **AI Strategy (Section 14) written.** Deep research across 4 parallel agents: competitor AI audit (15+ platforms), AI-first SaaS patterns, donor engagement AI, technical agent architecture. Core finding: no SMB fundraising platform has real AI — Givebutter/Zeffy/Donorbox have zero. Fundraise Up proves the model at 4% (we do it at 2%). Full AI feature inventory documented across 7 product areas: donation forms (smart amounts, uplift modeling, adaptive fee coverage), donor CRM (health scores, churn prediction, enrichment agent, NL queries), campaigns (launch assistant, goal prediction, narrative reporting), communications (zero-prompt thank-you drafts, appeal generator, re-engagement sequences), dashboard (daily digest, anomaly detection, benchmarks), onboarding (EIN lookup, domain enrichment, conversational setup), and operational AI (board reports, grant writing, forecasting). Agent architecture documented (BullMQ event bus, background/scheduled/interactive agents, Claude API with model routing Haiku/Sonnet/Opus). New DB tables defined (ai_events, ai_form_config, donor_scores, ai_drafts, org_ai_memory). Cold start strategy documented. **Decision: AI is a core product pillar, not a feature tier. Every MVP feature now has an AI layer.** | Strategy session |
| 2026-02-28 | Initial planning document created. Competitive research complete. Feature prioritization drafted. | Initial session |
| 2026-02-28 | Monorepo initialized (Turborepo + pnpm). Shared types/fee calc package created. Prisma schema designed (orgs, users, donors, donations, campaigns). | Initial session |
| 2026-02-28 | Backend API complete: Hono server, 5 route groups (health, orgs, campaigns, donations, stripe), Stripe Connect integration, webhook handling, fee calculation. | Initial session |
| 2026-02-28 | Documentation (Mintlify) and changelog/roadmap (Featurebase) platforms decided. Docs scaffolding started. | Initial session |
| 2026-02-28 | Frontend scaffolding in progress: Next.js 15, landing page, donation form, dashboard, donor/campaign pages. | Initial session |
| 2026-02-28 | Frontend COMPLETE: Landing page (hero, features, pricing, comparison table), donation page with fee calculator, dashboard (overview, campaigns, donors), DonationForm + GoalThermometer components, API client. | Initial session |
| 2026-02-28 | Mintlify docs COMPLETE: 25 pages — intro, quickstart, pricing, 6 guides, 4 integration pages, 12 API reference pages. mint.json configured with full navigation. | Initial session |
| 2026-02-28 | ALL packages type-check clean (zero TS errors across shared, db, api, web). Prisma client generated. Project ready for `pnpm dev`. | Initial session |
| 2026-02-28 | **Donorbox export/migration competitor analysis.** Documented CSV exports (Donations, Supporters, Recurring Plans), API endpoints (6 resources, basic auth, 60 req/min, $17/mo add-on), field-level response details for all endpoints, webhook events (3 types), and non-exportable CRM data (notes, communications, tags, segments, timeline). Informs Round 1 migration tool. | Research session |
| 2026-02-28 | **Annual vs monthly billing research.** Competitor billing models (Givebutter, Donorbox, Classy, Bloomerang, Zeffy, Give Lively), SaaS discount benchmarks (median 18%), churn impact data (annual subs churn 2-3x less), hybrid pricing patterns. **Decision: Do not launch with annual billing.** Pure percentage model has no flat fee to bill annually. Revisit at month 6-12. | Research session |
| 2026-02-28 | **Classy (GoFundMe Pro) export/migration competitor analysis.** Documented CSV export types (7 report types with customizable columns), API v2 (40+ resources, OAuth 2.0, SDKs for Node/PHP/Python), field-level details for transactions (30+ fields), supporters (11 fields), transaction items, dedications, campaigns, registrants. Mapped Salesforce integration objects. Identified non-exportable data (page designs, email history, engagement analytics, payment tokens, workflows, social interactions). Key finding: richest API of competitors analyzed so far, but recurring donor token migration requires Professional Services engagement (~1 month). | Research session |
| 2026-02-28 | **Beta launch strategy drafted** (`docs/beta-strategy.md`). Includes: beta invitation email, community pitch blurbs (Reddit/Slack/LinkedIn), ideal beta nonprofit profile (size, pain points, composition), research on where nonprofit tech decision-makers hang out (Reddit, FB groups, Slack, conferences, newsletters — prioritized into 3 tiers), and beta signup landing page spec (fields, wireframe, CTA, post-signup flow). Beta offer: $0 fees during beta, 1% rate locked in permanently, direct founder access. Target: 15-20 orgs, mix of Salesforce and non-SF, sourced from competitor platforms. | Beta planning session |
| 2026-02-28 | **501(c)(3) verification research.** Comprehensive analysis of IRS data sources (Pub 78, EO BMF, Auto-Revocation -- all free, all bulk CSV, all monthly), third-party APIs (Pactman free tier recommended for MVP; ProPublica for enrichment; Candid/GuideStar too expensive for basic verification), competitor onboarding (Givebutter uses Candid + email domain match; Zeffy uses EIN + name match; Give Lively uses IRS bulk data but 5-7 day review; Stripe nonprofit discount is manual email). Edge cases: churches (self-certify), fiscal sponsors (parent EIN + agreement upload), pending orgs (allow with held payouts), 501(c)(4) (launch without). **Decision: EIN + Pub 78 auto-approve for MVP using Pactman free tier (200/month); self-host IRS bulk data at scale.** Open question resolved: do verify 501(c)(3) status -- required for correct donor receipt language and platform trust. | Research session |
| 2026-02-28 | **AI in nonprofit fundraising — comprehensive competitor research.** Mapped AI features across 15+ platforms. Key findings: Fundraise Up is the clear AI leader (uplift modeling, causal inference, 100+ data points per visitor, +26.76% recurring conversion, +4.2% avg donation). GoFundMe Pro has "Intelligent Ask Amounts" trained on 190M donors / $40B data (+7% revenue lift). Bloomerang has AI engagement scoring (0-100) + generative AI email assistant. Blackbaud launched "Agents for Good" autonomous donor cultivation agent (EAP Q4 2025). Bonterra launched "Que" agentic AI (built on decade of predictive models). Donorbox has "Jay AI" conversational analytics. Funraise has AppealAI + ML suggested amounts. Most competitors' "AI" is either (a) genuinely real ML (Fundraise Up, GoFundMe Pro, Dataro, DonorSearch), (b) LLM wrappers for content generation (Bloomerang, Donorbox, Funraise), or (c) marketing vaporware (Zeffy, Give Lively). Biggest opportunity for Give: AI-native form optimization from day one — no competitor below the enterprise tier does real-time causal inference on donation forms. | Research session |
| 2026-02-28 | **Privacy Policy & Terms of Service legal research.** Comprehensive analysis of: (1) Applicable US laws (CCPA/CPRA, CAN-SPAM, COPPA, 20+ state privacy laws including NE which has no threshold), (2) 19 required/recommended privacy policy clauses with specific language, (3) 15 ToS clause recommendations, (4) Full competitor analysis of Givebutter and Zeffy ToS and privacy policies — key finding: Givebutter punts on CCPA, has no data retention policy, no GDPR provisions; Zeffy is more compliant (GDPR, CCPA, PIPEDA) but lacks specifics, (5) Donor data ownership strategy — recommend explicit "nonprofits own their data" clause as competitive differentiator, (6) Stripe Connect required disclosures identified, (7) PCI compliance language drafted, (8) Data retention periods recommended (7 years for donation records, 30-day export window on exit), (9) State-by-state regulatory analysis with thresholds. Key decisions: binding arbitration with class action waiver (industry standard), CCPA-compliant from day 1, free data export as differentiator. | Legal research session |
| 2026-02-28 | **Deep AI strategy research for AI-native fundraising platform.** 8 research areas: (1) Donor scoring/propensity models — RFM baseline, ML with 146-400 features (Dataro), gradient boosted trees best for tabular donor data, 75%+ churn prediction accuracy achievable; (2) Dynamic donation amount optimization — Fundraise Up uses uplift modeling (R-learner/causal inference) not classification, +4.2% avg donation, +26.76% recurring conversion; anchoring research shows 3-5 suggested amounts yield 100%+ uplift, prefilled amounts +20%; (3) Donor retention AI — churn models on 0-1 scale, 12% avg retention improvement, optimal re-engagement starts months before lapse date; (4) AI content generation — Claude API for appeals/emails/campaigns, few-shot prompting with org examples maintains brand voice, 47% of fundraisers see AI as biggest opportunity; (5) Conversational AI — chatbots on donation pages show 25-40% donation increase, 82% more likely to donate with live chat engagement; (6) Operations AI — automated 990 filing, grant writing 3x faster, board reporting, financial forecasting; (7) Campaign prediction — ML achieves 60-72% accuracy on campaign success, linguistic/emotional signals strongest predictors; (8) Cold start strategy — day-1 features (content generation, behavioral nudges, contextual signals), progressive profiling, cross-org aggregate models. **Key strategic decisions:** Use Uber's CausalML library for uplift modeling on donation forms. Claude API for all generative features. RFM + gradient boosted trees for donor scoring. Platform-wide anonymous behavioral data pool solves cold start for new orgs. | AI research session |
| 2026-02-28 | **Migration tooling research complete** (`docs/migration-research.md`). Analyzed data export capabilities of 5 competitors (Givebutter, Zeffy, Donorbox, Give Lively, Classy). Key findings: (1) All platforms export CSV — our universal common denominator. (2) API access varies: Classy has 40+ resources, Givebutter has usable REST API, Donorbox has paid API ($17/mo), Zeffy and Give Lively have zero API. (3) Recurring donation migration is hardest problem — payment tokens are platform-specific, Stripe-to-Stripe transfers possible but complex, PayPal recurring cannot migrate. (4) Schema gaps identified: Donor model needs address, company, notes fields; Donation needs UTM tracking, comments, external IDs; DonationFrequency needs WEEKLY variant. Designed universal CSV import templates (donors, donations, campaigns) with auto-detection logic to identify source platform from column headers. Mapped all 5 competitors' export fields to our Prisma schema. Defined 4-phase implementation plan: Phase 1 CSV import, Phase 2 API migration (Givebutter/Classy/Donorbox), Phase 3 Stripe recurring migration, Phase 4 one-click wizard. | Migration research session |
| 2026-02-28 | **Business model decisions — all 5 resolved** (`docs/business-decisions.md`). (1) Company structure: CA LLC, convert to DE C-Corp when VC/options needed, S-Corp election at $70K+ profit. (2) Donor fee coverage: opt-in (unchecked) by default, org-configurable, impact-first copy. (3) Free tier: first $10K in donations fee-free per org (EIN-deduplicated), $100 CAC vs $702 industry avg. (4) Enterprise: $2M+ trigger, 0.75%/0.5%/custom tiers, $0 monthly, published pricing. (5) Annual billing: do not launch; revisit at month 6-12. | Business planning session |
| 2026-02-28 | **Competitive UX teardown complete** (`docs/competitive-ux-teardown.md`). Deep analysis of Givebutter, Zeffy, and Give Lively donor-facing experiences across 5 dimensions: donation forms, campaign pages, tip/fee UX, embeddable widgets, and strengths/weaknesses. Key findings: (1) Givebutter's 10-step checkout is a conversion killer; 15% default tip + processing costs donors 18.6% extra on $100; class action investigation ongoing; fixed yellow thank-you page; manual payouts. (2) Zeffy's 15-17% default tip is their sole revenue and nonprofits cannot modify it; embedded forms strip all branding; Monday-only payouts; no API. (3) Give Lively's 3-page form with data persistence is best-in-class; tip toggle OFF by default (most ethical); but 5-7 day application gatekeeping, only 2 templates, 1 brand color, no API. **7 product decisions made:** 2-3 step checkout, zero tip prompts, branded thank-you page, form data persistence, 3+ widget types, dynamic suggested amounts, ACH promotion. Full competitive messaging matrix drafted. | UX research session |
| 2026-02-28 | **AI Strategy (Section 14) written + Campaign Marketing Tools added.** Core AI strategy documented: three-layer framework (always-on ML, surfaced insights, conversational agent). 8 product area feature inventory. Agent architecture (BullMQ event bus, background/scheduled/interactive). Cold start strategy. New DB tables. Pricing table. Campaign marketing tools added as Section G: social media content generator (platform-specific, milestone auto-posts), ad creative generator (FB/IG/Google Ads formatted), Google Ad Grants optimizer ($10K/month nonprofit grant — 90%+ of nonprofits waste it), email campaign builder (segmented sequences), Giving Tuesday campaign kit (one-click full kit), matching gift detection. Agent architecture extended with campaign.milestone and giving_tuesday triggers. | Strategy session |
| 2026-02-28 | **GitHub + Vercel CI/CD setup.** GitHub repo created at dustinmcole/give (private). Branch protection conventions documented in GITHUB.md. GitHub Actions CI pipeline (type check + build on every PR). Vercel project give-web configured: root dir `apps/web`, framework Next.js, custom install/build commands for monorepo, auto-deploy on push to main, preview deployments on PRs. CI passing (TypeScript + Next.js build clean). | Deployment session |
| 2026-02-28 | **State charitable solicitation registration research (platform/intermediary).** Comprehensive 50-state + DC analysis of whether Give must register as a professional fundraiser, professional solicitor, fundraising counsel, commercial co-venturer, or charitable fundraising platform. Full state-by-state matrix with statutes, bond amounts, and filing requirements. Key finding: Give likely qualifies as "professional solicitor/fundraiser" in ~38-40 states because it receives/controls funds via Stripe Connect application fees. Must also register as "Charitable Fundraising Platform" in CA (AB 488, effective 2024) and HI (Act 205, effective July 2026). Estimated Year 1 compliance cost: $28K-$88K. 8 Tier 1 states identified for pre-launch registration (CA, NY, FL, PA, OH, MA, CT, IL). Architectural implications documented (state disclosure engine, contract filing automation, financial reporting module). Full analysis at `docs/state-registration-research.md`. | Regulatory research session |
| 2026-02-28 | **Salesforce integration — full research and architecture complete** (`docs/salesforce-integration.md`). **Priority upgraded: P2 → P1 fast-follow (ship Month 2–3).** 4 parallel research agents: (1) nonprofit Salesforce landscape — ~40K–55K orgs globally, ~3–4% overall US penetration, concentrated in $1M–$10M+ orgs; NPSP is 95%+ of installed base, NPC has minimal real-world adoption; (2) competitor analysis — Give Lively is free NPSP-only hourly batch (their #1 differentiator + biggest weakness); Givebutter is Zapier-only (their documented #1 weakness); Classy is $250/mo bidirectional near-real-time NPSP+NPC; Donorbox is $50/mo no AppExchange; Funraise is free real-time open-source NPSP+NPC; (3) AppExchange — 4–6 month timeline, $999 security review, 15% revenue share on AppExchange Checkout, managed package required for listing; (4) technical architecture — external API connector (not managed package) for v1; JWT Bearer OAuth; Composite Graph API for atomic Contact+Opp upsert; external ID upsert with email dedup fallback; 7 custom External ID fields; persistent job queue with exponential backoff; CDC + Pub/Sub API for bidirectional sync in v2. **Competitive pitch once shipped:** "Native Salesforce NPSP sync — free, real-time, no Zapier, no $250/mo add-on. Beats Give Lively's hourly batch." Start AppExchange ISV Partner registration at Month 2; listing targets Month 6–8. | Salesforce research session |
| 2026-02-28 | **Comprehensive legal & compliance research complete** (`docs/compliance-research.md`). 5 research areas covered: (1) **State charitable solicitation** — ~38-40 states require platform registration as Professional Solicitor/Fundraiser; CA AB 488 (Charitable Fundraising Platform law, effective 2024) and HI Act 205 (effective July 2026) are new CFP-specific categories; 8 Tier 1 states for pre-launch registration (CA, NY, FL, PA, OH, MA, CT, IL); Year 1 compliance cost $28K-$88K; architectural requirements: state disclosure engine, contract filing automation, financial reporting module. (2) **PCI DSS 4.0.1** — SAQ A applies (Stripe handles all card data via iframes); must complete SAQ A + AOC annually via Stripe PCI Dashboard; quarterly ASV scans required (Req 11.3.2); new SAQ A eligibility criterion (Jan 2025): must confirm donation pages are not susceptible to script attacks — satisfy via CSP headers + Stripe confirmation; never bypass Stripe Elements. (3) **501(c)(3) verification** — Use Pactman Nonprofit Check Plus API (free tier 200/month) for MVP; IRS Pub 78 (not EO BMF) is primary source — deductibility code A = gold standard 501(c)(3) confirmation; self-host IRS bulk data at scale (zero cost); ProPublica API for donor-facing 990 enrichment only; Candid/GuideStar too expensive. Decision: instant auto-approval for clean Pub 78 lookups, structured self-cert for edge cases. (4) **Privacy Policy & ToS** — Build to CCPA/CPRA standards (superset of all 20+ state laws); explicit "nonprofits own their donor data" clause as competitive differentiator; binding arbitration with class action waiver (industry standard); Givebutter weaknesses identified (no CCPA compliance, no retention policy, perpetual license claim); Zeffy is more compliant. (5) **Money transmitter licenses** — No state MTLs required: Stripe Connect Express structure means Give never holds donor funds; payment processor exemption (31 C.F.R. §1010.100(ff)(5)(ii)) means no FinCEN MSB registration either; agent of payee doctrine applies (California codified 2021); no major competitor holds MTLs. CA AB 488 is a separate (charitable solicitation) obligation, not MTL. **Action required before launch:** informal MTL legal opinion memo (~$5K-$12K); CA AB 488 registration; Tier 1 state PF/PS registrations; PCI SAQ A; 501c3 verification API. | Compliance research session |
