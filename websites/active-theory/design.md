# Active Theory — design.md

> A structured design specification of **https://activetheory.net**, written so a
> human or agent can reconstruct its look-and-feel without seeing the
> original site.
>
> **Status:** Draft · **Last updated:** 2026-06-20 · **Author:** dump-miner
> **Source dump:** `tools/tmp/active-theory/` (gitignored)

---

## Overview

Active Theory's site is a single-page WebGL portfolio for a Los-Angeles-based
creative digital production studio founded in 2012. The visible "page" is a
full-viewport 3D canvas (`#Stage`) that boots only after a JS feature-detect
pass; if the browser fails, the server hands out a fallback
(`/unsupported.html`) with a black background, a centered "Your browser is not
supported" headline, and a static `unsupported-bg.jpg` plate — see
`html/unsupported__d59c5307`. The runtime experience is built on the studio's
internal **Hydra** framework (custom in-house app engine: `window.Hydra`,
`window.Main`, `window._HYDRA_BEFORE_READY`), which wraps a Three.js-style
scene graph, a WebGL2 shader pipeline, a TweenManager, and a Web Worker
(`hydra-thread.js`). The whole thing ships as a single 1.8 MB minified
`assets/js/app.<cache-bust>.js` bundle that owns the DOM, the canvas, and the
runtime.

The site is the studio's flagship business-development surface. Awards copy
in the bundle — *"126 FWA awards, 24 Cannes Lions, 15 CLIO awards"* — sets
the tone: confident, technical, restrained. There is almost no marketing
copy on the canvas surface itself; everything is implied through motion and
texture. The OG/Twitter description is the longest string a first-time
visitor reads.

**Category:** Marketing / Portfolio (creative-tech studio)
**Primary surface observed:** Homepage (`/`) — single full-bleed WebGL stage.
Auxiliary routes are JS-driven: `/Work/:project-slug`, `/contact`, plus a
hidden `/?playground` debug surface.
**Tone:** Confident, technical, restrained; near-zero marketing copy on the
canvas surface itself; everything is implied through motion and texture.
**Framework detected:** None of Next/Nuxt/Astro/SvelteKit. **Custom in-house
framework "Hydra"** (vanilla TypeScript-style JS) that wraps WebGL + Three.js
primitives.

### Observed runtime flags and globals

- `window._ENV_ = "production"` (set inline in `<head>`).
- `window._CMS_ = "%CMS%"` — placeholder for a CMS string the JS expects to
  swap at runtime.
- `window._UNSUPPORTED_PAGE_ = "unsupported.html"` — path of the fallback
  page when capability checks fail.
- Capability gate is `try { eval("let obj = {}; obj?.prop") } catch (e) {
  window.location.replace(window._UNSUPPORTED_PAGE_); }` — i.e. a literal
  optional-chaining test. Anything older than ~ES2019 falls through.
- `window._CACHE_ = "1780406240914"` — append to `assets/js/app.<cache>.js`
  to find the right bundle.
- `window.UIL_STATIC_PATH = "assets/data/uil.1780406240914.json"` — UI Library
  config data file (404 in our dump, indicating a per-project CMS payload).
- `window.AURA` referenced 19× — an alternate entry-point / alternate build
  flag, suggests the studio runs an internal preview platform named "AURA".
- `window.GLUI` referenced 3× — a graphical UI panel (debug-only).
- `window.GVRA` referenced 5× — likely a "GVRA" debug or analytics global.
- `window.CMS_DATA` referenced 16× — the CMS payload object hydrated at boot.
- `window.ASSETS` referenced 7× — asset manifest injected at boot.
- `window.UIL_ID` referenced 6× — UI Library instance id counter.

---

## Visual Language

### Color

The site is dark, with one saturated blue accent and a small, restrained
neutral ramp. All values below were pulled from the inline `<style>` in
`playwright/html/asset_0__adac22d2`, the `unsupported.html` stylesheet, and
the embedded `--color-*` token block in `js/app.1780406240914__653ea3bd.js`
(the in-house UIL library inside the bundle).

| Role | Token | Value | Closest CSS name | Notes |
| --- | --- | --- | --- | --- |
| Background (base) | `--color-black` / `--color-neutral-0` | `#000000` | black | Pure black on `#Stage`, `body`, `html` |
| Background (canvas) | — | `#000000` | black | Inline `background:#000` on `#Stage` |
| Background (panel-10) | `--color-neutral-10` | `#161616` | near-black | UIL sidebar surface, panel backgrounds |
| Background (panel-20) | `--color-neutral-20` | `#272727` | dark gray | Elevated panel |
| Background (panel-30) | `--color-neutral-30` | `#303030` | dim gray | Higher elevation |
| Background (divider-40) | `--color-neutral-40` | `#363636` | charcoal | Divider, hairline border |
| Text (icon default) | `--color-neutral-70` | `#737373` | gray | Muted icon, disabled label |
| Text (neutral-80) | `--color-neutral-80` | `#8B8C8A` | cool gray | Secondary text |
| Text (neutral-90) | `--color-neutral-90` | `#CCCCCC` | light gray | Tertiary text |
| Text (primary) | `--color-white` / `--color-neutral-100` | `#FFFFFF` | white | Headlines, body copy on dark |
| Text (on-accent) | `--color-action--contrast` | `#FFFFFF` | white | Text on accent |
| Accent (action / highlight) | `--color-accent-50` | `#1A6DEA` | azure | The signature blue |
| Accent (light) | `--color-accent-60` | `#3787FF` | dodger blue | Hover / pressed highlight |
| Accent (palest) | `--color-accent-80` | `#79AEFF` | light blue | Focus ring, hover text |
| Accent (transparent) | `--color-highlight-transparent` | `rgba(26, 109, 234, 0.24)` | azure at 24% alpha | Wash backgrounds |
| Accent (cyan, brand flash) | inline | `#00FFFF` | cyan | Loading-cursor accent; cursor-blink animation |
| Accent (cyan, halo) | inline | `rgba(200, 255, 255, 0.2)` | pale cyan | Loading-dot muted state |
| Accent (cyan, intense) | inline | `rgba(0, 0, 255, 0.6)` | blue at 60% | Debug overlays |
| Error | `--color-error-60` | `#E64040` | coral red | Error text and form error |
| Border (default) | `--border` | `1px solid var(--color-neutral-40)` | — | Subtle 1 px divider |
| Border (accent) | inline | `1px solid #1A6DEA` | — | Focused / selected |
| Border (input alt) | inline | `1px solid #2E2E2E` | — | Soft dark border |
| Border (accent-soft) | inline | `1px solid rgba(26, 109, 234, 0)` / `…1)` | — | Animated border states |
| Border (white-soft) | inline | `1px solid rgba(255, 255, 255, 0.1)` | — | Subtle outline on dark |
| Border (white-strong) | inline | `2px solid rgba(255, 255, 255, 0.3)` | — | Strong outline |
| Border (white-2) | inline | `6px solid rgba(255, 255, 255, …)` | — | Misc accents |
| Track (slider) | `--color-track` | `var(--color-black)` = `#000000` | black | Slider/track fill |
| Highlight ring | inline | `box-shadow: 0 1px 6px #00FFFF` | cyan glow | Loading dot halo |
| Highlight ring | inline | `box-shadow: 0 1px 6px #ffffff55` | white at 33% | Cursor halo |
| Misc warm | inline | `#FDB460`, `#FFDE7B`, `#FFDE0A`, `#F4EE42`, `#F44141` | warm yellows / reds | Color-picker palette in UIL debug |
| Misc cool | inline | `#ACE6E8`, `#86CFD1`, `#77C4D9`, `#81ECFE` | pale teals | Color-picker palette in UIL debug |

Additional one-off hex values seen in the bundle (likely CMS-driven):
`#E0FFF6`, `#46F441`, `#28C913`, `#060606`, `#0000FF`, `#FF00FF`,
`#FF0000`. These are color-picker swatches used by the in-house UIL color
control and may not appear on the public surface.

Notes on dark/light: the site is **dark-only**. There is no light theme and
no `@media (prefers-color-scheme: light)` override. Background never flips
from black. The CMS-loaded `data/uil.json` is a runtime override channel
for the UIL debug panel and does not affect the public surface.

### Typography

The whole visible surface uses a **single family**, `nbarchitekt`, self-hosted
in three weights from `assets/fonts/NBArchitektStd-*-export/`. A second
family, `Manrope`, appears once as the default for the in-house UIL library
debug panel (`--font-primary: "Manrope"`) but is not on the public surface.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display H1 (hero) | `"nbarchitekt", Helvetica, Arial, sans-serif` | 700 | `clamp(2.5rem, 5vw, 4rem)` ≈ 40–64 px | `1.05` | `-0.02em` |
| H2 | same | 700 | `2.25rem` (36 px) | `1.15` | `-0.015em` |
| H3 | same | 600 | `1.5rem` (24 px) | `1.25` | `-0.01em` |
| Body L | same | 400 | `1.125rem` (18 px) | `1.6` | `0` |
| Body | same | 400 | `1rem` (16 px) | `1.6` | `0` |
| Body S / caption | same | 400 | `0.875rem` (14 px) | `1.5` | `0` |
| Label / button | same | 600 | `0.875rem` (14 px) | `1.2` | `0.005em` |
| Mono / debug | `"Courier New"` (UIL only) | 400 | `0.9em` of base | `1.5` | `0` |
| Loading text | `"nbarchitekt", Helvetica, Arial, sans-serif` | 400 | `13 px` | `1.5` (assumed) | `0` |
| Loading text (dot container) | same | 400 | `13 px` | `1` | `0` |
| Heading on unsupported page | `"nbarchitekt", Helvetica, Arial, sans-serif` | 700 (browser default for `h1`) | `18 px` | `normal` | `normal` |
| Logo (large) | — | — | `145 px` (--logo-size) | — | — |
| Logo (small) | — | — | `25 px` (--logo-size) | — | — |

Concrete observed values from the bundle / stylesheets:

- `<h1 class="fade-in">` on the unsupported page is rendered at
  `font-size: 18px`, `font-family: "nbarchitekt", Helvetica, Arial, sans-serif`,
  `opacity: 0.8`, `padding-top: 25vh`, `text-align: center`
  (`playwright/computed-styles.json`).
- Inside the JS bundle, hard-coded values are `font-size: 14px`, `13px`,
  `12px`, `11px`, `10px`, `7px`; `font-weight` repeats `400 / 600 / 700 /
  bolder`. UIL labels default to `font-size: 12px` (`--font-size-base`).
- `letter-spacing: 0.2rem` appears once for a wide-spaced label;
  `letter-spacing: 0.01em` for normal labels; default tracking is `0` or
  `letterSpacing: .1` on canvas text.
- `text-transform: uppercase` is observed once (for an all-caps chip label).
- `text-decoration: none` (4×) on links, `text-decoration: underline dotted`
  (2×) on disabled links.
- `white-space: nowrap` (3×) on inline pill labels; `white-space: pre-wrap`
  (2×) on multi-line blocks; `white-space: normal` (2×).
- Self-hosted variable fonts? **No.** Three static face files
  (Light 300, Regular 400, Bold 700) are each loaded as separate woff2/woff/otf
  triple; no variable axis is exposed. The Light and Bold woff2 files are
  referenced in `playwright/html/asset_0__adac22d2` but only the Regular
  woff2 made it into the dump (`fonts/NBArchitektStd-Regular__197a5501.woff2`,
  19 428 B).
- Font-family fallbacks stack: `"nbarchitekt", Helvetica, Arial, sans-serif`
  — the fallback chain is `nbarchitekt → Helvetica → Arial → sans-serif`.
  The Helvetica → Arial → sans-serif chain is inherited from the inline
  `<noscript>` text and the unsupported page.

### Spacing & radius

The UIL (in-bundle UI library) defines the canonical spacing scale; the
public 3D surface inherits these via the same CSS custom properties.

- **Base unit:** `10 px` (`--spacing`); `8 px` is the secondary base
  (`--spacing-small`).
- **Scale observed:** `4 px` (padding top of small chip), `5 px`,
  `8 px`, `10 px`, `12 px` (gap), `14 px`, `16 px` (margin / max-spacing
  half), `20 px`, `22 px`, `24 px`, `32 px` (sidebar offset), `96 px`,
  `240 px` (`--max-spacing` cap, panel-only).
- **Padding patterns:**
  - `padding: 0` (8×)
  - `padding: 9 px` (3×) — input field height
  - `padding: var(--spacing-small)` (8×) — chips
  - `padding: var(--spacing)` (1×) — larger chips
  - `padding: calc(var(--spacing) / 2) var(--spacing)` (2×) — buttons
  - `padding: calc(var(--spacing-small) / 2)` (1×) — dense rows
  - `padding: calc(var(--spacing-small) * 1.5) calc(var(--spacing))` (1×) — tall buttons
  - `padding: calc(var(--spacing) * 1.75)` (1×) — wide controls
  - `padding: 9 px !important` (1×) — explicit override
  - `padding-top: 25 vh` (1×) — unsupported-page headline
- **Margins:**
  - `margin: 0` (9×) — resets
  - `margin: 4 px 0` (1×) — small vertical rhythm
  - `margin: 6 px 0` (2×)
  - `margin: 2 px` (1×) — fine adjustment
  - `margin: 2.6 rem 2.6 rem` (1×) — block gap
  - `margin: 2 rem 2 rem` (1×) — block gap
  - `margin: -1 px` (1×) — hairline alignment
  - `margin: var(--spacing) 0` (1×)
  - `margin: calc(var(--spacing) * 3) 0` (1×)
  - `margin: 0 0 var(--spacing-small)` (1×)
- **Gaps (Flex):**
  - `gap: var(--spacing-small)` (4×) — 8 px
  - `gap: calc(var(--spacing-small) / 2)` (3×) — 4 px
  - `gap: var(--spacing)` (1×) — 10 px
  - `gap: 16 px` (1×) — wide
  - `gap: 12 px` (1×) — medium
- **Radii:**
  - `--border-radius: 8 px` (default)
  - `border-radius: 4 px` (small chips)
  - `border-radius: 6 px` (form input / button)
  - `border-radius: 12 px` (large panels / cards)
  - `border-radius: calc(var(--border-radius) / 2)` (1×) — half default
  - `border-radius: calc(var(--border-radius) / 4)` (1×) — quarter default
  - `border-radius: calc(var(--track-height) / 2)` (2×) — slider thumb
  - `border-radius: calc(var(--thumb-size) / 2)` (1×) — round thumb
  - `border-radius: 50%` (2×) — avatar / dot
  - `border-radius: 10 px` — scrollbar thumb (`::-webkit-scrollbar-thumb`)
- **Shadows:** No drop-shadows in the public surface (the canvas is
  shadow-free). UIL controls use `box-shadow: var(--form-box-shadow)` =
  `inset 0 --border-width 0.1875 rem rgba(#000, …)` (inset hairline glow on
  focused inputs); brand accent uses `box-shadow: 0 1px 6px #00FFFF` and
  `box-shadow: 0 1px 6px #ffffff55` for the loading dot / cyan accent.

### Iconography

- **Style:** Raster PNG and SVG, 1:1 monochrome glyphs, recolored via CSS
  `currentColor` or `background-color: var(--color-icon-default)`. No
  outline/duotone split — each icon is delivered as a single asset.
- **Library:** Custom, not Lucide/Phosphor/Heroicons. Files live in
  `assets/images/ui/`: `arrow.png`, `close.svg`, `globe.png`, `ig.png`,
  `in.png`, `star.png`, `tw.png`.
- **Default sizes:** `20 px` in body (`width: 20 px`), `25 px` for a small
  logo glyph (`--logo-size: 25 px`), `145 px` for a large brand mark
  (`--logo-size: 145 px`), `4 px` for a loading dot (`--dot-size: 4 px`).

### Visual effects (live in the bundle)

- `mix-blend-mode: color-dodge` (3×) — used on highlights layered over
  canvas content.
- `mix-blend-mode: plus-lighter` (1×) — additive blend for glow.
- `mix-blend-mode: normal` (1×) — explicit reset.
- `filter: brightness(1.0)` / `brightness(0.8)` — luminance shifts on
  hover.
- `backdrop-filter: blur(4px)` (2×) — frosted-glass panel backdrop.

---

## Layout & Grid

The public layout is **not a 12-column grid** — it is a single full-bleed
`<canvas>` overlaid by absolutely-positioned DOM panels. The grid only
exists inside the UIL debug surface and form controls.

- **Max content width:** Not applicable to the public surface. UIL panels
  use `--form-group-width: 256 px` and `--form-content-max-width: 180 px`.
  Tabs use `--tab-content-width: 300 px`. Sidebar uses
  `--panel-width: 300 px` (default).
- **Page gutter:** The canvas has no gutter; it is `width: 100%; height:
  100%; overflow: hidden`. Touch is disabled via `touch-action: none` and
  `-ms-touch-action: none`. Pinch-zoom is blocked with
  `-ms-content-zooming: none`. Text-size adjustment is locked via
  `-webkit-text-size-adjust: none` on `#Stage *`.
- **Grid:** UIL sidebar uses `flex` with `gap: var(--spacing-small)` (8 px)
  or `gap: calc(var(--spacing-small) / 2)` (4 px) between rows. No CSS Grid
  is used on the public surface.
- **Breakpoints:** No `@media (max-width: …)` rules in the inlined CSS.
  Breakpoint handling is purely JS in `SceneLayout.breakpoint` with string
  values like `"-sm"`, `"-md"`, `"-lg"`, `"-xl"` that re-prefix asset keys.
  Observed constants in JS: `XS` (used 70×), `MD` (8×), `LG` (165×),
  `XL` (13×). There is no documented px cutover; the framework treats them
  as semantic labels. `Device.mobile` boolean is the runtime gate.
- **Vertical rhythm:** No baseline grid on the public surface. UIL controls
  use `line-height: 1.3` (`--line-height`) and `30 px` for ticker rows.
- **Z-index layering observed:** `1`, `2`, `3`, `100`, `100001`,
  `99999`, `999999` — the canvas runs at `1`, the UIL sidebar at `100`,
  and fullscreen overlays at `999999` / `100001`.
- **Safe area:** Feature-detect div reads
  `env(safe-area-inset-{top,right,bottom,left})` and exposes them as CSS
  custom properties `--safe-area-inset-*`. The Stage div honors these.

### Homepage layout, in prose

The page is a single black canvas filling the viewport. Behind the canvas is
a `Stage` div (the `<div id="Stage">` element constructed by `app.js`),
which contains one or more WebGL scenes. A small loader (the three cyan
dots animation described in **Animations** below) sits in the centre while
the JSON config (`uil.json`) and 1.8 MB JS are parsed. The CMS payload
drives the Work reel; the route `/Work/:slug` mounts a project-detail scene;
the `/contact` route opens a different `ViewController`. There is no scroll
on the homepage itself — `Stage.div` is locked to viewport size and scroll
inertia is gated by `Stage.isNormalMobileScroll`.

A separate `<div class="feature-detects">` is offscreen (zero-sized,
`clip: rect(0 0 0 0)`) and is used to compute CSS env-vars
(`--safe-area-inset-*`) for notched devices. There is no header, footer,
side-nav, or breadcrumb in the DOM — all UI is rendered inside the WebGL
canvas or as floating UIL debug panels.

---

## Components

The site does not use a React/Vue component tree; "components" are
constructor-class instances in the Hydra framework, each of which mounts a
DOM subtree or a WebGL mesh. Below are the public-surface components, then
the hidden UIL debug components.

### Stage (the canvas root)

- **Purpose:** Single full-bleed WebGL canvas plus a `<div id="Stage">`
  parent. All scenes mount under `World.SCENE`.
- **Anatomy:** `<canvas>` (created via `document.createElement("canvas")`),
  parented to `#Stage`, which is parented to `<body>`. The Stage DOM also
  carries inline CSS variables for safe-area insets.
- **States:** Boot (loading), ready (scenes live), context-loss
  (`Events.WEBGL_CONTEXT_LOSS`), error (`Events.ERROR`).
- **CSS:** `#Stage, body, html { margin:0; padding:0; width:100%; height:100%;
  overflow:hidden; -ms-content-zooming:none; -ms-touch-action:none;
  touch-action:none; background:#000 }`.
- **User-select disabled** for everything under `#Stage` via
  `#Stage,#Stage * { user-select:none; -moz-user-select:none;
  -webkit-user-select:none; -o-user-select:none; -ms-user-select:none;
  -webkit-tap-highlight-color:transparent;
  -webkit-text-size-adjust:none }`, but inputs and textareas are
  explicitly re-enabled so the UIL forms remain usable.
- **APIs:** `Stage.width`, `Stage.height` (95× and 115× access),
  `Stage.size`, `Stage.add`, `Stage.remove`, `Stage.bind`,
  `Stage.unbind`, `Stage.cursor`, `Stage.css`, `Stage.div`,
  `Stage.style`, `Stage.bg`, `Stage.hide`, `Stage.clear`,
  `Stage.renderDirect`, `Stage.render`, `Stage.interaction`,
  `Stage.__useFragment`.
- **Sizing logic:** `Stage.width = bbox.width || window.innerWidth ||
  document.body.clientWidth`; `Stage.height = bbox.height ||
  window.innerHeight || document.body.clientHeight`. On mobile with
  `Stage.isNormalMobileScroll`, the `Stage.div` is set to `100vh`
  and the document height is overridden.

### Loader (loading screen)

- **Purpose:** First-paint splash with three cyan blinking dots and a
  cursor-blink caret.
- **Anatomy:** Three dot elements animated by `@keyframes dot-flashing`
  (cyan `#00FFFF` at 0% with a `0 1px 6px #00FFFF` halo, fading to
  `rgba(200, 255, 255, 0.2)` at 50–100%); offset with
  `animation-delay: 0s / 0.5s / 1.5s` so they pulse in sequence. A small
  inline cursor block uses `@keyframes cursor-blink` (transparent →
  `#00FFFF` at 50% → transparent).
- **States:** Loading (visible) → hidden (when `Global/loadFinished`
  fires). Re-shows on any `Events.WEBGL_CONTEXT_LOSS`.
- **Typography:** `font-family: "nbarchitekt", Helvetica, Arial, sans-serif`,
  `font-size: 13 px`, `margin: 4 px 0`. Cursor block `width: 8 px`.

### Marquee ticker (chip strip)

- **Purpose:** A 30 px-tall horizontal scroll used in small UI strips
  (project lists, footer chips). Defined inline.
- **Anatomy:** `.ticker { display:inline-block; height:30 px;
  line-height:30 px; width:80 px; overflow:hidden;
  background-color:transparent; white-space:nowrap; opacity:0.4;
  mix-blend-mode:… }`.
- **Animation:** `@keyframes ticker { 0% { transform: translate3d(0,0,0);
  visibility:visible } 100% { transform: translate3d(-100%,0,0) } }` —
  GPU-accelerated translate, infinite loop.
- **Hover:** opacity `0.3 → 1` over `0.4s ease-out`.

### UIL form controls (debug panel widgets)

These components ship inside the bundle as part of the in-house UIL library
and are visible only on the dev `/playground` surface, but they describe the
studio's design vocabulary precisely.

- **UILInput / UILButton / UILFolder / UILControl** — the canonical widget
  set; each takes `UILControlBase` styling.
- **Default font:** `Manrope` (set as `--font-primary`). Public surface
  still uses `nbarchitekt`, so the Manrope family only appears in debug
  panels.
- **Border:** `1 px solid var(--color-neutral-40)` (`#363636`).
- **Focus outline:** `1 px solid var(--color-action)` (`#1A6DEA`), `offset
  0`.
- **Form box-shadow on focus:**
  `var(--form-box-shadow) = inset 0 --border-width 0.1875 rem rgba(#000…)`.
- **Form transitions:** `border-color var(--duration) var(--timing)`
  (where `--duration: 300ms` and `--timing: ease-out`), `color
  var(--duration) var(--timing)`, `background-color var(--duration)
  var(--timing)`.
- **Tooltip / popover:** 300 px wide, default left padding
  `calc(var(--spacing) * 1.75)`, `--form-content-max-width: 180 px`.
- **Tabs:** `--tab-count` (dynamic), `--tab-content-width: 300 px`,
  `font-weight: 700` for active tab, `text-decoration: underline dotted`
  for inactive.
- **Track / slider:** `--track-height: calc(var(--thumb-size) / 2)`,
  `--thumb-size: var(--spacing-small)` (8 px), `--thumb-radius:
  calc(var(--thumb-size) / 2)` (4 px) → round thumb. Track bg
  `var(--color-track)`.
- **Color picker:** 12+ hard-coded swatches including `#FFDE0A`, `#FDB460`,
  `#81ECFE`, `#ACE6E8`, `#86CFD1`, `#77C4D9`, `#46F441`, `#28C913`,
  `#F44141`, `#F4EE42`, `#E0FFF6`, `#FF00FF`, `#0000FF`.

### UILGraph (debug graph node graph)

- **Purpose:** A node-graph editor used by AT internally to wire shaders,
  assets, and parameters. Visually a dark panel (`background-color:
  var(--panel-background-color)` = `#161616`), with tab count driven by
  `--tab-count`, and `--tab-content-width: 300 px`.
- **Events:** `UILGraphNode.FOCUSED` fires when a node is selected;
  `UILGraph/MoveNode` for drag operations.
- **States:** Visible only when `Global.PLAYGROUND = true`.

### TransformControls (gizmo)

- **Purpose:** Three.js-style translate / scale / rotate gizmo that
  attaches to scene meshes in playground mode.
- **Anatomy:** Created from `(new TransformControls(camera, domElement))`;
  visible toggle on `=` / `+` keys.
- **Keyboard:** `.` swaps to translate mode, `/` swaps to scale mode.
- **Drag:** `draggingChanged` event disables the active controls
  (`Playground.instance().activeControls.enabled = false`).

### SceneLayout (data-driven scene graph)

- **Purpose:** Declarative config loader that reads
  `assets/data/uil.json` and mounts meshes, materials, and shaders.
- **Anatomy:** A `SceneLayout` instance has `group`, `layers`, `groups`,
  `meshes`, `custom`, `config` slots. Each layer can have a `geometry`
  (`.glb` / `.gltf` / `.json` / path), `shader`, `customClass`,
  `scriptClass`, `breakpoints`, `parent`, `renderOrder`.
- **Hot-reload:** `Events.SCENE_LAYOUT.HOTLOAD_GEOMETRY` and
  `.HOTLOAD_SCRIPT` events reload individual layer assets without a full
  page refresh.

### Raycaster (3D picking)

- **Purpose:** Casts rays from the mouse to determine which WebGL mesh is
  under the cursor — used for the Work reel hover states.
- **Reference:** `new Raycaster(…)` 19× in the bundle.

### Scroll (custom scroll inertia)

- A full custom scroll implementation lives in the bundle (class
  `Scroll`, 344 references to "scroll" in the code). Mouse-wheel deltas
  are scaled per-OS: macOS-Chrome `0.33×`, macOS-Safari `0.33×`,
  Windows-Chrome `0.25×`, Windows-Firefox `10×`. Touch uses
  `_this.touchScale`. Inertia decays at `*=.9` per frame.
- **Keyboard:** `Up`, `Down`, `PageUp`, `PageDown`, `Home`, `End`,
  `Space` map to scroll deltas (e.g. `150 px` for one ArrowDown press).
- **Bounds:** Custom `_this.bounds` rectangle can be set per-instance to
  restrict scroll area.

### Cursor

- **Observed cursor states:** `pointer` (12 sites), `default` (4),
  `grab` (2), `grabbing !important` (1), `move` (1), `progress` (1),
  `not-allowed` (2), `not-allowed !important` (1). Set via
  `Stage.cursor("…")`.
- **Inactive state:** On mouse-out, cursor resets to the body's default
  (`auto`).

### Modal / Dialog

- Not explicitly named in the bundle, but `ViewController/contact` opens
  an overlay; backdrop fades with `Stage.div` over `--duration: 300 ms`.
- **Backdrop:** Uses `backdrop-filter: blur(4 px)` for a frosted-glass
  effect, layered over the WebGL canvas.

### Contact (with embedded AI tool)

- **Purpose:** A contact form view controller that opens via
  `ViewController/contact = true`.
- **AI helper:** The bundle contains a tool definition that, when invoked,
  triggers the contact flow:
  > *"Active Theory, the agency that created this website. Use this tool
  > to help answer questions about details with the studio. Contains
  > information on the agency, projects, services, awards, and team."*
- **Trigger:** Also has its own helper:
  > *"Reach out to Active Theory. Call this tool whenever the user wants
  > to reach out to the agency."*
  Calls `_this.set("ViewController/contact", !0)` and returns a confirmation.

### Project / Work page

- **Title pattern:** `${data.title} · Active Theory`, set on `Work/project`
  binding.
- **Sub-bindings observed in the bundle:** `Work/video`, `Work/refraction`,
  `Work/camera`, `Work/scrollProgress`, `Work/updatedVideo`,
  `Work/pane_ui`, `Work/pane`, `Work/scroll`, `WorkItems/videoURL`.
- **Hero:** A WebGL scene per project, with `assets/video/reel.mp4`
  as a common reel video and `assets/video/reel-frame.jpg` as a poster.
- **Audio:** Each project can have its own music track from the
  `assets/music/` set (8 tracks total).
- **Spatial audio:** Uses Google Resonance Audio (bundled) for 3D
  positional sound.

### InteractAI / SpeechRecognition / ChatUI

- **Purpose:** An AI assistant widget that lets visitors ask questions
  about the studio's work.
- **Components:** `InteractAI` (17×), `InteractAISpeech` (5×, with
  `playing` state), `InteractAIGPT` (7×, with `thinking` state),
  `SpeechRecognition` (10×, with `ready` state), `ChatUIResponse`
  (9×, with `submit` action).
- **Audio:** `AudioContext` 4×, `new Audio(...)` 1× — used for
  Text-To-Speech responses. Global gate `Global/audioEnabled` (6×)
  must be true before audio plays.

---

## JavaScript & Libraries

The site is a hand-rolled TypeScript-style bundle. Detection comes from
string-matching the minified JS for class names, GL calls, and asset paths.

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| **Hydra (in-house framework)** | Build `1780406240914` | `window.Hydra`, `window.Main`, `_HYDRA_BEFORE_READY`, `Class((function Hydra(){…}))` in `js/app.1780406240914__653ea3bd.js` | The whole app: class system, asset manager, scene graph, tween manager |
| **Three.js** (subset) | not exposed | `THREE.PerspectiveCamera` (1×); GLTFLoader used 6× via local re-implementation `GeomThread.loadGeometry` | AT uses Three.js as a renderer reference but builds its own scene graph on top |
| **WebGL2** | n/a | 13× `webgl2`, 8× `antialias`, 5× `powerPreference`, 2× `webgl1` | Renderer config: `powerPreference: "high-performance"`, `antialias: true` |
| **GLSL ES 1.0 shaders** | n/a | 994 `uniform`, 390 `attribute`, 91 `vec3`, 35 `vec4`, 33 `sampler2D`, 29 `mat4`, 28 `vec2`, 26 `varying`, 16 `texture2D`, 13 `gl_FragColor`, 4 `mat3`, 2 `gl_Position`, 2 `precision mediump float` | Custom `Shaders.getShader` compiler; shader sources are stored as `.shader` (643×), `.vert` (104×), `.frag` (159×) reference paths |
| **GLTFLoader** | Three.js addon pattern | 6 references `new GLTFLoader` | Used to load `.glb` / `.gltf` assets |
| **Draco geometry compression** | bundled | `assets/js/lib/_draco/` referenced 2× | Decodes compressed `.gltf`/`.glb` |
| **KTX2 / Basis Universal** | bundled | `assets/js/lib/basis_transcoder.wasm` + `.js` referenced 2×; `.ktx2` referenced 60× in code | GPU-compressed textures |
| **Google Resonance Audio** | bundled | `assets/js/lib/_resonance/resonance-audio.min.js` referenced 1× | Spatial audio for project scenes |
| **QRious** | bundled | `assets/js/lib/qrious.js` referenced 1× | QR code generator (used somewhere in contact/share flow) |
| **TweenManager (in-house)** | n/a | 69 mentions of `TweenManager`, 134 calls to `tween(…)` | Penner's easings re-implemented in full: `easeOutCubic`, `easeOutSine`, `easeInOutCubic`, `easeOutQuart`, `easeOutQuint`, `easeOutExpo`, `easeOutCirc`, `easeOutBack`, etc. |
| **Hydra Web Worker** | n/a | `js/hydra-thread__b473add2.js` (13 213 bytes) | Custom eval-based message worker; handles `es6`/`es5` script injection, asset decode, geometry build |
| **Google Analytics (gtag)** | `G-J7TMDT4F8N` | `<script async src="https://www.googletagmanager.com/gtag/js?id=G-J7TMDT4F8N">` | Universal Analytics / GA4 measurement ID |
| **Anthropic-style tool surface** | n/a | "Active Theory, the agency that created this website. Use this tool to help answer questions about details with the studio…" string in the bundle | Likely a contact-page AI widget (one tool definition discovered) |
| **SpeechRecognition / InteractAI / ChatUI** | n/a | 17 / 17 / 10 / 7 / 9 mentions in bundle | Voice + chat assistant modules; routes names `InteractAISpeech/playing`, `InteractAIAssistant/isThinking`, `InteractAIGPT/thinking` |

### Easing library (TweenManager._getEase)

The string `TweenManager._getEase` is called 3 times in the bundle; the
supported easing identifiers (string literals) are:

| Easing | Occurrences |
| --- | --- |
| `easeOutSine` | 32 |
| `easeOutCubic` | 32 |
| `easeInOutSine` | 18 |
| `easeOutQuart` | 6 |
| `easeInSine` | 6 |
| `easeInOutCubic` | 6 |
| `easeOutQuint` | 4 |
| `easeOutExpo` | 4 |
| `easeInCubic` | 4 |
| `easeInQuart` | 3 |
| `easeOutQuad` | 2 |
| `easeOutCirc` | 2 |
| `easeOutBack` | 2 |
| `easeInQuint` | 2 |
| `easeInQuad` | 2 |
| `easeInOutQuint` | 2 |
| `easeInOutQuart` | 2 |
| `easeInOutQuad` | 2 |
| `easeInOutExpo` | 2 |
| `easeInOutCirc` | 2 |

CSS easings observed: `cubic-bezier(.17,.4,.02,.99)` (custom, twice) is
the closest thing to a brand easing; also `cubic-bezier(.17,.4,.02,.99)`
appears in `transition: all 0.8s cubic-bezier(.17,.4,.02,.99)` and
`transition: all 0.4s cubic-bezier(.17,.4,.02,.99)`. Other CSS easings:
`ease-in-out` (8×), `ease-out` (6×), `linear` (25×).

### Framework constants observed

- `Stage.{width,height}` — viewport (read 95× and 115×)
- `World.CAMERA` (85×), `World.RENDERER` (83×), `World.NUKE` (75×),
  `World.SCENE` (38×), `World.ELEMENT` (9×), `World.elements` (11×),
  `World.QUAD` (19×), `World.PLANE` (11×), `World.DPR` (10×),
  `World.SPHERE`, `World.BOX`, `World.TUBE`, `World.PLANEHI`,
  `World.BOXHI`, `World.CONTROLS`.
- `Renderer.WEBGL` (29×), `Renderer.CLEAR` (27×), `Renderer.type`
  (19×), `Renderer.context` (16×), `Renderer.extensions` (45×),
  `Renderer.SHADOWS`, `Renderer.UBO`, `Renderer.ID`.
- `Renderer.type` enum: `NORMAL`, `WEBVR`, `WEBAR`, `MAGIC_WINDOW`.
- `Hydra.LOCAL` (63×) — boolean for dev/local build.
- `Hydra.ready` (35×) — promise that resolves when the app is ready.
- `Hydra.absolutePath` (6×) — path-resolver relative to base.
- `Global.PLAYGROUND` (18×) — boolean, true on `/?playground`.
- `Global.FNS` (3×) — function table.
- `Global.LOGO_HOVERED` (2×), `Global.MACOSHASHVALUE` (2×),
  `Global.iOSGPUHASH*` (2× each) — feature-detection hashes.

The 1.8 MB bundle declares no third-party ES-module imports — it bundles
`Manrope`-style tokens, the Three.js subset, the GLSL compiler, and the UIL
library internally. The 478 KB `playwright/js/js__094eaf67` file is the
Google Analytics `gtag/js` payload (Google copyright header); it is **not**
part of the site code, only the analytics runtime.

---

## Animations (Catalog)

### CSS @keyframes

All three keyframes live inside template strings in
`js/app.1780406240914__653ea3bd.js`, not in standalone `.css` files.

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `fadeInOpacity` | `playwright/html/asset_0__adac22d2` style block (fallback page) | `2s` | `ease-in` | one-shot on `<h1 class="fade-in">` mount |
| `dot-flashing` | `js/app.1780406240914__653ea3bd.js` (template literal, ~line 15) | `1.5s` | `infinite linear alternate` (or `infinite alternate`) | infinite; 3 cyan dots with `animation-delay: 0 / 0.5s / 1.5s` |
| `cursor-blink` | `js/app.1780406240914__653ea3bd.js` (template literal, ~line 18) | `1.5s` | `infinite` | infinite; background flips `#00FFFF` at 50–75% |
| `ticker` | `js/app.1780406240914__653ea3bd.js` (template literal, ~line 24) | continuous | linear | infinite; `translate3d(0,0,0) → translate3d(-100%,0,0)` on `.ticker` strips |

(The `unsupported.html` page also carries `fadeInOpacity`; see
`html/unsupported__d59c5307`.)

### JS-driven animations (TweenManager + WebGL)

The bundle has no GSAP / anime.js / Framer-Motion. All JS-side animation
goes through the in-house `TweenManager.tween(target, props, duration,
ease)`.

| Source | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| TweenManager | every page transition (`ViewController/goToWork`, `ViewController/navigate`) | hash change / route push | default ease `easeOutCubic`, duration 300–1200 ms |
| TweenManager | scroll inertia (`Scroll.isInertia`) | pointer-up | decays `_scrollInertia[axis] *= .9` per frame, capped by `easeOutQuint` |
| TweenManager | contact panel open | `ViewController/contact = true` | `--duration: 300 ms` fade |
| TweenManager | UI panel focus (`UILGraphNode.FOCUSED`) | click | `--timing: ease-out` |
| TweenManager | scroll keyboard (`scrollTo`, `tween(scrollTarget, …)`) | arrow / page / space / home / end | `400 ms easeOutCubic` |
| TweenManager | drag-release inertia | pointer-up on Stage | `tween(_scrollTarget, obj, 2500, "easeOutQuint")` |
| WebGL | per-frame loop driven by `requestAnimationFrame` (10×) and `requestIdleCallback` (6×) | every frame | `Math.framerateNormalizeLerpAlpha` normalizes lerp at 60 Hz (`FRAME_HZ_MULTIPLIER`) |
| WebGL | scene-layout shader pulses (`uVisible`, `uTime` uniforms) | continuous | uniforms listed: `uVisible`, `tracking`, `letterSpacing`, `lineHeight`, `offset`, `scale`, `rotation` |
| CSS | chip hover | mouseenter on `.ticker` | `transition: all 0.4s ease-out`, opacity `0.3 → 1` |
| CSS | logo hover | mouseenter on brand mark | `transition: opacity 0.2s var(--timing)` |
| CSS | input focus | focus on UIL input | `transition: border-color var(--duration) var(--timing)` |
| CSS | sidebar tab change | click | `transition: background-color 300 ms ease-in-out, color 300 ms ease-in-out` |

### CSS animation shorthand observed

- `animation: dot-flashing 1.5s infinite linear alternate`
- `animation: dot-flashing 1.5s infinite alternate`
- `animation: cursor-blink 1.5s infinite`
- `animation-delay: 1.5s` (for the third dot)

### Page transitions

- `Router/state` fires on hash-change; `ViewController/navigate` mounts a
  new scene with a default `easeOutCubic` 600 ms cross-fade. The Stage
  DOM itself does not animate — only the WebGL scenes do.
- First paint: dot-flashing loader → scene ready when
  `Global/loadFinished` fires (≈ 1.5–3 s on a modern desktop).
- `transition: opacity 200 ms` is the standard cross-fade for in-page
  DOM fades.
- `transition: right 0.5 s ease-out` slides side panels.
- `transition: transform 0.3 s ease-out` is the standard gizmo slide.
- `transition: filter 0.1 s linear` is for `brightness()` shifts on hover.

---

## Assets

Inventory from `tools/tmp/active-theory/manifest.json`, supplemented by
asset paths discovered via `grep -oE 'assets/[^\"]+' js/app.*.js`.

### 3D models

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| N/A | — | — | — | No `.glb` / `.gltf` files were downloaded into the dump; the bundle references GLTFLoader (6×) but the actual scene meshes are loaded from a CMS payload at runtime, not from the static `/assets/` directory. |

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| nbarchitekt (Neue Bitarchitektur Std, by Gunther) | 300 Light, 400 Regular, 700 Bold | woff2 / woff / otf (each weight) | `tools/tmp/active-theory/fonts/NBArchitektStd-Regular__197a5501.woff2` (Regular only — Light + Bold files were referenced in HTML but not present in the dump) | **Yes** — `assets/fonts/NBArchitektStd-*-export/` |
| Manrope | (debug UIL only) | (system stack fallback; not bundled) | declared in `--font-primary: "Manrope"` inside UIL CSS tokens | No |
| Courier New | (debug UIL only) | (system fallback) | `--font-tertiary: Courier New` | No |

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/active-theory/images/unsupported-bg__3c6bbb87.jpg` | JPG | 1600×1200 | 192 KB | `https://activetheory.net/assets/images/unsupported-bg.jpg` | Background plate for fallback page |
| `tools/tmp/active-theory/images/apple-touch-icon__af1c55b2.png` | PNG | 180×180 | 4.2 KB | `https://activetheory.net/assets/meta/apple-touch-icon.png` | iOS home-screen icon |
| `tools/tmp/active-theory/images/favicon-32x32__7a885251.png` | PNG | 32×32 | 856 B | `https://activetheory.net/assets/meta/favicon-32x32.png` | Standard favicon |
| `tools/tmp/active-theory/images/favicon-16x16__35749019.png` | PNG | 16×16 | 461 B | `https://activetheory.net/assets/meta/favicon-16x16.png` | Standard favicon |

Additional assets referenced in the bundle (CMS-loaded, **not** in the dump):
- `assets/video/reel.mp4` — main hero reel video
- `assets/video/reel-frame.jpg` — poster frame for the reel
- `assets/images/room/matcap-test.jpg` — matcap for the room scene
- `assets/images/pbr/lut.png` — PBR look-up table
- `assets/images/pbr/damaged_road_{basecolor,mro,normal}.{png,jpg}`
- `assets/images/pbr/corsica_beach-{diffuse,specular}-RGBM.png`
- `assets/images/_lighting/arealights.json` — lighting rig data
- `assets/images/_lightvolume/light.jpg` + `light-mask.jpg` — light-volume LUTs
- `assets/images/_scenelayout/{uv,black,mask}.jpg` — default scene-layout
  fallback textures

### SVGs & icons

- **Standalone SVGs in dump:** `tools/tmp/active-theory/svgs/safari-pinned-tab__3d1b3df8.svg`
  (5 952 B; this file is, per sha1, byte-identical to the main
  `asset_0__adac22d2` HTML — the scraper misclassified the homepage HTML
  as SVG; treat it as a content misclassification, not a real SVG).
- **Real SVG referenced at runtime:** `assets/images/ui/close.svg`
  (close button on UIL modals).
- **Raster icon sprites:** `assets/images/ui/{arrow,globe,ig,in,star,tw}.png`
  — monochrome PNGs sized ~24 px; recolored via `currentColor` /
  `background-color: var(--color-icon-default)`.
- **Inline SVGs in HTML:** None on the public surface (the entire UI is in
  WebGL). Inline SVGs only exist inside UIL debug strings embedded in JS.

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| `assets/video/reel.mp4` | MP4 H.264 | Main hero reel, CMS-loaded (not in dump) |
| `assets/video/reel-frame.jpg` | JPG | Reel poster frame |
| `assets/music/BXRDVJA - Ghost Cities.mp3` | MP3 | Project soundtrack 1 |
| `assets/music/Downtown Binary - Other Worlds.mp3` | MP3 | Project soundtrack 2 |
| `assets/music/Flint - Fly up High.mp3` | MP3 | Project soundtrack 3 |
| `assets/music/Hotham - To the Stars.mp3` | MP3 | Project soundtrack 4 |
| `assets/music/Jozeque - Sultans of Streams.mp3` | MP3 | Project soundtrack 5 |
| `assets/music/Magiksolo - Quantum World.mp3` | MP3 | Project soundtrack 6 |
| `assets/music/nuer self - Dusk.mp3` | MP3 | Project soundtrack 7 |
| `assets/music/Sergey Azbel - Themis.mp3` | MP3 | Project soundtrack 8 |

Spatial audio is rendered via the bundled
`assets/js/lib/_resonance/resonance-audio.min.js` (Google Resonance Audio).

---

## Motion & Interaction

### Principles

- **GPU-first motion.** Anything that moves on screen is either a WebGL
  scene update or a CSS `transform: translate3d(…)`. The marquee ticker is
  a literal example — its `@keyframes` only animates `transform`.
- **Ease-default.** `easeOutCubic` is the canonical ease (32 string
  occurrences vs. 18 for `easeInOutSine`); durations cluster at 300 ms
  (`--duration: 300 ms`), 600 ms, 1200 ms. The CSS brand easing is
  `cubic-bezier(.17, .4, .02, .99)` — a fast-out, slow-in curve used for
  chip and panel hovers.
- **Inertia, never spring.** The custom `Scroll` class uses exponential
  decay (`*=.9` per frame) rather than spring physics, even though the
  bundle does implement spring (`spring` easing function is referenced
  6× but mostly reserved for debug transitions).
- **Reduced motion:** No `@media (prefers-reduced-motion: reduce)` rule
  appears in the inline `<style>` or in the UIL template strings. The
  framework appears to **not** honor reduced-motion preferences; the
  static `unsupported.html` fallback only handles "no WebGL."

### Specific behaviors

- **Link hover:** opacity `0.3 → 1`, transition `all 0.4s ease-out`
  (chip-style buttons in UIL).
- **Button press:** native, no `transform: scale(0.98)` was observed in
  the UIL CSS.
- **Section reveal on scroll:** Not used — the page is a single WebGL
  scene, not a stack of DOM sections.
- **Page transition:** `Router/state` fires on hash change; new scene
  fades in over ~600 ms with `easeOutCubic`. The Stage DOM itself does
  not animate (canvas swap).
- **Loading animation:** three cyan dots, sequential delays `0s / 0.5s /
  1.5s`, blinking between `#00FFFF` and `rgba(200, 255, 255, 0.2)`.
- **Cursor blink:** a single `#00FFFF` block toggles every ~500 ms while
  the loader is active.
- **Scroll inertia on contact/scene scroll:** `*=.9` exponential decay,
  scroll-up keys (`Up`, `Down`, `PageUp`, `PageDown`, `Home`, `End`,
  `Space`) map to integer `y` deltas (e.g. `150` for `ArrowDown`) and
  trigger `tween(scrollTarget, …, 400, "easeOutCubic")`.
- **Pointer events:** `Mouse.{x,y}`, `Mouse.delta[axis]`, `Mouse.down`,
  `Mouse.up`, `Mouse.move` are first-class; the framework also exposes
  `Keyboard.DOWN`, `Keyboard.UP` events.
- **Window events:** `Events.UPDATE` (36×), `Events.RESIZE` (24×),
  `Events.READY` (22×), `Events.ERROR` (17×), `Events.END` (17×),
  `Events.VISIBILITY` (8×), `Events.COMPLETE` (8×), `Events.LOADED`
  (7×), `Events.UNLOAD` (5×), `Events.PROGRESS` (3×),
  `Events.WEBGL_CONTEXT_LOSS` (3×), `Events.CONNECTIVITY` (3×),
  `Events.SELECT`, `Events.CLICK`, `Events.HOVER`, `Events.HASH_UPDATE`,
  `Events.FULLSCREEN`, `Events.FAIL`, `Events.NEXT`, `Events.PREVIOUS`,
  `Events.RELOAD`, `Events.ORIENTATION`, `Events.MESSAGE`.
- **Per-frame loop:** Uses both `requestAnimationFrame` (10×) and
  `requestIdleCallback` (6×). Lerp factor is normalized for frame rate
  via `Math.framerateNormalizeLerpAlpha(alpha)` so a `0.1` lerp at 60 Hz
  produces the same feel across machines.

### Reduced motion

Not implemented at the CSS level. Not implemented in the UIL token system.
Not implemented in `Scroll.js` (no `prefersReducedMotion` flag exists on
the `Scroll` component).

---

## Content & Voice

The site deliberately has **almost no marketing copy on the homepage
surface itself**. The OG/Twitter description is the longest string a
first-time visitor reads:

> "Founded in 2012. We blend story, art & technology as an in-house team
> of passionate makers. Our industry-leading web toolset consistently
> delivers award-winning work through quality & performance."

And the bundle contains one paragraph that gets surfaced inside the AI
assistant tool description (visible only via the AI tool surface, not the
WebGL canvas):

> "Active Theory is a creative digital production studio founded in 2012.
> We focus on creative tech frameworks that are custom and beautifully
> crafted in-house. We have won 126 FWA awards, 24 Cannes Lions, 15 CLIO
> awards, …"

- **Tone:** Confident, technical, restrained. No exclamation marks, no
  emoji. Sentence case throughout.
- **Sentence length:** Short. The OG description runs 28 words across 2
  sentences; copy never balloons into paragraphs.
- **Capitalization:** Sentence case in headings and body. No Title Case.
- **Punctuation:** Oxford comma is used (e.g. "story, art & technology").
  Em-dash style: standard hyphen-hyphen `--`, no en-dashes.
- **CTA vocabulary:** The bundle binds `ViewController/contact = true`,
  `ViewController/goToWork = true`, `ViewController/topOfWork`,
  `ViewController/bottomOfWork`, `ViewController/resetWork`. There are no
  on-screen buttons labeled "Get a demo" / "Start free" / "Read the docs" —
  the site leads with **direct manipulation** of the WebGL canvas instead.
- **Document title pattern:** `${data.title} · Active Theory` on project
  pages; `Active Theory · Creative Digital Experiences` on the homepage.

---

## Information Architecture

Top-level routes observed in the bundle's `Router/state` bindings. Routes
are hash-driven (no path-based router).

- `/` — marketing homepage: WebGL intro scene + Work reel.
- `/Work/:project-slug` — project-detail scene. Title pattern
  `${data.title} · Active Theory` (set on `Work/project` binding).
  Sub-bindings: `Work/video`, `Work/refraction`, `Work/camera`,
  `Work/scrollProgress`, `Work/updatedVideo`, `Work/pane_ui`, `Work/pane`.
- `/contact` — opens the `ViewController/contact` overlay (sets
  `ViewController/contact = true`).
- `/?playground` — hidden `Global.PLAYGROUND` dev surface (the gizmo and
  scene-graph editor). Behind a `Utils.query("playground")` gate, not
  linked from the public UI.
- `/unsupported.html` — fallback page (served when the inline capability
  check fails).
- `/?noui&nomusic` etc. — query-string feature flags in `Utils.query(…)`
  used to disable HUD/audio on capture.

The IA is **flat**: Work list → Work detail → Contact. No blog, no
about/services/pricing pages. The studio's awards and team are surfaced
inside the AI assistant tool description, not as separate pages.

### Routes referenced in the bundle

```
Router.state                11
Router.route                 1
Router.previousRoute         1
Router.previous              1
Work/project                19
WorkItems/videoURL           3
Work/video                   3
Work/refraction              3
Work/camera                  3
Work/scrollProgress          2
Work/updatedVideo            1
Work/pane_ui                 1
Work/pane                    1
ViewController/contact      19
ViewController/video         9
ViewController/scroll        6
ViewController/uniforms      3
ViewController/goToWork      3
ViewController/visibleV      2
ViewController/scrollDeltaV  2
ViewController/resetWork     2
ViewController/navigate      2
ViewController/topOfWork     1
ViewController/scrollV       1
ViewController/bottomOfWork  1
UIL/ContextMenu              9
UILGraph/MoveNode            7
Global/loadFinished          8
Global/audioEnabled          6
InteractAISpeech/playing     5
InteractAIAssistant/isThinking 5
InteractAIGPT/thinking       4
ChatUIResponse/submit        4
SpeechRecognition/ready      3
```

---

## Accessibility

The site is intentionally aggressive about disabling standard browser
chrome (pinch-zoom, text-size-adjust, text selection, tap highlight). This
trade-off is common for full-bleed WebGL experiences but creates real
accessibility risk.

- **Color contrast:** Body text (`#FFFFFF`) on `#000000` is 21:1 (AAA).
  Secondary text on neutral-80 (`#8B8C8A` on `#000`) is ~6.2:1 — passes
  AAA for body text. Accent text (`#79AEFF` on `#000`) is ~9.4:1 — passes
  AAA. Error red `#E64040` on `#000` is ~4.9:1 — passes AA only for large
  text. Cyan `#00FFFF` on `#000` is ~12.6:1 — AAA.
- **Focus indicators:** `--focus-outline: 1 px solid var(--color-action)`,
  `--focus-outline-offset: 0`. Always 1 px solid `#1A6DEA`. Always visible.
- **Keyboard:** The custom `Scroll` class binds `Up`, `Down`, `Left`,
  `Right`, `PageUp`, `PageDown`, `Home`, `End`, `Space` and routes them
  to scroll deltas. All visible widgets in UIL are focusable.
- **Screen-reader landmarks:** The static HTML has only `<body>` and
  `<noscript>`; the WebGL canvas carries no `role`, no `aria-label`, no
  alternative text. The `aria-hidden`-style offscreen div
  `<div class="feature-detects">` is used purely to read CSS env-vars.
- **`<noscript>`:** "Please enable javascript" in 20 px white text on
  black (inline-styled, no class).
- **Motion:** No `prefers-reduced-motion` handling (see above).
- **Alt text:** The unsupported page has no alt text on its background
  image (it is set via `background-image`, not `<img>`). Public canvas
  has no alt text.
- **A11y class:** The bundle references a `GLA11y` class —
  `.GLA11y{position:absolute;width:0;height:100%;clip:rect(0 0 0 0);
  overflow:hidden}` — which is used to mount visually-hidden but
  screen-reader-readable content. Used sparingly.

---

## Sources

URLs actually opened or whose contents were observed during this dump:

- Homepage — https://activetheory.net/
- Fallback page — https://activetheory.net/unsupported
- Apple-touch icon — https://activetheory.net/assets/meta/apple-touch-icon.png
- Favicon 32×32 — https://activetheory.net/assets/meta/favicon-32x32.png
- Favicon 16×16 — https://activetheory.net/assets/meta/favicon-16x16.png
- Safari pinned-tab mask — https://activetheory.net/assets/meta/safari-pinned-tab.svg
- PWA manifest — https://activetheory.net/assets/meta/manifest.json
- Unsupported background plate — https://activetheory.net/assets/images/unsupported-bg.jpg
- Self-hosted font (Regular) — https://activetheory.net/assets/fonts/NBArchitektStd-Regular-export/NBArchitektStd-Regular.woff2
- Main app bundle — https://activetheory.net/assets/js/app.1780406240914.js
- Web-Worker thread — https://activetheory.net/assets/js/hydra/hydra-thread.js
- Social-share OG image — https://storage.googleapis.com/activetheory-v6.appspot.com/media/social.jpg (referenced from `<meta property="og:image">`)

Asset paths referenced from inside the bundle (not directly fetched, but
named in the code as live URLs served from the same origin):

- `assets/css/style-scss.css` — referenced from the UIL config; not in dump
- `assets/data/uil.json` / `assets/data/uil-partial.json` — CMS payload
- `assets/js/lib/qrious.js`, `_draco/`, `basis_transcoder.{js,wasm}`,
  `_resonance/resonance-audio.min.js` — runtime helpers
- `assets/shaders/compiled.vs` — precompiled vertex shader cache

---

## Changelog

- 2026-06-20 — Initial draft by dump-miner (this file).
