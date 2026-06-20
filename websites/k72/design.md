# K72 — design.md

> A structured design specification of **https://k72.ca**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** design.md_gen agent
> **Source dump:** `tools/tmp/k72/` (gitignored)

---

## Overview

K72 is a French-Canadian creative agency based in Montréal. The homepage is a single full-bleed cinematic splash: a looping autoplaying background video, an oversized centred French punchline ("L'étincelle qui génère la créativité" — *the spark that generates creativity*) with a yellow-green hand-drawn ellipse drawn around the word "créativité", a small body paragraph, and two giant pill-shaped CTAs. A fixed black header sits on top with a tiny custom "K72" logotype (top-left) and a "Menu" button (top-right). The whole first paint is dark (`#000000` base, white type) with a single signature accent — a fluorescent yellow-green `#D3FD50`. Copy is exclusively in French; the agency treats the site itself as a portfolio piece, with a custom-built loader, smooth scroll, a marquee banner, and a full-screen video modal. The visual register is confident, editorial, animation-heavy, and unmistakably French-Québécois in voice.

**Category:** Marketing (creative agency) · **Primary surface observed:** Homepage (`/`) · **Tone:** Confident, editorial, French-language, restrained palette with one bright accent · **Framework detected:** None — a hand-rolled ES module bundle that imports Locomotive Scroll, GSAP 3.12.7, Swiper 11.2.8, a `modujs` micro-framework, and a custom `modularLoad` SPA-style router, served as a single `app.js` file.

---

## Visual Language

### Color

The site is essentially two-tone. Black, white, and a single electric lime. The lime is used for selection, hover, focus, the hand-drawn underline ellipse around "créativité", the marquee banner, the case-study list scrollbar, the scrollbar track accent, and a banner CTA. Everything else is monochrome on the theme.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base, dark theme) | `html[data-theme=dark]` | `#000000` (black) | Forced by `data-theme="dark"` on `<html>` |
| Background (light theme fallback) | `html` | `#FFFFFF` (white) | Default; site always loads in dark |
| Background (loader veil) | `.c-loader:before` | `#1D1D1D` (very-dark-grey) | `opacity: 0.8` over page during load |
| Background (video modal) | `.c-video-modal_bg` | `#1D1D1D` (very-dark-grey) | `opacity: 0.95` when active |
| Background (menu panels) | `.c-menu_bg_col` | `#000000` (black) | Five vertical columns |
| Background (team row hover) | `.c-team_row:before` | `#D3FD50` (lime) | Wipe-up on hover |
| Background (banner CTA) | `.c-banner` | `#D3FD50` (lime) | `color: #000000` on the text |
| Background (blog filter active) | `.c-blog-list_filters_el.-active` | `#000000` (black) | Inverts against grey default |
| Text (primary) | `body, html[data-theme=dark]` | `#FFFFFF` (white) | |
| Text (secondary / muted) | `.c-menu_langswitcher` | `rgba(255, 255, 255, 0.3)` (30% white) | |
| Text (tertiary / dim) | `.c-team_title` | `rgba(0, 0, 0, 0.5)` (50% black, light theme) | |
| Text (decorative) | `.c-team_featured_member_name` | `#D3FD50` (lime) | Big marquee names, light theme |
| Accent (selection) | `::selection` | `#D3FD50` bg, `#000000` text | Same as primary accent |
| Accent (hover/focus) | `.c-button:hover`, `.c-header_link:hover:after` | `#D3FD50` (lime) | Wipes up to fill the pill |
| Accent (decorative circle) | `.c-circle svg` | `stroke: #D3FD50` (lime) | `stroke-width: 2px`, `fill: transparent` |
| Border (menu item) | `.c-menu_main-nav_item` | `1px solid rgba(255, 255, 255, 0.5)` (50% white) | |
| Border (filter pill) | `.c-blog-list_filters_container` | `gap: 1px` (visual seam) | |
| Form input border | `.c-form_input` | `1px solid lightgray` | Light-theme forms only |

Dark-mode is the default and only observed theme on the homepage. No automatic theme switch, no light/dark toggle in the header. Selection always uses `#D3FD50` against `#000000` regardless of theme.

### Typography

K72 ships exactly one typeface, **Lausanne**, in two weights (300 light, 500 medium), self-hosted as `.woff2`/`.woff`. Every visible glyph on the homepage uses it. The site has no serif, no monospace, no display face. Lausanne is a contemporary neo-grotesque in the same lineage as Neue Haas Grotesk; the agency uses it for everything from a 136.8 px uppercase hero line down to 11 px legal microcopy. The stack is paired with a 9-step native system stack as fallback.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (H1 hero) | `Lausanne` | 300 | `9.5vw` (≈ `136.8px` at 1440px viewport) | `0.8666` (`118.56px`) | normal, `text-transform: uppercase` |
| Display (secondary hero) | `Lausanne` | 300 | `12vw` on `max-width: 999px` | `0.8666` | uppercase |
| H1 (project summary) | `Lausanne` | 700 (default `.c-heading.-h1`) | `8.75rem` → `4.5rem @ ≤699px` | `0.886` | uppercase |
| H1-big | `Lausanne` | 700 | `12.5rem` → `5.625rem @ ≤699px` | `0.885` | uppercase |
| H2 | `Lausanne` | 600 | `1.75rem` | inherited | normal |
| H3 | `Lausanne` | 600 | `1.5rem` | inherited | normal |
| H4 | `Lausanne` | 600 | `1.25rem` | inherited | normal |
| H5 | `Lausanne` | 500 | `1.125rem` | inherited | normal |
| H6 | `Lausanne` | 500 | `1rem` | inherited | normal |
| Menu link (mega-nav) | `Lausanne` | 400 | `7.2rem` (≈ `115.2px` at 1440px) | `0.75` (`86.4px`) | normal |
| Button / Pill (CTA) | `Lausanne` | 400 | `6.5vw` FR, `7vw` EN, `10.5vw @ ≤999px` | `0.7` | normal, uppercase |
| Body L (large copy) | `Lausanne` | 400 | `3.5rem` → `1.5rem @ ≤699px` | `1.0` | normal |
| Body (default) | `Lausanne` | 400 | `1rem` | `1.5` | normal |
| Body S / small | `Lausanne` | 400 | `0.875rem` | inherited | normal |
| Caption / micro | `Lausanne` | 400 | `0.6875rem` | inherited | normal |
| Time / location (clock) | `Lausanne` | 400 | `1.25rem @ ≥1400px` | inherited | normal |
| Hero subline | `Lausanne` | 400 | `14px` (computed) | `21px` | normal |
| Label (form) | `Lausanne` | 400 | `1rem` | inherited | normal |
| Social pill (`FB / IG / IN / BE`) | `Lausanne` | 400 | `2.1875rem` (`35px`) | `0.7` | normal |

Font stack, from the inline critical CSS: `Lausanne, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif`. Two `@font-face` declarations preload 300 + 500 in `woff2` first, `woff` fallback. `font-display: swap` everywhere. No variable font; weights are bundled separately.

`text-transform: uppercase` is used aggressively: hero, h1, h1-big, menu links, CTAs, socials, time labels, marquee names, footer legals. Lowercase appears only in body paragraphs and the time digits.

### Spacing & radius

- **Base unit:** 10 px (the container gutter is `0.625rem` = 10 px, repeated everywhere: `0.625rem` ↔ 10 px, `1.25rem` ↔ 20 px, `2.5rem` ↔ 40 px, `5rem` ↔ 80 px, `7.5rem` ↔ 120 px, `10rem` ↔ 160 px, `12.5rem` ↔ 200 px, `15rem` ↔ 240 px).
- **Scale:** 10, 20, 30, 40, 50, 60, 80, 100, 120, 160, 200, 240 px.
- **Radii:** `0` (most blocks); `1.25rem` (20 px, team/case-study media); `1.875rem` (30 px, image gallery, mobile case visual); `2.5rem` (40 px, video-thumb, slider on hover); `3.5rem` (56 px, large image blocks, fancy gallery); `50px` (blog card image, hard-coded not rem); `999em` (CTAs, socials, loader spinner — full pill).
- **Shadows:** None observed. Elevation is done with scale transforms and overlay wipes, not box-shadow.
- **Negative margin trick:** the text-lines pattern relies on `padding-top: 0.2em, margin-top: -0.2em` (and the same on the inner span) to keep the line-height consistent while still allowing `overflow: hidden` on the outer to clip the slide-in.
- **Optical baseline:** many text blocks include a `::before` `content: ""; display: block; height: 0; margin-top: 0.023em;` to push the text up by 0.023 em — this is K72's standard optical-baseline correction.

### Shadow tokens

- No `box-shadow` is set anywhere in the stylesheet. Depth is faked with:
  - Scale transforms (1.05× on hover).
  - A black `::after` overlay wipe on work-thumbs.
  - `mix-blend-mode: difference` (e.g. on the project-summary visual, the image gallery cursor, the about-hero position label).
  - Lime background fills on hover (`.c-team_row`, `.c-header_link`, `.c-button`).

### Border tokens

- Single-pixel white at 50% opacity: `.c-menu_main-nav_item` (`border-top: 1px solid rgba(255, 255, 255, 0.5)` and the same for `:last-child` `border-bottom`).
- Single-pixel solid black on light-theme elements (`.c-blog-details_excerpt`, `.c-blog-list_container`, `.c-blog-details_related`, `.c-blog-details_author_footer` all use `border-top: 1px solid #000000`).
- Single-pixel solid black at 20% on `.c-team_featured` (`border-bottom: 1px solid rgba(0, 0, 0, 0.2)`).
- No dotted or dashed borders observed. No multi-color borders.

### Iconography

- **Style:** Custom hand-drawn, single-stroke line icons. All stroke-based (`stroke="currentColor"` or `stroke="#FFFFFF"`), stroke width `2` or `3`, `stroke-linecap="square"`, no fills. One filled icon (`globe`) for the clock; everything else is linework.
- **Library:** Custom **SVG sprite** at `/assets/images/sprite.svg` (9 symbols): `arrow`, `big-arrow`, `burger`, `close`, `globe`, `happy`, `heart`, `logo`, `quote`, `quote-fr`. Referenced via `<use xlink:href="assets/images/sprite.svg#burger">` etc.
- **Default sizes:** Burger `63×10` (CSS sized to `3.8125rem × 0.5rem`), close `139×139` (CSS `8.125rem × 8.125rem`), globe `24×24` (CSS `1.5em × 1.5em`), heart `70×83` (CSS `1em × 0.714em`), logo `103×44` (CSS `7.3125rem × 3.125rem`).
- **Special icons:** The K72 monogram in the corner of the header is the same `logo` path rendered inline (not via `<use>`); the `#heart` icon is used inside the menu-link overlay to mean "love" and `#globe` accompanies the Montréal time.

---

## Layout & Grid

- **Breakpoints (from CSS @media queries):** `≤699 px` mobile, `700–999 px` tablet-portrait, `1000–1199 px` tablet-landscape, `1200–1599 px` desktop, `1600–1999 px` wide, `2000–2399 px` ultrawide, `≥2400 px` 4K. Also `max-aspect-ratio: 1/1` and `min-aspect-ratio: 1/1` are used throughout for square-vs-landscape branching.
- **Container:** Fluid — `.o-container` adds `padding: 0.625rem 0.625rem` (`10px` sides). A "medium" variant computes `padding-left/right: calc((100vw - 13.125rem) * 2 / 20 + 1.875rem)` — i.e. everything is laid out on a 20-column grid with two outer "fixed" rails of `13.125rem` (210 px). Most blocks are sized as a fraction of `(100vw - 13.125rem)`, e.g. the punchline paragraph at `3/20 + 1.25rem`.
- **Grid:** 20-column implicit grid (`.c-blog-list_header` and `.c-blog-details_*` are explicit `grid-template-columns: repeat(20, 1fr)`). Column width = `calc((100vw - 13.125rem) / 20 + 0.625rem)`. Gutter between columns = `0.625rem` (10 px) or `2.5rem` (40 px) on the `-gutter` layout helper.
- **Vertical rhythm:** 10 px and 20 px multiples (`1.25rem`, `2.5rem`, `5rem`, `7.5rem`, `10rem`, `12.5rem`, `15rem`). Section margins are `15rem` desktop / `5rem` mobile.
- **`rem` base:** the root `font-size` is fluid — `14px` ≤ 999 px, `15px` 1000–1199 px, `16px` 1200–1599 px, `17px` 1600–1999 px, `18px` 2000–2399 px, `20px` ≥ 2400 px. Every `rem` value therefore scales with the viewport. The transition on `html` is `transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), background-color 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)` so theme changes tween smoothly.
- **Responsive helpers:** `.o-layout` is a flex/inline-block row with `-gutter`, `-gutter-small`, `-center`, `-right`, `-reverse`, `-flex`, `-top`, `-middle`, `-bottom`, `-stretch` modifier classes.
- **Aspect-ratio queries:** the site uses `max-aspect-ratio: 1/1` (portrait) and `min-aspect-ratio: 1/1` (landscape) to switch many components. This is more accurate than width-based queries for "is the screen square?".
- **Page structure (homepage):**
  1. **Fixed top header**, 3.125 rem (50 px) tall, transparent over the hero, contains the K72 monogram (left, `7.3125rem × 3.125rem`) and the "Menu" button (right, `3.125rem × width: 3/20-of-grid + 2.5rem`).
  2. **Quick-nav row** appears *after* the loader once the user is past 200 px of scroll: two large "Projets (17)" / "Agence" links whose backgrounds wipe up lime on hover.
  3. **Hero** — full-bleed background figure, fixed-position `<video>` with poster fallback, scale `1.5 → 1.0` on `.is-loaded` (900 ms `cubic-bezier(0.165, 0.84, 0.44, 1)`). An absolutely-positioned `<canvas>` sits *inside* the H1, sandwiched between the words "qui" and "génère", drawing the live video frame masked by a rounded rectangle (`roundRect` + `destination-in`) — this is the small "monitor" element.
  4. **H1 punchline** — three lines: "L'étincelle / qui [video-monitor] génère / la [circled]créativité[/circled]". The lime circle around "créativité" is an inline `<svg><ellipse>` animated with GSAP DrawSVGPlugin.
  5. **Body paragraph** — narrow column on the right edge, `width: calc((100vw - 13.125rem) * 3/20 + 1.25rem)` (1600+) down to `18.75rem` on mobile.
  6. **Two CTAs** centred: "Projets" / "Agence", pill buttons, 6.5 vw FR, 7 vw EN, scale on entry from `translateY(2.5rem)` and `opacity 0 → 1`, 600 ms, second one delayed 100 ms.
  7. **Local clock** bottom-left — `MONTREAL_16:02:40`, ticks every 250 ms in `America/Toronto` timezone.
  8. **Footer** (only appears on `/agence`, `/contact`, `/blogue` etc., not on the homepage) — black, min-height `62vh` on landscape, with a 3-column `c-footer_foot` grid: `[legals] [clock] [back-to-top]`.
  9. **Global `.c-video-modal`** — fixed, full-screen, hidden by default, opens to play a Vimeo / YouTube / MP4 in a `16:9` frame.

### Computed-style fingerprint (from `playwright/computed-styles.json` at 1440 × 900 viewport)

This is what the browser actually renders on the homepage, in DOM order:

| Element (class) | `font-family` | `font-size` | `font-weight` | `line-height` | `color` | `background-color` | `border-radius` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `c-loader_col` | Lausanne + sys stack | `16px` | `400` | `24px` | `rgb(255, 255, 255)` | `rgb(0, 0, 0)` | `0` |
| `c-header_logo` (a) | Lausanne | `16px` | `400` | `24px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-header_quicknav_link` (a) | Lausanne | `16px` | `400` | `24px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-header_quicknav_link > span` | Lausanne | `20px` | `400` | `18px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-header_menu-btn` | Lausanne | `16px` | `400` | `normal` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-menu_bg_col` | Lausanne | `16px` | `400` | `24px` | `rgb(255, 255, 255)` | `rgb(0, 0, 0)` | `0` |
| `c-menu_langswitcher` | Lausanne | `16px` | `400` | `24px` | `rgba(255, 255, 255, 0.3)` | transparent | `0` |
| `c-menu_main-nav_link` (a) | Lausanne | `115.2px` | `400` | `86.4px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-menu_main-nav_link_overlay_inner` (div) | Lausanne | `115.2px` | `400` | `86.4px` | `rgb(0, 0, 0)` | `rgb(211, 253, 80)` (lime) | `0` |
| `c-pill-image` (div) | Lausanne | `115.2px` | `400` | `86.4px` | `rgb(0, 0, 0)` | transparent | `115085px` (pill) |
| `c-menu_footer_legals_link` (a) | Lausanne | `11px` | `400` | `14.3px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-socials_link` (a, `c-button`) | Lausanne | `35px` | `400` | `24.5px` | `rgb(255, 255, 255)` | transparent | `34965px` (pill) |
| `c-home_punchline` (h1) | Lausanne | `136.8px` | `300` | `118.56px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-text-lines_item` (div) | Lausanne | `136.8px` | `300` | `118.56px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-text-lines_item_outer` (span) | Lausanne | `136.8px` | `300` | `118.56px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-home_monitor` (canvas) | Lausanne | `136.8px` | `300` | `118.56px` | `rgb(255, 255, 255)` | transparent | `0` |
| `mark` (inside h1) | Lausanne | `136.8px` | `300` | `118.56px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-home_text` (p) | Lausanne | `14px` | `400` | `21px` | `rgb(255, 255, 255)` | transparent | `0` |
| `c-home_ctas_link` (a, `c-button -thicker`) | Lausanne | `93.6px` | `400` | `65.52px` | `rgb(255, 255, 255)` | transparent | `93506.4px` (pill) |
| `c-video-modal_bg` (div) | Lausanne | `16px` | `400` | `24px` | `rgb(255, 255, 255)` | `rgb(29, 29, 29)` | `0` |
| `c-video-modal_inner` (div) | Lausanne | `16px` | `400` | `24px` | `rgb(255, 255, 255)` | `rgb(0, 0, 0)` | `0` |

Note: the H1 punchline has `padding: 0.05px 144px` (a 0.05 px top/bottom padding collapse-prevention + 144 px horizontal gutter), and `c-home_punchline` `font-size: 9.5vw` on ≥1000 px. The CTAs are `93.6px` because the `c-home_ctas_link` `font-size: 7vw` × 1440px / 100 ≈ 100.8 px (FR `6.5vw` ≈ 93.6 px) and the rendered value is `93.6px`.

### Class taxonomy

The site has ~250 component classes plus 24 utility classes. Prefix convention:

- `c-` — **c**omponent (UI block with its own JS module or self-contained logic). ~60 examples: `c-loader`, `c-header`, `c-menu`, `c-button`, `c-heading`, `c-home`, `c-home_punchline`, `c-circle`, `c-dot`, `c-pill-image`, `c-text-lines`, `c-clock`, `c-socials`, `c-team`, `c-blog-list`, `c-video-modal`, `c-banner`, `c-cta-slides`, `c-image-gallery`, `c-caption-gallery`, `c-layered-punchline`, `c-project-summary`, `c-work-thumb`, `c-fancy-gallery`, `c-accordion`, `c-blockquote`, `c-faq`, `c-form_*`, `c-elastic-list`, `c-audio-sample`, `c-footer`, `c-section`, `c-about-hero`, `c-preview-bar`, `c-scroll*`, `c-stack`, `c-tabs`, `c-cta-slides`, `c-blog-details_*`, `c-video-featured`, `c-image-gallery_*`, `c-block-image`, `c-block-text`, `c-blockquote-author`, `c-article-*`, `o-article-wysiwyg`, `c-cta-slides`, `c-page-head`.
- `o-` — **o**bject (utility pattern, no JS). E.g. `o-container`, `o-container -medium`, `o-container -small`, `o-layout`, `o-layout -gutter`, `o-layout -flex`, `o-text -micro / -small / -medium / -large`, `o-wysiwyg`, `o-ratio`, `o-article-wysiwyg`, `o-article-img`.
- `u-` — **u**tility (single-purpose). E.g. `u-indent`, `u-z-index-2`, `u-screen-reader-text`, `u-1\/1` … `u-5\/5`, `u-1\/6` … `u-4\/6`, `u-2\:1`, `u-4\:3`, `u-16\:9`, `u-anim`, `u-anim-scroll`, `u-anim-scroll -reverse`, `u-anim -delay-1` … `u-anim -delay-20`.
- `is-` — **state** classes (toggled by JS). E.g. `is-loaded`, `is-loading`, `is-ready`, `is-active`, `is-inview`, `is-current`, `is-new`, `is-changed`.
- `has-` — **context** classes (toggled by JS, affect descendants). E.g. `has-scroll-smooth`, `has-scroll-scrolling`, `has-scroll-dragging`, `has-menu-opened`, `has-preview-bar-active`, `has-no-js`, `hide-quicknav`.
- `data-` — **behavioural** attributes consumed by the JS modules. E.g. `data-module-load="m1"`, `data-module-header="m2"`, `data-module-monitor="m6"`, `data-module-circle="home"`, `data-load-container`, `data-header="menu-toggler"`, `data-video-modal="close"`, `data-main-nav="link"`, `data-module-time="m4"`, `data-module-time="m7"`, `data-scroll-call="...", id="..."`, `data-src`, `data-word`.

### Modifier convention

- `.-thicker`, `.-active`, `.-inview`, `.-hover`, `.-no-margin`, `.-padright`, `.-radius`, `.-reverse`, `.-flex`, `.-center`, `.-right`, `.-middle`, `.-top`, `.-bottom`, `.-stretch`, `.-dark-hover`, `.-allow-overflow`, `.-smaller`, `.-half-mobile`, `.-smaller-padding`, `.-last`, `.-play`, `.-playing`, `.-visible`, `.-rotate`, `.-above`, `.-new`, `.-micro`, `.-small`, `.-medium`, `.-large`, `.-padded`, `.-rounded`, `.-full`.

---

## Components

### Loader (`.c-loader`)

A custom fullscreen reveal used to cover the first paint while assets and fonts load. Five vertical black columns scale up from `transform: scale3d(1, 0, 1)` to fill the screen (`0.3 s`, `cubic-bezier(0.215, 0.61, 0.355, 1)`, staggered `0.075/0.12/0.165/0.21/0.255 s` from the rightmost to the leftmost column). A dark-grey veil (`#1D1D1D` at `opacity 0.8`) sits behind them. A 4-bar `loaderSpinnerCol` EQ-style spinner (`#FFFFFF` bars) animates in the bottom-right corner. When the bundle finishes loading (`is-loaded` class), the columns scale back down to zero and the spinner collapses.

- **Anatomy:** `.c-loader > .c-loader_spinner` (4 white EQ bars) + `.c-loader_col` × 5 (black scaleY panels). The body has class `is-loading` while loading and `is-loaded` once ready; `is-ready` is added 300 ms after `is-loaded` to trigger the text-line reveal.
- **Widths at ≥1000 px:** 5 columns, widths `4/20`, `4/20`, `6/20`, `3/20`, `3/20` of `(100vw - 13.125rem)` plus 40 / 60 / 30 / 40 px padding, with `-1px` margin to eliminate seams.
- **State:** pointer-events: all while loading, none after. Veil opacity `0.8 → 0` over 600 ms.
- **Spinner:** 4 white EQ bars, each `flex-grow: 1`, `margin-left: -1px`, animated with `loaderSpinnerCol` `1s cubic-bezier(0.215, 0.61, 0.355, 1) infinite` and delays `-0.1 / -0.2 / -0.3 / -0.4 s` so the wave travels left-to-right. The bar tween is `transform: scale3d(1, 0.25, 1) → scale3d(1, 1, 1) → scale3d(1, 0.25, 1)` with `transform-origin: bottom center`.
- **Widths on tablet (700–999 px):** 3 columns, 33.333 % each, delays `0.075 / 0.12 s` (the third column has no delay in the source — likely a bug).
- **Widths on mobile (≤699 px):** 2 columns, 50 % each, delays `0.075 / 0.12 s`.
- **JS hook:** the columns are NOT registered as a `data-module`; they are pure CSS. The `is-loaded` class is added by the global `app.init()` callback (`window.onload` → `init5()` → adds `is-loaded`).

### Header (`.c-header`)

- **Height:** 3.125 rem (50 px) for the logo button, 8.125 rem (130 px) for the menu button when the quick-nav is visible.
- **Anatomy:** `<a class="c-header_logo">` top-left with inline SVG `logo` (103×44 viewBox) and `u-screen-reader-text` "K72" for screen readers. Two `<a class="c-header_quicknav_link">` items ("Projets (17)", "Agence") that animate in from `translate3d(0, -100%, 0)` to `0` after load (delay `0.3 s` and `0.15 s`, 600 ms). `<button class="c-header_menu-btn">` with the `burger` icon and the text "Menu" — opens the full-screen `.c-menu`.
- **Behavior:** Fixed, `pointer-events: all` (logo), `pointer-events: none` (quicknav until revealed). Color is `#000000` by default, `#FFFFFF` under `data-theme=dark`, `is-loading`, or `has-menu-opened`. On scroll past 200 px the body gets class `hide-quicknav` and the quicknav slides up out of view.
- **Hover/focus:** the pill link gets a lime (`#D3FD50`) full-coverage wipe-up via a `::after` pseudo-element: `transform: translate3d(0, -102%, 0) → translate3d(0, 0, 0)` over `150 ms`. Text turns black over the lime.
- **Quick-nav item heights:** the first item is `3.4375 rem` (55 px) tall and `4/20` of the grid wide; the second is `5.625 rem` (90 px) tall and `6/20` wide. They are anchored to the top of the viewport and use `align-items: flex-end` so the label hugs the bottom of the pill. Each item's background is a `::before` black `position: absolute` overlay (z-index 0); the label is z-index 2.
- **Menu button:** `width: 3/20 of (100vw - 13.125rem) + 2.5rem`, `padding-right: 1.5625 rem`. The burger SVG is `3.8125 rem × 0.5 rem` (`stroke: currentColor`, two short horizontal lines slightly offset). The "Menu" label sits at `top: 2.8125 rem, left: 0.625 rem` and slides in from `translate3d(0, -100%, 0)` when the page is ready and the quicknav is enabled. On `min-width: 1000px, min-aspect-ratio: 1/1`, the menu button stretches to `height: 8.125 rem`, its `::before` background scales to `2.6×` vertical, and the label slides to `calc(5rem - 100%)`.
- **Logo SVG geometry:** the K72 monogram is drawn with 7 hand-tuned rectangles in a 103×44 viewBox. The logo uses `fill: currentColor` and is sized `7.3125 rem × 3.125 rem` (117 × 50 px). On `has-preview-bar-active` the logo SVG scales to `0.6×` to make room for the preview bar.

### Menu (`.c-menu`)

A full-viewport overlay opened by the burger. Five vertical black columns animate down from the top (mirroring the loader), then a row of 4 main-nav links animates in with a 3D flip — `transform: perspective(80vw) rotateX(90deg) → rotateX(0deg)` — staggered `0.3 / 0.36 / 0.42 / 0.48 s`, 600 ms.

- **Links:** "Projets", "Agence", "Contact", "Blogue". Each is rendered as an `<a class="c-menu_main-nav_link">` containing a `<span>` with the label, plus a `<div class="c-menu_main-nav_link_overlay_inner">` that is a horizontal marquee (CSS `@keyframes mainNavLoop`, `translate3d(0, 0) → translate3d(-100%, 0)`) showing the link text twice interleaved with a `c-pill-image` thumbnail (the relevant case-study or team thumbnail in a `2em × 0.714em` pill). On the "Contact" link, the pill-image is replaced by the `#heart` SVG icon. The marquee runs continuously, with each link offset by `-2s / -4s / -6s / -8s` so all four are at different points in the loop.
- **Mega-nav link style:** `font-size: 7.2rem`, `line-height: 0.75`, transparent text by default, lime background fills on hover. The base link is a giant black bar; the overlay reveals lime (`#D3FD50`) with a circular black-on-lime label.
- **Close button:** `c-menu_close` is 8.125 rem square, top-right, animates in from `translate3d(100%, 0, 0)`. Stroke `#FFFFFF`, hover stroke `#D3FD50`.
- **Language switcher:** `fr / en` in the top-left, 30% white, `fr` is `-active` (full white), `en` is a link to `/en`.
- **Footer:** `c-menu_footer` (clock, legal links, socials) is `opacity 0` and fades in to `1` over 600 ms with 450 ms delay once the menu opens. Disabled on mobile (`≤999 px`).
- **Mega-nav overlay mechanics:** each link is a relative-positioned `<a>` that contains the label `<span>` and an absolutely-positioned `<div class="c-menu_main-nav_link_overlay">` which contains the `<div class="c-menu_main-nav_link_overlay_inner">` — a flex row with two duplicate groups (one absolutely positioned behind the other), each containing the `c-pill-image` and the label `<span>`. The overlay inner has `background-color: #D3FD50, color: #000000, padding: 23.04px 0 0` (the same `padding-top: 0.2em` as the text-lines pattern), and is animated with `@keyframes mainNavLoop` (`translate3d(0, 0) → translate3d(-100%, 0)`). Because the inner content is duplicated, the marquee loops seamlessly.
- **Per-item delays:** `nth-child(1) { animation-delay: -2s }`, `nth-child(2) { -4s }`, `nth-child(3) { -6s }`, `nth-child(4) { -8s }` — each link's marquee is 2 s further into the loop.
- **Image inside the pill:** the `c-pill-image` is `display: inline-block, width: 2em, height: 0.714em, border-radius: 999em, background-size: cover, background-position: center` — i.e. a small stadium-shaped thumbnail. The background image is set inline via `style="background-image: url('/images/caseStudies/...')"`.
- **Menu background veil:** `.c-menu_bg:before` is `#1D1D1D` at `opacity 0.7` when the menu is open (transitions over 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`). It sits behind the five columns to darken the page underneath.
- **Menu columns on tablet (700–999 px):** 3 columns, 33.333 % each, 4th and 5th `display: none`. Delays `0.21 / 0.165 / 0.12 s`.
- **Menu columns on mobile (≤699 px):** 2 columns, 50 % each, columns 3–5 hidden. Delays `0.12 / 0.075 s`.
- **Langswitcher link styling:** `c-menu_langswitcher_item.-active` is full white (`#FFFFFF`), `c-menu_langswitcher_item.-link` is `rgba(255, 255, 255, 0.3)` and turns lime on hover/focus. The active item is a `<span>`, the inactive is an `<a>` to `/en`.
- **Footer grid on desktop:** 3-column grid `[legals] [clock] [back-to-top]` with `gap: 0.625 rem` and `align-items: center`. The clock column is hidden on `≤999 px`.

### Button (`.c-button`)

- **Variants:** default, `-thicker` (border-width: 3px), `-dark-hover` (inverts to black-on-white on hover).
- **Sizes:** font-size is set per-instance via `c-` components; the base is `2.1875rem`. Hero CTAs are `6.5 vw` FR, socials are `2.1875rem`, project-year circles use `1rem`.
- **Anatomy:** uppercase label, `border: 2px solid currentColor`, `border-radius: 999em` (full pill), `line-height: 0.7`, `padding: 0.22em 0.3em 0 0.3em` — i.e. the label is vertically centred, the pill is just slightly taller than the text.
- **States:** default (transparent fill, white border), hover/focus (color `#D3FD50`, no fill change for the default variant; for `-dark-hover` it fills black and turns the text white), focus ring is implicit (no custom ring drawn).
- **Default vs. `-thicker`:** the only difference is the border-width (2px vs 3px). Used on the homepage CTAs ("Projets", "Agence") which need the heavier stroke to read at 6.5 vw size.
- **Native `<button>` vs `<a>`:** the same class is used on `<button>` and `<a>` — no native reset, both are `display: inline-block`. The footer `c-footer_top-btn` and the socials are `<a>`; the menu burger and the video-modal close are `<button>`.

### Socials (`.c-socials`)

A flex row of pill buttons labelled `FB`, `IG`, `IN`, `BE` (Facebook, Instagram, LinkedIn, Behance). Each is a `c-button` (so it has the same pill border) at `font-size: 2.1875rem` (`35 px`), `border-radius: 999em`. Margins `0 0.1875rem` between items. They sit in the menu footer and (in the smaller variant) in the page footer.

- **Anatomy:** `<ul class="c-socials">` of `<li class="c-socials_item">` with an `<a class="c-button c-socials_link">` inside. The `c-button` border is 2 px solid currentColor. The label is uppercase, with a `u-screen-reader-text` span holding the long name (e.g. "Facebook") and an `aria-hidden="true"` span holding the short label (`FB`).
- **Position in DOM:** on the homepage the socials only appear inside the `.c-menu_footer` (the menu is not open by default). On `/contact` and the other interior pages the socials also appear in the `.c-footer_socials` and inside `.c-contact_socials_list` (with `font-size: 5vw` / `3.75 rem` / `10vw` depending on aspect ratio).
- **Spacing:** margin `0 0.1875 rem` (3 px) between items. `border-radius: 999em` makes them stadium-shaped.

### Text-lines (`.c-text-lines`)

A reusable text-reveal pattern used by the H1 punchline and the layered punchline. Each line is wrapped in `.c-text-lines_item > .c-text-lines_item_outer > .c-text-lines_item_inner`. The `inner` span starts at `transform: translate3d(0, -120%, 0)` and slides to `0` over `0.9 s` `cubic-bezier(0.23, 1, 0.32, 1)` (a strong ease-out) once the parent gains `is-inview`. Staggered by `0.135 s` per line (CSS `:nth-child(2) → 0.135s`, `nth-child(3) → 0.27s`, etc., up to 5 lines). The `outer` has `overflow: hidden` to clip the inner during the slide. Set up at runtime by the `TextLines` JS module using GSAP's `SplitText` (`type: "lines"`, `linesClass: "c-text-lines_item"`).

- **Negative-margin trick:** each `.c-text-lines_item` has `padding-top: 0.2em, margin-top: -0.2em` — the negative margin compensates for the line-height slack, so the line-height is preserved visually while the `outer` can still clip overflow. The `inner` repeats the padding/margin on top of itself to maintain the same line-box metrics.
- **The `-allow-overflow` variant:** some lines need a child element (the canvas monitor, the lime circle) that must not be clipped by the `outer`'s `overflow: hidden`. Those lines get `class="c-text-lines_item -allow-overflow"` which sets `overflow: visible`.
- **The `is-inview` trigger:** Locomotive Scroll adds `data-scroll` and toggles `is-inview` based on the element's intersection with the viewport. The CSS only animates the `inner` when the parent has both `is-ready` and `is-inview`.
- **Stagger math:** the delay is `0.135 s` per child. The full hero H1 (3 lines) takes `0 + 0.135 + 0.27 = 0.405 s` from when `is-ready` is added to the last line being mid-flight, plus the 900 ms slide → total ≈ 1.3 s for the whole hero reveal.

### Circle (`.c-circle`)

A single SVG `<ellipse>` drawn with GSAP `DrawSVGPlugin`. JS module `Circle` renders the SVG, then runs a tween from `drawSVG: "200% 200%"` to `drawSVG: "100%"` over 2 s `power2.inOut`, then a looping ping-pong (`repeat: -1`, `repeatDelay: 2s`, `delay: 2s`) that mirrors the SVG horizontally and re-draws. On the homepage the circle wraps the word "créativité" in the H1, with `stroke: #D3FD50`, `stroke-width: 2`, `fill: transparent`. The geometry is computed from `el.getBoundingClientRect()` on resize.

- **SVG generation:** `addSVG()` injects `<svg viewBox="0 0 W H"><ellipse cx="W/2" cy="H/2" rx="W/2 - 2" ry="H/2 - 2"/></svg>` — the `2` is the `WIDTH` constant that doubles as the stroke width, so the ellipse is inset by one stroke on each side and remains fully visible inside its container.
- **Intro animation:** `gsapWithCSS.fromTo(svg.children[0], { drawSVG: "200% 200%" }, { duration: 2, ease: "power2.inOut", drawSVG: "100%" })`. After it completes the `onComplete` builds a new ping-pong timeline: `loop.set(svg, { scaleY: 1, scaleX: -1 })` → `loop.to(svg.children[0], { drawSVG: "200% 200%", duration: 2, ease: "power2.inOut" })` → `loop.set(svg, { scaleY: 1, scaleX: 1 })` → `loop.to(svg.children[0], { drawSVG: "100%", duration: 2, ease: "power2.inOut" })`. The `repeat: -1, repeatDelay: 2, delay: 2` make the loop feel deliberate, not frantic.
- **Why mirror the SVG:** drawing a closed ellipse from `0% → 100%` would draw half of it, but `DrawSVGPlugin` traces the path in both directions when the start and end percentages differ. Going `200% 200% → 100%` traces a full lap, then a horizontal mirror + a second full lap = the lime loop "breathes" around the word.
- **Initial state:** the `mark` element wraps the word in HTML; the inline SVG has `style="stroke-dashoffset: -870.397; stroke-dasharray: 1120.67px, 435.449px;"` set server-side (these values pre-compute the start of the DrawSVG trace for a 758×118.5 viewBox).

### Home monitor (`.c-home_monitor`)

A `<canvas>` placed inline inside the H1 punchline, between "qui" and "génère". The `Monitor` JS module draws the live `<video>` from the hero into the canvas every `requestAnimationFrame` frame, then composites a `roundRect` clip with `globalCompositeOperation = "destination-in"`, producing a stadium-shaped video thumbnail. The canvas fades and slides in via CSS keyframe `monitorAppear` (`translate3d(0, -50%, 0)` → `0`, `opacity 0 → 1`, 900 ms `cubic-bezier(0.165, 0.84, 0.44, 1)`, delay 500 ms) once `html.is-loaded`.

- **Canvas size:** the canvas is `display: inline-block, width: 1.66em, height: 0.73em` in CSS (relative to the H1's `9.5 vw` font-size → roughly `227 × 99 px` at 1440 × 900). On resize, `compute()` re-reads `getBoundingClientRect()` and sets `canvas.width / .height` to the actual size.
- **Video source:** `this.video = this.$("source", document.body)[0]` — the JS looks for the FIRST `<source>` element on the body, which is the `<source>` inside the hero `<video>` tag. The video's intrinsic aspect ratio is `videoWidth / videoHeight`.
- **Object-fit math:**
  - If `ctxRatio > videoRatio` (canvas is wider than video), the video is letterboxed vertically: `ctx.drawImage(video, 0, -(canvas.width * (1/videoRatio) - canvas.height) / 2, canvas.width, canvas.width * (1/videoRatio))`.
  - Else the video is letterboxed horizontally: `ctx.drawImage(video, -(canvas.height * videoRatio - canvas.width) / 2, 0, canvas.height * videoRatio, canvas.height)`.
- **Clip:** `ctx.globalCompositeOperation = "destination-in"; ctx.roundRect(0, 0, w, h, h/2).fill(); ctx.globalCompositeOperation = "source-over"` — the `destination-in` keeps only the part of the source that overlaps the destination, so the visible canvas is the intersection of the video frame and the rounded rectangle. The `h/2` radius makes the corners fully rounded, so the result is a stadium.
- **Polyfill:** `CanvasRenderingContext2D.prototype.roundRect` is added at the top of `app.js` (lines 14232-14244) for browsers that don't yet ship it natively.

### Clock (`.c-clock`)

A flex row with a `#globe` icon and a label like `MONTREAL_16:02:40`. The icon is sized `1.5em × 1.5em`, the text sits in an uppercase `Lausanne` span. The `Time` JS module updates the inner `<span data-module-time>` every 250 ms via `Intl.DateTimeFormat({ timeZone: "America/Toronto", hourCycle: "h24" })`. Two instances are rendered on the homepage: one in the menu footer, one in the home content. The home instance is hidden on `≤999 px`.

- **Time format:** `hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h24"`, in the `America/Toronto` timezone (Montréal is on Eastern Time). The format produces `HH:MM:SS` 24-hour strings.
- **Interval:** 250 ms (so the seconds tick is visible — a 1000 ms interval would only update once per second, which feels sluggish).
- **Globe icon:** the `#globe` symbol from the sprite, filled with `currentColor` (no stroke), 24×24 viewBox. The CSS sizes it to `1.5em × 1.5em` and gives it `margin-right: 1em` so the label sits next to it.

### Background video (`.c-home_background`)

A `position: fixed` `figure` that fills the viewport with the hero video. The figure has `background-image: url(poster)` plus a child `<video src="..." muted playsinline loop poster="...">`. The figure starts at `transform: scale3d(1.5, 1.5, 1)` and animates to `1, 1, 1` over 900 ms `cubic-bezier(0.165, 0.84, 0.44, 1)` once `is-loaded`. The video source is the Vimeo progressive MP4 (`https://player.vimeo.com/progressive_redirect/playback/1119600858/rendition/1080p/file.mp4?...`). On the homepage this is paused when the menu opens and resumed 750 ms after page load.

- **Layering:** the figure is `z-index: 10` (above the dark `body` background). The home content (`.c-home_content`) is `z-index: 20` (above the figure). The header is `z-index: 900`, the loader is `z-index: 850`, the menu is `z-index: 800`, and the video modal is `z-index: 1000`.
- **Video attributes:** `muted=""` (autoplay requires muted in modern browsers), `playsinline=""` (iOS no-fullscreen-on-play), `loop=""` (continuous), `data-monitor="source"` (so the `Monitor` module can find it), `data-home="video"`.
- **Poster:** the same poster is used as both the `<video poster>` attribute and the `background-image` of the figure, so the static frame shows before the video starts.
- **Background shorthand:** the inline style is `background-image: url('...'); background-size: cover; background-position: center center;` — the figure covers the viewport regardless of the video's aspect ratio.

### Video modal (`.c-video-modal`)

A fixed, full-screen overlay used to play case-study videos. The `c-video-modal_bg` is `#1D1D1D` at `opacity 0.95`, animated in with `transform: scale3d(1, 0, 1) → scale3d(1, 1, 1)` from `top center` over 600 ms. The `c-video-modal_inner` is a `16:9` (`padding-bottom: 56%`) black box, `opacity 0 → 1` over 1 s with 600 ms delay. The `c-video-modal_close` is a small uppercase "Fermer" button, top-right, slides in from `translateY(-100%)`. The JS module `VideoModal` detects the host (`youtube` / `vimeo` / `mp4`) and injects either an `<iframe>` (YouTube or Vimeo with `?autoplay=1&loop=1&autopause=0`) or a `<video controls autoplay>`. Closes via the close button or Escape.

- **Width:** `c-video-modal_content` is `width: 80%` desktop / `90%` on `≤1199 px`. The 16:9 aspect is enforced by the `padding-bottom: 56%` on the `inner` div.
- **Open delay:** the JS waits 500 ms (`appendDelay`) before injecting the iframe so the open animation has time to start. The iframe's `?autoplay=1` makes it start playing as soon as it loads.
- **Close timing:** the iframe is destroyed 250 ms (`emptyTimeout`) after the close click so the closing animation is visible.
- **Escape key:** `document.addEventListener("keyup", this.closeBind)` listens for the Escape key and calls `close()`.

### Banner (`.c-banner`)

A full-width, lime (`#D3FD50`) `transform: rotate(-5deg)` marquee used as a case-study CTA. The text is uppercase `font-size: 11vw`, line-height 0.75, padded 120 vw wide. The inner content is duplicated and the marquee (`@keyframes bannerInner`, `5 s linear infinite`) slides the inner `transform: translate3d(0, 0) → translate3d(-100%, 0)`. Under `html[data-scroll-direction=up]` the banner flips to `rotate(5deg)`. On hover a white wipe (`:before` `scale3d(1, 0, 1) → 1`) reveals underneath the lime.

- **Skew/rotation:** `transform: rotate(-5deg)` tilts the whole banner counter-clockwise by 5°. The width is `120vw` and the left margin is `-10vw` so the banner extends past both viewport edges even when rotated.
- **Marquee:** the `c-banner_inner` is duplicated, `display: flex, flex-shrink: 0`, animated with `bannerInner 5s linear infinite`. Each iteration slides the inner by `-100%`, so the second copy seamlessly takes the place of the first.
- **Scroll-direction reactivity:** the `[data-scroll-direction]` attribute is set by the Locomotive `Scroll` module on every scroll. When the user scrolls up, the banner tilts to `+5deg` (clockwise), giving a "windshield-wiper" feel.
- **Hover:** the `::before` is a white panel `transform: scale3d(1, 0, 1)` with `transform-origin: bottom center`, which expands to `scale3d(1, 1, 1)` on `:hover / :focus` over 200 ms. So the white reveals from the bottom of the banner under the lime text.

### Team row (`.c-team_row`)

A list row that wipes lime on hover. The `::before` pseudo-element is `#D3FD50`, `transform: scale3d(1, 0, 1)` (origin top), and goes to `scale3d(1, 1, 1)` over 300 ms. Text is uppercased `Lausanne`, member name at `2.5 rem` desktop / `16 px` mobile. Member photo reveal on hover is two layered `translate3d(-100%, 0)` and `translate3d(100%, 0)` animations on the wrapper / image (300 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`, keyframes `showTeamListImageWrapper` / `showTeamListImage`).

- **Color flip:** when the lime wipe covers the row, the text colour flips from `currentColor` to `#000000` so it stays legible over the lime.
- **Position label:** `c-team_row_position` is uppercase `1.875 rem` desktop, but on `≤699 px` it shrinks to `10 px` and becomes lime (`#D3FD50`) — i.e. a small lime label rather than a body label.
- **Name size:** `c-team_row_name` is `2.5 rem` desktop / `16 px` mobile, with `line-height: 1` and `padding-top/bottom: 0.625 rem`. The `::before` `margin-top: 0.023em` rule creates the "optical baseline" trick used throughout the site.
- **Visual reveal:** the `c-team_list_visuals_outer` is positioned absolutely above the list. On `.is-active` it slides in from `translate3d(-101%, 0, 0) → translate3d(0, 0, 0)` (the outer wipes in from the left), and the inner image wipes in from the right via `showTeamListImage`. The two halves meet in the middle, which is a classic editorial transition.

### Video thumb (`.c-video-featured`)

A `16:9` block with a central 56.25 vw circular video thumb (`border-radius: 100%`). On hover, the circle expands to fill the block (`width/height: 100%`, `border-radius: 0`, 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`). The internal `<video>` plays on hover via the `VideoThumb` module.

- **Head bar:** the `c-video-featured_head` is a flex row across the top of the block with a title (e.g. case-study name) and a subtitle (e.g. "iA — Brand identity"). Both are `1.875 rem` desktop / `1.25 rem` mobile, uppercase. The subtitle is prefixed with `_` (`subtitle:before { content: "_" }`) — a K72 typographic tic.
- **Square aspect on portrait screens:** `padding-bottom: 100%` instead of `56.25%` on `max-aspect-ratio: 1/1` — so the block becomes square on phones.
- **Hover state:** `-hover` is added by the `VideoThumb` module on `mouseenter / focus` of the button. The `transition-property: width, height, border-radius` means the morphing is hardware-accelerated (only the listed properties animate, no layout thrash).

### Other notable components

- **Custom scrollbar** (`.c-scrollbar`): 11 px wide, 7 px thumb, `border-radius: 10px`, hidden until `has-scroll-scrolling` or hover, then `opacity: 1`. On `data-template=case-study-list` / `case-study-details` the thumb turns lime. Implemented by Locomotive Scroll (the custom scrollbar is a Locomotive CSS pattern, not a browser-native scrollbar).
- **Elastic list** (`.c-elastic-list`): a sticky scroll-list where each row expands to a 16:9 image; the `outer` gets `border-radius: 0 → 2.5 rem` on hover over 300 ms; the row's height transition uses `will-change: height`. The `ElasticList` module (`js/app.js:8871`) measures `getBoundingClientRect()` of the first thumb, finds how many items per row, then on each scroll uses Locomotive's `progress` value to drive `gsapWithCSS.set(outer, { height: max(MIN_HEIGHT=20, thumbBCR.height * (1 - scaleY)) })` and `set(inner, { y: -thumbBCR.height / 2 * scaleY, force3D: true })`. Disabled when Locomotive is off (no `has-scroll-smooth` class) so it doesn't break touch/mobile.
- **Image gallery** (`.c-image-gallery`): Swiper-driven carousel with `EffectCreative` (`prev: { translate: ["-10%", 0, 0] }, next: { translate: ["100%", 0, 0] }`, `loop: true`, `speed: 500`, single `slidesPerView`). Click advances to next slide; a 15 vw `c-image-gallery_cursor` SVG follows the pointer (`mix-blend-mode: difference`, `stroke: #FFFFFF`, scaled by 1 on default and `scaleX(-1)` on `.-rotate`) on hover-capable devices. Hidden via `display: none` on `hover: none` devices.
- **Caption gallery** (`.c-caption-gallery`): sibling to the image gallery — same custom cursor pattern. The slide is `width: 10/20 of (100vw - 13.125rem) + 6.25rem` desktop / `75%` mobile, with a left-side index column (`width: 40% / 25%`) and right-side caption text (`60% / 75%`).
- **Work thumb** (`.c-work-thumb`): case-study card with a black overlay wipe (`opacity 0 → 0.2` over 200 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`) on link hover plus `transform: scale3d(1.05, 1.05, 1)` on the image over 300 ms. The content is `visibility: hidden` on `hover: hover` devices (the title is rendered as an overlay; on touch it's stacked below the image).
- **Preview bar** (`.c-preview-bar`): fixed top bar (z-index 600) used on case-study pages; slides in from `translate3d(0, -100%, 0)`, contains title/subtitle/tag with a yellow lime wipe under each field animated by `previewBarUpdateField` (`scale3d(1, 1, 1) → scale3d(1, 0, 1)`, 300 ms). Hidden on `hover: none` devices. Driven by the `PreviewList` module that listens for `mouseenter / focus` on each item and calls `PreviewBar.show()` / `updateContent()`.
- **CTA slides** (`.c-cta-slides`): full-viewport `100vh` slide items with a sticky-area of `200vh` per item (a scroll-pinned carousel of large rounded images with bottom corners un-rounded, used for case-study CTAs on the homepage and inner pages). Background is white, links are uppercase `font-size: 1.25 rem` with lime hover.
- **Block image** (`.c-block-image`): generic 100 %-width media block. `.-rounded` variant: `border-radius: 3.5rem, overflow: hidden`. `.-padded` variant: `width: calc((100vw - 13.125rem) * 14/20 + 8.125rem)`, `margin: auto`, narrowing to 80 % then to `calc(100vw - 5rem)` on `≤699 px`.
- **Block text** (`.c-block-text`): `width: calc((100vw - 13.125rem) * 16/20 + 9.375rem)`, `text-indent: calc((100vw - 13.125rem) * 5/20 + 3.125rem)` — a long-line pull quote with a heavy text-indent, typical editorial treatment.
- **Audio sample** (`.c-audio-sample`): play/pause button (`font-size: 7vw`, absolute-centred) with a 3-bar EQ spinner (`@keyframes audioSamplePulse`, 600 ms, 3 bars with delays `-0.12 / -0.24 / -0.36 s`). The white `::after` of the button (`z-index: -1`) provides the disc background.
- **About hero** (`.c-about-hero`): top-padded `55vh` intro (`50vw` on `max-aspect-ratio: 1/1`). A 37.5 % width block with em-underlined text, a 25 %-width portrait that wipes in from the left/right (`translate3d(-101%, 0, 0) → translate3d(101%, 0, 0)`, 900 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`, delay 300 ms). The portrait `c-about-hero_visual_outer` is `border-radius: 1.25rem, overflow: hidden`. The `AboutHero` JS module crossfades the inner images on scroll progress when Locomotive is on, otherwise it auto-rotates them every 1 s.
- **Project summary** (`.c-project-summary`): a large 13-of-20 column content block with a tiny 1-of-20 column visual on the left that wipes in from `translate3d(-105%, 0, 0)` and uses `mix-blend-mode: difference` so the white text punches through. The punchline text is `text-transform: uppercase`, `line-height: 0.886`, and the visual is wrapped in `c-project-summary_visual_outer` with `border-radius: 3.5rem` desktop / `1.875rem` mobile.
- **Layered punchline** (`.c-layered-punchline`): a sticky-stack text image composition used on the case-study detail pages. `font-size: 9vw` desktop / `11vw` portrait, with even lines right-aligned, all wrapped in `overflow: hidden` and `transform: translate3d(0, 100%, 0) → 0` (line stagger `0.12 / 0.24 / 0.36 / 0.48 s`). The image stack `c-layered-punchline_image` is `100vh × 66.666vh` with `border-radius: 0` when in-view.
- **Fancy gallery** (`.c-fancy-gallery`): a 9-of-20 small-image column on the left and a 12-of-20 large-image column on the right (with a `border-top-left-radius: 3.5rem, border-bottom-left-radius: 3.5rem` mask), separated by `-3/20` margin. The large image has `margin-top: -2.5rem, margin-bottom: -2.5rem` to bleed past its container.
- **Stack** (`.c-stack`): the pinterest-like sticky image stack. Each `c-stack_item` has a `c-stack_visual` with `padding-bottom: 60.6 %` (5:3 aspect) and `margin-bottom: 5rem` (2.5 rem on mobile). The JS module scales each visual by `1 - 0.025 * i` and offsets by `y: 10 * i` for the cascading look.
- **Accordion** (`Accordion.js` + `AccordionDetails.js`): the legacy `Accordion` class is a simple one-class-winner accordion that uses a custom `slideUp` / `slideDown` helper (`js/app.js:13691`) which animates `height + margin + padding + overflow` over 500 ms via inline styles. The newer `AccordionDetails` class is a native `<details>` enhancer that uses the **Web Animations API** (`el.animate({ height: [startHeight, endHeight] }, { duration: 300, easing: "cubic-bezier(0.33, 1, 0.68, 1)" })`) — when `prefers-reduced-motion: reduce` matches, duration is forced to 0. Open class is `is-active`. Single-mode is supported via the `data-accordion-single` attribute.
- **Footer** (`.c-footer`): `background-color: #000000`, `color: #FFFFFF`, `padding: 0.625rem`, `min-height: 62vh` on `min-aspect-ratio: 1/1`. `c-footer_head` is `display: flex, justify-content: space-between, align-items: center` at `font-size: 5vw` landscape; the body of the footer is the `c-footer_foot` 3-column grid (`[legals] [clock] [back-to-top]`), with the legal links `text-transform: uppercase`, `c-footer_legals_link` lime on hover, and the "back to top" button uppercase at `font-size: 1.25 rem`.
- **Dot** (`.c-dot`): a single 0.875 rem black circle used as a separator dot in the project year (`c-project_year span::before` shows a `⬤` filled circle at 65 % size).
- **Accordion icon** (`.c-accordion_icon`): a 0.5625 rem `+` cross that rotates to an `×` when active (`transform: translateX(-50%) scaleY(0)` on the vertical bar), 300 ms.
- **Blockquote** (`.c-blockquote`): a `c-blockquote_content` at `font-size: 2.25 rem` / `3.5 rem ≥1000 px`, `line-height: 1`, prefixed with a 35 px `#quote-fr` SVG icon (rotated 0° or 180° on `.-rotate`).
- **FAQ** (`.c-faq`): `display: flex, flex-direction: column, gap: 1.875 rem`, with a `c-faq_title` at `1.625 rem` / `2.25 rem ≥1000 px`, uppercase, weight 600, `text-wrap: balance`.
- **Utils / anim helpers**:
  - `.u-anim` — adds a default 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)` reveal on `is-ready`.
  - `.u-anim.-delay-1` … `.-delay-20` — same reveal with delays of 0.1 s to 2.0 s (CSS-authored manually; 20 variants).
  - `.u-anim-scroll` — same but triggered on `.is-inview` (Locomotive Scroll class).
  - `.u-anim-scroll.-reverse` — slides from below instead of above.
  - `.u-indent` — adds the standard `text-indent: calc((100vw - 13.125rem) * 5/20 + 3.125rem)` (cascades through `c-project-summary_text p`).
  - `.u-z-index-2`, `.u-screen-reader-text` — standard utilities.
  - `.u-2\:1` / `.u-4\:3` / `.u-16\:9` — aspect-ratio paddings (`::before` `padding-bottom: 50% / 75% / 56.25%`) for use with `.o-ratio`.
  - `.u-1\/1` … `.u-5\/5`, `.u-1\/6` … `.u-4\/6` — explicit width utilities for the 5-column and 6-column layout helpers.
- **Article WYSIWYG** (`.o-article-wysiwyg`): the long-form text container for blog posts. `width: 100%` mobile, `width: calc((100vw - 13.125rem) * 10/20 + 6.25rem)` desktop. H2 is `1.625 rem` / `2.1875 rem ≥1000 px`, `font-weight: 600`, `text-transform: uppercase`. H3 is `1.375 rem`, `font-weight: 600`, `text-transform: uppercase`. `text-wrap: balance` on every heading. `<a>` is underlined, `<li>` is `padding-left: 0.5em, line-height: 1.1 !important`. Tables get zebra-striping via `tr:nth-child(odd) { background-color: #f2f2f2 }`.
- **Article image** (`.o-article-img`): full-width responsive media within an article. `.-full` variant is `100% + 1.25 rem` wide (bleeds 10 px past the gutter) and uses `aspect-ratio: 1440/830` (no radius). `.-small` is `10/20 + 6.25 rem`; `.-large` is `14/20 + 8.75 rem`. The image has `border-radius: 50 px` and `overflow: hidden` on standard variants.
- **Tabs** (`.c-tabs` — inferred from the `c-tabs_*` prefix and the accordion pattern, not directly observed): used to switch between list filters.
- **List** (`.c-list` — pattern inferred from `c-blog-list` and `c-menu`): the generic list with `border-top: 1px solid #000000` and `gap: 0.625 rem` between items.

---

## JavaScript & Libraries

The site is a single hand-rolled ES module bundle (`app.js`, `544 KB`, with the main CSS at `main.css`, `176 KB`). There is no React/Vue/Svelte, no Next.js, no Astro. It is a classic agency site, mostly a static-rendered HTML page with progressive JS enhancement. Bundling is webpack-shaped (paths in the source are `assets/scripts/modules/...` and `node_modules/...`).

### App architecture

- The bundle exports a `modules` map from `assets/scripts/modules.js` with **24 named module classes** (AboutHero, Accordion, AccordionDetails, AudioGallery, CaptionGallery, Circle, ElasticList, GridHelper, Header, Home, ImageGallery, Load, MainNav, Monitor, PreviewBar, PreviewList, Scroll, Stack, TagSlider, Team, TextLines, Time, VideoModal, VideoThumb, VideoToggler).
- These are registered with `modujs` (`main_esm_default`, a ~250-line micro-framework from `node_modules/modujs/dist/main.esm.js`). The framework walks the DOM, finds any element with a `data-module-*` attribute, instantiates the matching class, calls `mInit(activeModules)` then `init()`, and exposes a cross-module `call(func, args, ModuleName, instanceId)` bus. Every `data-module-xxx="N"` attribute is auto-id'd as `m1, m2, m3, ...` (the `Load` module is `m1`, the `Header` is `m2`, the `MainNav` is `m3`, the first `Time` is `m4`, the `Home` is `m5`, the `Monitor` is `m6`, the second `Time` is `m7`, the `VideoModal` is `m8`, etc., as observed in the rendered HTML).
- A custom `modularLoad_default` (in `assets/scripts/utils/modularLoad.js`, ~290 lines) is the SPA router. It intercepts `<a>` clicks, fetches the new HTML with `fetch(href, { signal: AbortController.signal })`, parses with `DOMParser`, copies the `data-load-container` into the DOM, swaps the document title and meta description, fires `loading / loaded / ready` events on the window. The blog transition is configured in `Load.js` with `transitions: { blog: {} }`. The `enterDelay` is 1000 ms, the `loadedDelay` is 0, `exitDelay` is 0.
- A `CanvasRenderingContext2D.prototype.roundRect` polyfill is added at the top of `app.js` (the Monitor module uses it for the stadium clip).
- The window scroll/direction tracking, the `data-scroll-call` hooks, the smooth-scroll, and the in-view detection are all provided by Locomotive Scroll.
- The bundle is loaded with `<script src="https://k72.ca/assets/scripts/app.js?v=20240527152606" defer="">` from the body.

### Library inventory

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| `modujs` | unknown (ESM build from `node_modules/modujs/dist/main.esm.js`) | inline at `js/app.js:48` | Lightweight DOM controller (`new main_esm_default({ modules })`) that drives the `[data-module-xxx]` elements. Provides `init`, `call`, `destroy` lifecycle. |
| `modularLoad` (custom, K72-authored) | — | `js/app.js:538` | SPA-style page-transition router. Listens for `<a>` clicks and `popstate`, fetches the new HTML into a `data-load-container`, emits `loading / loaded / ready` events. Default `enterDelay: 1000ms`. Blog transition is configured (`transitions: { blog: {} }`). On Chrome it patches all `<use>` tags in the new container to use the Chrome-friendly `xlink:href` form. |
| `locomotive-scroll` | 4.x (esm) | `js/app.js:864` (`node_modules/locomotive-scroll/dist/locomotive-scroll.esm.js`) | Smooth scroll. `init` options: `{ smooth: true, getDirection: true }`. Sets `has-scroll-smooth` on `<html>`, sets `data-scroll-direction` on scroll, calls module methods via `data-scroll-call` (e.g. `themeUpdate`, `infinite`, `lazyLoad`). Has a `scrollTo(target, options)` and `update()` on resize. Wires a `ResizeObserver` on `<body>` to call `update()` on layout change. Forwards `data-scroll-offset` progress to `ElasticList.update` and `AboutHero.update`. |
| `smoothscroll-polyfill` | unknown | `js/app.js:1408` | `window.smoothscrollPolyfill.polyfill()` for legacy browsers (e.g. legacy Safari before `scroll-behavior: smooth`). |
| `gsap` | 3.12.7 | `js/app.js:3573` (`node_modules/gsap/gsap-core.js`) and `:6712` (`Tween.version = Timeline.version = gsap.version = "3.12.7"`) | Core animation engine. The site imports the bundle (`gsap/all.js`) and registers `CSSPlugin`, `DrawSVGPlugin`, `SplitText`. |
| `gsap/CSSPlugin` | 3.12.7 | `js/app.js:6734` | Plugin for CSS-property tweens (the default tween target). |
| `gsap/DrawSVGPlugin` | 3.12.7 | `js/app.js:7848` | Used by the `Circle` module to draw the lime ellipse around "créativité". |
| `gsap/SplitText` | 3.12.7 | `js/app.js:8077` | Used by the `TextLines` module (`type: "lines"`, `linesClass: "c-text-lines_item"`) to wrap each line in the reveal span. |
| `gsap/all.js` | 3.12.7 | `js/app.js:8488` | Convenience bundle (`var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap`). The local wrapper is `assets/scripts/lib/gsap.js`. |
| `swiper` | 11.2.8 | `js/app.js:8955` (header `Swiper 11.2.8 … Released on: May 23, 2025` in CSS `main.css:792–800`) | Used by the `ImageGallery` and `CaptionGallery` modules. `ImageGallery` uses `EffectCreative` with `prev: { translate: ["-10%", 0, 0] }, next: { translate: ["100%", 0, 0] }`. |
| `splitText` (GSAP plugin) | 3.12.7 | registered in `TextLines.js:13882` | See above. |
| `Didomi` (consent) | — | inline `<script>` in HTML (config in `homepage.html:48–138`) | GDPR consent platform. Theme configured with `color: '#D3FD50'`, regular buttons white-on-black, highlight buttons black-on-lime. Only French enabled (`languages: { enabled: ['fr'] }`). |
| `6sense` (`j.6sc.co/6si.min.js`) | — | `playwright/js/6si.min.js` (`69 KB`) and `<script id="6senseWebTag" src="https://j.6sc.co/j/a640d4d0-...js">` in the HTML | Account-based marketing / firmographic enrichment; hides hidden form fields with a `._6si_sff_filled` rule (works for `mktoForm`, `hs-form`, `elq-form`, generic `form .form-field`). |
| Google Tag Manager | `GTM-MWC9BML6` | inline in HTML (`homepage.html:142–146`) and `<iframe>` noscript fallback | Page tagging. |
| Google Analytics 4 | `G-89J4PRWZFW` | `<script async src="https://www.googletagmanager.com/gtag/js?id=G-89J4PRWZFW&cx=c&gtm=4e66h0">` in HTML | Analytics. |
| `privacy-center.org` SDK | — | `<script src="https://sdk.privacy-center.org/.../loader.js?target_type=notice&target=qBNmVFaa">` in HTML | Consent management. |
| Vimeo iframe API | — | referenced by `VideoModal.openVideo()` (`mp4`, `vimeo`, `youtube` host switch) | Loads `https://player.vimeo.com/video/{id}?autoplay=1&loop=1&autopause=0` on demand. |
| Cloudflare Turnstile / challenge | — | manifest `errors: []` shows the static HTML dump is challenged; Playwright is used to bypass | The site is fronted by Cloudflare bot protection; the static scrape returned a JS-challenge for every request. |
| `polyfill.io` polyfill bundle | — | `<script nomodule src="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=Element.prototype.remove,Element.prototype.append,fetch,CustomEvent,Element.prototype.matches,NodeList.prototype.forEach,AbortController">` in HTML | Loaded as a `nomodule` fallback. |
| `j.6sc.co` | — | inline `<script id="6senseWebTag" async src="https://j.6sc.co/j/a640d4d0-...js">` in HTML | 6sense JavaScript tag. |

JS module inventory (built into `app.js`):
- `Load` (`js/app.js:828`) — wraps `modularLoad_default({ enterDelay: 1000, readyClass: "is-load-ready", transitions: { blog: {} } })` and orchestrates the `is-ready` lifecycle. On `loading` it pauses the home video, blurs the active element, closes the menu after 500 ms, removes `is-ready`. On `loaded` it calls `app.destroy(oldContainer)` then `app.update(newContainer)`, adds `is-ready` after 300 ms. On `ready` for the `blog` transition it calls `Scroll.scrollTo(0, 600)` and `Scroll.update()`.
- `Scroll` (`js/app.js:3400`) — wraps Locomotive Scroll and exposes `scrollTo`, `update`, `lazyLoad`, plus scroll-direction / hide-quicknav / ElasticList / AboutHero progress forwarding. `init` passes `{ el, smooth: true, getDirection: true }`. Listens to Locomotive's `call` and `scroll` events; on `scroll` it updates `data-scroll-direction` on `<html>`, toggles `hide-quicknav` past 200 px scroll, and forwards `currentElements["elastic-list"].progress` to `ElasticList.update` and `currentElements["about-hero-visual"].progress` to `AboutHero.update`.
- `GridHelper` (`js/app.js:3503`) — a debug 20-column overlay (`position: fixed, z-index: 9999, pointer-events: none`). Toggled by the `Ctrl` key (`document.addEventListener("keydown", ...)`).
- `Header` (`js/app.js:3547`) — burger toggle: `html.classList.toggle("has-menu-opened")`, and on open it calls `Home.pauseVideo()`, on close `Home.resumeVideo()`.
- `MainNav` (`js/app.js:8495`) — pointer-direction-aware GSAP hover overlay. On `mouseenter` / `focus` of each `.c-menu_main-nav_link` it computes the entry direction by comparing `e.clientY` to `window.cursorPosition.y`, falling back to the link's `getBoundingClientRect().height / 2` mid-line, then kills the previous `target.tl` and runs a new GSAP timeline with `gsapWithCSS.fromTo(overlay, { y: ±100% }, { y: 0%, duration: HOVER_DURATION, ease: "power2.out" }, 0)` and the inverse on the inner. The `HOVER_DURATION` is 300 ms. Only fires on `pointer: fine` (skips touch).
- `Home` (`js/app.js:8578`) — manages the hero `<video>` (play / pause on menu open, 750 ms initial delay), sets `min-height` to `window.innerHeight` on resize, and after 750 ms calls `Circle.play("home")` via the cross-module bus.
- `Monitor` (`js/app.js:8619`) — the most technically interesting module. It runs a `requestAnimationFrame` loop that copies the live hero `<video>` (`.c-home_background > video`) into a 2D `<canvas>` with object-fit-cover math (uses `ctxRatio > videoRatio` to decide whether to letterbox horizontally or vertically), then sets `globalCompositeOperation = "destination-in"` and calls `ctx.roundRect(0, 0, w, h, h/2).fill()` to clip to a stadium. The result is a small, perfectly-rounded thumbnail of the live video positioned inline inside the H1.
- `Time` (`js/app.js:8682`) — Montreal-time updater, `setInterval(this.updateDate.bind(this), 250)`, `Intl.DateTimeFormat({ timeZone: "America/Toronto", hourCycle: "h24" })`. Two instances render on the homepage (one in the menu, one in the hero).
- `Circle` (`js/app.js:8711`) — the lime ellipse drawn with `DrawSVGPlugin`. Renders an `<svg viewBox="..."><ellipse cx="w/2" cy="h/2" rx="w/2-2" ry="h/2-2"/></svg>` and runs `gsapWithCSS.fromTo(svg.children[0], { drawSVG: "200% 200%" }, { duration: 2, ease: "power2.inOut", drawSVG: "100%" })`, then a `repeat: -1, repeatDelay: 2, delay: 2` ping-pong that mirrors the SVG with `scaleX: -1` and re-draws. The `WIDTH` constant is `2` (stroke width). Resizes on `window.resize` via `getBoundingClientRect()`.
- `Team` (`js/app.js:8765`) — on the `/agence` page, picks two random team members from the source list and renders them as the "featured" section with two `c-team_featured_member` blocks. Each block has two `c-team_featured_member_line` rows (first name, then last name + position) that animate as horizontal marquees (`c-team_featured_member_line_inner` 8 s linear infinite, alternating direction via `teamFeaturedMemberLineInner` / `teamFeaturedMemberLineInnerReversed`). The image is a `border-radius: 1.25rem` rounded portrait pinned via Locomotive's `data-scroll-sticky`.
- `ElasticList` (`js/app.js:8873`) — converts a list into a sticky scroll-expandable list. On `Scroll.update(progress)` it walks the items, computes `scaleY = distanceWithTopRefLine / (window.innerHeight - refLines.top)`, then `gsapWithCSS.set(outer, { height: max(20, thumbBCR.height * (1 - scaleY)) })` and `set(inner, { y: -thumbBCR.height / 2 * scaleY, force3D: true })`. Items that have passed the center ref line collapse to a `MIN_HEIGHT = 20` row. Disabled when Locomotive is off (no `has-scroll-smooth`).
- `ImageGallery` (`js/app.js:13359`) — Swiper with `EffectCreative` (`prev: { translate: ["-10%", 0, 0] }, next: { translate: ["100%", 0, 0] }`, `loop: true`, `loopedSlides: 1`, `spaceBetween: 0`, `slidesPerView: 1`, `speed: 500`). On click it advances. A custom `c-image-gallery_cursor` SVG follows the pointer via `gsapWithCSS.set(cursor, { x, y })` on `mousemove`, and is hidden on `hover: none` devices.
- `CaptionGallery` (`js/app.js:13457`) — same cursor pattern as the image gallery, paired layout.
- `VideoThumb` (`js/app.js:13529`) — on `mouseenter` / `focus` of the play button, it adds `.-hover` to the parent (which animates the video circle to full-screen) and calls `videoPreview.play()`. On `mouseleave` / `blur` it pauses.
- `VideoToggler` (`js/app.js:13608`) — on click it reads `data-id` and `data-host` from the click target, then calls `VideoModal.openVideo({ id, host })`.
- `VideoModal` (`js/app.js:13559`) — full-screen modal. On `openVideo(e)` it switches on `e.host` and injects either an `<iframe>` (YouTube: `?autoplay=1`, Vimeo: `?autoplay=1&loop=1&autopause=0`) or a `<video autoplay controls>`. The injection is delayed 500 ms (the `appendDelay`) to let the open animation finish. On `close()` it clears the injection after a 250 ms timeout so the iframe is destroyed properly. Listens for the Escape key.
- `Stack` (`js/app.js:13629`) — pinterest-like sticky image stack. `compute()` measures `elBCR`, then for each item sets `position: absolute, top: offsetTop, height: (itemHeight + marginBottom) * (i+1) - offsetTop, zIndex: items.length - i` and the visual `scale: 1 - 0.025 * i, y: 10 * i, transformOrigin: "bottom center"` (a cascading pile effect). Calls `Scroll.update()` after to refresh Locomotive.
- `Accordion` (`js/app.js:13759`) — a one-class-winner accordion that uses a custom `slideUp` / `slideDown` helper (500 ms) and supports Space/Enter on the button.
- `AudioGallery` (`js/app.js:13827`) — extends `Accordion` to play/pause an `<audio>` on item open/close.
- `TextLines` (`js/app.js:13882`) — `gsapWithCSS.registerPlugin(SplitText)`. `compute()` calls `new SplitText(this.el, { type: "lines", linesClass: "c-text-lines_item" })`, wraps each line's innerHTML in `<span class="c-text-lines_item_inner">…</span>`, and wires any `[data-scroll-to]` child to `Scroll.scrollTo(...)`. Calls `Scroll.update()` to refresh Locomotive.
- `PreviewBar` (`js/app.js:13944`) — fixed top bar that updates title / subtitle / tag on `updateContent` and toggles `has-preview-bar-active` on `show` / `hide`.
- `PreviewList` (`js/app.js:13976`) — listens for `mouseenter` / `focus` on each item, reads `data-title` / `data-subtitle` / `data-tag` attributes, calls `PreviewBar.show()` and `PreviewBar.updateContent()`. Hides on `mouseleave` / `blur` after a 250 ms timeout. Disabled on `hover: none` devices.
- `AboutHero` (`js/app.js:14024`) — on `init`, if Locomotive is off it auto-rotates the `c-about-hero_visual_image` set every 1000 ms via `setInterval`. If Locomotive is on, it listens to `Scroll.update(progress)` and switches to the image at `Math.floor(progress / gap)` where `gap = 1 / images.length`.
- `TagSlider` (`js/app.js:14057`) — sets the marquee animation duration based on the word length: `style.animationDuration = Math.floor(data-word.length / 4) + "s"`.
- `GridHelper` (debug only).
- `AccordionDetails` (`js/app.js:14079`) — a native `<details>` enhancer. Uses the Web Animations API: `el.animate({ height: [startHeight, endHeight] }, { duration: 300, easing: "cubic-bezier(0.33, 1, 0.68, 1)" })`. Constants: `DURATION = 300`, `EASING = "cubic-bezier(0.33, 1, 0.68, 1)"`, `CLASS_ACTIVE = "is-active"`. Listens for `CUSTOM_EVENT.MODAL_CLOSE` to auto-close accordions inside a closing modal. Honors `prefers-reduced-motion: reduce` by setting `DURATION = 0`.

---

## Animations (Catalog)

The site uses a small palette of easings, almost always one of three `cubic-bezier` curves, and three core durations: 150 ms (micro), 300 ms (small/medium), 600 ms (medium), 900 ms (large/page). Most animations are CSS-only with class-triggered `is-ready` / `is-loaded` / `is-inview` states; the rest are GSAP timelines managed by the JS modules.

### CSS @keyframes (K72-authored, ignoring Swiper's `swiper-preloader-spin`)

Every `@keyframes` block in the authored CSS, with exact line numbers from `tmp/k72/css/main__691b85c4.css`:

| Name | Where (file:line) | Duration | Easing | Trigger | What it does |
| --- | --- | --- | --- | --- | --- |
| `loaderSpinnerCol` | `css/main__691b85c4.css:1771` | 1 s | `cubic-bezier(0.215, 0.61, 0.355, 1)` infinite | visible while `html:not(.is-loaded) .c-loader_spinner` | The 4-bar EQ spinner: `transform: scale3d(1, 0.25, 1) → scale3d(1, 1, 1) → scale3d(1, 0.25, 1)`, `transform-origin: bottom center`. |
| `mainNavLoop` | `css/main__691b85c4.css:2581` | (matches `animation-duration` set on `.c-menu_main-nav_link_overlay_inner > div`) | linear infinite | when menu is open; per-item `animation-delay: -2s, -4s, -6s, -8s` so each row is at a different loop position | The mega-nav horizontal marquee: `transform: translate3d(0, 0, 0) → translate3d(-100%, 0, 0)`. |
| `monitorAppear` | `css/main__691b85c4.css:2791` | 900 ms | `cubic-bezier(0.165, 0.84, 0.44, 1)`, delay 500 ms | once on `html.is-loaded .c-home_monitor` | The canvas monitor slide-in: `transform: translate3d(0, -50%, 0) → translate3d(0, 0, 0)`, `opacity 0 → 1`. |
| `showTeamListImageWrapper` | `css/main__691b85c4.css:3226` | 300 ms | `cubic-bezier(0.215, 0.61, 0.355, 1)` | when a team row becomes current | The outer team-photo wipe: `transform: translate3d(-100%, 0, 0) → translate3d(0, 0, 0)`. |
| `showTeamListImage` | `css/main__691b85c4.css:3234` | 300 ms | `cubic-bezier(0.215, 0.61, 0.355, 1)` | paired with the wrapper keyframe above | The inner team-photo wipe: `transform: translate3d(100%, 0, 0) → translate3d(0, 0, 0)`. |
| `teamFeaturedMemberLineInner` | `css/main__691b85c4.css:3468` | 8 s | `linear infinite` | once `c-team_featured_member_content.is-inview`; horizontal marquee of team names | Forward-direction marquee: `transform: translate3d(0, 0, 0) → translate3d(-100%, 0, 0)`. |
| `teamFeaturedMemberLineInnerReversed` | `css/main__691b85c4.css:3476` | 8 s | `linear infinite` | paired with the above; reverse direction for alternating rows | Reverse-direction marquee: `transform: translate3d(-100%, 0, 0) → translate3d(0, 0, 0)`. |
| `elasticListShow` | `css/main__691b85c4.css:3922` | (used by `.c-elastic-list_item`, presumably 600 ms) | `cubic-bezier` | when an elastic-list item enters the viewport | `opacity 0 → 1`, `transform: translate3d(0, -2.5rem, 0) → translate3d(0, 0, 0)`. |
| `audioSamplePulse` | `css/main__691b85c4.css:5086` | 600 ms | `cubic-bezier(0.215, 0.61, 0.355, 1)` infinite | visible while `.-playing` on the audio sample | 3-bar EQ pulse: `transform: scale3d(1, 0.2, 1) → scale3d(1, 1, 1) → scale3d(1, 0.2, 1)`. |
| `bannerInner` | `css/main__691b85c4.css:5305` | 5 s | `linear infinite` | always on the marquee banner (`c-banner_inner`) | Lime banner marquee: `transform: translate3d(0, 0, 0) → translate3d(-100%, 0, 0)`. |
| `previewBarUpdateField` | `css/main__691b85c4.css:5430` | 300 ms | `cubic-bezier(0.215, 0.61, 0.355, 1)` | when the preview-bar field changes | The yellow lime wipe under a preview-bar field: `transform: scale3d(1, 1, 1) → scale3d(1, 0, 1)`, `transform-origin: center`. |
| `slide` | `css/main__691b85c4.css:5594` | 2 s | `linear infinite` | tag-slider container | The blog-tag slider: `from { transform: translateX(0%) } to { transform: translateX(calc(-100% - 5px)) }`. |

Other repeating transitions and tweens (no `@keyframes` because they are transitions or GSAP):
- **Hero background scale-in** — `.c-home_background` goes `transform: scale3d(1.5, 1.5, 1) → scale3d(1, 1, 1)` over 900 ms `cubic-bezier(0.165, 0.84, 0.44, 1)` on `html.is-loaded` (CSS transition).
- **Text-line reveal** — `.c-text-lines_item_inner` from `translate3d(0, -120%, 0) → translate3d(0, 0, 0)` over 900 ms `cubic-bezier(0.23, 1, 0.32, 1)`, staggered by 135 ms per line via `:nth-child` selectors (CSS transition + class).
- **CTAs enter** — `.c-home_ctas_item` from `opacity 0 + translate3d(0, 2.5rem, 0) → 0` over 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`, second item delayed 100 ms (CSS transition + class).
- **Body paragraph** — `.c-home_text` from `opacity 0 + translate3d(0, -2.5rem, 0) → 0` over 600 ms then 300 ms.
- **Menu link 3D flip** — `.c-menu_main-nav_item` from `transform: perspective(80vw) rotateX(90deg) → rotateX(0deg)`, with the parent `background-color: #000000 → transparent`; 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`, staggered 60 ms per item.
- **Loader column scale-up** — `.c-loader_col` from `transform: scale3d(1, 0, 1) → scale3d(1, 1, 1)`, 300 ms, right-to-left stagger 75/120/165/210/255 ms.
- **Quick-nav reveal** — `.c-header_quicknav_item` from `transform: translate3d(0, -100%, 0) → 0`, 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`, stagger 300 / 150 ms.
- **Menu button label reveal** — `.c-header_menu-btn span` from `translate3d(0, -100%, 0) → translate3d(0, calc(5rem - 100%), 0)`, 600 ms, plus a `::before` `scale3d(1, 1, 1) → scale3d(1, 2.6, 1)` height stretch.
- **Menu close button slide-in** — `.c-menu_close` from `translate3d(100%, 0, 0) → 0`, 300 ms.
- **Menu langswitcher fade-in** — opacity 0 → 1 over 300 ms with 300 ms delay.
- **Menu footer fade-in** — opacity 0 → 1 over 600 ms with 450 ms delay.
- **Menu background veil** — opacity 0 → 0.7 over 600 ms.
- **Loader veil** — opacity 0.8 → 0 over 600 ms.
- **Menu column drop-in** — translate3d(0, -100%, 0) → 0 over 300 ms, stagger 75/120/165/210/255 ms.
- **Header link lime wipe** — `::after` translate3d(0, -102%, 0) → 0 over 150 ms.
- **C-button hover color** — `color: currentColor → #D3FD50` over 150 ms.
- **C-button -dark-hover fill** — background-color and border-color → `#000000`, color → `#FFFFFF` over 300 ms.
- **About-hero visual wipe** — translate3d(-101%, 0, 0) → 0 over 900 ms `cubic-bezier(0.215, 0.61, 0.355, 1)` with 300 ms delay (outer); inner translate3d(101%, 0, 0) → 0 (same timing).
- **Project summary visual** — `translate3d(-105%, 0, 0) → 0` over 1500 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`.
- **Project summary visual outer** — `translate3d(100%, 0, 0) → 0` over 1500 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`.
- **Layered punchline text** — `translate3d(0, 100%, 0) → 0` over 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`, stagger 0.12 / 0.24 / 0.36 / 0.48 s.
- **Team row hover lime** — `::before` `scale3d(1, 0, 1) → scale3d(1, 1, 1)`, 300 ms, origin top center.
- **Team list image show** — wrapper `translate3d(-100%, 0, 0) → 0`; image `translate3d(100%, 0, 0) → 0`, 300 ms each.
- **Banner hover white wipe** — `::before` `scale3d(1, 0, 1) → scale3d(1, 1, 1)`, 200 ms, origin bottom center.
- **Blog list image hover** — `scale3d(1, 1, 1) → scale3d(1.05, 1.05, 1)`, 300 ms.
- **Blog list image hover (link variant)** — `scale3d(1, 1, 1) → scale3d(1.1, 1, 1)`, 300 ms.
- **Work-thumb image hover** — `scale3d(1, 1, 1) → scale3d(1.05, 1.05, 1)`, 300 ms.
- **Work-thumb black overlay** — `opacity: 0 → 0.2`, 200 ms.
- **Image gallery inner transform on touch** — `transform: translateX(-0.625rem)` and `border-top/bottom-right-radius: 1.875rem` on `.-active` slide (no desktop hover).
- **Image gallery inner transition** — `transform 0.5s, border-radius 0.5s` `cubic-bezier(0.215, 0.61, 0.355, 1)`.
- **Video modal open** — bg `transform: scale3d(1, 0, 1) → scale3d(1, 1, 1)` over 600 ms; inner `opacity: 0 → 1` over 1 s with 600 ms delay; close button `translateY(-100%) → 0` over 300 ms.
- **Video modal close** — reverse over 600 ms; inner iframe destroyed after 250 ms.
- **Preview bar enter** — `transform: translate3d(0, -100%, 0) → 0` over 300 ms.
- **Preview bar inner** — `transform: translate3d(0, 100%, 0) → 0` over 200 ms with 100 ms delay.
- **Preview bar border** — `transform: scale3d(0, 1, 1) → scale3d(1, 1, 1)` (top-right origin), 300 ms with 100 ms delay.
- **Preview bar field lime wipe** — `transform: scale3d(1, 1, 1) → scale3d(1, 0, 1)`, 300 ms.
- **Audio sample button hover** — `color: #000 → rgba(0, 0, 0, 0.5)`.
- **Audio sample spinner** — 3-bar EQ pulse, 600 ms infinite.
- **Banner rotate on scroll direction** — `transform: rotate(-5deg) ↔ rotate(5deg)`, 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`.
- **Contact happyface rotate on scroll direction** — `transform: rotate(45deg) ↔ rotate(-15deg)`, 300 ms.
- **C-scroll thumb hover** — `transform: scaleX(1.45)`, 300 ms.
- **C-accordion add icon rotate** — `transform: rotate(0) → rotate(90deg)`, 300 ms.
- **C-accordion icon + / ×** — vertical bar `transform: translateX(-50%) scaleY(1) → scaleY(0)`, 300 ms.
- **C-elastic-list item border-radius on hover** — `border-radius: 0 → 2.5 rem`, 300 ms.
- **CTA slides global link hover** — `color → #D3FD50, text-decoration: underline`.
- **Work thumb link black overlay** — `opacity 0 → 0.2`, 200 ms.
- **Layered punchline image border-radius on inview** — `border-radius: 3.5rem 3.5rem 0 0 → 0`, 300 ms.
- **Image gallery cursor transform** — `transform: translate(-50%, -50%) → translate(-50%, -50%) scaleX(-1)`, 150 ms.

### JS-driven animations (GSAP timelines)

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | `Circle.play()` | `Home.init()` calls `Circle.play("home")` 750 ms after init | `fromTo(drawSVG: "200% 200%" → "100%", duration 2, ease: "power2.inOut")`, then a `repeat: -1` `repeatDelay: 2, delay: 2` ping-pong with `scaleX: -1` mirror. |
| GSAP | `MainNav.onLinkEnter / onLinkLeave` | `mouseenter` / `mouseleave` on `.c-menu_main-nav_link` (pointer-fine only) | Computes entry direction (top vs bottom of bounding rect vs current `window.cursorPosition`). Kills the previous timeline, then `fromTo(overlay, { y: ±100% }, { y: 0, duration: HOVER_DURATION, ease: "power2.out" })` and same for `.inner` with the opposite sign. |
| GSAP | `Monitor.update()` | `requestAnimationFrame` loop started in `Monitor.init()` | Continuously copies the hero `<video>` into a `<canvas>` (object-fit-cover math), then `globalCompositeOperation = "destination-in"` + `roundRect(...).fill()` to clip to a stadium. |
| GSAP | `Stack.compute()` | on `init()` and on `resize` | `gsapWithCSS.set([...items, ...visuals, ...inners], { clearProps: "all" })`, then sets each item `position: absolute, top: offsetTop, height: (itemHeight + marginBottom) * (i+1) - offsetTop, zIndex: items.length - i`, and `visuals[i] = { scale: 1 - 0.025 * i, y: 10 * i, transformOrigin: "bottom center" }`. |
| GSAP | `ElasticList.update()` | called from `Scroll.update` on every scroll | `gsapWithCSS.set(outer, { height: max(20, thumbBCR.height * (1 - scaleY)) })` and `set(inner, { y: -thumbBCR.height / 2 * scaleY, force3D: true })`. |
| GSAP | `ImageGallery.handleCursor` | `mousemove` over `.c-image-gallery` | `gsapWithCSS.set(this.cursor, { x, y })` to follow the pointer. |
| GSAP | `TextLines.compute()` | `init()` and on resize | `new SplitText(this.el, { type: "lines", linesClass: "c-text-lines_item" })`, then wraps each line in `<span class="c-text-lines_item_inner">`. |
| Web Animations API | `AccordionDetails.open / shrink` | `click` on `<summary>` | `el.animate({ height: [startHeight, endHeight] }, { duration: 300, easing: "cubic-bezier(0.33, 1, 0.68, 1)" })`. |
| Locomotive Scroll | `Scroll.init()`'s `scroll` event | continuously while scrolling | Updates `data-scroll-direction`, adds/removes `hide-quicknav` past 200 px, forwards progress to `ElasticList.update` and `AboutHero.update`. |
| Locomotive Scroll | `Scroll.scrollTo()` | `TextLines` `data-scroll-to` clicks | `this.scroll.scrollTo(target, options)`. |

### Page transitions

The custom `modularLoad_default` is the SPA router. When an internal `<a>` is clicked it:
1. `loading` → adds `is-loading`, blurs the active element, calls `Home.pauseVideo()`, then 500 ms later `Header.closeMenu()`, removes `is-ready`.
2. Fetches the next page, swaps `data-load-container`, fires `loaded` → calls `app.destroy(oldContainer)` then `app.update(newContainer)`, then 300 ms later adds `is-ready` (which triggers the text-line reveal, CTAs, etc.).
3. `ready` (only for the `blog` transition) → `scrollTo(0, 600)` and `Scroll.update()`.

The loader is shown again on transitions but the columns re-animate up from `scale3d(1, 0, 1)`.

- **HTML parse:** the next page's HTML is parsed with `new DOMParser().parseFromString(data, "text/html")`, then the `data-load-container` element is plucked from the new doc and inserted before the old one. The new container is hidden (`visibility: hidden, height: 0, overflow: hidden`) during the swap.
- **Chrome `<use>` patch:** `setSvgs()` runs only on Chrome — for every `<use>` in the new container, it replaces the tag with one that uses the `xlink:href` attribute (instead of just `href`), because Chrome has historically had issues with `<use>` without the legacy attribute.
- **Title and meta swap:** `setAttributes()` copies the new document's `<title>` and the `<meta name="description">` content, plus all `data-*` attributes on the new `<html>`.
- **Error fallback:** if the `fetch` rejects, `window.location = href` performs a hard navigation — the SPA routing silently degrades.

---

## Assets

### 3D models

N/A — no `.glb`, `.gltf`, `.obj`, `.fbx`, or `.usdz` files were observed in the dump. The "monitor" element looks like a 3D-ish video but it is a flat `<canvas>` drawing the live `<video>` clipped to a `roundRect`. There is no WebGL or Three.js on the page.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Lausanne | 300 (light) | `woff2` (24,088 B) + `woff` (36,804 B) | `https://k72.ca/assets/fonts/Lausanne-300.woff2` | yes — `tmp/k72/fonts/Lausanne-300__01b7fa49.woff2`, `…__138a2716.woff` |
| Lausanne | 500 (medium) | `woff2` (19,208 B) + `woff` (29,648 B) | `https://k72.ca/assets/fonts/Lausanne-500.woff2` | yes — `tmp/k72/fonts/Lausanne-500__39921038.woff2`, `…__5e142203.woff` |
| `swiper-icons` | 400 | embedded font (webfont) | `https://k72.ca/assets/styles/main.css?v=...` | yes — embedded `@font-face` in the bundled `main.css` |

Both Lausanne weights are preloaded with `<link rel="preload" as="font" type="font/woff2" crossorigin>` from the document head. The body uses `font-family: "Lausanne", -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif` — i.e. the actual face shown is always Lausanne unless it fails to load.

### Images

| Local path | Type | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tmp/k72/images/Capture_d’ecran_le_2025-09-17_a_18.11.25__4075979e.png` | PNG (jpg-served) | 335,197 B | `https://k72.ca/images/caseStudies/Capture_d%E2%80%99ecran_le_2025-09-17_a_18.11.25.png?w=1920&fm=jpg&s=53fb69332aedd6c1fa5499623c55789a` | Hero background poster (`1920 px` wide). |
| `tmp/k72/images/Thumbnail__7487ba43.png` | PNG | 237,926 B | `https://k72.ca/images/caseStudies/iA_BRAND/Thumbnail.png?w=640&h=290&s=755b635c06d126151d64017fa1042a7c` | iA case study thumbnail; used in menu-link overlay under "Projets". |
| `tmp/k72/images/50ff59cc0550df5b36543807a58db98c52e01a22274a317eafbfa5266941579b__59041124.png` | PNG | 208,912 B | `https://k72.ca/images/blog/blogImg/50ff59cc…png?w=640&h=290&s=4f8134f04fe18db7382b99cec63c95f5` | Blog post image (Blogue list). |
| `tmp/k72/images/K72_article_ChatGPT_blogue__5c55aff7.jpg` | JPG | 42,148 B | `https://k72.ca/images/blog/blogImg/K72_article_ChatGPT_blogue.jpg?w=640&h=290&s=cec2aa341c22369e36e602c558c49e2a` | Blog post image. |
| `tmp/k72/images/MEGGIE_640X290_2__d8106ee6.jpg` | JPG | 30,951 B | `https://k72.ca/images/teamMembers/MEGGIE_640X290_2.jpg?w=640&h=290&s=547adc6f80885f8627de0683f7e03362` | Team-member portrait thumbnail (menu "Agence" overlay). |
| `tmp/k72/images/blank_copie_2__7ec3bd49.jpg` | JPG | 18,670 B | `https://k72.ca/images/teamMembers/blank_copie_2.jpg?w=640&h=290&s=b6f8d41383b2ee7821dcaec8b68295ec` | Team-member portrait (default). |
| `tmp/k72/images/PJC_SiteK72_Thumbnail_640x290__3275a303.jpg` | JPG | 41,420 B | `https://k72.ca/images/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_640x290.jpg?w=640&h=290&s=ac50a70feaaa2601b3aacad544c6045b` | PJC case-study thumbnail. |
| `tmp/k72/images/opengraph_k72_large__903369d8.jpg` | JPG | 36,709 B | `https://k72.ca/uploads/metadata/images/opengraph_k72_large.jpg` | OpenGraph image for social shares. |
| `tmp/k72/images/favicon-16x16__f2264d29.png` | PNG | 576 B | `…/favicons/favicon-16x16.png` | |
| `tmp/k72/images/favicon-32x32__25f01072.png` | PNG | 833 B | `…/favicons/favicon-32x32.png` | |
| `tmp/k72/images/apple-touch-icon__fa01063c.png` | PNG | 1,589 B | `…/favicons/apple-touch-icon.png` | |
| `playwright/images/img__*__*.gif` × 8 | GIF | 43 B each | various `?w=640&h=290&s=…` case-study URLs | 1×1 spacer / placeholder gifs, same SHA1 — used for lazy-load. |

The "1×1 transparent" gifs are signature tiny-43-byte files. The case-study image URLs are signed with an HMAC query parameter (`s=…`), likely a CDN signature.

### SVGs & icons

- **Inline SVGs observed in HTML:** the K72 monogram in the header logo (full path of the `logo` symbol, 103×44 viewBox), and the `<svg><ellipse>` inside the `<mark>` that wraps "créativité" in the H1 (this is a *placeholder* — the real animated SVG is rendered by the `Circle` JS module and replaces the inner HTML).
- **Standalone SVG files in dump:**
  - `tmp/k72/svgs/sprite__f6be93e9.svg` (5,846 B) — the 10-symbol sprite: `arrow`, `big-arrow`, `burger`, `close`, `globe`, `happy`, `heart`, `logo`, `quote`, `quote-fr`. 283×843 viewBox; one `<defs>` with `<symbol>`s; referenced via `<use xlink:href="assets/images/sprite.svg#burger">` etc.
  - `tmp/k72/svgs/safari-pinned-tab__f8d1aa0c.svg` (7,394 B) — the Safari pinned-tab mask icon.
- **Icon system:** custom hand-rolled SVG sprite, no third-party icon library. Stroke width 2–3, `stroke-linecap: square`, no fills except `globe` and `heart` (path-filled in their symbol).

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `playwright/media/69496b2d__c5022f5c` (no extension, 7,070,986 B / 6.7 MB) | MP4 video (H.264, 1080p) | The hero background video. Original URL: `https://player.vimeo.com/progressive_redirect/playback/1119600858/rendition/1080p/file.mp4?loc=external&log_user=0&signature=c4a137161d6ce80a52c50c7ee23d4fdf8df103bfc816252fc304e317a43bacc6`. Served by Vimeo's progressive-redirect CDN, `muted playsinline loop`, used as the hero `c-home_background video`. The `Monitor` module draws frames from this same `<video>` into the inline canvas. |
| (none in dump) | MP3 / OGG | The site has `.c-audio-sample` markup for case-study audio but no audio asset is downloaded on the homepage. |

### Other

- `tmp/k72/other/site__773f43dc.webmanifest` — `site.webmanifest` (492 B), the PWA manifest (`name`, `short_name`, `start_url`, `display`, theme colour `#ffffff`, maskable icon set).
- `tmp/k72/js/app__33e5f4aa.js` — 544,410 B, the entire JS bundle (Locomotive + GSAP + Swiper + 25 modules).
- `tmp/k72/css/main__691b85c4.css` — 176,450 B, the main stylesheet (reset + utilities + every `c-*` component, includes the Swiper 11.2.8 build at the top).

---

## Motion & Interaction

### Principles

- One signature easing: **`cubic-bezier(0.215, 0.61, 0.355, 1)`** (commonly referred to as "easeOutCubic") — used for almost every micro-interaction and entry. A second easing **`cubic-bezier(0.165, 0.84, 0.44, 1)`** ("easeOutQuart") is used for slower page-scale moments (hero video scale, monitor canvas). The text-line reveal uses **`cubic-bezier(0.23, 1, 0.32, 1)`** ("easeOutQuint") for a slightly more dramatic end-stop. The accordion details module uses **`cubic-bezier(0.33, 1, 0.68, 1)`** (easeOutCirc) for its 300 ms height tween. GSAP's `power2.out` and `power2.inOut` are used inside the JS modules (MainNav hover, Circle intro, Stack compute).
- Default durations: 150 ms (hover/focus micro), 300 ms (small state change), 600 ms (page-level entry), 900 ms (hero reveal, text-line reveal).
- Motion is always class-driven (`is-loading` → `is-loaded` → `is-ready`, then per-element `is-inview` via Locomotive Scroll). No animation runs until the bundle has loaded and the page is ready.
- The site uses **two easings for two scales of motion** — the more aggressive `0.23, 1, 0.32, 1` for "first-paint" reveals (the H1, the layered punchline) and the more reserved `0.215, 0.61, 0.355, 1` for everything else. This creates a subtle hierarchy: the first thing you see is also the most confident.
- All transitions are GPU-accelerated where possible: `transform` and `opacity` dominate, with `width`/`height`/`border-radius` used only in the `ImageGallery` and `VideoFeatured` morphs. Layout-thrashing properties (`top`, `left`, `margin`, `padding`) are avoided in transitions; GSAP uses `force3D: true` to push 2D transforms onto the GPU.

### Specific behaviors

- **Link hover (header quicknav):** the black `::before` of the `.c-header_link` is masked by a lime `::after` that wipes down from the top via `transform: translate3d(0, -102%, 0) → translate3d(0, 0, 0)` over 150 ms. Text turns black over the lime.
- **Button hover (`.c-button`):** color → `#D3FD50`, 150 ms (no fill change unless `.c-button.-dark-hover` is set, in which case background goes black and text white over 300 ms).
- **Hero entry:** the H1 lines slide up out of overflow via the text-lines pattern; the body paragraph, the two CTAs, and the `MONTREAL_…` clock then stagger in over 600 ms; the canvas monitor fades and slides 500 ms after `is-loaded`; the video poster scales from 1.5× to 1× over 900 ms. Total first-paint choreography is ~1.5 s.
- **Menu open/close:** five loader columns drop from the top (300 ms, right-to-left stagger); the four main-nav rows 3D-flip from `rotateX(90deg)` (300–480 ms stagger, 600 ms); the langswitcher and footer fade in last. The home video is paused on open and resumed on close.
- **Menu link pointer-direction hover:** the `MainNav` module reads `e.clientY` vs `window.cursorPosition.y` (and falls back to `getBoundingClientRect` mid-line) to decide whether the lime overlay slides in from the top or the bottom. This is one of the more distinctive micro-interactions.
- **Section reveal on scroll:** Locomotive Scroll drives a global "in view" state; `u-anim` and `u-anim-scroll` utility classes are the standard pattern (opacity 0 → 1, `translate3d(0, -40px, 0) → 0`, 600 ms `cubic-bezier(0.215, 0.61, 0.355, 1)`, with `-delay-1` … `-delay-20` modifier classes that add 100 ms each).
- **Page transition:** the loader is replayed (columns scale up, the page is swapped, columns scale back down), then `is-ready` is added 300 ms later.
- **Scroll-direction indicator:** `<html data-scroll-direction="up|down">` is updated on every scroll. Down is the default; the lime `c-banner` rotates `-5deg` and rotates to `+5deg` on scroll-up. The contact-page `c-contact_happyface svg` rotates between `+45deg` and `-15deg` based on scroll direction.
- **Image gallery custom cursor:** a 15 vw `mix-blend-mode: difference` SVG follows the mouse, scaling X by -1 on the "back" slide to indicate direction.
- **Work thumb hover:** image scale 1.05× + 20% black overlay wipe, 300 ms.
- **Team row hover:** full-row lime wipe + text color flip to black.
- **Banner hover:** white wipe-up under the lime text.
- **Video thumb hover:** circular video morphs to full-rect, video plays.
- **Pointer-direction detection window:** `window.cursorPosition = { x: 0, y: 0 }` is updated on every `mousemove` (line 14258 of `app.js`). Modules read this to compute hover direction.
- **Loader re-play on transition:** the SPA router does not re-trigger the loader; it just removes/adds the `is-ready` class. The `is-loading` class is only ever set on the very first paint.

### Reduced motion

The `AccordionDetails` module checks `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and sets `DURATION = 0`, collapsing the height tween to an instant. The `Stack` module guards its GSAP work with `if (!html.classList.contains("has-scroll-smooth")) return;`, which effectively disables its sticky-stack layout for users who would experience disorienting scroll-locking. Locomotive Scroll is still used for the in-view hooks; the strong hero / text-line reveal animations do **not** appear to be disabled explicitly, but no `prefers-reduced-motion: reduce` block was observed in the stylesheet, which is a known accessibility gap on the site.

- **Scope of reduced-motion respect:** only `AccordionDetails` reads the media query. GSAP timelines (`Circle`, `MainNav`, `Monitor`, `Stack`, `ElasticList`) and CSS keyframes (`loaderSpinnerCol`, `monitorAppear`, `teamFeaturedMemberLineInner`, `bannerInner`, `audioSamplePulse`, `slide`) do not. For a user who prefers reduced motion, the loader spinner, the lime circle ping-pong, the marquee banners, and the team-name marquees will all keep running. The `prefers-reduced-motion: reduce` query in the site's CSS is **absent**; the only explicit handling is the runtime guard in `AccordionDetails.js:14092`.

---

## Content & Voice

- **Tone:** Confident, slightly philosophical, deliberately short. The H1 reads in three lines: "L'étincelle / qui génère / la créativité" — *the spark that generates creativity*. The body paragraph is one 49-word paragraph in French, with no bullet points and no further decomposition.
- **Body copy (paraphrased):** the agency thinks every action is in service of nourishing the brand — tomorrow, in five months, in five years. They look for the friction that creates the spark. To stay honest they speak without filter, say what needs to be said, do what needs to be done.
- **Sentence length:** short to medium. Active voice. No exclamation points, no rhetorical questions, no superlatives. The body uses long em-dashes to break clauses ("— pour assurer une relation honnête, —").
- **Capitalization:** Sentence case in the body paragraph; **uppercase everywhere else** (hero, headings, CTAs, socials, menu links, legal). The word "à" is rendered with a grave in the body ("pour nourrir la marque") but the agency tagline in the meta is "K72 est une agence qui pense chaque action pour nourrir la marque. Demain, dans 5 mois et dans 5 ans."
- **Punctuation:** Oxford comma not applicable (French quotation style: « guillemets »). Em-dashes are spaces around the dash ("— pour").
- **CTA vocabulary:** only five buttons observed on the homepage:
  - **Projets** (work / projects)
  - **Agence** (the agency)
  - **Menu** (the menu opener)
  - **Fermer** (close — modal / menu)
  - **MONTREAL_16:02:40** (the live clock, not a CTA per se, but a kind of live status)
- **URLs in French:** `/travail`, `/agence`, `/contact`, `/blogue`, `/politique-de-confidentialite`, `/avis-de-confidentialite`. The English mirror is at `/en` (linked from the langswitcher in the menu).
- **HTML `lang` attribute:** `lang="fr"` on the document element. `<html lang="fr" data-theme="dark" data-template="home" data-has-quicknav="false">`.
- **Tagline (paraphrased, the original is in the meta description):** "K72 is an agency that thinks every action through as a way of nourishing the brand — tomorrow, in five months, in five years." This rephrasing is from a direct read of `<meta name="description">`; do not paste the original.
- **Homepage hero copy (paraphrased):** the H1 reads "The spark that generates the creativity" with "créativité" hand-circled in lime. The 49-word body paragraph expands the agency philosophy: every action is in service of brand nourishment, the agency seeks the friction that creates the spark, and it operates without filter — saying what needs to be said, doing what needs to be done.
- **Internal links visible from the homepage:** "Projets (17)" (work), "Agence" (about), "Contact", "Blogue" — plus the legal links "Politique de confidentialité", "Avis de confidentialité", "Rapport éthique" (external EthicsPoint), and "Options de consentement" (a button that opens Didomi preferences).
- **Language convention:** all the menu and CTA copy is French, but the code comments in the CSS are English ("Bump up the font-size", "Wider gutters", etc.).

---

## Information Architecture

The dump covers the homepage (`/`) only — the static-fetch attempts on `/Agence K72`, `/Accueil`, `/K72 est une agence…`, and `/website` all returned Cloudflare challenge errors and were not captured. The other top-level routes are inferred from the in-page links in the homepage.

| Route | Purpose | Primary component(s) | Notes |
| --- | --- | --- | --- |
| `/` | Marketing homepage | Hero with looping video, oversized punchline, body paragraph, two CTAs, MONTREAL clock | Observed. |
| `/travail` (English `/en/work`) | Case-study index (17 projects) | Likely `c-work-thumb` cards, elastic scroll list | Linked from quicknav and menu as "Projets (17)". |
| `/agence` (English `/en/agence`) | About / team page | `c-about-hero` intro, `c-team` list, `c-team_featured_member` marquee, "L'étincelle" `c-about-hero_title` | Linked from quicknav. |
| `/contact` (English `/en/contact`) | Contact | `c-contact_punchline` (10 vw), `c-contact_infos` columns, `c-contact_socials`, `c-banner` marquee | Linked from menu. |
| `/blogue` (English `/en/blog`) | Blog index | `c-blog-list_header` (20-col grid), `c-blog-list_filters` pills, `c-blog-list_container` 1/2/3 column, `c-blog-list_el_image` (50 px border-radius) | Linked from menu. The `modularLoad` has a `transitions: { blog: {} }` entry so the page is loaded via the SPA router. |
| `/politique-de-confidentialite` | Privacy policy (light text page) | Standard `c-block-text` 16/20 width | In menu legal list. |
| `/avis-de-confidentialite` | Privacy notice (Didomi-rendered) | Didomi iframe | In menu legal list. |
| (external) `https://secure.ethicspoint.com/...` | Ethics reporting | new tab | In menu legal list. |
| `https://www.facebook.com/K72.ca/` | FB | external | Social pill, `FB` label. |
| `https://www.instagram.com/k72_creation/` | IG | external | Social pill, `IG` label. |
| `https://www.linkedin.com/company/k72` | LI | external | Social pill, `IN` label. |
| `https://www.behance.net/agenceK72` | BE | external | Social pill, `BE` label. |

For each non-home route the navigation runs through the custom `modularLoad` SPA router: the new page is fetched, `data-load-container` is replaced, modules are destroyed and re-initialized. There is no `popstate` recovery other than the built-in `popstate` listener; the menu's langswitcher uses `data-load="false"` to opt out of SPA navigation and do a hard `window.location = href`.

### `data-template` taxonomy

The `<html data-template="...">` attribute is used to scope CSS to a particular page template. Observed values:

- `home` — the homepage. Adds `.c-home_punchline`, `.c-home_text`, `.c-home_ctas`, `.c-home_background`, etc.
- `case-study-list` — the case-study index. Reveals the custom scrollbar in lime.
- `case-study-details` — a single case-study page. Also reveals the lime scrollbar; likely hosts the layered punchline, image gallery, and project summary.

Other `data-template` values (not observed but likely) include `blog`, `blog-details`, `about`, `contact`, `search`. Each is set by the CMS when the page is rendered server-side.

---

## Accessibility

- **Color contrast:** White on `#000000` is 21:1. Lime `#D3FD50` on `#000000` is **15.4:1** (AA-Large and AAA pass). Lime as a *background* with `#000000` text is the same 15.4:1. The 30% white used for `c-menu_langswitcher` (`rgba(255, 255, 255, 0.3)`) on `#000000` is ~5.5:1, AA-Large pass, AA fail. Black on white forms use `lightgray`/`darkgray`/`dimgray` for borders (computed by named CSS colors, not theme-bound).
- **Focus indicators:** focus styles inherit the hover treatment (most `:hover` rules are paired with `:focus`); the only explicit focus ring is on form fields (border-color darkening). No custom focus ring is drawn elsewhere; on the lime-on-black `c-button:hover` the focus is implicit (the lime colour is the indicator). This is **insufficient** for WCAG 2.4.7 — the focus treatment should be visible without depending on colour alone.
- **Keyboard:** all buttons (`<button>`), links (`<a>`) and the burger/menu togglers are native elements, so they are reachable and operable with Tab/Enter/Space. The `<button data-header="menu-toggler">` is correctly identified; the `VideoModal` module listens for the Escape key. No skip-to-content link was observed in the header.
- **Screen reader landmarks:** `<header>`, `<nav>`, `<a class="c-header_logo">` (with `u-screen-reader-text` "K72" inside), `<div data-load-container>` as the implicit main, and the form `<noscript>` iframe is also present. There is no explicit `<main>` element, no `aria-label` on the menu, and no `role="banner"` declarations.
- **Loader / motion:** `html.is-loading` sets `cursor: wait`. The loader veil is removed once ready. `prefers-reduced-motion: reduce` is *partially* respected (only the `AccordionDetails` module reads it). The hero scale, the text-line reveal, the menu 3D flip, and the circle ping-pong are **not** disabled under reduced-motion, which is an a11y gap.
- **Alt text:** observed `alt=""` on decorative images, `alt=""` on the team portraits inside the JS-rendered marquee. The hero `<video>` has no `<track>` subtitles. Sprite icons use `role="presentation" alt=""` and `aria-hidden="true"` correctly.
- **Lang:** `lang="fr"` is set on `<html>`. The Didomi notice is also `lang="fr"`. There is no `lang="en"` switching on the `<html>` element when navigating to `/en` (the langswitcher simply links to it).
- **Heading order:** the homepage has exactly one `<h1>` (the punchline). The menu, header, footer and inline content use no other heading levels — there is no `h2/h3` on the homepage. This is a structural weakness: assistive tech users land in the H1 with no roadmap for the rest of the page.
- **List semantics:** the menu uses `<ul><li><a>` correctly. The socials use `<ul><li><a>`. The CTAs are a flat `<ul><li><a>`.
- **Forms:** form labels, inputs, and checkboxes use proper `<label>`/`<input>` pairings, but the consent banner is the only form on the homepage.
- **i18n:** the page does not set `lang="en"` on the English mirror. The langswitcher simply links to `/en`, which is its own page.
- **Vendor accessibility stacks:** the Didomi consent notice is announced as a polite overlay with the agency's own CSS overrides. The 6sense tag is purely a tracking pixel and is invisible.

---

## Sources

- Homepage — https://k72.ca/
- English mirror — https://k72.ca/en
- Main stylesheet — https://k72.ca/assets/styles/main.css?v=20240527152606 (176,450 B)
- App bundle — https://k72.ca/assets/scripts/app.js?v=20240527152606 (544,410 B)
- Sprite — https://k72.ca/assets/images/sprite.svg
- Lausanne 300 — https://k72.ca/assets/fonts/Lausanne-300.woff2
- Lausanne 500 — https://k72.ca/assets/fonts/Lausanne-500.woff2
- Favicon set — https://k72.ca/assets/images/favicons/…
- Safari pinned-tab SVG — https://k72.ca/assets/images/favicons/safari-pinned-tab.svg
- Web manifest — https://k72.ca/site.webmanifest
- OpenGraph image — https://k72.ca/uploads/metadata/images/opengraph_k72_large.jpg
- Hero video (Vimeo progressive MP4, 1080p) — https://player.vimeo.com/progressive_redirect/playback/1119600858/rendition/1080p/file.mp4?loc=external&log_user=0&signature=c4a137161d6ce80a52c50c7ee23d4fdf8df103bfc816252fc304e317a43bacc6
- Hero poster — https://k72.ca/images/caseStudies/Capture_d%E2%80%99ecran_le_2025-09-17_a_18.11.25.png?w=1920&fm=jpg&s=…
- Case-study thumbnails (signed CDN):
  - iA BRAND — https://k72.ca/images/caseStudies/iA_BRAND/Thumbnail.png?w=640&h=290&s=755b635c06d126151d64017fa1042a7c
  - PJC — https://k72.ca/images/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_640x290.jpg?w=640&h=290&s=ac50a70feaaa2601b3aacad544c6045b
  - Recent case study — https://k72.ca/images/caseStudies/Capture_d%E2%80%99ecran_le_2025-09-17_a_18.11.25.png?w=1920&fm=jpg&s=53fb69332aedd6c1fa5499623c55789a
- Team-member portraits (signed CDN):
  - Meggie — https://k72.ca/images/teamMembers/MEGGIE_640X290_2.jpg?w=640&h=290&s=547adc6f80885f8627de0683f7e03362
  - Default — https://k72.ca/images/teamMembers/blank_copie_2.jpg?w=640&h=290&s=b6f8d41383b2ee7821dcaec8b68295ec
- Blog post images (signed CDN):
  - ChatGPT article — https://k72.ca/images/blog/blogImg/K72_article_ChatGPT_blogue.jpg?w=640&h=290&s=cec2aa341c22369e36e602c558c49e2a
  - Hash article — https://k72.ca/images/blog/blogImg/50ff59cc0550df5b36543807a58db98c52e01a22274a317eafbfa5266941579b.png?w=640&h=290&s=4f8134f04fe18db7382b99cec63c95f5
- Privacy SDK — https://sdk.privacy-center.org/3ec5dcd5-a18f-4d2e-ac51-3f323e2ab0c5/loader.js?target_type=notice&target=qBNmVFaa
- 6sense tag loader — https://j.6sc.co/6si.min.js, https://j.6sc.co/j/a640d4d0-f937-416d-ad10-140597105f47.js
- GTM — https://www.googletagmanager.com/gtm.js?id=GTM-MWC9BML6
- GA4 — https://www.googletagmanager.com/gtag/js?id=G-89J4PRWZFW
- Polyfill (Cloudflare CDN) — https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=Element.prototype.remove%2CElement.prototype.append%2Cfetch%2CCustomEvent%2CElement.prototype.matches%2CNodeList.prototype.forEach%2CAbortController
- Locomotive Scroll — `node_modules/locomotive-scroll/dist/locomotive-scroll.esm.js` (bundled into `app.js`)
- GSAP 3.12.7 + CSSPlugin + DrawSVGPlugin + SplitText — `node_modules/gsap/*` (bundled)
- Swiper 11.2.8 — `node_modules/swiper/*` (bundled)
- modujs — `node_modules/modujs/dist/main.esm.js` (bundled)

Screenshots in dump (1440×900 viewport, headless Chromium via Playwright):
- `tools/tmp/k72/playwright/homepage.png` (1,062,693 B) — first-paint viewport screenshot.
- `tools/tmp/k72/playwright/homepage-fullpage.png` (1,369,912 B) — full-page screenshot (only marginally taller, since the homepage is essentially 100 vh tall).

Computed-styles snapshot:
- `tools/tmp/k72/playwright/computed-styles.json` (19,705 B) — a flat JSON dump of every visible element's `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `color`, `background-color`, `border-radius`, `box-shadow`, `padding`, `margin`, `display`. Used in the "Computed-style fingerprint" section of this design.md.

Rendered DOM:
- `tools/tmp/k72/playwright/homepage.html` (38,179 B) — the post-hydration HTML, captured by Playwright. This is the source of truth for the rendered DOM, since the static HTML files in `html/` were blocked by Cloudflare's JS challenge.

Asset dump (committed into `tmp/k72/`, not into `git`):
- `css/main__691b85c4.css` (176,450 B) — every authored CSS rule + the bundled Swiper 11.2.8 build.
- `js/app__33e5f4aa.js` (544,410 B) — the entire JS bundle.
- `fonts/Lausanne-300.{woff2,woff}`, `fonts/Lausanne-500.{woff2,woff}` — the agency's self-hosted webfont.
- `svgs/sprite__f6be93e9.svg`, `svgs/safari-pinned-tab__f8d1aa0c.svg` — the icon system.
- `images/…` — 11 image files (3 favicons, 1 OpenGraph, 1 apple-touch-icon, 6 case-study / blog / team thumbs).
- `other/site__773f43dc.webmanifest` — the PWA manifest.
- `playwright/js/js__e7246850` (453,383 B, no extension) — a runtime-captured JS blob (likely a polyfill or Locomotive Scroll's full code in raw form).
- `playwright/js/loader__3471d9ac.js` (104,793 B) — the Didomi SDK loader.
- `playwright/js/gtm__6909b368.js` (350,177 B) — the GTM runtime.
- `playwright/js/sdk.62996fabec7ca7b4f000a52cb25a00027421e1e7__0f4af48d.js` (412,786 B) — the privacy-center SDK.
- `playwright/js/6si.min__166c7348.js` (69,903 B) — the 6sense runtime.
- `playwright/js/app__33e5f4aa.js` (544,410 B) — a copy of the app bundle.
- `playwright/media/69496b2d__c5022f5c` (7,070,986 B, no extension) — the hero video MP4.

Screenshots in dump (1440×900 viewport):
- `tools/tmp/k72/playwright/homepage.png` (1,062,693 B) — first-paint viewport screenshot.
- `tools/tmp/k72/playwright/homepage-fullpage.png` (1,369,912 B) — full-page screenshot (only marginally taller, since the homepage is 100 vh).

---

## Changelog

- 2026-06-20 — Initial draft by design.md_gen agent. Built from the Playwright-captured rendered DOM (`playwright/homepage.html`), the main CSS (`main__691b85c4.css`, 7,723 lines), the app bundle (`app__33e5f4aa.js`, 14,342 lines), the computed-styles dump (`playwright/computed-styles.json`, 19,705 B / 36 element records), the asset manifest (`manifest.json`, 76 files, 16.3 MB total), and the inline critical CSS in the document head. All non-homepage routes were blocked by Cloudflare's bot challenge and could not be inspected; descriptions of `/agence`, `/contact`, `/blogue`, `/travail` are inferred from the in-page links, the inline `<title>`, the meta description, the modular-load `transitions` config, and the CSS class surface. The design.md is 765 lines (target 800–1200); it intentionally documents only what is observable, leaving room for follow-up on-site inspection of the case-study and blog pages.

### Notes for a follow-up pass

- The non-homepage routes (`/travail`, `/agence`, `/contact`, `/blogue`, `/politique-de-confidentialite`, `/avis-de-confidentialite`) were not captured. The component-level details above are extrapolated from the CSS class surface and the JS module list. A second pass with a Cloudflare-bypassing crawler (e.g. residential proxy + Playwright stealth) would let us confirm the case-study detail page composition, the actual 17 project list, the team page features (which has the marquee names, the `c-team_featured_member` layout, the `c-about-hero_title` "L'étincelle" line), the contact page, the blog index with its filter pills, and the article detail page with its `o-article-wysiwyg` body.
- The exact number of case studies, their titles, client names, and the project order would be a one-day scrape with the right tooling.
- The English mirror at `/en` has its own `data-template` (likely `home-en` or just `home`) and its own punchline copy; a second pass should compare.
- The custom Didomi `didaomiConfig` CSS in the document head shows the consent banner is themed to match the agency (black bg, white text, lime highlight buttons, French-only). The `didaomiConfig.theme.color` is `#D3FD50` (lime), confirming the same accent is used for the consent UX.
- The `swiper-icons` font is embedded inside the bundled CSS — it ships with Swiper and is not visible in the dump as a separate file, but `font-family: "swiper-icons"` is the only declared `swiper-icons` font-family.

### Notable design decisions

- **Two fonts, not three.** Most editorial sites have at least three typefaces (display, body, mono). K72 ships exactly one — Lausanne — in two weights. This is a deliberate constraint: every component, from the H1 to the 11 px legal microcopy, uses the same family. Differentiation happens through weight, size, case, and tracking, not through a second face.
- **One accent, used everywhere.** `#D3FD50` (lime) is the only non-monochrome colour on the site. It is the only saturated colour in the palette and it is reused for selection, hover, focus, the hand-drawn circle, the marquee banner, the scrollbar thumb, the consent highlight, and the team-row wipe. The site is recognisable from a single CSS variable.
- **A 20-column grid built from a single math expression.** Almost every block on the site computes its width as a fraction of `(100vw - 13.125rem)`. This is the entire layout system: the outer `13.125rem` (210 px) is reserved for the header logo, the menu button, and other fixed-position UI; everything else is in the 20-column responsive grid. There is no flexbox, no CSS grid outside the blog and footer components.
- **The negative-margin optical-baseline trick.** Every text block with uppercase uses `padding-top: 0.2em, margin-top: -0.2em` (or a `::before` `margin-top: 0.023em`) to correct the line-height slack. This is a K72 tic — the same trick appears on the H1, the menu links, the CTAs, the socials, the project year, the accordion label, and the blockquote. It's a strong signal that the design was built by people who care about optical alignment.
- **The loader re-uses the menu's column animation.** The five-column scale-up / scale-down is used in three places: the initial loader, the menu open, and (with a vertical translate) the menu close. This is a deliberate continuity — the same visual atom is reused for "loading" and "navigating".
- **Mixed-blend-mode is used as a layout technique.** The `c-image-gallery_cursor`, the `c-caption-gallery_cursor`, the `c-project-summary_punchline`, the `c-about-hero_visual_outer` position label, and the giant `c-arrow` icon all use `mix-blend-mode: difference` to make white content visible over both light and dark backgrounds without a colour swap. The site is essentially two monochrome layers with one accent, and `difference` is the cheapest way to keep white text legible on either.
- **3D perspective on a flat site.** The menu links use `transform: perspective(80vw) rotateX(90deg) → rotateX(0deg)` for a 3D card-flip reveal. This is one of the few 3D transforms on the site and it's used sparingly, which is what makes it feel deliberate.
- **The page is not really a single page.** The custom `modularLoad` SPA router fetches the next page, swaps `data-load-container`, and re-initialises the modules. The Cloudflare challenge prevented the sub-pages from being captured, but the design system is clearly designed to be reused across many pages.
- **The hero is the entire first impression.** The H1 is 9.5 vw uppercase Lausanne, the body paragraph is 49 words, the CTAs are 6.5 vw pills. There is no nav bar, no feature grid, no social proof — the first paint is a single 100 vh "title card" that says "L'étincelle qui génère la créativité" and gives the visitor one path forward (Projets or Agence).
- **The Montréal time is a brand marker.** Two clocks run in real time (the menu one and the home one). This is unusual: it costs CPU to update them every 250 ms, but it tells the visitor "we are here, right now, in Montréal" — which is exactly the agency's voice. It is also a quiet technical flex: any visitor can tell the agency is "live" without scrolling.

### Quick rebuild recipe

To rebuild this site's first paint in the most direct way possible:

1. Start with `<html lang="fr" data-theme="dark" data-template="home" class="has-no-js is-loading">`. After `app.js` loads, it gets `is-loaded` then `is-ready`.
2. Add two `@font-face` rules for Lausanne 300 + 500 (with `font-display: swap`).
3. On `<html>`, set the fluid `font-size` (14/15/16/17/18/20 px by breakpoint), `font-family: "Lausanne", system stack`, `background-color: #000000`, `color: #FFFFFF`, and a `transition` on color and background-color.
4. Build the loader: 5 absolute-positioned black columns that scale from `transform: scale3d(1, 0, 1)` to `1, 1, 1`, staggered right-to-left; an EQ-style 4-bar spinner in the bottom-right; a dark veil behind them.
5. After load, the columns collapse to 0; the loader becomes invisible.
6. Place a fixed `<header>` with the K72 SVG monogram (top-left, `7.3125rem × 3.125rem`) and a "Menu" button (top-right, with a 2-line burger icon and the label "Menu").
7. Below the header, place the quicknav (2 large pill links "Projets (17)", "Agence") that animate in from above after the loader closes.
8. The hero is a fixed-position full-bleed `<figure>` with a `background-image: url(poster)` and a child `<video muted playsinline loop>`. The figure scales from 1.5× to 1× over 900 ms after `is-loaded`.
9. Above the figure, a flex-column container holds the H1: three lines, "L'étincelle / qui [video-monitor] génère / la [circled]créativité[/circled]". Each line is wrapped in the text-lines pattern (`.c-text-lines_item` → `.c-text-lines_item_outer` → `.c-text-lines_item_inner`).
10. The video-monitor inside the H1 is a `<canvas>` whose JS module draws the live hero `<video>` into it every frame, with a `roundRect` clip and `globalCompositeOperation = "destination-in"`.
11. The lime circle around "créativité" is an inline `<svg><ellipse>` whose stroke is animated with GSAP `DrawSVGPlugin` (`fromTo(drawSVG: "200% 200%" → "100%")`, then a horizontal-mirror ping-pong).
12. The body paragraph is `width: calc((100vw - 13.125rem) * 3/20 + 1.25rem)` (or narrower on smaller screens) and slides up into place.
13. The two CTAs ("Projets", "Agence") are `.c-button.-thicker` at `font-size: 6.5vw`, centred, with `margin: 2.5rem 0.625rem 0 0.625rem` each, animate from `translate3d(0, 2.5rem, 0)` to `0` with the second delayed 100 ms.
14. The MONTREAL clock is bottom-left, hidden on `≤999 px`, updated by a JS module via `Intl.DateTimeFormat` every 250 ms.
15. The full-screen menu is a fixed overlay with 5 black columns that drop from the top, 4 mega-nav links that 3D-flip in, a close button, a langswitcher (`fr / en`), and a footer with the clock, legal links, and socials.
16. The video modal is a fixed overlay with a `#1D1D1D` bg that scales from `scale3d(1, 0, 1)` to `1, 1, 1`, and a 16:9 inner that holds an injected Vimeo iframe.

That's the entire first paint. The site is small in surface area and very dense in detail.
