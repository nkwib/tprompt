---
id: 007
title: CJS interop smoke test
status: done
depends_on: [006]
---

## Goal

Prove the dual-publish actually works from a CJS consumer. Set up `tests/cjs-smoke/test.cjs` as a tiny CJS script that requires `promptkit` and `promptkit/single-brace` from the built `dist/`, asserts on a basic substitution, and exits 0.

## Acceptance criteria

- [x] `tests/cjs-smoke/test.cjs` does:
  - [x] `const { prompt } = require('../../dist/index.cjs');`
  - [x] `const { prompt: sb } = require('../../dist/single-brace.cjs');`
  - [x] Asserts `prompt('Hi {{name}}').with({name:'a'})` returns `'Hi a'`
  - [x] Same for `single-brace`: `sb('Hi {name}').with({name:'b'})` returns `'Hi b'`
  - [x] Throws on assertion failure (via `node:assert/strict`), exits 0 on success
- [x] `pnpm test:cjs` runs it and exits 0
- [x] No `instanceof` check is required in the test (per ADR-0003 invariant 2)
- [x] Replace the issue-001 stub `test.cjs` with the real assertions

## References

- ADR-0003 — dual-package hazard analysis; this is the test that enforces it
- ADR-0003 — five invariants; the test is implicitly a regression net for invariants 1, 2, 3

## Notes

The test deliberately requires from the built `dist/`, not from source. That's the consumer-facing surface, and the only path that exercises conditional exports.
