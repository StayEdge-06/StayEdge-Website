/**
 * Topic cluster map — the Authority Engine's spine (Milestone 11).
 * Ten pillars; each will hold multiple supporting articles. Pillars without
 * published content yet are shown honestly as "publishing soon" (never thin
 * placeholder pages, never dead links).
 */
export type ClusterId =
  | "listing-optimization"
  | "airbnb-seo"
  | "dynamic-pricing"
  | "revenue-optimization"
  | "guest-psychology"
  | "photography"
  | "reviews-reputation"
  | "google-business-profile"
  | "local-seo"
  | "ai-for-hosts";

export const CLUSTERS: { id: ClusterId; title: string; blurb: string }[] = [
  { id: "listing-optimization", title: "Airbnb Listing Optimization", blurb: "Every element a guest sees, tuned to earn the booking." },
  { id: "airbnb-seo", title: "Airbnb SEO", blurb: "How Airbnb's search ranks listings — and the levers hosts control." },
  { id: "dynamic-pricing", title: "Dynamic Pricing", blurb: "Pricing the week, the season and the gap nights deliberately." },
  { id: "revenue-optimization", title: "Revenue Optimization", blurb: "Occupancy, ADR and RevPAR — moving the numbers that pay you." },
  { id: "guest-psychology", title: "Guest Psychology", blurb: "The hesitations that quietly cost bookings, and how to remove them." },
  { id: "photography", title: "Airbnb Photography", blurb: "Which photo leads, what order follows, and why it matters most." },
  { id: "reviews-reputation", title: "Reviews & Reputation", blurb: "Earning, keeping and responding to the reviews that rank you." },
  { id: "google-business-profile", title: "Google Business Profile", blurb: "Being found beyond Airbnb — maps, direct enquiries and local trust." },
  { id: "local-seo", title: "Local SEO", blurb: "Winning your city's searches, from Tirupati outward." },
  { id: "ai-for-hosts", title: "AI for Airbnb Hosts", blurb: "What AI can genuinely read in a listing — and what it can't." },
];
