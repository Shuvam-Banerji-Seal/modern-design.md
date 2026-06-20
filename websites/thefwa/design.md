# The FWA — design.md

> A structured design specification of **https://thefwa.com/**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/thefwa/` (gitignored)

---

## Overview

The FWA (Favourite Website Awards) is a long-running **gallery / index** of
cutting-edge web design. Since 2000 it has collected one nominated site per
day, a runner-up per month, and an overall winner per year. The site itself
is not a CMS of marketing copy — it is a **reactive index of thumbnails**
laid out in reverse-chronological order (newest first) on a soft grey canvas.
A large hero block at the top shows the current "FWA of the Day", and below
it a continuous timeline of small case thumbnails scrolls into view as the
user moves down the page.

The visual language is deliberately quiet: white cards, hairline borders, a
single light-grey canvas, very few colours, and a signature `pixel-pattern`
dotted overlay (2×2px) that gives the day-number and thumbnail cells a soft
"etched" texture. Animation is restrained and slow — the dominant easing
curve is `cubic-bezier(.19, 1, .22, 1)` (≈ easeOutExpo). Awards are
signalled by **corner ribbons** (118×118 PNG, top-left, top-right, etc.) that
float above each thumbnail, not by coloured chips inside the card.

**Category:** Design gallery / curated index
**Primary surface observed:** Homepage (timeline of FOTD + recent cases)
**Tone:** Editorial, restrained, slightly precious, awards-program formal
**Framework detected (if any):** Client-rendered React SPA
(server-rendered shell, single `data-reactroot`, `<div id="root">`),
bundled with Webpack; React Router (hashHistory / browserHistory);
Stripe.js v3 (live key) for the FWA Club 100 paid membership; no
GSAP / Three.js / Lottie — animation is CSS-only.

---

## Visual Language

### Color

The palette is intentionally small: ~10% accent / 90% neutral. There is no
central design-token system — values are repeated literally throughout the
CSS. The dump contains 1,108 `@`-rules (most of them media queries and
keyframes) and 4 deduplicated `@keyframes` names.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | — | `#ECECEC` | `html, body` and outer header frame |
| Background (card) | — | `#FFFFFF` | thumbnail cells, scorecard, footer, button hover |
| Background (panel) | — | `#343333` | slide-in context menu (`contextual-menu__inner-list__items`) |
| Background (panel alt) | — | `#282828` | context menu bar at top of panel |
| Background (scorecard dark) | — | `#404040` | FOTD scorecard tile, cookie-notice bar |
| Background (subtle overlay) | — | `rgba(63,63,63,0.9)` | thumbnail hover veil (`.timeline-case__glitter-img__buttons-container`) |
| Background (video overlay) | — | `rgba(33,33,33,0.97)` | fullscreen YouTube modal |
| Border (hairline) | — | `#ECECEC` | every cell-to-cell divider in the timeline |
| Border (panel) | — | `#282828` | inner dividers in the dark context menu |
| Text (primary) | — | `#404040` | hero title, case title, button label |
| Text (secondary) | — | `#9A9A9A` | date, profile name, excerpt, button `—go`, category |
| Text (muted) | — | `#8E8E8E` | check-box label (`custom-checkbox`) |
| Text (inverted) | — | `#FFFFFF` | text on `context-menu` panel, active share button |
| Accent (red — FOTD) | — | `#DC4333` | FWA-of-the-Day ribbon, brand-red highlight |
| Accent (green — success) | — | `#44B75D` | success/active state, e.g. `rgba(68,183,93,0.85)` glow |
| Accent (yellow — FOTM) | — | `#FEC917` | FWA-of-the-Month ribbon |
| Accent (FB blue) | — | `rgba(59,89,152,0.45)` | Facebook share button hover |
| Pixel pattern (overlay) | — | `#E4E4E4` (`::before` of `.pixel-text`) + `pixel-pattern-overlay.png` (`::after`) | the etched-day-number look |

There is **no dark mode**. The site is single-theme, light-on-light.

### Typography

The site is set in **Good Pro**, a 3-weight humanist sans-serif (Hoftype /
Commercial Type lineage) self-hosted as `eot + woff + ttf`. No Google Fonts
or Adobe Fonts request is made. There are three faces in the family:

| Face | Weights seen | Used for |
| --- | --- | --- |
| `Good Pro` | 300, 400, 500, 700 (plus `lighter` keyword) | hero title, body, big day number |
| `Good Pro Book` | 400 | (declared) |
| `Good Pro Condensed` | 300 (`lighter`) | category, month, profile name, scorecard |

All stacks fall back to `sans-serif`. The site uses no system font stack.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Hero title (H1) | `Good Pro, sans-serif` | `lighter` (≈ 300) | `35px` | (default) | `-0.02em` |
| Hero category | `Good Pro Condensed, sans-serif` | `lighter` | `15px` | (default) | `0` |
| Hero excerpt | `Good Pro, sans-serif` | (default) | `15px` | `19px` | `0` |
| Hero day number (`.timeline-hero__intro__content`) | `Good Pro` (via `.pixel-text__text`) | `700` | `150px` (desktop) → `80px` (tablet) → `50px` (mobile) | `130px` → `65px` → `40px` | `0` |
| Hero day tail (`.pixel-text:last-child`) | `Good Pro` | (default) | `26px` | (default) | `0` |
| Hero month (`.timeline-hero__details-award--month`) | `Good Pro Condensed, sans-serif` | (default) | (inherits `15px`) | (default) | `0` (uppercase) |
| Scorecard big number (`.timeline-hero__meta-scorecard__number`) | `Good Pro` | (default) | `48px` | (default) | `0` |
| Scorecard label (`.timeline-hero__meta-scorecard__title`) | `Good Pro Condensed, sans-serif` | `lighter` | `15px` | (default) | `0` (uppercase) |
| Case title (timeline) | `Good Pro, sans-serif` | (default) | `19px` | (default) | `0` |
| Case date (day) (`.timeline-case__date--day`) | (default) | (default) | `20px` | (default) | `0` |
| Case date (month) | (default) | (default) | `15px` | (default) | `0` (uppercase) |
| Case profile/agency | `Good Pro Condensed, sans-serif` | (default) | (default) | `1` | `0` |
| Body / button | `Good Pro, sans-serif` | `300` (light) | `14–17px` | (default) | `0` |
| Caption / cookie notice | (default) | (default) | `12–14px` | (default) | `0` |
| Search page heading | (default) | `300` | `28px` | (default) | `0` |

Distribution: `font-weight: 300` appears 91 times, `400` 40 times, `700` 25
times, `500` 11 times. The site is unusually light-weighted — the body
text and most UI text are at weight 300, which is why it feels editorial.

The `font-size` distribution is also distinctive: `15px` dominates (148
uses), then `13px` (75), `14px` (38), `19px` (37), `28px` (35), then big
display sizes `150px` (3), `140px` (5), `80px` (8). Body text is
genuinely 13–15px, not the modern 16px default.

### Spacing & radius

- **Base unit:** ~5–10px (no CSS custom properties; values are literal)
- **Common padding values:** 5, 10, 12, 15, 18, 19, 20, 25, 30, 40, 48, 60
- **Border-radius values actually used:** `0` (8×), `1px` (4×), `2px` (3×),
  `3px` (2×), `4px` (11×), `5px` (5×), `20px` (1×), `50%`, `100%`. Almost
  everything is square or near-square. The only rounded surface of note is
  the dropdown grid (`border-radius: 4px 4px 0 0`) and a few small modal
  treatments.
- **Shadows:** **none.** `box-shadow` does not appear in the bundle at all.
  Elevation is communicated by hairline `border: 1px solid #ececec`, the
  dotted pixel pattern, and the corner ribbon PNGs.
- **Hairline rule:** almost every internal divider is `1px solid #ECECEC` —
  timeline rows, scorecard quadrants, header, footer, context-menu cells.

### Iconography

- **Style:** tiny inline PNG sprites served from `/assets/`. Examples:
  `arrow-light.png`, `arrow-dark.png`, `arrow-sprite.png`, `close.png`,
  `icon-search.png`, `coda-play.png`, `next-prev-dots.png`,
  `handle.png` (the scrollbar handle), `button-hover.png`.
- **No SVG icons** are present in the dump. The only SVG is
  `favicons/safari-pinned-tab.svg` and the inline Facebook-CSS classes
  injected by `connect.facebook.net/sdk.js`.
- **Ribbon icons** are 118×118px PNGs in 7 award categories × 4 corner
  positions = 28 ribbon assets: `fotd-tl/tr/bl/br.png`, `fotm-…`,
  `foty-…`, `motd-…`, `pca-…`, `tcea-…`, `tceay-…` and a `--small` 73×73
  variant. They float over the case thumbnail, `position: absolute`, with
  `pointer-events: none` so they do not steal hover.
- **Burger / close icon** in the top-left is three CSS-rendered horizontal
  bars (`.burger-icon span i`) that morph to an X (`.close-icon`) on menu
  open via `transform` transitions (see Animations).

---

## Layout & Grid

The page is built on a **custom 14-column grid** (`.span1` … `.span14`,
with matching `.push1` … `.push14` and `pushN-mobile/tablet/desktop`
variants) inside a fixed-width `.app-container` of `1366px` (desktop ≥ 1440
wide), `1128px` (1200–1439), `960px` (1000–1199), `708px` (720–999),
`540px` (568–719), `316px` (≤ 567). The grid gutter is implicit: each
`.spanN` is `N × (column + gutter)`, and the column itself appears to be
~89px wide on the largest breakpoint with a ~8px gutter. There is no
`flexbox` or `grid` on the main layout — it is a classic `float`-based
CSS grid: `[class^=span]{float:left}`.

| Breakpoint | Range (px) | Container width | `.span1` | `.span14` |
| --- | --- | --- | --- | --- |
| `xl` (desktop) | ≥ 1440 | `1366px` | `97px` | `1364px` |
| `lg` | 1200–1439 | `1128px` | `80px` | `1126px` |
| `md` | 1000–1199 | `960px` | `68px` | `958px` |
| `sm-tablet` | 720–999 | `708px` | `50px` | `706px` |
| `lg-mobile` | 568–719 | `540px` | `38px` | `538px` |
| `sm-mobile` | ≤ 567 | `316px` | `22px` | `314px` |

The header is `position: fixed; top: 0; height: 61px; z-index: 210` with
`will-change: scroll-position` and a `translateZ(0)` hack to keep it on
its own compositing layer. It has a 1px border on left/right/bottom in
`#ECECEC` and the same `#ECECEC` background as the page (so it visually
merges with the page when the user is at scroll-y 0).

Page sequence, top to bottom:

1. **Fixed top header** (`.header-main`, 61px) — logo (left), filter
   button (left), search icon (centered, spans 8/14), rotating promo
   ad (right, 4/14). `position: fixed; top: 0`. The header background
   is the page `#ECECEC`; only the three inner `.span` cells are
   `#FFFFFF` ("card-style" sub-cells).
2. **Slide-down context menu** (`.globalnav`) — hidden by default
   (`transform: translate3d(0,-100%,0)`), slides in from the top
   (`cubic-bezier(.86,0,.07,1)` 1s) when the burger is pressed. It
   contains a 2-column main nav (`.mainmenu__nav`) plus a right-hand
   sidebar (`.globalnav-sidebar`) with a featured case and a jobs
   list.
3. **Hero (`.timeline__hero`)** — the current FOTD. Sits directly
   under the fixed header, fills the full container width, ~700–900px
   tall. Right half is the 1169×747 case screenshot with the corner
   FOTD ribbon and a dotted `pixel-pattern` overlay. Left half is
   white and contains: month + day (`.pixel-text` with the dotted
   background and 150px day number), category in caps, project
   title, excerpt, scorecard (points + days in), credit, and a
   "Go" button. Below the hero is a down-arrow chevron
   (`.timeline-hero__down__arrow`) that morphs into a centred
   pointer as the user scrolls.
4. **Timeline list (`.timeline`)** — a 2-column grid (`float: right` on
   `.timeline__element`) of recent cases. Each cell is `~683×311` on
   the largest breakpoint and contains the project screenshot with a
   hover veil, the score (`.glitter-scorecard__score`) and days in
   voting (`.glitter-scorecard__days`), a date column
   (`.timeline-case__date`), the project title, the award
   category (`.timeline-case__details-award`), and the agency /
   profile.
5. **Infinite-scroll trigger (`.infinitescroll-trigger`)** — a
   pixel-pattern tile that says "load more"; new entries are
   appended via React state.
6. **Footer (`.footer-container`)** — 60px tall, white, three
   columns: FWA logo + sponsor + copyright on the right, social
   links (Twitter, LinkedIn, Instagram, "Kesey Signal") and
   footer-nav links (Contact, Cookie Policy, Privacy, Terms) on
   the left. `z-index: 121`.
7. **Cookie notice (`.cookie-notice`)** — fixed bar at the bottom of
   the viewport, `background: #404040`, white text, `z-index: 9999`,
   slides up 200ms ease-out on first visit.

---

## Components

### Header (`.header-main`)

- **Position:** `fixed; top: 0; height: 61px`.
- **Anatomy:** 3 horizontal sub-cells (`.header-main__logo-area` left,
  `.header-main__search-area` center, `.header-main__promo-area` right)
  with a 4th filter button (`.header-main__filter`) that opens the
  `.multiselect` filter overlay. The cells are `#FFFFFF` squares inside
  the `#ECECEC` frame.
- **Logo:** 67×20px `fwa-logo.png` placed at `background-position: 20px 50%`
  inside a 87px-wide link.
- **Filter button:** A `.multiselect__activator` that toggles a full-screen
  `.multiselect__options` panel (the date / category / type picker).
- **Search icon:** A 568×568 PNG at the center, linking to `/search/`.
- **Promo area:** A `.slider` of 10 sponsor banners, each 778×120 (desktop),
  rotating 400ms opacity ease-out.

### Filter panel (`.multiselect`)

- **Trigger:** "Filters" pill button in the header.
- **Open animation:** Translates in from the top, `cubic-bezier(.23,1,.32,1)`
  350ms, with a 650ms `width` change on the logo area.
- **Anatomy:** Three `.multiselect__group` columns — "Awards" (FOTD, FOTM,
  FOTY, PCA, Top 100), "Editorial" (Agency spotlights, Articles, Digital
  Pioneers, …), "Project types" (AI, Installation, Website, Others) —
  plus a "Date" column with one entry per month from January 2001 to
  June 2026 (≈ 305 entries, scrollable).
- **Selection:** custom checkbox (`.custom-checkbox__pseudo`) with
  14×14px white box, 1px `#D6D6D6` border, `border-radius: 1px`.

### Slide-in context menu (`.globalnav`)

- **Trigger:** Hamburger button in the header.
- **Animation:** `transform: translate3d(0,-100%,0)` → `translate3d(0,0,0)`,
  `1s cubic-bezier(.86,0,.07,1)`. The icon morphs to an X via
  `cubic-bezier(.19,1,.22,1) .5s .35s`.
- **Layout:** 2-column main nav (Awards, Live Judging, Profiles,
  Editorial, Jobs, About) on the left, plus a `.globalnav-sidebar`
  (Featured case + Jobs list) on the right. The bottom 60px of the
  panel is fixed for the "Submit a case" + sign-in row.

### Hero (`.timeline-hero`)

- **Background:** `#ECECEC`, with a `1px solid #ECECEC` border-top.
- **Right column:** `.timeline-hero__slider-holder` (`.span9` on tablet,
  full-width on mobile) with the 1169×747 case screenshot
  (`pixel-pattern pixel-pattern--dark pixel-pattern--01` overlay), the
  FOTD ribbon (`position: absolute; top: 0; left: 0;
  z-index: 2; pointer-events: none`), and a YouTube play
  button (`.coda-play` / `.trigger-play`).
- **Left column:** A `.span5` white block with
  `.timeline-hero__details-top` (201px tall, contains the month + day
  in `.pixel-text` and the category), `.timeline-hero__details`
  (category, title at `35px` weight `lighter`, 152px-max excerpt in 15/19),
  `.timeline-hero__details-description` (362px tall, pinned to the
  bottom of the hero), and a 137px-tall bottom row divided into the
  scorecard (`.timeline-hero__meta-scorecard` — 4 columns: 48px number
  for points, 48px number for days, 15px caps labels) and the
  `.timeline-hero__meta-credit` (agency name + "Credits" button) and
  `.timeline-hero__meta-more` ("Go" / "View" button).
- **Day number:** The single most distinctive element on the page.
  `.timeline-hero__intro__content` is set in
  `font-size: 150px; line-height: 130px; font-weight: 700; Good Pro`.
  The number is wrapped in `.pixel-text` (`.pixel-text:before` is
  solid `#E4E4E4`; `.pixel-text:after` is the 2×2px `pixel-pattern-overlay.png`
  tile), producing the FWA's signature "halftone" day stamp.
- **Chevron:** `.timeline-hero__down__arrow` is a 30×30 CSS-only chevron
  (rotated 45° square) in `2px solid #ECECEC` that animates to the
  centre of the page as the user scrolls (see `@keyframes arrow-to-bottom-to-center`).

### Timeline case (`.timeline-case`)

- **Layout:** 2-up grid (`float: right` per cell) of recent entries,
  alternating odd/even, separated by a hairline `#ECECEC` border.
- **Anatomy per cell:**
  - `.timeline-case__glitter-img` (311px tall) — the case screenshot
    with `.pixel-pattern pixel-pattern--dark` overlay and a 73×73
    ribbon (`.ribbon-fotd--small` etc.) in the top-left if the case
    won an award.
  - `.timeline-case__glitter-img__buttons-container` — full-cell
    overlay (`opacity: 0`, `background: rgba(63,63,63,0.9)`), 1s
    `cubic-bezier(.19,1,.22,1)` fade on hover, with a centred
    `.timeline-case__glitter-img__button-light` and a darker version
    revealed on hover.
  - `.timeline-case__glitter-scorecard` (right side of image, 311px tall,
    `border-left: 1px solid #E7E7E7`, padded `19px 15px 20px 10px`) —
    18px Good Pro Condensed, with two numbers: average FWA score (out of
    100) and "days in voting". Labelled with a 15px Good Pro Condensed
    caps header.
  - `.timeline-case__date` (1-col, left) — day number `20px`, month
    `15px` Good Pro Condensed caps, `#9A9A9A`.
  - `.timeline-case__details` — `19px` Good Pro title (60px tall,
    `vertical-align: bottom`), profile/agency in `Good Pro Condensed`
    `#9A9A9A`, award category (`.timeline-case__details-award`) as a
    `15px` caps string floated right.
- **Hover:** the dark overlay fades in over the screenshot, the dark
  variant of the "View" button reveals (`translatey(0)`), and the
  case-title colour does not change.

### Timeline hero (`.timeline__hero`)

- **Position:** First item in `.timeline`; takes `span14` and
  `float: right; position: relative`. Contains the same hero block as
  described above. Below it, the chevron arrow is positioned at
  `top: 47px` of the next element.

### Cookie notice (`.cookie-notice`)

- **Position:** `fixed; bottom: 0; z-index: 9999`.
- **Background:** `#404040`. White text.
- **Layout:** Centred flex row (`align-items: center; justify-content: center`).
- **Animation:** `transform: translateY(0)` slides up `200ms ease-out`
  on first visit; persisted dismissal in `localStorage`.

### Footer (`.footer-container`)

- **Height:** 60px minimum, `z-index: 121`, `background: #FFFFFF`.
- **Anatomy:** Three columns — FWA logo (`.footer-container__column__logo`,
  67px wide, vertically centred with `translateY(-50%)`), social links
  list (Twitter, LinkedIn, Instagram, [?]), and a `.footer-container__sponsor`
  in the right column at `top: 100%; transform: translateY(-100%)`. Above
  the FOTD-style columns is a 1px `border-top: 1px solid #ECECEC` rule.
- **Mobile:** collapses to a single column with the menu stacked.

### Tooltip (`.tooltip`)

- **Trigger:** hover on a scorecard quadrant ("Our point system" / "FWA
  of the day" / "FWA of the month" / "FWA of the year" / "PCA").
- **Animation:** `opacity .4s cubic-bezier(.23,1,.32,1) .2s, visibility
  .4s cubic-bezier(.23,1,.32,1) .2s` with a 600ms deferred `z-index`
  reset.
- **Content:** Pre-rendered translation strings from the
  `translations` object in the page's `konfig` global (see
  `homepage.html:75`).

### Slider / promo (`.slider`)

- **Layout:** absolute-positioned slides (`.slider-slide`) stacked on
  top of each other, `position: absolute; top: 0; left: 0; opacity: 0`,
  with `.slider-slide--active` at `opacity: 1`.
- **Animation:** `opacity .4s ease-out`.
- **Behaviour:** Auto-rotates through 10 sponsor banners (keseysignal,
  AKQA, Fantasy, FontShop, makemepulse, MediaMonks, …) loaded from
  `/dyn/resources/Ads_Model_Ads/desktop2/...`.

### Button (`.button`)

- **Variants:** default (`.button`), `.button--go` (slim "Go" with
  arrow), `.button--dark` (top:-1px alignment fix), `.button--credit`
  (left-positioned credits toggle), `.button-postvacancy` (post a job).
- **Sizes:** `min-width: 145px` (default) / `min-width: 130px` (`--go`).
- **Anatomy:** Inline text, with an `.arrow` element next to `--go`
  that is `1px × 11px` and animates `background 1s cubic-bezier(.19,1,.22,1)`.
- **No rounded corners.** Square edges.
- **Hover:** Reveals a 1×11px white `.arrow` that fades in (no background
  change for the button itself).

### Search page (`.search-page`)

- **Animation:** `transform: translate3d(0,-100%,0)` to
  `translate3d(0,0,0)`, `1s cubic-bezier(.23,1,.32,1) .1s`.
- **Anatomy:** `.search-page__head` (120px top padding, 28px Good Pro
  300, "Search"), `.search-page__input` (80px tall input with 1px
  `#ECECEC` top border, 1px `#F7F7F7` right border), and
  `.search-page__result-head`.

### Error toaster (`.error-toaster`)

- **Position:** Sticky under the header.
- **Animation:** `transform: translate3d(0,-100%,0)` →
  `translate3d(0,0,0)`, `.5s cubic-bezier(.19,1,.22,1) .2s`.
- **Content:** "An error has occurred" or similar (driven by
  `error-toaster__shift`).

### Video modal (`.youtube-overlay`)

- **Trigger:** Click on the play button (`.coda-play` / `.trigger-play`).
- **Backdrop:** `rgba(33,33,33,0.97)`.
- **Animation:** `opacity 0 → 1, visibility hidden → visible`,
  `1s cubic-bezier(.19,1,.22,1)`.
- **Implementation:** Loads an iframe to YouTube (the dump has
  `hqdefault__*.jpg` placeholders for each video).

---

## JavaScript & Libraries

The page is a **client-side React SPA**: the body is one
`<div id="root" data-reactroot="…">` and the application
is bundled as a single Webpack chunk. The only other script is an
inline `DomAnimator` text-rotator used for the prerelease banner.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| React | not visible in the dump (likely 15.x or 16.x) | `<div data-reactroot>`, `React` symbol in bundle (90 hits) | Single root, server-rendered shell, hydrated |
| React Router | 2.x / 3.x (signatures match) | `createMemoryHistory`, `hashHistory`, `browserHistory`, `Route`, `IndexRoute`, `Lifecycle`, `withRouter` in bundle | `react-router` 2.x-3.x API surface |
| Webpack | visible in `webpackJsonp`/runtime | `(function(k){… g.p="/assets/"…})([…])` header in `main_patched.min.js` | Public path `/assets/` |
| Stripe.js | v3 | `https://js.stripe.com/v3/`, `Stripe(...)`, `Stripe.elements`, `Stripe.createSource`, `injectStripe` in bundle | **Live** key `pk_live_SqitteRZrUSSijMGpAteX0Qw`; payment for FWA Club 100 |
| Google Tag Manager | `GTM-PSP9W75` | `<script src="//www.googletagmanager.com/gtm.js?id=GTM-PSP9W75">` | Loaded synchronously in `<head>` |
| Google Analytics (Universal) | `UA-77514466-1` | `gaKey: 'UA-77514466-1'` in `konfig`, `analytics.js` async | Plus `G-5CS0DNWWXK` (GA4) |
| Facebook SDK | `sdk.js` | `<script src="https://connect.facebook.net/en_GB/sdk.js">` | `fbAppId: '404048446316352'`, plus inline FB CSS |
| DomAnimator (custom) | inline | `var DomAnimator=function(){"use strict";function n(n,e){…}}` in `homepage.html:81` | Comment-inserting text rotator used for the pre-release banner |
| jQuery | not in main bundle; one stray match | `jQuery` count 1 in the bundle (likely a transitive detection snippet) | Not actively used by the React app |
| IntersectionObserver | not used | not present in bundle |  |
| `requestAnimationFrame` | yes | 2 hits in bundle | Used for the slider rotation |
| `MutationObserver` | yes | 4 hits in bundle | Possibly for scorecard / progress updates |

No GSAP, no Three.js, no Lottie, no Framer Motion, no Barba, no
Locomotive Scroll. **All motion is CSS-driven.**

The application calls a small REST surface, all from
`https://thefwa.com/api/`:

- `GET /api/categories`
- `GET /api/timeline/?limit=20&offset=0` (initial 20 cases)
- `GET /api/editorials/?offset=0&limit=3`
- `GET /api/jobs?offset=0&limit=3`
- `GET /api/account/current`
- `GET /api/popup/open`
- `GET /api/account/admin/jury-overview/…`, `…/jury/fotd`,
  `…/jury/fotm`, `…/jury/foty`, `…/jury/pca`,
  `…/jury/tcea`, `…/jury/tceay`, `…/jury/report` (jury
  voting endpoints, auth-gated)
- `POST /api/account/jobs/create`,
  `POST /api/account/jobs/create/payment` (Stripe-backed)
- `POST /api/account/confirm`, `POST /api/account/changerequest/`

A 7-day Instagram-style "scrolling" infinite-scroll fetches more
timeline items as the user reaches the
`.infinitescroll-trigger` tile.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `arrow-to-bottom-to-center` | `css/main-0b910a23e507c5c0e897.css` (defined ~middle of the minified file; declared in `.timeline-hero__down__arrow` media queries) | not specified directly (1s inferred) | `cubic-bezier(.6,.04,.98,.335)` (49%→50%) → `cubic-bezier(.19,1,.22,1)` (52%→100%) | scroll position passes the hero |
| `arrow-to-top-to-center` | same file | same | same | reverse direction |
| `spinnerRotate` | same file | not specified (≈ 1s) | `linear` | jury-loading spinner |
| `pathDash` | same file | not specified (≈ 1s) | `linear` | spinner stroke-dasharray animation |

All four keyframes are also declared with `@-webkit-keyframes` prefixes
for Safari. Body of `arrow-to-bottom-to-center` (representative of
both arrow keyframes):

```
0%   transform: translateY(0);    timing: cubic-bezier(.6,.04,.98,.335);
49%  transform: translateY(100%); opacity: 1
50%  transform: translateY(100%); opacity: 0
51%  transform: translateY(-100%); opacity: 0
52%  transform: translateY(-100%); opacity: 1; timing: cubic-bezier(.19,1,.22,1);
100% transform: translateY(0)
```

### CSS transitions (catalogued by component)

| Component | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `.header-main` | `border-color` | `1s` | `cubic-bezier(.23,1,.32,1)` | scroll (`.globalnav--hide` toggles) |
| `.header-main__logo-area` | `width` | `.35s` | `cubic-bezier(.23,1,.32,1)` `.65s` | menu open/close |
| `.close-icon` | `transform` | `.5s` | `cubic-bezier(.19,1,.22,1)` `.35s` | menu open/close |
| `.globalnav` | `transform` | `1s` | `cubic-bezier(.86,0,.07,1)` | burger click |
| `.contextual-menu__inner-list__items` | `transform` | `1s` | `cubic-bezier(.19,1,.22,1)` `1s` | menu open |
| `.contextual-menu__inner-list__right h2, span` | `opacity, transform` | `1s` | `cubic-bezier(.19,1,.22,1)` `.5s` | menu open (staggered) |
| `.timeline-case__glitter-img__buttons-container` | `all` | `1s` | `cubic-bezier(.19,1,.22,1)` | hover on case |
| `.slider-slide` | `opacity` | `.4s` | `ease-out` | auto-rotate, 4s interval |
| `.tooltip` | `opacity, visibility, z-index` | `.4s` / `1ms` | `cubic-bezier(.23,1,.32,1)` `.2s` | hover |
| `.dropdown` | `transform, opacity` | `.2s` | `cubic-bezier(.19,1,.22,1)` | click |
| `.page__transition` | `opacity, transform` | `.7s` | `cubic-bezier(.19,1,.22,1)` | route change |
| `.page__transition--transitioning` | `opacity, transform` | `.5s` | `cubic-bezier(.19,1,.22,1)` | route change leaving |
| `.error-toaster` | `transform` | `.5s` | `cubic-bezier(.19,1,.22,1)` `.2s` | error appears |
| `.search-page` | `transform` | `1s` | `cubic-bezier(.23,1,.32,1)` `.1s` | search toggle |
| `.cookie-notice` | `transform` | `.2s` | `ease-out` | first visit |
| `.arrow` (button trailing) | `background` | `1s` | `cubic-bezier(.19,1,.22,1)` | button hover |
| `.mainmenu__nav__menu-link-list a` | `color, opacity` | `.7s` / `.5s` | `cubic-bezier(.19,1,.22,1)` | menu open (staggered) |

### JS-driven animations

None. The only JS-driven motion is the `.slider` auto-rotation
(`setInterval`, ≈ 4s) and the inline `DomAnimator` for the
prerelease text-rotator (uses `setInterval` to swap between
two comment-inserted strings at `500ms`).

### Easing curves (decreasing frequency)

| Curve | Hits | What it is |
| --- | --- | --- |
| `cubic-bezier(.19,1,.22,1)` | 1064 | **Signature** FWA curve, ≈ easeOutExpo |
| `cubic-bezier(.6,.04,.98,.335)` | 608 | ≈ easeInOutCirc, used in keyframes |
| `cubic-bezier(.23,1,.32,1)` | 238 | ≈ easeOutQuint, used for menu / tooltip |
| `cubic-bezier(.47,0,.745,.715)` | 20 | ≈ easeInOutSine |
| `cubic-bezier(.86,0,.07,1)` | 16 | ≈ easeInOutQuint, for the top context menu |
| `cubic-bezier(.455,.03,.515,.955)` | 10 | ≈ easeInOutQuad |
| `cubic-bezier(.5,.5,.5,.5)` | 10 | linear |
| `cubic-bezier(.785,.135,.15,.86)` | 6 | ≈ easeInOutCirc |
| `cubic-bezier(.39,.575,.565,1)` | 5 | ≈ easeOutCubic |

The site has **one signature easing** and it is used for 70% of
transitions. Anything that fades or moves in 1 second almost
certainly uses `cubic-bezier(.19,1,.22,1)`.

### Page transitions

- Routes are handled client-side (React Router).
- Leaving the page: `opacity 1 → 0` and `translateY(0) → translateY(70px)`,
  `0.5s cubic-bezier(.19,1,.22,1)`.
- Entering the page: reverse, `0.7s cubic-bezier(.19,1,.22,1)`.

---

## Assets

### 3D models

N/A — no 3D assets observed in the dump. The site is a 2D gallery.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| `Good Pro` | 300, 400, 500, 700 (plus `lighter`) | EOT, WOFF, TTF | `tmp/thefwa/fonts/df5df918c2c0a6958127139cf9648343.eot`, `…woff`, `…ttf`, `…ttf` (Book) | yes |
| `Good Pro Book` | 400 | TTF | `tmp/thefwa/fonts/4aed7e41266439507e87cc56d22ebfc6.ttf` | yes |
| `Good Pro Condensed` | 300 (`lighter`) | (subset of family, no separate file observed) | (uses same family declaration in CSS) | yes |
| `emoji` | system | `local()` stack | `local("Apple Color Emoji"), local("Android Emoji"), local("Segoe UI"), local(EmojiSymbols), local(Symbola)`; `unicode-range: U+1F300-1F5FF, U+1F600-1F64F, U+1F680-1F6FF, U+2600-26FF` | n/a (system fallback) |

Loaded by `@font-face` declarations in
`css/main-0b910a23e507c5c0e897.css` (file size 1.6 MB minified).

### Images (representative — there are hundreds)

The dump is overwhelmingly **PNG thumbnails** of past FWA winners
plus sponsor banners. The full set is enumerated in
`tools/tmp/thefwa/manifest.json` (414 files, 46 MB total,
340 PNGs). A representative subset:

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tmp/thefwa/images/6a30ce1f6369bfwa-slide-1__b92c4a7b.png` | PNG | 1169×747 | 399 KB | `https://thefwa.com/dyn/resources/Case_Model_Case/slide1/6/18916/1781583752/1364_span9/6a30ce1f6369bfwa-slide-1.png` | current FOTD hero slide |
| `tmp/thefwa/images/6a30ce229111efwa-slide-2__97e68585.png` | PNG | 1169×747 | 455 KB | `/dyn/.../6a30ce229111efwa-slide-2.png` | FOTD slide 2 |
| `tmp/thefwa/images/6a30ce2abb9affwa-slide-3__14106100.png` | PNG | 1169×747 | 440 KB | `/dyn/.../6a30ce2abb9affwa-slide-3.png` | FOTD slide 3 |
| `tmp/thefwa/images/6a30ce1c4d7befwa-thumb__0db1caf0.png` | PNG | (thumb) | 40 KB | `/dyn/.../6a30ce1c4d7befwa-thumb.png` | current FOTD card thumb |
| `tmp/thefwa/images/6a2b262218b60dreamweaverinteract__fe7538b6.png` | PNG | (thumb) | 247 KB | `/dyn/.../6a2b262218b60dreamweaverinteract.png` | recent case |
| `tmp/thefwa/images/6a21b8d507f7504-footer__930ca43f.png` | PNG | (banner) | 94 KB | `/dyn/.../6a21b8d507f7504-footer.png` | footer sponsor |
| `tmp/thefwa/images/6a27cf73807dbfwa1169x747c__83dbb4dc.png` | PNG | 1169×747 | 256 KB | `/dyn/.../6a27cf73807dbfwa1169x747c.png` | case slide 1169×747 |
| `tmp/thefwa/images/fotd-bl__1ffdca72.png` | PNG | ~73×73 | 3.5 KB | `https://thefwa.com/assets/fotd-bl.png` | FOTD ribbon bottom-left |
| `tmp/thefwa/images/fotm-tr__3360784c.png` | PNG | ~73×73 | 3.5 KB | `https://thefwa.com/assets/fotm-tr.png` | FOTM ribbon top-right |
| `tmp/thefwa/images/fs_logo_778x120px__cb349e6e.png` | PNG | 778×120 | 3.2 KB | `https://thefwa.com/dyn/.../fs_logo_778x120px.png` | FontShop sponsor banner |
| `tmp/thefwa/images/blackonwhite778x120__395855cc.png` | PNG | 778×120 | 15 KB | `/dyn/.../blackonwhite778x120.png` | AKQA sponsor banner |
| `tmp/thefwa/images/monks-logo_large_black-copy__b830d1cd.jpg` | JPG | (logo) | 17 KB | `/dyn/.../monks-logo_large_black-copy.jpg` | MediaMonks sponsor |
| `tmp/thefwa/images/coda-play__ca477255.png` | PNG | 16×16 | 128 B | `https://thefwa.com/assets/coda-play.png` | YouTube play icon (small) |
| `tmp/thefwa/images/hqdefault__7f07dab2.jpg` | JPG | 480×360 | 14 KB | YouTube placeholder | video modal poster |

Ribbon PNGs in the dump (28 total — 7 award types × 4 corners,
plus 7 `--small` variants): `fotd-tl/tr/bl/br.png`, `fotm-…`,
`foty-…`, `motd-…` (mobile, retired May 2016), `pca-…`,
`tcea-…` (retired 2013–2016), `tceay-…` (retired 2013–2016).

### SVGs & icons

- **Inline SVGs in HTML:** none in the React tree. The only SVGs in
  the page are the Facebook SDK-injected CSS sprites.
- **Standalone SVG files in dump:** `tmp/thefwa/svgs/safari-pinned-tab__1aa9f379.svg`
  (browser pinned-tab icon), plus the favicon set in
  `https://thefwa.com/favicons/` (16 ICO/PNG, 1 SVG, 1 `manifest.json`,
  1 `browserconfig.xml`).
- **Icon system:** custom, PNG sprites, served from `/assets/`. No
  Lucide, Phosphor, or Heroicons.

### Audio & video

N/A — no audio. Videos are YouTube embeds (load on click, shown via
`.youtube-overlay` modal; posters in the dump are `hqdefault__*.jpg`
placeholders, 9–14 KB each).

---

## Motion & Interaction

### Principles

- Slow, deliberate, non-bouncy. Almost every transition is
  `cubic-bezier(.19,1,.22,1)` (≈ easeOutExpo) at 0.4–1.0s.
- No `cubic-bezier` overshoot / spring; nothing uses
  `easeOutBack` / `easeOutElastic`.
- The only "fast" timings are micro-interactions: button arrow
  (200ms), dropdown (200ms), cookie notice (200ms).
- Page transitions are 0.5–0.7s.
- The single page-load animation is a `cubic-bezier(.86,0,.07,1)`
  1s slide of the `.globalnav` from the top.

### Specific behaviors

- **Link hover:** No `color` change on most links; instead a
  `cubic-bezier(.19,1,.22,1) .7s` transition on `color, opacity`
  for the nav menu (delayed `.4s`).
- **Button hover:** the white 1×11px `.arrow` element fades in over
  `1s cubic-bezier(.19,1,.22,1)`. The button itself does not change
  background.
- **Case hover:** the case cell's image is veiled by
  `rgba(63,63,63,0.9)` over `1s cubic-bezier(.19,1,.22,1)`. The
  "View" button translates up into view from below.
- **Burger click:** the 3-bar icon morphs to an X
  (`.5s cubic-bezier(.19,1,.22,1) .35s`).
- **Filter panel:** opens via `cubic-bezier(.23,1,.32,1) 350ms`
  with a `.65s` width change on the logo area.
- **Scorecard / day-number entry:** Not animated on load (rendered
  statically). The `.pixel-text:before` is `#E4E4E4` solid and
  `.pixel-text:after` is the 2×2 dotted PNG, layered with the
  number text on top at `z-index: 1`.
- **Infinite scroll:** when the `.infinitescroll-trigger` element
  becomes visible, `fetch('/api/timeline/?offset=20&limit=20')` is
  fired and the response is appended to the `.timeline` list.
- **Page transition:** `opacity 1→0` + `translateY(0→70px)`,
  `0.5s`, on route change.

### Reduced motion

**Not observed.** No `@media (prefers-reduced-motion: reduce)` rule
is present in the dump. The site does not currently honour the
`prefers-reduced-motion` user preference.

---

## Content & Voice

- **Tone:** editorial-formal, awards-program register. No
  exclamation marks in the UI; no marketing superlatives.
  Verbs are factual: "View", "Credits", "Submit a case", "Sign in",
  "Log in to FWA account", "Recover your FWA account".
- **Sentence length:** short. Most labels are 1–3 words
  ("FWA of the Day", "Submit a case", "Read more", "Go").
- **Capitalization:** **Title Case** in menu items and award
  names ("Agency spotlights", "FWA of the Day", "FWA of the Year",
  "People's Choice Award"). Months and categories are
  `text-transform: uppercase` in CSS.
- **Punctuation:** Oxford comma not used. Em-dashes are common
  in case titles (e.g. "Lacoste — Polo Factory").
- **CTA vocabulary:** the 4–6 verbs that surface repeatedly —
  "Go", "View", "Submit a case", "Sign in", "Log in", "Recover",
  "Activate". Most "actions" are instead presented as links
  ("Read more", "Load more").
- **Project labels** are presented in mixed case ("Kenichi Aikawa",
  "Hearst Exhibit 2026", "Icare — A Worldlabs Showcase",
  "Cipher Digital", "FUNTECH BRAND IDENTITY", "Radian", "TRIONN",
  "Lacoste Ace Breaker", "House of Honey", "Lama Lama", "MONOLOG",
  "Spotify Wrapped Party", "Lacoste — Polo Factory", "JULIEN CALOT",
  "Pegman", "Robin.T presentation", "Vectr", "RSquad Blockchain Lab",
  "RISK").

---

## Information Architecture

Top-level routes observed in the homepage and `konfig` data:

- `/` — Awards (homepage). The reverse-chronological timeline of
  featured sites with a FOTD hero at the top. Default landing.
- `/search/` — Search page (`.search-page`).
- `/cases/<slug>` — Single case study. (Not opened in the dump; the
  cases in the timeline all link to `/cases/<slug>`. Observed slugs:
  `cipher-digital`, `elle-and-esquire-exhibit-2026`, `funtech-brand-identity`,
  `house-of-honey`, `icare-a-worldlabs-showcase`, `ivress-spin-a-tale`,
  `julien-calot`, `kenichi-aikawa-p3`, `lacoste-ace-breaker`,
  `lacoste-polo-factory`, `lama-lama-p3`, `monolog-p2`, `pegman`,
  `radian`, `risk`, `robint-presentation`, `rsquad-blockchain-lab`,
  `spotify-wrapped-party`, `trionn-p3`, `vectr`.)
- `/awards` — Awards page (an alternate path to the same timeline,
  with the filter already locked to "All Awards").
- `/about/about-fwa/` — About the FWA.
- `/about/advertise/` — Advertising on the FWA.
- `/about/fwa-club-100/` — Paid membership (Stripe checkout).
- `/about/hall-of-fame/` — All-time winners.
- `/about/jury/` — The FWA jury.
- `/about/sponsors/` — Sponsors.
- `/about/the-kesey-signal/` — "The Kesey Signal" editorial brand.
- `/about/web-design-book/` — The FWA book.
- `/account/login/`, `/account/register/`, `/account/recover/` —
  Auth pages.
- `/agency-spotlight/powster` and similar slugs — Editorial
  agency-spotlight pages.
- `/article/insights-language-explorer` and similar — Editorial
  articles.
- `/classic-fwa/2004-the-zoom-quilt` — "Classic FWA" archive
  entries.
- `/contact`, `/cookie-policy`, `/privacy-statement`,
  `/terms-conditions` — Footer-link pages.

Filter categories (in the `.multiselect` panel) act as virtual
sub-routes without URL changes — they re-fetch
`/api/timeline/?…&awardId=…` and re-render the list client-side.

---

## Accessibility

- **Color contrast:** the body / panel contrast is moderate.
  `#404040` text on `#FFFFFF` background = 10.4:1 (excellent).
  `#9A9A9A` on `#FFFFFF` = 2.85:1 (**below WCAG AA** for body text
  — used for the date, profile, excerpt, button label, and category).
  `#9A9A9A` on `#ECECEC` = 2.40:1 (**below WCAG AA** — used for
  the day number, the giant intro text).
  The day-number stack has a contrast of `2.4:1` for the 150px
  text against the `#E4E4E4` pixel-pattern background, which is
  decorative but still fails AA for large text.
- **Focus indicators:** `outline: 0` is set on the header
  (`header-main { outline: 0 }`). No explicit focus-ring is
  declared. Keyboard focus is therefore invisible — this is an
  accessibility regression.
- **Keyboard:** the `.button` styles set `outline: 0` on the
  logo link. Burger / close / filter buttons are reachable in
  source order. There is no skip-link.
- **Screen reader landmarks:** `<header class="full-span--wborder
  header-main">` is present, `<nav class="globalnav">` is present
  when the menu is open, and `<footer class="footer-container">` is
  present. `<main>` is **not** used; the content lives inside
  `<div class="main-container">` instead.
- **Motion:** `prefers-reduced-motion` is not honoured.
- **Alt text:** case thumbnails have descriptive `alt` (e.g.
  `alt="RISK"`), but many sponsor banners have `alt=""` (decorative).

---

## Sources

URLs actually opened / observed while writing this:

- https://thefwa.com/ — homepage (full DOM captured in
  `tools/tmp/thefwa/playwright/homepage.html`)
- `https://thefwa.com/assets/main-0b910a23e507c5c0e897.css` — the
  main CSS bundle (1.6 MB, 1108 `@`-rules, 4 unique keyframes)
- `https://thefwa.com/assets/main_patched.min.js` — the main JS
  bundle (1.8 MB, Webpack chunk 0, React + React Router + Stripe)
- `https://js.stripe.com/v3/` — Stripe.js loader
- `https://connect.facebook.net/en_GB/sdk.js` — Facebook SDK
- `//www.googletagmanager.com/gtm.js?id=GTM-PSP9W75` — GTM
- `https://www.google-analytics.com/analytics.js` — GA Universal
- `https://www.googletagmanager.com/gtag/js?id=G-5CS0DNWWXK` — GA4
- `https://thefwa.com/api/timeline/?limit=20&offset=0` — initial
  timeline fetch
- `https://thefwa.com/api/categories` — category list
- `https://thefwa.com/api/editorials/?offset=0&limit=3` — editorial
  carousel
- `https://thefwa.com/api/jobs?offset=0&limit=3` — jobs carousel
- `https://thefwa.com/api/account/current` — auth check
- Case URLs surfaced from the timeline:
  `https://thefwa.com/cases/kenichi-aikawa-p3` (FOTD on the day
  of capture), `/cases/risk`, `/cases/elle-and-esquire-exhibit-2026`,
  `/cases/icare-a-worldlabs-showcase`, `/cases/cipher-digital`,
  `/cases/funtech-brand-identity`, `/cases/radian`,
  `/cases/trionn-p3`, `/cases/lacoste-ace-breaker`,
  `/cases/house-of-honey`, `/cases/lama-lama-p3`,
  `/cases/monolog-p2`, `/cases/spotify-wrapped-party`,
  `/cases/lacoste-polo-factory`, `/cases/julien-calot`,
  `/cases/pegman`, `/cases/robint-presentation`, `/cases/vectr`,
  `/cases/rsquad-blockchain-lab`, `/cases/ivress-spin-a-tale`.
- `tools/tmp/thefwa/manifest.json` — full asset manifest (414
  files, 46 MB).
- `tools/tmp/thefwa/playwright/computed-styles.json` — computed
  styles for visible elements at the time of capture.

---

## Changelog

- 2026-06-20 — Initial draft by opencode.
