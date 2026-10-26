import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Pixelify Sans from Google Fonts — pixel style, but far more
// readable than a blocky pixel font, so it works for the name and
// titles, not just tiny labels.
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

// Minecraft.ttf supplied by the user, loaded locally, for small
// pixel labels only. Balloon / bubble fonts (BALLOON DREAMS,
// Fungky Brow) were removed at the user's request.
const minecraftFont = localFont({
  src: "./fonts/Minecraft.ttf",
  variable: "--font-minecraft-font",
  weight: "400",
});

// Metadata copied from v1/v2 (same client, same copy) — title,
// description, keywords, openGraph and twitter. v3 improvement:
// metadataBase is set to v3's confirmed Vercel domain, so the
// relative /og image resolves correctly for social crawlers.
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
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://nexusv3-tau.vercel.app",
    title: "NexusFX | Video Editor for YouTubers & Gaming Creators",
    description:
      "NexusFX edits high-retention YouTube and gaming videos for creators including GamerFleet and I. M. Bixu.",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "NexusFX — Video Editor for YouTubers & Gaming Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusFX | Video Editor for YouTubers & Gaming Creators",
    description:
      "NexusFX edits high-retention YouTube and gaming videos for creators including GamerFleet and I. M. Bixu.",
    images: ["/og"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pixelify.variable} ${minecraftFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
