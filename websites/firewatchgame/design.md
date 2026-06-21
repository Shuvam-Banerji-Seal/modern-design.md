# Firewatch — design.md

> A structured design specification of **https://firewatchgame.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/firewatchgame/` (gitignored)

---

## Overview

The official marketing one-pager for the indie video game *Firewatch* by
Campo Santo (published with Panic). It is a single scrollable page built
around a full-bleed parallax key-art banner of the Wyoming wilderness,
followed by buy CTAs, an embedded launch trailer, a two-column game
description, screenshot gallery, a press pull-quote, support links, and
company footers. The visual language is deliberately tight: deep wine
near-black background, a saturated amber/gold as the only accent,
uppercase letter-spaced labels, a single sans-serif body face (Verlag,
served via Hoefler & Co. Cloud Typography) and a top utility nav shared
with the wider camposanto.com site. The aesthetic is editorial /
postcard-like — atmospheric photography does the heavy lifting, type
sits in rectangular amber "sticker" banners, and motion is reduced to
a nine-layer parallax on the hero plus micro hovers.

**Category:** Marketing (single-page game landing)
**Primary surface observed:** Homepage (`/`) only; the dump also
references the `/about`, `/media`, and `/jp/` subroutes via hyperlinks
but they were not fetched.
**Tone:** Atmospheric, confident, slightly mysterious; the wordmark
treatment and amber-on-plum palette telegraph a 1989-set mystery.
**Framework detected:** None. Hand-written HTML5, hand-rolled CSS,
vanilla JS + jQuery 1.12.0, plus Magnific Popup, Mouse Wheel plugin,
Adobe Typekit (skolar + futura-pt), and a Cloudflare Insights beacon
injected at the foot. No React, Vue, Svelte, Next, Nuxt, or build
artefact anywhere in the dump.

---

## Visual Language

### Color

The palette is intentionally small — three warm tones on a near-black
plum, with a small handful of secondary dark variants for the
site-wide top nav. All values below are taken from the source CSS
(`playwright/css/firewatchlaunch__5d215837.css`),
`playwright/css/camponav__4b32a046.css`, and the runtime computed
styles (`playwright/computed-styles.json`).

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (page base) | `--bg-base` | `#210002` (very dark plum) | html + `#maincontain` + `#main`; `rgb(33, 0, 2)` |
| Background (parallax sky) | `--bg-sky` | `#FFAF1B` (saturated amber) | `#keyart-0` fallback fill behind key art; `rgb(255, 175, 27)` |
| Background (scrim) | `--bg-scrim` | `#FFAF00` (amber) | `#keyart-scrim`, opacity animated 0→1 with scroll |
| Text (primary) | `--text-primary` | `#FFAF00` (amber) | Default body and heading text on dark bg |
| Text (secondary / muted) | `--text-muted` | `#973700` (dark amber / rust) | Press quote citation, copyright text, dim hovers; `rgb(151, 55, 0)` |
| Text (inverse / on amber) | `--text-inverse` | `#210002` (plum) | Text sitting inside amber banners |
| Accent (links) | `--accent-link` | `#EC8200` (mid amber) | `p > a:link, p > a:visited` |
| Accent (hover) | `--accent-hover` | `#FFFFFF` (white) | Link hover swaps to white |
| Banner background | `--banner-bg` | `#FFAF00` (amber) | Solid fill of `.banner span` |
| Dim banner background | `--banner-dim` | `#973700` (dark amber) | `.dim` variant (e.g. "Screens & Trailers", "FAQ", "Tech Support") |
| Banner hover background | `--banner-bg-hover` | `#FFFFFF` (white) | `a:hover .banner span` |
| Top nav (page bg) | `--nav-bg` | `#210002` (plum) | `.firewatch.launch ul.navbar-top` |
| Top nav (link color) | `--nav-color` | `#FFAF00` (amber) | `.firewatch ul.navbar-top a` |
| Top nav (link hover bg) | `--nav-hover-bg` | `#5A1715` (deep claret) | `.firewatch.launch ul.navbar-top a:hover` |
| Top nav (current item bg) | `--nav-current-bg` | `#A34300` (rust) | `.firewatch.launch ul.navbar-top li.current a` |
| Top nav (current item fg) | `--nav-current-fg` | `#FFAF00` (amber) | same selector |
| Top nav (base link color, default site) | `--nav-base-fg` | `#F3F1E9` (cream) | Default `ul.navbar-top a`; sitewide cream |
| Top nav (base bg) | `--nav-base-bg` | `#000000` (black) | Default `ul.navbar-top, ul.navbar-top a` |
| Outline / inset border | `--border-deep` | `#210002` (plum) | `outline: 1px solid #210002` on banners; `box-shadow: inset 0 0 0 2px #210002` on company logos |
| Top rule (subpage accent) | `--toprule` | `#A34300` (rust) | `.toprule` 37px band; `.withxbone .section.buy h2.banner span` padding inset |
| Underline / strike | `--strike` | `#973700` (dark amber) | `s:before` border color, with `box-shadow: 0 1px 1px #FFAF00` |

**No dark-mode toggle** — the page is permanently dark. The site is
served through Cloudflare (beacon: `beacon.min.js/v833ccba57c9e4d...`).
The original Cloudflare challenge served a `Just a moment...` shell
to the static scraper, so all real assets are read from the dynamic
Playwright capture.

### Typography

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Body (default) | `"Verlag A", "Verlag B", "Verlag", sans-serif` | 300 | `20px` | `1` (reset) → sections use `1.6em` | normal |
| Banner button (h2.nobackground) | Verlag | 300 | `34px` (CSS `170%`, with `em` at 84% = 28.56px) | `34px` | `10px` |
| Banner small (h4.banner span) | Verlag | 700 | `18px` | `18px` | `3px` |
| Game description h5 (lede) | Verlag | 700 | `30px` | `1.5em` (`45px`) | normal |
| Description body p | Verlag | 300 | `20px` | `32px` (1.6) | normal |
| Press quote h2 (big) | Verlag | 300 | `38px` | `1.35em` (`51.3px`) | `3px` |
| Press quote h3 (citation) | Verlag | 700 | `18px` | `1.35em` (`24.3px`) | `4px` |
| Top nav link | `futura-pt, sans-serif` | 300 (b/strong → 700) | `14px` | `14px` | normal (text-transform: uppercase) |
| Company nav "Campo Santo" link | futura-pt | 300 / 700 | `18px` | `14px` | normal |
| Copyright p | Verlag | 500 | `15px` | `26px` | `2px` |
| Japan block | `"Noto Sans CJK JP", sans-serif` | 300 (effective 700 by font) | `26px` | `26px` | `4px` |
| Modal counter / utility (Magnific Popup) | `Arial, Baskerville, monospace` (close button) | regular | `28px` (close) / `12px` (counter) | `44px` (close) / `18px` (counter) | normal |

**Source of fonts:** Verlag is loaded from
`https://cloud.typography.com/7635874/6351012/css/fonts.css` (Hoefler &
Co. Cloud Typography; the older account `7652892/657204` is
commented out in the head). `futura-pt` and `skolar` come from Adobe
Typekit kit `nsv4yzv` (`https://use.typekit.net/nsv4yzv.js`) and are
exposed as `.tk-futura-pt` and `.tk-skolar` classes; only `futura-pt`
is visibly used in the layout (the top nav). `Noto Sans CJK JP` is
loaded via a hand-rolled `@font-face` pointing at
`/fonts/Japanese/NotoSansCJKjp-Bold.otf` (declared inline in the
Japan block). Typekit injects eight `@font-face` blocks at runtime
covering `skolar` n4/i4/n6/i6 and `futura-pt` n3/n4/n5/n7.

**Text-transform pattern:** `h1, h2, h3, h4` (all in the page CSS)
are uppercased globally; the `Verlag` body text and `h5` lede are
sentence case. Banner-style labels (`.banner span`) are uppercase
with explicit letter-spacing.

### Spacing & radius

- **Base unit:** 4px (derived from the 16/20/30/32/40 cadence in the
  CSS)
- **Scale used:** 3, 4, 5, 7, 10, 12, 13, 15, 16, 18, 20, 22, 25, 26,
  28, 30, 32, 35, 40, 50, 70, 80 px
- **Container max width:** `#main { max-width: 900px; padding:
  0 30px; }` — sections are centered inside.
- **Description block:** `max-width: 700px; margin: 80px auto 0;`
- **Buy section:** `margin-bottom: 40px;` (in `.section.buy`)
- **Video section:** `margin: 50px auto 120px;`
- **Support section:** `height: 68px;` (the shield emblem band)
- **Top rule (subpage banner):** `height: 37px;` (subpage only — not
  used on this homepage)
- **Radii:** essentially 0 — no rounded corners anywhere except the
  Magnific Popup default (`border-radius: 2px` on `.html5-ypc-purchase`,
  but that is YouTube's player CSS, not the site). Banner buttons
  have square ends with cut-corner PNG overlays; the `s` (strike)
  mark has a -4deg rotated underline with no radius.
- **Shadows:**
  - `box-shadow: 0 1px 1px #FFAF00` on `s:before` underline (amber halo)
  - `box-shadow: inset 0 0 0 2px #210002` on company logo
    placeholders (plum stroke against the rust fill)
  - `box-shadow: inset 0 0 0 3px #210002` on `.smalllinks li h3`
  - `box-shadow: 0 0 8px rgba(0, 0, 0, 0.6)` on Magnific Popup iframe
    scaler (vendor default)
  - `box-shadow: 0 0 15px 0px #2c2819e3` on `.fwswitch ul.navbar-top`
    (a different site, inherited selector; not visible here)
- **Borders / strokes:** the banner stickers use
  `outline: 1px solid #210002; background-clip: padding-box;` to
  produce a 1px plum stroke that respects the rounded (but in this
  case square) padding box.

### Iconography

- **Style:** Filled / duotone PNG illustrations, no inline SVG icons
  on the page. Every icon observed is a raster.
- **Icon set:** custom / hand-drawn, drawn by the Campo Santo art
  team. Asset list:
  - `images/buyicon_pc.png` (Windows / Mac / Linux monitor icon, 1.3 KB)
  - `images/buyicon_ps4.png` (PlayStation 4 mark, 2.0 KB)
  - `images/buyicon_switch.png` (Nintendo Switch wordmark glyph, 1.7 KB)
  - `images/buyicon_xbone.png` (Xbox logo, 1.9 KB)
  - `images/firewatch_shield_small.png` (Campo Santo shield emblem,
    used as background-image for the support links band, 5.2 KB)
  - `images/logo_camposanto_transparent.png` (company logo, 28.9 KB)
  - `images/logo_panic_transparent.png` (Panic logo, 21.6 KB)
  - `images/banner_transparent_left.png` (banner left notch, 2.2 KB)
  - `images/banner_transparent_right.png` (banner right notch, 2.2 KB)
  - `images/buyicon_*.png` icons are `17px` tall in the live page
    (`height: 17px; vertical-align: -2px; margin-right: 11px;`).
- **Default size:** 17px (in-banner), 125px × 69px (company logo
  placeholder), 30px (mod-`margin` around company logos).
- **No inline SVG** is present in the page body. The only `<svg>`
  references are the favicon and apple-touch-icon meta tags
  (raster `.ico` and `.png` respectively).

---

## Layout & Grid

- **Max content width:** `#main` is `max-width: 900px`, centered with
  `padding: 0 30px`. The `#maincontain` wrapper that holds it is
  full-bleed.
- **Page gutter:** `30px` (tablet) collapsing to `10px` below
  `600px` viewport.
- **Grid:** Hand-rolled, not a real CSS grid. Most sections are
  flex-style inline-block rows. The screenshot gallery uses a
  two-column layout with `.thumbnails li { width: 47%; }` and an
  odd/even `margin-right: 5.5%` on `:nth-child(odd)`. Buy links
  use two stacked `<ul class="links smalllinks">` (one row per
  console) with each `<ul>` at `width: 325px; margin: 0 25px;`.
- **Breakpoints used (max-width, px):** 1450, 975, 880, 830, 820,
  780, 750, 740, 730, 600, 480, 450. The launch/withxbone variant
  (`.withxbone`) only adds `padding-left: 48px` and `padding-right:
  42px` to the buy h2.
- **Breakpoints used (min-width, px):** 601 (enables parallax),
  976 (quote vertical centering helper).
- **Parallax gate:** `#nonparallax` (the static mobile key art)
  is shown by default, `#parallax` (the nine-layer stack) is
  `display: none` until `@media (min-width: 601px)` where they
  swap.
- **Vertical rhythm:** Sections are individually spaced with
  explicit `margin-top` / `margin-bottom` rather than a baseline
  grid. Gaps observed: 10, 35, 40, 50, 60, 70, 80, 120 px.

The homepage is a single column inside `#main` with each section
stacked top-to-bottom. The hero parallax is *outside* `#maincontain`
(it sits at the top of `#page` with `z-index: 10`) and is overlapped
on scroll by the plum `#maincontain` block (z-index 98/99) once the
keyart height (1000px on desktop, 550px on phones) is consumed. The
"Available now for $19.99" banner is the first thing under the
hero; the YouTube embed; the 2-column description; the dim internal
links; the screenshot grid (4 thumbs, 2-up); the press quote;
shielded support links; Japan block; copyright; Campo Santo + Panic
wordmarks.

---

## Components

### Parallax hero (keyart)
- **Anatomy:** Two `.keyart` containers (`#nonparallax` and
  `#parallax`). The `#parallax` container holds nine
  `.keyart_layer` divs plus a scrim. Each parallax layer has
  `data-speed="N"` where N is `2, 5, 11, 16, 26, 36, 49, 69, 100`
  (skydome to foreground) and `position: fixed;`. The
  `#keyart-scrim` is a fixed full-width amber (`#FFAF00`) overlay
  whose opacity is JS-tweened from 0 to ~1 as the user scrolls
  past 350px (threshold) over a 750px fade window.
- **Height:** `1000px` desktop, `550px` at `<=450px` device width.
- **Layer size:** `background-size: auto 1038px; background-repeat:
  repeat-x; background-position: bottom center;` — every layer
  tiles horizontally.
- **Fallback image (mobile / no-parallax):**
  `images/keyart-mobile.jpg` (217 KB).
- **High-DPI swap:** `@media (min-resolution: 144dpi)` swaps each
  parallax layer to `parallaxN@2x.png` variants (the @2x files
  were not in the dump but the source references them).
- **States:** Disabled on iPad/iPhone (`dispelParallax()`). On
  win32 / linux a `$.srSmoothscroll` was conditionally enabled in
  the source but the call is commented out in production.

### Top utility nav (`ul.navbar-top`)
- **Height:** auto, link height `14px`, padding `10px` each side,
  so visible nav height is `34px`.
- **Anatomy:** `<ul class="navbar-top">` with `<li>`s floated right
  (left for "Campo Santo"). Current item gets `.current` and
  `class="current"` injected by `document.getElementById('nav-game')
  .className += ' current'`.
- **Items (in order, on this page):** `#nav-company` "Campo Santo"
  → camposanto.com; `#nav-review` "Quarterly Review" (collapse
  label) / "Newsletter" (reveal label below 880px) → quarterly
  site; `#nav-blog` "Development Blog" (collapse) → blog; `#nav-game`
  "Firewatch" (current). Two commented items are also in the source
  ("Campo Store", "In the Valley of Gods").
- **Behavior:** Sticky to top (`position: absolute; top: 0`). The
  `.firewatch.launch` variant sets background `#210002` with
  amber links (`#FFAF00`). Hover swaps background to `#5A1715`.
  Current link background becomes `#A34300` with `#FFAF00` text.
- **Responsive:** Below 880px the "collapse" labels are hidden and
  the "reveal" labels show (e.g. "Newsletter" replaces "Quarterly
  Review"). Below 540px the nav stacks vertically to the bottom of
  its absolutely-positioned container.

### Banner sticker (`.banner span`)
- **Variants:** `.nobackground` (only color, no amber fill — used
  on the "Available now for $19.99" h2), default amber (used for
  primary CTAs), `.dim` (`#973700` fill — used for "Screens &
  Trailers", "FAQ", "Tech Support", "Streaming & Let's Plays"),
  and the historical `.arrow` (outlined chevron, defined but not
  used in the live markup).
- **Anatomy:** a `<span>` inside a heading. Background is composed
  from two transparent PNG notches
  (`banner_transparent_left.png`,
  `banner_transparent_right.png`) at the corners (`contain`-sized,
  no-repeat) plus a solid amber fill. Outline `1px solid #210002`,
  `background-clip: padding-box`, padding `.5em 1.1em`.
- **Hover:** Background-color animates `#FFAF00` → `#FFFFFF` over
  `0.15s`. The "S" (strike) underline shadow turns from amber to
  white.
- **Sizes:** h2 is `34px` / `28.56px` em. h4 small banner is
  `18px` font, `4px 13px 3px 16px` padding.

### Buy-link icon button (`.smalllinks li a > h4.banner span`)
- **Anatomy:** `<li class="link">` → `<a>` → `<h4 class="banner">`
  → `<span class="twolines|oneline">` containing a 17px-tall
  platform icon (`buyicon_*.png`) plus a label
  ("Windows Mac Linux", "PlayStation 4", "Nintendo Switch",
  "Xbox One").
- **States:** Default amber fill on dim plum; hover white fill.
  Outlets: Steam (`store.steampowered.com/app/383870`), PSN
  (`store.playstation.com/.../firewatch`), Nintendo
  (`nintendo.com/games/detail/firewatch-switch`), Xbox
  (`microsoft.com/store/p/firewatch/bqqkg9h2stc0`).
- **Width:** `250px` (`.withxbone .smalllinks li h3`) on the Xbox
  variant, otherwise auto-fit by content inside the 325px `<ul>`.

### Embedded trailer (`.videocontain`)
- **Anatomy:** 16:9 responsive wrapper with `padding-bottom:
  56.1%` and an absolutely positioned `<iframe>` inside. Source
  is a privacy-enhanced YouTube embed
  (`https://www.youtube-nocookie.com/embed/cXWlgP5hZzc`,
  `frameborder="0"`, `allowfullscreen`).
- **Container width:** 100% of `#main`, capped at 900px.
- **Margins:** `50px auto 120px`.

### Two-column description
- **Anatomy:** `.section.description` (h5 lede, then `.columntext`
  with two `<p class="left">` and `<p>` siblings laid out as
  `inline-block; width: 325px;` with `margin-right: 50px` on the
  first one).
- **Responsive:** Below 880px, `.columntext p` reverts to `display:
  inline;` and the 50px gutter is dropped — single column.

### Screenshot gallery (`.thumbnails`)
- **Anatomy:** `<ul class="thumbnails">` of four `<li>`s, each
  containing an `<a href="screenshots/firewatch-e3-2.jpg">` →
  `<img alt="Firewatch screenshot"
  src="screenshots/thumbs/firewatch_01.jpg">`. Two columns,
  47% width, 5.5% right gutter between siblings. On mobile
  (≤880px) the list collapses to one column at 100% width.
- **Opacity:** `0.85` default, `1.0` on hover, with
  `transition: opacity .2s`.
- **Lightbox:** Initialized by `magnificPopup()` on the `<ul>`
  (see JavaScript section).

### Press quote (`.section.pressquote.big`)
- **Anatomy:** `<h2>` (the quote, 38px / 3px tracking / 1.35 line
  height) plus a `<h3>` (the publication name, 18px / 700 / 4px
  tracking / color `#973700`). The single live quote is
  *"As visually striking / as its unique premise."* attributed
  to *Entertainment Weekly*.

### Support links (`.section.support ul.supportlinks`)
- **Anatomy:** A single `<ul>` with the `firewatch_shield_small.png`
  centered as a 68px-tall background image. Two `<li>`s
  (`techsupport`, `streaming`) sit on top of the shield, each
  holding a dim banner button. Below 780px the shield background
  drops out and the list stacks.
- **Outlets:** `library.panic.com/firewatch/` and
  `about#streaming`.

### Company footer (`.section.companylinks`)
- **Anatomy:** Two `<li>`s, `.campo` and `.panic`, each with a
  logo placeholder (`<h1>` text-indented off-screen, with the
  company logo as a background-image). Background fill `#973700`
  with `box-shadow: inset 0 0 0 2px #210002`. Hover swaps the
  fill to `#FFAF00`. The Panic tile is narrower (`width: 62px`
  vs `125px`).

### Japan block (`.japan-block`)
- **Anatomy:** A single inline-styled `<div class="japan-block">`
  with a hand-rolled `@font-face` for Noto Sans CJK JP Bold
  (referenced from `/fonts/Japanese/NotoSansCJKjp-Bold.otf`).
  `26px / 4px letter-spacing / margin-top 40px`. Link text is
  "日本語に関する情報" (info in Japanese) and points to
  `jp/`.

### Copyright
- **Anatomy:** Three `<p>`s with `15px / 500 / 26px / 2px
  letter-spacing / uppercase / color #973700`. Body declares
  the year dynamically (`#year` filled with `(new Date)
  .getFullYear()`), credits Campo Santo with Panic, and notes
  the Firewatch and Nintendo Switch trademarks.

### Modal / dialog
- **Library:** Magnific Popup 0.9.9-ish (no version visible in
  the minified file). Image-lightbox and iframe modules are
  registered.
- **Backdrop:** `.mfp-bg` — `background: #0b0b0b; opacity: 0.8;
  z-index: 1042; position: fixed`.
- **Container:** `.mfp-wrap` z-index 1043, fixed full-viewport.
- **Iframe scaler:** `.mfp-iframe-scaler` `padding-top: 56.25%`
  (16:9), `box-shadow: 0 0 8px rgba(0, 0, 0, 0.6)`.
- **Close button:** 44×44, `Arial, Baskerville, monospace`, 28px
  glyph, opacity 0.65 → 1 on hover/focus.
- **Zoom-in animation:** the zoom module sets
  `transition: all 300ms ease-in-out` on a cloned
  `.mfp-animated-image` element (see JavaScript section).

---

## JavaScript & Libraries

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| jQuery | 1.12.0 | `playwright/js/jquery-1.12.0.min__a62322c1.js` (97 KB) | Core DOM/utility; first `<script>` after the body content |
| jQuery Migrate | 1.2.1 | `playwright/js/jquery-migrate-1.2.1.min__4c607b38.js` (7.2 KB) | Loaded immediately after jQuery, before plugins |
| Magnific Popup | 0.9.9 (pre-1.0, no banner in source) | `playwright/js/magnific__9262e628.js` (21 KB) | Drives the screenshot lightbox; `mainClass: 'mfp-with-zoom'`, `zoom.duration: 300`, `easing: 'ease-in-out'`, gallery enabled, `preload: [1,1]` |
| jQuery Mouse Wheel | 3.x (Brandon Aaron) | `playwright/js/jquery.mousewheel.min__30e62bed.js` (2.8 KB) | Standard plugin, included in case Magnific needs wheel events |
| firewizard (parallax) | n/a — hand-written | `playwright/js/firewizard__b357365b.js` (1.7 KB, 84 lines) | Listens to `window.scroll`, walks `.parallax` elements, sets `style="transform: translate3d(0px, Ypx, 0px)"` where `Y = -(pageYOffset * data-speed / 100)`. Calls `dispelParallax()` on iOS (replaces parallax with the static keyart). `castSmoothScroll` (smooth wheel scrolling via `$.srSmoothscroll`) is defined but not called in the live code path |
| Adobe Typekit (kit `nsv4yzv`) | n/a | `use.typekit.net/nsv4yzv.js` (18 KB) + inlined `style` with 8 `@font-face` blocks | Loads skolar (n4/i4/n6/i6) and futura-pt (n3/n4/n5/n7). Activated via `try{Typekit.load();}catch(e){}` |
| Hoefler Cloud Typography | n/a | `<link rel="stylesheet" href="https://cloud.typography.com/7635874/6351012/css/fonts.css">` | Serves Verlag A / B (the body face). An older account (`7652892/657204`) is commented out |
| YouTube IFrame Player API | n/a | Embedded via `<iframe src="https://www.youtube-nocookie.com/embed/cXWlgP5hZzc">` | The huge `playwright/js/base__4e254987.js` (1.7 MB) is the YouTube embed runtime that the iframe pulls in dynamically; it is not directly part of the Firewatch site |
| Cloudflare Insights (beacon) | 2024.11.0 | inline `<script defer>` at end of body, src `static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d...` | Sends RUM, no visual effect |
| GoSquared Analytics | n/a | inline `<script>` block, **commented out** (`Disabled 4-5-21 by Cabel`) | The GoSquared snippet is still in the source but inactive |

**No bundler, no module system, no `import` / `require` statements,
no `from` statements in the firewatch-shipped code.** The jQuery
`$.srSmoothscroll` smooth-scroll plugin is referenced by name in
`firewizard.js` but the file itself is not in the dump and the call
is never made in production. All scripts load with `type="text/
javascript"` and no `defer`/`async` (the YouTube iframe is the only
deferred asset, added by Cloudflare).

The inline init script at the bottom of `<body>` (lines 242–265 of
the static `html/asset_59__e25e9ad9`):

```js
$(document).ready(function(){
  $('.thumbnails').magnificPopup({
    delegate: 'li a',
    type: 'image',
    gallery: { enabled: true, preload: [1,1] },
    mainClass: 'mfp-with-zoom',
    zoom: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
      opener: function(openerElement) {
        return openerElement.is('img') ? openerElement : openerElement.find('img');
      }
    }
  });
  $("#year").text((new Date).getFullYear());
});
```

Plus the body-onload hook `document.body.onload = startSite;` which
invokes `castParallax()` on non-iOS, `dispelParallax()` on iOS.

---

## Animations (Catalog)

The site has **zero CSS `@keyframes` rules** in any of the dumped
stylesheets (the only `@keyframes`-shaped blocks are YouTube's player
CSS, which is not part of the Firewatch site). All motion is either
JS-driven (parallax) or CSS `transition` on hover/state changes.

### CSS @keyframes

| Name | Where | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| — (none) | — | — | — | — |

### CSS transitions

| Selector | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `p > a` | `color` | `0.2s` | default (`ease`) | link hover (`#EC8200` → `#FFFFFF`) |
| `#firewatchlogocontain img` | `opacity` | `0.2s` | default | logo hover (`1` → `0.8`) — not on this homepage but in the same CSS |
| `.banner span` | `background-color` | `0.15s` | default | anchor hover (`#FFAF00` → `#FFFFFF`); disabled while `.active` |
| `.smalllinks li h3` | `background-color` | `0.15s` | default | anchor hover |
| `.section .dim li > a h3, .section .dim li > a h4.banner span` | `background-color` | (inherits 0.15s) | default | anchor hover (`#973700` → `#FFAF00`) |
| `.section.companylinks .companies li h1` | `background-color` | `0.15s` | default | anchor hover (`#973700` → `#FFAF00`) |
| `.section.screenshots .thumbnails li` | `opacity` | `0.2s` | default | thumbnail hover (`0.85` → `1`) |

### JS-driven animations

| Source | Animation | Trigger | Notes |
| --- | --- | --- | --- |
| `firewizard.js:25–38` | `castParallax` — per-frame `translate3d(0, Y, 0)` on each `.parallax` element, where `Y = -(window.pageYOffset * data-speed / 100)` | `window` `scroll` event (passive listener) | 9 layers at speeds `2, 5, 11, 16, 26, 36, 49, 69, 100`. Runs on every scroll event without throttling — modern browsers will throttle; no `requestAnimationFrame` is used |
| `firewizard.js:20–22` (commented-out jQuery version) | `$('#keyart-scrim').css('opacity', backgroundOpacity)` with `backgroundOpacity = (windowScroll > 350 ? (windowScroll - 350) / 750 : 0)` | scroll | The CSS source still keeps `#keyart-scrim` with `opacity: 0` and `background-color: #FFAF00`; the active JS path in the live file drops the scrim update and only translates the layers. **The scrim never actually animates in production.** |
| `firewizard.js:48–54` (defined, never called) | `$.srSmoothscroll({ step: 80, speed: 300, ease: 'linear' })` | gated to `$.browser.webkit` on win32/linux | Source defines it but the call is commented out; not active |
| `magnific__9262e628.js` (zoom module) | Image lightbox zoom — cloned `.mfp-animated-image` element with `transition: all 300ms ease-in-out` on position/z-index/opacity, run twice (in/out) | thumbnail click | `duration: 300, easing: 'ease-in-out'` per the inline init |

### Page transitions

- **None.** The page is a single static HTML document; no client-side
  router, no fade between routes, no skeleton swap. The only
  cross-document interaction is the (commented-out) GoSquared
  analytics script and the live Cloudflare beacon.

### Reduced motion

- The site ships **no `@media (prefers-reduced-motion: reduce)` rules
  anywhere in the dumped CSS.** On iOS the parallax is forcibly
  disabled by `dispelParallax()`, which is platform-based, not
  preference-based. The `magnificPopup` zoom still runs for users who
  have reduced-motion enabled at the OS level; the live banner-color
  transition is short (0.15s) and unlikely to trigger vestibular
  distress.

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump.

### Fonts

| Family | Weights observed | Format(s) in dump | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| `Verlag` (`"Verlag A", "Verlag B", "Verlag"`) | 300 (used), 500 (copyright), 700 (h5/h4) | not in dump (CSS only) | Hoefler & Co. Cloud Typography kit `7635874/6351012` (`https://cloud.typography.com/7635874/6351012/css/fonts.css`) | No — served by H&FJ CDN at runtime |
| `futura-pt` | 300, 400, 500, 700 | woff2 (8 files, 22 KB – 68 KB each) in `playwright/fonts/l__*` | Adobe Typekit kit `nsv4yzv` (`https://use.typekit.net/nsv4yzv.js`); downloaded files anonymised as `l__<hash>` | Cached in the dump, served by Typekit CDN |
| `skolar` | 400 normal, 400 italic, 600 normal, 600 italic | woff2 (4 files, 22 KB – 40 KB) in `playwright/fonts/l__*` | Same Typekit kit `nsv4yzv` | Same — defined in CSS, **not visibly used** in the live page (only the typekit class `.tk-skolar` exists) |
| `Noto Sans CJK JP` | Bold (700) | `.otf` referenced from `/fonts/Japanese/NotoSansCJKjp-Bold.otf` — file **not in the dump** | Google Noto project, served by the site's own `/fonts/Japanese/` | Yes (intended) |
| Roboto (Google Fonts) | 700 (one weight) | woff2 in `playwright/fonts/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA__fb5169d9.woff2` (40 KB) | This is Magnific Popup's default font — it is loaded by the Magnific stylesheet, not the Firewatch site. Not visibly rendered on this homepage. | No (Google Fonts CDN, cached in dump) |

**Note on `playwright/fonts/l__*`:** the eight files (22 KB → 68 KB)
are the Typekit woff2 cache; their hashes in the manifest
(`__44e819eb`, `__e5b4cdd6`, `__e835feda`, `__9af582a9`,
`__480f6987`, `__534c783e`, `__080f5e4c`, `__94c00c88`) do not map
to individual weights in the public Typekit URL — they are the
in-browser cache keys at capture time.

### Images

All image assets the live page references are listed below. The
`/` URLs are relative to `https://www.firewatchgame.com/`. The
manifest's `playwright://playwright/...` URLs are the captured
local copies; their declared size matches the file on disk.

| Local dump path | Type | Dimensions (assumed from CSS / size) | Size | Source URL (relative to firewatchgame.com) | Notes |
| --- | --- | --- | --- | --- | --- |
| `playwright/images/parallax0__ffb704bc.png` | PNG | 1038px tall, tiled | 112 KB | `/images/parallax/parallax0.png` | Skydome / sky layer, fill `#FFAF1B` |
| `playwright/images/parallax1__99b90498.png` | PNG | 1038px tall, tiled | 76 KB | `/images/parallax/parallax1.png` | Distant ridges |
| `playwright/images/parallax2__e8b66fb7.png` | PNG | 1038px tall, tiled | 37 KB | `/images/parallax/parallax2.png` | Mid layer |
| `playwright/images/parallax3__4184dc5d.png` | PNG | 1038px tall, tiled | 110 KB | `/images/parallax/parallax3.png` | Mid layer |
| `playwright/images/parallax4__b1e65317.png` | PNG | 1038px tall, tiled | 42 KB | `/images/parallax/parallax4.png` | Mid layer |
| `playwright/images/parallax5__9fc9f195.png` | PNG | 1038px tall, tiled | 87 KB | `/images/parallax/parallax5.png` | Foreground trees |
| `playwright/images/parallax6__4af58c35.png` | PNG | 1038px tall, tiled | 47 KB | `/images/parallax/parallax6.png` | Foreground trees |
| `playwright/images/parallax7__3a299972.png` | PNG | 1038px tall, tiled | 58 KB | `/images/parallax/parallax7.png` | Foreground trees |
| `playwright/images/parallax8__4a99375d.png` | PNG | 1038px tall, tiled | 36 KB | `/images/parallax/parallax8.png` | Foreground (closest) |
| `playwright/images/keyart-mobile__2e161841.jpg` | JPEG | unknown (likely 1500–2000px wide) | 217 KB | `/images/keyart-mobile.jpg` | Mobile fallback, `background-size: auto 100%` in `#nonparallax` |
| `playwright/images/firewatch_01__ffd25371.jpg` | JPEG | thumbnail | 241 KB | `/screenshots/thumbs/firewatch_01.jpg` (link to `/screenshots/firewatch-e3-2.jpg`) | Screenshot 1 (lightbox) |
| `playwright/images/firewatch_02__d5980722.jpg` | JPEG | thumbnail | 330 KB | `/screenshots/thumbs/firewatch_02.jpg` (link to `/screenshots/firewatch_150305_06.png`) | Screenshot 2 (largest) |
| `playwright/images/firewatch_03__652b052a.jpg` | JPEG | thumbnail | 162 KB | `/screenshots/thumbs/firewatch_03.jpg` (link to `/screenshots/firewatch-2.jpg`) | Screenshot 3 |
| `playwright/images/firewatch_04__da989f77.jpg` | JPEG | thumbnail | 154 KB | `/screenshots/thumbs/firewatch_04.jpg` (link to `/screenshots/firewatch-e3-5.jpg`) | Screenshot 4 |
| `playwright/images/firewatch_shield_small__38954d5a.png` | PNG | small | 5.2 KB | `/images/firewatch_shield_small.png` | Support section emblem background, `auto 100%` |
| `playwright/images/banner_transparent_left__af8e5f07.png` | PNG | small | 2.2 KB | `/images/banner_transparent_left.png` | Banner left notch overlay |
| `playwright/images/banner_transparent_right__cea40dda.png` | PNG | small | 2.2 KB | `/images/banner_transparent_right.png` | Banner right notch overlay |
| `playwright/images/buyicon_pc__27772146.png` | PNG | 17px tall in page | 1.3 KB | `/images/buyicon_pc.png` | Windows / Mac / Linux glyph |
| `playwright/images/buyicon_ps4__8782c01e.png` | PNG | 17px tall in page | 2.0 KB | `/images/buyicon_ps4.png` | PS4 glyph |
| `playwright/images/buyicon_switch__41b6dc65.png` | PNG | 17px tall in page | 1.7 KB | `/images/buyicon_switch.png` | Switch glyph |
| `playwright/images/buyicon_xbone__06c601bc.png` | PNG | 17px tall in page | 1.9 KB | `/images/buyicon_xbone.png` | Xbox glyph |
| `playwright/images/logo_camposanto_transparent__0e0628b6.png` | PNG | 125×69 frame | 28.9 KB | `/images/logo_camposanto_transparent.png` | Footer logo |
| `playwright/images/logo_panic_transparent__c739dad9.png` | PNG | 62×69 frame | 21.6 KB | `/images/logo_panic_transparent.png` | Footer logo (Panic) |
| `playwright/images/maxresdefault__4abe59f9.webp` | WebP | 1280×720 (YouTube poster) | 177 KB | YouTube `img.youtube.com/vi/cXWlgP5hZzc/maxresdefault.webp` | Trailer poster (YouTube deliverable, not the site's asset) |
| `playwright/images/p__20b4230b.gif` | GIF (1×1 tracking pixel) | 1×1 | 35 B | YouTube tracking | Not visually relevant |
| `playwright/html/cXWlgP5hZzc__e4334908` (135 KB) and `playwright/html/asset_0__e25e9ad9` (12 KB) | HTML | n/a | see size | YouTube `embed/cXWlgP5hZzc` and `youtube.com/embed/cXWlgP5hZzc` responses | Captured HTML for the trailer; not site assets |
| `playwright/other/GenerateIT__6eeccd37` (106 B), `playwright/other/log_event__4b735827` (28 B) | text | n/a | tiny | YouTube telemetry | Non-visual |

The full-size screenshot masters (`screenshots/firewatch-e3-2.jpg`,
`firewatch_150305_06.png`, `firewatch-2.jpg`, `firewatch-e3-5.jpg`)
are **not in the dump** — only the four thumbnail JPEGs are.

The favicon and apple-touch-icon (`favicon.ico`, `appicon.png`) are
not in the dump either.

### SVGs & icons

- **Inline SVGs in HTML:** none. The page is raster-only for icons.
- **Standalone SVG files in dump:** none in `svgs/` (empty).
- **Icon system:** custom, hand-drawn, PNG-only. See the Iconography
  section above for the full list.

### Audio & video

N/A — no audio files in the dump. The only video is the YouTube
trailer embedded via iframe; the YouTube IFrame Player API runtime
(`playwright/js/base__4e254987.js`, 1.7 MB) is loaded by the
iframe, not by the site directly. There are no `<video>` or
`<audio>` tags in the markup.

### Other

- `playwright/js/m=r78Drb__bfe799ad` (807 KB) and
  `playwright/js/m=root,base__9179b806` (511 KB) — Google
  YouTube embed runtime chunks loaded by the iframe.
- `playwright/js/mgWi-v0llvQATRICeM5vcCzU2Hg2w9kgBkYKiTFQ4gg__4cb86333.js`
  (62 KB) — YouTube embed support module.
- `playwright/js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447__4d30e30a`
  (33 KB) — Cloudflare Insights beacon source.
- `playwright/css/www-player__9fbe5c45.css` (519 KB) and
  `playwright/css/68CDE8E3DB6706F93__8c8f5c8f.css` (53 KB) —
  YouTube's embedded player stylesheet, not the Firewatch site.
- `playwright/css/rs=AGKMywGKAEt-kdduxAJh97bHN1YIf6GquQ__700cb8ad`
  (457 KB) — Google Fonts / YouTube stylesheet, not Firewatch.

---

## Motion & Interaction

### Principles

- Calm, atmospheric, almost cinematic. The only first-paint motion
  is the parallax-driven key art; everything else is hover-only.
- **No spring physics, no easing curves are written out anywhere
  in the Firewatch CSS or JS.** All transitions use the browser
  default `ease` keyword, with one explicit `ease-in-out` on the
  Magnific Popup zoom.
- Default durations: 150ms (banner / button / logo hovers), 200ms
  (link colour, screenshot thumb opacity, logo hover), 300ms
  (image lightbox zoom — Magnific Popup).

### Specific behaviors

- **Link hover:** color transition from `#EC8200` to `#FFFFFF` over
  `0.2s` (only on `<p>`-wrapped anchors; nav-link hover is a
  background swap, not a color swap, on `0.15s`).
- **Banner hover:** amber `#FFAF00` → white `#FFFFFF` over `0.15s`
  on the inner span; this is the dominant interactive motion.
- **Screenshot thumb hover:** opacity 0.85 → 1.0 over 0.2s.
- **Company logo hover:** fill `#973700` → `#FFAF00` over 0.15s.
- **Dim banner hover:** fill `#973700` → `#FFAF00` over 0.15s.
- **Strike (s) element:** static; the rotated amber underline is
  not interactive.
- **Page transition:** none. Single-document site.
- **Scroll:** parallax transforms on nine layers, recomputed on
  every `scroll` event with no `requestAnimationFrame`; modern
  browsers will coalesce paints, and on a quiet desktop the cost
  is negligible for nine fixed-position divs.
- **Trailer:** YouTube's own controls (play/pause/seek/fullscreen)
  — the host page adds no custom player chrome.

### Reduced motion

- Not honored. There is no `@media (prefers-reduced-motion: reduce)`
  rule in any of the dumped stylesheets. The parallax is
  platform-gated to non-iOS but not to reduced-motion.

---

## Content & Voice

- **Tone:** Atmospheric, restrained, period-tinged (the year 1989
  is foregrounded in the lede). The game's signature subject —
  fire lookout work, a portable radio as the only human contact —
  is the throughline.
- **Sentence length:** Short to medium. Active voice. Em-dashes
  are used naturally (e.g. "the person on the other end of a
  handheld radio — and is your only contact with the world you've
  left behind").
- **Capitalization:** Sentence case in the lede (h5) and the
  description body. The banner labels are forced uppercase via
  `h1, h2, h3, h4 { text-transform: uppercase; }` in the
  firewatchlaunch CSS.
- **Punctuation:** Oxford comma not used. Em-dash (—) is the
  preferred dash.
- **CTA vocabulary:** the site uses *Available now*, *Play* (via
  external stores), *Screens & Trailers*, *Firewatch FAQ*, *Tech
  Support*, *Streaming & Let's Plays*, and a Japanese-language
  link "日本語に関する情報" (information in Japanese) pointing at
  `jp/`.
- **Press quote (full):** the only pull-quote is
  *"As visually striking / as its unique premise."* attributed
  to Entertainment Weekly (paraphrased here from the live HTML;
  not the original Entertainment Weekly review text).
- **Lede (paraphrase of the h5):** the game is a Wyoming-wilderness
  mystery where the only emotional link to the world is the person
  on the other end of a handheld radio.
- **Description (paraphrase):** the year is 1989; the player is
  Henry, a fire lookout atop a Wyoming mountain. A hot, dry summer
  has everyone on edge. A supervisor named Delilah is reachable by
  radio and is the only contact with the world left behind. When
  something strange draws the player out of the tower, they
  explore a wild, unknown environment and make interpersonal
  choices that can build or destroy the only meaningful
  relationship they have.
- **In-game microcopy (not on this page, but referenced):** the
  subpage `/about#streaming` is a streaming & let's-plays policy
  link.

---

## Information Architecture

This is a single-page site. The only route the dump contains
the markup for is `/`. Other routes are referenced as hyperlinks:

- `/` — marketing homepage (the page described here).
- `/about` — the in-game "Firewatch FAQ" link, target
  `https://www.firewatchgame.com/about`, plus an `about#streaming`
  anchor for the streaming/let's-plays policy.
- `/media` — the "Screens & Trailers" link, target
  `https://www.firewatchgame.com/media` (presumably the trailer and
  screenshot gallery; not fetched).
- `/jp/` — the Japanese-language info page, target
  `https://www.firewatchgame.com/jp/` (the "日本語に関する情報" link).
- **External, off-site:** the top utility nav points to
  `http://www.camposanto.com` (the Campo Santo studio site),
  `https://quarterly.camposanto.com/` (newsletter),
  `http://blog.camposanto.com` (dev blog). The four buy buttons
  point to Steam, PlayStation Store, Nintendo, and Microsoft Store
  URLs. Support goes to `https://library.panic.com/firewatch/`.
- **Demo / login / signup:** none observed.
- **Commented-out routes** still in the source: `/store`
  (`store.camposanto.com`, the Campo Santo merchandise store) and
  `/inthevalleyofgods` (a sister game's landing page).

---

## Accessibility

- **Color contrast:** the amber `#FFAF00` on plum `#210002` is the
  primary text/background combination. WCAG luminance contrast for
  `#FFAF00` (≈0.567) vs `#210002` (≈0.012) is roughly 13.5:1 — well
  above AA (4.5:1) and AAA (7:1) for normal text. The dim
  `#973700` on `#210002` is the riskier combination, used only for
  the press-quote citation (large text, 18px / 700 / 4px tracking
  with `text-transform: uppercase`) and the copyright lines
  (15px / 500 / 2px tracking). The `#973700` on `#210002` ratio is
  approximately 1.6:1 — below AA, so it is used only on text that
  is decorative or repeats information available elsewhere.
- **Focus indicators:** not styled in the dump. The browser default
  is the only visible focus ring. The site uses `outline: 1px
  solid #210002` on `.banner span` and `box-shadow: inset 0 0 0
  2px #210002` on company logos, but these are decorative strokes,
  not focus rings.
- **Keyboard:** all interactive elements are native `<a>` and
  `<button>` (Magnific Popup's close), so the default tab order
  applies. The page is a linear stack, so the tab order is
  predictable. No skip-link is present.
- **Screen reader landmarks:** `<body>` contains the navbar `<ul>`
  first, then a single `<div id="page">` with no role — there is
  no `<header>`, `<main>`, `<nav>`, `<section>`, or `<footer>`
  semantic landmark in the document. Headings are present
  (`h2`, `h4`, `h5`, `h3`, `h1`) and a logical outline exists, but
  the lack of `<main>`/`<nav>` wrappers is a real landmark gap.
- **Motion:** no `prefers-reduced-motion` handling; parallax
  runs unless the device is iOS.
- **Alt text:** the screenshot thumbs use
  `alt="Firewatch screenshot"`. Buy-button icons have no `alt`
  because they are inside a heading, but the heading text itself
  names the platform, so the icon is decorative. The
  `youtube-nocookie` iframe has no `title` attribute — the screen
  reader will announce it as just "frame".
- **Form fields:** none on the page.
- **Language:** `<html>` does not declare `lang`; the Japan block
  is a single link to a Japanese-language page, not localized
  inline content.

---

## Sources

- Homepage — https://firewatchgame.com/
- Homepage (alt) — http://www.firewatchgame.com/ (referenced in OG
  meta)
- About / FAQ — https://www.firewatchgame.com/about
- Streaming policy anchor — https://www.firewatchgame.com/about#streaming
- Media / Screens & Trailers — https://www.firewatchgame.com/media
- Japanese page — https://www.firewatchgame.com/jp/
- Embedded trailer — https://www.youtube-nocookie.com/embed/cXWlgP5hZzc
- Steam store — http://store.steampowered.com/app/383870
- PlayStation store —
  https://store.playstation.com/en-us/search/firewatch
- Nintendo store —
  https://www.nintendo.com/games/detail/firewatch-switch
- Microsoft store —
  https://www.microsoft.com/store/p/firewatch/bqqkg9h2stc0
- Tech support — https://library.panic.com/firewatch/
- Studio site — http://www.camposanto.com
- Newsletter — https://quarterly.camposanto.com/
- Dev blog — http://blog.camposanto.com
- Typekit kit — https://use.typekit.net/nsv4yzv.js
- Hoefler Cloud Typography CSS —
  https://cloud.typography.com/7635874/6351012/css/fonts.css
- Cloudflare Insights beacon —
  https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447
- Twitter / Open Graph image —
  https://www.firewatchgame.com/images/badge.png (not in dump)

The static `tools/tmp/firewatchgame/html/asset_59__e25e9ad9` is the
un-CSS'd bootstrap HTML served to the static scraper; the
`tools/tmp/firewatchgame/playwright/homepage.html` is the rendered
DOM after Cloudflare and Typekit finished loading, and is the
canonical source for the page structure described here.

---

## Changelog

- 2026-06-20 — Initial draft by opencode (sub-agent: Phase 1
  Playwright capture, Phase 2 design spec written from
  `tools/tmp/firewatchgame/`).

---

## Appendix A — Reset, base, and global rules

The top of `playwright/css/firewatchlaunch__5d215837.css` (lines
1–3) is a single 200-character Meyer-style reset that zeroes
`margin`/`padding`/`border`/`font`/`vertical-align` on every
element, sets `<html>`/`<body>` `line-height: 1`, removes list
bullets, removes blockquote `quotes`, and collapses table cell
spacing. Immediately after:

```css
a, a:link, a:visited { color: inherit; text-decoration: inherit; }
```

forces all anchors to inherit colour and decoration — every
explicit colour on the site is set per-component, not on the
generic `a` rule. Combined with the `html` font stack
(`Verlag A`, `Verlag B`, `Verlag`) and `font-weight: 300`, this
gives the body its uniform low-contrast amber-on-plum look.
The HTML root also sets `text-align: center` (inherited by
every block) and `font-size: 20px`, so every `rem` and
percentage-based sizing is anchored to a 20px base, not the
browser default 16px.

A `.section.internallinks, .section.internallinks *` rule
overrides the reset's `vertical-align: top` back to
`vertical-align: baseline` so the inline-icon banner text
sits on the text baseline instead of the icon top. The
`.gridwithicons` variant flips this back to `vertical-align:
top` for the buy-link grid so the icon stays pinned to the
top of its label.

A pseudo-element trick on `<s>` produces the rotated strikethrough:

```css
s { opacity: 0.8; position: relative; text-decoration: none; }
s:before {
  position: absolute; content: ""; left: -3px; top: 50%;
  right: -3px;
  border-top: 2px solid;
  box-shadow: 0px 1px 1px #ffaf00;
  border-color: #973700;
  transform: rotate(-4deg);
}
```

The `-4deg` rotation and the amber `box-shadow` are the
subtle visual signature of the brand on any old-cancelled
price-style copy.

---

## Appendix B — Per-breakpoint CSS adjustments

The 12 breakpoints (`1450, 975, 880, 830, 820, 780, 750, 740,
730, 601, 600, 480, 450`) each carry a small set of
adjustments. The full matrix (in priority order, largest
viewport first):

| Breakpoint (max-width, px) | Section / selector | Change |
| --- | --- | --- |
| 1450 | `.gridcontainer` | `max-width: 950px` (down from 1425) |
| 1450 | `.gridunit.hidetwocolumn` | `display: none` |
| 1450 | `.section.subpagenav li.link.active` | `margin: auto 43px` (down from 110) |
| 1450 | `.section.subpagenav .banner span` | `width: 240px` (down from 280) |
| 976 (min-width) | `.gridunit.quote` | `height: 238px; transform-style: preserve-3d;` for vertical centring |
| 976 (min-width) | `.quotecontain` | `top: 49%; transform: translateY(-50%);` |
| 975 | `.gridunit.hideonecolumn, .gridunit .hideonecolumn` | `display: none` |
| 975 | `.gridcontainer, .gridcontainer > .gridparent` | `width: auto; max-width: inherit;` |
| 975 | `.gridcontainer > .gridunit, .gridcontainer > .gridparent, .gridcontainer > .gridparent > .gridunit` | `display: block; width: auto;` |
| 975 | `.quotecontain` | `margin: 60px auto;` |
| 975 | `.gridunit.fullbleed` | `margin-left: 0; margin-right: 0;` |
| 880 | `.gridwithicons .smalllinks h4.banner span` | `line-height: 1.3em; padding-top: 7px; height: 22px;` |
| 880 | `.section.internallinks .smalllinks li h4.banner span.oneline` | `padding-top: 19px; padding-bottom: 19px;` |
| 880 | `.section.internallinks .smalllinks li h4.banner span.twolines` | `height: 50px;` |
| 880 | `.section.support ul.supportlinks` | `margin-left: 0; margin-right: 0;` |
| 880 | `.section.support .supportlinks .link.techsupport a` | `margin: 0 50px 0 0;` |
| 880 | `.section.support .supportlinks .link.streaming a` | `margin: 0 0 0 50px;` |
| 880 | `.columntext p` | `display: inline;` (collapses 2-col description to 1-col) |
| 880 | `.columntext p.left` | `margin: 0;` |
| 880 | `.section.description` | `margin-bottom: 50px;` |
| 880 | `.section.screenshots .thumbnails li` | `width: 100%; height: auto;` (gallery 1-col) |
| 880 | `.section.screenshots .thumbnails li:nth-child(odd)` | `margin-right: 0;` |
| 880 | `.section.buy ul` | `margin-left: 0;` |
| 880 | `ul.links.smalllinks li h4` | `max-width: 267px; margin: 0 auto;` |
| 880 | `.section.companylinks` | `margin: 50px auto; padding-right: 0;` |
| 880 | `ul.navbar-top .reveal` | `display: inline;` (swap nav labels to short form) |
| 880 | `ul.navbar-top .collapse` | `display: none;` |
| 830 | `ul.links.smalllinks` | `margin: 0 5px;` |
| 820 | `.supportlinks.smalllinks li h4` | `letter-spacing: 2px;` |
| 780 | `.section.support ul.supportlinks` | `max-width: 300px; margin: 0 auto; background: none;` (shield emblem hidden) |
| 780 | `.section.support .supportlinks li` | `display: block; width: 100%;` |
| 780 | `.section.support .supportlinks .link.techsupport a, .section.support .supportlinks .link.streaming a` | `margin: 0;` |
| 780 | `.smalllinks.switch h4.banner span` | `display: inline-block; max-width: auto;` |
| 750 | `ul.links.smalllinks` | `margin: 0;` |
| 740 | `.section.buy li` | `display: block;` (buy buttons stack) |
| 740 | `.section.buy li.steam` | `margin-right: 0;` |
| 730 | `ul.links.smalllinks` | `display: block; width: auto; margin: 0 auto;` |
| 601 (min-width) | `#nonparallax` | `display: none;` |
| 601 (min-width) | `#parallax` | `display: block;` |
| 600 | `#nonparallax` | `display: block;` |
| 600 | `#parallax` | `display: none;` |
| 600 | `#main` | `padding-left: 10px; padding-right: 10px; padding-top: 70px;` |
| 600 | `.section.copyright p` | `font-size: 12px; line-height: 20px; letter-spacing: 1px;` |
| 600 | `.section.companylinks .companies li h1` | `margin: 20px;` |
| 480 | `.toprule` | `display: none;` |
| 480 | `.pax #maincontain` | `top: 0px !important;` (subpage PAX only) |
| 450 (max-device-width) | `.section.buy h2` | `font-size: 22px; letter-spacing: 3px; font-weight: 700; line-height: 28px;` |
| 450 | `.section.buy h2.banner span` | `padding-top: 7px; padding-bottom: 7px;` |
| 450 | `.withxbone .section.buy h2.banner span` | `padding-top: 6px; padding-bottom: 8px;` |
| 450 | `.columntext p` | `font-size: 23px;` |
| 450 | `.section.pressquote.big h2` | `font-size: 28px; letter-spacing: 1px;` |
| 450 | `.section.pressquote.big h3` | `font-size: 16px;` |
| 450 | `.section.screenshots .thumbnails li` | `opacity: 1;` (kill the 0.85 default) |
| 450 | `.supportlinks.smalllinks li h4` | `letter-spacing: 1px;` |
| 450 | `.section.copyright` | `margin-top: 60px;` |
| 450 | `.section.copyright p` | `font-size: 10px; line-height: 16px; letter-spacing: 1px;` |
| 450 | `ul.awards` | `display: none;` (in case awards are ever shown on this page) |
| 450 | `.keyart, .keyart_layer` | `height: 550px;` (down from 1000) |
| 450 | `.keyart_layer` | `position: absolute; background-size: auto 600px;` (no fixed positioning) |

The 630, 560, 540 breakpoints in `camponav__4b32a046.css` only
adjust the top-nav padding and stacking for the wider campo
santo site, not the Firewatch page.

---

## Appendix C — Typekit @font-face inventory (inlined at runtime)

The Typekit kit `nsv4yzv` injects eight `@font-face` blocks via
the Typekit `style` element. Reproduced here for completeness
(the `url` paths are the live Typekit CDN; the woff2 files
captured in `playwright/fonts/l__*` are the in-browser cache
copies at capture time):

| Family | Weight | Style | Stretch | Display | Source URL (live) |
| --- | --- | --- | --- | --- | --- |
| `skolar` | 400 | normal | normal | auto | `use.typekit.net/af/ed14e6/00000000000000000000f29e/27/{l,d,a}?subset_id=2&fvd=n4&v=3` |
| `skolar` | 400 | italic | normal | auto | `use.typekit.net/af/c7ed7b/00000000000000000000f2a1/27/{l,d,a}?subset_id=2&fvd=i4&v=3` |
| `skolar` | 600 | normal | normal | auto | `use.typekit.net/af/b7ca2b/00000000000000000000d32e/27/{l,d,a}?subset_id=2&fvd=n6&v=3` |
| `skolar` | 600 | italic | normal | auto | `use.typekit.net/af/ca683e/00000000000000000000e303/27/{l,d,a}?subset_id=2&fvd=i6&v=3` |
| `futura-pt` | 500 | normal | normal | auto | `use.typekit.net/af/2cd6bf/00000000000000000001008f/27/{l,d,a}?subset_id=2&fvd=n5&v=3` |
| `futura-pt` | 700 | normal | normal | auto | `use.typekit.net/af/309dfe/000000000000000000010091/27/{l,d,a}?subset_id=2&fvd=n7&v=3` |
| `futura-pt` | 400 | normal | normal | auto | `use.typekit.net/af/9b05f3/000000000000000000013365/27/{l,d,a}?subset_id=2&fvd=n4&v=3` |
| `futura-pt` | 300 | normal | normal | auto | `use.typekit.net/af/ae4f6c/000000000000000000010096/27/{l,d,a}?subset_id=2&fvd=n3&v=3` |

The `l` / `d` / `a` filename suffixes select woff2 / woff /
opentype respectively. The Typekit CSS classes set
`.tk-skolar { font-family: "skolar", serif; }` and
`.tk-futura-pt { font-family: "futura-pt", sans-serif; }`,
and the `<html>` element gets `wf-futurapt-n5-active
wf-futurapt-n4-active wf-futurapt-n7-active wf-futurapt-n3-active
wf-skolar-i6-active wf-skolar-n6-active wf-skolar-i4-active
wf-skolar-n4-active wf-active` once the kit has finished
loading. **In this site, only `futura-pt` weights 300 / 700 are
actually used** (top nav); the skolar weights are loaded
because the kit is shared with other Campo Santo pages
(`www.camposanto.com/css/camponav.css` references the same
typekit kit).

---

## Appendix D — Magnific Popup image/iframe overrides

The firewatchlaunch CSS overrides two Magnific Popup defaults
(`.firewatch .mfp-image-holder .mfp-content { max-width: 90%; }`)
so that the screenshot lightbox does not consume the full
viewport — the captures are 4:3, so a 90%-wide container is
approximately the right size to show the full image without
cropping.

Magnific Popup's vendor CSS (the unmodified
`playwright/css/magnific-popup__4327f25c.css`) defines:

- `.mfp-bg` — `background: #0b0b0b; opacity: 0.8; z-index: 1042;`
- `.mfp-wrap` — `z-index: 1043; position: fixed;`
- `.mfp-container` — `padding: 0 8px; box-sizing: border-box;`
- `.mfp-content` — `z-index: 1045; display: inline-block;`
- `.mfp-close` — `44×44`, `Arial, Baskerville, monospace`, 28px
  glyph, `opacity: 0.65; filter: alpha(opacity=65);` (legacy IE),
  hover/focus → 1.0.
- `.mfp-arrow` — `90×110`, with 17px white triangle (`.mfp-a`)
  on top of a 27px `#3F3F3F` triangle (`.mfp-b`).
- `.mfp-iframe-scaler` — `padding-top: 56.25%` (16:9),
  `box-shadow: 0 0 8px rgba(0, 0, 0, 0.6); background: #000;`
- `img.mfp-img` — `padding: 40px 0; margin: 0 auto;`
- `.mfp-figure:after` — 8px box-shadow under the figure, behind
  it (`z-index: -1`).
- `.mfp-counter` — `12px / 18px; color: #CCC;` (top-right)
- `.mfp-title` — `color: #F3F3F3;` (below the figure in the
  bottom-bar)

The `mfp-with-zoom` class is registered automatically by the
zoom module when `zoom.enabled: true`; the zoom module's
animation uses the inline-init `duration: 300, easing:
'ease-in-out'` values. No other Magnific modules are active
on this page (no `mfp-ajax-cur`, no `mfp-iframe` outside the
YouTube embed which is not under Magnific's control).

The vendor CSS also includes an IE-7 fallback
(`.mfp-ie7`) and a small-viewport landscape override that
collapses all the popup padding when the viewport is
`max-width: 800px` in landscape or `max-height: 300px`. The
Firewatch site does not enable these — they are vendor
defaults that ship with the plugin.
