---
id: 006
title: `makePromptTag` factory + `/single-brace` subpath
status: open
depends_on: [002, 003]
---

## Goal

Expose the parser as a pluggable factory. Replace the default-export `prompt` from issue 002 with `makePromptTag({ open: '{{', close: '}}' })`. Ship a pre-applied `{var}` variant at the `promptkit/single-brace` subpath.

## Acceptance criteria

### API

- [ ] `makePromptTag({ open, close })` returns a tagged-template function specialised to the supplied delimiter
- [ ] Argument is an object literal — never positional — per ADR-0002
- [ ] Default export of `promptkit` is `prompt = makePromptTag({ open: '{{', close: '}}' })`
- [ ] `promptkit/single-brace` exports `prompt = makePromptTag({ open: '{', close: '}' })`
- [ ] Type inference quality is identical for the default `prompt`, the `single-brace` `prompt`, and any user-defined `makePromptTag(...)` call — `ExtractPlaceholders` is generic, not specialised

### Build / package

- [ ] `tsup.config.ts` already lists `src/single-brace.ts` as an entry — verify it produces `dist/single-brace.js`, `.cjs`, `.d.ts`
- [ ] `package.json#exports` already wires `./single-brace` per ADR-0003 — verify `import { prompt } from 'promptkit/single-brace'` resolves correctly after build (use a tarball install in a temp dir if needed)

### Tests

- [ ] `tests/types/factory.test-d.ts` — custom delimiters (e.g. `<<` `>>`) get the same inference as `{{` `}}`
- [ ] `tests/runtime/factory.test.ts` — round-trip through `makePromptTag` matches the default `prompt` for `{{` `}}`
- [ ] `tests/runtime/single-brace.test.ts` — `single-brace` subpath substitutes `{var}` correctly

## References

- ADR-0001 — `{var}` shipped as a named export from day one (LangChain/BAML port subcommunity)
- ADR-0002 — single generic + factory + pre-applied subpath; subpath namespace reserved for behaviour variants
- ADR-0003 — conditional exports map already wired

## Notes

ADR-0002's "subpath namespace is reserved for behaviour variants" rule is enforced here. Don't add a `/compat` or `/cjs` subpath. Conditional exports handle module-system interop invisibly.
