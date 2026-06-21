# Oui Will — design.md

> A structured design specification of **https://ouiwill.com**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** MiniMax-M3
> **Source dump:** `tools/tmp/ouiwill/` (gitignored)

---

## Overview

Oui Will positions itself as a "Digital. Brand. Accelerator." — a creative
agency whose pitch is that good design drives measurable valuation. The
site is a single-page-ish Web Component application that ships a flat
black-on-white typographic canvas, an oversized editorial H1, a
case-study index, and a long editorial scroll. The visual language is
deliberately minimal — a single self-hosted display family, one
monochrome theme that flips by section, one caret-like "→" micro-icon
repeated as the only real decoration — and most of the design effort
goes into typography (very tight tracking, a `letter-split` engine that
randomizes per-character entry/exit blinks), full-bleed hero video, and
scroll-driven reveal choreography. There is no design system framework,
no Tailwind, no Bootstrap, no Three.js, no GSAP — the entire frontend is
~240 KB of vanilla JavaScript implementing a custom Web Component
framework plus a homegrown atomic-CSS engine called "UtilityCSS".

The homepage is treated as a portfolio pitch: black opening with the
brand's wordmark plus a giant H1, an embedded showreel, an editorial
intro ("Since 2013..."), a logo wall of past clients (Rivian, Oura,
Rappi, Moxion, etc.), a 3-up case-study grid, a 60+ awards block, a
news feed, and a fixed-aside footer. Every section has the same
shared vocabulary (alternating `bg:dark c:light` ↔ `bg:light c:dark`,
pill buttons, animated arrows).

**Category:** Marketing / Studio portfolio
**Primary surface observed:** Homepage, plus the JSON payloads for
`/home`, `/news`, `/case_study/<slug>` (all rendered by the same
`<block-*>` components), and a prerendered `/page/<slug>` for SEO.
**Tone:** confident, technical, refined, quietly editorial.
**Framework detected:** none. Custom Web Component framework + custom
atomic-CSS engine, both built in-house by Nicolas Riciotti (header
comment in `js/index__2e1ba3ae.js`). WordPress headless CMS backend
(WP-JSON API at `https://www.ouiwill.com/wp-json/headless/v1`).

---

## Visual Language

### Color

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--alias-light` | `#FFFFFF` | Page base, light sections |
| Background (theme) | `--alias-dark` / `--alias-theme` | `#000000` | Dark sections, body text on light |
| Text (primary on light) | `--baseColor` | `#000000` | inherits `--alias-dark` |
| Text (primary on dark) | `.is-dark` | `#FFFFFF` | applied via class toggle |
| Text (secondary / muted) | `rgba(0,0,0,0.6)` | `#999999` | Used for address blocks, captions, dates (`.o:0.6`, `.o:0.7`) |
| Text (very muted) | `rgba(255,255,255,0.3)` | `#FFFFFF` at 30% alpha | News dates, "Reel" label |
| Text (accent grey) | `#717171` | `#717171` | "Multiply" mark, intro paragraphs in wysiwyg |
| Text (iconography grey) | `#959595` | `#959595` | Sub-slide label color on dark blocks |
| Border (subtle) | `--alias-grey10` | `rgba(196,196,196,0.1)` | Light hairlines on dark |
| Border (white 20%) | `--alias-white20` | `rgba(255,255,255,0.2)` | Borders on dark sections |
| Border (white 25%) | `--alias-white25` | `rgba(255,255,255,0.25)` | hr dividers under dark sections |
| Border (white 85%) | `--alias-white85` | `rgba(255,255,255,0.85)` | Reserved, near-white on dark |
| Border (black 20%) | `--alias-black20` | `rgba(0,0,0,0.2)` | Hairlines on light sections |
| Border (black 40%) | `--alias-black40` | `rgba(0,0,0,0.4)` | Default pill-button border (theme `alight`) |
| Border (black 50%) | `--alias-black50` | `rgba(0,0,0,0.5)` | Sits at `#808080` if rendered solid |
| Black @ 30% | `--alias-black30` | `rgba(0,0,0,0.3)` | Comment in CSS notes this equals `#B7B7B7` |
| White @ 85% | `--alias-white85` | `rgba(255,255,255,0.85)` | Near-white text on dark |
| Grey 10% | `--alias-grey10` | `rgba(196,196,196,0.1)` | Used inside `block-media` portrait mode for the inner border |

Hex token reference (uppercase, CSS-name-closest):

- `#000000` — black / "Oui Will" theme dark / default body text on light bg
- `#FFFFFF` — white / dark sections bg / text on dark
- `#717171` — used as `<color>` for the "multiply" cross glyph in
  `.wysiwyg .multiply:before` (`css/styles__c134c95a.css:252`) and for
  dark-on-light intro paragraphs
- `#959595` — used for sub-slide labels inside `<block-numbers>`
  (`js/index__2e1ba3ae.js:5375`)
- `#B7B7B7` — equivalent to `rgba(0,0,0,0.3)` per the CSS comment
- `#808080` — equivalent to `rgba(0,0,0,0.5)` per the CSS comment
- `#999999` — equivalent to `rgba(0,0,0,0.6)` (used implicitly via
  `.o:0.6` rule on address captions)

Notes:
- The site does not use a strict dark-mode toggle. Instead, sections
  are authored with a `theme="dark"` or `theme="light"` attribute on
  the block, and the `<scroll-manager>` walks all `[theme]` elements
  to decide whether the fixed `<app-header>` should invert its colors
  (`is-dark` class). See `js/index__2e1ba3ae.js:1446-1476`.
- The hero H1 uses `mix-blend-mode: difference` so the white text
  flips to black when scrolled under the (initially white) overlay
  panel that slides in over it.
- `#717171` and `#959595` are hard-coded hex values, not from the
  alias system; they appear in inline class strings.

### Typography

The site uses a single custom typeface, **Plain**, in three weights.
Both Light and Thin are preloaded via `<link rel="preload"
href="…/Plain-Light.woff2" as="font">` and
`…/Plain-Thin.woff2` (see `playwright/homepage.html:23-24`). The
fallback stack is `Plain, sans-serif`.

| Role | Family | Weight | Size (desktop) | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display H1 (hero "Digital. Brand. Accelerator.™") | Plain | 300 (Ultralight) | `fs:72fx` → 72px | `lh:1` → 72px | letter-spacing `-3.6px` (computed) |
| H2 (section titles, "We use the power..." etc.) | Plain | 300 | `fs:72fx` → 72px | `lh:1` → 72px | `l:-0.045em` ≈ `-3.24px` |
| H2 (huge) | Plain | 300 | `fs:144fx` → 144px | `lh:1.06` | `l:-0.045em` |
| H2 (display — "Portfolio", "News") | Plain | 300 | `fs:300fx` → 300px (desktop) | `lh:1.2` | `l:-0.045em` |
| H2 (mobile — section titles) | Plain | 300 | `fs:36fx@m` → 36px | `lh:48fx@m` → 48px | inherits |
| H3 (article title) | Plain | 300 | `fs:72fx` → 72px | `lh:81fx` (1.125) | inherits |
| H3 (subtitle) | Plain | 300 | `fs:30fx` → 30px | `lh:1.4` (42px) | `spacing:-1.5%` |
| H3 (lead-in number, awards "60+") | Plain | 300 | `fs:180fx` → 180px | `lh:1` | `l:-0.045em` |
| H4 (form label, address heading) | Plain | 400 | `fs:20fx` → 20px | `lh:47fx` (2.35) | normal |
| Body (long copy) | Plain | 400 | `fs:20fx` → 20px | `lh:47fx` (2.35) | normal |
| Body (caption / metadata) | Plain | 400 | `fs:16fx` → 16px | `lh:30fx` (1.875) | normal |
| Button / nav link | Plain | 400 (Light) | `fs:16fx` → 16px | `lh:24fx` (1.5) | normal, `t:-0.1em` |
| Button mobile | Plain | 400 | `fs:14fx@m` → 14px | `lh:24fx@m` | normal |
| Editorial intro / wysiwyg | Plain | 400 | `fs:18fx` → 18px (mobile) | `lh:30px` | normal |
| Blockquote | Plain | 300 | `fs:72fx` → 72px | `lh:81fx` (1.125) | `spacing:-3.5%` |
| Pre-block title (top headline) | Plain | 400 | `fs:16fx` → 16px | `lh:30fx` | `spacing:-3.5%` |

The custom font unit `--unit-fx = vw / 1440` is what every `fs:??fx`
class resolves through, which is why typography scales linearly with
viewport width on a 1440 px design baseline. Below 600 px, the unit
flips to `--unit-fx = vw / 375` (`css/styles__c134c95a.css:64-67`).

Note also `<sup>` inside the H1 (the "™" superscript) is rendered at
`fs:25fx` / `lh:34fx`, i.e. ~35% of the H1 size with a tighter line
height — computed styles confirm `font-size: 25px` at the 1440 px
design viewport (`playwright/computed-styles.json:339-352`).

### Spacing & radius

- **Base unit:** implicit 1 px; all design uses fluid calc units
  (`--unit-fx`, `--unit-fy`) anchored at 1440×900.
- **Gutters (horizontal page padding):**
  - Desktop: `p-x:101fx` to `p-x:103fx` (≈ 7.0–7.2 vw). Examples:
    hero article (`p-x:101fx`), `<app-header>` (`p-x:102fx`),
    `<block-text>` (`p-x:104fx`), footer (`p-x:103fx`).
  - Mobile: `p-x:8%@m` ≈ 8% of viewport.
- **Vertical section padding:** expressed in `*fy` units (vh/900).
  Examples: hero `h:800fy`, full-bleed video `h:990fy`, push section
  top `p-t:270fy`, footer `p-y:90fy`, articles `p-t:200fy`.
- **Component-level gaps (px):** `space-x:15px` (button row),
  `space-x:20fx` (footer nav), `space-x:10px@m` (mobile buttons).
- **Radii:** a single token — `radius:100px` for every pill button,
  every circular CTA, the play-circle, the custom cursor, and the
  mobile hamburger mask container. Search-reveal cards and figures
  are square (`border-radius:0`).
- **Shadows:** none observed. The design relies on contrast flips
  (`is-dark` class, `mix-blend-mode: difference`) rather than
  drop shadows for elevation.

### Iconography

- **Library:** none. All icons are inline SVG authored per component.
- **Style:** hairline / 1px-stroke. The signature motif is a 20×14
  right-pointing arrow built from three 1px-thick line segments
  (`<app-arrow>`), wrapped in two stacked instances so one fades in
  on enter and the other fades in on hover (`app-arrow.js:3019-3037`).
- **Other icons:**
  - **Plus / × (close):** two crossed 1px lines rotated 0/90 deg
    inside a 15×15 box (`<icon-plus>`).
  - **Play:** 8×13 SVG triangle, used inside the showreel's white
    circle CTA.
  - **Scroll-down circle:** an SVG `<circle r="48">` with
    `stroke-dasharray="401" stroke-dashoffset="401"` that animates
    `stroke-dashoffset → 0` over 1.6 s on viewport entry, wrapping
    an arrow rotated 90°.
  - **Logo wordmark:** the "OUIWILL" header logo is split into
    nine separate inline SVGs (one per glyph) inside the same
    anchor; on hover, each glyph staggers in via the `letter_enter`
    animation with a per-letter random delay. The footer logo is a
    single `ow.svg` (87 px wide).
- **Default size:** 20×14 px in body / nav, 84×84 px in mobile hero
  play CTA, 100×100 px in desktop circle buttons, 110×110 px in
  custom cursor.

---

## Layout & Grid

- **Max content width:** implicitly fluid — content pads from
  `p-x:101fx` to `p-x:103fx` on either side, which on a 1440 px
  design viewport gives ~102 px gutters and no hard cap.
- **Grid:** there is no CSS grid; layout is built from flex with
  hard-coded widths in `*fx` units. Common widths:
  - `w:60px` (header logo container)
  - `w:310fx` (footer nav column, address columns)
  - `w:411fx` (news thumbnail)
  - `w:514fx` (article text column)
  - `w:600fx` (intro paragraph, news text column)
  - `w:620fx` (form fieldset, footer logo column)
  - `w:720fx` (post titles)
  - `w:779fx` (article image)
  - `w:790fx` (h2 with `l:-0.045em`)
  - `w:926fx` (header-right hero media)
  - `w:1022fx` (blockquote text)
- **Breakpoints** (from CSS custom-media + `@m` modifier):
  - `mobile`  `≤ 767 px`   (alias `--media-m`)
  - `mobile portrait`  `≤ 600 px`  (alias `--media-mp`)
  - `not mobile`  `≥ 768 px`  (alias `--media-nom`)
  - `tablet`  `≤ 1024 px`   (alias `--media-t`)
  - `desktop`  `≥ 1440 px`  (alias `--media-d`)
  - The `@m` modifier (mobile-first style) means `p-x:8%@m` only
    applies below the desktop breakpoint.
- **Vertical rhythm:** no fixed baseline. Blocks stack with
  top/bottom padding expressed in `*fy` units; `space-y:??fy` (e.g.
  `space-y:195fy` between articles, `space-y:160fy` between jobs).

**Homepage layout, top to bottom (paraphrased, not from marketing copy):**

1. **Hero — black, full-bleed.** A `bg:dark c:light` section
   (`h:800fy` desktop / `h:85vhfix` mobile) with two layers:
   - A white overlay panel that slides down from `-100%` to `0` over
     1.6 s starting at 1.4 s after load, sliding the headline into
     view.
   - A `mix-blend-mode: difference` H1 reading
     "Digital. Brand. Accelerator.™" at 72 px / weight 300 / lh 1,
     with each glyph split into `<span data-letter>` children that
     blink in at random per-letter delays (0–0.28 s).
   - Bottom-left: a single pill button "Get in touch" (mailto)
     plus a 66×66 px circle CTA in the bottom-right (desktop only).
2. **Showreel — black, full-bleed.** A `<cursor-wrapper>` containing
   a `<scroll-object parallax=true ratio="0.3">` that holds the
   poster image plus an autoplaying, muted, looping `<video>` (the
   `reel_nico_1.mp4` asset). A `fs:144fx` (or `fs:30fx` if a caption
   is set) title hovers centered with the same `letter-split` reveal.
3. **"Since 2013…" — editorial intro, dark.** H3 subtitle at
   `fs:30fx lh:1.4`, paragraph at `fs:20fx lh:2.35`. Right column
   hosts a looping autoplay `<video>` (`Section01-1.mp4`) inside a
   `parallax=true ratio=0.2` scroll-object.
4. **Logo wall — dark, on black bg.** A grid of 12 monochrome client
   logos (Rivian, Rappi, Moxion, Oura, list-across, unpsun, Kanarys,
   Connect Homes, ov-loop, Pinch, Hyperframe, Nexbank) at
   `w:170px` each.
5. **"Designed…" — editorial, dark.** `<block-article>` with the
   text column on the left and a `<video>` on the right
   (`Section03.mp4`), plus a "Services" pill button.
6. **"Making the world…" — editorial, dark.** Same `<block-article>`
   component, alternate row-reverse layout, `Section02-1.mp4`
   video on the right.
7. **"Apply to… Accelerator" — push, light.** A light-bg section with
   centered H3 `fs:72fx`, a single "Apply" pill button, and a custom
   cursor reading "Let's Go" on hover (desktop only).
8. **"Portfolio" — title block, dark.** An oversized `fs:300fx`
   centered title on a 800 fy tall dark section with a desktop
   "mask-cursor" that reveals a 430 px circle containing a preview
   image/video on hover.
9. **Case-study grid — dark.** A 1-up / 2-up staggered grid: tile
   indices `0, 3, 6, …` are full-width, the rest are 50% (with a
   subtle negative `m-t:-144fy` offset on even rows for an offset
   editorial collage). Each tile is `min-h:720fy`, pads to 101 fx
   gutters, and contains a thumbnail (scale 1.2 → 1.01 on enter),
   a 22 px-tall SVG brand logo, and a `core-multiline` description.
10. **"Full Portfolio" — title block, dark.** Another `fs:144fx`
    centered title block.
11. **"60+ Awards" — block, dark.** A two-column layout with a
    `fs:180fx` "60+" on the left and the awards list (21× Awwwards,
    09× FWA, etc.) on the right. Includes a parallax-scroll of an
    Awwwards trophy image.
12. **"News" — title block, dark.** `fs:300fx` centered "News".
13. **News list — dark.** Three `<scroll-object>` rows. Each row is a
    flex with a 411 fx-wide thumbnail (80% aspect ratio), a date
    (`fs:16fx o:0.3`), and an H3 (`fs:30fx spacing:-1.5%`).
    A 1 px `b-b:solid,1px,white25` rule separates rows.
14. **"Presenting Disrupt" — push, dark.** Full-bleed background image
    with centered H3 ("Our app…") and "Let's Go" cursor.
15. **Footer — dark.** Fixed/absolute at the bottom of the scroll.
    Contains a `fs:48fx lh:72fx fw:300` mailto link, a 4-item nav
    (Portfolio / News / Careers / Contact), addresses for San Diego
    and Paris, a small "The Accelerator" promo block, social links
    (Twitter / Instagram / LinkedIn — arrow-links rotated -45°),
    Terms / Privacy, and the `ow.svg` logo.

---

## Components

### `<app-header>` (top bar)
- **Height:** implicit — no fixed height; pads top by 102 fy on
  desktop (`p-t:102fy`) and 60 fy on mobile (`p-t:60fy@m`).
- **Position:** `position:fixed`, full viewport width
  (`w:100vw z:10 pointer:none`).
- **Anatomy:** a `<header-block>` row aligned right with two
  children: the 9-glyph OW wordmark logo (left of the row) and a
  36×15 hamburger (right).
- **Theme switching:** each `[header-block]` flips `color` based on
  which `[theme]` scroll-object currently overlaps it
  (`js/index__2e1ba3ae.js:1446-1476`). On dark sections it gets
  `is-dark` → color `#fff`; on light sections color goes back to
  `#000`. The transition is `tween:color,0.5s,easeOut`.
- **Hover on logo:** each of the 9 glyph SVGs fades in with a
  staggered `letter_enter` animation, 0.4 s ease-out, per-letter
  random delay up to ~0.28 s.
- **Hamburger:** two 1 px horizontal lines, each made of two
  overlapping strips (a static full-width strip and an animated
  strip). On hover the strips grow via `burger_line1_start` /
  `burger_line1_end` (1.3 s `easeOut2`).

### `<arrow-button>` (pill button)
- **Variants:** `theme="alight"` (dark border + transparent fill,
  black text, on light sections — the most common variant),
  `theme="dark"` (transparent fill, white text on dark),
  `theme="adark"` (dark border on dark sections), `theme="light"`
  (white pill, black text on dark).
- **Sizes:** single size — `p-y:25px p-x:30px`, font `fs:16fx
  lh:24fx`, radius 100 px (pill). On mobile `@m`, font drops to
  `fs:14fx@m lh:24fx@m` and padding to `p-y:23fx@m`.
- **Anatomy:**
  - Outer `<a>` with `tween:0.3s,easeOut` on color/border.
  - Inner `<span class="bg:light group-hover:bg:dark">` that
    animates in (`anim-in:anim:0s,easeOut,<delay+0.17>s,forwards,blink`).
  - Border ring (1 px `black40` or `white20` based on theme).
  - Arrow icon (20×14 px) with two stacked instances — one enters
    via `anim-in`, the other enters via `group-hover`.
  - Label (`fs:15px lh:1 t:-0.1em`) that "blinks" in at
    `delay + 0.7 s` (or `delay + 0.2 s` for `double_blink` on
    emphasis variants).
- **States:**
  - default: transparent fill, 1 px border, theme-colored text.
  - hover: `bg:light` flips to `bg:dark` (or vice versa) over
    0.3 s; text color flips to the opposite.
  - focus: not observed in the dump; rely on browser default.
- **Radius:** `radius:100px` (full pill).

### `<arrow-link>` (inline link with arrow)
- **Variants:** default (`space-x:10px`, `fs:16fx`) and `large=true`
  (`space-x:30px`, `fs:24fx`).
- **Anatomy:** a `<a>` flex with a 20×14 arrow stack on the left and
  a label on the right. The arrow rotates to a given angle on init
  (used for footer social links at `rotate:-45deg`) and animates to
  `rotate:0deg` on hover.
- **Label:** `fs:16fx lh:1 t:-0.1em o:1`, `anim-in:anim:0.15s,
  easeOut,<delay+0.1>s,forwards,blink`. On hover, the label gets
  `anim:0.15s,easeOut,0s,forwards,blink_hover!`.

### `<arrow-submit>` (pill submit button)
Identical anatomy to `<arrow-button>` but renders a `<button
type="submit">` instead of an `<a>`, and accepts an optional
`isSending` state that fades opacity to 0.5 and disables pointer
events. Used inside the careers apply form.

### `<app-arrow>` (the signature arrow icon)
- **Box:** 20×14 px (or 30×30 in the circle button version).
- **Anatomy:** three 1 px line segments — a 20 px horizontal trunk
  and two 10 px diagonals at +45° and −45° — each made of two
  stacked strips (an animated strip plus an "exit" strip that runs
  the reverse animation on hover-out).
- **Animation timing:** trunk enters at `delay + 0 s` (easeOut2),
  diagonals at `delay + 0.4 s` (easeOut3). Strips `scaleX:0 → 1`
  over 0.6 s; the second strip in each pair simultaneously scales
  to 0.15 and shifts 100% (the "wipe" effect).
- **CSS reference:** `js/index__2e1ba3ae.js:3019-3037`.
- **Patterns:** every `<arrow-button>`, `<arrow-link>`, and
  `<arrow-submit>` renders **two** stacked `<app-arrow>` instances —
  one with `enter-class="anim-in"` for the page-entry animation, and
  one with `enter-class="group-hover"` that takes over when the
  parent link is hovered. The two are absolutely positioned on top
  of each other (`abs tl:0 w:fit`) so the swap reads as a single
  arrow that "re-draws" itself.

### `<app-line>` (underline accent on links)
- A 1 px line that sits at `bottom:0.25em` of its parent link.
- Built from two stacked spans: one starts at `scaleX:0` and
  triggers `burger_line1_start_leave` (the exit, 0.8 s easeOut2) on
  hover-out, and one triggers `burger_line1_start` (`scaleX:0→1`
  over 1.1 s easeOut2) on `group-hover`. The combined effect is a
  left-to-right underline draw followed by a wipe-out — a
  signature of the studio's typography.
- **Slow variant:** `<app-line slow=true>` swaps in `slow_line_start`
  / `slow_line_start2` (0.6–0.7 s) and is used inside push-section
  CTAs to make the underline feel weighted.

### `<block-frame>` (sticky-pinned media stack)
- Renders an oversized 100 vh dark wrapper containing a
  `position:sticky t:0` inner with `<scroll-object stack=true
  fade=true scale=true>`. As the user scrolls past, each slide
  becomes "stacked" via the `is-stacked` class which removes its
  transform. This creates a card-deck effect where one image
  collapses and the next pins in place.

### `<core-multiline>` (line-by-line reveal)
- A wrapper that, after first layout, wraps each measured line of
  text in a `<span class="mask">` containing an absolutely-positioned
  animated duplicate. When the component becomes active (its
  parent `<scroll-object>` adds `is-active`), each line's duplicate
  animates with `line_enter` (translateY(100%) → 0, opacity 0 → 1,
  with a 3° initial rotation that un-rotates to 0°).
- Per-line delay is `index * 0.15 s` on enter and
  `(linesCount - index) * 0.1 s` on leave (`core-multiline.js:2745`).

### `<core-ajax-form>` (form submit with validation)
- Used only inside the careers application form
  (`<block-form>` → `<core-ajax-form>`).
- Validates `[data-required]` and `[data-email]` fields on input
  after first submit. Marks fields with `.is-error` (red border
  via `(b-b:solid,1px,red)`) and `.is-success`. Disables pointer
  events and dims to `o:0.5` while sending. On success swaps the
  submit label to "Thank you, your message has been sent".

### Cookie banner
- Rendered by the parent `<web-application>` based on the
  `ouiwill2021-accept-cookies` cookie. The buttons are `allowCookies`
  / `refuseCookies` and write the cookie with a `path=/` scope
  (`web-application.js:5582-5590`). When accepted, the banner is
  removed. **Not observed in the rendered dump** — only the cookie
  API and getters are present.

### `<circle-button>` (round CTA)
- **Size:** 66×66 px (60×60 on mobile via `@m`).
- **Anatomy:** absolute-positioned button containing an SVG
  `<circle r="48">` whose `stroke-dashoffset` is animated from 401 →
  0 over 1.6 s on enter, plus an `<app-arrow>` rotated 90° centered
  inside. Hidden on mobile (`d:none@m`).
- **Position:** anchored `r:101fx b:80fy` (desktop) or `r:auto@m`
  (mobile), used as scroll-down CTAs.

### `<icon-plus>` (plus / close icon)
15×15 px box with two crossed 1 px line segments. Used in block FAQ
accordions and (statically rendered) anywhere a plus-toggle is
needed.

### `<app-menu>` (fullscreen overlay nav)
- **Trigger:** hamburger click sets `isMenuOpened = true` on
  `<web-application>`, which (a) shows `<app-menu>` with
  `is-active`, (b) shows a black backdrop overlay fading in over
  1.3 s `easeOut2`, (c) slides a white panel down from
  `shift-y:-103%` to `0` over 1.3 s `easeOut2`.
- **Anatomy:** a 100 vh container with a centered flex row:
  - A `<ul>` of 6 nav links (Home, About, Portfolio, News, Careers,
    Contact) at `fs:30fx fw:300 lh:60fx spacing:-3%`.
  - A right column with the `mailto:biz@ouiwill.com` link at
    `fs:48fx lh:72fx fw:300` and a small "The Accelerator" promo.
- **Per-link entry:** each `<li>` starts at
  `transform:shift-y:-100fy o:0` and animates in with
  `anim-in:tween:1.8s,${0.2 + (num-i)*0.1}s,easeOut` (i.e. from
  0.8 s for the last item down to 0.3 s for the first — a top-down
  cascade).
- **Hover:** on hover, the non-active links fade to opacity 0.4
  (`o:0.4`) over 0.5 s easeOut; the active link stays at 1.0.

### `<app-footer>` (sticky footer block)
- **Position:** rendered as `position:fixed tl:0` on desktop
  (`h:100vh p-y:90fy`), and as a relative block on mobile.
- **Anatomy:** a flex column with 4 children:
  1. A 48 px mailto link, underlined on hover.
  2. A `<ul>` of 4 footer nav items (Portfolio / News / Careers /
     Contact) at `fs:24fx fw:300 lh:2 spacing:-3%`.
  3. A 2-column address block (San Diego / Paris) + an Accelerator
     promo.
  4. A row with the `ow.svg` footer logo + social links + Terms /
     Privacy.

### `<letter-split>` (text reveal primitive)
Not a UI control — the core micro-component that every heading,
label, and link uses. It splits a string into per-character spans
and assigns each a random 0–0.28 s delay before the `blink` animation
turns it on. See Components section "Animations".

### `<block-home>` / `<block-articles>` / `<block-title>` / `<block-push>` / `<block-news>` / `<block-portfolio>` / `<block-awards>` / `<block-video>` / `<block-frame>` / `<block-text>` / `<block-quote>` / `<block-team>` / `<block-faq>` / `<block-form>` / `<block-next>` / `<block-numbers>` / `<block-break>` / `<block-editorial>` / `<block-addresses>` / `<block-jobs>` / `<block-advisory>` / `<block-post-title>`

These are page-level sections, not reusable controls, but they are
the unit the page is composed from. Each is a `customElement`
extending `Component` (`js/index__2e1ba3ae.js:1115`) and renders
its own templated HTML via the `render()` lifecycle method. Each
takes a `content` prop (typed `Object`) that the `<web-application>`
populates from the WP-JSON API on route change.

---

## JavaScript & Libraries

The site ships **zero third-party libraries**. Everything in
`js/index__2e1ba3ae.js` is hand-written vanilla JS. The file is
~243 KB (one big script with the entire framework in it).

| Module / Library | Version | Detection | Notes |
| --- | --- | --- | --- |
| UtilityCSS | in-house (Nicolas Riciotti) | `js/index__2e1ba3ae.js:1-15` (header comment) | Atomic CSS engine that parses class attributes matching `[variant]:[prop]:[value]@[mediaQuery]` and injects the matching CSS at runtime. Initialized via `customElements.define('web-application', WebApplication)` (line 5844). MutationObserver-driven. |
| Web Components / Custom Elements v1 | native | `customElements.define(...)` calls (28 of them) | Every UI primitive is a `class X extends Component extends HTMLElement`. Each component has `props`, `created`, `attached`, `ready`, `update`, `resize`, `render`, `afterRender`, `detached`, `attributeChangedCallback` lifecycle hooks. |
| `<scroll-manager>` | in-house | `js/index__2e1ba3ae.js:1301-1482` | Document scroll listener + `requestAnimationFrame` loop that pushes `scrollTop` to all registered `<scroll-object>` children; also tracks `[theme]` overlaps to flip `<header-block>` `is-dark` classes. |
| `<scroll-object>` | in-house | `js/index__2e1ba3ae.js:1557-1689` | Per-element scroll driver. Adds `is-active` class when within 90% of viewport; computes parallax (`ratio × speed`), scale, and fade transforms when not on mobile (`< 768 px`). |
| `<cursor-wrapper>` / `<custom-cursor>` | in-house | `js/index__2e1ba3ae.js:2872-3009` | Custom mouse cursor with damped lerp (`+= (target - curr) * 0.1`). Allows revealing a masked image or media behind a 100–430 px circle on hover. |
| `<letter-split>` | in-house | `js/index__2e1ba3ae.js:2374-2583` | Splits a string into per-letter spans with random per-letter delays. Reads `<br>`, `<sup>`, `<b>`, `<strong>`, `<a>` HTML for inline structure. |
| `<core-multiline>` | in-house | `js/index__2e1ba3ae.js:2585-2884` | Line-by-line reveal; measures word offsets after layout to wrap each line in a `<span class="mask">` with an absolutely-positioned animated duplicate. |
| `<roll-number>` | in-house | `js/index__2e1ba3ae.js:1691-1760` | Roulette-style number ticker; renders each digit as a 10-position cylinder rotated by `Math.sin(angle) * 200%`. |
| `<app-arrow>`, `<arrow-button>`, `<arrow-link>`, `<arrow-submit>`, `<circle-button>`, `<icon-plus>`, `<app-line>`, `<app-menu>`, `<app-loader>`, `<app-header>`, `<app-footer>`, `<page-block>`, `<core-ajax-form>`, `<core-multiline>` | in-house | `js/index__2e1ba3ae.js` various | See Animations catalog below for the components that drive motion. |
| `IntersectionObserver` | native browser API | `js/index__2e1ba3ae.js:5764` | Used by `WebApplication.onContentChange` to lazy-load `<video data-src>` and `<img loading=lazy>` as they enter the viewport. |
| `MutationObserver` | native browser API | `js/index__2e1ba3ae.js:720` | Used by UtilityCSS to detect class-attribute changes and re-inject the matching CSS. |
| `requestAnimationFrame` loop | native | `js/index__2e1ba3ae.js:1259-1264` | `function update(e) { requestAnimationFrame(update); componentInstances.forEach(c => c.update()) }` — drives every per-frame transform. |
| `XMLHttpRequest` | native | `js/index__2e1ba3ae.js:5633, 5651` | Loads global content and per-route content from `https://www.ouiwill.com/wp-json/headless/v1/global` and `/page<route>` (or `/post<route>` for `news/`, `jobs/`, `case_study/`). |
| `history.pushState` | native | `js/index__2e1ba3ae.js:5827` | Used for client-side navigation between pages. |
| CubicBezier solver | ported from WebKit UnitBezier.h | `js/index__2e1ba3ae.js:1484-1554` | JavaScript port of WebKit's cubic-bezier(p1x,p1y,p2x,p2y) solver. Used by `<scroll-object>` for scale/fade easing. |
| Vimeo iframe player | vimeo's hosted player | `js/index__2e1ba3ae.js:5184` (URL in render) | Embedded `https://player.vimeo.com/video/309604683` for the showreel alternative (`block-video` `vimeo` mode). |
| WordPress headless CMS backend | WP-JSON REST | `api-base="https://www.ouiwill.com/wp-json/headless/v1"` on `<web-application>` (homepage.html:100) | Provides `global`, `page/<slug>`, and `post/<type>/<slug>` JSON payloads. |

Detection note: there is no React, no Vue, no Next, no Astro, no
Tailwind, no jQuery, no GSAP, no Three.js, no Lottie, no Framer
Motion, no ScrollTrigger, no Barba, no Swup, no WebGL on the page.
Searching the dump for those strings returns zero matches.

---

## Animations (Catalog)

### CSS `@keyframes`

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `letter_enter` | `playwright/css/styles__c134c95a.css:288-295` | 1 s | `easeOut` (default) | DOM `<letter-split>` initial render |
| `letter_leave` | `playwright/css/styles__c134c95a.css:296` | 0 s (empty) | none | menu close, etc. |
| `blink` | `playwright/css/styles__c134c95a.css:299-306` | 0.3 s | `easeOut` | per-letter reveal in `<letter-split>` |
| `blink_hover` | `playwright/css/styles__c134c95a.css:309-316` | 0.3 s | `easeOut` | `a:hover` per-letter flicker |
| `double_blink` | `playwright/css/styles__c134c95a.css:319-332` | 0.7 s | `easeOut` | emphasized reveal for double-style buttons |
| `fadein` | `playwright/css/styles__c134c95a.css:346-349` | 2 s | `cubic-bezier(0.430, 0.195, 0.020, 1.000)` | `.is-active .fadeIn` |
| `fadeout` | `playwright/css/styles__c134c95a.css:350-353` | 0 s initial; 2 s when active | same bezier | inverse of fadein |
| `scaleXIn` | `playwright/css/styles__c134c95a.css:375-378` | 1.8 s | `cubic-bezier(0.430, 0.195, 0.020, 1.000)` | `<app-line>` underline enter / footer link hover |
| `scaleXOut` | `playwright/css/styles__c134c95a.css:379-382` | 1 s | same bezier | underline exit |
| `burger_line1_start` | `playwright/css/styles__c134c95a.css:386-389` | 1.3 s (group-hover) | `easeOut2` (`cubic-bezier(0.77,0,0.175,1)`) | header hamburger hover-in |
| `burger_line1_end` | `playwright/css/styles__c134c95a.css:390-393` | 1.3 s | `easeOut2` | hamburger strip wipe |
| `burger_line1_start_leave` | `playwright/css/styles__c134c95a.css:394-397` | 0.8 s | `easeOut2` | hamburger reset |
| `slow_line_start` | `playwright/css/styles__c134c95a.css:400-403` | 0.6 s | `easeOut2` | slow underline enter (push section links) |
| `slow_line_start2` | `playwright/css/styles__c134c95a.css:404-407` | 0.7 s | `easeOut2` | slow underline wipe |
| `burger_line2_start` | `playwright/css/styles__c134c95a.css:410-413` | 1.3 s | `easeOut2` | second hamburger line |
| `burger_line2_end` | `playwright/css/styles__c134c95a.css:414-417` | 1.3 s | `easeOut2` | second hamburger line wipe |
| `burger_close_line1` | `playwright/css/styles__c134c95a.css:419-423` | 0.3 s | `easeOut` (default) | hamburger → X close animation |
| `burger_close_line2` | `playwright/css/styles__c134c95a.css:424-428` | 0.3 s | `easeOut` | hamburger close line 2 |
| `underline_start` | `playwright/css/styles__c134c95a.css:431-434` | 0 s | none | reserved |
| `underline_end` | `playwright/css/styles__c134c95a.css:435-438` | 0 s | none | reserved |
| `line_enter` | `js/index__2e1ba3ae.js:2618-2621` (component inline `<style>`) | 2 s | `cubic-bezier(0.430, 0.195, 0.020, 1.000)` | `<core-multiline>` line reveal when `.is-active` |

### JS-driven animations

There are no external animation libraries — every motion is a CSS
`@keyframes` triggered by an inline class. The "JS-driven" motions
are therefore class-string compositions evaluated in the
`render()` method, often with computed random delays. The most
important ones:

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| in-house | Hero overlay slide | `app-loader` `is-ready` + 1.4 s delay | White panel translates from `shift-y:-100%` to `0` over 1.6 s easeOut2 (`js/index__2e1ba3ae.js:4156-4157`) |
| in-house | Hero H1 reveal | same | H1 starts at `shift-y:-100fy` (desktop) or `shift-y:-10vh` (mobile), animates in with the overlay (`block-home.js` line 4125+) |
| in-house | Per-letter H1 blink-in | DOM ready + 1.4 s delay | Each glyph of "Digital. Brand. Accelerator.™" gets a 0–0.28 s random delay before `blink`; total spread ≈ 0.5 s (`letter-split.js` lines 2514-2525) |
| in-house | Letter hover flicker | `a:hover` | Each letter in a hovered `<letter-split>` triggers a second `blink_hover` animation with random delay (`letter-split.js:2517`) |
| in-house | Circle button stroke draw | scroll entry | `stroke-dashoffset 401 → 0` over 1.6 s `easeOut3` (`circle-button.js:3216`) |
| in-house | Logo-glyph hover stagger | header `<a>` hover | Each of 9 OW glyphs gets a 0.03–0.29 s random delay before `letter_enter` |
| in-house | Parallax media | scroll | `scrollTop * ratio` offset applied every rAF tick (`scroll-object.js:1649-1666`); ratio 0.1–0.5 depending on usage |
| in-house | Sticky-pinned media (`block-frame`) | scroll | `<scroll-object stack=true>` toggles `is-stacked` when its `top - scrollTop < 0` |
| in-house | `core-multiline` line reveal | viewport entry | Each detected line animates with a 0.15 s × index stagger (or 0.1 s × index on leave) |
| in-house | `<app-menu>` open | click hamburger | (a) black backdrop `o:0 → 1` over 1.3 s easeOut2, (b) white panel `shift-y:-103% → 0` over 1.3 s easeOut2, (c) per-link `tween:1.8s,${0.2+(num-i)*0.1}s,easeOut` cascade |
| in-house | Page transition (route change) | internal link click | `app-loader` opacity overlay (1.3 s) + 1.9 s delay before `history.pushState` and content swap (`web-application.js:5822-5834`) |
| in-house | Custom cursor | mousemove on `<cursor-wrapper>` | damped lerp at factor 0.1; circle reveals image/media inside the cursor circle on group hover |
| in-house | Lazy video load | `IntersectionObserver` | `<video data-src>` swaps `src` and `.play()`s when intersecting (`web-application.js:5764-5793`) |

### Page transitions

The site implements a two-stage route change. On any internal link
click:

1. `<app-loader>` fades in (black backdrop + white panel slide) over
   1.3 s `easeOut2`.
2. After a 1.9 s delay (or 0.1 s if the menu just closed),
   `history.pushState({}, '', href)` fires, the document scrolls
   to 0,0, the `is-ready` class is removed, and `loadPage(route)`
   re-issues the WP-JSON XHR.
3. When the new content is parsed and the first `<page-block>` is
   rendered, `is-ready` is re-added and the loader is removed.

No transition animation runs on the very first paint (loader
removes immediately).

---

## Assets

Inventory pulled from `manifest.json` (33 files, 8.06 MB total, all
discovered via Playwright runtime).

### 3D models

N/A — no 3D assets observed in the dump. The site uses flat images
and looping `<video>` only.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Plain | Light (default 400), Ultralight (300), Thin | woff2 | `tools/tmp/ouiwill/playwright/fonts/Plain-Light__44b0ffa1.woff2`, `Plain-Ultralight__c408d716.woff2`, `Plain-Thin__6f0847ed.woff2` | yes |

CSS reference: `playwright/css/styles__c134c95a.css:70-78`.

### Images

Every image is referenced through the WordPress media library at
`https://www.ouiwill.com/wp-content/uploads/…`. The following are
the ones actually present in the dump (all JPG, loaded with srcset
at retina / large / mobile widths, then `loading="lazy"` +
`decoding="async"`):

| Local path (in dump) | Type | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/ouiwill/playwright/images/reel__11e3e44f.jpg` | JPG | 1.5 MB | `…/2021/04/reel.jpg` | Showreel poster (1920×1080) |
| `tools/tmp/ouiwill/playwright/images/rivian__15128f49.jpg` | JPG | 93 KB | `…/2022/04/rivian.jpg` | Client logo, Rivian |
| `tools/tmp/ouiwill/playwright/images/hyperframe__91c14a68.jpg` | JPG | 35 KB | `…/2022/04/hyperframe.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/reel-32x22__b2a47650.jpg` | JPG | 0.6 KB | `…/2021/04/reel-32x22.jpg` | LQIP / low-res placeholder for reel |
| `tools/tmp/ouiwill/playwright/images/rappi__2293f6d5.jpg` | JPG | 65 KB | `…/2022/04/rappi.jpg` | Client logo, Rappi |
| `tools/tmp/ouiwill/playwright/images/list-across__8f3fc8ed.jpg` | JPG | 97 KB | `…/2022/04/list-across.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/pinch__4eb03806.jpg` | JPG | 39 KB | `…/2022/04/pinch.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/connect-homes__3b1d55c1.jpg` | JPG | 40 KB | `…/2022/04/connect-homes.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/nexbank__aced797a.jpg` | JPG | 61 KB | `…/2022/04/nexbank.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/moxion__ab66fae8.jpg` | JPG | 68 KB | `…/2022/04/moxion.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/kanarys__e1b4a281.jpg` | JPG | 83 KB | `…/2022/04/kanarys.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/oura-thumb-32x32__a08341cf.jpg` | JPG | 0.8 KB | `…/2021/04/oura-thumb-32x32.jpg` | LQIP for oura portfolio tile |
| `tools/tmp/ouiwill/playwright/images/oura__1dc7f81c.jpg` | JPG | 65 KB | `…/2022/04/oura.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/ov-loop__75785fa7.jpg` | JPG | 73 KB | `…/2022/04/ov-loop.jpg` | Client logo |
| `tools/tmp/ouiwill/playwright/images/unpsun__c9adf469.jpg` | JPG | 41 KB | `…/2022/04/unpsun.jpg` | Client logo |

Additional images referenced in the rendered DOM but not in the
Playwright dump (would need a fresh fetch): `reel-1024x705.jpg`,
`rivian1.jpeg`, `RappiCard-1.png`, `04_MACRO_SNOOZEFEST-1060-V02`,
`push-disrupt.jpeg`, `Awwwards_Trophy-1.png`, `news-3.jpg`,
`Rectangle-15.jpeg`, `banner_proof`, `Section01-1.mp4` poster,
`Section02-1.mp4` poster, `Section03.mp4` poster. These are
loaded directly from `https://www.ouiwill.com/wp-content/uploads/`
with srcset Retina / 1440 / 768 widths.

### SVGs & icons

- **Standalone SVG in dump:** `tools/tmp/ouiwill/playwright/svgs/ow__a6818ac6.svg`
  — the footer logo. ViewBox `0 0 88 22`, single 1 px fill, no stroke.
  Reference URL: `https://www.ouiwill.com/wp-content/uploads/2021/04/ow.svg`.
- **Inline SVGs in HTML (count):** ~140 — most are the 3-segment
  `<app-arrow>` (`viewBox="0 0 20 14"`, 1 px fill, 6 line/rect
  elements) and the `<circle-button>` circle outline (`viewBox="0 0 100 100"`,
  single `<circle r="48">` with stroke). There are also ~11 inline
  copies of the OW wordmark split into 9 separate glyph SVGs each
  (one per letter), all using `viewBox="0 0 60 15"`.
- **Icon system:** fully custom. No Lucide / Phosphor / Heroicons /
  sprite. There is one extra stand-alone SVG family: the
  `rivian_logo.svg`, `rappi_logo.svg`, `oura_logo.svg` referenced
  in the portfolio block (all viewBox-set brand wordmarks loaded
  with srcset).

### Audio & video

| Local path (in dump) | Type | Notes |
| --- | --- | --- |
| `tools/tmp/ouiwill/playwright/media/oui-will-showreel-preview_1__e684798b.mp4` | MP4 | 2.0 MB, the "Full Portfolio" title block preview clip (used as cursor-media inside `<custom-cursor>` with `data-media` attribute). Loops muted. |
| `tools/tmp/ouiwill/playwright/media/reel_nico_1__e684798b.mp4` | MP4 | 2.2 MB, the showreel that loops under the "Play reel" overlay. Loaded with `<video muted playsinline preload="none" loop autoplay>` and displayed `object:cover`. |

The rendered DOM references three more `<video>` sources via
`data-src` (lazy-loaded by IntersectionObserver):
`https://www.ouiwill.com/wp-content/uploads/2021/06/Section01-1.mp4`,
`Section02-1.mp4`, `Section03.mp4`. All three are loaded with
`<video muted playsinline preload="none" loop autoplay loading="lazy"
data-src="…">` and play as soon as they enter the viewport. None
have audio. The block-video component additionally supports a
`vimeo` mode that swaps the `<video>` for a Vimeo iframe
(`https://player.vimeo.com/video/309604683` with `?autoplay=1&loop=1`)
on click, which is used by the original showreel page
(`block-video.js:5183-5188`).

There is no audio asset anywhere on the site.

---

## Motion & Interaction

### Principles

- Default easing: `--alias-easeOut` = `cubic-bezier(0.430, 0.195,
  0.020, 1.000)` for short transitions, `--alias-easeOut2` =
  `cubic-bezier(0.77, 0.0, 0.175, 1.000)` for hero/overlay/page
  transitions, `--alias-easeOut3` =
  `cubic-bezier(0.165, 0.84, 0.44, 1.000)` for circular/scale
  easings.
- Default duration: 0.3 s for micro (letter blink, color hover),
  0.6–1.0 s for small (arrow draw, scale), 1.3 s for medium
  (page/loader transitions), 1.8 s for slow underline draws.
- Everything uses `translateZ(0)` to force a GPU layer, and the
  global reset includes `-webkit-font-smoothing: antialiased` plus
  `text-rendering: optimizelegibility` (no subpixel AA).

### Specific behaviors

- **Link hover (color):** `.tween:0.5s,easeOut` on the header-block
  background; arrow-link text gets a per-letter `blink_hover`
  re-flicker.
- **Button hover:** pill fill `bg:light` → `bg:dark` (or inverse)
  over `0.3s`; border ring fades out (`o:0!`) and a second ring
  fades in; the arrow icon stack crossfades (enter instance at
  `o:0` fades to 0, hover instance fades from `o:0` to `o:1`).
- **Section reveal on scroll:** driven by `<scroll-object>` adding
  `is-active` when the element is within `0.9 × window.innerHeight`
  of the viewport top. Each `<letter-split>` inside then triggers
  its per-letter `blink` cascade with `0–0.28 s` random stagger.
- **Page transition:** see `Animations (Catalog) → Page
  transitions` above — 1.3 s loader, 1.9 s buffer, XHR refetch,
  swap.
- **Custom cursor:** on `<cursor-wrapper>`, mousemove updates
  `currPointer += (target - curr) * 0.1` per rAF; the
  `<custom-cursor>` mirrors via `transform: translate(x-w/2, y-h/2)`.
  On `group-hover` the cursor circle scales from `scale:0` to
  `scale:1` over `0.6s easeOut3` and (if the cursor is in `mask`
  mode) reveals a full-viewport image behind a `radius:300px` clip.
- **Parallax:** the `ratio` prop on `<scroll-object>` (default 0.1,
  used at 0.1, 0.2, 0.3, 0.5 across the page) drives a
  `transform: translateY(scrollTop*ratio*speed)` applied to the
  inner element every rAF. `speed` defaults to 0.5 (eased).

### Reduced motion

The CSS reset explicitly comments out a `prefers-reduced-motion`
override (`playwright/css/styles__c134c95a.css:131-137`), so the
site does **not** ship any reduced-motion fallback. All animations
play as authored even when the user has the OS-level reduced-motion
preference enabled. This is a known limitation of the framework.

---

## Content & Voice

- **Tone:** confident, technical, restrained. The site's
  meta description positions the brand as "an award-winning Digital.
  Brand. Accelerator.™ that multiplies valuation through digital
  innovation." The voice on the homepage matches: short editorial
  sentences, no exclamation marks, occasional typography emphasis
  (the "Digital. Brand. Accelerator.™" is a single-word-per-line
  H1 rendered with a `™` superscript).
- **Sentence length:** medium. Active voice. Most paragraphs are
  2–3 sentences.
- **Capitalization:** Title Case for proper nouns and section
  headers ("We use the power of design to enrich people’s lives",
  "Apply to the Accelerator", "60+ Awards"); sentence case for
  body copy. Some headers use ALL CAPS rendered as small labels
  (`INDUSTRIES` h4 in the editorial block, used inline).
- **Punctuation:** uses curly apostrophes ("people's", "world's")
  and the superscript trademark "™" character. Em-dashes are
  used in metadata. Oxford comma is not consistent (mostly omitted).
- **CTA vocabulary:** the same five verbs appear repeatedly —
  "Get in touch", "Read Post", "Read more", "Services", "Apply",
  "View Case", "Let's Go", "Close", "View Project". The arrow
  character is rendered as a 20×14 SVG, never as `→`.
- **Notable phrases used on the page:**
  - "Digital. Brand. Accelerator.™" (H1)
  - "Since 2013, we've garnered over 70 awards..."
  - "We work shoulder-to-shoulder with ambitious founders..."
  - "By aligning ourselves with partners that share the same
    sentiment, we can work together to enrich people's lives through
    design..."
  - "Create value. Launch faster. Extend your runway."
  - "Apply to the Accelerator"
  - "60+ Awards for design from around the world"

---

## Information Architecture

Top-level routes observed (from `js/index__2e1ba3ae.js:5619-5631`
and the `<app-menu>`'s hard-coded list):

- `/` — marketing homepage, renders `<block-home>` hero plus the
  full section sequence above.
- `/home` — alias of `/`, used internally by the framework's route
  resolver.
- `/about` — about page.
- `/portfolio` — portfolio index; pulls posts of post_type
  `case_study` via `/wp-json/headless/v1/post/case_study/`.
- `/case_study/<slug>` — individual case-study pages
  (e.g. `rivian/`, `rappi-pay/`, `ouraring-2/`). Each rendered by
  `<block-post-title>` + `<block-article>` + `<block-next>`.
- `/news` — news feed; pulls `post_type=news`. Renders
  `<block-news>` (one featured + three rows).
- `/news/<slug>` — individual news post pages.
- `/careers` — careers index, fetches `post_type=jobs` and groups
  by location, rendered by `<block-jobs>`.
- `/contact` — contact page with mailto + the Accelerator CTA.
- `/terms`, `/privacy-policy` — legal pages, listed in
  `footer_secondary_nav`.
- `/404` — fallback for unknown routes (`web-application.js:5656`).

The site also lazy-loads dynamic content for:
- `https://gust.com/programs/q4-2023-cohort` — Accelerator
  application (external link from the "Apply" CTA).

---

## Accessibility

- **Color contrast:** body text `#000000` on `#ffffff` and `#ffffff`
  on `#000000` both reach ≥ 21:1 — well above WCAG AAA. The grey
  metadata text `rgba(0,0,0,0.6)` ≈ `#666` on white reaches ~5.7:1,
  passing AA for body text. The `rgba(255,255,255,0.3)` date
  metadata on dark sections is approximately `#7F7F7F` on `#000`,
  ~4.5:1 — borderline AA for large text only. **Not observed:**
  any audited color-blind simulation.
- **Focus indicators:** not explicitly set in the dump — buttons and
  links rely on the browser default focus ring (the global reset
  clears `outline: none` on `button, input, a` so default rings are
  removed). This is an accessibility regression for keyboard users.
- **Keyboard:** all interactive elements are `<a>`, `<button>`, or
  custom elements that delegate to `<a>`/`<button>` internally, so
  they are reachable via Tab. No explicit `:focus-visible` style
  was found. The menu has an `@click="toggleMenu"` on the hamburger
  and is not keyboard-operable directly; only the subsequent link
  list inside the menu is focusable.
- **Screen reader landmarks:** the page does have `<header>`, `<main
   scroll-content>`, and `<footer>`. Custom elements like
   `<web-application>`, `<scroll-manager>`, `<app-header>`, etc.
   have no implicit ARIA role, which means AT may announce them as
   generic `web-application` etc. The header logo link has a visible
   `href="/"` but no `aria-label`; the wordmark is built from SVGs
   with no `<title>` inside. **Not observed:** any skip-to-content
   link.
- **Motion:** see "Reduced motion" under Motion & Interaction — no
  fallback is shipped.
- **Alt text:** observed convention for portfolio thumbnails is an
  empty `alt=""` (decorative). The brand wordmark logos are loaded
  with `alt="${slide.title}"` (the brand name) — descriptive but
  redundant since they repeat the parent link's text. SVGs without
  `aria-label` or `<title>` (the arrows, the play triangle, the
  scroll-down circle) are decorative.

---

## Sources

Every URL actually opened or referenced while writing this:

- Homepage rendered DOM — `tools/tmp/ouiwill/playwright/homepage.html`
- Homepage full-page screenshot — `tools/tmp/ouiwill/playwright/homepage-fullpage.png`
- Homepage viewport screenshot — `tools/tmp/ouiwill/playwright/homepage.png`
- Computed styles for 246 elements — `tools/tmp/ouiwill/playwright/computed-styles.json`
- CSS bundle — `tools/tmp/ouiwill/playwright/css/styles__c134c95a.css`
- JS bundle — `tools/tmp/ouiwill/playwright/js/index__2e1ba3ae.js`
- Footer logo SVG — `tools/tmp/ouiwill/playwright/svgs/ow__a6818ac6.svg`
- Global content JSON — `tools/tmp/ouiwill/playwright/other/global__e240ae17`
- Homepage payload JSON — `tools/tmp/ouiwill/playwright/other/home__792820b3`
- News payload JSON — `tools/tmp/ouiwill/playwright/other/news__935457b7`
- Case-study payload JSON — `tools/tmp/ouiwill/playwright/other/case_study__4f16209e`
- Dump manifest — `tools/tmp/ouiwill/manifest.json`
- Prerendered HTML shell — `tools/tmp/ouiwill/html/asset_32__3b99e054`
- Media — `tools/tmp/ouiwill/playwright/media/oui-will-showreel-preview_1__e684798b.mp4`,
  `tools/tmp/ouiwill/playwright/media/reel_nico_1__e684798b.mp4`
- 15 JPG assets under `tools/tmp/ouiwill/playwright/images/`
  (see Assets → Images for the full table)
- Live site — https://www.ouiwill.com/ (HTTP fetch returned 403 /
  Cloudflare challenge; the playwright-captured DOM is the
  primary source for the design)
- WP-JSON API base — `https://www.ouiwill.com/wp-json/headless/v1`
  (referenced from `homepage.html:100`)
- Showreel video — `https://www.ouiwill.com/wp-content/uploads/2021/06/reel_nico_1.mp4`
- Section videos — `…/2021/06/Section01-1.mp4`, `Section02-1.mp4`, `Section03.mp4`
- Footer logo source — `https://www.ouiwill.com/wp-content/uploads/2021/04/ow.svg`
- OG image — `https://www.ouiwill.com/assets/images/og-image.jpeg`

---

## Changelog

- 2026-06-20 — Initial draft by MiniMax-M3. Source dump at
  `tools/tmp/ouiwill/` (33 files, 8.06 MB; scraped 2026-06-19 by
  Playwright after the live `curl` returned a Cloudflare challenge).
