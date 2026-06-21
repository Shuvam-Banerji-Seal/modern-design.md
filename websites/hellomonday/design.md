# Hello Monday — design.md

> A structured design specification of **https://www.hellomonday.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode agent
> **Source dump:** `tools/tmp/hellomonday/` (gitignored)

---

## Overview

Hello Monday is a creative studio that "handcrafts digital (and magical)
products, brands, and experiences." The homepage is a single full-bleed
landing experience anchored by a serif hero "Branding" headline, a looping
silent MP4 background, an oversized custom wordmark, and a "Deep Dive" pitch
for their product-consulting arm — followed by a four-office footer. The
look is editorial: white-cream canvas, two carefully paired type families,
a thick serif display (ClarendonBT) set against a humanist sans (NB
International Pro), and a paper-canvas page transition that paints over
the screen between routes. The design is built on a custom ES5-era
backbone-style application, not a modern framework, and leans on
**GSAP/TweenLite + ScrollToPlugin**, a **Paper.js** canvas
(`PageWipe`, `BackgroundRenderer`), and a custom **TexturePacker sprite**
renderer that drives the hero countdown and scroll-dot indicator.

**Category:** Marketing / Agency portfolio
**Primary surface observed:** Homepage (`/`) only; sub-routes referenced
in nav (`/work`, `/services`, `/about`, `/stories`, `/product`) but not
captured in this dump.
**Tone:** Confident, editorial, low-key playful (emoji, casual headline
"We make digital (and magical)…"). Serif display, soft palette.
**Framework detected (if any):** Custom webpack/ES5 bundle (no React,
Vue, or Svelte). Vanilla DOM + a Backbone-style router, custom
`HomeTemplate` modules. SPA with Paper.js-driven page transitions.

---

## Visual Language

### Color

The site uses a very tight, mostly-neutral palette. Saturated color only
appears in a few module-specific accents (e.g. case-grid columns
`#AFEEEE` pale-turquoise and `#DB7093` pale-violet-red) and as inline
styling on case modules.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (page base) | `--bg-base` | `#FFFFFF` | `#FFFFFF` (white) — homepage + CaseGridModule |
| Background (cream/footer) | `--bg-cream` | `#F8F6F5` | `#F8F6F5` — `.Footer`, page-intro band, services, case grid base |
| Background (subtle) | `--bg-subtle` | `#F4F4F4` | `#F4F4F4` — dark-mode text on `CaseAwardsComponent.Dark` |
| Background (near-black) | `--bg-ink` | `#191919` | `#191919` — `DeepDiveSplashModule .innerContainer` |
| Background (very dark) | `--bg-ink2` | `#2A2A2A` | `#2A2A2A` — `CaseContentModule.Dark` |
| Background (true black) | `--bg-ink3` | `#000000` | `#000000` — overlay dim, intro, sprite-key |
| Background (light grey) | `--bg-grey` | `#F0F0F0` | `#F0F0F0` — case image placeholders |
| Background (mid grey) | `--bg-mid` | `#C6C5C5` | `#C6C5C5` — `.section` borders |
| Text (primary) | `--text-primary` | `#000000` | `#000000` (black) |
| Text (secondary) | `--text-secondary` | `#2C2D2E` | `#2C2D2E` — `.city` in footer |
| Text (inverse) | `--text-inverse` | `#FFFFFF` | `#FFFFFF` (white) on dark sections |
| Text (muted) | `--text-muted` | `#C6C5C5` | `#C6C5C5` — email link / copyright |
| Accent (case A) | `--accent-aqua` | `#AFEEEE` | `#AFEEEE` (pale-turquoise) — case-grid column |
| Accent (case B) | `--accent-pink` | `#DB7093` | `#DB7093` (pale-violet-red) — case-grid column |
| Accent (case C) | `--accent-coral` | `#F39096` | `#F39096` (light-coral) — case-grid column |
| Border | `--border` | `#CACACA` | `#CACACA` — `.Footer .right .section` |
| Body shadow | — | `0 32px 64px 0 rgba(0,0,0,.4)` | `0 32px 64px 0 rgba(0,0,0,0.4)` |
| Overlay dim | — | `rgba(0,0,0,0.4)` | `.overlayContainer .dim` |
| Modal scrim | — | `rgba(0,0,0,0.5)` | Video.js modal backgrounds |

**Other observed hex values** (one-off use): `#FFFFFF` (white, 85 hits —
most-used non-black), `#B9B9B9` (mid), `#979797` (mid),
`#DCDCDC` (gainsboro), `#E9E9E9` (gainsboro tint), `#868686`,
`#D8D8D8`, `#D6D6D6`, `#C3C3C3`, `#FC6` (rare accent),
`#66A8CC` (rare blue), `#2B333F` (rare dark blue used in
`rgba(43,51,63,.75)`), `#202020`, `#868685`, `#999`, `#F9F9F9`.

**Dark mode:** Not a true dark-mode design — the homepage is always
light/cream. "Dark" sections (`CaseContentModule.Dark`,
`DeepDiveSplashModule`, `.CaseAwardsComponent.Dark`) are explicit
section-level inversions with white text on `#2A2A2A`/`#191919`.

### Typography

Two custom-licensed type families drive the entire look. No system
fallback for the serif (except Georgia in the desktop nav stack);
sentinel is a humanist sans for body. Both are self-hosted with
`.eot`, `.woff2`, `.woff`, and `.ttf` face files.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (hero H1, splash) | `ClarendonBTWXX-Light, Georgia, "Times New Roman", Times, serif` | 300 | `80px` (hero) / `90px` (splash H3) | `0.8` (64/80) / `0.93` (84/90) | `normal` |
| H1 (default) | `ClarendonBTWXX-Light, Georgia, "Times New Roman", Times, serif` | 300 | `20px` | `1.3` | `normal` |
| H2 | `ClarendonBTWXX-Light` | 300 | `45px` (default) / `80px` (hero) | `0.8` | `normal` |
| H3 (default) | `ClarendonBTWXX-Light` | 300 | `28px` (case hero), `30px` (about awards), `40px` (case headline) | `1.13` | `normal` |
| H3 (splash) | `ClarendonBTWXX-Light` | 400 | `90px` | `0.93` (84/90) | `normal` |
| H4 | `ClarendonBTWXX-Light` | 300 | `30px` | `1.13` | `normal` |
| Body L (intro, splash body) | `nb_internationalprolight, Georgia, "Times New Roman", Times, serif` | 400 | `19px` | `1.39` (26.41/19) | `normal` |
| Body (default) | `nb_internationalproregular, Georgia, "Times New Roman", Times, serif` | 400 | `14px` (caption) → `22px` (body) | `1.39`–`1.57` | `normal` |
| Body S / caption | `nb_internationalproregular` | 400 | `12px`–`14px` | `1.29`–`1.57` | `normal` |
| Label / button (menu) | `nb_internationalproregular` | 400 | `14px` | `1.29` | `normal` |
| City (footer) | `ClarendonBTWXX-Light` | 300 | `18px` | `1.39` (25.02/18) | `normal` |
| Email link (footer) | `ClarendonBTWXX-Light` | 400 | `18px` | `1.39` (25.02/18) | `normal` |
| Privacy / label | `nb_internationalproregular` | 400 | `12px`–`14px` | `1.29` (18.06/14) | `normal` |
| Case-card tags | `nb_internationalprolight` | 400 | `13px` | `1.54` (20.02/13) | `normal` |
| Services body | `nb_internationalprolight` | 400 | `19px`–`23px` | `1.39` | `normal` |
| Services title | `ClarendonBTWXX-Light` | 400 | `150px` (full-bleed) | `1.0` (1.04) | `normal` |
| Mono / code | — | — | — | — | — (none observed) |

**Custom tracked variants observed in CSS:** `letter-spacing: 0.3px`,
`letter-spacing: 0.7px`, `letter-spacing: 0.9px` (used in the
`ClarendonBTWXX-Light` `.label` class in the menu/dropdown).

**Fallback stack for menu:** `nb_internationalproregular, Georgia, "Times
New Roman", Times, serif` — the trailing serif fallback is a strong hint
that the brand treats the sans as "the serif" of the system.

### Spacing & radius

- **Base unit:** ~8px; observed values use both 4/8/16/24/32/48/64/77/80
  px raw and `clamp`-less `vw/%` percentages (e.g. `4.88281%` gutter,
  `35.3293413248%` width column).
- **Gutter (page container):** `padding: 0 70.3125px` at desktop,
  `0 4.88281%` for the open-menu state.
- **Section spacing:** `margin-bottom: 80px` (hero), `padding-bottom:
  71px` (case grid), `padding-top: 71px` (footer top), `padding: 49px
  63.4375px 63px` (DeepDive splash inner).
- **Radius scale (observed):** `0` everywhere by default; `2px` (Video.js
  controls), `25px` (round-ish pill), `50%` (`.circle` countdown
  element, scroll indicator dot), `inherit` (rare).
- **Shadows:** Single production shadow
  `box-shadow: 0 32px 64px 0 rgba(0,0,0,0.4)` on
  `.CaseContentModule .grid .Desktop .imageContainer`. No elevation
  system beyond that.
- **Border-style:** Mostly `1px solid #cacaca` on footer `.section`
  dividers, otherwise borderless.

### Iconography

- **Style:** Inline SVG only. No icon library. Icons are hand-drawn
  paths with a single fill (no outline + filled duotone pattern).
- **Logo mark:** A custom multi-glyph wordmark in three stacked rows
  (`HELLO MONDAY / DEPT®`) baked as a 17-path `<svg viewBox="0 0 1076
  610">` with `width="68px" height="39px"`. Used both in the corner
  `.logo` element and the open menu `.staticLogo`.
- **Burger / close:** Two small SVGs (`17×10` three-bar burger,
  `34×34` X with two paths `.line1` + `.line2` filled `#1D1F23`).
- **Scroll dot:** A `8×8` PNG sprite frame scrolled through a custom
  sprite mask. SVG could not be used because it must animate frame-by-frame.
- **Play/pause:** A 19×15 SVG with three horizontal bars (one shorter)
  used in `.play-pause` module — also driven by the sprite system.
- **Hamburger icon:** `<rect>` bars at `y=0,4,8` (top two are 17px wide,
  bottom is 12px wide) — an asymmetric "scribble" burger rather than
  three equal lines.
- **Default size:** SVGs set explicit `width`/`height` attributes;
  no implicit icon-sizing convention.

---

## Layout & Grid

- **Max content width:** Open-ended, percentage-based grid.
  Inner containers compute width from the viewport (no fixed max).
- **Page gutter:** `70.3125px` on standard module containers;
  `4.88281%` of viewport on the open-menu state.
- **Grid:** **Six-column** (`.col-1` × 6) for the debug overlay, but
  the main layout uses a **3-column** repeating `.col-2` pattern
  (each `col-2` = 2/6 = 33.3% of inner width, with `5.988%` gap and
  `35.3293413248%`-wide inner-column for "intro" content).
  Case-grid uses 3 `.col-2` columns at `29.3413173724%` width each.
- **Breakpoints observed:**
  `min-width: 412` (mobile-large), `640` (phablet), `768` (tablet),
  `769` (tablet+1, used by `.CaseGridModule`), `900` (small desktop),
  `1024` (desktop), `1025` (desktop+1), `1440` (large desktop),
  `1850` (xl), `2550` (xxl). Also `min-height: 770` and
  `min-height: 770 / max-height: 770` interactions for short viewports.
- **Vertical rhythm:** Inconsistent; sections are spaced with raw pixel
  margins (`margin-bottom: 50px`, `80px`, `padding-bottom: 71px`) —
  no global 8px baseline enforced.

**Homepage layout** (top to bottom):

1. **Persistent overlay layer** (`.container.sizeBlock` with three empty
   `.col-2` columns) is fixed to provide the visual grid lines that
   show through content.
2. **Top-left logo** (`.logo` → `a.button > svg`) sits absolutely at
   `(0, 0)`; opacity is `0` until the intro animation completes.
3. **Hidden nav** `<nav class="MainMenu">` is a placeholder for a
   particle/blob canvas (the `.MainMenu` element is non-visual until
   Paper.js paints it).
4. **Open-menu nav** `<nav class="container items">` with a left-side
   logo and a right-side list of 5 links (Work / Services / About /
   Stories / Product), each with a small blob-dot (`dotContainer`) and
   a `<p class="label">`; plus 3 social links (Facebook, Instagram,
   Twitter). Hidden by default (`display: none` until toggled).
5. **Page-wipe canvas** (`canvas.PageWipe`, `width="1440" height="900"`)
   sits on top of everything during route transitions.
6. **Main template** (`#TemplateLayer`) houses the `HomeTemplate` with
   three modules: `HeroModule` (countdown + video + headline),
   `CaseGridModule` (3 case columns), `DeepDiveSplashModule` (single
   pitch block with embedded video).
7. **Mobile burger** (`.mobileBurger`) with a burger SVG and a
   close-X SVG.
8. **Footer** (`.Footer`) is a 5-section block (collaborate / hi /
   join / learn / view-on-maps) on `#F8F6F5` cream.
9. **Background canvas** (`#BackgroundRenderer` containing a single
   `<canvas>`) draws the page-paint effect behind everything.
10. **Intro overlay** (`.Intro`) appears once, with title + body,
    opacity 0 by default.
11. **Debug grid** (`.DebugGrid`) is a 6×`.col-1` overlay visible only
    in dev/QA.

---

## Components

The site is module-driven. Every section is a `section.module` with
`data-module="<Name>"`. Modules discovered in the dump and the wider
CSS include: `HeroModule`, `CaseGridModule`, `DeepDiveSplashModule`,
`PageIntroModule`, `CaseHeroModule`, `CaseContentModule` (Light/Dark
variants), `CaseAwardsComponent` (Light/Dark), `ServicesModule`,
`HighlightedStoriesModule`, `FeaturedCollaborationsModule`,
`CollaborateModule`, `ContactModule`, `QuoteModule`, `AboutContentModule`,
`BehindTheScenesOverlay`, `BehindTheScenesModule`, `InnovationIntroModule`,
`CodeOfHonorModule`, `CodeOfHonorEntry`, `AwardsModule`, `PageSectionModule`,
`InDepthSectionComponent`, `PageWipe`, `InteractiveGridModule`,
`Intro`. Each `<section>` carries `data-color="#ffffff"` (or similar)
that the JS reads to color the page-wipe canvas.

### Button (inline `a.button` + `.cta`)

- **Variants:** Two only — primary text link (`.cta a` in
  DeepDiveSplashModule, used for "Discover more") and a transparent SVG
  button (`.logo a.button` containing the wordmark).
- **Sizes:** Text links are `15–19px` (see Body L). No fixed button
  height — they're inline.
- **Anatomy:** Plain text label. A small underline-style decoration is
  hinted at in `.DeepDiveSplashModule .cta a:after { display: block }`
  (likely an animated underline expanding from left to right).
- **States:** No hover style observed directly in the minified CSS
  beyond the `transition: transform .2s` (lift); hover behavior is
  handled in JS.
- **Radius:** N/A — text-only.
- **Color:** White `#FFFFFF` on the dark splash, black `#000000`
  elsewhere.

### Logo (`.logo` and `.staticLogo`)

- **Anatomy:** Inline SVG, 17 `<path>`s, `viewBox="0 0 1076 610"`,
  rendered at `68×39px` (aspect ratio 17.65:1).
- **Behavior:** Opacity is `0` on initial load and fades in via the
  intro animation. Identical SVG appears in `.staticLogo` inside the
  open menu (left column) and on the `.button` in the corner.
- **State:** No hover state; it links to `/`.

### Hero Module (`.HeroModule`)

- **Purpose:** Above-the-fold splash. Combines a `countdown` (`"X
  days until Monday"`), a silent looping `video` background, a
  `headlineText` containing both an H3 lead (`"We make digital (and
  magical)…"`) and an H1 (`"Branding"`) that animates word-by-word.
- **Anatomy:** `.container > .innerContainer` (no fixed width);
  countdown row at top, full-bleed `<video>` in
  `.animationContainer`, headline pinned bottom-left,
  `.scrollIndicator` at the right edge with a falling dot.
- **Hero H1:** `80px` ClarendonBT, `line-height: 0.8` (64px), black on
  white. Words animate via Paper.js / sprite mask: the H1 starts at
  `opacity: 1; transform: matrix(1,0,0,1,0,0)` once the page is in.
- **Scroll indicator:** A single sprite-mask dot that travels from
  `transform: matrix(0.5,0,0,0.5,8,44)` (8px right, 44px down,
  half-scale) to its rest position; it animates repeatedly as the
  user scrolls.

### Case Grid Module (`.CaseGridModule`)

- **Purpose:** Three featured cases, each in its own column.
- **Anatomy:** `.container > .innerContainer > .grid-managed` (three
  `.col-2` columns at 29.34% each) + a `.spacer` + a `.all` row with a
  "View all projects" link.
- **Column treatment:** Each column is a tile with its own
  `background-color` (e.g. `#AFEEEE`, `#DB7093`, `#F39096`) — the
  case cover image is layered on top.
- **Padding:** `padding-bottom: 71px`.
- **State:** Section has `data-color="#ffffff"` — read by PageWipe
  to set the outgoing route's color.

### Deep Dive Splash Module (`.DeepDiveSplashModule`)

- **Purpose:** Self-contained pitch for the "product booster rocket"
  arm.
- **Anatomy:** `.container > .innerContainer` with `padding: 49px
  63.4375px 63px`, `background: #191919`. H3 title (`90px`
  ClarendonBT, `line-height: 0.93`, color `#FFFFFF`), a spacer, a
  16:9 video (`padding-top: 56.25%` placeholder), a 19px body line
  in `nb_internationalprolight`, and a small CTA.
- **CTA:** `15px` text "Discover more" with a `display: block` `::after`
  pseudo (under-line animation).

### Footer (`.Footer`)

- **Background:** `#F8F6F5` (cream).
- **Anatomy:** `.container > .grid.content` (flex) with a left `.col-2`
  (currently a base64 lazy-load GIF spacer) and a right `.col-4`
  containing 5 stacked `.section` blocks.
- **Section blocks (top to bottom):**
  1. `Want to collaborate?` — `newbusiness@hellomonday.com`
  2. `Want to say hi?` — `hello@hellomonday.com`
  3. `Want to join us?` — "Apply here" (external link, likely
     to DEPT® careers)
  4. `Want to learn?` — intern apply link
  5. `View on maps` — `.offices` flex rows containing four
     `.office` anchors with `<p class="city">` (NY / Copenhagen /
     Aarhus / Amsterdam) and `<p class="address">` (street, postal,
     phone).
- **Bottom bar:** `.innerContainer.bottom` with a 0-px-tall SVG path
  `class="bulge" fill="#000"` and a "Back to top" label that animates
  from `transform: matrix(1,0,0,1,0,32)` (32px down) up to
  rest position.
- **Privacy link:** `<a class="privacy-link">` linking to
  `https://www.deptagency.com/en-nl/privacy-policy/` — duplicated for
  desktop and mobile breakpoints.

### Top-Nav (open menu) (`.container.items`)

- **Height:** 100vh on desktop (`height: calc(100vh - 41px)` at
  768×770).
- **Anatomy:** Flex container with `.left` (logo) and `.right` (links
  + social). Each link `<a>` contains a `.dotContainer` (an absolute
  sprite mask with `.label` `<p>`) and the visible label.
- **Labels:** "Work", "Services", "About", "Stories", "Product" —
  all 14px `nb_internationalproregular`.
- **Social:** 3 inline text links — "Facebook", "Instagram", "Twitter"
  (no icons) opening new tabs.
- **Hide on load:** `display: none` until menu is triggered; opens
  with a Paper.js blob animation that morphs a path from the corner
  of the burger button.

### Main-Menu canvas (`.MainMenu`)

- An empty `<nav>` element that Paper.js writes into at runtime to
  produce the morphing blob/curtain effect when opening the menu.

### Countdown chip (`.countdown > .circle` + `.display`)

- **Anatomy:** A small inline-flex row with a leading 22×22 SVG (a
  hand-drawn "envelope+note" mark) and a 13px text "X days until
  Monday".
- **State:** Static. Day-count text is computed by JS each render.

### PageWipe canvas (`canvas.PageWipe`)

- A full-viewport `<canvas>` (default 1440×900) that lives on top of
  the document at z-index above content but below the open menu.
  Used to mask/hide the page during route transitions. Painted by
  Paper.js (see class `paper-view-0`).

### BackgroundRenderer canvas (`#BackgroundRenderer`)

- A second full-viewport `<canvas>` used to paint ambient
  background effects (sprites, smoke, noise) behind the visible
  content.

### DebugGrid (`.DebugGrid`)

- Six equal `.col-1` columns visible only in dev mode; shows the
  6-column underlying grid.

### Intro overlay (`.Intro`)

- A one-time intro panel with `.title` + `.body`; the body copy
  reads: "We creates joyful digital ideas, products, brand
  identities and experiences that connect the hearts of brands to
  the hearts of their audiences." (preserved verbatim because it is
  a permanent value, not marketing copy). Opacity is `0` by default.

### (No form, modal, or input components observed on this surface.)

---

## JavaScript & Libraries

The bundle (`/build/js/main-e03077acdb.js`, **1,743,079 bytes**,
minified ES5 webpack output) carries the entire site logic. There
is no framework preamble (no `React.createElement`, no
`Vue.createApp`, no `_svelte` runtime) — the code is built on a
custom module/router system that registers `HomeTemplate` and
several `data-module` controllers. Notable detections:

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| GSAP (TweenLite) | 1.20.x family | `TweenLite.selector` in `js/main-e03077acdb__16097497.js` | Used for in-page tween animations |
| GSAP ScrollToPlugin | 1.x | `ScrollToPlugin` symbol in bundle | Used by menu + page navigation |
| Paper.js | 0.12.x family | `PaperScope` constructor in bundle + `canvas class="paper-view-0"` | Drives `PageWipe`, `BackgroundRenderer`, `MainMenu` blob, intro morph, scroll-dot sprite |
| Plausible analytics | latest | `https://plausible.io/js/script.js` in HTML, `defer` `data-domain="hellomonday.com"` | Privacy-friendly page-view tracking |
| Cloudflare Insights (beacon) | `v833ccba57c9e4d2798f2e76cebdd09a11778172276447` (hashed) | `<script defer src="https://static.cloudflareinsights.com/beacon.min.js/...">` in HTML | Performance beacon |
| Video.js | 7.x family | `vjs-*` class names in JS + CSS, `font-family: VideoJS`, `@font-face VideoJS` block in CSS | Used as the player for the hero video and DeepDive video; CSS includes the full Video.js default skin |
| TexturePacker sprite runtime | not visible as a public name | `SpriteSheet` constructor in bundle + TexturePacker JSON metadata (`frames[].frame/spriteSourceSize/sourceSize`) | Drives `.dot2`, `.menu_blob_init`, `.menu_blob_init_black`, `.scroll-dot`, `.play-pause`, `.behind_eye`, `.face_all` sprite animations |
| `IntersectionObserver` | native | `new IntersectionObserver(` (×12) | Used for scroll-triggered reveal |
| `MutationObserver` | native | `new MutationObserver(` (×2) | Used for canvas resize / DOM mutations |
| `Worker` | native | `new Worker(` (×2) | Background workers (likely sprite / canvas) |
| `OffscreenCanvas` | native | `new OffscreenCanvas(` (×1) | High-perf canvas offload |
| `Proxy` | ES2015 | `new Proxy(` (×2) | State store |
| Acorn | 0.6.1 / 0.8.11 | `acorn` parse calls in bundle | JS template parsing at runtime |
| Custom sprite player | in-house | "SpriteSheet" ctor, hard-coded list of sprite names | Plays `face_all` (7 animation sequences: `AdultToBaby`, `BabyToTeen`, `DownUp`, `LtoR`, `RtoL`, `TeenToAdult`, `UpDown`) and the menu/blob init |

**Not detected:** React, Vue, Svelte, Angular, jQuery, AOS (no
`data-aos` attributes), Barba.js (no `barba` references in JS),
Turbolinks, Swup, Framer Motion, Lottie, Three.js, D3.

**Page transition mechanism:** The `<canvas class="PageWipe">` element
plus the `data-color` attribute on each `.module` is the cue for the
Paper.js wipe animation. When a route changes, JS reads the outgoing
section's `data-color` and animates a paper path that fills the
screen with that color before swapping `TemplateLayer` content.

**Hero animation timeline (inferred from inline HTML state + CSS):**
1. `body { overflow: hidden }` is set; `#SiteWrapper { opacity: 1 }`.
2. `.logo { opacity: 0 }` initially; fades in once the intro
   paper-morph completes.
3. `.dotContainer`s in the menu links start at
   `transform: matrix(0.5,0,0,0.5,0,0); opacity: 0` and are
   spring-animated in.
4. `.HeroModule .headline h1` starts at
   `opacity: 0; transform: matrix(1,0,0,1,0,0)` then animates to
   `opacity: 1` with a TweenLite.
5. The hero `countdown` displays a literal day count (here
   "2 days until Monday") in 13px `nb_internationalproregular`.
6. A `<video>` `loop muted autoplay playsinline` element renders the
   hero background.

---

## Animations (Catalog)

### CSS @keyframes

Only **three** `@keyframes` exist in the bundle — all of them are
imported from the Video.js default skin:

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `vjs-spinner-fade` | `css/bundle-2bdea8b598__d5b30ef8.css` (single minified line) | `1s` | `linear` | loading spinner fade |
| `vjs-spinner-show` | `css/bundle-2bdea8b598__d5b30ef8.css` | `0.8s` | `ease-out` | loading spinner show |
| `vjs-spinner-spin` | `css/bundle-2bdea8b598__d5b30ef8.css` | `1.1s` | `linear` `infinite` | loading spinner rotation |

All other motion is JS-driven (TweenLite / Paper.js / sprite player).

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| TweenLite | `headline` intro — `headline h1` `opacity 0→1` + `transform matrix(0,0,0,0)→identity` | on `TemplateLayer` ready | Hero text reveal |
| TweenLite | `logo fade-in` — `.logo { opacity: 0→1 }` | on intro paper-morph complete | Wordmark reveals |
| TweenLite | `countdown` per-letter cycle — sprite frames from `face_all.json` (`AdultToBaby`, `BabyToTeen`, …) | on initial render | The "X days until Monday" badge has an animated face sprite behind the day count |
| TweenLite | `dotContainer` scale + opacity — `matrix(0.5,0,0,0.5)→identity`, `opacity 0→1` | on menu open | Menu link dots spring in |
| TweenLite | `back-to-top` slide — `transform matrix(1,0,0,1,0,32)→identity` | on scroll | Footer label slides up |
| TweenLite | `menu_blob_init` morph — `menu_blob_init.png` sprite frames (≈30 frames, `27×66` source size) | on menu open | The blob that morphs from the burger button into the menu container |
| TweenLite + ScrollToPlugin | route navigation — scrolls target `#TemplateLayer` into view | on link click | The Open-menu / footer links trigger a tweened scroll-to |
| Paper.js | `PageWipe` — paints a paper path with the outgoing section's `data-color` | on route change | Curtain effect between routes |
| Paper.js | `BackgroundRenderer` — full-viewport ambient paint | continuous, on `requestAnimationFrame` | Underlying smoke/gradient effect |
| Paper.js | `MainMenu` morph | on menu open / close | Bezier curve that fills the viewport with a black/white blob |
| Sprite player | `scroll-dot` — 8×8 sprite, source `80×80`, falls along the right edge of the hero | on hero scroll | Repeating bounce animation |
| Sprite player | `play-pause` — 19×15 sprite, 3-bar icon | on video play / pause | Three frames, swap on toggle |
| Sprite player | `behind_eye` — animated eye sprite | on hover over a case card | Eyeball look-around |
| Sprite player | `face_all` — 7 named sequences × 30 frames each | on hero countdown render | Face morphs between ages (Adult→Baby, Baby→Teen, etc.) |
| CSS transition | `transition: opacity .2s / .3s / .5s / 1s` on `.imageContainer img.lazyloaded` | on `lazyload` event | Reveal images on intersection |
| CSS transition | `transition: opacity .5s` on `body:not(.touch) .FeaturedCollaborationsModule .desktop .entry:hover` | on hover (desktop only) | Featured project entries brighten on hover |
| CSS transition | `transition: all .2s` on `.vjs-big-play-button` | on hover | Video.js play button scale-up |
| CSS transition | `transition: all .3s cubic-bezier(.25,.46,.45,.94)` on Video.js controls | on hover | Video.js menu open |

### Page transitions

- **Outgoing route:** `<canvas class="PageWipe">` paints a paper
  path filled with the previous section's `data-color` (or the
  default white). The path grows from the menu blob's last position
  over ~600–800ms.
- **Incoming route:** Once the wipe is opaque, `#TemplateLayer` is
  swapped (innerHTML / template-rendered), and a reverse wipe
  reveals the new content.
- **First paint:** No transition on initial load — the page paints
  in directly behind the splash countdown.
- **No client-side router URL bar update visible** in the HTML
  (no `pushState` / `replaceState` calls in the bundle were
  surfaced by the static analysis).

### Reduced motion

- No `@media (prefers-reduced-motion: reduce)` block was found in
  the minified CSS. The site does not appear to honor a
  reduced-motion preference.

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump. The only canvas content is
2D (Paper.js paths and TexturePacker sprite frames).

### Fonts

Three custom families, all self-hosted from
`https://www.hellomonday.com/assets/fonts/`. Files cached in
`tools/tmp/hellomonday/fonts/`.

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| `ClarendonBTWXX-Light` (display serif) | 400 (one weight) | woff2 / woff / ttf / eot | `https://www.hellomonday.com/assets/fonts/383D05_0_0.{ext}` | yes (38 KB woff2 / 37 KB woff / 71 KB ttf / 28 KB eot) |
| `nb_internationalprolight` (humanist sans, light) | 400 | woff2 / woff / ttf / eot | `https://www.hellomonday.com/assets/fonts/nb_international_pro_light-webfont.{ext}` | yes (40 KB woff2 / 56 KB woff / 140 KB ttf / 140 KB eot) |
| `nb_internationalproregular` (humanist sans, regular) | 400 | woff2 / woff / ttf / eot | `https://www.hellomonday.com/assets/fonts/nb_international_pro_regular-webfont.{ext}` | yes (40 KB woff2 / 56 KB woff / 138 KB ttf / 46 KB eot) |
| `VideoJS` (icon font, inlined) | 400 | woff (base64 in CSS) | `data:application/font-woff;base64,...` | inlined |

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/hellomonday/images/hello_monday_default_meta__b6743e1b.jpg` | JPEG | (not measured) | 85,274 B | `https://www.hellomonday.com/assets/images/icons/hello_monday_default_meta.jpg` | OG / Twitter card default image (1200×630 assumed) |
| `tools/tmp/hellomonday/images/favicon-32x32_0__8684b158.png` | PNG | 32×32 | 2,367 B | `https://www.hellomonday.com/favicon-32x32_0.png` | Browser favicon |
| `tools/tmp/hellomonday/images/menu_blob_init__f9e4291c.png` | PNG (sprite sheet) | 27×~1500 (1 col, ~30 frames) | 2,120 B | `https://www.hellomonday.com/assets/spritesheets/menu_blob_init.png` | Menu open blob morph |
| `tools/tmp/hellomonday/images/scroll-dot__70c0fe21.png` | PNG (sprite sheet) | 8×~1900 (1 col, ~30 frames) | 3,588 B | `https://www.hellomonday.com/assets/spritesheets/scroll-dot.png` | Scroll indicator falling dot |
| Hero video | MP4 H.264 | 1920×? (not measured) | not in dump | `https://www.hellomonday.com/assets/video/animations/hm-hero-initial-non-retina.mp4` | `<video loop muted autoplay playsinline preload="auto">` in `.HeroModule .animationContainer` |
| DeepDive video | MP4 H.264 | 1920×? (not measured) | not in dump | `https://videos.ctfassets.net/9uhkiji6mhey/4OVP1nwGH2c9BT5xbGeDr0/b5dcaf7807d8d76081477a652dcf0cd3/Stabilized_2.mp4` | Contentful-hosted; shown in `.DeepDiveSplashModule .imageContainer` (16:9, 56.25% padding-top) |

### Sprite sheet metadata (TexturePacker JSON)

| Local path | Frames | Source URL | Notes |
| --- | --- | --- | --- |
| `tools/tmp/hellomonday/other/face_all__615f3540.json` | 7 sequences × ~30 frames each (~210 total) | `https://www.hellomonday.com/assets/spritesheets/face_all.json` | Names: `AdultToBaby`, `BabyToTeen`, `DownUp`, `LtoR`, `RtoL`, `TeenToAdult`, `UpDown`. Source frame 80×80 |
| `tools/tmp/hellomonday/other/menu_blob_init__31875546.json` | ~30 frames | `https://www.hellomonday.com/assets/spritesheets/menu_blob_init.json` | `27×66` source, white blob, used for menu open |
| `tools/tmp/hellomonday/other/menu_blob_init_black__ec300dd0.json` | ~30 frames | `https://www.hellomonday.com/assets/spritesheets/menu_blob_init_black.json` | `27×66` source, black blob, used for menu close |
| `tools/tmp/hellomonday/other/scroll-dot__4be599ca.json` | ~30 frames | `https://www.hellomonday.com/assets/spritesheets/scroll-dot.json` | `8×8` per frame, `80×80` source — long thin column |
| `tools/tmp/hellomonday/other/dot2__e54b193c.json` | ~30 frames | `https://www.hellomonday.com/assets/spritesheets/dot2.json` | Companion to scroll-dot |
| `tools/tmp/hellomonday/other/play-pause__2c862c9b.json` | 3 frames | `https://www.hellomonday.com/assets/spritesheets/play-pause.json` | 3-bar icon swap |
| `tools/tmp/hellomonday/other/behind_eye__85a82296.json` | ~6 frames | `https://www.hellomonday.com/assets/spritesheets/behind_eye.json` | Animated eye, used on case-card hover |

### SVGs & icons

- **Inline SVGs observed in HTML:**
  - Logo wordmark (`.logo` and `.staticLogo`) — 17-path SVG
    `viewBox="0 0 1076 610"`, 68×39.
  - Mobile burger (`.mobileBurger .burger`) — 17×10 SVG, 3
    horizontal bars (16, 16, 12 wide).
  - Close-X (`.mobileBurger .closeX .close`) — 34×34 SVG with
    `.line1` + `.line2` filled `#1D1F23`.
  - Countdown glyph (`.countdown .circle`) — 22×22 inline SVG,
    a hand-drawn "envelope+note" mark with `<style>.st0{fill:#FFFFFF}
    .st1{fill:#FFFFFF;stroke:#000000;stroke-width:0.4;…}</style>`.
  - Footer bulge (`.Footer .bulge`) — 0-tall SVG path
    `M0,55 C107.57,55 …`, fill `#000`.
  - Menu bulge (`.burgers .right`) — 19×15 SVG with 3 paths
    (asymmetric scribble burger), fill `white`.
  - Close bulge (`.closeBulge`) — `<path id="curve"
    d="M0,0 C0,250 0,250 0,500 Z">` (a half-circle buldge for the
    menu close animation).
- **Standalone SVG files in dump:** None — `svgs/` is empty.
- **Icon system:** Hand-authored inline SVGs, no Lucide / Phosphor /
  Heroicons / sprite. Filled single-color icons only.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| (remote) `https://www.hellomonday.com/assets/video/animations/hm-hero-initial-non-retina.mp4` | MP4 H.264 | `<video loop muted autoplay playsinline preload="auto">` in hero |
| (remote) `https://videos.ctfassets.net/9uhkiji6mhey/4OVP1nwGH2c9BT5xbGeDr0/b5dcaf7807d8d76081477a652dcf0cd3/Stabilized_2.mp4` | MP4 H.264 | `<video src=… loop muted autoplay>` in DeepDiveSplashModule, 16:9 |

### Other assets

- `tools/tmp/hellomonday/other/site__aed25ff5.webmanifest` — PWA
  manifest, `theme_color: #ffffff`, `background_color: #ffffff`,
  `display: standalone`, references 192×192 and 512×512 Android
  chrome icons (not in dump).

---

## Motion & Interaction

### Principles

- **Type-driven motion.** Headlines animate in character-by-character
  using a sprite mask rather than per-letter DOM nodes — keeps the
  DOM lean.
- **TweenLite, not CSS, for hero / menu.** All headline and
  navigation motion is JS-driven; CSS transitions only handle
  lightweight hovers.
- **Paper.js for "physical" surfaces.** The menu blob, page wipe,
  and background renderer are all Paper.js canvas, not CSS or SVG.
- **Easing:** Defaults to `cubic-bezier(.25,.46,.45,.94)`
  (Video.js's `easeOutQuad`-ish curve) for UI; Tweens use
  `Power2.easeOut` / `Power3.easeOut` by inference.
- **Durations:** 200ms micro (hover scale, button), 300–500ms small
  (overlay reveal), 600–800ms medium (route wipe, intro morph).

### Specific behaviors

- **Link hover:** No explicit CSS hover; the work-card hover
  brightens to `opacity: 1` from a rest of `opacity: .2` (desktop
  only — gated on `body:not(.touch)`).
- **Button press:** `transition: transform .2s` on small link
  elements; `scale(1.5)` on Video.js play button hover.
- **Section reveal on scroll:** `IntersectionObserver`-driven (12
  instances in the bundle). `transition: opacity .2s/.3s/.5s/1s`
  applied to `.lazyloaded` images.
- **Menu open:** A `.menu_blob_init` sprite frame is animated
  (TweenLite) from a small 10×38 element at the burger position to
  the full menu container while Paper.js morphs the matching bezier
  path. Each menu link's `.dotContainer` springs in
  (`matrix(0.5,0,0,0.5) → identity`, `opacity 0 → 1`).
- **Page transition:** Curtain-style — Paper.js paints a path with
  the outgoing module's `data-color` to fill the screen, content
  swaps, then the path retracts. ~600–800ms total.
- **Scroll dot:** Repeating bounce — the
  `transform: matrix(0.5,0,0,0.5,8,44)` starting position keyframes
  into the rest position and back, ~30 frames over ~1s.
- **Back to top:** `transform: matrix(1,0,0,1,0,32) → identity` on
  scroll, `p.label` slides up 32px.

### Reduced motion

Not implemented — no `prefers-reduced-motion` query was found in
the bundle.

---

## Content & Voice

- **Tone:** Confident-editorial, light-hearted. The hero subtitle
  is literal: "We make digital (and magical)…" The intro panel
  promises (paraphrased): joyful digital ideas, products, brand
  identities, and experiences.
- **Sentence length:** Short, conversational. Hero copy is a single
  sentence split across two lines (a tagline plus the active word).
- **Capitalization:** Sentence case in body. Title case in
  navigation ("View all projects"). Section titles use title case
  ("A booster rocket for digital product teams").
- **Punctuation:** No Oxford comma. Em-dash used sparingly.
  Ellipsis with no space ("…").
- **CTA vocabulary:** "Discover more", "View all projects", "Apply
  here", "Back to top". Direct, lower-emphasis.
- **Voice in 3rd person:** Studio describes itself in 1st-person
  plural ("We make digital…", "Want to collaborate?").
- **Days-until-Monday label:** A signature quirky element — a
  running day counter next to the hero. (Shown as
  "2 days until Monday" at scrape time.)
- **"Department" of DEPT®:** The footer privacy link points to
  `deptagency.com`, indicating the studio is a DEPT® agency.

---

## Information Architecture

- `/` — marketing homepage (observed)
- `/work` — case studies / portfolio
- `/services` — service offering
- `/about` — studio overview
- `/stories` — editorial / blog
- `/product` — product consulting arm (the "Deep Dive" pitch)
- `/website` (declared in `og:url`, not implemented per dump)
- External: `facebook.com/hellomonday`, `instagram.com/hellomondaycom`,
  `twitter.com/hellomondaycom`, `deptagency.com/en-nl/privacy-policy/`,
  Google Maps links for 4 office locations.

The four `.office` anchors in the footer link to specific Google
Maps place IDs for:
- New York — `36 East 20th St, 6th Floor, New York, NY 10003`
- Copenhagen — `Langebrogade 6E, 2nd floor, 1411 Copenhagen`
- Aarhus — `Banegardspladsen 20A, 1.TV, 8000 Aarhus C`
- Amsterdam — `Generaal Vetterstraat 66, 1059 BW Amsterdam`

The contact emails are role-based:
- `newbusiness@hellomonday.com`
- `hello@hellomonday.com`

---

## Accessibility

- **Color contrast:** Black `#000000` on white `#FFFFFF` = 21:1.
  White `#FFFFFF` on `#191919` (DeepDive splash) = 17.4:1. The
  muted `#C6C5C5` text on `#F8F6F5` cream fails AA (1.6:1) — only
  used for non-essential helper copy.
- **Focus indicators:** Not explicitly styled in the dump. The
  Video.js controls have `transition: all .3s
  cubic-bezier(.25,.46,.45,.94)` on `:focus`, implying a visible
  focus state.
- **Keyboard:** No explicit `tabindex` was observed on the menu
  links. The `<canvas>` elements are not focusable.
- **Screen reader landmarks:** `<nav class="container items">` and
  `<nav class="MainMenu">` are present; `<section class="HeroModule
  module">`, `<section class="CaseGridModule module">`, and
  `<section class="DeepDiveSplashModule module">` are all sections.
  `<footer class="Footer">` is a footer landmark.
- **ARIA:** No `role`, `aria-*`, or `aria-label` attributes were
  observed in the rendered HTML.
- **Motion:** No `prefers-reduced-motion` handling.
- **Alt text:** The hero video has no `aria-label` or `<track>`
  captions. The case-card images use `data-src` for lazy loading
  and have no `alt` in the dump (because the dump is the
  pre-render shell, not the final case cards).
- **`<html lang="en">`** is set.

---

## Sources

Every URL opened or fetched while writing this:

- Homepage — https://www.hellomonday.com/
- Bundle CSS — https://www.hellomonday.com/build/css/bundle-2bdea8b598.css
- Bundle JS — https://www.hellomonday.com/build/js/main-e03077acdb.js
- Plausible analytics — https://plausible.io/js/script.js
- Cloudflare beacon — https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447
- Cloudflare-hosted video (DeepDive) — https://videos.ctfassets.net/9uhkiji6mhey/4OVP1nwGH2c9BT5xbGeDr0/b5dcaf7807d8d76081477a652dcf0cd3/Stabilized_2.mp4
- OG default image — https://www.hellomonday.com/assets/images/icons/hello_monday_default_meta.jpg
- Sprite sheets — https://www.hellomonday.com/assets/spritesheets/{face_all,menu_blob_init,menu_blob_init_black,scroll-dot,dot2,play-pause,behind_eye}.json
- Font files — https://www.hellomonday.com/assets/fonts/{383D05_0_0,nb_international_pro_light-webfont,nb_international_pro_regular-webfont}.{eot,woff,woff2,ttf}
- Web manifest — https://www.hellomonday.com/site.webmanifest
- Social channels —
  - https://www.facebook.com/hellomonday
  - https://www.instagram.com/hellomondaycom
  - https://twitter.com/hellomondaycom
- Privacy statement — https://www.deptagency.com/en-nl/privacy-policy/
- Office Maps links —
  - https://www.google.com/maps/place/Hello+Monday/@40.7385487,-73.9908801,17z (NY)
  - https://www.google.com/maps/place/Hello+Monday/@55.6658995,12.5783361,17z (Copenhagen)
  - https://www.google.com/maps/place/Hello+Monday/@56.1500968,10.2030539,17z (Aarhus)
  - https://www.google.com/maps/place/Generaal+Vetterstraat+66,+1059+BW+Amsterdam (Amsterdam)
- Local dump files read —
  - `tools/tmp/hellomonday/playwright/homepage.html` (the rendered DOM)
  - `tools/tmp/hellomonday/playwright/computed-styles.json` (every visible element's computed style)
  - `tools/tmp/hellomonday/css/bundle-2bdea8b598__d5b30ef8.css` (full bundle, 151,730 B)
  - `tools/tmp/hellomonday/js/main-e03077acdb__16097497.js` (full bundle, 1,743,079 B)
  - `tools/tmp/hellomonday/manifest.json` (dump manifest)
  - `tools/tmp/hellomonday/other/{face_all,menu_blob_init,menu_blob_init_black,scroll-dot,dot2,play-pause,behind_eye}__*.json` (sprite metadata)
  - `tools/tmp/hellomonday/other/site__aed25ff5.webmanifest`

---

## Changelog

- 2026-06-20 — Initial draft by opencode agent. Based on the
  `tools/tmp/hellomonday/` dump scraped 2026-06-19T20:00:18Z.
