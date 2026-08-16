import type { Metadata } from "next";
// Type system, three roles:
//   Syne          — modern display face. Headlines, nav, buttons.
//   Kaushan Script— brush script matched to the logo lettering. Accents only.
//   Inter         — body and UI text.
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/kaushan-script/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paint & Chill — Creative Painting Experiences in Melbourne",
  description:
    "Paint & Chill hosts creative painting experiences, art sessions, painting classes and private painting events in Melbourne. Book a session and create with friends.",
  metadataBase: new URL("https://paintandchill.com.au"),
  openGraph: {
    title: "Paint & Chill — Creative Painting Experiences in Melbourne",
    description:
      "Creative painting experiences, art sessions and private events in Melbourne.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className="h-full antialiased">
      <head>
        {/* If JS never runs, the scroll timeline can't reveal anything —
            show the photographs statically rather than a blank canvas. */}
        <noscript>
          <style>{`.hero-reveal{opacity:1}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
