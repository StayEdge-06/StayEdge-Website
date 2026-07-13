import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Vira } from "@/components/ai/Vira";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "StayEdge — AI-Powered Airbnb Growth",
    template: "%s · StayEdge",
  },
  description: SITE.descriptor,
  applicationName: "StayEdge",
  openGraph: {
    title: "StayEdge — AI-Powered Airbnb Growth",
    description: SITE.descriptor,
    url: SITE.url,
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "StayEdge", description: SITE.descriptor },
  icons: { icon: "/brand/logos/stayedge-icon-only.png" },
};

export const viewport: Viewport = {
  themeColor: "#171123",
  colorScheme: "dark",
};

/**
 * Brand faces are loaded via Google Fonts here for reliable coverage of all six
 * families (incl. Boldonse). The Performance milestone will migrate these to
 * next/font self-hosting + subsetting for zero layout shift.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&family=Italiana&family=Outfit:wght@400;500;700;800&family=Lora:ital,wght@1,400;1,500&family=Jura:wght@300;400;500&family=IBM+Plex+Serif:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Bottom padding on mobile reserves space for the fixed MobileActionBar. */}
      <body className="min-h-full flex flex-col bg-se-ground text-se-offwhite pb-[76px] sm:pb-0">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Persistent thumb-zone conversion anchor (mobile only) */}
        <MobileActionBar />
        {/* Vira — the AI consultant presence, site-wide */}
        <Vira />
      </body>
    </html>
  );
}
