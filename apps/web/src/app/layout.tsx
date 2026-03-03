import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trygive.app"),
  icons: {
    icon: "/favicon.svg",
  },
  title: "Give — Nonprofit Fundraising with 1% Fees and No Hidden Tips",
  description:
    "Give is the transparent nonprofit fundraising platform charging just 1%. No hidden donor tips, no monthly fees, no gotchas. Donation forms, donor CRM, events, peer-to-peer campaigns, and automatic payouts — everything your nonprofit needs.",
  keywords: ["nonprofit fundraising", "donation platform", "1% fee", "givebutter alternative", "zeffy alternative", "donor management", "fundraising software"],
  openGraph: {
    title: "Give — Fundraising That's Fair",
    description: "1% platform fee. No hidden donor tips. No monthly fees. Everything your nonprofit needs in one platform.",
    url: "https://trygive.app",
    siteName: "Give",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Give — Nonprofit Fundraising Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Give — Fundraising That's Fair",
    description: "1% platform fee. No hidden donor tips. No monthly fees. Everything your nonprofit needs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
