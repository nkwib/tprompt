import { describe, expect, it } from 'vitest';
import { makePromptTag, prompt as defaultPrompt } from '../../src/index.js';

describe('makePromptTag factory', () => {
  it('round-trip via makePromptTag matches the default `prompt` for {{ }}', () => {
    const customPrompt = makePromptTag({ open: '{{', close: '}}' });
    const a = defaultPrompt('Hello {{name}}').with({ name: 'Alice' });
    const b = customPrompt('Hello {{name}}').with({ name: 'Alice' });
    expect(a).toBe(b);
  });

  it('extracts placeholders for a custom angle-bracket delimiter', () => {
    const angle = makePromptTag({ open: '<<', close: '>>' });
    const t = angle('Hi <<name>>, age <<age>>');
    expect([...t.placeholders].sort()).toEqual(['age', 'name']);
    expect(t.with({ name: 'Bob', age: '30' })).toBe('Hi Bob, age 30');
  });

  it('exposes the delimiter on the compiled template', () => {
    const angle = makePromptTag({ open: '<<', close: '>>' });
    const t = angle('<<x>>');
    expect(t.open).toBe('<<');
    expect(t.close).toBe('>>');
  });

  it('rejects literal `{{...}}` content under angle-bracket delimiter (left untouched)', () => {
    const angle = makePromptTag({ open: '<<', close: '>>' });
    const t = angle('Output: {{not_a_var}} for <<user>>');
    expect([...t.placeholders]).toEqual(['user']);
    expect(t.with({ user: 'bob' })).toBe('Output: {{not_a_var}} for bob');
  });

  it('factory-built tag carries .partial / .validate / .validateSafe', () => {
    const dollar = makePromptTag({ open: '${', close: '}' });
    const t = dollar('Hi ${name}, role ${role}');
    const partial = t.partial({ name: 'Alice' });
    expect(partial.with({ role: 'admin' })).toBe('Hi Alice, role admin');
    expect(typeof t.validate).toBe('function');
    expect(typeof t.validateSafe).toBe('function');
  });
});
