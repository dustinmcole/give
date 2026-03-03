
VISION DOCUMENT

[Platform Name]
AI-Native Nonprofit Fundraising Platform


Product Roadmap & Execution Guide for the AI Agent Development Team
Version 2.0  •  March 2026
CONFIDENTIAL

---

> **COORDINATOR NOTE — READ FIRST**
>
> This document is the strategic north star for the AI agent development team. It is designed to be reviewed daily by the coordinator/planner agent and referenced by all agents during development. However, **this is a living, mutable document**. The coordinator agent is expected to revisit, revise, reprioritize, and restructure this document as development progresses, market conditions change, technical constraints emerge, or better approaches become apparent. You are not bound to execute this document rigidly. You are bound to execute the *mission* — build the best AI-native nonprofit fundraising platform in the market. If you discover during development that a feature should move phases, a technical approach is suboptimal, a market assumption is wrong, or a timeline needs adjustment, **update this document and proceed**. Log all significant changes with date and rationale at the bottom of this document in the Change Log section. The founder trusts this team to make intelligent decisions in real time. Treat this document as a strategic guide, not a contract.

---

# Table of Contents

1. Mission & Philosophy
2. Market Context for the Development Team
3. Pricing Model
4. Design, Messaging & Marketing Principles
5. Product Roadmap: Four Phases to Full Platform
6. Technical Architecture Notes
7. Success Metrics by Phase
8. Key Risks & Mitigations
9. Immediate Next Steps: The First 14 Days
10. Glossary of Nonprofit Domain Terms
11. Change Log

---

# 1. Mission & Philosophy

## 1.1 The Problem We Exist to Solve

Nonprofit organizations manage $592.5 billion in annual charitable giving in the United States alone, yet the technology they rely on to manage donors, process donations, and grow their missions is consistently broken. After 20 years working directly with nonprofits of every size, the pattern is unmistakable: backends are unreliable, custom fields are poorly implemented, integrations fail at critical moments, designs feel dated, and platforms that claim to be free degrade the donor experience by inserting tip requests and advertisements into donation forms.

Only 33% of nonprofits rate their CRM as effective. Nearly 50% are actively considering switching — up from just 10% the prior year. The average donor retention rate is a dismal 42.9%, with first-year donor retention at a historic low of approximately 19%. The donor base itself is shrinking — the number of donors fell 4.5% in 2024 for the fourth straight year. Micro-donors ($1–$100) declined 8.8%. These numbers represent real money left on the table, real relationships lost, and real missions undermined. The tools are failing the people they should serve.

Meanwhile, the competitive landscape is in simultaneous upheaval: Salesforce is forcing a painful and expensive migration from NPSP to Nonprofit Cloud (NPC), Blackbaud carries the weight of a $59.25M+ data breach settlement and declining trust, Bonterra's post-merger integration has alienated users with 2–3 week support response times, and the "free" platforms (Givebutter, Zeffy) rely on donor-confusing tip models that default to 15–17% surcharges. Microsoft plans to retire its Fundraising and Engagement product by December 2026. Classy was retired and rebranded as GoFundMe Pro. There has never been a better time to enter this market.

## 1.2 Our Thesis

We believe a solo founder with deep nonprofit domain expertise, supported by an AI agent development team, can build a modern, AI-native fundraising platform that does not require a large human team or large budget. We will ship fast, iterate in public, and let the product speak through clean design, honest pricing, and features that actually work.

Our core thesis rests on four pillars:

- **AI-native from day one.** Every feature we build should have intelligence embedded. Not AI bolted on as a marketing buzzword, but genuinely useful automation that saves nonprofit staff hours every week. AI adoption among nonprofits surged from 31% in 2024 to 48% in 2025, but 81% of that use is individual and ad hoc — organizations treating ChatGPT as a personal productivity tool. Only 4% use smart fundraising donation forms. Less than 1% use real-time fundraising intelligence. We will embed AI so deeply that staff experience magical results without ever opening a separate AI tool.

- **Honest, transparent pricing.** A flat 1% transaction fee on credit/debit donations, no hidden fees, no tip jars guilt-tripping donors at checkout, no bait-and-switch subscriptions. Organizations doing ACH, bank transfers, or check processing pay only standard processing costs with zero platform fee on those methods.

- **Design that respects donors.** Beautiful, fast, mobile-first donation forms that maximize conversion and never embarrass the nonprofit. The donation form is the single most important piece of the product, and it will be treated as such. The current donation page completion rate across the industry is just 12% — 88% of people who click "donate" never finish. We will dramatically beat this benchmark.

- **Built by someone who has done the work.** 20 years of nonprofit experience means we understand gift splits, pledge management, fund accounting, tax receipting, board reporting, and the hundred other things generic SaaS builders get wrong.

## 1.3 What We Are Not

We are not a venture-backed company chasing hockey-stick growth at the expense of customers. We are not a PE roll-up that acquires products and raises prices while degrading support. We are not a platform that uses donors as a revenue source by manipulating their checkout experience. We build tools for nonprofits, funded by nonprofits, in service of their missions.

## 1.4 Development Velocity: AI-Powered Fast-Track

This product is being built by an AI agent development team, not a traditional engineering organization. This fundamentally changes the development timeline. Where traditional SaaS companies might take 18–24 months to reach feature parity with established players, our AI-powered development pipeline compresses this dramatically.

The 2026 agentic coding landscape has proven that AI agents can handle multi-file refactors, run tests, iterate on feedback, and ship production code with minimal human oversight. Our development velocity assumptions reflect this reality:

- AI coding agents work 24/7 with no context-switching overhead.
- Multiple agents can work on parallel features simultaneously.
- Code review, testing, and documentation are integrated into the agent workflow.
- The founder provides domain expertise, design direction, and quality assurance — not line-by-line code.
- Development cycles that would take a 5-person human team 3 months can be compressed to 3–5 weeks with an AI agent team.

The roadmap timeline in this document reflects this accelerated pace. If the team finds it can move even faster without sacrificing quality, it should.

---

# 2. Market Context for the Development Team

The AI agent team needs to understand the market it is building for. This section provides the essential context that should inform every design decision, feature priority, and UX choice.

## 2.1 Who We Serve

Our primary user is a nonprofit staff member, often wearing multiple hats, who manages fundraising, communications, events, and volunteer coordination with limited time and limited technical expertise. They are not engineers. They are not data analysts. They need software that works immediately and intuitively without training manuals or onboarding calls. Nonprofits now use an average of 10–20 different software solutions. 72% use at least three unintegrated systems. 60% still primarily use spreadsheets for data management. The persistent top pain points — time-consuming manual reporting, lack of real-time visibility, inability to produce outcome metrics, inadequate system integration, and lack of process automation — have been unchanged for three consecutive years.

Our primary target segments, in order of go-to-market priority:

- **Phase 1–2 Target: Small nonprofits (under $500K annual revenue).** 92% of all nonprofits. Often run by 1–5 staff. Currently using spreadsheets, free tools, or entry-level platforms. Price-sensitive but willing to pay for something that works. This is our beachhead market.

- **Phase 3 Target: Mid-size nonprofits ($500K–$10M annual revenue).** The "missing middle" that has outgrown basic tools but cannot afford or staff enterprise solutions. Typically 1–2 people managing all technology. This segment has real budget and high switching intent, and is growing at 13% CAGR. Nearly half are actively considering switching CRMs.

- **Phase 4 Target: Large nonprofits ($10M+ annual revenue).** Complex needs including check processing, major gift portfolios, grant management, and board reporting. Long sales cycles, high LTV. We reach them with a mature product.

## 2.2 Competitor Weaknesses We Exploit

The team should understand exactly why each competitor loses customers, because we will build the opposite:

**Salesforce NPSP / Nonprofit Cloud (NPC):**
- NPSP stopped receiving new features in March 2023. Salesforce's strategic investment is now focused entirely on NPC. While Salesforce has not announced a formal end-of-life for NPSP, the signals are unmistakable: free NPSP licenses were removed from the Power of Us program in December 2025, and Workflow Rules and Process Builder — tools NPSP orgs depend on — were retired on December 31, 2025.
- NPC is a complete re-architecture using Person Accounts, Gift Commitments/Transactions, and OmniStudio. Migration from NPSP is effectively a full re-implementation costing $10,000–$100,000+.
- NPC Enterprise Edition costs $60/user/month (up from $36 under NPSP). After 10 free licenses, NPC costs $720/user/year.
- The NPC ecosystem is immature compared to NPSP: missing reciprocal relationship automation, no native online donation processing (still requires third-party ISVs), and limited outcome management.
- Total cost of ownership with consultants, AppExchange apps, and admin salaries is prohibitive for most organizations. Salesforce is "free like a puppy, not free like a beer."
- **Our angle for NPSP orgs:** "You're on a platform that stopped innovating in 2023. Instead of spending $50K+ migrating to NPC, migrate to a modern platform in 2 weeks."
- **Our angle for NPC orgs:** "You spent $100K on implementation and still need third-party vendors for basic donation processing. We do it all natively."

**Blackbaud / Raiser's Edge NXT:**
- The 2020 ransomware breach compromised an estimated 1.5 billion records from 13,000+ customers, resulting in $59.25M+ in penalties. The FTC found systematic security failures: default passwords, unencrypted sensitive data, retention of former customer data.
- Pricing starts at approximately $3,375/month.
- The legacy "Database View" (still used for 75–80% of daily tasks by many users) sunsets in H1 2027.
- Customer service quality has declined significantly — assigned success managers reportedly change every six months.
- **Our angle:** "Your CRM provider was fined $59M for losing your donors' data. Your donors deserve better."

**Bloomerang:**
- Starts at $125/month. Targets small-to-mid nonprofits with donor retention analytics.
- Acquired Qgiv in 2024 to expand fundraising functionality.
- Key weaknesses: limited customization, basic online forms, narrow email marketing tools, single-contact-per-company limitation. Growing organizations outgrow it.
- **Our angle:** "All the retention analytics, none of the limitations — and no monthly subscription."

**Virtuous:**
- Positions as "responsive fundraising platform" for mid-to-large nonprofits with AI-powered donor journeys.
- Named #1 Momentum Leader on G2 in 2024. Recently launched "Virtuous Momentum," an AI-powered fundraising agent.
- Pricing requires custom quotes (estimated ~$199/month starting).
- Weaknesses: occasional slow performance, reporting customization limits.
- **Our angle:** "AI-native from the ground up, not AI bolted on. And transparent pricing, not 'call for a quote.'"

**Bonterra (EveryAction / Network for Good / Salsa Labs):**
- Apax Partners-backed merger of 7+ products. Customer support has degraded dramatically — 2–3 week response times for help tickets. Users report forced migrations, loss of dedicated account reps, and in worst cases, loss of donation records from major donors.
- BBB rates Network for Good at "B+" with only 4 of 9 complaints resolved.
- **Our angle:** "Your support tickets shouldn't take two weeks. Switch in two weeks instead."

**Givebutter:**
- #1-rated fundraising platform on G2. Claims 47% form conversion rate.
- Pricing model changed September 2025: with tips enabled, it's free but donors see a default 15% tip to Givebutter; with tips disabled, a flat 3% platform fee + processing fees.
- Frequent complaints about donor confusion and "dark UX patterns" around tipping.
- **Our angle:** "Your donors came to support your mission, not subsidize your software vendor."

**Zeffy:**
- 100% free with no platform fees. Covers costs through voluntary donor tips defaulting to 17% for donations under $99.49.
- Grown from 50,000 to 100,000+ nonprofits in about a year. $2B+ raised.
- Features are basic: crude email editor, limited reporting, organizations with complex needs quickly outgrow it. Long-term sustainability is unproven.
- **Our angle:** "Free doesn't mean good. Your donors are paying 17% for a tool with a crude email editor."

**GoFundMe Pro (formerly Classy):**
- Classy retired May 6, 2025. Post-acquisition quality declined, innovation "slowed to an absolute crawl."
- GoFundMe controversially set up fundraising pages for 1.4 million nonprofits without consulting them in October 2025.
- **Our angle:** "You need a platform built for nonprofits by someone who understands nonprofits — not a consumer crowdfunding company."

**Microsoft Fundraising & Engagement:**
- Retiring December 2026. Any nonprofits still on this platform are actively seeking alternatives.
- **Our angle:** Direct migration marketing to these organizations.

## 2.3 The AI Opportunity

AI adoption among nonprofits surged from 31% in 2024 to 48% in 2025, but only 7% report major mission improvements. The 61-percentage-point gap between exploration (78–89% report using AI in some form) and strategy (only 24% have a formal AI strategy) is our core opportunity.

What nonprofits use AI for today: workplace productivity tools like scheduling and note-taking (56%), written content creation (53%), and data work including reporting and segmentation (28%). Only 19% use it for graphics, 15% for marketing automation, 5% for video. 81% of nonprofit AI use is individual and ad hoc.

What nonprofits have NOT yet applied AI to — and where the highest value lives: personalization at scale, prospect scoring, gift modeling, predictive donor retention, smart donation forms, and strategic planning. Only 13% use predictive AI for donor prospecting, only 4% use smart fundraising forms, and less than 1% use real-time fundraising intelligence.

The barriers are practical, not philosophical — only 1% of nonprofits actively oppose AI. The real barriers: 60% lack in-house expertise to assess tools, 76% have no AI policy, 45% are unsure if their current tech supports AI, and data security/privacy is the #1 concern.

Our strategy: make AI invisible. Staff should never need to learn AI, configure AI, or even think about AI. They should simply experience better results — smarter donation forms, better email copy, predicted churn, automated thank-yous, intelligent segmentation — powered by intelligence they never have to manage.

## 2.4 The DAF Opportunity

Donor Advised Funds represent the most significant shift in philanthropic infrastructure and must be a first-class feature from Phase 1. DAF assets reached $326.45 billion (up 27.5%), with contributions of $89.64 billion (up 37.3%) and grantmaking of $64.89 billion (up 19.0%). The five-year average annual growth rate is approximately 20%.

Key DAF statistics that inform our product strategy:

- The average DAF gift is 6x larger than a standard gift (median $500, average $2,000+). When donors convert from credit card to DAF giving, the average gift increases by 888%.
- For smaller organizations (<$10M), DAF giving grew from 6% of revenue in 2020 to 15% in 2024 — a 143% increase.
- 69% of all DAF gifts are under $1,000 — DAFs are not just for ultra-wealthy donors.
- DAF donors have a 13-point higher retention rate than non-DAF donors.
- 88% of DAF donors continue making donations outside of their DAF, meaning they are already on nonprofit donation pages — but most forms don't offer a DAF option.
- DAFpay by Chariot (now used by 7,000+ nonprofits) has proven that embedding a DAF checkout button directly on donation forms dramatically increases DAF gift volume. March of Dimes saw DAF revenue more than double after adding DAFpay.

We will integrate DAFpay / Chariot from Phase 1. This is a competitive differentiator that most small-nonprofit platforms completely ignore.

## 2.5 Recurring Giving: The Untapped Goldmine

Monthly giving now accounts for 31% of all online revenue (up 5% year-over-year). Monthly donors retain at rates up to 90% compared to 19% for first-time one-time donors. The average recurring donor gives approximately $950/year with an average lifetime value of $7,604.

Yet only 36% of nonprofits default their donation pages to monthly giving, and only ~2% of new donors start as recurring givers — a number stuck for five years. GivingTuesday Data Commons estimates $10–20 billion in untapped recurring giving potential.

Our donation form will default to monthly giving and use AI to optimize the recurring-vs-one-time toggle based on donor profile, traffic source, and campaign context. This alone could be a meaningful competitive differentiator.

---

# 3. Pricing Model

## 3.1 The Philosophy: Honest and Simple

The nonprofit fundraising software industry has a pricing problem. Some platforms charge $3,000+ per month in subscriptions. Others claim to be free and then manipulate donors into tipping the platform at checkout, which is disrespectful to donors and embarrassing for nonprofits. Others charge per contact, per email, per feature, creating unpredictable costs.

Our pricing is dead simple:

**Core Pricing Structure:**

- **1% platform fee on credit/debit card donations only.** This is on top of standard payment processing fees (Stripe charges nonprofits approximately 2.2% + $0.30 per transaction). Our total cost to nonprofits on card donations is approximately 3.2% + $0.30.

- **0% platform fee on ACH/bank transfers.** Large donors giving $10K, $50K, or $100K do not use credit cards. They use ACH and bank transfers. We charge nothing extra on these. The nonprofit pays only Stripe's ACH processing fee (0.8%, capped at $5). This is a massive differentiator — our platform cost on a $100K ACH gift is $0, not $1,000+.

- **0% platform fee on DAF donations.** DAF donations processed through DAFpay/Chariot carry no additional platform fee from us. We absorb the integration cost. This incentivizes nonprofits to promote DAF giving, which is a win-win (larger gifts, better retention, lower processing costs).

- **0% platform fee on check donations.** When check processing launches in Phase 3, logging and processing checks is included. No per-check fee.

- **No subscription fees. No per-contact fees. No per-email fees.** The platform is free to use. We make money only when nonprofits raise money through card donations.

**Why This Works Financially:**

At 1% on card donations, a nonprofit processing $200,000/year in card gifts pays us $2,000/year. A nonprofit processing $50,000/year pays $500. This is less than virtually every subscription-based competitor, and it scales fairly: organizations pay proportional to the value they extract from the platform.

The key insight is that large nonprofits process the majority of their major gifts via ACH, wire, DAF, and check — not credit card. The donations that flow through card processing tend to be smaller online gifts ($50–$500 range) where 1% is negligible to both the nonprofit and the donor.

**The Marketing Angle:**

The Givebutter/Zeffy tip model is our best marketing foil. Their checkout injects a tip request that defaults to 10–17% of the donation amount, creating a confusing, guilt-laden experience for donors who think the money goes to the charity. Our message: "Your donors came to support your mission, not subsidize your software vendor." This resonates powerfully with development directors who care about donor experience.

**Revenue Projections:**

| Milestone | Nonprofits | Est. Annual Card Volume | Est. Annual Revenue |
|-----------|-----------|------------------------|-------------------|
| Phase 1 (Month 3) | 200 | $2M | $20K |
| Phase 2 (Month 6) | 600 | $8M | $80K |
| Phase 3 (Month 9) | 1,500 | $30M | $300K |
| Phase 4 (Month 12) | 3,000 | $75M | $750K |
| Year 2 | 5,000+ | $200M+ | $2M+ |

These projections assume conservative average card volume. Actual revenue will depend on mix of small vs. mid-size organizations and percentage of donations processed via card vs. ACH/DAF.

---

# 4. Design, Messaging & Marketing Principles

This section is critical. Design and messaging are not cosmetic concerns — they are competitive weapons. In a market where most products look dated, feel clunky, and communicate poorly, exceptional design and clear messaging are differentiators as powerful as any feature.

## 4.1 Design Principles

Every screen, form, email, and interaction the team builds must follow these principles:

- **Donation forms are the product.** The donation form is what donors see. It is the single highest-impact piece of UI in the entire platform. It must be beautiful, fast (under 2 seconds to load), mobile-first, and frictionless. No clutter, no tip requests, no ads, no unnecessary fields. Conversion rate is the metric. Every millisecond of load time and every extra field costs the nonprofit money. The industry average completion rate is 12%. We target 40%+.

- **Simplicity is a feature.** Nonprofit staff do not have time to learn complex software. Every screen should be immediately understandable. If a feature requires a tutorial to use, it is designed wrong. Progressive disclosure: show what people need now, hide what they need later.

- **Modern and trustworthy.** Clean typography, generous whitespace, a cohesive color palette, and subtle animations that signal quality. Donors must feel safe entering payment information. Nonprofits must feel proud sharing their donation page. No design should ever look like a template.

- **Mobile-first, always.** 45% of donation transactions happen on mobile, but mobile conversion rates (8–10%) dramatically lag desktop (16%) and mobile average gifts ($79) lag desktop ($118). Every page, form, and dashboard must be designed mobile-first. Closing the mobile conversion gap is a massive revenue opportunity for our customers.

- **Accessible by default.** WCAG 2.1 AA compliance minimum. High contrast, keyboard navigation, screen reader support, proper ARIA labels. Nonprofits serve everyone; our software must be usable by everyone.

## 4.2 Brand Voice & Messaging

Our brand voice is confident, warm, and direct. We speak like a trusted colleague who has been in the trenches, not like a sales team. Key messaging pillars:

- **Pillar 1: Honesty over gimmicks.** "No tip jars. No guilt trips. No hidden fees. Just a clean 1% on card donations." We directly contrast ourselves with platforms that manipulate donors at checkout. This is our sharpest marketing weapon.

- **Pillar 2: AI that works in the background.** "You don't need to learn AI. Our platform is AI." Position intelligence as invisible infrastructure, not a feature to toggle on. Staff experience the results (better emails, smarter segments, predicted churn) without needing to understand the machinery.

- **Pillar 3: Built by a practitioner, not a startup.** "20 years working with nonprofits. We've lived the pain of bad software so you don't have to." This credibility message is our moat against well-funded competitors who lack domain expertise.

- **Pillar 4: Your donors deserve better.** "Every dollar your donor gives should feel good — for them and for you." Frame everything through the donor experience. Nonprofits care deeply about how their supporters are treated.

## 4.3 Marketing Strategy (Scrappy, AI-Powered)

As a solo founder with a tiny budget, traditional marketing is not viable. Instead, we execute a content-driven, AI-assisted marketing strategy:

- **SEO content engine.** AI agents produce 3–5 high-quality blog posts per week targeting long-tail nonprofit keywords: "best donation form software," "how to improve donor retention," "nonprofit CRM comparison 2026," "NPSP migration alternatives," "Nonprofit Cloud alternatives." Each post is reviewed by the founder for domain accuracy. Target: 50,000 organic monthly visitors within 12 months.

- **Social proof through G2/Capterra reviews.** From launch, actively solicit reviews from early adopters. G2 rankings are the single most influential factor in nonprofit software purchasing decisions. Target: G2 Leader badge within 18 months.

- **LinkedIn thought leadership.** The founder posts 3–5 times per week sharing real nonprofit insights, hot takes on industry trends, and product updates. AI agents draft, founder edits and personalizes.

- **Comparison landing pages.** Dedicated pages for "[Platform] vs. Givebutter," "[Platform] vs. Bloomerang," "[Platform] vs. Salesforce NPSP," "[Platform] vs. NPC," "[Platform] vs. Raiser's Edge," etc. Honest, factual comparisons that let the product speak.

- **Free tools and calculators.** A donation form fee calculator, a donor retention calculator, a "should you switch your CRM" quiz, an "NPSP vs NPC migration cost estimator." These generate leads organically.

- **Migration marketing.** Our founder's data migration expertise is a unique asset. Free migration is the offer that gets nonprofits in the door. Content like "How to migrate from Bloomerang in 48 hours" and "Why migrating to us costs $0 instead of $50K to NPC" positions us as the easy choice. Target NPSP, NPC, Blackbaud, Bonterra, and Microsoft F&E customers specifically.

- **Conference presence (Phase 3+).** NTC (Nonprofit Technology Conference) and AFP ICON are essential for credibility. Budget for booth presence once revenue supports it.

---

# 5. Product Roadmap: Four Phases to Full Platform

This roadmap is the core of the document. Each phase represents a shippable, marketable product. The team should build to each phase sequentially, releasing publicly at each milestone.

**Critical principles:**

1. **AI is not a phase. AI is embedded in every phase from the beginning.** There is no "add AI later" step. Every feature we build should be smarter than the competitor's equivalent because intelligence is baked into the foundation. AI features should be prioritized early and aggressively — they are our core differentiator, not a nice-to-have.

2. **This timeline is compressed for AI-agent-powered development.** Traditional SaaS would take 18–24 months for what we're building. Our target is 12 months to full platform. The coordinator should compress further where possible without sacrificing quality or stability.

3. **Ship early, iterate fast.** Each phase should ship as soon as core functionality is stable. Polish in production based on real user feedback.

4. **Salesforce migration support is a first-class concern.** We serve both NPSP and NPC organizations. Data import tools, field mapping, and migration documentation must support both Salesforce data models from Phase 1.

---

## 5.1 Phase 1: The Donation Form + AI Foundation (Weeks 1–5)

**Ship target: 5 weeks from start.** This is our market entry. A standalone, embeddable donation form that is the best in the market. We do one thing and we do it better than everyone else.

### Product: What We Ship

A complete, production-ready donation form system:

- **Embeddable donation form widget.** A JavaScript widget that any nonprofit can embed on their website with a single line of code. Also available as a hosted page for nonprofits without websites. Must load in under 2 seconds on 3G mobile connections.

- **Form builder with live preview.** Drag-and-drop form customization: colors, fonts, logo upload, custom fields, background images. Real-time preview. No coding required.

- **One-time and recurring donation support.** Donors can give once or set up monthly/quarterly/annual recurring gifts. Default to monthly giving with an intelligent toggle. Recurring giving UI should make it effortless to select and should clearly communicate the impact of monthly giving ("$25/month = $300/year").

- **Smart suggested amounts (AI).** AI analyzes the nonprofit's historical giving data (or industry benchmarks for new orgs) to suggest optimal donation amounts. Not static $25/$50/$100 buttons but dynamically personalized amounts that maximize average gift size. Proven to increase average donations by up to 40%.

- **Multiple payment methods.** Credit/debit cards via Stripe, ACH/bank transfer via Stripe, Apple Pay, Google Pay, and Venmo. **DAFpay (Chariot) integration from day one** — this is a competitive differentiator most small-nonprofit platforms ignore entirely. Every payment method a modern donor expects.

- **Designation/fund selection.** Donors choose which fund, campaign, or program their gift supports. Nonprofits configure available designations in the dashboard.

- **Custom fields.** Nonprofits can add custom questions to the form (text, dropdown, checkbox, etc.). Custom fields that actually work — validated, searchable, reportable — not the broken implementations found in most competitors.

- **Real-time analytics dashboard.** Live view of donations as they come in. Daily/weekly/monthly totals. Conversion rate tracking. Average gift size. Traffic source analysis. Recurring vs. one-time breakdowns. Payment method breakdowns (card/ACH/DAF). This is the first screen staff see when they log in.

- **Automatic tax receipts.** Instant, branded email receipts with all IRS-required information (501(c)(3) statement, EIN, no goods or services declaration). Customizable templates. Annual giving statements generated automatically in January.

- **AI-generated thank-you emails.** When a donation comes in, the system drafts a personalized thank-you email based on the donor's giving history, the campaign context, and the nonprofit's voice. Staff can review and send with one click, or set to auto-send.

- **Basic donor list.** Every donor who gives through the form is automatically logged with full contact information, giving history, and communication preferences. This is the seed of the CRM that grows in Phase 2.

- **Stripe Connect integration.** Nonprofits connect their own Stripe account. Funds go directly to them. We take our 1% through Stripe's application fee mechanism. No holding funds, no delays.

- **Webhooks and Zapier integration.** From day one, every donation event fires a webhook and is available in Zapier. This lets nonprofits connect to their existing tools (Mailchimp, QuickBooks, Salesforce, etc.) immediately.

- **Embeddable campaign/thermometer widgets.** Visual fundraising thermometer and campaign progress widgets that can be embedded alongside or separately from the donation form.

- **Nonprofit onboarding flow.** Account creation, Stripe Connect OAuth, DAFpay/Chariot registration, form customization, embed code generation. Target: form live on website in under 5 minutes.

### AI Features in Phase 1

AI is our core differentiator. These are not "nice-to-have" — they ship in Phase 1:

- **Smart ask amount optimization.** ML model that learns from conversion data to optimize suggested donation amounts per donor profile (new vs. returning, mobile vs. desktop, traffic source, time of day). Start with rule-based heuristics + industry benchmarks, upgrade to ML as data accumulates.

- **AI thank-you email generation.** Personalized donor acknowledgment emails generated instantly using the nonprofit's voice, donor history, and campaign context. Staff review and send with one click, or auto-send.

- **Form conversion optimization suggestions.** AI analyzes form abandonment patterns and suggests changes (field reordering, amount adjustments, copy tweaks) to improve conversion rates. Surfaces actionable recommendations on the dashboard.

- **Fraud detection.** Real-time AI screening for card testing attacks, suspicious patterns, and potential fraud. This protects nonprofits and reduces chargebacks. Card testing attacks are a growing problem for nonprofit donation forms.

- **Recurring giving intelligence.** AI determines the optimal default (one-time vs. recurring) and optimal suggested recurring amount based on donor profile, campaign context, and traffic source. Targets the industry's massive untapped recurring giving potential.

- **AI-powered donor deduplication.** Even in the basic donor list, use fuzzy matching on name, email, and address to prevent duplicates from the start. This prevents data quality problems before they begin.

### Integrations in Phase 1

- Stripe Connect (payments)
- DAFpay / Chariot (DAF donations)
- Zapier (all donation events as triggers)
- Webhooks (custom integrations)
- WordPress plugin (one-click embed)
- Salesforce NPSP import (CSV with NPSP field mapping)
- Salesforce NPC import (CSV with NPC field mapping — Person Accounts, Gift Transactions)
- Bloomerang import
- Network for Good / Bonterra import
- Little Green Light import
- Generic CSV import with intelligent column mapping

### Go-to-Market: Phase 1

- **Launch offer:** Free to use with 1% card fee. No credit card required to set up. Nonprofit can have a donation form live on their website in under 5 minutes.
- **Target:** 200 nonprofits in 5 weeks. Focus on small organizations who need a better donation form but don't want to pay $50–100/month for one.
- **Marketing:** Blog content targeting "best donation form for nonprofits," "free donation form software," "Givebutter alternative without donor tips," "NPSP migration options 2026." LinkedIn posts. Direct outreach to founder's existing nonprofit network.
- **Migration play:** For organizations switching from Givebutter, Network for Good, Salesforce NPSP, Salesforce NPC, or other tools, founder personally migrates their recurring donor data. This white-glove service costs us time but builds loyalty and generates word-of-mouth.

---

## 5.2 Phase 2: CRM + Campaigns + AI Intelligence Engine (Weeks 6–12)

**Ship target: 12 weeks from start.** This is the transformative phase. We evolve from a donation form into a full donor relationship management system AND a campaign platform simultaneously. This is where we become a genuine Bloomerang/Neon CRM/Virtuous competitor.

### Product: What We Add

**Campaign & Peer-to-Peer Features:**

- **Campaign pages.** Beautiful, customizable fundraising campaign pages with hero images/video, narrative storytelling area, progress thermometer, donor wall (with opt-in visibility), and social sharing buttons. Each campaign gets a unique URL.

- **Peer-to-peer fundraising.** Supporters create their own fundraiser pages linked to a parent campaign. Personal page customization, individual progress tracking, leaderboards.

- **Team fundraising.** Fundraisers form teams within a peer-to-peer campaign. Team pages, team leaderboards, team captain tools.

- **Crowdfunding mode.** All-or-nothing or keep-it-all campaign options. Countdown timers. Milestone alerts.

- **Event ticketing (basic).** Simple event pages with ticket purchasing, RSVP tracking, and attendee management. Enough to handle galas, dinners, and fundraising events.

- **Social sharing toolkit.** One-click sharing to major platforms. AI-generated share text optimized for each platform. Pre-built social media image templates.

- **Donation matching.** Corporate match integration. Display matching gift opportunities on donation forms. AI identifies donors likely eligible for matching gifts.

- **Campaign email tool.** Simple email builder with donor segmentation, scheduled sends, open/click tracking, AI-generated subject lines and body copy.

- **Giving Day mode.** Special configuration for 24-hour giving days with real-time leaderboards, hourly challenges, bonus hours, and live donation feed.

- **Text-to-give.** Donors text a keyword to a number and receive a mobile donation form link.

- **Embeddable donation buttons/links.** Pre-configured links for social media bios, QR codes for print materials.

**Donor Management Core (CRM):**

- **Unified donor profiles.** 360-degree donor view: every gift, every email opened, every event attended, every campaign participated in, every communication sent — all on one screen. Timeline view and summary cards.

- **Household management.** Link individuals into households. Household giving totals, joint communications, individual + household views. Handle "Mr. and Mrs." salutations correctly.

- **Custom fields (done right).** Unlimited custom fields with proper data types (text, number, date, dropdown, multi-select, checkbox, URL). Fully searchable, filterable, segmentable, and reportable. They appear in exports and mail merges.

- **Gift entry and management.** Manual gift entry for offline donations (cash, check, stock, in-kind). Gift splits across multiple funds/designations. Pledge management with payment schedules and reminders. Soft credits and matching gift tracking.

- **Donor segmentation engine.** Create dynamic donor segments based on any combination of giving history, demographics, engagement, custom fields, and behavior. Segments update automatically.

- **Communication center.** Full email builder with templates, merge fields, scheduling, and tracking. Email sequences/drip campaigns. Direct mail export for print appeals.

- **Task and interaction tracking.** Log phone calls, meetings, handwritten notes on donor records. Create tasks with due dates and reminders.

- **Moves management.** Major gift pipeline tracking. Assign prospects to stages (identification, cultivation, solicitation, stewardship). Track expected ask amounts and close dates.

**Reporting & Analytics:**

- **Standard report library.** Pre-built reports: LYBUNT/SYBUNT, donor retention, revenue by fund/campaign, giving trends, new donor acquisition, recurring giving health.

- **Custom report builder.** Drag-and-drop report builder across any data dimension without SQL knowledge.

- **Dashboard builder.** Customizable dashboard with widgets. Each staff member can configure their own view.

- **Board-ready reports.** One-click generation of board meeting reports. Formatted for presentation.

**Data Quality & Migration:**

- **Import wizard.** CSV import with intelligent column mapping, duplicate detection, and data validation. Support for NPSP, NPC, Bloomerang, Little Green Light, Raiser's Edge, Network for Good, and Neon CRM export formats.

- **Duplicate detection and merge.** AI-powered duplicate detection across name, email, address, and phone variations. One-click merge with preview.

- **Data enrichment (AI).** Automatic enrichment using publicly available data: employer information, estimated capacity, social media profiles, news mentions.

- **White-glove migration service.** Founder-led migration. Full data audit, cleanup, and transfer. Free for the first 50 migrations.

### AI Features in Phase 2

This is where our AI engine becomes a serious competitive weapon:

- **Predictive donor scoring.** Every donor receives a dynamic score predicting likelihood of giving, lapse risk, upgrade potential, and major gift capacity. Scores update in real time. This is the single most valuable AI feature in the entire platform.

- **Churn prediction and automated retention.** AI identifies donors at risk of lapsing 30/60/90 days before lapse. Automatically triggers personalized retention emails or surfaces tasks for staff follow-up. Target: reduce first-year donor lapse rate from 80.6% to under 60%.

- **AI email copywriter.** Given a campaign goal, target segment, and tone, AI generates complete email appeals with subject lines, body copy, and calls to action. A/B test subject lines automatically.

- **Smart segmentation suggestions.** AI analyzes giving patterns and suggests segments: "127 donors who gave $100+ to your gala last year haven't been solicited for this year's event."

- **Donor journey automation.** Pre-built and customizable journeys: new donor welcome series, recurring donor stewardship, lapsed donor re-engagement, major gift cultivation. AI optimizes send times, content, and sequence length.

- **Natural language reporting.** Staff type questions in plain English ("How much did we raise from board members this quarter?") and the AI generates the report.

- **AI campaign copy generator.** Given a campaign description and target audience, AI generates full campaign page copy, email appeals, social media posts, and thank-you messages.

- **Campaign performance predictions.** Based on early data, AI predicts final campaign total and suggests interventions.

- **Donor outreach suggestions.** AI identifies donors most likely to support specific campaigns based on giving history and engagement.

- **AI social media content generator.** Platform-specific posts with hashtag suggestions and posting time recommendations.

### Integrations Added in Phase 2

- Mailchimp (bi-directional sync)
- Constant Contact
- QuickBooks (donation data for accounting)
- Salesforce (bi-directional CRM sync — both NPSP and NPC data models)
- Double the Donation (matching gift identification)
- WordPress (enhanced plugin with campaign embeds)
- Slack (donation notifications)
- Google Analytics integration

### Go-to-Market: Phase 2

- **Positioning shift:** "The AI-native nonprofit CRM with no subscription fee." We are now a CRM competitor, not just a form tool.
- **Target:** Reach 800–1,500 total nonprofits. Actively target mid-size organizations ($500K–$5M) who are frustrated with their current CRM.
- **Marketing:** Case studies from Phase 1. "How [Organization] raised $X with zero platform subscription." Publish a "State of Nonprofit CRM" report. Comparison pages against every major CRM. Aggressive Salesforce migration marketing targeting both NPSP and NPC customers.
- **Seasonal timing:** Ship campaign tools before GivingTuesday (late November) or year-end giving season if timeline permits.
- **Migration campaign:** "Switch from Raiser's Edge in 2 weeks, not 6 months." Free migration offer.
- **Partner channel:** Begin recruiting nonprofit consultants as referral partners.

---

## 5.3 Phase 3: Events, Volunteers, Check Processing & Advanced AI (Weeks 13–20)

**Ship target: 20 weeks from start.** We expand into the operational tools that nonprofits need daily: full event management, volunteer coordination, and the check processing capability that large nonprofits desperately lack.

### Product: What We Add

**Event Management:**

- **Full event creation and management.** Multiple ticket types, early bird pricing, promo codes, capacity limits.
- **Auction management.** Silent and live auction support. Item catalog, mobile bidding, bid notifications, winner checkout.
- **Table/seating management.** For gala-style events: table assignments, seating charts, table sponsor recognition, meal selection.
- **Event check-in.** Mobile check-in, QR code scanning, name badge printing, walk-in registration, real-time attendance.
- **Event fundraising integration.** Fund-a-need/paddle raise with mobile bidding interface. Live donation display for projector/screen. Post-event pledge follow-up automation.
- **Event email sequences.** Pre-event reminders, day-of logistics, post-event thank-yous, follow-up surveys. All automated and AI-personalized.
- **Event revenue attribution.** Every ticket, auction win, and event donation attributed to the donor's CRM record.

**Volunteer Management:**

- **Volunteer database.** Volunteer profiles linked to or separate from donor profiles. Skills, availability, interests, and background check status.
- **Opportunity posting and signup.** Shift scheduling, public-facing signup, capacity limits and waitlists.
- **Hour tracking.** Web interface for logging hours. Manager approval workflow. Automatic totals and reporting.
- **Volunteer communication.** Email and SMS to volunteer segments. Shift reminders. Thank-you messages.
- **Volunteer-to-donor conversion tracking.** Track volunteers who become donors. AI identifies volunteers most likely to convert and suggests cultivation strategies.

**Check Processing (Bulk):**

This is a major differentiator. Large nonprofits receive thousands of checks annually and there is no good solution for processing them.

- **Bulk check scanning via mobile.** Staff photograph checks. AI-powered OCR extracts donor name, address, amount, check number, and memo/designation. Batch processing: photograph 50 checks, AI extracts all data, staff review and confirm.
- **Desktop batch entry interface.** High-speed keyboard-optimized entry. Tab through fields, auto-lookup existing donors, auto-populate from previous gifts. Target: 100+ checks per hour.
- **AI donor matching.** Fuzzy name matching, address matching, and historical pattern analysis for check-to-donor matching. Handles Robert vs. Bob, maiden vs. married names.
- **Check image storage.** Scanned images linked to gift records for audit trail. Searchable by check number, amount, date.
- **Deposit tracking.** Group checks into deposits. Generate deposit slips. Reconcile with bank statements.
- **Automatic receipts for check gifts.** Same branded templates as online gifts.

### AI Features in Phase 3

- **AI gift officer assistant.** Prepares meeting briefs (pulling news, social media, giving history), suggests conversation topics, recommends ask amounts, drafts follow-up notes, manages portfolio prioritization. Target: each gift officer manages 2–5x more relationships with AI assistance.

- **Check OCR and data extraction.** Computer vision model trained on nonprofit check processing. Continuous learning from corrections.

- **Event optimization AI.** Predicts optimal ticket prices, suggests event capacity, recommends auction item pricing, identifies top prospects for invitations.

- **Volunteer matching.** AI matches volunteers to opportunities based on skills, availability, proximity, and past engagement.

- **AI donor communication planner.** Generates comprehensive annual communication plans per donor based on giving patterns, preferences, and relationship stage.

- **Grant writing assistant.** AI drafts grant proposals based on organization's programs, outcomes data, and funder requirements.

- **Revenue forecasting.** AI predicts quarterly and annual revenue with confidence intervals. Models scenarios: "What happens if donor retention improves by 5%?"

- **Board reporting AI.** One-click generation of comprehensive board meeting packets with AI-generated narrative summaries.

- **Voice-to-CRM.** Staff dictate interaction notes via mobile. AI transcribes, extracts key information (next steps, ask amounts, donor sentiment), and creates structured CRM entries.

### Integrations Added in Phase 3

- Eventbrite (import/sync)
- Facebook Fundraisers (data import)
- Twilio (SMS campaigns)
- DonorSearch / iWave / WealthEngine (wealth screening)
- Stripe Terminal (in-person payments for events)
- Raiser's Edge migration tool (direct API import)

### Go-to-Market: Phase 3

- **Positioning:** "The complete nonprofit operating system." With CRM, fundraising, events, volunteers, and check processing, we are now a genuine all-in-one platform.
- **Target:** Reach 3,000+ nonprofits. Begin actively marketing to large organizations ($5M+) who need check processing and event management.
- **Check processing launch:** Dedicated campaign targeting organizations processing 500+ checks/year. "Process 100 checks in an hour, not a day."
- **Conference presence:** NTC and AFP ICON booth presence. Sponsor webinars. Launch benchmarking reports.
- **Enterprise sales:** Begin handling inbound enterprise inquiries. Demo-based sales process.

---

## 5.4 Phase 4: Enterprise & Scale (Weeks 21–30+)

**Ship target: 30 weeks from start.** We add the capabilities that large, complex nonprofits require. This is the phase where revenue accelerates as enterprise organizations begin adopting the platform.

### Product: What We Add

**Enterprise CRM Features:**

- **Grant management.** Track applications, deadlines, reporting requirements, deliverables. Link grants to programs and funds. Calendar of upcoming deadlines.
- **Planned giving tracking.** Bequests, charitable trusts, gift annuities. Expected value calculations. Stewardship workflows.
- **Multi-entity/chapter management.** Multiple chapters or affiliates with separate databases and roll-up reporting. Shared donor records with permission controls.
- **Advanced permissions and roles.** Granular RBAC, custom roles with per-field visibility, audit trail for all data changes.
- **Tribute/memorial/honor gifts.** Tribute tracking with notification to honorees. Tribute pages. Aggregate reporting.
- **Wealth screening integration.** DonorSearch, iWave, or WealthEngine for prospect research and capacity scoring.
- **Annual fund management.** Campaign management with segmented solicitation tracks, response tracking, year-over-year comparison.
- **Data warehouse/BI export.** Automated export to BigQuery, Snowflake, or other warehouses.
- **SSO/SAML.** Enterprise single sign-on integration.
- **Public API.** Full read/write API for custom integrations and third-party developers.

### AI Features in Phase 4

- **Autonomous donor stewardship agent.** An AI agent that proactively monitors donor portfolios, identifies at-risk donors, drafts outreach, and schedules follow-ups with minimal staff intervention. This is the evolution of the gift officer assistant into a more autonomous agent.
- **Predictive lifetime value modeling.** ML model that predicts each donor's lifetime value at time of first gift, enabling smarter cultivation investment decisions.
- **AI-powered annual appeal optimization.** AI generates, segments, personalizes, and A/B tests the entire annual appeal cycle end-to-end.
- **Intelligent data cleaning agent.** Continuously identifies and flags data quality issues: outdated addresses, deceased donors, incorrect employment, duplicate records that slipped through initial dedup.
- **Multi-language AI communications.** AI generates donor communications in multiple languages based on donor language preferences.

### Go-to-Market: Phase 4

- **Positioning:** "Enterprise nonprofit CRM built for the AI era." Compete directly with Blackbaud and Salesforce for large organization deals.
- **Target:** 5,000+ total nonprofits. 50–100 enterprise accounts ($10M+ annual revenue).
- **Enterprise pricing:** Consider introducing an optional Enterprise tier ($499–$999/month) for organizations that need SLA guarantees, dedicated support, custom onboarding, and advanced features. The 1% card fee remains but may be negotiable for the largest accounts processing $5M+ in card volume.
- **Sales team:** Build a small sales team (2–3 people) for enterprise outreach. Demo-driven sales. Long sales cycles (3–6 months) but very high LTV.
- **Partner ecosystem:** Formal partner program for nonprofit consultants, implementation specialists, and integration developers.

---

# 6. Technical Architecture Notes

This section provides architectural guidance for the AI agent development team. Detailed technical specs will evolve, but these principles are non-negotiable.

## 6.1 Core Architecture Principles

- **API-first design.** Every feature is built as an API endpoint first, then given a UI. This ensures that integrations, webhooks, Zapier, and the public API all work from day one. The web dashboard is a client of our own API.

- **Multi-tenant SaaS.** Single codebase, shared infrastructure, isolated data. Each nonprofit's data is logically segregated and encrypted at rest.

- **Event-driven architecture.** Every action (donation received, donor created, email sent, task completed) emits an event. Events drive webhooks, automations, AI processing, and analytics. This architecture supports the real-time AI features that are core to our differentiation.

- **Stripe Connect for payments.** All payment processing flows through Stripe Connect. We are never a money transmitter. Funds go directly to nonprofits. Our 1% platform fee is collected via Stripe's application fee mechanism.

- **AI infrastructure from day one.** Every data point flows into a feature store that feeds AI models. Do not build features without considering their AI implications. If we track donation amounts, we should be building the model that predicts optimal ask amounts. If we track email opens, we should be building the model that optimizes send times.

- **Salesforce-aware data model.** Our import/export system must understand both the NPSP data model (Contacts, Opportunities, Campaigns, Account/Household model) AND the NPC data model (Person Accounts, Gift Commitments, Gift Transactions, OmniStudio components). This is essential for our migration play. Build field mapping templates for both.

## 6.2 Recommended Tech Stack

The coordinator agent should make final technology decisions based on the team's capabilities and the latest available tooling. The following is guidance, not prescription:

- **Frontend:** Next.js (React) with TypeScript. Tailwind CSS. Mobile-first responsive design.
- **Backend:** Node.js/TypeScript or Python (FastAPI). The team should choose based on what enables fastest development.
- **Database:** PostgreSQL with row-level security for multi-tenancy. TimescaleDB extension for time-series analytics data.
- **Cache/Queue:** Redis for caching and job queues. Bull or similar for background job processing.
- **Search:** Elasticsearch or Meilisearch for donor search, reporting, and natural language queries.
- **AI/ML:** OpenAI API and/or Anthropic API for generative features. Scikit-learn/PyTorch for predictive models. Feature store built on top of the events system.
- **Email:** SendGrid or Amazon SES for transactional and marketing email.
- **File Storage:** AWS S3 or compatible object storage.
- **Infrastructure:** AWS or GCP. Docker containers. Kubernetes or ECS for orchestration. Terraform for infrastructure as code.
- **CI/CD:** GitHub Actions. Automated testing. Staging environment that mirrors production.
- **Monitoring:** Datadog or similar for application performance. Sentry for error tracking. PagerDuty for alerts.

## 6.3 Security & Compliance

- **PCI DSS compliance.** Using Stripe Connect with client-side tokenization means card data never touches our servers. This reduces our PCI scope to SAQ A. Stripe handles PCI DSS 4.0.1 requirements for the payment flow.

- **SOC 2 Type II.** Begin SOC 2 preparation in Phase 3, complete audit by Phase 4. Required for enterprise sales. Budget $20,000–$50,000 for initial audit.

- **Data encryption.** All data encrypted at rest (AES-256) and in transit (TLS 1.3). Database field-level encryption for sensitive PII (SSN for planned giving, bank account numbers).

- **Backup and disaster recovery.** Daily automated backups with point-in-time recovery. Multi-region failover. 99.9% uptime SLA from Phase 3 onward.

- **GDPR and privacy.** Data processing agreements, right to erasure, data export, consent management. Required for any nonprofit with international donors.

- **Security-first messaging.** Given Blackbaud's $59.25M breach and 80% of donors saying they would stop giving after a breach, our security posture is a marketing asset. We should publish our security practices publicly and make them a selling point.

---

# 7. Success Metrics by Phase

The team should build dashboards tracking these metrics from day one.

**Phase 1 Metrics:**
- Donation form conversion rate (target: 30%+ vs. 12% industry average)
- Average gift size vs. industry benchmarks
- Form load time (target: <2 seconds on 3G)
- Recurring giving opt-in rate (target: 20%+ of new donors)
- DAF gift volume (track from day one)
- Number of active nonprofits
- NPS from beta users

**Phase 2 Metrics:**
- Donor retention rate for platform users vs. industry average (42.9%)
- First-year donor retention (target: 30%+ vs. 19% industry average)
- AI email open rates vs. manually written emails
- Churn prediction accuracy
- Campaign fundraising total
- Number of migrations completed (track NPSP, NPC, and other sources separately)
- CRM adoption (% of users logging in weekly)

**Phase 3 Metrics:**
- Event revenue processed
- Check processing speed (target: 100+ checks/hour)
- Check OCR accuracy rate
- Volunteer engagement
- Grant application success rate for organizations using AI grant writer
- Revenue forecast accuracy

**Phase 4 Metrics:**
- Enterprise account pipeline value
- Enterprise sales close rate
- Revenue per nonprofit
- Total platform GMV
- SOC 2 audit completion
- API adoption (number of active API consumers)

---

# 8. Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Stripe changes nonprofit pricing or policies | Low | High | Build payment abstraction layer. Have backup processor identified (Adyen, Braintree). |
| Major competitor launches similar AI-native features | Medium | Medium | Speed is our moat. Ship first, iterate faster. Our domain expertise makes our AI features more relevant than generic AI bolted on. |
| DAFpay/Chariot changes pricing or availability | Low | Medium | DAFpay integration should use clean abstraction. Monitor alternative DAF processors (FreeWill). |
| Nonprofit data breach or security incident | Low | Critical | Security-first architecture. Regular penetration testing. Incident response plan documented before Phase 1 ships. |
| AI hallucination in donor communications | Medium | High | All AI-generated content requires human review by default. Auto-send only after explicit opt-in and validation period. Never fabricate donor data. |
| Slow initial adoption | Medium | Medium | Leverage founder's network for first 50 customers. Migration service as loss leader. Content marketing flywheel takes 3–6 months to kick in. |
| Salesforce introduces free/cheap competitive offering | Low | Medium | Salesforce has never been cheap for nonprofits. Their complexity is structural, not fixable with pricing changes. Our simplicity is the differentiator. |
| AI model costs exceed revenue for small nonprofits | Medium | Medium | Use tiered AI: rule-based heuristics for basic features, API calls for premium features. Cache common patterns. Use smaller models where possible. |
| Regulatory changes to DAFs | Low | Low | Monitor DAF legislation. Our platform isn't dependent on DAFs — they're a value-add. |
| NPSP gets end-of-life announcement | Medium | Positive | This would accelerate migration demand. Ensure NPSP import tools are production-ready and prominently marketed. |

---

# 9. Immediate Next Steps: The First 14 Days

The following is the execution plan for the first two weeks. The AI agent development team should begin immediately:

## Days 1–3: Foundation

- Set up development environment, CI/CD pipeline, and staging/production infrastructure.
- Create Stripe Connect application and test account. Verify 1% application fee mechanism works correctly.
- Register for Chariot/DAFpay developer account and review integration documentation.
- Establish brand identity: name, logo, color palette, typography, and tone of voice.
- Set up domain, hosting, and email infrastructure.
- Begin designing the donation form UI — mobile-first, beautiful, fast. This is the product's face. Iterate until it is genuinely best-in-class.

## Days 4–7: Core Donation Flow

- Build complete donation flow: form submission, Stripe payment processing, receipt generation, donor record creation, and admin notification.
- Implement recurring donation support (monthly, quarterly, annually) with Stripe Subscriptions. Default to monthly.
- Integrate DAFpay/Chariot button on the donation form.
- Implement Apple Pay, Google Pay, and ACH payment methods.
- Build nonprofit onboarding flow: account creation, Stripe Connect OAuth, form customization, embed code generation.
- Build the real-time analytics dashboard.

## Days 8–10: AI Intelligence & Integrations

- Implement AI smart ask amount logic. Start with rule-based heuristics using industry benchmark data, build toward ML.
- Build AI thank-you email generator. Connect to LLM API with nonprofit voice training.
- Implement form conversion optimization suggestions engine.
- Build fraud detection system for card testing attacks.
- Implement Zapier integration and webhook system.
- Build WordPress plugin for one-click embedding.
- Build import tools for NPSP, NPC, Bloomerang, and generic CSV formats.

## Days 11–14: Polish & Launch Prep

- Security review. Verify PCI SAQ A compliance. Test all payment flows.
- Performance optimization. Donation form must load in under 2 seconds on 3G.
- Build marketing website with comparison pages, pricing explanation, and signup flow.
- Recruit 10–20 beta nonprofits from founder's network. Offer free migration.
- Launch SEO content engine: publish first 10 blog posts targeting core keywords.
- Set up G2 and Capterra profiles. Begin soliciting reviews from beta users.
- Begin daily dashboard review cadence for the coordinator agent.

---

# 10. Glossary of Nonprofit Domain Terms

This glossary is critical for the AI agent team. Nonprofit fundraising has specialized terminology that, if misunderstood, will result in incorrectly built features. Reference this when implementing any feature.

| Term | Definition |
|------|-----------|
| **LYBUNT** | "Last Year But Unfortunately Not This Year" — donors who gave last year but haven't given this calendar year. A critical retention report. |
| **SYBUNT** | "Some Year But Unfortunately Not This Year" — donors who gave in any previous year but not this year. |
| **Soft Credit** | Attribution of a gift to someone other than the actual donor, typically a spouse, family member, or fundraiser who solicited the gift. The soft-credited individual did not make the payment but is recognized for their role. |
| **Gift Split** | A single donation allocated across multiple funds, campaigns, or designations. Example: a $1,000 gift split $600 to General Fund and $400 to Building Campaign. |
| **Pledge** | A commitment to give a specific amount over time. Pledges have payment schedules (e.g., $10,000 over 5 years at $2,000/year). Track both the pledge total and each payment against it. |
| **Moves Management** | The process of moving a prospective major donor through stages: identification → qualification → cultivation → solicitation → stewardship. Each stage has specific actions and metrics. |
| **Fund/Designation** | The specific purpose or program a donation supports. Nonprofits must track designations for accounting, board reporting, and donor intent compliance. |
| **Tribute Gift** | A donation made in honor of or in memory of someone. Requires tracking the honoree, notifying them (if "in honor"), and proper tax receipting. |
| **DAF (Donor Advised Fund)** | A charitable giving vehicle managed by a sponsoring organization (e.g., Fidelity Charitable, Schwab Charitable). Donors contribute to the fund, receive an immediate tax deduction, and recommend grants to nonprofits over time. |
| **Matching Gift** | A corporate program where employers match their employees' charitable donations, typically 1:1. Requires identifying eligible donors and tracking match status. |
| **Recurring/Sustainer** | A donor who gives on an automatic schedule (monthly, quarterly, annually). Recurring donors have dramatically higher retention and lifetime value. |
| **Annual Fund** | The yearly fundraising campaign that supports an organization's general operations. The backbone of most nonprofits' fundraising. |
| **Stewardship** | The ongoing process of thanking, engaging, and reporting back to donors to maintain their relationship and encourage future giving. |
| **Major Gift** | A large donation, typically starting at $1,000–$10,000+ depending on the organization's size. Major gifts are personally solicited and managed through moves management. |
| **Planned Gift** | A charitable gift arranged during a donor's lifetime but typically realized at death (bequests, charitable trusts, gift annuities). Very high value, long cultivation cycle. |
| **NPSP** | Nonprofit Success Pack. Salesforce's legacy open-source package for nonprofits built on top of Sales Cloud. Uses Contacts, Opportunities, and an Account/Household model. No new features since March 2023 but still actively used by thousands of nonprofits. |
| **NPC** | Nonprofit Cloud. Salesforce's modern replacement for NPSP. Uses Person Accounts, Gift Commitments, Gift Transactions, and OmniStudio. Fundamentally different data architecture requiring full re-implementation to migrate from NPSP. |
| **GivingTuesday** | Annual global giving day held the Tuesday after Thanksgiving (late November). Raised $4.0 billion in 2025. A critical fundraising moment for most nonprofits. |
| **Fund-a-Need / Paddle Raise** | A live event fundraising technique where attendees pledge specific dollar amounts for a designated need. Requires real-time pledge tracking and follow-up. |
| **EIN** | Employer Identification Number. The nonprofit's IRS tax ID. Required on all tax receipts. |
| **501(c)(3)** | IRS designation for tax-exempt charitable organizations. Donations to 501(c)(3) organizations are tax-deductible. Our platform serves these organizations. |
| **In-Kind Gift** | A non-cash donation of goods, services, or property. Must be tracked separately from cash gifts with fair market value documentation. |
| **Acquisition Rate** | The rate at which new donors are acquired. Healthy programs acquire 1 new donor for every 3 retained. |
| **Retention Rate** | The percentage of donors who gave in the previous period and gave again in the current period. Industry average: 42.9%. First-year retention: ~19%. |
| **Lifetime Value (LTV)** | The total value of all gifts a donor will make over their relationship with the organization. Average recurring donor LTV: $7,604. |

---

# 11. Change Log

This section should be updated by the coordinator agent whenever significant changes are made to this document.

| Date | Change | Rationale |
|------|--------|-----------|
| March 2026 | v2.0 — Document created. Compressed from 5-phase/24-month roadmap to 4-phase/30-week roadmap. AI features elevated across all phases. NPSP+NPC dual support added. DAF strategy elevated to Phase 1. Glossary added. | AI-agent development velocity enables faster timeline. NPSP-only focus was a strategic error — both NPSP and NPC organizations are migration targets. DAF giving is too important to defer. Domain glossary prevents AI agent misinterpretation of specialized terms. |

---

This is a living document. It will evolve as we learn from customers, iterate on the product, and respond to market changes. But the principles are fixed: AI-native, honest pricing, exceptional design, and deep domain expertise. Everything else follows from there.

The coordinator agent is empowered to revise this document as needed. Log changes, explain rationale, and keep building.

Now let's build it.
