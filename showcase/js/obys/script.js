/* ============================================================
   Obys-style showcase — interaction
   Custom cursor, preloader, scroll reveals, mode switcher,
   live clock, hover preview.
   All motion durations + easings match design.md §"Animations".
   ============================================================ */

(function () {
  "use strict";

  const EASE = {
    outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
    outQuint: "cubic-bezier(0.19, 1, 0.22, 1)",
    inOut: "cubic-bezier(0.76, 0, 0.2, 1)"
  };

  /* ------------------------------------------------------------
     Custom cursor — position + scale on interactive elements
     ------------------------------------------------------------ */
  const cursor = document.querySelector(".cursor");
  const cursorDot = cursor ? cursor.querySelector(".cursor__dot") : null;
  let cursorX = 0, cursorY = 0;
  let cursorTX = 0, cursorTY = 0;
  const HOVER_SELECTOR = "a, button, .ho-wo-2-img, .cursor-target";

  if (cursor) {
    window.addEventListener("mousemove", (e) => {
      cursorTX = e.clientX;
      cursorTY = e.clientY;
    }, { passive: true });

    const tick = () => {
      cursorX += (cursorTX - cursorX) * 0.22;
      cursorY += (cursorTY - cursorY) * 0.22;
      cursor.style.transform = `translate3d(${cursorX - 8}px, ${cursorY - 8}px, 0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    document.addEventListener("mouseover", (e) => {
      const t = e.target;
      if (t && t.closest && t.closest(HOVER_SELECTOR)) cursor.classList.add("is-hv");
    });
    document.addEventListener("mouseout", (e) => {
      const t = e.target;
      if (t && t.closest && t.closest(HOVER_SELECTOR)) cursor.classList.remove("is-hv");
    });

    // Hide cursor on touch
    window.addEventListener("touchstart", () => { cursor.style.display = "none"; }, { once: true, passive: true });
  }

  /* ------------------------------------------------------------
     Preloader + progress bar
     The progress bar travels -101% → 0% (1.0s, ease-in-out),
     then its inner fill travels -100% → 0% (3.5s, out-expo).
     The percentage counter ticks 0 → 100 over ~3.5s.
     On complete: preloader is removed, .is-in reveals fire.
     ------------------------------------------------------------ */
  const prgBar = document.getElementById("prg");
  const prgFill = prgBar ? prgBar.querySelector("div") : null;
  const prgCounter = document.getElementById("preloader-prg");
  const preloader = document.getElementById("preloader");

  if (prgBar && prgFill) {
    requestAnimationFrame(() => {
      document.body.classList.add("is-loaded");
    });
  }

  const startTs = performance.now();
  const DURATION = 3500;
  function runCounter() {
    const now = performance.now();
    const p = Math.min(1, (now - startTs) / DURATION);
    const v = Math.min(100, Math.round(p * 100));
    if (prgCounter) prgCounter.textContent = String(v);
    if (p < 1) requestAnimationFrame(runCounter);
    else finishPreloader();
  }
  requestAnimationFrame(runCounter);

  function finishPreloader() {
    document.body.classList.add("is-ready");
    if (prgCounter) prgCounter.textContent = "100";
    // Re-trigger the spread state of the logo, then settle
    const logo = document.getElementById("logo");
    if (logo) {
      logo.classList.remove("is-intro");
      // wait one frame so width transition engages, then spread
      requestAnimationFrame(() => {
        logo.classList.add("is-on");
        setTimeout(() => logo.classList.add("is-spread"), 1200);
      });
    }
  }

  /* ------------------------------------------------------------
     Live CET clock
     ------------------------------------------------------------ */
  const timeEl = document.getElementById("header-time");
  if (timeEl) {
    const fmt = (n) => String(n).padStart(2, "0");
    const tickClock = () => {
      try {
        const now = new Date();
        const cet = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Berlin",
          hour: "2-digit", minute: "2-digit", hour12: true
        }).format(now);
        timeEl.textContent = `CET ${cet}`;
      } catch (e) {
        const d = new Date();
        timeEl.textContent = `CET ${fmt(d.getHours())}:${fmt(d.getMinutes())}`;
      }
    };
    tickClock();
    setInterval(tickClock, 1000 * 30);
  }

  /* ------------------------------------------------------------
     Scroll-triggered reveals via IntersectionObserver
     Every .ln_ mask animates its .ln child (translateY 102% → 0).
     Every .ho-wo-2-img and .ho-wo-2-empty animates opacity 0 → 1.
     Cascaded by row index for the grid.
     ------------------------------------------------------------ */
  const io = ("IntersectionObserver" in window) ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }) : null;

  if (io) {
    // Wrap every direct .ln (not nested) for cascade staggering
    document.querySelectorAll(".ln_").forEach((mask, i) => {
      const inner = mask.querySelector(".ln");
      if (!inner) return;
      inner.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(mask);
    });

    document.querySelectorAll(".ho-wo-2-img, .ho-wo-2-empty").forEach((el) => {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".ln_, .ho-wo-2-img, .ho-wo-2-empty").forEach((el) => el.classList.add("is-in"));
  }

  /* ------------------------------------------------------------
     Section-wide reveal — when a .page-section enters the viewport,
     reveal all of its .ln_ children (hero lines) in sequence.
     ------------------------------------------------------------ */
  const sectionIo = ("IntersectionObserver" in window) ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        sectionIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }) : null;

  if (sectionIo) {
    document.querySelectorAll(".page-section").forEach((sec) => sectionIo.observe(sec));
  }

  /* ------------------------------------------------------------
     Work-card hover preview (clip-path reveal + Ken Burns)
     When hovering a .ho-wo-2-img, the fixed #ho-wo-2-ov
     fades in and its .ho-wo-2-r clip-path animates from
     inset(50%) → inset(0), and the inner scale 1.15 → 1 over 1.6s.
     ------------------------------------------------------------ */
  const hoverOv = document.getElementById("ho-wo-2-ov");
  const hoverImg = hoverOv ? hoverOv.querySelector(".ho-wo-2-r-img") : null;
  document.querySelectorAll(".ho-wo-2-img").forEach((card, i) => {
    card.addEventListener("mouseenter", () => {
      document.querySelectorAll(".ho-wo-2-img.is-hv").forEach((c) => c.classList.remove("is-hv"));
      card.classList.add("is-hv");
      if (hoverImg) {
        // Tint the preview per-card using its index (decorative — no real image)
        const hue = (i * 37) % 360;
        hoverImg.style.background = `linear-gradient(135deg, hsl(${hue}, 6%, 80%) 0%, hsl(${(hue+20)%360}, 8%, 50%) 100%)`;
      }
    });
    card.addEventListener("mouseleave", () => card.classList.remove("is-hv"));
  });

  /* ------------------------------------------------------------
     Mode switcher — Vertical / Horizontal / Grid
     The three buttons toggle which .work-mode is .is-on.
     Only the grid mode is built out in this sample (matches
     the primary component from the spec).
     ------------------------------------------------------------ */
  const modeButtons = {
    "ho-wo-mo-0": null, // vertical not built
    "ho-wo-mo-1": null, // horizontal not built
    "ho-wo-mo-2": document.getElementById("ho-wo-2")
  };
  Object.keys(modeButtons).forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // Reset all buttons
      document.querySelectorAll("#ho-wo-mo button").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      // Reset all modes
      document.querySelectorAll(".work-mode").forEach((m) => m.classList.remove("is-on"));
      const target = modeButtons[id];
      if (target) {
        target.classList.add("is-on");
        // re-trigger card reveals so the cards animate in
        target.querySelectorAll(".ho-wo-2-img, .ho-wo-2-empty").forEach((el, i) => {
          el.classList.remove("is-in");
          setTimeout(() => el.classList.add("is-in"), 30 + i * 30);
        });
      }
    });
  });

  /* ------------------------------------------------------------
     Header menu active state on scroll
     ------------------------------------------------------------ */
  const navLinks = document.querySelectorAll("#header-menu a");
  const sections = ["work", "about", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle("is-on", a.getAttribute("href") === `#${id}`);
          });
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px" });
    sections.forEach((s) => navIo.observe(s));
  }

  /* ------------------------------------------------------------
     Header-title shrink on scroll
     The wordmark shrinks to 4.05rem max-width with 0.8s out-expo
     ------------------------------------------------------------ */
  const headerTitle = document.getElementById("header-title");
  if (headerTitle) {
    const onScroll = () => {
      if (window.scrollY > 60) headerTitle.classList.add("is-shrink");
      else headerTitle.classList.remove("is-shrink");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
