# Stink Studios — design.md

> A structured design specification of **https://www.stinkstudios.com**, written
> so a human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** sub-agent
> **Source dump:** `tools/tmp/stinkstudios/` (gitignored)

---

## Overview

Stink Studios is a globally-networked creative studio whose website reads as an
opinionated, monochrome editorial portfolio. The visual language is strictly
two-color (black-on-white in light mode, white-on-black in dark mode, with a
flip-on-load "yin-yang" motif as the brand mark), built on a 12-column grid
with oversized, low-density type and very large negative space. The
interaction model is equally disciplined: scroll-driven word-by-word hero
type reveal (GSAP), flip-up card-to-fullscreen case-study transitions, and a
self-hosted Mux/HLS showreel playing behind the home hero. The site is
delivered as a Next.js static export with content authored in Sanity and
hosted on Netlify. The aesthetic is a studio brochure, not a product UI —
generous gutters, a serif/helvetica/courier triad, almost no controls on the
homepage itself, and every chrome element (header, footer, nav) is treated
as editorial art.

**Category:** Creative agency / Portfolio (Marketing)
**Primary surface observed:** Homepage (`/`), plus Work index (`/work`),
Work case study (`/work/[project]`), About (`/about`), News (`/news`),
Contact (`/contact`), Careers (`/careers`), Job application (`/job`), 404
(`/404`), WeChat landing (`/wechat`).
**Tone:** confident, restrained, editorial, slightly playful in motion
(yin-yang loaders, rotating ding dingbats).
**Framework detected:** Next.js (pages router) with React 18.2.0, statically
generated (`_ssgManifest.js`, `/_next/data/<buildId>/<route>.json` data
files), deployed on Netlify (`.netlify/scripts/rum` runtime + RUM beacon),
content sourced from Sanity (`cdn.sanity.io/images/e2h42t5o/stage/...`).

---

## Visual Language

### Color

The site uses a **two-color brand palette** that inverts cleanly between
dark and light modes. There is no real "brand accent" — the only saturated
hue is the error red (`#FA0000`) and the brand-mark duotone (black/white).
All secondary tints are derived from `rgba(var(--secondary-rgb), .5)` for
dividers and underlines.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base, dark mode default) | `--primary` | `#000000` (black) | Applied to `<body>` |
| Foreground (dark mode default) | `--secondary` | `#FFFFFF` (white) | Headings, body, icons |
| Background (light mode override) | `--primary` | `#FFFFFF` (white) | Triggered by `.light-mode` on `:root` |
| Foreground (light mode) | `--secondary` | `#000000` (black) | |
| Text muted (derivable) | `rgba(--secondary-rgb, 0.5)` | `rgba(255,255,255,0.5)` (dark) / `rgba(0,0,0,0.5)` (light) | Used for dividers, faint underlines |
| Error / destructive | `--error` | `#FA0000` (red) | Reserved for validation errors |
| Cookie banner card | — | `#000000` (black) with `#FFFFFF` text | `border-radius: 10px` |
| Cookie preference row | — | `#303030` (very-dark grey) | on black banner |
| Focus / hairline divider | — | `rgba(255,255,255,0.5)` (dark) / `rgba(0,0,0,0.5)` (light) | `1px` high |
| Modal scrim | — | `rgba(0,0,0,0)` | No modal observed; site stays chromeless |

Computed-style snapshot at the time of capture (dark mode active):
- `body` background: `#000000`
- Header/Footer text: `#FFFFFF`
- Cookie banner accept button: `bg #FFFFFF`, text `#000000`
- Cookie banner deny/details: text `#FFFFFF`, transparent bg
- Cookie preference row: `bg #303030`
- Newsletter input border: `1px solid var(--primary)`
- Hero tag underlines: `rgba(var(--secondary-rgb), 0.5)`

**Theme toggle:** a `YinYang_yinyang__3ifcV` overlay covers the screen
during a dark↔light flip (`background-color` and `color` transition
`0.4s linear`), then unmounts.

### Typography

The site uses a strict three-font stack. There is no webfont request in the
HTML or in the dumped JS — all three stacks are system-resident, which keeps
LCP fast and the visual identity deliberately utilitarian.

| Stack | Defined as | Used for |
| --- | --- | --- |
| Sans (primary) | `"Helvetica", sans-serif` (variable: `--sans-serif`) | Body, nav, buttons, most headings |
| Serif (editorial) | `"Times New Roman", serif` (variable: `--serif`) | Display titles (`Title_3`, `Title_big-title-0`), award marks |
| Monospace | `"Courier New", Courier, monospace` (font CSS var, no token) | Captions, tags, button labels, footer ding |

**Type scale** (each row is a global utility class):

| Class | Family | Weight | Size (desktop) | Size (≤500px) | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `global_font-giant-title` | sans | 300 | `13vw` | `13vw` | `0.8em` | `0` | Used in the "STINK" logo in footer |
| `global_font-big-title-0` | serif | 400 | `14.583vw` | `14.583vw` | `0.73` | `-0.07em` | Reserved editorial display |
| `global_font-title-1` | sans | 700 | `52px` | `23px` | `115%` | `-0.05em` | Section H2 |
| `global_font-title-2` | sans | 300 | `52px` | `23px` | `115%` | `-0.04em` | Light section H2 |
| `global_font-title-3` | serif | 400 | `60px` | `27px` | `100%` | `-0.05em` | Serif section H2 |
| `global_font-title-4` | sans | 300 | `52px` | `23px` | `1.15em` | `-0.04em` | Mobile menu button |
| `global_font-subtitle` | sans | 700 | `23px` | `16px` (≤1023px) | `130%` | `-0.03em` | Project card title |
| `global_font-subtitle-2` | sans | 700 | `23px` | `16px` | `120%` | `-0.02em` | |
| `global_font-text-menu` | sans | 300 | `23px` | (n/a) | `130%` | `-0.03em` | Nav list items |
| `global_font-text-1` | sans | 300 | `23px` | `16px` | `130%` (mob: `125%`) | `-0.02em` (mob: `0.01em`) | Project subtitle, body paragraphs |
| `global_font-text-2` | serif | 400 | `27px` | `27px` | `111%` | `-0.04em` | Office block bodies |
| `global_font-smalltext-1` | sans | 300 | `16px` | `16px` | `125%` | `0.01em` | Footer secondary nav, small labels |
| `global_font-search` | sans | 300 | `23px` | `16px` | `30px` (mob: `20px`) | (default) | Search input |
| `global_font-caption` | mono | 400 | `14px` (mob ≤360: `12px`) | `12px` | `143%` | `0.1em` (uppercase) | Tag chips, footer labels |

**Hero H1 (the only place the studio writes its own H1):**
- Family: `var(--sans-serif)` (Helvetica)
- Weight: `300` (inherited from `Title_text__ib1FH`)
- Size: viewport-scaled by the parent `Hero_hero__header__title`, with the
  words broken into `gsap-animate-word` spans that animate `opacity: 0 → 1`
- Letter-spacing: `normal` (no tracking override on hero H1)
- Line wrapping: line breaks and `<span>` whitespace preserved exactly
- "**lastLineChildAndWord**" class on the final word forces `white-space:
  nowrap` so the last phrase ("in-house.") never wraps mid-phrase.

**Source / hosting:** No webfont files in the dump. No `fonts.gstatic.com`,
`typekit.net`, or `use.type.com` reference observed. The "monotype"
detected in the footer is from `mtiFontTrackingCode.js` (Monotype Imaging
tracking beacon), not a font load.

### Spacing & radius

- **Base unit:** `10px` (`--spacing-1`).
- **Scale:** 10 / 20 / 30 / 60 / 120 / 180 / 240 px
  (`--spacing-1` … `--spacing-6`).
- **Page gutter (mobile):** 20px (`--grid-gutter-size: 20px`).
- **Page margin (mobile):** 20px (`--grid-margin-size: 20px`).
- **Gutter breakpoints:**
  - ≤500px (mobile): 4-column grid, no left/right page margin
  - 501–1023px (tablet): 12-column grid, gutter `20px`
  - ≥1024px (desktop): 12-column grid, gutter `20px`
- **Vertical rhythm:** baseline is `10px` (spacing-1). Hero top padding uses
  `--spacing-5-5` (180px) and bottom uses `--spacing-5` (120px) on desktop.
- **Border radii:**
  - `0px` (most surfaces — the brand deliberately avoids rounded chrome)
  - `8px` (cookie banner buttons, cookie preference pills)
  - `10px` (newsletter input pill, project toggle pills)
  - `40px` (cookie preference toggle track)
  - `50%` (cookie preference toggle knob)
- **Shadows:** effectively none. `box-shadow: none` everywhere except the
  global `transition`/`opacity` overlays. The scroll/header overlay uses
  `background-color` only.

### Iconography

- **Style:** every icon is a single-stroke hand-drawn SVG dingbat (the
  studio calls them "dings"). No filled icon library, no outline+fill
  duotone.
- **Library:** in-house SVG sprite imported from
  `src/assets/svg/dings/<name>.svg`. **133 named dings** observed in the
  JS bundle, including:
  `acropolis, arrowdecorative, arrowdown, arrowleft, arrownw, arrowright,
  arrowse, arrowsw, arrowtop, asterisk, asterism, baseleftarrow, bell,
  bike, book, boom, booty, broom, browser, browsers, calendar, candle,
  carrot, cat, cd, cellphone, checker, chemex, circlefilled, circletarget,
  circlethick, circlethin, circlex, city, coffee, command, creditcard,
  crystalball, desertisland, ding, firework, flag, folder, garage,
  graphline, headset, hourglass, incognito, ladder, lizard, lock, magic,
  mail, megaphone, monitor, mountain, newspaper, note, paintbrush,
  pencil, perfume, pixel, planet, plug, protractor, ram, ramen, refresh,
  return, scissors, server, servicebell, shout, skateboard, slingshot,
  sneaker, squarefilled, squaretarget, squarethick, squarex, stairs,
  stadium, stillcamera, stinkbone, stinker, stinklogo, sunglasses, sun,
  surfer, sus, synth, toadball, toadhole, trash, trophy, tv, ufo,
  umbrella, uturnl, uturnr, videocamera, v, web, wrench, yinyang`.
- **Default size:** in-line `1.1em` (office info icons), `40px` (section
  title dings), `20px` (nav links), `18px` width × viewport-height (yin
  toggle), `145px × 145px` (loader dings, `100px` on mobile).
- **Stroke:** `stroke-width: 6` for loader and fullscreen ding overlay
  (`.TransitionLoader_ding path` and `.Loader_loader__ding path`), `0` for
  body dings (filled paths).
- **Color logic:** every ding uses `fill: currentColor` or
  `fill: var(--primary)` / `var(--secondary)` so it tracks the theme.

---

## Layout & Grid

- **Page gutter:** `20px` (tablet & desktop), `0` (mobile; content bleeds
  to viewport edges minus `20px` body padding via inner `--grid-margin-size`).
- **Grid:** CSS Grid, 12 columns desktop, 12 columns tablet,
  **4 columns mobile** (≤500px). Custom-property driven:
  ```css
  :root {
    --grid-number-of-columns: 12;
    --grid-margin-size: 20px;
    --grid-gutter-size: 20px;
  }
  @media only screen and (max-width: 500px) {
    :root { --grid-number-of-columns: 4; }
  }
  ```
- **Track template:** explicit named lines with edge margin gutters:
  `[wrapper-start] minmax(<margin> − <gutter>, 1fr) [start] repeat(12, 1fr) [end] minmax(<margin> − <gutter>, 1fr) [wrapper-end]`
- **Breakpoints (named in CSS):**
  - `max-width: 500px` — phone (4-col)
  - `min-width: 501px and max-width: 1023px` — tablet
  - `min-width: 1024px` — desktop
  - Plus additional responsive contexts: `max-width: 360px` (caption
    drops to 12px), `max-width: 640px` / `max-width: 560px` (footer
    logotype grid reshapes)
- **Vertical rhythm:** `--spacing-1` = 10px base. Section padding always
  uses one of the spacing tokens (no magic numbers).
- **Hero composition (homepage):**
  The home hero is a **two-row grid** that occupies roughly two
  viewports of scroll length. Row 1 (top) holds the giant "STINK" logotype
  in `mix-blend-mode: difference` against a looping HLS showreel of brand
  work, sticky-positioned. Row 2 (bottom) is the dark subgrid header that
  duplicates the navigation, then the H1 hero copy "We're a global
  creative studio. From the thinking to the making, it all happens
  in-house.", followed by three underlined tag links (Advertising / Digital
  / Branding) in the monospace caption style. Below the hero, the page
  shows a 12-col **Project Grid** of featured work; each card is a media
  block (image or looping video) followed by client name, subtitle and
  tags.
- **Footer composition:**
  The footer fills `100vh` and is built as a 12-col grid: left column has a
  four-cell menu block, right column has a "see more stories" / newsletter
  signup, then a giant `STINK` logotype at the bottom (rendered as SVG
  strokes that animate to `pathLength` on scroll into view), a rotating
  `Footer_ding` SVG in the top-right, and a centered "suitman" mascot SVG.

---

## Components

### Header (`Header_header__NLhag`)

- **Position:** `fixed; top:0; left:0; right:0; z-index:5;`
- **Padding top:** `--spacing-2` (20px).
- **Background:** a `::before` pseudo-element fills the full header with
  `var(--background-color)` and animates `opacity: var(--background-opacity)`
  over `var(--header-opacity-duration) = 400ms ease-out`.
- **Hide on scroll down, reveal on scroll up:** body class
  `Header_isScrollingDown__RYYNx` → `transform: translateY(-100%)`;
  `Header_isScrollingUp__eaI6f` → `transform: translateY(0)`. Class swaps
  on `Header_isAtTheBottom__hlKTa` hides it again.
- **Anatomy:**
  - Left (grid column `start / span 4` desktop, `span 5` tablet,
    `span 3` mobile): `Header_homeLink` reading "Stink studios" in
    `global_font-subtitle`, `text-transform: uppercase`,
    `color: var(--header-primary)`.
  - Right (`grid-column: 6 / span end` desktop, `7 / span end` tablet):
    nav list `Header_navList` with `Work`, `About`, `News`, `Contact`
    + a yin-yang theme toggle (`Header_navListItemYin`, `aria-label="Switch
    to light mode"`).
  - Mobile (`max-width: 500px`): the right side becomes a "menu" button
    (`Header_toggleButton`) that opens a full-viewport overlay with a
    serif-italic underlined mobile menu and the footer nav as a 2-col list.
- **Header state classes:**
  `Header_isDark__0v_t4`, `Header_isLight__LesxP`,
  `Header_isDarkWithBackground__YHVwH`,
  `Header_isLightWithBackground__jx2yu`,
  `Header_isCaseStudy__SbHSL`, `Header_isHome__ncXS7`,
  `Header_isOpen__B611M` (menu open).
- **Opacity at top of homepage:** `var(--header-opacity) = 0` (body default)
  → `--background-opacity: 0`, then `--background-opacity: 1` after scroll
  past hero.

### Nav links

- **Type:** `global_font-text-1` (23px sans 300, -0.02em tracking,
  130% line-height) on desktop; `60px` serif italic underlined on mobile
  menu.
- **Spacing:** each link is separated by `margin-left: 0.87em` (≈20px).
- **Default state:** `opacity: 0.4`; transition `opacity
  var(--header-opacity-duration) ease-out` (400ms).
- **Hover / focus:** `opacity: 1`.
- **Active link:** `Header_activeLink__T86gM` removes the dimming
  (`opacity: 1`).
- **Underline styling:** `text-underline-offset: 0.08em;
  text-decoration-thickness: 1px; -webkit-text-decoration-skip-ink: none`.
- **Yin toggle (theme switch):** a 18px-wide SVG (`viewBox 0 0 605.08
  605.08`) of a yin-yang that swaps `color` over `0.4s linear` to animate
  the dark↔light flip.

### Footer (`Footer_footer__Q5T55`)

- **Height:** `100vh`, `position: relative; grid-template-rows: auto 1fr`.
- **Padding:** `--spacing-2 0 calc(--spacing-4 + --spacing-3) 0` (20px top,
  90px bottom) on desktop, no bottom padding on mobile.
- **Background:** `var(--secondary)` (white in dark mode, black in light
  mode — i.e. the *opposite* of the body), `color: var(--primary)`.
- **Anatomy:**
  - Top-right (grid `12 / span end`): the `Footer_ding` SVG, 40px tall,
    rotating `Footer_spin` 7s linear infinite.
  - Left column (`1 / span 2`): four-link menu (impact report, values,
    code of conduct, privacy policy), each as a 16px underlined link.
  - Right column (`3 / span 3`): newsletter signup block.
  - Center: the giant "STINK" logotype (SVG with stroked letters, paths
    animated by `pathLength` on scroll into view), 10vw tall, occupying
    full grid width.
  - A "suitman" mascot SVG centered behind the logotype (`max-width:
    100px; max-height: 10.5vw`).

### Page-transition loader (`TransitionLoader_loader__X5Qs0`)

- A 9-column grid of ding SVGs, each `calc(100vw / 10)` square, that
  scales in from `transform: scale(0.975) translate(0.1em, 0.1em)` with
  `opacity: 0` and a per-ding stagger to form a "reveal" between routes.
- Background: `var(--primary)`, with `TransitionLoader_onHome` override
  setting it to `#000` and the ding strokes to `#fff`.
- Above the dings sits the STINK logotype (paths animating from
  `opacity: 0`).

### Hero block (homepage)

- **Outer structure:** 200vh container split into a sticky logo layer
  (200vh, `mix-blend-mode: difference`) and a normal-flow content grid.
- **Logo layer:** renders a giant `STINK` wordmark (`Hero_hero__logoWrapper`)
  plus an animated lottie circle (`Hero_hero__logoCircle`, 100px, mobile
  only) and a Lottie SVG `<svg>` embedded inline in the DOM (path
  data `__lottie_element_11`). All `path[fill="rgb(0,0,0)"]` are
  recolored to `var(--primary)` via the loader CSS.
- **Header duplicate:** `Hero_hero__subgrid__headerNavDuplicate` mirrors
  the navigation underneath the sticky logo so the brand mark stays in
  context as the user scrolls past the hero.
- **H1:** wrapped in `Title_text` and broken into per-word spans with
  the class `gsap-animate-word`. Each span starts at `opacity: 0` and is
  animated to `opacity: 1` on scroll into view. The hero copy reads:
  > **We're a global creative studio.**
  > From the thinking to the making,
  > **it all happens in-house.**
- **Tag chips:** three `<a>` tags in monospace caption
  (`Hero_hero__header__link`) leading to `/work?tags=advertising`,
  `/work?tags=digital`, `/work?tags=branding`. Underlined with
  `text-decoration-color: rgba(var(--secondary-rgb), 0.5)`.
- **Hero showreel:** `Hero_hero__header__reelWrapper` renders an HLS
  stream via `react-player` (HLS.js shim). `opacity: 0.85`. Object-fit:
  cover. Falls back to a static `<video>` for non-HLS browsers.

### Project Grid (`ProjectGrid_projectGrid__bwjRv`)

- A 12-column container using `global_subgrid` (no left/right margin
  columns).
- **Five layout patterns** (`ProjectGrid_layout{1-5}-{0-9}__hash`), each
  pinning a project card to a different combination of grid columns:
  - `1-0`: span 5 starting at 1
  - `1-1`: span 7 starting at 6
  - `1-2`: span 9 starting at 1
  - `1-3` / `1-6`: span 7 starting at 1
  - `1-4` / `1-8`: span 5 starting at 8
  - `1-5`: span 9 starting at 4
  - `1-7`: span 5 starting at 3
  - `1-9`: span 9 starting at 1
  - `layouthome-null`: span 7 starting at 1 (homepage variant)
  - `4-*`: a 10th "row of equal tiles" pattern, `span 6` each (gallery)
  - All rules collapse to `start/end` (full-bleed single column) on
    mobile (`max-width: 500px`).
- **Anatomy of each tile:**
  1. `ProjectGrid_imageLink` (anchor, `aria-hidden: true`) containing
     either `VideoPlayer` (autoPlay loop muted) or `Image`
     (`Image_img` with `object-fit: cover`, `position: absolute` over
     the whole tile).
  2. `<h3 className="ProjectGrid_title gsap-animate-stagger">` with
     client name(s) joined by ` × ` (multiplied-by glyph).
  3. `<div className="ProjectGrid_subtitle gsap-animate-subtitle">`
     with the project subtitle.
  4. `<ul className="ProjectGrid_tags">` of `<li>` tag links, each with
     class `gsap-animate-tag`.
- **Hover:** the project subtitle underlines
  (`text-decoration: underline; text-underline-offset: 0.08em`).
- **Fullscreen background:** `ProjectGrid_fullscreenBackground` is a
  `position: fixed` white/black layer revealed during a "flip" transition
  (see Page Transitions below).

### Project toggle / list view (`work_viewToggle__Vwe8T`)

- A pill-shaped button (`border-radius: 10px`, 1px solid
  `var(--secondary)`) that toggles between grid and list view.
- Default text: "View" with a small icon. Label changes between
  "View grid" and "View list" (`i18n.WORK_TOGGLE_GRID` /
  `i18n.WORK_TOGGLE_LIST`).
- **Hover:** inverts to `background: var(--secondary); color: var(--primary)`.

### Newsletter input (`NewsletterInput_form__o_nto`)

- A pill-shaped flex row (`display: flex; border: 1px solid var(--primary);
  border-radius: 10px`).
- `<input>` placeholder text inherits color from `var(--primary)`.
- `<button>` shows the word "submit" in uppercase, underlined
  (`text-decoration-color: rgba(var(--primary-rgb), 0.5)`).
- **Success state:** background flips to `var(--primary)`, button + input
  text to `var(--secondary)`.
- **Error state:** an inline copy line `NewsletterInput_errorCopy` shows
  a 12px warning SVG + 400-weight message in `var(--primary)`.

### Video Player (`VideoPlayer_wrapper__28yUl`)

- Wrapper uses `aspectRatioWrapper` with `padding-top: 56.25%` for 16:9.
- `position: relative; height: 0; overflow: hidden`.
- `<video>` is rendered with `preload="auto"`, `loop`, `playsinline`,
  `webkit-playsinline`, `x5-playsinline`, `object-fit: cover`,
  `pointer-events: none` (when used as hero reel).
- **Play overlay:** a centered `<button>` with a 10vw-min-45px-max-80px
  SVG play icon (path `fill: var(--secondary)`); transitions
  `transform .4s ease-in-out, opacity .4s ease-in-out`.
- **Mute toggle:** bottom-right, 23px-tall SVG; rotated bar drawn with
  `::before { transform: rotate(45deg) }` when muted.
- **Scrubbing controls:** bottom bar with `linear-gradient(-180deg,
  transparent, rgba(0,0,0,0.7))`, padding `--spacing-2`. Shows time
  read-out + 30×30px circular button + native HTML5 `<progress>` styled
  via `::-webkit-slider-runnable-track` to a 2px track, 15px knob.

### News Article row (`NewsFeed_article__vQULZ`)

- 12-col grid: column 1–3 reserved for date (hidden on ≤1023px), columns
  4–end for title + tags + source.
- **Title** in `global_font-title-2` underlined on hover
  (`text-underline-offset: 0.08em; text-decoration-thickness: 1px`).
- **Tags** (NewsFeed_tag) above title, 14px monospace uppercase.
- **Source link** (`NewsFeed_source`) with an inline ding SVG at
  `opacity: 0.3` and `margin-right: var(--spacing-1)/2`.
- **Divider:** 1px `var(--secondary)` at `opacity: 0.5`, full-width.

### Office card (`Office_office__m0ohj`)

- Grid columns 1–4 = info (icon, title, address, contacts, opening hours).
- Grid columns 6–end = a hero image (cover, 7 cols wide).
- **Icon** 38px SVG (`Office_office__info__icon`).
- **Title** in 23px sans bold, underlined.
- **Time zone caption** 14px uppercase monospace.
- **Office carousel** in contact page is rendered as repeated cards with
  a 1px divider between each.

### Text Banner (`TextBanner_textBanner__B48BE`)

- A full-width block in `var(--primary)` text on `var(--secondary)`
  background, with a thin bottom border `1px var(--secondary)` (the
  border is hidden after the last banner).
- Title is underlined and prefixed by a 40px-tall ding.
- Body text in `global_font-text-1` reads `start / span 5` on desktop
  (drops to `start / span 7` on tablet, full-width on mobile).

### Cookie banner (`cookiebanner__*`)

- Position: bottom of viewport, full width, `padding: 24px`,
  `border-radius: 10px`, `background: #000000`, `color: #FFFFFF`.
- 12px description copy, 15px sans 300, line-height 18px.
- Buttons (`.cookiebanner__buttons__accept`, `__deny`, `__details`) use
  `"Courier New", monospace` 13px bold, 700 weight, `border-radius: 8px`,
  7px 12px 9px padding. Accept = white-on-black inverted, deny = ghost.
- Preference toggle: 40px track pill, 50% knob.

---

## JavaScript & Libraries

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| Next.js (pages router) | 12.x (build id `99QYMQUiCSCjkmvTRApjQ`) | `_next/static/chunks/pages/_app-85129491bd9c8bee.js`, `_buildManifest.js`, `_ssgManifest.js`, `/_next/data/<buildId>/<route>.json` data files | SSG output. Pages: `index`, `work`, `about`, `news`, `contact`, `careers`, `job`, `404`, `wechat`. |
| React | 18.2.0 | `framework-0ba0ddd33199226d.js` contains `n.version="18.2.0"` and `n.version="18.2.0-next-9e3b772b8-20220608"` | Concurrent mode exports present (`unstable_scheduleHydration`, etc.). |
| React-DOM | 18.2.0 | Same `framework` chunk | |
| GSAP | 3.x (Core + ScrollTrigger) | `(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7],{92499:...,41018:...,…})` in `_app`; `.gsap.timeline({paused:!0}).to(...).to(...)` patterns; `gsap.set(...)`, `gsap.utils.selector(...)`, `gsap-animate-{word,stagger,subtitle,tag,inner}` class hooks | Power3/Power4 easings. Used for word-by-word H1 reveal, project stagger, flip-to-fullscreen transitions. |
| ScrollTrigger (GSAP plugin) | 3.x | `ScrollTrigger.create(e,t)` registered via `H("scrollTrigger",e)` plugin helper | At least 2 distinct uses (hero, footer). |
| Three.js | implicit (`HybridRenderer`) | `HybridRenderer.prototype.build`, `threeDElements`, `this.camera`, `this.destroyed` in `_app` chunk | Used for the "flip" card transition (3D plane rotation). 27 references to `HybridRenderer` and 21 to `threeDElements`. |
| Lottie / lottie-web | built-in (Bodymovin) | `lottie_element_` IDs, inline `<svg>` containing `<path fill="rgb(0,0,0)">`; class `bodymovin` referenced; `searchAnimations()`, `animationManager` global | The hero loader (ding) is rendered inline as a Lottie JSON-in-SVG. |
| `hls.js` | loaded on demand via CDN | `https://cdn.jsdelivr.net/npm/hls.js@VERSION/dist/hls.min.js` (version injected at runtime) | Loaded through `react-player`'s FilePlayer to play the hero HLS reel (Mux playback IDs). |
| `react-player` | via FilePlayer | `e.Z=_` (FilePlayer) in `_app`; `HLS_EXTENSIONS.test(t)` | Handles HLS / DASH / FLV / YouTube / Vimeo / SoundCloud / Twitch / Wistia / Facebook. |
| `dashjs` | loaded on demand via CDN | `https://cdnjs.cloudflare.com/ajax/libs/dashjs/VERSION/dash.all.min.js` | Brought in by react-player if `.mpd` source. |
| `flv.js` | loaded on demand via CDN | `https://cdn.jsdelivr.net/npm/flv.js@VERSION/dist/flv.min.js` | Brought in by react-player if `.flv` source. |
| Sanity (CDN / image URL builder) | n/a | `https://cdn.sanity.io/images/e2h42t5o/stage/...` in `_app`, in `other/contact__4f705cea.json`, and in OG metadata | Content backend. Project ID `e2h42t5o`, dataset `stage`. |
| `@sanity/image-url` (implied) | n/a | `lqip` (low-quality image placeholder) base64 strings inline in Sanity JSON | |
| Cookiebot | n/a | `cc__2f198d9e.js` (309KB) | Cookie consent banner. |
| Netlify RUM | n/a | `<script async id="netlify-rum-container" src="/.netlify/scripts/rum" data-netlify-rum-site-id="00b33719-c98c-4493-bc7b-a645cf1de533" data-netlify-deploy-branch="production">` | Real-User-Monitoring beacon. |
| Google Tag Manager | `GTM-MNRW54Q` | `<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-MNRW54Q">` | Page-level tag manager. |
| ServiceBell (sprite) | n/a | `<symbol id="servicebell--sprite" viewBox="0 0 619.92 458.2">` (inline SVG symbol in homepage.html) | Inlined into the page but not necessarily displayed; uses path-fill rules to draw a bell icon. |
| Monotype Imaging font tracking | n/a | `mtiFontTrackingCode__433be942.js` (882 B) | Telemetry beacon only — no actual font is loaded. |
| `bowser` (browser detection) | implicit | `_app.js` uses `isSafari` flag in `Disciplines_disciplineButtons` class | Used to add `outline: 1px solid var(--secondary)` on `:focus`. |

Sanity-driven metadata observed in `other/contact__4f705cea.json`:
`configData.metaData` defines the title template `{page} | {stinkstudios}`,
default OG image `https://cdn.sanity.io/.../68af8fc6...-1200x628.jpg`,
twitter handle `@stinkstudios`. All page-level metadata (`title`,
`description`, `ding`, OG image, Twitter image) is fetched per-route and
merged into the document `<head>` at build time.

The site ships **no CSS framework** (no Tailwind, no Bootstrap, no
styled-components, no emotion). All styling is plain CSS with CSS Modules
(`Foo_bar__hash` class names) plus a small `:root`-level design-token block.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `Footer_spin__ABM0A` | `css/8ba5003dffc9d10e__30803963.css` (`.Footer_ding`) | `7s` | `linear infinite` | Always on; rotates the top-right footer ding 360° |

Only one `@keyframes` rule is defined in the dumped CSS. Every other
animation is GSAP-driven or pure CSS `transition`.

### CSS transitions (semantic table)

| Element | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `Header_header__NLhag` | `transform` | `0.2s` | `linear` | Body class swap on scroll up/down |
| `Header_header__NLhag::before` | `opacity` | `400ms` | `ease-out` | Body class `Header_isLight/DarkWithBackground` |
| `Header_navBackground__JfLRJ` | `opacity` | `400ms` | `ease-out` | Menu open / scroll past hero |
| `Header_navListItemLink__4nqwY` | `opacity` | `400ms` | `ease-out` | Hover/focus |
| `VideoPlayer_player__button__zejYO` | `transform, opacity` | `0.4s` | `ease-in-out` | Play overlay show/hide |
| `Scrubbing_controls__t2tHm` | `transform, opacity` | `0.4s` | `ease-in-out` | Hover over video |
| `work_viewToggle__Vwe8T` | `color, background-color` | (no explicit value) | `ease` (default) | Hover/focus |
| `ProjectGrid_subtitle__xlcNx` | `text-decoration` | (instant) | — | Hover |
| `YinYang_yinyang__3ifcV` | `background-color, color, fill` | `0.4s` | `linear` | Theme toggle click |

### JS-driven animations

| Library | Timeline / class hook | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | `gsap-animate-word` (each word in H1) | `ScrollTrigger.create(...)` (likely on hero) | Each word's opacity tweens `0 → 1` in sequence. Hero H1 reads as "We're / a / global / creative / studio. / From / the / thinking / to / the / making, / it / all / happens / in-house." |
| GSAP | `gsap-animate-stagger`, `gsap-animate-subtitle`, `gsap-animate-tag` | Project card enters viewport | Per-card `gsap.timeline({paused:true}).to(".gsap-animate-stagger",{autoAlpha:1,duration:0.1,stagger:0.15,ease:"none"},0.25).to(".gsap-animate-subtitle",{autoAlpha:1,duration:1,ease:"power3.out"},1).to(".gsap-animate-tag",{autoAlpha:1,duration:0.1,stagger:0.1,ease:"none"},1.5)` — `stagger: 0.15s` for client, `1s power3.out` for subtitle, `0.1s stagger 0.1s` for tags. `timeScale` of the entire animation system is **0.75×** (`animateConfig.config.timeScale = 0.75` in Sanity). |
| GSAP | `flipToFullscreen` | Click on a project card → routes to `/work/[slug]` | On a card click the image container is fixed-positioned, scaled (`scaleX: thumb.width/window.width`, `scaleY: thumb.height/window.height`), and a `gsap.timeline()` morphs it to viewport size over `1s ease "power4.inOut"`, also animating `padding`, `crop`, and `image` rects to match the new aspect ratio. Reveals the `ProjectGrid_fullscreenBackground` (`position:fixed; background:var(--secondary)`). |
| GSAP | `flipToProjectHero` | Reverse of the above (back to grid) | `1s ease "power4.out"`; starts from the new image's bounding rect and scales back into the card placeholder. |
| Three.js (HybridRenderer) | `this.threeDElements[]` | On hover over a project card (and during page flip) | Maintains a list of 3D planes (one per visible card) and animates them between idle and "lift" pose (`addTo3dContainer`, `destroyed` flag for unmount). Used together with the GSAP flip for a faux-3D parallax effect. |
| Lottie | Inline SVG with `id="__lottie_element_11"` | Page load / theme transition | Plays the studio's yin-yang ding loader (520 paths worth of `transform` matrix animations at `1.9×` scale). The Lottie player swaps fills `rgb(0,0,0)` ↔ `rgb(255,255,255)` via CSS so it works in both themes. |
| CSS-only | `Footer_ding` rotation | Always | The top-right footer SVG rotates 360° every 7s. |
| CSS-only | `Header_isScrollingDown` / `Header_isScrollingUp` | scroll | `transform: translateY(-100%)` hide on scroll down, `translateY(0)` on scroll up. 0.2s linear. |
| CSS-only | `Hero_hero__subgrid__headerNavDuplicate__logo__sticky` | scroll | `transform: translateY(calc(-100% - 4px))` for the duplicated header logo, `transition: transform 0.25s`. |
| CSS-only | `Hero_hero__subgrid__headerNavDuplicate__logo__stickyText` | scroll | Counter-animates the "STINK" wordmark text to peek out from under the original logo. |

### Page transitions

- **Between routes:** a `TransitionLoader` overlay (9×1 grid of ding SVGs)
  fades in from `opacity: 0`, each ding scales from
  `transform: scale(0.975) translate(0.1em, 0.1em)` into place with a
  per-cell stagger, while the `STINK` wordmark path animations play.
- **Total scale:** the loader sits on screen for `0.75s` (page-in) and
  `0.4s` (page-out) per `animateConfig.config.pages.{in,out}`.
- **No layout shift** is visible; the loader sits at `z-index: 6` over the
  fixed header (`z-index: 5`).
- **First-paint:** the loader does *not* run on direct first-paint of
  `/` (the page boots straight into the dark hero).
- **Hero video fade:** the `Hero_hero__header__reelWrapper` is `opacity:
  0.85` so the H1 white text reads clearly over the showreel.

---

## Assets

### 3D models

N/A — no `.glb`/`.gltf`/`.obj`/`.fbx`/`.usdz` files observed in the dump.
Three.js is used only for in-memory plane meshes (no external mesh assets).
The `models/` directory exists but is empty.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Helvetica | 300, 400, 700 (variable per utility class) | system stack | `var(--sans-serif) = "Helvetica", sans-serif` | no (system font) |
| Times New Roman | 400 | system stack | `var(--serif) = "Times New Roman", serif` | no (system font) |
| Courier New | 400, 700 | system stack | `"Courier New", Courier, monospace` | no (system font) |

The only font *file* referenced is `mtiFontTrackingCode.js` (Monotype
Imaging telemetry, 882 B) — no `.woff`/`.woff2`/`.ttf`/`.otf` in the dump.

### Images

The site's content images live on **Sanity CDN** (`https://cdn.sanity.io/
images/e2h42t5o/stage/...`) and are not part of the static dump. Local
files in `images/` are **icons and favicons only**:

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `images/android-icon-192x192__58b4ddff.png` | PNG | 192×192 | (small) | self | Android home-screen icon |
| `images/apple-icon-{57,60,72,76,114,120,144,152,180}__*.png` | PNG | various | (small) | self | iOS home-screen icon set |
| `images/favicon-16x16__c15c602d.png` | PNG | 16×16 | (small) | self | Browser favicon |
| `images/favicon-32x32__3033b82e.png` | PNG | 32×32 | (small) | self | Browser favicon |
| `images/favicon-96x96__805051b1.png` | PNG | 96×96 | (small) | self | Browser favicon |
| `images/favicon__503c2d60.ico` | ICO | 32×32 | (small) | self | Classic favicon |

Sanity-rendered project / hero / office assets (per `manifest.json` and
JSON dumps):
- `https://cdn.sanity.io/images/e2h42t5o/stage/69828daa28de22e3555c71793802367791952122-500x281.gif`
  — London office reel (2.8 MB GIF, 500×281, `aspectRatio: 1.78`).
- `https://cdn.sanity.io/images/e2h42t5o/stage/a7b83b559fecb7a526e7907bb0a3a50a71f39d56-500x281.gif`
  — Buenos Aires office reel (3.5 MB GIF, 500×281).
- `https://cdn.sanity.io/images/e2h42t5o/stage/761de1d89cd4649d836e069d1e35c7e3ff1c1b51-500x281.gif`
  — Shanghai office reel (3.1 MB GIF, 500×281).
- `https://cdn.sanity.io/images/e2h42t5o/stage/56ba95d6e09cee610e8afb15e163ca8be45bd9e5-1000x1500.jpg`
  — Jax Ostle-Evans portrait (Managing Director, 786 KB JPEG, 1000×1500).
- `https://cdn.sanity.io/images/e2h42t5o/stage/68af8fc6aee8cbb405b3c8336ce8a5a7fc58bccd-1200x628.jpg`
  — OG / Twitter share image (604 KB JPEG, 1200×628, `aspectRatio: 1.91`).
- Mux video assets (referenced via `mux.videoAsset`): NYC contact reel
  `playbackId 4pbBtIe3zzpEDeCxup4I02500sPoqfGznHBX7CNy2TZVg`
  (5.42 s, 1920×1080).

### SVGs & icons

- **Inline SVGs observed in HTML (homepage):**
  - `Header_mobileYin__PRpHa`: yin-yang (viewBox `0 0 605.08 605.08`)
  - `Header_navListItemYin__dOEAe`: yin-yang (same)
  - `Hero_hero__logoCircle__KsJ8s`: 100px lottie frame (mobile only)
  - `TransitionLoader_logo__Ja8vn`: giant "STINK" logotype
  - `servicebell--sprite`: bell icon symbol (viewBox `0 0 619.92 458.2`)
  - `shout--sprite`: shout/megaphone icon symbol (viewBox `0 0 718.51 589.45`)
  - `<symbol viewBox="0 0 40.707 39.094">` — small accent ding
  - The full Lottie JSON inlined as `<svg>` containing `<g>` layers
    (`__lottie_element_11`, 776×605 viewBox).
- **Standalone SVG files in dump:** `svgs/` directory is empty; all
  decorative SVGs ship as JS modules from `src/assets/svg/dings/*.svg`
  (133 names — see Iconography above).
- **Icon system:** custom in-house sprite. Class `Header_footerDing` /
  `Footer_ding` is the only icon container that uses fill:
  `currentColor`. Most dings are loaded as `<img src="/dings/X.svg">`
  or inlined via `dangerouslySetInnerHTML`.

### Audio & video

- **Hero showreel** (homepage): served as HLS (`.m3u8` playlist + `.ts`
  segments). 13 `.ts` segments observed in `playwright/media/`
  (`0__*.ts`, `1__*.ts`, `2__*.ts`, `3__*.ts`, `4__*.ts`, `5__*.ts`),
  total **~21 MB**. Codec unknown (likely H.264 / AAC). Played through
  `react-player` → `hls.js`. `playsinline`, `muted`, `loop`.
- **Office reels** (contact): GIF loops at 500×281 (above).
- **NYC reel** (contact): Mux HLS stream `playbackId 4pbBtIe3zzpEDeCx...`
  (5.42 s, 1920×1080).
- **Case-study videos** (`source: "video"` project tiles): HLS or MP4
  delivered by Sanity `mux.videoAsset`. `autoPlay loop muted` when used
  as a thumbnail.
- **No audio assets** observed.

---

## Motion & Interaction

### Principles

- Default easing curves:
  - **Power4.inOut / Power4.out** for the page-transition flip (1 s).
  - **Power3.out** for project subtitle fade-in (1 s).
  - **Linear** for header transform (0.2 s) and footer spin (7 s loop).
  - **Ease-out** for header background opacity (0.4 s).
  - **Ease-in-out** for video player controls (0.4 s).
- Default durations: **0.2 s** (micro: header transform), **0.4 s**
  (small: header/cookie/loader), **0.7–1.0 s** (medium: page transitions),
  **7 s** (large ambient: footer spin).
- `timeScale` of the global animation system is **0.75** — every GSAP
  timeline runs ~25% slower than authoring speed, per
  `animateConfig.config.timeScale` in the Sanity content.
- **Animation config per page** (`animateConfig.config.pages`):
  - `/` (home) — `ding: "none"`, no entry ding, just the hero.
  - `/work` — `ding: "folder"`.
  - `/work/[project]` — `ding: "monitor"`.
  - `/about` — `ding: "incognito"`.
  - `/news` — `ding: "newspaper"`.
  - `/careers` — `ding: "stairs"`.
  - `/job` — `ding: "clipboard"`.
  - `/contact` — `ding: "globe"`.
  - default — `ding: "logo"`.
  All pages share `delayed: 3` (wait 3 ticks before firing the loader)
  and the page-level `in`/`out` durations above.

### Specific behaviors

- **Link hover:** `opacity: 0.4 → 1` over `0.4s ease-out`. On the home
  hero header (which is fixed-position over the showreel) the links also
  dim when the user hovers anywhere on the nav list (`:hover .Header_navList
  > * { opacity: 0.4 }`, then `:hover > * { opacity: 1 }` on the specific
  item).
- **Button press:** no explicit scale-down, but the work toggle button
  inverts fill+text on hover; tag chips underline themselves.
- **Section reveal on scroll:** every `.gsap-animate-{word,stagger,
  subtitle,tag,inner}` element starts at `opacity: 0; visibility: hidden`
  and is animated to `1` by GSAP on entry into the viewport (ScrollTrigger
  on the parent). No translateY in this stack — opacity-only.
- **Page transition:** `TransitionLoader` 9-cell ding-grid reveal (see
  Page Transitions). On card clicks: `flipToFullscreen` / `flipToProjectHero`
  morph the thumbnail into a full-window image.
- **Theme toggle:** clicking the yin-yang SVG covers the screen with the
  `YinYang_yinyang__3ifcV` overlay (z-index 9999999), animates
  `background-color` and `color` over `0.4s linear`, then unmounts.
- **Header scroll:** the body class swaps between
  `Header_isScrollingDown` (`transform: translateY(-100%)`) and
  `Header_isScrollingUp` (`transform: translateY(0)`) every ~100 ms based
  on scroll direction.
- **Loader** (initial page load): the `Loader_loader` overlay shows a
  145-px ding (the studio logo `stinklogo`) centered, opacity 0 → 1 in
  sync with a lottie path animation, then dismissed. Background:
  `var(--secondary)`. Visible on the first JS-driven navigation only.

### Reduced motion

Not explicitly handled in the dumped CSS. The site does not override
`prefers-reduced-motion` to disable GSAP timelines or video autoplay.
This is a content-quality gap: visitors who request reduced motion still
see the word-by-word reveal, the loader overlay, and the autoplaying HLS
reel. (Observed: `@media (prefers-reduced-motion: reduce)` does not appear
in any of the 6 CSS files in `css/`.)

---

## Content & Voice

- **Tone:** confident, restrained, slightly tongue-in-cheek (the agency
  calls its assets "dings", its mascot is a "suitman", its case-study
  category icons are creatures like a "toadball" and a "synth"). Short,
  declarative sentences.
- **Headline voice (paraphrased):** the studio brands itself as a
  "global creative studio" working "from the thinking to the making,
  in-house." The contact page states: "We're a proudly independent
  global creative network" with studios in "London, Los Angeles, NYC,
  San Francisco, and Shanghai" (and Buenos Aires via the JSON dump).
- **Sentence length:** short to medium. Active voice.
- **Capitalization:** Sentence case in headings; nav and CTA labels are
  lowercase ("Work", "About", "News", "Contact") or capitalized
  ("Menu", "Submit"). Logo text "Stink studios" is lowercase. The
  footer "STINK" logotype is all-caps via SVG.
- **Punctuation:** Oxford comma not consistent; em-dashes appear in case
  studies. Most CTAs are single verbs ("apply", "submit application",
  "back to projects", "next project", "back to all", "attach resume").
- **CTA vocabulary observed in `i18n` JSON:**
  apply, submit, back, more, all jobs, view grid, view list, clear filter,
  close, menu, home, more news, sign up for our newsletter, all projects,
  view the project.
- **Tag chips** are uppercase 14px Courier with `letter-spacing: 0.1em`,
  e.g. "ADVERTISING", "DIGITAL", "BRANDING".
- **i18n keys** confirm English-only first launch with placeholders
  reserved (`WECHAT_PAGE_*`, `JOB_FORM_PRONOUNS_ERROR`, etc.).

---

## Information Architecture

Top-level routes observed in the dump and in the build manifest:

- `/` — marketing homepage. Hero (showreel + H1 + tag chips), Project
  Grid (12-col mixed tile sizes), News Feed (3–5 latest articles),
  Awards teaser, Footer.
- `/work` — work index. Title "Work", filter chips (Advertising /
  Digital / Branding / etc.), search input (`work_searchWrapper`), grid
  vs. list view toggle, Project Grid with the same 12-col mixed layout.
- `/work/[project]` — case study. Hero (sticky logo blend + media reel +
  client mark), block content (`BlockContent_image`, `BlockContent_video`,
  `BlockContent_AudioRenderer`, `BlockContent_CarouselRenderer`), credits,
  press, awards, related projects. Header background hides to transparent
  on this route (`Header_isCaseStudy.Header_isAtTheTop`).
- `/about` — about page. Studio reel, disciplines (with hover-to-reveal
  description), people (mosaic with cascading `margin-top: 27% / 54% /
  81% / 108% / 134% / 167%` for a "people spilling down the page" effect),
  awards, Stinkco cross-promo.
- `/news` — news index. NewsHero with editorial headline + image, then a
  NewsFeed of articles grouped by tag.
- `/news/[article]` — article (not directly dumped, inferred from
  `NewsFeed_article`).
- `/contact` — contact page. Title with city list as inline links
  (London / LA / NYC / SF / Shanghai), then per-office cards with map
  link, contact email, and "people" avatars.
- `/careers` — careers index. Lists open roles, "Global Benefits"
  accordion.
- `/job/[id]` — single job application. Form with name / pronouns /
  email / phone / location / portfolio / about / resume upload.
- `/wechat` — WeChat landing page. A scan-code page (only for the China
  market).
- `/privacy-policy` — static page (referenced in footer).
- `/404` — `404_HEADER_TITLE: "404: Page not found."`,
  `404_BACK_BUTTON: "Back to home"`.

For each route the build emits a `/_next/data/<buildId>/<route>.json`
file (e.g. `/_next/data/99QYMQUiCSCjkmvTRApjQ/index.json`,
`work.json`, `about.json`, `news.json`, `contact.json`).

---

## Accessibility

- **Color contrast:** white (`#FFFFFF`) on black (`#000000`) is 21:1.
  Black on white is also 21:1. All body copy meets WCAG AAA at the
  computed sizes. The error red (`#FA0000`) on white is ~4.0:1 — passes
  AA Large only, never used for body text.
- **Focus indicators:** browser default focus ring preserved globally
  (`outline: 1px auto -webkit-focus-ring-color` on `.NewsFeed_articleTitle`
  etc.). Safari receives a synthetic outline via
  `.Disciplines_disciplineButtons.Disciplines_isSafari:focus { outline:
  1px solid var(--secondary) }` because the Safari focus ring on buttons
  is invisible.
- **Keyboard:** all interactive elements are native `<a>`, `<button>`,
  or `<input>` — tab order follows DOM order. The `<ul class="Header_nav">`
  items carry `:hover` and `:focus-within` opacity transitions so they
  reveal on keyboard focus just as on hover.
- **Screen reader landmarks:** present and labeled.
  - `<header class="Header_header">` wraps the top nav.
  - `<nav class="Header_nav" aria-label="…">` wraps the main nav.
  - `<main>` (inferred from CSS `.default_main__WlFWv { flex-grow: 1 }`).
  - `<footer class="Footer_footer">` wraps the footer block.
  - The yin-yang theme toggle carries `aria-label="Switch to light mode"`.
  - The mobile "menu" button has text content "menu" / "close".
- **Skip link:** `#skip li > a` exists in the global CSS
  (`#skip { position: absolute; top: 0; left: 0; width: 100%; … }`) with
  the classic "skip to content" pattern (`top: 30px; left: -99999px`
  when not focused). Visible on focus with `font: 700 50px Arial,
  Freesans, sans-serif`, white-on-pink border.
- **Motion:** `prefers-reduced-motion` is NOT honored (see Reduced
  Motion above).
- **Alt text:** project media uses `aria-hidden="true"` on the link
  wrapper (the actual `<img>` `alt` is empty in the homepage dump), and
  the title `<h3>` carries the project name. Office cards do carry
  Sanity-authored alt text (`"alt": null` in the JSON, but the rendered
  image alt is populated per asset).
- **Form labels:** the newsletter input does not have an associated
  `<label>` in the dumped markup — relies on `placeholder` and the
  button text only.
- **Cookies:** the cookie banner is keyboard-navigable (the buttons are
  native `<button>`) and announces preference via `aria-pressed`-style
  toggles inside the preference panel.

---

## Sources

Every URL the dump was built from, plus the URLs observable in the dump:

- Homepage — https://www.stinkstudios.com/
- Work index — https://www.stinkstudios.com/work
- About — https://www.stinkstudios.com/about
- News — https://www.stinkstudios.com/news
- Contact — https://www.stinkstudios.com/contact
- Careers — https://www.stinkstudios.com/careers
- Privacy policy — https://www.stinkstudios.com/privacy-policy
- 2024 Impact report — http://impact.stinkstudios.com/2024
- Our values — https://stinkstudios.medium.com/our-company-values-8f5f15a1c2c6
- Code of conduct — https://stinkstudios.notion.site/Company-Code-of-Conduct-b71f2bc61e6c4156a97a094368857af9
- Instagram — http://www.instagram.com/stinkstudios
- LinkedIn — https://www.linkedin.com/company/stinkstudios
- Twitter — http://www.twitter.com/stinkstudios
- GTM — https://www.googletagmanager.com/gtm.js?id=GTM-MNRW54Q
- Next.js asset base — https://www.stinkstudios.com/_next/static/chunks/
- Next.js data — https://www.stinkstudios.com/_next/data/99QYMQUiCSCjkmvTRApjQ/{index,work,about,news,contact}.json
- Sanity CDN — https://cdn.sanity.io/images/e2h42t5o/stage/{assetId}-{WxH}.{jpg,gif,mp4}
- Mux video asset (NYC reel) — `playbackId: 4pbBtIe3zzpEDeCxup4I02500sPoqfGznHBX7CNy2TZVg`
- hls.js CDN (loaded on demand by react-player) — https://cdn.jsdelivr.net/npm/hls.js@VERSION/dist/hls.min.js
- dashjs CDN — https://cdnjs.cloudflare.com/ajax/libs/dashjs/VERSION/dash.all.min.js
- flv.js CDN — https://cdn.jsdelivr.net/npm/flv.js@VERSION/dist/flv.min.js
- Netlify RUM — https://www.stinkstudios.com/.netlify/scripts/rum
- Monotype tracking — https://www.stinkstudios.com/mtiFontTrackingCode.js

Files referenced from the local dump:
- `tools/tmp/stinkstudios/manifest.json` — every file in the dump with
  URL / local path / size / sha1.
- `tools/tmp/stinkstudios/playwright/homepage.html` — fully rendered DOM
  of `/`, 681 KB (the HTML Cloudflare returned is empty; this is the
  post-hydration snapshot).
- `tools/tmp/stinkstudios/playwright/computed-styles.json` — per-element
  computed styles (color, font, spacing) for the homepage.
- `tools/tmp/stinkstudios/playwright/homepage.png` — 1440×900 viewport
  screenshot.
- `tools/tmp/stinkstudios/playwright/homepage-fullpage.png` — 1440×5501
  full-page screenshot (the homepage is roughly 3.8 viewports tall).
- `tools/tmp/stinkstudios/css/8ba5003dffc9d10e__30803963.css` — global
  styles, normalize, design tokens, header, footer, video player,
  newsletter, loader, page transitions.
- `tools/tmp/stinkstudios/css/9b90dd0265543734__8603bbe7.css` — news
  page styles.
- `tools/tmp/stinkstudios/css/767ab23c1aa198dc__86ec53ad.css` — work
  index styles.
- `tools/tmp/stinkstudios/css/825362c3d68e3796__c50b6d21.css` — home
  page styles.
- `tools/tmp/stinkstudios/css/56bf3e98cb5520fe__f6e74820.css` — about
  page styles.
- `tools/tmp/stinkstudios/css/cbca810f798e45d6__da1a4744.css` — contact
  page styles.
- `tools/tmp/stinkstudios/js/_app-85129491bd9c8bee__8ae92225.js` — main
  Next.js page bundle (1.3 MB).
- `tools/tmp/stinkstudios/js/framework-0ba0ddd33199226d__a5bb90e7.js` —
  React/React-DOM 18.2.0.
- `tools/tmp/stinkstudios/js/index-4af12ff53395b854__5153bff1.js` —
  index page chunk.
- `tools/tmp/stinkstudios/js/work-bd6a2120459d6bbb__4eda75c8.js` —
  work page chunk.
- `tools/tmp/stinkstudios/js/about-a15828c71533b570__fce152f5.js` —
  about page chunk.
- `tools/tmp/stinkstudios/js/news-8ead0c44f9bc901a__aa887148.js` —
  news page chunk.
- `tools/tmp/stinkstudios/js/contact-c2b7f792504b7146__5366e912.js` —
  contact page chunk.
- `tools/tmp/stinkstudios/js/cc__2f198d9e.js` — Cookiebot (309 KB).
- `tools/tmp/stinkstudios/js/7-003297b77b906d43__2f804a98.js` — main
  shared chunk (Hero/ProjectGrid GSAP timeline + HybridRenderer).
- `tools/tmp/stinkstudios/other/index__d5668520.json` — homepage Sanity
  payload (homepage `data`, `featuredProjects`, footer copy, nav).
- `tools/tmp/stinkstudios/other/work__3b815908.json` — work index
  payload.
- `tools/tmp/stinkstudios/other/about__c537b599.json` — about payload.
- `tools/tmp/stinkstudios/other/news__64e6962c.json` — news payload.
- `tools/tmp/stinkstudios/other/contact__4f705cea.json` — contact
  payload (offices, people, ding icon names, `i18n`, `animateConfig`).
- `tools/tmp/stinkstudios/playwright/media/{0,1,2,3,4,5}__*.ts` — HLS
  video segments for the hero reel.

---

## Changelog

- 2026-06-20 — Initial draft by sub-agent (read dump from
  `tools/tmp/stinkstudios/`, ran grep / file / playwright artifact
  inspection).
