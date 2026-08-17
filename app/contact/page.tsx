import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { WHATSAPP_DISPLAY, generalChatLink, waLink } from "@/lib/whatsapp";
import { sessions } from "@/lib/sessionsContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Paint & Chill in Melbourne. Message us on WhatsApp for pricing, dates and availability — we reply the same day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description: "Message Paint & Chill on WhatsApp for pricing and dates.",
    url: `${siteConfig.url}/contact`,
  },
};

/**
 * There is deliberately no contact form here. Enquiries are handled on
 * WhatsApp, and a form would need a backend, spam handling and an inbox
 * nobody is watching. Sending people straight to the channel that is actually
 * monitored converts better and is honest about how the business runs.
 */
export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-canvas pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-pc-pink/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-pc-blue/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <p className="font-display text-[10px] font-bold tracking-[0.42em] text-ink/45">
          CONTACT
        </p>

        <h1 className="mt-5 max-w-3xl text-ink">
          <span className="block font-display text-[11vw] font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-[4vw]">
            Tell us who&apos;s
          </span>
          <span className="paint-text block w-fit font-script text-[13vw] leading-[1.05] sm:text-[4.8vw]">
            painting.
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-ink/65">
          The fastest way to reach us is WhatsApp. Send your group size and a
          rough date and we&apos;ll come back with pricing and availability the
          same day.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={generalChatLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            MESSAGE US ON WHATSAPP
          </a>
          <span className="text-[14px] text-ink/55">{WHATSAPP_DISPLAY}</span>
        </div>

        {/* Straight into the right conversation, per session type. */}
        <h2 className="mt-16 font-display text-[10px] font-bold tracking-[0.28em] text-ink/40">
          OR START WITH A SPECIFIC SESSION
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <a
                href={waLink(
                  `Hi ${siteConfig.name}! I'd like to ask about "${s.name}" (${s.kind}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl bg-[#FFFCF6] p-6 ring-1 ring-ink/[0.07] transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="block h-1 w-10 rounded-full"
                  style={{ background: s.accent }}
                />
                <span
                  className="mt-4 block font-display text-xl font-extrabold tracking-[-0.02em]"
                  style={{ color: s.accentInk }}
                >
                  {s.name}
                </span>
                <span className="mt-1 block text-[13px] text-ink/55">{s.kind}</span>
                <span className="mt-3 block text-[13px] text-ink/70">{s.tagline}</span>
              </a>
            </li>
          ))}
        </ul>

        <dl className="mt-16 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-3">
          <div>
            <dt className="font-display text-[10px] font-bold tracking-[0.28em] text-ink/40">
              WHERE WE WORK
            </dt>
            <dd className="mt-2 text-[15px] text-ink/75">
              {siteConfig.city} and surrounds, {siteConfig.region}. We travel to you.
            </dd>
          </div>
          <div>
            <dt className="font-display text-[10px] font-bold tracking-[0.28em] text-ink/40">
              RESPONSE TIME
            </dt>
            <dd className="mt-2 text-[15px] text-ink/75">
              Same day, most days. No obligation to book.
            </dd>
          </div>
          <div>
            <dt className="font-display text-[10px] font-bold tracking-[0.28em] text-ink/40">
              WHAT TO INCLUDE
            </dt>
            <dd className="mt-2 text-[15px] text-ink/75">
              Group size, rough date, and where you&apos;d like us.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
