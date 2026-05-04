---
id: 003
title: `.with({...})` exact-key enforcement
status: done
depends_on: [002]
---

## Goal

Implement `.with(vars)`: returns the rendered string, with exact-key type checking against the inferred placeholder set.

## Acceptance criteria

### Type level

- [x] Vars argument type matches the inferred placeholders exactly — extra keys are an error, missing keys are an error
- [x] Each key's value type defaults to `string`. (Other types are NOT supported in v0.1 — keep the surface tight.)
- [x] Empty-placeholder case: `.with({})` works; `.with({foo: 'bar'})` errors

### Runtime

- [x] Returns the rendered string with placeholders substituted
- [x] Substitution is scoped — `{{x}}` is replaced; literal `{...}` content (without double-brace) is left alone
- [x] Coerce values via `String(value)` at the substitution boundary — defensive

### Tests

- [x] `tests/types/with-method.test-d.ts` — extra key, missing key, wrong-type value, exact-match passes
- [x] `tests/runtime/with-method.test.ts` — basic substitution, multiple placeholders, repeated placeholder, no placeholders, JSON-content-with-no-placeholders is left untouched

## References

- CONTEXT.md — variables object
- ADR-0001 — JSON-collision rationale (the `{{ }}` parser must NOT match identifiers inside literal `{...}` content)

## Notes

The "scoped substitution" criterion is the JSON-collision-safety claim from ADR-0001. Test it explicitly: `prompt('Output: {"name": "alice"} for {{user}}').with({ user: 'bob' })` must NOT try to bind `name` or `alice`. Only `{{user}}` is a placeholder; `{"name":...}` is literal JSON content and stays exactly as written.

Implementing this issue surfaced that TypeScript does not preserve literal types in tagged-template `strings` inference (microsoft/TypeScript#47660). The compile call was switched from ``prompt`...` `` to `prompt('...')` to recover the literal string via `<const S extends string>` parameter inference. See ADR-0002 "Why a function call instead of a tagged template" and the post-implementation note in issue 002.
