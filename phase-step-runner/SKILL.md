---
name: phase-step-runner
description: Execute exactly one roadmap phase work item at a time with implementation, focused verification, documentation updates, change-intake handling for new ideas, and a commit when project rules require it. Use when the user asks to continue a phase, complete the next phase item, do one phase step, or work through a detailed phase plan incrementally.
---

# Phase Step Runner

Execute one spec-backed work item, not a whole phase, unless the user explicitly asks otherwise. Phase steps organize the work; OpenSpec defines product behavior, acceptance, and implementation tasks.

## Workflow

1. State that this global skill is being used.
2. Read required docs from `AGENTS.md`, including the relevant phase plan and verification checklist.
3. Use `phase-status-audit` before implementation to verify explicit statuses for the active phase, selected work item, prerequisite phases/steps, and old phase-plan leftovers.
4. Verify the current branch matches the active phase or record the human-approved exception.
5. Apply the roadmap dependency gate before implementation: inspect whether this work item depends on a previous phase/step that is still waiting for human acceptance, unresolved gates, or spec decisions.
6. If the work is sequentially dependent on a previous phase/step with pending acceptance, stop before implementation. Record the blocker, ask for acceptance or a dependency decision, and do not treat a request to continue as implicit acceptance.
7. If the work is parallel or independent, document why it is safe to proceed before changing files: no dependency on the pending acceptance, no shared unresolved spec decision, no data contract/architecture gate, and no risk of invalidating the previous review.
8. Confirm the work item has OpenSpec source mapping: accepted requirement, active proposed change, a task to create/update OpenSpec before implementation, or docs/setup/ops-only classification.
9. Use `roadmap-openspec-validator`; stop on ownership, unknown-phase, inverse-row, non-draft coverage, lifecycle, or phase-plan mismatch errors. Report allowed draft warnings.
10. Map affected OpenSpec requirements or proposed deltas to acceptance scenarios and verification evidence.
11. If product behavior, acceptance criteria, or data contracts are affected but no OpenSpec mapping exists, stop and create/update the OpenSpec artifact before implementation.
12. Route any new phase feedback through `phase-change-intake` before changing scope.
13. Implement the smallest complete slice for the selected work item.
14. Run focused checks first; run broader checks when shared behavior changes.
15. Update docs for behavior, architecture, setup, operations, security, roadmap status, data contracts, OpenSpec artifacts, verification rules, and explicit phase/work-item statuses. Keep artifact phase metadata and inverse roadmap rows atomic.
16. Re-run `roadmap-openspec-validator`, then use `phase-status-audit` again before closing a step or phase.
17. Commit intentional changes when project rules require it.
18. If this work item closes the whole phase, create or prepare a pull request from the phase branch to `main` after final docs, verification, status audit, and commit. If `main` is unavailable, target the default stable branch and report the fallback.
19. Report in `session-report` full mode. Include a self-contained executive summary, dependency/acceptance status, phase-status-audit result, OpenSpec mapping, what was completed, decisions and reasoning, rejected options or assumptions when relevant, important implementation/doc changes, verification evidence, manual verification, risks, skills, subagents, PR readiness/status when relevant, unresolved decisions, and next step. Do not replace this explanation with file links.
