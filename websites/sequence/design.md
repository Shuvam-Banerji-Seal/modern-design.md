# Sequence — design.md

> A structured design specification of **https://sequence.xyz**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode agent
> **Source dump:** `tools/tmp/sequence/` (gitignored)

---

## Overview

Sequence is the modular crypto-infrastructure platform that ships
smart-contract wallets, 1-click cross-chain payments, and a multi-chain
indexer behind a single developer API. The marketing site is a single-page
Remix application rendered against a **light theme by default** with an
optional dark variant (`data-theme="light"` on `<html>` at first paint). The
design is developer-tools-flavored but visually softer than typical SaaS:
generous whitespace, a deep-purple primary (`#6C00F6`), soft violet-tinted
section gradients, a four-tier product surface (Wallets, Payments, Indexer
plus verticals), and a wide hero with an animated dot-matrix background.

The page is structured as a vertical sequence of full-width sections — a
top announcement bar, sticky nav, hero, four product/feature cards, a
verticals grid, a customer-story block, a partner marquee, an end CTA, and
a multi-column footer — with a `body-3` small-text rhythm on top of an
`Inter`-led type stack.

**Category:** Marketing (developer infrastructure / Web3 SaaS)
**Primary surface observed:** Homepage (`/`) — full HTML dump in
`tools/tmp/sequence/playwright/homepage.html`; product sub-routes
(`/products/wallets`, `/products/payments`, `/products/indexer`) link out
from the homepage cards
**Tone:** Confident, technical, optimistic. Short declarative headlines
("Smart wallets for ecosystems and developers"). Marketing copy is
paraphrased and trimmed to single-sentence propositions per section.
**Framework detected (if any):** **Remix v2** (entry chunk is
`entry.client-…js`, hydration-style chunk layout with
`client-hvoIY3L3.js`, Radix Popper/Floating-UI primitives, `chunk-…js`
vendor split). Renders via React 18 with `useState` / `useEffect` /
`forwardRef` throughout. CSS is **Tailwind CSS v4.1.16** (the
`tailwind-B2rDFkA9.css` filename carries the license header
`/*! tailwindcss v4.1.16 | MIT License | https://tailwindcss.com */`).
No GSAP, Lottie, Framer Motion, Three.js, or WebGL observed in the dump —
motion is CSS-only with a single SVG `<animate>` background.

---

## Visual Language

### Color

The palette is defined as CSS custom properties on `:root` inside
`tools/tmp/sequence/css/tailwind-B2rDFkA9__c1b50d50.css`. Most colors are
expressed as `oklch(...)` so they can be themed with `color-mix(in oklab,
…)`. Brand tokens are hex. Where the browser computed style resolved to
`rgb(...)`, that value is also recorded.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Brand primary | `--color-brand-primary` | `#6C00F6` (rgb(108, 0, 246)) | Used on the announcement bar, the "bold" button gradient start, and active nav borders |
| Brand secondary | `--color-brand-secondary` | `#4F46E5` (indigo, oklch(49.1% 0.27 292.581)) | End-stop of the brand gradient |
| Background (base, light) | `--color-white` | `#FFFFFF` | Default page bg via `bg-white` on `<html>` |
| Background (base, dark) | `--color-black` | `#000000` | Toggled with `data-theme=dark` via `data-[theme=dark]:bg-black` |
| Background (header) | `--color-white` @ 80% | `oklab(0.999 0.00005 0.00002 / 0.8)` | Translucent header w/ `backdrop-blur-md` |
| Background (subtle) | `--color-slate-100` | `oklch(96.8% 0.007 247.896)` | Section tints |
| Background (elevated card) | `--color-white` | `#FFFFFF` | `data-component=card data-variant=raised` |
| Text (primary, light) | `--color-slate-950` | `oklch(12.9% 0.042 264.695)` | Default body text via `color-text-default` |
| Text (secondary / low) | `--color-text-low` → `--color-slate-500` | `oklch(55.4% 0.046 257.417)` | Sub-headlines and supporting copy |
| Text (muted, dark) | `--color-white-50` | `#FFFFFF80` | Footer column headers, dim labels in dark mode |
| Text (link) | `--color-text-link` / `--color-indigo-500` | `oklch(58.5% 0.233 277.117)` | Inline anchor accent |
| Text (link blue, blog) | `--color-link-blue` | `#82A5FF` | Rich-text links inside blog posts |
| Accent A — violet | `#7F22FE` | hex fallback `#7F22FE` / `#7f22fe` | Popbadge violet tint, also `#8B5CF6` in indexer gradient |
| Accent B — pink/magenta | `#FC5DFF` | hex literal `#FC5DFF` | Wallets gradient pair (`#FB64B6` → `#2B7FFF`) |
| Accent C — mint | `#57F49E` / `#00D492` | hex literal | Payments gradient pair (`#00D492` → `#615FFF`) |
| Accent D — cyan | `#45E6FF` | hex literal | Hero glow accents |
| Accent E — sky blue | `#51A2FF` / `#82A5FF` | hex literal | Indexer gradient pair (`#51A2FF` → `#8B5CF6`) |
| Accent F — indigo | `#615FFF` (rgb(97, 95, 255)) | observed bg | Secondary CTA on product cards |
| Border (light) | `--color-black / 5%` | `#0000000D` | Hairline borders, "outline" button border |
| Border (dark) | `--color-white / 10%` | `#FFFFFF1A` | Hairline borders on dark surfaces |
| Border (subtle / "subtle" btn) | `--color-white / 2%` | `#FFFFFF05` | Disabled / ghost button border |
| Status — success | `--color-emerald-500` | `oklch(69.6% 0.17 162.48)` | Inline confirmation pills |
| Status — warning | `--color-orange-500` ≈ `oklch(70.5% 0.15 286)` (tw approx.) | `#C2501F` literal in dark CTAs | Inline warning states |
| Status — destructive | `--color-red-500` | `oklch(63.7% 0.237 25.331)` | Destructive button bg fallback |

**Section gradient stops** (observed in
`tools/tmp/sequence/js/Marquee-D8SmDYXf__b0f4fe91.js`, the "section theme"
object passed to the decorative SVG behind each product card):

| Theme | Gradient A | Gradient B | Hex (uppercase) |
| --- | --- | --- | --- |
| `chains` | slate-700 | slate-900 | `#334155` → `#0F172A` |
| `defi` | violet-900 | violet-950 | `#4C1D95` → `#2E1065` |
| `stablecoins` | blue-900 | blue-950 | `#1C398E` → `#162456` |
| `gaming` | indigo-900 | indigo-950 | `#312E81` → `#1E1B4B` |
| `wallets` | pink-400 | blue-500 | `#FB64B6` → `#2B7FFF` |
| `payments` | emerald-500 | indigo-500 | `#00D492` → `#615FFF` |
| `indexer` | sky-400 | violet-500 | `#51A2FF` → `#8B5CF6` |

The only **hard-coded inline gradient** in HTML is on the customer-story
panel: `bg-gradient-to-br from-[#321E48] to-[#1C102B]` (deep eggplant →
near-black). A second hard-coded gradient appears on the section
mask-fades: `bg-gradient-to-t opacity-50 from-[#526881] to-[--alpha(#526881,0%)]`.

### Typography

The site uses a single sans-serif family — **Inter** — set as
`--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color
Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`. Mono is
the system mono stack (`ui-monospace, SFMono-Regular, Menlo, Monaco,
Consolas, "Liberation Mono", "Courier New", monospace`). Code blocks
explicitly opt into `font-family: Roboto Mono`.

Six semantic **headings** are exposed as `.h1`–`.h6`. Each has a base
mobile size and a `(min-width: 40rem)` sm-overrides size that resets
`--tw-leading` and bumps the size up. (Tailwind v4 emits both styles in
the cascade rather than under a media query block, but they read as
responsive.)

| Role | Family | Weight | Size (base) | Line-height (base) | Size (sm ≥ 40rem) | Line-height (sm) | Tracking |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `.h1` | Inter | 700 bold | `32px` | `1.3` | `52px` | `1.1` | `normal` |
| `.h2` | Inter | 700 bold | `32px` | `1.3` | `52px` | `1.1` | `normal` |
| `.h3` | Inter | 600 semibold | `28px` | `1.3` | `42px` | `1.2` | `normal` |
| `.h4` | Inter | 600 semibold | `20px` | `1.3` | `32px` | `1.2` | `normal` |
| `.h5` | Inter | 600 semibold | `20px` | `1.3` | `24px` | `1.2` | `normal` |
| `.h6` | Inter | 600 semibold | `18px` | `1.4` | `20px` | (default 1.4) | `normal` |

A separate **body-text ladder** is exposed as `.body-12`, `.body-14`,
`.body-16`, `.body-18`, `.body-20`. All are `font-weight: medium (500)`.
The body class also forces a `--tw-leading` value. (`.body-12` adds
`letter-spacing: 0.02px`.)

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| `.body-12` | Inter | 500 | `12px` | `1.333` | `0.02px` |
| `.body-14` | Inter | 500 | `14px` | `1.4` | `normal` |
| `.body-16` | Inter | 500 | `16px` | `1.4` | `normal` |
| `.body-18` | Inter | 500 | `18px` | `1.5` | `normal` |
| `.body-20` | Inter | 500 | `20px` | `1.5` | `normal` |

A finer numeric ladder `text-10` … `text-96` exists (`font-size:
calc(N / --base-unit * 1rem)`), letting callers opt out of the semantic
ladder. Common in-the-wild sizes observed in computed styles: `13px`,
`14px`, `15px`, `16px`, `18px`, `20px`, `32px`, `52px`. Body copy on the
hero paragraph runs at the `body-16` rhythm.

The Inter typeface is **not** self-hosted in this dump. The single font
file observed (`tools/tmp/sequence/playwright/fonts/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA__fb5169d9.woff2`,
40 128 bytes) is a Google-Fonts CSS2-obfuscated Roboto Mono fallback for
the code-block `font-family: Roboto Mono;` rule in
`tailwind-B2rDFkA9__c1b50d50.css`. Inter itself is loaded from the Google
Fonts CDN (the bundle name implies it) but no `<link rel="stylesheet"
href="fonts.googleapis.com/...">` survived the dump — the HTML carries
only the `entry.client` bootstrap and the Tailwind preloads.

The Tailwind `font-weight` scale collapses to four values: `400 normal`,
`500 medium`, `600 semibold`, `700 bold`. All four are observed in
computed styles.

### Spacing & radius

- **Base unit:** `4px` (`--spacing: .25rem`, `--base-unit: 16`).
- **Tailwind spacing scale:** every `--spacing * N` is a step. The
  observed spacing values cluster around `4, 8, 12, 16, 20, 24, 32, 40,
  48, 56, 64, 96, 120, 128, 140, 192, 400`. (`max-w-400` =
  `calc(var(--spacing) * 400)` = `100rem` = `1600px`.)
- **Section padding:** hero blocks use `max-w-140 md:max-w-wrapper-lg px-4`
  (`35rem` capped to `--container-wrapper-lg = 1080px` on md). Body
  blocks use `max-w-wrapper-lg` (1080px) or `max-w-wrapper-md` (920px) or
  `max-w-wrapper-sm` (800px). The widest fixed container is `max-w-400`
  (1600px) used by the header inner row.
- **Container tokens (custom):**
  - `--container-wrapper-sm: 800px`
  - `--container-wrapper-md: 920px`
  - `--container-wrapper-lg: 1080px`
  - `--container-blog-text: 680px`
  - `--container-2xl: 42rem` (672px)
- **Radii (custom scale):**
  - `--radius-sm: 0.25rem` (4px)
  - `--radius-md: 0.375rem` (6px)
  - `--radius-lg: 0.5rem` (8px)
  - `--radius-xl: 0.75rem` (12px)
  - `--radius-3xl: 1.5rem` (24px)
  - Cards (`data-component=card`): `border-radius: 1.25rem` (20px).
  - Popbadge eyebrow variant: `0.35rem` (5.6px); small variant:
    `0.25rem` (4px).
  - Square button: `0.75rem` (12px).
  - Buttons (default "pill" radius): `border-radius: 3.40282e38px`
    (Tailwind's encoding of `9999px`).
- **Shadows (custom):** the header uses a dual 1-px-tall hairline shadow
  stack: `0 1px 0 0 oklab(0 0 0 / 0.05), 0 2px 1px 0 oklab(0 0 0 / 0.03)`
  in light mode; the `oklab` form is `oklab(0 0 0 / 0.05)` /
  `oklab(0 0 0 / 0.03)`. In dark mode the same rule uses
  `--alpha(var(--color-white)/10%)` and `… / 4%)`. Raised cards use
  `0 0 24px 0 var(--tw-shadow-color, oklab(55.4391% -0.00887 -0.0397 /
  0.1))` — a soft purple-tinted bloom. The reCAPTCHA badge has its own
  `rgb(128, 128, 128) 0 0 5px 0` shadow (third-party).
- **Blur tokens:** `--blur-md: 12px`, `--blur-lg: 16px`, `--blur-2xl:
  40px`, `--blur-3xl: 64px`. The header uses `backdrop-blur-md` (12px).

### Iconography

- **Style:** mostly stroked / line icons in the chrome (chevrons, arrows),
  plus product "feature card" inline illustrations built from
  positioned SVGs.
- **Library (if observable):** **No Lucide / Phosphor / Heroicons**. The
  chevron SVGs in the homepage are inline
  (`<svg viewBox="0 0 20 20" ...><path .../></svg>`) and rotate `90deg`
  for vertical menus. The page also ships a custom decorative
  `tools/tmp/sequence/svgs/matrix__ae6c4025.svg` (4096 × 2288) used as a
  tiled dot-grid background.
- **Default size:** `size-4` (16px) inline; `size-5` / `size-6` for nav
  chevrons. The hero background SVG renders at `[&_svg]:w-[1662px]
  [&_svg]:h-[1662px]` (clipped to viewport with `overflow-hidden` and
  translated `-420px` on the top-left).
- **Icon SVGs in the chrome:** the chevron is `viewBox="0 0 20 20"` with
  a single stroked path; the trailing arrow on nav is
  `viewBox="0 0 24 24"` with a 1.5-px stroke at `size-4`.

---

## Layout & Grid

- **Page gutter:** `px-4` (16px) on mobile, `sm:px-8` (32px) on ≥40rem.
  Section inner blocks also take `px-4 sm:px-8` against
  `max-w-400`.
- **Max content width:** page-level container is `max-w-400` = 1600px for
  full-bleed rows (header, footer); inside that, section content caps at
  `max-w-wrapper-lg` = 1080px; blog copy caps at `--container-blog-text`
  = 680px; product card inner copy caps at `max-w-140` (560px) on
  mobile and `max-w-wrapper-lg` on md+.
- **Grid:** Tailwind v4 utilities are the source of truth. Two-column
  product cards use `grid md:grid-cols-2`; the verticals grid uses
  `grid grid-cols-2 md:grid-cols-4 gap-5`; the chain marquee uses
  `flex-5 grid xs:grid-cols-4 xs:gap-0 gap-10 grid-cols-2 md:mt-0 mt-10`.
  A 12-column system is available via `md:grid-cols-12` but is not the
  dominant pattern.
- **Breakpoints:**
  - `xs`: 428px (custom — used for the chain marquee)
  - `sm`: 640px (`40rem`)
  - `md`: 768px (`48rem`)
  - `lg`: 1024px (`64rem`)
  - `xl`: 1280px (`80rem`)
  - `3xl-splash`: 1936px (custom — used for `rounded-t-3xl` on
    ultra-wide)
- **Vertical rhythm:** 8-px baseline via `--spacing` multiples of
  `0.25rem` (4px). Section gaps between product cards:
  `gap-10` (40px). Vertical padding inside cards:
  `md:p-8 md:p-10`. Hero section padding bottom:
  `md:pb-7 md:pt-40` (the hero is allowed to run very tall on desktop).

**Homepage layout, top to bottom:**

1. **Announcement bar** — full-bleed `bg-brand-primary text-white body-3
   font-normal lg:h-16 max-lg:p-4`. Carries a single sentence plus an
   inline underlined link (`<a class="underline">`). Trims to
   `max-w-[96rem]` (`1536px`) inside its row.
2. **Header** — `md:sticky top-0 w-full min-h-16 md:min-h-20` (64–80px
   tall). Three-column flex: logo block (left), nav (center), utility
   + CTA (right). Background `bg-white/80 backdrop-blur-md` with the
   hairline shadow stack noted above. A second `<nav>` is rendered for
   `<lg` viewports and slides under the header as a sticky second row.
3. **Hero** — `min-h-screen` hero panel. Decorative `1662×1662` SVG with
   a noise-tiled `<img src="/bg-noise@2x.webp">` overlay sits absolutely
   positioned at `top-[-420px] left-[-420px]`. Above it sits a content
   column with the `<h1>`, a `body-16` paragraph in `text-text-low`,
   the popbadge ("Now live"), a primary CTA pair, and the home-hero
   illustration (`/home-hero@2x.webp`).
4. **Social-proof row** — a single centered paragraph ("Powering millions
   of blockchain interactions across leading apps and chains").
5. **Product card 1 (Wallets)** — `data-component=card data-variant=raised`,
   two-column grid, `md:grid-cols-2` with a decorative background SVG
   themed `wallets`. Card popbadge in violet.
6. **Product card 2 (Payments)** — same `card raised` anatomy, themed
   `payments`. Image asset: `/products-payments/payments-hero@2x.webp`.
7. **Product card 3 (Indexer)** — same `card raised` anatomy, themed
   `indexer`. Image: `/products-indexer/indexer-hero@2x.webp`. Below
   the image is a horizontal logo marquee of customer / chain partners
   (Arbitrum, Avalanche, Base, Google Cloud, Immutable, Polygon,
   Qorpo World, SKALE, Take-Two, Ubisoft, Xsolla, Tapnation).
8. **Verticals grid** — four-up card grid (`grid-cols-2 md:grid-cols-4`).
   Each card carries a 1-line title (`<h3>`) and a 1-sentence body-16
   description. H2 above: "Solutions for every vertical".
9. **Customer story** — full-width panel
   `bg-gradient-to-br from-[#321E48] to-[#1C102B]` with the Somnia logo
   (`/customer-stories/logo-somnia.webp`) and a 1-paragraph quote.
10. **End CTA** — `bg-gradient-to-l from-transparent to-slate-900`
    scrim over the dark-CTA background, with an h2 "Start" and a single
    primary CTA button.
11. **Footer** — four-column link grid (Products / Solutions / Company /
    Resources / Social) under a "Powered by Sequence" wordmark, then a
    cookie-consent fine-print at the very bottom.

---

## Components

The dump ships a small in-house design system implemented with
**`data-component` + `data-variant` attribute selectors** in
`tools/tmp/sequence/css/tailwind-B2rDFkA9__c1b50d50.css`. The system
covers the components below. Each component is described with its base
anatomy, variants, and any responsive behavior observed.

### Button

- **Variants:** `bold`, `raised`, `subtle`, `transparent`, `outline`,
  `square`. Combinations allowed via space-separated `data-variant~=`.
- **Base anatomy (from the CSS):**
  `padding-inline: calc(var(--spacing) * 4)` (16px),
  `padding-block: calc(var(--spacing) * 2)` (8px),
  `font-size: calc(15 / var(--base-unit) * 1rem)` (15px),
  `font-weight: var(--font-weight-medium)` (500),
  `white-space: nowrap`,
  `transition-property: opacity`,
  `border: 1px solid transparent`,
  `border-radius: 3.40282e38px` (effectively pill),
  `display: flex; justify-content: center; align-items: center`.
- **Variant recipes (resolved computed styles):**
  - **bold** — gradient background
    `linear-gradient(to right, var(--color-brand-primary),
    var(--color-brand-secondary))` ⇒ `#6C00F6` → `#4F46E5`. Text
    `var(--color-white)` = `#FFFFFF`.
  - **subtle** — translucent white surface
    `background-color: #ffffff1a` ⇒ ≈ 10% white; border
    `#ffffff05` ≈ 2% white; text white. Used for ghost buttons on dark
    surfaces.
  - **outline** — border `#00000026` ≈ 15% black; text
    `var(--color-slate-950)` ≈ `#020617`.
  - **square** — `min-height: 48px`,
    `padding-inline: 12px`, `padding-block: 8px`, `border-radius:
    12px`.
- **Hover / focus:** `:hover { opacity: .8 }`,
  `:focus-visible { opacity: .8 }`. The single interaction property is
  opacity — there is no scale, no background shift, no shadow lift.
- **Active / disabled:** active states are not separately styled;
  disabled buttons drop `pointer-events: none` and `opacity: .2`.

### Input / Field

- **Anatomy:** the dump carries `Label-…js`, `FieldError-…js`, and
  `CTA-…js` React components used inside HubSpot forms. The visible
  recipe in HTML is plain `<input>`/`<textarea>` with Tailwind utility
  classes; the components add `text-black-50` placeholders, white-25/15
  border tints, and a `focus-within:ring-2` focus ring.
- **Placeholder tints:** `text-slate-400` (light) or
  `text-white-50` / `text-white-60` / `text-zinc-400` (dark contexts).
- **Helper/error:** `FieldError` adds a small red helper string below
  the field; not separately themed in the CSS — it inherits body-12
  sizing from the form layout.

### Card (`data-component="card"`)

- **Base anatomy:** `border: 1px solid #00000026` (≈ 15% black),
  `border-radius: 1.25rem` (20px), `display: flex;
  flex-direction: column`.
- **`data-variant="raised"`:** `background-color: var(--color-white)`,
  `box-shadow: 0 0 24px 0 oklab(55.4391% -0.00887 -0.0397 / 0.1)`
  (a soft purple bloom).
- **Used as:** the three product cards (Wallets, Payments, Indexer) and
  a few verticals cards.
- **Layout:** the card itself is a `grid md:grid-cols-2 w-full
  overflow-hidden`; left half holds a relative-positioned decorative
  SVG cluster (`*:col-start-1 *:row-start-1` stacked layers), right
  half holds the text content (`max-w-140 md:max-w-wrapper-lg px-4
  flex flex-col items-center mx-auto gap-10`).

### Popbadge (`data-component="popbadge"`)

- **Base anatomy:** `padding-inline: 12px`, `padding-block: 8px`,
  `font-weight: bold (700)`, `border-radius: 8px`, `display: flex;
  align-items: center`.
- **Variants:**
  - **`color-violet`:** `background-color: #7f22fe33` ≈ 20% violet,
    text `var(--color-violet-600)` (`oklch(54.1% 0.281 293.009)`).
  - **`color-white`:** `background-color: #ffffffbf` ≈ 75% white, text
    violet, with a `0 0 24px 0` violet-tinted shadow plus
    `backdrop-filter: blur(16px)`.
  - **`eyebrow`:** 12px text, `border-radius: 5.6px`,
    `padding-inline: 6px`, `padding-block: 2px`.
  - **`small`:** 10px uppercase, `border-radius: 4px`,
    `padding-inline: 6px`, `padding-block: 2px`.
- **Used as:** the small pill above the hero H1 ("Now live" etc.) and
  inline above section titles.

### Aspect ratio (`data-component="aspect-ratio"`)

- **Style:** an inline `style="aspect-ratio:16/9"` is the only observed
  use. There is a 255-byte companion CSS
  (`AspectRatio-CphadI6-__1bb8469a.css`) that sets a single fallback
  rule.

### Marquee (`data-component="marquee"`)

- **Two flavors:** CSS-only `Marquee-DOFRu58h.css` for the brand-logo
  strip (uses `@keyframes scroll-left` driving `transform:
  translate(-50%)`), and a JS-driven `Marquee-D8SmDYXf.js` that
  inlines a custom `<svg>` for the decorative per-theme background
  shape behind each product card.
- **CSS marquee:** the brand strip sits inside a
  `data-animate="true"` container with a `style="--speed:26s;--offset:0px"`
  custom property driving `animation: scroll-left var(--speed) linear
  infinite forwards`.
- **JS marquee:** defines a theme object
  (`{ chains, defi, stablecoins, gaming, wallets, payments, indexer }`)
  of two-color gradients and renders an inline SVG with two diagonal
  gradient masks. The shapes sit on a `bg-[url('/bg-noise@2x.webp')]`
  layer with `mix-blend-multiply` and `mask-mode: alpha`.

### Nav (top bar)

- **Height:** `min-h-16` (64px) on mobile, `md:min-h-20` (80px) on
  desktop. Header is `md:sticky top-0` with the hairline shadow stack.
- **Anatomy:** `<header>` is a flex row with `justify-content: center`
  and `max-w-400` inner. Inside: logo block (left, with the wordmark
  SVG), `<nav aria-label="Main">` (center, hidden `<lg`, hidden on
  mobile replaced by a second sticky sub-nav), utility / CTA cluster
  (right). A theme toggle button is in the right cluster.
- **Active link:** the active route gets
  `aria-[current=page]:border-[#6D28D9] aria-[current=page]:text-[#6D28D9]`
  — a violet hairline underline and violet text.

### Footer

- **Anatomy:** four-column link grid (Products / Solutions / Company /
  Resources / Social). Each column header uses `text-white-50
  not-first:mt-6` (12px tracked medium grey). Links underneath are
  `body-14` white at 80% opacity. A cookie-consent notice sits in the
  very bottom band as a `text-13` fine-print.
- **Decorative image:** a full-bleed
  `/home-footer@2x.webp` (100 870 bytes) is preloaded and rendered as
  the footer's dark backdrop.

### Other z-index tokens observed in the homepage

The chrome uses a small z-index ladder — most layers are `z-1` / `z-2`
/ `z-10` / `z-20`, with two notable exceptions:
- **`z-200`** — the `<header>` and the mobile sub-nav (top of the
  stacking context).
- **`z-10000`** — the reCAPTCHA badge.

### Custom font-weight scale

A custom `font-weight-bold` (700) is exposed as a Tailwind utility in
addition to the four-step Tailwind default. The popbadge base rule uses
`--tw-font-weight: var(--font-weight-bold, 700)` so the badge label
always renders 700 regardless of context.

### Heading utility class index

The Tailwind v4 cascade emits **two declarations per heading** — a
mobile-first size and a `@media (min-width: 40rem)` override. In the
rendered HTML, the same `.h1` selector resolves to whichever wins:

| Class | Mobile (default) | ≥ 40rem |
| --- | --- | --- |
| `.h1` | 32px / lh 1.3 / bold | 52px / lh 1.1 |
| `.h2` | 32px / lh 1.3 / bold | 52px / lh 1.1 |
| `.h3` | 28px / lh 1.3 / semibold | 42px / lh 1.2 |
| `.h4` | 20px / lh 1.3 / semibold | 32px / lh 1.2 |
| `.h5` | 20px / lh 1.3 / semibold | 24px / lh 1.2 |
| `.h6` | 18px / lh 1.4 / semibold | 20px |

### Body utility class index

All `body-*` classes fix `font-weight: 500` (medium) regardless of
Tailwind default. `.body-12` is the only one that adjusts tracking
(`letter-spacing: 0.02px`).

| Class | Size | Line-height |
| --- | --- | --- |
| `.body-12` | 12px | 1.333 |
| `.body-14` | 14px | 1.4 |
| `.body-16` | 16px | 1.4 |
| `.body-18` | 18px | 1.5 |
| `.body-20` | 20px | 1.5 |

The numeric `text-10` … `text-96` ladder resolves to
`font-size: calc(N / --base-unit * 1rem)` so it tracks the `--base-unit`
override (default 16). Changing `--base-unit: 18` would scale the whole
ladder proportionally without touching the semantic `.h*`/`.body-*`
classes.

### Spacing scale (used in HTML)

`padding` and `gap` tokens observed in the rendered HTML, ordered by
usage count: `gap-4`, `gap-5`, `gap-8`, `gap-10`, `gap-12`, `p-4`,
`p-6`, `p-8`, `p-10`, `px-4 sm:px-8`, `py-3`, `py-8`, `py-12`,
`py-14`, `py-16`, `py-20`, `pt-8`, `pt-14`, `pt-20`, `pt-40`, `pb-0`,
`pb-7`. Section inner padding is consistently `px-4 sm:px-8` against
the `max-w-400` / `max-w-wrapper-lg` container. Vertical padding of
the hero block is the largest in the design (`pt-40 = 160px` top on
desktop).

### Border-radius usage in HTML

Observed border-radius tokens: `rounded-[0.5rem]` (8px), `rounded-8px`
(Tailwind literal), `rounded-[1.5rem]` (24px on the customer-story
panel), `rounded-t-3xl` (top corners only, used at the
`3xl-splash` 1936-px breakpoint), `rounded-sm` (4px on inline badges),
pill (`9999px` on buttons and chain marquee chips).

### Tracking tokens

Only **one** explicit `tracking-*` utility is shipped:
`tracking-tight` (= `-0.025em`). Every other rule uses the default
`letter-spacing: normal`. Numeric tracking is baked into the `.body-12`
rule (`0.02px`).

### (Not observed)

- **Modal / Dialog:** no modal markup is in the homepage dump. The
  Floating-UI + Radix Popper code is loaded (`data-radix-popper-content-wrapper`
  in the dependency JS) but no dialog is mounted on `/`.
- **Toast:** not observed.
- **Tabs / Accordion:** not observed on the homepage (the customer-story
  `<details>`-style summary block is rendered but no `<details>` is
  present in the rendered HTML).

---

## JavaScript & Libraries

The page is a Remix v2 application. Detection source is the
`tools/tmp/sequence/js/` filename pattern and the `entry.client` import
graph.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Remix | 2.x (entry chunk `entry.client-D7NJFvuQ.js`) | `entry.client-…js` filename and the standard `ReactDOM.hydrateRoot` bootstrap | Renders the route tree, hydrates the `<header>` / hero / footer markup |
| React | 18.x (uses `useState`, `useEffect`, `useRef`, `forwardRef`, `createPortal`) | `i.useState`, `i.useEffect`, `i.createContext`, `forwardRef` calls in `chunk-…js`, `index-…js` | Standard hooks; `i.useId` observed for SSR id stability |
| React DOM | 18.x | `ReactDOM.hydrateRoot` in `entry.client-D7NJFvuQ.js` | Standard Remix v2 SSR hydration |
| Radix UI (Popper + Dismissable) | 1.x (current at time of dump) | `data-radix-popper-content-wrapper`, `DismissableLayer`, `PopperContent` classes in `index-D6Di3smm.js` | Used to anchor popovers; portal into `document.body` |
| Floating UI (react-dom) | 1.x | `floating-ui.react-dom-C40icg98.js` chunk (23 838 bytes) | Provides positioning middleware under Radix Popper |
| Tailwind CSS | 4.1.16 | license header on `tailwind-B2rDFkA9.css`; `@layer base`, `@property`, `@supports (color: color-mix(in lab, …))` | Tailwind v4 — single CSS file, no PostCSS plugin runtime, uses native cascade layers |
| Zod | 3.x | `ZodError-Cjpc-MGv.js` chunk (117 088 bytes) | Used for form validation in Remix actions |
| js-cookie | 3.0.5 | license comment `/*! js-cookie v3.0.5 | MIT */` in `root-DtiJywcg.js` | Cookie read/write for theme + analytics IDs |
| react-gtm | 0.x | `import { useGTM }` style fallback in `root-DtiJywcg.js` | Google Tag Manager event helper |
| Databeat | (vendor) | `databeat-Bzh_PXhf.js` chunk (15 877 bytes) | Likely web analytics tag |
| Google reCAPTCHA v3 | `MerVUtRoajKEbP7pLiGXkL28` | `<script src="https://www.google.com/recaptcha/api.js?render=6LeadPAqAAAAAAqyDEJ78HtuyvhDUAjaGtyg1_ft">`, badge mounted at bottom-right | Invisible, key rendered is `6LeadPAqAAAA…ft` |
| Google Tag Manager | GTM-NKLC7Q8 | `https://www.googletagmanager.com/gtm.js?id=GTM-NKLC7Q8` | Loaded with consent-mode-style frame (`gtm_cookies_win=x`) |
| Google Ads (gtag.js) | AW-11154502718 | `https://www.googletagmanager.com/gtag/js?id=AW-11154502718` | Conversion linker |
| Google Analytics 4 | G-B4F1CT9GP2 | `https://www.googletagmanager.com/gtag/js?id=G-B4F1CT9GP2` | Page views + engagement |
| ID5 sync | (id5-api.js) | `https://cdn.id5-sync.com/api/1.0/id5-api.js` | Cookie-less ID sync for ad targeting |
| LinkedIn Insight | (li.lms-analytics) | `https://snap.licdn.com/li.lms-analytics/insight.min.js` | B2B retargeting pixel |
| Medium widget | (medium-g1D40yQX.js) | chunk filename | Embedded "follow on Medium" widget for the blog |
| Twitter widgets | (widget_iframe.1227a5674072e080ffb1ba14ac0c1079.html) | iframe loaded in body | Used to track embed impressions |

**No** GSAP, Framer Motion, Lottie, Three.js, WebGL, Barba, or Swup were
observed. Motion is CSS-only with one SVG `<animate>` background.

---

## Animations (Catalog)

### CSS @keyframes

Three named keyframes live in
`tools/tmp/sequence/css/tailwind-B2rDFkA9__c1b50d50.css`. All are
emitted by Tailwind v4's `@layer base` and consumed by the
`data-animate` / `animate-*` utility classes.

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `spin` | `css/tailwind-B2rDFkA9__c1b50d50.css:~line 13430` (`@keyframes spin{to{transform:rotate(360deg)}}`) | `1s` (consumed via `animate-spin`) | `linear infinite` | Loader spinners — not observed in homepage HTML |
| `pulse` | `css/tailwind-B2rDFkA9__c1b50d50.css:~line 13433` (`@keyframes pulse{50%{opacity:.5}}`) | `2s` (consumed via `animate-pulse`) | `cubic-bezier(.4,0,.6,1) infinite` | Standby / loading state |
| `scroll-left` | `css/tailwind-B2rDFkA9__c1b50d50.css:~line 13436` (`@keyframes scroll-left{to{transform:translate(-50%)}}`) | `26s` (passed via `style="--speed:26s;--offset:0px"` on the brand-strip container) | `linear infinite forwards` | The brand-logo marquee strip in the homepage hero; the container carries `data-animate="true"` |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| Inline SVG `<animate>` | `attributeName="opacity" values="0.1;0;0.1" dur="4.8s" repeatCount="indefinite"` (also `2.4s` and `3.6s` variants in the same SVG) | page load | Lives inside `tools/tmp/sequence/svgs/matrix__ae6c4025.svg`. Each rectangle animates its opacity in a desynchronized loop, producing the subtle "dot matrix breathing" backdrop |
| React state (Radix `data-*` lifecycle) | `data-entering` → `data-entered` → `data-exiting` → `data-exited` on `<motion>`-style elements | popper mount / unmount | Tailwind variant classes `data-entering:translate-x-0`, `data-exiting:translate-x-16`, etc., drive the open/close transitions of the nav chevron and any popover portals |

### Page transitions

- **None at the route level.** The Remix app does not use a shared
  `app/template.tsx` crossfade — navigation between `/`, `/about`,
  `/blog`, `/products/wallets`, etc. is a hard cut.
- **Theme toggle** is implemented client-side via
  `useColorScheme-DPzDulpU.js` (242 bytes), which writes the
  `data-theme` attribute to `<html>` and persists the choice in a
  cookie (handled by `js-cookie`).
- **Reduced-motion:** no `@media (prefers-reduced-motion: reduce)`
  block observed in the dumped CSS. The `scroll-left` animation runs
  unconditionally when `data-animate="true"` is present.

---

## Assets

### 3D models

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| — | — | — | — | N/A — no 3D assets observed in the dump |

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Inter | 400, 500, 600, 700 (per the Tailwind `--font-weight-*` scale) | woff2 | Google Fonts CDN (no `<link>` survived the dump; the stack resolves to Inter as the first choice) | No |
| Roboto Mono | 400 | woff2 | `tools/tmp/sequence/playwright/fonts/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA__fb5169d9.woff2` (40 128 bytes, Google-CSS2-obfuscated) | Yes (this single fallback file) |
| System mono fallback | — | — | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` (CSS) | n/a |

### Images

The dump carries the homepage hero, three product hero illustrations, a
footer backdrop, the customer-story wordmark, a chain-logo strip, and a
noise overlay. All `@2x` versions are WebP.

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/sequence/playwright/images/home-hero@2x__20d68ec2.webp` | WebP | hero (intrinsic) | 48 526 B | `https://sequence.xyz/home-hero@2x.webp` | Hero illustration |
| `tools/tmp/sequence/playwright/images/home-footer@2x__facaf6f2.webp` | WebP | footer-wide | 100 870 B | `https://sequence.xyz/home-footer@2x.webp` | Footer dark backdrop |
| `tools/tmp/sequence/playwright/images/payments-hero@2x__e4d7e01a.webp` | WebP | card | 95 570 B | `https://sequence.xyz/products-payments/payments-hero@2x.webp` | Payments product card |
| `tools/tmp/sequence/playwright/images/indexer-hero@2x__3e777f1f.webp` | WebP | card | 64 810 B | `https://sequence.xyz/products-indexer/indexer-hero@2x.webp` | Indexer product card |
| `tools/tmp/sequence/playwright/images/wallets-demo-sign-in@2x__a904f980.webp` | WebP | card | 103 132 B | `https://sequence.xyz/products-wallets/wallets-demo-sign-in@2x.webp` | Wallets product card |
| `tools/tmp/sequence/playwright/images/bkgr-somnia__b5a5516b.webp` | WebP | block | 125 258 B | (Somnia case-study bg) | Used inside the customer-story panel |
| `tools/tmp/sequence/playwright/images/logo-somnia__9fcd7a21.webp` | WebP | logo | 17 472 B | `https://sequence.xyz/customer-stories/logo-somnia.webp` | Customer-story wordmark |
| `tools/tmp/sequence/playwright/images/bg-noise@2x__df933916.webp` | WebP | tile (816 B) | 816 B | `https://sequence.xyz/bg-noise@2x.webp` | Noise tile, used with `mix-blend-multiply` over the per-card SVG gradients |
| `tools/tmp/sequence/playwright/images/brand-tapnation__c421e5d5.webp` | WebP | logo | 4 614 B | `https://sequence.xyz/products-indexer/brand-tapnation.webp` | Chain / partner logo |
| `tools/tmp/sequence/playwright/images/logo_48__c1452452.png` | PNG | 48×48 | 2 228 B | (apple-touch-ish) | Favicon alt |
| `tools/tmp/sequence/playwright/images/preview-sequence-home__35e339ff.png` | PNG | OG | (also in `images/` root) | OG image — `https://sequence.xyz/preview-sequence-home.png` | Open Graph preview |
| `tools/tmp/sequence/images/*.webp` (24 chain tokens) | WebP | 32×32 each | ≈2 KB each | `/chains/<hash>-32x32.webp` | Per-chain token icons used in the brand-strip marquee |

### SVGs & icons

- **Inline SVGs in HTML:** 1 inline chevron / arrow SVGs in the visible
  markup (the rest of the chrome icons are rendered as React component
  fragments from `index-*.js`). One large decorative `<svg>` is mounted
  per product card by `Marquee-D8SmDYXf.js`.
- **Standalone SVG files:**
  - `tools/tmp/sequence/svgs/sequence-wordmark__4fcc3778.svg` — the
    Sequence "wordmark" lockup (124 × 16 px, 10 670 B).
  - `tools/tmp/sequence/svgs/sequence-wordmark-light__fafaebc9.svg` —
    same wordmark, light variant (10 684 B).
  - `tools/tmp/sequence/svgs/matrix__ae6c4025.svg` — 4096 × 2288
    animated dot-matrix background, 30 KB+; each rect carries an
    independent `<animate attributeName="opacity">` loop with desynced
    `dur` values (`2.4s`, `3.6s`, `4.8s`, …).
  - `tools/tmp/sequence/svgs/favicon__55f1b0ec.svg` — 512 × 512 favicon
    (PNG embedded as `data:image/png;base64,…`).
  - `tools/tmp/sequence/svgs/brand-{arbitrum,avalanche,base,google-cloud,immutable,polygon,qorpo-world,skale,take-two,ubisoft,xsolla}.svg` —
    customer / chain wordmarks, 1.8–9.8 KB each.
- **Icon system:** No Lucide / Phosphor / Heroicons. Custom inline
  SVGs only. (The matrix SVG, the chevrons, and the per-product
  decorative SVGs are all hand-rolled.)

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| — | — | N/A — no audio or video files observed in the dump |

---

## Motion & Interaction

### Principles

- **Opacity over transform:** the button's only state transition is
  `transition-property: opacity; transition-duration:
  var(--default-transition-duration)` where
  `--default-transition-duration: .15s`. Press feedback, hover, and
  focus-visible all collapse to `opacity: .8`.
- **Default easing:** `--default-transition-timing-function:
  cubic-bezier(.4, 0, .2, 1)` — Tailwind's default `ease-out` variant.
- **Default duration:** `150ms` micro, with a custom
  `--transition-duration-400: .4s` available for longer fades.
- **No transforms on links.** Text links inherit color-only transitions
  (`color: var(--color-text-link)`). The nav-link active state changes
  color and border but not position.

### Specific behaviors

- **Link hover:** color shift to
  `var(--color-brand-primary)` (`#6C00F6`) via
  `hover:decoration-brand-primary`.
- **Button press:** opacity 0.8 across hover / focus-visible; no scale.
- **Section reveal on scroll:** not observed. There is no
  `IntersectionObserver`-driven reveal on the homepage — sections are
  fully present at first paint.
- **Page transition:** none (hard cut between routes).
- **Theme toggle:** the `useColorScheme` hook writes
  `data-theme="light" | "dark"` to `<html>` and persists the choice in a
  cookie. The CSS variants `data-[theme=dark]:bg-black`,
  `data-[theme=dark]:*:text-white!` etc. respond.
- **Header scroll behavior:** `md:sticky top-0` with a hairline shadow
  stack; background remains `bg-white/80 backdrop-blur-md` regardless
  of scroll position (no scroll-state class swap is implemented).
- **Chevron rotation:** the `<svg>` chevron in collapsed menus uses
  `rotate-90 in-inert:-rotate-90 transition-all` to swing the icon when
  the disclosure opens.

### Reduced motion

- **No `prefers-reduced-motion: reduce` block observed** in the dumped
  CSS. The marquee animation runs unconditionally on viewports that
  receive the `data-animate="true"` element.

---

## Content & Voice

- **Tone:** Confident, technical, declarative. Each section opens with
  a short two-word H2 (e.g. "Smart wallets", "Universal platform",
  "Reliable, multi-chain data"). Sub-copy is one sentence with a
  benefit-led clause followed by a feature list.
- **Sentence length:** short to medium. Active voice throughout. No
  rhetorical questions, no exclamation marks.
- **Capitalization:** **Sentence case** in headings and CTA labels.
  Product / feature names use Title Case ("Smart wallets", "1-click
  cross-chain payments").
- **Punctuation:** em-dashes used in the announcement-bar sentence;
  Oxford comma absent in lists; apostrophes are typographic (`’`) in
  headings but ASCII (`'`) in markup attributes.
- **CTA vocabulary:** "Read the docs" (link to `docs.sequence.xyz`),
  "Get started" / "Start free" (primary CTA on product cards),
  "Contact sales" / "Talk to us" (footer link). The final end-CTA
  reads "Start" with a single button.
- **Customer-quote attribution:** the customer-story panel ends with
  `"…their new Somnia Builder will go a long way toward helping more
  builders get started."` — quotation marks preserved around the
  spoken sentence.

---

## Information Architecture

Routes observed in `tools/tmp/sequence/playwright/homepage.html` (every
`<a href="/…">` or `href="https://…"` actually present in the markup).

- `/` — marketing homepage. Hero + 3 product cards + verticals grid +
  customer story + end-CTA + footer.
- `/about` — about page (linked from footer Company column).
- `/blog` — content index (footer + nav).
- `/chains` — supported chains index (linked from the brand-strip
  marquee area; also a footer link).
- `/products/wallets` — Wallets product page (linked from the Wallets
  card).
- `/products/payments` — Payments product page (linked from the
  Payments card).
- `/products/indexer` — Indexer product page (linked from the Indexer
  card).
- `/careers` — careers page (footer Company column).
- `/contact` — contact form (footer + end-CTA "Or talk with us").
- `/partner-directory` — partner directory (footer Resources).
- `/privacy` — privacy policy (footer Resources, also cookie consent).
- `/terms` — terms of service (footer Resources).
- `https://docs.sequence.xyz` — full docs root (nav "Docs", "SDK", "API
  Reference", "Guides" deep links all observed).
- `https://sequence.build` — companion "Sequence Builder" site
  (referenced in body text "Powering millions…").
- `https://support.sequence.xyz/en/` — help center (footer Resources).
- `https://github.com/0xsequence` — GitHub org (footer Social).
- `https://ca.linkedin.com/showcase/0xsequence/` — LinkedIn company page
  (footer Social).
- `https://blueprints.sequence-demos.xyz/` — demo deployment hub
  (referenced from the hero "Get started" CTA).
- `https://sequence.xyz/blog/sequence-polygon-move-money-globally` —
  announcement-bar deep link.

For each top-level route the primary component is the standard
`layout-light` shell (announcement bar + sticky header + main + footer).

---

## Accessibility

- **Color contrast:** the announcement bar
  (`bg-brand-primary` = `#6C00F6`, `text-white` = `#FFFFFF`) yields
  ≈5.9:1 contrast — passes WCAG AA for large text. Body text on
  `--color-white` background uses `--color-text-low` (slate-500)
  which yields ≈4.6:1 — passes AA for large text but is borderline for
  small body. Headings use `--color-slate-950` (near-black) on white,
  which yields >15:1.
- **Focus indicators:** every interactive element has a `:focus-visible`
  rule. Buttons use `opacity: .8`; links use the default UA ring plus
  the `focus-visible` text-color shift. Form fields use
  `focus-within:ring-2` (2-px ring) and `focus-within:outline-none`.
- **Keyboard:** nav is rendered as a real `<nav aria-label="Main">` with
  `<a>` children, so it is reachable in DOM order. The logo is wrapped
  in an `<a aria-label="Homepage">`. The theme toggle is a real
  `<button type="button">`. `Escape` is handled by the Radix
  `DismissableLayer` for any future dialog (mounted, unused on `/`).
- **Screen-reader landmarks:** the page exposes `<header>`, `<nav>`,
  `<main>` (implied by `<footer>` sibling), `<footer>`. The hero
  illustration has `role="img"` (no `aria-label` though — see below).
- **Motion:** `prefers-reduced-motion` is not handled (see Motion
  section). The marquee is decorative but the dot-matrix breathing
  background is mounted on the body.
- **Alt text:** the Sequence wordmark has `alt="Sequence"`; partner
  logos in the brand strip have **no alt text** (`<img src="…"
  alt="">` / `alt=""`); the hero illustration `home-hero@2x.webp` is
  rendered without alt (the surrounding copy already names the
  product).
- **Cookie banner:** a `<p class="text-13">` notice with a
  `<a href="/privacy">Privacy Policy</a>` link sits at the very
  bottom of the page. There is no in-flow cookie consent dialog.

---

## Sources

Every URL actually observed in the dump while writing this spec.

- Homepage — https://sequence.xyz/
- Homepage hero illustration — https://sequence.xyz/home-hero@2x.webp
- Homepage footer backdrop — https://sequence.xyz/home-footer@2x.webp
- Sequence wordmark (light) — https://sequence.xyz/sequence-wordmark-light.svg
- Sequence wordmark (dark) — https://sequence.xyz/sequence-wordmark.svg
- Payments product hero — https://sequence.xyz/products-payments/payments-hero@2x.webp
- Indexer product hero — https://sequence.xyz/products-indexer/indexer-hero@2x.webp
- Wallets product hero — https://sequence.xyz/products-wallets/wallets-demo-sign-in@2x.webp
- Noise tile — https://sequence.xyz/bg-noise@2x.webp
- Customer story wordmark — https://sequence.xyz/customer-stories/logo-somnia.webp
- About page — https://sequence.xyz/about
- Blog index — https://sequence.xyz/blog
- Careers — https://sequence.xyz/careers
- Chains index — https://sequence.xyz/chains
- Contact — https://sequence.xyz/contact
- Partner directory — https://sequence.xyz/partner-directory
- Privacy — https://sequence.xyz/privacy
- Terms — https://sequence.xyz/terms
- Polygon acquisition announcement (linked from announcement bar) —
  https://sequence.xyz/blog/sequence-polygon-move-money-globally
- Docs root — https://docs.sequence.xyz/
- Docs SDK overview — https://docs.sequence.xyz/sdk/overview
- Docs API reference — https://docs.sequence.xyz/api-references/overview
- Docs guides — https://docs.sequence.xyz/guides/guide-overview
- Sequence Builder — https://sequence.build/
- Support center — https://support.sequence.xyz/en/
- GitHub org — https://github.com/0xsequence
- LinkedIn — https://ca.linkedin.com/showcase/0xsequence/
- Demos hub — https://blueprints.sequence-demos.xyz/
- Google reCAPTCHA site key (read from network requests) —
  `6LeadPAqAAAAAAqyDEJ78HtuyvhDUAjaGtyg1_ft`
- Google Tag Manager container — `GTM-NKLC7Q8`
- Google Ads ID — `AW-11154502718`
- Google Analytics 4 ID — `G-B4F1CT9GP2`

---

## Changelog

- 2026-06-20 — Initial draft by opencode agent, sourced from
  `tools/tmp/sequence/` (254 files, 11.97 MB). Two-pass extraction
  (static grep of CSS / JS, dynamic Playwright dump of the rendered
  homepage). Headless Chromium viewport used for the runtime snapshot
  is the dump's default 1440×900.
