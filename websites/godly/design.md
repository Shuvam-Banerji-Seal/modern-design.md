# godly.website — design.md

> A structured design specification of **https://godly.website**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** sub-agent
> **Source dump:** `tools/tmp/godly/` (gitignored)
>
> **Naming note.** The canonical brand on the page is now **Recent** — the
> homepage `<title>` reads `Recent — Design Inspiration`, the modal that
> greets visitors is titled `Godly is now Recent`, and every CDN asset is
> served from `cdn.recent.design`. The slug `godly` is retained because the
> user-facing URL `godly.website` still resolves; the gallery itself,
> however, is now a *Recent* gallery. This document describes the gallery
> as observed on the live URL, with the rebrand called out where it
> surfaces in the chrome.

---

## Overview

godly.website (now branded **Recent — Design Inspiration**) is a curated,
browsable index of "the best of recent design found on the Internet
updated daily." It is not a portfolio of one studio; it is a *gallery /
index* that surfaces tweets, websites, app icons, and App Store
screenshots — each card linking out to the original creator on X
(Twitter) or the App Store. The single observable surface is a homepage
composed of a 220 px sticky left sidebar (logo, live online counter,
filter nav, description, subscribe CTA, copyright) plus a multi-column
masonry feed rendered as CSS columns at 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9
tracks depending on viewport width. A modal dialog opens on first paint
to announce the rebrand from *Godly* to *Recent* and to capture email
subscriptions.

The visual language is deliberately restrained: a single 13 px
system-sans body on `#FFFFFF`, a single brand color (black) for active
text and primary buttons, semi-transparent grey pill overlays for the
in-card attribution chips, and an OKLCH neutral ramp for muted text.
There is no marketing hero, no animation reel, no parallax — the design
is *chrome as content*: the gallery's UI is so quiet that the
illustrations and screenshots inside the cards become the only color on
the page. The tone is confident and curator-like, with vocabulary like
"All", "Best of X", "Websites", "App Screenshots", "App Icons".

**Category:** Other (curated design gallery / inspiration index)
**Primary surface observed:** Homepage (`/`) — feed only; other routes
`/x`, `/websites`, `/app-store-screenshots`, `/app-icons`, `/info`
were linked from the sidebar nav but not loaded in the dump.
**Tone:** confident, quiet, curator-like. Headings are sentence case;
CTAs are short verbs ("Subscribe", "View post"); copy is utilitarian
("Last updated 3h ago", "47 online now").
**Framework detected (if any):** **Vite + React 19 + React Router 7**
(formerly Remix) — confirmed by `__vite__mapDeps` source map in the
main entry, `useLoaderData` / `useNavigate` / `useParams` data APIs in
the route bundles, and `data-base-ui-*` portal / dialog markup from
**Base UI** components. **Tailwind CSS v4** utility classes (CSS custom
properties under `@property`, `@supports (color:color-mix(...))`,
`oklch()` colors, `rounded-full: 3.40282e38px`). Cloudflare Web Analytics
beacon and a third-party `visitors.now` live-counter script are loaded.

---

## Visual Language

### Color

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--color-white` | `#FFFFFF` (white) | `html, body` fill |
| Background (elevated) | `--bg-elevated` | `#FFFFFF` (white) | dialog, sticky top bar |
| Background (subtle) | `--bg-subtle` | `#F2F2F2` (whitesmoke) | card placeholder before media loads |
| Background (overlay) | `--bg-overlay` | `rgba(0, 0, 0, 0.10)` | scrim under dialog, with `backdrop-blur: 2px` |
| Text (primary) | `--color-neutral-900` | `oklch(20.5% 0 0)` ≈ `#343434` | headings, body copy |
| Text (active) | `--color-black` | `#000000` (black) | nav active link, brand mark |
| Text (muted) | `--color-neutral-500` | `oklch(55.6% 0 0)` ≈ `#8C8C8C` | sidebar nav, captions |
| Text (secondary) | `--color-neutral-400` | `oklch(70.8% 0 0)` ≈ `#B5B5B5` | timestamps, count labels |
| Text (tertiary) | `--color-neutral-600` | `oklch(43.9% 0 0)` ≈ `#707070` | body-strong, slide count |
| Text (subtle) | `--color-neutral-200` | `oklch(92.2% 0 0)` ≈ `#EBEBEB` | input border, hover bg of chip |
| Text (placeholder) | `text-black/40` | `color-mix(in oklab, black 40%, transparent)` | email placeholder |
| Accent | `--accent` | `#000000` (black) | used as the only "accent" — fills the dialog logo circle |
| Accent (hover) | `--accent-hover` | `#FFFFFF` (white) | inverse on hover over black mark |
| Pill background (overlay) | `--pill-bg` | `rgba(90, 90, 90, 0.40)` | every creator-name pill and view-post FAB |
| Pill border (highlight) | `--pill-border-highlight` | `rgba(0, 0, 0, 0.10)` | `border-black/10` on form underline |
| Modal scrim | `--scrim` | `rgba(0, 0, 0, 0.10)` over `backdrop-blur(2px)` | behind subscribe dialog |
| Modal shadow | `--modal-shadow` | `0 24px 70px rgba(0, 0, 0, 0.18)` | dialog drop shadow |
| Card shadow | `--card-shadow` | (none observed on gallery cards) | cards are flat against `#F2F2F2` plate |
| App icon shadow | `--icon-shadow` | `drop-shadow(0 6px 18px rgba(0, 0, 0, 0.12))` | app icon `drop-shadow` filter |
| App icon clip | `--icon-clip` | `clip-path: inset(0 round 22.5%)` + `border-radius: 22.5%` | squircle frame for iOS-style icons |
| Chip highlight (inset) | `--chip-inset-shadow` | `0 -1px 0 rgba(255,255,255,0.35), 1px 0 0 rgba(255,255,255,0.15), -1px 0 0 rgba(255,255,255,0.15), 0 1px 0 rgba(255,255,255,0.3), 0 1px 1px rgba(0,0,0,0.2)` | "glass" bevel on top of dark pill bg |
| Sort button inset shadow | `--sort-inset-shadow` | `0 -1px 0 rgba(0,0,0,0.2), 1px 0 0 rgba(0,0,0,0.05), -1px 0 0 rgba(0,0,0,0.05), 0 1px 0 rgba(0,0,0,0.1)` | top "pressed into surface" look |
| Online dot ping | `--ping-color` | `#000000` (black, with `opacity: 0.75`) | status indicator |
| Skeleton key color | `--color-white` | `#FFFFFF` | `bg-black/[0.02]` pre-paint chip bg |

The Tailwind v4 palette is defined inside the bundled stylesheet via
`@property` color tokens. The **neutral ramp** uses OKLCH lightness
ramps from 97 % (`neutral-100`) down to 20.5 % (`neutral-900`), with no
chromatic axis — the entire gallery is achromatic except for the colors
inside the embedded media. The only two chromatic tokens are
`--color-green-500: oklch(72.3% .219 149.579)` and
`--color-pink-500: oklch(65.6% .241 354.308)`, neither of which is
exercised on the homepage.

There is **no `prefers-color-scheme: dark` variant** beyond a single
utility (`.dark\:bg-white\/10`) that is not used on the homepage. The
gallery is light-only — `color-scheme: light` is set on `:root` and
body.

### Typography

The site declares no `@font-face` rules and ships no webfont files in
the dump; everything resolves through the OS / system stack.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Body | `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | 400 | `13px` (root) / `1rem` (`text-base`) | `1.5` (`--leading-normal`) | `0` (`normal`) |
| Body strong | (same) | 500 (`--font-weight-medium`) | inherits | inherits | inherits |
| Nav link | (same) | 400 | `13px` | `19.5px` (`19.5px = 1.5 × 13px`) | `normal` |
| Caption / timestamp | (same) | 400 | `13px` | `19.5px` | `-0.08px` (`tracking-[-0.08px]`) |
| Dialog H2 (`text-2xl`) | (same) | 400 | `19.5px` (`1.5rem`) | `26px` (`2/1.5 = 1.333…`) | `-0.02em` (`tracking-[-0.02em]`) |
| Dialog body | (same) | 400 | `13px` | `1.4` (`leading-[1.4]`) | `-0.02em` |
| Subscribe button | (same) | 400 | `13px` | `19.5px` | `normal` |
| Pill label | (same) | 400 | `13px` | `13px` (`leading-none`) | `normal` |
| Brand mark (vector) | — | — | 28×28 / 32×32 viewBox | — | — |

Observations on type:

- The base body size is unusually small at **13 px** — the entire
  reading experience is calibrated for density rather than comfort.
- A single letter-spacing token (`-0.08px`, i.e. roughly `-0.006em`) is
  applied to small captions and timestamps to compensate for the small
  size; the dialog uses a much larger `-0.02em` for display tightness.
- The CSS defines `--font-mono: ui-monospace, SFMono-Regular, Menlo,
  Monaco, Consolas, "Liberation Mono", "Courier New", monospace` but no
  mono text is observed in the homepage.
- The body is `tabular-nums` on dialog H2 (where the `@property
  --tw-numeric-spacing: tabular-nums` utility is composed) but this is
  theoretical — no digits appear in the dialog headings.

### Spacing & radius

- **Base unit:** `0.25rem` (4 px), exposed as `--spacing`. Tailwind
  scales up via `calc(var(--spacing) * N)`.
- **Scale observed:** 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 12,
  16, 24 (all expressed as the spacing multiplier).
- **Page gutter:** `p-4` on the outer flex container (16 px), expanding
  to `lg:gap-8` between sidebar and feed (32 px).
- **Card gutter (column gap):** `gap-4` (16 px) between articles inside
  a column; column-gap uses the same value because cards live in CSS
  columns.
- **Card margin bottom:** `mb-4` (16 px) under each article.
- **Sidebar column gap (mobile 2-col):** `gap-x-4 gap-y-8` (16 × 32).
- **Radii:**
  - `--radius-md: 0.375rem` → 6 px (Tailwind `rounded-md`)
  - `--radius-lg: 0.5rem` → 8 px (Tailwind `rounded-lg`)
  - `--radius-xl: 0.75rem` → 12 px (Tailwind `rounded-xl`)
  - `--radius-2xl: 1rem` → 16 px (dialog `rounded-2xl`)
  - `rounded-full` → `3.40282e38px` (effectively pill; status dot, sort
    button, creator pills, view-post FABs, avatar circle)
  - App icons → `22.5%` `border-radius` with `clip-path: inset(0 round
    22.5%)` to enforce an iOS-squircle shape independent of aspect
    ratio.
- **Shadows:**
  - Card: none (flat on `#F2F2F2` plate)
  - Pill (dark glass): inset highlight stack plus 1 px black
    shadow — see `--chip-inset-shadow` above
  - Sort button: `--sort-inset-shadow` (slightly darker inset bevel)
  - Dialog: `0 24px 70px rgba(0, 0, 0, 0.18)` plus `rounded-2xl`
  - App icon: `drop-shadow(0 6px 18px rgba(0, 0, 0, 0.12))`
  - Highlighted menu item: `0 -1px 0 rgba(255,255,255,0.4), 0 1px 0
    rgba(255,255,255,0.3)` (light bevel on white-on-dark hover)

### Iconography

The icon system is **inline SVG only** — no icon sprite, no Lucide /
Phosphor / Heroicons dependency. Five distinct shapes are used:

| Icon | Geometry | Stroke | Where |
| --- | --- | --- | --- |
| Brand mark (Recent) | `viewBox 0 0 32 32` — a 22×20 pill with a 12×20 rect attached at the bottom, single closed path | fill only, `fill="currentColor"` | sidebar logo link, dialog logo circle |
| Lightning (rebrand glyph) | `viewBox 0 0 64 64` — single closed path forming a stylized "flash" | fill only, `fill="currentColor"` | inside the black circle of the dialog header |
| Sort chevron (double) | `viewBox 61 5 12 14` — two chevrons (up + down) at 12×14, stroke 1.25 | stroke 1.25, `stroke-linecap="round"`, `stroke-linejoin="round"` | sort button (Recent ▼▲) |
| External / arrow-up-right | `viewBox 0 0 16 16` — two strokes forming an L-bracket + a diagonal | stroke 1, `stroke-linecap="round"` | view-post FAB on every card |
| Star (filled, for ratings) | `viewBox 0 0 24 24` — Lucide-style 12-point star path | `fill="currentColor"` | app rating badge |

The brand mark uses **two paths** stacked vertically (a squashed "P"
silhouette + a horizontal bar). It is rendered at 28 × 28 in the sidebar
and at 64 × 64 inside the black circle of the dialog header. It is the
only piece of brand-specific geometry; every other icon is a generic
utility glyph.

---

## Layout & Grid

The homepage is a single full-bleed white canvas. The shell is a
horizontal flex at `lg` and up, a stacked vertical flex below:

```
┌─────────────────────────────────────────────────────────────────────┐
│ <body style="overflow: hidden;">                                   │
│   <main aria-hidden="true"> (Base UI inert portal background)      │
│     <div flex min-h-screen flex-col gap-6 p-4                      │
│          lg:flex-row lg:gap-8>                                     │
│       ┌─────────────────┐  ┌─────────────────────────────────────┐ │
│       │ <aside> sidebar │  │ <main>                              │ │
│       │ grid 2 col      │  │   <div sticky top-0 sort bar>       │ │
│       │ mobile, flex    │  │   <div feed-grid CSS columns N>     │ │
│       │ col sticky lg   │  │     <article>…</article> × N         │ │
│       │ w-[220px]       │  │                                     │ │
│       └─────────────────┘  └─────────────────────────────────────┘ │
│   </main>                                                          │
│ </body>                                                            │
│ <Base UI Portal> ← dialog rendered outside the DOM hierarchy       │
└─────────────────────────────────────────────────────────────────────┘
```

- **Max content width:** unbounded — the feed fills the remaining
  viewport after the 220 px sidebar.
- **Page gutter:** `16 px` (`p-4`) all-around on the outer flex
  container; `32 px` (`lg:gap-8`) between sidebar and feed on desktop.
- **Sidebar width:** `220 px` on `lg` (`lg:w-[220px]`), collapses to a
  two-column block above the feed on mobile.
- **Sidebar position:** sticky on `lg` (`lg:sticky lg:top-4
  lg:h-[calc(100vh-2rem)] lg:self-start`) — pins to the top of the
  viewport for the full height of the feed.
- **Sort bar:** sticky at `top: 0` on the feed main column, with
  `z-index: 20` and a white background (`bg-white`) so cards scroll
  under it.
- **Feed grid:** CSS multi-column with class-driven track counts:

  | Min width | Tracks | Class |
  | --- | --- | --- |
  | default | 1 | `columns-1` (not declared; only `flex gap-4` rows) |
  | 640 px (`sm:`) | 2 | `sm:columns-2` |
  | 768 px (`md:`) | 3 | `md:columns-3` |
  | 1024 px (`lg:`) | 4 | `lg:columns-4` |
  | 1280 px (`xl:`) | 5 | `xl:columns-5` |
  | 1536 px (`2xl:`) | 6 | `2xl:columns-6` |
  | 1728 px (custom) | 7 | `min-[1728px]:columns-7` |
  | 1920 px (custom) | 8 | `min-[1920px]:columns-8` |
  | 2560 px (custom) | 9 | `min-[2560px]:columns-9` |

  The grid is implemented as three flex `min-w-0 flex-1` track
  containers (`flex gap-4 items-start`) on mobile, which collapse to
  `columns-N` via the responsive Tailwind utilities above `sm`. Each
  `<article>` carries `mb-4 break-inside-avoid` so a card never splits
  across columns. `aspect-ratio` is set inline per-card to match the
  intrinsic media ratio (1 / 1, 1.77778 / 1, 0.462 / 1, etc.) so cards
  have predictable heights even before media loads.

- **Breakpoints (Tailwind v4 defaults):**
  - `sm`: `40rem` (640 px) → 2-col feed
  - `md`: `48rem` (768 px) → 3-col feed
  - `lg`: `64rem` (1024 px) → sticky sidebar, 4-col feed
  - `xl`: `80rem` (1280 px) → 5-col feed
  - `2xl`: `96rem` (1536 px) → 6-col feed
- **Container tokens (declared, not used on homepage):** `xs 20rem`,
  `md 28rem`.

The homepage sequence is:

1. **Sidebar (left rail)** — logo + live online counter (row 1 col 1),
   filter nav (row 1 col 2 on mobile / vertical stack on desktop),
   description + subscribe CTA + © line (row 2, sticks to bottom via
   `lg:mt-auto`).
2. **Sort bar (sticky top of feed)** — `Last updated 3h ago` on the
   left, `Recent ▼▲` combobox on the right.
3. **Feed grid** — masonry of `<article>` cards. Each card is a
   `<button>` (zoom-in cursor) over media, with two absolute-positioned
   links: a creator-name pill bottom-left and a view-post arrow button
   bottom-right.
4. **Subscribe modal (portal)** — centered 388 px dialog with a
   brand-mark "flash" glyph, "Godly is now Recent" H2, body copy, and
   email subscribe form.

---

## Components

### Brand mark (logo)

- **Geometry:** 28 × 28 in the sidebar, 64 × 64 in the dialog header.
- **Two paths:** a 22×20 "P"-shaped silhouette plus a 32×12 horizontal
  bar beneath it (`viewBox="0 0 32 32"`).
- **Color:** `fill="currentColor"`, takes color from the parent
  (`text-black` on the sidebar anchor).
- **Accessibility:** `aria-hidden="true"` — the anchor carries
  `aria-label="Recent"`.

### Live online counter

- **Anatomy:** `47` (black, semibold-ish) + " online" (muted), with a
  2 × 2 dot to the left that pulses.
- **Pulse:** `animate-ping` (built-in Tailwind v4 `@keyframes ping`)
  composes a 100 %-scale expanding ring that fades to 0 over 1 s,
  infinitely; a second non-animated solid dot sits on top via
  `relative` / `absolute`.
- **Source:** `https://cdn.visitors.now/v.js` (third-party) returns
  `{count: 47}` over a 12-byte response.
- **Accessibility:** wrapped in a `<span aria-label="47 online now">`.

### Sidebar filter nav

- **Entries:** `All` (`/`, current), `Best of X` (`/x`), `Websites`
  (`/websites`), `App Screenshots` (`/app-store-screenshots`), `App
  Icons` (`/app-icons`), `Info` (`/info`).
- **Spacing:** `flex-col gap-1` (4 px gap).
- **Type:** 13 px, line-height 19.5 px, color `text-neutral-500`
  (inactive) or `text-black` (`active`).
- **Hover:** `transition-colors [@media(hover:hover)]:hover:text-black`
  — only on devices that report a real hover capability.
- **Active state:** `aria-current="page"` and a stronger weight /
  color on the active anchor.

### Subscribe CTA (inline, in sidebar)

- **Anatomy:** the word `Subscribe` rendered as a `<button>` with
  `text-neutral-500 underline`, followed by `to a weekly email digest
  joining 474 people today.` as muted body text.
- **Behavior:** opens the modal (Base UI dialog) on click;
  `aria-haspopup="dialog"`, `aria-expanded="true"`, `aria-controls`
  pointing at the dialog id.
- **Hover:** `[@media(hover:hover)]:hover:no-underline` — the
  underline is removed on capable hover devices, replaced by the color
  change.

### Sort button

- **Type:** `<button role="combobox" aria-haspopup="listbox">`
  styled as a chip.
- **Anatomy:** label (`Recent`) on the left, double-chevron SVG on the
  right.
- **Sizing:** `h-8` (32 px tall), `px-3` (12 px horizontal padding).
- **Background:** `bg-black/[0.02]` (≈ `rgba(0,0,0,0.02)`).
- **Border / shadow:** `--sort-inset-shadow` for a "pressed-into"
  look; `backdrop-saturate-150` to keep the underlying white reading
  pure.
- **Hover:** `hover:bg-black/[0.06]`; while open, `data-[popup-open]`:
  same color so the visual state stays consistent.
- **Trigger:** opens an unobserved listbox (Base UI Menu) — its
  content is not in the dump.

### Feed card (`<article>`)

- **Anatomy (top to bottom, in z-order):**
  - `<button>` zoom-in trigger filling the card with `cursor-zoom-in`
    and the article's media (`<img>`, `<video>`, or icon tile) at
    `block size-full object-cover`.
  - Optional `<video>` with `autoplay loop playsinline preload="none"
    draggable="false"` and a `poster` from a sibling `.jpg`.
  - Creator-name pill (`<a>`) absolutely positioned at `bottom-3
    left-3`, `z-10 opacity-100`, `flex shrink-0 items-center gap-1.5`.
  - View-post FAB (`<a>`) absolutely positioned at `bottom-3 right-3`,
    `z-10 opacity-100`, `flex size-[24px]`.
  - Optional slides count badge (`<span aria-label="5 slides">`)
    absolutely positioned at `top-3 right-3`, `pointer-events-none`.
  - Optional rating (`<span>` with filled star SVG + score + count)
    absolutely positioned at `top-3 right-3`, `pointer-events-none`.
- **Background:** `#F2F2F2` (the neutral plate behind the media).
- **Padding:** none — the media fills the card.
- **Margin:** `mb-4 break-inside-avoid` to keep each card in one column
  break.
- **Hover:** not explicitly styled — the cards are static; the click
  target is the `<button>`.

### Creator pill (link overlay)

- **Sizing:** `h-[22px] min-h-[22px] min-w-[22px]`, `rounded-full`,
  `px-2` (8 px horizontal).
- **Background:** `bg-[rgba(90,90,90,0.4)]` with
  `backdrop-saturate-150`.
- **Border / shadow:** `--chip-inset-shadow` for the "glass" bevel
  on top of the dark plate.
- **Color:** `text-white` `leading-none`.
- **Typography:** 13 px, line-height 13 px.
- **Optional leading icon:** `<img class="size-[22px] rounded-full
  object-cover">` showing the creator's 22×22 avatar before the pill.
- **Target:** the creator's external X profile or App Store listing;
  always `target="_blank" rel="noreferrer"`.

### View-post FAB

- **Sizing:** 24 × 24, but inner SVG is 22 × 22 (`min-h-[22px]
  min-w-[22px]`).
- **Border-radius:** `rounded-full`.
- **Background / shadow / color:** identical to the creator pill
  (`rgba(90,90,90,0.4)`, `backdrop-saturate-150`, white icon,
  `--chip-inset-shadow`).
- **Icon:** 16 × 16 arrow-up-right (two strokes).
- **Target:** the source post / item URL on X or App Store; same
  `target="_blank" rel="noreferrer"`.

### Slides count badge

- **Sizing / radius:** 24 × 24, `rounded-full`, identical pill style to
  the creator pill (no leading avatar).
- **Label:** a digit (e.g. `5`) at 13 px, line-height 13 px, white.
- **Position:** `top-3 right-3`, `pointer-events-none` (purely
  informational).
- **Accessibility:** `aria-label="5 slides"`.

### App icon tile (squircle)

- **Geometry:** a 1:1 article whose `<button>` wraps an
  `<img>`-in-a-square container. The container is `flex aspect-square
  w-full items-center justify-center p-[28%]` so the icon sits with
  28 % padding inside a 1:1 frame.
- **Icon shape:** the icon image is `size-full rounded-[22.5%]
  object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.12)]
  [clip-path:inset(0_round_22.5%)]`. The 22.5 % border-radius plus the
  matching clip-path produces a true squircle mask independent of the
  image's own aspect ratio.
- **Rating overlay:** a star + score + count in the top-right; same
  `pointer-events-none` pattern.
- **Source URLs:** `https://cdn.recent.design/apps/<slug>/icon.jpg` or
  `icon.png`.

### Page chrome and "frame" pattern

The gallery uses what could be called a **frame-as-chrome** pattern: the
shell (sidebar + sort bar) is intentionally monochrome so that the
embedded media becomes the only chromatic surface in the viewport. Two
specific decisions enforce this:

- **No card chrome.** Cards have no border, no shadow, no hover lift,
  no internal padding — they are a `bg-[#F2F2F2]` plate with media on
  top, plus two absolutely-positioned pills. The plate color matches
  Apple's "About this image" placeholder grey so unloaded cards look
  intentionally blank rather than broken.
- **No hero.** There is no full-bleed banner, no marketing illustration,
  no animated logo. The brand mark sits in the top-left at 28 × 28 —
  the smallest viable presence.

The effect is that every pixel of color the user sees is *content* (a
screenshot, a video frame, an app icon, an avatar) rather than *chrome*.
This is the opposite of most marketing sites, which spend most of
their color budget on backgrounds and CTAs.

### Empty / loading states

- **Card placeholder:** `bg-[#F2F2F2]` (`rgb(242, 242, 242)`) — a
  warm-neutral grey that reads as "neutral paper" against pure white.
- **No skeleton shimmer.** The CSS contains no `@keyframes` for
  skeleton loading. The placeholder is flat.
- **No-JS fallback:** `<noscript><style>.feed-grid{opacity:1
  !important}</style></noscript>` ensures the grid renders
  unconditionally.
- **Sort button idle:** when the listbox is closed, the button is just
  `Recent ▼▲` on `rgba(0,0,0,0.02)` — no spinner, no "loading" label.

### Subscribe modal (Base UI Dialog)

- **Width:** `w-[388px]` capped at `max-w-[calc(100vw-2rem)]`.
- **Position:** centered (`left-1/2 -translate-x-1/2`); at the top
  half of the viewport on `sm:` and up (`sm:top-1/2 sm:-translate-y-1/2`),
  pinned above the safe-area inset bottom on mobile (`bottom:
  calc(1rem + env(safe-area-inset-bottom))`).
- **Background / radius / shadow:** `bg-white rounded-2xl p-8` with
  `shadow-[0_24px_70px_rgba(0,0,0,0.18)]`.
- **Header:** two overlapping 96 × 96 circles — black circle with the
  white "flash" glyph (`size-16`, viewBox 64×64), white circle with the
  black brand mark (`size-12`, viewBox 32×32). The black circle is
  offset right by `-mr-4` so the two circles overlap.
- **H2:** `text-2xl text-black` → 19.5 px / 26 px line-height /
  `-0.02em` tracking; the H2 text is `Godly is now Recent`.
- **Body copy:** two `<p class="mt-2 | mt-4 w-[288px] text-balance
  text-center leading-[1.4] text-black">` explaining the move and the
  expanded scope.
- **Form:** `<form>` with a 1 px `border-b border-black/10` underline,
  email input (no border, transparent bg, `placeholder:text-black/40`)
  and a `Subscribe` button (`text-black`, opacity drop on disabled).
- **Disabled state:** `disabled:opacity-30` on the submit button,
  `disabled:opacity-60` on the input.
- **Portal mounting:** rendered under `<div id="_r_0_"
  data-base-ui-portal="">` outside the inert main landmark.
- **Scrim:** `fixed inset-0 z-[998] bg-black/10 backdrop-blur-[2px]`.
- **Z-stack:** scrim `z-[998]`, dialog `z-[999]`.

### Skeleton / "no JS" fallback

- `<noscript>` carries `<style>.feed-grid { opacity: 1 !important }
  </style>` so the grid is visible without JavaScript.
- The grid wrapper itself uses `transition-opacity duration-500
  opacity-100` and is pre-painted at full opacity to avoid a flash.

---

## JavaScript & Libraries

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| **Vite (bundler)** | not pinned | `__vite__mapDeps` source map in `index-CmzO1DfM.js`; `vite` token in `composite-CQITlhV_.js` | multi-page build with hashed asset names (`app-CpizTGcq.css`, `_app-DttUZrIP.js`, etc.) |
| **React** | 19.x | `react.fragment`, `react.transitional`, `react.activity`, `react.client` symbols in `composite-CQITlhV_.js`; `jsx-runtime-DVpe7PXp.js` is the new JSX runtime | React 19 introduces `react.activity` and the new JSX transform — both present |
| **React Router 7 (formerly Remix)** | not pinned | `useLoaderData`, `useNavigate`, `useParams` imported across all three route bundles (`_app-wYTC7HVU.js`, `_app-DttUZrIP.js`, `composite-CQITlhV_.js`); `useLoaderData` called inside the root component and consumed via `useRouteLoaderData`-equivalent | the route bundles route-importing `composite-CQITlhV_.js` indicate React Router's framework mode (Remix-derived) |
| **Base UI** (`@base-ui-components/react`) | not pinned | `data-base-ui-portal`, `data-base-ui-inert`, `data-base-ui-focus-guard`, `data-base-ui-focusable`, `data-base-ui-click-trigger` attributes throughout the DOM; `base-ui` token in `_app-wYTC7HVU.js`, `composite-CQITlhV_.js`, `index-CmzO1DfM.js` | provides the Dialog (subscribe modal), Menu (sort listbox), and Select primitives |
| **Tailwind CSS** | v4 | `@property` color tokens, `color-mix(in oklab, …)` everywhere, `oklch()` palette, `rounded-full: 3.40282e38px`, `@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline)))` flag | Tailwind v4 compiles to a single 32 KB CSS bundle; theme tokens are CSS custom properties on `:root` |
| **Cloudflare Web Analytics** | beacon `2024.11.0` | inline `<script defer src="https://static.cloudflareinsights.com/beacon.min.js/…">` with `data-cf-beacon='{"version":"2024.11.0",…}'` | RUM only (no cookies); `cfCacheStatus`, `cfEdge`, `cfSpeedBrain`, `cfL4` server-timing fields enabled |
| **visitors.now** | not pinned | `<script src="https://cdn.visitors.now/v.js" data-token="7d16bcf4-…">` returning `{"count":47}` from `playwright/other/online__c2c35f79` | third-party "live visitors" counter; the 47 figure is the value rendered in the sidebar status pill |
| **Framer Motion** | not pinned | `framer-motion` and `framer` strings appear in `composite-CQITlhV_.js`; not directly used in the homepage markup observed | imported for transition / gesture work elsewhere (route bundles) |
| **@vitejs/plugin-react** | inferred | `jsx-runtime-DVpe7PXp.js` is the auto-injected runtime | implicit through Vite's React plugin |

No GSAP, no Lottie, no Three.js, no WebGL, no video player library
(HTML5 `<video>` only), no Web Animations API calls, no Lenis /
locomotive, no Framer Motion call sites in the observed homepage
markup. The JavaScript on the homepage is mostly: hydrate the React
tree, mount the Base UI dialog, fetch the live visitor count, and run
the Cloudflare beacon.

---

## Animations (Catalog)

The animation footprint is intentionally small — the gallery relies on
media-internal motion (videos autoplaying inside cards) rather than UI
motion. Every animation below was extracted from
`tools/tmp/godly/playwright/css/app-CpizTGcq__89cee7dd.css` and the
HTML markup.

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `ping` | `playwright/css/app-CpizTGcq__89cee7dd.css:1196` (Tailwind built-in) | 1 s (via `--animate-ping: ping 1s cubic-bezier(0, 0, .2, 1) infinite`) | `cubic-bezier(0, 0, 0.2, 1)` | infinite, on the outer ring of the live-online dot |
| `pulse` | `playwright/css/app-CpizTGcq__89cee7dd.css:1201` (Tailwind built-in) | 2 s (via `--animate-pulse: pulse 2s cubic-bezier(.4, 0, .6, 1) infinite`) | `cubic-bezier(0.4, 0, 0.6, 1)` | declared, but no element on the homepage uses `animate-pulse` directly |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| Base UI Dialog | opening + closing transitions | click on `Subscribe`; `data-popup-open` attribute flip | the dialog renders with `data-[starting-style]:opacity-0` / `data-[ending-style]:opacity-0` data-state CSS hooks; the actual opacity transition is driven by the `transition-opacity` utility (`.3s`) |
| `<video>` cards | autoplay-loop | `<video autoplay loop playsinline preload="none">` | the video assets are 8 KB – 32 KB silent loops served from `cdn.recent.design/items/.../0.mp4` |

### Page transitions

- **None observed.** No `app/template.tsx`-style wrapper, no
  cross-fade between routes; navigation between `/`, `/x`,
  `/websites`, etc. is a plain full-document navigation.
- The grid uses `transition-opacity duration-500` and
  `transition-opacity duration-300` on its wrapper, but the starting
  state is already `opacity-100`, so the animation only fires when the
  wrapper's data changes (e.g. route change inside the feed).

### Default timing tokens

- `--default-transition-duration: .15s`
- `--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1)`
  (Tailwind's "in-out" ease)
- `duration-300` → `.3s`, `duration-500` → `.5s`

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump. The `models/` folder in
`tools/tmp/godly/` is empty.

### Fonts

N/A — no font files observed in the dump. The site uses the OS
`ui-sans-serif, system-ui, sans-serif, …` stack only. The `fonts/`
folder in `tools/tmp/godly/` is empty.

### Images

All gallery imagery is served from `https://cdn.recent.design/…` and is
referenced by URL only; the dump also contains a copy under
`tools/tmp/godly/playwright/images/` (29 files, 3.6 MB total). The
images in the dump are preloads and CDN cache samples, not the full
gallery set.

| Local dump path | Type | Dimensions | Size | Source URL pattern | Notes |
| --- | --- | --- | --- | --- | --- |
| `playwright/images/0__8c7b45bb.jpg` | JPEG | 1440 × 2012 (declared in markup) | 430 KB | `https://cdn.recent.design/items/tikhon-1781888611461/desktop/card/{360,720,1440}.jpg` | Tikhon Belousko portfolio card |
| `playwright/images/1__01a7fcd6.jpg` | JPEG | (video poster, 16:9) | 35 KB | `https://cdn.recent.design/items/bamojk-2067922309130977480/1.jpg` | poster for the "Creative Reference Library" video card |
| `playwright/images/icon__595ad133.jpg` | JPEG | (icon, 1:1) | 443 KB | `https://cdn.recent.design/apps/pillow-1781875694042/icon.jpg` | "Pillow" app icon (app icon tile) |
| `playwright/images/icon__075f570f.png` | PNG | (icon, 1:1) | 82 KB | `https://cdn.recent.design/apps/open-1781866165101/icon.png` | "Open" app icon tile |
| `playwright/images/0__f4d0c0ea.png` | PNG | 2400 × 1350 | 126 KB | `https://cdn.recent.design/items/lancedraws-2067942563152060821/0.png` | "bmrks, cmdk, oklch" landscape card |
| `playwright/images/0__f00e3fc4.png` | PNG | (icon, 1:1) | 16 KB | `https://cdn.recent.design/apps/open-1781866165101/icon.png` | duplicate Open icon sample |
| `playwright/images/shot-01__8e553d67.jpg` | JPEG | 1284 × 2778 | 569 KB | `https://cdn.recent.design/apps/manus-1781882893645/shot-01.jpg` | "Manus" portrait (iPhone screenshot) |
| `playwright/images/shot-01__4989d47e.jpg` | JPEG | 1242 × 2688 | 593 KB | `https://cdn.recent.design/apps/numo-1781885162838/shot-01.jpg` | "Numo" portrait |
| `playwright/images/shot-01__bdabfc91.jpg` | JPEG | 1284 × 2778 | 199 KB | `https://cdn.recent.design/apps/open-1781866165101/shot-01.jpg` | "Open" portrait |
| `playwright/images/icon__a895d70c.jpg` | JPEG | (icon) | 72 KB | `https://cdn.recent.design/apps/numo-1781885162838/icon.jpg` | Numo icon |
| `playwright/images/icon__be87f1d4.jpg` | JPEG | (icon) | 72 KB | duplicate of Numo icon | deduped by sha1 |
| `playwright/images/1__ab541658.jpg` | JPEG | 16:9 poster | 54 KB | `https://cdn.recent.design/items/joshpuckett-2067990665582293034/1.jpg` | "Leading and Measure" video poster |
| `playwright/images/1__277e56b0.jpg` | JPEG | 16:9 poster | 115 KB | `https://cdn.recent.design/items/bptrz-2067766763983384600/1.jpg` | "Credit Card Concept" video poster |
| `playwright/images/1__50b068e4.jpg` | JPEG | (poster) | 38 KB | `https://cdn.recent.design/items/guillaumebth-2037154025812918401/1.jpg` | "Guillaume Portfolio" poster |
| `playwright/images/avatar__b928e955.jpg` | JPEG | 22 × 22 | 7 KB | `https://cdn.recent.design/creators/ff407fa1-cf90-4ebd-8ed3-65a35c215868/avatar.jpg` | creator avatar (joshpuckett) |
| `playwright/images/icon__*.jpg` (15 files, ~5–8 KB each) | JPEG | 22 × 22 (avatars) | ~6 KB avg | `https://cdn.recent.design/entities/<uuid>/icon.jpg` | one per creator entity UUID |
| `playwright/images/1__*.jpg` (4 files) | JPEG | video posters, 16:9 | 16–60 KB | `https://cdn.recent.design/items/<slug>/1.jpg` | sibling posters of the videos |

Sizes shown are dump byte counts. Source dimensions are extracted from
the `width=` / `height=` attributes on the corresponding `<img>` tags.

### SVGs & icons

All icons are inline `<svg>` with `fill="currentColor"` (filled glyphs)
or `stroke="currentColor" stroke-width="1"` / `1.25` (stroked glyphs).

- **Inline SVGs observed in HTML:**
  - **Brand mark** — `viewBox 0 0 32 32`, two `<path>`s + one `<rect>`,
    28 × 28 (sidebar) and 64 × 64 (dialog circle). `aria-hidden`.
  - **Lightning / flash** — `viewBox 0 0 64 64`, one `<path>`,
    `fill="currentColor"`. `aria-hidden`.
  - **Sort double-chevron** — `viewBox 61 5 12 14`, two `<path>`s
    with `stroke-width="1.25"` rounded caps and joins. `aria-hidden`.
  - **Arrow-up-right** — `viewBox 0 0 16 16`, two `<path>`s,
    `stroke-width="1"` rounded caps. `aria-hidden`. (Repeated on every
    card's view-post FAB.)
  - **Star (filled)** — `viewBox 0 0 24 24`, one `<path>`,
    `fill="currentColor"`. `aria-hidden`.
- **Standalone SVG files in dump:** none. `/favicon.svg` is referenced
  in `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` but
  was not captured in the dump.
- **Icon system:** none — every icon is hand-inlined into the JSX.

### Audio & video

| Local dump path | Type | Notes |
| --- | --- | --- |
| `playwright/media/0__d3887a0f.mp4` | MP4 (H.264 likely) | 8 KB, autoplay loop muted, `<video poster=…>` — "Organic Modulation" |
| `playwright/media/0__a28bba80.mp4` | MP4 | 8 KB, autoplay loop muted — "Credit Card Concept" |
| `playwright/media/0__dd9c3bce.mp4` | MP4 | 15 KB, autoplay loop muted — "Leading and Measure" |
| `playwright/media/0__c1db234d.mp4` | MP4 | 12 KB, autoplay loop muted — "Creative Reference Library" |
| `playwright/media/0__4e08edf1.mp4` | MP4 | 21 KB, autoplay loop muted — "Guillaume Portfolio" |
| `playwright/media/0__96643233.mp4` | MP4 | 32 KB, autoplay loop muted — "Henry Labs" |

All videos are loaded with `preload="none"` so they only fetch when in
viewport. Sizes are tiny (≤ 32 KB) because they are short, low-bitrate
loops intended for autoplay without buffering. Source URLs:
`https://cdn.recent.design/items/<slug>/0.mp4`.

---

## Motion & Interaction

### Principles

- **UI motion is sparing.** Only three places animate: the live
  counter dot, the dialog open/close, and the grid opacity on route
  change. Everything else (hover states, focus rings) is a CSS
  `transition-colors` or a static color shift.
- **Default easing:** `cubic-bezier(.4, 0, .2, 1)` (Tailwind's "in-out"
  ease, 150 ms) for color and opacity; `cubic-bezier(0, 0, .2, 1)` for
  the `ping` ring.
- **Default duration:** 150 ms (color), 300 ms (dialog open), 500 ms
  (grid opacity swap).
- **Easing vocabulary is binary:** either the Tailwind default or a
  hard `linear` is implied by the chevron SVG geometry — no
  hand-tuned cubic-béziers in component code.

### Specific behaviors

- **Link hover (nav):** color shift from `text-neutral-500` (≈
  `#8C8C8C`) to `text-black` (`#000000`) over 150 ms via
  `transition-colors`. The underline `text-decoration` is left to the
  browser default for the `Subscribe` button and removed on hover via
  `[@media(hover:hover)]:hover:no-underline`.
- **Sort button hover:** background shifts from
  `rgba(0,0,0,0.02)` to `rgba(0,0,0,0.06)` over 150 ms. Same value is
  applied while open (`data-[popup-open]:bg-black/[0.06]`).
- **Card click:** the `<button>` inside each card opens a (not
  observed) lightbox or detail view. The card itself has no hover
  transform, scale, or shadow change.
- **Subscribe button click:** opens the modal — dialog opacity animates
  from 0 → 1 over 300 ms (`transition-opacity duration-300`), scrim
  fades in at the same time, body scroll is locked (`<body
  style="overflow: hidden;">`).
- **Pill / FAB hover:** none — pills are static, they don't even
  lighten on hover because they're already "on top" of media.
- **Live online dot:** the inner ring scales from 1 → 2 and fades from
  0.75 → 0 opacity over 1 s, infinitely, with the inner solid dot
  pulsing at the same cadence.

### Reduced motion

**Not observed.** No `@media (prefers-reduced-motion: reduce)` block
was found in the bundled CSS, so:

- The `ping` ring continues to expand and fade for users with reduced
  motion enabled.
- The dialog still fades in over 300 ms.
- Video autoplay loops continue to play (these would also need to be
  paused on reduced-motion devices to comply with WCAG 2.3.3, but the
  site does not implement that).

The gallery appears to assume motion is acceptable; this is the
largest accessibility miss in the observed implementation.

---

## Content & Voice

- **Tone:** confident, quiet, curator-like. Headlines are short and
  declarative ("Recent — Design Inspiration", "Godly is now Recent").
- **Sentence length:** short to medium; active voice.
- **Capitalization:** Sentence case in headings and nav entries ("All",
  "Best of X", "App Screenshots", "App Icons"). `Title Case` for the
  rebrand H2 (`Godly is now Recent`).
- **Punctuation:** em-dash in the title tag only; no Oxford comma; one
  colon used in the modal form (`design@god.com` placeholder).
- **CTA vocabulary (4 verbs observed):** *Subscribe*, *View post*, *All*
  (used as a filter), *Best of X* (a filter, not a CTA).
- **Status vocabulary:** *online* (count), *Last updated Xh ago*
  (relative timestamp), *X slides* (badge), `4.4` + `(95.5K)` (rating).
- **Attribution pattern:** every card shows the creator's avatar
  (22 × 22 round) followed by the creator handle in a pill. The pill's
  text is either the bare domain (`tikhon.io`) or the X handle's
  display name (`Lance`, `Borys`, `Sha`, `Joran Entjes`, `Hieu Dinh`,
  `Bimo Tri. P`, `Guillaume`).
- **No marketing prose.** The homepage is intentionally copy-free
  except for the 2-sentence tagline ("The best of recent design found
  on the Internet updated daily.") and the 2-sentence rebrand
  announcement inside the modal.

---

## Information Architecture

Only the homepage (`/`) was loaded into the dump. The sidebar nav
exposes the following top-level routes:

| Route | Purpose | Primary component |
| --- | --- | --- |
| `/` | All items, masonry feed | feed grid + sidebar |
| `/x` | Items sourced from X / Twitter only | feed grid (filtered) |
| `/websites` | Website screenshots only | feed grid (filtered) |
| `/app-store-screenshots` | App Store screenshots only | feed grid (filtered) |
| `/app-icons` | App icon tiles only | feed grid (filtered, square tiles) |
| `/info` | About / contact | (not loaded) |

The sort listbox (combobox labeled `Recent`) is present in the markup
but its options were not captured; from the label it appears to be a
recency sort (probably `Recent` / `Most liked` / etc.) — *Not observed
in detail*.

There is **no login**, **no settings page**, **no per-item detail
page** (clicking a card opens a not-observed lightbox, clicking a
creator pill or the view-post FAB navigates externally).

---

## Accessibility

- **Color contrast:** the primary text (`oklch(20.5% 0 0)` ≈ `#343434`)
  on `#FFFFFF` measures roughly **13 : 1** (well above WCAG AAA 7 : 1).
  Muted text (`oklch(55.6% 0 0)` ≈ `#8C8C8C`) on white measures about
  **4.6 : 1** — passes WCAG AA for body text at 13 px only because the
  threshold for AA-large is 3 : 1 and 13 px is below the AA-large
  threshold; in practice this is borderline for sustained reading.
  White text on `rgba(90, 90, 90, 0.4)` over arbitrary media varies
  wildly — anywhere from 3 : 1 (over white media) to 10 : 1 (over
  black media). The pills do not ship a backdrop-blur, so this is
  content-dependent.
- **Focus indicators:** not styled. The default UA focus ring shows on
  `:focus-visible` for all buttons and links, but no custom ring is
  declared. `focus:outline-none` is applied to the dialog (the Base
  UI focus guard handles restoration).
- **Keyboard:**
  - All interactive elements are real `<a>` or `<button>` (no
    `onClick`-only divs).
  - Tab order: sidebar logo → live counter (non-interactive) → nav
    links → subscribe → copyright → sort button → feed cards (each
    card is one tab stop) → modal portal.
  - The dialog has a Base UI focus guard
    (`<span data-type="inside" aria-hidden="true" tabindex="0"
    data-base-ui-focus-guard>`) to trap focus.
  - Pressing Enter on a card's `<button>` opens the lightbox (not
    observed).
- **Screen reader landmarks:** `<main>`, `<aside>`, `<nav>`, `<header>`
  (implicit), `<footer>` (implicit via copyright), and a `<div
  role="dialog" aria-labelledby="base-ui-_r_1_">` for the modal with
  an `sr-only` H2 (`Subscribe to the Recent digest`) plus a visible H2
  (`Godly is now Recent`).
- **ARIA on cards:** every card's `<button>` carries an
  `aria-label` equal to the item's title ("Pillow", "Logo Collection",
  "Tikhon Belousko", …). The pills and FABs each carry their own
  `aria-label` ("View post", "5 slides").
- **Alt text:** every `<img>` has an `alt` attribute. Some are empty
  (`alt=""`) when the image is purely decorative (the creator avatar
  inside a pill that already carries the name).
- **Motion (reduced):** *Not handled* — see Motion & Interaction.
- **Form labels:** the email input has no associated `<label>`, but
  the placeholder `design@god.com` plus the surrounding copy make the
  purpose clear. WCAG 3.3.2 (labels or instructions) is satisfied by
  the placeholder, but adding a visually-hidden `<label>` would be
  better.

---

## Sources

URLs actually opened or fetched while writing this specification:

- Homepage (live) — https://godly.website/ (now resolves to
  https://recent.design/, branded *Recent — Design Inspiration*).
- Homepage (dump) — `tools/tmp/godly/playwright/homepage.html` and
  `tools/tmp/godly/playwright/css/app-CpizTGcq__89cee7dd.css` —
  the post-hydration DOM and the bundled Tailwind v4 stylesheet.
- Computed styles — `tools/tmp/godly/playwright/computed-styles.json`
  (Playwright-sampled computed styles for 31 visible elements).
- Live counter API — `https://cdn.visitors.now/v.js?token=…` →
  `tools/tmp/godly/playwright/other/online__c2c35f79` (`{"count":47}`).
- Cloudflare beacon — `https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447`
  with `data-cf-beacon='{"version":"2024.11.0",…}'`.
- Manifest — `tools/tmp/godly/manifest.json` (54 files, 6.2 MB).
- Gallery CDN (referenced, not fetched in full) —
  `https://cdn.recent.design/`.
- Notable creator handles surfaced in the dump (used only to confirm
  attribution patterns, not for content extraction): `tikhon.io`,
  `bamojk` (Bimo Tri. P), `lancedraws`, `bptrz` (Borys),
  `joshpuckett`, `guillaumebth`, `Metagravity0` (max.jpg),
  `JoranEntjes`, `dakshpixelup` (Daksh), `hieudinh_` (Hieu Dinh),
  `its_sslvr` (Sha).
- Featured App Store IDs surfaced in the dump (used only to confirm
  attribution, not to describe content): `id878691772` (Pillow),
  `id1482725254` (Open), `id6740909540` (Manus), `id1628994767`
  (Numo), `id6443709020` (Retro).

## Changelog

- 2026-06-20 — Initial draft. Authored from the Playwright dump of
  `godly.website` (now redirecting to / branded as *Recent*). Covers
  the homepage shell, the masonry feed, the subscribe modal, the
  creator pill / view-post FAB / app-icon tile / slides-badge
  components, and the Tailwind v4 / React Router 7 / Base UI stack.
