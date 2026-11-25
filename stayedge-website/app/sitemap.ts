import type { MetadataRoute } from "next";
import { SITE, SITE_CONTENT_UPDATED } from "@/lib/config/site";
import { ARTICLES } from "@/lib/content/articles";
import { CITIES } from "@/lib/content/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; lastModified?: string }[] = [
    ...ARTICLES.map((a) => ({
      path: `/knowledge/${a.slug}`,
      priority: 0.6,
      lastModified: a.updatedAt ?? a.publishedAt,
    })),
    { path: "/knowledge/glossary", priority: 0.6 },
    ...CITIES.map((c) => ({ path: `/airbnb-listing-optimization/${c.slug}`, priority: 0.7 })),
    { path: "", priority: 1.0 },
    { path: "/free-audit", priority: 0.9 },
    { path: "/services", priority: 0.8 },
    { path: "/services/airbnb-listing-optimization", priority: 0.8 },
    { path: "/services/airbnb-seo", priority: 0.8 },
    { path: "/services/pricing-strategy", priority: 0.8 },
    { path: "/services/revenue-growth", priority: 0.8 },
    { path: "/services/photography-guidance", priority: 0.8 },
    { path: "/services/ai-property-video", priority: 0.8 },
    { path: "/lab", priority: 0.7 },
    { path: "/who-we-help", priority: 0.7 },
    { path: "/how-we-think", priority: 0.6 },
    { path: "/how-we-work", priority: 0.7 },
    { path: "/results", priority: 0.6 },
    { path: "/knowledge", priority: 0.5 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
  ];
  // Real content dates, never build time: a sitemap that says every URL changed
  // on every deploy trains crawlers to ignore lastmod entirely. Articles carry
  // their own dates; everything else uses SITE_CONTENT_UPDATED, which is bumped
  // by hand when page copy genuinely changes.
  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: r.lastModified ?? SITE_CONTENT_UPDATED,
    changeFrequency: "weekly",
    priority: r.priority,
  }));
}
