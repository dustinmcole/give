"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
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
      const data = await res.json();
      if (res.ok && data.success) setState("success");
      else { setState("error"); setErrorMsg(data.message ?? "Something went wrong."); }
    } catch { setState("error"); setErrorMsg("Network error. Please check your connection."); }
  }

  if (state === "success") {
    return (
      <div className={`text-center ${compact ? "py-4" : "py-8"}`}>
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
