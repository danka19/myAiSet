---
name: doc-sync-audit
description: "Audit project documentation against code and Git state when doc drift is suspected or a documentation audit is requested."
---

# Doc Sync Audit

Documentation that contradicts the repository is worse than missing documentation: agents trust it and act on stale facts.

Use this after any meaningful change to specs, docs, architecture, setup, verification rules, roadmap status, or durable user decisions. Also use it after idea/feedback sessions when the user answered agent questions, asked to record decisions, gave final acceptance, or when the discussion changed accepted/project-relevant knowledge.

## Workflow

1. Read `AGENTS.md`, `docs/ROADMAP.md`, `docs/CURRENT_PROJECT_AUDIT.md`, `docs/00_FILE_STRUCTURE.md`, `docs/AI_STEP_VERIFICATION_CHECKLIST.md`, `docs/CONTEXT.md`, relevant `openspec/` artifacts, and `CLAUDE.md`.
   Use `phase-status-audit` when roadmap, phase plans, step status, closed phases, acceptance gates, or old phase docs are in scope.
   Use `roadmap-openspec-validator` when both roadmap and OpenSpec are present.
2. Collect evidence, not opinions:
   - `git status --short`, current branch, last 10 commits, stale branches;
   - active OpenSpec changes, accepted specs, delta specs, tasks, and validation status;
   - validator errors for missing/duplicate/unknown/mismatched ownership and inverse rows, reported separately from warnings such as uncovered draft phases or completed tasks awaiting explicit acceptance;
   - does the current branch match the active roadmap phase;
   - do files/dirs listed in `00_FILE_STRUCTURE.md` exist, and are there significant untracked dirs it does not mention;
   - do phase statuses in `ROADMAP.md` match test/build evidence and `docs/phases/*` gates;
   - do all phases, steps, work items, and old phase-plan leftovers have explicit allowed statuses;
   - are any phases marked closed while child steps are unfinished, unmarked, invalid, or pending acceptance;
   - do OpenSpec artifacts and docs describe the same behavior, accepted decisions, open decisions, and verification expectations;
   - did every durable answer the user gave to agent questions get captured, including answers from earlier in the dialogue;
   - after final acceptance, are all accepted decisions, proposed ideas, rejected options, open questions, terminology, risks, and verification expectations represented somewhere durable;
   - are there duplicate active rules in `AGENTS.md`, `docs/`, and `openspec/` that should be canonicalized into one source plus references;
   - does `CLAUDE.md` point to a stale handoff (see handoff-to-claude skill);
   - are there uncommitted changes older than the last commit's date.
3. Classify each finding: **stale doc** (fix the doc), **undone work** (fix the repo or reschedule), or **decision needed** (ask the human).
4. Apply safe fixes directly: doc corrections, structure-doc updates, closing stale handoff pointers. Do not silently change roadmap scope or delete work — those are human decisions.
5. Update `docs/CURRENT_PROJECT_AUDIT.md` with the date, evidence checked, and remaining risks.
   Also apply safe consistency fixes and duplicate-rule consolidation into references. Do not silently change accepted product behavior; ask when the canonical source is unclear.
6. Re-run `roadmap-openspec-validator` after safe fixes and require zero errors; retain legitimate warnings in the audit.
7. Report using the session-report skill (short mode unless findings are large).

## Cadence

Run after spec/doc/architecture changes, after sessions that record ideas or decisions, after the user answers agent questions that affect project state, after final acceptance of a proposal/spec/phase direction, at phase boundaries, after closing roadmap steps, after old phase-plan uncertainty is found, after any multi-week gap in a project, and before trusting any doc older than the last 20 commits.
