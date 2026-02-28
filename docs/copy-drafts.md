# Give — Copy Drafts

> **Status:** Draft v1 — 2026-02-28
> **Brand voice:** Warm, confident, elevated. Not corporate. Not startup-bro. Every word earns its place.
> **Tagline:** "Generosity, elevated."

---

## 1. Landing Page

### Hero

**Headline:**
Fundraising that honors your mission.

**Subhead:**
Beautiful donation forms. Transparent pricing. Automatic payouts. Give is the modern fundraising platform built for nonprofits who refuse to settle — and donors who deserve clarity.

**Primary CTA:** Start raising funds
**Secondary CTA:** See how it works

---

### Feature Section

**Section headline:** Everything your nonprofit needs. Nothing it doesn't.

**Feature 1 — Donation Forms**
*Beautiful by default.*
Polished, mobile-optimized donation forms that reflect the care you put into your cause. One-time and recurring giving. Cards, ACH, Apple Pay, Google Pay. Live in minutes — no design degree required.

**Feature 2 — Automatic Payouts**
*Your money, on your schedule.*
Donations reach your bank account daily or weekly — automatically. No manual withdrawals. No waiting. No wondering where the money is.

**Feature 3 — Tax Receipts**
*Instant. Compliant. Branded.*
Every donor receives an IRS-compliant tax receipt the moment their gift is processed. Your logo, your warmth, zero effort on your end.

**Feature 4 — Cover-the-Fee Option**
*Let donors make it free for you.*
A single checkbox lets donors cover platform and processing fees. Many do. The result: 100% of their intended gift reaches your mission.

**Feature 5 — Salesforce Integration**
*Native. Real-time. Included.*
The only fundraising platform with a full Salesforce integration — NPSP and Nonprofit Cloud — included at no extra cost. Donations sync in seconds. GoFundMe Pro charges $250/month for theirs.

**Feature 6 — API-First Architecture**
*Built for builders.*
A public REST API and webhooks from day one. Embed donation forms anywhere. Connect to anything. Your fundraising data belongs to you — and it should be easy to use.

---

### Pricing Section

**Section headline:** Honest pricing. No gotchas. No donor tips.

**Body:**
Other platforms hide their fees behind "voluntary" donor tips that default to 15–17%. Donors are confused. Nonprofits look complicit. Everyone loses trust.

Give does it differently. We charge a simple, transparent platform fee to the nonprofit — never the donor. Your supporters see exactly where their money goes, and so do you.

| | Basic | Pro |
|---|---|---|
| **Platform fee** | **1%** | **2%** |
| Monthly fee | $0 | $0 |
| Donation forms | Included | Included |
| Automatic payouts | Included | Included |
| Tax receipts | Included | Included |
| Salesforce integration | Included | Included |
| Advanced automation & AI | — | Included |
| Priority support | — | Included |

**Fine print (displayed transparently):**
Payment processing fees (Stripe: ~2.2% + $0.30 for cards, 0.8% capped at $5 for ACH) are passed through at cost. We don't mark them up. We encourage ACH — it saves your nonprofit real money.

---

### Social Proof Section

**Section headline:** Trusted by nonprofits who care about transparency.

**Testimonial framework** (placeholder for real testimonials post-beta):

> "We switched from [Competitor] and our donors immediately noticed the difference. No more confused emails about tip prompts. Just clear, simple giving."
> — *[Name], [Title], [Organization]*

> "The Salesforce integration alone would have cost us $250/month with our old platform. Give includes it at 1%. The math was obvious."
> — *[Name], [Title], [Organization]*

> "Our board asked why we were letting a platform charge our donors 17% in hidden tips. We didn't have a good answer. Now we use Give."
> — *[Name], [Title], [Organization]*

**Stats bar** (populate post-launch):
- [X]+ nonprofits trust Give
- $[X]M+ raised through our platform
- [X]% average donor fee coverage opt-in rate

---

### CTA Section (Bottom of Page)

**Headline:** Your mission deserves better than hidden fees.

**Subhead:**
Set up your first donation form in under ten minutes. No credit card required. No contracts. Just a better way to fundraise.

**CTA:** Get started free

---

### Comparison Table

**Section headline:** How Give compares.

| | **Give** | **Givebutter** | **Zeffy** | **Give Lively** |
|---|---|---|---|---|
| **Platform fee** | **1%** | 0% (tips) or 3% | 0% (tips) | 0% |
| **Donor tips / surcharges** | **None** | 15% default tip | 15–17% default tip | None |
| **Monthly fee** | **$0** | $0–$279/mo | $0 | $0 |
| **Automatic payouts** | **Daily/weekly** | Manual withdrawal | Automatic | Automatic |
| **Salesforce integration** | **Included** | None (Zapier only) | None (no API) | AppExchange listing |
| **NPSP + Nonprofit Cloud** | **Both supported** | N/A | N/A | NPSP only |
| **Public API** | **Yes** | Limited | None | None |
| **Recurring giving** | **Included** | Included | Included | Included |
| **Cover-the-fee option** | **Yes** | Yes | N/A (tip model) | Yes |
| **Donor trust** | **Full transparency** | Tip confusion | Tip confusion | Transparent |

**Below the table:**
Not sure which platform is right for you? We get it — switching is a big decision. [See our detailed comparison guide →]

---

## 2. Donation Receipt Email

**Subject line:** Thank you for your gift to {org_name}

---

Dear {donor_first_name},

Thank you for your generous contribution to **{org_name}**. Your support makes a real difference.

**Donation details**

| | |
|---|---|
| **Organization** | {org_name} |
| **Amount** | {donation_amount} |
| **Date** | {donation_date} |
| **Payment method** | {payment_method_last4} |
| **Transaction ID** | {transaction_id} |
{if recurring}| **Frequency** | {recurring_frequency} |{/if}

---

**Tax receipt — please save for your records**

{org_name} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code. EIN: {org_ein}.

No goods or services were provided in exchange for this contribution. The full amount of your gift is tax-deductible to the extent permitted by law.

This letter serves as your official acknowledgment for tax purposes in accordance with IRS guidelines. For donations of $250 or more, this written acknowledgment is required to substantiate your charitable deduction.

---

{if fee_covered}
You chose to cover the transaction fees — thank you. That means 100% of your ${donation_amount} gift goes directly to {org_name}'s mission.
{/if}

{if recurring}
This is a {recurring_frequency} recurring gift. You can manage your giving anytime at {donor_portal_url}.
{/if}

With gratitude,
**{org_name}**

*Powered by [Give](https://give.to) — Generosity, elevated.*

---

## 3. Nonprofit Onboarding Welcome Email

**Subject line:** Welcome to Give — let's get you live.

---

Hi {admin_first_name},

Welcome to Give. You just joined a platform that believes nonprofits deserve better than hidden fees and confused donors.

Here's what happens next — it takes about ten minutes:

**Step 1: Connect your bank account**
We use Stripe to process payments securely. You'll walk through a quick verification to start receiving donations directly to your bank.
[Connect Stripe →]

**Step 2: Customize your donation form**
Add your logo, choose your colors, set your suggested amounts. Your form will be live at **give.to/{org_slug}** — a beautiful, mobile-ready page you can share anywhere.
[Set up your form →]

**Step 3: Share it**
Send your donation page to your community. Embed it on your website. Post it on social. Every gift processed through Give means transparent fees, instant receipts, and automatic payouts.

---

**A few things worth knowing:**

- **Your fees are simple.** 1% platform fee. That's it. No monthly charges, no donor tips, no surprises.
- **Payouts are automatic.** Donations reach your bank daily or weekly — you choose.
- **Donors get instant receipts.** IRS-compliant, branded with your organization's name and EIN.
- **Need Salesforce?** Connect it from your dashboard. NPSP and Nonprofit Cloud, real-time sync, included in your plan.

If you have questions at any point, reply to this email. A real person will get back to you.

Welcome aboard,
**The Give Team**

*P.S. — If you're migrating from another platform, we can help. Just reply and tell us where you're coming from.*

---

## 4. Campaign Page Default Copy

*This is the placeholder text shown when a nonprofit creates a new campaign before writing their own copy.*

---

**Campaign title:** {org_name} Fundraising Campaign

**Campaign description:**

Every gift makes a difference.

{org_name} is raising funds to further our mission and serve our community. Your contribution — of any size — directly supports our work and the people who depend on it.

**How your donation helps:**
- $25 — [describe impact at this level]
- $50 — [describe impact at this level]
- $100 — [describe impact at this level]
- $250 — [describe impact at this level]

**Why give today?**
Because the work doesn't wait. Every dollar raised through this campaign goes directly to {org_name}, with full transparency on how funds are used.

Thank you for being part of something meaningful.

**CTA button:** Donate now

---

**Guidance text shown to the nonprofit in the form builder:**

> *Tip: Replace this placeholder with your own story. The most successful campaigns are specific — tell donors exactly what their gift accomplishes. A compelling photo and a clear goal make all the difference.*

---

## 5. "Why Give?" — The Nonprofit One-Pager

### Why Give?
**Modern fundraising, honest pricing, built for nonprofits who want more.**

---

**The problem with fundraising platforms today**

Most fundraising tools make money in ways that undermine donor trust. Some default to a 15–17% "voluntary" tip that donors didn't ask for. Others bury fees in fine print or charge $300/month before you raise a dollar. And when you need your data in Salesforce? That's an add-on.

Give was built because nonprofits deserve a better deal — and donors deserve honesty.

---

**What makes Give different**

**Transparent 1% platform fee**
No donor tips. No monthly subscription. No hidden costs. You pay 1% on donations processed — that's it. Your donors see a clean checkout with no guilt-inducing surcharges. Payment processing (Stripe) is passed through at the nonprofit discount rate, never marked up.

**Automatic payouts**
Donations arrive in your bank account on a daily or weekly schedule you set. No manual withdrawals, no payout requests, no waiting. Your money moves when you need it to.

**Beautiful, modern experience**
Donation forms that look as good as your cause deserves. Mobile-optimized from the start. One-time, recurring, and cover-the-fee giving — all built in. Your supporters get a polished experience. You get a dashboard that actually makes sense.

**Native Salesforce integration — included**
Full AppExchange-listed integration supporting both NPSP and Nonprofit Cloud (Agentforce Nonprofit). Real-time bi-directional sync. Donors, donations, recurring gifts, and campaigns flow into Salesforce in seconds — not hours, not batches. Other platforms charge $50–$250/month for this. Ours is included in every plan.

**API-first architecture**
A public REST API and webhooks from day one. Embed forms on your website, connect to your existing tools, build custom workflows. Your fundraising data is yours — Give makes it accessible.

**Cover-the-fee option**
A simple checkbox lets donors cover the platform and processing fees, so 100% of their intended gift reaches you. It's optional, it's transparent, and donors appreciate the choice.

---

**How we compare**

| | **Give** | **Givebutter** | **Zeffy** | **Give Lively** | **GoFundMe Pro** |
|---|---|---|---|---|---|
| Platform fee | **1%** | 0% (tips) or 3% | 0% (tips) | 0% | 2.2% + $299/mo |
| Donor tips | **None** | 15% default | 15–17% default | None | None |
| Salesforce | **Included** | Zapier only | None | NPSP only | $250/mo add-on |
| Automatic payouts | **Yes** | Manual | Yes | Yes | Yes |
| Public API | **Yes** | Limited | None | None | Yes |
| Monthly fee | **$0** | $0–$279/mo | $0 | $0 | $299/mo |

---

**Who Give is for**

- Nonprofits processing $50K–$5M+ in online donations annually
- Organizations frustrated by donor tip confusion on their current platform
- Salesforce-powered nonprofits tired of paying extra for integration
- Development teams that want API access and webhook events
- Any 501(c)(3) that believes transparency builds donor trust

---

**Getting started**

1. **Sign up** at give.to — free, no credit card required
2. **Connect Stripe** to start receiving payments (5 minutes)
3. **Customize your form** with your brand colors and logo
4. **Share your page** and start accepting donations

Your first donation form can be live in under ten minutes.

---

**The bottom line**

Give charges nonprofits 1%. Not donors 17%. That's the whole philosophy.

Your supporters trust you with their generosity. Give helps you honor that trust with a platform that's transparent, beautiful, and built to get out of your way.

**Ready?** [Start raising funds →]

---

*Give is a product of Datawake. Questions? Reach us at hello@give.to.*
