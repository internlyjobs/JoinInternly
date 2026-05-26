/* ════════════════════════════════════════════════
   internly — Engine v4.0 (Overhaul)
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
    const subtitle = document.querySelector('.hero-subtitle');
    const dualCta = document.querySelector('.hero-dual-cta');

    const els = [...lines];
    if (subtitle) els.push(subtitle);
    if (dualCta) els.push(dualCta);

    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      el.style.transition = `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.15 + 0.3}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.15 + 0.3}s`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        els.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* ── 3. ANIMATED COUNTERS ──────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('.counter-num[data-target]');
    if (!counters.length) return;

    let animated = false;

    function animateCounters() {
      if (animated) return;
      animated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          counter.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.counters-section');
    if (section) observer.observe(section);
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
    document.querySelectorAll('.btn-signup, .btn-login, .btn-white, .btn-ghost').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openModal();
      });
    });
  }

  /* ── 8. WAITLIST INLINE FORM ────────────────── */
  function initWaitlistForm() {
    const form = document.getElementById('waitlistInlineForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.waitlist-btn');
      const input = form.querySelector('.waitlist-input');
      if (btn) {
        btn.textContent = '✅ تم التسجيل!';
        btn.style.background = '#22c55e';
        btn.disabled = true;
      }
      if (input) {
        input.disabled = true;
        input.style.opacity = '0.5';
      }
      setTimeout(() => {
        if (btn) {
          btn.textContent = 'انضم دلوقتي';
          btn.style.background = '';
          btn.disabled = false;
        }
        if (input) {
          input.disabled = false;
          input.style.opacity = '';
          input.value = '';
        }
      }, 3000);
    });
  }

  /* ── 9. BACK TO TOP ─────────────────────────── */
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

  /* ── 10. SMOOTH ANCHORS ─────────────────────── */
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

  /* ── 11. AURORA PARALLAX ───────────────────── */
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

  /* ── 12. MEGA DROPDOWN NAV ────────────────── */
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

    document.addEventListener('click', (e) => {
      if (currentOpen && !currentOpen.contains(e.target)) {
        currentOpen.classList.remove('dropdown-active');
        const dd = currentOpen.querySelector('.mega-dropdown');
        if (dd) dd.classList.remove('active');
        currentOpen = null;
      }
    });
  }

  /* ── 13. SCROLL-TRIGGERED FEATURES ──────────── */
  function initScrollFeatures() {
    const tabs = document.querySelectorAll('.scroll-tab-item');
    const mockups = document.querySelectorAll('.scroll-mockup');
    if (!tabs.length || !mockups.length) return;

    function setActiveTab(targetName) {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetName));
      mockups.forEach(m => m.classList.toggle('active', m.dataset.tab === targetName));
    }

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
    initCounters();
    initFadeIn();
    initNav();
    initHamburger();
    initModal();
    initWaitlistForm();
    initBackToTop();
    initAnchors();
    initAuroraParallax();
    initMegaDropdown();
    initScrollFeatures();
  });
})();
