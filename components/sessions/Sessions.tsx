"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SessionCard from "./SessionCard";
import { sessions, sessionsCopy } from "@/lib/sessionsContent";
import { tornEdgeMask } from "@/lib/heroContent";

gsap.registerPlugin(ScrollTrigger);

export default function Sessions() {
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
      className="relative bg-[#0b0a0a] pb-24 pt-28 sm:pb-32 sm:pt-36"
      aria-label="Painting sessions"
    >
      {/* Paint carries the eye in from the hero above. */}
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

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <header className="max-w-2xl">
          <p className="font-display text-[10px] font-bold tracking-[0.42em] text-canvas/45">
            {sessionsCopy.eyebrow}
          </p>
          <h2 className="mt-5 text-canvas">
            <span className="block font-display text-[10vw] font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-[3.6vw]">
              {sessionsCopy.titleLead}
            </span>
            <span className="paint-text block w-fit font-script text-[12vw] leading-[1.05] sm:text-[4.2vw]">
              {sessionsCopy.titleScript}
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-canvas/60 sm:text-base">
            {sessionsCopy.intro}
          </p>
        </header>

        {/* How it works */}
        <ol className="mt-12 grid gap-5 border-y border-white/10 py-7 sm:grid-cols-3 sm:gap-8">
          {sessionsCopy.steps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="font-script text-2xl leading-none text-canvas/30">
                {s.n}
              </span>
              <span>
                <span className="block font-display text-[12px] font-bold tracking-[0.1em] text-canvas">
                  {s.t}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-canvas/55">
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

        <p className="mt-12 text-center text-[14px] text-canvas/50">
          Something else in mind — a school, a festival, a market stall?{" "}
          <a
            href="#sessions"
            className="text-canvas underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
          >
            Message us anyway
          </a>{" "}
          and we&apos;ll build something for it.
        </p>
      </div>
    </section>
  );
}
