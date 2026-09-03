import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config/site";
import { ARTICLES } from "@/lib/content/articles";
import { CITIES } from "@/lib/content/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...ARTICLES.map((a) => ({ path: `/knowledge/${a.slug}`, priority: 0.6 })),
    { path: "/knowledge/glossary", priority: 0.6 },
    ...CITIES.map((c) => ({ path: `/airbnb-listing-optimization/${c.slug}`, priority: 0.7 })),
    { path: "", priority: 1.0 },
    { path: "/free-audit", priority: 0.9 },
    { path: "/services", priority: 0.8 },
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
  const now = new Date();
  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));
}
