# State Charitable Solicitation Registration -- Platform Compliance Analysis

> **Research date:** 2026-02-28
> **Scope:** Whether Give (the platform/intermediary) must register in each state, independent of the nonprofits' own registration obligations
> **Key question:** Does Give's business model -- hosting donation forms, processing payments via Stripe Connect Express, and deducting a 1% application fee -- trigger professional fundraiser, professional solicitor, fundraising counsel, commercial co-venturer, or charitable fundraising platform registration requirements?

---

## 1. How Give's Model Maps to Legal Categories

State charitable solicitation laws were written decades before online fundraising platforms existed. Most states use some combination of these regulated categories:

| Category | Definition | Does Give Fit? | Analysis |
|----------|-----------|----------------|----------|
| **Professional Solicitor / Professional Fundraiser** | A person/entity that, for compensation, solicits contributions on behalf of a charitable organization | **Likely Yes in most states** | Give hosts donation forms at give.to/org-name and enables solicitation. It receives compensation (1% fee). The platform "performs, permits, or enables" solicitation. Key factor: Give's Stripe Connect model means donations flow through Give's Stripe platform account first (even if briefly), before the application fee is deducted and funds settle to the nonprofit's connected account. This custody/control of funds is the trigger in most states. |
| **Fundraising Counsel** | A person who advises on solicitation but does NOT directly solicit and does NOT handle/control contributions | **No** | Give directly enables solicitation and has at least transactional control of funds via the Stripe Connect application fee mechanism. Give is more than an advisor. |
| **Commercial Co-Venturer (CCV)** | A for-profit entity that advertises a sale/promotion where part of the proceeds benefit charity | **No** | Give is not conducting a commercial sale and then donating a portion. CCV laws target retailers doing "buy one, give one" or "X% of sales go to charity" campaigns. |
| **Charitable Fundraising Platform (CFP)** | (New category -- CA and HI only) An entity that uses the internet to provide a platform that performs, permits, or enables charitable solicitation | **Yes -- in CA and HI** | This category was literally written for platforms like Give. California AB 488 (effective June 2024) and Hawaii Act 205 (effective July 2026) created this new registration category. |

### Critical Distinction -- Does Give "Receive" or "Control" Funds?

With Stripe Connect Express accounts, the payment flow works as follows:
1. Donor pays on Give's donation form
2. The charge is created on Give's Stripe platform account
3. Stripe automatically deducts the application fee (1%) for Give
4. The remaining funds settle to the nonprofit's connected Stripe account
5. Stripe pays out to the nonprofit's bank account on the configured schedule

Under most state statutes, the fact that charges are created on Give's platform account and the platform takes a fee before funds reach the nonprofit means Give has "custody or control" of contributions, even if only momentarily. This is the key factor that distinguishes Give from a pure "payment processor" or "technical vendor" and pushes it into the "professional solicitor/fundraiser" category in most states.

A pure payment processor (like Stripe itself) is typically exempt because it provides technical infrastructure only. But Give is not just processing payments -- Give hosts the solicitation page, determines the form content/layout, collects donor information, and takes a percentage-based fee. This is squarely within most states' definitions of professional solicitor/fundraiser.

---

## 2. The Charleston Principles -- Nexus for Internet Solicitation

The Charleston Principles (published by NASCO in 2001) provide non-binding guidance on when internet-based solicitation triggers state registration. Approximately 17 states have formally adopted these principles, and another 7+ use them as guidelines. Key rules:

1. **Domicile rule:** An entity domiciled in a state that uses a website to solicit must register in that state
2. **Targeting rule:** An out-of-state entity must register if it specifically targets persons in that state for solicitation
3. **Volume rule:** An out-of-state entity should register if it receives contributions from a state on a "repeated and ongoing basis" or on a "substantial basis"
4. **Thresholds:** Only 3 states define numerical thresholds -- Colorado requires registration if receiving 50+ contributions or $25,000+ annually from the state

**For Give:** Because Give's platform is available nationwide and will process donations from donors in all states, Give will likely trigger registration obligations in every state that requires professional solicitor/fundraiser registration. The platform does not "specifically target" individual states, but as donation volume grows, Give will receive contributions from residents of every state on a "repeated and ongoing basis."

---

## 3. Uniform Registration Statement (URS)

The URS was designed to simplify multi-state registration. However, its utility has declined significantly:
- Only **18 states** now accept the URS for initial registration (down from 37 originally)
- Only **13 states** accept it for renewals
- Kentucky and Louisiana are the only states that accept it as a primary registration method
- Maine, Mississippi, and South Carolina have dropped it entirely
- North Carolina and Massachusetts actively discourage it
- Many states now require online filing systems and no longer accept paper URS

**For Give:** The URS will not meaningfully simplify compliance. Plan to register individually in each state.

---

## 4. State-by-State Registration Matrix

**Legend:**
- **PF Reg** = Professional Fundraiser / Professional Solicitor registration required for the platform
- **Bond** = Surety bond required (amount)
- All statutes cited are the primary charitable solicitation statutes; consult current code for updates

| # | State | PF Reg Required? | Registration Type / Title | Primary Statute | Bond Req | Annual Filing? | Key Notes |
|---|-------|-----------------|--------------------------|----------------|----------|---------------|-----------|
| 1 | **Alabama** | **Yes** | Professional Fundraiser + CCV | Ala. Code 13A-9-70 et seq. | $10,000 | Yes | Also requires individual solicitor licensing. AG enforces. |
| 2 | **Alaska** | **Yes** | Professional Fund Raiser | Alaska Stat. 45.68 | $10,000 | Yes | Must register with AG before soliciting. |
| 3 | **Arizona** | **Limited** | Contracted Fundraiser | A.R.S. 44-6552 | Varies | Limited | Very limited requirements; mainly disclosure obligations. No general charity registration. |
| 4 | **Arkansas** | **Yes** | Professional Fundraiser | Ark. Code 4-28-401 et seq. | $10,000 | Yes | Must register with AG. Individual solicitor licensing required. |
| 5 | **California** | **Yes (CFP + PF)** | Charitable Fundraising Platform (AB 488) + Commercial Fundraiser for Charitable Purposes | Cal. Gov. Code 12599 et seq.; Cal. Gov. Code 12599.9 (CFP) | $25,000 (PF); None (CFP) | Yes (both) | **HIGHEST PRIORITY.** Must register as CFP on Form PL-1 with AG. Annual renewal by Jan 15. Annual report (Form PL-4) by July 15. Also likely needs Commercial Fundraiser registration ($25K bond). First enforcement action in Nov 2025 (cease and desist). |
| 6 | **Colorado** | **Yes** | Paid Solicitor | Colo. Rev. Stat. 6-16-101 et seq. | None | Yes | One of only 3 states with numerical nexus threshold: 50+ contributions or $25K+ annually from CO triggers registration. Secretary of State enforces. |
| 7 | **Connecticut** | **Yes** | Paid Solicitor / Fund Raising Counsel | Conn. Gen. Stat. 21a-190a et seq. | $20,000 | Yes | Dept of Consumer Protection. Must file contract copies. Strict disclosure requirements. |
| 8 | **Delaware** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 9 | **District of Columbia** | **Yes** | Professional Fundraiser / Professional Solicitor | D.C. Code 44-1701 et seq. | None confirmed | Yes | Dept of Consumer and Regulatory Affairs. Must register before soliciting DC residents. |
| 10 | **Florida** | **Yes** | Professional Solicitor | Fla. Stat. ch. 496 | **$50,000** | Yes | **HIGHEST BOND.** FDACS (Dept of Agriculture and Consumer Services). Very strict. Must disclose paid solicitor status. New SB 700 (eff. July 2025) prohibits accepting contributions from persons associated with "foreign countries of concern." |
| 11 | **Georgia** | **Yes** | Paid Solicitor | Ga. Code 43-17-1 et seq. | $10,000 | Yes | Secretary of State. Individual solicitor licensing required. |
| 12 | **Hawaii** | **Yes (CFP + PF)** | Charitable Fundraising Platform (Act 205) + Professional Solicitor | Haw. Rev. Stat. 467B | Varies | Yes | **CFP registration effective July 1, 2026.** Modeled after CA AB 488. Must get written consent from charities. AG enforces. Regulations still being drafted. |
| 13 | **Idaho** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 14 | **Illinois** | **Yes** | Professional Fund Raiser | 225 ILCS 460 (Solicitation for Charity Act) | $25,000 | Yes | AG enforces. Individual solicitor licensing required. Must file contracts. |
| 15 | **Indiana** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 16 | **Iowa** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 17 | **Kansas** | **Yes** | Professional Fundraiser | Kan. Stat. 17-1759 et seq. | Varies | Yes | Secretary of State. Individual solicitor licensing required. |
| 18 | **Kentucky** | **Yes** | Professional Solicitor | KRS 367.650 et seq. | Varies | Yes | AG enforces. Accepts URS for initial registration. Individual solicitor licensing required. |
| 19 | **Louisiana** | **Yes** | Professional Solicitor / Professional Fundraiser | La. R.S. 51:1901 et seq. | $25,000 | Yes | AG enforces. Only requires registration if a charity engages paid solicitors (which Give is). |
| 20 | **Maine** | **Yes** | Professional Solicitor | Me. Rev. Stat. tit. 9, ch. 385 | $25,000 | Yes | Dept of Professional and Occupational Regulation. Bond runs to any person with cause of action. |
| 21 | **Maryland** | **Yes** | Professional Solicitor | Md. Code, Bus. Reg. 6-601 et seq. | $25,000 | Yes | Secretary of State. Must file financial reports. Strict enforcement. |
| 22 | **Massachusetts** | **Yes** | Professional Solicitor | Mass. Gen. Laws ch. 68, s. 32 | $25,000 | Yes | AG Non-Profit/Public Charities Division. As of Jan 2026, all filings via Fundraiser Portal. Also requires CCV registration ($200 + $25K bond) if applicable. Very strict state. |
| 23 | **Michigan** | **Yes** | Professional Fund Raiser | Mich. Comp. Laws 400.271 et seq. | $10,000 | Yes | AG enforces. Individual solicitor licensing required. |
| 24 | **Minnesota** | **Yes** | Professional Fundraiser | Minn. Stat. 309.50 et seq. | $20,000 | Yes | AG enforces. Must file if have custody of contributions. |
| 25 | **Mississippi** | **Yes** | Professional Fund Raiser | Miss. Code 79-11-501 et seq. | $10,000 | Yes | Secretary of State. $250 filing fee. Annual renewal. Also requires CCV registration. |
| 26 | **Missouri** | **Conditional** | Professional Fundraiser | Mo. Rev. Stat. 407.450 et seq. | None confirmed | Yes | AG enforces. Exempts 501(c)(3), (c)(7), and (c)(8) orgs upon application. As the platform (not the charity), Give likely must still register. |
| 27 | **Montana** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 28 | **Nebraska** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 29 | **Nevada** | **Yes** | Professional Fundraiser | Nev. Rev. Stat. 82C | Varies | Yes | Secretary of State. Limited requirements compared to strictest states. |
| 30 | **New Hampshire** | **Yes** | Paid Solicitor | N.H. Rev. Stat. 7:28 et seq. | $20,000 | Yes | AG Charitable Trusts Unit. Must register annually. CCV contract filing required (no CCV license). |
| 31 | **New Jersey** | **Yes** | Professional Fund Raiser | N.J. Stat. 45:17A-18 et seq. | $20,000 | Yes | AG/Division of Consumer Affairs. Individual solicitor licensing required. CCV contract filing required ($30 fee). |
| 32 | **New Mexico** | **Yes** | Professional Fundraiser | N.M. Stat. 57-22-1 et seq. | $25,000 | Yes | AG enforces. |
| 33 | **New York** | **Yes** | Professional Fund Raiser | N.Y. Exec. Law 171-a et seq. | $10,000 | Yes | **STRICT.** AG Charities Bureau. Individual solicitor licensing required. Must file contracts, financial reports. No renewal (but annual financial reporting required). NYC may have additional requirements. |
| 34 | **North Carolina** | **Yes** | Professional Solicitor | N.C. Gen. Stat. 131F | $20,000-$50,000 | Yes | Secretary of State. Bond varies by contribution volume ($20K if <$100K; $30K if $100-200K; $50K if >$200K). Strict enforcement. |
| 35 | **North Dakota** | **Yes** | Professional Fundraiser | N.D. Cent. Code 50-22 | $20,000 | Yes | Secretary of State. Must file bond with registration. |
| 36 | **Ohio** | **Yes** | Professional Solicitor | Ohio Rev. Code 1716 | $25,000 | Yes | AG enforces. Registration expires March 31 annually. Also requires fundraising counsel registration. |
| 37 | **Oklahoma** | **Yes** | Professional Fundraiser | Okla. Stat. tit. 18, 552.1 et seq. | $2,500 | Yes | Secretary of State. Individual solicitor licensing required. Lowest bond amount of states requiring bonds. |
| 38 | **Oregon** | **Yes** | Professional Fundraiser | ORS 128.801 et seq. | Varies | Yes | AG Charitable Activities Section. |
| 39 | **Pennsylvania** | **Yes** | Professional Solicitor | 10 P.S. 162.1 et seq. (Solicitation of Funds for Charitable Purposes Act) | $25,000 | Yes | **STRICT.** Bureau of Charitable Organizations (Dept of State). $250 annual fee. Must file contracts. Clear distinction between solicitor (handles funds) and counsel (advises only). |
| 40 | **Rhode Island** | **Yes** | Professional Fundraiser / Professional Solicitor | R.I. Gen. Laws 5-53.1 | $10,000 | Yes | Dept of Business Regulation. Individual solicitor licensing required. |
| 41 | **South Carolina** | **Yes** | Professional Solicitor | S.C. Code 33-56 | $15,000 | Yes | Secretary of State. Individual solicitor licensing required. Also requires CCV registration ($50 fee). |
| 42 | **South Dakota** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 43 | **Tennessee** | **Yes** | Professional Solicitor | Tenn. Code 48-101-501 et seq. | $25,000 | Yes | Secretary of State. CCV contract filing required (charity files notice). |
| 44 | **Texas** | **Limited** | Fundraiser | Tex. Bus. and Com. Code 17.91 et seq. | $10,000 | Limited | Very limited requirements. No general charity registration. Primarily requires disclosure. |
| 45 | **Utah** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. (Note: CCV contract filing may still be required.) |
| 46 | **Vermont** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |
| 47 | **Virginia** | **Yes** | Professional Solicitor | Va. Code 57-48 et seq. | $20,000 | Yes | Dept of Agriculture and Consumer Services (VDACS). Must file bond form OCRP-105. |
| 48 | **Washington** | **Yes** | Commercial Fundraiser | Wash. Rev. Code 19.09 | $15,000 | Yes | Secretary of State. Uses the term "commercial fundraiser" rather than professional solicitor. |
| 49 | **West Virginia** | **Yes** | Professional Solicitor / Professional Fund Raising Counsel | W. Va. Code 29-19 | $10,000 | Yes | Secretary of State. Requires both solicitor and counsel registration. |
| 50 | **Wisconsin** | **Yes** | Professional Fundraiser | Wis. Stat. 440.41 et seq. | $5,000-$20,000 | Yes | Dept of Financial Institutions. Bond varies: $20K if custody of contributions, $5K if no custody. Give has custody, so $20K. |
| 51 | **Wyoming** | **No** | N/A | N/A | N/A | N/A | No charitable solicitation registration requirement. |

---

## 5. Summary Statistics

| Metric | Count |
|--------|-------|
| States requiring PF/PS registration (platform must register) | **~38-40** |
| States with no registration requirement | **10** (DE, ID, IN, IA, MT, NE, SD, UT, VT, WY) |
| States with limited/conditional requirements | **3** (AZ, TX, MO) |
| States requiring surety bonds | **~35-38** |
| States with CFP-specific registration (new category) | **2** (CA, HI) |
| Bond amounts range | $2,500 (OK) to $50,000 (FL) |
| Most common bond amount | $25,000 (CA, IL, LA, ME, MD, MA, NM, OH, PA, TN) |
| States requiring individual solicitor licensing | **15** (AL, AR, FL, GA, IL, KS, KY, MI, MS, MO, NJ, NY, OK, RI, SC) |

---

## 6. Priority Tier Classification for Give

**Tier 1 -- Must Register Before Launch (Highest Risk / Strictest Enforcement)**
1. **California** -- New CFP law (AB 488) + Commercial Fundraiser registration. Active enforcement (Nov 2025 cease and desist). AG has named and shamed non-compliant platforms.
2. **New York** -- Extremely strict AG Charities Bureau. High-profile enforcement history.
3. **Florida** -- $50K bond. FDACS actively enforces. New SB 700 adds foreign donor restrictions.
4. **Pennsylvania** -- $25K bond. Bureau of Charitable Organizations is aggressive.
5. **Ohio** -- $25K bond. AG requires registration before any solicitation.
6. **Massachusetts** -- $25K bond. New Fundraiser Portal (Jan 2026). Very active AG.
7. **Connecticut** -- $20K bond. Dept of Consumer Protection actively monitors.
8. **Illinois** -- $25K bond. AG enforces strictly.

**Tier 2 -- Register Before Processing Significant Volume**
9-20. All remaining states with PF/PS registration requirements, prioritized by: (a) states where Give's first nonprofit customers are located, (b) states with highest nonprofit density, (c) states with most active enforcement.

**Tier 3 -- Register as Volume Warrants**
21-40. Lower-population states with registration requirements.

**Tier 4 -- No Registration Required**
41-51. DE, ID, IN, IA, MT, NE, SD, UT, VT, WY + limited AZ/TX.

---

## 7. Estimated Compliance Costs

| Cost Category | Estimated Range | Notes |
|--------------|----------------|-------|
| **Surety bonds (all states)** | $3,000-$8,000/yr premium | Bond premium is typically 1-4% of bond face value, based on credit. Total bond amounts across all states: ~$500K-$600K face value. |
| **Registration/filing fees** | $5,000-$15,000/yr | Ranges from $0 to $500 per state. CA CFP alone is ~$500 initial + renewal. |
| **Legal counsel (initial setup)** | $15,000-$50,000 | Nonprofit regulatory attorney to handle multi-state registration. Could use a compliance service like Harbor Compliance or Labyrinth Inc. |
| **Compliance service (ongoing)** | $5,000-$15,000/yr | Annual renewals, filings, tracking deadlines across 40+ states. |
| **Annual reporting** | Included in compliance service | Most states require annual financial reports from professional fundraisers. |
| **Total Year 1** | **$28,000-$88,000** | Heavily front-loaded. Year 2+ drops to $13,000-$38,000. |

---

## 8. Key Compliance Considerations for Give's Architecture

### Disclosure Requirements (virtually every state)
- Must disclose to donors that solicitation is being conducted by a paid solicitor/professional fundraiser
- Must provide name of platform, registration number, percentage/amount of compensation
- Give's donation forms must include state-specific disclosures (typically in footer or before payment)
- Some states require specific language; others are more flexible

### Contract Requirements
- Most states require a written contract between the professional fundraiser and the charity
- Contracts must be filed with the state, typically 10+ days before solicitation begins
- Give's Terms of Service / Platform Agreement with each nonprofit likely satisfies this, but must include all state-required provisions (compensation terms, start/end dates, geographic scope, etc.)

### Financial Reporting
- Most states require professional fundraisers to file financial reports (campaign-level or annual)
- Must report: total contributions received, amounts paid to charity, amounts retained as compensation, expenses
- Give should build automated reporting that can generate state-specific financial reports

### Architectural Implications for Give Platform
1. **State-specific disclosure engine** -- Detect donor's state (IP geolocation or form field) and display required disclosures
2. **Contract filing automation** -- Generate state-compliant agreements when nonprofits onboard
3. **Financial reporting module** -- Track contributions by state for annual filings
4. **Registration number display** -- Show platform registration numbers on donation forms where required
5. **Audit trail** -- Maintain detailed records of all donations, fees, and disbursements by state

---

## 9. How Competitors Handle This

| Platform | Likely Registration Approach | Evidence |
|----------|----------------------------|----------|
| **Givebutter** | Registered as PF/PS in most states; registered as CFP in CA (confirmed on AG registry) | Filed annual fundraising report in CA on time per public records |
| **GoFundMe** | Registered in CA as CFP; likely registered broadly | Subject to CA AB 488; one of the platforms that motivated the legislation |
| **Zeffy** | Registration status unclear | Smaller platform; may not be fully compliant in all states |
| **Give Lively** | Likely registered via parent org or compliance service | Smaller footprint may reduce scrutiny |
| **Facebook/Meta** | Registered as CFP in CA | One of the platforms that motivated AB 488 |
| **PayPal Giving Fund** | Registered as CFP in CA | Large platform with legal resources for multi-state compliance |

**Key finding:** Nearly 1 in 5 charitable donation platforms operating in California were NOT compliant with AB 488 as of late 2025. This suggests enforcement is ramping up and early compliance is a competitive advantage.

---

## 10. Recent and Pending Legislation (2024-2026)

| State | Law/Bill | Status | Key Provisions |
|-------|---------|--------|---------------|
| **California** | AB 488 (Charitable Fundraising Platforms) | **Effective June 2024** | CFP registration, annual reporting, donor disclosures, written charity consent, fund segregation, prompt distribution. First enforcement Nov 2025. |
| **Hawaii** | Act 205 (Charitable Fundraising Platforms) | **Effective July 1, 2026** | Mirrors CA AB 488. CFP registration, charity consent, donor disclosures. Regulations still being drafted. |
| **Other states** | Various bills monitoring | Introduced / Committee | Multiple states are watching CA/HI outcomes before introducing similar legislation. Expect 3-5 more states to introduce CFP-specific bills in 2026-2027 legislative sessions. |

**Trend:** State regulators are modernizing their approach. Some will pass dedicated "Charitable Fundraising Platform" laws (like CA/HI). Others will address platform behavior through existing professional fundraiser/consumer protection authority. Either way, the regulatory environment is tightening.

---

## 11. Recommended Action Plan

### Before Launch
1. Engage a nonprofit regulatory attorney or compliance service (Harbor Compliance, Labyrinth Inc, or Perlman and Perlman recommended)
2. Register as CFP in California (Form PL-1) -- this is non-negotiable
3. Register as Professional Solicitor/Fundraiser in Tier 1 states (NY, FL, PA, OH, MA, CT, IL)
4. Obtain surety bonds (work with a bond broker -- single application can cover multiple states)
5. Build state-specific disclosure language into donation form templates
6. Ensure Terms of Service / Nonprofit Platform Agreement satisfies state contract-filing requirements
7. Build financial reporting infrastructure for state annual filings

### Post-Launch (within 90 days)
8. Complete Tier 2 state registrations
9. Register in Hawaii before July 1, 2026 CFP deadline
10. Set up ongoing compliance calendar for renewals and annual reports

### Ongoing
11. Monitor legislation -- more states will likely follow CA/HI with CFP-specific laws
12. Maintain state registration database within Give admin tools
13. Annual renewal cycle management (renewals due at different times per state)

---

## 12. Open Questions -- Regulatory

- [ ] Confirm with attorney: Does Stripe Connect Express account structure (application fee model) definitively constitute "custody or control" of funds under state PF/PS definitions?
- [ ] Can Give argue it is a "technical vendor/payment processor" exempt from PF/PS registration? (Unlikely given it hosts solicitation pages and takes percentage-based compensation, but worth exploring)
- [ ] What is the enforcement risk for operating without registration in lower-priority states during early growth?
- [ ] Should Give proactively register in all 40+ states at once, or phase registrations based on where nonprofits sign up?
- [ ] Do Give's nonprofit customers also need to register the Give relationship (file contracts) with their state?
- [ ] How do competitors handle the contract-filing requirement for each nonprofit in each state?

---

## Sources

- [IRS: Charitable Solicitation State Requirements](https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-solicitation-state-requirements)
- [Perlman & Perlman: Professional Fundraiser Registration](https://perlmanandperlman.com/are-you-paid-to-solicit-charitable-contributions-for-a-charity-you-may-need-to-register-as-a-professional-fundraiser/)
- [Perlman & Perlman: Charitable Fundraising Registration FAQ](https://perlmanandperlman.com/charitable-fundraising-registration-faq/)
- [Labyrinth Inc: State by State Fundraising Compliance Guide](https://labyrinthinc.com/state-fundraising-compliance-guide/)
- [Labyrinth Inc: State Definitions of Paid Fundraising Contractors](https://labyrinthinc.com/charity-resources/charity-state-regulations/state-definitions-of-paid-fundraising-contractors/)
- [Harbor Compliance: Fundraising Professionals Registration & Licensing](https://www.harborcompliance.com/fundraising-professionals-registration-licensing)
- [Harbor Compliance: Commercial Co-Venturer Registration & Licensing](https://www.harborcompliance.com/commercial-coventurers-registration-licensing)
- [Harbor Compliance: Online Fundraising & Charleston Principles](https://www.harborcompliance.com/online-fundraising-charleston-principles)
- [Davis Wright Tremaine: AB 488 Final Regulations](https://www.dwt.com/insights/2024/06/california-ab-488-charitable-funds-rules-in-effect)
- [Adler & Colvin: California CFP Regulations](https://www.adlercolvin.com/blog/2024/05/07/california-issues-final-regulations-to-charitable-fundraising-platform-law-five-things-you-need-to-know/)
- [California AG: Charitable Fundraising Platforms](https://oag.ca.gov/charities/pl)
- [Clearly Compliant: Hawaii's New CFP Law](https://clearlycompliant.com/2025/11/hawaiis-new-charitable-fundaising-platform-law/)
- [Perlman & Perlman: Hawaii CFP Law Amendments](https://perlmanandperlman.com/hawaii-amends-new-law-governing-charitable-fundraising-platforms/)
- [Verrill: Hawaii CFP Law](https://www.verrill-law.com/blog/mahalo-hawaii-hawaii-follows-california-with-a-new-charitable-fundraising-platform-law/)
- [NonProfit Times: States Eye Platform Regulation](https://thenonprofittimes.com/npt_articles/states-eye-new-regulation-of-fundraising-platforms/)
- [Charity Lawyer Blog: AB 488 Update and Enforcement](https://charitylawyerblog.com/2025/12/22/california-ab-488-update-enforcement-activity-and-the-spread-of-platform-regulation-beyond-california/)
- [Charity Lawyer Blog: Professional Fundraiser Registration Requirements](https://charitylawyerblog.com/2025/01/30/understanding-professional-fundraiser-registration-requirements/)
- [GetChange: Commercial Co-Venturer State Regulations](https://getchange.io/blog/overview-of-commercial-co-venturer-state-regulations)
- [Oakland Voices: CA Platform Compliance](https://oaklandvoices.us/2025/12/13/california-donation-fundraising-platform-compliance-attorney-general/)
- [SuretyBonds.com: Professional Fundraiser Bond Guide](https://www.suretybonds.com/license-permit/professional-fundraiser-bond)
- [Cogency Global: States Requiring Charitable Registration](https://www.cogencyglobal.com/blog/which-states-require-charitable-solicitation-registration-for-nonprofits/)
- [Multistatefiling.org: Unified Registration Statement](https://multistatefiling.org/)
- Ohio Rev. Code 1716.05, 1716.07 (Professional Solicitor registration and bond)
- Pa. Stat. 10 P.S. 162.1 et seq. (Solicitation of Funds for Charitable Purposes Act)
- Fla. Stat. ch. 496 (Solicitation of Contributions)
- N.Y. Exec. Law 171-a et seq. (Charitable solicitations)
- Miss. Code 79-11-501 et seq. (Regulation of Charitable Solicitations)
- Me. Rev. Stat. tit. 9, ch. 385 (Charitable Solicitations Act)
- N.C. Gen. Stat. 131F (Solicitation of Charitable Funds)
- S.C. Code 33-56 (Solicitation of Charitable Funds)
