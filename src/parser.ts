const REGEX_META = /[.*+?^${}()|[\]\\]/g;

function escapeRegex(literal: string): string {
  return literal.replace(REGEX_META, '\\$&');
}

const IDENTIFIER_PATTERN = '[A-Za-z_][A-Za-z0-9_]*';

export function makePlaceholderRegex(open: string, close: string): RegExp {
  return new RegExp(
    `${escapeRegex(open)}(${IDENTIFIER_PATTERN})${escapeRegex(close)}`,
    'g'
  );
}

export function extractPlaceholders(
  strings: readonly string[],
  open: string,
  close: string
): readonly string[] {
  const seen = new Set<string>();
  const re = makePlaceholderRegex(open, close);
  for (const segment of strings) {
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(segment)) !== null) {
      const name = match[1];
      if (name !== undefined) seen.add(name);
    }
  }
  return [...seen];
}

export interface RenderOptions {
  /**
   * Behavior when a placeholder identifier is missing (or `undefined`) in the
   * supplied variables object. Defaults to `'throw'`, which crashes loud at the
   * boundary so type-bypassed missing keys do not silently render as the
   * literal string `"undefined"` inside a prompt sent to a model.
   *
   * - `'throw'`: throw a `MissingPlaceholderError` listing the offending keys.
   * - `'insert-undefined'`: legacy behavior — coerce missing values via
   *   `String(value)`, which emits `"undefined"` for absent keys.
   */
  readonly onMissing?: 'throw' | 'insert-undefined';
}

export class MissingPlaceholderError extends Error {
  readonly missing: readonly string[];
  constructor(missing: readonly string[]) {
    super(
      `tprompt: missing placeholder value(s): ${missing
        .map((k) => `"${k}"`)
        .join(', ')}`
    );
    this.name = 'MissingPlaceholderError';
    this.missing = missing;
  }
}

export function renderTemplate(
  strings: readonly string[],
  open: string,
  close: string,
  vars: Readonly<Record<string, unknown>>,
  options?: RenderOptions
): string {
  const onMissing = options?.onMissing ?? 'throw';
  const re = makePlaceholderRegex(open, close);
  const missing: string[] = [];
  let out = '';
  for (const segment of strings) {
    out += segment.replace(re, (_match, name: string) => {
      const value = vars[name];
      if (value === undefined && !(name in vars)) {
        if (onMissing === 'throw') {
          if (!missing.includes(name)) missing.push(name);
          return '';
        }
      }
      return String(value);
    });
  }
  if (missing.length > 0) {
    throw new MissingPlaceholderError(missing);
  }
  return out;
}
