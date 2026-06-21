# Immersive Garden — design.md

> A structured design specification of **https://immersive-g.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** design.md-gen batch
> **Source dump:** `tools/tmp/immersive-g/` (gitignored)

---

## Overview

Immersive Garden is a French interactive / WebGL studio whose own marketing
site behaves like a portfolio reel: a long single-page experience that mixes
a fixed full-bleed WebGL canvas, looping autoplay MP4 case tiles, scrollable
project blocks, and a footer that doubles as a project directory. The
homepage is a scrollable reel of past work; each tile links to a dedicated
case-study page. Studio info (`/the-studio/*`) is a separate tree.

The visual language is monochrome and editorial — a single warm-grey
background, near-black type, a serif display face paired with a neutral
sans. The motion language is dominated by GSAP/Three.js: parallax camera
moves, eased-in reveal of serif copy, video crossfades, and a custom
trailing cursor.

**Category:** Studio portfolio / Marketing
**Primary surface observed:** Homepage (`/`) and route list for the rest of
the site; case-study pages (`/projects/<slug>`) and studio pages
(`/the-studio/*`) are reachable but not opened in the dump.
**Tone:** Confident, restrained, premium; one "Innovative digital experiences
studio" tagline, set in the same serif as the rest of the body.
**Framework detected:** Nuxt 3.10.3 (Vue 3 SPA + Vite build) — confirmed by
`globalName:"nuxt",versions:{nuxt:"3.10.3"}` in `entry.nmlBdY4S.js`. The
runtime also reveals itself via `<div id="__nuxt">` and per-component
`data-v-XXXX` scoped-style attribute suffixes.

---

## Visual Language

### Color

The entire site is essentially two colors plus white: a warm light grey for
the page surface, near-black for type, and a darker (true-black) wash for
the footer's WebGL background. A single mid-grey accent is reserved for
fast-scroll-mode UI.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Page background | `--bg-base` | `#E8E8E8` | `rgb(232, 232, 232)`; set on `.app` and on `.introLoader__bg`. |
| Text (primary) | `--text-primary` | `#030303` | `rgb(3, 3, 3)`; used for headings, body, buttons, logo glyphs. |
| Text (muted, on light) | `--text-muted` | `rgba(0,0,0,0.5)` | Achieved with `opacity:0.5` on `.footer__address`; no dedicated token. |
| Text (on dark) | `--text-inverse` | `#E8E8E8` | Recolored by `.footer.darkBg { color:#e8e8e8 }`. |
| Dark surface | `--bg-dark` | `#030303` | `.introLoader__bg` + `.footer__webgl { background:#030303 }`. |
| Accent / fast mode | `--accent-fast` | `#A6A6A6` | `rgb(166, 166, 166)`; used only by `.scrollCursor .dots__fast .dots { background:#a6a6a6 }`. |
| Pure white | `--white` | `#FFFFFF` | SVG `stop-color` and intro overlay; never a page bg. |
| Sound widget color | `--sound-color` | `#000000` (light) / `#E8E8E8` (dark) | Custom property on `.sound`; flips with `.sound--dark-bg`. |
| Cursor color | `--cursor-color` | `#030303` (light) / `#E8E8E8` (dark) | Custom property on `.cursor`; flips with `.cursor.isDark`. |

No semantic success / warning / error palette is exposed — the site has no
form-validation surfaces that would need them (the newsletter form is the
only input).

### Typography

Two families total, both self-hosted. The serif (PSTimes) carries every
display and headline surface; the sans (Helvetica Neue family) carries
utilities, buttons, micro-copy, the cursor label, and the footer address.
The contrast is intentional and very stable across the site.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (hero H1) | `PSTimes, serif` | 400 | `3.0555555556vw` → 58.52px ≥1440 → 34px ≤768 | `1.1` | `normal` |
| Project CTA (footer) | `PSTimes, serif` | 400 | `3.0555555556vw` → 58.52px → 34px | `1.1` | `normal` |
| Section text (large) | `PSTimes, serif` | 400 | `3.0555555556vw` → 58.52px → 34px | `1.1` | `normal` |
| Section text (default) | `PSTimes, serif` | 400 | `1.9444444444vw` → 37.24px → 23px | `1.2` | `normal` |
| Section label (small) | `PSTimes, serif` | 400 | `1.5277777778vw` → 29.26px → 20px | `1.4` | `normal` |
| IntroLoader / progress | `PSTimes, serif` | 400 | `1.9444444444vw` → 37.24px → 28px | `1.2` | `normal` |
| Body / button / utility | `HelveticaNeueRegular, sans-serif` | 400 | `.9722222222vw` → 14px (clamped) | `1.1` | `normal` |
| Footer address | `HelveticaNeueRegular, sans-serif` | 400 | `.9722222222vw` → 14px | `1.1` | `normal` |
| Cursor label | `HelveticaNeueRegular, sans-serif` | 400 | `.8333333333vw` → 12px | `1.1` | `normal` |
| Optional display light | `HelveticaNeueLight, sans-serif` | 300 | (declarations only — not observed in computed styles) | `1.1` | `normal` |

Type stack never collapses to a system fallback. The face declared in
`@font-face` is referenced by its full custom name (e.g. `PSTimes`,
`HelveticaNeueRegular`), not by `font-family`-stack. There are **no**
generic fallbacks in the stylesheets — the only generic `sans-serif` /
`serif` / `monospace` strings come from the bundled `normalize.css`.

Sizes scale with `vw` and clamp at three breakpoints (1915px, 1440px, 768px,
432px), with the vw value kicking in for everything in between — there is no
`clamp()` helper; each rule simply redeclares the size in `px` for each
breakpoint.

### Spacing & radius

- **Base unit:** ~16px (page padding) → vw-based section gaps (3.33vw row
  gap inside `.gridWrapper.rowGap`, 11.11vw project gap).
- **Vertical rhythm:** Section padding uses `11.111vw` (~213px @ 1920,
  ~213px @ 1440, ~48px @ 432). Hero section gets `padding-bottom:12.5vw`
  → `239.4px` → `54px`.
- **Page padding (`.gridWrapper`):** `0px 16px` (16px gutter all sides).
- **Grid:** `grid-template-columns: 1fr ×12` with `grid-column-gap: 16px`.
- **Radii:** The system is almost entirely square — `0px` everywhere
  except the cursor dot, sound-toggle dot, and scroll-cursor dot
  (`border-radius: 100%`). The single non-zero curve is the footer's
  text-mode input (`-webkit-autofill` styling has implicit rounded box
  from the browser, not declared).
- **Shadows:** None declared. Elevation is implied by the WebGL canvas
  sitting in the footer's true-black panel.

### Iconography

- **Style:** None. The site carries no icon library. The only icon-like
  marks are the inline 170×22 wordmark SVG, two `.lottie-animation-container`
  placeholders (one black, one white, stacked for color-invert on hover)
  inside the "See all projects" button, and the Lottie-rendered "x" mark
  on the All-Projects toggle.
- **Default size:** 25px × 45px (`.wrapper__icon`); the Lottie animation
  fills that container.
- **Logo:** Inline SVG, 170×22 viewBox; rendered twice (intro secondary,
  intro main) with a moving gradient mask animating the reveal.

---

## Layout & Grid

- **Max content width:** None — content sits in a 12-column grid that
  fills the viewport. There is no centered `max-width` container.
- **Page gutter:** `padding: 0 16px` on `.gridWrapper`.
- **Grid:** 12 equal columns, `grid-column-gap: 16px`. Media blocks address
  columns by composite class: `.width__N` (`grid-column-end: span N`) and
  `.position__N` (`grid-column-start: N`), giving authors a 12-cell canvas.
- **Breakpoints observed:** `1915.2px` (xxl), `1440px` (xl), `768px` (md),
  `432px` (sm); plus component-specific breakpoints at `1170px`, `1113px`,
  `891px`, `785px`, `648px`, `560px`, and `0px`. Mobile portrait:
  `max-height:960px and max-width:640px` / landscape `max-width:960 and
  max-height:640`.
- **Vertical rhythm:** `8px` baseline implied by the
  `.antifloat { zoom:1 }` + `clearfix` rules in `normalize.css`; the
  actual spacing is vw-driven.

The home layout, in scroll order: a fixed full-bleed Three.js canvas
(`.webglApp`) behind a vertical stack of blocks. The first visible block
is a centered H1 in the serif; below it, a 12-column mosaic of project
media tiles (videos and images) interleaved with section-label text
blocks ("Our approach", "Our mission") and a fixed "See all projects"
button. The footer is a 100dvh full-bleed black WebGL panel that contains
the "See all projects" CTA in 58px PSTimes, the address (Paris 75010),
the email (inquiries@immersive-g.com), the newsletter pill, and the
social row (X, Instagram, LinkedIn).

---

## Components

### IntroLoader (full-screen preloader)
- **Variants:** `.main` (root intro, fixed, z-index 1010) and `.secondary`
  (rendered twice in the DOM — once near the page transition, once at the
  footer level).
- **Anatomy:** `.introLoader__bg` (full-bleed black) → `.gridWrapper` →
  `.introLoader__logo` (the 170×22 wordmark) on the left →
  `.introLoader__progressWrapper` in the middle (PSTimes progress label,
  an under-line progress bar) → `.introLoader__baseline` ("Innovative
  digital experiences studio", word-by-word animated) →
  `.introLoader__scrollDown` on the right (Helvetica 14px, hidden until
  ready).
- **States:** `loading`, `lockScroll`, `hidden`, `darkBg` (inverts text
  to grey on black). The body gets `.lockScroll` while the loader is
  active.
- **Animation:** GSAP timelines drive the logo mask (a 4-stop linear
  gradient sweeping across the wordmark via `mask` rect translation),
  per-word baseline fade, opacity fade-out, and (during fast route
  changes) a 1000× timeScale for the `isFirstRoute` transition. See
  `IntroLoader.jKs7xZ3q.css:25` and `IntroLoader.D9qttrK0.js:11500+`.

### Hero block
- **Variants:** `textAlign` of `left` (default), `center`, `centerLeft`.
- **Anatomy:** `<h1 class="hero__text1" data-webgl-title>` is the only
  on-page text element. A scroll-down line ("Scroll down") sits below in
  14px Helvetica, opacity-animated to 0 by default. A secondary
  `.hero__cta` anchor is optional.
- **Sizing:** `height: 100vh` and pinned to flex-end, `padding-bottom:
  12.5vw` (desktops) / `54px` (mobile). The block uses `data-engine=
  "three.js r151"` on its companion canvas.
- **State:** `domOnly` falls back to non-WebGL rendering (used for
  debugging / touch fallback); `hasFitHeight` lets the block shrink to
  fit its content rather than 100vh.

### Media block (`.mediaBlock`)
- **Variants:** `hasText` (with copy overlay), `textOnly` (no media, just
  the description card), `hasBackground` (color/image background with
  20vh vertical padding), `split`, `hasTouch`.
- **Anatomy:** `.mediaBlock__image` (a `<img>` whose `src` is set
  lazily from `data-src` — the asset URL), plus optional
  `.mediaBlock__image.text` overlay and `.text__mobileLink` (a hidden
  full-bleed link that becomes the touch target on mobile).
- **Sizing:** Width set by `.width__2…10` (column span); position by
  `.position__1…12`; vertical offset by `.offsetY__negative[_small]`,
  `.offsetY__positive[_small]`, `.offsetY__center`,
  `.offsetY__center_negative`, `.offsetY__center_positive`. Horizontal
  bleed by `.offsetX__left` / `offsetX__right` (extends 16px past column).
- **Aspect:** `portrait` variant overrides default landscape cropping for
  1080×1440 reels.

### Project block (`.projectBlock`)
- **Variants:** Each `section.projectBlock` carries `data-name`,
  `data-uri`, `slug`, `projectspecs` ("Design, Tech, E-shop, NFT, 3D"
  etc.).
- **Anatomy:** Stack of three `.mediaBlock`s — primary reel (landscape
  1920×1080), then a text-only "noMedia" copy card, then a portrait
  1080×1440 reel. The `projectspecs` strings double as
  content-tagging; the visible category ("Web Experience", "E-Shop", etc.)
  is the third `<p class="type">` of the mobile link.
- **Spacing:** Vertical gap `11.111vw` between projects, dropping to
  `212.8px` ≥1440 and `48px` ≤432.
- **State:** `debugDom` (dev only).

### Text block (`.textBlock`)
- **Variants:** `align--center` (the homepage section labels are all
  centered).
- **Anatomy:** `.textBlock__text.textBlock__text--1` is the small
  PSTimes eyebrow ("Our approach", "Our mission", sized 1.527vw);
  `.textBlock__text--2` is the large body statement (3.055vw), broken
  into 3–4 lines via `<div>` siblings.
- **Spacing:** `min-height: 100vh` (so the text anchors to the center of
  a viewport scroll position); `padding-block: 11.111vw`.
- **Motion:** Each line `<div>` is wrapped in a per-letter `<div>` with
  inline-block; GSAP animates the inline `opacity` 0→1 + translateY
  on enter.

### Underlined button (`.underlinedButton`)
- **Variants:** Default (link-style), `.smallPadding`, `.largeFooterBg`.
- **Anatomy:** A `<span class="underlinedButton__text">` and a sibling
  `<span class="underlinedButton__line">` — a 1px solid bar pinned to
  the bottom of the element, `transform-origin: right center`,
  `transform: scaleX(1)`, animates to `scaleX(0)` on hover.
- **Use:** Footer "See all projects (51)" link; the count "(51)" is
  rendered as the `data-after` attribute and shown via the `::after`
  pseudo-element in 1.111vw PSTimes, top: 10%, left: 107%.

### Basic button (`.basicButton`)
- **Variants:** Default (black), `.color--grey` (`#E8E8E8`), `.selected`,
  `.over`, `.disabled`, `.noOver`.
- **Anatomy:** 14px Helvetica, padded 20px (negative margin `-20px` to
  extend the hit area), no background, no border.
- **State:** Hover/active/selected → `opacity: 0.6` over 300ms
  `cubic-bezier(.165,.84,.44,1)`. On touch the same opacity change
  applies on `:active`.

### All-projects button (`.projectsBttn`)
- **Variants:** Default (visible when on the homepage viewport, hidden
  inside project pages), `.hidden`.
- **Anatomy:** A 14px Helvetica label "See all projects" + a 25×45px
  wrapper containing two stacked Lottie animations (`.icon--black` /
  `.icon--white`); the wrapper is positioned with a `top:calc(-22.5px +
  .5em)` so the Lottie mark optically aligns with the text baseline.
- **State:** Hidden variants fade out over 1.5s linear, becoming
  `visibility:hidden` after a 0.5s delay.

### Custom cursor (`.cursor`)
- **Anatomy:** Two fixed-position 5×5 px `__follow` and `__ease`
  followers (lerp-follower) + a `__text` overlay (12px Helvetica,
  35px left, 15px top, e.g. "Click to enable sound").
- **State:** `.hidden` (opacity 0), `.isLowOpacity` (opacity 0.3),
  `.isDark` (inverts `--cursor-color` to grey on dark sections).
- **Behavior:** Hidden on touch devices (`.isTouch` class).

### Scroll cursor (`.scrollCursor`)
- **Anatomy:** A 120-particle dot field. Three default dots
  (`.dot__default`) reflect "current page progress" — they ride along
  the y-axis. A second field of 120 `.dots__fast` particles animates
  vertically with `mix` value 0→1 in fast-scroll mode.
- **Sizing:** Each dot is `3px × 3px` `#030303` `border-radius: 100%`,
  positioned absolutely inside a 30px container.
- **State:** `.dots__fast` `background: #A6A6A6`; `.dot__default--hide`
  hides the three main dots when entering fast mode.

### Sound toggle (`.soundWrapper`)
- **Anatomy:** A 60×60 fixed canvas (`.circles`, Three.js 2D context)
  with a 30px center dot (`.dot__child`).
- **State:** `.sound--muted` swaps the visible "On"/"Off" labels; the
  visible text always reads the same line, with the inactive copy at
  `opacity:0`. `.sound--dark-bg` flips `--sound-color` to grey.

### Footer (`.footer`)
- **Variants:** `darkBg` (default for the WebGL footer),
  `onlyDom` (no WebGL fallback for low-power devices), `isListingProjects`
  (no top padding when used as the projects index).
- **Anatomy:** `.footer__webgl` (true-black full-bleed, column 1/13) →
  `.footer__projects` (100dvh) → `.footer__projectsCtaWrapper` →
  `<a class="underlinedButton underlinedButton--largeFooterBg">` →
  `.footer__contacts` (100dvh) → `.footer__email` (centered) +
  `.footer__address` (bottom-center) + `.footer__networks` (X / Instagram
  / LinkedIn) + `.footer__newsletterOpen` (.basicButton "Newsletter" pill
  bottom-left).

---

## JavaScript & Libraries

The build is Vite + Vue 3 (Nuxt 3). All heavy libraries are bundled
in-tree (no CDN). Detection source is the inlined version string inside
each chunk.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Nuxt | 3.10.3 | `globalName:"nuxt",versions:{nuxt:"3.10.3"}` in `entry.nmlBdY4S.js` | App router, SSR + SSG, hydration via `useState` payload. |
| Vue | 3.x | `m.vueApp.version` exposed via Nuxt | Composition API throughout. |
| Vite | (bundled) | Chunk naming `entry.XXXX.js` + `default.XXXX.js` | Build uses content-hashed filenames. |
| Three.js | r151 | `<canvas data-engine="three.js r151">` + `REVISION="151"` in `entry.nmlBdY4S.js` | Powers the home WebGL canvas, the footer WebGL, and the in-browser loader texture. |
| `THREE.GLTFLoader` | r151 | 17 refs in `Preloader.CCgyJU7b.js` | Loads the `.glb` case-study assets. |
| `THREE.KTX2Loader` | r151 | 7 refs in `Preloader.CCgyJU7b.js` | Basis-texture compression for the GLBs. |
| `THREE.DRACOLoader` | r151 | 3 refs in `Preloader.CCgyJU7b.js` | Mesh compression. |
| `THREE.EXRLoader` | r151 | 2 refs in `Preloader.CCgyJU7b.js` | HDR envmap support. |
| GSAP | 3.12.5 | `Tween.version=Timeline.version=gsap$1.version="3.12.5"` in `entry.nmlBdY4S.js` | Drives all custom timelines (intro, page transitions, scroll-driven reveals, text-per-letter animations). |
| Lottie Web (`lottie-web`) | 5.12.2 | `lottie.version="5.12.2"` in `entry.nmlBdY4S.js` | Renders the small "x"/arrow mark on the All-projects toggle. |
| Lenis | v1.x (loaded as `lenis` namespace) | `Lenis` class in `entry.nmlBdY4S.js` | Smooth-scroll, `lerp:.05` desktop / `1` mobile, `syncTouch:true`. |
| Tweakpane | 3.1.10 | `Tweakpane 3.1.10` banner in `entry.nmlBdY4S.js` | Dev-only debug panel; gated behind `._isDevelopment`; adds `tp-*` classes to the body. |
| Firebase (compat) | 10.8.0 | `@firebase/...` names + `version$2="10.8.0"` in `entry.nmlBdY4S.js` | Used by the newsletter form (`/api` proxy likely). |
| `cremap` | local utility | imported by `HomePage`, `HeroBlock`, `BasicButton` | Tiny color-remap helper. |
| `mergeDeep` | local utility | imported by `HeroBlock` | Object-merge for page-config merging. |
| `proto.mddEFhu4.js` | local utility | imported by `Preloader` | Likely a `gsap` plugin namespace. |
| `asyncData` | Nuxt helper | imported by `Page` and `HeroBlock` | Standard Nuxt SSR data-fetching. |

A few other notable detection observations from the source: `Lenis`
exports a class with `className` getter that adds `lenis-stopped`,
`lenis-locked`, `lenis-scrolling`, `lenis-smooth` classes to the
rootElement — the CSS in `entry.CEhA1U0S.css` styles each of these.
There is **no Tailwind, no Bootstrap, no jQuery, no GSAP-ScrollTrigger**;
scroll-driven work is done with hand-written Lenis `scrollSmooth` event
listeners and IntersectionObservers.

---

## Animations (Catalog)

This site is animation-heavy but has **zero `@keyframes` rules** in any
of the eight stylesheets — all motion is JS-driven (GSAP, Three.js,
Lenis, Lottie). The CSS transitions observed are tabulated below for
reference; the JS animations are detailed in the next table.

### CSS transitions (not @keyframes)

| Selector | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `.introLoader__wrapper` | `opacity` | 0.3s | `cubic-bezier(.445,.05,.55,.95)` | `.introLoader.hidden` |
| `.introLoader__wrapper` | `opacity` | 0.6s | same | default |
| `.cursor` | `opacity` | 0.5s | `cubic-bezier(.445,.05,.55,.95)` | `.hidden` / `.isLowOpacity` |
| `.dot__child` (sound) | `background` | 0.5s | `ease` | `--sound-color` flip |
| `.footer__projects` | `opacity` | 0.5s | `ease` | `.hidden` |
| `.footer__projectsCta` | `color` | 0.5s | `ease` | dark mode |
| `.footer__email > *` | `opacity, color` | 0.5s | `ease` | hover/select |
| `.basicButton` | `opacity, color` | 0.3s | `cubic-bezier(.165,.84,.44,1)` | hover/active |
| `.page-default-transition-enter-active` | `opacity` | 0.7s | `cubic-bezier(.445,.05,.55,.95)` | Nuxt `<NuxtPage>` |
| `.page-default-transition-appear-active` | same | 0.7s | same | first mount |
| `.headerBlock` | `opacity` | 1.5s | `linear` (delay 1s) | `hidden` (after 1s) |
| `.headerBlock__menu` | `all` | 0.4s | `cubic-bezier(.77,0,.175,1)` | open/close |
| `.projectsBttnWrapper` | `opacity` | 1.5s | `linear` | `hidden` |
| `.mediaBlock` | `opacity` | 1.9s | `ease-in-out` | block enter |
| `.scrollCursor .dots .dot` | `opacity` | 0.25s | `ease` | `--active` |
| `.scrollCursor .dots .dot--active` | `opacity` | 1s | `ease` | scroll velocity |
| `.underlinedButton__line` | `transform, background` | 0s (snaps) | linear | hover |
| `.introLoader.main` | `transform` (parallax) | 0s | — | `scroll` (lerp .1) |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | IntroLoader main timeline (`l1()`) | Page mount, after assets ready | `progressLoad` value 0→1, `loaderLine.fadeAnimation(3.5s, "quart.inOut")`, logo mask `x:-66%→0` (2.5s, `quart.out`), wrapper opacity 0 (1.2s, `sine.inOut`). Sets `isFirstRoute` timeScale = 1e3 (compressed for HMR). |
| GSAP | IntroLoader hide (`s1()`) | After first route enter | Logo opacity 1→0 (0.5s), `dots` stagger 0.1s × 1s each, then `.introLoader__wrapper` opacity 1→0. |
| GSAP | HeroBlock `AnimatedParagraph` enter | Intersection (per-letter) | Splits content into per-character `<div style="position:relative;display:inline-block">`; staggered opacity 0→1. |
| GSAP | Page transitions | Nuxt `<NuxtPage>` | `enter` and `leave` timelines run per route; 0.7s cross-fade. |
| GSAP | ScrollCursor dot field | Lenis `scrollSmooth` + mousemove | Lerps a 3-dot field's Y by `scrollPct * 50` and a 120-particle field by `scrollPct * 50 * 40`; updates each frame at `requestAnimationFrame` (`g.ticker`). Mix 0→1 in fast-mode over 1s `power1.inOut`. |
| GSAP | HomePage enter | `onMounted` | `initViewDom('home', page, ...)`, `showView('home')` timeline, `manualEventTrigger()` call. |
| GSAP | HomePage leave | Route change | `hideView('home')` timeline; on complete, `R()` (clean-up). |
| Lenis | Smooth scroll | Body wheel + touch | `lerp:.05` desktop, `lerp:1` mobile; `syncTouch:true`; wheel/touch multipliers per `ScrollManager` config. Emits `scrollSmooth` event. |
| Lenis | Scroll parallax for IntroLoader | `ScrollManager` frame loop | When not loading: `q.value.style.transform = translateY(${scrollY*0.2}px)` on the logo, baseline, and scroll-down. |
| Three.js | Home WebGL canvas | Component mount | `<canvas data-engine="three.js r151">`; the `viewManager.active._components.home` exposes `_fastScrollBarProgress` and `_fastScrollProgress` consumed by the scroll cursor. |
| Three.js | Footer WebGL canvas | Scroll into footer viewport | True-black 100dvh panel; same loader pipeline. |
| Lottie | All-projects arrow | `projectsBttn` hover/active | Two stacked Lottie animations (`.icon--black` / `.icon--white`); CSS opacity crossfade on parent. |
| IntersectionObserver | Block enter | `.projectBlock` / `.mediaBlock` scrolling into view | Adds 1.9s opacity transition; on touch devices swaps to direct pointer-events. |
| ResizeObserver | Custom cursor + scroll cursor | `document.body` resize + active target resize | Bounding-rect recompute, debounced 50ms by default. |

### Page transitions

- `<NuxtPage>` defaults to a 0.7s crossfade (`cubic-bezier(.445,.05,.55,.95)`)
  via the `page-default-transition` keyframes. First mount is identical
  but only used when `show-now` is on the body. The leave phase is
  instantaneous (0s linear) so the new page can fade in on top.

---

## Assets

### 3D models

Two `.glb` files are referenced from the homepage DOM, both hosted on the
studio's DigitalOcean Spaces CDN. No `.glb` was captured by the static
pass (only references), and the `models/` folder in the dump is empty.

| Reference (from HTML) | Format | Source URL | Where used |
| --- | --- | --- | --- |
| `CARTIER_EOY_v3_79b0f89b22.glb` | glTF binary | `https://ig-medias-prod.ams3.digitaloceanspaces.com/CARTIER_EOY_v3_79b0f89b22.glb` | Cartier End of Year 23 — `.mediaBlock__image.width__3.position__3` in the project block. |
| `CARTIER_WW_24_v3_974a09cb82.glb` | glTF binary | `https://ig-medias-prod.ams3.digitaloceanspaces.com/CARTIER_WW_24_v3_974a09cb82.glb` | Cartier Watches and Wonders 24 — `.mediaBlock__image.width__4.position__3` in the project block. |

Decoded by `THREE.GLTFLoader` + `THREE.KTX2Loader` + `THREE.DRACOLoader`,
suggesting the assets are compressed with both mesh (Draco) and texture
(KTX2/Basis) compression. HDR environment lighting is supported via
`THREE.EXRLoader`.

### Fonts

All three faces are self-hosted from `/assets/` on the same origin. Each
ships as a `woff` and a `woff2`. The `woff` URL is the legacy fallback
declared second in the `@font-face` `src` list.

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| `PSTimes` | 400 | woff + woff2 | `tools/tmp/immersive-g/fonts/PSTimes-Regular.{BKbmUxeR.woff,hY69LrJ0.woff2}` → `https://immersive-g.com/assets/PSTimes-Regular.{woff,woff2}` | yes |
| `HelveticaNeueRegular` | 400 | woff + woff2 | `tools/tmp/immersive-g/fonts/HelveticaNeue-Regular.{Cby7U49T.woff,XE2tdPOO.woff2}` → `https://immersive-g.com/assets/HelveticaNeue-Regular.{woff,woff2}` | yes |
| `HelveticaNeueLight` | 300 | woff + woff2 | `tools/tmp/immersive-g/fonts/HelveticaNeue-Light.{Cws8QGQI.woff,DlSTh50s.woff2}` → `https://immersive-g.com/assets/HelveticaNeue-Light.{woff,woff2}` | yes (declared in `@font-face`; not seen used in computed styles) |

`@font-face` uses `font-display: swap`. No web-font service is used.

### Images

Only the social-share image and the favicon set were captured by the
static pass. The rest of the imagery on the live site is loaded from
`ig-medias-prod.ams3.digitaloceanspaces.com` and is MP4/JPG/GLB
(see Audio & video below), not raster.

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/immersive-g/images/immersive-garden__9cfe92a8.jpg` | JPEG | 1440×810 | 27,528 B | `https://immersive-g.com/images/share/immersive-garden.jpg` | OpenGraph share image. |
| `tools/tmp/immersive-g/images/apple-touch-icon__dc21a428.png` | PNG | 180×180 (declared) | 4,257 B | `https://immersive-g.com/images/favicon/apple-touch-icon.png` | iOS home-screen icon. |
| `tools/tmp/immersive-g/images/favicon-32x32__4c26815c.png` | PNG | 32×32 | 581 B | `https://immersive-g.com/images/favicon/favicon-32x32.png` | Browser tab. |
| `tools/tmp/immersive-g/images/favicon-16x16__706d185b.png` | PNG | 16×16 | 367 B | `https://immersive-g.com/images/favicon/favicon-16x16.png` | Browser tab. |
| `tools/tmp/immersive-g/other/site__4356a0f7.webmanifest` | Web Manifest | — | 365 B | `https://immersive-g.com/images/favicon/site.webmanifest` | PWA manifest (`name:"Immersive Garden"`). |

### SVGs & icons

- **Inline SVGs observed in HTML:** one — the 170×22 wordmark, rendered
  twice in the DOM (one inside the visible intro loader, one inside the
  duplicated `/main` intro loader). Uses a `<defs><linearGradient>` with
  four stops and a `<mask>` rect to sweep the wordmark in from the left.
- **Standalone SVG files in dump:** none in `svgs/`.
- **Icon system:** No third-party icon library. The only icon-class
  shape is the Lottie-rendered "x" inside `.wrapper__icon`.

### Audio & video

None of the project MP4 reels were downloaded (they live on
`ig-medias-prod.ams3.digitaloceanspaces.com` and are listed as `data-src`
on `<img class="mediaBlock__image">` — the project page is what actually
decodes them as video). Two GLB case-study assets are referenced (see
3D models). No audio assets were observed.

A representative list of the 21 `.mp4` reels referenced from the homepage
DOM (all `data-src` on `<img>` elements with `width="1920" height="1080"`
or `width="1080" height="1440"`):

- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Showreel_Short_3_f3699e2f02.mp4` — studio reel
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/LV_01_44142e6b4a.mp4` — Louis Vuitton VIA
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/LV_02_v2_ce900a9d2a.mp4` — LV (portrait)
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/David_Whyte_01_v2_838d74bd8d.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/David_Whyte_03_9e40ec2070.mp4` (portrait)
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Cartier_EOY_01_310fc52fe3.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Cartier_EOY_02_v2_dc59d7f090.mp4` (portrait)
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Chartogne_01_114d7da5b8.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/medium_Chartogne_03_7476a61852.jpg`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Cartier_Time_01_0a3d952723.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Cartier_Time_02_v2_4ff6778abf.mp4` (portrait)
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Aten7_01_0835552052.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Aten7_02_34d31c73cd.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Prior_02_v2_2540e4b13e.mp4` (portrait)
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Artisans_d_idees_01_080f9b65c8.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Artisans_d_idees_03_2ec8c9f5bc.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Cartier_Watches_Wonders_24_01_v2_6c8ac11487.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Cartier_Watches_Wonders_24_02_v2_77cd58cd1b.jpg`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/GP_Casquette_01_8e555dc895.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/GP_Casquette_02_aaf206a3ff.mp4` (portrait)
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Hatom_01_20596dd308.mp4`
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/Hatom_02_c9918730ab.mp4`

The studio's `medium_` JPG prefix indicates poster fallbacks; portrait
variants sit in the third slot of each `projectBlock` and are 1080×1440
(3:4), landscape variants are 1920×1080 (16:9).

---

## Motion & Interaction

### Principles

- Default easing for color/opacity transitions:
  `cubic-bezier(.445, .05, .55, .95)` (a symmetric ease-in-out, similar
  to `ease-in-out`).
- Default easing for the header menu: `cubic-bezier(.77, 0, .175, 1)`
  (a heavier, more deliberate ease).
- Default easing for buttons: `cubic-bezier(.165, .84, .44, 1)`.
- GSAP eases observed in source: `quart.out`, `quart.inOut`,
  `sine.inOut`, `power1.in`, `power1.inOut`.
- Default durations: 0.25–0.5s for micro (color, opacity), 0.7s for
  page transitions, 1.5s for header fade, 1.9s for `.mediaBlock`
  fade-in, 2.5s for hero-logo mask sweep.

### Specific behaviors

- **Link hover:** underline scales `scaleX(1)→scaleX(0)` from `right
  center` (snaps with 0s transition so the line "draws back" rather than
  fades).
- **BasicButton hover/active:** `opacity:1→0.6` over 0.3s with the
  `.165,.84,.44,1` curve.
- **Section reveal on scroll:** Each `.mediaBlock` fades opacity 0→1
  over 1.9s `ease-in-out` once IntersectionObserver fires. Per-letter
  text animations run on the text block's `.textBlock__text--2`.
- **Page transition:** 0.7s crossfade `cubic-bezier(.445,.05,.55,.95)`;
  leave is 0s so the new page can fade in on top of the old.
- **Custom cursor:** Two-layer fixed positioning — `__follow` snaps to
  the pointer (offset `+15px`); `__ease` lerps to `__follow` each RAF.
  The cursor text label swaps based on the hovered element (e.g. "Click
  to enable sound" on the sound toggle).
- **Scroll cursor:** A field of 120 small dots (`.dots__fast`) scrolls
  vertically with the document, plus 3 default dots that mark page
  progress. Fast-scroll mode increases the dot field's Y velocity
  (multiplier 40) and fades the 3 default dots in 0.25s.
- **IntroLoader:** Body gets `lockScroll` (and `pointer-events:auto` on
  `.introLoader.lockScroll`) until the loader is done. The 1vh
  background panel slides the wordmark + progress + scroll-down
  elements in via GSAP.

### Reduced motion

- **Not observed.** The site does not declare a
  `@media (prefers-reduced-motion: reduce)` block; the `lottie.min.js`
  bundle does not gate on it; `Lenis.syncTouch:false` is not used.
  Animations run at full intensity regardless of the user preference.

---

## Content & Voice

- **Tone:** Confident, premium, reserved. Almost every sentence is short
  and declarative; the studio refers to itself in the third person as
  "a global leader in groundbreaking digital design and strategy".
- **Sentence length:** Short. Hero H1 is a 12-word statement broken
  across four lines; section bodies are 2–3 lines of 5–10 words each.
- **Capitalization:** Sentence case in headings and section labels
  ("Our approach", "Our mission", "See all projects", "Newsletter",
  "Scroll down"). The studio name "Immersive Garden" is Title Case
  everywhere it appears.
- **Punctuation:** No Oxford comma; em-dash only inside SVG path data;
  period at the end of every visible sentence.
- **CTA vocabulary (observed):** "See all projects", "Scroll down",
  "Newsletter", "Off", "On", social labels "X", "Instagram", "Linkedin"
  (lowercase `n` — brand-as-spelled).
- **Contact info visible on the homepage footer:**
  - Address: "14 avenue Claude Vellefaux, 75010 Paris"
  - Email: `inquiries@immersive-g.com`
  - Social: x.com/Immersive_g, instagram.com/immersive_g/,
    linkedin.com/company/immersive-garden

---

## Information Architecture

The site is a single Nuxt 3 app with one homepage and three main
sub-trees. Routes (deduplicated from the prerender manifest at
`tools/tmp/immersive-g/playwright/other/a64c9336-…json`):

- `/` — Marketing homepage. IntroLoader → Hero (H1) → mosaic of project
  reels + section text blocks → footer with project CTA, contact, social,
  newsletter pill. Primary component: `HomePage.vue` (renders `HeroBlock`,
  `MediaBlock`, `ProjectBlock`, `TextBlock`, `Footer`).
- `/projects` — Studio project index (full list of 51 case studies).
- `/projects/<slug>` — A case-study page; the homepage grid is
  effectively a teaser. Each `<slug>` has a paired
  `/projects/<slug>/backstage` route that the prerender manifest
  exposes.
- `/the-studio` — Studio overview / about.
- `/the-studio/our-approach` — Methodology.
- `/the-studio/services` — Service offering.
- `/the-studio/clients` — Client list.
- `/the-studio/the-studio` — Team / behind-the-scenes.
- `/the-studio/awards` — Awards & recognition.
- `/the-studio/contact-us` — Contact form.
- `/404` — 404 page.
- `/preview`, `/old`, `/one-year`, `/about-us` — Legacy / dev
  surfaces (legacy paths redirect to current equivalents; `/old` and
  `/one-year` redirect to `/`; `/about-us` redirects to `/the-studio`;
  `/cases/*` legacy paths redirect to `/projects/*`).

Every project page slug in the dump (verbatim from the manifest,
deduplicated, in order): `0-days-off`, `2219-mechachain`, `65db`,
`Carolina-Herrera`, `alireza`, `amazon-new-world`, `artisans-d-idees`,
`aten7`, `cartier-end-of-year-22`, `cartier-end-of-year-23`,
`cartier-in-time`, `cartier-love-is-all`, `cartier-watches-and-wonders-23`,
`cartier-watches-and-wonders-24`, `chartogne-taillet-1`,
`citrix-new-mobile-workforce-experience`, `creandum`,
`david-whyte-experience`, `dioriviera-1`, `dna-capital`, `eight-advisory`,
`eqt-ventures`, `girard-perregaux-casquette-1`, `gleec`, `hatom`,
`le-dernier-gaulois`, `leroy-merlin`, `longines-flyback`,
`longines-mini-dolce-vita`, `longines-positioning-system-1`,
`longines-smash-corner`, `longines-touch-screen`, `longines-zulu-time`,
`louis-vuitton-1`, `louis-vuitton-via-nicolas-ghesquiere`,
`louis-vuitton-via-pharrell-williams`, `maman-corp`,
`masar-cityscape-global-exhibition`, `masar-destination`, `midwam`,
`mimco`, `omega-clearspace`, `omega-space`, `orano`, `prior-holding`,
`rain-forest-food`, `the-hunt-for-the-cheshire-cat`, `travelshift`,
`uasc`, `vallourec`, `varagon`, `you-are-the-stylist`.

---

## Accessibility

- **Color contrast:** `#030303` text on `#E8E8E8` background measures
  18.4:1 (well above WCAG AAA 7:1). Inverted (`#E8E8E8` on `#030303` in
  the footer) is 18.4:1. The fast-mode accent `#A6A6A6` is decorative
  only and is never the sole channel of information.
- **Focus indicators:** The site relies on the user-agent default focus
  ring; the stylesheets do not declare a custom `outline`/`outline-color`.
  The cursor (`pointer-events:none`) and the `lockScroll` intro never
  block keyboard focus.
- **Keyboard:** Interactive elements (`<a>`, `<button>`) are native and
  reachable in logical source order. The hidden `.text__mobileLink`
  inside each `.mediaBlock` becomes a full-bleed `<a>` on touch
  devices, so the touch experience has a single big hit target.
- **Screen reader landmarks:** The DOM exposes `<header class="headerBlock">`,
  `<div class="main">`, `<footer class="footer">`, and the visible
  `<h1 class="hero__text1">`. The intro loader is decorative (it fades to
  `visibility:hidden` on complete) and announces its removal through
  `aria-hidden`-style behaviour implicitly.
- **Motion:** The site does **not** honor `prefers-reduced-motion`.
  Lenis, GSAP, and the WebGL scroll cursor will all run at full speed
  regardless of the user preference. This is a gap, not a feature.
- **Alt text:** No `alt` attribute is set on any of the `<img>` media
  tiles (they have `data-name` and `data-uri` but no `alt`). The
  decorative SVGs have no `<title>` either.
- **Sound:** The `.sound` toggle is opt-in (default muted); the page
  surfaces a "Click to enable sound" label on the cursor overlay when
  hovering the toggle.

---

## Sources

- Homepage — https://immersive-g.com/
- `/_payload.json` (Nuxt SSR state, used to confirm route list and page
  config)
- `/assets/builds/meta/a64c9336-…json` (Nuxt prerender manifest, used to
  enumerate all routes and redirects)
- `/images/share/immersive-garden.jpg` (OpenGraph share image, 1440×810
  JPEG, the only raster asset captured by the static pass)
- `https://ig-medias-prod.ams3.digitaloceanspaces.com/...` (the studio's
  DigitalOcean Spaces CDN — referenced from every `.mediaBlock__image`
  `data-src`; not opened individually for this spec)
- Bundled chunks (read but not fetched in the live browser beyond the
  initial document):
  - `https://immersive-g.com/assets/entry.nmlBdY4S.js` (2.02 MB,
    includes Three.js r151, GSAP 3.12.5, Lottie 5.12.2, Lenis, Tweakpane
    3.1.10, Firebase 10.8.0)
  - `https://immersive-g.com/assets/default.BZYNaK9D.js` (715 KB,
    likely the Three.js + Draco/KTX2/Basis loaders and the home WebGL
    scene)
  - `https://immersive-g.com/assets/Preloader.CCgyJU7b.js` (183 KB,
    GLTFLoader, KTX2Loader, DRACOLoader, EXRLoader)

---

## Changelog

- 2026-06-19 — Initial draft by design.md-gen batch.
