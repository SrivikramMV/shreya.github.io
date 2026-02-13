/* ============================================================
   Personal Website - Scripts
   Handles: theme switching, scroll-based fade-in, smooth nav, ask-box interaction
   ============================================================ */

(function () {
  'use strict';

  // --- Theme switcher (pink / cream / dark) ---
  var THEME_STORAGE_KEY = 'sc_theme_preference';
  var VALID_THEMES = ['pink', 'cream', 'dark'];

  function normalizeTheme(theme) {
    return VALID_THEMES.indexOf(theme) >= 0 ? theme : 'cream';
  }

  function applyTheme(theme) {
    var resolvedTheme = normalizeTheme(theme);
    document.documentElement.setAttribute('data-theme', resolvedTheme);

    document.querySelectorAll('[data-theme-option]').forEach(function (button) {
      var isActive = button.getAttribute('data-theme-option') === resolvedTheme;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  var storedTheme = '';
  try {
    storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || '';
  } catch (e) {
    storedTheme = '';
  }

  applyTheme(storedTheme);

  document.querySelectorAll('[data-theme-option]').forEach(function (button) {
    button.addEventListener('click', function () {
      var selectedTheme = this.getAttribute('data-theme-option');
      applyTheme(selectedTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, normalizeTheme(selectedTheme));
      } catch (e) {
        // Ignore storage errors in restricted environments.
      }
    });
  });

  // --- Intersection Observer for fade-in animations ---
  var fadeEls = document.querySelectorAll('.fade-in');

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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Smooth scroll for in-page nav links ---
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- "Ask a question" box ---
  var askForm = document.getElementById('ask-form');
  var askInput = document.getElementById('ask-input');
  var askResponse = document.getElementById('ask-response');

  if (askForm) {
    askForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var question = askInput.value.trim();
      if (!question) return;

      // Check honeypot field - if filled, silently ignore (anti-spam)
      var honeypot = askForm.querySelector('.hp-field');
      if (honeypot && honeypot.value) {
        askInput.value = '';
        return;
      }

      askResponse.textContent =
        "Thanks for your question. This feature is coming soon and will answer questions about Shreya's experience and projects.";
      askResponse.classList.add('visible');

      askInput.value = '';

      // Auto-hide after 6 seconds
      setTimeout(function () {
        askResponse.classList.remove('visible');
      }, 6000);
    });
  }
})();