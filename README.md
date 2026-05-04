# tprompt

Type-safe prompt template library for TypeScript. A 2KB primitive that turns prompt placeholder typos into `tsc` errors before they reach the model.

tprompt is **variables only, no template logic** — no `{{#if}}`, no loops, no DSL. If you need conditionals or iteration, build them in TypeScript and pass strings.

## Quick start

```sh
pnpm add @nkwib/tprompt
# Optional, only if you want runtime validation:
pnpm add zod
```

```ts
import { prompt } from '@nkwib/tprompt';

const greet = prompt('Hello, {{name}}!');

console.log(greet.with({ name: 'world' }));
// "Hello, world!"

// Typo? `tsc` flags it before the program runs:
greet.with({ nme: 'world' });
//          ^^^^ Property 'name' is missing in type
```

[**Try it in the TS Playground**](https://www.typescriptlang.org/play/#code/PTAEBcAcCcHsFtLggT0gUwLSwHYBsVQBncAVwCNQAzWaUAFQGVQAFPAQxQHM5ScATAHQAoEKACSOUO1DR07PKBiwAVugDGyFLFKgA7jrz990AJbh0oAAanEtZAG8lcRMgC+1F6ADkAARwA1nqm5MBQLkjeVqCAKASiYOAAFqZExGSUKaCm+NnoxonocsSwEAWsHNy8AqB42QH6tAGpwUk6yDiQ8CLC4GiWADLo4BZ0ALzCoKAAPj7s3tM+5PMz3urLPvzr3uhbVFtcW4lbplsq3hML3gFbeFvwWzhbsFuQWwCOW9BbRFvg55MrUhbABuWz0WwAHlsUFsAF7-S4AQS2ACEtgBhLYAES2AFEtgAxLYAcS2AAktuItgApBErADSW36WwAslsAHJbADyWxYWwAilsAEpbRhbeh0nwAVS2ADUtgB1LYADS2AE0tgAtLYAfW8AG4en0JPx0Yl2GNQINhoVLgAGbxTbwARkd3gATG6AMxugAsboArG6AGxugDsboAHG6AJwGo0YE30dimPAAHmY6AhFgEqRIZhwXAAfKBxpNM9n0LmfPMAPwQaCkdAXABcoArOf4qSsABIHOJTeboG4+9kqLahW5ovWB8nU2mhSW21QFER0IbeonxEQBxnQFnO3nwAXi6WLh2q13rH3rSMRw4xxOp6AZ-w5+nF6Bl6v1wnLLjs2gdhNDYYD0ESWAjEKIg9wPS8jxPAAaUBEXUdR90rat82yLhS1AHB0GBQoSzLdsMMPa8HGwws3AcBxRxwcc6FlNxWIYpjQCFdASCnC5JhnHd+DTWUSzg6tjybPjJhfUAAOPYDwFA9RwMg-hoIXbjwGQ1D0JmESpMmNs5KAkCOGUiCoOgGCuJIbS0KLKS2x0jdjVlC1THYcg8G4rkqDTFhyPgtITxIi4AG0WAAXUC6swoIojoGi+suPUWghOorhkPi4iv1AJw5HYfhcAIUAwvpLIpCitsMtANxDWyEYV2U0B0QQSBUzyWDMKvDKSwcC4WkSAAKYELSINs3LMTzvKIXy02MhSlJUyyYMYIsiwASmq48cMNNxhDU9QOCKKg+E0UxcGcNrwDTVKcBIMixJ6nbCyLIaLEQDgLDbRgtpatqOqEtbDXiUBAABSCHIah6GYdhuH4YRxHIdB+gyj0PIuHQNs5Bwdh4EsOjSCIaB2Tx9BWIgEpCbXEmyYp8h0DwWA9Ep0AjvkOgkksQo4GgEQxCRwWheF4XhGEO6Hp4dAhjw5RXCGi5vDJRmmeQ6nafx1iAEJQDVHQ6EgDgpEyOjDfYHB6FMQoKaGpn1AULG8ocO2HdYjbBHODaQaloZBEGob+smInClJ-G228BRTGU7xkLEQAEwlYOAMGgXofCJjWdiyVJ4BSIgcIq1AMGQ7xg4z+Yiu4-DYGQLMUnAC4zYtq3oHD5QY4uF3vPDqtMClMVhDcL3hCAA) — rename `{{usrName}}` back to `{{userName}}` to clear the error.

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
import { makePromptTag } from '@nkwib/tprompt';

const angle = makePromptTag({ open: '<<', close: '>>' });
angle('Hi <<name>>').with({ name: 'world' });
// "Hi world"
```

```ts
// Pre-applied {var} variant:
import { prompt } from '@nkwib/tprompt/single-brace';

prompt('Hi {name}').with({ name: 'world' });
// "Hi world"
```

`{var}` is **opt-in only**. The default uses `{{var}}` because LLM prompts routinely contain literal JSON (`{"name": "alice"}`) and a single-brace parser would silently match identifiers inside that content. See [ADR-0001](./docs/adr/0001-default-delimiter.md) for the full reasoning.

## ESM / CJS

Transparent — the same `import` (or `require`) of `'@nkwib/tprompt'` resolves to the right bytes per environment via conditional exports. There is no `tprompt/compat` subpath; module-system interop is handled invisibly. See [ADR-0003](./docs/adr/0003-esm-cjs-interop-boundary.md).

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
