# Bruno Simon — design.md

> A structured design specification of **https://bruno-simon.com/**,
> written so a human or agent can reconstruct its look-and-feel without
> seeing the original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** design.md sub-agent
> **Source dump:** `tools/tmp/bruno-simon/` (gitignored)

---

## Overview

Bruno Simon's personal portfolio is a single-page WebGL application that
turns the page itself into a 3D driving game. The viewport is a full-bleed
`<canvas>` running a Three.js scene in which the visitor drives a small
vehicle through a stylised, hand-modelled miniature world; an HTML/CSS
overlay provides a radial menu, modal dialogs, top-down map, achievement
toasts, and a notifications stack. There is no traditional "scroll the
homepage" reading flow — content (About, Controls, Achievements, Behind
the scene, Whispers, Circuit) is reached by driving the car into a region
and the menu then re-orients the camera and overlays the relevant panel.
The result reads as a portfolio in the form of a video game rather than a
website.

**Category:** Other — interactive 3D portfolio / game-as-resume
**Primary surface observed:** Single-page WebGL experience (one
`index.html`, one main JS bundle, one CSS bundle, many 3D / texture
assets fetched at runtime)
**Tone:** confident, playful, technically literate, deliberately gamey
**Framework detected:** none at the framework layer; the build is a Vite
SPA bundle (single `<script type="module" crossorigin>` of ~4.86 MB
containing Three.js r183, GSAP 3.12.5, Howler.js, lil-gui, a Draco / KTX2
loader stack, and the project source). A separate `rapier-BmPn8Tpt.js`
chunk (~230 KB) is loaded with `__vitePreload` for the 3D physics
engine (Rapier, dimforge / `rapier.rs`).

---

## Visual Language

The site is a dark, low-poly night scene: a violet-to-near-black radial
backdrop, white wireframe-and-flat-shaded props, and a single saturated
red → magenta gradient used for interactive surfaces and the menu
hamburger. Typography is a relaxed grotesque (Nunito) for body copy and
a tall condensed hand-drawn display face (Amatic SC) for in-panel
headings, with the studio's own **Pally** family (Regular / Medium /
Bold) used wherever buttons, panels or "world HUD" text need a custom
look. The chrome is thin 1px white borders at 35 % opacity, almost no
shadows, and corner radii of 4 / 6 / 8 / 15 px. Colour is sparse: most
surfaces are very dark, with text in white and a small set of semantic
accents (lime success, coral danger, peach warning).

### Color

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (page base, behind canvas) | `--bg-base` | `#251F2B` (dark plum) | outer stop of the radial |
| Background (page base, inner stop) | `--bg-base-inner` | `#1D1721` (near-black violet) | top-left `radial-gradient(farthest-side at 0 0, ...)` on `html` |
| Background (panel / menu inner) | `--bg-panel` | `#251F2B` (dark plum) | also `#1D1721` inner |
| Background (panel radial) | — | `radial-gradient(ellipse at top left, #251F2B, #1D1721)` | used on `.content` and `.previews` |
| Background (active button-inner) | — | `radial-gradient(ellipse at top right, #C21515, #46123B)` | hot red → magenta, the brand accent |
| Background (active menu-trigger inner) | — | `radial-gradient(ellipse at top right, #C21515, #46123B)` | same gradient on the menu hamburger, map button, etc. |
| Background (active flag button inner) | — | `radial-gradient(ellipse at top right, #C21515, #46123B)` | reused on every "button-inner" with `--hover-translate` |
| Text (primary) | `--text-primary` | `#FFFFFF` (white) | body copy inside the menu / modals |
| Text (muted) | `--text-muted` | `rgba(255, 255, 255, 0.8)` | placeholder text on inputs, idle button labels |
| Text (border on idle buttons) | — | `rgba(255, 255, 255, 0.8)` | 1px border |
| Text (input dividers) | — | `#555555` | border between input-group segments |
| Accent (success) | `--accent-success` | `#D5FF95` (lime) | used for `.button.is-success` and the active "WebGPU" toggle |
| Accent (danger) | `--accent-danger` | `#FF6A7C` (coral) | `.button.is-danger`, respawn error text |
| Accent (text-danger) | `--accent-text-danger` | `#FF87A2` (pink) | `.text-danger` (e.g. "Server currently offline") |
| Accent (highlight) | `--accent-peach` | `#FFC67B` (peach) | decorative highlight, `.button.is-danger` variant |
| Accent (interactive) | `--accent-interactive` | `#FFCECA` (rose) | strokes on the inline-SVG whisper / submit icons, focused input submit button |
| Accent (warm) | — | `#FFCECA` | "Your message" form submit icon stroke |
| Neutral (translucent white, top of fade) | — | `rgba(255, 255, 255, 0.06)` (`#FFFFFF0F`) | top stop of `linear-gradient(to top, #ffffff05, #ffffff0f)` highlight strip |
| Neutral (translucent white, bottom of fade) | — | `rgba(255, 255, 255, 0.02)` (`#FFFFFF05`) | bottom stop of the same highlight |
| Neutral (key border) | — | `rgba(255, 255, 255, 0.2)` | `<span class="key">` outline |
| Neutral (key text muted) | — | `rgba(255, 255, 255, 0.35)` | `.button-inner:after` border / modal frame outline |
| Selection text | — | text `#251F2B` on background `#FFFFFF` | `.menu *::selection` |
| Touch overlay bottom fade | — | `linear-gradient(#1D172100, #1D172199)` and `radial-gradient(ellipse farthest-side at bottom, #1D1721, #1D172100)` | mobile touch-buttons area |
| Shadows | — | `0 0 4px #0007` and `0 0 4px #251F2B77` | very small, only used on inline message flags and the active tab background |

No dark/light mode toggle is exposed — the 3D scene is permanently
night. The visible scene *itself* is the design, and it cycles through
day/night and seasons procedurally (Three.js `dayCycles`, `yearCycles`,
`weather`, `fog`, `lighting` modules referenced in `Game.init()`), but
the surrounding UI chrome is always the same dark plum panel.

### Typography

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Page / chrome (default) | `"Nunito", sans-serif` | 400 | `1rem` (16px at desktop) | inherit | `0` |
| Body text in panels | `"Nunito", sans-serif` | 400 | `1rem` | inherit (default) | `0` |
| Body text small | `"Nunito", sans-serif` | 400 | `0.8rem` (~12.8px) | inherit | `0` |
| Section title (H2) | `"Amatic SC", sans-serif` | 700 | `2.5rem` (40px) | `1em` | `0` |
| In-panel sub-title (e.g. "Rewards") | `"Amatic SC", sans-serif` | 700 | `1.7rem` (27.2px) | `1em` | `0` |
| Brand "Pally" stack (debug panel only) | `Pally-Regular` / `Pally-Medium` / `Pally-Bold` | 400 / 500 / 700 | n/a (referenced as `500 20px Pally-Medium` in the font loader) | n/a | n/a |
| Button label | `"Nunito", sans-serif` | 400 | inherits `1rem` | `58px` (button `line-height` matches height) | `0` |
| Tab label | `"Nunito", sans-serif` | 400 | inherits | inherit | `0` |
| Inline `<span class="key">` | `"Nunito", sans-serif` | 700 | inherits | inherit | `0` |
| Whisper name-tag input | `"Nunito", sans-serif` | 700 | `25px` | `1em` | `8px` (`letter-spacing:8px`); `14px` on placeholder, with `padding-left:4px` |
| Whisper message text | `"Nunito", sans-serif` | 400 | `2.5rem` (40px) | `1em` | `0` |
| Console ASCII banner (dev) | `monospace` | 400 | `1em` | `1em` | `0` |
| Tooltip | `"Nunito", sans-serif` | 400 | inherits | inherit | `0` |

**Font sourcing:**

- **Pally** is Bruno Simon's own family. Three weights are self-hosted
  in `tools/tmp/bruno-simon/fonts/` in three formats each (woff2, woff,
  ttf), `@font-face` declared with `font-display: swap` and
  `font-style: normal`. Pally is wired into the document via a hidden
  `.js-fonts-loader.fonts-loader` that contains three zero-size
  `<div class="font nunito|amatic-sc|pally">` elements each annotated
  with `data-font="..."` so the browser pre-loads the faces. Pally is
  only observed in the lil-gui debug panel CSS in the dump
  (`mini-panel-content` style adjustments), so the visible production
  UI does not directly use it; it is still loaded so the debug overlay
  matches the rest of the studio's sites.
- **Amatic SC** and **Nunito** are pulled from Google Fonts via
  `https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Nunito:wght@400;700;900&display=block`.

`html { font-size: 20px; }` at desktop, dropping to `18px` at
`max-width: 520px` and `16px` at `max-width: 440px`. The root uses
`-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`
and `font-optical-sizing: auto`.

### Spacing & radius

- **Base unit:** 4 px (the project does not use an explicit spacing
  scale; instead, individual values are 4 / 5 / 6 / 8 / 10 / 13 / 15 /
  16 / 20 / 25 / 30 / 40 / 50 / 58 px chosen by component).
- **Radii observed:** `4px` (`.key` chip), `6px` (small), `8px`
  (`.button`, `.input-group`, default), `15px` (`.is-xbox` gamepad
  glyph chip), and `9999px`-equivalent rounded forms
  (`border-radius:15px` on a 30×30 button is a pill).
- **Borders:** 1px white at 35 % opacity is the default frame
  (`.button-inner:after`, `.previews:after`, `.map-container:after`),
  1px white at 80 % opacity on idle buttons, 1px `#555` for input-group
  dividers.
- **Shadows:** effectively absent. Two micro-shadows exist:
  `box-shadow: 0 0 4px #0007;` and `box-shadow: 0 0 4px #251f2b77;`,
  both used sparingly on inline whisper flags and the active tab
  background.

### Iconography

- **Style:** hand-drawn outline, 1-stroke (most are 2 px white stroke
  on a transparent canvas; the close icons use stroke-width 3 for
  emphasis). All icons in `svgs/` declare `viewBox` and use
  `fill="none"` with `stroke="white"` or `fill="white"`.
- **Library:** none — these are bespoke SVGs authored for the
  portfolio. The HTML also inlines a few SVGs (the menu hamburger is
  built from three CSS `.line` divs, not an SVG; the "submit" /
  "restart" / "flag" / "controller" icons inside buttons are inline
  `<svg>` paths).
- **Default size:** varies per icon — see the SVGs table. Most menu
  icons are 22–28 px, the close icons are 16–24 px, the warning and
  gamepad icons are 28–34 px.
- **Stroke language:** all monochrome white, mostly 2 px, sometimes
  3 px. No duotone or filled variants are used.

---

## Layout & Grid

The site is one full-viewport surface — `html, body, .game, .modals,
.menu` are all `position: fixed; top: 0; left: 0; width: 100%;
height: 100%; overflow: hidden;`. There is no document scroll, no
container max-width, and no gutter — the camera and the panels own the
viewport.

- **Max content width (menu panel):** `min(1000px, calc(100% - 120px))`
  on the `.menu .inner` block, and `min(600px, calc(100% - 20px))` on
  the same block once the viewport falls below the medium breakpoint.
- **Page gutter:** none. Everything is measured off the viewport.
- **Grid:** no explicit grid. The menu is a `display:flex` row with
  the navigation rail pinned to the left, the image previews on the
  left half (50 % width), and the prose content on the right half
  (50 % width).
- **Breakpoints (px):**
  `360`, `440`, `520`, `800`, `870`, `1100` (max-width); `540`,
  `620` (max-height). Portrait orientation also has its own queries.
- **Vertical rhythm:** none in the traditional sense. Panels
  themselves have `padding: 25px 40px 40px` (desktop) /
  `20px 30px 30px` (≤ 870) / `15px 20px 20px` (≤ 520) /
  `10px 15px 15px` (≤ 440).

**Homepage layout in plain prose.** The visitor lands on a full-bleed
canvas with a tiny white 3D car idling on a wooden platform surrounded
by lantern-lit ground, low-poly trees and a winding road that recedes
into a violet sky. Two floating white-bordered "hamburger" buttons sit
on the right edge: the menu trigger (top right, at `top: 20px`) and the
map trigger (`top: 70px`). There is no other visible UI on first load —
the page is deliberately empty so the 3D scene reads as the hero. The
`html` element is decorated with class names that drive input filtering
(`html.input-filter-intro` while the car is on the landing platform,
`html.input-filter-wandering` once driving, `html.input-filter-menu` /
`html.input-filter-modal` / `html.input-filter-cinematic` for the
in-game states). Pressing the menu trigger slides the right rail in,
reveals the navigation column on the left, a square WebP preview on the
left half, and a textual panel on the right half that contains a
`title` in Amatic SC and Nunito body copy. The menu, the modals and
the map each occupy the full viewport with their own panels; the
notifications stack floats in from the top centre as in-game
achievements unlock.

---

## Components

The site is a game with a UI, not a marketing site with a few widgets.
The components below are the ones observed in the dump and in the
HTML / CSS.

### Canvas (the 3D world)

- **Element:** `<canvas class="js-canvas">`, child of `<div class="game">`.
- **Behavior:** full-viewport, fills the `position:fixed` `.game` shell
  via inline `width:100%; height:100%` styles added by the renderer
  (Three.js `WebGPURenderer` / `WebGLRenderer`). The canvas is
  pixel-ratio aware (the `Viewport` class clamps `pixelRatio` to a
  small max, presumably 2).
- **What it shows:** a Three.js `Scene` containing the vehicle (loaded
  from `vehicle/default-compressed.glb`), the playground
  (`playground/playgroundVisual-compressed.glb` and
  `playground/playgroundPhysical-compressed.glb`), a procedurally
  foley world (`world` / `objects` / `lighting` / `fog` / `water` /
  `weather` / `wind` / `tracks` / `noises` modules in `Game.init()`),
  a vehicle-driven Rapier physics world, dynamic shadows, and an
  EffectComposer postprocessing stack (`Rendering.setPostprocessing()`).
- **States:** intro (camera on the car, idle pulse), wandering
  (player drives), cinematic (cutscene / achievement reveal),
  menu / modal (camera is positioned behind the car, panel slides in
  over the canvas which is dimmed but still rendering in the
  background).

### Menu trigger (top-right hamburger)

- **Anatomy:** `<button class="js-menu-trigger menu-trigger">` containing
  a `.button-inner` (44 × 44 px on the outer button, with
  `--hover-translate: 4px`) holding a 3-line hamburger built from CSS
  `.icon-container > .icon > .line × 3`. The `.line` elements are
  `2px` tall, `width:100%`, `background:#fff`, absolutely positioned.
- **Position:** `position: absolute; right: 0; top: 20px;` (and
  `right:0; top: 70px;` for the `.map-trigger`). 44 × 44 px hit area.
- **Style:** outer button is invisible (transparent); the visible
  square is the `.button-inner`, painted with
  `radial-gradient(ellipse at top right, #C21515, #46123B)` and an
  inner 1 px white-at-35 % frame (`.button-inner:after { inset: 3px 0
  3px 3px; border: 1px solid #fff; border-right: none; opacity: .35;
  }`).
- **States:**
  - default: visible (`html.is-started .menu-trigger { display:block; }`).
  - hover (mouse only): `.button-inner` translates `-4px` to the left
    on a `transition: transform .15s .15s;`, and the frame fades from
    0.35 to 0.8 alpha on `transition: opacity .15s`.
  - active / open: hamburger switches to a close-X form.
  - disabled: pointer-events disabled in the
    `input-filter-menu | modal | cinematic | intro` modes.

### Map trigger (top-right, just below menu trigger)

- Identical anatomy to the menu trigger but renders the inline
  `<img class="map-icon" src="ui/map.svg">` icon (26 × 26 px) inside
  its `.icon-container`. The close-state for the map modal is the same
  hamburger transform: when the modal is open the inner
  `.button-inner` is `transform: translate(100%)` (slides off-screen
  to the right) with `transition-delay: 0`.

### Menu (the radial panel)

- **Element:** `<div class="js-menu menu">` containing an `.inner`
  (`width: min(1000px, calc(100% - 120px)); height: min(600px, calc(100% - 120px)); position: relative;`).
- **Layout:** left side is `.navigation` (a vertical column of icon
  buttons — home, gear, gamepad, medal, wheel, whisper-fill, question
  — each with `data-name="…"`), right side is a `.container` split
  horizontally into `.previews` (50 % width) and the textual
  `.contents` (the other 50 %).
- **Previews:** seven `.preview` blocks (one per menu section), each
  with a `.background` `<img>` set to a 600 × 600 WebP
  (`ui/previews/home.webp`, `…/options.webp`, `…/controls.webp`,
  `…/achievements.webp`, `…/circuit.webp`, `…/whispers.webp`,
  `…/behindTheScene.webp`). The active preview is faded in on
  `transition: opacity .3s; transition-delay: .3s;` and `.is-visible`
  brings it to `opacity:1; pointer-events:auto; transition-delay:0`.
- **Contents:** seven matching `.content` blocks (`home-content`,
  `options-content`, `controls-content`, `achievements-content`,
  `circuit-content`, `whispers-content`, `behindTheScene-content`),
  each a `.content-inner` with `padding: 25px 40px 40px` and the
  radial panel background
  (`radial-gradient(ellipse at top left, #251F2B, #1D1721)`). The
  inner panels are framed with the same `inset:3px; border:1px solid
  #fff; opacity:.35;` frame as the previews.

### Button

- **Variants:** default (transparent body, 1 px white-80 % border,
  white-80 % label), `.is-disabled` (dashed border, no pointer),
  `.is-success` (lime `#D5FF95` text), `.is-danger` (coral `#FF6A7C`
  text, used for the "Respawn" button). The "active" or "pushed" state
  is modelled by the inner `.button-inner` red → magenta gradient
  (the hamburger, map button, achievements reset, etc., are all
  variant buttons painted on top of the same `.button-inner`
  component).
- **Sizes:** default `height: 58px; line-height: 58px; padding: 0
  16px;`; sm (`.is-small`) inherits the height but uses smaller
  padding; at `max-width:520px` the height drops to 50 px, at
  `max-width:440px` to 45 px. `border-radius: 8px` always.
- **Anatomy:** label (Nunito 1rem), optional leading inline SVG
  `.icon` (vertical-align middle; some icons are nudged `top:-2px` or
  `top:-1px` to optical-align with text), optional trailing arrow.
- **States:** default (idle), hover (mouse, non-touch only —
  `html:not(.is-mode-touch) .button:not(.is-disabled):hover` raises
  border to `1px solid #fff` and color to `#fff` on a `transition:
  .15s`), active / pressed (the `.button-inner` red gradient is
  always present, so the gradient acts as a permanent "engaged"
  surface; on hover the inner translates 4 px out and the frame fades
  up), focus (`button, input { outline: inherit; }` — focus rings
  inherit from the browser default, no custom outline is added),
  disabled (40 % opacity equivalent via the dashed border; no
  pointer).

### Input group (whisper / name-tag)

- **Anatomy:** a `<form class="js-input-group input-group">` with
  three children: a `.input-flag` (62 × 58 px), a `.input-text`
  (flexible width), and a `.submit` button (62 × 58 px if icon-only
  or `padding: 0 20px` if text).
- **Borders:** 1 px `#555` top and bottom; first child adds
  `border-left: 1px solid #555; border-radius: 8px 0 0 8px`; submit
  child adds `border-radius: 0 8px 8px 0`. Backgrounds are
  transparent.
- **States:** default (`color: #555` on submit, no fill), valid
  (`.is-valide` adds `border-color: #FFceca; color: #FFceca;` and
  recolours the submit SVG strokes to `#FFceca`), focus / typing
  (browser native outline inherits).
- **Variants:** `.is-message` (whisper form, full width inside the
  whispers panel) and `.is-name-tag` (circuit end-of-race name entry,
  100 px wide input with `letter-spacing: 8px`, `text-transform:
  uppercase`, `font-size: 25px`, `font-weight: 700`).

### Tab strip (controls panel)

- **Anatomy:** `<div class="js-tabs tabs">` with a `.tabs-navigation`
  of three `.tab` buttons (`data-tabs-name="mouse-keyboard" | "touch"
  | "gamepad"`), each containing an `.active-background` and an
  `.icon-container > .icon.icon-mouse-keyboard|icon-touch|icon-gamepad`
  + a `.label`. Below sits `.tabs-content` with one
  `.tabs-content-item` per tab containing a `<table>` of key bindings.
- **Layout:** `display: flex; margin-bottom: 30px;` on the nav, each
  tab is `display: flex; flex-direction: column; align-items: center;
  height: 60px; padding: 10px 0; flex: 1;`.
- **Active state:** `.is-active .icon-container { opacity: .7 }` and
  `.is-active .label { opacity: 1 }`; on hover (mouse only) the same
  rules apply. The `.active-background` is the small drop-shadow
  element behind the icon.

### `<span class="key">` chip

- Single-line inline key cap.
- `display: inline-block; padding: 0 4px; border: 1px solid rgba(255,
  255, 255, .2); border-radius: 4px; font-weight: 700;`.

### Reward tile (achievements)

- A 80 × 80 WebP thumbnail of the unlocked vehicle paint (red, orange,
  white, black, flames, abyssal) wrapped in a `<button class="reward">`
  with a `.picture` image and a `.lock` overlay that holds a 16 × 22
  lock SVG when the reward is still locked.
- Locked state: `.is-locked .lock { display: block }`,
  `.is-locked { cursor: not-allowed }`.
- A tooltip (`.tooltip`) shows the unlock condition; visible on
  `:hover`.

### Modal

- **Anatomy:** a fixed-overlay `<div class="js-modal modal" data-name="…">`
  containing a `.container > .content` and a `.js-close.close`
  trigger.
- **Variants:** `circuit-end` (race results with name-tag input,
  Restart and "End" buttons), `discord` (two-column "Public server" /
  "Private messages" layout with `.title-container > .line.left +
  .title + .line.right` ornaments), `map` (full-viewport
  `.map-container` with a `<img class="js-texture texture">` and an
  absolutely positioned `<div class="js-player player">` showing the
  world-map cursor).
- **States:** hidden (`display: none`), shown
  (`.modals.is-displayed { display: flex }`), fading
  (`opacity:0; transition: opacity .3s`).

### Map container

- **Anatomy:** `<div class="js-map-container map-container">` with a
  `position: absolute; inset: 0; overflow: hidden;` and the same
  1 px white-35 % inset frame.
- **Content:** a `.js-texture.texture` (the world top-down map)
  driven by `Map.setTexture()` plus a `.js-player.player` div that is
  a 160 × 160 WebP (`ui/map/player.webp`) absolutely positioned at
  `top:-40px; left:-40px;` (centred on the player via a negative
  half-size offset). On the `.is-bouncing` state the marker runs the
  `map-player-animation` keyframe (see Animations).

### Notification toast

- **Anatomy:** `<div class="js-notifications notifications">` placed
  `top: 20px; left: calc(50% - var(--max-width)/2);` with
  `--max-width: min(350px, calc(100% - 40px))`. Each toast is a
  `<div class="js-notification notification">` with the radial
  panel background, `padding: 12px 20px 15px 15px;` and the same
  white-35 % frame.
- **Motion:** enters from `translateY(calc(-100% - 20px))` to
  `translateY(0)` on `transition: transform .6s cubic-bezier(.4,1.6,
  .65,1)` (overshoot), leaves with `translateY(calc(-100% + 20px))
  scale(0)` on `cubic-bezier(.42,0,.47,-.55); transition-duration:
  .45s`.

### Touch buttons (mobile HUD)

- Visible only on touch-capable devices when
  `html.is-mode-touch .touch-buttons.is-active { display: block; }`.
  The wrapper is `position: absolute; bottom: 0; height: 0;
  width: 100%; pointer-events: none;` and contains six round buttons
  (Interact, Unstuck, Previous, Next, Open, Close) plus a `.overlay`
  that fades the bottom 15 vh of the screen with
  `linear-gradient(#1D172100, #1D172199)`.

---

## JavaScript & Libraries

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Three.js | r183 (`REVISION = "183"`) | Bundled in `index-ORr3L4no.js`, ~186 references to `THREE.*` and the presence of `REVISION = "183"`. | Both the legacy `WebGLRenderer` and the new `WebGPURenderer` (39 mentions) are wired up; the visible `Renderer` toggle in the Options panel lets the user pick "WebGPU" as the active backend. TSL (Three.js Shading Language) is used throughout (the build embeds the entire TSL namespace table). |
| GSAP | 3.12.5 | `Timeline.version = gsap.version = "3.12.5";` in the bundle. | Used for tween-style animations (menus, panel transitions). |
| Howler.js | 2.x (no inline version string) | `Howler`, `Howl`, `HowlerGlobal` are present in the bundle. | Drives in-world audio (engine sound, jukebox, ambient music). The "Audio" toggle in the Options panel calls `Howler.mute(true/false)`. |
| Rapier (3D) | 0.x (Dimforge) | Separate chunk `rapier-BmPn8Tpt.js` (~230 KB) imported via `__vitePreload(() => import("./rapier-BmPn8Tpt.js").then(...))`. Exports include `RigidBodyDesc`, `Collider`, `ColliderDesc`, `World`, `ActiveCollisionTypes`, `ActiveEvents`, `ActiveHooks`, `Ball`, `Capsule`, `BroadPhase`, `CCDSolver`, etc. | Physics world for the vehicle. |
| lil-gui | 0.x (debug panel) | `lil-gui` and `.mini-panel-content .item-row { padding: 3px 8px; min-height: 24px; }` style block. | Debug-only; the on-screen `Debug` instance is created in `Game.init()`. |
| Draco / KTX2 loaders | bundled | `draco_decoder.wasm`, `KTX2Loader`, `setDRACOLoader` in the bundle. | Used to decompress GLB assets and the three KTX2 textures (`palette.ktx`, `behindTheScene/stars.ktx`, `intro/sound.ktx`). |
| Tweakpane / dat.gui | not present | — | lil-gui is used instead. |
| Vite | inferred | The two JS chunks share `import.meta.url` and `__vitePreload`; the import map shape matches Vite's runtime. | This is a Vite SPA build, not a framework-based (React / Vue / Svelte) app. The page does not use any framework — components are vanilla classes (`Game`, `Rendering`, `Menu`, `Modals`, `Notifications`, `Inputs`, `Audio`, `Viewport`, `DayCycles`, `YearCycles`, `Weather`, `Wind`, `Tracks`, `Lighting`, `Fog`, `Water`, `Materials`, `Objects`, `Explosions`, `World`, `Reveal`, `Noises`, `Gamepad`, …). |
| Google Fonts | — | `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Nunito:wght@400;700;900&display=block">` | Amatic SC 700, Nunito 400 / 700 / 900. |
| gtag / Google Analytics | `G-JMSN30BQ5J` | Inline script after the meta tags. | Single pageview / event tracker. |

**Resources loaded at runtime** (from the `Game.init()` resource
loader — these are the *expected* URLs the app fetches after the
initial bundle; only the preload-declared `respawnsReferences-compressed.glb`,
`behindTheScene/stars.ktx`, `intro/sound.ktx` and `palette.ktx` are
visible in the static HTML preload list):

- **Models (gltf, `-compressed` variant):**
  `vehicle/default-compressed.glb`, `playground/playgroundVisual-compressed.glb`,
  `playground/playgroundPhysical-compressed.glb`,
  `terrain/terrain-compressed.glb`, `terrain/terrain.ktx`,
  `scenery/scenery-compressed.glb`, `areas/areas-compressed.glb`,
  `bushes/bushesReferences-compressed.glb`,
  `birchTrees/birchTreesVisual-compressed.glb`,
  `birchTrees/birchTreesReferences-compressed.glb`,
  `oakTrees/oakTreesVisual-compressed.glb`,
  `oakTrees/oakTreesReferences-compressed.glb`,
  `cherryTrees/cherryTreesVisual-compressed.glb`,
  `cherryTrees/cherryTreesReferences-compressed.glb`,
  `flowers/flowersReferences-compressed.glb`,
  `bricks/bricks-compressed.glb`, `fences/fences-compressed.glb`,
  `benches/benches-compressed.glb`,
  `explosiveCrates/explosiveCrates-compressed.glb`,
  `lanterns/lanterns-compressed.glb`,
  `poleLights/poleLights-compressed.glb`,
  `tornado/tornadoPathReferences-compressed.glb`,
  `respawns/respawnsReferences-compressed.glb`.
- **KTX2 textures:** `palette.ktx`, `behindTheScene/stars.ktx`,
  `intro/sound.ktx`, `terrain/terrain.ktx`,
  `floor/slabs.ktx`, `foliage/foliageSDF.ktx`,
  `whispers/whisperFlame.ktx`, `areas/satanStar.ktx`,
  `overlay/overlayPattern.ktx`,
  `interactivePoints/interactivePointsKeyIconCross.ktx`,
  `interactivePoints/interactivePointsKeyIconEnter.ktx`,
  `interactivePoints/interactivePointsKeyIconA.ktx`,
  `jukebox/jukeboxMusicNotes.ktx`, `achievements/glyphs.ktx`,
  `career/careerFreelancer.ktx`, `career/careerHetic.ktx`,
  `career/careerImmersiveGarden.ktx`, `career/careerIRLTeacher.ktx`,
  `career/careerOnlineTeacher.ktx`, `career/careerUzik.ktx`,
  `timeMachine/timeMachineScreenMGS.ktx`,
  `timeMachine/timeMachineScreenFolio.ktx`.

---

## Animations (Catalog)

The CSS bundle is unusually light on keyframes because almost every
visible motion is a hand-tuned `cubic-bezier` transition on
`transform` or `opacity`, plus a great deal of motion happening inside
the Three.js renderer that is *not* expressed as CSS.

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `map-player-animation` | `css/index-Di03QkGT__63faf864.css` (single-line bundle, declared inline) | `1s` with `0.5s` delay (`.player.is-bouncing:after { animation: map-player-animation 1s .5s }`) | steps of `transform: scale(1) → 1.2 → 1 → 1.2 → 1` at 0 / 20 / 40 / 60 / 80 % | the player position on the world-map changes (`.player.is-bouncing` added) |

### JS-driven animations (selection, not exhaustive)

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| GSAP | Menu open / close (slide `.button-inner` off-screen, `transform: translate(100%)` with `transition-delay: 0`) | menu trigger click | Implemented in CSS (cubic-bezier) but GSAP tweens additional camera/UI properties. |
| GSAP | Camera transitions between intro / wandering / cinematic / menu / modal states | state class change on `<html>` | Drives the cinematic camera. |
| GSAP | Notifications enter (`translateY` from `-100% - 20px` to `0`, with overshoot) | `.is-visible` class | `transition: transform .6s cubic-bezier(.4,1.6,.65,1)`. |
| GSAP | Notifications leave (`translateY(calc(-100% + 20px)) scale(0)`) | `.is-leaving` class | `transition-timing-function: cubic-bezier(.42,0,.47,-.55); transition-duration: .45s`. |
| Three.js | Per-frame scene render | always | Main animation loop in `Rendering.start()`. |
| Three.js | Vehicle wheel spin, suspension, hydraulics | user input | Numeric keys "activate hydraulics" per the controls table. |
| Three.js | Day / night cycle (`DayCycles`, `YearCycles`) | continuous | Skybox and lighting shift; the menu / canvas does not change. |
| Three.js | Weather (rain, fog, wind) | continuous / triggered | `Weather`, `Wind`, `Noises`, `Tracks`, `Fog`, `Water` modules. |
| Three.js | `Reveal` cinematic | achievement unlocked | The "Reveal" class plays a cutscene for each unlocked reward. |
| `Ticker` | requestAnimationFrame pump | always | Single fixed-step ticker driving the whole game. |
| `Inputs` | Input-filter state machine (intro / wandering / menu / modal / cinematic) | user gesture or scripted transition | Drives the global `<html>` class list. |

### Page transitions

- No traditional "route change" — this is a single page. The menu /
  modal / map each pop in by toggling their `display` / `opacity` /
  `transform` and shifting the active `.preview` /
  `.content` block. The `.preview` swap is a 300 ms `opacity`
  crossfade with a 300 ms delay on the leaving tile, and the
  `.content` swap is a 300 ms `transform: translateY` slide with
  the same `cubic-bezier(.49, 2.2, .53, .75)` overshoot.
- The boot reveal itself is "the page is the 3D scene": there is no
  loader bar or splash; the canvas just appears full-bleed and the
  menu trigger fades in once `html.is-started` is set.

---

## Assets

### 3D models

The dump contains exactly one GLB (`respawnsReferences-compressed.glb`,
2.8 KB) but the JS bundle fetches the rest at runtime.

| Local path | Format | Size | Source URL | Notes |
| --- | --- | --- | --- | --- |
| `tools/tmp/bruno-simon/models/respawnsReferences-compressed__f1eac004.glb` | glTF binary (`-compressed`, Draco) | 2.8 KB | `https://bruno-simon.com/respawns/respawnsReferences-compressed.glb` | Preloaded in the static HTML. Authored reference positions for the respawn teleports. |

All other models (`vehicle/default-compressed.glb`,
`playground/playgroundVisual-compressed.glb`,
`playground/playgroundPhysical-compressed.glb`, `terrain`,
`scenery`, `areas`, `bushes`, `birchTrees`, `oakTrees`,
`cherryTrees`, `flowers`, `bricks`, `fences`, `benches`,
`explosiveCrates`, `lanterns`, `poleLights`, `tornado`) are
declared in the `Game.init()` resource loader but were not captured
in the static dump (the static scraper caught only the entry HTML and
its explicitly preloaded resources). Not observed as local files in
the dump, but their URLs are inferred from the JS bundle above.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| Pally | 400, 500, 700 | woff2, woff, ttf | `tools/tmp/bruno-simon/fonts/Pally-{Regular,Medium,Bold}.{woff2,woff,ttf}` | yes (Bruno Simon's own family, ~21–68 KB per file) |
| Nunito | 400, 700, 900 | woff2 (Google Fonts) | `https://fonts.googleapis.com/css2?family=…Nunito:wght@400;700;900` | no |
| Amatic SC | 700 | woff2 (Google Fonts) | `https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700` | no |

Total font payload (self-hosted): 9 files, ~347 KB.

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `images/apple-touch-icon__8725935a.png` | PNG | 180 × 180 | 4.4 KB | `https://bruno-simon.com/favicons/apple-touch-icon.png` | iOS home-screen icon |
| `images/favicon-96x96__9e719cfd.png` | PNG | 96 × 96 | 1.0 KB | `https://bruno-simon.com/favicons/favicon-96x96.png` | Standard favicon |
| `images/favicon__8c2338e0.ico` | ICO | 48 × 48 | 14.7 KB | `https://bruno-simon.com/favicons/favicon.ico` | Legacy favicon |
| `images/share-image__1a2ffb1c.png` | PNG | 1200 × 630 | 687 KB | `https://bruno-simon.com/social/share-image.png?cb=a` | OpenGraph / Twitter card |
| `images/home__81918cf3.webp` | WebP | 600 × 600 | 29.6 KB | `https://bruno-simon.com/ui/previews/home.webp` | Home menu preview |
| `images/options__638ef151.webp` | WebP | 600 × 600 | 63.8 KB | `https://bruno-simon.com/ui/previews/options.webp` | Options menu preview |
| `images/controls__73e3a950.webp` | WebP | 600 × 600 | 27.4 KB | `https://bruno-simon.com/ui/previews/controls.webp` | Controls menu preview |
| `images/achievements__b3a067f5.webp` | WebP | 600 × 600 | 48.8 KB | `https://bruno-simon.com/ui/previews/achievements.webp` | Achievements menu preview |
| `images/circuit__17836d92.webp` | WebP | 600 × 600 | 34.5 KB | `https://bruno-simon.com/ui/previews/circuit.webp` | Circuit menu preview |
| `images/whispers__c816a578.webp` | WebP | 600 × 600 | 32.5 KB | `https://bruno-simon.com/ui/previews/whispers.webp` | Whispers menu preview |
| `images/behindTheScene__10142fe0.webp` | WebP | 600 × 600 | 60.4 KB | `https://bruno-simon.com/ui/previews/behindTheScene.webp` | "Behind the scene" menu preview |
| `images/red__389984c8.webp` | WebP | 80 × 80 | 0.9 KB | `https://bruno-simon.com/ui/achievements/rewards/red.webp` | Default car paint (red) |
| `images/orange__4d131e52.webp` | WebP | 80 × 80 | 0.9 KB | `https://bruno-simon.com/ui/achievements/rewards/orange.webp` | Unlocked paint |
| `images/white__babae6a6.webp` | WebP | 80 × 80 | 0.8 KB | `https://bruno-simon.com/ui/achievements/rewards/white.webp` | Unlocked paint |
| `images/black__b33b22cb.webp` | WebP | 80 × 80 | 0.8 KB | `https://bruno-simon.com/ui/achievements/rewards/black.webp` | Unlocked paint |
| `images/flames__03aa278d.webp` | WebP | 80 × 80 | 1.6 KB | `https://bruno-simon.com/ui/achievements/rewards/flames.webp` | Unlocked paint |
| `images/abyssal__aba22aad.webp` | WebP | 80 × 80 | 1.4 KB | `https://bruno-simon.com/ui/achievements/rewards/abyssal.webp` | Unlocked paint |
| `images/player__dc50c5fe.webp` | WebP | 160 × 160 | 6.7 KB | `https://bruno-simon.com/ui/map/player.webp` | Top-down map player marker |
| `images/actions-icon-arrow__596b1b57.webp` | WebP | 40 × 72 | 0.3 KB | `https://bruno-simon.com/ui/actions/actions-icon-arrow.webp` | In-world interaction arrow |
| `images/actions-icon-close__607b168b.webp` | WebP | 72 × 72 | 0.5 KB | `https://bruno-simon.com/ui/actions/actions-icon-close.webp` | In-world "close" icon |
| `images/actions-icon-open__b0a98800.webp` | WebP | 76 × 76 | 0.6 KB | `https://bruno-simon.com/ui/actions/actions-icon-open.webp` | In-world "open" icon |
| `images/fr__2b135113.webp` | WebP | 54 × 36 | 0.2 KB | `https://bruno-simon.com/ui/flags/fr.webp` | French flag chip (default selected) |
| `images/gamepad-circle__962e1270.webp` | WebP | 30 × 30 | 0.3 KB | `https://bruno-simon.com/ui/controls/gamepad-circle.webp` | PS "circle" glyph |
| `images/gamepad-cross__3168090a.webp` | WebP | 28 × 26 | 0.3 KB | `https://bruno-simon.com/ui/controls/gamepad-cross.webp` | PS "cross" glyph |
| `images/gamepad-square__02404f15.webp` | WebP | 30 × 30 | 0.3 KB | `https://bruno-simon.com/ui/controls/gamepad-square.webp` | PS "square" glyph |
| `images/gamepad-triangle__c1e48cf4.webp` | WebP | 32 × 30 | 0.3 KB | `https://bruno-simon.com/ui/controls/gamepad-triangle.webp` | PS "triangle" glyph |

### SVGs & icons

- **Inline SVGs observed in HTML:**
  - `<svg class="icon icon-restart">` (20 × 24, white fill, used in
    Circuit "Restart" button).
  - `<svg class="icon icon-flag">` (23 × 20, white fill, used in
    Circuit "End" button and the flag-button placeholder when no flag
    is selected).
  - `<svg class="icon icon-controller">` (34 × 22, white fill, used
    in Circuit "Controls" button).
  - `<svg>` inside `.submit.has-icon` (39 × 38, rose `#FFCECA`
    strokes, used as the whisper-form "submit" icon — a
    paper-airplane-ish glyph).
- **Standalone SVG files in dump:** all 20 icons below are
  `fill="none" stroke="white"` (or `fill="white"`) monochrome
  hand-drawn vectors. None are larger than 9.7 KB. See
  `tools/tmp/bruno-simon/svgs/` for the exact files:

  | File | viewBox | Used in |
  | --- | --- | --- |
  | `svgs/audioOff__7df6ea04.svg` | 29 × 27 | Options "Audio" toggle (off state) |
  | `svgs/audioOn__362343d0.svg` | 29 × 27 | Options "Audio" toggle (on state) |
  | `svgs/check__fc2c58e4.svg` | 17 × 13 | Achievements row (unlocked) |
  | `svgs/close__780ced00.svg` | 24 × 24 | Modal close button (X) |
  | `svgs/close-mini__d8fe9db6.svg` | 16 × 16 | Flag-select close |
  | `svgs/discord__537c77f4.svg` | 42 × 42 | Discord modal title |
  | `svgs/favicon__a139ee4b.svg` | 512 × 512 | Favicon (large, contains an embedded PNG via `<image>`) |
  | `svgs/gamepad__504512a0.svg` | 34 × 22 | Controls tab "Gamepad" |
  | `svgs/gear__1a5119b4.svg` | 22 × 24 | Menu nav "Options" |
  | `svgs/home__3027a3a5.svg` | 23 × 21 | Menu nav "Home" |
  | `svgs/lock__e29632d2.svg` | 16 × 22 | Achievements lock overlay |
  | `svgs/map__44802469.svg` | 26 × 26 | Map trigger button |
  | `svgs/medal__4e8f912c.svg` | 20 × 24 | Menu nav "Achievements" |
  | `svgs/mouse-keyboard__ffd874fb.svg` | 36 × 22 | Controls tab "Mouse Keyboard" |
  | `svgs/music-note__fa243dce.svg` | 16 × 18 | In-world jukebox hint |
  | `svgs/question__98d8d402.svg` | 15 × 23 | Menu nav "Behind the scene" |
  | `svgs/remove__977cf757.svg` | 15 × 17 | Flag-select remove |
  | `svgs/touch__61d23a17.svg` | 16 × 26 | Controls tab "Mobile Tablet" |
  | `svgs/warning__4f081181.svg` | 28 × 22 | Offline / "Server currently offline" |
  | `svgs/wheel__4a3302f4.svg` | 31 × 24 | Menu nav "Circuit" |
  | `svgs/whisper-fill__b864106c.svg` | 28 × 28 | Menu nav "Whispers" |

- **Icon system:** bespoke — each file is a hand-authored SVG with
  the project's white-stroke-on-transparent look. There is no sprite
  sheet; each icon is loaded as a standalone `<img>` with
  `loading="lazy"`.

### Other (KTX2 textures & manifest)

| Local path | Type | Notes |
| --- | --- | --- |
| `other/palette__cf56d289.ktx` | KTX2 (1 × 8) | Preloaded — the palette LUT used by the WebGPU/TSL materials |
| `other/sound__e16c4f2e.ktx` | KTX2 (1 × 1) | Preloaded — the intro "sound" sprite-sheet texture |
| `other/stars__f7da153a.ktx` | KTX2 (1 × 1) | Preloaded — the behind-the-scene starfield |
| `other/site__4e0dab4c.webmanifest` | JSON web manifest | `name: "Bruno's"`, `short_name`, `start_url`, `display: "standalone"`, theme colour `#FFFFFF` |

### Audio & video

| Local path | Type | Notes |
| --- | --- | --- |
| — (none in dump) | — | The site has audio (engine, ambient music, jukebox) but the audio files themselves are loaded at runtime and were not captured in this static pass. The "Behind the scene" copy in the menu links to `https://github.com/brunosimon/folio-2025/tree/main/static/sounds/musics` for the music files (CC0). |

---

## Motion & Interaction

### Principles

- No motion is decorative without a reason. Every observed transition
  is either a micro-interaction on a button hover/active, a
  notification toast, a panel reveal, or a state change on the
  `<html>` root class.
- The signature easing is the springy, overshooting
  `cubic-bezier(.4, 1.6, .65, 1)` and its faster sibling
  `cubic-bezier(.49, 2.2, .53, .75)`. The mirror "exit" easing is
  `cubic-bezier(.42, 0, .47, -.55)` (pulls in, then collapses).
- Default durations: 100 ms (instant), 150 ms (button hover), 300 ms
  (panel / modal open), 450 ms (notification leave), 600 ms
  (notification enter).

### Specific behaviors

- **Menu trigger hover:** `.button-inner` translates `-4px` outward
  on `transition: transform .15s .15s`, the white inner frame fades
  `0.35 → 0.8` alpha on `transition: opacity .15s`. No scale change.
- **Map trigger open:** when the map modal opens the
  `.map-trigger .button-inner` and `.menu-trigger .button-inner` both
  translate `100%` to the right (off-screen) on
  `transition-delay: 0`, so the trigger effectively disappears.
- **Preview / content swap:** the new `.preview` is brought to
  `opacity:1` while the previous one is held at `opacity:0` with a
  300 ms delay; the `.content` slides vertically with the
  `.49, 2.2, .53, .75` overshoot.
- **Notification toast:** enters from above the viewport with an
  overshoot (`cubic-bezier(.4, 1.6, .65, 1)`, 600 ms), leaves with a
  shrink-and-lift (`cubic-bezier(.42, 0, .47, -.55)`, 450 ms).
- **Map player bounce:** the world-map cursor runs the
  `map-player-animation` keyframe (scale 1 → 1.2 → 1 → 1.2 → 1) for
  1 s with a 0.5 s delay whenever the player's rounded position
  changes (`is-bouncing` class).
- **Touch buttons:** appear on `html.is-mode-touch` with
  `display:block` and a bottom-fade overlay; pointer-events are off
  on the wrapper and re-enabled per-button.

### Reduced motion

- Not observed in the static dump. The CSS does not declare a
  `@media (prefers-reduced-motion: reduce)` block, so the site does
  not appear to honour reduced-motion at the CSS layer. (In-game
  motion in the WebGL scene is presumably also unaffected.)

---

## Content & Voice

- **Tone:** confident, self-deprecating in a playful way
  ("please drive around to learn more about me and discover the many
  secrets of this world. And don't break anything!"). Technically
  literate — the "Behind the scene" section explicitly names Three.js,
  TSL, Three.js Journey, Rapier and Howler.js.
- **Sentence length:** short. The menu panels are 1–4 sentence blurbs
  with the occasional bulleted list.
- **Capitalization:** Sentence case throughout, including the menu
  navigation labels ("Home", "Options", "Controls", "Achievements",
  "Circuit", "Whispers", "Behind the scene") and the in-canvas UI
  ("Welcome!", "Your message here", "Server currently offline").
- **Punctuation:** no Oxford comma; em-dash used in
  "physics-driven — by Kounine"; brackets used for placeholders
  ("max 30 characters").
- **CTA vocabulary:** *Submit*, *Restart*, *End*, *Respawn*, *Reset
  achievements*, *Join server*, *Start chating*, *Respawn*, *Reset*,
  *Submit* (name-tag).
- **Brand voice:** wry and slightly mischievous. The "Whispers"
  feature is described as "messages left by visitors" with rules like
  "No slur!" and "Max 30 characters".

---

## Information Architecture

This is a single-page WebGL application — the "routes" are menu
states, not URLs. The `<html>` element toggles between five
`input-filter-*` classes that the rest of the UI subscribes to.

- `/` (root, no query string) — The driving experience itself. The
  car idles on a wooden platform, then the visitor can drive away.
  Reaching the page with no `input-filter-*` class set (or with
  `input-filter-intro`) means the camera is on the platform; once
  the car starts moving it switches to `input-filter-wandering`.
- Menu (overlay) — `input-filter-menu`. Seven sections reachable
  from the radial navigation rail:
  - **Home** — Welcome message + 4-paragraph intro.
  - **Options** — Audio toggle, Quality toggle, Respawn, Reset,
    Renderer (WebGPU), Server (Pending — server offline).
  - **Controls** — Tabs for Mouse/Keyboard, Mobile/Tablet, Gamepad,
    each with a key-binding table.
  - **Achievements** — Global progress (e.g. "2h 30min 15s"),
    six reward tiles (red, orange, white, black, flames, abyssal),
    a dynamically rendered `.js-items` list of achievements, and a
    "Reset achievements" button.
  - **Circuit** — Time-trial leaderboard with a Restart / End /
    Controls row. Shows "Server currently offline" when applicable.
  - **Whispers** — Form to post a 30-character visitor message
    (with flag picker); the live feed of recent whispers appears
    in-world.
  - **Behind the scene** — Credit list: Three.js, Three.js Journey,
    devlogs, source code, musics, library list (Rapier, Howler.js,
    Amatic SC, Nunito), signed "— Bruno".
- Discord modal — Public server link + "Start chating" direct
  message link.
- Map modal — Full-viewport top-down map of the world with the
  player's position marker.

There are no deep links or client-side routes — the menu and the
modals are toggled imperatively by the `Menu`, `Modals` and `Map`
classes. The single page load is everything.

---

## Accessibility

- **Color contrast:** body text (`#FFFFFF` on `#251F2B`) is ~14:1,
  well above WCAG AAA. Placeholder / muted text on inputs
  (`rgba(255, 255, 255, 0.8)` on `#555` borders with a transparent
  panel) is harder to read but not a primary reading surface.
- **Focus indicators:** the project explicitly defers focus styling
  to the browser (`button, input { background: none; color: inherit;
  border: none; padding: 0; font: inherit; outline: inherit; }`), so
  the native focus ring is preserved on every interactive element.
- **Keyboard:** all interactive elements (menu trigger, map trigger,
  navigation items, tab buttons, buttons, inputs, modals) are real
  `<button>` / `<a>` / `<input>` elements and are reachable with Tab.
  The site also has a full in-game keybinding system (WASD or
  arrows, Shift to boost, Ctrl/B to brake, Space to jump, Enter to
  interact, M for map, L to mute, T to post a whisper, R to respawn,
  number keys for hydraulics, H to honk, plus the gamepad mapping).
- **Screen reader landmarks:** the document has `<html lang="en">`,
  no explicit `<header>`, `<main>` or `<nav>` wrappers are
  declared in the static HTML — the document body is just one
  `<div class="game">` containing the canvas and the various
  overlay divs. Landmarks are therefore weak.
- **Motion:** no `prefers-reduced-motion` handling is declared in
  the CSS bundle (see Motion & Interaction → Reduced motion).
- **Alt text:** the dynamic images (`<img class="background">`
  previews, the `<img class="flag">`, the lock and warning icons)
  are loaded with `loading="lazy"`, but the static HTML does not
  set `alt` attributes on any of them except
  `<img src="ui/warning.svg" alt="" class="icon">` (explicitly
  empty). The audio toggle has an `.audio-on` / `.audio-off` pair
  with no alt. This is an obvious gap.

---

## Sources

Every URL observed in the dump and used to write this spec:

- Homepage — https://bruno-simon.com/
- Static HTML — https://bruno-simon.com/ (rendered DOM captured in
  `tools/tmp/bruno-simon/html/asset_4__e50c794b`)
- Main JS bundle — https://bruno-simon.com/assets/index-ORr3L4no.js
- Rapier chunk — https://bruno-simon.com/assets/rapier-BmPn8Tpt.js
- CSS bundle — https://bruno-simon.com/assets/index-Di03QkGT.css
- Self-hosted fonts —
  https://bruno-simon.com/fonts/Pally-{Regular,Medium,Bold}.{woff2,woff,ttf}
- Google Fonts — https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Nunito:wght@400;700;900&display=block
- Favicons / icons —
  https://bruno-simon.com/favicons/{favicon-96x96.png, favicon.ico, favicon.svg, apple-touch-icon.png, site.webmanifest}
- Preloaded 3D / texture assets —
  https://bruno-simon.com/respawns/respawnsReferences-compressed.glb
  · https://bruno-simon.com/behindTheScene/stars.ktx
  · https://bruno-simon.com/intro/sound.ktx
  · https://bruno-simon.com/palette.ktx
- OG share image —
  https://bruno-simon.com/social/share-image.png?cb=a
- Pre-cached runtime texture URLs (declared in the JS
  `ResourcesLoader.load()` call) — `terrain/terrain.ktx`,
  `floor/slabs.ktx`, `foliage/foliageSDF.ktx`,
  `whispers/whisperFlame.ktx`, `areas/satanStar.ktx`,
  `overlay/overlayPattern.ktx`,
  `interactivePoints/interactivePointsKeyIcon{Cross,Enter,A}.ktx`,
  `jukebox/jukeboxMusicNotes.ktx`, `achievements/glyphs.ktx`,
  `career/career{Freelancer,Hetic,ImmersiveGarden,IRLTeacher,OnlineTeacher,Uzik}.ktx`,
  `timeMachine/timeMachineScreen{MGS,Folio}.ktx`.
- Pre-cached runtime model URLs (declared in the JS resource list) —
  `vehicle/default-compressed.glb`,
  `playground/playgroundVisual-compressed.glb`,
  `playground/playgroundPhysical-compressed.glb`,
  `terrain/terrain-compressed.glb`,
  `scenery/scenery-compressed.glb`,
  `areas/areas-compressed.glb`,
  `bushes/bushesReferences-compressed.glb`,
  `birchTrees/birchTrees{Visual,References}-compressed.glb`,
  `oakTrees/oakTrees{Visual,References}-compressed.glb`,
  `cherryTrees/cherryTrees{Visual,References}-compressed.glb`,
  `flowers/flowersReferences-compressed.glb`,
  `bricks/bricks-compressed.glb`,
  `fences/fences-compressed.glb`,
  `benches/benches-compressed.glb`,
  `explosiveCrates/explosiveCrates-compressed.glb`,
  `lanterns/lanterns-compressed.glb`,
  `poleLights/poleLights-compressed.glb`,
  `tornado/tornadoPathReferences-compressed.glb`.
- Credit links named in the "Behind the scene" panel —
  https://threejs.org · https://x.com/mrdoob ·
  https://github.com/mrdoob ·
  https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
  · https://threejs-journey.com ·
  https://www.youtube.com/playlist?list=PL5nApUt6Z8sTZxEsEMd8x89OCKCAAfNL0
  · https://github.com/brunosimon/folio-2025 ·
  https://choosealicense.com/licenses/mit/ ·
  https://linktr.ee/Kounine ·
  https://choosealicense.com/licenses/cc0-1.0/ ·
  https://rapier.rs · https://howlerjs.com ·
  https://fonts.google.com/specimen/Amatic+SC ·
  https://fonts.google.com/specimen/Nunito?query=Nunito.

---

## Changelog

- 2026-06-19 — Initial draft by design.md sub-agent.
