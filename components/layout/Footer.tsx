import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { brandLogo } from "@/lib/heroContent";
import { WHATSAPP_DISPLAY, generalChatLink } from "@/lib/whatsapp";

/**
 * Site footer. Server component — it has no interactivity, so there is no
 * reason to ship it to the client.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-canvas-deep">
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src={brandLogo}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-display text-base font-extrabold tracking-[0.14em] text-ink">
                {siteConfig.name.toUpperCase()}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink/60">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-[10px] font-bold tracking-[0.28em] text-ink/40">
              EXPLORE
            </h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-ink/70 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-[10px] font-bold tracking-[0.28em] text-ink/40">
              GET IN TOUCH
            </h2>
            <p className="mt-4 text-[14px] text-ink/70">
              {siteConfig.city}, {siteConfig.region}
            </p>
            <a
              href={generalChatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[14px] text-ink/70 transition-colors hover:text-ink"
            >
              {WHATSAPP_DISPLAY}
            </a>
            <a
              href={generalChatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-5 w-full sm:w-auto"
            >
              CHAT ON WHATSAPP
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-ink/45">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-ink/45">
            Painting experiences across {siteConfig.city}.
          </p>
        </div>
      </div>
    </footer>
  );
}
