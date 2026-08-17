/**
 * Single source of truth for anything that describes the business or the
 * deployment. Metadata, sitemap, robots, nav and footer all read from here,
 * so there is exactly one place to change a phone number or a domain.
 */

export const siteConfig = {
  name: "Paint & Chill",
  /** Used in <title> templates. */
  shortName: "Paint & Chill",
  tagline: "Creative Painting Experiences in Melbourne",
  description:
    "Paint & Chill runs creative painting experiences, art sessions and private painting events across Melbourne — for aged care, private groups and workplaces. Everything supplied, we come to you.",

  /**
   * ⚠️ Set this to the real production domain before launch. It drives
   * canonical URLs, the sitemap and Open Graph image resolution. Vercel
   * exposes the deployment URL as NEXT_PUBLIC_SITE_URL if you'd rather
   * configure it per-environment.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://paintandchill.com.au",

  locale: "en_AU",
  lang: "en-AU",
  city: "Melbourne",
  region: "Victoria",
  country: "Australia",

  ogImage: "/brand/og-image.jpg",

  /** Primary navigation. One array drives desktop, mobile and the footer. */
  nav: [
    { label: "Sessions", href: "/sessions" },
    { label: "Gallery", href: "/gallery" },
    { label: "Our Story", href: "/story" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
