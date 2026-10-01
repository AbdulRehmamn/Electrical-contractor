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

  /* ---- Form Submission Handlers ---- */
  // 1. Lead gen quote forms on service pages
  var leadGenForms = document.querySelectorAll('.lead-gen-form');
  leadGenForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var origText = btn.textContent;
        btn.textContent = 'Request Received - Calling You Shortly';
        btn.disabled = true;
        btn.style.backgroundColor = '#059669';
        btn.style.borderColor = '#059669';

        setTimeout(function () {
          form.reset();
          btn.textContent = origText;
          btn.disabled = false;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
        }, 4000);
      }
    });
  });

  // 2. Contact page form
  var contactForm = document.getElementById('form') || document.getElementById('contactForm');
  var contactAlert = document.getElementById('contactAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        var origText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        setTimeout(function () {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = origText || 'Send Message';
          if (contactAlert) {
            contactAlert.className = 'form-status-alert success';
            contactAlert.textContent = 'Thank you for contacting Duarte Electrical Services. Your message has been sent, and an experienced team member will reach out promptly.';
            setTimeout(function () {
              contactAlert.className = 'form-status-alert';
              contactAlert.textContent = '';
            }, 6000);
          }
        }, 1000);
      }
    });
  }

});
