import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

global.document = {
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
};
global.window = {};

const require = createRequire(import.meta.url);
const { getMonthsSince, formatDuration } = require('../script.js');

const start = { year: 2025, month: 4 };

describe('experience duration', () => {
  it('counts calendar months since the start', () => {
    expect(getMonthsSince(start, new Date(2025, 3, 15))).toBe(0);
    expect(getMonthsSince(start, new Date(2026, 2, 1))).toBe(11);
    expect(getMonthsSince(start, new Date(2026, 10, 14))).toBe(19);
    expect(getMonthsSince(start, new Date(2024, 0, 1))).toBe(0);
  });

  it('formats months as years and months', () => {
    expect(formatDuration(0)).toBe('0 months');
    expect(formatDuration(1)).toBe('1 month');
    expect(formatDuration(11)).toBe('11 months');
    expect(formatDuration(12)).toBe('1 year');
    expect(formatDuration(19)).toBe('1 year 7 months');
    expect(formatDuration(25)).toBe('2 years 1 month');
  });
});
