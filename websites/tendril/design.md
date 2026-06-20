# Tendril — design.md

> A structured design specification of **https://tendril.ca** (renders at
> `https://tendril.studio`), written so a human or agent can reconstruct
> its look-and-feel without seeing the original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** sub-agent
> **Source dump:** `tools/tmp/tendril/` (gitignored)
> **Source domain observed:** `tendril.ca` redirects (via Cloudflare) to
> `tendril.studio` and serves the same WordPress theme `tendril v1.36`.

---

## Overview

Tendril is the public site of Tendril Studio, a Toronto- and São
Paulo-based motion design and CGI shop whose reel includes campaigns
for Louis Vuitton × F1, IBM z17, Figure humanoid robots, Hublot × Daniel
Arsham, Alien: Earth, Riot Worlds 2022, Microsoft, Coinbase, Tiffany &
Co., ESPN, and others. The site is a single long-scrolling portfolio
built on a custom WordPress theme: a fixed splash video plays while a
custom `SmoothScroll` JS engine drives the page, the work reel is a
"flowing blocks" grid of Vimeo-backed reels and image tiles, and the
footer is a black slab with a marquee-like hello and a live-clock per
office. The visual language is austere — monochrome white-on-black for
the content surface, a single HK Grotesque type family, almost no
borders or radii, almost no shadows — with one accent (`#C3BBD7` purple
used only for selection) and a lot of wide whitespace.

**Category:** Marketing / Studio portfolio (motion design reel)
**Primary surface observed:** Homepage only (other routes referenced but not fetched)
**Tone:** Confident, editorial, restrained, motion-forward
**Framework detected (if any):** WordPress 7.0 + custom `tendril v1.36` theme + bespoke `SmoothScroll`/`smoothState` jQuery stack
**CMS:** WordPress (generator tag `WordPress 7.0`, page ID 8)
**Hosting / edge:** Cloudflare (Beacon RUM script present, body class
detection, cf-cache implicit in HTML)
**Pre-rendering shell (`tools/tmp/tendril/html/`):** empty (single
Cloudflare-challenge script stub) — static scrape failed; the rendered
DOM in `tools/tmp/tendril/playwright/homepage.html` is the canonical
source for layout, content, and asset URLs.

---

## Visual Language

### Color

The site uses a deliberately minimal palette. Neutrals are
`#FFFFFF` / `#000000`; intermediate grays are tokenised as `--grey`,
`--lightgrey`; the only chromatic accent is a muted lilac used for text
selection. There is no dark-mode toggle — the homepage is light and the
footer is a hard `#000` slab that flips color to `#FFFFFF` and stays
there until the page is reloaded.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (page base) | — | `#FFFFFF` (white) | `body { background:#fff }` |
| Background (video tile) | — | `#000000` (black) | `#homepage-splash div`, video figure wrapper |
| Background (footer) | — | `#000000` (black) | `footer { background:#000; color:#fff }` |
| Background (form field) | — | `#000000` (black) | `footer form fieldset input { background:#000 }` |
| Background (Chosen select active) | — | `#D4D4D4` (light gray) | `.search-choice-focus` |
| Text (primary) | — | `#000000` (black) | `body { color:#000 }` |
| Text (secondary / muted) | `--grey` | `#808080` (gray) | defined on `:root` |
| Text (very muted) | `--lightgrey` | `#D0D0D0` (light gray) | defined on `:root` |
| Text (on dark / footer) | — | `#FFFFFF` (white) | `footer { color:#fff }`, computed for `h2.h1` footer |
| Text (link underline) | — | `#000000` (black) | `a::after { border-bottom:1px solid #000 }` |
| Text (error) | `--red` | `#FF0000` (red) | `form fieldset.error:after { border-bottom-color:var(--red) }` |
| Accent (selection only) | `--purple` | `#C3BBD7` (lilac/lavender) | `::selection { background:var(--purple); color:#fff }` |
| Border (form underline) | — | `rgba(255,255,255,0.2)` | footer newsletter underline at rest |
| Border (form underline focused) | — | `var(--grey)` `#808080` | transitions `border-bottom-color .2s` |
| Border (careers list separator) | — | `1px solid var(--lightgrey)` | team/role dividers |
| Black (legacy token) | `--black` | (not defined in `:root`, used in `color:var(--black)`) | placeholder; resolves to unset → falls back to inherited color |

There are no additional dark-mode overrides — the entire content
surface is fixed white, the footer is fixed black, and `.lh`
(lighthouse-bot) class forces `display:none` on splash hero only.

### Typography

Tendril is monotypographic. The site loads HK Grotesque via ten
`@font-face` declarations (Light → Bold, regular + italic) from
`../fonts/HKGrotesk-*.woff2` with `eot`/`woff` fallbacks. Self-hosted
in the theme; only Regular 400 and SemiBold 600 woff2 files were
captured in the playwright dump, but the CSS registers the full
300/300i/400/400i/500/500i/600/600i/700/700i stack.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (`.h1`, footer hello) | `"HKGrotesque", sans-serif` | 400 | `clamp(32px, 8.53vw, 42px)` (mobile) → `48px` (tablet) → `68px` (≥1440px) | `42 / 64 / 80 px` (matches `min-height`) | `-0.02em` (`.h1`); computed `-1.36px` at 68px |
| H2 (`.h2`) | `"HKGrotesque"` | 600 | `24px` (mobile) → `28px` (tablet) → `32px` (≥1440px) | `30 / 38 / 48 px` | `normal` |
| Body large (`.para`, hero copy, captions) | `"HKGrotesque"` | 400 | `20px` (mobile) → `25px` (tablet/desktop) | `30 / 40 px` | `-0.5px` (computed) |
| Body / nav link | `"HKGrotesque"` | 400 | inherited `16px` | inherited `1` | inherited `normal` |
| Form input | `"HKGrotesque"` | 400 | `25px` | `40px` | `-0.5px` |
| Button / form submit | `"HKGrotesque"` | 400 | `25px` | `40px` | `-0.5px` |
| Strong (project title) | `"HKGrotesque"` | 400 (`.para block`) / 600 (`strong.para`) | `25px` | `40px` | `-0.5px` |
| Error message | `"HKGrotesque"` | 400 | `14px` | `18px` | `normal` |

The body baseline is `body { line-height:1; color:#000; font-weight:400 }`.
The display class `.h1` enforces `min-height` matching its
`line-height` (e.g. `min-height:80px` at 68px / 80lh), which is what
gives the hero copy its characteristic even vertical rhythm.

`<stack>` is `"HKGrotesque", sans-serif` everywhere; no system stack,
no fallback weights beyond `sans-serif`. Two `woff2` files were
captured from the live page (Regular, SemiBold); the theme CSS
references the full weight/italic set but only those two were fetched
at runtime (rest are preloaded or come from cache on real visits).

### Spacing & radius

- **Base unit:** 8px (visible at `--gutter`, `--margin`, header padding
  shifts)
- **Scale:** `--gutter` is `20px` on `<1440px` viewports and `32px`
  on `≥1440px`; `--margin` follows the same `20px / 40px` rule;
  `--padding-top` is `110px` (mobile) / `170px` (768–1439) /
  `190px` (≥1440); `--padding-bottom` is `100px / 100px / 200px`.
- **Radii:** essentially none — only `border-radius:0` and
  `border-radius:50%` (the SVG clock face and the work-hover
  indicator) appear; the form `border-radius:0 0 4px 4px` for the
  Uploadify resume label.
- **Shadows:** none observed on tendril.css. `box-shadow: none` on
  every computed element.

### Iconography

- **Style:** outline / single-path; inline SVGs only. No icon font.
- **Library:** none — Tendril ships its own paths inline.
- **Sizes:**
  - Header logo SVG: 40×40 mobile, 50×50 ≥768px, 40×40 default.
  - Footer hello SVG (small flower-of-life-style mark): 39×39 mobile, 42×42 ≥768px.
  - Mobile menu button (`button[action=menu]`): 39×39 with two `border-top:2px solid #000` pseudo-elements.
  - Uploadify file icon: 16×16 with `transform:rotate(45deg)`.
  - Clock face (`span.clock`): 30×30 circle, two hands.
- **Two reusable SVGs:**
  - Logo (viewBox `0 0 192 192`) — black square with two
    negative-space forms: a "T" stem on the left, a circle in the
    upper right, and a "U" curve at the bottom (the letterforms spell
    out "t" / "e" / "n").
  - Footer hello mark (viewBox `0 0 42 42`) — flower-of-life / rosette
    line drawing with stroke `#000` and fill `#fcfcfc`.

---

## Layout & Grid

- **Grid system:** bespoke 4-column "flowing-blocks" grid (`.blocks` is
  a flex row of `.block` items with class modifiers `size_{1,2,3,4}c`,
  `position_{1..16}`, and `layout_{below,right}`). Column widths are
  derived from CSS custom properties, not a framework:
  - `:root { --vw:1vw; --vh:1vh; --grid:calc((var(--vw) * 100) - (var(--margin) * 2)); --col:calc((var(--grid) + var(--gutter)) / var(--columns)); --columns:4; }`
  - `--col1` through `--col4` are `var(--col) * n`, with `-g` (minus
    gutter) and `-g` (with gutter) variants.
  - On `≥1440px`: `--gutter:32px; --margin:40px`. On `≤1439px`:
    `--gutter:20px; --margin:20px`.
- **Page gutter / container:** `.container` has no max-width; it is a
  flex row with `padding:20px 40px` on `≥768px`, `padding:0 40px`
  inside section content; for `>1440` blocks, side padding equals
  `var(--margin)`.
- **Breakpoints (min-width unless noted):**
  - `≤767px` — `_mobile` (single column, hamburger menu).
  - `768–1023px` — `_tablet` (hamburger gone, nav inline, 2-up blocks).
  - `1023–1439px` — `_laptop` (full nav, 4-up blocks, larger gutters).
  - `≥1023px` — `_laptop_desktop` (SmoothScroll enabled by default).
  - `≥1439px` — `_desktop` (max typography and gutter).
  - `≥1440px` — desktop typography and padding-top/bottom.
- **Vertical rhythm:** a baseline of `8px` is implicit through header
  padding shifts (`40px / 40px → 20px / 20px` on sticky), section
  `--padding-top` / `--padding-bottom`, and `.blocks { margin-bottom:200px }`.
- **Splash → hero → blocks → footer ordering:** fixed-position splash
  video is on a lower z-index than `#main` and translated up with
  `transform:translate3d(0, var(--transform), 0)` as the user scrolls
  (it acts as a parallax backdrop while the hero scrolls over it).

### Page layout (homepage)

The main wrapper is `<div data-scroll id="smoothscroll">` (smoothScroll
container) inside `<main id="main">`. Its single child is
`<div class="page padding-bottom" controller="homepage">` which contains
the full content sequence: splash → hero → flowing blocks → (off-screen)
black footer slab pinned to the bottom.

**Header** (`<header controller="global" smoothscroll="fixed"
scroll="header">`): full-width, transparent at top, `top:0; width:100%;
z-index:10`. Inside, a flex row `.container` with the logo on the
left (`#logo`, 40–50px square), `nav.para` on the right (Work, Studio,
Careers, Contact — Work is `--index:0`, Contact is `--index:4`), and
a hamburger button (`<button action="menu">`) that animates from two
horizontal bars to an X via `transform:rotate(45deg/-45deg)` on
`.menu`. On scroll, `.sticky.animate .container` shrinks
`padding-top/bottom` from 40px to 20px over `0.4s ease-out`.

**Section 1 — `#homepage-splash`** (fixed position, z-index -1, behind
everything). Holds a 16:9 or 9:16 video (the `LandingPage.mp4`
showreel), scaled with `transform:scale(var(--scale))` and translated
by `--transform` (which the SmoothScroll controller updates each
frame). The video has `background:#000` as a letterbox color.

**Section 2 — `#homepage-hero`** (scrolls over the splash). Padding-top
is `calc(var(--vh100) * 1.2 + var(--padding-top))` so the hero copy
appears about 1.2 viewports below the previous section. Inside,
`.container > h1.h1.fade-in.reveal` carries a single long paragraph
(≈ 60 words) at `68px / 80px line-height / -1.36px tracking` on
desktop, justified left.

**Section 3 — `#homepage-blocks.flowing-blocks`** — the work reel.
A `.container` (no right padding) contains a vertical stack of
`.blocks` flex rows. Each row is a horizontal flex of `.block` items
sized `size_1c` (1 col, narrow), `size_2c` (2 cols, medium), or
`size_3c` (3 cols, full), positioned via `position_{1..4}`. Each
`.block` is a hyperlink wrapping a `<figure scroll="reveal">`
(containing either a Vimeo iframe `<iframe aspect_ratio="1:1|16:9">`
or a lazy `<img scroll="image" data-src data-srcset>`) followed by a
`.para` caption (`<strong>` project title + `<p><span>` description +
`<small>` credit). Spacer blocks are `.size_1c.spacer { display:none }`.
The rows alternate layout direction via `layout_below` (text under the
media) and `layout_right` (text right of the media).

**Section 4 — `<footer>`** — black slab at the bottom of the smooth-
scrolled container. It scrolls up into view as the user reaches the
end of the reel. Inside is `#footer > .container`:
`#footer-intro` (an SVG flower mark + rotating `<span>` list of
"Hello!" in different languages, plus a second `.h1` statement),
`#footer-locations` (two `<li>`s with `<h3>` office name, a live-clock
SVG per timezone, and a postal address), a `<form>` newsletter signup
(email + "Sign up" button), and `#footer-copyright` (`© 2026 Tendril`,
B Corp PNG, and 4 social links: Vimeo, Twitter, Instagram, Behance).

---

## Components

### Header / global nav
- **Anatomy:** logo (`#logo`) left · nav links (`nav.para`) center-right
  on ≥768px, full-screen overlay on `<768px` · hamburger button
  (`button[action=menu]`) right.
- **States:** default (transparent over splash, then white over content)
  → `.sticky` (slightly smaller padding-top/bottom) → `.animate`
  (transitions over 0.4s ease-out) → `.menu` (fullscreen black overlay
  with white links, hamburger morphs to X). On `<1024px` with touch,
  smoothScroll is disabled (`@supports (-webkit-touch-callout:none)`).
- **Logo:** 40×40 mobile, 50×50 ≥768, contains both an SVG path and a
  muted autoplay video (`Explosion_200x200.mp4`) layered on top — the
  video is hidden on mobile (`@media all and (max-width:767px)`) and on
  touch devices (`@supports (-webkit-touch-callout:none)`).
- **Z-index stack:** `#logo { z-index:12 }`, header `z-index:10`,
  `#nav-container { z-index:11 }`.

### Work block (the repeating `.block` unit)
- **Variants:** `size_1c` (1 col, narrow), `size_2c` (2 cols), `size_3c`
  (3 cols / full grid). `position_{1..16}` is a horizontal alignment
  hint. `layout_below` and `layout_right` swap caption placement.
- **Media:** either a Vimeo `<iframe scroll="iframe,video"
  aspect_ratio="1:1|16:9">` with `frameborder=0`, `allow="autoplay;
  fullscreen; picture-in-picture"`, `allowfullscreen`, `class="autoplay"`,
  `pointer-events:none`; or a lazy `<img scroll="image" data-src
  data-srcset sizes alt="">` for image-only tiles.
- **Caption (`.para`):** `<strong>` project title (400 default,
  upgraded to 600 in `strong.para`) · `<p><span>` description ·
  `<small>` credit. Captions sit absolute over the figure on mobile
  and below it on desktop.
- **Reveal animation:** figure element has `clip-path:inset(0 0 100% 0)`
  and `opacity:0` initially; the JS sets `.reveal` when it enters
  view, transitioning clip-path + opacity to `inset(0 0 0 0) / 1` over
  `1s cubic-bezier(.65, 0, .35, 1) .3s`. Captions use a sibling
  `.fade-in` animation that just fades opacity `0 → 1` over `0.6s`.

### Form (newsletter + career + work-hero)
- **Anatomy:** `<p>` label · `<fieldset>` with `<input class="form-input
  para">` + submit button · `<input type="hidden" name="action"
  value="newsletter">` · `<span class="error">` slot.
- **Field underline:** `border-bottom:2px solid var(--grey)` for the
  resting state, `var(--red)` for `.error`, `transparent` for
  `.complete`. The transition is `border-bottom-color .2s` (resting)
  or `.6s ease-out` (complete).
- **Newsletter (footer):** white-on-black inputs, button to the right
  with `margin-left:var(--gutter)`. On `.complete`, the input + button
  fade out and a `::before` "Thank you for subscribing!" fades in
  (`opacity 1; transition: opacity .6s ease-out .6s`).
- **Career form:** uses jQuery Chosen for selects, Uploadify for file
  upload. Step-by-step multi-page with `#queue` hidden by default.

### Clock (live timezone)
- **Anatomy:** a 30×30 circle (`border:2px solid #fff`, `border-radius:50%`)
  containing two pseudo-element hands. The hour hand is a `6px` wide
  `2px` tall bar rotated by `var(--hours)`; the minute hand is `8px`
  wide. The rotation easing is `cubic-bezier(0.1,2.7,0.58,1)` — a
  spring overshoot — set on the transition-timing-function only.

### Footer hello rotator
- **Anatomy:** inline SVG flower + `<div>` of stacked `<span>`s, one
  per language ("Hola!", "Shalom!", "Aloha!", "Bonjour!", "Hello!",
  "Kon'nichiwa!").
- **States:** each span gets a JS-set class: `.active` (visible at
  `translateY(0)`, with `.3s` transition-delay), `.was-active`
  (sliding up, `translateY(-20%)`), `.next` (sliding up from below,
  `translateY(20%)`). Spans not in those classes are `opacity:0`. The
  transition is `opacity .6s cubic-bezier(.65, 0, .35, 1), transform
  .6s cubic-bezier(.65, 0, .35, 1)`.

### Mobile menu
- **Anatomy:** `<nav class="para">` inside `#nav-container`, sized
  `height:var(--vh100)` when `.menu` is active. Links use the same
  `.para` type ramp `clamp(32px, 8.53vw, 42px)` at `line-height:131%`,
  positioned `flex-direction:column; justify-content:flex-end; left:20px;
  padding-bottom:20px`.
- **Open transition:** `#nav-container { height:0 → 100vh }` over
  `0.6s cubic-bezier(.65, 0, .35, 1)`. Links stagger by `--index` with
  `transition-delay: calc(.2s + (var(--index) * .03s))`.

### Marquee team list (Studio page, observed in CSS)
- **Anatomy:** `<section.studio#team><ul><li><div><p>...</p></div></li>...</ul></section>`
- **Animation:** `@keyframes team { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`,
  applied as `animation-name:team; animation-iteration-count:infinite;
  animation-play-state:paused; animation-timing-function:linear`. Each
  of the 5 rows has a different `animation-duration` (105s / 110s / 115s
  / 120s / 125s) so the rows drift out of phase. `ul.prepared` flips
  play-state to `running`.

### Modal / Lightbox
- **Not observed on the homepage** (Tendril uses inline click-through
  to project pages, not a JS modal). The Vimeo player has its own
  fullscreen lightbox but that lives in `player.module__eccd2d4a.js`,
  not the page.

---

## JavaScript & Libraries

The site does not use a SPA framework. It is a server-rendered
WordPress page that is hijacked at runtime by a custom JS bundle
(`tendril.js?v1.36`) using jQuery + smoothState + a hand-rolled
SmoothScroll engine. Vimeo content is delivered via iframe embeds to
Vimeo's own player (`@vimeo/player v2.30.4`, served from
`https://player.vimeo.com/api/player.js`); the page also pulls
Vimeo's `player.module.js` (VimeoPlayer v4.46.60) when iframes resolve.
Two analytics tags (Universal Analytics `UA-59750802-1` and GA4
`G-Y37FCG633H`) are loaded via GTM. Cloudflare Beacon RUM is loaded
deferred. The full asset set (98 playwright files) totals
~38.2 MB.

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| WordPress | 7.0 | `<meta name="generator" content="WordPress 7.0">` in HTML | Page ID 8 |
| jQuery | 3.7.1 | `jquery-core-js` handle + `jquery.min__2ab3a298.js` banner `jQuery v3.7.1` | Loaded from `wp-includes/js/jquery/jquery.min.js` |
| jQuery Migrate | 3.4.1 | `jquery-migrate-js` handle + `jquery-migrate.min__432ffb50.js` | Loaded with `?ver=3.4.1` |
| jQuery Chosen | (legacy) | `chosen-sprite.png`, `.chosen-container`, `.chosen-results`, prototype methods in tendril.js (e.g. `s.prototype.activate_field`, `loader.prototype.defaultHtml`) | Used by career-form selects; bundled into `tendril.js`, not loaded separately |
| smoothState | (unversioned) | `Website._smoothState = e.smoothState({...})`, `e.fn.smoothState` registration, `e.smoothStateUtility` | jQuery plugin by Jonathan Sullivan — intercepts anchor clicks for SPA-style transitions without a real router |
| SmoothScroll (Tendril custom) | (Tendril-internal) | `class SmoothScroll{constructor(...){...}}`, methods `_init/_scroll/_resize/_lock/_unlock/register_handlers`, exposed as `Website._SmoothScroll` | The bespoke scroller that drives the parallax + reveal timeline |
| Vimeo Player API | 2.30.4 | `player__d04eaee2.js` banner `@vimeo/player v2.30.4 | (c) 2026 Vimeo | MIT License` | Loaded via `https://player.vimeo.com/api/player.js` |
| VimeoPlayer | 4.46.60 | `player.module__eccd2d4a.js` banner `VimeoPlayer - v4.46.60 - 2026-06-17` | Used inside `<iframe>` player hosts |
| Vimeo core-js | 3.47.0 | `vendor.module__788eda65.js` `core-js v3.47.0` | Polyfills inside VimeoPlayer |
| Vimeo vendor (React etc.) | 17.0.2 (React) | `vendor.module__788eda65.js` `version:"17.0.2"` | Bundled into VimeoPlayer |
| Vimeo vuid cookie | (unversioned) | `vuid.min__c5d1ecc1.js` | Sets `vuid` cookie for analytics |
| Google Analytics 4 | `G-Y37FCG633H` | `gtag('config', 'G-Y37FCG633H')`, `js__52a21b0f` GTM container | Via GTM `gtm.js?id=G-Y37FCG633H` |
| Universal Analytics | `UA-59750802-1` | `gtag('config', 'UA-59750802-1')`, `js__41c65411` GTM container | Legacy, still firing |
| Google Tag Manager | (4.x) | `googletagmanager.com/gtag/js?id=...&gtm=4e66h0`, `cx=c` parameter | Container-loaded via `gtag.js` |
| Cloudflare Beacon (RUM) | 2024.11.0 | `<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447" integrity="..." data-cf-beacon="{...}">` | Token `b4e69e5f5bf040fd898ec386b97e748f` |
| WordPress SimpleTags (TaxoPress) | 3.50.0 | `frontend__d55542b3.js` + `frontend__92aa2c5f.css` (`taxopress-table-row`, `taxopress-see-more-link`) | Provides the "see more" toggle for the careers taxonomy table |

The full script inventory lives in `tools/tmp/tendril/playwright/js/`
(`tendril__b5e878e2.js` is the 113 KB controller; the 365 KB and
495 KB `js__*` blobs are the GTM container JSON payloads).

### Global JS object shape (Tendril custom)

`var Website = { _register, _init, _base, _controllers, _events,
_functions, _SmoothScroll, _smoothState, _transition, _resize, _scroll
}` plus a sibling `var Global = { _register, _functions, _interaction }`.

- `Website._init(true)` runs `Website._functions.lighthouse()` first
  (adds `body.lh` if the UA contains "lighthouse"), then base setup,
  then per-controller `_init()` for any element with a `controller`
  attribute (`global`, `homepage`, `form`, etc., looked up as globals
  on `window`), then `_events()`.
- `Website._SmoothScroll` is instantiated with `{container: #smoothscroll,
  main: #main}`; on `body.lh` it is replaced by a no-op and
  `body.lh .smoothscroll:not([smoothscroll=fixed])` is forced to
  `transform:none`.
- `Website._scroll._init()` runs each registered controller's
  `_scroll._init` (e.g. `Homepage._scroll.splash.layout`, then
  `.render`; `.color.render` for color-block transitions on the work
  pages).
- `Global._interaction` exposes `{form, gallery, goto, header, menu, tab}`.
  `Global._interaction.goto(targetTop)` is the imperative scrollTo
  used by the form "submit" flow.
- `Website._functions.progress({position, top, bottom, scale, max, min})`
  is a small linear-interpolation helper used by the `.color` scroll
  render. Implementation:
  `let {position, top, bottom, scale=100, max=false, min=false} = e;
   let l = (position - top) * scale / (bottom - top);
   if (max !== false) l = Math.max(l, max);
   if (min !== false) l = Math.min(l, min);
   return l`.
- `Website._functions.get_top(el)` walks up the DOM tree summing
  `offsetTop` values until `parentNode` is null — used by every
  controller's `layout()` to cache the resting Y position of the
  element it controls.
- `Website._functions.lighthouse()` reads
  `navigator.userAgent.toLowerCase().indexOf("lighthouse") > 0` and,
  if true, sets `Website._register.lighthouse = true` and adds
  `body.lh`. This is the single mechanism that disables SmoothScroll
  for the bot.

### SmoothScroll internals (the heart of the page)

`SmoothScroll` is a class declared in `tendril.js`. It is
instantiated with `{container: #smoothscroll, main: #main}`. Per
`body:not(.lh)`, SmoothScroll then sets `body { position:fixed;
overflow:hidden }` and `main { position:fixed; top:0; left:0; width:100%;
overflow-y:scroll }` — i.e. it intercepts the browser's native scroll
on `#main` and re-implements it as a `transform:translate3d(0,
target, 0)` on `#smoothscroll`, driven by `wheel` and `touchmove`
events on `document`.

Internal state (read off the constructor and the `register_handlers`
method):

- `this._document.main_scroll = #main` (the actual scrollable element)
- `this._transition.position` (current eased scrollTop in px)
- `this._transition.target` (target scrollTop in px)
- `this._transition.baseline` (render-frame top, used by every
  controller's `render`)
- `this._transition.direction` (`"down"` or `"up"`)
- `this._transition.duration` (ms, derived from `delta * (1 -
  this.smoothScroll)`)
- `this.handlers.wheel` / `this.handlers.touchstart` /
  `this.handlers.touchmove` / `this.handlers.touchend` — bound
  via `_SmoothScroll.register_handlers(this.handlers)` only when
  not a Lighthouse bot.
- `this.smoothScroll` — `1` for desktop (instantaneous), `.08` on
  touch (so the document gets a gentle glide).

The header uses an `easeOutCubic` for its scroll-out animation
(`.transition { transform:translateY(-100%) }`) and `easeInOutCubic`
for the form-submit `Global._interaction.goto(...)` smooth-scroll
over 800 ms.

### Controller map (controllers discovered by the `_controllers` walk)

| Controller (global) | `controller=` HTML attr | Pages observed | What it owns |
| --- | --- | --- | --- |
| `Website` | n/a (always present) | all | the global init + `_events` |
| `Homepage` | `homepage` | `/` | `_scroll.splash`, `_scroll.iframe`, `_scroll.image`, `_scroll.reveal`, `_scroll.footer` |
| `Work` | `work` (not seen on `/` but discovered in JS) | `/work` | `_interaction.hover.image/leave/move/move_image` — a cursor-tracked preview panel (`#work-hover`) that lerps with `.09` smoothing factor |
| `WorkSingle` | n/a | `/work/<slug>` | `_interaction.credits._init` — expands the credits block on `[color-block]` sections |
| `Studio` | (inferred) | `/studio` | would own the `.studio#team` marquee (`ul.prepared`) and `.studio#pure-signal` blockquote |
| `Careers` | (inferred) | `/careers` | owns `_interaction.form.career` and the SimpleTags taxonomy table |
| `Contact` | (inferred) | `/contact` | owns the contact section links |
| `Header` | n/a (runs unconditionally) | all | runs `logo()` on mouseenter (plays the logo loop video) and the menu button toggle |

### Scroll controller catalog (read from `tendril.js` source)

Each `[scroll="…"]` element gets a one-time `layout()` call (which
caches `t.top` and, for some, swaps attributes), then a per-frame
`render()` call which writes `style.transform` and `style.opacity`
inline. The catalog:

| `[scroll=…]` attr | Layout (one-shot) | Render (per-frame) | Triggers `.reveal` |
| --- | --- | --- | --- |
| `splash` | grab `div` and `video`, hook `onended` to `Global._interaction.goto(window.innerHeight)` after `~0s` timer | (no per-frame render — uses SmoothScroll's direct write of `--transform` and `--scale`) | n/a |
| `iframe` | copy `data-src` to `src` and rewrite the URL to ensure `background=1` and drop `autoplay=1` from the iframe URL, mark `t.loaded = true`, then create `t.api = new Vimeo.Player(t)` and call `t.api.pause()` until in view | if in view → `t.api.play()`; if out of view → `t.api.pause()` | n/a |
| `image` | cache `t.top` | when scrolled into view, copy `data-srcset` to `srcset` and `data-src` to `src` | n/a |
| `reveal` | cache `t.top`, mark `t.infinite = !!t.closest('.infinite')` | when scrolled into view (`baseline > top - 70` OR near end of doc), add `reveal reveal-animation` classes; clear `reveal-animation` after a `setTimeout` | yes |
| `footer` | cache `t.parentElement.offsetHeight` as `t.height` | compute `t.position = -((t.parentElement.offsetTop - (baseline - t.height)) * 0.8)` and `t.opacity = clamp((0.8*t.height - abs(t.position)) / (0.8*t.height), 0..1)`, write `transform: translate3d(0, ${position}px, 0); opacity: ${opacity}` | n/a |
| `color` (work page) | (none) | `progress({position, top:0, bottom:1.5*window.innerHeight, scale:100, max:0, min:100})` and write to `style.transform` / `style.opacity` | n/a |
| `infinite` | mark children as `infinite` | when scrolled past, remove `infinite` class on the next `infinite_block` chunks | n/a |

### `Global._interaction` API surface (read from `tendril.js`)

- `Global._interaction.goto(target, immediate=false)`:
  - `target` is a number (px) or a DOM element or an id string.
  - If `immediate` (second arg) is truthy, calls
    `Website._SmoothScroll.scroll({resize:true, position:s,
    disable_transition:true, force:true})` (no animation).
  - Otherwise calls
    `$(Website._SmoothScroll._document.main_scroll).stop().animate(
    {scrollTop:s}, 800, "easeInOutCubic")` and locks the header
    for 2 s after to suppress the show/hide transition during the
    smooth scroll.
- `Global._interaction.form.career(form)` — completes a career form:
  locks height → swaps content to "submitted" message → scrolls to
  the parent `<section>` over `easeInOutCubic` 800 ms.
- `Global._interaction.form.newsletter(form)` — adds `.complete` to
  the form (CSS handles the "Thank you for subscribing!" fade-in).
- `Global._interaction.gallery.next(button)` / `.prev(button)` —
  advance/retreat a gallery by `+1/-1` step; sets a CSS variable
  `--active` on the gallery container and applies `next`/`prev`/
  `was-active` classes to the new/old/previous figures for the
  `transform:translate3d(±30%/0, 0, 0)` slide-in.
- `Global._interaction.gallery.slide(images, total, active, dir)` —
  helper that writes `--active` and orchestrates the figure class
  swap with two `setTimeout` (~1410 ms each) to mirror the
  `transition:transform 1.2s` CSS.
- `Global._interaction.header.logo()` — `document.getElementById("logo
  video").play()` (replays the logo loop on hover).
- `Global._interaction.menu` / `Global._interaction.tab` — declared
  in the JS but no implementations captured in this dump.

### Footnote on the Vimeo iframe plumbing

The 8 `<iframe>` elements in the homepage reel are loaded **without**
an initial `src` attribute. `tendril.js` reads `data-src`, normalises
the URL so the live player is in `background=1` mode (no controls,
muted), and only assigns the `src` when the iframe enters the viewport
(`t.top < baseline`). For each iframe that successfully resolves,
tendril constructs a `new Vimeo.Player(t)` instance, immediately calls
`pause()`, and then plays/pauses based on scroll position. The Vimeo
Player API is loaded globally from `https://player.vimeo.com/api/player.js`
(74 KB minified, `@vimeo/player v2.30.4`).

---

## Animations (Catalog)

### CSS @keyframes

Two `@keyframes` are defined in `tendril.css` (vendored from
`form/chosen` and `studio#team`); both have paired `-webkit-keyframes`
prefixes. The Vimeo player CSS file (237 KB) ships ~25 more, but those
live inside the iframe.

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `slideDown` | `playwright/css/tendril__48d47c76.css:1` (search anchor) | `1s` (used as `animation:1s slideDown`) | default `ease` (bounce via keyframe values) | `form fieldset span.error { animation:1s slideDown }` — fires when an error span is shown; `0% translateY(-100%) → 50% translateY(8%) → 65% -4% → 80% 4% → 95% -2% → 100% 0` (a settle bounce) |
| `team` | `playwright/css/tendril__48d47c76.css:1` (search anchor) | `105–125s` (one row each) | `linear` | `<ul.prepared>` flips `animation-play-state:paused → running`; `transform: translateX(0) → translateX(-50%)` (used twice in the markup to loop seamlessly) |

### Reveal / fade (CSS-driven, JS-toggled)

These are not `@keyframes` but rather transition pairs the SmoothScroll
controller enables by adding the `.reveal` class when a `[scroll=reveal]`
element enters the viewport.

| Effect | Where | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `fade-in.reveal` opacity `0 → 1` | `body:not(.lh) .fade-in.reveal { transition:opacity .6s cubic-bezier(.65,0,.35,1) .3s }` | `0.6s` | `cubic-bezier(.65, 0, .35, 1)` (≈ ease-in-out) with `0.3s` delay | when JS adds `.reveal` to a `.fade-in` element on scroll |
| `figure[scroll=reveal]` clip-path + opacity | `body:not(.lh) figure[scroll=reveal] { transition:clip-path 1s cubic-bezier(.65,0,.35,1) .3s, opacity 1s cubic-bezier(.65,0,.35,1) .3s }` | `1s` | `cubic-bezier(.65, 0, .35, 1)` with `0.3s` delay | when JS adds `.reveal` to a figure; clip-path goes `inset(0 0 100% 0) → inset(0 0 0 0)`, opacity `0 → 1` |
| Header sticky padding shrink | `header.animate div.container { transition:padding-top .4s ease-out, padding-bottom .4s ease-out }` | `0.4s` | `ease-out` | when `body` crosses a scroll threshold and JS swaps `.init` → `.sticky` |
| Header show/hide on scroll-out | `@media all and (min-width:1023px) header { transition:transform 1s cubic-bezier(.65,0,.35,1) }` | `1s` | `cubic-bezier(.65, 0, .35, 1)` | when JS adds `.transition` (`transform:translateY(-100%)`) on scroll past hero |
| Footer hello rotator span | `footer #footer-intro h2#footer-hello div span { transition:opacity .6s cubic-bezier(.65,0,.35,1), transform .6s cubic-bezier(.65,0,.35,1) }` | `0.6s` | `cubic-bezier(.65, 0, .35, 1)` | every ~3s JS swaps `.active` / `.was-active` / `.next` classes |
| Underline draw (link hover) | `header nav a::after { transition:width .4s ease-out }`, `footer #footer-copyright a::after { transition:border-color .4s ease-out, width .4s ease-out }` | `0.4s` | `ease-out` | `:hover` on link |
| Mobile menu open | `header.menu-transition #nav-container { transition:height .6s cubic-bezier(.65,0,.35,1) }` + `nav a { transition:opacity .6s cubic-bezier(.65,0,.35,1) calc(.2s + (--index * .03s)) }` | `0.6s` + per-link stagger | `cubic-bezier(.65, 0, .35, 1)` | tap on `<button action="menu">` |
| Clock hands settle | `footer #footer-locations li p.time span.clock::after, ::before { transition-timing-function:cubic-bezier(0.1,2.7,0.58,1) }` | (inherits ~0.6s) | `cubic-bezier(0.1, 2.7, 0.58, 1)` (spring overshoot) | every second, JS sets `--hours` and `--minutes` rotation degrees |
| Splash transform | `#homepage-splash { transition:transform 1s cubic-bezier(.65,0,.35,1) }` (implicit via SmoothScroll direct-write) | per-frame | n/a | SmoothScroll writes `--transform` and `--scale` each scroll tick |
| Form field underline focus | `form fieldset::after { transition:border-bottom-color .2s }` | `0.2s` | default ease | input focus |
| Newsletter complete swap | `footer form.complete fieldset::before { transition:opacity .6s ease-out .6s }` and `fieldset div { transition:opacity .6s ease-out }` | `0.6s` | `ease-out` (`.6s` delay on success message) | on AJAX success |
| Footer reveal | `footer { will-change:opacity, transform }` driven by scroll | n/a | n/a | SmoothScroll writes inline `style="transform: translate3d(...); opacity: ..."` each tick |
| Image hover (work page only) | `div.gallery.animation .gallery-images figure:not(.not-active) img { transition:transform 1.2s }` | `1.2s` | default ease | gallery prev/next click |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| SmoothScroll (custom) | Per-frame write of `--vh`, `--vw`, `--vh100`, `--vw100`, `--smoothScroll`, `--transform`, `--scale`, `--opacity`, `--hours`, `--minutes` | `wheel` and `touchstart`/`touchmove`/`touchend` events on `document` | SmoothScroll wraps `body:not(.lh)` in `position:fixed`; `main` becomes the actual scrollable element (`overflow-y:scroll`). On touch devices smoothScroll is disabled. |
| smoothState | Anchor-click interception → AJAX page load → `Website._transition._init(false)` → swap `#smoothscroll` content | Click on any non-blacklisted `<a>` inside `#smoothscroll` | Blacklist: `.no-smoothState`, `[href^="mailto:"]`. Cache length 0 (no caching). |
| SmoothScroll + controller | `Website._scroll.color.render` computes a `progress(...)` and writes `transform/opacity/clip-path` on `.page[scroll^=color]` and `section[color-block]` | on each scroll tick when the controller is bound to a work-page `[scroll="color"]` element | Drives the work-page color-block fade-in transition |
| Vimeo Player (iframe) | Per-iframe autoplay + loop + background mode | on `data-ready=true` JS removes the Vimeo spinner and starts playback with `?autoplay=1&loop=1&autopause=0&background=1` | Tendril proxies playback via `player.vimeo.com`, not `i.vimeocdn.com`, so the iframes inherit the player.js API |

### Page transitions

- `smoothState` does a fade-style swap: on anchor click it calls
  `l.onBefore(...)` (which triggers `Website._transition._init(false)`),
  fetches the new page, then on render calls
  `Website._transition.end_transition_queue(...)`.
- `body.transition` and `body:not(.lh):not(.ready)` both have
  `opacity:0; pointer-events:none; transition:opacity .4s ease-out`
  — a 0.4s ease-out crossfade between pages.
- No transition on direct-link first paint (`body.ready` is added 100ms
  after `body.init` if not a Lighthouse bot).

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump (no `.glb`, `.gltf`, `.obj`,
`.fbx`, `.usdz`, no `<model-viewer>` usage in the rendered DOM).
The `model-viewer` selector does appear in `tendril.css`
(`.flowing-blocks div.blocks .block figure model-viewer { --progress-bar-color:#fff; --progress-bar-height:0 }`),
suggesting the work-page template may host 3D assets in some cases,
but no model-viewer elements rendered on the homepage.

### Fonts

| Family | Weights (registered) | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| HK Grotesque | 300, 300i, 400, 400i, 500, 500i, 600, 600i, 700, 700i | eot + woff + woff2 | `tools/tmp/tendril/playwright/fonts/HKGrotesk-Regular__9edd50ea.woff2` (30 KB) and `HKGrotesk-SemiBold__3aaa18ed.woff2` (31 KB) were fetched live; the other weights are referenced from `tendril.css` (`url('../fonts/HKGrotesk-*.eot|woff2|woff')`) but not captured in the playwright dump | yes (theme bundle) |

### Images

The homepage lazy-loads 16 hero images via `<img scroll="image"
data-src data-srcset sizes>` plus the static B Corp mark and the inline
SVG logo. Dimensions below are the largest `srcset` width or the
playwright-dump image (when its source URL was recoverable from
manifest content-type sniff).

| Local dump path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/tendril/playwright/images/1481311326-5daefe5e3cc3c0ad168b7609d99727504a1c9cc3231f399e3265b144c9102030-d__0ee1e4a2` | PNG | 2160×2160 | 258 KB | `https://tendril.studio/wp-content/uploads/2026/02/AlienPhase0_YeseongPicks2-1.png` | "Alien: Earth" hero still (square 1:1) |
| `tools/tmp/tendril/playwright/images/2014068772-6958be9636888c5223a3643cff1ec7d1d64ef514cb3bff26db71066345f87f75-d__cc483952` | PNG | 1080×1080 | 252 KB | `https://tendril.studio/wp-content/uploads/2026/02/99.png` | "IBM z17" hero still (square 1:1) |
| `tools/tmp/tendril/playwright/images/2078174800-8c982921bb3b449695a097315bd8da10c5f0869bc50b9a5fcc95027ea0f4b418-d__1e91f143` | PNG | 3840×2160 | 431 KB | `https://tendril.studio/wp-content/uploads/2022/09/HSR_STILLS_16x9_4K_06-scaled.jpg` | "Hublot Big Bang Tourbillon Sam Ross" hero (16:9) |
| `tools/tmp/tendril/playwright/images/2127603764-fb6a1050a0a8136d768e8714ee829772d10d22fde0ec3ce6b22c24c6ef4b848d-d__bbc28be8` | PNG | 1920×1080 | 82 KB | `https://tendril.studio/wp-content/uploads/2024/12/image-10-1.png` | "Tiffany & Co." hero (1:1) |
| `tools/tmp/tendril/playwright/images/2127578469-fdc23250c99c34a32478cd345920f8ed6f4260fcef79561db34fdaf3b8ba8153-d__015aa2d6` | JPG | 2560×1440 | 45 KB | `https://tendril.studio/wp-content/uploads/2024/06/HUBLOT_ARSHAM_03_LED_WALL_01143vH_4k_16x9.jpg` | "Hublot × Arsham Droplet" hero (16:9) |
| `tools/tmp/tendril/playwright/images/1971188332-9d8820b99dd51576d9c384069fef7d63c139fb455171c87f9c95da0e41b858f9-d__eb1ee8fd` | JPG | 3840×2160 | 233 KB | `https://tendril.studio/wp-content/uploads/2022/09/MSD_ASSETS_Productivity_04_Revised-scaled.jpg` | "Microsoft Hybrid Work" hero (4:3) |
| `tools/tmp/tendril/playwright/images/1467848022-498733188b8b70b81911084ff39636cfbe995374e20e0b7474049cf9aa3c041e-d__e5f519f1` | JPG | 1080×1080 | 23 KB | `https://tendril.studio/wp-content/uploads/2022/06/MS_EMOJI_380_v002_4k_1035-2048x1152-1.jpg` | "Microsoft Emojis" hero (1:1) |
| `tools/tmp/tendril/playwright/images/bcorp__bb91b0ae.png` | PNG | n/a (raster logo) | 19 KB | `https://tendril.studio/wp-content/themes/tendril/assets/img/bcorp.png` | Certified B Corporation mark in footer |
| `tools/tmp/tendril/playwright/images/3M61GtFVZPADcPD__9dc60f84` | PNG | small (~1 KB) | 10 KB | (image sniffed from manifest, no readable URL) | likely a small static asset — possibly a sprite or thumbnail |
| `tools/tmp/tendril/playwright/images/EwQodNF-I646FYX__9f83783f` | JPG | small | 2 KB | unknown | (residual playwright artifact) |
| `tools/tmp/tendril/playwright/images/_bWrRs1Y930yEHH__aaa77c6b` | JPG | small | 3 KB | unknown | (residual playwright artifact) |
| `tools/tmp/tendril/playwright/images/jkTHqpKj6d9AXJz__fadf1a83` | JPG | small | 5 KB | unknown | (residual playwright artifact) |
| `tools/tmp/tendril/playwright/images/LtY0ay97VXWybed__be3500dd` | JPG | small | 7 KB | unknown | (residual playwright artifact) |
| `tools/tmp/tendril/playwright/images/1__8cb449a3` | text | (1 byte — likely empty/1×1) | 0 KB | unknown | (residual playwright artifact, 86 bytes) |

Other homepage images live in the WordPress media library and were not
mirrored into the dump; their source URLs and dimensions are visible in
the `data-srcset` of the rendered DOM (full listing reproduced under
"Sources" below). All `<img>` tags use `loading="lazy"` semantics via
the `data-src` attribute pattern (only the `data-src` URL is set;
the actual `src` is filled in by `tendril.js` when the image enters
the viewport).

### SVGs & icons

- **Inline SVGs observed in HTML:** 2 — the `192×192` header logo and
  the `42×42` footer "hello" rosette.
- **Standalone SVG files in dump:** 0 (no `.svg` files were captured;
  icons live inline).
- **Icon system:** none — Tendril ships its own paths inline (logo,
  flower mark, hamburger button built from CSS `::before`/`::after`).

### Audio & video

Vimeo iframes load H.264 MP4 with dash-manifest adaptive bitrate; the
captured `.mp4` files in the dump are the progressive-download
versions fetched alongside the iframe HTML. The first three are Tendril's
own marketing assets (logo animation + splash reel), the rest are
Vimeo's playable MP4 renditions captured at the same quality they are
served to the iframe.

| Local dump path | Type | Dimensions / duration | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/tendril/playwright/media/Explosion_200x200__ecb95c14.mp4` | MP4 H.264 | 200×200 (logo loop) | 280 KB | `https://tendril.studio/wp-content/uploads/2022/03/Explosion_200x200.mp4` | Logo bumper — loops over the SVG mark in the header |
| `tools/tmp/tendril/playwright/media/LandingPage__69f2624a.mp4` | MP4 H.264 | full-bleed (splash reel) | 6.8 MB | `https://tendril.studio/wp-content/uploads/2022/12/LandingPage.mp4` | Splash video, fixed behind the hero |
| `tools/tmp/tendril/playwright/media/27bac82a-5c8d-46a5-8533-3763252ee729__bb7873ea.mp4` | MP4 H.264 | 1920×1080 (~7.1s, 5989 kbps max rendition) | 2.3 MB | Vimeo `player.vimeo.com/video/1168644649` (Louis Vuitton × F1) | `playlist__b09ad837.json` (7.1 s, 5 renditions up to 5989 kbps) |
| `tools/tmp/tendril/playwright/media/d883d339-cc8c-4394-bad4-b1eaf2f43fe6__e44412c5.mp4` | MP4 H.264 | 1080×1080 (~7.5 s, 2047 kbps) | 3.0 MB | Vimeo `player.vimeo.com/video/1133545912` (Figure.03) | `playlist__4a337b02.json` (7.5 s, 7 renditions up to 11616 kbps / 4 K) |
| `tools/tmp/tendril/playwright/media/5b432e50-ab18-489a-b081-8cee81c7599f__44c86600.mp4` | MP4 H.264 | 1920×1080 (~4.6 s, 5555 kbps) | 5.1 MB | Vimeo `player.vimeo.com/video/1168991070` (Coinbase CB1) | `playlist__85f47adf.json` (4.6 s, 5 renditions) |
| `tools/tmp/tendril/playwright/media/1a278bbb-6f28-4202-84b2-f2f469be9d52__756e9d4d.mp4` | MP4 H.264 | 1920×1080 (~3.5 s, 5074 kbps) | 3.3 MB | Vimeo `player.vimeo.com/video/1168644649` (LV × F1 alt rendition) | `playlist__0d33af5d.json` (3.5 s, 7 renditions up to 17285 kbps / 4 K) |
| `tools/tmp/tendril/playwright/media/ff3f9567-5df5-42a1-80cd-ea3a4a2f11ec__1e92b630.mp4` | MP4 H.264 | 1920×1080 (~7.2 s, 1248 kbps) | 3.7 MB | Vimeo `player.vimeo.com/video/1082970591` (IBM LinuxONE) | `playlist__0ef80c3d.json` (7.2 s, 5 renditions) |
| `tools/tmp/tendril/playwright/media/505be799-26ae-4235-beaa-9e011e30d074__b1318d1a.mp4` | MP4 H.264 | 1920×1080 (~7.5 s, 4812 kbps) | 2.9 MB | Vimeo `player.vimeo.com/video/1133545912` (Figure.03 alt) | `playlist__79b9102d.json` (7.5 s, 7 renditions up to 14750 kbps) |
| `tools/tmp/tendril/playwright/media/1e8c5ef9-3d15-4d32-abf8-e61b0d658311__76dacb6c.mp4` | MP4 H.264 | 1920×1080 (~3.7 s, 5345 kbps) | 1.1 MB | Vimeo `player.vimeo.com/video/1047265754` (ESPN CFP 2025) | `playlist__ecadace7.json` (3.7 s, 5 renditions) |
| `tools/tmp/tendril/playwright/media/a3e168c6-4810-4643-90a3-4da613d80555__404a5133.mp4` | MP4 H.264 | n/a | 88 KB | unknown / segment | (Vimeo manifest partial) |
| `tools/tmp/tendril/playwright/media/be6e7706-d7e8-455d-94a6-3b1615a852f0__fd457017.mp4` | MP4 H.264 | n/a | 43 KB | unknown / segment | (Vimeo manifest partial) |
| `tools/tmp/tendril/playwright/media/a3465cad-74cd-4dc1-96d0-e07b4b322ff7__9b5e5d8c.mp4` | MP4 H.264 | n/a | 3 KB | unknown / segment | (Vimeo manifest partial — first segment) |

Seven `.json` files in `tools/tmp/tendril/playwright/other/playlist__*.json`
are the Vimeo DASH `playlist.json` manifests, one per playable video.
Each lists 5–7 video renditions (240p → 4 K) with codec `avc1.6400xx`,
bitrates 119 kbps → 17.3 Mbps, and durations 3.2–7.5 s. The
`settings__5f1e5b16.json` is the Vimeo embed-player configuration
(`embed_player_fake_door_*` features all disabled, heartbeat
cadence `ramp:[10]`).

---

## Motion & Interaction

### Principles

- **Single easing curve:** `cubic-bezier(0.65, 0, 0.35, 1)` is the
  signature ease for the entire site — used for header transitions,
  footer reveal, mobile menu open, page transition, work-block reveal,
  caption fade, and project-to-project transition.
- **Spring overshoot easing:** `cubic-bezier(0.1, 2.7, 0.58, 1)` is
  used only on the clock hands (the `transition-timing-function` is
  overridden on the `::before` and `::after` of `span.clock`).
- **Default duration:** `0.6s` for color/text fades, `1s` for clip-path
  reveals, `0.4s` for micro hover transitions (underline draw, button
  color), `0.2s` for form field underline focus.
- **Stagger:** links in the mobile menu stagger by `--index`
  (`calc(.2s + (--index * .03s))`); `.fade-in` items get a fixed
  `.3s` delay.
- **No `prefers-reduced-motion`** handler in `tendril.css`. (The
  Vimeo player CSS does include a few `prefers-reduced-motion:reduce`
  overrides for its like / share / watch-later buttons, but the page
  itself does not opt out.)

### Specific behaviors

- **Link hover:** underline draws in from the right (or left, depending
  on element) over `0.4s ease-out` via the `::after` `border-bottom`
  trick. On the work page, project list items fade from `#000` to
  `var(--lightgrey)` over `0.4s ease-out` when filtered out.
- **Button press:** no explicit press effect; the only button is the
  mobile-menu hamburger which animates its two bars into an X over
  `0.6s cubic-bezier(.65,0,.35,1)` (border-color, top, transform).
- **Section reveal on scroll:** `figure[scroll=reveal]` and
  `.fade-in.reveal` are toggled by the SmoothScroll controller. The
  reveal pairs clip-path + opacity (figures) or just opacity (text).
  Sibling elements are not explicitly staggered, but the `.3s`
  transition-delay gives a slight sequential feel.
- **Page transition:** `body.transition { opacity:0; pointer-events:none;
  transition:opacity .4s ease-out }` — a 0.4s ease-out crossfade
  between smoothState-loaded pages.
- **SmoothScroll core:** on `wheel` (delta sampled and eased into a
  target scroll) and `touchmove` (1:1 track). SmoothScroll writes a
  CSS variable `--smoothScroll:1` on desktop and `--smoothScroll:.08`
  on touch; the eased scroll is applied via `transform:translate3d` on
  the smooth-scroll container.
- **Lighthouse bot detection:** `navigator.userAgent.indexOf("lighthouse")>0`
  flips a flag that disables SmoothScroll and forces
  `.lh [smoothscroll]:not([smoothscroll=fixed]) { transform:none }`,
  so the bot sees the same content laid out without JS animation.

### Reduced motion

**Not observed.** No `@media (prefers-reduced-motion: reduce)` rules in
`tendril.css`, no JS hook in `tendril.js` to disable the SmoothScroll
controller when the user prefers reduced motion. The Vimeo player CSS
does have `prefers-reduced-motion:reduce` overrides for its
like/share/watch-later button micro-animations, but Tendril does not
extend that to its own animations.

---

## Content & Voice

- **Tone:** confident, slightly poetic, technical-but-warm. The hero
  H1 reads as a manifesto: *"Most innovation goes unseen. Not because
  it isn't remarkable, but because it lives somewhere the eye can't
  reach. We make it impossible to miss."* (paraphrased — the actual
  copy is reproduced in the rendered DOM under `#homepage-hero .h1`).
- **Sentence length:** medium to long in the hero copy; short and
  declarative in project titles ("Louis Vuitton x F1", "Figure.03",
  "Hublot MP-10").
- **Capitalization:** Sentence case in body copy; Title Case in
  project titles ("Hublot Big Bang Tourbillon Sam Ross"). CTA labels
  are sentence case ("Sign up").
- **Punctuation:** Em-dashes used in copy ("Clio Award–winning",
  "Tendril and Hublot joined forces…"). Em-dash is U+2013 (en-dash)
  in this case, not U+2014.
- **CTA vocabulary:** the homepage has no CTAs beyond the inline
  "Sign up" newsletter button. The footer links are passive
  ("Vimeo", "Twitter", "Instagram", "Behance") with no call-to-action
  phrasing. Project tiles are themselves the CTA — click the tile to
  open the project page.
- **Numbers:** phone numbers written with periods, not dashes
  (`416.504.1873`). Postal codes use full 7-character Canadian
  format (`M6J 3G4`).
- **Multilingual:** the footer "hello rotator" cycles through
  Spanish ("Hola!"), Hebrew ("Shalom!"), Hawaiian ("Aloha!"),
  French ("Bonjour!"), English ("Hello!"), and Japanese
  ("Kon'nichiwa!") every ~3 seconds.

---

## Information Architecture

The site is small. Observed (or referenced) routes:

- `/` — marketing homepage (the only page captured)
- `/work` — the work index; lists the same projects as on the
  homepage reel, presumably with thumbnails and filters
  (`section#work-filters`)
- `/work/{slug}` — individual project pages, e.g.
  `/work/lv-f1`, `/work/alien-gestation`, `/work/ibm-z17`,
  `/work/figure02`, `/work/figure03`, `/work/coinbase` (referenced
  as `position_2` in the homepage), `/work/espn-cfp-2025`,
  `/work/tiffany-holiday-icons`, `/work/arsham-droplet`,
  `/work/hublot-samross`, `/work/mp-10`, `/work/deservecards`,
  `/work/cashapp`, `/work/worlds2022`, `/work/refresh`,
  `/work/aize`, `/work/autostorerouter`, `/work/microsoft-hybrid-work`,
  `/work/emojis`, `/work/microsoftavatars`, `/work/ibm-linuxone`
- `/studio` — studio / about page (CSS contains `.studio#pure-signal`,
  `.studio#services`, `.studio#key-people`, `.studio#team` — strong
  evidence of a multi-section studio page with a "pure signal"
  manifesto block, services list, key people grid, and team marquee)
- `/careers` — careers index (CSS contains `.careers ul li`,
  `section#career-hero`, `section#career-form`, `section#career-share`,
  `.career-details`, plus the `simple-tags` taxonomy table for roles)
- `/contact` — contact page (CSS contains `section#contact`,
  `section#contact-footer`, `.contact-section`, two-column variant)
- `POST https://tendril.studio/wp-admin/admin-ajax.php` (form target
  with `action=newsletter` and `action=form_career`)
- External: `https://vimeo.com/tendril`, `https://twitter.com/studiotendril`,
  `https://instagram.com/studiotendril`, `https://www.behance.net/tendril`

The WordPress `wp-json/wp/v2/pages/8` indicates there is a single
canonical page (id 8) for the homepage — i.e. the site does not have a
blog, post archive, or comment system.

---

## Accessibility

- **Color contrast:** body text `#000000` on `#FFFFFF` background is
  `21:1` (WCAG AAA). Footer text `#FFFFFF` on `#000000` background is
  also `21:1`. `--grey` (`#808080`) on white is `3.95:1` — borderline
  for body text; only used for muted captions / error placeholders
  (`form fieldset .form-input::placeholder`).
- **Focus indicators:** not explicitly styled in the captured CSS;
  default browser outline is preserved (`outline:0` is reset on the
  Eric Meyer reset but no replacement is provided).
- **Keyboard:** all links and buttons are real `<a>` and `<button>`
  elements with `href` or `type`. The hamburger button has
  `aria-label="Menu"`. The logo `<a>` has `aria-label="Homepage"`.
  The decorative SVGs have no role/aria attributes; the Vimeo iframes
  have `title="Pixel Streaming"`.
- **Screen reader landmarks:** `<main id="main">`, `<header>`, `<nav>`,
  `<footer>` are all present and labeled. `aria-label="-ignore-"` on
  the `.block` anchors is a typo of the page author's "ignore" marker
  — screen readers will read this label verbatim on every work tile.
- **Motion:** no `prefers-reduced-motion` handling on the page.
- **Alt text:** `<img>` tags use `alt=""` on every tile (decorative
  captions are in adjacent `<p><span>`). The B Corp `<figure>` uses
  `alt="Certified B Corporation"`.
- **`<html lang="en">`** is set; no `dir` attribute.

---

## Sources

Every URL referenced while writing this design.md.

- **Live site (canonical) — https://tendril.ca** (observed to 301/302 → `https://tendril.studio`)
- **Homepage rendered DOM — `tools/tmp/tendril/playwright/homepage.html`** (51,629 bytes)
- **Homepage source DOM (Cloudflare-blocked, pre-render) — `tools/tmp/tendril/html/asset_98__c83da419`** (49,976 bytes)
- **Main theme stylesheet — `tools/tmp/tendril/playwright/css/tendril__48d47c76.css`** (58,805 bytes, `tendril.css?v1.36`)
- **WordPress simple-tags CSS — `tools/tmp/tendril/playwright/css/frontend__92aa2c5f.css`** (3,238 bytes)
- **Vimeo player CSS — `tools/tmp/tendril/playwright/css/player__8e7dfe55.css`** (237,168 bytes)
- **Theme controller JS — `tools/tmp/tendril/playwright/js/tendril__b5e878e2.js`** (112,669 bytes, `tendril.js?v1.36`)
- **Vimeo player JS — `tools/tmp/tendril/playwright/js/player__d04eaee2.js`** (24,420 bytes, `@vimeo/player v2.30.4`)
- **Vimeo player module — `tools/tmp/tendril/playwright/js/player.module__eccd2d4a.js`** (896,450 bytes, `VimeoPlayer v4.46.60`)
- **Vimeo vendor (React+core-js) — `tools/tmp/tendril/playwright/js/vendor.module__788eda65.js`** (327,574 bytes)
- **GA4 GTM container — `tools/tmp/tendril/playwright/js/js__52a21b0f`** (495,477 bytes)
- **UA GTM container — `tools/tmp/tendril/playwright/js/js__41c65411`** (365,497 bytes)
- **Analytics source — `tools/tmp/tendril/playwright/js/analytics__6e0d87d9.js`** (52,310 bytes)
- **API helpers — `tools/tmp/tendril/playwright/js/api__20f3315c.js`** (67,081 bytes, SWC-compiled)
- **Vimeo vuid cookie — `tools/tmp/tendril/playwright/js/vuid.min__c5d1ecc1.js`** (1,862 bytes)
- **Cloudflare Beacon RUM — `tools/tmp/tendril/playwright/js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447__4d30e30a`** (33,228 bytes)
- **jQuery 3.7.1 — `tools/tmp/tendril/playwright/js/jquery.min__2ab3a298.js`** (87,553 bytes)
- **jQuery Migrate 3.4.1 — `tools/tmp/tendril/playwright/js/jquery-migrate.min__432ffb50.js`** (13,577 bytes)
- **jQuery 2.2.4 (legacy CDN reference) — `tools/tmp/tendril/playwright/js/jquery.min__e9e68ca9.js`** (85,578 bytes, served from `ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js`)
- **WordPress simple-tags frontend JS — `tools/tmp/tendril/playwright/js/frontend__d55542b3.js`** (1,186 bytes)
- **Vimeo iframes observed:**
  - `https://player.vimeo.com/video/1168644649?h=d2bc5b3f89` — Louis Vuitton × F1
  - `https://player.vimeo.com/video/1082970591?h=d2bc5b3f89` — IBM LinuxONE
  - `https://player.vimeo.com/video/1133545912?h=d2bc5b3f89` — Figure.03
  - `https://player.vimeo.com/video/1168991070?h=d2bc5b3f89` — Coinbase CB1
  - `https://player.vimeo.com/video/1047265754?h=d2bc5b3f89` — ESPN CFP 2025
  - `https://player.vimeo.com/video/729252337?h=67f1e54cee` — Tendril Brand Refresh
  - `https://player.vimeo.com/video/736170294?h=c1f19bea2e` — Microsoft Avatars
  - `https://player.vimeo.com/video/477598794?h=2f7f1a9f10` — Autostore Router
- **Image data-src URLs (homepage):**
  - `https://tendril.studio/wp-content/uploads/2026/02/AlienPhase0_YeseongPicks2-1.png` (2160w) — Alien: Earth
  - `https://tendril.studio/wp-content/uploads/2026/02/99.png` (1080w) — IBM z17
  - `https://tendril.studio/wp-content/uploads/2026/02/0418_Figure_AI_COMP_4K_16x9-00891.png` (3584w) — Figure.02
  - `https://tendril.studio/wp-content/uploads/2024/12/image-10-1.png` (1920w) — Tiffany & Co.
  - `https://tendril.studio/wp-content/uploads/2024/06/HUBLOT_ARSHAM_03_LED_WALL_01143vH_4k_16x9.jpg` (2560w) — Hublot × Arsham
  - `https://tendril.studio/wp-content/uploads/2024/06/2024_05_12_HBA_CG_Product_Still_001_1x1.jpg` (1080w) — Hublot × Arsham detail
  - `https://tendril.studio/wp-content/uploads/2024/02/TECH-00093-00000_1.png` (2000w) — Hublot MP-10
  - `https://tendril.studio/wp-content/uploads/2024/02/HB_MP10_Stills_040_v001-0-00-00-00-00000.png` (1920w) — Hublot MP-10 hero
  - `https://tendril.studio/wp-content/uploads/2023/04/Platform_03-1.jpg` (2560w) — Deserve Cards
  - `https://tendril.studio/wp-content/uploads/2023/04/CASHAPP_RND_D_STILL-768x960-1.png` (768w) — Cash App
  - `https://tendril.studio/wp-content/uploads/2022/09/GENERIC_TRANSITION_A_01A-0-00-01-59.jpg` (1920w) — Riot Worlds 2022
  - `https://tendril.studio/wp-content/uploads/2022/09/W22_TEMPLATE_1x1_KV_GENERIC_GROUPS-e1664466119278.png` (2160w) — Riot Worlds 2022 hero
  - `https://tendril.studio/wp-content/uploads/2022/09/HSR_STILLS_16x9_4K_06.jpg` (3840w) — Hublot Big Bang Sam Ross
  - `https://tendril.studio/wp-content/uploads/2022/06/Aize-Tendril-Design-Animation-26-1.jpg` (1080w) — Aize
  - `https://tendril.studio/wp-content/uploads/2022/06/MS_EMOJI_380_v002_4k_1035-2048x1152-1.jpg` (1039w) — Microsoft Emojis
  - `https://tendril.studio/wp-content/uploads/2022/09/MSD_ASSETS_Productivity_04_Revised.jpg` (4096w) — Microsoft Hybrid Work
- **WordPress endpoints:**
  - `https://tendril.studio/wp-json/`
  - `https://tendril.studio/wp-json/wp/v2/pages/8`
  - `https://tendril.studio/wp-admin/admin-ajax.php` (form handler)
  - `https://tendril.studio/xmlrpc.php?rsd`
- **WordPress includes:** `https://tendril.studio/wp-includes/js/jquery/jquery.min.js?ver=3.7.1`, `https://tendril.studio/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1`
- **Plugin assets:** `https://tendril.studio/wp-content/plugins/simple-tags/assets/frontend/{css,js}/...?ver=3.50.0`
- **Theme assets:** `https://tendril.studio/wp-content/themes/tendril/assets/{css/tendril.css,js/tendril.js}?v1.36`, `img/favicon/{favicon-32x32,favicon-96x96,favicon-16x16,favicon}.{png,ico}`, `img/bcorp.png`
- **Analytics endpoints:** `https://www.google-analytics.com/analytics.js`, `https://www.googletagmanager.com/gtag/js?id=G-Y37FCG633H&cx=c&gtm=4e66h0`, `https://www.googletagmanager.com/gtag/js?id=UA-59750802-1`
- **Vimeo player endpoints:** `https://player.vimeo.com/api/player.js`, `https://player.vimeo.com/video/{id}?h=...&autoplay=1&loop=1&autopause=0&background=1`
- **Vimeo analytics:** `https://vimeo.com/ablincoln/vuid`
- **Cloudflare RUM:** `https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447`
- **Social:** `https://vimeo.com/tendril`, `https://twitter.com/studiotendril`, `https://instagram.com/studiotendril`, `https://www.behance.net/tendril`

---

## Changelog

- 2026-06-20 — Initial draft, produced from `tools/tmp/tendril/` dump
  (scraped 2026-06-19, 99 files / ~38.2 MB / 5 errors all from
  Cloudflare challenge blob: URLs).
