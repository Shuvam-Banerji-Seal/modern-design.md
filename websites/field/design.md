# field.io — design.md

> A structured design specification of **https://field.io**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** field-batch sub-agent
> **Source dump:** `tools/tmp/field/` (gitignored)

---

## Overview

field.io is the marketing portfolio of FIELD.IO, a London / Berlin creative
studio that describes itself as a "Global Creative, Design + Innovation
Studio." The site is a single-page application of long, scroll-driven
storytelling built around a full-bleed hero carousel of project films and
stills, followed by text modules, project modules, and a footer with two
office addresses. The design is editorial, almost press-kit style: white
negative space, sans-serif body, a single electric-blue accent, and small
DM Mono labels. The framework is **Next.js (App Router) compiled with
Turbopack**, with content sourced from **Sanity** and media delivered from
**Cloudinary**. No 3D / WebGL libraries were observed on the homepage —
the work is presented as video stills and large photographs rather than
live in-browser scenes.

**Category:** Marketing / Studio portfolio
**Primary surface observed:** Homepage (`/`) + linked routes for `/work`,
`/work/[slug]`, `/profile`, `/impact`, `/practice`, `/contact`
**Tone:** Confident, editorial, restrained, large quiet typography
**Framework detected (if any):** Next.js 14+ (Turbopack chunks, `_next/static/`)

---

## Visual Language

### Color

The site uses a small token system defined in `:root` of
`tools/tmp/field/css/db1fba58d4d4ce67__f2a8c7a8.css`. Two theme variants
(`.theme-systems` for the studio's dark-mode pages and `.theme-blue` for
the brand-blue variant) override the same tokens.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--color-background` / `--color-white-background` | `#FFFFFF` | white in light theme |
| Background (elevated) | `--color-overlay` | `#F2F2F2` | light grey panels |
| Background (subtle) | `--color-tag-background` | `#F2F2F2` | tag chips |
| Background (dark) | `--color-gray-background` | `#202020` | dark surfaces, tag pill |
| Text (primary) | `--text-color` / `--color-primary` | `#000000` (`#202020` in dark) | default body |
| Text (secondary) | `--color-secondary` | `#8C8C8C` | mid grey |
| Text (muted) | `--color-text-muted` | `#8F8F8F` | captions, dot separators |
| Text (tertiary) | `--color-tertiary` | `#E5E5E5` | hairlines, light borders |
| Accent | `--color-active` / `--accent-color` | `#0000FF` | electric "field blue" |
| Accent (hover) | `--color-tag-active` | `#0000FF` | active tag background |
| Border (default) | `--color-tertiary` | `#E5E7EB` | `border-color` in Tailwind reset |
| Footer background | n/a (inline utility) | `#F7F7F7` | `bg-[#F7F7F7]` on `<footer>` |
| Cookie backdrop | n/a (klaro override) | `rgba(255, 255, 255, 0.85)` | `backdrop-blur(10px)` |
| Card / pill (dark) | n/a (inline utility) | `#202020` | hover `#303030` |

Theme variants in the same file:

- `.theme-systems` — inverts: `--color-background: #141414`, primary `#FFFFFF`,
  secondary `#737373`, tertiary `#262626`, overlay `#1A1A1A`, tag-active `#FFFFFF`.
- `.theme-blue` — full-bleed brand blue: `--color-background: #0000FF`,
  primary `#FFFFFF`, secondary `#FFFFFF`, tertiary `#4B4CFF`.

### Typography

Three families are loaded. Two (`DM Sans`, `DM Mono`) come from Google
Fonts with a single `<link>` to `fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap`.
The third (`Signifier`, light weight only) is self-hosted:
`tools/tmp/field/fonts/signifier-light__77dd17ff.woff2` (52 KB), referenced
in CSS as `src: url(/signifier-light.woff2) format("woff2")`.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Hero H1 | DM Sans | 400 | `72px` (3rem) on `md`+ | `0.95` (`68.4px` observed) | `0.72px` (`0.01em`) |
| Section / textModule body | DM Sans | 300 / 400 | `1.125rem` (text-lg, 18px computed body) | `1.2` | `0` |
| H2 / lede (`text-lg`) | DM Sans | 400 | `1.5rem` | `1.2` | `0` |
| H3 (`text-xl`) | DM Sans | 400 | `2rem` | `1.2` | `0.01em` |
| Body L (`text-md`) | DM Sans | 400 | `1rem` | `1.2` | `-0.01em` |
| Body | DM Sans | 400 | `1rem` (text-base) | `1.2` | `-0.01em` |
| Body S / caption (`text-sm`) | DM Sans | 400 | `0.7rem` (~11.2px observed) | `1.2` | `-0.02em` |
| Tag / label (`text-xs`) | DM Sans | 400 | `0.6rem` (~10px observed) | `1.2` | `-0.02em` |
| Mono label / button | DM Mono | 400 | `0.75rem` (12px computed) | `1.2` | `-0.288px` (`-0.02em`) |
| Serif accent (`.font-serif`) | Signifier | 300 | inherited | inherited | inherited |
| Logo wordmark | DM Sans | 500 | `1rem` | `1.2` | `0.45em` (huge, makes it read as spaced caps) |

Type sizes scale with viewport. The root `font-size` is `16px` on
mobile, bumped to `20px` at `min-width: 768px` and `24px` at
`min-width: 1200px`, so the `text-xl` (2rem) step moves from
`32px → 40px → 48px` across the breakpoints.

### Spacing & radius

- **Base unit:** 4px (Tailwind `gap-2 = 0.5rem` is the default column gap).
- **Scale (Tailwind utilities observed):** 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5,
  2, 2.5, 3, 4, 5, 6, 8, 9, 10, 12 rem, plus custom `mb-[120px]`,
  `mb-[140px]`, `mb-[150px]`, `mt-[-380px]` for tall hero overlaps.
- **Site-specific tokens:** `--site-header-height: 50px` (drives
  `h-[calc(100svh-var(--site-header-height))]` on the hero and
  `min-h-[calc(100vh-var(--site-header-height))]` on full-viewport
  sections). `--grid-max-width: 1800px` is the max page width.
- **Radii:** `rounded-sm 2px`, `rounded 4px`, `rounded-md 6px`,
  `rounded-lg 8px`, `rounded-3xl 24px` (klaro cookie notice on ≥480px
  is `border-radius: 32px` = `rounded-2xl`), `rounded-full 9999px`
  (pill buttons, tag chips, dividers, hamburger spans). No CSS `box-shadow`
  is used anywhere except klaro overrides that set `box-shadow: none !important`.

### Iconography

- **Style:** monoline / inline; field.io does not ship a visible icon set
  — most affordances are typographic (a small `·` middot separates
  client and project inside pill tags, and a single 2px black `<div>`
  with `w-4 h-[2px] rounded-lg` acts as a hamburger bar).
- **Library (if observable):** Not observed. No Lucide / Phosphor /
  Heroicons sprite or `<svg>` icon set was found in the dump.
- **Default size:** 16px (`w-4`) for the hamburger span; tag pill text is
  `10px` (`text-[10px]`).

---

## Layout & Grid

- **Max content width:** `1800px` (driven by `--grid-max-width` and the
  `.max-w-[var(--grid-max-width)]` utility). A second utility
  `max-w-[1920px]` exists for the hero media strip.
- **Page gutter:** `px-4` (16px) at the base, scaling with the root
  `font-size` so it reads as ~24px on a 1440px viewport.
- **Grid:** 12 columns (`grid-cols-12`) with `gap-2` (8px) on every
  layout container — the project carousels, footer blocks, and
  project-detail lockups all use the same 12-col system.
- **Breakpoints:** sm `576`, md `768`, lg `992`, xl `1200`, 2xl `1440` (px).
  These are the Tailwind v3.4 defaults and are also reflected in the
  SCSS-like utility class output.
- **Vertical rhythm:** no strict baseline; modules use large negative
  margins (e.g. `lg:-mt-80` = `-20rem` = `-320px`) to overlap the hero,
  and `+&+&:mt-9rem` etc. to stack siblings.

The homepage layout, top to bottom, is: fixed 50px transparent header →
a `100svh - header` hero that is a stack of full-bleed slides
(opacity-faded video and image cards with a pill tag in the bottom-left
of each) → an intro text block (`text-lg` paragraph inside a 12-col grid)
→ a project / work card section → a practice / impact block → a long
contact / footer block with a 12-col layout (London address, Berlin
address, social links row, copyright row). Section dividers are
invisible — the spacing carries the rhythm.

---

## Components

### Header (top bar)

- **Height:** 50px (`--site-header-height: 50px`).
- **Position:** `fixed top-0 left-0 z-[1000]`, full width.
- **Anatomy:** logo on the left (`FIELD.IO` in DM Sans 500, `1rem`,
  letter-spacing `0.45em` to read as a wordmark), then a flex row of
  five nav links (`Work`, `Profile`, `Impact`, `Practice`, `Contact`)
  on a wider viewport, each `h-10 flex items-center cursor-pointer
  transition duration-200 ease-in-out font-normal border-black`,
  default `opacity-50`, hover `opacity-100`. The mobile variant
  collapses the links behind a small hamburger icon
  (`w-4 h-[2px] rounded-lg bg-black`).
- **Behavior:** transparent over the hero, the logo's `z-index: 9999`
  keeps it clickable above the carousel.

### Hero carousel

- **Container:** `relative w-screen h-[calc(100svh-var(--site-header-height))]`,
  with a `relative z-[1] w-full h-full` overlay.
- **Slides:** multiple absolute-positioned full-bleed `<a>` blocks
  (`absolute w-full h-full pointer-events-none`, with inline
  `style="opacity: 0"` to stack them before the JS cross-fades).
  Each slide is either a Cloudinary `<video autoplay loop muted
  playsinline>` (Kia 15s) or a Cloudinary `<img>` with `object-cover
  object-center`.
- **Tag pill** in the bottom-left of each slide:
  `absolute bottom-4 right-4 bg-backgroundGray text-white px-2 py-0.5
  text-[10px] rounded-full transition-all duration-200 group-hover:
  opacity-100 hover:bg-[#303030]`; on mobile the pill is repositioned
  with `left-4 right-auto md:left-auto md:right-4`. Inside, an
  uppercase client name (`Kia Global`, `IBM x GRAMMY Museum®`,
  `Applied Intuition`, `Meta`, `Google`, `Nike`, `On`, `IMI`, `Chopard`,
  `113 Spring`, `Circle`, `IBM Ferrari`, `IBM`, `Circle` …) is followed
  by a mid-grey middot and a project title in `--color-text-muted`.
- **Enter animation:** each link has an inline style
  `transform: translateY(3rem); transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);`
  and a per-item `transition: transform 0.5s/1s/1.5s, opacity 1s` to
  stagger the reveal across the carousel.

### Pill button / tag (mono)

- **Class signature:** `font-mono uppercase text-xs rounded-full px-3
  py-0 h-6 cursor-pointer transition …`.
- **Anatomy:** label only (no icon). `text-[14.4px]` (computed), white
  text on black `bg-black` background, `9999px` radius.
- **States:** default, hover (no documented colour change in computed
  styles — likely uses `hover:bg-overlay` or `hover:bg-black`).
- **Used for:** project tags and the CTA-style controls below the
  carousel (the `flex flex-row flex-wrap gap-3 items-end mb-2` row of
  filter chips).

### Card (project)

- **Padding:** none on the card itself — the parent grid provides
  spacing.
- **Background:** image / video fills the card; no border.
- **Hover:** the underlying `<a>` link animates from
  `opacity-0; transform: translateY(3rem)` to `opacity-1; translateY(0)`
  via the staggered 0.5s / 1s / 1.5s `cubic-bezier(0.25, 1, 0.5, 1)`
  transition described above. A `group-hover:opacity-100` reveals the
  corner pill.

### Footer

- **Background:** `bg-[#F7F7F7]` on `<footer class="… siteFooter">`,
  with `pt-4 pb-4 mt-8`.
- **Anatomy:** 12-col grid. Left columns: "London — Hackney Depot 5
  Sheep Lane, London E8 4QS, United Kingdom" and "Berlin — FIELD.IO
  Berlin GmbH & Co KG, Niemetzstraße 47–49, 12055 Berlin, Germany",
  set as `<address class="not-italic whitespace-pre-line">`. The two
  addresses sit on different rows below `md`. Below that, a copyright
  row (`© FIELD.IO 2026` in `text-base md:text-sm font-light
  text-secondary`) and a right-aligned social row (Instagram, LinkedIn,
  X, Privacy) using `text-base md:text-sm font-light text-secondary`.
- **Email contacts:** `mailto:hello@field.io`, `mailto:enquiries@field.io`,
  `mailto:press@field.io`.

### Cookie notice (klaro)

- **Position:** `position: fixed; bottom: 12px; left: 50%` with
  `transform: translate(-50%)`.
- **Surface:** `background-color: rgba(255, 255, 255, 0.85)` plus
  `backdrop-filter: blur(10px) !important; box-shadow: none !important;`.
- **Radius:** `0.375rem` on mobile, `32px` from `min-width: 480px` and
  `25rem` max-width from `min-width: 768px`.
- **Buttons:** `color: #fff; background-color: #000; border-radius: 1.5rem;
  padding: 0.25rem 0.75rem;` — same dark-pill treatment as the rest of
  the site.

---

## JavaScript & Libraries

Every JS chunk in the dump lives under `/_next/static/chunks/` and is
served by Next.js / Turbopack. None of the chunks pull in GSAP, Three.js,
Lottie, Framer Motion, R3F, or anime.js — the page relies entirely on
CSS transitions and opacity toggles for motion. Detection source: file
names in the manifest and `script.src` attributes in the rendered HTML.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Next.js (App Router) | not in dump | `_next/static/TmV2Va_RWfoEFkInSqLQu/_buildManifest.js`, `_ssgManifest.js` | SSG-manifest size 464 B; client middleware manifest `{}` (empty) |
| Turbopack runtime | not in dump | `js/turbopack-768860441dc77502.js`, `turbopack-e8674b75a1ba737b.js`, `turbopack-1cab34a5887f513b.js`, etc. (10 chunks, each ~10 KB) | `next/dist/build/swc` runtime |
| React | bundled in Next.js | not directly visible in dump | inferred from `_next/static/chunks/*.js` |
| Tailwind CSS | v3.4 (utility-class shape, ring system, container breakpoints) | `tools/tmp/field/css/db1fba58d4d4ce67__f2a8c7a8.css` | one minified 60 KB file |
| Klaro (cookie consent) | v0.7 (CSS shape) | `.klaro .cookie-notice .cn-body .cm-btn …` rules in CSS | banner styled to match the design system |
| Vercel Speed Insights | present | `js/script__e940e467.js` (12 KB) loaded from `/_vercel/speed-insights/script.js` | |
| Vercel Web Analytics | present | `js/script__63d0b617.js` (2.5 KB) loaded from `/_vercel/insights/script.js` | |
| Sanity (CMS) | inferred | `__NEXT_DATA__` `homeData._type`, `_id`, `_rev`, `_createdAt`, `_updatedAt`; `_next/data/.../work.json` route is the data feed | content is server-rendered from Sanity; the client receives `__NEXT_DATA__` JSON |
| Cloudinary | media CDN | every `<img>` and `<source>` URL begins `https://res.cloudinary.com/field-systems/…` | URL transforms `c_limit,w_2560,f_auto,q_90` are baked in |
| GSAP / Lottie / R3F / Three.js | — | not present | No 3D or timeline library in `js/` |

The carousel cross-fade is implemented as plain inline JS toggling
`opacity` on stacked `<a>` children of the hero; each card's stagger
duration (0.5s / 1s / 1.5s) is hard-coded in the inline
`style="transition: transform 0.5s, opacity 1s"` attribute.

---

## Animations (Catalog)

### CSS @keyframes

No `@keyframes` rules were found in the only CSS file in the dump
(`db1fba58d4d4ce67__f2a8c7a8.css`). All motion is driven by inline
`style="transition: …"` on individual elements plus Tailwind utility
classes (`transition`, `transition-all`, `transition-opacity`,
`duration-200`, `duration-300`, `ease-in-out`, `ease-out`).

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| Inline CSS (no lib) | Hero carousel cross-fade | `DOMContentLoaded` / first paint | Stacks 14 absolute `<a>` slides inside the hero; per-card `style="opacity:0; transform: translateY(3rem); transition: transform 0.5s/1s/1.5s, opacity 1s; transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1)"` cycles them in with three staggered durations (0.5s, 1s, 1.5s alternating) |
| Inline CSS | Nav link hover | `:hover` | `opacity-50 → opacity-100` over `duration-200 ease-in-out` |
| Inline CSS | Carousel tag pill hover | `:hover` | `bg-backgroundGray` `#202020` → `bg-[#303030]` over `transition-all duration-200` |
| Klaro | Cookie notice dismiss | `click` on `.cm-btn-success` | Fades via klaro's own logic; not observed in detail |

### Page transitions

- No client-side router transition was observed — Next.js default
  immediate navigation. The full page payload is ~326 KB HTML
  (`html/asset_114__d62c1399`), and `__NEXT_DATA__` carries the
  homepage content inline.
- A small `<div class="klaro">` cookie notice is hydrated as a
  client component.

### Reduced motion

- No `@media (prefers-reduced-motion: reduce)` rules were observed in
  the dumped CSS. Not observed in the dump.

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump. The `models/` folder is empty,
and no `.glb`, `.gltf`, `.usdz`, or `.fbx` references appear in the
manifest. Project hero media on this homepage is video / still imagery
served from Cloudinary.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| DM Sans | 100–1000, italic (variable axis `opsz 9..40`, `wght 100..1000`) | woff2 | Google Fonts (`fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000`) | no (Google) |
| DM Mono | 300, 400, 500, italic | woff2 | Google Fonts (`fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500`) | no (Google) |
| Signifier | 300 (light) | woff2 | `tools/tmp/field/fonts/signifier-light__77dd17ff.woff2` (52 KB) | yes (`@font-face { font-family: Signifier; src: url(/signifier-light.woff2) format("woff2"); font-weight: 300; font-style: normal; }`) |

The HTML also preloads two woff2 files from
`tools/tmp/field/playwright/fonts/` (`aFTU7PB1QTsUX8KYthqQBA__9ad76cd0.woff2`,
14.8 KB and `rP2Hp2ywxg089UriCZOIHQ__1c49a6eb.woff2`, 62.7 KB) — these
are the Google-hosted DM Sans / DM Mono subsets surfaced via the headless
browser, not additional self-hosted families.

### Images

All Cloudinary-hosted originals are accessed at
`https://res.cloudinary.com/field-systems/image/upload/c_limit,w_2560/f_auto/q_90/v1/...`.
Local copies live in `tools/tmp/field/playwright/images/`. Field ships
two sizes per asset (a small thumb and a larger preview).

| Local path | Type | Source URL | Notes |
| --- | --- | --- | --- |
| `tools/tmp/field/playwright/images/260430_hero-image__c6ac385c` (3.2 KB) | image (Cloudinary f_auto) | `…/IO/Work/IBM/GRAMMY%20Museum/260430_hero-image` | IBM x GRAMMY Museum® hero, preview |
| `tools/tmp/field/playwright/images/260430_hero-image__ddbad786` (98.6 KB) | image (Cloudinary f_auto) | same | full-size variant |
| `tools/tmp/field/playwright/images/FIELD_IBMFerrari_cover__eb57227e` (2.4 KB) | image | `…/IO/Work/IBM%20x%20Ferrari/cover` | small preview |
| `tools/tmp/field/playwright/images/FIELD_IBMFerrari_cover__e2392116` (47.6 KB) | image | same | full-size |
| `tools/tmp/field/playwright/images/field_IBM_sports_club_image_01__d200d426` (460 KB) | image | `…/IO/Work/IBM%20Sports%20Club/Summary/images/field_IBM_sports_club_image_01` | IBM AI Sports Club hero |
| `tools/tmp/field/playwright/images/google-muuto-a-space-for-being-design_dezeen_2364_col_16-1704x1138__791d1dab` (3.2 KB) | image | `…/IO/Work/Google/A%20Space%20for%20Being%20(Sensing%20Places)/google-muuto-a-space-for-being-design_dezeen_2364_col_16-1704x1138` | Google "A Space for Being" / Sensing Spaces |
| `tools/tmp/field/playwright/images/google-muuto-a-space-for-being-design_dezeen_2364_col_16-1704x1138__b29552a0` (54.8 KB) | image | same | full-size |
| `tools/tmp/field/playwright/images/hero_applied__00cf0630` (4.0 KB) | image | `…/IO/Work/Applied%20Intuition/Seeing%20in%20Gamma/hero_applied` | Applied Intuition "Seeing in Gamma" |
| `tools/tmp/field/playwright/images/hero_applied__cf268ebb` (480 KB) | image | same | full-size |

The `tools/tmp/field/images/` subfolder is empty in this dump (the
static pass did not capture raster images; the dynamic pass did).

### SVGs & icons

- **Inline SVGs observed in HTML:** none found in `playwright/homepage.html`
  or in the dumped `html/asset_114__d62c1399`. The header hamburger is
  a 2px-tall `<div>`, not an SVG. (Not observed)
- **Standalone SVG files in dump:** none. `tools/tmp/field/svgs/` is
  empty.
- **Icon system:** no third-party icon font / sprite is referenced.
  (Not observed)

### Audio & video

| Local path | Type | Source URL | Notes |
| --- | --- | --- | --- |
| `tools/tmp/field/playwright/media/Field_Kia_OppositesUnited_15sec_V10__1c8aa700` (2.4 MB) | MP4 (H.264) | `https://res.cloudinary.com/field-systems/video/upload/c_limit,w_1920,q_90,f_auto:video/v1/IO/Work/Kia%20MDW/Field_Kia_OppositesUnited_15sec_V10` | 15.04s, 3840×2160, no audio; primary hero slide |
| `tools/tmp/field/playwright/media/heroMain_v01-5__41ad84b7` (2.3 MB) | video | Cloudinary `heroMain_v01-5` | secondary hero clip |
| `tools/tmp/field/playwright/media/ibm-quantum-cropped__e2bfbfa2` (605 KB) | video | Cloudinary `ibm-quantum-cropped` | IBM Quantum hero |
| `tools/tmp/field/playwright/media/new_260504_animation_night_day_detail1__a24a3742` (2.6 MB) | video | Cloudinary `new_260504_animation_night_day_detail1` | 113 Spring "Living Destination" |
| `tools/tmp/field/playwright/media/On_Store_NYC_Long__39af7e2f` (14.2 MB) | video | Cloudinary `On_Store_NYC_Long` | On NYC store video (largest asset) |
| `html/asset_114__d62c1399` (323 KB) | HTML document | `https://field.io/` | homepage |
| `playwright/other/work__55a8207c.json` (134 KB) | JSON | `https://field.io/_next/data/TmV2Va_RWfoEFkInSqLQu/work.json` | work index feed |
| `playwright/other/practice__ac7641a9.json` (203 KB) | JSON | `https://field.io/_next/data/TmV2Va_RWfoEFkInSqLQu/practice.json` | practice page feed |
| `playwright/other/profile__8baadeef.json` (55 KB) | JSON | `https://field.io/_next/data/TmV2Va_RWfoEFkInSqLQu/profile.json` | profile page feed |
| `playwright/other/impact__b09bd49d.json` (100 KB) | JSON | `https://field.io/_next/data/TmV2Va_RWfoEFkInSqLQu/impact.json` | impact page feed |
| `playwright/other/contact__ce650f34.json` (6 KB) | JSON | `https://field.io/_next/data/TmV2Va_RWfoEFkInSqLQu/contact.json` | contact page feed |
| `playwright/other/index__0917c888.json` (284 KB) | JSON | `https://field.io/_next/data/TmV2Va_RWfoEFkInSqLQu/index.json` | homepage data feed |
| `playwright/other/ibm-quantum__ad535ad9.json` (249 KB) | JSON | `_next/data/.../work/ibm-quantum.json` | project detail feed |

---

## Motion & Interaction

### Principles

- Motion is **sparse and choreographed**: nothing bounces, nothing spins,
  nothing animates per-frame. Each transition is a single property change
  (opacity, transform, background-color) over 150–500 ms.
- Default easing is the Tailwind / standard `cubic-bezier(0.4, 0, 0.2, 1)`
  (Tailwind `ease-in-out` and `ease-out` utilities). The hero carousel
  uses a custom `cubic-bezier(0.25, 1, 0.5, 1)` (a slow-out curve) for
  both transform and opacity.
- Default duration: 150 ms (`transition` utility) for utility toggles,
  200 ms (`duration-200`) for nav and pill hover, 300 ms (`duration-300`)
  and 500 ms (`duration-500`) reserved for hero/header elements.
  Per-card stagger inside the hero escalates to 1s and 1.5s.

### Specific behaviors

- **Nav link hover:** `opacity: 0.5 → 1`, `duration: 200ms`, `ease-in-out`.
- **Carousel tag pill hover:** background `#202020 → #303030`,
  `transition-all duration-200`. A `group-hover:opacity-100` reveals
  the pill itself when the parent slide is hovered.
- **Hero slide enter:** every slide starts at `opacity: 0; transform:
  translateY(3rem)` and animates to `opacity: 1; transform: 0`. The
  `transition` declaration alternates between `0.5s, 1s, 1.5s` so the
  carousel reveals in a three-step wave; `transition-timing-function`
  is hard-coded to `cubic-bezier(0.25, 1, 0.5, 1)`.
- **Card lift on hover (project list):** observed utility
  `[@media(hover:hover)]:hover:-translate-y-2` (`-0.5rem` Y shift)
  — applied to specific impact / project cards.
- **Section scroll reveal:** the homepage relies on the hero's stagger
  rather than IntersectionObserver. Not observed below the fold.
- **Page transition:** none. Next.js default.

### Reduced motion

- No `prefers-reduced-motion` rules were observed in the dumped CSS.
  (Not observed)

---

## Content & Voice

- **Tone:** Confident and editorial. The hero line is
  "Creative Intelligence for a Living World" (set in DM Sans 400
  white, two lines, 72px on desktop). The intro paragraph reads
  "We design for the next era of spaces + creative systems —
  environments built to anticipate, inspire, and evolve with our
  shifting world." Tags use the all-caps mono treatment to name
  the work and the client.
- **Sentence length:** Medium. The hero is a single noun phrase, the
  intro is one long but legible sentence with em-dashes.
- **Capitalization:** Sentence case in body copy. ALL CAPS inside
  pill tags (`Kia Global`, `IBM x GRAMMY Museum®`, `Applied Intuition`,
  `Meta`, `Google`, `Nike`, `On`, `IMI`, `Chopard`, `113 Spring`,
  `Circle`, `IBM Ferrari`). The logo wordmark is set with
  `letter-spacing: 0.45em` so the bare string "FIELD.IO" reads as
  evenly spaced.
- **Punctuation:** em-dashes (—) used inline in body copy; middle-dot
  (·) used as a tag separator inside pill chips.
- **CTA vocabulary:** the site doesn't ship a single primary CTA on
  the homepage — projects are linked directly from the hero card
  carousel and from the Work / Practice / Impact / Profile / Contact
  nav. Verb usage is limited to `mailto:hello@field.io`,
  `mailto:enquiries@field.io`, `mailto:press@field.io`.

---

## Information Architecture

Routes observed in the dump (each is a `__NEXT_DATA__` JSON feed plus a
page render):

- `/` — marketing homepage with hero carousel, intro text, project
  section, practice / impact lockup, contact footer.
- `/work` — case-study index. `_next/data/.../work.json` lists 14+
  project slugs including `kia-global-journey-of-projection`,
  `ibm-x-grammy-museum-music-discovery-interface`,
  `circle-networks-in-focus`, `113-spring-living-destination`,
  `chopard-the-sound-of-eternity-experience`,
  `nike-a-global-retail-language`, `IMI`,
  `nike-rise-intelligent-retail-system`, `google-sensing-spaces`,
  `applied-intuition-seeing-in-gamma`, `ibm-ferrari`,
  `meta-brand-system`, `chopard-the-sound-of-eternity-experience`,
  `circle-networks-in-focus`, plus more. Each card is a project record
  with `client.title`, `accentColor` (per-project hex), `heroMedia`
  (Cloudinary), `modules` (cover, mediaModule, textModule, bigText,
  iframe, credits, subprojects, executiveSummary, etc.).
- `/profile` — studio profile / about page (`profile.json`).
- `/impact` — impact / studio philosophy page (`impact.json`).
- `/practice` — practice areas (editorial blocks: `editorialSeries`,
  `editorialBlockContent`, `editorialFullWidthBlock`, `mediaModule`).
- `/contact` — single page with three mailto links and the two
  office addresses.
- `/privacy-policy` — linked from the footer social row.
- `/work/[slug]` — per-project case study (sample observed:
  `/work/ibm-quantum`, `/work/kia-global-journey-of-projection`).

---

## Accessibility

- **Color contrast:** body text `--text-color: #000` on
  `--color-background: #fff` is 21:1; mid-grey `--color-secondary:
  #8C8C8C` on white is ~3.6:1 (passes for large text only); muted
  `--color-text-muted: #8F8F8F` is ~3.4:1 (used for the secondary
  half of the pill tag, set at 10px — borderline, would fail WCAG AA
  for body text).
- **Focus indicators:** no explicit `:focus-visible` rules were
  observed in the dumped CSS; the only focus rule is
  `.focus\:outline-0:focus { outline-width: 0 }`. Not observed for
  default ring.
- **Keyboard:** standard `<a>` and `<button>` elements; nav links are
  reachable in DOM order. A skip-link was not observed.
- **Screen reader landmarks:** `<header>`, `<footer>`, `<address>`,
  `<nav>`, and `<h1>` (the hero) are all present in the rendered DOM.
  Each nav `<a>` carries its visible label text. The project cards
  inside the hero do **not** carry a per-card accessible name beyond
  the visible uppercase client + project label, so the hero carousel
  has limited SR semantics — flagged as a gap.
- **Motion:** the only animation is opacity / transform; no large
  parallax, no auto-playing audio, and videos are muted (`muted`
  attribute is set). The Kia hero video plays with `autoplay` but no
  audio. (Reduced-motion handling: Not observed.)
- **Alt text:** observed `<img alt="Field" width="2256" height="1269"
  …>` is a generic, non-descriptive alt — a gap to flag.

---

## Sources

- Homepage — https://field.io/
- Homepage HTML dump — `tools/tmp/field/html/asset_114__d62c1399`
- Homepage rendered DOM — `tools/tmp/field/playwright/homepage.html`
- Computed styles snapshot — `tools/tmp/field/playwright/computed-styles.json`
- Stylesheet — `tools/tmp/field/css/db1fba58d4d4ce67__f2a8c7a8.css`
- Project data feed — `tools/tmp/field/other/work__55a8207c.json`
- Practice page feed — `tools/tmp/field/other/practice__ac7641a9.json`
- Profile page feed — `tools/tmp/field/other/profile__8baadeef.json`
- Impact page feed — `tools/tmp/field/other/impact__b09bd49d.json`
- Contact page feed — `tools/tmp/field/other/contact__ce650f34.json`
- Project detail feed (sample) — `tools/tmp/field/other/ibm-quantum__ad535ad9.json`
- Project detail feed (sample) — `tools/tmp/field/other/kia-global-journey-of-projection__a0e1c82c.json`
- Cloudinary hero video — https://res.cloudinary.com/field-systems/video/upload/c_limit,w_1920,q_90,f_auto:video/v1/IO/Work/Kia%20MDW/Field_Kia_OppositesUnited_15sec_V10
- OG image — https://res.cloudinary.com/field-systems/video/upload/w_1920/v1777031307/IO/Work/Kia%20MDW/Field_Kia_OppositesUnited_15sec_V10.jpg
- Careers (external) — https://field-io.notion.site/Careers-at-FIELD-IO-affb12ae22e144a881e221dddb71241c
- Social — https://www.instagram.com/field_io/, https://www.linkedin.com/company/field/, https://x.com/field_io

---

## Changelog

- 2026-06-19 — Initial draft by field-batch sub-agent.
