# Obys Agency — design.md

> A structured design specification of **https://obys.agency**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** design.md_gen (sub-agent)
> **Source dump:** `tools/tmp/obys/` (gitignored)

---

## Overview

Obys.agency is the marketing site of Obys, a concept-driven design studio
founded in 2018 by Olha Olianishyna and Viacheslav Olianishyn. The site
itself is a portfolio piece: a single-page, full-viewport, hand-coded
WebGL-driven experience that presents the studio's nineteen projects in
three different grid layouts (vertical stack, horizontal strip, scattered
grid) and links into long-form case study pages plus an "about" page.
Visually it is austere, almost print-like — a single custom serif
delivered via a self-hosted woff2, two background colors, and one mid-gray
accent — animated almost entirely by raw WebGL plus a thin layer of
transform-based CSS transitions. The aesthetic is closer to an editorial
art book than a SaaS landing page; the homepage reads as one composition
where the type, the cursor, the preloader, and the project thumbnails
all move in lock-step on a single inertial timeline.

**Category:** Studio portfolio / Marketing (single-product creative agency)
**Primary surface observed:** Homepage (`/`) + About (`/about`) + 19 work
case-study pages (`/work/<slug>`) + a custom 404 page.
**Tone:** Confident, restrained, editorial, modernist. No exclamation
points, no marketing superlatives — copy reads like a museum wall label.
**Framework detected (if any):** None. The site is a hand-rolled vanilla
HTML/CSS/JS bundle (`d.css?mod9hgsf` + `d.js?mod9hgsf` + a single inline
`<style>` block). The only external script is Google Tag Manager
(`gtag/js?id=G-L16SCYVMS7`) and a 477 KB gtag container. No React, Vue,
Svelte, Next.js, or Astro. The 3D/canvas surface is **raw WebGL2** written
by hand — the bundle contains `gl.createShader`, `gl.createProgram`,
`gl.attachShader`, `Matrix4fv`, and `TRIANGLE_STRIP` calls, but no
`THREE.`, `PIXI.`, or `gsap.` references. There is no animation library;
all motion is hand-rolled CSS transitions on `transform` properties, plus
`IntersectionObserver` for scroll triggers and a single `requestAnimationFrame`
loop driving the canvas.

---

## Visual Language

### Color

The palette is deliberately tiny. Two CSS custom properties drive
everything: `--white` and `--black`. One mid-gray is used for muted
labels and copyright text. Hover states for the underline reveal use a
border `rgba(0,0,0,0.10)`.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--white` | `#FFFFFF` (white) | set on `body { background-color: var(--white) }` |
| Background (intro) | `--black` | `#000000` (black) | used as `#preloader-bg` and `#prg` bar |
| Text (primary) | `--black` | `#000000` (black) | default `body { color: var(--black) }` |
| Text (muted) | — | `#C9C9C9` (light gray) | used on `.ho-wo-2-me`, `#ab-me > div h2`, `#ab-me > div #ab-me-cr > div:last-child`, `border-color: #c9c9c9`, computed `rgb(201, 201, 201)` |
| Text (inverted) | `#fff` | `#FFFFFF` (white) | used on header + logo (rendered through `mix-blend-mode: difference`) |
| Accent (link hover) | — | `#C9C9C9` (light gray) | hover state on `#ab-co-ma u` and `#ab-co-ov a` (`color: #c9c9c9`) |
| Border (hover ring) | — | `#0000001A` | `border: .1rem solid #0000001a` on `.ho-wo-2-img:before` (10 % black) |
| Accent (alt) | `var(--black)` | `#000000` (black) | used for the `#prg > div` bar and many underlines |

No dark-mode variant. No gradients. No shadows. Color discipline is a
feature — every gray that appears is `#C9C9C9` and every other color is
either pure white or pure black.

### Typography

The site ships a **single** custom typeface, `Obys` (file
`ObysSans4.woff2`, 6,272 bytes), self-hosted from
`/font/ObysSans4.woff2`. It is a single weight (400) and a single
style (normal), loaded via `@font-face` with `font-display: swap`. The
declared stack is `Obys, serif`, so non-Webkit browsers will fall back to
a generic serif until the woff2 loads. There is no italic, no bold, no
condensed — typographic hierarchy is built purely from **size, line
height, letter spacing, and white space**, never weight.

The root `html { font-size: .694444vw }` trick makes every `rem` value
viewport-relative. At a 1440 px viewport, `1rem ≈ 10px`; at 1920 px,
`1rem ≈ 13.33px`. This is how the type scale stays proportional without
a `clamp()` per element.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (hero project title) | `Obys, serif` | 400 | `8rem` | `1` | `-0.03em` (CSS) → computed `-2.4px` ≈ `-0.03em` |
| H1 (page title) | `Obys, serif` | 400 | `4rem` | `1.18` | `-0.03em` |
| Body L (intro paragraph) | `Obys, serif` | 400 | `1.1rem` (computed) | `1.2` | `-0.01em` (body) / `0` |
| Body | `Obys, serif` | 400 | `1.1rem` (computed) | `1.2` | `-0.01em` (body) |
| Body S / caption | `Obys, serif` | 400 | `0.6875rem` (≈11px, computed) | `1.2` | `-0.01em` (-0.11px computed) |
| Label / nav | `Obys, serif` | 400 | `1.1rem` (computed) | `1.2` | `-0.01em` |
| Mono | — | — | — | — | N/A (no mono in use) |

Concrete computed-style values (from `playwright/computed-styles.json`,
on a 1280 px viewport) for the body font run are:

- `font-family: "Obys, serif"` (note: the comma makes the family
  literal — the browser is reporting the entire stack as the family)
- `font-size: 11px` for almost all on-page text (the small caption size)
- `font-size: 79.9999px` for `.ho-wo-2-ti` (the hero "8rem")
- `font-weight: 400` everywhere — no element uses bold
- `line-height: 13.2px` (1.2×11) for body, `79.9999px` (1×80) for hero
- `letter-spacing: -0.11px` for body (≈-0.01em), `-2.4px` for hero (-0.03em)

The 11 px caption size is unusual: it lets the page fit dense metadata
("Architecture, Furniture / Creative Direction, Web Design/Dev / 01") on a
single line at the side of each project, mirroring a film-festival
program. The hero title at `8rem` (~106 px at 1440) is the only thing that
ever grows past 1rem; everything else stays in the 0.6–1.1rem band.

### Spacing & radius

The site uses a **CSS custom property grid system** rather than a
utility framework. Four variables define every layout:

```css
:root {
  --g: 1rem;                              /* gap between columns */
  --m-x: 1rem;                            /* page margin (x) */
  --m-y: 1rem;                            /* page margin (y) */
  --c: calc((100vw - (var(--m-x)*2 + var(--g)*11))/12);  /* 12th-column width */
}
```

So the page is a 12-column grid with `1rem` gutters and `1rem` outer
margins; each column is `(100vw − 2·margin − 11·gap) / 12` wide. The
`#header`, `#g_`, `#g`, and `.ho-wo-2 > .ho-wo-s > div` selectors all
derive their child widths from `--c` and `--g`.

- **Base unit:** `1rem` (= 10 px at 1440 px viewport, since
  `html { font-size: .694444vw }`).
- **Scale used:** 0.5, 1, 1.1, 1.3, 1.6, 2, 2.5, 3, 4, 4.9, 5, 5.2, 6,
  8, 25.2, 25.25, 24.5 rem (set via `rem`, not via a preprocessor).
- **Radii:** none. No element on the page has a `border-radius` (every
  computed value in `computed-styles.json` is `0px`).
- **Shadows:** none. No `box-shadow` anywhere (every computed value is
  `none`).

The 8 px hairline is `border-bottom: 1.34px solid` (computed under
`#ab-me > div a > span:last-child:before` and several other underlines
— the 1.34 px is the visual weight that survives the 0.694444vw scaling
and still reads as 1 device pixel at common DPRs).

### Iconography

There is no icon library. The site uses inline SVG only:

- The **favicon** (`tools/tmp/obys/svgs/favicon__f6daf7cd.svg`, 789 B) is
  a geometric infinity-like glyph: a 256×256 viewBox with two opposing
  `path d="M…"` ribbons forming a loop, clipped against a `clipPath`
  rotated 90°.
- The **centered logo** (`<div id="logo">`) is a single inline `<svg
  viewBox="0 0 400 400">` containing two `<g id="logo-r">` and
  `<g id="logo-l">` groups, each with ~190 hand-authored `<path>` nodes
  that build up a textured, almost topography-like rendering of a
  looped emblem. The two halves are independently transformed
  (`translate(±137%)`) on the `.is-spread` class, making the logo
  appear to "open" outward on demand.
- The **header wordmark** (`<a id="header-title">`) is a 251×68 viewBox
  SVG spelling `OBYS` in five glyph paths: each letter is hand-drawn as
  a single `<path d="…">` filled with `currentColor`, with the "O"
  drawn as a perfect circle outline.
- Work thumbnails are raster `.webp` images served from
  `cms.obys.agency/uploads/…`, lazy-loaded via `img[data-src]` selectors
  the JS reads on `IntersectionObserver` entry.

No Phosphor, no Lucide, no Material. The entire visual identity is the
logo, the type, and the project images.

---

## Layout & Grid

- **Max content width:** fluid, no `max-width` declared — content
  fills `100vw` minus `2 × var(--m-x)` (`1rem` each side, so
  effectively full-bleed minus a 20 px gutter at 1440).
- **Page gutter:** `--m-x: 1rem` (horizontal) and `--m-y: 1rem` (vertical).
- **Grid:** **12-column** with `1rem` (`--g`) gutter. Three secondary
  breakpoints collapse the showcase grid to 8/6/4 columns:
  ```css
  @media (max-width: 1300px) { grid-template-columns: repeat(8, 1fr); gap: 5rem var(--g); }
  @media (max-width: 900px)  { grid-template-columns: repeat(6, 1fr); gap: 4rem var(--g); }
  @media (max-width: 842px)  { grid-template-columns: repeat(4, 1fr); gap: 3rem var(--g); }
  ```
- **Breakpoints used:** `1300px`, `900px`, `842px`. No `sm`/`md`/`lg`
  tokens — just hard-coded max-widths. There is no media query for
  print.
- **Vertical rhythm:** every page section is exactly `100svh` tall
  (`height: 100svh` on `.page_`, `.page`, `#ho-wo`, `#ho-wo-0`,
  `#wo`, `#wo-ga`, `#404_`). Vertical scroll is used **only** for
  the per-page transition, never within a section.

The homepage is a single full-viewport page (`<main><div class="page_"><div
class="page">`) that holds four nested "modes" of the work showcase plus a
fixed footer of meta links. The three modes are:

1. **`#ho-wo-0`** — vertical list: 19 project links, each a colored
   rectangle with an `aria-label` and a per-project `aspect-ratio`
   inline style (values cycle 1.00, 0.80, 1.00, 0.67, 1.50, 1.00,
   0.80, 1.00, 0.67, 1.50, 1.00, 0.80, 1.00, 0.67, 1.50, 1.00, 0.80,
   1.00, 0.67 — a five-step rhythm). To the right, a two-line caption
   block (`.ho-wo-2-ti`) holds the project name, a small index
   (`.ho-wo-0-me`) showing the per-project category + role + serial
   number ("01…19"), and a hover image (`#ho-wo-2-ov > .ho-wo-2-hv
   > figure.ho-wo-2-r`).
2. **`#ho-wo-1`** — horizontal strip: same 19 projects, this time laid
   out as a horizontal flow that snaps to the viewport.
3. **`#ho-wo-2`** — 12-column grid: 19 cards (`<a class="ho-wo-2-img">`)
   placed at bespoke `--gc`/`--gr` row+column indices, surrounded by
   empty grid cells (`<div class="ho-wo-2-empty ho-wo-2-empty-l">` × N)
   that disappear at narrower breakpoints.

A fixed switcher in the bottom-left (`<div id="ho-wo-mo">`) exposes the
three modes as three `<button>`s reading `Vertical,` / `Horizontal,` /
`Grid` (note the trailing comma in the first two — an editorial
typographic choice). The current-mode button is underlined via the
`.l>div` mask (a `1.34px` border scaled from `translate(-100.1%)` to
`0`).

The page is wrapped by a permanent chrome: a WebGL `<canvas id="gl">`
behind everything, a fixed `<div id="logo">` dead-center, a fixed
`<header id="header">` with a 2-row flex layout (left = logo SVG,
right = menu + time + contact button), a fixed 12-column red grid
overlay (`<div id="g_"><div id="g">` — twelve `<div>`s with
`background: red; flex: 1; height: 100%` and `opacity: .15` /
`opacity: .3` on the `.g_o` class) that is visible during the intro and
faded afterward, a top progress bar (`<div id="prg">` → a 2.5 px tall
black bar that fills from `-101%` to `0%`), a black preloader
(`<div id="preloader">` with `#preloader-bg` and a centered `#preloader-prg`
percentage readout), and a copyright mark `<div id="ho-cp">` in the
bottom-right reading `All rights reserved. ©2026 Obys`.

A `#fix` block at the very top of the page (above the work showcase)
holds the studio manifesto and a contact link: two short paragraphs
("The studio is shaped by people who care deeply about design and the
process behind. Each project becomes a case study and a meaningful part
of our portfolio, developed with care and attention.") followed by a
`Contact:` label and a `mailto:info@obys.agency` link styled with a
`.l > div` underline mask.

---

## Components

### Centered Logo (`#logo`)

- **Position:** `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999`.
- **Size:** `13rem` (the inner `<svg>`), aspect-ratio `1`.
- **Color:** `color: #fff; mix-blend-mode: difference` so it inverts
  over whatever is behind it.
- **Anatomy:** two SVG groups, `#logo-l` and `#logo-r`, that can be
  independently transformed with `translate(±137%)` (`.is-spread`) to
  "open" the emblem. Initial class is `is-intro` (transitions disabled)
  → swaps to `is-on` (logo width animates to `--logo-w`) → can swap
  to `is-spread` for a split configuration.
- **Transitions:** width 1.6s `cubic-bezier(.19,1,.22,1)`; group
  transforms 1s `cubic-bezier(.16,1,.3,1)`; color 0.4s `ease-out`.
- **Pointer events:** `none` — the logo is purely decorative and never
  blocks clicks.

### Fixed Header (`#header`)

- **Position:** `position: fixed; top: var(--m-y); inset-inline: var(--m-x); z-index: 9997`.
- **Layout:** `display: flex; justify-content: space-between` between
  `#header-title` (left) and `#header-right` (right).
- **Color:** `color: #fff; mix-blend-mode: difference`.
- **Anatomy:** `#header-title` is the OBYS wordmark, sized at
  `max-width: calc(var(--c) * 2 + var(--g) * 2)` and shrinks to
  `max-width: 4.05rem` when the `.is-shrink` class is added (the
  underline masks `transform: translateY(120%)` slide up). The right
  cluster is three items, each `width: var(--c)`:
  1. `#header-menu` — links `Work,` `About,` separated by a
     `content: ", "` `::after` pseudo-element. Each link is `1.2lh`
     tall with a 1 px underline mask (`.is-on` or `:hover` triggers
     `transform: scaleX(1)` from `scaleX(0)` over 0.8s
     `cubic-bezier(.19,1,.22,1)`, origin animates from right → left).
  2. `#header-time` — a live clock reading `CET 00:00 AM` (filled in
     by JS).
  3. `#header-contact_` — a `<button id="header-contact">` reading
     `Contact`.
- **All text reveals use** `transform: translateY(110%)` on the
  inline element while a `overflow: hidden` parent masks it; JS
  animates the inner to `translateY(0)`.

### Preloader (`#preloader`)

- **Position:** `position: fixed; inset: 0; z-index: 9996` (the
  `#prg` progress bar is z-index 9999, above it).
- **Background:** `background-color: var(--black)` on `#preloader-bg`.
- **Progress bar (`#prg`):** `position: fixed; top: 0; left: 0; width: 100%;
  height: 2.5px`. Inner div transitions `transform` for 1000 ms
  `cubic-bezier(0.76, 0, 0.2, 1)` on the bar, then 3500 ms
  `cubic-bezier(0.16, 1, 0.3, 1)` on the fill (`translate3d(-100%, 0%, 0)`
  → `translate3d(0%, 0%, 0)`).
- **Percentage readout (`#preloader-prg`):** a single integer (e.g.
  `37`) shown in white, `mix-blend-mode: difference`, vertically
  centered in the viewport, right-aligned to `--m-x`.
- **Pointer events:** `all` while visible; the preloader is removed
  once `#prg` reaches 100 %.

### Work-Showcase Cards (`.ho-wo-2-img`)

- **Position:** placed by `--gr`/`--gc` CSS variables that the JS
  sets per-card into a 12-column grid.
- **Behavior:** starts at `opacity: 0`; animates to `opacity: 1` on
  intersection. A `::before` overlay (`border: .1rem solid #0000001a;
  inset: .1rem; opacity: 0`) is faded in on `.is-hv` (hover) to draw
  a subtle inset frame.
- **Hover image (`#ho-wo-2-ov`):** `<figure class="ho-wo-2-r">` is
  `position: fixed; width: var(--c); top: 50%; left: 50%`, clipped by
  `clip-path: inset(50%)` → animates to `inset(0%)` on `.is-on` over
  0.8s `cubic-bezier(.16,1,.3,1)`. The inner `<img>` is
  `transform: scale(1.15)` by default, animating to `scale(1)` on
  `.is-on` over 1.6s — a classic "Ken Burns settle" effect.

### Mode Switcher (`#ho-wo-mo`)

- **Position:** `position: absolute; left: var(--g); bottom: var(--g); z-index: 5`.
- **Anatomy:** three `<button>`s, each with a `.l > div` underline
  mask that animates `transform: scaleX(0)` → `scaleX(1)`. Copy
  reads `Vertical,` / `Horizontal,` / `Grid`.
- **Behavior:** clicking a button hides the other two showcase modes
  via JS class toggles.

### Founder Hover-Image (`#ab-fo-hover`)

- **Position:** `position: absolute; top: 5.2rem; right: var(--g); width: calc(var(--c) * 3 + var(--g) * 2); height: calc(100vh - var(--g)*2); z-index: 9998`.
- **Anatomy:** one `.ab-fo-img` per founder. Each image is revealed
  via `clip-path: inset(0 0 0 100%)` → `inset(0 0 0 0)` and the
  caption (`.ab-fo-img > span > span`) is `transform: translateY(102%)`
  → `translateY(0)` over 1s `cubic-bezier(.16,1,.3,1)`.

### Manifesto Underline (`.l` + `.l > div`)

- **Anatomy:** an outer `<div class="l">` (`overflow: hidden; width: 100%; height: 3px`)
  contains an inner `<div>` (`border-bottom: 1.34px solid; width: 100%; height: 1px;
  transform: translate(-100.1%)`).
- **Reveal:** on `.is-on` / `:hover`, transform animates to `translate(0)`,
  which slides the border into view. The same primitive is used on
  every interactive link in the site, with a 0.6–0.8 s easing.

### Tag/Chip ("`Architecture, Furniture`" / etc.)

- **Position:** absolutely-positioned under each project card on the
  about page (`#ab-co-me` and `#ab-co-vis-me`).
- **Anatomy:** 5-column grid (`grid-template-columns: calc(var(--c) *
  2 + var(--g) * 2) calc(var(--c) * 2 + var(--g) * 1) 1fr calc(var(--c) *
  2 + var(--g) * 2) var(--c)`) holding title, type, about, year.
- **Text:** `font-size: 1.1rem; line-height: 1.2`; reveals via the
  `.ln_` / `.ln` mask.

### Card Grid Empty Cells (`.ho-wo-2-empty`)

- Decorative empty cells that fill the 12-column grid on the grid mode.
  Four sizes (`.ho-wo-2-empty-l/-m/-s/-xs`) are progressively revealed
  / hidden by the four media queries above to maintain the
  editorial-rhythm layout at every breakpoint.

---

## JavaScript & Libraries

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Custom WebGL2 renderer | hand-rolled | `gl.createShader`, `gl.createProgram`, `gl.attachShader`, `gl.compileShader`, `Matrix4fv`, `TRIANGLE_STRIP` all in `js/d__3a9ec2c8.js` | No `THREE.`, `PIXI.`, or `babylonjs` import. Constructor calls `Y.i("gl").getContext("webgl2", { antialias: true, alpha: true })`. |
| Google Analytics 4 | gtag | `<script async src="https://www.googletagmanager.com/gtag/js?id=G-L16SCYVMS7">` in head, and a 477 KB gtag container at `playwright/js/js__719ae4ea` | Property ID `G-L16SCYMS7` (likely `G-L16SCYVMS7`). |
| IntersectionObserver | native | single `IntersectionObserver` reference in `js/d__3a9ec2c8.js` | Used to trigger card / line reveals on scroll. |
| Custom Router | hand-rolled | `d.json?d=d` returns `{ "rts": {...}, "c": {...}, "dta": {...} }` with one entry per route, mapping `/` → `ho`, `/about` → `ab`, `/404` → `nf`, `/work/<slug>` → `wo` | No `barba`, no `swup`, no `next/router`. Each route's HTML payload is stored in the `c` map. |
| Lazy image loader | hand-rolled | `querySelector('img[data-src]')` in `js/d__3a9ec2c8.js`; `data-src` is set on `<img>` elements that the JS swaps to `src` on intersection | All work thumbnails (e.g. `https://cms.obys.agency/uploads/Makhno_Thumbnail_e6008952f7.webp`) are loaded this way. |
| Smooth-scroll | hand-rolled | `overscroll-behavior: none` on `body`; no `locomotive-scroll`, no `lenis` | The site uses native browser scroll; the only behavioural control is `overscroll-behavior: none`. |

No CSS framework (no Tailwind, no Bootstrap). No jQuery. No Lottie, no
GSAP, no Framer Motion, no anime.js. The 477 KB
`playwright/js/js__719ae4ea` is a Google Tag Manager container payload
(signature strings: `__ogt_1p_data_v2`, `__ccd_ga_first`, `__ccd_ga_regscope`,
`__set_product_settings`, `instanceDestinationId: G-L16SCYVMS7`) and
contributes no design tokens — it is purely telemetry.

The hand-rolled WebGL2 setup is invoked by a class with a single
`act: new Ph("url")` constructor and a `cfg()` method that builds a
`new sh()` (renamed render-pipeline class) and a `new Q0` (renamed
RAF-loop class). The shader compiler (`crS`) wraps
`gl.createShader`, `gl.shaderSource`, `gl.compileShader`; the program
linker (`crP`) wraps `gl.createProgram`, `gl.attachShader`,
`gl.linkProgram`, `gl.detachShader`. Two render passes (a "fill" pass
and a "blur" pass — implied by the second `Matrix4fv` reference and the
`TRIANGLE_STRIP` hint) are run each frame.

---

## Animations (Catalog)

There are **no CSS `@keyframes` rules** anywhere in the bundle. All
motion is implemented as CSS `transition: <property> <duration>
<easing>` declarations animated by JS, or by direct `requestAnimationFrame`
loops that write `transform: translate3d(...)` to the canvas. Below is
the complete list of motion primitives observed.

### CSS `transition` declarations

| Selector (file:line) | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `#logo` (inline style) | `color` | `0.4s` | `ease-out` | on JS color swap |
| `#logo > svg` (`css/d__1bf8cefd.css:22`) | `width` | `1.6s` | `cubic-bezier(.19, 1, .22, 1)` | logo intro → on-state |
| `#logo #logo-l/-r` (`:27, :29`) | `transform` | `1s` | `cubic-bezier(.16, 1, .3, 1)` | `.is-spread` class |
| `#header-title` (`:47`) | `max-width` | `0.8s` | `cubic-bezier(.16, 1, .3, 1)` | `.is-shrink` class |
| `#header-menu > a span:before` (`:65`) | `transform` | `0.8s` | `cubic-bezier(.19, 1, .22, 1)` | `.is-on` / `:hover` (underline reveal, origin right→left) |
| `#fix-co-em .l` (`:87`) | `transform` | `0.6s` | `cubic-bezier(.16, 1, .3, 1)` | `:hover` (email-link underline) |
| `#ho-wo-mo > *:before` (`:99`) | `transform` | `0.8s` | `cubic-bezier(.16, 1, .3, 1)` | `.is-on` (mode switcher underline) |
| `#ho-wo-2 .ho-wo-2-r` (`:219`) | `clip-path` | `0.8s` | `cubic-bezier(.16, 1, .3, 1)` | `.is-on` (hover-image clip reveal) |
| `#ho-wo-2 .ho-wo-2-r > img` (`:223`) | `transform` (scale) | `1.6s` | `cubic-bezier(.16, 1, .3, 1)` | `.is-on` (hover image Ken Burns settle, `scale(1.15) → scale(1)`) |
| `#ab-co-ma u` (`:253`) | `color` | `0.3s` | (default `ease`) | `:hover` (`color: #c9c9c9`) |
| `#ab-co-ov a` (`:271`) | `color` | `0.3s` | (default `ease`) | `:hover` (`color: #c9c9c9`) |
| `#ab-fo-hover` (`:257`) | `opacity` | `1s` | `cubic-bezier(.16, 1, .3, 1)` | (page show/hide) |
| `#ab-co-ga` (`:281`) | `width` | `1.6s` | `cubic-bezier(.19, 1, .22, 1)` | `.is-ready` (gallery image ready) |
| `#ab-me > div a > span:last-child:before` (`:311`) | `transform` | `0.8s` | `cubic-bezier(.16, 1, .3, 1)` | `:hover` (footer-link underline) |
| `#wo-back .l` (`:341`) | `transform` | `0.6s` | `cubic-bezier(.16, 1, .3, 1)` | `:hover` (back-link underline) |
| `#wo-link .l` (`:357`) | `transform` | `0.6s` | `cubic-bezier(.16, 1, .3, 1)` | `:hover` (work-detail live-website underline) |
| inline `<style>` `#prg` (computed in DOM) | `transform` | `1000ms` | `cubic-bezier(0.76, 0, 0.2, 1)` | page load (progress bar travels) |
| inline `<style>` `#prg > div` (computed in DOM) | `transform` | `3500ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | page load (progress fill from `-100%` to `0%`) |
| `.mo-fd .o` (`:43`) | `opacity` | (immediate) | (default) | `.mo-fd` class (motion-fade class) → hides overlay elements |

### JS-driven animations

| Driver | Animation | Trigger | Notes |
| --- | --- | --- | --- |
| `requestAnimationFrame` | WebGL canvas scene (`Y.i("gl")`) | page load | Two passes: opaque render + post-process blur. Driven by a custom `Q0` RAF loop class. |
| `IntersectionObserver` | `.ho-wo-2-li` opacity reveal (start `0` → `1`) | element entering viewport | Cascades per-card via `--gc`/`--gr` so reveal is by row, not by item. |
| `IntersectionObserver` | `.ho-wo-2-ti > div` `transform: translateY(110%) → 0` (hero text reveal) | element entering viewport | The `.ln_` parent provides the `overflow: hidden` mask. |
| `IntersectionObserver` | `img[data-src]` → `src` swap | element entering viewport | Lazy-loads work thumbnails. |
| `IntersectionObserver` (implied) | `.ho-wo-2-img.is-hv` `::before` border fade-in | element hover | Switches `opacity: 0` → `opacity: 1` on the inset frame. |
| Mouse / pointer | `ab-co-hover` → `ab-co-ga.is-ready` (founder photo) + `ab-fo-hover` clip reveal | cursor enters founder name | Cursor over a founder's name reorders the gallery and reveals their photo. |
| Custom router | `<main>` content swap | `<a>` click intercepted before navigation | The route map is in `d.json?d=d`; the JS reads `d.c['/path']` and replaces `<main>`'s children. |
| Timer | `#header-time` (live CET clock) | page load | Updated every second. |
| Timer | `#preloader-prg` (percentage counter) | page load | Counts 0 → 100 alongside the `#prg` bar. |

### Page transitions

The router swaps the entire `<main>` content in place. There is no
shared-element transition library; the outgoing `<main>` is removed and
the incoming `<main>` is inserted, and the `.ln_` / `.ln` /
`transform: translateY(110%)` mechanism on every line of new content
animates them in on the next frame. The preloader (`#preloader`,
`#preloader-bg`, `#preloader-prg`) covers the swap so the user never
sees a blank viewport.

### Reduced motion

The CSS class `.mo-fd` is observed in the bundle and is not paired
with an explicit `@media (prefers-reduced-motion: reduce)` query in
the dump — but the class name (and the conditional `prefers-reduced-motion`
media query that drives it) is a common pattern. From the
`playwright/computed-styles.json` alone, **no `@media
(prefers-reduced-motion: reduce)` block was captured**, so the
reduced-motion behaviour should be considered "Not observed" rather
than "none". The `_m` reduced-motion class would be a natural
extension.

---

## Assets

The dump is small (28 files) because Obys hosts most of its imagery on a
separate CMS at `cms.obys.agency`. The downloaded assets are limited to
the favicon set, the custom font, the canonical site JS/CSS, the JSON
manifest, and Playwright artifacts.

### 3D models

N/A — no 3D assets observed in the dump. The only 3D-adjacent content
is the raw WebGL2 canvas, which is procedurally generated per frame
inside `js/d__3a9ec2c8.js` (custom shader pipeline using
`Matrix4fv` and `TRIANGLE_STRIP`). No `.glb`, `.gltf`, `.obj`, `.fbx`,
or `.usdz` is present in the dump or referenced in the HTML.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Obys (ObysSans4) | 400 normal | woff2 (`ObysSans4.woff2`, 6,272 B) | `https://obys.agency/font/ObysSans4.woff2` | yes, served from the same origin |

The font is loaded via `@font-face` in the inline `<style>` block:

```css
@font-face {
  font-family: Obys;
  src: url(/font/ObysSans4.woff2) format(woff2);
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

The variable `html { font-size: .694444vw }` (≈ 10 px at 1440 px
viewport) is the only thing that changes the font's effective size; the
file itself is static.

### Images

The dump contains only **favicon** images. All work thumbnails, founder
photos, and project hero images are hosted on `cms.obys.agency` and are
**not** in the local dump.

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/obys/images/favicon-96x96__0ccda334.png` | PNG | 96×96 | 1,456 B | `https://obys.agency/favicon/favicon-96x96.png?v=0` | 96px favicon |
| `tools/tmp/obys/images/apple-touch-icon__8a90315f.png` | PNG | 180×180 (Apple touch convention) | 2,955 B | `https://obys.agency/favicon/apple-touch-icon.png?v=0` | iOS home-screen icon |
| `tools/tmp/obys/images/favicon__13aafc4d.ico` | ICO | multi-size | 15,086 B | `https://obys.agency/favicon/favicon.ico?v=0` | legacy favicon |

The 19 project thumbnails (and the founder portraits, and the
"contact" photo) live on the CMS and are referenced as `.webp` URLs
in the JSON data file `tools/tmp/obys/other/d__318815a4.json` under
`dta.gl['/'].data.main`. Examples (not committed to the dump but
discoverable):

- `https://cms.obys.agency/uploads/Makhno_Thumbnail_e6008952f7.webp`
- `https://cms.obys.agency/uploads/Source_Unknown_Thumbnail_7e7a08561b.webp`
- `https://cms.obys.agency/uploads/1_fae12fb704.webp`
  (Autex)
- `https://cms.obys.agency/uploads/Odin_s_Crow_Thumbnail_4dc8764e8a.webp`
- `https://cms.obys.agency/uploads/Olga_Prudka_Thumbnail_73c88a2131.webp`
- `https://cms.obys.agency/uploads/Yulia_Thumbnail_3226edc489.webp`
- `https://cms.obys.agency/uploads/Miro_Thumbnail_413fefb05d.webp`
- `https://cms.obys.agency/uploads/DES_Thumbnail_41ecc849b9.webp`
- `https://cms.obys.agency/uploads/ODB_Thumbnail_ed9b4aa0f3.webp`
- `https://cms.obys.agency/uploads/Eminente_Thumbnail_d7767e1666.webp`
- `https://cms.obys.agency/uploads/Abetka_Thumbnail_25b7c61177.webp`
- `https://cms.obys.agency/uploads/Black_Sheep_Thumbnail_09c8874314.webp`
- `https://cms.obys.agency/uploads/1_176ec7aa0f.webp` (Salience Labs)
- `https://cms.obys.agency/uploads/AIM_Thumbnail_de091a7b48.webp`
- `https://cms.obys.agency/uploads/Glyphic_Biotechnologies_Thumbnail_50ecd8bb9a.webp`
- `https://cms.obys.agency/uploads/4_1eae03d525.webp` (Porsche Taycan)
- `https://cms.obys.agency/uploads/Ayocin_Thumbnail_0965a26e06.webp`
- `https://cms.obys.agency/uploads/Grids_Thumbnail_674aa5712c.webp`
- `https://cms.obys.agency/uploads/Peter_Thumbnail_bee0ce3a78.webp`

The OG image (referenced in the `<meta property="og:image">` and
`<meta name="twitter:image">` tags) is
`https://cms.obys.agency/uploads/large_Thumbnail_Obys_5419986743.webp`
at 1200×630.

### SVGs & icons

- **Inline SVGs observed in HTML:**
  - **1× centered logo** — `<svg viewBox="0 0 400 400">` with two
    `<g>` groups (`#logo-l`, `#logo-r`) containing ~380 hand-drawn
    `<path>` nodes that compose a textured, topographical infinity
    motif. 0 B extra (inline in the HTML).
  - **1× header wordmark** — `<svg viewBox="0 0 251 68">` spelling
    `OBYS` as five glyph `<path>`s. Inline in the `<a id="header-title">`.
  - **19× project thumbnail `<a class="r">` cells** with inline
    `style="aspect-ratio: <x>; width: <y>rem;"` — these are placeholder
    rectangles, not raster images, until the WebGL canvas / lazy image
    resolves them.
- **Standalone SVG files in dump:** 1.
  - `tools/tmp/obys/svgs/favicon__f6daf7cd.svg` (789 B,
    `image/svg+xml`) — geometric infinity-like glyph on a 256×256
    viewBox, used as the site favicon. The two opposing
    `path d="M…Z"` ribbons form a flat, monoline loop; clipped
    against `<clipPath id="clip0_201_2">` rotated 90°.
- **Icon system:** None. No icon font, no Phosphor, no Lucide.
  The site does not display any "→" or "↓" arrows as standalone
  icons — directional cues come from typography (e.g. the trailing
  comma in `Vertical,` `Horizontal,`) and from layout.

### Audio & video

N/A — no audio or video assets observed in the dump. The site is
silent and video-free; the only motion comes from the WebGL canvas
and CSS transitions.

---

## Motion & Interaction

### Principles

- Motion is **single-track**: a hand-rolled cubic-bezier
  `(.16, 1, .3, 1)` (sometimes called the "out-expo" or
  "Penner-easeOut"-flavoured curve) is the default for almost every
  transition. The two outliers are `(.19, 1, .22, 1)` (used for the
  logo's width change and the gallery's width change, both 1.6 s — a
  slightly less aggressive ease) and `(.76, 0, .2, 1)` (used only for
  the top progress bar's outer transform, the preloader travel).
- Durations cluster into four bands: 0.3 s (color hovers), 0.6–0.8 s
  (link underlines + small reveals), 1.0 s (logo halves, founder
  clip), 1.6 s (logo width, hover-image Ken Burns settle).
- All animated elements carry `will-change: transform` (or
  `will-change: clip-path, transform` on `.ho-wo-2-r`) to nudge the
  browser onto the GPU.
- `overscroll-behavior: none` on `body` prevents the page from
  bounce-scrolling on macOS trackpad.

### Specific behaviors

- **Link hover:** a 1.34 px solid bottom-border slides in from the
  left via the `.l > div` mask (`transform: translate(-100.1%)` →
  `translate(0)`). Easing `cubic-bezier(.16, 1, .3, 1)`, 0.6–0.8 s.
- **Button / mode-switcher hover:** the same underline primitive,
  0.8 s.
- **Project-card hover (work showcase):** an inset 1 px
  `border: .1rem solid #0000001a` (10 % black) fades in over the
  card via the `.ho-wo-2-img::before` pseudo-element, and a fixed
  preview image (`.ho-wo-2-r`) animates from `clip-path: inset(50%)`
  to `clip-path: inset(0%)` while its inner image does a 1.6 s
  Ken Burns from `scale(1.15)` to `scale(1)`.
- **Hero text reveal:** every line of every heading is wrapped in
  `<span class="ln_"><span class="ln">…</span></span>`. The outer
  `.ln_` is `overflow: hidden; margin: 0 -1px`. The inner `.ln` is
  `transform: translateY(102%)` by default; the JS animates it to
  `translateY(0)` on view, so each line wipes up into place.
- **Logo intro:** the logo `<div id="logo">` starts with the
  `is-intro` class (transitions disabled). JS removes `is-intro` →
  adds `is-on` → triggers the 1.6 s width ease to `--logo-w` →
  optionally adds `is-spread` to translate `#logo-l` to
  `translate(-137%)` and `#logo-r` to `translate(137%)` (a 1 s ease).
- **Founder hover:** moving the cursor over a founder's name
  reorders `#ab-co-ga` (a grayscale, low-opacity image stack) and
  reveals the matching portrait via `#ab-fo-hover` (clip-path
  animation, 1 s).
- **Preloader → page swap:** the `#preloader` covers the screen
  while `#prg` (a 2.5 px black bar at the top of the viewport)
  travels from `-101%` to `0%` over 3.5 s. The percentage readout
  (`#preloader-prg`) counts 0 → 100 in lock-step. When the count
  hits 100, the preloader is removed and `<main>` content animates in
  via the `.ln` reveals.
- **Mode switch (vertical ↔ horizontal ↔ grid):** clicking
  `#ho-wo-mo-0/1/2` toggles which `#ho-wo-{0,1,2}` block is
  `display: block` vs. `display: none`. No crossfade between
  modes — the swap is instant, but the cards inside still animate
  in via the `IntersectionObserver` reveal.

### Reduced motion

The CSS class `.mo-fd .o { opacity: 0 }` exists in the bundle
(`css/d__1bf8cefd.css:43`). No explicit
`@media (prefers-reduced-motion: reduce)` block was captured in
`playwright/computed-styles.json`, so the precise behaviour is
**Not observed**; the `.mo-fd` class is the most likely hook.

---

## Content & Voice

- **Tone:** Editorial, confident, restrained, modernist. The
  homepage intro is two sentences — no superlatives, no urgency. The
  about-page manifesto is a single ~70-word paragraph. Awards and
  press are listed as plain text (not badges).
- **Sentence length:** Short to medium. Active voice. Em-dashes are
  preferred over commas for parenthetical breaks.
- **Capitalization:** Sentence case throughout headings (e.g.
  `Selected Awards:`, `Services:`, `Industries:`, `Latest Public
  Speeches:`, `Featured Press:`, `Socials:`).
- **Punctuation:** Trailing comma on the first two mode buttons
  (`Vertical,`, `Horizontal,`) is a deliberate editorial tic.
  Em-dashes for parenthetical asides. Periods omitted on short
  call-to-action labels (`Contact`, `Back`, `Live Website`).
- **CTA vocabulary:** Only two CTAs on the site: `Contact` (header
  button + `mailto:info@obys.agency`) and `Live Website` (per
  work-detail page). No "Hire us", "Start a project", "Get in
  touch" — Obys does not sell from the site.
- **Year prefix:** Every project thumbnail and award is dated with a
  year prefix on the about page (`2019`, `2020`, `2022`, `2023`,
  `2024`, `2025`, `2026`). The current year appears in the
  copyright as `©2026 Obys`.
- **Numbers:** Written as numerals, never spelled out (`19` projects,
  `35+` Website of the Day, `4x` Studio of the Year).

---

## Information Architecture

Top-level routes (from `d.json?d=d` `rts` and `c` maps):

- `/` — marketing homepage. Single full-viewport page that hosts
  `#ho-wo` (the work showcase in three modes), `#fix` (studio
  manifesto + contact), and `#ho-cp` (copyright). Primary
  component: `#ho-wo-2` (the 12-column grid mode).
- `/about` — about / contact page (`ab` block). Sections in DOM
  order: `#ab-co` (founder names + manifesto + service list + awards
  + socials), `#ab-co-ma` (manifesto body), `#ab-co-ov` (overview
  copy), `#ab-co-vis` (visual signature / portrait gallery), `#ab-me`
  (footer with meta, links, press), `#ab-fo` (founder names large,
  rendered as inline SVG paths), and `#ab-fo-hover` (the founder
  portrait that follows the cursor on hover).
- `/404` — 404 page. Centered `404` text only (`#404_` is
  `display: flex; color: var(--black); justify-content: center; align-items: center; height: 100svh`).
- `/work/<slug>` — 19 work case-study pages. Each renders the `wo`
  block: `#wo` (full-viewport flex with `#wo-back` back link bottom
  left, `#wo-info` left column with title + meta, and `#wo-ga`
  right column with a 100svh tall hero image stack). The slug list:
  `makhno`, `source-unknown`, `autex`, `odins-crow`, `olga-prudka`,
  `yulia`, `the-ways-we-work-miro`, `design-education-series`,
  `obys-design-books`, `eminente`, `abetka`, `black-sheep`,
  `salience-labs`, `ai-modernism-of-kharkiv`, `glyphic-biotechnologies`,
  `porsche-taycan`, `ayocin-atmos-lamp`, `grids`, `peter-lindbergh`.

Header navigation exposes only two routes: `Work` (the homepage,
`/`) and `About` (`/about`). There is no `Services` page, no
`Pricing`, no `Blog`, no `Contact` page (contact is a `mailto:` link
in the footer of `/about` and the `#fix` block on the homepage).

---

## Accessibility

- **Color contrast:** the body text is `#000000` on `#FFFFFF`,
  contrast ratio **21:1** (AAA). The muted text is `#C9C9C9` on
  `#FFFFFF` (~2.4:1, below AA) — used only for non-essential metadata
  ("`01`", section labels).
- **Focus indicators:** not explicitly styled; the browser's default
  focus ring is preserved (the universal selector `* { outline: 0 }` is
  scoped to `button, input, textarea, select` via
  `button:focus,input:focus,textarea:focus{outline:0}` — so links keep
  their default focus ring).
- **Keyboard:** all interactive elements are native `<a>` and
  `<button>` elements, so they are reachable in logical order. There
  is no skip-link; the page is a single-viewport layout so the
  tab-order through header + main is short.
- **Screen reader landmarks:** the document has `<header
  id="header">`, `<main>`, and `<canvas id="gl">` landmarks. The
  work-showcase links each have an `aria-label` (e.g. `aria-label="Makhno"`,
  `aria-label="Source Unknown"`). The `<button>`s in the mode
  switcher have visible text. There is no `<footer>` element; the
  copyright is a plain `<div id="ho-cp">` and the founder/contact
  block is inside `<main>`.
- **Motion:** the `.mo-fd` class is present in the CSS (`:43`) as
  the most likely reduced-motion hook. No
  `@media (prefers-reduced-motion: reduce)` rule was captured in the
  Playwright dump, so the exact behaviour is **Not observed**.
- **Alt text:** project images are not given `alt` text in the
  static HTML; the surrounding link carries `aria-label="<project
  name>"`, which is what a screen reader will announce. Founder
  portraits in the about-page `#ab-co-vis` block carry no alt text
  observed — only the surrounding block of `Viacheslav Olianishyn
  (Design Director)` / `Olha Olianishyna (Managing Director)` names
  is the textual label.
- **Tap highlight:** `html, body { -webkit-tap-highlight-color:
  transparent }` disables the default iOS tap flash. Trade-off:
  taps have no visual feedback beyond the link's own
  transform-based hover.

---

## Sources

Every URL touched while writing this design.md, drawn from
`tools/tmp/obys/manifest.json` and the rendered HTML / JSON.

- Homepage — https://obys.agency/
- About — https://obys.agency/about
- 404 — https://obys.agency/404
- Work detail (representative) — https://obys.agency/work/makhno
- Work slugs observed: `makhno`, `source-unknown`, `autex`,
  `odins-crow`, `olga-prudka`, `yulia`, `the-ways-we-work-miro`,
  `design-education-series`, `obys-design-books`, `eminente`,
  `abetka`, `black-sheep`, `salience-labs`,
  `ai-modernism-of-kharkiv`, `glyphic-biotechnologies`,
  `porsche-taycan`, `ayocin-atmos-lamp`, `grids`, `peter-lindbergh`
- Custom font — https://obys.agency/font/ObysSans4.woff2
- Main stylesheet — https://obys.agency/css/d.css?mod9hgsf
- Main script — https://obys.agency/js/d.js?mod9hgsf
- Route + content manifest — https://obys.agency/d.json?d=d
- Favicon (svg) — https://obys.agency/favicon/favicon.svg?v=0
- Favicon (96px png) — https://obys.agency/favicon/favicon-96x96.png?v=0
- Apple touch icon — https://obys.agency/favicon/apple-touch-icon.png?v=0
- Web manifest — https://obys.agency/favicon/site.webmanifest?v=0
- Legacy favicon — https://obys.agency/favicon/favicon.ico?v=0
- Google Analytics 4 — https://www.googletagmanager.com/gtag/js?id=G-L16SCYVMS7
- OG image — https://cms.obys.agency/uploads/large_Thumbnail_Obys_5419986743.webp
- Work thumbnails (CMS) — https://cms.obys.agency/uploads/…webp
  (19 URLs enumerated under "Images" above)

---

## Changelog

- 2026-06-19 — Initial draft by design.md_gen (obys sub-agent).
