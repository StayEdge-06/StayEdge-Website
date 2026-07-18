import type { ClusterId } from "@/lib/content/clusters";

/**
 * Article registry — typed content for the Knowledge Center (Authority Engine).
 * Editorial law (see AUTHORITY_ENGINE.md): every article answers a real host
 * question, opens with a quotable answer (AEO), contains only claims that are
 * general industry practice or clearly reasoned — never invented statistics.
 */
export type ArticleSection = {
  h2: string;
  paras: string[];
  /** Optional actionable checklist rendered as a checked list. */
  checklist?: string[];
};

export type Article = {
  slug: string;
  cluster: ClusterId;
  title: string;
  description: string;
  /** The quotable opening answer (AEO) — also the article lede. */
  answer: string;
  sections: ArticleSection[];
  faqs: { q: string; a: string }[];
  related: string[]; // slugs
  publishedAt: string; // ISO date
};

export const ARTICLES: Article[] = [
  {
    slug: "airbnb-ranking-factors-hosts-control",
    cluster: "airbnb-seo",
    title: "The Airbnb Ranking Factors Hosts Actually Control",
    description:
      "Airbnb's search algorithm rewards specific, controllable host behaviours. Here are the levers that matter, in the order they pay off.",
    answer:
      "Airbnb ranks listings using signals of quality, engagement and reliability. The factors a host directly controls are response time, acceptance behaviour, calendar accuracy, pricing competitiveness, listing completeness, photo quality and review momentum. Improving these is what 'Airbnb SEO' means in practice.",
    sections: [
      {
        h2: "Engagement signals: the algorithm watches guests react to you",
        paras: [
          "Airbnb's search is conversion-driven: listings that turn impressions into clicks, and clicks into bookings, get shown more. That makes your first photo and title ranking factors in effect, even though they look like presentation choices.",
          "Wishlist saves and repeated views of your listing tell the algorithm guests want it. A listing that guests skim past trains the algorithm to stop showing it.",
        ],
      },
      {
        h2: "Reliability signals: behave like a professional, rank like one",
        paras: [
          "Response rate and response time are among the clearest controllable signals. Slow replies read as risk — to guests and to the ranking system.",
          "Cancellations by the host are heavily penalised. An accurate calendar prevents the accidental cancellations that do the damage.",
        ],
        checklist: [
          "Reply to every enquiry within an hour where possible",
          "Keep the calendar current — block dates you can't host",
          "Avoid host cancellations at all costs",
          "Complete every listing field, including amenities you take for granted",
        ],
      },
      {
        h2: "Price competitiveness: ranked against your true alternatives",
        paras: [
          "Airbnb compares your price against similar listings guests also view. Being modestly mispriced doesn't just cost the booking — it suppresses where you appear.",
          "This is why flat, never-reviewed pricing quietly erodes visibility over time: the market moves and the listing doesn't.",
        ],
      },
      {
        h2: "Review momentum: recency compounds",
        paras: [
          "A steady flow of recent, high ratings signals a listing that is good *now*. Old reviews fade in weight; momentum matters more than lifetime count.",
          "Reviewing guests promptly nudges reciprocal reviews, and responding to critical reviews visibly and calmly protects future conversion.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does Superhost status improve ranking?",
        a: "Superhost status correlates with the behaviours the algorithm rewards — fast responses, low cancellations, strong reviews — and adds a trust badge that lifts conversion. Chase the behaviours; the badge and the ranking tend to follow.",
      },
      {
        q: "How long does it take for ranking changes to show?",
        a: "Engagement and pricing signals can shift visibility within days; reliability and review signals build over weeks. Treat Airbnb SEO as a consistent practice, not a one-time fix.",
      },
    ],
    related: ["airbnb-listing-audit-checklist", "flat-pricing-costs-both-ways"],
    publishedAt: "2026-07-18",
  },
  {
    slug: "airbnb-listing-audit-checklist",
    cluster: "listing-optimization",
    title: "The Airbnb Listing Audit Checklist: Photos, Title, Description",
    description:
      "A structured way to audit your own Airbnb listing — the same order of inspection StayEdge uses: first photo, title, pricing, description, photo order.",
    answer:
      "To audit an Airbnb listing, inspect it in the order guests experience it: the first photo (does it stop the scroll?), the title (does it say what, where and why?), the price (does it read fair against neighbours?), the description (does it sell the stay or list the specs?), and the photo order (does it walk the guest through the property?).",
    sections: [
      {
        h2: "Start where guests start: the first photo",
        paras: [
          "Guests decide in a moment whether to tap or scroll. The first photo should be your strongest interior or signature feature — warm light, no clutter, the thing that makes your stay yours. Exteriors, parking areas and dark corridors don't earn the click.",
        ],
        checklist: [
          "First photo is the strongest interior or signature feature",
          "Shot in daylight or warm evening light, nothing blurry",
          "No clutter, cables, or bathroom as the opener",
          "Would a stranger stop scrolling for this image?",
        ],
      },
      {
        h2: "The title: what, where, why",
        paras: [
          "A working title carries three things: what the stay is (Sunlit 2BHK), where it sits relative to what guests search (6 min to the temple), and one reason to care (rooftop breakfast, fast Wi-Fi). Generic titles like 'Nice flat in city' give the algorithm nothing to match and the guest nothing to want.",
        ],
      },
      {
        h2: "The description: sell the stay, not the spec sheet",
        paras: [
          "Specs reassure; scenes sell. Lead with what staying there feels like — the morning light, the walk to coffee, the quiet — then support it with the practical details guests need to say yes without messaging you.",
          "Answer the questions guests always ask (parking, check-in, Wi-Fi speed, family-friendliness) inside the description; every unanswered question is a hesitation.",
        ],
      },
      {
        h2: "Photo order: walk them through the door",
        paras: [
          "After the opener, sequence photos the way a guest would tour: living space, bedrooms, bathroom, kitchen, then exteriors and neighbourhood. Caption photos with use, not labels — 'Reading corner that gets the evening sun' beats 'Living room'.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many photos should an Airbnb listing have?",
        a: "Enough to tour the whole property honestly — for most homes that lands between 15 and 25. Too few creates doubt; endless near-duplicates dilute the strong ones.",
      },
      {
        q: "Should I hire a professional photographer?",
        a: "If your bookings depend on standing out in a busy market, professional photos usually pay for themselves. But order and selection matter as much as quality — a well-sequenced phone shoot in good light beats badly chosen professional shots.",
      },
    ],
    related: ["airbnb-ranking-factors-hosts-control", "flat-pricing-costs-both-ways"],
    publishedAt: "2026-07-18",
  },
  {
    slug: "flat-pricing-costs-both-ways",
    cluster: "dynamic-pricing",
    title: "Flat Pricing Is Costing You Both Ways",
    description:
      "One price for every night undersells your weekends and overprices your weekdays. How to price the week deliberately — without a pricing tool.",
    answer:
      "A single flat nightly price loses money in two directions at once: weekend and festival nights sell below what guests would willingly pay, while quiet weekday nights sit empty at a rate nobody accepts. Deliberate pricing sets weekend, weekday and seasonal rates separately, then manages gap nights and minimum stays around them.",
    sections: [
      {
        h2: "Why flat pricing fails",
        paras: [
          "Demand for short stays is not flat — it spikes on weekends, holidays and local events, and dips midweek. A flat price is therefore wrong on most nights: too cheap when demand is high, too expensive when it's low.",
          "Hosts often set one 'safe' price to avoid thinking about it again. The market keeps moving; the price doesn't. That gap compounds monthly.",
        ],
      },
      {
        h2: "The simplest structure that works",
        paras: [
          "You don't need software to price better than flat. Start with three tiers: a weekday base, a weekend rate meaningfully above it, and event/festival pricing above that. In pilgrimage and event cities, the calendar of demand is largely predictable — price it in advance.",
        ],
        checklist: [
          "Set a weekday base your occupancy can sustain",
          "Lift Friday–Sunday deliberately, not apologetically",
          "Mark local festivals and events in the calendar with their own rates",
          "Review prices monthly against what similar listings charge",
        ],
      },
      {
        h2: "Gap nights and minimum stays",
        paras: [
          "Orphan single nights between bookings rarely sell at full rate — a targeted discount that fills them earns more than an empty night. Likewise, a rigid minimum stay that creates un-bookable gaps costs more than it protects.",
        ],
      },
      {
        h2: "Occupancy is not the goal — revenue is",
        paras: [
          "Running at near-100% occupancy usually means the price is too low. The number to watch is revenue per available night (RevPAR): occupancy multiplied by average nightly rate. Sometimes the winning move is fewer bookings at meaningfully better rates.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I use an automated dynamic pricing tool?",
        a: "Tools help at scale, but they amplify your settings rather than replace judgement. Get the manual structure right first — base, weekend, events — then let a tool fine-tune within it.",
      },
      {
        q: "How often should I review my prices?",
        a: "Monthly as a habit, plus before every local festival, holiday period or event that touches your city's demand.",
      },
    ],
    related: ["airbnb-ranking-factors-hosts-control", "airbnb-listing-audit-checklist"],
    publishedAt: "2026-07-18",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlesByCluster(cluster: ClusterId): Article[] {
  return ARTICLES.filter((a) => a.cluster === cluster);
}
