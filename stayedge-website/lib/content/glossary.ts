/**
 * Glossary — real definitions for the terms hosts meet (AEO + DefinedTerm
 * schema). Plain-language, factual, quotable.
 */
export type GlossaryTerm = { term: string; definition: string };

export const GLOSSARY: GlossaryTerm[] = [
  { term: "ADR (Average Daily Rate)", definition: "The average price earned per booked night: total booking revenue divided by nights sold. ADR measures what each night actually earns, not what you list it for." },
  { term: "Occupancy rate", definition: "The share of available nights that were booked in a period. Fifteen booked nights out of thirty available is 50% occupancy." },
  { term: "RevPAR", definition: "Revenue per available night: occupancy multiplied by ADR. RevPAR is the single best health number for a listing because it punishes both empty nights and underpricing." },
  { term: "Airbnb SEO", definition: "The practice of improving a listing's rank inside Airbnb search by strengthening the signals the algorithm rewards: engagement, reliability, pricing competitiveness and review momentum." },
  { term: "Listing conversion", definition: "The share of people who view a listing and go on to book it. Low conversion with healthy views points to first-photo, pricing or trust problems." },
  { term: "Dynamic pricing", definition: "Adjusting nightly rates with demand — weekends, seasons, festivals and events priced separately — instead of one flat price all year." },
  { term: "Gap night", definition: "A single unbooked night stranded between two bookings. Gap nights rarely sell at full rate; targeted discounts or flexible minimum stays recover them." },
  { term: "Minimum stay", definition: "The fewest nights a guest may book. Longer minimums reduce turnover work but create un-bookable gaps; the right setting balances both." },
  { term: "Superhost", definition: "Airbnb's recognition for hosts meeting sustained standards on ratings, response rate, cancellations and activity. The badge lifts guest trust and correlates with better visibility." },
  { term: "Wishlist save", definition: "A guest saving a listing to a wishlist. Saves signal demand to Airbnb's algorithm even before a booking happens." },
  { term: "Response rate", definition: "The share of new enquiries and requests a host answers within 24 hours. One of the clearest controllable ranking and trust signals." },
  { term: "Instant Book", definition: "Allowing guests to book without prior approval. It removes friction and is generally favoured by Airbnb's search, at the cost of screening control." },
  { term: "Property Growth Snapshot", definition: "StayEdge's free diagnostic of an Airbnb listing: the issues costing bookings, the estimated revenue leak, and prioritised quick wins — produced by Vira's analysis plus operator review." },
  { term: "Review momentum", definition: "The recency and frequency of new reviews, as opposed to lifetime count. Fresh reviews weigh more — both with guests and in search." },
  { term: "Guest psychology", definition: "The study of how guests actually decide: the split-second first-photo judgement, the hesitations an unanswered question creates, and the trust cues that tip a booking." },
];
