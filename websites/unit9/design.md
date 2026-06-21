# UNIT9 — design.md

> A structured design specification of **https://unit9.com**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** opencode
> **Source dump:** `tools/tmp/unit9/` (gitignored)

---

## Overview

UNIT9 is a London-headquartered production studio whose public website
functions as a portfolio storefront for film, digital, games, VR/AR,
experiential and real-time VFX work. The visual language is restrained
and editorial: black backgrounds, a tight neutral-gray type scale, and
a single full-bleed autoplay reel of finished projects that fills the
viewport on first paint. Categorical navigation is exposed through a
fixed hamburger drawer rather than a top bar. The site's primary
expression is video and still imagery of work; chrome and copy are kept
small so the portfolio can carry the page.

**Category:** Marketing / portfolio (production company)
**Primary surface observed:** Homepage (immersive reel) + `/work`
(case-study index with category filters) + cookie consent banner overlay
**Tone:** Confident, dark, gallery-like, motion-forward; chrome defers to
the reel.
**Framework detected:** WordPress 4.8.28 (custom theme `unit9`,
`style.css?v=2`), jQuery 1.12.4, GSAP/TweenMax 1.19.0, Modernizr 2.8.2,
Slick 1.6.0, jScrollPane, Isotope 1.10.4, History.js, FastClick, Swipe,
matchMedia polyfill. **No** SPA framework, no Tailwind, no WebGL/Three
observed on the home surface (only `<video>`). Built against Yoast SEO
4.3.

---

## Visual Language

### Color

The site is monochrome-first: pure black grounds the hero and most
secondary surfaces; a tight ladder of near-blacks lifts cards and
menus; muted grays handle typography on dark; a single near-white accent
("`#FFFFFF`") drives CTAs and active states.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--bg-base` | `#000000` | Hero, wrapper-inner, .home, .loader scrim |
| Background (elevated) | `--bg-elevated` | `#1A1A1A` | Newsletter popup, footer surface, work tile overlays |
| Background (subtle) | `--bg-subtle` | `#202020` | Header search input, sticky filter bar (.filter) |
| Background (line) | `--bg-line` | `#232323` | 1px borders inside .header-nav |
| Text (primary) | `--text-primary` | `#FFFFFF` | Nav active state, hero h1, newsletter heading |
| Text (secondary) | `--text-secondary` | `#5D5D5D` | Inactive nav links inside drawer |
| Text (muted) | `--text-muted` | `#797979` | Footer copy, footer-newsletter input, work-heading links |
| Text (subtle border) | `--border-subtle` | `#E4E4E4` | .follow / .share-gray dividers on light sections |
| Text (subtle muted) | `--text-muted-2` | `#BEBEBE` | .footer-newsletter-submit hover state, .icon-read-more border |
| Loader scrim | — | `rgba(0,0,0,0.6)` | .loader background, fixed center 80×80 |
| Modal scrim (newsletter) | — | `rgba(0,0,0,0.7)` | .newsletter-wrapper-popup |
| Cookie banner | — | `#F8F9FA` | Light surface, bottom-fixed, `box-shadow: 0 -2px 10px rgba(0,0,0,0.1)` |
| Cookie success button | — | `#110000` | Almost-black; white text |
| Cookie outline | — | `#EDEDED` | Background, with `#110000` text |
| Cookie grayscale | — | `#DFE1E5` | Background, with `#000000` text |
| Twitter share plugin | — | `#1DA1F2` | `tools/tmp/unit9/css/google-analytics__6bc17f16.css:4` |
| Accent (hero CTA border default) | — | `rgba(255,255,255,0.4)` | 2px outline; hardens to `#FFFFFF` on hover |
| Hero text shadow | — | `0 0 16px rgba(0,0,0,0.15)` | Applied to .hero-content |

Dark-mode is the only mode — no `@media (prefers-color-scheme: dark)`
branch is declared. The cookie banner is the lone light surface and
sits `z-index: 1000` over everything.

### Typography

UNIT9 ships three real faces plus one legacy face. **PT Serif** is the
canonical body/serif. **Oswald** is the condensed sans used for every
display heading, nav, button label, and tab. **Droid Sans** (loaded via
Adobe Typekit) is reserved for the home reel's category labels
(`.home-logo-icon`). A custom-CSS override imports **Poppins**
(300/400/500/700) but the override is currently scoped to nothing in
the rendered DOM — the rule is dead code in the dump's HTML but kept
for future use.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (hero h1) | `"Oswald", Helvetica, Arial, sans-serif` | 400 | `3.125em` (≈50px @ 16px) | `1.2em` | normal |
| Display (heading-1) | `"Oswald", Helvetica, Arial, sans-serif` | 400 | `3.125em` | `1.2em` | normal |
| H2 / section title | `"Oswald", Helvetica, Arial, sans-serif` | 400 | varies (see `.heading-1` → `3.125em`) | `1.2em` | normal |
| Filter tab label | `"Oswald", Helvetica, Arial, sans-serif` | 400 | inherited `16px` | `20px` | normal |
| Button / submit | `"Oswald", Helvetica, Arial, sans-serif` | 400 | `14px` | normal | `1px` (`.footer-newsletter-submit`); `0.075em` (`.hero-content-cta`) |
| Read more label | `"Oswald", Helvetica, Arial, sans-serif` | 400 | `.875em` (14px) | `1.71429em` | `0.1em`, uppercase |
| Hero CTA | `"Oswald", Helvetica, Arial, sans-serif` | 400 | `.875em` (14px) | `1.71429em` | `0.075em`, uppercase |
| Body | `"PT Serif", Georgia, "Times New Roman", serif` | 400 | `16px` (root) | `16px` | normal |
| Body (newsletter p) | `"PT Serif", Georgia, "Times New Roman", serif` | 400 | `1.125em` (18px) | `1.38889em` | normal |
| Body S / caption | `"PT Serif", Georgia, "Times New Roman", serif` | 400 | `0.875em` (14px) | inherited | normal |
| Project content h2 | `"PT Serif", …` | 400 | `1.275em` | inherited | normal |
| Project content ul | `"PT Serif", …` | 400 | `0.875em` | inherited | normal |
| Footer legal | inherits PT Serif | 400 | `.75em` (12px) | `1.33333em` | normal |
| Home reel category label | `'droid-sans'` (Typekit) | 400 | `24px` | `16px` | normal, uppercase |
| Home reel logo image | (PNG, not a font) | — | ~`90%` of viewport width | — | — |
| Tab cell title (work-list) | inherits Oswald/PT Serif | 400 | inherited | inherited | normal |
| Cookie banner body | inherits PT Serif | 400 | `14px` | `16px` | normal |
| Cookie banner H3 | inherits PT Serif | 400 | `24.5px` | `29.75px` (≈1.21) | normal |

Stack notes:

- PT Serif and Oswald are served from Google Fonts at
  `https://fonts.googleapis.com/css?family=PT+Serif:400,700,400italic,700italic|Oswald`
  with `unicode-range` subsets (cyrillic-ext, cyrillic, vietnamese,
  latin-ext, latin) — see `tools/tmp/unit9/playwright/css/css__f392901e:1-168`
  (also fetched as `TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.woff2` and
  `EJRTQgYoZZY2vCFuvAFWzr8.woff2` in
  `tools/tmp/unit9/playwright/fonts/`). They are **not** self-hosted.
- Droid Sans 400/700 is served by Adobe Typekit at kit id `rgb0ivf`
  (`tools/tmp/unit9/css/rgb0ivf__457b94c0.css:1-29`,
  `https://use.typekit.net/rgb0ivf.css`).
- The custom-CSS rule importing Poppins
  (`tools/tmp/unit9/playwright/homepage.html:98`) is currently unused by
  any selector in the rendered DOM.

### Spacing & radius

- **Base unit:** ~4px (header trigger padding `18px 16px`,
  `.hero-content-cta` padding `10px 26px`).
- **Scale observed:** 2, 4, 8, 10, 12, 14, 15, 16, 17, 18, 20, 22, 26,
  30, 34, 40, 44, 50, 54, 64, 100, 130, 136 px (vertical rhythm is
  aligned to multiples of 2 with frequent 4-multiples).
- **Radii:** `0px` default. Exceptions:
  - `.icon-read-more` → `17px` (visual ~circle for 30px button)
  - `.loader-spin span` → `20px` (border ring on 22px square)
  - `.cookie-consent-button` → `4px`
  - social icon masks `.icon-facebook` etc. → `0px`
  - The Twitter share button uses `9999px` (full pill).
- **Shadows:** extremely restrained. Only two visible:
  - `.hero-content` text: `0 0 16px rgba(0,0,0,0.15)`
  - `#cookie-consent-banner`: `rgba(0,0,0,0.1) 0px -2px 10px 0px`
  - Otherwise dark cards "elevate" by tonal step (`#000` → `#1A1A1A` →
    `#202020`), not shadow.

### Iconography

- **Style:** monochrome (white-fill) glyphs in a single SVG sprite
  (`tools/tmp/unit9/svgs/sprite__2951922b.svg`, 44 KB,
  `viewBox="370 58 1920 1080"`) plus three standalone social SVGs.
- **Library:** custom sprite sheet referenced via `background-image:
  url("../images/sprite.svg")` with negative `background-position` per
  glyph (`.icon-facebook` at `-350px -100px`, `.icon-twitter` at
  `-300px -100px`, etc.). Not Lucide / Phosphor / Heroicons.
- **Glyphs shipped in the sprite (named in CSS):** `icon-share`,
  `icon-share-remove`, `icon-close` (44×44, rotates 90° on hover),
  `icon-drag-drop`, `icon-filter-drop`, `icon-filter-drop-big`,
  `icon-read-more`, `icon-facebook`, `icon-twitter`, `icon-gplus`,
  `icon-instagram`, `icon-linkedin`, `icon-youtube`,
  `icon-google-plus`, plus the six "u9" logotypes (`icon-u9-films`,
  `icon-u9-digital`, `icon-u9-games`, `icon-u9-vr`,
  `icon-u9-technology`, `icon-u9-presents`) used for menu and
  credits rows.
- **Default size:** 44px on social icons in the footer; 50px on social
  icons in the newsletter modal; 22-26px for utility icons. Logotypes
  are 410px wide hero variants and 86-245px wide nav variants.
- **Fill color:** white `#FFFFFF` over the sprite (`<g fill="#fff">`),
  so all icons recolor to whatever the parent text color is.

---

## Layout & Grid

- **No fixed content column.** The homepage is a single
  `position:absolute;left:0;top:0;width:100%;height:100%;` canvas; the
  video and menu overlay fill the viewport edge-to-edge.
- **Work index (`.work`) uses 12-column-style** masonry laid out by
  Isotope 1.10.4 with thumbnails sized `462×258px` (`.work-list img`
  uses literal `width="462" height="258"` attributes).
- **Page gutter:** none on home; on `/work` the filter bar is full-bleed
  `.filter { height: 55px; background: #202020 }` with internal padding
  `15px 83px 14px`.
- **Breakpoints observed in `style__e7d8afbe.css`:**
  - `max-width: 1600px`
  - `max-width: 1000px` (tablet breakpoint; many mobile rules)
  - `max-width: 780px` (large phone)
  - `max-width: 767px` (with orientation split)
  - `max-width: 660px` (phone)
  - `max-width: 480px`
  - `min-width: 661px`, `min-width: 768px`, `min-width: 781px`,
    `min-width: 1000px`, `min-width: 1001px`, `min-width: 1600px`
- **Vertical rhythm:** 4 / 8 px base.
- **Sticky surfaces:** the hamburger trigger
  (`#menu-trigger`, `position: fixed; top:0; left:0; z-index: 8`),
  the `.header-wrap` (containing the `.header-nav` drawer,
  `width:240px`), and `.menu-closer` (right-side click-catcher once
  the drawer opens). The `.loader` is `position:fixed; left:50%; top:50%`
  and `80×80 px`.

The home layout sequence is: black viewport → full-bleed muted looping
`<video>` behind → a 6-tile bottom dock (`.home-menu`, 6 ×
`16.666%` wide) → centered top logo PNG (`.home-title`). Once the user
clicks a tile the page transitions (via pushState, see History.js) to
the matching category page (`/films`, `/digital`, etc.), which itself
contains a hero image, a filter bar, and a masonry of case studies.

The work index layout sequence is: top fixed drawer → filter nav (full
bleed) → `.work-heading-content` (sticky sub-bar with active chips) →
`.work-list` (Isotope masonry) → infinite-scroll appender
(`<div class="infinite-loading-container">`) → footer.

---

## Components

### Header / hamburger trigger (`#menu-trigger`)

- **Anatomy:** three `<span>` bars stacked, each `23px × 3px`,
  separated by `4px` margin; sits inside an `a` element sized
  `23px × 18px` content + `padding: 18px 16px` (so the click target
  is `55px × 52px`).
- **Background:** `rgba(0,0,0,0.5)` (translucent black).
- **Hover (closed):** bar 1 lifts `-2px`, bar 3 lifts `+2px` (both
  `transform: translate3d(...)`).
- **Open state (`.is-menu-open`):** bars morph to "×" via
  `translate3d(0,7px,0) rotate(45deg)` and
  `translate3d(0,-7px,0) rotate(-45deg)`; middle bar collapses to
  `scaleX(0.1)` with `opacity: 0`. Transition: `transform .6s
  cubic-bezier(0.165, 0.84, 0.44, 1)`.
- **Mobile:** padding tightens to `15px 12px`.

### Side drawer (`.header-nav`)

- **Width:** `239px` (jScrollPane forces `width: 239px` once mounted;
  base CSS uses `240px`).
- **Background:** `#000000`.
- **Border:** `border-right: 1px solid #232323`.
- **Slide animation:** starts at `translate3d(-240px, 0, 0)`,
  `visibility: hidden`, transitions to `translate3d(0,0,0)` with
  `visibility: visible` on `.is-menu-open`. Duration `.6s
  cubic-bezier(0.165, 0.84, 0.44, 1)`, with visibility delay `.4s` so
  the drawer becomes visible only after the slide-in begins.
- **Top section** is `<form class="header-form">` (search) sized
  `240 × 48px`, background `#202020`, with `<input>` 200×54 right-aligned
  and a search button `40×54` on the left that uses a sprite-mask
  (`background-position: -305px -2px`).
- **Menu list** has `.menu-division` items first (the seven category
  divisions: Films, Digital, Games, VR/AR, Experiential, Real Time VFX,
  Presents) rendered as `<li class="menu-division"><a><span>Films</span></a></li>`,
  then plain `<li>` items for the secondary nav (Home, Work, Directors,
  Reels, Attractions, About, Jobs, Contact).
- **Item style:** `padding: 17px 40px`, `border-top: 1px solid #232323`,
  `border-bottom: 1px solid #232323`, `margin-bottom: -1px` to collapse
  the double border, color `#5D5D5D` (inactive) / `#FFFFFF` (active via
  `.is-active` class), transition `color .3s cubic-bezier(0.165, 0.84,
  0.44, 1)`.
- **Right gutter:** a `.menu-closer` overlay (`width:100%; height:100%;
  left:240px; top:0; z-index:7`) catches clicks to close the drawer.

### Home reel tiles (`.home-menu-link` × 6)

- **Desktop layout:** a single horizontal row that occupies the bottom
  20% of the viewport (`.home ul { position: absolute; left:0; bottom:0;
  width:100%; height:20% }`). Each `<li>` is `width: 16.666%; float:
  left; position: relative; top: 85%`.
- **Tile content:** `.home-logo.home-films` (or `.digital`, `.games`,
  `.vr`, `.technology` × 2 for Experiential + Real Time VFX) wrapping
  `.home-films-inner` (or analogue), which wraps a single
  `<span class="home-logo-icon">Films</span>`.
- **Tile label:** `'droid-sans'`, `24px`, uppercase, white,
  text-shadow none, opacity-animated via `@keyframes fadeIn 2s 2s
  forwards` (delay 2s, or 2.6s after a stagger). On hover the tile
  scales `scale(1.1, 1.1)` over `.6s` with the standard easing.
- **Mobile layout:** the row reflows to a vertical stack filling `100vh`
  with each tile `height: 12.66%` (or `16%` in an older breakpoint) —
  see custom CSS at
  `tools/tmp/unit9/playwright/homepage.html:100-114`.

### Home title logo (`.home-title`)

- **Anatomy:** `<h1 class="home-title">` wrapping
  `<img class="home-title__logo" src="/wp-content/themes/unit9/images/adage_2.png" alt="UNIT9">`.
- **Mobile:** the image is swapped via CSS `content: url(...)` to
  `https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/UNIT9-Website-Hero-2023.png`
  — see the `wp-custom-css` block at
  `tools/tmp/unit9/playwright/homepage.html:120-121`.
- **Position:** centered, `margin: -90px 0 0` to lift above the dock,
  with `width: 90%`. Animates in via `animation: fadeIn 1s 0.5s
  forwards, remove 1s 2.5s forwards` so it briefly appears and then
  fades out; once the JS sets `body.class="is-top animation-finished"`
  the animation is canceled and the logo stays. The wrapper
  `.home-title` also gets `translate3d(240px, -50%, 0)` when the
  drawer opens.

### Newsletter popup (`.newsletter-wrapper-popup`)

- **Scrim:** `position: fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.7); z-index: 100`.
- **Modal box:** `.newsletter-popup` with `background: #1A1A1A`, `color:
  #797979`, `min-width: 500px; max-width: 650px; width: 50%`, centered
  via `position: absolute; top: 50%; transform: translate(-50%, -50%)`,
  z-index 999 (note: lower than the scrim's z-index 100 but it works
  because it's inside the scrim).
- **Two-column inner grid:** `.newsletter-cols` with two
  `.newsletter-col` items; the left col is right-aligned with the
  heading "Want to see more fun stuff?" (`font-size: 1.25em`,
  `line-height: 1.2em`, color `#FFFFFF`) and subheading "Get our
  newsletter" (`0.875em`, color `#797979`). The right col has a
  `<form class="js-newsletter">` with `<input placeholder="E-mail">`
  and a submit button labeled "Sign up" styled as
  `.footer-newsletter-submit`.
- **Social row:** `.newsletter-footer-social` with five `<li>` items
  (Facebook, Twitter, Instagram, LinkedIn, YouTube), each `<a>`
  containing an `<i class="icon-XXX">Label</i>` for text-sr-only plus
  the sprite icon.

### Footer (`.footer`)

- **Surface:** `background: #1A1A1A; color: #797979; padding: 136px 0 90px;
  z-index: 3; position: relative`.
- **Newsletter cols (`.footer-newsletter-cols`)** mirror the popup but
  with `margin-bottom: 54px`.
- **Footer social (`.footer-social`)** five 44×44 icons in a row,
  centered, `margin-bottom: 110px` (then 100px on a small breakpoint).
- **Footer icon (`.footer-icon`)** 44×44 absolute-centered logo
  (`<img class="footer__logo" src="…/unit9_logo.svg">`).
- **Footer legal (`.footer-legal`)** `padding-top: 60px; text-align:
  center; font-size: .75em; line-height: 1.33333em`. Holds four links
  ("Privacy policy", "© {year} UNIT9. All Rights Reserved", "Website
  terms of use", "Modern Slavery Statement") and a PDF download chain
  for each.

### Cookie consent banner (`#cookie-consent-banner`)

- **Surface:** fixed bottom bar `background: #F8F9FA; box-shadow:
  rgba(0,0,0,0.1) 0 -2px 10px 0; padding: 15px; font-size: 14px; text-align:
  center; z-index: 1000`.
- **Heading:** `Cookie settings` rendered as an `<h3>` (PT Serif,
  24.5px).
- **Body:** PT Serif 14px paragraph with standard copy.
- **Buttons:** three `.cookie-consent-button` instances.
  - `.btn-success` (Accept All): `background: #110000; color: white;
    border-radius: 4px; padding: 8px 16px; font-size: 14px`.
  - `.btn-outline` (Accept Selection): `background: #EDEDED;
    color: #110000`.
  - `.btn-grayscale` (Reject All): `background: #DFE1E5; color: black`.
  - Hover: `box-shadow: 0 -2px 5px rgba(0,0,0,0.2)`. Active: `opacity:
    .5`.
- **Options row:** `.cookie-consent-options { display: flex;
  justify-content: center; flex-wrap: wrap; margin-bottom: 10px }`
  with four checkbox labels (Necessary (disabled checked), Analytics
  (checked), Preferences (checked), Marketing (unchecked)). Each label
  has `margin: 0 10px`.
- **Persistence:** choices are written to `localStorage.consentMode` as
  JSON and pushed to Google Analytics consent mode via `gtag('consent',
  'update', …)`.

### Loader (`.loader`)

- **Box:** `width: 80px; height: 80px; position: fixed; left: 50%; top:
  50%; margin: -40px 0 0 -40px; z-index: 100; background:
  rgba(0,0,0,0.6); border-radius: 0`. Hidden by default with
  `visibility: hidden; opacity: 0`. Shown via `.is-loading-content`
  body class which transitions opacity `.3s linear .4s`.
- **Spinner:** `.loader-spin` is `15px × 30px` placed `right: 40px;
  top: 25px` inside the box. The inner `<span>` is a `22px × 22px`
  white ring (`border: 4px solid #fff; border-radius: 20px`). The
  spin uses `@keyframes loader` (`transform: rotate(0deg)` →
  `transform: rotate(360deg)`) over `1.2s linear infinite` with
  `transform-origin: 100% 50%`. Paused by default (`animation-play-state:
  paused`), resumed under `.is-loading-content`.

### Work index — filter bar (`.filter`)

- **Surface:** `height: 55px; background: #202020; text-align: left;
  position: relative`.
- **Top-level items:** inline-block, `border-bottom: 1px solid
  transparent`, `color: #797979`, `height: 54px`. Each opens a
  `.filter-tab` slide-down on click (animated via TweenLite with
  `Quad.easeOut`, see `scripts.min__6eeab81b.js`).
- **Heading row:** `.work-heading-content` `position: absolute;
  left: 0; width: 100%; padding: 15px 83px 14px; background: #FFFFFF;
  text-overflow: ellipsis; white-space: nowrap`.
- **Active filter chips:** `.work-heading-active a` in `font-size:
  0.75em; line-height: 2.16667em`, color `#797979`, with `border-bottom:
  1px solid transparent` that hardens to `#797979` for `.is-active` /
  `:hover`. Transition `border-color .6s cubic-bezier(0.165, 0.84,
  0.44, 1)`.

### Work index — case-study card (`.work-list li`)

- **Anatomy:** `<li class="is-loading" data-work-id="…"><a href="…"><img
  width="462" height="258" alt=""><div class="tab-wrap"><div
  class="tab"><div class="tab-cell"><span class="work-list-name">Director
  name</span><span class="work-list-title">Project title</span></div></div></div></a></li>`.
- **Image:** literal `462 × 258` raster; sized by `width="462"
  height="258"` attributes (no CSS sizing).
- **Hover state:** the image is loaded lazily (`.is-loading img {
  opacity: 0 }`); once revealed by JS the image fades in.
- **Tab overlay:** `.tab` overlay sits over the image with `.tab-cell`
  vertically centering the project title in white type.

### Hero — case-study (`.hero-content`)

- **Layered on a `<div class="hero">`** with `width:100%; height:100%;
  position: absolute; top:0; left:0; color: #FFFFFF;
  font-family: "Oswald", Helvetica, Arial, sans-serif; text-shadow:
  0 0 16px rgba(0,0,0,0.15)`.
- **H1:** `font-size: 3.125em; line-height: 1.2em; margin-bottom: 30px`.
- **CTA:** `.hero-content-cta { padding: 10px 26px; border: 2px solid
  rgba(255,255,255,0.4); font-size: 0.875em; line-height: 1.71429em;
  letter-spacing: 0.075em; text-transform: uppercase; width: 150px;
  margin: 0 auto 20px; cursor: pointer; transition: all .3s
  cubic-bezier(0.165, 0.84, 0.44, 1) }`. Hover hardens the border to
  `#FFFFFF`.
- **Next-arrow chevron:** `.hero-next` uses
  `@keyframes hero-next .6s` (defined at `style__e7d8afbe.css`
  inside the `hero-next` keyframes block — see Animations section).

### Hero video (`.home-video`)

- **Anatomy:** `<video muted="true" loop style="width: 1600px; height:
  900px; margin-top: 0px; margin-left: -80px">` with two `<source>`
  entries:
  - `https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/V6_UNIT9-HOMEPAGE-REEL-2.mp4` (H.264)
  - `https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/V6_-UNIT9-HOME-REEL.webm` (VP9)
- **Wrapper:** `.home-video { opacity: 1; }` sits inside
  `.home { position: absolute; left:0; top:0; width:100%; height:100%;
  overflow: hidden; background: #000 }`.
- **When the drawer opens** (`.is-menu-open`): `.home-video`,
  `.wrapper-inner`, `.wrapper-inner-bg` all translate
  `translate3d(240px, 0, 0)` over `.6s cubic-bezier(0.165, 0.84, 0.44, 1)`
  to slide the entire homepage out and reveal the drawer.

---

## JavaScript & Libraries

| Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| jQuery | 1.12.4 | `jquery__2bf61f8e.js:1` banner comment; also 1.10.2 from `//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js` loaded later | Two versions coexist (WordPress core 1.12.4 + a Google CDN 1.10.2) |
| jQuery Migrate | 1.4.1 | script tag `ver=1.4.1` in head | Migration helper |
| Modernizr | 2.8.2 | `head__5d79c30f.js:1` `m="2.8.2"`; sets body classes `js no-touch history backgroundsize cssgradients csstransforms csstransforms3d csstransitions video svg no-android no-ios6 no-ios7 no-ios complex-detection-desktop` | Feature-detect; gates the drawer animation between `csstransforms3d.android` and `csstransforms3d.no-android` |
| matchMedia polyfill | (legacy) | `matchMedia(` string in `scripts.min__6eeab81b.js` | Used in `Site.Scrolling.callbacks.hero` to gate parallax |
| TweenMax / GSAP | 1.19.0 | `ba.version="1.19.0"` in `scripts.min__6eeab81b.js:6` | Used for filter dropdown tweens, hero parallax (`Site.Scrolling.callbacks.hero`, `hero_about`), and any `TweenLite.to(...)` call site-wide |
| Slick (carousel) | 1.6.0 | `version:"1.6.0"` in `scripts.min__6eeab81b.js:7` | Reels / mobile carousels |
| Isotope | 1.10.4 | `version:"1.10.4"` appears twice in `scripts.min__6eeab81b.js` | Lays out `.work-list` masonry |
| jScrollPane | 4.x | `jspContainer` / `jspPane` HTML wrappers appear in the rendered `.header-nav` (`playwright/homepage.html:178`) | Custom scrollbars inside the side drawer |
| History.js | 4.x | 18 occurrences in `scripts.min__6eeab81b.js` | pushState routing (`Site.PushStates.changePath`, `Site.PushStates.setTitle`) so the home → category transition does not reload the page |
| FastClick | 1.x | 40 occurrences | Removes 300ms tap delay on mobile |
| Swipe | 1.x | `a.fn.Swipe=…` | Touch swipe helper |
| infinite-scroll | 2.x | 16 occurrences | Paginates the work index |
| Dotdotdot / jquerypp | 1.3.7 | `version:"1.3.7"` in `scripts.min__6eeab81b.js:4` | Truncates long copy |
| wp-syntax | 1.1 | script-tag `ver=1.1` in head | Code-syntax highlighter (unused on the home surface) |
| wp-embed | 4.8.28 | script-tag `ver=4.8.28` | Embed handler |
| WordPress core | 4.8.28 | `wp-emoji-release.min.js?ver=4.8.28`, Yoast SEO `v4.3` | CMS |
| Google Tag Manager | GTM-TR27LTRH | script tag in head | Container; loads `gtag` + GA4 `G-8KPP05ZWF6` |
| jQuery Masonry / Isotope | 1.10.4 | (combined with Isotope row) | — |
| Video sources | — | `<video>` with `muted loop`, H.264 + WebM | No player library; native `<video>` only |

There is **no** SPA framework (no React / Vue / Svelte / Alpine) and
**no** Tailwind utility CSS. The site is server-rendered WordPress HTML
that progressively enhances with jQuery + GSAP.

Site-side modules are detected via `data-script="…"` attributes on top
containers (`data-script="Home"`, `data-script="Filter"`); the bundle
at `scripts.min__6eeab81b.js:11` references `Site.Filter.View`,
`Site.Filter.Model`, `Site.Scrolling`, `Site.PushStates`,
`Site.MobilePress`, `Site.About`, etc. (the full namespace lives inside
the concatenated script).

---

## Animations (Catalog)

### CSS @keyframes

All `@keyframes` blocks live in the single concatenated
`tools/tmp/unit9/css/style__e7d8afbe.css` (~119 KB on one line). They
are listed in the order they appear in the file.

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `loader` | `css/style__e7d8afbe.css` (single-line; bundled) | `1.2s` | `linear` | infinite, only while `.is-loading-content` body class is set (paused otherwise) |
| `hero-next` | `css/style__e7d8afbe.css` (single-line; bundled) | `0.6s` | (default ease — CSS `ease`) | `.csstransforms3d .hero-next:hover:after` — chevron flick |
| `fadeIn` | `css/style__e7d8afbe.css` (single-line; bundled) | `1s`–`2s` (varies by call site, see below) | default `ease` | applied to `.home-logo-icon`, `.home-title__logo`, `.home-title` (fades the home reel in after load) |
| `remove` | `css/style__e7d8afbe.css` (single-line; bundled) | `1s` | default `ease` | composes with `fadeIn` on `.home-title` to fade the placeholder logo back out before the staggered tile labels appear |
| `moveNumber` | `css/style__e7d8afbe.css` (single-line; bundled) | `0.3s` (typical inferred) | default `ease` | counter/project number reveal (used by `Site.Scrolling` parallax) |
| `moveText` | `css/style__e7d8afbe.css` (single-line; bundled) | `0.3s` | default `ease` | companion to `moveNumber` for the label pair |

Concrete `@keyframes` bodies (in declaration order):

```
@keyframes loader {
  0%   { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}
@keyframes hero-next {
  0%   { transform: translate3d(0,0,0) }
  49%  { opacity: 1; transform: translate3d(0, 50px, 0) }
  50%  { opacity: 0; transform: translate3d(0, 50px, 0) }
  51%  { opacity: 0; transform: translate3d(0, -50px, 0) }
  52%  { opacity: 1; transform: translate3d(0, -50px, 0) }
  100% { transform: translate3d(0, 0, 0) }
}
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes remove { from { opacity: 1 } to { opacity: 0 } }
@keyframes moveNumber {
  from { transform: translateY(15px); opacity: 0 }
  to   { transform: translateY(1px);  opacity: 1 }
}
@keyframes moveText {
  from { transform: translateY(-15px); opacity: 0 }
  to   { transform: translateY(0);     opacity: 1 }
}
```

The dominant site-wide transition curve is
`cubic-bezier(0.165, 0.84, 0.44, 1)` (Material-style "ease out
quint" approximation, ≈ `ease-out` but with a slower tail). It is
applied with prefixes (`-moz-`, `-o-`, `-webkit-`) on every
transitionable element via shorthand:

- `transition: transform .6s cubic-bezier(0.165, 0.84, 0.44, 1)` —
  drawer / page shift on `.header-nav`, `.home-video`, `.wrapper-inner`,
  `.wrapper-inner-bg`, `.work-share`, `.header:before`, `.home ul`,
  `.home-logo`.
- `transition: all .6s cubic-bezier(0.165, 0.84, 0.44, 1),
  visibility 0s linear .4s` — paired with a 400 ms visibility delay so
  the drawer only becomes focusable after the slide-in begins.
- `transition: all .3s cubic-bezier(0.165, 0.84, 0.44, 1)` — hover
  effects on links, buttons, social icons.
- `transition: all .3s linear` — link fades (`.follow a:hover {
  opacity: 0.6 }`, social icon hover).
- `transition: background .6s cubic-bezier(0.165, 0.84, 0.44, 1)` —
  submit button.
- `transition: opacity .4s ease, visibility 0s linear .4s` —
  `.work-heading-nav` reveal.

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP (TweenLite) | `TweenLite.to(active.parent().find('.filter-tab').children(), .4, {delay:.2, opacity:0})` | filter dropdown close | `Quad.easeOut` |
| GSAP (TweenLite) | `TweenLite.to(c, .8, {height:d, ease:Quad.easeOut})` and `TweenLite.to($('#filter-content').find('.work-heading'), .8, {height:d+55, ease:Quad.easeOut})` | filter dropdown open | Stacks `d` (the tab's outerHeight) with the `.work-heading` height so the page grows in unison |
| GSAP | `Site.Scrolling.callbacks.hero(b, c)` | scroll tick (`requestAnimationFrame` loop) | Direct CSS writes: `b.$child` translate by `Math.round(f*b.height/2)` px, `b.$img` translate by `Math.round(e*b.height*2)` px with `opacity = 1 - f*f`. `.hero-options-notice` opacity = `1 - f*f*3` |
| GSAP | `Site.Scrolling.callbacks.hero_about(a, b)` | scroll tick | Same shape, sets `a.$next` opacity = `max(0, 1-2*e)` |
| GSAP | `Site.Scrolling.markActiveDots()` | route change | Scrolls the about page's nav dots to the active section |
| History.js | `Site.PushStates.changePath(path)` + `setTitle(title)` | tile click on the home reel | pushState so the URL becomes `/films`, `/digital`, etc., without reload |
| Slick | `(carousel).slick` init | DOMContentLoaded | Used for reels and case-study carousels |
| Isotope | masonry layout | after `.work-list img` load | Re-layouts on filter change |
| jScrollPane | mounts custom scrollbar | drawer open | Wraps `.header-nav` with `.jspContainer` |
| FastClick | attaches `touchstart` etc. | `DOMContentLoaded` | on body |
| TweenMax | bundled but only 6 calls in source | (any explicit `TweenMax.to`) | Library shipped; used minimally |

### Page transitions

- The home → category navigation is **not** a full page reload when
  JS-driven: the hamburger drawer slides in, History.js calls
  `Site.PushStates.changePath('/films')` and `setTitle(...)`, and
  `Site.Scrolling.markActiveDots()` re-evaluates the active section.
- Direct-link first paint (no client routing involved) shows the same
  DOM minus the drawer state. There is **no** crossfade or
  shared-element transition between routes — the drawer simply slides
  back over the new content.

### Where animations are *not* used

- `@media (prefers-reduced-motion: reduce)` is **not** observed in the
  bundled CSS — the site does not opt into reduced-motion handling.
- No Lottie / Bodymovin JSON, no After Effects-exported sprite.

---

## Assets

### 3D models

N/A — no `.glb`, `.gltf`, `.obj`, `.fbx`, `.usdz` files in
`tools/tmp/unit9/`. The site does not ship any 3D assets; the immersive
effect comes from the `<video>` reel, not WebGL.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Oswald | 400 | woff2 (5 subsets: cyrillic-ext, cyrillic, vietnamese, latin-ext, latin) | Google Fonts (`https://fonts.googleapis.com/css?family=Oswald`) | no — Google Fonts CDN; woff2 mirrors seen at `tools/tmp/unit9/playwright/fonts/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ__545ba9d2.woff2` (and one labelled `l__dcc34f0c` — likely a subset fetched but not loaded on the homepage) |
| PT Serif | 400, 700, 400 italic, 700 italic | woff2 | Google Fonts (`https://fonts.googleapis.com/css?family=PT+Serif:400,700,400italic,700italic`) | no — Google Fonts CDN; mirror at `tools/tmp/unit9/playwright/fonts/EJRVQgYoZZY2vCFuvAFWzr8__ec8ef22a.woff2` |
| Droid Sans | 400, 700 | woff2, woff, opentype | Adobe Typekit (`https://use.typekit.net/rgb0ivf.css`) | no — Typekit CDN |
| Poppins | 300, 400, 500, 700 | (declared in custom CSS but unused) | Google Fonts (`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap')` at `playwright/homepage.html:98`) | no — declared in inline `<style id="wp-custom-css">`, no selector in the rendered DOM uses it |

### Images

49 image files in `tools/tmp/unit9/images/`. The work-index thumbnails
are all `462 × 258` (enforced by `width="462" height="258"` HTML
attributes on every `.work-list img`). A representative sample with
sizes:

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/unit9/images/adage_2__623c3cc7.png` | PNG | desktop home logo, width ~1280 (placeholder) | 121 819 B | `/wp-content/themes/unit9/images/adage_2.png` | `.home-title img` desktop logo; replaced on mobile via `content: url(...)` |
| `tools/tmp/unit9/playwright/images/UNIT9-Website-Hero-2023__d686de67.png` | PNG | (hero logo, mobile override) | (mirror) | `https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/UNIT9-Website-Hero-2023.png` | mobile variant of the home title |
| `tools/tmp/unit9/images/CASE-Study-462x258__16ff5043.png` | PNG | `462 × 258` | 133 681 B | `/wp-content/uploads/CASE-Study-462x258.png` | Harbin Beer: NBA FOOH Drone Show |
| `tools/tmp/unit9/images/coca-cola-fresco-header-462x258__75d066f1.png` | PNG | `462 × 258` | 266 569 B | `/wp-content/uploads/coca-cola-fresco-header-462x258.png` | Coca-Cola Fresco project |
| `tools/tmp/unit9/images/DBC_WASHAWAY_4-462x258__4ec255d3.png` | PNG | `462 × 258` | 122 901 B | `/wp-content/uploads/DBC_WASHAWAY_4-462x258.png` | Destination BC: Great Wilderness Car Wash |
| `tools/tmp/unit9/images/do_act_on_ckd_19_graded-00_00_29_08-still003-462x258__602bd5c1.png` | PNG | `462 × 258` | 189 068 B | `/wp-content/uploads/do_act_on_ckd_19_graded-00_00_29_08-still003-462x258.png` | "Act on CKD" still |
| `tools/tmp/unit9/images/Dove-Header-Darker-462x258__75aa5eeb.png` | PNG | `462 × 258` | 75 535 B | `/wp-content/uploads/Dove-Header-Darker-462x258.png` | Dove case study |
| `tools/tmp/unit9/images/facebookshareable-20-462x258__7d95a0e1.png` | PNG | `462 × 258` | 181 080 B | `/wp-content/uploads/facebookshareable-20-462x258.png` | Facebook shareable work |
| `tools/tmp/unit9/images/five_12-462x258__bf52a1e7.jpeg` | JPEG | `462 × 258` | 41 057 B | `/wp-content/uploads/five_12-462x258.jpeg` | "Five" project |
| `tools/tmp/unit9/images/Footer-5-462x258__44c23508.png` | PNG | `462 × 258` | 127 238 B | `/wp-content/uploads/Footer-5-462x258.png` | Footer-5 still |
| `tools/tmp/unit9/images/Frame1_PegasusRelay_1-1-462x258__924743b8.jpg` | JPEG | `462 × 258` | 15 709 B | `/wp-content/uploads/Frame1_PegasusRelay_1-1-462x258.jpg` | Pegasus Relay |
| `tools/tmp/unit9/images/Header-10-462x258__e417b92b.png` | PNG | `462 × 258` | 216 606 B | `/wp-content/uploads/Header-10-462x258.png` | work tile |
| `tools/tmp/unit9/images/Header-11-462x258__d0c46b26.png` | PNG | `462 × 258` | 192 420 B | `/wp-content/uploads/Header-11-462x258.png` | work tile |
| `tools/tmp/unit9/images/Header-3-462x258__a16044f1.png` | PNG | `462 × 258` | 164 518 B | `/wp-content/uploads/Header-3-462x258.png` | work tile |
| `tools/tmp/unit9/images/Header-5-462x258__02992d7a.png` | PNG | `462 × 258` | 191 335 B | `/wp-content/uploads/Header-5-462x258.png` | work tile |
| `tools/tmp/unit9/images/Header-9-462x258__9fd7ac14.png` | PNG | `462 × 258` | 146 011 B | `/wp-content/uploads/Header-9-462x258.png` | work tile |
| `tools/tmp/unit9/images/header_new_large-1-462x258__a8cef15e.png` | PNG | `462 × 258` | 186 964 B | `/wp-content/uploads/header_new_large-1-462x258.png` | work tile |
| `tools/tmp/unit9/images/header-updated-462x258__b1a0f407.png` | PNG | `462 × 258` | 199 628 B | `/wp-content/uploads/header-updated-462x258.png` | work tile |
| `tools/tmp/unit9/images/Hero-26-462x258__bd0ddf5c.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/Hero-26-462x258.png` | work tile |
| `tools/tmp/unit9/images/Hero-462x258__d3386d04.jpeg` | JPEG | `462 × 258` | (mirror) | `/wp-content/uploads/Hero-462x258.jpeg` | work tile |
| `tools/tmp/unit9/images/Hero_SKY_UP_1-462x258__ab240e60.jpeg` | JPEG | `462 × 258` | (mirror) | `/wp-content/uploads/Hero_SKY_UP_1-462x258.jpeg` | Sky Up case study |
| `tools/tmp/unit9/images/lego-x-pharrell-williams-pinball-experience-462x258__e8946ab6.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/lego-x-pharrell-williams-pinball-experience-462x258.png` | LEGO × Pharrell Williams Pinball |
| `tools/tmp/unit9/images/mtv-active-minds-a-s-k-462x258__8aaedbf1.jpg` | JPEG | `462 × 258` | (mirror) | `/wp-content/uploads/mtv-active-minds-a-s-k-462x258.jpg` | MTV work |
| `tools/tmp/unit9/images/nike-win-on-air-outernet-header-final-462x258__7d9c58bf.jpg` | JPEG | `462 × 258` | (mirror) | `/wp-content/uploads/nike-win-on-air-outernet-header-final-462x258.jpg` | Nike Win on Air |
| `tools/tmp/unit9/images/syky-apple-vision-pro-press-hero-image-01-dark-462x258__c124f038.jpg` | JPEG | `462 × 258` | (mirror) | `/wp-content/uploads/syky-apple-vision-pro-press-hero-image-01-dark-462x258.jpg` | Syky/Apple Vision Pro |
| `tools/tmp/unit9/images/unit9_royal_mint_013-462x258__b8cac5ec.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/unit9_royal_mint_013-462x258.png` | Royal Mint: Forever Metal |
| `tools/tmp/unit9/images/vizio-watch-us-ad-jamm-vfx-462x258__e666239f.jpeg` | JPEG | `462 × 258` | (mirror) | `/wp-content/uploads/vizio-watch-us-ad-jamm-vfx-462x258.jpeg` | Vizio Jamm VFX |
| `tools/tmp/unit9/images/stok-cold-brew-the-morning-after-promotion-at-wrexham-462x258__09b9e55f.jpeg` | JPEG | `462 × 258` | (mirror) | `/wp-content/uploads/stok-cold-brew-the-morning-after-promotion-at-wrexham-462x258.jpeg` | Stok cold brew promo |
| `tools/tmp/unit9/images/Screenshot-2024-07-18-at-10.47.02-462x258__e717d462.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/Screenshot-2024-07-18-at-10.47.02-462x258.png` | Fanta Beetlejuice mobile game AR |
| `tools/tmp/unit9/images/Screenshot-2024-08-07-at-15.53.58-462x258__99c58f3b.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/Screenshot-2024-08-07-at-15.53.58-462x258.png` | work tile |
| `tools/tmp/unit9/images/screenshot-2023-11-23-at-10-58-35-462x258__08c82c60.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/screenshot-2023-11-23-at-10-58-35-462x258.png` | work tile |
| `tools/tmp/unit9/images/screen-shot-2024-01-24-at-3-19-20-pm-462x258__2a123132.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/screen-shot-2024-01-24-at-3-19-20-pm-462x258.png` | work tile |
| `tools/tmp/unit9/images/screenshot-2024-02-12-at-10-32-52-462x258__88691291.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/screenshot-2024-02-12-at-10-32-52-462x258.png` | work tile |
| `tools/tmp/unit9/images/screenshot-2024-06-12-at-15-09-56-462x258__2bc4cbdc.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/screenshot-2024-06-12-at-15-09-56-462x258.png` | work tile |
| `tools/tmp/unit9/images/zrzut-ekranu-2024-03-6-o-12-09-38-462x258__614e0911.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/zrzut-ekranu-2024-03-6-o-12-09-38-462x258.png` | work tile |
| `tools/tmp/unit9/images/zrzut-ekranu-2024-04-29-o-13-19-01-462x258__d9fe0e79.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/zrzut-ekranu-2024-04-29-o-13-19-01-462x258.png` | work tile |
| `tools/tmp/unit9/images/zrzut-ekranu-2024-04-29-o-14-02-55-462x258__2e3507b1.png` | PNG | `462 × 258` | (mirror) | `/wp-content/uploads/zrzut-ekranu-2024-04-29-o-14-02-55-462x258.png` | work tile |
| `tools/tmp/unit9/images/9image__9cdda9fe.png` | PNG | (OG image variant) | 18 571 B | `/wp-content/uploads/9image.png` | `/work` OG image |
| `tools/tmp/unit9/images/favicon__6fd182ed.ico` | ICO | 16×16 / 32×32 multires | 12 014 B | `/wp-content/themes/unit9/images/favicon.ico` | Browser favicon |
| `tools/tmp/unit9/images/favicon-96x96__9199dd64.png` | PNG | 96×96 | 9 377 B | `/wp-content/themes/unit9/images/favicon-96x96.png` | Hi-res favicon |
| `tools/tmp/unit9/images/apple-touch-icon__054462b6.png` | PNG | 180×180 | 3 279 B | `/wp-content/themes/unit9/images/apple-touch-icon.png` | iOS home screen |
| `tools/tmp/unit9/images/apple-touch-icon-114x114-precomposed__c332cbde.png` | PNG | 114×114 | 6 431 B | `/wp-content/themes/unit9/images/apple-touch-icon-114x114-precomposed.png` | Legacy iOS |
| `tools/tmp/unit9/images/apple-touch-icon-57x57-precomposed__c5c40d35.png` | PNG | 57×57 | 3 265 B | `/wp-content/themes/unit9/images/apple-touch-icon-57x57-precomposed.png` | Legacy iOS |
| `tools/tmp/unit9/images/apple-touch-icon-72x72-precomposed__2087d614.png` | PNG | 72×72 | 4 347 B | `/wp-content/themes/unit9/images/apple-touch-icon-72x72-precomposed.png` | Legacy iOS |
| `tools/tmp/unit9/images/apple-touch-icon-precomposed__315b24fd.png` | PNG | (legacy) | 3 505 B | `/wp-content/themes/unit9/images/apple-touch-icon-precomposed.png` | Legacy iOS |
| `tools/tmp/unit9/images/360-icon__f1252b13.png` | PNG | (360 video icon) | 2 162 B | `/wp-content/themes/unit9/images/360-icon.png` | CTA hint for VR / 360° projects |
| `tools/tmp/unit9/images/notice-icon__4f41a014.png` | PNG | (notice icon) | (mirror) | `/wp-content/themes/unit9/images/notice-icon.png` | Inline notice icon |
| `tools/tmp/unit9/images/android_market__9e95ff77.png` | PNG | (Android badge) | 577 B | `/wp-content/themes/unit9/images/android_market.png` | Mobile press badge |
| `tools/tmp/unit9/images/ios_app_store__49a69bbf.png` | PNG | (iOS badge) | (mirror) | `/wp-content/themes/unit9/images/ios_app_store.png` | Mobile press badge |

Note that all "work tile" filenames share the literal `-462x258`
suffix because the CMS generates that raster size; the source assets are
larger originals stored elsewhere on the CDN.

### SVGs & icons

- **Inline SVGs in HTML:** 0. The logo on the home title is a PNG
  (`adage_2.png` desktop, `UNIT9-Website-Hero-2023.png` mobile). The
  footer logo (`unit9_logo.svg`) is loaded via `<img>` from
  `tools/tmp/unit9/svgs/unit9_logo__93eef13b.svg`.
- **Standalone SVG files in dump:** 7 in
  `tools/tmp/unit9/svgs/`:
  - `sprite__2951922b.svg` (44 233 B) — single-source sprite containing
    every UNIT9 logotype (`icon-u9-films`, `…-digital`, `…-games`,
    `…-vr`, `…-technology`, `…-presents`), the social glyphs
    (`icon-facebook`, `…-twitter`, `…-gplus`, `…-instagram`,
    `…-linkedin`, `…-youtube`), plus UI icons (`icon-close`,
    `icon-share`, `icon-share-remove`, `icon-drag-drop`,
    `icon-filter-drop`, `icon-filter-drop-big`, `icon-read-more`).
    ViewBox `370 58 1920 1080`. Single fill `#FFFFFF`.
  - `unit9_logo__93eef13b.svg` (3 631 B) — footer logo, monochrome.
  - `unit9-technology-big__099128be.svg` (6 650 B) — "Technology"
    logotype, large version.
  - `unit9-technology-black__aebeded9.svg` (6 099 B) — "Technology"
    logotype, black variant for light backgrounds.
  - `google-plus__21147a7d.svg` (1 350 B) — standalone G+ glyph.
  - `google-plus-black__db4a748f.svg` (1 350 B) — black variant.
  - `linkedin-black__8d786466.svg` (1 208 B) — LinkedIn glyph, black.
- **Icon system:** custom sprite (no third-party icon library).
  Each icon is a CSS class `.icon-NAME` that pulls from
  `../images/sprite.svg` via `background: url(...)` and a unique
  `background-position`. Active/hover state swaps to `is-active`,
  `is-black`, or `is-gray` variants with different positions.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/unit9/media/` (empty in dump; video referenced inline) | — | No video file copied to the dump — the hero video is a remote source on Cloudfront |
| (referenced inline) `https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/V6_UNIT9-HOMEPAGE-REEL-2.mp4` | MP4 H.264 | Home reel — muted, looping, autoplay, `width: 1600px; height: 900px; margin-left: -80px` (centered) |
| (referenced inline) `https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/V6_-UNIT9-HOME-REEL.webm` | WebM VP9 | Same reel as WebM source for browsers that prefer it |

There is no audio file in the dump.

### Other assets

- `tools/tmp/unit9/other/` is empty (a placeholder directory).
- `tools/tmp/unit9/models/` is empty (no 3D assets, as noted above).
- `tools/tmp/unit9/fonts/` is empty in the root dump; the `playwright/
  fonts/` mirror holds the two `.woff2` Google Fonts subsets that the
  site fetched (Oswald latin + PT Serif italic mirror).
- The `/wp-content/themes/unit9/images/manifest.json` referenced from
  `<link rel="manifest">` is a PWA manifest; not present in the dump.

---

## Motion & Interaction

### Principles

- **One signature easing**, applied almost everywhere:
  `cubic-bezier(0.165, 0.84, 0.44, 1)`. Micro interactions (`0.3s`),
  small UI changes (`0.4s`), drawer/page shifts (`0.6s`). Page shifts
  pair with `visibility 0s linear .4s` so focusable elements only
  receive focus after the slide-in is mostly done.
- **Linear easings** are reserved for opacity fades (loader,
  follow icons, social icons): `transition: opacity .3s linear`.
- **Spatial language:** "translate3d" only — never `top`/`left`.
  Hardware-accelerated transforms only, with `-webkit-`, `-moz-`,
  `-o-`, `-ms-` prefixes consistently applied.
- **Loading choreography:** home title fades in first, then the title
  fades back out, then each tile label fades in with a 200ms stagger.

### Specific behaviors

- **Link hover:** color shift to `#FFFFFF` over `0.3s` (or `border-
  color` shift to `#797979` for `.work-heading-active a`). No
  underline.
- **Button press:** no explicit `:active` rule in the bundle;
  `.cookie-consent-button:active { opacity: .5 }` is the only
  pressed state observed.
- **Section reveal on scroll:** the work index relies on Isotope's
  layout pass on image load plus GSAP parallax
  (`Site.Scrolling.callbacks.hero`) that translates the hero image
  by up to 2× the scroll fraction and fades a `.hero-options-notice`
  out at 3× the fraction. No IntersectionObserver-driven reveals.
- **Home reel tile hover:** scale `1.1, 1.1` over `0.6s` on
  `.home-logo:hover`.
- **Drawer close:** the `.menu-closer` overlay is a single `<div>`
  sized `100% × 100%` positioned at `left: 240px`. Clicking anywhere
  outside the drawer hits it.
- **Newsletter popup:** appears immediately on load (the legacy
  cookie-wrapper-popup jQuery is commented out in the rendered DOM,
  replaced by the modern GA consent banner). The newsletter popup is
  rendered but its `display: none` is set in CSS until JS toggles it.
- **Filter dropdown:** GSAP-driven. Closing collapses
  `.filter-tab` height to `0` over `.4s`; opening animates height
  from `0` to the inner `ul.outerHeight()` over `.8s`, and the page
  `.work-heading` grows in lockstep to keep the masonry anchored.

### Reduced motion

- `@media (prefers-reduced-motion: reduce)` is **not** declared in any
  CSS file in the dump. Motion is **not** suppressed for users who
  request reduced motion. Users relying on that preference will get
  the full animation set including the drawer slide, the loader
  spinner, the home title fade-in/out, and the GSAP scroll parallax.
- Focus indicators on links/buttons: only the browser default outline
  is relied upon (no explicit `:focus-visible` rules).

---

## Content & Voice

- **Tone:** Confident, understated, work-led. The home page contains
  no headline copy — the reel and the centered logo do all the
  talking. Body copy on the work index and footer is short and
  factual. The newsletter popup is the only piece that uses any
  inflection ("Want to see more fun stuff?").
- **Sentence length:** short. Newsletter body is a single 22-word
  paragraph. About-page labels are noun phrases only.
- **Capitalization:** Sentence case in headings, with `text-transform:
  uppercase` applied via CSS to category labels
  (`.home-logo-icon`, `.hero-content-cta`, `.footer-newsletter-submit`,
  `.work-heading-content h2`, `.work-heading-active`, `.follow li`).
  No title case.
- **Punctuation:** Oxford comma not observed (no lists longer than two
  in copy); em-dash style not used.
- **CTA vocabulary:** "Sign up" (newsletter), "Accept All / Accept
  Selection / Reject All" (cookie banner). The hero CTA is the
  button-style `.hero-content-cta` containing "Read more" / project
  titles. There is **no** purchase funnel — the site drives portfolio
  browsing, not transactions.
- **Tagline:** none in the rendered HTML. The site relies on its
  meta description "UNIT9 is a production studio. We focus on VR,
  Digital, Gaming, Innovation and Film projects. We have offices in
  London, NY, LA, Berlin and Florence." and the section labels
  (Films / Digital / Games / VR/AR / Experiential / Real Time VFX /
  Presents) for positioning.

---

## Information Architecture

Top-level routes observed in `tools/tmp/unit9/playwright/homepage.html`
and `tools/tmp/unit9/html/work__0ae779a5`:

- `/` — homepage (full-bleed reel + 6 category tiles + centered logo)
- `/films` — Films category index, hero reel + masonry
- `/digital` — Digital category index
- `/games` — Games category index
- `/vr` — VR/AR category index
- `/experiential` — Experiential category index
- `/real-time-vfx` — Real Time VFX category index
- `/presents` — "UNIT9 Presents" — original IP / series
- `/work` — full work index (masonry, filterable by director, unit,
  type; `data-filter='{"director":…,"division":…,"kind":…}'` JSON
  payload embedded in the page)
- `/work/all` — all work, no featured filter
- `/directors` — director roster page
- `/reels` — showreel compilation page
- `/attractions` — themed-attraction / installation page
- `/about` — about + awards page
- `/jobs` — careers
- `/contact` — contact form
- `/cookie-policy` — cookie policy document
- `/wp-content/uploads/Privacyandcookiespolicy-Unit9.pdf` — privacy
  policy PDF download
- `/wp-content/uploads/Websitetermsofuse-Unit9.pdf` — terms of use PDF
- `/wp-content/uploads/Anti-Slavery-and-Human-Trafficking-statement-V1.pdf` —
  modern-slavery statement PDF
- `/wp-content/themes/unit9/mailchimp/` — newsletter form endpoint

Social / external:

- Facebook `https://www.facebook.com/unit9.production`
- Twitter `https://twitter.com/UNIT9`
- Instagram `http://instagram.com/unit9ltd`
- LinkedIn `https://www.linkedin.com/company/unit9`
- YouTube `https://www.youtube.com/user/unit9`

---

## Accessibility

- **Color contrast (observed):**
  - White `#FFFFFF` on `#000000`: 21:1 — pass AAA for body, large,
    UI components.
  - White `#FFFFFF` on `#1A1A1A`: 19.4:1 — pass AAA.
  - `#797979` (text-muted) on `#1A1A1A`: 4.86:1 — passes AA for
    normal text.
  - `#5D5D5D` (text-secondary) on `#000000`: 4.10:1 — passes AA for
    large text only; borderline for body.
  - `#110000` on `#F8F9FA` (cookie success button): ~19:1 — passes
    AAA.
  - `#797979` on `#202020` (filter bar): 4.0:1 — borderline.
- **Focus indicators:** the bundle relies on browser-default outlines;
  no `outline:` overrides were observed. Focus is therefore visible
  but inconsistent across browsers.
- **Keyboard:** every interactive element (the hamburger trigger, the
  drawer links, the filter tabs, the work tiles, the cookie buttons,
  the social icons) is a real `<a>` or `<button>` and is reachable in
  DOM order. There is no explicit `tabindex` usage and no skip-link
  to main content (the `<main id="content">` exists but no
  corresponding skip-nav anchor is rendered). On the home page the
  drawer slides over the content, which can hide it from focus order
  only because of the `visibility: hidden` → `visible` toggle; once
  open, every drawer item receives focus normally.
- **Screen reader landmarks:** `<header class="header">`, `<nav
  class="header-nav">`, `<main id="content" role="main">`, `<footer
  class="footer">` are all present and labelled. The drawer exposes
  its full menu (`.menu-division` + secondary items) as a single
  `<ul id="menu">`. The newsletter popup is a `<div>` without an
  explicit `role="dialog"`, `aria-modal`, or `aria-labelledby` —
  modest a11y gap.
- **Motion:** no `@media (prefers-reduced-motion)` handling — see the
  Motion & Interaction section. The autoplay hero `<video>` is
  `muted="true"`, which avoids one common a11y issue, but the lack
  of a pause control is a meaningful one.
- **Alt text:** work-tile thumbnails use the project title as `alt`
  (e.g. `alt="lego x pharrell williams pinball experience"`); some
  earlier tiles use empty `alt=""` (decorative). The home title `<img
  alt="UNIT9">` is correctly labelled. Social icons are hidden from
  assistive tech via `text-indent: 200%; overflow: hidden;` and a
  visible text label inside the `<i>` (`.icon-facebook` →
  `Facebook`).
- **Forms:** the newsletter input has `<input type="text"
  placeholder="E-mail" name="email">` — no `<label>` is associated,
  so the field name is announced by SR only because of the
  `placeholder` (which is not a label substitute). The cookie
  checkbox labels do wrap their `<input>` properly.

---

## Sources

Every URL observed or referenced in the dump:

- Homepage — https://unit9.com/
- Work index — https://unit9.com/work
- Films category — https://unit9.com/films
- Digital category — https://unit9.com/digital
- Games category — https://unit9.com/games
- VR/AR category — https://unit9.com/vr
- Experiential category — https://unit9.com/experiential
- Real Time VFX category — https://unit9.com/real-time-vfx
- Presents category — https://unit9.com/presents
- Directors — https://unit9.com/directors
- Reels — https://unit9.com/reels
- Attractions — https://unit9.com/attractions
- About — https://unit9.com/about
- Jobs — https://unit9.com/jobs
- Contact — https://unit9.com/contact
- Cookie policy — https://unit9.com/cookie-policy
- Privacy policy PDF — https://unit9.com/wp-content/uploads/Privacyandcookiespolicy-Unit9.pdf
- Terms of use PDF — https://unit9.com/wp-content/uploads/Websitetermsofuse-Unit9.pdf
- Modern Slavery Statement PDF — https://unit9.com/wp-content/uploads/Anti-Slavery-and-Human-Trafficking-statement-V1.pdf
- WP API root — https://unit9.com/wp-json/
- Google Fonts CSS — https://fonts.googleapis.com/css?family=PT+Serif:400,700,400italic,700italic|Oswald
- Poppins import — https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap
- Adobe Typekit kit — https://use.typekit.net/rgb0ivf.css
- Google Tag Manager — https://www.googletagmanager.com/gtm.js?id=GTM-TR27LTRH
- Google Analytics 4 — https://www.googletagmanager.com/gtag/js?id=G-8KPP05ZWF6
- jQuery CDN (legacy load) — https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
- Hero video MP4 — https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/V6_UNIT9-HOMEPAGE-REEL-2.mp4
- Hero video WebM — https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/V6_-UNIT9-HOME-REEL.webm
- Mobile home logo — https://d2z8nyy70yf33i.cloudfront.net/wp-content/uploads/UNIT9-Website-Hero-2023.png
- OG image — https://www.unit9.com/wp-content/themes/unit9/images/ogimage.png
- WordPress core emoji — https://s.w.org/images/core/emoji/2.3/72x72/ + .svg
- Facebook — https://www.facebook.com/unit9.production
- Twitter — https://twitter.com/UNIT9
- Instagram — http://instagram.com/unit9ltd
- LinkedIn — https://www.linkedin.com/company/unit9
- YouTube — https://www.youtube.com/user/unit9

---

## Changelog

- 2026-06-20 — Initial draft by opencode. Source:
  `tools/tmp/unit9/` (Playwright-rendered DOM at
  `tools/tmp/unit9/playwright/homepage.html`, 467 lines; static CSS at
  `tools/tmp/unit9/css/style__e7d8afbe.css` 119 177 B; 49 image files;
  7 SVG files; 5 JS files; 1 dynamic computed-styles JSON with 43
  element entries).
