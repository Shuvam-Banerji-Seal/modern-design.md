# Siteinspire — design.md

> A structured design specification of **https://www.siteinspire.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/siteinspire/` (gitignored)
> **Note:** The dump's `html/`, `css/`, `js/` folders are empty (Cloudflare
> challenge against the bare scraper). Every observation in this document is
> taken from `tools/tmp/siteinspire/playwright/`, which contains the rendered
> DOM (`homepage.html`, 652 KB), the two compiled CSS files, the 30+ JS
> chunks, all 28 hero/grid JPEG thumbnails, all 8 Scto Grotesk A font files,
> the `computed-styles.json` (1,042 elements), and the full-page screenshot.

---

## Overview

Siteinspire is a long-running, **curated gallery / index of the web's finest
design and interactive work**, not a portfolio of its own. The single most
important thing to know is that **the homepage is a directory**, not a
product page: an "above-the-fold" hero slideshow of the most recent
features, a tabbed category filter (Popular / Styles / Types / Subjects /
Platforms), a 3-up grid of 16:10 screenshot cards (each a link to a single
featured site), pagination, a weekly newsletter band, and a four-column
footer. Each thumbnail is a 2880×1800 Cloudflare-image-resized JPEG served
from `r2.siteinspire.com`.

The aesthetic is **deliberately muted, editorial, and quiet** so the
featured sites — the actual content — can shout. White background, near-black
text, a single red circle for the brand mark, zinc-grey for chrome, and
Scto Grotesk A as the only typeface. No dark mode is offered on the page
itself (the CSS has `dark:` variants but the body class does not opt in),
no marketing graphics, no carousel auto-play, no popups, no overlay
modals on first paint. Just text, thumbnails, and one slow horizontal
slideshow. Curated by Daniel Howells since 2007.

**Category:** Gallery / Index / Curation
**Primary surface observed:** Homepage (`/`)
**Other surfaces observed in links / RSC payload:** `/websites`, `/websites/page/N`,
`/websites/category/<slug>`, `/websites/popular/{today,week,month,year}`,
`/website/<id>-<slug>` (detail page), `/profiles`, `/profile/<id>-<slug>`,
`/about`, `/sponsorship`, `/signin`, `/search?query=…`, `/privacy`,
`mailto:mail@siteinspire.com`, plus an RSS feed at `/websites/feed`.
**Tone:** Confident, curatorial, neutral, quietly opinionated. Feels like a
print magazine's website rather than a SaaS landing page.
**Framework detected:** **Next.js 15 with the App Router and Turbopack**
(URLs carry the `?dpl=dpl_DtoopQ2DijArR1nz4M1N5fQbxezj` deploy ID; the
`/_next/static/chunks/turbopack-0ds4u75t0~9r4.js` chunk is loaded). React
Server Components are used extensively (the `self.__next_f.push([1,"…
"])` payload at the bottom of the HTML is the RSC wire format).

---

## Visual Language

### Color

The palette is built on **Tailwind's `zinc` scale** (warm grey) with one
brand red and small amounts of red/green/amber for state. Every value below
is the **uppercase hex** the CSS actually emits, not a paraphrase. Closest
CSS named color in parentheses where helpful.

| Role | Token (Tailwind) | Value | Notes |
| --- | --- | --- | --- |
| Page background | `bg-white` | `#FFFFFF` | Base canvas for the whole app |
| Hero section background | `lg:bg-zinc-100` | `#FAFAFA` | Only behind the desktop hero; mobile uses white |
| Card chrome background | `bg-zinc-50` | `#FAFAFA` | Behind every screenshot in the grid (`WebsiteThumbnail`) |
| Card padding background | `bg-zinc-100` | `#F4F4F5` | The "frame" pad around each 16:10 screenshot |
| Subtle surface (chips, badges) | `bg-zinc-100` | `#F4F4F5` | Count chip in category filter hover, search bar rest state |
| Hover surface | `bg-zinc-200/80` | `rgba(228,228,231,0.8)` | Tremor button hover (also `dark:hover:bg-zinc-800/80`) |
| Nav rest background | `bg-transparent` | `rgba(0,0,0,0)` | Top-nav links before hover |
| Nav hover background | `hover:bg-zinc-100` | `#F4F4F5` | On nav pills, list rows |
| Border default | `border-zinc-200` | `#E4E4E7` | Default hairline; also header bottom border |
| Border strong (input) | `border-zinc-300` | `#D4D4D8` | Search input, newsletter input, focus ring base |
| Border focus | `focus:border-zinc-500` | `#71717A` | Active input border |
| Text primary | `text-zinc-900` | `#18181B` | Body copy, button labels, captions (also raw `text-black` on logotype) |
| Text secondary | `text-zinc-700` | `#3F3F46` | Footer statement line |
| Text muted | `text-zinc-500` | `#71717A` | Card date, footer link muted, credit byline, nav rest |
| Text very muted | `text-zinc-400` | `#A1A1AA` | Search icon, disabled |
| Text on dark CTA | `text-white` | `#FFFFFF` | Sign-In button label |
| Brand mark | `bg-red-500` | `#EF4444` | The 32px / 40px filled circle next to the logotype ("Logo" div) |
| Brand mark border tint | — | `#FECACA` (`bg-red-200/50`-style ring) | 404 not-found illustration ring |
| Error / destructive | `text-red-500`, `border-red-500` | `#EF4444` | Validation states |
| Error background tint | `text-red-50/30`-style | `rgba(254,242,242,…)` | Error row tinting |
| Error deep | `text-red-900` | `#7F1D1D` | Strong error label |
| Success | `text-emerald-500` (in CSS) | `#10B981` (Tailwind 500); `#059669` (emerald-600) | Available; rarely used on the homepage |
| Warning / amber | `text-amber-500` | `#F59E0B` (Tailwind) / `#FACC15` (yellow-400) | Available; not observed in this surface |
| Dark-mode surface (CSS exists, not applied) | `dark:bg-zinc-950` | `#09090B` | Available in CSS but `dark` class is not on `<html>` |
| Dark-mode elevated | `dark:bg-zinc-900` | `#18181B` | Same |
| Dark-mode border | `dark:border-zinc-800` | `#27272A` | Same |
| Ring (focus) | `focus:ring-zinc-200` | `#E4E4E7` (1px) | Tremor-raw button focus ring |
| Pagination active fill | `bg-zinc-900` | `#18181B` | "Page 1" pill, Sign-In button |
| Pagination rest fill | `bg-transparent` | `rgba(0,0,0,0)` | Pages 2–5 |
| Pagination next | `bg-zinc-100` | `#F4F4F5` | "Next" button (chevron-right) |
| 404 / brand ring | `fill="#ef4444"` | `#EF4444` | Single not-found illustration |
| Link / accent | `text-zinc-500` → `hover:text-zinc-700` | `#71717A` → `#3F3F46` | Card title hover, profile byline |
| Caption title rest | `text-current` | inherits `#18181B` | Within the `.Filter__link` span |
| Toolbar icon button | `bg-zinc-100` → `hover:bg-zinc-200/80` | `#F4F4F5` / `rgba(228,228,231,0.8)` | Bookmark + external-link icon buttons inside cards |
| Sign-In CTA rest | `bg-zinc-900` | `#18181B` | Top-right pill |
| Sign-In CTA hover | `hover:bg-zinc-900/90` | `rgba(24,24,27,0.9)` | Tremor-raw primary |
| Newsletter arrow button | `bg-zinc-100` → `hover:bg-zinc-200/80` | `#F4F4F5` | Submit button at right of email field |
| Loading shimmer | `bg-zinc-50` | `#FAFAFA` | `animate-pulse` placeholder under lazy-loaded ghost cards |

**Dark mode:** the CSS includes the full `dark:` variant set
(`dark:bg-zinc-950`, `dark:text-zinc-50`, `dark:border-zinc-800`,
`dark:hover:bg-zinc-800/80`, `dark:ring-offset-zinc-950`,
`dark:focus-visible:ring-zinc-300`) — the class is bound to the
`:is(.dark *)` selector — but the root `<html class="h-full min-h-svh
touch-manipulation" lang="en">` does **not** carry `class="dark"`, so the
page renders light-only on first paint. The toggle UI is not present in the
observed surface.

### Typography

The site ships a single commercial typeface, **Scto Grotesk A**, self-hosted
as 8 `.woff2` files and routed through `next/font/local`. There is no
fallback to a system font for the body — the page literally says
`font-family:var(--font-scto),ui-sans-serif,system-ui,sans-serif,…
` and the `--font-scto` variable is always the custom family. Scto is a
neoclassical grotesque, narrower than Inter, with a tall x-height and
slightly artful italic.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Logo wordmark ("Siteinspire") | Scto Grotesk A | 500 (Medium) | `1rem` (`text-base`) | `1rem` (`leading-none`) | inherits `letter-spacing: -0.025rem` (body) |
| Body / paragraphs / captions | Scto Grotesk A | 400 (Regular) | `1rem` (`text-base`) → `0.875rem` (`lg:text-sm`) | `1.5rem` | `-0.025rem` (set on `<body>` as `-tracking-[0.025rem]`) |
| Hero H1 (desktop, left rail) | Scto Grotesk A | inherits (400) | `1.875rem` (`text-3xl`) → `2.25rem` (`3xl:text-4xl`) at ≥1920px | `2.25rem` / `2.5rem` | inherits `-0.025rem` |
| Hero H2 (mobile, centered) | Scto Grotesk A | inherits (400) | `1.5rem` (`text-2xl`) | `2rem` | inherits |
| Card caption (title) | Scto Grotesk A | inherits (400) | inherits `0.875rem`/`1rem` | inherits `1.25rem` | inherits |
| Card caption (date "a month ago") | Scto Grotesk A | inherits (400) | `0.875rem` (`text-sm`) | inherits | inherits |
| Credit byline ("1/1 Studio") | Scto Grotesk A | inherits (400) | `0.875rem` (`text-sm`) | inherits | inherits |
| Nav link | Scto Grotesk A | inherits (400) | `0.875rem` (`text-sm`) | `1.25rem` | inherits |
| Filter tab trigger | Scto Grotesk A | inherits (400) | `1rem` (`text-base`) → `0.875rem` (`md:text-sm`) | `1.25rem` | inherits |
| Filter category link | Scto Grotesk A | inherits (400) | `1rem` (`text-base`) → `1.125rem` (`md:text-lg`) → `1.25rem` (`lg:text-xl`) | inherits | inherits |
| Filter count chip | Scto Grotesk A | inherits (400) | `0.875rem` (`text-sm`) → `1rem` (`lg:text-base`) | inherits | inherits; `font-variant-numeric: lining-nums` |
| Sign-In button label | Scto Grotesk A | inherits (400) | `0.875rem` (`text-sm`) | `1.25rem` | inherits |
| Search input | Scto Grotesk A | inherits (400) | `0.875rem` (`sm:text-sm`) | `1.25rem` | inherits |
| Newsletter label & copy | Scto Grotesk A | inherits (400) | inherits | inherits | inherits |
| Footer statement | Scto Grotesk A | inherits (400) | `1.25rem` (`text-xl`) | `1.75rem` | inherits |
| Footer link | Scto Grotesk A | inherits (400) | inherits | inherits | inherits |

**The wordmark "Siteinspire"** is not a system font — it is an inline SVG
(viewBox `0 0 280 58`, ~12 path glyphs spelling "Siteinspire" in the
Medium cut), color `fill="currentColor"` so it inherits `text-black` (i.e.
`#000000`) and re-tints in dark mode.

**Number rendering:** the filter count chips set
`font-variant-numeric: lining-nums` (CSS class `lining-nums` → `--tw-numeric-figure:lining-nums`),
so "2,343" etc. use lining figures.

**Optimization classes on `<body>`:**
`optimize-legibility no-ligatures isolate flex h-screen w-screen max-w-full
flex-col break-words bg-white text-base text-shadow-xs text-zinc-900
-tracking-[0.025rem] antialiased`. `no-ligatures` disables fi/fl/ffi
ligatures — appropriate for an editorial feel.

**Text shadow:** `.text-shadow-xs` resolves to a subtle 1-stop text shadow
(Tailwind plugin) for legibility on photograph-rich cards.

**Italic usage:** italic is used sparingly — only inside the SVG wordmark
glyph for letters like `i` and `t` that have italic alternates in the Scto
typeface, and in the "Filter" tab's hover label tooltip. Regular body copy
is straight-up roman.

### Spacing & radius

- **Base unit:** 4px (Tailwind default).
- **Vertical scale observed:** 4, 8, 12, 16, 24, 32, 48, 56 (header
  height), 64, 80 (`h-20` mobile hero), 96, 112 (`h-header` mobile = 4rem
  = 64px, desktop = 7rem = 112px), 128 px.
- **Page padding (gutters):** `px-6` (`1.5rem` = 24px) on mobile,
  `lg:px-8` (`2rem` = 32px) on `lg+`. Used on every container — the
  header, the filter, the website grid, the footer, and the newsletter band.
- **Grid gap:** `gap-x-6 gap-y-6` mobile, `lg:gap-x-16 lg:gap-y-12` desktop,
  `2xl:gap-x-16`. The 64px column gap (`gap-x-16`) is unusually wide and is
  the dominant negative space of the layout.
- **Card internal padding (the "matte" around each screenshot):**
  `p-2` mobile (8px) → `@3xs:p-4` (16px) → `@2xs:p-6` (24px) once the
  card is wider than 12rem/192px / 16rem/256px. This is a CSS `@container`
  query — the card scales its mat padding with its own width, not the
  viewport.
- **Border radii observed:**
  - `rounded-sm` → `border-radius: 0.125rem` (2px) — used on every
    `.WebsiteThumbnail` (the screenshot itself) and on the sign-in icon.
  - `rounded` → `border-radius: 0.25rem` (4px) — used on
    `.WebsiteCard__imageWrapper` (the matte that frames the thumbnail).
  - `rounded-[5px]` → `5px` — Tremor-raw input file-selector pseudo.
  - `rounded-md` / `0.375rem` → used in the Tremor-raw button system
    (not observed in our cards).
  - `rounded-full` → `9999px` — **the dominant radius**. Used on:
    the brand circle logo (`.Logo` size-8 lg:size-10), the top-nav
    pill buttons, the sign-in CTA, the search input (always pill-shaped,
    collapsing to an icon-only 32px circle on mobile before focus),
    the slideshow nav arrows, the slideshow pagination dots, every card
    toolbar icon button (bookmark, external-link), the newsletter submit
    arrow, the "Filter" chevron-up toggle, the hamburger menu, and the
    pagination numbers.
- **Shadows:** essentially **none** in the observed surface. All Tremor
  buttons ship `shadow-none` as their default and lift via `shadow-lg`
  only on `focus-visible`. The header has only a 1px hairline at its
  bottom border, no drop shadow. Cards have no shadow at rest and no
  shadow on hover. The only `box-shadow` value observed in `computed-styles.json`
  is `none` for every measured element, plus `rgba(0,0,0,0) 0px 0px 0px 0px`
  triples (Tailwind's neutralised `--tw-ring-shadow` / `--tw-shadow`).
  Visual hierarchy is achieved purely through size, color, and the
  background mat around screenshots, **not** through elevation.
- **Vertical rhythm:** the implicit baseline is 4px; section vertical
  padding is in 8/12/16/24/32/48/64/96 px steps. The header is the tallest
  fixed element (`h-16` mobile, `h-header = 7rem` desktop). Section
  separators are a single `border-t` on a wrapper, not a hard rule.

### Iconography

- **System:** **Lucide Icons**, open source, `stroke-width="2"`
  (overridden to `stroke-[1.5]` site-wide via the `class="size-4
  stroke-[1.5]"` modifier on every Lucide SVG in the markup).
- **Stroke / fill style:** all icons are outline-only, no fill, 1.5px
  stroke, `stroke-linecap="round"`, `stroke-linejoin="round"`. The
  brand mark is the one exception — it is a filled red circle, drawn
  as a `div` not an SVG.
- **Default viewBox:** `0 0 24 24`, `width="24" height="24"` in the
  markup but every consumer applies `size-4` (`1rem` = 16px) so the
  rendered icon is **16px**.
- **Used icons (all observed in the rendered HTML):** `lucide-search`
  (header search affordance), `lucide-menu` (mobile hamburger,
  `size-4 stroke-[1.5]`), `lucide-user-round` (Sign-In button glyph,
  `size-4 stroke-[1.5]`, `mr-1.5`), `lucide-chevron-up` (filter
  collapse toggle, `size-4`), `lucide-chevron-left` / `lucide-chevron-right`
  (slideshow arrows + pagination prev/next, `size-4 stroke-[1.5]`),
  `lucide-bookmark` (card toolbar — "Add to collection", `size-4
  stroke-[1.5]`), `lucide-arrow-up-right` (card toolbar — "Visit
  external", `size-4 stroke-[1.5]`), `lucide-arrow-right` (newsletter
  submit, `size-4 stroke-[1.5]`).
- **Logo / brand mark:** a CSS-only 32/40px filled red disc, not an
  SVG. Renders identically in every browser.
- **Wordmark:** an inline SVG of the Scto Grotesk A Medium cut, glyphs
  filled with `currentColor`. Approximately 280×58 units, displayed at
  16×16/20×20 px (`h-4.5 lg:h-5`).

---

## Layout & Grid

- **Max content width:** no explicit max width on the main column; the
  site uses a **12-column CSS grid** (`grid-cols-12`) inside `.WebsiteGrid`,
  with a 64px gutter at `lg+`. The 3-up grid reaches the full viewport
  width minus the `lg:px-8` page padding. Container breakpoint widths from
  Tailwind's defaults: 640 / 768 / 1024 / 1280 / 1536 px. **Custom
  breakpoints also present** (likely for the 3xl / 4xl / 5xl "ultra-wide"
  utilities): `1920px` (3xl: `col-span-3`, `block`, `hidden`, `text-4xl`),
  `2140px` (4xl: container max-width), `2560px` (5xl: container max-width).
  At `≥1920px` the grid switches from 3 columns to **4 columns** (`3xl:col-span-3`
  per card).
- **Page gutter:** `px-6` (24px) on mobile, `lg:px-8` (32px) on `lg+`.
- **Grid:** 12-col with `lg:gap-x-16 lg:gap-y-12 2xl:gap-x-16` (64/48/64).
  Per card `col-span-12` (full width, 1 col) on mobile, `sm:col-span-6`
  (6 col = 2-up) on `sm`, `lg:col-span-4` (4 col = 3-up) on `lg`,
  `3xl:col-span-3` (3 col = 4-up) on `≥1920px`.
- **Breakpoints:**
  - `xs / sm` < 640px (mobile, 1 col)
  - `sm` ≥ 640px (2 col)
  - `md` ≥ 768px (2 col, filter becomes horizontal)
  - `lg` ≥ 1024px (3 col, desktop header shown, hero shown)
  - `xl` ≥ 1280px (3 col, larger gutters)
  - `2xl` ≥ 1536px (3 col, 64px gutter)
  - `3xl` ≥ 1920px (**4 col**)
  - `4xl` ≥ 2140px (container max-width)
  - `5xl` ≥ 2560px (container max-width)
- **Container queries** (per-card `@container`):
  - `@container (min-width: 8rem)` → enables `@xs:block` (8×2 = 16px
    card mat becomes available once card is at least 128px wide).
  - `@container (min-width: 12rem)` → enables `@3xs:p-4` (16px mat
    padding when card is at least 192px wide).
  - `@container (min-width: 16rem)` → enables `@2xs:flex` toolbar
    and `@2xs:p-6` (24px mat padding when card is at least 256px wide).
  These are applied via Tailwind's `@tailwindcss/container-queries`
  plugin.
- **Hero layout (desktop, `lg+`):** A near-full-bleed strip with a
  `zinc-100` background, a thin top spacer (`pt-28` = 112px = exactly
  the header height so the H1 sits below the fixed bar), an absolutely
  positioned H1 in the top-left corner (`absolute px-8 py-8` so the
  H1 overlaps the slide deck), and a horizontally sliding
  `.Slideshow` occupying the right 2/3 of the viewport. Slides are
  `flex-[0_0_75%]` (75% of the slide container), p-6 inside white card
  frames. Below the slides: an absolute-positioned row of pagination
  dots, the active site title (`.text-sm .text-zinc-600`), and chevron
  prev/next buttons.
- **Hero layout (mobile):** the H2 is centered (`text-center` with a
  `<br>`), the slides live in a 100%-width flex strip with a `bg-zinc-100`
  band wrapping them, no left rail.
- **Filter band:** sits between the hero and the grid. It is a 12-col
  grid (`.Filter grid grid-cols-12`) where the filter block is
  `col-span-12 lg:col-span-8 lg:col-start-5` — the filter is offset
  to start at column 5 of 12 on desktop, leaving a 4-column empty
  left margin that visually mirrors the hero H1 position above.
- **Website grid:** 12-col grid, each card 1/2/3/4 columns at sm/md/lg/3xl.
  Cards have a `@container` wrapper so internal padding scales with
  card width.
- **Pagination:** inside a `.WebsitePagePagination` 12-col grid, the
  page-number list is `col-span-12 lg:col-span-8 lg:col-start-5
  lg:px-6` (same left offset as the filter, by design).
- **Newsletter band:** a `border-t` section with `.NewsletterModule`,
  stacked vertically on mobile (`flex-col items-center space-y-4 py-6`),
  horizontal on `lg+` (`lg:h-32 lg:flex-row lg:py-0`); left third is
  the copy, right two-thirds is the form.
- **Footer:** 4-col wrap (`flex flex-wrap`). First column (`w-full
  border-b ... lg:w-2/6`) is the editorial statement; the remaining
  three columns are equal-width `w-1/2 lg:w-3/12` / `lg:w-2/12` for
  main nav / secondary nav / social nav.
- **Vertical rhythm:** 4px baseline; sections are padded `py-6` /
  `py-12` / `py-16` (`24/48/64 px`) at the bottom of the grid, the
  pagination, and the newsletter band, respectively.
- **Two-up vs. three-up breakpoint detail:** the cards use the **same
  `col-span-6` / `col-span-4` math as the underlying 12-col grid**, so
  on `sm` the second card on each row has a 24px gap to the right edge
  (Tailwind `gap-x-6`), and on `lg` the third card aligns flush with
  the page gutter.

---

## Components

For each major component: purpose, anatomy, states, and any responsive
behavior observed. Six core components, each appearing 1 – 70 times per
page render.

### Header (`.HeaderDesktop` + `.HeaderMobile`)

Two parallel header trees, one per breakpoint. The desktop one is fixed;
the mobile one is fixed too and adds a circular hamburger button at
`top-3 right-4 z-60`. Both have the same internal anatomy: logotype on
the left (33% width on desktop, auto on mobile), nav in the middle (50%
desktop, hidden mobile), Sign-In CTA on the right (16% desktop,
hidden on mobile, replaced by hamburger).

- **Height:** `h-header` resolves to `4rem` (64px) on mobile, `7rem`
  (112px) on `lg+` (`.h-header{height:4rem}` then `lg:h-header{height:7rem}`).
  The fixed header uses `bg-white` with a 1px `border-b` (zinc-200).
- **Anatomy:**
  - `.Logotype` = `.Logo` (32/40px red filled disc) + the inline
    "Siteinspire" SVG wordmark.
  - `.HeaderDesktop__navigation` contains a `<nav aria-label="Main">`
    with a Radix horizontal nav-menu (`data-orientation="horizontal"`,
    `data-radix-collection-item`) of pill links: **Websites, Profiles,
    About, Subscribe** + a `<search>` form.
  - `.HeaderDesktop__cta` contains a single pill `.btn-primary` linking
    to `/signin` with a `lucide-user-round` icon and the label "Sign In".
  - Subscribe is rendered as a `<button aria-haspopup="dialog">` that
    opens a Radix dialog (likely the email-capture modal).
- **Search input (`.SearchForm`):** Tremor-raw pill input, `h-10`,
  `rounded-full`, `border-none`, `focus:ring-0`, with a leading
  `lucide-search` icon offset by `pl-9`. On mobile (`max-md:`) the
  input collapses to a 32px circular icon button that **expands to
  `w-48` on focus**, with a 200ms width transition (`transition-all
  ease-out`).
- **Behavior:** sticky (fixed at `top-0 z-50`), white background, no
  transparency swap on scroll. Behind the fixed header is an
  invisible `<div class="pointer-events-none fixed inset-0
  overflow-hidden" style="z-index: 51;">` for hosting dialog
  portalled contents.
- **Skip link:** an `.sr-only focus:not-sr-only` anchor `Skip to
  main content` is the first interactive element after the body.

### Hero (`.hero-desktop` / `.HeroMobile`)

A horizontally translating "Slideshow" of the six most recently
published featured sites, with absolutely positioned chevron
prev/next + a row of 6 pagination dots and a live caption.

- **Container (desktop):** `relative w-full overflow-x-hidden pb-14`
  inside `.lg:bg-zinc-100`. Padding-bottom reserves 56px for the
  bottom control row.
- **Slides (`.Slideshow__slide`):** `flex-[0_0_100%] lg:flex-[0_0_75%]`
  with internal `p-0 lg:p-6`. Each slide is a `<div class="@container
  flex flex-col bg-white">` — the white background forms the visible
  card frame; the screenshot lives inside, padded by 24px (desktop)
  or 0 (mobile, full-bleed).
- **Slide image (`.WebsiteThumbnail`):** `relative aspect-[16/10]
  w-full overflow-hidden rounded-sm bg-zinc-50`. The image is a
  Next.js `<Image fill priority>` (or `loading="lazy"` for slides
  2-6) with a `cdn-cgi/image/…/XnDXgrxNRj_P.jpg` srcset.
- **Slideshow track (`.Slideshow__slides`):** a `flex gap-x-6 lg:gap-x-8`
  row translated via inline `style="transform: translate3d(0px, 0px, 0px);"`
  — the JS slides it via the `Slideshow` client component (no
  `framer-motion`; pure transform).
- **Bottom controls (absolute, `right-0 bottom-0 left-0`):**
  - Pagination dots: 6× `.flex size-6 items-center justify-center
    rounded-full transition ease-out` buttons, each rendering a 4px
    child dot via `before:size-1 before:rounded-full before:bg-zinc-950`
    (active) or `before:bg-zinc-300 hover:before:bg-zinc-500` (rest).
    The dots overlap with `-space-x-3` so adjacent dots touch.
  - Caption: a single `text-sm text-zinc-600` truncated anchor
    (`max-w-[calc(100vw-14.5rem)] overflow-x-hidden overflow-ellipsis
    whitespace-nowrap`) to the current slide's `/website/<slug>`.
  - Prev / next: two `size-8 p-0 rounded-full bg-white` icon buttons
    with `lucide-chevron-left` / `lucide-chevron-right`.
- **Anatomy (mobile):** the H2 sits above the slide band in a 80px
  tall `.h-20` div, the slides live in a 100%-width strip wrapped in
  a `.bg-zinc-100` band that gives the mobile hero its background
  tint. The bottom controls are identical to desktop but pinned
  relative to the slide container.

### Filter (`.Filter`)

The most architecturally interesting component on the page. It is a
Radix `Tabs` (the markup shows `data-orientation="horizontal"`,
`role="tablist"`, `role="tabpanel"`, `data-state="active|inactive"`,
`hidden` attribute) with **5 tabs** but **only 1 visible category
list** rendered server-side; the other 4 panels (`-content-style`,
`-content-type`, `-content-subject`, `-content-platform`) are
present in the DOM as empty `<div hidden>` shells that the client
hydrates with the corresponding category list.

- **Tabs:** Popular Categories (active by default), Styles, Types,
  Subjects, Platforms. Each is a pill (`h-10 px-3.5 rounded-full`)
  using Tremor-raw styling. Active state: `!text-zinc-900`; rest:
  `!text-zinc-500`. Both have `hover:bg-zinc-100`.
- **Tab list behavior:** horizontally scrollable via
  `Filter__tabsScrollArea` which wraps a Radix Scroll Area viewport
  with `data-radix-scroll-area-viewport` (custom CSS hides the
  scrollbar: `scrollbar-width:none; -ms-overflow-style:none;
  ::-webkit-scrollbar{display:none}`).
- **Gradient fade mask:** `.Filter__tabsGradientMask` is an
  absolute-positioned 96px-wide (`w-24`) element on the right of the
  tab list with a 3-stop white-gradient: `from-0% from-white/0
  via-30% via-white to-white`. Visually fades out overflowing tabs.
- **Collapse toggle (`.Filter__toggleButton`):** a 32px `size-8
  p-0 rounded-full bg-zinc-100` button with a `lucide-chevron-up`
  icon, absolutely positioned at `top-7 max-lg:right-6 lg:-left-6`,
  that toggles the entire filter block's height. The container
  animates with `transition duration-300` and uses the
  `filter-fade-in` / `filter-fade-out` keyframes (200ms ease-out).
- **Category link (`.Filter__link`):** `inline-flex space-x-1 py-0.5
  text-base lg:py-1 md:text-lg lg:text-xl group relative transition
  ease-out hover:text-zinc-500` — a pill-less horizontal list of
  links. Each link has a hidden **count chip** that fades in on
  hover: `pointer-events-none absolute inset-y-0 -right-2 z-10 flex
  translate-x-full items-center bg-gradient-to-r from-white via-white
  to-transparent opacity-0 transition ease-out group-hover:opacity-100`
  containing a `.rounded-full bg-zinc-100 px-2 text-sm text-zinc-950
  lining-nums` chip with the integer count (e.g. "2,343").

### Website Card (`.WebsiteCard`)

The unit of the gallery. 70+ per page render.

- **Anatomy:**
  - Wrapper: `<article aria-label="Website card for <title>"
    class="WebsiteCard group @container">` (yes, `@container` is on
    the article, so the entire card sizes its inner mat from its own
    width).
  - `.WebsiteCard__image` (the screenshot) = `.WebsiteCard__imageWrapper
    block rounded bg-zinc-100 @2xs:p-6 @3xs:p-4 p-2` — the rounded
    zinc-100 mat that "frames" the screenshot, with container-query
    scaling of the inner padding.
  - `.WebsiteThumbnail relative aspect-[16/10] w-full overflow-hidden
    rounded-sm bg-zinc-50` — the 16:10 image well.
  - Image: a Next.js `<Image fill priority|loading="lazy"
    draggable="false" decoding="async">` with `class="WebsiteCard__image
    absolute inset-0 z-10 h-full w-full overflow-hidden rounded-sm
    object-cover object-top"`. The first card on the page uses
    `priority`, all others `loading="lazy"`. The alt text is the
    featured site's title.
  - `.WebsiteCard__toolbar` — an absolute-positioned row
    (`absolute right-10 bottom-10 z-20 @2xs:flex hidden space-x-2
    opacity-100 transition-opacity focus-within:opacity-100
    group-hover:opacity-100 lg:opacity-0`) of two icon buttons:
    bookmark (add to collection) and arrow-up-right (open external).
    On `lg+` the toolbar is `opacity-0` at rest and reveals on
    `:hover`/`:focus-within`. On mobile the toolbar is `opacity-100`
    always (no hover to trigger).
  - Toolbar buttons: 40px circles, `size-10 p-0 rounded-full
    bg-zinc-100 hover:bg-zinc-200/80`, tremor-raw, focus-visible
    ring-zinc-300.
  - `.WebsiteCard__caption` (`.WebsiteCaption`): a flex column with
    - `WebsiteCaption__title` (the project name link, `flex-1
      gap-x-2 transition-colors ease-out hover:text-zinc-500
      flex-row flex-wrap items-end pt-2`). It contains the project
      name span and a hidden-on-mobile relative date span
      (`@xs:block hidden text-zinc-500 <time datetime="…">a month
      ago</time>`).
    - `WebsiteCaption__selected` (an empty `div` reserved for the
      user's saved indicator, `relative top-3.5`).
    - `WebsiteCaption__credits` — present only on cards that have
      approved credits. A `flex flex-wrap space-x-1 text-sm
      text-zinc-500` row of profile links (e.g. "1/1 Studio", "View
      Source").
- **Ghost card (`.GhostCard`):** structurally identical to
  `.WebsiteCard` but used as a **sponsored ad slot** for Mobbin. It
  points to `https://mobbin.com/?utm_source=siteinspire&utm_medium=referral
  &utm_campaign=partnerships&ref=siteinspire`, has only the
  arrow-up-right toolbar (no bookmark), and is inserted into the grid
  in **specific breakpoints only** — `hidden sm:block lg:hidden` /
  `hidden lg:block 3xl:hidden` / `hidden 3xl:block` — so a Mobbin
  ghost card appears as the 2nd, 4th, and 6th card on 3-col / 3-col
  / 4-col respectively. The 7th card is the actual website; the
  5th-7th-9th cycle is consumed. (The visible Mobbin copy: "Mobbin —
  The world's largest mobile & web design reference library".)
- **Sizing:** cards have **no fixed width or height** — the
  `aspect-[16/10]` thumbnail defines the height. Each card's
  width is determined by the grid track. Card total height ≈
  `aspect-ratio width + 8px (image mat) + 24px (caption pt-2 + line
  height 1.25 × 0.875rem) + 4px (gap-y-1) + 20px (credit line, if
  shown)`.

### Subscribe dialog / `.NewsletterModule`

Two separate but related surfaces:

1. **Header Subscribe button** (a `lucide-mail`-less button) opens a
   Radix dialog (the markup references `aria-controls="radix-_r_5_"
   aria-haspopup="dialog" data-state="closed"`). The dialog content
   was not in the rendered DOM snapshot (portal-rendered, lazy).
2. **Footer-adjacent Newsletter band** is a
   `<section aria-label="Newsletter" class="border-t">` containing a
   `.NewsletterModule`. Stacked on mobile, side-by-side on `lg+`:
   - Left third: heading "Subscribe to Siteinspire Weekly" + subhead
     "Delivered every week, unsubscribe at any time." (the subhead is
     `.text-zinc-500`).
   - Right two-thirds: a `<form>` with an email input (Tremor-raw,
     `.rounded border px-3`, `focus:ring-1 focus:ring-zinc-200
     focus:border-zinc-500`) and a 40px circular submit button
     showing `lucide-arrow-right`.

### SearchForm (`.SearchForm`)

A small but distinctive component.

- **Anatomy:** a `<search>` element wrapping a `<form>` containing a
  Tremor-raw pill input with a left-aligned `lucide-search` icon
  (`absolute left-3 flex h-full items-center text-zinc-400
  dark:text-zinc-600 size-4 stroke-[1.5]`).
- **States:**
  - **Rest (desktop):** transparent background, `md:bg-transparent`,
    full 192px (`max-w-48`) width.
  - **Hover / focus:** background becomes `bg-zinc-50`, focus ring
    `focus:ring-zinc-200`.
  - **Mobile (max-md):** the form collapses to a 32px circular
    icon button (`max-md:w-8 max-md:pl-7`), and on focus the input
    smoothly expands to `w-48` (`max-md:focus:w-48`) with a 200ms
    ease-out width transition (`transition-all ease-out`).
- **Autocomplete:** `aria-autocomplete="list"`, `role="combobox"`,
  `aria-controls="search-suggestions"`, `aria-expanded="false"` —
  hooks up to a Radix Popover for live search suggestions.

### Pagination (`.WebsitePagePagination`)

- **Container:** a 12-col grid, content row offset
  `lg:col-span-8 lg:col-start-5 lg:px-6` (same left margin as the
  filter, by design).
- **Anatomy:** a `flex items-center justify-center gap-1 lg:justify-start`
  row containing:
  - **Prev chevron:** disabled `<button size-8 p-0 lg:size-10
    rounded-full>` with `lucide-chevron-left`.
  - **Page numbers 1–5** as pill anchors: each is `size-8 p-0
    lg:size-10 rounded-full` with text content "1" / "2" / "3" / "4" /
    "5", where the **active page** is `bg-zinc-900 text-white` and
    the **rest** are `bg-transparent text-zinc-900 hover:bg-zinc-100`.
  - **Next chevron:** an `aria-label="Next page" rel="next"` anchor
    (`size-8 p-0 lg:size-10 rounded-full bg-zinc-100 hover:bg-zinc-200/80`)
    with `lucide-chevron-right`, linking to `/websites/page/2`.
- All buttons are 32px on mobile, 40px on `lg+`.

### SiteFooter

- **Container:** `<footer class="border-t"><footer class="flex flex-wrap"
  data-testid="site-footer">` (yes, a nested `<footer>` — the outer
  is the divider, the inner is the content).
- **4 columns on `lg+` (collapses to 2 then 1 below `lg`):**
  1. **Statement column** (`w-full border-b ... lg:w-2/6`): "Siteinspire
     is a showcase of / the web's finest design + talent" in
     `.py-6 text-xl text-zinc-700 lg:py-12`.
  2. **Main nav** (`w-1/2 ... lg:w-3/12`): `aria-label="Main site
     navigation"` — Website Inspiration Gallery, Designer & Agency
     Profiles, About Siteinspire, Sponsorship & Advertising, Contact
     Us, Privacy Policy.
  3. **Secondary nav** (`w-1/2 ... lg:w-3/12`): Today's / This Week's /
     This Month's / This Year's Best Websites + Minimal website
     design + Portfolio website inspiration (the last two are
     `aria-hidden` for ad placement).
  4. **Social nav** (`w-1/2 ... lg:w-2/12`): Twitter, Instagram, Threads,
     Pinterest, Bluesky, LinkedIn. All `rel="noreferrer nofollow"
     target="_blank"`.
- **Typography:** `space-y-1` between items; links inherit body color
  (`#18181B`) and have no explicit hover state in the rendered HTML
  (it is presumably inherited from a global link rule).
- **No copyright line / no legal copy / no logo.** The footer is
  intentionally minimal.

### Toast region (notification portal)

A `<div role="region" aria-label="Notifications (F8)" tabindex="-1"
style="pointer-events:none">` containing a `<ol class="fixed top-0
left-1/2 z-[100] flex max-h-screen w-full -translate-x-1/2
flex-col-reverse gap-2 px-6 py-6 sm:max-w-[calc(32rem-1rem)]
lg:top-auto lg:bottom-0">` empty `<ol>`. Two such regions are
rendered (one is the Sonner toaster, one is likely a duplicate from
`next/script` boundaries). The Sonner-style position is centered
top on mobile, bottom on desktop.

### Not-found page (visible in the inline RSC payload)

`app/not-found.tsx` renders a single red circle (`<circle r="20"
fill="#ef4444">`), a "Page not found" H1, a one-line apology, and a
pill "Back to home" link to `/`. Background `#FAFAFA` (`#fafafa`),
text color `#18181B`, button `#18181B` / `color: white`,
`border-radius: 9999px`, `padding: 0.5rem 1.25rem`,
`font-size: 0.875rem`. This is the only place in the entire dump
where the brand mark is rendered as inline SVG instead of as a CSS
`div`.

---

## JavaScript & Libraries

The site is a Next.js 15 App Router app bundled with **Turbopack**
(`/_next/static/chunks/turbopack-0ds4u75t0~9r4.js` is in the
preload list). React 19 RSC is used end-to-end; the wire format
(`self.__next_f.push([1,"…"])`) is visible at the bottom of the
HTML. The chunk count is unusual — about **30 hashed JS chunks**
plus two `gtm*.js` files, suggesting a heavy App Router page with
many code-split client components (Slideshow, Filter, WebsiteCard,
SearchForm, etc.). All chunks carry the
`?dpl=dpl_DtoopQ2DijArR1nz4M1N5fQbxezj` deploy parameter so they
are cache-busted together.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| **Next.js** | 15.x with Turbopack | `_next/static/chunks/turbopack-0ds4u75t0~9r4.js`, all `?dpl=dpl_…` URLs, `next-size-adjust` meta, `next-route-announcer` element | App Router, RSC, Turbopack |
| **React** | 19 (RSC) | RSC wire format in `__next_f` payloads, `Suspense` boundary IDs | Server + client components |
| **React DOM** | 19 | `react-dom` references in `0k0r_xml3et58__17c2516d.js` (426 KB) | The big client runtime chunk |
| **Tailwind CSS** | 3.x | 134 KB of utility classes in `0usi_7_-x8q-f__ae5f3e3b.css`, JIT-generated | With `@tailwindcss/container-queries` plugin |
| **Radix UI** (Primitives) | n/a | `data-radix-collection-item`, `data-radix-scroll-area-viewport`, Radix dialog markup | Tabs, Scroll Area, Popover, Dialog, Toast |
| **Tremor Raw** | n/a | `tremor-id="tremor-raw"` on every button / input | Used as a design-system layer for the buttons, search input, newsletter input, pagination |
| **Lucide Icons** | n/a | `<svg class="lucide lucide-search …">` etc., 9 distinct icons observed | Outline only, `stroke-width="1.5"` |
| **class-variance-authority (cva)** | n/a | `class-variance` token in `0-ajut6-ljmdo`, `0r~dq55z9eipj`, `114zkfe7kw00..`, `133sljux6t-m6` | Powers Tremor-raw button variants |
| **Zod** | n/a | `zod` token in `0l5rtyazshazq`, `0s2hyx.17kwkd`, `133sljux6t-m6` | Schema validation for forms / search |
| **Sonner** (toast) | n/a | `sonner` / `ToastProvider` markers in `004bb3qb60u6q` | Powers the two empty notification regions in the body |
| **Google Tag Manager** | n/a | `googletagmanager.com/gtm.js?id=GTM-5CCMLTM`, the `gtm__a09c7967.js` 401 KB chunk | Loaded via `next/script` (`GoogleTagManager` client component) |
| **Google Analytics 4** | n/a | `googletagmanager.com/gtag/js?id=G-99WREMZRTC` | Loaded async, separate from GTM |
| **Universal Analytics (legacy)** | n/a | `google-analytics.com/analytics.js` | Still on the page (likely dormant) |
| **PostHog** | n/a | `posthog` / `PostHogProvider` token in `004bb3qb60u6q`, `0gfbppj64mvex` | Product analytics; uses `CSPostHogProvider` wrapper |
| **Sentry** | n/a | `sentry` token in `0gfbppj64mvex`, `0k0r_xml3et58`, `0ovsb~pali52m` | Error monitoring (likely via `@sentry/nextjs`) |
| **Shopify Buy SDK** | n/a | `shopify` token in `gtm__a09c7967`, `js__0564040e` | Probably for the "Shop" sub-nav (Sponsorship merch) — not observed on this surface |
| **Lighthouse (Next.js Speed Insights)** | n/a | `Lighthouse` token in `08sqa9whi2_.z`, `0gfbppj64mvex` | Next.js built-in Web Vitals reporter |

Notable **non-presence** in the dump: no `gsap`, no `framer-motion`
(only `framerAppearId` appears in `04-i.k5.tpclt` as a string —
that file is the **View Transitions API** polyfill, not framer),
no `three.js`, no `lottie`, no WebGL, no GSAP ScrollTrigger, no
Swup / Barba / PJAX, no animation timeline library. The
**only motion on the page is CSS transforms + the View Transitions
API** for category-list fade-in/out.

Detected version strings (likely from chunk hash inputs):
`"0.0.0"`, `"1.0.0"`, `"10.49.0"`, `"1.369.2"`, `"16.2.6"`, `"2.8.9"`,
`"4.3.0"`. The `"1.369.2"` is consistent with **Next.js 15.x**.

---

## Animations (Catalog)

A specific catalog of every animation observable in the dump. There
are no JavaScript animation libraries; every motion is either a CSS
`@keyframes` rule, a CSS `transition`, a CSS View Transition, or
inline `transform: translate3d()` on the Slideshow track.

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `accordion-down` | `playwright/css/0usi_7_-x8q-f__ae5f3e3b.css:1` (minified single line) | `0.2s` | `ease-out` | Radix Accordion open |
| `accordion-up` | same | `0.2s` | `ease-out` | Radix Accordion close |
| `dots-fade` | same | `1.25s` | `ease-in-out infinite` | Three-dot loading indicator (Sonner toaster / Suspense fallback) |
| `enter` | same | inherits `--tw-enter-*` vars | inherits | Radix `data-state="open"` enter transition |
| `exit` | same | inherits `--tw-exit-*` vars | inherits | Radix `data-state="closed"` exit transition |
| `filter-fade-in` | same | `0.2s` (`ease-out 0.1s both`) | `ease-out` | CSS View Transition `::view-transition-new(.filter-fade)` |
| `filter-fade-out` | same | `0.2s` (`ease-out both`) | `ease-out` | CSS View Transition `::view-transition-old(.filter-fade)` |
| `pulse` | same | `2s` | `cubic-bezier(0.4, 0, 0.6, 1) infinite` | Tailwind `animate-pulse` (used as the ghost-card loading shimmer) |
| `spin` | same | `1s` | `linear infinite` | Tailwind `animate-spin` (Sonner loading spinner) |

### CSS transitions (selective, with their actual `property / duration / timing`)

| What | Property | Duration | Timing | Trigger |
| --- | --- | --- | --- | --- |
| Tremor-raw button | `color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter, backdrop-filter` | `0.1s` (`duration-100`) | `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out) | All Tremor buttons |
| Tremor-raw button | same | `0.1s` | `ease-in-out` | All Tremor buttons |
| Header search (mobile expand) | `all` | inherits `0.2s` | `ease-out` | `max-md:focus:w-48` |
| Card toolbar | `opacity` | inherits `0.15s` | `ease-in-out` | `group-hover:opacity-100` |
| Category link color | `color` | inherits | `ease-out` | `hover:text-zinc-500` |
| Category count chip | `opacity` | inherits `0.15s` | `ease-out` | `group-hover:opacity-100` |
| Slideshow dot | `background-color` (on `::before`) | inherits | `ease-out` | `hover:before:bg-zinc-500` |
| Filter container | `all` | `0.3s` (`transition duration-300`) | `ease-out` | Toggle filter collapse |
| Card image lazy load | `opacity` | `0.5s` (`duration-500`) | `ease-out` | `transition-opacity duration-500` (`.not-loaded` → loaded) |
| Logo (mobile → desktop) | `transition ease-out` | inherits | `ease-out` | `size-8 lg:size-10` resize |

### View Transitions

The Filter block opts into the CSS View Transitions API for its
expand/collapse. The relevant rules (from the main CSS):

```css
::view-transition-old(.filter-fade) {
  animation: .2s ease-out both filter-fade-out;
}
::view-transition-new(.filter-fade) {
  animation: .2s ease-out .1s both filter-fade-in;
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-new(.filter-fade) { animation: none; }
  ::view-transition-old(.filter-fade) { animation: none; }
}
```

The page does not wrap the Slideshow in a View Transition — that
uses inline `transform: translate3d(0px, 0px, 0px)` on
`.Slideshow__slides`, driven by a `Slideshow` client component that
is not part of the public API.

### Page transitions

There is no Next.js `app/template.tsx` crossfade. Server-rendered
route changes are instant. The `<next-route-announcer>` is present
(`<next-route-announcer style="position: absolute;">` in the body)
for screen-reader route announcements.

### Reduced motion

The site respects `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *,:after,:before {
    scroll-behavior: auto;
    transition-duration: .01ms;
    animation-duration: .01ms;
    animation-iteration-count: 1;
  }
  ::view-transition-old(.filter-fade) { animation: .2s ease-out both filter-fade-out; }
  ::view-transition-new(.filter-fade) { animation: .2s ease-out .1s both filter-fade-in; }
}
```

The `*` rule collapses every transition and animation to 0.01ms.
The View Transitions are kept (they are essential to the filter
collapse, not decorative).

---

## Assets

The dump contains **28 hero/grid JPEG screenshots** of featured
sites, **1 PNG** (the Mobbin ghost placeholder), **1 GA-audiences
pixel** (42 bytes), **8 Scto Grotesk A `.woff2` font files**, **2
CSS files**, and **30+ JS chunks** (one is the big 426 KB React-DOM
runtime, the others are 2-200 KB route / component chunks). The
`html/`, `js/`, `css/`, `fonts/`, `images/`, `svgs/`, `models/`,
`media/`, `other/` folders at the top level of the dump are all
empty because the static fetch was blocked; the equivalents live
under `playwright/`.

### 3D models

N/A — no 3D assets observed in the dump. (`tools/tmp/siteinspire/models/`
is empty.)

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Scto Grotesk A | 300 (Light) | woff2 | `playwright/fonts/SctoGroteskA_Light-s.p.01zonam8llpy_.woff2` (32.5 KB) | yes, via `next/font/local` |
| Scto Grotesk A | 300 (Light Italic) | woff2 | `playwright/fonts/SctoGroteskA_LightItalic-s.p.170.t43p9y-4s.woff2` (34.2 KB) | yes |
| Scto Grotesk A | 400 (Regular) | woff2 | `playwright/fonts/SctoGroteskA_Regular-s.p.03nl7wz5loha..woff2` (29.7 KB) | yes |
| Scto Grotesk A | 400 (Regular Italic) | woff2 | `playwright/fonts/SctoGroteskA_RegularItalic-s.p.07eaqw--mhbvi.woff2` (31.3 KB) | yes |
| Scto Grotesk A | 500 (Medium) | woff2 | `playwright/fonts/SctoGroteskA_Medium-s.p.0d1pl28z0d_z5.woff2` (34.0 KB) | yes |
| Scto Grotesk A | 500 (Medium Italic) | woff2 | `playwright/fonts/SctoGroteskA_MediumItalic-s.p.0wz27hx-s1zkt.woff2` (35.7 KB) | yes |
| Scto Grotesk A | 700 (Bold) | woff2 | `playwright/fonts/SctoGroteskA_Bold-s.p.15evuykpjfzh9.woff2` (33.9 KB) | yes |
| Scto Grotesk A | 700 (Bold Italic) | woff2 | `playwright/fonts/SctoGroteskA_BoldItalic-s.p.133zaax9ef2w4.woff2` (35.6 KB) | yes |

Total: 8 woff2 files, ~267 KB, all served from
`/_next/static/media/SctoGroteskA_*.woff2?dpl=…`. All 8 are
preloaded in the `<head>` with `as="font" crossorigin=""` and
listed in a Tailwind-typography-compatible `font-display: swap`
`@font-face` block (in
`playwright/css/00ok5g~2ojer3__5010027d.css`). A **fallback
family** "fontSctoGroteskA Fallback" is generated with
`ascent-override: 91.2%; descent-override: 21.57%;
line-gap-override: 23.81%; size-adjust: 102.53%; src: local(Arial)`
to prevent layout shift before the woff2 loads.

The full font CSS variable is `--font-scto: "fontSctoGroteskA",
"fontSctoGroteskA Fallback"`, used as
`font-family: var(--font-scto), ui-sans-serif, system-ui, sans-serif, …`.

### Images

All gallery images are **Cloudflare Image Resizing transformations**
of source JPEGs stored in the Siteinspire R2 bucket, served from
`r2.siteinspire.com/cdn-cgi/image/`. The transform parameters
observed are `width`, `height`, `quality=75`, `format=auto`,
`metadata=none`, `gravity=top`, `fit=crop`, `compress=true`. The
16:10 card thumbnails use four sizes: 384×240, 640×400, 960×600,
1920×1200. The hero slideshow uses 640×400, 960×600, 1920×1200.
All serve AVIF or WebP based on the Accept header. Every
`<img>` has the same `class="WebsiteCard__image absolute inset-0
z-10 h-full w-full overflow-hidden rounded-sm object-cover
object-top"`.

| Local dump path | Type | Approx. dims | Bytes | Source URL (transform) | Notes |
| --- | --- | --- | --- | --- | --- |
| `playwright/images/00UBSte0ECdc__0733e543.jpg` | JPEG | 640×400 | 11,904 | `https://r2.siteinspire.com/cdn-cgi/image/width=1920,height=1200,…/00UBSte0ECdc.jpg` | Julia Noni (hero + grid) |
| `playwright/images/3ZW200ZOUC77__9050ae30.jpg` | JPEG | 640×400 | 41,143 | `…/3ZW200ZOUC77.jpg` | Merit |
| `playwright/images/88TDtNsAQHeI__9f50a83a.jpg` | JPEG | 640×400 | 8,420 | `…/88TDtNsAQHeI.jpg` | CHIMI |
| `playwright/images/A8pbRGpdhIRL__0bcd06cd.jpg` | JPEG | 640×400 | 10,453 | `…/A8pbRGpdhIRL.jpg` | GT Mechanik |
| `playwright/images/AmWDH5j7xJ_5__7c4f0244.jpg` | JPEG | 640×400 | 16,202 | `…/AmWDH5j7xJ_5.jpg` | Coutumes |
| `playwright/images/D0zR8mVokiV6__2f2a55aa.jpg` | JPEG | 640×400 | 8,809 | `…/D0zR8mVokiV6.jpg` | Floema |
| `playwright/images/Epl3PFuPn18O__29b52a09.jpg` | JPEG | 640×400 | 22,200 | `…/Epl3PFuPn18O.jpg` | Spots Travel |
| `playwright/images/HwprD1upwvV9__dd0bcf6c.jpg` | JPEG | 640×400 | 11,619 | `…/HwprD1upwvV9.jpg` | Semaloop |
| `playwright/images/IWb7iisvGgbh__78aa8640.jpg` | JPEG | 640×400 | 21,645 | `…/IWb7iisvGgbh.jpg` | Conversation Design |
| `playwright/images/L2mu_Unr-Bcx__70c9264f.jpg` | JPEG | 640×400 | 8,187 | `…/L2mu_Unr-Bcx.jpg` | Obys Agency |
| `playwright/images/MYFn-5H3Y8Vj__25f85c57.jpg` | JPEG | 640×400 | 17,571 | `…/MYFn-5H3Y8Vj.jpg` | Field Studies Flora |
| `playwright/images/MuwqJLO8dD9h__8209cd0c.jpg` | JPEG | 640×400 | 34,927 | `…/MuwqJLO8dD9h.jpg` | (one of the 70+ cards) |
| `playwright/images/NVvtsdZiuW93__f303c60c.jpg` | JPEG | 640×400 | 17,327 | `…/NVvtsdZiuW93.jpg` | Old Tom Capital |
| `playwright/images/TiZi2cX59GKP__bb8721c9.jpg` | JPEG | 640×400 | 32,288 | `…/TiZi2cX59GKP.jpg` | Daylight |
| `playwright/images/WM9z7120kFaT__d3b0834a.jpg` | JPEG | 640×400 | 22,748 | `…/WM9z7120kFaT.jpg` | Daniel Blue |
| `playwright/images/WNqJWYFrLpHN__ee82dca4.jpg` | JPEG | 640×400 | 10,244 | `…/WNqJWYFrLpHN.jpg` | Fabio Caverzasio |
| `playwright/images/X6D4Q2xlYN9d__7551e458.jpg` | JPEG | 640×400 | 33,530 | `…/X6D4Q2xlYN9d.jpg` | (one of the 70+ cards) |
| `playwright/images/XD9Dm-c9cd_w__c4247afe.jpg` | JPEG | 640×400 | 6,609 | `…/XD9Dm-c9cd_w.jpg` | KÖPPEN |
| `playwright/images/XnDXgrxNRj_P__a6dcd6ab.jpg` | JPEG | 640×400 | 11,542 | `…/XnDXgrxNRj_P.jpg` | Squarespace Foundations (first card, priority preload) |
| `playwright/images/_qer4ISfWxpG__ee744909.jpg` | JPEG | 640×400 | 17,469 | `…/_qer4ISfWxpG.jpg` | Small Talk Studio |
| `playwright/images/aHvMoiN02tPg__47897942.jpg` | JPEG | 640×400 | 18,155 | `…/aHvMoiN02tPg.jpg` | Corentin Bernadou |
| `playwright/images/bbrLR855I-kJ__c3bd6b12.jpg` | JPEG | 640×400 | 56,033 | `…/bbrLR855I-kJ.jpg` | HappyRobot |
| `playwright/images/fDO3BAIEy58u__fb14e966.jpg` | JPEG | 640×400 | 25,868 | `…/fDO3BAIEy58u.jpg` | AI in Design Report 2026 |
| `playwright/images/pCWEymxk94dI__cb4e38e5.jpg` | JPEG | 640×400 | 6,882 | `…/pCWEymxk94dI.jpg` | Mammoth Brands |
| `playwright/images/qlbc8OVU6LYB__3442433f.jpg` | JPEG | 640×400 | 14,658 | `…/qlbc8OVU6LYB.jpg` | Dash Burger |
| `playwright/images/yaZw-iZLKAk0__7de0272a.jpg` | JPEG | 640×400 | 29,280 | `…/yaZw-iZLKAk0.jpg` | High Society |
| `playwright/images/zeM70mC1njfN__e2bccf24.jpg` | JPEG | 640×400 | 22,563 | `…/zeM70mC1njfN.jpg` | CÉNÉE |
| `playwright/images/mobbin-ghost__32144e94.png` | PNG (greyscale ghost) | unknown | 17,882 | `…/mobbin-ghost.png` | The sponsored placeholder for Mobbin |
| `playwright/images/ga-audiences__23ac5c5b` | text/plain (1-line "0") | n/a | 42 | `https://www.google-analytics.com/ga-audiences?v=1&aip=1…` | Google Ads audience pixel |

All 28 JPEGs share the same physical dimensions (640×400 in the
cached variant). The original (pre-transform) images are 2880×1800
per the `websiteAssets[0].asset.width/height` in the RSC payload
("XnDXgrxNRj_P.jpg" = 2880×1800, 68,731 bytes). They are captured
by a tool called `shotter` (visible in the payload's
`capturedWith:"shotter"`) and stored with the dimension parameter
`?ar=16/10` to signal the aspect ratio to the loader.

### SVGs & icons

- **Inline SVGs observed in HTML:** the Siteinspire wordmark
  (`viewBox="0 0 280 58"`, 12 paths, Medium weight, 16/20 px
  rendered height) appears **4 times** in the rendered DOM
  (twice in `HeaderDesktop`, twice in `HeaderMobile`, plus a
  not-found fallback).
- **Standalone SVG files in dump:** the icon at `/favicon.svg` is
  referenced but not captured; the `/icon-xg4ifa.svg?icon.0vjcfb56z9irn.svg`
  variant is also referenced for app icons.
- **Icon system:** Lucide Icons (outline, 1.5px stroke, 16px
  rendered), inlined as 8 named SVGs in the rendered DOM:
  `lucide-search`, `lucide-menu`, `lucide-user-round`,
  `lucide-chevron-up`, `lucide-chevron-left`, `lucide-chevron-right`,
  `lucide-bookmark`, `lucide-arrow-up-right`, `lucide-arrow-right`.
- **Inline SVGs in 404 page:** a red 40px filled circle (brand
  glyph rendered as inline `<circle r="20">` inside a 40×40 viewBox
  SVG, used only on the not-found route).
- **App icons:** `/apple-icon-xg4ifa.png?apple-icon.0.ilr38shmn5u.png`
  (180×180) referenced.

### Audio & video

N/A — no audio or video assets observed in the dump.
(`tools/tmp/siteinspire/media/` is empty; the rendered DOM has no
`<video>` or `<audio>` tags.)

### Other dump files

- `playwright/other/about__*` (4 files, 561 B – 17 KB): RSC payload
  fragments for the `/about` route (not used to write this spec but
  included for completeness).
- `playwright/other/websites__4690727b` (1,947 B): RSC fragment for
  `/websites` index.
- `playwright/other/profiles__*` (2 files, 2,074 / 4,074 B): RSC
  fragments for `/profiles`.
- `playwright/other/signin__47cdecce` (1,799 B): RSC fragment for
  `/signin`.
- `playwright/other/collect__*` (2 files, 1 / 3 B): tiny ping
  payloads for the user's "collections" feature.
- `playwright/other/category/<slug>__*` (4 files): RSC fragments
  for `/websites/category/{unusual-layout, agencies-and-consultancies,
  grid-layout, use-of-animation, fashion, web-and-interactive-design}`.
- `playwright/other/13464-museum-department__*` and
  `13459-corentin-bernadou__*`: RSC fragments for two detail pages.
- `playwright/other/monitoring__*` (2 B): PostHog / Sentry heartbeat
  ping.

---

## Motion & Interaction

### Principles

- **Default easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's
  default `ease-in-out`) for all Tremor-raw buttons; `ease-out` for
  micro-interactions on the cards and header search; `cubic-bezier(0,
  0, 0.2, 1)` (Tailwind's `ease-out`) for some long-press-style
  transitions; `linear` for spinners and the Slideshow track.
- **Default durations:** 100 ms (button micro-states), 150 ms
  (opacity crossfades on hover), 200 ms (filter collapse, search
  expand, View Transitions), 300 ms (filter container height), 500 ms
  (image lazy-load opacity).
- **Motion is reserved, not decorative.** The only page-level
  motion is the Slideshow translate (which has no autoplay — the
  user must tap the chevrons or dots). The dot hover-fade is a 4px
  child element. The card toolbar fade is a simple opacity swap.
  The filter expand/collapse uses the View Transitions API. There
  are no infinite animations, no marquees, no scrolling tickers, no
  parallax, no scroll-jacking, no reveal-on-scroll.

### Specific behaviors

- **Link hover:** `transition-colors ease-out` on every `WebsiteCaption__title`
  and `Filter__link`, color shifts from `text-zinc-900` →
  `text-zinc-500`. No underline. The credit byline (`WebsiteCaption__credits a`)
  shifts `text-zinc-500` → `text-zinc-700` on hover.
- **Button press:** Tremor-raw buttons do **not** scale on press;
  they only color-shift on hover and show a 1px focus ring on
  `:focus-visible`.
- **Slideshow advance:** the `.Slideshow` client component mutates
  the inline `style="transform: translate3d(<delta>px, 0, 0);"` on
  the `.Slideshow__slides` flex row. The transition duration is
  inherited from `.Slideshow__slides` (a CSS transition of
  `transform` with the page default ~200-300ms).
- **Card image lazy load:** when an `<img>` is below the fold it
  starts with `class="… transition-opacity duration-500 not-loaded
  opacity-0"`. When the load event fires, the `not-loaded` class
  is removed and the image crossfades from 0 to 1 opacity over
  500ms ease-out. If the load is fast, the transition is barely
  visible; if slow, the zinc-50 background mat of the
  `WebsiteThumbnail` shows through.
- **Card toolbar reveal (desktop):** the toolbar is `lg:opacity-0`
  at rest and `group-hover:opacity-100` on hover, with a focus-within
  rule so keyboard users can still reach the bookmark / external
  link buttons. The transition is `transition-opacity` at 100-150ms.
- **Header search expand (mobile):** the input starts as a 32px
  circle (`max-md:w-8 max-md:pl-7`). On `:focus` it transitions
  width to `w-48` with a 200ms ease-out width transition, and the
  placeholder becomes visible. On blur it collapses back to 32px.
- **Filter category chip reveal:** the count chip
  (e.g. "2,343") lives in an absolutely-positioned
  `pointer-events-none` div with `opacity-0` at rest and
  `group-hover:opacity-100` on hover. The translate-x-full
  → translate-x-0 transform creates a horizontal slide-in from the
  right of the link.
- **Slideshow dot state:** each dot is a 24px transparent circle
  containing a `::before` pseudo (`size-1 rounded-full`) that
  is `bg-zinc-950` when active and `bg-zinc-300` → `bg-zinc-500`
  on hover for the rest. The dot itself is click-only; the whole
  24px circle is the touch target.
- **Skip link:** the first focusable element is a
  `Skip to main content` anchor that is `sr-only` at rest and
  becomes a fixed top-left pill (`focus:fixed focus:top-4
  focus:left-4 focus:z-[200] focus:rounded focus:bg-white
  focus:px-4 focus:py-2 focus:font-medium focus:text-zinc-900
  focus:shadow-lg focus:ring-2 focus:ring-zinc-900`) on focus.
- **Not-found page:** the 404 route renders inline-styled HTML
  (no Tailwind) with a red circle, an H1 in `#18181B`, a body
  paragraph in `#71717A`, and a pill back-to-home link with
  `border-radius: 9999px`, `padding: 0.5rem 1.25rem`,
  `background-color: #18181B`, `color: white`,
  `font-size: 0.875rem`. No animation.

### Reduced motion

Already covered above. In short: all CSS `transition-duration` and
`animation-duration` collapse to `0.01ms` site-wide, with two
exceptions — the View Transitions on the filter are kept
(replaced with a 0ms `none` declaration, not removed), and any
explicit `transition: none` overrides are honored.

---

## Content & Voice

- **Tagline (H1 desktop):** "A showcase of the web's finest design + talent"
  (with `+` rendered literally, not as the type-design plus sign).
- **Tagline (H2 mobile):** same text, centered.
- **Meta description:** "Discover the best website designs and web
  design inspiration. A curated showcase of creative websites,
  updated daily." (paraphrased from `<meta name="description">`).
- **Meta keywords:** `design, development, agencies, freelancers, web
  design, web development, design inspiration, web design
  inspiration, web development inspiration, design agencies,
  development agencies, freelancer agencies`.
- **Filter labels:** five tab labels, sentence case, no
  punctuation: "Popular Categories", "Styles", "Types", "Subjects",
  "Platforms".
- **Category labels:** title case ("Big Type", "Use of Animation",
  "Minimal", "Unusual Layout", "Horizontal Layout", "E-Commerce"
  with hyphen, "Web & Interactive Design" with ampersand).
- **Card caption:** the project name is plain text, the date is
  presented in two forms: an ISO `<time datetime="2026-05-15T11:19:28.863Z">`
  for machine readers, and a friendly relative phrase ("a month ago",
  "3 days ago", etc.) for humans.
- **CTA vocabulary:** "Sign In" (header), "Subscribe" (header dialog
  + footer band heading "Subscribe to Siteinspire Weekly"). No
  other imperative CTA verbs on the page — there is no "Get
  started", "Learn more", "Read more", "Visit site" link; the
  external-link `lucide-arrow-up-right` button is unlabeled other
  than the `aria-label="Visit <title> website"`.
- **Tone:** the **only** person-facing copy on the page is the
  H1, the "a month ago" timestamps, the filter count chips, the
  newsletter heading and subhead, the footer statement, and the
  page numbers. Everything else is the featured project's own
  title and a tooltip-style `aria-label`. The site is **content-
  first**: it gets out of the way of the screenshots. The
  voice is muted, confident, curatorial, British-English-aware
  ("colourful" not "colorful" in category names; "Categorised" if
  present; "organised" in the Greyscale description).
- **Capitalization:** Title Case for category names, sentence case
  for nav links and the H1.
- **Punctuation:** ampersand in "Design & Art Direction", "Fashion
  & Apparel"-style category names; "Web & Interactive Design" with
  a space-amp-space; em-dash not observed in body copy.
- **Number formatting:** the count chips use the US-style comma
  separator ("2,343" not "2.343") and `font-variant-numeric:
  lining-nums` so the digits sit on the cap-height baseline.

---

## Information Architecture

Top-level routes observed, with one-line purpose and the primary
component on each.

- `/` — **homepage**. Hero slideshow + tabbed category filter +
  3-up website grid + pagination + newsletter band + footer.
  Primary component: `WebsiteCard` (×70+).
- `/websites` — full index. Reachable via the header "Websites" nav
  link and via "Website Inspiration Gallery" in the footer. Uses
  the same grid + filter as `/` (the homepage is the first page of
  `/websites`).
- `/websites/page/2`, `/3`, `/4`, `/5` — pagination. Each page is
  ~14 website cards. Currently the index has at least 5 pages.
- `/websites/category/<slug>` — category landing pages. The slug
  corresponds to one of the 81 categories observed
  (`agencies-and-consultancies`, `typographic`, `design-and-art-
  direction`, `portfolio`, `web-and-interactive-design`,
  `e-commerce`, `fashion`, `minimal`, `grid-layout`,
  `unusual-layout`, `art`, `use-of-animation`, etc.). Each lists
  all featured sites tagged with that category.
- `/websites/popular/today` | `/week` | `/month` | `/year` — most
  popular ranked lists, exposed in the footer secondary nav.
- `/website/<id>-<slug>` — detail page for a single featured site
  (e.g. `/website/13465-squarespace-foundations`,
  `/website/13459-corentin-bernadou`). RSC fragment observed in
  the dump.
- `/profiles` — designer / agency profile index. RSC fragment
  observed.
- `/profile/<id>-<slug>` — single profile page (e.g.
  `/profile/4763-1-slash-1-studio`, `/profile/621-numbered`,
  `/profile/6256-view-source`, `/profile/799-index-studio`).
- `/about` — about page. RSC fragment observed. Linked from the
  footer main nav and the header "About" link.
- `/sponsorship` — sponsorship & advertising info. Linked from
  the footer main nav.
- `/signin` — auth entry. RSC fragment observed. Linked from the
  header Sign-In CTA (`data-testid="signin-button"`).
- `/search?query=<term>` — search results. Linked from the Search
  form (`SearchAction` schema). The Schema.org search target
  template is `https://www.siteinspire.com/search?query=
  {search_term_string}`.
- `/privacy` — privacy policy. Linked from the footer main nav.
- `mailto:mail@siteinspire.com` — "Contact Us" mailto.
- `/websites/feed` — RSS feed (`<link rel="alternate"
  type="application/rss+xml" title="Siteinspire RSS Feed">`).
- `/favicon.svg`, `/icon-xg4ifa.svg`, `/apple-icon-xg4ifa.png` —
  favicon + app-icon.

The information architecture is **flat and shallow**: every page
in the main flow is at most one click from `/`. The exception is
the per-website detail page (`/website/<id>-<slug>`), which is one
click from a grid card. There is no `/blog`, no `/changelog`, no
`/pricing` — Siteinspire is a free, curated, community-supported
gallery, not a commercial product.

---

## Accessibility

- **Color contrast:** measured on the observed surface (the homepage
  rendered at desktop 1440×900, with the body class
  `bg-white text-zinc-900 antialiased`):
  - `text-zinc-900` (`#18181B`) on `bg-white` (`#FFFFFF`): **17.4:1**,
    AAA for all sizes.
  - `text-zinc-500` (`#71717A`) on `bg-white`: **4.6:1**, AA for
    body ≥18px / AAA for large text. Used for "a month ago",
    credit bylines, and the "Squarespace Foundations" caption
    under the Slideshow. Legible but on the lower end of AA.
  - `text-zinc-400` (`#A1A1AA`) on `bg-white`: **3.0:1**, used
    for the search icon. Decorative-only, so non-text contrast
    rules apply — passes the 3:1 UI-component minimum.
  - `text-white` on `bg-zinc-900`: **17.4:1**, AAA.
  - Pagination active `text-white` on `bg-zinc-900`: AAA.
  - Category hover `text-zinc-500` on `bg-white`: same 4.6:1.
- **Focus indicators:** all interactive elements have a visible
  `:focus-visible` outline (`outline-0 outline-offset-1
  focus-visible:outline-1 outline-zinc-300`) AND/OR a 1-2px ring
  (`focus:ring-1 focus:ring-zinc-200`, `focus:ring-zinc-200
  focus:dark:ring-zinc-700/30`, `focus-visible:ring-2
  focus-visible:ring-zinc-950 focus-visible:ring-offset-2`). The
  ring is never removed; it is the only way keyboard users can
  tell where they are.
- **Keyboard:** every link, button, and form control is a real
  `<a>`, `<button>`, or `<input>` — no `onClick` on a `div`.
  Logical tab order: skip-link → header logo → header nav links
  → search input → sign-in CTA → hero H1 (not focusable, but
  visible) → slideshow dots → slideshow caption link → prev /
  next → filter collapse toggle → filter tabs → category links →
  page numbers → newsletter input → newsletter submit → footer
  links.
- **Skip link:** a `.sr-only focus:not-sr-only focus:fixed
  focus:top-4 focus:left-4 focus:z-[200] focus:rounded
  focus:bg-white focus:px-4 focus:py-2 focus:font-medium
  focus:text-zinc-900 focus:shadow-lg focus:ring-2
  focus:ring-zinc-900` anchor is the first focusable element.
  It targets `#main-content`.
- **Screen reader landmarks:** the page has `<header>` (×2,
  desktop + mobile), `<main id="main-content">`, `<section
  aria-label="Newsletter">`, `<footer>`, `<nav aria-label="Main">`
  (twice — desktop + mobile), `<nav aria-label="Main site
  navigation">`, `<nav aria-label="Secondary site navigation">`,
  `<nav aria-label="Social media links">`, `<search>`, and two
  `<div role="region" aria-label="Notifications (F8)">` for the
  Sonner toaster. The Slideshow uses `aria-label="Previous slide"`
  / `aria-label="Next slide"` and `aria-label="Go to slide N"`
  on the dots. The Filter is a Radix Tabs with proper
  `role="tablist"`, `aria-selected`, `aria-controls`, and
  `aria-labelledby`.
- **Image alt text:** every `<img>` in the grid has its alt set to
  the featured site's title (e.g. `alt="Corentin Bernadou"`,
  `alt="Squarespace Foundations"`, `alt="Mammoth Brands"`). The
  Slideshow thumbnails have the same convention. The logo
  wordmark SVG has `<title>Siteinspire</title>` and a
  `role="img"` (implicit).
- **Live regions:** the `<time>` element on each card has
  `suppressHydrationWarning` (Next.js artifact) and contains a
  plain "a month ago" string. The Slideshow updates the
  `<a class="… overflow-x-hidden overflow-ellipsis">` caption
  inline; there is no `aria-live` on the Slideshow itself, which
  is a small a11y gap.
- **Motion:** reduced-motion handling is correctly applied
  site-wide (see Motion section).
- **Disabled state styling:** the prev chevron on page 1 of
  pagination is `disabled=""` and Tremor-raw disabled styles
  collapse it to `text-zinc-400 bg-transparent
  hover:bg-transparent pointer-events-none shadow-none`.
- **No `aria-hidden` abuse:** the inline "Siteinspire" text
  beside the SVG wordmark is `aria-hidden="true" tabindex="-1"`
  to avoid duplicate announcements.

---

## Sources

Every URL actually opened while writing this spec. The dump itself
is the source of truth; the live URLs are listed for completeness
and are not required reading.

- Homepage — https://www.siteinspire.com/ (via the dump's
  `playwright/homepage.html`)
- Homepage desktop screenshot —
  `tools/tmp/siteinspire/playwright/homepage.png` (92 KB, viewport)
- Homepage full-page screenshot —
  `tools/tmp/siteinspire/playwright/homepage-fullpage.png` (2.3 MB,
  full scroll)
- Computed styles — `tools/tmp/siteinspire/playwright/computed-styles.json`
  (1,042 measured elements)
- Main CSS — `tools/tmp/siteinspire/playwright/css/0usi_7_-x8q-f__ae5f3e3b.css`
  (134 KB Tailwind utilities + Tremor-raw)
- Font CSS — `tools/tmp/siteinspire/playwright/css/00ok5g~2ojer3__5010027d.css`
  (2 KB Scto Grotesk A @font-face)
- Manifest — `tools/tmp/siteinspire/manifest.json` (102 files, 7.7 MB)
- RSC payload — embedded in the `self.__next_f.push([1,"…"])`
  scripts at the bottom of `homepage.html` (lines ~3870-3961)
- Next.js 15 docs (for chunk-naming convention) —
  https://nextjs.org/docs (not opened; the `?dpl=…` URL pattern is
  Next.js standard)
- Tailwind CSS container-queries plugin (for `@container` /
  `@2xs` / `@3xs` / `@xs` semantics) — https://tailwindcss.com/docs/container-queries
  (not opened; semantics inferred from CSS in `0usi_7_-x8q-f__ae5f3e3b.css`)
- CSS View Transitions API (for `::view-transition-old(.filter-fade)`)
  — https://developer.mozilla.org/en-US/docs/Web/CSS/View_transitions
- Lucide Icons — https://lucide.dev (icon names inlined as
  `class="lucide lucide-search"` etc.)
- Radix UI Primitives — https://www.radix-ui.com/primitives
  (Tabs, Scroll Area, Dialog, Popover markup patterns)

---

## Changelog

- 2026-06-20 — Initial draft. Observation pass on the rendered DOM
  (`playwright/homepage.html`), the two compiled CSS files, the
  `computed-styles.json` (1,042 elements), the
  `homepage.png` / `homepage-fullpage.png` screenshots, the 28
  JPEG thumbnails, the 8 Scto Grotesk A font files, and the
  ~30 JS chunks. Sections 1-13 written in one pass from observation
  only — no design choices invented, all values cross-checked
  against the source.
