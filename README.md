# promptkit

Type-safe prompt template library for TypeScript. A 2KB primitive that turns prompt placeholder typos into `tsc` errors before they reach the model.

promptkit is **variables only, no template logic** — no `{{#if}}`, no loops, no DSL. If you need conditionals or iteration, build them in TypeScript and pass strings.

## Quick start

```sh
pnpm add promptkit
# Optional, only if you want runtime validation:
pnpm add zod
```

```ts
import { prompt } from 'promptkit';

const greet = prompt('Hello, {{name}}!');

console.log(greet.with({ name: 'world' }));
// "Hello, world!"

// Typo? `tsc` flags it before the program runs:
greet.with({ nme: 'world' });
//          ^^^^ Property 'name' is missing in type
```

[**Try it in the TS Playground**](https://www.typescriptlang.org/play?#code=PTAEAcCcHsFtwC4GsCWDQIJ7gKYFpoA7AG01AGcEBXAI1ADNpJQAVAZVAAViBDTAcxhVCAEwB0AKBCgAkoVA9QkHD2IQYAKxwBjdJmhVQAdwPERxyGhygABinhN0Ab3VxEoAL4MYsUAHIoN2Q0PxtQQBQCKTAEAAsUcgpqOnjQFBI0nHMYnGUKaAxsrl4BIVFQYjSkYyYkBKM0GIN0QnBYSQksXFAAGRwEBBzQAF4JUFAAH38ePwn-GhnJv20F-xEVvxx1+nX+dZj1lHWNP1HZvyR14nXYdcJ16HXwdYBHdch18nWEE7HFqnWAG7rIzrAAe60w6wAXj8zgBBdYAIXWAGF1gARdYAUXWADF1gBxdYACXWMnWAClYYsANLrbrrACy6wAcusAPLrTjrACK6wASus2OsWNT-ABVdYANXWAHV1gANdYATXWAC11gB9PwAbg62GsMhEKJiPGYQx6fQGzEWAAY-OM-ABGB1+ABMroAzK6ACyugCsroAbK6AOyugAcroAnLr9V0jSweChiAAeDg4UEDUQJSiWQj8AB8w1OGazOBz-hmAH4MJAqDhTgAuUBl7MiBI2AAkTiNJrNHh7aXog35HjCtcTybT-OLLfoqnIOD1nUN5CN6dAmfbuYQ+aLJbGbYrHdsPd6-Ryg6cw9H49Ak5ESZTqdnoHni+X8esWKzkB4ujcABOCNGYOTkJu24nru+4ADSgHC2jaFu5aVnmaT8MMoCEDgAI5MWIxHihO5nk46EFh4ThOEOhAjswUoeIxNF0aA-I4JQ46nGMk7riIqZSsWUGVnuDZcWMD6gL+e4AQgQHaCB0BgZAEFsZQ8GIchkwCWJYwtlJ-6Abw8mgSI4GvuxCDqUhhZiS2GkrgaoBSmaKA8DQxDsey9CppwxHQYk+4EacADanAALp+ZWwU4XhkARbWbHaEwfHkfw8Exfh76gC4yg8CIRCkKAwU0qk8jhS2qWeHqaTWgu8mgCibgppkkGoaeqXFk4pz1LEAAUAJmuQLbOZYbkeeQXmpvpMlyQpSkQWwhaFgAlBVe4YXqHgSKZ2i8Lk9DCLoKBEK48AIKmSWEJQraRe160FoWvUDPAvADC2bCrQ1TUeXxi16lEoCAACkwMg6DYPgxDkNQ9DMMgwDLCFEYmT8DgLbKIQPCwNYVFUOQkAspjOCMRg+Q40u+OE8TNA4MQ0BGCToC7SozCxNYOQwJAkjSLDPO83zfMSBIl3XYIOB9FhgRnb1px+MSNO0-BZMU1jjEAISgMqBjMOAvDyCkVE6zwhAsCgV5eL1tPaKoqPZU4lvW4xy1iCcy3-aLfRiD1MS9V1Yy4zkBNYy2fiqCg8l+PB0iAAmEXAwLgkBYP4uPK5sqQJLA8TkBhpUYAa8F+P7KczPl7HYdA6CZvECCnIbxum5AweBBHpz2x5wcVng4rChIHiuxIQA) — rename `{{usrName}}` back to `{{userName}}` to clear the error.

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
import { makePromptTag } from 'promptkit';

const angle = makePromptTag({ open: '<<', close: '>>' });
angle('Hi <<name>>').with({ name: 'world' });
// "Hi world"
```

```ts
// Pre-applied {var} variant:
import { prompt } from 'promptkit/single-brace';

prompt('Hi {name}').with({ name: 'world' });
// "Hi world"
```

`{var}` is **opt-in only**. The default uses `{{var}}` because LLM prompts routinely contain literal JSON (`{"name": "alice"}`) and a single-brace parser would silently match identifiers inside that content. See [ADR-0001](./docs/adr/0001-default-delimiter.md) for the full reasoning.

## ESM / CJS

Transparent — the same `import` (or `require`) of `'promptkit'` resolves to the right bytes per environment via conditional exports. There is no `promptkit/compat` subpath; module-system interop is handled invisibly. See [ADR-0003](./docs/adr/0003-esm-cjs-interop-boundary.md).

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

`zod` is an **optional** peer dependency — promptkit accepts any object with `.parse(value)` and `.safeParse(value)` shape, so Valibot, ArkType, or your own validator all work. The library never imports `zod` at module load; the validation surface is structural.

## Non-goals

promptkit is **variables only**. No template logic, no expression placeholders, no DSL.

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
