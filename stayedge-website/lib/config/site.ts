/**
 * Site configuration — routes, navigation, CTAs, and contact.
 * Contact values are inherited from the Brand Operating System (brand-tokens.json).
 * The audit deliverable is always the "Property Growth Snapshot" (brand fixed term).
 */

export const CONTACT = {
  founder: "Sanjay Stephen",
  role: "Founder",
  phone: "+91 63093 48354",
  phoneRaw: "916309348354",
  email: "sanjay.cohostbnb@gmail.com",
  social: "@stayedgeofficial",
  location: "Tirupati, Andhra Pradesh",
  copyright: "© 2026 STAYEDGE",
} as const;

/** WhatsApp deep link — the primary channel (UX Decision 3, India-first). */
export const WHATSAPP_URL = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(
  "Hi StayEdge — I'd like to grow my Airbnb.",
)}`;

export const ROUTES = {
  home: "/",
  /** THE conversion destination (V2). Every CTA, GBP, WhatsApp, Instagram bio,
   * LinkedIn and future ad lands here. `/audit` and `/roast` 308 into it. */
  freeAudit: "/free-audit",
  services: "/services",
  aiPropertyVideo: "/services/ai-property-video",
  /** Phase 4 — the six-discipline service architecture. Each is a dedicated,
   * indexable page under /services so commercial intent has somewhere to land
   * beyond the /services hub. */
  listingOptimization: "/services/airbnb-listing-optimization",
  airbnbSeo: "/services/airbnb-seo",
  pricingStrategy: "/services/pricing-strategy",
  revenueGrowth: "/services/revenue-growth",
  photographyGuidance: "/services/photography-guidance",
  lab: "/lab",
  howWeThink: "/how-we-think",
  howWeWork: "/how-we-work",
  whoWeHelp: "/who-we-help",
  results: "/results",
  knowledge: "/knowledge",
  about: "/about",
  contact: "/contact",
} as const;

/** Primary top-nav (desktop) — 5 browse items; CTAs live in the cluster. */
export const PRIMARY_NAV = [
  { label: "What We Do", href: ROUTES.services },
  { label: "AI Property Video", href: ROUTES.aiPropertyVideo },
  { label: "Who We Help", href: ROUTES.whoWeHelp },
  { label: "Results", href: ROUTES.results },
  { label: "How We Think", href: ROUTES.howWeThink },
] as const;

/** Full nav for the mobile sheet + footer. */
export const FULL_NAV = [
  ...PRIMARY_NAV,
  { label: "How We Work", href: ROUTES.howWeWork },
  { label: "AI Lab", href: ROUTES.lab },
  { label: "Knowledge", href: ROUTES.knowledge },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
] as const;

export const CTA = {
  /** The ONE primary action across the entire site (V2 business goal).
   * `label` is the founder-specified full wording; `short` is for tight
   * chrome (header, mobile bar) where the full string would wrap. */
  audit: {
    label: "Get Your Free Property Growth Audit",
    short: "Get Free Audit",
    href: ROUTES.freeAudit,
  },
  /** The premium service enquiry — secondary to the audit everywhere. */
  video: {
    label: "Request AI Property Video",
    short: "AI Property Video",
    href: ROUTES.aiPropertyVideo,
  },
  /** Low-commitment secondary channel. */
  whatsapp: { label: "WhatsApp Us", short: "WhatsApp", href: WHATSAPP_URL },
} as const;

export const SITE = {
  name: "StayEdge",
  tagline: "AIRBNB GROWTH CONSULTING",
  promise:
    "We turn your listing into the smartest-run stay on your street — and prove it in the numbers.",
  descriptor:
    "Airbnb growth consultancy for hosts, villas and boutique hotels — AI-powered listing optimization, pricing strategy and Airbnb SEO across South India.",
  /** Canonical production domain (founder decision); env-overridable.
   * Must match the host Vercel actually serves (apex 308-redirects to
   * www) — otherwise every canonical tag, sitemap URL, and JSON-LD @id
   * points at a URL that immediately redirects, which is a
   * self-referential-canonical failure (SEO audit, 2026-07-20). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.stayedge.co.in",
} as const;

/** Default OG image shared across pages (overridden per-page where specified). */
export const DEFAULT_OG_IMAGE = {
  url: "/brand/logos/stayedge-logo-primary-dark.png",
  width: 1650,
  height: 660,
  alt: "StayEdge — Airbnb Growth Consulting",
} as const;
