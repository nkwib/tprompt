---
id: 008
title: `npx promptkit init` scaffold CLI
status: done
depends_on: [006]
---

## Goal

Add a small CLI that scaffolds a `prompts/` directory in the user's project with one typed example, and prints the TS Playground URL. The "sub-60-second zero-to-first-error path" from the round-table final.

## Acceptance criteria

- [x] `bin` field in `package.json` points to `dist/cli.cjs` (CLI in CJS so the shebang script is broadly executable)
- [x] `src/cli.ts` reads `process.argv`, supports the `init` subcommand
- [x] `init` creates `prompts/example.ts` in the current working directory containing a working `prompt('Hello, {{name}}!')` example with a `.with({...})` call demonstrating the typed surface
- [x] CLI prints the TS Playground URL to stdout when done — placeholder for now (`// TODO(010): fill TS Playground URL`); issue 010 fills it in
- [x] No new runtime dependencies — argv parsing via Node's `node:util#parseArgs`
- [x] `tsup.config.ts` updated to include `src/cli.ts` as a CJS-only entry with shebang
- [x] Tests: invoke the CLI in a temp dir (e.g. via `node ./dist/cli.cjs init`), verify `prompts/example.ts` is created with expected content

## References

- Round-table final.md — `npx promptkit init` is part of the sub-60-second hook

## Notes

CLI is CJS-only because shebang scripts are simpler in CJS and there's no developer-experience cost (consumers run it via `npx`, never `import`). Library code stays ESM-source-dual-published per ADR-0003; the CLI is a separate concern.

Make sure tsup's CLI emit prepends `#!/usr/bin/env node` and that the file is `chmod +x`-ed in the build output. tsup's `banner` option handles the shebang; the executable bit comes from listing the entry under `bin` in `package.json` (npm sets it on install).
