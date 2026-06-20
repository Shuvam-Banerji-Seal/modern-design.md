# fffuel — design.md

> A structured design specification of **https://fffuel.co**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/fffuel/` (gitignored)

---

## Overview

fffuel.co is a free, single-page tool collection for designers and front-end
developers, hosting roughly sixty small in-browser SVG generators and a
handful of color utilities. The page is essentially a long, tile-based index:
each tool gets a square card with a custom SVG or image background and a
two-line label, and the visitor clicks through to the dedicated tool page.
The visual language is built on a single HSL design-token system (purple,
hue 265) with a dark-mode swap, a self-hosted variable font (Space Grotesk),
and Tailwind 2 utility classes. There is no marketing funnel — the homepage
is the product, and every visible element is a tile, a switch, or a label.

**Category:** Design tool / Tool-collection index site
**Primary surface observed:** Homepage (single page; all tools are child routes)
**Tone:** playful, immediate, slightly geeky; emoji-led copy
**Framework detected (if any):** Static HTML + Tailwind CSS v2.2.19 (utility
classes in markup) + Alpine.js v3.13.10 (theme switch + `intersect` and
`collapse` plugins) + Plausible analytics + Cloudflare Web Analytics beacon.
No bundler, no SPA, no Next/Nuxt/Vite.

---

## Visual Language

### Color

fffuel uses a single HSL color system, declared on `:root` and shifted for
`dark-theme`. Hue 265 (purple) is the base; accent hue is calculated as
`base-hue - 90` (175, teal). All numeric values below are the resolved
compositions of the HSL tokens at the base lightness of 50 %.

| Role | Token | Value (light) | Value (dark) | Notes |
| --- | --- | --- | --- | --- |
| Background (base) | `--bg` | `#F4F1F9` (lavender mist) | `#18150F` | declared `#f4f1f9` |
| Background (elevated) | `--clr-97` | `hsl(265, 40%, 97%)` ≈ `#F8F6FB` | `hsl(265, 40%, 11%)` ≈ `#18152A` | section/card surface |
| Background (subtle) | `--clr-90` | `hsl(265, 40%, 90%)` ≈ `#E5DEEF` | `hsl(265, 40%, 11%)` ≈ `#18152A` | nested panels |
| Text (primary) | `--clr-33` | `hsl(265, 40%, 33%)` ≈ `#5F3D8F` | `hsl(265, 40%, 80%)` ≈ `#C2B3D8` | body text default |
| Text (secondary) | `--clr-50` | `hsl(265, 40%, 50%)` ≈ `#7646B9` | `hsl(265, 40%, 50%)` ≈ `#7646B9` | titles on cards |
| Text (muted) | `--clr-70` | `hsl(265, 40%, 70%)` ≈ `#A88FC9` | `hsl(265, 40%, 20%)` ≈ `#2A2240` | helper, footer |
| Accent (default) | `--accent` | `hsl(175, 40%, 50%)` ≈ `#46B9AF` | `hsl(175, 40%, 65%)` ≈ `#5DCAC0` | teal |
| Accent (bright) | `--accent-bright` | `hsl(175, 65%, 45%)` | `hsl(175, 65%, 45%)` | gradient endpoint |
| Accent (extra-bright) | `--accent-bright2` | `hsl(175, 85%, 50%)` | — | hover state |
| Primary | `--primary` | `hsl(265, 40%, 50%)` ≈ `#7646B9` | same | used for `:before` halo |
| Primary @10 % | `--primary-10` | `hsla(265, 40%, 50%, 10%)` | same | gradient endpoint |
| Top-bar background | `--clr-10` (light) / `--clr-40` (dark) | `hsl(265, 40%, 10%)` ≈ `#180F36` | `hsl(265, 40%, 40%)` ≈ `#5F3D8F` | dark band at the top |
| Top-bar text | `--clr-95` | `hsl(265, 40%, 95%)` | `hsl(265, 40%, 80%)` | link text |
| Border (none observed) | — | — | — | site is borderless |
| Success | — | `#2EDA84` (mint) | — | observed on `rrready?` tile |
| Warning | — | `#FEBE58` (amber) | — | observed on `oooscillate` tile |
| Error / Destructive | — | Not observed | — | — |

Other concrete hex values that appear in tool tile backgrounds (chosen
case-by-case by the page author, not from the token system):

| Hex | Used for |
| --- | --- |
| `#06083D` | deep navy — dominant dark-tile background |
| `#002148` | navy — used on `ssshape`, `llline`, `mmmotif` |
| `#111A4C` | midnight blue — `bbburst` tile |
| `#15063D` | violet-black — `sssquiggly` tile |
| `#53558A` | muted indigo — `pppixelate` tile |
| `#610070` | dark magenta — `ssspill` tile |
| `#CCF8CD` | mint cream — `dddivided` tile |
| `#D579BE` | bubblegum — `nnnoise` tile |
| `#E5FFC9` | pale lime — `iiisometric` tile |
| `#ECF6FF` | ice blue — `sssurf` tile |
| `#F4F6F9` | warm grey — `cccloud` tile |
| `#F6F4EC` | parchment — `bbblurry` tile |
| `#F8DDCC` | peach — `dddynamite` tile |
| `#FFF0B7` | butter — `ccclaymoji` tile |
| `#FFE7E6` | blush — `sssurface` tile |
| `#FFE9F0` | rose — `lllove` tile |
| `#FFF3D3` | cream — `ssstar` tile |
| `#EEC96B` / `#DBA519` | gold pair — top-left decorative SVG |
| `#7DEE6B` / `#35DB19` | lime pair — bottom-right decorative SVG |

Dark mode is toggled by toggling `dark-theme` on `<body>`; the checkbox
`#themeSwitch` is in `main-header`. Theme preference is persisted via
`localStorage.getItem('theme')` / `setItem('theme', 'dark-theme')`.

### Typography

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Body default | `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, …` | 400 | `22px` (`body` font-size) | `1.5` (`33px`) | `normal` |
| Display (H1) | `"Space Grotesk", "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif` | 400 (semantic) | `clamp(1.25rem …)` — observed `text-xl sm:text-2xl` (`20px → 24px`) | `1.33` (`32px`) | `normal` |
| H2 (decorative) | Space Grotesk | 500 | `text-base xl:hidden` (`16px`) | `1.5` (`24px`) | `normal` |
| H3 (tool tile label) | Space Grotesk | 500 | `text-xl sm:text-2xl lg:text-4xl` (`20px → 24px → 36px`) | `1.33` (`40px`) | `normal` |
| Sub-line (`<span>` inside h3) | Space Grotesk | 400 | `text-sm sm:text-lg` (`14px → 18px`) | `1.5` (`28.8px`) | `normal` |
| Top-bar text | Space Grotesk (`font-sg`) | 400 | `text-lg sm:text-xl lg:text-2xl` (`18px → 20px → 24px`) | `1.33` (`32px`) | `normal` |
| Pill / button | Space Grotesk | 700 | `0.875rem` (`14px`) | `1.25rem` (`20px`) | `-0.05em` (tight) — text-transform: uppercase |
| `btn` (large) | Space Grotesk | 400 | `1.5rem` → `2rem` (responsive) | n/a | n/a |
| Footer text | system stack | 400 | inherits (`22px` then `18px` on small) | `1.5` | `normal` |

`--font-custom` token:
`"Space Grotesk","Gill Sans","Gill Sans MT",Calibri,"Trebuchet MS",sans-serif`.
The site is set up as a self-hosted variable font: `@font-face` declares
`font-family: Space Grotesk; font-display: swap; src: url(/fonts/SpaceGrotesk[wght].woff2) format("woff2-variations"), url(/fonts/SpaceGrotesk-Regular.woff2) format("woff2"); font-weight: 300 700`.
Only the variable `.woff2` was captured in the dump; the fallback static
file is referenced but not present in `tmp/fffuel/playwright/fonts/`.

### Spacing & radius

- **Base unit:** 4 px (Tailwind v2 default scale).
- **Scale observed in markup:** `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160 px`
  (e.g. `px-2`, `gap-3`, `mt-4`, `p-4`, `py-2 md:py-3`, `mb-12`, `mx-6`,
  `my-24`, `pt-36`).
- **Radii observed:**
  - `0px` — most tiles, nav bar.
  - `12px 12px 0px 0px` — header chip clip.
  - `24px` (`1.5rem`) — section / `border-radius: 1.5rem` on the H1 card.
  - `50%` — theme-switch pill (`border-radius: 50px`) and `pill.round`.
  - `50px` — `.theme-switch__label`.
  - `64px` — callout pills in footer.
  - `77px` — fixed rotated gradient behind body content (`body:before`).
  - `9999px` — `.swatch` swatch dots inside tool pages.
- **Shadows** (all rendered values come from `--shadow-*` tokens, computed
  in HSL with 20 % lightness base):
  - `--shadow-micro` → `rgba(48, 31, 71, 0.15) 0px 9.25px 20px 0px` (used on
    `.section:not(.more-tools,.the-templates)`).
  - `--shadow-small` and `--shadow-medium` are 5-stop shadows combining
    `rgba(48, 31, 71, 0.047) … 0.15` at offsets up to `37px 80px`.
  - Theme-switch inset: `rgba(0, 0, 0, 0.4) -4px 4px 15px 0px inset`.

### Iconography

- **Style:** mixed — inline hand-drawn 199×199 SVG paths (two rotating
  decorations on the `sssvg` tile), inline 24×24 social SVGs in the footer,
  and the inline 800×800 grid pattern from `/images/sssvg/grid.svg` used as
  a background tile.
- **Library (if observable):** none — every glyph is hand-authored SVG inline
  or fetched from `/images/…` paths. No Lucide, Phosphor, Heroicons, or
  Feather.
- **Default size:** 24×24 (footer social pills), 128×128 (decorative
  blobbies), 16×16 – 32×32 (tool thumbnails inside cards via
  `background-image`).
- The `pill.round.btn` Instagram and Twitter SVGs use `fill: #fff` /
  `fill: white`, no stroke; they sit inside 50 × 50 px circular buttons
  with the accent gradient.

---

## Layout & Grid

- **Max content width:** `.content` is `max-width: 72rem` (`1152px`) and
  `.more-tools` is `max-w-none xl:max-w-2xl 2xl:max-w-5xl` (so it stretches
  on mobile, caps at `42rem` on `xl`, expands to `64rem` on `2xl`).
- **Page gutter:** `padding-left: 1.5rem; padding-right: 1.5rem` (i.e.
  `px-6`, 24 px) on `.content`; `0` inside `.content` at small breakpoints.
- **Grid:** the tool index uses a `display: grid` with auto-fit columns
  driven by `.square` cards. Each card is `aspect-ratio: 1/1` and centers
  its `h3` with `display: grid; place-items: center`. Backgrounds are
  applied per-tile via inline `style="background: …"`.
- **Breakpoints:** (Tailwind v2 default — observed in CSS `@media` blocks):
  - `sm` `640px`
  - `md` `768px`
  - `lg` `1024px`
  - `xl` `1280px`
  - `2xl` `1536px`
  - Additional custom: `600px`, `700px`, `900px`, `125px`, `1300px`,
    `1600px`.
- **Vertical rhythm:** baseline grid of `4px`; major section gaps of `6rem`
  (`96px`) for `.section:not(.more-tools,.the-templates)` plus
  `margin-top: 6rem`. The columns block uses `my-24` (`96px`).

The homepage lays out top-to-bottom as: thin top promo bar → right-aligned
header with a single theme switch → centered title card (with a rotating
conic-gradient corner badge and a 3-D-rotate entrance animation) → a 2-row
wave SVG separator → a 2-column prose intro with emoji bullets → the 6 × 11
tile grid of generator tools → a bottom footer with copyright, social pills,
and privacy/terms/license links.

On mobile (`<sm`) the tile grid collapses to roughly two columns and the
prose columns collapse to one. The H1 tile reflows into a single column
stacked above the title card; on `xl` it moves into a side-by-side flex row.

---

## Components

### Top bar

- **Anatomy:** single line, centered text, padding `py-2 md:py-3 px-6`.
- **Background:** `--clr-10` in light mode (`#180F36`, near-black purple);
  `--clr-40` in dark mode (`#5F3D8F`, mid purple).
- **Text:** Space Grotesk (`font-sg`) `text-lg sm:text-xl lg:text-2xl`,
  color `--clr-95` (light) / `--clr-80` (dark). Underline on the link with
  `text-decoration-color: hsla(0,0%,100%,0.25)` lightening to `0.75` on
  hover.
- **Visible content:** a fire emoji (hidden `<sm`) followed by
  `Syntax - Web Development Podcast` linking to `https://syntax.fm/`.

### Header

- **Position:** fixed at the top right of the viewport (`justify-end`),
  padding `px-2`, hidden content except the theme toggle.
- **Anatomy:** `<header class="main-header flex justify-end items-center px-2">`
  contains a `<div class="flex items-center gap-3 mt-2">` wrapping a
  `<div class="scale-75">` (75 % transform on the theme switch).
- **Theme switch:** `<input type="checkbox" id="themeSwitch" class="theme-switch__input" checked>`
  + `<label for="themeSwitch" class="theme-switch__label !top-10">` with
  `aria-label="Color theme switcher"`. When checked, light mode is active;
  when unchecked, `dark-theme` is added to `<body>`.
- **Toggle visual:** pill-shaped label (`border-radius: 50px`) with inset
  shadow and a sun/moon glyph (`☼`/`☾`) rendered via `content` and
  absolute-positioned with `transform: translate3d(0,-50%,0)`.

### Tool tile (the dominant component)

- **Anatomy:** an `<a>` element with `class="!no-underline square grid place-items-center …"`.
  Inside: a centered `<h3>` containing the two-letter tool name on one line
  and a `<span>` with a sub-description (e.g. "SVG blobs", "color picker").
- **Aspect:** `aspect-ratio: 1/1` — every card is a square.
- **Background:** set inline via `style="background: …"` per tile. Patterns
  observed: `conic-gradient(aqua, fuchsia, yellow, aqua)`, `linear-gradient(45deg, #7d59b8 20%, …)`,
  `radial-gradient(hsl(270, 45%, 10%) 50%, …)`, image backgrounds via
  `background-image: url(/images/…)` or `background: #06083d url(…)`.
- **States:**
  - Default — colored background.
  - Hover (some tiles) — `bg-white/25 hover:bg-white transition-colors duration-300`
    on the more subdued tiles, producing a quick fade to white over 300 ms.
- **Type sizes:** `text-xl sm:text-2xl lg:text-4xl` for the tile label
  (20 → 24 → 36 px); sub-line `text-sm sm:text-lg` (14 → 18 px). Tiles on
  the right column use the larger `text-2xl sm:text-3xl lg:text-5xl` (24 →
  30 → 48 px) — `cccloud`, `ssstar`, `lllove`.
- **Blend modes:** many tiles apply `mix-blend-mode` to the H3 to push
  text contrast against busy backgrounds: `mix-blend-color-dodge`,
  `mix-blend-screen`, `mix-blend-overlay`, `mix-blend-difference`,
  `mix-blend-exclusion`, `mix-blend-color-burn`, `mix-blend-hard-light`,
  `mix-blend-color-lighten`, `mix-blend-lighten`.
- **Number of tiles:** 64 generator tiles plus 1 SVG-reference tile and 1
  CSS-Selectors resource tile — total 66 in `.more-tools` plus 2 outside
  (`/css-selectors/`, `/svg-spinner/`) and 3 utility endpoints
  (`/rrrasterize/`, `/eeencode/`, `/rrready/`).
- **Routing convention:** every tile href matches its label slug,
  e.g. `pppalette` → `/pppalette/`. All paths are lower-case, two-letter
  prefix + noun, with optional numeric suffix (`cccoil-3`).

### Section card (title block)

- **Anatomy:** `<section class="title mx-6">` wrapping the H1.
- **Surface:** `border-radius: 1.5rem` (`24px`), `padding: 2rem 1.5rem`,
  `max-width: 36rem`, `background: var(--clr-97)`, `color: var(--clr-50)`,
  `box-shadow: var(--shadow-micro)` (`9.25px 20px rgba(48,31,71,.15)`).
- **Decoration:** `section.title:after` renders a 7 rem × 7 rem
  `conic-gradient(from 45deg, var(--accent), transparent)` circle in the
  top-right corner, blended via `mix-blend-mode: color`, rotated
  `infinite` over 24 s linear (`@keyframes turn`).
- **Enter animation:** `animation: section-rotate .75s 1` with
  `cubic-bezier(.34,1.56,.64,1.35)` and `animation-delay: 1s` (a
  bouncy spring overshoot). `@keyframes section-rotate { 0% { transform: rotate(0) } }`
  is defined but the rule animates the section's transform with the spring
  curve on top of the initial `rotate(0)`.

### Wave separator

- **Anatomy:** `<svg class="separator m-auto my-10" width="300" viewBox="0 0 687 155">`
  inline at the page center between the title block and the prose columns.
- **Drawing:** four cubic Bézier paths sharing the same `d` shape but at
  `y = 58, 78, 98, 118`, with `stroke="currentColor"`, `stroke-width="7"`,
  `stroke-linecap="round"`, and `opacity` of `.1 / .2 / .6 / 1` to create
  the layered "wavy lines fading to foreground" effect.

### Two-column prose block (`.columns`)

- **Anatomy:** `<div class="columns max-w-6xl mx-auto px-6 md:text-2xl my-24">`
  containing six paragraphs (each starting with an emoji: 🚀, 🤹‍♂️, ✨, 🔧, 🖼️, 🎨).
- **Layout:** `column-count: 2` above `900px`, single column below.
- **Inline links:** in-paragraph anchor tags with `text-decoration: underline`
  (default) and the accent color.
- **Computed:** font-size `md:text-2xl` → `24px`, line-height
  `~33px` (default `1.5`), max-width `72rem`.

### Pill button (`.pill`)

- **Anatomy:** inline-flex, `border-radius: .5rem`, padding `.25rem .75rem`,
  font-size `0.875rem`, line-height `1.25rem`, weight `700`,
  `text-transform: uppercase`, `letter-spacing: -.05em`, color
  `rgba(255,255,255, var(--tw-text-opacity))`.
- **Background:** `linear-gradient(to top, var(--accent), var(--accent-bright))`
  — i.e. teal → brighter teal — with `box-shadow: var(--shadow-medium)`.
- **Transform:** `--tw-rotate: 1deg; transform: var(--tw-transform)`
  (deliberate 1° tilt for a hand-set feel).
- **Variant:** `.pill.round` overrides to `aspect-ratio: 1/1;
  border-radius: 50%; vertical-align: middle; display: inline-flex;
  justify-content: center; align-items: center;
  font-family: Space Grotesk, …` — used for the round Instagram / Twitter
  glyphs in the footer.

### Theme switch (`.theme-switch__input` / `.theme-switch__label`)

- **Anatomy:** checkbox + label pair (no JS swap of glyphs — the position
  is animated by CSS).
- **Visual:** `border-radius: 50%` track, sun `☼` glyph in `:after` (left,
  visible when checked = light mode) and `before` (right, visible when
  unchecked). Sun color: `var(--accent)`.
- **Computed shadow:** `rgba(0, 0, 0, 0.4) -4px 4px 15px 0px inset` gives
  a pressed-in pill look.

### Footer

- **Anatomy:** `<footer>` containing
  1. `<div class="font-bold font-sg mb-3">©2024 Sentry.io / Syntax.fm</div>`,
  2. social pills (`<a class="pill round btn">` × Instagram, × Twitter),
  3. utility links row: `privacy ⟡ terms ⟡ license`.
- **Container:** `.footer-wrapper { padding-top: 3rem }` on mobile,
  `10rem` at `sm` breakpoint, `display: flex; justify-content: center`.

### Inline SVG decorations (the `sssvg` tool card)

- Two 128 × 128 inline starburst SVGs (`viewBox="0 0 199 199"`) placed at
  the top-left and bottom-right corners of the `sssvg` tile, both with
  `class="spin"`. The class definition was **not** observed in the
  captured CSS — the animation is likely defined in a stylesheet that
  wasn't dumped. We list this as `Not observed (see Animations → Catalog)`.

---

## JavaScript & Libraries

fffuel is a server-rendered HTML page with a small amount of progressive
enhancement. Three JS resources load on the page:

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| Alpine.js | `3.13.10` | `version:"3.13.10"` literal in `scripts.c0b29bd8055899a__a3d6b866.js` (file size 47,433 bytes) | Self-hosted at `/js/scripts.c0b29bd8055899a.js`. The bundle includes Alpine's reactive engine (Vue-style Proxy-based reactivity). |
| Alpine plugin: `intersect` | bundled | `oe.plugin(Vn)` in the same script; directive `x-intersect` | Provides IntersectionObserver-based reveal — no visible `x-intersect` usage on the homepage itself, but the plugin is registered. |
| Alpine plugin: `collapse` | bundled | `oe.plugin(Yn)` in the same script; directive `x-collapse` | Provides height-collapse transitions for tool-page UIs. |
| Plausible Analytics | `v34` (script tag `https://plausible.io/js/script.js`, `data-domain="fffuel.co"`) | `2,855`-byte `script__b916539e.js` (a minified `plausible.init` helper) + the official Plausible stub on the page. Source: <https://plausible.io/js/script.js>. | Pageview + scroll-depth + engagement-time tracking only. |
| Cloudflare Web Analytics beacon | `2024.11.0` (token `237308a3eca542beaf1f3a98f8256f49`) | Inline `<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447">` (cached copy 33,228 bytes in dump). Source: <https://static.cloudflareinsights.com/beacon.min.js>. | Sends `r=1` pageview with `cfCacheStatus`, `cfEdge`, `cfExtPri`, `cfL4`, `cfOrigin`, `cfSpeedBrain`. |

The third-party inline scripts (Plausible + CF beacon) are listed in
`tools/tmp/fffuel/manifest.json` lines 88–108.

The only non-Alpine JavaScript in the Alpine bundle is the theme-switch
handler at the bottom of `scripts.c0b29bd8055899a.js`:

```js
var ht = document.getElementById("themeSwitch"),
    ho = localStorage.getItem("theme");
ht && (ho && (document.body.classList.add("dark-theme"),
              ht.checked = !1),
       ht.addEventListener("change", function(e){
         document.body.classList.toggle("dark-theme"),
         e.target.checked
           ? localStorage.removeItem("theme","light-theme")
           : localStorage.setItem("theme","dark-theme");
       }));
```

No other libraries are detected: `gsap`, `three`, `lottie`, `framer-motion`,
`tweenmax`, `barba.js`, `swup`, `aos`, `chroma-js`, `colorjs.io` are all
absent from the JS bundle. `tools/scrape.py` confirmed no
`@import`/`require`/`from "…"` style imports in the served JS — it is a
single self-contained IIFE.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `turn` | `playwright/css/home__399e4410.css:2` | `24s` | `linear` | `infinite` — applied to `section.title:after` (the conic-gradient badge in the corner of the H1 card) |
| `section-rotate` | `playwright/css/home__399e4410.css:7` | `.75s` | `cubic-bezier(.34,1.56,.64,1.35)` (spring overshoot) | Once, `animation-delay: 1s` — applied to `.section.subscribe, .section.subtitle, .section.title` |
| `wiggle` | `playwright/css/home__399e4410.css:12` | `1s` | `linear` | Once at `2s` delay — applied to `input[type=submit]` (tool-page submit buttons, not homepage) |
| `bounce` | `playwright/css/styles.cac97b355f98ff6__6022e618.css` | not observed in dump | not observed | defined as `0%→scale(1) 40%→scale(1.1) 60%→scale(.9)` |
| `bounce2` | same file | not observed | not observed | `0%→scale(1) 40%→scale(1.1)+opacity .5 60%→scale(.9)` |
| `bounce3` | same file | not observed | not observed | `20%→opacity .25 40%→opacity .5` |
| `alien-nod` | same file | `1s` (observed via `animation:alien-nod 1s cubic-bezier(.34,1.56,.64,1) 1`) | spring | 0 % `translate: 0 1rem` |
| `alien-rotate` | same file | not observed | not observed | `25%→rotate(-60deg) 75%→rotate(54deg)` |
| `alien-rotate-hue` | same file | not observed | not observed | `to→filter: hue-rotate(1turn)` |
| `spin` (class) | **Not observed in dump** | — | — | The class is referenced on two 128×128 inline SVGs on the `sssvg` tile (`tools/tmp/fffuel/playwright/homepage.html:15`) but no `.spin` rule appears in either captured CSS file. The animation rule likely lives in another cached stylesheet or in a non-captured inline `<style>`. We record this as `Not observed — class referenced but no matching CSS rule captured`. |

Full keyframes dumps:

```
/* home__399e4410.css */
@keyframes turn{to{transform:rotate(1turn)}}
@keyframes section-rotate{0%{transform:rotate(0)}}
@keyframes wiggle{25%{transform:translateY(-2px)}33%{transform:translateY(1px)}50%{transform:translateY(-2px)}75%{transform:translateY(1px)}}

/* styles.cac97b355f98ff6__6022e618.css */
@keyframes bounce{0%{transform:scale(1)}40%{transform:scale(1.1)}60%{transform:scale(.9)}}
@keyframes bounce2{0%{transform:scale(1)}40%{transform:scale(1.1);opacity:.5}60%{transform:scale(.9)}}
@keyframes bounce3{20%{opacity:.25}40%{opacity:.5}}
@keyframes alien-nod{0%{translate:0 1rem}}
@keyframes alien-rotate-hue{to{filter:hue-rotate(1turn)}}
@keyframes alien-rotate{25%{transform:rotate(-60deg)}75%{transform:rotate(54deg)}}
```

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| Alpine.js | `<div class="scale-75">` initial transform on `#themeSwitch` wrapper | on page load (CSS-only) | static `transform: scale(.75)` |
| Alpine.js | `dark-theme` class toggle on `<body>` | `change` event on `#themeSwitch` | no transition — instant switch |
| Plausible | `pageview` event | on `DOMContentLoaded` (Plausible internal) + on `popstate` | scroll-depth via `ResizeObserver` |
| CF beacon | `r=1` pageview | on script `load` | reports `cfCacheStatus`, `cfEdge`, `cfExtPri`, `cfL4`, `cfOrigin`, `cfSpeedBrain` |

### Page transitions

- **None observed.** The site is multi-page (each tool has its own URL) but
  uses standard browser navigation. No `template.tsx`, no `barba.js`, no
  `swup`, no SPA-style fade. The CF beacon reports `cfCacheStatus=true`,
  suggesting each route is served from Cloudflare's edge cache.

---

## Assets

### 3D models

N/A — no `.glb`, `.gltf`, `.obj`, `.fbx`, or `.usdz` assets observed in the
dump (`tools/tmp/fffuel/models/` is empty).

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Space Grotesk | variable 300–700 | `woff2-variations` | `tools/tmp/fffuel/playwright/fonts/SpaceGrotesk[wght]__257f8051.woff2` (49,256 bytes) — original URL `https://fffuel.co/fonts/SpaceGrotesk[wght].woff2` | yes |

The `@font-face` rule also references
`url(/fonts/SpaceGrotesk-Regular.woff2) format("woff2")` as a fallback,
but that file is **not** captured in the dump.

### Images

All in `tools/tmp/fffuel/playwright/images/`, served from `fffuel.co/images/…`.
Raster images are `.webp` or `.jpg`.

| Local path | Type | Dimensions (approx from aspect ratio) | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `images/hhhue-3__60b81577.webp` | WebP | 1:1 (used at `background-size: cover` on `hhhue` tile) | 14,232 B | `https://fffuel.co/images/hhhue/hhhue-3.webp` | tile thumb |
| `images/hhholographic__d24c057e.webp` | WebP | tile aspect | 20,270 B | `https://fffuel.co/images/hhholographic/hhholographic.webp` | tile thumb |
| `images/pppsychedelic5__fb913d6f.webp` | WebP | tile aspect | 14,430 B | `https://fffuel.co/images/pppsychedelic/pppsychedelic5.webp` | tile thumb |
| `images/dddoodle-3__9d515faa.webp` | WebP | tile aspect | 33,296 B | `https://fffuel.co/images/dddoodle-3.webp` | tile thumb |
| `images/aaabstract-2__4a97505d.webp` | WebP | tile aspect | 16,254 B | `https://fffuel.co/images/aaabstract/aaabstract-2.webp` | tile thumb |
| `images/wwwatercolor__6f3a2111.webp` | WebP | tile aspect | 19,840 B | `https://fffuel.co/images/wwwatercolor/wwwatercolor.webp` | tile thumb |
| `images/dddepth-315__ee9db33c.jpg` | JPEG | tile aspect | 13,415 B | `https://fffuel.co/images/dddepth-preview/dddepth-315.jpg` | tile thumb |
| `images/thumb-083__9e46cb4d.jpg` | JPEG | tile aspect | 65,918 B | `https://fffuel.co/images/tttexture/thumb-083.jpg` | tile thumb |

Other raster images referenced via `background-image` in the HTML (likely
served by the same origin but not all captured by the dump):
`/images/sssvg/grid.svg` (the only `grid` SVG in the dump), the
`/images/sssvg/spinner2.svg` (referenced as a background), the
`/images/lllove/lllove.svg`, `/images/lllove/nnnoise.svg`, and many tool
tile backgrounds (e.g. `ssshape-2.svg`, `llline-2.svg`,
`dddepth-preview/dddepth-315.jpg`, etc.).

### SVGs & icons

- **Inline SVGs observed in HTML:** 2 decorative starburst SVGs on the
  `sssvg` tile (`<svg class="spin" …viewBox="0 0 199 199">`), 1 inline
  wave-separator SVG (687 × 155, four Bézier paths), 2 footer social SVGs
  (Instagram + Twitter, 24 × 24, monochrome white).
- **Standalone SVG files in dump** (`tools/tmp/fffuel/playwright/svgs/`,
  57 files — each is a tool-tile background or icon):
  - `bbblurry`, `bbburst`, `ccchaos`, `cccircular`, `ccclaymoji`,
    `cccloud`, `cccoil`, `dddivided`, `dddivided-7`, `dddraw-6`,
    `dddynamite-1`, `dddynamite-4`, `ffflurry`, `ffflux`, `ggglitch-2`,
    `gggrain-11`, `gggyrate-3`, `grid`, `hhhorizon`, `iiisometric-5`,
    `llleaves`, `llline-2`, `lllook`, `lllove`, `mmmotif`, `nnneon`,
    `nnnoise-2`, `nnnoise-bg`, `nnnoise`, `ooorganize`,
    `oooscillate-3`, `ppperspective`, `pppixelate-3`, `pppointed-5`,
    `qqquad-cover2`, `rrrainbow-3`, `rrreflection`, `rrrepeat-1`,
    `rrreplicate-4`, `spinner2`, `ssscales`, `ssscribble`, `ssshape-2`,
    `ssspill`, `ssspiral`, `sssplatter-2`, `ssspot`, `sssquiggly-3`,
    `ssstar-3`, `sssurf3`, `sssurface`, `ttten`, `tttwinkle`,
    `uuundulate`, `uuunion`, `vvvortex`, `wwwhirl`.
  - Each is named `{prefix}{tool-slug}[-{n}].svg`, where the 2-letter
    prefix doubles as the route's first path segment
    (`ssshape-2.svg` → `/ssshape/`).
- **Icon system:** none — icons are tool-specific SVG art, not a unified
  set. The only true UI icons (Instagram, Twitter) are inline in the
  footer.
- **Sizes range:** 226 B (`spinner2`) → 45,393 B (`bbburst`).
- **Stroke / fill patterns:** `nnnoise-bg` uses an SVG `<filter>` for
  procedural noise; `bbburst`, `bbblurry` are complex; `spinner2` is a
  minimal `<circle>` with `stroke-dasharray` for the spinner effect.

### Audio & video

N/A — no `.mp4`, `.webm`, `.mp3`, `.wav`, `.ogg` observed in the dump
(`tools/tmp/fffuel/media/` is empty).

### Other

- `tools/tmp/fffuel/playwright/homepage.png` (645 KB, 1280-wide screenshot)
- `tools/tmp/fffuel/playwright/homepage-fullpage.png` (3.08 MB, full
  scroll)
- `tools/tmp/fffuel/playwright/computed-styles.json` (48,920 B) — 92
  observed DOM elements with computed `font-family`, `font-size`,
  `font-weight`, `line-height`, `letter-spacing`, `color`,
  `background-color`, `border-radius`, `box-shadow`, `padding`, `margin`,
  `display`. Source: playwright snapshot script.

---

## Motion & Interaction

### Principles

- Almost every motion is decorative and quiet: a corner conic-gradient
  badge rotates for 24 s on the H1 card; the H1 card itself springs in
  with a `cubic-bezier(.34,1.56,.64,1.35)` overshoot after a 1 s delay;
  tile backgrounds either respond with a 300 ms color crossfade on hover
  (`transition-colors duration-300`) or do nothing at all.
- **Default duration:** `300ms` for the only Tailwind `transition-colors`
  utility used; `.75s` for the section-rotate spring; `1s` for the submit
  `wiggle`; `24s` for the conic badge rotation.
- **Default easing:** spring `cubic-bezier(.34,1.56,.64,1.35)` for the
  spring; `linear` for the badge; default `ease` for the crossfade.

### Specific behaviors

- **Tile hover (subset):** the lighter-background tiles
  (`bg-white/25 hover:bg-white transition-colors duration-300`) crossfade
  from `rgba(255,255,255,0.25)` to `#FFFFFF` over `300ms`. Used on
  `cccolor`, `hhhue`, `ffflux`, `tttexture`, `gggrain`, `nnneon`,
  `uuundulate`, `ccchaos`, `ssspot`.
- **Theme toggle:** instant — no fade or transition; `dark-theme` class
  is added/removed on `<body>` synchronously.
- **Section entrance:** the title section rotates in (spring) at `1s`
  after page load (`animation-fill-mode: backwards`).
- **Section background motion:** `section.subtitle` and `section.subscribe`
  carry a moving background — `background-size: 200% / 300%` with
  `background-position: 80% 70% / 100% 0` (used on tool-page headers,
  not the homepage itself).
- **Conic-gradient badge:** rotates `1turn` in `24s linear infinite`.
- **Submit-button wiggle** (tool pages, not homepage): `input[type=submit]`
  gets `animation: wiggle 1s linear 2s 1; animation-fill-mode: backwards`,
  a quick 4-keyframe Y-axis wobble (–2 px → +1 px → –2 px → +1 px) at
  the 2-second mark.

### Reduced motion

`prefers-reduced-motion` was searched for in both CSS files and was **not
observed**. The site does not currently gate motion behind a reduced-motion
media query; the rotating badge and spring entrance will play for all
users.

---

## Content & Voice

- **Tone:** direct, designer-to-designer, slightly geeky. Emoji-led
  bullets. Casual contractions ("you'll find", "they can often be more
  lightweight"). No marketing-voice superlatives.
- **Sentence length:** short to medium (1–2 sentences per bullet).
- **Capitalization:** Sentence case in body copy; **Title Case** for tile
  names (`SVG blobs`, `color picker`, `freehand SVG drawing tool`).
- **Punctuation:** em-dash and em-spaces used lightly; Oxford comma not
  really applicable; sentence-ending punctuation consistent.
- **CTA vocabulary:** effectively zero. There are no CTAs on the homepage —
  the "call to action" is implicit (click a tile). The footer uses
  `privacy ⟡ terms ⟡ license`.
- **Voice cues from copy:**
  - "A fun collection of free SVG generators…" (title metadata).
  - "🚀 On fffuel you'll find a collection of free SVG makers to create
    cool backgrounds…" (intro).
  - "🤹‍♂️ The SVG and graphic creation tools on fffuel allow you to easily
    customize the final result so that the generated graphics are unique…"
  - "✨ SVG stands for Scalable Vector Graphics…"
  - "🔧 If you need to convert the generated SVGs over to PNG…"
  - "🖼️ If you want to use the SVGs as background patterns…"
  - "🎨 Plus, I've also created some tools to help with converting color
    codes…"
- **Tagline / hero:** the H1 reads "fffuel is a collection of color tools
  and free SVG generators for gradients, patterns, textures, shapes &
  backgrounds." (paraphrased).
- **Copyright footer:** "©2024 Sentry.io / Syntax.fm" — the site is built
  by the maintainers of the Syntax.fm podcast.

---

## Information Architecture

The site is essentially a one-page directory plus a flat list of dedicated
tool pages. Observed routes (from `href` attributes and `<link rel="canonical">`):

- `/` — homepage / tool index (canonical: `https://fffuel.co/`)
- 64 tool routes under `/[a-z][a-z][a-z]+/` (the two-letter prefix groups
  them by family: `cc…` = color, `ss…` = shape, `bb…` = blur/burst,
  `dd…` = draw/doodle/dynamite, `ff…` = flux/flurry, `gg…` = glitch/grain,
  `hh…` = hue/holographic/horizon, `ii…` = isometric, `ll…` = line/leaves/
  look/love, `mm…` = motif, `nn…` = neon/noise, `oo…` = organize/oscillate,
  `pp…` = palette/perspective/pixelate/pointed/psychedelic,
  `qq…` = quad, `rr…` = rainbow/rasterize/ready/reflection/repeat/
  replicate, `ss…` = scales/scribble/shape/spill/spiral/splatter/spot/
  squiggly/star/surf/surface/svg, `tt…` = ten/texture/twinkle,
  `uu…` = undulate/union, `vv…` = vortex, `ww…` = watercolor/whirl).
- `/css-selectors/` — bonus visual CSS-Selectors reference.
- `/svg-spinner/` — bonus "how to make SVG spinners" tutorial.
- `/rrrasterize/` — utility: SVG → PNG conversion.
- `/eeencode/` — utility: SVG → Base64 encoder.
- `/rrready/` — utility: support chart for web platform features.
- `/license/` — terms of use.
- `/images/favicon/favicon.ico` — favicon (32 × 32 multi-resolution).
- `/images/favicon/favicon.svg` — favicon (vector).
- `https://syntax.fm/` — external podcast link.
- `https://www.instagram.com/syntax_fm/` — external Instagram.
- `https://twitter.com/syntaxfm` — external Twitter.
- `https://syntax.fm/pages/privacy` — privacy policy.
- `https://syntax.fm/pages/terms-of-service` — terms.

Each tool route is a self-contained generator page built on the same
Alpine.js + Tailwind + Space Grotesk stack as the homepage.

---

## Accessibility

- **Color contrast:** the base palette sits on a lavender
  (`#F4F1F9` / `#F8F6FB`) with body text at
  `#5F3D8F` / `#7646B9` — a purple-on-lavender combination that
  comfortably clears WCAG AA at body sizes (computed text-on-bg from
  the dump: e.g. `rgb(79,50,118)` on `rgb(24,15,36)` in dark mode,
  `rgb(119,77,179)` on `rgb(244,241,249)` in light mode). Tile labels
  intentionally sit on busy SVG/image backgrounds and rely on `text-shadow`
  (e.g. the `hhhue` tile's
  `text-shadow: 0 0 1.5rem white, 0 0 1.5rem white, 0 0 1.5rem white`) or
  `mix-blend-mode` for legibility — these are decorative tiles, not
  primary text, so the contrast concession is acceptable.
- **Focus indicators:** not explicitly captured. Tailwind's default
  `focus:ring` is not enabled on the tool tiles, which are styled
  `!no-underline` and have no visible focus ring in the captured CSS.
  This is an **accessibility gap** to call out.
- **Keyboard:** native browser tab order; all tiles are `<a>` elements and
  reachable. The theme switch is a real `<input type="checkbox" id="themeSwitch">`
  with `<label for="themeSwitch">` and `aria-label="Color theme switcher"`.
- **Screen reader landmarks:** `<header class="main-header">`, `<footer>`,
  `<section class="title">`, `<section class="more-tools">` are all
  present and labeled.
- **Motion:** `prefers-reduced-motion` was **not** observed in any
  captured CSS (see Motion → Reduced motion). The 24 s rotation and the
  spring entrance will play for all users, including those who have
  requested reduced motion in their OS.
- **Alt text:** tool tiles use `title="…"` (e.g.
  `title="blob shape generator"`) on the anchor but no
  `<img alt>` (the SVGs are CSS backgrounds, not `<img>`s). The top bar
  fire emoji is wrapped in `<span class="hidden sm:inline">🔥</span>` —
  decorative, hidden from screen readers via `aria-hidden`-style omission
  (no `aria-hidden` attr, but the emoji is purely decorative).
- **Language:** `<html lang="en">`.

---

## Sources

Every URL actually opened while writing this.

- Homepage (rendered DOM) — `tools/tmp/fffuel/playwright/homepage.html`
  (originally `https://www.fffuel.co/` — captured via Playwright
  dynamic pass).
- Static HTML, raw — `tools/tmp/fffuel/html/asset_76__f076b9a4`
  (38,501 B, fetched but contains only the Cloudflare-edge shell —
  rendered DOM was used in its place per the AGENTS.md edge-case rule).
- CSS bundle — `tools/tmp/fffuel/playwright/css/styles.cac97b355f98ff6__6022e618.css`
  (53,776 B) — Tailwind 2.2.19 + site styles.
- CSS bundle — `tools/tmp/fffuel/playwright/css/home__399e4410.css`
  (3,100 B) — homepage-specific (keyframes, theme-switch bit).
- JS bundle — `tools/tmp/fffuel/playwright/js/scripts.c0b29bd8055899a__a3d6b866.js`
  (47,433 B) — Alpine.js v3.13.10 + intersect + collapse + theme switch.
- JS bundle — `tools/tmp/fffuel/playwright/js/script__b916539e.js`
  (2,855 B) — Plausible analytics shim.
- JS bundle — `tools/tmp/fffuel/playwright/js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447__4d30e30a`
  (33,228 B) — Cloudflare Web Analytics beacon.
- Font — `tools/tmp/fffuel/playwright/fonts/SpaceGrotesk[wght]__257f8051.woff2`
  (49,256 B) — variable Space Grotesk 300–700.
- Manifest — `tools/tmp/fffuel/manifest.json` (77 files, 4.4 MB).
- Computed styles — `tools/tmp/fffuel/playwright/computed-styles.json`
  (48,920 B, 92 elements).
- Homepage screenshot — `tools/tmp/fffuel/playwright/homepage.png`
  (645 KB) and `homepage-fullpage.png` (3.08 MB).
- 57 SVG assets — `tools/tmp/fffuel/playwright/svgs/`.
- 8 image assets — `tools/tmp/fffuel/playwright/images/`.
- Reference template — `template/design.md`.
- Authoring rules — `AGENTS.md` §6.

External references observed in the markup:

- `https://developer.mozilla.org/en-US/docs/Web/SVG` — inline MDN link in
  the prose section ("SVG stands for Scalable Vector Graphics").
- `https://syntax.fm/` — podcast link in the top bar.
- `https://syntax.fm/pages/privacy` — footer privacy link.
- `https://syntax.fm/pages/terms-of-service` — footer terms link.
- `https://www.instagram.com/syntax_fm/` — footer Instagram pill.
- `https://twitter.com/syntaxfm` — footer Twitter pill.
- `https://plausible.io/js/script.js` — analytics endpoint.
- `https://static.cloudflareinsights.com/beacon.min.js/…` — analytics
  beacon.

---

## Changelog

- 2026-06-20 — Initial draft by opencode (per the `tools/tmp/fffuel/`
  dump scraped 2026-06-19T20:02:28Z).
