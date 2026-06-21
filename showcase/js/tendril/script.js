(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    setReady();
    initRevealOnScroll();
    initHeaderScroll();
    initMobileMenu();
    initHelloRotator();
    initClocks();
    initNewsletter();
  });

  function setReady() {
    setTimeout(function () {
      document.body.classList.add('ready');
    }, 100);
  }

  function initRevealOnScroll() {
    const targets = $$('.revealable, .fade-in');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('reveal'); });
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    targets.forEach(function (el) { io.observe(el); });
  }

  function initHeaderScroll() {
    const header = $('#site-header');
    if (!header) return;

    let lastY = 0;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const pastHero = y > 240;

      if (y > 80) header.classList.add('sticky');
      else header.classList.remove('sticky');

      if (pastHero && y > lastY) header.classList.add('transition');
      else header.classList.remove('transition');

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  function initMobileMenu() {
    const btn = $('#menu-btn');
    const header = $('#site-header');
    const nav = $('#nav-container');
    if (!btn || !header || !nav) return;

    btn.addEventListener('click', function () {
      const isOpen = header.classList.toggle('menu');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    $$('.mobile-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('menu');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initHelloRotator() {
    const rotator = $('#hello-rotator');
    if (!rotator) return;

    const spans = $$('span', rotator);
    if (spans.length < 2) return;

    let idx = 0;

    setInterval(function () {
      const current = spans[idx];
      const nextIdx = (idx + 1) % spans.length;
      const next = spans[nextIdx];

      spans.forEach(function (s) {
        s.classList.remove('active', 'was-active', 'next');
      });

      current.classList.add('was-active');
      next.classList.add('next');

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          next.classList.remove('next');
          next.classList.add('active');
        });
      });

      idx = nextIdx;
    }, 3000);
  }

  function initClocks() {
    const clocks = $$('.clock');
    if (!clocks.length) return;

    function partsInTZ(date, tz) {
      try {
        const fmt = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
          timeZone: tz
        });
        const parts = fmt.formatToParts(date);
        const lookup = {};
        parts.forEach(function (p) { lookup[p.type] = p.value; });
        return {
          h: parseInt(lookup.hour, 10) % 24,
          m: parseInt(lookup.minute, 10),
          s: parseInt(lookup.second, 10)
        };
      } catch (e) {
        return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() };
      }
    }

    function render() {
      const now = new Date();
      clocks.forEach(function (clock) {
        const tz = clock.getAttribute('data-tz') || 'America/Toronto';
        const t = partsInTZ(now, tz);
        const hourDeg = (t.h % 12) * 30 + t.m * 0.5;
        const minuteDeg = t.m * 6 + t.s * 0.1;
        clock.style.setProperty('--hours', hourDeg + 'deg');
        clock.style.setProperty('--minutes', minuteDeg + 'deg');
      });
    }

    render();
    setInterval(render, 1000);
  }

  function initNewsletter() {
    const form = $('#newsletter');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const errSlot = form.querySelector('.error');
      if (!email || !email.value || !/.+@.+\..+/.test(email.value)) {
        form.classList.add('error');
        if (errSlot) errSlot.textContent = 'Please enter a valid email.';
        return;
      }
      form.classList.remove('error');
      form.classList.add('complete');
      if (errSlot) errSlot.textContent = '';
    });
  }
})();
