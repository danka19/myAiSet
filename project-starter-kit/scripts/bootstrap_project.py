#!/usr/bin/env python3
"""Bootstrap a new project with Codex-friendly docs.

Generic workflow skills (using-git-worktrees, architecture-planner, phase-planner,
phase-step-runner, phase-full-runner, phase-status-audit, phase-change-intake,
subagent-driven-development, openspec-*, session-report, handoff-to-claude,
doc-sync-audit) live globally in ~/.codex/skills and are NOT
copied into projects. Projects hold only project-specific facts in AGENTS.md
and docs/.
"""

from __future__ import annotations

import argparse
import datetime as dt
from pathlib import Path
from string import Template


def slugify(value: str) -> str:
    chars: list[str] = []
    previous_dash = False
    for char in value.lower():
        if char.isalnum():
            chars.append(char)
            previous_dash = False
        elif not previous_dash:
            chars.append("-")
            previous_dash = True
    return "".join(chars).strip("-") or "project"


def render(text: str, values: dict[str, str]) -> str:
    return Template(text.strip() + "\n").safe_substitute(values)


def write_file(path: Path, content: str, force: bool, dry_run: bool) -> str:
    if path.exists() and not force:
        return f"skip existing {path}"
    if dry_run:
        action = "overwrite" if path.exists() else "create"
        return f"would {action} {path}"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")
    return f"wrote {path}"


AGENTS = r"""
# Agent Operating Guide

This file is the shared entry point for Codex and future agent tools. Keep it short; detailed project context lives in `docs/`.

## Current Mode

- Active implementation agent: Codex.
- Future subagents may be used for bounded worker, reviewer, architecture-checker, and verification-checker tasks when tooling supports them.
- The human owner keeps final product, UX, data-source, security, and business-scope decisions.

## Required Read Order

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/00_FILE_STRUCTURE.md`
4. `docs/ROADMAP.md`
5. Relevant `docs/phases/PHASE_*.md` when working by roadmap phase.
6. `openspec/` before SDD/OpenSpecs/TDD work, product behavior changes, data contract changes, or acceptance planning.
7. Relevant `openspec/changes/<change-id>/` folder when working on an active proposed change.
8. `docs/CURRENT_PROJECT_AUDIT.md` before trusting existing implementation or setup state.
9. `docs/AI_STEP_VERIFICATION_CHECKLIST.md` before implementation, verification, or completion reporting.
10. Only topic documents related to the current task.

Scaling rule: for small bounded tasks (typo fixes, single-file edits, doc corrections, quick questions) read only `AGENTS.md` plus the files the task actually touches. The full read order is mandatory for phase work, architecture, data contract, or product behavior changes.

## Project Rules

1. Quality, thoughtful design, safety, and architecture are more important than rushing.
2. Project documentation must be written in English unless the human explicitly changes the project language.
3. User-facing replies must be written in Russian unless the user explicitly asks for another language.
4. Before implementation work, use the global `using-git-worktrees` skill to detect or create an isolated workspace/branch unless the human explicitly approves working in the current checkout.
5. Branch selection is OpenSpec-first: if an active `openspec/changes/<change-id>/` exists, the implementation branch must match that change id or a short slug derived from it. If there is no active OpenSpec change but there is an active roadmap phase/work item, the branch must match that plan. If neither exists, create a short descriptive implementation branch.
6. If the current branch does not match the active OpenSpec change branch, phase plan branch, or requested implementation branch, branch from `main` before changing files. If `main` is unavailable, use the repository's default stable branch and state the fallback in the report.
7. OpenSpec is the default execution backbone. Implement accepted/proposed behavior through `openspec/changes/<change-id>/` artifacts, each assigned to exactly one roadmap execution phase.
8. Roadmaps and OpenSpec are mutually required when this project uses OpenSpec. Every accepted capability spec must declare exactly one primary `Roadmap phase: Pn`; every active change must declare exactly one `Execution phase: Pn`; `docs/ROADMAP.md` must contain exactly one matching inverse row for each artifact. Related phases are optional, but the primary phase is mandatory.
9. Before starting roadmap/phase/step implementation, check dependency and acceptance status. If the work is sequentially dependent on a previous phase or step that is still waiting for human acceptance, unresolved gates, or spec decisions, stop before implementation, record the blocker, and ask for acceptance or a dependency decision. Do not treat a request to continue as implicit acceptance.
10. Parallel roadmap work is allowed only when it is explicitly independent: no dependency on the pending acceptance, no shared unresolved spec decision, no data contract or architecture gate, and no risk of invalidating the previous review. Record why it is safe to proceed before changing files.
11. Do not infer phase-based work from the existence of `phase-*` skills. Use phase skills only when the human explicitly asks for roadmap/phase planning or execution, or when this project declares an active phase. For normal implementation, OpenSpec is the default execution unit.
12. For OpenSpec implementation, decide before coding whether to use `subagent-driven-development`. Use it when tasks are independent or risk is high; otherwise state why local execution is sufficient in the final report.
13. At the end of every completed bounded change or work session, before replying to the user, create a git commit when the project repository has intentional changes. Do not leave large uncommitted diffs across sessions.
14. When an OpenSpec change or roadmap phase is closed, create or prepare a pull request from the spec/phase branch to `main` after docs, verification, and the final commit. If `main` is unavailable, target the repository's default stable branch and state the fallback. Do not merge directly unless the human explicitly asks.
15. For roadmap, phase, or step work, use `phase-status-audit` before starting implementation and before closing a phase/step. Every phase, step, and work item must have an explicit allowed status; old phase plans with unfinished or unmarked steps are findings to resolve or block on.
16. After completing work, update documentation if the change affects product behavior, architecture, setup, operations, security, roadmap status, data contracts, or user-visible labels.
17. If work follows roadmap steps, verify before changes that the current branch matches the active roadmap phase.
18. End-of-session reports follow the global `session-report` skill. OpenSpec implementation normally uses full mode when it touches product behavior, data contracts, security, multiple files, or user-visible behavior.
19. Reports must be self-contained enough that the human understands the result without opening changed files. File links are evidence only; never use them as a replacement for explaining what changed.
20. For phase, step, roadmap, architecture, or OpenSpec work, the final report must include an executive summary, what was completed, decisions made, why those decisions fit the specs/phase/architecture, important tradeoffs or rejected options, verification evidence, risks or uncertainties, and the practical next step.
21. Treat human feedback as durable project knowledge. Persist product rules, rejected behavior, acceptance criteria, verification habits, and open decisions in the correct docs.
22. After any spec, doc, architecture, setup, roadmap, verification, or durable-decision change, check related documentation for stale state, contradictions, duplicate active rules, and missing cross-references. Prefer one canonical source plus references elsewhere.
23. When the human answers agent questions, record each durable answer as soon as it is given, even if discussion of other questions continues. Do not wait for the last discussed point before updating docs/specs.
24. After final acceptance of a proposal, spec, phase direction, or decision set, review the full dialogue and verify that every accepted decision, proposed idea, rejected option, open question, terminology change, risk, and verification expectation has been captured or explicitly reported as uncaptured.
25. After discussions, ideas, objections, and review comments, record accepted decisions, rejected behavior, terminology, risks, open questions, and verification expectations in the smallest correct durable artifact before treating them as project state.
26. Before implementation, map affected OpenSpec requirements or change deltas to acceptance scenarios and verification evidence. If automated tests do not exist, record manual verification steps and residual risk.
27. When the next project step requires a human decision or mandatory verification, say so explicitly and explain why it matters, relevant options or tradeoffs, expected evidence, and the consequence or risk of leaving it unresolved.
28. User-facing reports must always include next steps. If there is no active required action, state the recommended next step and why it is next.
29. When the human asks for advice, asks "how is it better", asks a conceptual question, or asks for an opinion/recommendation, answer with a detailed explanation first and do not silently convert the question into implementation. Make changes only when the human explicitly asks to record, implement, update, or continue work, or when the question is inseparable from a requested documentation update.
30. When several open questions or decisions remain, ask them in one clear batch with recommended defaults and tradeoffs. Ask one-by-one only when a single answer is required to safely proceed.

## User-Facing Report Style

- Follow the global `session-report` skill for structure and mode selection (short vs full).
- For phase, step, roadmap, architecture, or OpenSpec work, give the human the main substance in the chat: executive summary, decisions and reasoning, core changes, verification, risks, and next step.
- Mention changed files only after explaining what is in them and why it matters.
- Do not hide ambiguity. If documentation is missing, stale, contradictory, or only partially verified, state that in its own block and update the relevant durable document when appropriate.
- If the human asked for a recommendation or "what is better", the answer must compare the practical options, give the recommended path, explain tradeoffs and risks, and clearly separate advice from any actions taken.

## Global Skills

Generic workflow skills live in `~/.codex/skills` and apply to all projects. Do not copy them into the repository; project-specific deltas belong in this file.

- Isolated workspace and branch setup before implementation: `using-git-worktrees`.
- Architecture planning: `architecture-planner`.
- New ideas, fixes, scope changes, architecture notes, data contract changes, or verification requests during an active phase: `phase-change-intake` before changing the plan.
- Phase planning: `phase-planner`.
- One phase work item at a time: `phase-step-runner`.
- Full phase execution with worker/reviewer/checker roles: `phase-full-runner`.
- Roadmap/phase/step explicit status audit: `phase-status-audit`.
- Bidirectional roadmap/OpenSpec ownership validation: `roadmap-openspec-validator`.
- OpenSpec task execution with implementer/reviewer subagents when tasks are independent or risk is high: `subagent-driven-development`.
- SDD/OpenSpec workflow: `openspec-propose`, `openspec-apply-change`, `openspec-sync-specs`, `openspec-archive-change`, `openspec-explore`.
- Delegating a bounded task to Claude: `handoff-to-claude`.
- End-of-session reporting: `session-report`.
- Periodic doc/reality reconciliation: `doc-sync-audit`.
- At the start of planning or phase execution work, state which skill is being used and why.
- OpenSpec artifacts under `openspec/` are the source of truth for product behavior, requirements, proposed changes, acceptance criteria, and implementation tasks.
- Roadmap phases are mandatory ownership and execution layers for OpenSpec-enabled projects. Every accepted capability spec and active change has one primary phase and exactly one matching inverse roadmap row; related phases are optional.
- Run `roadmap-openspec-validator` when creating, planning, applying, syncing, archiving, or auditing specs, changes, phases, lifecycle status, or inverse tables. Errors block completion; an uncovered draft phase is a reportable warning.
- Phase work items must be spec-backed: each item links to accepted OpenSpec requirements, an active OpenSpec change, or an explicit task to create/update the needed OpenSpec artifact before implementation. Docs/setup/ops-only work may instead state that classification.
- Use `phase-status-audit` before starting or closing roadmap/phase/step work. Closed phases cannot contain unfinished, unmarked, invalid, or pending-acceptance child items.
- Allowed roadmap/phase/work-item statuses: `draft`, `planned`, `ready`, `in_progress`, `blocked`, `pending_acceptance`, `accepted`, `closed`, `deferred`, `cancelled`, `superseded`.
- Sequential roadmap work is blocked by pending human acceptance of prerequisite phases/steps, unresolved gates, or spec decisions. Stop before implementation and ask for acceptance or a dependency decision.
- Parallel roadmap work may proceed only when it is explicitly independent and documented as non-blocking.
- Do not infer phase-based work from the existence of phase skills. Use `phase-*` skills only for explicit roadmap/phase work or a documented active phase.
- Closed OpenSpec changes and closed roadmap phases require PR creation/preparation to `main` after docs, verification, and final commit.
- Documentation governance is continuous: after changing specs/docs/code or recording discussions, ideas, objections, or review comments, update affected docs and run a consistency check for stale state, contradictions, duplicate active rules, and missing cross-references.
- Human answers are captured incrementally: when the human answers agent questions, record each durable answer immediately in the smallest correct artifact, even if other questions remain under discussion.
- After final acceptance of a proposal, spec, phase direction, or decision set, re-check the full dialogue and verify that accepted decisions, proposed ideas, rejected options, open questions, terminology, risks, and verification expectations are captured.
- Do not duplicate active rules across `AGENTS.md`, `docs/`, and `openspec/`. Keep the canonical rule in the smallest correct source of truth and reference it elsewhere.
- When creating a phase implementation plan, follow `docs/phases/PHASE_PLAN_TEMPLATE.md`.
- Planning from `docs/ROADMAP.md` alone is forbidden.
- Documentation governance and TDD-style verification rules should live in `openspec/specs/documentation-governance/spec.md` once that spec exists.
- New feedback during a phase must be routed as adopt now, queue current phase, create OpenSpec change, defer, or reject before it changes active scope.
- For SDD/OpenSpecs work, run `openspec list`, `openspec list --specs`, and `openspec validate --all --strict` before completion when relevant.

## Branching Guidance

Before implementation, use `using-git-worktrees` to confirm whether the current checkout is already isolated and on the correct branch, create an isolated worktree/branch when needed, or record the human-approved exception.

Branch source order:

1. Active OpenSpec change: branch name matches `openspec/changes/<change-id>/` or a short slug derived from it.
2. Active roadmap phase/work item: branch name matches the phase or workstream.
3. No active OpenSpec change or roadmap plan: create a short descriptive implementation branch.

If the current branch does not match the active OpenSpec change branch, phase plan branch, or requested implementation branch, branch from `main` before changing files. If `main` is unavailable, use the repository's default stable branch and state the fallback in the report.

For roadmap work, use a branch whose name clearly identifies the phase or workstream, for example:

```text
phase-0/project-foundation
phase-1/discovery
phase-2/core-data-model
phase-3/first-usable-workflow
```

Use `main` only for stable integration or initial repository setup.

## Secrets And Config

- Credential and secret values must live in local-only files ignored by git.
- The default local secret file is `.env.local`.
- Keep `.env.example` in git as the documented template with placeholders only.
- Never commit API keys, customer files, production credentials, private datasets, dumps, or exports.

## Command Execution Rules

- Always run shell commands with explicit timeouts where the tool supports them.
- Prefer non-interactive commands.
- For commands that can produce large output, inspect focused output instead of flooding the conversation.
- If a command appears blocked, stop it, record the exact command and blocker, then retry narrower or report the required human action.

## Before Claiming Work Is Done

- Run the narrowest meaningful verification command.
- If verification cannot run, record the exact command and blocker.
- Verify that documentation is still correct and complete for the task.
- Create a git commit before replying when the repository has intentional changes and local rules require commits.
"""


README = r"""
# $project_name

## Summary

Describe what the project does, who it serves, and the first valuable outcome it should deliver.

Current checkpoint:

> Unknown. Replace this with the near-term product or engineering checkpoint.

## Scope

In scope:

- Unknown. Add agreed product, technical, or operational scope.

Out of scope:

- Unknown. Add explicit exclusions to prevent accidental expansion.

## Key Decisions

- Unknown. Record accepted human decisions here with dates when useful.

## Documentation Rules

- `AGENTS.md` is the canonical agent operating guide.
- `docs/00_FILE_STRUCTURE.md` is the repository map and must be updated when files or folders are added.
- `docs/CURRENT_PROJECT_AUDIT.md` is an active planning input and must be updated when findings are fixed or invalidated by evidence.
- Detailed phase plans live under `docs/phases/` and must use `docs/phases/PHASE_PLAN_TEMPLATE.md`.
- New human feedback that affects behavior, safety, UX, workflow, acceptance, or verification must be persisted in the correct durable document.
- After any spec, docs, implementation, setup, roadmap, architecture, verification, or durable-decision change, check related documentation for stale state, contradictions, duplicate active rules, and missing cross-references.
- Prefer one canonical source for each active rule. Use references instead of copying the same rule across `AGENTS.md`, `docs/`, and `openspec/`.
"""


FILE_STRUCTURE = r"""
# 00. File Structure

This document is the repository map for agents and humans. Keep it current whenever files or folders are added, removed, or repurposed.

## Root

| Path | Purpose |
|---|---|
| `AGENTS.md` | Canonical operating guide for Codex and future agents |
| `CLAUDE.md` | Thin Claude entry point: read `AGENTS.md`, then the active handoff if listed |
| `.env.example` | Versioned environment template with placeholders only |
| `.gitignore` | Excludes secrets, local config, generated artifacts, and private data |
| `docs/` | Product, architecture, operations, roadmap, audit, glossary, and phase documentation |

## Documentation

| Path | Purpose |
|---|---|
| `docs/README.md` | Documentation home and product overview |
| `docs/00_FILE_STRUCTURE.md` | Repository and documentation map |
| `docs/ROADMAP.md` | Phase-level roadmap and gates |
| `docs/CURRENT_PROJECT_AUDIT.md` | Current setup/repository audit and known risks |
| `docs/AI_STEP_VERIFICATION_CHECKLIST.md` | Mandatory self-check for AI agents |
| `docs/CONTEXT.md` | Active glossary and domain boundaries |
| `docs/planning/` | Cross-phase planning notes and decision drafts |
| `docs/audits/` | Focused audit reports |
| `docs/phases/` | Detailed phase plans and templates |
| `docs/handoffs/` | Bounded task handoffs to Claude (see global `handoff-to-claude` skill) |

## Skills

Workflow skills are global (`~/.codex/skills`): using-git-worktrees, architecture-planner, phase-planner, phase-step-runner, phase-full-runner, phase-status-audit, phase-change-intake, roadmap-openspec-validator, subagent-driven-development, openspec-*, handoff-to-claude, session-report, doc-sync-audit. This repository intentionally has no `.codex/skills/` directory.
"""


ROADMAP = r"""
# Roadmap

This roadmap is a phase-level planning view for $project_name. Use it to organize order, gates, batches, and progress. OpenSpec changes under `openspec/` are the source of truth for behavior, acceptance criteria, data contracts, and implementation tasks.

## Current Roadmap Validation

- Current phase: no implementation phase; P0 is a draft until initial OpenSpec ownership is assigned.
- Planning from this roadmap alone is forbidden. Detailed phase plans must reconcile roadmap intent, OpenSpec artifacts, current docs, current implementation, environment evidence, audit findings, and human decisions.
- Product behavior, requirements, proposed changes, acceptance criteria, and implementation tasks belong in OpenSpec artifacts under `openspec/` when SDD applies.
- Each phase work item should be spec-backed: link it to accepted OpenSpec requirements, an active OpenSpec change, or a task to create/update the needed OpenSpec artifact before implementation. Mark docs/setup/ops-only work explicitly.
- Every accepted capability spec declares exactly one `Roadmap phase: Pn`; every active change declares exactly one `Execution phase: Pn`; the two inverse tables below contain exactly one matching row per artifact.
- Use the global `roadmap-openspec-validator` after any spec, change, lifecycle, phase, or inverse-table update. An uncovered `draft` phase is a warning; uncovered non-draft phases and linkage inconsistencies are errors.
- Sequential roadmap phases/steps must not start implementation while a prerequisite phase/step is waiting for human acceptance, unresolved gates, or spec decisions.
- Parallel roadmap work may proceed only when it is explicitly independent and the non-blocking dependency rationale is documented.
- Every roadmap phase, phase plan, step, and work item must have an explicit status from the allowed set: `draft`, `planned`, `ready`, `in_progress`, `blocked`, `pending_acceptance`, `accepted`, `closed`, `deferred`, `cancelled`, `superseded`.
- Closed phases/steps must not contain unfinished, unmarked, invalid, or pending-acceptance child items. Use the global `phase-status-audit` skill before closing phases/steps or trusting old phase plans.
- New ideas during active phase work must go through change intake before they alter scope or plans.
- Update this file when phase status, gates, or scope changes.

## Phase 0. Project Foundation

Status: draft.

Goal: prepare repository rules, documentation, environment notes, baseline product decisions, and verification habits.

Quality gate:

- `AGENTS.md`, docs map, roadmap, audit, verification checklist, and phase template exist.
- Secrets and private-data rules are clear.
- OpenSpec expectations and phase change-intake routing are documented.
- Another agent can continue without chat history.

## Phase 1. Discovery And Requirements

Status: draft.

Goal: identify users, workflows, data sources, constraints, and first acceptance criteria.

## Phase 2. Architecture And Data Model

Status: draft.

Goal: define the first stable architecture, core entities, storage boundaries, and integration contracts.

## Phase 3. First Usable Workflow

Status: draft.

Goal: implement the first end-to-end workflow that proves project value.

## Phase 4. Hardening And Pilot Readiness

Status: draft.

Goal: improve reliability, safety, UX, operations, and acceptance evidence.

## Phase Planning Rule

Create or update a detailed phase plan under `docs/phases/` when execution needs work-item detail. Keep the phase plan as an index over OpenSpec-backed work items, not a replacement for specs. Every OpenSpec artifact still needs exactly one primary roadmap phase even when no detailed phase plan is needed.

## Capability Spec Ownership

| Capability spec | Roadmap phase | Related phases |
|---|---|---|

## Active Change Execution

| Active change | Execution phase | Related phases | Lifecycle status |
|---|---|---|---|
"""


AUDIT = r"""
# Current Project Audit

Status: active.

Last updated: $today.

## Repository Baseline

| Item | Current State |
|---|---|
| Repository root | `$target` |
| Current branch | Unknown |
| Remote | Unknown |
| Latest known commit before this audit update | Unknown |

## Useful Starting Points

- Documentation starts in `docs/`.
- Roadmap exists at `docs/ROADMAP.md`.
- Agent work rules are recorded in `AGENTS.md`.
- Workflow skills are global under `~/.codex/skills`.

## Verified Environment Evidence

| Check | Evidence |
|---|---|
| Git installed | Unknown |
| Runtime installed | Unknown |
| Tests available | Unknown |
| Local app/server available | Unknown |

## Known Risks And Gaps

| ID | Risk | Owner | Status |
|---|---|---|---|
| AUDIT-001 | Product scope, first workflow, and acceptance criteria are not fully documented yet. | Phase 0/1 | open |
| AUDIT-002 | Environment and verification commands are not recorded yet. | Phase 0 | open |
| AUDIT-003 | Architecture decisions are not documented yet. | Phase 1/2 | open |

## Audit Rules

- Update this file when a finding is fixed, invalidated by evidence, or moved.
- Do not mark a finding closed without verification evidence.
"""


CHECKLIST = r"""
# AI Step Verification Checklist

Purpose: define the minimum self-check an AI agent must run before claiming a roadmap step, phase work item, architecture change, UI change, data contract change, code change, or documentation update is complete.

Status: mandatory for future implementation work. If this checklist conflicts with a phase-specific plan, stop and document the conflict instead of guessing.

## Required Pre-Work Check

Before changing code or product documentation, confirm:

- The global `using-git-worktrees` skill was used before implementation work, or the human explicitly approved working in the current checkout.
- Branch source was selected in order: active OpenSpec change first, active roadmap/phase plan second, requested implementation third.
- Current branch matches the active OpenSpec change branch, active phase branch, or requested implementation branch; otherwise a new branch/worktree was created from `main` or the repository's default stable branch.
- The work was not treated as phase-based unless the human explicitly requested phase/roadmap work or the project declares an active phase.
- If work follows a roadmap phase/step, the phase item has OpenSpec source mapping: accepted requirement, active proposed change, task to create/update OpenSpec first, or docs/setup/ops-only classification.
- `roadmap-openspec-validator` reports zero errors; warnings are recorded separately from product blockers.
- If work follows a roadmap phase/step, dependency status was checked before implementation. Sequential work with pending prerequisite acceptance, unresolved gates, or spec decisions is blocked; independent parallel work records why it is non-blocking.
- `phase-status-audit` was used for roadmap/phase/step work, or this was not roadmap/phase/step work.
- Every relevant phase, step, and work item has an explicit allowed status.
- No closed phase/step contains unfinished, unmarked, invalid, or pending-acceptance child items unless the inconsistency is recorded as a blocker.
- For OpenSpec implementation, `openspec-apply-change` was used and the active change name, schema, progress, and context files are known.
- Subagent decision was made before coding: use `subagent-driven-development` for independent/high-risk OpenSpec tasks, or record why local execution is sufficient.
- Recent discussions, ideas, objections, and review comments were checked for durable project knowledge that must be recorded.
- Durable answers the human gave to agent questions were recorded as they arrived, not deferred until the end of the discussion.
- After final acceptance, the full dialogue was reviewed for accepted decisions, proposed ideas, rejected options, open questions, terminology changes, risks, and verification expectations that still need durable capture.
- Related docs were checked for stale state, contradictions, duplicate active rules, and missing cross-references after any spec/doc/code/status change.
- `AGENTS.md`, `docs/README.md`, `docs/00_FILE_STRUCTURE.md`, `docs/ROADMAP.md`, the relevant phase plan, `openspec/` when SDD applies, `docs/CURRENT_PROJECT_AUDIT.md`, and this checklist were read.
- The active `openspec/changes/<change-id>/` folder was read when work implements or plans a proposed change.
- Task-specific audit, acceptance-gap, handoff, or planning documents were read.
- Existing code and tests were searched for the concepts being changed.
- The work was classified as product behavior, architecture, setup, operations, security, roadmap status, data contract, user-visible label, or docs-only.
- Affected OpenSpec requirements, proposed deltas, acceptance scenarios, and expected verification evidence are known before implementation starts.
- New human feedback received during the phase was routed through `phase-change-intake` before changing the active plan.

If documentation is ambiguous, incomplete, or contradictory, say so in the user-facing report and update the relevant work log or audit note instead of silently guessing.

## Human Feedback Memory

Whenever the human owner explains how the product should work, rejects behavior, adds an edge case, corrects terminology, or asks for a verification habit, classify it before finishing:

Record durable knowledge in the smallest correct durable artifact before treating it as project state.

When the human answers agent questions, record each durable answer immediately, even if other answers are still being discussed. Do not let the last discussed topic overwrite earlier answers. After final acceptance of a proposal, spec, phase direction, or decision set, review the full dialogue and confirm every accepted decision, proposed idea, rejected option, open question, terminology change, risk, and verification expectation is captured or explicitly reported as uncaptured.

- `glossary_term`: update `docs/CONTEXT.md`.
- `product_behavior_rule`: update `openspec/specs/` when accepted current behavior changes, or `openspec/changes/` when the behavior is still proposed.
- `acceptance_criterion`: update the active `openspec/changes/` artifact and relevant phase plan; promote it to `openspec/specs/` only after acceptance.
- `verification_step`: update this checklist.
- `rejected_behavior`: update an audit/acceptance-gap document and this checklist when it affects future verification.
- `open_decision`: record it in the phase plan, audit, or roadmap and state it in the final report.
- `implementation_detail`: document it only where it affects behavior, architecture, setup, operations, security, or future work.
- `reporting_preference`: update `AGENTS.md` and this checklist when the human asks for a different answer style, level of detail, or report structure.

After recording any of the above, check related docs for consistency and duplicate active rules. If a rule belongs in OpenSpec, keep it there and reference it from roadmap/project docs instead of copying it.

## Advice-Versus-Action Check

- If the human asks "what is next", include a concrete next-step recommendation and explain why it is next.
- If the human asks "how is it better", asks for advice, or asks a conceptual/architecture question, provide a detailed answer first and do not silently implement.
- If the human also explicitly asks to "record", "write", "update", "fix", "continue", or otherwise change project artifacts, make the requested documentation/code change after answering or while clearly separating the action from the advice.
- When there is ambiguity between "answer" and "do", prefer answering and ask for confirmation before implementation unless project safety, durable documentation, or an explicit "record this" request makes the action clear.
- When multiple open questions remain, ask them in one concise batch with recommended defaults and tradeoffs. Ask one-by-one only when one blocking answer is required before any useful next step can happen.

## Domain And Architecture Check

- Use canonical terms from `docs/CONTEXT.md`.
- Preserve boundaries between raw input, derived data, review-required proposals, and accepted decisions.
- Do not treat heuristic or LLM output as source-of-truth data.
- Record architecture decisions that affect module boundaries, persistence, integrations, security, deployment, or operations.

## Test And Evidence Check

- Treat OpenSpec scenarios as the acceptance starting point for TDD-style work.
- Before writing code, identify whether the change can be covered by automated tests, syntax checks, contract checks, or manual verification.
- Add or update tests proportional to risk.
- Cover negative cases where the system must not infer too much.
- Run the narrowest meaningful tests first, then broader tests when shared behavior changes.
- Run `git diff --check` before completion when files changed.
- For SDD/OpenSpecs changes, run `openspec list`, `openspec list --specs`, and `openspec validate --all --strict`.
- Run `roadmap-openspec-validator` for OpenSpec-enabled projects and resolve every ownership, phase, inverse-row, lifecycle, coverage, or phase-plan error.
- If a test or check cannot run, record the exact command and blocker.
- If automated tests do not exist for the affected behavior, record manual verification steps and remaining manual-verification risk.
- When the next step requires a human decision, explicitly state that it is a required decision and explain the question, why it matters, relevant options or tradeoffs, and the consequence of leaving it unresolved.
- When the next step requires mandatory verification, explicitly state that it is required and describe exactly what must be checked, how to check it where known, expected evidence, and residual risk if it is not performed.
- When an OpenSpec change or roadmap phase is closed, create or prepare a PR to `main` after docs, verification, and final commit; if blocked, record the blocker and exact remaining PR step.
- Do not start sequential roadmap implementation when a prerequisite phase/step is still waiting for human acceptance, unresolved gates, or spec decisions. Ask for acceptance or a dependency decision instead.
- Run `phase-status-audit` before claiming a roadmap phase/step is complete or closed.

## Documentation Check

Before reporting completion, ask:

- Does `docs/00_FILE_STRUCTURE.md` need an update?
- Does `docs/ROADMAP.md` need a phase status, gate, or acceptance update?
- Does any pending human acceptance, unresolved gate, or spec decision block the next sequential roadmap phase/step?
- Did `phase-status-audit` find missing statuses, invalid statuses, or closed parents with unfinished/unmarked child items?
- Does `docs/CURRENT_PROJECT_AUDIT.md` need a finding added, updated, or closed?
- Does `openspec/` need a CLI-native spec or change update?
- Does `openspec/specs/documentation-governance/spec.md` still describe the documentation and TDD workflow accurately?
- Does the relevant phase plan need implementation evidence or blockers?
- If an OpenSpec change or roadmap phase was closed, was a PR to `main` created/prepared or was the blocker recorded?
- Does `docs/CONTEXT.md` need a glossary term?
- Does this checklist need an update because the human introduced a new verification habit or rejected behavior?
- Did any new phase idea need an intake record, OpenSpec change, audit note, or deferred backlog entry?
- Did any discussion, idea, objection, or review comment create durable project knowledge that still needs to be recorded?
- Did the human answer any agent questions whose earlier answers might have been missed because later topics continued?
- After final acceptance, were all accepted decisions and proposed ideas from the full dialogue captured, not only the last discussed point?
- Are there duplicated active rules across `AGENTS.md`, `docs/`, and `openspec/` that should be canonicalized into one source plus references?

## Final Report Check

Follow the global `session-report` skill: pick short or full mode by task size, write in Russian with clear Markdown sections, make the report self-contained, and end with the next step. For phase, step, roadmap, architecture, or OpenSpec work, include an executive summary, what was completed, decisions and reasoning, tradeoffs or rejected options when relevant, verification evidence, phase-status-audit result when roadmap/phase/step status is in scope, risks/uncertainties, and the practical next step; file links are supporting evidence only. OpenSpec implementation should include change name, schema, task progress, verification evidence, docs updated, subagent usage or non-usage rationale, PR readiness/status when the change is closed, and whether the change is ready to archive, paused, or still has remaining tasks. When the next step requires a human decision or mandatory verification, explain it in detail rather than using a terse label.
"""


CONTEXT = r"""
# Context

This is the active glossary and domain-boundary file for $project_name.

## Canonical Terms

| Term | Meaning | Notes |
|---|---|---|
| Unknown | Add domain terms as soon as the human owner defines them. | Do not rely on chat history alone. |

## Boundary Rules

- Raw user/customer/source data must be preserved separately from derived values.
- Review-required proposals are not accepted decisions.
- LLM or heuristic output is proposal evidence only unless the project explicitly defines a reviewed acceptance workflow.
"""


PHASE_TEMPLATE = r"""
# Phase N. Title

Status: draft.

Allowed statuses: `draft`, `planned`, `ready`, `in_progress`, `blocked`, `pending_acceptance`, `accepted`, `closed`, `deferred`, `cancelled`, `superseded`.

## Goal

Describe the concrete outcome this phase must produce.

## Inputs To Read

- `AGENTS.md`
- `docs/README.md`
- `docs/00_FILE_STRUCTURE.md`
- `docs/ROADMAP.md`
- `docs/CURRENT_PROJECT_AUDIT.md`
- `docs/AI_STEP_VERIFICATION_CHECKLIST.md`
- `openspec/` when product behavior, requirements, proposed changes, data contracts, or acceptance criteria are involved
- Relevant topic docs

## OpenSpec And Acceptance Mapping

- OpenSpec source type: accepted spec / active change / create-or-update-needed / docs-setup-ops-only.
- Affected accepted requirements:
  - Unknown.
- Active proposed changes:
  - Unknown.
- Acceptance scenarios:
  - Unknown.
- Verification evidence expected before completion:
  - Unknown.

## Dependency And Acceptance Gate

- Dependency type: sequential / parallel-independent / unknown.
- Prerequisite phases or steps:
  - Unknown.
- Human acceptance required before implementation:
  - Unknown.
- Blocking gates or spec decisions:
  - Unknown.
- Non-blocking rationale for parallel work:
  - Unknown.

## Status Audit

- `phase-status-audit` last run:
  - Unknown.
- Missing or invalid statuses:
  - Unknown.
- Closed parent items with unfinished, unmarked, invalid, or pending-acceptance children:
  - Unknown.

## Change Intake

Record new ideas, fixes, scope changes, architecture notes, data contract changes, or verification requests that appear during the phase.

```text
Idea:
Source:
Type:
Decision:
Reason:
Affected specs:
Affected architecture:
Data contract impact:
Verification impact:
Status:
```

## Work Items

### N.1 Work Item Title

Status: draft.

Objective:

- Unknown.

Expected files/modules:

- Unknown.

Dependency status:

- Unknown. State whether this work item is sequentially blocked, accepted to proceed, or parallel-independent with rationale.

Verification:

- Unknown.

Documentation updates:

- Unknown.

Recommended subagents:

- worker: implement or draft the bounded change.
- reviewer: inspect risks, regressions, and missing tests.
- architecture-checker: verify boundaries and decisions.
- verification-checker: verify evidence and final report completeness.

Exit criteria:

- Unknown.

OpenSpec and acceptance evidence:

- Unknown.

## Phase Gate

- Unknown.

## Human Decisions

- Unknown.
"""


PHASE_0 = r"""
# Phase 0. Project Foundation

Status: draft.

## Goal

Prepare repository operating rules, documentation structure, initial roadmap, audit, and verification checklist.

## Work Items

### 0.1 Documentation Foundation

Objective:

- Establish `AGENTS.md`, `CLAUDE.md`, `docs/`, roadmap, audit, glossary, and phase template.

Verification:

- Confirm required files exist.
- Confirm `docs/00_FILE_STRUCTURE.md` matches the generated structure.
- Confirm OpenSpec expectations and change-intake rules are documented.
- Run `git status --short`.

Exit criteria:

- Another Codex session can start from `AGENTS.md` and continue without chat history.

## Phase Gate

- Project rules are clear.
- Secret and private-data handling is documented.
- Initial open decisions and risks are recorded.
"""


GITIGNORE = r"""
.env.local
*.local
*.log
*.dump
*.db
.venv/
venv/
node_modules/
dist/
build/
tmp/
data/
imports/
exports/
customer-files/
"""


ENV_EXAMPLE = r"""
# Copy to .env.local and fill local-only values.
APP_ENV=development
"""


CLAUDE_MD = r"""
# Claude Entry Point

Read `AGENTS.md` first. It is the canonical instruction file for all agents.

Do not maintain separate project rules here. If a workflow, convention, or architecture constraint is useful for Claude, put it in `AGENTS.md` or the relevant file under `docs/`.

## Active Handoff

None. When Codex prepares a bounded task for Claude, a single line with the path to `docs/handoffs/HANDOFF_<date>_<topic>.md` appears here (see the global `handoff-to-claude` skill).
"""


def files_for(values: dict[str, str]) -> dict[Path, str]:
    root = Path(values["target"])
    files = {
        root / "AGENTS.md": render(AGENTS, values),
        root / "CLAUDE.md": render(CLAUDE_MD, values),
        root / "docs" / "README.md": render(README, values),
        root / "docs" / "00_FILE_STRUCTURE.md": render(FILE_STRUCTURE, values),
        root / "docs" / "ROADMAP.md": render(ROADMAP, values),
        root / "docs" / "CURRENT_PROJECT_AUDIT.md": render(AUDIT, values),
        root / "docs" / "AI_STEP_VERIFICATION_CHECKLIST.md": render(CHECKLIST, values),
        root / "docs" / "CONTEXT.md": render(CONTEXT, values),
        root / "docs" / "phases" / "PHASE_PLAN_TEMPLATE.md": render(PHASE_TEMPLATE, values),
        root / "docs" / "phases" / "PHASE_0_PROJECT_FOUNDATION.md": render(PHASE_0, values),
        root / ".gitignore": render(GITIGNORE, values),
        root / ".env.example": render(ENV_EXAMPLE, values),
    }
    return files


def ensure_dirs(root: Path, dry_run: bool) -> list[str]:
    paths = [
        root / "docs" / "planning",
        root / "docs" / "audits",
        root / "docs" / "phases",
        root / "docs" / "handoffs",
    ]
    messages = []
    for path in paths:
        if dry_run:
            messages.append(f"would create directory {path}")
        else:
            path.mkdir(parents=True, exist_ok=True)
            messages.append(f"ensured directory {path}")
    return messages


def check(root: Path) -> int:
    required = [
        "AGENTS.md",
        "docs/README.md",
        "docs/00_FILE_STRUCTURE.md",
        "docs/ROADMAP.md",
        "docs/CURRENT_PROJECT_AUDIT.md",
        "docs/AI_STEP_VERIFICATION_CHECKLIST.md",
        "docs/CONTEXT.md",
        "docs/phases/PHASE_PLAN_TEMPLATE.md",
        "CLAUDE.md",
    ]
    missing = [item for item in required if not (root / item).exists()]
    if missing:
        print("Missing required starter files:")
        for item in missing:
            print(f"- {item}")
        return 1
    print("Project starter structure check passed.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Bootstrap Codex project starter docs (workflow skills are global in ~/.codex/skills).")
    parser.add_argument("--target", default=".", help="Target project directory.")
    parser.add_argument("--project-name", help="Human-readable project name.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing starter files.")
    parser.add_argument("--dry-run", action="store_true", help="Show planned writes without changing files.")
    parser.add_argument("--check", action="store_true", help="Check that starter structure exists.")
    args = parser.parse_args()

    target = Path(args.target).expanduser().resolve()
    if args.check:
        return check(target)

    project_name = args.project_name or target.name
    values = {
        "project_name": project_name,
        "project_slug": slugify(project_name),
        "target": str(target),
        "today": dt.date.today().isoformat(),
    }

    for message in ensure_dirs(target, args.dry_run):
        print(message)
    for path, content in files_for(values).items():
        print(write_file(path, content, args.force, args.dry_run))

    print("Done. Replace Unknown placeholders with evidence and human decisions before implementation work.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
