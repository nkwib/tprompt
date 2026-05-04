import { describe, expect, it } from 'vitest';
import { prompt } from '../../src/index.js';

describe('prompt tag', () => {
  it('returns the original strings array', () => {
    const t = prompt`Hello {{name}}`;
    expect([...t.strings]).toEqual(['Hello {{name}}']);
  });

  it('extracts placeholder names', () => {
    const t = prompt`Hi {{name}}, age {{age}}`;
    expect([...t.placeholders].sort()).toEqual(['age', 'name']);
  });

  it('deduplicates repeated placeholders', () => {
    const t = prompt`{{x}} and {{x}} and {{x}}`;
    expect([...t.placeholders]).toEqual(['x']);
  });

  it('returns empty placeholder list when no placeholders', () => {
    const t = prompt`no variables here`;
    expect([...t.placeholders]).toEqual([]);
  });

  it('accepts identifiers with underscores and digits', () => {
    const t = prompt`{{user_name1}} {{_private}} {{x9}}`;
    expect([...t.placeholders].sort()).toEqual(['_private', 'user_name1', 'x9']);
  });

  it('silently skips invalid identifier shapes', () => {
    const t = prompt`{{1bad}} {{has space}} {{good}}`;
    expect([...t.placeholders]).toEqual(['good']);
  });

  it('exposes the default delimiter pair', () => {
    const t = prompt`{{x}}`;
    expect(t.open).toBe('{{');
    expect(t.close).toBe('}}');
  });

  it('reads from strings.raw rather than cooked strings', () => {
    const t = prompt`a\nb {{name}}`;
    expect([...t.strings]).toEqual(['a\\nb {{name}}']);
    expect([...t.placeholders]).toEqual(['name']);
  });
});
