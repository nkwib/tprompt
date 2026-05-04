import { describe, expectTypeOf, it } from 'vitest';
import { z } from 'zod';
import { prompt } from '../../src/index.js';
import type { ValidationResult } from '../../src/types.js';

describe('.validate / .validateSafe types', () => {
  it('schema must structurally cover the placeholder set', () => {
    const t = prompt('Hi {{name}}');
    // @ts-expect-error — schema for { wrongKey } doesn't cover { name }
    t.validate(z.object({ wrongKey: z.string() }));
  });

  it('validate.with returns string', () => {
    const t = prompt('Hi {{name}}').validate(z.object({ name: z.string() }));
    expectTypeOf(t.with).returns.toEqualTypeOf<string>();
  });

  it('validate.with parameter shape matches placeholders', () => {
    const t = prompt('Hi {{name}}').validate(z.object({ name: z.string() }));
    expectTypeOf(t.with).parameter(0).toEqualTypeOf<{ readonly name: string }>();
  });

  it('validateSafe.with returns ValidationResult', () => {
    const t = prompt('Hi {{name}}').validateSafe(z.object({ name: z.string() }));
    expectTypeOf(t.with).returns.toEqualTypeOf<ValidationResult>();
  });

  it('validated has .partial when upstream Compiled had it', () => {
    const t = prompt('{{a}} {{b}}').validate(z.object({ a: z.string(), b: z.string() }));
    expectTypeOf(t).toHaveProperty('partial');
  });

  it('validated.partial returns ValidatedPartial without .partial (no composition)', () => {
    const t = prompt('{{a}} {{b}}')
      .validate(z.object({ a: z.string(), b: z.string() }))
      .partial({ a: 'A' });
    // @ts-expect-error — partials of validated do not compose
    t.partial({ b: 'B' });
  });

  it('PartialApplied.validate schema covers remaining keys only', () => {
    const t = prompt('{{a}} {{b}}').partial({ a: 'A' });
    // @ts-expect-error — schema must match the remaining placeholder set { b }, not { a }
    t.validate(z.object({ a: z.string() }));
  });

  it('validateSafe.partial preserves safe-mode return type', () => {
    const t = prompt('{{a}} {{b}}')
      .validateSafe(z.object({ a: z.string(), b: z.string() }))
      .partial({ a: 'A' });
    expectTypeOf(t.with).returns.toEqualTypeOf<ValidationResult>();
  });
});
