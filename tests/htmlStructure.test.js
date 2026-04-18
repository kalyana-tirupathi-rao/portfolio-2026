import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { resolve } from 'path';

describe('HTML Structure and Content', () => {
  let document;

  beforeAll(() => {
    const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf-8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should have all semantic elements (header, nav, main, section, footer)', () => {
    expect(document.querySelector('header')).not.toBeNull();
    expect(document.querySelector('nav')).not.toBeNull();
    expect(document.querySelector('main')).not.toBeNull();
    expect(document.querySelector('footer')).not.toBeNull();

    const expectedSections = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
    for (const id of expectedSections) {
      expect(document.querySelector(`section#${id}`), `section#${id} should exist`).not.toBeNull();
    }
  });

  it('should have Hero section with name, title, and CTA button', () => {
    const hero = document.querySelector('#hero');
    const h1 = hero.querySelector('h1');
    expect(h1.textContent).toContain('Kalyana Tirupathi Rao');

    const subtitle = hero.querySelector('.hero-subtitle');
    expect(subtitle.textContent).toContain('Data Engineer');

    const cta = hero.querySelector('.cta-button');
    expect(cta).not.toBeNull();
    expect(cta.getAttribute('href')).toBe('#contact');
  });

  it('should have navigation with all 6 section links', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    expect(navLinks.length).toBe(6);

    const expectedHrefs = ['#about', '#skills', '#experience', '#projects', '#education', '#contact'];
    const actualHrefs = Array.from(navLinks).map(link => link.getAttribute('href'));
    expect(actualHrefs).toEqual(expectedHrefs);
  });

  it('should have Contact section with form and all required fields', () => {
    const form = document.querySelector('#contact-form');
    expect(form).not.toBeNull();

    expect(form.querySelector('input[name="name"]')).not.toBeNull();
    expect(form.querySelector('input[name="email"]')).not.toBeNull();
    expect(form.querySelector('input[name="subject"]')).not.toBeNull();
    expect(form.querySelector('textarea[name="message"]')).not.toBeNull();
    expect(form.querySelector('button[type="submit"]')).not.toBeNull();
  });

  it('should have Footer with copyright containing current year', () => {
    const footer = document.querySelector('footer');
    expect(footer).not.toBeNull();

    const copyright = footer.querySelector('.copyright');
    expect(copyright.textContent).toContain('Kalyana Tirupathi Rao');

    const yearSpan = footer.querySelector('.copyright-year');
    expect(yearSpan).not.toBeNull();
  });
});
