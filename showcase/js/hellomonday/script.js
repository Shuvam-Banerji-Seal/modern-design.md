/* ============================================================
   Hello Monday — interactive behavior
   Implements scroll-reveal, countdown, nav state, back-to-top,
   and lightweight hovers drawn from the design.md spec.
   ============================================================ */

(function () {
  "use strict";

  /* --------------------------------------------------------
     Helpers
     -------------------------------------------------------- */
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const ease = (t) => 1 - Math.pow(1 - t, 3); // Power3.easeOut
  const lerp = (a, b, t) => a + (b - a) * t;

  /* --------------------------------------------------------
     1. Sticky nav: hide on scroll-down, reveal on scroll-up
        (paired with mix-blend-mode: difference in CSS)
     -------------------------------------------------------- */
  const nav = $("#mainNav");
  let lastY = window.scrollY;
  let navTicking = false;

  function onNavScroll() {
    const y = window.scrollY;
    const delta = y - lastY;

    if (y < 80) {
      nav.classList.remove("is-hidden");
    } else if (delta > 4) {
      nav.classList.add("is-hidden");
    } else if (delta < -4) {
      nav.classList.remove("is-hidden");
    }
    lastY = y;
    navTicking = false;
  }
  window.addEventListener("scroll", () => {
    if (!navTicking) {
      window.requestAnimationFrame(onNavScroll);
      navTicking = true;
    }
  }, { passive: true });

  // Reveal logo once the page is "in" (mirrors the .logo fade-in)
  window.requestAnimationFrame(() => {
    setTimeout(() => nav.classList.add("is-ready"), 320);
  });

  /* --------------------------------------------------------
     2. Countdown — "X days until Monday"
        Computed from the current date; updates daily.
     -------------------------------------------------------- */
  const countdownEl = $("#countdownText");
  function daysUntilMonday() {
    const now = new Date();
    const day = now.getDay(); // 0 Sun, 1 Mon
    let diff = (1 - day + 7) % 7;
    if (diff === 0) diff = 0; // today is Monday
    // If it's Monday, show "0" — Monday is here.
    if (day === 1) diff = 0;
    return diff;
  }
  function updateCountdown() {
    if (!countdownEl) return;
    const n = daysUntilMonday();
    countdownEl.textContent =
      n === 0 ? "It’s Monday" :
      n === 1 ? "1 day until Monday" :
      n + " days until Monday";
  }
  updateCountdown();
  // Refresh at midnight
  setInterval(updateCountdown, 60 * 60 * 1000);

  /* --------------------------------------------------------
     3. Hero headline reveal — opacity 0→1 + translateY 20→0
        (replicates the TweenLite "headline" timeline)
     -------------------------------------------------------- */
  const heroH1 = $("#heroH1");
  if (heroH1) {
    setTimeout(() => heroH1.classList.add("is-in"), 480);
  }

  /* --------------------------------------------------------
     4. Section reveal on scroll (IntersectionObserver)
        Replicates the 12 IO instances and lazy-image transitions.
     -------------------------------------------------------- */
  const revealTargets = $$(".module");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-revealed"));
  }

  /* --------------------------------------------------------
     5. Case-card hover — mirror the "opacity 0.2 → 1" feature
        where the non-hovered cards dim slightly (desktop only)
     -------------------------------------------------------- */
  const caseGrid = $(".CaseGridModule .grid-managed");
  if (caseGrid && window.matchMedia("(hover: hover)").matches) {
    const cards = $$(".case-card", caseGrid);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        cards.forEach((c) => {
          if (c !== card) c.style.opacity = "0.55";
        });
        card.style.opacity = "1";
      });
      card.addEventListener("mouseleave", () => {
        cards.forEach((c) => (c.style.opacity = "1"));
      });
    });
  }

  /* --------------------------------------------------------
     6. Back-to-top label — slide from translateY(32) to 0
        when the footer enters the viewport
     -------------------------------------------------------- */
  const backToTop = $("#backToTop");
  if (backToTop && "IntersectionObserver" in window) {
    const footerIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            backToTop.classList.add("is-in");
          } else {
            backToTop.classList.remove("is-in");
          }
        });
      },
      { threshold: 0.15 }
    );
    footerIO.observe($(".Footer"));
  }
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      const start = window.scrollY;
      const dur = 700;
      const t0 = performance.now();
      function step(now) {
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, Math.round(lerp(start, 0, ease(t))));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* --------------------------------------------------------
     7. Smooth-scroll for in-page nav links
        (TweenLite + ScrollToPlugin behavior)
     -------------------------------------------------------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const start = window.scrollY;
      const end   = target.getBoundingClientRect().top + start;
      const dur   = 700;
      const t0    = performance.now();
      function step(now) {
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, Math.round(lerp(start, end, ease(t))));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  });

  /* --------------------------------------------------------
     8. Mobile burger — toggle (open/close) nav menu
        Mirrors the .menu_blob_init Paper.js morph with a
        lightweight CSS scale on the .nav-links panel.
     -------------------------------------------------------- */
  const burger = $("#navBurger");
  if (burger) {
    const panel = document.createElement("div");
    panel.className = "mobile-menu-panel";
    panel.innerHTML = `
      <ul>
        <li><a href="#work">Work</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#product">Product</a></li>
        <li><a href="#contact">Contact</a></li>
        <li class="social"><a href="#facebook">Facebook</a></li>
        <li class="social"><a href="#instagram">Instagram</a></li>
        <li class="social"><a href="#twitter">Twitter</a></li>
      </ul>`;
    document.body.appendChild(panel);

    burger.addEventListener("click", () => {
      const open = !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
  }

  /* --------------------------------------------------------
     9. Subtle parallax on the hero placeholder
        (TweenLite scroll-tween equivalent — via rAF)
     -------------------------------------------------------- */
  const heroAnim = $(".HeroModule .animationContainer");
  if (heroAnim) {
    let pTicking = false;
    function onParallax() {
      const r = heroAnim.getBoundingClientRect();
      const offset = (window.innerHeight - r.top) * 0.08;
      heroAnim.style.transform = `translateY(${offset.toFixed(2)}px)`;
      pTicking = false;
    }
    window.addEventListener("scroll", () => {
      if (!pTicking) {
        window.requestAnimationFrame(onParallax);
        pTicking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------
     10. Hero word-by-word "sprite mask" simulation
         Splits the H1 into per-word spans and staggers a
         translateY + opacity transition. Mirrors the
         "headline" timeline described in the design.md.
     -------------------------------------------------------- */
  const heroTitleEl = $(".hero-h1");
  if (heroTitleEl && !heroTitleEl.dataset.split) {
    const text = heroTitleEl.textContent.trim();
    heroTitleEl.textContent = "";
    text.split(/\s+/).forEach((w, i) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      span.style.transitionDelay = (i * 90) + "ms";
      heroTitleEl.appendChild(span);
      if (i < text.split(/\s+/).length - 1) {
        heroTitleEl.appendChild(document.createTextNode(" "));
      }
    });
    heroTitleEl.dataset.split = "1";
  }

})();
