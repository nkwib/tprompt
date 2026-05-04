---
id: 004
title: `.partial({...})` for multi-turn (no composition)
status: open
depends_on: [003]
---

## Goal

Implement `.partial(vars)`: pre-binds a subset of placeholders, returns a new compiled template that requires only the remaining placeholders. Partials do not compose — the type returned by `.partial` does NOT expose another `.partial` method.

## Acceptance criteria

### Type level

- [ ] `.partial(vars)` accepts a strict subset of the placeholder keys (NOT `Partial<Vars>`)
- [ ] Return type narrows the placeholder set to the unbound keys
- [ ] Return type does NOT have a `.partial` method — `.partial(...).partial(...)` is a compile error
- [ ] Return type DOES have `.with`, `.validate`, `.validateSafe`

### Runtime

- [ ] Pre-binds the supplied keys; subsequent `.with(rest)` substitutes both the partial values and the rest

### Tests

- [ ] `tests/types/partial-method.test-d.ts` — narrowed placeholder set; `.partial().partial()` is a type error; `.with` after `.partial` works
- [ ] `tests/runtime/partial-method.test.ts` — partial values appear in `.with()` output

## References

- CONTEXT.md — variables object
- Round-table final.md (in `~/code/idea/sessions/2026-05-03-type-safe-prompt-template-library/`) — "partials do not compose" rule, captured in MVP scope

## Notes

"No composition" enforced at the type level, not the runtime. The runtime can still chain partials internally; the type contract is what guides the user. Simplest type-level fix: `.partial` returns a type whose method shape excludes `.partial`.
