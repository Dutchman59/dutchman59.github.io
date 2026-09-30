/* ─────────────────────────────────────────────────────────────
   Portfolio Script
   Handles: navigation, scroll effects, reveal animations,
            active nav state, mobile menu, form validation,
            back-to-top button
───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── DOM REFERENCES ─────────────────────────────────────── */
  const header      = document.getElementById('site-header');
  const navToggle   = document.getElementById('nav-toggle');
  const navLinks    = document.getElementById('nav-links');
  const backToTop   = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const footerYear  = document.getElementById('footer-year');

  /* ── FOOTER YEAR ────────────────────────────────────────── */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ── MOBILE NAVIGATION ──────────────────────────────────── */
  function openMenu() {
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) closeMenu(); else openMenu();
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  /* Close menu when a nav link is clicked */
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* Close menu when clicking outside */
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ── SCROLL EFFECTS ─────────────────────────────────────── */
  var lastScrollY = 0;

  function onScroll() {
    var scrollY = window.scrollY;

    /* Header border on scroll */
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    /* Back-to-top button visibility */
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* run once on load */

  /* ── BACK TO TOP ────────────────────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ──────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-link[data-section]');

  function updateActiveNav() {
    var scrollY   = window.scrollY;
    var threshold = window.innerHeight * 0.4;
    var current   = '';

    sections.forEach(function (section) {
      var top = section.offsetTop - parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) - 20;
      if (scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── SCROLL REVEAL ANIMATIONS ───────────────────────────── */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything immediately */
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── SMOOTH SCROLLING FOR ANCHOR LINKS ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
        ) || 68;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ── CONTACT FORM VALIDATION & SUBMISSION ───────────────── */
  if (contactForm) {
    var fields = {
      name:    { el: document.getElementById('name'),    err: document.getElementById('name-error'),    min: 2 },
      email:   { el: document.getElementById('email'),   err: document.getElementById('email-error') },
      subject: { el: document.getElementById('subject'), err: document.getElementById('subject-error'), min: 3 },
      message: { el: document.getElementById('message'), err: document.getElementById('message-error'), min: 10 },
    };
    var submitBtn    = document.getElementById('form-submit');
    var successPanel = document.getElementById('form-success');

    function showError(field, msg) {
      field.el.classList.add('input-error');
      field.err.textContent = msg;
    }

    function clearError(field) {
      field.el.classList.remove('input-error');
      field.err.textContent = '';
    }

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateField(key) {
      var f = fields[key];
      var value = f.el.value.trim();

      if (!value) {
        var labels = { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message' };
        showError(f, labels[key] + ' is required.');
        return false;
      }

      if (key === 'email' && !validateEmail(value)) {
        showError(f, 'Please enter a valid email address.');
        return false;
      }

      if (f.min && value.length < f.min) {
        showError(f, 'Please enter at least ' + f.min + ' characters.');
        return false;
      }

      clearError(f);
      return true;
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('blur', function () {
        validateField(key);
      });
      fields[key].el.addEventListener('input', function () {
        if (fields[key].el.classList.contains('input-error')) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var valid = Object.keys(fields).map(validateField).every(Boolean);
      if (!valid) return;

      var btnText = submitBtn.querySelector('.btn-text');
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending…';
      if (successPanel) successPanel.textContent = '';

      try {
        var response = await fetch(contactForm.action, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: new FormData(contactForm)
        });

        var result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'Unable to send your message.');
        }

        if (successPanel) {
          successPanel.textContent = 'Message sent successfully. Thank you — I will get back to you soon.';
        }
        contactForm.reset();

        setTimeout(function () {
          if (successPanel) successPanel.textContent = '';
        }, 6000);
      } catch (error) {
        if (successPanel) {
          successPanel.textContent = 'Sorry, your message could not be sent. Please try again or use the email address shown above.';
        }
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send message';
      }
    });
  }

})();
