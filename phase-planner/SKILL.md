---
name: phase-planner
description: "Plan or revise a roadmap phase and its acceptance work items. Skip routine tasks outside a roadmap phase."
---

# Phase Planner

Phase plans are spec-backed coordination documents. Roadmaps and phases describe ordering, gates, and execution slices; OpenSpec remains the foundation for product behavior, requirements, acceptance scenarios, and implementation tasks.

When a repository uses OpenSpec, roadmap ownership is mandatory and bidirectional: every accepted capability spec has exactly one `Roadmap phase: Pn`, every active change has exactly one `Execution phase: Pn`, and `docs/ROADMAP.md` contains the matching inverse rows. Related phases are optional; the primary phase is never optional.

Planning from `docs/ROADMAP.md` alone is forbidden. Every implementation work item must include one of:

- a link to accepted OpenSpec requirements in `openspec/specs/`;
- a link to an active proposed change under `openspec/changes/<change-id>/`;
- an explicit task to create or update the required OpenSpec artifact before implementation;
- a clear classification as docs/setup/ops-only with no product-behavior or data-contract change.

## Workflow

1. State that this global skill is being used.
2. Read the required docs from `AGENTS.md`.
3. Use `phase-status-audit` before planning to verify that existing roadmap phases, old phase plans, gates, and work items have explicit statuses.
4. Use `roadmap-openspec-validator` before planning. Treat errors as blockers. An uncovered `draft` phase warning is allowed; every non-draft phase needs spec/change coverage before the plan is current.
5. Apply the roadmap dependency gate before planning Phase N: inspect whether Phase N depends on Phase N-1 outputs, unresolved gates, human acceptance, or spec decisions.
6. If Phase N is sequentially dependent on a previous phase/step that is still pending human acceptance, do not start new implementation planning. Record the blocker, ask for acceptance or a dependency decision, and only continue with independent parallel work when the plan explicitly marks it as non-blocking.
7. If the next work is parallel or independent, document why it is safe to proceed before planning it: no dependency on the pending acceptance, no shared unresolved spec decision, no data contract/architecture gate, and no risk of invalidating the previous phase review.
8. Read the target phase plan if it exists; otherwise use `docs/phases/PHASE_PLAN_TEMPLATE.md`.
9. Search code/tests/docs for implemented evidence related to the phase.
10. Reconcile roadmap intent, current implementation, audit risks, OpenSpec specs/changes, queued change-intake records, human decisions, and verification checklist requirements.
11. Write work items with objective, explicit status, dependency status, OpenSpec source/change mapping, affected requirements or deltas, expected files, verification, documentation updates, recommended subagents, exit criteria, and human decisions.
12. Update artifact metadata and both roadmap inverse tables in the same change whenever phase ownership changes.
13. Run `roadmap-openspec-validator` after planning and resolve all errors.
14. Use `phase-status-audit` after planning when statuses changed or old phase-plan uncertainty was found.
15. Update `docs/CURRENT_PROJECT_AUDIT.md` or `docs/ROADMAP.md` if the plan changes status, gates, or risks.
