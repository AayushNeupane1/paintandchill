# Paint & Chill — Hero Section: Full Build Walkthrough

A step-by-step record of how this project was built, from empty folder to working
hero section. No source code — this is the *procedure*, the *decisions*, and the
*reasoning*, so you can rebuild it from scratch and explain it in an interview.

---

## Table of contents

1. [Phase 0 — Reading the brief](#phase-0--reading-the-brief)
2. [Phase 1 — Stack decisions](#phase-1--stack-decisions)
3. [Phase 2 — Scaffolding the project](#phase-2--scaffolding-the-project)
4. [Phase 3 — Every dependency and why](#phase-3--every-dependency-and-why)
5. [Phase 4 — The asset pipeline](#phase-4--the-asset-pipeline)
6. [Phase 5 — Design tokens and the styling system](#phase-5--design-tokens-and-the-styling-system)
7. [Phase 6 — Component architecture](#phase-6--component-architecture)
8. [Phase 7 — The animation system](#phase-7--the-animation-system)
9. [Phase 8 — The masking technique](#phase-8--the-masking-technique)
10. [Phase 9 — Performance decisions](#phase-9--performance-decisions)
11. [Phase 10 — Accessibility](#phase-10--accessibility)
12. [Phase 11 — SEO](#phase-11--seo)
13. [Phase 12 — Responsive strategy](#phase-12--responsive-strategy)
14. [Phase 13 — Bugs hit, and how they were diagnosed](#phase-13--bugs-hit-and-how-they-were-diagnosed)
15. [Phase 14 — Verification and QA](#phase-14--verification-and-qa)
16. [Known gaps and honest limitations](#known-gaps-and-honest-limitations)
17. [Rebuild-from-scratch checklist](#rebuild-from-scratch-checklist)
18. [Interview prep — likely questions](#interview-prep--likely-questions)

---

## Phase 0 — Reading the brief

Before any tooling, the brief was broken into constraints. This matters because
almost every technical decision later traces back to one of these lines.

| Requirement from brief | Technical consequence |
|---|---|
| "Feels like entering a painting" | Rules out a normal image carousel; needs one continuous timeline |
| "Scroll-driven, pinned hero" | Needs a tall scroll container + a sticky viewport-height stage |
| "Not a generic CSS gradient stroke" | Needs real alpha-mask assets, not `linear-gradient` |
| "Production website, don't destroy performance" | Animate only `transform` + `opacity` |
| "Respect `prefers-reduced-motion`" | Needs a completely separate static code path |
| "Exactly one meaningful H1" | Semantic HTML discipline; decorative type must not fragment headings |
| "Easy to swap photography later" | All image paths in one config file, never hard-coded in components |
| "Mobile must not just shrink desktop" | Two different animation timelines, not one scaled timeline |

**Interview point:** being able to say "I turned the brief into a constraint
table before writing code" is worth more than any single technical trick.

---

## Phase 1 — Stack decisions

### What was chosen

- **Next.js (App Router)** — the brief specified it. Gives SSR/SSG, image
  optimisation, font handling, and file-based routing in one package.
- **TypeScript** — catches the class of bug where an image config entry is
  missing a field.
- **Tailwind CSS v4** — utility-first styling; v4 specifically because it moves
  configuration *into CSS* (no `tailwind.config.js`).
- **GSAP + ScrollTrigger** — the brief allowed GSAP or Motion, and preferred
  GSAP for the main scroll choreography.

### Why GSAP over CSS scroll-driven animations or Framer Motion

| Option | Verdict |
|---|---|
| Pure CSS `animation-timeline: scroll()` | Browser support still uneven; no timeline labels; hard to choreograph 5 stages |
| Framer/Motion | Great for component transitions, weaker for a single long scrubbed master timeline |
| **GSAP + ScrollTrigger** | Timeline labels, `scrub`, `matchMedia`, `context` cleanup — purpose-built for exactly this |

### Why the PERN direction still works

The user's target is PERN (PostgreSQL, Express, React, Node) but "not backend
heavy". Next.js covers React + Node (its API routes replace Express for most
cases), leaving PostgreSQL to attach later. The hero is pure frontend, so no
database work was needed at this stage — but nothing here blocks it.

---

## Phase 2 — Scaffolding the project

### Step 2.1 — Inspect before you build

The first action was **not** creating files. It was checking what already
existed in the target folder: a `.git` directory and a README, no
`package.json`, no `node_modules`. This confirmed a greenfield build rather
than an integration into an existing codebase.

> Rule: never scaffold on top of a repo you haven't inspected. You can silently
> destroy someone's work.

### Step 2.2 — Scaffold

Command used:

```
npx create-next-app@latest paintchill \
  --typescript --tailwind --eslint --app \
  --no-src-dir --import-alias "@/*" --use-npm
```

Flag-by-flag:

| Flag | Effect |
|---|---|
| `--typescript` | TS config + `.tsx` files |
| `--tailwind` | Installs Tailwind v4 and wires PostCSS |
| `--eslint` | Adds `eslint-config-next` |
| `--app` | App Router (not the legacy Pages Router) |
| `--no-src-dir` | Keeps `app/` at the repo root instead of `src/app/` |
| `--import-alias "@/*"` | Lets you import `@/lib/heroContent` instead of `../../lib/...` |
| `--use-npm` | Forces npm rather than pnpm/yarn detection |

### Step 2.3 — A real-world snag worth knowing

The install was extremely slow on a network-mounted filesystem. `npm install`
does enormous numbers of small file operations, and those are brutal over a
network mount or a virtualised share.

**Fix:** build on the local/native filesystem, then sync the *source* across —
never `node_modules`. This is the same reason Docker setups mount `node_modules`
as a named volume instead of a bind mount.

**Interview point:** this is a genuinely common production issue (WSL2, Docker
on macOS, network drives). Knowing *why* it happens — per-file syscall overhead,
not bandwidth — is a strong signal.

---

## Phase 3 — Every dependency and why

### Runtime dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.3.0 | Framework — routing, SSR/SSG, image optimisation, metadata API |
| `react` | 19.2.8 | UI library |
| `react-dom` | 19.2.8 | React's browser renderer |
| `gsap` | ^3.15.0 | Animation engine; ScrollTrigger ships inside it |
| `@fontsource/archivo` | ^5.3.0 | Display font (headlines), self-hosted |
| `@fontsource/inter` | ^5.3.0 | Body font, self-hosted |
| `@fontsource/caveat` | ^5.3.0 | Handwritten accent font, self-hosted, used sparingly |

### Development dependencies

| Package | Version | Purpose |
|---|---|---|
| `typescript` | ^5 | Type checking |
| `@types/node` | ^20 | Node type definitions |
| `@types/react` | ^19 | React type definitions |
| `@types/react-dom` | ^19 | React DOM type definitions |
| `tailwindcss` | ^4 | The CSS framework itself |
| `@tailwindcss/postcss` | ^4 | Tailwind v4's PostCSS plugin (v4 changed this — it used to be `tailwindcss` directly) |
| `eslint` | ^9.39.5 | Linting |
| `eslint-config-next` | ^16.3.0 | Next.js + React Hooks lint rules |

### Optional / removable

| Package | Note |
|---|---|
| `playwright` | Installed for browser QA, but the sandbox blocked the browser binary download. It is currently **unused** — safe to remove, or keep if you want to write real browser tests. |

### The font decision (important)

The build **initially failed**. The scaffold used `next/font/google`, which
fetches font files from `fonts.googleapis.com` **at build time**. The build
environment had no access to that host, so the build errored out.

Switching to `@fontsource/*` packages fixed it. These ship the actual font files
inside `node_modules`, so nothing is fetched at build or runtime.

**Why this matters beyond the sandbox:**

- Builds become reproducible and work offline / in air-gapped CI.
- No runtime request to Google — a **GDPR consideration** in the EU, where
  serving Google Fonts from Google's CDN has been ruled problematic.
- One less third-party origin, so no extra DNS + TLS handshake on first paint.

**Trade-off:** you self-manage font subsetting and weights. `next/font/google`
does automatic subsetting; with Fontsource you import only the weights you need
(here: Archivo 500/700/800/900, Inter 400/500/600, Caveat 600).

### Python tooling (asset generation only — not part of the web app)

| Tool | Purpose |
|---|---|
| **Pillow (PIL)** | Image open/resize/composite/save |
| **NumPy** | Fast array maths on pixel data |
| **SciPy** | `ndimage` — connected components, distance transforms, Gaussian filters |

These run **once**, offline, to produce PNG assets. They are not shipped and not
in `package.json`.

---

## Phase 4 — The asset pipeline

Three separate asset problems had to be solved before any UI work.

### Step 4.1 — Making the logo transparent

**Naive approach that fails:** "delete every near-white pixel."

Why it fails: the Paint & Chill logo has **white lettering** ("&", "Chill"
underline) and a **white wine glass outline** *inside* the black circle. A
global white threshold punches holes straight through the brand mark.

**Approach actually used:**

1. Build a mask of all near-white pixels (tolerance-based, not exact match — JPEG/PNG
   backgrounds are rarely pure `#FFFFFF`; this one was `#FEFEFE`).
2. Run **connected-component labelling** on that mask.
3. Keep only the components that **touch the image border**. That is the
   background, by definition — it is the white region connected to the outside.
4. Interior white (letters, the glass) is a separate, non-border-touching
   component, so it survives untouched.
5. **Feather the boundary**: dilate the background mask a few pixels and, in
   that thin edge zone, set alpha proportional to how white the pixel is. This
   prevents an ugly hard 1px jagged edge and preserves anti-aliasing.

**Interview point:** this is the classic flood-fill vs. threshold distinction.
Being able to explain *why* connected components beat thresholding here shows
real image-processing understanding.

### Step 4.2 — Optimising the photographs

For each supplied photo:

1. Convert to RGB (strip alpha — JPEG has no alpha channel).
2. Downscale to a sensible max width, preserving aspect ratio, using **Lanczos**
   resampling (higher quality than bilinear/nearest for downscaling).
3. Save as JPEG at quality 84 with `optimize=True`.
4. Rename to a predictable scheme (`session-01.jpg` … `session-06.jpg`).

Result: six photos totalling roughly 400 KB. Quality 84 is the usual sweet spot —
above ~90 the file grows fast for almost no visible gain.

The rename matters: **predictable filenames** are what make the config swappable
later.

### Step 4.3 — Generating brush masks procedurally

No real brush-stroke assets were supplied, and the brief explicitly forbade
fake-looking CSS gradients. So the masks were generated programmatically.

**The algorithm, conceptually:**

1. **Fractal noise (fBm)** — sum several octaves of interpolated random values at
   halving amplitude. This produces organic wobble rather than uniform-random
   jitter, which looks like static.
2. **Band stacking** — draw several thick horizontal strokes at different vertical
   positions and take their union. Each band's centreline and thickness are
   driven by the fractal noise.
3. **Overlap tuning** — bands must overlap enough that the interior is solid. (Getting
   this wrong left holes; see the bug log.)
4. **Distance transform for edge falloff** — compute each pixel's distance to the
   shape boundary, then fade alpha near the edge. This is what makes the edge
   read as *paint thinning out* rather than a cut-out.
5. **Blurred grain** — multiply the edge zone by smoothed noise to create the
   speckled dry-brush effect.
6. **Bristle streaks** — draw short thin lines trailing off the edges, so
   individual bristle marks are visible.
7. **Vertical inset** — keep the band stack inside the canvas so the top and
   bottom edges stay ragged instead of being clipped flat by the image border.

**Critical output decision:** the masks are saved as **pure white RGB + a real
alpha channel**. The art carries *shape only*, never colour. All colour comes
from CSS underneath. This is what makes one mask reusable in coral, blue,
yellow, or a full brand gradient.

**Two mask families were produced:**

| Family | Shape | Used for |
|---|---|---|
| `patch-01` … `patch-06` | Chunky, roughly rectangular painted patches, ~0.8–1.5 aspect | Revealing photographs |
| `band-cta` | Wide horizontal band, ragged top/bottom, bleeds off both sides | The closing CTA plinth |
| `edge-torn` | Solid at the bottom, torn/dripping along the top | The boundary into the next section |

Why patches and not thin strokes for photos: a 4.7:1 ribbon crops a photograph
into an unreadable sliver. A ~1.35:1 patch still reads as a photo while keeping
organic edges.

---

## Phase 5 — Design tokens and the styling system

### Tailwind v4's big change

Tailwind v4 does **not** use `tailwind.config.js` by default. Configuration
lives in the CSS file:

- `@import "tailwindcss";` replaces the old three `@tailwind` directives.
- An `@theme` block maps CSS custom properties to Tailwind utility names.

So defining a `--color-canvas` token inside `@theme` automatically generates
`bg-canvas`, `text-canvas`, `border-canvas`, and opacity variants like
`text-canvas/60`.

### The token set

| Token | Value | Role |
|---|---|---|
| `--canvas` | `#F8F5ED` | Warm ivory background — the "blank canvas" |
| `--canvas-deep` | `#F1ECDF` | Slightly deeper canvas tone |
| `--ink` | `#161311` | Warm near-black for type |
| `--coral`, `--yellow`, `--blue`, `--orange` | muted | Restrained paint accents |

### Brand colours sampled from the real logo

Rather than guessing brand colours, the logo's lettering was **sampled
programmatically**:

1. Select only pixels that are opaque, highly saturated, and bright — this
   isolates the gradient lettering and excludes the black disc and white text.
2. Convert to HLS and bucket by hue.
3. Take the **median** colour per bucket (median, not mean — resistant to
   anti-aliasing outliers).

Result: pink `#F32772`, coral `#F9524D`, orange `#FA881A`, purple `#852ED1`,
blue `#1A67EE`.

These feed a single `--paint-gradient` variable, ordered to match the logo
("Paint" runs warm, "Chill" runs cool). Because it is one variable, rebranding
is a one-line change.

**Interview point:** "I sampled the brand palette from the asset instead of
eyeballing hex codes" is a strong, concrete detail.

---

## Phase 6 — Component architecture

### File layout

```
app/
  layout.tsx        Fonts, <html> shell, SEO metadata
  page.tsx          Composes the hero + the next-section stub
  globals.css       Design tokens, texture, cursor, animation start-states
components/hero/
  Hero.tsx          Orchestrator: layout, copy, the whole GSAP timeline
  BrushImage.tsx    One photo revealed through one brush mask
  HeroNav.tsx       Minimal navigation
  CustomCursor.tsx  Desktop-only custom cursor
lib/
  heroContent.ts    ALL copy + ALL image config
public/
  images/           session-01…06.jpg
  brushes/          patch-01…06.png, band-cta.png, edge-torn.png
  brand/            logo.png (transparent)
```

### The separation-of-concerns rule

`lib/heroContent.ts` is the single source of truth for content. Each image entry
carries:

- `id` — stable key for animation targeting
- `src` — path to the photo
- `alt` — descriptive alt text (accessibility + SEO)
- `mask` — which brush mask reveals it
- `aspect` — the mask's width/height ratio
- `accent` — which paint colour haloes it

**Why `aspect` lives in config:** the mask and the container must have the same
aspect ratio or the painted shape won't align with the photo. Storing it beside
the mask path keeps them impossible to desync.

Swapping in new photography = edit one file. No component changes. That was an
explicit brief requirement.

### Why `BrushImage` is its own component

It renders **two stacked layers**:

1. A **stroke layer** — slightly larger box, filled with a brand paint colour,
   clipped to the brush silhouette. Creates a painted halo around the photo.
2. A **photo layer** — the photograph, clipped to the same silhouette.

Both are driven purely by `transform` and `opacity` from the parent timeline.

---

## Phase 7 — The animation system

### The pinning mechanism

This is the part most people get wrong.

- The outer section is **600vh tall**. It exists only to give the scroll
  something to travel through.
- Inside it, a **`position: sticky; top: 0; height: 100svh`** stage holds the
  visuals in place while the page scrolls past.
- **ScrollTrigger does *not* pin anything.** It only reads scroll progress
  against the tall wrapper and scrubs the timeline.

**Why sticky instead of GSAP's `pin: true`:** GSAP's pin works by wrapping the
element and switching it to `position: fixed`, which introduces layout shift
risk and a pin-spacer element. Native `sticky` is handled by the compositor,
survives resize better, and needs no spacer. ScrollTrigger is left doing the one
job it is uniquely good at: mapping scroll position to timeline progress.

### `scrub`

`scrub: 1` ties timeline progress to scroll position with ~1 second of catch-up
smoothing. Without it the animation plays once on trigger; with `scrub: true` it
tracks scroll exactly but feels twitchy. A small numeric value adds inertia.

### Timeline labels

The master timeline uses **named labels** at fixed times rather than chained
durations:

| Label | Time | What happens |
|---|---|---|
| — | 0 | Stage 1: blank canvas, headline visible |
| `stage2` | 1.0 | First brush stroke + first photograph appears |
| `stage3` | 2.1 | Remaining strokes/photos stagger in; headline recedes |
| `stage4` | 4.6 | Photos dissolve; full-bleed finale image crossfades in |
| `stage5` | 6.6 | Resolution; vibrant CTA band sweeps in; buttons fade up |

**Why labels beat chaining:** you can insert a tween at `"stage3+=0.55"` without
recalculating every prior duration. Re-choreographing becomes cheap.

### `gsap.matchMedia()`

Three conditions are registered:

| Condition | Behaviour |
|---|---|
| Desktop (≥1024px, motion OK) | All 6 photographs, full travel distances |
| Mobile (<1024px, motion OK) | Only 3 photographs, reduced travel |
| `prefers-reduced-motion: reduce` | No timeline at all — static layout |

`matchMedia` automatically reverts and rebuilds when the query changes, so
resizing across the breakpoint doesn't leave stale inline transforms behind.

### `gsap.context()`

Everything is created inside a `gsap.context()` scoped to the hero element. On
unmount, reverting the context kills every tween, ScrollTrigger, and inline
style it created. Without this you get memory leaks and orphaned ScrollTriggers
on route changes — a very common React + GSAP bug.

### Choreography, not randomness

Each image has a defined entrance offset — where it travels *from*: direction,
rotation, and starting scale. Values alternate direction and vary magnitude so
the sequence feels composed rather than scattered. The brief explicitly said
these must not be random.

---

## Phase 8 — The masking technique

### CSS masks vs `clip-path`

| Technique | Suitability |
|---|---|
| `clip-path: polygon()` | Hard vector edges only. Cannot express a soft, speckled, dry-brush edge. |
| SVG `<clipPath>` | Same limitation — binary in/out. |
| **`mask-image` with an alpha PNG** | Supports **partial** alpha, so edges can fade and speckle. Correct choice. |

Paint has *soft, semi-transparent* edges. Only an alpha mask can express that.

### How it works

The mask PNG's **alpha channel** decides what shows through: alpha 255 = fully
visible, 0 = hidden, intermediate = partially visible. The mask's RGB channels
are irrelevant when the default `mask-mode` (alpha for images) applies — which
is exactly why the masks are pure white. Colour is supplied by whatever sits
underneath: a solid accent colour for the halo, the brand gradient for the CTA
band, or the photograph itself.

### `mask-size` choice

`mask-size: 100% 100%` stretches the mask to exactly fill the box. This is safe
**only because** the container's aspect ratio is set from the mask's own
dimensions. Using `contain` instead would letterbox the mask inside a
mismatched box and misalign the paint from the photo.

### Prefixing

Both `mask-*` and `-webkit-mask-*` properties are written. Safari still needs
the prefixed form for reliable support.

---

## Phase 9 — Performance decisions

### Animate only `transform` and `opacity`

These two properties can be handled entirely by the GPU compositor. They skip
**layout** and **paint** in the browser's rendering pipeline:

```
JavaScript → Style → Layout → Paint → Composite
```

Animating `width`, `top`, `left`, or `margin` forces Layout on every frame,
which is what causes jank. `transform` and `opacity` jump straight to Composite.

### `will-change: transform`

Applied to the moving layers only. It hints the browser to promote them to their
own compositor layer ahead of time. **Applied sparingly on purpose** — every
promoted layer costs GPU memory, and blanket `will-change` makes things slower,
not faster.

### The cursor has no animation loop

A naive custom cursor runs `requestAnimationFrame` forever. This one attaches a
`mousemove` listener with `{ passive: true }` and mutates `transform` directly.
When the pointer is still, **zero work happens**. `passive: true` tells the
browser the handler will never call `preventDefault()`, so scrolling isn't
blocked waiting on it.

### Image loading

- `next/image` handles resizing, format negotiation, and lazy loading.
- The `sizes` attribute tells the browser how large the image will actually be,
  so it downloads an appropriately sized variant instead of the largest one.
- Only the first image gets `priority` (preloaded); the rest lazy-load.
- Explicit aspect ratios mean the box is reserved before the image arrives —
  **no Cumulative Layout Shift**.

### Mobile does less

Three images instead of six, shorter travel distances, less rotation. The
concept survives; the work halves.

### Canvas texture

The paper grain is an **inline SVG `feTurbulence` filter as a data URI** — no
extra HTTP request, no image file, and it is completely static (never animated).

---

## Phase 10 — Accessibility

### Reduced motion is a separate code path, not a slowdown

When `prefers-reduced-motion: reduce` matches:

- The 600vh scroll driver collapses to `height: auto`.
- The sticky stage becomes `position: relative`.
- All photographs are set visible in their normal positions.
- The finale layers are set to **`display: none`** — not merely transparent.

**Why `display: none` and not `opacity: 0`:** an element at zero opacity is still
in the accessibility tree and still **focusable by keyboard**. A user tabbing
through would hit an invisible link. `display: none` removes it entirely.

**Interview point:** this distinction between `opacity: 0`, `visibility: hidden`,
and `display: none` — and their differing effects on focus order and screen
readers — is a very common interview question.

### Other measures

- Exactly one `<h1>`.
- Every photograph has descriptive alt text naming the activity and location.
- Purely decorative layers (paint strokes, scrims, textures) carry `aria-hidden`.
- The custom cursor is `aria-hidden`, and only renders when `(pointer: fine)`
  matches — it never appears on touch devices.
- Native cursor hiding is scoped to fine-pointer devices only.
- The nav has an `aria-label`; the "ARTISTS ↗" item is marked as not yet
  navigable rather than being a dead link.

---

## Phase 11 — SEO

### Metadata

Next.js's Metadata API supplies title, description, `metadataBase`, and
OpenGraph tags from the layout — server-rendered into `<head>`, so crawlers see
them without executing JavaScript.

### Content is real HTML, not canvas

Everything meaningful is real DOM text. Nothing important lives inside a
`<canvas>` element or is baked into an image, both of which are invisible to
search engines.

### Server-side rendering

The page is statically prerendered. Crawlers receive fully-formed HTML including
all six `<img>` tags with alt text — the animation is purely a client-side
enhancement on top.

### Keyword handling

A screen-reader-only paragraph carries the supporting keyword copy naturally
("painting experiences Melbourne", "art sessions", "private painting events").
It is phrased as a real sentence, not a keyword list — keyword stuffing is
penalised.

### Language

`lang="en-AU"` and `og:locale: en_AU`, since the business is Melbourne-based.

---

## Phase 12 — Responsive strategy

### Viewport-relative positioning

Photo positions are expressed in `vw` and `%` rather than pixels, so one layout
table serves every breakpoint. `max-width` caps stop them growing absurdly on
ultra-wide monitors.

### `svh` instead of `vh`

The sticky stage uses `100svh` (small viewport height), not `100vh`. On mobile
browsers, `100vh` includes the area behind the collapsing address bar, which
causes content to jump as the bar hides and shows. `svh` uses the smallest
stable height, so nothing shifts.

### Breakpoint strategy

A single meaningful breakpoint at **1024px** splits the desktop and mobile
timelines. Typography scales fluidly with `vw` units and clamped Tailwind
breakpoints, so text scales continuously rather than snapping.

Targets checked: 1440, 1280, 1024, 768, 390.

---

## Phase 13 — Bugs hit, and how they were diagnosed

This section is the most valuable for interviews. Real debugging stories beat
memorised theory.

### Bug 1 — Zero-height containers (the big one)

**Symptom:** only one photograph appeared; the brush strokes were invisible.

**Root cause:** the photo containers had `width` set but **no height**. Every
child inside them was `position: absolute`, which removes children from normal
flow — so there was nothing left to give the parent height. The containers
collapsed to zero height. A zero-height box renders nothing, and because
lazy-loaded images never intersect the viewport, they never even downloaded.

The only visible photo was the full-bleed finale image, because it was the one
element sized by `inset: 0` rather than by its children.

**Fix:** give every container an explicit `aspect-ratio` taken from its mask's
real dimensions. This also fixed layout shift as a bonus.

**Lesson:** *"If every child is absolutely positioned, the parent has no
height."* This is one of the most common CSS bugs in existence.

### Bug 2 — Black paint smearing across the screen

**Symptom:** ugly black shapes appeared during scroll.

**Root cause:** the first-generation brush textures were rendered in near-black
(RGB ~20,18,16) and used as a `background-image`. A background image paints its
own colour. There was no way to tint it.

**Fix:** regenerate the masks as **pure white + alpha** and use them as
`mask-image` instead of `background-image`. Colour then comes from CSS
underneath, so the same asset can be any colour — later including a full brand
gradient.

**Lesson:** mask assets should encode *shape*, never colour.

### Bug 3 — Flash of unstyled content before hydration

**Symptom:** elements the animation was supposed to hide flashed visible on page
load.

**Root cause:** the "hidden" state was only ever set by GSAP, which runs after
hydration. The server-rendered HTML had them fully visible, so the browser
painted them before JavaScript executed.

**Fix:** declare the start state in **CSS**, so it is correct from the very first
paint. A `prefers-reduced-motion` override keeps the content visible for users
who get no animation, and a `<noscript>` rule reveals everything if JavaScript
never runs at all.

**Lesson:** with SSR, any state that must be correct on first paint has to exist
in CSS or in the server-rendered markup — not in a `useEffect`.

### Bug 4 — React Hooks lint errors on refs

**Symptom:** `react-hooks/refs` — "Cannot access refs during render."

**Root cause:** ref *objects* were being passed down through props and read
during render. React 19's lint rules flag this because reading `.current` during
render is not safe under concurrent rendering.

**Fix:** switch to **callback refs** — pass functions that receive the DOM node
and store it, so nothing reads `.current` during render.

### Bug 5 — `setState` inside an effect

**Symptom:** `react-hooks/set-state-in-effect` warning in the cursor component.

**Root cause:** pointer capability (`pointer: fine`) genuinely cannot be known
during SSR, so it must be detected on the client after mount.

**Resolution:** this one is a legitimate exception. It was documented with a
targeted, commented lint suppression rather than being silently disabled —
which is the professional way to handle a rule you must break.

### Bug 6 — Masks with holes and flat edges

**Symptom:** generated patches had holes in the middle, then flat clipped edges.

**Root causes and fixes:**
1. Bands didn't overlap enough → raised the overlap factor above 1.0.
2. Band stack overflowed the canvas and got clipped → inset the stack vertically
   so the ragged edges stayed inside the image bounds.

**Lesson:** procedural generation needs **numeric verification**, not just
eyeballing. Interior alpha was asserted to be 255 and border alpha near 0.

### Bug 7 — Marginal text contrast

**Symptom:** white finale headline sat over a bright hallway photograph.

**Fix:** strengthened the gradient scrim between photo and text. Caught by
rendering the composition offline and inspecting it.

---

## Phase 14 — Verification and QA

Verification ran in layers, cheapest first:

| Layer | Tool | Catches |
|---|---|---|
| 1. Types | `tsc --noEmit` | Missing config fields, wrong prop types |
| 2. Lint | `eslint --max-warnings=0` | Hooks violations, unused code |
| 3. Build | `next build` | Compile errors, failed asset resolution, SSG failures |
| 4. Server output | Fetch the rendered HTML and assert on it | Missing aspect ratios, wrong element counts, hydration-visible state |
| 5. Visual | Offline image composites | Whether it actually looks right |

### Assertions run against the server-rendered HTML

Rather than trusting the build, the actual HTML output was fetched and checked:

- All six photo containers carry an `aspect-ratio` — proves Bug 1 is fixed.
- Exactly four elements carry the hidden class — proves Bug 3 is fixed.
- Six distinct `session-*.jpg` files are referenced — proves all photos render.
- Stroke layers reference paint colour variables, not black — proves Bug 2.
- Exactly one `<h1>` — proves the SEO requirement.

**Interview point:** "I asserted on the server-rendered HTML" is a much stronger
answer than "I looked at it in the browser."

### The honest gap

The sandbox blocked Playwright's browser download, so **no real browser testing
was performed**. Scroll behaviour, GSAP timing, and the custom cursor were
verified by code review and offline rendering only. Before launch you should:

- Run it in Chrome, Firefox, and Safari.
- Check the console for errors and hydration warnings.
- Test real scroll on a real touch device.
- Toggle reduced motion in OS settings and verify the static path.
- Run Lighthouse for performance and accessibility scores.

---

## Known gaps and honest limitations

Worth knowing before you present this as finished.

1. **The `<h1>` is the stylised "PAINT. CHILL. CREATE."**, not the keyword-rich
   phrase the brief suggested. The full phrase currently lives in the page
   `<title>` and a screen-reader-only paragraph. If SEO ranking is the priority,
   restructure so the H1 carries the descriptive phrase while remaining visually
   styled as the three words.
2. **No browser testing** — see above.
3. **Two photographs are low resolution** (roughly 330–500px wide). Fine at their
   small scattered sizes; they would degrade if reused larger.
4. **Brush masks are procedural, not photographed.** They are convincing, but real
   scanned brush strokes would be better. They are drop-in replaceable.
5. **The finale CTA links are focusable while still invisible** during the animated
   path. A refinement would gate `pointer-events` and focusability until they are
   revealed.
6. **No backend yet** — bookings, artists, and customers are all still to come.

---

## Rebuild-from-scratch checklist

Ordered. Each step depends on the ones above it.

**Setup**
1. Verify the target folder is empty or safe to scaffold into.
2. Run `create-next-app` with TypeScript, Tailwind, ESLint, App Router, no src dir, `@/*` alias.
3. Install `gsap`.
4. Install `@fontsource/archivo`, `@fontsource/inter`, `@fontsource/caveat`. Do **not** use `next/font/google` if builds must work offline.
5. Confirm `npm run build` succeeds on the bare scaffold before writing any code.

**Assets**
6. Remove the logo background using border-touching connected components, with a feathered edge.
7. Resize and compress photographs (Lanczos, JPEG q84), rename to a predictable scheme.
8. Generate brush masks with fractal noise, overlapping bands, distance-transform edge falloff, grain, and bristle streaks. Save as **white + alpha**.
9. Verify masks numerically: solid interior, ragged (near-zero) borders.
10. Place assets under `public/images`, `public/brushes`, `public/brand`.

**Foundation**
11. Define design tokens in CSS inside Tailwind v4's `@theme` block.
12. Sample brand colours from the logo; build one gradient variable.
13. Add the canvas texture as an inline SVG data URI.
14. Define animation start-state classes in CSS, with reduced-motion and `noscript` overrides.

**Content layer**
15. Create the content config file: copy, image paths, alt text, mask paths, aspect ratios, accent colours.

**Components**
16. Build the layout shell: fonts, metadata, `lang="en-AU"`.
17. Build the masked-image component with an explicit aspect ratio and two layers.
18. Build the navigation.
19. Build the custom cursor, gated on `(pointer: fine)`.
20. Build the hero shell: 600vh wrapper + sticky `100svh` stage.

**Animation**
21. Register ScrollTrigger.
22. Wrap everything in a GSAP context for cleanup.
23. Add `matchMedia` with desktop / mobile / reduced-motion conditions.
24. Write the reduced-motion path **first** — it is the accessible baseline.
25. Set initial states, then build the labelled master timeline.
26. Connect ScrollTrigger with `scrub`; do **not** use GSAP pinning.

**Verification**
27. `tsc --noEmit`
28. `eslint --max-warnings=0`
29. `next build`
30. Fetch the rendered HTML and assert on structure.
31. Real browser testing across breakpoints, plus reduced-motion and Lighthouse.

---

## Interview prep — likely questions

**Q: Why `position: sticky` instead of GSAP's pin?**
Sticky is native, compositor-driven, needs no pin-spacer element, and survives
resize cleanly. ScrollTrigger is then only responsible for mapping scroll
progress to timeline progress, which is what it is best at.

**Q: Why do you only animate `transform` and `opacity`?**
They skip Layout and Paint in the rendering pipeline and are handled by the GPU
compositor. Animating `width` or `top` forces layout recalculation every frame.

**Q: Why CSS masks instead of `clip-path`?**
`clip-path` is binary — a pixel is in or out. Paint edges are soft and partially
transparent. Only an alpha mask can express partial opacity.

**Q: Why are the mask images white?**
So they carry shape only. Colour comes from CSS underneath, which makes one
asset reusable in any colour, including a gradient.

**Q: How do you support reduced motion properly?**
It is a genuinely separate code path — the scroll driver collapses, the sticky
stage becomes static, content is shown in place, and animation-only layers are
`display: none` so they don't trap keyboard focus. Slowing the animation down is
not sufficient.

**Q: What is CLS and how did you avoid it?**
Cumulative Layout Shift measures unexpected movement of visible content.
Avoided by giving every image container an explicit aspect ratio, so space is
reserved before the image loads, and by using `svh` so mobile browser chrome
doesn't cause jumps.

**Q: Why self-host fonts?**
Reproducible offline builds, no third-party origin on the critical path, and it
avoids the GDPR concerns around serving Google Fonts from Google's CDN.

**Q: What was the hardest bug?**
Zero-height containers. All children were absolutely positioned, so the parents
collapsed and nothing rendered — and lazy images never loaded because they never
intersected the viewport. Diagnosed by inspecting the actual server-rendered
HTML and noticing there was no height on the boxes.

**Q: How would you scale this to the full site?**
The masking, token, and timeline patterns are reusable as a visual language.
Next steps: extract the masked-image component into a shared UI layer, add
PostgreSQL with tables for bookings, sessions, artists, artwork, customers, and
messages, and use Next.js route handlers for the API rather than a separate
Express server.

**Q: What would you do differently?**
Restructure the H1 for SEO, use photographed brush textures instead of
procedural ones, and set up real browser-based visual regression testing from
day one.
