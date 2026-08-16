import Hero from "@/components/hero/Hero";
import CustomCursor from "@/components/hero/CustomCursor";
import { heroCopy, tornEdgeMask } from "@/lib/heroContent";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Hero />

      {/* SEO-friendly supporting copy (visually minimal, not part of the
          hero animation itself) so the page never relies on canvas/animation
          alone to communicate what Paint & Chill is. */}
      <p className="sr-only">{heroCopy.seoIntro}</p>

      {/* Clean transition anchor for the next section, "The Birth of Paint
          & Chill" — intentionally left minimal. That section is out of
          scope for this build.

          Paint carries the eye across the boundary: a torn stroke in the
          brand gradient sits on the leading edge of the dark section, so
          the hero appears to be painted away rather than cut off. */}
      <section
        id="next-section-anchor"
        className="relative flex min-h-[40vh] items-center justify-center bg-ink px-6 text-center"
        aria-label="Continue to our story"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-px h-14 sm:h-20"
          style={{
            background: "var(--paint-gradient)",
            WebkitMaskImage: `url(${tornEdgeMask})`,
            maskImage: `url(${tornEdgeMask})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        />
        <p className="font-body text-xs font-semibold tracking-[0.35em] text-canvas/60">
          THE BIRTH OF PAINT &amp; CHILL — COMING UP
        </p>
      </section>
    </>
  );
}
