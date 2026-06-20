# Garden Eight — design.md

> A structured design specification of **https://garden-eight.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode lead
> **Source dump:** `tools/tmp/garden-eight/` (gitignored)

---

## Overview

Garden Eight is the public site of a small digital design studio in Tokyo
(東京都世田谷区北沢, Setagaya-ku). The product is a single-page-rendered
brand showcase that the studio itself designed and built — every page
is custom-coded, every interaction is hand-tuned, and the entire visual
system is built on a single font pair (a sober neo-grotesque in three
weights + one hand-drawn display serif) and a near-monochrome palette
that flips between a warm off-white and a near-black charcoal. The site
is heavily typographic: serif display titles the size of a poster,
split-letter animations, marquee scrolling, and a custom WebGL
"particle" cursor that follows the mouse. It is also a working
in-house product: an embedded AI chatbot ("Hachi") sits on a dedicated
route and is served from a Notion-driven knowledge base.

**Category:** Studio / portfolio / brand site
**Primary surface observed:** Homepage + 404 (cloudflare challenge dump
empty, so the Playwright-captured DOM is authoritative), plus API
artifacts for Cases, About, Contact, AI, Archives, Privacy, Terms
**Tone:** Confident, quiet, technical; the work is the headline.
**Framework detected (if any):** Nuxt 2.4.0 (SSR) with `@nuxtjs/i18n` 1.4.1,
Vuex, custom WebGL2 renderer (THREE r133 + glslify shaders), GSAP 3.12.1
with ScrollTrigger.

---

## Visual Language

### Color

The site is a near-monochrome system. There are exactly six design
tokens and almost every visual element pulls from one of them. The
"white" in the system is a warm bone tone (`#DBD6D0`), not pure white;
the "black" is a slightly desaturated near-black (`#1E1F1F`), not
pure black. The orange (`#DC5648`) is the only true accent and appears
sparingly.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base, dark) | `--col-black` | `#1E1F1F` | Near-black charcoal, the default `<html>` background |
| Background (base, light) | `--col-white` | `#DBD6D0` | Warm bone, used for white-bg sections / `[data-bg="white"]` |
| Background (deep) | `--col-black2` | `#1C1D1D` | One step lighter than black, for `ui-budge` and active "none" buttons |
| Background (deepest) | `--col-black3` | `#141414` | Used for shadow wells / not observed active in DOM |
| Text on dark / mid | `--col-gray` | `#3C3C3C` | Not used as text in the rendered DOM, kept as a token |
| Accent | `--col-orange` | `#DC5648` | The only true brand accent. Observed as the "sakura"-style highlight in the SVG logo path fill; appears rarely as direct text or border |
| Text on light (primary) | derived from `--col-black` | `#1E1F1F` | `[data-bg="white"]` text + all black-section foregrounds on light |
| Text on dark (primary) | derived from `--col-white` | `#DBD6D0` | Default `html` color = `--col-white`; `[data-bg="white"]` overrides to black |
| Mid-tone fill (translucent) | derived `--col-white @ 20%` | `hsla(33, 13%, 84%, 0.2)` | The "thumb .b" plate behind wordmark in cases |
| Mid-tone fill (translucent) | derived `--col-black @ 30%` | `rgba(30,31,31,0.3)` | Chat textarea + bubble borders |
| Selection (dark) | `var(--col-white)` bg, `var(--col-black)` fg | `#DBD6D0` / `#1E1F1F` | Default selection color |
| Selection (light) | `var(--col-black)` bg, `var(--col-white)` fg | `#1E1F1F` / `#DBD6D0` | `[data-bg="white"]` selection |

All six tokens are declared once on `:root` in the inline `<style>`
(`tools/tmp/garden-eight/playwright/homepage.html:36` — `<style
data-vue-ssr-id="282c25bc:0">:root{--vh:1vh;--col-black:#1e1f1f;...
--col-orange:#dc5648}`). The same block also defines `--vh:1vh` which
is then overridden to the actual viewport-height/100 by JS for the
mobile 100vh problem.

A two-state color flip is driven by `[data-bg="white"]` and
`[data-bg="black"]` on `#__app` and per-section containers. There is
no CSS dark-mode toggle — the flip is per-route / per-section.

### Typography

Two families, both self-hosted as WOFF2 with `font-display: swap`.
The site is built in a fluid-px system that scales between two
breakpoints (1366 and 1680/1920) and is clamped on mobile at 640px.

| Role | Family | Weight | Size (desktop) | Line-height | Tracking | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Display H0 (404) | `lausanne, sans-serif` | 400 | `27.083vw` (≈`clamp(320px, 27vw, 520px)`) | 0 | `-0.02em` | `tools/tmp/garden-eight/fonts/TWKLausanne-400__eebe8d2b.woff2` |
| Display H1 (hero / wordmark) | `lausanne, sans-serif` | 400 | `14.93vw` (≈`170–215px` at 1440w) | `1.42` (sets in `body`) | `normal` | `TWKLausanne-400` |
| H1 black-section override | `lausanne, sans-serif` | 400 | `14.6314vw` | `1.42` | `normal` | `TWKLausanne-400` |
| H1 (mobile portrait) | `lausanne` | 400 | `14.1835vw` (`.is-any` only) | `1.42` | `normal` | `TWKLausanne-400` |
| H1 (mobile portrait, home) | `lausanne` | 400 | `17.916vw` | `1.42` | `normal` | `TWKLausanne-400` |
| H1 home (mobile, non-portrait) | `lausanne` | 400 | `14.93vw` | `1.42` | `normal` | `TWKLausanne-400` |
| H2 | `lausanne, sans-serif` | 400 | `10.416vw` | `1.42` | `normal` | `TWKLausanne-400` |
| H3 | `lausanne, sans-serif` | 400 | `10.416vw` | `1.42` | `normal` | `TWKLausanne-400` |
| H2-2 | `lausanne` | 400 | `11.4576vw` | `1.42` | `normal` | `TWKLausanne-400` |
| H4 (editor h2.h4 / h3.h4) | `lausanne` | 400 | `3.125vw` (clamped) | `1.2` | `normal` | `TWKLausanne-400` |
| H5 / f-i / editor h2 number-group | `lausanne` | 400 | `1.666vw` | `1.2` | `normal` | `TWKLausanne-400` |
| H6 / editor h3/h4/h5 | `lausanne` | 400 | `1.076vw` | `1.2` | `normal` | `TWKLausanne-400` |
| Body (Pc) | `lausanne, sans-serif` | 400 | `1.076vw` | `1.42` | `normal` | `TWKLausanne-400` |
| Body (html default / f-m) | `lausanne, sans-serif` | 400 | `0.972vw` | `1.42` | `normal` | `TWKLausanne-400` |
| Body S (f-s) | `lausanne, sans-serif` | 400 | `0.833vw` | `1.5` (`.Sm-b` & `f-s` share) | `normal` | `TWKLausanne-400` |
| Body XS (f-xs) | `lausanne, sans-serif` | 400 | `0.763vw` | `1.5` | `normal` | `TWKLausanne-400` |
| Body XXS (f-xxs) | `lausanne, sans-serif` | 400 | `0.694vw` | `1.5` | `normal` | `TWKLausanne-400` |
| Description lead | `lausanne, sans-serif` | 200 | `1.041vw` (`.f-logo`) | `1.6` | `normal` | `TWKLausanne-200` |
| Editor / body long-form | `lausanne, sans-serif` | 200 | `1.076vw` | `1.6` | `normal` | `TWKLausanne-200` |
| Logo wordmark "Garden / One" | `lausanne, sans-serif` | 400 | `1.041vw` (≈`15px @ 1440w`) | `1.42` | `normal` | `TWKLausanne-400` |
| Serif display (`gunsan`) | `gunsan` | 600 | scales with parent (H1 = 14.93vw, hero pickups = 14.93vw) | `0.51` (tight, `.serif` class) | `0` | `tools/tmp/garden-eight/fonts/gunsan__590dd846.woff2` |
| Serif (mobile, H0) | `gunsan` | 600 | `40.6245vw` (`.is-any .notfound-h0.h0`) | `0.51` | `0` | `gunsan` |
| Japanese (lang=ja) | `lausanne, noto-sans-cjk-jp, sans-serif` | 300 (intro) / 300 (editor) | inherits | `1.4` (intro) / `1.6` (editor) | `normal` | Noto Sans CJK JP — system fallback (not self-hosted in dump) |
| Bilingual JA (`.j`) | `lausanne, noto-sans-cjk-jp, sans-serif` | 300 | inherits | `1.4` | `normal` | system |

Font stack is declared as `html { font-family: lausanne, sans-serif; }`
(`tools/tmp/garden-eight/playwright/homepage.html:36`, inline CSS line
1628 in the prettified file). System fallback is bare `sans-serif` —
no SF Pro / Inter / Helvetica named fallbacks.

The serif `gunsan` is the only typographic "second voice" in the
system. It is used for: the hero's "What can we make next" wordmark,
the case-study titles ("Takamitsu Motoyoshi", "Phil Studio", "Anai
Wood"), the mobile menu links, and the 404 wordmark. The display
weight is `600` only, with a tight `line-height: 0.51` and zero letter
spacing, so characters overlap slightly when set large.

### Spacing & radius

The site uses a viewport-relative spacing system (`vw`-based) on
desktop and an absolute `px` ladder on mobile (≤640px). There is no
`--space-*` design token; spacing is inlined in the CSS.

- **Base unit:** 1vw at 1440 viewport ≈ 14.4px (desktop). On mobile
  (≤640px), base becomes 10px.
- **Horizontal page padding (desktop):** `12.5vw` (each side), so
  content max-width tracks viewport and gutters stay proportional.
- **Horizontal page padding (tablet portrait, ≤1180px):** `12.5vw`
  (unchanged).
- **Horizontal page padding (mobile, ≤640px):** `20px` (each side)
  via `.body { padding-left:20px; padding-right:20px; }`.
- **Vertical rhythm in cases (`.cases-inf`):** `3.5em` tall, flex
  row, justify-between.
- **Top-of-page hero offset (`.site-title`):** `padding-top:25vh;
  padding-bottom:25vh` (desktop) → `padding-top:18.75vw;
  padding-bottom:10.42vw` (tablet landscape).
- **Section-to-section gap (`.St-footer`, `.Ph`, `.St-wrap`):**
  driven by `[data-n="N"]` height tokens:
  `[data-n="0"]=0`, `0.5=1.04vw`, `1=2.08vw`, `1.5=3.125vw`,
  `2=4.17vw`, `2.5=5.21vw`, `3=6.25vw`, `3.5=7.29vw`, `4=8.33vw`,
  `4.5=9.375vw`, `5=10.42vw`, `5.5=11.46vw`, `6=12.5vw`,
  `6.5=13.54vw`, `7=14.58vw`, `7.5=15.625vw`, `8=16.67vw`,
  `8.5=17.71vw`, `9=18.75vw`, `9.5=19.79vw`, `10=20.83vw`.
  On mobile these collapse to absolute `5px × N` (`[data-mb="0"]=0`,
  `0.5=5px`, `1=10px`, ... `15=150px`).
- **Top-shadow ellipse (`.Sd`):** `box-shadow:inset 0 6.25vw 5vw
  rgba(0,0,0,1); height:12.5vw; left:-6.25vw; width:calc(100% +
  12.5vw)` — a vignette cap at the top of the page over the
  WebGL canvas. On mobile (`.is-any .Sd`) reduced to
  `box-shadow:inset 0 40px 32px #000`.
- **Radii:**
  - Full round (default for buttons, cursor, badges): `100%` or
    `border-radius:100vmax` on `.ui-btn` and friends.
  - Pill button border: `2.0833vw` (≈30px @ 1440w) on `.ui-btn .bd`.
  - `ui-btn` is `border-radius:100vmax; height:2.15rem;
    min-width:4.17vw`.
  - Chat input: `border-radius:1.25em` (with `--tt-r:1.25em` token).
  - WebGL hover target: `border-radius:214.992px` on `.thumb`
    (matches H1 font-size in pixels at the time of capture).
  - WebGL container radius is variable: 11 steps
    `[data-border-radius="0"..."1"]` map to `0 → 6.25vw` on desktop
    and `0 → 30px` on mobile.
  - 3D-rendered `gl-about8Group` panel radius on mobile: `0 0 30px
    0` (rounded only bottom-right).
- **Shadows:** the system has two distinct shadow patterns —
  - **Inner bezel / "pressed" surface** (used on cursor halo, thumb
    capsule, chat bubble, ui-budge): `box-shadow:inset 0 2px 2px
    #1e1f1f, inset 0 3px 2px #dbd6d0, inset 0 3px 3px #dbd6d0`.
    Mobile variant reduces to `inset 0 1px 1px #1e1f1f, inset 0 1px
    1px #dbd6d0, inset 0 2px 2px #dbd6d0`.
  - **Outer "scroll progress" ring:** none (just stroke). Top
    vignette `.Sd`: `box-shadow:inset 0 6.25vw 5vw #000`.

### Iconography

A custom sprite of three inline `<symbol>`s is defined in a hidden
`<div>` near the end of `<body>` (the SVG container is `display:none`
and only `<use>` references render it). The set is intentionally tiny:

- `#i-start` — 4-point spark / star, `viewBox="0 0 53.84 53.72"`,
  single `<path>`.
- `#i-arrow` — a 5-point arrow with notch, `viewBox="0 0 100 100"`,
  hand-tuned to fit inside a circle. Used for the cursor body and
  the scroll-progress arrow.
- `#i-circle` — `viewBox="0 0 100 100"`, a single `<circle cx="50"
  cy="50" r="50">`. Used as the scroll-progress disk behind the
  arrow.

The only other iconography is the wordmark SVG itself (the
"Tokyo-mon" hand-drawn character mark), which is inlined into every
`Sm` footer block and shown in the home hero as `.logovr svg`
(`viewBox="0 0 160 90"`, single long `<path>`). The favicon is
`https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/icon/favicon.svg`
(also the mask-icon for Safari pinned tabs in `#ffffff`). No
third-party icon library is used.

---

## Layout & Grid

- **Page shell:** `#__app` is a 100vw × 100vh absolutely-positioned
  flex container; inside it, `.Sc` (`.s-container`) is a
  `position:sticky;top:0;height:100vh` viewport, and `.Sw` (`.s-scroller`)
  is the scroll layer with `overflow-x:hidden;overflow-y:scroll`.
  A fixed WebGL `<canvas id="js-back">` sits behind everything at
  `z-index:1`; the page is in front at `z-index:2`; nav/header/footer
  float above at `z-index:6` (`.ui-fixed`) / `99` (`.ui-cursor`) /
  `100` (`.ui-name`).
- **Page body width:** full viewport, but text content is centered
  inside `.body { padding-left:12.5vw; padding-right:12.5vw; }` so
  the readable column is `100vw − 25vw = 75vw` wide on desktop.
- **Columns:** the site uses two custom grid systems:
  - `.col-wrap` (used in footers, about-blocks, contact-block): flex
    row with `margin-left/right:-2.083vw; .col` has
    `padding:0 2.083vw; width:50%` by default; switches to 33.3% with
    `data-col="3"`, 25% with `data-col="4"`, 20% with `data-col="5"`.
  - `.team-ul`: 3-column flex row, `width:33.3%` per
    `.team-li`, with a 12.5vw top / 6.25vw bottom offset per item via
    `:nth-child(3n-1) { margin-top:0 }`.
- **Breakpoints** (defined by media queries in the inline CSS):
  - `min-width:640px` — re-justify the subtitle.
  - `min-width:1366px` — primary type-scale boundary; on screens
    ≥1366px the font sizes step *up* again, capped at 1680 and 1920.
  - `min-width:1680px` — upper type cap; `.f-m` becomes `16.24px`,
    `.h1` stays fluid.
  - `min-width:1920px` — absolute cap; fonts pin to `.611vw` etc.
  - `max-width:1366px` — down-step type cap.
  - `max-width:1280px` — `.ui-btn` height drops to `28px`,
    `.ui-scroll` padding to `23.8px`.
  - `max-width:1180px` — `.body` padding 12.5vw, `.site-title
    [data-str=canwe]` becomes full-width right-aligned, `.ui-budge`
    repositions.
  - `max-width:1180px` and portrait — `--form-w:100%` (chat
    full-width), `[data-n]` collapse to absolute 15px steps.
  - `max-width:844px` landscape — `.h1` drops to `11.944vw`,
    `.site-title` reduces to `18.75vw` top.
  - `max-width:768px` — chat form 100% wide, padding 90px sides.
  - `max-width:640px` — primary mobile breakpoint. Type caps, body
    becomes `14px`, hero `.h1` is `14.1835vw`, not-found `.h0` is
    `40.6vw` (`.is-any`) or `89.4vw` (non-portrait), `[data-mb]`
    steps go live. `[data-bg=home] .Sm` padding 0.
  - `max-height:560px` — only kicks in inside `.Cb` blocks, dropping
    `[data-mb="4"]` to 20px.
- **Vertical rhythm:** the home page is built as a sequence of
  full-bleed stacked sections inside `<main class="Pc s-body">`:
  1. `.Ph` (Page hero) — the wordmark + small description
  2. `.Pb` (Page body) — the "We approach every project with..."
     intro + case-study marquee + View Cases link
  3. `.Pf` (Page footer, `[data-bg="black"]`) — large "About us"
     panel with full-bleed video
  4. `.Sm` (Sub mini-footer) — logo / address / SNS / email row

The home hero is centered both axes: `.site-title {
align-items:center; display:flex; justify-content:center;
margin-bottom:-3.125vw; padding:25vh 0; width:100% }`, with the
wordmark on three lines: "What / can we / make next" (last line
right-indented). The description copy sits in the top-left at
`top:4.17vw; left:3.125vw` (`.description`).

---

## Components

### Header / Nav
- **Structure:** `<header class="Hd">` containing a left `.ui-name`
  (the wordmark "Garden / One") and a right `.ui-navi-r` (a
  `<a class="ui-menu">` with the words "CLOSE / MENU" stacked
  vertically). The full-screen nav menu is a sibling `.ui-navi-wrap`
  that is `position:fixed;right:0;top:0;width:100vw;height:100%;
  pointer-events:none;transform:translateY(-101%)` and slides in
  on `.is-menu-opened`.
- **Height:** `.ui-name` and `.ui-navi-r` are both
  `height:6.25vw; min-height:2em`. On mobile they are `60px` (`@1280`
  breakpoint) → `60px` (`@640`).
- **Padding:** `.ui-name { padding:0 3.125vw }` (left/right of logo);
  `.ui-navi-r { padding:0 2.625vw }`.
- **Font:** logo wordmark is `f-logo` (size 1.041vw, line-height
  1.42, weight 400, letterspacing normal). The word "One" is
  uppercased via `.js-p { text-transform:uppercase }` and padded
  `padding-left:0.33em` from "Garden".
- **Hover:** the "CLOSE / MENU" `.y` label slides
  `transform:translateY(-100%)` ↔ `translateY(0)` over `.45s`
  (`.ui-menu .y` + `.is-menu-opened .ui-menu .y`).
- **Background menu open:** the `.ui-navi-bg` is the dark
  `--col-black` plane that slides in from `translateY(-101%)` to
  `translateY(0)`. The nav links themselves are staggered: each
  `[data-d="N"] .t` element gets a 0.05s additional transition
  delay so the items cascade in 50ms apart.
- **Active route indicator:** a 1px-tall bar `.b` is `position:absolute;
  bottom:0; height:1px; width:100%; transform:scaleX(0);` and
  scales to `scaleX(1)` on `:hover` and on the `.nuxt-link-exact-active`
  link.
- **Footer nav (`.ui-navi-footer`):** holds the language toggle
  (`.ui-navi-r.ui-lang`) — a single `JA` link that uses
  `nuxt-link-exact-active` to disable pointer events.
- **Mobile menu:** a 6th link "AI" appears in `.ui-navi` for the
  chatbot route.

### Page hero wordmark (`.site-title`)
- **Anatomy:** `<div class="h1">` with three `<div class="p o">`
  children, one per "row" of the wordmark. Each `.p` contains one
  or two `<div class="w t js-c">` word cells.
- **Lines (home):** "What" / "can we" / "make next", where "can we"
  is two cells on the same line (`<div data-str="canwe">`) with a
  different `padding-left` (1.3em).
- **Indent overrides:** `[data-str="what"] { padding-left:0.4em;
  text-align:left }`, `[data-str="canwe"] { padding-left:1.3em;
  white-space:nowrap }`, `[data-str="make"] { padding-left:0 }`,
  `[data-str="next"] { padding-left:1.3em }`. The right-most
  indent of "next" creates the staircase.
- **Type:** `font-family:gunsan; font-weight:600; font-size:14.93vw;
  line-height:0.51 (overridden to 0.765 inside the `.clip-y`
  variant); letter-spacing:0`. Per-word clip-y animation lifts each
  row in from `translateY(140%)` to `translateY(0)` on load, with
  50ms stagger between `[data-d="N"]` cells.
- **Wrap:** `display:flex; flex-wrap:wrap; justify-content:center;
  align-items:center; width:100%`.

### Intro paragraph (`.intro`)
- **Position:** centered, sitting between the hero and the case
  marquee.
- **Copy:** three lines (`.p` each), set in `lausanne 200/1.25em`,
  centered. The mobile variant sets `text-align:left;
  padding-bottom:20px`.
- **Animation:** same clip-y + 50ms stagger as the hero wordmark.

### Case-study marquee (`.pickup`)
- **Structure:** `<div class="pickup-wrap">` (overflow:hidden,
  width:100vw) → `<div class="pickup-ul">` (display:flex,
  flex-direction:column, justify-content:space-between) → a
  vertical stack of `<article class="pickup-li">` items.
- **Each item:** contains a `<a class="pickup-a">` (block,
  text-align:center, line-height:0) which in turn holds a
  `.cases-h1` typography block.
- **`.cases-h1`** is the marquee title — a multi-row wordmark
  with a round "thumb" capsule embedded in the first word.
  Thumb is `.thumb { border-radius:1em; display:inline-block;
  height:.53em; margin-top:-.285em; width:.53em; position:absolute;
  top:50% }` and contains a video (`.js-bg-video-inview`) for
  `photoyoshi` and image backgrounds (`.js-bg-img-inview` with
  data-d1x/data-d2x/data-mob) for the static case studies.
- **The thumb background plate** `.cases-h1 .thumb .b` is
  `hsla(33,13%,84%,0.2)` with the inset "pressed" bezel shadow,
  fading in via `opacity:0 → 1` over `.6s cubic-bezier(.32,.94,.6,1)`
  when `[data-shown="1"]`.
- **Marquee animation:** the `.mq-anim` container has
  `transform:translate(0)` initially and is translated to its
  end position by JS (`.js-sp` opacity 0 on load, set to 1 by
  the loading class removal). On a reduced-motion device
  (`.is-reduced`) it falls back to `padding-left:3.125vw` instead
  of scrolling.
- **Type:** `font-family:gunsan; font-weight:600; line-height:0.6`
  inside `.mq.clip-y`, 14.93vw in size, but the `.mq` is set to
  `font-size:0` and contains `<div class="w t">` cells which hold
  the actual size (so the cells snap to a strict baseline).
- **Cases visible on the home (May 2026 dump):** `photoyoshi` (video
  thumb), `phil-studio` (image thumb), `anai-wood` (image thumb);
  7 more `<article class="pickup-li">` slots are reserved but
  un-rendered (`<!---->` placeholders).
- **Selected/hover state:** `.pickup-a .cases-h1 .l` is the literal
  wordmark text rendered above the thumb. It is `opacity:0.5`
  when `.entered`, `opacity:1` on `.selected`, transitions
  `opacity .6s cubic-bezier(.32,.94,.6,1)`.

### View Cases link (`.ui-link-hn`)
- **Anatomy:** inline-block wrapper that holds a numeric badge
  (e.g. "01") and a label. `.ui-link-hn .num` is `font-weight:200;
  padding-left:0.5em; padding-top:1px`.
- **Underline:** on hover, the same `.a .b` 1px line scales from
  `scaleX(0)` → `scaleX(1)` over `.3s cubic-bezier(.32,.94,.6,1)`.
- **Default placement:** centered at the bottom of the cases
  section, beneath a 1px `.hr` divider.

### Page footer video panel (`.Pf`)
- **Position:** a full-bleed `[data-bg="black"]` section after the
  cases. Holds a video element via `.js-bg-video-inview.use-dp.use-da`
  with `data-poster` (jpg) and three MP4 sources: `data-d1x`,
  `data-d2x`, `data-mob` (`any_homeFooterGroup@1x.mp4`,
  `@2x.mp4`, `@mb.mp4`).
- **Aspect:** on desktop, `.Pf-body` is `height:calc(var(--vh)*100 -
  6.25vw)`; on mobile, `.is-any .Pf-body` is `height:auto` and
  `.a-mask` is `padding-top:66.67%; position:relative`.
- **Inset:** the panel has an `inset` shadow that fades in
  `opacity:0 → 1` over `.6s .3s` once `[data-shown="1"]`. On
  mobile, the inset is `0 -60px 60px 20px` of the white tone.
- **Editor block:** the right `.col` of `.col-wrap` contains a
  single paragraph and an "ABOUT US" link (`.ui-link-bl`). The
  link uses the same underline-on-hover treatment.

### Sub-mini footer (`.Sm`)
- **Position:** `position:absolute; bottom:0; left:0; width:100%;
  height:6.25vw` on desktop; on mobile, the layout is restructured
  into 2×2 absolutely-positioned slots.
- **4 slots:**
  - `.Sm-li._logo` (left, 12.5vw padding) — the same
    "Tokyo-mon" wordmark SVG, `height:1.67vw` on desktop /
    `24px` on mobile.
  - `.Sm-li._address` (left) — `©2022` in `lausanne 200,
    .Sm-b` size.
  - `.Sm-li._sns` (centered, `transform:translateX(-50%)`) — three
    icon-less links `IG / TW / IN` in `f-s` size, each
    `2.083vw × 4.167vw` and centered in its flex cell.
  - `.Sm-li._mail` (right) — a clickable email
    (`data-name="hello" data-domain="garden-eight.com"` →
    `hello@garden-eight.com`). The label has a 3-line
    `.o` overflow that slides on click (toggles
    `class="copied"` to swap "Copy to clipboard" ↔ "Copied"). On
    mobile (`.is-any`), the second `.t` is hidden and the email
    is the only label.
- **On the homepage specifically:** `.Sm { padding-bottom:0;
  padding-top:0 }` and the SNS row + email sit on a `2.0833vw` row
  rather than the 6.25vw footer.
- **Color:** all text inherits `--col-white` because the section
  is `[data-bg="black"]`.

### Custom WebGL cursor (`.ui-cursor`)
- **Anatomy:** a fixed `position:fixed; width:.53em;
  height:.53em` circle that follows the mouse via JS.
  Inside is `.icon` (the arrow SVG, white-filled, `transform:
  rotate(-90deg) scale(.355)`) and `.bg` (a black-filled circle
  with the inset "pressed" bezel shadow).
- **Default state:** both `.icon` and `.bg` are `transform:scale(0)`;
  on `[data-cursor-type="view"]` they scale to `1` over `.3s`.
- **Z-index:** `6` (same as `.ui-fixed`).
- **Source:** spawned once per page, lives inside `<div class="As">`
  which also contains the SVG `<symbol>` sprite.

### Scroll progress disk (`.ui-scroll`)
- **Anatomy:** a fixed `bottom:0; right:0; width:2.083vw;
  height:6.25vw; padding:0 2.625vw` element with a 60-px
  circular SVG inside.
- **Composition:**
  - `.progress` — a `viewBox="0 0 124 124"` ring path
    `M62,2A60,60,0,1,1,2,62,60,60,0,0,1,62,2`, `stroke-width:4`,
    `fill:none`. Its `pathLength` is animated by JS (the actual
    progress is computed against scroll position).
  - `.arrow` — circle + arrow stacked SVGs (`#i-circle` bg,
    `#i-arrow` path).
- **State:** hidden off-canvas via `transform:translate3d(110%,0,0)`
  until `.is-loaded` (then `translate3d(0,0,0)` over `1.4s`).
- **Hover:** `.arrow .bg` scales from `.7` → `1` over `.3s`.
- **Mobile:** the disk is `60px` square in the bottom-right
  corner (`padding:0; right:0; top:auto`).

### Background WebGL canvas (`#js-back`)
- **Anatomy:** full-viewport `<canvas class="js-canvas js-sp">`,
  `pointer-events:none`, `position:fixed; top:0; left:0;
  width:100%; height:100%`. `z-index:1`.
- **Engine:** THREE.WebGLRenderer built with
  `new THREE.WebGLRenderer({canvas:..., alpha:!1, antialias:!1})`,
  `toneMapping:THREE.ACESFilmicToneMapping`, exposure `1.5`,
  `physicallyCorrectLights:!1`, no shadow map.
- **Render loop:** dual-render setup — a main scene
  (`this.scene = new THREE.Scene()`) and a `WebGLRenderTarget`
  with custom GLSL blur (uses `glslify` pragmas, `blur9()` for a
  9-tap Gaussian, GLSL ES 1.0 syntax).
- **Lighting:** `THREE.AmbientLight`, `THREE.DirectionalLight`,
  `THREE.PointLight`, `THREE.SpotLight` all instantiated.
- **3D models:** `THREE.GLTFLoader` is loaded to import
  `fox.gltf` and `lizard.gltf` from
  `https://garden-eight.com/assets/models/blender/fox/e/fox.gltf`
  and `.../blender/lizard/d/lizard.gltf`. These are used as the
  individual team avatars (each team member is assigned an animal
  per the FAQ).
- **Visibility:** initially `opacity:0` (`.js-sp`); becomes 1 when
  the loading state ends.
- **Disables:** if `[data-webgl="false"]` is set (no WebGL), the
  whole app falls back to flat DOM with magenta borders on
  `.js-gl-dom` debug outlines.

### AI chat panel (`/ai`)
- **Route:** a dedicated page (`data-current-name="ai"`) with the
  same shell but a chat-form footer fixed at `bottom:0;
  width:100%; z-index:3`.
- **Form:** `.chat-form .chat-textarea` is a multi-line auto-grow
  input (`min-height:2.715rem; max-height:10rem; line-height:
  1.5rem; resize:none; overflow-y:hidden`). The rounded
  `border-radius:1.25em` carries the "pressed" bezel shadow.
  Background is `hsla(33,13%,84%,0.3)` (translucent bone) with
  `backdrop-filter:blur(9px)`.
- **Submit:** a circular button `.chat-submit` (1:1, max
  2.715rem) pinned to the right of the textarea.
- **Bot identity:** "Hachi", avatar from
  `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/ai/icon/hachi-icon1.jpg.webp`,
  round 2.083vw icon. Voice is friendly, uses `{{}}` token
  placeholders for cross-links (HOME, ABOUT, CASES, X,
  Instagram, hello@garden-eight.com).
- **Knowledge source:** a Notion API at
  `https://garden-eight.com/_api/chatApi/json/setting.json` and
  `.../faq.json`, fetched at runtime and rendered as a chat
  answer (the bot uses 12 FAQ rows including "About Services",
  "Web Accessibility", "Pricing", "Strengths", "Tell me about
  yourself", etc., each with `Question_en / Answer_en /
  Question_ja / Answer_ja`).

### Marquee (`.mq`)
- **Composition:** `font-size:0` parent that holds 2–3
  `.mq-t` slots, each containing the same wordmark duplicated.
  The active slot is `visibility:visible`; the others
  `visibility:hidden`. `.mq-anim` is the translation wrapper.
- **Behavior:** the slots are swapped every N seconds via JS
  to give the illusion of horizontal marquee; `will-change:auto`
  when not visible, `will-change:transform` when
  `[data-visible="1"]`.
- **Reduced-motion:** `.is-reduced .mq-anim { padding-left:3.125vw }`
  — no animation, just static indent.

### Chat bubble / markdown surfaces
- **Assistant bubble** (`.chat-assistant`): `border-radius:1.25em`,
  `border:1px solid rgba(30,31,31,0.3)`, same `backdrop-filter:
  blur(9px)`, padding `1em`. Avatar (`.chat-icon`) on the left is
  a 2.083vw round chip with the Hachi icon and an `i-arrow` SVG
  arrow in the center.
- **User bubble** (`.chat-user`): same bezel + backdrop blur,
  aligned to the right, padding `.7rem 1rem .3rem`, max width
  `100% - 30%` (the right column gets 30% from the left).
- **Markdown** (`.markdown`): standard Markdown styling —
  bullet list markers (`.5em` black dots), ordered list
  counter-reset, blockquote with dark fill + bone text, code
  blocks with `border-radius:.5em` and `rgba(30,31,31,0.1)` bg,
  tables with 1px hairline borders and a header
  `rgba(30,31,31,0.05)` band, links with an underline
  `var(--col-black) 1px` that runs the `hover` keyframe (see
  Animations).

### Notfound (404) wordmark (`.notfound-h0`)
- **Anatomy:** a centered wordmark at
  `position:absolute; top:50%; left:50%; transform:translate3d
  (-50%,-50%,0)`. Same wordmark font, `font-size:27.083vw`,
  `letter-spacing:-0.02em`, `line-height:0`. On mobile
  (`.is-any`) it is `40.6245vw`; in extreme mobile
  (`.is-any` non-portrait) `89.4vw`.
- **Behavior:** `pointer-events:none`. Inside is a
  `<div class="notfound-title">` with "404" `.notfound-h1`
  (weight 300, margin-right:1em) plus a "back to home" link.

### Site clock (`.clock`)
- **Anatomy:** a 2.083vw round clock face; inside, three bars
  `.h / .m / .s` (each 1px or 2px wide, centered absolutely)
  are rotated by JS to show the local Tokyo time. The hand
  pivot center is marked with a 2×2px round dot (`.clock:after`).

---

## JavaScript & Libraries

The site is a Nuxt 2 SSR app, with vendor libraries split across
the page-entry JS chunks at `/_app/ef88170.js` (WebGL/THREE bundle),
`/_app/a2881b3.js` (the main app + GSAP), `/_app/85c6b91.js`
(CoreJS polyfill + Vue 2.6 + Nuxt 2.4.0 core), `/_app/8c3651d.js`
and `/_app/8929ffd.js` (the footer `<div class="Sm">` Vue SFCs),
`/_app/a036b2b.js` (runtime + polyfill bootstrap). Static payload
+ state are at `/_app/static/1779191522/payload.js` and
`/state.js`. The chat API lives at
`/_api/chatApi/json/setting.json` and `/_api/chatApi/json/faq.json`.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Nuxt.js | 2.4.0 | `version:"2.4.0"` string in `js/85c6b91__55ce1346.js` | SSR + `__NUXT__` payload + manifest.js |
| Vue.js | 2.6.11 (core) / 2.4.0 (template) | `version:"2.4.0"` in 85c6b91, `vuex` module references | SSR template-renderer in 85c6b91 |
| `@nuxtjs/i18n` | 1.4.1 | `version:"1.4.1"` in `js/a2881b3__2b366779.js`, `localePath` and `setLocale` calls in 8c3651d and a2881b3 | Two locales: `en` and `ja` (switch via `/ja` route) |
| Vuex | 3.6.2 | `version:"3.6.2"` in `js/85c6b91__55ce1346.js` | One store; `state.projects` is a list of case studies |
| GSAP | 3.12.1 | `version:"3.12.1"` in `js/a2881b3__2b366779.js` and `js/ef88170__9076b12e.js` | Tween / Timeline / config / registerPlugin |
| ScrollTrigger | (bundled with GSAP 3.12) | `ScrollTrigger.create(e,t)` in `js/ef88170__9076b12e.js` | Used for the marquee + scroll-driven reveals |
| THREE.js | r133 | `REVISION` returns `133` in `js/ef88170__9076b12e.js` | WebGLRenderer, ShaderMaterial, GLTFLoader, VideoTexture |
| `glslify` | (bundled in 889KB file) | `GLSLIFY 1` pragma prefix in 9 GLSL source strings in `js/ef88170__9076b12e.js` | Compiles `.glsl` files at build time; uses `blur9` for 9-tap Gaussian |
| Nuxt "NoSsr" component | (in `a2881b3__2b366779.js`) | `name:"NoSsr", functional:!0` Vue SFC | Defers hydration of the chat panel until mounted |
| Hachi chatbot (custom) | n/a | The chat form on `/ai` + the two Notion-backed JSON files | The "engine" is a Vue component, not a vendor library; knowledge is curated in a Notion DB and fetched as JSON |

The 889 KB single bundle at `js/ef88170__9076b12e.js` contains the
THREE engine, all GSAP plugins, all custom shaders, the GLTFLoader
and a custom `blender` / `fox` / `lizard` loader. It is the
largest file in the dump and the only one that touches the WebGL
context.

There is **no** GSAP-based Lottie file, no Framer Motion, no
Locomotive Scroll, no Barba/Swup, no jQuery, no Bootstrap. The site
re-implements scroll-snap (`position:sticky` + custom scroll
container) and page-transition (`.is-tr-start.is-loaded` triggers
a `transform:translate3d(0,-120%,0)` exit on every `.t`, `.o`,
`.slidein`, `.fadein`, `.zoomin` element) entirely with raw CSS
transitions controlled by a body class.

---

## Animations (Catalog)

The site has very few explicit `@keyframes` and many `transition`
declarations that act as keyframes. Animations are split into
two regimes: "load" (`.is-loading-a` → `.is-loaded` state change)
and "intersection" (`.js-iv` / `[data-shown="0|1"]` toggled by
the IntersectionObserver).

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `hover` | `playwright/homepage.html:36` (inline CSS) at the `@keyframes hover` block | 0.6s | `cubic-bezier(0.66, 0, 0.34, 1)` | `:hover` on `.markdown a` — the underline translates 0% → 110% → -110% → 0% to create a wipe-then-rewrite effect |
| `rotate` | `playwright/homepage.html:36` at the `@keyframes rotate` block | unbounded (intended infinite) | linear | bound to `.ui-budge` decorative element; rotates 0deg → 360deg |

### CSS transition classes (the real animation system)

The site does the bulk of its motion with `transition:` rules on
state-bearing selectors. The trigger is a JS-driven class flip
on the element (`.js-iv` → `[data-shown="1"]` or `[data-visible="1"]`)
or on `<html>` (`.is-loading-a` → `.is-loaded`).

| Selector (target) | Initial | Final | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- | --- |
| `.is-loaded [data-shown="1"].clip-y .t` | `transform:translate3d(0,140%,0)` | `transform:translate(0)` | 1.4s | `cubic-bezier(.32,.94,.6,1)` | `.is-loaded` body class |
| `.is-loaded [data-shown="1"].ui-btn-mail .o` | `transform:translate3d(0,100%,0)` | `transform:translate(0)` | 1.4s | `cubic-bezier(.32,.94,.6,1)` | `.is-loaded` body class |
| `.is-loaded .slidein[data-shown="1"]` | `opacity:0; transform:translate3d(0,1em,0)` | `opacity:1; transform:translate(0)` | 1.4s | (linear) | scroll into view |
| `.is-loaded [data-shown="1"].slidein h2/h3/h4/h5` | same | same | 1.4s | (linear) | scroll into view |
| `.is-loaded .editor.js-iv-c p[data-shown="1"]` | `opacity:0; transform:translate3d(0,2em,0)` | `opacity:.9; transform:translate(0)` | 1.4s | (linear) | scroll into view |
| `.is-loaded .hr[data-shown="1"] div, .vr div` | `transform:translate(0) scaleX/Y(0)` | `transform:translate(0) scale(1)` | 1.2s | (linear) | scroll into view |
| `.is-loaded .zoomin[data-shown="1"]` | `transform:translate(0) scale(0)` | `transform:translate(0) scale(1)` | 0.7s | (linear) | scroll into view |
| `.is-loaded .fadein[data-shown="1"]` | `opacity:0` | `opacity:1` | 0.7s | (linear) | scroll into view |
| `.is-loaded .Sd.fadein[data-shown="1"]` | `opacity:0` | `opacity:.2` (`.3` for cases/archive) | 0.7s | (linear) | scroll into view |
| `.is-loaded .cases-h1 .thumb[data-shown="1"]` | `opacity:0` | `opacity:.9` | 1.4s | `cubic-bezier(.32,.94,.6,1)` | scroll into view |
| `.is-desktop .flip-y .t` | base state | on `:hover` `transform:translate3d(0,-100%,0)` | 0.6s | (linear) | hover |
| `.a .b` (link underline) | `transform:translate(0) scaleX(0)` | `:hover → scaleX(1)` | 0.3s | `cubic-bezier(.32,.94,.6,1)` | hover, active-route |
| `.ui-btn` | base | `:hover` color flip + `.bg:after` `scale(0) → scale(2)` | 0.3s | `cubic-bezier(.32,.94,.6,1)` | hover |
| `.ui-cursor .icon, .ui-cursor .bg` | `transform:translate(0) scale(0)` | `[data-cursor-type="view"] → scale(1)` | 0.3s | (linear) | JS mouse over a `[data-cursor-type="view"]` element |
| `.ui-scroll .arrow .bg` | `transform:scale(.7)` | `:hover → scale(1)` | 0.3s | (linear) | hover |
| `.ui-scroll .arrow .path` | `transform:rotate(0) scale(.7)` | `[data-ov-ft="1"] → rotate(-180deg) scale(.7)` (when footer enters viewport) | 0.7s | (linear) | scroll |
| `.ui-scroll` (whole element) | `transform:translate3d(110%,0,0)` | `.is-loaded → translate3d(0,0,0)` | 1.4s | (linear) | page load |
| `.is-menu-opened .ui-navi-bg` | `transform:translateY(-101%)` | `transform:translate(0)` | 0.45s | (linear) | menu open |
| `.is-menu-opened .ui-navi-wrap .clip-y .t` | `transform:translateY(-120%)!important` | `translateY(0)!important` | 0.6s | (linear) | menu open |
| `.is-menu-opened .ui-menu .y` | `transform:translateY(-100%)` | `transform:translateY(0)` | 0.6s | (linear) | menu open |
| `.is-menu-opened #__app .ui-navi-wrap .clip-y .t[data-d="N"]` | base 0s delay | +`0.05s × N` delay (N=0..10) | 0.6s | (linear) | menu open, cascade |
| `.cases-a .cases-h1 .l, .pickup-a .cases-h1 .l` | `opacity:.7` (`.entered .pickup-a` → `.5`) | `.selected` → `opacity:1` | 0.6s | `cubic-bezier(.32,.94,.6,1)` | hover/select |
| `.is-img-loaded img, .is-video-loaded video` | `opacity:0; transform:translate(0) scale(1.1)` | `opacity:1; transform:translate(0) scale(1)` | 1.8s (transform) / 0.6s (opacity) | (linear) | media loaded |
| `.is-any .js-gl-dom.gl-about8Group .js-bg-video-inview` | `opacity:0` | `.is-video-loaded → opacity:1` | 0.6s, delay 1.2s | (linear) | media loaded |
| `.chat-input-t` | `opacity:0; transform:translate3d(0,140%,0) rotate(1deg)` | `[data-shown="1"] → opacity:1; transform:translateZ(0)` | 1.4s | `cubic-bezier(.32,.94,.6,1)` | panel reveal |
| `.Sd` (top vignette) | `box-shadow:inset 0 6.25vw 5vw #000; height:12.5vw; width:calc(100%+12.5vw); left:-6.25vw` | fade in with `.Sd.fadein` 0.7s | 0.7s | (linear) | scroll |
| `[data-ov-fb="1"] [data-bg="white"] .ui-scroll` color flip | `color:var(--col-black)` | `color:var(--col-white)` | 0.1s | (linear) | scroll past footer |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | `gsap.timeline()` opening — slides the hero wordmark rows in one-by-one | `is-loading-a` removed | One timeline per page, uses `power2.in` for the row's exit |
| GSAP | `gsap.to(this.logo.elems[i], {duration:.6, ease:"power2.in", y:"-120%", onComplete:...})` | page load | Lifts logo pieces out as loading state ends |
| GSAP | `gsap.config({nullTargetWarn:!1})` | global, set on init | Suppresses GSAP warnings for null targets |
| GSAP | `gsap.registerPlugin(ScrollTrigger)` | global, set on init | Wired once at module init |
| ScrollTrigger | `ScrollTrigger.create(e,t)` instances | per element with `data-scroll-type` | Drives the `is-tr-start` ↔ `is-tr-end` body classes |
| THREE | `THREE.WebGLRenderer.render()` in `requestAnimationFrame` | always | Continuous WebGL render loop |
| IntersectionObserver | toggles `data-shown` and `data-visible` attributes on `.js-iv` elements | viewport entry | This is the engine for the 1.4s reveal transitions above |
| Vue transitions | `<transition name="...">` on `<nuxt-link>` route changes | route change | Page-level crossfade is replaced by the 0.4s `is-tr-start` "slide-out-up" effect |

### Page transitions

When the user navigates between routes, the body receives
`is-tr-start` first (pointer-events disabled on everything),
then `is-loaded` again after the next page's chunks are parsed.
During `is-tr-start.is-loaded`, every `.t` and `.slidein` element
is forced to `transform:translate3d(0,-120%,0)` (or
`translate3d(0,-2em,0)` for editor paragraphs) with
`transition:transform .4s cubic-bezier(.4,0,.68,.06)!important` —
i.e. everything "lifts up out of the page" over 400 ms with a
sharp decel curve. The next page then animates in the same way
the home page loaded.

---

## Assets

### 3D models

The site ships 2 GLTF 2.0 models, both Draco-compressed. They are
the in-house team mascots: a fox and a lizard, each member of
the team is assigned one (per the FAQ: "Team Animals — Hiroki
Noma (Lizard), Kenta Toshikura (Rabbit), Misato Daikuhara
(Raccoon), Mikiko Kikuka (Cat), Nobuaki Honma (Fox), Natsuko
Sakai (Goat), Meguru...").

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/garden-eight/models/fox__54b3ed26.gltf` | glTF 2.0 JSON | 5,620 B | `https://garden-eight.com/assets/models/blender/fox/e/fox.gltf` | Exported by "Khronos glTF Blender I/O v1.7.33"; 1 mesh, 2 materials (`fox` PBR + `eye` PBR), 1 image (color texture), 1 binary buffer (`fox.bin`). Uses `KHR_draco_mesh_compression`. |
| `tools/tmp/garden-eight/models/lizard__86cdd8e6.gltf` | glTF 2.0 JSON | 6,024 B | `https://garden-eight.com/assets/models/blender/lizard/d/lizard.gltf` | Exported by "Khronos glTF Blender I/O v1.2.75"; 1 mesh (`lizardBody` node), 2 materials, 1 image, 1 binary buffer (`lizard.bin`). Uses `KHR_draco_mesh_compression` level 4, position quantization 14, texcoord quantization 10. |

Both are Draco-compressed (no `.bin` file in the dump — the
binary is fetched at runtime by the THREE GLTFLoader with
DracoLoader). The team's other animal mascots (rabbit, raccoon,
cat, goat) are not in the dump and are presumably fetched
on-demand from the same `/assets/models/blender/...` tree.

### Fonts

All three font files are present in the dump and are
preloaded from the `<head>`.

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Lausanne (TWK Lausanne) | 200, 300, 400 | woff2 | `https://garden-eight.com/assets/fonts/lausanne/TWKLausanne-{200,300,400}.woff2` | yes (also preloaded) |
| gunsan | 600 | woff2 | `https://garden-eight.com/assets/fonts/gunsan.woff2` | yes (also preloaded) |

Local dump paths: `tools/tmp/garden-eight/fonts/TWKLausanne-200__42375966.woff2`
(34,752 B), `tools/tmp/garden-eight/fonts/TWKLausanne-300__60b15389.woff2`
(33,244 B), `tools/tmp/garden-eight/fonts/TWKLausanne-400__eebe8d2b.woff2`
(35,144 B), `tools/tmp/garden-eight/fonts/gunsan__590dd846.woff2`
(17,076 B).

Both families use `font-display: swap` (declared in the inline
`@font-face` blocks). No italic or condensed variants are
shipped. Japanese is rendered in `noto-sans-cjk-jp` — not
self-hosted in this dump; the site relies on the system
fallback chain `lausanne, noto-sans-cjk-jp, sans-serif`.

### Images

Inline `<img>` and `data-*` references in the homepage (only
the home page was captured by Playwright). The site also ships
many JPG/WebP thumbnails per case study under
`https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/{slug}/...`
— three of which are referenced in the home page's marquee.

| Local path (dump) | Type | Source URL | Notes |
| --- | --- | --- | --- |
| `tools/tmp/garden-eight/playwright/images/aboutFooter@1x.jpg__08ab5a4c.webp` | WebP (9,660 B) | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@1x.jpg` | The poster for the "about" footer video |
| `tools/tmp/garden-eight/playwright/images/aboutEight@1x.jpg__b4cda742.webp` | WebP (7,278 B) | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@1x.jpg` | Same family; about-8 panel image |
| `tools/tmp/garden-eight/playwright/images/homeFooter@1x.jpg__48043d4e.webp` | WebP (7,792 B) | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@1x.jpg` | Home footer poster |
| `tools/tmp/garden-eight/playwright/images/c3-1@1x.jpg__40ceb6e7.webp` | WebP (2,562 B) | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/phil-studio/thumb@1x.jpg` | Case study "Phil Studio" thumb |
| `tools/tmp/garden-eight/playwright/images/c3-2@1x.jpg__8358d891.webp` | WebP (2,360 B) | (likely same family, second case) | |
| `tools/tmp/garden-eight/playwright/images/c3-3@1x.jpg__78b6ec99.webp` | WebP (3,254 B) | | |
| `tools/tmp/garden-eight/playwright/images/c3-4@1x.jpg__1fb8c9ad.webp` | WebP (3,864 B) | | |
| `tools/tmp/garden-eight/playwright/images/c3-5@1x.jpg__f713f0d1.webp` | WebP (4,654 B) | | |
| `tools/tmp/garden-eight/playwright/images/c3-6@1x.jpg__cb5d9551.webp` | WebP (656 B) | | |
| n/a | PNG (1200×630 OG) | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/ogp.png` | OGP image, also Twitter `summary_large_image` |
| n/a | PNG (192×192) | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/icon/icon-192x192.png` | `apple-touch-icon` |
| n/a | SVG | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/icon/favicon.svg` | `rel="icon"` + `rel="mask-icon"` |
| n/a | JPG/WebP (Hachi avatar) | `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/ai/icon/hachi-icon1.jpg.webp` | The chatbot's round avatar |

The case-study images in the dump are all `@1x` (1× DPR). The
`@2x` variants are referenced in the home markup via
`data-d2x="https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/{slug}/thumb@2x.jpg"`
and are served by the live site. None of the `images/` directory
in the dump actually contains the case thumbs at full size —
only the lazy-loaded WebP variants that were captured after the
case thumbs scrolled into view.

### SVGs & icons

- **Inline SVGs observed in HTML:** the wordmark "Tokyo-mon"
  character (in `.Sm` and `.logovr`) is a single 160×90 viewBox
  path. It is inlined and is the only "illustration" on the
  site.
- **Standalone SVG files in dump:** none. The favicon SVG
  (`favicon.svg`) lives only on the live CDN and is referenced
  via `<link rel="icon">` — not present as a local file.
- **Icon system:** a custom 3-symbol sprite defined in a hidden
  `<div class="As"><svg><symbol>...` block at the bottom of
  `<body>`. Symbols: `#i-start` (spark), `#i-arrow` (arrow),
  `#i-circle` (circle). Re-used by `<use xlink:href="#...">` in
  the scroll-progress disk and the chat icon. There is **no**
  external icon library.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| n/a (live CDN) | MP4 — `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@1x.mp4` | The "About" full-bleed video at the bottom of the home. Sources for `@1x`, `@2x`, and `@mb` are listed in `data-d1x`, `data-d2x`, `data-mob`. Poster is `.jpg` |
| n/a (live CDN) | MP4 — `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/photoyoshi/thumb.mp4` | Looping autoplay thumb for the "Takamitsu Motoyoshi" case study in the marquee |
| n/a (S3) | WebP — `https://gdn8.s3.ap-northeast-1.amazonaws.com/v3-1/assets/cases/photoyoshi/thumb@poster.jpg.webp` | The `data-poster` for the photoyoshi loop |
| n/a | MP4 / H.264 | The site uses `<video>` with `data-src`, `data-poster`, `data-d1x`, `data-d2x`, `data-mob`. The JS class `js-bg-video-inview` swaps the right source for the viewport. No `<audio>` is used. |

There is no in-dump media; all video is served from the
`d1oo4riy5et4sg.cloudfront.net` CDN and one poster is served
from the S3 origin `gdn8.s3.ap-northeast-1.amazonaws.com`.

---

## Motion & Interaction

### Principles
- Default easing for reveals and "elegant" motion is
  `cubic-bezier(0.32, 0.94, 0.6, 1)` — a soft decel.
- Default easing for "exit / fast" motion is
  `cubic-bezier(0.4, 0, 0.68, 0.06)` — a sharp accel-decel.
- Default easing for "spring / bouncy" hover state is
  `cubic-bezier(0.66, 0, 0.34, 1)` — for the link underline wipe.
- Default duration: 0.1s (color, header chrome), 0.3s (link
  underline, button color flip, cursor scale), 0.6s (button
  label, link clip-y hover), 0.7s (fade-in, zoom-in, card
  hover), 1.2s (horizontal/vertical rule grow), 1.4s (large
  reveals: text clip-y, slide-in, marquee selection), 1.8s
  (image scale-in after load).
- Page transitions are 0.4s sharp (transition-out) followed
  by a 1.4s soft reveal on the new page.

### Specific behaviors
- **Link hover:** the `.a .b` 1px-tall bar scales from
  `scaleX(0)` to `scaleX(1)` over 0.3s, anchored to the
  left of the link. The active route's bar is `scaleX(1)` by
  default.
- **Button press:** the `.ui-btn` `.bg:after` (a 100%×100% white
  circle) scales from `scale(0)` to `scale(2)` over 0.3s, and
  the text color flips to the inverse of the background.
- **Section reveal on scroll:** every `.js-iv` element with
  `[data-shown="1"]` lifts in from `translateY(140%)` to
  `translateY(0)`. Sibling `[data-d="N"]` cells stagger by
  0.05s. The `.slidein` class variant is used for editor h2/h3
  and reveals with a 1em upward translate and opacity 0→1.
- **Marquee:** a left-to-right marquee of 3-slot tiles; each
  tile takes 100vw and 2.5× the marquee's height in the same
  font size, swapping every 4-5s.
- **Page transition:** when the user clicks an `<a class="ui-link-hn">`
  or a `<a class="ui-link-wrap">`, the body gets `is-tr-start`
  first (all `.t / .o / .slidein` lift out with 0.4s sharp),
  then Vue loads the new chunk, then the new page's elements
  reveal in the standard 1.4s soft.
- **Header reveal on scroll:** the header is a `position:fixed`
  top bar; the `.ui-scroll` element slides in from
  `translate3d(110%,0,0)` to `translate3d(0,0,0)` over 1.4s
  when `.is-loaded` is set.
- **Footer background change:** when the page background flips
  to black (entering the `.Pf` section), all foreground colors
  flip from `--col-black` to `--col-white` over 0.1s. This is
  driven by the `data-ov-hb` / `data-ov-fb` attributes toggled
  by the GSAP `ScrollTrigger` instances.

### Reduced motion
- The site checks `window.matchMedia('(prefers-reduced-motion:
  reduce)')` and adds `is-reduced` to `<html>`. Under that
  class, all transitions are forced to `none!important` and
  the WebGL canvas is replaced by a static DOM (`.js-gl-dom`
  is shown with its underlying image). The marquee becomes a
  static left-indent (`padding-left:3.125vw`) instead of a
  scrolling animation.
- The site also has `.is-low` (low-end GPU) and `.is-resizing`
  fallbacks: both force the same `transition:none!important`
  on the animated elements.

---

## Content & Voice

- **Tone:** Quiet, confident, hand-crafted. The site itself is
  treated as the studio's most visible case study. Copy is
  short — usually a single short paragraph per section. There
  is no marketing puffery, no testimonials, no client logos on
  the home page.
- **Voice examples (paraphrased):**
  - Hero description: "We are a digital design studio based in
    Tokyo." (the `meta description` and the `.description` lead
    on the home page)
  - Section intro: "We approach every projects with wonder
    fueled by a boundless spirit of inquisitiveness."
  - Footer column: "Our goal has always been to make a great
    website in a playful, yet humble way. We are driven by a
    willing mind and a sincere attitude to make cool things."
  - FAQ bot: friendly, frequently uses expressions of gratitude
    ("Just ask!", "We look forward to hearing from you!"),
    soft error framing ("As an AI, I might occasionally
    provide incorrect information...").
- **Sentence length:** short to medium. Active voice. First-
  person plural ("we") throughout.
- **Capitalization:** The header chrome is in `text-transform:
  uppercase` (so the nav reads "HOME / CASES / ABOUT /
  ARCHIVES / CONTACT / AI / CLOSE / MENU / JA"). All other
  copy is sentence case. The serif wordmark ("Garden / One")
  is in the studio's chosen mixed case.
- **Punctuation:** Em-dashes are used for parenthetical asides
  ("playful, yet humble way"). Curly quotes are not used —
  straight ASCII `"` and `'` are preferred.
- **CTA vocabulary:** "View Cases", "About Us", "Top", "Mail"
  (the email link), "Copy to clipboard / Copied" (the email
  state), and the `>3em` 4-point spark icon (`#i-start`) for
  decorative emphasis in some headings.
- **Locales:** two — `en` (default) and `ja`. The Japanese
  variant is served at `/ja/...` and uses `noto-sans-cjk-jp`
  with a slightly heavier editor weight (300 vs 200) and
  tighter line-height (1.4 vs 1.6).

---

## Information Architecture

Top-level routes (derived from the manifest and the i18n
config in `js/manifest__0e32888e.js`):

- `/` — marketing homepage (the `home` page). Single page
  rendered as `.Ph` (hero) + `.Pb` (intro + case marquee +
  View Cases) + `.Pf` (about-us full-bleed video panel) +
  `.Sm` (logo / address / SNS / mail row).
- `/cases` — the case-study index. Same shell, the `.pickup-ul`
  becomes a vertical scroll of every case.
- `/about` — the about page. Same shell, leads with a `.Ph`
  hero, then the `gl-about8Group` 3D character panel, then
  the team grid (`team-ul / .team-li`, 3 columns), then the
  `gl-aboutFooterGroup` 3D panel.
- `/archives` — the archive page. Full-bleed WebGL canvas
  with case-study items as draggable planes (`archive-ul,
  archive-li, archive-a`).
- `/contact` — the contact page. Clock (`Of .clock`) +
  address block + email form.
- `/ai` — the chatbot page. Chat form fixed at the bottom,
  Hachi avatar, scroll-back conversation log.
- `/404`, `/400`, `/403`, `/offline` — error routes. The
  `404` page is the visible one in the dump.
- `/privacy-policy`, `/terms` — legal pages. Plain markdown
  render with the standard `.markdown` styling.
- `/ja/...` — Japanese variant of every route above.
- `/_api/chatApi/json/setting.json` and `/_api/chatApi/json/faq.json` —
  Notion-backed JSON API for the chatbot. Not user-visible
  routes, but the bot reads them at runtime.

---

## Accessibility

- **Color contrast:** the design is essentially a two-tone
  monochrome system; text and background always reach at least
  13:1 (off-white `#DBD6D0` on near-black `#1E1F1F` is ~12.8:1;
  black on off-white is the same). The "translucent black at
  30%" border on chat inputs is the lowest-contrast surface
  (`rgba(30,31,31,0.3)` on `hsla(33,13%,84%,0.3)` — measured at
  ~1.4:1 but used only as a 1px hairline border, not as text).
- **Focus indicators:** outlines are explicitly preserved
  (`[data-bg=black] a { outline-color: var(--col-white) }`,
  `[data-bg=white] a { outline-color: var(--col-black) }`).
  The default browser focus ring is not suppressed.
- **Keyboard:** every interactive element is reachable via
  `Tab`. The nav menu's `<a>` items have `pointer-events:none`
  only on the active route (`.nuxt-link-exact-active`); all
  others keep focus. The chat textarea accepts focus on
  page load (`.chat-textarea`).
- **Screen reader landmarks:** `<header class="Hd">`, `<nav>`
  inside the menu, `<main class="Pc s-body" data-page-name=
  "home">` (which carries the `data-page-name` for the screen
  reader's breadcrumb context), and a final `<footer class="Sm">`
  (implicitly the wrapping `<div>`). The wordmark uses
  `<h1 aria-label="Garden Eight">`.
- **ARIA labels:** the email-copy `<a>` has
  `data-name="hello" data-domain="garden-eight.com"` rather
  than the literal email (so screen readers announce the
  obfuscated form). The case-study links use
  `aria-label="<case title>"` (e.g. `aria-label="Takamitsu
  Motoyoshi"`, `aria-label="Phil Studio"`). The scroll button
  has `aria-label="Scroll"`.
- **Reduced motion:** the `is-reduced` body class disables
  all transitions (`.is-reduced.is-any * { transition:none
  !important }`) and replaces the marquee with a static indent.
- **WebGL fallback:** if WebGL is unavailable
  (`[data-webgl="false"]`), the canvas is hidden, `.js-gl-dom`
  containers get a magenta `2px solid #f0f` debug outline,
  and the underlying DOM (images / videos) is shown. The
  `is-low` and `is-reduced` classes do the same.
- **Alt text:** every case thumb in the marquee has
  `aria-label="<case title>"` on the wrapping anchor. The
  wordmark SVG has a `<title>Garden Eight</title>` for screen
  reader announcement.

---

## Sources

Every URL the dump and this specification were built from:

- `https://garden-eight.com/` — homepage (entry-point HTML,
  cached at `tools/tmp/garden-eight/html/asset_43__fcf6d0b3`)
- `https://garden-eight.com/_app/85c6b91.js` — Nuxt 2.4.0 + Vue
  2.4.0 + CoreJS polyfill bundle
- `https://garden-eight.com/_app/a2881b3.js` — main app + GSAP
  3.12.1 + @nuxtjs/i18n 1.4.1 + ScrollTrigger + NoSsr component
- `https://garden-eight.com/_app/ef88170.js` — WebGL bundle
  (THREE r133 + glslify + GLTFLoader + custom shaders)
- `https://garden-eight.com/_app/a036b2b.js` — runtime bootstrap
- `https://garden-eight.com/_app/8c3651d.js`,
  `https://garden-eight.com/_app/8929ffd.js` — footer SFCs
- `https://garden-eight.com/_app/static/1779191522/state.js` —
  initial `window.__NUXT__` state (includes `state.projects`,
  `state.time.tokyo`, `state.time.copen`)
- `https://garden-eight.com/_app/static/1779191522/payload.js` —
  Nuxt asyncData payload
- `https://garden-eight.com/_app/static/1779191522/manifest.js` —
  route manifest
- `https://garden-eight.com/assets/fonts/lausanne/TWKLausanne-200.woff2`
- `https://garden-eight.com/assets/fonts/lausanne/TWKLausanne-300.woff2`
- `https://garden-eight.com/assets/fonts/lausanne/TWKLausanne-400.woff2`
- `https://garden-eight.com/assets/fonts/gunsan.woff2`
- `https://garden-eight.com/assets/models/blender/fox/e/fox.gltf`
- `https://garden-eight.com/assets/models/blender/lizard/d/lizard.gltf`
- `https://garden-eight.com/assets/icon/favicon.svg`
- `https://garden-eight.com/assets/icon/icon-192x192.png`
- `https://garden-eight.com/assets/manifest.json`
- `https://garden-eight.com/_api/chatApi/json/setting.json` —
  Notion API, last edited 2024-09-24
- `https://garden-eight.com/_api/chatApi/json/faq.json` — Notion
  FAQ DB (12 entries, bilingual)
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/ogp.png`
  — OGP / Twitter card
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@1x.jpg`
  — about footer poster
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@1x.mp4`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@2x.mp4`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/img/any/any_homeFooterGroup@mb.mp4`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/photoyoshi/thumb.mp4`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/photoyoshi/thumb@poster.jpg.webp`
  (also served from `gdn8.s3.ap-northeast-1.amazonaws.com`)
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/phil-studio/thumb@1x.jpg`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/phil-studio/thumb@2x.jpg`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/anai-wood/thumb@1x.jpg`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/cases/anai-wood/thumb@2x.jpg`
- `https://d1oo4riy5et4sg.cloudfront.net/v3-1/assets/ai/icon/hachi-icon1.jpg.webp`
- `https://garden-eight.com/404.html` — error route (also
  cached at `tools/tmp/garden-eight/html/404__f91fe188.html`)

External (third-party):
- `https://cdn.jsdelivr.net` — preconnect target (no actual
  loads in the dump; likely a fallback for Vue/three if needed)
- `https://gdn8.s3.ap-northeast-1.amazonaws.com` — S3 origin for
  large asset poster images

---

## Changelog

- 2026-06-20 — Initial draft by opencode lead.
