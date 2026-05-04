import type {
  Compiled,
  ExtractPlaceholders,
  PartialApplied,
  SchemaLike,
  Validated,
  ValidatedPartial,
  ValidatedSafe,
  ValidatedSafePartial,
  ValidationResult,
  VariablesOf
} from './types.js';
import { extractPlaceholders, renderTemplate } from './parser.js';

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
    },
    validate(schema): ValidatedPartial<Strings, Open, Close, Bound> {
      return makeValidatedPartial<Strings, Open, Close, Bound>(
        segments,
        open,
        close,
        bound,
        (rest) => {
          schema.parse(rest);
        }
      );
    },
    validateSafe(schema): ValidatedSafePartial<Strings, Open, Close, Bound> {
      return makeValidatedSafePartial<Strings, Open, Close, Bound>(
        segments,
        open,
        close,
        bound,
        (rest) => schema.safeParse(rest)
      );
    }
  };
}

function makeValidated<
  Strings extends readonly string[],
  Open extends string,
  Close extends string
>(
  segments: Strings,
  open: Open,
  close: Close,
  validateFull: (vars: AnyVars) => void
): Validated<Strings, Open, Close> {
  const placeholders = extractPlaceholders(
    segments,
    open,
    close
  ) as ReadonlyArray<ExtractPlaceholders<Strings, Open, Close>>;
  return {
    strings: segments,
    open,
    close,
    placeholders,
    with(vars): string {
      validateFull(vars as AnyVars);
      return renderTemplate(segments, open, close, vars as AnyVars);
    },
    partial(boundVars) {
      const bound = boundVars as AnyVars;
      return makeValidatedPartial(segments, open, close, bound, (rest) => {
        validateFull({ ...bound, ...rest });
      });
    }
  };
}

function makeValidatedPartial<
  Strings extends readonly string[],
  Open extends string,
  Close extends string,
  Bound extends string
>(
  segments: Strings,
  open: Open,
  close: Close,
  bound: AnyVars,
  validateRest: (rest: AnyVars) => void
): ValidatedPartial<Strings, Open, Close, Bound> {
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
    with(vars): string {
      const rest = vars as AnyVars;
      validateRest(rest);
      return renderTemplate(segments, open, close, { ...bound, ...rest });
    }
  };
}

function makeValidatedSafe<
  Strings extends readonly string[],
  Open extends string,
  Close extends string
>(
  segments: Strings,
  open: Open,
  close: Close,
  safeParseFull: (vars: AnyVars) => { success: boolean; error?: unknown }
): ValidatedSafe<Strings, Open, Close> {
  const placeholders = extractPlaceholders(
    segments,
    open,
    close
  ) as ReadonlyArray<ExtractPlaceholders<Strings, Open, Close>>;
  return {
    strings: segments,
    open,
    close,
    placeholders,
    with(vars): ValidationResult {
      const result = safeParseFull(vars as AnyVars);
      if (!result.success) {
        return { ok: false, error: result.error };
      }
      return {
        ok: true,
        value: renderTemplate(segments, open, close, vars as AnyVars)
      };
    },
    partial(boundVars) {
      const bound = boundVars as AnyVars;
      return makeValidatedSafePartial(segments, open, close, bound, (rest) =>
        safeParseFull({ ...bound, ...rest })
      );
    }
  };
}

function makeValidatedSafePartial<
  Strings extends readonly string[],
  Open extends string,
  Close extends string,
  Bound extends string
>(
  segments: Strings,
  open: Open,
  close: Close,
  bound: AnyVars,
  safeParseRest: (rest: AnyVars) => { success: boolean; error?: unknown }
): ValidatedSafePartial<Strings, Open, Close, Bound> {
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
    with(vars): ValidationResult {
      const rest = vars as AnyVars;
      const result = safeParseRest(rest);
      if (!result.success) {
        return { ok: false, error: result.error };
      }
      return {
        ok: true,
        value: renderTemplate(segments, open, close, { ...bound, ...rest })
      };
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
    },
    validate(schema): Validated<readonly [S], '{{', '}}'> {
      return makeValidated<readonly [S], '{{', '}}'>(segments, '{{', '}}', (vars) => {
        schema.parse(vars);
      });
    },
    validateSafe(schema): ValidatedSafe<readonly [S], '{{', '}}'> {
      return makeValidatedSafe<readonly [S], '{{', '}}'>(segments, '{{', '}}', (vars) =>
        schema.safeParse(vars)
      );
    }
  };
}
