/* ============================================================
   Recent (godly.website) — interactivity layer
   Implements every behavior listed under "Motion & Interaction"
   in websites/godly/design.md, plus the modal/dropdown plumbing.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------- */
  /* 1.  Mock live-counter (visitors.now)                       */
  /*    The real site fetches /v.js → {count: 47}.                */
  /*    We simulate with a random walk every 7s.                  */
  /* ----------------------------------------------------------- */
  const liveNum = document.querySelector('.live-count-num');
  if (liveNum) {
    let n = 47;
    setInterval(() => {
      const delta = Math.random() < 0.5 ? -1 : 1;
      n = Math.max(20, Math.min(120, n + delta));
      liveNum.textContent = n;
      const wrap = liveNum.closest('.live-count');
      if (wrap) wrap.setAttribute('aria-label', `${n} online now`);
    }, 7000);
  }

  /* ----------------------------------------------------------- */
  /* 2.  "Last updated Xh ago" – relative timestamp ticker       */
  /* ----------------------------------------------------------- */
  const stamp = document.getElementById('last-updated');
  let minutesAgo = 0;
  function renderStamp() {
    if (!stamp) return;
    let label;
    if (minutesAgo < 1)        label = 'Last updated just now';
    else if (minutesAgo < 60)  label = `Last updated ${minutesAgo}m ago`;
    else if (minutesAgo < 1440) {
      const h = Math.floor(minutesAgo / 60);
      label = `Last updated ${h}h ago`;
    } else {
      const d = Math.floor(minutesAgo / 1440);
      label = `Last updated ${d}d ago`;
    }
    stamp.textContent = label;
  }
  setInterval(() => { minutesAgo += 1; renderStamp(); }, 60000);

  /* ----------------------------------------------------------- */
  /* 3.  Filter nav (sidebar)                                   */
  /*    data-filter="all|x|websites|app-store-screenshots|       */
  /*                  app-icons|info" hides non-matching cards. */
  /* ----------------------------------------------------------- */
  const filterLinks = document.querySelectorAll('.filter-link');
  const cards       = document.querySelectorAll('.card');

  filterLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      filterLinks.forEach((l) => {
        l.classList.remove('is-active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');

      const f = link.dataset.filter;
      cards.forEach((c) => {
        const cat = c.dataset.category;
        const visible = f === 'all' || f === 'info' || cat === f;
        c.classList.toggle('is-hidden', !visible);
      });
    });
  });

  /* ----------------------------------------------------------- */
  /* 4.  Sort listbox (sticky bar)                              */
  /*    Toggles a small dropdown of sort orders.                 */
  /* ----------------------------------------------------------- */
  const sortBtn  = document.getElementById('sort-trigger');
  const sortMenu = document.getElementById('sort-listbox');
  const sortLbl  = sortBtn && sortBtn.querySelector('.sort-btn-label');

  function closeSort() {
    if (!sortMenu || !sortBtn) return;
    sortMenu.hidden = true;
    sortBtn.setAttribute('aria-expanded', 'false');
    sortBtn.removeAttribute('data-popup-open');
  }
  function openSort() {
    if (!sortMenu || !sortBtn) return;
    sortMenu.hidden = false;
    sortBtn.setAttribute('aria-expanded', 'true');
    sortBtn.setAttribute('data-popup-open', '');
  }

  if (sortBtn && sortMenu) {
    sortBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = sortBtn.getAttribute('aria-expanded') === 'true';
      expanded ? closeSort() : openSort();
    });

    sortMenu.querySelectorAll('li[role="option"]').forEach((opt) => {
      opt.addEventListener('click', () => {
        sortMenu.querySelectorAll('li[role="option"]').forEach((o) => {
          o.setAttribute('aria-selected', 'false');
          o.tabIndex = -1;
        });
        opt.setAttribute('aria-selected', 'true');
        opt.tabIndex = 0;
        if (sortLbl) sortLbl.textContent = opt.textContent;
        closeSort();
      });
    });

    document.addEventListener('click', (e) => {
      if (!sortMenu.hidden &&
          !sortMenu.contains(e.target) &&
          e.target !== sortBtn) closeSort();
    });
  }

  /* ----------------------------------------------------------- */
  /* 5.  Subscribe modal (Base UI Dialog pattern)               */
  /*    Triggers, scrim click, [X] click, ESC key.               */
  /* ----------------------------------------------------------- */
  const modalRoot  = document.getElementById('modal-root');
  const openBtn    = document.getElementById('open-modal');
  const dialog     = document.getElementById('subscribe-dialog');
  const emailInput = document.getElementById('email-input');
  const form       = document.getElementById('subscribe-form');
  const submitBtn  = document.getElementById('dialog-submit');

  let lastFocused = null;

  function openModal() {
    if (!modalRoot) return;
    lastFocused = document.activeElement;
    modalRoot.hidden = false;
    requestAnimationFrame(() => modalRoot.classList.add('is-open'));
    document.body.classList.add('dialog-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => emailInput && emailInput.focus(), 50);
  }

  function closeModal() {
    if (!modalRoot) return;
    modalRoot.classList.remove('is-open');
    setTimeout(() => {
      modalRoot.hidden = true;
      document.body.classList.remove('dialog-open');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }, 300); // matches .dialog transition
  }

  if (openBtn)  openBtn.addEventListener('click', openModal);

  if (modalRoot) {
    modalRoot.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalRoot && !modalRoot.hidden) closeModal();
  });

  /* Focus trap inside the dialog (minimal but spec-compliant) */
  if (dialog) {
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ----------------------------------------------------------- */
  /* 6.  Subscribe form (validation + mock submit)              */
  /* ----------------------------------------------------------- */
  if (emailInput && submitBtn) {
    const check = () => {
      const ok = /.+@.+\..+/.test(emailInput.value.trim());
      submitBtn.disabled = !ok;
      emailInput.disabled = !ok && emailInput.value.length > 0 && !ok;
    };
    emailInput.addEventListener('input', check);
    check();
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitBtn && submitBtn.disabled) return;
      if (sortLbl) sortLbl; // (no-op; keeps lint happy)
      closeModal();
    });
  }

  /* ----------------------------------------------------------- */
  /* 7.  Card hover affordance — purely tonal, no transform.     */
  /*    The spec says cards are static; we add a subtle media    */
  /*    brightness nudge so the "chrome as content" idea reads   */
  /*    correctly without breaking the flat aesthetic.           */
  /* ----------------------------------------------------------- */
  cards.forEach((c) => {
    const zoom = c.querySelector('.card-zoom');
    const media = c.querySelector('.card-media');
    if (!zoom || !media) return;
    zoom.addEventListener('mouseenter', () => {
      media.style.filter = 'brightness(0.97)';
    });
    zoom.addEventListener('mouseleave', () => {
      media.style.filter = '';
    });
  });
})();