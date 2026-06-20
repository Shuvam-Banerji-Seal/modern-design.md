# Bureau Cool — design.md

> A structured design specification of **https://bureau.cool**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/bureau-cool/` (gitignored)

---

## Overview

Bureau Cool is a boutique design studio that frames itself as a digital
partner for brands, artists, and cultural institutions. The homepage is
an editorial one-pager: a fixed-type "title card" sits above a vertical
sequence of project references (cards with draggable hero imagery),
followed by a long Information section listing services, clients, press
features, and contact. The aesthetic is a deliberate clash between two
custom self-hosted typefaces — a heavy uppercase monospaced sans for
chrome and labels, and a quirky narrow serif for headlines and metadata —
on a warm mid-grey (`#DEDEDE`) background, with very generous vertical
rhythm and small grey "pill" controls. A second route, `/0000`, is a
shop surface that swaps the document body for a full-viewport Three.js
canvas with a shopping cart overlay. The visual register is restrained,
art-directed, and unmistakably a portfolio site.

**Category:** Marketing / Portfolio
**Primary surface observed:** Homepage (`/`) + Shop (`/0000`)
**Tone:** Editorial, art-directed, restrained; one-uppercase; serious
**Framework detected:** SvelteKit (Vite) + Tailwind CSS v4

---

## Visual Language

### Color

The palette is monochromatic on a light grey field, with a single bright
accent (`--color-yellow-300`) reserved for highlight states and the
occasional red (`--color-red-600`) for the destructive / cart indicator.
Neutral steps in Tailwind's `oklch()` scale provide the only ramp.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--color-greey` | `#DEDEDE` | Warm light grey, applied to `<html>` |
| Background (subtle) | `--color-neutral-200` | `#EDEDED` (oklch 92.2% 0 0) | Subtle borders, faint dividers |
| Background (elevated) | `--color-white` | `#FFFFFF` | Pill button fill, card chrome |
| Background (inverted) | `--color-neutral-900` | `#343434` (oklch 20.5% 0 0) | Dark overlay variants |
| Background (modal) | `.shop` | `#000000` | Hard black for the shop page |
| Text (primary) | `--color-black` | `#000000` | Body text on grey bg |
| Text (secondary) | `--color-neutral-500` | `#8E8E8E` (oklch 55.6% 0 0) | Captions, metadata dates |
| Text (muted) | `--color-neutral-400` | `#B5B5B5` (oklch 70.8% 0 0) | Tertiary labels |
| Text (on dark) | `--color-white` | `#FFFFFF` | Pill labels over media |
| Border (default) | `--color-black` | `#000000` | 1px hairline on pills |
| Border (subtle) | `border-neutral-200/20` | `#E5E5E533` | Translucent dividers |
| Border (hover) | `border-white/20` | `#FFFFFF33` | Pill hover state over imagery |
| Accent | `--color-yellow-300` | `#FDE047` (oklch 90.5% .182 98.111) | Highlight callouts |
| Accent (warn) | `--color-red-600` | `#DC2626` (oklch 57.7% .245 27.325) | Destructive / cart count |
| Overlay (scrim) | `bg-black/20` | `#00000033` | Chip backgrounds |
| Overlay (scrim 2) | `bg-black/50` | `#00000080` | Card scrim |
| Overlay (scrim 3) | `bg-black/80` | `#000000CC` | Heavy veil |
| Overlay (scrim 4) | `bg-black/90` | `#000000E6` | Modal scrim |
| Pane (mid) | `bg-neutral-500/60` | `#8E8E8E99` | Tag chip bg |
| Pane (light) | `bg-greey/50` | `#DEDEDE80` | Pill base fill |
| Pane (mid-strong) | `bg-neutral-700` | `#5E5E5E` (oklch 37.1% 0 0) | Hover surface |

The site is **light-mode only** — there is no `@media (prefers-color-scheme: dark)`
override in any stylesheet. The shop page forces a hard black ground
(`background: #000` on `.shop`) regardless of system setting.

### Typography

Two self-hosted, custom-licensed faces drive the entire site. Both are
`.woff2`-only, declared with `font-display: swap`, served from
`https://bureau.cool/fonts/…/font.woff2` (Vite-emitted paths:
`/_app/immutable/assets/…woff2`).

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display serif (`.bigserif`) | `"CentSchbookMonoBTWXX-Rg", serif` | 400 | mobile `6.3vw`, ≥sm `5vw` | mobile `5.9vw`, ≥sm `1` | `normal` |
| Display sans (`.bigsans`) | `"ArialMonospaced-Bold", system-ui, sans-serif` | 400 (font is intrinsically Bold) | mobile `6.1vw`, ≥sm `4.8vw` | mobile `5.8vw`, ≥sm `1` | `normal` |
| Mid serif (`.midserif`) | `"CentSchbookMonoBTWXX-Rg", serif` | 400 | mobile `5.4vw`, ≥sm `3.5vw` | mobile `5.7vw`, ≥sm `3.7vw` | `normal` |
| Body S sans (`.smallsans`) | `"ArialMonospaced-Bold", system-ui, sans-serif` | 400 | `--text-xs` (`0.75rem` = 12px), md `--text-sm` (`0.875rem` = 14px) | tight `1.25` (`calc(1/.75)`), md tight `1.25` | `normal` |
| Body S serif (`.smallserif`) | `"CentSchbookMonoBTWXX-Rg", serif` | 400 | mobile `0.78rem` (≈12.5px), md `0.89rem` (≈14.2px) | `1.25` (inherits) | `normal` |
| Body (default) | `var(--default-font-family)` | 400 | `1rem` (16px) | `1.5` | `normal` |
| Monospace (never used in body, declared for completeness) | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | 400 | `1em` | `1.5` | `normal` |

`--font-sans` and `--font-serif` are the only two font tokens; everything
else cascades from `--default-font-family = var(--font-sans)`. Sizing is
**vw-driven for display, rem-driven for UI**. Tracking is uniformly
`normal` (no `letter-spacing` overrides). All copy is uppercased via the
`.uppercase` utility — there are no mixed-case sentences in the
homepage's primary content.

`@font-face` declarations (verbatim, from
`tools/tmp/bureau-cool/css/app.DIPekTPO__3e618f48.css`):

```css
@font-face{
  font-family: ArialMonospaced-Bold;
  src: url(../../../fonts/ArialMonospaced-Bold/font.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap
}
@font-face{
  font-family: CentSchbookMonoBTWXX-Rg;
  src: url(../../../fonts/CentSchbookMonoBTWXX-Rg/font.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap
}
```

### Spacing & radius

The site uses Tailwind v4 with a **4px base** (`--spacing: .25rem`).

- **Base unit:** 4px
- **Scale (CSS vars / tokens):** `--spacing` × {0, 0.5, 1, 1.5, 2, 3, 4,
  5, 6, 8, 12, 16, 24, 32, 36, 40, 56, 60, 64, 70, 72, 80, 88, 100, 360}
  = 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 48, 64, 96, 128, 144, 160, 224,
  240, 256, 280, 288, 320, 352, 400, 1440 px.
- **Section spacing:** very large — `mb-32` (128px), `mb-40` (160px),
  `mb-56` (224px), `mb-60` (240px), `mb-64` (256px) are common between
  homepage sections; `gap-y-32` (128px), `gap-y-60` (240px), `gap-y-72`
  (288px) control the project list rhythm.
- **Container max widths:** `--container-xs` 20rem (320px), `--container-sm`
  24rem (384px), `--container-md` 28rem (448px), `--container-lg` 32rem
  (512px), `--container-2xl` 42rem (672px), `--container-4xl` 56rem
  (896px), `--container-6xl` 72rem (1152px). Custom cap: `md:max-w-360`
  (1440px) for the project list wrapper.
- **Radii:** `--radius-md: .375rem` (6px), `--radius-lg: .5rem` (8px),
  full = `3.40282e38px` (effectively 9999px, used as pill).
- **Shadows:** Two utility shadows: `--drop-shadow-xl: 0 9px 7px
  #0000001a` (10% black) and `--drop-shadow-2xl: 0 25px 25px #00000026`
  (15% black). A custom in-page drop shadow
  `drop-shadow-[0_0px_35px_rgba(255,255,255,0.2)]` is applied to dark
  surfaces. The modal overlay uses `box-shadow: shadow-2xl` on
  floating cards. No `box-shadow` is applied at the body level.
- **Text shadow:** `text-shadow: 0 0 5px rgb(0 0 0 / 40%)` available as
  utility, used on light text over imagery.

### Iconography

- **Style:** inline SVG via `<svg>` elements inside the component; **no
  third-party icon library** is loaded (no Lucide, Phosphor, or Heroicons).
  The favicon set (16×16, 32×32 PNG, 180×180 apple-touch) is raster,
  not vector.
- **Default size:** 16px (`w-4 h-4`) for the small navigation chevron
  circle (`bg-neutral-500/60 rounded-full`), 24px (`w-6 h-6`) on `lg`
  breakpoints, 8px (`text-[8px]`) for the "count" badge corner labels.
- **Geometry:** A single recurring motif is the small filled circle
  (`rounded-full w-4 h-4`) used both as a bullet dot and as a draggable
  grab handle, and a single arrow-head-shaped chevron inside it.

---

## Layout & Grid

- **Max content width:** No global container; sections fill the viewport
  but text caps at `max-w-[90vw]` (mobile) / `max-w-[80vw]` (≥sm) for
  the title block, `max-w-md` (28rem) for the address block, and
  `md:max-w-360` (90rem) for the project list.
- **Page gutter:** `padding: calc(var(--spacing) * 3)` = 12px mobile,
  `padding: calc(var(--spacing) * 5)` = 20px on `md`+ (the `.padding`
  utility applied to the root wrapper). Hero block uses 16px
  (`inset-x-4`) on mobile.
- **Grid:** Mobile is a single-column flex/grid flow. At `md` (≥768px)
  the lower content blocks switch to `grid-cols-3` (three-column grid
  for Services / Clients / Features). At `lg` (≥1024px) the project
  list becomes a `flex flex-row gap-x-5 md:gap-x-10` (5–10 column-gap)
  horizontal rail of card columns. At `xl` (≥1280px) the section gap
  bumps to `gap-y-72` (288px).
- **Breakpoints** (Tailwind defaults):
  - `sm` = 40rem (640px)
  - `md` = 48rem (768px) — primary breakpoint for layout shift
  - `lg` = 64rem (1024px)
  - `xl` = 80rem (1280px)
  - `2xl` = 96rem (1536px)
- **Vertical rhythm:** baseline grid of 4px (`--spacing: .25rem`) but
  the editorial rhythm operates in much larger jumps: 32px, 64px, 96px,
  128px, 240px between blocks.
- **Z-index scale:** Tailwind v4 utility classes plus four custom tokens
  defined in `@layer theme`: `--z-index-60: 60`, `--z-index-80: 80`,
  `--z-index-100: 100`. The site also references `z-[110]` as a literal
  for the bottom controls layer. Concrete stacking observed: bottom
  controls `z-[110]`, drag-handle parent `z-80`, top-right pill stack
  `z-80`, count badge `z-40`, hover scrim `z-30`, marquee `z-30`,
  shop canvas `z-20`, media overlay `z-10`.

The homepage begins with a full-viewport (`h-screen w-full`) hero
containing the bigserif wordmark + bigsans subtitle anchored top-left,
with two `.smallsans` pill controls ("Projects", "Information") just
below. Below the fold the layout flows: a `recentupdates` marquee
strip (referenced in the SvelteKit hydration payload), then a
horizontally-draggable project rail with one card per project, then an
information section (`#information`) laid out as a 12-column grid with
`info-b bigsans` (the big headline), `info-s smallsans` (the secondary
intro paragraph), a `Mail / IG` contact row, and three columns
(Services / Clients / Press). A `Features` list with date stamps
closes the page. The `/0000` shop route replaces this body with a
fixed `<canvas class="fixed inset-0 z-20 cursor-grab">` (Three.js
viewport) plus a top-right pill stack, a bottom-left "Cart" indicator,
and a placeholder product overlay.

### Section-by-section layout map (homepage)

| Section | Container | Major children | Mobile → md shift |
| --- | --- | --- | --- |
| Hero (`#start`) | `<div class="relative h-screen w-full">` | bigserif wordmark, bigsans subtitle, two pill buttons (`Projects`, `Information`) | `h-screen` retained; content re-flows from `top-0 left-0` to `top-0` |
| Recent updates marquee | `<div class="absolute top-0 left-0">` over hero | inline `<div class="max-w-[90vw] sm:max-w-[80vw]">` + buttons | `max-w-[80vw]` cap |
| Drag handle | `<div class="fixed z-80 top-0 left-0 backface-hidden md:cursor-grab pointer-events-none">` | image / video | positioned by inline `translate3d` |
| Recent work rail | `<div class="relative mb-40 md:mb-64 overflow-x-hidden">` | per-project `<span class="mb-12 inline-block smallsans">` + title | `mb-64` (256px) bottom margin |
| Per-project block | `<div class="mb-28 md:mb-60">` | date strip + title + dot | `mb-60` (240px) |
| Marquee / ticker | `<span class="mb-32 md:mb-36 inline-block smallsans">` | running text | `mb-36` (144px) |
| Information (`#information`) | `<div class="info-b bigsans mb-9 w-[95vw] md:w-[88vw]">` + `<div class="info-s mb-5 smallsans max-w-lg">` | bigsans headline + secondary paragraph | `w-[88vw]` cap on `md`+ |
| Contact | `<div class="smallsans mb-20 md:mb-32">` | `Mail` / `IG` rows | `mb-32` (128px) |
| Services / Clients / Awards | `<div class="gap-y-8 md:gap-y-0 md:grid-cols-3 grid smallsans mb-20 md:mb-32 md:w-3/4">` | three `<div>` columns each with `<h4>` + flat list | stacks vertically with `gap-y-8`, becomes 3-column grid on `md` |
| Internships | `<div class="blockt">…<p>Get in touch if you're a dedicated learner…</p>` | portable text | inline |
| Features | `<div class="mb-32 smallsans">` | per-row `<span class="flex leading-tight basic-hover">` with date column + link | flat list |

---

## Components

### Pill button (nav)

- **Anatomy:** a `<button>` containing an absolutely-positioned
  rounded background (`<div class="z-10 rounded-lg overflow-hidden
  border absolute inset-0 pointer-events-none bg-greey border-black">`)
  and a centered `<span class="z-20 text-center smallsans leading-none">`
  label. The background acts as the "chrome" so the label can scale
  independently.
- **Padding:** mobile `px-2.5 py-1` (10×4px), `md:px-3 md:pb-0.5 md:pt-1`
  (12px × 2–4px).
- **Typography:** `.smallsans` (ArialMonospaced-Bold, 14px on md,
  12px mobile, uppercase, line-height `1`).
- **Border:** 1px solid `--color-black`; on hover (md+) the border
  transitions to `border-white/20` over a backdrop-blur surface.
- **States:**
  - **default:** `bg-greey`, black border
  - **hover (md+):** label scales to `0.95`, button wrapper scales to
    `0.9999`, border fades to white/20 — 150ms ease-out
  - **active:** none observed
  - **disabled:** no observed case
- **Radius:** 8px (`.rounded-lg`).

### Pill button — count badge (overlay variant)

- **Position:** `-top-1 -right-3` (4px above, 12px right of parent
  pill).
- **Anatomy:** `<span class="absolute -top-1 -right-3 text-[8px] z-40
  bg-neutral-500 px-1 py-0.5 rounded-md text-white">…</span>`.
- **Type:** 8px ArialMonospaced-Bold uppercase, white on
  `bg-neutral-500` (#8E8E8E).
- **Radius:** 6px (`.rounded-md`).

### Circle bullet / grab dot

- **Anatomy:** `<div class="bg-neutral-500/60 rounded-full w-4 h-4 flex
  items-center justify-center cursor-pointer md:group-hover:bg-neutral-200
  md:transition-all md:ease-out">` containing a small caret/glyph SVG.
- **Size:** 16px mobile, 24px (`md:w-6 md:h-6`) on `md`, 32px (`lg:w-8
  lg:h-8`) on `lg`.
- **State:** background fades to `bg-neutral-200` (#EDEDED) on
  `md:group-hover`, easing `md:ease-out`, transition `md:transition-all`.

### Draggable hero card

- **Anatomy:** outer `<div class="fixed z-80 top-0 left-0 backface-hidden
  md:cursor-grab pointer-events-none" style="transform: translate3d(...,
  ..., 0px); width: 360px; height: 202.5px;">` (positioned via inline
  `translate3d` from JS) wrapping an image / video element. Two resize
  affordances (`cursor-w-resize`, `cursor-e-resize`) sit at the left/right
  edges.
- **Behavior:** `backface-hidden` + `pointer-events-none` parent so the
  drag handle floats above but does not block underlying content.
  Resize is interactive (`md:hover:scale-[1.02]` etc. available).

### Project list entry

- **Anatomy:** `<div class="relative mb-40 md:mb-64 overflow-x-hidden">`
  containing one or more `<span class="mb-12 inline-block smallsans">`
  category tags (date / role labels) and a title block (`.midserif` or
  `.bigsans`) with `max-w-md`. Each project is preceded by a 16–32px
  filled black dot (`<div class="w-4 md:w-6 lg:w-8 h-4 md:h-6 lg:h-8
  top-1.5 md:top-4 absolute rounded-full bg-black">`).
- **Typography:** dates / categories in `.smallserif` (Century Schoolbook
  Mono, ~12.5–14.2px), titles in `.bigsans` or `.midserif`.
- **States:** entries are wrapped in `<a class="basic-hover">` (parent
  hook) which sets `opacity: .5` on hover and back to `1` on
  `grey-hover`.

### Marquee strip (`recentupdates`)

- **Anatomy:** horizontally-scrolling strip rendering the latest
  project ("/0000 new items" per the SvelteKit data payload), using the
  `.animate-[blink_1.5s_linear_infinite]` cursor blink + `moveleftright`
  CSS animation.
- **Visual:** tight uppercase `.smallsans` text on the `#DEDEDE` field;
  scrolls right-to-left with periodic opacity dips at the loop seam.

### Information card (`.blockt`)

- **Anatomy:** `<div class="blockt">…<p>…</p></div>` containing portable
  text blocks; uses `@apply` in SvelteKit `<style>` blocks for `pb-3`
  between paragraphs and `block uppercase` for h2/h3.
- **Type:** inherits from parent (`.info-b bigsans` for the headline
  block at `69.12px`, `.info-s smallsans` for the secondary block).

### Press / features row

- **Anatomy:** `<span class="flex leading-tight basic-hover"><span
  class="w-24 md:w-48 grow-0 shrink-0 inline-block smallserif relative">YYYY-MM-DD</span>
  <a class="basic-hover" target="_blank" href="…">…</a></span>` —
  date (`.smallserif`, fixed-width column 96px mobile / 192px `md`) +
  press title link.
- **Hover:** opacity 0.5 → 1, link color stays `--color-black`.

### Tracer / progress circle (`.cp`)

- **Anatomy:** SVG circle pair (`.bg` track + `.fg` progress), wrapped in
  `<div class="cp pointer-events-none absolute inset-0 h-full w-full">`.
- **Geometry:** `--size: 250px`, `--stroke-width: 15px`,
  `--circumference: π × (size − stroke-width)`, `--dash: progress% ×
  circumference`.
- **Track:** `stroke: #555`. **Foreground:** `stroke: #fff`,
  `stroke-linecap: round`, `transform: rotate(-90deg)`,
  `stroke-dasharray: var(--dash) calc(var(--circumference) −
  var(--dash))`.
- **Transition:** `stroke-dasharray .3s linear` on the foreground stroke.
- **Source CSS:** `tools/tmp/bureau-cool/css/tracking-plausible.FPtqOaCN__74c72b3b.css`.

### Spinner (12-blade)

- **Anatomy:** `<span class="spinner" style="font-size: 55px;">` with 12
  `.spinner-blade` children. Each blade is `0.074em × 0.2777em`,
  absolutely positioned, rotated `i × 30deg`, with `animation-delay:
  i × 83ms`.
- **Animation:** `svelte-1nd53yh-spinner-fade` 1s linear infinite, fading
  background-color from `#69717D` → transparent.
- **Overlay:** `.overlay { background: #00000080; position: absolute;
  inset: 0; margin: auto; }` — half-transparent black backdrop.
- **Source CSS:** `tools/tmp/bureau-cool/css/6.DRuW9XE0__d48853b3.css`.

### Tag chip / label (`.px-4 py-0.5 … bg-black/20`)

- **Anatomy:** `<div class="px-4 py-0.5 relative flex flex-row gap-x-1
  pr-1 items-center bg-black/20 text-white rounded-md md:rounded-lg
  transition-all smallsans md:text-xs">…</div>` — used for floating
  metadata chips over media.
- **Padding:** mobile `8px 4px 8px 16px`, `md:p-3` (12px).
- **Type:** `.smallsans`, white text, 12px on `md`.
- **Radius:** 6px mobile, 8px on `md`.

### Shop canvas (route `/0000`)

- **Anatomy:** `<canvas class="fixed inset-0 z-20 cursor-grab">` — a
  full-viewport WebGL canvas covering the entire viewport, behind a
  z-30 layer of controls and a z-80 top-right stack of pill chips.
- **Cart indicator:** `<div class="fixed bottom-1 left-1 z-30 p-2
  md:bottom-3 md:left-3 opacity-50"><span class="text-xs text-white
  uppercase">Cart</span></div>`.
- **Top-right pill stack:** `<div class="fixed right-3 md:right-5
  md:top-12 top-8 z-80 flex flex-col gap-y-1 items-end">` — vertical
  stack of pill controls for shop actions.
- **Cursor:** `cursor-grab` by default; `cursor-grabbing` while the
  pointer is held down and the user is panning the camera.

### Image card (project)

- **Anatomy:** wraps a single `<img>` or `<video>` element inside a
  relatively-positioned container; the container has
  `overflow-x-hidden` and `overflow-hidden` on inner wrappers so the
  drag-translate does not bleed horizontally.
- **Image fit:** `object-cover` is applied at the inner img element
  (inferred from Tailwind utility presence in the rendered HTML).
- **Caption:** below the image, a `<span class="mb-12 inline-block
  smallsans">` label (date or category) followed by a
  `.midserif` / `.bigsans` title block.
- **Dot:** a 16–32px filled black circle `<div class="w-4 md:w-6 lg:w-8
  h-4 md:h-6 lg:h-8 top-1.5 md:top-4 absolute rounded-full bg-black">`
  marks the start of each project block.
- **States:** on hover (md+) the card wrapper may apply
  `md:hover:scale-110` or `md:hover:scale-[1.05]`; the surrounding
  link uses `cursor-pointer opacity-80 md:hover:opacity-100`.

### Resize affordance edges

- **Anatomy:** two thin invisible / low-contrast handles at the left
  and right edges of the draggable hero card; classed
  `cursor-w-resize` and `cursor-e-resize` respectively.
- **Behavior:** drag horizontally to resize the draggable card width;
  the inline `style="width: …"` is updated by the pointer handler.

### Marquee ticker (`.smallserif` running text)

- **Anatomy:** inline text inside a `<span>` with the
  `animate-[blink_1.5s_linear_infinite]` utility applied to a child
  caret/blink marker; the whole strip uses the
  `moveleftright` keyframes via inline `animation:` (or via a
  Tailwind `animate-[...]` arbitrary utility).
- **Typography:** `.smallserif` (Century Schoolbook Mono, ~12.5px
  mobile / ~14.2px md), uppercase.
- **Loop:** `translate(0) → translate(-30%) → translate(0) → translate(30%)`
  with opacity dips to `0.5` at the 25% and 75% marks.

---

## JavaScript & Libraries

Every library below was detected in the SvelteKit / Vite-emitted chunk
graph (`tools/tmp/bureau-cool/js/`). File names are the Vite manifest
hashes; **the version was inferred from constants in the bundle, not
from a `package.json`** (no `package.json` is shipped in the dump).

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| **SvelteKit** | 2.x (Svelte 5) | `_app/immutable/entry/start.Bo0fyGBo.js` + `app.DxYnwSIT.js`; `sveltekit` string in `B3FdJ-Av.js`, `CCwMUzUi.js`; `data-sveltekit-preload-data="hover"` in `<body>` | Router, hydration, module-preload graph |
| **Svelte** | 5.x | `svelte` string in `DBaYgwyc.js`, `B714k1QK.js`, `DjuHpUfr.js`, `DsnmJJEf.js`, `B3FdJ-Av.js`, `app.DxYnwSIT.js` | Component runtime, runes |
| **Vite** | bundled at build | `__vite__mapDeps` symbol in entry scripts | Build-time bundler |
| **Tailwind CSS** | v4 (`@layer properties`, `@layer theme`, `@layer base`, `@layer components`, `@layer utilities`; `@apply` inside SvelteKit `<style>` blocks via `@reference "tailwindcss"`) | presence of `@layer` cascade and `@property` declarations in `css/app.DIPekTPO__3e618f48.css` | Styling system, no JIT runtime |
| **Three.js** | r170-era (Color, Matrix4, Mesh, Scene, OrthographicCamera, PerspectiveCamera, WebGLRenderer all detected in `D5182rkU__4a7b51d7.js` and `3.yHdeBpiS__068af42f.js`) | chunk `D5182rkU__4a7b51d7.js` (527 KB) | 3D engine used on `/0000` shop canvas |
| **GSAP** | 3.x (Flip plugin confirmed; `.to()`, `.from()`, `.timeline()` style calls in `BbkiSnUN__87717c81.js`) | `timeline`, `from(`, `to(` strings in `BbkiSnUN__87717c81.js` (644 KB); `Flip` string in `D5182rkU__4a7b51d7.js` | Animation timeline; Flip for layout transitions |
| **HLS.js** | 1.x | `hls.js` string in `BbkiSnUN__87717c81.js` | HTTP Live Streaming playback |
| **Mux Player / `@mux/*`** | n/a | `mux`, `StreamType` strings in `BbkiSnUN__87717c81.js`; Mux video assets referenced in the page payload (`assetId: hLw801wXM2RruyRAp00LaTsgA8DuHneL4gyo5JwgXs2400`, aspect ratio 721:540, duration 9.07s) | Mux video platform, hosted playback |
| **Sanity.io** (`@sanity/client` / `next-sanity`-style) | n/a | `sanity.io` strings in `6.B4atPtBa__358853fc.js` and `B5b3qfd8__14249acf.js`; CDN URLs `cdn.sanity.io/images/qw5lhwsn/production/…` in HTML meta + hydration payload | Headless CMS for project metadata, cover images, descriptions |
| **meshoptimizer decoder** | n/a | `meshopt_decodeFilterOct`, `meshopt_decodeVertexBuffer`, `meshopt_decodeIndexBuffer`, `meshopt_decodeGltfBuffer` in `D5182rkU__4a7b51d7.js`; `Draco`/`KTX2`/WebWorker pipeline visible | Decodes compressed glTF geometry for Three.js |
| **Plausible Analytics** | self-hosted at `https://tracking.bureau.cool/js/pa-NbMuYPE4VGBFxSzeyL0a3.js` | `<script async src="…pa-NbMuYPE4VGBFxSzeyL0a3.js">` in `<head>`; local file `js/pa-NbMuYPE4VGBFxSzeyL0a3.js` (6.2 KB) | Privacy-first page analytics |
| **`/_api/ip-info`** | internal endpoint | `other/ip-info__da05e0eb` (133 B JSON) fetched at runtime via `fetch("/_api/ip-info")` | Country / IP lookup (response was a 133-byte JSON blob) |
| **`/_api/connection`** | internal endpoint | request errored (`fetch failed`) twice in dump | Connection-state probe (not retrievable) |
| **`/_api/subscribe`** | internal endpoint | request errored (`fetch failed`) in dump | Newsletter subscribe (server unreachable) |

The HTML file `tools/tmp/bureau-cool/playwright/homepage.html` is the
fully-rendered DOM (168 KB). The site is a SvelteKit SPA with
client-side routing; the page-id hashes (`0._MP8Hvij`, `1.Sz04TkUw`,
`3.yHdeBpiS`, `6.B4atPtBa`, `8.1q_uWXIV`, `10.BgosrBmu`, `12.BthjGKug`,
`14.B-9ZcpZS`, `15.CATSuCfO`, `16.CbHugJiM`, `17.BIHX5t66`,
`18.CdnnIHRu`, `19.CjiEsnYz`) correspond to SvelteKit route nodes
loaded on demand.

---

## Animations (Catalog)

### CSS `@keyframes`

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `moveleftright` | `tools/tmp/bureau-cool/css/app.DIPekTPO__3e618f48.css` (in the `@layer theme` block, after the `@font-face` declarations) | unset (default `1s`/iteration; runs infinitely via animation utility) | `linear` (no easing declared in keyframes) | horizontal marquee loop: `0%`/`100%` `translate(0)`, `25%` `opacity:.5 translate(-30%)`, `50%` `translate(0)`, `75%` `opacity:.5 translate(30%)` |
| `blink` | same file, same line area | `1.5s` (via `.animate-\[blink_1\.5s_linear_infinite\]`) | `linear` | infinite cursor / badge blink: `0%`, `50%`, `100%` `opacity:1`; `51%–99%` `opacity:.3` |
| `svelte-1nd53yh-spinner-fade` | `tools/tmp/bureau-cool/css/6.DRuW9XE0__d48853b3.css` (final block) | `1s` | `linear` | 12-blade loading spinner: `0%` `background-color:#69717d` → `100%` `background-color:transparent`; per-blade delays 0/83/166/249/332/415/498/581/664/747/830/913ms |

### CSS utility-defined transitions

| Selector | Properties | Duration | Easing | Notes |
| --- | --- | --- | --- | --- |
| `.cp circle.fg` (`svelte-1pt2ggm`) | `stroke-dasharray` | `.3s` | `linear` | Progress-ring fill animation |
| `.transition` (Tailwind utility, applied via `md:transition-*`) | `color`, `background-color`, `border-color`, `outline-color`, `text-decoration-color`, `fill`, `stroke`, `--tw-gradient-*`, `opacity`, `box-shadow`, `transform`, `translate`, `scale`, `rotate`, `filter`, `backdrop-filter`, `display`, `content-visibility`, `overlay`, `pointer-events` | `var(--tw-duration)` — defaults to `.15s` (`--default-transition-duration`) | `var(--tw-ease)` — defaults to `cubic-bezier(.4, 0, .2, 1)` (`--default-transition-timing-function`) | Tailwind default |
| `.ease-out-expo` | transition-timing-function | inherits duration | `cubic-bezier(.19, 1, .22, 1)` | Custom easings: `--ease-out: cubic-bezier(0,0,.2,1)`, `--ease-in-out: cubic-bezier(.4,0,.2,1)`, `--ease-out-expo: cubic-bezier(.19,1,.22,1)` |
| `.delay-[0.1s]` | transition-delay | `.1s` | n/a | Universal delay utility |

### Specific in-page transitions

| Where | Trigger | Effect | Duration | Easing |
| --- | --- | --- | --- | --- |
| Nav pill (`button`) wrapper | `md:hover` | `transform: scale(0.9999)` | `.15s` | `ease-out` |
| Nav pill inner `<span>` label | `md:hover` | `transform: scale(0.95)` | `.15s` | `ease-out` |
| Circle bullet | `md:group-hover` | background `bg-neutral-500/60` → `bg-neutral-200` | `.3s` (utility default) | `md:ease-out` |
| Pill border (over imagery) | `md:group-hover` | `border-color` `#000` → `white/20` | `.15s` | `md:ease-out` |
| Project card | `md:hover` | `transform: scale(1.02)` / `scale(1.05)` / `scale(0.95)` (varies) | `.15s`–`.3s` | `ease-out` |
| Drag handle hero card | JS-driven | `translate3d(x,y,0)` updated on pointermove | per frame | n/a |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | `gsap.timeline()` + `.to()` + `.from()` calls | page load + route transitions; `Flip` plugin for layout morphs (FLIP = First-Last-Invert-Play) | Inferred from `timeline`, `from(`, `to(` strings in `BbkiSnUN__87717c81.js` and `Flip` in `D5182rkU__4a7b51d7.js`; exact timeline names were not extractable from the minified bundle |
| Three.js render loop | `requestAnimationFrame` (inferred — standard pattern) | continuous while `<canvas>` is in the viewport on `/0000` | Renders the 3D shop scene |
| HLS.js / Mux player | Mux playback | `<video>` element created by the Mux Player when a project card is opened | Streams Mux-hosted video (`assetId: hLw801wXM2RruyRAp00LaTsgA8DuHneL4gyo5JwgXs2400`, duration 9.07s) |

### Page transitions

- **First paint on direct hit:** no transition observed.
- **Client-side route changes:** SvelteKit default; no explicit
  transition wrapper detected in the rendered DOM. GSAP Flip is
  available in the bundle and likely used for project-card → project
  detail transitions, but the exact transition curve could not be
  extracted from the minified chunk.

---

## Assets

### 3D models

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| N/A | — | — | — | No `.glb` / `.gltf` / `.obj` / `.fbx` / `.usdz` files observed in `tools/tmp/bureau-cool/models/` (folder is empty). The Three.js scene on `/0000` loads geometry procedurally / from a CDN not enumerated by the dump. meshopt + Draco decoders are bundled, suggesting the runtime fetches compressed glTF at view time |

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| ArialMonospaced-Bold | 500 (intrinsically bold; CSS declares `font-weight: 500` in `@font-face`) | woff2 (28,324 B) | `https://bureau.cool/fonts/ArialMonospaced-Bold/font.woff2`; local `tools/tmp/bureau-cool/fonts/font__a5604620.woff2` | yes |
| CentSchbookMonoBTWXX-Rg | 400 (intrinsically regular) | woff2 (28,252 B) | `https://bureau.cool/fonts/CentSchbookMonoBTWXX-Rg/font.woff2`; local `tools/tmp/bureau-cool/fonts/font__edc16f1d.woff2` | yes |

### Images

The site does **not** ship a large local image library in the static
dump — every project cover is served from the Sanity CDN at request
time. The only local images are the favicon set:

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/bureau-cool/images/favicon-16x16__c65946b8.png` | PNG | 16×16 | 978 B | `https://bureau.cool/favicon-16x16.png` | Tab favicon |
| `tools/tmp/bureau-cool/images/favicon-32x32__c91d0c1e.png` | PNG | 32×32 | 1,830 B | `https://bureau.cool/favicon-32x32.png` | Tab favicon (HiDPI) |
| `tools/tmp/bureau-cool/images/apple-touch-icon__62d2ecb2.png` | PNG | 180×180 | 15,103 B | `https://bureau.cool/apple-touch-icon.png` | iOS home-screen icon |

External images referenced from the Sanity CDN (not downloaded into the
dump, only referenced from `<meta og:image>` and from the hydration
payload):

- `https://cdn.sanity.io/images/qw5lhwsn/production/edb207fae595549f9681feb3c507e8656fd21bad-2162x1514.png?rect=0,190,2162,1135&w=1200&h=630&auto=format` — OG / Twitter card, 2162×1514 source, cropped to 1200×630
- `https://cdn.sanity.io/images/qw5lhwsn/production/17d1f5e87e8fec91a6a33a8c0cb29001fb02abee-2250x2813.jpg` — "Nike / Run Berlin 2024" cover, 2250×2813
- `https://cdn.sanity.io/images/qw5lhwsn/production/fcc58e4f38371815b1ae7a68bff15bd6e7bd1d1d-2536x1428.png` — "Jai Paul" cover, 2536×1428
- `https://cdn.sanity.io/images/qw5lhwsn/production/91fc93bde40058e6f66c42a57129fa0539d3c6cd-3024x2841.png` — shop featured product, 3024×2841

### SVGs & icons

- **Inline SVGs observed in HTML:** 0 distinct inline `<svg>` elements
  in the rendered DOM. The site uses raster favicons and Unicode/text
  labels instead of vector iconography.
- **Standalone SVG files in dump:** none (`tools/tmp/bureau-cool/svgs/`
  is empty).
- **Icon system:** **none** (no Lucide, Phosphor, Heroicons, or custom
  sprite detected). The small chevrons / arrows inside the round
  bullets are SVG paths inlined in Svelte components but they are
  component-level, not part of a registered icon set.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/bureau-cool/media/` (empty) | — | No local media files shipped |
| `tools/tmp/bureau-cool/css/video-hls.BuurpJTG__c6a38750.css` | CSS | Aspect-ratio helper for HLS video frames: `div.hasSize.svelte-tn9lpj { aspect-ratio: var(--aspect-ratio) }` with a `@supports not (aspect-ratio)` float-clear fallback |

Mux-hosted videos referenced from project blocks (not downloaded — Mux
serves HLS at view time):

- `assetId: hLw801wXM2RruyRAp00LaTsgA8DuHneL4gyo5JwgXs2400`, aspect ratio
  721:540, duration 9.066544s, created 2023-03-15, dimensions inferred
  from the Mux data payload

---

## Motion & Interaction

### Principles

- Motion is **restrained and tactile**. The site uses scale-based
  feedback (0.95 inner label, 0.9999 outer pill) on hover rather than
  color or fill shifts; the only "expressive" animation is the
  full-page marquee (`moveleftright`) and the cursor blink (`blink`).
- The shop page breaks this with a full-viewport Three.js canvas
  (`<canvas class="fixed inset-0 z-20 cursor-grab">`) plus a draggable
  camera — the entire canvas can be grabbed and panned (`md:cursor-grab`).
- Default easing: `cubic-bezier(.4, 0, .2, 1)` (`--default-transition-timing-function`,
  Tailwind `ease-in-out`). Custom easings exposed: `--ease-out`
  `cubic-bezier(0,0,.2,1)` and `--ease-out-expo`
  `cubic-bezier(.19,1,.22,1)`.
- Default duration: `.15s` (`--default-transition-duration`).

### Specific behaviors

- **Link hover:** `.basic-hover:hover` sets `opacity: .5`; the inverse
  `.grey-hover:hover` resets to `opacity: 1`. No color change.
- **Button press:** scale 0.95 on the inner span, 0.9999 on the outer
  pill, 150ms ease-out. No color flash.
- **Section reveal on scroll:** not explicitly observed in the static
  DOM — no `IntersectionObserver` markers found in the rendered HTML.
  GSAP timelines likely drive scroll-based reveals on the homepage but
  the specific timeline names were not extractable from the minified
  bundle.
- **Marquee loop:** `moveleftright` (CSS keyframes) drives a horizontal
  text marquee; opacity dips to 0.5 at the seams for visual softness.
- **Drag handle:** the top-left drag card uses `translate3d(x,y,0)`
  driven by pointer events (style attribute is updated inline by JS).
- **Cursor:** `cursor-grab` on the shop canvas and on the drag handle;
  `cursor-grabbing` on `:active`. `cursor-w-resize` / `cursor-e-resize`
  on the left/right edges of resizable media.
- **Page transition:** SvelteKit default; no explicit fade observed.

### Reduced motion

No `@media (prefers-reduced-motion: reduce)` block was observed in any
of the four CSS files in the dump. The marquee + blink animations will
therefore play for users with the OS-level setting enabled. (This is a
**gap**, not a design choice — worth flagging if the site is to be
made WCAG-compliant.)

---

## Content & Voice

- **Tone:** confident, art-directed, sparse. The site speaks in
  declarative phrases ("A boutique design studio and digital partner.")
  rather than exclamatory marketing copy. Service and client lists are
  presented as flat enumerations.
- **Sentence length:** short. The longest paragraphs in the Information
  section are two to three sentences, ~30–40 words.
- **Capitalization:** Sentence case is rare; almost all visible copy
  is **UPPERCASE** (`.uppercase` utility applied to nav, headings, list
  items, press dates, and CTAs). The Information paragraphs are the
  one exception — they stay in sentence case with mixed case.
- **Punctuation:** sentence case; no Oxford-comma concerns because the
  client / service lists are line-broken, not comma-separated.
- **CTA vocabulary:** "Projects", "Information", "Mail",
  "internship@bureau.cool", "Cart" (on shop), and external "Get in
  touch" anchor inside the Internships section. No "Sign up", "Try
  free", or sales CTAs.
- **Tone signals:** the press list leans on third-party validation
  (Siteinspire, Hoverstat.es, Teenage Engineering "Now"). No first-party
  testimonials.

---

## Information Architecture

Top-level routes observed in the dump and inferred from the SvelteKit
hydration payload:

- `/` — homepage (nodes `0._MP8Hvij`, `1.Sz04TkUw`, `3.yHdeBpiS`,
  `12.BthjGKug`). Title block + project rail + Information section
  (Services / Clients / Press / Contact) + Internships + Features.
- `/0000` — shop (nodes `0._MP8Hvij`, `6.B4atPtBa`, `17.BIHX5t66`).
  Full-viewport Three.js canvas + cart indicator + featured product
  list from Sanity (`featured[].product` array, Shopify
  `shopifyProduct-9822806573402` schema referenced).

Inferred routes (referenced in the data payload but not crawled):

- `/#information` — anchor for the Information section of `/`.
- `/work/{slug}` — project detail pages (per-card links; canonical
  examples: `/work/nike-run-berlin-2024`, `/work/jaipaul`,
  `/work/chazwick`).

For each, the primary component is the matching SvelteKit route node
(`nodes/*.js`) plus a tail chunk (`chunks/*.js`) that holds the
component logic.

---

## Accessibility

- **Color contrast:** body text `#000000` on `#DEDEDE` measures ≈ 14.5:1
  (well above WCAG AAA 7:1). `--color-neutral-500` (#8E8E8E) text on
  `#DEDEDE` measures ≈ 3.0:1 — **borderline for body text**; the site
  uses it only for metadata dates and the count-badge background, where
  it pairs with white text at ~5.0:1.
- **Focus indicators:** no explicit `:focus-visible` or `:focus` rule
  was found in any stylesheet. Tailwind's preflight does **not** add a
  default focus ring (it resets `outline: 0` on `button, input,
  select, textarea`). The `user-select: none` on `html` also disables
  text selection globally, which can interfere with screen readers
  that select text for navigation.
- **Keyboard:** buttons, links, and form controls are native HTML
  elements so they are keyboard-reachable in DOM order. No skip-link
  was observed in the rendered HTML.
- **Screen reader landmarks:** the page uses `<div>` wrappers, not
  semantic `<header>`, `<main>`, `<footer>`, or `<nav>`. There is **no
  `<main>` landmark** wrapping the homepage content. The `<body>` is
  the only landmark.
- **Motion:** `prefers-reduced-motion` is not honored (see Motion
  section).
- **Alt text:** the `<canvas>` on `/0000` has no `aria-label` or
  fallback content. The drag-handle hero card uses inline-style
  positioning rather than semantic markup.
- **`<html lang="en">`** is correctly declared.
- **`<meta name="viewport" content="width=device-width">`** is present
  but without `initial-scale=1` (default behavior applies).

---

## Sources

Every URL opened or referenced while writing this spec:

- Homepage — https://bureau.cool/
- Shop — https://bureau.cool/0000
- OG / Twitter card image — https://cdn.sanity.io/images/qw5lhwsn/production/edb207fae595549f9681feb3c507e8656fd21bad-2162x1514.png?rect=0,190,2162,1135&w=1200&h=630&auto=format
- Project cover images — https://cdn.sanity.io/images/qw5lhwsn/production/{17d1f5e87e8fec91a6a33a8c0cb29001fb02abee-2250x2813.jpg, fcc58e4f38371815b1ae7a68bff15bd6e7bd1d1d-2536x1428.png, 91fc93bde40058e6f66c42a57129fa0539d3c6cd-3024x2841.png}
- Plausible tracker — https://tracking.bureau.cool/js/pa-NbMuYPE4VGBFxSzeyL0a3.js
- Press links referenced from the homepage: siteinspire.com, hoverstat.es, teenage.engineering/now
- Internal API endpoints (returned errors at dump time): https://bureau.cool/_api/ip-info (200, 133 B JSON), https://bureau.cool/_api/connection (failed), https://bureau.cool/_api/subscribe (failed)
- Fonts served from: https://bureau.cool/fonts/ArialMonospaced-Bold/font.woff2, https://bureau.cool/fonts/CentSchbookMonoBTWXX-Rg/font.woff2
- SvelteKit / Vite static graph — https://bureau.cool/_app/immutable/{entry,chunks,nodes,assets}/…

---

## Content Schema (Sanity)

The site reads from a single Sanity project (`projectId: qw5lhwsn`,
`dataset: production`). The hydration payload (embedded as JSON in
`<script>` inside `tools/tmp/bureau-cool/playwright/homepage.html`)
reveals the document shape.

### Homepage document (`main`)

```json
{
  "intro": {
    "recentupdates": [{ "title": "/0000 new items", "url": "/0000" }],
    "subtitle": "A boutique design studio and digital partner",
    "title": "Bureau Cool"
  },
  "work": { "archive": [ /* see Work schema */ ] }
}
```

### Work archive entry (`work.archive[]`)

Each project record carries these fields (paraphrased from observed
payload entries):

| Field | Type | Example value |
| --- | --- | --- |
| `_id` | UUID | `63610dbc-df7d-4eaa-9b2f-d567483d704d` |
| `title` | string | "Run Berlin 2024", "No Fear", "SAGAPRO006" |
| `client` | string | "Nike", "Jai Paul", "XL Recordings" |
| `slug.current` | slug | `nike-run-berlin-2024` |
| `shortDescription` | string \| null | `null` in most cases |
| `categories` | string[] | `["animation", "physical", "installation"]`, `["web", "interactive", "animation", "3d"]` |
| `cover.asset` | image reference | `{ _id, url, metadata.dimensions.aspectRatio }` |
| `coverVideo` | video reference \| null | Mux video asset when present |
| `images` | image[] \| null | optional gallery |
| `blocks` | block[] | `[{ _type: "mediaContainer" }, { _type: "textContainer" }, { _type: "spacer" }, …]` |

### Block types (`blocks[]`)

| `_type` | Role |
| --- | --- |
| `mediaContainer` | wraps a single image or video frame |
| `textContainer` | wraps a portable text block |
| `spacer` | inserts vertical rhythm |
| `list` | wraps a list block (services, clients, press) |

### Shop document (`shop`)

```json
{
  "description": [/* portable-text blocks */],
  "featured": [{
    "_id": "7bd3a1b1-6dc9-47e5-a8ad-e3125431ce7e",
    "available": true,
    "cover": { "asset": { "_id": "image-91fc93bde40058e6f66c42a57129fa0539d3c6cd-3024x2841-png", "metadata": { "dimensions": { "aspectRatio": 1.064 } } } },
    "product": { "_type": "product", "_id": "shopifyProduct-9822806573402" }
  }]
}
```

`featured[].product` is a Shopify product reference — the schema name
`shopifyProduct-*` indicates a Shopify-Sanity bridge. The visual
ordering on the `/0000` page is driven by `featured[]`.

### Metadata document (`metadata`)

```json
{
  "description": "Boutique design studio and digital partner",
  "ogimage": { "asset": { "url": "https://cdn.sanity.io/...edb207fae595549f9681feb3c507e8656fd21bad-2162x1514.png" } },
  "tags": "Design, Studio, Interactive, 3d, Development, Creative, Cool",
  "title": "Bureau Cool"
}
```

---

## Implementation Notes

- **Svelte 5 runes:** the rendered DOM (`<!--[--><!--]-->` blocks) and
  the chunk graph (`B714k1QK__f80c59e4.js` 30 KB exports)
  consistently use Svelte 5 patterns (`{#each …}`, `{#snippet …}`).
  Hydration markers are present throughout the HTML.
- **Tailwind v4 configuration:** no `tailwind.config.js` shipped — the
  utility set is fixed by the postcss plugin. Custom utilities
  (`bigsans`, `bigserif`, `midserif`, `smallsans`, `smallserif`,
  `padding`, `basic-hover`, `grey-hover`, `blockt`, `info-b`, `info-s`)
  are declared inline in `css/app.DIPekTPO__3e618f48.css` and are
  scoped via the global CSS layer.
- **Inline `<style>` blocks in SvelteKit:** every component uses
  `@reference "tailwindcss";` inside a `<style>` block to bring the
  Tailwind cascade into scope, then applies utilities via `@apply`. This
  is the SvelteKit v4+ Tailwind v4 pattern.
- **`user-select: none` on `html`:** the entire document disables text
  selection. This is an intentional design choice for the homepage's
  draggable / cursor-grab interactions, but it breaks screen-reader
  text-selection workflows.
- **`overscroll-behavior: contain` on `body`** and `none` on
  `.notouchoverflow` — the site intentionally contains scroll to
  prevent pull-to-refresh / bounce effects inside the drag-handle
  surface.
- **`mix-blend-mode: difference`** is exposed as a utility but **not
  applied** in the rendered DOM. It is available for future hero
  treatments.
- **Drag handle inline `transform`:** the top-left black square uses
  inline `style="transform: translate3d(1008px, 77.78px, 0px); width:
  360px; height: 202.5px;"` — values are written directly to the DOM
  by a pointer-event handler (no CSS variable indirection).
- **`backface-hidden` + `pointer-events-none`** on the drag-handle
  parent means the visible square floats above content but does not
  intercept clicks; the underlying buttons remain clickable.
- **3D canvas covers the shop page** (`<canvas class="fixed inset-0
  z-20 cursor-grab">`), with the top-right pill stack at `z-80` and
  the bottom-left Cart at `z-30`. The canvas sits behind the controls
  but above the body.
- **Mux playback** is initialised per project cover video via the Mux
  Player SDK bundled in `BbkiSnUN__87717c81.js`. HLS.js provides the
  fallback for browsers without native HLS support.

---

## Anti-patterns / Things to Note

- **No `<main>` landmark** on the homepage — content is wrapped in
  `<div style="display: contents">` and `<div class="…padding…">`.
- **No `:focus-visible` rules** anywhere in the four CSS files.
- **No `prefers-reduced-motion` handling** — the marquee, blink, and
  Three.js render loop all run unconditionally.
- **Single `<canvas>` with no `aria-label` or fallback content** on
  `/0000`.
- **`user-select: none`** at the document root blocks assistive
  technology from selecting text.
- **Empty `tools/tmp/bureau-cool/svgs/`, `models/`, `media/` folders**
  confirm the site loads everything dynamic from the Sanity / Mux CDN
  rather than shipping a static asset bundle.

---

## Changelog

- 2026-06-20 — Initial draft by opencode, generated from
  `tools/tmp/bureau-cool/` dump (manifest.json,
  playwright/homepage.html, playwright/computed-styles.json,
  css/*.css, js/*.js). 146 files, 6.7 MB total dump weight.
- 2026-06-20 — Added Content Schema (Sanity), Implementation Notes,
  and Anti-patterns sections. Document now covers CMS data shape, drag
  handle technique, Mux integration, and accessibility gaps.
