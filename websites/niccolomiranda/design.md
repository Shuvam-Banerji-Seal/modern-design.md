# Niccolò Miranda — design.md

> A structured design specification of **https://niccolomiranda.com**, written so a
> human or agent can reconstruct its look-and-feel without seeing the original
> site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/niccolomiranda/` (gitignored)

---

## Overview

The personal portfolio of Niccolò Miranda, a freelance digital art director /
interactive designer / creative developer based in Amsterdam. The site is a
single landing page built on Webflow, layered with two WebGL "paper curtain"
shader effects (OGL-based), Locomotive Scroll for smooth scroll, GSAP for
transition orchestration, and a `butter-slider`-driven horizontal work carousel.
The aesthetic is *editorial-paper*: a deep black ink (`#1D1D1B`), a warm beige
("kraft" tone `#CDC6BE`), and a single rust accent (`#C03F13`), set with two
custom display faces (`Canopee` for condensed display, `Domaine Display Condensed`
for serif accent letters) over `Editorial New Light` running body copy. The hero
is a giant paper-textured "Miranda" wordmark with `mix-blend-mode: multiply`
over the page background; a horizontal butter-slider of recent work sits
immediately below, followed by awards, testimonial cards, an oversized "The
pixel perfect artisan" stacked-headline block, and a continuous email-me
marquee footer.

**Category:** Personal portfolio / Marketing
**Primary surface observed:** Homepage (`/`) plus a Work index (`/work`) and
About (`/about`) referenced in nav and prerendered
**Tone:** confident, restrained, technical-editorial — large condensed
display type over body copy; lots of negative space; paper, not glass.
**Framework detected (if any):** Webflow (CMS for projects) + custom ES
module paper-curtain shader; no React/Vue/Svelte.

---

## Visual Language

### Color

The palette is intentionally small — three ink/paper tones plus one rust accent.

| Role | Token (informal) | Value | Notes |
| --- | --- | --- | --- |
| Background (base, page) | `--bg-base` | `#1D1D1B` | Near-black ink; applied to `html` and `body.index` |
| Background (paper / elevated) | `--bg-paper` | `#CDC6BE` | Warm "kraft" beige; applied to `.app`, `.nav-inner`, `.menu`, `.aw-block` |
| Background (subtle / hover) | `--bg-subtle` | `#D3CBC2` | Lighter beige; CTA pill, hover for `.brand-inner` |
| Background (muted neutral) | `--bg-muted` | `#E2DEDB` | Avatar blend underlay |
| Background (image blend) | `--bg-img-blend` | `#ECE9E6` | `.pw-img.blend` |
| Background (testimonial cards) | `--bg-card` | `#BEB5AB` | `.aw-item__content` and brand background hover |
| Text (primary) | `--text-primary` | `#1D1D1B` | Default `body` color |
| Text (secondary / on paper) | `--text-on-paper` | `#CDC6BE` | Menu titles, marquee text, `.head.h` |
| Text (link underline) | `--text-underline` | `rgba(0, 0, 0, 0.48)` (`#0000007A`) | `.aw-desc, .under` |
| Text / rule on paper | `--rule` | `rgba(29, 29, 27, 0.5)` | Many 1px dividers on `.cdc6be` |
| Accent | `--accent` | `#C03F13` | "NEW" badge, `.m-active` underline indicator, `.new-w`, `.new-w-2` |
| Accent (cursor / scroll thumb) | `--accent-mute` | `#69645F` | `.c-scrollbar_thumb` |
| Border | `--border` | `#1D1D1B` | 1px around image frames, testimonial cards |
| Doodle / hover accent | `--accent-stroke` | `#96B59F` | Inline SVG hover stroke in `.head-wrap` |

Dark mode: N/A — the entire site *is* dark; the light variant is the kraft
beige `#CDC6BE` used for cards and the app surface.

### Typography

The site ships four families (all self-hosted `.woff2` from
`uploads-ssl.webflow.com/5f2429f172d117fcee10e819/`).

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (H1, hero "Miranda") | `"Canopee", sans-serif` | 400 | `37vw` | `24vw` | `-0.05em` |
| Display (H2, section "Website", "Think, Create", "The / pixel / perfect / artisan") | `"Canopee", sans-serif` | 400 | `31vw` (h2 base) / `26.4vw` (`.m-head.shape`) / `8.5vw` (`.h-head.ex`) / `7.8vw` (`.h-head`) | `20vw` / `5–10vw` | `-0.04em` to `-0.05em` |
| Display (numbers, awards) | `"Germgoth"` (declared, no `@font-face` in dump — system fallback) | 400 | `11vw` (`.m-numb`) | `6vw` | `normal` |
| Serif accent (single letters in display words) | `"Domaine Display", sans-serif` | 500 | inherits (e.g. `8.5vw` inside `.h-head.ex`) | inherits | `-0.02em` to `-0.06em` |
| H3 (label / kicker) | `"Canopee", sans-serif` | 400 | `3vw` (`.m-title`) / `5vw` (`.aw-name`) | `3vw` / `2vw` | `-0.045em` / `-0.03em` |
| Body / running copy (default `body`) | `"Editorial New", sans-serif` | 300 | `2.15vw` | `2.5vw` | `-0.02em` |
| Body small (`.item-desc`, `.aw-desc`) | `"Editorial New", sans-serif` | 300 | `1.2vw` – `1.8vw` | `1.5vw` – `2.3vw` | `-0.01em` to `-0.03em` |
| Caption / kicker (`.m-init`) | `"Editorial New", sans-serif` | 300 | `1.7vw` | `2vw` | `-0.03em` |
| Tag / pill (`.new`, `.new-2`) | `"Canopee", sans-serif` | 400 | `1.2vw` – `1.5vw` | `1.5vw` | normal |
| Marquee / CTA | `"Canopee", sans-serif` | 400 | `6vw` (`.marquee-text`, `.cta-text.work`) | `4vw` – `6vw` | `-0.04em` |
| Drop-cap (`A` in `.has-dropcap`) | `"Canopee", sans-serif` + `font-feature-settings: "ss03"` | 400 | `7vw` desktop / `20vw` mobile | `5vw` / `17vw` | normal; `float: left`; bg `#1D1D1B` color `#CDC6BE` |

Loading: `@font-face` with `font-display: swap`; `font-style: normal`. All
five files declared in `tools/tmp/niccolomiranda/playwright/css/miranda-paper-portfolio.webflow.1c78bb630.min__3873bb35.css`
(parsed via Python; the file is on a single 92 KB minified line):

```
@font-face { font-family: 'Domaine Display';    src: url('.../5f242a698c20ba6e1306dddc_DomaineDispCond-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Domaine Display';    src: url('.../5f242a69b1577e63266b4d72_DomaineDispCondMedium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Editorial New';      src: url('.../5f242a694256f02b944d5767_EditorialNew-Light.woff2')  format('woff2'); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: 'Editorial New';      src: url('.../61099e9d29b5b66c3799db9a_EditorialNew-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Canopee';            src: url('.../616fd1dd00cf6c70f978fc69_Canopee.woff2')              format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
```

### Spacing & radius

- **Base unit:** 4px, but the design uses **vw-driven** spacing throughout
  (e.g. `2vw`, `3vw`, `4.5vw`) so layout scales with viewport.
- **Scale (vw):** `0.2`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `3.5`, `4`, `4.5`,
  `5`, `6.5`, `7.8`, `8.5`, `13`, `17`, `26.4`, `30`, `31`, `36.6`, `37`.
- **Section gutter:** `2vw` horizontal padding on `.app`, `.footer`,
  `.headline`, `.marquee`.
- **Radii (vw-based):** xs `.2vw`, sm `.3vw`–`.5vw`, md `.6vw`–`.8vw`,
  lg `1vw`–`1.5vw`, xl `2vw`, pill `50%` (CTA `.cta-h.home`).
- **Shadows:**
  - testimonial cards: `-4px 4px 6px rgba(29, 29, 27, .2)` and
    `-5px 3px 6px rgba(29, 29, 27, .2)` (with `.s-2` having a slightly
    different offset).
  - Webflow badge: `0 0 0 1px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.1)`.
  - `.brand-bg`: no shadow, used as a color overlay only.
- **Blur / duotone filters (CSS):** `filter: blur(3px) saturate(80%)` on
  `.aw-img`; `filter: grayscale()` on `.policy-img`; mixed in JS via inline
  `filter: grayscale(0%)` toggling.

### Iconography

- **Style:** outline / glyph, no formal icon library.
- **Inline SVG count:** 5 — a long-stroke arrow (`arrow-long.svg`),
  three decorative test-quote glyphs (a curly typographic "?" — viewBox
  `0 0 130 314`, fill `#000`), and two `headline` ellipses (viewBox
  `0 0 500 146`, dashed-stroke hover with `cubic-bezier(0.785, 0.135, 0.15, 0.86)`
  and `stroke-dashoffset 1100 → 0`).
- **Standalone SVG files:** see Assets → SVGs & icons.
- **Default sizes:** `.arrow` is `width: 10vw` (case `16vw`), positioned
  absolutely with `left: -17.8vw`; logo `.nav-img` is `width: 100%` inside
  `19vh`-wide `.nav-head`.

---

## Layout & Grid

- **Max content width:** none — the layout is fluid `100vw` and uses
  `vh` (or `var(--vh) * 100`) for vertical sizing. `.app` is
  `width: 100vw`.
- **Page gutter:** `2vw` horizontal padding (`43.2px @ 1440w`).
- **Grid:** hero section uses an explicit `display: grid` named-area
  template (`.h-grid`):
  ```
  grid-template-areas:
    "Area-4 Area-4 Area-4"
    "Area-2 Area-3 Area-3"
    "Area Area Area"
    "Area-5 Area-5 Area-6"
    "Area-11 Area-11 Area-11"
    "Area-9 Area-9 Area-10"
    "Area-8 Area-8 Area-8";
  grid-template-columns: 1fr 1fr 1fr;
  ```
  with `grid-column-gap: 3vw` and `grid-row-gap: 4vw`.
- **Breakpoints (visible in CSS):** mobile-only `<= 479px`, mobile `<= 991px`
  (no Locomotive + no curtain effect), `<= 1440px` (menu height recalculated).
- **Vertical rhythm:** no fixed baseline — vertical spacing is `vw`-based too.

**Page composition (top → bottom):**

1. **`<canvas id="below-canvas">`** — fixed WebGL paper-curtain shader,
   rotated `180deg` and placed *under* the app.
2. **`<nav class="nav default is-inview">`** — fixed sticky bar, height
   `10.8vh` (`var(--vh) * 10.8`). Background `#CDC6BE`, contains a *second*
   `<canvas id="above-canvas">` running the paper-curtain for menu/page
   transitions. Left block shows "Amsterdam, NL", center has the SVG wordmark
   (dark + light variant), right has a hamburger made of two `2px × 2rem`
   lines.
3. **`<aside class="sidebar init">` (header role)** — the butter-slider
   horizontal work carousel. Starts at `padding-top: 15vh`. The slidable
   inner is `transform: translate3d(-892.8px, 0px, 0px)` initially (offset
   `0.62 / dragSpeed` of viewport width).
4. **`<main class="app">` (h-grid)** — the editorial bio grid, with the
   `paper-background` (`mix-blend-mode: multiply`, `opacity: 0.3`) overlaid.
   - `Area` row 1: big black-on-paper "Miranda" H1 (`37vw`, `Canopee`).
   - `Area-2/3`: "Interactive" H2 (`.h-head.s-1`, `8.2vw`) + "Artist!" H2
     (`.h-head.sub`, `14vw`).
   - `Area` row 2: avatar image (`set1`, `width: 100%; height: 40vw`)
     alongside a typographic stack of H2s listing roles: "digital art
     director", "Interactive Designer", "creative developer", "based in
     Amsterdam, NL." (each `8.5vw`, with single letters swapped to
     `Domaine Display Condensed Medium` via `.f-span`).
   - `Area-5/6` row: "Website" black-paper badge (`30vw` Canopee on
     `#1D1D1B`) + stamp image + tagline.
   - `Area-9/10`: the "Upcoming / Fresh entry" featured case card with the
     "Tip!" caption.
   - `Area-8`: stats row (9 / 1 / 6 / 8) of awards + giant
     "perfection / artisan" stacked H2 in Canopee black-on-paper.
   - `Area-11`: testimonial cards (`aw-block s-1` to `s-4`,
     `width: 40vw; height: 25vw`, offset horizontally with
     `transform: translate(-22vw / -43vw / -65vw)`).
   - Plus a separate `<header class="sidebar">` for the right-side
     scroll-snap sidebar (mobile/desktop alternates).
5. **`<footer class="footer">`** — `.marquee` band with three repetitions
   of "Let's create something together — Email Me" (`.marquee-text` is
   `6vw` Canopee on `#1D1D1B`), plus `.f-info` with `Miranda©`, legal link,
   and `twitter · instagram · dribbble · behance` socials in `1.5vw`
   Canopee.

**Page-wide overlays (always-on):**

- `<div class="gl-canvas below w-embed">` wraps `#below-canvas` and is
  positioned `position: absolute; top: 0; left: 0; width: 100vw;
  height: 100vh` with `pointer-events: none`.
- `<div class="gl-canvas">` *inside* `<nav>` wraps `#above-canvas`.
- `<div class="paper-background">` is a single full-bleed div with
  `background-image: url(.../pt-texture-2.jpg)`, `opacity: 0.3`,
  `mix-blend-mode: multiply` (declared inline because the `.app`
  transform-context requires it), `z-index: 998` (one less than the
  nav), `pointer-events: none`. It gives every page a subtle paper grain.
- `<div class="grid">` is a fixed-position dev grid with `opacity: 0.05`
  showing 12 columns (`4.5vw` wide, `0.8vw` margin); declared
  `display: none` so it never shows up in production.
- `<div class="rotate">` shows "Please rotate your device" on portrait
  phones (also `display: none` on desktop).
- A persistent `<span class="c-scrollbar"><span class="c-scrollbar_thumb">…</span></span>`
  appended at the end of `<body>` by Locomotive Scroll
  (`background-color: #69645f; border-radius: 10px; width: 5px;
  margin: 3px; z-index: 99999`).

---

## Components

### Nav (top bar)

- **Position:** `position: fixed; top: 0` with `z-index: 999` and
  `width: 100%`. Webflow `data-scroll-sticky="true"`.
- **Height:** `10.8vh` (or `calc(var(--vh, 1vh) * 10.8)`).
- **Background:** `#CDC6BE` (paper).
- **Anatomy:**
  - `.nav-block.l` — left, contains `.n-text` "Amsterdam, NL"
    (`Editorial New 300, 1.8vh/2vh`).
  - `.nav-head` (`width: 19vh`) — center, contains the logo. Two SVG
    variants: `.nav-img.dark` (`#1D1D1B` fill, viewBox `0 0 272 41`) and
    `.nav-img.light` (`#CDC6BE` on transparent).
  - `.nav-block.r` — right, `.nav-link` wrapping two `.nav-line` spans
    (`2px × 2rem` black bars) that animate into an X.
- **Behavior:** on mobile (`<= 991px`) Locomotive Scroll is disabled
  (`is_touch_device()` guard). Nav hides via `transform: translateY(-100%)`
  on `.nav.hide .nav-inner` with `transition: transform .4s cubic-bezier(.65,0,.35,1)`.

### Menu overlay

- **Background:** `1D1D1B` (ink), `width: 100vw; height: 100vh` (or
  `calc(var(--vh) * 100)` on `<= 1440px`).
- **Anatomy:** grid `2 × auto`, three `.menu-link`s (Index / Work / About).
- **Titles:** `.menu-title.m1/m2/m3` — `Canopee 400` at
  `30vh / 20vh line-height` in `#CDC6BE`, with one `f-span` set in
  `Domaine Display Condensed Medium 500` to vary letter spacing
  (`-0.09em` to `-0.1em`).
- **Active indicator:** `.m-active.index` is a `1.5vh` tall `#C03F13`
  bar that animates from `scaleX(0) → scaleX(1)` with the letter-spacing
  transition (`cubic-bezier`).

### Hero wordmark + bio grid (`.h-grid`)

- **H1 "Miranda":** `Canopee 400, 37vw / 24vw`, color `#CDC6BE` on
  `#1D1D1B`, padding `4.5vw 1vw 1vw`.
- **Avatars:** `.h-img.set1.blend` is the primary photo, sized
  `width: 100%; height: 40vw`, with `.h-img.blend` overlay showing the
  same image as a `background-image` with `background-color: #E2DEDB`,
  `background-position: 42% 37%`, `background-size: 90vw`.
- **Role list:** each `.h-head.ex` is `8.5vw / 6.6vw`, with single
  `Domaine Display` letters in `.f-span`. Underline color
  `rgba(0, 0, 0, 0.48)` with `text-underline-offset: 0.3vw` and
  `text-decoration-thickness: 0.5px`.
- **Stamp:** `60474834660f934090d42877_stamp.png` displayed at
  `1.7vw` inline or `11vw` (`.f-stamp.p`).

### CTA pill (`.cta-h.home`)

- **Shape:** `width: 100%; height: 13vw; border-radius: 50%`.
- **Background:** `#D3CBC2`, border `1px solid rgba(29,29,27,.5)`.
- **Label:** "All Work" — `Canopee 400, 7vh / 7vh` (`.cta-text.work`
  overrides to `6vw / 6vw` uppercase), with `f-span.space` in `Domaine
  Display Condensed Medium 500` at `-0.06em`.
- **Arrow:** `.arrow` SVG `width: 10vw`, absolute `left: -17.8vw`.

### Project card (`.item`)

- **Width:** `max-width: 29vw` per item; right margin `3vw` between items.
- **Image:** `.item-img` is `29vw × 11vw` with default Webflow
  `background-image.svg` placeholder; the actual photo is the `.item-img-w`
  container `width: 28vw` with `border: 1px solid #1D1D1b; overflow: hidden`.
- **Title:** `.item-t` SVG, `height: 100%` (custom hand-drawn wordmark per
  project, e.g. `books-of-ye.svg`, `om-swami.svg`).
- **"NEW" badge:** `.new-w-2.sp` is a `0.2vw` rounded pill, `#C03F13`,
  with `.new-2` text in Canopee `#CDC6BE` at `1.2vw / 1.5vw`.
- **Description:** `.item-desc` — `Editorial New 300, 1.2vw / 1.5vw`.

### Awards stats row (`.m-row`)

- **Layout:** `display: flex; justify-content: space-between;
  padding: 3.5vw 0 3vw`.
- **Per stat:** `.m-col` containing `.m-init` (kicker,
  `Editorial New 300, 1.7vw / 2vw`) + `.m-title` (label,
  `Canopee 400, 5vw / 5vw`) + `.m-numb` (number, declared
  `Germgoth 400, 11vw / 6vw`, falls back to next stack).
- **Counts observed:** 9 / 1 / 6 / 8 (SOTD, SOTM, FWA, Mentions).

### Testimonial cards (`.aw-block.s-1` … `.s-4`)

- **Size:** `width: 40vw; height: 25vw`.
- **Background:** `#CDC6BE`, border `2.5px solid #000`, `border-radius: .8vw`.
- **Padding:** `2.5vw 3vw 3vw`.
- **Shadow:** `-4px 4px 6px rgba(29,29,27,.2)`.
- **Anatomy:** 5 dashed lines (`.aw-line` height `1px` with `margin-bottom: 3.7vw`)
  leading to a giant "?" mark (`.aw-qa`, SVG `width: 9vw`), then
  `.aw-desc` (`Editorial New 300, 2.2vw / 2.8vw`, underline color
  `rgba(0,0,0,.48)`), then `.aw-infos.center.h` (absolutely-positioned at
  bottom) with circular `.aw-box` (`3vw × 3vw`, `border: 1px solid #1D1D1B`,
  `border-radius: 50%`) holding the avatar and `.aw-name` (`Canopee 400,
  2.2vw / 2vw`) + `.aw-role` (`Editorial New 300, 1.4vw / 1.3vw`).
- **Dashed border:** inline SVG `data:` URI with `rx: 8`, `stroke: #333`,
  `stroke-dasharray: 11,11`, `stroke-dashoffset: 30` — overlaid by
  `.aw-inner > .dash`.

### Marquee (`.marquee`)

- **Size:** `width: 100%; height: 11vw`; bordered top + bottom
  `1px solid #1D1D1B`.
- **Inner track:** `.marquee--inner` is `width: 300%`, animates
  `@keyframes bettermarquee { from { translate3d(0,0,0) } to { translate3d(-30%,0,0) } }`
  with `animation-duration: 4s; animation-timing-function: linear;
  animation-iteration-count: infinite`.
- **Cell:** `.marquee-content` (flex, `margin-right: 2vw`) + `.f-news`
  (`Editorial New 300, 6vw / 8vw`, `letter-spacing: -0.04em`) +
  `.marquee-link` (`background-color: #1D1D1B; padding: .5vw .8vw .8vw`)
  containing `.marquee-text` (`Canopee 400, 6vw / 4vw`,
  `color: #CDC6BE`).
- **Hover:** pauses animation (`animation-play-state: paused`).

### Footer (`<footer class="footer">`)

- **Padding:** `3vw 2vw 2vw`.
- **`.f-info`:** `display: flex; justify-content: space-between`.
- **`.f-title`** "Miranda©" — `Canopee 400, 1.6vw / 1.3vw`,
  `letter-spacing: -0.03em`, uppercase.
- **`.f-li.new-tab.f`** socials — `Canopee 400, 1.5vw / 1.5vw`,
  separated by `·` (Canopee `3vw / 21.6px` with `f-span` for the `g` of
  instagram and the `c` of behance — set in `Domaine Display Condensed
  Medium 500`).

### Input (Webflow default)

Although the homepage does not show a visible form, the Webflow reset
defines the canonical input:

- **Heights:** `38px` (`.w-input, .w-select`).
- **Border:** `1px solid #ccc`; focus `border-color: #3898ec`.
- **Background:** `background-color: #fff` (disabled: `#eee`).
- **Padding:** `8px 12px`; `font-size: 14px; line-height: 1.42857`.
- **Label:** `margin-bottom: 5px; font-weight: 700; display: block`.
- **Disabled state:** `cursor: not-allowed; background-color: #eee`.
- **Error:** `.w-form-fail { background-color: #ffdede; padding: 10px }`.
- **Success:** `.w-form-done { background-color: #ddd; padding: 20px }`.

### Button (Webflow default `.w-button`)

- **Color:** `#fff` on `background-color: #3898ec` (the default Webflow
  blue — *not* actually used on the visible page; the site prefers the
  paper CTA pill).
- **Padding:** `9px 15px`; `border: 0; border-radius: 0`.
- **`<input>` styling:** `-webkit-appearance: button`.

### Featured / Upcoming card

- **Layout:** a `.h-block` containing `<h2 class="head set2">Website</h2>`
  with `Up · co · min · g · Next` 5 inline `.aw-line` bars (heights
  `1px`, color `#1D1D1B`) — a *literary* stand-in for a status badge.
- **Body copy:** "Fresh entry – A selected work from the latest digital
  releases."
- **Image:** `.h-img.set3` `width: 100%; height: 100%` with the
  featured case thumbnail (`Unexpected Time`).
- **Tip line:** `class="item-title cap"` ("tip!" in Canopee, uppercase)
  next to `class="item-desc cap"` ("Click on the image to explore",
  Editorial New Light).

### Drop-cap paragraph (`.has-dropcap`)

- **Default:** `Editorial New 300, 2.25vw / 2.7vw`, left-aligned.
- **`first-letter`:** `font-family: "Canopee", sans-serif;
  font-feature-settings: "ss03"` (stylistic set 03 — Canopee's distinctive
  variant letters); `float: left; font-size: 7vw; line-height: 5vw;
  margin: .7vw 1vw 1vw 0vw; background-color: #1D1D1B; color: #CDC6BE;
  padding: .75vw .4vw .5vw .5vw`.
- **Mobile (<= 479px):** paragraph drops to `6vw / 7.5vw`, drop-cap
  becomes `20vw / 17vw`, padding `1.5vw .8vw .5vw 1vw`.

### Inverted-paper "artisan" badge

- **`.m-head.shape` / `.m-head.shape.b`:** `Canopee 400, 26.4vw / 25.4vw`,
  `letter-spacing: -0.045em`, `color: #CDC6BE; background-color: #1D1D1B`,
  `padding: 2vw 2vw .3vw 1vw`. Displayed as a black bar that sits
  *underneath* the white "artisan" headline — visually anchors the
  hero cluster.

### Hamburger trigger (`.nav-link` → `.nav-line.up` + `.nav-line.bottom`)

- **Container:** `<div class="nav-link">` contains `<div class="nav-lines">`
  which wraps the two bars.
- **Bars:** `2px × 2rem` (#1D1D1B), stacked with `margin-top: .19rem`
  between. On Webflow IX2 they morph into an X via `transform: scaleX(0)`
  on the inner spans.
- **Trigger:** clicking `.nav-link` fires `onNavClick` which dispatches
  `window.paperCurtainEffect.in()` (or `.out()`); the menu itself is
  `display: none` until then.

### Doodle "headline" hover (`.head-wrap > .head-embed > #headline > .doodle-hover`)

- **Ellipse SVG:** `<svg viewBox="0 0 500 146">` with a single
  `<ellipse cx="250" cy="72.9" rx="242.4" ry="68.5" fill="none"
  stroke="#1d1d1b" stroke-width="2" stroke-miterlimit="10"/>`.
- **Style:** `stroke-dasharray: 1100; stroke-dashoffset: 1100`; hover
  on `.head-wrap` triggers `stroke-dashoffset: 0` over
  `600ms cubic-bezier(0.785, 0.135, 0.15, 0.86)` — a classic
  "draw the line" interaction that defines the homepage identity.

### Project image transform state (`.item-img`)

- Inline `transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1)
  rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  transform-style: preserve-3d;` baked in by Webflow IX2 — ready for
  hover scale or parallax.
- `.filter: grayscale(0%)` toggled on hover/active — the thumbnails
  are colored by default, not desaturated.
- Image is positioned inside `.item-img-w` (`width: 28vw; overflow:
  hidden; border: 1px solid #1D1D1B`) so the transform scale clips
  cleanly.

### Brand rail (`.brand-inner`) — work-case page only

- **Cell:** `width: 18vh; height: 100vh` (one column of a horizontal
  brand rail).
- **Border:** `border-left/right: .5px solid rgba(0,0,0,.3)`.
- **Padding:** `padding-top: 24vh; padding-bottom: 8vh`.
- **Hover:** `background-color: #D3CBC2` over `0.2s ease-in-out`.
- **Source rotation:** `transform: rotate(90deg)` on `.source-img`,
  `transform: rotate(270deg)` on `.brand-list-item-info`.

### Brand background overlay (`.brand-bg`)

- **Position:** `position: absolute; top: 0; left: 0; right: 0;
  bottom: 0; width: 100%; height: 100%; z-index: -1`.
- **Background:** `#BEB5AB`, `opacity: 0`; fades in when a brand cell is
  selected.

### Book expand (`.book-wrap`) — work-case page only

- **Default:** `width: 0; opacity: 1; transform-origin: 0%`.
- **Open state:** `width: …` over `0.5s cubic-bezier(.645,.045,.355,1)`.
- **Border:** `border-right: 1px solid rgba(29,29,27,.3)`.

### Gallery drawer (`.gallery`) — work-case page only

- **Default:** `display: none`.
- **Open:** `width: 100%; height: 100vh; z-index: 4; position: fixed`.
- **Drawer:** `.gallery-box { width: 40%; height: 100%; background-color:
  #CDC6BE; position: absolute; right: 0; top: 0 }`.
- **Close:** `.gallery-close { position: absolute; top: 2vw; right: 2.5vw;
  cursor: pointer }`.
- **Items:** `.gallery-item { height: 20vw; border: 1px solid #000;
  border-radius: .5vw; margin-bottom: 5vw; overflow: hidden }`.

### Marquee pause control

`.marquee--inner:hover { animation-play-state: paused; }` is the only
hover-driven control on the marquee. The animation is not rebuild or
restarted; the inner element simply stops moving while the cursor is
over it, so the user can read a particular email-me call-to-action.

### Ripped paper divider (`.c-ripped`) — work-case page

- **Height:** `60vw`, full-width.
- **Image:** `background-image: url(.../6155c07f1c37174850256cab_patch.svg)`,
  `background-size: cover; background-position: 50%`.
- **Position:** `position: absolute; bottom: -43.2vw; left: 0; right: 0;
  z-index: 1; overflow: hidden`.

### Publications row (`.article-grid`) — work-case page

- **Grid:** `grid-template-rows: auto auto; grid-template-columns: 1fr
  1fr 1fr; grid-auto-columns: 1fr; gap: 2vw`.
- **Item bottom border:** `border-bottom: 1px solid rgba(29,29,27,.3)`
  with `padding-top: 2vw; padding-bottom: 3vw`.
- **Number:** `.numb { text-align: center; font-size: 3.3vw; line-height:
  3.6vw }` — sequential index.
- **Title:** `.article-title { letter-spacing: -0.04em; font-size: 3vw;
  font-weight: 500; line-height: 3vw }`.

---

## JavaScript & Libraries

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| **Webflow** | frontend lib (custom build) | `playwright/js/webflow.07467efa9__52e4f042.js` (273 KB) | `/*! Webflow: Front-end site library @license MIT */` — provides `window.tram` (in-house micro-tweener), CMS interaction (`[data-w-id]`), form bindings. |
| **jQuery** | 3.5.1 | `playwright/js/jquery-3.5.1.min.dc5e7f18c8__e07f811a.js` (89 KB); also loaded inline from `d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js` | Required by Webflow. |
| **GSAP** | 3.7.1 | `playwright/js/gsap.min__85b2c759.js` (63 KB) `/*! GSAP 3.7.1 https://greensock.com */`; also `<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js">` in HTML | Drives `gsap.to(el, { opacity: 0, duration: 0.6, ease: Expo.easeOut })` for nav fade-out, `gsap.ticker` inside PaperCurtainEffect for the render loop. |
| **Locomotive Scroll** | 4.1.3 | `playwright/js/locomotive-scroll.min__cc8f42dc.js` (47 KB); CSS at `https://cdn.jsdelivr.net/gh/locomotivemtl/locomotive-scroll/dist/locomotive-scroll.min.css`; init script reads `[data-scroll-direction]` (vertical here) | Smooth-scroll on `[data-scroll-container]`. `wheel`/`touch` only (skipped on `is_touch_device()` true). Custom `.c-scrollbar` with thumb `#69645F` `width: 5px`, `border-radius: 10px`, `margin: 3px`. |
| **butter-slider** | unpkg `butter-slider` (no version pinned) | `playwright/js/bundle.umd__3cec8bf0.js` (UMD bundle, `window.butterSlider`); loaded from `https://unpkg.com/butter-slider` | Horizontal drag slider for the work carousel. Init: `butterSlider.autoInit()` then `sliders[0].smoothAmount = 0.15; sliders[0].setRelativePosition(window.innerWidth * (0.62 / sliders[0].dragSpeed))`. DOM hooks: `data-butter-container`, `data-butter-slidable`, `data-butter-butter-options="smoothAmount:0.15,dragSpeed:2.5,hasTouchEvent:true"`. |
| **OGL (micro WebGL)** | 0.0.74 | `playwright/js/paper-curtain__409f547c.mjs` (11 KB) — `import { Renderer } from "https://unpkg.com/ogl@0.0.74/src/core/Renderer.js"` (+ Program, Texture, Triangle, Mesh, Vec2, Color) | Used to render the paper-curtain transition shader. |
| **Paper.js** *(signature only — files present, not executed)* | unknown | `playwright/js/Color__e4c07446.js`, `ColorFunc__1110f85a.js`, `Euler__4ffcdc96.js`, `EulerFunc__0815e463.js`, `Geometry__c86ae8eb.js`, `Mat3__7b65d6da.js`, `Mat3Func__279593ad.js`, `Mat4__7e3eaa37.js`, `Mat4Func__105b719f.js`, `Mesh__32f46547.js`, `Program__f3aa4280.js`, `Quat__7dc697db.js`, `QuatFunc__7c06b3c3.js`, `Renderer__7fe3022f.js`, `Texture__a17304ee.js`, `Transform__48ba6004.js`, `Triangle__d0a51f7c.js`, `Vec2__8476a498.js`, `Vec2Func__616ba4a5.js`, `Vec3__babab2e1.js`, `Vec3Func__af91705f.js`, `Vec4Func__ccaf48c5.js` | These are all of Paper.js's math classes — filenames match Paper.js's `src/` layout exactly. Loaded but not observed in the homepage runtime (likely used on the Work case-study templates that have 3D `<canvas>` work). |
| **Google Tag Manager** | gtm.js | `playwright/js/js__043d1396` (366 KB) and `playwright/js/js__56d412ff` (431 KB) | `// Copyright 2012 Google Inc.` — `__ogt_1p_data_v2`, `__ogt_ga_send`, destination `G-DCFER6NQ7J`. |
| **Webflow icons font** | (data-URI TTF, base64-encoded) | inline in `miranda-paper-portfolio.webflow.1c78bb630.min.css` | One `@font-face` for `webflow-icons` (used for Webflow component icons like sliders). |
| **Custom `PaperCurtainEffect`** | author-written, 2021 | `playwright/js/paper-curtain__409f547c.mjs` | Default export; `new PaperCurtainEffect(canvas, opts)`. |

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `spin` | `playwright/css/miranda-paper-portfolio.webflow.1c78bb630.min__3873bb35.css` (~line 1, in the Webflow base reset) | `0.8s` | `linear` | `infinite` (Webflow spinner default) |
| `marquee` | `playwright/homepage.html` (inline `.marquee-embed w-embed` block, ~line 360-389) | not used (`animation-duration: 8s` on dead rule) | `linear` | infinite (declared but replaced by `bettermarquee`) |
| `bettermarquee` | `playwright/homepage.html` (same inline block) | `4s` | `linear` | infinite, applied to `.marquee--inner` (`translate3d(0,0,0) → translate3d(-30%,0,0)`); pauses on hover |

### CSS transitions (representative)

| Selector | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `body:not(.index, .work-case) #app` | `opacity` | `1s` | `ease-out` | first paint, when `.appear` class is added |
| `.nav-inner` | `transform` | `0.4s` | `cubic-bezier(.65, 0, .35, 1)` | `.nav.hide` toggled |
| `.nav-inner` | `transform-style: preserve-3d` | n/a | n/a | always |
| `.book-wrap` | `width` | `0.5s` | `cubic-bezier(.645, .045, .355, 1)` | `.brand-inner:hover` (work case page) |
| `.brand-inner` | `background-color` | `0.2s` | `ease-in-out` | hover |
| `.menu-title` | `letter-spacing` | `0.3s` | `ease-in-out` | hover |
| `.aw-desc, .under` | (text-decoration only) | n/a | n/a | always |
| `.head-embed #headline .doodle-hover` | `stroke-dashoffset` | `600ms` | `cubic-bezier(0.785, 0.135, 0.15, 0.86)` | `.head-wrap:hover` |
| `.marquee--inner` | `animation-play-state` | n/a | n/a | `.marquee--inner:hover` (paused) |
| `.marquee` | `will-change: transform; transform: translateZ(0)` | n/a | n/a | always (GPU promote) |
| `.paper-background` | `will-change: transform` | n/a | n/a | always (GPU promote) |
| Webflow `.w-button` | `all` | `0.3s` | default | hover/focus |
| Webflow input `.w-input, .w-select` | `background-color, color` | `0.1s` | default | focus/disabled |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP 3.7.1 | `gsap.to(el, { opacity: 0, duration: 0.6, ease: Expo.easeOut })` for `.nav-head, .nav-block, .menu-line, .paper-background` | click on internal link | Used in the page-transition handler to fade the nav out before paper-curtain animation |
| GSAP 3.7.1 | `gsap.ticker.add(this.onFrameHandler)` inside `PaperCurtainEffect` | every frame | Drives the `uProgress` uniform `0 → 1 → 0` via `gsap.to(...)`. |
| OGL + PaperCurtainEffect | `in()` / `out()` (`paper-curtain__409f547c.mjs:345-367`) | hamburger click / internal link click | Tween `uProgress` from 0→1 or 1→0 with `duration: 2`, `ease: "power3.inOut"`. On complete dispatches `new Event('paper-curtain')` on `document.body`; listener navigates. |
| OGL shader (`uProgress`) | vertex: identity; fragment: `fbm` simplex noise + `sin(uProgress * PI)` curve | every frame while a transition is running | Drives the *ripped paper* reveal. Math: `colorLimit = 1 - (uProgress + curve - rippedNoise1 - curveNoise1 - (uRippedHeight*0.5)*amplitude)`. Uses `uTexture` (paper grain JPG) and `uImage` (linked destination thumbnail). |
| Locomotive Scroll 4.1.3 | smooth scroll on `[data-scroll-container]` | DOMContentLoaded (`is_touch_device()` guard) | `direction: 'vertical'`, `smooth: true`. `.c-scrollbar_thumb` updates height/position each frame. |
| butter-slider | `sliders[0].smoothAmount = 0.15; setRelativePosition(window.innerWidth * (0.62 / sliders[0].dragSpeed))` | DOMContentLoaded | Horizontal drag on the work carousel. Initial slidable `transform: translate3d(-892.8px, 0px, 0px)`. |
| butter-slider | smoothAmount `1 → 0.15` swap | DOMContentLoaded | Two-step init (first slam, then settle) — known butter-slider API. |
| Webflow IX2 | per-`data-w-id` Webflow interactions (transform translate3d tweaks on `.nav-line.up`, `.nav-line.bottom`, `.menu-title.m1`, `.m-active.index`, `.aw-block.s-1..s-4`, `.head-w`, etc.) | hover/click as authored in Webflow Designer | Many inline `transform: translate3d(...) scale3d(1,1,1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg,0deg); transform-style: preserve-3d;` attributes are baked by Webflow. |
| CSS transition | `body:not(.index, .work-case) #app` `transition: opacity 1s ease-out` + `#app:not(.appear)` `opacity: 0 !important` | initial paint | Used to fade the app shell in after the curtain; `app.classList.add('appear')` is added 2s after `belowPaperCurtainEffect.in()`. |
| CSS transition | `.menu-title` `transition: letter-spacing .3s ease-in-out` | hover | On hover `letter-spacing` goes to `-0.03em` and color shifts to `#BEB5AB`. |
| CSS transition | `.book-wrap` `transition: width .5s cubic-bezier(.645, .045, .355, 1)` | hover (work case page) | Work-case "book" expand on hover. |
| CSS transition | `.brand-inner` `transition: background-color .2s ease-in-out` | hover | Brand rail cell highlight. |
| CSS transition | `.nav-inner` `transition: transform .4s cubic-bezier(.65, 0, .35, 1)` | `.nav.hide .nav-inner` toggled | Slide-up nav on scroll down. |
| CSS transition | `headline ellipse` `transition: stroke-dashoffset 600ms cubic-bezier(0.785, 0.135, 0.15, 0.86)` | `.head-wrap:hover` | Doodle outline draws in on hover (`stroke-dasharray: 1100; stroke-dashoffset: 1100 → 0`). |

### Page transitions

- **Trigger:** any click on an `internalLinks` anchor
  (`link.href.includes(document.location.host)`).
- **Sequence:**
  1. `preventDefault()`; if a transition is in flight (`transition` flag),
     bail.
  2. Read `data-color` attribute (always `#1D1D1B` on this site); read
     optional `data-image` on the link's child (the case-study big
     thumbnail).
  3. Toggle:
     - **If menu is open (`toggle === true`):** set background to the link's
       `data-color` with opacity `1`; call `workPaperCurtainEffect.out()` or
       `paperCurtainEffect.out()`.
     - **Else:** `paperCurtainEffect.curtain.setColor(color, 1)`; set
       `uniforms.uHorizontal.value = 0`; `await setImage(image)`; rotate
       canvas `180deg`; `setInverted(true)`; call `paperCurtainEffect.in()`.
  4. Fade the nav (`.nav-head, .nav-block, .menu-line, .paper-background`)
     to `opacity: 0` over `0.6s` `Expo.easeOut`.
  5. Listen once for `paper-curtain` event on `document.body` → navigate to
     `href`.
  6. Hard fallback: `setTimeout(() => window.location.href = href, 2500)`.
- **First-paint freeze:** for `>= 768px`, `document.documentElement.classList.add('no-scroll')`
  is added on load and removed after `5000ms` (prevents scroll during the
  appearance animation); Locomotive is also `.stop()`-ped at `0ms` and
  `.start()`-ed at `5000ms`.

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump. The `models/` folder is empty.
All visuals are 2D (raster images + custom WebGL shader triangles) or
3D-posing-of-2D (the butter-slider slidable).

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Domaine Display Condensed | 400 (Regular), 500 (Medium) | woff2 | `https://uploads-ssl.webflow.com/5f2429f172d117fcee10e819/5f242a698c20ba6e1306dddc_DomaineDispCond-Regular.woff2` and `5f242a69b1577e63266b4d72_DomaineDispCondMedium.woff2` | yes (Webflow CDN) |
| Editorial New | 300 (Light), 500 (Medium) | woff2 | `https://uploads-ssl.webflow.com/5f2429f172d117fcee10e819/5f242a694256f02b944d5767_EditorialNew-Light.woff2` and `61099e9d29b5b66c3799db9a_EditorialNew-Medium.woff2` | yes (Webflow CDN) |
| Canopee | 400 | woff2 | `https://uploads-ssl.webflow.com/5f2429f172d117fcee10e819/616fd1dd00cf6c70f978fc69_Canopee.woff2` | yes (Webflow CDN) |
| Germgoth | 400 (declared only; not present in `@font-face` declarations) | n/a | not observed — falls back through stack | n/a |
| Webflow-icons | 400 | base64 TTF (data-URI) | inline in `miranda-paper-portfolio.webflow.1c78bb630.min.css` | yes |

Local dump paths (fonts present in `tmp/`):

- `playwright/fonts/616fd1dd00cf6c70f978fc69_Canopee__ef3a776d.woff2` (15.3 KB)
- `playwright/fonts/5f242a694256f02b944d5767_EditorialNew-Light__7d3ec84c.woff2` (36.7 KB)
- `playwright/fonts/5f242a69b1577e63266b4d72_DomaineDispCondMedium__7ed84382.woff2` (25.5 KB)

(`DomaineDispCond-Regular.woff2` and `EditorialNew-Medium.woff2` are
referenced in CSS but were not captured by the dump — note for future re-runs.)

### Images

| Local path | Type | Dimensions (declared) | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `playwright/images/604097559eb3c50a15dcf787_avatar-1__76ac7615.jpeg` | JPEG | 3000w (srcset up to `avatar-1-p-2600.jpeg`) | 270 KB | `https://cdn.prod.website-files.com/5f2429f172d117fcee10e819/604097559eb3c50a15dcf787_avatar-1.jpeg` | hero avatar (set1) |
| `playwright/images/605c62f4c78c4ba46a1268be_avatar-1-p-1600__7f86f8a6.jpeg` | JPEG | 1600w | 95.9 KB | `…/605c62f4c78c4ba46a1268be_avatar-1-p-1600.jpeg` | avatar (alternate size) |
| `playwright/images/605c679f33f67d3dd00b04b4_avatar-3__f4c1f43d.jpeg` | JPEG | n/a | 163 KB | `…/605c679f33f67d3dd00b04b4_avatar-3.jpeg` | secondary avatar |
| `playwright/images/605c6ce3bc0c7d1cd4ca847e_avatar-star-p-800__9aefc68f.jpeg` | JPEG | 800w | 78 KB | `…/605c6ce3bc0c7d1cd4ca847e_avatar-star-p-800.jpeg` | avatar with star graphic |
| `playwright/images/605c6da4f1f8304440ee2e8c_avatar-2-p-800__191e404f.jpeg` | JPEG | 800w | 65 KB | `…/605c6da4f1f8304440ee2e8c_avatar-2-p-800.jpeg` | avatar alt |
| `playwright/images/605c6fd0f6276ef0c6bacfa4_trophy-p-800__3422b439.jpeg` | JPEG | 800w (srcset up to `trophy.jpeg` 1105w) | 47 KB | `…/605c6fd0f6276ef0c6bacfa4_trophy-p-800.jpeg` | trophy decoration |
| `playwright/images/605c70e48081716925e9832a_avatar-hat__3278ba98.jpeg` | JPEG | n/a | 58 KB | `…/605c70e48081716925e9832a_avatar-hat.jpeg` | avatar with hat |
| `playwright/images/60474834660f934090d42877_stamp__94c7c660.png` | PNG | n/a | 127 KB | `…/60474834660f934090d42877_stamp.png` | rubber-stamp graphic (also referenced in footer `.f-stamp`) |
| `playwright/images/614f353f1e11a6a7afdd8b74_6059a3e2b9ae6d2bd508685c_pt-texture-2__910a4fce.jpg` | JPG | n/a | 55 KB | `…/614f353f1e11a6a7afdd8b74_6059a3e2b9ae6d2bd508685c_pt-texture-2.jpg` | **paper grain texture** used by the WebGL paper-curtain shader (`uTexture`) and by `.paper-background` (`opacity: .3`, `mix-blend-mode: multiply`) |
| `playwright/images/615b54ee0df682e04e089676_bruno-arizio__c1eec4dd.jpg` | JPG | n/a | 5.4 KB | `…/615b54ee0df682e04e089676_bruno-arizio.jpg` | testimonial thumb |
| `playwright/images/615b54ee54045a4769f04eba_sofia-papadopoulou__bb33d33c.jpg` | JPG | n/a | 5.0 KB | `…/615b54ee54045a4769f04eba_sofia-papadopoulou.jpg` | testimonial thumb |
| `playwright/images/615b54ee9805af64275d2b44_enea-rossi__8c6d5ca0.jpg` | JPG | n/a | 5.4 KB | `…/615b54ee9805af64275d2b44_enea-rossi.jpg` | testimonial thumb |
| `playwright/images/6172987a792f18104ce0ce14_sam-day__86a5c265.jpg` | JPG | n/a | 8.5 KB | `…/6172987a792f18104ce0ce14_sam-day.jpg` | testimonial thumb |
| `playwright/images/615d965c7d1e647b4cb97b73_thumbnail-small__b118c7df.jpeg` | JPEG | n/a | 103 KB | `…/615d965c7d1e647b4cb97b73_thumbnail-small.jpeg` | work card thumb |
| `playwright/images/615d9672cc65f12c9ab25f21_thumbnail-small__5a76294e.jpeg` | JPEG | n/a | 106 KB | `…/615d9672cc65f12c9ab25f21_thumbnail-small.jpeg` | work card thumb |
| `playwright/images/61cdc506856e75d4b33cd9bd_thumbnail-small__7cc12ac7.jpeg` | JPEG | n/a | 89 KB | `…/61cdc506856e75d4b33cd9bd_thumbnail-small.jpeg` | work card thumb |
| `playwright/images/621f2de86891ea03211fe874_thumbnail-small__bdf90dfd.jpeg` | JPEG | n/a | 61 KB | `…/621f2de86891ea03211fe874_thumbnail-small.jpeg` | work card thumb |
| `playwright/images/645b5439577bd35377de8c43_thumbnail-small__2fa51f07.webp` | WEBP | n/a | 73 KB | `…/645b5439577bd35377de8c43_thumbnail-small.webp` | work card thumb |
| `playwright/images/645b5c79f349770ebcc28ec4_thumbnail-small__43ff6289.webp` | WEBP | n/a | 115 KB | `…/645b5c79f349770ebcc28ec4_thumbnail-small.webp` | work card thumb |
| `playwright/images/647dc0777b1a5df29f8e5a58_thumbnail-small__91918ada.webp` | WEBP | n/a | 38 KB | `…/647dc0777b1a5df29f8e5a58_thumbnail-small.webp` | work card thumb |

Additional Webflow-hosted images referenced in the HTML but not captured
in this dump: `avatar-star.jpeg`, `avatar-2.jpeg`, `trophy.jpeg`
(unprefixed full-size variants), plus all `thumbnail-big.{jpeg,webp}`
case-study hero images (these are the `data-image` targets that the
`paper-curtain.mjs` shader uses as `uImage`).

### SVGs & icons

- **Inline SVGs (5):** 1 `headline` ellipse per header (× 2 — desktop and
  mobile instances), 3 large decorative "?"-glyphs (one per
  testimonial card with `.aw-before` overlay). All viewBox `0 0 130 314`,
  fill `#000`.
- **Standalone SVG files:**
  - `playwright/svgs/5f7f87c8b81a6e7a214312f0_header__f150e1dd.svg` (11.7 KB,
    viewBox `0 0 272 41`, fill `#1d1d1b`) — the dark "Miranda — Paper Portfolio"
    wordmark logo.
  - `playwright/svgs/605d989c371fba72f26870d2_header-w__95ce565c.svg` (11.7 KB,
    same viewBox, fill `#cdc6be`) — the light/inverted logo variant.
  - `playwright/svgs/61001a3509319b6ae39e156b_arrow-long__30c12dec.svg`
    (234 B, `width="123" height="38"`, stroke `#000`, stroke-width `2`)
    — the long hand-drawn arrow used in `.arrow` (CTA pill).
  - `playwright/svgs/background-image__46ae28cb.svg` (11 KB,
    viewBox `0 0 125 125`) — the Webflow default checker background,
    referenced as `https://d3e54v103j8qbb.cloudfront.net/img/background-image.svg`
    and used for `.item-img`, `.c-inner`, `.pw-img` (placeholder checker).
  - 7 hand-drawn project wordmarks (each unique):
    `5fa1c652d273b319eaf21a8a_avro-ko__d42afbb4.svg` (288×92),
    `6154cd66aac8e06eae680d70_prada__5564e0c9.svg` (215×74),
    `61cdc5850b96230b1b4e459a_books-of-ye__01681c83.svg` (374×73),
    `621f2e53bf183bf7ff43eede_om-swami__94630085.svg` (795×189),
    `645b591a574150afe2d9af38_roger-hub__a54cf6a5.svg` (441×75),
    `645b5d0c227d4a35562c5b85_unexpected-time__5bebf4b7.svg` (491×75),
    `647dc0ed22589620411e19d3_wow-concept__20243bca.svg` (455×75).
- **Icon system:** none; arrows and glyphs are bespoke inline + standalone
  SVGs. Webflow-icons data-URI handles any component icons internally.

### Audio & video

N/A — no `.mp4`, `.webm`, `.mp3`, or `.ogg` files in the dump. The
`media/` folder is empty. The only "media" in the page are the two WebGL
canvas elements (`#below-canvas`, `#above-canvas`) and a `<canvas>` inside
`.nav.work` for case-study pages.

---

## Motion & Interaction

### Principles

- Default page easing: **`power3.inOut`** for the paper curtain, `Expo.easeOut`
  for nav fade. CSS micro-interactions use the standard
  `cubic-bezier(.65, 0, .35, 1)` (`.nav-inner`) and
  `cubic-bezier(.645, .045, .355, 1)` (`.book-wrap`).
- Duration defaults: `0.6s` (nav fade), `1s` (`#app` opacity on
  non-index pages), `0.3s` (letter-spacing on `.menu-title`), `2s`
  (paper-curtain in/out), `4s` (marquee loop), `0.5s` (book wrap width).
- Everything is `vw`-driven: layout, type, spacing, radius — there is no
  `rem` and no media query in the dump except three near-duplicate ones
  for ≤ 479px and ≤ 1440px.

### Specific behaviors

- **Link hover:** the headline ellipse in `.head-embed` draws its stroke
  on hover (`stroke-dashoffset 1100 → 0` over `600ms`).
- **Menu title hover:** letter-spacing shifts `-0.09em → -0.03em` over
  `0.3s ease-in-out`; color shifts `#CDC6BE → #BEB5AB`.
- **Brand-rail cell hover:** background `#CDC6BE → #D3CBC2` over `0.2s`.
- **CTA pill press:** the `.cta-text.work` and `.arrow` use Webflow
  inline `transform: translate3d(0vw, 0px, 0px) scale3d(1, 1, 1)` —
  animate to scaleX(0) on click via Webflow IX2.
- **Page transition:** paper-curtain shader; duration `2s`; horizontal
  flag toggled at runtime (`uHorizontal`). When entering the index the
  curtain is rotated `180deg` and `uInverted = true` to play the reveal
  from below; when entering a non-index page the curtain starts at the
  bottom-canvas with `color: "#cdc6be"` and `backgroundOpacity: 1` (a
  solid inked panel sliding up).
- **Nav hide on scroll-down:** the `locomotive.on('scroll', …)` listener
  is commented out in the HTML but the `.nav.hide .nav-inner` rule still
  exists; the design *prepared* it but the JS is disabled in the current
  build.

### Reduced motion

Not observed. There are no `@media (prefers-reduced-motion: reduce)`
blocks in the dump. The paper curtain, marquee, and butter-slider would
all continue running.

### Scroll container (`<main id="app" data-scroll-container>`)

- Locomotive Scroll wraps the entire `<main>` in a CSS
  `perspective: 2000px` (inline `style` on
  `[data-scroll-container]`) to give the page a subtle 3D depth on
  scroll.
- `will-change: transform` is forced on the container.
- `data-scroll-section-id="section0"` and
  `data-scroll-section-inview=""` are written by Locomotive.
- `transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  transform-style: preserve-3d; opacity: 1; pointer-events: all;` is
  applied inline by Locomotive when the section is in view.

### vh fix on mobile (`--vh` custom property)

A small script (`<script>` block, line ~698 of the rendered HTML) sets
`--vh` to `window.innerHeight * 0.01` on every resize, then exposes it
as a CSS variable so layout uses `calc(var(--vh, 1vh) * 100)` instead of
`100vh`. This avoids the iOS Safari address-bar height bug.

### Pathname class

A regex `/(?<=work\/).*$/gm` matches the work slug after `/work/` and
adds it as a body class (`body.work-the-books-of-ye` etc.). The CSS
uses this for work-case-specific overrides like
`body:not(.index, .work-case) #app` (page-fade) and
`body.work-case` (background color).

---

## Content & Voice

- **Tone:** confident, technical, restrained. The site speaks in short,
  active phrases — "I design, develop, and deliver websites that drive
  results and win awards." — with a single dev signature ("Niccolò
  Miranda, Amsterdam, NL").
- **Sentence length:** short to medium. Mix of one-liners and 1–2
  sentence paragraphs.
- **Capitalization:** headings use Sentence case ("Interactive
  Designer", "digital art director", "based in Amsterdam, NL."), with
  menu and pill text in UPPERCASE (`Canopee` + `text-transform:
  uppercase`).
- **Punctuation:** ASCII em-dash (`—`) for taglines; curly double quotes
  used in testimonials (`"..."`), typographic ellipses are not used.
- **CTA vocabulary (verbs observed in the page):**
  - "Email Me" (footer marquee, three times).
  - "All Work" (CTA pill).
  - "Drag sideways to navigate" / "Click on the sides to explore"
    (caption hints for the work carousel).
  - "Tip!" (small Canopee label).
- **Quoted testimonials** (4): Sam Day, Sofia Papadopoulou, Bruno Arizio
  (Studio BA), Enea Rossi (Adoratorio). Each appears on its own
  `.aw-block` card with avatar + name + role + a hand-drawn `?` glyph.

---

## Information Architecture

Top-level routes observed in the rendered DOM and `<link rel="prefetch">`
declarations:

- `/` — marketing homepage (the entire dump).
- `/work` — Work index (referenced from menu, prerendered).
- `/about` — Awards & publications (referenced from menu, prerendered).
- `/legal` — Legal page (linked from footer).
- `/work/the-books-of-ye` — case study (NFT, "Books of Moses / Ye").
- `/work/om-swami` — case study (spiritual leader site).
- `/work/avroko` — case study (hospitality design firm).
- `/work/prada` — case study (eCommerce outlet for prior collections).
- `/work/the-roger-hub` — case study ("On" sneakers × Federer).
- `/work/wow-concept` — case study (Madrid concept store).
- `/work/unexpected-time` — case study ("classic-furitistic
  gamification" referenced in the body copy).
- `/work/[slug]` — dynamic Webflow CMS template for projects.

External socials linked from the footer: `twitter.com/niccolomiranda`,
`instagram.com/niccolomiranda`, `dribbble.com/niccolomiranda`,
`behance.net/niccolomiranda`, plus `awwwards.com/niccolo.miranda`,
`brunoarizio.com`, `adoratorio.studio`, and `mailto:info@niccolomiranda.com?subject=Project%20Request`.

---

## Accessibility

- **Color contrast:** `#1D1D1B` on `#CDC6BE` is roughly 12.4:1 (well above
  WCAG AAA for body text). The `#CDC6BE` "Email Me" pill on `#1D1D1B`
  marquee is the inverse, equally high.
- **Focus indicators:** *Not observed.* There are no explicit
  `:focus-visible` rules in the CSS and the site uses
  `*:focus { outline: none }` via `.wf-force-outline-none[tabindex="-1"]:focus`
  (the Webflow reset). Keyboard users would see no focus ring.
- **Keyboard:** the butter-slider is mouse/touch-only (no
  `tabindex`/`aria-` attributes observed on its slidable). The nav-link
  button is `<div>` (not a `<button>`), so it is not in the tab order
  unless given `tabindex`.
- **Screen reader landmarks:** `<main id="app">`, `<header>` (sidebar),
  `<nav>`, `<footer>` are all used. Decorative `.gl-canvas`,
  `.paper-background`, `.grid`, and `.rotate` have no aria/role.
- **aria-labels observed:** `aria-label="nav-link"`, `aria-label="brand"`,
  `aria-label="Niccolò Miranda – Home"`, `aria-label="Niccolò Miranda –
  Work"`, `aria-label="miranda-work"`, `aria-label="miranda-legal"`,
  `aria-label="awwwards"`, `aria-label="project"`,
  `aria-label="Miranda – Project Request"`. `aria-current="page"` is set
  on the active brand link.
- **Motion:** no `prefers-reduced-motion` handling observed.
- **Alt text:** present on all real content images (testimonial thumbs,
  avatars) and decorative SVG set to `alt=""`.
- **Language:** `<html lang="en">`.

---

## Sources

- Homepage — https://niccolomiranda.com/
- About — https://niccolomiranda.com/about
- Work — https://niccolomiranda.com/work
- Case: The Books of Ye — https://niccolomiranda.com/work/the-books-of-ye
- Case: Om Swami — https://niccolomiranda.com/work/om-swami
- Case: AvroKO — https://niccolomiranda.com/work/avroko
- Case: Prada — https://niccolomiranda.com/work/prada
- Case: The Roger Hub — https://niccolomiranda.com/work/the-roger-hub
- Case: WOW Concept — https://niccolomiranda.com/work/wow-concept
- Case: Unexpected Time — https://niccolomiranda.com/work/unexpected-time
- Legal — https://niccolomiranda.com/legal
- Awwwards profile — https://www.awwwards.com/niccolo.miranda
- GSAP 3.7.1 — https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js
- Locomotive Scroll 4.1.3 CSS — https://cdn.jsdelivr.net/gh/locomotivemtl/locomotive-scroll/dist/locomotive-scroll.min.css
- Locomotive Scroll 4.1.3 JS — https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.3/dist/locomotive-scroll.min.js
- Paper-curtain module — https://cdn.jsdelivr.net/gh/niccolomiranda/portfolio@fa29f26/paper-curtain.mjs
- butter-slider — https://unpkg.com/butter-slider
- OGL 0.0.74 — https://unpkg.com/ogl@0.0.74/src/core/

---

## Changelog

- 2026-06-20 — Initial draft by opencode (built from
  `tools/tmp/niccolomiranda/playwright/` rendered DOM and
  `playwright/css/miranda-paper-portfolio.webflow.1c78bb630.min.css`).
