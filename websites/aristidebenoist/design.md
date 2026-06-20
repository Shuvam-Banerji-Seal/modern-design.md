# Aristide Benoist — design.md

> A structured design specification of **https://aristidebenoist.com**,
> written so a human or agent can reconstruct its look-and-feel without
> seeing the original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** design.md_gen agent
> **Source dump:** `tools/tmp/aristidebenoist/` (gitignored)

---

## Overview

Aristide Benoist's personal site is a one-developer portfolio rendered
almost entirely as a **single WebGL canvas plus a thin layer of overlay
DOM**. The home page is a single-screen horizontal slider of 30 case
studies; each case is a textured quad drawn into a custom GLSL pipeline
that distorts the image with a curved-edge geometry and a multiply blend
against a per-project background colour. The same surface expands into a
full-bleed **Work** mode (single project, all media) and an **About**
mode (large display name + clients/awards lists). Mouse wheel and drag
kinematics are implemented in hand-rolled JS — no GSAP, no Lottie, no
Three.js — and every visible letter is animated through a class
`L / k / T` pipeline that lerps `transform: translate3d(x, y, 0)`
between computed positions stored per project.

The visual register is **dark, editorial, monochrome-with-accent**:
a deep `#141414` background, `#BAC4B8` mint-grey for default text,
accent colours that change per project (saturated gold, magenta,
green, etc.), large-display sans-serif "TNY" and heavy display "jws".
The design was produced in collaboration with **JW.S (Jon Way Studio)**
(visible in `#a-design` link).

**Category:** Personal portfolio / Creative-developer showcase
**Primary surface observed:** Single-page app with three "modes"
(`out`, `in`, `w`, `a`) reachable by URL: `/`, `/<project-slug>`,
`/about`. (Mode names internally: `"out"` = home overview, `"in"` =
single-project still, `"w"` = work detail, `"a"` = about.)
**Tone:** Confident, technical, restrained, deliberate; opinionated
type and motion; minimal copy.
**Framework detected:** None — hand-rolled JavaScript, hand-written
GLSL ES 1.0, hand-written CSS, served as static files from
`/static/{css,js,font,media,fav,og}/`. SPA-style page changes happen
via `history.pushState` + `fetch('?xhr=true&device=...&webp=...')`.
**Build tooling:** Minified, no obvious bundler fingerprints; entry
script is a single 67 KB JS file served at `/static/js/d.js?v=2`.

---

## Visual Language

### Color

#### Background, text and chrome (home / chrome)

| Role | Token (site-defined) | Value | Source |
| --- | --- | --- | --- |
| Page background | `window._A.color.bg.hex` | `#141414` | inline style on `<html>` (`playwright/homepage.html:2`) and `_A.color.bg.hex` in boot script (`homepage.html:31`) |
| Body default text | `window._A.color.txt.hex` | `#BAC4B8` (sage-grey) | `_A.color.txt.hex` boot script; matches `#load>div` computed color `rgb(186,196,184)` |
| About-page text | inherited from `<div id="a" style="color:#bac4b8;">` | `#BAC4B8` | `homepage.html:2921` |
| Nav text + cross-link lines | `style="background-color:#bac4b8"` | `#BAC4B8` | `<a id="n1-0">`, `<a id="n1-1">` (`homepage.html:3214–3230`) |
| 404 fallback text | `.iss-w { background:#fff; color:#000 }` | `#FFFFFF` / `#000000` | `css/d__cc8c00bb.css` (inline in head, `homepage.html:7`) |
| Theme color / manifest | `theme_color`, `background_color` | `#171717` | `other/manifest__1fd52375.json`, `<meta name="theme-color">` |
| Mask-icon color | `<link rel=mask-icon color>` | `#0B0C0C` | `homepage.html:27` |
| Favicon SVG bg | `.st0 { fill:#171717 }` | `#171717` | `svgs/fav__6d05a725.svg` |
| Favicon SVG fg | `.st1 { fill:#B9C6B8 }` | `#B9C6B8` | `svgs/fav__6d05a725.svg` |

#### Per-project palette (home + work)

The home slider carries 30 case studies. Each has its own background
colour, accent/text colour, multiply mode, and **opacity multiplier for
the info overlay**. All values are pulled verbatim from
`html/asset_16__f94aba49` (the `?xhr=true` JSON response) — `data.work[*].color`:

| # | Folder | URL | `txt` (accent) | `bg` | `multiply` | `inOverLight` | `mediaL` |
|---|---|---|---|---|---|---|---|
| 01 | house-of-gucci | `/house-of-gucci` | `#CC9933` | `#FFFFFF` | 1.00 | 0.7 | 7 |
| 02 | ph | `/paul-et-henriette` | `#1E1E1E` | `#BEBEBE` | 1.00 | 0.7 | 8 |
| 03 | canals | `/canals` | `#FFF1CE` | `#DE4C3F` | 1.00 | 0.8 | 7 |
| 04 | jmm | `/jacques-marie-mage` | `#1E1E1E` | `#E7E6E3` | 1.00 | 0.7 | 7 |
| 05 | mank | `/mank` | `#D9D9D9` | `#0A0A0A` | 0.75 | 0.5 | 8 |
| 06 | waka-1 | `/waka-waka-1` | `#2A2A2A` | `#D5D5D5` | 1.00 | 0.7 | 8 |
| 07 | capsulin | `/capsulin` | `#F0F0F0` | `#080911` | 0.75 | 0.7 | 6 |
| 08 | design-embraced | `/design-embraced` | `#D99299` | `#595E63` | 1.00 | 0.7 | 6 |
| 09 | new-company | `/new-company` | `#E0C8A4` | `#898270` | 0.75 | 0.7 | 7 |
| 10 | tm | `/tm` | `#DA452F` | `#0C0C0C` | 0.75 | 0.7 | 7 |
| 11 | waka-2 | `/waka-waka-2` | `#F6F0E2` | `#85817D` | 1.00 | 0.7 | 7 |
| 12 | stuuudio | `/stuuudio` | `#BD998F` | `#FEF8F6` | 0.75 | 0.7 | 8 |
| 13 | dribbble | `/dribbble` | `#FEA8B1` | `#1D1C22` | 0.75 | 0.7 | 7 |
| 14 | folio-v4 | `/folio-v4` | `#070707` | `#F5EFDF` | 0.75 | 0.7 | 7 |
| 15 | crsa | `/crsa` | `#1C2134` | `#DFE9F3` | 1.00 | 0.7 | 5 |
| 16 | marry-monday | `/marry-monday` | `#55729C` | `#EDE8DE` | 1.00 | 0.7 | 8 |
| 17 | rappi-pay | `/rappi-pay` | `#E9786A` | `#222223` | 1.00 | 0.7 | 5 |
| 18 | monfrini | `/monfrini` | `#00A8A9` | `#DBE6E2` | 0.75 | 0.7 | 7 |
| 19 | all-your-days | `/shallou` | `#53BB89` | `#D3D0C7` | 1.00 | 0.7 | 8 |
| 20 | benjamin-guedj | `/benjamin-guedj` | `#1E1F28` | `#B99E94` | 1.00 | 0.7 | 6 |
| 21 | everest | `/everest` | `#AE75E6` | `#E0E7EF` | 1.00 | 0.7 | 7 |
| 22 | make-reign | `/make-reign` | `#F04333` | `#454545` | 1.00 | 0.7 | 7 |
| 23 | guillaume | `/guillaume-belveze` | `#E3CBB5` | `#778379` | 1.00 | 0.7 | 6 |
| 24 | epicurrence-8 | `/epicurrence-8` | `#321D44` | `#ECDCE9` | 1.00 | 0.7 | 7 |
| 25 | folio-v1 | `/folio-v1` | `#C7836C` | `#DFE0E4` | 0.75 | 0.7 | 6 |
| 26 | ben-mingo | `/ben-mingo` | `#E8E7C8` | `#8BA3A7` | 1.00 | 0.7 | 6 |
| 27 | digital-asset | `/digital-asset` | `#D2DCF2` | `#32447F` | 1.00 | 0.7 | 8 |
| 28 | jenny | `/jenny-johannesson` | `#FF71CB` | `#E9F1F4` | 1.00 | 0.7 | 8 |
| 29 | bear-grylls | `/bear-grylls` | `#D4C3A5` | `#515443` | 1.00 | 0.7 | 8 |
| 30 | epicurrence-6 | `/epicurrence-6` | `#734130` | `#ADADAB` | 1.00 | 0.7 | 8 |

The home page initial state uses **house-of-gucci's** colours (gold on
white) — `_A.color.txt` is `rgb(186,196,184)` initially in
`<div id="load">` but each `<li>` carries its own inline `style="color: …"`
that the engine lerps between as the user scrolls/drags.

### Typography

Two self-hosted display fonts, both WOFF2, both served from
`/static/font/`:

| Slot | Family token | Source URL | File (dump) | Weight | Default size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Display / project title | `TNY` | `/static/font/t.woff2` | `fonts/t__847aac8f.woff2` (2.7 KB) | 400 | `50px` (load counter); `337.5px` on home `t t0 tt` (1600 px viewport) | `44px` (counter), `0.75em` ≈ `253.125px` (titles) | `-0.01em` / `-0.024em` / `-0.02em` |
| Body / nav / labels | `jws` | `/static/font/jw.woff2` | `fonts/jw__19210970.woff2` (4.2 KB) | 700 | `16px` body, `10px` info labels, `12px` lines/nav, `6px` info-key letter | `normal` body / `12px` info / `10px` rights / `34px` line-w | `normal` / `0.02em` info / `-0.02em` line-w / `0` |
| Project name (about) | `TNY` | — | — | 400 | `257.5px` (computed at 1600 px) | `0.747em` ≈ `192.35px` | `normal` |

Computed styles from `playwright/computed-styles.json` (1440 × 900
Playwright viewport, before responsive media queries kick in):

| Element class | Family | Size | Line-height | Tracking | Color (rendered) |
| --- | --- | --- | --- | --- | --- |
| `main` (root) | `jws` | `16px` | normal | normal | `rgb(0,0,0)` |
| `#load > div` (counter) | `TNY` | `50px` | `44px` | `-0.5px` | `rgb(186,196,184)` |
| `.t t0 tt` (project title) | `TNY` | `337.5px` | `253.125px` | `-8.1px` | `rgb(204,153,51)` (gilt) |
| `.i-l` (info left) | `jws` | `10px` | `12px` | `0.2px` | `rgb(204,153,51)` |
| `.i-l > div > div` (key column) | `jws` | `6px` | `12px` | `0.2px` | `rgb(204,153,51)` |
| `.a-nif` (about hero name) | `TNY` | `257.5px` | `192.352px` | normal | `rgb(186,196,184)` |
| `a.e line-w` (CTA / explore) | `jws` | `12px` | `34px` | `-0.24px` | per-project `rgb(…)` |

Other observed sizes: `6px`, `10px`, `11px`, `12px`, `16px`, `50px`,
`257.5px`, `337.5px`. Font is **never system fallback** —
`-webkit-font-smoothing: antialiased` is set on `html`.

The CSS itself uses `font-feature-settings: "liga" off` on `body` to
disable ligatures in the heavy display font.

### Spacing & radius

- **No borders.** The single border-rule is `border-right: 1px solid
  <color>` on `.e-l` (the small vertical divider above the "EXPLORE"
  CTA in each project).
- **No border-radius anywhere** — confirmed in
  `playwright/computed-styles.json`: every element has `borderRadius:0`.
- **No box-shadow** on any observed element.
- **Gutters / paddings** are percentages of `vh`/`vw`, not px:
  - Page gutters on the home page: `38px` (`#n0`, `#load`, `.t`), `50px`
    (`#n2`, `#a-left`, `#n3`, `#w-s-w`).
  - About hero left offset: `calc(6.66667vh + 50px)` for the social
    block, `calc(10.83333vh + 50px)` for the right list (`a-social`,
    `a-list` in `css/d__cc8c00bb.css:46–48`).
  - About display name sizes scale with viewport height:
    `font-size:calc(17.5vh + 100px)` ≥ 850 px, falling to
    `calc(13.33333vh + 100px)` ≤ 750 px (`css/d__cc8c00bb.css:119–127`).

### Iconography

Three custom-drawn inline SVG glyphs, all 14×14 `viewBox`:

| Icon | Source | Geometry |
| --- | --- | --- |
| **Plus / cross** ("EXPLORE" CTA) | inline `<svg viewBox="0 0 14 14">` inside `.e-s` of each project `<li>` | `polygon points="7,11.042 6.08,11.042 6.08,7.889 2.958,7.889 2.958,6.096 6.08,6.096 6.08,2.958 7.921,2.958 7.921,6.096 11.042,6.096 11.042,7.889 7.921,7.889 7.921,11.042"` (a fat "plus" glyph) |
| **Cross / star** (close projects button) | inline `<svg viewBox="0 0 14 14">` inside `#p-s` | `polygon id="p-s-p" points="9.207,10.508 10.509,9.207 …"` (an 8-point star/cross) |
| **External-link arrow** "↗" | `::after` pseudo-elements `#n2::after`, `.n3::after` (`css/d__cc8c00bb.css:28,34`); also text in nav (`a.n3`, `#a-social a`) | Unicode `↗` (U+2197), 5 px padding |

No third-party icon library; the favicon also reuses the same
three-rect mark:

- `svgs/fav__6d05a725.svg`: 16×16 viewBox, three vertical `#B9C6B8`
  rects (`4,3 2×10`, `7,3 2×10`, `10,3 2×10`) on `#171717` ground.
- `svgs/fav-mask__dee8d346.svg`: same three-rect mask in pure `#B9C6B8`.

---

## Layout & Grid

### Container & geometry model

- The entire UI is fixed-positioned inside `<main id="app">`
  (`css/d__cc8c00bb.css:1`):
  `#app { position:fixed; top:0; left:0; width:100%; height:100%; overflow:hidden; user-select:none }`
- WebGL canvas (`#gl`) and 2D debug canvas (`#c2d`) and the work-detail
  canvas all live inside `#app`, each with `position:absolute; top:0;
  height:100%`.
- The **PSD reference size** is `1600 × 1200` — every layout scalar
  is multiplied by `_A.winWpsdW = window.innerWidth / 1600` or
  `_A.winHpsdH = window.innerHeight / 1200`
  (`js/d__a7ac30d7.js`, engine constructor — `t.psd.w`, `t.psd.h`).
- `_A.ratio` is `Math.min(winWpsdW, winHpsdH)`; **content scales by the
  smaller of the two** so the design holds its aspect ratio.

### Breakpoints

| Trigger | Width × Height | Effect |
| --- | --- | --- |
| `max-width: 700px` | mobile | hide `#c2d` debug canvas + `.pgn` paginator; mobile JS file is loaded instead of `d.js` |
| `min-height: 850px` | tall | display-name size scales up to `calc(17.5vh + 100px)` |
| `min-height: 750–850px` | medium-tall | `calc(15vh + 100px)` |
| `max-height: 750px` | short | `calc(13.33333vh + 100px)` |
| `max-height: 700px` | very short | hide `#a-p` (description) |
| `max-height: 850px` | medium | hide `#a-social div:nth-child(4)`, `(5)` (Behance/Dribbble) |
| `max-height: 600px` | very short | hide `#a-list` (clients / awards) |
| `max-width: 1800px` | desktop | `.a-li` width 230 px; ≥ 1800 → 260 px |
| `max-width: 1550px` | laptop | hide last `.a-li` (Behance column) |
| `max-width: 1250px` | tablet | hide 3rd `.a-li`, hide `#a-design` credit |
| `max-width: 1150px` | tablet-portrait | hide `#w-a`, `#w-s-w` (work-detail thumb rail + arrow) |
| `max-width: 1350px` | tablet-portrait | hide `.i-l`, `.i-r` (project info side panels on home) |
| `max-width: 1050px` | mobile | hide every `.a-list > li` (no awards on mobile) |
| `min-aspect-ratio: 1660/1200` | wide | `.t` (project titles) measured in `vh`: `font-size: 37.5vh`; `width: 96.2963vh` for `#w-l` |
| `max-aspect-ratio: 1660/1200` | narrow | `.t` measured in `vw`: `font-size: 26.50602vw` |
| `min-height: 870/810` | tall | `#p-l` (loader progress) gets `16px` / `1.2vh` height; ≤ 810 px hides |

### Vertical rhythm

The home mode uses 8/12 px **line-height** units throughout: `#load`
`44/50`, `a.e line-w` `34/12`. The display titles break rhythm
deliberately — line-height `0.75em` (`253.125 / 337.5`) for the home
title, `~0.747em` for the about name.

### Home mode layout (mode = `"out"`)

The home mode is one viewport. Z-order top→bottom in the DOM:

1. `<canvas id="gl">` (the entire page; WebGL, full-bleed)
2. `<ul id="li">` — 30 `<li>`s, one per project, **all stacked on top
   of each other** with `position:absolute; left:0; width:100%`. Only
   one is `opacity:1` at a time; the rest are at `0` (driven by
   `t.li.run({index})` and the WebGL `o` uniform lerp). Each `<li>`
   contains the project title (split per-letter into `.t > div > div`),
   the info block (`.i-l`, `.i-r`), the "EXPLORE" CTA (`a.e`), and
   the small paginator `.pgn` (current / total).
3. `<a id="p">` — the "PROJECTS" / cross button, top-centre.
4. `<a id="v">` — the "VISIT SITE ↗" Twitter handle, bottom-centre.
5. `<div id="w">` — work-detail container (hidden in `"out"` mode; see
   below). Contains the large project preview `#w-l` (10 image layers)
   and the side thumb-rail `#w-s-w` (10 thumbs).
6. `<div id="a">` — about page (hidden in `"out"` mode; see below).
7. `<canvas id="c2d">` — debug canvas, mobile-hidden.
8. `<nav id="nav">` — top-left wordmark `A R I S T I D E`,
   top-right `ABOUT` link (`#n1-0`), bottom-left role/availability
   block (`#n2`), bottom-right social links (`#n3`).

### Work mode layout (mode = `"w"` / `"in"`)

`#w` is shown by switching `t.mode = "w"`; the engine stops rendering
the home `<ul id="li">` and starts rendering `#w-l` / `#w-s-w`. The
preview area `#w-l` is sized with `aspect-ratio: 1660/1200`:
`96.2963vh × 54.16667vh` wide, `69.61178vw × 39.15663vw` tall.
The thumb-rail is a vertical strip on the right edge: `width: 8.88889vh`,
`height: 65vh`, containing 10 thumbs spaced `1.66667vh` apart, each
`5vh` tall. `#w-a` is an outlined "next" arrow at
`top: calc(17.5vh - 6px); right:44px; width: calc(8.88889vh + 12px);
height: calc(5vh + 12px); border: 1.34px solid <colour>`.

### About mode layout (mode = `"a"`)

`#a` is a full-viewport overlay. Inside:

- `#a-left` — left half. Top: `#a-nif-w` with two `a-nif` rows spelling
  `E S Y 6 8` / `3 3 0 9 8 L` (the designer's coordinates: ESY68
  33098L, treated as a "name" wordmark). Below: `#a-p` — the 4-line
  paragraph in `jws 11px/10px` uppercase.
- `#a-social` — bottom-left, vertical list of 7 links
  (`mailto:`, Instagram, Twitter, Behance, Dribbble, LinkedIn, GitHub).
- `#a-list` — bottom-right, four `.a-li` columns:
  `CLIENTS`, `AWWWARDS`, `FWA`, `BEHANCE`. Each column is `385px`
  tall and stacks ~14 items by absolute-positioned `<li>` children
  with hardcoded `top:` values (see `homepage.html:2997–3179`).
- `#a-design` — bottom-right "DESIGN BY JW.S (JON WAY STUDIO) ↗"
  link, hidden ≤ 1250 px wide.
- `#a-rights` — bottom-right "ALL RIGHTS RESERVED / ARISTIDE BENOIST
  2026®" in 10 px.
- `.e` — bottom-centre "ENTER" CTA with `.e-l` (1 px vertical line)
  and `.e-s` (14×14 SVG plus glyph); only visible on home (`#a`) but
  hidden on every other state.

---

## Components

### Project slide (`<li>` inside `#li`)

Each of the 30 projects renders as a `<li>` with identical structure:

```
<li>                                     ← absolute, full-viewport
  <div class="pgn">                      ← "01 / 30" paginator (top-mid)
    <div class="pgn-a"><div>01</div></div>
    <div class="pgn-b"><div>30</div></div>
  </div>
  <div class="t t0 tt">                  ← title line 1, per-letter split
    <div><div>h</div></div> <div><div>o</div></div> …
  </div>
  <div class="t t0 tb">                  ← title line 2 (top:50%)
    <div><div>G</div></div> <div><div>u</div></div> …
  </div>
  <div class="i-l">                      ← info table, bottom-left of centre
    <div><div>A</div><div>COMPLETED</div><div>FEBRUARY 2022</div></div>
    <div><div>B</div><div>TYPE</div><div>PROMOTIONAL</div></div>
    <div><div>C</div><div>ROLE</div><div>FULLSTACK DEV & MOTION</div></div>
    <div><div>D</div><div>CLIENT</div><div>MGM STUDIOS - WATSON DG</div></div>
  </div>
  <div class="i-r">                      ← info prose, bottom-right of centre
    <div><div>EXPLORE BEHIND-THE-SCENES …</div></div>
    <div><div>RIDLEY SCOTT'S HOUSE OF GUCCI..</div></div>
  </div>
  <a class="e line-w" href="/house-of-gucci">     ← "EXPLORE" CTA
    <div class="e-t"><div>EXPLORE<div class="line">…</div></div></div>
    <div class="e-l"><div></div></div>            ← 1 px vertical line
    <div class="e-s"><div>                       ← SVG plus
      <svg viewBox="0 0 14 14"><polygon … /></svg>
    </div></div>
  </a>
</li>
```

**Paginator `.pgn`** — left:0, width:100%, height:100%, margin-top:1px.
Two stacked `.pgn-a` and `.pgn-b` children animate `transform:
translate3d(-100%, 0, 0)` from `-101%` (hidden left) to `101%` (hidden
right). Current page number slides in from the left, previous number
slides out left.

**Title lines `.t`** — two lines, both absolutely positioned; the first
(`tt`) is centred vertically (`top: calc(50% - 33.125vh)` on wide
aspect, `calc(50% - 23.49398vw)` on narrow); the second (`tb`) is below
the centre. Each letter is its own absolutely-positioned `<div>` with a
nested `<div>` whose initial transform is `translate3d(-101%,0,0)` —
i.e. hidden to the left by one letter width. The class `L` pipeline
(see "Animations") lerps each letter's `transform: translate3d(x, y, 0)`
based on per-project `title.x.home[line][letter]` percentages.

**Info table `.i-l`** — `position:absolute; bottom:47px; left:50%;
transform:translateX(-100%)`. Inside: a flex-wrap row of three
absolutely-positioned `<div>`s per cell, sized `30px / 130px / 250px`.
First column is the 6 px letter (A/B/C/D), middle is the label, right
is the value. Hidden ≤ 1350 px wide.

**Info prose `.i-r`** — `position:absolute; bottom:48px; left:calc(50%
+ 140px)`. Two text lines, hidden ≤ 1350 px wide.

**CTA `a.e`** — `position:absolute; bottom:49px; left:50%;
transform:translateX(-50%); pointer-events:none`. Composed of:
`.e-t` (the "EXPLORE" word + an inline `.line` divider with two stacked
`background-color` bars), `.e-l` (a 1 px vertical line, height-derived),
`.e-s` (the 14×14 plus-glyph SVG). Each child is `overflow:hidden` and
animates `transform:translate3d(0,-110%,0) → 0` on enter.

### Loader (`<div id="load">`)

`position:absolute; top:35px; left:38px; z-index:9998; font-family:"TNY";
font-size:50px; line-height:44px; letter-spacing:-.01em`.
Three `<span>`s of `<span>`s; each inner `<span>` is one digit
(`0`, `0`, `1`), animating `transform:translate3d(-110%,0,0) → 0%` as
textures finish loading. Padding-right:10px; consecutive digits share
`margin-left:-10px` so the digit-reveal looks like a single sliding
number ("001" / "030" / "099"). On mobile (`max-width:700px`) the
loader is hidden along with the paginator.

### Navigation (`<nav id="nav">`)

`pointer-events:none` on the wrapper; child links are re-enabled
individually.

| Selector | Position | Style | Pointer events |
| --- | --- | --- | --- |
| `#n0` | top:35px left:38px | `TNY 50/44`, per-letter split, `letter-spacing:-.02em`, `transition:color 500ms cubic-bezier(.25,.46,.45,.94)` | `none` |
| `#n0 > span` (each letter) | float:left | `overflow:hidden` | none |
| `.n1` | top:40px right:50px | container for `ABOUT` / `CLOSE` | none on wrapper |
| `#n1-0` (`ABOUT`), `#n1-1` (`CLOSE`) | inline-block | `transition:color 500ms cubic-bezier(.25,.46,.45,.94)`, `will-change:transform,color` | none |
| `#n2` | bottom:48px left:50px | `jws 10/10`, two stacked `<div>` ("INDEPENDENT DEVELOPER" / "AVAILABLE APR. 2023"). `.n2::after` injects `↗` 5 px right of the last line. `transform:translate3d(0,101%,0)` (hidden below) on enter. `transition:color 500ms cubic-bezier(.25,.46,.45,.94)`; `::after` `opacity:0→1` over `400ms cubic-bezier(.25,.46,.45,.94)` on `:hover` | all |
| `#n3` | bottom:47px right:50px, text-align:right | three links (`EMAIL`, `INSTAGRAM`, `TWITTER`), each with `↗` `::after`. Same transform/transition logic as `#n2`. | wrapper none, each link `pointer-events:all` |

**Project switch button `#p`** — `top:49px; left:50%;
transform:translateX(-50%); pointer-events:none`. Composed of:
- `#p-s` (14×14 SVG cross, `pointer-events:none`),
- `#p-l` (1 px solid vertical line, scales with `min-height:870/810`
  breakpoints),
- `#p-t` (text "PROJECTS" + inline `.line` divider).
On click it morphs the cross SVG into a plus (or vice-versa) via
`this.poly.morph({d:0, e:"o5", shape:"cross"})`. On the home page it
navigates to the projects overview; from a work page it navigates back
to `/`.

**External-link arrow `↗`** — a Unicode glyph used in every external
link: `#n2`, `#n3`, `#a-social`, `#a-design`. Padding `5px` on the
opposite side of the link's `text-align`.

### Work-detail preview (`<div id="w">`)

- `#w-l` — the big preview frame. Centred: `top:50%; left:50%;
  transform:translate(-50%,-50%)`. Aspect-ratio locked: wide aspect
  gives `96.2963vh × 54.16667vh`; narrow gives `69.61178vw ×
  39.15663vw`. 10 child `<div>`s, each containing `.w-l-bg` (a solid
  block that flashes on image load) and `<img class="w-l-img" src="data:,">`
  (the placeholder `data:,` is replaced with the project image once
  decoded).
- `.w-l-img.fx` — the fade-in state, `transition: opacity 1000ms
  cubic-bezier(.39,.575,.565,1)`.
- `.w-l-bg.fx` — fade-out state, `transition: opacity 100ms linear
  1000ms` (100 ms ease after a 1000 ms delay).
- `#w-s-w` — vertical thumb rail on the right edge: `top:50%;
  right:50px; height:65vh; transform:translate(0,-50%)`.
  Each `.w-s` is `5vh` tall, `8.88889vh` wide, with `1.66667vh` gaps.
  `<img class="w-s-img">` starts at `opacity:0`; `.fx` class adds
  `opacity:1; transition:opacity 1000ms cubic-bezier(.39,.575,.565,1)`.
  Hidden ≤ 1150 px.
- `#w-a` — outlined "next" button, `1.34px solid <colour>` border,
  hidden ≤ 1150 px.

### About overlay (`<div id="a">`)

`position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none`.
Inherits colour `#BAC4B8` from inline `style`.

- `#a-nif-w` — display name `E S Y 6 8 / 3 3 0 9 8 L`, two rows of
  per-letter `<span>`s.
- `#a-p` — 4-line uppercase paragraph, `jws 11px/10px`, `padding-top:
  7.5vh`. Each line is its own `<span>` containing a `<span>` for the
  slide-up animation.
- `#a-social` — `position:absolute; left:50px; bottom:calc(6.66667vh
  + 50px); font-size:12px; line-height:14px`. 7 links, each a
  `<div><a …>LABEL ↗</a></div>`. Hidden items: `#a-social
  div:nth-child(4)` (Behance) and `(5)` (Dribbble) are hidden
  ≤ 850 px tall.
- `#a-list` — `position:absolute; bottom:calc(10.83333vh + 50px);
  right:0`. Four columns. Column widths: 260 px ≥ 1800 px; 230 px
  otherwise; 3rd column hidden ≤ 1550 px; all columns hidden ≤ 1050 px.
  Each item is positioned with `style="top: NNpx"` (hard-coded Y
  offsets, see `homepage.html:2997–3179`); `.a-li` itself is
  `height:385px; position:relative`.
- `#a-design` — `bottom:48px; right:0`, `jws 10/10`. Text:
  `DESIGN BY JW.S (JON WAY STUDIO) ↗`, href
  `https://www.jonway.studio`. Width: 1028 px ≥ 1800, 908 px
  1550–1800, 678 px 1250–1550. Hidden ≤ 1250 px.
- `#a-rights` — `bottom:48px; right:50px; text-align:right;
  font-size:10px; line-height:10px`. Two stacked `<div>` lines:
  `ALL RIGHTS RESERVED` / `ARISTIDE BENOIST 2026®`.

### Favicon / app icons

- `apple-touch__c95b0832.png` (580 B) — 180×180 transparent PNG.
- `fav__6d555951.ico` (6.3 KB) — ICO with the three-rect mark on dark.
- `svgs/fav__6d05a725.svg` (651 B) — SVG variant, `#171717` ground +
  `#B9C6B8` mark.
- `svgs/fav-mask__dee8d346.svg` (551 B) — Safari pinned-tab mask,
  `#B9C6B8` only.
- `other/manifest__1fd52375.json` — `{"name":"Aristide Benoist",
  "short_name":"Aristide Benoist", "icons":[{"src":"/static/fav/android-chrome.png",
  "sizes":"512x512", "purpose":"any maskable"}],
  "background_color":"#171717", "theme_color":"#171717",
  "display":"fullscreen", "start_url":"/"}`.

---

## JavaScript & Libraries

**No third-party libraries.** Confirmed by `grep -E "gsap|three|lottie|framer|tweenmax|scrolltrigger|barba|swup"` over `js/d__a7ac30d7.js` returning zero matches.

Everything is built on a tiny internal namespace `window.R` (RAF
singleton, easing curves, DOM helpers, custom `M` and `T`/`k`/`L`
animator classes) plus custom WebGL classes (`c`, `f`, `g`, `w`, `m`,
`u`, `l`, `e`, `d`, `i`, `s`, `t`, `y`, `v`, `x`, `O`, `P`, `L`, `k`,
`T`, `_`, `C`, `A`, `b`, `W`, `X`, `S`, `D`, `E`, `I`).

### Detected libraries

| Name | Version | Detection | Usage |
| --- | --- | --- | --- |
| **None** | — | — | All animation is hand-written RAF + Lerp + Damp |
| **Custom RAF singleton** | n/a | `js/d__a7ac30d7.js` `R.Raf = class{constructor(){… this.raf()} raf(){requestAnimationFrame(this.loop)} …}` | Single RAF loop drives every animator; pauses on `document.visibilitychange` via `R.Tab` |
| **Custom easing curves** | n/a | `R.Ease = { linear, i1…io6, o1…o6 }`; `R.Ease4 = bezier solver` | Penner-style easings (quad / cubic / quart / quint / expo) for `in`, `out`, `io` pairs + a custom 4-arg cubic-bezier solver |
| **Custom WebGL pipeline** | n/a | `getContext("webgl", {antialias:true, alpha:true})` with `OES_vertex_array_object` extension | Renders the home slider and work-detail previews |
| **Custom SPA router** | n/a | `history.pushState`, `onpopstate`, `R.Fetch` to `url+"?xhr=true&device="+device+"&webp="+webp` | One HTML, one JS, one CSS, all pages come from the same `_A.config.data` JSON |
| **Touch / pointer helpers** | n/a | `R.L(el, "a"|"r", "mousemove"\|"mouseWheel"\|"touchmove"\|"touchstart"\|"visibilitychange"\|"keydown"\|"click"…)` | Cross-browser event subscription |
| **Image loader** | n/a | `new Image(); e.onload = texInit; e.src = src+"?v="` + `a.decode()` for work-detail thumbs | Texture loading for WebGL + decode-deferred image fade-ins |

### Animation engine class map

| Class | Role | Defined at |
| --- | --- | --- |
| `R.Raf` | Global RAF singleton with `add({id,cb,sT})`, `remove(id)`, `loop(r)`, `pause()` | `js/d__a7ac30d7.js` |
| `R.RafR` | One animator binding to `R.Raf`: `run()` / `stop()` | same file |
| `R.M` | Property animator — lerps a dictionary of named props (`x`,`y`,`r`,`s`,`o`, etc.) using a chosen curve. Outputs `transform: translate3d(…) rotate(…) scale(…)` plus `opacity`. | constructor at start of `d.js` |
| `R.TL` | Timeline — chained `from({…}).play({d,e,delay})` | right after `R.M` |
| `R.Delay` | One-shot timer using `R.RafR`. `run()` / `stop()` / `loop(t)` | after `R.M` |
| `R.Ease` | `{linear, i1..i6, o1..o6, io1..io6}` (Penner) | inline |
| `R.Ease4` | Cubic-bezier solver; takes `[a,b,c,d]` and returns a 1-arg easing function | inline |
| `R.Lerp`, `R.Clamp`, `R.Damp`, `R.Remap`, `R.iLerp`, `R.PCurve` | Math helpers; `R.Damp` is `lerp(curr, targ, 1 - exp(log(1-e) * dt))` (frame-rate independent) | inline |
| `R.Select` | CSS-selector → element wrapper (`#id`, `.class`) | inline |
| `R.L` | Cross-browser event helper: `R.L(el, "a"|"r", eventName, cb, options)` | inline |
| `R.Fetch` | Tiny wrapper for `fetch(url, {method, headers, body, mode:"same-origin"})` with `.then(ok ? .json()|.text())` | inline |
| `R.Has`, `R.Is` | `hasOwnProperty` / type predicates (`str`, `obj`, `arr`, `def`, `und`) | inline |
| `R.Snif` | User-agent / Firefox detection | inline |
| `R.Rand` | `range(min,max,decimals)`, `uniq(n)` (Fisher-Yates) | inline |
| `R.Tab` | Visibilitychange listener; pauses RAF while tab hidden | inline |
| `R.G` | `id`, `class`, `tag` shortcuts (`R.G.id("gl")` etc.) | inline |
| `class c` | WebGL `Renderer`: `getContext("webgl",{antialias,alpha})`, `setBlendFunc(SRC_ALPHA, ONE_MINUS_SRC_ALPHA, ONE, ONE_MINUS_SRC_ALPHA)`, `setFaceCulling`, `clear(COLOR|DEPTH)`, `resize`, projection / model matrix plumbing | first-class class |
| `class l` | Camera — `near=1, far=2000, fov=45, type="perspective"`; `projectionMatrix`, `perspective(t)`, `orthographic(t)` | first-class class |
| `class f` | Engine wrapper around `Renderer` + `program` + `planeTex` + `planeBg`; owns the main RAF loop | first-class class |
| `class g` | Shader program — `crS`, `crP` (compile + link); `setUniform()`; `getL` | first-class class |
| `class w` | Texture manager — `tex[]` array, one `texInit(Image)` per project; loads `/static/media/<folder>/h/0.webp?v=N` | first-class class |
| `class m` | Background plane manager (one quad) | first-class class |
| `class u` | Per-texture plane mesh — owns `Float32Array` positions + `Uint16Array` indices + VAO; subdivides each plane into a `(hori × vert) = (20 × 2)` grid (see `t.pts.hori=20, vert=2`) | first-class class |
| `class T` | Single-letter animator — `prepare({isShow,isRunning})`, `loop({el,prog,lineProgEndFirst,isTx,rEase})`; updates `transform: translate3d(x,y,0)` per letter | first-class class |
| `class k` | Line-of-letters animator — owns `T` instances for one `.t > div` line, applies random `randUniq` ordering when `random:true` | first-class class |
| `class L` | Title-whole animator — owns `k` instances, exposes `motion({action, d, e, reverse})` to "show" or "hide" all letters with `delay` per line | first-class class |
| `class _` | `.e` / `.e-s` / `#p` / `#v` CTAs animator | first-class class |
| `class P` | Paginator — `.pgn-a` (current) + `.pgn-b` (previous) per project | first-class class |
| `class C` | Letter-move coordinator — `letter.move({start:"work",end:"home",d:1200})` | first-class class |
| `class A` | Work mode controller (`t.w`) — `init()`, `resize()`, `loop()`; coordinates per-project `pCurr`/`pTarg` lerping | first-class class |
| `class b` | Work-detail preview / thumb rail animator (`t.wFx`) | first-class class |
| `class W` | Navigation controller (`t.nav`) — `colorFix`, color lerping on hover | first-class class |
| `class X` | About overlay animator (`t.aFx`) | first-class class |
| `class S` | About-section controller (`t.a`) | first-class class |
| `class O` | Page-data controller (`t.data`) — owns `modeOut()`, `modeIn()`, `modeW()`, `modeOutIntro()`, `inGap()`, `outGapXW()`, `hToW()` layout functions | first-class class |
| `class D` | Index setter (`t.indexSet`) | first-class class |
| `class E` | `<li>` runner (`t.li`) — animates one `<li>` in, one out | first-class class |
| `class I` | Paginator controller (`t.pgn`) | first-class class |
| `class v` | Home controller (`t.h`) — wheel/drag/keyboard handler; `sensi=1.2`, `this.latency`, `this.x.curr/targ/currLatency` | first-class class |
| `class y` | Mouse-move tracker (`t.mm`) | first-class class |
| `class x` | Wheel handler (`t.sX`) — `mouseWheel` with `wheelDeltaX` / `deltaX`; `isFF = R.Snif.isFirefox` | first-class class |

### Engine state machine

The boot script (`<script>` inside `homepage.html:31`) sets:

```js
window._A = {
  config: { v: 2, isLocal: false },
  color: { bg: { hex:"#141414", rgbNorm:[0.07843,0.07843,0.07843] },
           txt: { hex:"#bac4b8", rgb255:[186,196,184] } },
  webp: true,
  is:     { 404:false, work:false, home:true, about:false },
  was:    { 404:false, work:false, home:false, about:false },
  route:  { new:{ url:"/", page:"home" }, old:{ url:false, page:false } }
};
```

Device sniff: `/Mobi|Andrdoid|Tablet|iPad|iPhone/.test(navigator.userAgent) || (MacIntel===platform && maxTouchPoints>1) ? "m" : "d"`. Mobile loads
`/static/css/m.css` + `/static/js/m.js`; desktop loads
`/static/css/d.css` + `/static/js/d.js`. (We have `d.css` and `d.js`
in the dump.)

Engine constructor builds the singleton with these initial values
(`js/d__a7ac30d7.js` engine class body):

```js
t.isIntro = true;
t.needGL  = true;
t.prop    = ["x","y","w","h","light","multiply","o","pY","scale"];
t.propL   = t.prop.length;       // 9
t.mode    = "out";
t.modePrev= t.mode;
t.lerp = {
  tr:      { out:.07, in:.07, w:.07, a:.07 },     // translation lerp factor
  scroll:  { out:.08, in:.07, w:.07, a:.08 },     // scroll lerp factor
  latency: { out:.08, in:.3,  w:.07, a:.08 }      // latency lerp factor
};
t.cursor = { x:0, y:0 };
t.latency= { x:0, rotate:0 };
```

### GLSL shader sources

There is **one shader pair**, with the vertex shader doing the curved
distortion and the fragment shader doing the texture sample + tint
mix. Inline in `js/d__a7ac30d7.js`:

**Vertex shader** (`r.vertex`, around line containing
`"precision highp float;attribute vec2 a;…"`):

```glsl
precision highp float;
attribute vec2 a;             // position
attribute vec2 b;             // texcoord
varying vec2 c;               // uv → fragment
varying float d;              // edge mask → fragment
uniform mat4 e;               // projectionMatrix
uniform mat4 f;               // modelView (camera) matrix
uniform float g;              // curve strength (0..1)
uniform float h;              // curve threshold (in NDC units, ~500 * winWpsdW)
float i(float m){ return m<.5 ? 2.*m*m : -1.+(4.-2.*m)*m; }   // smoothstep
void main(){
  vec4 j = f * vec4(a, 0., 1.);
  float z = 0.;
  float k = abs(distance(j.x, 0.));
  if(k < h){
    z = (h - i(k/h) * h) * g;        // parabolic lift in z
  }
  gl_Position = e * vec4(j.xy, j.z + z, j.w);
  c = b;
  d = min(z * .005, 0.7);            // clamped edge mask
}
```

**Fragment shader** (`r.fragment`):

```glsl
precision highp float;
varying float d;
varying vec2 c;
uniform sampler2D tex;
uniform vec2 m;       // texture offset/scale
uniform int n;        // hasTex (0/1)
uniform float o;      // plane `o` opacity (lerped)
uniform vec3 p;       // tint color (lerped to current project bg)
uniform float q;      // multiply strength (project-specific)
uniform float r;      // per-project alpha multiplier
uniform float y;      // vertical scroll (for texture pan)
void main(){
  vec4 s = vec4(p.r, p.g, p.b, 1);                       // tint base
  vec4 t = s;
  if(n == 1){
    vec4 u = texture2D(tex, vec2((c.x - .5) * m.x + .5,
                                 (c.y - .5) * m.y + .5 + y));
    float v = (u.r + u.g + u.b) / 3.;                    // luminance
    t = mix(vec4(v,v,v,.4), u, d + o);                   // edge fade-in
    t = mix(t, t * s, q);                                // multiply by tint
    t = vec4(t.rgb, t.a * r);                            // alpha
  }
  gl_FragColor = t;
}
```

### WebGL state

- Context: `getContext("webgl", {antialias:true, alpha:true})` with
  fallback to `getContext("experimental-webgl")`.
- Extensions: `OES_vertex_array_object` (only).
- State cache: `{depthTest:null, cullFace:null}` to avoid redundant GL
  state changes.
- Blending: `enable(BLEND); blendFuncSeparate(SRC_ALPHA, ONE_MINUS_SRC_ALPHA, ONE, ONE_MINUS_SRC_ALPHA)`.
- Culling: optional, driven per geometry (`mode:"TRIANGLE_STRIP", face:"FRONT"`).
- DPR: hard-coded `dpr:1.5` (engine constructor).
- Camera: `near=1, far=2000, fov=45, type:"perspective"`.
- Geometry mode: `TRIANGLE_STRIP`. Indices are generated for a
  `(20 × 2)` plane grid (20 horizontal × 2 vertical subdivisions).
- Texture filter: `MIN_FILTER = MAG_FILTER = LINEAR`,
  `WRAP_S = WRAP_T = CLAMP_TO_EDGE`. Image source is `RGBA` /
  `UNSIGNED_BYTE`.

---

## Animations (Catalog)

### Easing curves (`R.Ease`, `R.Ease4`)

All Penner-style, defined as `R.Ease.<key>(t) => number`:

| Key | Curve | Approximation |
| --- | --- | --- |
| `linear` | identity | `t` |
| `i1`, `o1`, `io1` | sine | `1 - cos(t * π/2)` etc. |
| `i2`, `o2`, `io2` | quadratic | `t*t` / `t*(2-t)` / blend |
| `i3`, `o3`, `io3` | cubic | `t³` / `--t*t*t + 1` |
| `i4`, `o4`, `io4` | quartic | `t⁴` / `1 - --t*t*t*t` |
| `i5`, `o5`, `io5` | quintic | `t⁵` / `1 + --t*t*t*t*t` |
| `i6`, `o6`, `io6` | exponential | `2**(10*(t-1))` |

`R.Ease4([a,b,c,d])` solves a cubic-bezier with two roots via
Newton-Raphson + bisection fallback.

### CSS transitions (`css/d__cc8c00bb.css`)

| Selector | Property | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `.line div:last-child` | `background-color` | `500ms` | `cubic-bezier(.25,.46,.45,.94)` | hover / colour fix |
| `.line div:first-child` | `background-color` | `500ms` | `cubic-bezier(.25,.46,.45,.94)` | hover / colour fix |
| `#n0 span span`, `#n1-0`, `.n2` | `color` | `500ms` | `cubic-bezier(.25,.46,.45,.94)` | hover / page change |
| `#n2::after`, `.n3::after` | `opacity` | `200ms` | `cubic-bezier(.25,.46,.45,.94)` | hover-in |
| `#n2:hover>div:last-child .n2::after`, `.n3:hover::after` | `opacity` | `400ms` | `cubic-bezier(.25,.46,.45,.94)` | hover-out |
| `.w-l-bg.fx` | `opacity` | `100ms linear 1000ms` | linear | image load (background flash) |
| `.w-l-img.fx` | `opacity` | `1000ms` | `cubic-bezier(.39,.575,.565,1)` | image decode complete |
| `.w-s-img.fx` | `opacity` | `1000ms` | `cubic-bezier(.39,.575,.565,1)` | thumb decode complete |

No `@keyframes` are defined in CSS.

### JS-driven animations

| # | Name / source | Trigger | Duration | Easing | What animates |
| --- | --- | --- | --- | --- | --- |
| 1 | `R.M` (property animator) on `.t > div > div` (`class L.motion`) | Page change to home (`fx.title({a:"show"})`) | `d:1600` (ms) | `e:"o6"` (expo out) | Each letter's `transform: translate3d(x, y, 0)` from `start=-101%` → `end=0%` (per-project `title.x.home[line][letter]` percentage), with per-letter `delay = 0.022 * index`. `delay:0` for line 1, `delay:400` for line 2. |
| 2 | `R.M` on `.i-l > div > div` (`fx.info`) | Page change | `d:1600` | `e:"o6"` | `transform: translate3d(0, -101%, 0) → 0` (slide up from below); `delay:0` for show, `delay:0` for hide |
| 3 | `R.M` on `.i-r > div > div` (`fx.info`) | Page change | `d:1600` | `e:"o6"` | Same as `.i-l` |
| 4 | `R.M` on `.e-t`, `.e-l`, `.e-s` (`fx.explore`) | Page change | `d:1600` | `e:"o6"` | Slide-up from `translate3d(0,110%,0)`; `delay:600` for show, `delay:0` for hide |
| 5 | `R.M` on `#p-s-p` polygon (`fx.project`) | `mode` change home → work | `d:500` hide / `d:1600` show, `delay:0/400` | `e:"o6"` | Polygon `points` attribute morph (`cross` ↔ `plus`); `delay:400` for show, `delay:0` for hide |
| 6 | `R.M` on `<li>` opacity (`t.li.run({index})`) | Index change | `d:0`, `d:1600` | `e:"o6"` | Outgoing `<li>` opacity `1→0`, incoming `0→1`; `delay:0` |
| 7 | `R.M` on `#p-s-p` morph (`this.poly.morph({d:0,e:"o5",shape:"cross"})`) | Home page load (mode init) | `d:0` (instant) | `e:"o5"` | Polygon points |
| 8 | `R.M` on `#nav` colour (`nav.colorFix({default:true})`) | Page change | `d:500` | `e:"o6"` | Nav elements' `color` property to default `#BAC4B8` |
| 9 | `R.M` on nav colour (`nav.color({default:false})`) | Work detail hover | `d:500` | `e:"o6"` | Nav colour to per-project accent |
| 10 | `class v` wheel/drag (`this.x.targ`) | `mouseWheel` / `mousemove` / `touchstart` | not a single duration; runs every frame | exponential damping `1 - Math.exp(log(1-.07)*dt)` ≈ 7 % per frame at 60 fps | WebGL plane `x`, `y`, `w`, `h`, `o`, `multiply`, `light` uniforms; also background colour lerp `R.Damp(curr, targ, .05)` |
| 11 | `class v` rotation (`latency.rotate`) | same | per-frame | same | `R.Clamp(latency/500, -2, 2)` clamp, multiplied by `(1.7 if dragging else 2)` |
| 12 | `R.M` on `<li>` per-letter (`class L.motion` hide) | Page leave | `d:500` hide | `e:"o6"` | Letters slide left to `translate3d(-101%,0,0)`; reverseable via `reverse:true` |
| 13 | `class A` per-project plane (`pCurr`, `pTarg`) | Index change / mode change | not single; frame loop | exponential damping | per-project `pCurr[i]` lerps to `pTarg[i]`; fields `x`, `y`, `w`, `h`, `o`, `light`, `multiply`, `pY`, `scale` |
| 14 | `class b` (`wFx`) intro / resize | Work mode init | frame loop | exponential damping | work-detail preview image position, opacity |
| 15 | `class C` `letter.move({start:"work",end:"home",d:1200})` | Project click from home | `d:1200` | (default) | Coordinates interpolated between home position array and work-position array for every letter |
| 16 | `class X` `aFx.play({a:"show",d:1600,delay:100})` | Home → About | `d:1600` | `e:"o6"` | About overlay elements fade / slide in |
| 17 | `class X` `aFx.play({a:"hide",d:500})` | About → Home | `d:500` | `e:"o6"` | About overlay fades out |
| 18 | `class I` paginator (`pgn.up()` / `.down()`) | Index change | frame loop | exponential damping | `transform: translate3d(-100%,0,0) → 0` (current), `0 → 100%` (previous) on `.pgn-a` / `.pgn-b`; `e:"o6"` |
| 19 | `R.Delay` async image-load stagger (`imgDelay[i][t] = new R.Delay(cb, e)`) | Image `decode()` resolves | `e = 100ms` (large image) / `e = 80 * mediaIndex ms` (work thumbs) | linear | `.fx` class added to `w-l-img` / `w-s-img`, triggering the 1000 ms opacity fade |
| 20 | RAF color-lerp (`R.Damp(curr, targ, .05)`) | Page / index change | frame loop | exponential damping | Per-project background colour channels (RGB, normalised) — 5 % per-frame approach |
| 21 | Cross-tab pause (`R.Tab`) | `visibilitychange` | instant | — | All RAF animations pause (singleton sets `this.on=false`); resumes on `visibilitychange` back |

### Easings used by call site

Histogram from `grep 'e:"<key>"'` over `js/d__a7ac30d7.js`:

| Easing | Count | Where |
| --- | --- | --- |
| `o6` (expo out) | 8 | All page-level animations |
| `o3` (cubic out) | 7 | Sub-animations, `.e-t` etc. |
| `1f` (custom) | 6 | Letter staggers |
| `o5` (quint out) | 4 | `#p` close-button morph, polygon morph |
| `cross` | 2 | Polygon point morphing (`#p-s-p` ↔ `e-s-p`) |
| `polygon` | 2 | Polygon point morphing (reverse) |
| `o6`, `o6`, `o3`, `o3`, `o3` | … | Page transitions |

### Special easing keys

- `e:"cross"` and `e:"polygon"` are polygon-morphing keys (`R.Svg.split` /
  `R.Svg.shapeL`) — used to morph `#p-s-p` (the close cross) into the
  14×14 plus glyph, and vice versa, with `d:0` for instant morph on
  load.
- `e:"html"`, `e:"perspective"`, `e:"2fv"`, `e:"1i"`, `e:"3fv"`, `e:"d"`
  are **shader uniform type tags**, not easings (used by `class g` to
  declare uniform kinds).

### Durations used

Histogram from `grep 'd:<num>'`:

| Duration (ms) | Count | Use |
| --- | --- | --- |
| `0` | 5 | Init morphs |
| `500` | 24 | Quick hide / colour fix / nav hover |
| `700` | 2 | Less-common tween |
| `1200` | 3 | Letter coordinate move |
| `1600` | 27 | Standard page-change animation (show) |

---

## Assets

### Fonts (self-hosted)

| File | URL | Size | Format | Detected family | License |
| --- | --- | --- | --- | --- | --- |
| `fonts/t__847aac8f.woff2` | `/static/font/t.woff2` | 2 760 B | WOFF2 | `TNY` (display, weight 400) — used for `#load`, `.t`, `.a-nif` | Not observed (probably proprietary) |
| `fonts/jw__19210970.woff2` | `/static/font/jw.woff2` | 4 228 B | WOFF2 | `jws` (body, weight 700) — used for `body`, `.i-l`, `.e line-w`, `.a-p`, `.a-social`, `#a-rights` | Not observed (probably proprietary) |

### WebGL textures (referenced but not in dump)

Each project's hero image is served from `/static/media/<folder>/h/0.<webp|jpg>?v=2`:

```
/static/media/house-of-gucci/h/0.webp
/static/media/ph/h/0.webp
/static/media/canals/h/0.webp
/static/media/jmm/h/0.webp
... (one per project, 30 in total)
```

These were **not downloaded** by the dump (the manifest errors section
lists 11 URLs that failed, none of them these texture paths — they're
loaded by JS, not by static HTML scraping). Total referenced: 30
images × ~300 KB each ≈ 9 MB.

### Work-detail images (referenced but not in dump)

Each project's `media[]` array is a list of media indices (5–8 per
project, total ~210). Each media file is at
`/static/media/<folder>/w/<l|s>/<index>.<webp|jpg>?v=2`. e.g.:

```
/static/media/house-of-gucci/w/l/0.webp
/static/media/house-of-gucci/w/s/0.webp
/static/media/house-of-gucci/w/l/2.webp
...
```

`l` images are large (rendered to `#w-l`); `s` images are thumbnails
(rendered to `#w-s`). Loaded on demand when the project is opened in
work mode.

### Inline SVG (in HTML)

| Selector | Where used | viewBox | Purpose |
| --- | --- | --- | --- |
| `.e-s > div > svg` (polygon points `7,11.042 6.08,…`) | Every `<li>` "EXPLORE" CTA | `0 0 14 14` | Plus / cross glyph |
| `#p-s > div > svg` (polygon `#p-s-p` 8-point star) | `#p` close button | `0 0 14 14` | Cross / close-project glyph |

### Static SVG

| File | URL | Size | Purpose |
| --- | --- | --- | --- |
| `svgs/fav__6d05a725.svg` | `/static/fav/fav.svg?2` | 651 B | SVG favicon, 16×16 viewBox, three `#B9C6B8` vertical rects on `#171717` |
| `svgs/fav-mask__dee8d346.svg` | `/static/fav/fav-mask.svg?2` | 551 B | Safari pinned-tab mask; same three-rect mark in pure `#B9C6B8` |

### Raster images

| File | URL | Size | Dimensions | Format | Purpose |
| --- | --- | --- | --- | --- | --- |
| `images/fav__6d555951.ico` | `/static/fav/fav.ico?2` | 6 318 B | 32×32 (assumed) | ICO | Standard ICO favicon |
| `images/apple-touch__c95b0832.png` | `/static/fav/apple-touch.png?2` | 580 B | 180×180 | PNG (transparent) | iOS home-screen icon |
| `images/1200-630__ad072ac8.jpg` | `/static/og/1200-630.jpg` | 77 589 B | 1200×630 | JPEG | Open Graph share image (referenced in `<meta property="og:image">`) |

### Other files

| File | URL | Size | Format | Purpose |
| --- | --- | --- | --- | --- |
| `other/manifest__1fd52375.json` | `/static/fav/manifest.json?2` | 245 B | JSON | Web app manifest (PWA); `{name, short_name, icons, background_color:#171717, theme_color:#171717, display:"fullscreen", start_url:"/"}` |

### CSS

| File | URL | Size | Source |
| --- | --- | --- | --- |
| `css/d__cc8c00bb.css` | `/static/css/d.css?2` | 9 485 B | Desktop stylesheet (only this is in the dump; the `<style>` block in head also embeds 1.2 KB of reset + `@font-face`) |

### JS

| File | URL | Size | Source |
| --- | --- | --- | --- |
| `js/d__a7ac30d7.js` | `/static/js/d.js?2` | 69 520 B (~67.9 KB) | Desktop bundle; entire app engine, WebGL pipeline, animators |

### HTML

Three near-identical HTML snapshots:

| File | URL | Size | Source |
| --- | --- | --- | --- |
| `html/asset_11__0b0df12b` | `/` | 4 453 B | Initial HTTP response, no XHR payload |
| `html/asset_12__0b0df12b` | `/` | 4 453 B | Same content, re-discovered |
| `html/asset_18__0b0df12b` | `/` | 4 453 B | Same content, re-discovered at depth 2 |
| `html/asset_30__0b0df12b` | `/` | 4 453 B | Same content |
| `html/asset_16__f94aba49` | `/?xhr=true&device=d&webp=true` | 100 329 B | XHR JSON response: `{app:"…", cache:{…}, routes:{…}, js:{psd:{w:1600,h:1200}}, data:{work:[30 items], workL:30}}` |
| `playwright/homepage.html` | rendered DOM | 82 708 B | Playwright-captured DOM (used because raw `/` response is a thin shell) |

---

## Motion & Interaction

### Interaction surface

| Input | Where listened | Effect |
| --- | --- | --- |
| Mouse wheel (`mousewheel` / `wheel`) | `class x` (`t.sX`) on `document` | Increments `t.h.x.targ` by `wheelDeltaX || -deltaX`; target index = `Math.round(x.targ / gapXW)`; clamps `[0, workL-1]`; mode changes to `"in"` once a target is set |
| Mouse move (`mousemove`) | `class y` (`t.mm`) on `document` | Updates `t.cursor.x`, `t.cursor.y`; only takes effect while `isDown` |
| Mouse down (`mousedown` on `<li>`) | per-project letter container | Starts `isDragging`; tracking horizontal pixel offset |
| Mouse up / mouse leave | per-project letter container | Ends drag, snaps to nearest project if drag distance ≥ 6 / sensi |
| Touch start / touch move | `class x` | Same as mouse path on touch devices |
| Click on `<a id="n0">` | nav | Triggers `t.h.modeOut()` if `mode === "out"`; goes to `/` |
| Click on `<a id="n1-0">` ("ABOUT") | nav | Mode → `"a"`, runs `aFx.play({a:"show",d:1600,delay:100})` |
| Click on `<a id="n1-1">` ("CLOSE") | nav | Mode → `"out"`, runs `aFx.play({a:"hide",d:500,delay:0})` |
| Click on `<a id="p">` (PROJECTS / close) | top-centre | Morphs `#p-s-p` polygon; on home, navigates to projects; on work, navigates back to `/` |
| Click on `<a id="v">` (VISIT SITE) | bottom-centre | Opens `https://twitter.com/AristideBenoist` in new tab (the "VISIT SITE" label points at the Twitter link per the HTML — note this looks like an artefact of the build but is what the markup says) |
| Click on `a.e line-w` ("EXPLORE") | inside `<li>` | Navigates to project URL (e.g. `/house-of-gucci`) |
| Click on `<a id="n2">` (INDEPENDENT…) | nav | Opens `mailto:aristide.benoist@gmail.com` |
| Click on `a.n3` | nav bottom-right | Opens social links in new tab |
| Click on `#a-social a` | about overlay | Opens social link / email |
| Click on `a.w-s-img` | work-detail thumb rail | Switches the preview image; animates old out + new in |
| Click on `#w-a` | work-detail arrow | Next image (out of `mediaL`) |
| Keydown | `class v.key` | Esc → close work mode; arrow keys (assumed, not directly observed in dump) |
| `visibilitychange` | `R.Tab` | Pauses all RAF animations; resumes on focus |
| Window resize | `class e` (`win.resize`) + engine `resize` | Recomputes `t.win`, `t.ratio`, `t.psd*`, recomputes all `pCurr`/`pTarg`, re-runs letter resize, resets `<li>` index |

### Per-frame RAF loop

```
loop(r):
  if (!on) return
  if (!t) t = r
  RD = (r - t) / (1000/60)          // delta in 60-fps frames
  t = r
  for each entry in `this._`:
    sT += entry._.sT  (when resuming)
    entry.cb(e)                            // e = r (timestamp)
  requestAnimationFrame(this.loop)
```

Frame-rate-independent damping formula:
```
damp(curr, targ, e, dt) = lerp(curr, targ, 1 - exp(log(1-e) * dt))
```
Used everywhere a value lerps toward a target on every frame:
`tr` (translation lerp factor `0.07`), `scroll` (`0.07–0.08`), `latency`
(`0.07–0.30`), background colour (`0.05`).

### Kinematic constants

- `sensi = 1.2` — drag sensitivity; drag distance divided by `sensi`
  becomes the `x.targ` increment
- `isDraggingUp = Math.abs(targ - targPrev) / sensi > 6` — drag
  threshold for snap-to-project
- `latency.x = Math.min(Math.abs(latency)/h, o)` where `h = 500 / (e ? 1 : .6)` and `o = e ? 1 : .6` — feedforward "momentum" component
- `latency.rotate = Clamp(latency/500, -2, 2)` — rotation clamped to
  ±2; multiplier `(e ? 1.7 : 2)`
- `wheel` is normalised via `wheelDeltaX || -deltaX`

### Per-mode interactions

- `out`: wheel → `x.targ` updates; mousemove only updates cursor;
  `<li>` opacity and letter positions lerp toward the active index.
- `in` (single project still): wheel does nothing (still updates
  `x.targ` but doesn't transition); drag does nothing.
- `w` (work detail): mouse-wheel triggers image-pan (scroll via
  `lerp.scroll = .07`); image-fade-in uses CSS opacity transition.
- `a` (about): no scroll/wheel; only `Esc` closes.

### Honour-mode CSS

`html { -webkit-text-size-adjust: none; -webkit-font-smoothing:
antialiased; cursor: default; -webkit-tap-highlight-color: transparent; }`
plus a blanket reset `a, body, div, footer, h1, h2, header, html, img, li,
nav, p, span, ul { margin: 0; padding: 0; border: 0; font: inherit;
font-size: 100%; }`.

---

## Content & Voice

### Voice

Restrained, technical, third-person-describing-self. Punctuation is
deliberately quirky: the project descriptions end with double dots
(`..`), full-caps lockup for info labels (`COMPLETED`, `TYPE`, `ROLE`,
`CLIENT`, `EXPLORE`), no marketing prose. The home page is one
sentence per project: `<description prose>` + `.`.

### Observed copy

- **Hero description (about):** "ARISTIDE BENOIST IS A DEVELOPER WHO
  SPECIALIZES IN MOTION AND INTERACTION. AS AN INDEPENDENT, HE WORKS
  WITH COMPANIES, AGENCIES, STARTUPS AND INDIVIDUALS ALL OVER THE
  WORLD." (4 lines, uppercase, `jws 11/10`)
- **`<title>`:** "Aristide Benoist — Independent developer"
- **`<meta name="description">`:** "Aristide Benoist is a developer
  who specializes in motion and interaction. As an independent, he
  works with companies, agencies, startups and individuals all over
  the world."
- **Nav (`#n2`):** "INDEPENDENT DEVELOPER / AVAILABLE APR. 2023"
  (the dump's `n2` reads `AVAILABLE APR. 2023` even though the
  page-rendered date is 2026; appears to be a stale build artefact in
  the HTML).
- **Nav social (`#n3`):** "EMAIL / INSTAGRAM / TWITTER"
- **About social:** "EMAIL ↗ / INSTAGRAM ↗ / TWITTER ↗ / BEHANCE ↗ /
  DRIBBBLE ↗ / LINKEDIN ↗ / GITHUB ↗"
- **About credit:** "DESIGN BY JW.S (JON WAY STUDIO) ↗"
- **About rights:** "ALL RIGHTS RESERVED / ARISTIDE BENOIST 2026®"
- **Project paginator label:** "PROJECTS" (top-centre button text)
- **Twitter link label:** "VISIT SITE ↗" (in `#v`); the href actually
  points at `https://twitter.com/AristideBenoist`. The same label is
  repeated in `<a id="v">`.
- **Info-table keys (always):** A/B/C/D + COMPLETED / TYPE / ROLE /
  CLIENT.
- **Info-table values (per project):** e.g. project 1: COMPLETED
  `FEBRUARY 2022`, TYPE `PROMOTIONAL`, ROLE `FULLSTACK DEV & MOTION`,
  CLIENT `MGM STUDIOS - WATSON DG`.

### Clients list (`#a-list > li:nth-child(1) > .a-li`)

A → BEAR GRYLLS → DRIBBBLE → FUSE PROJECT → GOOGLE → HIMS & HERS →
INSTAGRAM → JACQUES MARIE MAGE → MGM STUDIOS → NETFLIX → OBAMA
FOUNDATION → RAPPI → SUPER FRIENDLY → TWITCH → WATSON DG → Z (16 items,
absolute-positioned with hardcoded top offsets).

### Awards list (`#a-list > li:nth-child(2..4)`)

| Source | Item | Note |
| --- | --- | --- |
| AWWWARDS | INDEPENDENT OF THE YEAR | 2 × |
| AWWWARDS | SITE OF THE MONTH | 3 × |
| AWWWARDS | SITE OF THE DAY | 30 × |
| AWWWARDS | DEVELOPER AWARD | 27 × |
| AWWWARDS | MOBILE OF THE WEEK | 6 × |
| AWWWARDS | MOBILE EXCELLENCE | 22 × |
| FWA | FWA OF THE MONTH | 1 × |
| FWA | FWAWWWARD | 2 × |
| FWA | FWA OF THE DAY | 22 × |
| BEHANCE | GRAPHIC DESIGN | 1 × |
| BEHANCE | GALLERY | 7 × |
| BEHANCE | INTERACTION | 11 × |

### Social handles (observed in HTML and JSON cache)

- Email: `aristide.benoist@gmail.com`
- Instagram: `https://www.instagram.com/aristidebenoist`
- Twitter: `https://twitter.com/AristideBenoist`
- Behance: `https://www.behance.net/aristidebenoist`
- Dribbble: `https://dribbble.com/aristidebenoist`
- LinkedIn: `https://www.linkedin.com/in/aristide-benoist`
- GitHub: `https://github.com/aristidebenoist`
- Design credit: `https://www.jonway.studio`

### Project URLs and external visit links (per project, from JSON)

| Folder | URL slug | External visit URL |
| --- | --- | --- |
| house-of-gucci | `/house-of-gucci` | `https://houseofgucci.aristidebenoist.com` |
| ph | `/paul-et-henriette` | (observed: visit field present) |
| … | … | (one `visit` field per project; 30 in total) |

---

## Information Architecture

```
/
├── (out mode)  ← 30-project horizontal slider
│   ├── canvas #gl              ← WebGL project textures (curved quad, multiply)
│   ├── <ul id="li">            ← 30 stacked <li> project slides
│   ├── <a id="p">              ← PROJECTS / close
│   ├── <a id="v">              ← VISIT SITE (Twitter)
│   ├── <div id="w">            ← hidden (work-detail container)
│   ├── <div id="a">            ← hidden (about overlay)
│   └── <nav id="nav">          ← ARiSTiDE / ABOUT / INDEPENDENT / EMAIL …
│
├── /<slug> (work mode, "w" / "in")
│   ├── canvas #gl              ← main project hero texture
│   ├── <ul id="li">            ← hidden (home slider)
│   ├── <a id="p">              ← back-to-home (close icon)
│   ├── <a id="v">              ← VISIT SITE
│   ├── <div id="w">            ← visible (work-detail)
│   │   ├── <div id="w-l">      ← big preview (10 image layers)
│   │   ├── <div id="w-s-w">    ← vertical thumb rail
│   │   └── <div id="w-a">      ← next-image arrow
│   ├── <div id="a">            ← hidden
│   └── <nav id="nav">          ← ARiSTiDE / CLOSE / INDEPENDENT / EMAIL …
│
└── /about (about mode, "a")
    ├── <div id="a">            ← visible (about overlay)
    │   ├── #a-left (#a-nif-w, #a-p)
    │   ├── #a-social
    │   ├── #a-list (clients + 3× awards)
    │   ├── #a-design
    │   └── #a-rights
    ├── <nav id="nav">          ← visible (with CLOSE instead of ABOUT)
    └── <canvas id="gl">        ← hidden (no project)
```

Route table (from `data.routes`, `html/asset_16__f94aba49`):
- 30 entries of `"/<slug>" → "work"` (all projects)
- `"/" → "home"`
- `"/about" → "about"`

Page title cache (from `data.cache`): each route has a `title`
e.g. `{"title":"Aristide Benoist — House of Gucci"}`. The
`document.title` is updated by the SPA when the route changes (note:
this is observable behaviour but the title-setter code path is not
visible in the d.js dump — the cache just holds the strings).

---

## Accessibility

| Aspect | Status | Evidence |
| --- | --- | --- |
| `<noscript>` fallback | Yes | `<noscript><div class="iss-w">Please enable JavaScript to view this website.</div></noscript>` (`homepage.html:3253`) |
| `<script nomodule>` IE fallback | Yes | Shows "Please update your browser to view this website." in `<div id="app">` (`homepage.html:3258`) |
| `lang="en"` on `<html>` | Yes | `<html lang="en">` (`homepage.html:2`) |
| `<meta name="viewport">` | Yes | `width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5` (`homepage.html:4`) |
| `<meta name="format-detection">` | Yes | `telephone=no` (prevents iOS phone-number auto-link) (`homepage.html:5`) |
| `aria-*` attributes | Not observed | The HTML has no `aria-`, `role=`, or `<label>` markup in the dump |
| Focus styles | Not observed | No `:focus-visible` / `:focus` rules in `d__cc8c00bb.css`; `cursor: default` on `html` removes the default focus ring from non-form elements |
| Keyboard navigation | Partial | Keydown listener (`class v.key`) handles some keys (Esc, arrow keys); but `<a>` is the only interactive element; no `tabindex` on `<li>` letters; tab order = nav links + project CTAs only |
| Touch targets | Large | `a.e line-w` is full-width over the bottom-centre area, well above 44 px; nav links are 10–12 px text in a `<div>` of ~140 px wide |
| `prefers-reduced-motion` | Not observed | No `matchMedia('(prefers-reduced-motion: reduce)')` branch in `js/d__a7ac30d7.js` |
| `prefers-color-scheme` | Not observed | Site is always dark; no `@media (prefers-color-scheme)` rule |
| Reduced-data / `Save-Data` | Not observed | Always loads `.webp` textures, no `loading="lazy"` on `<img>` |
| Form fields | None | No `<input>`, `<select>`, `<textarea>`, or `<form>` anywhere |
| `<title>` and meta description | Yes | Both present and unique |
| Open Graph | Yes | `og:type`, `og:url`, `og:title`, `og:description`, `og:image` (1200×630) all set |
| Twitter card | Yes | `summary` card with `site`, `creator`, `title`, `description`, `image` |
| `<link rel="canonical">` | Yes | `https://aristidebenoist.com` |
| `<link rel="mask-icon">` | Yes | Safari pinned-tab; `color="#0B0C0C"` |
| Apple touch icon | Yes | `/static/fav/apple-touch.png?2` |
| Web App Manifest | Yes | `display:"fullscreen"`, theme `#171717`, start_url `/` |
| Theme color | Yes | `<meta name="theme-color" content="#171717">` |
| `user-select: none` | Aggressive | `#app { -webkit-user-select:none; user-select:none }` prevents text selection across the entire app — typical for a portfolio site but breaks copy/paste |

**Summary:** the site is essentially **inaccessible to screen-reader
users** because every project slide is rendered as plain `<div>`s with
no semantic landmarks beyond `<main id="app">` and `<nav id="nav">`.
Project titles, info, and paginators are unannotated; the WebGL
canvas has no `aria-label`. The visual design takes priority over
assistive-technology support.

---

## Sources

### Primary

- `https://aristidebenoist.com` — home page
- `https://aristidebenoist.com/?xhr=true&device=d&webp=true` — XHR JSON
  data payload (used by the SPA)
- `https://aristidebenoist.com/static/css/d.css?2` — desktop CSS
- `https://aristidebenoist.com/static/js/d.js?2` — desktop JavaScript
- `https://aristidebenoist.com/static/font/t.woff2` — display font (`TNY`)
- `https://aristidebenoist.com/static/font/jw.woff2` — body font (`jws`)
- `https://aristidebenoist.com/static/fav/fav.svg?2` — SVG favicon
- `https://aristidebenoist.com/static/fav/fav-mask.svg?2` — mask icon
- `https://aristidebenoist.com/static/fav/fav.ico?2` — ICO favicon
- `https://aristidebenoist.com/static/fav/apple-touch.png?2` — Apple touch
- `https://aristidebenoist.com/static/fav/manifest.json?2` — PWA manifest
- `https://aristidebenoist.com/static/og/1200-630.jpg` — OG image

### Project pages (referenced)

- `/about`, `/bear-grylls`, `/ben-mingo`, `/benjamin-guedj`,
  `/canals`, `/capsulin`, `/crsa`, `/design-embraced`,
  `/digital-asset`, `/dribbble`, `/epicurrence-6`, `/epicurrence-8`,
  `/everest`, `/folio-v1`, `/folio-v4`, `/guillaume-belveze`,
  `/house-of-gucci`, `/jacques-marie-mage`, `/jenny-johannesson`,
  `/make-reign`, `/mank`, `/marry-monday`, `/monfrini`,
  `/new-company`, `/paul-et-henriette`, `/rappi-pay`, `/shallou`,
  `/stuuudio`, `/tm`, `/waka-waka-1`, `/waka-waka-2` (30 project URLs)

### External (in nav / about / credits)

- `https://www.instagram.com/aristidebenoist`
- `https://twitter.com/AristideBenoist`
- `https://www.behance.net/aristidebenoist`
- `https://dribbble.com/aristidebenoist`
- `https://www.linkedin.com/in/aristide-benoist`
- `https://github.com/aristidebenoist`
- `mailto:aristide.benoist@gmail.com`
- `https://www.jonway.studio` (design credit)
- `https://houseofgucci.aristidebenoist.com` (live project)

### Per-project external `visit` URLs

One per project, listed in `html/asset_16__f94aba49` under
`work[i].visit` (30 in total, only `house-of-gucci`'s was extracted
into this file).

### Dump files referenced

- `tools/tmp/aristidebenoist/manifest.json` — full scrape manifest
- `tools/tmp/aristidebenoist/playwright/homepage.html` — rendered DOM
- `tools/tmp/aristidebenoist/playwright/computed-styles.json` — Playwright
  computed-style snapshot (201 elements)
- `tools/tmp/aristidebenoist/playwright/homepage.png` — 1440×900 PNG
  (visual reference, not parsed by this agent)
- `tools/tmp/aristidebenoist/playwright/homepage-fullpage.png` —
  full-page PNG
- `tools/tmp/aristidebenoist/css/d__cc8c00bb.css` — desktop CSS
- `tools/tmp/aristidebenoist/js/d__a7ac30d7.js` — desktop JS bundle
- `tools/tmp/aristidebenoist/fonts/t__847aac8f.woff2` — display font
- `tools/tmp/aristidebenoist/fonts/jw__19210970.woff2` — body font
- `tools/tmp/aristidebenoist/html/asset_16__f94aba49` — XHR JSON
- `tools/tmp/aristidebenoist/html/asset_11__0b0df12b` — raw `/` HTML
- `tools/tmp/aristidebenoist/svgs/fav__6d05a725.svg` — SVG favicon
- `tools/tmp/aristidebenoist/svgs/fav-mask__dee8d346.svg` — mask icon
- `tools/tmp/aristidebenoist/images/fav__6d555951.ico` — ICO favicon
- `tools/tmp/aristidebenoist/images/apple-touch__c95b0832.png` — Apple touch
- `tools/tmp/aristidebenoist/images/1200-630__ad072ac8.jpg` — OG image
- `tools/tmp/aristidebenoist/other/manifest__1fd52375.json` — PWA manifest

---

## Changelog

- **2026-06-20** — Initial draft. Author: design.md_gen agent. Based
  on dump taken 2026-06-19T20:00:18Z (31 files, 11 errors, 737 105
  bytes). The agent was unable to view `homepage.png` directly
  (the model did not accept image input); visual reference for
  absolute pixel positions came from `playwright/computed-styles.json`
  (Playwright 1440×900 capture). Mobile (`m.css` / `m.js`) was not in
  the dump and is therefore not described.
