"use client";

import Link from "next/link";
import { useState } from "react";

const FEATURES = [
  {
    title: "Transparent Pricing",
    description:
      "1% basic, 2% pro. No donor tips. No hidden fees. No gotchas. Your donors see exactly where their money goes.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Every Feature Included",
    description:
      "Donation forms, donor CRM, events, peer-to-peer fundraising, reporting, and more. No feature gates at the basic tier.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Automatic Payouts",
    description:
      "Daily or weekly payouts directly to your bank account. No manual withdrawals. No delays. Your money, on time.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

const COMPARISON = [
  {
    name: "Give",
    highlight: true,
    fee: "1%",
    feeNote: "basic tier",
    donorTips: "None",
    monthlyFee: "$0",
    features: "All included",
    payouts: "Automatic daily/weekly",
  },
  {
    name: "Zeffy",
    highlight: false,
    fee: "0%",
    feeNote: "but...",
    donorTips: "17% default tip",
    monthlyFee: "$0",
    features: "Basic",
    payouts: "Delayed",
  },
  {
    name: "Givebutter",
    highlight: false,
    fee: "0% or 3%",
    feeNote: "tips or fee",
    donorTips: "15% default tip",
    monthlyFee: "$0-$279",
    features: "Tiered",
    payouts: "Manual withdrawal",
  },
  {
    name: "Classy",
    highlight: false,
    fee: "2.2%+ fees",
    feeNote: "processing",
    donorTips: "None",
    monthlyFee: "$299+",
    features: "All included",
    payouts: "Varies",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We switched from Givebutter and couldn't be happier. The fees are transparent and our donors trust us more because of it. Give is exactly what the nonprofit world has been missing.",
    author: "Sarah M.",
    role: "Executive Director, Sunrise Community Foundation",
    initials: "SM",
  },
  {
    quote:
      "The dashboard is intuitive, payouts are automatic, and support actually responds. It took us 20 minutes to set up our first campaign. Wish we'd found this years ago.",
    author: "David K.",
    role: "Development Manager, Westside Animal Rescue",
    initials: "DK",
  },
  {
    quote:
      "Our board was skeptical about switching platforms mid-year. After one quarter on Give, they asked why we didn't do it sooner. The reporting alone is worth it.",
    author: "Priya R.",
    role: "COO, Open Door Youth Services",
    initials: "PR",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Sign up & connect your bank",
    description:
      "Create your organization profile and connect your bank account via Stripe. Takes under 5 minutes — no paperwork, no waiting.",
  },
  {
    step: "2",
    title: "Launch your campaigns",
    description:
      "Build beautiful donation forms, set up peer-to-peer campaigns, or create event ticketing pages. Embed anywhere or share a direct link.",
  },
  {
    step: "3",
    title: "Watch the donations roll in",
    description:
      "Donors give, you get paid automatically on a daily or weekly schedule. Track everything in real-time from your dashboard.",
  },
];

const FAQ = [
  {
    q: "What does 'beta' mean for my organization?",
    a: "During beta, you get full access to all features at no cost beyond the standard processing fees. We're gathering feedback to shape the product. Your data is real, payouts are real — nothing is simulated.",
  },
  {
    q: "Are there any setup fees or contracts?",
    a: "None. Give is pay-as-you-go. The 1% platform fee only applies when you process donations. No monthly minimums, no annual contracts, no cancellation fees.",
  },
  {
    q: "What about payment processing fees?",
    a: "Stripe handles payment processing at their standard rates: 2.2% + $0.30 for card payments, 0.8% for ACH bank transfers. These are separate from Give's platform fee and go directly to Stripe.",
  },
  {
    q: "Can donors cover the fees?",
    a: "Yes. Give includes a built-in 'cover the fees' option on all donation forms. When donors opt in, you receive 100% of their intended donation amount.",
  },
  {
    q: "How is Give different from Zeffy's 0% model?",
    a: "Zeffy's forms default to a 17% donor tip that goes to Zeffy — not your organization. Many donors think they're giving more to you when they're not. Give charges a transparent 1% with zero hidden tips.",
  },
];

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${apiBase}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName, email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          (data as { error?: { message?: string } }).error?.message ?? "Something went wrong. Please try again."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-give-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-give-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re on the list!</h3>
            <p className="text-gray-500 text-sm">
              We&apos;ll reach out with early access as we open up spots. Thanks for your interest in Give.
            </p>
            <button
              onClick={onClose}
              className="mt-6 text-give-primary font-semibold text-sm hover:underline"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Join the beta waitlist</h3>
              <p className="text-gray-500 text-sm mt-1">
                Get early access to Give. We&apos;ll notify you when your spot is ready.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="orgName">
                  Organization name
                </label>
                <input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Sunrise Community Foundation"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/30 focus:border-give-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourorg.org"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/30 focus:border-give-primary transition"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 px-6 bg-give-primary text-white font-semibold rounded-lg hover:bg-give-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Joining…" : "Request early access"}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">
              No spam. No credit card. Just an early access invite.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <div className="min-h-screen">
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-give-primary tracking-tight">
            Give
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-give-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-give-primary transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-give-primary transition-colors">Pricing</a>
            <a href="#compare" className="hover:text-give-primary transition-colors">Compare</a>
            <a href="#faq" className="hover:text-give-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-give-primary transition-colors px-4 py-2"
            >
              Log In
            </Link>
            <button
              onClick={() => setShowWaitlist(true)}
              className="text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-5 py-2.5 rounded-lg"
            >
              Join Beta
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 to-give-bg">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-give-primary/10 text-give-primary text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-give-accent rounded-full animate-pulse" />
              Now in beta — limited early access
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Fundraising{" "}
              <span className="text-give-primary">that&apos;s fair.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              1% platform fee. No hidden donor tips. No gotchas. Every dollar your
              supporters give goes where they expect it to go &mdash; to your mission.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowWaitlist(true)}
                className="w-full sm:w-auto text-center text-base font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-8 py-4 rounded-xl shadow-lg shadow-give-primary/25"
              >
                Request early access
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto text-center text-base font-semibold text-give-primary border-2 border-give-primary/20 hover:border-give-primary/40 transition-colors px-8 py-4 rounded-xl"
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Free during beta. No credit card required.
            </p>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      </section>

      {/* ── Social Proof Bar ───────────────────────────── */}
      <section className="border-y border-gray-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">$0</div>
              <div className="text-sm text-gray-500 mt-1">Monthly fees</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1%</div>
              <div className="text-sm text-gray-500 mt-1">Platform fee</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">0%</div>
              <div className="text-sm text-gray-500 mt-1">Donor tips</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Auto</div>
              <div className="text-sm text-gray-500 mt-1">Payouts to your bank</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything your nonprofit needs
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              One platform for donations, events, peer-to-peer campaigns, donor
              management, and more. No feature gates at the basic tier.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-shadow"
              >
                <div className="w-12 h-12 bg-give-primary/10 rounded-xl flex items-center justify-center text-give-primary mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              No sales calls. No long onboarding. Just a fast, painless setup.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex flex-col items-start">
                <div className="w-12 h-12 rounded-full bg-give-primary text-white font-bold text-lg flex items-center justify-center mb-5">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <button
              onClick={() => setShowWaitlist(true)}
              className="inline-flex items-center gap-2 text-base font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-8 py-4 rounded-xl shadow-lg shadow-give-primary/20"
            >
              Get started free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <section className="py-20 md:py-28 bg-give-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nonprofits love Give
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Don&apos;t take our word for it.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed flex-1 italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-give-primary/10 text-give-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────── */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simple, honest pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              No monthly fees. No contracts. No surprises. Just a small percentage
              that keeps the lights on.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic */}
            <div className="rounded-2xl border-2 border-gray-200 p-8 bg-give-bg">
              <div className="text-sm font-semibold text-give-primary uppercase tracking-wider mb-2">Basic</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-gray-900">1%</span>
                <span className="text-gray-500">per donation</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">+ payment processing (2.2% + $0.30 card, 0.8% ACH)</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                {[
                  "Unlimited donation forms",
                  "Donor CRM & management",
                  "Campaign & fundraising pages",
                  "Peer-to-peer fundraising",
                  "Event ticketing",
                  "Automated tax receipts",
                  "Reporting & analytics",
                  "Automatic daily/weekly payouts",
                  "Multi-user access & roles",
                  "Cover-the-fee option",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-give-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowWaitlist(true)}
                className="block w-full text-center py-3 px-6 rounded-lg border-2 border-give-primary text-give-primary font-semibold hover:bg-give-primary hover:text-white transition-colors"
              >
                Join beta waitlist
              </button>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border-2 border-give-primary p-8 bg-white relative shadow-lg shadow-give-primary/10">
              <div className="absolute -top-3 right-8 bg-give-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="text-sm font-semibold text-give-primary uppercase tracking-wider mb-2">Pro</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-gray-900">2%</span>
                <span className="text-gray-500">per donation</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">+ payment processing (2.2% + $0.30 card, 0.8% ACH)</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                {[
                  "Everything in Basic, plus:",
                  "Advanced automation & workflows",
                  "AI-powered donor insights",
                  "Priority support",
                  "Custom domains",
                  "Advanced segmentation",
                  "Native integrations (Salesforce, etc.)",
                  "Custom reporting",
                  "Dedicated account manager",
                  "Early access to new features",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-give-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowWaitlist(true)}
                className="block w-full text-center py-3 px-6 rounded-lg bg-give-primary text-white font-semibold hover:bg-give-primary-dark transition-colors"
              >
                Join beta waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison ─────────────────────────────────── */}
      <section id="compare" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              See how Give compares
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Other platforms hide their true cost behind donor tips and confusing
              fee structures. We don&apos;t.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 pr-4 font-medium text-gray-500 w-1/5" />
                  {COMPARISON.map((c) => (
                    <th
                      key={c.name}
                      className={`text-center py-4 px-4 font-semibold w-1/5 ${
                        c.highlight ? "text-give-primary text-lg" : "text-gray-900"
                      }`}
                    >
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium text-gray-700">Platform Fee</td>
                  {COMPARISON.map((c) => (
                    <td key={c.name} className={`text-center py-4 px-4 ${c.highlight ? "font-bold text-give-primary" : ""}`}>
                      {c.fee}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium text-gray-700">Hidden Donor Tips</td>
                  {COMPARISON.map((c) => (
                    <td key={c.name} className={`text-center py-4 px-4 ${c.highlight ? "font-bold text-give-accent" : c.donorTips !== "None" ? "text-red-500" : ""}`}>
                      {c.donorTips}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium text-gray-700">Monthly Fee</td>
                  {COMPARISON.map((c) => (
                    <td key={c.name} className={`text-center py-4 px-4 ${c.highlight ? "font-bold text-give-accent" : ""}`}>
                      {c.monthlyFee}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium text-gray-700">Features</td>
                  {COMPARISON.map((c) => (
                    <td key={c.name} className={`text-center py-4 px-4 ${c.highlight ? "font-bold text-give-primary" : ""}`}>
                      {c.features}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-gray-700">Payouts</td>
                  {COMPARISON.map((c) => (
                    <td key={c.name} className={`text-center py-4 px-4 ${c.highlight ? "font-bold text-give-accent" : ""}`}>
                      {c.payouts}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="border border-gray-100 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
            <a
              href="mailto:hello@givefundraising.com"
              className="text-give-primary font-semibold text-sm hover:underline"
            >
              Get in touch →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-give-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to fundraise with integrity?
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Join nonprofits that believe donors deserve to know where their money
            goes. Free during beta.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowWaitlist(true)}
              className="w-full sm:w-auto text-center text-base font-semibold text-give-primary bg-white hover:bg-gray-50 transition-colors px-8 py-4 rounded-xl"
            >
              Request early access
            </button>
            <a
              href="#pricing"
              className="w-full sm:w-auto text-center text-base font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-colors px-8 py-4 rounded-xl"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xl font-bold text-white tracking-tight">Give</div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#compare" className="hover:text-white transition-colors">Compare</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Give. Fundraising that&apos;s fair.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
