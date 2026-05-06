export type {
  Compiled,
  ExtractPlaceholders,
  PartialApplied,
  SafeParseResult,
  SchemaLike,
  Validated,
  ValidatedPartial,
  ValidatedSafe,
  ValidatedSafePartial,
  ValidationResult,
  VariablesOf
} from './types.js';
export type { ParserOptions } from './factory.js';
export { makePromptTag } from './factory.js';
export { MissingPlaceholderError } from './parser.js';
export type { RenderOptions } from './parser.js';

import { makePromptTag } from './factory.js';

export const prompt = makePromptTag({ open: '{{', close: '}}' });
