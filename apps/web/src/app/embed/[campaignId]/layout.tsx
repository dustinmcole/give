import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Donate",
  robots: { index: false, follow: false },
};

/**
 * Minimal embed layout — no nav, no footer, transparent background.
 * This wraps /embed/[campaignId] so it renders stripped of all site chrome.
 *
 * Note: X-Frame-Options and frame-ancestors CSP are set via Next.js headers
 * in next.config.ts, NOT via meta tags (browsers ignore meta X-Frame-Options).
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className="font-[family-name:var(--font-inter)] antialiased"
        style={{ background: "transparent" }}
      >
        {children}
      </body>
    </html>
  );
}
