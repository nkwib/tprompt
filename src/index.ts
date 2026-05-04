import type {
  Compiled,
  ExtractPlaceholders,
  PartialApplied,
  VariablesOf
} from './types.js';
import { extractPlaceholders, renderTemplate } from './parser.js';

export type {
  Compiled,
  ExtractPlaceholders,
  PartialApplied,
  VariablesOf
} from './types.js';

const DEFAULT_OPEN = '{{';
const DEFAULT_CLOSE = '}}';

type AnyVars = Readonly<Record<string, unknown>>;

function makePartialApplied<
  Strings extends readonly string[],
  Open extends string,
  Close extends string,
  Bound extends string
>(
  segments: Strings,
  open: Open,
  close: Close,
  bound: AnyVars
): PartialApplied<Strings, Open, Close, Bound> {
  const remaining = extractPlaceholders(segments, open, close).filter(
    (p) => !(p in bound)
  ) as unknown as ReadonlyArray<
    Exclude<ExtractPlaceholders<Strings, Open, Close>, Bound>
  >;
  return {
    strings: segments,
    open,
    close,
    placeholders: remaining,
    with(
      vars: VariablesOf<Exclude<ExtractPlaceholders<Strings, Open, Close>, Bound>>
    ): string {
      return renderTemplate(segments, open, close, {
        ...bound,
        ...(vars as AnyVars)
      });
    }
  };
}

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
        vars as AnyVars
      );
    },
    partial<const Bound extends ExtractPlaceholders<readonly [S], '{{', '}}'>>(
      vars: { readonly [K in Bound]: string }
    ): PartialApplied<readonly [S], '{{', '}}', Bound> {
      return makePartialApplied<readonly [S], '{{', '}}', Bound>(
        segments,
        '{{',
        '}}',
        vars as AnyVars
      );
    }
  };
}
