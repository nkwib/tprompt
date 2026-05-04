import type { Compiled, ExtractPlaceholders, VariablesOf } from './types.js';
import { extractPlaceholders, renderTemplate } from './parser.js';

export type { Compiled, ExtractPlaceholders, VariablesOf } from './types.js';

const DEFAULT_OPEN = '{{';
const DEFAULT_CLOSE = '}}';

export function prompt<const S extends string>(
  template: S
): Compiled<readonly [S], '{{', '}}'> {
  const segments = [template] as unknown as readonly [S];
  const placeholders = extractPlaceholders(
    segments,
    DEFAULT_OPEN,
    DEFAULT_CLOSE
  ) as ReadonlyArray<ExtractPlaceholders<readonly [S], '{{', '}}'>>;
  return {
    strings: segments,
    open: '{{',
    close: '}}',
    placeholders,
    with(vars: VariablesOf<ExtractPlaceholders<readonly [S], '{{', '}}'>>): string {
      return renderTemplate(
        segments,
        DEFAULT_OPEN,
        DEFAULT_CLOSE,
        vars as Readonly<Record<string, unknown>>
      );
    }
  };
}
