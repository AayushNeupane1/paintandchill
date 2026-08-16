// -----------------------------------------------------------------------------
// Hero image configuration.
// Swap real Paint & Chill photography by replacing the files in /public/images
// (or updating `src` below to point elsewhere). No component code needs to
// change when new photography is supplied.
// -----------------------------------------------------------------------------

export interface HeroImage {
  /** Unique key used for refs / animation targeting. */
  id: string;
  /** Path under /public (or a full URL) to the photograph. */
  src: string;
  /** Meaningful, descriptive alt text — required for accessibility & SEO. */
  alt: string;
  /** Brush-patch alpha mask this photo is revealed inside of. */
  mask: string;
  /**
   * Width / height of the mask asset. The photo's container is given this
   * aspect ratio so the mask lines up exactly with the box — without it the
   * container would collapse and nothing would render.
   */
  aspect: number;
  /** Paint colour of the stroke that appears under/around the photo. */
  accent: string;
}

export const heroImages: HeroImage[] = [
  {
    id: "guiding",
    src: "/images/session-04.jpg",
    alt: "A Paint & Chill artist gently guiding a participant's brushstroke during a Melbourne painting session",
    mask: "/brushes/patch-05.png",
    aspect: 1040 / 800,
    accent: "var(--coral)",
  },
  {
    id: "studio-session",
    src: "/images/session-02.jpg",
    alt: "A full room of participants painting at easels during a Paint & Chill studio session in Melbourne",
    mask: "/brushes/patch-01.png",
    aspect: 1000 / 740,
    accent: "var(--blue)",
  },
  {
    id: "table-painting",
    src: "/images/session-03.jpg",
    alt: "Canvases, palettes and paint bottles laid out on a table during a Melbourne art session",
    mask: "/brushes/patch-03.png",
    aspect: 1100 / 720,
    accent: "var(--yellow)",
  },
  {
    id: "smiling",
    src: "/images/session-05.jpg",
    alt: "An artist and a smiling participant sharing a moment during a private painting event",
    mask: "/brushes/patch-04.png",
    aspect: 820 / 900,
    accent: "var(--orange)",
  },
  {
    id: "group-class",
    src: "/images/session-06.jpg",
    alt: "Friends painting together at a Paint & Chill social art class in Melbourne",
    mask: "/brushes/patch-02.png",
    aspect: 760 / 980,
    accent: "var(--blue)",
  },
  {
    id: "hero-finale",
    src: "/images/session-01.jpg",
    alt: "A group of smiling friends holding their finished paintings after a Paint & Chill session in Melbourne",
    mask: "/brushes/patch-06.png",
    aspect: 1200 / 780,
    accent: "var(--coral)",
  },
];

/** Wide painted band the closing CTAs sit on. */
export const ctaBandMask = "/brushes/band-cta.png";

/** Torn painted edge that carries the hero into the next section. */
export const tornEdgeMask = "/brushes/edge-torn.png";

export const brandLogo = "/brand/logo.png";

export const heroCopy = {
  eyebrow: "PAINT & CHILL",
  headlineLines: ["PAINT.", "CHILL.", "CREATE."],
  finaleHeadline: "COME PAINT WITH US.",
  finaleSub: "Melbourne's creative painting experience.",
  sub: "Creative painting experiences, art sessions and private events in Melbourne.",
  ctaPrimary: "BOOK A SESSION",
  ctaSecondary: "EXPLORE EXPERIENCES",
  seoIntro:
    "Paint & Chill hosts creative painting experiences, art sessions, painting classes and private painting events across Melbourne — no experience necessary, just good company and a blank canvas.",
};
