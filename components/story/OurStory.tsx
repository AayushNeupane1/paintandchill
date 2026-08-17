"use client";

import { useEffect, useRef, useState } from "react";
import { story } from "@/lib/storyContent";

/**
 * Our Story.
 *
 * The video autoplays muted on loop — browsers block autoplay with sound, so
 * muted is the only way unattended playback works reliably. Two refinements
 * beyond a plain <video autoplay loop>:
 *
 *  1. An IntersectionObserver pauses it whenever it scrolls out of view, so a
 *     video nobody is looking at isn't burning CPU and battery.
 *  2. If the visitor prefers reduced motion, it never autoplays at all — they
 *     get a paused first frame and real controls instead. Looping motion is
 *     exactly what that setting exists to stop.
 */
export default function OurStory() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser still refuses autoplay; ignore it
          // rather than throwing an unhandled rejection into the console.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <section
      id="our-story"
      className="relative overflow-hidden bg-canvas py-24 sm:py-32"
      aria-label="Our story"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[26rem] w-[26rem] rounded-full bg-pc-purple/10 blur-[120px]"
      />

      {/* Video first in the DOM as well as on the left visually — reading
          order then matches visual order for screen readers and crawlers,
          instead of relying on CSS ordering to fake it. */}
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,1.34fr)] lg:gap-16">
        {/* Video */}
        <figure className="relative lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_28px_70px_-24px_rgba(22,19,17,0.4)] ring-1 ring-ink/[0.07]">
            <video
              ref={videoRef}
              className="mx-auto w-full max-h-[72vh] bg-canvas-deep object-cover lg:max-h-none"
              style={{ aspectRatio: story.video.aspect }}
              muted
              loop
              playsInline
              // No poster image, so the video's own first frame is what the
              // visitor sees. `metadata` is enough for the browser to decode
              // and paint that frame without pulling the whole clip.
              preload="metadata"
              controls={reducedMotion}
              aria-label={story.video.description}
            >
              <source src={story.video.src} type="video/mp4" />
              {story.video.description}
            </video>

            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1.5"
              style={{ background: "var(--paint-gradient)" }}
            />
          </div>

          <figcaption className="mt-3 text-[12px] text-ink/45">
            Inside a Paint &amp; Chill session, Melbourne.
          </figcaption>
        </figure>

        {/* Copy */}
        <div>
          <p className="font-display text-[10px] font-bold tracking-[0.42em] text-ink/45">
            {story.eyebrow}
          </p>

          <h2 className="mt-5 text-ink">
            <span className="block font-display text-[9vw] font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-[3.4vw]">
              {story.titleLead}
            </span>
            <span className="paint-text block w-fit font-script text-[11vw] leading-[1.05] sm:text-[4vw]">
              {story.titleScript}
            </span>
          </h2>

          <p className="mt-7 max-w-xl font-script text-2xl leading-snug text-ink/80 sm:text-[1.7rem]">
            {story.lead}
          </p>

          <div className="mt-6 max-w-xl space-y-4">
            {story.body.map((para) => (
              <p key={para} className="text-[15px] leading-relaxed text-ink/70">
                {para}
              </p>
            ))}
          </div>

          <dl className="mt-9 grid max-w-xl gap-5 border-t border-ink/10 pt-6 sm:grid-cols-3 sm:gap-6">
            {story.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[17px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-lg">
                  {s.value}
                </dd>
                <p className="mt-1.5 text-[12px] leading-snug text-ink/50">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
