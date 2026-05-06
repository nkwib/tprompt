import { describe, expect, it } from 'vitest';
import {
  makePromptTag,
  MissingPlaceholderError,
  prompt
} from '../../src/index.js';

describe('missing-key behavior', () => {
  it('throws MissingPlaceholderError when a required key is absent (default mode)', () => {
    const t = prompt('Hi {{name}}');
    const cast = t.with as (v: Record<string, unknown>) => string;
    expect(() => cast({})).toThrow(MissingPlaceholderError);
  });

  it('lists all missing keys in the error', () => {
    const t = prompt('{{a}} {{b}} {{c}}');
    const cast = t.with as (v: Record<string, unknown>) => string;
    try {
      cast({ a: 'one' });
      throw new Error('expected MissingPlaceholderError');
    } catch (err) {
      expect(err).toBeInstanceOf(MissingPlaceholderError);
      const missing = (err as MissingPlaceholderError).missing;
      expect([...missing].sort()).toEqual(['b', 'c']);
    }
  });

  it('still renders explicit undefined as the legacy "undefined" string', () => {
    const t = prompt('Hi {{name}}');
    const cast = t.with as (v: Record<string, unknown>) => string;
    // Key is present but value is `undefined` — opt-in to the legacy String()
    // coercion only when the caller deliberately passes undefined.
    expect(cast({ name: undefined })).toBe('Hi undefined');
  });

  it('opts out via makePromptTag({ onMissing: "insert-undefined" })', () => {
    const lenient = makePromptTag({
      open: '{{',
      close: '}}',
      onMissing: 'insert-undefined'
    });
    const t = lenient('Hi {{name}}');
    const cast = t.with as (v: Record<string, unknown>) => string;
    expect(cast({})).toBe('Hi undefined');
  });

  it('throws on missing keys after .partial() too', () => {
    const t = prompt('Hi {{name}}, role {{role}}').partial({ name: 'Alice' });
    const cast = t.with as (v: Record<string, unknown>) => string;
    expect(() => cast({})).toThrow(MissingPlaceholderError);
  });

  it('error message includes the missing key name', () => {
    const t = prompt('Hi {{userName}}');
    const cast = t.with as (v: Record<string, unknown>) => string;
    expect(() => cast({})).toThrow(/userName/);
  });
});
