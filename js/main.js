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

  /* ---- Form Submission Handlers (Web3Forms Integration) ---- */
  // 1. Lead gen quote forms on service pages
  var leadGenForms = document.querySelectorAll('.lead-gen-form');
  leadGenForms.forEach(function (serviceForm) {
    serviceForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var submitBtn = serviceForm.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : 'Request a Quote';

      var formData = new FormData(serviceForm);
      var object = Object.fromEntries(formData.entries());
      object.access_key = "63d28524-20d9-4808-bb59-24710c9fc651".trim();
      object.from_name = "Duarte Electrical Services INC";
      if (!object.subject) {
        object.subject = "New Quote Request - Duarte Electrical Services";
      }

      if (submitBtn) {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
      }

      try {
        var response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(object)
        });

        var data = await response.json();

        if (response.ok && data.success) {
          alert("Success! Your message has been sent to Duarte Electrical Services.");
          serviceForm.reset();
        } else {
          alert("Error: " + (data.message || "Failed to submit. Please try again or call (619) 805-6267."));
        }
      } catch (error) {
        alert("Something went wrong submitting your request. Please call (619) 805-6267 directly.");
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  });

  // 2. Contact page form (id="form")
  var contactForm = document.getElementById('form');
  if (contactForm) {
    var contactSubmitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var formData = new FormData(contactForm);
      var object = Object.fromEntries(formData.entries());
      object.access_key = "63d28524-20d9-4808-bb59-24710c9fc651".trim();
      object.from_name = "Duarte Electrical Services INC";
      if (!object.subject) {
        object.subject = "New Contact Inquiry - Duarte Electrical Services";
      }

      var originalText = contactSubmitBtn ? contactSubmitBtn.textContent : 'Send Message';

      if (contactSubmitBtn) {
        contactSubmitBtn.textContent = "Sending...";
        contactSubmitBtn.disabled = true;
      }

      try {
        var response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(object)
        });

        var data = await response.json();

        if (response.ok && data.success) {
          alert("Success! Your message has been sent to Duarte Electrical Services.");
          contactForm.reset();
        } else {
          alert("Error: " + (data.message || "Failed to submit. Please try again or call (619) 805-6267."));
        }
      } catch (error) {
        alert("Something went wrong submitting your request. Please call (619) 805-6267 directly.");
      } finally {
        if (contactSubmitBtn) {
          contactSubmitBtn.textContent = originalText;
          contactSubmitBtn.disabled = false;
        }
      }
    });
  }

});
