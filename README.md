# Paint & Chill

Marketing site for Paint & Chill — creative painting experiences, art sessions
and private painting events in Melbourne.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — configured in CSS (`app/globals.css`), no `tailwind.config.js`
- **GSAP + ScrollTrigger + Flip** — hero scroll timeline and gallery transitions
- Self-hosted fonts via `@fontsource` (no runtime call to Google Fonts)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint, zero warnings allowed
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, sessions, story |
| `/sessions` | The three session formats in full |
| `/gallery` | Artwork gallery, enquire/buy over WhatsApp |
| `/story` | Founder story and studio video |
| `/contact` | WhatsApp-first contact page |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Generated from `lib/siteConfig.ts` |

## Where the content lives

All copy and data is separated from the components. To change the site's
words, images or offerings you should not need to touch a component.

| File | Controls |
|---|---|
| `lib/siteConfig.ts` | Business name, domain, navigation, SEO defaults |
| `lib/heroContent.ts` | Hero copy, photographs, brush masks |
| `lib/sessionsContent.ts` | The three sessions: copy, inclusions, pricing buckets |
| `lib/galleryContent.ts` | Artworks: titles, media, prices |
| `lib/storyContent.ts` | Our Story copy and video |
| `lib/whatsapp.ts` | WhatsApp number and message builders |

## Before you deploy

1. **Set the domain.** `siteConfig.url` drives canonical URLs and the sitemap.
   Either edit it or set `NEXT_PUBLIC_SITE_URL` in the Vercel dashboard.
2. **Check the session copy.** Durations, inclusions and the insurance wording
   in `lib/sessionsContent.ts` are drafts and need verifying.
3. **Check artwork titles and prices** in `lib/galleryContent.ts`.

## Deploying to Vercel

Import the repository, accept the detected Next.js defaults, and set
`NEXT_PUBLIC_SITE_URL` to the production domain. No other configuration
is required — images, fonts and the story video are all served from `public/`.

## Conventions

- Content is data, components are presentation. New content goes in `lib/`.
- Components are server components unless they need state, effects or
  browser APIs — those carry `"use client"`.
- Buttons and nav links use the shared `.btn` / `.nav-link` classes in
  `globals.css` rather than per-instance utility strings, so styling cannot
  drift between sections.
- Animation respects `prefers-reduced-motion` throughout; the reduced path is
  a genuine static alternative, not a faster animation.
