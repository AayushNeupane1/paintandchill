"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import {
  artworks,
  buyLink,
  enquireLink,
  type Artwork,
} from "@/lib/galleryContent";

gsap.registerPlugin(Flip);

/** How many thumbnail cards sit in the rail. The last one bleeds off-screen. */
const DESKTOP_CARDS = 4;
const MOBILE_CARDS = 3;

/**
 * Layout for a given deck position.
 *  pos 0        -> the active artwork, full-bleed behind everything
 *  pos 1..n     -> thumbnail cards in the rail on the right
 *  beyond that  -> parked off-screen right, invisible
 *
 * Percentages (not pixels) so the same table works at every viewport size,
 * and so GSAP Flip can measure real rects before and after the swap.
 */
function layoutFor(pos: number, isMobile: boolean): React.CSSProperties {
  if (pos === 0) {
    return { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0, zIndex: 1 };
  }

  const k = pos - 1;
  const visible = isMobile ? MOBILE_CARDS : DESKTOP_CARDS;

  const card: React.CSSProperties = isMobile
    ? { top: "16%", width: "26%", height: "26%", borderRadius: "14px" }
    : { top: "27%", width: "16.5%", height: "46%", borderRadius: "20px" };

  if (k >= visible) {
    return { ...card, left: "108%", opacity: 0, zIndex: 5, pointerEvents: "none" };
  }

  const left = isMobile ? 44 + k * 27 : 45 + k * 17;
  return { ...card, left: `${left}%`, opacity: 1, zIndex: 10 };
}

export default function GallerySlider() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const total = artworks.length;
  const nodes = useRef<(HTMLDivElement | null)[]>(artworks.map(() => null));
  const flipState = useRef<Flip.FlipState | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  // Breakpoint has to be resolved on the client — the server can't know it.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /**
   * Capture the current geometry BEFORE React re-renders, then let the
   * layout effect below animate from it. This is the standard React + Flip
   * pattern: measure first, mutate state, animate the difference.
   */
  const goTo = useCallback(
    (index: number) => {
      const els = nodes.current.filter(Boolean) as HTMLElement[];
      flipState.current = Flip.getState(els, { props: "borderRadius" });
      setActive(((index % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useLayoutEffect(() => {
    if (!flipState.current) return; // first paint — nothing to animate from

    Flip.from(flipState.current, {
      duration: 0.85,
      ease: "power3.inOut",
      absolute: true,
      props: "borderRadius",
    });
    flipState.current = null;

    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.18 }
    );
  }, [active]);

  // Arrow-key navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current: Artwork = artworks[active];

  return (
    <section
      className="relative h-svh w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Artwork gallery"
    >
      {/* Deck: every artwork is always mounted and keeps its DOM identity, so
          Flip can morph a thumbnail into the full-bleed background. */}
      {artworks.map((art, i) => {
        const pos = (i - active + total) % total;
        const isActive = pos === 0;
        return (
          <div
            key={art.id}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            data-flip-id={art.id}
            className={`absolute overflow-hidden ${
              isActive ? "" : "cursor-pointer shadow-2xl ring-1 ring-white/10"
            }`}
            style={layoutFor(pos, isMobile)}
            onClick={isActive ? undefined : () => goTo(i)}
            onKeyDown={
              isActive
                ? undefined
                : (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goTo(i);
                    }
                  }
            }
            role={isActive ? undefined : "button"}
            tabIndex={isActive ? undefined : 0}
            aria-label={isActive ? undefined : `View ${art.title}`}
            aria-hidden={pos > (isMobile ? MOBILE_CARDS : DESKTOP_CARDS)}
          >
            <Image
              src={art.src}
              alt={art.alt}
              fill
              sizes={isActive ? "100vw" : "(max-width: 767px) 30vw, 20vw"}
              priority={i === 0}
              className="object-cover"
            />
          </div>
        );
      })}

      {/* Scrim so the copy stays legible over any artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-ink/90 via-ink/50 to-ink/20"
      />

      {/* Details panel */}
      <div
        ref={panelRef}
        className="absolute inset-x-0 bottom-[18%] z-30 px-6 sm:left-[7%] sm:right-auto sm:top-1/2 sm:bottom-auto sm:max-w-[34%] sm:-translate-y-1/2 sm:px-0"
      >
        <p className="font-body text-[11px] font-semibold tracking-[0.3em] text-canvas/60">
          {current.artist}
        </p>

        <h2 className="mt-3 font-display text-[9vw] font-black uppercase leading-[0.95] tracking-tight text-canvas sm:text-[3.4vw]">
          {current.title}
        </h2>

        <p className="mt-3 font-body text-sm text-canvas/75">{current.blurb}</p>

        <p className="mt-2 font-body text-xs text-canvas/55">
          {current.medium} · {current.dimensions}
        </p>

        <p className="mt-5 font-display text-2xl font-bold text-canvas sm:text-3xl">
          {current.sold ? "SOLD" : current.price}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={enquireLink(current)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-canvas px-6 py-3 text-xs font-bold tracking-[0.12em] text-canvas transition-colors hover:bg-canvas hover:text-ink"
          >
            ENQUIRE
          </a>

          {!current.sold && (
            <a
              href={buyLink(current)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="book"
              className="rounded-full bg-canvas px-6 py-3 text-xs font-bold tracking-[0.12em] text-ink transition-transform hover:scale-[1.04]"
            >
              BUY ON WHATSAPP →
            </a>
          )}
        </div>
      </div>

      {/* Prev / next */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous artwork"
          className="grid h-11 w-11 place-items-center rounded-xl border border-canvas/30 bg-canvas/10 text-canvas backdrop-blur transition-colors hover:bg-canvas hover:text-ink"
        >
          <span aria-hidden="true">←</span>
        </button>
        <span className="font-body text-xs tabular-nums text-canvas/60">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={next}
          aria-label="Next artwork"
          className="grid h-11 w-11 place-items-center rounded-xl border border-canvas/30 bg-canvas/10 text-canvas backdrop-blur transition-colors hover:bg-canvas hover:text-ink"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p ref={liveRef} aria-live="polite" className="sr-only">
        {`Showing ${current.title}, ${current.price}`}
      </p>
    </section>
  );
}
