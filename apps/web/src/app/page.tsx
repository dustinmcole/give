"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ─── Data ─────────────────────────────────────────────────

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
  { name: "Give", highlight: true, fee: "1%", feeNote: "basic tier", donorTips: "None", monthlyFee: "$0", features: "All included", payouts: "Automatic daily/weekly" },
  { name: "Zeffy", highlight: false, fee: "0%", feeNote: "but...", donorTips: "17% default tip", monthlyFee: "$0", features: "Basic", payouts: "Delayed" },
  { name: "Givebutter", highlight: false, fee: "0% or 3%", feeNote: "tips or fee", donorTips: "15% default tip", monthlyFee: "$0-$279", features: "Tiered", payouts: "Manual withdrawal" },
  { name: "Classy", highlight: false, fee: "2.2%+ fees", feeNote: "processing", donorTips: "None", monthlyFee: "$299+", features: "All included", payouts: "Varies" },
];

const TESTIMONIALS = [
  {
    quote: "We switched from Givebutter and immediately noticed the difference. Our donors stopped asking why 15% was going to 'tips'. Give just works — transparently.",
    author: "Sarah Chen",
    org: "Brightwater Community Foundation",
  },
  {
    quote: "The automatic payouts alone were worth the switch. I used to spend 30 minutes every month manually transferring funds. Now it just happens.",
    author: "Marcus Johnson",
    org: "Urban Youth Mentorship Alliance",
  },
  {
    quote: "1% with every feature included? I kept waiting for the catch. There wasn't one. Give is what nonprofit fundraising should have always been.",
    author: "Priya Nair",
    org: "Coastal Wildlife Rescue",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Create your account", description: "Sign up in under 2 minutes. No credit card, no contracts, no sales calls." },
  { step: "2", title: "Build your campaign", description: "Use our drag-and-drop editor to create beautiful donation forms, campaigns, and fundraising pages." },
  { step: "3", title: "Start raising funds", description: "Share your link. Accept donations. Get paid automatically. Track everything in your dashboard." },
];

const FAQS = [
  {
    q: "Is Give really 1%?",
    a: "Yes. Give charges 1% on the basic tier and 2% on the pro tier. That's it for platform fees. Payment processing costs (Stripe's fees: 2.2% + $0.30 for cards, 0.8% for ACH) are separate and standard across the industry.",
  },
  {
    q: "What about Zeffy — aren't they free?",
    a: "Zeffy advertises 0% fees but defaults to a 17% 'tip' suggestion shown to donors at checkout. Studies show most donors click the default. So while the platform fee is technically zero, your donors are effectively paying 17% on top of their donation. With Give, what donors give is what your org receives (minus transparent processing).",
  },
  {
    q: "How do payouts work?",
    a: "Donations flow through Stripe into your connected bank account automatically — either daily or weekly, your choice. No manual withdrawals, no waiting periods beyond standard ACH processing time (typically 2 business days).",
  },
];

// ─── Count-Up Hook ─────────────────────────────────────────

function useCountUp(target: number, duration = 1500, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

// ─── Waitlist Modal ────────────────────────────────────────

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [form, setForm] = useState({ orgName: "", email: "", estimatedVolume: "", currentPlatform: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "conflict">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 201) {
        setStatus("success");
      } else if (res.status === 409) {
        setStatus("conflict");
      } else {
        const data = await res.json() as { message?: string };
        setErrorMsg(data.message ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re on the list!</h3>
            <p className="text-gray-500">We&apos;ll reach out when Give is ready for you. Thanks for your interest.</p>
          </div>
        ) : status === "conflict" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Already signed up!</h3>
            <p className="text-gray-500">That email is already on our waitlist. We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Join the beta waitlist</h2>
            <p className="text-gray-500 text-sm mb-6">Be among the first nonprofits to use Give.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.orgName}
                  onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/50 focus:border-give-primary"
                  placeholder="Acme Foundation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/50 focus:border-give-primary"
                  placeholder="you@org.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated annual donation volume</label>
                <select
                  value={form.estimatedVolume}
                  onChange={e => setForm(f => ({ ...f, estimatedVolume: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/50 focus:border-give-primary bg-white"
                >
                  <option value="">Select range</option>
                  <option value="under_50k">Under $50K</option>
                  <option value="50k_250k">$50K – $250K</option>
                  <option value="250k_1m">$250K – $1M</option>
                  <option value="over_1m">Over $1M</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current fundraising platform</label>
                <select
                  value={form.currentPlatform}
                  onChange={e => setForm(f => ({ ...f, currentPlatform: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-give-primary/50 focus:border-give-primary bg-white"
                >
                  <option value="">Select platform</option>
                  <option value="zeffy">Zeffy</option>
                  <option value="givebutter">Givebutter</option>
                  <option value="classy">Classy</option>
                  <option value="bloomerang">Bloomerang</option>
                  <option value="donorbox">Donorbox</option>
                  <option value="none">None yet</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-give-primary hover:bg-give-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Submitting…" : "Join the waitlist"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Social Proof Numbers ──────────────────────────────────

function SocialProofBar() {
  const orgs = useCountUp(200, 1200);
  const raised = useCountUp(5, 1000);

  return (
    <section className="border-y border-gray-100 bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={orgs.ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{orgs.count}+</div>
            <div className="text-sm text-gray-500 mt-1">Nonprofits on waitlist</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">${raised.count}M+</div>
            <div className="text-sm text-gray-500 mt-1">In fundraising potential</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">1%</div>
            <div className="text-sm text-gray-500 mt-1">Platform fee</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">0%</div>
            <div className="text-sm text-gray-500 mt-1">Hidden donor tips</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Item ──────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
      >
        {q}
        <svg className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">{a}</div>}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────

export default function HomePage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-give-primary tracking-tight">Give</Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-give-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-give-primary transition-colors">Pricing</a>
            <a href="#compare" className="hover:text-give-primary transition-colors">Compare</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-give-primary transition-colors px-4 py-2">Log In</Link>
            <button
              onClick={() => setWaitlistOpen(true)}
              className="text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-5 py-2.5 rounded-lg"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 to-give-bg">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-give-primary/10 text-give-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-give-primary animate-pulse" />
              Now accepting beta signups
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Fundraising{" "}
              <span className="text-give-primary">that&apos;s fair.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              1% platform fee. No hidden donor tips. No gotchas. Every dollar your supporters give goes where they expect it to go &mdash; to your mission.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setWaitlistOpen(true)}
                className="w-full sm:w-auto text-center text-base font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-8 py-4 rounded-xl shadow-lg shadow-give-primary/25"
              >
                Join the Beta Waitlist
              </button>
              <a href="#pricing" className="w-full sm:w-auto text-center text-base font-semibold text-give-primary border-2 border-give-primary/20 hover:border-give-primary/40 transition-colors px-8 py-4 rounded-xl">
                See Pricing
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">Free during beta. No credit card required.</p>
          </div>
        </div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      </section>

      {/* ── Social Proof Bar ───────────────────────────── */}
      <SocialProofBar />

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything your nonprofit needs</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">One platform for donations, events, peer-to-peer campaigns, donor management, and more. No feature gates at the basic tier.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-shadow">
                <div className="w-12 h-12 bg-give-primary/10 rounded-xl flex items-center justify-center text-give-primary mb-5">{feature.icon}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Up and running in minutes</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">No lengthy onboarding. No sales calls. Just sign up and start raising funds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-give-primary/20 via-give-primary/40 to-give-primary/20" />
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="w-20 h-20 bg-give-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-extrabold text-white shadow-lg shadow-give-primary/25">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────── */}
      <section id="pricing" className="py-20 md:py-28 bg-give-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, honest pricing</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">No monthly fees. No contracts. No surprises. Just a small percentage that keeps the lights on.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic */}
            <div className="rounded-2xl border-2 border-gray-200 p-8 bg-white">
              <div className="text-sm font-semibold text-give-primary uppercase tracking-wider mb-2">Basic</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-gray-900">1%</span>
                <span className="text-gray-500">per donation</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">+ payment processing (2.2% + $0.30 card, 0.8% ACH)</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                {["Unlimited donation forms","Donor CRM & management","Campaign & fundraising pages","Peer-to-peer fundraising","Event ticketing","Automated tax receipts","Reporting & analytics","Automatic daily/weekly payouts","Multi-user access & roles","Cover-the-fee option"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-give-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => setWaitlistOpen(true)} className="block w-full text-center py-3 px-6 rounded-lg border-2 border-give-primary text-give-primary font-semibold hover:bg-give-primary hover:text-white transition-colors">
                Join Waitlist
              </button>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border-2 border-give-primary p-8 bg-white relative shadow-lg shadow-give-primary/10">
              <div className="absolute -top-3 right-8 bg-give-accent text-white text-xs font-bold px-3 py-1 rounded-full">Popular</div>
              <div className="text-sm font-semibold text-give-primary uppercase tracking-wider mb-2">Pro</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-gray-900">2%</span>
                <span className="text-gray-500">per donation</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">+ payment processing (2.2% + $0.30 card, 0.8% ACH)</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                {["Everything in Basic, plus:","Advanced automation & workflows","AI-powered donor insights","Priority support","Custom domains","Advanced segmentation","Native integrations (Salesforce, etc.)","Custom reporting","Dedicated account manager","Early access to new features"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-give-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => setWaitlistOpen(true)} className="block w-full text-center py-3 px-6 rounded-lg bg-give-primary text-white font-semibold hover:bg-give-primary-dark transition-colors">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison ─────────────────────────────────── */}
      <section id="compare" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">See how Give compares</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Other platforms hide their true cost behind donor tips and confusing fee structures. We don&apos;t.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 pr-4 font-medium text-gray-500 w-1/5" />
                  {COMPARISON.map((c) => (
                    <th key={c.name} className={`text-center py-4 px-4 font-semibold w-1/5 ${c.highlight ? "text-give-primary text-lg" : "text-gray-900"}`}>{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {[
                  { label: "Platform Fee", key: "fee" as const },
                  { label: "Hidden Donor Tips", key: "donorTips" as const },
                  { label: "Monthly Fee", key: "monthlyFee" as const },
                  { label: "Features", key: "features" as const },
                  { label: "Payouts", key: "payouts" as const },
                ].map(({ label, key }) => (
                  <tr key={label} className="border-b border-gray-100">
                    <td className="py-4 pr-4 font-medium text-gray-700">{label}</td>
                    {COMPARISON.map((c) => (
                      <td key={c.name} className={`text-center py-4 px-4 ${c.highlight ? "font-bold text-give-primary" : key === "donorTips" && c.donorTips !== "None" ? "text-red-500" : ""}`}>
                        {c[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <section id="testimonials" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nonprofits love Give</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Don&apos;t take our word for it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-give-bg rounded-2xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-give-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to fundraise with integrity?</h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">Join nonprofits that believe donors deserve to know where their money goes. Be first in line for the beta.</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setWaitlistOpen(true)}
              className="w-full sm:w-auto text-center text-base font-semibold text-give-primary bg-white hover:bg-gray-50 transition-colors px-8 py-4 rounded-xl"
            >
              Join the Beta Waitlist
            </button>
            <a href="#pricing" className="w-full sm:w-auto text-center text-base font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-colors px-8 py-4 rounded-xl">
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
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <div className="text-sm">&copy; {new Date().getFullYear()} Give. Fundraising that&apos;s fair.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
