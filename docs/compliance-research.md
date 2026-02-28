# Give — Legal & Compliance Research

> **Research date:** 2026-02-28
> **Status:** Complete (5 sections)
> **Scope:** US launch requirements for a nonprofit fundraising platform using Stripe Connect Express
> **Important:** This is research, not legal advice. Retain qualified counsel before processing real donations.

---

## Table of Contents

1. [State Charitable Solicitation Registration](#1-state-charitable-solicitation-registration)
2. [PCI DSS 4.0.1 Compliance](#2-pci-dss-401-compliance)
3. [501(c)(3) Verification & Nonprofit Onboarding](#3-501c3-verification--nonprofit-onboarding)
4. [Privacy Policy & Terms of Service](#4-privacy-policy--terms-of-service)
5. [Money Transmitter Licenses](#5-money-transmitter-licenses)
6. [Key Decisions & Next Steps](#6-key-decisions--next-steps)

---

## 1. State Charitable Solicitation Registration

> **Full detail file:** `docs/state-registration-research.md`

### How Give's Model Triggers Registration

Give is **not** a pure payment processor. It:
- Hosts solicitation pages at `give.to/org-name`
- Controls form content and layout
- Receives compensation (1% fee) as a percentage of donations
- Has custody/control of funds via the Stripe Connect application fee mechanism (charges originate on Give's platform account before settling to the nonprofit's connected account)

Under most state statutes, this combination — solicitation + custody + percentage compensation — qualifies Give as a **Professional Solicitor / Professional Fundraiser**, not a mere technical vendor.

**Exception:** California and Hawaii have created a new "Charitable Fundraising Platform" (CFP) category that maps exactly to Give's business model.

### Summary Statistics

| Metric | Count |
|--------|-------|
| States requiring platform registration | **~38–40** |
| States with no registration requirement | **10** (DE, ID, IN, IA, MT, NE, SD, UT, VT, WY) |
| States with limited/conditional requirements | **3** (AZ, TX, MO) |
| States with CFP-specific law | **2** (CA effective 2024, HI effective July 2026) |
| States requiring surety bonds | **~35–38** |
| Surety bond range | $2,500 (OK) – $50,000 (FL) |
| Most common bond amount | $25,000 (CA, IL, LA, ME, MD, MA, NM, OH, PA, TN) |

### State-by-State Matrix

| # | State | Platform Must Register? | Category | Primary Statute | Bond | Annual Filing? |
|---|-------|------------------------|----------|-----------------|------|---------------|
| 1 | Alabama | **Yes** | Professional Fundraiser + CCV | Ala. Code 13A-9-70 | $10,000 | Yes |
| 2 | Alaska | **Yes** | Professional Fund Raiser | Alaska Stat. 45.68 | $10,000 | Yes |
| 3 | Arizona | **Limited** | Contracted Fundraiser | A.R.S. 44-6552 | Varies | Limited |
| 4 | Arkansas | **Yes** | Professional Fundraiser | Ark. Code 4-28-401 | $10,000 | Yes |
| 5 | California | **Yes — CFP + PF** | Charitable Fundraising Platform (AB 488) + Commercial Fundraiser | Cal. Gov. Code 12599, 12599.9 | $25,000 (PF); none (CFP) | Yes (both) |
| 6 | Colorado | **Yes** | Paid Solicitor | Colo. Rev. Stat. 6-16-101 | None | Yes |
| 7 | Connecticut | **Yes** | Paid Solicitor / Fund Raising Counsel | Conn. Gen. Stat. 21a-190a | $20,000 | Yes |
| 8 | Delaware | **No** | — | — | — | — |
| 9 | DC | **Yes** | Professional Fundraiser / Solicitor | D.C. Code 44-1701 | None confirmed | Yes |
| 10 | Florida | **Yes** | Professional Solicitor | Fla. Stat. ch. 496 | **$50,000** | Yes |
| 11 | Georgia | **Yes** | Paid Solicitor | Ga. Code 43-17-1 | $10,000 | Yes |
| 12 | Hawaii | **Yes — CFP + PF** | Charitable Fundraising Platform (Act 205) + Prof. Solicitor | Haw. Rev. Stat. 467B | Varies | Yes |
| 13 | Idaho | **No** | — | — | — | — |
| 14 | Illinois | **Yes** | Professional Fund Raiser | 225 ILCS 460 | $25,000 | Yes |
| 15 | Indiana | **No** | — | — | — | — |
| 16 | Iowa | **No** | — | — | — | — |
| 17 | Kansas | **Yes** | Professional Fundraiser | Kan. Stat. 17-1759 | Varies | Yes |
| 18 | Kentucky | **Yes** | Professional Solicitor | KRS 367.650 | Varies | Yes |
| 19 | Louisiana | **Yes** | Professional Solicitor / Fundraiser | La. R.S. 51:1901 | $25,000 | Yes |
| 20 | Maine | **Yes** | Professional Solicitor | Me. Rev. Stat. tit. 9, ch. 385 | $25,000 | Yes |
| 21 | Maryland | **Yes** | Professional Solicitor | Md. Code, Bus. Reg. 6-601 | $25,000 | Yes |
| 22 | Massachusetts | **Yes** | Professional Solicitor | Mass. Gen. Laws ch. 68, s. 32 | $25,000 | Yes |
| 23 | Michigan | **Yes** | Professional Fund Raiser | Mich. Comp. Laws 400.271 | $10,000 | Yes |
| 24 | Minnesota | **Yes** | Professional Fundraiser | Minn. Stat. 309.50 | $20,000 | Yes |
| 25 | Mississippi | **Yes** | Professional Fund Raiser | Miss. Code 79-11-501 | $10,000 | Yes |
| 26 | Missouri | **Conditional** | Professional Fundraiser | Mo. Rev. Stat. 407.450 | None confirmed | Yes |
| 27 | Montana | **No** | — | — | — | — |
| 28 | Nebraska | **No** | — | — | — | — |
| 29 | Nevada | **Yes** | Professional Fundraiser | Nev. Rev. Stat. 82C | Varies | Yes |
| 30 | New Hampshire | **Yes** | Paid Solicitor | N.H. Rev. Stat. 7:28 | $20,000 | Yes |
| 31 | New Jersey | **Yes** | Professional Fund Raiser | N.J. Stat. 45:17A-18 | $20,000 | Yes |
| 32 | New Mexico | **Yes** | Professional Fundraiser | N.M. Stat. 57-22-1 | $25,000 | Yes |
| 33 | New York | **Yes** | Professional Fund Raiser | N.Y. Exec. Law 171-a | $10,000 | Yes |
| 34 | North Carolina | **Yes** | Professional Solicitor | N.C. Gen. Stat. 131F | $20,000–$50,000 | Yes |
| 35 | North Dakota | **Yes** | Professional Fundraiser | N.D. Cent. Code 50-22 | $20,000 | Yes |
| 36 | Ohio | **Yes** | Professional Solicitor | Ohio Rev. Code 1716 | $25,000 | Yes |
| 37 | Oklahoma | **Yes** | Professional Fundraiser | Okla. Stat. tit. 18, 552.1 | $2,500 | Yes |
| 38 | Oregon | **Yes** | Professional Fundraiser | ORS 128.801 | Varies | Yes |
| 39 | Pennsylvania | **Yes** | Professional Solicitor | 10 P.S. 162.1 | $25,000 | Yes |
| 40 | Rhode Island | **Yes** | Professional Fundraiser / Solicitor | R.I. Gen. Laws 5-53.1 | $10,000 | Yes |
| 41 | South Carolina | **Yes** | Professional Solicitor | S.C. Code 33-56 | $15,000 | Yes |
| 42 | South Dakota | **No** | — | — | — | — |
| 43 | Tennessee | **Yes** | Professional Solicitor | Tenn. Code 48-101-501 | $25,000 | Yes |
| 44 | Texas | **Limited** | Fundraiser | Tex. Bus. & Com. Code 17.91 | $10,000 | Limited |
| 45 | Utah | **No** | — | — | — | — |
| 46 | Vermont | **No** | — | — | — | — |
| 47 | Virginia | **Yes** | Professional Solicitor | Va. Code 57-48 | $20,000 | Yes |
| 48 | Washington | **Yes** | Commercial Fundraiser | Wash. Rev. Code 19.09 | $15,000 | Yes |
| 49 | West Virginia | **Yes** | Professional Solicitor / Counsel | W. Va. Code 29-19 | $10,000 | Yes |
| 50 | Wisconsin | **Yes** | Professional Fundraiser | Wis. Stat. 440.41 | $20,000 | Yes |
| 51 | Wyoming | **No** | — | — | — | — |

### Priority Tier for Registration

**Tier 1 — Must register before launch:**
1. **California** — AB 488 (CFP law) + Commercial Fundraiser. Active enforcement (cease & desist issued Nov 2025). Form PL-1 with AG.
2. **New York** — AG Charities Bureau. Extremely strict. High enforcement history.
3. **Florida** — $50K bond. FDACS enforces. New SB 700 (July 2025) adds foreign donor restrictions.
4. **Pennsylvania** — $25K bond. Bureau of Charitable Organizations is aggressive.
5. **Ohio** — $25K bond. Registration expires March 31 annually.
6. **Massachusetts** — $25K bond. All filings via new Fundraiser Portal (Jan 2026).
7. **Connecticut** — $20K bond. Dept of Consumer Protection actively monitors.
8. **Illinois** — $25K bond. Individual solicitor licensing required.

**Tier 2 — Register before significant volume:**
All remaining states with PF/PS requirements, prioritized by nonprofit customer location.

**Tier 3 — No registration required:**
DE, ID, IN, IA, MT, NE, SD, UT, VT, WY (plus limited AZ/TX).

### California AB 488 — Charitable Fundraising Platform Law

This law was written specifically for platforms like Give. Key requirements:

- Register with CA AG on Form PL-1 ($625 fee)
- Annual renewal by January 15 (Form PL-2)
- Annual report by July 15 (Form PL-4)
- Only solicit for 501(c)(3)s in good standing with CA AG, FTB, and IRS
- Get written consent from each charity before soliciting on their behalf
- Segregate donor funds from operating funds
- Distribute donations promptly
- Maintain records for 10 years
- Display registration number on donation pages

**First enforcement action:** November 2025 (cease and desist issued). Nearly 1 in 5 platforms operating in CA were non-compliant as of late 2025.

### Hawaii Act 205 (Effective July 1, 2026)

Mirrors CA AB 488. Regulations still being drafted. Must register before July 1, 2026.

### Estimated Compliance Costs

| Cost Category | Year 1 | Year 2+ |
|--------------|--------|---------|
| Surety bond premiums (1–4% of face value) | $3,000–$8,000 | $3,000–$8,000 |
| State filing fees | $5,000–$15,000 | $3,000–$8,000 |
| Legal counsel (initial multi-state setup) | $15,000–$50,000 | — |
| Ongoing compliance service (Harbor Compliance, Labyrinth Inc) | $5,000–$15,000 | $5,000–$15,000 |
| **Total** | **$28,000–$88,000** | **$13,000–$38,000** |

### Architectural Implications

The platform needs to support:
1. **State disclosure engine** — Detect donor's state (IP geolocation or billing address) and display required registration number and disclosure language on donation forms
2. **Contract filing automation** — Generate state-compliant platform agreements when nonprofits onboard; include all required provisions (compensation terms, start/end dates, geographic scope)
3. **Financial reporting module** — Track contributions by state for annual state filings
4. **Audit trail** — Maintain detailed records of all donations, fees, and disbursements by state (10 years for CA)
5. **Charity compliance check** — Before enabling a nonprofit, verify it is in good standing in CA (AG registry, FTB, IRS TEOS) and other strict states

### Open Questions

- [ ] Confirm with attorney: Does Stripe Connect Express application fee model definitively constitute "custody or control" under state PF/PS definitions?
- [ ] Can we argue we are a "technical vendor / payment processor" exempt from PF/PS in any states? (Low probability, but worth exploring)
- [ ] Should we register in all 40 states at launch, or phase by nonprofit customer location?
- [ ] Do nonprofit customers need to file the Give relationship/contract with their own state AG?

---

## 2. PCI DSS 4.0.1 Compliance

### Stripe's Responsibility vs. Ours

**Stripe handles everything involving cardholder data:**
- All storage, processing, and transmission of card numbers, CVV, expiration dates
- Tokenization — raw card data never touches Give's servers
- Stripe Elements renders payment input fields in **iframes hosted on Stripe's servers** (`js.stripe.com`) — Give's JavaScript cannot access iframe contents
- PCI-compliant infrastructure, encryption at rest and in transit
- Dispute/chargeback management, fraud detection (Radar), 1099 reporting
- Automatic payouts to nonprofit bank accounts

**Give's PCI responsibilities** (even though Stripe handles card data):

| Requirement | What We Must Do |
|-------------|----------------|
| Annual SAQ A | Complete via Stripe's PCI Dashboard wizard; submit Attestation of Compliance (AOC) |
| Quarterly ASV scans | External vulnerability scans every 90 days (Req 11.3.2) — budget ~$100–500/yr |
| TLS 1.2+ everywhere | All pages, all resources served over HTTPS — Vercel handles this automatically |
| Script protection confirmation | Confirm donation pages are not susceptible to script-based attacks (new SAQ A criterion) |
| Critical patch SLA | Apply critical security patches within 30 days (Req 6.3.3) |
| Strong passwords + MFA | Admin accounts: 12+ char passwords, MFA required (Req 8) |
| Security policies | Written information security policy, incident response plan (Req 12.1, 12.10) |
| TPSP documentation | List all third-party service providers (Stripe, Vercel) with PCI status (Req 12.8) |
| 12-month log retention | Security event logs kept 12 months; 3 months immediately accessible (Req 10) |

### SAQ Type: SAQ A

Give qualifies for **SAQ A** — the simplest self-assessment (31 controls across 7 requirements), because:
- All payment processing is fully outsourced to Stripe (a PCI DSS Level 1 Service Provider)
- We use Stripe Elements (iframe-based) or Stripe Checkout (redirect-based)
- Card data never passes through Give's systems
- We are a card-not-present (e-commerce) merchant only

**If we ever built a custom payment form bypassing Stripe Elements, we would escalate to SAQ A-EP (~140 controls) or SAQ D (~300 controls). Never do this.**

### PCI DSS 4.0.1 Timeline

| Date | Event |
|------|-------|
| March 2024 | PCI DSS v3.2.1 retired |
| June 2024 | PCI DSS v4.0.1 released (clarifications only, no new requirements) |
| March 31, 2025 | All 51 future-dated v4.x requirements became **mandatory** |
| January 2025 | Revised SAQ A published (effective April 1, 2025) |

### The New SAQ A Eligibility Criterion (Critical)

The January 2025 SAQ A revision **removed** Requirements 6.4.3 (script inventory) and 11.6.1 (tamper detection) from SAQ A scope, but **added** a new eligibility criterion:

> Merchants must confirm their site is **not susceptible to attacks from scripts** that could affect the e-commerce system.

**How to satisfy this:**

**Option A (recommended):** Obtain written confirmation from Stripe that their Elements/Checkout integration provides built-in script attack protections, AND implement Content Security Policy headers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://js.stripe.com;
  frame-src https://js.stripe.com https://hooks.stripe.com;
  connect-src 'self' https://api.stripe.com;
  img-src 'self' data: https://*.stripe.com;
  style-src 'self' 'unsafe-inline';
```

**Option B:** Implement full script inventory + Subresource Integrity (SRI) on all third-party scripts + weekly change monitoring.

**Recommendation:** Use Option A. CSP headers are a one-time implementation; Stripe's confirmation is available through their PCI Dashboard.

### Quarterly ASV Scanning

Requirement 11.3.2 requires quarterly external vulnerability scans by a PCI SSC **Approved Scanning Vendor (ASV)**. This was **not** removed from SAQ A in the 2025 update.

- Scans must occur at least every 90 days
- Additional scan required after any significant change to infrastructure or application
- Vulnerabilities with CVSS score ≥ 4.0 must be remediated and re-scanned
- Vercel-hosted donation pages are in scope

**Recommended ASV vendors:** SecurityMetrics, Qualys, Trustwave, Sitelock, Rapid7 — typically $100–500/year for basic quarterly scanning.

### Annual PCI Compliance Checklist

**Mandatory:**
- [ ] Complete SAQ A via Stripe's PCI Dashboard
- [ ] Submit AOC (Attestation of Compliance) to Stripe
- [ ] Run quarterly ASV vulnerability scans (4× per year)
- [ ] Verify TLS 1.2+ on all pages
- [ ] Obtain script protection confirmation from Stripe and/or implement CSP
- [ ] Apply critical security patches within 30 days
- [ ] Review and update security policies and incident response plan
- [ ] Review TPSP list (Stripe, Vercel, etc.) and confirm their PCI compliance
- [ ] Verify 12-month log retention is working

**Best practice (defense-in-depth):**
- [ ] Implement CSP headers restricting scripts to self + js.stripe.com
- [ ] Enable MFA on all admin accounts (Stripe Dashboard, Vercel, GitHub, Give admin)
- [ ] Conduct annual penetration test (not required for Level 4 merchants, but recommended)
- [ ] Maintain script inventory for donation pages

**Never:**
- Handle raw card numbers — always use Stripe Elements or Checkout
- Log or store card numbers, CVV, or magnetic stripe data
- Serve payment pages over HTTP
- Include untrusted third-party scripts on donation pages
- Build a custom payment form that bypasses Stripe Elements

---

## 3. 501(c)(3) Verification & Nonprofit Onboarding

### Core Finding: No IRS REST API Exists

**The IRS offers no public REST API for real-time EIN lookup.** All programmatic access is via monthly bulk downloads. The three IRS datasets are:

| Dataset | What It Contains | Download URL | Freshness |
|---------|-----------------|--------------|-----------|
| **IRS Publication 78** | ~1.5M orgs eligible for tax-deductible contributions. If an EIN appears here with deductibility code **A**, it is a 501(c)(3) public charity. Gold standard. | `apps.irs.gov/pub/epostcard/data-download-pub78.zip` | Monthly |
| **IRS EO BMF** | ~1.94M tax-exempt orgs including 501(c)(4), (c)(6), etc. More comprehensive than Pub 78. Key fields: EIN, name, address, NTEE code, subsection code, ruling date. | `irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf` (per-state CSVs) | Monthly |
| **IRS Auto-Revocation List** | Orgs that lost 501(c)(3) status for failure to file 990 for 3 consecutive years. **This is the block list.** | `apps.irs.gov/pub/epostcard/data-download-revocation.zip` | Monthly |

All three update on the **2nd Monday of each month**, with a ~4–6 week lag between IRS status changes and data appearance. Acceptable risk.

### Recommended Verification APIs

#### MVP: Pactman Nonprofit Check Plus API (Best Option)

Launched May 2025; self-service portal added December 2025. Aggregates all three IRS datasets (Pub 78 + EO BMF + Auto-Revocation) plus OFAC into a single EIN-lookup REST API — exactly what we'd otherwise self-host.

- **Free tier:** 200 checks/month, no credit card required, instant self-service access
- **Response:** Structured JSON with 40+ nonprofit fields
- **Suitable for:** MVP through first ~200 signups/month
- **Plan:** Migrate to self-hosted IRS bulk data around 200+ signups/month when Pactman paid tiers kick in

#### Post-MVP: Self-Hosted IRS Bulk Data (Zero Cost at Scale)

- Monthly cron downloads and parses the three IRS ZIP files
- Load into PostgreSQL `nonprofit_registry` table (EIN as primary key + indexed)
- Nightly diff: compare active Give accounts against updated revocation list; trigger alerts on matches
- Zero marginal cost per lookup; same monthly freshness as Pactman

#### ProPublica Nonprofit Explorer API (Enrichment Only — Not for Verification)

- `GET https://projects.propublica.org/nonprofits/api/v2/organizations/{EIN}.json`
- Free, no API key, no formal rate limit
- Returns: 990 filings back to 2001, revenue, expenses, officer compensation, NTEE code
- Use for: Post-signup donor-facing transparency ("View this org's financials"). **Not** for primary status verification — ~1 year lag behind IRS filing cycle.

#### Candid/GuideStar API (Skip for Basic Verification)

- Essentials API: $4,800+/year | Charity Check API: $2,750+/year | Premier: $9,900+/year
- Requires sales contact; days to get access
- Givebutter uses Candid but their email domain-match check fails orgs using Gmail or shared hosting
- **Skip Candid for basic EIN verification** — IRS bulk data is free and equally authoritative. Revisit only for a future enterprise compliance badge feature.

### Recommended Onboarding Flow

**Step 1 — EIN Entry + Pactman Lookup (instant, automated):**

```typescript
// MVP pseudocode
const result = await pactman.checkEIN(normalizeEIN(ein));

if (result.pub78_deductibility === 'A')
  return { status: 'approved' };                            // Instant ✓

if (result.auto_revoked)
  return { status: 'revoked', link: 'irs.gov/reinstatement' }; // Blocked ✗

if (result.eo_bmf_found && !result.pub78_found)
  return { status: 'approved_non501c3' };                   // Allow, different receipt

return { status: 'not_found', action: 'self_cert_or_upload' }; // Edge case
```

**Step 2 — Stripe Connect KYC (automated):**
Stripe's Express onboarding handles identity verification, bank account verification, OFAC/FinCEN watchlist screening, and ongoing monitoring. We do not need to duplicate this.

**Step 3 — Edge cases (see below).**

**Do NOT require IRS determination letter upload for standard orgs** — it kills conversion. The letter is the fallback for edge cases only.

### Special Cases

| Case | Handling |
|------|---------|
| **Churches / religious orgs** | Auto-exempt under IRC §508(c); not required in Pub 78. Accept self-certification checkbox with EIN. Flag ~20% for light manual spot-check during beta. |
| **New orgs (<27 months)** | May not appear in bulk data yet. Accept EIN + determination letter upload. Set `pending_verification`, block payouts, re-check monthly when IRS data updates. |
| **Fiscal sponsors** | Verify the fiscal sponsor's EIN (the legal 501(c)(3)), not the project. Require fiscal sponsorship agreement upload. |
| **Foreign orgs** | Not supported at MVP. Round 2 feature with appropriate legal review. |
| **Schools / government** | Accept with self-certification (auto-exempt). |
| **501(c)(4), (c)(6), etc.** | Allow onboarding but clarify donations are not tax-deductible. Different receipt template. |
| **Revoked** | Block with clear IRS reinstatement link. Log attempt. |

### Competitor Comparison

| Platform | Verification Method | Speed |
|----------|-------------------|-------|
| **Give Lively** | EO BMF + Pub 78 + Auto-Revocation (correct architecture!) | 5–7 days (still manual!) |
| **Donorbox** | EIN → IRS data | Near-instant |
| **Givebutter** | Candid + email domain match | 1–3 days; fails orgs using Gmail |
| **Zeffy** | EIN + name match, accepts all 501(c) types | Manual approval |
| **GoFundMe/Classy** | Comprehensive application | Days to weeks |
| **Stripe (nonprofit pricing)** | IRS determination letter + EIN, manual | Days |
| **Give (target)** | Pub 78 via Pactman → instant approval | **Instant for clean lookups** |

**Give's UX target:** Give Lively uses the right data sources but still forces manual review — the gatekeeping is their biggest onboarding weakness. We replicate their data rigor with instant automated approval.

### Bonus: Handle Stripe Nonprofit Pricing Application

Stripe's nonprofit processing discount (2.2% + $0.30 vs standard 2.9% + $0.30) requires a manual application to nonprofit@stripe.com with EIN + determination letter. No competitor handles this for their customers. Give could submit this on behalf of verified orgs during onboarding — removing a friction point and saving nonprofits 0.7% on every card transaction.

### Ongoing Monitoring

- **Monthly:** Sync latest IRS bulk files; diff active accounts against updated Auto-Revocation List
- **On revocation match:** (1) Pause new campaigns, (2) Continue pending transactions 30-day cure window, (3) Email admin immediately, (4) Suspend payout access after 30 days if not reinstated
- **Annual re-check:** Re-verify all active orgs against Pub 78 + revocation list (zero cost)
- **990 gap alert (ProPublica):** Flag orgs with no 990 in 2+ years — they're heading toward revocation
- **CA AG check:** For orgs soliciting in California, verify good standing with CA AG registry (required by AB 488)

---

## 4. Privacy Policy & Terms of Service

### Privacy Policy — Required Clauses

#### Legally Required (federal and state law)

| Clause | Why Required | Key Content |
|--------|-------------|-------------|
| **Data collected** | All state privacy laws | Separate sections for donors (name, email, address, donation amounts, IP/browser) and nonprofits (org name, EIN, admin contact, Salesforce OAuth tokens). Note: payment card data collected by Stripe, not Give. |
| **How data is used** | All state privacy laws | Processing donations, sending receipts, platform analytics, product improvement. No sale of personal data. |
| **Third-party sharing** | CCPA/CPRA + all state laws | Name specific vendors: Stripe (payment processing), email provider (Resend/Postmark), analytics (if used), error tracking (Sentry), cloud infrastructure (Vercel, Railway/Fly.io). Each vendor disclosure should state purpose and link to their privacy policy. |
| **Cookies** | CCPA, EU (if any EU donors) | Cookie categories: strictly necessary (auth, CSRF), functional (preferences), analytics (if used). Cookie consent banner if targeting EU. |
| **Data retention** | CCPA/CPRA | Donation records: 7 years (IRS audit requirement). User accounts: duration of relationship + 3 years. Donor data after org leaves platform: 30-day export window, then deletion within 90 days. Stripe payment data: retained by Stripe per their policies. |
| **Rights of data subjects** | CCPA/CPRA + 20+ state laws | Right to know, right to delete, right to correct, right to opt out of sale (we don't sell), right to data portability. Include a form or email address for requests. Response SLA: 45 days. |
| **Children's data** | COPPA | Platform is not directed at children under 13. Do not knowingly collect data from children. If discovered, delete immediately. |
| **Security** | Good practice; required by some state laws | PCI DSS compliance statement, encryption in transit (TLS 1.2+), Stripe handling card data, access controls. Do not make promises we cannot keep. |
| **Contact information** | Most state privacy laws | Give's name, address, privacy contact email. |
| **Effective date / updates** | All state privacy laws | Date policy became effective. How users will be notified of material changes (email for existing users). |

#### Best Practice (recommended)

| Clause | Content |
|--------|---------|
| **Donor data ownership** | "Nonprofits own their donor data. We are a processor, not a controller, of donor personal data on behalf of the nonprofit." This is a competitive differentiator — state it explicitly. |
| **Data portability** | "Nonprofits may export all donor data at any time in CSV format, free of charge." |
| **No data lock-in pledge** | "If you leave Give, your donor data is yours. We will provide a full export and delete your data within 90 days." |
| **GDPR acknowledgment** | Even if not legally required for a US-only platform, acknowledge GDPR rights for any EU residents who donate through our nonprofits. |
| **California-specific** | Explicit CCPA/CPRA rights section. Include "Do Not Sell or Share My Personal Information" opt-out (we don't sell data, but state it explicitly). |
| **Data Processing Agreement** | For nonprofits subject to GDPR who use Give, offer a standard DPA as an exhibit to the Terms. |

### Applicable Laws (as of 2026)

| Law | Scope | Threshold |
|-----|-------|-----------|
| **CAN-SPAM** | Commercial email from Give | Applies to all commercial email. Unsubscribe mechanism required on all non-transactional emails. |
| **CCPA/CPRA (CA)** | Consumers in California | $26.625M gross revenue OR 100K consumers' data OR 50% revenue from data sales. Give likely won't hit these thresholds early but build for it from day 1. |
| **Nebraska Privacy Act** | Nebraska residents | **No threshold** — applies to all businesses. |
| **Rhode Island, Delaware, New Hampshire, Maryland** | Residents | 35,000 consumers threshold (low) |
| **Virginia VCDPA, Colorado CPA, Connecticut CTDPA** | Residents | 100,000 consumers threshold |
| **Texas, Florida, Montana, Oregon, Indiana** | Residents | Various thresholds; check current law |

**Practical recommendation:** Build privacy practices to CCPA/CPRA standards from day 1. CCPA is the strictest US law and satisfies the requirements of all 20+ state privacy laws currently in effect.

### Terms of Service — Key Clauses

| Clause | What to Include |
|--------|----------------|
| **Platform role** | Give is a technology platform, not a charity, fundraiser, financial institution, or money services business. We do not solicit charitable contributions on behalf of any organization — we provide tools that enable organizations to solicit on their own behalf. |
| **Who can use Give** | Only verified 501(c)(3) public charities in good standing with the IRS. Schools, government entities, and religious organizations may apply. Private foundations require approval. |
| **Prohibited content** | Fraudulent campaigns, campaigns without proper 501(c)(3) status, content that is illegal, hateful, or deceptive, campaigns by individuals (not organizations). |
| **Platform fees** | 1% of all donations processed (Basic tier) or 2% (Pro tier). Stripe processing fees are passed through at cost (~2.2% + $0.30 for cards, 0.8% capped at $5 for ACH). No monthly fees, no setup fees, no hidden fees. |
| **Fee coverage** | Optional "cover the fee" checkbox on donation forms. Donor-configurable by organization. Revenue from fee coverage supplements platform revenue. |
| **Payment processing** | Payment processing is provided by Stripe Payments Company. Give is not a payment processor. Stripe's Terms of Service and Connected Account Agreement apply and are incorporated by reference. |
| **Stripe Connect disclosure** | As required by Stripe: disclose Stripe's role as payment processor, acquirer information, and the fact that nonprofits' banking relationship is with Stripe (and their designated bank partners). |
| **Tax receipts** | Give provides automated donation receipts for organizations' convenience. Give does not provide tax advice. Whether a donation is tax-deductible depends on the donor's tax situation and the organization's status. Consult a tax advisor. |
| **Payouts** | Automatic daily/weekly payouts to nonprofit's connected bank account. Payout timing subject to Stripe's payout schedules and account standing. Give may delay payouts in cases of suspected fraud, chargebacks, or account review. |
| **Refunds and chargebacks** | Donors may request refunds within 120 days (aligned with Stripe's dispute window). Refunds and chargebacks are debited from the nonprofit's account. Give does not guarantee refund outcomes. |
| **Account termination** | Give may terminate or suspend accounts for: violation of ToS, suspected fraud, platform fee non-payment, failure to maintain good standing with IRS, or at Give's discretion with 30 days notice. Upon termination, a 30-day window for data export is provided. |
| **Data portability** | Nonprofits own their donor data and may export it at any time. |
| **Intellectual property** | Give owns the platform, trademarks, and software. Nonprofits retain ownership of their content (org info, campaign descriptions, images). |
| **Limitation of liability** | LIMITATION OF LIABILITY CAP: Give's total liability shall not exceed the greater of (a) fees paid to Give in the 12 months prior to the claim, or (b) $100. EXCLUSION OF CONSEQUENTIAL DAMAGES. |
| **Indemnification** | Nonprofit indemnifies Give against claims arising from: misrepresentation of nonprofit status, prohibited content, third-party claims from donors, use of platform in violation of law. |
| **Dispute resolution** | **Binding arbitration** (JAMS rules), individual claims only, **class action waiver**. Small claims court exception. (Industry standard — Givebutter uses this.) |
| **Governing law** | California (where Give is incorporated). |
| **Modifications** | Give may modify ToS with 30 days notice via email and platform notification. Continued use = acceptance. |

### Competitor Analysis

#### Givebutter

**Terms of Service:** Givebutter explicitly positions as a technology platform, not a fundraiser. Uses binding arbitration with class action waiver. Claims they are "not a payment processor, money services business or other financial institution" (Stripe boilerplate). Notably, their acceptable use policy has broad discretion for account termination.

**Privacy Policy (weaknesses):**
- Explicitly states "not required to comply with CCPA" (this appears to be based on their size at time of writing, but is risky language)
- No data retention policy
- No GDPR provisions
- No explicit donor data portability rights
- Claims "perpetual, irrevocable" license to user content (aggressive)

**Give opportunity:** Be more transparent and nonprofit-friendly. Explicitly state: "Your donor data belongs to you. We hold it on your behalf. Take it with you when you leave. Free."

#### Zeffy

**Terms of Service:** Shorter and simpler. Identifies itself as a technology platform. Mentions their tip-based revenue model. Standard IP and limitation of liability clauses.

**Privacy Policy (strengths):**
- Claims GDPR, CCPA, and PIPEDA compliance
- Identifies as "data controller" for European purposes
- Lists specific third-party vendors with links to their privacy policies
- States data portability as a right

**Give opportunity:** Match Zeffy's transparency on data rights, but go further with explicit "data ownership" language and a published DPA.

### Stripe Connect Required Disclosures

Stripe requires all Connect platforms to include in their Terms of Service:
1. Reference to the Stripe Connected Account Agreement (and that it governs the nonprofit's Stripe relationship)
2. Stripe's role as the payment processor
3. Stripe's acquiring banks and contact information (see Stripe's requirements page)
4. Notice that Give and Stripe may share data about connected accounts
5. Acknowledgment that Stripe may suspend accounts independently of Give

---

## 5. Money Transmitter Licenses

### Core Finding: Stripe Connect Express Shields Give from MTL Requirements

**Give does not need state money transmitter licenses** under the Stripe Connect Express structure, because:

1. Give **never holds, touches, or controls** donor funds — money flows from donor → Stripe → nonprofit's connected Stripe account
2. Give's `application_fee_amount` is collected and remitted within Stripe's settlement system (Stripe-to-Stripe), not a consumer fund transmission
3. Stripe Payments Company holds MTLs in all 49 licensing states (Montana has no MTL requirement)
4. Stripe's Connect documentation explicitly states this is by design: "Stripe created Connect to ensure that Platforms do not come into possession or control of funds."

**This protection is structural.** If Give ever held donor funds in a Give-controlled bank account before remitting to nonprofits, the analysis would flip and MTLs would be required.

### FinCEN MSB Registration: Not Required

Give does **not** need to register as a Money Services Business (MSB) with FinCEN because:

- The **payment processor exemption** (31 C.F.R. § 1010.100(ff)(5)(ii)) applies: Give facilitates payment for charitable services, operates through Stripe's BSA-regulated clearance network, and acts pursuant to a formal agreement with each nonprofit
- FinCEN administrative ruling FIN-2014-R010 confirms that platforms acting as agents for the merchant/payee — receiving and transmitting funds as part of payment settlement — are not MSBs
- Stripe is the licensed MSB performing the actual money transmission

**Industry precedent:** Givebutter's ToS explicitly states: "Givebutter partners with Stripe Payments Company for money transmission services... Company is not a payment processor, money services business or other financial institution." Give should adopt identical language.

### Agent of Payee Doctrine

This is Give's strongest legal shield at the state level. The doctrine holds that a company receiving funds from a payor as the **disclosed agent of the payee** is not a money transmitter, because the payor's obligation is satisfied upon receipt by the agent.

Applied to Give:
- The **nonprofit (501(c)(3))** is the payee
- **Stripe** (acting through Give's platform account) is the agent of the payee
- Give is a sub-agent / technology facilitator in the payee's chain

**California (most important state):** In 2021, DFPI finalized rules (Cal. Code Regs. tit. 10, §80.126.30) explicitly confirming that 501(c)(3) charitable activities qualify as "services" for the agent of payee exemption. This resolved the previously uncertain status of donation platforms in California.

**To properly invoke this doctrine, Give must:**
1. Have a written agreement with each nonprofit authorizing Give and Stripe to receive donations as agent for the nonprofit
2. Only process donations for verified 501(c)(3)s in good standing
3. Never commingle donor funds with Give operating funds
4. Settle exclusively through Stripe's BSA-regulated network
5. Include money transmitter disclaimers in ToS (see Section 4)

### State-by-State MTL Analysis (Key States)

| State | Agent of Payee Exemption | Notes for Give |
|-------|--------------------------|----------------|
| **California** | Yes (codified 2021, Cal. Code Regs. tit. 10, §80.126.30) | No MTL needed. But **CA AB 488 charitable fundraising platform registration is required** (see Section 1). |
| **New York** | Yes (NY Banking Law §641(1)) | Explicitly exempts "agent of a licensee or agent of a payee." No MTL needed. |
| **Texas** | Yes (Tex. Finance Code §151.003) | No MTL needed. |
| **Florida** | Partial (new MTMA rules eff. Jan 1, 2025) | Pre-2025: highest risk state. Post-2025 MTMA adoption: agent of payee exemption codified. Monitor closely. |
| **Illinois** | Yes (MTMA partly adopted 2024) | No MTL needed, but get state-specific counsel. |
| **Pennsylvania** | Yes (limited) | Agent of payee recognized but requires 7 specific contractual provisions in the nonprofit agreement. Standard ToS may not be sufficient without supplemental contract terms. |
| **Ohio** | Yes (recognized) | No MTL needed. Lower risk state. |
| **Massachusetts** | Partial (MTMA partly adopted 2024) | Still evolving. Lower risk. |
| **Washington** | Yes (recognized) | No MTL needed. |

### Do Competitors Hold MTLs?

**No.** Based on public information, Givebutter, Zeffy, Donorbox, and Give Lively all rely on Stripe's licensing and disclaim money transmitter status. None appear in the FinCEN MSB Registrant Search as registered MSBs.

### Does Our 1% Fee Change Anything?

No. The legal trigger for money transmission is **custody and control of funds**, not the act of charging a fee. Our `application_fee_amount` model means:
- The fee is collected within Stripe's settlement system
- Give never has custody of donor funds
- Give receives a Stripe-to-Stripe payment, not a consumer fund transmission

This is structurally identical to every Stripe Connect marketplace.

### Legal Opinion Letter: Recommended Before Launch

Despite the strong structural protection, retain payments counsel for:

| Type | Cost | When |
|------|------|------|
| **Informal analysis memo** (covers FinCEN MSB + CA, NY, FL) | $5,000–$15,000 | Before first live donation |
| **Formal opinion letter** (addressable to investors/banks) | $15,000–$40,000 | Before institutional fundraising |
| **California AB 488 specific counsel** | $2,000–$5,000 additional | As part of CA registration |

**Recommended firms:** Venable LLP, Cooley LLP, Troutman Pepper, Davis Wright Tremaine (all have direct payments/charitable fundraising platform experience).

**Minimum viable action:** Before launch, retain counsel for an informal analysis memo. ~$5,000–$12,000. Non-optional.

### California AB 488 — Separate from MTL

AB 488 is a charitable solicitation registration law (see Section 1), not an MTL. However, it has financial structuring requirements that overlap with MTL compliance:
- Segregate donor funds from operating funds
- Distribute donations promptly (within timeframes specified in regulations)
- Maintain fund flow records for 10 years

These requirements align with good MTL compliance hygiene regardless.

---

## 6. Key Decisions & Next Steps

### Critical Decisions Made

| Decision | Conclusion |
|----------|-----------|
| **MTL required?** | No — Stripe Connect Express structure provides structural protection. Get informal legal opinion before launch. |
| **FinCEN MSB registration?** | No — payment processor exemption applies. |
| **PCI SAQ type** | SAQ A — simplest assessment. Complete annually via Stripe PCI Dashboard. |
| **501(c)(3) verification method** | EIN + IRS EO BMF local lookup (monthly sync) + Stripe KYC. No manual review for clean lookups. |
| **State charitable solicitation registration** | Required in ~38–40 states as Professional Solicitor/Fundraiser. CA AB 488 is highest priority. |
| **Privacy law baseline** | Build to CCPA/CPRA standards from day 1 (superset of all 20+ state laws). |
| **ToS arbitration** | Binding arbitration with class action waiver (industry standard). |
| **Donor data ownership** | Explicitly: nonprofits own their donor data. Give is a processor. Free export always available. |

### Pre-Launch Compliance Checklist

**Immediate (before first live nonprofit):**
- [ ] Register with California AG as Charitable Fundraising Platform (Form PL-1, AB 488)
- [ ] Register as Professional Solicitor/Fundraiser in Tier 1 states (NY, FL, PA, OH, MA, CT, IL)
- [ ] Obtain surety bonds (work with bond broker for multi-state coverage)
- [ ] Retain payments counsel for informal MTL/MSB analysis memo (~$5K–$12K)
- [ ] Complete PCI SAQ A via Stripe's PCI Dashboard
- [ ] Set up quarterly ASV vulnerability scanning (SecurityMetrics, Qualys, etc.)
- [ ] Implement CSP headers on all donation pages
- [ ] Draft Terms of Service (use clause list in Section 4)
- [ ] Draft Privacy Policy (use clause list in Section 4; CCPA-compliant from day 1)
- [ ] Load IRS EO BMF into database; implement EIN lookup in onboarding flow
- [ ] Set up monthly IRS EO BMF and Auto-Revocation List sync
- [ ] Configure automated donation tax receipts with IRS-compliant substantiation language

**Within 90 days of launch:**
- [ ] Complete Tier 2 state registrations
- [ ] Register in Hawaii before July 1, 2026 CFP deadline
- [ ] Set up compliance calendar for annual state renewals and reports
- [ ] Consider formal legal opinion letter if raising institutional capital

**Ongoing:**
- [ ] Annual PCI SAQ A + AOC submission
- [ ] Quarterly ASV scans (4× per year)
- [ ] Monthly IRS BMF sync
- [ ] Annual state registration renewals and financial reports
- [ ] Monitor state legislative activity (3–5 more states expected to introduce CFP laws in 2026–2027)

### Platform Architecture Requirements

Based on compliance research, these capabilities must be built:

1. **State disclosure engine** — Detect donor state (billing address or IP); inject required disclosure text and platform registration numbers into donation form footer
2. **IRS EO BMF integration** — Monthly sync; EIN lookup API for instant 501(c)(3) verification; Auto-Revocation List check
3. **Financial reporting module** — Track donations by donor state for annual state PF/PS filings; export in required formats
4. **Data export tool** — Self-service CSV export of all donor and donation data (required by CA AB 488, needed for data portability pledge)
5. **Contract generation** — Auto-generate state-compliant platform agreements when nonprofits onboard; include required provisions for PA, CA, and other strict states

### Open Legal Questions

- [ ] Confirm with attorney: Does Stripe Connect Express `application_fee_amount` model constitute "custody or control" triggering PF/PS registration, or can we argue payment processor exemption?
- [ ] Pennsylvania: Get specific contract language required for agent of payee exemption (7 required provisions)
- [ ] Florida: Confirm AB 488-equivalent obligations post-2025 MTMA adoption
- [ ] Church/religious org onboarding: Draft self-certification process with appropriate limitations of liability
- [ ] How to handle nonprofits onboarding from states where Give is not yet registered as PF/PS (enforcement risk analysis)
- [ ] DPA (Data Processing Agreement) for nonprofits subject to GDPR

---

## Sources

### State Charitable Solicitation
- [Perlman & Perlman: Professional Fundraiser Registration](https://perlmanandperlman.com/are-you-paid-to-solicit-charitable-contributions-for-a-charity-you-may-need-to-register-as-a-professional-fundraiser/)
- [Harbor Compliance: Fundraising Professionals Registration](https://www.harborcompliance.com/fundraising-professionals-registration-licensing)
- [Labyrinth Inc: State Fundraising Compliance Guide](https://labyrinthinc.com/state-fundraising-compliance-guide/)
- [Davis Wright Tremaine: AB 488 Final Regulations](https://www.dwt.com/insights/2024/06/california-ab-488-charitable-funds-rules-in-effect)
- [California AG: Charitable Fundraising Platforms](https://oag.ca.gov/charities/pl)
- [Clearly Compliant: Hawaii's New CFP Law](https://clearlycompliant.com/2025/11/hawaiis-new-charitable-fundaising-platform-law/)
- [Charity Lawyer Blog: AB 488 Update and Enforcement](https://charitylawyerblog.com/2025/12/22/california-ab-488-update-enforcement-activity-and-the-spread-of-platform-regulation-beyond-california/)

### PCI DSS
- [Stripe: PCI Compliance Guide](https://stripe.com/guides/pci-compliance)
- [Stripe: Integration Security Guide](https://docs.stripe.com/security/guide)
- [PCI SSC: Important Updates to SAQ A (January 2025)](https://blog.pcisecuritystandards.org/important-updates-announced-for-merchants-validating-to-self-assessment-questionnaire-a)
- [PCI SSC: FAQ 1588 — SAQ A Eligibility Criteria](https://blog.pcisecuritystandards.org/faq-clarifies-new-saq-a-eligibility-criteria-for-e-commerce-merchants)
- [PCI DSS v4.0 Vulnerability Scanning for SAQ A | CampusGuard](https://campusguard.com/post/pci-dss-v4-0-vulnerability-scanning-for-saq-a-merchants/)

### 501(c)(3) Verification
- [IRS: Tax Exempt Organization Search](https://apps.irs.gov/app/eos/)
- [IRS: EO Business Master File Extract](https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf)
- [ProPublica Nonprofit Explorer API](https://projects.propublica.org/nonprofits/api)
- [Candid/GuideStar API](https://candid.org/find-nonprofit/)

### Privacy / ToS
- [Givebutter Terms of Service](https://givebutter.com/terms)
- [Givebutter Privacy Policy](https://givebutter.com/privacy)
- [Zeffy Terms of Service](https://support.zeffy.com/terms-and-conditions-of-use)
- [Zeffy Privacy Policy](https://support.zeffy.com/data-privacy-policy)
- [CCPA/CPRA Text (Cal. Civ. Code 1798.100 et seq.)](https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=CIV&division=3.&title=1.81.5.)

### Money Transmitter Licenses
- [Venable: Money Transmission in the Payment Facilitator Model](https://www.venable.com/insights/publications/2018/06/money-transmission-in-the-payment-facilitator-mode)
- [DFPI: Agent of Payee Final Rules](https://dfpi.ca.gov/wp-content/uploads/sites/337/2021/06/L1.-Final-Statement-of-Reasons.pdf)
- [Cooley: US States Adopt MTMA (2024)](https://www.cooley.com/news/insight/2024/2024-08-20-us-states-adopt-model-money-transmission-act-but-harmonization-remains-elusive)
- [FinCEN: Definition of Money Transmitter (FIN-2008-R004)](https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/definition-money-transmitter-merchant-payment)
- [FinCEN MSB Registrant Search](https://msb.fincen.gov/)
- [Givebutter Terms of Service (MTL disclaimer)](https://givebutter.com/terms)
- [Stripe: What is a money transmitter?](https://stripe.com/resources/more/what-is-a-money-transmitter)
