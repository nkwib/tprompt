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

export interface ParserOptions<Open extends string, Close extends string> {
  readonly open: Open;
  readonly close: Close;
}

type AnyVars = Readonly<Record<string, unknown>>;

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
    with(vars): string {
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

function makeCompiled<
  Strings extends readonly string[],
  Open extends string,
  Close extends string
>(
  segments: Strings,
  open: Open,
  close: Close
): Compiled<Strings, Open, Close> {
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
      return renderTemplate(segments, open, close, vars as AnyVars);
    },
    partial(boundVars) {
      return makePartialApplied(segments, open, close, boundVars as AnyVars);
    },
    validate(schema): Validated<Strings, Open, Close> {
      return makeValidated(segments, open, close, (vars) => {
        schema.parse(vars);
      });
    },
    validateSafe(schema): ValidatedSafe<Strings, Open, Close> {
      return makeValidatedSafe(segments, open, close, (vars) =>
        schema.safeParse(vars)
      );
    }
  };
}

export function makePromptTag<O extends string, C extends string>(
  options: ParserOptions<O, C>
): <const S extends string>(template: S) => Compiled<readonly [S], O, C> {
  const { open, close } = options;
  return <const S extends string>(template: S): Compiled<readonly [S], O, C> => {
    const segments = [template] as unknown as readonly [S];
    return makeCompiled<readonly [S], O, C>(segments, open, close);
  };
}
