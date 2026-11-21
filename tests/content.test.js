import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { JSDOM } from 'jsdom';
import { resolve } from 'path';

const root = resolve(__dirname, '..');

describe('Content accuracy and links', () => {
  let document;
  let text;

  beforeAll(() => {
    const html = readFileSync(resolve(root, 'index.html'), 'utf-8');
    document = new JSDOM(html).window.document;
    text = document.body.textContent;
  });

  it('does not include unverified metrics or confidential client names', () => {
    expect(text).not.toMatch(/30%/);
    expect(text).not.toMatch(/99\.9%/);
    expect(text).not.toMatch(/pepsi/i);
    expect(text).not.toMatch(/APAC/);
    expect(text).not.toMatch(/aspiring/i);
  });

  it('labels AWS Academy items as training badges', () => {
    const awsItems = Array.from(document.querySelectorAll('.cert-item'))
      .filter(item => item.textContent.includes('AWS Academy'));
    expect(awsItems.length).toBe(2);
    awsItems.forEach(item => expect(item.textContent).toContain('Training badge'));
  });

  it('distinguishes the ongoing M.Tech from the completed B.Tech', () => {
    const entries = Array.from(document.querySelectorAll('.education-entry'));
    const mtech = entries.find(e => e.textContent.includes('M.Tech'));
    const btech = entries.find(e => e.textContent.includes('B.Tech'));
    expect(mtech.querySelector('.education-status').textContent).toBe('In progress');
    expect(mtech.textContent).toContain('2027');
    expect(btech.querySelector('.education-status').textContent).toBe('Completed');
    expect(btech.textContent).toContain('2025');
  });

  it('links to the LinkedIn and Credly profiles and the email address', () => {
    const hrefs = Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href'));
    expect(hrefs).toContain('https://in.linkedin.com/in/kalyana-tirupathi-rao');
    expect(hrefs).toContain('https://www.credly.com/users/kalyana-tirupathi-rao/badges');
    expect(hrefs).toContain('mailto:kalyanatirupathirao@gmail.com');
  });

  it('opens external links safely in a new tab', () => {
    const external = Array.from(document.querySelectorAll('a[href^="http"]'));
    expect(external.length).toBeGreaterThan(0);
    external.forEach(a => {
      expect(a.getAttribute('target'), a.href).toBe('_blank');
      expect(a.getAttribute('rel'), a.href).toContain('noopener');
    });
  });

  it('has a matching element for every in-page link', () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      const id = a.getAttribute('href').slice(1);
      expect(document.getElementById(id), a.getAttribute('href')).not.toBeNull();
    });
  });

  it('only references local assets that exist', () => {
    const refs = [
      ...Array.from(document.querySelectorAll('img[src]')).map(el => el.getAttribute('src')),
      ...Array.from(document.querySelectorAll('link[href]')).map(el => el.getAttribute('href')),
      ...Array.from(document.querySelectorAll('script[src]')).map(el => el.getAttribute('src')),
    ].filter(ref => !/^https?:/.test(ref));
    refs.forEach(ref => expect(existsSync(resolve(root, ref)), ref).toBe(true));
  });

  it('has search and social metadata', () => {
    expect(document.querySelector('meta[name="description"]').getAttribute('content').length).toBeGreaterThan(50);
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://www.ktrdata.in/');
    expect(document.querySelector('meta[property="og:title"]')).not.toBeNull();
    expect(document.querySelector('meta[property="og:image"]')).not.toBeNull();
    expect(document.querySelector('link[rel="icon"]')).not.toBeNull();
    const ld = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
    expect(ld['@type']).toBe('Person');
  });
});
