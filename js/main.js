/* ============================================================
   PRISTINE POWER ELECTRIC — Main JavaScript
   Robust, clean, responsive interactions without gimmick animations
   Includes Theme Toggle (Light / Dark Mode) with LocalStorage
   ============================================================ */

// Immediate execution to prevent flash of wrong theme
(function () {
  try {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ---- Theme Toggle (Light / Dark Mode) ---- */
  var themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark-mode');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    }
  }

  themeToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isDark = document.documentElement.classList.contains('dark-mode');
      setTheme(!isDark);
    });
  });

  /* ---- Mobile Menu Navigation ---- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close mobile nav when clicking any link
    var mobileLinks = mobileNav.querySelectorAll('a:not(.mobile-dropdown-toggle)');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // Mobile submenu accordion
  var mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
  var mobileSubMenu = document.querySelector('.mobile-sub-menu');

  if (mobileDropdownToggle && mobileSubMenu) {
    mobileDropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      mobileSubMenu.classList.toggle('open');
    });
  }

  /* ---- Active Link Highlighting ---- */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav a');

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Highlight parent dropdown if active page is a service page
  var servicePages = [
    'electrical-panels.html',
    'ev-charger.html',
    'electrical-repairs.html',
    'electrical-review.html',
    'emergency-services.html'
  ];

  if (servicePages.indexOf(currentPath) !== -1) {
    var dropdownParent = document.querySelector('.nav-item-dropdown .dropdown-trigger');
    if (dropdownParent) {
      dropdownParent.classList.add('active');
    }
  }

  /* ---- Interactive Accordion Components ---- */
  var accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close other items in the same container
        var parentWrapper = item.closest('.accordion-wrapper');
        if (parentWrapper) {
          var siblings = parentWrapper.querySelectorAll('.accordion-item');
          siblings.forEach(function (sib) {
            if (sib !== item) {
              sib.classList.remove('open');
            }
          });
        }

        // Toggle clicked item
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });

  /* ---- Service Strip Horizontal Carousel Buttons ---- */
  var prevBtn = document.getElementById('stripPrev');
  var nextBtn = document.getElementById('stripNext');
  var track = document.getElementById('servicesTrack');

  if (track) {
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -280, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: 280, behavior: 'smooth' });
      });
    }
  }

  /* ---- Navbar Scroll Shadow ---- */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* All forms use the one inbox-linked key in form-config.js. */
  document.querySelectorAll('.lead-gen-form, #form').forEach(function (form) {
    const button = form.querySelector('button[type="submit"]');
    const config = window.DUARTE_FORMS || {};
    const key = (config.accessKey || '').trim();
    const ready = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);
    if (!ready) {
      status.textContent = 'Online requests are temporarily unavailable. Please email Martin@duarteelectric.com or call (619) 805-6267.';
      return;
    }
    if (button) button.disabled = false;
    let busy = false;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      busy = true;
      const original = button ? button.textContent : '';
      const data = new FormData(form);
      ['to_email', 'email_to', 'recipient', 'ccemail', 'bcc', 'bccemail', 'redirect', 'webhook'].forEach(name => data.delete(name));
      data.set('access_key', key);
      data.set('from_name', 'Duarte Electrical Services INC');
      data.set('source_page', window.location.origin + window.location.pathname);
      if (!data.get('subject')) data.set('subject', 'New Website Inquiry - Duarte Electrical Services');
      if (data.get('email')) data.set('replyto', data.get('email'));
      if (button) { button.disabled = true; button.textContent = 'Sending...'; }
      status.textContent = 'Sending your request...';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', body: data, signal: controller.signal,
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Submission rejected');
        status.textContent = 'Thank you! Your request has been submitted successfully.';
        form.reset();
      } catch (error) {
        status.textContent = error.name === 'AbortError'
          ? 'Delivery could not be confirmed. Please contact Martin@duarteelectric.com before resubmitting.'
          : 'Your request could not be confirmed. Please try again or email Martin@duarteelectric.com.';
      } finally {
        clearTimeout(timer);
        busy = false;
        if (button) { button.disabled = false; button.textContent = original; }
      }
    });
  });
});
