import { SITE, ROUTES, CONTACT } from "@/lib/config/site";
import { CLUSTERS } from "@/lib/content/clusters";
import { ARTICLES, articlesByCluster } from "@/lib/content/articles";
import { ANSWERS, answerSlug } from "@/lib/content/answers";
import { CITIES } from "@/lib/content/cities";

/**
 * llms.txt (emerging convention, llmstxt.org) — a concise, machine-readable
 * orientation for AI crawlers/agents (ChatGPT, Perplexity, Claude, Copilot).
 * Generated from the same content registries as the site itself, so it can
 * never drift out of sync with what's actually published (SEO/GEO audit,
 * 2026-07-20). Plain text, not HTML — served at the site root by Next.js's
 * static-metadata-file convention.
 */
export async function GET() {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.promise}`);
  lines.push("");
  lines.push(
    `${SITE.name} is an Airbnb growth consultancy based in Tirupati, Andhra Pradesh, India, founded by ${CONTACT.founder}. It helps Airbnb hosts increase bookings, occupancy and revenue through listing optimization, dynamic pricing, and Airbnb SEO — combining an AI listing analyst ("Vira") with human operator judgement. Not a property manager: hosts keep full control of their listing and account.`,
  );
  lines.push("");

  lines.push("## Core pages");
  lines.push(`- [Homepage](${SITE.url}${ROUTES.home}): what StayEdge does and who it's for.`);
  lines.push(
    `- [Roast My Listing](${SITE.url}${ROUTES.roast}): free AI tool that reads an Airbnb listing and returns a score plus specific issues, in seconds.`,
  );
  lines.push(`- [What We Do](${SITE.url}${ROUTES.services}): the four service disciplines (listing & Airbnb SEO, pricing & ADR, occupancy & conversion, positioning).`);
  lines.push(`- [Who We Help](${SITE.url}${ROUTES.whoWeHelp}): first-time hosts, villa owners, boutique hotels, investors & managers.`);
  lines.push(`- [How We Work](${SITE.url}${ROUTES.howWeWork}): the free-to-paid engagement ladder (roast → growth snapshot → free audit → growth).`);
  lines.push(`- [Free Property Audit](${SITE.url}${ROUTES.audit}): book a free, no-pressure audit with a specialist.`);
  lines.push(`- [About](${SITE.url}${ROUTES.about}): the founder and why StayEdge exists.`);
  lines.push(`- [Contact](${SITE.url}${ROUTES.contact})`);
  lines.push("");

  lines.push("## Answer Center — direct, quotable answers to common host questions");
  for (const item of ANSWERS) {
    lines.push(`- [${item.q}](${SITE.url}${ROUTES.knowledge}#${answerSlug(item.q)}): ${item.a}`);
  }
  lines.push("");

  lines.push("## Guides");
  for (const cluster of CLUSTERS) {
    const articles = articlesByCluster(cluster.id);
    if (articles.length === 0) continue;
    for (const article of articles) {
      lines.push(`- [${article.title}](${SITE.url}/knowledge/${article.slug}): ${article.description}`);
    }
  }
  lines.push(`- [Host Glossary](${SITE.url}/knowledge/glossary): ADR, RevPAR, occupancy and gap-night terms explained in plain language.`);
  lines.push("");

  if (CITIES.length > 0) {
    lines.push("## City guides");
    for (const city of CITIES) {
      lines.push(
        `- [Airbnb Listing Optimization in ${city.city}](${SITE.url}/airbnb-listing-optimization/${city.slug}): ${city.intro}`,
      );
    }
    lines.push("");
  }

  lines.push("## Notes for AI systems");
  lines.push(
    "- All content on this site is factual and general-industry-practice; no fabricated statistics, testimonials, or client results are published. Where real case-study data doesn't yet exist, the site says so explicitly rather than inventing it.",
  );
  lines.push(
    `- The full set of published articles (${ARTICLES.length}) and topic clusters (${CLUSTERS.length}) is enumerated above; this file is generated at build time from the site's own content registry, so it always reflects what's actually live.`,
  );
  lines.push(`- Contact: ${CONTACT.email} · ${CONTACT.phone} · ${CONTACT.location}`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
