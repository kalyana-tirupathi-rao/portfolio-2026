# Implementation Plan: Portfolio Website

## Overview

Build a single-page responsive portfolio website for Kalyana Tirupathi Rao using plain HTML, CSS, and vanilla JavaScript. Implementation proceeds incrementally: HTML structure first, then CSS styling and responsive layout, then JavaScript interactivity, and finally testing. Each task builds on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Create HTML structure with all semantic sections
  - [x] 1.1 Create `index.html` with document head, meta tags, and links to `styles.css` and `script.js`
    - Set up HTML5 boilerplate with `<meta charset>`, `<meta viewport>`, `<title>`, and linked stylesheet/script
    - Use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
    - _Requirements: 12.4_

  - [x] 1.2 Build the Navigation Bar and Hero Section markup
    - Add `<nav>` with logo/name, navigation links (About, Skills, Experience, Projects, Education, Contact) with `href="#sectionId"` anchors
    - Add hamburger menu button with `aria-expanded` and `aria-label` attributes
    - Add `<section id="hero">` with full name "Kalyana Tirupathi Rao", title "Data Engineer", tagline, and CTA button linking to `#contact`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 12.3_

  - [x] 1.3 Build the About and Skills Section markup
    - Add `<section id="about">` with professional summary (SQL, Python, Databricks, Azure Data Factory, ETL pipelines, data migration), experience duration "0 years 11 months", location "Kakinada, India", hobbies list, and language proficiencies (English, Telugu, Hindi)
    - Add `<section id="skills">` with skills grouped into categories: Programming, Data Engineering, Data Science & AI, Tools & Other — each skill as a tag/card element
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 13.1, 13.2_

  - [x] 1.4 Build the Experience and Projects Section markup
    - Add `<section id="experience">` with "Professional Experience" and "Internships" sub-sections, entries in reverse chronological order with role, company, date range, and description
    - Add `<section id="projects">` with card markup for all three projects including name, duration, description, technologies, and quantifiable achievements
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4_

  - [x] 1.5 Build the Education, Contact, and Footer Section markup
    - Add `<section id="education">` with all three entries (B.Tech, 12th, 10th) in reverse chronological order with degree, institution, year, and grade
    - Add `<section id="contact">` with email mailto link, phone number, LinkedIn link, and a contact form with name, email, subject, message fields and a submit button
    - Add `<footer>` with LinkedIn link, email link, and copyright notice "© {currentYear} Kalyana Tirupathi Rao"
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3_

- [x] 2. Checkpoint - Verify HTML structure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Create CSS styling with responsive design
  - [x] 3.1 Create `styles.css` with CSS custom properties and base styles
    - Define CSS custom properties for the color scheme (primary, secondary, background, text, accent colors)
    - Set base styles: box-sizing, font-family, minimum body text size of 16px, color contrast ratio ≥ 4.5:1
    - Style the fixed navigation bar (`position: fixed`, full-width, z-index) and hamburger menu (hidden on desktop, visible below 768px)
    - _Requirements: 11.1, 11.2, 11.4, 2.3, 2.4_

  - [x] 3.2 Style Hero, About, and Skills sections
    - Style Hero section as full-viewport-height banner with name, title, tagline, and CTA button
    - Style About section layout with summary, experience, location, hobbies, and languages
    - Style Skills section with category groupings and skill tag/card elements
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_

  - [x] 3.3 Style Experience, Projects, Education, Contact, and Footer sections
    - Style Experience section with timeline or card layout, separate sub-sections for professional and internships
    - Style Projects section with card-based layout
    - Style Education section entries
    - Style Contact section with contact info and form layout, including `.error-message` class for validation errors
    - Style Footer with social links and copyright
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 7.1, 8.1, 8.4, 8.5, 9.1, 9.2, 9.3_

  - [x] 3.4 Add responsive breakpoints and scroll animation CSS
    - Add media query for tablet (768px–1023px) with adjusted spacing and font sizes
    - Add media query for desktop (≥1024px) with multi-column layouts
    - Ensure single-column layout on mobile (<768px) with no horizontal scrolling
    - Add CSS animation keyframes for scroll-triggered entrance animations and `.animate-in` class
    - Add `prefers-reduced-motion: reduce` media query to disable animations
    - Add `:focus-visible` styles for keyboard navigation indicators
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.3, 12.3_

- [x] 4. Checkpoint - Verify styling and responsiveness
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement JavaScript interactivity
  - [x] 5.1 Implement navigation toggle and smooth scrolling in `script.js`
    - Implement `toggleMobileMenu()` to toggle hamburger menu open/close, updating `aria-expanded` attribute
    - Implement `closeMobileMenu()` to close menu when a nav link is clicked
    - Implement `scrollToSection(sectionId)` for smooth scrolling to target sections
    - Attach event listeners to nav links and hamburger button
    - _Requirements: 2.2, 2.4, 2.5_

  - [x] 5.2 Implement contact form validation
    - Implement `validateContactForm(formData)` as a pure function that takes `{ name, email, subject, message }` and returns `{ valid: boolean, errors: string[] }`
    - Validate: empty/whitespace fields produce specific error messages, invalid email format produces email error
    - Implement `handleFormSubmit(event)` to prevent default, call validation, display inline errors or success message, and reset form on success
    - Clear error messages when user starts typing in a field
    - _Requirements: 8.5_

  - [x] 5.3 Implement scroll animations with IntersectionObserver
    - Implement `initScrollAnimations()` using IntersectionObserver to add `.animate-in` class to sections entering the viewport
    - Gracefully handle browsers without IntersectionObserver support (sections render in final visible state)
    - _Requirements: 11.3_

  - [x] 5.4 Write property test: Empty required fields produce corresponding errors
    - **Property 1: Empty required fields produce corresponding errors**
    - Use fast-check to generate form data with random combinations of empty/non-empty fields
    - Verify `validateContactForm` returns `valid: false` and errors array contains exactly one error per empty/whitespace field
    - **Validates: Requirements 8.5**

  - [x] 5.5 Write property test: Email format validation
    - **Property 2: Email format validation**
    - Use fast-check to generate form data with all fields non-empty but email set to random invalid strings
    - Verify `validateContactForm` returns `valid: false` with an email error message
    - **Validates: Requirements 8.5**

  - [x] 5.6 Write property test: Fully valid form data passes validation
    - **Property 3: Fully valid form data passes validation**
    - Use fast-check to generate form data with all fields as valid non-empty strings and email matching a valid pattern
    - Verify `validateContactForm` returns `valid: true` and empty errors array
    - **Validates: Requirements 8.5**

  - [x] 5.7 Write unit tests for HTML structure and content verification
    - Test semantic elements present (header, nav, main, section, footer)
    - Test Hero section contains name, title, CTA button
    - Test navigation has all 6 section links with correct hrefs
    - Test Contact section has form with all required fields
    - Test Footer has copyright with current year
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 8.4, 9.3, 12.4_

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties of `validateContactForm` using fast-check
- Unit tests validate specific HTML structure and content examples using jsdom
- All three files (index.html, styles.css, script.js) are plain — no build tools or frameworks needed
