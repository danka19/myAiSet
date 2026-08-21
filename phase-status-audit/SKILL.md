---
name: phase-status-audit
description: Use when checking roadmap, phase plans, closed phases, completed steps, or old phase documentation for missing, stale, contradictory, or implicit statuses before planning, implementation, acceptance, closure, or documentation sync.
---

# Phase Status Audit

Roadmap and phase documentation must make state explicit. A closed phase with unfinished, unchecked, or unmarked work items is a source of uncertainty, not a harmless formatting issue.

## Allowed Statuses

Use these exact status values unless a project `AGENTS.md` defines a stricter project-specific set:

- `draft`: defined but not ready for implementation.
- `planned`: accepted as intended work, but not ready to start.
- `ready`: unblocked and ready to start.
- `in_progress`: actively being worked.
- `blocked`: cannot proceed without a named blocker being resolved.
- `pending_acceptance`: implementation or planning is complete enough for human review, but not accepted yet.
- `accepted`: human accepted the result or decision.
- `closed`: accepted and fully reconciled in docs/specs/checklists/PR state.
- `deferred`: intentionally postponed with a reason.
- `cancelled`: intentionally stopped and not expected to resume.
- `superseded`: replaced by another phase, step, spec, or decision, with a reference.

## What To Audit

Read:

- `AGENTS.md`
- `docs/ROADMAP.md`
- all relevant `docs/phases/*.md`
- `docs/CURRENT_PROJECT_AUDIT.md`
- `docs/AI_STEP_VERIFICATION_CHECKLIST.md`
- active or related `openspec/changes/*` and accepted `openspec/specs/*` when status depends on behavior/spec acceptance

Check every roadmap phase, phase gate, work item, step, checkbox group, dependency gate, acceptance gate, and deferred/rejected item.

When `openspec/` exists, also use `roadmap-openspec-validator`. Audit its governance errors separately from legitimate product blockers and report its warnings without promoting an uncovered draft placeholder to a blocker.

## Rules

- Every phase, step, and work item needs an explicit status from the allowed set.
- When status documents have a machine-readable consumer contract, use its exact syntax and placement rules. Human-readable semantic equivalence is not sufficient.
- When a consumer classifies free-prose status keywords, keep conflicting lifecycle vocabulary out of the same status line; put dependency state on a separate line or use wording that cannot override the declared status.
- When a dashboard, indexer, API, or other consumer exists, run it and inspect structured consumer output item by item. A successful command, aggregate count, or top-level health value is not status verification.
- Compare the consumer output with an expected phase/status matrix and require no unexplained parser/integrity issues. An audit regex must never be more permissive than the consumer it is validating.
- If a phase or step is `closed`, all child work items must be `accepted`, `closed`, `deferred`, `cancelled`, or `superseded` with reasons/evidence.
- If any child item is unmarked, unchecked, `draft`, `planned`, `ready`, `in_progress`, `blocked`, or `pending_acceptance`, the parent phase cannot be `closed`.
- Old phase plans with unfinished or unmarked steps must be treated as findings. Resolve safe documentation drift directly; otherwise record a blocker or decision needed.
- Do not infer acceptance from newer work starting. Human acceptance, documented acceptance evidence, or explicit project rules must support `accepted`/`closed`.
- Parallel work may continue only when dependency status is explicitly `parallel-independent` or equivalent and the non-blocking rationale is documented.
- Every accepted capability spec and active change has exactly one primary phase, both mandatory roadmap inverse tables contain exactly one matching row per artifact, and every non-draft phase has OpenSpec coverage.

## Workflow

1. State that `phase-status-audit` is being used.
2. Inventory phases and plans from `docs/ROADMAP.md` and `docs/phases/*.md`.
3. Discover any machine-readable consumer contract for these documents: parser grammar, schema, template, API, dashboard, or generated index.
4. Run `roadmap-openspec-validator` when OpenSpec is present; keep ownership/inverse-table diagnostics distinct from phase/product status findings.
5. Build a status table: item, parent, current status, child statuses, acceptance evidence, blockers, OpenSpec link, PR/commit evidence when relevant.
6. Flag:
   - missing status;
   - invalid status value;
   - closed parent with unfinished/unmarked child items;
   - pending acceptance blocking sequential roadmap work;
   - status disagreement between roadmap, phase plan, audit, checklist, and OpenSpec;
   - missing reason/reference for `blocked`, `deferred`, `cancelled`, or `superseded`.
7. Apply safe fixes directly when evidence is clear: add missing explicit statuses, update stale references, and align docs that are obviously outdated.
8. If a consumer exists, run it after the fixes and compare every expected item/status with the structured consumer output. Inspect parser/integrity issues separately from legitimate project blockers.
9. Re-run `roadmap-openspec-validator` after ownership or status fixes and require zero errors.
10. If evidence is not clear, do not guess. Mark the item `blocked` or `pending_acceptance`, record the exact uncertainty, and ask for the needed human decision.
11. Report the status findings and any fixes through `session-report`.

## Required Outputs

Include:

- statuses checked;
- statuses fixed;
- machine-readable contract used, when one exists;
- roadmap/OpenSpec validator errors and warnings as separate evidence;
- expected-versus-actual structured consumer output and parser/integrity issues, when a consumer exists;
- phases/steps that remain ambiguous;
- sequential work blocked by pending acceptance;
- parallel work that is safe to continue and why;
- human decisions needed.
