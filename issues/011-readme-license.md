---
id: 011
title: README final polish
status: done
depends_on: [010]
---

## Goal

Lock the public-facing surface. The README first paragraph is the wedge — it has to land the value prop in two sentences. Non-goals are non-negotiable.

## Acceptance criteria

- [x] First paragraph: one sentence on what tprompt is (2KB primitive, type-safe prompt placeholders), one sentence on the wedge (typo becomes `tsc` error before reaching the model). _("tagged-template" replaced with "primitive" per the architectural pivot in ADR-0002.)_
- [x] Public scope line in the first paragraph: "variables only, no template logic — no `{{#if}}`, no loops"
- [x] Quick-start: a working snippet (`pnpm add @nkwib/tprompt` + the smallest possible example with `.with({...})`; `zod` mentioned as optional)
- [x] Pluggable delimiter section: shows `makePromptTag({ open, close })` AND `import { prompt } from '@nkwib/tprompt/single-brace'`
- [x] ESM/CJS section: one paragraph saying "transparent via conditional exports — no `/compat` subpath needed" (per ADR-0003)
- [x] `.validate()` / `.validateSafe()` section: explains throw-by-default vs Result-on-safe; explicitly tells the reader to read it slowly
- [x] Non-goals section repeats the scope line and adds: scope-creep PRs (`{{#if}}`, loops, expression placeholders) get closed with a link to ADR-0001
- [x] Links to all three ADRs work from the README
- [x] LICENSE file already exists at repo root (verified)

## References

- Round-table final.md — README first-paragraph non-goal as scope-creep firewall
- ADR-0001, ADR-0002, ADR-0003

## Notes

Good README is more about removed paragraphs than added ones. Default to terse. If a section feels like ceremony rather than user-value, cut it.
