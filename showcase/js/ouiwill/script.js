(() => {
  "use strict";

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => window.matchMedia("(min-width: 769px)").matches;

  const docReady = (fn) => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const r = (min, max) => min + Math.random() * (max - min);

  function splitLetters(el, opts = {}) {
    if (el.dataset.splitDone === "1") return;
    el.dataset.splitDone = "1";

    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        for (const ch of text) {
          if (ch === " " || ch === "\n" || ch === "\t") {
            frag.appendChild(document.createTextNode(ch));
            continue;
          }
          const span = document.createElement("span");
          span.className = "letter";
          span.textContent = ch;
          span.style.setProperty("--d", `${r(0, 0.28).toFixed(3)}s`);
          frag.appendChild(span);
        }
        node.parentNode.replaceChild(frag, node);
        return;
      }
      Array.from(node.childNodes).forEach(walk);
    };
    walk(el);

    if (opts.immediate) {
      requestAnimationFrame(() => {
        $$(".letter", el).forEach((letter, i) => {
          const baseDelay = (opts.delay || 0) * 1000;
          const letterDelay = parseFloat(letter.style.getPropertyValue("--d")) * 1000;
          setTimeout(() => letter.classList.add("is-on"), baseDelay + letterDelay);
        });
      });
    }
  }

  function triggerLetters(scope = document) {
    $$(".letter:not(.is-on)", scope).forEach((letter) => {
      const d = parseFloat(letter.style.getPropertyValue("--d")) || 0;
      setTimeout(() => letter.classList.add("is-on"), d * 1000);
    });
  }

  function splitMultiline(el) {
    if (el.dataset.multilineDone === "1") return;
    el.dataset.multilineDone = "1";

    const text = el.textContent;
    if (!text || !text.trim()) return;

    el.innerHTML = "";
    const chars = text.split("");
    const charSpans = chars.map((c) => {
      const s = document.createElement("span");
      s.textContent = c === " " ? "\u00A0" : c;
      s.style.display = "inline-block";
      el.appendChild(s);
      return s;
    });

    const lines = [];
    let current = [];
    let lastY = null;
    charSpans.forEach((s) => {
      const y = s.offsetTop;
      if (lastY === null) {
        lastY = y;
      } else if (y > lastY + 2) {
        lines.push(current);
        current = [];
        lastY = y;
      }
      current.push(s);
    });
    if (current.length) lines.push(current);

    el.innerHTML = "";
    lines.forEach((line, i) => {
      const mask = document.createElement("span");
      mask.className = "multiline-line";
      mask.style.transitionDelay = `${i * 0.12}s`;
      const inner = document.createElement("span");
      inner.className = "multiline-line__inner";
      inner.textContent = line
        .map((s) => s.textContent)
        .join("")
        .replace(/\u00A0/g, " ");
      mask.appendChild(inner);
      el.appendChild(mask);
      el.appendChild(document.createTextNode(" "));
    });
  }

  function initSplits() {
    $$("[data-split-text]").forEach((el) => splitLetters(el));
    $$("[data-letter-split]").forEach((el) => {
      $$("[data-letter-split-size]", el).forEach((size) => size.removeAttribute("data-letter-split-size"));
      splitLetters(el, { immediate: false });
    });
  }

  function initMultilines() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        $$("[data-multiline]").forEach((el) => splitMultiline(el));
      });
    } else {
      requestAnimationFrame(() => $$("[data-multiline]").forEach((el) => splitMultiline(el)));
    }
  }

  function initScrollReveals() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            const multiline = $("[data-multiline]", entry.target);
            if (multiline && multiline.dataset.multilineDone === "1") {
              $$(".multiline-line__inner", multiline).forEach((inner, i) => {
                inner.style.transitionDelay = `${i * 0.12}s`;
                requestAnimationFrame(() => inner.classList.add("is-active"));
              });
            }
            const letters = $$(".letter", entry.target);
            if (letters.length) {
              letters.forEach((letter) => {
                if (!letter.classList.contains("is-on")) {
                  const d = parseFloat(letter.style.getPropertyValue("--d")) || 0;
                  setTimeout(() => letter.classList.add("is-on"), d * 1000);
                }
              });
            }
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    $$("[data-scroll], [data-stagger-item], [data-tile-media], [data-circle]").forEach((el) =>
      obs.observe(el)
    );
  }

  function initHeaderTheme() {
    const header = $("[data-header]");
    if (!header) return;
    const sections = $$("[data-section][data-theme]");
    if (!sections.length) return;

    const update = () => {
      const headerH = 80;
      const y = window.scrollY + headerH;
      let active = sections[0];
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const bottom = top + rect.height;
        if (y >= top && y < bottom) {
          active = s;
          break;
        }
      }
      const theme = active && active.dataset.theme;
      if (theme === "dark") {
        header.classList.add("is-dark");
      } else {
        header.classList.remove("is-dark");
      }
    };

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            update();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  function initParallax() {
    const items = $$("[data-parallax]");
    if (!items.length) return;
    const speeds = new Map(items.map((it) => [it, parseFloat(it.dataset.parallax) || 0.2]));

    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY;
      items.forEach((it) => {
        const inner = $("[data-parallax-inner]", it) || it;
        if (!isDesktop()) {
          inner.style.transform = "";
          return;
        }
        const rect = it.getBoundingClientRect();
        const elCenter = window.scrollY + rect.top + rect.height / 2;
        const offset = (scrollY + window.innerHeight / 2 - elCenter) * speeds.get(it);
        inner.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  function initCursor() {
    if (!isDesktop()) return;
    const cursor = $("[data-cursor]");
    if (!cursor) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        cx = tx;
        cy = ty;
      }
    });

    const interactiveSel = "a, button, [data-pill], .pill, .work__link, .news__link, .site-mark, .menu__link";

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactiveSel)) cursor.classList.add("is-active");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactiveSel)) cursor.classList.remove("is-active");
    });

    const tick = () => {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      cursor.style.transform = `translate3d(${cx - 12}px, ${cy - 12}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  function initMenu() {
    const menu = $("[data-menu]");
    const toggle = $("[data-menu-toggle]");
    if (!menu || !toggle) return;

    const setOpen = (open) => {
      menu.classList.toggle("is-active", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    };

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-active");
      setOpen(!isOpen);
    });

    $$("[data-menu] a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initHero() {
    const overlay = $("[data-hero-overlay]");
    const title = $(".hero__title");
    if (!overlay || !title) return;

    const start = REDUCED_MOTION ? 0 : 1400;

    setTimeout(() => {
      overlay.classList.add("is-revealed");
      $$(".letter", title).forEach((letter) => {
        const d = parseFloat(letter.style.getPropertyValue("--d")) || 0;
        setTimeout(() => letter.classList.add("is-on"), d * 1000);
      });
    }, start);
  }

  function initMarkReveal() {
    const mark = $("[data-mark]");
    if (!mark) return;
    requestAnimationFrame(() => mark.classList.add("is-revealed"));
  }

  function initPageTransition() {
    const loader = $("[data-loader]");
    if (!loader) return;
    const triggers = $$('a[href^="#"]');
    triggers.forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        loader.classList.add("is-entering");
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => loader.classList.remove("is-entering"), 600);
        }, REDUCED_MOTION ? 0 : 600);
      });
    });
  }

  function initScrollIndicator() {
    const circle = $("[data-circle]");
    if (!circle) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-active");
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(circle);
    circle.addEventListener("click", () => {
      const next = $("[data-section]:nth-of-type(2)");
      if (next) next.scrollIntoView({ behavior: "smooth" });
    });
  }

  function initSocialArrows() {
    $$(".site-footer__social-link").forEach((a) => {
      const arrow = $(".site-footer__arrow", a);
      if (!arrow) return;
      const base = parseFloat(a.dataset.rotate || "-45");
      arrow.style.transform = `rotate(${base}deg)`;
      a.addEventListener("mouseenter", () => (arrow.style.transform = "rotate(0deg)"));
      a.addEventListener("mouseleave", () => (arrow.style.transform = `rotate(${base}deg)`));
    });
  }

  function init() {
    initSplits();
    initMultilines();
    initMarkReveal();
    initHero();
    initScrollReveals();
    initHeaderTheme();
    initParallax();
    initCursor();
    initMenu();
    initPageTransition();
    initScrollIndicator();
    initSocialArrows();
  }

  docReady(init);
})();
