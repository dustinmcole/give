"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ─── Data ─────────────────────────────────────────────────

const FEATURES = [
  { title: "Transparent Pricing", description: "1% basic, 2% pro. No donor tips. No hidden fees. No gotchas. Your donors see exactly where their money goes.", icon: "eye" as const },
  { title: "Every Feature Included", description: "Donation forms, donor CRM, events, peer-to-peer fundraising, reporting, and more. No feature gates at the basic tier.", icon: "grid" as const },
  { title: "Automatic Payouts", description: "Daily or weekly payouts directly to your bank account. No manual withdrawals. No delays. Your money, on time.", icon: "cash" as const },
];

const COMPARISON = [
  { name: "Give", highlight: true, fee: "1%", donorTips: "None", monthlyFee: "$0", features: "All included", payouts: "Auto daily/weekly" },
  { name: "Zeffy", highlight: false, fee: "0% (but...)", donorTips: "17% default tip", monthlyFee: "$0", features: "Basic", payouts: "Delayed" },
  { name: "Givebutter", highlight: false, fee: "0% or 3%", donorTips: "15% default tip", monthlyFee: "$0-$279", features: "Tiered", payouts: "Manual" },
  { name: "Classy", highlight: false, fee: "2.2%+ fees", donorTips: "None", monthlyFee: "$299+", features: "All included", payouts: "Varies" },
];

const TESTIMONIALS = [
  { quote: "We switched from Givebutter and our donors stopped being pressured to add a 15% tip. Conversion went up 12% and the average gift stayed the same.", author: "Sarah Chen", role: "Executive Director, Bright Futures Foundation", initial: "S" },
  { quote: "The automatic weekly payouts alone were worth switching. No more manual withdrawals and waiting days. The money just shows up.", author: "Marcus Williams", role: "Operations Manager, Community Health Alliance", initial: "M" },
  { quote: "At 1% we are actually saving money compared to Zeffy. When you factor in the donor tips they quietly collect, Give is genuinely cheaper.", author: "Dr. Priya Patel", role: "Founder, Education Equity Now", initial: "P" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Create your account", description: "Sign up, connect your bank via Stripe, and verify your nonprofit in under 5 minutes." },
  { step: "2", title: "Launch your campaign", description: "Build a branded donation page. Set goals, add peer-to-peer fundraising, or run a giving event." },
  { step: "3", title: "Get paid automatically", description: "Funds land in your bank account daily or weekly. No withdrawals, no waiting, no surprises." },
];

const FAQ_ITEMS = [
  { question: "Is Give really just 1%?", answer: "Yes. Give charges 1% as a platform fee on Basic (2% on Pro). You also pay payment processing fees (2.2% + $0.30 for cards, 0.8% for ACH) which go to Stripe. No monthly fees, no setup fees, no surprises." },
  { question: "What about Zeffy? They advertise 0% fees.", answer: "Zeffy is technically free, but they default donors to a 17% voluntary tip to support Zeffy. Many donors assume this goes to your nonprofit. In practice Zeffy can cost more. We charge a flat 1% and leave tips out entirely." },
  { question: "How do payouts work?", answer: "Donations are processed by Stripe and automatically paid out to your bank on a daily or weekly schedule. No minimum balance, no manual withdrawal. Most organizations see funds within 2-3 business days of each donation." },
  { question: "What payment methods do you support?", answer: "All major credit and debit cards, ACH bank transfers, Apple Pay, and Google Pay. Card processing is 2.2% + $0.30. ACH is just 0.8% capped at $5." },
  { question: "Do you support recurring donations?", answer: "Yes. Donors can choose monthly, quarterly, or annual recurring donations, managed automatically via Stripe Subscriptions. All recurring donors appear in your CRM." },
  { question: "What is the difference between Basic and Pro?", answer: "Basic (1%) includes everything: donation forms, donor CRM, peer-to-peer, events, reporting, automatic payouts, multi-user access. Pro (2%) adds AI donor insights, advanced automation, custom domains, CRM integrations, and a dedicated account manager." },
];

// ─── Hooks & Sub-components ───────────────────────────────

function useCountUp(target: number, duration: number, started: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let rafId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration]);
  return count;
}

function SocialProofBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const orgs = useCountUp(2400, 1500, visible);
  const raised = useCountUp(18, 1500, visible);
  return (
    <section ref={ref} className="border-y border-gray-100 bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 tabular-nums">{visible ? `${orgs.toLocaleString()}+` : "0"}</div>
            <div className="text-sm text-gray-500 mt-1">Nonprofits waitlisted</div>
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
            <div className="text-2xl font-bold text-gray-900 tabular-nums">{visible ? `$${raised}M+` : "$0"}</div>
            <div className="text-sm text-gray-500 mt-1">Ready to raise</div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FormState = "idle" | "loading" | "success" | "error";
interface WaitlistApiResponse { success?: boolean; message?: string; error?: string; }

function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [estimatedVolume, setEstimatedVolume] = useState("");
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgName.trim() || !email.trim()) return;
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName: orgName.trim(), email: email.trim(), estimatedVolume: estimatedVolume || undefined, currentPlatform: currentPlatform || undefined }),
      });
      const data = (await res.json()) as WaitlistApiResponse;
      if (res.ok && data.success) { setState("success"); }
      else { setState("error"); setErrorMsg(data.message ?? "Something went wrong. Please try again."); }
    } catch { setState("error"); setErrorMsg("Network error. Please check your connection and try again."); }
  }

  if (state === "success") {
    return (
      <div className={`text-center ${compact ? "py-4" : "py-8"}`}>
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={`font-bold text-gray-900 mb-2 ${compact ? "text-lg" : "text-2xl"}`}>You are on the list!</h3>
        <p className="text-gray-500 text-sm">We will be in touch soon. Check your email for a confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div>
          <label htmlFor="wl-org" className="block text-sm font-medium text-gray-700 mb-1">Organization name <span className="text-red-500">*</span></label>
          <input id="wl-org" type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Bright Futures Foundation" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-give-primary/30 focus:border-give-primary text-sm" />
        </div>
        <div>
          <label htmlFor="wl-email" className="block text-sm font-medium text-gray-700 mb-1">Work email <span className="text-red-500">*</span></label>
          <input id="wl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourorg.org" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-give-primary/30 focus:border-give-primary text-sm" />
        </div>
      </div>
      {!compact && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="wl-vol" className="block text-sm font-medium text-gray-700 mb-1">Annual online donations</label>
            <select id="wl-vol" value={estimatedVolume} onChange={(e) => setEstimatedVolume(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-give-primary/30 focus:border-give-primary text-sm bg-white">
              <option value="">Select range (optional)</option>
              <option value="Under $10K">Under $10K</option>
              <option value="$10K-$50K">$10K - $50K</option>
              <option value="$50K-$100K">$50K - $100K</option>
              <option value="$100K-$500K">$100K - $500K</option>
              <option value="$500K+">$500K+</option>
            </select>
          </div>
          <div>
            <label htmlFor="wl-platform" className="block text-sm font-medium text-gray-700 mb-1">Current platform</label>
            <select id="wl-platform" value={currentPlatform} onChange={(e) => setCurrentPlatform(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-give-primary/30 focus:border-give-primary text-sm bg-white">
              <option value="">Select platform (optional)</option>
              <option value="Zeffy">Zeffy</option>
              <option value="Givebutter">Givebutter</option>
              <option value="Classy">Classy</option>
              <option value="Blackbaud">Blackbaud</option>
              <option value="DonorPerfect">DonorPerfect</option>
              <option value="Other">Other</option>
              <option value="None">None / just starting</option>
            </select>
          </div>
        </div>
      )}
      {state === "error" && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{errorMsg}</p>}
      <button type="submit" disabled={state === "loading"} className="w-full text-center text-base font-semibold text-white bg-give-primary hover:bg-give-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-8 py-3.5 rounded-xl shadow-lg shadow-give-primary/25">
        {state === "loading" ? "Joining..." : "Join the Waitlist \u2192"}
      </button>
      <p className="text-xs text-center text-gray-400">Free to join. No spam. Ever.</p>
    </form>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900">{question}</span>
        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-6 pb-5 pt-4 text-gray-600 leading-relaxed text-sm border-t border-gray-100">{answer}</div>}
    </div>
  );
}

function FeatureIcon({ icon }: { icon: "eye" | "grid" | "cash" }) {
  if (icon === "eye") return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  if (icon === "grid") return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}
// ─── Page ─────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-give-primary tracking-tight">Give</Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-give-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-give-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-give-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-give-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-give-primary transition-colors px-4 py-2">Log In</Link>
            <a href="#waitlist" className="text-sm font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-5 py-2.5 rounded-lg">Join Beta</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 to-give-bg">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-give-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-give-primary rounded-full animate-pulse" />
              Now accepting beta signups
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Fundraising{" "}<span className="text-give-primary">that&apos;s fair.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              1% platform fee. No hidden donor tips. No monthly contracts.
              The first fundraising platform built around your mission, not ours.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#waitlist" className="w-full sm:w-auto text-center text-base font-semibold text-white bg-give-primary hover:bg-give-primary-dark transition-colors px-8 py-4 rounded-xl shadow-lg shadow-give-primary/25">
                Join the Beta Waitlist
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto text-center text-base font-semibold text-give-primary border-2 border-give-primary/20 hover:border-give-primary/40 transition-colors px-8 py-4 rounded-xl">
                See How It Works
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">Free to join. No credit card required.</p>
          </div>
        </div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything your nonprofit needs</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">One platform for donations, events, peer-to-peer, donor management, and more. No feature gates.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-shadow">
                <div className="w-12 h-12 bg-give-primary/10 rounded-xl flex items-center justify-center text-give-primary mb-5">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Up and running in minutes</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">No long onboarding. No sales calls. No implementation fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-give-primary rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mb-6 shadow-lg shadow-give-primary/20">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-give-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nonprofits love Give</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Real feedback from nonprofits who are done paying hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col">
                <div className="flex-1">
                  <div className="text-give-primary text-4xl font-serif mb-3 leading-none">&ldquo;</div>
                  <p className="text-gray-600 leading-relaxed text-sm mb-6">{t.quote}</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-give-primary/10 rounded-full flex items-center justify-center text-give-primary font-bold text-sm flex-shrink-0">{t.initial}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.author}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, honest pricing</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">No monthly fees. No contracts. No surprises.</p>
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
                {["Unlimited donation forms", "Donor CRM & management", "Campaign & fundraising pages", "Peer-to-peer fundraising", "Event ticketing", "Automated tax receipts", "Reporting & analytics", "Automatic daily/weekly payouts", "Multi-user access & roles", "Cover-the-fee option"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-give-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#waitlist" className="block w-full text-center py-3 px-6 rounded-lg border-2 border-give-primary text-give-primary font-semibold hover:bg-give-primary hover:text-white transition-colors">
                Join Waitlist
              </a>
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
                {["Everything in Basic, plus:", "Advanced automation & workflows", "AI-powered donor insights", "Priority support", "Custom domains", "Advanced segmentation", "Native integrations (Salesforce, etc.)", "Custom reporting", "Dedicated account manager", "Early access to new features"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-give-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#waitlist" className="block w-full text-center py-3 px-6 rounded-lg bg-give-primary text-white font-semibold hover:bg-give-primary-dark transition-colors">
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">See how Give compares</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Other platforms hide their true cost behind donor tips and confusing fee structures.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 pr-4 font-medium text-gray-500 w-1/5" />
                  {COMPARISON.map((c) => (
                    <th key={c.name} className={`text-center py-4 px-4 font-semibold w-1/5 ${c.highlight ? "text-give-primary text-lg" : "text-gray-900"}`}>
                      {c.name}
                    </th>
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

      {/* Waitlist */}
      <section id="waitlist" className="py-20 md:py-28 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-give-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 bg-give-primary rounded-full animate-pulse" />
              Limited beta spots available
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Join the waitlist</h2>
            <p className="mt-4 text-lg text-gray-500">
              Be among the first nonprofits to fundraise with integrity. Tell us a little about your org and we will reach out when your spot is ready.
            </p>
          </div>
          <div className="bg-give-bg rounded-2xl border border-gray-100 p-8">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-give-bg">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need to know before switching.</p>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-give-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to fundraise with integrity?</h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Join nonprofits that believe donors deserve to know where their money goes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#waitlist" className="w-full sm:w-auto text-center text-base font-semibold text-give-primary bg-white hover:bg-gray-50 transition-colors px-8 py-4 rounded-xl">
              Join the Waitlist
            </a>
            <a href="#pricing" className="w-full sm:w-auto text-center text-base font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-colors px-8 py-4 rounded-xl">
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <div className="text-sm">&copy; {new Date().getFullYear()} Give. Fundraising that&apos;s fair.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
