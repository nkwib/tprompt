# promptkit

Type-safe prompt template library for TypeScript. A 2KB primitive that turns prompt placeholder typos into `tsc` errors before they reach the model.

> **Status:** under construction. See [`KICKOFF.md`](./KICKOFF.md) and [`issues/`](./issues) for the build plan.

## Non-goals

promptkit is **variables only**. No template logic — no `{{#if}}`, no loops, no DSL. If you need conditionals or iteration, build them in TypeScript and pass strings.

## Documentation

- [`CONTEXT.md`](./CONTEXT.md) — canonical glossary
- [`docs/adr/0001-default-delimiter.md`](./docs/adr/0001-default-delimiter.md) — why `{{var}}`
- [`docs/adr/0002-pluggable-parser-architecture.md`](./docs/adr/0002-pluggable-parser-architecture.md) — factory + subpath exports
- [`docs/adr/0003-esm-cjs-interop-boundary.md`](./docs/adr/0003-esm-cjs-interop-boundary.md) — ESM-source dual-publish

## License

MIT
