---
id: 002
title: Core `prompt` compile call with type-level placeholder extraction
status: done
depends_on: [001]
---

> **Note (post-implementation):** the original framing was a tagged template (``prompt`...` ``). Switched to a regular function call (`prompt('...')`) at issue 003 time, because TypeScript does not preserve literal types in tagged-template `strings` inference (microsoft/TypeScript#47660). See ADR-0002 "Why a function call instead of a tagged template" for the full reasoning. The acceptance criteria below remain met by the function-call form.

## Goal

Implement the `prompt` function. Parse `{{var}}` placeholders into a TypeScript literal-string type, infer the variables-object type from the placeholder set, and return a compiled-template object with a stub for `.with`.

## Acceptance criteria

### Type level

- [x] `ExtractPlaceholders<Strings, Open, Close>` recursive template-literal type extracts identifiers between `Open` and `Close` delimiters from a `readonly [string]`-shaped tuple (one segment, since the compile call takes one literal string)
- [x] Generic — works for any `Open` / `Close` string literals, not hard-coded to `{{` / `}}`
- [x] Identifier shape: `[A-Za-z_][A-Za-z0-9_]*` only — anything else is not extracted (no validation error, just non-extraction)
- [x] Duplicates dedupe at type level: `prompt('{{x}} {{x}}')` infers `{ x: string }`, not `{ x: string; x: string }`
- [x] Empty case: `prompt('no vars')` infers an empty variables type — pick `Record<string, never>` over `{}` for cleaner `.with()` ergonomics

### Runtime

- [x] `prompt` is a function `<const S extends string>(template: S) => Compiled<readonly [S], '{{', '}}'>` — preserves literal-string types via `const` parameter inference
- [x] Returns a compiled-template object carrying the original template (consumed by `.with` / `.partial` / `.validate` in later issues)
- [x] Default delimiter is `{{ }}` per ADR-0001

### Tests

- [x] `tests/types/extract-placeholders.test-d.ts` — single placeholder, multiple, duplicates, no placeholders, identifiers with underscores/digits
- [x] `tests/runtime/prompt-tag.test.ts` — `prompt(...)` call returns an object that holds the template string

## References

- ADR-0001 — default delimiter `{{var}}`
- ADR-0002 — single generic at type level: `Compiled<Strings, Open, Close>` and `ExtractPlaceholders<Parts, Open, Close>`
- CONTEXT.md — terms: tagged template, placeholder, parser, compiled template

## Notes

The "single generic + factory" architecture from ADR-0002 means the type-level extractor is parameterised over `Open` and `Close` from the start. Don't hard-code `{{` / `}}` into the type-level recursion — bind them at the named-export level when `makePromptTag` lands in issue 006. The default-export `prompt` in this issue can hard-code `{{ }}` at the value level for now and be re-implemented as `makePromptTag({ open: '{{', close: '}}' })` in issue 006.

**On the call shape:** the compile call uses `<const S extends string>(template: S)` rather than a tagged template because TypeScript does not preserve literal types in tagged-template `strings` inference (microsoft/TypeScript#47660). With the function-call shape, `S` carries the literal string into `ExtractPlaceholders<readonly [S], '{{', '}}'>` and the placeholder set is recovered cleanly. See ADR-0002 for full reasoning.
