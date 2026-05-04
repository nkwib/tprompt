import { describe, expectTypeOf, it } from 'vitest';
import { prompt } from '../../src/index.js';

describe('.partial() type signature', () => {
  it('returns a template with the bound key removed from .with()', () => {
    const t = prompt('Hi {{name}}, role {{role}}');
    const partial = t.partial({ name: 'Alice' });
    expectTypeOf(partial.with).parameter(0).toEqualTypeOf<{ readonly role: string }>();
  });

  it('returns a fully-bound template if all keys are partialled', () => {
    const t = prompt('Hi {{name}}');
    const partial = t.partial({ name: 'Alice' });
    expectTypeOf(partial.with).parameter(0).toEqualTypeOf<Record<string, never>>();
  });

  it('rejects keys not in the placeholder set', () => {
    const t = prompt('Hi {{name}}');
    // @ts-expect-error — `notAKey` is not a placeholder
    t.partial({ notAKey: 'x' });
  });

  it('rejects wrong-type values', () => {
    const t = prompt('Hi {{name}}');
    // @ts-expect-error — value must be string
    t.partial({ name: 123 });
  });

  it('does NOT expose .partial on the partial-applied result (no composition)', () => {
    const t = prompt('{{a}} {{b}}');
    const partial = t.partial({ a: 'A' });
    // @ts-expect-error — partials do not compose
    partial.partial({ b: 'B' });
  });

  it('partial-applied placeholders is the remaining set', () => {
    const t = prompt('{{a}} {{b}} {{c}}');
    const partial = t.partial({ a: 'A', c: 'C' });
    expectTypeOf<typeof partial.placeholders>().toEqualTypeOf<ReadonlyArray<'b'>>();
  });

  it('empty .partial({}) keeps all placeholders required on .with()', () => {
    const t = prompt('Hi {{name}}');
    const partial = t.partial({});
    expectTypeOf(partial.with).parameter(0).toEqualTypeOf<{ readonly name: string }>();
  });
});
