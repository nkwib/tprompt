---
id: 005
title: `.validate()` and `.validateSafe()` with Zod peer
status: open
depends_on: [003]
---

## Goal

Add runtime validation. `.validate(schema)` returns a compiled template that throws on `.with()` if the variables fail the schema. `.validateSafe(schema)` returns one whose `.with()` returns a Result (`{ ok: true; value } | { ok: false; error }`).

## Acceptance criteria

### Type level

- [ ] `validate` and `validateSafe` accept a schema whose parsed output structurally matches the inferred placeholder set
- [ ] After `.validate()`, the return type still has `.with` (and `.partial` if upstream)
- [ ] After `.validateSafe()`, `.with(vars)` returns the Result discriminated union, not raw `string`

### Runtime

- [ ] `.validate(schema).with(vars)` re-throws Zod errors on invalid input
- [ ] `.validateSafe(schema).with(vars)` returns `{ ok: false, error }` on invalid input — never throws
- [ ] On valid input, both produce the substituted string (the `value` field for safe mode)
- [ ] Zod is a `peerDependencies` entry, marked optional via `peerDependenciesMeta` — the library does NOT import Zod at module load (per ADR-0003 invariant 5)

### Tests

- [ ] `tests/types/validate.test-d.ts` — schema misaligned with placeholders is a type error; safe-mode return type is a Result discriminated union
- [ ] `tests/runtime/validate.test.ts` — throw-on-invalid, valid passes, safe-mode Result both branches

## References

- ADR-0003 (invariant 5) — no module-init work; the Zod integration must be resolved at call time, not at import time
- Round-table final.md — `.validate()` throw default + `.validateSafe()` Result; "must be explained aggressively in the README or it becomes a PR magnet"

## Notes

The schema integration must NOT add a hard dependency on Zod. Accept anything with a `parse` / `safeParse` shape — that keeps users on Valibot, ArkType, etc. unblocked even though Zod is the documented peer. Type the input as a structurally compatible interface, not `z.ZodType`.
