"use client";

import Image from "next/image";
import Link from "next/link";
import { brandLogo, heroCopy } from "@/lib/heroContent";
import { generalChatLink } from "@/lib/whatsapp";

const links = [
  { label: "SESSIONS", href: "#sessions" },
  { label: "EXPERIENCES", href: "#experiences" },
  { label: "OUR STORY", href: "#our-story" },
];

export default function HeroNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav
        aria-label="Primary"
        className="flex items-center justify-between gap-4 px-5 py-5 text-ink sm:px-8 sm:py-6"
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
          <span className="font-display text-sm font-extrabold tracking-[0.16em]">
            {heroCopy.eyebrow}
          </span>
        </a>

        <ul className="hidden items-center gap-8 font-display text-[11px] font-bold tracking-[0.16em] lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="nav-link opacity-80 transition-opacity hover:opacity-100"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/gallery"
              className="nav-link inline-flex items-center gap-1 opacity-80 transition-opacity hover:opacity-100"
            >
              ARTISTS <span aria-hidden="true">↗</span>
            </Link>
          </li>
          <li>
            <a
              href="#contact"
              className="nav-link opacity-80 transition-opacity hover:opacity-100"
            >
              CONTACT
            </a>
          </li>
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Plain wa.me link — opens the app on mobile, WhatsApp Web on
              desktop. Kept outside the hidden nav list so it is reachable
              at every breakpoint. */}
          <a
            href={generalChatLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Paint & Chill on WhatsApp"
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-3 py-2 font-display text-[11px] font-bold tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-canvas sm:px-4"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
            <span className="hidden sm:inline">WHATSAPP</span>
          </a>

          <a
            href="#sessions"
            className="rounded-full bg-ink px-5 py-2.5 font-display text-[11px] font-bold tracking-[0.16em] text-canvas transition-transform duration-300 hover:-translate-y-0.5 sm:px-6"
          >
            BOOK A SESSION
          </a>
        </div>
      </nav>
    </header>
  );
}
