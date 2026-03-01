import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Give",
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 1, 2026</p>

        <div className="mt-10 prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We collect information you provide directly: name, email, organization details when you
              create an account, and payment information processed securely through Stripe. For donors,
              we collect name, email, and payment details necessary to process donations.
            </p>
            <p className="mt-2 text-gray-600 leading-relaxed">
              We automatically collect usage data including IP address, browser type, pages visited,
              and interaction patterns to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We use your information to: process donations and payouts, manage your account,
              send transaction receipts and notifications, improve our platform, comply with legal
              obligations, and prevent fraud.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">3. Payment Processing</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              All payment processing is handled by Stripe. We never store credit card numbers on our
              servers. Stripe&apos;s privacy policy and PCI-DSS compliance govern payment data handling.
              Give charges a transparent 1% (Basic) or 2% (Pro) platform fee — no hidden charges to donors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">4. Data Sharing</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We share donor information with the nonprofit organization receiving the donation so
              they can acknowledge gifts and maintain donor relationships. We do not sell personal
              data to third parties. We may share data with service providers (Stripe, hosting,
              email) who process it on our behalf under strict agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We use industry-standard encryption (TLS/SSL) for data in transit and at rest.
              Access to personal data is restricted to authorized personnel. We conduct regular
              security reviews and maintain incident response procedures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">6. Your Rights</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              You may request access to, correction of, or deletion of your personal data at any time
              by contacting us. California residents have additional rights under the CCPA. We honor
              Do Not Track signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">7. Cookies</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We use essential cookies for authentication and session management. We use analytics
              cookies to understand how our platform is used. You can disable non-essential cookies
              in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">8. Contact</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              For privacy questions or data requests, contact us at{" "}
              <a href="mailto:privacy@givefundraising.com" className="text-give-primary hover:underline">
                privacy@givefundraising.com
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
