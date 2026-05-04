import { describe, expectTypeOf, it } from 'vitest';
import { prompt } from '../../src/single-brace.js';

describe('tprompt/single-brace — type inference', () => {
  it('extracts {var} placeholders into the variables-object type', () => {
    const t = prompt('Hi {name}');
    expectTypeOf(t.with).parameter(0).toEqualTypeOf<{ readonly name: string }>();
  });

  it('exposes single-brace as the literal delimiter pair', () => {
    const t = prompt('{x}');
    expectTypeOf(t.open).toEqualTypeOf<'{'>();
    expectTypeOf(t.close).toEqualTypeOf<'}'>();
  });
});
