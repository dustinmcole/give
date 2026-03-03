"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────

export interface SocialShareProps {
  /** Canonical URL to share */
  url: string;
  /** Short title — used in tweet text, email subject, Web Share API */
  title: string;
  /** Optional body — used in email body and Web Share API */
  description?: string;
  /** Visual variant */
  variant?: "grid" | "row";
}

// ─── Intent URL builders ──────────────────────────────────

function facebookUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

function twitterUrl(url: string, title: string) {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}

function linkedinUrl(url: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

function emailUrl(url: string, title: string, description?: string) {
  const body = description ? `${description}\n\n${url}` : url;
  return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

// ─── Icons ────────────────────────────────────────────────

function IconX() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

// ─── Share button ─────────────────────────────────────────

interface ShareBtnProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  className?: string;
}

function ShareBtn({ href, onClick, icon, label, active, className = "" }: ShareBtnProps) {
  const base =
    "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all text-xs font-medium cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-give-primary/30";
  const idle = "border-gray-200 text-gray-600 hover:border-give-primary/40 hover:bg-give-primary/5 hover:text-give-primary";
  const done = "border-give-accent/40 bg-give-accent/5 text-give-accent";

  const cls = `${base} ${active ? done : idle} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
        {icon}
        <span>{label}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────

export default function SocialShare({ url, title, description, variant = "grid" }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [nativeShared, setNativeShared] = useState(false);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API unavailable — silently swallow
    }
  }, [url]);

  // Web Share API (mobile)
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleNativeShare = useCallback(async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({ url, title, text: description });
      setNativeShared(true);
      setTimeout(() => setNativeShared(false), 2500);
    } catch {
      // User cancelled or share failed — ignore
    }
  }, [url, title, description, canNativeShare]);

  const gridCls =
    variant === "grid"
      ? "grid grid-cols-3 sm:grid-cols-5 gap-2"
      : "flex flex-wrap gap-2";

  return (
    <div className={gridCls}>
      {/* Copy Link */}
      <ShareBtn
        onClick={handleCopy}
        icon={copied ? <IconCheck /> : <IconLink />}
        label={copied ? "Copied!" : "Copy Link"}
        active={copied}
      />

      {/* Facebook */}
      <ShareBtn
        href={facebookUrl(url)}
        icon={<IconFacebook />}
        label="Facebook"
      />

      {/* X / Twitter */}
      <ShareBtn
        href={twitterUrl(url, title)}
        icon={<IconX />}
        label="X / Twitter"
      />

      {/* LinkedIn */}
      <ShareBtn
        href={linkedinUrl(url)}
        icon={<IconLinkedIn />}
        label="LinkedIn"
      />

      {/* Email */}
      <ShareBtn
        href={emailUrl(url, title, description)}
        icon={<IconEmail />}
        label="Email"
      />

      {/* Web Share API — only render when API is available (mobile) */}
      {canNativeShare && (
        <ShareBtn
          onClick={handleNativeShare}
          icon={nativeShared ? <IconCheck /> : <IconShare />}
          label={nativeShared ? "Shared!" : "More"}
          active={nativeShared}
          className="sm:hidden" // hide on desktop where native share rarely applies
        />
      )}
    </div>
  );
}
