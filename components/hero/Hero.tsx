"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrushImage from "./BrushImage";
import HeroNav from "./HeroNav";
import { ctaBandMask, heroCopy, heroImages } from "@/lib/heroContent";

gsap.registerPlugin(ScrollTrigger);

// Asymmetric scatter layout. Only left/top/width are set here — each box's
// HEIGHT comes from its mask's aspect ratio (applied in BrushImage), so the
// painted shape and the photo always line up.
// Values are viewport-relative, so one table serves every breakpoint; on
// small screens most entries simply stay hidden (see `activeIndexes` below),
// and all rotation is owned by GSAP.
const positions: React.CSSProperties[] = [
  { left: "5%", top: "14%", width: "24vw", maxWidth: "330px" },
  { left: "69%", top: "9%", width: "18vw", maxWidth: "240px" },
  { left: "3%", top: "52%", width: "27vw", maxWidth: "380px" },
  { left: "73%", top: "54%", width: "19vw", maxWidth: "260px" },
  { left: "39%", top: "58%", width: "23vw", maxWidth: "310px" },
  { left: "36%", top: "8%", width: "26vw", maxWidth: "350px" },
];

// entrance offsets each image travels FROM before settling into its resting
// spot — this is what makes the reveal feel choreographed rather than random.
const entrance = [
  { x: -60, y: 20, scale: 0.8, rotate: -14 },
  { x: 50, y: -30, scale: 1.2, rotate: 12 },
  { x: -40, y: 50, scale: 0.85, rotate: -10 },
  { x: 45, y: 40, scale: 1.15, rotate: 16 },
  { x: 0, y: 60, scale: 0.9, rotate: -12 },
  { x: 10, y: -40, scale: 0.82, rotate: 8 },
];

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const headlineRef = useRef<HTMLDivElement>(null);
  const headlineLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const finaleRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const finalePhotoRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const bandPaintRef = useRef<HTMLDivElement>(null);
  const bandCtaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // DOM nodes are collected via callback refs (never read during render).
  const containerNodes = useRef<(HTMLDivElement | null)[]>(
    heroImages.map(() => null)
  );
  const strokeNodes = useRef<(HTMLDivElement | null)[]>(
    heroImages.map(() => null)
  );
  const photoNodes = useRef<(HTMLDivElement | null)[]>(
    heroImages.map(() => null)
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          if (reduced) {
            // Static, accessible fallback: everything simply visible, no
            // pin, no scroll-linked motion. Collapse the tall scroll driver.
            if (wrapperRef.current) wrapperRef.current.style.height = "auto";
            if (stickyRef.current) stickyRef.current.style.position = "relative";
            gsap.set(
              containerNodes.current,
              { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
            );
            gsap.set(strokeNodes.current, { opacity: 0.45 });
            gsap.set(photoNodes.current, { opacity: 1 });
            // display:none (not just opacity) so these never trap keyboard
            // focus or get announced while they're unreachable.
            gsap.set(
              [finalePhotoRef.current, filmRef.current, finaleRef.current, bandRef.current],
              { display: "none" }
            );
            return;
          }

          const isDesktop = !!context.conditions?.isDesktop;
          const activeIndexes = isDesktop
            ? [0, 1, 2, 3, 4, 5]
            : [0, 4, 5]; // simplified mobile stack

          // --- initial (hidden) states for the animated experience ---
          gsap.set(containerNodes.current, {
            opacity: 0,
          });
          activeIndexes.forEach((i) => {
            const e = entrance[i];
            gsap.set(containerNodes.current[i], {
              x: e.x * (isDesktop ? 4 : 2),
              y: e.y * (isDesktop ? 3 : 2),
              scale: e.scale,
              rotate: e.rotate,
            });
          });
          gsap.set(strokeNodes.current, { opacity: 0 });
          gsap.set(photoNodes.current, {
            opacity: 0,
            scale: 1.08,
          });
          gsap.set(finalePhotoRef.current, { opacity: 0 });
          gsap.set(finaleRef.current, { opacity: 0, y: 40 });
          gsap.set(filmRef.current, { opacity: 0 });
          gsap.set(bandRef.current, { opacity: 0 });
          gsap.set(bandPaintRef.current, { xPercent: -104 });
          gsap.set(bandCtaRef.current, { opacity: 0, y: 18 });

          // gentle on-load entrance for the stage-1 headline (not scroll bound)
          gsap.fromTo(
            headlineLineRefs.current,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              delay: 0.15,
            }
          );

          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

          // ---- Stage 1 -> 2: first brush stroke -----------------------
          tl.addLabel("stage2", 1.0);
          tl.to(
            scrollCueRef.current,
            { opacity: 0, duration: 0.3 },
            "stage2"
          );
          const first = activeIndexes[0];
          tl.to(
            containerNodes.current[first],
            { opacity: 1, x: 0, y: 0, rotate: -6, duration: 1.1 },
            "stage2"
          );
          tl.to(
            strokeNodes.current[first],
            { opacity: 0.55, duration: 0.7 },
            "stage2"
          );
          tl.to(
            photoNodes.current[first],
            { opacity: 1, scale: 1, duration: 0.9 },
            "stage2+=0.3"
          );

          // ---- Stage 3: more paint, more memories ----------------------
          tl.addLabel("stage3", 2.1);
          const rest = activeIndexes.slice(1, isDesktop ? 5 : 2);
          rest.forEach((i, order) => {
            const start = `stage3+=${order * 0.55}`;
            tl.to(
              containerNodes.current[i],
              { opacity: 1, x: 0, y: 0, rotate: entrance[i].rotate > 0 ? 4 : -4, duration: 1 },
              start
            );
            tl.to(
              strokeNodes.current[i],
              { opacity: 0.5, duration: 0.6 },
              start
            );
            tl.to(
              photoNodes.current[i],
              { opacity: 1, scale: 1, duration: 0.8 },
              `${start}+=0.25`
            );
          });

          // headline recedes as the canvas fills with memories
          tl.to(
            headlineRef.current,
            { opacity: 0, y: -30, scale: 0.94, duration: 1 },
            "stage3+=1.4"
          );

          // ---- Stage 4: the painting becomes a real experience ---------
          tl.addLabel("stage4", 4.6);
          const finaleIdx = heroImages.length - 1;
          // everything except the finale piece dissolves away
          activeIndexes
            .filter((i) => i !== finaleIdx)
            .forEach((i, order) => {
              tl.to(
                containerNodes.current[i],
                {
                  opacity: 0,
                  scale: 0.9,
                  y: "-=40",
                  duration: 0.9,
                  ease: "power1.in",
                },
                `stage4+=${order * 0.08}`
              );
            });

          tl.to(
            containerNodes.current[finaleIdx],
            { scale: 1.05, duration: 1.4, ease: "power2.inOut" },
            "stage4"
          );
          tl.to(
            filmRef.current,
            { opacity: 0.9, duration: 1.4 },
            "stage4"
          );
          tl.to(
            finalePhotoRef.current,
            { opacity: 1, duration: 1.3, ease: "power2.inOut" },
            "stage4+=0.3"
          );
          tl.to(
            containerNodes.current[finaleIdx],
            { opacity: 0, duration: 0.6 },
            "stage4+=1.1"
          );
          tl.to(
            finaleRef.current,
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "stage4+=0.9"
          );

          // ---- Stage 5: resolution ---------------------------------------
          // The closing paint stroke is now the CTA plinth: one vibrant band
          // sweeps across and the two buttons land on top of it. Paint is
          // still what carries the eye out of the hero — it just does a job
          // now instead of drawing a black curtain over the photograph.
          tl.addLabel("stage5", 6.6);
          tl.to(
            finalePhotoRef.current,
            { scale: 1, duration: 1.6, ease: "power1.out" },
            "stage5"
          );
          tl.to(bandRef.current, { opacity: 1, duration: 0.2 }, "stage5");
          tl.to(
            bandPaintRef.current,
            { xPercent: 0, duration: 1.3, ease: "power2.out" },
            "stage5"
          );
          tl.to(
            bandCtaRef.current,
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "stage5+=0.6"
          );

          // slow drift on the final photograph so the pinned tail isn't dead
          tl.to(
            finalePhotoRef.current,
            { scale: 1.05, duration: 2.2, ease: "none" },
            "stage5+=1.6"
          );

          ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            animation: tl,
            // pin handled via CSS position:sticky on stickyRef, not GSAP,
            // per the technical brief — ScrollTrigger only drives progress.
          });

          return () => {
            tl.kill();
          };
        }
      );

      return () => mm.revert();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <HeroNav />
      <section
        id="top"
        ref={wrapperRef}
        className="relative"
        style={{ height: "600vh" }}
        aria-label="Paint & Chill hero"
      >
        <div
          ref={stickyRef}
          className="sticky top-0 h-svh w-full overflow-hidden bg-canvas"
        >
          <div className="canvas-texture" aria-hidden="true" />

          {/* faint static paint accents for the initial blank-canvas feel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 top-1/3 h-40 w-40 rounded-full bg-yellow/15 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-24 h-56 w-56 rounded-full bg-coral/10 blur-3xl"
          />

          {/* finale full-bleed photograph (crossfades in behind the finale copy) */}
          <div
            ref={finalePhotoRef}
            className="hero-hidden absolute inset-0 overflow-hidden"
            style={{ transform: "scale(1.12)" }}
          >
            <Image
              src={heroImages[heroImages.length - 1].src}
              alt={heroImages[heroImages.length - 1].alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* dark film for legibility once the finale photo is in */}
          <div
            ref={filmRef}
            aria-hidden="true"
            className="hero-hidden pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 to-ink/10"
          />

          {/* scattered brush-revealed photographs */}
          <div className="absolute inset-0 z-10">
            {heroImages.map((image, i) => (
              <BrushImage
                key={image.id}
                image={image}
                refs={{
                  container: (el) => {
                    containerNodes.current[i] = el;
                  },
                  stroke: (el) => {
                    strokeNodes.current[i] = el;
                  },
                  photo: (el) => {
                    photoNodes.current[i] = el;
                  },
                }}
                position={positions[i]}
                sizes="(max-width: 1023px) 55vw, 30vw"
                priority={i === 0}
              />
            ))}
          </div>

          {/* Stage 1 — blank canvas copy */}
          <div
            ref={headlineRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="font-display text-[10px] font-bold tracking-[0.42em] text-ink/55 sm:text-[11px]">
              {heroCopy.eyebrow}
            </p>
            {/* Mixed type: modern grotesk for the hard words, the logo's own
                brush script (gradient-filled) for the soft one. */}
            <h1 className="mt-5 text-[16vw] sm:text-[11vw] lg:text-[6.8vw]">
              <span
                ref={(el) => {
                  headlineLineRefs.current[0] = el;
                }}
                className="block font-display font-extrabold leading-[0.84] tracking-[-0.03em]"
              >
                PAINT.
              </span>
              {/* `w-fit` matters: background-clip:text paints across the
                  element's box, so the span has to hug the word or the
                  gradient stretches across the full line and only the middle
                  colours show. */}
              <span
                ref={(el) => {
                  headlineLineRefs.current[1] = el;
                }}
                className="paint-text mx-auto block w-fit font-script text-[1.02em] font-normal leading-[1.02]"
              >
                Chill.
              </span>
              <span
                ref={(el) => {
                  headlineLineRefs.current[2] = el;
                }}
                className="block font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
              >
                CREATE.
              </span>
            </h1>
            <p className="mt-7 max-w-[19rem] text-[15px] leading-relaxed text-ink/65 sm:max-w-md sm:text-base">
              {heroCopy.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#sessions"
                className="btn btn-primary"
              >
                {heroCopy.ctaPrimary}
              </a>
              <a
                href="#sessions"
                className="btn btn-secondary"
              >
                {heroCopy.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Stage 4/5 — finale copy */}
          <div
            ref={finaleRef}
className="hero-hidden absolute inset-x-0 bottom-[30%] z-30 flex flex-col items-center px-6 text-center sm:bottom-[28%]"
          >
            <h2 className="leading-[0.95] text-canvas">
              <span className="block font-display text-[9vw] font-extrabold tracking-[-0.03em] sm:text-[5.4vw] lg:text-[3.8vw]">
                COME PAINT
              </span>
              <span className="block font-script text-[11vw] leading-[1.05] text-canvas sm:text-[6.4vw] lg:text-[4.6vw]">
                with us.
              </span>
            </h2>
            <p className="mt-4 text-sm text-canvas/80 sm:text-base">
              {heroCopy.finaleSub}
            </p>
          </div>

          {/* Closing paint stroke — vibrant brand gradient, and the surface
              the two CTAs sit on. Only the paint layer sweeps; the buttons
              fade up separately so they never stretch with it. */}
          <div
            ref={bandRef}
            className="hero-hidden absolute inset-x-0 bottom-[6%] z-40 flex min-h-[132px] items-center justify-center px-5 py-6 sm:min-h-[150px]"
          >
            <div
              ref={bandPaintRef}
              aria-hidden="true"
              className="absolute inset-0 will-change-transform"
              style={{
                background: "var(--paint-gradient)",
                WebkitMaskImage: `url(${ctaBandMask})`,
                maskImage: `url(${ctaBandMask})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            />
            <div
              ref={bandCtaRef}
              className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              <a
                href="#sessions"
                className="btn btn-light"
              >
                {heroCopy.ctaPrimary} →
              </a>
              <a
                href="#sessions"
                className="btn btn-outline-light"
              >
                {heroCopy.ctaSecondary}
              </a>
            </div>
          </div>

          {/* scroll cue */}
          <div
            ref={scrollCueRef}
            className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 font-display text-[9px] font-bold tracking-[0.38em] text-ink/40"
          >
            <span>SCROLL</span>
            <span className="h-8 w-px animate-pulse bg-ink/30" />
          </div>
        </div>
      </section>
    </>
  );
}
