import { waLink } from "./whatsapp";

// -----------------------------------------------------------------------------
// Art gallery configuration.
//
// TO ADD MORE WORK: drop files into /public/artwork and add an entry below.
// Nothing in the components needs to change.
//
// PRICES: deliberately set to "Price on enquiry" rather than invented numbers.
// Replace with real figures when you have them — the Buy message picks them up
// automatically.
// -----------------------------------------------------------------------------

export interface Artwork {
  /** Stable id — used as the Flip animation key. Must be unique. */
  id: string;
  src: string;
  alt: string;
  title: string;
  artist: string;
  medium: string;
  /** Physical size, or the wall size for murals. */
  dimensions: string;
  /** Shown as-is. Include the currency if it's a real figure. */
  price: string;
  blurb: string;
  /**
   * Murals are commissioned per-space, not bought off the wall. Setting this
   * swaps the Buy button for a single commission enquiry and changes the
   * WhatsApp message accordingly.
   */
  commission?: boolean;
  /** Hides the Buy button and shows a SOLD badge. */
  sold?: boolean;
}

export const artworks: Artwork[] = [
  {
    id: "a-word-of-magic",
    src: "/artwork/a-word-of-magic.jpg",
    alt: "A Word of Magic — mixed media portrait in deep reds and ochres, with collaged text on canvas",
    title: "A Word of Magic",
    artist: "Paint & Chill",
    medium: "Mixed media and collage on canvas",
    dimensions: "Original — please enquire for size",
    price: "Price on enquiry",
    blurb: "Layered acrylic and collage, built up over several sittings.",
  },
  {
    id: "charcoal-study",
    src: "/artwork/charcoal-study.jpg",
    alt: "Charcoal portrait study of a woman with her head tilted back and flowing hair",
    title: "Charcoal Study",
    artist: "Paint & Chill",
    medium: "Charcoal on paper",
    dimensions: "Original — please enquire for size",
    price: "Price on enquiry",
    blurb: "A single-session charcoal portrait, worked wet into dry.",
  },
  {
    id: "mountain-mural",
    src: "/artwork/mountain-mural.jpg",
    alt: "Large hand-painted wall mural of a snow-capped mountain range with a rope bridge and river",
    title: "Mountain Crossing",
    artist: "Paint & Chill",
    medium: "Hand-painted wall mural",
    dimensions: "Painted to fit your wall",
    price: "Commission",
    blurb: "A full-wall commission — mountains, river and rope bridge.",
    commission: true,
  },
  {
    id: "tree-mural",
    src: "/artwork/tree-mural.jpg",
    alt: "Hand-painted wall mural of a blossoming tree with green foliage and grass along the skirting",
    title: "Blossom Tree",
    artist: "Paint & Chill",
    medium: "Hand-painted wall mural",
    dimensions: "Painted to fit your wall",
    price: "Commission",
    blurb: "An interior mural wrapping a corner, painted in place.",
    commission: true,
  },
];

export function enquireLink(art: Artwork): string {
  if (art.commission) {
    return waLink(
      `Hi Paint & Chill, I'd love to commission a mural like "${art.title}" for my space. Can we talk about it?`
    );
  }
  return waLink(
    `Hi Paint & Chill, I'd like to enquire about "${art.title}" (${art.medium}). Is it still available?`
  );
}

export function buyLink(art: Artwork): string {
  return waLink(
    `Hi Paint & Chill, I'd like to purchase "${art.title}"${
      art.price.toLowerCase().startsWith("price") ? "" : ` — ${art.price}`
    }. How do I go ahead?`
  );
}

export const galleryCopy = {
  eyebrow: "PAINT & CHILL",
  title: "The Gallery",
  intro:
    "Original paintings, drawings and hand-painted wall murals from Paint & Chill in Melbourne. Enquire or purchase directly over WhatsApp.",
};

export { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "./whatsapp";
