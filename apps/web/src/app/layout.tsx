import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://givefair.org";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  icons: {
    icon: "/favicon.svg",
  },
  title: {
    default: "Give — Fundraising That's Fair",
    template: "%s | Give",
  },
  description:
    "Transparent nonprofit fundraising with 1% fees. No hidden donor tips, no gotchas. Donation forms, CRM, events, peer-to-peer, and automatic payouts — everything your nonprofit needs.",
  keywords: [
    "nonprofit fundraising",
    "donation platform",
    "charity fundraising",
    "online donations",
    "peer-to-peer fundraising",
    "nonprofit CRM",
    "transparent fees",
    "Zeffy alternative",
    "Givebutter alternative",
  ],
  authors: [{ name: "Give" }],
  creator: "Give",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Give",
    title: "Give — Fundraising That's Fair",
    description:
      "1% platform fee. No hidden donor tips. No gotchas. Every dollar your supporters give goes to your mission.",
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
    title: "Give — Fundraising That's Fair",
    description:
      "1% platform fee. No hidden donor tips. No gotchas. Every dollar your supporters give goes to your mission.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
