/**
 * main.js — Baba Satyanarayan Mourya Official Website
 *
 * Sections:
 *  1. Navigation (scroll effect, hamburger, active link)
 *  2. Scroll-to-top button
 *  3. Scroll reveal animations
 *  4. Contact form (validation + honeypot + submit)
 *  5. Animated counters
 *  6. Utility helpers
 *
 * Edit content in: ../index.html (all text, links, images)
 * Edit API URL in: CONTACT_API_URL below
 */

'use strict';

/* ============================================================
   CONFIG — Edit these values
   ============================================================ */
const CONFIG = {
  // Change this to your server's URL when deployed
  // e.g. 'https://yourdomain.com/api/contact'
  CONTACT_API_URL: '/api/contact',

  // Minimum characters in message
  MIN_MESSAGE_LENGTH: 20,

  // Scroll reveal threshold (0 = as soon as any pixel visible)
  REVEAL_THRESHOLD: 0.12,

  // Counter animation duration in ms
  COUNTER_DURATION: 1800,
};

/* ============================================================
   1. NAVIGATION
   ============================================================ */
(function initNav() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks   = document.querySelectorAll('.navbar__links a, .navbar__mobile a[data-section]');
  const sections   = document.querySelectorAll('section[id]');

  if (!navbar) return;

  /* Scroll: add .scrolled class */
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }

  /* Active nav link based on scroll position */
  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.id;
      }
    });

    document.querySelectorAll('.navbar__links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Hamburger toggle */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close mobile menu when a link is clicked */
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();

/* ============================================================
   2. SCROLL TO TOP
   ============================================================ */
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   3. SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right');
  if (!elements.length) return;

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    // Fallback for old browsers
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: CONFIG.REVEAL_THRESHOLD,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. CONTACT FORM
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  const formWrap    = document.getElementById('contactFormWrap');
  const successEl   = document.getElementById('formSuccess');
  const errorEl     = document.getElementById('formError');
  const submitBtn   = document.getElementById('formSubmit');

  if (!form) return;

  /* Simple email regex */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  /* Show error */
  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  /* Hide error */
  function hideError() {
    if (!errorEl) return;
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }

  /* Set button loading state */
  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Sending...' : '📤 Send Message';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideError();

    const name      = document.getElementById('f-name')?.value.trim()    || '';
    const email     = document.getElementById('f-email')?.value.trim()   || '';
    const phone     = document.getElementById('f-phone')?.value.trim()   || '';
    const eventType = document.getElementById('f-type')?.value           || '';
    const subject   = document.getElementById('f-subject')?.value.trim() || '';
    const message   = document.getElementById('f-message')?.value.trim() || '';
    const honey     = document.getElementById('f-honey')?.value          || '';

    /* Honeypot check — if filled, silently pretend success */
    if (honey) {
      if (formWrap) formWrap.style.display = 'none';
      if (successEl) successEl.style.display = 'block';
      return;
    }

    /* Validation */
    if (!name) { showError('Please enter your full name.'); return; }
    if (!email || !isValidEmail(email)) { showError('Please enter a valid email address.'); return; }
    if (!subject) { showError('Please enter a subject.'); return; }
    if (message.length < CONFIG.MIN_MESSAGE_LENGTH) {
      showError(`Message must be at least ${CONFIG.MIN_MESSAGE_LENGTH} characters.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(CONFIG.CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, eventType, subject, message })
      });

      const data = await res.json();

      if (data.success) {
        if (formWrap) formWrap.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
        form.reset();
      } else {
        showError(data.error || 'Something went wrong. Please try again or call us directly.');
      }
    } catch (err) {
      // Network error fallback
      showError('Unable to send message. Please call +91 94259 56060 directly.');
    } finally {
      setLoading(false);
    }
  });

  /* Reset form (try again button) */
  const resetBtn = document.getElementById('formReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (formWrap) formWrap.style.display = 'block';
      if (successEl) successEl.style.display = 'none';
      hideError();
    });
  }
})();

/* ============================================================
   5. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = CONFIG.COUNTER_DURATION;
    const start    = performance.now();

    if (prefersReduced || isNaN(target)) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. UTILITY
   ============================================================ */

/* Smooth scroll for all anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 70, behavior: 'smooth' });
    }
  });
});

/* Lazy-load images (browser-native, JS fallback) */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading is supported, do nothing
} else {
  // Fallback: IntersectionObserver for older browsers
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (lazyImages.length && 'IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  }
}

/* Current year in footer */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
