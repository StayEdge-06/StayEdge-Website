/**
 * Programmatic city pages — /airbnb-listing-optimization/[city].
 * ARCHITECTURE for scale; POPULATED only with real, unique, city-specific
 * content (no template-swapped filler — thin programmatic pages are worse
 * than none). Adding a city = adding one object here with genuinely local
 * knowledge.
 */
export type CityPage = {
  slug: string;
  city: string;
  state: string;
  /** Quotable local-market answer (AEO lede). */
  intro: string;
  /** Real, city-specific demand dynamics. */
  market: string[];
  /** What optimization specifically means in this market. */
  playbook: string[];
  faqs: { q: string; a: string }[];
};

export const CITIES: CityPage[] = [
  {
    slug: "tirupati",
    city: "Tirupati",
    state: "Andhra Pradesh",
    intro:
      "Airbnb listing optimization in Tirupati means pricing and presenting a stay for pilgrimage-driven demand: guests plan around Tirumala darshan, arrive in family groups, decide fast, and search with the temple as their reference point.",
    market: [
      "Demand in Tirupati is anchored to Tirumala. Most guests are pilgrims travelling with family, often across generations — they search by distance and travel time to the temple, not by neighbourhood names.",
      "Demand peaks are predictable: weekends, school holidays, and festival periods such as Brahmotsavam bring surges that flat pricing gives away. Quiet weekdays need a different price, not the same one.",
      "Guests deciding between a hotel and a homestay are usually buying space and kitchens for a family group — the things hotels near the temple charge heavily for.",
    ],
    playbook: [
      "Lead the title with temple proximity in guest language: minutes to the Alipiri gate or to Tirumala by road beats a street address every time.",
      "Open the photos with the space families actually want — the living area or the room that sleeps four — not the building exterior.",
      "Answer pilgrim questions inside the listing: early check-in or luggage drop before darshan, hot water timing, parking for a family car, pure-veg kitchen access.",
      "Price the calendar like a local: weekend and festival lifts set well in advance, honest weekday rates that keep the calendar moving.",
    ],
    faqs: [
      {
        q: "What matters most for an Airbnb listing in Tirupati?",
        a: "Clarity about temple access. Guests are planning a darshan trip; the listing that answers 'how close, how early can we check in, where does the car go' wins the booking.",
      },
      {
        q: "Do weekday nights sell in Tirupati?",
        a: "Yes, but at weekday prices. Pilgrimage travel happens all week; the mistake is asking weekend rates for a Tuesday night.",
      },
    ],
  },
];

export function getCity(slug: string): CityPage | undefined {
  return CITIES.find((c) => c.slug === slug);
}
