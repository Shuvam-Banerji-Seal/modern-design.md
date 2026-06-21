# EPIC Agency — design.md

> A structured design specification of **https://www.epic.net**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** design.md-gen
> **Source dump:** `tools/tmp/epic/` (gitignored)

---

## Overview

EPIC Agency is a Belgian (Wiertzstraat, Liège) branding and web agency. The
homepage is a single-page marketing experience built around three
movements — **"Imagine, Build, Tell."** — set in a large display serif.
The visual language pairs a deep, almost-black violet background with a
warm desaturated gold ("ecru") and pale lilac foreground, producing a
night-sky, almost editorial feel. The site is heavy on craft: a WebGL
castle configurator fills the "About" section, a split-letter slogan
animates on scroll, a Vimeo-powered showreel autoplays in the viewport,
and the case-study carousel auto-rotates every 8 s. A mega-menu
(opaque grey overlay) and a sticky CTA circle ("customize the castle")
hover at the edges. The piece is unmistakably a portfolio site from a
branding shop, not a SaaS dashboard.

**Category:** Marketing / Agency portfolio
**Primary surface observed:** Homepage (`/en/`) with mega-menu overlay
**Tone:** confident, editorial, slightly mysterious, refined
**Framework detected:** Vue 3.3.13 (Composition API) + Vue Router 4 + Pinia 2
(vite-bundled, code-split per route/component, `data-server-rendered="true"`)
**3D / animation stack:** Three.js r139 (custom GLSL shaders), GSAP 3.11.0
with ScrollTrigger, custom SplitText helper, Plyr 3 (Vimeo embed), Pinia
**Analytics:** Google Tag Manager `GTM-K664H6X`, GA4 `G-3F8XGN2DRM`,
Cloudflare Turnstile challenge (anti-bot), Matomo (anon)

---

## Visual Language

### Color

The site uses a **dual-mode token system** (`:root` and per-page override)
bound to `--c-foreground` and `--c-background`. The HTML root sets
`color-scheme: light` but every observed surface is dark; the override
on `<html style="--c-background: #271a47">` is what you see on the
homepage. Both the headline case-study pages and the homepage override
these tokens, so a single `.case` may render with a totally different
palette (e.g. `#BC994E` foreground over `#000` background) driven by
`color-change` event bus.

| Role | Token | Default value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--c-background` | `#271A47` (default homepage) / `#000000` (case override) | Deep aubergine / jet |
| Foreground (text) | `--c-foreground` | `#DBC9FF` (default) / `#C0AE7F` (case ecru) | Pale lilac → ecru gold |
| Accent (gold) | `--c-ecru` | `#C0AE7F` | `rgb(192, 174, 127)` — singular brand gold |
| Accent (warm tan) | derived | `#BC994E` | `rgb(188, 153, 78)` — CTA copy / case titles |
| Surface (mega-menu) | — | `#323336` | `rgb(50, 51, 54)` — `.mega-menu-inner` bg |
| Footer (case) | — | `#271A47` | `rgb(39, 26, 71)` — `--c-background` of footer |
| Border (subtle) | — | `#6F7175` | `rgb(111, 113, 117)` — dashed utility |
| Border (card) | — | `#404040` | `rgb(64, 64, 64)` |
| Text (muted) | — | `#A3A4A7` | `rgb(163, 164, 167)` |
| Text (placeholder) | — | `#A0A0A0` | `rgb(160, 160, 160)` |
| Surface (input) | — | `#1C1B1B` | `rgb(28, 27, 27)` — StackOverflow-dark hljs |
| Surface (chip) | — | `#E3FCFF` | `rgb(227, 252, 255)` — rare highlight |
| Loader (fill) | — | `#010101` | `rgb(1, 1, 1)` — pre-app background |
| Success | — | `#76C490` | `rgb(118, 196, 144)` — hljs add |
| Error | — | `#DE7176` | `rgb(222, 113, 118)` — hljs delete |
| Warning | — | `#D90B0B` | `rgb(217, 11, 11)` — destructive |
| Black overlay | — | `#000000` @ 40 % | `rgba(0,0,0,0.4)` — modal/cookie |
| Foreground @ 50 % | — | `rgba(192,174,127,0.5)` | `--c-foreground-rgb` alpha |
| Foreground @ 20 % | — | `rgba(192,174,127,0.2)` | 2 px utility border |

Notes:
- The whole palette is **`cool violet → warm gold`**; the only saturated
  hue is the brand ecru `#C0AE7F` and its darker sibling `#BC994E`. No
  primary blue/green/red is ever used for UI.
- `rgba(var(--c-foreground-rgb), .5)` is the universal "soft border"
  pattern (see `.polaroid`, `.blog__links__item`).
- `linear-gradient(var(--c-foreground), var(--c-foreground))` is used to
  fake a "filled" stroke (e.g. the SVO arrow path).

### Typography

Two families only, self-hosted, served from `/fonts/`. No Google Fonts
or Adobe Fonts.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Visually-hidden H1 | `sang-bleu, sans-serif` | 900 | `120px` | `144px` (1.2) | `0` |
| Display (case title) | `sang-bleu, sans-serif` | 900 | `clamp(35px, calc(4.33vw + 21.15px), 80px)` | `80px` (1.0) | `0` |
| Display (CTA word) | `sang-bleu, sans-serif` | 900 | `80px` | `80px` / `96px` (1.2) | `0` |
| Mega-menu link | `sang-bleu, sans-serif` | 900 | `50px` | `60px` (1.2) | `0` |
| Section label (overline) | `inter, sans-serif` | 400 | `10px` | `30px` (3.0) | `5px` (caps) |
| Body / default | `inter, sans-serif` | 400 | `18px` | `29.7px` (1.65) | `0` |
| Body medium (p-medium) | `inter, sans-serif` | 400 | `16px` | `25px` (1.56) | `0` |
| Body small / caption | `inter, sans-serif` | 400 | `14px` | `23.1px` (1.65) | `0.5px` (footer) |
| Button (default) | `inter, sans-serif` | 400 | `18px` | `29.7px` (1.65) | `0` |
| Button (small) | `inter, sans-serif` | 400 | `14px` | `23.1px` (1.65) | `0` |
| Button (tiny) | `inter, sans-serif` | 400 | `11px` | `18.15px` (1.65) | `0` |
| Button label (capsule) | `inter, sans-serif` | 700 | `11px` | `15.4px` (1.4) | `0` |
| Lang switcher | `inter, sans-serif` | 600 | `13px` | `21.45px` (1.65) | `0` |
| Caption / metadata | `inter, sans-serif` | 400 | `12px` | `15.6px` (1.3) | `0` |
| Mono | — | — | — | — | not used |

Stacks (verbatim from `index-474f7edd__66390765.css`):
```
font-family: inter, sans-serif;
font-family: sang-bleu, sans-serif;
```

Inter weights actually shipped: `400` (regular), `600`, `700`.
Sang Bleu Empire weights shipped: `400` (Regular-WebS), `900`
(Black-WebS). All five woff2 files are preloaded:

```
/fonts/SangBleuEmpire-Regular-WebS.woff2
/fonts/SangBleuEmpire-Black-WebS.woff2
/fonts/inter-v11-latin-regular.woff2
```

Numeric conventions:
- The `section-label` is **all-caps, 5 px tracking, 10 px** — the
  signature "small word in caps above a giant serif" pattern.
- The CTA word (`title-cta cta__word`) is **sang-bleu 900 at 80 px**
  in the default ecru; the active case override shows it in the
  warmer `#BC994E`.
- `<h1>` is intentionally **visually hidden** (`-1px` margin, no
  transform); the rendered "headline" is the animated slogan
  (`<div class="slogan">`) composed of three `<strong><div class="word">…</div></strong>` words.

### Spacing & radius

- **Base unit:** 4 px (custom-property scale).
- **Section vertical rhythm:** `80px` top + bottom on `.home-about`,
  `.cta-outer`, `.homepage__showreel`; `120px` horizontal side margin
  on the `.wrapper`.
- **Gutter system:** `--gutter-width`, `--gutter-compensation`, and
  `--half-gutter-width` exposed as CSS vars; per-breakpoint overrides
  drive a 12-column flex grid (`.row` + `.col-xxxs-N` … `.col-wrapper-N`).
- **Radii observed:** `0` (most), `5px` (`.cookiebar__actions button`),
  `8px` (cookie bar), `10px` (`.video`), `20px` (`.lang__trigger`),
  `30px` (every pill button — `btn--tiny`, `btn--small`, `btn--default`),
  `40px` (slider track), `50%` (`.socials__link`, `.drag-icon`),
  `100px` (round mega-menu trigger).
- **Shadows:** single rule — `.polaroid { box-shadow: 10px 10px #00… }`
  (truncated in dump). Otherwise the surface relies on **flat colour
  contrast + 1 px border** rather than drop shadows.

### Iconography

- **Style:** outline-only single-stroke SVG; weight ~2 px on a 24-px
  grid; viewBox typically `0 0 N N` or `0 0 16 16`.
- **Library:** none — EPIC ships a hand-built `SvgSprite` component
  that lives in `js/icons-a9e7e353__77fc2144.js` (a Vue 3 component
  exposing a `<use href="#symbol-id">` sprite). Sample ids observed in
  the inline `<svg id="__svg__icons__dom__">`: `epic-logo`, `dev-error`,
  `dev-rounded-arrow`, `icons-castle`, `icons-paper`, `icons-visibility`,
  `social-facebook`, `social-linkedin`, `social-instagram`,
  `social-dribbble`, `ui-arrow`, `ui-advergaming-overlay-arrow-key`,
  `ui-arrow-elbow-up`. There is also a Vimeo player sprite injected
  via `id="sprite-plyr"` (~10 KB of `<symbol>` definitions).
- **Default size:** `16px` social icons, `20px` UI arrows, `28px`
  paper-plane CTA icon, `35×35px` logo, `81×81px` drag icon (decorative).
- **Logo SVG path** (verbatim from inline `<symbol id="epic-logo">`):
  ```
  M88 37.8 69.075 26.5V4L12 37.8v45L31.025 94 50.05 82.8 31.025 71.5V49L50.05 60.3 69.075 49v22.5L50.05 82.8 69.075 94 88 82.8V47.71z
  ```

---

## Layout & Grid

- **Wrapper:** `.wrapper { max-width: 1200px; margin: 0 120px }` on
  ≥ 1024 px viewports, `margin: 0 20px` on mobile, fluid
  `margin: 0 calc(9.615vw - 10.77px)` between 320 px and 1024 px.
  Full-bleed modifier: `[class*=wrapper--][class*=--full] { max-width: none }`.
- **Grid:** 12-column flex grid (`.row` + `.col-{size}-{n}`). Sizes
  in order: `xxxs 320`, `xxs 360`, `xs 480`, `s 600`, `m 768`,
  `nav 960`, `l 1024`, `wrapper 1280`, `xl 1360`, `xxl 1440`,
  `xxxl 1600`, `xxxxl 1920` (each expressed as a media-query em
  breakpoint).
- **Mobile gutter:** `0` at the smallest breakpoint, `.5rem` per side
  at all others.
- **Breakpoints (em / px):**

  | Token | Em | Approx px | Purpose |
  | --- | --- | --- | --- |
  | `xxxs` | `20em` | 320 | min-width |
  | `s` | `48em` | 768 | phone landscape |
  | `m` | `60em` | 960 | tablet portrait |
  | `l` | `64em` | 1024 | tablet landscape |
  | `wrapper` | `80em` | 1280 | desktop |
  | `xl` | `85em` | 1360 | large desktop |
  | `xxxl` | `100em` | 1600 | wide |

  Used as `@media (min-width: 768px)`, `@media only screen and (min-width: 64em)` etc.
- **Vertical rhythm:** major sections use `margin: 80px 0` or
  `margin: 80px 120px`; the case-study `<section>` uses
  `min-height: calc(100 * var(--vh))` so it always fills the viewport.
- **Aspect-ratio driven canvas:** `<canvas id="castle" style="height: 900px">` is the
  Three.js background of the About section.
- **Sticky pin:** the About section uses GSAP ScrollTrigger
  `pin: true, scrub: true, end: "+=300%"` — content stays in place for
  three viewports' worth of scroll while the castle rotates and the
  slogan animates.

**Homepage sequence** (top → bottom):
1. **Header** — fixed, `padding: 32px 0` inside `.header-outer`
   (`margin: 0 120px`). Logo + tagline + lang + mega-menu trigger.
2. **Hero case carousel** (`.home-case`) — full-viewport
   (`min-height: calc(100 * var(--vh))`), `.case-outer` is a 2-column
   flex at `>= 64em` (case on left 70 %, blog on right 30 %).
3. **`<hr>` divider**
4. **Showreel** (`.homepage__showreel`) — `margin: 80px 120px`,
   section-label "showreel", embedded Vimeo via Plyr.
5. **`<hr>` divider**
6. **About** (`.home-about m-d`) — `margin: 80px 0`. Pinned
   scroll-driven WebGL castle; slogan "imagine, build, tell" animates
   in three stages.
7. **CTA** (`.cta-outer m-d`) — large three-line `<div class="title-cta cta__word">`
   (default reads "Let's / talk / about it." or similar; per-page
   override) followed by a `.cta__headline` overline and a circular
   "let's talk" `cta-rounded-outer--large` button.
8. **Footer** (`.footer wrapper`) — `padding: 80px 0 0`, `margin: 0 120px 60px`,
   3-link block (services / agency / contact), social icons, experiments
   links, legal links, address.

The `<html>` is given `margin-top: -102px` (matching `--header-height`)
so the case-study hero bleeds under the fixed header.

---

## Components

### Button (`GAction` / `GBtn`)
- **Variants:** `btn--default`, `btn--small`, `btn--tiny`, `btn--no-outline`.
- **Shape:** every variant is a **pill** (`border-radius: 30px`) — no
  square buttons anywhere in the system.
- **Sizes:**
  - `btn--default`: `font-size: 18px`, `padding: 5px 10px` (compact
    inline), often `padding: .5rem 1rem` for blog CTA.
  - `btn--small`: `font-size: 14px`, `padding: 4.9px 17.5px`.
  - `btn--tiny`: `font-size: 11px`, `padding: 3.85px 13.75px`.
- **Anatomy:** label (`.btn__label`, weight 700) + trailing icon
  (`.btn__icon`, ~28×28 for the paper-plane newsletter, 20×20 for
  inline arrows). Trailing icon always **rotates 0°** by default and
  **translates 0.5rem right** on hover (`transition: transform 0.15s`).
- **States:** default uses `color: var(--c-foreground)` and
  `background: transparent`; on hover the `.btn--default` raises to
  `color: var(--c-foreground); background-color: transparent;` with
  a brightness shift; `.btn--small` is `color: var(--c-foreground)`
  default. No fill background — buttons are always **ghost** style.
- **No focus ring defined** in dump (relies on browser default; the
  cookie bar uses `box-shadow` for its primary CTA).

### CTA rounded (`.cta-rounded-outer--*`)
- **Shape:** circular SVG ring (`<svg viewBox="0 0 156 156">`,
  `<circle cx="78" cy="78" r="76">`).
- **Text:** label follows the ring on a `<textPath>` referencing
  `id="circlePath customize the castle"`. `letter-spacing: 3px`,
  `text-transform: uppercase`, `font-size: 1.3rem`, `font-weight: 700`,
  `scale: 0.9`.
- **Background ring:** `<circle class="text-background">` is `5px
  stroke = var(--bg); fill: none` — i.e. the ring is **knocked out**
  from the surface.
- **Animation:** the whole SVG spins at
  `animation: spin-1acebfae 30s linear infinite`
  (`@keyframes spin-1acebfae { 0% { transform: rotate(0) } to { transform: rotate(360deg) } }`,
  `transform-origin: center`).
- **Sizes:** `cta-rounded-outer--small` (in header), `cta-rounded-outer--large`
  (anchored to the About castle, `text: "customize the castle"`,
  `repeat: 2`, `offset: 25`, `icon: "castle"`).
- **Hover:** the SVG `.text-container` and `.circle` colour-shift to
  `var(--c-foreground)` and `var(--c-background)` via inline CSS vars
  on the `<svg>` (`--6487c3e0-foreground: #c0ae7f; --6487c3e0-background: #323336;`).

### Header / Mega-menu
- **Header (`<header class="header">`):** flex row, `padding: 32px 0`,
  fixed (`<header>` is rendered inside the `Veil` sticky wrapper at
  `z-index: 10000`). Three children: `.header__logo` (35×35 SVG, link
  to `/en/`), `.header__title` (`.section-label`, "Imagine, Build,
  Tell."), `.header__menu-outer` (lang switcher + `.mega-menu`).
- **Logo colour:** `color: rgb(188, 153, 78)` (`#BC994E`) — the warm
  tan accent.
- **Section-label tagline:** `inter 10/30, letter-spacing: 5px, color:
  rgb(219, 201, 255)` (`#DBC9FF`). The whole header **inverts** when
  scrolled (`.is-sticky` modifier) — `q()` (GSAP) `fromTo` fades
  header to `opacity: 0` when configurator opens.
- **Language switcher:** `<button class="trigger button__lang">` —
  `inter 600 13/21.45`, `border-radius: 20px`, `padding: 4px 12px`,
  `background: rgb(39, 26, 71)` (`#271A47` footer colour). Dropdown
  uses `aria-haspopup="listbox"`.
- **Mega-menu (`.mega-menu-inner`):** full-screen overlay, `padding:
  95px 0`, `background: rgb(50, 51, 54)` (`#323336`). Hidden by
  default (`display: none` → `display: flex` on open). Two-column at
  `>= 48em` (`.col-xxs-12 .col-s-6`): left block lists primary
  navigation in `sang-bleu 50/60` weight 900; right block lists
  secondary links in `inter 16/25` (`p-medium`). Footer of the
  mega-menu contains a `.socials` block (Facebook / LinkedIn /
  Instagram / Dribbble), a `.btn--tiny` "Contact us" CTA and the
  `cta-rounded-outer--small` "close" button.
- **Mega-menu trigger:** a 100 px-round button on the right of the
  header opens the menu (no icon — pure circle; sometimes shows
  `?` according to the inline `mega-menu__trigger` class).

### Section label (overline)
- **Class:** `.section-label` (also `header__title`, `cta__headline`,
  `cta__baseline`, `blog__links__item__content__date`).
- **Spec:** `inter 400 10/30, letter-spacing: 5px, text-transform: uppercase` (presumed).
- **Color:** matches the active palette — `rgb(219, 201, 255)`
  (`#DBC9FF`) on default violet, `rgb(192, 174, 127)` (`#C0AE7F`) on
  case ecru, `rgb(188, 153, 78)` (`#BC994E`) on warm-tan case.
- **Margin:** `margin: 0 0 30px` on the section title; `margin: 0 0 15px`
  in the CTA block.

### Slogan (`.slogan`)
- **Purpose:** the rendered `<h1>`-equivalent. Composed of three
  `<strong><div class="word">` items ("imagine", "build", "tell") with
  inline `<span>, </span>` separators.
- **Positioning:** `position: absolute; inset: 0; display: flex;
  justify-content: center; align-items: center; width: 100%; height: 100%`.
- **Animation:** each `.word` is `transform-style: preserve-3d` and is
  pre-positioned via `transform: translate(<scribble-offset>px, <y>px)`
  (e.g. `translate(518px, -34.64px)` for "imagine", `translate(262.5px, 34.65px)` for "build", `translate(-359.5px, 103.95px)` for "tell"). A GSAP `timeline().to(textItems, { opacity: 0, translateY: -300+rand, rotateZ: 15+rand*75, translateX: 100+rand*50, rotateX: 15+rand*25, translateZ: 50+rand*50, stagger: 0.08, ease: "power3.in", duration: 2 })` scatters the source words away, then **brings the cloned "slogan" words in** with `{ x: 0, xPercent: 0, y: 0, yPercent: 0, stagger: 0.1, ease: "power3.inOut", duration: 2 }`, then fades the punctuation in with `{ duration: 0.25, opacity: 1, stagger: 0.3, ease: "power3.out" }`. The whole sequence is ~5–6 seconds and is scrubbed by ScrollTrigger.
- **Letter splitting:** `SplitText` (custom) splits the original text
  into `.word` (line) + `.split-char-container` (chars) + `.split-char`
  (sub-chars) for the entrance.

### Case card (`.case-outer` + `.case`)
- **Layout:** flex column on mobile, **flex row, space-between,
  align-items: flex-end** at `>= 64em`. `gap: 50px` (desktop
  `20px @ >= 1360px`).
- **Shaker:** a hidden `<button class="shaker">` containing
  `cta-rounded-outer--small` (the rotating "next case" ring) is shown
  when JS randomises the case.
- **Title:** `<h2 class="h1-case split-title case__title">` — `sang-bleu
  900`, `clamp(35px, 4.33vw + 21.15px, 80px)`, `line-height: 80px`.
  Split into lines by `splitTitle-91410398.js` and animated letter-by-letter
  on enter / exit.
- **Services chips:** `<ul class="case__services">` — `display: none` by
  default; when present, `inter 500, font-size: 1.3rem, text-transform: uppercase`.
- **CTA:** `<a class="btn--small GAction">` for "Visit project" and a
  second `btn--small btn--no-outline` for the page's own CTA.
- **Color override:** a `color-change` emit on case change sets
  `--c-foreground` and `--c-background` on the document, then
  `gsap.set()` + `SplitText` animation runs over 0.35 s.

### Blog list (`.blog`)
- **Width:** `width: 30%` at `>= 64em`, full-width below.
- **Header:** flex row, `space-between`, contains the overline
  (`section-label`) and a `.btn--default GAction blog__header__cta`
  ("View all posts" — pill, ghost, with arrow that translates 0.5 rem
  on hover).
- **Items:** `<a class="blog__links__item">` — `padding: 10px 0`,
  `border-top: 1px solid var(--c-foreground)`, flex row
  `space-between`. Hover: `filter: brightness(1.2)`.
- **Item content:** date (`.section-label`) + title (`.p-medium`) on
  the left; visibility icon + "Read post" label on the right.

### Cookie bar (`.cookiebar-selection`)
- **Variants:** inline strip (`.cookiebar-controls`) and full modal
  (`.cookiebar-selection-outer`).
- **Header:** `h2` (10 px section-label caps "Essentials" / "Advertising"
  / "Performance") + a `+` SVG icon (10×10 viewBox, single rect path).
- **Body:** paragraph (`.cookiebar__item__details__description`,
  `inter 11/14.3, padding: 0 20px`).
- **Footer:** `Deny all` (link button), `Confirm selection` (hollow
  pill, `border-radius: 5px`, `box-shadow: ...`), `Accept all` (pill
  with shadow + arrow).
- **Design tokens:** all colors are aliased to `var(--c-foreground)` /
  `var(--c-background)` so the cookie bar **inherits the active case
  palette** (no separate hard-coded colours).

### Veil + page transition
- **`<div class="veil">`:** sticky wrapper at `z-index: 10000`,
  contains `.veil-overlay` (`backdrop-filter: blur(1px)`,
  `position: fixed; inset: 0; opacity: 0`).
- **`.page-transition`:** `position: fixed; z-index: 1999; inset: 0;
  height: 100vh; opacity: 0; pointer-events: none; color:
  var(--c-foreground); background: var(--c-background)`. Contains a
  hidden `.page-transition__logo` (`.sang-bleu 700 6rem, line-height:
  1.15, will-change: transform`). Used by `move()` action on route
  change to fade the page out before the next one paints.

### Footer
- **Layout:** `<div class="footer wrapper">` — flex row, `padding:
  80px 0 0`, `margin: 0 120px 60px`, `background: rgb(39, 26, 71)`
  (`#271A47`).
- **Columns (3):** `.footer-info` (address + map link), `.footer-cta`
  (newsletter pill button + phone link), `.footer-nav` (about / work
  / services / contact links). Each column is `<div class="footer-links">`
  with `font-size: 14px; line-height: 23.1px; letter-spacing: 0.5px`.
- **Column title:** `<strong class="footer-links__title">` —
  `inter 700 14/23.1, margin: 0 0 15px`.
- **Phone:** `<a class="footer-links__phone">` — `margin: 15px 0 0`.
- **Socials:** `<div class="socials footer-cta__socials">` — flex row,
  `gap: 1.5rem`, `flex-wrap: wrap; justify-content: center` at
  `max-width: 84.99em` (`< 1360px`). Each link is a 16×16
  `<a class="socials__link">` with `border-radius: 50%`,
  `color: #BC994E` (warm tan), `padding: 0`.
- **Experiments:** `<nav class="footer-experiments">` — list of
  miniature "advergaming" minigames (CarrotJump, WhacACarrot,
  CarrotSurfers, Rabbit, see `js/CarrotJump-*.js`,
  `js/WhacACarrot-*.js`, `js/CarrotSurfers-*.js`, `js/Rabbit-*.js`).
- **Legals:** `<div class="footer-legals">` — `flex-wrap` row of
  `footer-legals__link` (target `_blank` PDFs hosted on
  `cdn.epic.net/uploads/2024/09/...`).
- **Bottom:** small "All rights reserved" + favicon (apple-touch,
  bcorp badge, gov badge).

### Modal / dialog
- **N/A — no modal** other than the cookie bar is observed in the
  dump; the page-transition overlay is the closest equivalent.

---

## JavaScript & Libraries

Every script is a code-split ES module under `/assets/*.js` (Vite
output), preloaded via `<link rel="modulepreload">`. There is **no
package.json** in the dump (the dump only contains built artefacts).

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| Vue 3 | 3.3.13 | `js/index-23ea50f5__3fbef8d0.js` runtime + Composition API + `<script setup>` transpilation | `__scopeId="data-v-…"` SFC attribute confirms SFC source. `<div id="app" data-server-rendered="true">` confirms SSR. |
| Vue Router | 4.x | `import { … } from "./index-…js"` (router symbols) + `router-link-active` class on `<a>` elements | Hash-free history mode; `__INITIAL_STATE__` Pinia store hydration script. |
| Pinia | 2.x | `pinia` global in `index-23ea50f5.js`, `store.globalPinia.clicks` referenced in `CarrotJump` | Single `chrome` store; `address`, `cta`, `socials`, `legals`, `isNewsletterVisible` slices. |
| GSAP | 3.11.0 | `strings: 3.11.0` banner in `js/SplitText-82e4fcea__9c6c1a83.js`; `d.timeline()`, `d.fromTo()`, `d.registerPlugin()` used in `js/Homepage-7318c47b__b71e42ad.js` | Includes `ScrollTrigger` (observed as `B` import alias for `ScrollTrigger`). |
| ScrollTrigger | bundled with GSAP 3.11 | `B.create({ trigger, start, end, onEnter, onEnterBack, onLeave, onLeaveBack, scrub, pin })` in `Homepage.js`, `Case.js`, `About.js` | One pinned scroll timeline (3 viewport heights) on the About castle. |
| SplitText (custom) | EPIC-built wrapper around GSAP | `js/SplitText-82e4fcea__9c6c1a83.js` exports `class SplitText` with `type: "lines"`, `type: "words"`, `type: "chars"`, `tag: "span"`, `linesClass`, `wordsClass`, `charsClass` | Used by `splitTitle-91410398.js` for the case title and the slogan. |
| Three.js | r139 | `data-engine="three.js r139"` on `<canvas id="castle">`; `THREE.*` symbols (BufferGeometry, Box, Camera, …) in `index-23ea50f5.js` | Custom GLSL shader (`World-8c2633c2__04af4104.js`) with `varying vec2 vUv`, uniforms `primaryColor`, `secondaryColor`, `hover`, `time`, plus a radial-distance sin-stroke pattern. |
| Plyr | 3.x | `js/plyr.min-d2156373__df25938a.js` (Vimeo embed only, `data-plyr-provider="vimeo"`) | Styling: `--plyr-video-controls-background: transparent`, control color set dynamically per palette via `D(e)/D(o)` luminance compare and `--plyr-color-main` injection. |
| Vimeo Player | via Plyr | `https://player.vimeo.com/api/player.js` async script tag | Single reel: id `974135712`. |
| `vue-i18n` (likely) | 9.x | `const { t } = useI18n()` in `Homepage.js`; `t("case-random")`, `t("video-play")`, `t("video-support")` keys | Locale strings in `__INITIAL_STATE__`. |
| `@vueuse/core` | — | `useRaf` helper in `js/useRaf-13615104__e3dbb6c0.js` (`useRaf(fn, options)`) | Drives `requestAnimationFrame` for the castle render loop. |
| UUID v4 | — | `js/v4-cf522c50__5a248efe.js` (`crypto.getRandomValues` polyfill) | Generates per-instance ids for ARIA wiring. |
| `matomo` / `gtag` | — | Inline GTM snippet + `googletagmanager.com/gtag/js?id=G-3F8XGN2DRM` | GA4 + Matomo (anon). |
| Cloudflare Turnstile | — | `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async="true">` | Anti-bot challenge (visible in HTML head). |
| `epic-cookies-manager` | WP plugin | `<script src="https://cms.epic.net/wp/wp-content/plugins/epic-cookies-manager/public/assets/epic-cookies-manager-public.js">` | Drives the cookie bar; CMS is WordPress. |
| `gsap/SplitText` (custom) | EPIC | `js/SplitText-82e4fcea__9c6c1a83.js` (separate from the official Club GSAP SplitText — note "strings: 3.11.0" banner is the version of the GSAP runtime, not SplitText itself) | Used for `splitTitle` animation. |

**Per-component JS chunks observed (selection):**

| Chunk | File | Purpose |
| --- | --- | --- |
| `index-23ea50f5.js` | core runtime | Vue 3 + Pinia + Vue Router + GSAP + Three.js + i18n |
| `Homepage-7318c47b.js` | view | `Homepage.vue` — case carousel, slogan, About, CTA, showreel |
| `splitTitle-91410398.js` | helper | `splitTitle` HOC used by case title + slogan |
| `SplitText-82e4fcea.js` | helper | custom `SplitText` class (lines / words / chars) |
| `World-8c2633c2.js` | helper | Three.js `World` class wrapping the castle canvas + GLSL shader |
| `useRaf-13615104.js` | helper | `useRaf` RAF hook |
| `dom-3a534bf8.js` | helper | `getDocumentOffset(el)` |
| `v4-cf522c50.js` | helper | UUID v4 generator |
| `Video-9b33e2dc.js` | component | Plyr wrapper for Vimeo / HTML5 video, autoplay on enter, palette-aware controls |
| `CarrotJump-15ed0b42.js` | advergaming | Three.js minigame (platformer) |
| `WhacACarrot-3311c3fa.js` | advergaming | Whac-a-mole variant |
| `CarrotSurfers-7fa01cb7.js` | advergaming | Surfer variant |
| `Rabbit-72633628.js` | advergaming | Runner variant |
| `masonry-76d5fd06.js` | layout | Masonry layout helper |
| `hold-small-b6c20ee3.js` | component | "Hold" small CTA (used by case "next" shaker) |
| `read-case-large-e8993ce9.js` | component | "Read case" large CTA (the rotating ring) |
| `read-case-small-63a2703c.js` | component | "Read case" small variant |
| `icons-a9e7e353.js` | component | `<SvgSprite>` icon component |
| `Page-f4f32463.js` | component | Page wrapper (sets page transition) |
| `Content-ceb49ef3.js` | component | Generic content block renderer |
| `KeyPoints-8bec600b.js` | component | Key-points list |
| `TextGrid-11bb70ea.js` | component | Text + image grid |
| `Default-4de4e6b1.js` | layout | Default layout |
| `Dashboard-288bf472.js` | layout | Dashboard / contact layout |
| `ContactLayout-35063a2b.js` | layout | Contact-specific layout |
| `Wysiwyg-9ea0f85f.js` | component | WYSIWYG content (CMS HTML) |
| `Accordion-7006caf2.js` | component | FAQ accordion |
| `IntroWithTitle-a5cea670.js` | component | Page intro with split title |
| `ImageSlider-24ea6bd5.js` | component | Image slider |
| `Blog-66eddc5e.js` | view | Blog index |
| `SingleBlog-08999ae0.js` | view | Single blog post |
| `Case-13b05a84.js` | view | Single case study |
| `Works-a6211029.js` | view | Works index |
| `Careers-7a93700c.js` | view | Careers index |
| `SingleJob-81439507.js` | view | Single job posting |
| `SubService-5b3d1ba7.js` | view | Sub-service page |
| `Services-748286d7.js` | view | Services index |
| `ContentBlocks-9bcfdaf1.js` | view | Generic content blocks |
| `Registration-82192093.js` | view | Registration / contact form |
| `fr-2d3df8b8.js` | i18n | French translations chunk |

---

## Animations (Catalog)

### CSS @keyframes

| Name | File:line | Duration | Easing | Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `spin-1acebfae` | `css/index-474f7edd__66390765.css:1` (in minified bundle) | `30s` | `linear` | `infinite` | Applied via `animation-name: spin-1acebfae; animation-duration: 30s; animation-iteration-count: infinite; animation-timing-function: linear; transform-origin: center` to every `[class*=cta-rounded-outer--][data-v-1acebfae] svg .text-container`. Rotates the ring + text 0 → 360°. |
| `rotate-13f04004` | `css/hold-small-16e76c1f__c64d782b.css:1` | `5s` | `linear` | `infinite` | `0% { transform: rotate(0) } to { transform: rotate(-360deg) }`. Applied to `.arrows { animation: linear 5s infinite rotate-13f04004 }` (the small "hold" CTA's chevron ring). |
| `plyr-fade-in` | `css/plyr-673fa1d7__cbfd693b.css:1` | Plyr default | ease | Plyr control show | Vendor keyframe from Plyr. |
| `plyr-popup` | `css/plyr-673fa1d7__cbfd693b.css:1` | Plyr default | ease | Plyr menu open | Vendor keyframe from Plyr. |
| `plyr-progress` | `css/plyr-673fa1d7__cbfd693b.css:1` | Plyr default | ease | Plyr progress bar | Vendor keyframe from Plyr. |

### JS-driven animations (GSAP + ScrollTrigger)

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | **Slogan scatter** (`g()` timeline, `js/Homepage-7318c47b.js` `About.vue`) | ScrollTrigger pin `start: "center center"`, `end: "+=300%"`, `scrub: true` on `.home-about` | `textItems` (cloned source words) get `{ duration: 2, opacity: 0, translateY: -300+rand*50, rotateZ: 15+rand*75, translateX: 100+rand*50, rotateX: 15+rand*25, translateZ: 50+rand*50, stagger: 0.08, ease: "power3.in" }`; then `sloganItems` (cloned destination words) animate in with `{ x: 0, xPercent: 0, y: 0, yPercent: 0, stagger: 0.1, ease: "power3.inOut" }`; finally punctuation `<span>, </span>` / `<span>.</span>` fade in (`{ duration: 0.25, opacity: 1, stagger: 0.3, ease: "power3.out" }`). |
| GSAP | **Scroll-to-canvas** (`T()` timeline) | ScrollTrigger pin on About | `gsap.to(canvas, { duration: 1, yPercent: -100 })` lifts the castle canvas up so the CTA "validate" / "Personnaliser" ring appears beneath. |
| GSAP | **Configurator open** (`V()` timeline) | Click on `cta-rounded-outer--large` | `gsap.to(about.$el, { duration: 0.3, opacity: 0, yoyo: true, repeat: 1 })` flashes the about block; on `onRepeat` calls `world.switchConfig()`. |
| GSAP | **Configurator close** (`F()` + `q()`) | Click on `cta-rounded-outer--large` (validate) | `gsap.fromTo([header, title, subtitle], { opacity: 1 }, { duration: 0.25, opacity: 0 })` then a `q().reverse()`. |
| GSAP | **Header fade** (`q()`) | On `oe()` (configurator open) | `gsap.fromTo([header, x.value, _.value], { opacity: 1 }, { duration: 0.25, opacity: 0 })` (hides the header bar). |
| GSAP | **Scroll-to-section** | CTA click | `gsap.to(window, { scrollTo: { y: R.value, autoKill: false }, duration: 0.5, ease: "power2.inOut" })` |
| GSAP | **Case fade-out** (`L()`) | On case change | `gsap.timeline().fromTo([R.value, x.value], { x: 0, opacity: 1 }, { duration: 0.35, ease: "power3.out", x: 20, opacity: 0, stagger: 0.1 }).call(introOutro).fromTo([C.value], { y: 0, opacity: 1 }, { duration: 0.35, ease: "power3.out", y: -20, opacity: 0, stagger: 0.1 }, "start+=0.25").set(_.value, { opacity: 0 })` |
| GSAP | **Case fade-in** (`O()`) | After `L().play()` resolves | `gsap.timeline().set(_.value, { opacity: 1 }).fromTo(r, { y: -20, opacity: 0 }, { duration: 0.35, ease: "power3.out", y: 0, opacity: 1, stagger: 0.1, clearProps: "all" }).call(intro.play(), …, "-=0.2").fromTo([R.value, x.value], { x: -20, opacity: 0 }, { duration: 0.35, ease: "power3.out", x: 0, opacity: 1, clearProps: "all", stagger: 0.1 }, "+=0.25")` |
| GSAP | **Auto-rotate case** (`G()`) | ScrollTrigger `start: "top bottom"`, `end: "bottom top"` on `home-case` | `setTimeout(H, 8000)` advances case index. |
| GSAP | **Video play/pause** (`ScrollTrigger` in `js/Video-9b33e2dc.js`) | `start: "center bottom"`, `onEnter: play` / `onEnterBack: play` / `onLeave: pause` / `onLeaveBack: pause` | For HTML5 video only. |
| GSAP | **SplitTitle** (`splitTitle-91410398.js`) | Vue component mount | Wraps `SplitText` to run a staggered line+chars intro. |
| GSAP | **Page transition** (Vue Router `beforeEnter`) | `Page-f4f32463.js` | `gsap.set('.page-transition', { opacity: 0, display: 'block' }).to('.page-transition', { opacity: 1, duration: 0.5 }).then(() => router.push(…))` (paraphrased). |
| GSAP | **Color cross-fade** | case change | `gsap.to('.case', { backgroundColor: newColors, duration: 1.2 })` then `emit('color-change', newColors)` to swap `--c-foreground` / `--c-background` on `<html>`. |
| GSAP | **Blog CTA arrow** | `:hover` | CSS `transition: transform 0.15s` on `.blog__header__cta svg`; on hover `transform: translate(0.5rem) !important`. |
| GSAP | **Blog item hover** | `:hover` | CSS `filter: brightness(1.2)` on `.blog__links__item:hover`. |
| GSAP | **Hold CTA border-radius** | always | `transition: border-radius 0.5s` on `.video` (`Video-f3ad2b79.css`). |
| GSAP | **Loader fade** | `appready` event | Inline JS: `loader.addEventListener("transitionend", …)` with `transition: opacity 0.35s ease-in 0.5s` on `.loader`. |

### Page transitions

- Vue Router intercepts `move` action in `chrome` store; on
  `transition` start, `gsap.set('.page-transition', { opacity: 1, display: 'block' })`, fades in
  for 0.5 s, then `router.push` runs the new view, then
  `gsap.set('.page-transition', { opacity: 0 })`.
- The `data-server-rendered="true"` attribute confirms SSR; the
  first paint does **not** trigger the page transition.
- The `.veil` element (`position: sticky; z-index: 10000; pointer-events: none`) is a
  sticky wrapper that holds the menu/header on top during scroll.

### Reduced motion

- `@media (prefers-reduced-motion: reduce) { html:focus-within { scroll-behavior: auto } }`
  is the **only** reduced-motion rule in the bundle. The site does
  not disable GSAP timelines, ScrollTrigger, or the Three.js render
  loop in reduced-motion mode — a11y shortcoming.

---

## Assets

### 3D models

N/A — no `.glb`, `.gltf`, `.obj`, `.fbx`, or `.usdz` files in the
dump. The "castle" is rendered at runtime by a custom GLSL shader
(`js/World-8c2633c2__04af4104.js`) — there is no static mesh, only
procedural geometry. The advergaming minigames (CarrotJump,
CarrotSurfers, WhacACarrot, Rabbit) likewise procedurally generate
their platforms and characters from primitives + the
`getFromAssets()`-style asset map.

### Fonts

| Family | Weights | Format | Source URL | Self-hosted |
| --- | --- | --- | --- | --- |
| Inter (v11) | 400 (regular), 600, 700 | woff2 | `https://www.epic.net/fonts/inter-v11-latin-regular.woff2` etc. | yes |
| Sang Bleu Empire (WebS) | 400 (Regular-WebS), 900 (Black-WebS) | woff2 | `https://www.epic.net/fonts/SangBleuEmpire-Regular-WebS.woff2` etc. | yes |

All five files are preloaded with `<link rel="preload" as="font" type="font/woff2" crossorigin>`. No variable font, no Google Fonts, no Adobe Fonts.

### Images

Local dump paths (all under `tools/tmp/epic/images/` except where noted):

| Local path | Type | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/epic/images/castleLoader__c6e14b43.gif` | GIF (animated) | 272 432 B | `https://www.epic.net/images/loader/castleLoader.gif` | Preloader GIF (118×118, mix-blend-mode: screen) |
| `tools/tmp/epic/images/gov-35123cd1__453590e0.png` | PNG | 28 858 B | `https://www.epic.net/assets/gov-35123cd1.png` | Belgian government B2B badge (footer) |
| `tools/tmp/epic/images/favicon__c630f151.ico` | ICO | 15 086 B | `https://www.epic.net/favicon/favicon.ico` | multi-res favicon |
| `tools/tmp/epic/images/favicon-16x16__1005351e.png` | PNG 16×16 | 765 B | `https://www.epic.net/favicon/favicon-16x16.png` |
| `tools/tmp/epic/images/favicon-32x32__8654e70b.png` | PNG 32×32 | 1 012 B | `https://www.epic.net/favicon/favicon-32x32.png` |
| `tools/tmp/epic/images/apple-touch-icon__61e9e5ef.png` | PNG | 1 870 B | `https://www.epic.net/favicon/apple-touch-icon.png` |

**Case-study covers** (captured at runtime by Playwright, live URL patterns
follow `https://cms.epic.net/thumbor/.../uploads/...`):
- `playwright/images/Camber-website-cover-image__7cde572e.jpg` (34 566 B)
- `playwright/images/Camber-website-cover-effects__79c9e62b.jpg` (5 178 B)
- `playwright/images/Camber-website-cover-normals__4358e1d6.jpg` (4 538 B)
- `playwright/images/red_bull-racers-cover__ce47bfc7.jpg` (20 258 B)
- `playwright/images/red_bull-racers-cover_effect-1__11c8bfc1.jpg` (6 492 B)
- `playwright/images/red_bull-racers-cover_normal__6f69a6d2.jpg` (6 906 B)
- `playwright/images/header_DW2__4ede6ea5.jpg` (18 526 B)
- `playwright/images/header_DW_effects_2__d49e02c2.jpg` (7 668 B)
- `playwright/images/header_DW_normals_2__dcd95efb.png` (8 108 B)
- `playwright/images/cover-albedo__30f61153.jpg` (26 860 B)
- `playwright/images/cover-avd__1b54f336.jpg` (23 020 B)
- `playwright/images/cover-normal__6e3f9b97.png` (7 256 B)
- `playwright/images/PDZ-albedo__e9273406.jpg` | `PDZ-effects__3291360e.jpg` | `PDZ-normals__5b4aed77.jpg`
- `playwright/images/Cover-effects__d73f313f.jpg` (12 744 B)
- `playwright/images/OG_cover-2__b9dcc45a.jpg` (51 436 B) + `OG_cover-effect-2__f729961e.jpg` (21 138 B)
- `playwright/images/paper-fold-1__ddf44426.jpg` (paper-fold case)
- `playwright/images/noise-1__b5a5b10f.png` (noise texture, used for grain overlays)

### SVGs & icons

- **Inline SVGs in HTML (`playwright/homepage.html`):**
  - `<symbol id="sprite-plyr">` (Plyr vendor sprite) — ~10 KB
  - `<svg id="__svg__icons__dom__">` (EPIC icon sprite) — `dev-error`,
    `dev-rounded-arrow`, `epic-logo`, `icons-castle`, `icons-paper`,
    `icons-visibility`, `social-facebook`, `social-linkedin`,
    `social-instagram`, `social-dribbble`, `ui-arrow`,
    `ui-advergaming-overlay-arrow-key`, `ui-arrow-elbow-up`.
  - The header logo (inline `<svg class="icon" width="35" height="35"
    viewBox="0 0 35 35">` with `<use href="#epic-logo">`).
  - The CTA rounded ring (inline `<svg width="156" height="156"
    viewBox="0 0 156 156">` per `.cta-rounded-outer--large`).
  - The "drag icon" SVG (`<svg width="81" height="81">` with a custom
    hand-pointing path).
  - The cookie bar toggle icons (10×10 viewBox, plus shape).
  - The newsletter "paper-plane" SVG (28×28).
- **Standalone SVG files in dump:**
  - `tools/tmp/epic/svgs/bcorp-009b4432__b83b1660.svg` (15 359 B) —
    B Corp badge (footer).
  - `tools/tmp/epic/svgs/safari-pinned-tab__8ba46a48.svg` (2 023 B) —
    Safari pinned tab.
  - `tools/tmp/epic/playwright/svgs/plyr__6d18be0e.svg` (Plyr vendor).
- **Icon system:** custom Vue `<SvgSprite>` component
  (`js/icons-a9e7e353__77fc2144.js`) that injects the inline sprite
  and exposes a `<use href="#symbol-id">` API. Not Lucide / Phosphor /
  Heroicons.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| (none) | — | No audio files in dump. |
| (Vimeo embed) | MP4 (remote) | Showreel id `974135712` rendered via Plyr + Vimeo Player API. Loaded only when the section enters the viewport. |

---

## Motion & Interaction

### Principles

- **Default easing:** `power3.out` / `power2.inOut` (GSAP) for
  component-level transitions; `cubic-bezier(0.22, 1, 0.36, 1)` for
  CSS-driven SVG path animations.
- **Default duration:** 350 ms for case/component transitions, 0.5 s
  for page transitions, 0.35–2 s for ScrollTrigger-driven Slogan,
  5 s / 30 s for infinite ring rotations.
- **Cadence:** purposeful, never decorative without reason. The 30 s
  ring rotation is the only true ambient motion; everything else is
  tied to a click or scroll event.

### Specific behaviors

- **Link hover:** the blog `btn--default` raises to
  `var(--c-foreground); background: transparent` with the trailing
  arrow translating `0.5rem` to the right (`transition: transform 0.15s`).
- **Button press:** no observed scale (relies on the standard `:active`
  browser default). The pill keeps its shape throughout.
- **Section reveal on scroll:** the slogan uses a 6-second
  scrub-driven GSAP timeline; the case carousel auto-rotates after
  8 s of being in the viewport.
- **Page transition:** `<div class="page-transition">` overlay fades
  from `opacity: 0 → 1` over 500 ms before the next view paints, then
  fades back to `0`.
- **Mega-menu open:** `.mega-menu-inner` switches from
  `display: none` to `display: flex` (no fade observed — instant
  open). It is `position: fixed` overlay, `z-index` higher than the
  page transition.
- **3D configurator:** clicking the large ring scrolls the canvas
  into view (`yPercent: -100`), runs an opacity flash on the
  `.home-about` block, and calls `world.switchConfig()`. Clicking
  again reverses (header re-fades in, scroll re-enables).
- **Language switch:** dropdown uses native `aria-haspopup="listbox"`
  behaviour — no animation; opens/closes via `display`.

### Reduced motion

- The single rule in the bundle is
  `@media (prefers-reduced-motion: reduce) { html:focus-within { scroll-behavior: auto } }`.
  This is **insufficient** — GSAP timelines, ScrollTrigger, and the
  Three.js render loop are not gated on the user preference.

---

## Content & Voice

- **Tone:** confident, editorial, restrained. The site's only marketing
  line is the tagline "Imagine, Build, Tell." in the header section-label
  and the three "cta__word" CTAs scattered down the page.
- **Sentence length:** short to medium, mostly noun phrases
  ("Branding & Web Agency", "Branding & Web Agency | EPIC Agency"
  in `<title>`, "About", "showreel", "Imagine, Build, Tell.").
- **Capitalization:** **Sentence case** in body and most headings.
  Section labels and section titles use **all-caps with 5 px
  tracking**. CTA words (`.title-cta cta__word`) are **Title Case**
  ("Let's", "talk", "about it.").
- **Punctuation:** Oxford comma is not used. Em-dash style is the
  HTML entity `—`. Comma + space between slogan words is rendered
  by inline `<span>, </span>`.
- **CTA vocabulary:** the four canonical verbs the site uses are
  `Imagine`, `Build`, `Tell`, and `Contact us`. Pill CTAs read
  "Customize the castle", "Validate", "Subscribe to our newsletter",
  "View all posts", "Visit project". The footer is the only place
  that uses a phone number (`+32 78 15 11 45`).
- **Localization:** EN/FR with a `<link rel="alternate" hreflang="en">`
  to `https://www.epic.net/en/` and a default
  `https://www.epic.net/`. The lang switcher pill toggles between
  `en` and `fr`.

---

## Information Architecture

The site is bilingual (EN/FR), single-domain, served via a Vue SPA
with SSR. The homepage is the most elaborate page; subpages render
the same shell (`<div id="app">` + page-transition overlay) with
different Vue components lazy-loaded per route.

| Route | Purpose | Primary component |
| --- | --- | --- |
| `/` (redirects to `/en/` or `/fr/`) | Locale redirect | server-side |
| `/en/`, `/fr/` | Marketing homepage | `Homepage.vue` (case carousel + showreel + castle + CTA) |
| `/en/work/`, `/fr/work/` | Works index | `Works.vue` |
| `/en/work/{slug}/`, `/fr/work/{slug}/` | Single case study | `Case.vue` (color-change bus, SplitText title) |
| `/en/services/`, `/fr/services/` | Services index | `Services.vue` |
| `/en/services/{slug}/`, `/fr/services/{slug}/` | Sub-service | `SubService.vue` |
| `/en/blog/`, `/fr/blog/` | Blog index | `Blog.vue` |
| `/en/blog/{slug}/`, `/fr/blog/{slug}/` | Single blog post | `SingleBlog.vue` |
| `/en/careers/`, `/fr/careers/` | Careers index | `Careers.vue` |
| `/en/careers/{slug}/`, `/fr/careers/{slug}/` | Single job | `SingleJob.vue` |
| `/en/contact/`, `/fr/contact/` | Contact / registration | `Contact.vue` + `Registration.vue` |
| `/en/agency`, `/fr/agency` | About / agency | `Default.vue` + Wysiwyg content |
| `/advergaming/{carrot-jump\|whac-a-carrot\|carrot-surfers\|rabbit}/` | Easter-egg minigames (linked from footer "Experiments") | `CarrotJump.vue` / `WhacACarrot.vue` / `CarrotSurfers.vue` / `Rabbit.vue` |

The footer also references a `/wp/wp-admin/admin-ajax.php?lang=en`
endpoint (WordPress cookies manager) and the
`https://cdn.epic.net/uploads/2024/09/CGV-EPIC-2024-English.pdf`
legal PDFs.

---

## Accessibility

- **Color contrast:** the default palette `#DBC9FF` on `#271A47` is
  ~9.4:1 (luminance 0.62 / 0.05) — well above WCAG AAA. The case
  override `#C0AE7F` on `#000` is ~9.6:1 (luminance 0.45 / 0.0) —
  also AAA. The `#A3A4A7` muted on `#000` is ~6.8:1 — AA for body.
  The `#BC994E` on `#000` is ~6.0:1 — AA for large text.
- **Focus indicators:** **not explicitly defined** in the CSS
  (relies on browser default). No `:focus-visible` style observed in
  the dump. The cookie bar uses `box-shadow` for visual emphasis on
  its primary CTA instead.
- **Keyboard:** the language switcher and the "View all posts" CTA
  are reachable in source order. The mega-menu trigger is a
  `<button>` with `aria-controls`. The case-shaker is a `<button
  type="button">` with `aria-label` set via `t("case-random")`.
- **Screen reader landmarks:** the rendered DOM has `<header>`,
  `<nav>`, `<main>` (implicit via `#app`), and `<footer>`. The
  cookie bar adds `<section class="cookiebar-controls">` with
  `data-component="cookiebar-controls"`. The visually-hidden
  `<h1>EPIC Agency</h1>` is present but its computed `-1px` margin
  and no transform keep it hidden from sighted users while remaining
  announced.
- **Motion:** the single `prefers-reduced-motion` rule is
  insufficient; see Motion & Interaction § Reduced motion above.
- **Alt text:** the dump contains no `<img>` elements on the
  homepage (everything is SVG + CSS). The favicon SVG, the B Corp
  badge, and the government badge are loaded as `<img>` with no
  observed `alt` attribute in the dump; the cookie bar `<img>` is
  the EPIC loader GIF (118×118, `mix-blend-mode: screen`).

---

## Sources

Every URL referenced in the dump and during the analysis:

- Homepage (HTML) — https://www.epic.net/en/
- Homepage assets root — https://www.epic.net/assets/
- Fonts — https://www.epic.net/fonts/SangBleuEmpire-Regular-WebS.woff2, https://www.epic.net/fonts/SangBleuEmpire-Black-WebS.woff2, https://www.epic.net/fonts/inter-v11-latin-regular.woff2, https://www.epic.net/fonts/inter-v11-latin-600.woff2, https://www.epic.net/fonts/inter-v11-latin-700.woff2
- Loader GIF — https://www.epic.net/images/loader/castleLoader.gif
- Favicon set — https://www.epic.net/favicon/favicon.ico, https://www.epic.net/favicon/favicon-16x16.png, https://www.epic.net/favicon/favicon-32x32.png, https://www.epic.net/favicon/apple-touch-icon.png, https://www.epic.net/favicon/safari-pinned-tab.svg, https://www.epic.net/favicon/browserconfig.xml
- WordPress backend — https://cms.epic.net/wp/wp-admin/admin-ajax.php?lang=en, https://cms.epic.net/wp/wp-content/plugins/epic-cookies-manager/public/assets/epic-cookies-manager-public.js, https://cms.epic.net/wp/wp-content/plugins/epic-cookies-manager/public/assets/epic-cookies-manager-public.css
- Case-study CMS (Thumbor) — https://cms.epic.net/thumbor/C53ru8htjuSCa0ZNeNo-2dooqaM=/fit-in/1024x/--/uploads/2022/10/sharing-facebook.jpg
- OG image — https://cms.epic.net/thumbor/G0vfNhG6SMx_0b-wNgBse0GgmU0=/fit-in/1024x/--/uploads/2022/10/sharing-twitter.jpg
- Legal PDFs — https://cdn.epic.net/uploads/2024/09/CGV-EPIC-2024-English.pdf
- Address pin — https://www.google.be/maps/place/EPIC+Agency/@50.6420275,5.5528924,16.5z/data=!4m5!3m4!1s0x47c0f9f90084c7ad:0xaaf3445d416e5d61!8m2!3d50.6427095!4d5.5547576
- Vimeo showreel — https://player.vimeo.com/api/player.js (id `974135712`)
- Google Tag Manager — https://www.googletagmanager.com/gtm.js?id=GTM-K664H6X, https://www.googletagmanager.com/gtag/js?id=G-3F8XGN2DRM
- Cloudflare Turnstile — https://challenges.cloudflare.com/turnstile/v0/api.js
- Social — https://www.facebook.com/Epicagency/, https://www.linkedin.com/company/epic-web-agency-sprl/, https://www.instagram.com/epicagency/, https://dribbble.com/Epic
- Subpath example — /en/work/, /en/services/, /en/blog/, /en/careers/, /en/contact/, /en/agency, /fr/, /advergaming/carrot-jump, /advergaming/whac-a-carrot, /advergaming/carrot-surfers, /advergaming/rabbit

The local dump is the source of truth for CSS classes, computed
styles, and JS bundles. The Playwright capture (`homepage.html`,
`homepage.png`, `homepage-fullpage.png`, `computed-styles.json`) was
used to enumerate the rendered DOM and the case-study cover images.

---

## Changelog

- 2026-06-20 — Initial draft by `design.md-gen`. Extracted from
  `tools/tmp/epic/` (215 files, 15.4 MB, 5 woff2 fonts, 7 favicon
  images, 4 SVGs, 1 loader GIF, 1 B Corp SVG, 15 case-study cover
  JPEGs/PNGs, 7 CSS files, 39 JS chunks, 28 Playwright-captured
  case images, 1 `castleLoader` GIF, 1 EPIC webmanifest). 0 files
  copied into `websites/epic/`.
