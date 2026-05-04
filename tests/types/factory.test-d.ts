import { describe, expectTypeOf, it } from 'vitest';
import { makePromptTag } from '../../src/index.js';

describe('makePromptTag factory — type inference', () => {
  it('custom delimiter binds Open/Close as literal types', () => {
    const angle = makePromptTag({ open: '<<', close: '>>' });
    const t = angle('Hi <<name>>');
    expectTypeOf(t.open).toEqualTypeOf<'<<'>();
    expectTypeOf(t.close).toEqualTypeOf<'>>'>();
  });

  it('custom delimiter extracts placeholders the same way as default', () => {
    const angle = makePromptTag({ open: '<<', close: '>>' });
    const t = angle('Hi <<name>>, age <<age>>');
    expectTypeOf(t.with).parameter(0).toEqualTypeOf<{
      readonly name: string;
      readonly age: string;
    }>();
  });

  it('custom delimiter rejects extra keys on .with', () => {
    const angle = makePromptTag({ open: '<<', close: '>>' });
    const t = angle('Hi <<name>>');
    // @ts-expect-error — `extra` is not a placeholder
    t.with({ name: 'Alice', extra: 'no' });
  });

  it('single-brace gets identical inference shape to {{ }}', () => {
    const single = makePromptTag({ open: '{', close: '}' });
    const t = single('Hi {name}');
    expectTypeOf(t.with).parameter(0).toEqualTypeOf<{ readonly name: string }>();
  });

  it('factory return type carries .partial / .validate / .validateSafe', () => {
    const angle = makePromptTag({ open: '<<', close: '>>' });
    const t = angle('<<x>>');
    expectTypeOf(t).toHaveProperty('partial');
    expectTypeOf(t).toHaveProperty('validate');
    expectTypeOf(t).toHaveProperty('validateSafe');
  });
});
