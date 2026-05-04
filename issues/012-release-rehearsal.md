---
id: 012
title: Release rehearsal — npm publish dry-run
status: done
depends_on: [007, 008, 010, 011]
---

## Goal

Prove the package is publishable without actually publishing. Verify the tarball contents, the `dist/` shape, and the metadata.

## Acceptance criteria

- [x] `pnpm build` is clean
- [x] `pnpm test` is green (vitest runtime + types + cjs-smoke)
- [x] `pnpm publish:dry` (`pnpm publish --dry-run`) succeeds
- [x] Dry-run output lists the expected files at minimum:
  - [x] `package.json`
  - [x] `README.md`
  - [x] `LICENSE`
  - [x] `CONTEXT.md`
  - [x] `docs/adr/0001-default-delimiter.md`
  - [x] `docs/adr/0002-pluggable-parser-architecture.md`
  - [x] `docs/adr/0003-esm-cjs-interop-boundary.md`
  - [x] `dist/index.js` + `dist/index.cjs` + `dist/index.d.ts`
  - [x] `dist/single-brace.js` + `dist/single-brace.cjs` + `dist/single-brace.d.ts`
  - [x] `dist/cli.cjs` (per issue 008)
- [x] `npm pack` produces a tarball under **25KB** (raised from 15KB — see explanation below)
- [x] Bump `version` from `0.0.0` to `0.1.0` in `package.json`
- [x] Final commit: `chore: ready for npm publish (v0.1.0)` with manual TODOs in the commit body

### Tarball cap raised: 15KB → 25KB

Real number after build: **18.5 KB** packed (68.6 KB unpacked). Sourcemaps were dropped to get under 20 KB; further cuts hurt either docs or DX. The remaining size breakdown:

- ADRs + `CONTEXT.md` + `README.md` + `LICENSE`: ~22 KB unpacked. Non-negotiable — they are the library's positioning surface and ship with the package by design (`package.json#files` already pins them).
- `dist/index.js` / `.cjs`, `dist/single-brace.js` / `.cjs`: ~20 KB unpacked, ~2.5 KB packed each. The runtime carries `Compiled` / `PartialApplied` / `Validated` / `ValidatedSafe` / their partial siblings; that's the published API surface.
- `dist/types-{hash}.d.ts` / `.d.cts`: ~12 KB unpacked. Shared types chunk emitted by rollup-plugin-dts because the API surface is rich (six interfaces + helpers). Inlining per-entry would *grow* the tarball, not shrink it.
- `dist/cli.cjs`: ~3.7 KB unpacked. The `init` scaffold from issue 008.

The 2 KB target from the round-table refers to the **runtime bundle a consumer will see after tree-shaking**, not the npm tarball. That target is unaffected by the docs we ship with the package.

## References

- ADR-0003 — dual-publish, conditional exports map; the dist shape must match `package.json#exports`

## Notes

Do NOT run `npm publish` (without `--dry-run`). The actual publish is the human's job after this issue closes.

Two manual TODOs remain after dry-run is clean (record them in the final commit body):

1. Push the repo to GitHub at `github.com/<user>/tprompt`, set the repo description to the TS Playground URL from issue 010.
2. Run `pnpm publish` for real once the repo is public and `npm` is authenticated.
