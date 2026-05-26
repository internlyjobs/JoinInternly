/* ════════════════════════════════════════════════
   Internly — Handshake-Style Engine v3.0
   ════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. LOADING SCREEN ──────────────────────── */
  function initLoader() {
    const loader = document.querySelector('.loader-screen');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loaded');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        setTimeout(() => { if (loader.parentNode) loader.remove(); }, 1500);
      }, 400);
    });
  }

  /* ── 2. HERO REVEAL ─────────────────────────── */
  function initHeroReveal() {
    const lines = document.querySelectorAll('.hero-line');
    const statLines = document.querySelectorAll('.hero-stat-line');
    const search = document.querySelector('.hero-search');
    const sugLabel = document.querySelector('.suggestions-label');
    const chips = document.querySelectorAll('.chip-btn');

    // Title lines — staggered reveal
    lines.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.12 + 0.2}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.12 + 0.2}s`;
    });

    // Stat lines
    statLines.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = `opacity 0.6s ease ${i * 0.12 + 0.5}s, transform 0.6s ease ${i * 0.12 + 0.5}s`;
    });

    // Search
    if (search) {
      search.style.opacity = '0';
      search.style.transform = 'translateY(10px)';
      search.style.transition = 'opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s';
    }

    // Suggestion label
    if (sugLabel) {
      sugLabel.style.opacity = '0';
      sugLabel.style.transform = 'translateY(10px)';
      sugLabel.style.transition = 'opacity 0.5s ease 0.9s, transform 0.5s ease 0.9s';
    }

    // Chips
    chips.forEach((chip, i) => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(10px)';
      chip.style.transition = `opacity 0.4s ease ${i * 0.06 + 0.95}s, transform 0.4s ease ${i * 0.06 + 0.95}s`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        [...lines, ...statLines, search, sugLabel, ...chips].filter(Boolean).forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* ── 3. TYPING ANIMATION ────────────────────── */
  function initTyping() {
    const input = document.getElementById('heroSearchInput');
    if (!input) return;

    const phrases = [
      'تدريب في مجال الذكاء الاصطناعي...',
      'Entry-level AI training jobs using Python',
      'فرص تدريب صيفي في البنوك...',
      'Remote data labeling internship...',
      'تسويق رقمي — عمل عن بُعد...',
      'AI Trainer — no experience required...',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
      if (document.activeElement === input) {
        setTimeout(type, 500);
        return;
      }

      const current = phrases[phraseIndex];

      if (isDeleting) {
        currentText = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = current.substring(0, charIndex + 1);
        charIndex++;
      }

      input.setAttribute('placeholder', currentText);

      let delay = isDeleting ? 25 : 50;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      setTimeout(type, delay);
    }

    setTimeout(type, 1200);
  }

  /* ── 4. SCROLL FADE-IN ──────────────────────── */
  function initFadeIn() {
    const items = document.querySelectorAll('.fade-in');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ── 5. NAV SCROLL ──────────────────────────── */
  function initNav() {
    const nav = document.querySelector('.pill-nav');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 6. HAMBURGER ───────────────────────────── */
  function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  /* ── 7. MODAL ───────────────────────────────── */
  function initModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;

    const form = document.getElementById('waitlistForm');
    const successPanel = overlay.querySelector('.modal-success');

    window.openModal = function () {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (form) {
          form.style.display = '';
          form.style.opacity = '';
          form.style.transform = '';
          form.reset();
        }
        if (successPanel) {
          successPanel.style.display = 'none';
          successPanel.classList.remove('active');
        }
      }, 400);
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) window.closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        window.closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.style.opacity = '0';
        form.style.transform = 'translateY(-10px)';
        form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
          form.style.display = 'none';
          if (successPanel) {
            successPanel.style.display = 'flex';
            void successPanel.offsetWidth;
            successPanel.classList.add('active');
          }
        }, 300);
      });
    }

    // Wire up all CTA buttons to open modal
    document.querySelectorAll('.btn-signup, .btn-login, .btn-white, .btn-ghost, .feature-card-link').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openModal();
      });
    });

    // Chip buttons fill search input
    document.querySelectorAll('.chip-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.getElementById('heroSearchInput');
        if (input) {
          input.value = btn.textContent;
          input.focus();
        }
      });
    });
  }

  /* ── 8. BACK TO TOP ─────────────────────────── */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 500) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 9. SMOOTH ANCHORS ──────────────────────── */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = id ? document.getElementById(id) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── 10. AURORA PARALLAX ────────────────────── */
  function initAuroraParallax() {
    const aurora = document.querySelector('.aurora-glow');
    if (!aurora) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight * 1.5) {
            aurora.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 11. MEGA DROPDOWN NAV ────────────────────── */
  function initMegaDropdown() {
    const dropdownItems = document.querySelectorAll('[data-dropdown]');
    if (!dropdownItems.length) return;

    let closeTimeout = null;
    let currentOpen = null;

    function openDropdown(li) {
      if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
      if (currentOpen && currentOpen !== li) {
        currentOpen.classList.remove('dropdown-active');
        const prevDD = currentOpen.querySelector('.mega-dropdown');
        if (prevDD) prevDD.classList.remove('active');
      }
      li.classList.add('dropdown-active');
      const dd = li.querySelector('.mega-dropdown');
      if (dd) dd.classList.add('active');
      currentOpen = li;
    }

    function scheduleClose() {
      closeTimeout = setTimeout(() => {
        if (currentOpen) {
          currentOpen.classList.remove('dropdown-active');
          const dd = currentOpen.querySelector('.mega-dropdown');
          if (dd) dd.classList.remove('active');
          currentOpen = null;
        }
      }, 250);
    }

    dropdownItems.forEach(li => {
      li.addEventListener('mouseenter', () => openDropdown(li));
      li.addEventListener('mouseleave', () => scheduleClose());

      const dd = li.querySelector('.mega-dropdown');
      if (dd) {
        dd.addEventListener('mouseenter', () => {
          if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
        });
        dd.addEventListener('mouseleave', () => scheduleClose());
      }
    });

    // Click outside closes dropdown
    document.addEventListener('click', (e) => {
      if (currentOpen && !currentOpen.contains(e.target)) {
        currentOpen.classList.remove('dropdown-active');
        const dd = currentOpen.querySelector('.mega-dropdown');
        if (dd) dd.classList.remove('active');
        currentOpen = null;
      }
    });
  }

  /* ── 12. SCROLL-TRIGGERED FEATURES ─────────────── */
  function initScrollFeatures() {
    const tabs = document.querySelectorAll('.scroll-tab-item');
    const mockups = document.querySelectorAll('.scroll-mockup');
    if (!tabs.length || !mockups.length) return;

    function setActiveTab(targetName) {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetName));
      mockups.forEach(m => m.classList.toggle('active', m.dataset.tab === targetName));
    }

    // IntersectionObserver to detect which tab is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveTab(entry.target.dataset.target);
          }
        });
      },
      { threshold: [0.5], rootMargin: '-20% 0px -20% 0px' }
    );

    tabs.forEach(tab => observer.observe(tab));

    // Also allow clicking tabs
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        setActiveTab(tab.dataset.target);
        tab.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  /* ── BOOT ───────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initHeroReveal();
    initTyping();
    initFadeIn();
    initNav();
    initHamburger();
    initModal();
    initBackToTop();
    initAnchors();
    initAuroraParallax();
    initMegaDropdown();
    initScrollFeatures();
  });
})();
