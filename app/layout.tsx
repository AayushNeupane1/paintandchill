import type { Metadata, Viewport } from "next";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/kaushan-script/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/hero/CustomCursor";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    // Every child page supplies only its own name; the brand is appended here.
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "painting experiences Melbourne",
    "art sessions Melbourne",
    "painting classes Melbourne",
    "private painting events",
    "aged care art activities",
    "corporate team painting",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f8f5ed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.lang} className="h-full antialiased">
      <head>
        {/* If JS never runs, the scroll timeline can't reveal anything —
            show the photographs statically rather than a blank canvas. */}
        <noscript>
          <style>{`.hero-reveal{opacity:1}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        {/* Keyboard users land here first and can jump the whole nav. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-display focus:text-[11px] focus:font-bold focus:tracking-[0.16em] focus:text-canvas"
        >
          SKIP TO CONTENT
        </a>

        <CustomCursor />
        <SiteNav />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
