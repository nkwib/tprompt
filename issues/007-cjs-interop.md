---
id: 007
title: CJS interop smoke test
status: open
depends_on: [006]
---

## Goal

Prove the dual-publish actually works from a CJS consumer. Set up `tests/cjs-smoke/test.cjs` as a tiny CJS script that requires `promptkit` and `promptkit/single-brace` from the built `dist/`, asserts on a basic substitution, and exits 0.

## Acceptance criteria

- [ ] `tests/cjs-smoke/test.cjs` does:
  - [ ] `const { prompt } = require('../../dist/index.cjs');`
  - [ ] `const { prompt: sb } = require('../../dist/single-brace.cjs');`
  - [ ] Asserts a basic ``prompt`Hi {{name}}`.with({name:'a'})`` returns `'Hi a'`
  - [ ] Same for `single-brace`: ``sb`Hi {name}`.with({name:'b'})`` returns `'Hi b'`
  - [ ] Throws on assertion failure, exits 0 on success
- [ ] `pnpm test:cjs` runs it and exits 0
- [ ] No `instanceof` check is required in the test (per ADR-0003 invariant 2)
- [ ] Replace the issue-001 stub `test.cjs` with the real assertions

## References

- ADR-0003 — dual-package hazard analysis; this is the test that enforces it
- ADR-0003 — five invariants; the test is implicitly a regression net for invariants 1, 2, 3

## Notes

The test deliberately requires from the built `dist/`, not from source. That's the consumer-facing surface, and the only path that exercises conditional exports.
