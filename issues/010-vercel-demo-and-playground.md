---
id: 010
title: Vercel AI SDK before/after demo + TS Playground link
status: done
depends_on: [009]
---

## Goal

The headline demo and the launch-surface wiring. Build the side-by-side Vercel AI SDK before/after using a real multi-variable system prompt. Generate the TS Playground URL that demonstrates the typo-becomes-error wedge. Wire it into `package.json#homepage` so it's discoverable from `npm info promptkit` and search results.

## Acceptance criteria

### Demo

- [x] `docs-site/src/routes/before-after/+page.svx` renders the side-by-side
- [x] Real multi-variable system prompt: `userName`, `planTier`, `locale`
- [x] "Before" panel: vanilla string-template version with a `{{usrName}}` typo, showing the runtime output that would have shipped to the model
- [x] "After" panel: promptkit version with the same typo, with the `tsc` error embedded as a code block

### TS Playground

- [x] Generate a TS Playground URL encoding the "after" snippet such that opening the URL shows the typo-becomes-error in the TS Playground (`scripts/generate-playground-url.mjs`, uses `lz-string`)
- [x] Update `package.json#homepage` to that URL
- [x] Add a TS Playground link in the README quick-start section
- [x] Update the CLI placeholder from issue 008 with the real URL

## References

- Round-table final.md — `{{usrName}}` vs `{{userName}}` typo demo; TS Playground link as `package.json#homepage` for `npm info` discoverability

## Notes

The Playground URL has to encode (a) the after-snippet and (b) any minimal type-only stand-in for the `prompt` function — TS Playground doesn't auto-fetch npm packages reliably for typings. Inline the relevant `ExtractPlaceholders` and `Compiled` types via a stub at the top of the playground snippet. That keeps the launch link working without external dependencies.

Manual TODO surfaced here (cannot be done by Claude Code): update the GitHub repo's "About" → "Description" field to the same TS Playground URL after the repo exists. Note this in the final commit body.
