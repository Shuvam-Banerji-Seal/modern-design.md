# Awwwards (Web & Interactive category index) — design.md

> A structured design specification of **https://www.awwwards.com/websites/web-interactive/**,
> written so a human or agent can reconstruct the look-and-feel of the
> **gallery / index** itself — header, marquee, breadcrumb, filter bar,
> responsive card grid, vote overlay, and footer — without ever opening
> the original site. Each featured submission is *not* described here;
> this document is about the gallery chrome around them.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tmp/awwwards/` (gitignored; manifest at `tmp/awwwards/manifest.json`,
> rendered DOM at `tmp/awwwards/playwright/homepage.html`,
> computed styles at `tmp/awwwards/playwright/computed-styles.json`)

---

## Overview

Awwwards is a curated index of the web's best-designed sites, organized
into vertical taxonomies (categories × tags × countries × awards). The
observed page is the **Web & Interactive** category index — a long,
infinitely-scrolling mosaic of ~10 000 thumbnails. The chrome around the
grid is the focus: a sticky two-tier top bar with a marquee promo strip
above it, a breadcrumb / page-title strip, a horizontal filter bar with
dropdown facets, a responsive CSS-Grid of square preview cards, a
back-to-top control, and a four-column link footer.

The design language is editorial-grid in spirit — heavy white space, a
single dark neutral (`#222`) for type, a single warm accent (`#FA5D29`)
for state and affordance, and a small rainbow of semantic tag colors
(purple "Awards", green "Inspire", orange "Connect", yellow "Learn",
blue "Jobs", mustard "Read") used only on small ribbon and dot badges.
Typography is set entirely in **Inter Tight** (variable font, self-hosted
as a single TTF), three weights (300 / 500 / 600) doing all the work;
no display face, no serif, no monospace.

**Category:** Gallery / curated index / design directory
**Primary surface observed:** Category index
(`/websites/web-interactive/`) — 1 page observed in the dump.
**Tone:** Confident, opinionated, lightly editorial. Page title is plain
prose ("Web & Interactive"); section labels are sentence-case; CTAs are
uppercase-tracked ("VOTE NOW", "FILTERS").
**Framework detected:** Custom static page + Webpack chunked JavaScript
runtime (`webpackChunkawwwards_new`) and **Stimulus.js** controllers
bound via `data-controller` / `data-action`. No React, Vue, Svelte, or
framework SSR markup is shipped.

---

## Visual Language

### Color

Awwwards uses a flat dark-on-light palette by default and flips to a
near-mirror dark scheme on the marquee and a few dark cards. All values
below are observed in the inline stylesheet inside
`tmp/awwwards/playwright/homepage.html` (the `<style>` block ~159 KB
in size that ships with the document) and corroborated against the
Playwright-captured `computed-styles.json`.

#### Surfaces

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Page background | `--bg-primary` | `#F8F8F8` | Body and grid background |
| Card background | `--nf-bg-3` / `#fff` | `#FFFFFF` (white) | Thumbnail tile + footer |
| Elevated surface | `--bg-secondary` | `#222222` | Marquee strip, vote-button text |
| Subtle surface | `--bg-3rd` / `#ededed` | `#EDEDED` | Search input, header hairline |
| Hairline border | `--border-gray` / `#dedede` | `#EDEDED` / `#DEDEDE` | Used at 0.5px or 1px |
| Featured ribbon bg | `--color-featured` | `#F8F0EE` | Warm cream behind "SOTD" card |

#### Text

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Primary text | `--color-primary` | `#222222` | Default body, headings, nav |
| Secondary text | `--color-link` | `#222222` | Same as primary; `link` is colored only on hover via `--color-orange` |
| Inverse text | `--color-white` | `#FFFFFF` | On `#222` and on thumbnail hover overlay |
| Muted / meta | `--color-underlined` | `rgb(34,34,34)` (used with alpha) | Byline / meta lines |
| Error / destructive | `--color-errors` | `#FA5D29` | Form errors share the orange accent |

#### Accent + brand

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Accent (primary) | `--color-orange` / `--color-red` | `#FA5D29` | Hover, active state, error, "Connect" tag |
| Accent (hover) | `--color-orange` | `#FA5D29` | Same value; hover raises opacity |
| Connect orange (light) | `--color-connect-2` | `#FFAE94` | "Connect" tag light variant |
| Connect orange (tint) | `--color-connect-3` | `#FFC5B1` | "Connect" tag tint background |
| Featured / focus ring | `--color-featured` | `#F8F0EE` | Hover ring around vote button |
| Budget-tag border "dev" | — | `#CE6644` | Terracotta — `Developer` award tag |
| Budget-tag border "small" | — | `#8EABC6` | Slate blue — `Honorable Mention` |
| Budget-tag border "purple" | — | `#726996` | Dusky purple — additional badge |

#### Semantic tag palette

Six "vertical" colors are defined in CSS custom properties and applied
to small dot/badge markers throughout the page. They are
**always used as a small color block**, never as type color.

| Family | Token 1 | Token 2 (mid) | Token 3 (tint) | Used for |
| --- | --- | --- | --- | --- |
| Inspire (green) | `#AAEEC4` | `#C8E4D3` | `#E2F4E9` | "Inspire" badge dots |
| Awards (purple) | `#502BD8` | `#6749D1` | `#917EDA` | "Awards" badge / "Site of the Day" small marker |
| Read (mustard) | `#C0AB3C` | `#CDC38B` | `#DBD6C0` | "Read" badge dots |
| Learn (yellow) | `#FFF083` | `#FFF9D0` | `#FFFBE2` | "Learn" badge dots (also used as alert fill) |
| Jobs (blue) | `#74BCFF` | `#99CCFC` | `#B4D7F8` | "Jobs" badge dots |
| Connect (orange) | `#FF602C` | `#FFAE94` | `#FFC5B1` | "Connect" badge dots |

#### Alerts / status

| Role | Value | Notes |
| --- | --- | --- |
| Success / alert green | `#E0F4D9` | Toast / in-card success strip |
| Warning / alert yellow | `#FFF083` | Same as `--color-learn` |
| Info blue | `#49B3FC` | "Featured" link accent |
| Destructive red | `#FA5D29` | Identical to orange accent |

> The marquee bar and a few dark cards also render in dark mode by
> setting the same custom properties on a parent scope
> (`--color-primary: #eee; --bg-primary: #121212;`), so the palette
> is dark-mode-ready but the observed page state is light.

### Typography

Awwwards ships a single font family — **Inter Tight** — and uses three
weights to build every typographic role on the page. The TTF variable
file is self-hosted at `assets.awwwards.com/assets/fonts/inter-tight/
InterTight-VariableFont_wght.ttf` (567 KB) and preloaded.

Computed values are taken from the 113 elements captured in
`tmp/awwwards/playwright/computed-styles.json` (113/113 elements report
`font-family: "Inter Tight"`).

| Role | Family | Weight | Size | Line-height | Tracking | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Display (H1 — section title) | `"Inter Tight"` | 500 | `clamp(18px, 16.59px + 0.28vw, 22px)` | 1.3 (`--bf-line-height: 130%`) | normal | inline CSS variable `--text-size-large` |
| H2 / page title (`breadcrumb-filters__title`) | `"Inter Tight"` | 600 | `22px` (var `--text-size-large`) | 1.3 | normal | computed |
| H3 / card title | `"Inter Tight"` | 500 | `13.3px` (clamped body) | 1.2 | normal | computed (most cards) |
| Body L (intro paragraph) | `"Inter Tight"` | 300 | `15px` | 1.6 | normal | inline (`card-site { font-size:15px }`) |
| Body | `"Inter Tight"` | 300 | `14px` (var `--text-size-primary`) | 1.4–1.6 | normal | inline + computed (51/113 elements at 14px) |
| Body S / caption | `"Inter Tight"` | 400 | `11px` (var `--text-size-small`) | 1.4 | normal | inline (e.g. `WEBSITE` chip, badge meta) |
| Label / nav | `"Inter Tight"` | 500 | `13.3px` (computed) | 1 | normal | inline `--font-medium` |
| Button (CTA) | `"Inter Tight"` | 500 | `13px` (sm) / `18px` (lg) | matches button height (32 / 42 / 48 / 60 / 72 px) | normal (one rule ships `letter-spacing: -0.15em` on a counter) | inline |
| Counter ("10 336" beside H1) | `"Inter Tight"` | 700 | inherits `--text-size-large` | 1.3 | `-0.15em` | inline (`letter-spacing: -0.15em`) |
| Avatar name (hover label) | `"Inter Tight"` | 500 | `13.3px` | 1.2 | normal | inline |

**Type scale (clamped tokens):**

```
--text-size-small   : 11px
--text-size-primary : 14px
--text-size-medium  : 18px
--text-size-large   : 22px
```

Plus two responsive clamps used in the grid heading and section labels:

```
clamp(18px, 16.5915492958px + 0.2816901408vw, 22px)   /* breadcrumb H1 */
clamp(26px, 17.5492957746px + 1.6901408451vw, 50px)   /* hero-scale heading */
clamp(30px, 3.9436619718px + 5.2112676056vw, 104px)   /* display heading */
```

**Weight tokens:**

```
--font-light      : 300
--font-normal     : 400
--font-medium     : 500
--font-bold       : 600
--font-extrabold  : 700
--font-black      : 800
```

The page does **not** use a monospace stack anywhere in the visible
chrome (the reCAPTCHA iframe loads "Roboto, helvetica, arial,
sans-serif" but that is third-party and out of scope).

### Spacing & radius

- **Base unit:** 4px (gutters and radii snap to multiples of 4 or 8).
- **Scale:** 4, 8, 12, 16, 20, 24, 30, 32, 40, 48, 52, 60, 72, 96 px
  (observed in margin/padding/gap declarations).
- **Layout variables:**
  - `--innerWidth: 1816px` (max content width)
  - `--pad-inner: 52px` (left/right page inset)
  - `--gutter: 20px` (column gap in grid)
  - `--header-height: 71px` desktop / `54px` mobile
  - `--header-mt: 8px` / `0px` (transparent-bar offset)
- **Radii:**
  - `--rounded-small: 4px` (badges, chips)
  - `--rounded-normal: 8px` (44 rules — buttons, inputs, cards)
  - `--rounded-large: 1rem` (~16px, 23 rules — figure rollover container)
  - `--button-rounded: 8px`
  - `--button-rounded-full: 72px` (pill CTAs)
- **Shadows:**
  - `box-shadow: 0px 0px 6px 0px rgba(0,0,0,.2)` — single decorative shadow
  - `box-shadow: 10px 10px 20px -10px rgba(var(--color-primary-rgb), 0.4)` — drop shadow on hero CTA
  - Otherwise the design is **flat** (no Material-style elevations).

### Iconography

- **Style:** Custom flat single-color icons, stroke + filled hybrid,
  drawn at viewBox `0 0 20 20`.
- **Library:** Bespoke SVG sprite, **83 symbols**, defined inline in
  `tmp/awwwards/playwright/svgs/sprite-icons__2575b8db.svg` (48 KB),
  served at `assets.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3`.
- **Default size:** 14 px in inline usage, 20 px in feature contexts,
  30 × 16 px for the footer wordmark glyph.
- **Reference convention:** `<svg class="ico-svg"><use xlink:href="…/sprite-icons.svg?v=3#arrow-dd"></use></svg>`.
- **Symbol IDs (full inventory from the sprite):** `twitter, facebook,
  instagram, linkedin, google, tiktok, youtube, add, add-circle, close,
  stats, bookmark, link, share, lupe, copy, arrow, arrow-dd, upload,
  page, pages, check-ok, check-cancel, warning, remove, lock, unlock,
  transfer, download, clock, edit, calendar, calendar-2, home,
  nominees, winners, collections, elements, courses, teachers,
  directory, jobs, shop, articles, padlock, check, cart, play, play-2,
  play-3, user-login, user-add, user-avatar, mail, discount, eye,
  eye-2, submission, video, comment, image-add, image-remove,
  briefcase, chart, settings, billing, assets, dashboard, dashboard-3,
  alert, heart, hamburger, read, cart-2, cc, sound, reset, wheat,
  flame, geometric-1, geometric-2, geometric-3, geometric-4`.
- **Live glyphs observed in the rendered DOM:** `#arrow-dd` (filter
  chevron, header dropdown), `#lupe` (search icon), `#arrow` (vote
  CTA), `#hamburger` (mobile nav), `#close` (search overlay).

The footer wordmark is its own inline `<svg width="30" height="16"
viewBox="0 0 30 16">` glyph (the `aw` ligature) — not part of the
sprite. The header logo is similarly inlined as an SVG inside
`a.header-main__logo[aria-label="Awwwards"]`.

---

## Layout & Grid

- **Max content width:** `min(100% - 104px, 1816px)` (via
  `.inner { inline-size: min(100% - var(--pad-inner)*2, var(--innerWidth)); margin-inline: auto }`).
- **Page gutter:** `--pad-inner: 52px` left + right (104 px total
  inset at the desktop max-width).
- **Grid system:** CSS Grid only. The card grid is
  `grid-template-columns: repeat(auto-fill, minmax(var(--minthumb), 1fr))`
  with `gap: 30px var(--gutter)` and `--minthumb: 350px` — that yields
  **4 columns at ≥ 1490 px**, **3 columns at ~ 1100–1489 px**,
  **2 columns at ~ 768–1099 px**, **1 column below 768 px**. The
  `data-cols` attribute on `.grid-cards` toggles among `2 / 3 / 4` for
  user-driven override.
- **Breakpoints used in the stylesheet:**
  - `max-width: 576px` — mobile (single column grid)
  - `max-width: 768px` — tablet (header collapses, grid → 2-col)
  - `max-width: 1000px`, `1024px` — small-laptop
  - `max-width: 1100px`, `1270px` — laptop / `--header-height: 54px`
  - `min-width: 768px`, `1270px`, `1600px` — progressive enhancement
  - `max-width: 1490px`, `1578px` — switch grid to 3-col, then 2-col
- **Vertical rhythm:** Loose. Section spacing is governed by
  `margin-bottom: clamp(20px, 3vw, 40px)` on the filter bar and
  `margin-top: clamp(1em, 2vw, 2em)` / `clamp(1em, 4vw, 3em)` on the
  utility helpers. No strict baseline grid.

### Page sequence (top → bottom)

1. **EU location ribbon** — a 1-line hint "Looks like you're in …",
   visually hidden via `class="eu-location"` (present in markup but
   zero-impact on the visible grid).
2. **Promo marquee** — full-bleed `#222` strip, 50 px tall, scrolling
   right-to-left at 4 s per loop, repeating item: "The Creative Pass"
   + arrow + "Watch all courses for just $12/month".
3. **Sticky header** (height 71 px) — logo (left), nav (Explore / Awards
   / Websites / Collections / Elements / Academy / Jobs / Market /
   Directory / Conferences / Magazine / Shop — inline `<ul>` with
   dropdown panels), search field (right), user / login CTA (right).
   At scroll the header does not visibly shrink (no `is-scrolled`
   class detected) but a `--hm-color` swap is wired through CSS custom
   properties for "transparent over hero → solid on scroll" patterns.
4. **Breadcrumb / page title** — single row containing
   `<ul class="breadcrumb-filters__list">` ("Websites") and an `<h1
   class="breadcrumb-filters__title" data-count="10336">Web &
   Interactive</h1>`. The `data-count` value is rendered by the
   `aniCountPulse` keyframe (orange `#FF9667` fill, 1 s, 5 iterations)
   and is the only place the orange accent meets type at a large size.
5. **Filter bar** (`.l-filters`) — two-column grid
   (`grid-auto-columns: auto 1fr`):
   - **Left column** — lead-in copy ("Best selection of *Web &
     Interactive Website* examples for your inspiration…") plus a
     "Read more" link toggling a longer blurb (controlled by
     `data-controller="toggle" data-action="click->toggle#toggle"
     data-id="toggle-tag"`).
   - **Right column** — `<ul class="breadcrumb-filters__grid hidden-sm">`
     showing **grid-density toggles** (3-col / 4-col glyphs) plus
     the **filter dropdown strip** (`<ul class="nav-filters__list">`)
     with five facets: **Awards / Countries / Categories / Tags / Colors**.
     Each facet is a `<span class="nav-filters__item">` with a chevron
     `ico-svg#arrow-dd` that opens a `nav-filters__dropdown` panel.
   - On screens < 768 px the density toggles collapse (`hidden-sm`).
6. **Card grid** (`<ul class="grid-cards js-ajax-entries" data-cols="4"
   data-group="awards">`) — 31 thumbnail cards observed on the
   first paint (the rest load via infinite scroll).
7. **Loader / pagination sentinel** — `<div class="loader-grid">`
   with a `loader-grid__spinner` (uses `@keyframes loadingSpinner`).
   When more pages exist, the `infinite-scroll` Stimulus controller
   fetches the next page and appends to the same `<ul>`.
8. **Back-to-top button** — `.bt-nav.bt-nav--left` circle (40 × 40,
   `border: 1px solid #222`, `border-radius: 50%`), fixed bottom-left
   at `bottom: 40px; right: 40px; z-index: 9`, hidden until
   `.js-gototop` toggles `is-hidden`. Icon inside spins with
   `@keyframes btRotate .6s infinite linear` while loading.
9. **Cookie banner** — `.cookies-popup.is-show`, fixed
   `right: 30px; bottom: -50%` (slides to `0` via `all .4s`),
   `background: var(--bg-secondary); color: #fff`,
   `border-radius: 8px`, padding `clamp(20px, 5vw, 30px)`,
   `max-width: 400px`, dismiss button `.button--small--white--rounded
   .js-accept-cookies`. On `< 768 px` it becomes full-width
   `border-radius: 0`.
10. **Footer** (`.footer`) — `id="footer"`, four-column link list
    above a two-row meta strip:
    - **Top row:** small wordmark + four `<ul class="footer__menu">`
      columns (Websites/Collections/Elements · Academy/Jobs/Market ·
      Directory/Conferences · FAQs/About Us/Contact Us).
    - **Bottom row:** left = legal links (Cookies / Legal Terms /
      Privacy), right = "Connect:" followed by social links
      (Instagram, LinkedIn, Twitter, Facebook, YouTube, TikTok,
      Pinterest).

---

## Components

Components below are the recurring building blocks of the gallery
chrome. Each entry lists purpose, anatomy, computed values, and any
state behavior observed.

### Marquee promo strip

- **Purpose:** Top promotional bar, full-bleed.
- **Anatomy:** `<div class="marquee-top marquee-top--gray">` wraps
  `<div class="marquee-top__wrapper is-visible">` which contains
  repeated `<div class="marquee-top__item"><strong>The Creative
  Pass</strong><svg class="marquee-top__ico">…</svg><span>Watch all
  courses for just $12/month</span></div>` × N. An anchor
  `a.item-link` overlays the whole strip for click-tracking.
- **Visual:** `--marquee-bg: #F8F8F8` (in `--gray` variant — driven by
  `--sf-bg`); text `#222`; `display: flex; align-items: center; gap`;
  `height: 50px`; `white-space: nowrap`; `overflow: hidden`.
- **Animation:** `@keyframes marquee_text` translates the wrapper
  `0 → -50%` over **4 s linear infinite** (driven by the
  `header-marquee` Stimulus controller — the animation is added when
  the wrapper intersects the viewport and removed when it leaves).
- **Mobile:** Hidden via `.marquee-top { display: none }` at
  `max-width: 576px`.

### Top header (`<header id="header">`)

- **Purpose:** Persistent site navigation + brand + search.
- **Height:** 71 px desktop, 54 px mobile (resized via
  `--header-height` swap).
- **Anatomy:**
  - Logo `<a class="header-main__logo" aria-label="Awwwards">`
    (inline SVG, left-aligned, ~28 px tall).
  - Hamburger `<div class="header-main__hamburger">` (mobile only,
    shows `#hamburger` icon).
  - Primary nav `<nav class="nav-header-main">` containing
    `<ul class="nav-header-main__list">` of 12 items.
  - "Explore" item has `class="nav-header-main__item has-dropdown"`
    and opens `<div class="nav-header-main__dropdown">` — a
    four-tab mega menu (Awards / Websites / Inspirations / Courses)
    with badge counts (`data-count` on every link, e.g. `25K` honor
    mentions, `48K` nominees, `6377` SOTD).
  - Search `<div class="header-main__search">` with
    `.search-form` (height `--sf-height: 42px`, background
    `--sf-bg: #EDEDED`, `border-radius: 8px`, icon-left `#lupe`).
  - Right cluster `<div class="header-main__right">` — Sign in +
    Submit Website buttons (`.button--small--rounded` /
    `.button--small--outline--rounded`).
- **Behavior:** Click-to-open dropdowns (Stimulus `search` controller
  binds `data-action="click->search#toggleDropdown"`,
  `click->search#doToogleTab"`). The `data-search-criteria-value=
  '{ "category": "web-interactive" }'` attribute scopes results to
  this category.

### Page title row

- **Purpose:** H1 + category name + live count.
- **Anatomy:** `<div class="breadcrumb-filters">` → flex row
  (`gap: 12px; flex-wrap: wrap; line-height: 130%`) holding
  `<ul class="breadcrumb-filters__list">` of crumb links and
  `<h1 class="breadcrumb-filters__title" data-count="10336">`.
- **Visual:** Title weight 500, color `#222`; counter rendered
  inline in `#FF9667` with `letter-spacing: -0.15em`; size
  `clamp(18px, 16.59px + 0.28vw, 22px)`.
- **Animation:** The counter pulses via `@keyframes aniCountPulse`
  (5 iterations of `1s ease`) when the filter dropdown opens — wired
  by `redesign_grid.js` (`addEventListener('animationend', …)`).

### Lead-in copy block

- **Purpose:** Soft sell for the category.
- **Anatomy:** `<div class="l-filters__right">` contains a `<div>` with
  prose and a `<span class="link-underlined"
  data-controller="toggle" data-action="click->toggle#toggle"
  data-id="toggle-tag">Read more</span>`.
- **Visual:** Body text 14 px / 300; underline-color driven by
  `--color-underlined` (default `rgba(34,34,34,…)`; set to
  `rgba(250,93,41, …)` on hover — orange reveal).

### Filter dropdown

- **Purpose:** Faceted filter for Awards / Countries / Categories /
  Tags / Colors.
- **Anatomy:** `<span class="nav-filters__item js-nav-filters-item"
  data-action="click->grid#toggleFilter" data-grid-target="filterItem">`
  toggles `<div class="nav-filters__dropdown" data-controller=
  "searchable-filter">` which contains
  `<ul class="nav-filters__sublist js-filter-section"
  data-searchable-filter-target="filters">` of `<li class="js-filter-item">
  <a class="nav-filters__subitem" href="…"><span class="js-filter-item-name">
  …</span></a></li>`.
- **Visual:** Container `position: relative; z-index: 3`;
  `margin-top: 10px`; background `#fff`; `border-radius: 8px`;
  `box-shadow: 0 0 6px rgba(0,0,0,.2)` (single decorative shadow);
  item text `15px / 400`; hover turns text orange
  (`--color-orange: #FA5D29`) and adds a `2px` left accent bar.
- **Interaction:** Click outside → `nav-filters__overlay` click
  handler `data-action="click->grid#closeFilters"` closes any open
  dropdown. A live `<input>` inside the dropdown filters item text
  client-side (Stimulus `searchable-filter` controller — actions:
  `keyup->searchable-filter#searchEvent`, `click->searchable-filter#doSearch`).

### Filter color swatches

- **Purpose:** Color-based filtering (a signature Awwwards feature).
- **Anatomy:** Inside the "Colors" dropdown, items render as
  `<span class="nav-filters__color">` with a 16 × 16 round swatch.
- **Visual:** 27 swatch classes observed in computed styles
  (`nav-filters__color` is the most-attached class, 27 elements).
  Background swatch colors map to the tag palette plus neutrals:
  white, black, gray, cream, navy, red, orange, yellow, lime, green,
  cyan, blue, indigo, violet, magenta, pink.

### Card thumbnail (`<figure class="card-site">`)

- **Purpose:** Single entry in the grid.
- **Anatomy:** `<li class="col-3 js-collectable" data-controller="collectable"
  data-collectable-model-value='{…}'>` → `<div class="card-site
  js-container-figure">` → `<figure class="figure-rollover">` →
  `<a class="figure-rollover__link" data-controller="preview"
  data-preview-url-value="/sites/{slug}/content"
  data-action="click->preview#preview">` wrapping an `<img class="lazy
  figure-rollover__file" data-srcset="…440… 1x, …880… 2x">`.
  - `<div class="figure-rollover__hover">` — overlay layer shown on
    `:hover`, containing:
    - `.figure-rollover__left` — small "WEBSITE" eyebrow +
      bold `.figure-rollover__row` showing the entry title.
    - `.figure-rollover__center.js-container-button-vote` —
      "VOTE NOW" pill (`.button--white--rounded`, 14 px arrow icon).
    - `.figure-rollover__right` — author name + avatar
      (`avatar-name__link / __img / __name / __title`).
- **Card info row** (`.card-site__info`) sits below the thumbnail and
  shows:
  - **Awards row** (`.card-site__awards`) — `.budget-tag` chips,
    color-coded:
    - `--solid--black` — `#222` text on `#fff` (SOTD, default).
    - `--small--solid--black.anim-shiny` — adds `@keyframes
      budgetShiny` (6 s ease-in-out infinite, a subtle gradient sweep).
    - `--dev` — terracotta `#CE6644`.
  - **Byline** — author name + country flag.
- **Image aspect ratio:** `--img-resizing-site: 16/12` (4:3) for the
  default grid; `--img-resizing-paronamic: 2/1` for the hero variant;
  `--img-resizing-desktop: 19/10` for desktop-only renders.
- **Computed values (`.figure-rollover__file`):** `border-radius: 8px
  var(--rounded-normal)`; `object-fit: cover`; lazy-loaded with a
  1×1 transparent PNG placeholder (`data:image/png;base64,iVBORw0KGgo…
  AAAAAAElFTkSuQmCC`, 70 bytes).
- **States:** hover transitions the entire tile up by `2px` and reveals
  the overlay (transform `translateY(-2px)` over `all .3s`).

### Loader spinner

- **Purpose:** Skeleton / pagination indicator.
- **Anatomy:** `<div class="loader-grid">` →
  `<div class="loader-grid__spinner">` (no nested SVG; just
  bordered div styled with `@keyframes loadingSpinner .6s linear infinite`).
- **Visual:** centered, `height: 40px; margin-top: 40px`.

### Back-to-top button

- **Purpose:** Recover scroll position after long grid scroll.
- **Anatomy:** `<div class="bt-nav bt-nav--left js-gototop">` —
  40 × 40 round button (`border: 1px solid #222; border-radius: 50%`).
- **Position:** `position: fixed; bottom: 40px; right: 40px; z-index: 9`.
- **State:** Hidden by default; revealed (`.is-hidden` removed) when
  the user scrolls past the first viewport.

### Cookie banner

- **Purpose:** GDPR consent.
- **Anatomy:** `<div class="cookies-popup is-show">` containing copy
  and a `.button--small--white--rounded.js-accept-cookies` dismiss.
- **Visual:** Fixed `right: 30px; bottom: -50%` (animates to `0`);
  `width: 400px; max-width: 100%`; `padding: clamp(20px,5vw,30px)`;
  `background: #222`; `color: #fff`; `border-radius: 8px`;
  `z-index: 10`; `transition: all .4s`.
- **Mobile:** Anchored to `bottom: 0; right: 0; width: 100%`,
  `border-radius: 0`.

### Footer

- **Purpose:** Site map + legal + social.
- **Anatomy:**
  - `.footer__top` — small inline wordmark + `.footer__wrapper` →
    `.footer__grid` (4 `.footer__menu` columns).
  - `.footer__bottom` — `.footer__left` (Cookies / Legal Terms /
    Privacy) and `.footer__right` ("Connect:" + 7 social icons,
    each rendered as `<svg class="ico-svg"><use xlink:href=
    …/sprite-icons.svg#instagram|linkedin|twitter|facebook|youtube|
    tiktok|pinterest"></use></svg>`).
- **Visual:** `id="footer"` text color `#222`; top padding
  ~`clamp(40px, 6vw, 80px)`; hairline `border-top: 1px solid #ededed`
  on mobile.
- **Wordmark:** Custom 30 × 16 SVG glyph (the `aw` ligature), not part
  of the sprite.

### reCAPTCHA badge (third-party, observed)

- **Purpose:** Google reCAPTCHA v3 invisibility badge.
- **Anatomy:** `.grecaptcha-badge` positioned bottom-right; carries
  inline reCAPTCHA styles (Roboto, `--brand-dark: #1A73E8`,
  `--brand-light: #185ABC`, `--brand-error: #D93025`).
- **Note:** Out of scope for "design reconstruction" — third-party.

---

## JavaScript & Libraries

Awwwards does not use a SPA framework. It uses a **Webpack chunked
runtime** (`webpackChunkawwwards_new`) on top of plain DOM + **Stimulus
controllers** bound via `data-controller` / `data-action` attributes.
Heavy interactive code (preview iframe, infinite scroll, lazyload) is
authored in-house; one GSAP and one IntersectionObserver-driven
appearance controller are present. No React / Vue / Svelte / Astro is
detected.

### Table

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Webpack runtime | chunk name `runtime.bf71a965` | `<script src="…/runtime.bf71a965.js" defer>` | Splits app into ~8 chunks loaded on demand |
| Stimulus.js | unversioned (≈3.x pattern) | `data-controller="search"`, `data-action="click->search#toggleDropdown"` markup; controller identifiers match the Stimulus 3 API | Drives every interactive feature on the page; 12+ controllers registered inline |
| GSAP | unversioned in source (license banner present) | `js/5880.7efd7b75.js` (69 KB) — contains `gsap.registerPlugin`, `ScrollTrigger.create`, and 7 `gsap.to(` references | Used for marquee entrance, card scroll-in reveal, and possibly ScrollTrigger pin/reveal sequences |
| `IntersectionObserver` (native) | n/a | `js/7384.aa4162b5.js` × 8; `js/966.cbfdb87c.js` × 4; `gtm.js` × 3 | Stimulus-style appear/disappear controllers wrap the native API to dispatch custom events `appear` / `disappear` on intersection |
| Axios | unversioned | `7384.aa4162b5.js` (2.1 MB main bundle) | Used to fetch JSON for preview-iframe, infinite-scroll pages, and search suggestions |
| Video.js + videojs-youtube | inferred from `.video-js` / `.vjs-youtube` / `.vjs-iframe-blocker` CSS | inline `<style class="vjs-styles-defaults">`; YouTube iframe API scripts at `www.youtube.com/s/player/.../www-widgetapi.js` and `iframe_api` | Renders embedded YouTube playback on entry detail pages (not on the index, but loaded pre-emptively) |
| Google reCAPTCHA v3 | `6LdYct0kAAAAAHlky5jhQhrvSRt_4vOJkzbVs2Oa` | inline `<script>` injecting `recaptcha/api.js?render=…` | Used on vote + submit flows |
| Google Tag Manager | `GTM-PXD9JT` | `<script src="…/gtm.js?id=GTM-PXD9JT">` | Loads GA, Ads, Floodlight |
| Google Analytics (analytics.js + gtag.js) | n/a | `<script src="…/analytics.js">`; `gtag` calls in `gtm.js` + `destination.js` | Standard GA4 via GTM |
| Facebook Pixel | `2.0` (inline) | `fbq = function() {…}` inline loader + `<script src="…/fbevents.js">` | Standard PageView + custom events |
| LinkedIn Insight Tag | n/a | `<script src="https://snap.licdn.com/li.lms-analytics/insight.min.js">` and `insight.old.min.js` (both 53 KB) | Conversion tracking |
| Amplitude | n/a | `window.AmplitudeData = window.amplitude || {};` inline init with `{page_type:"user", page_sub_type:"homepage", page_uri:"/_fragment", url:"…"}` | Product analytics |
| Metricool `be.js` | n/a | `<script src="https://tracker.metricool.com/resources/be.js">` | Tag manager / tracker |
| Custom SVG sprite | n/a | `assets/redesign/images/sprite-icons.svg?v=3` (48 KB) — 83 symbols | All UI icons rendered via `<use xlink:href>` |
| Inter Tight variable font | n/a | `<link rel="preload" href="…/InterTight-VariableFont_wght.ttf" as="font" crossorigin>` + InterTight file in `tmp/awwwards/fonts/` (567 KB TTF) | Self-hosted variable font |
| Roboto | n/a | Loaded only inside the reCAPTCHA iframe (`Roboto,helvetica,arial,sans-serif`) | Third-party |

### Stimulus controllers observed (in markup)

The page wires the following controllers; each is a `<div data-controller="…">`
boundary with at least one `data-action`:

| Controller | Count | Action | Effect |
| --- | --- | --- | --- |
| `lazyload-image` | 32 | implicit `intersect->lazyload-image#load` | Replaces `data-srcset` → `srcset` when in viewport |
| `collectable` | 31 | `click->collectable#collect` | Adds entry to user's "collections" (cookie/LS) |
| `preview` | 31 | `click->preview#preview` | Opens preview iframe (loads `/sites/{slug}/content` as a fragment) |
| `visit-count` | 31 | `click->visit-count#count` | Logs click to GA / Amplitude |
| `searchable-filter` | 6 | `keyup->searchable-filter#searchEvent`, `click->searchable-filter#doSearch` | Client-side facet search |
| `login` | 3 | `click->login#open` | Opens login modal |
| `header-marquee` | 1 | implicit (IntersectionObserver start/stop) | Toggles `@keyframes marquee_text` based on visibility |
| `search` | 1 | `click->search#toggleMobile`, `click->search#toggleDropdown`, `click->search#close`, `click->search#doToogleTab` | Drives mobile hamburger, dropdown panels, search-overlay |
| `grid` | 1 | `click->grid#switchGrid`, `click->grid#toggleFilter`, `click->grid#closeFilters` | Drives density toggles + filter dropdown open/close |
| `toggle` | 1 | `click->toggle#toggle` | Expands "Read more" intro copy |
| `infinite-scroll` | 1 | implicit (IntersectionObserver on loader sentinel) | Fetches next page via Axios and appends to `.grid-cards` |
| `banner-click` | 1 | `click->banner-click#count` | Promo marquee click tracker |

Total `data-action` occurrences: 127 across the document. Total
Stimulus-bound elements: ~115.

---

## Animations (Catalog)

### CSS `@keyframes`

All definitions live in the inline `<style>` block at the top of
`tmp/awwwards/playwright/homepage.html`. Keyframes are defined once at
the document root and consumed by selectors throughout the page.

| Name | Defined at | Duration | Easing | Trigger / context |
| --- | --- | --- | --- | --- |
| `marquee_text` | inline CSS, near `.marquee-top` | `4s` | `linear infinite` | `.marquee-top__wrapper` — translates `0 → -50%` to scroll the promo strip; started/stopped by `header-marquee` Stimulus controller on intersection |
| `aniCountPulse` | inline CSS, near `.nav-filters__ani-count` | `1s`, **5 iterations** | `ease` | Fired on the `.nav-filters__ani-count` element (orange `#FF9667` text "10 336") when a filter dropdown is opened. Class is removed on `animationend` by `redesign_grid.js` |
| `btRotate` | inline CSS, near `.bt-nav` | `.6s` | `linear infinite` | Inner glyph of `.bt-nav` while it is the active scroll target (visual loading cue) |
| `clippath` | inline CSS, near cookie accept | `2s` | `infinite linear` | Decorative animation on the cookie-accept button (a clip-path reveal loop) |
| `budgetShiny` | inline CSS, near `.budget-tag` | `6s` | `ease-in-out infinite` | Sweep highlight on the `.budget-tag--small--solid--black.anim-shiny` chip (Site of the Day badge) |
| `animloader` | inline CSS, near `.loader-grid` | `.3s` (delay `.3s` / `.45s`) | `linear infinite alternate` | Skeleton shimmer on loading cards in two staggered phases |
| `loadingSpinner` | inline CSS, near `.loader-grid__spinner` | `.6s` | `linear infinite` | Page-2 spinner; rotates a single ringed div |
| `progress` | inline CSS, near progress bar | `.6s` | `ease-out forwards` | One-shot progress bar fill (top-of-page loader) |
| `overlay-spin` | inline reCAPTCHA CSS | `1.2s` (reCAPTCHA default) | `linear infinite` | reCAPTCHA v3 spinner — third-party |
| `spinner-spin` | inline reCAPTCHA CSS | `0.8s` | `linear infinite` | reCAPTCHA v3 spinner — third-party |

> Two additional keyframes (`overlay-spin`, `spinner-spin`) appear in
> `tmp/awwwards/playwright/css/styles__ltr__79d9f008.css` (82 KB) but
> are part of the reCAPTCHA stylesheet and not part of the Awwwards
> design system.

### JS-driven animations

| Source | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP `gsap.to(` (7×) + `ScrollTrigger.create` (14× refs in `5880` chunk) | Inferred: card / marquee scroll-in reveals | DOMContentLoaded + `IntersectionObserver` (via Stimulus controllers) | The actual `gsap.to` selector strings live in the page-specific chunks (not extracted from the bundled `5880` chunk, which only contains the GSAP library itself). One of the `gsap.to` calls is invoked from `redesign_grid.js`'s DOMContentLoaded handler (after `aniCountPulse` `animationend`) |
| Stimulus `appear` / `disappear` custom events | Fires once on viewport intersection per element | IntersectionObserver with `threshold: 0` | Dispatched by the appear/disappear wrapper, then handled by per-element classes (e.g. fade-in) |
| `IntersectionObserver` (8 in `7384`, 4 in `966`) | Drives `lazyload-image` (swap `data-srcset`→`srcset`), `infinite-scroll` (fetch next page), and `header-marquee` (start/stop `marquee_text`) | Each controller's `observe(target)` call | All observers use a single threshold + root-margin (default) |
| Cookie banner | `transition: all .4s` on `.cookies-popup` from `bottom: -50%` to `bottom: 0` | On `is-show` class toggle | Plain CSS transition, no JS animation |
| Vote button reveal | `transition: all .3s` on `.figure-rollover` (`opacity` + `transform`) | On `:hover` of `.card-site` | Pure CSS hover transition |
| `.bt-nav` rotation | `btRotate .6s infinite linear` on the inner chevron | Active state (scroll target) | CSS only |

### Page transitions

None. The site is a multi-page static + Stimulus app; navigating to
another category (e.g. `/websites/sites_of_the_day/`) is a hard page
load. There is no SPA route transition, no crossfade, no skeleton
handoff.

---

## Assets

The dump is sparse: only assets that are loaded eagerly or referenced
from the initial HTML are captured. Most thumbnails are served from
`assets.awwwards.com/awards/media/cache/thumb_440_330/…` and were not
downloaded. Below is the dump-resident inventory grouped by type.

### 3D models

N/A — no 3D assets observed in the dump. The Web & Interactive category
index page contains no `<canvas>`, `<model-viewer>`, `.glb`, `.gltf`,
`.obj`, `.fbx`, or `.usdz` references.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Inter Tight | 300, 400, 500, 600, 700, 800 (variable axis `wght`) | TTF (variable, 567 KB) | `https://assets.awwwards.com/assets/fonts/inter-tight/InterTight-VariableFont_wght.ttf` | yes — `tmp/awwwards/playwright/fonts/InterTight-VariableFont_wght__a0184e5a.ttf` (580 572 B) |
| Roboto | 400 (reCAPTCHA iframe only) | woff2 (40 KB subset) | `https://www.gstatic.com/recaptcha/.../KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2` | no — Google Fonts CDN (third-party, loaded only inside the reCAPTCHA iframe) |

`<link rel="preload" href="…/InterTight-VariableFont_wght.ttf" as="font"
crossorigin>` is present in `<head>` for FOUT mitigation.

### Images

All dumped images are small (≤ 400 KB). The big-ticket hero imagery is
served from a CDN cache that the Playwright dump did not capture.

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tmp/awwwards/playwright/images/6a351bc1066e50.36257306__003ac263.png` | PNG | 1600 × 1200 | 370 KB | `https://assets.awwwards.com/awards/submissions/.../6a351bc1066e50.36257306.png` | Largest image captured — likely the hero showcase tile or "Site of the Day" cover |
| `tmp/awwwards/playwright/images/6a2155ad07438341053434__0b547d7e.png` | PNG | 440 × 330 | 213 KB | `https://assets.awwwards.com/awards/media/cache/thumb_440_330/submissions/2026/06/6a2155ad07438341053434.png` | Grid thumbnail — entry "Lama Lama" |
| `tmp/awwwards/playwright/images/6a206beb1cc30235576855__3641ae8a.jpg` | JPEG | unknown (header parser failed) | 32 KB | `https://assets.awwwards.com/awards/submissions/.../6a206beb1cc30235576855.jpg` | Mid-size tile |
| `tmp/awwwards/playwright/images/6a21116e41890964966043__42986817.png` | PNG | 440 × 330 | 33 KB | `https://assets.awwwards.com/awards/media/cache/thumb_440_330/submissions/2026/06/6a21116e41890964966043.png` | Grid thumbnail |
| `tmp/awwwards/playwright/images/6a2696803b569174714797__2e5f436b.jpg` | JPEG | unknown | 23 KB | `https://assets.awwwards.com/awards/submissions/.../6a2696803b569174714797.jpg` | Tile |
| `tmp/awwwards/playwright/images/6a20ba86dabf6002649149__3f130619.png` | PNG | 440 × 330 | 15 KB | `https://assets.awwwards.com/awards/media/cache/thumb_440_330/.../6a20ba86dabf6002649149.png` | Grid thumbnail |
| `tmp/awwwards/playwright/images/6a20367b884cd122360847__7fa71db2.png` | PNG | 70 × 70 | 10 KB | `…/6a20367b884cd122360847.png` | Avatar / small badge |
| `tmp/awwwards/playwright/images/6929f664f1af7039314950__fe642cc9.png` | PNG | 70 × 70 | 6.5 KB | `…/6929f664f1af7039314950.png` | Avatar / badge |
| `tmp/awwwards/playwright/images/6a1edd95a5be8198252156__d504944d.png` | PNG | 70 × 70 | 8.6 KB | `…/6a1edd95a5be8198252156.png` | Avatar / badge |
| `tmp/awwwards/playwright/images/67e282e94f444831561916__d81e6a43.png` | PNG | 70 × 70 | 4.6 KB | `…/67e282e94f444831561916.png` | Avatar / badge |
| (24× more PNG/JPG/JPEG files at 70 × 70 px) | mixed | 70 × 70 | 0.5–2.5 KB each | `https://assets.awwwards.com/awards/submissions/.../*.png|jpg|jpeg` | Avatars and 1-px tracking pixels |
| `tmp/awwwards/playwright/images/logo_48__c1452452.png` | PNG | 48 × 48 | 2.2 KB | `https://www.awwwards.com/…/logo_48.png` | Apple-touch / favicon-48 fallback |
| `tmp/awwwards/playwright/images/apple-touch-icon.png` (downloaded as `images/apple-touch-icon__d6f8ee68.png`) | PNG | unknown | 4.9 KB | `https://www.awwwards.com/apple-touch-icon.png` | iOS home-screen icon |
| `tmp/awwwards/playwright/images/c3po__28b79d50.jpg` | JPEG | 1 × 1 | 70 B | `data:image/jpeg;base64,…` | Tracking pixel |

Computed-style analysis (113 elements) shows background images are
delivered from the `assets.awwwards.com` CDN cache with width 440 and
2× retina 880 (`thumb_440_330` / `thumb_880_660`). Two `<img>` tags
were `lazy--loaded` by the time the snapshot was captured (after the
`lazyload-image` controller swapped `data-srcset` → `srcset`).

### SVGs & icons

- **Inline SVGs observed in HTML:** at least 12 — header logo (linked
  Awwwards wordmark), footer wordmark (30 × 16 `aw` ligature), 7 social
  icons in the footer (Instagram, LinkedIn, Twitter, Facebook, YouTube,
  TikTok, Pinterest), 1 search `lupe` icon in the search input,
  1 arrow icon in the "VOTE NOW" pill, 1 chevron `arrow-dd` in each
  filter dropdown (×5), 1 hamburger glyph.
- **Standalone SVG files in dump:** 1 —
  `tmp/awwwards/playwright/svgs/sprite-icons__2575b8db.svg` (48 KB,
  83 symbols). Source URL:
  `https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3`.
- **Icon system:** Custom in-house sprite (`<def><g id="…">…</g></def>`
  with `<use xlink:href>` references). See "Iconography" in
  *Visual Language* for the full symbol inventory.

### Audio & video

N/A — no `<audio>`, `<video>`, `.mp4`, `.webm`, `.mp3`, `.wav` files
in the dump. Video.js + videojs-youtube infrastructure is loaded
(`<style class="vjs-styles-defaults">` + YouTube widget API scripts),
presumably for entry-detail pages and YouTube embeds, but no media is
actually rendered on the observed index page.

---

## Motion & Interaction

### Principles

- All motion is **functional** — never purely decorative (with the
  exception of the marquee promo, which is explicitly a "screensaver"
  for a marketing message).
- Default easing for state transitions is **`all .3s`**, a flat 300 ms
  linear-like curve; the design does **not** use a custom
  `cubic-bezier`. A small number of longer transitions use
  `all .6s cubic-bezier(0, 1, 0.5, 1)` (overshoot-free) on modal-style
  reveals.
- Default duration: 300 ms for hover/focus state changes, 400 ms for
  the cookie banner slide, 4 s for the marquee, 6 s for the
  Site-of-the-Day badge shimmer.
- Easing values actually used: `linear`, `ease`, `ease-in-out`,
  `ease-out`, `cubic-bezier(0, 1, 0.5, 1)`. No `ease-in` outside the
  cookie banner.

### Specific behaviors

- **Link hover:** color shift to `--color-orange` (`#FA5D29`), 300 ms
  via `transition: color .3s, background .3s, border .3s`.
- **Button press:** No explicit scale; the design relies on color
  shift + opacity (`button:active` is not separately styled — the
  hover state is the active state).
- **Card hover:** `.figure-rollover` overlays the thumbnail with a
  semi-opaque title, "VOTE NOW" pill, and avatar block. Transition:
  `transition: all .3s` with `opacity` 0 → 1 and a small `transform:
  translateY(-2px)` lift. Underlying `<img>` gets a subtle `filter:
  brightness(0.92)` (the gray marquee variant uses `filter: brightness
  (95%)`).
- **Filter dropdown open:** instant — `opacity 0 → 1; visibility
  hidden → visible` over `0s` (no transition on the panel itself; the
  visual snap is intentional).
- **Section reveal on scroll:** implemented via Stimulus + native
  IntersectionObserver + (likely) GSAP `ScrollTrigger` (the library
  is bundled but the exact reveal patterns are inside minified
  chunks). No CSS `animation` is gated on intersection directly.
- **Page transition:** none (hard navigation between routes).
- **Vote button focus:** native outline is suppressed
  (`button:focus { outline: none }`); focus visibility is achieved
  via a styled `:focus-visible` ring (assumed; the rule that suppresses
  outline is overridden on the cookie-accept button).
- **Search input:** focus expands the field from 0 to its full
  intrinsic width (`max-width .3s, padding .3s, margin .3s`); icon
  shifts from gray to dark on focus.
- **Back-to-top:** appears on scroll past viewport 1, spins its
  inner glyph while loading (`@keyframes btRotate`), scrolls page to
  top on click.

### Reduced motion

Not explicitly handled — the inline stylesheet ships no
`@media (prefers-reduced-motion: reduce)` block. The marquee
animation, `btRotate`, `budgetShiny`, and `clippath` all run
unconditionally. The `redesign_grid.js` Stimulus controller
does respect intersection (so the marquee pauses when off-screen),
but does not check `prefers-reduced-motion`.

---

## Content & Voice

- **Tone:** Editorial, confident, lightly opinionated. The page title
  ("Web & Interactive") is bare noun-phrase — no marketing tagline. The
  lead-in copy uses a soft superlative ("Best selection of *Web &
  Interactive Website* examples for your inspiration…") that is
  descriptive, not promotional.
- **Sentence length:** Short to medium. The lead-in is one ~12-word
  sentence. Filter labels are 1–3 words each ("Sites of the Day",
  "Honorable Mention", "Developer", "Typography Honors", "Nominees").
- **Capitalization:** Sentence case in headings (e.g. "Web &
  Interactive", "Best selection of…"). CTA buttons are uppercase
  tracked ("VOTE NOW", "FILTERS"). Filter labels are sentence case.
- **Punctuation:** No Oxford-comma ambiguity because the lists are
  short and parallel. Em-dashes are not used. The brand name
  "Awwwards" is one word, two `w`s, no space.
- **CTA vocabulary:** "VOTE NOW", "FILTERS", "Read more", "Sign in",
  "Submit Website", "Watch all courses for just $12/month" (promo
  marquee), "Accept cookies".
- **Number formatting:** Counts above 1 000 use a thousands separator
  with a regular space (`10 336` rendered beside the H1). Counts above
  10 000 collapse to `K` notation in the nav dropdowns (`25K`, `48K`,
  `11091`, `11117`).
- **Localization:** Page language is `en` (`<html lang="en">`). The
  "EU location" hint suggests geo-detection of the visitor's region
  for cookie / compliance purposes.

The page contains **no marketing prose** on the gallery chrome
itself; all descriptive copy is structural ("Web & Interactive",
"Awards", "Countries", "Categories", "Tags", "Colors", "Best selection
of…"). Body copy of individual entries (not described here) is authored
by the submitting agency.

---

## Information Architecture

Routes directly observed or inferred from the rendered DOM and the
manifest. Each entry below is one sentence on purpose + primary
component.

- `/` — Awwwards homepage (not observed in dump).
- `/websites/` — Websites landing (lists all categories, includes
  "Websites" breadcrumb link from the observed page).
- `/websites/web-interactive/` — **Web & Interactive category index** —
  the page documented here. Primary component: `grid-cards` +
  `nav-filters`.
- `/websites/sites_of_the_day/` — Sites of the Day filter (linked from
  the "Awards" filter dropdown).
- `/websites/sites_of_the_month/` — Sites of the Month filter.
- `/websites/sites_of_the_year/` — Sites of the Year filter.
- `/websites/developer/` — Developer-awarded entries.
- `/websites/honorable/` — Honorable Mentions.
- `/websites/nominees/` — Nominees (48K count, observed in nav).
- `/websites/winner_category_typography/` — Typography Honors.
- `/collections/search/` — Collections landing (linked from footer).
- `/elements/` — Elements landing (linked from footer).
- `/academy/` — Academy landing (footer).
- `/academy/conferences/` — Conferences (linked from footer to
  `https://conference.awwwards.com`).
- `/jobs/search/` — Jobs landing (footer).
- `/market/` — Market landing (footer).
- `/directory/search/` — Directory landing (footer).
- `/faqs/`, `/about-us/`, `/contact-us/` — utility pages (footer).
- `/cookies-policy/`, `/terms/`, `/privacy-policy/` — legal (footer
  bottom).
- `/sites/{slug}/` — individual entry detail (linked from every
  thumbnail; previews via `/sites/{slug}/content` iframe fragment).
- `/_fragment` — Amplitude-tracked "fragment" virtual route, fires
  `page_type: user / page_sub_type: homepage` event.
- `https://www.awwwards.com/honors/winners` — Awards winners (linked
  from nav).

External (out-of-site): Instagram, LinkedIn, Twitter, Facebook,
YouTube, TikTok, Pinterest (footer); YouTube iframe API origin
(`www.youtube.com/s/player/…`); Google Tag Manager (`GTM-PXD9JT`).

---

## Accessibility

- **Color contrast:**
  - Body text `#222` on `#F8F8F8` = **15.5 : 1** (WCAG AAA).
  - Body text `#222` on `#FFF` (cards) = **16.1 : 1** (AAA).
  - Inverse `#FFF` on `#222` (marquee, footer dark variant) = same.
  - Orange `#FA5D29` accent on `#F8F8F8` = **3.5 : 1** — passes
    WCAG AA for large text but **fails AA for small body text**; the
    accent is therefore reserved for ≥ 18 px display and for state
    affordances (hover, active, error), never for body copy.
  - Tag swatches use `color: <tag>` on white at 11 px — borderline;
    a few (`#C8E4D3`, `#E2F4E9`, `#FFFBE2`) are too light for AA
    text but are used only as background fills, with the tag's
    name set in `#222` overlay text.
- **Focus indicators:** `outline: none` is set on `button:focus` and
  `input:focus`; the design relies on `:focus-visible` and the
  hover-state color shift for affordance. This is **sub-optimal** —
  keyboard users see no visible focus ring on most controls.
- **Keyboard:**
  - Marquee promo `<a class="item-link">` is keyboard-reachable but
    empty (`<a class="item-link"></a>`) — likely a click-tracking
    overlay that should also expose the destination URL via
    `aria-label`.
  - Nav dropdowns are `<span>` elements with `data-action="click->"`
    — keyboard-inaccessible (no `role="button"`, no `tabindex`).
    Screen readers will read them as plain text.
  - Search input has `data-search-target` and is reachable via Tab;
    its icon is decorative.
- **Screen-reader landmarks:** `<header>`, `<nav>`, `<main>`
  (implicit via the document body / `<section>` block), `<footer>`
  are present and unlabelled (no `aria-label`). The `<h1>` is unique
  on the page (the page-title row), and each card uses an
  `<a aria-label="…">` link wrapping the thumbnail — good practice.
- **Motion:** No `prefers-reduced-motion` handling (see *Motion &
  Interaction*). Marquee, badge shimmer, and back-to-top rotation run
  unconditionally.
- **Alt text:** Every `<img>` carries `alt="…"` — the entry title
  (e.g. `alt="Lama Lama"`, `alt="Creative Marketing AI"`, `alt=
  "Order & Chaos"`). Decorative icons inside the SVG sprite are
  loaded via `<use>` and are hidden from AT by being inline SVG
  without `<title>`.
- **Language:** `<html lang="en">`.

---

## Sources

URLs actually opened / fetched while writing this:

- Category index (entry page) —
  https://www.awwwards.com/websites/web-interactive/
- Rendered DOM (Playwright) —
  `tmp/awwwards/playwright/homepage.html` (609 KB)
- Stylesheet (inline) — inside the rendered DOM
- Stylesheet (reCAPTCHA, minified) —
  `tmp/awwwards/playwright/css/styles__ltr__79d9f008.css` (82 KB)
- SVG sprite —
  `tmp/awwwards/playwright/svgs/sprite-icons__2575b8db.svg` (48 KB)
- Computed styles snapshot —
  `tmp/awwwards/playwright/computed-styles.json` (113 elements)
- Full-page screenshot — `tmp/awwwards/playwright/homepage-fullpage.png`
  (733 KB)
- JS bundle inspection —
  `tmp/awwwards/playwright/js/5880.7efd7b75.js` (GSAP),
  `tmp/awwwards/playwright/js/7384.aa4162b5.js` (Stimulus + Axios),
  `tmp/awwwards/playwright/js/redesign_grid.56c0c948.js` (counter
  animation handler).
- Manifest —
  `tmp/awwwards/manifest.json` (75 entries, 10.4 MB total).

---

## Changelog

- 2026-06-20 — Initial draft by opencode, from the Phase 1 dump at
  `tmp/awwwards/` (Playwright render of the Web & Interactive category
  index, scraped 2026-06-19).
