import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { JSDOM } from 'jsdom';
import { createRequire } from 'module';

const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf-8');
const require = createRequire(import.meta.url);

let dom;
let form;
let handleFormSubmit;

function fillValidForm() {
  form.querySelector('#name').value = 'Jane';
  form.querySelector('#email').value = 'jane@example.com';
  form.querySelector('#subject').value = 'Hello';
  form.querySelector('#message').value = 'Hi there';
}

function submit() {
  const event = new dom.window.Event('submit', { cancelable: true });
  Object.defineProperty(event, 'target', { value: form });
  handleFormSubmit(event);
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('handleFormSubmit', () => {
  beforeEach(() => {
    dom = new JSDOM(html);
    global.document = dom.window.document;
    global.window = dom.window;
    form = dom.window.document.getElementById('contact-form');
    ({ handleFormSubmit } = require('../script.js'));
  });

  it('disables the submit button while sending and re-enables it afterwards', async () => {
    let resolveFetch;
    global.fetch = vi.fn(() => new Promise((r) => { resolveFetch = r; }));
    fillValidForm();
    submit();

    const button = form.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Sending...');

    resolveFetch({ ok: true, text: () => Promise.resolve('{"result":"success"}') });
    await flush();
    await flush();

    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Send Message');
    expect(form.querySelector('.success-message').textContent).toContain('sent successfully');
  });

  it('treats a non-JSON success response as success', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve('OK') }));
    fillValidForm();
    submit();
    await flush();
    await flush();
    expect(form.querySelector('.success-message')).not.toBeNull();
    expect(form.querySelector('.form-status')).toBeNull();
  });

  it('shows only one failure message after repeated failures', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('network down')));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    for (let i = 0; i < 3; i++) {
      fillValidForm();
      submit();
      await flush();
      await flush();
    }

    expect(form.querySelectorAll('.form-status').length).toBe(1);
    expect(form.querySelector('.success-message')).toBeNull();
  });

  it('does not call fetch when validation fails', () => {
    global.fetch = vi.fn();
    submit();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(form.querySelector('#name').parentElement.querySelector('.error-message').textContent)
      .toBe('Name is required');
  });
});
