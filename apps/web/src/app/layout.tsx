import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://givefundraising.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.svg",
  },
  title: "Give — Fundraising That's Fair",
  description:
    "Transparent nonprofit fundraising with 1% fees. No hidden donor tips, no gotchas. Donation forms, CRM, events, peer-to-peer, and automatic payouts — everything your nonprofit needs.",
  keywords: [
    "nonprofit fundraising",
    "donation platform",
    "fundraising software",
    "transparent fees",
    "donor management",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Give",
    title: "Give — Fundraising That's Fair",
    description:
      "1% platform fee. No hidden donor tips. No gotchas. The nonprofit fundraising platform built on transparency.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Give — Fundraising That's Fair",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@givefundraising",
    title: "Give — Fundraising That's Fair",
    description:
      "1% platform fee. No hidden donor tips. No gotchas. The nonprofit fundraising platform built on transparency.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-give-bg text-give-text font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
