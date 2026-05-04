---
id: 003
title: `.with({...})` exact-key enforcement
status: open
depends_on: [002]
---

## Goal

Implement `.with(vars)`: returns the rendered string, with exact-key type checking against the inferred placeholder set.

## Acceptance criteria

### Type level

- [ ] Vars argument type matches the inferred placeholders exactly — extra keys are an error, missing keys are an error
- [ ] Each key's value type defaults to `string`. (Other types are NOT supported in v0.1 — keep the surface tight.)
- [ ] Empty-placeholder case: `.with({})` works; `.with({foo: 'bar'})` errors

### Runtime

- [ ] Returns the rendered string with placeholders substituted
- [ ] Substitution is scoped — `{{x}}` is replaced; literal `{...}` content (without double-brace) is left alone
- [ ] Coerce values via `String(value)` at the substitution boundary — defensive

### Tests

- [ ] `tests/types/with-method.test-d.ts` — extra key, missing key, wrong-type value, exact-match passes
- [ ] `tests/runtime/with-method.test.ts` — basic substitution, multiple placeholders, repeated placeholder, no placeholders, JSON-content-with-no-placeholders is left untouched

## References

- CONTEXT.md — variables object
- ADR-0001 — JSON-collision rationale (the `{{ }}` parser must NOT match identifiers inside literal `{...}` content)

## Notes

The "scoped substitution" criterion is the JSON-collision-safety claim from ADR-0001. Test it explicitly: ``prompt`Output: {"name": "alice"} for {{user}}`.with({ user: 'bob' })`` must NOT try to bind `name` or `alice`. Only `{{user}}` is a placeholder; `{"name":...}` is literal JSON content and stays exactly as written.
