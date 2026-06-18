# Dogstudio — design.md

> A structured design specification of **https://dogstudio.co**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** design.md_gen
> **Source dump:** `tools/tmp/dogstudio/` (gitignored)

---

## Overview

Dogstudio is a multidisciplinary creative studio's marketing site. The home
page is a single full-bleed dark canvas anchored by an interactive WebGL
mascot (a stylised 3D dog) that reacts to the cursor and scroll. A tall
serif wordmark anchors the hero, a case-study index scrolls past in
oversize hairline text, and a Plyr-powered showreel modal sits behind
everything. The aesthetic is dark, cinematic, and reserved — heavy
contrast between near-black backgrounds, white serif display, and a
single saturated red accent. WordPress powers the CMS; the front-end
is heavily customised with a custom router, GSAP timelines, a Three.js
3D scene, and lazy `<picture>` image stacks. An ambient audio loop
plays on the home page and is toggleable from a fixed circular control.

**Category:** Marketing / Studio portfolio
**Primary surface observed:** Homepage (full, post-JS render)
**Tone:** confident, dark, cinematic, technically confident, slightly playful
**Framework detected (if any):** WordPress 4.8 (CMS) + custom WebGL front-end
(no Next.js / Nuxt / Astro / Vite SPA markers in the dump)

---

## Visual Language

### Color

The palette is a deep near-black base with cool lavender-blue muted
text and a single hot red accent (`#FF4940` / `#E43333`). Mid-tones
in computed styles lean into a desaturated lilac (`rgb(160, 168, 220)`
≈ `#A0A8DC`) for body copy and a slightly lighter
`rgb(187, 194, 229)` (`#BBC2E5`) for muted UI.

| Role | Token (informal) | Value | Notes |
| --- | --- | --- | --- |
| Background (base / hero) | `--bg-base` | `#0E101A` | dark navy-black, also loader bg |
| Background (elevated / menu) | `--bg-elevated` | `#131419` | site-menu backdrop, showreel backdrop at 80% |
| Background (panel) | `--bg-panel` | `#0D0E12` | secondary dark surface |
| Background (cookie banner) | `--bg-cookie` | `#0E101A` | pill at `border-radius:20px` |
| Text (primary) | `--text-primary` | `#FFFFFF` | display + headings |
| Text (secondary) | `--text-secondary` | `rgba(160, 168, 220, 0.7)` ≈ `#A0A8DC` at 70% | lead/body copy |
| Text (muted) | `--text-muted` | `rgba(187, 194, 229, 0.3)` ≈ `#BBC2E5` at 30% | case-list lines, footer social labels |
| Text (label purple) | `--text-label` | `rgb(100, 109, 158)` ≈ `#646D9E` | eyebrow / pill labels |
| Accent (primary) | `--accent` | `#FF4940` | "saturated red", the only saturated accent |
| Accent (hover) | `--accent-hover` | `#C22B2B` (button--orange hover) | used for the orange button variant |
| Accent (red 2) | `--accent-line` | `#E43333` | hairline / line-anim, also link underline and progress ring |
| Border (subtle) | `--border` | `rgba(228, 236, 255, 0.1)` | 10% off-white lavender |
| Per-case accent (7 named) | varies | `#D79A21`, `#5FC4AA`, `#58A5C4`, `#FF2EBF`, `#FF66A0`, `#5BB27A`, `#8558FF` | applied to `.home-cases-headline` and `[data-theme]` |
| Loader background ring | — | `#363C5C` (`#E24139` progress) | site-loader-stroke |
| Volume button color | — | `#FF4940` (filled) | toggle in fixed bottom-left |

Note: the WebGL scene contains a per-matcap material (`matcap-combined-resized.jpg`)
that introduces ~30 saturated swatches inside the GL canvas only; the
DOM chrome never uses them. Top CSS hex counts (used inside the GL
shader strings) include `#9194A8` (68), `#FF4940` (57), `#D79A21` (55),
`#DDBC6F` (43), `#FF8F1D` (32), `#3FA1DB` (31) — these are not used as
DOM colors but are part of the 3D scene palette.

### Typography

Three families, all self-hosted, all hand-set. GT Sectra Display is the
display serif; Heebo is the workhorse sans; Gilroy is the geometric
label face used for tracked-out eyebrows, footer headings, and language
chips.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (hero) | `"GT Sectra Display", Times, Georgia, serif` | 700 | `120px` | `0.89` (≈107px) | `-0.04em` (≈-4.8px) |
| Display word (fx-word) | same | 700 | `120px` | `0.89` | `-0.19em` per-word glue |
| H2 / section (about) | same | 400 | `50px` | `1.0` | `0` |
| Case name | same | 700 | `40px` | `1.0` | `0` |
| Eyebrow (cases title) | `"Gilroy", Helvetica, Arial, sans-serif` | 700 | `8px` | `1.0` | `0.5em` (4px) |
| Eyebrow (about) | same | 700 | `9px` | `1.0` | `0.4em` (3.6px) |
| Case-headline tag | same | 700 | `8px` | `1.0` | `0.6em` (4.8px) |
| Lead / hero paragraph | `Heebo, Helvetica, Arial, sans-serif` | 300 | `23px` | `1.52` (≈34.96px) | `0` |
| Body | same | 400 | `14px` | `1.74` (≈24.36px) | `0` |
| Small / footer | same | 400 | `11–12px` | `1.0–1.91` | `0` |
| Showreel link / nav link | same | 500 | `13–15px` | `1.0` | `0` |
| Case-list item (huge) | same | 200 | `80px` | `0.75` (60px) | `0` |
| Date stamp (inside case list) | `"Gilroy", Helvetica, Arial, sans-serif` | 700 | `9px` | `1.0` | `0.36em` (3.24px) |
| Footer city heading | `Heebo, Helvetica, Arial, sans-serif` | 300 | `22px` | `0.82` (18px) | `0` |
| Cookie button label | same | 500 | `14px` | `1.0` | `0` |

All three faces are self-hosted from `tools/tmp/dogstudio/fonts/` in
both `.woff2` and `.woff`. GT Sectra Display is the showpiece — its
high contrast strokes and tall x-height carry the brand. There is no
mono font and no variable font.

### Spacing & radius

- **Base unit:** effectively 4px (most paddings are multiples of 4–8px)
- **Scale observed:** 4, 8, 11, 13, 15, 22, 23, 35, 40, 45, 50, 60, 85,
  100, 200, 208, 280, 365, 405, 549 px
- **Page outer padding:** `50px 45px` on `.site-header`, `0 45px` on `.center`
- **Side bleed (1440 viewport):** `208px` on each side of the centered
  `.center` content column (so content column ≈ 1024px on a 1440 viewport)
- **Section padding:** `.home-hero .center` `200px 0 0`; `.home-cases`
  `405px 0 365px`; `.home-about` `0 0 549px` (large bottom pad for the
  pinned footer effect)
- **Radii:** `0` for nearly all chrome; `3px` on chip / small controls;
  `4px` on plyr menu; `20px` on cookie banner; `50%` / `100%` on
  round toggles (volume, pulsing dot)
- **Shadows:** rare. Volume/play UI uses `box-shadow:0 0 0 5px
  rgba(26,175,255,0.5)` for focus rings; plyr uses
  `0 1px 1px rgba(0,0,0,0.15), 0 0 0 1px rgba(47,52,61,0.2)`; cookie
  banner and menu have no shadow
- **Borders:** 1px `rgba(228,236,255,0.1)` is the only border style

### Iconography

- **Style:** flat, single-color, no stroke variation, 5–55 unit viewBoxes
- **Library:** custom **SVG spritesheet** (no Lucide / Phosphor /
  Heroicons). 24 symbols in `tools/tmp/dogstudio/svgs/spritesheet__a9a6a20b.svg`,
  referenced via `<use xlink:href="…/spritesheet.svg#id">`
- **Symbol IDs:** `caret-left`, `caret-right`, `chevron-left`,
  `chevron-right`, `cross`, `dribbble`, `facebook`, `instagram`, `mail`,
  `mail-thick`, `medium`, `replay`, `twitter`, plus the 9 Plyr icons
  (`plyr-play`, `plyr-pause`, `plyr-muted`, `plyr-volume`,
  `plyr-restart`, `plyr-rewind`, `plyr-fast-forward`,
  `plyr-enter-fullscreen`, `plyr-exit-fullscreen`, `plyr-captions-on`,
  `plyr-captions-off`)
- **Default size:** `12×12` for footer social, `6×10` for inline carets,
  `13×9` for mail-thick, free-size for Plyr controls (CSS-driven)

The site logo is **not** in the sprite — it is an inline SVG with
`viewBox="0 0 401.23099 116.838"` rendered at the top of the header.
A second inline "we make good shit" SVG (`baseline` class) is the
site-menu footer wordmark. Both are pure path geometry with no
fill colors set in markup (inherit `currentColor`).

---

## Layout & Grid

- **Viewport observed:** 1440 × 900 (homepage.png); 1440 × 3800
  (homepage-fullpage.png) — full page is ~3800px tall on desktop
- **Content max width:** ~1024px centered, achieved by `margin: 0 208px`
  on `.center` inside a 1440px canvas (no `max-width` wrapper)
- **Page gutter:** `45px` left/right on `.site-header` and the menu
  list's inner `.center`
- **Vertical rhythm:** irregular; major sections use generous
  pre-padding (`200px`, `405px`, `365px`) to leave room for the
  fixed-position WebGL canvas behind
- **Breakpoints (from `<picture>` `<source>`s in the HTML):**
  - xxs: `max-width: 450px`
  - m:   `max-width: 815px`
  - l:   `max-width: 1030px`
  - xl:  default (no media query, falls through)

The home is a **single full-bleed page** with no real grid system
visible in CSS — sections are vertically stacked, full-bleed, and
positioned with generous top/bottom padding. The `.center` wrapper
aligns the inner content column. The 3D dog canvas is `position:fixed`
(visible as `.dog-scene.is-visible`) and sits behind every section,
with rulers at 1024 / 1190 / top / bottom.

The home page composition (top to bottom):

1. `.site-header` — fixed-ish top bar with logo (left) + news/cases
   links (right) + hamburger (right edge) + volume toggle (fixed
   bottom-left)
2. `.dog-scene.is-visible` — fullscreen WebGL canvas behind everything
3. `.home-background` (picture) — a parallax photo background visible
   in the hero
4. `.home-hero` — center column with red rule + multi-line serif
   display title + showreel link; right column with lead paragraph +
   body + social links
5. `.home-cases` — labeled index (`Featured projects`) + 7 case rows
   + 7 hidden case "scenes" (one per case, populated as the matching
   list row is hovered) + animated red hairline
6. `.home-about` — background image, eyebrow, multi-line serif
   statement, two body paragraphs, "Discover our values" link with
   red underline
7. `.showreel` — hidden modal containing a Plyr Vimeo embed + close
   button
8. `.site-cookie` — floating pill banner (bottom of viewport) with
   consent text and Accept / Deny buttons
9. `.site-footer` — 3 city blocks + social block; bottom row with
   contact email + privacy + EN/ES language switcher

---

## Components

### Site header
- **Height:** ~ auto, padded `50px 45px`
- **Anatomy:** logo SVG (left, ≈120px wide), two right-side text links
  (`All our news` / `All our cases` each prefixed by a 6×11 caret
  sprite), and a 3-bar hamburger at the far right edge
- **Background:** transparent (lives over the 3D scene)
- **Sticky behavior:** rendered at the top of the source, no scroll
  transform observed

### Site menu (full-screen overlay)
- **Trigger:** `.site-header-button` (hamburger, 3 horizontal bars
  animating to an `X` via `.button-bar--1/--2/--3`)
- **Layout:** full-viewport overlay, 5-item nav (Studio, Cases,
  Careers, Values, Contact) in `Heebo 200 60px`; right column has
  showreel link + 3 inline social pills (Fb / Ins / Dri / Tw /
  Newsletter)
- **Background:** `.site-menu-back` (a `<picture>` of pre-baked
  environment art, not a live render) tinted by the
  `background-color: rgb(19, 20, 25)` of `.site-menu-back`
- **Behavior:** swaps the 3D scene to the menu background image and
  slides the panel in

### Site loader
- **Anatomy:** centered SVG progress ring (two `<circle>`s, one
  decorative at 0%, one progress at `stroke-dashoffset: 0` when
  complete) + a frame-by-frame dog sprite positioned above the ring
- **Animation:** JS sets `stroke-dashoffset` on `.site-loader-percent`
  in lockstep with `dog.js` load progress; once `a.onload` fires,
  the loader is hidden by adding `.is-hidden`
- **Z-index:** above everything else while loading

### Volume toggle
- **Position:** `fixed` bottom-left, 56×56 round button
- **Anatomy:** a single `.pulsing-ui` element at `border-radius:50%`
  animates opacity (keyframe `pulse` implicit via the dog loader
  ring) when playing; the button toggles `is-playing` class to mute
  the `ambience__c798ba44.mp3` loop

### Hero title
- **Tag:** `<p class="home-hero-title fx-parent">`
- **Anatomy:** four `<span class="fx-word">` groups containing
  per-letter `<span class="fx-letter fx-letter--N">` spans
- **Type:** GT Sectra Display 700 / 120px / line-height 0.89 /
  tracking -4.8px (computed) — the letters sit on a near-flush
  baseline with no inter-word gap; each `.fx-word` is `inline-flex`
  with `margin-right:15px`
- **Decoration:** two `2px` red rules (`.line--revert`, `.line--2`)
  bracket the title block, each containing a `.line-anim` span
  that scales X from 0 to 1 when in view
- **Display variant:** no hover state; the title is static once
  revealed

### Hero lead + body
- **Lead:** `Heebo 300 23px / 1.52`, color `rgb(255,255,255)`, three
  lines of inline `<span>`s
- **Body:** `Heebo 400 14px / 1.74`, color
  `rgba(160,168,220,0.7)`, three lines
- **Social row:** `Heebo 400 11px / 1.0`, white; five inline
  text-links separated by `margin-top:68px` from the body

### Case-list (Featured projects)
- **Anatomy:** `<ul class="home-cases-list">` of seven `<li>` rows,
  each `<a>` contains a `<span>` (year / status) + the case name
- **Type:** `Heebo 200 80px / 0.75`, color `rgba(187,194,229,0.3)` —
  the list is intentionally low-contrast and "ghosted" so the
  hover/active case can pop
- **Year stamp:** `Gilroy 700 9px / 1.0 / 3.24px tracking` in the
  same muted color
- **Hover behavior:** a hidden `.home-cases-scene--<slug>` div is
  shown next to the active row, holding the per-case headline tag,
  name, body text, and a `<picture>` background

### Case-scene
- **Hidden by default** (`display: none` on `.home-cases-name`,
  `display: none` on the link); appears when a list row is active
- **Headline tag:** `Gilroy 700 8px / 4.8px tracking`, color set
  per-case (gold, teal, blue, magenta, pink, green, brown)
- **Name:** `GT Sectra Display 700 40px / 1.0`, white
- **Body:** `Heebo 300 20px / 1.35`, white
- **Background:** a `<picture>` with 4 source breakpoints; the
  `background-1440__<hash>.png` is the XL artwork
- **Link:** `.link--caret` with red caret sprite and red `::after`
  underline; on hover the underline scales from 0→1 and the caret
  translates right 8px

### About section
- **Background:** a `<picture>` (`.home-about-background`) covering
  the section, 4 source breakpoints
- **Eyebrow:** `Gilroy 700 9px / 3.6px tracking`, color
  `rgba(187,194,229,0.4)`
- **Title:** `GT Sectra Display 400 50px / 1.0` (NOT bold), white,
  with each word broken into `fx-word` / `fx-letter` for the
  in-view stagger
- **Body:** two paragraphs in `Heebo 400 14px / 25px`,
  `rgba(160,168,220,0.7)`
- **Link:** `.home-about-link.link--under`, `Heebo 500 14px`,
  underline is a red `2px` hairline that animates from `scaleX(0)`
  to `scaleX(1)` over 600ms `cubic-bezier(.165,.84,.44,1)` on hover
  or focus

### Showreel modal
- **Trigger:** `js-show-showreel` (hero CTA + menu CTA both link
  to vimeo.com/836218697)
- **Backdrop:** full-viewport `rgba(19,20,25,0.8)` click-to-close
- **Anatomy:** centered `<div class="showreel-wrapper">` containing
  a close button (rotated caret sprite) + a `.plyr.plyr--vimeo`
  iframe at `padding-bottom: 729px` (effectively 16:9 with room for
  the 35px-tall control bar)
- **Player:** Plyr 3.x — full UI, captioned, full-screen-enabled,
  custom-themed (volume slider at `border-radius:26px`,
  tooltip `12px 5/7.5px padding`, accent `rgb(26,175,255)`)

### Footer
- **Top row:** three city blocks (`Chicago .`, `Amsterdam .`,
  `Paris .`) at `Heebo 300 22px / 0.82`; the trailing `.` is set
  in `Gilroy 500 12px` color `#FF4940` as a brand mark
- **Social block:** outlined "we make good shit" SVG (90×54 viewBox
  approximate) + 4 inline social pills (Fb/Ins/Dri/Tw) at
  `Heebo 400 11px` color `rgba(160,168,220,0.7)`
- **Bottom row:** contact line `We'd love to hear from you
  biz@dogstudio.be`, Privacy link, Language switcher
- **Language chip:** `Gilroy 700 11px`, active state has
  `background: rgb(19,20,25)` and `border-radius:3px`,
  `padding:7px 8px`, with a 3-letter caret sprite to the right

### Cookie banner
- **Shape:** `border-radius:20px` pill, `padding:40px`
- **Background:** `#0E101A`
- **Body text:** `Heebo 400 12px / 1.91`, color
  `rgba(160,168,220,0.7)`
- **Buttons:** two ghost buttons in `Heebo 500 14px`, color
  `#E43333` (the same red as the accent line), no border, no
  background; layout is `flex` with 25px gap

---

## JavaScript & Libraries

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| WordPress core | 4.8.2 | `wp-embed.min.js?ver=4.8.2` | CMS backbone, `xmlrpc.php` exposed |
| Yoast SEO | 10.0.1 | inline JSON-LD + meta block | Site metadata |
| jQuery | not directly observed | inferred from WP 4.8 | not used in dump JS files |
| Three.js | r107-era (likely) | `THREE.Matrix`, `THREE.CanvasTexture`, `new THREE.*` (35 hits) in `js/dog__4b194ca3.js` | custom WebGL 3D scene |
| GLTFLoader | bundled in dog.js | `GLTFLoader` (14 hits) | loads `dog.drc.glb` |
| DracoLoader | bundled in dog.js | `Draco`, `draco` (12 hits), `draco_decoder__41f20394.wasm` (230KB) | mesh compression for the GLB |
| OrbitControls | present | `OrbitControls` (1 hit) | light touch-rotation of the dog |
| Custom GLSL shaders | inline | `webgl`/`WebGL` (109 hits) | matcap + lighting in fragment shader |
| GSAP TweenLite | 1.x | `TweenLite` (308 hits) in `js/main__b5659246.js` | the workhorse for scroll triggers |
| GSAP TweenMax | 1.x | `TweenMax` (92 hits) | longer sequences |
| GSAP TimelineMax | 1.x | `TimelineMax` (32 hits) | main scene entrance timeline |
| GSAP core | 1.x | `gsap` (84 hits) | timeline construction |
| Plyr | 3.x | `<link>` to `https://player.vimeo.com/api/player.js` + `.plyr` markup + 9 plyr-* sprite symbols | Vimeo embed player |
| Vimeo player API | n/a | `player.vimeo.com/api/player.js` | loaded async |
| Detectizr | n/a | `detectizr__c3164ea4.js` (8KB) | sets `disable_dog` / `disable_motion` on mobile/tablet |
| Modernizr | n/a | `modernizr__58cbc6e6.js` (6KB) | feature detection (e.g. `backgroundcliptext`, `objectfit`) |
| Custom router | n/a | `data-router-wrapper`, `data-router-view="home"` markup + 9 `data-router` occurrences in main.js | page-transition manager (Barba-like, not the Barba library) |
| Browser-Update | n/a | inline `var $buoop = …` + `browser-update.org/update.min.js` | nag script |
| Google Tag Manager | `GTM-KHP4LGL` | inline GTM bootstrap | analytics |
| Google Analytics | `G-RT7CLMFLME` + `UA-` legacy | gtag / analytics.js | legacy + GA4 in parallel |
| Cloudflare Web Analytics | n/a | `static.cloudflareinsights.com/beacon.min.js` | CF native analytics |
| WP Mailchimp | 4.5.0 | `form-basic.min__ca94ae20.css` | newsletter form styling only |
| Polylang | n/a | `pll_language=en` cookie | EN/ES language switch |

The two main bundles are:

- `js/dog__4b194ca3.js` (687KB) — Three.js + GLTFLoader + DracoLoader +
  custom shader code, plus the dog render loop. ~81 references to
  `matcap` (the material is a single matcap texture applied to the
  mesh). Updates per frame (`update` 233×, `render` 104×).
- `js/main__b5659246.js` (1.69MB) — all the page-level behaviour: GSAP
  timelines, lazy-loading (`.js-lazy`), showreel modal, menu toggle,
  cookie consent, scroll-in-view, router hooks, language switcher.

A custom **router** is implemented via `data-router-wrapper` /
`data-router-view` attributes (Barba.js pattern but not the Barba
library — the JS is hand-rolled). Transitions between pages use
the `.appear-fade-up` keyframe.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where (file:line in main.css) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `u` (volume pulse) | `css/main__600d6084.css:1` (minified) | ~1.2s | `cubic-bezier(.245,.495,0,.99)` | site-volume `is-playing` |
| `ub` (likely volume-pulse variant) | same | n/a | n/a | site-volume secondary state |
| `uba` | same | n/a | n/a | loader/sprite |
| `ud` | same | n/a | n/a | dog loader sprite frame |
| `udefbcafc` | same | n/a | n/a | (long minified name, internal) |
| `uecdad` | same | n/a | n/a | (minified) |
| `uf` | same | n/a | n/a | (minified) |
| `plyr-fade-in` | same | n/a | n/a | Plyr UI fade |
| `plyr-popup` | same | n/a | n/a | Plyr settings menu |
| `plyr-progress` | same | n/a | n/a | Plyr seek bar |
| `appear-fade` (declared as transition, not @keyframes) | inline on `.appear-fade` | 800ms | `cubic-bezier(.215,.61,.355,1)`, delay 0.1s | class `.in-view` added by JS |
| `appear-fade-up` (transition) | inline | 800ms | `cubic-bezier(.215,.61,.355,1)`, delay 0.1s | class `.in-view` added by JS |
| `appear-fade-right` (transition) | inline | 800ms | same easing | class `.in-view` |
| `line-anim` (transition: transform) | inline | 400–600ms | `cubic-bezier(.165,.84,.44,1)` | when `.in-view` added |
| `link--caret` (transition) | inline | 300ms | `cubic-bezier(.25,.46,.45,.94)` opacity + 400ms caret slide | on hover, `in-view`, focus |

Keyframes are heavily minified — the original source names are
shortened to single letters (`u`, `ub`, `uba`, `ud`, …). Plyr's
keyframes (`plyr-fade-in`, `plyr-popup`, `plyr-progress`) are
preserved verbatim. The "in-view" reveal system is **not** a
`@keyframes` at all — it is a CSS class toggle (`opacity:0` /
`translateY(50px)` → `opacity:1` / `translateY(0)` on `.in-view`)
that GSAP/JS triggers when an element enters the viewport.

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP TimelineMax | hero entrance | DOMContentLoaded | red `line-anim` rules scale in, then per-letter fx-letter stagger |
| GSAP TweenMax | `.appear-fade-up` reveal | IntersectionObserver (`.js-in-view`) | 800ms, 50px translate, cubic-bezier(.215,.61,.355,1) |
| GSAP TweenMax | `.home-cases-list` row hover | `mouseenter` on `li` | swaps active `.home-cases-scene--*` |
| GSAP TweenLite | volume pulse | `is-playing` state | scales the `pulsing-ui` element |
| Three.js render loop | dog scene | `requestAnimationFrame` | per-frame: 233 `update` calls, 104 `render` calls, 83 `camera` updates |
| Custom | showreel modal open | click on `.js-show-showreel` | backdrop fade + iframe fade in |
| Custom | site loader progress | `dog.js` onprogress | sets `.site-loader-percent` `stroke-dashoffset` |
| Custom | route change | `data-router-view` swap | page-level crossfade with `.appear-fade-up` |

### Page transitions

- Custom router crossfades the `<main data-router-view>` element.
- New route fades in with the same `.appear-fade-up` keyframe
  (translateY 50px → 0 + opacity 0 → 1, 800ms).
- Direct-link first paint skips the transition (server-rendered
  HTML is shown immediately).

### Reduced motion

The site **detects** mobile/tablet via Detectizr and sets a
`disable-motion` class on `<html>` — the 3D scene is replaced
with a static background image and the in-view reveals fire
immediately without transitions. There is **no**
`@media (prefers-reduced-motion: reduce)` rule observed in
`css/main__600d6084.css`; the device-class fallback is the
only motion gate.

---

## Assets

### 3D models

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/dogstudio/models/dog.drc__ac0e69db.glb` | glTF binary + Draco mesh compression | 860KB | `https://dogstudio.co/app/themes/portfolio-2018/static/assets/dog/dog.drc.glb` | The studio mascot — a stylised 3D dog. Renders in a `THREE.Scene` with one matcap material |

### Textures (DDS)

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/dogstudio/other/dog_diffuse__ace3125f.dds` | DDS | 256KB | (same path) | dog diffuse channel |
| `tools/tmp/dogstudio/other/dog_specular__5bd4afef.dds` | DDS | 256KB | (same path) | dog specular |
| `tools/tmp/dogstudio/other/branches_diffuse__9a392686.dds` | DDS | 256KB | (same path) | branches diffuse |
| `tools/tmp/dogstudio/other/branches_normals__059bf398.dds` | DDS | 256KB | (same path) | branches normals |

### Textures (JPG/PNG)

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/dogstudio/images/matcap-combined-resized__28957e75.jpg` | JPEG | 543KB | `…/assets/images/dog/matcap-combined-resized.jpg` | matcap material |
| `tools/tmp/dogstudio/images/dog_normals__48091c87.jpg` | JPEG | 450KB | `…/assets/images/dog/dog_normals.jpg` | normal map |
| `tools/tmp/dogstudio/images/cover__1a38af82.jpg` | JPEG | 39KB | `…/assets/images/shared/cover.jpg` | generic cover |
| `tools/tmp/dogstudio/images/share-facebook__8d325eb8.jpg` | JPEG | 72KB | `…/assets/images/shared/share-facebook.jpg` | OG image |
| `tools/tmp/dogstudio/images/flag-en__6c8d459c.jpg` | JPEG | 485B | `…/assets/images/flag-en.jpg` | EN flag |
| `tools/tmp/dogstudio/images/flag-mx__37380bf3.jpg` | JPEG | 415B | `…/assets/images/flag-mx.jpg` | ES flag |
| `tools/tmp/dogstudio/images/favicon__0824572e.png` | PNG | 2.9KB | `…/assets/images/favicon.png` | favicon |
| `tools/tmp/dogstudio/images/baseline__03af1242.png` | PNG | 7KB | `…/assets/images/menu/baseline.png` | "We Make Good Shit" raster |
| `tools/tmp/dogstudio/images/quote__f1eb58d0.png` | PNG | 850KB | (assumed `…/assets/images/quote.png`) | large quote asset |
| `tools/tmp/dogstudio/images/dog__341030fc.png` … `dog__aeeccdad.png` | PNG (5 files, 84–210KB each) | ~770KB total | `…/assets/images/loader/dog-*.png` | loader sprite frames (sprite sheet) |
| `tools/tmp/dogstudio/images/dog_normals__48091c87.jpg` | JPEG | 450KB | (same as above) | normal map (used twice in two paths) |
| `tools/tmp/dogstudio/images/background-1440__*.png` (5 files) | PNG (4.4MB total) | per case | `…/assets/images/cases/<case>/background-1440.png` | per-case hero art (Tomorrowland, Navy Pier, MSI Chicago, KIKK, etc.) |
| `tools/tmp/dogstudio/images/background-xl__*.png` (2 files) | PNG | 140 + 352KB | `…/assets/images/menu/background-xl.png` | site-menu backdrop art |
| `tools/tmp/dogstudio/images/noise__7999ae67.png` | PNG | 58KB | `…/assets/images/noise.png` | film-grain overlay |
| `tools/tmp/dogstudio/images/grid__85b36aa7.png` | PNG | 2.2KB | `…/assets/images/grid.png` | debug grid |
| `tools/tmp/dogstudio/images/shadow__08f84733.png` | PNG | 1.5KB | `…/assets/images/shadow.png` | soft-shadow |
| `tools/tmp/dogstudio/images/pattern__523be987.png` | PNG | 1.0KB | `…/assets/images/pattern.png` | pattern overlay |
| `tools/tmp/dogstudio/images/dots__a31e74a3.png` | PNG | 438B | `…/assets/images/dots.png` | dot pattern |
| `tools/tmp/dogstudio/images/caret-right__db941fbb.png` | PNG | 1.2KB | `…/assets/images/caret-right.png` | raster fallback for caret sprite |

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Heebo | 200 (Thin), 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold) | woff2 + woff | `tools/tmp/dogstudio/fonts/Heebo-*.woff2` | yes (10 files, 5 weights × 2 formats) |
| GT Sectra Display | 400 (Regular), 500 (Medium), 700 (Bold) | woff2 + woff | `tools/tmp/dogstudio/fonts/GTSectraDisplay-*.woff2` | yes (6 files, 3 weights × 2 formats) |
| Gilroy | 400 (Regular), 500 (Medium), 700 (Bold) | woff2 + woff | `tools/tmp/dogstudio/fonts/Gilroy-*.woff2` | yes (6 files, 3 weights × 2 formats) |
| Avenir (fallback) | system | system | OS | no (used in plyr only) |

### SVGs & icons

- **Inline SVGs observed in HTML:** 3 — the wordmark logo
  (`viewBox="0 0 401.23099 116.838"`, 14 path elements), the loader
  progress ring (2 `<circle>`s), the "we make good shit" wordmark
  baseline (`viewBox="0 0 30.67 54.43"`, 5 path elements)
- **Standalone SVG files in dump:** 1
  - `tools/tmp/dogstudio/svgs/spritesheet__a9a6a20b.svg` — 9KB
    sprite with 24 `<symbol>`s, referenced by
    `<use xlink:href="…/spritesheet.svg#id">` from dozens of call
    sites in the rendered HTML
- **Icon system:** custom sprite; not Lucide / Phosphor / Heroicons

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/dogstudio/media/ambience__c798ba44.mp3` | MP3, 322KB | ambient loop on home page, controlled by `.site-volume` button |
| (external) | Vimeo 836218697 | the showreel, embedded via Plyr + player.vimeo.com/api/player.js |

### Other binaries

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/dogstudio/other/draco_decoder__41f20394.wasm` | WebAssembly, 230KB | Draco mesh decoder, used by the GLTF loader for `dog.drc.glb` |
| `tools/tmp/dogstudio/js/detectizr__c3164ea4.js` | JS, 8KB | device detection |
| `tools/tmp/dogstudio/js/modernizr__58cbc6e6.js` | JS, 6.5KB | feature detection |
| `tools/tmp/dogstudio/js/wp-embed.min__3d6aac68.js` | JS, 1.4KB | WordPress oEmbed |
| `tools/tmp/dogstudio/css/form-basic.min__ca94ae20.css` | CSS, 2.7KB | Mailchimp form styles |

### Inline data observed

- **JSON-LD:** `WebSite` schema with `potentialAction: SearchAction`
  pointing at `https://dogstudio.co/?s={search_term_string}`
- **Open Graph:** `og:type=website`, `og:locale=en_US` with
  `es_MX` alternate; `twitter:card=summary_large_image`; share
  images at `…/images/shared/share-facebook.jpg` and
  `…/images/shared/share-twitter.jpg`
- **hreflang:** `en` at `/`, `es` at `/mx/`

---

## Motion & Interaction

### Principles

- Cinematic, slow, single-axis. Most reveals are 800ms with
  `cubic-bezier(.215, .61, .355, 1)` (a slow-out curve).
- The 3D dog is the only constant motion on the home page; everything
  else is staggered entrance + scroll-driven reveal.
- Red is the only "alive" color. White type stays still; red rules,
  red carets, and red underlines carry all the motion energy.

### Specific behaviors

- **Link hover (text links):** color stays white, optional red
  underline `.link-line` scales X from 0 → 1 in 600ms
  `cubic-bezier(.165, .84, .44, 1)`
- **Caret link hover:** `.link--caret` red caret `::before` slides
  right 8px, `::after` underline scales 0 → 1; opacity 0 → 1 also
  fires (used to delay appearance until the case row is hovered)
- **Section reveal on scroll:** JS adds `.in-view` to
  `.js-in-view` elements; CSS transitions opacity + translateY
  50px in 800ms with a 0.1s delay
- **Hero entrance:** GSAP TimelineMax runs a master sequence —
  red rule scaleX 0 → 1, then per-letter fx-letter stagger
  (~30ms per letter), then showreel link fade in, then lead
  paragraph fade, then social list fade
- **Page transition:** custom router swap; the new
  `<main data-router-view>` fades in from `translateY(50px) +
  opacity:0` to `translateY(0) + opacity:1` over 800ms
- **Loader:** SVG progress ring fills from 0% to 100% as
  `dog.js` reports progress, then `.is-hidden` is applied
- **3D scene:** continuous — dog mesh rotates gently on Y,
  camera dollies on cursor move, matcap material responds to
  an internal point light position

### Reduced motion

- `Detectizr.device.type === 'mobile' || 'tablet'` adds
  `disable-dog` and `disable-motion` classes to `<html>`, which:
  1. skips loading `dog.js` entirely (the 3D scene)
  2. forces all `.js-in-view` elements to immediately have
     `.in-view`, so no scroll-stagger animations play
- No `prefers-reduced-motion: reduce` media query is used; the
  device-class check is the only motion gate

---

## Content & Voice

- **Tone:** confident, brief, slightly cheeky. The hero carries a
  short statement in oversized serif ("We Make Good Shit" / an
  English phrase set in 120px GT Sectra Display). The supporting
  paragraph is measured, professional, and uses em-dashes for
  parentheticals.
- **Sentence length:** short to medium. Active voice throughout.
- **Capitalization:** sentence case for body and CTA labels
  ("Discover our values", "Watch our Showreel", "All our news",
  "All our cases"). The 3-letter city footer marks ("Chicago .",
  "Amsterdam .", "Paris .") use title case with a colored
  trailing period.
- **Punctuation:** em-dash style is "—"; Oxford comma is not
  heavily used; the period-as-mark (`.`) after city names is a
  consistent brand device.
- **CTA vocabulary:** "Discover", "Watch our Showreel", "All our
  news", "All our cases", "Accept", "Deny", "Discover our values".
  The repeated "All our …" framing is a signature.

---

## Information Architecture

Top-level routes observed (WordPress site, English `/` and Spanish
`/mx/`):

- `/` — home page (single full-bleed page, observed)
- `/news/` — news index (linked from header "All our news")
- `/cases/` — case studies index (linked from header "All our cases")
- `/cases/<slug>/` — individual case pages (Tomorrowland, Navy Pier,
  MSI Chicago, VOO / "This Was Louise's Phone", KIKK Festival 2018,
  The Kennedy Center, Royal Opera of Wallonia, etc.)
- `/studio/` — about / the studio
- `/values/` — values page
- `/careers/` — careers
- `/contact/` — contact page
- `/newsletter/` — newsletter subscribe (Mailchimp)
- `/mx/` — Spanish language root (Polylang)
- (external) `https://vimeo.com/836218697` — showreel (opens in
  Plyr modal in-page or new tab)

Header overlay menu: Studio · Cases · Careers · Values · Contact.

---

## Accessibility

- **Color contrast:** white (`#FFFFFF`) on `#0E101A` is ~17:1 — well
  above WCAG AAA. The lavender `rgba(160,168,220,0.7)` on
  `#0E101A` is ~7.5:1 — passes AAA for body text. The muted
  `rgba(187,194,229,0.3)` case-list rows are ~3.5:1 — only passes
  for non-essential decorative text.
- **Focus indicators:** `:focus` adds `box-shadow:0 0 0 5px
  rgba(26,175,255,0.5)` on plyr controls; `.link--under` adds a
  red `scaleX(1)` underline; `.button--orange` shifts to
  `#C22B2B`. No outline removal observed.
- **Keyboard:** all interactive elements are native
  `<a>`/`<button>` — keyboard reachable in document order. The
  Plyr player is full keyboard-navigable.
- **Screen reader landmarks:** `<main role="main">`, hidden
  `<h1>Dogstudio</h1>`, hidden `<h2>` per case scene, hidden
  `<h3>Tomorrowland</h3>` etc., `u-visually-hidden` spans on every
  icon-only link (Facebook, Instagram, etc.).
- **Motion:** device-class fallback only (no
  `prefers-reduced-motion` rule).
- **Alt text:** all `<img>` decorative elements have `alt=""`; the
  OG image and share-facebook image have descriptive meta
  attributes.
- **`<html lang="en-US">`** set, with `hreflang="en"` and
  `hreflang="es"` alternates; Polylang sets the `pll_language`
  cookie.

---

## Sources

Every URL opened while writing this.

- Homepage — https://dogstudio.co/
- Homepage (rendered DOM) — `tools/tmp/dogstudio/playwright/homepage.html`
- WordPress theme static — https://dogstudio.co/app/themes/portfolio-2018/static/
- Stylesheet — `tools/tmp/dogstudio/css/main__600d6084.css` (mirror of `…/static/css/main.css?v=07022024`)
- Mailchimp form CSS — `tools/tmp/dogstudio/css/form-basic.min__ca94ae20.css` (mirror of `…/wp-content/plugins/mailchimp-for-wp/assets/css/form-basic.min.css?ver=4.5.0`)
- Main JS — `tools/tmp/dogstudio/js/main__b5659246.js` (mirror of `…/static/js/main.js?v=23082019-2`)
- 3D dog scene JS — `tools/tmp/dogstudio/js/dog__4b194ca3.js` (mirror of `…/static/js/dog.js?v=23082019-2`)
- Draco WASM wrapper — `tools/tmp/dogstudio/js/draco_wasm_wrapper__99d1e3c8.js` (mirror of `…/static/assets/dog/draco/draco_wasm_wrapper.js`)
- 3D model — `tools/tmp/dogstudio/models/dog.drc__ac0e69db.glb`
- Sprite sheet — `tools/tmp/dogstudio/svgs/spritesheet__a9a6a20b.svg`
- Showreel (Vimeo) — https://vimeo.com/836218697
- Detectizr — `tools/tmp/dogstudio/js/detectizr__c3164ea4.js`
- Modernizr — `tools/tmp/dogstudio/js/modernizr__58cbc6e6.js`

---

## Changelog

- 2026-06-19 — Initial draft by design.md_gen.
