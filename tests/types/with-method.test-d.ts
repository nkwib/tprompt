import { describe, expectTypeOf, it } from 'vitest';
import { prompt } from '../../src/index.js';

describe('.with() type signature', () => {
  it('exact-match on single placeholder', () => {
    const t = prompt('Hello {{name}}');
    expectTypeOf(t.with).parameter(0).toEqualTypeOf<{ readonly name: string }>();
    expectTypeOf(t.with).returns.toBeString();
  });

  it('exact-match on multiple placeholders', () => {
    const t = prompt('Hi {{name}}, age {{age}}');
    expectTypeOf(t.with).parameter(0).toEqualTypeOf<{
      readonly name: string;
      readonly age: string;
    }>();
  });

  it('rejects extra keys (excess property check on object literal)', () => {
    const t = prompt('{{name}}');
    // @ts-expect-error — `extra` is not a placeholder
    t.with({ name: 'alice', extra: 'no' });
  });

  it('rejects missing keys', () => {
    const t = prompt('{{name}}');
    // @ts-expect-error — `name` is required
    t.with({});
  });

  it('rejects wrong-type values', () => {
    const t = prompt('{{name}}');
    // @ts-expect-error — value must be string
    t.with({ name: 123 });
  });

  it('empty-placeholder template accepts {} ', () => {
    const t = prompt('no vars');
    expectTypeOf(t.with).parameter(0).toEqualTypeOf<Record<string, never>>();
    t.with({});
  });

  it('empty-placeholder template rejects any keys', () => {
    const t = prompt('no vars');
    // @ts-expect-error — empty template takes no keys
    t.with({ foo: 'bar' });
  });
});
