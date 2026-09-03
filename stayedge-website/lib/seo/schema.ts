import { SITE, CONTACT, ROUTES } from "@/lib/config/site";

const WHATSAPP_URL = "https://wa.me/916309348354";

/**
 * StayEdge entity graph — the single source of truth for structured data
 * (Search Dominance milestone). Every builder returns schema.org JSON-LD.
 * HONESTY LAW: only real, verifiable facts — no invented reviews, ratings,
 * or statistics. Review/aggregateRating schema is deliberately absent until
 * genuine reviews exist.
 */

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const FOUNDER_ID = `${SITE.url}/#founder`;

/** Core entities the site reinforces (GEO / entity recognition). */
export const ENTITY_TOPICS = [
  "Airbnb listing optimization",
  "Airbnb SEO",
  "Vacation rental marketing",
  "Dynamic pricing",
  "Revenue management",
  "Guest psychology",
  "Short-term rental occupancy",
  "Airbnb photography",
  "Airbnb pricing strategy",
  "Short-term rental revenue management",
  "Airbnb host consulting",
  "Vacation rental optimization",
] as const;

/** E.164 formatting for schema `telephone` fields (Google guidance) —
 * display formatting elsewhere on-site is unaffected. */
function toE164(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Verified profiles the StayEdge entity controls, for `sameAs`. Single source
 * so Organization and LocalBusiness can never drift apart — inconsistent
 * sameAs sets across two entities on the same page weakens both.
 *
 * The Google Business Profile URL is env-supplied (NEXT_PUBLIC_GBP_URL) rather
 * than hardcoded: HONESTY LAW — a guessed or placeholder maps URL in sameAs is
 * a false claim about identity, and a wrong one actively hurts entity
 * resolution. Set the env var and the profile joins the graph automatically.
 */
const GBP_URL = process.env.NEXT_PUBLIC_GBP_URL;

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/stayedgeofficial",
  "https://www.linkedin.com/company/stayedge/",
  WHATSAPP_URL,
  ...(GBP_URL ? [GBP_URL] : []),
];

export function organizationSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "StayEdge",
    alternateName: "StayEdge Airbnb Growth Consulting",
    description: SITE.descriptor,
    slogan: SITE.promise,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/brand/logos/stayedge-icon-only.png`,
      width: 570,
      height: 540,
    },
    image: `${SITE.url}/brand/logos/stayedge-logo-primary-dark.png`,
    telephone: toE164(CONTACT.phone),
    email: CONTACT.email,
    foundingDate: "2024",
    founder: { "@id": FOUNDER_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tirupati",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Tirupati" },
      { "@type": "City", name: "Bangalore" },
      { "@type": "City", name: "Hyderabad" },
      { "@type": "City", name: "Chennai" },
      { "@type": "City", name: "Kochi" },
      { "@type": "City", name: "Visakhapatnam" },
      { "@type": "City", name: "Mysore" },
      { "@type": "City", name: "Coimbatore" },
      { "@type": "City", name: "Madurai" },
      { "@type": "City", name: "Thiruvananthapuram" },
      { "@type": "City", name: "Puducherry" },
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "State", name: "Karnataka" },
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "State", name: "Kerala" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [...ENTITY_TOPICS],
    sameAs: SOCIAL_PROFILES,
    ...(GBP_URL ? { hasMap: GBP_URL } : {}),
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Free Property Growth Audit",
          description:
            "A free review of an Airbnb listing covering listing quality, pricing and search visibility, with a prioritised list of what to fix first.",
        },
        price: "0",
        priceCurrency: "INR",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Airbnb Growth Consulting",
          description:
            "Listing optimisation, pricing strategy, Airbnb SEO and guest-psychology work for hosts, villas and boutique hotels.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Property Video",
          description:
            "Cinematic AI-produced property video for short-term rentals: Instagram Reels, YouTube Shorts, walkthroughs, promotional films and website hero video.",
        },
      },
    ],
  };
}

/** LocalBusiness variant — reinforces the physical presence for local SEO / map
 * pack visibility. Complements the ProfessionalService entity above. */
export function localBusinessSchema() {
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#localbusiness`,
    name: "StayEdge",
    description: SITE.descriptor,
    url: SITE.url,
    telephone: toE164(CONTACT.phone),
    email: CONTACT.email,
    foundingDate: "2024",
    founder: { "@id": FOUNDER_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tirupati",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.6288,
      longitude: 79.4192,
    },
    areaServed: [
      { "@type": "City", name: "Tirupati" },
      { "@type": "City", name: "Bangalore" },
      { "@type": "City", name: "Hyderabad" },
      { "@type": "City", name: "Chennai" },
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "State", name: "Karnataka" },
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "State", name: "Kerala" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [...ENTITY_TOPICS],
    sameAs: SOCIAL_PROFILES,
    ...(GBP_URL ? { hasMap: GBP_URL } : {}),
    image: `${SITE.url}/brand/logos/stayedge-logo-primary-dark.png`,
  };
}

export function founderSchema() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: CONTACT.founder,
    jobTitle: "Founder",
    worksFor: { "@id": ORG_ID },
    url: `${SITE.url}${ROUTES.about}`,
    email: CONTACT.email,
    image: `${SITE.url}/team/Sanjay%20Stephen%20photo.jpg`,
    knowsAbout: [...ENTITY_TOPICS],
    sameAs: ["https://www.linkedin.com/in/sanjay-stephen-908944339/"],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE.url,
    name: "StayEdge",
    description: SITE.descriptor,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE.url}/knowledge?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };
}

/** The primary conversion offer — a real, human-delivered free audit. */
export function freeAuditServiceSchema() {
  return {
    "@type": "Service",
    "@id": `${SITE.url}${ROUTES.freeAudit}#service`,
    name: "Free Property Growth Audit",
    url: `${SITE.url}${ROUTES.freeAudit}`,
    serviceType: "Airbnb listing audit",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    description:
      "A free review of your Airbnb listing covering listing quality, pricing and search visibility, returned as a prioritised list of what to fix first.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };
}

/** The premium production service that replaced the AI Roast tool in V2. */
export function aiPropertyVideoServiceSchema() {
  return {
    "@type": "Service",
    "@id": `${SITE.url}${ROUTES.aiPropertyVideo}#service`,
    name: "AI Property Video",
    url: `${SITE.url}${ROUTES.aiPropertyVideo}`,
    serviceType: "Property video production",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    description:
      "Cinematic AI-produced video for short-term rental properties: Instagram Reels, YouTube Shorts, property walkthroughs, promotional films and website hero video.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI Property Video Formats",
      itemListElement: [
        "Instagram Reels",
        "YouTube Shorts",
        "Property walkthrough",
        "Promotional video",
        "Website hero video",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      ...items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: it.name,
        item: `${SITE.url}${it.path}`,
      })),
    ],
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Article schema — author/publisher wired to the founder + org entities. */
export function articleSchema(a: {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  /** Defaults to publishedAt when unset — honest (no invented "updated"
   * date on content that hasn't actually changed since publish). */
  updatedAt?: string;
  clusterTitle: string;
}) {
  const url = `${SITE.url}/knowledge/${a.slug}`;
  return {
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt ?? a.publishedAt,
    author: { "@id": FOUNDER_ID },
    publisher: { "@id": ORG_ID },
    about: { "@type": "Thing", name: a.clusterTitle },
    // Real brand image used as a fallback until per-article cover images
    // exist — not a fabricated/stock photo, just the site's own default
    // representative image (required for Google Article rich-result
    // eligibility, which needs `image` to be present).
    image: `${SITE.url}/brand/logos/stayedge-logo-primary-dark.png`,
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".se-answer-lede"],
    },
  };
}

/** DefinedTermSet for the glossary (AEO/GEO). */
export function glossarySchema(terms: { term: string; definition: string }[]) {
  return {
    "@type": "DefinedTermSet",
    name: "Airbnb Host Glossary",
    url: `${SITE.url}/knowledge/glossary`,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
    })),
  };
}

/** Service catalog schema for the /services page — the single biggest
 * structured-data gap flagged by the SEO/schema audit (2026-07-20): nothing
 * previously told Google/AI systems what StayEdge's actual service
 * disciplines are, beyond the Offers on the org entity. */
export function servicesCatalogSchema(services: { title: string; body: string }[]) {
  return {
    "@type": "Service",
    name: "StayEdge Airbnb Growth Services",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Airbnb Growth Disciplines",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.body },
      })),
    },
  };
}

/** Service-page schema for programmatic city pages (real content only). */
export function cityServiceSchema(c: { slug: string; city: string; state: string }) {
  return {
    "@type": "Service",
    name: `Airbnb Listing Optimization in ${c.city}`,
    url: `${SITE.url}/airbnb-listing-optimization/${c.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: c.city, containedInPlace: { "@type": "State", name: c.state } },
    serviceType: "Airbnb listing optimization",
  };
}

/** Wrap one or more schema objects into a single @graph JSON-LD document. */
export function jsonLd(...schemas: object[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": schemas });
}
