---
name: phase-change-intake
description: Triage new ideas, fixes, scope changes, architecture notes, data contract changes, or verification requests that appear while a roadmap phase is already in progress. Use before switching plans, changing phase scope, creating an OpenSpec change, or deferring user feedback during phase work.
---

# Phase Change Intake

Use this skill when a finding from the controller, worker, reviewer, architect,
test, tool, or human appears during an active phase and could alter scope,
priorities, architecture, documentation, data contracts, or verification.
The source does not grant authority: every such finding remains a proposal
until this intake admits, defers, rejects, or routes it.

Phase intake preserves the relationship between planning and specs: phases decide whether and when a change enters the roadmap; OpenSpec records product behavior, acceptance criteria, data contracts, and implementation tasks.

## Workflow

1. Restate the new idea in one sentence and record its source.
2. Classify it as one or more types: `bug_fix`, `scope_refinement`, `new_feature`, `architecture_change`, `data_contract_change`, `verification_change`, `documentation_change`, or `out_of_scope`.
3. Check impact against the current phase goal, active work item, `openspec/specs/` accepted requirements, active `openspec/changes/<change-id>/` deltas, architecture boundaries, data contracts, verification evidence, privacy, safety, and deployment rules.
4. Choose exactly one routing decision: `adopt_now`, `queue_current_phase`, `create_openspec_change`, `defer`, or `reject`.
5. Interrupt active work only when the idea affects data loss risk, security/privacy, remote deployment, accepted requirements, data contracts, architecture correctness, or the human explicitly says to stop/switch.
6. Persist the decision in the smallest durable place: OpenSpec specs/changes, the relevant phase plan `Change Intake` section, `docs/CURRENT_PROJECT_AUDIT.md`, `docs/CONTEXT.md`, or `docs/AI_STEP_VERIFICATION_CHECKLIST.md`.
7. If the idea changes product behavior, acceptance criteria, implementation tasks, or data contracts, update or create the relevant OpenSpec artifact before treating the phase plan as current.
8. Assign exactly one primary roadmap phase when creating or re-scoping a capability spec/change, update the matching inverse table row, and run `roadmap-openspec-validator`. Related phases may express cross-phase impact but never replace the primary owner.
9. If the human answers several intake questions, record each answer as soon as it becomes durable instead of waiting for the whole intake conversation to finish.
10. After the human gives final acceptance for the intake decision, review the full dialogue and confirm every accepted decision, proposed idea, rejected option, open question, risk, and verification expectation has a durable home.
11. Continue the previous work item unless the routing decision requires interruption.

## Intake Record Shape

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

## Decision Guidance

- Prefer `queue_current_phase` over interrupting when the idea is relevant but not blocking.
- Prefer `create_openspec_change` when implementation would need new acceptance criteria or data contract changes.
- Prefer `defer` when the idea is valuable but outside the active phase goal.
- Use `adopt_now` only when ignoring the idea would make the current work item wrong or unsafe.
- Never silently discard feedback. Record rejected or deferred items with the reason.
- Do not let a phase plan become the only durable source for product behavior; keep behavior and acceptance in OpenSpec and reference it from the phase plan.
- Do not let the last discussed intake item erase earlier answers; preserve all answered points.
- A deferred idea may remain an intake record without a spec. Once it becomes an accepted capability spec or active OpenSpec change, roadmap ownership is mandatory.
