---
status: accepted
---

# Pluggable-parser architecture: single generic + factory + pre-applied subpath exports

The library exposes parser pluggability through three coordinated layers:

1. **Type level** — a single generic `Compiled<Strings, Open, Close>` parameterised over the delimiter pair, with one `ExtractPlaceholders<Parts, Open, Close>` recursion that powers every method signature (`.with`, `.partial`, `.validate`, `.validateSafe`).
2. **Runtime primitive** — a single factory `makePromptTag({ open, close })` that returns a `prompt`-shaped function (`<const S extends string>(template: S) => Compiled<readonly [S], open, close>`) specialised to that delimiter pair. The argument is an object literal, never positional, so future options (`escape`, `caseSensitive`, custom placeholder regex) can be added without a breaking signature change.
3. **Surface ergonomics** — pre-applied named exports for the common delimiters, shipped as **subpath exports for behaviour variants only**:
   - `promptkit` → `makePromptTag({ open: '{{', close: '}}' })`
   - `promptkit/single-brace` → `makePromptTag({ open: '{', close: '}' })`
   - any future delimiter flavour gets its own subpath under the same convention.

The factory name `makePromptTag` predates the call-shape decision and is kept for ecosystem familiarity ("tag" reads as "the thing that consumes a template" in the LangChain/BAML sense). The factory returns a plain compile-call function; tagged-template syntax is not the public surface — see the section below.

## Why a function call instead of a tagged template

The original framing was a tagged template: ``prompt`Hello {{name}}` ``. This was rejected at implementation time, after testing, because TypeScript does not preserve literal types in tagged-template `strings` inference. By the time `ExtractPlaceholders` runs, the input tuple has been widened to `readonly string[]`, the placeholder set collapses to `never`, and `.with({...})` becomes `(vars: Record<string, never>) => string` — useless. This is a known TypeScript limitation, [microsoft/TypeScript#47660](https://github.com/microsoft/TypeScript/issues/47660), open since 2021.

A regular function call with `<const S extends string>(template: S)` does preserve the literal — verified against TypeScript 5.9.3 with the project's tsconfig. The call shape is ergonomic enough (`prompt('Hello {{name}}').with({ name: 'Alice' })`), and the type-safety wedge that motivates the library only works with this shape.

This means the same source file ``prompt`Hello {{name}}` `` would either fail to compile (if `prompt` is typed `(template: string)`) or compile to `vars: Record<string, never>` if we tried to accept tagged-template syntax in addition. Neither is desirable, so the library exposes only the function-call shape.

## Why this shape

- **Single generic at the type level** is forced once the factory exists — N hard-coded compiled-template types per delimiter would require duplicating every method signature and would foreclose user-defined delimiters entirely. The generic costs nothing at the type-checker level (both shapes recurse over the strings array; the only delta is whether `Open`/`Close` are bound at definition or call site).
- **Factory-only would be dishonest.** "Pluggable from day one" is a public promise in the README's first paragraph. If the only path to a non-default delimiter is `makePromptTag` and 95% of readers see only `import { prompt } from 'promptkit'`, the promise reads as marketing — they'll assume `{{var}}` is hard-coded.
- **Named-exports-only would be brittle.** A user with prompts containing literal `{{...}}` content (meta-prompts, prompts about Mustache itself, prompts that reference templating syntax) needs a per-call-site delimiter swap without a library release. `makePromptTag({ open: '<<', close: '>>' })` solves it in one line.
- **The 2KB tree-shaking objection to a factory dissolves.** The factory is ~200 bytes of generic code shared by every pre-applied function; there is no version of this where dropping the factory saves a meaningful fraction of the bundle.

## Subpath namespace is reserved for behaviour variants

Every `promptkit/X` subpath must denote a *behavioural* variant (delimiter, escape policy, future runtime flavour). Module-system interop (ESM/CJS) is **not** a behaviour variant and must not consume a subpath. See [ADR-0003](./0003-esm-cjs-interop-boundary.md) for how dual-publish is handled instead.

## Considered options

- **Hard-coded compiled-template types per delimiter, no factory.** Rejected — duplicates every method signature, kills the per-call-site escape hatch, makes "pluggable" a lie.
- **Factory only, no pre-applied exports.** Rejected — every reader has to construct their own `prompt` before the first example works; dishonesty against the README's "pluggable from day one" framing because plugging is now mandatory ceremony.
- **Pre-applied exports only, no factory.** Rejected — closes off custom delimiters entirely, forces a library release for every collision case.
- **Tagged-template surface (``prompt`Hello {{name}}` ``).** Rejected at implementation time — TypeScript does not preserve literal types in tagged-template `strings` inference, so the placeholder set collapses to `never` and `.with({...})` cannot type-check the variables object. See the section above.
- **Uniform subpath naming for both delimiter variants AND module-system interop** (i.e. `promptkit/compat` alongside `promptkit/single-brace`). Rejected — the two are categorically different (behaviour vs. module system); collapsing them confuses readers of `package.json` and creates a documentation surface that has to explain "some subpaths are interop, some are flavour, here's how to tell." Conditional exports handle module-system interop invisibly (ADR-0003), leaving the subpath namespace clean.
- **Positional argument to `makePromptTag(open, close)`.** Rejected — adding `escape` or `caseSensitive` later would be a breaking change. Object literal `{ open, close }` is the only forward-compatible shape.

## Consequences

- The factory is part of the public API from v0.1.0 — users will rely on it, so its signature is now under semver lock.
- Adding a new pre-applied delimiter (e.g. `promptkit/angle-brackets`) is a non-breaking minor release: new subpath, no impact on existing imports.
- The `package.json#exports` map has exactly one shape per behaviour variant, with conditional `import`/`require`/`types` keys per variant. No `/compat`, no module-system subpath.
- Power users defining their own delimiter via `makePromptTag` get the same type inference quality as the pre-applied functions — `ExtractPlaceholders` is generic, not specialised. This is the test that confirms the abstraction is real.
