import { SITE, CONTACT, ROUTES } from "@/lib/config/site";
import { PERSONA } from "@/lib/config/persona";

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
] as const;

/** E.164 formatting for schema `telephone` fields (Google guidance) —
 * display formatting elsewhere on-site is unaffected. */
function toE164(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

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
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [...ENTITY_TOPICS],
    sameAs: ["https://www.instagram.com/stayedgeofficial"],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Property Growth Snapshot",
          description:
            "A free AI-assisted diagnostic of an Airbnb listing: issues, revenue leaks and prioritised quick wins.",
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
    ],
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
    knowsAbout: [...ENTITY_TOPICS],
    // TODO(seo-audit 2026-07-20): add `image` (real headshot) and `sameAs`
    // (LinkedIn) once available — no placeholder/stock values per the
    // honesty law; these meaningfully strengthen E-E-A-T and AI-citation
    // author-trust signals once real.
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
  };
}

/** The software entity for Vira / the Roast tool (real, live product surface). */
export function roastToolSchema() {
  return {
    "@type": "WebApplication",
    name: `${PERSONA.name} — Roast My Listing`,
    url: `${SITE.url}${ROUTES.roast}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Free AI listing check for Airbnb hosts: a Roast Score, the top issues costing bookings, and one genuine strength.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: { "@id": ORG_ID },
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
 * disciplines are, beyond the roast-ladder Offers on the org entity. */
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
