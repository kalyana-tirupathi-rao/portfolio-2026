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

  // CTA button smooth scroll
  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        scrollToSection(href.substring(1));
      }
    });
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

  // Typing animation for hero subtitle
  var typingTexts = ['Data Engineer', 'ETL Developer', 'Azure Specialist', 'Python Developer'];
  var typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    var textIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 100;

    function typeEffect() {
      var current = typingTexts[textIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === current.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 1000);
  }

  // Animated counters
  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;
      var target = parseInt(counter.dataset.target, 10);
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

  // Skill bar fill animation
  function animateSkillBars() {
    var bars = document.querySelectorAll('.skill-bar-fill');
    bars.forEach(function (bar) {
      if (bar.dataset.animated) return;
      var width = bar.dataset.width;
      bar.style.width = width + '%';
      bar.dataset.animated = 'true';
    });
  }

  // Observe stats and skills sections for counter/bar animations
  if (typeof IntersectionObserver !== 'undefined') {
    var aboutSection = document.getElementById('about');
    var skillsSection = document.getElementById('skills');

    var featureObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (entry.target.id === 'about') animateCounters();
          if (entry.target.id === 'skills') animateSkillBars();
        }
      });
    }, { threshold: 0.3 });

    if (aboutSection) featureObserver.observe(aboutSection);
    if (skillsSection) featureObserver.observe(skillsSection);
  }

  // Tilt effect on project cards (desktop only — skip on touch devices)
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    var projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -5;
        var rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
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

  // Remove any existing success message
  var existingSuccess = form.querySelector('.success-message');
  if (existingSuccess) {
    existingSuccess.remove();
  }

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
    // Show success message and reset form
    // Send data to Google Sheets
fetch("https://script.google.com/macros/s/AKfycbxJGB7BMncNepQ2pcAg-klmcJ8v547J1cwJa2euCfD-mvrIEZ604CBNbYwkCEHDocOV0Q/exec", {
  method: "POST",
  body: JSON.stringify(formData)
})
.then(function(response) {
  return response.json();
})
.then(function(data) {

  var successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = 'Message sent successfully!';
  form.appendChild(successDiv);

  form.reset();

})
.catch(function(error) {

  var errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = 'Failed to send message!';
  form.appendChild(errorDiv);

  console.error(error);
  }
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
  module.exports = { toggleMobileMenu, closeMobileMenu, scrollToSection, validateContactForm, handleFormSubmit, initScrollAnimations };
}
