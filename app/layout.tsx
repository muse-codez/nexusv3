import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusv3-tau.vercel.app"),
  title: "NexusFX | Video Editor for YouTubers & Gaming Creators",
  description:
    "NexusFX edits high-retention YouTube and gaming videos for creators including GamerFleet and I. M. Bixu. View work, services, and hire for your next video.",
  keywords: [
    "NexusFX",
    "Nexus FX",
    "nexu.fx4",
    "NexusFX video editor",
    "video editor for YouTubers",
    "gaming video editor for hire",
    "YouTube video editing services",
    "Minecraft video editor",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
