# North Kingdom — design.md

> A structured design specification of **https://www.northkingdom.com**, written so a human or agent can reconstruct its look-and-feel without seeing the original site.
>
> **Status:** Draft · **Last updated:** 2026-06-19 · **Author:** design.md_gen
> **Source dump:** `tools/tmp/northkingdom/` (gitignored)

---

## Overview

North Kingdom is a Swedish creative agency that has positioned itself around the gaming industry. The site is a single-page-portfolio aesthetic: a full-viewport WebGL hero with a looping shield showreel, a tight grid of recent case studies, a 20-year showreel video block, a two-column description, a horizontally-scrolling infinite logo marquee, a second description block, and a sticky footer. The visual language is dark and confident — near-black background `#050311` with white type, a custom condensed display face for hero/section titles, and a single sans-serif for everything else. Motion is heavy: Three.js WebGL hero, Lenis smooth scroll, Splitting.js character/word reveal, image-marquee animation, and Plyr video.

**Category:** Marketing / Portfolio
**Primary surface observed:** Homepage (`/`) with sub-pages `/work`, `/about`, `/careers`, `/contact`
**Tone:** Confident, technical, gaming-industry native, restrained typography
**Framework detected:** Next.js (Pages Router) + React 18, CSS Modules (`.module.css`-style hashed class names), no Tailwind

---

## Visual Language

### Color

North Kingdom uses a near-black/white two-tone system with very few accents. The dump defines a complete token set in `css/99da1399fd117c59__a3980ef7.css:1`. The site supports light and dark themes via `data-theme` on `<html>`.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background (base, dark) | `--color-black` | `#050311` | The brand "black" — actually a very deep blue/violet |
| Background (light) | `--color-white` | `#FFFFFF` | Used on light theme |
| Text (primary) | `--color-white` | `#FFFFFF` | On dark background |
| Text (secondary) | `--color-white-80` | `hsla(0, 0%, 100%, 0.8)` | 80% white |
| Text (muted) | `--color-white-60` | `hsla(0, 0%, 100%, 0.6)` | 60% white — used for case project titles, footer text |
| Text (subtle) | `--color-white-50` | `hsla(0, 0%, 100%, 0.5)` | 50% white |
| Text (faintest) | `--color-white-30` | `hsla(0, 0%, 100%, 0.3)` | 30% white |
| Black 80 | `--color-black-80` | `rgba(5, 3, 17, 0.8)` | 80% brand black |
| Black 60 | `--color-black-60` | `rgba(5, 3, 17, 0.6)` | 60% brand black |
| Black 50 | `--color-black-50` | `rgba(5, 3, 17, 0.5)` | 50% brand black |
| Black 40 | `--color-black-40` | `rgba(5, 3, 17, 0.4)` | 40% brand black |
| Black 25 | `--color-black-25` | `rgba(5, 3, 17, 0.25)` | 25% brand black |
| Dark gray 70 | `--color-dark-gray-70` | `rgba(44, 43, 52, 0.7)` | |
| Gray 60 | `--color-gray-60` | `hsla(247, 7%, 55%, 0.6)` | Cool gray with violet hue |
| Gray 40 | `--color-gray-40` | `hsla(247, 7%, 55%, 0.4)` | |
| Gray 20 | `--color-gray-20` | `hsla(247, 7%, 55%, 0.2)` | |
| Foreground (active) | `--color-fg` | `var(--color-white)` (dark) / `var(--color-black)` (light) | |
| Background (active) | `--color-bg` | `var(--color-black)` (dark) / `var(--color-white)` (light) | |
| Accent (video controls) | `--plyr-color-main` | `transparent` | Plyr override — no accent on the video player |
| Control hover | `--plyr-video-control-color-hover` | `#ffffff60` | 60% white on hover |

The brand does **not** use a single accent color. The only color outside black/white/gray is a near-invisible one: the Plyr video player uses `#00B2FF` as a default fill which the site overrides to transparent (see `css/979581a34f405309__679596c7.css:1`). The overall palette is intentionally monochrome to let the video and WebGL content carry the color.

### Typography

North Kingdom ships three self-hosted font families, all with `font-display: swap`. Font-face declarations live in `css/092e3be343fee967__23e9b07f.css:1` and `css/ff603c3baa80b4fa__4d9dde0f.css:1`.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (H1, hero) | `FKDisplay, sans-serif` | 400 | `clamp(44px, calc(44px + 136 * ((100vw - 850px) / 1130)), 180px)` | `0.95em` | `-0.02em` (mobile) / `-0.05em` (≥90em) |
| Section heading | `FKDisplay, sans-serif` | 400 | same clamp as H1 | `0.95em` | `-0.02em` / `-0.05em` |
| H2 / H3 / H4 / H5 | `FKGroteskNeue-Regular, sans-serif` | 400 | `clamp(16px, calc(16px + 16 * ((100vw - 850px) / 1130)), 32px)` | `1.15em` | `-0.01em` (≥90em) |
| Body / paragraph | `FKGroteskNeue-Regular, sans-serif` | 400 | same clamp as H2 | `1.15em` | `-0.01em` (≥90em) |
| Caption / mono | `FKGroteskMono` | 400 / 600 | `clamp(12px, calc(12px + 5 * ((100vw - 850px) / 1130)), 17px)` | `1.15em` | `0.05em` (uppercase) |
| Bold (FKGroteskNeue-Bold) | `FKGroteskNeue-Bold, sans-serif` | 700 | inherits | inherits | inherits |
| Mobile hero title | `FKGroteskNeue-Regular, sans-serif` | 400 | `20vw` (i.e. `clamp` via viewport) | normal | `-3.457px` (computed) |
| Tooltip | `FKGroteskNeue-Regular, sans-serif` | 400 | `13px` | `16.9px` | normal |

Notes from observation:
- The display face `FKDisplay` is a single-weight condensed face (`FKDisplaynarrowdotv1-RegularAlt`) used only for the hero H1 and section display headings.
- All sizes use a fluid `clamp` that interpolates between 850px and 1980px viewports, landing at a minimum and maximum.
- The site ships 4 weights of `FKGroteskNeue` (Regular, Bold) and 2 of `FKGroteskMono` (Regular, Medium=600).
- Letter-spacing is consistently tight/negative — all values are negative, ranging from `-0.01em` to `-0.05em`.

### Spacing & radius

- **Base unit:** 4px (inferred from 4/8/12/16/20/24/40/48/80/160px usage)
- **Scale observed:** 2, 4, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 62, 80, 84, 96, 160 px
- **Page gutter:** `20px` (mobile) on `Layout_content__nbzEe` and `ContentWrapper`
- **Standard padding:** `0 20px` for case list, `0 20px 160px` for statement text block, `80px 20px` for light-theme text block, `52px 20px 24px` for footer
- **Radii:**
  - Card thumbnail: `8px` (`.CaseListItem_caseListItem__thumbnailBox__fBS2k`)
  - Plyr controls container: `0 0 8px 8px` (bottom-only)
  - Plyr range input: `26px`
  - Plyr progress: `100px` (fully rounded)
  - Tooltip: `5px`
  - Image marquee items: no explicit radius
  - Buttons (close/play): `50%` (full round)
  - Menu close button: `50%` (48px → 40px mobile)
- **Shadows:** Minimal use. Only the Plyr tooltip uses `box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 2px 0px`.

### Iconography

- **Style:** Mostly inline custom SVGs. The shield logo and the menu-arrow glyph are unique to North Kingdom.
- **Shield logo:** 66×86 viewBox, two paths — a white shield with a "1" mark cut out, drawn in a pixel/dot style. Lives in `HeaderLogo` component and as `shield-mask-sharp__dc650b6e.png` / `shield-feather-mask-01__a720bd87.png` raster masks used by the WebGL hero. The logo also appears as `shield.ico` favicon.
- **Menu arrow:** 28×49 viewBox, a stair-step "+" shape used in the mobile/fullscreen menu to indicate a link. Rotated 180° on active items.
- **Plyr icons:** Sprite SVG with `plyr-play`, `plyr-pause`, `plyr-muted`, `plyr-volume`, `plyr-airplay`, `plyr-captions-off`, etc. Loaded as a single inline `<svg>` inside `#sprite-plyr`.
- **Custom fullscreen toggle:** `VideoPlayer_customIcon__1Ffcp` references `fullscreen-icon-definition.svg` (found in `svgs/fullscreen-icon-definition__fa9b210e.svg`).
- **Default sizes:** Logo 66×86px in header, 28×49px in menu, 24×24px for play button SVG, 18×18px for Plyr control SVGs.

---

## Layout & Grid

- **Max content width:** The site uses a fluid single-column layout with `20px` gutters. There is no explicit max-width — content stretches to the viewport.
- **Page gutter:** `20px` on the outer `Layout_content__nbzEe` wrapper. The case grid uses a `2-column` grid with `20px` gap.
- **Grid:** The homepage case list is a `display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 20px` (`css/895d1cc0342c84f8__83a98480.css:1`). The work archive uses a 12-column grid with custom `--grid-columns` variable.
- **Breakpoints (from `css/99da1399fd117c59__a3980ef7.css:1`):**
  - `850px` — start of fluid type scaling (`@media (min-width: 850px)`)
  - `48em` (~768px) — tablet/mobile breakpoint for layout shifts
  - `47.99em` (max-width) — mobile
  - `90em` (~1440px) — wider letter-spacing kick-in
  - `1980px` — type size cap (display = 180px, body = 32px)
  - `480px` — Plyr caption sizing
- **Vertical rhythm:** Approx 8px baseline; section padding is in multiples of 8 (48, 80, 96, 160px).
- **Sticky footer:** The footer uses `position: sticky; bottom: 0` and stays pinned at the bottom of the viewport while content scrolls behind it.

**Homepage layout (top to bottom):**
1. **Header** — transparent over hero, `position: fixed`-style, logo left + nav right, `padding: 24px`. Shrinks/hides on scroll down.
2. **HomeHero** — `100vh` WebGL canvas (or video poster on mobile), centered H1, mobile-only title at bottom (`font-size: 20vw`). Includes a "play showreel" button that opens a modal video player.
3. **FeaturedCases** — `display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px`, 8 case cards, each with a `16:9` aspect-ratio thumbnail box, blurred glow background, client name (H3, white), project title (H4, white-60).
4. **FeaturedVideo** — full-width 16:9 Plyr video block (the 20-year showreel), with a text overlay at the bottom showing the title.
5. **TextBlock #1** — `padding: 0 20px 160px`, left-aligned single column with the statement copy.
6. **ImageMarquee** — `140px` row height, sticky-positioned, white background, 2 rows of horizontally-scrolling client logos + related case thumbnails. Margins `-40px 0` so it bleeds into adjacent sections. `animation-duration: 30s` (linear, infinite).
7. **TextBlock #2** — `padding: 80px 20px`, **light theme** (white bg, black text), two-column layout.
8. **Footer** — sticky, `padding: 52px 20px 24px`, dark by default, with a giant SVG wordmark, "A member of the NoA family" line, and "↑ Back to north" scroll-to-top CTA.

---

## Components

### Button (Play / Close)
- **PlayButton** (`css/58a84c871f333cc7__102466da.css:1`): `88px` circle on desktop, `56px` on mobile, white background, black play SVG (24×24), centered absolutely over hero. Hover `transform: scale(1.1)`, active `scale(0.93)`, transition `var(--transition-duration-medium) var(--ease-standard)`.
- **CloseButton**: Same `48px` → `40px` (mobile) circle, same hover/active behavior.
- **ScrollTopCta** in footer: text-only button, `color: var(--color-white-60)`, `background: none`, `border: none`, `cursor: pointer`, with a small inline arrow icon that rotates `--angle` deg based on scroll position (`transform: rotate(var(--angle, 0))`).

### Header / Nav
- **Header** (`Header_header__JAW_Z`): `padding: 24px`, `display: flex`, transparent background, `position: fixed` over hero.
- **Logo** (`HeaderLogo_headerLogo__iJaDt`): Inline SVG shield (66×86), white fill over the dark hero. Fades to `opacity: 0` on `data-is-visible="false"`.
- **Nav** (`Nav_nav__cGimw`): `display: flex`, right-aligned. 4 items: Work, About, Careers, Contact. Each is a 24px `FKGroteskNeue-Regular` link in white, `margin-left: 24px`.
- **Nav behavior:** Toggles `data-is-touch-device`. Hides on scroll-down, reveals on scroll-up (typical hide-on-scroll header pattern).

### Modal / Menu (fullscreen overlay)
- **Menu** (`Menu_menu__vTpNl`): Full-viewport modal menu, `data-is-menu-open="false"` controls visibility.
- **Backdrop** (`Menu_menu__overlay__YLupT`): `background-color: rgba(5, 3, 17, 0.5)` (50% brand black).
- **Content** (`Menu_menu__content__SJCC9`): `background: var(--color-black)`, `padding: 40px 16px`, `display: flex`.
- **Menu items** (`MenuNavItem_menuNavItem__BR2fA`): Each item shows the stair-step arrow icon + the section name (e.g. "Work") at `FKDisplay 115px` size (same as hero H1). Arrow rotates `180deg` on active.

### HomeHero
- **Container** (`HomeHero_homeHero__RsbVk`): `position: relative; width: 100%; height: 100vh; background: var(--color-black); touch-action: auto`.
- **WebGL scene** (`HomeHero_homeHero__webglScene__z2ozT`): `position: absolute; inset: 0; pointer-events: none`. A Three.js canvas renders a custom shader-based video effect on top of the showreel.
- **Loader** (`HomeHero_homeHero__loaderContainer__73G2G`): Absolutely positioned full-size, holds a `Loader` SVG (108px max) with two-color fill controlled by `--_color-bg` / `--_color-fg`.
- **Overlay** (`HomeHero_homeHero__overlay__KIXvP`): `position: fixed; inset: 0; z-index: 9; background: var(--color-black); opacity: 1; pointer-events: none; user-select: none` — used to fade the page in.
- **LCP image** (`HomeHero_homeHero__lcp__02oDS`): A `99vw × 99vh` absolutely-positioned image (the LCP element) that sits behind the WebGL canvas. It is a massive inline SVG (`99999×99999`) — essentially a hidden raster placeholder.
- **Title** (`HomeHero_homeHero__title__6YcWl`): `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); visibility: hidden; pointer-events: none`. Set to `FKDisplay 115px` (computed), `line-height: 109px`, `letter-spacing: -5.75px`.
- **Mobile title** (`HomeHero_homeHero__mobileTitle__R64D_`): Shown only on mobile, `font-size: 20vw`, pinned to the bottom-left with `padding: 0 20px`.

### Case List / Case Card
- **List** (`CaseList_caseList__cases__PCCRH`): `display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px` (desktop) → `display: flex; flex-direction: column` (mobile).
- **Card** (`CaseListItem_caseListItem__NN_aR`): `margin-bottom: 48px`, with `class="stagger"` for scroll-triggered stagger reveal.
- **Thumbnail box** (`CaseListItem_caseListItem__thumbnailBox__fBS2k`): `border-radius: 8px; overflow: hidden; transition: transform 0.2s var(--ease-out-quad)`. On hover: `transform: scale(0.98)` (subtle shrink).
- **Thumbnail bg** (`CaseListItem_caseListItem__thumbnailBg__jTrYv`): Absolutely-positioned behind, `filter: blur(90px)`, `opacity: 0` → `0.6` on hover, transition `0.6s var(--ease-out-quad)`. Creates a glowing color halo around the card on hover.
- **Content** (`CaseListItem_caseListItem__content___fO0w`): `margin-top: 16px` below the thumbnail.
- **Client name** (`CaseListItem_caseListItem__client__Ty0iR`): H3, `FKGroteskNeue-Regular 400`, `color: var(--color-white)`, fluid `clamp(16px, ..., 32px)`.
- **Project title** (`CaseListItem_caseListItem__projectTitle__GrM8Q`): H4, same type, `color: var(--color-white-60)` (60% white).
- **Aspect ratio** (`AspectRatio_aspectRatio__y7mzx`): Inline-styled `padding-top` based on `ratio` prop — typically `56.25%` for 16:9 (`padding: 434.688px 0px 0px` computed at 773px wide).

### ImageMarquee (infinite logo scroll)
- **Container** (`ImageMarquee_imageMarquee__eYZMP`): `width: 100%; background: var(--color-white); margin: -40px 0; z-index: 2; --speed: 30s`. Bleeds `40px` above and below to overlap adjacent sections.
- **Sticky wrapper** (`ImageMarquee_imageMarquee__stickyContainer__xPtge`): `position: sticky; top: 0` — pins the marquee while the user scrolls past it.
- **Row** (`ImageMarquee_imageMarquee__row__zCWPz`): `display: flex; height: 140px; margin-top: 20px; transform: translateX(-50%); left: 50%`.
- **Marquee content** (`ImageMarquee_imageMarquee__rowMarqueeContent__3XYDV`): `flex-shrink: 0; display: flex; min-width: 100%; animation: ImageMarquee_scroll var(--speed) linear infinite`.
- **Item** (`ImageMarquee_imageMarquee__item__DGSv5`): `width: 40vw; margin: 0 16px` (desktop) → `width: 20vw; margin: 0 10px` (mobile).
- **Keyframes**: `@keyframes ImageMarquee_scroll { 0% { transform: translateX(0) } 100% { transform: translateX(-100%) } }`.
- Each item contains a client logo PNG (white-bg, 441×280) and a related case thumbnail WebP (1920×1190) that cross-fades in/out as the user hovers (opacity transition `0.3s var(--ease-in-cubic)`).

### FeaturedVideo
- **Container** (`FeaturedVideo_featuredVideo__GfxXQ`): `position: relative; background: var(--color-black); aspect-ratio: 16/9; width: 100%`. On desktop it uses `height: calc(100vh - 2*var(--page-margin) - var(--header-height))`.
- **Overlay** (`FeaturedVideo_featuredVideo__overlay__y3O0F`): Absolutely-positioned at the bottom, `flex-direction: column; align-items: flex-start; padding-bottom: 32px; transition: opacity 0.3s`. Contains the H2 title and a paragraph.
- **Text block** (`FeaturedVideo_featuredVideo__textBlock__wfY1x`): `width: 100%; padding-right: 0; margin-top: 16px` on mobile, `width: 50%; padding-right: 10%` on desktop.
- Renders a `VideoPlayer` component which is a Plyr instance with custom controls (transparent color, white controls, custom fullscreen icon).

### VideoPlayer (Plyr wrapper)
- **Container** (`VideoPlayer_videoPlayer__Xgkgd`): `width: 100%; height: 100%; position: relative; --plyr-color-main: transparent; --plyr-video-control-color: #fff; --plyr-video-control-color-hover: #ffffff60; --plyr-range-fill-background: #fff`.
- **Caption** (`VideoPlayer_caption__MMAs5`): `font-family: FKGroteskMono; text-transform: uppercase; letter-spacing: 0.05em; font-size: clamp(12px, ..., 17px); margin-top: 16px`.
- **Play button overlay** (`VideoPlayer_playBtnContainer__Gg_9I`): `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)` — hosts the `PlayButton` white circle.
- **Exit fullscreen** (`VideoPlayer_exitFullscreenBtnContainer__9B6C9`): `position: absolute; top: 18px; right: 18px`.
- Uses Mux HLS streams (`.m3u8`) for delivery. A `.vtt` color-cue file is loaded as a `<track kind="metadata">` to drive shader color changes in the WebGL hero.

### TextBlock (two-column)
- **Container** (`TextBlock_textBlock__Of7n8`): `display: flex; flex-wrap: wrap; width: 100%`. On mobile → `flex-direction: column`.
- **Heading** (`TextBlock_textBlock__heading__puoD6`): `FKDisplay` fluid clamp, `margin-bottom: 20px` (mobile) → `40px` (desktop).
- **Left** (`TextBlock_textBlock__left__WTJKM`): `width: 50%; padding-right: 10px` on desktop, `width: 100%` on mobile.
- **Right** (`TextBlock_textBlock__right__TDBlz`): `width: 50%; padding-left: 10px`, `flex-direction: column`, `opacity: 0` (revealed on scroll).
- **Link** (`TextBlock_textBlock__link__nuJNn`): `margin-top: 40px`, uses `--color-text: var(--color-black)` (or white in dark theme) and `--color-hover: var(--color-black-60)`.

### Footer
- **Container** (`Footer_footer__5bZGY`): `position: sticky; bottom: 0; left: 0; right: 0; width: 100%; transition: background-color 0.3s, color 0.3s; z-index: 0; padding: 42px 20px 56px` (mobile) → `52px 20px 24px` (desktop); `pointer-events: none`.
- **Theming**: `[data-theme="dark"]` → `--color-black/white/white-60`; `[data-theme="light"]` → `--color-white/black/black-60`.
- **SVG wordmark** (`Footer_footer__svg__KzWDq`): `width: 100%` — a giant North Kingdom wordmark.
- **Content row** (`Footer_footer__content__mF56S`): Absolutely positioned at the bottom (`position: absolute; bottom: 0`), `display: flex; justify-content: space-between; align-items: center`, `color: var(--color-white-60)` (or `--color-black-50` in light), `font-size: clamp(16px, ..., 32px)`.
- **ScrollTopCta** ("↑ Back to north"): text button with a small inline arrow that rotates based on `--angle` (driven by scroll position).
- **Statement**: "A member of the NoA family" — left side of the bottom row.

### PageHero (used on /about, /work, /case pages)
- **Container** (`PageHero_pageHero__VSoHu`): `width: 100%; height: 100%; min-height: 100%; --nav-height: 80px; margin-top: calc(var(--nav-height) * -1)` — pulls the hero up under the transparent header.
- **Title container** (`PageHero_pageHero__titleContainer__seGYD`): `height: 66vh` (desktop) → `40vh` (mobile), `display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; margin-bottom: 50px` → `32px` (mobile).
- **Image** (`PageHero_pageHeroImage__1InXH`): Custom reveal animation. `--duration: 1.2s; --delay: 0.1s; --ease: cubic-bezier(0.19, 0.39, 0, 0.99)`. `transform: translateY(101%)` → `0` on enter, with a child `.scale` wrapper going from `scale(1.1)` → `scale(1)`.

### WebglScene (the Three.js hero)
- **Container** (`WebglScene_webglCanvas__5I_rG`): A full-size WebGL canvas with a `::after` gradient: `linear-gradient(0deg, var(--color-black) 0%, transparent 100%); height: 30vh` (desktop) → `5vh` (mobile) — fades the bottom of the canvas into the page background.
- **Play button container** (`WebglScene_playButtonContainer__lqZwC`): `opacity: 0; pointer-events: none; transition: opacity 0.3s ease-in-out` → `opacity: 1` when `data-visible="true"`.
- Renders custom GLSL vertex/fragment shaders that sample the Mux HLS showreel and apply color-cue-driven effects (driven by the `.vtt` metadata track). Uses `WebGLRenderTarget` with `HalfFloatType` for the effect chain (visible in `js/538.556403cace74ebb2__641bd877.js`).

### Loader
- **Container** (`Loader_loader__OQgy0`): `max-width: 108px`, with `--_color-bg: var(--color-bg-inverted)` and `--_color-fg: var(--color-bg)`.
- Two SVG paths: `.loader__bg` (filled with `--_color-bg`) and `.loader__fg` (filled with `--_color-fg`).

### JobListItem (careers page)
- **Container** (`JobListItem_jobListItem__qAOb3`): `flex-direction: column` → wraps on mobile.
- **Top row**: title (50% width), location, apply link (right-aligned).
- **Description container**: 50% width desktop, full-width mobile.
- **Apply caption** is hidden on mobile, underlined on hover.

### InfiniteGrid (work archive drag interaction)
- **Container** (`InfiniteGrid_infiniteGrid__CiSWG`): `display: flex; width: 100vw; height: 100vh; overflow: hidden; background: var(--color-black); cursor: grab`. `data-is-grabbing="true"` → `cursor: grabbing`.
- **Drag prompt**: `position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); border-radius: 8px; background: hsla(0, 0%, 100%, 0.2); backdrop-filter: blur(40px); padding: 16px`.
- **Mobile close button**: `position: fixed; top: 16px; right: 16px; width: 42px; height: 42px; border: 1px solid hsla(247, 7%, 55%, 0.4); border-radius: 40px; background: #fff; transition: background-color 0.3s, transform 0.3s`.
- **Cursor follower** (work archive): `position: fixed; width: 200px; border-radius: 8px; overflow: hidden; background: var(--color-black-25); pointer-events: none; opacity: 0; transition: opacity 0.1s ease-out; z-index: 100` — a custom cursor that shows a case thumbnail as the user drags.

---

## JavaScript & Libraries

| Library | Version (if visible) | Detection | Notes |
| --- | --- | --- | --- |
| Next.js | Pages Router (chunks `_app-*.js`, `framework-*.js`, `webpack-*.js`, `pages/*.js`) | `_next/static/chunks/_app-289f0f26c1e5ffc4__a1af7f46.js` | React 18, SSG/ISR via `getStaticProps` |
| React | 18.x | `framework-2bb1844fb22814b3__20cc36eb.js` | |
| @react-three/fiber | detected in `js/674.e3384b841e1cfe30__d9e1ca79.js` | `@react-three` import | R3F for the WebGL hero scene |
| @react-three/drei | likely (R3F helpers) | `js/674.e3384b841e1cfe30__d9e1ca79.js` | |
| Three.js | r160+ | `THREE.*` references in `js/fb7d5399-8e69b852f2ee72d8__aea3776a.js` (222 hits) | Custom shaders, WebGLRenderTarget with HalfFloatType |
| Lenis | detected (smooth scroll) | `lenis` (11 hits in `_app-*.js`), `Lenis` (6 hits) | Site-wide smooth scroll on every page |
| Plyr | detected (video player) | `js/105-40c96ca3700337fa__73a6594f.js` (HLS.js internals), inline `plyr__*` classes in HTML | HLS-capable Plyr for Mux streams |
| Mux Player / HLS.js | detected | `stream.mux.com/*.m3u8` URLs, HLS internals in `105-*.js` | All video is Mux-hosted HLS |
| Splitting.js | detected | `.splitting`, `--char-index`, `--word-total` in `css/6ba34ffb*.css` and `css/845cb53d6*.css` | Per-character/word reveal animations |
| js-cookie | 2.1.3 | `js/105-*.js` ("JavaScript Cookie v2.1.3" banner) | Cookie consent |
| Mux (analytics) | detected | `muxId`, `mux.com` tracking in `105-*.js` | Video analytics |
| Framer Motion | not directly observed | — | May be used for case page transitions |
| Three.js postprocessing | detected | `EffectComposer`, `RenderPass`, `ShaderPass` classes in `538-*.js` | Custom 2-pass effect chain |

The site also uses native `IntersectionObserver` and `ResizeObserver` extensively for scroll-triggered reveals, and the `TextReveal` component (visible in `css/6ba34ffb007ac211__4a9ae225.css:1`) wraps Splitting.js output with `overflow: hidden` line containers.

---

## Animations (Catalog)

### CSS @keyframes

| Name | Where (file:line) | Duration | Easing | Trigger |
| --- | --- | --- | --- | --- |
| `ImageMarquee_scroll__zVrlZ` | `css/0f0d2cfdd56385ac__688027cf.css:1` | `var(--speed)` = 30s | `linear` | infinite, on mount |
| `plyr-progress` | `css/979581a34f405309__679596c7.css:1` | 1s (default) | `linear` | during video buffering |
| `plyr-popup` | `css/979581a34f405309__679596c7.css:1` | 200ms (default) | `ease-out` | tooltip show |
| `plyr-fade-in` | `css/979581a34f405309__679596c7.css:1` | 300ms | `ease` | captions show |
| `Media_load-shimmer-dark-theme__gdfjg` | `css/58a84c871f333cc7__102466da.css:1` | not extracted (shimmer) | `linear` | media loading |
| `Media_load-shimmer-light-theme__sE4Iw` | `css/58a84c871f333cc7__102466da.css:1` | not extracted (shimmer) | `linear` | media loading (light theme) |

### CSS transitions observed

| Selector | Property | Duration | Easing |
| --- | --- | --- | --- |
| `.CaseListItem_thumbnailBox` | `transform` | `200ms` | `var(--ease-out-quad)` |
| `.CaseListItem_thumbnailBg` | `opacity` | `600ms` | `var(--ease-out-quad)` |
| `.ImageMarquee_image` | `all` | `300ms` | `var(--ease-in-cubic)` |
| `.PlayButton`, `.CloseButton` | `transform` | `var(--transition-duration-medium)` = 350ms | `var(--ease-standard)` |
| `.FeaturedVideo_overlay` | `opacity` | `300ms` | default |
| `.Footer` | `background-color`, `color` | `300ms` | default |
| `.Footer_scrollToTopIcon` | `transform` | `100ms` | `linear` |
| `.WebglScene_playButtonContainer` | `opacity` | `300ms` | `ease-in-out` |
| `.WebglScene_webglCanvas::after` | none (static gradient) | — | — |
| `.InfiniteGrid_wrapper` | (all) | `400ms` | `ease` |
| `.InfiniteGrid_mobileCloseGridButton` | `background-color`, `transform` | `300ms` | `ease` |
| `.CaseArchive_cursor` | `opacity` | `100ms` | `ease-out` |
| `.PageHero_image` | `transform` | `1.2s` | `cubic-bezier(0.19, 0.39, 0, 0.99)` |
| `.Header` (logo) | `fill` | `300ms` | default (via inline style) |

### JS-driven animations

| Library | Animation / timeline | Trigger | Notes |
| --- | --- | --- | --- |
| Lenis | Smooth scroll on `window` | page load | Lerps native scroll; drives the sticky header, sticky footer, and all `position: sticky` elements |
| @react-three/fiber | WebGL hero render loop | always | 60fps render with `useFrame`, color-cue driven shader uniforms from the Mux `.vtt` track |
| Three.js postprocessing | 2-pass effect chain (write buffer → read buffer) | always | `EffectComposer` with custom `RenderPass` and stencil-buffered copy |
| Splitting.js + TextReveal | Per-word, per-char line reveal on scroll | `IntersectionObserver` | Lines have `overflow: hidden` and `display: inline-block`; characters animate in via `data-char` |
| PageHero image reveal | `translateY(101%) → 0` + `scale(1.1) → 1` | on enter viewport | Uses `cubic-bezier(0.19, 0.39, 0, 0.99)` over `1.2s` with `0.1s` delay |
| Case card hover | `scale(0.98)` + blurred background `opacity 0 → 0.6` | hover (via `@media (hover: hover)`) | Two coordinated transitions |
| ImageMarquee | `translateX(0 → -100%)` | on mount, infinite | 30s linear, duplicated content for seamless loop |
| Loader fade-out | `opacity 1 → 0` on hero ready | when WebGL/poster image loaded | Drives `data-asset-loaded` and `data-load-out-animation-complete` flags |
| Page opacity | `opacity 0 → 1; visibility: hidden → visible` on `<html>` | when all assets loaded | Set via inline script that checks `data-is-menu-open` etc. |

### Page transitions

- **No crossfade observed** between routes — Next.js Pages Router with default navigation. A short opacity fade-in on the `<html>` element hides the FOUC during initial paint.
- The loader overlay (`HomeHero_homeHero__overlay__KIXvP`) covers the page until the WebGL scene is ready, then fades to reveal content.

---

## Assets

### 3D models

N/A — no 3D model files (`.glb`, `.gltf`, `.obj`, `.fbx`, `.usdz`) observed in the dump. The WebGL hero uses a fullscreen postprocessing shader chain (fragment + vertex shaders) applied to a Mux HLS video stream, not a 3D model.

### Fonts

| Family | Weights | Format(s) | Source | Self-hosted? |
| --- | --- | --- | --- | --- |
| FKGroteskNeue | 400 (Regular), 700 (Bold) | woff2, woff, ttf, otf | `tools/tmp/northkingdom/fonts/FKGroteskNeue/` | yes |
| FKDisplay | 400 (RegularAlt) | woff, oft | `tools/tmp/northkingdom/fonts/FKDisplay/` | yes |
| FKGroteskMono | 400 (Regular), 600 (Medium) | woff2, woff | `tools/tmp/northkingdom/fonts/FKGroteskMono/` | yes |

Font-face declarations are duplicated in `css/092e3be343fee967__23e9b07f.css:1` and `css/ff603c3baa80b4fa__4d9dde0f.css:1` to ensure availability across all pages.

### Images

| Local path | Type | Dimensions | Size | Source URL | Notes |
| --- | --- | --- | --- | --- | --- |
| `tools/tmp/northkingdom/images/og-img__bf15b941.png` | PNG | 1200×630 | 17 KB | `https://www.northkingdom.com/images/og-img.png` | Open Graph / social share |
| `tools/tmp/northkingdom/images/shield__a2fe7ad6.ico` | ICO | 256×256 | 103 KB | `https://www.northkingdom.com/images/shield.ico` | Favicon |
| `tools/tmp/northkingdom/images/shield-mask-sharp__dc650b6e.png` | PNG | not extracted | 24 KB | Contentful CDN | Hero WebGL sharp mask |
| `tools/tmp/northkingdom/images/shield-feather-mask-01__a720bd87.png` | PNG | not extracted | 26 KB | Contentful CDN | Hero WebGL feather mask |
| `tools/tmp/northkingdom/playwright/images/event-poster__c67568f8.png` | PNG | not extracted | 6 KB | Contentful CDN | Event poster (placeholder) |
| `tools/tmp/northkingdom/playwright/images/event-poster__dc720ad6.png` | PNG | not extracted | 1.8 MB | Contentful CDN | Event poster (full) |
| `tools/tmp/northkingdom/playwright/images/NK_20_year_anniversary_logo__c5f4774a.png` | PNG | not extracted | 74 KB | Contentful CDN | 20-year anniversary logo, used as video poster |
| `tools/tmp/northkingdom/playwright/images/Supercell-Creators-Casehero__9aa08591.jpg` | JPG | not extracted | 35 KB | Contentful CDN | Case thumbnail |
| `tools/tmp/northkingdom/playwright/images/Supercell-Creators-Casehero__b8f4b251.jpg` | JPG | not extracted | 1.8 KB | Contentful CDN | Case thumbnail (LQIP) |
| `tools/tmp/northkingdom/playwright/images/EA_Highlighter_-_case_-_hero__d5c62a53.jpg` | JPG | not extracted | 5 KB | Contentful CDN | Case hero (LQIP) |
| `tools/tmp/northkingdom/playwright/images/EA_Highlighter_-_case_-_hero__ea75b8fa.jpg` | JPG | not extracted | 1.6 MB | Contentful CDN | Case hero (full) |
| `tools/tmp/northkingdom/playwright/images/Case_-_Video_Poster_-_Den_of_Wolves__ca3437f6.jpg` | JPG | not extracted | 3 KB | Contentful CDN | Case video poster (LQIP) |
| `tools/tmp/northkingdom/playwright/images/Case_-_Video_Poster_-_Den_of_Wolves__ed895f5d.jpg` | JPG | not extracted | 980 KB | Contentful CDN | Case video poster (full) |
| `tools/tmp/northkingdom/playwright/images/Malibu_-_Video_poster_image_-_Endless_Summer__5b191214.jpg` | JPG | not extracted | 4 KB | Contentful CDN | Case video poster (LQIP) |
| `tools/tmp/northkingdom/playwright/images/Malibu_-_Video_poster_image_-_Endless_Summer__6a937392.jpg` | JPG | not extracted | 1.3 MB | Contentful CDN | Case video poster (full) |
| `tools/tmp/northkingdom/playwright/images/NK.com_-_Case_-_Video_Poster_-_Kotex__19d2b60f.jpg` | JPG | not extracted | 639 KB | Contentful CDN | Case video poster |
| `tools/tmp/northkingdom/playwright/images/NK.com_-_Case_-_Video_Poster_-_Kotex__76606d04.jpg` | JPG | not extracted | 3 KB | Contentful CDN | Case video poster (LQIP) |
| `tools/tmp/northkingdom/playwright/images/image__1___aeda44c1.jpg` | JPG | not extracted | 259 KB | Contentful CDN | Case image |
| `tools/tmp/northkingdom/playwright/images/image__1___70a4320c.jpg` | JPG | not extracted | 5 KB | Contentful CDN | Case image (LQIP) |
| `tools/tmp/northkingdom/playwright/images/Client_logo_Image_Grid_-_Riot_Games__d219e0fb.webp` | WebP | 1920×1190 | 123 KB | Contentful CDN | Marquee item image |
| `tools/tmp/northkingdom/playwright/images/Client_logo_Image_Grid_-_Riot_Games__343da450.webp` | WebP | not extracted | 7 KB | Contentful CDN | Marquee item image (LQIP) |

The site consistently ships each visual at two sizes — a full-resolution master and a tiny LQIP (low-quality image placeholder, ~1–7 KB) — using Contentful's image API with `?q=20&fit=thumb&fm=webp&w=400` for thumbnails.

### SVGs & icons

- **Inline SVGs observed in HTML:**
  - 1 × shield logo (HeaderLogo) — 66×86 viewBox, white fill + dark "1" mark
  - 1 × menu arrow (MenuNavItem) — 28×49 viewBox, stair-step shape, rotated 180° on active
  - 1 × play button (PlayButton) — 24×24 viewBox, black play triangle
  - 1 × Plyr sprite — 18×18 viewBox, contains 15+ symbol definitions (`plyr-play`, `plyr-pause`, `plyr-muted`, `plyr-volume`, `plyr-airplay`, `plyr-captions-off`, `plyr-enter-fullscreen`, `plyr-exit-fullscreen`, etc.)
- **Standalone SVG files in dump:**
  - `tools/tmp/northkingdom/svgs/fullscreen-icon-definition__fa9b210e.svg` (734 B) — referenced by the custom fullscreen button via `<use xlink:href="/icons/fullscreen-icon-definition.svg#enter-fullscreen">`
  - `tools/tmp/northkingdom/playwright/svgs/plyr__6d18be0e.svg` (5.8 KB) — the Plyr sprite, same content as the inline sprite
- **Icon system:** Mostly custom inline SVGs. Plyr provides the video control icons via an inline sprite. The site does not use Lucide, Phosphor, or Heroicons.

### Audio & video

The site uses Mux HLS streams exclusively. All video files are `.m3u8` playlists with `.ts` segment chunks. No raw `.mp4` or `.webm` files were found.

| Local path | Type | Notes |
| --- | --- | --- |
| `tools/tmp/northkingdom/playwright/other/rendition__f124869d.m3u8` | HLS playlist | 707 B — video variant manifest |
| `tools/tmp/northkingdom/playwright/other/rendition__a5739900.m3u8` | HLS playlist | 707 B |
| `tools/tmp/northkingdom/playwright/other/rendition__0f556649.m3u8` | HLS playlist | 710 B |
| `tools/tmp/northkingdom/playwright/other/rendition__33a1869d.m3u8` | HLS playlist | 1012 B |
| `tools/tmp/northkingdom/playwright/other/rendition__1e7cfb10.m3u8` | HLS playlist | 1040 B |
| `tools/tmp/northkingdom/playwright/other/rendition__0d083fdb.m3u8` | HLS playlist | 1615 B |
| `tools/tmp/northkingdom/playwright/other/rendition__2ef6f7a3.m3u8` | HLS playlist | 704 B |
| `tools/tmp/northkingdom/playwright/other/rendition__4839a0a0.m3u8` | HLS playlist | 12.6 KB — larger variant manifest |
| `tools/tmp/northkingdom/playwright/other/rendition__651c8fb5.m3u8` | HLS playlist | 1005 B |
| `tools/tmp/northkingdom/playwright/other/rendition__4bbf05c1.m3u8` | HLS playlist | 1682 B |
| `tools/tmp/northkingdom/playwright/other/rendition__69c50328.m3u8` | HLS playlist | 8.5 KB |
| `tools/tmp/northkingdom/playwright/other/rendition__d868a581.m3u8` | HLS playlist | 701 B |
| `tools/tmp/northkingdom/playwright/other/Cz9zAkzt5x4OSWu1Sv003PfOwDhJjCk3gQpp00yhhrl6A__743a4ebf.m3u8` | HLS playlist | 1885 B — 20-year anniversary showreel (hero) |
| `tools/tmp/northkingdom/playwright/other/WVdokEiMXGE1L01blx701ejPlMqfCRBFmyk1GKz8hUV1U__adc75d5e.m3u8` | HLS playlist | 1389 B |
| `tools/tmp/northkingdom/playwright/other/ztLIZraKVZqHcBMteLrV9jkKuaea3ziQerxJqOBQtgg__29a24090.m3u8` | HLS playlist | 940 B |
| `tools/tmp/northkingdom/playwright/other/iX201LYBrrKmNLcFvqnZBWFtqCoV6ZEHsU7DpqVh2D74__76adef4d.m3u8` | HLS playlist | 1851 B |
| `tools/tmp/northkingdom/playwright/other/jRDu2Q12XjlG013hQ99lc6TVisvQO7wajhpBlRQISktU__a237bf9d.m3u8` | HLS playlist | 1850 B |
| `tools/tmp/northkingdom/playwright/other/JDREjo602HxulACyHJcSPenouxsQvmDMS02ZvMBytNzuw__91b57073.m3u8` | HLS playlist | 1909 B |
| `tools/tmp/northkingdom/playwright/other/PoM7lMV624gxWyUImQUpwWhpY21Zs5cXviVw9hy0002X00__296e61f4.m3u8` | HLS playlist | 1896 B |
| `tools/tmp/northkingdom/playwright/other/video-color-cue__f54ed0cf.vtt` | WebVTT | 2.5 KB — color-cue metadata that drives WebGL hero shader uniforms |
| `tools/tmp/northkingdom/playwright/media/*.ts` (34 files) | H.264 TS segments | 57 KB to 3.4 MB each | Mux HLS video segments |

All video is muted, autoplay, loop, and inline (`playsinline muted autoPlay loop`). The hero showreel is `131.4s` (16:9, 30fps, max HD). The case-page showreel is `135.1s`. Individual case videos are short clips (4–6s).

---

## Motion & Interaction

### Principles
- **Default easing:** `var(--ease-out-quad)` = `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for most UI transitions. The site defines a full set of Material-3-style easings in `css/99da1399fd117c59__a3980ef7.css:1`.
- **Default durations:** `100ms` (micro), `200ms` (small UI), `300ms` (medium), `350ms` (button), `500ms` (large), `1.2s` (page-level reveal).
- **Reduced motion:** Not explicitly observed in the dump — the site has no `@media (prefers-reduced-motion: reduce)` rules captured. The Lenis smooth scroll and Three.js render loop will continue regardless.

### Specific behaviors
- **Link hover:** No explicit color shift; the link `<a>` elements use `data-active` attribute styling. Nav items have no visible hover state captured in CSS.
- **Button press:** `transform: scale(0.93)` on `:active`, `scale(1.1)` on `:hover` (PlayButton, CloseButton).
- **Section reveal on scroll:** TextBlock sections start with `opacity: 0` and animate to `1` when entering the viewport. The case list has a `.stagger` modifier that staggers each card. Splitting.js splits headings into chars/words for per-character reveal inside `TextReveal` line containers with `overflow: hidden`.
- **Page transition:** A fixed-position overlay (`HomeHero_homeHero__overlay__KIXvP`) covers the page at `opacity: 1` during load, then fades to `0` once the WebGL hero reports `data-asset-loaded="true"`.
- **Header hide-on-scroll:** The header logo fades to `opacity: 0` when `data-is-visible="false"` (triggered by scroll direction).
- **Sticky footer:** `position: sticky; bottom: 0` keeps the footer pinned to the viewport bottom while content scrolls behind. The footer's scroll-to-top arrow rotates `var(--angle)` based on current scroll velocity/position.
- **Case card hover:** `transform: scale(0.98)` on the thumbnail box (subtle shrink) + a blurred copy of the thumbnail fades in behind at `opacity: 0.6` (color glow halo). Both transitions run simultaneously over 200ms and 600ms respectively.
- **ImageMarquee:** Two duplicated rows of 23 client/logo pairs scroll horizontally at `30s` per cycle, linear, infinite. The marquee is `position: sticky; top: 0` so it pins while the user scrolls past.
- **WebGL hero:** The shield showreel plays as a Mux HLS video texture, then a postprocessing shader chain applies color-cue-driven effects (the `.vtt` metadata track drives shader uniforms per-frame). A 30vh black gradient at the bottom fades the canvas into the page background.

---

## Content & Voice

- **Tone:** Confident, understated, gaming-industry native. The site does not use superlatives or marketing puffery in the body copy.
- **Sentence length:** Medium. Active voice.
- **Capitalization:** Title case for nav items, section titles, and case client names. Sentence case for body copy. The hero H1 is "North Kingdom" (proper noun, no styling flourish).
- **CTA vocabulary:** "Work", "About", "Careers", "Contact" (nav). "↑ Back to north" (footer scroll-to-top). "Play video" (aria-label on the showreel play button).
- **Key copy observed:**
  - Hero statement: "North Kingdom is the creative agency for the world of gaming. We connect players and brands through unforgettable experiences and engaging platforms."
  - Description #1: "We've worked with clients big and small, all of them leaders in their industries"
  - Description #2 (about): "With over 20 years of expertise, we blend storytelling, design, and technology to craft captivating gamified experiences. Our multidisciplinary approach ensures every interaction leaves a powerful and lasting impression."
  - About page hero: "Creativity & Innovation since 2003"
  - About page body: "From concept to execution, we design products, services, and experiences that bring ideas to life. Our work helps brands build genuine relationships with people through creativity, design, and technology."
  - Footer: "A member of the NoA family"
- **Client list (homepage cases, 8):** Norwegian Armed Forces Museum, Absolut, Electronic Arts, Supercell (×2), Kotex, Riot Games, 10 Chambers.
- **Client list (ImageMarquee, 23):** Riot Games, Supercell, Netflix, Disney, Meta, Google, EA, Embark, Mojang, Lego, Beats by Dre, On, and others.
- **Vertical taxonomy:** `technology`, `gaming`, `entertainment` (lowercase, used in case metadata).

---

## Information Architecture

| Route | Purpose | Primary component |
| --- | --- | --- |
| `/` | Marketing homepage — hero, cases, showreel, marquee, footer | `Home`, `HomeHero`, `FeaturedCases`, `FeaturedVideo`, `ImageMarquee` |
| `/work` | Full case archive with filterable, draggable infinite grid | `CaseArchive`, `InfiniteGrid` |
| `/case/[slug]` | Individual case study page with video hero and rich content | `PageHero`, case-detail blocks |
| `/about` | Studio page with hero, description, irregular video grid, statement | `PageHero`, `DescriptionComponent`, `IrregularGrid` |
| `/careers` | Job listings | `JobList`, `JobListItem` |
| `/contact` | Contact form / info | (not extracted in dump) |

All routes share the same `Header` / `Nav` / `Footer` and the Lenis smooth scroll. The about page (visited in the dump) uses `PageHero` with a 2160×900 hero image and a `66vh` title block pinned to the bottom.

---

## Accessibility

- **Color contrast:** Body text on the dark background is `#FFFFFF` on `#050311`. Computed luminance ratio is approximately 19.4:1 (well above WCAG AAA's 7:1). Muted text at `60%` white (`hsla(0, 0%, 100%, 0.6)`) computes to ~10.5:1 — still above AAA.
- **Focus indicators:** Not explicitly styled in the captured CSS — the site relies on browser default focus rings.
- **Keyboard:** The site uses standard `<a>` and `<button>` elements throughout. The fullscreen menu is keyboard-navigable. The play button has `aria-label="Play video"`.
- **Screen reader landmarks:** `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` are all present and used. The `<header>` has `data-is-visible` for state. A `<next-route-announcer>` is present for route changes.
- **Motion:** No explicit `prefers-reduced-motion` handling observed. The WebGL hero and Lenis scroll will continue to run for users who prefer reduced motion.
- **Alt text:** Images use Contentful's `altText` field. The case hero image for the about page has `altText: "About hero"`. Decorative images use `aria-hidden="true"`.
- **Video accessibility:** The Plyr player includes captions support (`plyr__captions` div) and a mute toggle. The hero video is muted by default with `muted` and `autoPlay` attributes.
- **Theme:** The site has a `data-theme` system (`dark` default, `light` available) but no toggle was observed in the captured HTML — likely a future feature or controlled via OS preference.

---

## Sources

- Homepage — https://www.northkingdom.com/
- Homepage (rendered DOM) — `tools/tmp/northkingdom/playwright/homepage.html`
- Homepage (JSON data) — `tools/tmp/northkingdom/other/index__e32fd8c8.json`
- About page (JSON data) — `tools/tmp/northkingdom/other/about__4dc7e916.json`
- Work page (JSON data) — `tools/tmp/northkingdom/other/work__fa9ce4db.json`
- Contact page (JSON data) — `tools/tmp/northkingdom/other/contact__11c98b68.json`
- Careers page (JSON data) — `tools/tmp/northkingdom/other/careers__5cc2512c.json`
- Homepage screenshot — `tools/tmp/northkingdom/playwright/homepage.png`
- Homepage fullpage screenshot — `tools/tmp/northkingdom/playwright/homepage-fullpage.png`
- Computed styles — `tools/tmp/northkingdom/playwright/computed-styles.json`
- Mux HLS hero stream — `https://stream.mux.com/Cz9zAkzt5x4OSWu1Sv003PfOwDhJjCk3gQpp00yhhrl6A.m3u8`
- Contentful image CDN — `https://images.ctfassets.net/vwfx2n1hr26h/`

---

## Changelog

- 2026-06-19 — Initial draft by design.md_gen.
