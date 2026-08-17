"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SessionCard from "./SessionCard";
import { sessions, sessionsCopy } from "@/lib/sessionsContent";
import { tornEdgeMask } from "@/lib/heroContent";

gsap.registerPlugin(ScrollTrigger);

/**
 * Renders as a section of the landing page (h2) or as the whole /sessions
 * page (h1). A page must have exactly one h1, and a landing page already
 * spends its h1 on the hero — so the level has to be caller-controlled
 * rather than hard-coded.
 */
export default function Sessions({ as = "h2" }: { as?: "h1" | "h2" }) {
  const Heading = as;

  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".session-card").forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 48,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          });
        });
      });
      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sessions"
      ref={rootRef}
      className="relative overflow-hidden bg-canvas pb-24 pt-28 sm:pb-32 sm:pt-36"
      aria-label="Painting sessions"
    >
      {/* Paint carries the eye in from the hero above. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-14 sm:h-20"
        style={{
          background: "var(--paint-gradient)",
          // sits on ivory now, so it reads as a paint stroke divider rather
          // than the leading edge of a dark slab

          WebkitMaskImage: `url(${tornEdgeMask})`,
          maskImage: `url(${tornEdgeMask})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />

      {/* soft paint blooms — colour without a heavy background */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-pc-pink/10 blur-[110px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-1/2 h-[28rem] w-[28rem] rounded-full bg-pc-blue/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <header className="max-w-2xl">
          <p className="font-display text-[10px] font-bold tracking-[0.42em] text-ink/45">
            {sessionsCopy.eyebrow}
          </p>
          <Heading className="mt-5 text-ink">
            <span className="block font-display text-[10vw] font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-[3.6vw]">
              {sessionsCopy.titleLead}
            </span>
            <span className="paint-text block w-fit font-script text-[12vw] leading-[1.05] sm:text-[4.2vw]">
              {sessionsCopy.titleScript}
            </span>
          </Heading>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/65 sm:text-base">
            {sessionsCopy.intro}
          </p>
        </header>

        {/* How it works */}
        <ol className="mt-12 grid gap-5 border-y border-ink/10 py-7 sm:grid-cols-3 sm:gap-8">
          {sessionsCopy.steps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="paint-text font-script text-3xl leading-none">
                {s.n}
              </span>
              <span>
                <span className="block font-display text-[12px] font-bold tracking-[0.1em] text-ink">
                  {s.t}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-ink/55">
                  {s.d}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-7 sm:mt-16">
          {sessions.map((session, i) => (
            <SessionCard key={session.id} session={session} index={i} />
          ))}
        </div>

        <p className="mt-12 text-center text-[14px] text-ink/55">
          Something else in mind — a school, a festival, a market stall?{" "}
          <a
            href="#sessions"
            className="font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
          >
            Message us anyway
          </a>{" "}
          and we&apos;ll build something for it.
        </p>
      </div>
    </section>
  );
}
