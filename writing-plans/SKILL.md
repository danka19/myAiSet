---
name: writing-plans
description: "Write an implementation plan when requested or when dependencies and risk need durable coordination. Skip small changes and existing adequate plans."
---

# Writing Plans

Produce a plan another competent implementer can execute without reconstructing the requirements. Reuse an adequate existing plan or OpenSpec task list. Plan-only requests end with the plan; requests to plan and implement continue without another execution-choice prompt.

## Scope and Format

Follow the project's canonical location. Otherwise use `docs/superpowers/plans/YYYY-MM-DD-<topic>.md` for substantial repository work; keep a short local change plan inline.

Include:
- Goal and explicit non-goals.
- Binding global constraints with exact values and accepted architecture decisions.
- Dependencies and independently acceptable work items.
- Relevant file paths and interfaces, with signatures only where correctness or coordination depends on them.
- Acceptance evidence per item and required final gates.
- Any unresolved decision that actually blocks execution.

Use `### Task N: <deliverable>` headings and checkboxes for durable implementation tasks; the task-brief helper recognizes this format. Include each task's requirements within its section or name the exact shared constraints it consumes.

Describe the behavior and meaningful edge cases. Do not pre-write the entire implementation, duplicate test code in every step, or split setup and documentation into artificial tasks. Include code examples only when they settle an otherwise ambiguous contract.

## Verification and Execution

Choose checks using the project verification matrix and change risk. Respect an explicit user instruction to skip tests and record that limitation; do not invent passing evidence. Optional checks should be labeled optional.

Review the plan once for missing requirements, inconsistent interfaces, unresolved consequential choices, and scope expansion. Reuse accepted decisions. Use `executing-plans` for connected work; use `subagent-driven-development` when authorized delegation adds value. That workflow owns cluster risk and review routing; the plan should not create a competing per-task review ceremony.
