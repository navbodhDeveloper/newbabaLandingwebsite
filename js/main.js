/**
 * main.js — Baba Satyanarayan Mourya Official Website
 *
 * Rewritten to match the IDs/classes actually used in index.html
 * (the previous version targeted #navbar, #hamburger, #scrollTopBtn,
 * a <form id="contactForm">, #f-name/#f-email/etc. and [data-count] —
 * none of which exist on this page, so it was effectively dead code).
 *
 * This file is a drop-in replacement for babaji.js: it includes the
 * cursor follower and gallery auto-scroll that babaji.js had, plus
 * the more robust nav/form/counter logic from the original main.js.
 *
 * To use: swap the script tag at the bottom of index.html —
 *   <script src="./babaji.js"></script>
 *   →
 *   <script src="./js/main.js" defer></script>
 *
 * Sections:
 *  1. Custom cursor
 *  2. Navigation (scroll effect, hamburger, active link)
 *  3. Scroll-to-top button
 *  4. Scroll reveal animations
 *  5. Gallery auto-scroll (pauses on hover AND touch)
 *  6. Contact form (validation + submit, with mailto fallback)
 *  7. Animated counters
 *  8. Utility helpers
 *
 * Edit content in: ../index.html (all text, links, images)
 * Edit API URL / contact email in: CONFIG below
 */

'use strict';

/* ============================================================
   CONFIG — Edit these values
   ============================================================ */
const CONFIG = {
  // No backend exists in this repo yet (static Netlify site, no
  // /api route). Point this at a real endpoint when you have one
  // (a Netlify Function, Formspree, EmailJS, etc.). Until then,
  // submitForm() falls back to a mailto: link on failure so the
  // form still does *something* useful.
  CONTACT_API_URL: '/api/contact',
  CONTACT_FALLBACK_EMAIL: 'baba@bharatbhakti.com',

  MIN_MESSAGE_LENGTH: 20,
  REVEAL_THRESHOLD: 0.12,
  COUNTER_DURATION: 1800,

  // ms of inactivity after a manual gallery scroll before
  // auto-scroll resumes
  GALLERY_RESUME_DELAY: 2000,
};

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  function moveCursor(x, y) {
    mx = x; my = y;
    cur.style.left = x + 'px';
    cur.style.top  = y + 'px';
  }

  document.addEventListener('mousemove', e => moveCursor(e.clientX, e.clientY));
  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) moveCursor(t.clientX, t.clientY);
  }, { passive: true });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, [onclick]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width = '20px'; cur.style.height = '20px';
      ring.style.width = '52px'; ring.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width = '12px'; cur.style.height = '12px';
      ring.style.width = '36px'; ring.style.height = '36px';
    });
  });
})();

/* ============================================================
   2. NAVIGATION
   ============================================================ */
(function initNav() {
  const navbar     = document.getElementById('nav');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks   = document.querySelectorAll('.nav-links a');
  const sections   = document.querySelectorAll('section[id]');

  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveLink();
  }

  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger + mobile menu: index.html calls these via inline
  // onclick="toggleMenu()" / onclick="closeMenu()", so they need
  // to stay as real global functions rather than addEventListener.
  window.toggleMenu = function () {
    if (!mobileMenu || !hamburger) return;
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.textContent = isOpen ? '✕' : '☰';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  window.closeMenu = function () {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('open');
    hamburger.textContent = '☰';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', e => {
    if (mobileMenu && mobileMenu.classList.contains('open') &&
        !navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      window.closeMenu();
    }
  });
})();

/* ============================================================
   3. SCROLL TO TOP
   ============================================================ */
(function initScrollTop() {
  const btn = document.getElementById('sctop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 500 ? 'flex' : 'none';
  }, { passive: true });
  // btn's own scroll-to-top action is already wired via inline onclick in the HTML
})();

/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!elements.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: CONFIG.REVEAL_THRESHOLD, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. GALLERY AUTO-SCROLL
   ============================================================ */
(function initGallery() {
  const strip = document.getElementById('galleryStrip');
  if (!strip) return;

  let autoScroll = true;
  let scrollPos = strip.scrollLeft;
  let resumeTimer = null;

  function tick() {
    if (autoScroll) {
      scrollPos += 0.6;
      if (scrollPos >= strip.scrollWidth - strip.clientWidth) scrollPos = 0;
      strip.scrollLeft = scrollPos;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  strip.addEventListener('mouseenter', () => { autoScroll = false; });
  strip.addEventListener('mouseleave', () => { autoScroll = true; });

  function pause() {
    autoScroll = false;
    if (resumeTimer) clearTimeout(resumeTimer);
  }
  function scheduleResume() {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      scrollPos = strip.scrollLeft;
      autoScroll = true;
    }, CONFIG.GALLERY_RESUME_DELAY);
  }

  strip.addEventListener('touchstart', pause, { passive: true });
  strip.addEventListener('touchend', scheduleResume, { passive: true });
  strip.addEventListener('pointerdown', pause);
  strip.addEventListener('pointerup', scheduleResume);
  strip.addEventListener('scroll', () => {
    if (!autoScroll) scrollPos = strip.scrollLeft;
  }, { passive: true });
})();

/* ============================================================
   6. CONTACT FORM
   ============================================================ */
(function initContactForm() {
  // No <form> element wraps the fields in index.html — the button
  // uses onclick="submitForm()" — so this stays a global function
  // rather than a "submit" event listener.
  const errorEl   = document.getElementById('ferr');
  const areaEl    = document.getElementById('formArea');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = areaEl ? areaEl.querySelector('button') : null;

  if (!areaEl) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }
  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }
  function hideError() {
    if (!errorEl) return;
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }
  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Sending...' : '📤 Send Invitation';
  }

  window.submitForm = async function () {
    hideError();

    const name    = document.getElementById('fname')?.value.trim()    || '';
    const email   = document.getElementById('femail')?.value.trim()   || '';
    const subject = document.getElementById('fsubject')?.value.trim() || '';
    const message = document.getElementById('fmessage')?.value.trim() || '';

    if (!name || name.length < 2) { showError('Please enter your full name.'); return; }
    if (!email || !isValidEmail(email)) { showError('Please enter a valid email address.'); return; }
    if (!subject || subject.length < 3) { showError('Please enter a subject.'); return; }
    if (message.length < CONFIG.MIN_MESSAGE_LENGTH) {
      showError(`Message must be at least ${CONFIG.MIN_MESSAGE_LENGTH} characters.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(CONFIG.CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Server rejected the request.');

      areaEl.style.display = 'none';
      if (successEl) successEl.style.display = 'block';
    } catch (err) {
      // No backend is deployed yet, so this is the expected path today.
      // Fall back to opening a pre-filled email instead of failing silently.
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href =
        `mailto:${CONFIG.CONTACT_FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
      showError('Message service is unavailable right now — opening your email app instead. You can also call +91 94259 56060.');
    } finally {
      setLoading(false);
    }
  };

  const resetBtn = document.getElementById('formReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      areaEl.style.display = 'block';
      if (successEl) successEl.style.display = 'none';
      hideError();
    });
  }
})();

/* ============================================================
   7. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const statsSection = document.getElementById('stats');
  const nums = document.querySelectorAll('.stat-num');
  if (!statsSection || !nums.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const raw = el.textContent.trim();
    if (raw === 'Gold' || el.dataset.animated) return; // non-numeric, leave as-is
    el.dataset.animated = '1';

    const hasPlus = raw.includes('+');
    const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target)) return;

    if (prefersReduced) {
      el.textContent = target.toLocaleString() + (hasPlus ? '+' : '');
      return;
    }

    const duration = CONFIG.COUNTER_DURATION;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + (progress >= 1 && hasPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  if (!('IntersectionObserver' in window)) {
    nums.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();

/* ============================================================
   8. UTILITY
   ============================================================ */

/* Smooth scroll for plain #hash anchor links (nav uses these;
   footer/CTA links use inline scrollIntoView and are unaffected) */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 70, behavior: 'smooth' });
    }
  });
});

/* Footer year (index.html also sets #year inline; this covers
   either id so the script works even if that inline tag is removed) */
const yearTarget = document.getElementById('year') || document.getElementById('currentYear');
if (yearTarget) yearTarget.textContent = new Date().getFullYear();
