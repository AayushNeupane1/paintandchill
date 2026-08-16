import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import GallerySlider from "@/components/gallery/GallerySlider";
import { artworks, galleryCopy } from "@/lib/galleryContent";
import { brandLogo } from "@/lib/heroContent";

export const metadata: Metadata = {
  title: "Gallery — Original Paintings & Prints | Paint & Chill Melbourne",
  description:
    "Browse original paintings and prints from Paint & Chill sessions and our resident Melbourne artists. Enquire or buy directly over WhatsApp.",
  openGraph: {
    title: "Paint & Chill Gallery — Original Art from Melbourne",
    description:
      "Original paintings and prints available to purchase directly from Paint & Chill.",
    type: "website",
    locale: "en_AU",
  },
};

export default function GalleryPage() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-40">
        <nav
          aria-label="Gallery"
          className="flex items-center justify-between gap-4 px-5 py-5 text-canvas sm:px-8"
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={brandLogo}
              alt="Paint & Chill logo"
              width={34}
              height={34}
              className="rounded-full"
              priority
            />
            <span className="font-display text-sm font-extrabold tracking-[0.14em]">
              {galleryCopy.eyebrow}
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-canvas/40 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-canvas transition-colors hover:bg-canvas hover:text-ink sm:px-5"
          >
            ← BACK TO SITE
          </Link>
        </nav>
      </header>

      {/* One meaningful H1 for the page, kept visually minimal so the
          artwork leads. Crawlers still get a descriptive heading. */}
      <h1 className="sr-only">
        Paint &amp; Chill Gallery — Original Paintings and Prints in Melbourne
      </h1>
      <p className="sr-only">{galleryCopy.intro}</p>

      <GallerySlider />

      {/* Server-rendered, crawlable list of every artwork. The slider is a
          client-side enhancement; this guarantees the catalogue is in the
          HTML even if JavaScript never runs. */}
      <section className="sr-only" aria-label="All artworks">
        <ul>
          {artworks.map((a) => (
            <li key={a.id}>
              {a.title} by {a.artist}. {a.medium}, {a.dimensions}.{" "}
              {a.sold ? "Sold." : `Price ${a.price}.`} {a.blurb}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
