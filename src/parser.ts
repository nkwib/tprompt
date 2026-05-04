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

export function renderTemplate(
  strings: readonly string[],
  open: string,
  close: string,
  vars: Readonly<Record<string, unknown>>
): string {
  const re = makePlaceholderRegex(open, close);
  let out = '';
  for (const segment of strings) {
    out += segment.replace(re, (_match, name: string) => String(vars[name]));
  }
  return out;
}
