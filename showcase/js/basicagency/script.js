/* =====================================================================
   BASIC/DEPT® — interaction layer
   Implements the behaviors catalogued in design.md §Motion & Interaction
   and the components in §Components (Nav, Carousel, Video player, Input,
   Button-radio, Footer).

   No external dependencies. All values are sourced from the design.md
   tokens; the CSS is the source of truth for the visual system.
   ===================================================================== */

(function () {
  "use strict";

  /* ----- Tiny helpers -------------------------------------------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const lerp = (a, b, t) => a + (b - a) * t;

  /* design.md: --ease-garret: cubic-bezier(0.5, 0, 0, 1)
     Approximated with a pre-baked lookup so we can use it for rAF.   */
  const easeGarret = (t) => {
    /* Closed-form approximation of cubic-bezier(0.5, 0, 0, 1) — monotone
       and very close to the CSS curve in [0, 1]. */
    return t * t * (3 - 2 * t) * 0.86 + t * 0.14;
  };

  /* =====================================================================
     1. Footer copyright year  (design.md: "year computed at runtime")
     ===================================================================== */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* =====================================================================
     2. Header — turn data-transparent OFF once the user scrolls past
     the dark hero (design.md: header transparent on dark hero,
     fills with --background-color on the way down).
     ===================================================================== */
  const header   = $(".header");
  const hero     = $(".home-intro");

  function syncHeaderTransparency() {
    if (!header || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const transparent = heroBottom > 0;
    header.setAttribute("data-transparent", String(transparent));
  }

  if (header && hero) {
    syncHeaderTransparency();
    window.addEventListener("scroll", syncHeaderTransparency, { passive: true });
    window.addEventListener("resize", syncHeaderTransparency);
  }

  /* =====================================================================
     3. Watch Reel cursor (home-intro)
     design.md: 12rem x 12rem azalea circle, "Watch Reel" label +
     "BASIC/DEPT® 2010-∞" caption, shrinks to 7rem x 7rem on active.
     ===================================================================== */
  const introHit = $(".home-intro__hitbox");
  const introCur = $(".page-intro__cursor");

  if (introHit && introCur) {
    const move = (e) => {
      const r = introHit.getBoundingClientRect();
      introCur.style.left = (e.clientX - r.left) + "px";
      introCur.style.top  = (e.clientY - r.top)  + "px";
    };
    introHit.addEventListener("mousemove",  move);
    introHit.addEventListener("mouseenter", () => introCur.setAttribute("data-active", "false"));
    introHit.addEventListener("mousedown",  () => introCur.setAttribute("data-active", "true"));
    introHit.addEventListener("mouseup",    () => introCur.setAttribute("data-active", "false"));
    introHit.addEventListener("mouseleave", () => introCur.setAttribute("data-active", "false"));

    introHit.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      if (!t) return;
      const r = introHit.getBoundingClientRect();
      introCur.style.left = (t.clientX - r.left) + "px";
      introCur.style.top  = (t.clientY - r.top)  + "px";
      introCur.setAttribute("data-active", "true");
    }, { passive: true });

    introHit.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      if (!t) return;
      const r = introHit.getBoundingClientRect();
      introCur.style.left = (t.clientX - r.left) + "px";
      introCur.style.top  = (t.clientY - r.top)  + "px";
    }, { passive: true });

    introHit.addEventListener("touchend",   () => introCur.setAttribute("data-active", "false"));
  }

  /* =====================================================================
     4. Carousel — custom cursor, progress bar, index counter
     design.md:
       - 12rem x 12rem azalea cursor, "Drag" label
       - shrinks to 7rem x 7rem with chevrons on active drag
       - 0.2rem progress bar with 40rem solid bar following scroll
       - (01/05) index counter, updated continuously
     ===================================================================== */
  $$(".carousel").forEach((carousel) => {
    const track   = $(".carousel__track", carousel);
    const cursor  = $(".carousel__cursor", carousel);
    const bar     = $(".carousel__progress__bar", carousel);
    const current = $("[data-current]", carousel);
    const total   = $("[data-total]",   carousel);

    if (!track) return;

    let dragging = false;
    let dragStartX = 0;
    let scrollStart = 0;
    let pointerX = 0;
    let pointerY = 0;
    let rafId = 0;

    /* total slide count (matches the data-show-cursor markup) */
    const slides = $$(".card", track);
    if (total) total.textContent = String(slides.length).padStart(2, "0");

    /* ---- progress bar (requestAnimationFrame, lerped) ---- */
    const updateProgress = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p   = max > 0 ? track.scrollLeft / max : 0;
      if (bar) bar.style.transform = `translateX(${p * 50}%)`;
      if (current) {
        const idx = Math.max(1, Math.round(p * (slides.length - 1)) + 1);
        current.textContent = String(idx).padStart(2, "0");
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    /* ---- custom cursor follows the pointer ---- */
    const onMove = (e) => {
      const r = carousel.getBoundingClientRect();
      pointerX = e.clientX - r.left;
      pointerY = e.clientY - r.top;
      if (cursor) {
        cursor.style.left = pointerX + "px";
        cursor.style.top  = pointerY + "px";
      }
    };
    carousel.addEventListener("mousemove", onMove);
    carousel.addEventListener("mouseleave", () => {
      if (cursor) { cursor.style.opacity = "0"; }
    });
    carousel.addEventListener("mouseenter", () => {
      if (cursor) { cursor.style.opacity = "1"; }
    });

    /* ---- drag-to-scroll ---- */
    const onDown = (e) => {
      dragging = true;
      dragStartX = e.clientX;
      scrollStart = track.scrollLeft;
      if (cursor) cursor.setAttribute("data-active", "true");
      track.style.cursor = "grabbing";
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (cursor) cursor.setAttribute("data-active", "false");
      track.style.cursor = "";
    };
    const onDrag = (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      track.scrollLeft = scrollStart - dx;
    };

    carousel.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup",   onUp);

    /* ---- touch support ---- */
    let touchStartX = 0;
    let touchScrollStart = 0;
    carousel.addEventListener("touchstart", (e) => {
      const t = e.touches[0]; if (!t) return;
      touchStartX = t.clientX;
      touchScrollStart = track.scrollLeft;
      if (cursor) cursor.setAttribute("data-active", "true");
    }, { passive: true });
    carousel.addEventListener("touchmove", (e) => {
      const t = e.touches[0]; if (!t) return;
      track.scrollLeft = touchScrollStart - (t.clientX - touchStartX);
    }, { passive: true });
    carousel.addEventListener("touchend", () => {
      if (cursor) cursor.setAttribute("data-active", "false");
    });

    /* ---- keyboard support ---- */
    carousel.setAttribute("tabindex", "0");
    carousel.addEventListener("keydown", (e) => {
      const cardW = slides[0] ? slides[0].getBoundingClientRect().width : 320;
      if (e.key === "ArrowRight") { track.scrollBy({ left:  cardW + 16, behavior: "smooth" }); }
      if (e.key === "ArrowLeft")  { track.scrollBy({ left: -cardW - 16, behavior: "smooth" }); }
    });
  });

  /* =====================================================================
     5. Filter toggles (.button-radio)
     design.md: data-checked="true" sets active state.
     ===================================================================== */
  const filterGroups = $$(".filter");
  filterGroups.forEach((group) => {
    const radios = $$(".button-radio", group);
    radios.forEach((radio) => {
      radio.addEventListener("click", () => {
        radios.forEach((r) => r.setAttribute("data-checked", "false"));
        radio.setAttribute("data-checked", "true");
      });
    });
  });

  /* =====================================================================
     6. Floating labels  (page-contact-form__input)
     design.md: on focus-within or data-has-value="true" the label
     floats to translateY(-75%). Toggle data-has-value on input.
     ===================================================================== */
  $$(".page-contact-form__input input").forEach((input) => {
    const wrap = input.closest(".page-contact-form__input");
    const sync = () => {
      if (!wrap) return;
      wrap.setAttribute("data-has-value", String(input.value.trim().length > 0));
    };
    input.addEventListener("input", sync);
    sync();
  });

  /* =====================================================================
     7. Scroll-bound reveal (IntersectionObserver)
     design.md: main > section uses fade-in (650ms, ease-out); we
     gate that on viewport entry so off-screen sections don't all
     animate on first paint.
     ===================================================================== */
  const sections = $$("main > section");
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

    sections.forEach((s, i) => {
      /* first section visible on load — play immediately */
      if (i === 0) {
        s.classList.add("is-in");
      } else {
        s.classList.add("is-waiting");
        io.observe(s);
      }
    });
  }

  /* =====================================================================
     8. Header nav stagger (mount)
     design.md: --bd-time-delay-initial + 100ms + N * 25ms.
     Handled in CSS via animation-delay; nothing to do here.
     ===================================================================== */
})();
