---
name: phase-full-runner
description: "Execute a complete requested roadmap phase, including dependencies, work items, and phase acceptance."
---

# Phase Full Runner

Coordinate full phase execution while preserving the one-work-item verification and commit rhythm. A phase is a roadmap coordination layer; every implementation work item remains grounded in OpenSpec requirements, proposed changes, acceptance scenarios, or an explicit docs/setup/ops-only classification.

**Boundary:** This skill owns phase gates, dependencies, status, documentation, and phase acceptance. `subagent-driven-development` is the single source of truth for per-task risk classification, subagent roles, models, review depth, architecture checks, review freeze, stall handling, and final branch review. Do not duplicate those decisions here.

## Workflow

1. State that this global skill is being used.
2. Read required docs from `AGENTS.md`, including the phase plan and verification checklist.
3. Use `phase-status-audit` before implementation to verify explicit statuses across roadmap, old phase plans, prerequisite phases/steps, gates, and the requested phase.
4. Verify branch and phase status.
5. Use `roadmap-openspec-validator` before the first work item. Stop on errors; report uncovered draft warnings separately.
6. Apply the roadmap dependency gate before starting implementation: inspect whether the requested phase depends on a previous phase/step that is still waiting for human acceptance, unresolved gates, or spec decisions.
7. If the phase is sequentially dependent on a previous phase/step with pending acceptance, stop before implementation. Record the blocker, ask for acceptance or a dependency decision, and do not treat a request to continue as implicit acceptance.
8. If some phase work is parallel or independent, document why it is safe to proceed before changing files: no dependency on the pending acceptance, no shared unresolved spec decision, no data contract/architecture gate, and no risk of invalidating the previous review.
9. Before implementation, scan all remaining allowed work items and ask `subagent-driven-development` to create review clusters where tasks share one bounded component and accepted contract. Keep each work item's OpenSpec evidence and status separate; do not add a phase-level review route.
10. For each work item or approved review cluster:
   - confirm OpenSpec source mapping or docs/setup/ops-only classification before implementation;
   - confirm the accepted spec/change has exactly one primary phase and a matching inverse roadmap row;
   - confirm dependency/acceptance status is still non-blocking;
   - confirm the work item has an explicit allowed status;
   - map OpenSpec requirements/deltas to acceptance evidence;
   - create or update OpenSpec artifacts first when product behavior, acceptance criteria, or data contracts lack a spec/change;
   - invoke `subagent-driven-development` for implementation and its risk-routed verification; honour its frozen-review and stall circuit-breaker rules; record its acceptance evidence;
   - route new feedback through `phase-change-intake`;
   - update only the task-owned acceptance/status evidence and documentation required by that task's contract;
   - commit before moving to the next item when project rules require it.
11. Run `roadmap-openspec-validator` after every work item or cluster that changes phase ownership, OpenSpec lifecycle, sync state, or roadmap status.
12. Use `phase-status-audit` at the phase gate and before closing the phase. Do not close the phase while child work items are unfinished, unmarked, invalid, or pending acceptance.
13. At the phase gate, perform the one consolidated phase documentation sync (roadmap narrative, audit/status summary, and cross-item docs), then use `session-report` full mode and summarize the phase outcome in a self-contained way: completed work, dependency/acceptance status, phase-status-audit result, OpenSpec/spec-backed coverage, decisions and reasoning, tradeoffs or rejected options, evidence, remaining risks, manual checks, human decisions, and next step. Do not replace this explanation with links to phase files.
14. When the phase is closed, create or prepare a pull request from the phase branch to `main` after final docs, verification, status audit, and commit. If `main` is unavailable, target the repository's default stable branch and report the fallback. Do not merge directly unless the human explicitly asks.

If subagent tools are unavailable, execute locally and record that limitation in the final report.
