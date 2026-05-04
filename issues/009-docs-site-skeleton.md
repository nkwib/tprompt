---
id: 009
title: Docs site skeleton (Svelte + MDsveX)
status: done
depends_on: [006]
---

## Goal

Stand up the docs site under `docs-site/` so the project has a homepage. Lean — one Playground link is the demo (per the round-table final). The full Vercel AI SDK before/after lands in issue 010.

## Acceptance criteria

- [x] `docs-site/` is a SvelteKit project with MDsveX configured
- [x] Static-adapter only — no server runtime
- [x] Home page (`/`) renders with: title, the non-goal first paragraph (from `README.md`), a placeholder for the TS Playground demo
- [x] `cd docs-site && pnpm install && pnpm build` produces a deployable static site (`docs-site/build/`)
- [x] Site has its own `package.json` and `pnpm-lock.yaml` — independent from the library's
- [x] `docs-site/.gitignore` excludes `.svelte-kit/`, `build/`, `node_modules/` (covered at repo root, but local one is good practice)

## References

- Round-table final.md — Svelte + MDsveX for the docs site, "lean — one Playground link is the demo"

## Notes

Don't deploy the site as part of this issue. Manual deployment to Cloudflare Pages or Vercel is the human's job after the package ships.
