# CSS Design Awards — design.md

> A structured design specification of **https://www.cssdesignawards.com/**,
> written so a human or agent can reconstruct its look-and-feel without
> seeing the original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** sub-agent
> **Source dump:** `tools/tmp/cssdesignawards/` (gitignored)

---

## Overview

CSS Design Awards is a curated **gallery / directory of websites that the
community has recognized for excellence in CSS-driven design**. Each weekday
the site publishes a "Website of the Day" (WOTD), judged by a rotating panel
and surfaced on the homepage alongside three most recent nominees and ten
previous winners. The site itself is a long-running (since 2009) server-
rendered PHP application that has stayed deliberately restrained in its
visual treatment: warm off-white surfaces, near-black sans-serif type, a
single muted-lilac accent, and heavy use of generous letter-spacing. The
purpose of the design is to make the *featured work* — the screenshot of
each winning site — the visual hero, and to fade the chrome of the gallery
itself into a quiet, editorial frame.

**Category:** Gallery / index / curation (CMS-style listing page)
**Primary surface observed:** Homepage (`/`) only — single page in dump
**Tone:** Editorial, minimal, confident, low-saturation, warm
**Framework detected (if any):** None — server-rendered HTML + jQuery;
no SPA framework, no SSR framework (Next/Nuxt/Astro), no Tailwind utility
classes observed. CSS is hand-authored (`style-main.min.css`) plus
`jcf.css` for custom form widgets.

---

## Visual Language

### Color

The palette is built on a **single warm off-white background** with near-
black text and one muted-lilac accent for interactive emphasis. There is no
true dark mode observed — `.light` and `.dark` footer variants exist but
the homepage only ever uses `light`. Cool greys are reserved for muted
secondary copy; trophies and judges' scores sit on a slightly darker
ivory "score shelf" so the judges' panel reads as a separate artifact
without any border.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Page background (base) | `--bg-base` | `#F1EFE9` | warm off-white, "alabaster"; body bg + header bar |
| Background (subtle / panel) | `--bg-subtle` | `#E7E5DD` | footer dark variant, filter drawer bg, "Go to Top" dark variant |
| Background (score shelf) | `--bg-score` | `#E2DED1` | `.home-wotd__scores` band; judges' panel background |
| Background (vote ring) | `--bg-vote` | `#C1BDB3` | ring base of `.vote__circle`; check icon fill |
| Background (overlay) | `--bg-overlay` | `rgba(40,40,40,0.92)` | project card hover overlay; modal backdrop `rgba(231,229,221,0.95)` |
| Background (modal) | `--bg-modal` | `rgba(231,229,221,0.95)` | full-screen menu/search modal — soft ivory veil |
| Background (tooltip) | `--bg-tooltip` | `#282828` | judge hover tooltip, single inverse surface |
| Tooltip text | `--text-on-inverse` | `#F7F5F2` | ivory type on dark tooltip |
| Text (primary) | `--text-primary` | `#282828` | near-black, used for all body / nav / titles / cta |
| Text (secondary) | `--text-secondary` | `#8D8C8C` | vote score numbers, muted meta |
| Text (muted) | `--text-muted` | `#737475` | search input underline; `#BAB9B9` placeholder; `#7B7979` active filter |
| Text (overlay) | `--text-overlay` | `#E5E0D5` | project meta + "View"/"Vote" labels on dark overlay |
| Text (muted alt) | `--text-muted-alt` | `#3F3D3E` | one-off body variant |
| Border (subtle) | `--border-subtle` | `#DCD8CE` | "before" gradient fades into `rgba(220,216,206,0)` |
| Accent (CTA underline) | `--accent` | `#D4C6E6` | `cust-btn::before` bar (lavender) — fills width on hover |
| Accent (CTA hover) | `--accent-hover` | `#9F67F7` | saturated lavender for vote "+" hover and "SUBMIT" emphasis |
| Trophy icon (active) | `--icon-active` | `#000000` | "trophy.solid" — judges' score icons |
| Trophy icon (inactive) | `--icon-inactive` | `#A19D96` | "icon-trophy-light.svg" — nominee score chip |
| Social icon | `--icon-social` | `#080808` | facebook / linkedin / instagram fills; X is black SVG |
| Link (jpanel score) | `--accent-link` | `#305C99` | unused-on-homepage legacy blue |
| Twitter/X blue | `--x-blue` | `#007BB6` | legacy link |
| Cyan link | `--cyan` | `#00CDFF` | legacy link |
| Header tagline right | `--text-copyright` | `#282828` | "BE INSPIRED. BE INSPIRING." |

The dump contains no `:root { --var: ... }` token block — every value
above is hard-coded in `style-main.min.css`. Treat them as design intent
tokens when reproducing the design.

### Typography

The site uses **a single typeface family** for everything — Open Sans,
loaded from Google Fonts with weights **400 (incl. italic), 600, 700,
800**. There is no display serif, no mono, no second sans. Hierarchy is
created entirely through weight, size, **letter-spacing (em-based,
typically `0.075em`–`0.4em`)**, and uppercase.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display / WOTD title (`home-wotd__title`) | `"Open Sans", sans-serif` | 800 | `18px` | `1.3em` (`23.4px`) | `0.075em` (`1.35px`) |
| WOTD date (`home-wotd__date`) | `"Open Sans", sans-serif` | 700 | `12px` | `1.2em` (`14.4px`) | `0.4em` (`4.8px`) |
| WOTD subtitle (creator name) | `"Open Sans", sans-serif` | 400 | `13px` | `1.2em` (`15.6px`) | `0.075em` (`0.975px`) |
| WOTD meta (country) | `"Open Sans", sans-serif` | 400 | `12px` | `1.6em` (`19.2px`) | `0.075em` |
| WOTD description (`home-wotd__desc p`) | `"Open Sans", sans-serif` | 500 | `12px` | `1.55em` (`18.6px`) | `0.075em` (`0.9px`) |
| Vote category label (`vote__cat`) | `"Open Sans", sans-serif` | 700 | `11px` | `16px` | `0.35em` (`3.85px`) |
| Vote score | `"Open Sans", sans-serif` | 700 | `14px` | `16px` | `0.35em` (`4.9px`) |
| Vote score `<small>` | `"Open Sans", sans-serif` | 700 | `11px` | `16px` | `0.35em` (`4.9px`) |
| Judge's score summary (`vote__summary span`) | `"Open Sans", sans-serif` | 800 | `24px` | `24px` | `0.075em` (`1.8px`) |
| Section heading (`h2` in `.home-projects`) | `"Open Sans", sans-serif` | 800 | `14px` | `14px` | `0.4em` (`5.6px`) |
| Project card title (`single-project__title`) | `"Open Sans", sans-serif` | 800 | `14px` | `1.3em` (`18.2px`) | `0.065em` (`0.91px`) |
| Project card meta / score chip | `"Open Sans", sans-serif` | 600 | `10px` | `10px` | `0.075em` (`0.75px`) |
| CTA button (`cust-btn` in header) | `"Open Sans", sans-serif` | 800 | `12px` | `12px` | `0.4em` (`4.8px`) |
| CTA button (large, menu) | `"Open Sans", sans-serif` | 800 | `16px` | `16px` | `0.4em` (`6.4px`) |
| Menu add-on links | `"Open Sans", sans-serif` | 500 | `16px` | `16px` | `0.4em` (`6.4px`) |
| Body (default) | `"Open Sans", sans-serif` | 400 | `16px` | `1` (`16px`) | `normal` |
| Body L (description) | `"Open Sans", sans-serif` | 400 | `14px` | `21px` | `0.075em` |
| Modal close "X" | `"Open Sans", sans-serif` | 400 | `30px` (`40px` in search modal) | `60px` (`1em` in search) | `normal` |
| Search input text | `"Open Sans", sans-serif` | 400 | `30px` | `normal` | `0.075em` (`2.25px`) |
| Footer text | `"Open Sans", sans-serif` | 700 | `14px` | `14px` | `normal` |
| Judge tooltip name (`single-judge__name`) | `"Open Sans", sans-serif` | 800 | `13px` | `13px` | `normal` |
| Judge tooltip title | `"Open Sans", sans-serif` | 600 | `9px` | `9px` | `normal` |
| Judge tooltip scores | `"Open Sans", sans-serif` | 600 | `11px` | `11px` | `normal` |

Notes on the type system:
- **Universal rule**: `*, ::before, ::after { box-sizing: border-box }`,
  every list/heading reset, `font: inherit` on a long block element list.
- `body { line-height: 1; -webkit-font-smoothing: antialiased; }`.
- Letter-spacing is **em-based** (`letter-spacing: 0.4em` on most
  uppercase CTAs) which means it scales with the font size — a 12px
  CTA gets `4.8px` tracking, a 16px CTA gets `6.4px`. This is the
  site's dominant stylistic signature.
- The `H3` element base style is `font-size: 18px; font-weight: 800;
  letter-spacing: 0.075em; line-height: 1.3em`.
- Subfilters and `<em>` use `font-style: italic`.

Open Sans is **served from Google Fonts** with multiple unicode-range
subsets loaded as separate `@font-face` blocks (cyrillic-ext, cyrillic,
greek-ext, greek, hebrew, math, symbols, vietnamese, latin-ext, latin).
Only two woff2 binaries are present in the dump (the latin italic and
latin roman ranges, observed as `memQYaGs126MiZpBA-UFUIc…` italic and
`memvYaGs126MiZpBA-UvWbX2…` roman). The HTML also requests the
stylesheet with weights 400, 400i, 600, 700, 800:

```html
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,700,800" rel="stylesheet">
```

### Spacing & radius

- **Base unit:** Not declared — the site uses raw `px` everywhere with
  5/8/10/12/15/17/20/25/30/35/40/50/60/74 px increments. The most
  frequent values are `20px` (21×), `30px` (14×), `5px` (11×),
  `15px` (9×), `8px` and `60px` (6× each).
- **Container width:** `1280px` desktop (`@media (max-width:1399px)
  { .container { width: 100% } }`), `padding: 0 20px`.
- **Modal content top padding:** `19vh` (`padding-top: 19vh;
  padding-bottom: 60px`).
- **Project card vertical rhythm:** cards are `360px` wide, `65px` or
  `102px` between rows; gallery margin-bottom `60px`.
- **Radii:**
  - `50%` everywhere a circle is needed (vote ring, judge avatars,
    trophy-icon container, summary ring) — 53 occurrences.
  - `25px` for chip-style boxes (filters / drawer / search submit area).
  - `3px` for the dark judge tooltip.
  - `41px` once (the rounded "Submit" CTA container).
  - `5px` once.
- **Shadows:**
  - `box-shadow: 10px 15px 35px -5px rgba(0,0,0,0.25)` on every WOTD
    hero screenshot.
  - `box-shadow: 0 3px 13px 0 rgba(9,10,10,0.35)` on the judge tooltip.
  - `box-shadow: 0 0 15px 20px #f1efe9` on the sticky header — same
    color as the page background, used to blur out content scrolling
    behind it.
  - `box-shadow: 0 3px 15px rgba(0,0,0,0.35)` (legacy / internal page).
  - On hover of a project card the WOTD thumbnail shadow collapses to
    `box-shadow: none` (`transition: box-shadow 0.2s ease-in-out`).

### Iconography

- **Style:** Custom flat single-color SVGs, exported from Sketch 44 / 46
  and Adobe Illustrator 19. No stroke outline library, no Lucide /
  Phosphor / Heroicons. Each icon is hand-authored and lives in
  `imgs/` as a standalone file.
- **Default size:** 12–22 px in nav / inline use; up to 120 px for the
  circular `cssda-monogram-wotd` badge.
- **Color handling:** Icons carry a single `fill="#XXXXXX"` baked in,
  not `currentColor`. To recolor, override via CSS (e.g. `.sp__single-
  score:not(.active)::before { background-image: url(icon-trophy-light
  .svg) }`).
- **Catalog of icons observed (in dump):**

  | File | viewBox | Default size | Color | Use |
  | --- | --- | --- | --- | --- |
  | `logo.svg` | `0 0 164 25` | 164×25 | `#282828` | site wordmark |
  | `loupe.svg` | `0 0 18 18` | 18×18 | `#282828` | search trigger |
  | `link.svg` | `0 0 20 20` | 20×20 | `#CCCCCC` | "open source" link in card overlay |
  | `arrow-right.svg` | `0 0 23 8` | 22×6 | `#2A2A2A` | cust-btn arrow suffix |
  | `arrow-right-white.svg` | `0 0 23 8` | 22×10 | `#CCCCCC` | "View / Vote" overlay arrow |
  | `arrowbox.svg` | `0 0 44 44` | 45×45 | stroke `#000` | "Go to Top" |
  | `icon-trophy.svg` | `0 0 17 15` | 12×11 | `#000000` | active / awarded score chip |
  | `icon-trophy-light.svg` | `0 0 17 15` | 12×11 | `#A19D96` | nominee / inactive score |
  | `icon-check.svg` | viewBox 0 0 24 24 | full | `#C1BDB3` | completed vote ring |
  | `icon-arrow.png` | n/a | n/a | n/a | legacy fallback (CSS background) |
  | `facebook.svg` | `0 0 12 21` | 12×21 | `#080808` | social |
  | `x.svg` | `0 0 512 462.8` | 28×21 | black | social (Twitter X) |
  | `linkedin.svg` | `0 0 19 19` | 19×19 | `#080808` | social |
  | `instagram.svg` | `0 0 21 21` | 21×21 | `#080808` | social |
  | `cssda-monogram-wotd.svg` | `0 0 120 120` | 120×120 | black ink | WOTD badge |
  | `cssda-sponsor-promo.svg` | n/a | 150×100 | `#FFFFFF` on dark | "Advertise with us" sponsor slot |
  | `red-collar-logo.svg` | `0 0 150 100` | 150×100 | `#0D0C0C` | sponsor slider slide 1 |
  | `mobbin.svg` | `0 0 150 100` | 150×100 | n/a | sponsor slider slide 2 (active on load) |

- **Icon hover:** social icons scale to `1.5×` and fade out, exposing the
  CSS `background-image` URL of the same SVG underneath
  (`transform: scale(1.5); opacity: 0;`).

---

## Layout & Grid

- **Max content width:** `1280px` (`@media (max-width:1399px) { width: 100% }`).
- **Page gutter:** `20px` (`.container { padding: 0 20px }`).
- **Grid:**
  - **Project cards:** CSS Grid-style flex `display: flex; flex-flow: row
    wrap; justify-content: space-between`. Cards are `360px` wide
    (intrinsic — `width: calc(33.33% - 60px)` then `50%` then full-width
    on successive breakpoints). `padding: 0 60px` on the list container
    so cards don't bleed to the page edge.
  - **WOTD hero:** two-column flex inside `.home-wotd__middle` — a
    `66.582%`-wide thumbnail column on the left and a `33.418%`-wide
    meta column on the right; the bottom score shelf is `77.379%` wide
    and right-aligned, indented `251.422px` from the left.
- **Breakpoints (from `@media` rules):**

  | Token | Min | Max | Behaviour |
  | --- | --- | --- | --- |
  | `xl` | 1280 | — | default `.container { width: 1280px }` |
  | `lg` | 768 | 1399 | `.container { width: 100% }`; hamburger becomes visible; sponsor promo hidden |
  | `md` | 601 | 767 | tablet; judges-page padding reset |
  | `sm` | 441 | 600 | judges-page padding reset |
  | `xs` | — | 415 | menu links drop to 12px; logo / container compact |

  Six distinct `@media` rules were observed:
  `(max-width:1399px)`, `(max-width:1279px)`, `(max-width:767px)`,
  `(max-width:415px)`, `(max-width:639px) and (min-width:601px)`,
  `(max-width:600px) and (min-width:440px)`.

- **Vertical rhythm:** No grid baseline declared. Section padding is
  usually `60px 0` (hero) or `55px` / `40px` bottom margins; the
  homepage WOTD section has `padding-top: 60px; margin-bottom: 60px`.
- **Sticky header:** `.header__main-wrapper` is `position: fixed; top: 0;
  left: 0; width: 100%; z-index: 10;` — the `#page` container has
  `padding-top: 109px` injected by JS (`c.movePage()`) to compensate
  for the header height.
- **Footer:** `position: absolute; bottom: 0; left: 0; width: 100%;
  height: 93px` (`height: 122px` on mobile) — the gallery scrolls
  underneath, so `#page { padding-bottom: 93px; min-height: 100vh }`.

### Page layout description

The homepage is a **single column of editorial sections**, separated by
generous vertical whitespace rather than dividers. Reading top-to-bottom:

1. **Sticky header bar** (`header.main` — fixed) with the wordmark on
   the left, a 150×75 rotating sponsor-logo slider in the center, and
   hamburger / search / `SUBMIT` on the right.
2. **Website-of-the-Day hero** (`section.home-wotd`) — a single-row
   composition: date eyebrow → screenshot + monogram + title/subtitle/
   country on the right → below that, an ivory score shelf carrying the
   tagline, six judge avatars with hover tooltips, and a row of three
   vote rings + a summary ring.
3. **Newest Nominees** (`section.home-projects`) — a centered `H2` with
   a 14×800 arrow-icon cust-btn, then a 3-column row of three nominee
   cards (YLEM, Flowty, Serotoninn).
4. **Previous WOTDS** (`section.home-projects`) — same pattern but with
   nine awarded cards in three columns (Volt, Artem Shcherbakov, Wembi,
   F40 Competizione, Hubtown, Produx, Aramco, Yuta Abe, Ten Years
   Away) followed by a `More` button.
5. **Promo banner** (`div.promo-sect`) — a centered 716×150 image
   promoting "Website of the Month May 2026".
6. **Footer** (`footer.main.light`) — three flex cells: copyright
   (left), social icons (center), tagline (right).

---

## Components

### Sticky header (`.header__main-wrapper`)

- **Height:** Computed by JS — `c.movePage()` reads `innerHeight()` and
  sets `#page { padding-top }` to match (default ≈109px including
  padding).
- **Anatomy (3 flex cells):**
  1. Logo (`a.header__site-logo > img[src=imgs/logo.svg]`,
     wordmark 164×25, fill `#282828`).
  2. Sponsor slider (`div.header__fade-slider`, `150×75`, contains
     three absolutely-positioned `div.header__fade-slider__slide`
     items, only one with `.active`). Cross-fades every `3000ms` via
     `setInterval` (`c.fadeSlider()`).
  3. Side elements (`div.header__side-elements`): hamburger
     (`a.menu-hamburger`, 24px wide, 2px border-top + 2px border-
     bottom + a 2px-tall `::after` rule = three stripes), search
     (`a.search > img[src=imgs/loupe.svg]`), and a `SUBMIT` button
     (`a.cust-btn`).
- **Behavior:** `position: fixed; top: 0; left: 0; width: 100%`. Same
  beige background as the page; uses a soft self-shadow
  `box-shadow: 0 0 15px 20px #f1efe9` to "erase" content scrolling
  beneath.
- **Fade slider:** Each slide is `position: absolute; top: 50%; left:
  50%; transform: translate3d(-50%, -50%, 0); visibility: hidden;
  opacity: 0; transition: all 1s ease`. The `.active` slide sets
  `visibility: visible; opacity: 1`. JS swaps `.active` to the next
  slide every 3s (loops back to first after last).

### Modal menu (`.modal.header-modal-menu`)

- **Trigger:** `[data-modal-open="header-main-menu"]` — the hamburger.
- **Behavior:** Full-viewport `position: fixed; width: 100%; height:
  100vh; top: 0; left: 0; background-color: rgba(231, 229, 221, 0.95);
  overflow: hidden`. Hidden by default
  (`visibility: hidden; opacity: 0; transition: visibility 0.3s,
  opacity 0.3s; transition-delay: 250ms`). When `.active` is added:
  `visibility: visible; opacity: 1; transition-delay: 0s` and the
  inner `.modal__content` slides `translate3d(0, 5px, 0) → 0` over
  400ms ease-in-out (delayed 150ms after backdrop appears).
- **Locking scroll:** Opening a modal sets `body.no-scroll { position:
  fixed; left: 0; right: 0 }` and stores `scrollY` so closing restores
  position (550ms timeout after click on `.modal__close`).
- **Anatomy (menu):**
  - Centered flex column with `padding-top: 19vh; padding-bottom: 60px`.
  - `button.modal__close` ("X", 30px / line-height 60px, scaled `0.7`
    on Y, `position: absolute; left: 50%; margin-left: -30px; top:
    74px`).
  - `ul.header__main-menu__list` — eight `li > a.cust-btn` entries
    (Home, Nominees, Winners, About, Judges, Blog, Contact, Terms/
    Privacy), each uppercase 16px/800 with 0.4em tracking and a
    lavender `::before` bar that expands on hover.
  - `ul.header__main-menu__add-on` — `SUBMIT` (16px/500/0.4em) +
    `JLogin`.
- **Anatomy (search modal):** Single full-width `input[type=search]`
  (borderless, `border-bottom: 1px solid #737475`, font-size 30px,
  letter-spacing `0.075em`, max-width `373px`, `padding: 3px 0`),
  with a 40px `X` close on its right.

### Cust-btn (`.cust-btn`, the universal CTA)

- **Variants:** Default (header `SUBMIT`, 12px), Large (16px in menu
  and `More`), `arrow-icon` (suffix arrow), `special-button`
  (`SUBMIT` in menu add-on).
- **Anatomy:** Inline-block; `padding: 5px 24px 5px 0` (or `30px` in
  menu). Underline pseudo `::before { content: ''; width: 80px;
  height: 125%; position: absolute; bottom: -5px; right: 0; z-index:
  -1; background-color: #d4c6e6; transition: all 0.3s ease }`. On
  hover, this bar collapses from `height: 125%` to `height: 25%`,
  creating a hand-drawn underline that rises into the text.
- **States:**
  - default — lavender bar sits below text.
  - hover (`width: 75px` / `90px` in menu) — bar rises to `25%` of
    text height, lifting into the bottom of the letters.
  - `arrow-icon` variant adds `::after { background-image: url(../imgs/
    arrow-right.svg); width: 22px; height: 6px; position: absolute;
    right: -12px; top: 50%; margin-top: -3px }`.

### WOTD hero block (`.home-wotd`)

- **Section:** `padding-top: 60px; margin-bottom: 60px`. Wrapper has
  `padding-left: 10.37%` so the composition starts ~129px from the
  container's left edge.
- **Date eyebrow:** `h1.home-wotd__date` reading `AWARDED 2026 JUN 19`
  — `font-weight: 700; font-size: 12px; letter-spacing: 0.4em;
  line-height: 1.2em; margin-bottom: 1.5em`. Renders like a magazine
  strap.
- **Middle row (`.home-wotd__middle`):** flex row with two children.
  - **Thumbnail (`figure.home-wotd__thumbnail`):** `width: 66.582%;
    margin-bottom: -176px; z-index: 1` — the negative bottom margin
    lets the screenshot bleed up under the score shelf on the right.
    The `<img>` has `box-shadow: 10px 15px 35px -5px rgba(0,0,0,0.25)`
    and an `a::after` overlay that fades to `opacity: 0.1` on hover
    (`background-color: #000`).
  - **Side (`div.home-wotd__side`):** `width: 33.418%; padding-left:
    6.9%`. Contains the circular monogram (`img.home-wotd__monogram`,
    `width: 120px; margin-bottom: 25px; margin-left: 14px`), the
    title (`h3.home-wotd__title`, 18px/800/0.075em — uppercase, with
    a fading right-edge gradient mask when the title overflows),
    the subtitle (`h4.home-wotd__subtitle`, 13px/400, "Huy Nguyen"
    linked to the maker's site), and a meta line
    (`span.home-wotd__meta`, "AUSTRALIA", `font-size: 12px;
    line-height: 1.6em`).
- **Score shelf (`.home-wotd__scores`):** `width: 77.379%; margin-
  left: auto; background-color: #E2DED1`. Two halves:
  - **Top (`__scores__top`, `padding-top: 34px`):** tag line on the
    left (`div.home-wotd__desc > p > em`, 12px/500, italic), six
    judge avatars on the right (`div.home-wotd__judges` flex row;
    each `figure.single-judge > img[40×40 rounded]`). On hover, a
    dark tooltip (`figcaption.single-judge__tooltip`,
    `background-color: #282828; color: #f7f5f2; border-radius: 3px;
    box-shadow: 0 3px 13px 0 rgba(9,10,10,0.35); padding: 15px 12px`)
    rises `translate3d(0,-10px,0) → 0` over `0.3s ease`.
  - **Bottom (`__scores__bottom`, `padding: 43px 70px 54px`):** flex
    row of four `li.vote__item` — three `vote__circle` rings (UI, UX,
    Innovation) plus a wider `vote__summary-item` carrying the
    judge's aggregate.

### Vote ring (`.vote__circle`)

- **Diameter:** controlled by parent `font-size: 50px` (so it's
  `1em × 1em = 50px`), `border-radius: 50%`, background-color
  `#C1BDB3`, with a thin `0.08em` ivory inner ring created by a
  `::after` pseudo.
- **Anatomy:**
  - `.vote__circle__bar` — black `border: 0.08em solid #282828; border-
    radius: 50%` clipped to the right half (`clip: rect(0, 0.5em, 1em,
    0)`); rotates `n × 3.6deg` based on `data-count="n"` (0–100),
    filling the right semicircle up to the score.
  - `.vote__circle__icon.trophy` — background-image of `icon-trophy
    .svg`, centered, `opacity: 0.4` for unfilled and `1` for
    `.solid`.
  - `.vote__circle__button` (a transparent `<button>` covering the
    ring) — draws two `3px × 16px` vertical bars at center; on hover,
    they scale to `1.0` and tint `#9f67f7`, forming a "+" sign.
- **States:** `data-count` 0 → no bar; 100 → full circle (rotated
  `360deg`). When `voted` (`.vote__item.voted`), the inner ivory
  ring's `::after` switches to `background-image: url(../imgs/icon-
  check.svg)`.

### Project card (`.single-project`)

- **Width:** `360px` (intrinsic). On desktop, 3 columns spaced with
  `padding: 0 60px` on the parent `.projects__list` and `margin-
  bottom: 102px` between rows; on tablet, two per row (`width: 50%`);
  on mobile, full-width.
- **Anatomy:**
  - **Thumbnail (`div.single-project__thumbnail`):** `position:
    relative; margin-bottom: 27px`. Holds the screenshot `<img>`
    and an absolutely-positioned overlay
    `div.single-project__thumbnail__overlay` (`opacity: 0; transform:
    scale(1.02); transition: all 0.3s ease; pointer-events: none;
    background-color: rgba(40, 40, 40, 0.92)`).
  - **Overlay contents (revealed on hover at `opacity: 1; scale: 1`):**
    - **Top-left meta (`div.single-project__meta`):** `position:
      absolute; top: 25px; left: 25px; color: #E5E0D5; font-size:
      10px`. Two `<span>`s — `sp__meta__category` ("NOMINEE" or
      "WOTD") and `sp__meta__date` ("JUN 19"), separated by a CSS
      `|` inserted via `::before { content: '|' }`.
    - **Top-right link (`a.sp__project-link`):** `position: absolute;
      top: 25px; right: 25px; z-index: 3; transition: all 0.3s;
      opacity: 1; :hover opacity 0.7`. Renders a 20×20 `link.svg`
      icon. Opens the maker's external URL.
    - **Full-size link (`a.sp__full-size-link`):** `position: absolute;
      top: 0; left: 0; z-index: 2; width: 100%; height: 100%`.
      Routes to the CSSDA detail page.
    - **Centered CTA (`span.sp__view-info`):** `display: block; color:
      #E5E0D5; font-size: 14px; font-weight: 700; letter-spacing:
      0.4em; text-transform: uppercase; pointer-events: all; z-index:
      1`. Reads "Vote" for nominees, "View" for WOTD, and trails an
      inline `arrow-right-white.svg` (`::after { width: 22px; height:
      10px; margin-left: 10px; display: inline-block }`).
  - **Title (`h3.single-project__title`):** 14px/800/0.065em,
    uppercase, `white-space: nowrap; overflow: hidden`. The
    `::before`/`::after` pair draws a 40px right-edge linear-gradient
    fade from `#f1efe9 → rgba(241,239,233,0)` that switches from
    `opacity: 0` to `1` when the title overflows
    (`transition: opacity 0.3s ease-in-out`).
  - **Score chip row (`div.single-project__scores`):** 10px/600/0.075em.
    Three `span.sp__single-score` ("UI", "UX", "INN") each with a
    12×11 trophy icon. `.active` variant uses `icon-trophy.svg`,
    default uses `icon-trophy-light.svg`. Awarded cards also include
    a fourth chip `span.sp__single-score.jpanel` reading "JPANEL
    8.26" (the average judge score), prefixed with a CSS `|`.

### Footer (`footer.main.light`)

- **Layout:** Three flex cells, `padding: 35px 20px; height: 93px;
  align-items: center`.
  - Left: `div.flex-grid` with the copyright string (`"CSS DESIGN
    AWARDS © 2009 - 2026"`, 14px/700).
  - Center: `ul.social-icons` of four `li > a` — facebook, X
    (twitter), linkedin, instagram. Each anchor has `display: block;
    background-repeat: no-repeat; background-position: 0 0;` and
    on hover the inner `<img>` scales to `1.5×` and fades to `0`.
    Spacing: `margin: 0 1.2em` (desktop) / `0 0.6em` (mobile).
  - Right: `div.flex-grid.text-right.mobile-hidden` reading `BE
    INSPIRED. BE INSPIRING.`
- **Variant:** `footer.main.dark { background-color: #e7e5dd }` —
  unused on the homepage (only `.light` is observed).

### "Go to Top" button (`.smsc-button`)

- **Container:** `div.smsc-button-wrapper` with `position: relative;
  z-index: 10`.
- **Button:** `a.smsc-button.light` — `width: 45px; height: 45px;
  position: absolute; bottom: calc(100% + 60px); right: 20px;
  background-color: #f1efe9; background-image: url(imgs/arrowbox
  .svg); background-repeat: no-repeat; background-size: contain;
  background-position: center center`. Font-size is `0` so the
  visually-hidden text "Go to Top" doesn't take layout space. Hidden
  on tablet/mobile (`display: none` at the `lg` breakpoint).

### Promo banner (`div.promo-sect`)

- `margin-top: 76px; margin-bottom: 60px`. Holds a single centered
  image link to a blog post: 716×150 JPG (`cssda-wotm-2026-may-h
  .jpg`), wrapped in an `<a>`.

### Filters drawer (`.filters`)

- **Trigger:** `button.filters__trigger` — `font-size: 12px; line-
  height: 25px; font-weight: 800; letter-spacing: 0.075em;
  text-transform: uppercase; padding: 3px 5px; padding-right: 17px;
  background: transparent; border: 0`. A `::after` adds a 9×9 "+"
  symbol on the right; the symbol swaps to "-" when `.active`.
- **Drawer:** `.filters__drawers` is `position: relative; height: 0;
  background-color: #e7e5dd; overflow: hidden; transition: height
  0.3s ease-in-out`. JS measures `outerHeight()` of the targeted
  drawer and animates it open.

---

## JavaScript & Libraries

The site is **not** a SPA. There is no React/Vue/Svelte/Next/Nuxt
runtime, no SSR framework, no build-pipeline evidence (no source
maps, no hashed chunks, no `webpack`/`vite` globals). Everything
ships as plain HTML, one CSS bundle, and five JS files loaded
synchronously at the bottom of `<body>`:

```html
<script src="/js/vendor/jquery-3.2.1.min.js"></script>
<script src="/js/vendor/jcf.js"></script>
<script src="/js/vendor/jcf.select.js"></script>
<script src="/js/vendor/jcf.checkbox.js"></script>
<script src="/js/vendor/jcf.file.js"></script>
<script src="/js/script.min.js"></script>
```

| Library | Version | Detection source | Usage on homepage |
| --- | --- | --- | --- |
| jQuery | **3.2.1** | `jquery-3.2.1.min.js` (sha1 `1055018c…`), header comment `jQuery v3.2.1` | DOM ready, event delegation, fixed-header height measurement, modal show/hide, vote ring class toggling, drawer accordion |
| JavaScript Custom Forms (JCF) | **1.2.3** | `jcf__e416d736.js`, header `Version: 1.2.3`; MIT license PSD2HTML 2014-2015 | `jcf.replaceAll()` after `jcf.setOptions('Select', { wrapNative: false })` — customizes native `<select>`, `<input[type=checkbox]>`, `<input[type=file]>` (no observed usage of those on the homepage, but the bundle is loaded) |
| JCF Select module | 1.2.3 | `jcf.select__f5d30be7.js`, header `Version: 1.2.3` | plugin; default options `wrapNative: true, useCustomScroll: true, fakeDropInBody: true, flipDropToFit: true, maxVisibleItems: 10` |
| JCF Checkbox module | 1.2.3 | `jcf.checkbox__55c1de81.js`, header `Version: 1.2.3` | not used on the homepage; loaded for forms on /submit and /contact |
| JCF File module | 1.2.3 | `jcf.file__f0688edc.js`, header `Version: 1.2.3` | not used on the homepage |
| Site script | n/a | `script.min__f2418f7d.js` (5,588 B) | four controllers — Drawer, Forms, Header (movePage + fadeSlider), WOTD thumb-overlap, Modal — wired through three `Array.push(fn)` queues (`ready`, `resize`, `scroll`) that run on the corresponding events |

**Detection note:** A grep across all JS files for `gsap|three|lottie|
framer|tweenmax|scrolltrigger|barba|swup|webgl` returns **zero**
matches. No 3D, no animation library, no scroll-driven story-telling
— every motion is CSS-only.

### Site script controllers (single IIFE)

The 5.5 KB `script.min.js` registers five behaviour modules:

1. **Drawer** — `s.init()` binds `click` on every `[data-drawer-open]`
   inside `.filters__nav`; toggles `.active` on the trigger + sibling
   drawer and animates the `.filters__drawers` container height to
   the drawer's `outerHeight()` (0 when closing).
2. **Forms** — `r.init()` configures JCF Select globally (`wrapNative:
   false`), runs `jcf.replaceAll()`, and wires `.form-default__
   dynamic-sets a` to slide-toggle sibling `<div>`s (300ms).
3. **Header** — `c.init()` measures `.header__main-wrapper.innerHeight()`
   and writes it to `#page { padding-top }`; also runs `fadeSlider()`
   — a `setInterval(…, 3000)` that removes `.active` from the
   currently-active `.header__fade-slider__slide` and adds it to the
   next (or wraps to first).
4. **WOTD thumb-overlap** — `d.init()` measures
   `.home-wotd__scores__top.innerHeight()` and sets
   `.home-wotd__thumbnail { margin-bottom: -<height>px }`, so the
   screenshot bleeds up underneath the score shelf. Re-runs on
   resize.
5. **Modal** — `l.init()` binds `click` on every `[data-modal-open]`
   to add `.active` to the matching `.modal[data-modal="…"]`, lock
   body scroll with `body.no-scroll` and store `scrollY`; binds
   `click` on every `.modal__close` to remove `.active` and after a
   `setTimeout(550)` restore the scroll position and unlock.

---

## Animations (Catalog)

The site has **zero `@keyframes` rules** in any CSS file in the dump
(`grep -E "@keyframes" style-main.min.css jcf*.css css__67d0ebc5` =
0 matches). All motion is achieved through CSS `transition` on
`opacity`, `transform`, `visibility`, `box-shadow`, and `height`.

### CSS @keyframes

None observed in the dump.

### CSS transitions (catalogued)

| Where | Properties | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `a` (global link) | `opacity` | `0.2s` | `ease-in-out` | hover |
| `.home-wotd__thumbnail a:after` | `opacity` | `0.2s` | `ease-in-out` | hover (fades to `0.1`) |
| `.home-wotd__thumbnail img` | `box-shadow` | `0.2s` | `ease-in-out` | hover (drops shadow to `none`) |
| `.home-wotd__title:before` | `opacity` | `0.3s` | `ease-in-out` | overflow (gradient mask fades in) |
| `.home-wotd__subtitle:before` | `opacity` | `0.3s` | `ease-in-out` | overflow |
| `.home-wotd__subtitle a` | `opacity` | `0.3s` | `ease` | hover |
| `.single-project__title:before` | `opacity` | `0.3s` | `ease-in-out` | overflow |
| `.single-project__thumbnail:hover .single-project__thumbnail__overlay` | `opacity`, `transform` (`scale(1.02)` → `scale(1)`) | `0.3s` | `ease` | hover |
| `.single-project__thumbnail__overlay` (base) | `opacity`, `transform` | `0.3s` | `ease` | hover (base) |
| `.sp__project-link` | `all` (opacity) | `0.3s` | `ease` | hover |
| `.cust-btn::before` | `all` (width / height) | `0.3s` | `ease` | hover (lifts underline) |
| `.modal` (background) | `visibility`, `opacity` | `0.3s` | `ease-in-out` | open / close |
| `.modal` open delay | `transition-delay: 0s` (open) / `250ms` (close) | — | — | JS adds `.active` |
| `.modal__content` | `opacity`, `transform` (`translate3d(0,5px,0)` → `0`) | `0.4s` | `ease-in-out` | open (delayed `150ms`) |
| `.header__fade-slider__slide` | `all` (visibility + opacity + transform) | `1s` | `ease` | JS swaps `.active` every `3s` |
| `.single-judge:hover .single-judge__tooltip` | `all` (visibility + opacity + `translate3d(0,-10px,0)` → `0`) | `0.3s` | `ease` | hover |
| `.vote__circle__button` (base) | `all` (transform `rotate(180deg) → 0` on `:not(.disabled)`) | `0.3s` | `ease` | hover |
| `.vote__circle__button:before/after` | `background-color`, `transform` (`scale(0.6)` → `scale(1)`) | `0.3s` | `ease-in-out` | hover (tints to `#9f67f7`) |
| `.filters__drawers` | `height` | `0.3s` | `ease-in-out` | drawer toggle |
| `.filters__trigger` | `opacity` | `0.2s` | `ease-in-out` | hover |
| `.social-icons a:hover img` | `all` (`scale(1)` → `scale(1.5)` + opacity → `0`) | `0.3s` | `ease` | hover |

### JS-driven animations

| Library | Behaviour | Trigger | Notes |
| --- | --- | --- | --- |
| jQuery `setInterval` | Header sponsor fade-slider advances `.active` to next sibling every `3000ms` | on document ready | simple class swap; CSS does the `1s` cross-fade |
| jQuery event handlers | Drawer accordion measures `outerHeight()` and animates `height` | click on `.filters__trigger` | uses CSS `transition: height 0.3s ease-in-out` |
| jQuery event handlers | WOTD thumb-overlap sets `margin-bottom: -innerHeight()px` so the screenshot tucks under the score shelf | ready + resize | not animated — direct measurement each frame |
| jQuery event handlers | Modal show/hide toggles `.active`; CSS transitions do the rest | click on `[data-modal-open]` / `.modal__close` | body locked with `.no-scroll` for `550ms` after close |
| jQuery event handlers | Vote ring class swap on `.vote__circle__button` hover; ring rotation driven by `data-count="n"` `transform: rotate(n × 3.6deg)` | hover + JS | `requestAnimationFrame` not used |

### Page transitions

- None. The site is a sequence of plain HTML pages; clicking any
  project card link or "More" button performs a full document
  navigation. There is no SPA router, no client-side view transition,
  no `barba.js` / `swup.js` / `View Transitions API` call.

---

## Assets

### 3D models

**N/A — no 3D assets observed in the dump.** The dump's `models/`
directory contains only `.gitkeep`-style placeholder files (no
.glb/.gltf/.obj/.fbx/.usdz).

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Open Sans | 400 (italic + roman), 600, 700, 800 | woff2 (subsets in CSS via `@font-face` blocks for cyrillic-ext, cyrillic, greek-ext, greek, hebrew, math, symbols, vietnamese, latin-ext, latin — 10 subsets × 4 weights = ~40 declarations) | `https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,700,800` referenced in HTML | No for the bulk; two woff2 binaries captured in the playwright dump (the most common latin subsets) are at `playwright/fonts/memQYaGs126MiZpBA-UFUIc…` (italic, 19,304 B) and `playwright/fonts/memvYaGs126MiZpBA-UvWbX2…` (roman, 48,320 B). The full font CSS is in `playwright/css/css__67d0ebc5`. |

### Images

All featured-site screenshots are served from
`https://www.cssdesignawards.com/cdasites/YYYY/YYYYMM/YYYYMMDDHHMMSS
.jpg` — dated YYYYMMDDHHMMSS slugs, full-page captures. The dump
captures 13 screenshots via Playwright and the static pass; the
following were observed on the homepage:

| Local dump path | Type | Dimensions (intrinsic / displayed) | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/cssdesignawards/playwright/images/20260528035225__b50beeaf.jpg` | JPG | 740px wide intrinsic (`width="740"` attr); ratio ~1.34 | 83,341 B | `https://www.cssdesignawards.com/cdasites/2026/202605/20260528035225.jpg` | WOTD hero for MONOLOG |
| `tools/tmp/cssdesignawards/playwright/images/20260619140221__a6612142.jpg` | JPG | card thumbnail, ~360px wide | 34,483 B | `…/cdasites/2026/202606/20260619140221.jpg` | nominee YLEM |
| `tools/tmp/cssdesignawards/playwright/images/20260619123324__354c3a79.jpg` | JPG | ~360px | 25,162 B | `…/cdasites/2026/202606/20260619123324.jpg` | nominee Flowty |
| `tools/tmp/cssdesignawards/playwright/images/20260619100601__63edf7b7.jpg` | JPG | ~360px | 27,392 B | `…/cdasites/2026/202606/20260619100601.jpg` | nominee Serotoninn |
| `tools/tmp/cssdesignawards/playwright/images/20260526110142__eb2de1e4.jpg` | JPG | ~360px | 36,116 B | `…/cdasites/2026/202605/20260526110142.jpg` | WOTD Volt (Jun 18) |
| `tools/tmp/cssdesignawards/playwright/images/20260527054350__721a0afa.jpg` | JPG | ~360px | 35,445 B | `…/cdasites/2026/202605/20260527054350.jpg` | WOTD Artem Shcherbakov (Jun 17) |
| `tools/tmp/cssdesignawards/playwright/images/20260525121638__a58f0e40.jpg` | JPG | ~360px | 23,934 B | `…/cdasites/2026/202605/20260525121638.jpg` | WOTD Wembi (Jun 16) |
| `tools/tmp/cssdesignawards/playwright/images/20260524092859__0cfaaa56.jpg` | JPG | ~360px | 43,130 B | `…/cdasites/2026/202605/20260524092859.jpg` | WOTD F40 Competizione (Jun 15) |
| `tools/tmp/cssdesignawards/playwright/images/20260515095751__f7a516c3.jpg` | JPG | ~360px | 29,265 B | `…/cdasites/2026/202605/20260515095751.jpg` | WOTD Hubtown (Jun 14) |
| `tools/tmp/cssdesignawards/playwright/images/20260522132129__88aa452d.jpg` | JPG | ~360px | 39,765 B | `…/cdasites/2026/202605/20260522132129.jpg` | WOTD Produx (Jun 13) |
| `tools/tmp/cssdesignawards/playwright/images/20260513062128__a0026fa8.jpg` | JPG | ~360px | 18,663 B | `…/cdasites/2026/202605/20260513062128.jpg` | WOTD Aramco (Jun 12) |
| `tools/tmp/cssdesignawards/playwright/images/20260519102152__8d7cf06c.jpg` | JPG | ~360px | 36,195 B | `…/cdasites/2026/202605/20260519102152.jpg` | WOTD Yuta Abe (Jun 11) |
| `tools/tmp/cssdesignawards/playwright/images/20260521130724__ea3b742e.jpg` | JPG | ~360px | 52,602 B | `…/cdasites/2026/202605/20260521130724.jpg` | WOTD Ten Years Away (Jun 10) |
| `tools/tmp/cssdesignawards/playwright/images/cssda-wotm-2026-may-h__6b081f20.jpg` | JPG | 716×150 attr (`width="716" height="150"`) | 72,190 B | `https://www.cssdesignawards.com/imgs/content/2026/cssda-wotm-2026-may-h.jpg` | promo banner — Website of the Month May 2026 |
| `tools/tmp/cssdesignawards/playwright/images/sergey-dubovenko__a4394180.jpg` | JPG | 40×40 attr | 18,815 B | `https://www.cssdesignawards.com/judges/images/267/sergey-dubovenko.jpg` | judge avatar |
| `tools/tmp/cssdesignawards/playwright/images/clement-merouani__a841cc0f.jpg` | JPG | 40×40 | 31,402 B | `…/judges/images/267/clement-merouani.jpg` | judge avatar |
| `tools/tmp/cssdesignawards/playwright/images/mattia-rinaudo__851bca09.jpg` | JPG | 40×40 | 15,244 B | `…/judges/images/267/mattia-rinaudo.jpg` | judge avatar |
| `tools/tmp/cssdesignawards/playwright/images/aleksandr-kirshin__e2c021b8.jpg` | JPG | 40×40 | 13,766 B | `…/judges/images/267/aleksandr-kirshin.jpg` | judge avatar |
| `tools/tmp/cssdesignawards/playwright/images/radislav-eliseev__1446c97c.jpg` | JPG | 40×40 | 16,543 B | `…/judges/images/267/radislav-eliseev.jpg` | judge avatar |
| `tools/tmp/cssdesignawards/playwright/images/salva-carlino__4eff5923.jpg` | JPG | 40×40 | 18,769 B | `…/judges/images/267/salva-carlino.jpg` | judge avatar |
| `tools/tmp/cssdesignawards/images/favicon__b939aa30.ico` | ICO | 32×32 (legacy) | n/a | `…/images/favicons/favicon.ico` | root favicon |
| `tools/tmp/cssdesignawards/images/favicon-16x16__40c6f391.png` … `favicon-194x194__402b1feb.png` | PNG | 16 / 32 / 96 / 194 px | various | `…/images/favicons/favicon-{N}x{N}.png` | 4 raster favicons |
| `tools/tmp/cssdesignawards/images/apple-touch-icon-*__*.png` | PNG | 57 / 60 / 72 / 76 / 114 / 120 / 144 / 152 / 180 | various | `…/images/favicons/apple-touch-icon-{N}x{N}.png` | 9 iOS icons |
| `tools/tmp/cssdesignawards/images/android-chrome-192x192__b9299430.png` | PNG | 192 | n/a | `…/images/favicons/android-chrome-192x192.png` | Android home-screen |
| `tools/tmp/cssdesignawards/images/icon-arrow__21e7e420.png` | PNG | n/a | n/a | `…/imgs/icon-arrow.png` | legacy CSS reference |

### SVGs & icons

Inline SVGs observed in the rendered HTML: **0**. Every icon is a
standalone file referenced via `<img src="…">` or as a CSS
`background-image`.

Standalone SVG files in dump (17 unique):

| File (in `tools/tmp/cssdesignawards/svgs/`) | viewBox | Size (B) | Source URL | Use |
| --- | --- | --- | --- | --- |
| `logo__f013dd91.svg` | `0 0 164 25` | 19,582 | `https://www.cssdesignawards.com/imgs/logo.svg` | site wordmark, top-left of nav |
| `loupe__eafcfb2a.svg` | `0 0 18 18` | 1,185 | `…/imgs/loupe.svg` | search trigger |
| `link__46537f3e.svg` | `0 0 20 20` | 773 | `…/imgs/link.svg` | "open source URL" link on card hover overlay |
| `arrow-right__04a909ab.svg` | `0 0 23 8` | 960 | `…/imgs/arrow-right.svg` | cust-btn suffix arrow |
| `arrow-right-white__a360d94c.svg` | `0 0 23 8` | 960 | `…/imgs/arrow-right-white.svg` | overlay View/Vote arrow |
| `arrowbox__268882f1.svg` | `0 0 44 44` | 613 | `…/imgs/arrowbox.svg` | "Go to Top" button |
| `icon-trophy__ad2cdecd.svg` | `0 0 17 15` | 1,011 | `…/imgs/icon-trophy.svg` | active / awarded score chip |
| `icon-trophy-light__41c75c58.svg` | `0 0 17 15` | 1,011 | `…/imgs/icon-trophy-light.svg` | nominee / inactive score chip |
| `icon-check__07a8bb37.svg` | `0 0 24 24` | n/a | `…/imgs/icon-check.svg` | completed vote ring |
| `facebook__855b24c3.svg` | `0 0 12 21` | 1,024 | `…/imgs/social-icons/facebook.svg` | footer social |
| `x__6e897200.svg` | `0 0 512 462.8` | 515 | `…/imgs/social-icons/x.svg` | footer social (Twitter/X) |
| `linkedin__94a4b34a.svg` | `0 0 19 19` | 1,475 | `…/imgs/social-icons/linkedin.svg` | footer social |
| `instagram__f0216248.svg` | `0 0 21 21` | 2,360 | `…/imgs/social-icons/instagram.svg` | footer social |
| `cssda-monogram-wotd__742332e8.svg` | `0 0 120 120` | 7,892 | `…/imgs/cssda-monogram-wotd.svg` | circular badge above WOTD title |
| `cssda-sponsor-promo__fa554bf3.svg` | n/a | 7,144 | `…/imgs/content/2026/cssda-sponsor-promo.svg` | sponsor slot 3 ("Advertise with us") |
| `red-collar-logo__42cdf894.svg` | `0 0 150 100` | 3,444 | `…/imgs/content/2026/red-collar-logo.svg` | sponsor slot 1 (Red Collar) |
| `mobbin__3cfbf4a9.svg` | n/a | 2,113 | `…/imgs/content/2026/mobbin.svg` | sponsor slot 2 (Mobbin — active on load) |

Icon system: **custom hand-authored set**, not a third-party sprite.
Each file is a complete standalone SVG with its own `<title>` /
`<desc>` Sketch metadata.

### Audio & video

**N/A — no audio or video assets observed in the dump.** The
`media/` directory is empty.

---

## Motion & Interaction

### Principles

- **Quiet, purposeful, almost no motion.** The site is a content
  catalogue; motion is used only to acknowledge hover (opacity /
  shadow / small translateY) and to fade the sponsor slider /
  modal scrim.
- **Default easing:** `ease-in-out` for fades; `ease` for overlay
  scale/translate; `ease` (the CSS default) for link hover.
- **Default duration:** `0.2s` for micro (link opacity), `0.3s` for
  small (overlay reveal, tooltip, underline), `0.4s` for medium
  (modal content slide), `1s` for the slow header slider cross-fade.

### Specific behaviours

- **Link hover:** global `a { transition: opacity 0.2s ease-in-out }
  a:hover { opacity: 0.8 }`.
- **Header CTA hover:** the lavender `cust-btn::before` underline
  rises from a `width: 80px; height: 125%` rectangle sitting below
  the text to a `width: 90px; height: 25%` bar that overlaps the
  bottom of the letters (transition: `all 0.3s ease`). Looks like a
  hand-drawn highlight stroke.
- **WOTD hero hover:** the `<a>` overlay fades in at
  `opacity: 0.1` (a faint dark wash) and the screenshot's
  `box-shadow` collapses to `none` (the screenshot "lifts" off the
  page).
- **Project card hover:** overlay scales from `1.02` → `1.0` and
  fades `0` → `1` over `0.3s ease`; the outer-link's `link.svg`
  fades to `opacity: 0.7`.
- **Judge avatar hover:** dark tooltip rises `translate3d(0,-10px,0)
  → 0` and fades `0` → `1` over `0.3s ease`, with a `9px`-wide
  solid triangle `::after` pointing down at the avatar.
- **Sponsor slider:** every `3s`, jQuery removes `.active` from the
  current slide and adds it to the next sibling (wrapping). CSS does
  a `1s ease` cross-fade.
- **Modal open/close:**
  - Backdrop: `visibility + opacity 0.3s ease-in-out`. Open delay
    `0s`, close delay `250ms` (so closing waits 250ms before fading,
    letting the content slide out first).
  - Content: `opacity + transform translate3d(0, 5px, 0) → 0` over
    `0.4s ease-in-out`, delayed `150ms` after the backdrop.
  - Body scroll is locked with `.no-scroll { position: fixed }`; on
    close, `setTimeout(550)` restores `scrollTop`.
- **Social icon hover:** inner `<img>` scales `1 → 1.5` and opacity
  → `0` over `0.3s ease`, revealing the same SVG image set as the
  parent's `background-image` underneath. (Visually: the icon
  appears to dissolve outward.)
- **Vote ring hover:** the transparent `<button>` covering the ring
  has two `3px × 16px` bars forming a "+". On hover they scale
  `0.6 → 1.0` (rotation 0deg and 90deg respectively) and tint from
  `#282828` to `#9F67F7` (saturated lavender). Disabled rings (after
  voting) flip the bars `rotate(180deg)` and fade to `opacity: 0`.
- **Drawer (filter) hover:** drawer container height animates 0 → N
  via `transition: height 0.3s ease-in-out`. The trigger's `::after`
  swaps "+" for "-" when `.active`.

### Reduced motion

**Not observed.** No `@media (prefers-reduced-motion: reduce)` block
appears in any CSS file in the dump. The only reduced-motion-relevant
behaviour is the gentle 1s cross-fade in the header sponsor slider;
on a user's `prefers-reduced-motion: reduce` setting this would
still play but is non-essential content.

---

## Content & Voice

- **Tone:** Editorial, restrained, confident. The site speaks in
  short labels and abbreviations ("WOTD", "JPANEL 8.30", "UI / UX /
  INN"). The tagline BE INSPIRED. BE INSPIRING. (in caps, both
  words) is the only personality signal.
- **Sentence length:** Short. The longest observed string on the
  homepage is the WOTD description (~14 words, italicised
  mid-sentence — a creator's pitch in their own words).
- **Capitalization:** Headings and CTAs are UPPERCASE everywhere
  (`AWARDED 2026 JUN 19`, `SUBMIT`, `BE INSPIRED. BE INSPIRING.`,
  `JLogin`, `More`, `Vote`, `View`, `JPANEL 8.30`). Project titles
  are **Title Case** (`MONOLOG`, `Artem Shcherbakov — Portfolio`,
  `F40 Competizione — AC Motorsport`, `Aramco — Shoot For The
  Future`). The country and judge role labels are Title Case too
  (`AUSTRALIA` actually is uppercase in this dump — there is
  inconsistency between the CSS `text-transform: uppercase` and the
  raw HTML uppercase).
- **Punctuation:** Em-dash used in two project titles. No Oxford
  comma visible (titles are short).
- **CTA vocabulary:** `SUBMIT`, `Vote`, `View`, `More`, `Home`,
  `Nominees`, `Winners`, `About`, `Judges`, `Blog`, `Contact`,
  `Terms / Privacy`, `JLogin`, `Go to Top`. Most are nouns.
- **Domain naming:** projects get URL slugs like `/sites/monolog/
  49486/`, `/sites/f40-competizione-ac-motorsport/49453/` — kebab-
  case plus numeric ID.

---

## Information Architecture

The homepage surfaces a single editorial view; the dump captures
only the homepage, but the navigation reveals the rest of the site:

| Route | Purpose | Primary component observed |
| --- | --- | --- |
| `/` | Homepage — WOTD + nominees + winners + promo | `home-wotd`, `home-projects`, `promo-sect`, footer |
| `/wotd-award-nominees` | Full list of current-day nominees (linked from "Newest Nominees" header) | `projects__list` grid; each card is a `single-project` |
| `/wotd-award-winners` | Archive of every past WOTD (linked from "Previous WOTDS" header and "More") | same `single-project` card pattern |
| `/about` | About page (link in menu) | simple-page block (CSS class `simple-page` with max-width 590px, line-height 21px, letter-spacing 0.075em) |
| `/judges` | Roster of judges (link in menu) | `judges-page__list` |
| `/blog` | Editorial / news (link in menu) | blog index with filters and filter drawer |
| `/contact` | Contact + advertising (link in menu, also in slider as "Advertise with us") | form |
| `/terms` | Terms / privacy (link in menu) | simple-page |
| `/submit` | Site submission flow (CTA in header and menu) | form with JCF select / file / checkbox custom widgets |
| `/jpanel` | Judge login (link in menu as "JLogin", opens in new tab `target="_blank"`) | auth |
| `/search` | GET search endpoint (form action) | header-modal-search |

For each entry, the page reuses the same `cust-btn`, single-project
card, and footer chrome.

---

## Accessibility

- **Color contrast (measured against base `#F1EFE9`):**
  - `#282828` on `#F1EFE9` — ~13.4:1 (very strong).
  - `#8D8C8C` on `#F1EFE9` — ~3.4:1 (passes for large text only;
    this color is reserved for 11–14px score numbers, which is
    borderline). Used at 14px/700/0.35em — uppercase letter-spacing
    makes the actual glyphs larger than they look, partially
    compensating.
  - `#E5E0D5` on `rgba(40,40,40,0.92)` — ~10.7:1 (strong).
  - `#F7F5F2` on `#282828` (tooltip) — ~13.4:1 (strong).
  - `#737475` on `#F1EFE9` (search underline) — ~4.6:1 (passes for
    non-text UI).
  - `#9F67F7` on `#F1EFE9` (hover) — ~3.8:1 (passes for large text /
    decorative UI only).
- **Focus indicators:** Resets are applied:
  `.filters__nav button:active, .filters__nav button:focus,
  .header-modal-search input, .modal__close:active,
  .modal__close:focus, .vote__circle__button:active,
  .vote__circle__button:focus { outline: 0 }`. Most interactive
  controls do **not** show a focus ring by default; the
  `.vote__circle__button` is particularly poor because the focus
  state is suppressed and no replacement is provided.
- **Keyboard:** The `<input type="search">` in the search modal has
  `autofocus=""` set. The hamburger trigger is an `<a href="#">` —
  link semantics. Modal close is a `<button>` so it responds to
  Enter/Space. The vote circle is a `<button>` with role implicit.
- **Screen reader landmarks:**
  - `<header class="main">` — landmark header.
  - `<nav class="header__main-wrapper">` — landmark navigation.
  - `<section class="home-wotd">` / `<section class="home-projects">`
    — sections (unlabelled — could use `aria-labelledby`).
  - `<footer class="main light">` — landmark footer.
  - `<form id="frmSearch">` — search form, no `role="search"`.
- **Motion:** No `prefers-reduced-motion` handling observed (see
  above).
- **Alt text convention:** Project screenshot images have
  `<alt="SITENAME website">` (literal "website" suffix), or
  `<alt="SITENAME website">` — this is consistent but redundant.
  Judge avatars use `<alt="Full Name">`. The site logo uses
  `<alt="CSS Design Awards">`. Decorative arrows and the search
  loupe have `<alt="Search">`, `<alt="link to …">`. The
  `cssda-monogram-wotd.svg` has a typo in the alt text on the live
  page: `alt="Website Of The Day monogrm"` (sic).

---

## Sources

- Homepage (rendered DOM) — https://www.cssdesignawards.com/
- Canonical link declared in `<link rel="canonical" href="https://www.cssdesignawards.com/">`
- WOTD detail page example — https://www.cssdesignawards.com/sites/monolog/49486/
- Nominees list — https://www.cssdesignawards.com/wotd-award-nominees
- Winners archive — https://www.cssdesignawards.com/wotd-award-winners
- WOTM (Website of the Month) promo — https://www.cssdesignawards.com/blog/website-of-the-month-2026-may/434/
- Judges roster — https://www.cssdesignawards.com/judges (judge avatar source path `/judges/images/267/{slug}.jpg`)
- Submit page — https://www.cssdesignawards.com/submit
- About — https://www.cssdesignawards.com/about
- Terms / Privacy — https://www.cssdesignawards.com/terms
- Search endpoint — https://www.cssdesignawards.com/search
- Judge login — https://www.cssdesignawards.com/jpanel (external `target="_blank"`)
- Social channels:
  - facebook — https://www.facebook.com/CSSDesignAwards/
  - x / twitter — https://x.com/cssdesignawards
  - linkedin — https://www.linkedin.com/in/cssda/
  - instagram — https://www.instagram.com/cssdesignaward/
- Featured external sites (from card overlay links):
  - https://bymonolog.com/ (MONOLOG)
  - https://ylem.watch/ (YLEM)
  - https://flowty.co (Flowty)
  - https://serotoninn.com/ (Serotoninn)
  - https://voltlites.com/ (Volt)
  - https://artemartemartem.com/ (Artem Shcherbakov)
  - https://www.wembi.ai/ (Wembi)
  - https://acmotorsport.eu/ (F40 Competizione)
  - https://hubtown.co.in/ (Hubtown)
  - https://www.produx.design/ (Produx)
  - https://sponsorships.aramco.com/cba/shoot-for-the-future/ (Aramco)
  - https://yutaabe.com/ (Yuta Abe)
  - https://ten.375.studio/en (Ten Years Away)
- Sponsor logo destinations:
  - https://redcollar.co/ (Red Collar, header sponsor slide 1)
  - https://www.mobbin.com/?via=cssdesignawards (Mobbin, header sponsor slide 2, active by default)
  - https://www.cssdesignawards.com/contact (CSSDA self-promo "Advertise with us")
- Google Fonts CSS — https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,700,800
- WOFF2 binaries — https://fonts.gstatic.com/s/opensans/v44/memQYaGs126MiZpBA-UFUIc…woff2 (italic latin) and `memvYaGs126MiZpBA-UvWbX2…woff2` (roman latin)
- JCF (JavaScript Custom Forms) — https://psd2html.com/jcf version 1.2.3

---

## Changelog

- 2026-06-20 — Initial draft by sub-agent, generated from
  `tools/tmp/cssdesignawards/` dump (Playwright pass captured
  2026-06-19). Slug: `cssdesignawards`. Surface observed: homepage
  only.
