# Give — Business Model Decisions

> **Last updated:** 2026-02-28
> **Status:** Research complete. All 5 decisions made.

This document captures the research, options, and final decisions for the core business model questions from PLAN.md Section 10. Each section includes competitive data, tradeoffs, and a clear recommendation.

---

## 1. Company Structure — LLC vs C-Corp

### Context
Give is bootstrapped under Datawake. No outside investment planned yet. Operates in California. Processes payments via Stripe Connect.

### Options

#### Option A: California LLC (Recommended)
**Formation cost:** ~$70 (CA SOS filing)
**Annual cost:** ~$1,300/year (CA franchise tax $800, Statement of Information $20, simple tax prep ~$500)

**Pros:**
- Pass-through taxation — profits taxed once at personal rate, not double-taxed
- Simpler operations — no board meetings, no annual minutes, lighter formalities
- S-Corp election available when profitable: pay yourself reasonable salary (~$75-100K), distribute the rest as non-SE-taxable distributions. At $150K profit, saves ~$11,475/year in self-employment tax
- Stripe Connect works identically for LLCs — no entity type restrictions
- Conversion to C-Corp is straightforward when needed (~$2,000–5,000, 2–4 weeks)

**Cons:**
- Cannot issue stock options (use profit interests instead — more complex)
- VCs require C-Corp before a priced round (but conversion is routine)
- QSBS tax exclusion (up to $15M in capital gains excluded after 5+ years) only applies to C-Corp stock — clock resets at conversion

#### Option B: Delaware C-Corp (via Stripe Atlas or direct)
**Formation cost:** $500 (Stripe Atlas) or ~$160 (direct DE + CA foreign qualification)
**Annual cost:** ~$2,100–4,000/year (DE franchise tax $175-400 min, CA $800, registered agents in both states, more complex tax prep)

**Pros:**
- VC-ready from day one — no conversion needed if fundraising
- QSBS clock starts immediately — maximum tax exclusion on exit
- Standard docs (SAFEs, stock purchase agreements) already written for Delaware law
- Court of Chancery — predictable, VC-friendly corporate law

**Cons:**
- ~$800–2,700/year more expensive than CA LLC (paying franchise tax in both states)
- 21% corporate tax rate (vs pass-through for LLC), then dividend tax if you take profits out
- Double taxation on profits if you distribute earnings
- More governance overhead (board, minutes, corporate resolutions)

#### Option C: Delaware LLC (via Stripe Atlas)
Stripe Atlas now supports this. Combines Delaware law familiarity with LLC pass-through taxation. Still requires foreign qualification in California, doubling state fees. Rarely recommended — most of the C-Corp benefits require actually being a C-Corp.

### Decision: **California LLC**

Start as a California LLC. Convert to Delaware C-Corp when one of these triggers hits:
- VC term sheet arrives (they will require it; often cover conversion cost)
- You want to issue employee stock options (ISOs/NSOs are far simpler in a C-Corp)
- Annual profit is high enough that QSBS $15M exclusion becomes meaningful

**Skip Stripe Atlas for now.** File directly with CA SOS for $70. Atlas ($500) is better suited for non-US founders or when you convert to a Delaware C-Corp later.

**S-Corp election:** File IRS Form 2553 when Give's net profit consistently exceeds ~$70K/year.

---

## 2. Donor Fee Coverage — Opt-In vs Opt-Out

### Context
Donate forms can include a checkbox asking donors to cover Give's 1% platform fee and/or Stripe processing fees. The question is whether that checkbox is pre-checked (opt-out) or unchecked (opt-in).

### What Competitors Do

| Platform | Mechanism | Default State | Adoption Rate |
|----------|-----------|:------------:|:-------------:|
| Givebutter | Tip dropdown (10/12/15%) | 15% pre-selected | ~95% (claimed) |
| Zeffy | Tip dropdown (17% default) | Pre-selected; no easy opt-out | Very high |
| Give Lively | Checkbox | Configurable (org-level setting) | Not published |
| Donorbox | Checkbox | Configurable | 50-65% opt-in / 75-85% pre-checked |
| Fundraise Up | AI-adaptive (5 modes) | Per-mode | 92% (adaptive) |
| Classy / GoFundMe Pro | Checkbox + animated nudge | **Unchecked (recommended)** | 55-60% |
| Qgiv (Bloomerang) | "GiftAssist" checkbox | Configurable | 50%+ |

### Conversion Data

**Opt-in (unchecked):** 50–70% of donors choose to cover fees when offered, with no meaningful conversion penalty.

**Opt-out (pre-checked):** Adoption rises to 75–85%, but with documented downsides:
- NextAfter / ACI controlled experiment: **38.5% decrease in donation form conversion** when fee question introduced poorly; 20.5% less total revenue despite higher fee coverage rate
- Givelify study: donors who cover fees on their first gift are **14% less likely to donate again**
- FTC classifies pre-checked boxes for additional charges as a **dark pattern** (Unfair or Deceptive Fees Rule)
- AG investigations in NY, CT, MD, MN targeted ActBlue and WinRed specifically for pre-checked donation add-ons

**Regulatory risk:** EU/GDPR explicitly prohibits pre-ticked checkboxes as consent. Applies to any nonprofit receiving EU donors regardless of platform location.

### Options

**Option A: Opt-in (unchecked) — platform default, not configurable**
Simple, safe, brand-aligned. 50–70% adoption. Zero regulatory risk.

**Option B: Opt-in (unchecked) — platform default, configurable by org (Recommended)**
Give defaults to unchecked (transparent, ethical). Orgs can enable pre-checked if they choose to take on that configuration. Captures the adoption upside for orgs who want it, while Give's brand stays clean.

**Option C: Pre-checked — platform default**
Maximizes per-transaction fee coverage (~80–85%) but at the cost of Give's transparency brand, conversion risk, and regulatory exposure. Directly contradicts "we never pre-check boxes or add hidden tips" positioning.

### Decision: **Opt-in by default, configurable per org**

- **Platform default:** Unchecked checkbox
- **Org setting:** Allow orgs to enable pre-checked as an opt-in (they own that tradeoff)
- **Copy:** "Add $[exact dollar amount] so 100% of your gift reaches [org name]" — always show dollars, not percentages
- **Round 1 upgrade:** Animated nudge (Classy-style) to lift adoption by ~33% without pre-checking
- **Round 2/3 Pro feature:** AI-adaptive prompting (Fundraise Up model) — 92% adoption without hurting conversion

**Marketing angle:** "We never pre-check boxes. No donor tips. No hidden fees. When donors cover fees, it's because they chose to."

---

## 3. Free Tier / Trial — How Much Free Before 1% Kicks In

### Context
The 1% platform fee is Give's revenue model. Should there be any free runway before it starts? And if so, what shape should it take?

### What Competitors Offer

| Platform | Model | Effective Free Tier |
|----------|-------|:------------------:|
| Givebutter | Tips-enabled model + 30-day trial on Plus | Free (tip-funded) |
| Zeffy | 100% free (donor tips fund it) | Unlimited free |
| Give Lively | 100% free (philanthropist-funded) | Unlimited free |
| Donorbox | 2.95% from dollar one | None |
| Fundraise Up | 4% from dollar one | None |
| Classy | $299/mo + fees | None |

Competitors either charge from dollar one or fund "free" via donor tips/philanthropy. **No platform currently offers a volume-limited free tier.** This is a gap.

### Options

#### Option A: 1% from dollar one. No free tier.
Simplest. Every dollar processed generates revenue. Clean messaging: "1% flat, always."

**Pros:** Immediate revenue, no gaming risk, simplest engineering
**Cons:** No "try it free" hook. Harder pitch to orgs evaluating multiple platforms. Psychologically, paying from dollar one feels like a commitment even at 1%.

#### Option B: Time-limited trial (e.g., 90 days free)
Give the first 90 days at no platform fee, then 1% kicks in.

**Pros:** Clear, familiar model
**Cons:** Penalizes careful, deliberate nonprofits that take time to evaluate and get board buy-in. A large org could process $500K in 90 days and pay nothing. Clock starts ticking before they see real value. Research shows 30-day trials outperform 90-day on conversion (Basecamp data).

#### Option C: Volume-limited free tier — First $10K in donations fee-free (Recommended)

**Pros:**
- Self-qualifying: only orgs processing real donations hit the threshold
- Aligned incentives: Give earns only after the nonprofit has received $10K in value
- Massively efficient CAC: $100 foregone revenue per org vs. industry avg CAC of $702
- Novel positioning: no competitor offers this — "Your first $10,000: zero platform fees"
- Fair: every org gets the same dollar benefit regardless of timing or how fast they launch
- Natural conversion: orgs processing $50K–$200K/year hit the threshold in 1–3 months; fee kicks in automatically without a purchasing decision

**Revenue impact (Year 1 — 500 orgs):**
- Foregone revenue: $100/org × 500 = **$50K**
- Against $600K projected revenue = 8.3% reduction
- If the free tier drives 500 orgs instead of 350 without it: net positive

**Cons:** Must track per-org cumulative donation volume; risk of EIN-based gaming (mitigate with EIN deduplication on signup).

### Decision: **First $10,000 in donations fee-free per org**

- Enforce via EIN deduplication (one free threshold per nonprofit, not per account)
- All features available immediately — this is not a feature gate
- Marketing copy: "Your first $10,000 in donations: zero platform fees. Then just 1%, always."
- Billing system: track `cumulative_donations` per org; apply `application_fee_amount` to Stripe charges only after threshold is crossed

---

## 4. Enterprise Tier — Custom Pricing for Large Orgs

### Context
At $1% on $5M in donations, Give earns $50K/year from that org. At $10M, $100K/year. At some volume, orgs will demand discounts; at some volume, that org is worth an account manager and SLA.

### Competitor Enterprise Pricing

| Competitor | Enterprise Model | Approx cost at $5M volume |
|-----------|-----------------|:-------------------------:|
| Givebutter | No enterprise tier (3% flat or tips) | $150K (3%) or ~$0 (tips) |
| Classy/GoFundMe Pro | $299/mo + ~4.4% transaction | ~$223K/yr |
| Blackbaud | Flat subscription, custom quoted | $50K–$150K/yr |
| Fundraise Up | 4% Quick Start or custom Enterprise | $200K (QS) |
| Donorbox | $150/mo + 1.75% Pro, or custom Premium | ~$89K/yr (Pro) |
| **Give** | **$0/mo + 0.75% Enterprise** | **$37.5K/yr** |

At $5M+ in annual donations, Give's 1% is already competitive — but volume discounts cement loyalty and prevent churn to Blackbaud.

### Trigger Point

**Enterprise pricing kicks in at $2M+ in annual online donations.** Below that, 1% is unbeatable and no discount is needed. Above that, a tiered structure rewards loyalty and prevents large orgs from price-shopping.

### Recommended Structure

| Tier | Platform Fee | Monthly Fee | Eligibility |
|------|:-----------:|:-----------:|-------------|
| **Basic** | 1% | $0 | All orgs |
| **Pro** | 2% | $0 | All orgs (more features) |
| **Enterprise** | 0.75% ($2M–$5M) | $0 | $2M+/year, annual contract |
| **Enterprise** | 0.5% ($5M–$10M) | $0 | $5M+/year, annual contract |
| **Enterprise** | Custom (min 0.25%) | $0 | $10M+/year, custom contract |

**Floor: 0.25%.** Below this, unit economics break down. At $25M × 0.25% = $62.5K revenue — still viable.

**Why no monthly fee at Enterprise:** Maintains Give's core brand promise. Differentiates from every competitor who charges monthly. "$0 monthly at every tier, including Enterprise" is a genuine differentiator.

### Enterprise Features (Justify the Relationship, Not the Price)

| Feature | Enterprise | Basic/Pro |
|---------|:----------:|:---------:|
| Dedicated account manager | Yes | No |
| SSO / SAML | Yes | No |
| White-label / custom branding | Yes | No |
| Custom domain for donation pages | Yes | No |
| SLA (99.9% uptime guarantee) | Yes | No |
| Multi-org / chapter management | Yes | No |
| Advanced API rate limits | Yes | Standard |
| Priority 24/7 support | Yes | Email only |
| Data migration services | Yes | Self-serve |
| Custom contract / invoicing | Yes | No |
| Quarterly business reviews | Yes | No |

### Differentiation Opportunity

No competitor publishes transparent enterprise pricing. Everything is behind "Contact Sales." Give could differentiate by **publishing the enterprise tier tiers openly** — trust-building in a market defined by opaque pricing.

### Decision: **Volume-based enterprise tier, triggered at $2M+, $0 monthly, published pricing**

---

## 5. Annual Billing for Pro Tier

### Context
Annual billing is a standard SaaS lever to reduce churn and improve cash flow. Does it make sense for Give's percentage-based model?

### The Core Problem

**You cannot meaningfully bill a percentage fee annually.** A 1% transaction fee is inherently usage-based — there is nothing to prepay when you don't know future donation volume. "Locking in a rate" is meaningless when the rate is already fixed.

To offer annual billing, Give would need to introduce a flat subscription fee component. That changes the core positioning from "no monthly fees, just 1%" to something more complex.

### What Competitors Do

| Competitor | Billing | Annual Discount |
|-----------|---------|:--------------:|
| Givebutter Plus | Monthly | None published |
| Donorbox | $80/mo or $820/yr | ~15% |
| Classy/GoFundMe Pro | Monthly or via sales | Negotiated |
| Bloomerang | Annual only ($125/mo = $1,500/yr) | N/A (no monthly option) |
| Zeffy / Give Lively | N/A (free) | N/A |

Among direct competitors with percentage models: none offer annual prepayment of the percentage. Only Donorbox (hybrid model with flat fee + percentage) offers meaningful annual billing.

### SaaS Annual Billing Benchmarks

- Median annual prepay discount: **18%** (Vendr 2024)
- Most popular: **"2 months free"** (~16.7%)
- Sweet spot: 15–20% — optimizes adoption (52–67%) while maintaining margins
- Annual subscribers churn **2–3x less** than monthly; 43% higher LTV
- Y Combinator recommends monthly billing during early growth for faster feedback loops
- Most SaaS startups introduce annual billing **18–24 months post-launch**

### Decision: **Do not launch with annual billing**

Reasons:
1. "No monthly fees, just 1%" is a competitive weapon — don't dilute it by inventing a flat fee
2. There is literally nothing to bill annually in a pure percentage model
3. Engineering cost (2–4 weeks for subscription billing, proration, dunning) better spent on core features
4. Biggest early risk is adoption, not churn — focus on getting orgs on the platform

**Revisit at month 6–12.** If Pro tier feature differentiation (AI tools, advanced automation, white-label, priority support) justifies a flat monthly fee, add annual billing at ~17% discount ("2 months free") on that flat fee only. Transaction percentages always bill monthly in arrears.

---

## Summary of Decisions

| Decision | Recommendation | Status |
|----------|---------------|--------|
| Company structure | California LLC → convert to DE C-Corp when VC/options needed | **DECIDED** |
| Donor fee coverage | Opt-in (unchecked) by default; configurable per org | **DECIDED** |
| Free tier / trial | First $10K in donations fee-free per org | **DECIDED** |
| Enterprise tier | $2M+ trigger; 0.75%/0.5%/custom; $0 monthly; published pricing | **DECIDED** |
| Annual billing | Do not launch with annual billing; revisit at month 6–12 | **DECIDED** |
