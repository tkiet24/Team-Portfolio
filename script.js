/* ===================================================
   OURPORTFOLIO — JAVASCRIPT
   SPA Routing, Animations, Interactions
   =================================================== */

(function () {
  'use strict';

  /* ── Constants ────────────────────────────────── */
  const PAGES = ['home', 'members', 'projects', 'about', 'contact', 'kiet', 'bao', 'quan'];
  const NAV_PAGES = ['home', 'members', 'projects', 'about', 'contact'];

  /* ── State ────────────────────────────────────── */
  let currentPage = 'home';

  /* ── Elements ─────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  /* ================================================
     NAVIGATION: SCROLLED CLASS
     ================================================ */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ================================================
     HAMBURGER MENU
     ================================================ */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });

  /* ================================================
     SPA ROUTING
     ================================================ */
  function navigateTo(pageName) {
    if (!PAGES.includes(pageName)) return;

    // Hide all pages
    PAGES.forEach(p => {
      const el = document.getElementById('page-' + p);
      if (el) el.classList.remove('active');
    });

    // Show target page
    const target = document.getElementById('page-' + pageName);
    if (target) {
      target.classList.add('active');
      currentPage = pageName;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update nav active state
    updateNavActive(pageName);

    // Close mobile menu
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');

    // Run page-specific init
    initPage(pageName);

    // Trigger fade-in animations for the new page
    setTimeout(() => runFadeIns(), 50);
  }

  function updateNavActive(pageName) {
    // Map profile pages back to "members" for nav highlighting
    const navPage = ['kiet', 'bao', 'quan'].includes(pageName) ? 'members' : pageName;

    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.classList.contains('nav-cta')) return; // skip CTA button for active class
      el.classList.remove('active');
    });

    const activeLink = document.querySelector('.nav-links a[data-page="' + navPage + '"]');
    if (activeLink) activeLink.classList.add('active');
  }

  /* ================================================
     EVENT DELEGATION: All data-page links
     ================================================ */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (!link) return;

    // Ignore if it's a real anchor with a real URL (not '#')
    const href = link.getAttribute('href');
    if (href && href !== '#' && !link.dataset.page) return;

    e.preventDefault();
    const page = link.dataset.page;
    if (page) navigateTo(page);
  });

  /* ================================================
     KEYBOARD ACCESSIBILITY: Member cards
     ================================================ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.member-card[data-page]');
      if (card) {
        e.preventDefault();
        navigateTo(card.dataset.page);
      }
    }
  });

  /* ================================================
     PAGE-SPECIFIC INITIALIZATION
     ================================================ */
  function initPage(pageName) {
    if (pageName === 'kiet' || pageName === 'bao' || pageName === 'quan') {
      setTimeout(() => animateSkillBars(pageName), 300);
    }
    if (pageName === 'projects') {
      initProjectFilter();
    }
    if (pageName === 'contact') {
      initContactForm();
    }
  }

  /* ================================================
     SKILL BAR ANIMATIONS
     ================================================ */
  function animateSkillBars(profileId) {
    const page = document.getElementById('page-' + profileId);
    if (!page) return;

    const fills = page.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
      const target = parseInt(fill.dataset.width, 10);
      fill.style.width = target + '%';
    });
  }

  /* ================================================
     PROJECT FILTER
     ================================================ */
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            // Slight pop animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            }, 30);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ================================================
     CONTACT FORM
     ================================================ */
  function initContactForm() {
    const form       = document.getElementById('contactForm');
    const formContent = document.getElementById('formContent');
    const formSuccess = document.getElementById('formSuccess');
    const resetBtn   = document.getElementById('resetFormBtn');
    const submitBtn  = document.getElementById('submitBtn');

    if (!form) return;

    // Remove old listeners by cloning
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    const freshForm = document.getElementById('contactForm');
    const freshSubmitBtn = freshForm.querySelector('#submitBtn') || freshForm.querySelector('button[type="submit"]');

    freshForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = freshForm.querySelector('#email');
      const nameInput  = freshForm.querySelector('#fname');
      const msgInput   = freshForm.querySelector('#message');

      // Simple validation with visual feedback
      let valid = true;

      [nameInput, emailInput, msgInput].forEach(input => {
        if (input && !input.value.trim()) {
          input.style.borderColor = '#e879a0';
          input.style.boxShadow = '0 0 0 3px rgba(232,121,160,0.15)';
          valid = false;
          setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
          }, 2500);
        }
      });

      if (!valid) return;

      // Simulate sending
      if (freshSubmitBtn) {
        freshSubmitBtn.textContent = 'Sending...';
        freshSubmitBtn.disabled = true;
      }

      setTimeout(() => {
        if (formContent) formContent.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }, 1200);
    });

    // Reset form
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (formContent) formContent.style.display = '';
        if (formSuccess) formSuccess.classList.remove('show');
        if (freshForm) freshForm.reset();
        const sb = document.getElementById('submitBtn');
        if (sb) { sb.textContent = 'Send Message ✉️'; sb.disabled = false; }
      });
    }
  }

  /* ================================================
     INTERSECTION OBSERVER — FADE IN ANIMATIONS
     ================================================ */
  function runFadeIns() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;

    const elements = activePage.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => {
      el.classList.remove('visible');
      observer.observe(el);
    });
  }

  /* ================================================
     MICRO-INTERACTION: Cursor glow on hero cards
     ================================================ */
  function initCardGlowEffect() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.page.active .member-card, .page.active .value-card, .page.active .project-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  /* ================================================
     MICRO-INTERACTION: Animated number counter
     ================================================ */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const text = counter.textContent;
      const numMatch = text.match(/\d+/);
      if (!numMatch) return;

      const target = parseInt(numMatch[0], 10);
      const suffix = text.replace(/\d+/, '');
      let current = 0;
      const duration = 1500;
      const step = target / (duration / 16);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        counter.textContent = Math.floor(current) + suffix;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        }
      }, 16);
    });
  }

  /* ================================================
     MICRO-INTERACTION: Typing effect for hero title
     ================================================ */
  function initTypingEffect() {
    const gradText = document.querySelector('.hero-title .gradient-text');
    if (!gradText) return;

    const text = 'Digital Products';
    gradText.textContent = '';
    let i = 0;

    const type = () => {
      if (i < text.length) {
        gradText.textContent += text[i];
        i++;
        setTimeout(type, 65);
      }
    };

    setTimeout(type, 800);
  }

  /* ================================================
     SMOOTH HERO CARD PARALLAX
     ================================================ */
  function initParallax() {
    const stack = document.querySelector('.hero-card-stack');
    if (!stack) return;

    document.addEventListener('mousemove', (e) => {
      if (currentPage !== 'home') return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      stack.style.transform = `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      if (stack) stack.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ================================================
     INIT
     ================================================ */
  function init() {
    // Initial page load
    navigateTo('home');

    // Run animations
    setTimeout(() => {
      runFadeIns();
      animateCounters();
      initTypingEffect();
    }, 100);

    initParallax();
    initCardGlowEffect();

    // Re-animate counters when visiting home
    document.querySelector('[data-page="home"]')?.addEventListener('click', () => {
      setTimeout(animateCounters, 300);
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
