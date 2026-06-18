# makemepulse — design.md

> A structured design specification of **https://makemepulse.com**, written so
> a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** sub-agent
> **Source dump:** `tools/tmp/makemepulse/` (gitignored)

---

## Overview

makemepulse is the marketing site of a Paris- and London-based digital
creative studio that builds web platforms, immersive 3D / WebGL
experiences, AR / VR pieces and branded games (the spin-off platform
`play.makemepulse.com`). The site itself is the studio's shop window:
a dark, near-monochrome landing experience with a kinetic typographic
hero, a featured case-study grid, an embedded showreel, a clipped
clip-path "we also do games" module, two discovery blocks for
"what we do" and "who we are", a blog/news feed, and a city-and-email
footer. The aesthetic is editorial, French-minimalist, with warm beige
and a single purple accent for the makemeplay spin-off; motion is
GSAP-driven and Locomotive-Scroll-pinned, with a heavy reliance on
Lottie micro-animations for icons, dots, and decorative marks.

**Category:** Marketing (creative-studio portfolio)
**Primary surface observed:** Homepage, plus inferred routes for
case studies, news, what-we-do, who-we-are and contact.
**Tone:** confident, technical, slightly playful, design-literacy assumed.
**Framework detected:** Nuxt 2 (Vue 2) — SPA / SSR hybrid, chunks under
`/_nuxt/app.*.js`, `/_nuxt/vendors~app.*.js`, `/_nuxt/runtime.*.js`,
`/_nuxt/pages/<route>.*.js`; static asset paths emitted from
`/_nuxt/static/<buildId>/{payload,state}.js`.

---

## Visual Language

### Color

Sampled from `playwright/computed-styles.json` plus inline `:root`-style
declarations and Prismic-driven `--color-primary` per case-study card
(`style="--color-primary:#CAC0A8;"` on Brunello Cucinelli, `#4C7036` on
McDonald's Rösti Fall). The palette is intentionally small.

| Role | Token (observed) | Value | Notes |
| --- | --- | --- | --- |
| Background — base | `--color-background` | `#FFFFFF` (white) | default canvas, "module--grid" / case-study grid |
| Background — ink | `bg-black` | `#000000` (black) | used on hero, footer, makemeplay accent slices |
| Background — "noise" tint over ink | `bg-black-noise` | `url(/images/black-noise.png)` over `#000000` | repeating grainy texture, used on hero / footer / video / blog |
| Background — "noise" tint over warm | `bg-gray-light-noise` | `url(/images/gray-light-noise.png)` over `#F1EDE7` | used on What-We-Do, Who-We-Are, newsletter |
| Text — primary | `--text-primary` / `text-primary` | `#0F0F0F` (near-black, "ink") | `rgb(15,15,15)`, used as default body color on light bg |
| Text — inverse | `--text-primary` (inverted) | `#FFFFFF` (white) | used on dark modules via `.theme-dark .text-primary` |
| Text — muted / secondary | `text-secondary` | `#444444` (dark gray) `rgb(68,68,68)` | footer copy, helper text |
| Accent — primary (brand purple) | `--color-secondary` | `#896FFF` (electric violet) `rgb(137,111,255)` | reserved for the `makemeplay` spin-off, the third logo dot, and decorative shadows |
| Accent — soft (subtle purple wash) | implicit | `rgba(137,111,255,0.05)` | very low-alpha tinted background |
| Case-study card — warm beige | `--color-primary` | `#CAC0A8` `rgb(202,192,168)` | Brunello Cucinelli card |
| Case-study card — warm cream | implicit | `#F1EDE7` `rgb(241,237,231)` | newsletter block & light cards |
| Case-study card — forest | `--color-primary` | `#4C7036` `rgb(76,112,54)` | McDonald's Rösti Fall card |
| Border / divider | implicit | `#BCBEC0` `rgb(188,190,192)` | footer field borders, soft dividers |
| Error / destructive | `label:before` dot | `#EA6161` `rgba(234,97,97,1)` | required-field marker inside form-field labels |
| Overlay / scrim | `modal__backdrop` | `rgba(0,0,0,0.85)` | modal background |
| Shadow — subtle elevation | `box-shadow: rgba(0,0,0,0.03) 10px 10px 20px 0px` | — | on `cursor-type__backdrop` and other floating dots |
| Shadow — purple glow | `rgba(137,111,255,0.5) 0 0 128px 0, rgba(137,111,255,0.5) 0 0 64px 0` | — | accent glow on hero `dot--hero` Lottie animation |

The site has no light/dark toggle: dark-on-light and light-on-dark
sections are mixed vertically, with each module declaring its own
`theme-dark` / `theme-light` modifier so that `.text-primary` and
`.fill-primary` flip accordingly.

### Typography

Two type families, both self-hosted under `/_nuxt/fonts/` and present
in the dump's `playwright/fonts/`. The site does not use Google Fonts
or Adobe Fonts.

| Role | Family | Weight | Size (observed) | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display H1 — `hero-headline` (visual) | "Beatrice Display", sans-serif | 300 | `clamp(6.5625rem, 6.5625vw, 8.25rem)`; mobile falls back to `105px` | `clamp(8rem, 8vw, 10.057rem)` | `0` (em) |
| SR-only H1 | Biotif, sans-serif | 400 | 16px (body reset) | 24px | normal |
| `title` (centered display, "We also do games.") | Biotif, sans-serif | 700 | `clamp(2.875rem, …, 12.5rem)` — 46px / 60px / 120px / 160px / 200px across breakpoints | 0.8 / 1.0 | normal |
| `link-big` (huge inline link) | "Beatrice Display", sans-serif | 300 | 60px | 64px | `-0.6px` |
| `title-medium` | Biotif, sans-serif | 400 | 36px | 48px | `-0.36px` |
| `title-small` | Biotif, sans-serif | 300 | 18px (also used at 28px on form copy) | 24px (also 40px) | `-0.18px` (also `-0.28px`) |
| Body / paragraph | Biotif, sans-serif | 400 | 16px (root) | 24px | normal |
| `paragraph-medium` | Biotif, sans-serif | 400 | 15px | 24px | `-0.15px` |
| `paragraph-small` (caption) | Biotif, sans-serif | 400 | 11px | 16px | normal |
| `paragraph-xsmall` (legal / fine print) | Biotif, sans-serif | 300 | 11px | 16px | normal |
| `cap-small` (small caps) | Biotif, sans-serif | 700 | 10px | 8px | normal; `text-transform: uppercase` |
| Form label / input | Biotif, sans-serif | 400 | 15px → 18px (lg) | 24px | normal |
| Date (`<time>`) | Biotif, sans-serif | 400 | 10px | 8px | `-0.1px`; uppercase |

**Source of families.** "Biotif" is the commercial renaming of a
serif/sans humanist family; the WOFF files are named with a Prismic /
Typekit-style 8-character token (`3B2986_1_0` = Biotif 700,
`3B2986_4_0` = 300, `3B2986_5_0` = 500, `3B2986_6_0` = 400,
`3B2986_E_0` = 400 italic). "Beatrice Display" is Adobe's
[Beatrice](https://fonts.adobe.com/fonts/beatrice) display family
(dump holds `BeatriceDisplay-Light.woff/.woff2`, weight 300 only —
only the Light cut is loaded).

### Spacing & radius

- **Base unit:** 4px (`Tailwind` default, but values frequently doubled
  to 8/16/20/24/40/80/144).
- **Scale (most common):** 4, 8, 10, 16, 20, 24, 32, 40, 56, 64, 80, 88,
  96, 104, 120, 136, 144, 160 px; section vertical padding reads as
  multiples of 16 (e.g. `py-72` = 4.5rem, `py-144` = 9rem, `py-160` =
  10rem).
- **Radii:** `0px` (default rectangular), `10px` (`rounded-10` /
  `--radius-md`, used on inline image masks), and `9999px` (`rounded-full`,
  used on `dot__inner`, the hero dot Lottie, image-trail masks, and
  the floating custom-cursor).
- **Shadows / elevations** (sparse, used as decoration not chrome):
  - `rgba(0,0,0,0.03) 10px 10px 20px 0px` — subtle floating shadow
    (custom-cursor backdrop, `image-reveal--embed`).
  - `rgba(137,111,255,0.5) 0 0 128px 0, rgba(137,111,255,0.5) 0 0 64px 0` —
    accent purple glow on the `dot--hero` Lottie.
  - `rgba(255,255,255,0.5) 0 0 128px 0, rgba(255,255,255,0.5) 0 0 64px 0` —
    same shape, white, for the light-theme inverse.

### Iconography

- **Style:** outline / 2 px stroke, hand-built SVG sprite.
- **Library / sprite:** custom. The dump's `playwright/svgs/38c273ece…svg`
  is a `<symbol>`-based sprite with the following glyphs (extracted from
  `<symbol id="…">` blocks):
  - `i-arrow` (22×20 viewBox, `fill="#000"`)
  - `i-drag` (23×20)
  - `i-filters` (16×7, `fill="#0F0F0F"`)
  - `i-handle` (20×20, `stroke="#000"`)
  - `i-pause` (20×20, two filled bars)
  - `i-play` (128×128, single triangle, used by showreel play button)
  - `i-submit` (80×80, four-pointed paper-plane mark, rotated `-10deg` in CSS)
- **Default size:** 20 px inline (e.g. `icon-arrow` is `font-size:1.25rem`
  on footer newsletter CTA), 64–128 px on the Lottie/CTA arrow.
- **Lottie-driven icons:** the brand "dot" (a small spinning Lottie
  inside an `<i class="dot dot--bounce">`) is reused throughout the
  hero and headlines; the showreel "play" cursor is a 64×64 / 128×128
  Lottie (`cursor-type--video .lottie-container`).
- **The makemepulse logo** ("logo-mmp") ships in two flavors, both
  inline SVG:
  - `logo-mmp--logotype`: 179×26 viewBox, full wordmark with the trailing
    three-dot glyph (2 black, 1 violet) baked into the SVG paths.
  - `logo-mmp--logogram`: 160×40 viewBox, just the three dots
    (two `class="fill-primary"` black, one `class="fill-secondary"`
    violet `#896fff`).
  - `logo-mmp--makemeplay`: 160×40 viewBox, "makemeplay" lockup in
    the same dot language but with all three dots black on the
    `module--makemeplay` section.

---

## Layout & Grid

- **Container:** `.container` with `margin: 0 72px` on desktop
  (computed), collapsing to page-padding on mobile via Tailwind's
  default breakpoint rules.
- **Grid:** a bespoke 18-column flex grid (Tailwind utility aliases
  like `col-1/18`, `col-2/18` … `col-18/18`, plus `col-span-` and
  `col-start-` modifiers). A second, 14-column grid is used inside
  smaller modules (newsletter, contact form), and a 5-column grid
  appears in the footer business block at `lg` and up.
- **Column gap:** `1/18` to `2/18` of the container width (declared
  via `lg:col-gap-1/18 xl:col-gap-2/18` on the case-study grid).
- **Breakpoints (Tailwind defaults, confirmed in CSS):** sm `640`,
  md `768`, lg `1024`, xl `1280`, `2xl` 1600. The site has custom
  rules at `1600px` for the hero (`max-height:100vh; height:48vw`)
  and for the `module--makemeplay` title (`font-size:12.5rem`).
- **Vertical rhythm:** modules declare their own top/bottom padding
  (`py-72`, `py-80`, `py-104`, `py-128`, `py-144`, `py-160`); no global
  baseline grid.
- **Sticky elements:** the navbar (`.app-header__navbar.fixed.top-0
  .inset-x-0 .lg:top-20`) is fixed to the viewport top, with `z-header`
  separating it from content. The custom-cursor element is also
  position-fixed via JS (not in CSS).

**Homepage section sequence (top to bottom, in this order):**
1. `module--hero-with-type` — full-viewport black-noise hero.
2. `module--grid` — case-study cards, white background, the cards
   "fly up" into the hero on `lg` (`top:-15rem; margin-bottom:-15rem`
   so the section overlaps the bottom of the hero).
3. `module--video-player` — embedded showreel, dark theme.
4. `module--makemeplay` — clip-path / scroll-driven "We also do games"
   CTA.
5. `module--discover-wwd` — What-We-Do discovery block, light gray
   noise.
6. `module--discover-wwa` — Who-We-Are discovery block.
7. `module--blog` — news cards, dark theme, on a black-noise background.
8. `module--newsletter` — newsletter CTA, light gray noise.
9. `app-footer` — city block, business block, newsletter inline form,
   social links, copyright + lockup.

---

## Components

### Button / Link
- **Variants observed:** the site uses inline text-links (`.link-big`)
  and `<a class="cta">` blocks with a Lottie arrow more than pill
  buttons. The submit button (`.btn-submit`) carries a 45°-rotated
  `.icon-submit` paper-plane SVG.
- **Sizes:** `cta` label ≈ 15px (`.cta__label`), `link-big` ≈ 60px.
- **Hover/focus:** underline on inline text links is driven by an
  animated `<u>` element whose `transform: scale(0,1)` becomes
  `scale(1,1)` on hover (via `cubic-bezier(.4,.8,.74,1)`).
- **Anatomy:** `<span class="cta__label">` (text) + `<span class="cta__arrow">`
  (Lottie arrow in a 64×64 frame). On `module--makemeplay` the arrow
  is `text-black` and rotated to point top-right.

### Logo
- **Three variants** (see Iconography): `logo-mmp--logotype` (header
  wordmark), `logo-mmp--logogram` (footer dots), `logo-mmp--makemeplay`
  (the spin-off).
- **Header placement:** `<a class="app-header__brand">` at `font-size:
  1.0625rem`, padding `20px` (Tailwind `p-20`), positioned at the start
  of the navbar grid (`grid-area: brand`).

### Nav
- **Grid:** two columns — `grid-template-columns: auto 1fr; grid-template-areas:
  "brand nav"`.
- **Desktop (≥1024 px):** logo on the left, full-bleed nav on the right
  with a custom translateX entrance (`translate3d(0,0,0)` keyframe).
- **Mobile (<1024 px):** the nav slides in from the right as an
  off-canvas drawer (`transform: translate3d(100%,0,0)` → `0`); burger
  button is `.app-header__burger` (a flexbox icon-button).
- **Menu link typography:** "Beatrice Display", `font-weight: 300`,
  `font-size: 2.25rem`, `line-height: 2.5rem`, `letter-spacing: -.01em`
  — every nav label is a giant serif word that animates in.
- **Background:** transparent over hero; on `is-sticky` it adds a
  vertical linear-gradient `linear-gradient(180deg,#fff 0,hsla(0,0%,100%,0) 100%)`
  for the light theme and an analogous black gradient for the dark
  theme. The gradient is also revealed on `:hover` (`opacity: 0 → .6`).

### Custom cursor (`cursor-type`, `cursor-type--video`)
- **Anatomy:** absolutely positioned `<span class="cursor-type">`
  with a `.cursor-type__backdrop` (rounded-full, `box-shadow:
  10px 10px 20px rgba(0,0,0,.03)`, `background-color: var(--color-secondary)`)
  and a Lottie child.
- **Variants:** `cursor-type--video` (centered 4rem / 8rem Lottie for
  the showreel play state); a default variant is used on links and
  image-reveal hotspots.
- **Positioning:** `transform: translate3d(-50%,-50%,0)` to follow the
  mouse via JS.

### Case-study card (`article.card.card--case_study`)
- **Grid areas:** `grid-template-areas: "caption" "image" "legend" "baseline"`
  (mobile) → `grid-template-columns: 4fr 2fr; grid-template-areas:
  "image image" "legend caption"` (desktop).
- **Image:** `--aspect-ratio: 208/336` (mobile) → `304/480` (desktop);
  a `is-highlight` modifier uses `624/1120` and full-bleed 2-column
  layout.
- **Caption:** `max-w-5/14` mobile → `lg:max-w-none` desktop, with
  `lg:pl-40` gutter.
- **Color theming:** per-card `--color-primary` (a Prismic color) sets
  the title text and the inline "case-study" caption color
  (`style="--color-primary:#CAC0A8;"` etc.).
- **Baseline:** the small italic-flavor `paragraph-small` line under
  the title fades in on scroll (`transform: translate(-40px,0); opacity: 0`).
- **Hover (not directly visible, but inferred from `gsap-hidden` and
  the `--text-opacity` CSS var):** the related card overlay color
  shifts to white with a `text-opacity` CSS variable.

### Image trail (`image-trail`)
- **Anatomy:** a 16-image circular marquee (the dump's
  `Project+trail_01..16.png` assets), each wrapped in `<span class="image-reveal">`
  with a `rounded-full overflow-hidden` mask and an `embed-responsive`
  inner. Images are clipped to an aspect ratio of `0.561` (≈ 16:9) but
  each rotates around a circular `image-reveal--mask`.
- **Behavior:** images are hidden (`opacity:0`) by default and revealed
  in sequence as the user scrolls past the section (the inline JS sets
  `transform: translate(0,0)` on intersection).

### Form field (`form-field`, `newsletter-form`, `sign-up-form`)
- **Anatomy:** a grid-stacked `label` + `input` (using
  `grid-template-areas: 1/1` so the label can float above the input).
  The `data-value` attribute holds the live value for an `::after`
  measurement pseudo.
- **Floating label:** the label sits in normal flow at `font-size:
  1.125rem`, then animates `transform: translate3d(0,-1.5rem,0)` on
  `.is-active` with `cubic-bezier(.4,0,.2,1) 150ms`. The label
  `<span>` shrinks to 73.3% (lg) or 77.8% (default) when set.
- **Required marker:** a 4×4 px red dot (`#ea6161`, `border-radius:
  9999px`) appears as a `label:before` pseudo with `transform: scale(0→1)`
  and `cubic-bezier(.4,0,.2,1) 150ms`.
- **Error / response:** `slide-fade` Vue `<transition>` group (200 ms
  `transform/opacity`).
- **Inline newsletter form (footer):** label scales down to 87.5% of
  the page baseline via `transform: scale(.875) translateZ(0)` to
  match the surrounding tiny type.

### Modal (`div.modal`)
- **Backdrop:** `background-color: rgba(0,0,0,0.85)` (computed: 85% black).
- **Dialog:** centered, `max-w-14/18` (78% of container), `pointer-events: auto`
  on the content card, `none` on the wrapper.
- **Close icon:** rotated 45° `.icon-close` plus an `aria-modal="true"`
  region and `tabindex="-1"` focus trap.
- **Enter/exit:** opacity 0 → 1, `visibility: hidden → visible`,
  `pointer-events: none → auto` (driven by Vue `<transition>`).

### Hero (`module--hero-with-type`)
- **Background:** `bg-black-noise` (the repeating PNG grain) with a
  `linear-gradient(180deg, rgba(15,15,15,0.4), transparent)` 150 px
  fade at the top (mobile only — `display: none` on lg+).
- **Headline layout:** a single `<div class="hero-headline">` flex
  row, three "headline" words (`Global`, `Creative`, `Studio`) each
  in `hero-headline__heading` (Beatrice Display Light, 105px → 8.25vw
  clamp) flanked by two `.hero-headline__caption` tiny sub-lines
  (Biotif 13px, `line-height: 1`, `tracking-none`) — "We turn
  aesthetics into experiences" and "tech that's light as air" — each
  with an `<u>` underline that animates from `transform: scale(0,1)`
  to `scale(1,1)` via GSAP on scroll-in.
- **Hero dot:** `Studio` ends with `<i class="dot dot--hero">` whose
  child Lottie (`viewBox 0 0 144 32`) animates a small white shape
  with `transform-origin: 0% 50%` (the dot itself, also reused as
  `dot--bounce` and `dot--bounce-big` elsewhere).
- **Body video (not in homepage render, but module spec):**
  `module--hero__background__media video` fills the section with
  `object-fit: cover`.
- **Heights:** `max-height: 36rem` mobile → `47rem` `lg` → `100vh` /
  `48vw` at `1600px+`. `padding-bottom: 7rem lg / 3.5rem lg / 2rem sm`.

### Makemeplay CTA (`module--makemeplay`)
- **Container:** a scroll-driven `clip-path` reveal. The container's
  `--path-origin` and `--path-destination` CSS custom properties are
  driven by JS; the `clip-path` interpolates between them with
  `transition: clip-path 1s cubic-bezier(.66,0,.34,1)`. When
  `.is-reduced` is applied, the path is the destination, fully visible.
- **Title:** "We also do games." at `font-size: 7.5rem (lg) → 12.5rem
  (xl) → 12.5rem` capped at `200px`, `font-weight: 700`, `line-height:
  0.8`, `margin-bottom: 60px`.
- **Sub-paragraph:** Biotif 12px uppercase ("Gaming is the future of
  experience. We make games with heart. We make games that deliver.")
  in a `lg:col-start-3 lg:col-span-3` column.
- **CTA:** `<a class="cta" href="https://play.makemepulse.com"
  target="_blank">` with the same `.cta__label` / `.cta__arrow` pattern.
- **Decorative overlap:** the section's `::before` (`.has-top-color`)
  and `::after` (`.has-bottom-color`) are 8rem pseudo-strips that take
  the color of the modules above and below, blending the clip into the
  surrounding flow.

### Video player (`module--video-player`)
- **Padding:** `pt-40 pb-40` mobile → `pt-160 pb-24` desktop.
- **Play/pause buttons:** `.video-player__btn--play` and
  `.video-player__btn--pause` are 4.5rem (mobile) / 8rem (lg) round
  buttons positioned at the video center.
- **Custom cursor:** on hover, the cursor is replaced by
  `.cursor-type--video` (Lottie 64 / 128 px) that sits over the
  showreel poster image (`mmp-home-showreel-cover.jpg`).

### Discover blocks (`module--discover-wwd`, `module--discover-wwa`)
- **Layout:** side-by-side `field--image` + `field--text` columns.
- **Image aspect:** 216/336 mobile → 280/400 (WWD) or 536/720 (WWA).
- **Text minimum height:** 8.5rem (WWD) / 20.5rem (WWA) at `lg+`.
- **Link:** `.link-big` is a `position: relative` anchor with an
  `::after` pseudo that fills the whole box to make the entire
  thumbnail clickable.
- **Theme:** `.theme-light` (WWD) on `bg-gray-light-noise`; WWA
  defaults to dark.

### Blog / news (`module--blog`)
- **Card:** `article` with `<time>` (Biotif 10px, uppercase, tracking-tight),
  title, excerpt, and an image with `rounded` clipping.
- **Time element:** `font-size: 10px; line-height: 8px; margin-top: 0;
  padding-top: .0875rem; padding-bottom: .4125rem; margin-bottom: .5rem`
  — a typical small-caps date stamp.
- **Theme:** dark on `bg-black-noise`.

### Newsletter form (`module--newsletter`)
- **Padding:** `py-80 (sm) / py-144 (lg)`.
- **Background:** a 30rem-tall decorative `module__bg` (an
  `mmp-newsletter.webp` illustration) sitting behind the form, behind
  the `bg-gray-light-noise` texture.
- **Layout:** `grid grid-cols-14` with a `title-small` heading on
  `col-start-2 col-span-12 (lg:col-start-3 lg:col-span-10)` and the
  form on the right column.

### Footer (`app-footer`)
- **Layout:** `grid grid-cols-14 lg:grid-cols-5` with a top row
  (Offices / Business / Say Hi / Contact / Follow Us) and a bottom
  row (socials, newsletter inline form, copyright, logo lockup).
- **Accordion behavior:** `[aria-expanded]` toggles a `+` (drawn as
  two crossed 1 px lines via `linear-gradient` backgrounds) ↔ `−`
  (single horizontal line) on the four top-row titles, but only on
  mobile (`display: none` at `lg+`).
- **City block:** Paris (`38 rue Legendre, 75017 Paris`) and London
  (`Becket House, 1 Lambeth Palace Road, London SE1 7EU`) with
  `paragraph-xsmall` (11px) copy.
- **Business block:** five regional contact emails
  (`sales@…`, `uk@…`, `eastcoast@…`, `midwest@…`, `westcoast@…`).
- **Socials:** LinkedIn, Instagram, X, Behance as a flex column
  with `column-gap: 50px; row-gap: 16px (mobile) / 50px (lg)`; each
  link has `transition: opacity .15s ease-in-out` to `opacity: .5` on
  hover.
- **Bottom bar:** copyright + `logo-mmp--logogram` (the three dots)
  + tagline "Global Creative Studio". The `hr` is a 1 px `bg-gray-700`
  with `transform: scale(4,1)` (a stretched divider line) at
  `transform-origin: 0% 50%`.

### Scrollbar (custom)
- A floating `.c-scrollbar` is appended to the body by Locomotive
  Scroll. The thumb is `height: 91.5875px` and a 3D matrix transform
  updated on scroll.

### Spinner / loader
- `@keyframes spinner-translate` and `@keyframes spinner-scale` are
  defined (only those two keyframes are in the inline CSS). `translate`
  runs `666ms cubic-bezier(.76,0,.24,1) infinite alternate`; `scale`
  runs `333ms cubic-bezier(.48,.04,.52,.96) infinite alternate`. A
  2-px white progress bar also exists at the top of the page
  (`.nuxt-progress`) — the standard Nuxt loading indicator.

---

## JavaScript & Libraries

| Library | Version (where visible) | Detection | Notes |
| --- | --- | --- | --- |
| Nuxt 2 | `2.6.11` (string in `js/app.904f04b__2c2122f8.js`) | `_nuxt/runtime.*.js`, `_nuxt/app.*.js`, `_nuxt/pages/<route>.*.js`, `nuxt-progress` style | SPA / SSR with route-based code splitting; static build at hash `1780466551` |
| Vue 2 | `2.x` (transitions, `v-show`, `:class`, `data-v-…` scope IDs) | `app.904f04b__2c2122f8.js`, per-component `data-v-…` attrs | SFC compile output; `<transition mode="out-in">` for the page route transitions |
| GSAP | `3.x` (timeline + plugin helpers) | `js/app.5581699__d4d7299c.js` defines `quad.inOut`, `quad.in`, `quad.out`, `cubic.inOut`, custom eases; `ScrollTrigger`-style `gsap.timeline({onComplete:…}).from(r, {opacity:0, …})` | Page transitions and `gsap-hidden` class strategy for FOUC-free intro animation |
| Locomotive Scroll | `4.x` (matches `4.d2ff13f__…js` chunk name) | `js/4.d2ff13f__600504a4.js`, `data-scroll-container`, `data-scroll-section-inview` | Provides smooth scroll, data-attribute hooks, custom scrollbar |
| Lottie (lottie-web) | `5.7.0` (in `vendors~app` chunk) | `vendors~app.a75f3d4__46c04598.js` `version:"5.7.0"`, `Lottie` class refs, every `lottie-container` div in HTML | Renders the inline-SVG-format Lottie JSON for dots, arrows, play cursors, the makemeplay CTA arrow |
| Three.js | `0.160+` (WebGL renderer references in `payload__f4e0a32a.js`) | `Three.WebGLRenderer`-style patterns in `payload__f4e0a32a.js` (`new THREE.`, `three.js` matches) | Likely used on case-study and makemeplay sub-pages (homepage render does not show a canvas) |
| Prismic | `@prismic/client` slice names in `payload__f4e0a32a.js` (702 matches) | `js/payload__f4e0a32a.js` (Prismic content tree: `slice_type`, `primary`, `items`); `prismic.img` URL pattern (`images.prismic.io/makemepulse/…`) | Headless CMS — every section ("hero-with-type", "grid", "video-player", "makemeplay", "discover-wwd", "discover-wwa", "blog", "newsletter", "faq", "embed", "quote-text", "sign-up", "sign-up-cta", "simple-text", "slideshow", "hero-error", "hero", "landing-screen") is a Prismic slice |
| Cookiebot | `bc-v4.min.html` consent iframe | `playwright/html/bc-v4.min__8b9385b8.html` | GDPR consent management |
| Google Tag Manager | `GTM-N4GDC4WD` | inline `dataLayer.push({gtm.js…})` script | Analytics container |
| YouTube IFrame API | `www-widgetapi__49b721c7.js` | `js/www-widgetapi__49b721c7.js`, `player_api` chunk | Used to embed the studio's showreel |

The site does **not** use Tailwind utility-classes alone — the
class strings (`lg:col-start-2 lg:col-span-16 text-center`,
`lg:mb-104`, `bg-black-noise`, `text-primary`, `bg-darker`,
`bg-white`, `text-13`, `text-8`, `bg-gray-700`, `text-black`) are
all custom utility classes compiled by the studio's Nuxt build —
they are not Tailwind's defaults. There is no `tailwind.config.js`
in evidence and the dump contains no `tailwindcss` chunk.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `spinner-translate` | `playwright/homepage.html` (inline `<style>`) | 666ms | `cubic-bezier(.76,0,.24,1)` `infinite alternate` | page load (loading spinner) |
| `spinner-scale` | `playwright/homepage.html` (inline `<style>`) | 333ms | `cubic-bezier(.48,.04,.52,.96)` `infinite alternate` | page load (loading spinner) |

These are the only two `@keyframes` blocks in the inline CSS; every
other motion is either a CSS `transition` or a JS-driven GSAP /
Lottie animation.

### CSS transitions (selected, by role)

| Property | Selector | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `opacity` | `.module--makemeplay .background` | 0.8s | `cubic-bezier(.26,1,.48,1)` | scroll / `is-reduced` toggle |
| `clip-path` | `.module--makemeplay .container` | 1s | `cubic-bezier(.66,0,.34,1)` | scroll-in (driven by `--path-destination`) |
| `transform` (translateY) | `.app-header__navbar:after, .app-header__navbar:before` | 0.5s | `cubic-bezier(.66,0,.34,1)` | `.is-sticky` + hover |
| `color` | `.app-header__navbar .text-primary` | 166ms | `linear` | theme swap (dark ↔ light) |
| `fill` | `.app-header__navbar .fill-primary, .fill-secondary` | 166ms | `linear` | theme swap |
| `transform` | `.cursor-type` | 0.667s | `cubic-bezier(.4,.8,.74,1)` | pointer-move (JS) |
| `opacity` | `.app-footer .socials a` | 0.15s | `ease-in-out` | hover |
| `transform, opacity` | `.form-field label`, `.form-field[data-value]:after`, `.newsletter-form__response` | 0.15s | `cubic-bezier(.4,0,.2,1)` | `.is-active` (form focus) |
| `transform` | `img.is-loaded` (Prismic image reveal) | 0.333s | `cubic-bezier(.26,1,.48,1)` | image decoded |
| `transform` (scale) | `.app-footer [aria-expanded]:after, :before` | (instant, opacity swap) | — | accordion open/close |
| `width, opacity` | `.nuxt-progress` (Nuxt top loader) | 0.1s / 0.4s | `linear` | route change |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | `gsap.timeline().from(r, {opacity:0, duration: fn(10), stagger: fn(3), clearProps:"opacity"})` | route `<transition enter>` (page change) | Animates the first 8 case-study cards into view on every page transition. From `js/index.dcccef5__d8f94816.js` function `472`. |
| GSAP | per-element hero reveal (`gsap-hidden` → `visibility: inherit`) | `data-scroll-section-inview` (Locomotive Scroll) | The `gsap-hidden` class is on every animated node; JS removes the class on intersection. |
| GSAP | `<u>` underline scale | scroll / hover | Inline `<u>` elements use `transform: scale(0,1) → scale(1,1)` with a transform-origin set per side (left/right) of the text. |
| Lottie | `dot--hero`, `dot--bounce`, `dot--bounce-big` Lottie animations | always-on / hover | Each `dot` is a 144×32 (hero) or 2.5em × 0.83em (bounce) Lottie; rotated 90° in CSS for the bounce variants. |
| Lottie | `cursor-type--video` play cursor | pointer over showreel | 4rem (mobile) / 8rem (lg) Lottie. |
| Lottie | `cta__arrow` (makemeplay CTA) | mount / hover | Black arrow drawn with `transform: matrix(0.9659,-0.2588,0.2588,0.9659,…)` (a 15° rotation) in the Lottie JSON. |
| Locomotive Scroll | `data-scroll-container`, `data-scroll-section-inview` | scroll | Provides the smooth-scroll, scrollbar, and `inview` event bus; the studio's `eventHub` re-emits it as `scroll:update` (see `js/index.bda2454__b8237f34.js`). |
| Vue `<transition>` | `name="slide-fade"`, `mode="out-in"` | route change / form state | Used on form-field error / response messages and on the top-level `<Nuxt>` page transition. |

### Page transitions

- `<Nuxt>` `transition.css: false`, `transition.appear: true`,
  `transition.mode: "out-in"`, with a `gsap.timeline().from(r, …)` enter
  hook on the first 8 `.module--grid .card` elements (from
  `js/index.dcccef5__d8f94816.js` chunk `471`).
- The route change also fires `dataLayer.push({event:
  "gtm.scrollDepthReset"})` to clear analytics scroll depth.

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump. Three.js is loaded as a
library (the `payload__f4e0a32a.js` chunk carries it) but no
`models/` directory exists in this dump; 3D scenes are presumably
served on case-study pages or `play.makemepulse.com` rather than the
homepage render.

### Fonts

| Family | Weights / styles | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Biotif | 300, 400, 400 italic, 500, 700 | woff2 + woff (10 files) | `/_nuxt/fonts/3B2986_1_0.*.woff[2]`, `3B2986_4_0.*`, `3B2986_5_0.*`, `3B2986_6_0.*`, `3B2986_E_0.*` | yes (in dump `playwright/fonts/`) |
| Beatrice Display | 300 (Light) | woff2 + woff (2 files) | `/_nuxt/fonts/BeatriceDisplay-Light.*.woff[2]` | yes (in dump `playwright/fonts/`) |

All fonts are served from the same Nuxt build via `/_nuxt/fonts/...`
with a Prismic-style 8-char token. No Google Fonts, no Adobe Fonts.

### Images

Inventory of every image in the dump's `playwright/images/` folder.
All project assets come from `images.prismic.io/makemepulse/…` (Prismic
CDN); the dump is a per-render mirror that Playwright captured.

| Local path | Type | Dimensions (intrinsic from HTML where present) | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `playwright/images/black-noise.e7f3cd7__30ba39f9.png` | PNG | 1×1 (tiled) | 18109 B | `/_nuxt/img/black-noise.e7f3cd7.png` | dark grain texture, hero / footer background |
| `playwright/images/gray-light-noise.a2fc79b__ec471f73.png` | PNG | 1×1 (tiled) | 16622 B | `/_nuxt/img/gray-light-noise.a2fc79b.png` | light grain texture, used on light modules |
| `playwright/images/makemeplay-background@2x.540abac__02aa03e8.webp` | WebP | (responsive) | 16048 B | `/_nuxt/img/makemeplay-background@2x.540abac.webp` | abstract bg under makemeplay clip |
| `playwright/images/mmp-newsletter.133311e__fd37e116.webp` | WebP | (decorative) | 80210 B | `/_nuxt/img/mmp-newsletter.133311e.webp` | newsletter section background illustration |
| `playwright/images/07747809-…_mmp-home-showreel-cover__6f0b6208.jpg` | JPG | 1600×752 (Prismic `rect=0,0,1600,752`) | 33123 B | `images.prismic.io/makemepulse/07747809-…_mmp-home-showreel-cover.jpg` | showreel poster image |
| `playwright/images/aXJV_AIvOtkhB08i_cover-image__8212d6ca.jpg` | JPG | Prismic `rect=0,0,3200,1504` | 94348 B | `images.prismic.io/makemepulse/aXJV_AIvOtkhB08i_cover-image.jpg` | case study "Brunello Cucinelli" cover (×2 hashes — high & low DPR) |
| `playwright/images/aXJV_AIvOtkhB08i_cover-image__791049c4.jpg` | JPG | same as above | 116429 B | same | larger variant |
| `playwright/images/ah8S4weQX7-eWk52_cover-image__c84c8bb7.jpg` | JPG | 3200×1504 (rect) | 64082 B | `images.prismic.io/makemepulse/ah8S4weQX7-eWk52_cover-image.jpg` | case study "Benno's Light" cover |
| `playwright/images/ah8S4weQX7-eWk52_cover-image__33a29e97.jpg` | JPG | same | 64078 B | same | (DPR variant) |
| `playwright/images/agQ8SaYofJOwHK4L_mmp-case-mcdo-rostifall-01__abcca3d9.png` | PNG | 1600×752 | 39066 B | `images.prismic.io/makemepulse/agQ8SaYofJOwHK4L_mmp-case-mcdo-rostifall-01.png` | case study "McDonald's Rösti Fall" cover (×2 DPR variants) |
| `playwright/images/agQ8SaYofJOwHK4L_mmp-case-mcdo-rostifall-01__18c9e7ce.png` | PNG | same | 39066 B | same | (DPR variant) |
| `playwright/images/55f339a4-…_Project+trail_01__bcc556c4.png` | PNG | 989×555 (rect) | 7686 B | `images.prismic.io/makemepulse/55f339a4-…_Project+trail_01.png` | image-trail frame 01 (of 16) |
| `playwright/images/861e57c1-…_Project+trail_02__e8f6c764.png` | PNG | — | 12632 B | same | image-trail frame 02 |
| `playwright/images/c9754272-…_Project+trail_03__64f6b83c.png` | PNG | — | 5655 B | same | image-trail frame 03 |
| `playwright/images/63b81659-…_Project+trail_04__f88d703b.png` | PNG | — | 10441 B | same | image-trail frame 04 |
| `playwright/images/a0efe452-…_Project+trail_05__916e3bc9.png` | PNG | — | 16662 B | same | image-trail frame 05 |
| `playwright/images/4df9be94-…_Project+trail_06__1cfb4cfa.png` | PNG | — | 8097 B | same | image-trail frame 06 |
| `playwright/images/55299e6d-…_Project+trail_07__6b90d6a1.png` | PNG | — | 6415 B | same | image-trail frame 07 |
| `playwright/images/002c215d-…_Project+trail_08__81169c16.png` | PNG | — | 5233 B | same | image-trail frame 08 |
| `playwright/images/8b46e86b-…_Project+trail_09__fd53b5e0.png` | PNG | — | 11471 B | same | image-trail frame 09 |
| `playwright/images/c851c991-…_Project+trail_10__702e1c05.png` | PNG | — | 25903 B | same | image-trail frame 10 |
| `playwright/images/74e243ce-…_Project+trail_11__f6b69eda.png` | PNG | — | 9234 B | same | image-trail frame 11 |
| `playwright/images/b30592ed-…_Project+trail_12__c5c9c419.png` | PNG | — | 6557 B | same | image-trail frame 12 |
| `playwright/images/9db4bf8b-…_Project+trail_13__82935f45.png` | PNG | — | 5079 B | same | image-trail frame 13 |
| `playwright/images/27dd1888-…_Project+trail_14__6797de02.png` | PNG | — | 5254 B | same | image-trail frame 14 |
| `playwright/images/153ee20e-…_Project+trail_16__fc996ed5.png` | PNG | — | 4065 B | same | image-trail frame 16 (frame 15 is not in this dump) |

### SVGs & icons

- **Inline SVGs in HTML** (homepage render):
  - 1× brand header logo (`logo-mmp--logotype`, 179×26 viewBox).
  - 1× brand footer logo (`logo-mmp--logogram`, 160×40 viewBox).
  - 1× brand makemeplay logo on the CTA section.
  - 5+ Lottie-rendered SVGs (`lottie-container` divs with inline
    `viewBox` + paths; each is a JSON-Lottie animated to
    `translate3d(0px,0px,0px)`).
  - 1× hero dot Lottie (`viewBox 0 0 144 32`).
  - 1× makemeplay arrow Lottie (`viewBox 0 0 128 128`).
  - 1× showreel play cursor Lottie (`viewBox 0 0 128 128`).
- **Standalone SVG files in dump** (`playwright/svgs/`):
  - `38c273ecec09fa88e3b671814ecc44c0__83b02b3b.svg` — 7-symbol
    SVG sprite (`i-arrow`, `i-drag`, `i-filters`, `i-handle`,
    `i-pause`, `i-play`, `i-submit`).
  - `d98f5128ee4d35631eb90a41c3a5a3f4__6ce43360.svg` — 128×128
    icon (an arrow with two-piece head, stroke `#000` width 2).
- **Icon system:** a hand-rolled inline SVG sprite referenced by
  `<use href="#i-…">` plus a parallel set of Lottie animations for
  anything that needs to move (dots, cursors, CTA arrows). There is
  no Lucide, Phosphor, or Heroicons dependency.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| (none in dump) | — | The site is set up to play a YouTube showreel via the YouTube IFrame API (`www-widgetapi__49b721c7.js`, `player_api__eb666964`), but no `.mp4` / `.webm` was captured into the dump. The hero `<video>` element is also referenced in CSS but is not used on the homepage render — it lives in the module CSS for `module--hero__background__media` so case-study pages can show a background video. |

### Other (notes & settings payloads)

| Local path | Type | Notes |
| --- | --- | --- |
| `playwright/other/settings__5453cbbf.json` | JSON | Prismic repo settings (605 B). |
| `playwright/other/brand-header__2a76cb99.json` | JSON | Brand-header content slice from Prismic (51 KB). |
| `playwright/other/v2__84ae9465` | untyped | Prismic `v2` token / cache (1825 B). |
| `playwright/html/asset_0__0748e95b` | HTML | The static-pass mirror of the homepage (126 KB). |
| `playwright/html/bc-v4.min__8b9385b8.html` | HTML | Cookiebot consent iframe source. |

---

## Motion & Interaction

### Principles
- The site is Locomotive-Scroll-pinned: scrolling drives both the
  smooth-scroll and a custom scrollbar, and exposes
  `data-scroll-section-inview` for reveal triggers.
- Default easing vocabulary (sampled from inline CSS):
  - micro: `cubic-bezier(.4,0,.2,1)` (Material standard, used on
    form fields, 150 ms).
  - small: `cubic-bezier(.66,0,.34,1)` (ease-in-out, 500 ms – 1 s,
    used on header background and the makemeplay clip-path reveal).
  - medium: `cubic-bezier(.26,1,.48,1)` (ease-out expo, 333–800 ms,
    used on image reveal and makemeplay background).
  - large: `cubic-bezier(.4,.8,.74,1)` (custom, 667 ms, used on the
    floating cursor).
- Default durations: 150 ms (form), 166 ms (theme swap),
  333 ms (image reveal), 500–1000 ms (section / header),
  1 s (clip-path).

### Specific behaviors
- **Header on scroll:** transparent over hero; on `is-sticky` a
  100%-white or 100%-black vertical gradient is layered behind the
  navbar with `transform: translateY(-20px)` → `0` and `opacity: 0`
  → `.6` (on hover), 500 ms `cubic-bezier(.66,0,.34,1)`.
- **Hero reveal:** the `gsap-hidden` class hides every animated
  element with `visibility: hidden`; GSAP timelines (likely driven
  by Locomotive `inview`) flip the visibility and translate the
  element from its starting position to its natural layout.
- **Underline scale:** every inline text link uses a `<u>` whose
  `transform-origin` is set to one side of the text (e.g.
  `transform-origin: 0% 50%` for left-aligned links, `100% 50%` for
  right-aligned). On hover / on scroll-in, the underline scales
  from `0` to `1` along the x-axis with a 200-ish ms ease.
- **Image reveal:** Prismic `prismic-img` carries `is-loaded`; on
  load the parent `image-reveal` `::after` mask animates from
  `transform: translate(0,0); opacity: 0` to its final state.
- **Makemeplay clip-path reveal:** the section's
  `clip-path: var(--path-origin)` morphs to
  `clip-path: var(--path-destination)` over 1 s
  `cubic-bezier(.66,0,.34,1)` when `.is-reduced` is added by the
  scroll-in JS handler.
- **Form focus:** the label slides up `translate3d(0,-1.5rem,0)`
  and shrinks to 73.3% (lg) / 77.8% (default); the red required-marker
  dot scales from 0 → 1; both with 150 ms
  `cubic-bezier(.4,0,.2,1)`.
- **Modal:** `pointer-events: none → auto`, `opacity: 0 → 1`,
  `visibility: hidden → visible` on `[aria-expanded]` / route
  trigger.
- **Showreel play cursor:** the system cursor is hidden over the
  showreel and replaced by a Lottie 64–128 px round "play" badge
  centered on the cursor (`transform: translate3d(-50%,-50%,0)`).

### Reduced motion
- **Not observed.** The dump's CSS does not contain a
  `@media (prefers-reduced-motion: reduce)` block, and the
  `gsap-hidden` / Locomotive strategy is the only motion gating in
  evidence. (Likely a TODO on the studio's roadmap rather than a
  shipped feature; this is a *not-observed* call to flag, not an
  assertion of compliance.)

---

## Content & Voice

- **Tone:** confident, direct, design-literate. The hero says
  "Global Creative Studio" with two side-captions — "We turn
  aesthetics into experiences" and "tech that's light as air" —
  setting up the studio as a design-and-engineering hybrid.
- **Sentence length:** short to medium. The discover blocks use
  half-sentences ("A digital testimony by makemepulse and the
  Claims Conference", "From loyalty program to entertainment
  platform"); the case-study grid leaves most of the storytelling
  to the linked case-study page.
- **Capitalization:** sentence case in headings ("We also do
  games.", "Give an email, get the newsletter.") with a heavy
  reliance on small-caps (`cap-small`, 10 px, `font-weight: 700`,
  uppercase) for eyebrow labels.
- **Punctuation:** minimal, no Oxford-comma dependence visible.
  En-dashes / em-dashes are not used in the homepage render.
- **CTA vocabulary:** "Discover makemeplay.", "Apply now",
  "Contact", "Reach out using our cool contact form", "Follow Us"
  (LinkedIn / Instagram / X / Behance). The contact form action
  endpoint is `eastcoast@…`, `westcoast@…`, etc.
- **Localization:** English only on the homepage render; the
  French/UK/US address block hints at multilingual content living
  on sub-pages.

---

## Information Architecture

Top-level routes observed in the homepage HTML and in the page-chunk
filenames in the dump:

- `/` — marketing homepage (sections listed in **Layout & Grid**).
- `/case-studies/` — index of all case studies (chunk
  `js/case-studies.e6ea48a__ea5d242b.js`).
- `/case-study/<slug>` — case-study detail page. Observed slugs:
  - `/case-study/brunello-cucinelli-ai-shopping-experience`
  - `/case-study/bennos-light-claims-conference`
  - `/case-study/mcdonalds-france-rosti-fall-loyalty-mobile-game`
  - Generic `_slug.fbee755__1598b9a6.js` chunk for the rest.
- `/news/` — news index (chunk `js/news.00aac14__dde4c364.js`).
  Recent items referenced in homepage HTML: "Light in the darkness:
  powerful XR experience", "makemepulse inducted into the FWA Hall
  of Fame", "We're sponsoring three.js conf Paris".
- `/what-we-do` — capabilities / services (chunk
  `js/what-we-do.e2d3757__6dc3da00.js`).
- `/who-we-are` — about / team (chunk
  `js/who-we-are.7ac02b3__a6bfebc3.js`).
- `/contact` — contact form / regional emails (chunk
  `js/contact.9a0f199__08f175a2.js`).
- `https://play.makemepulse.com` — external spin-off, the
  makemeplay gaming platform (linked from the makemeplay CTA).
- Auth: no `/login` or `/signup` is exposed on the marketing site
  (the `module--sign-up` / `module--sign-up-cta` slices in Prismic
  appear to be for newsletter / contact form variants, not auth).

For each, one sentence on its purpose and primary component:
- `/` is the marketing pitch; its primary component is the
  `module--hero-with-type` followed by the case-study grid.
- `/case-studies/` is a Prismic-driven grid; primary component is
  a card list.
- `/case-study/<slug>` is a Prismic story page with hero, video,
  parallax blocks; primary component is the case-study hero.
- `/news/` is a chronological index; primary component is a small
  blog card.
- `/what-we-do` and `/who-we-are` are marketing copy pages built
  from text-and-image blocks.
- `/contact` is a regional contact form with a multi-tab layout
  (`contact-tabs` in the JS chunks).

---

## Accessibility

- **Color contrast:** primary text `#0F0F0F` on `#FFFFFF` background
  measures 19.95:1 (very high). White text on `#000000` hero
  measures the same. The purple accent `#896FFF` is **not used
  for body text** — it appears only as a background tint, an
  icon/CTA arrow color, and a low-alpha shadow; its contrast on
  white is 4.0:1 (acceptable for large text, borderline for body).
- **Focus indicators:** not directly observed in the captured CSS
  (the global `button:focus { outline: 5px … }` from normalize.css
  is the only `outline` rule in evidence). No custom
  `:focus-visible` ring was found in the dump; this is a flag
  rather than an assertion of non-compliance.
- **Keyboard:** all interactive elements are real `<a>` / `<button>`
  elements; the modal carries `role="dialog"`, `aria-modal="true"`,
  `tabindex="-1"`. Footer accordions use `aria-expanded` and
  `aria-controls` / `aria-labelledby`. The hamburger button is a
  real `<button>`.
- **Screen-reader landmarks:** the page has a `<header>`, a `<main>`
  (`#__layout > .relative > .overflow-hidden > main`), a `<nav>`
  inside the header, and a `<footer>`; an `.sr-only` H1 contains
  the canonical page title.
- **Motion:** see *Reduced motion* above — no
  `prefers-reduced-motion` rules were observed.
- **Alt text:** every Prismic image carries a non-empty `alt` (e.g.
  "Brunello Cucinelli - Makemepulse", "Benno's Light - Makemepulse",
  "McDonald's Rösti Fall - Makemepulse"); decorative image-trail
  frames use `alt=""` and `loading="lazy" fetchpriority="low"`.
- **Cookies:** a Cookiebot banner (`bc-v4.min.html`) is loaded
  with `aria-hidden="true"` iframes; the actual consent UI is
  injected at runtime.

---

## Sources

Every URL observed while writing this specification.

- Homepage — https://www.makemepulse.com/ (rendered into
  `playwright/homepage.html`)
- Brand-header Prismic slice —
  `playwright/other/brand-header__2a76cb99.json`
- Prismic image CDN (project assets) —
  `https://images.prismic.io/makemepulse/…` (62 distinct URLs across
  case-study covers, image-trail frames, and section backgrounds)
- Google Tag Manager — `https://www.googletagmanager.com/gtm.js?id=GTM-N4GDC4WD`
- Cookiebot — `https://consentcdn.cookiebot.com/sdk/bc-v4.min.html`
- YouTube IFrame API — `https://www.youtube.com/iframe_api`
  (`www-widgetapi__49b721c7.js`, `player_api__eb666964`)
- Spin-off platform — https://play.makemepulse.com
- Font CDN (self-hosted) — `/_nuxt/fonts/{3B2986_*,BeatriceDisplay-Light}.{woff2,woff}`
- OG image — `https://images.prismic.io/makemepulse/7820b0e5-9cc5-43e8-a093-7fcb89e2bf3d_makemepulse-background.png?auto=compress,format&rect=0,1,1601,838&w=1080&h=565`
- Favicons — `/images/icons/{apple-touch-icon,favicon-16x16,favicon-32x32}.png`
- Build manifest (Nuxt) — `/_nuxt/static/1780466551/{state,payload}.js`
- Apple-touch / favicon variants — `/favicon.ico`,
  `/images/icons/apple-touch-icon.png`

---

## Changelog

- 2026-06-19 — Initial draft by sub-agent (Phase 2). Static-pass
  dump was empty (Cloudflare/anti-bot); all observations come from
  the Playwright `homepage.html`, `homepage.png`, `homepage-fullpage.png`,
  `computed-styles.json`, `playwright/js/*.js`, `playwright/fonts/*`,
  `playwright/images/*`, `playwright/svgs/*`, and the manifest.
