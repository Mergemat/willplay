import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | WillPlay",
    default: "WillPlay - Your Game Collection Manager",
  },
  description:
    "Track, organize, and prioritize your game collection. Never lose track of what you want to play next.",
  keywords: [
    "game tracker",
    "video games",
    "game collection",
    "backlog manager",
    "gaming",
    "game priority",
    "steam",
    "organize",
    "library",
    "game library",
    "Steam organize library",
  ],
  authors: [{ name: "@Mergemat" }],
  creator: "@Mergemat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://willplay.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://willplay.me",
    title: "WillPlay - Your Game Collection Manager",
    description:
      "Track, organize, and prioritize your game collection. Never lose track of what you want to play next.",
    siteName: "WillPlay",
  },
  twitter: {
    card: "summary_large_image",
    title: "WillPlay - Your Game Collection Manager",
    description:
      "Track, organize, and prioritize your game collection. Never lose track of what you want to play next.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${plusJakartaSans.variable} dark`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-svh antialiased">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
