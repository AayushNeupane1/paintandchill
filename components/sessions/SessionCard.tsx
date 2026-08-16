"use client";

import { useState } from "react";
import Image from "next/image";
import { sessionEnquiryLink, type SessionOption } from "@/lib/sessionsContent";

/**
 * One session offering.
 *
 * Colour strategy: the full-brightness brand colour is used for FILLS only
 * (the top bar, the chip, the bullet dots) where contrast rules don't bite.
 * Anything that is TEXT uses the darkened `accentInk` variant, because
 * #FA881A orange on ivory is roughly 2.3:1 and unreadable.
 *
 * The group-size selector is the conversion mechanic: pricing scales with
 * numbers, so instead of a dead "contact us" the visitor makes one choice and
 * it travels into the WhatsApp message, letting Paint & Chill quote straight
 * away.
 */
export default function SessionCard({
  session,
  index,
}: {
  session: SessionOption;
  index: number;
}) {
  const [group, setGroup] = useState(session.groupOptions[0]);
  const flip = index % 2 === 1;

  return (
    <article className="session-card group relative overflow-hidden rounded-[28px] bg-[#FFFCF6] shadow-[0_2px_40px_-12px_rgba(22,19,17,0.14)] ring-1 ring-ink/[0.07]">
      {/* vibrant paint bar — this is what carries the colour */}
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{ background: session.accent }}
      />

      <div
        className={`grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] ${
          flip ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Photograph */}
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
          <Image
            src={session.image}
            alt={session.imageAlt}
            fill
            sizes="(max-width: 1023px) 100vw, 42vw"
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
          <span
            className="absolute left-5 top-5 rounded-full px-3.5 py-1.5 font-display text-[10px] font-bold tracking-[0.18em] text-white shadow-sm"
            style={{ background: session.accentInk }}
          >
            {session.kind.toUpperCase()}
          </span>
        </div>

        {/* Detail */}
        <div className="flex flex-col p-6 sm:p-9 lg:p-11">
          <h3
            className="font-display text-[9vw] font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-4xl lg:text-[2.8rem]"
            style={{ color: session.accentInk }}
          >
            {session.name}
          </h3>
          <p className="mt-2 font-script text-2xl text-ink/75 sm:text-[1.7rem]">
            {session.tagline}
          </p>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
            {session.description}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink/10 py-5 sm:grid-cols-4">
            {[
              ["Duration", session.duration],
              ["Group size", session.groupSize],
              ["Where", session.location],
              ["Best for", session.forWho],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-display text-[9px] font-bold tracking-[0.2em] text-ink/40">
                  {label.toUpperCase()}
                </dt>
                <dd className="mt-1.5 text-[13px] leading-snug text-ink/80">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 font-display text-[9px] font-bold tracking-[0.2em] text-ink/40">
            EVERYTHING INCLUDED
          </p>
          <ul className="mt-3 grid gap-2">
            {session.includes.map((item) => (
              <li key={item} className="flex gap-3 text-[13.5px] leading-snug text-ink/70">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: session.accent }}
                />
                {item}
              </li>
            ))}
          </ul>

          <p
            className="mt-5 rounded-xl px-4 py-3 text-[13px] leading-snug text-ink/75"
            style={{ background: `color-mix(in oklab, ${session.accent} 12%, transparent)` }}
          >
            {session.reassurance}
          </p>

          <div className="mt-7">
            <p className="font-display text-[9px] font-bold tracking-[0.2em] text-ink/40">
              HOW MANY IN YOUR GROUP?
            </p>
            <div
              role="radiogroup"
              aria-label={`Group size for ${session.name}`}
              className="mt-3 flex flex-wrap gap-2"
            >
              {session.groupOptions.map((opt) => {
                const selected = opt === group;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setGroup(opt)}
                    className={`rounded-full border px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
                      selected
                        ? "border-transparent text-white"
                        : "border-ink/20 text-ink/65 hover:border-ink/50 hover:text-ink"
                    }`}
                    style={selected ? { background: session.accentInk } : undefined}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={sessionEnquiryLink(session, group)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-white"
              style={{ background: session.accentInk }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
              </svg>
              GET A QUOTE ON WHATSAPP
            </a>
            <p className="text-[12px] leading-snug text-ink/45">
              Pricing scales with group size.
              <br className="hidden sm:block" /> Same-day reply, no obligation.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
