import { describe, expectTypeOf, it } from 'vitest';
import type { ExtractPlaceholders, VariablesOf } from '../../src/types.js';

describe('ExtractPlaceholders — generic over delimiters', () => {
  it('single placeholder with double-brace', () => {
    expectTypeOf<ExtractPlaceholders<['Hello {{name}}'], '{{', '}}'>>().toEqualTypeOf<'name'>();
  });

  it('multiple placeholders', () => {
    expectTypeOf<
      ExtractPlaceholders<['Hi {{a}} and {{b}} ok'], '{{', '}}'>
    >().toEqualTypeOf<'a' | 'b'>();
  });

  it('duplicates dedupe via union', () => {
    expectTypeOf<ExtractPlaceholders<['{{x}} {{x}}'], '{{', '}}'>>().toEqualTypeOf<'x'>();
  });

  it('no placeholders → never', () => {
    expectTypeOf<ExtractPlaceholders<['no vars here'], '{{', '}}'>>().toEqualTypeOf<never>();
  });

  it('underscores and digits in identifier', () => {
    expectTypeOf<
      ExtractPlaceholders<['{{user_name1}} {{_x}}'], '{{', '}}'>
    >().toEqualTypeOf<'user_name1' | '_x'>();
  });

  it('identifier starting with digit is rejected', () => {
    expectTypeOf<ExtractPlaceholders<['{{1bad}}'], '{{', '}}'>>().toEqualTypeOf<never>();
  });

  it('identifier containing space is rejected', () => {
    expectTypeOf<ExtractPlaceholders<['{{user name}}'], '{{', '}}'>>().toEqualTypeOf<never>();
  });

  it('multi-segment strings array (across ${...} interpolations)', () => {
    expectTypeOf<
      ExtractPlaceholders<['{{a}} ', ' {{b}}'], '{{', '}}'>
    >().toEqualTypeOf<'a' | 'b'>();
  });

  it('works with single-brace delimiters', () => {
    expectTypeOf<ExtractPlaceholders<['{name} and {age}'], '{', '}'>>().toEqualTypeOf<
      'name' | 'age'
    >();
  });

  it('works with custom angle-bracket delimiters', () => {
    expectTypeOf<ExtractPlaceholders<['<<name>>'], '<<', '>>'>>().toEqualTypeOf<'name'>();
  });
});

describe('VariablesOf', () => {
  it('non-empty placeholder set → keyed object', () => {
    expectTypeOf<VariablesOf<'a' | 'b'>>().toEqualTypeOf<{
      readonly a: string;
      readonly b: string;
    }>();
  });

  it('empty placeholder set → Record<string, never>', () => {
    expectTypeOf<VariablesOf<never>>().toEqualTypeOf<Record<string, never>>();
  });
});
