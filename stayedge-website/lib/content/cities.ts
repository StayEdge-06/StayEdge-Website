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
  {
    slug: "bangalore",
    city: "Bangalore",
    state: "Karnataka",
    intro:
      "Airbnb listing optimization in Bangalore means capturing business and short-term travellers who search by tech-park proximity, airport access and quiet neighbourhoods — a market where Wi-Fi reliability and self-check-in outrank every other amenity.",
    market: [
      "Bangalore's Airbnb demand is driven by corporate travellers, weekend visitors from other Indian cities, and international tech professionals on short-term projects. Whitefield, Electronic City, Koramangala and Indiranagar see the highest search density.",
      "The booking window in Bangalore is shorter than pilgrimage cities — guests often book 1–3 days ahead for business needs. Listings that enable last-minute booking with instant book and self-check-in capture this demand; listings with long lead requirements miss it.",
      "Weekend demand from leisure travellers visiting pubs, restaurants and co-working hubs creates a distinct Friday–Saturday peak that differs from midweek corporate demand. The same listing priced identically across both loses on both ends.",
    ],
    playbook: [
      "Lead the title with the area that actually drives bookings — 'Quiet 1BHK near Koramangala' or 'Whitefield studio near tech park' outperforms generic neighbourhood names.",
      "Call out Wi-Fi speed as a number in the first few lines of the description. Corporate guests filter for this specifically.",
      "Photograph the workspace if you have one — a desk, a decent chair, reliable power outlets. This converts business travellers who would otherwise search for co-working spaces.",
      "Price weekdays and weekends separately. Corporate travel fills midweek; weekend rates should account for leisure demand without cannibalising it.",
    ],
    faqs: [
      {
        q: "What amenities matter most for Airbnb guests in Bangalore?",
        a: "Fast Wi-Fi (stated as a speed number), self-check-in, parking and air conditioning are the top conversion drivers in Bangalore. Corporate travellers prioritise workspace and check-in flexibility; weekend travellers care about neighbourhood character and restaurant proximity.",
      },
      {
        q: "Which areas in Bangalore perform best for Airbnb?",
        a: "Koramangala, Indiranagar, Whitefield, Electronic City and HSR Layout consistently see highest search volume, driven by tech-park proximity and dining/social density. Listings near metro stations have an additional booking advantage for airport-route travellers.",
      },
    ],
  },
  {
    slug: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    intro:
      "Airbnb listing optimization in Hyderabad means serving two distinct demand streams — tech-corridor corporate travel around HITEC City and Gachibowli, and heritage tourism near the Old City and Hussain Sagar — often within the same calendar.",
    market: [
      "Hyderabad's Airbnb market splits between weekdays driven by IT corridor business (HITEC City, Gachibowli, Kondapur, Madhapur) and weekends drawing leisure and family visitors to heritage areas (Golconda, Charminar, Hussain Sagar). A listing's positioning depends heavily on which Hyderabad it's in.",
      "Corporate travellers in the tech corridor book short stays with predictable patterns — Monday–Wednesday peaks — and prioritise high-speed internet, power backup and gym access over local character.",
      "Heritage-zone listings attract weekend travellers, families visiting for events, and tourists spending 1–2 days covering Old City attractions. These guests prioritise spaces near landmarks and typically extend stays when the space can host a family group comfortably.",
    ],
    playbook: [
      "Position the listing for its micro-location: tech-corridor units lead with commute times and workspace quality; heritage-zone units lead with proximity to landmarks and family-friendly layouts.",
      "Include power backup and internet speed prominently in tech-corridor listings — these are decision-makers, not nice-to-haves, in Hyderabad's corporate market.",
      "For heritage-area listings, answer local questions inside the description: parking near the Old City, access to Metro, and guidance on area-specific logistics remove the hesitations that lose bookings.",
      "Set minimum-stay rules differently for weekday and weekend demand: no minimum on weeknights to capture last-minute corporate bookings; 2-night minimums on weekends to filter for leisure traffic.",
    ],
    faqs: [
      {
        q: "Is Hyderabad a good market for Airbnb hosting?",
        a: "Yes — Hyderabad has strong, patterned demand from both the IT corridor and heritage tourism. The key is matching the listing's positioning to its actual micro-market rather than trying to serve both streams from one positioning.",
      },
      {
        q: "What's the competitive landscape like for Airbnb in Hyderabad?",
        a: "Hotel supply in the IT corridor is strong, meaning listings must differentiate on space, kitchen access and workspace quality. Heritage-area competition is lower but guests have higher expectations for local guidance and logistics help.",
      },
    ],
  },
  {
    slug: "chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    intro:
      "Airbnb listing optimization in Chennai means balancing long-stay medical tourism and corporate travellers with seasonal leisure demand along the East Coast Road — a market where guest type shifts sharply by area and season.",
    market: [
      "Chennai has multiple distinct demand streams: medical tourism near Apollo and MIOT hospitals drives longer stays with family groups; IT corridor traffic around OMR and Thoraipakkam drives weekday corporate bookings; and ECR beach-season travellers drive weekend leisure demand that is heavily seasonal (November–February).",
      "Medical tourism guests book longer stays (1–3 weeks) and prioritise kitchen access, proximity to hospitals, quiet environments and ground-floor access. They are less price-sensitive than leisure travellers but have higher amenity expectations.",
      "Most Chennai listings are concentrated in the south-east corridor (OMR, Adyar, Velachery, Thoraipakkam) and along ECR. Beach-season listings operate on compressed calendars — 3–4 months of strong demand followed by quiet off-season periods that need deliberate pricing.",
    ],
    playbook: [
      "Identify which demand stream your listing actually serves, and optimise for it exclusively — a listing that tries to serve medical tourists, corporate travellers and beach tourists from one profile ends up serving none well.",
      "Near hospitals, lead the listing with hospital proximity, kitchen access and quietness. Guests booking from interstate or overseas for treatment don't need local nightlife — they need certainty about the space and logistics.",
      "ECR-area listings near the beach should have clearly separate peak and off-season pricing. A single year-round rate overprices the quiet months and undervalues the peak weekends simultaneously.",
      "For corporate-area listings (OMR, Thoraipakkam), emphasise parking, Wi-Fi and check-in flexibility — the same signals that work in any Indian tech-corridor market.",
    ],
    faqs: [
      {
        q: "What areas in Chennai are best for Airbnb?",
        a: "Adyar, Velachery and Thoraipakkam for corporate demand; areas near Apollo and MIOT hospitals for medical tourism; ECR villages (Muttukadu, Mahabalipuram) for weekend leisure. Each requires a different listing strategy.",
      },
      {
        q: "How does the medical tourism season affect Chennai Airbnb pricing?",
        a: "Medical tourism creates steady, less seasonal demand that's often neglected by hosts focused on peak leisure periods. Pricing for hospital-area listings should be stable year-round rather than cut in the off-season — this demand doesn't follow weather.",
      },
    ],
  },
  {
    slug: "kochi",
    city: "Kochi",
    state: "Kerala",
    intro:
      "Airbnb listing optimization in Kochi means serving the intersection of international backpackers, domestic leisure travellers, and wedding-season family groups across Fort Kochi, Ernakulam and the island suburbs.",
    market: [
      "Kochi has layer-cake demand: international travellers cycle through Fort Kochi's heritage zone (October–March peak), domestic tourists fill Ernakulam and nearby areas for weekend breaks year-round, and the November–February wedding season drives concentrated family-group bookings across the city.",
      "Fort Kochi listings compete with boutique hotels and homestays catering to a price-conscious international audience who value character, local recommendations and walkability over luxury finishes.",
      "The domestic leisure market is less seasonal but more weekday-sensitive — weekends in Kochi book well; weekday demand outside the international season needs deliberate rate management to avoid extended vacancy.",
    ],
    playbook: [
      "Heritage-zone listings in Fort Kochi should lead with character, walkability and local knowledge — the guests who search this area are buying an experience, not just a bed.",
      "Ernakulam listings targeting domestic travellers should emphasise parking, AC reliability, and clear proximity to transport hubs (railway station, metro, ferry terminals).",
      "The wedding season (November–February) creates concentrated demand for listings that can host extended family groups — larger spaces with multiple bedrooms and parking should price these windows deliberately.",
      "Price offshore season (April–September for international traffic, weekdays outside wedding season) to maintain occupancy rather than letting the calendar go dark. Lower rates that fill earn more than standard rates that don't.",
    ],
    faqs: [
      {
        q: "Is Kochi a good market for Airbnb hosts?",
        a: "Yes — Kochi has stronger year-round demand diversity than most South Indian cities, with international tourism, domestic leisure and wedding traffic creating overlapping demand streams. The key is positioning for your area's specific guest profile.",
      },
      {
        q: "What's the biggest mistake Airbnb hosts make in Kochi?",
        a: "Pricing Fort Kochi heritage listings too high for the international backpacker audience or pricing Ernakulam corporate-weekday stays too low. These two markets look close on a map but have completely different price sensitivities.",
      },
    ],
  },
  {
    slug: "visakhapatnam",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    intro:
      "Airbnb listing optimization in Visakhapatnam means capturing weekend leisure travellers and emerging business demand along Andhra Pradesh's coastal capital — a market where beach proximity and AC reliability drive most booking decisions.",
    market: [
      "Visakhapatnam's Airbnb demand is primarily weekend-driven: travellers from within Andhra Pradesh and neighbouring states visit for the beaches (RK Beach, Yarada, Bheemili), often booking Friday–Sunday with 1–2 week lead times.",
      "The city's growing port and IT corridor (Madhurawada, Rushikonda) are generating steady weekday corporate demand that currently outpaces formal listing supply — an opportunity for hosts targeting business travellers.",
      "Summer months (March–June) see a distinct drop in leisure travel as coastal heat intensifies. Listings that adjust pricing downward rather than holding year-round rates maintain valuable review momentum through this period.",
    ],
    playbook: [
      "Lead with beach proximity in the title — '5 min walk to RK Beach' or 'Sea-view room near Rushikonda' signals the primary booking driver for Vizag travellers.",
      "AC reliability is a non-negotiable amenity in Visakhapatnam's coastal climate. State it explicitly, and photograph the unit if it's a window or split AC visible in the room.",
      "Corporate-zone listings in Madhurawada and Rushikonda should optimise for weekday bookings with workspace mentions, fast Wi-Fi, and flexible check-in times to capture the undersupplied business segment.",
      "Price summer months deliberately lower to maintain occupancy. A listing that goes dark for May–June loses review momentum that takes months to rebuild in peak season.",
    ],
    faqs: [
      {
        q: "What's the best area for an Airbnb listing in Visakhapatnam?",
        a: "RK Beach and Jagadamba Junction areas see highest leisure search volume. Madhurawada and Rushikonda serve the growing corporate segment with less direct competition from hotels.",
      },
      {
        q: "Does Visakhapatnam have year-round Airbnb demand?",
        a: "Not yet — demand is strongly weekend and season-peaked. The emerging IT corridor is flattening this curve, but hosts should price deliberately for summer off-seasons rather than expect consistent occupancy.",
      },
    ],
  },
  {
    slug: "mysore",
    city: "Mysore",
    state: "Karnataka",
    intro:
      "Airbnb listing optimization in Mysore means serving a heritage-and-weekend market driven by palace tourism, Dasara festival traffic, and weekend getaways from Bangalore — with two very different demand profiles by season.",
    market: [
      "Mysore's Airbnb demand is anchored to weekend getaways from Bangalore (a 2.5-hour drive that creates a reliable Friday–Sunday market with 1–2 week booking lead times) and concentrated festival surges around Dasara (September–October) when the city's tourist traffic multiplies.",
      "The Dasara period creates a compressed window of extreme demand where listings within 3 km of the palace can command 2–3x normal rates. Hosts who don't price this window in advance leave significant revenue on the table deliberately.",
      "Off-season weekday demand is minimal outside the festival period — Mysore lacks the corporate traffic that sustains Bangalore or Hyderabad listings. Off-season strategy is about maintaining review flow through strategic pricing, not holding high occupancy.",
    ],
    playbook: [
      "Title and description should lead with palace proximity — '5 min walk to Mysore Palace' is the single most effective booking signal for this market.",
      "Set Dasara pricing well in advance (at least 4–6 weeks ahead) and consider 3-night minimum stays for the festival core dates. This concentrated demand window is the single biggest earning opportunity of the year.",
      "Off-season weekday pricing should be set deliberately low to fill gaps. A quiet October weekday earns nothing at a held-high rate; a lower rate that fills the night maintains review flow and ranking momentum.",
      "Position the listing for the Bangalore weekend visitor: include parking, workspace (many weekenders work remotely Friday), and good Wi-Fi alongside the heritage-focused messaging.",
    ],
    faqs: [
      {
        q: "When is peak season for Airbnb in Mysore?",
        a: "Dasara festival (September–October) is the extreme peak with compressed, high-intensity demand. The broader peak runs October–February with consistent weekend flow from Bangalore travellers.",
      },
      {
        q: "Can an Airbnb listing in Mysore earn well year-round?",
        a: "Year-round earnings are possible with deliberate off-season pricing and weekend optimisation, but Mysore hosts who earn the most have learned to maximise the Dasara and weekend windows rather than expecting 70%+ occupancy year-round.",
      },
    ],
  },
  {
    slug: "coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    intro:
      "Airbnb listing optimization in Coimbatore means capturing a steady industrial and healthcare-driven travel base with a smaller but growing weekend leisure segment — a market where consistency matters more than seasonal spikes.",
    market: [
      "Coimbatore's demand is dominated by industrial and business travel (textile mills, manufacturing units, engineering firms) and medical tourism flowing to the city's major hospitals (KMCH, Ganga, PSG). This creates steady weekday demand with low seasonality.",
      "Weekend leisure demand exists — driven by travellers visiting hill stations (Ooty, Valparai, Pollachi) who stay in Coimbatore en route — but it's secondary to the business-and-healthcare core. Coimbatore is not primarily a weekend destination.",
      "The city has undersupplied Airbnb inventory relative to demand, particularly in the industrial corridors (Peelamedu, Singanallur, Saravanampatti). Hosts willing to serve the business traveller well find less competition than in leisure-driven markets.",
    ],
    playbook: [
      "Lead with business-traveller signals: Wi-Fi speed (stated as a number), workspace, self-check-in, power backup, parking. These convert the core demand stream.",
      "For listings near hospitals, emphasise calm, kitchen access and family-friendly layouts — medical tourists often travel with family and book extended stays (1–3 weeks).",
      "Use stable year-round pricing rather than steep seasonal swings. Coimbatore's demand doesn't peak as dramatically as pilgrimage or beach cities, but it also doesn't dip as hard.",
      "Weekend pricing should be set above weekday rates for leisure traffic from Ooty-bound travellers, but the gap matters less than in weekend-driven markets.",
    ],
    faqs: [
      {
        q: "What type of Airbnb listing works best in Coimbatore?",
        a: "Full apartments and private rooms in business-friendly areas with reliable utilities perform best. Studios and 1BHK units near the industrial corridors convert fastest.",
      },
      {
        q: "Is Coimbatore a seasonal Airbnb market?",
        a: "Less seasonal than most South Indian cities — the industrial and healthcare demand base produces steady traffic year-round. The main variation is festival periods when local business travel dips but visiting-family demand rises.",
      },
    ],
  },
  {
    slug: "madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    intro:
      "Airbnb listing optimization in Madurai means serving temple and heritage tourism anchored to the Meenakshi Amman Temple — a market where guest expectations are shaped by pilgrimage proximity, family-group travel patterns, and seasonal festival surges.",
    market: [
      "Madurai's Airbnb demand is overwhelmingly pilgrimage-driven, centred on the Meenakshi Amman Temple which draws visitors year-round with pronounced peaks during the Chithirai Festival (April–May) and the Tamil month of Aadi (July–August).",
      "Guests are predominantly Indian family groups and domestic tourists visiting the temple and nearby heritage sites (Thirumalai Nayakkar Palace, Gandhi Museum). International traveller traffic exists but is smaller than in Kochi or Chennai.",
      "The city has a developing corporate and medical travel segment (Madurai Medical College, Velammal Hospital corridor) that provides non-pilgrimage weekday demand — currently undersupplied and often overlooked by hosts focused on temple-zone traffic.",
    ],
    playbook: [
      "Title and listing must answer the primary guest question quickly: proximity to Meenakshi Amman Temple. '5 min walk to the temple' or 'Temple-view room' is the most effective booking signal in Madurai.",
      "Family-group friendly features (extra beds, kitchen access or dining space, parking, multi-room layouts) drive conversion more than luxury finishes. Pilgrimage travellers book for the stay's functionality, not its decor.",
      "Chithirai Festival pricing should be set 6–8 weeks in advance with 2–3 night minimum stays. The festival creates a compressed demand spike that hosts who wait to adjust pricing typically miss.",
      "Corporate-zone listings near the hospital corridor or new business areas should optimise for the non-pilgrimage segment — quieter messaging, workspace mentions, weekday-friendly pricing.",
    ],
    faqs: [
      {
        q: "What's the peak season for Airbnb in Madurai?",
        a: "The Chithirai Festival (April–May) and Aadi month (July–August) are the strongest demand periods. The broader October–February tourist season also drives elevated weekend traffic.",
      },
      {
        q: "Do international tourists book Airbnb in Madurai?",
        a: "Yes, but in smaller numbers than domestic pilgrims and family travellers. International guests typically book heritage-style stays near the temple and value local guidance and cultural context from hosts.",
      },
    ],
  },
  {
    slug: "trivandrum",
    city: "Thiruvananthapuram",
    state: "Kerala",
    intro:
      "Airbnb listing optimization in Thiruvananthapuram means capturing government capital traffic, beach tourism along Kovalam's coast, and the city's emerging tech-corridor demand — three distinct guest profiles within one city's calendar.",
    market: [
      "Thiruvananthapuram has three overlapping demand streams: capital-city business travel (government visitors, NGO delegates, academic conferences) centred around the Secretariat and Technopark; beach tourism concentrated in Kovalam (October–March peak); and a growing IT corridor (Technopark Phase I–III, Kinfra Park) driving weekday corporate stays.",
      "Kovalam beach demand is intensely seasonal with a clear November–February peak driven by international and domestic beach tourists. Off-season (April–September) sees a sharp drop that needs deliberate pricing to maintain occupancy.",
      "The Technopark corridor has the fastest-growing weekday demand profile, with young professionals and visiting consultants requiring short-term stays near the campus — this segment is currently undersupplied at the Airbnb level relative to hotels.",
    ],
    playbook: [
      "Position clearly for one demand stream: beach-area listings should lead with ocean proximity, rooftop views and local recommendations; Technopark-zone listings should lead with workspace, Wi-Fi and commute convenience; city-centre listings should emphasise landmark access.",
      "Kovalam listings need distinct peak and off-season pricing — a single rate that tries to split the difference loses revenue in season and occupancy out of it.",
      "Technopark-area listings should court weekday corporate stays with workspace photos, stated Wi-Fi speeds, self-check-in and power backup — the same amenities that drive conversion in Bangalore and Hyderabad.",
      "Capital visitors (government, NGO, academic) often book longer stays with predictable schedules and value quiet, reliable spaces with kitchen access over tourist-oriented features.",
    ],
    faqs: [
      {
        q: "Where are the best areas for Airbnb listings in Thiruvananthapuram?",
        a: "Kovalam for beach tourism, the Technopark corridor for corporate/IT stays, and the city centre (Thampanoor, Palayam) for government visitors and conference traffic. Each requires a different listing strategy.",
      },
      {
        q: "Is Thiruvananthapuram a year-round Airbnb market?",
        a: "The capital-city and tech-corridor segments provide year-round demand, but Kovalam-area listings face a pronounced off-season (April–September) that needs active pricing management. The combination of all three makes Trivandrum less seasonal than pure beach destinations.",
      },
    ],
  },
  {
    slug: "pondicherry",
    city: "Puducherry",
    state: "Puducherry",
    intro:
      "Airbnb listing optimization in Puducherry means serving weekend leisure travellers from Chennai and Bangalore drawn by the French Quarter's heritage character, White Town's café culture, and the city's distinct coastal identity — a market with compressed but intense demand windows.",
    market: [
      "Puducherry's Airbnb demand is overwhelmingly weekend-driven, with travellers from Chennai (3–4 hours drive) and Bangalore (5–6 hours) booking Thursday–Sunday stays. The booking window is typically 1–3 weeks, with a strong last-minute component from experienced weekenders.",
      "White Town (French Quarter) listings compete directly with boutique hotels and heritage properties, placing a premium on character, walkability and aesthetic details. Listings outside White Town compete primarily on space and value, attracting family groups and budget-conscious travellers.",
      "Summer months (April–June) see thin demand as coastal heat reduces leisure travel. Auroville-oriented visitors provide some counter-seasonal traffic, but Puducherry is primarily a winter and post-monsoon destination (October–March).",
    ],
    playbook: [
      "White Town listings should invest heavily in photography that captures heritage character — exposed stone, tiled floors, courtyard spaces. In this market, the listing page is competing with boutique hotel aesthetic standards.",
      "Outside White Town, lead with space, parking and family-friendly features. The guests who book here are trading location for value — reinforce that trade-off in the listing.",
      "Pricing should have clear weekday–weekend separation. A White Town studio can command 2x on a Friday night versus Tuesday. Listings that don't differentiate leave weekend revenue uncollected.",
      "Summer pricing should be set lower deliberately to maintain occupancy and review flow. The October–March peak is strong enough to compensate for quieter summer months if the calendar stays active.",
    ],
    faqs: [
      {
        q: "What makes a successful Airbnb listing in Puducherry?",
        a: "Photography that captures the property's character — particularly in White Town where guests are booking for the aesthetic experience — combined with clear weekend pricing and fast response times to capture last-minute weekend bookers.",
      },
      {
        q: "How competitive is the Puducherry Airbnb market?",
        a: "White Town is competitive, with many listings and boutique hotels serving similar guests. Listings outside the French Quarter face less direct competition but need to work harder to signal value. Differentiation through character and pricing strategy matters more here than in most South Indian markets.",
      },
    ],
  },
];

export function getCity(slug: string): CityPage | undefined {
  return CITIES.find((c) => c.slug === slug);
}
