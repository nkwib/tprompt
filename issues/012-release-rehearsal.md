---
id: 012
title: Release rehearsal — npm publish dry-run
status: open
depends_on: [007, 008, 010, 011]
---

## Goal

Prove the package is publishable without actually publishing. Verify the tarball contents, the `dist/` shape, and the metadata.

## Acceptance criteria

- [ ] `pnpm build` is clean
- [ ] `pnpm test` is green (vitest runtime + types + cjs-smoke)
- [ ] `pnpm publish:dry` (`pnpm publish --dry-run`) succeeds
- [ ] Dry-run output lists the expected files at minimum:
  - [ ] `package.json`
  - [ ] `README.md`
  - [ ] `LICENSE`
  - [ ] `CONTEXT.md`
  - [ ] `docs/adr/0001-default-delimiter.md`
  - [ ] `docs/adr/0002-pluggable-parser-architecture.md`
  - [ ] `docs/adr/0003-esm-cjs-interop-boundary.md`
  - [ ] `dist/index.js` + `dist/index.cjs` + `dist/index.d.ts`
  - [ ] `dist/single-brace.js` + `dist/single-brace.cjs` + `dist/single-brace.d.ts`
  - [ ] `dist/cli.cjs` (per issue 008)
- [ ] `npm pack` produces a tarball under 15KB (the round-table targeted 2KB minified for runtime; full tarball with ADRs and docs is naturally larger; raise the cap in this issue if real numbers come in higher and explain why)
- [ ] Bump `version` from `0.0.0` to `0.1.0` in `package.json`
- [ ] Final commit: `chore: ready for npm publish (v0.1.0)` with manual TODOs in the commit body

## References

- ADR-0003 — dual-publish, conditional exports map; the dist shape must match `package.json#exports`

## Notes

Do NOT run `npm publish` (without `--dry-run`). The actual publish is the human's job after this issue closes.

Two manual TODOs remain after dry-run is clean (record them in the final commit body):

1. Push the repo to GitHub at `github.com/<user>/promptkit`, set the repo description to the TS Playground URL from issue 010.
2. Run `pnpm publish` for real once the repo is public and `npm` is authenticated.
