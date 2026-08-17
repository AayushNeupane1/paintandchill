"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { brandLogo } from "@/lib/heroContent";
import { siteConfig } from "@/lib/siteConfig";
import { generalChatLink } from "@/lib/whatsapp";

/**
 * Site navigation.
 *
 * Fixed rather than absolute, so it is reachable from anywhere on the page —
 * previously it scrolled away with the hero and there was no way back to it.
 *
 * It starts transparent over the ivory hero and fades in a frosted background
 * once you scroll, which keeps it legible when it passes over the hero's
 * full-bleed finale photograph.
 *
 * Below 1024px there is a real menu. The previous version hid the link list
 * entirely at that width, which meant phones and tablets had no navigation at
 * all.
 */

/** Routes come from siteConfig so nav, footer and sitemap can never drift. */
const links = siteConfig.nav;

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /**
   * The gallery is a dark page, so an ink-coloured bar would disappear into
   * it. Rather than a prop threaded down from every page, the nav reads the
   * route it is on and picks its own tone.
   */
  const onDark = pathname?.startsWith("/gallery") ?? false;

  // Frosted background once we leave the very top.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Close the menu on Escape, and stop the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? onDark
            ? "border-b border-white/10 bg-[#0b0a0a]/80 backdrop-blur-md"
            : "border-b border-ink/10 bg-canvas/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 sm:px-8 ${
          onDark ? "text-canvas" : "text-ink"
        }`}
      >
        <Link href="/" onClick={close} className="flex shrink-0 items-center gap-2">
          <Image
            src={brandLogo}
            alt="Paint & Chill logo"
            width={34}
            height={34}
            className="rounded-full"
            priority
          />
          <span className="font-display text-sm font-extrabold tracking-[0.16em]">
            {siteConfig.name.toUpperCase()}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 font-display text-[11px] font-bold uppercase tracking-[0.16em] lg:flex">
          {links.map((l) => {
            const isActive = pathname?.startsWith(l.href) ?? false;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link transition-opacity hover:opacity-100 ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={generalChatLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Paint & Chill on WhatsApp"
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 font-display text-[11px] font-bold tracking-[0.16em] transition-colors duration-300 sm:px-4 ${
              onDark
                ? "border-canvas/30 hover:bg-canvas hover:text-ink"
                : "border-ink/25 hover:bg-ink hover:text-canvas"
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
            <span className="hidden sm:inline">WHATSAPP</span>
          </a>

          <Link
            href="/sessions"
            className={`hidden rounded-full px-5 py-2.5 font-display text-[11px] font-bold tracking-[0.16em] transition-transform duration-300 hover:-translate-y-0.5 sm:inline-block sm:px-6 ${
              onDark ? "bg-canvas text-ink" : "bg-ink text-canvas"
            }`}
          >
            BOOK A SESSION
          </Link>

          {/* Menu toggle — the whole reason navigation was impossible on phones */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden ${
              onDark
                ? "border-canvas/30 hover:bg-canvas hover:text-ink"
                : "border-ink/25 hover:bg-ink hover:text-canvas"
            }`}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-[1.5px] w-4 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile panel — below 1024px this is the only navigation there is. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={`px-5 pb-8 pt-4 sm:px-8 lg:hidden ${
          onDark ? "border-t border-white/10 bg-[#0b0a0a]" : "border-t border-ink/10 bg-canvas"
        }`}
      >
        <ul className="flex flex-col">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={close}
                className={`block py-4 font-display text-lg font-extrabold tracking-[-0.01em] ${
                  onDark ? "border-b border-white/10 text-canvas" : "border-b border-ink/10 text-ink"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/sessions" onClick={close} className="btn btn-primary w-full">
            BOOK A SESSION
          </Link>
          <a
            href={generalChatLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full"
          >
            CHAT ON WHATSAPP
          </a>
        </div>
      </div>

    </header>
  );
}
