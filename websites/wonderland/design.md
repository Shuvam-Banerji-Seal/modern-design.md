# WONDERLAND — design.md

> A structured design specification of **https://wonderland.studio**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/wonderland/` (gitignored)

---

## Overview

WONDERLAND is the public website of **Wonderland**, an Amsterdam-based brand
and digital studio whose pitch is "creating meaningful value for people and
the planet." The home page is a single-screen, full-bleed WebGL experience:
a Three.js scene of projects floating on a tan "earth" arch, scroll-driven
camera push, and a vertical carousel that loops through ten featured works.
Everything else (nav, footer, contact modal, cookie banner) sits on top of
the canvas with `mix-blend-mode: exclusion` so it stays legible over the
moving artwork.

The site reads as a confident, design-led portfolio for a small studio: the
type system pairs a display grotesk (`Lay Grotesk`) with a serif accent
(`Serifbabe Alpha Trial`) and a quieter prose face (`NB International Pro`)
for body text. Color is restrained — warm off-white on near-black by default,
flipping to warm cream on inverted sections (`#ECE4DA`).

**Category:** Marketing / Studio portfolio / Design tool (creative agency)
**Primary surface observed:** Homepage (`/`) with full WebGL experience, plus
about, works, culture, ideas, manifesto, talent-program, privacy, terms,
contact (modal).
**Tone:** Confident, restrained, design-literate; uppercase headings, all-caps
nav labels (HOME / WORK / ABOUT US / BEING HERE / MANIFESTO / IDEAS /
CONTACT). Sentence-case body copy.
**Framework detected (if any):** Nuxt 2 SPA (Vue 2, Vuex 2, vue-router 3).
Webpack-bundled. SSR + hydration (`data-n-head-ssr` attributes, `<script
charset="utf-8" src="/_nuxt/static/1738522044/...">` chunked payloads).
Static-asset URL prefix `/static/1738522044/` (build hash).

---

## Visual Language

### Color

The palette is two-tone warm with a single saturated accent (orange). Every
color is exposed as a CSS utility class (`.color--black900`, `.color--orange700`,
etc.) so editors can apply them in DatoCMS-driven content.

| Role | Token / class | Value | Closest name | Notes |
| --- | --- | --- | --- | --- |
| Background (base, dark) | body | `#1A191B` | near-black, slight purple | default page background |
| Background (light, inverted) | `.scroller.invertColor`, `body.invert-color` | `#ECE4DA` | pale cream / eggshell | footer, terms, privacy |
| Background (elevated) | `.color--white500` | `#F7EFE6` | paper | contact cards, button label bg |
| Background (subtle) | `.color--white300` | `#FFFBF5` | off-white | |
| Text (primary, dark mode) | body, nav | `#DED6CB` | warm bone | default text on `#1A191B` |
| Text (secondary, dark mode) | `.color--black500` | `#484749` | warm gray | muted text, logo path |
| Text (primary, light mode) | `.color--black900` | `#1A191B` | near-black | text on cream sections |
| Text (muted) | `.color--black700` | `#2F2E31` | deep charcoal | |
| Text (subdued) | `.color--black300` | `#5E5C60` | warm gray | |
| Accent (primary orange) | `.color--orange900`, btn | `#EC6437` | burnt orange | CTAs, logo loader % |
| Accent (hover orange) | `.color--orange700` | `#F86430` | bright orange | focus/hover on dark |
| Accent (selection) | `::selection` | `#FF7D50` | warm coral | text selection bg |
| Accent (light hover) | `.color--orange300` | `#F59371` | peach | back-arrow hover, .isMobilePanel first-child |
| White700 | `.color--white700` | `#ECE4DA` | eggshell | secondary cream |
| White900 | `.color--white900` | `#DED6CB` | bone | primary on-dark |
| Border | `.footer .page-link` rule, button ring | `#DED6CB` | bone | 1px hairline borders |
| Progress bar | `.progress .inner` | `#FFFFFF` | white | on `#000` bar, page transition |
| Progress bar bg | `.progress` | `#000000` | black | |
| Loading overlay | `.loading-overlay` | `#1A191B` | near-black | |
| Purple (used in 2-variant button) | `.button:hover.isBig.noColor .inner` | `#33293A` | deep aubergine | alternate hover bg |
| Green (success, button.point final) | `@keyframes pulse-data-v-2e1defa2` | `#5FE32D` | electric green | pulse animation end |
| Lavender (success, button.point final) | `@keyframes pulse-data-v-2e1defa2` | `#BB96DE` | soft lavender | alternate final color |
| Image placeholder bg | `.smart-image.bkg .aspect-ratio` | `#FF7D50` | warm coral | |
| Selection (light mode) | `.heading-email .text::selection` | `transparent` | — | |
| Loading overlay 85% | `.artwork:after`, `.scroller:after` | `rgba(0,0,0,0.85)` | black 85% | dark overlay |
| Cookie banner text | — | `#1A191B` | near-black | on cream cookie banner |
| Cookie banner bg | `.cookie` | `#ECE4DA` | eggshell | |
| Footer / heading-email link | `.heading-email .title[data-v-0c77ad74]` | `#1A191B` | near-black | |
| `body ::selection` | selection | `#FF7D50` bg, `#1A191B` fg | warm coral / near-black | |
| Header letter at low alpha | — | `rgba(15,15,15,0.05)` ≈ `#0F0F0F0D` | barely-there black | box-shadow base |

There is **no dark-mode toggle**. Inversion is per-section: `body.invert-color`
and `.scroller.invertColor` swap body background to `#ECE4DA` and text to
`#1A191B`, with a 0.5s ease transition. This is observed on `/terms`,
`/privacy`, and inside the footer on every page.

### Typography

Three families, all self-hosted as `.woff2` under `/fonts/`. The page root
declares `html { font-size: 2.0833333333vw; line-height: 1.2; letter-spacing:
0.01em; }`, so every length below is vw-relative on a 1440-wide reference.
At any other width, recompute `vw` literally: `1vw ≈ 1% of viewport width`.

| Role | Family | Weight | Size (vw) | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Display (h1) | `"Lay Grotesk"` | 400 | `4.0278vw` (58px @ 1440) | `100%` (`1.0`) | `-0.01em` | uppercase; pairing with `strong` swaps in Serifbabe |
| `.display` (used in works page) | `"Lay Grotesk"` | 500 | `6.1111vw` | `100%` | `-0.02em` | oversized intro |
| h1Serif | `"Serifbabe Alpha Trial"` | 400 | `4.0278vw` | `100%` | `-0.01em` | uppercase accent inside h1 |
| h2 | `"Lay Grotesk"` | 500 | `2.9167vw` | `110%` | `0` | uppercase |
| h2Serif | `"Serifbabe Alpha Trial"` | 400 | `2.9167vw` | `110%` | `-0.01em` | uppercase |
| h3 | `"Lay Grotesk"` | 500 | `2.2222vw` | `130%` | `0` | uppercase |
| h3Serif | `"Serifbabe Alpha Trial"` | 400 | `2.2222vw` | `130%` | `0` | uppercase |
| h4 | `"Lay Grotesk"` | 500 | `2.6389vw` | `130%` | `0` | capitalize (sentence case) |
| h4Serif | `"Serifbabe Alpha Trial"` | 400 | `2.6389vw` | `130%` | `0` | uppercase |
| h5 (label / button) | `"Lay Grotesk"` | 600 | `0.9722vw` | `120%` | `0.04em` | uppercase |
| h6 (eyebrow) | `"Lay Grotesk"` | 500 | `0.7639vw` | `120%` | `0.08em` | uppercase |
| h7 (smallest label) | `"Lay Grotesk"` | 500 | `0.625vw` | `120%` | `0.08em` | uppercase |
| body-xl (lead) | `"Lay Grotesk"` | 500 | `2.5694vw` | `118%` | `0` | |
| body-l | `"Lay Grotesk"` | 500 | `1.5278vw` | `148%` | `0` | |
| body-m | `NBInternationalPro` | 300 | `1.25vw` | `160%` | `0` | used for cookie text, footer email blocks |
| body-6 | `NBInternationalPro` | 300 | `1.1111vw` | `150%` | `0.01em` | |
| `.tdivider` | `"Lay Grotesk"` | 600 | `0.6944vw` | `197%` | `0` | uppercase; footer credits, page links |
| `.tbutton` | `"Lay Grotesk"` | 400 | `0.7736vw` | `120%` | `0.08em` | uppercase button label |
| Button (default tag) | `"Lay Grotesk"` | 400 | `0.7736vw` | `120%` | `0.08em` | uppercase |
| Nav link number | `"Lay Grotesk"` | 500 | `0.5556vw` | `20.02px` | `0.88px` (≈ 0.08em) | uppercase |
| Anchor point (sub-nav) | `"Lay Grotesk"` | 500 | `0.5556vw` | `20.02px` | `0.88px` | uppercase |

Stack examples:

- Display: `"Lay Grotesk", "Serifbabe Alpha Trial", NBInternationalPro, sans-serif`
  (the `<strong>` inside `.heading` swaps the active face to Serifbabe.)
- Body serif fallback: `NBInternationalPro, -apple-system, sans-serif`
- Mono / code: not observed.

Mobile overrides (≤ 1000px) recompute almost every size:

| Role | Desktop vw | Mobile (px-equivalent) |
| --- | --- | --- |
| h1 | `4.0278vw` | `6.9333vw` |
| h2 | `2.9167vw` | `6.4vw` |
| h3 | `2.2222vw` | `4.8vw` (line-height 110%) |
| h4 | `2.6389vw` | `6.4vw` |
| h5 | `0.9722vw` | `3.2vw` |
| h6 | `0.7639vw` | `2.9333vw` |
| h7 | `0.625vw` | `2.1333vw` |
| body-xl | `2.5694vw` | `5.8667vw` (line-height 130%) |
| body-l | `1.5278vw` | `4.8vw` (line-height 140%) |
| body-m | `1.25vw` | `4.2667vw` |
| body-6 | `1.1111vw` | `2.6667vw` |
| tdivider | `0.6944vw` | `2.4vw` (line-height 100%) |
| tbutton | `0.7736vw` | `2.9707vw` |

The h1 in `<scroller>` is visually clipped (`clip: rect(1px,1px,1px,1px)`)
because the same title lives on the page DOM for SEO; the visible heading
is rendered inside the WebGL shader / `.heading` strong element.

### Spacing & radius

- **Base unit:** 8px (assumed; vw values cluster around multiples of 0.694vw
  = 10px @ 1440, 0.555vw = 8px @ 1440, 0.208vw = 3px @ 1440).
- **Scale (in vw @ 1440 wide):** `0.208 / 0.347 / 0.486 / 0.555 / 0.694 /
  0.833 / 1.25 / 1.66 / 2.08 / 2.43 / 2.91 / 3.54 / 4.27 / 5.33 / 6.4 / 8.0 /
  8.95 / 10.67 / 12.8`.
- **Radii:**
  - XS: `0.2778vw` (~4px) — anchor point
  - SM: `0.6944vw` (~10px) — buttons (isBig), contact-modal inner, .right
    .right-content, .inner (default btn), .left
  - MD: `0.8333vw` (~12px) — back-arrow ring, .container ring, .filters ring
  - LG: `2.0833vw` (~30px) — buttons (noColor, default), .right
    .right-content mobile, footer buttons
  - XL: `2.6667vw` (~38px) — buttons mobile isBig, contact-modal mobile,
    .right .right-content mobile, .button.isBig mobile
  - XXL: `3.2vw` (~46px) — back-arrow ring mobile, container ring mobile
  - XXXL: `7.4667vw` (~108px) — .container ring mobile
  - Round: `8vw` — buttons (noColor mobile)
  - Circle: `50%` — anchor-point, button .point, .close-button

- **Shadows:**
  - Tally embed: `box-shadow: 0 0 0 1px #0F0F0F0D, 0 3px 6px #0F0F0F1A, 0
    9px 24px #0F0F0F33` (3-stop layered).
  - No other meaningful shadows observed — the design relies on background
    contrast and 1px hairlines rather than elevation.

### Iconography

- **Style:** mostly inline SVG, no stroke-only icon font. Two icon shapes
  observed: the brand wordmark (custom letterforms cut as `<path>` inside
  `<svg viewBox="0 0 180 15">`) and the back arrow (`<svg width="11"
  height="10" viewBox="0 0 11 10">`).
- **Library:** none detected. Every icon is custom inline SVG (the back
  arrow, the SvgCross component, the social icons in `ContactModal`).
- **Default size:** 11×10px (back arrow inline), 20×20px (CSS default for
  `svg` selectors in Tally embed, with 1.618s spin animation), `1.25vw` /
  `1.3889vw` for cross / social icons.
- **Favicon:** data-URI PNGs for 16, 32, 96, 192 px. The browser tab icon
  is animated at runtime by a JS sprite class (`ro`) that swaps
  `/sprites/favicon-sprite.png` frames every 1s through a 32×32 canvas,
  rewrites the favicon `href` for each frame.

---

## Layout & Grid

- **Page root sizing:** `html { font-size: 2.0833333333vw }` — every length
  in the page is vw-relative to viewport width.
- **Page gutter:** `padding: 2.0833vw` on nav, `2.4306vw` on footer bottom,
  `1.3889vw / 2.7778vw` on cookie banner. Contact-modal inner card
  `0.2083vw` top, `1.7361vw` desktop / `10.6667vw` mobile side.
- **Max content width:** none declared in CSS; the layout is fluid.
- **Breakpoints:** a single breakpoint at `1000px` for almost everything,
  plus `height <= 1000px` for popup max-height. The Vue plugin `vue-mq`
  exposes `sm: 750`, `md: 1000`, `lg: Infinity` to templates, defaulting
  to `lg`. Components observe `$mq` and adapt the WebGL experience vs the
  Swiper fallback accordingly.
- **Vertical rhythm:** ad-hoc; no consistent baseline. Container `.top` in
  footer uses `padding-left: 10.7639vw` to align the heading column with
  the nav's padding.

The home page layout (top-to-bottom on initial paint):

1. **Full-viewport WebGL canvas** (`<section class="artwork">` containing
   `<canvas>`). Behind everything (`z-index: 0`).
2. **Floating "Scroll to discover"** label centered horizontally near the
   bottom (`bottom: 5.4167vw` desktop, `20.8vw` mobile). 12px `Lay
   Grotesk` 400, uppercase, `0.02em` tracking. Pulsing opacity via
   `discover-pulse-data-v-6b0ee5e6 2s ease 2s 3 forwards`.
3. **Fixed nav** (`<nav class="nav h6 show">`) pinned to top, full width,
   `2.0833vw` padding, `z-index: 1000`. Uses `mix-blend-mode: exclusion`
   so the cream `#DED6CB` text inverts against whatever canvas color is
   behind it.
4. **Scroll-driven "scroller" wrapper** (`<div class="scroller
   noscroll">`) at `position: fixed; inset: 0`. Contains the page route
   view (initially the hidden SEO `<h1>WONDERLAND | Brand Experience
   Design Studio</h1>`) and the footer.
5. **Cookie banner** (`<aside class="cookie show">`) fixed bottom-right,
   `1.3889vw / 2.7778vw` padding, `z-index: 10000`.
6. **Contact modal** (`<aside class="contact-modal">`), fixed full-viewport
   overlay, `z-index: 10000`, slides down from `-110%` translateY on show.
7. **Loading overlay** (`<div class="loading-overlay">`) covers screen at
   `z-index: 900` with `#1A191B` until `websiteLoaded` resolves.

Reference the **Components** chapter for nav, footer, modal, button.

---

## Components

### Nav (top bar)

- **Position:** fixed, full width, top: 0, `z-index: 1000`, `mix-blend-mode:
  exclusion`.
- **Padding:** `2.2222vw 2.0833vw` (mobile: `6.4vw`).
- **Anatomy (left → right):** "back" link (only on non-home routes) →
  centered wordmark logo → list of route links with numbered index →
  hamburger button → (optional) filter row.
- **Visibility:** starts `opacity:0; visibility:hidden`; receives `.show`
  class after first paint (`.17s linear` transition).
- **Back link:** inline SVG arrow 11×10 + uppercase "BACK" label, 13px
  `Lay Grotesk` 500, `0.88px` tracking, hover shifts arrow left by 35%
  (`transform: translateX(-35%)`, `0.7s cubic-bezier(.19,1,.22,1)`).
- **Logo:** SVG wordmark `viewBox="0 0 180 15"` rendered at desktop
  `12.5vw × 1.0417vw` (mobile `48vw × 4vw`), `margin-bottom: 1.6667vw`.
  Path fills are `fill="#DED6CB"` — they ride on `mix-blend-mode: exclusion`
  to invert over any background.
- **Nav links:** list items with `<span class="number">1</span>` and
  `<span class="title">voxy</span>`. Each link `.container` is wrapped in
  a `::before` hairline ring (`border: 1px solid #DED6CB`, radius
  `0.8333vw`, opacity 0 → 1 on hover/active).
- **Anchor sub-nav (under each link):** absolute-positioned panel that
  expands from `max-height: 0` to `110px` (1s `cubic-bezier(.19,1,.22,1)`).
  Anchors fade in with 50ms stagger (`.25s, .3s, .35s, …`).
- **Anchor point:** `0.2778vw` circle `bg: #DED6CB`, hover/active scales
  0 → 1 over `0.7s cubic-bezier(.19,1,.22,1)`.
- **Burger button (right):** three stacked lines that animate to an X via
  `burger-to-cross-1-data-v-37161225` and `burger-to-cross-2-data-v-37161225`
  keyframes (`translateY(0) → translateY(±4px) → translateY(±4px) rotate(±45deg)`).
- **Reveal transitions:** `fade-out-enter-active 0.25s linear 0.5s` for
  outgoing nav, `fade-in-enter-active 0.25s linear 0.8s` for incoming.

### Footer

- **Position:** inside `.scroller`, after the route content.
- **Background:** `#ECE4DA` (default) / `#1A191B` (when
  `.footer.invertColor`).
- **Padding:** `8.9583vw 0 2.4306vw` (mobile `21.3333vw 0 4.2667vw`).
- **Top section (`.top`):** huge H1 (`font-size: 4.0278vw`) wrapping a
  per-word `<span class="word-anim"><span class="word-anim-inner">`
  pair. Strong accent words (`We collaborate with ambitious brands and
  fearless founders to build memorable experiences.`) use `Serifbabe Alpha
  Trial` instead of Lay Grotesk. Reveal: words start with
  `transform: rotateY(-60deg)` and slide in (1.6s `cubic-bezier(.165,.84,.44,1)`).
  The whole H1 starts at `transform: translate3d(0, 90px, 0)` and animates
  to `0` as the footer scrolls into view.
- **Heading columns (`.content .column.heading-email`):** 5 columns each
  `width: 24.3056vw` desktop (`100%` mobile), `margin-bottom: 3.5417vw`.
  Each has a `.title.h5` label ("GENERAL QUESTIONS", "BECOME A
  WONDERLANDER", "OUR NEWSLETTER", "CONTACT") and either a `.text.body-m`
  email block or an `<input type="email">` form.
- **Copy-email interaction:** clicking a column toggles `.copied` class;
  the label collapses (`title-span translateY(-100%)`, `title-copy
  translateY(0)`, `title-copied translateY(0)`) with 1s
  `cubic-bezier(.19,1,.22,1)` and 0.5s linear transitions.
- **Newsletter send state:** `isSending` triggers `load-data-v-0c77ad74`
  keyframe on a 1px-tall `::after` bar (`width: 0 → 100% → 0`,
  `2s cubic-bezier(.455,.03,.515,.955) infinite`).
- **Address column:** `Vinkenstraat 119 / 1013JN Amsterdam /
  hello@wonderland.studio` (`body-m`, opacity 0.5).
- **Socials column:** `<ul>` of Instagram, Dribbble, LinkedIn, Substack
  links (each `<a target="_blank">`, opacity 1 → 0.5 on hover, `0.17s linear`).
- **Bottom strip (`.bottom`):** flex row with `.credits` ("16—24 ©
  wonderland expect the unexpected", opacity 0.5) on the left and
  `.pages` (column of `.page-link` a tags, color `#1A191B`, hover
  `#FF7D50`, `0.625vw` left margin) on the right.

### Button

- **Variants (`:isBlack | :isBig | :noColor`):** different inner colors,
  sizes, and animations.
- **Default anatomy:**
  - Outer `<button class="button">` (or anchor): `padding:
    0.5333vw 0 0.8vw`, `position: absolute; top: 0; right: 0` inside
    `.nav`, `display: flex; align-items: center`, transition
    `opacity .5s ease, background .5s ease, color .5s ease, visibility
    .5s ease`.
  - Inner `.inner.tbutton`: `background-color: #EC6437`, color
    `#F7EFE6`, `padding: 8px 16px`, `border-radius: 30px`, `font: 600
    Lay Grotesk 11.14px / 13.368px / 0.8912px tracking` (mobile bumps
    to `padding 0.5rem 1rem` equivalents in vw).
  - `.point`: `0.5556vw` circle, `bg: #F7EFE6`, `border-radius: 50%`,
    `margin-right: 0.5vw`. Pulses on hover via `pulse-data-v-2e1defa2`
    keyframe.
- **Variants:**
  - `isBig` — full-width pill, height `4.5139vw` (mobile `12.8vw`),
    radius `0.6944vw` (mobile `2.6667vw`), font `Lay Grotesk 2.9333vw /
    0.08em / uppercase` on mobile. White pill background, no point dot.
  - `isBlack` — orange inner becomes `#1A191B / #33293A` (purple-tinted
    black) on hover, text flips to `#EC6437 / #DFD6CB`. Point animates
    `pulse-data-v-2e1defa2 .7s cubic-bezier(.19,1,.22,1) forwards`.
  - `noColor` — transparent inner (`border-radius: 0.8333vw` ring via
    `::before` mask). Hover swaps to `#1A191B` bg / `#DED6CB` text.
- **States:**
  - default: orange pill
  - hover: color shift + point scale animation
  - active (`:active`): inherits hover
  - focus (`button:focus`): explicitly `outline: 0` (relies on visible
    hover/active instead — see Accessibility)
  - disabled (`button:disabled`): `opacity: 0.5; pointer-events: none`
- **Cookie variant (`is-cookie`):** the OK button inside the cookie
  banner uses the default button but starts `opacity: 0`, fading in over
  1s linear once the cookie banner shows.

### Loading overlay & loader

- **Overlay:** fixed full-screen `background-color: #1A191B`, `z-index:
  900`. The DOM has it as a sibling to `<main>` and is shown until
  `websiteLoaded` becomes true.
- **Loader percent** (`.loader.color--orange900`): 11px `Lay Grotesk`
  500, `0.88px` tracking, color `#EC6437`, hidden by default. When
  visible, the percentage digit pulses via
  `pulse-infinite-data-v-37161225 1s linear infinite`.

### Cookie banner

- **Position:** fixed bottom-right, `padding: 1.3889vw 2.7778vw`
  (mobile `4vw 5.3333vw`), `z-index: 10000`, bg `#ECE4DA`, color
  `#1A191B`, `bottom: 1.3889vw / right: 2.7778vw`.
- **Body:** one-line `<p>This website uses cookies.</p>` in `body-m`
  (`NBInternationalPro` 18px / 28.8px / 0.3px tracking).
- **CTA:** OK button (default orange variant). Stores
  `localStorage["cookie-accept"] = "true"` and initializes Google Tag
  Manager.

### Contact modal

- **Position:** `position: fixed; top: 0.2083vw; left: 50%`, full
  viewport (`100vw × 100vh`), `z-index: 10000`. Hidden via
  `transform: translateX(-50%) translateY(-110%) translateZ(0)`,
  `opacity: 0`, with `transition: transform 0s cubic-bezier(.19,1,.22,1)
  1.2s, opacity .5s linear 0s`.
- **Show animation:** `.contact-modal.show .inner` sets
  `opacity: 1; transform: translateX(-50%) translateZ(0)`, transition
  `transform 1.2s cubic-bezier(.19,1,.22,1), opacity .3s linear` (mobile:
  `opacity .2s linear .3s`).
- **Layout (`.container`):** flex row `width: 71.5972vw` (mobile 100%),
  `gap: 0.2083vw` (mobile `2.1333vw`), `justify-content: flex-end`.
- **Left panel (`.left`):** `width: 34.7917vw` desktop (mobile hidden),
  bg `#ECE4DA`, `border-radius: 0.6944vw`, contains a looping muted
  autoplay `<video>`.
- **Right panel (`.right`):** `width: 36.5972vw` desktop (mobile 100%),
  bg `#ECE4DA`, padding `1.7361vw 3.1944vw` (mobile
  `10.6667vw 6.9333vw 4.2667vw`), `border-radius: 0.6944vw`.
- **Right title:** `font-size: 5.8667vw` (desktop `2.5vw`), `line-height
  110%`, `font-weight 500`, `text-transform: none` (sentence case).
  Last line is split by `SplitText` (GSAP) into lines; the very last
  word is replaced with an animated `<span class="contact-words">` that
  cycles through "Vriend / Przyjaciel / Mate / Chom / Kompis / Kaveri /
  Ami / Amigo" (translations of "friend") at 0.5s delay via
  `gsap.timeline.fromTo` with `ease: "expo.out", duration: 1.4`.
- **Email list:** repeats the `.heading-email` pattern from the footer.
- **Socials:** row of `<a class="social"><img class="social-icon"
  src="..."/></a>`, `width: 1.3889vw` (mobile `5.3333vw`), hover
  opacity 1 → 0.5 (`0.17s linear`).
- **Close button (`.close-button`):** absolute `circle` of `bg #ECE4DA`,
  `width: 3.5417vw` (mobile `9.6vw`), positioned `left: 34.8611vw` (mobile
  `top: 2.1333vw; right: 8.5333vw`), contains `<SvgCross>` component. Hover
  rotates `transform: rotate(90deg)` over `1s cubic-bezier(.19,1,.22,1)`.
- **Buttons row:** `display: flex; gap: 0.2083vw`, full-width
  `isBig noColor` buttons.

### Heading / `.heading strong`

- **Anatomy:** a wrapping `<h1 class="heading h1 isFooter">` containing
  alternating inline-block `<span class="word-anim"><span
  class="word-anim-inner">word</span></span>` pairs separated by `<br>`.
- **Strong accent words** are rendered with `<strong>` which inherits
  `font-family: "Serifbabe Alpha Trial"; font-size: 4.0278vw; line-height:
  80%; display: inline; perspective: 1000px; transform: translateZ(0);
  backface-visibility: hidden`.
- **Default state:** `opacity: 0; transform: translate3d(0, 90px, 0)`.
- **Reveal:** JS swaps to `.show` class (Vuex `setOverlay`), animating
  opacity 0 → 1 over `0.17s linear` and translateY 90px → 0 over `1.8s
  cubic-bezier(.19,1,.22,1)`.
- **word-anim-inner** with `will-change: transform` starts at
  `rotateY(-60deg)` and rotates to `rotateY(0)` when `.start-rotate`
  added (`1.6s cubic-bezier(.165,.84,.44,1)`).

### Form input (`.heading-email .input`)

- **Anatomy:** `<input type="email" name="email" placeholder="e-mail
  address" required class="input body-m">` (reset with `input { all:
  unset }`).
- **Layout:** margin-top `0.6944vw` (mobile `2.1333vw`), width 100%, color
  `body-m` (NBInternationalPro), opacity 0.5.
- **States:** focus `outline: 0` (browser default removed), sending
  shows `.input-container.isSending::after` running the `load` keyframe,
  success shows `.title.copied` for the "Thank you" feedback.

### WebGL artwork canvas (Artwork)

This is the centerpiece. It's not a "component" in the CSS sense — it is a
Three.js scene managed by a Vue component, rendered into a `<canvas>` that
fills the viewport.

- **Stack:** Three.js r132 (`window.__THREE__="132"`), custom
  EffectComposer with bloom + fog + tone-mapping, animation timeline
  driven by GSAP timelines (`pageFadeTl`, `playOpening`, `playMode`,
  `playPageFade`, `playSingleProject`).
- **Scene contents:**
  - 10 floating project cards (image or video texture, sampled from
    `homePage.archs[*].coverHome`).
  - An "earth arch" (`mainScene.arch`) with lights and a `lights.raycast`
    manager that lets the user hover-click on arch segments.
  - Bloom post-process (strength `0.8`, radius variable, 5 mips).
  - Depth fog with `uFogColor: #111111`, range via `uFogRange` uniform.
  - Tone-mapped output via custom shader (`uExposure`, `uGamma`,
    `uWhiteNoise`).
- **Scroll behavior:** custom SmoothScrollbar instance with `damping:
  0.01` and a single `addListener('scrollBarEvent')` handler that
  computes `scrollProgress = offset.y / limit.y` and drives
  `artwork.updateScroll({ scrollProgress, delta })`. Progress is mapped
  to a sinusoidal camera zigzag: `x = 1.5 * sin(-progress * π *
  projects.length) * (1 - min(1, 0.02 * |delta|))`.
- **Mobile fallback:** Swiper.js (`new Swiper(refs.swiper, {
  slidesPerView: 1, loop: true, direction: "vertical",
  watchSlidesProgress: true, speed: 500 })`) emits `touchEnd`,
  `transitionEnd`, `progress` events that feed the same GSAP
  `updateSwipeProgress` lerp.
- **Day/Night modes:** based on `new Date().getHours()` between 6 and 18
  emits `CHANGE_MODE { mode: "day" }` else `night`. The scene params
  module `pe` swaps `uExposure`, fog color, and bloom strength.
- **Loading:** the artwork instance dispatches Vuex action `webglLoaded`
  on `FINISH_LOADING` (assets) and `WEBSITE_READY` events, then waits for
  a 2s GSAP `playOpening()` and a `playSingleProject()` transition
  before pushing the user to `/works/:id`.

### Transition overlays (TransitionWork / TransitionJob)

These are fullscreen transitions between the index route and a single
project page.

- **`.transition-work`:** `position: absolute; bottom: 0; left: 0; width:
  100%; height: 100vh; z-index: 100; opacity: 0; padding: 0 2.0833vw`.
  On `.show`, opacity → 1, padding → 0 over `padding 1.8s
  cubic-bezier(.19,1,.22,1)`.
- **Background:** either the project's `coverMobile` image, the
  `cover.video` URL, or `cover.responsiveImage` for the desktop variant.
- **Progress bar:** `position: absolute; top: 50%; left: 50%; width:
  50%; height: 2px; transform: translate(-50%,-50%); background-color:
  #000; z-index: 10`. Inner bar `transform: scaleX(0 → 1)` over `1.2s
  ease`. Wrapped by `loadOpacity-data-v-e9753f04 1.2s ease forwards`
  (0 → 1 opacity).
- **On done:** GSAP `i.a.to(this.$refs.el, { height: width / 2.25,
  duration: 1.5, ease: "expo.out" })` and Vuex `transitions/transiInWork
  → false`.
- **Mobile variant (`isMobile`):** no height animation, just toggles
  `show` via store.

### Smart-image component

A wrapper around an `<img>` (or `<video>`) with a `data` prop. Renders the
DatoCMS responsiveImage, hides the image until `.show`, optionally adds
`.bkg` class to show a `#FF7D50` placeholder behind while loading.

---

## JavaScript & Libraries

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| Nuxt | 2.19.5 | `_nuxt/static/1738522044/` URL prefix, `window.__NUXT__` payload, `<script charset="utf-8" src="/_nuxt/...js">` chunks | SPA + SSR with hydration; routes are code-split |
| Vue | 2.x | `Vue.version` in bundle | implicit |
| Vue Router | 3.x | routes table in `b87e276__ed9e7210.js` | 15 routes defined |
| Vuex | 3.x | `Store.prototype.registerModule` override, `state.js` payload | Modules: `commonData`, `nav`, `transitions` |
| @nuxtjs/auth | — | not observed | (no login flow) |
| @nuxtjs/device | — | `$device.isDesktop/isMobileOrTablet/isIos/...` accessed in component | |
| vue-mq | breakpoints `sm:750 / md:1000 / lg:Infinity`, default `lg` | inlined `MqLayout` component, `vue.prototype.$mq` | used for layout switching (artwork vs Swiper) |
| axios | — | `$axios.onRequest/setHeader/...` methods | Nuxt axios module |
| GSAP | 3.0.1 (`hn.version="3.0.1"`) | `gsap.registerPlugin(...)`, `I.a.to/from/timeline` (renamed in bundle), `_spin/_bounce/...` keyframes prefixed `evhv6` | used for text reveal, page transitions, contact-words swap (`expo.out`), pulse animations |
| SplitText (GSAP) | bundled with GSAP | `new xo.a(refs.titleText, { type: "lines", linesClass: "contact-line-split" })` | splits contact modal title into lines for animation |
| SteppedEase | bundled with GSAP | `SteppedEase` mentions | |
| Three.js | r132 (`window.__THREE__="132"`) | custom `BufferGeometry`, `Scene`, `OrthographicCamera`, `PlaneGeometry` calls; EffectComposer-style custom bloom/fog shaders | full WebGL scene on `/` |
| Smooth-scrollbar | present (no `Scrollbar.init` literal but `Ne.a.init` is used as the import alias) | `scrollBar.addListener`, `scrollBarEvent`, `setPosition` | custom scroll on desktop |
| Swiper.js | — | `new Swiper(el, {slidesPerView:1, loop:true, direction:"vertical", watchSlidesProgress:true, speed:500})` | touch fallback for mobile |
| datocms-client | 2.19.5 | "datocms-client" string in bundle, `datocms-structured-text-...` deps listed in package.json block | DatoCMS content API client, feeds the SSR `state.js` payload |
| @datocms/structured-text-* | — | GraphQL fragments for `StructuredText` component | renders rich-text blocks |
| Plausible Analytics | — | `trackLocalhost:false, apiHost:"https://plausible.io", domain:"wonderlandams.com"`; `enableAutoPageviews`, `enableAutoOutboundTracking` | domain is `wonderlandams.com` not `wonderland.studio` |
| Google Tag Manager | GTM-M9K5CK | noscript iframe + inline init script | loaded only after cookie accept |
| Tally.so embed | — | `<script src="https://tally.so/widgets/embed.js" async>` in `<head>`, used inside `.contact-modal` via `dataContact.buttons` (rich button link) | survey/contact form |
| IntersectionObserver (polyfill) | w3c IntersectionObserver polyfill (in `cdb61e7.js`, ~9KB) | polyfills `isIntersecting` for older browsers | not heavily used — appears once in the bundle |
| Custom favicon sprite animator | — | class `ro` in `b87e276__ed9e7210.js` (~1KB) draws a 32×32 canvas per second from `/sprites/favicon-sprite.png` (a 3×3 grid of 32px tiles) and rewrites `link[rel="icon"]` href | 6 frames then loops back to 0; idle cycle 0 |
| `x5engine` (5centsCDN) | n/a | `_layoutDefault_evhv6_170`, `_layoutModal_evhv6_186` classes | leftover from Tally embed widget |

There is **no Lottie**, no Framer Motion, no AOS, no anime.js, no GSAP
ScrollTrigger, no Lenis, no Locomotive Scroll. The scroll is custom
Smooth-scrollbar + raw `requestAnimationFrame` lerp.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `discover-pulse-data-v-6b0ee5e6` | inline `<style>` after html open | 2s `ease` | `ease` | `.discover.showDiscover` fires `2s delay` then 3 iterations |
| `pulse-data-v-2e1defa2` | inline `<style>` in `<button>` scoped CSS | 0.7s | `cubic-bezier(.19,1,.22,1)` | `.button:hover .point` (forwards) |
| `pulse-infinite-data-v-2e1defa2` | inline `<style>` in scoped button CSS | 0.7s | default | `:active`/focus state of button |
| `pulse-infinite-data-v-37161225` | inline `<style>` in scoped nav CSS | 1s | `linear` | infinite, loader percent opacity pulse |
| `load-data-v-0c77ad74` | inline `<style>` in scoped heading-email CSS | 2s | `cubic-bezier(.455,.03,.515,.955)` | infinite, newsletter sending |
| `loadOpacity-data-v-0174eb38` | inline `<style>` in scoped transition-job CSS | 1.2s | `ease forwards` | `.transition-work.show .progress` |
| `loadOpacity-data-v-e9753f04` | inline `<style>` in scoped transition-work CSS | 1.2s | `ease forwards` | `.transition-work.show .progress` |
| `burger-to-cross-1-data-v-37161225` | nav scoped CSS | 0.4s | `linear` | `.button.toggleMenu` state |
| `burger-to-cross-2-data-v-37161225` | nav scoped CSS | 0.4s | `linear` | `.button.toggleMenu` state |
| `cross-to-burger-1-data-v-37161225` | nav scoped CSS | 0.4s | `linear` | reverse on `.button:not(.toggleMenu)` |
| `cross-to-burger-2-data-v-37161225` | nav scoped CSS | 0.4s | `linear` | reverse |
| `_spin_evhv6_1` | Tally embed (animate.css subset) | 1.618s | `linear infinite` | Tally loading spinner |
| `_wave_evhv6_1` | Tally embed | 1s | `ease-in-out` × 20 iterations | emoji wave reaction |
| `_heartBeat_evhv6_1` | Tally embed | 1.3s | `ease-in-out` × 20 | |
| `_flash_evhv6_1` | Tally embed | 2.5s | × 20 | |
| `_bounce_evhv6_1` | Tally embed | 1.5s | × 20 | |
| `_rubberBand_evhv6_1` | Tally embed | 1.5s | × 20 | |
| `_headShake_evhv6_1` | Tally embed | 1.5s | `ease-in-out` × 20 | |
| `_tada_evhv6_1` | Tally embed | 1.5s | × 20 | |

The full keyframes (one block from the dump, sample):

```css
@keyframes _bounce_evhv6_1 {
  0%, 20%, 53%, to { transform: translate(0,0); }
  40%, 43%       { transform: translateY(-30px) scaleY(1.1); }
  70%            { transform: translateY(-15px) scaleY(1.05); }
  80%            { transform: translate(0,0) scaleY(.95); }
  90%            { transform: translateY(-4px) scaleY(1.02); }
}
```

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | `I.a.to(el, { opacity: 0, duration: 0.5 })` | route change to `works-id` | page fade-out before transition-work takes over |
| GSAP | `I.a.to(this.$refs.el, { height: width/2.25, duration: 1.5, ease: "expo.out", onComplete })` | transition `showWork → false` | reverse page transition |
| GSAP | `new I.a.timeline({ onComplete: this.updateWord, delay: 0.5 })` `fromTo(...,{y:"0%"},{y:"100%",duration:1.4,ease:"expo.out"})` | contact-modal mounted + `animation` flag true | cycles through translated "friend" words |
| GSAP | `gsap.timeline.play()` / `playOpening()` / `playMode(mode)` / `playPageFade(page)` / `playSingleProject()` | routed via `W.a.emit("CHANGE_MODE"/"CHANGE_PAGE"/...)` events | Three.js scene timeline (custom, not exported as keyframe) |
| GSAP | `I.a.ticker.add(this.update)` / `.remove(this.update)` | artwork mount/unmount | rAF render loop |
| SplitText | `new xo.a(refs.titleText, { type: "lines", linesClass: "contact-line-split" })` | contact-modal mounted | splits last line for word swap |
| Swiper | `swiper.on("touchEnd"/"transitionEnd"/"progress", ...)` | touch on mobile | feeds `swipeProgress` state |
| Three.js | `mainScene.update()` + bloom pass + custom output shader | every rAF tick while artwork active | writes into `composer.writeBuffer` |
| Custom | `setWords() + setInterval(updateWord)` | contact-modal animation flag | fallback when animation disabled |
| Custom | `Ne.a.init(scrollArea, { damping: 0.01 })` + listener | artwork mount | SmoothScrollbar instance |
| Custom | favicon sprite animator (class `ro`) | `mounted + setTimeout(2000)` in default layout | rewrites `<link rel="icon">` 60× per second |

### Page transitions

- Default `<Nuxt>` mode is `out-in`.
- `.page-enter-active / .page-leave-active`: `transition: opacity 0.5s
  ease, background 0.5s ease, color 0.5s ease, visibility 0.5s ease`,
  `.page-enter-active` has `transition-delay: 0.5s`. `.page-enter,
  .page-leave-active { opacity: 0 }`.
- Specific routes have custom transitions via Vuex `transitions.page`
  state machine: `LEAVE_PAGE → ENTER_PAGE → AFTER_ENTER_PAGE` with
  intermediate `ENTER_WORKS_ID / LEAVE_WORKS_ID / ENTER_CONTACT /
  LEAVE_CONTACT`.
- The first paint has no transition (SSR HTML).
- `invert-color` is added to body on `/terms` and `/privacy` for the
  whole page; otherwise only the footer swaps.

---

## Assets

### 3D models

N/A — no 3D models observed in the dump. The WebGL artwork is a 2D plane
passing a shader; geometry is `PlaneGeometry(1,1)` and a procedural
"arch" of cards (instanced planes for project textures). No `.glb`,
`.gltf`, `.obj`, `.fbx`, `.usdz` files in the dump.

### Fonts

All five are self-hosted under `/fonts/...`, served as both `.woff2` and
`.woff` for legacy fallback. Listed in the order they appear in the
`@font-face` declarations:

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Serifbabe Alpha Trial | 400 | woff2, woff | `https://wonderland.studio/fonts/Serifbabe/SerifbabeAlpha-Regular.woff2` | yes |
| NBInternationalPro | 300 italic | woff2, woff | `https://wonderland.studio/fonts/NB-InternationalPro/NBInternationalPro-LigIta.woff2` | yes |
| NBInternationalPro | 300 normal | woff2, woff | `https://wonderland.studio/fonts/NB-InternationalPro/NBInternationalPro-Lig.woff2` | yes |
| Lay Grotesk | 400 | woff2, woff | `https://wonderland.studio/fonts/LayGrotesk/LayGrotesk-Regular.woff2` | yes |
| Lay Grotesk | 500 | woff2, woff | `https://wonderland.studio/fonts/LayGrotesk/LayGrotesk-Medium.woff2` | yes |
| Lay Grotesk | 600 | woff2, woff | `https://wonderland.studio/fonts/LayGrotesk/LayGrotesk-Semibold.woff2` | yes |

Local dump paths:

- `tools/tmp/wonderland/fonts/SerifbabeAlpha-Regular__bf9f60e5.woff2` (30,824 B)
- `tools/tmp/wonderland/fonts/NBInternationalPro-Lig__03e26ffa.woff2` (44,728 B)
- `tools/tmp/wonderland/fonts/LayGrotesk-Regular__8bd921eb.woff2` (45,068 B)
- `tools/tmp/wonderland/fonts/LayGrotesk-Medium__9bf8bcab.woff2` (52,192 B)
- `tools/tmp/wonderland/fonts/LayGrotesk-Semibold__3fd755bc.woff2` (52,500 B)

CSS declares them with `font-display: swap` for fast first paint.

### Images

| Local path | Type | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/wonderland/images/favicon-sprite__af1a55c3.png` | PNG (3×3 grid of 32×32 frames) | 8,945 B | `https://wonderland.studio/sprites/favicon-sprite.png` | animated favicon source |
| (referenced) `https://www.datocms-assets.com/74681/1661877500-favicon.png` | PNG 16/32/96/192 | — | datocms CDN | favicon (also embedded as data:URI in `<head>`) |
| (referenced) `https://www.datocms-assets.com/74681/1662661686-screenshot-2022-09-08-at-20-27-43.png` | PNG 1200w | — | datocms CDN | OG / Twitter image |
| (referenced) `https://www.datocms-assets.com/74681/1662629599-frame-2.jpg` | JPG | — | datocms CDN | About page hero image |

DatoCMS is the source of truth for project covers, project hero videos,
and structured text (page bodies). No images were actually downloaded to
the local dump because they are fetched at runtime from
`site-api.datocms.com` and `www.datocms-assets.com`.

### SVGs & icons

- **Inline SVGs observed in the homepage HTML:**
  - **Logo wordmark**: `<svg viewBox="0 0 180 15">` with 16 individual
    `<path>` elements spelling "WONDERLAND" with letterforms cut to
    `fill="#DED6CB"` (currentColor via exclusion blend).
  - **Back arrow**: `<svg width="11" height="10" viewBox="0 0 11 10">`
    `<path d="M1 5L5.19349 1M1 5L5.19349 9M1 5L11 4.99985" stroke="#DED6CB">`.
  - **SvgCross** (used in `.close-button`): imported as
    `import SvgCross from "..."` and registered as a global component.
  - **Social icons** (Instagram, Dribbble, LinkedIn, Substack): rendered
    as `<img>` from DatoCMS-hosted URLs, not inline SVG.
- **Standalone SVG files in dump:** none.
- **Icon system:** no Lucide / Phosphor / Heroicons / custom sprite
  library. Each SVG is hand-authored in the Vue component template.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/wonderland/media/1662986514-m-final__9689e1b5.webm` | WebM (video) | 675,877 B / 660 KB |
| (referenced) `https://www.datocms-assets.com/74681/1662986514-m-final.mp4` | MP4 H.264 | — |

The video is the looping background of the Contact modal's left panel
(`<video ref="video" src="...mp4" playsinline loop muted crossorigin>`).
Both `.mp4` and `.webm` are referenced; the `.webm` is what was
downloaded to the dump.

The project covers in the WebGL scene are typically MP4/WebM videos
served from DatoCMS; one URL pattern: `data.coverHome.video`.

### Favicon sprite (3 × 3 PNG grid)

A single 96×96 PNG containing nine 32×32 frames. The JS animator
(`class ro`) draws one tile per second into a hidden `<canvas>`, then
exports `canvas.toDataURL("image/png")` and assigns it to every
`<link rel="icon">`. Six frames animate then it loops back to 0 with
`setTimeout(0)` between, giving roughly one frame per second.

### DatoCMS content structure (inferred from `state.js`)

The site reads from a single DatoCMS GraphQL endpoint (`site-api.datocms.com`)
authenticated with `NUXT_ENV_DATOCMS_API_TOKEN = "33a17ab474f3b71531da1777feb48c"`
(redacted in this dump). Models observed: `homePage`, `aboutPage`,
`beingHerePage`, `culturePage`, `everythingPage`, `ideasPage`,
`manifestoPage`, `talentProgramPage`, `termsPage`, `privacyPage`,
`worksPage`, plus per-route detail pages (`works/:id`, `jobs/:id?`,
`ideas/:id`, `service/:id?`).

---

## Motion & Interaction

### Principles

- Default easing for transitions: `cubic-bezier(.19,1,.22,1)` (a
  Penner-like "ease-out-quart" custom curve). Used everywhere from
  hamburger-menu icon to back-arrow hover to footer heading reveal.
- Secondary easing: `cubic-bezier(.22,1.45,.36,1)` for the close-button
  pop-in (`transform: scale(0) → scale(1)` with mild overshoot).
- Reveal easing: `cubic-bezier(.165,.84,.44,1)` for `word-anim` rotateY.
- Cross-page easing: `ease` for opacity, `linear` for color swaps.
- Default durations: 0.17s (micro: hover color), 0.25s (small: nav
  fade-in/out), 0.5s (medium: page transition), 1.0s (large: footer
  reveal), 1.2s-1.8s (extra-large: section reveal, contact modal).

### Specific behaviors

- **Link hover (`.container`):** ring opacity 0 → 1 over 0.17s linear;
  ring is a `::before` `border: 1px solid #DED6CB` `border-radius:
  0.8333vw`. Anchor point inside scales 0 → 1 over 0.7s
  `cubic-bezier(.19,1,.22,1)`.
- **Back-arrow hover:** `transform: translateX(-35%)` over 0.7s
  `cubic-bezier(.19,1,.22,1)`, color shifts to `#F59371` (peach).
- **Button press:** no explicit `:active` style, but the pulse
  keyframe `pulse-data-v-2e1defa2 0.7s cubic-bezier(.19,1,.22,1)
  forwards` runs on hover and stops in the final state, so the
  perception is a "settle" rather than press-down.
- **Section reveal on scroll:** driven by IntersectionObserver (or
  Smooth-scrollbar `scrollBarEvent`) → `setOverlay` Vuex action →
  `.show` class on `.heading` / `.footer` → opacity + translateY
  transition (no stagger; single element reveal).
- **Page transition:** `out-in` fade with 0.5s delay on enter, plus
  Vuex `transitions.page` state for routes that need a custom overlay
  (works, contact).
- **Contact modal:** slides down from `-110%` translateY with 1.2s
  `cubic-bezier(.19,1,.22,1)` on the inner card, individual right-panel
  columns fade in at `.3s, .5s, .7s` stagger.
- **WebGL camera:** driven by scroll position via a sin curve:
  `x = 1.5 * sin(-progress * π * projects.length) * (1 - min(1, 0.02 *
  |delta|))`. Click on the arch emits `GO_TO_SINGLEPAGE { slug,
  targetPos }`, after a 2s `playSingleProject()` transition Vue Router
  pushes `/works/:id`.
- **Day/night swap:** the page itself only changes behavior in the WebGL
  scene; CSS body doesn't recolor.
- **Copy email:** click on a `.heading-email` column toggles `.copied`
  class; the label slides up (`title-span translateY(-100%)` over 1s
  cubic-bezier) and "e-mail copied to clipboard" / "Thank you" slides in
  from below (`translateY(100%) → 0`).

### Reduced motion

There is no `@media (prefers-reduced-motion: reduce)` block. Instead the
app uses a JavaScript toggle: when the user clicks `.animation-toggle`,
the body gets `class="no-animation"` which globally disables transitions
(`transition: none !important; animation: none !important`) and forces
`word-anim-inner { opacity: 1 !important }`. This is an opt-in toggle,
not a system-preference media query. The contact-words swap still runs
on a `setInterval` fallback (`if (this.animation) { tl.fromTo(...) } else
{ wordsEl[t].style.opacity = 1 }`).

---

## Content & Voice

- **Tone:** confident, restrained, design-literate. Headings are
  uppercase and short ("HOME", "WORK", "ABOUT US", "BEING HERE",
  "MANIFESTO", "IDEAS", "CONTACT"). Body prose uses sentence case.
- **Sentence length:** short to medium. Footer email labels are ALL CAPS
  eyebrow style.
- **Capitalization:**
  - Headings: `text-transform: uppercase` on h1, h2, h3, h5, h6, h7;
    `text-transform: capitalize` on h4.
  - Body: as-written, sentence case.
  - CTAs and labels: ALL CAPS (`OK`, `CLOSE`, `MENU`, `BACK`).
- **Punctuation:** no Oxford comma observed. Em-dash used in footer
  credits ("16—24© wonderland expect the unexpected").
- **CTA vocabulary:** `OK` (cookie), `BACK` (sub-routes), `MENU /
  CLOSE`, `Scroll to discover`. Buttons inside the contact modal
  receive their label from `dataContact.buttons[*].label` (DatoCMS).
- **Sample footer text** (paraphrased): "We collaborate with ambitious
  brands and fearless founders to build memorable experiences." Strong
  words ("collaborate", "ambitious", "brands", "fearless", "founders",
  "memorable", "experiences") swap to `Serifbabe Alpha Trial`.
- **Contact modal title** (paraphrased): "Let's talk" with the final
  word cycling through "Vriend → Przyjaciel → Mate → Chom → Kompis →
  Kaveri → Ami → Amigo" (translations of "friend").
- **About description (paraphrased):** "Wonderland is a studio for
  design and brand innovation. We're masters in creating brand
  experiences that do something different."
- **OG description:** "We're a brand and digital studio working to create
  meaningful value for people and the planet."

---

## Information Architecture

Routes registered in the Nuxt router:

| Path | Name | Purpose |
| --- | --- | --- |
| `/` | `index` | WebGL homepage artwork, navigation, hidden SEO H1 |
| `/works` | `works` | Index of 20+ projects ("Highlighting (20) projects within strategy, branding and experience design") |
| `/works/:id` | `works-id` | Single project case-study page, hero video, structured text, gallery |
| `/about` | `about` | Studio story, image header, body copy |
| `/being-here` | `being-here` | Careers page, lists open roles |
| `/culture` | `culture` | "Culture Handbook" — internal handbook excerpt |
| `/ideas` | `ideas` | Editorial / blog index |
| `/ideas/:id` | `ideas-id` | Single article |
| `/manifesto` | `manifesto` | Studio values / credo |
| `/talent-program` | `talent-program` | Trainee programme info |
| `/jobs/:id?` | `jobs-id` | Single role detail |
| `/service/:id?` | `service-id` | Service description (possibly service lines) |
| `/privacy` | `privacy` | Privacy policy (inverted color) |
| `/terms` | `terms` | Terms & conditions (inverted color) |
| `/everything` | `everything` | A combined index ("Index | WONDERLAND") |
| `/contact` (modal) | — | Opened via `?contact` query param; renders `<ContactModal>` over the current page |
| `**/*` | `custom404` | Custom error page with video header |

The "contact" surface is a query-param modal (`?contact`) rather than a
dedicated route. Pressing any "CONTACT" link sets `?contact` and triggers
the `ENTER_CONTACT` transition; pressing the close button or navigating
back clears the query and triggers `LEAVE_CONTACT`.

---

## Accessibility

- **Color contrast:** body text `#DED6CB` on `#1A191B` ≈ 13.4:1 (well
  above WCAG AAA 7:1). Cream `#1A191B` on `#ECE4DA` ≈ 13.6:1. Button
  label `#F7EFE6` on `#EC6437` ≈ 4.5:1 (borderline AA Large). The
  `body ::selection` flips to `#1A191B` on `#FF7D50` for ≥4.5:1.
- **Focus indicators:** `button:focus, input:focus, select:focus,
  textarea:focus { outline: 0 }` — focus ring is explicitly removed.
  Visible focus is delegated to the hover state (which has the same
  visual treatment). This is a regression risk for keyboard-only users.
- **Keyboard:**
  - Tab order: not explicitly defined; follows DOM order.
  - `.heading-email` and email blocks are `<div>` not `<a>`; the
    click-to-copy is implemented via `@click` listeners on a `<div>`
    with `cursor: pointer`, not navigable by keyboard.
  - Cookie banner OK button is a `<button>`, navigable.
  - Nav buttons have `pointer-events: auto` only when `.show` is set;
    otherwise `pointer-events: none`.
- **Screen reader landmarks:**
  - `<main role="main" aria-labelledby="main-title">` wraps the page.
  - `<nav role="navigation">` with class `nav h6 show`.
  - `<footer role="contentinfo">`.
  - `<aside role="complementary" class="cookie show">` for the cookie
    banner.
  - `<aside role="complementary" class="contact-modal">` for the modal.
  - `<section role="region" class="transition-work">`.
  - The hidden SEO H1 has `aria-labelledby="main-title"`.
- **Hidden-visually utility:** `.hidden-visually { position: absolute;
  overflow: hidden; white-space: nowrap; margin: 0; padding: 0; height:
  1px; width: 1px; clip: rect(0 0 0 0); -webkit-clip-path: inset(100%);
  clip-path: inset(100%) }`. Used for the email-form label.
- **Form labels:** `<label for="email" class="hidden-visually">Your
  email address</label>` paired with `<input type="email" name="email"
  placeholder="e-mail address" required>`.
- **Motion:** opt-in toggle (`.animation-toggle` adds
  `body.no-animation` class) is provided but is **not** wired to
  `prefers-reduced-motion`. No automatic reduced-motion handling.
- **Alt text:** `<img alt="">` (empty) on social icons inside the
  contact modal — the surrounding `<a>` link provides the descriptive
  context, but the icon itself has no alt. Logo SVG has no `<title>` or
  `aria-label`. Back-arrow SVG similarly unlabeled.
- **Language:** `<html lang="en">`.
- **Reduced scroll on touch devices:** the scroll container uses
  `body.no-scroll-bar` and `html.no-scroll-bar` to hide the scrollbar
  visually; the actual scroll bar is replaced by Smooth-scrollbar (or
  Swiper on mobile). Keyboard scroll still works through native
  scrollIntoView if needed.

---

## Sources

Every URL observed during writing:

- Homepage (live, fetched via Playwright) — `https://wonderland.studio/`
- Canonical — `https://wonderlandams.com/`
- OG image — `https://www.datocms-assets.com/74681/1662661686-screenshot-2022-09-08-at-20-27-43.png`
- Favicon (data-URI embedded) — `https://www.datocms-assets.com/74681/1661877500-favicon.png`
- About hero image — `https://www.datocms-assets.com/74681/1662629599-frame-2.jpg`
- Contact modal video (WebM + MP4) — `https://www.datocms-assets.com/74681/1662986514-m-final.{webm,mp4}`
- Font assets — `https://wonderland.studio/fonts/{Serifbabe/SerifbabeAlpha-Regular,NB-InternationalPro/NBInternationalPro-Lig,NB-InternationalPro/NBInternationalPro-LigIta,LayGrotesk/LayGrotesk-Regular,LayGrotesk/LayGrotesk-Medium,LayGrotesk/LayGrotesk-Semibold}.{woff2,woff}`
- Favicon sprite — `https://wonderland.studio/sprites/favicon-sprite.png`
- Nuxt static base — `https://wonderland.studio/_nuxt/static/1738522044/`
- DatoCMS API — `https://site-api.datocms.com` (referenced; not directly queried)
- Plausible — `https://plausible.io` (analytics endpoint)
- Tally embed — `https://tally.so/widgets/embed.js`
- Google Tag Manager — `https://www.googletagmanager.com/gtm.js?id=GTM-M9K5CK`
- Social profiles (in footer) — `https://www.instagram.com/wonderlandstdio/`,
  `https://dribbble.com/wonderlandstudio`,
  `https://www.linkedin.com/company/wonderlandstdio`,
  `https://wonderlandams.substack.com/`
- GSAP docs — `https://greensock.com` (referenced in error string)

---

## Changelog

- 2026-06-20 — Initial draft by opencode from `tools/tmp/wonderland/` dump.
