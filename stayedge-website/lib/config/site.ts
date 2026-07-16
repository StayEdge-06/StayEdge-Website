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
  roast: "/roast",
  snapshot: "/snapshot",
  lab: "/lab",
  howWeThink: "/how-we-think",
  howWeWork: "/how-we-work",
  services: "/services",
  whoWeHelp: "/who-we-help",
  results: "/results",
  audit: "/audit",
  knowledge: "/knowledge",
  about: "/about",
  contact: "/contact",
} as const;

/** Primary top-nav (desktop) — 5 browse items; CTAs live in the cluster. */
export const PRIMARY_NAV = [
  { label: "What We Do", href: ROUTES.services },
  { label: "Who We Help", href: ROUTES.whoWeHelp },
  { label: "Results", href: ROUTES.results },
  { label: "AI Lab", href: ROUTES.lab },
  { label: "How We Think", href: ROUTES.howWeThink },
] as const;

/** Full nav for the mobile sheet + footer. */
export const FULL_NAV = [
  ...PRIMARY_NAV,
  { label: "How We Work", href: ROUTES.howWeWork },
  { label: "Knowledge", href: ROUTES.knowledge },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
] as const;

export const CTA = {
  /** The top-of-ladder primary action across the site. */
  roast: { label: "Roast My Listing", href: ROUTES.roast },
  /** The money conversion (brand CTA library: "Book a free audit"). */
  audit: { label: "Book Free Audit", href: ROUTES.audit },
  /** Low-commitment secondary channel. */
  whatsapp: { label: "WhatsApp Us", href: WHATSAPP_URL },
} as const;

export const SITE = {
  name: "StayEdge",
  tagline: "AIRBNB GROWTH CONSULTING",
  promise:
    "We turn your listing into the smartest-run stay on your street — and prove it in the numbers.",
  descriptor: "AI-powered Airbnb growth for hosts across South India.",
  url: "https://stayedge.in",
} as const;
