import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { createRequire } from 'module';

// Provide minimal DOM stubs so script.js can be loaded in Node
global.document = {
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  createElement: () => ({ classList: { add: () => {} } }),
};
global.window = {};
global.IntersectionObserver = class { observe() {} unobserve() {} };

const require = createRequire(import.meta.url);
const { validateContactForm } = require('../script.js');

/**
 * Property 1: Empty required fields produce corresponding errors
 * Validates: Requirements 8.5
 *
 * For any form data where one or more required fields are empty/whitespace,
 * validateContactForm returns valid: false and errors array contains exactly
 * one error per empty/whitespace field.
 */
describe('validateContactForm - Property Tests', () => {
  const fieldErrorMap = {
    name: 'Name is required',
    email: 'Email is required',
    subject: 'Subject is required',
    message: 'Message is required',
  };

  // Generator for a valid email string (non-empty, matches email pattern)
  const validEmailArb = fc
    .tuple(
      fc.stringMatching(/^[a-z][a-z0-9]{0,9}$/),
      fc.stringMatching(/^[a-z][a-z0-9]{0,5}$/),
      fc.stringMatching(/^[a-z]{2,4}$/)
    )
    .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

  // Generator for a non-empty, non-whitespace string (for name, subject, message)
  const nonEmptyStringArb = fc
    .stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9 ]{0,19}$/)
    .filter((s) => s.trim().length > 0);

  // Generator for empty/whitespace string
  const emptyOrWhitespaceArb = fc.oneof(
    fc.constant(''),
    fc.constant('   '),
    fc.constant('\t'),
    fc.constant('  \t  ')
  );

  it('Property 1: Empty required fields produce corresponding errors', () => {
    // Generate a boolean for each field: true = empty/whitespace, false = valid
    const formDataArb = fc
      .record({
        nameEmpty: fc.boolean(),
        emailEmpty: fc.boolean(),
        subjectEmpty: fc.boolean(),
        messageEmpty: fc.boolean(),
      })
      .filter(
        ({ nameEmpty, emailEmpty, subjectEmpty, messageEmpty }) =>
          nameEmpty || emailEmpty || subjectEmpty || messageEmpty
      )
      .chain(({ nameEmpty, emailEmpty, subjectEmpty, messageEmpty }) =>
        fc.record({
          name: nameEmpty ? emptyOrWhitespaceArb : nonEmptyStringArb,
          email: emailEmpty ? emptyOrWhitespaceArb : validEmailArb,
          subject: subjectEmpty ? emptyOrWhitespaceArb : nonEmptyStringArb,
          message: messageEmpty ? emptyOrWhitespaceArb : nonEmptyStringArb,
          _nameEmpty: fc.constant(nameEmpty),
          _emailEmpty: fc.constant(emailEmpty),
          _subjectEmpty: fc.constant(subjectEmpty),
          _messageEmpty: fc.constant(messageEmpty),
        })
      );

    fc.assert(
      fc.property(formDataArb, (data) => {
        const formData = {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        };

        const result = validateContactForm(formData);

        // Determine which fields are empty/whitespace
        const emptyFields = [];
        if (data._nameEmpty) emptyFields.push('name');
        if (data._emailEmpty) emptyFields.push('email');
        if (data._subjectEmpty) emptyFields.push('subject');
        if (data._messageEmpty) emptyFields.push('message');

        // Must be invalid
        expect(result.valid).toBe(false);

        // Errors array length must equal number of empty fields
        expect(result.errors.length).toBe(emptyFields.length);

        // Each empty field must have its corresponding error message
        for (const field of emptyFields) {
          expect(result.errors).toContain(fieldErrorMap[field]);
        }

        // No errors for non-empty fields
        const nonEmptyFields = ['name', 'email', 'subject', 'message'].filter(
          (f) => !emptyFields.includes(f)
        );
        for (const field of nonEmptyFields) {
          expect(result.errors).not.toContain(fieldErrorMap[field]);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Email format validation
   * Validates: Requirements 8.5
   *
   * For any form data where all fields are non-empty but email does not match
   * a valid email pattern, validateContactForm returns valid: false with an
   * email format error message.
   */
  it('Property 2: Email format validation', () => {
    const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Generator for invalid email strings that do NOT match the valid pattern
    const invalidEmailArb = fc.oneof(
      fc.stringMatching(/^[a-zA-Z0-9]{1,10}$/),       // no @ at all
      fc.stringMatching(/^[a-zA-Z0-9]{1,5}@$/),       // @ but nothing after
      fc.stringMatching(/^[a-zA-Z0-9]{1,5}@[a-zA-Z0-9]{1,5}$/), // @ but no dot
      fc.constant('user@.com'),
      fc.constant('@domain.com'),
      fc.constant('user@domain.')
    ).filter((s) => s.trim().length > 0 && !validEmailPattern.test(s));

    // Generator for non-empty, non-whitespace strings (valid for name/subject/message)
    const validFieldArb = fc
      .stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9 ]{0,19}$/)
      .filter((s) => s.trim().length > 0);

    const formDataArb = fc.record({
      name: validFieldArb,
      email: invalidEmailArb,
      subject: validFieldArb,
      message: validFieldArb,
    });

    fc.assert(
      fc.property(formDataArb, (formData) => {
        const result = validateContactForm(formData);

        // Must be invalid
        expect(result.valid).toBe(false);

        // Must contain the email format error
        expect(result.errors).toContain('Please enter a valid email address');

        // Must NOT contain "Email is required" since email is non-empty
        expect(result.errors).not.toContain('Email is required');

        // Only the email format error should be present (other fields are valid)
        expect(result.errors.length).toBe(1);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Fully valid form data passes validation
   * Validates: Requirements 8.5
   *
   * For any form data where all required fields are non-empty, non-whitespace
   * strings and the email matches a valid email pattern, validateContactForm
   * returns valid: true and an empty errors array.
   */
  it('Property 3: Fully valid form data passes validation', () => {
    const formDataArb = fc.record({
      name: nonEmptyStringArb,
      email: validEmailArb,
      subject: nonEmptyStringArb,
      message: nonEmptyStringArb,
    });

    fc.assert(
      fc.property(formDataArb, (formData) => {
        const result = validateContactForm(formData);

        // Must be valid
        expect(result.valid).toBe(true);

        // Errors array must be empty
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });
});
