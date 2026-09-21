import { ROUTES } from "../config/site.ts";

/**
 * THE SERVICE REGISTRY — what StayEdge offers or will offer, for StayEdge OS
 * to reason about. Not the same thing as `Service` in lib/leads/schema.ts.
 *
 * TWO DIFFERENT "SERVICE" WORDS, DELIBERATELY KEPT SEPARATE:
 *   - lib/leads/schema.ts `Service` is the wire contract for what a LEAD asks
 *     for — today exactly two values ("Free Property Growth Audit" |
 *     "AI Property Video"), because that enum is validated input on a public
 *     form and must never carry a value nothing can act on yet.
 *   - `ServiceModule` (this file) is wider and internal: it can describe a
 *     capability that isn't sellable yet, for the OS/dashboard to display
 *     honestly as "planned" rather than pretending it doesn't exist or,
 *     worse, listing it next to the real six with no distinction.
 *
 * WHY THIS EXISTS (Phase 5, §3 — AI Website Service extension point). Before
 * this file, "what services does StayEdge have" was implicit — scattered
 * across `ROUTES`, the `/services` hub's SERVICES array, and six schema
 * builders in lib/seo/schema.ts. That was fine for six commercial pages a
 * human edits directly (Phase 4), but it gives a future OS module nothing to
 * query. This registry is that query surface: one array, one shape, status-
 * aware, reusing `ROUTES` rather than re-declaring its own URLs.
 *
 * WHAT THIS IS NOT: a features flag system, a CMS, or a booking engine. It is
 * read-only, static, and — like everything else in this codebase — only
 * describes what is actually true. Adding a `status: "planned"` row does not
 * make a service exist; it documents that the OS knows one is coming, the
 * same way `components/os/OSDashboard.tsx`'s `AIServiceSlot` already does
 * for the UI. When the AI Website Service actually ships, it gets a real
 * `route`, its status flips to `"commercial-live"` or `"internal-preview"`,
 * and nothing else in this file's shape needs to change.
 */

export type ServiceStatus =
  /** Sold today, has a public page, reachable from nav/sitemap. */
  | "commercial-live"
  /** Built and running, but not offered publicly (e.g. an internal tool). */
  | "internal-preview"
  /** Declared seam only — no implementation. See AIServiceSlot in the OS
   * dashboard for the honest, empty UI this maps to. */
  | "planned";

export type ServiceKind = "consulting" | "ai-generated" | "internal-tool";

export interface ServiceModule {
  /** Stable slug — used as a dashboard key, never shown to a visitor. */
  id: string;
  name: string;
  kind: ServiceKind;
  status: ServiceStatus;
  /** Public route, when `status` is "commercial-live" or "internal-preview"
   * with a page. Absent for a "planned" entry — there is nothing to link to. */
  route?: string;
  /** One factual line — no numbers, no claims the page itself doesn't make. */
  description: string;
}

/**
 * Today's six public consulting services (Phase 4 information architecture)
 * plus the one declared future capability. Order matches the /services hub.
 *
 * Adding a "planned" row here does not launch anything — a service only
 * becomes "commercial-live" once it has shipped a real page, exactly like
 * AI Property Video did in Phase 1 and the other five did in Phase 4.
 */
export const SERVICE_REGISTRY: ServiceModule[] = [
  {
    id: "listing-optimization",
    name: "Airbnb Listing Optimization",
    kind: "consulting",
    status: "commercial-live",
    route: ROUTES.listingOptimization,
    description: "Title, photo order, description and amenities rewritten to convert.",
  },
  {
    id: "airbnb-seo",
    name: "Airbnb SEO",
    kind: "consulting",
    status: "commercial-live",
    route: ROUTES.airbnbSeo,
    description: "The signals Airbnb's own search ranking rewards, worked in order of leverage.",
  },
  {
    id: "pricing-strategy",
    name: "Pricing Strategy",
    kind: "consulting",
    status: "commercial-live",
    route: ROUTES.pricingStrategy,
    description: "Deliberate calendar pricing — weekday/weekend, seasonality, gap nights.",
  },
  {
    id: "revenue-growth",
    name: "Revenue Growth",
    kind: "consulting",
    status: "commercial-live",
    route: ROUTES.revenueGrowth,
    description: "Occupancy and ADR moved together toward RevPAR, plus positioning.",
  },
  {
    id: "photography-guidance",
    name: "Photography Guidance",
    kind: "consulting",
    status: "commercial-live",
    route: ROUTES.photographyGuidance,
    description: "Shot list, sequencing and staging guidance for a host's own camera.",
  },
  {
    id: "ai-property-video",
    name: "AI Property Video",
    kind: "ai-generated",
    status: "commercial-live",
    route: ROUTES.aiPropertyVideo,
    description: "Cinematic AI-produced property video, produced by StayEdge as a service.",
  },
  {
    id: "ai-website-service",
    name: "AI Website Service",
    kind: "ai-generated",
    status: "planned",
    description:
      "Declared extension point only (Phase 5) — not built, not sold, not linked from the public site. Reserved slot: components/os/OSDashboard.tsx's AIServiceSlot.",
  },
];

/** Only the services a visitor can actually request today — the ones a lead
 * form, a nav link or a sitemap entry is allowed to reference. */
export function liveServices(): ServiceModule[] {
  return SERVICE_REGISTRY.filter((s) => s.status === "commercial-live");
}

export function getServiceModule(id: string): ServiceModule | undefined {
  return SERVICE_REGISTRY.find((s) => s.id === id);
}
