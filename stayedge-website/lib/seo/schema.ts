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

export function organizationSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "StayEdge",
    alternateName: "StayEdge Airbnb Growth Consulting",
    description: SITE.descriptor,
    slogan: SITE.promise,
    url: SITE.url,
    logo: `${SITE.url}/brand/logos/stayedge-logo-primary-dark.png`,
    telephone: CONTACT.phone,
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
    email: CONTACT.email,
    knowsAbout: [...ENTITY_TOPICS],
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
  clusterTitle: string;
}) {
  return {
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url: `${SITE.url}/knowledge/${a.slug}`,
    datePublished: a.publishedAt,
    author: { "@id": FOUNDER_ID },
    publisher: { "@id": ORG_ID },
    about: a.clusterTitle,
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID },
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
