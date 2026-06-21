/* =====================================================================
   Awwwards gallery — interactions driven by vanilla JS.
   Mirrors the Stimulus controllers described in design.md §"JavaScript
   & Libraries" without taking on the framework itself.
   ===================================================================== */

(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     header-marquee — pause the marquee when it leaves the viewport
     (matches IntersectionObserver behavior from design.md)
     --------------------------------------------------------------- */
  function setupMarquee() {
    const wrapper = document.getElementById('marquee');
    if (!wrapper) return;
    if (reduceMotion) { wrapper.classList.remove('is-visible'); return; }
    const marquee = wrapper.closest('.marquee-top');
    if (!marquee || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          wrapper.classList.add('is-visible');
        } else {
          wrapper.classList.remove('is-visible');
        }
      });
    }, { threshold: 0 });
    io.observe(marquee);
  }

  /* ---------------------------------------------------------------
     search — focus expands input (matches design.md: "Search input:
     focus expands the field…")
     --------------------------------------------------------------- */
  function setupSearch() {
    const form = document.querySelector('.search-form');
    if (!form) return;
    const input = form.querySelector('.search-form__input');
    const expanded = 'expanded';

    form.addEventListener('focusin', () => form.classList.add(expanded));
    form.addEventListener('focusout', () => {
      if (document.activeElement !== input) form.classList.remove(expanded);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim()) input.blur();
    });
  }

  /* ---------------------------------------------------------------
     grid — density toggle (data-cols on .grid-cards)
     --------------------------------------------------------------- */
  function setupGridDensity() {
    const grid = document.getElementById('grid');
    const toggles = document.querySelectorAll('.grid-toggle');
    if (!grid || !toggles.length) return;
    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cols = btn.dataset.cols || '3';
        grid.dataset.cols = cols;
        toggles.forEach((b) => b.classList.toggle('is-active', b === btn));
      });
    });
  }

  /* ---------------------------------------------------------------
     grid — filter dropdown open/close (mirrors Stimulus grid
     controller actions: toggleFilter / closeFilters)
     --------------------------------------------------------------- */
  function setupFilters() {
    const items = document.querySelectorAll('.nav-filters__item.js-filter');
    if (!items.length) return;

    const closeAll = (except) => {
      items.forEach((item) => {
        if (item === except) return;
        item.classList.remove('is-open');
        const btn = item.querySelector('.nav-filters__btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    };

    items.forEach((item) => {
      const btn = item.querySelector('.nav-filters__btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('is-open');
        closeAll(item);
        if (!isOpen) {
          item.classList.add('is-open');
          if (btn) btn.setAttribute('aria-expanded', 'true');
          pulseCount();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-filters__item')) closeAll(null);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll(null);
    });
  }

  /* ---------------------------------------------------------------
     aniCountPulse — kick the counter pulse when a filter opens
     --------------------------------------------------------------- */
  let pulseTimer = null;
  function pulseCount() {
    if (reduceMotion) return;
    const el = document.querySelector('.breadcrumb-filters__count');
    if (!el) return;
    el.classList.remove('is-pulsing');
    // force reflow so re-adding restarts the animation
    void el.offsetWidth;
    el.classList.add('is-pulsing');
    if (pulseTimer) clearTimeout(pulseTimer);
    pulseTimer = setTimeout(() => el.classList.remove('is-pulsing'), 5200);
  }

  /* ---------------------------------------------------------------
     toggle — "Read more" expand
     --------------------------------------------------------------- */
  function setupReadMore() {
    const btn = document.querySelector('.js-readmore');
    const extra = document.getElementById('toggle-tag');
    if (!btn || !extra) return;
    extra.classList.add('sr-only');
    btn.addEventListener('click', () => {
      const open = extra.classList.toggle('is-open');
      extra.classList.toggle('sr-only', !open);
      btn.textContent = open ? 'Read less' : 'Read more';
    });
  }

  /* ---------------------------------------------------------------
     back-to-top — show on scroll past one viewport, animate glyph
     while scrolling, click returns to top
     --------------------------------------------------------------- */
  function setupBackToTop() {
    const btn = document.querySelector('.js-gototop');
    if (!btn) return;
    const viewport = window.innerHeight;
    let spinning = false;
    let spinTimer = null;

    const onScroll = () => {
      if (window.scrollY > viewport) {
        btn.classList.remove('is-hidden');
      } else {
        btn.classList.add('is-hidden');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      btn.classList.add('is-loading');
      spinning = true;
      if (spinTimer) clearTimeout(spinTimer);

      const start = window.scrollY;
      const duration = 600;
      const startTime = performance.now();

      function tick(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        window.scrollTo(0, start * (1 - eased));
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          btn.classList.remove('is-loading');
          spinning = false;
        }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------------------------------------------------------------
     cookies — dismiss
     --------------------------------------------------------------- */
  function setupCookies() {
    const banner = document.querySelector('.js-cookies');
    const accept = document.querySelector('.js-accept-cookies');
    if (!banner || !accept) return;
    accept.addEventListener('click', () => {
      banner.classList.remove('is-show');
      try { localStorage.setItem('aww-cookies', '1'); } catch (e) { /* private mode */ }
    });
    try {
      if (localStorage.getItem('aww-cookies') === '1') {
        banner.classList.remove('is-show');
      }
    } catch (e) { /* private mode */ }
  }

  /* ---------------------------------------------------------------
     lazyload-image — swap data-srcset → srcset on intersection
     --------------------------------------------------------------- */
  function setupLazyLoad() {
    if (!('IntersectionObserver' in window)) return;
    const imgs = document.querySelectorAll('img[data-srcset]');
    if (!imgs.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        if (img.dataset.src) img.src = img.dataset.src;
        io.unobserve(img);
      });
    }, { rootMargin: '200px' });
    imgs.forEach((img) => io.observe(img));
  }

  /* ---------------------------------------------------------------
     infinite-scroll — append more placeholder cards when the
     loader sentinel enters the viewport
     --------------------------------------------------------------- */
  function setupInfiniteScroll() {
    const grid = document.getElementById('grid');
    const sentinel = document.querySelector('.loader-grid');
    if (!grid || !sentinel || !('IntersectionObserver' in window)) return;

    const palettes = [
      'thumb--paper', 'thumb--carbon', 'thumb--quiet',
      'thumb--order', 'thumb--lattice', 'thumb--velvet',
      'thumb--north', 'thumb--glass', 'thumb--cold'
    ];
    const titles = [
      'Outer Beacon', 'Pale Atlas', 'Slate Echo', 'Quiet Lantern',
      'Tide and Tether', 'Marble Index', 'Slow Form', 'Index Nine',
      'Northbound', 'Iron Loom', 'Hazel Hour', 'Field & Forge'
    ];
    const awards = [
      { cls: 'budget-tag--solid-black', label: 'Site of the day', shiny: true },
      { cls: 'budget-tag--small', label: 'Honorable' },
      { cls: 'budget-tag--dev', label: 'Developer' },
      { cls: 'budget-tag--solid-black', label: 'Site of the day' }
    ];

    function makeCard(i) {
      const li = document.createElement('li');
      li.className = 'col js-card';
      const palette = palettes[i % palettes.length];
      const title = titles[i % titles.length];
      const award = awards[i % awards.length];
      li.innerHTML = `
        <div class="card-site js-card-site">
          <figure class="figure-rollover">
            <a class="figure-rollover__link" href="#" aria-label="${title} — site preview">
              <div class="thumb thumb--placeholder ${palette}" aria-hidden="true"></div>
            </a>
            <div class="figure-rollover__hover">
              <div class="figure-rollover__left">
                <span class="figure-rollover__eyebrow">Website</span>
                <span class="figure-rollover__row">${title}</span>
              </div>
              <div class="figure-rollover__center">
                <button class="btn-vote" type="button">Vote now
                  <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 4l8 6-8 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
              <div class="figure-rollover__right">
                <div class="avatar-name">
                  <div class="avatar-name__img" aria-hidden="true">??</div>
                  <div class="avatar-name__name">Unknown</div>
                  <div class="avatar-name__title">Studio</div>
                </div>
              </div>
            </div>
          </figure>
          <div class="card-site__info">
            <ul class="card-site__awards">
              <li class="budget-tag ${award.cls}${award.shiny ? ' anim-shiny' : ''}">${award.label}</li>
            </ul>
            <div class="card-site__byline">Unknown · —</div>
          </div>
        </div>`;
      return li;
    }

    let loaded = 0;
    const MAX_PAGES = 2;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (loaded >= MAX_PAGES) {
          sentinel.style.display = 'none';
          io.disconnect();
          return;
        }
        loaded += 1;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 6; i += 1) {
          frag.appendChild(makeCard(loaded * 6 + i));
        }
        grid.appendChild(frag);
      });
    }, { rootMargin: '300px' });
    io.observe(sentinel);
  }

  /* ---------------------------------------------------------------
     boot
     --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    setupMarquee();
    setupSearch();
    setupGridDensity();
    setupFilters();
    setupReadMore();
    setupBackToTop();
    setupCookies();
    setupLazyLoad();
    setupInfiniteScroll();
  });
})();
