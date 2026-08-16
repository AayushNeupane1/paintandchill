"use client";

import Image from "next/image";
import type { HeroImage } from "@/lib/heroContent";

export interface BrushImageRefs {
  container: (el: HTMLDivElement | null) => void;
  stroke: (el: HTMLDivElement | null) => void;
  photo: (el: HTMLDivElement | null) => void;
}

interface BrushImageProps {
  image: HeroImage;
  refs: BrushImageRefs;
  /** left / top / width — the container's aspect ratio comes from the mask. */
  position: React.CSSProperties;
  sizes: string;
  priority?: boolean;
}

/**
 * A single photograph revealed through an organic, rough-edged brush mask.
 *
 * Two layers do the work:
 *  - a "stroke" layer: a slightly larger box filled with a brand paint colour
 *    and clipped to the brush silhouette, so a painted edge haloes the photo
 *  - the photograph itself, clipped to the same silhouette
 *
 * The container is given an explicit `aspectRatio` matching the mask asset.
 * This is essential: every child is absolutely positioned, so without it the
 * container collapses to zero height and nothing renders (and lazy images
 * never enter the viewport to load).
 *
 * Masks are pure white + alpha, so the colour comes entirely from CSS —
 * the mask art itself never paints anything.
 */
export default function BrushImage({
  image,
  refs,
  position,
  sizes,
  priority,
}: BrushImageProps) {
  const mask = {
    WebkitMaskImage: `url(${image.mask})`,
    maskImage: `url(${image.mask})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  } as const;

  return (
    <div
      // `refs.*` are callback refs supplied by the parent to collect DOM
      // nodes for GSAP; nothing reads `.current` during render.
      // eslint-disable-next-line react-hooks/refs
      ref={refs.container}
      className="hero-reveal absolute will-change-transform"
      style={{ aspectRatio: String(image.aspect), ...position }}
    >
      <div
        // eslint-disable-next-line react-hooks/refs -- see note above
        ref={refs.stroke}
        aria-hidden="true"
        className="absolute -inset-[5%]"
        style={{ backgroundColor: image.accent, ...mask }}
      />
      <div
        // eslint-disable-next-line react-hooks/refs -- see note above
        ref={refs.photo}
        className="absolute inset-0 overflow-hidden"
        style={mask}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
