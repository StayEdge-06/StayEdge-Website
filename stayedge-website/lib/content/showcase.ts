/**
 * Illustrative showcase portfolio (founder directive). These are EDUCATIONAL
 * examples of the StayEdge method applied to typical Tirupati property types —
 * clearly labelled as illustrative, NOT real clients, NOT real results.
 * No fabricated testimonials, no fabricated revenue numbers (brand law).
 */
export type ShowcaseExample = {
  slug: string;
  label: string;
  propertyType: string;
  beforeTitle: string;
  afterTitle: string;
  beforePrice: string;
  afterPrice: string;
  gallery: string[];
  seo: string[];
  pricing: string[];
  amenities: string[];
  positioning: string;
};

export const SHOWCASE: ShowcaseExample[] = [
  {
    slug: "luxury-villa-tirumala",
    label: "Example optimization",
    propertyType: "Luxury Villa Near Tirumala",
    beforeTitle: "Beautiful 4BHK villa with garden",
    afterTitle: "Private 4BHK Villa · 10 min to Alipiri · Pool, Garden & Chef-Ready Kitchen",
    beforePrice: "₹9,500 · same price all week",
    afterPrice: "₹8,500 weekdays · ₹12,500 weekends & festivals",
    gallery: [
      "Lead photo changed from gate exterior to the pool at golden hour",
      "Family dining and puja corner moved into the first five photos",
      "Every photo captioned with use, not labels — “the verandah where mornings happen”",
    ],
    seo: [
      "Title now carries the three searches that matter: Tirumala distance, villa, pool",
      "Description opens with the darshan-day routine the villa makes easy",
      "Amenity list completed — 14 searchable amenities were missing",
    ],
    pricing: [
      "Weekend and Brahmotsavam-season lifts priced in advance",
      "Honest weekday rate keeps the calendar moving between peaks",
      "2-night weekend minimum; gap nights released at a targeted discount",
    ],
    amenities: ["Early check-in for darshan mornings", "Driver rest area", "Pure-veg kitchen labelling"],
    positioning: "From “a nice villa” to the villa large family groups book for temple weekends.",
  },
  {
    slug: "premium-family-stay",
    label: "Example optimization",
    propertyType: "Premium Family Stay",
    beforeTitle: "Spacious 3BHK apartment for rent",
    afterTitle: "Sunlit 3BHK for Families · 6 min to Temple Road · Sleeps 8 Comfortably",
    beforePrice: "₹4,200 flat",
    afterPrice: "₹3,800 weekdays · ₹5,600 weekends",
    gallery: [
      "Lead photo: the living room set for a family evening, not the building corridor",
      "Added the one photo every family looks for — where everyone sleeps",
      "Kitchen photographed stocked and usable, not empty",
    ],
    seo: [
      "“Sleeps 8” moved into the title — the search families actually run",
      "Description answers the five questions guests were messaging about",
      "House rules rewritten from warnings into welcomes",
    ],
    pricing: [
      "Week split: realistic weekdays, confident weekends",
      "School-holiday windows pre-priced",
      "Extra-guest fee replaced with honest base capacity",
    ],
    amenities: ["High chair & cot on request", "Washing machine surfaced", "Board games listed"],
    positioning: "From “an apartment” to the obvious choice for three-generation family trips.",
  },
  {
    slug: "pilgrim-apartment",
    label: "Example optimization",
    propertyType: "Pilgrim Apartment",
    beforeTitle: "2BHK flat near bus stand",
    afterTitle: "Quiet 2BHK · 4 min to Alipiri Gate · Early Check-in for Darshan",
    beforePrice: "₹2,800 flat",
    afterPrice: "₹2,400 weekdays · ₹3,900 weekends & festival days",
    gallery: [
      "Lead photo: the calm bedroom pilgrims return to, not the street view",
      "Hot-water geyser and clean bathroom given real photo slots",
      "Map screenshot replaced with a photo of the actual lane at dawn",
    ],
    seo: [
      "Alipiri Gate distance in the title — the reference point pilgrims search",
      "“Early check-in” surfaced — the single most-asked pilgrim question",
      "Description ordered by the darshan-day timeline",
    ],
    pricing: [
      "Festival calendar priced a season ahead",
      "Weekday rate tuned for solo and couple pilgrims",
      "Single-night stays enabled — pilgrim trips are short",
    ],
    amenities: ["4 AM checkout coffee", "Luggage storage after checkout", "Temple-timing card in the flat"],
    positioning: "From “a flat near the bus stand” to the pilgrim's easiest yes.",
  },
];
