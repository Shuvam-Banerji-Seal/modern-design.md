/* ==========================================================================
   Garden Eight — design.md rebuild
   All behaviors here are derived from design.md §Animations, §JavaScript &
   Libraries, and §Motion & Interaction. No invented effects.
   ========================================================================== */

(function () {
  "use strict";

  const root = document.documentElement;
  const app = document.getElementById("__app");

  /* ------------------------------------------------------------------------
     1. --vh token (design.md §Color — overridden by JS for mobile 100vh)
     ----------------------------------------------------------------------- */
  function syncVh() {
    root.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
  }
  syncVh();
  window.addEventListener("resize", syncVh, { passive: true });
  window.addEventListener("orientationchange", syncVh, { passive: true });

  /* ------------------------------------------------------------------------
     2. Loading state flip (.is-loading-a → .is-loaded)
        design.md §CSS transition classes: reveals trigger when .is-loaded
        is set on the body. We mimic the Nuxt loading-class handoff here.
     ----------------------------------------------------------------------- */
  window.addEventListener("load", function () {
    // Tiny delay to let fonts settle, matching the studio's perceived feel.
    requestAnimationFrame(function () {
      setTimeout(function () {
        document.body.classList.remove("is-loading-a");
        document.body.classList.add("is-loaded");
      }, 240);
    });
  });

  /* ------------------------------------------------------------------------
     3. IntersectionObserver (design.md §CSS transition classes —
        .js-iv / [data-shown="0|1"] toggle on viewport entry)
        Triggers: clip-y, slidein, fadein, hr, editor.js-iv-c, .thumb
     ----------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.js-iv, .pickup-li, .slidein, .editor, .hr, .thumb'
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-shown", "1");
          // Per design.md, once shown, the element stays shown.
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just reveal everything immediately.
    revealTargets.forEach(function (el) { el.setAttribute("data-shown", "1"); });
  }

  /* ------------------------------------------------------------------------
     4. Custom cursor (design.md §Custom WebGL cursor .ui-cursor)
        — follow the mouse; flip data-cursor-type to "view" when over a
          [data-cursor-type="view"] target; hide native cursor over desktop.
     ----------------------------------------------------------------------- */
  const cursor = document.querySelector(".ui-cursor");
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  if (cursor && !isCoarse) {
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    document.body.style.cursor = "none";

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cursor.style.transform =
        "translate3d(" + tx + "px," + ty + "px,0) translate(-50%,-50%)";
    }, { passive: true });

    // Delegate hover detection: any element marked data-cursor-type="view"
    document.addEventListener("mouseover", function (e) {
      const target = e.target.closest("[data-cursor-type]");
      if (target) {
        cursor.setAttribute("data-cursor-type", target.getAttribute("data-cursor-type"));
      }
    });

    document.addEventListener("mouseout", function (e) {
      const target = e.target.closest("[data-cursor-type]");
      if (target) {
        cursor.setAttribute("data-cursor-type", "none");
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Scroll progress disk (design.md §Scroll progress disk .ui-scroll)
        — compute scroll fraction; drive the SVG ring via stroke-dashoffset.
          Toggle [data-ov-ft="1"] once footer enters viewport (arrow flips).
     ----------------------------------------------------------------------- */
  const scrollDisk = document.querySelector(".ui-scroll");
  if (scrollDisk) {
    const ring = scrollDisk.querySelector(".progress path");
    const CIRC = 2 * Math.PI * 60; // matches the 60,60 radius in d="M62,2A60,60,0,1,1,..."

    function updateProgress() {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const frac = Math.min(1, Math.max(0, window.scrollY / max));
      const offset = CIRC * (1 - frac);
      scrollDisk.style.setProperty("--circ", CIRC);
      if (ring) ring.style.strokeDashoffset = offset;
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();

    // data-ov-ft = "footer entered viewport"; arrow rotates -180deg per design.md
    if ("IntersectionObserver" in window) {
      const footerObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          scrollDisk.setAttribute(
            "data-ov-ft", entry.isIntersecting ? "1" : "0"
          );
        });
      }, { threshold: 0.1 });
      const sm = document.querySelector(".Sm");
      if (sm) footerObs.observe(sm);
    }

    // Click → smooth-scroll to top (a "back to top" affordance)
    scrollDisk.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------------
     6. Background color flip on scroll (design.md §Motion & Interaction —
        Footer background change: data-ov-hb / data-ov-fb attributes toggle
        foreground colors black ↔ white as the user scrolls past the .Pf).
     ----------------------------------------------------------------------- */
  if ("IntersectionObserver" in window) {
    const pf = document.querySelector(".Pf");
    if (pf) {
      const pfObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          // entry.isIntersecting → we're inside the black section → flip white
          root.setAttribute("data-ov-hb", entry.isIntersecting ? "1" : "0");
          root.setAttribute("data-ov-fb", entry.isIntersecting ? "0" : "1");
        });
      }, { threshold: 0.1 });
      pfObs.observe(pf);
    }
  }

  /* ------------------------------------------------------------------------
     7. Email copy-to-clipboard (design.md §Sub-mini footer — .Sm ._mail
        swaps "Copy to clipboard" ↔ "Copied" on click).
     ----------------------------------------------------------------------- */
  document.querySelectorAll(".ui-btn-mail").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const name = a.getAttribute("data-name") || "";
      const dom  = a.getAttribute("data-domain") || "";
      const full = name + "@" + dom;

      const show = function (ok) {
        a.classList.add("is-copied");
        const state = a.querySelector(".copied-state");
        if (state) state.textContent = ok ? "Copied" : "Copy failed";
        setTimeout(function () { a.classList.remove("is-copied"); }, 1600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(full).then(
          function () { show(true); },
          function () { show(false); }
        );
      } else {
        // Legacy fallback
        const tmp = document.createElement("textarea");
        tmp.value = full;
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand("copy"); show(true); }
        catch (_) { show(false); }
        document.body.removeChild(tmp);
      }
    });
  });

  /* ------------------------------------------------------------------------
     8. Marquee tile swap (design.md §Marquee .mq — 2–3 slots swap every
        N seconds to give the illusion of horizontal motion).
        The home page marquee rotates the visible article every ~4s; in this
        rebuild we crossfade opacity so the structure stays steady.
     ----------------------------------------------------------------------- */
  const pickupItems = Array.prototype.slice.call(
    document.querySelectorAll(".pickup-ul .pickup-li")
  );

  if (pickupItems.length > 1) {
    let activeIdx = 0;
    pickupItems.forEach(function (li, i) {
      li.style.opacity = i === 0 ? "1" : "0.18";
      li.style.transition = "opacity 0.9s " + "cubic-bezier(0.32, 0.94, 0.6, 1)";
    });

    setInterval(function () {
      activeIdx = (activeIdx + 1) % pickupItems.length;
      pickupItems.forEach(function (li, i) {
        li.style.opacity = i === activeIdx ? "1" : "0.18";
      });
    }, 4200);
  }

  /* ------------------------------------------------------------------------
     9. Reduced motion (design.md §Reduced motion — already handled by CSS
        at prefers-reduced-motion, but we also tag <html> so the JS-driven
        marquee can be short-circuited).
     ----------------------------------------------------------------------- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  function applyReduced() {
    if (reduced.matches) root.classList.add("is-reduced");
    else root.classList.remove("is-reduced");
  }
  applyReduced();
  if (reduced.addEventListener) reduced.addEventListener("change", applyReduced);
  else if (reduced.addListener) reduced.addListener(applyReduced);

  /* ------------------------------------------------------------------------
     10. Pickup hover lift (design.md §Case-study marquee — Selected/hover
         state: .cases-h1 .l opacity .7 → 1 over 0.6s soft). Handled in CSS
         via .pickup-a:hover; nothing JS-side needed beyond delegation.
     ----------------------------------------------------------------------- */

})();
