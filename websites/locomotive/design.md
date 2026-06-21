# Locomotive — design.md

> A structured design specification of **https://locomotive.ca/en**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** design.md-gen
> **Source dump:** `tools/tmp/locomotive/` (gitignored)

---

## Overview

Locomotive is a Montreal-based digital agency ("Locomotive®") whose own
marketing site is a high-craft, animation-heavy, single-page experience that
showcases their work and a small set of merchandise. The aesthetic is
editorial-minimal: massive display type set in a custom serif, a single
self-hosted body sans, generous whitespace, hard 1–2 px borders, and a
fully-photographic / video hero. Every interactive surface is wired to GSAP
timelines driven by Locomotive Scroll (Lenis) and a custom scroll-progress
engine — the page is essentially a long, choreographed sequence of letterforms
that shuffle, fade, and parallax on cue. A 3D team canvas built on Three.js +
GLTF loads 28 rigged character models on demand.

**Category:** Marketing (agency portfolio)
**Primary surface observed:** Homepage (`/en`)
**Tone:** Confident, technical, editorial, occasionally playful (emoji accents
in copy, "Shuffle" hover animation on link text)
**Framework detected (if any):** None (server-rendered Twig templates with
ad-hoc vanilla JS modules; no React/Vue/Next.js/Svelte). The page carries
`data-template="home"` and `data-theme="default"` on `<html>` — signals of a
Twig-rendered Craft CMS (or similar) backend. Page transitions would be
handled by Barba.js (the bundle is loaded; the homepage-only dump does not
exercise transitions).

---

## Visual Language

### Color

The site uses CSS custom properties on `:root` and swaps them per
`html[data-theme="…"]` block. The default homepage theme is `default` (light).
Other themes (`dark`, `primary`, `secondary`, `lisa`) exist for other pages
(Work, Agency, Lisa case study, etc.) and are wired via the data-theme
attribute.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Text (primary) | `--color` | `#000000` | True black. Also `crimson` for invalid form state. |
| Background (base) | `--color-bg` | `#FFFFFF` | Pure white. |
| Accent — electric blue | `--menu-color-bg` (default) | `#312DFB` | Royal/electric blue, used as overlay menu bg and `secondary` theme accent. |
| Accent — brand red | `--menu-color-bg` (dark) | `#DA382E` | Vermilion red. Also the `primary` theme bg. |
| Text on accent | `--menu-color` | `#FFFFFF` or `#000000` | Inverts depending on bg. |
| Selection (default) | `::selection` | `var(--color)` on `var(--color-bg)` | i.e. black text-fill / white background swap. |
| Black overlay | `.c-preloader` bg | `#000000` | Full-screen preloader. |
| Black overlay | `data-theme=dark .c-newsletter-modal_background` | `linear-gradient(0deg, rgba(0,0,0,0) 0%, #000000 50%)` | Black-to-transparent for dark theme. |
| Red gradient | `data-theme=primary .c-newsletter-modal_background` | `linear-gradient(0deg, rgba(218,56,46,0) 0%, #da382e 50%)` | Red-to-transparent for primary theme. |
| White gradient | `.c-newsletter-modal_background` (default) | `linear-gradient(0deg, rgba(255,255,255,0) 0%, #ffffff 50%)` | White-to-transparent. |
| Black overlay | `.c-newsletter-modal_form` border | `solid var(--border-size) #000` (default) / `#fff` (dark) | Underline-style form. |
| Subtle black | `rgba(0, 0, 0, 0.5)` | n/a | Used for `.c-scrollbar_thumb`, `c-button[disabled]`, ring canvas overlays. |
| Focus ring | `html .focus-visible` outline | `auto` color `var(--color)`, width `10px`, offset `5px` | Default focus treatment. |
| Video modal scrim | `.c-video-modal::before` | `linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 100%)` | Used in case-study video modals. |
| Invalid input | `.-invalid` border | `crimson` (CSS named color) | Form validation only. |

### Typography

Two self-hosted families, both Latin-only:

1. **PPLocomotiveNew Light** (locomotive's own custom serif/display) —
   `font-family: "LocomotiveNew"` — used for all display headings, the logo
   wordmark, the featured-projects list, the "Extras (13)" heading, the
   about-section statement, and the `c-menu_nav` mobile-overlay menu.
2. **HelveticaNowDisplay Regular** — `font-family: "HelveticaNowDisplay"` —
   used for everything else (body, UI labels, buttons, nav, footer, list
   rows, captions, form fields).

Both are loaded as woff2+woff from `/assets/fonts/` and exposed via
`@font-face` in the main stylesheet. The CSS stack falls back to a
comprehensive system font chain ending in `sans-serif`. There is no
`@font-face` for a monospace family — no monospace is used in the design.

| Role | Family | Weight | Size (desktop) | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display H1 (`.c-heading.-h1`) | `LocomotiveNew` | 400 (only) | `4.6666666667rem` (≈ 70px at 15px root) | `1.1` | `0` (`normal`) |
| Display Huge (`.c-heading.-huge`) | `LocomotiveNew` | 400 | `7.6388888889vw` (fluid) | `1.1` | `0` |
| H1 mobile | `LocomotiveNew` | 400 | `2.4rem` (≤ 699px) | `1.1` | `0` |
| H1 tablet | `LocomotiveNew` | 400 | `3.3333333333rem` (≤ 1024px) | `1.1` | `0` |
| H2 | `LocomotiveNew` | 400 | `1.7333333333rem` (≈ 26px) | `1.1` | `0` |
| H3 | `LocomotiveNew` | 400 | `1.4666666667rem` (≈ 22px) | `1.1` | `0` |
| H4 | `LocomotiveNew` | 400 | `1.3333333333rem` (≈ 20px) | `1.1` | `0` |
| H5 | `LocomotiveNew` | 400 | `1.2rem` (≈ 18px) | `1.1` | `0` |
| H6 | `LocomotiveNew` | 400 | `1.0666666667rem` (≈ 16px) | `1.1` | `0` |
| Body / UI default | `HelveticaNowDisplay` | 400 | `15px` (root, scales to 17/19/21px on wide viewports) | `1.3` | `0` |
| Body medium (`.o-text.-medium`, buttons, list rows, shop tile info, summary, footer) | `HelveticaNowDisplay` | 400 | `1.7333333333rem` (≈ 26px); `1.6rem` tablet; `18px` mobile | `1.2` | `0` |
| Featured-link title | `LocomotiveNew` | 400 | `7.6388888889vw` (fluid, 110px computed) | `1` | `0` |
| Mobile-overlay menu nav | `LocomotiveNew` | 400 | `min(12vw, 4.6666666667rem)` (≈ 70px cap) | `1.4` | `0` |
| Mobile-overlay location line | `LocomotiveNew` | 400 | `8vw` (≈ 115px at 1440px) | `1` | `0` |
| Newsletter input | `LocomotiveNew` | 400 | `var(--font-size-h1)` (≈ 70px) | `1.3` | `0` |

The site is set entirely in **regular 400** — there is no bold, italic, or
medium weight used. Display type is large (70–115 px), body is small (15–26 px).
Tracking is `normal` everywhere. Underlines are hand-styled:
`text-decoration-thickness: var(--border-size)` (1 px tablet, 2 px desktop) with
`text-underline-offset: .1em`. On hover, the underline switches from solid to
dashed (e.g. `.c-heading.-huge a:hover { text-decoration-style: dashed }`).

Both families have `font-display: swap` so text renders immediately in the
fallback chain.

### Spacing & radius

Spacing is fluid and custom-property driven. The CSS ships a pair of mobile /
desktop scale tokens that the utility classes clamp between using
`clamp(calc(0.0666666667rem * var(--spacing-X-mobile)), var(--spacing-X) / 14.4 * 1vw, calc(0.0666666667rem * var(--spacing-X)))`.

| Token | Mobile value | Desktop value | Maps to (at 15px root, 1440px) |
| --- | --- | --- | --- |
| `--spacing-micro` | 8 | 14 | ~9–14px |
| `--spacing-tiny` | 20 | 20 | ~20px |
| `--spacing-small` | 30 | 30 | ~30px |
| `--spacing-medium` | 40 | 40 | ~40px |
| `--spacing-large` | 52 | 80 | ~52–80px |
| `--spacing-big` | 80 | 150 | ~80–150px |
| `--spacing-huge` | 100 | 200 | ~100–200px |
| `--spacing-enormous` | 140 | 250 | ~140–250px |

The Home Summary block (`u-padding -big-top -big-bottom`) reads as
`150px 0`. The Home About block has `30px` top margin. The Home Extras block
has `150px` top + bottom margin. The Footer has `160px 0 0 0` top margin and
`160px 0` bottom margin on the menu list.

**Radii:** essentially none. The site uses `border-radius: 0` everywhere on
its own components (preloader, header, menu, button, footer, newsletter
modal, video modal). The few rounded elements in the bundle come from
third-party libraries (FilePond `4px`, the optional Lisa sound widget
`2.6666666667rem`, swiper scrollbar `10px`, cc-main cookies banner
`0`). The `c-scrollbar_thumb` is `10px`; the cookie-banner SVG check icon is
`100%` (circle).

**Borders:** 1 px on tablet/mobile (`--border-size: 1px`), 2 px on desktop
(`@media (min-width: 1025px) { :root { --border-size: 2px } }`). Used as
`border-top`, `border-bottom`, or full `border` for the c-button, section
overlines, list rows, and feature-link dividers.

**Shadows:** none observed. The site has no `box-shadow` declarations of its
own (FilePond's library CSS ships a few, but they are not rendered on the
homepage).

### Iconography

**Style:** inline unicode glyphs and text-only. No icon font, no SVG sprite,
no Lucide/Phosphor/Heroicons. The only dedicated SVG asset is the Locomotive
logo (in the preloader and as `c-preloader_logo`), a small safari-pinned-tab
icon, and the standard favicon set. UI icons are unicode characters used as
text:

- `→` (right arrow) on `.c-button[data-icon="→"]` after the label.
- `↗` (north-east arrow) on `data-icon="↗"` external links and on the
  featured-link list items (`c-list_link`).
- `&nbsp;&nbsp;↗` on the medium-text list links.
- `×` (multiplication sign) before the close text of the newsletter modal
  (`.c-newsletter-modal_close:before`).
- `↓` after "Newsletter" in the footer CTA (`<span aria-hidden="true"> ↓</span>`).
- `🕳` (hole) for `.c-featured-links_item.-cta .c-featured-links_title:before/after`
  with a `featuredProjectsAllFlash` animation that swaps the `content` between
  `""`, `"🔺"`, and `"🕳"` on a 2 s linear infinite loop.
- Emoji embedded directly in body copy: `🔶` before "Locomotive®",
  `🍺🔞` after, `🔰` before the about-statement, `🔛🔜` after, `🛑🚹🚺`
  for the location glyph, `🟤` and `🔠` etc. sprinkled throughout the
  footer address and menu. These are real emoji glyphs, not iconography,
  used as playful typographic punctuation.
- The preloader logo is a hand-crafted inline `<svg viewBox="0 0 246.5033 33.28001">`
  that draws the wordmark "Locomotive" (with a registered `®` mark) using
  `<path>` and `<polygon>` elements. Stroke width is implicit at `fill="none"`
  / no stroke; only the path data is rendered. The logo is also reused as
  the `c-preloader_logo` element and animates in with `preloaderAppear`
  (`scale 0.9→1`, `opacity 0→1`, `0.9s`).

**Library (if observable):** None. Custom only.

**Default size:** N/A — there are no icon components with a default size. The
inline emoji inherit the surrounding text size; the SVG logo is sized via
`width: min(250px, 70vw); height: 10vh` in `.c-preloader svg`.

---

## Layout & Grid

**Max content width:** No explicit max-width. The grid is fluid, anchored to
`100vw` and divided by the column count.

**Page gutter:** `padding-right: var(--grid-margin); padding-left:
var(--grid-margin);` on `.o-container`, `.c-home-hero_content`,
`.c-footer`, and several other top-level containers. `--grid-margin` is
`2.6666666667rem` (≈ 40px) on desktop, `1.3333333333rem` (≈ 20px) on tablet,
and not redefined on mobile (so it stays 20px below 1024px).

**Grid:** 12-column CSS grid at desktop, 8-column at tablet, 4-column at
mobile. Implemented as a set of utility classes (`.o-grid`, `.o-grid.-col-N`,
`.o-grid.-gutters`) plus per-item column-span utilities
(`.u-gc-3/5@from-medium` etc.):

- `.o-grid { display: grid; width: 100%; }`
- `.o-grid.-col-12 { grid-template-columns: repeat(12, 1fr); }`
- `.o-grid.-col-4 { grid-template-columns: repeat(4, 1fr); }`
- `.o-grid.-col-2 { grid-template-columns: repeat(2, 1fr); }`
- `.o-grid.-gutters { gap: 20px; column-gap: var(--grid-gutter); }`
  (default gutter is 20 px, halved to 10 px on mobile via
  `--grid-gutter: calc(20px/2)`).
- `.o-grid.-center-items`, `.o-grid.-top-items`, `.o-grid.-bottom-items`,
  `.o-grid.-right-items`, `.o-grid.-left-items`, `.o-grid.-center-cells`
  etc. for alignment. The grid is exhaustive — there are 30+ modifier
  combinations.

Items are placed with `.u-gc-X/Y` utilities (e.g. `.u-gc-1/4` →
`grid-column-start: 1; grid-column-end: 4;`) and responsive variants
`.u-gc-X/Y@from-small`, `.u-gc-X/Y@from-medium`, `.u-gc-X/Y@to-small`. There
are at least 28 column-span rules shipped in the bundle.

**Breakpoints (from the CSS):**

| Name | Range | Token override |
| --- | --- | --- |
| Mobile | `max-width: 699px` | `--grid-columns: 4`, `--grid-gutter: 10px`, `--font-size-h1: 2.4rem`, `--font-size-medium: 18px`, `--font-size-huge: 40px`, `--about-head-content-offset-vh: .20` |
| Tablet | `700px`–`1024px` | `--grid-columns: 8`, `--grid-margin: 1.3333333333rem`, `--font-size-medium: 1.6rem`, `--font-size-h1: 3.3333333333rem`, `--border-size: 1px` |
| Desktop (small) | `1025px`–`1199px` | `--border-size: 2px` |
| Desktop (medium) | `1200px`–`1599px` | `--font-size: 15px` |
| Desktop (large) | `1600px`–`1999px` | `--font-size: 17px` |
| Desktop (X-large) | `2000px`–`2399px` | `--font-size: 19px` |
| Desktop (XX-large) | `≥ 2400px` | `--font-size: 21px` |

Note: there is no "above 1024" breakpoint that increases the grid beyond 12
columns — the 12-column grid is just used at finer granularity on big
screens.

**Vertical rhythm:** fluid via the spacing tokens. The home hero is
`min(var(--vh, 1vh) * 100, 80vw)` tall (a viewport-relative cap of `80vw` so
it never goes 16:9-stretched on ultra-wide displays). `--vh` is set by JS
as the actual 1 vh in CSS pixels (to dodge mobile URL-bar resize jank):
`document.documentElement.style.setProperty('--vh', window.innerHeight / 100 + 'px')`
trick, and the rendered DOM shows `--vh: 9px;` (a `window.innerHeight` of
`900 px`).

**Homepage layout (top to bottom):**

1. **Preloader overlay (`.c-preloader`)** — `position: fixed; inset: 0`,
   `z-index: 9999`, black background, holds the SVG wordmark centered
   (`display: flex; align-items: center; justify-content: center`).
2. **Header (`.c-header`)** — `position: fixed; top: 0; height:
   var(--header-height)` (4 rem ≈ 64 px on desktop). z-index 800. Uses CSS
   grid: logo occupies `grid-column: 1/3`, nav `7/11`, CTA `11/13`. A
   mix-blend-mode of `difference` is applied while the hero is in view
   (`html.is-over-home-hero:not(.has-menu-opened) .c-header`), which
   inverts the header text color against any background. A white-on-white
   fallback bar (`.c-header_bg`) sits at `z-index: 740`.
3. **Home hero (`.c-home-hero`)** — `width: 100%; height: var(--home-hero-height);
   display: flex; flex-direction: column; justify-content: flex-end;` —
   text bottom-aligned, full-bleed background. The headline
   "Locomotive® / Digital-first Design Agency" is an `<h1 class="c-heading -h1">`
   (70 px LocomotiveNew). Below it, a `<video>` element with
   `object-fit: cover`, muted, loop, playsinline — the actual content is a
   Vimeo-hosted 1080p MP4 (`https://player.vimeo.com/progressive_redirect/playback/792718372/rendition/1080p/file.mp4?…`)
   with a 1920×1080 poster (`uploads/home/poster_desktop.png`).
4. **Home summary (`.c-home-summary`)** — `display: flex; justify-content: center;
   padding: 150px 0;` — holds a 4-column grid: "Seven Years / Running /
   2018-2024" text on the left (3/4 of the 12-col grid), a `.c-ring` 3D
   diamond ring on the right (4/4 of the grid, `aspect-ratio: 5/7`), and a
   `.c-button.-full` "The dynasty →" link as a footer.
5. **"Featured work" heading + featured-links list** — 5 rows, each a
   `<li class="c-featured-links_item">`. Rows are `display: flex;
   padding: 1.3333333333rem 0;` (≈ 20 px), with a 1–2 px top border. The
   `.c-featured-links_title` is `font-size: var(--font-size-huge)` ≈ 7.6 vw
   (≈ 110 px) LocomotiveNew, fluid. Each row contains a hover-shown
   `.c-image.-cover` thumbnail of the project. The fifth row (`.c-featured-links_item.-cta`)
   says "All Work" with `🕳 / 🕳` animated pseudo-elements.
6. **Home about (`.c-home-about`)** — `margin-top: 30px;` (the
   `.c-home-about_title` is a 70 px LocomotiveNew H1 that paraphrases the
   agency statement) followed by a 12-column grid: left half is a 3D team
   canvas (`<canvas data-module-team-canvas>`) with a 4:3 aspect ratio
   (padding-bottom: 133.333% hack), right half is a 26 px HelveticaNowDisplay
   paragraph plus two `.c-button.-full` "Agency →" / "Careers →" links.
7. **Home extras (`.c-home-extras`)** — `margin: 150px 0;`. H1 "Extras
   (13)" with a flex `justify-content: space-between` between the word and
   the count. Three `c-section-overline` blocks (Articles, Culture, Store),
   each with an H2 title and a `c-list` of links (`.c-list_row` rows
   separated by 1–2 px borders, "Buy now→" with 8% opacity on hover for
   the icon). Then a 12-col grid of two `.c-shop-tile` items
   (the white T-shirt and the sand hat) with product images, titles,
   prices, and a "Buy now →" CTA.
8. **Footer (`.c-footer`)** — `margin-top: 160px; padding: 0 40px 20px;
   display: grid;` with a 12-column menu-list grid. Three menus
   (`-main`, `-social`, `-external`), each a `c-footer_menu` block with an
   underlined H2 title. The main menu is 6 columns wide, social 3, external
   3. A "Cookie preferences" and "Newsletter ↓" CTA sit at the bottom of
   the main menu column. Below the menu grid: a `c-footer_coords` address
   block (70 px LocomotiveNew, mapping link to "1211 Jean-Talon Est,
   Montréal (QC), Canada H2R 1W1") and a `c-footer_copyright` "©2026".

---

## Components

### Preloader (`.c-preloader`)

- **Position:** fixed, full-viewport, `z-index: 9999`.
- **Color:** solid black background, white SVG logo.
- **Logo:** inline `<svg viewBox="0 0 246.5033 33.28001">` of the wordmark
  "Locomotive" — see `tools/tmp/locomotive/playwright/homepage.html:139-162`.
  The mark is sized at `width: min(250px, 70vw); height: 10vh`.
- **Enter animation:** `animation: preloaderAppear .9s cubic-bezier(0.215, 0.61, 0.355, 1) .3s; animation-fill-mode: backwards;` on
  `.c-preloader_logo` — the mark scales from `0.9` to `1` and fades from 0
  to 1 over 0.9 s with a 0.3 s delay. The `cubic-bezier(0.215, 0.61, 0.355, 1)`
  is a CSS-port of GSAP's "power2.out" curve.
- **Pre-content (`.c-preloader_content`):** A two-row grid (`grid-template-rows:
  repeat(2, 1fr)`) that on desktop splits the 12-col grid into two column
  groups: row 1 occupies `grid-column: 5/13; grid-row: 1/2; align-self: end;`
  and row 2 `grid-column: 6/13; grid-row: 2/3; align-self: start; display: flex;
  flex-direction: column-reverse;`. The text content (visible only in the
  non-homepage case) is a kerning-disabled word-stagger of "Digital / Digital-First
  / Digital-First Design / Digital-First Agency" and "Based / Based in /
  Based in Montreal / Based in Montreal, Canada". The home version has
  `display: none` on this block.
- **Exit:** `html:not(.is-first-loading) .c-preloader { opacity: 0; pointer-events: none; }`
  with `transition: opacity .9s cubic-bezier(0.215, 0.61, 0.355, 1);`.
  The preloader is held for at least 1.2 s after load via the inline
  `preloaderEnterPromise` (`setTimeout(resolve, 1200)`) defined in
  `homepage.html:98-100`.
- **Anchor:** Two JS promises — `preloaderEnterPromise` (1.2 s timeout) and
  `preloaderPromise` (resolved by external code) — gate further animation.

### Header (`.c-header`)

- **Position:** `position: fixed; top: 0; width: 100%; height:
  var(--header-height);` (4 rem ≈ 64 px). `z-index: 800`.
- **Layout:** CSS grid, `grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: 1.3333333333rem; padding: 0px var(--grid-margin);` — 12 columns at
  desktop, 8 at tablet, 4 at mobile. The grid columns are assigned to
  children via `grid-column: start/end` declarations.
- **Logo (`.c-header_logo`):** `grid-column: 1/3; grid-row: 1/2;` — the
  agency wordmark, an `<a>` that wraps `<span class="c-header_logo_inner">Locomotive</span>®`.
  The inner span is `display: inline-block; width: 8.8666666667rem;` (≈ 133 px)
  to reserve a fixed hit-target.
- **Spacer (`.c-header_icon`):** A pseudo-element dot in the middle
  (`.c-header_icon:before { content: "🔝"; font-family: LocomotiveNew; font-size: 150%; }`).
- **Nav (`.c-header_menu`):** `grid-column: 7/11;` — `<ul class="c-header-menu_list">`
  of `<li class="c-header-menu_item"><a class="c-header-menu_link" data-hover-shuffle="">Work / Agency / Careers</a></li>` plus an external link to
  `https://store.locomotive.ca` with `rel="noopener noreferrer" target="_blank"`.
  On tablet/mobile the inline nav `display: none`s and the menu-toggler
  appears.
- **CTA (`.c-header_cta`):** `grid-column: 11/13; text-align: right; justify-self: end;`
  — `<a class="c-header_cta" data-hover-shuffle="" href="en/contact">Let's talk</a>`.
  Hidden on mobile.
- **Menu-toggler (`.c-header_menu-toggler`):** `display: none` on desktop,
  appears on tablet/mobile at `grid-column: 3/5; justify-self: end;`. A
  `<button>` whose label is "Menu" and changes to "Close" when the
  mobile menu is open. It carries `aria-expanded="false"` and
  `aria-controls="mobile-menu"`.
- **Color/blend:** `html.is-over-home-hero:not(.has-menu-opened) .c-header {
  mix-blend-mode: difference; color: var(--color-bg); }` — over the hero,
  the header text inverts against the video.
- **Hide-on-scroll:** `html.is-scrolling-down .c-header { transform: translate3d(0, calc(var(--header-height) * -1), 0px); }` /
  `html.is-scrolling-up .c-header { transform: translate3d(0px, 0px, 0px); }`,
  transition `transform .2s cubic-bezier(0.215, 0.61, 0.355, 1);`. Toggled
  by the Scroll module (`data-module-scroll="main"`) reading Lenis's
  `direction` event.
- **Hover:** Non-logo `<a>` underlines on hover and focus
  (`.c-header a:not(.c-header_logo):hover, .c-header a:not(.c-header_logo).-current
  { text-decoration: underline; text-decoration-thickness: var(--border-size);
  text-underline-offset: .1em; }`).
- **Focus:** Non-logo, non-`:focus-visible` links explicitly get
  `outline: none` to suppress the default browser focus ring.
- **Header background bar:** A separate `.c-header_bg` element
  (`position: fixed; top: 0; width: 100%; height: var(--header-height);
  background-color: var(--color-bg); z-index: 740; opacity: 1;`) that
  fades in as the user scrolls past the hero. Transition:
  `background-color .3s cubic-bezier(0.215, 0.61, 0.355, 1)`.

### Mobile-menu (`.c-menu` / `#mobile-menu`)

- **Position:** `position: fixed; inset: 0; z-index: 750;` — full-viewport.
  Background `var(--color-bg)`; text `var(--color)`. Both are swapped from
  the `--menu-color` / `--menu-color-bg` custom properties.
- **Show/hide:** `html.has-menu-opened .c-menu` becomes visible (default
  `display: none`). The `Header` JS module wires the toggler
  (`data-header="menu-toggler"`) to toggle the `has-menu-opened` class on
  `<html>`. `Esc` closes the menu (key listener in the `Header` module).
- **Anatomy:**
  - `.c-menu_inner` — `display: flex; flex-direction: column; justify-content: flex-end; padding: var(--grid-margin); padding-top: var(--header-height); padding-bottom: 2.6666666667rem; min-height: calc(var(--vh) * 100);`.
  - `.c-menu_nav` — `<ul>` of `c-menu_nav_item > c-menu_nav_link` items
    (Work, Agency, Careers, Let's talk, Store). The `nav` font is
    `LocomotiveNew` at `min(12vw, 4.6666666667rem)` ≈ 70 px max,
    `line-height: 1.4`.
  - `.c-menu_footer` — bottom row, `display: flex; justify-content: space-between; margin-top: 5.3333333333rem;` containing a language switcher link
    ("Français") and a `.c-menu_location` showing the city emoji glyph at
    `8vw` (≈ 115 px) LocomotiveNew.
- **Focus trap:** The `Header` module installs a `focus-trap` library
  (vendored in the bundle) over `[this.$header, this.$menu]` while the
  menu is open. Tab cycles inside the menu, Shift+Tab cycles back, Esc
  closes and returns focus to the toggler.
- **Active link:** `.c-menu_nav_link.-current` underlines at
  `text-decoration-thickness: var(--border-size); text-underline-offset: .1em;`.

### Button (`.c-button`)

- **Anatomy:** `position: relative; display: inline-flex; justify-content: space-between; align-items: center; vertical-align: baseline; white-space: nowrap; text-align: left; font-size: var(--font-size-medium); line-height: 1.2; min-width: 200px; border-top: var(--border); padding: 10px 0;` — a single
  top border (1 px or 2 px depending on breakpoint), no other border, no
  background, no radius.
- **Content:** A `<span class="c-button_label">` text, plus an optional
  `.c-button[data-icon]:after { content: attr(data-icon); margin-left: .5em; font-size: 75%; }` for the trailing arrow (e.g. `→`, `↗`).
- **Full variant:** `.c-button.-full { width: 100%; }` — used for the
  "The dynasty", "Agency", "Careers" links.
- **Hover/focus:** `.c-button.focus-visible .c-button_label, .u-button-hover:hover .c-button_label { text-decoration: underline; text-decoration-thickness: var(--border-size); }`. The underline is added only to
  the inner label, not the entire button.
- **No shadow, no radius, no fill change.** It is a typographic link
  styled as a button.
- **Used in:** Home Summary footer ("The dynasty →"), Home About (Agency
  →, Careers →), and in the mobile menu footer as a `.c-button.-full`
  alternative CTA.

### Featured link (`.c-featured-links_item`)

- **Anatomy:** A `<li>` with `position: relative; border-top: var(--border);
  display: flex; padding: 1.3333333333rem 0;` (≈ 20 px vertical). The
  text title is `display: flex; justify-content: center; line-height: 1;
  text-align: center; flex-grow: 1;` and the two word halves sit at
  `transform: translateY(0.1em);` (a baseline micro-shift to keep the
  hover-shuffle visually stable). On tablet, padding drops to
  `0.6666666667rem 0`.
- **Title font:** `var(--font-size-huge)` ≈ 7.6388888889 vw (fluid;
  ~110 px at 1440 px) LocomotiveNew, `line-height: 1`.
- **Each item is "X / Y" or "X / Y / Z":** the wordmark is split across
  two `<span data-hover-shuffle-child>` elements, with a hover-revealed
  image (`.c-image.-cover .c-featured-links_visual`) sandwiched between
  them. The image element is `position: absolute; inset: 0; object-fit: cover; object-position: center 15%;` with `transform: translateY(-50%); transform-origin: top left; outline: 4px solid var(--color-bg);`.
- **Hover animation:** `.c-featured-links_item:hover .c-featured-links_title span, .c-featured-links_item:focus-within .c-featured-links_title span { transition-duration: var(--transition-speed-enter); }` where
  `--transition-speed-enter: 0.45s; --transition-speed-leave: 0.2s; --transition-easing: cubic-bezier(0.23, 1, 0.32, 1);` on `.c-featured-links_title`.
  The image hover-reveal is driven by the JS `FeaturedLinks` module — its
  mouseenter/mouseleave coordinates the image position over the title text.
- **CTA variant:** `.c-featured-links_item.-cta .c-featured-links_title:before, .c-featured-links_item.-cta .c-featured-links_title:after { content: "🕳"; font-size: 50%; animation: featuredProjectsAllFlash 2s linear infinite; }`. The `featuredProjectsAllFlash` keyframe swaps the
  content between `""` (0–25%), `"🔺"` (26–50%), `""` (51–75%), and
  `"🕳"` (76–100%) on a 2 s infinite loop. The flanking glyphs also
  collapse to `"(+)"` when the row is `:focus-within` and the animation
  halts.
- **Link:** A 0-px-text invisible `<a class="c-featured-links_link">` spans
  the entire row (`position: absolute; inset: 0;`).
- **External arrow:** `.c-featured-links_item.-external:after { content: "↗"; position: absolute; top: 7px; right: 0; pointer-events: none; opacity: 0; }`. On hover/focus it fades to `opacity: 1`.

### Home hero (`.c-home-hero`)

- **Anatomy:** A full-bleed section with `position: relative; width: 100%;
  height: var(--home-hero-height); display: flex; flex-direction: column;
  justify-content: flex-end; color: var(--color-bg); clip-path: polygon(0 0, 100% 0%, 100% 100%, 0% 100%);`. On wide screens the height is
  `min(var(--vh) * 100, 80vw)` (a soft cap to prevent extreme aspect
  ratios on ultrawide displays).
- **Content (`.c-home-hero_content`):** `position: relative; width: 100%;
  mix-blend-mode: difference; z-index: 10;` — holds the H1. The blend mode
  inverts the headline against the video (white text becomes whatever the
  inverse of the underlying pixel is, so the H1 reads on top of any frame).
- **Background (`.c-home-hero_background`):** `position: fixed; inset: 0;
  z-index: -1; transform: translate3d(0, calc(-25vh * var(--mapped-progress)),
  0);` — the background sits behind everything and parallaxes upward as
  the user scrolls past the hero (`--mapped-progress: calc((var(--progress) - 0.5) / 0.5);`).
  A `::before` overlay adds `background-color: var(--color); opacity: calc(var(--mapped-progress) * .75);` — a darkening veil that closes over
  the video as the hero scrolls out.
- **Video (`.c-home-hero_video`):** `position: absolute; inset: 0;` — a
  16:9-ratio (`<div class="o-ratio u-16:9">`) wrapping a `<video class="c-video_media is-inview" playsinline muted loop poster="uploads/home/poster_desktop.png">` with two `<source>` tags (mobile and desktop, both pointing at
  the same Vimeo URL). The video plays in a
  `data-module-video-inview` module that toggles play/pause as the hero
  enters/leaves the viewport (`data-scroll-call="toggle, VideoInview"`).
- **Headline (`.c-heading.-h1`):** 70 px LocomotiveNew, white, "Locomotine®"
  on one line, "Digital-first Design Agency" on the next. Emoji at the
  start (`🔶`) and end (`🍺🔞`) act as decorative chevrons.

### Home summary (`.c-home-summary`)

- **Layout:** `position: relative; font-size: var(--font-size-medium); line-height: 1.2; display: flex; justify-content: center;` and `padding: 150px 0;`
  (the `.u-padding -big-top -big-bottom` utilities).
- **Anatomy:**
  - `.c-home-summary_label` — `position: absolute; top: .5em; right: 0; width: calc((100vw - var(--grid-gutter) * (var(--grid-columns) - 1) - var(--grid-margin) * 2) * 2 / var(--grid-columns) + var(--grid-gutter) * (2 + -1));` — a "©2008-2026" tag pinned to the right.
  - `.c-home-summary_inner` — `width: calc((100vw - ...) * 4 / var(--grid-columns) + var(--grid-gutter) * (4 + -1)); display: grid; gap: var(--grid-gutter); grid-template-columns: repeat(4, 1fr); grid-template-areas: "text text visual visual" "footer footer visual visual";` — a 4-col grid where
    text occupies 2 cols, the ring 2 cols, and the footer spans both
    text cols.
  - `.c-home-summary_text` — `grid-area: text;` with three `<span>`s:
    "Seven Years" (default flow), "Running" (`position: absolute; top: 3.3333333333rem; right: calc(100% + 20px);`), and "2018-2024"
    (`position: absolute; top: 13.3333333333rem; left: calc(100% + 20px);`).
  - `.c-home-summary_visual` — `aspect-ratio: 5/7; grid-area: visual;` —
    a `<div data-module-ring="m7" data-scroll data-scroll-css-progress data-scroll-module-progress class="c-home-summary_visual || c-ring" style="--progress: 0;">`
    that hosts the 3D ring scene. `--progress: 0` is updated by the scroll
    observer; the `Ring` JS module reads it and animates the diamond's
    `autoRotate` speed from 2 to 20 as the user scrolls past.
  - `.c-home-summary_footer` — `position: absolute; bottom: 0; display: inline-block; width: calc(... * 3 / var(--grid-columns) + var(--grid-gutter) * (3 + -1)); left: calc(100% + 20px); grid-area: footer; align-self: end;` — a `.c-button.-full`
    "The dynasty →" link.

### Home about (`.c-home-about`)

- **Layout:** `margin-top: 30px;` (a `.u-margin -small-top`). 12-col grid
  (`o-grid -col-12@from-medium -col-8@from-small -col-4@to-small -gutters`).
- **Title (`.c-home-about_title`):** `<div class="c-heading -h1 || c-home-about_title">` —
  70 px LocomotiveNew statement copy "Design and code are only tools of
  expression. What sets us and our work apart is people. We're a small
  group of creative thinkers who craft bespoke digital-first brand
  identities and experiences, tailor-made for you and your audience."
  Decorative emoji `🔰` and `🔛🔜` flank the text.
- **Visual (`.c-home-about_visual`):** `position: relative; padding-bottom: 133.3333333333%;` (a 4:3 aspect-ratio hack) — a `<canvas data-module-team-canvas="m9" data-team-canvas-no-touch data-team-canvas-models="uploads/team/3d/cath-dorion_rigged.compressed.glb, uploads/team/3d/fred2024_2-rigged.compressed.glb, ...">`. The canvas is a 3D scene
  with up to 28 rigged GLB models, one of which is selected at random
  each time the canvas enters the viewport.
- **Caption (`.c-home-about_caption`):** "Always looking / for top shelf
  talent" — `font-size: var(--font-size-medium); line-height: 1.2;`
  shown on desktop; `display: none` on tablet/mobile.
- **Right column:** 12-col grid `o-grid -col-2 -gutters` of two
  `.c-button.-full` "Agency →" / "Careers →" links, stacked vertically with
  `clamp(...)` 14 px spacing between them.

### Home extras (`.c-home-extras`)

- **Layout:** `margin: 150px 0;` (`.u-margin -big-top -big-bottom`).
- **Title:** `<h2 class="c-home-extras_title || c-heading -h1">` with
  `display: flex; justify-content: space-between;` — "Extras" + "(13)".
  The "(13)" is the count of total extras items.
- **Section overlines (`.c-section-overline`):** Three blocks (Articles,
  Culture, Store), each with `<h2 class="c-section-overline_title">` and a
  `.c-list` of links. The overline has a `border-top: var(--border);`
  underline and `padding-top: 7px;`.
- **List (`.c-list`):** `margin-top: -7px;` with `.c-list_row` items
  `display: grid; grid-auto-columns: 1fr; grid-auto-flow: column; border-bottom: var(--border); padding: 7px 0;`. Items are right-padded
  (`padding-right: 3.3333333333rem;`) and end with a `::after` arrow
  (`content: attr(data-icon); opacity: 0;`) that fades to `opacity: 1` on
  hover.
- **Shop tiles (`.c-shop-tile`):** A 12-col grid of two products
  (white T-shirt at `1/4` and sand hat at `3/5` desktop columns). Each
  tile: image (`.c-image` with 1440×1640 aspect ratio), title, "Buy now →"
  CTA, price ("30 USD" / "25 USD"). The link is a 0 px invisible
  `<a class="c-shop-tile_link">` that covers the tile. Hover underlines
  the price and title.

### Footer (`.c-footer`)

- **Layout:** `margin-top: 160px; padding: 0 40px 20px; display: grid;` —
  a CSS grid container.
- **Nav (`.c-footer_nav`):** `grid-column: 1/-1;` with a 12-col menu list
  grid (`.c-footer_menu-list`).
- **Three menus (`.c-footer_menu`):**
  - `.c-footer_menu.-main` — `grid-column: 1/7; grid-template-columns: repeat(6, 1fr);` (6 col on desktop, 4 on tablet, 2 on mobile).
    Contains: title hidden (`-main .c-footer_menu_title { display: none; }`),
    a `<ul>` of `<li class="c-footer_menu_item || u-none@to-small">` items
    (Work, Agency, Careers, Let's talk, Privacy, Français), and a CTA
    block (`.c-footer_menu_cta`) with "Cookie preferences" and "Newsletter ↓"
    buttons.
  - `.c-footer_menu.-social` — `grid-column: 7/10; grid-template-columns: repeat(3, 1fr);` — Instagram, Twitter, LinkedIn, Behance, GitHub.
  - `.c-footer_menu.-external` — `grid-column: 10/13; grid-template-columns: repeat(3, 1fr);` — Store, Locomotive Scroll, Annual trips, Dynasty.
- **Title (`.c-footer_menu_title`):** `width: 100%; border-bottom: var(--border); grid-column: 1/-1; padding-bottom: .3em; margin-bottom: .15em;` — the
  underline separates "Menu", "Social", "External" from the link lists.
- **Hover:** `.c-footer_nav a:hover, .c-footer_nav a.focus-visible { text-decoration: underline; text-decoration-thickness: var(--border-size); }`.
- **Address (`.c-footer_coords`):** `font-weight: initial; line-height: 1.1; margin-bottom: 2rem;` — a 70 px LocomotiveNew H1 with embedded links:
  "1211 Jean-Talon Est, Montréal (QC), Canada H2R 1W1" (map link),
  "Telephone +1 514 524 5678" (`tel:` link), and "info@locomotive.ca" with
  a `data-module-copy-to-clipboard` that copies the email and shows a
  "Copied to clipboard!" confirmation.
- **Copyright (`.c-footer_copyright`):** "©2026" — small text.

### Newsletter modal (`.c-newsletter-modal`)

- **Anatomy:** `position: absolute; top: 0; left: 0; width: 100%; z-index: 1; padding-bottom: 16.6666666667rem;` — sits inside the footer column.
  `visibility: hidden` by default; toggled visible by the `NewsletterToggler`
  module via `aria-expanded` on the "Newsletter" button and the
  `.is-opened` class.
- **Background (`.c-newsletter-modal_background`):** A vertical gradient
  from transparent to the page bg color: `linear-gradient(0deg, rgba(255,255,255,0) 0%, #ffffff 50%);` (default), or red (`#da382e`) for the
  `primary` theme, or black for the `dark` theme.
- **Close (`.c-newsletter-modal_close`):** A button with a `::before`
  content of `"×"` and `transition: transform .15s cubic-bezier(0.215, 0.61, 0.355, 1);`.
- **Form (`.c-newsletter-modal_form`):** `display: flex; align-items: baseline; border-bottom: solid var(--border-size) #000; padding-top: 5.3333333333rem; transform: scale(0.9) translate3d(0, -10%, 0); opacity: 0; transition: opacity .15s cubic-bezier(0.23, 1, 0.32, 1), transform 0s cubic-bezier(0.23, 1, 0.32, 1) .15s;`. When `.is-opened`, transitions to `opacity: 1; transform: scale(1) translate3d(0, 0, 0);` with a `.3s cubic-bezier(0.23, 1, 0.32, 1)`.
- **Input (`.c-newsletter-modal_input`):** `width: 100%; font-size: var(--font-size-h1); font-family: LocomotiveNew;` — a giant 70 px input
  with no border (just the underline). Placeholder: "name@email.com".
- **Submit button (`.c-newsletter-modal_button`):** "Subscribe" label,
  native `<button type="submit">`.
- **Feedback (`.c-newsletter-modal_feedback`):** Empty by default; populated
  by the `NewsletterModal` module with "Check your email to confirm your
  subscription. Thanks" on success or "An error has occured." on failure.

### Video modal (`.c-video-modal`)

- **Position:** `position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; visibility: hidden;`. Toggled
  visible via the `.is-active` class.
- **Scrim:** A `::before` pseudo with `background: linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 100%); opacity: 0; transition: opacity .6s cubic-bezier(0.215, 0.61, 0.355, 1);`. Becomes `opacity: 1` on `.is-active`.
- **Content (`.c-video-modal_content`):** `width: 75%;` (desktop) / `90%` (mobile), holds the 16:9 inner block.
- **Inner (`.c-video-modal_inner`):** `position: relative; padding-bottom: 56%; background-color: #000; opacity: 0;` — the Vimeo iframe is
  injected here by the `VideoModal` module.
- **Close (`.c-video-modal_close`):** `position: absolute; transform: translateY(-2.6666666667rem) translateY(-100%); color: #fff; text-transform: capitalize;` — slides in from above the
  modal.

### Form input (`.c-form_input`)

- **Anatomy:** `padding: .3333333333rem 0; border-width: 1px; border-bottom: 1px solid var(--color);` — a single bottom border.
- **Focus:** `border-color: var(--color);` (no ring, no fill change).
- **Floating label:** `.c-form_floating .c-form_input:not(:placeholder-shown) ~ .c-form_label { transform: scale(0.75) translateY(-1.5em); }` — the label
  scales to 75% and shifts up when the user types.
- **Invalid:** `.-invalid { border-color: crimson; }` with a floating error
  message (`.c-form_input-errors`).

### Image (`.c-image`)

- **Variants:** `.-cover` (full bleed), `.-inline` (inline, height 0.9em
  with vertical-align top), `.-lazy-load` (with opacity-fade-in once
  `-loaded` is set).
- **Inner (`.c-image_inner`):** `display: block; position: relative; background-size: cover; background-position: center;`. The
  `.-cover` variant uses `position: absolute; inset: 0;`.
- **Cover image (`.c-image.-cover .c-image_img`):** `position: absolute; inset: 0; object-fit: cover; width: 100%; height: 100%;`. `.-fit-bottom` adds
  `object-position: center bottom`.
- **Pixelated:** `.-lazy-load:not(.-loaded) .c-image_inner, .c-image_inner.-pixelated { image-rendering: pixelated; }` — the
  LazyLoad module toggles `-pixelated` then `-loaded` to give a deliberate
  pixel-up effect on image load.
- **Data attribute:** `data-depixelate` on an `<img>` triggers
  the `depixelate` JS function (`ra()`) when the image scrolls into view.

### List (`.c-list`)

- **Anatomy:** A stacked-link pattern. `.c-list_row` items
  `display: grid; grid-auto-columns: 1fr; grid-auto-flow: column; border-bottom: var(--border); padding: 7px 0; counter-increment: list;`. The
  default variant uses `70% 30%` columns; alternative variant uses
  `1fr auto`. `.-no-border-last-child` removes the border from the last
  row.
- **Link (`.c-list_item a`):** `display: block; padding-right: 3.3333333333rem; position: relative;` with a `::after` arrow (`content: attr(data-icon); font-size: .8em; opacity: 0; margin-top: .2666666667rem; position: absolute; right: 0; top: .0666666667rem;`).
- **Hover:** The `::after` arrow fades to `opacity: 1` on hover.

### Section overline (`.c-section-overline`)

- **Anatomy:** `background-color: var(--color-bg); color: var(--color);` —
  the section adapts to the current theme. `.c-section-overline_inner`
  has `border-top: var(--border); padding-top: 7px; padding-bottom: 2.6666666667rem;`.
  The title is `position: absolute; top: 7px; left: 0;` — pinned to the
  left edge of the top border.

### Grid helper (`.o-grid_item` / `.o-grid`)

Not a UI component, but a layout primitive. The `GridHelper` JS module
(`data-module-grid-helper` on `<body>`) is a developer tool activated with
`Ctrl+G` that overlays a fixed column-grid on the viewport for layout
debugging (visible at 0.1 opacity, toggled to visible with a `Ctrl+G`
keystroke).

### Scrollbar (`.c-scrollbar`)

- **Position:** `position: absolute; right: 0; top: 0; width: 11px; height: 100vh; transform-origin: center right;` — a custom scrollbar
  indicator rendered outside the Lenis-managed scroll. The thumb
  (`.c-scrollbar_thumb`) is `width: 7px; border-radius: 10px; background-color: #000; opacity: .5;` and is `cursor: grab`. Hover scales the bar
  to `transform: scaleX(1.45)` and reveals it.

### Cookie banner (`#cc-main`)

- **Library:** CookieConsent v3 (vendored in the bundle, file
  `js/recaptcha__en__5b2eb921.js`-class). Configuration is JSON-encoded
  into a `data-cookie-consent-config` attribute on `<body>`.
- **Theme:** The cookie modal is themed to match the page
  (`--cc-primary-color: var(--color); --cc-bg: var(--color-bg);`). All
  CSS variables are remapped to the page tokens.
- **Category colors:** `essential`, `analytics` (gated behind Google
  Analytics `analytics_storage: denied` consent), and one more
  (functionality / targeting per category key in the config).
- **Layout:** `box` modal, centered, with a title, description with
  privacy-policy link, "Accept All" / "Accept Necessary" buttons, and
  a "Let me choose" link that opens the preferences modal.
- **Banner button:** "Newsletter" and "Cookie preferences" buttons in the
  footer are wired to `data-cookie-consent="show-preferences"`.

---

## JavaScript & Libraries

The bundle is one large minified `app__212dabc9.js` (≈ 2.55 MB) plus a tiny
`vendors__dd3d66e6.js` (5.5 KB). There is no framework runtime (no
React/Vue/Svelte). The architecture is a custom module system: a
`modularInstance` (the `x$ = eue` class) walks the DOM, finds every
`data-module-…` attribute, instantiates the matching module class, and
wires up its methods.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Lenis (Locomotive Scroll v5) | `1.1.9` (`window.lenisVersion="1.1.9"`) | `app__212dabc9.js` — `new mP(...)` constructor is the `Lenis` smooth-scroll class. | Custom-scoped as `lenis`; uses `lerp: 0.1, smoothWheel: true, touchMultiplier: 1, wheelMultiplier: 1, orientation: "vertical"`. |
| Locomotive Scroll | bundled as `class vP` inside `app__212dabc9.js` (the public Locomotive Scroll v5) | Same file; the `Scroll` module (`data-module-scroll="main"`) instantiates it as `new vP({ lenisOptions: {}, … })`. | The `Scroll` class (`yP`) is the homepage scroll bootstrap. |
| GSAP | bundled (no inline version literal) | `Nt = gsap` (minified alias) — `Nt.timeline`, `Nt.to`, `Nt.from`, `Nt.set`, `Nt.ticker.add`, `Nt.utils.mapRange`, `Nt.registerPlugin`. | Used by `Hovers`, `HomeHero` (via `Scroll`), `Barba` transition, `Ring`, `TeamCanvas`. |
| Three.js | bundled (`WebGLRenderer`, `GLTFLoader`, `OrbitControls`, `PMREMGenerator`) | `app__212dabc9.js` | Used by `Ring` (3D diamond ring), `TeamCanvas` (28 rigged GLB characters), `TeamModalCanvas` (individual character). |
| Barba.js | bundled (`@barba/core` namespace seen 7×) | `app__212dabc9.js` | Page-transition library. Default namespace `{ name: "default", leave, enter }` registered but not exercised on the homepage. |
| Swiper | bundled (large `Cy` class) | `app__212dabc9.js` — `new NT(this.$container, { modules: [kT, OT, LT], loop: true, … })` | Used for carousels/sliders on the homepage — only the carousel class is loaded, not the homepage carousel markup. |
| FilePond | `4.30.4` | `css/main__29fe7204.css:1-4` (license header), CSS rules in line 5 of the stylesheet. | File-upload widget; not used on the homepage. |
| `focus-trap` | bundled | `yl(...)` constructor in `Header` class | Traps focus inside `[header, menu]` while the mobile menu is open. |
| CookieConsent | bundled (large `eT` class) | `app__212dabc9.js` | Powers the cookie consent modal. |
| Matomo (analytics) | loaded via inline script | `homepage.html:80-90` (inline `var _paq = …`) | Self-hosted on `//matomo.locomotive.ca/`. |
| Google reCAPTCHA v3 | loaded via `gstatic.com` | `homepage.html:59` `<script src="https://www.gstatic.com/recaptcha/releases/…/recaptcha__en.js" …>` | Used for the contact form anti-abuse. |
| Google Analytics (gtag) | `G-WYYJ9ZP43V` | `homepage.html:62-76` | Consent-defaulted to `denied` for `analytics_storage`. |
| Cloudflare Beacon | `2024.11.0` | `homepage.html:845` `<script src="https://static.cloudflareinsights.com/beacon.min.js/…">` | RUM analytics. |
| DOM observer (Lenis IO) | bundled | `class gP` / `class BG` / `class VG` inside the Scroll class | The IntersectionObserver-based per-element progress tracker. |

### Module names (the in-page `data-module-…` controllers)

These are the in-house classes instantiated per `data-module-*` attribute:

| Attribute | Class | Purpose |
| --- | --- | --- |
| `data-module-load="container"` | `Load` | SPA-style page-load orchestrator (waits for `preloaderPromise` to resolve before revealing). |
| `data-module-cookie-consent="m3"` | `CookieConsent` | Boots the cookie consent modal with the inline JSON config. |
| `data-module-hovers="m2"` | `Hovers` | Letter-shuffle hover animation (see Animations). |
| `data-module-header="m4"` | `Header` | Mobile-menu toggler + focus trap + esc-to-close. |
| `data-module-home-hero="m5"` | `HomeHero` | Toggles `is-over-home-hero` class on `<html>` based on scroll. |
| `data-module-video-inview="m6"` | `VideoInview` | Play/pause the hero video as it enters/leaves the viewport. |
| `data-module-ring="m7"` | `Ring` | 3D diamond ring on the home summary, Three.js + GLB. |
| `data-module-featured-links="m8"` | `FeaturedLinks` | Hover image-reveal over the "Featured work" rows. |
| `data-module-team-canvas="m9"` | `TeamCanvas` | 3D team grid canvas, Three.js + 28 GLB character models. |
| `data-module-newsletter-toggler="m10"` | `NewsletterToggler` | Footer "Newsletter ↓" button. |
| `data-module-newsletter-modal="m12"` | `NewsletterModal` | Form submission + feedback messages. |
| `data-module-copy-to-clipboard="m11"` | `CopyToClipboard` | `info@locomotive.ca` → copies to clipboard. |
| `data-module-video-modal="m13"` | `VideoModal` | Vimeo iframe injector. |

---

## Animations (Catalog)

The site is animation-dense. Most effects are driven by a custom
`@keyframes`-less but GSAP-rich engine; there is one custom
`preloaderAppear` keyframe and one CSS `featuredProjectsAllFlash`
keyframe. Everything else is GSAP timelines bound to scroll / hover
events.

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `preloaderAppear` | `html/en__d7f1773e:56` (inline style block) | 0.9 s | `cubic-bezier(0.215, 0.61, 0.355, 1)` (≈ GSAP "power2.out") | Page load on `.c-preloader_logo` (with `0.3 s` delay); uses `animation-fill-mode: backwards`. |
| `featuredProjectsAllFlash` | `css/main__29fe7204.css:1` (minified) | 2 s | `linear`, infinite | `0%,25% → ""; 26%,50% → "🔺"; 51%,75% → ""; 76%,100% → "🕳"` content swap on `.c-featured-links_item.-cta .c-featured-links_title:before/after`. |
| `spin` | `css/main__29fe7204.css:1` | (default) | `linear` | 0% rotate(0) → `to` rotate(1turn). Used by FilePond. |
| `shake` | `css/main__29fe7204.css:1` | (default) | ease | FilePond error shake. |
| `fall` | `css/main__29fe7204.css:1` | (default) | `ease-out, ease-in-out, ease-out` | FilePond file-drop animation. |
| `lisaDisclaimerFlash` | `css/main__29fe7204.css:1` | (default) | step | Lisa project "Disclaimer" flash. |
| `lisaDisclaimerProcedure` | `css/main__29fe7204.css:1` | (default) | step | Lisa project "Procedure" underline flash. |
| `lisaLoader` | `css/main__29fe7204.css:1` | (default) | linear | Lisa project loader spinner. |
| `lisaCursor` | `css/main__29fe7204.css:1` | (default) | step | Lisa project custom cursor. |
| `swiper-preloader-spin` | `css/main__29fe7204.css:1` | (default) | linear | Swiper slider preloader. |

### JS-driven animations (via GSAP / Lenis / Three.js / custom JS)

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP (`Nt.timeline`) | Letter-shuffle hover on `[data-hover-shuffle]` | `mouseenter` / `mouseleave` | The `Hovers` module (`qT` class) shuffles each character of the link's text 4 times over 0.25 s (4 iterations × 0.0625 s each), using the `ld(n, e)` helper that mutates `node.textContent` with a Fisher-Yates-style swap (`L6` function for enter, `lg` function for leave). |
| GSAP (`Nt.from` / `Nt.set` / `Nt.to`) | Ring camera launch | `Scroll` progress on `.c-home-summary_visual` enters view | `Nt.from(se(this,Pm), { radius: .5, phi: -.4, theta: 1.2, ease: "power4.out", duration: 4 })` + `Nt.from(this.model.position, { y: -.05, ease: "power4.out", duration: 4 })`. |
| GSAP (`Nt.to`) | Ring auto-rotate speed | `onScrollProgress` | `this.ring.autoRotate = mapRange(.5, 1, 2, 20, Gse(n))` where `Gse = (0,$se.default)(.4, 0, 1, 1)` is a Bezier easing (`cubic-bezier(0.4, 0, 1, 1)`). |
| GSAP (`Nt.to`) | Ring scrollProgress smoothing | `onScrollProgress` | `this.ring.scrollProgress = Gse(n)` — same Bezier easing, clamps to `[.4, 1]`. |
| GSAP (`Nt.to`) | Team camera view offset (case-study style) | Scroll | `Nt.to(this.viewOffset, { y: e ? 0 : this.viewOffset.fullHeight * .25, duration: t, ease: "Power2.out" })` + `onUpdate: () => We.camera.setViewOffset(...)`. |
| GSAP (`Nt.to`) | Team camera fov | Scroll | `Nt.to(We.camera, { fov: e ? a1 * .75 : a1, duration: t, onUpdate: () => We.camera.updateProjectionMatrix() })`. |
| GSAP (`Nt.set`) | Initial pre-leave state | Barba page-leave | `Nt.set(n, { opacity: 0 })` — hides elements before the leave animation. |
| GSAP (`Nt.timeline`) | Barba leave animation | `barba.leave` | `Oc = Nt.timeline({ onComplete: i })` runs 16 × 10 = 160 letter shuffles across every text node in the leaving container. |
| GSAP (`Nt.timeline`) | Barba enter animation | `barba.enter` | Same shuffle technique, this time scrubbing through the entering container's text. |
| GSAP (`Nt.ticker`) | Per-frame render loop | Every `requestAnimationFrame` | Drives Three.js `Ring.tick` and `TeamCanvas.render` via `Nt.ticker.add(this.renderBind)`. |
| Three.js (`xP` TeamCanvas) | Character random selection on canvas enter | `data-scroll-call="onInview, TeamCanvas"` | `this.setModel(this.models[Math.floor(this.models.length * Math.random())])` — picks a random GLB from the comma-separated list. |
| Three.js (`xP` TeamCanvas) | Character click swap | `pointerdown` + `pointerup` within 250 ms and < 10 px | Tap detection: `if (i < 250 && s < 10) this.setModel(this.models[Math.floor(this.models.length * Math.random())])`. |
| Three.js (OrbitControls) | Team canvas auto-rotate | Idle (no interaction) | `this.wrapper.rotation.set(0, this.wrapper.rotation.y + .02 * this.deltaTime / (1/60), 0)`. |
| Three.js (OrbitControls) | User drag-rotate | `OrbitControls` listeners | `controls.touches = {}; el.style.touchAction = "";` (no pan/zoom, polar angle clamped to `[π * .3, π * .6]`). |
| Lenis (custom) | Smooth scroll | `wheel` + `touch` events on the `eventsTarget` | Default `lerp: 0.1, duration: undefined, easing: w => Math.min(1, 1.001 - Math.pow(2, -10 * w))`. |
| Lenis (custom) | Touch inertia | `touchend` with `Math.abs(delta) > 5` | `delta = this.velocity * this.options.touchInertiaMultiplier` (default 35). |
| Custom (Barba leave) | Letter-shuffle on every text node | Barba `leave` | 160 `ld(n, lg)` calls (one per ~16 ms frame × 10 frames), each call sets `fontKerning: none`, runs a random character swap, and on completion restores the original text. |
| Custom (Barba enter) | Letter-shuffle reverse | Barba `enter` | Same algorithm in reverse, scrubs from current state to original. |
| Custom (FeaturedLinks) | Image-reveal position over title | `mouseenter` / `mouseleave` on `.c-featured-links_item` | The hover image's `transform: translateY(-50%)` plus the JS positions it over the two title halves; opacity transitions are pure CSS. |
| Custom (ScrollTrigger alt) | Per-element `--progress` CSS variable | Lenis `scroll` event | The `Scroll` class (`yP`) updates a CSS variable `--progress: 0..1` on every `[data-scroll-css-progress]` element. CSS uses it in `var(--mapped-progress) = calc((var(--progress) - 0.5) / 0.5);` for the hero parallax. |
| Custom (VideoInview) | Hero video play/pause | IntersectionObserver | Toggles `video.play()` / `video.pause()` based on entry/exit. |
| Custom (NewsletterModal) | Form entrance | `is-opened` class | `transform: scale(0.9) translate3d(0, -10%, 0); opacity: 0;` → `scale(1) translate3d(0, 0, 0); opacity: 1;` over `.3s cubic-bezier(0.23, 1, 0.32, 1)`. |
| Custom (NewsletterModal) | Loading state | Form submit | `is-loading` class sets `opacity: .35 !important;`. |
| Custom (VideoModal) | Modal entrance | `is-active` class | `transition: visibility 0s linear; transition-delay: .6s;` on hide; `transition-delay: 0s;` on show. Scrim `.6s`, inner `.3s` (`.6s` delay before fade-in). |
| Custom (VideoModal) | Close button slide | `is-active` | `transform: translateY(-2.6666666667rem) translateY(-100%);` → `translateY(0);` over `.3s`. |
| Custom (Preloader) | Logo entrance | Page load | `animation: preloaderAppear .9s cubic-bezier(0.215, 0.61, 0.355, 1) .3s; animation-fill-mode: backwards;`. |
| Custom (Preloader) | Preloader exit | `html:not(.is-first-loading)` | `opacity: 0; pointer-events: none; transition: opacity .9s cubic-bezier(0.215, 0.61, 0.355, 1);`. |
| Custom (Header) | Hide-on-scroll-down | Lenis `direction === 1` (down) | `transform: translate3d(0, calc(var(--header-height) * -1), 0px);` over `.2s cubic-bezier(0.215, 0.61, 0.355, 1);`. |
| Custom (Header) | Show-on-scroll-up | Lenis `direction === -1` (up) | `transform: translate3d(0px, 0px, 0px);` over `.2s`. |
| Custom (Header) | Mix-blend-mode swap | `is-over-home-hero` class | `mix-blend-mode: difference; color: var(--color-bg);` while over the hero (and not in mobile menu). |
| Custom (HomeHero) | `is-over-home-hero` class | IntersectionObserver on hero | Toggles when hero enters/exits the viewport (5% margin). |
| Custom (HomeHero) | Hero background parallax | `--progress` CSS var | `transform: translate3d(0, calc(-25vh * var(--mapped-progress)), 0);`. |
| Custom (HomeHero) | Hero veil darken | `--progress` CSS var | `::before { opacity: calc(var(--mapped-progress) * .75); }`. |

### Page transitions

- The site is a Twig/Craft CMS multi-page site but the JS bundle includes
  Barba.js for SPA-like transitions. The `O6 = { name: "default", leave, enter }`
  hooks are registered.
- The leave hook:
  1. Awaits a 250 ms timeout (a minimum transition duration so it doesn't
     feel abrupt).
  2. Finds every text node in the current container (`!u.children.length || u.dataset.allowShuffle != null`).
  3. Sets `font-kerning: none` to prevent micro-jitter.
  4. Builds a GSAP timeline of 160 letter shuffles (`ld(u, lg)`), 16 ms
     apart, each shuffling the text of a different node.
  5. On completion, restores the original text and clears `font-kerning`.
- The enter hook is the symmetric reverse.
- On direct link to the home page, the preloader (`window.preloaderPromise`)
  blocks initial paint until the load module decides the page is "ready".

---

## Assets

The dump contains 9 actual asset files (everything else is JS/CSS/HTML).

### 3D models

N/A — no 3D assets observed in the dump. The homepage references
`uploads/team/3d/*.compressed.glb` (28 character models) and
`/assets/3d/ring.compressed.glb` (the diamond ring) but the scraper
captured the URLs only, not the model files. (The 3D modules are
instrumented and ready to fetch on demand.) If reproducing the homepage
fully, you would need to download:

- `https://locomotive.ca/uploads/team/3d/cath-dorion_rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/fred2024_2-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/jeff-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/mat-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/dust2024-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/mc-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/sacha-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/bastien-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/julien-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/ben-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/chauncey-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/jeremy-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/arnaud-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/xavier-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/pascal-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/michel-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/lucasb-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/charles-rigged-2.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/nath-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/maureen-rigged-2.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/simon-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/steph-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/angie-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/lea-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/leo-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/laurence-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/alex-gatteffosse-compressed.glb`
- `https://locomotive.ca/uploads/team/3d/rebeka-rigged.compressed.glb`
- `https://locomotive.ca/uploads/team/3d/hugo-rigged.compressed.glb`
- `https://locomotive.ca/assets/3d/ring.compressed.glb` (the diamond ring)
- `https://locomotive.ca/assets/3d/studio_blur_small.jpg` (HDRI environment)

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| PPLocomotiveNew | 400 (Light, only) | woff2 (67.3 KB), woff (84.5 KB) | `tmp/locomotive/fonts/PPLocomotiveNew-Light__7464cd1d.woff2`, `PPLocomotiveNew-Light__d9aa4ea6.woff` | yes — `https://locomotive.ca/assets/fonts/PPLocomotiveNew-Light.{woff2,woff}` |
| HelveticaNowDisplay | 400 (Regular, only) | woff2 (41.6 KB), woff (60.2 KB) | `tmp/locomotive/fonts/HelveticaNowDisplay-Regular__48ab818f.woff2`, `HelveticaNowDisplay-Regular__6f61f8d9.woff` | yes — `https://locomotive.ca/assets/fonts/HelveticaNowDisplay-Regular.{woff2,woff}` |

Both ship with `font-display: swap`. There is no variable-font axis; each
weight/style is a single static font file.

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tmp/locomotive/images/poster_desktop__6200a1a6.png` | PNG (8-bit colormap) | 1920×1080 | 553,895 B (541 KB) | `https://locomotive.ca/uploads/home/poster_desktop.png` | Hero video poster (displayed before the Vimeo stream loads). |
| `tmp/locomotive/images/primary-thumb__1e230a1d.png` | PNG (RGB) | 10×6 (placeholder) | 1,851 B | `https://locomotive.ca/assets/images/temp/work-single/elektra/primary-thumb.png` | Featured-link thumbnail — the actual project thumbs (Scout Motors 300×176, Populous 300×189, Mate Libre 300×189, Destigmatize 300×190) are referenced in `data-src` but not downloaded. |
| `tmp/locomotive/images/pros-de-linternet-white-t-shirt-thumb__143e95d0.jpg` | JPEG (10×11 placeholder) | 10×11 | 1,302 B | `https://locomotive.ca/assets/images/temp/pros-de-linternet-white-t-shirt-thumb.jpg` | Shop tile thumb. Full image is `pros-de-linternet-white-t-shirt.jpg` (1440×1640). |
| `tmp/locomotive/images/pros-de-linternet-sand-cap-thumb__7746bd2e.jpg` | JPEG (10×11 placeholder) | 10×11 | 1,329 B | `https://locomotive.ca/assets/images/temp/pros-de-linternet-sand-cap-thumb.jpg` | Shop tile thumb. Full image is `pros-de-linternet-sand-cap.jpg` (1440×1640). |
| `tmp/locomotive/images/favicon-16x16__17c9c73f.png` | PNG (gray+alpha) | 16×16 | 586 B | `https://locomotive.ca/assets/images/favicons/favicon-16x16.png` | Favicon. |
| `tmp/locomotive/images/favicon-32x32__eec124f3.png` | PNG (gray+alpha) | 32×32 | 858 B | `https://locomotive.ca/assets/images/favicons/favicon-32x32.png` | Favicon. |
| `tmp/locomotive/images/apple-touch-icon__27f8cf9e.png` | PNG (gray+alpha) | 180×180 | 3,635 B | `https://locomotive.ca/assets/images/favicons/apple-touch-icon.png` | iOS home-screen icon. |
| `tmp/locomotive/images/Open_Graph_Loco_(1)__a9c6f7e5.png` | PNG (8-bit colormap) | 1200×630 | 328,959 B (321 KB) | `https://locomotive.ca/uploads/metadata/Open_Graph_Loco_(1).png` | Open Graph / Twitter card image. |

Note: the `featured-links` thumbnails, the home-hero video still,
and the team/ring 3D content are lazy-loaded at runtime — only placeholder
file URLs are present in the static HTML.

### SVGs & icons

- **Inline SVGs observed in HTML:** 1 — the Locomotive wordmark in the
  preloader (`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 246.5033 33.28001" id="preloaderLogo">`).
  Contains 8 `<path>` and 2 `<g>`/`<polygon>` elements that draw the
  "Locomotive" wordmark with a small ® glyph. See
  `playwright/homepage.html:139-162`.
- **Standalone SVG files in dump:**
  - `tmp/locomotive/svgs/safari-pinned-tab__3e787b72.svg` — 260×260 monochrome
    pinwheel-style icon (mask icon for Safari pinned tabs, fill #000000).
- **Icon system:** None. UI icons are inline unicode glyphs (`→`, `↗`, `×`, `↓`,
  emoji), not an icon font or sprite.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| (not in dump) | MP4 H.264 (1080p) | Hero video. Source: `https://player.vimeo.com/progressive_redirect/playback/792718372/rendition/1080p/file.mp4?loc=external&log_user=0&signature=978abf9e4b33e3e143901fbcbf68e159d90d5eeb95ed25f8378d341514009cf8` (Vimeo). `muted`, `playsinline`, `loop`, autoplay via the `VideoInview` module. The dump captured a 7.7 MB binary blob at `playwright/media/c7567b65-e5d0b1c7__18da45f8` that appears to be the redirected MP4 stream body. |

### Other

- `tmp/locomotive/other/site__4513a0f5.webmanifest` — 14-line PWA manifest
  with `name: "Locomotive"`, `theme_color: "#ffffff"`, `background_color: "#ffffff"`,
  `display: "standalone"`, and a 256×256 Android Chrome icon reference.

---

## Motion & Interaction

### Principles

- **Easing:** the project uses one dominant curve: `cubic-bezier(0.215, 0.61, 0.355, 1)`
  (a CSS-port of GSAP's `power2.out`). The preloader entrance, header
  reveal, scroll-lock transitions, and most UI reveals use this. A second
  curve `cubic-bezier(0.23, 1, 0.32, 1)` (a tighter `power3.out`) is used
  for the featured-link title transitions and the newsletter modal.
- **Duration:** 0.15 s for micro (icon fades, small form field reveals);
  0.2 s for header show/hide; 0.3 s for modal entrances; 0.45 s for
  featured-link hover enter, 0.2 s for leave; 0.6 s for the video modal
  scrim; 0.9 s for the preloader; 4 s for the ring launch.
- **GSAP side:** `power2.out`, `power4.out`, `power1.inOut` are the named
  eases; durations from `.1` (volume fades) through `4` (ring launch).
- **Motion is choreographed, not decorative.** The preloader logo, hero
  parallax, ring rotation, team canvas entry, featured-link hover images,
  mobile menu slide, and the barba page transitions all share the same
  pacing language.

### Specific behaviors

- **Link hover:** `text-decoration: underline; text-decoration-thickness: var(--border-size);` on the text content; on `-huge` and `-h1` headings, the underline switches to `dashed` on hover/focus.
- **Button hover:** No fill change. The `.c-button_label` text gets
  underlined (`text-decoration-thickness: var(--border-size);`) on hover.
- **Section reveal on scroll:** No fade-in/translate-up is applied to
  whole sections. The site uses a more editorial approach: each element
  has a `data-scroll` attribute and the Scroll class updates its
  `--progress` CSS variable, which the element's own CSS uses to drive
  its own reveal (e.g. the hero's parallax and darkening veil).
- **Image lazy load:** When an `<img data-src="…" data-scroll data-scroll-offset="15%" data-scroll-call="lazyLoad, Scroll" data-depixelate>` scrolls past 15% offset, the `lazyLoad` function is called, which sets the
  src, and once the image is loaded, the `depixelate` function (`ra()`)
  removes the `-pixelated` class to reveal the high-res version. The
  whole effect is a deliberate "load in chunks" → "settle to crisp"
  effect.
- **Preloader:** Black overlay, no spinner, just the wordmark fading in.
- **Page transition:** Barba.js leave + enter, with letter-shuffling
  across every text node (16 ms per frame, 10 frames = 160 ms total,
  plus the 250 ms `preload` setTimeout for a minimum 250 ms hold).
- **Custom cursor:** Not used on the homepage. (Likely used on case-study
  pages — there is no `c-cursor` rule in the homepage CSS.)
- **Mouse parallax on the 3D ring:** The diamond ring's spherical
  position (`phi`, `theta`, `radius`) is driven by `scrollProgress` (via
  the `Bez(0.4, 0, 1, 1)` easing), so the camera spirals around the ring
  as the user scrolls past the summary block. The auto-rotate speed
  also accelerates from 2 → 20 between `progress = .5` and `1`.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` is honored in the cookie
banner (`#cc-main { --cc-modal-transition-duration: 0s; }`) and in the
Lisa project components (`.c-lisa-note` and `.c-lisa-note_content` only
animate under `@media (prefers-reduced-motion: no-preference)`). The main
site does not have an explicit reduced-motion override — the GSAP
timelines, Lenis smooth scroll, and Three.js render loop would all
continue to run with reduced motion enabled. The dump does not show a
global "stop animations if reduced motion" branch.

---

## Content & Voice

- **Tone:** Confident, technical, restrained. The agency uses plain,
  declarative language ("Design and code are only tools of expression.
  What sets us and our work apart is people."). There is no marketing
  flourish — the work itself is the pitch. Playful emoji accents and
  the "Buy now →" / "🔺/🕳" easter eggs add personality without
  undermining the editorial seriousness.
- **Sentence length:** Short to medium. Active voice throughout.
- **Capitalization:** Title case is used sparingly (e.g. "Featured work",
  "Extras", "Articles", "Culture", "Store"). Proper nouns and project
  names use their own conventions (Scout Motors, Populous, Mate Libre,
  Destigmatize). Sentence case for the agency statement in the about
  block.
- **Punctuation:** No em-dashes. No Oxford-comma-visible lists. Question
  marks appear only in the contact CTA "Let's talk". Arrows (`→`, `↗`)
  are used liberally to indicate direction and external links.
- **CTA vocabulary:** "Let's talk", "Subscribe", "Accept All", "Accept
  Necessary", "Let me choose", "Save Preferences", "Cookie preferences",
  "Newsletter", "Close", "Buy now", "Read more about this project",
  "See all projects", "The dynasty", "Agency", "Careers". Twelve total
  unique CTAs.
- **Voice notes:** The page uses "we" in the about statement and
  "our" in the email — direct, first-person plural, no corporate
  distancing. The shop tile microcopy says "Buy now" twice (visible
  + aria-hidden) which is a deliberate accessibility repetition.

---

## Information Architecture

Top-level routes observed (via the in-page links):

- `/` — marketing homepage (current page).
- `/en/work` — case-study grid (linked from the nav and the "All Work"
  featured-link row).
- `/en/agency` — agency page (linked from the nav and the home-about
  "Agency" button).
- `/en/careers` — careers page (linked from the nav and the home-about
  "Careers" button).
- `/en/contact` — contact page (linked from the "Let's talk" header CTA
  and the footer menu).
- `/en/privacy-policy` — privacy policy (linked from the cookie banner
  and footer).
- `https://store.locomotive.ca` — Shopify-hosted merchandise store
  (external, opens in a new tab).
- `https://explore.locomotive.ca/en/...` — annual-trips photo journal
  (external, opens in a new tab).
- `https://six.locomotive.ca/en/` — Locomotive's "dynasty" 7-year
  retrospective (external).
- `https://scroll.locomotive.ca/` — the open-source Locomotive Scroll
  library site (external).
- `https://medium.com/@LocomotiveMTL/...` — six Medium articles
  (Culture, Innovation, Why no front-end frameworks, Workspace, UX,
  Chivalry partnership).
- `https://www.instagram.com/locomotivemtl/`, `https://twitter.com/locomotivemtl`,
  `https://www.linkedin.com/company/locomotive-mtl`,
  `https://www.behance.net/locomotivemtl`, `https://github.com/locomotivemtl` —
  social profiles.
- `https://locomotive.ca/fr` — French mirror of the homepage.

Language switcher: a single link toggles between `/en` and `/fr`, gated
by `data-load="false"` so it does a full page reload (not Barba).

---

## Accessibility

- **Color contrast:** Body text is `#000000` on `#FFFFFF` (21:1 ratio —
  AAA). Reverse theme (`data-theme=dark`) is `#FFFFFF` on `#000000`
  (21:1). The `primary` theme bg is `#DA382E` (vermilion) with `#000000`
  text (computed contrast ≈ 5.4:1 — AA Large / AA Normal). The
  `secondary` theme bg is `#312DFB` (electric blue) with `#FFFFFF` text
  (computed contrast ≈ 8.0:1 — AAA). The home hero H1 is white on a
  video background — visual contrast varies frame to frame, mitigated
  by `mix-blend-mode: difference` on the H1.
- **Focus indicators:** The default focus treatment is
  `.focus-visible:not(input):not(textarea) { outline-color: var(--color); outline-style: auto; outline-width: 10px; outline-offset: 5px; }`
  — a 10 px black/white ring with a 5 px offset. The Header
  specifically suppresses the default ring on its nav links (`.c-header a:not(.c-header_logo):not(.focus-visible) { outline: none; }`).
- **Keyboard:** All interactive elements are reachable in tab order.
  The mobile menu installs a `focus-trap` so Tab cycles inside the
  menu. Esc closes the mobile menu and returns focus to the toggler.
  The cookie modal has its own focus-trap (vendored CookieConsent
  library).
- **Screen-reader landmarks:** `<header>`, `<main>`, `<footer>` and
  `<nav>` are all present. `<main>` wraps the entire scrollable
  content. `<nav class="c-menu" id="mobile-menu" aria-label="Navigation mobile">`,
  `<nav class="c-header_menu">`, and `<nav class="c-footer_nav">` are
  distinct.
- **Live regions:** The newsletter modal feedback area carries
  `aria-live="polite"` (via `data-newsletter-modal="feedback"`) so the
  success/error message is announced when populated.
- **Skip-links:** None observed. The header, hero, and main all live in
  the same tab order, so a screen-reader user has to tab through ~5
  header links before reaching the content.
- **Image alt text:** The featured-link `<img>` elements carry `alt=""`
  (decorative — the text "Scout Motors", "Populous" etc. is in the
  parent `<h3 class="u-screen-reader-text">` and the visible
  `.c-featured-links_title` spans, so the image itself is correctly
  marked decorative). The shop tile images have descriptive alts
  ("Pros de l'internet White T-Shirt", "Pros de l'internet Sand Hat").
  The team canvas `<canvas>` has no accessible name; it is a visual
  decoration only.
- **Other notes:** the `data-scroll` attribute on elements does not
  affect accessibility. The cookie banner has a `role="dialog"` and
  `aria-modal="true"`. The newsletter modal also has `role="dialog"`
  (via the `data-module-newsletter-modal="m12"` element). The
  hamburger button toggles `aria-expanded` correctly.
- **Motion:** No global `prefers-reduced-motion` override on the main
  site animations (only on the cookie banner and the Lisa project
  widgets). Lenis smooth scroll, GSAP hover-shuffle, and Three.js
  renders will continue at full speed with reduced-motion enabled.

---

## Sources

- Homepage — https://locomotive.ca/en
- French mirror — https://locomotive.ca/fr
- Work index — https://locomotive.ca/en/work
- Agency — https://locomotive.ca/en/agency
- Careers — https://locomotive.ca/en/careers
- Contact — https://locomotive.ca/en/contact
- Privacy policy — https://locomotive.ca/en/privacy-policy
- External — https://store.locomotive.ca
- External — https://scroll.locomotive.ca/
- External — https://explore.locomotive.ca/en
- External — https://six.locomotive.ca/en/
- Instagram — https://www.instagram.com/locomotivemtl/
- Twitter — https://twitter.com/locomotivemtl
- LinkedIn — https://www.linkedin.com/company/locomotive-mtl
- Behance — https://www.behance.net/locomotivemtl
- GitHub — https://github.com/locomotivemtl
- Matomo (self-hosted analytics) — https://matomo.locomotive.ca/
- Google reCAPTCHA — https://www.google.com/recaptcha/
- Vimeo (hero video) — https://player.vimeo.com/external/792718372.hd.mp4
- Google Fonts CDN equivalent — none used (self-hosted only)

---

## Changelog

- 2026-06-20 — Initial draft by design.md-gen (from
  `tools/tmp/locomotive/` dump, scraped 2026-06-19T20:00:18Z).
