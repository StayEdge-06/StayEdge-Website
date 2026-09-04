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
    `${SITE.name} is an Airbnb listing optimization and growth consultancy based in Tirupati, Andhra Pradesh, India, founded by ${CONTACT.founder}. It helps Airbnb hosts increase bookings, occupancy and revenue through listing optimization, dynamic pricing and Airbnb SEO, and produces AI property video for short-term rentals. Work combines AI tooling with human operator judgement; audits and recommendations are reviewed by a person before they reach the host. Not a property manager: hosts keep full control of their listing and account.`,
  );
  lines.push("");

  lines.push("## Core pages");
  lines.push(`- [Homepage](${SITE.url}${ROUTES.home}): what StayEdge does and who it's for.`);
  lines.push(
    `- [Free Property Growth Audit](${SITE.url}${ROUTES.freeAudit}): the main entry point — a free review of a host's listing covering listing quality, pricing and search visibility, returned as a prioritised fix list. Delivered by a person, not an automated tool.`,
  );
  lines.push(`- [What We Do](${SITE.url}${ROUTES.services}): the six service disciplines below.`);
  lines.push(
    `- [Airbnb Listing Optimization](${SITE.url}${ROUTES.listingOptimization}): title, photo order, description and amenities rewritten to convert.`,
  );
  lines.push(
    `- [Airbnb SEO](${SITE.url}${ROUTES.airbnbSeo}): ranking inside Airbnb's own search — response behaviour, completeness, review velocity, calendar accuracy, price competitiveness.`,
  );
  lines.push(
    `- [Pricing Strategy](${SITE.url}${ROUTES.pricingStrategy}): deliberate calendar pricing — weekday/weekend, seasonality, minimum stays, gap nights.`,
  );
  lines.push(
    `- [Revenue Growth](${SITE.url}${ROUTES.revenueGrowth}): occupancy and ADR moved together toward RevPAR, plus positioning and guest-segment targeting.`,
  );
  lines.push(
    `- [Photography Guidance](${SITE.url}${ROUTES.photographyGuidance}): shot list, sequencing and staging guidance for the camera a host already has.`,
  );
  lines.push(
    `- [AI Property Video](${SITE.url}${ROUTES.aiPropertyVideo}): cinematic AI-produced property video — Instagram Reels, YouTube Shorts, walkthroughs, promotional films and website hero video.`,
  );
  lines.push(`- [Who We Help](${SITE.url}${ROUTES.whoWeHelp}): first-time hosts, villa owners, boutique hotels, investors & managers.`);
  lines.push(`- [How We Work](${SITE.url}${ROUTES.howWeWork}): the engagement path from free audit to ongoing growth work.`);
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
