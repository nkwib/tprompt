---
id: 006
title: `makePromptTag` factory + `/single-brace` subpath
status: done
depends_on: [002, 003]
---

## Goal

Expose the parser as a pluggable factory. Replace the default-export `prompt` from issue 002 with `makePromptTag({ open: '{{', close: '}}' })`. Ship a pre-applied `{var}` variant at the `tprompt/single-brace` subpath.

> **Note:** the factory returns a compile-call function `<const S extends string>(template: S) => Compiled<readonly [S], O, C>`, not a tagged-template function. The `Tag` in `makePromptTag` is kept for ecosystem familiarity (LangChain/BAML use "tag" as a noun) — see ADR-0002.

## Acceptance criteria

### API

- [x] `makePromptTag({ open, close })` returns a compile-call function specialised to the supplied delimiter
- [x] Argument is an object literal — never positional — per ADR-0002
- [x] Default export of `tprompt` is `prompt = makePromptTag({ open: '{{', close: '}}' })`
- [x] `tprompt/single-brace` exports `prompt = makePromptTag({ open: '{', close: '}' })`
- [x] Type inference quality is identical for the default `prompt`, the `single-brace` `prompt`, and any user-defined `makePromptTag(...)` call — `ExtractPlaceholders` is generic, not specialised

### Build / package

- [x] `tsup.config.ts` already lists `src/single-brace.ts` as an entry — verify it produces `dist/single-brace.js`, `.cjs`, `.d.ts`
- [x] `package.json#exports` already wires `./single-brace` per ADR-0003 — verify `import { prompt } from 'tprompt/single-brace'` resolves correctly after build (deferred tarball-install verification to issue 012; build outputs verified)

### Tests

- [x] `tests/types/factory.test-d.ts` — custom delimiters (e.g. `<<` `>>`) get the same inference as `{{` `}}`
- [x] `tests/runtime/factory.test.ts` — round-trip through `makePromptTag` matches the default `prompt` for `{{` `}}`
- [x] `tests/runtime/single-brace.test.ts` — `single-brace` subpath substitutes `{var}` correctly

## References

- ADR-0001 — `{var}` shipped as a named export from day one (LangChain/BAML port subcommunity)
- ADR-0002 — single generic + factory + pre-applied subpath; subpath namespace reserved for behaviour variants
- ADR-0003 — conditional exports map already wired

## Notes

ADR-0002's "subpath namespace is reserved for behaviour variants" rule is enforced here. Don't add a `/compat` or `/cjs` subpath. Conditional exports handle module-system interop invisibly.
