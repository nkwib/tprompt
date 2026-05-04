# Contributing to tprompt

## Getting started

```sh
pnpm install
pnpm test
pnpm build
```

## Conventions

### `nodenext` and explicit `.js` extensions

This project compiles under `module: "NodeNext"`. Relative imports in `.ts` source files require **explicit `.js` extensions**, even though source files are `.ts`:

```ts
// correct
import { parse } from './parser.js';

// fails to resolve under nodenext
import { parse } from './parser';
```

The `.js` extension refers to the eventual compiled output; TypeScript resolves it back to the `.ts` source at compile time. Same applies to `import type`.

### Architecture invariants

See [`docs/adr/0003-esm-cjs-interop-boundary.md`](./docs/adr/0003-esm-cjs-interop-boundary.md). Briefly: no module-level singletons, no `instanceof` checks against library-defined classes, no Symbol-keyed registries, no shared mutable state, no top-level `await`. If a feature appears to need any of these, the ADR must be revisited before implementation.

### Glossary

The terms in [`CONTEXT.md`](./CONTEXT.md) are canonical. Use them in code, comments, and docs. If you find yourself reaching for a term that isn't there, add it to `CONTEXT.md` first.

### Testing

- Type-level tests in `tests/types/*.test-d.ts` using vitest's `expectTypeOf`
- Runtime tests in `tests/runtime/*.test.ts` using vitest
- CJS interop smoke test in `tests/cjs-smoke/test.cjs` (plain Node, no vitest)

Run all with `pnpm test`. Type tests run via vitest's `--typecheck` mode.

### Commit messages

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`. Reference the issue number in parentheses: `feat: implement .with({...}) (#003)`.
