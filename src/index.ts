import type { Compiled, ExtractPlaceholders } from './types.js';
import { extractPlaceholders } from './parser.js';

export type { Compiled, ExtractPlaceholders, VariablesOf } from './types.js';

const DEFAULT_OPEN = '{{';
const DEFAULT_CLOSE = '}}';

export function prompt<const Raw extends readonly string[]>(
  strings: TemplateStringsArray & { readonly raw: Raw },
  ..._values: never[]
): Compiled<Raw, '{{', '}}'> {
  const raw = strings.raw as unknown as Raw;
  const placeholders = extractPlaceholders(
    strings.raw,
    DEFAULT_OPEN,
    DEFAULT_CLOSE
  ) as ReadonlyArray<ExtractPlaceholders<Raw, '{{', '}}'>>;
  return {
    strings: raw,
    open: '{{',
    close: '}}',
    placeholders
  };
}
