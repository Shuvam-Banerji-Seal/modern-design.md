# Monks (media.monks.com) — design.md

> A structured design specification of **https://media.monks.com**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** design.md lead agent
> **Source dump:** `tools/tmp/media-monks/` (gitignored; `html/`, `css/`, `js/`,
> `fonts/`, `images/`, `svgs/`, `media/`, `other/` are empty, so the
> Playwright-runtime capture under `playwright/` is treated as the
> canonical dump).

---

## Overview

media.monks.com is the global marketing site of **Monks** (formerly
MediaMonks), the digital-monopoly subsidiary of S4 Capital. The page is
a long-scroll Drupal 10.6.9 marketing site for a creative-and-tech
agency: it sells services, showcases case studies (work tiles), and
captures newsletter signups. The visual language is editorial-modern:
near-black ink on warm off-white, a tight 12-column grid, large display
type in a custom geometric sans ("Helvetica Now" + "Helvetica Now
Extended"), and a heavy reliance on **autoplay muted video posters**,
**dotLottie** animated illustrations, and a custom hero where a "M" mark
traces a curved path into the viewport on first paint. The site is
front-end rich but not heavily framework-driven; the custom design
system is a flat-file CSS bundle plus a small ES module set built on
`data-component` selectors. Tone: confident, direct, and quietly
maximalist — every section is treated like a full-bleed editorial
spread.

**Category:** Marketing (agency)
**Primary surface observed:** Homepage (`/`) only — captured by Playwright
as a single full-page DOM (`playwright/homepage.html`, 3,584 lines, 663 KB)
and full-page screenshot (`playwright/homepage-fullpage.png`, 1.4 MB).
**Tone:** confident, technical, slightly playful, deliberately sparse
in chrome but dense in motion.
**Framework detected (if any):** **Drupal 10.6.9** with a custom
`monks` theme. jQuery 3.7.1 ships for Drupal core; the marketing
runtime is plain ES modules under `playwright/js/` (Lottie
player-driven), with no React / Vue / Svelte. The build is delivered
as one large `main__7c11b9b6.css` (~1,200 KB, minified) and 70 hashed
ES modules under `playwright/js/`.

---

## Visual Language

### Color

The site is built on a **paired-tone palette** that flips per section
via two CSS custom properties, `--themed-foreground` (text/icon) and
`--themed-background` (surface). These are the only semantic colors
that change per component instance; everything else is a fixed scale.

| Role | Token / source | Value | Closest name | Notes |
| --- | --- | --- | --- | --- |
| Surface (light base) | `--themed-background` | `#EAE8E4` | Alabaster / warm bone | Default page bg, components, cards |
| Surface (dark base) | per-section override | `#191715` | Near-black, warm | Used by `[data-component=n3-multi-language]` band and "dark" sections |
| Surface (deep ink) | body / header inverse | `#2D2D2D` | Dark gray | Theme `meta[name=theme-color]`, footer variant, video controls bg |
| Text (primary) | `--themed-foreground` | `#2D2D2D` | Dark gray | Default body and label text |
| Text (primary, light) | per-section override | `#EAE8E4` | Alabaster | Used when surface is `#191715` or `#2D2D2D` |
| Text (secondary / meta) | inline | `#68655F` | Warm gray | Filter sub-labels, copy-deck meta |
| Text (placeholder / faded) | inline | `hsla(40, 12%, 91%, 0.5)` | Alabaster @ 50% | Video scrubber timecodes |
| Accent (focus ring) | `o27-tags-filter`, etc. | `#2861C5` | Bright cobalt | Visible focus rings + Lottie UI accents |
| Accent (red) | n/a | `#B81C21` | Brick red | Form error borders, error copy |
| Border (subtle) | inline | `rgba(45, 45, 45, 0.25)` | Ink @ 25% | Hairline dividers, `1px solid` on cards, filters, footer |
| Border (subtle, light) | inline | `rgba(45, 45, 45, 0.75)` | Ink @ 75% | Tag borders on hover |
| Outline (SVG brand) | inline | `currentColor` | n/a | Logo, icons — `fill="currentColor"` everywhere |
| Progress-knob (idle) | inline | `hsla(0, 0%, 100%, 0.2)` | White @ 20% | `[data-component=m23-progress-button]:hover .progress circle` fill |
| Error / destructive | inline | `#B81C21` | Brick red | `input-error`, validation-hint |
| White | inline | `#FFFFFF` / `#fff` | White | Form fields, video controls, progress button bg |
| Black | inline | `#000` / `#000000` | Black | Video poster letterbox bars only |

No dark-mode toggle is offered; "dark" sections are authored per-block
with the inverted pair.

### Typography

The site loads **four** self-hosted families. All are served as `woff2`
+ `woff` from `/themes/custom/monks/static/fonts/` (assets captured
under `playwright/fonts/`), `font-display: swap`.

| Family | Source | Weights | Variable? | Notes |
| --- | --- | --- | --- | --- |
| `Helvetica Now` | self-hosted (`5c2e1d99.woff2`) | 400, 500 | No | Primary UI / body / labels. Stack: `Helvetica Now, "Helvetica Neue", Helvetica, Arial, sans-serif`. |
| `Helvetica Now Extended` | self-hosted (`4a5b76d5.woff2`) | 800 | No | Display + headings on hero / section titles. Used for `font-extended` class. |
| `Morian Trial` | self-hosted, base64-embedded in CSS | 400 + 400 italic | No (custom features) | Editorial accent; carries `font-feature-settings: "salt" 0, "ss01" 0, "ss02" 0, "aalt" 0`. Used in some labels. |
| `Caveat` | self-hosted (`7202a0e3.woff2`) | 400 | No | Hand-drawn scribble — appears in `class="font-handwritten"` copy on the hero tagline. |

A single Roboto family (served from Google) appears **only** inside
the OneTrust cookie consent widget (`playwright/css/otCommonStyles__4d354f10.css`),
and is not part of the brand system.

**Type scale** (driven by `fs-*` utility classes, resolved through the
main CSS):

| Role | Class(es) | Family | Weight | Size (mobile → desktop) | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Display XL (hero / section title) | `fs-display-l` | Helvetica Now Extended | 800 | `clamp(45px, 7vw, 100px)` (via `font-size: max(45px, calc(-90px + 11.25vw))` at ≥1200, `max(72px, calc(-12px + 5.83333vw))` at ≥1440, `100px` at ≥1920) | `1.05` | `0` (uses `letter-spacing: 0`) |
| Display L (section title) | `fs-display-m` | Helvetica Now Extended | 800 | `clamp(40px, 5vw, 80px)` | `1.05` | `0` |
| Display S (small display) | `fs-display-s` | Helvetica Now | 500 | `clamp(28px, 3vw, 48px)` | `1.2` | `0` |
| Body L | `fs-body-l` | Helvetica Now | 400 | `clamp(18px, 1.4vw, 22px)` (resolved as `clamp(18px, 18px, 18px)` in some components) | `1.3` | `0` |
| Body M | `fs-body-m` | Helvetica Now | 400 | `clamp(14px, calc(13.33333px + .13889vw), 16px)` | `1.3` | `0` |
| Label / caption | `fs-label` | Helvetica Now | 500 | `12–14px` | `1.2` | `.05rem` (5% em letter-spacing) |
| Mono (debug only) | n/a | `monospace, monospace` | 400 | inherited | inherited | inherited |

`letter-spacing` observed in the bundle: only `0` and `.05rem`. The
`tracking` column above mirrors that — no negative tracking in use.
The hero "M" path is the `data-ref="monk-logo"` block; the
brand wordmark "monks" is an inline SVG (see *SVGs & icons*).

### Spacing & radius

- **Base unit:** 8px (most spacings are expressed in rem; `1rem = 10px`
  in this theme, so `7rem = 70px`, `3rem = 30px`, `2rem = 20px`).
- **Scale observed:** `4px, 10px, 16px, 20px, 30px, 40px, 50px, 60px,
  70px, 100px, 120px`. The largest section padding is
  `clamp(100px, calc(93.33333px + 1.38889vw), 120px)` per the
  `o17-header-content` and `[data-component=c11b-monk-quote]`
  patterns.
- **Vertical rhythm:** baseline grid of `8px` (visible in the `7rem`
  row height of inputs/selectors, the `70px` button, the `3rem`
  location-icon circle).
- **Radii:**
  - sm: `4px` (custom-input checkbox `border-radius: .4rem`)
  - md: `8px` (work-tag chip `border-radius: .8rem`)
  - lg: `20px` (input field `border-radius: 2rem`)
  - xl: `9999px` (`m19-tag` delete-button `border-radius: 100%`,
    `select-button .button-icon-wrapper` `border-radius: 10rem`)
  - pill: `100%` / `9999px` is the dominant idiom for chips, icons
    and circular video masks (`.video-mask { border-radius: 50% }`)
- **Shadows:**
  - elevation-low: `0 20px 40px -16px rgba(0, 0, 0, 0.3)` — used on
    hover for form labels, select boxes, and the progress button.
  - elevation-none: components are otherwise flat — there is no
    `box-shadow` for static cards.

### Iconography

- **Style:** custom outline icons, all stroked/duotone and bound to
  a 70×70 SVG viewBox (`<svg viewBox="0 0 70 70">`). Inline SVG only —
  no icon font.
- **Library:** **custom in-house** — there is no Lucide / Phosphor /
  Heroicons import. Icons live inside `[data-component=cf-a2-icon]`
  and are inlined directly in the HTML, sized via the parent's
  `height` / `width` in rem.
- **Default size:** the `[data-component=cf-a2-icon]` element resolves
  to `height: 4.8rem; width: 4.8rem` inside a `3rem` location-icon
  circle; on tags it scales to `220%` of the parent (icon intentionally
  oversized to crop into a circle).
- **Brand mark:** an inline SVG of the word "monks" + period in
  `currentColor` (the period is the iconic "dot monks" / "Monks dot"),
  plus a separate hero "M" mark inside `[data-component=monk-logo]`.
  Two variants exist: `class="monk-logo"` (outlined strokes) and
  `class="monk-logo is-filled"` (solid).

---

## Layout & Grid

- **Grid system:** a **12-column custom CSS grid** (no Tailwind /
  Bootstrap). Columns are referenced as `var(--grid-column)` and gaps
  as `var(--grid-gap)`. `--grid-gap` is `clamp(18px, 3vw, 40px)` (from
  the `clamp(18px, calc(-18.66667px + 3.05556vw), 40px)` padding on
  the thinking-filter bar). Concrete usages:
  - `inline-size: calc(var(--grid-column) * 2 + var(--grid-gap) * 3)`
    — image on the c11b-monk-quote card.
  - `inline-size: calc(var(--grid-column) * 3 + var(--grid-gap) * 3)`
    — subtext column on `o17-header-content` ≥ 1200.
- **Page gutter:** `clamp(18px, calc(-18.66667px + 3.05556vw), 40px)`
  (mobile 18px → 40px at 1920px+).
- **Breakpoints** (from the bundled CSS, mobile-first):
  - sm: `480px` (rare; used for `h6-thinking-header` mobile rules)
  - md: `800px` (form rows switch to side-by-side, `o17-header-content`
    CTA wrapper goes to row)
  - lg: `1200px` (the **main desktop breakpoint** — site is single-column
    on mobile, true 12-col grid appears ≥ 1200)
  - xl: `1440px` (display-type bumps to `max(72px, …)`)
  - 2xl: `1920px` (display-type bumps to `100px`)
- **Vertical rhythm:** section padding-block is
  `clamp(100px, calc(93.33333px + 1.38889vw), 120px)` — 100px mobile,
  120px desktop.

**Homepage sequence (top to bottom):**

1. **Primary nav** — `[data-component=n1-navigation]`, fixed top,
   hairline-bordered, hides on scroll-down (transform: `translateY(110px)`)
   and re-enters on scroll-up. Houses the dot-monks logo, a CTA, and
   links revealed on click. Has its own `monks-launch.lottie` animation
   bound via `data-logo-animation`.
2. **Hero** — full-bleed `data-component=cf-a1-heading` with a giant
   `fs-display-l` headline ("Sharpen your edge in a world that won't
   wait"), outlined-then-filled hero "M" mark on a curved path
   (`transform: translate(150%, -100%) translate(0px, -0.1562px) rotate(-5deg) scale(0.3, 0.3)`),
   and an autoplaying `idle-video` `<video>` poster (mp4, muted, loop,
   `preload=metadata`).
3. **Tagline copy** — single `<p class="tagline-copy">` paraphrased
   from the brand mission.
4. **"Featured work"** — `[data-component=c21-featured-content]` and
   `[data-component=c23-latest-work]` tiles; each card has a 16:9
   poster image plus a label, hover state, and inline "→" affordance.
5. **Monk-quote / leadership video** — `[data-component=c11c-monk-quote]`
   contains a circular video mask (`.video-mask { border-radius: 50%;
   aspect-ratio: 1/1 }`) with both `idle-video` and `full-video` mp4
   tracks; click to expand into a 90%-scale modal.
6. **Bundle / content grid** — `[data-component=c13-bundle]`, a masonry
   of 3-up text-and-visual blocks (`c38-text-and-visual`).
7. **Content grid** — `[data-component=c22-content-grid]`, 12-col
   reflow layout for case-study thumbnails with overlay text.
8. **Featured thoughts** — `[data-component=c26-featured-thoughts]`,
   three-up article cards; each pulls the article's hero image and
   category label.
9. **Monk contact** — `[data-component=c16-monk-contact]`, a CTA band
   pairing display type with a button group.
10. **Newsletter signup** — `[data-component=c29-newsletter-signup]`,
    a wide single-row form with a `data-animation="newsletter.lottie"`
    figure to the right.
11. **Footer** — `[data-component=n2-footer]`, 12-col grid, with
    `.grid-gutter` padding, copyright copy, and four social icon
    buttons (Instagram, LinkedIn, Twitter, TikTok) using
    `data-icon="..."` `cf-m1-button` instances with
    `data-hover-behaviour="move-icon"`.

---

## Components

For each major component: purpose, anatomy, states, and any responsive
behavior. The codebase uses a `data-component` selector convention;
component names below are the values of those attributes.

### cf-m1-button (primary button)
- **Purpose:** link/button used everywhere CTAs are needed.
- **Anatomy:** an `<a>` with a `data-icon` slot, a label slot, and
  hover behaviour.
- **States:** default (transparent), hover (icon translates left,
  label appears — `data-hover-behaviour="move-icon"`), focus-visible
  (3-px white + 6-px blue + 9-px background ring per the focus ring
  CSS variable system), disabled.
- **Responsive:** defaults to `default` layout; switches at the
  container's `data-responsive-behaviour` value.
- **Examples:** `aria-label="Our Instagram page."`, `data-icon="instagram"`.

### cf-a1-heading
- **Purpose:** every H1/H2/H3 in the site is wrapped in this
  component. Carries the `data-split="word"` / `data-split="words"`
  attribute, which the JS splits into `<span>` children for
  per-word animation.
- **Anatomy:** the heading element itself + the inline `style`
  attribute carrying the current animation state (e.g. `opacity: 0;
  transform: translate(0px, 100px)`).
- **States:** hidden (initial), entering, visible. Driven by the
  outline-animation JS.

### cf-a2-icon
- **Purpose:** a wrapper that scales an inline SVG to its parent.
- **Anatomy:** `<span data-component="cf-a2-icon" data-name="...">`
  containing a single `<svg viewBox="0 0 70 70">`. CSS
  `height: 4.8rem; width: 4.8rem` by default.
- **Usage:** nav icon, location button, social buttons, progress
  button icon, the wordmark, the hero "M" mark.

### cf-a3-image
- **Purpose:** image wrapper with `aspect-ratio: 16/9` default and
  `object-fit: cover` for case-study thumbs.
- **Anatomy:** `<img data-ref="image-element" alt="...">`.
- **Usage:** every work tile, hero poster, featured-thought card.

### cf-a5-text
- **Purpose:** body copy wrapper that opts into outline animation.
- **Anatomy:** a `<p>` (or `<h*>`) with `data-allow-outlines`.
- **States:** hidden, entering, visible (same per-span animation
  pass as headings).

### a1-outline (text reveal engine)
- **Purpose:** the global element-attribute observer that adds and
  animates outline strokes on every text element it can find.
- **Anatomy:** injected by the marketing JS, lives at the
  `[data-component=a1-outline]` root and processes
  `[data-allow-outlines="true"]` descendants.
- **Effect:** splits each text node into per-word `<span>`s and
  animates stroke-thickness, opacity, and a `translate(0, 100px)`
  offset in and out as the element enters/exits the viewport.

### a2-video
- **Purpose:** thin wrapper around a `<video>` tag with `data-ref`
  distinguishing the `idle` (looping teaser) and the `full` (one-shot
  long-form) variants.
- **Anatomy:** `<video playsinline preload="metadata" muted autoplay
  loop src="…mp4?VersionId=…" class="fit-cover idle-video"
  style="opacity: 0.4;">` and a parallel `<video class="full-video">`
  for the click-to-expand modal.
- **Behavior:** the `idle-video` plays on first paint; on
  `[data-component=o22-monk-quote-video].is-full-video` the
  `full-video` becomes visible and `idle-video` becomes `opacity: 0;
  visibility: hidden`.

### a3-validation-hint
- **Purpose:** error message under an input.
- **Anatomy:** a single text node; hidden until `.is-active` is added.
- **Visual:** `font-family: Helvetica Now; font-size: 14–16px;
  font-weight: 500; line-height: 1.3; color: var(--themed-foreground)`
  (success) or `#B81C21` (error).

### a4-scroll-hint
- **Purpose:** the small "scroll" indicator at the bottom of the hero.
- **Visual:** a thin pill with a 1-px down arrow, centered.

### n1-navigation
- **Purpose:** the primary top nav.
- **Anatomy:** `<nav data-component="n1-navigation" data-logo-animation="…/navigation.lottie" aria-label="Primary navigation">`
  with a `[data-ref=logo]` and a list of links. The nav is
  *transform-hidden by default* (`transform: translateY(110px)`) and
  reveals via class swap on scroll direction.
- **State:** `is-visible`, `is-negative` (inverted colors when
  passing over a light section).

### n2-footer
- **Purpose:** the global footer.
- **Anatomy:** `<footer data-component="n2-footer" class="grid-gutter">`
  with `<nav class="navigation-links" aria-label="Footer navigation"
  data-ref="main-links-nav">` plus a copyright `<p class="fs-label
  font-sans-serif copyright-copy">` ("Copyright 2026") and the
  four social `cf-m1-button`s.

### c11c-monk-quote / c11b-monk-quote (leadership quote with video)
- **Purpose:** the "monk of the week" card.
- **Anatomy:** a two-column grid ≥ 1200px — left half is the circular
  video mask, right half is the quote + name + role. Below 1200 the
  layout stacks.
- **Behavior:** click the circle → `is-full-video` is added → the
  video scales to `.9` and the `.progress-circle` becomes a
  interactive scrubber; click outside to close.

### o17-header-content
- **Purpose:** the section title block reused at the top of every
  major section.
- **Anatomy:** a `.component-label` (small label, `fs-body-l
  font-sans-serif-medium`), `.component-title` (`fs-display-l` or
  `fs-display-m font-extended`), optional `.subtext`
  (`fs-body-l font-serif`), and a `.cta-wrapper` of buttons.
- **Layout:** label + title sit side-by-side ≥ 1200 (the label is
  `display: inline-block` with a vertical `::before` size that ties
  to the title's font-size).

### m19-tag (filter chip)
- **Purpose:** small rounded chips for tag filters, with a delete
  circle on the right.
- **Anatomy:** `[data-component=m19-tag].is-selected` swaps the
  `tag-background` to `var(--themed-foreground)` and inverts the
  text. `.work-tag` variant uses `border-radius: .8rem` and a
  smaller height for the case-study page.
- **Sizes:** `block-size: 4rem` mobile, `7rem` desktop.

### o13-tag-list
- **Purpose:** the horizontal row of `m19-tag` chips, with edge
  fade masks (`-webkit-mask-image: linear-gradient(90deg, transparent,
  #000 30%)` etc.) to indicate overflow.
- **States:** `.has-overflow` (justify-content: flex-start) and
  prev/next navigation buttons shown only on desktop.

### c57-filters-overlay
- **Purpose:** full-screen filter sheet for mobile.
- **Anatomy:** fixed overlay with `.filters-header`, `.filters-tags`
  (active filters), `.filters-body` (the filter list), `.filters-footer`
  (sticky CTA bar), and a `.visual-wrapper` showing two decorative
  images in the background (rotated -10° and -9°).

### cl-m2-input-field
- **Purpose:** the labeled form input.
- **Anatomy:** a `<label>` with a `<span class="input-label">` and a
  `<span class="input-field-wrapper">`; `min-block-size: 7rem`,
  `padding: 1rem 3rem`, `border-radius: 2rem`, white background.
- **States:** default, hover, `:focus-within` (gains a
  `box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.3)`), `has-value`,
  `has-focus`, `has-error` (`border-color: #B81C21`).
- **Floating-label motion:** the placeholder label
  (`.input-label`) transitions with `cubic-bezier(.19, 1, .22, 1)`
  over `600ms` when focus or value is present.

### cl-m4-select
- **Purpose:** custom-styled `<select>`.
- **Anatomy:** a custom button (`block-size: 7rem;
  border-radius: 10rem`) wrapping a real `<select>` that is
  `position: absolute; opacity: 0`. A `.options-wrapper` opens
  on click and is `position: fixed; inset: 0` on mobile or
  `border-radius: .2rem; max-block-size: 30rem` on desktop.
- **Selected indicator:** a `1px solid #2D2D2D` 16-px square (or
  circle for radio) at `opacity: .75`.

### cl-m3-selection-control
- **Purpose:** checkbox / radio / toggle primitive.
- **Anatomy:** hides the native input (`opacity: 0;
  pointer-events: none`), draws a `1.6rem` custom element with a
  border and an animated `::after` fill. The check icon scales
  from `scale(0)` to `scale(1)` on `:checked`.

### cl-o0-form / cl-o0-form-field / cl-o0-multi-step-form
- **Purpose:** the multi-step newsletter / contact form.
- **Anatomy:** `<form>` of `cl-o0-form-field` rows; the
  `cl-o0-multi-step-form-step-indicator` is a row of circles
  (`--step-size: 1rem` mobile, `1.3rem` desktop) with a moving
  `::before` that has `transition: transform .3s cubic-bezier(.2,
  0, 0, 1) .2s`.

### m23-progress-button (circular play/pause control)
- **Purpose:** a circular white-on-dark progress button used to
  play videos.
- **Anatomy:** `border-radius: 50%`, two sizes (`70px` default,
  `40px` small-to-medium), a centered SVG `.progress` with two
  circles (`.total` at `opacity: .2` and `.time` stroked) and a
  centered icon.
- **Hover:** `.progress circle { fill: hsla(0, 0%, 100%, 0.2) }`.

### o22-monk-quote-video
- **Purpose:** the circular video player described above.
- **States:** default (idle loop), `.is-full-video` (modal), drag
  (`.is-dragging`), `.takes-current-color` (the variant used on
  light surfaces — strokes use `currentColor` instead of
  `--themed-foreground`).

### c20-deep-dive
- **Purpose:** a full-page modal that loads a long-form case study
  on top of the current page.
- **Anatomy:** `.mask { background: #2D2D2D; inset: 0 }`, a
  spinner, then `.content` with `.content-inner { background: #EAE8E4;
  color: #2D2D2D }`. The close button is centered on mobile and
  pinned to the right edge ≥ 1200.

### h6-thinking-header
- **Purpose:** the sticky page title used on the thinking / articles
  index.
- **Anatomy:** a `.page-title` with a `background-image: url(…svg)`
  wordmark (the `af3c4d4756eb0024c9b1.svg` "thinking" lockup), a
  date, and a sticky filter bar that pins to
  `inset-block-start: var(--sticky-nav-offset)` on scroll.

### Lottie `<dotlottie-player>` (custom element)
- **Purpose:** hosts the in-house Lottie animations — the
  navigation `monks-launch.lottie` and the newsletter
  `newsletter.lottie`.
- **Detection:** confirmed via `js/51e4a8fe-3c2c-47bd-9217-a03000676d8a__18cadd87`,
  `var PACKAGE_NAME = "@lottiefiles/dotlottie-web"`,
  `var PACKAGE_VERSION = "0.40.2"`. Renders into a `<canvas>` inside
  the `<dotlottie-player>` custom element; the
  `dotlottie-player__49a778a2.wasm` (1.1 MB) is the Wasm core.

---

## JavaScript & Libraries

| Library | Version | Detection | Usage |
| --- | --- | --- | --- |
| Drupal core | 10.6.9 | `src="/core/misc/drupal.js?v=10.6.9"` | CMS runtime; `drupal.init.js`, `drupalSettingsLoader.js`. |
| jQuery | 3.7.1 | `src="/core/assets/vendor/jquery/jquery.min.js?v=3.7.1"` | Drupal dependency. Not used by the marketing bundle. |
| `@lottiefiles/dotlottie-web` | 0.40.2 | `var PACKAGE_NAME = "@lottiefiles/dotlottie-web"`; `var PACKAGE_VERSION = "0.40.2"` in `js/51e4a8fe-3c2c-47bd-9217-a03000676d8a__18cadd87` | Renders `monks-launch.lottie` (4.3 KB) and `newsletter.lottie` (260 KB). Player is `<dotlottie-player>` custom element. |
| OneTrust Cookie Consent | bundle 202601.1.0 | `https://cdn.cookielaw.org/scripttemplates/202601.1.0/otBannerSdk.js` + `otSDKStub.js` | GDPR/CCPA banner; stylesheet `otCommonStyles__4d354f10.css`. |
| Google reCAPTCHA | recaptcha__en.js | `https://www.gstatic.com/recaptcha/releases/MerVUtRoajKEbP7pLiGXkL28/recaptcha__en.js` | Form bot protection. |
| Google Tag Manager | GTM-58JP93N | `https://tm.monks.com/gtm.js?id=GTM-58JP93N` | Analytics. |
| Google Ads (AW-341954047) | conversion.js | `https://www.googletagmanager.com/gtag/destination?id=AW-341954047` | Conversion tracking. |
| GA4 | G-BLLLZDWHBP, G-T20ED2W7EY, G-5BE5652Z4Y | `gtag/js` calls | Three GA4 properties. |
| Microsoft Clarity | 0.8.65 | `https://scripts.clarity.ms/0.8.65/clarity.js`; `clarity.ms/tag/in7x46ldqc` | Session recording. |
| HubSpot | portal 4398552 | `https://js.hs-analytics.net/analytics/1781898900000/4398552.js`; `hs-banner.com/4398552.js`; `hsadspixel.net/pixels.js`; `hubspot.com/web-interactives-embed.js` | CRM, ads pixel, web-interactives. |
| Zaius | `zaius-min.js` | `https://d1igp3oop3iho5.cloudfront.net/v2/KbBuZhedjehbYfZvn9GRew/zaius-min.js` (twice — original + async) | Customer data platform. |
| LinkedIn Insight | `insight.min.js`, `insight.old.min.js` | `https://snap.licdn.com/li.lms-analytics/insight.min.js` | Conversion tracking. |
| Optimizely | 24790401353, geo4 | `https://cdn.optimizely.com/js/24790401353.js`; `//cdn3.optimizely.com/js/geo4.js` | A/B + geolocation. |
| Custom Monks marketing runtime | n/a | 70 hashed ES modules under `playwright/js/` (`js/1105.87f4eec9045b637413ca__e135658e.js`, etc.) | Drives `a1-outline` text reveal, `o22-monk-quote-video` modal, `c20-deep-dive` overlay, `m23-progress-button` progress, `h6-thinking-header` sticky filter, `n1-navigation` show/hide, `cl-o0-multi-step-form` form flow. Plain ES modules, no framework. |

**No GSAP, Three.js, WebGL, or Barba.js** was detected anywhere in the
dump — animations are Lottie + CSS-driven. The `webgl-container` div
in `[data-component=h8-connect-header]` is the **only** WebGL
scaffolding in the CSS (`pointer-events: none; opacity: 0;
transition: opacity .6s ease-in`) but no corresponding JS was
observed; on the homepage this header is not present.

**Inline `<script>` overrides** (per page):
- `gtag('js', new Date())` and a LinkedIn helper.
- A OneTrust stub: `function OptanonWrapper() { }`.
- A custom `dataLayer` GTM bootstrap.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `dot-in` | `playwright/css/main__7c11b9b6.css` (inline-min) | `200ms` (observed via `cubic-bezier(.2, 0, 0, 1)` timings) | `cubic-bezier(.2, 0, 0, 1)` | nav dot enters |
| `dot-out` | same | `200ms` | `cubic-bezier(.2, 0, 0, 1)` | nav dot leaves |
| `subitem-dot-in` | same | `200ms` | `cubic-bezier(.2, 0, 0, 1)` | subitem dot enters |
| `footer-dot-in` | same | `200ms` | `cubic-bezier(.2, 0, 0, 1)` | footer dot enters |
| `footer-dot-out` | same | `200ms` | `cubic-bezier(.2, 0, 0, 1)` | footer dot leaves |
| `label-bounce` | same | `600ms` | `cubic-bezier(.2, 0, 0, 1)` (label bounce on select expand) | select open |
| `footer-label-bounce` | same | `600ms` | `cubic-bezier(.2, 0, 0, 1)` | footer select open |

(File is minified to one line; line offsets are within the
`a1-outline` / `n1-navigation` / `n2-footer` / `cl-m4-select` block
chunks, around the `data-component=n1-navigation` rules and the
`@keyframes` definitions in the lower third of the bundle.)

### CSS transitions (significant)

| Selector | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `[data-component=cl-m2-input-field] label` | `box-shadow` | `600ms` | `cubic-bezier(.19, 1, .22, 1)` | hover, focus-within |
| `[data-component=cl-m2-input-field] .input-label` | `transform` | `600ms` | `cubic-bezier(.19, 1, .22, 1)` | focus / value |
| `[data-component=cl-m4-select] .options-wrapper` | `opacity` | `200ms` | `cubic-bezier(.19, 1, .22, 1)` | open/close |
| `[data-component=cl-m4-select] .options-footer` | `transform` | `600ms` | `cubic-bezier(.2, 0, 0, 1)` | show on mobile confirm |
| `[data-component=m23-progress-button]` | `color` | `600ms` | `cubic-bezier(.2, 0, 0, 1)` | hover |
| `[data-component=o22-monk-quote-video] .video-mask` | `transform` | `600ms` | `cubic-bezier(.2, 0, 0, 1)` | enter full / hover |
| `[data-component=h8-connect-header] .webgl-container` | `opacity` | `600ms` | `ease-in` | become visible |
| `[data-component=c20-deep-dive] .mask .spinner` | `opacity` | `300ms` | `linear` | `.show-spinner` |
| `[data-component=progress-circle] .knob` | `background-color` | `200ms` | `cubic-bezier(.2, 0, 0, 1)` | hover |
| `[data-component=o13-tag-list]` edge masks | n/a | static gradient mask | n/a | `has-overflow` |
| `[data-component=h6-thinking-header] .thinking-filters-bar.is-fixed` | `opacity` | `300ms` | `ease` | scroll |
| `[data-component=o27-tags-filter] .custom-list-button .button-label-counter` | `opacity` | `300ms` | `ease-in-out` | `.is-active` |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| `@lottiefiles/dotlottie-web` (v0.40.2) | `monks-launch.lottie` on the nav logo | `data-logo-animation` attribute; fires on first paint | 4.3 KB dotLottie (binary format) → wasm player. |
| `@lottiefiles/dotlottie-web` (v0.40.2) | `newsletter.lottie` on the newsletter section | `data-animation` attribute; plays in view | 260 KB dotLottie; canvas-based. |
| Custom `a1-outline` engine | per-word reveal | element enters viewport (IntersectionObserver-style) | Splits text into `<span>`s and animates `transform: translate(0, 100px)` → `translate(0, 0)` + `opacity: 0 → 1` over ~600ms. |
| Custom `monk-logo` engine | hero "M" path animation | first paint | `translate(150%, -100%) → translate(0, 0)` with a `-5deg` rotation and a 0.3 → 1.0 scale, eased. |
| Custom `n1-navigation` controller | show/hide nav | scroll direction | `transform: translateY(110px) → 0` over 200ms; `is-negative` class swaps colors on dark sections. |
| Custom `c20-deep-dive` controller | open long-form case study | click on work tile | `opacity: 0 → 1` on the deep-dive root, plus a spinner. |
| Custom `o22-monk-quote-video` controller | expand circular video | click | `is-full-video` adds, scale `.9`, `progress-circle` becomes a real scrubber. |
| Custom `m23-progress-button` controller | ring progress | timeupdate of the bound `<video>` | SVG `circle` stroke-dasharray updated; `transition: 600ms`. |
| Custom `cl-o0-multi-step-form` | step indicator slide | step change | `transform: translate(...)` over 300ms with `.2s` delay. |
| Custom `h6-thinking-header` | sticky filter pin | scroll past threshold | `position: fixed; top: 0; opacity: 0 → 1` over 300ms. |

### Page transitions

- **No full route-transition library** (no Barba / Swup / Next.js
  App Router). On internal nav, the page reloads and the
  `a1-outline` reveal runs again.
- On direct-link first paint, the hero "M" mark animates in over the
  outlined-stroke version (`.monk-logo` → `.monk-logo.is-filled`)
  triggered by the same per-word reveal engine.

---

## Assets

Inventory of every asset in the dump. Group by type, reference local
paths, sizes, and source URLs.

### 3D models

N/A — no `.glb`, `.gltf`, `.obj`, `.fbx`, or `.usdz` files were
observed in the dump. (The `webgl-container` div in
`h8-connect-header` ships empty on the homepage.)

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Helvetica Now | 400, 500 | woff2 + woff | `playwright/fonts/5c2e1d99.woff2` (400) and `882730d9.woff2` (500) | yes (`/themes/custom/monks/static/fonts/`) |
| Helvetica Now Extended | 800 | woff2 + woff | `playwright/fonts/4a5b76d5.woff2` | yes |
| Morian Trial | 400, 400 italic | base64-woff2 in `main__7c11b9b6.css` + woff | inline CSS | yes (embedded) |
| Caveat | 400 | woff2 + woff | (not in dump — referenced as `/static/fonts/7202a0e3.woff2`) | yes |
| Roboto | 400, 500, 700 | woff | inside OneTrust `otCommonStyles__4d354f10.css` | no (Google Fonts) |
| KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ | 400 | woff2 | `playwright/fonts/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA__fb5169d9.woff2` | yes (likely Roboto fallback used by OneTrust) |

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `playwright/images/MarketingOrchestration-Monks-Main-2.png__e8b2c664.webp` | WEBP | not observed | not observed | `https://www.monks.com/data/.../MarketingOrchestration-Monks-Main-2.png` (CDN-served) | Marketing case study thumb |
| `playwright/images/Monks-GlassBoxMedia-Hatch.png__678c1870.webp` | WEBP | n/o | n/o | CDN | Hatch case study thumb |
| `playwright/images/Monks-Heinz-Mustard-RealTimeBrands.png__e4274b18.webp` | WEBP | n/o | n/o | CDN | Heinz case study thumb |
| `playwright/images/Monks-TechTransformation-main_0.png__322d01ee.webp` | WEBP | n/o | n/o | CDN | Tech transformation thumb |
| `playwright/images/logo_48__c1452452.png` | PNG 48×48 (favicon-ish) | 48×48 | n/o | CDN | Twitter/OG card mark |
| `playwright/images/c__2f8f6838.gif` | GIF (animated counter) | n/o | n/o | CDN | Site-wide animated counter badge |
| `playwright/images/counters__49af7bec.gif` | GIF | n/o | n/o | CDN | Secondary counter badge |
| `playwright/images/ga-audiences__98a04ae0` | binary blob (no extension) | n/o | n/o | GA audiences ping | analytics payload |
| `playwright/images/asset_160__e737558f` | binary blob | n/o | n/o | CDN | small static |
| `playwright/images/Monks.Flow-Home__1c4b7aac.mp4` | MP4 H.264 | n/o | captured | `https://www.monks.com/data/s3fs-public/2025-06/Monks.Flow-Home.mp4?VersionId=gzvMWNGaRg2S1AIiBtu61Kpl.tBB5ky8` | hero long-form loop |
| `playwright/images/Monks-Sizzle_1280x720.mp4` (not in dump, referenced) | MP4 | n/o | n/o | `https://www.monks.com/data/2025-06/Monks-Sizzle_1280x720.mp4?VersionId=e_Tm.MWDsvT7_TH5rRxdV8GpsPlsTS1q` | hero "idle" loop, opacity 0.4 |

### SVGs & icons

- **Inline SVGs observed in HTML:** 134 instances in the rendered
  homepage (`grep -c "<svg" playwright/homepage.html`), of which the
  vast majority use `viewBox="0 0 70 70"` (icon set), `viewBox="0 0
  99 21"` (the `monks` wordmark + dot), and `viewBox="0 0 100 100"`
  (progress circles).
- **Standalone SVG files in dump:** the inventory shows
  `playwright/svgs/` is empty for content SVGs (only OneTrust's
  `ot_guard_logo__9d1414bb.svg` and `powered_by_logo__30a9fbe8.svg`
  are present in the dump). All real brand SVGs are **inlined** in
  HTML/CSS (`af3c4d4756eb0024c9b1.svg` for the "thinking" wordmark
  is referenced as a CSS background-image).
- **Icon system:** **custom in-house** (`[data-component=cf-a2-icon]`),
  70×70 viewBox, `fill="currentColor"` or stroke. Names observed
  include `dot-monks-logo`, `instagram`, `linkedin`, `twitter`,
  `tiktok`, plus iconography for the multi-language switcher
  (`location-button`).
- **Progress / ring icons:** `viewBox="0 0 100 100"` SVGs with
  rotated `<circle>` and `<path>` for the scrubber.

### Audio & video

| Local path | Type | Source URL | Notes |
| --- | --- | --- | --- |
| `playwright/media/Monks.Flow-Home__1c4b7aac.mp4` | MP4 H.264 | `https://www.monks.com/data/s3fs-public/2025-06/Monks.Flow-Home.mp4?VersionId=gzvMWNGaRg2S1AIiBtu61Kpl.tBB5ky8` | Hero long-form; `<video playsinline preload="metadata" muted autoplay loop class="fit-cover border-radius">`. |
| (not in dump) | MP4 H.264 | `https://www.monks.com/data/2025-06/Monks-Sizzle_1280x720.mp4?VersionId=e_Tm.MWDsvT7_TH5rRxdV8GpsPlsTS1q` | Hero "idle" teaser, `opacity: 0.4`, autoplay loop. |
| (not in dump) | MP4 H.264 | `https://www.monks.com/data/2025-09/SMS-Personalization.mp4?VersionId=EeMCguNIwuV6NuRgLBj2HvhFzFG.9ySt` | `<video data-ref="idle-video">` for one of the secondary callouts; also has a parallel `<video data-ref="full-video">` for the click-to-expand modal. |

### Lottie & dotLottie

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `playwright/other/monks-launch__46db6445.lottie` | dotLottie (binary) | 4,318 bytes | `/themes/custom/monks/static/lottie/monks-launch.lottie` | Bound to `n1-navigation` via `data-logo-animation`. |
| `playwright/other/newsletter__a915e4f1.lottie` | dotLottie (binary) | 260,298 bytes | `/themes/custom/monks/static/lottie/newsletter.lottie` | Bound to `c29-newsletter-signup` via `data-animation`. |
| `playwright/other/dotlottie-player__49a778a2.wasm` | WebAssembly | 1,171,410 bytes | `https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.40.2/dist/dotlottie-player.wasm` | Player core for both Lotties. |

### Scripts

- `playwright/js/main__9899773a.js` — small bootstrap (18 lines, ~1 KB).
- `playwright/js/51e4a8fe-3c2c-47bd-9217-a03000676d8a__18cadd87` —
  the dotLottie player itself, 1.1 MB.
- ~68 more hashed ES modules under `playwright/js/` (e.g.
  `js/1105.87f4eec9045b637413ca__e135658e.js`,
  `js/1067.5dd295f7779aa76d4de5__b7425d6b.js`,
  `js/4023.c003a100f9ee7ae26350__40e3585e.js`,
  `js/4398552__00560a94.js` — HubSpot analytics,
  `js/4398552__35bc1cdb.js`, `js/4398552__8d61543b.js`).
- Drupal core scripts loaded from `/core/misc/`: `drupal.js`,
  `drupal.init.js`, `drupalSettingsLoader.js`, jQuery `3.7.1`.

---

## Motion & Interaction

### Principles

- **Default easing:** `cubic-bezier(.2, 0, 0, 1)` (the in-house
  "ease-out-expo" for nav, progress, video masks) and
  `cubic-bezier(.19, 1, .22, 1)` (the "ease-out-quart" used for
  floating-label input animations and select box shadows).
- **Default durations:** `200ms` (micro — dots, label collapse), `300ms`
  (small — spinners, opacity reveals, multi-step indicator), `600ms`
  (medium — input floating label, video mask transform, progress
  button color, options-footer slide), 1.2s+ (large — video `<video>`
  timeline, Lottie).
- **Reduced motion:** **Not observed** in the dumped CSS — there is no
  `@media (prefers-reduced-motion: reduce)` rule in the
  `main__7c11b9b6.css` or `otCommonStyles` bundle. (Treat this as a
  known accessibility gap.)

### Specific behaviors

- **Nav scroll:** transform-hide on scroll-down (`translateY(110px)`),
  reveal on scroll-up; threshold appears to be ~120px. The `is-negative`
  class inverts colors when over a light section (white background
  → black text and vice versa).
- **Hero "M" mark:** starts at
  `transform: translate(150%, -100%) translate(0, -0.1562px) rotate(-5deg) scale(0.3, 0.3)` and
  animates to neutral; the `.is-filled` swap reveals the solid mark
  over the outline.
- **Outline text reveal:** every heading and copy block on the page
  has its words split and animated from `translate(0, 100px) opacity:0`
  to neutral over ~600ms when the element enters the viewport.
- **Link / button hover:** icon `data-icon` translates left and the
  label appears (`data-hover-behaviour="move-icon"`); no color shift
  on default buttons.
- **Input focus:** `box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.3)`
  fades in over 600ms; placeholder label floats up.
- **Select open:** the `.options-wrapper` fades from `opacity: 0; visibility: hidden` to `opacity: 1; visibility: visible` over 200ms; on mobile the `.options-footer` slides up from `translateY(100%)` to `translateY(0)` over 600ms.
- **Filter chip select:** the `m19-tag.is-selected` swaps the chip
  background from transparent to `var(--themed-foreground)` and
  reverses the text/icon colors in 200ms.
- **Multi-step form step indicator:** a `::before` dot slides between
  positions with `transform .3s cubic-bezier(.2, 0, 0, 1) .2s`.
- **Video scrub:** dragging the `.progress-circle` knob scales it
  `2×` and adds a focus border; on release the scrubber snaps to the
  current timecode with a `.2s ease-out`.
- **Page-level scroll pin:** the `[data-component=h6-thinking-header]
  .thinking-filters-bar` pins to `top: 0` after the user scrolls past
  its initial position and fades the divider out (`opacity: 0` over
  300ms).
- **Section reveal:** the `o17-header-content` label has a `::before`
  sized to `0.25em` that acts as a "bar" anchor next to the display
  title.

### Reduced motion

Not observed. No `prefers-reduced-motion` block in the dumped CSS.

---

## Content & Voice

- **Tone:** confident, technical, occasionally playful; the hero
  H2 is a short imperative ("Sharpen your edge in a world that won't
  wait"). CTAs are short nouns ("Read more", "Subscribe", "Connect")
  with a single forward-arrow icon.
- **Sentence length:** short. Headlines are typically 5–10 words; body
  copy is one or two short sentences per paragraph.
- **Capitalization:** Sentence case in headings ("Sharpen your edge…",
  "Featured work", "Latest work"). Section labels are also sentence
  case ("Featured thoughts").
- **Punctuation:** no Oxford comma observed; em-dashes are absent;
  en-dashes absent; copy is minimalist.
- **CTA vocabulary:** *Read more*, *Subscribe*, *Connect*, *Get in
  touch*, *Explore work*, *Continue reading*. No "Buy now" / "Get a
  demo" patterns.
- **Body copy is paraphrased — never copy-pasted** from the original
  site. The hero tagline is one sentence, the work tiles use one
  sentence of context each.

---

## Information Architecture

Top-level routes inferred from the rendered DOM and the in-page links
in `playwright/homepage.html`:

- `/` — marketing homepage (single page captured by Playwright).
- `/work`, `/cases` (suggested by the `c23-latest-work` block) — work
  index. Not directly captured; expected to share the same theme.
- `/thinking` (suggested by `c26-featured-thoughts` and the
  `af3c4d4756eb0024c9b1.svg` wordmark) — articles / thought-leadership
  index, with sticky filter bar via `h6-thinking-header`.
- `/connect` (the form's `action`/`thank-you` page resolves to
  "Thanks! We will get in touch shortly." / "Thank you for signing
  up!") — lead capture.
- `/privacy` — privacy notice link from the cookie banner.
- Localized equivalents: `/es`, `/pt`, `/de` (per the
  `hreflang="es"`, `hreflang="pt-br"`, `hreflang="de"` alternates in
  the `<head>`).
- Social: `x.com/madebymonks_`, `instagram.com/madebymonks/`,
  `linkedin.com/company/monks` (per the JSON-LD `sameAs`).

For each homepage section, one sentence on its purpose and primary
component: see the homepage sequence in *Layout & Grid* above.

---

## Accessibility

- **Color contrast:** body copy `#2D2D2D` on `#EAE8E4` is ~10.4:1 (well
  above WCAG AAA). Inverted text `#EAE8E4` on `#191715` is ~14.6:1.
  The muted text `#68655F` on `#EAE8E4` is ~5.4:1 (passes AA for
  normal text, AAA for large).
- **Focus indicators:** explicit `:focus-visible` ring system using
  three inset box-shadows: `--ring-white-width: 3px` (white inner
  ring), `--ring-blue-width: 6px` (cobalt accent ring), and
  `--ring-background-width: 9px` (background-colored ring that creates
  a 3px gap). At 2× DPR the ring narrows to 2px / 4px / 7px. The same
  pattern is used for `cl-m3-selection-control` (checkbox/radio/toggle)
  and `o22-monk-quote-video .play-button-overlay`.
- **Keyboard:** every interactive element is a real `<a>` or `<button>`.
  Select boxes are real `<select>`s with a styled fallback. Form inputs
  use `<label>` wrappers and `aria-selected` on the option buttons.
  `prefers-reduced-motion` is **not** honored (see *Motion &
  Interaction*).
- **Screen-reader landmarks:**
  - `<header>` implied by `[data-component=n1-navigation]` (which
    also carries `aria-label="Primary navigation"`).
  - `<nav class="navigation-links" aria-label="Footer navigation">`
    inside the footer.
  - `<footer data-component="n2-footer">` wraps the bottom of the page.
  - `<main>` is implied by the document structure but no explicit
    `<main role="main">` was observed in the captured DOM (treat this
    as a minor a11y gap).
  - The OneTrust banner injects `<h2 id="onetrust-policy-title">` and
    `<h2 id="ot-pc-title">` with a focus-trap.
- **Alt text:** images have descriptive `alt` attributes, e.g.
  *"DJ Mustard with letters in yellow like a mustard effect spelling
  mustard"*, *"A computer screen showing different applications"*,
  *"A vibrant, abstract depiction of a DNA strand, composed of
  numerous small, colorful particles"*, *"hero"*. Decorative icons
  use `aria-hidden` patterns via the inline SVG.
- **ARIA:** `aria-label` on every social button; `aria-selected` on
  select options; `aria-hidden` on visual decoration.

---

## Sources

Every URL actually opened while writing this.

- Homepage — https://media.monks.com/ (mirrors https://www.monks.com/)
- Hero video — `https://www.monks.com/data/s3fs-public/2025-06/Monks.Flow-Home.mp4?VersionId=gzvMWNGaRg2S1AIiBtu61Kpl.tBB5ky8`
- Idle teaser — `https://www.monks.com/data/2025-06/Monks-Sizzle_1280x720.mp4?VersionId=e_Tm.MWDsvT7_TH5rRxdV8GpsPlsTS1q`
- SMS video — `https://www.monks.com/data/2025-09/SMS-Personalization.mp4?VersionId=EeMCguNIwuV6NuRgLBj2HvhFzFG.9ySt`
- OG image — `https://www.monks.com/data/styles/1200x630/s3/2024-07/monks-hero-image-16x9.jpg?VersionId=QVPYCz8N8fb59z_QZA7r.vvGkZGNUGch&h=d1cb525d&itok=gUAzZGbo`
- Localized alternates — https://www.monks.com/es, /pt, /de
- Social — `https://x.com/madebymonks_`, `https://www.instagram.com/madebymonks/`, `https://www.linkedin.com/company/monks`
- Tag manager / analytics — `https://tm.monks.com/gtm.js?id=GTM-58JP93N`; `https://js.hs-analytics.net/analytics/1781898900000/4398552.js`; `https://scripts.clarity.ms/0.8.65/clarity.js`; `https://snap.licdn.com/li.lms-analytics/insight.min.js`; `https://www.googletagmanager.com/gtag/js?id=AW-341954047` (and the G-BLLLZDWHBP / G-T20ED2W7EY / G-5BE5652Z4Y GA4 properties).
- Cookie consent — `https://cdn.cookielaw.org/consent/fd7f30d2-a621-4c6b-a158-1e3d85844189/otSDKStub.js`; `https://cdn.cookielaw.org/scripttemplates/202601.1.0/otBannerSdk.js`.
- recaptcha — `https://www.gstatic.com/recaptcha/releases/MerVUtRoajKEbP7pLiGXkL28/recaptcha__en.js`.
- dotLottie — `https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.40.2/dist/dotlottie-player.wasm`.
- Optimizely — `https://cdn.optimizely.com/js/24790401353.js`; `https://cdn3.optimizely.com/js/geo4.js`.
- Zaius — `https://d1igp3oop3iho5.cloudfront.net/v2/KbBuZhedjehbYfZvn9GRew/zaius-min.js`.
- Drupal core — `/core/misc/drupal.js?v=10.6.9`, `/core/assets/vendor/jquery/jquery.min.js?v=3.7.1`.

---

## Changelog

- 2026-06-20 — Initial draft by the design.md lead agent. Dump: 161
  files, 26.6 MB, scraped 2026-06-19. Primary HTML/CSS/JS read from
  `tools/tmp/media-monks/playwright/` because the `html/`, `css/`, and
  `js/` subfolders are empty (the static scraper pulled the Drupal
  bootstrap shell; the full DOM and runtime assets were captured
  via headless Chromium by `playwright_browser_navigate` +
  `browser_network_requests`).
