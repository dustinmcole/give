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
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Allow embedding in iframes from any origin */}
        <meta httpEquiv="X-Frame-Options" content="ALLOWALL" />
      </head>
      <body
        className="font-[family-name:var(--font-inter)] antialiased"
        style={{ background: "transparent" }}
      >
        {children}
      </body>
    </html>
  );
}
