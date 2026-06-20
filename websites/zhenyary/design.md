# zhenyary — design.md

> A structured design specification of **https://zhenyary.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing
> the original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** design.md agent
> **Source dump:** `tools/tmp/zhenyary/` (gitignored)
> **Slug rule applied:** `zhenyary.com` → `zhenyary`

---

## Overview

`zhenyary.com` is the personal portfolio of Zhenya Rynzhuk, an
award-winning art director who frames his work across product / visual
design, mobile and web projects, branding, typography, and animations.
The site is a single-page cinematic experience rather than a marketing
brochure: a 5400-pixel-tall vertical scroll that opens with a massive
black-and-white portrait of Zhenya, scrolls through a typographic
services list, then through two full-bleed case studies (Cure and Rafal
Bojar) and finally lands on a 119.5-pixel-tall italic contact line.
The whole page is a deliberate piece of typographic theatre —
characters and words reveal in sequence, lines slide horizontally,
and a red accent (`#F93700`) is rationed across the layout so that
every accent punctuation has weight.

**Category:** Portfolio (personal site / agency-style case-study reel)
**Primary surface observed:** Homepage (`/`)
**Tone:** confident, theatrical, restrained, typographically-driven
**Framework detected:** Nuxt 2 (SSR; `data-n-head` SSR markers and
`window.$nuxt` references throughout the chunked bundles), Vue 2/3
runtime helpers in the chunks, Webpack module bundling
(`window.webpackJsonp`)
**Animation stack:** GSAP for choreographed reveals, custom RAF/lerp
scroll controller, custom RAF cursor tracker, no external Lottie/Three.js
**Asset pipeline:** responsive WebP/JPG image sources chosen at runtime
via an `isWebP` mixin and `@mx / @.5x / @1x` URL transforms
**Service worker:** Workbox (`/sw.js`, `scope: "/"`)
**Analytics:** Google Analytics (`UA-90480178-1`, `G-9J89X64R89`),
Cloudflare Web Analytics (beacon.min.js)

---

## Visual Language

### Color

The palette is deliberately tight: one warm off-white surface, one near-
black ink, one saturated red accent, and a single pink for the loader.
Most other values observed in computed styles are derived (alpha blurs,
secondary greys for disabled socials).

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Page background (base) | `--bg-base` | `#DBD5C9` (warm off-white / linen) | `main.no-touch` |
| Section background (cool) | `--bg-cool` | `#F2F2F2` (light grey) | `article.gems` |
| Section background (beige) | `--bg-warm` | `#DED5C4` (tan variant) | works pane |
| Work left pane | `--bg-cream` | `#FFFFFF` (pure white) | `work .left` first item |
| Work left pane (alt) | `--bg-cream-2` | `#DBD5C9` (linen) | `work+.work .left` |
| Work right pane | `--bg-red` | `#F93700` (signature red) | `work+.work .right` |
| Text primary | `--text-primary` | `#191919` (near-black) | nav, body, headings |
| Text muted (socials) | `--text-muted` | `#5E5B55` (warm grey) | default social link |
| Text on hero / contact | `--text-invert` | `#FFFFFF` (pure white) | hero h1, contact on red |
| Accent | `--accent-red` | `#F93700` | active state, link hover, stars |
| Accent secondary | `--accent-pink` | `#F9DDDD` | loader "pink" circle |
| Loader veil | `--bg-loader` | `#000000` (black) | `Loader .bg` |
| Border / hairline | `--border` | `#000000` @ 1px / 2px | underlines under titles |
| Loader progress | `--progress` | `#3B8070` (Nuxt default green) | `.nuxt-progress` |

The script-injected `color1` class on `<body>` lets a footer toggle
switch between the default `nude` (text on linen) and `red` (text on
red) states — a low-tech theme switch implemented as a class swap on
`<nav>` and `<footer>` rather than a real CSS-variables flip.

### Typography

The site uses two custom families: a wide-set display serif
(`Schnyder L`) for headings and a neo-grotesque sans (`GT Walsheim`)
for body / nav / labels. Both are self-hosted as `.woff2` from
`/_nuxt/fonts/…`.

| Role | Family | Weight | Size (computed) | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Hero H1 (`h1.ready`) | `"Schnyder L", serif` | 600 | `100.8px` (7vw) | `126px` (1.25) | `0` |
| Hero H1 mobile | `"Schnyder L", serif` | 600 | `10vw` ≈ 50–100px | `1.1` | `0` |
| Display (services) | `"Schnyder L", serif` | 600 | `86.4px` (6vw) | `95.9px` (1.11) | `0` |
| Display (mobile fallback) | `"Schnyder L", serif` | 600 | `12vw` | `1.0` | `0` |
| Display (worksLink) | `"Schnyder L", serif` | 600 | `158.4px` (11vw) | `174.2px` (1.1) | `0` |
| Display (thanks) | `"Schnyder L", serif` | 600 italic | `28.8px` (2vw) | `31.7px` (1.1) | `0` |
| Display (contact) | `"Schnyder L", serif` | 600 | `119.52px` (8.3vw) | `131.5px` (1.1) | `0` |
| Work H3 (`.h3`) | `"Schnyder L", serif` | 600 | `44.64px` (3.1vw) | `40.2px` (0.9) | `0` |
| Work title (`.title`) | `"GT Walsheim", sans` | 400 | `25.92px` (1.8vw) | `41.5px` (1.6) | `0` |
| Work type (`.type`) | `"Schnyder L", serif` | 600 | `20px` | `32px` (1.6) | `0` |
| Nav link | `"GT Walsheim", sans` | 400 | `31.68px` (2.2vw) | `31.7px` (1.0) | `0` |
| Nav label | `"GT Walsheim", sans` | 300 | `12px` | `12px` | `0` (UPPERCASE) |
| Footer button | `"GT Walsheim", sans` | 400 | `14px` | `1.0` | `0` (UPPERCASE) |
| Social link | `"Schnyder L", serif` | 600 | `18px` | `27px` (1.5) | `0` |
| Body / li / `.intro` | `"GT Walsheim", sans` | 400 | `14px` | `22.4px` (1.6) | `0` |
| Strong caption (`strong`) | `"GT Walsheim", sans` | 300 | `12px` | `15px` (1.25) | `0` (UPPERCASE) |
| Mobile-anime baseline | `"GT Walsheim", sans` | 400 | `14px` | `1.5` | `0` |

All sizes that read in `vw` clamp against the 1050px and 600px
breakpoints (see Layout & Grid). The `GT Walsheim` rendering
surprisingly resolves to `"GT Walsheim", sans` in the computed-style
dump — that's the actual `font-family` declared in the stylesheet even
though the loaded WOFF2 is `GTWalsheimRegular`. The `font-stretch`
axis is not declared; weights 300 (Light) and 400 (Regular) are both
shipped. `Schnyder L` is loaded in `Demi` (600) and `DemiItalic` (600
italic) — no roman or bold weights are needed.

### Spacing & radius

- **Base unit:** 8px (4px sub-step used for tight underline heights of
  `2px` / `3px`).
- **Vertical scale:** mostly expressed in `vh` / `vw` — `5vh` top/bottom
  nav padding, `3vh` footer button padding, `1vh` / `1vw` line
  paddings, `2vw` between display lines.
- **Horizontal gutter (nav):** `4vw` left, `5.4vw` around the centered
  `Z` mark.
- **Border-radius:** zero throughout — every shape is either a flat
  rectangle or a perfect circle (`border-radius: 50%` on the loader /
  cursor circles, none on UI panels).
- **Shadows:** none observed in the computed-style dump (`box-shadow:
  none` everywhere). The one shadow-like detail is the `0.2vw` and
  `2px` solid underlines under titles — flat solid color, no blur.

### Iconography

- **Style:** outline / stroke-based; all SVGs use `fill="none"` and
  `stroke="#FFF"` or `stroke="#191919"` with `stroke-width="1"` (close
  icon) or `2px` (cursor circle, play icon).
- **Library:** none — every icon is hand-inlined SVG.
- **Default size:** 100×100 px for the cursor circle and loader
  circle; 25×20 px for the icon container inside the video overlay;
  28×28 px for the close button; 19×25 px for the play arrow; 165×165
  px for the contact smiley; 132×89 px for the contact arrow.
- **Decorative glyphs:** an 8-point star (48×48 viewBox, path
  `M20.078 14.026L24.157 0l5.02…`) used as a bullet/separator
  throughout the services list and contact section. It spins
  continuously via `@keyframes star`.

---

## Layout & Grid

- **Max content width:** none — content is intentionally full-bleed.
  Almost every section is `width: 100vw` and `height: 100vh` (or
  `200vh` for the works strip).
- **Page gutter:** `0` on the page itself; interior padding is `6vw`
  for the services and contact blocks and `5vh 4vw` for the nav
  container.
- **Grid:** the works strip is a flex 50/50 split (`.left` and `.right`
  each `width: 50%`), but most other sections are single-column.
- **Breakpoints:**
  - mobile fallback `≤ 600px` (tablet-class → phone)
  - tablet `≤ 800px` (loader span only)
  - tablet `≤ 1050px` (most desktop typography compresses here)
- **Vertical rhythm:** none in the classic baseline sense. Each
  article is exactly `100vh` and scrolls past the viewport one at a
  time.

### Section sequence on the homepage

The body wraps a `<main data-v-2973a1f8>` of `background: #DBD5C9;
color: #191919; height: 5400px` (the playwright snapshot height).
Reading top → bottom:

1. **Fullscreen loader** (`<div class="Loader">`) — black veil + red
   and pink `40×40` circles that translate in from `translateX(-20000px)`
   to mark readiness, plus a hidden 100 px "Hey!" greeting in
   `Schnyder L`.
2. **Fixed video modal** (`.video`) — covers the page at `z-index: 10`,
   stays `visibility: hidden; opacity: 0` until the showreel is
   invoked. Contains a 100×100 stroked circle cursor and a play arrow.
3. **Fixed nav** (`<nav class="large nude index">`) — 5vh top / 5vh
   bottom padding, holds the centered home mark and side links. The
   top mark `.home` is centered horizontally at `top: 5vh` and houses
   a rotated logo. Class swaps to `red` over the red work pane.
4. **Hero** (`<article class="home">`) — `100vh × 100vw` portrait. A
   black-and-white 1070×1184 photo (`zhenya-bg.webp`) sits behind a
   100.8 px H1 that animates a left/right split-screen reveal. A
   `Play Showreel` button sits bottom-left and a "Click click" hint
   (with a star icon) decorates bottom-right.
5. **Hero footer** (`<footer>` inside the hero) — three items in a
   baseline-aligned flex row: `In red` toggle (left), `Dribbble ·
   Behance · Twitter` socials (center), `In Light` toggle (right).
   Underlines animate from `translateX(-100%)` on hover (left) and
   `translateX(100%)` (right).
6. **Services / "Gems"** (`<article class="gems">`) — `100vh` panel
   on `#F2F2F2`. Each line is a flex row of giant italic serif words
   separated by 8-point stars. The 10-character deep stack uses a
   per-character `translateX(50px)` entrance that races along a 6-vw
   left/right padding line. Service list: Art direction, Product
   design, Visual design, Mobile & web, Interaction, Animation,
   Branding.
7. **Works** (`<article class="works">`) — `200vh` strip that pins
   two case studies (Cure, Rafal Bojar) in a vertical sequence. Each
   case study is `100vh` and split 50/50 into a white/cream `.left`
   pane (large image + title block) and a grey/red `.right` pane
   (text + image with a giant 144 px letter `C` or `R`).
8. **WorksLink** (`<div class="worksLink">`) — `50vh` centered
   `11vw` link "All cases / here" with an animated `scaleX` underline
   that grows from `0 50%` to `scale(1)`.
9. **Thanks** (`<article class="thanks">`) — `50vh` italic
   acknowledgement to developer Romain Avalle with an animated
   underline.
10. **Contact** (`<article class="contact">`) — `100vh` flex column
    on the red background. Four lines: smiley face, "Let's make
    _something_ great!", `hey@zhenyary.com` (red link + arrow
    decoration), "for / collaborations" with cascading `translateX(-3vw)`
    arrows.
11. **Site footer** — a small `flex; justify-content: center; padding:
    50px 0` line outside the contact article.

---

## Components

The site is composed from a small set of large, layout-sized
components rather than conventional UI primitives. There are no
standard buttons, inputs, modals or dropdowns — every "control" is a
hand-built Vue SFC. Below are the components actually observed.

### Loader (full-bleed splash)

- **Anatomy:** `position: fixed; inset: 0; z-index: 999`. A black
  `<div class="bg">` and two `40×40` viewBox SVG circles (one red,
  one pink) translate in from `translateX(-20000px)` to
  `translateX(900px) / translateX(370px)`. An oversized
  `Schnyder L 100px / 600` greeting "Hey!" sits at
  `translateX(-270px) translateY(350px)` until the page is ready.
- **Behavior:** fades out via opacity once `Loader.ready` is set
  (`display: none` after the curtain animation completes).
- **Mobile:** span shrinks to `50px`.

### Nav (top)

- **Height:** ~`5vh + 5vh + 2.2vw` ≈ 80–120 px depending on viewport.
- **Anatomy:** centered home `Z` mark at `top: 5vh;
  transform: translateX(-50%)`, plus a horizontal flex container with
  `padding: 5vh 0 5vh 4vw` holding a left-edge `Z` mark, a list of
  nav links, and a spacer.
- **Link styles:** `2.2vw / 1.0` `GT Walsheim`, color `#191919`,
  active state `#F93700`, hover (no-touch only) animates a `.label`
  caption below from `letter-spacing: 0.07vw` baseline to `0`.
- **States:** class `nude` (default text on linen) and class `red`
  (text on the red works pane) are swapped as the user scrolls into
  a work.
- **Mobile:** `<nav>` is hidden entirely (the `.mobile` class on
  `<main>` triggers `display: none`); a separate `.nav-mobile`
  overlay (`position: fixed; inset: 0; z-index: 5; background:
  #DBD5C9`) takes over with a single 20×20 close button and a
  vertical `2.2vw` link list.

### Hero (fullscreen portrait)

- **Anatomy:** `100vh × 100vw` `<article class="home">` with a 30vw
  `.img-container` centered (`left: 50%; top: 50%; transform:
  translate(-50%,-50%)`). The container holds `zhenya-bg.webp`
  (`1070 × 1184`) and 11 hover-swap variants (`0.jpg … 10.jpg`) plus
  `zhenya-front.webp` on top, with `pointer-events: none` until the
  cursor enters the portrait.
- **Headline:** `<h1>` in `Schnyder L 7vw / 600 / 1.25` white, with
  two pseudo-elements `.left` / `.right` covering `width: 70%` on
  each side. Each pseudo-element's inner span animates from
  `translateX(100%)` / `translateX(-100%)` to `translateX(0)` over
  `2s cubic-bezier(.25,.46,.45,.94)` once the page is `ready`.
- **Showreel button:** `Play Showreel` (`Schnyder L 1.8vw / 600`,
  `letter-spacing: 6px`) with a leading 100×100 stroked circle that
  becomes the custom cursor on enter.
- **Click hint:** a 48×48 eight-point star (SVG) with a "Click click"
  label that toggles a vertical list ("Art direction / Digital
  production / Branding") with cascading `translateY(27%, 44%, 65%)`.
- **Circles:** two large `100×100` stroked SVGs that fade in/out as
  the cursor moves over the portrait (`transform: scale(0.4)
  translateX(-50%) translateY(100%)` baseline).
- **States:** `.no-touch` enables cursor-based parallax; `.touch` /
  `.mobile` disables and falls back to a static image.

### Hero footer (theme toggle + socials)

- **Anatomy:** `display: flex; justify-content: space-between;
  align-items: baseline; position: absolute; bottom: 0; width: 100%`.
- **Theme toggle:** two `<button>` elements `.red` and `.nude`,
  uppercase `GT Walsheim 14px`, `padding: 0 4vw 3vh`. Underlines are
  `position: absolute; bottom: 0; height: 3px` and animate between
  `translateX(-100%)` (inactive) and `translateX(0)` / scaleX(1)
  (active).
- **Socials:** flex row of three serif links
  (`Dribbble / Behance / Twitter`) at 18 px / 600, default `#5E5B55`,
  hover `#F93700`. Underline is `transform: scaleX(0)` → `scale(1)`
  on `.ready`.
- **Mobile (≤1050px):** footer centers and hides the toggle buttons;
  socials drop to `padding: 0 12vw` and a 30 px horizontal margin.

### Gems (services list)

- **Anatomy:** `100vh × 100vw` panel on `#F2F2F2` with a centered
  uppercase caption "My main services" at `top: 2vh`. Below is a
  flex column of `.line` rows at `padding: 1vw 6vw; line-height:
  1.11`, with the second row offset `margin-top: 2vw`.
- **Line content:** 6vw / 600 serif words broken into per-character
  `<span class="inner">` units. Each inner unit animates from
  `opacity: 0; transform: translateX(50px)` to `(1, 0)` once the
  section becomes `.ready`.
- **Separator:** a 2vw × 2vw 8-point star (`fill: #F93700`) sits
  between words.
- **Inline link:** "Visual design" is wrapped in a `.underline
  italic` span with a `0.2vw` underline that animates from
  `translateX(-150%)` to `translateX(0)`.

### Works (case-study strip)

- **Anatomy:** `200vh` container; each `.work` is `100vh` and split
  into `.left` (50% white/cream pane) and `.right` (50% grey/red pane).
- **Left pane:** centered 50%-width image (`.img`) at
  `margin: 20vh auto 0`, with an H3 (`Schnyder L 3.1vw / 600 / 0.9,
  uppercase`) and a `<p class="type">` (`Schnyder L 20px / 600`)
  caption beneath.
- **Right pane:** `position: absolute; bottom: 0; height: 30vh` image
  plus a centered `40%-width` text block with title, role list,
  intro paragraph, and a "Check full case +" link.
- **Letter marker:** a 144 px / 300-weight `GT Walsheim` uppercase
  letter (`C` for Cure, `R` for Rafal Bojar) sits at `left: 50%;
  top: 50%; transform: translate(-50%,-50%)` and pins via
  `letter-container` opacity + translateY animation.
- **Alt case style (`.work+.work`):** left switches to `#DBD5C9` and
  right to `#F93700` (signature red), with a white underline.

### WorksLink CTA

- **Anatomy:** `50vh × 100vw` flex-centered anchor
  (`Schnyder L 11vw / 600 / 1.1`). The link has a `0.4vw` white
  underline at `bottom: 0` that animates from `scaleX(0)` to `scale(1)`
  on `.ready`.
- **Mobile (≤600px):** font drops to `12vw`, text is centered with a
  static `2px` solid underline and the pseudo underline removed.

### Thanks (dev credit)

- **Anatomy:** `50vh × 100vw` flex-centered italic serif paragraph
  (`Schnyder L 2vw / 600 italic / 1.1`) acknowledging Romain Avalle.
- **Mobile (≤1050px):** height auto with `padding: 10vh 0 20vh`,
  font 6vw. Below 600px drops padding to `0 0 10vh`.

### Contact (fullscreen)

- **Anatomy:** `100vh × 100vw` flex column on red. Four `.line`
  rows at `padding: 1vh 6vw; line-height: 1.1`, each `11px 6vw`
  padding for the inner spans.
- **Line 1:** smiley face (`<svg viewBox="0 0 165 165">` with a
  white stroked circle and a smile path; rotates via
  `@keyframes smiley`).
- **Line 2:** "Let's make _something_ great!" with the word
  "something" italicized in Schnyder L.
- **Line 3:** `hey@zhenyary.com` mailto link with three 132×89 arrow
  SVGs cascading in (`translateX(-3vw) → translateX(0)`) over
  staggered 200/300 ms delays.
- **Line 4:** the trailing `for` and `collaborations.`.
- **Animations:** each line reveals with
  `transform: translateY(100px) scaleY(1.5); opacity: 0` → default.
  `.contact.arrow` cascades 0/200/300 ms; the link underline grows
  from `scaleX(0)` to `scale(1)` on `.ready`.

### Video overlay (showreel)

- **Anatomy:** `position: fixed; inset: 0; z-index: 10; background:
  $black`. A 30×30 close `<button>` in the top-right, a centered
  `<video>` (not present in static HTML — streamed lazily), a 100 px
  stroked circle that becomes the custom cursor, and a 25×20 icon
  container holding the play SVG (`viewBox 0 0 19 25`).
- **States:** `visibility: hidden; opacity: 0` until invoked.
  Enter/leave transitions are 200ms / 500ms `ease-out-quad` and
  `ease-in-quad` with `scale(.5) → scale(1)` on the cursor.

### Custom cursor

- **Anatomy:** two DOM nodes — a 100×100 stroked circle that follows
  the cursor with three eased positions (`easeX`, `easeMouseX`,
  `easeSlowX`, each lerped at `/10`, `/6`, `/20` of the delta) and a
  25×20 icon container that swaps between `play` (Play SVG) and
  pause (two vertical bars SVG).
- **Behavior:** hidden on `.mobile` / `.no-touch` fallback. Reset to
  cursor coordinates on `mousemove` first frame.

---

## JavaScript & Libraries

The dump contains 17 JS bundles (435 KB of webpack chunks for the
Nuxt app plus ~33 KB of third-party tags). Most library strings are
minified, so the table below records both the version evidence and
the runtime signature that confirmed the detection.

| Library / Module | Version (if visible) | Detection | Usage in this site |
| --- | --- | --- | --- |
| Nuxt 2 (SSR framework) | 2.x | `data-n-head`, `window.$nuxt`, `__nuxt`, `NuxtLink`, `__NUXT__.state`, `<no-ssr>`, `_hydrated`, `_fetchKey` | Page rendering, route handling, prefetch via `IntersectionObserver`, head-meta injection, app-level mixins (`isWebP`, `getSrcSet`) |
| Vue (runtime + compiler) | 2.x helpers (and v3-style helpers in chunks) | `vue/dist/vue.runtime.common.js` and `vue/dist/vue.runtime.esm.js` chunks | Component rendering, reactivity, custom directives |
| Vuex | 2.x / 3.x | `Vuex.Store`, `registerModule`, `store/index.js` module loader | App state (`datas` namespaced module) |
| vue-router | 3.x | `<router-link>` extensions (`NuxtLink`) | Client-side routing |
| GSAP | 2.x (GreenSock) | Inline call patterns like `Object(c.a)({targets:this.$refs.links, translateY:"100%", opacity:0, duration:500, easing:"easeOutQuad"})` in socials component; `c.a.set`, `c.a.stagger(200, …)` | Footer social link hide/show stagger; service-list per-character reveal; work-letter vertical scroll; video-overlay enter/leave |
| Workbox | 4.x / 5.x | `new r("/sw.js", {scope:"/"})` registration block in app bootstrap | Service-worker registration for offline caching |
| Google Analytics (analytics.js) | `analytics.js` | `<script src="https://www.google-analytics.com/analytics.js">` and `UA-90480178-1` | Pageview tracking |
| Google Tag Manager (gtag.js) | `G-9J89X64R89` | `https://www.googletagmanager.com/gtag/js?id=G-9J89X64R89` | GA4 events + marketing tags |
| Cloudflare Web Analytics | beacon.min.js `v833ccba57c9e4d2798f2e76cebdd09a11778172276447` | `<script defer src="https://static.cloudflareinsights.com/beacon.min.js/…">` | Server-timing RUM (cfCacheStatus, cfEdge, cfL4, cfOrigin, cfSpeedBrain) |
| Cloudflare email-decode | minified | `cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js` | Rewrites `__cf_email__` spans |
| vue-gtag | implicit (plugin loader) | `id:"UA-90480178-1"`, `vue-gtag` references in chunk `192c639.js` | Vue plugin wrapper for GA |
| vue-meta | 2.x | `vue-meta` chunk and `data-hid` attribute pattern | Per-component head metadata |
| `vue-no-ssr` | Nuxt 2 default | `<no-ssr>` component reference | Skips SSR for canvas + cursor |
| Custom scroll controller | n/a (in-house) | `tick()`, `lerp(ease, scrollTop, .07)`, `lerp(..., .05)`, `WINDOW:DOSCROLL` bus event | Smooth-scroll position interpolation (0.07 / 0.05 lerp factors) |
| Custom cursor controller | n/a (in-house) | `mouseMoveHandler`, three-rate eased follower (`easeX/10`, `easeMouseX/6`, `easeSlowX/20`) | Cursor-follow parallax |
| `TurnDevice` overlay | Nuxt default | `data-v-95182130` style block | Forces portrait orientation hint |
| Image responsive mixin | in-house | `getSrcSet(e,t)` → `@mx / @.5x / @1x` based on `R.a.width()` | Picks WebP/JPG variant at runtime |

The Vue/GSAP/etc. references are not literally spelled in the
minified `js__b007c10a` bundle (that file is in fact the Google
Analytics tag-manager code, identifiable by its `Copyright 2012 Google
Inc.` banner and `gtag` config payload), so version detection relies
on the comment headers in `58b9d86.js` (`For license information please
see LICENSES`) and the GSAP call signature in the socials component.

---

## Animations (Catalog)

The site is motion-driven. Below is every distinct animation
observed, keyed to where it lives.

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `blur` | `homepage.html:13` (`.inner-blur` rule) | n/a (infinite ambient) | `transform`-based | data-text chars shift between `(-10%,7%)`, `(7%,-3%)`, `(-3%,7%)` — used on the "Product design" line as a hover-flash blur |
| `link` | `homepage.html:13` (`.link.blur-sml:after`) | n/a (infinite) | `transform` keyframes | underline scales between `scaleX(1)` and `scaleX(0)` for the "Check full case +" link |
| `smiley` | `homepage.html:13` (`.smiley` rule) | n/a (infinite ambient) | discrete steps | contact smiley rocks `-15° → +25° → +45° → +55° → +25°` |
| `star` | `homepage.html:13` (`.star` rule) | n/a (infinite) | discrete steps | 8-point star spins `0turn → 0.5turn → 1turn` while scaling to `1.2` and back |
| `turn-95182130` | `homepage.html:21` (`TurnDevice` style) | `8s` (`.turn`), `4s` (`.turn--fast`) | `linear`, infinite | rotates 230×230 viewBox icon in landscape hint |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | Footer-socials `hide` | route change | `translateY:"100%", opacity:0, duration:500, easing:"easeOutQuad"` |
| GSAP | Footer-socials `show(idx)` | route change | `translateY:"0%", opacity:1, duration:500, easing:"easeOutQuad", delay: stagger(200, {start:idx})` |
| GSAP | Footer-socials `fastHide` | pre-hide | `gsap.set(..., {translateY:"100%", opacity:0})` — instant, no tween |
| Custom RAF scroll | `.tick()` | every frame | `ease = lerp(ease, scrollTop, .07); easeSlow = lerp(easeSlow, scrollTop, .05);` |
| Custom RAF cursor | `.tick()` | every frame | three-rate eased follower |
| CSS transition | hero `h1.ready` reveal | `ready` class added after fonts/loader | `transform 2s cubic-bezier(.25,.46,.45,.94)` on `.left span` / `.right span` |
| CSS transition | works `letter-container` scroll-pin | per-frame JS updates `translate3d(0, Y, 0)` and `opacity` | values like `translate3d(0px, -720px, 0px)` pinned to scroll position |
| CSS transition | works `img` parallax | per-frame | `transform: scale3d(1.25, 1.25, 1)` → `scale3d(1.5, 1.5, 1)` baseline, JS scales toward scroll |
| CSS transition | works `dot-container` parallax | per-frame | `transform: translate3d(0, 0, 0)` updated by JS |
| CSS transition | worksLink `a` reveal | `.ready` class | `transform .5s cubic-bezier(.25,.46,.45,.94)` on `:after` pseudo-underline (`scaleX(0)` → `scale(1)`) |
| CSS transition | contact `line` reveal | `.ready` class | `transform .5s cubic-bezier(.25,.46,.45,.94), opacity .5s …` for the 4 line elements |
| CSS transition | nav link hover (no-touch) | `:hover` | `.label` letter-spacing animates `0 → .07vw` over `cubic-bezier(.25,.46,.45,.94) .2s` |
| CSS transition | footer underline hover | `:hover` / `.active` | `transform .7s cubic-bezier(.25,.46,.45,.94)` on the 3-px-tall bar |
| CSS transition | video overlay enter | visibility toggle | `opacity ease-out-quad .5s, transform ease-out-quad .5s` (from `.5` → `1`) |
| CSS transition | video overlay leave | visibility toggle | `opacity ease-in-quad .2s, transform ease-in-quad .2s` (to `.5`) |
| Loader entrance | `.Loader .circle`, `.Loader span` | component mount | translateX from `-20000px` to target coords (one-shot) |

### Mobile-anime (works-case) reveal

Each `<p class="intro">`, `<h3 class="h3">`, `<p class="type">`,
`<p class="title">`, and the role `<ul>` in each work case study
carries the `.mobile-anime` class. Baseline style is
`transform: translateY(50px); opacity: 0` and is animated to
`translateY(0); opacity: 1` by JS as the case enters the viewport.
This is a one-shot reveal with the same 500 ms
`cubic-bezier(.25,.46,.45,.94)` as the rest of the site.

### Cubic-bezier easing vocabulary observed

- `cubic-bezier(.25,.46,.45,.94)` — **default site easing**, used on
  every Vue transition and almost every CSS hover.
- `cubic-bezier(.455,.03,.515,.955)` — used on nav link color.
- `cubic-bezier(.55,.085,.68,.53)` — leave easing for nav back.
- `cubic-bezier(.215,.61,.355,1)` — used on the socials color
  transition.
- `easeOutQuad`, `easeInQuad` — GSAP eases (footage-name only, no
  values; standard Penner equations).

### Page transitions

The Vue default transition on `<nuxt>` is
`{name:"page", mode:"out-in", appear:false, appearClass:"appear",
appearActiveClass:"appear-active", appearToClass:"appear-to"}` — a
classic crossfade with no slide, capped by the 500 ms GSAP social
hide/show stagger.

---

## Assets

The dump contains 19 images, 4 fonts, no SVGs in their own folder
(SVGs are inline in the HTML), no 3D models, no audio/video in
`media/`. Video assets are referenced from the works JSON data but
not downloaded — they live on the production CDN (`epicurrence_*.mp4`,
`honey_pot_*.mp4`, etc.) and are only fetched when the user navigates
to a case-study page.

### 3D models

N/A — no 3D assets observed in the dump.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| `GT Walsheim` | 300 (Light), 400 (Regular) | woff2 | `/_nuxt/fonts/GTWalsheimLight.5f8480c.woff2`, `GTWalsheimRegular.c4f8cd1.woff2` | yes |
| `Schnyder L` | 600 (Demi), 600 italic (Demi Italic) | woff2 | `/_nuxt/fonts/SchnyderL-Demi.90f5133.woff2`, `SchnyderL-DemiItalic.efce77f.woff2` | yes |
| Nuxt system font (default Nuxt error page) | system sans-serif | n/a | Nuxt 2 default | no |

The script declares `font-family: "GT Walsheim", sans` for body and
`font-family: "Schnyder L", serif` for display; the literal token
`"Schnyder L"` is what the loaded WOFF2 uses as its family name (the
file itself is named `SchnyderL-Demi` but its internal family is
`Schnyder L`).

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/zhenyary/playwright/images/zhenya-bg__d4f8c91d.webp` | WebP | 1070×1184 | 13 KB | `https://zhenyary.com/images/home/zhenya-bg.webp` | Hero portrait background (B&W) |
| `tools/tmp/zhenyary/playwright/images/zhenya-front__1ae58ed4.webp` | WebP | 1070×1184 | 41 KB | `https://zhenyary.com/images/home/zhenya-front.webp` | Hero portrait foreground (color) |
| `tools/tmp/zhenyary/playwright/images/0__be8d9acc.webp` | WebP | 1070×1184 | 17 KB | `https://zhenyary.com/images/home/0.webp` | Hover-swap variant 0 |
| `tools/tmp/zhenyary/playwright/images/1__5f594123.webp` | WebP | 1070×1184 | 29 KB | `https://zhenyary.com/images/home/1.webp` | Hover-swap variant 1 |
| `tools/tmp/zhenyary/playwright/images/2__39ed96bc.webp` | WebP | 1070×1184 | 9 KB | `https://zhenyary.com/images/home/2.webp` | Hover-swap variant 2 |
| `tools/tmp/zhenyary/playwright/images/3__b6bda633.webp` | WebP | 1070×1184 | 13 KB | `https://zhenyary.com/images/home/3.webp` | Hover-swap variant 3 |
| `tools/tmp/zhenyary/playwright/images/4__f1dc6127.webp` | WebP | 1070×1184 | 18 KB | `https://zhenyary.com/images/home/4.webp` | Hover-swap variant 4 |
| `tools/tmp/zhenyary/playwright/images/5__070d5c61.webp` | WebP | 1070×1184 | 13 KB | `https://zhenyary.com/images/home/5.webp` | Hover-swap variant 5 |
| `tools/tmp/zhenyary/playwright/images/6__44bb6db8.webp` | WebP | 1070×1184 | 14 KB | `https://zhenyary.com/images/home/6.webp` | Hover-swap variant 6 |
| `tools/tmp/zhenyary/playwright/images/7__33a7f68b.webp` | WebP | 1070×1184 | 16 KB | `https://zhenyary.com/images/home/7.webp` | Hover-swap variant 7 |
| `tools/tmp/zhenyary/playwright/images/8__38be144b.webp` | WebP | 1070×1184 | 32 KB | `https://zhenyary.com/images/home/8.webp` | Hover-swap variant 8 |
| `tools/tmp/zhenyary/playwright/images/9__ef228228.webp` | WebP | 1070×1184 | 19 KB | `https://zhenyary.com/images/home/9.webp` | Hover-swap variant 9 |
| `tools/tmp/zhenyary/playwright/images/10__878344da.webp` | WebP | 1070×1184 | 15 KB | `https://zhenyary.com/images/home/10.webp` | Hover-swap variant 10 |
| `tools/tmp/zhenyary/playwright/images/cure-home-1__bf29e607.webp` | WebP | 484×536 | 39 KB | `https://zhenyary.com/images/cure/cure-home-1.webp` | Cure case — left pane image |
| `tools/tmp/zhenyary/playwright/images/cure-home-2__95620227.webp` | WebP | 960×377 | 50 KB | `https://zhenyary.com/images/cure/cure-home-2.webp` | Cure case — right pane image |
| `tools/tmp/zhenyary/playwright/images/rafal-bojar-home-1__03aa22c0.webp` | WebP | 484×536 | 29 KB | `https://zhenyary.com/images/rafal-bojar/rafal-bojar-home-1.webp` | Rafal Bojar case — left pane image |
| `tools/tmp/zhenyary/playwright/images/rafal-bojar-home-2__eae5442f.webp` | WebP | 960×377 | 28 KB | `https://zhenyary.com/images/rafal-bojar/rafal-bojar-home-2.webp` | Rafal Bojar case — right pane image |
| `tools/tmp/zhenyary/playwright/images/icon_64x64__4d76bb87.png` | PNG | 64×64 | 2 KB | `https://zhenyary.com/_nuxt/icons/icon_64x64.783cc7.png` | Favicon |
| `tools/tmp/zhenyary/playwright/images/icon_512x512__059f11cc.png` | PNG | 512×512 | 22 KB | `https://zhenyary.com/_nuxt/icons/icon_512x512.783cc7.png` | Apple touch icon |

All hero portrait variants carry `alt="Zhenya Rynzhuk"`; case-study
images carry `alt="Cure"` and `alt="Rafal Bojar"` respectively. The
runtime `getSrcSet` mixin rewrites the URL based on `R.a.width()` and
the browser's WebP support, so the underlying sources also exist as
`@mx / @.5x / @1x` JPGs and `@.webp` (observed via the GET URL
rewrite logic — not downloaded into the dump).

### SVGs & icons

All SVGs are inline in the HTML. There is no `svgs/` folder in the
dump. Distinct glyphs observed:

| Glyph | viewBox | Notes |
| --- | --- | --- |
| Loader circle (red) | `0 0 40 40` | `<circle cx="20" cy="20" r="20">`, filled `#F93700` |
| Loader circle (pink) | `0 0 40 40` | `<circle cx="20" cy="20" r="20">`, filled `#F9DDDD` |
| Close (video overlay) | `0 0 28 28` | two diagonal paths, `stroke="#FFF"`, `stroke-width="1"` |
| Play (video overlay) | `0 0 19 25` | `<path d="M1 .5V24l17.5-12z">`, stroked white |
| Pause (video overlay) | `0 0 19 24` | two filled white rectangles |
| Cursor circle | `0 0 100 100` | `<circle cx="50" cy="50" r="49">`, stroked white, no fill |
| 8-point star | `0 0 48 48` | path with 16 segments, animates via `@keyframes star`, fill `#F93700` |
| Smile / contact face | `0 0 165 165` | white stroke circle + smile path, animates via `@keyframes smiley` |
| Arrow | `0 0 132 89` | chevron path, fills `#F93700` when `.arrow.red`, three of these cascade in the contact section |
| Turn-device icon | `0 0 230 230` | orange `#F93700` 8-point star + grey `#DADADA` ring, animates via `@keyframes turn-95182130` |
| Crosshair / `Z` mark | `0 0 20 21` | two diagonal paths in a 20×21 viewBox (the centered home logo) |

### Audio & video

N/A — no audio files. The site embeds case-study `.mp4` videos
(`epicurrence_*.mp4`, `honey_pot_*.mp4`, `aeditor_*.mp4`,
`glo_*.mp4`, `archieve_*.mp4`, `dennis_berti_*.mp4`,
`rafal_bojar_*.mp4`, `adobe_editorial_kit_*.mp4`, `adobe_xd_kit_*.mp4`)
that are referenced from the case-study data JSON but were not
captured by the static + dynamic passes (they live on the production
CDN behind `zhenyary.com/images/<case>/`). The home page does not
embed any video in its first paint.

### Other

- `tools/tmp/zhenyary/playwright/computed-styles.json` — 865-line
  Playwright dump of every visible element's computed style. Used as
  the primary source for the color and typography tables above.
- `tools/tmp/zhenyary/playwright/homepage.html` — fully-rendered
  Nuxt 2 DOM snapshot (126 KB / 61 lines, very dense inline `<style>`
  blocks).
- `tools/tmp/zhenyary/playwright/homepage.png` — 1440×900 hero
  viewport screenshot.
- `tools/tmp/zhenyary/playwright/homepage-fullpage.png` — 1440×5400
  full-page screenshot covering loader through contact.
- `tools/tmp/zhenyary/other/manifest.7dd67896__794d0f0f.json` — PWA
  manifest (`name: "zhenya"`, icons 64/512, maskable apple-touch).

---

## Motion & Interaction

### Principles

- **Continuous over discrete.** Most reveals are character-by-character
  or word-by-word. The hero H1 splits in two, each side racing to its
  resting position. The services list staggers each `<span class="inner">`
  with a 50-px translateX. This is editorial-motion language, not
  UI-motion language.
- **One easing everywhere.** The default site easing
  `cubic-bezier(.25,.46,.45,.94)` appears on virtually every CSS
  transition and Vue route transition.
- **Cursor as storyteller.** On non-touch devices, a custom 100-px
  stroked circle replaces the OS cursor and three-rate easing
  (`/10`, `/6`, `/20`) makes it feel like a hand dragging through
  honey. The hero portrait hides its hover-swaps until the cursor
  enters the image container.
- **Scroll = timeline.** The page body is `5400px` tall but
  rendered through 100-vh pinned articles; the scroll controller
  (`lerp(scrollTop, .07)`) interpolates per-frame so the user's
  scroll-wheel input becomes a slow cinematic camera move.

### Specific behaviors

- **Link hover (no-touch only):** underline pseudo-element animates
  `scaleX(0)` → `scale(1)` over `500ms`. The label caption below the
  nav link animates letter-spacing `0` → `0.07vw` over `400ms` with a
  `200ms` delay (so the underline starts first, then the label fans out).
- **Theme toggle (`In red` / `In Light`):** the underline slides in
  from `translateX(-100%)` or `translateX(100%)` over `700ms`. The
  text color crossfades over `300ms`.
- **Service reveal:** per-character `translateX(50px) → 0`,
  `opacity: 0 → 1`, with no explicit stagger but the per-letter
  React-like transition produces a wave effect when the row becomes
  `.ready`.
- **Works case-study parallax:** the `.letter-container` element
  pins at the top of its 100-vh slot and `translate3d(0, -720px, 0)`
  is set by JS as the user scrolls; the `.img` element starts at
  `scale3d(1.5, 1.5, 1)` and eases toward `scale3d(1.0, 1.0, 1)`
  (interpolated in real time by the scroll controller).
- **Contact reveal:** the four `.line` rows enter with
  `translateY(100px) scaleY(1.5); opacity: 0` over `500ms`; the three
  arrows inside line 3 cascade at `0ms / 200ms / 300ms`.
- **Page transition (Nuxt default):** crossfade
  `opacity:1→0` then `0→1` with `mode:"out-in"`. No slide, no scroll
  restore animation.

### Reduced motion

Not explicitly handled in the dumped stylesheets — no
`@media (prefers-reduced-motion: reduce)` rules were observed. The
infinite ambient animations (`@keyframes star`, `@keyframes smiley`,
`@keyframes turn-95182130`) and the hero H1 reveal will keep playing
even when the user prefers reduced motion. Note for future work: this
is a regression — adding a `prefers-reduced-motion` block that kills
the ambient loops and the H1 split-screen reveal (replace with a
single fade) is recommended.

### Responsive motion

- At `≤ 1050px` the desktop H1 hero is replaced with a 10-vw single
  line that no longer split-reveals. The letter markers (C / R) and
  dot-container in the works section are hidden.
- At `≤ 600px` the nav is hidden entirely and replaced with a vertical
  mobile overlay; the services list drops to `12vw` stacked words with
  static `30×30` 8-point stars between them; the worksLink font
  shrinks to `12vw` with a static `2px` underline.

---

## Content & Voice

- **Tone:** first-person, restrained, art-direction vocabulary. The
  site paraphrases Zhenya's bio as: an art director with an
  architectural background who likes "everything that has to do with
  product & visual design, mobile & web projects, branding,
  typography, and animations."
- **Voice notes from the on-page JSON:** collaborations are listed as
  Google, Adobe, Nike, ESPN, GoDaddy, UN, Lime, MixPanel, Bloom,
  Johnson & Johnson. Awards bucket is `awwwards:[]` /
  `FWA:[]` — empty arrays, never claimed.
- **Sentence length:** medium. The bio is one ~6-line sentence
  broken with `<br>` tags. CTA lines are short imperatives.
- **Capitalization:** Sentence case in headings (`Let's make something
  great!`, `Check full case +`). UPPERCASE for nav labels
  (`IN RED / IN LIGHT`) and small caption tags (`My main services`).
- **Punctuation:** em-dash style minimal; uses curly apostrophes
  (`'`) in `I'm` and `Let's`; uses `+` as a separator for "Check full
  case +".
- **CTA vocabulary:** four CTAs — `Play Showreel`, `Check full case +`,
  `All cases here`, `hey@zhenyary.com`. No "Hire me", no "Contact us",
  no "Get in touch" — the site speaks through a personal email
  address rather than a form.

---

## Information Architecture

Top-level routes observed in the homepage HTML and the Nuxt data
bundle:

- `/` — marketing homepage (the 5400-px single-page reel).
- `/work` — index of all case studies (linked from the `All cases
  here` WorksLink; uses the same typography pattern).
- `/work/cure` — full Cure case study (referenced from the works strip).
- `/work/rafal-bojar` — full Rafal Bojar case study (referenced from
  the works strip).
- `/workflow` — about / process page (referenced in the nav for the
  `workflow` route).
- `/about` — about page (referenced in the nav).
- `/contact` — alternate contact route (the homepage already has the
  contact block at the bottom; the standalone page exists for sharing).
- `mailto:hey@zhenyary.com` — primary contact action.
- `https://dribbble.com/zhenyary`,
  `https://www.behance.net/Zhenyary`,
  `https://twitter.com/zhenyary` — outbound social links.

Internal case-study slugs observed in the data JSON (case-study pages
not captured by the dump, but the slug list is): `limnia`,
`dennis-berti`, `epicurrence`, `m-shkret`, `adobe-kit`, `cure`,
`aeditor`, `rafal-bojar`, `il-makiage`, `honey-pot`, `adobe-xd`,
`uruoi`, `allure`, `huckleberry`, `glo`, `espn`, `archieve`.

The case-study data JSON also encodes a structured block content
model with types `a` (image / video), `b` (image full-bleed),
`c` (comparison), `d` (text+image), `g` (gallery), `k` (key-fact
callout), `q` (long-form quote with header + paragraphs), `E`
(image+text top-anchor), plus video and image top-anchor variants.
Each block has a `background` color drawn from a tight palette
(`#1A1413`, `#6B6E64`, `#A5A29D`, `#B4AAA7`, `#9D9CA2`, `#474747`,
`#ECE5E0`, `#FFFFFF`, `#E4E3E6`, `#D4D1CB`, `#DBD5C9`, `#CECAC7`,
`#D8D8D8`). Some blocks also carry a `shadow:` PNG reference (e.g.
`honey-pot/shadow-honey.png`, `rafal-bojar/shadow-rafal.png`),
indicating that case pages can render a soft drop-shadow PNG rather
than a CSS box-shadow.

---

## Accessibility

- **Color contrast:** the default body text `#191919` on
  `#DBD5C9` measures roughly 13.5:1 — well above WCAG AAA (7:1). The
  white `#FFFFFF` hero H1 on the underlying `#000000`/photo is 21:1
  on the loader veil and remains high-contrast against the dark photo
  base. The red `#F93700` against `#DBD5C9` measures 4.0:1 — passes AA
  for large text only; the social-link hover state (`#F93700` on
  `#DBD5C9`) falls below 4.5:1 for body sizes and should be reserved
  for ≥18 pt.
- **Focus indicators:** no `:focus` or `:focus-visible` rules observed
  in the dumped stylesheets. The site relies on the browser default
  focus ring, which is suppressed for `.no-touch` users on macOS Safari
  by default. This is a regression — the site is keyboard-fragile.
- **Keyboard:** the nav links are real `<a>` elements (with
  `nuxt-link` semantics) and the social links are `<a target="_blank"
  rel="noopener">`. The footer buttons (`In red` / `In Light`) are
  real `<button>` elements but have no accessible name (the inner
  text content serves as the name). The video overlay's close button
  has `aria-label="close"` and the play button has
  `aria-label="play video"`.
- **Screen reader landmarks:** `<main>` is the only semantic landmark
  used. There is no `<header>`, `<nav>`-as-landmark, or `<footer>`-as-landmark
  at the page level — the `<nav>` element is present in markup but
  lacks the explicit `aria-label` that would help screen-reader
  navigation.
- **Motion:** no `prefers-reduced-motion` handling observed (see Motion
  section).
- **Alt text:** observed conventions — the hero portrait variants
  carry `alt="Zhenya Rynzhuk"`, case-study images carry `alt="Cure"`
  / `alt="Rafal Bojar"`. The `Loader .bg` and `Loader .circle` SVGs
  have no accessible name (decorative — acceptable). The contact
  smiley SVG has no `role="img"` or `aria-label`.
- **Touch:** the entire hero parallax, custom cursor, and hover-image
  stack are gated behind `.no-touch` (i.e. `window.matchMedia('(hover:
  hover) and (pointer: fine)')` via Nuxt's `isDevice` mixin). On
  touch devices the page falls back to the static front photo and a
  vertical mobile-nav overlay.

---

## Sources

Every URL opened or referenced while writing this spec.

- Homepage (entry) — https://zhenyary.com/
- Homepage HTML (rendered) — `playwright://playwright/homepage.html`
  (in `tools/tmp/zhenyary/playwright/`)
- Homepage screenshots — `playwright://playwright/homepage.png`,
  `playwright://playwright/homepage-fullpage.png`
- Case study links — `https://zhenyary.com/work/cure`,
  `https://zhenyary.com/work/rafal-bojar`
- About / workflow / contact routes — `/about`, `/workflow`, `/contact`
- Socials — `https://dribbble.com/zhenyary`,
  `https://www.behance.net/Zhenyary`, `https://twitter.com/zhenyary`
- Developer credit — `https://www.romainavalle.dev`
- Analytics scripts — `https://www.google-analytics.com/analytics.js`,
  `https://www.googletagmanager.com/gtag/js?id=G-9J89X64R89`,
  `https://static.cloudflareinsights.com/beacon.min.js/…`
- PWA manifest — `https://zhenyary.com/_nuxt/manifest.7dd67896.json`
- Email contact — `mailto:hey@zhenyary.com`
- Share images — `https://www.zhenyary.com/images/share.jpg`,
  `https://www.zhenyary.com/images/share-twitter.jpg`

---

## Changelog

- 2026-06-20 — Initial draft by design.md agent. Spec extracted from
  the 2026-06-19 Phase-1 dump (`tools/tmp/zhenyary/manifest.json`,
  84 files, 5.0 MB).

### Coverage notes for the next pass

The Phase-1 dump captured only the homepage render and a handful of
asset variants. The following sections were **not** fully covered and
should be revisited with a deeper crawl:

- The 17 case-study pages (`/work/<slug>`) referenced in the data
  JSON were not opened; their block layouts (`a`, `b`, `c`, `d`, `g`,
  `k`, `q`, `E` types) and the per-block background palette above
  were inferred from the data JSON, not observed live.
- The `/about`, `/workflow`, and `/contact` routes were not crawled;
  their visual treatment is not described here.
- The `GetSrcSet` URL-rewrite logic (`@mx / @.5x / @1x` JPG and
  `@.webp`) is referenced in the bundle but the alternate-resolution
  assets were not downloaded into the dump.
- The `<canvas data-v-4b93e0ca>` element in the page is created by
  the WebGL background plane component (the loader circles' 3-D
  context); its WebGL source was not extracted from the minified
  bundle.
- The full analytics tag-manager payload (`js__b007c10a`) was not
  diffed against the production GTM container; treat the GA + GA4
  IDs above as observed on the live homepage.
