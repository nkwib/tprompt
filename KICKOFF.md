# promptkit — coding kickoff

You are working in `~/code/promptkit/`. Your job is to take this repo from scaffolded skeleton to publishable npm package: source code, tests, build, docs site, all green locally. Stop at `npm publish --dry-run`. Do not push anywhere.

## Read first (in this order, before any code)

1. `README.md` — project overview and non-goals
2. `CONTEXT.md` — canonical glossary; **lock these terms in code-level naming**
3. `docs/adr/0001-default-delimiter.md` — why `{{var}}` is the default
4. `docs/adr/0002-pluggable-parser-architecture.md` — single generic + factory + subpath exports
5. `docs/adr/0003-esm-cjs-interop-boundary.md` — ESM source, dual-publish, the **five invariants** you must not violate
6. `CONTRIBUTING.md` — `nodenext` `.js`-extension convention

## How issues work

The build is broken into 12 numbered files in `issues/`. Each has:

- `status: open | done` in frontmatter
- `depends_on:` listing prerequisite issues
- A goal, acceptance criteria (checkboxes), references to ADRs / CONTEXT terms

## The loop

Until all issues are `status: done`:

1. List `issues/`. Find the lowest-numbered file with `status: open`.
2. Read it in full. Re-read any referenced ADR / CONTEXT section.
3. Implement against the acceptance criteria. **Tests included** — write the tests for that issue, not in a separate later pass.
4. Run the verification commands implied by the acceptance criteria. Don't move on if anything is red.
5. Tick all the acceptance-criteria checkboxes in the issue file.
6. Update the issue's frontmatter to `status: done`.
7. Commit: `git add -A && git commit -m "<type>: <issue-title> (#<id>)"` (`feat`, `fix`, `chore`, `docs`, `test`, `refactor` per content).
8. Loop.

## Exit criteria

You are done when ALL of these hold:

- All 12 issues have `status: done`
- `pnpm install` runs clean
- `pnpm test` is green (vitest runtime + types + cjs-smoke)
- `pnpm build` produces a valid `dist/` matching `package.json#exports`
- `pnpm publish:dry` runs clean and the tarball contents match issue 012's list
- The docs site under `docs-site/` builds successfully
- `git status` is clean
- Final commit is `chore: ready for npm publish (v0.1.0)` with manual TODOs in the body

## Guardrails

- **Do not push to npm.** Stop at `--dry-run`. The actual `npm publish` is for the human to run.
- **Do not push to a git remote.** This repo has no remote yet.
- **Do not modify ADRs or `CONTEXT.md`** without surfacing the change first. They are decisions, not drafts.
- **The five invariants from ADR-0003 are non-negotiable.** No module-level singletons, no `instanceof` checks against library-defined classes, no Symbol-keyed registries, no shared mutable state, no top-level `await`. If a feature seems to need any of these, **stop and surface it**.
- **The non-goal in `README.md` is non-negotiable.** Variables only, no template logic. Reject scope creep toward `{{#if}}` / loops at the issue level — don't take it on quietly.
- **Don't add dependencies** beyond what's already in `package.json`. If you need one, surface it before adding.
- **Hard tests, not weak tests.** If a test is hard to write, that's a code-design signal — refactor the implementation, don't loosen the test.
- **Three-strike rule.** If after 3 honest attempts you can't get an issue's acceptance criteria green, write a `BLOCKED.md` at the repo root with the issue number, what you tried, what failed, and stop. Do not move on, do not weaken acceptance criteria.
- **Architectural surprises route through the human.** If implementing an issue surfaces a real architectural question that should update an ADR or `CONTEXT.md`, write a `DECISIONS-PENDING.md` note describing the question and stop.

## Conventions

- TS source under `module: "NodeNext"` requires explicit `.js` extensions on relative imports (`import { x } from './parser.js'`). See CONTRIBUTING.md.
- Type-level tests in `tests/types/*.test-d.ts` using vitest's `expectTypeOf`.
- Runtime tests in `tests/runtime/*.test.ts` using vitest.
- CJS smoke test in `tests/cjs-smoke/test.cjs` (plain Node, no vitest).
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- One commit per issue (squash sub-work locally before committing if it helps clarity).
- **Never** include "Co-Authored-By: Claude" or any AI attribution in commit messages.

## Begin

Start by reading the docs above in the listed order. Then `ls issues/`, open `001-project-skeleton.md`, and go.
