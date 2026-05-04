import { describe, expect, it } from 'vitest';
import { prompt } from '../../src/index.js';

describe('.with()', () => {
  it('renders a single placeholder', () => {
    const t = prompt('Hello {{name}}');
    expect(t.with({ name: 'alice' })).toBe('Hello alice');
  });

  it('renders multiple placeholders', () => {
    const t = prompt('Hi {{name}}, age {{age}}');
    expect(t.with({ name: 'bob', age: '30' })).toBe('Hi bob, age 30');
  });

  it('renders repeated placeholders consistently', () => {
    const t = prompt('{{x}} and {{x}} and {{x}}');
    expect(t.with({ x: 'hi' })).toBe('hi and hi and hi');
  });

  it('renders the empty-placeholder case verbatim', () => {
    const t = prompt('no variables here');
    expect(t.with({})).toBe('no variables here');
  });

  it('leaves single-brace JSON content untouched (JSON-collision safety)', () => {
    const t = prompt('Output: {"name": "alice"} for {{user}}');
    expect(t.with({ user: 'bob' })).toBe('Output: {"name": "alice"} for bob');
  });

  it('coerces non-string values via String()', () => {
    const t = prompt('{{n}} {{b}}');
    const cast = t.with as (v: Record<string, unknown>) => string;
    expect(cast({ n: 42, b: true })).toBe('42 true');
  });

  it('does not substitute identifiers with invalid shape', () => {
    const t = prompt('{{1bad}} {{good}}');
    expect(t.with({ good: 'ok' })).toBe('{{1bad}} ok');
  });
});
