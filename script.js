// Navigation toggle and smooth scrolling

/**
 * Toggle the mobile hamburger menu open/close.
 * Updates aria-expanded attribute for accessibility.
 */
function toggleMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
  navLinks.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
}

/**
 * Close the mobile menu (e.g., when a nav link is clicked).
 */
function closeMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  navLinks.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
}

/**
 * Smooth scroll to a target section by ID.
 * Fails silently if the element is not found.
 */
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth' });
}

// Attach event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Hamburger button click
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Nav link clicks — smooth scroll and close menu
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
      }
      closeMobileMenu();
    });
  });

  // CTA button smooth scroll (in-page links only; external links open normally)
  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href.substring(1));
      }
    });
  });

  // Close the mobile menu with the Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // Contact form submit listener
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  // Clear error messages when user starts typing in a field
  var formFields = document.querySelectorAll('#contact-form input, #contact-form textarea');
  formFields.forEach(function (field) {
    field.addEventListener('input', function () {
      var errorDiv = field.parentElement.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.textContent = '';
      }
    });
  });

  // Update copyright year
  const yearSpan = document.querySelector('.copyright-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Keep experience figures current (career start: April 2025)
  var experienceMonths = getMonthsSince(CAREER_START, new Date());
  var monthsCounter = document.querySelector('.experience-months');
  if (monthsCounter) {
    monthsCounter.dataset.target = experienceMonths;
  }
  var durationText = document.querySelector('.experience-duration');
  if (durationText) {
    durationText.textContent = formatDuration(experienceMonths);
  }

  // Initialize scroll animations
  initScrollAnimations();

  // Nav scroll effect
  window.addEventListener('scroll', function () {
    var nav = document.querySelector('nav');
    if (nav) {
      var isMobile = window.innerWidth < 768;
      if (window.scrollY > 50) {
        nav.style.padding = isMobile ? '0.5rem 1rem' : '0.75rem 2rem';
      } else {
        nav.style.padding = isMobile ? '0.75rem 1rem' : '1rem 2rem';
      }
    }
  });

  // Animated counters (skipped when the visitor prefers reduced motion)
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;
      var target = parseInt(counter.dataset.target, 10);
      if (prefersReducedMotion || isNaN(target)) {
        if (!isNaN(target)) counter.textContent = target;
        counter.dataset.animated = 'true';
        return;
      }
      var duration = 1500;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
          counter.dataset.animated = 'true';
        }
      }
      requestAnimationFrame(step);
    });
  }

  // Animate the About stats when they scroll into view
  if (typeof IntersectionObserver !== 'undefined') {
    var aboutSection = document.getElementById('about');
    var featureObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) animateCounters();
      });
    }, { threshold: 0.3 });
    if (aboutSection) featureObserver.observe(aboutSection);
  }

  // Back to top button
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active nav link highlight on scroll
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active-link');
          if (a.getAttribute('href') === '#' + section.id) {
            a.classList.add('active-link');
          }
        });
      }
    });
  });
});

var CAREER_START = { year: 2025, month: 4 }; // April 2025, 1-based month

/**
 * Whole calendar months elapsed from a {year, month} start (1-based month)
 * to the given date, e.g. Apr 2025 -> Nov 2026 = 19. Never negative.
 */
function getMonthsSince(start, now) {
  var months = (now.getFullYear() - start.year) * 12 + (now.getMonth() + 1 - start.month);
  return Math.max(months, 0);
}

/**
 * Format a month count as e.g. "1 year 7 months", "11 months", "2 years".
 */
function formatDuration(totalMonths) {
  var years = Math.floor(totalMonths / 12);
  var months = totalMonths % 12;
  var parts = [];
  if (years > 0) parts.push(years + (years === 1 ? ' year' : ' years'));
  if (months > 0 || years === 0) parts.push(months + (months === 1 ? ' month' : ' months'));
  return parts.join(' ');
}

/**
 * Validate contact form data (pure function — no DOM access).
 * @param {{ name: string, email: string, subject: string, message: string }} formData
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateContactForm(formData) {
  var errors = [];

  if (!formData.name || formData.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!formData.email || formData.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.push('Please enter a valid email address');
  }

  if (!formData.subject || formData.subject.trim() === '') {
    errors.push('Subject is required');
  }

  if (!formData.message || formData.message.trim() === '') {
    errors.push('Message is required');
  }

  return { valid: errors.length === 0, errors: errors };
}

/**
 * Handle contact form submission.
 * Prevents default, validates, displays errors or success, resets on success.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  var form = event.target;
  var formData = {
    name: form.querySelector('#name').value,
    email: form.querySelector('#email').value,
    subject: form.querySelector('#subject').value,
    message: form.querySelector('#message').value
  };

  var result = validateContactForm(formData);

  // Clear all existing error messages
  var errorDivs = form.querySelectorAll('.error-message');
  errorDivs.forEach(function (div) {
    div.textContent = '';
  });

  // Remove any existing success / failure status message
  var existingStatus = form.querySelectorAll('.success-message, .form-status');
  existingStatus.forEach(function (el) {
    el.remove();
  });

  if (!result.valid) {
    // Map errors to their respective fields
    result.errors.forEach(function (error) {
      var fieldId = '';
      if (error === 'Name is required') fieldId = 'name';
      else if (error === 'Email is required' || error === 'Please enter a valid email address') fieldId = 'email';
      else if (error === 'Subject is required') fieldId = 'subject';
      else if (error === 'Message is required') fieldId = 'message';

      if (fieldId) {
        var field = form.querySelector('#' + fieldId);
        if (field) {
          var errorDiv = field.parentElement.querySelector('.error-message');
          if (errorDiv) {
            errorDiv.textContent = error;
          }
        }
      }
    });
  } else {
    // Prevent duplicate submissions while the request is in flight
    var submitButton = form.querySelector('button[type="submit"]');
    var originalButtonText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    var trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    };

    // Send data to Google Sheets (Apps Script web app)
    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify(trimmedData)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Request failed with status ' + response.status);
        }
        return response.text();
      })
      .then(function (text) {
        // The script may reply with JSON or plain text; only fail on an explicit error.
        var data = null;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = null;
        }
        if (data && (data.result === 'error' || data.status === 'error')) {
          throw new Error(data.message || data.error || 'Server reported an error');
        }

        showFormStatus(form, 'success-message', 'Message sent successfully!');
        form.reset();
      })
      .catch(function (error) {
        showFormStatus(form, 'form-status form-status-error', 'Failed to send message. Please try again or email me directly.');
        console.error(error);
      })
      .then(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
  }
}

var GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxJGB7BMncNepQ2pcAg-klmcJ8v547J1cwJa2euCfD-mvrIEZ604CBNbYwkCEHDocOV0Q/exec';

/**
 * Show a single status message at the bottom of the form, replacing any previous one.
 */
function showFormStatus(form, className, text) {
  var existing = form.querySelectorAll('.success-message, .form-status');
  existing.forEach(function (el) {
    el.remove();
  });
  var statusDiv = document.createElement('div');
  statusDiv.className = className;
  statusDiv.setAttribute('role', 'status');
  statusDiv.textContent = text;
  form.appendChild(statusDiv);
}

/**
 * Initialize scroll animations using IntersectionObserver.
 * Adds `.animate-in` class to sections as they enter the viewport.
 * Falls back to showing all sections immediately if IntersectionObserver is not supported.
 */
function initScrollAnimations() {
  var sections = document.querySelectorAll('main section');

  if (typeof IntersectionObserver === 'undefined') {
    // Graceful fallback: show all sections in final visible state
    sections.forEach(function (section) {
      section.classList.add('animate-in');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

// Export for testing (Node.js / CommonJS compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleMobileMenu, closeMobileMenu, scrollToSection, validateContactForm, handleFormSubmit, initScrollAnimations, getMonthsSince, formatDuration };
}
