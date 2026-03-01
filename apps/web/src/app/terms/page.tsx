import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Give",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-give-bg">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-give-primary">
            Give
          </Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 1, 2026</p>

        <div className="mt-10 prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              By accessing or using Give (&quot;the Platform&quot;), operated by Datawake LLC, you agree
              to these Terms of Service. If you are accepting on behalf of an organization, you
              represent that you have authority to bind that organization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">2. Platform Description</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Give is a fundraising platform that enables 501(c)(3) nonprofit organizations to accept
              donations online. We provide donation forms, donor management, campaign tools, and
              automated payouts via Stripe Connect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">3. Fees & Pricing</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Give charges a transparent platform fee of 1% (Basic tier) or 2% (Pro tier) on each
              donation. Payment processing fees (approximately 2.2% + $0.30 for cards, 0.8% capped
              at $5 for ACH) are charged by Stripe and passed through to the organization. There are
              no monthly fees, no setup fees, and no hidden charges. Donors are never asked to pay
              tips or platform fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">4. Organization Responsibilities</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Organizations must: maintain valid 501(c)(3) status (or equivalent tax-exempt status),
              use donated funds for their stated charitable purposes, comply with all applicable laws
              including state charitable solicitation requirements, provide accurate organization
              information, and respond to donor inquiries in a timely manner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">5. Donor Rights</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Donors have the right to: know exactly what fees are charged, receive tax-deductible
              receipts for eligible donations, request refunds within 90 days (subject to organization
              approval), and have their personal data handled per our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">6. Prohibited Use</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              You may not use Give for: fraudulent fundraising, money laundering, personal (non-charitable)
              fundraising, any activity that violates applicable laws, or to process payments for goods
              or services (Give is for charitable donations only).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">7. Payouts</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Donations are paid out to organizations on a daily or weekly schedule via Stripe Connect.
              Give deducts the platform fee before payout. Stripe deducts processing fees separately.
              Payout timing depends on Stripe&apos;s standard schedule and your account verification status.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">8. Limitation of Liability</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Give is provided &quot;as is&quot; without warranties of any kind. Datawake LLC&apos;s total
              liability shall not exceed the platform fees paid by you in the 12 months preceding the claim.
              We are not liable for actions of organizations or donors using the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">9. Termination</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Either party may terminate at any time. Upon termination, we will process any pending
              payouts and provide a reasonable period to transition. We reserve the right to suspend
              accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">10. Contact</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Questions about these terms? Contact us at{" "}
              <a href="mailto:legal@givefundraising.com" className="text-give-primary hover:underline">
                legal@givefundraising.com
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
