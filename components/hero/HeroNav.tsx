"use client";

import Image from "next/image";
import { brandLogo, heroCopy } from "@/lib/heroContent";

const links = [
  { label: "SESSIONS", href: "#sessions" },
  { label: "EXPERIENCES", href: "#experiences" },
  { label: "OUR STORY", href: "#our-story" },
];

export default function HeroNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 mix-blend-difference">
      <nav
        aria-label="Primary"
        className="flex items-center justify-between gap-4 px-5 py-5 text-canvas sm:px-8 sm:py-6"
      >
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <Image
            src={brandLogo}
            alt="Paint & Chill logo"
            width={34}
            height={34}
            className="rounded-full"
            priority
          />
          <span className="font-display text-sm font-extrabold tracking-[0.14em]">
            {heroCopy.eyebrow}
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-xs font-semibold tracking-[0.12em] lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="opacity-90 transition-opacity hover:opacity-100"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li aria-label="Artists — opens a separate portfolio site (coming soon)">
            <span className="inline-flex cursor-not-allowed items-center gap-1 opacity-60">
              ARTISTS <span aria-hidden="true">↗</span>
            </span>
          </li>
          <li>
            <a
              href="#contact"
              className="opacity-90 transition-opacity hover:opacity-100"
            >
              CONTACT
            </a>
          </li>
        </ul>

        <a
          href="#book"
          data-cursor="book"
          className="shrink-0 rounded-full border border-current px-4 py-2 text-[11px] font-bold tracking-[0.12em] transition-colors hover:bg-canvas hover:text-ink sm:px-5 sm:text-xs"
        >
          BOOK A SESSION
        </a>
      </nav>
    </header>
  );
}
