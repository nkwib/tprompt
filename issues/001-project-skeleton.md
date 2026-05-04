---
id: 001
title: Project skeleton sanity check
status: done
depends_on: []
---

## Goal

Verify the scaffolded toolchain is green before any feature work. Install deps, prove `tsc`, `tsup`, and `vitest` all run against the empty source.

## Acceptance criteria

- [x] `pnpm install` runs clean (creates `pnpm-lock.yaml`)
- [x] `pnpm lint` (i.e. `tsc --noEmit`) passes against the empty `src/`
- [x] `pnpm build` produces `dist/index.js`, `dist/index.cjs`, `dist/single-brace.js`, `dist/single-brace.cjs`, and corresponding `.d.ts` files
- [x] `pnpm test` runs vitest and exits 0 (no tests yet — empty pass is fine; `test:cjs` may need a stub `tests/cjs-smoke/test.cjs` that exits 0)
- [x] First commit lands: `chore: project skeleton (#001)` containing the lockfile

## References

- ADR-0003 — informs build setup, `engines.node`, `sideEffects`
- CONTRIBUTING.md — `.js`-extension convention

## Notes

If `pnpm` is unavailable on the host, surface that as a blocker — don't silently swap to `npm`. The scripts in `package.json` reference `pnpm` directly.

For the empty-pass case on `pnpm test`: vitest exits 0 when no test files match its include pattern, but `test:cjs` will fail without a `test.cjs` stub. Add a one-line stub like `// stub — replaced in #007` that exits 0, so the pipeline is green from issue 001 onward.
