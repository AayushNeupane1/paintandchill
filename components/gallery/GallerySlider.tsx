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

/**
 * Gallery.
 *
 * The full-bleed image behind everything is ambience only — it shows the
 * selected piece at scale. The rail in front is the real navigation, and it
 * ALWAYS starts with the piece currently selected, so nothing is hidden in a
 * queue: card one is what you are looking at.
 */
export default function GallerySlider() {
  const [active, setActive] = useState(0);
  const total = artworks.length;

  const railRef = useRef<HTMLDivElement>(null);
  const cardNodes = useRef<Map<string, HTMLElement>>(new Map());
  const flipState = useRef<Flip.FlipState | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>(artworks.map(() => null));

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % total) + total) % total;
      if (next === active) return;
      flipState.current = Flip.getState(Array.from(cardNodes.current.values()));
      setActive(next);
    },
    [active, total]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Reorder the rail, crossfade the backdrop, reveal the new details.
  useLayoutEffect(() => {
    if (flipState.current) {
      Flip.from(flipState.current, {
        duration: 0.7,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.035,
      });
      flipState.current = null;
    }

    bgRefs.current.forEach((el, i) => {
      if (el) gsap.to(el, { opacity: i === active ? 1 : 0, duration: 0.9, ease: "power2.inOut" });
    });

    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }
    );
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current: Artwork = artworks[active];
  // Rail order always begins with the selected piece.
  const ordered = Array.from({ length: total }, (_, k) => artworks[(active + k) % total]);

  return (
    <section
      className="relative h-svh w-full overflow-hidden bg-[#0b0a0a] pt-16"
      aria-roledescription="carousel"
      aria-label="Artwork gallery"
    >
      {/* Ambience: the selected piece, oversized, blurred and dimmed. */}
      {artworks.map((art, i) => (
        <div
          key={art.id}
          ref={(el) => {
            bgRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 scale-110"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <Image
            src={art.src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="scale-105 object-cover blur-[3px]"
          />
        </div>
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b0a0a] via-[#0b0a0a]/85 to-[#0b0a0a]/55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0a0a] via-transparent to-[#0b0a0a]/70"
      />

      {/* Details */}
      <div
        ref={panelRef}
        className="absolute inset-x-0 top-[16%] z-30 px-6 sm:left-[6.5%] sm:right-auto sm:top-1/2 sm:max-w-[33%] sm:-translate-y-1/2 sm:px-0"
      >
        <p className="font-display text-[10px] font-bold tracking-[0.4em] text-canvas/45">
          {current.commission ? "COMMISSION" : "ORIGINAL WORK"}
        </p>

        <h2 className="mt-4 font-display text-[8vw] font-extrabold leading-[0.95] tracking-[-0.03em] text-canvas sm:text-[2.9vw]">
          {current.title}
        </h2>

        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-canvas/65">
          {current.blurb}
        </p>

        <dl className="mt-6 space-y-1.5 border-l border-canvas/15 pl-4 text-[13px] text-canvas/55">
          <div className="flex gap-2">
            <dt className="sr-only">Medium</dt>
            <dd>{current.medium}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Dimensions</dt>
            <dd>{current.dimensions}</dd>
          </div>
        </dl>

        <p className="mt-6 font-script text-3xl text-canvas sm:text-4xl">
          {current.sold ? "Sold" : current.price}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={enquireLink(current)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-canvas/35 px-7 py-3.5 font-display text-[11px] font-bold tracking-[0.16em] text-canvas transition-colors duration-300 hover:bg-canvas hover:text-ink"
          >
            {current.commission ? "ENQUIRE ABOUT A MURAL" : "ENQUIRE"}
          </a>

          {!current.sold && !current.commission && (
            <a
              href={buyLink(current)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-canvas px-7 py-3.5 font-display text-[11px] font-bold tracking-[0.16em] text-ink shadow-lg transition-transform duration-300 hover:scale-[1.04]"
            >
              BUY ON WHATSAPP →
            </a>
          )}
        </div>
      </div>

      {/* Rail — always begins with the selected piece */}
      <div
        ref={railRef}
        className="absolute inset-x-0 bottom-[13%] z-30 flex items-end gap-3 overflow-visible px-6 sm:bottom-auto sm:top-1/2 sm:left-[44%] sm:right-0 sm:-translate-y-1/2 sm:gap-4 sm:px-0"
      >
        {ordered.map((art, k) => {
          const realIndex = artworks.findIndex((a) => a.id === art.id);
          const isActive = k === 0;
          return (
            <button
              key={art.id}
              ref={(el) => {
                if (el) cardNodes.current.set(art.id, el);
                else cardNodes.current.delete(art.id);
              }}
              data-flip-id={art.id}
              type="button"
              onClick={() => goTo(realIndex)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${art.title}${isActive ? " (currently viewing)" : ""}`}
              className={`group relative shrink-0 overflow-hidden rounded-2xl transition-shadow duration-300 ${
                isActive
                  ? "h-[26vh] w-[30vw] shadow-2xl ring-2 ring-canvas sm:h-[52vh] sm:w-[17vw]"
                  : "h-[20vh] w-[24vw] opacity-70 ring-1 ring-white/15 hover:opacity-100 sm:h-[40vh] sm:w-[13vw]"
              }`}
            >
              <Image
                src={art.src}
                alt={art.alt}
                fill
                sizes="(max-width: 767px) 30vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 text-left font-display text-[10px] font-bold leading-tight tracking-[0.08em] text-white"
              >
                {art.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-4 sm:justify-start sm:pl-[6.5%]">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous artwork"
          className="grid h-11 w-11 place-items-center rounded-full border border-canvas/25 text-canvas transition-colors hover:bg-canvas hover:text-ink"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next artwork"
          className="grid h-11 w-11 place-items-center rounded-full border border-canvas/25 text-canvas transition-colors hover:bg-canvas hover:text-ink"
        >
          <span aria-hidden="true">→</span>
        </button>
        <span className="font-display text-[11px] font-bold tabular-nums tracking-[0.2em] text-canvas/45">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <p aria-live="polite" className="sr-only">
        {`Showing ${current.title}, ${current.price}`}
      </p>
    </section>
  );
}
