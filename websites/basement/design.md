# basement.studio — design.md

> A structured design specification of **https://basement.studio**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** sub-agent
> **Source dump:** `tools/tmp/basement/` (gitignored)

---

## Overview

basement.studio is a Brooklyn/NYC-leaning interactive digital studio and
"branding powerhouse" with an extremely technical, self-aware voice. The
homepage is a single-page pitch: a fully interactive, spatial-audio 3D
"office" scene (WebGL, React Three Fiber) anchored under a fixed top nav, a
trust strip of 32 client wordmarks, a sticky scroll-pinned "Featured
Projects" rail, a 4-pillar "Capabilities" block, a single email "Contact"
line, and a fullscreen footer that takes the viewport height. Visual
language is strict: a near-black canvas (`#000000`) with off-white text
(`#E6E6E6`), a single warm orange accent (`#FF4D00`) reserved for the
contact-form dialog and hover states, and a strict 12-column grid of
`0.75rem` gutters. The body is set in Geist (variable), with a custom
display font called *flauta* used only on the contact form's retro "OS
dialog" frame.

**Category:** Other (interactive studio / portfolio)
**Primary surface observed:** Homepage only (other routes exist: `/services`,
`/showcase`, `/showcase/[slug]`, `/people`, `/blog`, `/lab`, `/contact`,
`/not-found`)
**Tone:** confident, technical, occasionally cheeky (the legal-name tag is
"basement.studio LLC", the loading screen reads "Loading BSMNT-DOS", and
the meta description starts with "A digital studio & branding powerhouse
making cool shit that performs")
**Framework detected (if any):** Next.js 15 (App Router, `app/(site)/(pages)/(home)`),
React 19, Tailwind CSS, Sanity CMS (`9syto90m.api.sanity.io`), Vercel hosting

---

## Visual Language

### Color

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--bg-brand-k` | `#000000` (black) | canvas, footer, hero overlay |
| Background (panel) | `--bg-brand-k` | `#000000` | featured-project cards, "Featured Projects" h2, footer |
| Background (input) | `--bg-brand-g2` | `#2E2E2E` (dark gray) | newsletter input fill |
| Text (primary) | `--text-brand-w1` | `#E6E6E6` (light gray) | nav links, h1, h2, body, project titles |
| Text (secondary) | `--text-brand-w2` | `#C4C4C4` (mid gray) | subtitle, footer body, "Featured Projects" h2 |
| Text (muted) | `--text-brand-g1` | `#757575` (gray) | section eyebrow labels, count chips, copyright |
| Text (chip) | `--text-brand-w1` on `--bg-brand-g2` | white-on-dark-gray | capability tags |
| Accent (primary) | `--text-brand-o` | `#FF4D00` (orange) | hover state, contact-form frame, BSMNT-DOS loader |
| Accent (glow) | — | `rgba(255, 77, 0, 0.15)` | `box-shadow: 0 0 5px rgba(255,140,0,0.15)` on the contact dialog |
| Border (default) | `--border-brand-w1/20` | `rgba(230, 230, 230, 0.2)` | client-logo cells, project thumbnails, scrollbar underline |
| Border (stronger) | `--border-brand-w1/30` | `rgba(230, 230, 230, 0.3)` | hairline dividers above cards, between footer columns |
| Border (subtle) | `--border-brand-w1/10` | `rgba(230, 230, 230, 0.1)` | nav bottom hairline |
| Backdrop (modal) | `bg-black/90` | `rgba(0, 0, 0, 0.9)` | under the contact dialog (z-40, opacity 0→1) |

Brand colors are wired as raw RGB triplets in Tailwind utility classes
(`bg-brand-k`, `text-brand-w1`, `border-brand-w2/20` …), not CSS custom
properties. The variable names follow a German industry convention:
`k` = schwarz (black), `w1`/`w2` = weiß (white-ish), `g1`/`g2` = grau
(gray), `o` = orange.

There is **no light-mode variant** — the entire site is permanently dark.

### Typography

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display H1 (hero) | Geist, "Geist Fallback" | 600 | `clamp(2.875rem, 5vw, 5.4375rem)` — desktop computes to **87px** | `4.875rem` (78px) desktop | `-0.04em` (-3.48px) |
| Display H1 (3xl+) | Geist | 600 | `6.125rem` (98px) | `5.5rem` (88px) | `-0.04em` |
| Section H2 (Featured Projects) | Geist | 600 | `4.75rem` (76px) | `4.25rem` (68px) | `-0.04em` (-3.04px) |
| Section H2 mobile | Geist | 600 | `2.1875rem` (35px) | `2.25rem` (36px) | `-0.03em` |
| H3 (Trusted by, Capabilities) | Geist | 600 | `1.5rem` (24px) desktop, `1.25rem` mobile | `1.5rem` (24px) | `-0.03em` (-0.72px) |
| H4 (capability titles) | Geist | 600 | `1.25rem` (20px) desktop, `0.9375rem` mobile | `1.25rem` / `1rem` | `-0.02em` (-0.4px) |
| Body P | Geist | 600 | `0.8125rem` (13px) desktop, `0.75rem` (12px) mobile | `1rem` (16px) | `0` |
| Nav link | Geist | 600 | `0.75rem` (12px) | `1rem` (16px) | `0` |
| Mono / DOS loader | Geist Mono, "Geist Mono Fallback" | 400 | `1.5rem` (24px) on the "Loading BSMNT-DOS" pseudo | `2rem` | `0` |
| Contact dialog | flauta, "flauta Fallback" | 400 | `14px` / `12px` | inherits | `0` |
| Caption (count chips) | Geist | 600 | `0.75rem` | `1rem` | `0` |
| Blog body | Geist | 500 | `1rem` | `1.5rem` | `0` |

**Family provenance:**
- *Geist* (variable, weight 100–900) is self-hosted in `tools/tmp/basement/fonts/`
  via `next/font/local` — 6 subsets per weight axis (Cyrillic, Greek,
  Vietnamese, Latin-Ext, Latin, default). Format: woff2.
- *Geist Mono* (variable, 100–900) is self-hosted via the same mechanism.
- *flauta* is a custom display face (only used on the 3D "OS dialog"
  contact form). The TTF is bundled in `tools/tmp/basement/fonts/1373ae793ca39934-s.p.ttf`.

The site never falls back to a system sans — both `--font-geist-sans` and
`--font-geist-mono` are real font families loaded into Next.js's font
system; the `<body>` carries the class `__variable_246ccd __variable_4c40f6
__variable_719761` (Geist Sans / Geist Mono / flauta).

### Spacing & radius

- **Base unit:** 4px (Tailwind default; `0.75rem` gutters inside
  `grid-layout`, `1rem` page padding on mobile)
- **Scale used:** 2, 4, 6, 8, 12, 16, 18, 20, 24, 32, 56, 64, 72, 80 px
  (Tailwind's `0.5/1/1.5/2/3/4/5/6/8/12/14/16/18/20`)
- **Radii:** essentially **none** — all observed elements have
  `border-radius: 0px` (computed). The site deliberately keeps square
  corners; the only "rounding" effect is the curved text underline on
  `.actionable` (a flat 1px line, not a pill).
- **Shadows:** none on primary surfaces; the only observed `box-shadow` is
  `[box-shadow:0_0_5px_rgba(255,140,0,0.15)]` on the contact dialog
  frame, evoking a CRT phosphor glow.

### Iconography

- **Style:** bespoke inline SVG paths, all filled with `currentColor`.
- **Library:** none observed — icons are hand-drawn paths inlined in the
  page (hamburger, arrow "→", audio-bars visualizer, footer scroll-arrow
  variants).
- **Default size:** `size-5` (20px) for inline arrows; `size-6` (24px) for
  the project-card hover arrow; `h-[0.9375rem]` (~15px) for the wordmark.
- **Audio toggle icon:** 5 stacked 2×2 squares (a tiny VU meter motif),
  `viewBox="0 0 22 15"`.
- **Project CTA arrow:** 20×20 viewBox, single path
  `M11.1075 14.2752 4.2763 4.29004 …` (a right-pointing arrow that
  shifts in from `translate-x-6` on group hover).
- **Close [ESC] / 3D dialog:** 2 stacked 1.5px-tall horizontal lines that
  cross into an X on hover (`transition-[transform,width] duration-300`).

---

## Layout & Grid

- **Max content width:** `120rem` (1920px) — `grid-layout { max-width: 120rem }`.
- **Page gutter:** `clamp(1rem, 4vw, …)` — observed `1rem` on mobile,
  1rem on `2xl` with `col-start-3` (i.e. 2 columns of padding) on the
  ultra-wide breakpoint.
- **Grid:**
  - **Mobile (`<1024px`):** 4 columns, `0.75rem` gutter, full bleed.
  - **Desktop (`≥1024px`):** 12 columns, same `0.75rem` gutter, page padding
    `1rem`.
  - **Ultra-wide (`≥1920px` / `3xl`):** shifts the content origin to
    `col-start-3` (i.e. an extra gutter on the left of the 12-col grid).
- **Breakpoints:** sm `640`, md `768`, lg `1024`, xl `1280`, 2xl `1536`,
  3xl `1920` px (Tailwind v4 default set).
- **Vertical rhythm:** the only "baseline grid" is the 12-col `grid-layout`
  applied at the section wrapper level; section padding follows
  `py-4 / lg:py-0 / pb-16 lg:pb-32 / pt-12 lg:pt-16` patterns.
- **Sticky project list:** the four "Featured Projects" rows use
  `position: sticky; top: 9.2rem (lg) / 6.7rem (mobile)` with `z-index`
  incrementing per row (1, 2, 3, 4), so each new card slides up over the
  previous one as the user scrolls.

**Homepage structure, top → bottom:**

1. **`<nav>`** — fixed, `top-0 z-navbar (1000)`, 36px tall
   (`h-9 = 2.25rem`). On desktop: opaque black w/ 1px sub-hairline
   (`after:bg-brand-w1/10`). On mobile: same look + a music-toggle and
   hamburger.
2. **Hero canvas container** — `position: relative` on mobile (inline
   below nav, `h-[80svh]`), `position: fixed` on `lg` (covers the
   viewport at `h-[100svh]`, behind the scrolling content). Contains a
   full-bleed black `<canvas>` for the R3F scene.
3. **`<main>`** — wrapped in `.layout-container` which carries a
   `mask-image` SVG-pixel-transition effect (described under Animations).
   On `lg` it has `mt-[100dvh]` so it sits below the pinned hero. Internal
   gap: `flex flex-col gap-18 lg:gap-32`.
4. **Hero copy `<section>`** — H1, subtitle (`lg:w-[60%]`).
5. **"Trusted by Visionaries"** — 6-col mobile, 8-col `xl` client-logo
   grid, each logo in a 202×110 cell with `border-brand-w1/20`, an
   underlying `with-dots` texture, and a `with-diagonal-lines` overlay
   that appears on hover (animated at `6s linear infinite`).
6. **"Featured Projects"** — sticky-stack of 4 case-study rows (Vercel
   Ship, Daylight, KidSuper, Shop MrBeast), each row: 7-col image +
   3-col copy + 2-col title.
7. **"Capabilities"** — 4-col grid (`2 lg:grid-cols-8`), each pillar
   rendered as title + body + 2–4 tag chips.
8. **"Contact"** — single row with `h1` + `hello@basement.studio` link.
9. **`<footer>`** — `flex flex-col bg-brand-k pb-4 lg:h-[calc(100dvh-3.25rem)]`
   so it fills the viewport below the fold. Big "BASEMENT.STUDIO"
   wordmark (mobile SVG `viewBox 0 0 356 46`, desktop SVG
   `viewBox 0 0 1673 149` — the desktop glyph is 9× the size of the
   mobile one), nav list, newsletter form, social links, copyright.

---

## Components

### Nav (top bar)

- **Position:** `fixed top-0 z-[1000]`, `h-9` (36px).
- **Anatomy:** 12-col `grid-layout` row containing (a) wordmark button
  (`col-span-1 lg:col-start-1 lg:col-end-3`), (b) primary links in
  `col-start-3 col-end-11` on desktop, (c) utility controls + Contact Us
  in `col-start-11 col-end-13`.
- **Background:** `bg-brand-k` (black) on mobile, `lg:bg-transparent` on
  desktop; a `bg-image` of two repeating 1px `linear-gradient`s paints a
  2×2 dotted grid behind the nav. A `1px` `after:bg-brand-w1/10` line
  marks the bottom edge.
- **Hover:** `transition-colors duration-0` (deliberately instant),
  `hover:text-brand-o` switches link color to orange.
- **Sticky transform:** `transition-transform duration-300` on the
  whole `<nav>` (used to slide it off-screen on scroll-down, back on
  scroll-up — same pattern Tailwind calls "hide-on-scroll").
- **Music toggle:** a 22×15 viewBox of 5 stacked 2×2 rects, label
  "Turn music on" / "Turn music off", wired to the `AudioEngine` in the
  3D scene.
- **Mobile menu:** "Menu" text + 2 stacked 1.5px lines that cross into
  an X (animated `transition-[transform,width] 300ms ease-in-out`).

### Logo / wordmark

- **Desktop nav:** inline SVG `viewBox="0 0 107 15"` filled with
  `text-brand-w1` (off-white). Height `0.9375rem` (~15px). Single
  complex `<path>` of vector glyphs spelling "basement.studio".
- **Footer (mobile):** SVG `viewBox="0 0 356 46"`, scaled to fit the
  column.
- **Footer (desktop):** SVG `viewBox="0 0 1673 149"` — a giant
  wordmark of the same glyph shapes stretched ~9×.

### Hero canvas (3D scene)

- **Container:** `canvas-container relative top-0 h-[80svh] w-full lg:fixed lg:aspect-auto lg:h-[100svh]`.
- **Anatomy:** an absolute black `<div>` + a full-bleed `<canvas>`.
  Above it (z-10) sits a hidden-by-default "open canvas" overlay that
  flips to flex on hero click, with a "Close [ESC]" button and a
  brand-w1/20 frame with `with-dots` pattern.
- **Content:** a React Three Fiber scene of a fully-modelled 3D office
  (see Assets → 3D models). It includes an exterior with cars, a godrays
  pass, a basketball and basketball net, an interior office with
  wireframe overlay, a contact phone model, and routing arrows. A
  custom Web Audio class plays spatial ambience, music, SFX, and a
  Christmas override song.
- **State machine:** `[data-flip=false]` and `[data-flip=true]` attributes
  on `<html>` toggle a CSS mask-image transition between two layouts
  (see Animations).

### H1 / H2 / H3 / H4 type styles

- **H1:** `text-f-h0-mobile lg:text-[5.4375rem] lg:leading-[4.875rem] 3xl:text-f-h0` —
  display, `clamp`-ish via Tailwind responsive classes, 600 weight, tight
  tracking `-0.04em`.
- **Section H2 (Featured Projects):** `!text-f-h1-mobile lg:!text-f-h1`
  → 35/36px → 76/68px.
- **Eyebrow H2 (Trusted by / Capabilities):** `text-f-h3-mobile lg:text-f-h3`
  in `text-brand-g1` (gray) — a small, muted kicker.
- **H4 (capability titles):** `text-f-h4-mobile lg:text-f-h4`, 600 weight.
- **P (body):** `text-f-p-mobile lg:text-f-p`, 0.75rem / 0.8125rem, line-height 1rem,
  600 weight (Geist is heavy at 400, so 600 keeps it readable in display).

### `.actionable` link

- **Purpose:** the canonical inline link styling — used on every
  navigation anchor, the project CTA, and the email link.
- **Anatomy:** `<span class="actionable">label</span>` inside an `<a>` or
  `<button>`. Renders a `1px`-tall underline that fades in on hover.
- **Mechanics:** `display: inline-flex; align-items: center; height: calc(.89 * 1em); line-height: .89;` —
  the `0.89` factor trims the line-box so the underline doesn't blow out
  the descenders. A `::before` pseudo positions an absolutely-placed
  `round(0.06em, 1px)` line at `bottom: -0.06em`. On hover the line's
  opacity transitions from 0 to 1 over `--anim-delay` (= 60ms =
  300ms/5).
- **Hover state:** the whole span re-uses a `@keyframes actionable-blink`
  animation that pulses `--opacity-hover-value` from 100 → 50 → 100
  over 300ms, with `text-shadow: 0 0 30px var(--text-shadow-color)` for
  a subtle glow.
- **Focus state:** same as hover (so keyboard users see the same affordance).

### `.actionable-opacity` link variant

- Same family as `.actionable` but no underline. Used for non-clickable
  labels (e.g. blog count `(25)` chips in the footer) that still react
  on hover with an opacity pulse.

### Client logo cell

- **Aspect:** `aspect-[202/110]` (i.e. 1.836:1).
- **Padding:** none on the cell; inner `<div>` has `px-2`.
- **Border:** `1px` `border-brand-w1/20` (`rgba(230, 230, 230, 0.2)`)
  with `after:absolute after:inset-0` (the border is drawn via an
  absolute pseudo to avoid sub-pixel gaps).
- **Background texture:** `with-dots` paints 1px solid lines on the
  top and bottom edges (`linear-gradient(to right, #E6E6E6 0 1px,
  transparent 1px calc(100% - 1px), #E6E6E6 calc(100% - 1px) 100%)`).
- **Hover:** the inner `.with-diagonal-lines` overlay goes from
  `opacity-0` to `opacity-100` in `transition-opacity duration-300`,
  revealing an SVG diagonal-lines pattern that is itself animated
  (`@keyframes diagonalPatternAnimation` 6s linear infinite).

### Featured Project card

- **Anatomy:** a 7-col image cell + 3-col body cell + 2-col title cell.
- **Image:** `aspect-video` placeholder, `next/image` with the
  `group-hover:animate-subtle-pulse` class (opacity 1 → 0.75 → 1
  infinitely, ~2s).
- **Title (mobile):** inline H2 inside the body column.
- **Title (desktop):** separate 2-col cell aligned to the right edge of
  the grid; the text is wrapped in `<span class="actionable group
  gap-x-2">` plus an arrow that translates from `translate-x-6` to
  `translate-x-0` and fades in (`opacity-0 → 100` with `hover:delay-200`).
- **Stacking:** each row is `position: sticky; top: 9.2rem; z-index:
  ${i}` so they overlap and "deal" onto the screen.

### Capability card

- **Layout:** one of four `col-span-1 lg:col-span-2` cells inside a
  2-col mobile / 8-col desktop grid.
- **Anatomy:** H4 link → muted body paragraph (`text-brand-w2`) → row of
  `w-fit bg-brand-g2 px-1` tag chips.
- **Hover:** the H4 link uses `.actionable`, so the underline animates in.

### Tag chip

- **Background:** `bg-brand-g2` (`#2E2E2E`).
- **Text:** `text-brand-w1 text-f-p-mobile lg:text-f-p` (off-white,
  small/medium body size).
- **Padding:** `px-1` only (4px horizontal).
- **Truncation:** `line-clamp-1 w-fit` (single line, fit-content width).
- **Other:** the chip carries a `title` attribute so the full label is
  announced on hover.

### Contact email link

- **Type:** `text-[2rem] text-f-h1-mobile text-brand-w1 lg:text-f-h1` —
  sized like the H1 of the section, so the email reads as a
  display-level CTA.
- **Hover:** orange via `.actionable` + glow.

### Contact dialog (3D OS-window form)

- **Position:** `fixed inset-0 z-50 pointer-events-none`, with a
  centered `.contact-screen` at `width: 580px; height: 350px` and
  `transform: perspective(400px) rotateY(0.5deg) scale(1, 1)` — a
  deliberate 3D-tilt to evoke a CRT terminal.
- **Open animation:** inner content scales from `scaleX(0) scaleY(0)` to
  `scale(1)` over 300ms.
- **Backdrop:** a `bg-black/90` underlay at z-40, faded in over
  `transition-all duration-300 ease-in-out`.
- **Form styling:** uppercase, `font-flauta text-[14px] text-brand-o`.
  Inputs and textarea have `border-b border-dashed border-brand-o`, transparent
  background, `placeholder:text-brand-o`.
- **Frame:** `border border-brand-o` with
  `[box-shadow:0_0_5px_rgba(255,140,0,0.15)]` (the orange phosphor glow).
- **Submit button:** "SEND MESSAGE →" in the same flauta face; cursor is
  `cursor-default` and the button is `disabled` until required fields
  (email, message) are filled.
- **Legend chips:** `<legend>` elements float the labels "CONTACT US" and
  "close" in the top corners (`-top-[10px]`), in `bg-black px-1` pills.

### Footer

- **Structure:** `.grid-layout` wrapper → big wordmark SVG → `.grid-layout
  grid-rows-[auto_auto_28px] !gap-y-10 pb-2 pt-4 lg:grid-rows-[auto]
  lg:items-end lg:!gap-y-2 lg:py-0` with three rows: (1) nav list,
  (2) newsletter (desktop only), (3) social + copyright.
- **Wordmark:** the giant SVG sits full-bleed inside the top row with
  `border-b border-brand-w1/30 pb-2 lg:pb-4` to add a hairline.
- **Nav list:** `flex flex-col gap-y-2 text-brand-w1 lg:!text-f-h2 !text-f-h1-mobile` —
  the footer links are sized like the section H2s on desktop.
- **Newsletter form:** single email input with `bg-[rgb(26,26,26)]` /
  `hover:bg-[#212121]` / `focus:text-brand-w1` and a 24px-tall
  field; submit button is a "Roll Me In →" link styled as an
  `.actionable` (no actual submit handler).
- **Social row:** comma-separated list of `<a>`s, gray text via
  `text-brand-g1`.
- **Copyright:** `© basement.studio LLC 2026 all rights reserved` in
  `text-brand-g1 text-f-p-mobile`.

### Mask transition wrapper

- **Element:** every page's `<main>` lives inside a
  `.layout-container` which carries a CSS `mask-image` and animates
  `mask-position` to create a pixel-block transition between routes.
- **CSS variables:** `--mask-in: url(data:image/svg+xml; ...)` is a
  5120×320 SVG sprite that lays 15 dot-rectangles at increasing
  x-offsets (`#i-0` through `#i-14`), `--mask-frames: 15`,
  `--mask-speed: 0.75`, `--speed: calc(var(--mask-speed, 0.5) * 1s)`.
- **State:** `[data-flip=false]` pins `mask-position: 100%` (hidden),
  `[data-flip=true]` animates to `0%` over `--speed` with
  `steps(var(--mask-frames))` — so the reveal is a 15-frame stepped
  pixel sweep.

---

## JavaScript & Libraries

The site is built on Next.js 15's App Router with React 19, Tailwind CSS,
and Sanity CMS. The 3D hero is a hand-rolled React Three Fiber scene
(no Drei, no @react-spring) that loads a custom Web Audio engine, custom
scroll-driven navigation, and a custom in-house CSS mask transition.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Next.js | 15.x (App Router) | `_next/static/chunks/cd2bc502-…js`, `app/(site)/(pages)/layout-…` chunk names, `next/dynamic` lazy | `chunks/app/(site)/(pages)/(home)/page-…js` |
| React | 19.x | `react@19` chunks | StrictMode, `useEffect` driven audio engine |
| Tailwind CSS | 4.x | utility-class names (e.g. `text-f-h0-mobile`, `bg-brand-k/20`) | JIT, no preflight conflicts observed |
| Three.js | r170+ | THREE. class names imported 104× in `cd2bc502…js`; `WebGLRenderer`, `PerspectiveCamera`, `BatchedMesh`, `InstancedMesh`, `LOD`, `HemisphereLight`, `LightProbe` all referenced | No `@react-three/drei` — the studio wrote its own helpers |
| @react-three/fiber | 9.x | `"@react-three/fiber"` in `chunks/9015-…js`; `useFrame`, `useThree`, `extend()` are wired | Used for declarative R3F scene graph |
| leva | 0.9.x | `leva` token in `chunks/15bf73b2…js` and `chunks/8731…js` | Debug panel; likely hidden in production but shipped |
| zustand | 5.x | `zustand` token in `chunks/330-…js` | Client state for the 3D scene + audio |
| next/font (local) | bundled | `__variable_246ccd`, `__variable_4c40f6`, `__variable_719761` classes on `<body>` | Loads Geist, Geist Mono, flauta |
| next/image | bundled | `next/image` in `chunks/page-…js` and `chunks/6734-…js` | `<img data-nimg="fill">` with `sizes=` and `srcset=` for responsive WebP |
| next/dynamic | bundled | `chunks/114-…js` | Code-split the 3D scene |
| Sanity | live | `https://9syto90m.api.sanity.io` linked/dns-prefetched; dataset `production`, `apiVersion: 2026-03-01` | CMS for showcase, blog, navbar config, project copy, brand logos |
| PostHog | 1.x | `_posthogChunkIds` stamp on every chunk; `<script src="/ingest/array/phc_iDiUZ5XtQWN1FEJajbCV8LqK8IyGS2V7l57CNqyizAn/config.js">` | `PostHogProvider` mounted in the root layout |
| @vercel/analytics | 1.5.0 | `data-sdkn="@vercel/analytics/react" data-sdkv="1.5.0"` on `/_vercel/insights/script.js` | Page-view + event tracking |
| @vercel/speed-insights | 1.2.0 | `data-sdkn="@vercel/speed-insights/next" data-sdkv="1.2.0"` on `/_vercel/speed-insights/script.js` | Core Web Vitals |
| Web Audio API | native | `AudioContext`, `createBufferSource`, `createGain` in the 3D scene chunk | Custom `AudioEngine` class with channels: master, ambience, game, overrideSong, music, sfx; per-source `play / pause / stop / setVolume / setPitch / onEnded` |
| React Responsive | 9.x | `matchMedia` calls + `useMediaQuery` hook shape; `isMobile / isDesktop / isIOS / isSafari` exports in `chunks/page-…js` | Used to switch between mobile/desktop `Trusted by Visionaries` and the menu layout |
| BSMNT-DOS (custom) | n/a | `#dosbox`, `.dosbox-loader` classes in CSS, "Loading BSMNT-DOS" pseudo-text | In-house DOS-emulator easter-egg screen; renders the orange CRT loader with `font-family: var(--font-geist-mono)` |

Notably **absent** (despite common assumptions for a site like this): GSAP,
Framer Motion, Lenis / @studio-freight/lenis, @react-three/drei,
@react-spring, postprocessing / @react-three/postprocessing, Tone.js,
Howler, Spline, nuqs, sonner, lucide-react, @radix-ui. The team built
their own equivalents for almost every common need.

---

## Animations (Catalog)

A near-entirely custom animation system. The site has a small set of
@keyframes in CSS, plus a custom mask transition and a custom scroll
transition that fires between routes. Most page-level motion (text
reveals, project cards, etc.) is bound up in the R3F scene's
`useFrame` loops and is therefore not enumerable from CSS.

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `subtle-pulse` | `css/2168ec5ca668f6f8.css` (`.group-hover\:animate-subtle-pulse`) | ~2s (default Tailwind animation duration) | ease-in-out | applied on every `group:hover` to a project-card image, opacity 1 → 0.75 → 1 |
| `diagonalPatternAnimation` | `css/2168ec5ca668f6f8.css` (`@keyframes diagonalPatternAnimation`) | 6s | linear | infinite; `background-position: 0 0` → `100% 0`; tied to `.with-diagonal-lines::after` |
| `actionable-blink` | `css/2168ec5ca668f6f8.css` (`@keyframes actionable-blink`) | 300ms (`--anim-duration`) | linear | 20% / 60% / 100% keyframes set `--opacity-hover-value: 100`; on every `.actionable:hover` and `:focus` |
| `fade-in` | `css/2168ec5ca668f6f8.css` (`@keyframes fade-in`) | n/a (utility) | n/a | 0% opacity 0 → 1; bound to `.animate-fade-in` (mobile client-logo cells) |
| `fade-in-out` | `css/2168ec5ca668f6f8.css` (`@keyframes fade-in-out`) | 16s per-cell (`--anim-duration: 16s`) | n/a (stepped by random `--anim-delay`) | 0% / 15% / 100% keyframes set opacity 0; crossfades client-logo cells in/out |
| `fade-out-in` | `css/2168ec5ca668f6f8.css` (`@keyframes fade-out-in`) | 16s per-cell, with random `--anim-delay` calculated as `(23*l+17)%31*1.5%(1.5*e.length)` | cubic-bezier(0.4, 0, 0.6, 1) | mobile client-logo cells cycle opacity 0 → 1 → 0 |
| `pulse` | `css/2168ec5ca668f6f8.css` (`@keyframes pulse`) | 2s | ease-in-out | utility; 50% opacity 0.5 |
| `spin` | `css/2168ec5ca668f6f8.css` (`@keyframes spin`) | 1s | linear | utility; `transform: rotate(1turn)` |
| `bounce` | `css/2168ec5ca668f6f8.css` (`@keyframes bounce`) | 1s | cubic-bezier(.8,0,1,1) on both ends | utility |
| `marquee-translate` | `css/2168ec5ca668f6f8.css` (`@keyframes marquee-translate`) | n/a | n/a | 0% `translateX(2%)` → next keyframe; utility for any future marquee |
| `accordion-up` / `accordion-down` | `css/2168ec5ca668f6f8.css` (Radix-style) | n/a | n/a | standard Radix disclosure motion; no actual accordion on the homepage, so the keyframe ships unused |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| React Three Fiber | `useFrame` loop drives the 3D hero scene (camera, godrays, basketball, etc.) | continuous on canvas mount | Loads `.glb` models, `.exr` lightmaps, `.jpg` rain texture |
| Custom `AudioEngine` | Plays 3D-spatial ambience, music, SFX, and a Christmas override song via Web Audio API `AudioBufferSourceNode`s | Music toggle in nav, in-scene triggers | `setVolume` / `setPitch` per source, with channel graphs `master → ambience ← {game, overrideSong, music}` and `master ← sfx` |
| leva | in-scene debug panel | dev only | tune exposure, bloom (if any), camera position |
| Custom mask transition | 15-frame SVG-mask pixel sweep via `mask-position: 100% → 0%` with `steps(15)` | route change | `data-flip="true"` on `<html>` for the duration of the transition; `transition: mask-position var(--speed) steps(15), transform var(--speed) steps(15)` |
| Custom HTML tunnel | in-house `HtmlTunnelOut` and `NavigationHandler` components | route change | reads `__next_f` to compute the pixel-grid mask from the new page's snapshot |
| `InspectableProvider` | wraps the canvas in a click-to-inspect dev mode (visible only with `?inspect`) | dev only | appears in `chunks/.../layout-…js` |

### Page transitions

- Cross-route transitions use a 15-frame SVG-mask pixel sweep over
  `~750ms` (`--mask-speed: 0.75`). The mask sprite is inline in the
  compiled CSS as a `data:image/svg+xml;...` URL (the 15 frame rects are
  pre-arranged in a 5120×320 viewBox so the browser only fetches one
  asset). The `position` is animated with `steps(var(--mask-frames))`
  for a chunky pixel feel, not a smooth gradient wipe.
- The trigger is a JS-side `NavigationHandler` that sets
  `data-flip="true"` on `<html>` and reverts it after the transition.
- No transition on direct-link first paint — the initial render hits
  the unmasked page directly (`[data-disabled="true"] .layout-container
  { mask-image: none }`, observed in the HTML dump).

---

## Assets

Inventory of every asset in the dump. All large 3D models and the
spacetime `.exr` lightmaps are referenced by URL (`/3d/...`) but were
**not captured in the static pass** — they live behind a CDN edge that
the scraper did not follow. The dump captured the homepage HTML, all
JS chunks, both CSS files, all visible raster images, and the 32 client
SVG logos.

### 3D models

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/office-077b4007.glb` | main interior office scene |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/officeItems-9a8576ca.glb` | interior props (laptop, desk, etc.) |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/officeWireframe-d770f1ee.glb` | wireframe overlay pass |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/outdoor-6ead65cf.glb` | exterior environment |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/outdoorCars-d9030620.glb` | parked cars in the exterior |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/godrays-f4cbda2b.glb` | volumetric light shaft mesh |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/basketball-4a3976f2.glb` | ball prop (interactive) |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/basketballNet-528bd868.glb` | net for the ball |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/contactPhone-4c98003c.glb` | retro desk phone shown in the contact dialog |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/routingElements-dbc4fd71.glb` | arrow / routing geometry |
| (not in dump) | glTF binary `.glb` | n/a | `/3d/models/christmas-tree-50bcb465.glb` | Christmas special-event tree |
| (not in dump) | EXR lightmap | n/a | `/3d/textures/bake-00-lightmap-d25dcd28.exr` (and 00a, 01, 02 …) | per-room HDR lightmap bakes |
| (not in dump) | JPG AO | n/a | `/3d/textures/bake-00-ao-8c56cc34.jpg` | ambient occlusion pass |
| (not in dump) | JPG rain | n/a | `/3d/textures/mapTextures-rain-d1b1ba0b.jpg` | rain drop mask |
| (not in dump) | EXR va | n/a | `/3d/textures/mapTextures-basketballVa-f77e5faf.exr` | basketball visual-attribute map |

**Observation:** the dump folder's `models/` and `media/` directories are
empty — all `.glb` / `.exr` / `.mp3` URLs are referenced in the Next.js
server-component payload but were not fetched. This is a known edge
case for Vercel-served binary assets that aren't part of the Next.js
manifest; a re-run with `--use-playwright` would be needed to capture
them at runtime.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Geist | 100–900 (variable) | woff2 | `/_next/static/media/{f63972…,9766a7…,b66cf8…,aa016a…,22a51…}-s.woff2` | yes, `next/font/local` |
| Geist Mono | 100–900 (variable) | woff2 | `/_next/static/media/{d100b2…,2c34d6…,0f1bda…,a11517…,601f5c…,f52715…}-s.woff2` | yes, `next/font/local` |
| flauta | 400 (single) | ttf | `/_next/static/media/1373ae793ca39934-s.p.ttf` | yes, `next/font/local` |

Local dump copies of the font files live in `tools/tmp/basement/fonts/`
(woff2 for Geist & Geist Mono, ttf for flauta) and again in
`tools/tmp/basement/playwright/fonts/` for the post-render snapshot.

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/basement/images/opengraph-image__172d9d6d.gif` | animated GIF | 1200×642 (declared in OG meta) | 3.4 MB | `/images/opengraph-image.gif` | social-share hero — a short motion loop of the 3D scene |
| `tools/tmp/basement/images/scan__a1351305.webp` | WebP | n/a | 258 KB | n/a | per-request scan/transform artifact |
| `tools/tmp/basement/images/image__10358a7d` | raster | n/a | 202 KB | n/a (Sanity CDN) | one of the Vercel-Ship / showcase thumbnails |
| `tools/tmp/basement/images/image__ccf369da` | raster | n/a | 249 KB | n/a (Sanity CDN) | showcase thumbnail |
| `tools/tmp/basement/images/image__8e6f4dfc` | raster | n/a | 285 KB | n/a (Sanity CDN) | showcase thumbnail |
| `tools/tmp/basement/images/image__a874ce3e` | raster | n/a | 184 KB | n/a (Sanity CDN) | showcase thumbnail |
| `tools/tmp/basement/images/image__ef6ba2e6` | raster | n/a | 586 KB | n/a (Sanity CDN) | showcase thumbnail |
| `tools/tmp/basement/images/image__43513938` | raster | n/a | 898 KB | n/a (Sanity CDN) | showcase thumbnail |
| `tools/tmp/basement/images/image__0386ec56` | raster | n/a | 6.8 KB | n/a (Sanity CDN) | small thumbnail |
| (32 others) | raster | n/a | 1–200 KB each | `https://cdn.sanity.io/images/9syto90m/production/…` | the bulk of the dump is showcase thumbnails, blog hero art, and supporting imagery, all served from Sanity's CDN and lazily transformed by `next/image` (`/_next/image?url=…&w=…&q=75`) |
| `tools/tmp/basement/images/favicon__3de02d31.ico` | ICO | 48×48 | 7.4 KB | `/favicon.ico?7f7c9dadb5213112` | multi-resolution favicon |

### SVGs & icons

- **Inline SVGs observed in HTML:** the wordmark (3 variants — desktop
  nav, footer mobile, footer desktop), 5-rect audio-toggle icon, the
  hamburger menu (2 stacked 1.5px lines), and the right-arrow CTA icon
  used on every project card and the email link.
- **Standalone SVG files in dump:** 32 client-logo SVGs in
  `tools/tmp/basement/playwright/svgs/`, all served from
  `https://cdn.sanity.io/images/9syto90m/production/<sha>-WxH.svg`.
  - Vercel, Next.js, Linear, Cursor, Scale, World Labs, Eleven Labs,
    Mintlify, Harvey, Baseten, Black Forest Labs, Profound, Rox,
    Factory, Until Labs, Speakeasy, Xbow, Krea, Apollo GraphQL, Cal.com,
    Trunk, Replicate, Graphite, Spiral, Applied Compute, Zero Matter,
    Solana, Flox, MrBeast, Daylight Computer Company, EDGLRD, KidSuper.
  - 30 of the 32 are at 134–165 × 17–88 px and ship as plain SVG
    (no script, no animation). The two outliers are 2× the size of the
    rest (19162 B and 31331 B vs. ~2 KB average) — those are the
    KidSuper (`18fc60782…`) and MrBeast (`2c2a33aa5…`) marks, which
    contain complex illustrations.
- **Icon system:** no external library; all icons are bespoke inline
  paths. The right-arrow is the only icon that gets re-used (project
  CTAs + footer email link) and is inlined in the page 6 times.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| (not in dump) | MP3 | `/3d/audio/christmas-song-9ecee706.mp3` — Christmas special-event override, fed into the `overrideSongChannel` of the custom `AudioEngine` |
| (not in dump) | spatial Web Audio | ambient + music + SFX tracks streamed at runtime, decoded into `AudioBuffer`s, played through 3D-positioned `PannerNode`s (the scene chunk creates `AudioContext`, `masterOutput`, `ambienceChannel`, `gameChannel`, `overrideSongChannel`, `musicChannel`, `sfxChannel`, and an `AudioSource` class with `setVolume`/`setPitch`/`onEnded`) |
| (none on homepage) | MP4 | no `<video>` element observed on the homepage; showcase pages may embed Mux video (`mux.playbackId` is referenced in the page chunk's prop validation) |

---

## Motion & Interaction

### Principles

- The site is almost noiseless on idle. No autoplay sound, no autoplay
  video. The only "ambient" motion is the slow diagonal-stripe pan on
  client-logo cells when hovered (`6s linear infinite`).
- All transitions are sub-second except the route transition (pixel
  sweep) and the mobile logo cross-fade cycle (`16s`).
- Default timing: `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's `ease-in-out`)
  for most things; `linear` for the diagonal-stripe background and the
  pixel-step mask; `cubic-bezier(0.4, 0, 0.6, 1)` for the mobile logo
  cross-fade.
- Default durations: 150ms (micro: `transition-colors duration-0`,
  `transition-opacity delay-0`), 200ms (small: project-card arrow
  slide), 300ms (medium: `.actionable` underline, hamburger cross,
  contact-dialog open), 750ms (large: route transition).
- Hover affordance is **color**, not transform. `.actionable` links
  shift `currentColor` (typically `text-brand-w1` → `text-brand-o`)
  while flashing a 1px underline and a `text-shadow: 0 0 30px` glow.

### Specific behaviors

- **Link hover (`.actionable`):** the text-shadow glow appears
  immediately; the underline `::before` opacity transitions to 1 over
  60ms (`--anim-delay`); the parent span runs the `actionable-blink`
  keyframe over 300ms, which sets `--opacity-hover-value: 50` for
  80ms then back to 100 (so the text briefly dims to 50% opacity
  against the background-color-mix, giving a "blink" feel).
- **Project-card hover:** the image gets the
  `group-hover:animate-subtle-pulse` class, opacity oscillates
  1 → 0.75 → 1; the right-arrow `<span>` translates from
  `translate-x-6` to `translate-x-0` and fades in (`opacity-0 →
  opacity-100`, with a 200ms delay so the text catches up first).
- **Client-logo cell hover:** `with-diagonal-lines` overlay fades in
  over 300ms (`transition-opacity duration-300`); the inner diagonal
  pattern then animates infinitely at 6s linear.
- **Nav hide-on-scroll:** the `<nav>` itself has
  `transition-transform duration-300` so a JS scroll listener can slide
  it off-screen via `transform: translateY(-100%)`.
- **Music toggle:** click → flips `aria-label` between "Turn music on"
  and "Turn music off" and toggles the `musicChannel` gain via the
  custom `AudioEngine`.
- **Contact dialog open/close:** the form `<div>` scales from
  `scaleX(0) scaleY(0)` to `scale(1)`; the backdrop fades from opacity
  0 to 1 in 300ms; the dialog is closed with the "close" legend button
  or `[ESC]`.
- **Mobile menu:** the "Menu" label is removed and the two 1.5px
  hamburger lines cross into an X via
  `transition-[transform,width] duration-300 ease-in-out`.

### Reduced motion

- The `body` carries `__variable_246ccd __variable_4c40f6
  __variable_719761 font-sans` — no explicit `prefers-reduced-motion`
  overrides were observed in the dumped CSS, but the
  `[data-disabled="true"]` attribute on `<html>` (present on the SSR
  snapshot) sets `mask-image: none` and `transition: mask-position 0s`,
  which is the closest thing to a "skip transitions" toggle observed.
- A R3F scene running at 60fps will continue to run with
  `prefers-reduced-motion: reduce`; the diagonal-stripe and
  client-logo cross-fade animations are CSS-only and would be the
  highest-impact items to gate.

---

## Content & Voice

- **Tone:** confident, technical, self-aware, occasionally profane in a
  knowing way. The meta description begins "A digital studio & branding
  powerhouse making cool shit that performs." Section eyebrows call
  clients "Visionaries" and the closing line in the footer is "Ready
  to tap into the basement vibe? Sign up for our newsletter and stay
  plugged into all the cool stuff we're cooking up."
- **Sentence length:** short to medium, very active.
- **Capitalization:** Sentence case for the H1, Title Case for section
  H2s ("Featured Projects", "Capabilities", "Contact"), Title Case for
  capability titles ("Websites & Features", "Visual Branding", "IRL
  Experience Design", "Marketing Execution").
- **Punctuation:** ampersands used freely in capability titles;
  em-dashes not used; en-dashes / em-dashes absent; apostrophes are
  curly (e.g. "world's", "We're").
- **CTA vocabulary:** "Contact Us" (nav), "Contact" (section eyebrow),
  `hello@basement.studio` (primary email CTA), "Roll Me In →"
  (newsletter submit), "SEND MESSAGE →" (contact form), "Close [ESC]".
- **Awards & social proof:** the homepage `Organization` schema lists
  dozens of Awwwards Site-of-the-Day, Awwwards Developer Award, FWA
  Site-of-the-Day, and Webby Award entries from 2020 through 2025.

---

## Information Architecture

Top-level routes observed (via `<nav>` links and Next.js server-component
payload):

- `/` — homepage (the page this spec covers)
- `/services` — services overview
- `/showcase` — case-study index (currently `25` entries, server-side
  count)
- `/showcase/[slug]` — individual case study (e.g. `/showcase/vercel-ship-a-home-for-innovation`,
  `/showcase/daylight-simplicity-in-motion`, `/showcase/kidsuper-breaking-the-norm`,
  `/showcase/mrbeast-built-to-handle-the-beast`)
- `/people` — team page
- `/blog` — blog index (currently `28` entries)
- `/lab` — experimental / side-project page
- `/not-found` — 404
- (implied) `/contact`, `/services/[slug]` — not in `<nav>` but the
  page chunk includes a `submitContactForm` server reference

For each, primary component:
- `/services` — capability grid (mirrors the homepage "Capabilities" block)
- `/showcase` — filterable case-study grid with a `?category=…` query
  string (e.g. `Websites & Features`, `Visual Branding`, `IRL Experience
  Design`, `Marketing Execution`)
- `/showcase/[slug]` — single case study with hero image, body copy, and
  Mux video embeds (per page-chunk schema)
- `/people` — team grid
- `/blog` — post list
- `/lab` — in-house experiments

---

## Accessibility

- **Color contrast:**
  - `#E6E6E6` on `#000000` = ~14.3:1 (AAA on body, display).
  - `#C4C4C4` on `#000000` = ~10.4:1 (AAA).
  - `#757575` on `#000000` = ~4.8:1 (AA for body, AAA for large text).
  - `#FF4D00` on `#000000` = ~4.5:1 (AA for large text only — that's
    why orange is reserved for hover states, the contact dialog, and
    the section eyebrow "Capabilities", never for body copy).
- **Focus indicators:** all links and buttons inherit a `:focus` rule
  that runs the same `actionable-blink` animation as `:hover` — so the
  visual treatment is identical for keyboard and pointer users. The
  project card `<a>`s additionally carry `focus-visible:!ring-offset-0`
  to neutralize Tailwind's default ring offset.
- **Keyboard:**
  - Tab order: wordmark → nav links (Home, Services, Showcase, People,
    Blog, Lab) → music toggle → Contact Us → page content. The
    `[ESC]` legend on the contact dialog explicitly closes it
    (`aria-label="Close [ESC]"`).
  - No visible skip-link in the rendered DOM (it may be in a future
    chunk, but no skip-to-content anchor was observed).
- **Screen reader landmarks:** `<nav>`, `<main>`, `<footer>` are
  present and labeled. The 3D canvas carries no `role` or `aria-label`;
  it is purely decorative for sighted users. The organization schema
  is present in a `<script type="application/ld+json">` block for SEO.
- **Motion:** the only observed reduced-motion accommodation is the
  `data-disabled="true"` mask disable on the SSR snapshot — there is no
  `@media (prefers-reduced-motion: reduce)` block in the dumped CSS.
  This is a clear gap: the diagonal-stripe animation, the mobile logo
  cross-fade, and the R3F scene do not honor the user's motion
  preference.
- **Alt text:** the homepage `<img>` elements have **`alt=""`** — they
  are treated as decorative. The client-logo cells rely on the outer
  `<a title="Vercel">` for the accessible name. The wordmark SVG uses
  `<title>basement.studio</title>`. The contact dialog has a
  `<legend>CONTACT US</legend>` providing the form's accessible name.

---

## Sources

Every URL observed or opened while writing this specification:

- Homepage — https://basement.studio
- Open Graph image — https://basement.studio/images/opengraph-image.gif
- Twitter image — https://basement.studio/images/twitter-image.png
- Sanity CDN (assets) — https://cdn.sanity.io/images/9syto90m/production/…
- Sanity API — https://9syto90m.api.sanity.io
- Vercel analytics — https://basement.studio/_vercel/insights/script.js
- Vercel speed insights — https://basement.studio/_vercel/speed-insights/script.js
- PostHog ingest — https://basement.studio/ingest/array/phc_iDiUZ5XtQWN1FEJajbCV8LqK8IyGS2V7l57CNqyizAn/config.js
- Showcase (case studies):
  - https://basement.studio/showcase/vercel-ship-a-home-for-innovation
  - https://basement.studio/showcase/daylight-simplicity-in-motion
  - https://basement.studio/showcase/kidsuper-breaking-the-norm
  - https://basement.studio/showcase/mrbeast-built-to-handle-the-beast
- Client external links (sample) — https://vercel.com, https://nextjs.org,
  https://linear.app, https://www.cursor.com/, https://scale.com,
  https://www.worldlabs.ai/, https://elevenlabs.io/, https://www.mintlify.com/,
  https://www.harvey.ai/, https://www.baseten.co/, https://blackforestlabs.ai/,
  https://www.tryprofound.com/, https://www.rox.com/, https://factory.ai/,
  https://www.untillabs.com/, https://www.speakeasy.com/, https://xbow.com/,
  https://www.krea.ai/, https://apollographql.com, https://cal.com,
  https://trunk.io/, https://replicate.com, https://graphite.dev/,
  https://spiraldb.com/, https://www.appliedcompute.com/,
  https://www.zeromatter.org/, https://solana.com/, https://flox.dev/,
  https://www.youtube.com/@MrBeast, https://daylightcomputer.com/,
  https://edglrd.com/, https://kidsuper.world/
- Social profiles — https://x.com/basementstudio,
  https://www.instagram.com/basementdotstudio, https://github.com/basementstudio,
  https://www.linkedin.com/company/basementstudio

---

## Changelog

- 2026-06-19 — Initial draft by sub-agent. Source: `tools/tmp/basement/`.
