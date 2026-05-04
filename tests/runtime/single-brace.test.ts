import { describe, expect, it } from 'vitest';
import { prompt } from '../../src/single-brace.js';

describe('promptkit/single-brace', () => {
  it('substitutes {var} placeholders', () => {
    const t = prompt('Hello {name}');
    expect(t.with({ name: 'Alice' })).toBe('Hello Alice');
  });

  it('extracts multiple {var} placeholders', () => {
    const t = prompt('Hi {name}, role {role}');
    expect([...t.placeholders].sort()).toEqual(['name', 'role']);
    expect(t.with({ name: 'Bob', role: 'admin' })).toBe('Hi Bob, role admin');
  });

  it('still matches the inner {notvar} of {{notvar}} — the JSON-collision case ADR-0001 warns about', () => {
    // single-brace users opt into this risk per ADR-0001; double-brace is the un-configured default.
    const t = prompt('Hi {name}, see {{notvar}}');
    expect([...t.placeholders].sort()).toEqual(['name', 'notvar']);
  });

  it('exposes {/} as the delimiter pair', () => {
    const t = prompt('{x}');
    expect(t.open).toBe('{');
    expect(t.close).toBe('}');
  });

  it('supports .partial in the same shape as the default prompt', () => {
    const t = prompt('{a} {b}');
    const partial = t.partial({ a: 'A' });
    expect(partial.with({ b: 'B' })).toBe('A B');
  });
});
