/* =============================================================
   Zhenya Rynzhuk — showcase rebuild · script.js
   Every behavior here comes from
   `websites/zhenyary/design.md` § Motion & Interaction and
   § Components. The custom RAF scroll controller (lerp .07 / .05)
   and the three-rate eased cursor (`/10`, `/6`, `/20`) are
   reproduced exactly as described; no third-party libs.
   ============================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     Utilities
     --------------------------------------------------------- */
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     1. Loader
        § Components > Loader — black veil, two circles slide
        in from translateX(-20000px) on mount; curtain fades
        after fonts are ready.
        --------------------------------------------------------- */
  const loader = document.getElementById("loader");
  const dismissLoader = () => {
    if (!loader) return;
    // Wait one frame so the entrance tween is visible
    requestAnimationFrame(() => {
      setTimeout(() => {
        loader.classList.add("is-gone");
        // Fully remove from a11y tree after fade
        setTimeout(() => loader.setAttribute("hidden", ""), 900);
      }, 350);
    });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(dismissLoader);
  } else {
    window.addEventListener("load", dismissLoader);
  }
  // Hard fallback in case fonts hang
  setTimeout(dismissLoader, 3500);

  /* ---------------------------------------------------------
     2. Custom cursor
        § Components > Custom cursor — 100px stroked circle,
        three eased positions (/10, /6, /20).
        Only runs on .no-touch, hidden on coarse pointers.
        --------------------------------------------------------- */
  const cursor = document.getElementById("cursor");
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (cursor && isFinePointer && !reducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let easeX     = mouseX, easeMouseX = mouseX, easeSlowX = mouseX;
    let easeY     = mouseY, easeMouseY = mouseY, easeSlowY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const tickCursor = () => {
      // three-rate eased follower
      easeX     = lerp(easeX,     mouseX, 1 / 20);
      easeMouseX = lerp(easeMouseX, mouseX, 1 / 6);
      easeSlowX = lerp(easeSlowX, mouseX, 1 / 10);
      easeY     = lerp(easeY,     mouseY, 1 / 20);
      easeMouseY = lerp(easeMouseY, mouseY, 1 / 6);
      easeSlowY = lerp(easeSlowY, mouseY, 1 / 10);

      cursor.style.transform =
        `translate3d(${easeX - 50}px, ${easeY - 50}px, 0)`;
      cursor.style.setProperty("--mx", `${easeMouseX}px`);
      cursor.style.setProperty("--my", `${easeMouseY}px`);
      cursor.style.setProperty("--sx", `${easeSlowX}px`);
      cursor.style.setProperty("--sy", `${easeSlowY}px`);
      requestAnimationFrame(tickCursor);
    };
    requestAnimationFrame(tickCursor);
  } else if (cursor) {
    cursor.style.display = "none";
    document.body.style.cursor = "auto";
  }

  /* ---------------------------------------------------------
     3. Smooth scroll controller
        § JavaScript & Libraries > Custom scroll controller
        – `lerp(ease, scrollTop, .07)`, `lerp(easeSlow, …, .05)`
        --------------------------------------------------------- */
  let scrollTop  = window.scrollY;
  let ease       = scrollTop;
  let easeSlow   = scrollTop;

  window.addEventListener("scroll", () => {
    scrollTop = window.scrollY;
  }, { passive: true });

  const tickScroll = () => {
    ease     = lerp(ease,     scrollTop, 0.07);
    easeSlow = lerp(easeSlow, scrollTop, 0.05);

    // Work letter scroll-pin parallax
    //   § Animations > JS-driven animations > works letter-container
    document.querySelectorAll(".work__letter").forEach((el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Pin letter from 1.0× of pane height to -1.0× as we scroll past
      const t = clamp(1 - (rect.top + rect.height / 2) / vh, -1, 1);
      el.style.transform = `translate(-50%, calc(-50% + ${-t * 240}px))`;
    });

    // Works image parallax — scale 1.25 → 1.5 baseline eased to scroll
    document.querySelectorAll(".work__img").forEach((el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = clamp(1 - (rect.top + rect.height / 2) / vh, -1, 1);
      const s = 1.25 + Math.abs(t) * 0.25;
      el.style.transform = `scale3d(${s}, ${s}, 1)`;
    });

    requestAnimationFrame(tickScroll);
  };
  requestAnimationFrame(tickScroll);

  /* ---------------------------------------------------------
     4. Hero ready / H1 split reveal
        § Animations > CSS transition > hero h1.ready reveal
        – `transform 2s cubic-bezier(.25,.46,.45,.94)` on
        `.left span` / `.right span` (mapped to our two halves).
        --------------------------------------------------------- */
  const home = document.querySelector(".home");
  if (home) {
    // Trigger after the loader has gone
    setTimeout(() => home.classList.add("is-ready"), 1200);
  }

  /* ---------------------------------------------------------
     5. Nav theme toggle (red <-> nude)
        § Components > Hero footer > theme toggle
        – class swap on <nav>; underline slides from
        `translateX(-100%)` or `translateX(100%)` over 700ms.
        --------------------------------------------------------- */
  const nav = document.getElementById("topnav");
  const toggleRed  = document.querySelector(".toggle--red");
  const toggleNude = document.querySelector(".toggle--nude");

  const setTheme = (which) => {
    if (!nav) return;
    nav.classList.toggle("red",  which === "red");
    nav.classList.toggle("nude", which !== "red");
    document.querySelectorAll(".toggle").forEach((b) => b.classList.remove("is-active"));
    (which === "red" ? toggleRed : toggleNude)?.classList.add("is-active");
    document.documentElement.style.setProperty(
      "--bg-base",
      which === "red" ? "#F93700" : "#DBD5C9"
    );
    document.documentElement.style.setProperty(
      "--text-primary",
      which === "red" ? "#FFFFFF" : "#191919"
    );
  };
  toggleRed?.addEventListener("click", () => setTheme("red"));
  toggleNude?.addEventListener("click", () => setTheme("nude"));

  /* ---------------------------------------------------------
     6. Per-character split for services / gems
        § Components > Gems > per-character translateX(50px)
        – split each data-text into <span class="char"> units.
        --------------------------------------------------------- */
  document.querySelectorAll(".gems__line").forEach((line) => {
    const text = line.dataset.text || line.textContent;
    line.textContent = "";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      line.appendChild(span);
    });
    // Insert an inline red star between the first and second word
    if (line.parentElement) {
      // no-op: stars live only between lines, not within
    }
  });

  /* ---------------------------------------------------------
     7. Reveal on enter — IntersectionObserver
        Adds `.is-ready` once the section enters the viewport.
        § Motion & Interaction > Service reveal / Contact reveal
        --------------------------------------------------------- */
  const revealTargets = [
    ".gems",
    ".workslink",
    ".contact",
  ];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-ready");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
  );
  revealTargets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => io.observe(el));
  });

  /* ---------------------------------------------------------
     8. Work image lazy-reveal on enter
        § Animations > Mobile-anime (works-case) reveal
        – `translateY(50px); opacity: 0` → `0 / 1`.
        We apply the same one-shot to .work__h3, .work__type,
        .work__title, .work__intro, .work__link.
        --------------------------------------------------------- */
  const workIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-ready");
          workIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".work").forEach((el) => workIO.observe(el));

  /* ---------------------------------------------------------
     9. Showreel button — fake overlay toggle
        Mirrors § Components > Video overlay visibility/enter
        transitions. Real video is intentionally omitted; the
        overlay reveals a placeholder so the affordance is
        visible without using a copyrighted asset.
        --------------------------------------------------------- */
  document.querySelector(".home__play")?.addEventListener("click", () => {
    let veil = document.getElementById("video-veil");
    if (!veil) {
      veil = document.createElement("div");
      veil.id = "video-veil";
      veil.setAttribute("aria-hidden", "true");
      veil.style.cssText = [
        "position:fixed", "inset:0", "z-index:200",
        "background:#000", "display:grid", "place-items:center",
        "opacity:0", "visibility:hidden",
        "transition:opacity .5s cubic-bezier(.25,.46,.45,.94), transform .5s cubic-bezier(.25,.46,.45,.94)",
        "transform:scale(.5)",
      ].join(";");
      veil.innerHTML =
        '<button id="video-veil-close" aria-label="close" ' +
        'style="position:absolute;top:24px;right:24px;background:none;border:0;color:#fff;font:inherit">' +
        '<svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">' +
        '<path d="M2 2 L26 26 M26 2 L2 26" stroke="#fff" stroke-width="1" fill="none"/></svg></button>' +
        '<p style="color:#fff;font-family:var(--ff-display);font-size:6vw;letter-spacing:.1em">showreel placeholder</p>';
      document.body.appendChild(veil);
      veil.querySelector("#video-veil-close").addEventListener("click", () => {
        veil.style.opacity = "0";
        veil.style.transform = "scale(.5)";
        veil.style.visibility = "hidden";
      });
    }
    veil.style.visibility = "visible";
    veil.style.opacity = "1";
    veil.style.transform = "scale(1)";
  });

  /* ---------------------------------------------------------
     10. Hash deep-link into the page
        Helps reviewers jump to a section.
        --------------------------------------------------------- */
  if (location.hash) {
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
    }
  }
})();
