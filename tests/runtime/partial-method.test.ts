import { describe, expect, it } from 'vitest';
import { prompt } from '../../src/index.js';

describe('.partial()', () => {
  it('pre-binds a subset; .with() supplies the rest', () => {
    const t = prompt('Hi {{name}}, role {{role}}');
    const partial = t.partial({ name: 'Alice' });
    expect(partial.with({ role: 'admin' })).toBe('Hi Alice, role admin');
  });

  it('narrows the placeholder list to the remaining keys', () => {
    const t = prompt('{{a}} {{b}} {{c}}');
    const partial = t.partial({ a: 'A', c: 'C' });
    expect([...partial.placeholders]).toEqual(['b']);
  });

  it('repeated placeholders all substitute on .partial()', () => {
    const t = prompt('{{x}} and {{x}} and {{y}}');
    const partial = t.partial({ x: 'X' });
    expect(partial.with({ y: 'Y' })).toBe('X and X and Y');
  });

  it('partial with empty vars is identity-like (no .partial method)', () => {
    const t = prompt('Hi {{name}}');
    const partial = t.partial({});
    expect([...partial.placeholders]).toEqual(['name']);
    expect(partial.with({ name: 'Alice' })).toBe('Hi Alice');
  });

  it('partial of all keys leaves no placeholders', () => {
    const t = prompt('Hi {{name}}');
    const partial = t.partial({ name: 'Alice' });
    expect([...partial.placeholders]).toEqual([]);
    expect(partial.with({})).toBe('Hi Alice');
  });

  it('runtime does not expose a .partial method on the result', () => {
    const t = prompt('{{a}} {{b}}');
    const partial = t.partial({ a: 'A' });
    expect('partial' in partial).toBe(false);
  });
});
