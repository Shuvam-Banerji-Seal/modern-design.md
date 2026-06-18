# Lusion — design.md

> A structured design specification of **https://lusion.co**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** design.md-gen
> **Source dump:** `tools/tmp/lusion/` (gitignored)

---

## Overview

Lusion is the marketing site for an award-winning 3D and interactive
web studio. The experience is dominated by a continuously-rendered
WebGL scene served by Three.js r158, layered behind an Astro-generated
DOM and an extensive audio-reactive UI. The visual language is
high-contrast monochrome (off-white #F0F1FA over deep black #000)
punctuated by saturated accents — an electric blue (#1A2FFB), a
lime-green "creative" highlight (#C1FF00), a magenta detail
(#8832F7), and a system-red error state (#FF4C41). Type is a single
humanist geometric sans (Aeonik) set at extraordinarily large display
sizes (up to ~144px on desktop) and supported by a custom display
mono (LusionMono) and IBM Plex Mono for utility text. The studio
positions itself around 3D craft, motion, and immersive web — the
homepage itself is the demo.

**Category:** Marketing / Portfolio (creative studio)
**Primary surface observed:** Homepage (`/`) with hero, featured
projects, reel, "goal/approach" tunnel, end section, and footer.
**Tone:** Confident, technical, premium, slightly cinematic. Sentence-
case headings, mostly two-to-six-word labels in the chrome, longer
prose only inside the "approach" copy block.
**Framework detected:** Astro (`/_astro/…` paths, hashed `about.CNa9RfUh.css`,
`hoisted.CJiXW_YI.js`) on top of a custom Three.js / GLSL scene with
hand-rolled TWEEN animation, plus framer-motion (ESM).

---

## Visual Language

### Color

Observed hex values are mapped to CSS custom properties on `:root`.
Astro emits the same names into the live DOM (e.g. `var(--color-blue)`).

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base) | `--color-black` | `#000000` | Page base on `is-white-bg` invert |
| Background (white) | `--color-white` | `#FFFFFF` | Cards, hero, default sections |
| Background (off-white) | `--color-off-white` | `#F0F1FA` | Newsletter input, secondary fills |
| Background (off-white-semi) | `--color-off-white-semi` | `rgba(240, 241, 250, 0.7)` | Translucent panel |
| Background (dark-white) | `--color-dark-white` | `#E4E6EF` | Pill button resting (`header-right-menu-btn` etc.) |
| Surface (charcoal) | `--color-grey-blue` | `#2B2E3A` | Talk button resting bg |
| Surface (slate) | — | `#34393F` | Status pill in footer |
| Footer bg | (rule) | `#121416` | Bottom section, scroll-nav bg |
| Accent (primary) | `--color-blue` | `#1A2FFB` | Active link bg, CTA arrow dot |
| Accent (deep) | `--color-dark-blue` | `#071BDF` | Hover state on blue accent |
| Accent (header) | `--header-color` | `#0016EC` | Header chrome |
| Accent (lime) | `--color-green` | `#C1FF00` | "creative" highlight, status text |
| Accent (purple) | `--color-purple` | `#8832F7` | Decorative text on detail pages |
| Accent (magenta) | `--color-project-details-logo-color` | `#FF00FF` | Reserved for project detail logo |
| Status (red) | `--color-red` | `#FF4C41` | Hot action / danger |
| Status (error) | `--color-error` | `#E90000` | Newsletter validation |
| Black bg surface | `--project-details-bg` | `#000000` | Project detail shell |

The site does **not** implement a true dark-mode toggle; instead the
`<html>` carries an `is-white-bg` class that is toggled on scroll to
flip which surface the canvas sits on. Favicon variants ship for
`prefers-color-scheme: light` and `dark`.

### Typography

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Logo / wordmark | `Aeonik` | 400 (regular) | `clamp(0.875rem, 1vw, 2rem)` | 1.0 | `0` |
| Tag / chip (md) | `Aeonik` | 500 (medium) | `14.4px` (1rem) | 1.1 | `0` |
| Tag / chip (sm) | `Aeonik` | 400 | `11.88px – 12.96px` | 1.4 | `0` |
| Body | `Aeonik` | 400 | `14.4px – 16px` | `1.15 – 1.4` | `0` |
| Body L (input, big paragraph) | `Aeonik` | 400 | `20px – 21.6px` | `1.15 – 1.4` | `0` |
| Section lead (h3) | `Aeonik` | 400 | `36px – 38.4px` | `1.1 – 1.15` | `0` |
| Feature / card title | `Aeonik` | 400 | `38.4px – 48.6px` | `1.0 – 1.15` | `0` |
| Reel / display | `Aeonik` | 400 | `8vw` (≈ `115.2px @ 1440w`) | 1.0 | `-0.02em` |
| Goal / display | `Aeonik` | 400 | `8vw – 10vw` | `1.0 – 1.15` | `-0.01em – -0.02em` |
| End-section hero | `Aeonik` | 400 | `10vw` | 1.0 | `0` |
| Project / inline mono | `IBMPlexMono` | 400 / 500 | inherits | inherits | `0` |
| Footer / status mono | `IBMPlexMono` | 500 | `11.88px` | `1.4` | `0` |
| Studio signature mono | `LusionMono` | 400 | `2.4rem` (decorative) | 1.0 | `0` |

All three families are self-hosted as `@font-face` from
`/assets/fonts/*.woff2` (with `.woff` fallback). The CSS only ever
spells `Aeonik`, `IBMPlexMono`, and `LusionMono` — no Google Fonts
requests are emitted. Headings are the **same family as body** at a
very large size; there is no separate display face.

### Spacing & radius

- **Base unit:** 4px. Body font-size is `1rem` (16px desktop, scales
  down on small viewports via `clamp`).
- **Section / page padding:** `var(--base-padding-y) var(--base-padding-x)`,
  where `--base-padding-y: clamp(30px, 4vw, 50px)` and
  `--base-padding-x: max(5vw, 40px)` (desktop) shrinking to
  `max(6vw, 60px)` mid-breakpoint, then `25px` then `15px` on mobile.
- **Section gap pattern:** 72px (`4.5rem`) between major sections,
  144px (`9rem`) above huge display headings (e.g. `h4` blocks).
- **Grid:** 12-column, `--grid-gap: 2vw` (desktop) / `4vw` (mid) /
  smaller on mobile. Spans are common 6, 5, 4, 12, 1 / span 12.
- **Radii:**
  - sm `3px` (corner crosses, tag boxes)
  - md `10px` (cards)
  - lg `15px` (project thumbnails)
  - xl `18px` (newsletter input)
  - 2xl `20px` (`--global-border-radius` default)
  - pill `6.25em – 87.5px – 100px` (header talk/menu buttons, status)
  - full `100%` (round status dots, indicator circles)
- **Shadows:** only one box-shadow is used in the design system:
  `0 6px 10px #0000000A, 0 2px 4px #0000000A` (≈ 4% black, 2-layer
  drop). It appears on rounded chips / buttons (`.button` style,
  inline-CTA "See all projects", etc.) and `box-shadow: none` is
  applied everywhere else. The site is otherwise flat.

### Iconography

- **Style:** custom outline icons, monochrome, `currentColor`-driven.
  Stroke width is implicit (no observed `stroke-width` rule on
  common icons; the artwork ships 1.5–2px equivalent at 24px).
- **Library:** hand-rolled SVG. The only first-party icon assets
  observed in the dump are `arrow-down.svg` and `arrow-right.svg`
  (both at `assets/images/icons/`, served from CSS via `url(...)`).
  Most other icons are **inline SVG** within the DOM (e.g. header
  back-arrow, the 9-point crosshatch decoration, the close cross in
  the contact panel).
- **Sizes:** 16px in body, 20–24px in nav, full-bleed inside CTAs
  (uses 100% width/height with `transition: color 0.5s` on the
  arrow path).
- **Crosshatch / cross motif:** a recurring visual signature is the
  tiny `+` crosshair — drawn as `.home-hero-scroll-container-cross`,
  `.scroll-nav-cross`, `.end-section-content-cross` — 10 instances
  in the DOM, used as section dividers, decorative ticks, and
  preloader crosses.

---

## Layout & Grid

- **Max content width:** none — sections are full-bleed but the 12-col
  grid (with `--grid-gap: 2vw`) implicitly keeps the content lane
  inside ~1440px on a standard desktop.
- **Page gutter:** `var(--base-padding-x)` = `max(5vw, 40px)` desktop,
  tightening to `60px` mid and `15–25px` on mobile.
- **Grid:** `display: grid; grid-template-columns: repeat(12, minmax(0, 1fr))`
  on every `.section`. Hero title sits at `grid-column: 4 / span 5`;
  featured block at `1 / span 12`; project list items at `span 6` on
  a 2-col float pattern.
- **Breakpoints:** 1280px (lg fold, `min-aspect-ratio: 21/9` shows
  alternate layout), 812px (tablet), 560px (small tablet), 400px
  (large phone), 380px (compact phone).
- **Vertical rhythm:** section title `h4` blocks carry a 144px top
  margin and 72px bottom margin; feature blocks 326–478px top
  padding to allow room for the 3D camera translation before text
  reveals.

**Homepage flow** (top → bottom):

1. Fixed `<header>` with Lusion wordmark (left), pill "Let's talk" +
   "Menu" buttons (right), and a `Labs` link badge.
2. **Hero** — full-viewport canvas with an astronaut figure inside a
   geometric structure; below the fold the section carries an
   oversized title with each word broken into per-character `.char`
   spans (145 occurrences) for reveal animation. A scroll indicator
   with crosshair ticks is centered.
3. **Featured** — a wide block with a giant H4 (line-1 + line-2, ~144px)
   reading "Bold Ideas, Brought to Life" plus a body paragraph and a
   round inline CTA ("Our Approach").
4. **Reel** — a video block on the right with a "PLAY / MUTE" overlay
   and a watch button (rounded 9.4em × 6em rectangle); on the left
   a large display headline that animates per word on scroll.
5. **Projects** — a 2-column list of `.project-item` cards; each
   card has a 65%-aspect image (rounded 15px), a small uppercase
   `.project-item-line-1` (type tag), and a 43.2px
   `.project-item-line-2` (project title).
6. **Goal / Approach** — a "tunnel" section where the camera pushes
   the user through a 3D corridor; two image-in/image-out panels
   float inside, and a massive display heading ("Where Creative
   Ideas Become Immersive Experiences") sits above a paragraph.
7. **End section** — black `#121416` bg, huge centered title with
   "Is Your Big Idea Ready to Go Wild?" CTA link, plus crosshatch
   decoration lines and a bottom scroll-up arrow.
8. **Footer** — newsletter signup, two contact columns (general +
   business), address (`Bristol BS1 4AA, United Kingdom`), social
   row (Twitter, Instagram, LinkedIn), and copyright / Labs link.

---

## Components

### Button — pill
- **Variants:** primary (blue `#1A2FFB` bg / white text), secondary
  (white bg / black text, optional 4% black drop-shadow), ghost.
- **Sizes:** sm `2.6em` tall, md `3.2em` tall (e.g. header talk),
  large `9.4em × 6em` for the reel watch button.
- **Anatomy:** label (Aeonik 14.4px @ 500, uppercase, tracking 0),
  optional leading dot, optional trailing 100% width arrow icon.
- **States:** resting (`bg: #2B2E3A` or `#FFFFFF`), hover
  (`bg: var(--color-blue)`, `transition: color .4s, background-color .4s`),
  active scale, focus (`:focus { outline: 0 }` — visually-driven focus
  only, see Accessibility).
- **Radius:** `6.25em` to `100px` — fully pill-shaped.

### Button — inline CTA ("Our Approach", "See all projects")
- **Anatomy:** black 1px dot, label, trailing arrow SVG, all inline
  in a flex row.
- **Background:** `rgb(255,255,255)` with the 2-layer 4% black drop.
- **Padding:** `14.4px 21.6px 14.4px 23.4px`.
- **Hover:** the arrow's `color` transitions over `0.5s`.

### Header
- **Position:** `position: fixed; z-index: 52; pointer-events: none`
  (chrome only, children re-enable pointer events).
- **Height:** driven by `--base-padding-y × 2` + content (≈ 100–116px).
- **Anatomy:** `#header-background` (transparent), `#header-logo`
  (left, 7.5em wordmark, `mix-blend-mode: exclusion`), `#header-center`
  (currently empty in dump, likely project-context back button),
  `#header-right` (talk button + menu button + sound button + Labs).
- **Behavior:** color inverts when `is-white-bg` class flips; logo
  uses `mix-blend-mode: exclusion` so the same black/white artwork
  reads on either surface.

### Header menu link (`#header-menu-link`)
- **Anatomy:** `<a>` overflow:hidden wrapper → animated background
  pill + label text + svg icon.
- **Background pill:** 100px-radius, animates from `scale(0)` to
  `scale(1)` on `.[--active]:before`, transitioning
  `cubic-bezier(.4,0,.1,1)`.
- **Label:** Aeonik 16→26px, line-height 1, padding `1em 1.625em`.

### Project item card (`.project-item`)
- **Anatomy:** `<a>` wrapper → `.project-item-main` (65% aspect
  frame) → `.project-item-image` (absolute, `object-fit: contain`,
  15px radius) → `.project-item-line-1` (uppercase tag, 12.96px) →
  `.project-item-line-2` (43.2px headline) → `.project-item-line-2-icon`.
- **Behavior:** text and image are `will-change: transform`; the
  image likely animates on scroll-in.

### Preloader (`#preloader`)
- Full-viewport black panel, `z-index: 200`.
- Centred `.preloader-percent-digit` row: each digit is a 1ch-wide
  float with `transform: translateY(-.05em)` for the rolling number
  effect (a classic "odometer" tween).
- Removed when the canvas reports "ready" (`html.is-ready`).

### Video overlay (`#video-overlay`)
- Covers the reel video. Has its own play/mute/progress controls
  (`#video-overlay__play-btn`, `#video-overlay__mute-btn`,
  `#video-overlay__progress-container`, `#video-overlay__vimeo-video`).
- A custom cursor SVG follows the pointer
  (`#video-overlay-cursor-svg`).

### Scroll navigation (`#scroll-nav-section`)
- Sticky right-side strip with crosshairs and a "next section"
  label, anchored to viewport edge.

### Footer (`#footer-section`)
- Three columns: address, enquiries + business, newsletter.
- Newsletter is a rounded `#F0F1FA` pill (`border-radius: 18px`)
  with an embedded `<input>` and a leading arrow.
- Status pill (open/closed) uses green dot / grey background.

### Crosshair decoration (`.home-hero-scroll-container-cross` etc.)
- 10 instances of an absolutely-positioned `+` glyph drawn with
  `::before / ::after` (1ch × 1ch lines). Used as decorative
  ticks across hero, scroll-nav, end-section, reel, footer.

---

## JavaScript & Libraries

All paths assume the dump at `tools/tmp/lusion/`.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Astro | 4.x-ish | `/_astro/about.CNa9RfUh.css`, `/_astro/hoisted.CJiXW_YI.js` | Static shell + island bundle |
| Three.js | r158 (advertised on `<canvas data-engine="three.js r158">`) | `WebGL2`, `WebGLRenderer`, `Scene`, `PerspectiveCamera`, `OrbitControls` (count: 47/157/37/20) | Hero & tunnel scene |
| GLSL (custom shaders) | — | `ShaderMaterial` (100 occurrences) | Per-pixel/vertex shaders for astronaut, tunnel, cross motifs |
| `EXRLoader` | bundled | 12 matches | HDR environment maps (`matcap__553dc3e2.exr`, `white_matcap__63660879.jpg`) |
| `PMREMGenerator` | bundled | 3 matches | Image-based lighting for the astronaut |
| `ACESFilmicToneMapping` | bundled | 3 matches | PBR output tone mapping |
| `MeshStandardMaterial` / `MeshPhysicalMaterial` | bundled | 10 / 2 matches | Astronaut, greeble, earth |
| `InstancedMesh` | bundled | 13 matches | Repeated greeble tiles, tunnel block wall |
| `BufferGeometry` | bundled | 59 matches | All bespoke geometry |
| `postprocessing` (vanruesc/postprocessing) | 0.1.x? (`0.1.17` referenced) | `Pass` (72), `postprocessing` (23) | SMAA lookup-area & search textures present; bloom-style effects likely in the same composer |
| SMAA | (lib) | `smaa-area.png`, `smaa-search.png` (113 / 33 KB) | Anti-aliasing |
| Custom TWEEN | — | `Tween` class — 46 matches, `requestAnimationFrame` (3), `getDelta` (3) | In-house tween engine (`new Tween(obj).to({...}).start()`) |
| framer-motion | 11.x (ESM) | 23 matches for `framer-`/`motion` patterns | Powers some scroll/UI micro-animations |
| Howler-style WebAudio | — | `AudioContext` references + 16 `.ogg` assets | Page has sound on/off (`#header-right-sound-btn`) |
| GLSL `matcap` shader | — | `matcap__553dc3e2.exr`, `white_matcap__63660879.jpg` | Custom material for astronaut helmet |
| Draco / KTX2 | — | 0 matches | Geometry is plain `.buf` binary buffers, not compressed |
| GSAP / Lottie / PixiJS / Barba | — | 0 matches | Not used; Lusion has its own stack |
| Cloudflare Turnstile | — | 2 fetch errors in manifest, blob URLs `challenges.cloudflare.com/...` | Anti-bot on the entry HTML; rendered DOM is what counts |

The 1.25 MB `hoisted.CJiXW_YI.js` is one monolithic ESM module — it
inlines the entire studio stack (Three.js + postprocessing + custom
TWEEN + the per-page scene). A grep for the version string
`"0.1.17"` (the only one present) suggests a recent
`postprocessing` library version; everything else is bundled.

---

## Animations (Catalog)

### CSS @keyframes

The shipped CSS (`about.CNa9RfUh__ef97230a.css`) declares exactly two
named keyframes — both 3-step Y-translate "roll" patterns, used for
narrative text/arrow motion.

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `arrow-animation` | `css/about.CNa9RfUh__ef97230a.css` (search for `arrow-animation`) | 1 cycle = 100% | steps-based (33% / 100%) | hover on arrow / scroll |
| `text-animation` | `css/about.CNa9RfUh__ef97230a.css` | 1 cycle = 100% | steps-based (33% / 100%) | scroll-into-view |

The keyframe bodies are:

```css
@keyframes arrow-animation {
  0%   { transform: translateZ(0); }
  33%  { transform: translate3d(0, 1em, 0); }
  100% { transform: translate3d(0, 1em, 0); }
}
@keyframes text-animation {
  0%   { transform: translateZ(0); }
  33%  { transform: translate3d(0, 1.5em, 0); }
  100% { transform: translate3d(0, 1.5em, 0); }
}
```

### CSS transition curves observed

| Curve | Used for |
| --- | --- |
| `cubic-bezier(.4, 0, .1, 1)` | Material-standard — header bg, button color, header-menu-link before-scale |
| `cubic-bezier(.35, 0, 0, 1)` | "Power ease-in" — page-leave transforms, colour shifts |
| `cubic-bezier(.16, 1, .3, 1)` | "Ease-out expo" — hero entry, large block reveals |
| `cubic-bezier(.4, .1, 0, 1)` | Sharp-out — popovers |
| `cubic-bezier(.4, 0, 0, 1)` | Accelerate-only — bg colour on tabs |
| `cubic-bezier(.1, 0, .1, 1)` | Linear-with-lag — overlay fade |

Default transition durations: `.2s` (micro), `.3s` (small), `.4s`
(medium), `.5s` (large/color), `.6s` (page-leave transform). Many
properties chain a delay (`.3s`, `.4s`, `.5s`) before the main
transition starts, producing the "staggered" feel on the menu links.

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| Custom `Tween` class | "odometer" preloader counter | page load, while `is-ready` is false | Per-digit float, `transform: translateY(-.05em)` per ms |
| Custom `Tween` class | `.char` letter reveal | scroll-into-view | 145 `.char` spans; one per letter of the hero title |
| Custom `Tween` class | `.word` slide | scroll-into-view | 108 `.word` spans for the goal/reel display copy |
| Custom `Tween` class | camera dolly through tunnel | scroll progress on `#home-goal` | Three.js camera tween bound to `vh * 4200` of scroll height |
| Custom `Tween` class | astronaut figure idle/in/out | on hero focus / scroll-out | `.buf` geometry (astronaut_helmet, astronaut_glove_shoes, astronaut_wearpack, astronaut_animations) swapped at thresholds |
| Custom `Tween` class | broken-glass shatter | focus on hero (after scroll) | `broken_glass__80b92809.buf` + `broken_glass_animation__67c4bd9a.buf` |
| `framer-motion` (ESM) | UI / micro-animations | scroll, hover | Used for the smaller chrome transitions that the Tween class does not own |
| Audio-reactive levels | `#header-right-sound-btn` canvas (WebAudio Analyser) | always-on when sound enabled | Drives header sound-button pulse |

### Page transitions

- A `#transition-overlay` element (position fixed) is present in the
  DOM and is the named hook for Astro's view-transition-style overlay.
  It is initially a thin panel that animates colour via the
  `transition: background cubic-bezier(.35,0,0,1) .5s` pattern.
- No `barba.js` / no named router — the page is effectively a single
  document with vertical scroll "sections" animated by the Tween
  engine.

### 3D scene timeline (hero)

Roughly:

1. `t=0ms` — preloader shows, canvas mount begins.
2. `t≈300ms` — camera zooms into the geometric structure.
3. `t≈1500ms` — astronaut animates in (`.buf` swap: `astronaut_in_animation__9005dea2.buf`).
4. `idle` — astronaut loop (`astronaut_animations__eaf6fd66.buf`),
   broken glass floating in space.
5. scroll-out (hero exit) — astronaut_out_animation__0eec8eeb.buf
   and greeble_base__627c00d8.webp take over.
6. Goal section — `line_goal__f194d0b1.buf`, `line_reel__e9e2bb08.buf`,
   `diamond__d393b984.buf`, `earth_card__7bb09005.buf` orbit around
   a tunnel built from `tunnel_block_base__4f038ee2.buf` and
   `tunnel_block_wall__52211c1c.buf` (363 KB).
7. End section — black void, `cross__b5c9946e.buf` (282 KB)
   shards drift behind the closing CTA.

The pipeline reuses the same shaders and postprocessing chain for
all sections; only the geometry buffer and camera path change.

---

## Assets

The dump at `tools/tmp/lusion/playwright/` mirrors the live runtime
fetched by the headless browser.

### 3D models / geometry

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `playwright/other/astronaut_animations__eaf6fd66.buf` | binary buffer | 328 KB | runtime only | astronaut idle loop |
| `playwright/other/astronaut_in_animation__9005dea2.buf` | binary buffer | 2 KB | runtime only | hero entry |
| `playwright/other/astronaut_out_animation__0eec8eeb.buf` | binary buffer | 3 KB | runtime only | hero exit |
| `playwright/other/astronaut_helmet__83bff209.buf` | binary buffer | 169 KB | runtime only | astronaut helmet mesh |
| `playwright/other/astronaut_helmet_glass__68baa504.buf` | binary buffer | 6 KB | runtime only | visor glass |
| `playwright/other/astronaut_glove_shoes__a498ebf5.buf` | binary buffer | 118 KB | runtime only | gloves + boots |
| `playwright/other/astronaut_wearpack__696f90c4.buf` | binary buffer | 189 KB | runtime only | life-support pack |
| `playwright/other/broken_glass__80b92809.buf` | binary buffer | 133 KB | runtime only | broken shards |
| `playwright/other/broken_glass_animation__67c4bd9a.buf` | binary buffer | 305 KB | runtime only | shatter keyframes |
| `playwright/other/cross__b5c9946e.buf` | binary buffer | 276 KB | runtime only | decorative cross mesh |
| `playwright/other/diamond__d393b984.buf` | binary buffer | 5 KB | runtime only | small diamond |
| `playwright/other/grid_base_hd__454df79e.buf` | binary buffer | 89 KB | runtime only | tunnel grid HD |
| `playwright/other/grid_base_ld__77a353bf.buf` | binary buffer | 2 KB | runtime only | tunnel grid LD |
| `playwright/other/grid_structure_hd__6fcdf629.buf` | binary buffer | 3 KB | runtime only | tunnel structure HD |
| `playwright/other/grid_structure_ld__ff11d4de.buf` | binary buffer | 12 KB | runtime only | tunnel structure LD |
| `playwright/other/tunnel_block_base__4f038ee2.buf` | binary buffer | 9 KB | runtime only | tunnel block base |
| `playwright/other/tunnel_block_wall__52211c1c.buf` | binary buffer | 356 KB | runtime only | instanced wall tiles |
| `playwright/other/line_goal__f194d0b1.buf` | binary buffer | 13 KB | runtime only | goal-tunnel accent line |
| `playwright/other/line_reel__e9e2bb08.buf` | binary buffer | 13 KB | runtime only | reel accent line |
| `playwright/other/earth_card__7bb09005.buf` | binary buffer | 14 KB | runtime only | earth card mesh |

All 3D assets arrive as runtime buffers, not standard `.glb`/`.gltf`/
`.obj`/`.fbx`. None ship as `tmp/lusion/models/`.

### PBR / HDR textures

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `playwright/images/matcap__553dc3e2.exr` | OpenEXR HDR | 589 KB | runtime | full-scene matcap |
| `playwright/images/white_matcap__63660879.jpg` | JPEG | 68 KB | runtime | secondary white matcap |
| `playwright/images/white_block__e679256c.webp` | WebP | 185 KB | runtime | default PBR diffuse |
| `playwright/images/astronaut_helmet_base__0f7b28b7.webp` | WebP | 239 KB | runtime | helmet basecolor |
| `playwright/images/astronaut_helmet_arm__83bb2da1.webp` | WebP | 242 KB | runtime | helmet AO/roughness/metallic |
| `playwright/images/astronaut_helmet_nor__390d5ded.webp` | WebP | 350 KB | runtime | helmet normal map |
| `playwright/images/astronaut_wearpack_base__14590244.webp` | WebP | 323 KB | runtime | pack basecolor |
| `playwright/images/astronaut_wearpack_arm__53839a10.webp` | WebP | 172 KB | runtime | pack AO/roughness/metallic |
| `playwright/images/astronaut_wearpack_nor__af54e407.webp` | WebP | 450 KB | runtime | pack normal |
| `playwright/images/astronaut_glove_shoes_base__6831b4f3.webp` | WebP | 348 KB | runtime | boots/gloves basecolor |
| `playwright/images/astronaut_glove_shoes_arm__76e869e8.webp` | WebP | 271 KB | runtime | boots/gloves AO/rough/metallic |
| `playwright/images/astronaut_glove_shoes_nor__3c920247.webp` | WebP | 426 KB | runtime | boots/gloves normal |
| `playwright/images/greeble_base__627c00d8.webp` | WebP | 270 KB | runtime | greeble basecolor |
| `playwright/images/greeble_arm__bab5aa4d.webp` | WebP | 346 KB | runtime | greeble AO/rough/metallic |
| `playwright/images/greeble_nor__81b79e64.webp` | WebP | 194 KB | runtime | greeble normal |
| `playwright/images/earth__8b0b2675.webp` | WebP | 1.6 KB | runtime | tiny earth texture |
| `playwright/images/earth_landscape__29cc4713.jpg` | JPEG | 239 KB | runtime | landscape |
| `playwright/images/home__a1021a7e.webp` … `home__d83beacb.webp` | WebP | 21–268 KB each | runtime | 9 home-scene captures (varying LOD) |
| `playwright/images/home_depth__*.webp` | WebP | 5–55 KB each | runtime | 8 depth-maps for the home scene |

PBR pipeline convention: each subject ships in three maps — `_base`
(diffuse), `_arm` (AO+Roughness+Metallic packed) and `_nor` (DXT5n
normal). WebP is used everywhere; JPEG only for photographic content.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Aeonik | 400 (regular), 400 italic, 500 (medium) | woff2 + woff | `tools/tmp/lusion/fonts/Aeonik-*.woff2` | yes |
| IBMPlexMono | 400, 500 | woff2 + woff | `tools/tmp/lusion/fonts/IBMPlexMono-*.woff2` | yes |
| LusionMono | 400 | woff2 + woff | `tools/tmp/lusion/fonts/LusionMono.*` | yes (custom studio face) |

All three are declared via `@font-face` with `font-display: block` —
the browser hides text until the file loads, which is what produces
the "white flash" between preloader and hero.

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `images/apple-touch-icon__c377a817.png` | PNG | 180×180 | 854 B | `https://lusion.co/assets/meta/apple-touch-icon.png` | iOS icon |
| `images/favicon__1a340ca4.ico` | ICO | 32×32 | 15 KB | `https://lusion.co/assets/meta/favicon.ico` | light-mode favicon |
| `images/favicon__dca1e251.ico` | ICO | 32×32 | 15 KB | `https://lusion.co/assets/meta/dark/favicon.ico` | dark-mode favicon |
| `images/favicon-16x16__559264ba.png` | PNG | 16×16 | 447 B | `https://lusion.co/assets/meta/favicon-16x16.png` | light |
| `images/favicon-16x16__a62a195d.png` | PNG | 16×16 | 448 B | `https://lusion.co/assets/meta/dark/favicon-16x16.png` | dark |
| `images/favicon-32x32__27063193.png` | PNG | 32×32 | 451 B | `https://lusion.co/assets/meta/favicon-32x32.png` | light |
| `images/favicon-32x32__ae086fb6.png` | PNG | 32×32 | 469 B | `https://lusion.co/assets/meta/dark/favicon-32x32.png` | dark |
| `images/social_sharing__013658bd.jpg` | JPEG | 1200×630 | 91 KB | `https://lusion.co/assets/meta/social_sharing.jpg` | OG image |
| `images/back__424925b4.png` | PNG | — | 49 KB | `https://lusion.co/assets/images/cards/back.png` | card back, CSS-loaded |

### SVGs & icons

- **Inline SVGs observed in HTML:** the `<canvas>` aside, the dump
  contains dozens of inline `<svg>` elements (logo wordmark,
  arrow-down, arrow-right, scroll indicator crosses, contact close
  cross, video cursor, "back" arrow). All are monochrome,
  `currentColor`-driven.
- **Standalone SVG files in dump:**
  - `svgs/arrow-down__3ea70f03.svg` — 312 B — `https://lusion.co/assets/images/icons/arrow-down.svg`
  - `svgs/arrow-right__a5157973.svg` — 701 B — `https://lusion.co/assets/images/icons/arrow-right.svg`
  - `svgs/safari-pinned-tab__3b416ce5.svg` — 3.2 KB — `https://lusion.co/assets/meta/safari-pinned-tab.svg`
- **Icon system:** custom hand-drawn; no Lucide / Phosphor / Heroicons
  references in the JS or HTML.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `playwright/media/desktop__249e57ec.mp4` | MP4 H.264 | 32 KB — reel placeholder / loop |
| `playwright/media/cinematic_0__79f4abd3.ogg` | OGG | 132 KB — ambient layer A |
| `playwright/media/cinematic_2__26767a9f.ogg` | OGG | 100 KB — ambient layer B |
| `playwright/media/cinematic_3__93eb4797.ogg` | OGG | 214 KB — ambient layer C |
| `playwright/media/generic__be6ef515.ogg` | OGG | 231 KB — generic sting |
| `playwright/media/generic_end__9f552416.ogg` | OGG | 465 KB — end-section sting |
| `playwright/media/glass_broken__e2776886.ogg` | OGG | 30 KB — broken glass SFX |
| `playwright/media/focus_0__76a589a1.ogg` | OGG | 10 KB — focus tick A |
| `playwright/media/focus_1__51e8a5ec.ogg` | OGG | 10 KB — focus tick B |
| `playwright/media/focus_2__f9d6cbdb.ogg` | OGG | 10 KB — focus tick C |
| `playwright/media/hover_0__d90fe9cf.ogg` | OGG | 6 KB — hover tick A |
| `playwright/media/hover_1__cbb83d14.ogg` | OGG | 6 KB — hover tick B |
| `playwright/media/hover_2__6fbd42d4.ogg` | OGG | 6 KB — hover tick C |
| `playwright/media/click_0__04313206.ogg` | OGG | 6.5 KB — click A |
| `playwright/media/click_1__f6dcaad4.ogg` | OGG | 6.3 KB — click B |
| `playwright/media/page_0__f193275f.ogg` | OGG | 21 KB — page transition A |
| `playwright/media/page_1__951878b1.ogg` | OGG | 21 KB — page transition B |

The presence of `focus_*`, `hover_*`, `click_*` triplets implies a
multi-variant sound design (the engine randomly picks one of three
variations per event) — a hallmark of in-house sound design rather
than a stock library.

---

## Motion & Interaction

### Principles
- Short, weighted, and consistently cubic-bezier'd. No flat `linear`.
- Default micro-duration: 200ms (`transition: .3s` for the in-between
  set). Default medium: 400ms. Default large / page-leave: 500–600ms.
- The signature ease is `cubic-bezier(.4, 0, .1, 1)` for chrome and
  `cubic-bezier(.16, 1, .3, 1)` for "soft-stop" reveals.
- No `linear` timing functions are used for color or transform; only
  the `@keyframes arrow-animation` / `text-animation` use a 3-step
  steps-feel (0% → 33% → 100% translateY).

### Specific behaviors
- **Header menu link hover:** the absolute-positioned background pill
  grows from `scale(0)` to `scale(1)` via `.[--active]:before`,
  transitioning `cubic-bezier(.4,0,.1,1)` over `.4s`. Text colour
  flips at the same time. (`#[--active]:before` is the pseudo-class
  the script applies.)
- **Header talk button:** label, leading dot, trailing arrow. On
  hover, the dot scales `1.15` and shifts via
  `cubic-bezier(.4,0,.1,1) .1s`; the button background goes from
  `#2B2E3A` → `#1A2FFB` over `.4s`.
- **Hero title letter reveal:** 145 `.char` spans fade and translateY
  in sequence, driven by IntersectionObserver + Tween.
- **Section reveal on scroll:** camera dolly + `transform: translate3d(...)`
  on `.will-change: transform` headings (e.g. `#home-goal-title`).
  Stagger between siblings: ~60–100ms.
- **3D camera translation:** `vh * 4200` worth of scroll height is
  consumed by the goal section — i.e. the user scrolls ~42 viewports
  to traverse the tunnel.
- **Audio toggle:** `#header-right-sound-btn` shows a small canvas
  (WebAudio analyser bars); toggling it mutes all `*.ogg` instances
  and pauses the reel video.
- **Page transition:** `#transition-overlay` fades a full-bleed panel
  using `transition: background cubic-bezier(.35,0,0,1) .5s`.

### Reduced motion
- Not observed as a first-class media query. The site ships
  fixed-duration tweens regardless of `prefers-reduced-motion`. (This
  is an accessibility miss; flagged below.)

---

## Content & Voice

- **Tone:** confident, technical, slightly cinematic. Sentences tend
  to be short and declarative; longer-form prose only appears in the
  "approach" body paragraph.
- **Sentence length:** short (3–8 words) in chrome and section
  labels; medium (12–22 words) in the body paragraph.
- **Capitalization:** Sentence case in headings (e.g. "Where creative
  ideas become immersive experiences"), Title Case only in
  proprietary nouns ("Lusion", "Labs", "R&D", "Awwwards", "FWA").
- **Punctuation:** Oxford comma not used. Em-dash style: `—` (U+2014)
  for asides in the body copy; never in chrome.
- **CTA vocabulary (paraphrased):** "Let's talk", "Menu", "Close",
  "Our approach", "See all projects", "Play", "Mute", "Subscribe",
  "Continue to scroll", "Next page", "Built by Lusion".

---

## Information Architecture

Top-level routes observed via the dump:

- `/` — marketing homepage (the only route scraped)
- `/website` — referenced in meta tags (likely a project subtype
  filter)
- `/labs` — referenced in the header as a sibling link to the
  in-house R&D playground (`labs.lusion.co`)
- `/about` — referenced via `#about-us` section anchor
- `/projects` — referenced via the projects nav link
- `/contact` — referenced via the contact nav link (and the
  `#header-right-talk-btn` opens the same panel)

The current dump only fully captured `/`. The project list is rendered
on the home with sample IDs: `choo_choo_world`, `ddd_2024`, `devin_ai`,
`of_the_oak`, `oryzo_ai`, `porsche_dream_machine`, `soda_experience`,
`spaace`, `spatial_fusion`, `synthetic_human` — implying a 10-item
featured grid.

---

## Accessibility

- **Color contrast:** the dominant text/bg combinations are
  `#000000` on `#FFFFFF` (21:1) and `#FFFFFF` on `#000000` (21:1),
  both passing AAA. The mid-grey (`#2B2E3A`) on white is ~13.5:1
  (AAA for normal text). The blue accent `#1A2FFB` on white is
  ~6.5:1, just over AA for body text.
- **Focus indicators:** CSS sets `*:focus { outline: 0 }` — the
  default focus ring is suppressed globally. There is **no observed
  replacement focus ring** in the CSS. This is an accessibility
  miss.
- **Keyboard:** all interactive elements are native `<a>` / `<button>`,
  so tab order follows DOM order. The header buttons are wrapped in
  `pointer-events: none` at the parent level and re-enabled on
  children — this does not break keyboard focus.
- **Screen-reader landmarks:** the page has `<header>`, `<main>` (not
  explicitly in dump, but `<body><div id="ui"><header>...</header>…`)
  and an implicit `<footer>` (`#footer-section`). The nav block
  (`#header-menu-links`) is a list of `<a>`.
- **Skip-links:** **Not observed** in the dump.
- **Motion:** the site does not honour `prefers-reduced-motion`.
  All entry tweens and 3D camera dollies run regardless of the user
  preference.
- **Alt text:** the SVG logo carries `aria-label="Go to home page"`
  via the wrapping `<a>`. Decorative SVGs are unlabelled.
- **`<html>` classes observed:** `is-desktop`, `is-ready`,
  `is-white-bg` (toggled on scroll to invert which surface the
  canvas sits on).

---

## Sources

- Homepage — https://lusion.co/
- CSS bundle — https://lusion.co/_astro/about.CNa9RfUh.css
- JS bundle — https://lusion.co/_astro/hoisted.CJiXW_YI.js
- Site manifest — https://lusion.co/assets/meta/site.webmanifest
- OG image — https://lusion.co/assets/meta/social_sharing.jpg
- Safari pinned tab — https://lusion.co/assets/meta/safari-pinned-tab.svg
- 3D engine advertised in DOM: `data-engine="three.js r158"`
- Headless dump at `tools/tmp/lusion/playwright/homepage.html`
  (rendered DOM after the Cloudflare Turnstile pass).

---

## Changelog

- 2026-06-19 — Initial draft by design.md-gen (Lusion batch).
