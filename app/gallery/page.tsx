import type { Metadata } from "next";
import GallerySlider from "@/components/gallery/GallerySlider";
import { artworks, galleryCopy } from "@/lib/galleryContent";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse original paintings and prints from Paint & Chill sessions and our resident Melbourne artists. Enquire or buy directly over WhatsApp.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    url: `${siteConfig.url}/gallery`,
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
