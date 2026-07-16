import type { Metadata, Viewport } from "next";
import {
  Boldonse,
  Italiana,
  Outfit,
  Lora,
  Jura,
  IBM_Plex_Serif,
} from "next/font/google";
import "./globals.css";

/* Brand faces, self-hosted via next/font (zero layout shift, no render-blocking
   font CSS). Same six faces the Brand OS mandates — only the delivery changed. */
const boldonse = Boldonse({ weight: "400", subsets: ["latin"], variable: "--font-boldonse", display: "swap" });
const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-italiana", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const lora = Lora({ subsets: ["latin"], style: "italic", variable: "--font-lora", display: "swap" });
const jura = Jura({ subsets: ["latin"], variable: "--font-jura", display: "swap" });
const plex = IBM_Plex_Serif({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-plex", display: "swap" });

const fontVars = `${boldonse.variable} ${italiana.variable} ${outfit.variable} ${lora.variable} ${jura.variable} ${plex.variable}`;
import { SITE } from "@/lib/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Vira } from "@/components/ai/Vira";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { CONTACT } from "@/lib/config/site";

/** Structured data — real business facts only (brand law: every claim provable). */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "StayEdge",
  description: SITE.descriptor,
  url: SITE.url,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  founder: { "@type": "Person", name: CONTACT.founder },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tirupati",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  areaServed: "IN",
  sameAs: ["https://www.instagram.com/stayedgeofficial"],
};

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${fontVars}`}>
      {/* Bottom padding on mobile reserves space for the fixed MobileActionBar. */}
      <body className="min-h-full flex flex-col bg-se-ground text-se-offwhite pb-[76px] sm:pb-0">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Persistent thumb-zone conversion anchor (mobile only) */}
        <MobileActionBar />
        {/* Vira — the AI consultant presence, site-wide */}
        <Vira />
        {/* Consent-gated measurement (GA4 + Clarity via env IDs) */}
        <AnalyticsProvider />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}
