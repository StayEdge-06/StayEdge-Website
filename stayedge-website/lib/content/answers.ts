/**
 * The Answer Center (AEO/GEO core). Every answer opens with a concise,
 * quotable definition, then a short actionable expansion. All claims are
 * general industry best practice — factual, no invented statistics (brand
 * law). Extracted from app/knowledge/page.tsx so it can also be indexed by
 * llms.txt (SEO/GEO audit, 2026-07-20).
 */
export type Answer = { q: string; a: string; detail: string[] };

export const ANSWERS: Answer[] = [
  {
    q: "What is Airbnb SEO?",
    a: "Airbnb SEO is the practice of improving how an Airbnb listing ranks inside Airbnb's own search results. Airbnb's algorithm weighs listing quality, guest engagement, pricing competitiveness, availability and review signals to decide which listings appear first for a guest's search.",
    detail: [
      "The biggest levers a host controls are the title, the first photo, the description, response time, calendar availability and price positioning.",
      "Because ranking reflects guest engagement, improvements that earn more clicks and wishlist saves compound: better presentation leads to better ranking, which leads to more bookings.",
    ],
  },
  {
    q: "What is Airbnb listing optimization?",
    a: "Airbnb listing optimization is the systematic improvement of every element a guest sees — title, photos, description, amenities, pricing and reviews — so that more of the people who view the listing actually book it.",
    detail: [
      "It treats a listing like a product page: each element either earns the click, builds trust, or removes a reason to hesitate.",
      "Typical work includes reordering photos so the strongest image leads, rewriting the title around what guests actually search, and matching the description to the guests the property suits best.",
    ],
  },
  {
    q: "How does dynamic pricing work for Airbnb?",
    a: "Dynamic pricing means adjusting a listing's nightly rate based on demand instead of charging one flat price. Rates typically rise for weekends, festivals and high season, and ease on quiet weekdays to keep occupancy healthy.",
    detail: [
      "A flat price all year almost always loses money in both directions: weekends sell below what guests would pay, and slow Tuesdays sit empty at a rate nobody accepts.",
      "Good pricing also manages gap nights, minimum-stay rules and last-minute discounts deliberately rather than by default.",
    ],
  },
  {
    q: "How do I increase my Airbnb bookings?",
    a: "Bookings increase when more guests find the listing (visibility), more of them click it (first photo and title), and more of those who click actually reserve (description, reviews, pricing and trust signals). Fixing the weakest of those three stages first produces the fastest gains.",
    detail: [
      "Diagnose before changing anything: low views is a visibility problem; views without clicks is a first-impression problem; clicks without bookings is a conversion problem.",
      "Each stage has different fixes — treating them as one problem wastes effort on the wrong lever.",
    ],
  },
  {
    q: "How can I rank higher on Airbnb search?",
    a: "To rank higher on Airbnb, improve the signals the algorithm rewards: fast responses, high acceptance, an open and accurate calendar, competitive pricing, complete listing details and steady positive reviews. Listings that convert views into bookings get shown more.",
    detail: [
      "Quick wins: respond within an hour, keep the calendar current, and make the first photo the strongest interior shot rather than an exterior or street view.",
      "Ranking is earned gradually — consistency over weeks beats one-off changes.",
    ],
  },
  {
    q: "How can I improve my occupancy rate?",
    a: "Occupancy improves by widening who the listing appeals to on weak days: weekday-friendly pricing, flexible minimum stays, amenities that attract work travellers, and filling gap nights between bookings with targeted discounts.",
    detail: [
      "High weekend occupancy with empty weekdays is a pricing-structure problem, not a marketing problem.",
      "Occupancy should be balanced against rate: 100% occupancy usually means the price is too low.",
    ],
  },
  {
    q: "How do I optimize an Airbnb listing?",
    a: "Optimize in this order: first photo, title, price structure, description, photo order, amenities, and review responses. That order follows how guests actually decide — image first, headline second, price third, detail last.",
    detail: [
      "The first photo does more work than everything else combined; guests decide in seconds whether to keep scrolling.",
      "A title should say what the stay is, where it is, and why it's different — in the words a guest would search.",
    ],
  },
  {
    q: "Why are my Airbnb bookings low?",
    a: "Low bookings almost always trace to one of five causes: weak first photo, a title that says nothing, uncompetitive or flat pricing, thin or unanswered reviews, or a listing that guests can't find because of calendar and response issues. Identifying which one applies is the first real step.",
    detail: [
      "Most hosts guess at the cause and change the wrong thing; a structured read of the listing removes the guesswork.",
      "That diagnosis is exactly what a Property Growth Audit does — it reads the listing against all five causes and names the specific ones costing you bookings.",
    ],
  },
];

/** Matches the id= generation used in app/knowledge/page.tsx's rendered <article>s. */
export function answerSlug(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
