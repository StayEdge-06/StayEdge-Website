/**
 * Case-study framework (Milestone 11). The TEMPLATE is ready; the DATA stays
 * empty until real client results exist and the client approves publication.
 * Brand law: no fabricated results, ever. When the first entry lands here,
 * /results renders it automatically — no redesign needed.
 */
export type CaseStudy = {
  slug: string;
  /** e.g. "2BHK homestay, Tirupati" — real property class + city only. */
  propertyLabel: string;
  segment: "first-time-host" | "villa" | "boutique-hotel" | "portfolio";
  situation: string;
  changes: string[];
  /** Real measured numbers with explicit periods, client-approved. */
  results: { metric: "occupancy" | "adr" | "revenue" | "reviews"; before: string; after: string; period: string }[];
  quote?: { text: string; attribution: string };
  approvedByClient: true;
  publishedAt: string;
};

/** Intentionally empty until genuine, client-approved data exists. */
export const CASE_STUDIES: CaseStudy[] = [];
