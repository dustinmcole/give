import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  title: "Give — Fundraising That's Fair",
  description:
    "Transparent nonprofit fundraising with 1% fees. No hidden donor tips, no gotchas. Donation forms, CRM, events, peer-to-peer, and automatic payouts — everything your nonprofit needs.",
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
