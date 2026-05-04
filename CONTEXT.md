# promptkit

A 2KB TypeScript library that makes LLM prompt variables a first-class type. A typo in `{{usrName}}` becomes a `tsc` error before it reaches the model.

## Language

**Compile call**:
The `prompt` function invoked as `prompt('...template...')` with a string literal argument. The function receives the literal string and the parser inspects it to extract placeholder names — TypeScript performs the same extraction at the type level on the literal string type, preserved across the call by the `const` type parameter.
_Avoid_: tagged template (TS does not preserve literal types in tagged-template inference; that form is not supported as the type-safe entry point), tag function

**Delimiter**:
The pair of character sequences that wrap a placeholder in source. Default is `{{` … `}}`. Pluggable per-call site via a parser argument.
_Avoid_: braces (default-only), markers, brackets

**Placeholder**:
The named slot inside the delimiter, e.g. the `userName` in `{{userName}}`. Always a single identifier matching `[A-Za-z_][A-Za-z0-9_]*`. Never an expression.
_Avoid_: variable (overloaded with the runtime values object), interpolation (suggests JS `${}`), slot (overloaded with Web Components)

**Variables object**:
The object passed to `.with({...})` or `.partial({...})`. Its required keys are inferred from the placeholders in the template.
_Avoid_: bindings, params, context

**Parser**:
The pair (delimiter-pair, placeholder regex) that extracts placeholders at runtime AND the matching template literal type that extracts them at compile time. Both halves must agree or types and runtime drift apart.
_Avoid_: lexer, tokenizer

**Compiled template**:
The value returned by the `prompt` call — carries the original template string, the inferred placeholder set, and the `.with` / `.partial` / `.validate` / `.validateSafe` methods.
_Avoid_: rendered template (suggests `.with()` was already called)

## Relationships

- A **Compile call** produces a **Compiled template** typed by the **Placeholder** set extracted from its source under the active **Parser**.
- The **Parser** is the single source of truth: its delimiter pair governs both runtime extraction and the compile-time template literal type. Changing the parser changes both halves in lock-step or the abstraction is broken.
- A **Variables object** must structurally match the **Placeholder** set of the **Compiled template** it is applied to.

## Example dialogue

> **Dev:** "If I switch the delimiter to `{var}`, do I need a different `prompt` import?"
> **Library author:** "No — `makePromptTag` accepts a parser argument and returns a `prompt` specialised to that delimiter pair. The compile-time literal-string type is generic over the delimiter pair, so the same source file handles both. The parser is the unit of variation, not the call shape."

> **Dev:** "Can I put a placeholder inside another placeholder, like `{{ {{inner}} }}`?"
> **Library author:** "No. A placeholder is a single identifier — never an expression. If you need composition, use `.partial({...})` to pre-bind some keys, then `.with({...})` for the rest."

> **Dev:** "Why isn't this a tagged template?"
> **Library author:** "TypeScript does not preserve literal types in tagged-template `strings` inference (microsoft/TypeScript#47660, open since 2021). A regular function call with `<const S extends string>(template: S)` does preserve them, which is what makes the type-safety wedge work."

## Flagged ambiguities

- "variable" was used for both the placeholder name and the runtime value — resolved: the source-level slot is a **Placeholder**, and the runtime values are the **Variables object**.
- "delimiter" was almost used to mean *just the opening sequence* (`{{`) — resolved: a **Delimiter** is the pair `(open, close)`, never one half alone.
- "tagged template" was the original framing — resolved: TS literal-type preservation forces a function-call shape; the term **Compile call** replaces it across the codebase.
