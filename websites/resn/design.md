# Resn — design.md

> A structured design specification of **https://resn.co.nz**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** sub-agent
> **Source dump:** `tools/tmp/resn/` (gitignored)

---

## Overview

Resn (resn.co.nz) is the public face of a New Zealand–based interactive
studio. The site is a single, full-bleed WebGL "drop" experience rather
than a conventional page: a black canvas, a small cluster of fixed
round-corner shell buttons (Drop, Discover, Showreel, Audio) pinned to
the four corners, a centered tag line, a thin interactive bar near the
bottom, and an award count ticker on the right. Tapping the **Drop**
icon enters a "water drop" 3D scene (THREE.js) that morphs into a
project; the **Discover** button opens a vertical category menu; the
**Showreel** button opens a fullscreen video; the **Audio** button
toggles an ambient soundtrack sampled from a sprite sheet.

The visual system is deliberately monochrome — black background, white
type, a single warm peach highlight (`#FFDA93`) used as a single
hover/accent token. The dominant typeface is the proprietary **Fort**
in five weights (Extralight → Bold), with **Work Sans** as a
fallback/secondary face. There is no "above the fold" content stack;
the entire viewport *is* the layout. A custom inline SVG "drop" symbol
appears throughout as the visual signature.

**Category:** Marketing / Portfolio (interactive studio) — single-page app
**Primary surface observed:** Homepage only (one SPA, versioned as
`20260607232410_1_0_8475ced/`)
**Tone:** confident, technical, playful, deliberately minimal
**Framework detected (if any):** None — bespoke SPA, RequireJS + jQuery
+ Backbone + GSAP + THREE.js (no React/Vue/Svelte/Next/Nuxt)

---

## Visual Language

### Color

The site is essentially black-and-white with one warm accent and a
handful of mid-grays for secondary text and the bar/divider strokes.
Every value below was pulled from `css/all__87c035b0.css` or observed
in the rendered DOM at `playwright/homepage.html` /
`playwright/computed-styles.json`.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (page) | `--bg-base` | `#000000` (black) | Set on `body` in inline critical CSS |
| Background (canvas) | `--bg-canvas` | `#141214` | `.background__shards` — 3D scene clear color (warm black) |
| Background (shard variant 1) | `--bg-shard-1` | `#171719` | Three.js mesh material |
| Background (shard variant 2) | `--bg-shard-2` | `#1A191B` | Three.js mesh material |
| Background (shard variant 3) | `--bg-shard-3` | `#1C1A1C` | Three.js mesh material |
| Background (shard variant 4) | `--bg-shard-4` | `#1E1C20` | Three.js mesh material |
| Text (primary) | `--text-primary` | `#FFFFFF` (white) | Body copy, headings, button labels |
| Text (secondary) | `--text-secondary` | `#E3E3E3` (light gray) | `.button__text` (subtler white) |
| Text (muted) | `--text-muted` | `#717171` (mid gray) | `.interactive_bar_msg` (counter helper text) |
| Text (extra muted) | `--text-muted-2` | `#A8A8A8` | Faint hint copy |
| Text (extra extra muted) | `--text-muted-3` | `#898989` | Tertiary hint |
| Accent (hover / highlight) | `--accent` | `#FFDA93` (peach) | Used sparingly — one of the only chromatic pixels on the site |
| Loader track | `--loader-track` | `rgb(40, 40, 40)` | `bar-background` |
| Loader fill | `--loader-fill` | `rgb(255, 255, 255)` | `bar-progress` |
| Divider / hairline | `--divider` | `#FFFFFF` (1px) | `button__divider` and `interactive_bar_line` |
| Divider (soft) | `--divider-soft` | `rgba(255,255,255,0.2)` | Counter dividers, faint separators |
| Underline (idle) | `--underline` | `rgba(255,255,255,0)` | `.underline.fade` |
| Underline (hover) | `--underline-hover` | `#FFFFFF` (white) | `.underline.animate` on `work__menu-list-btn` |
| Border (form/field) | `--border` | `#C0C0C0` | Default UA `[fieldset]` reset |
| Highlight (legacy yellow) | `--highlight` | `#FFFF00` (yellow) | UA `<mark>` reset — not used in design |
| OldIE bg | `--oldie-bg` | `#121212` | `#oldie_message` fallback |

There is no light-mode variant and no dark-mode toggle. The single
"mode" is the black stage.

### Typography

The site self-hosts a single commercial family, **Fort**, in five
weights, with **Work Sans** as a UI/secondary face. Both are declared
via `@font-face` with `eot/woff/ttf/svg` fallback chains in
`css/all__87c035b0.css` (9 `@font-face` blocks). All Fort weights
also have a corresponding `.svg` font outline in `svgs/`.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| H1 — tag line (`.js-tagLine`) | `Fort-Extralight, Arial, sans-serif` | 400 (file weight) | `clamp(43.2px, …)` — observed `43.2px` at desktop 9px root | `1.0` (`43.2px`) | `normal` |
| Display — loader percentage (`.interactive_loading`) | `Fort-Extralight, Arial, sans-serif` | 400 | `58.5px` | `58.5px` (1.0) | `-0.02em` (`-1.17px`) |
| Body — root / shell | `Fort-Book, Arial, sans-serif` | 400 | `16px` (set on `.shell`) | `16px` (1.0) | `normal` |
| Body — root (page base) | `Fort-Book, Arial, sans-serif` | 400 | `14.4px` (`.rootNode`) | `normal` | `normal` |
| Counter / sub-label | `Fort-Book, Arial, sans-serif` | 400 | `17px` | `normal` | `normal` |
| Menu link (`.work__menu-list-btn`) | `Fort-Medium, Arial, sans-serif` | 400 (file weight) | `9.9px` (1.1rem at 9px root) | `19.8px` (2.0) | `0.1em` (`0.99px`); `text-transform: uppercase` |
| Button label (`.button__text`) | `Fort-Medium, sans-serif` | 400 | `15px` (desktop), `14px` on reel play button | `21px` (1.4); `1` on reel | `normal`; `0.1em` on reel |
| Bar message (`.interactive_bar_msg`) | `fort-medium` | 400 | `10px` | `normal` | `0.4px` |
| Legacy / fallback (also self-hosted) | `WorkSans` (Thin / ExtraLight / Light / Regular) | 100 / 200 / 300 / 400 (file weight) | not observed in computed styles | — | — |

Notes:
- The HTML root sets `font-size: 9px` on `<html>`, so all `rem`
  declarations in the stylesheet are effectively `9px × n`. The
  measured `9.9px` menu-link size and `19.8px` line-height are
  consistent with `1.1rem` / `2.2rem` at that root.
- `font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`
  are explicitly set on the menu button.
- `text-transform: uppercase` is used on the archive button label only.
- All Fort weights ship with an EOT for IE8, WOFF for modern desktop,
  TTF in the Work Sans set, and SVG-font fallbacks.

### Spacing & radius

- **Base unit:** not 4px — the root `<html>` is set to `font-size:
  9px`, so `1rem = 9px` for the entire site. Most spacing values are
  stated in `px` and remap to clean pixel values at that root.
- **Common px values observed:** 18, 20, 23, 65, 80, 84, 100, 180, 200.
- **Shell button hit area:** `200px × 200px`, the invisible `.button__hitarea`
  that makes the small 18–24px icons easy to click. This is the
  "spacing budget" for the four corner controls.
- **Radii:**
  - `.button__hitarea` → `border-radius: 50%` (full circle hit area).
  - A small set of utility rules → `border-radius: 3px` (3px rounded
    rectangles elsewhere in the bundle).
- **Shadows:** one rule in the bundle:
  `box-shadow: rgba(0,0,0,0.2) 0 2px 4px 1px`. No other elevations.
- **No rounded card or button system** — almost every UI element is a
  flat black or flat white shape on black.

### Iconography

- **Style:** 1px stroke, square line caps, single-color (white on
  black), outlined. No filled glyphs except the **drop** symbol
  (`#icon-drop`, viewBox `0 0 36.21 50`), which is solid white fill.
- **Library:** a **custom inline SVG sprite** declared inside a
  hidden `<svg class="spritemapSVG">` block in the document head and
  referenced via `<use xlink:href="#icon-…">`. The same sprite is
  mirrored to `svgs/spritemap__4e9faf24.svg` for caching.
- **Sprite contents (14 symbols):** `icon-arrow`, `icon-close`,
  `icon-close-alt`, `icon-close-left`, `icon-close-right`,
  `icon-drag-arrows`, `icon-drop`, `icon-fb-logo`, `icon-fullscreen`,
  `icon-ipad`, `icon-loading_ring`, `icon-play`, `icon-rotate`,
  `icon-temp-menu`, `icon-twitter-logo`.
- **Default size:** the menu icon is rendered at `18px × 18px` (the
  SVGs are viewBox-normalized, so `<use>` sizing is controlled by the
  parent element). The drop icon is `24px × 22px` (landscape) /
  `30px × 30px` (portrait). The loading ring is `20px × 20px`.
- **Note:** the **Twitter** and **Facebook** glyphs are present in
  the sprite but are not surfaced as social links on the homepage
  shell — the award SVGs (awwwards, cssda, d&ad, fwa, fwa-m,
  cannes-lion, one-show, webbys) are the only "social proof" marks
  visible, and they sit as static badges in the work pages.

---

## Layout & Grid

- **Max content width:** effectively the **viewport** — every shell
  control is positioned relative to the window edges (`right:23px`,
  `top:20px`, `left:23px`, `bottom:21px`, etc.), not a centered
  container.
- **Page gutter:** none. There is no `<main>` content column.
- **Grid:** there is no 12-column grid system; the layout is a
  fixed-corner shell plus a single centered tag line plus a centered
  horizontal `.interactive_bar` (250px wide, `left:50%` /
  `margin-left:-125px`).
- **Breakpoints (from CSS @media):** only one was observed —
  `@media only screen and (min-width: 1921px)` — used 6 times to bump
  the canvas/asset scale on 4K+ displays. There is no mobile
  breakpoint in the desktop stylesheet (a separate `index_mobile`
  build exists at `html/asset_*` but the dump's rendered DOM is
  desktop).
- **Vertical rhythm:** the shell controls are aligned to `top:15–20px`
  and `bottom:21–80px`, and the interactive bar is at
  `bottom:80px`. The tag line is vertically centered in the canvas.
- **Root scaling:** the entire page is sized off a `9px` root font
  size, so all `rem` values are quantized to multiples of 9. This is
  unusual and effectively acts as a global zoom.

### Homepage layout, top to bottom

The page is one `100vh` stage with a small fixed control cluster on
the outside and the WebGL scene behind. The CSS positions and the
observed DOM compose as follows:

1. **Top-left** — `.shell__button--drop`, `left:23px; top:15px;
   width:18px; height:24px`. Renders the `<use href="#icon-drop">`
   inline canvas icon (the "drop"). The text label *"Drop"* lives
   invisibly on a `<span class="js-button__text">` that fades in on
   hover, sliding in from `translate(22, 0)`.
2. **Top-right** — `.shell__button--menu`, `right:23px; top:20px;
   width:18px; height:18px`. Renders `#icon-temp-menu` (three
   horizontal bars). Label *"Discover"*, hidden by default.
3. **Bottom-left** — `.shell__button--reel`, `left:23px; bottom:21px;
   width:15px; height:17px`. A custom shape (no sprite icon — drawn
   on a canvas). Label *"Showreel"*, always visible.
4. **Bottom-right** — `.shell__button--sound`, `right:23px; bottom:21px;
   width:24px; height:16px`. Drawn on a canvas (a row of audio
   "ticks"). Label *"Audio"*, fades in from `translate(-22, 0)`.
5. **Center** — `<h1 class="js-tagLine">` reads
   *"Resn · Creative Studio"* on the first line and *"Est. 2004"* on
   the second. Set in `Fort-Extralight`, `43.2px / 43.2px` line-height
   (the second line is rendered with a manual `<br>`).
6. **Lower-center** — `.interactive_bar`, a 250px × 1px horizontal
   white line (`background-color: rgb(255,255,255)`) with a small
   centered circle (`.interactive_bar_circle`, drawn on canvas) and
   a counter readout. The bar's helper text is in
   `fort-medium / 10px / 0.4px tracking / rgb(113,113,113)`.
7. **Mid-bottom** — `.work__menu-archive-btn` (`.rootNode`),
   `position:fixed; left:0; top:20px; width:100vw`; contains a single
   `work__menu-list-btn` reading *"View All Projects"*. Initially
   `opacity:0; pointer-events:none`.
8. **Background** — `.background__shards` (a 3D THREE.js canvas with
   `background-color: #141214`).

---

## Components

### Shell control button (corner pill)

The same component is reused for all four corner controls
(Drop, Discover, Showreel, Audio). It is a fixed-position `<div>` with
an absolutely-positioned invisible round hit area, a canvas/SVG icon,
and a slide-in text label.

- **Anatomy:** `<div class="js-shell__button--* shell__button--* shell__button">`
  → `<div class="button__hitarea">` (200px round invisible target) +
  `<div class="js-button__icon button__icon">` (canvas or `<svg><use>`)
  + `<span class="js-button__text button__text">` (label).
- **Position variants:** top-left (drop), top-right (menu),
  bottom-left (reel), bottom-right (sound). Each has a `right:` /
  `left:` / `top:` / `bottom:` offset between 15px and 23px from the
  edge.
- **Sizes:** 18×18 (menu), 18×24 (drop), 15×17 (reel), 24×16 (sound).
- **Hit area:** `200px × 200px`, `border-radius: 50%`, `position:
  absolute`, transparent.
- **Label styles:** `font-family: Fort-Medium; font-size: 15px;
  line-height: 21px; color: rgb(227, 227, 227); padding: 0 23px 0 0;`
  (the text slides in from `translate3d(±22px, 0, 0)` and fades in
  via opacity transitions on hover).
- **States (observed):** default (icon only), hover (label slides in
  + fades from opacity 0 to 1), active (GSAP/TweenMax scale/ripple
  animation on the hit-area — drives the "ripple" water-drop effect
  on click).
- **No border, no shadow, no fill** — the only visual is the white
  icon and a white label that becomes visible on hover.

### Tag line (`.js-tagLine`)

- **Tag:** `<h1>`.
- **Family:** `Fort-Extralight, Arial, sans-serif`.
- **Computed desktop size:** `43.2px / 43.2px` (1:1 line-height).
- **Content pattern:** "Brand · Role" on line one, "Est. YYYY" on
  line two (resn.co.nz: *"Resn · Creative Studio"* / *"Est. 2004"*).
- **Color:** `#FFFFFF`.
- **Position:** centered horizontally and vertically in the canvas.
- **No animation by default**; the inline `style="opacity:
  0.695913"` observed in the rendered DOM suggests it is being
  driven by a `TweenMax.to(...)` call (not visible in CSS).

### Interactive bar (`.interactive_bar`)

- **Container:** `position: fixed; width: 250px; height: 1px;
  left: 50%; margin-left: -125px; bottom: 80px; z-index: 2000;
  pointer-events: none;`
- **Anatomy:** a 1px-tall white horizontal line (`.interactive_bar_line`)
  with a circular node (`.interactive_bar_circle`, drawn on a canvas,
  sized with `margin: -40px 0 0 -40px` so it sits centered on the
  line) and a counter chip (`.interactive_bar_counter`, `Fort-Book
  17px`, hidden by default).
- **Helper text** (`.interactive_bar_msg`): `font: fort-medium;
  font-size: 10px; letter-spacing: 0.4px; color: rgb(113,113,113);`
  centered below the line.
- **Counter divider:** `background: rgba(255,255,255,0.2);` a faint
  vertical bar between counter digits.
- **Purpose:** this is the *"interactive count"* — clicking it cycles
  through the 3D background scenes (drop variants and project
  previews) loaded from `interactives.json`.

### Discover menu (`.work__menu-archive-btn`)

- **Container:** `position: fixed; left: 0; top: 20px; width: 100vw;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; opacity: 0; pointer-events: none;
  z-index: 1000;`
- **Menu items:** `.work__menu-list-btn` anchors; observed content is
  a single *"View All Projects"* link (the menu renders a vertical
  list of category names loaded from `categories.json`: Activation,
  Animation, Branding, Content, Creative Strategy, Design,
  Development, Games, Motion).
- **Item typography:** `Fort-Medium, Arial, sans-serif; font-size:
  1.1rem; line-height: 2.2rem; letter-spacing: 0.1em;
  text-transform: uppercase;` white on black.
- **Underline treatment:** every item contains two `<span class="underline">`
  children — one `animate`, one `fade` — that animate the underline
  on hover (the typical "stretch-from-left" underline effect).

### Showreel page (`.reel-page`)

- **Trigger:** `.shell__button--reel` (bottom-left).
- **Behavior:** opens a fullscreen `video.js`-styled video player
  with a centered poster (`showreel-poster.jpg`, 237 KB) and a play
  button that uses the same `button__text` styles
  (`font-size: 14px; line-height: 1; letter-spacing: 0.1em;`).
- **Close:** the `.shell__button--project` button at `right:65px; top:0;
  width:180px; height:auto; padding:18px 0 84px;` shows a
  *"Close Showreel"* / *"Close Project"* label and a 1px white
  vertical divider (`.button__divider`).

### Project page

- **Trigger:** the **Drop** button. After the drop animation
  completes, the project view fades in with a poster image and
  project metadata.
- **Layout:** a fullscreen project page, anchored at
  `z-index: 100; width: 100%; height: 100%; overflow: hidden;`
  (`.rootNode`).
- **Content:** per the JSON feed (`projects.json`), each project has
  `title`, `description`, `client`, `date`, `role`, `platforms`,
  `url`, `poster`, and an `items` array of typed blocks (`image`,
  `headline`, `text`, `video`, `gallery`).
- **Sample project** (from `projects.json`): *"Tracing Art"* for
  Getty (May 2025, Desktop/Tablet/Mobile, URL
  `https://www.getty.edu/tracingart/`). 84 total projects in the
  feed.

### Old-browser fallback (`#oldie_message`)

- **Trigger:** Modernizr-2.5.3 detects missing features.
- **Visuals:** fixed fullscreen panel `position:fixed; left:0; top:0;
  width:100%; height:100%; background:#121212; z-index:10000;` with
  a centered 552×168 PNG illustration (`images/old-browser__53776c6a.png`,
  7.9 KB).

### Loader

- **Bar:** `position:absolute; left:0; top:0; width:100%; height:100%;
  z-index:10;` with a `.bar-background` (`rgb(40,40,40)`) and
  `.bar-progress` (`rgb(255,255,255)`) stacked at the bottom of the
  page, each 1px tall.
- **Drop icon:** `24px × 22px` (landscape) / `30px × 30px` (portrait),
  `fill: #fff`, `opacity: 0` until progress starts, then fades in.

---

## JavaScript & Libraries

The site is a single self-contained SPA. It does **not** use a modern
framework — it is built on the "classic 2014-era interactive agency
stack": jQuery + Backbone + RequireJS + GSAP + THREE.js. All scripts
live under `https://resn.co.nz/20260607232410_1_0_8475ced/js/`.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| jQuery | 2.1.4 | Bundled header comment in `js/loader__f3584788.js` | Plus Sizzle |
| Underscore | 1.8.3 | Bundled header comment in `js/loader__f3584788.js` | |
| Backbone | (not pinned in dump) | `js/main_desktop_extended__11addd3c.js` defines `route/router` with `["backbone", "underscore"]` | `Backbone.Router`, `Backbone.View`, `Backbone.Model`, `Backbone.Collection`, `Backbone.Events` all used |
| GSAP / TweenMax | (TweenMax module present; no version banner) | `js/main_desktop_extended__11addd3c.js` references `TweenMax`, `TweenLite`, `TimelineLite` | Powers the drop/ripple animation, page transitions, menu reveals |
| THREE.js | **r84** (`THREE.REVISION = "84"`) | `js/main_desktop_extended__11addd3c.js` | Plus `OBJLoader`, `EffectComposer`, `RenderPass`, `ShaderPass`, `BloomPass`, `BasicBlurShader`, `FXAAShader`, `FilmShader`, `MaskPass`, `CopyShader`, `ColorCorrectionShader`, `NoiseShader` (postprocessing chain) |
| Modernizr | 2.5.3 | `js/modernizr-2.5.3.min__055a69b0.js` | Feature detection drives `#oldie_message` and the `js-` class hooks on `<html>` |
| Device.js | (Matthew Hudson, MIT) | Bundled in `js/loader__f3584788.js` | Detects phone/tablet/desktop/landscape/portrait |
| RequireJS | (bundled) | `js/require__4c3eee79.js` | `data-requirecontext`, `data-requiremodule` on the inline scripts (`"loader"`, `"text"`) |
| text.js (RequireJS plugin) | (bundled) | `js/text__c72bea23.js` | Used to load HTML/JSON templates |
| es6-shim | (bundled) | `js/es6-shim.min__161e83d8.js` | ES6 polyfills in older browsers |
| video.js | (default skin CSS in `<head>`) | inline `<style class="vjs-styles-defaults">` referencing `.video-js` classes | Used on the showreel page |
| LinkedIn Insight | (live) | `https://snap.licdn.com/li.lms-analytics/insight.min.js` (loaded but not in the dump) | Analytics |
| HubSpot | (live) | `https://js.hs-analytics.net/analytics/.../5452172.js`, `hubspot-web-interactives-embed.js`, `banner.js`, `pixels.js` | Marketing/cookie banner |

Build artifact note: the dump URL contains
`/20260607232410_1_0_8475ced/`, which is the deploy timestamp + build
hash. The `main_desktop_extended.js` bundle is **4.0 MB** (un-minified
looking — likely a development or extended build) and embeds all the
page modules plus the THREE.js postprocessing chain.

---

## Animations (Catalog)

The site is heavy on motion. Most animation is driven by JavaScript
(GSAP/TweenMax and THREE.js); the CSS only contributes the loader
spinner and a few small transitions.

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `loadingRing` | `css/all__87c035b0.css` (inline) | `1.5s` | `cubic-bezier(0.46, 0.03, 0.52, 0.96)` | `infinite` — applied to `.icon-loading_ring` / `.loader__loading` while loading |

The CSS also declares a small set of utility transitions
(see `css/all__87c035b0.css`):

| Property | Duration | Easing |
| --- | --- | --- |
| `border-color` | `200ms` | `ease-in-out` |
| `opacity` | `200ms` | `ease-in-out` |
| `opacity` | `0.8s` | `ease-out` |
| `background-color` | `300ms` | `ease-in-out` |
| `transform` | `200ms` | `cubic-bezier(0.165, 0.84, 0.44, 1)` |
| `all` | `200ms` | `cubic-bezier(0.165, 0.84, 0.44, 1)` |

### JS-driven animations

The `letters.json` data structure (206 entries, each describing a
fontFormat, color, textTransform, and a per-character `x/y` offset)
strongly suggests that **word and letter animations are
pre-computed** and played back frame-by-frame: each character has a
fixed `(x, y)` position, and the renderer interpolates between
states. This is the classic "sprite-sheet of words" approach Resn
uses to make their copy feel choreographed.

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP `TweenMax` | `shell__button` hover | mouseenter on `.shell__button` | Label slides in from `translate(±22, 0)`, fades opacity 0→1, ~250–400ms (assumed from `cubic-bezier(0.165, 0.84, 0.44, 1)`) |
| GSAP `TweenMax` | `interactive_bar` | mount | Counter readout slides digits in from `transform: matrix(1, 0, 0, 1, 0, 24)` to `matrix(1, 0, 0, 1, 0, 0)` |
| GSAP `TweenMax` | `tagLine` | load | `style="opacity: 0.695913"` observed mid-tween — animates from 0 to 1 on load |
| GSAP `TweenMax` | `work__menu-archive-btn` | Discover click | Fades from `opacity:0; pointer-events:none` to `opacity:1`; list items stagger in |
| GSAP `TweenMax` | `.underline.animate` | hover on menu link | Underline expands from 0 width to 100% width (white) |
| GSAP `TweenMax` | `loader bar` | page load | `bar-progress` width animates 0% → 100% as the THREE.js preloader reports progress |
| THREE.js | `drop_ripple` (3D drop entering water) | Drop click | Hit area expands + collapses in a 3D ripple; final state reveals a project poster |
| THREE.js | `background__shards` (5 shard backgrounds) | Interactive bar click | Cycles through the 5 `interactives.json` scenes — Shapeshifter, Rod, etc. — with a camera/mesh transition |
| THREE.js + postprocessing | `EffectComposer` (RenderPass + BloomPass + FilmShader + FXAAShader + ColorCorrection + Noise) | always-on | Applies a soft bloom, a subtle film grain, and color grading to the entire scene |
| THREE.js `OBJLoader` | `drop_gem5.obj` | Drop icon initial state | Renders a 3D crystal/gem drop as the resting state of the corner drop icon |
| `requestAnimationFrame` sprite player | `letters__e35f5a8e.json` playback | per menu/page reveal | Plays back the pre-computed per-character positions as a word forms letter-by-letter |

### Page transitions

- The site is a single page, so there are no SPA route transitions in
  the conventional sense. Transitions are **state transitions**:
  *home → menu*, *home → reel*, *home → project*, *project → home*,
  etc. Each one is a custom GSAP timeline that crossfades the canvas
  and the overlay UI.
- The **drop-to-project** transition is the signature: the 3D drop
  morphs (vertex displacement) and falls into a "water surface," a
  ripple expands, and the project poster fades in.

---

## Assets

Inventory of the assets observed in the dump. The dump's "other/"
folder contains the live data feeds (projects, categories, letters,
sounds, interactives) — these are the JSON the SPA reads at runtime
to populate its UI.

### 3D models

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/resn/models/drop_gem5__b86bb146.obj` | Wavefront OBJ | 192,726 B (188 KB) | `https://resn.co.nz/20260607232410_1_0_8475ced/models/drop_gem5.obj` | A 3D "drop gem" loaded via `THREE.OBJLoader` for the drop icon and the entry ripple animation |

(Only one 3D model in the dump; the rest of the 3D content is
generated procedurally in THREE.js.)

### Fonts

All Fort weights are self-hosted from `…/fonts/`. Work Sans weights
are self-hosted `.ttf` (no EOT/SVG for the Work Sans set, suggesting
IE8 fallback was not a concern for it).

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Fort | Extralight, Light, Book, Medium, Bold | eot + woff + ttf + svg | `tools/tmp/resn/fonts/` | yes — 5 weights × 4 formats each |
| Work Sans | Thin, ExtraLight, Light, Regular | ttf | `tools/tmp/resn/fonts/` | yes — 4 weights, ttf only |

### Images

Selected from `tools/tmp/resn/images/` and `playwright/images/`. The
drawer dump contains ~70 images. The full set is summarized below
(grouped by role):

| Group | Files (selected) | Format | Sizes (sample) | Notes |
| --- | --- | --- | --- | --- |
| Project posters (hero/case cover) | `pioneer-poster__b2821365.png`, `poster-desktop__5f346499.png`, `MakingMaiselMarvelous-poster__a89aeb36.png`, `JUST_cover__62a3fdf5.png`, `LUCID-POSTER-DESKTOP__dec6ac5e.jpg`, `poster__664e5fed.jpg`, `poster-desktop__ccc2cbb3.jpg`, `poster-desktop__81537ac9.jpg`, `Carousel-Desktop__201a094d.jpg`, `Carousel-Desktop-Navigate__57a44393.jpg`, `world-of-laMer-poster__eb00ee91.jpg`, `vanmoof-poster__bf0fb829.jpg`, `Brandcast_Thumbnail_Desktop__3beda45c.png`, `hero-V4__f58e4356.png`, `desktop-poster__f5ad1c54.webp`, `poster__e1600ecd.webp`, `poster@lg__1f66b872.webp`, `poster-desktop__1cc3d37d.jpg` | png / jpg / webp | 28 KB – 2.0 MB | Per-project hero artwork |
| 3D character sprite frames (body parts) | `body__f828a1b7.png`, `face_0..5__*.png`, `hand_left_0..5__*.png`, `hand_right_0..5__*.png`, `leg_left_0..5__*.png`, `leg_right__*.png`, `foot_left__*.png`, `foot_right__*.png`, `slice0..3__*.png` | png | 11 KB – 95 KB | Six-frame sprite sheets for a hand/body/leg rig — used in the "Drop" interaction |
| Background / texture | `bg-ios-fallback__3b20e219.jpg`, `lines__4958619a.jpg`, `refraction__c28dae3e.jpg`, `_bg_grain_01..03__*.jpg`, `zerolandfill_overlay__be0d8d44.png` | jpg / png | 41 KB – 289 KB | Lines, refraction, grain overlays, fallback poster |
| UI icons (texture pngs) | `menu__5938e21a.png`, `home__345d2056.png`, `reel__92af9f93.png`, `audio_on__a9b74f6f.png`, `audio_off__59ecaf75.png`, `old-browser__53776c6a.png`, `contact_arrow__91e8134b.png` | png | 1 KB – 21 KB | Texture-asset versions of the corner shell icons (canvas-drawn) |
| OG / share | `resn-share__464d1b6c.jpg`, `showreel-poster__d6b75c56.jpg` | jpg | 54 KB – 237 KB | OG image and showreel poster |

### SVGs & icons

- **Inline SVGs in HTML:** 1 hidden `<svg class="spritemapSVG">`
  block in the document body containing 14 `<symbol>` elements
  (listed in *Iconography* above).
- **Standalone SVG files in dump:** 14 files in `tools/tmp/resn/svgs/`
  — 7 are **award badges** (`awwwards`, `cssda`, `d-and-ad`, `fwa`,
  `fwa-m`, `cannes-lion`, `one-show`, `webbys`) and 5 are **Fort
  font SVG outlines** (`Fort-Bold`, `Fort-Book`, `Fort-Extralight`,
  `Fort-Light`, `Fort-Medium`) used as the IE8/SVG-font fallback.
  The final two are `spritemap__4e9faf24.svg` (the public copy of
  the sprite) and a `mobile-landscape.png` / `mobile-portrait.png`
  pair (devices, not SVGs — listed under images above).
- **Icon system:** the **custom sprite** declared inline
  (`#icon-*` ids) — no Lucide / Phosphor / Heroicons. The only
  third-party-style mark is a `noun_menu_93427` icon
  (`#icon-temp-menu`) attributed to a Noun Project export.

### Audio & video

The site is also an audio piece. The `sounds.json` file maps every
SFX to a single MP3 with multiple **time-range sprites**. There is no
Web Audio API; the dump shows `Howler`-style sprite sheet usage.

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/resn/media/default_mixdown__3a08d9b4.mp3` | MP3 (150 KB) | Default SFX sprite — `word_appear`, `resnX`, `random_1/2` |
| `tools/tmp/resn/media/rollovers_mixdown__b8655438.mp3` | MP3 (117 KB) | Menu-rollover sprite — `menu1..4` (short clicks) |
| `tools/tmp/resn/media/menu_drop_loop__cd60cacb.mp3` | MP3 (68 KB) | Looping menu drop sound |
| `tools/tmp/resn/media/drop_vibrate__7751c4f3.mp3` | MP3 (23 KB) | Drop vibrate (short) |
| `tools/tmp/resn/media/inside_drop_01__8beebd61.mp3` | MP3 (583 KB) | Inside-the-drop ambient |
| `tools/tmp/resn/media/tunnel__b5d3fd46.mp3` | MP3 (155 KB) | Tunnel transition |
| `tools/tmp/resn/media/accordian_mixdown__feea9ada.mp3` | MP3 (161 KB) | Accordion music bed |
| `tools/tmp/resn/media/bats_mixdown__f029bc15.mp3` | MP3 (473 KB) | "Bats" music bed |
| `tools/tmp/resn/media/shapes_mixdown__b7cf741d.mp3` | MP3 (130 KB) | Shapeshifter music bed |
| `tools/tmp/resn/media/shapeshifter__dcb50c8b.mp3` | MP3 (106 KB) | Shapeshifter alternate |
| `tools/tmp/resn/media/interactive__ea36b337.mp3` | MP3 (51 KB) | Interactive bar click |
| `tools/tmp/resn/media/bg_01..03__*.mp3` | MP3 (729 KB each) | Three background music loops (one per interactive scene) |
| `tools/tmp/resn/media/work_01..04__*.mp3` | MP3 (66–137 KB) | Per-project music beds |
| `tools/tmp/resn/images/showreel-poster__d6b75c56.jpg` | JPG (237 KB) | Poster for the showreel video (not the video itself) |

No raw `.mp4` was captured in the dump — the showreel is served
through a `video.js` player; the actual file URL is loaded at runtime
and was not in the static pass. There are also **3D `THREE.Audio`
playback hooks** (`THREE.AudioLoader`, `THREE.AudioAnalyser`) in the
main JS bundle, which suggests 3D-scene audio reactivity (analyser
data driving shader uniforms or material parameters).

### Data feeds (`other/`)

These JSON files are not "assets" in the traditional sense but they
are the *content backbone* of the site and worth listing:

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/resn/other/projects__6fb92b8c.json` | JSON (870 KB) | 84 projects + 7 award totals |
| `tools/tmp/resn/other/categories__03ddedb9.json` | JSON (827 B) | 9 categories: Activation, Animation, Branding, Content, Creative Strategy, Design, Development, Games, Motion |
| `tools/tmp/resn/other/interactives__a905ee64.json` | JSON (29 KB) | Per-device texturing of 3D background scenes (Shapeshifter, Rod, etc.) |
| `tools/tmp/resn/other/letters__e35f5a8e.json` | JSON (422 KB) | 206 pre-computed word-animation entries (font, color, per-letter x/y) |
| `tools/tmp/resn/other/sounds__d1aae042.json` | JSON (5.7 KB) | Sprite sheet manifest for the audio files above |

---

## Motion & Interaction

### Principles

- Every UI element is **200ms and a `cubic-bezier(0.165, 0.84, 0.44, 1)`
  ease** (the "out-back-ish" curve used in the CSS transitions) for
  micro-interactions. The 3D scene uses GSAP `TweenMax` for the
  larger transitions and THREE.js's renderer loop for the
  ambient/background motion.
- The 3D scene is **always on** — even when you are reading copy, a
  particle/shard system is running in the background, and a
  bloom + film-grain postprocess is applied.
- The site treats text as **kinetic typography**: every word reveal
  is a pre-computed letter-by-letter animation driven by
  `letters.json`.
- Audio is **on by default** (or at least, easy to toggle — the Audio
  button is a permanent corner control), and many of the visual
  transitions are synced to SFX sprites (the `default_mixdown` sprite
  has a `resnX` slot that almost certainly plays the moment the home
  screen finishes loading).

### Specific behaviors

- **Shell button hover:** the icon stays in place; the label slides
  in from `translate(±22px, 0)` and fades opacity 0→1 in ~250ms.
  Audio cue: a `rollovers_mixdown` sprite (`menu1..4`).
- **Shell button click (Drop):** the 200px round hit area collapses
  inward, a THREE.js drop ripple fires, an OBJ mesh (`drop_gem5.obj`)
  scales up and falls, then a project poster fades in. Total ~1.5s.
- **Discover click:** the work menu fades in from
  `opacity:0; pointer-events:none` to `opacity:1` and the category
  list staggers in (line-height `2.2rem` gives the stagger spacing).
  Underline animates from `0%` to `100%` width per item on hover.
- **Interactive bar click:** cycles the 3D background through the
  5 entries in `interactives.json` (Shapeshifter, Rod, and others
  per platform). The white circle on the bar moves to the new
  position; the counter readout updates.
- **Audio toggle:** the bottom-right tick icon animates between
  on/off states (`audio_on.png` / `audio_off.png` are the texture
  references); a 1px white divider appears in the project close
  button when a project is open.
- **Page transition (project close):** the `shell__button--project`
  appears with the text *"Close Project"* / *"Close Showreel"*
  fading in; on click, it reverses the entry animation.
- **Scroll behavior:** there is essentially no scroll on the home
  page; the entire experience is viewport-pinned. The project page
  allows scroll inside the `.rootNode` (`overflow:hidden;
  position:fixed; width:100%; height:100%`).

### Reduced motion

Not observed explicitly in the dumped CSS. The site does not contain
a `@media (prefers-reduced-motion: reduce)` block in
`css/all__87c035b0.css`. Given the 3D-heavy, audio-driven nature of
the site, this is an accessibility gap (see *Accessibility*).

---

## Content & Voice

- **Tone:** confident and direct, technically literate, deliberately
  playful. Resn is positioning themselves as a creative studio
  rather than a vendor — the copy is spare and the work does the
  talking.
- **H1 copy:** *"Resn · Creative Studio"* / *"Est. 2004"* (16 chars
  on line one, 10 chars on line two). The middle dot `·` is the
  recurring brand punctuation.
- **Tag line (meta description):** paraphrased — a New Zealand
  creative studio shaping digital brand, content, and interactive
  experiences with global brands and emerging innovators.
- **CTA vocabulary:** very small — the site only has a handful of
  *actions*, not marketing CTAs. Observed button labels:
  *Drop*, *Discover*, *Showreel*, *Audio*, *Close Project*,
  *Close Showreel*, *Close Overview*, *View All Projects*. No
  *"Hire us"*, *"Contact sales"*, etc. — the contact route is
  *info@resn.co.nz* (referenced via `mailto:` elsewhere in the
  source).
- **Capitalization:** Sentence case in the H1, Title Case in the
  close-project labels, UPPERCASE in the menu list (set via
  `text-transform: uppercase`).
- **Punctuation:** the middle dot `·` (U+00B7) is a recurring
  brand separator (also appears in the contact email and the
  "View All Projects" affordance in the menu).
- **Copy density:** very low. Most of the site is *visual*; text is
  reserved for the H1, the menu items, and the project metadata
  on each case-study page.

---

## Information Architecture

Resn is a single-page app — there is only one route, and content
opens in overlays. The "menu" structure comes from
`categories.json` and the project list from `projects.json`.

- `/` — the home/drop experience. Single full-bleed WebGL canvas,
  four corner shell controls, centered tag line, interactive bar
  with the 5 background scenes, and the project archive menu.
  Includes a small render of the studio's tag line, their 2004
  founding year, and the 9 work categories.
- `/projects/<slug>` (logical, e.g. `tracing-art`, `pioneer`,
  `sheer-cupidity`, `lucid`, `brandcast`, `just`, `vanmoof`,
  `world-of-laMer`, `valmont`, `apeel`, `sculpting-harmony`,
  `alpine-bio`, `kpr`, `zentry`, `savor`, `adobe-bowie`, `maisel`,
  `nvg8`) — full-bleed project pages, fed by the entries in
  `projects.json` (84 projects). Each project is a sequence of
  `items` of type `image | headline | text | video | gallery`.
- `/reel` (logical) — the showreel video page, opened by the
  bottom-left Showreel button.
- `/menu` (logical) — the Discover menu overlay, opened by the
  top-right button. Lists the 9 categories and "View All Projects".

There is no separate `/about`, `/contact`, `/careers`, `/blog`, or
`/press` page observed in the dump. Everything is folded into the
home overlay structure or the project pages.

---

## Accessibility

- **Color contrast:** body text on black is white (`#FFFFFF`) on
  `#000000`, which is the maximum possible contrast (21:1). The
  secondary text `#E3E3E3` on black is ~14:1, still well above
  WCAG AA. The muted text `#717171` on black is ~5.1:1 — just over
  the AA threshold for body text and comfortably above the
  AA-large threshold.
- **Focus indicators:** the CSS resets focus via
  `a:active, a:hover { outline: 0; }` and does not redefine a
  visible focus ring. This is an accessibility gap — keyboard
  users will lose track of focus. The shell buttons and menu
  items inherit no visible focus styling.
- **Keyboard:** the four corner shell buttons and the project
  close button are all real `<a>` / `<div>` elements with
  click handlers, so they are reachable in tab order; however,
  the visual focus ring is suppressed. There are no skip-links
  observed.
- **Screen reader landmarks:** the document has no
  `<header>`, `<main>`, `<nav>`, or `<footer>` elements — it is a
  single `<body>` with a flat list of `<div>`s. The
  `class="js-tagLine"` is an `<h1>` (good) but nothing else is
  hierarchical. There is no `<title>` change between "states"
  (the SPA updates the title via `history.pushState`).
- **Motion:** no `prefers-reduced-motion` handling observed. The
  3D background runs continuously, the drop animation is mandatory,
  and the audio plays on a hard-to-find toggle.
- **Alt text:** the sprite icons are `<use>` references — no
  individual `<title>` exposed for screen readers per icon. The
  hidden `<svg class="spritemapSVG">` does include `<title>` tags
  per symbol, which is good. The drop and menu buttons expose
  their labels as visible text (good for screen readers), but the
  Showreel and Audio labels are `visibility: hidden` by default,
  so they are not announced.
- **iOS fallback:** an `iOS fallback` JPG (`bg-ios-fallback.jpg`,
  215 KB) is shipped, suggesting the team tests on iOS Safari
  where some WebGL features are restricted.

---

## Sources

Every URL observed while writing this design.md, all from the
publicly-accessible https://resn.co.nz/ at the time of the dump
(2026-06-18).

- Homepage — https://resn.co.nz/
- Homepage (desktop build) — https://resn.co.nz/index_desktop.html
- Project data feed — https://resn.co.nz/20260607232410_1_0_8475ced/data/projects.json
- Categories feed — https://resn.co.nz/20260607232410_1_0_8475ced/data/categories.json
- Interactives feed — https://resn.co.nz/20260607232410_1_0_8475ced/data/interactives/interactives.json
- Letters feed — https://resn.co.nz/20260607232410_1_0_8475ced/data/letters.json
- Sounds feed — https://resn.co.nz/20260607232410_1_0_8475ced/data/sounds.json
- CSS bundle — https://resn.co.nz/20260607232410_1_0_8475ced/css/all.css
- Main JS bundle — https://resn.co.nz/20260607232410_1_0_8475ced/js/main_desktop_extended.js
- Loader — https://resn.co.nz/20260607232410_1_0_8475ced/js/loader.js
- Sprite — https://resn.co.nz/20260607232410_1_0_8475ced/svg/spritemap.svg
- Award SVGs — https://resn.co.nz/20260607232410_1_0_8475ced/svg/awards/{fwa,fwa-m,awwwards,cssda,one-show,webbys,d-and-ad,cannes-lion}.svg
- Fonts (Fort family) — https://resn.co.nz/20260607232410_1_0_8475ced/fonts/Fort-{ExtraLight,Light,Book,Medium,Bold}.{eot,woff,ttf,svg}
- Fonts (Work Sans) — https://resn.co.nz/20260607232410_1_0_8475ced/fonts/WorkSans-{Thin,ExtraLight,Light,Regular}.ttf
- 3D model — https://resn.co.nz/20260607232410_1_0_8475ced/models/drop_gem5.obj
- OG image — https://resn.co.nz/resn-share.jpg?bar=2

---

## Changelog

- 2026-06-19 — Initial draft by sub-agent, derived from the
  `tools/tmp/resn/` static + Playwright dump. 84 projects, 9
  categories, 5 background interactives, 1 3D model, 9 fonts
  (5 Fort + 4 Work Sans), 14 inline SVG sprite symbols, 13
  audio sprites, and the classic agency stack (jQuery 2.1.4 +
  Underscore 1.8.3 + Backbone + GSAP/TweenMax + THREE.js r84 +
  Modernizr 2.5.3 + RequireJS) were observed.
