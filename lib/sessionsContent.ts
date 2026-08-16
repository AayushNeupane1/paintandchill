import { waLink } from "./whatsapp";

// -----------------------------------------------------------------------------
// Session offerings.
//
// Pricing is deliberately NOT published — it scales with group size and is
// agreed over WhatsApp. Instead the visitor picks their group size here, and
// that choice is baked into the WhatsApp message so the conversation starts
// with the details already on the table.
// -----------------------------------------------------------------------------

export interface SessionOption {
  id: string;
  /** The session's own name — its identity, not a category label. */
  name: string;
  /** Plain-language category, so nobody has to decode the name. */
  kind: string;
  tagline: string;
  /** Longer description — the "why book this". */
  description: string;
  forWho: string;
  duration: string;
  groupSize: string;
  location: string;
  /** Everything the price covers. Removes the "what do I need to bring" doubt. */
  includes: string[];
  /** One reassurance that kills the main objection. */
  reassurance: string;
  /** Group-size buckets offered in the selector. */
  groupOptions: string[];
  image: string;
  imageAlt: string;
  /** Full-brightness brand colour — fills, bars, chips. */
  accent: string;
  /** Darkened variant safe to use as TEXT on ivory. */
  accentInk: string;
}

export const sessions: SessionOption[] = [
  {
    id: "bright-hours",
    name: "Bright Hours",
    kind: "Aged care & community",
    tagline: "An afternoon of colour, brought to your residents.",
    description:
      "A calm, unhurried painting session designed for aged care homes, day programs and community groups. We come to you, set up everything, and work at the pace of the room — seated, supported, and genuinely social. No experience needed, and nobody is ever put on the spot.",
    forWho: "Aged care homes, memory support units, community & day programs",
    duration: "90 minutes – 2 hours",
    groupSize: "6 – 30 residents",
    location: "We come to your facility",
    includes: [
      "A facilitating artist who works one-on-one around the room",
      "All canvases, paints, brushes, aprons and table covering",
      "Seated-friendly setup with adaptive grips available",
      "Full pack-down — we leave the room exactly as we found it",
      "Every participant takes their painting home",
    ],
    reassurance:
      "Dementia and limited-mobility friendly. We adapt the subject and pace to the room on the day.",
    groupOptions: ["6–10 residents", "11–20 residents", "21–30 residents", "Recurring programme"],
    image: "/images/session-05.jpg",
    imageAlt:
      "A Paint & Chill artist sharing a laugh with a smiling resident during an aged care painting session",
    accent: "var(--pc-orange)",
    accentInk: "var(--pc-orange-ink)",
  },
  {
    id: "the-big-table",
    name: "The Big Table",
    kind: "Private groups, 5+",
    tagline: "Get everyone around one table with a brush in hand.",
    description:
      "Birthdays, hens, baby showers, book clubs, friend groups who keep saying they should catch up properly. You bring the people and the drinks, we bring the whole studio. Everyone paints the same piece, everyone's turns out different, and everyone leaves with something on canvas.",
    forWho: "Birthdays, hens & bucks, baby showers, friend groups, family gatherings",
    duration: "2 – 2.5 hours",
    groupSize: "5 – 40 guests",
    location: "Your place, a venue, or our studio",
    includes: [
      "A guiding artist who walks the room the whole session",
      "Canvas, easel, paints, brushes and aprons for every guest",
      "A subject chosen with you beforehand",
      "Music, table setup and full pack-down",
      "BYO food and drinks — we'll work around them",
    ],
    reassurance:
      "Genuinely no experience needed. Most guests have not painted since school, and that is the fun of it.",
    groupOptions: ["5–10 guests", "11–20 guests", "21–30 guests", "30+ guests"],
    image: "/images/session-06.jpg",
    imageAlt:
      "A long table of friends painting together at a private Paint & Chill gathering in Melbourne",
    accent: "var(--pc-pink)",
    accentInk: "var(--pc-pink-ink)",
  },
  {
    id: "off-the-clock",
    name: "Off the Clock",
    kind: "Business & teams",
    tagline: "A team activity nobody has to be talked into.",
    description:
      "A creative session built for teams — onboarding weeks, offsites, end-of-quarter, or a Thursday that needs saving. It levels the room fast: no laptops, no hierarchy, no icebreaker games anyone dreads. Just two hours of people actually talking to each other while they paint.",
    forWho: "Team offsites, staff wellbeing days, client events, end-of-year functions",
    duration: "1.5 – 2 hours",
    groupSize: "8 – 60 people",
    location: "Your office, an offsite venue, or our studio",
    includes: [
      "Facilitating artist, scaled to your headcount",
      "All materials, easels and protective setup for your space",
      "Optional team piece — panels that join into one large artwork",
      "Invoicing, ABN and certificate of currency for venue requirements",
      "Full setup and pack-down around your schedule",
    ],
    reassurance:
      "We're fully insured and set up for corporate procurement — invoicing and paperwork are no problem.",
    groupOptions: ["8–15 people", "16–30 people", "31–60 people", "Multi-team / recurring"],
    image: "/images/studio-session.jpg",
    imageAlt:
      "A room of easels set up for a corporate Paint & Chill team painting session in Melbourne",
    accent: "var(--pc-blue)",
    accentInk: "var(--pc-blue-ink)",
  },
];

/** WhatsApp enquiry that already carries the session and group size. */
export function sessionEnquiryLink(session: SessionOption, groupSize: string): string {
  return waLink(
    `Hi Paint & Chill! I'd like to book "${session.name}" (${session.kind}) for ${groupSize}. Could you send me pricing and your next available dates?`
  );
}

export const sessionsCopy = {
  eyebrow: "SESSIONS",
  titleLead: "Three ways to",
  titleScript: "get painting.",
  intro:
    "Every session is run by a working artist, includes everything, and comes to you anywhere in Melbourne. Pricing scales with your group — tell us the numbers and we'll send a quote the same day.",
  steps: [
    { n: "01", t: "Pick your session", d: "Choose the format that fits your group." },
    { n: "02", t: "Message us on WhatsApp", d: "Tell us your numbers and rough date." },
    { n: "03", t: "We bring everything", d: "You just show up. We handle the rest." },
  ],
};
