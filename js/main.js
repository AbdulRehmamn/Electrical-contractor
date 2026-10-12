/* ============================================================
   PRISTINE POWER ELECTRIC — Main JavaScript
   Robust, clean, responsive interactions without gimmick animations
   Includes Theme Toggle (Light / Dark Mode) with LocalStorage
   and Clean Root URL Navigation (keeps https://duarteelectric.com)
   ============================================================ */

// Immediate execution to prevent flash of wrong theme and strip .html from URL bar
(function () {
  try {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  } catch (e) {}

  try {
    if (window.location.protocol !== 'file:') {
      var path = window.location.pathname;
      var file = path.split('/').pop() || 'index.html';
      if (!window.__DUARTE_INITIAL_PAGE__) {
        window.__DUARTE_INITIAL_PAGE__ = file;
      }
      var cleanBase = path.replace(/[^/]*$/, '') || '/';
      window.__DUARTE_BASE_PATH__ = cleanBase;
      if (path !== cleanBase) {
        window.history.replaceState({ page: window.__DUARTE_INITIAL_PAGE__ }, '', cleanBase);
      } else if (!window.history.state || !window.history.state.page) {
        window.history.replaceState({ page: window.__DUARTE_INITIAL_PAGE__ }, '', cleanBase);
      }
    }
  } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var cleanBasePath = window.__DUARTE_BASE_PATH__ || (window.location.pathname.replace(/[^/]*$/, '') || '/');
  var currentPage = window.__DUARTE_INITIAL_PAGE__ || window.location.pathname.split('/').pop() || 'index.html';

  var servicePages = [
    'electrical-panels.html',
    'ev-charger.html',
    'electrical-repairs.html',
    'electrical-review.html',
    'emergency-services.html'
  ];

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
  var mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
  var mobileSubMenu = document.querySelector('.mobile-sub-menu');

  function closeMobileMenu() {
    if (hamburger && mobileNav) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    }
    if (mobileSubMenu) {
      mobileSubMenu.classList.remove('open');
    }
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close mobile nav when clicking any link
    var mobileLinks = mobileNav.querySelectorAll('a:not(.mobile-dropdown-toggle)');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });
  }

  // Mobile submenu accordion
  if (mobileDropdownToggle && mobileSubMenu) {
    mobileDropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      mobileSubMenu.classList.toggle('open');
    });
  }

  /* ---- Active Link Highlighting ---- */
  function updateActiveNav(pageName) {
    var target = pageName || 'index.html';
    var navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav a');

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (link.classList.contains('dropdown-trigger')) {
        return;
      }
      if (href === target || (target === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Highlight parent dropdown if active page is a service page
    var dropdownParent = document.querySelector('.nav-item-dropdown .dropdown-trigger');
    if (dropdownParent) {
      if (servicePages.indexOf(target) !== -1) {
        dropdownParent.classList.add('active');
      } else {
        dropdownParent.classList.remove('active');
      }
    }
  }

  /* ---- Interactive Accordion Components ---- */
  function initAccordions(root) {
    var container = root || document;
    var accordionItems = container.querySelectorAll('.accordion-item');

    accordionItems.forEach(function (item) {
      var header = item.querySelector('.accordion-header');
      if (header && !header.dataset.boundAccordion) {
        header.dataset.boundAccordion = 'true';
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
  }

  /* ---- Service Strip Horizontal Carousel Buttons ---- */
  function initCarousel() {
    var prevBtn = document.getElementById('stripPrev');
    var nextBtn = document.getElementById('stripNext');
    var track = document.getElementById('servicesTrack');

    if (track) {
      if (prevBtn && !prevBtn.dataset.boundCarousel) {
        prevBtn.dataset.boundCarousel = 'true';
        prevBtn.addEventListener('click', function () {
          track.scrollBy({ left: -280, behavior: 'smooth' });
        });
      }
      if (nextBtn && !nextBtn.dataset.boundCarousel) {
        nextBtn.dataset.boundCarousel = 'true';
        nextBtn.addEventListener('click', function () {
          track.scrollBy({ left: 280, behavior: 'smooth' });
        });
      }
    }
  }

  /* ---- Lead Gen & Contact Forms ---- */
  /* All forms use the one inbox-linked key in form-config.js. */
  function initForms(root) {
    var container = root || document;
    container.querySelectorAll('.lead-gen-form, #form').forEach(function (form) {
      if (form.dataset.boundForm) return;
      form.dataset.boundForm = 'true';

      const button = form.querySelector('button[type="submit"]');
      const config = window.DUARTE_FORMS || { accessKey: '63d28524-20d9-4808-bb59-24710c9fc651' };
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
        data.set('source_page', window.location.origin + cleanBasePath + (currentPage === 'index.html' ? '' : currentPage));
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
  }

  function initPageComponents(pageName) {
    updateActiveNav(pageName);
    initAccordions(document);
    initCarousel();
    initForms(document);
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

  /* ---- Clean Root URL Client-Side Router ---- */
  var navAbortController = null;

  async function loadPageContent(targetPage, pushHistory) {
    if (navAbortController) {
      navAbortController.abort();
    }
    navAbortController = new AbortController();

    try {
      var response = await fetch(targetPage, {
        signal: navAbortController.signal,
        headers: { 'Accept': 'text/html' }
      });
      if (!response.ok) throw new Error('Page fetch failed');

      var htmlText = await response.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(htmlText, 'text/html');

      var newMain = doc.querySelector('main.site-wrapper');
      var currentMain = document.querySelector('main.site-wrapper');
      if (!newMain || !currentMain) throw new Error('Missing main wrapper');

      if (doc.title) {
        document.title = doc.title;
      }

      var newMetaDesc = doc.querySelector('meta[name="description"]');
      var currentMetaDesc = document.querySelector('meta[name="description"]');
      if (newMetaDesc && currentMetaDesc) {
        currentMetaDesc.setAttribute('content', newMetaDesc.getAttribute('content') || '');
      }

      currentMain.innerHTML = newMain.innerHTML;
      currentPage = targetPage;

      if (window.location.protocol !== 'file:') {
        try {
          if (pushHistory) {
            window.history.pushState({ page: targetPage }, '', cleanBasePath);
          } else {
            window.history.replaceState({ page: targetPage }, '', cleanBasePath);
          }
        } catch (e) {}
      }

      closeMobileMenu();
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      initPageComponents(targetPage);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      // Fallback to standard navigation if fetch is unavailable (e.g., local file://)
      window.location.href = targetPage;
    }
  }

  // Intercept clicks on internal .html links to keep URL at root (https://duarteelectric.com)
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    if (window.location.protocol === 'file:') {
      return;
    }

    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0 || href.indexOf('#') === 0) {
      return;
    }
    if (link.target && link.target !== '_self') {
      return;
    }

    // Match internal .html pages (e.g., about.html, contact.html, index.html)
    if (/^[a-zA-Z0-9_-]+\.html$/.test(href)) {
      e.preventDefault();
      if (href === currentPage) {
        closeMobileMenu();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }
      loadPageContent(href, true);
    }
  });

  // Handle browser Back / Forward buttons while keeping clean root URL
  window.addEventListener('popstate', function (e) {
    if (window.location.protocol === 'file:') return;
    var targetPage = (e.state && e.state.page) ? e.state.page : 'index.html';
    try {
      if (window.location.pathname !== cleanBasePath) {
        window.history.replaceState({ page: targetPage }, '', cleanBasePath);
      }
    } catch (err) {}
    if (targetPage !== currentPage) {
      loadPageContent(targetPage, false);
    }
  });

  // Initialize current page components
  initPageComponents(currentPage);

  // If the user refreshed the browser at "/" while viewing a subpage stored in history.state, restore that page
  if (
    window.location.protocol !== 'file:' &&
    currentPage === 'index.html' &&
    window.history.state &&
    window.history.state.page &&
    window.history.state.page !== 'index.html'
  ) {
    loadPageContent(window.history.state.page, false);
  }
});
