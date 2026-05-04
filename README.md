# tprompt

Type-safe prompt template library for TypeScript. A 2KB primitive that turns prompt placeholder typos into `tsc` errors before they reach the model.

tprompt is **variables only, no template logic** — no `{{#if}}`, no loops, no DSL. If you need conditionals or iteration, build them in TypeScript and pass strings.

## Quick start

```sh
pnpm add tprompt
# Optional, only if you want runtime validation:
pnpm add zod
```

```ts
import { prompt } from 'tprompt';

const greet = prompt('Hello, {{name}}!');

console.log(greet.with({ name: 'world' }));
// "Hello, world!"

// Typo? `tsc` flags it before the program runs:
greet.with({ nme: 'world' });
//          ^^^^ Property 'name' is missing in type
```

[**Try it in the TS Playground**](https://www.typescriptlang.org/play/#code/PTAEBcAcCcHsFtLggT0gUwLSwHYBsVQBncAVwCNQAzWaUAFQGVQAFPAQxQHM5ScATAHQAoEKACSOUO1DR07PKBiwAVugDGyFLFKgA7jrz990AJbh0oAAanEtZAG8lcRMgC+1F6ADkUF0m8rUEAUAlEwcAALUyJiMkpo0FN8JPRjCPQ5YlgIdNYObl4BUDwkgGt9WlKYvXMInWQcSHgRYXA0SwAZdHALOgBeYVBQAB8fdm8Rn3IJ0e91GZ9+Be90ZaplrmWI5dNllW9Bye9S5bxl+GWcZdhlyGWAR2XoZaJl8AOh2dJlgDdlvWWAA9lihlgAvD5HACCywAQssAMLLAAiywAossAGLLADiywAEstxMsAFKQ2YAaWWHWWAFllgA5ZYAeWWLGWAEVlgAlZaMZb0ck+ACqywAassAOrLAAaywAmssAFrLAD63gA3K12hJ+AiIux+qAuj0MkcAAzeYbeACMVu8ACZ7QBme0AFntAFZ7QA2e0AdntAA57QBOTXajC6+jsUx4AA8zHQgIsAhiJDMOC4AD5QAMhkmU+g0z4JgB+CDQUjoQ4ALlAhdT-BiVgAJA5xHqDdA3O2klQzdy3EEK52Y3H49zc-WqAoiOgtW0o+IiJ3E6Bk030+BMzm84dG8Xm9Z2yber2HP3B8PQKP+OOE1PQDO5wvI5Y0SnoOxNGwf+g6iMDIiHXTcj23XcABpQChdR1A3IsSwzJIuDzUAcHQH4MlzfMGwQrcTwcZCszcBwHD7HABzoMU3FoiiqNAbl0BIYdDiGUdV34eMxVzMCSx3as2KGW9QE-Hcf3AP91AA2AgOgECmJIaDYPg0YeKEoZ6zE79fw4aTAP4YDJ2Y8BlLg7MhPrFTFx1MVDVMdhyDwZjmSoeMWHw8DYl3HDDgAbRYABdTySz8jCsOgYKKyY9RaC44iuGg8LsOfUAnDkdh+FwAhQD8ilEikIL6wS0A3C1JJelnaTQARBBIDjVJQMQ48EtzBxDhqSIAAofkNIh6zssxHOcohXPjbSJKkmS5JAxhs2zABKYqdxQrU3GEQz1A4TIqD4TRTFwZw6vAeNYpwEg8L4lqVqzbMuosRAOAsetGCWmq6oari5q1MJQEAAFIAcBoHgZB0GwfBiHIcB376FyPRUi4dB6zkHB2HgSwyNIIhoAZNH0FoiBskx+ccbxgnyHQPBYD0QnQC2+Q6EiSwMjgaARDEKHOa57nueEYQzounh0G6NDlFcLrDm8fFKap6DidJ9HaIAQlAeUdDoSAOCkBIyM19gcHoUwMgJrqqfUBQkbShwzYt2iFsEA4Fp+oXukETqIi69qhixjJcfR+tvAUUxpO8aCxEABMJWDgDBoDaHwsYV1ZEhieBoiIFCCtQDBoO8H3E4mLLmPQ2BkGTaJwEOPWDaN6AA+UUPDht5yA+LTBhX5YQ3Cd4QgA) — rename `{{usrName}}` back to `{{userName}}` to clear the error.

## Multi-turn: `.partial({...})`

Pre-bind a subset; the rest get supplied later. Partials don't compose — the return type drops `.partial`, so `.partial(...).partial(...)` is a `tsc` error.

```ts
const support = prompt('You are a {{role}} agent for {{userName}}.');

const adminSupport = support.partial({ role: 'support' });
adminSupport.with({ userName: 'alice' });
// "You are a support agent for alice."
```

## Pluggable delimiter

The default `prompt` is `makePromptTag({ open: '{{', close: '}}' })`. The factory ships from day one for two cases: collisions (a meta-prompt that itself contains `{{...}}` content) and ecosystem porters (LangChain / BAML / OpenAI's prompt cookbook all use `{{var}}`, but f-string-style projects use `{var}`).

```ts
// Bring your own delimiter:
import { makePromptTag } from 'tprompt';

const angle = makePromptTag({ open: '<<', close: '>>' });
angle('Hi <<name>>').with({ name: 'world' });
// "Hi world"
```

```ts
// Pre-applied {var} variant:
import { prompt } from 'tprompt/single-brace';

prompt('Hi {name}').with({ name: 'world' });
// "Hi world"
```

`{var}` is **opt-in only**. The default uses `{{var}}` because LLM prompts routinely contain literal JSON (`{"name": "alice"}`) and a single-brace parser would silently match identifiers inside that content. See [ADR-0001](./docs/adr/0001-default-delimiter.md) for the full reasoning.

## ESM / CJS

Transparent — the same `import` (or `require`) of `'tprompt'` resolves to the right bytes per environment via conditional exports. There is no `tprompt/compat` subpath; module-system interop is handled invisibly. See [ADR-0003](./docs/adr/0003-esm-cjs-interop-boundary.md).

`engines.node` is `>= 20`. `sideEffects: false` is honoured by all modern bundlers (Vite, esbuild, webpack 5+, Rollup) — the 2KB pitch holds at consumer level.

## Runtime validation: `.validate()` and `.validateSafe()`

Two modes, by design.

```ts
import { z } from 'zod';

// Throws on invalid input. The default. Errors are model-side bugs;
// crashing loud at the boundary keeps them out of production prompts.
const greet = prompt('Hi {{name}}').validate(
  z.object({ name: z.string().min(2) })
);
greet.with({ name: 'a' });          // throws ZodError

// Returns a Result discriminated union. Use this when you're handling
// user input that *might* be wrong, and you want the failure as a value.
const safe = prompt('Hi {{name}}').validateSafe(
  z.object({ name: z.string().min(2) })
);
const result = safe.with({ name: 'a' });
if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

These two methods are the hardest API to explain — read the section above slowly. The default is `.validate()` (throws). Reach for `.validateSafe()` only when the failure is a value you want to inspect. Mixing them produces dead code; pick one per call site.

`zod` is an **optional** peer dependency — tprompt accepts any object with `.parse(value)` and `.safeParse(value)` shape, so Valibot, ArkType, or your own validator all work. The library never imports `zod` at module load; the validation surface is structural.

## Non-goals

tprompt is **variables only**. No template logic, no expression placeholders, no DSL.

- No `{{#if}}`, `{{#each}}`, conditionals, or loops.
- No expressions inside placeholders (`{{ user.name }}` is not a placeholder).
- No nested placeholders (`{{ {{inner}} }}` is not supported).

If you need any of the above, build it in TypeScript and pass strings into `.with({...})`. Pull requests that introduce template logic, expression syntax, or scope-creep beyond a single identifier will be closed with a link to [ADR-0001](./docs/adr/0001-default-delimiter.md) and the non-goals section above.

## Documentation

- [`CONTEXT.md`](./CONTEXT.md) — canonical glossary; terms used in code-level naming
- [ADR-0001](./docs/adr/0001-default-delimiter.md) — default delimiter is `{{var}}`
- [ADR-0002](./docs/adr/0002-pluggable-parser-architecture.md) — single generic + factory + pre-applied subpath exports
- [ADR-0003](./docs/adr/0003-esm-cjs-interop-boundary.md) — ESM-source dual-publish, the five non-negotiable invariants

## License

MIT — see [LICENSE](./LICENSE).
