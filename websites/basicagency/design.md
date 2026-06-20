# BASIC/DEPT® — design.md

> A structured design specification of **https://basicagency.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** design.md_gen
> **Source dump:** `tools/tmp/basicagency/` (gitignored; static pass hit
> a Cloudflare JS challenge, all rendered assets captured via the
> Playwright dynamic pass)

---

## Overview

BASIC/DEPT® is the working name of BASIC, a San Diego–based digital
agency that does branding, experience design, and engineering. The site
is a high-craft portfolio whose design language is built on a single
sans-serif family, a near-monochrome palette lifted by a single "azalea"
pink accent, a strict 12-column grid, and a consistent motion library of
text reveals, image wipes, and trace underlines. Every section ships its
own scoped set of 17 named @keyframes, an indicator of a tightly
designed system rather than ad-hoc transitions.

The visual register is confident, editorial, and restrained — almost
the look of an annual report or a Bauhaus reissue — but it never reads
as cold: the motion is warm, the pink is repeated as a wayfinding dot,
and a full-bleed noise/grain overlay is rendered on top of every page to
soften the digital edges.

**Category:** Marketing / portfolio / agency site
**Primary surface observed:** Homepage (`/`), About (`/about`), with
client-rendered modules also present for Services, News (blog),
Thinking, Careers, Contact, Case Studies, Industries, and a Promise
(BIPOC commitment) area.
**Tone:** confident, editorial, culturally literate; mild playfulness
through emoji-like bullet glyphs (`●`) and trademark/registered marks
(`®`, `™`).
**Framework detected:** Next.js (Pages Router — observed
`pages/[slug]`, `pages/about`, `pages/case-studies/[slug]`,
`pages/blog/[slug]`, `pages/privacy-policy` chunks) with content
served from **Sanity CMS** (dataset id `8nn8fua5`,
`cdn.sanity.io/images/8nn8fua5/...`).

---

## Visual Language

### Color

Every color in the codebase resolves through a single `:root` design
token system (`--bd-color-*`). The on-page body and `color` /
`background-color` swap on theme via CSS variables. There is **no**
conventional dark-mode toggle; instead, individual modules set
`data-theme-is-dark` and rebind `--background-color` and
`--text-color` for that section.

| Role | Token | Value | Closest name | Usage |
| --- | --- | --- | --- | --- |
| Background (page base) | `--bd-color-background-light` | `#F4F4F4` | wild-sand | Default body background |
| Background (inverted) | `--bd-color-background-dark` | `#252422` | tuatara | Full-bleed dark sections, menu panel |
| Text (base) | `--bd-color-text-base` | `#252422` | tuatara | Default body color |
| Text (inverse) | `--bd-color-text-inverse-base` | `#FFFFFF` | white | Text on dark sections |
| Text (inverse secondary) | `--bd-color-text-inverse-secondary` | `#F9CDCD` | azalea | Text on dark sections (sub) |
| Text (muted) | `--bd-color-text-footer-copyright` | `#5E5E5E` | scorpion | Footer copyright line |
| Accent (primary brand) | `--bd-color-brand-primary-pink` | `#F9CDCD` | azalea | Brand pink — bullet dots, carousel cursor, contact overlay |
| Accent (support) | `--bd-color-base-cod-gray` | `#191918` | cod-gray | Footer copyright bar bg, noise |
| Surface (subtle) | `--bd-color-base-gallery` | `#EAEAEA` | gallery | SoundCloud player close, dividers |
| White | `--bd-color-base-white` | `#FFFFFF` | white | Pill button base, inverse text |
| Black | `--bd-color-base-black` | `#000000` | black | Spotify embed bg, fallback |
| Footer (primary) | `--bd-color-background-footer-primary-light` | `#252422` | tuatara | Footer bg in light theme |
| Footer (primary, dark theme) | `--bd-color-background-footer-primary-dark` | `#F4F4F4` | wild-sand | Footer bg when `data-theme-is-dark=true` |
| Footer (secondary) | `--bd-color-background-footer-secondary-light` | `#191918` | cod-gray | Bottom copyright bar |
| Overlay scrim | `--bd-color-background-overlay-scrim` | `#252422` | tuatara | Modal/lightbox scrim (75% opacity) |
| Overlay panel | `--bd-color-background-overlay-panel` | `#F4F4F4` | wild-sand | Right-side overlay panel |
| Selection | `--bd-color-text-base` on `--bd-color-background-light` | `#252422` / `#F4F4F4` | — | `::selection` swaps fg/bg |
| Border (base) | `--bd-color-border-base` | `#252422` | tuatara | Default `.1rem` rules |
| Border (tertiary) | `--bd-color-border-tertiary` | `#F9CDCD` | azalea | Pink underline variants |
| Tuatara hover | `--bd-color-background-button-primary-hover` | `#252422` | tuatara | Pill hover bg |
| Azalea hover | `--bd-color-background-button-tertiary-hover` | `#252422` | tuatara | Pill tertiary hover |

Opaque variants (used on disabled / scrim states):
`rgba(37,36,34,0.25)` `#25242240`, `rgba(37,36,34,0.8)` `#252422CC`,
`rgba(255,255,255,0.25)` `#FFFFFF40`, `rgba(255,255,255,0.8)`
`#FFFFFFCC`, `rgba(249,205,205,0.8)` `#F9CDC DCC`,
`rgba(249,205,205,0.25)` `#F9CDCD40`.

Secondary brand spot colors used very sparingly on the Promise page:
`--bd-color-brand-secondary-green: #088843` (kelly), `red: #D64121`.

### Typography

A single family, **SctoGroteskA**, served as self-hosted woff2 with
`font-display: swap`. Weights loaded: **300 (Regular)**, **400 (Medium)**,
**700 (Bold)** — there is no 500 weight. The CSS aliases are confusing:
`--font-weight-medium` resolves to **400** (not 500), `--font-weight-bold`
resolves to **700**, `--font-weight-regular` resolves to **300**.

| Role | Family | Weight (numeric) | Size (mobile → desktop) | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display / H1 | SctoGroteskA, sans-serif | 700 | `4rem` → `6.25vw` (≈ `14.4rem` @ 1440px) → `4.6rem` (portrait) | `0.9` | `-0.05em` |
| H2 | SctoGroteskA, sans-serif | 700 | `2.4rem` → `4.2rem` | `1.1` | `-0.05em` |
| H3 | SctoGroteskA, sans-serif | 400 (medium) | `2.2rem` → `3.8rem` | `1.1` | `-0.035em` |
| H4 | SctoGroteskA, sans-serif | 700 | `2rem` → `2.8rem` | `1.2` | `-0.02em` |
| H5 | SctoGroteskA, sans-serif | 700 | `1.8rem` → `2.2rem` | `1.1` | `-0.02em` |
| H6 | SctoGroteskA, sans-serif | 400 (medium) | `1.6rem` → `2.2rem` | `1.1` | `-0.02em` |
| Body L | SctoGroteskA, sans-serif | 400 | `1.8rem` → `2.2rem` | `1.45` | `-0.04em` |
| Body | SctoGroteskA, sans-serif | 400 | `1.4rem` → `1.8rem` | `1.4` | `-0.01em` |
| Body S / meta | SctoGroteskA, sans-serif | 400 | `1.1rem` → `1.4rem` | `1.14` | `-0.02em` |
| Button / label | SctoGroteskA, sans-serif | 700 | `1.2rem` | `1` | `-0.02em` |
| Caption (figure) | SctoGroteskA, sans-serif | 400 | `1.1rem` → `1.4rem` | `1.2` | `0` |
| Pull quote (promise) | SctoGroteskA, sans-serif | 400 | `2.8rem` → `7rem` | `1.06` | `-0.04em` |
| Big number (result span) | SctoGroteskA, sans-serif | 700 | `3rem` → `10rem` | `1` | `0` |

All copy is `text-transform: uppercase` for meta, labels, and most
headings. `letter-spacing` is **negative everywhere** (`-0.01em` through
`-0.05em`) — a contemporary geometric-grotesque convention. Body
sentences are sentence-case.

Computed-style samples from Playwright (1440×900 viewport, light
theme): `body a` is `SctoGroteskA, sans-serif` / `18px` / `400` /
`25.2px` / `-0.18px`; `h1` measures `90px` / `700` / `-4.5px` /
`90px`; `h2` `42px` / `700` / `-2.1px`; large hero `intro` paragraphs
`38px` / `400` / `-1.33px` / `42px`. Smallest observed font is
`11px` (footer copyright, eyebrow). The only non-SctoGroteskA typeface
visible in the DOM is `"Times New Roman"` — injected by the
accessiBe accessibility widget and not part of the design.

### Spacing & radius

- **Base unit:** the body `font-size` is fluid via `--rem-base: 62.5%`
  on small screens and `--rem-base: 0.5vw` at >=1280px. In practice
  `1rem ≈ 10px` on mobile and `1rem ≈ 0.5vw` (≈ `7.2px` at 1440px) on
  desktop — meaning values like `1.8rem` scale with the viewport.
- **Vertical section spacing** (`:root` tokens, mobile → desktop):
  - Page section: `12.5vw` → `12.5vw`
  - Case study section: `14rem` → `18.2vw`
  - Service / industry / blog section: `8rem` → `10.4vw`
  - Thinking section: `12.5vw` → `12.5vw`
  - Meta-bar top space: `6rem` → `8.5rem`
  - Intro small: `6rem` → `4.1vw`
  - Intro large: `6rem` → `7.8vw`
- **Grid gutter:** `1.6rem` mobile, `2rem` desktop.
- **Grid padding:** `5.4vw` mobile, `8rem` desktop.
- **Hairline border:** `0.1rem` solid `currentcolor` is the default
  divider everywhere — modules add bottom/top borders rather than
  margins between rows.
- **Radii:** the design system uses **no border-radius** for content
  blocks. The two exceptions are:
  - `.button-pill`: `1.6rem` (full-pill)
  - `.cursor-takeover` and `.page-intro__cursor`: `50%` (circular)
  - `.menu__close`: `50%`
- **Shadows:** **none**. Elevation is signaled purely through color
  inversion (light surface vs tuatara `#252422` bg) and a translucent
  scrim (`rgba(37,36,34,0.75)`) on overlays.
- **Noise/grain overlay:** a fixed full-viewport `.noise` element
  tiled with `/_next/static/media/noise.e8298e81.png` (100×100 px
  RGBA), animated by `steps(2) infinite` jittering translate3d within
  `±10rem`. It is on every page, on top of everything, with
  `pointer-events: none`.

### Iconography

- **Style:** outline / monochrome line art, filled with
  `currentcolor`. Most icons are inline SVG components rendered by
  React in `tools/tmp/basicagency/playwright/js/142-b4ad18bfd2ee99ce__2aa76713.js`
  (the social-share bundle): Twitter bird, Facebook `f`, LinkedIn `in`,
  Pinterest `P`, mail envelope, plus a plus-sign toggle (`12×12` viewBox).
- **Default size:** icons in meta bars / nav are ~`1.2rem`–`1.6rem`;
  social icons render inside `figure { width: 100%; height: auto }`
  inside their `li`.
- **Glyph system:** the bullet `●` (U+25CF) is used pervasively as a
  section-divider glyph before h6 headings, in `figcaption:before`, in
  `.menu__text:before`, in `.service-overview__content__VIJiE li:before`,
  and in meta-bar rows. Trademarks `®` and `™` are common (`BASIC/DEPT®`,
  `Easy to understand. Impossible to ignore.™`).
- **No icon library** (no Lucide, Phosphor, or Heroicons) — every icon
  is hand-drawn SVG.

---

## Layout & Grid

- **Grid:** **6 columns** at `< 1280px`, **12 columns** at
  `>= 1280px`. Width is `100vw`. The grid is implemented with CSS
  custom properties: every `flex: 0 0 ...` value resolves through the
  expression
  `calc((var(--grid-width) + var(--grid-gutter) - var(--grid-padding)*2) / var(--grid-column-count) * N - var(--grid-gutter))`,
  so `N` is the column-span. Common N values used in the codebase:
  `1, 2, 2.5, 3, 3.25, 4, 4.5, 5, 6, 6.5, 8, 9, 10, 12`. There is
  also a Sass-style helper function `grid(N)` referenced (PostCSS
  plugin) so authors can write `grid(4)` directly.
- **Page gutter / outer padding:** `5.4vw` mobile, `8rem` desktop,
  applied as `padding-right` / `padding-left` on every `<section>` and
  on `.header__wrapper`.
- **Breakpoints** (mobile-first, `min-width` queries): `480`,
  `720`, `1024`, `1280`, `1440`, `1680`. The 1280 breakpoint is the
  primary inflection point (grid columns flip, header becomes a full
  bar with nav, footer padding doubles).
- **Vertical rhythm:** every section is separated from its sibling by
  `--page-section` (`12.5vw`), `--caseStudy-section` (`14rem` /
  `18.2vw`), or `--service-section` / `--industry-section` /
  `--blog-section` (`8rem` / `10.4vw`). No global baseline grid; the
  grid is column-driven.
- **Header height:** `calc(1.8rem + (1.5rem + 2.5vw) * 2)` mobile,
  fixed `12.8rem` desktop. The header is `position: fixed` and sits
  above all content with `z-index: var(--bd-layout-z-index-header)`
  (`800`).
- **Z-index scale:** `--bd-layout-z-index-bottom-panel: 700`,
  `--bd-layout-z-index-header: 800`, `--bd-layout-z-index-overlay: 900`,
  `--bd-layout-z-index-menu: 1000`, plus in-component tokens `z-0`,
  `z-1`, `z-2`, `z-neg-1`, `z-neg-2`, `z-neg-3`.

**Homepage primary layout (top → bottom):**
1. **`<header>`** — fixed, transparent by default; turns opaque only on
   a dark-themed hero (`data-transparent=true` uses
   `--bd-color-base-white` text and a transparent background).
2. **`<section.home-intro>`** — full-bleed `<video>` poster with a
   custom circular "Watch Reel" cursor (`12rem × 12rem`, azalea pink
   `#F9CDCD` background, label "Watch Reel", caption
   "BASIC/DEPT® 2010-∞"). The video poster image fades in on top of a
   solid background; clicking the hit-box starts playback and reveals a
   custom video player (`.video-player`) with a scrubbable seeker.
3. **`<section.home-overview>`** — heading "Strategy, Design,
   Technology" followed by body copy in H3-scale type, left-aligned on
   desktop, max-width 6 cols.
4. **`<section.home-case-studies>`** — a horizontally scrollable
   `<ul>` (`.carousel`) with cursor takeover; each item is a tall
   `<picture>` plus an `<h5>` client name and short blurb. Background
   becomes pink via JS-driven `--background-color` swap.
5. **`<section.home-clients>`** — heading "Featured Engagements" with
   a 2-column row of large client word-marks (Google, KFC, Wilson,
   AT&T, Patagonia), each rendered as inline `<svg>` from Sanity.
6. **`<section.home-spotlight>`** — a single pull-quote module ("●
   Agency Spotlight") with a large editorial image, attribution
   `BASIC/DEPT® helps brands ● connect w/ culture`, and `Adweek` cited
   as author. Background swaps to tuatara `#252422` with white type.
7. **`<section.home-news>`** (a.k.a. `homeListBlogFeatured`) — a
   carousel of recent posts (`.blogCarousel`) with index counter
   "(01/03) / ●" and dated entries (Sanity content).
8. **`<footer>`** — black-on-pink or pink-on-black depending on
   `[data-theme-is-dark]`; contains a big contact link, a newsletter
   form (email input with single-line "Subscribe" submit), and a
   grid of links + meta. Closes with a tuatara-black copyright bar
   that reads `BASIC/DEPT®, Inc 10 – 2026 ©` (year computed at
   runtime).

---

## Components

### Button (`.button-pill`)
- **Variants:** primary (transparent with `currentcolor` border),
  inverted (`data-inverted=true`, tuatara bg with white text and an
  azalea-pink hover), disabled (25% opacity).
- **Sizes:** one size only — `padding: .2rem 3rem 0`, `line-height: 2.8rem`,
  `border-radius: 1.6rem`. Trailing caret arrow is `0.8rem` wide.
- **Anatomy:** text label (SctoGroteskA Bold 12px, uppercase,
  `-0.02em` tracking) + optional trailing `figure` arrow + an absolutely
  positioned `::before` "slide-up" mask at `transform: translate3d(0,100%,0)`
  that animates to `0` on hover (slide-fill effect, `--bd-time-transition-250`
  `--ease-out`).
- **States:** default → hover (`color: var(--background-color)`, mask
  reveals with white bg; in inverted variant mask reveals tuatara bg) →
  active (`background-color: var(--text-color); color:
  var(--background-color)`) → disabled (`opacity: 0.25; cursor: default`).
- **Focus:** outline removed; relies on color-inversion for
  visibility (accessible but subtle).

### Input (text + textarea)
- **Anatomy:** floating label (`label > span`) absolutely positioned
  inside a `.page-contact-form__input` wrapper. Underline
  (`::after`) starts at `transform: scaleY(0.5)` and animates to
  `scaleY(1)` on focus-within (`.25s var(--ease-garret)`).
- **Text input height:** `4rem` line-height. **Textarea height:**
  `28vh` (`min-height: 20rem`), `border: .1rem solid`.
- **Floating label:** sits at top; on `:focus-within` or
  `data-has-value=true` it translates to `translateY(-75%)`. Label
  font is SctoGroteskA Bold `1.8rem`.
- **Newsletter input:** `5.5rem` line-height, no border, animated
  underline. Trailing arrow submit button is `1.8rem × 1.8rem`,
  absolutely positioned `top: 50%; right: 0`.
- **States:** default (no border, label inline) → focus (underline
  expands + label floats) → value (label stays floated) → success/error
  (inline `<div>` rendered beside the submit button, SctoGroteskA Bold
  `1.4rem`, white text — implying the form section is on a dark
  background).

### Card (case-study list item)
- **Anatomy:** wrapper `<li>` with a `.asset-image` thumbnail on top
  (full-bleed `<picture>`, optionally wrapped in a `.blurhash` `lqip`),
  followed by a `.info` block containing an `<h5>` title
  (SctoGroteskA Bold, uppercase, `line-height: 2.8rem` mobile) and a
  short `<p>` body (SctoGroteskA Regular, `line-height: 1.45`).
- **Padding:** `var(--grid-gutter)` top; no fixed card padding on the
  asset. On hover (desktop) `.menu_project-list-item` swaps a
  `translateY(var(--info-height))` panel into view (asset-mask slides
  up).
- **Background:** inherits the section's `--background-color` token;
  no card surface color.
- **Border:** none; the list grid uses `0.1rem solid currentcolor`
  rules between items (no rounded corners, no shadows).

### Nav (top bar — `.header`)
- **Height:** `12.8rem` desktop (padding `5rem` top/bottom with a
  `~2.6rem` logo). Mobile uses `calc(1.5rem + 2.5vw)` vertical
  padding.
- **Anatomy:** logo (SVG, `16rem × 2.2rem` desktop, 13.7×1.8 mobile)
  on the left, primary nav `<ul>` right-of-center (≥ 1280px only;
  `padding: 0 3rem` per item), and a circular "menu" button on the
  far right with two SVG dots that translate `±0.2rem` on hover.
- **Behavior:** fixed; `color: var(--text-color)` by default,
  `color: white` when `data-transparent=true` (used on the dark hero).
  Background fills with `--background-color` via a `.header__background`
  layer that fades to `opacity: 0` while transparent. Header `<nav>`
  links stagger in on initial paint: each `<li>` runs
  `header_fade-in` (`500ms ease-out-soft`) plus
  `header_translate-up` (`1rem → 0`, `500ms ease-out-soft`) at
  `initial-animation-delay + 100ms + N × 25ms`.
- **Link hover:** underline traces in from the left via
  `trace-in` keyframe (`translate3d(-101%,0,0) → translateZ(0)`)
  over `--bd-time-transition-250` `--ease-out`. Active link uses the
  same `trace-in` but `forwards` with `0s` delay so it appears pinned.

### Menu (full-screen panel — `.menu`)
- **Mode:** `position: fixed; inset: 0; height: calc(100% -
  var(--bottom-panel-height)); background-color: var(--bd-color-background-dark)` —
  tuatara `#252422` with azalea-pink text.
- **Open / close:** `[data-is-open=true]` toggles opacity from 0→1 over
  `--bd-time-transition-500` (`500ms ease-out-soft`); at >= 1280px a
  white panel slides in from the right via `translateX(0)` over
  `--bd-time-transition-1000` (`1s ease-in-out-hard`).
- **Anatomy (mobile):** centered nav `<ul>` of large button-style
  links (SctoGroteskA Bold `1.8rem` → `2.4rem` at ≥ 720px), each
  absolutely positioned `left: -1rem` so they translate into view
  on open; an inline `<figure>` caret rotated `-90deg` on the right.
- **Anatomy (desktop):** the nav hides and is replaced by a
  `.menu__initiatives` grid — a numbered list (`01`, `02`, …) of
  carousel cards (B/D® JAMS, Applied®, Moves®, Crafted®, Brandbeats®)
  with image, title, and label. Each card has hover-driven
  `translateY(0)` panel reveal.
- **Close button:** circular `.menu__close` (`4rem × 4rem` desktop,
  `border-radius: 50%`, `0.1rem solid var(--bd-color-border-secondary)`)
  in the top-right corner with an inline × SVG.

### Carousel (`.carousel`)
- **Mode:** horizontal scroll, hidden scrollbar (`scrollbar-width:none`,
  `::-webkit-scrollbar{display:none}`), with
  `-webkit-overflow-scrolling: touch` for iOS momentum.
- **Custom cursor:** `.carousel__cursor` is a `12rem × 12rem`
  absolutely positioned circle (azalea `#F9CDCD` background) that
  replaces the OS cursor over the carousel. It shows the active slide's
  `data-show-cursor` label ("Drag", etc.); on active drag it shrinks to
  `7rem × 7rem` and shows chevrons (`.carousel__cursor__carets`).
- **Progress bar:** `0.2rem` tall at the bottom of the carousel,
  with a `40rem` solid bar that follows the scroll position. There is
  also an `.carousel__index` ("01 / 03") counter aligned right.
- **Trigger:** scroll, drag, or trackpad — no autoplay.

### Video player (`.video-player`)
- **Trigger:** `<video>` with `poster` image and `<source src=...mp4>`;
  player UI is hidden until the `.hitBox` is clicked.
- **Hitbox:** full-area overlay, animates
  `page-intro_fade-in` (`--bd-time-transition-250` linear) on top of
  the poster, `cursor: none`. Contains the azalea cursor
  (`.page-intro__cursor`, `12rem` diameter, "Play" label + caption).
- **Controls:** a custom `<video>` seeker bar (`translateX(scale * 100%)`,
  absolutely positioned `.seeker__time` showing `MM:SS / MM:SS`).
- **Behavior:** click hitbox to play, click the video itself to
  pause. Touch is supported (`touchstart`/`touchmove`/`touchend`
  bound to the seeker).

### Overlay / Lightbox (`.overlay`)
- **Scrim:** fixed full-viewport `.overlay__lightBox` with
  `::before` at `--bd-color-background-overlay-scrim` (tuatara
  `#252422`) animated `opacity: 0 → 0.75` over `--bd-time-transition-500`
  on open.
- **Panel:** `.overlay__container` `position: absolute; right: 0;
  width: 100%` (desktop: `calc(grid(8) + grid-padding)`) animates
  `transform: translateX(100%) → translateX(0)` over 500ms ease-out-soft.
- **Close button:** circular `.overlay__close` in the top-right
  corner of the panel (4rem on desktop); fades in on open.

### Meta bar (`.meta-bar`)
- **Anatomy:** `<figure class="meta-bar__line">` (1px solid
  `currentcolor` full-width rule) + `<div class="meta-bar__row">` with
  two columns (label + value). Standard meta rows are formatted as
  `BASIC/DEPT® / Case Study`. The dot variant (`data-dot-only=true`)
  emits a single `●` instead.
- **Sizing:** `font-size: var(--font-size-small)` (1.1rem mobile,
  1.4rem desktop), `line-height: var(--line-height-small)` (1.14),
  `text-transform: uppercase`, `letter-spacing: -0.02em`.
- **Spacing:** `margin-top: 2rem` on the row, `margin-bottom: 9rem`
  below the bar — that bottom margin sets the rhythm between sections.

### Button (radio / pill toggle — `.button-radio`)
- **Anatomy:** `<button>` (treated as radio) with a `::before` ring
  (`1.6rem × 1.6rem` circle, `0.1rem solid currentcolor`) and an
  inner `::after` dot (`scale3d(.25,.25,1)` → `1`).
- **States:** unchecked (ring only) → hover (`::after` scales to 0.5)
  → checked `[data-checked=true]` (ring fades to `opacity:0`, dot
  scales to 1).
- **Use:** category filters on `/blog` and `/thinking` (e.g. "View
  All", "Strategy", "Design", "Technology").

### Footer (`.footer`)
- **Anatomy:** full-bleed `<footer role="contentinfo">` with
  `data-footer="true"` and `data-theme-is-dark`. Contains a 3-column
  grid: a large display link ("Want to work with us?"), a newsletter
  input column, and a meta column (locations + capabilities list).
- **Background swap:** in light-theme pages the footer is tuatara
  `#252422` with `var(--bd-color-text-footer-base)` text
  (`#F4F4F4`); when `[data-theme-is-dark=true]` the bg becomes
  `#F4F4F4` and text becomes `#252422`.
- **Copyright bar:** bottom strip `var(--bd-color-background-footer-secondary-light)`
  (`#191918` cod-gray) with `BASIC/DEPT®, Inc 10 – {year} ©`, centered,
  `font-size: 1.1rem`. On desktop it becomes a flex row with the
  site title on the left and accessibility/privacy links on the right.

### Logo take-over (`.logo-takeover`)
- **Use:** pre-render entry animation. A full-screen fixed overlay
  masks the BASIC/DEPT® logotype behind a `35vw` clipping rectangle
  (`overflow: hidden`) that animates `translateY(-100%)` over
  `--bd-time-transition-500 ease-garret` with `--bd-time-delay-250`,
  while the logo itself animates `translateY(100%)` over the same
  timing — the two motions slide past each other and the mask exits
  cleanly.

---

## JavaScript & Libraries

The site is a Next.js Pages-Router application with content from Sanity.
Detected bundles:

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| Next.js | 13.x (Pages router; `__NEXT_DATA__` with `page`, `buildId`, `isFallback:false`, `gsp:true`) | HTML head, `_app-914905e04b225f99.js`, `pages/[slug]-bc1400c01857c2da.js`, `pages/about-88f0aa10dbddbb75.js`, `pages/blog/[slug]-6c928392ee67ec66.js`, `pages/case-studies/[slug]-a1e0c6710613db04.js`, `pages/careers-3e49c5d411d6bf50.js`, `pages/privacy-policy-b0f5b07a04d315f7.js` | `framework-2f1a8e17e74f15d6.js` (React), `main-d6ff1c9309a432d9.js`, `webpack-8d528aca91b4dc0a.js` |
| React | 18.x | Imported via `framework-…js`; observed `jsx`, `jsxs`, `Fragment`, `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback` | |
| Sanity CMS | runtime `v3` (CDN `cdn.sanity.io/images/8nn8fua5/…`; dataset id `8nn8fua5`) | Inline `<script id="__NEXT_DATA__">` JSON; `<head>` references; observed `sanity.imageAsset`, `sanity.action.document.version.create`, `sanity.action.document.version.discard` strings in `_app` bundle | Per-asset `metadata.dimensions`, `metadata.blurHash`, `metadata.lqip`, `metadata.palette.{darkMuted, darkVibrant, dominant, lightMuted, lightVibrant, muted, vibrant}` |
| Hotjar | `137118` | `hotjar-137118__7a2f1878.js` | Hotjar ID observed in filename; window.hj calls inside the bundle |
| Google Tag Manager | `AW-10775445431`, `G-V2WMRJYJMH`, `G-…` (multiple) | `<script src="https://www.googletagmanager.com/gtag/js?id=…">` tags in `<head>`; `gtm__f22d43e8.js` (453 KB) | Google Ads conversion ID + GA4 |
| accessiBe | `1101b481` | `accessibe__1101b481.js`; `<div class="acsb-trigger acsb-widget" tabindex="0" role="button">` | Accessibility overlay |
| Listrak (insight) | `insight.min.js` | `insight.min__8b6988a0.js`, `insight.old.min__46616b6b.js`, `insight_tag_errors__8e929256.gif` | Email/analytics pixel; visible in cookies banner |
| Cookies/tracking | — | Multiple gtag IDs; `_hj` calls; Facebook Pixel "apiSanitizer" iframe in `homepage.html` | Marketing stack |

No GSAP, Three.js, Lottie, Framer Motion, Barba, Swup, or WebGL runtime
detected. Animation is done entirely with **CSS @keyframes** + a
**smooth-scroll / measure** context (likely a custom implementation or
lenis-style hook referenced as `useMeasurements`, `updateColorScheme`,
`setRendering`, `setOverflow`, `setAnimations`, `getEased` in
`tools/tmp/basicagency/playwright/js/651-ebedbcfbd4ccf67e__54734b94.js`).
React state drives `IntersectionObserver`-based reveals: the same
keyframe is bound to a `useInView` hook that toggles a "play" flag when
the element enters the viewport.

The page uses Next.js's `next/router` for client-side transitions — the
header observes the `pushState` to swap text color, the noise overlay
persists, and the `data-is-transitioning` attribute is set on the
`promise-next-page` section's `.fixed` panel during route change.

---

## Animations (Catalog)

The animation library is the most distinctive part of the design.
**Every** page-level section emits its own scoped set of 17 keyframes
named with a `<section>_` prefix (e.g. `home-intro_fade-in__Z8lV3`,
`about-gallery_wipe-out___oZ1X`). The base animations are global and
defined once in the main stylesheet. Below are the **canonical
keyframes** observed; section overrides simply re-emit the same
transitions under their own prefix.

### Canonical CSS @keyframes (defined globally)

| Name | Where | From → To | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- | --- |
| `fade-in` | `css/81c1c90410e66ab0__022de1c5.css` (line ≈ root, also re-emitted per section) | `opacity: 0 → 1` | `--bd-time-transition-650` (`650ms`) | `--ease-out` | main sections `main > section` paint; section content fades on mount |
| `fade-out` | same | `opacity: 1 → 0` | `650ms` | `--ease-out` | section exit / overlay close |
| `translate-up-0` | same | `transform: translateY(100%) → 0` | `650ms` | `--ease-out` | section reveal — pushes text up from below baseline |
| `translate-up-25` | same | `transform: translateY(25%) → 0` | `650ms` | `--ease-out` | sticky panels / parallax |
| `translate-up-0-masked` | same | `transform: translateY(103%) → 0` | `650ms` | `--ease-out` | hero text "rise out of mask" reveal |
| `translate-up-100` | same | `transform: translateY(0) → -100%` | `--bd-time-transition-500` (`500ms`) | `--ease-garret` | logo take-off exit; menu close |
| `translate-down-0` | same | `transform: translateY(-100%) → 0` | `500ms` | `--ease-garret` | logo take-off entry |
| `translate-down-100` | same | `transform: translateY(0) → 100%` | `500ms` | `--ease-garret` | scroll-out exit |
| `scale-in` | same | `transform: scaleX(0) → scaleX(1)` (origin `left`) | `250ms` | `--ease-out` | link underlines / contact-link reveal |
| `scale-out` | same | `transform: scaleX(1) → scaleX(0)` (origin `right`) | `250ms` | `--ease-out` | hover-out |
| `trace-in` | same | `transform: translate3d(-101%,0,0) → translateZ(0)` | `--bd-time-transition-250` (`250ms`) | `--ease-out` | underline enters from left (`.header__nav a:hover:after`, `.menu a:hover:after`, `.footer__contact-link:hover:after`, `.work-intro__filter a[data-active=true]:after`) |
| `trace-out` | same | `transform: translateZ(0) → translate3d(101%,0,0)` | `250ms` | `--ease-out` | underline leaves to right (initial paint) |
| `wipe-in` | same | `transform: scale(1.75) translateX(-100%) → scale(1) translateX(0)` | `1000ms` | `--ease-in-out-hard` | section/panel slide-in (left) |
| `wipe-out` | same | `transform: scale(1) translateX(0) → scale(1.75) translateX(100%)` | `1000ms` | `--ease-in-out-hard` | section slide-out (left) |
| `wipe-in-up` | same | `transform: scale(1.75) translateX(100%) → scale(1) translateX(0)` | `1000ms` | `--ease-in-out-hard` | inverse wipe (right → left) |
| `wipe-out-up` | same | `transform: scale(1) translateX(0) → scale(1.75) translateX(-100%)` | `1000ms` | `--ease-in-out-hard` | inverse wipe exit |
| `overlay-slide-left` | same | `transform: translateX(calc(grid(8, true) + var(--grid-padding))) → translateX(0)` | `1000ms` | `--ease-in-out-hard` | overlay panel entry |
| `push-arrow` | same | `none → translateX(100%) → translateX(-100%) → none` (50% / 50.1% / 100%) | `--bd-time-transition-350` (`350ms`) | `--ease-out` | hero arrow nudge |
| `header_translate-up` | `css/81c1c90410e66ab0__022de1c5.css` | `transform: translateY(1rem) → translateY(0)` | `--bd-time-transition-500` (`500ms`) | `--ease-out-soft` | nav link stagger entry (`100ms + N × 25ms` after `--bd-time-delay-initial`) |
| `noise_<hash>` | `css/81c1c90410e66ab0__022de1c5.css` | 11-step `translate3d` jitter within ±9rem | `--bd-time-transition-1000` (`1000ms`) | `steps(2)` `infinite` | full-viewport noise overlay, always running |

Per-section scoped duplicates use the same keyframe body but with
their own hash-suffixed name (e.g. `home-intro_fade-in__Z8lV3`,
`about-intro_push-arrow__QVNg9`) — these are CSS-module
locally-scoped copies emitted by the build pipeline. They share the
same easing / duration / behavior as the global versions.

### Section-by-section animation bindings

| Section | Animated property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `<header>` nav items (1–7) | `header_fade-in` + `header_translate-up` | `500ms` | `ease-out-soft` | mount, staggered `100ms + N × 25ms` after `--bd-time-delay-initial` (500ms) |
| `<header>` logo | `header_fade-in` + `header_translate-up` | `500ms` | `ease-out-soft` | mount |
| `<header>` menu button | `header_fade-in` + `header_translate-up` | `500ms` | `ease-out-soft` | mount; on mobile uses `--bd-time-delay-375` start |
| `main > section` | `fade-in` | `650ms` | `ease-out` | mount; `:first-of-type` is exception (no animation) |
| `.home-intro` video hitbox | `page-intro_fade-in` | `250ms` linear | linear | `--bd-time-delay-500 + --initial-animation-delay` after mount |
| `.home-overview` body | `home-overview_fade-in` | `650ms` | `ease-out` | `--bd-time-delay-500 + --initial-animation-delay` after mount |
| `.home-clients` row | `home-clients_fade-in` | `650ms` | `ease-out` | `--bd-time-delay-750 + --initial-animation-delay` |
| `.about-intro` heading + meta | `about-intro_fade-in` | `650ms` | `ease-out` | `--bd-time-delay-750 + --initial-animation-delay` |
| `.about-gallery` container | `about-gallery_fade-in` | `650ms` | `ease-out` | `--bd-time-delay-1000` |
| `.menu_menu__initiatives li` (1–7) | `header_fade-in` + `header_translate-up` | `500ms` | `ease-out-soft` | menu open; per-li `+25ms` stagger |
| `.carousel__cursor[data-active=true] .carousel__cursor__label span` | `translate-up-100` | `650ms` | `ease-garret` | cursor hover on slide |
| `.menu_menu[data-is-open=true]:after` | `transform: translateX(-100%)` | `1000ms` | `ease-in-out-hard` | menu open (desktop) |
| `.button-pill:not(:disabled):hover:before` | `transform: translate3d(0,100%,0) → 0` | `250ms` | `ease-out` | hover fill |
| `.carousel_progress__bar` | inline `transform: translateX(...)` driven by `requestAnimationFrame` | continuous | linear | scroll |
| `.video-player.seeker` | `transform: translateX(percentage)` | continuous | linear | drag |
| `.promise-next-page__fixed` | `transform: translate3d(...)` driven by `requestAnimationFrame` (lerp `getEased`) | continuous | linear | scroll, gated to scroll-progress 0 → 1 |

### Easing reference

All easings live in `:root` and are referenced everywhere:

```
--ease-out:        cubic-bezier(0.28, 0.44, 0.49, 1)
--ease-out-soft:   cubic-bezier(0.28, 0, 0.49, 1)
--ease-in-out-soft:cubic-bezier(0.72, 0, 0.28, 1)
--ease-in-out-hard:cubic-bezier(0.77, 0, 0.175, 1)
--ease-garret:     cubic-bezier(0.5, 0, 0, 1)
--bounce:          cubic-bezier(0.6, 0, 0.1, 1.4)
```

### Time tokens (`:root`)

```
--bd-time-transition-none: 0s
--bd-time-transition-100:  0.1s
--bd-time-transition-125:  0.13s
--bd-time-transition-150:  0.15s
--bd-time-transition-200:  0.2s
--bd-time-transition-250:  0.25s
--bd-time-transition-350:  0.35s
--bd-time-transition-500:  0.5s
--bd-time-transition-550:  0.55s
--bd-time-transition-650:  0.65s
--bd-time-transition-750:  0.75s
--bd-time-transition-1000: 1s
--bd-time-delay-none:      0s
--bd-time-delay-25:        0.03s
--bd-time-delay-100:       0.1s
--bd-time-delay-200:       0.2s
--bd-time-delay-250:       0.25s
--bd-time-delay-350:       0.35s
--bd-time-delay-375:       0.38s
--bd-time-delay-500:       0.5s
--bd-time-delay-600:       0.6s
--bd-time-delay-750:       0.75s
--bd-time-delay-1000:      1s
--bd-time-delay-initial:   0.5s
```

### Page transitions

- Next.js client-side routing: when the user clicks a link,
  `next/router.push(url)` is invoked. The `promise-next-page` module
  uses an extended `300vh` sticky section that tracks scroll progress
  via `IntersectionObserver`-driven `requestAnimationFrame`, lerped
  through a custom `getEased` function, then commits the navigation
  on `onTransitionEnd` (`transform` property name).
- The header reactively updates its `data-transparent` and `data-header`
  flags as the route changes — animations are not re-played after the
  initial mount.

---

## Assets

Inventory based on `tools/tmp/basicagency/playwright/manifest.json`
and the per-folder listings.

### 3D models

N/A — no `.glb`, `.gltf`, `.obj`, `.fbx`, or `.usdz` files in the dump.
The site is fully 2D; the only dynamic surface is the `<video>` poster
on the home intro.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| SctoGroteskA (Schibsted Grotesk A) | 300 (Regular), 400 (Medium), 700 (Bold) | woff2 (with `.woff` and `.ttf` fallback per `@font-face`) | `/_next/static/media/SctoGroteskA-Regular.1e986128.woff2`, `…-Medium.2ede3563.woff2`, `…-Bold.d6497298.woff2` (locally bundled from `tools/tmp/basicagency/playwright/fonts/`) | yes |

The CSS also lists `local("SctoGroteskA")` in the `src` chain before
the network reference. Three faces are loaded; no italic axis.

### Images (homepage + about only — full case-study set is much larger in production)

All extension-labeled `.png` and `.jpg` are actually **WebP** files
(`VP8 encoding`) per `file(1)` inspection. Dumped dimensions are
inferred from the filename suffix (e.g. `…-1000x734.png` → source
1000×734, served via Sanity CDN at multiple sizes).

| Local path (under `tools/tmp/basicagency/playwright/images/`) | Type | Dimensions | Size (bytes) | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `11a5f82ab2838edc5756c262023dcc3ffe0bd0b8-1000x734__d76f3491.png` | WebP (PNG-named) | 1000×734 | 41,706 | `https://cdn.sanity.io/images/8nn8fua5/production/11a5f82a…-1000x734.png` | homepage client logo / case-study thumb |
| `1e04aa777778cf8bd2395e66ee1e8b4d9b2e94a6-870x544__631c4212.png` | WebP | 870×544 | — | `…/1e04aa77…-870x544.png` | case-study |
| `1f72d719b320cc973839fabfd6cff390d3aac1c4-1000x734__09a59f6a.jpg` | WebP (JPG-named) | 1000×734 | — | `…/1f72d719…-1000x734.jpg` | blog thumbnail |
| `2f2e327658435e980e25d6bb34f667f5f5d544b2-1144x1430__66179055.png` | WebP | 1144×1430 | 30,124 | `…/2f2e3276…-1144x1430.png` | portrait |
| `2fa0bb6468d65193816cfe632e976afd191aada7-2000x1468__05890e19.jpg` | WebP | 2000×1468 | 35,536 | `…/2fa0bb64…-2000x1468.jpg` | landscape |
| `40ec6ffa532aea4fc483575b8ad14100bb6bf74c-870x544__35a4624e.png` | WebP | 870×544 | — | `…/40ec6ffa…-870x544.png` | case-study |
| `4a219fdabeed5ebc2fca05e0c6ba074368e7e2e1-630x788__30165356.jpg` | WebP | 630×788 | — | `…/4a219fda…-630x788.jpg` | blog |
| `4ceccaa859e480e1a9e719f33f7ca2ce8e8f5dd1-1000x734__8b199003.jpg` | WebP | 1000×734 | 62,640 | `…/4ceccaa8…-1000x734.jpg` | hero/spotlight |
| `65a33a8858e4e106ce69cab290b5e606a69eeac1-1144x1430__ff1282b2.png` | WebP | 1144×1430 | — | `…/65a33a88…-1144x1430.png` | portrait |
| `67dacc1466f1e32d10f1ac82053385d2c5823377-1144x1430__7d5c9c5f.png` | WebP | 1144×1430 | 31,104 | `…/67dacc14…-1144x1430.png` | portrait |
| `8063a6f5ea9626cf98e092b801987075cf7fbe75-1000x734__69dc3d34.jpg` | WebP | 1000×734 | — | `…/8063a6f5…-1000x734.jpg` | blog |
| `88289f3f3ff1a1832ffe4ae844db5ddd628d720d-1144x1430__b0568a76.png` | WebP | 1144×1430 | 48,772 | `…/88289f3f…-1144x1430.png` | portrait |
| `931c4de4f3cbbeb30a5b65677a174f2980e44805-720x900__e013bcbc.jpg` | WebP | 720×900 | 114,440 | `…/931c4de4…-720x900.jpg` | portrait |
| `e1ee6f1258bdc530b8843f97029f804856f72d61-2000x1468__ed28809e.jpg` | WebP | 2000×1468 | — | `…/e1ee6f12…-2000x1468.jpg` | landscape |
| `f1931ee572cd014ca5c3b5fe7e6054cfc0583624-720x900__6d8e4730.jpg` | WebP | 720×900 | 30,308 | `…/f1931ee5…-720x900.jpg` | portrait |
| `f6a1cfb399086412322d634d4603f4d26ab6b72b-1000x734__f83b0bda.png` | WebP | 1000×734 | 28,298 | `…/f6a1cfb3…-1000x734.png` | case-study (stone statues) |
| `insight_tag_errors__8e929256.gif` | GIF 89a, 1×1 | 1×1 | — | `…/insight_tag_errors__8e929256.gif` | Listrak tracking pixel |
| `noise.e8298e81__5d28b77c.png` | PNG RGBA, 100×100 | 100×100 | 23,342 | `/_next/static/media/noise.e8298e81.png` | full-bleed grain texture, tiled |

All other page imagery (blog posts, case studies, industries, services,
the about gallery, the spotlight, and most thumbnails) is loaded from
Sanity's image CDN with query-string sizes (`?w=720&w=1024&w=1280`)
and rendered through `<picture>` with `srcSet` derived from the
component's `sizes=[720, 1024]` / `[720, 1024, 1280]` props. Each asset
includes a `blurhash` and a base64 `lqip` placeholder.

### SVGs & icons

All `.svg` files in the dump are **WebP** (RIFF/WebP) when inspected
with `file(1)` — they are PNG/WebP client logos stored under the
`svgs/` folder:

| Local path | Type | Dimensions | Size | Source |
| --- | --- | --- | --- | --- |
| `tools/tmp/basicagency/playwright/svgs/09a68ec6d03469bfd5bbb9726a58225acb900ae2-128x42__cc005abf.svg` | WebP | 128×42 | — | `cdn.sanity.io/…/09a68ec6…svg` |
| `tools/tmp/basicagency/playwright/svgs/7121121ed910b145bdb6df487966a7888c2eb7c3-272x92__106949dd.svg` | WebP | 272×92 | — | client logo |
| `tools/tmp/basicagency/playwright/svgs/8dd2f090726c8d5befeaa2924b44678e69452945-1024x200__5e5a31c4.svg` | WebP | 1024×200 | — | client logo |
| `tools/tmp/basicagency/playwright/svgs/b2624b2d49d9c14eec0cd30203c5eec0331eac42-42x42__5975c0da.svg` | WebP | 42×42 | — | icon |
| `tools/tmp/basicagency/playwright/svgs/fbb650ce74c1849cb4da2d9951fad89149494cc9-171x42__13b06bf8.svg` | WebP | 171×42 | — | client logo (BASIC-style) |

**Inline SVGs in HTML/JSX:** the BASIC/DEPT® wordmark logo is rendered
inline (SVG `<path>`s) in the header, footer, and menu. The share
bundle (`tools/tmp/basicagency/playwright/js/142-b4ad18bfd2ee99ce__2aa76713.js`)
contains six inline SVG icons (Twitter, Facebook, LinkedIn, Pinterest,
Email, plus a `+` toggle `12×12`), plus a play/caret icon (`12×2`
viewBox) for the media-toggle inside share popovers. All icons are
defined with `viewBox` and `fill="currentcolor"` so they inherit text
color from their parent.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/basicagency/playwright/media/c6fb986a862cbe643c40cbdd0318ebc495efb187__fc8a82ef.mp4` | MP4 v2 (ISO 14496-14) | The home-intro "Watch Reel" video, served from Sanity. The home-intro module references `video.poster` (poster image) and `video.video.asset.url` (the MP4). Playback uses the custom `.video-player` with `cover:true`, `label:"Play"`, `caption:"BASIC/DEPT® 2010-∞"`, `brightCursor:true`. |

An `<audio>` element is also referenced from the `.promise-body`
module (`audio.asset.url`) — the Promise page quotes a founding
statement alongside an embedded audio player. Not in the static
asset list (rendered from Sanity at runtime).

---

## Motion & Interaction

### Principles

The motion system is built around a single, opinionated rule set:

- **Every** section element starts at `opacity: 0` and is animated in
  on mount or scroll-into-view via `fade-in` over `--bd-time-transition-650`
  (`650ms`) `cubic-bezier(0.28, 0.44, 0.49, 1)`.
- **Every** transition has a `--bd-time-delay-N` companion delay,
  and the per-element delay is composed as
  `var(--bd-time-delay-XXX) + var(--initial-animation-delay)` (the
  latter is `0.5s`).
- **Underlines** (`trace-in` / `trace-out`) are the universal
  "interactive" affordance — used in nav, footer, work filters,
  blog filters, and the promise detail nav.
- **Easings** are categorized in `--ease-*` and reused (see
  "Animations (Catalog) → Easing reference").
- A **grain texture** is overlaid on every page (`.noise` element)
  to soften digital edges and provide a unifying texture.

### Specific behaviors

- **Link hover:** trace underline (`translate3d(-101%,0,0) →
  translateZ(0)`, `250ms ease-out`). Active links use the same
  animation but with `0s` delay so the line appears pinned.
- **Button hover (pill):** the entire pill mask slides up from
  below (`translate3d(0,100%,0) → 0`, `250ms ease-out`), filling with
  the inverse color.
- **Header link stagger:** 7 nav items, each delayed
  `100ms + N × 25ms` after `--bd-time-delay-initial`. The logo and
  menu button animate on the same schedule (with the menu button
  shifted to `--bd-time-delay-375` start at >= 1024px).
- **Section reveal on scroll:** no JS — sections are wrapped in
  `main > section` and animated with the global `fade-in`; the
  per-section scoped copies all share `var(--initial-animation-delay)`.
- **Carousel drag:** JS-driven `requestAnimationFrame` updates
  `.carousel__progress__bar` transform continuously; the azalea cursor
  follows the pointer and shows the slide label.
- **Page transition:** `next/router` push, no exit animation; on the
  Promise section a 300vh sticky panel animates `transform: translate3d`
  driven by `getEased(scrollProgress)` over a `cubic-bezier(0.5, 0, 0, 1)`
  easing, then commits the route change on `onTransitionEnd`.
- **Menu open (desktop):** white panel slides in from the right via
  `translateX(100%) → 0` over `1s cubic-bezier(0.77, 0, 0.175, 1)`.
  Initiatives list items appear with the same per-li stagger as the
  header nav.
- **Logo take-over (initial paint):** the logo mask exits with
  `translate-up-100` (`500ms cubic-bezier(0.5,0,0,1)`) while the
  logo itself performs `translate-down-100` — a coordinated "slide
  past" effect that resolves to the rest of the page within 750ms.

### Reduced motion

Not observed in the CSS dump. No `prefers-reduced-motion` rules were
found in any of the 8 stylesheets. The site assumes motion is always
on; visitors needing reduced motion must rely on the accessiBe widget
or their OS-level setting.

---

## Content & Voice

- **Tone:** confident, plainspoken, occasionally witty. Trademark
  slogans (`Easy to understand. Impossible to ignore.™`) are used
  sparingly. First-person plural (`we`, `our`) is used for the
  Promise / DEI content.
- **Sentence length:** short to medium. Active voice throughout.
  Example tone (paraphrased from observed copy): "We help brands
  turn cultural value into company value."
- **Capitalization:** UPPERCASE for headings (most H1/H2/H5), nav
  links, labels, meta bars, and footer column titles. Sentence case
  in body paragraphs and quotes.
- **Punctuation:** Oxford comma yes. Em-dashes present in dates
  (`BASIC/DEPT®, Inc 10 – 2026`). The bullet glyph `●` is used as a
  visual bullet but also occasionally as a substitute for the word
  "and" or a separator.
- **CTA vocabulary:** "Watch Reel", "View Case Study", "View next",
  "Visit the Site", "Explore Applied", "Explore Brandbeats",
  "Read More" (rare), "Submit" (contact form), "Want to work with
  us?" (footer link).
- **Trademarks:** every appearance of `BASIC/DEPT®` is followed by
  the registered mark. `Easy to understand. Impossible to ignore.™`
  is the tagline. `B/D® JAMS`, `Applied®`, `Moves®`, `Crafted®`,
  `Brandbeats®` are all ®-marked initiatives.
- **Numbers / punctuation rules:** Numbers rendered as superscript-style
  ordinals via CSS counters (e.g. `(01/03)`, `01`, `02` for
  carousel indices and awards lists).
- **The brand's pronouns:** the brand refers to itself as
  `BASIC/DEPT®` in formal copy, "BASIC" in marketing sentences, and
  "B/D®" in event branding.

---

## Information Architecture

The site ships the following routes (all Next.js Pages-Router
filenames confirmed in the dump):

- `/` — **Homepage.** `homeIntro` (video reel) → `homeOverview`
  ("Strategy, Design, Technology") → `homeCaseStudies` (horizontal
  carousel) → `homeClients` ("Featured Engagements") → `homeSpotlight`
  (Adweek pull-quote) → `homeListBlogFeatured` ("Featured News").
- `/services` — **Work / Services index.** Lists capabilities
  (Strategy, Brand Experience, Digital Experience, Content,
  Technology). Module types: `workIntro`, `pageListServices`,
  `workServicePage`.
- `/about` — **About.** `aboutIntro` (h1: "We turn cultural value ●
  into company value") → `aboutGallery` (4-image collage with
  CSS-countered numbered captions) → `aboutGridResults`
  ("Agency Snapshot" — 6 numbered stats) → `aboutGridBody`
  ("Capabilities") → `aboutListAwards` (interactive list with
  image takeover on hover) → `aboutGridTeam` (member cards with
  images).
- `/blog` — **News.** Filterable list with `pageListBlogFilter`
  (categories as `.button-radio` toggles) and `homeListBlogFeatured`
  carousel. Posts have a `homeNewsItem` module that renders a meta
  bar with date and a vertical image.
- `/blog/[slug]` — **News detail.** `detailIntro` + `detailHtml` +
  `detailMedia` + `detailPress`.
- `/thinking` — **Thinking (long-form essays).** Mirrors `/blog`
  structure but with `pageListThinkingFilter`.
- `/careers` — **Careers.** Department listings.
- `/contact` — **Contact.** `contactIntro` (Easy to understand
  tagline + asset + Chicago / SF / SD offices) → `contactGridOffices`
  (3-column grid with live local times) → `contactNewsletter`.
- `/case-studies/[slug]` — **Case study detail.** Includes
  `pageChapterTitle`, `pageIntro` (video or image with custom
  cursor), `pageMedia`, `pageResults`, `pageContactForm`.
- `/a-basic-promise` and `/our-actions` and `/project-updates` —
  **BIPOC Promise hub.** `promiseIntroLanding`, `promiseGridBody`,
  `promiseResults` (infographic with circular avatars), `promiseListBlogFeatured`,
  `promiseNextPage`.
- `/privacy-policy` — Legal page.

The global navigation (`navigation.pages`) exposes the top six: **Work,
About, News, Thinking, Careers, Contact** — the menu panel additionally
shows five numbered "initiatives" cards: **B/D® JAMS** ("It's a vibe"),
**Applied®** ("Thoughts & Perspectives"), **Moves®** ("Our New HQ"),
**Crafted®** ("Creative Community"), **Brandbeats®** ("Podcast Series").

---

## Accessibility

- **Color contrast:** primary text `#252422` on background `#F4F4F4`
  computes to ~`14.4:1` (well above WCAG AAA). White text on tuatara
  `#252422` is also ~`14.4:1`. Pink `#F9CDCD` is used at very large
  sizes and only as decoration, never for body copy.
- **Focus indicators:** the design system **removes** the browser
  outline (`button:focus, input:focus { outline: none }`) and instead
  uses color-inversion (`a:hover, button:hover` flips to inverse
  background-color). This is **suboptimal for keyboard users** — the
  trace-underline hover and pill-slide animations provide some
  focus-equivalent affordance but a focus-only state is not always
  visible. (`a:focus-visible` rules DO define an underline trace, but
  not a ring.) The accessiBe overlay is the de-facto a11y rescue.
- **Keyboard:** all interactive elements are reachable in source
  order. Modal close buttons are real `<button>` elements. Forms use
  `<label>` wrappers around inputs. No skip-link was observed in the
  rendered HTML.
- **Screen reader landmarks:** `<header>`, `<main>`, `<footer
  role="contentinfo">`, and two `<nav role="navigation">` (one with
  `aria-label="primary"`) are all present. The `<main>` carries
  `data-uri` and a class hash (`jsx-2547979358`).
- **Motion:** **no** `prefers-reduced-motion` handling was found in
  any of the eight stylesheets. The noise overlay also runs
  unconditionally.
- **Alt text:** the Sanity image schema requires `alt` strings on
  every asset (`asset.alt` field observed in the JSON dump). Observed
  alt values in the homepage data include `"Person eating ice cream"`
  and `"Cropped image of stone statues"` — descriptive and meaningful.
- **Icons:** all decorative icons are inline SVG and marked
  `aria-hidden="true"` where applicable. The `+`/`-` toggle inside
  the share widget uses a real `<button role="button">` with an
  `aria-hidden` `<span>` for the icon.

---

## Sources

URLs actually observed during the dump:

- `https://basicagency.com/` — landing (homeIntro, homeOverview,
  homeCaseStudies, homeClients, homeSpotlight, homeListBlogFeatured)
- `https://basicagency.com/about` — about page
- `https://basicagency.com/services` — work/services index
- `https://basicagency.com/blog` — news listing
- `https://basicagency.com/thinking` — thinking listing
- `https://basicagency.com/careers` — careers
- `https://basicagency.com/contact` — contact (3 offices, newsletter)
- `https://basicagency.com/case-studies/patagonia-ecommerce-website` —
  Patagonia case study (in `playwright/other/`)
- `https://basicagency.com/case-studies/wilson` — Wilson case study
- `https://basicagency.com/case-studies/google-ecommerce-web-design` —
  Google Store case study
- `https://basicagency.com/blog/four-nominations-for-the-internets-highest-honor` —
  blog post
- `https://basicagency.com/privacy-policy` — privacy policy
- `https://www.googletagmanager.com/gtag/js?id=AW-10775445431` — Google
  Ads conversion tag
- `https://www.googletagmanager.com/gtag/js?id=G-V2WMRJYJMH` — GA4 tag
- `https://cdn.sanity.io/images/8nn8fua5/production/…` — Sanity image
  CDN (asset paths inlined in `__NEXT_DATA__`)
- `/_next/static/media/SctoGroteskA-{Regular,Medium,Bold}.{hash}.woff2`
  — bundled font files (3 faces)
- `/_next/static/media/noise.e8298e81.png` — full-bleed grain texture
- `/_next/static/chunks/framework-2f1a8e17e74f15d6.js` — React/Next
  framework bundle
- `/_next/static/chunks/pages/_app-914905e04b225f99.js` — Next.js
  `_app` chunk
- `/_next/static/chunks/main-d6ff1c9309a432d9.js` — Next.js main chunk
- `/_next/static/chunks/webpack-8d528aca91b4dc0a.js` — Next.js webpack
  runtime
- `/_next/static/chunks/pages/[slug]-bc1400c01857c2da.js` and
  `case-studies/[slug]-a1e0c6710613db04.js` and
  `blog/[slug]-6c928392ee67ec66.js` and
  `about-88f0aa10dbddbb75.js` and
  `careers-3e49c5d411d6bf50.js` and
  `privacy-policy-b0f5b07a04d315f7.js` — per-route bundles

---

## Changelog

- 2026-06-20 — Initial draft by design.md_gen. Static-pass HTML
  was empty (Cloudflare JS challenge); all visual evidence was
  reconstructed from the Playwright dynamic pass
  (`tools/tmp/basicagency/playwright/`).
