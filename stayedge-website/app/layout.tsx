import type { Metadata, Viewport } from "next";
import {
  Boldonse,
  Italiana,
  Outfit,
  Lora,
  Jura,
  IBM_Plex_Serif,
} from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
import { CursorSpotlight } from "@/components/motion/CursorSpotlight";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, founderSchema, websiteSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "StayEdge — AI-Powered Airbnb Growth",
    template: "%s · StayEdge",
  },
  description: SITE.descriptor,
  applicationName: "StayEdge",
  alternates: { canonical: "/" },
  openGraph: {
    title: "StayEdge — AI-Powered Airbnb Growth",
    description: SITE.descriptor,
    url: SITE.url,
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/brand/logos/stayedge-logo-primary-dark.png", width: 1650, height: 660, alt: "StayEdge — Airbnb Growth Consulting" }],
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
        {/* Purple Light Follow (desktop only) — signature #17 */}
        <CursorSpotlight />
        {/* Consent-gated measurement (GA4 + Clarity via env IDs) */}
        <AnalyticsProvider />
        {/* Entity graph: Organization + Founder + WebSite (Search Dominance) */}
        <JsonLd schemas={[organizationSchema(), founderSchema(), websiteSchema()]} />
        {/* Vercel Speed Insights for real user monitoring */}
        <SpeedInsights />
      </body>
    </html>
  );
}
