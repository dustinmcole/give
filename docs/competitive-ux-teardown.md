# Competitive UX Teardown: Donor-Facing Experience

> **Date:** 2026-02-28
> **Status:** Complete
> **Purpose:** Deep analysis of Givebutter, Zeffy, and Give Lively's public-facing donation experiences to inform Give's product design decisions.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Givebutter](#givebutter)
3. [Zeffy](#zeffy)
4. [Give Lively](#give-lively)
5. [Cross-Platform Comparison](#cross-platform-comparison)
6. [Recommendations for Give](#recommendations-for-give)

---

## Executive Summary

After analyzing 10+ live donation pages across all three competitors, reviewing hundreds of user complaints, and dissecting each platform's fee/tip UX in detail, three themes emerge:

1. **The tip model is universally problematic.** All three competitors use some form of donor tip/contribution. Givebutter and Zeffy's implementations are borderline dark patterns (15-17% pre-selected defaults, hard-to-remove tips, late-stage introduction). Give Lively is more ethical (toggle off by default) but still anchors at 9%. Give's transparent 1% platform fee charged to the nonprofit — not the donor — is a genuine differentiator.

2. **Checkout friction varies wildly.** Givebutter has an absurd 10-step checkout. Zeffy claims a single-page flow but inserts the tip as a late-stage surprise. Give Lively uses a clean 3-page stepped form. Give should aim for a 2-3 step flow that beats all of them on speed and clarity.

3. **Customization is weak across the board.** Give Lively offers 2 templates and 1 brand color. Givebutter's thank-you page is a fixed yellow screen. Zeffy's embedded forms strip all branding. Give can win by offering beautiful, brand-native experiences from day one.

**Bottom line:** The competitive bar for donation UX is surprisingly low. A well-designed, transparent, fast checkout experience will stand out immediately.

---

## Givebutter

### 1. Donation Form Layout & Flow

Givebutter's checkout is a **10-step sequential flow** — the heaviest in the market:

| Step | Content | Notes |
|------|---------|-------|
| 1 | Donation amount selection | Preset buttons (up to 18 tiers) + custom field. Impact descriptions per tier. |
| 2 | Donation frequency | One-time, Monthly, Quarterly, Yearly. Configurable defaults. Upsell prompt if one-time selected. |
| 3 | Dedication (conditional) | "In memory of" / "In honor of" options |
| 4 | Leave a message (Page/Event only) | Display name + message with GIFs, drawings, photos |
| 5 | Anonymity settings (Page/Event only) | Hide name, amount, or both |
| 6 | **Tips & fees review** | The critical step — see tip analysis below |
| 7 | Preferences & affiliation | Mailing list opt-in, company attribution |
| 8 | Payment method selection | Card, PayPal, Venmo, Cash App, Apple Pay, Google Pay, ACH, DAFpay, check |
| 9 | Transaction finalization | Submit payment |
| 10 | Confirmation | Generic yellow thank-you screen (not customizable) |

**Form vs. Page campaigns:** Form campaigns walk donors directly through checkout. Page campaigns show a full landing page first, with a "Donate" button launching the checkout as a modal overlay.

**Mobile:** Givebutter claims responsive, mobile-optimized forms. However, the 10-step flow means 10 screen taps on mobile — significant friction. Multiple Capterra reviewers have complained about "so many screens."

**Payment options:** Card, ACH, PayPal, Venmo, Cash App Pay, Apple Pay, Google Pay, DAFpay, check. Apple Pay and Google Pay auto-detect device compatibility and enable by default.

**Dynamic suggested amounts:** Different tiers per frequency (one-time: $100/$200/$300 vs monthly: $10/$30/$50). Impact descriptions drive higher average gifts ("$50 feeds a family for a week"). This is smart anchoring worth emulating.

**Recurring upsell:** If a donor selects one-time, the system can prompt conversion to monthly. Good conversion tactic.

### 2. Campaign Page Design

Analyzed: `demo.givebutter.com/page/maxfriedman` and `demo.givebutter.com/multi-team-fundraising/spread-the-love`

**Hero section:**
- Organization logo + name prominently displayed
- Campaign title with organizer attribution
- Cover photo or animated GIF
- Theme color applied as gradient background, button accents

**Goal progress:**
- Real-time progress bar or thermometer display
- Shows: amount raised, goal amount, percentage complete, supporter count
- Matching donation callout (e.g., "2x match through Hive Collective")

**Supporter feed (donor wall) — genuinely excellent:**
- Social media-style feed auto-built into every Page/Event campaign
- Each donation shows: donor name (or "Anonymous"), amount, timestamp, optional message
- Donors can attach GIFs, drawings, photos to messages
- Other supporters can like and comment on posts
- Fundraisers can respond with emojis, graphics, GIFs
- Supporters get email notifications on engagement
- Important updates can be pinned
- Organizers can post update announcements

**Social sharing:**
- One-click sharing to social platforms
- Facebook auto-displays donate button + campaign image + progress bar
- QR code generation for print materials and events

**Live display (events):**
- Real-time donation showcase on projection screens
- Donor name spotlights, confetti bursts, live goal bar updates

**Thank-you / confirmation page — a known weakness:**
- Generic popup with **fixed yellow background**
- **Zero customization** — no org branding, no custom messaging, no colors
- Cannot specify fund, add next steps, include rich text, or toggle off
- Active community feature request with no resolution
- Rips donors out of the nonprofit's brand experience

**Receipt email:**
- Automated immediately, includes org name, EIN, date, amount, IRS-compliant language
- Customizable message and branding
- Includes donor's message and custom field responses

### 3. Tip/Fee UX — CRITICAL ANALYSIS

This is Givebutter's biggest vulnerability and Give's #1 competitive messaging opportunity.

**How it works:**

At Step 6 of 10 — after the donor has already invested effort selecting amount, frequency, and personal details — Givebutter presents a fee review screen:

```
0% platform fee + 2.9% & $0.30 processing fee + [X]% optional tip
```

**Tip selection UI:**
- Four preset buttons: **10%, 12%, 15%, and "Other"**
- **15% is pre-selected as the default**
- "Other" allows a custom amount (including $0)
- An "Edit" link can modify or remove the tip
- There is no visible "$0" or "No tip" button

**The math on a $100 donation with defaults:**
| Line Item | Amount |
|-----------|--------|
| Donation | $100.00 |
| Processing fee (3.3% + $0.30) | $3.60 |
| Default tip (15%) | $15.00 |
| **Total charged to donor** | **$118.60** |
| **Total hidden cost: 18.6%** | |

**Dark pattern analysis:**

| Pattern | Present? | Details |
|---------|----------|---------|
| Pre-selected default | **YES** | 15% tip pre-selected — the highest non-"Other" option |
| Late-stage introduction | **YES** | Appears at Step 6 of 10, after donor has invested effort (sunk cost fallacy) |
| Anchoring | **YES** | Options are 10%/12%/15% — no 0% or 5% visible. Lowest visible option is 10%. |
| Guilt language | Mild | Framed as "helping keep Givebutter free" |
| Difficulty removing | **YES** | Must click "Edit" or select "Other" and type $0. No one-click removal. |
| Confusing labeling | **YES** | Some donors don't realize they're tipping Givebutter, not the nonprofit |

**Documented complaints (BBB, Trustpilot):**
- "Default 15% tip on my charitable contribution that was automatically added" — ANN L, BBB
- "15% tip checkbox is selected, unless user explicitly deselects" — Lora L, BBB
- Donors "entered zero for a tip, and were shocked to find large tips were charged" — Walter S, BBB
- "Hidden tip charge can catch even the most careful donator" — Chhaya K, BBB
- "At the very last step, they tried to add $10.20 to our donation" — Trustpilot 1-star
- "I was never taken to a web page that said I was donating to this company" — Robert H, BBB

**Class action investigation:** KalielGold PLLC (Washington, D.C.) is actively investigating Givebutter and five other platforms for hidden fees and unauthorized recurring charges. ([Source](https://topclassactions.com/lawsuit-settlements/investigations/hidden-fees-on-charitable-donations-class-action-lawsuit/))

**When nonprofits disable tips:** A **3% platform fee** kicks in (plus 2.9% + $0.30 processing) — 3x Give's basic rate.

### 4. Embeddable Widget Experience

| Widget Type | Format | Behavior |
|-------------|--------|----------|
| Button (Static) | Inline | Scrolls with page, launches checkout |
| Button (Floating) | Fixed lower-right | Always visible, floats over content |
| Form (Inline) | Full embedded form | Donor stays on host site |
| Goal Bar | Progress indicator | Bar or thermometer (S/M/L) |
| Signup Form | Email capture | Popup or static |

**Customization:** Background color, text color, outline, corner radius (0-30), button text, icon (heart/gift/hands/ticket), drop shadow toggle, alignment.

**Technical implementation:** Web Component (`<givebutter-widget id="WIDGET_ID">`). Two-part install: script in `<head>`, component where needed. Changes in dashboard auto-propagate.

**Limitations:**
- **Max width: 420px** — cannot fill a wider container
- Cannot embed P2P or event campaigns, only donation forms
- Legacy "Elements" → "Widgets" migration causes confusion
- Apple Pay requires extra domain config in embed context
- Venmo desktop only (no mobile widget)
- WordPress plugin has only 1 review — low adoption

### 5. What Givebutter Does Well

1. **Supporter feed / donor wall** — Social media-style engagement (GIFs, likes, comments, photo attachments) creates community and excitement. Best-in-class donor wall.
2. **Payment method breadth** — Card, ACH, PayPal, Venmo, Cash App, Apple Pay, Google Pay, DAFpay, check. Auto-detection of digital wallets.
3. **Recurring upsell** — Smart prompt converting one-time donors to monthly. Increases LTV.
4. **Dynamic suggested amounts per frequency** — Different tiers for one-time vs monthly with impact descriptions. Smart anchoring.
5. **Live display for events** — Confetti-burst, big-screen donation showcase drives competitive giving.
6. **QR codes** — Built-in for print materials and events. Simple, high-value.
7. **47% claimed conversion rate** — The benchmark to beat.

### 6. Exploitable Weaknesses

1. **Tip model** — 15% default, class action investigation, documented donor confusion. **Exploitability: VERY HIGH.**
2. **10-step checkout** — Conversion killer. Every step is a drop-off point. **Exploitability: HIGH.**
3. **Generic thank-you page** — Fixed yellow, no customization. Brand damage. **Exploitability: MEDIUM.**
4. **Manual payouts** — Requires manual withdrawal initiation. **Exploitability: HIGH.**
5. **No native Salesforce** — Zapier only. GoFundMe Pro charges $250/mo. **Exploitability: VERY HIGH.**
6. **420px widget cap** — Artificially restrictive embeds. **Exploitability: MEDIUM.**
7. **Plus paywall creep** — Features moving behind $29-$279/mo paywall. **Exploitability: MEDIUM.**
8. **No public API** — Heavy Zapier reliance. **Exploitability: HIGH.**

---

## Zeffy

### 1. Donation Form Layout & Flow

Zeffy uses a **single-page donation flow** — the most streamlined of the three competitors. No page switching or multi-step wizard.

**Form layout:**
- Donation amount selection: preset suggested amounts (configurable per frequency) + custom amount field
- Frequency toggle: one-time or monthly recurring
- Donor information: name, email, address
- Payment method: credit card, ACH, PAD (Pre-Authorized Debit), Apple Pay, Google Pay, check
- **Zeffy contribution prompt** — appears at the payment step (see tip analysis below)
- Submit

**Mobile optimization:**
- Forms described as mobile-friendly and responsive
- Apple Pay and Google Pay auto-enable on mobile when available on the donor's device
- No separate mobile app for donors — all web-based

**Payment options:** Credit/debit cards, ACH transfers, PAD, Apple Pay, Google Pay, checks. Narrower than Givebutter (no PayPal, Venmo, Cash App, or DAFpay).

**Payout schedule:** Weekly or monthly, **only on Mondays**. No daily option, no on-demand withdrawal. This is a notable limitation — one reviewer noted organizations "will need to account for that when budgeting."

**Receipt/confirmation:**
- Immediate thank-you message on screen
- Automated tax receipt email
- Donor can access receipts through donor dashboard

### 2. Campaign Page Design

**Fundraising thermometer:**
- Real-time progress bar that updates as donations arrive
- Customizable to match nonprofit branding colors and logo
- Can be placed at top of page for visibility
- Supports manual amount adjustments (for offline donations)

**Donor wall / leaderboard:**
- Public donor list with contributor names and amounts
- Can be toggled on/off in advanced settings
- Donors can choose anonymous giving to hide their name
- Leaderboard ranking for competitive fundraising

**Campaign elements:**
- Logo, images, video
- Campaign description
- Suggested donation amounts with custom labels
- Fund designation options (donors can choose which fund/program)
- Social sharing built in (direct URL, social media, QR codes)

**Peer-to-peer:**
- Open registration P2P campaigns
- Individual fundraiser pages rolling up to campaign total

**Design limitations:**
- Limited template options — forms are functional but not visually distinctive
- Customization constrained to colors, logo, and basic content fields
- No drag-and-drop builder
- No custom CSS
- No custom domains

### 3. Tip/Fee UX — CRITICAL ANALYSIS

Zeffy's tip model is their core vulnerability. Because it's their **sole revenue source**, they cannot let nonprofits modify or remove it — and this creates perverse incentives in the donor UX.

**How it works:**

The "voluntary contribution to Zeffy" appears at the payment confirmation step. It is presented as a dropdown with pre-selected percentage options:

| Donation Amount | Default Tip | Available Options |
|----------------|-------------|-------------------|
| Under $99.49 | **17%** | 17%, 20%, 22%, Other |
| $99.50 and above | **15%** | 15%, 17%, 20%, Other |

**To remove the tip:** The donor must select "Other" from the dropdown and manually enter $0. There is **no visible $0 or "No tip" button**. The friction is intentional.

**The math on a $100 donation with defaults:**
| Line Item | Amount |
|-----------|--------|
| Donation | $100.00 |
| Processing fee | $0.00 (absorbed by Zeffy) |
| Default Zeffy contribution (15%) | $15.00 |
| **Total charged to donor** | **$115.00** |

For a $50 donation (17% default):
| Line Item | Amount |
|-----------|--------|
| Donation | $50.00 |
| Default Zeffy contribution (17%) | $8.50 |
| **Total charged to donor** | **$58.50** |

**Dark pattern analysis:**

| Pattern | Present? | Details |
|---------|----------|---------|
| Pre-selected default | **YES** | 15-17% pre-selected — extremely aggressive |
| Hidden removal | **YES** | Must select "Other" and manually type $0. No obvious opt-out. |
| Anchoring | **YES** | Options are 15%/17%/20%/22% — lowest visible is 15%. No $0 visible. |
| Misleading framing | **YES** | Called "voluntary contribution" — donors often think it goes to the nonprofit |
| Late-stage introduction | **YES** | Appears at payment confirmation after all info entered |
| No total display | **YES** | Zeffy doesn't re-display the total at the final step — donors can miss the added tip |
| Nonprofit powerlessness | **YES** | Nonprofits **cannot** customize, reduce, or remove the tip suggestion |

**Documented complaints:**
- "The form automatically adds on a donation to Zeffy, and it is not immediately apparent that the user can choose to reduce or omit the donation. This seems sneaky and like a hidden fee." — Verified User, G2
- "Your only option is whether you want to 'donate' 17%, 20% or 22%... 17% is exorbitant" — Suzanne Yee, Trustpilot
- "Even I nearly clicked through a Zeffy checkout flow without noticing the tip was automatically added" — Nonprofit Marketing Nerds analysis
- 29 mentions of "surprise donation requests" in G2 reviews
- 30 mentions of "confusing donation process" in G2 reviews
- 28 mentions of "high suggested amounts causing donor confusion and potential drop-offs" in G2 reviews

**Why nonprofits can't change it:** Zeffy's official position: "The voluntary contribution is our sole source of revenue... it is not possible to customize the default drop-down suggestions." They cover credit card processing, platform costs, and 40 employees' salaries from these tips. If donors don't tip enough, the model collapses.

**Bank statement confusion:** When donors review bank statements later, they see a charge significantly higher than the donation they remember making. This creates frustration directed at the nonprofit, not at Zeffy — damaging the donor-nonprofit relationship.

**Same class action investigation:** Zeffy is included in the KalielGold PLLC investigation alongside Givebutter for hidden fees on charitable donations.

### 4. Embeddable Widget Experience

**Embed types:**
- **Full form embed** — iframe/HTML code showing the donation form inline on the nonprofit's site
- **Pop-up button** — Button that triggers a modal overlay with the donation form
- **Donate button** — Simple link/button redirecting to Zeffy-hosted form

**Technical implementation:**
- HTML code snippet from Zeffy dashboard (Fundraising > Campaigns > Share > Embed)
- Supports: Wix, WordPress, Squarespace, Duda, GoDaddy, Strikingly, Webflow, Webnode
- WordPress has a dedicated plugin ([wordpress.org/plugins/zeffy-donate-button](https://wordpress.org/plugins/zeffy-donate-button/))

**Critical limitation:** Embedded forms **do not display the form description, images, logo, or nonprofit name**. They show only the donation and payment fields. The nonprofit must add descriptive context separately above the embed.

**Prerequisites:** Connected bank account and active/open form status required.

**Customization:** Minimal. The embed inherits basic form settings but strips branding. No custom CSS, no responsive width controls, no advanced styling.

### 5. What Zeffy Does Well

1. **Zero platform fees for nonprofits** — The core value proposition is strong. 100% of the donation goes to the cause. For budget-strapped organizations, this is compelling.
2. **Single-page checkout** — The most streamlined flow of the three. Less friction than Givebutter's 10 steps.
3. **Event ticketing included** — Free event management with ticket sales, check-in, and attendee management.
4. **Quick setup** — "Fairly intuitive to get running, easy to maintain and update" per multiple reviewers.
5. **Auto-enable digital wallets on mobile** — Apple Pay and Google Pay appear automatically based on device/browser.
6. **QR code sharing** — Built-in generation for print materials.
7. **Strong support ratings** — 4.9/5 customer service on Capterra.

### 6. Exploitable Weaknesses

1. **Aggressive tip model** — 15-17% default with no visible $0 option. Nonprofits can't modify it. Class action investigation. **Exploitability: VERY HIGH.**
2. **No API** — Zero programmatic access to data. No webhooks. No automation beyond basic Zapier. **Exploitability: VERY HIGH.**
3. **No Salesforce integration** — No native integration of any kind. **Exploitability: VERY HIGH.**
4. **Monday-only payouts** — Weekly or monthly, only on Mondays. No daily, no on-demand. **Exploitability: HIGH.**
5. **Stripped embedded forms** — Embeds lose all branding, images, description. **Exploitability: HIGH.**
6. **Limited customization** — Constrained templates, no custom CSS, no custom domains. **Exploitability: MEDIUM.**
7. **No text-to-give** — Missing feature that Give Lively and Givebutter offer. **Exploitability: LOW** (Round 2 feature for us).
8. **Sustainability risk** — If donor tipping rates decline, the model collapses. No fallback revenue. **Exploitability: MEDIUM** (messaging angle: "We have a sustainable business model").
9. **Donor relationship damage** — Donors blame the nonprofit for Zeffy's tip charges, eroding trust. **Exploitability: HIGH** (messaging angle: "Your donors will never be surprised by hidden fees").

---

## Give Lively

### 1. Donation Form Layout & Flow

Give Lively uses a **3-page stepped flow** with breadcrumb navigation — the cleanest form architecture of the three:

| Page | Content | Notes |
|------|---------|-------|
| 1 | **Amount** | 4 preset buttons ($25/$50/$100/$250, customizable) + custom amount field. Can pre-fill a single custom amount instead. |
| 2 | **Payment method** | Card, ACH, Apple Pay, Google Pay, PayPal, Venmo, DAFpay. One-time vs recurring toggle. Digital wallets auto-detect device compatibility. |
| 3 | **Payment details** | Card number, billing info, fee coverage/tip section. Returning donor login for saved methods. |

**UX strengths:**
- Breadcrumb navigation lets donors jump back to any previous page
- Back button retains all selections (no re-entry)
- **Data persists across browser refreshes** — even before and after checkout. This is excellent.
- Multi-page approach reduces cognitive load vs single long form

**Confirmation flow:**
- On-page thank-you with payment summary (amount, fee coverage, total, frequency, last 4 digits)
- Automatic receipt email (minutes for cards, up to 7 days for ACH)
- Receipt includes IRS-compliant tax language with merge tag personalization
- Link to Give Lively User Portal (3-year donation history + annual tax summary)

**Payment options:** Visa, Mastercard, Amex (debit + credit), ACH via Plaid/Stripe Financial Connections (instant verification, no micro-deposits), Apple Pay, Google Pay, PayPal (one-time and recurring), Venmo (US only), DAFpay/Chariot. Broadest payment method support of the three.

**Mobile:** Responsive layout, one-tap digital wallets. Text-to-Donate via short code 44321 with custom text codes (as short as 3 characters, never expire).

**Limitations:**
- ACH transaction limits: $2,000/transaction, $6,000/day (Plaid)
- ACH receipts delayed 5-7 business days — donor may think donation failed
- Apple Pay reported freezing on desktop by Capterra reviewers
- Only one donation widget per web page

### 2. Campaign Page Design

**Templates:** Only **2 campaign page templates**:
1. **Default** — Standard with branding, form, optional elements
2. **Story** — Page-top video embed (YouTube, Vimeo, or Zoom livestream)

**Branding constraints:**
- Organization logo (min 640x640px)
- **Single brand color** (one hex code) applied to buttons, icons, highlights
- Primary hero image (2000x1200px recommended, 5:3 ratio)
- No secondary colors, no gradients, no custom fonts, no dark mode

**Content elements:**
- Mission statement / campaign description
- Impact Stories — donation amounts linked to narratives + imagery ("$50 provides school supplies for 5 children")
- Embedded video (YouTube or Vimeo, two positions)

**Fundraising elements:**
- Real-time donation thermometer (3-5 second delay)
- Donor roll (toggleable)
- Goal tracking
- **Live Display mode** — change "donate" to "donations" in URL for full-screen projection view. Clever.

**Peer-to-peer:**
- Individual and team fundraising pages from campaigns
- Ranked leaderboard (embeddable)
- Funds roll up: individual → team → campaign

**What's missing:**
- No donor comments/updates section on public page
- Only 2 templates (competitors offer 5-10+)
- Only 1 brand color
- No drag-and-drop builder
- No custom CSS
- No CNAME / custom domain support
- No dark mode

### 3. Tip/Fee UX — "Pay Free Forward" System

Give Lively's approach is notably more ethical than Givebutter or Zeffy. The platform is primarily funded by philanthropist founders, so the tip is supplementary, not existential.

**Evolution (5 versions):**
1. V1: Simple open text field — too much friction
2. V2: Preset amount buttons ($4/$11/$41/None)
3. V3: Streamlined language ("Tip Give Lively" headline)
4. V4: Combined fee + tip toggle
5. **V5 (current): Interactive slider**

**Current slider UX:**
- Toggle appears **switched OFF by default** — dramatically more ethical than competitors
- Text indicates the total fee amount with explanatory link
- "Edit Fees & Tip" button reveals the full slider interface

**When toggled ON:**
- Interactive slider appears, **defaulting to fee coverage + 9% tip to Give Lively**
- Slider range:
  - Far left: covers processing fees ONLY (no tip)
  - Default position: fees + ~9% tip
  - Far right: maximum tip for that amount
- Real-time display: "$1.28 Fee Covered + $4.50 Tip"
- Contextual messaging changes based on slider position

**Key design choices:**
- Toggle OFF by default — donor-friendly
- 9% anchor when activated is still meaningful ($9 on a $100 donation)
- Tips clearly labeled as non-tax-deductible
- Tips don't affect the nonprofit's received amount
- Extensive public documentation about how tips work

**Comparison:**
| Platform | Default State | Default % | Ease of Removal |
|----------|--------------|-----------|-----------------|
| Givebutter | Pre-selected ON | 15% | Must click "Edit" or "Other" → type $0 |
| Zeffy | Pre-selected ON | 15-17% | Must select "Other" → type $0 |
| Give Lively | **OFF by default** | 9% (when toggled on) | Toggle off (one click) |

**Fee coverage (separate from tip):**
| Payment Method | Stripe (Nonprofit) | Shift4 | PayPal (Nonprofit) |
|---------------|-------------------|--------|-------------------|
| Credit/Debit | 2.2% + $0.30 | 1.99% + $0.25 | 1.99% + $0.49 |
| Amex | 3.5% | 3.4% | — |
| ACH | 0.8% (cap $5) | N/A | — |

**Notable:** Give Lively's optional Shift4 integration offers 1.99% + $0.25 for cards — lower than Stripe nonprofit rates. Gives nonprofits processor choice.

### 4. Embeddable Widget Experience

**Widget types:**
| Widget | Description | Notes |
|--------|-------------|-------|
| Simple Donation Widget | Minimal, donation fields only | Recommended height: 272px. Best for sidebars. |
| Branded Donation Widget | Full branding, imagery, video, social sharing | Larger footprint. Requires HTTPS. |

**Technical implementation:**
- HTML code snippet (div + script) — NOT an iframe (Give Lively explicitly warns against iframes)
- Widgets fill container width, semi-fixed height
- Only one widget per page
- Connects to Campaign Page or Core Profile

**Platform support:**
- WordPress: custom HTML block (no dedicated plugin)
- Squarespace: two-step (code block + code injection)
- Wix: custom JavaScript. **Critical: Apple Pay, Google Pay, and Venmo are NEVER available on Wix**
- Other: any site that supports HTML/HTTPS

**Customization:**
- Choose connected campaign
- Set 4 custom suggested amounts (or single pre-filled amount)
- Toggle "in honor of / in memory of" dedication
- Enable/disable digital wallets
- No custom CSS (Give Lively won't troubleshoot custom-styled widgets)

**What's missing:**
- No popup/modal widget
- No floating button
- No goal bar widget
- No real-time feed widget
- No WordPress-specific plugin
- No Shopify, Webflow, or modern CMS native integrations

### 5. What Give Lively Does Well

1. **Ethical tip model** — Toggle off by default. Slider gives real control. Extensive transparency documentation. Most honest fee UX in the market.
2. **Payment method breadth** — Cards, ACH (instant verify via Plaid), Apple Pay, Google Pay, PayPal, Venmo, DAFpay. Intelligent device detection.
3. **ACH promotion** — Actively encourages bank transfers (0.8% vs 2.2%). FAQ explains savings. Nonprofits save real money.
4. **Form data persistence** — Browser refresh retains data. Back button retains selections. Small thing, huge impact on conversion.
5. **Live display URL trick** — Change "donate" to "donations" in URL for full-screen event display. No hardware/software needed.
6. **Text-to-Donate** — Free short code 44321, custom codes (3+ chars), never expire. Great for print/events.
7. **Donor user portal** — 3-year history, annual tax summaries, recurring management, saved payment methods.
8. **Genuinely free** — Philanthropist-funded, not a loss-leader. $0 platform fees.
9. **Shift4 option** — Lower processing fees (1.99% + $0.25) for nonprofits who want to optimize costs.
10. **Support quality** — 16/16 in 118Group review, live chat + email, responsive.

### 6. Exploitable Weaknesses

1. **Application-gated onboarding** — 5-7 day wait for manual "values review." Faith-based orgs reportedly denied. **Exploitability: VERY HIGH.** Give's instant self-service signup is a weapon.
2. **Only 2 templates, 1 brand color** — Extremely limited visual customization. No CSS, no gradients, no fonts. **Exploitability: HIGH.**
3. **No API** — Zero programmatic access. "Very weak in terms of integrations" per 118Group. **Exploitability: VERY HIGH.**
4. **No built-in CRM** — If you don't use Salesforce, it's CSV export only. **Exploitability: HIGH.**
5. **9% default tip anchor** — When toggled on, 9% to Give Lively is still meaningful ($45 on a $500 donation). **Exploitability: MEDIUM.**
6. **Weak event ticketing** — "Not worth the effort" per Capterra. **Exploitability: MEDIUM** (Round 2).
7. **ACH receipt delay** — 5-7 days for receipt creates donor anxiety. **Exploitability: MEDIUM.**
8. **Limited widget options** — Only 2 types, inline only, 1 per page, no popup/floating. **Exploitability: MEDIUM.**
9. **Sustainability questions** — Philanthropist-funded model has inherent fragility. **Exploitability: MEDIUM** (messaging: "sustainable 1% model").
10. **Wix kills digital wallets** — Apple Pay, Google Pay, Venmo all unavailable on Wix embeds. **Exploitability: LOW** (niche but embarrassing).

---

## Cross-Platform Comparison

### Donation Form UX

| Dimension | Givebutter | Zeffy | Give Lively |
|-----------|-----------|-------|-------------|
| **Checkout steps** | 10 | 1 (single page) | 3 (stepped with breadcrumbs) |
| **Mobile optimization** | Responsive but 10 taps | Single-page, responsive | Responsive, digital wallet one-tap |
| **Form data persistence** | Unknown | Unknown | Yes (survives refresh) |
| **Recurring upsell** | Yes (one-time → monthly prompt) | No | No |
| **Custom suggested amounts** | Up to 18 tiers with impact descriptions | Configurable per frequency | 4 presets or 1 pre-filled |
| **Digital wallet auto-detect** | Yes | Yes (mobile) | Yes |

### Payment Methods

| Method | Givebutter | Zeffy | Give Lively |
|--------|-----------|-------|-------------|
| Credit/Debit | Yes | Yes | Yes |
| ACH/Bank | Yes | Yes | Yes (instant verify) |
| Apple Pay | Yes (auto) | Yes (mobile auto) | Yes |
| Google Pay | Yes (auto) | Yes (mobile auto) | Yes |
| PayPal | Yes | No | Yes |
| Venmo | Yes (desktop only) | No | Yes (US only) |
| Cash App Pay | Yes | No | No |
| DAFpay | Yes | No | Yes |
| Check | Yes | Yes | No |

### Tip/Fee Model

| Dimension | Givebutter | Zeffy | Give Lively |
|-----------|-----------|-------|-------------|
| **Default state** | Pre-selected ON | Pre-selected ON | **OFF** |
| **Default %** | 15% | 15-17% | 9% (when toggled on) |
| **Visible $0 option** | No | No | Yes (toggle off) |
| **Nonprofit can modify** | Can disable (triggers 3% fee) | **Cannot modify at all** | N/A (toggle is donor-controlled) |
| **Donor confusion reports** | Many (BBB, Trustpilot) | Many (G2, Trustpilot) | Few |
| **Class action investigation** | Yes | Yes | No |
| **Cost on $100 donation** | $18.60 total added | $15.00 total added | $0 (toggle off) to ~$12.20 (toggle on) |

### Campaign Pages

| Feature | Givebutter | Zeffy | Give Lively |
|---------|-----------|-------|-------------|
| **Templates** | Multiple | Limited | 2 |
| **Goal thermometer** | Yes (bar or thermometer) | Yes (customizable) | Yes (near-real-time) |
| **Donor wall** | Yes (social feed with engagement) | Yes (toggleable) | Yes (toggleable) |
| **Social sharing** | Yes + QR codes | Yes + QR codes | Yes |
| **P2P fundraising** | Yes (teams + individuals) | Yes | Yes (with leaderboard) |
| **Live event display** | Yes (confetti, big screen) | No | Yes (URL swap trick) |
| **Video embed** | Yes | Yes | Yes (YouTube/Vimeo) |
| **Thank-you customization** | None (fixed yellow) | Basic | Yes (merge tags) |

### Embeddable Widgets

| Feature | Givebutter | Zeffy | Give Lively |
|---------|-----------|-------|-------------|
| **Widget types** | 5 (button, floating, inline, goal bar, signup) | 3 (inline, popup, button) | 2 (simple, branded) |
| **Max width** | 420px | Unknown | Fills container |
| **Branding in embed** | Minimal | **None** (stripped) | Yes (branded widget) |
| **WordPress plugin** | Yes (1 review) | Yes | No |
| **Popup/modal** | Yes | Yes | No |
| **Custom triggers** | Yes (data attributes) | No | No |
| **Dashboard sync** | Yes (auto-propagate) | Yes | Yes |

### Payouts

| Feature | Givebutter | Zeffy | Give Lively |
|---------|-----------|-------|-------------|
| **Frequency** | Manual withdrawal | Weekly/monthly (Mondays only) | 2 biz days (card), 7 biz days (ACH) |
| **Auto-deposit** | No | Scheduled | Yes (Stripe automatic) |
| **On-demand** | No (manual) | No | No (Stripe schedule) |

---

## Recommendations for Give

### 1. Donation Form Design

**Target: 2-3 step checkout that beats all competitors on speed and clarity.**

**Recommended flow:**

| Step | Content |
|------|---------|
| 1 | Amount + frequency (one-time/monthly/quarterly/yearly) + optional fund designation. Preset amounts with impact descriptions. |
| 2 | Donor info + payment method. Name, email, address. Card/ACH/Apple Pay/Google Pay. Cover-the-fee checkbox. |
| 3 | Confirmation + receipt. Fully branded thank-you with org colors/logo, custom message, next steps. |

**Key UX decisions:**

- **No tip/contribution prompt.** Ever. This is our #1 differentiator. The donor pays exactly what they intend to pay. The nonprofit pays 1%.
- **"Cover the fee" checkbox** on Step 2, opt-in (not pre-selected), with clear math: "Add $3.50 to cover processing fees so 100% reaches [Org Name]." Consider letting orgs choose whether to include platform fee in coverage.
- **Form data persistence** — survive browser refresh, back button retains state (learn from Give Lively).
- **Single-page option** — For embeds and simple forms, offer a single-page mode (learn from Zeffy's simplicity).
- **Recurring upsell** — After one-time donation, gentle prompt: "Make this monthly?" (learn from Givebutter). Non-pushy, dismissible.
- **Dynamic suggested amounts per frequency** — Different tiers for one-time vs monthly. Impact descriptions. (learn from Givebutter).
- **ACH promotion** — When donor selects payment method, show: "Save with bank transfer — only 0.8% processing vs 2.2% for cards." (learn from Give Lively).

### 2. Campaign Page Design

- **3+ polished templates at MVP** — beat Give Lively's 2 templates and Zeffy's limited options.
- **Multiple brand colors** — primary, secondary, accent. Not just one hex code.
- **Supporter feed** — Build a donor wall with social engagement (learn from Givebutter's best feature). Messages, likes, comments.
- **Fully customizable thank-you page** — Org branding, custom message, rich text, next steps, social sharing prompts. Exploit Givebutter's fixed yellow weakness.
- **Goal thermometer** — Real-time updates, customizable style (bar/thermometer/circle), embeddable independently.
- **Live event display** — Plan for Round 1. Big-screen mode with animations, real-time feed.
- **QR codes** — Built-in generation from day one.

### 3. Fee Transparency

**This is the core brand message. Every UX decision should reinforce it.**

- **Zero donor surprises.** No tips, no hidden fees, no confusing checkboxes.
- **Clear fee disclosure** on every form: "Processing: 2.2% + $0.30 (card) or 0.8% (bank). Platform: 1%. That's it."
- **"$100 means $100" messaging** — comparison calculator showing what a donor pays on Give vs Givebutter vs Zeffy.
- **Receipt transparency** — Receipt email shows: donation amount, processing fee, platform fee, net to nonprofit. Full breakdown.

### 4. Embeddable Widgets

**Beat all competitors on embed quality:**

- **Full-width responsive** — no arbitrary width caps. Fill the container.
- **Multiple widget types** — inline form, popup modal, floating button, goal bar, thermometer-only, mini donation button.
- **Retain full branding** — embedded forms should look like the nonprofit's site, not Give's.
- **React/Vue component library** — developer-friendly components, not just HTML snippets.
- **All payment methods in embeds** — including digital wallets on all platforms (fix Give Lively's Wix problem).
- **No iframe limitations** — native web components with proper shadow DOM isolation.
- **WordPress, Squarespace, Wix, Webflow, Shopify plugins** — dedicated plugins, not just embed codes.

### 5. Payouts

**Automatic daily/weekly deposits. No manual withdrawal. This is a day-1 differentiator.**

- Leverage Stripe's automatic payout system
- Configurable schedule: daily (default), weekly, monthly
- Dashboard shows: next payout date, amount, bank account
- No Monday-only restriction (beat Zeffy)
- No manual initiation required (beat Givebutter)

### 6. Onboarding

**Instant self-service signup. No application review. Target: live form in under 5 minutes.**

- Sign up → Stripe Connect Express flow → customize form → live URL
- No "values review" gatekeeping (exploit Give Lively's 5-7 day wait)
- Let Stripe's KYC handle verification
- Accept all 501(c)(3) organizations without editorial judgment

### 7. Competitive Messaging Matrix

| Message | Target Competitor | Where to Use |
|---------|------------------|--------------|
| "On Givebutter, a $100 donation costs donors $118.60. On Give, it costs $100." | Givebutter | Pricing page, comparison content, ads |
| "Your donors will never see a surprise tip prompt." | Givebutter + Zeffy | Homepage, donation form marketing |
| "Automatic daily deposits. No manual withdrawals." | Givebutter | Features page |
| "Native Salesforce integration — included, not $250/mo extra." | Givebutter + GoFundMe Pro | Integrations page, Salesforce landing page |
| "Public API + webhooks from day one." | All three | Developer docs, integrations page |
| "Go live in 5 minutes. No application required." | Give Lively | Signup page, homepage |
| "1% platform fee. Not 15% donor tips." | Zeffy | Pricing page, competitor comparison |
| "A sustainable model that doesn't depend on confusing your donors." | Zeffy | About page, pricing page |
| "Your brand, your experience. Not a yellow thank-you screen." | Givebutter | Campaign pages marketing |
| "Payouts every day. Not just Mondays." | Zeffy | Features page |

---

## Sources

### Givebutter
- [Givebutter Fundraising Pages](https://givebutter.com/fundraising-pages)
- [Givebutter Donation Forms](https://givebutter.com/donation-forms)
- [Givebutter Pricing](https://givebutter.com/pricing)
- [Givebutter Standard Pricing Explained](https://help.givebutter.com/en/articles/1512762-givebutter-standard-pricing-explained)
- [Tips, Fees, and Transparency](https://help.givebutter.com/en/articles/4117457-tips-fees-and-our-commitment-to-100-transparency)
- [Givebutter Widgets](https://help.givebutter.com/en/articles/6464859-how-to-use-givebutter-widgets-on-your-website)
- [Givebutter Supporter Feed](https://givebutter.com/features/supporter-feed)
- [Givebutter Apple/Google Pay](https://givebutter.com/features/apple-pay-google-pay-donations)
- [Givebutter Recurring Donations](https://givebutter.com/features/recurring-donations)
- [Givebutter BBB Reviews](https://www.bbb.org/us/tx/austin/profile/marketing-software/givebutter-inc-0825-1000210184/customer-reviews)
- [Givebutter Trustpilot](https://www.trustpilot.com/review/givebutter.com) (4.4/5, 268 reviews)
- [Givebutter G2](https://www.g2.com/products/givebutter/reviews)
- [Givebutter Capterra](https://www.capterra.com/p/172048/Givebutter/reviews/)
- [Hidden Fees Class Action Investigation](https://topclassactions.com/lawsuit-settlements/investigations/hidden-fees-on-charitable-donations-class-action-lawsuit/)
- [Givebutter WordPress Plugin](https://wordpress.org/plugins/givebutter/)

### Zeffy
- [Zeffy Donation Forms](https://www.zeffy.com/home/free-online-donation-form)
- [Zeffy Voluntary Contribution FAQ](https://support.zeffy.com/can-i-change-or-customize-the-voluntary-contribution-to-zeffy)
- [Zeffy Form Setup](https://support.zeffy.com/how-do-i-set-up-a-donation-form)
- [Zeffy Embed Documentation](https://support.zeffy.com/how-do-i-add-my-form-to-my-website)
- [Zeffy Donate Button](https://www.zeffy.com/home/donate-button)
- [Zeffy Fundraising Thermometer](https://www.zeffy.com/home/fundraising-thermometer)
- [Zeffy Payment Methods](https://support.zeffy.com/zeffy-payment-methods)
- [Zeffy WordPress Plugin](https://wordpress.org/plugins/zeffy-donate-button/)
- [Zeffy Trustpilot](https://www.trustpilot.com/review/zeffy.com)
- [Zeffy Capterra](https://www.capterra.com/p/220131/Zeffy/reviews/)
- [Zeffy G2](https://www.g2.com/products/zeffy/reviews)
- [Nonprofit Marketing Nerds — Zeffy Analysis](https://nonprofit-nerd.com/blog/should-nonprofits-use-zeffy-to-process-donations)
- [Donorbox — Zeffy Reviews Analysis](https://donorbox.org/nonprofit-blog/zeffy-reviews)
- [4aGoodCause — Zeffy vs Givebutter](https://4agoodcause.com/zeffy-vs-givebutter/)

### Give Lively
- [Give Lively Campaign Pages](https://www.givelively.org/campaign-pages)
- [Give Lively Donation Widgets](https://www.givelively.org/donation-widgets)
- [Give Lively Features](https://www.givelively.org/features)
- [Give Lively Fees and Disbursement](https://www.givelively.org/fees-and-disbursement)
- [Give Lively Pricing](https://www.givelively.org/pricing)
- [Give Lively "Why We're Free"](https://www.givelively.org/free)
- [Give Lively Tip Slider Development](https://www.givelively.org/resources/see-the-development-of-the-give-lively-voluntary-tip-request)
- [Give Lively Payment Form Generations](https://www.givelively.org/resources/understand-give-lively-payment-forms)
- [Give Lively Widget Documentation](https://www.givelively.org/resources/use-embeddable-widgets-to-collect-donations-on-your-website)
- [Give Lively Membership Requirements](https://www.givelively.org/membership)
- [Give Lively Capterra](https://www.capterra.com/p/177952/Give-Lively-full-fundraising-platform/reviews/)
- [Give Lively G2](https://www.g2.com/products/give-lively/reviews)
- [118Group 8-Platform Review](https://118group.com/research/we-reviewed-and-scored-8-online-giving-platforms-heres-how-they-compared/)

### General
- [Paybee — Givebutter Hidden Fees Analysis](https://w.paybee.io/post/givebutter-hidden-fees-and-charges)
- [Donorbox — Zeffy Alternatives](https://donorbox.org/nonprofit-blog/zeffy-alternatives)
- [Banking Crowded — Zeffy Reviews](https://bankingcrowded.com/all-blogs/zeffy-reviews/)
