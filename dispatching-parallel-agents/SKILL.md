---
name: dispatching-parallel-agents
description: "Coordinate authorized parallel agents for substantial independent tasks. Skip small tasks, shared-state work, and sequential dependencies."
---

# Dispatching Parallel Agents

Follow `using-superpowers` -> **Subagent Dispatch Contract**. Delegate when the user or applicable workflow authorizes it and substantial independent tasks can make useful progress concurrently. Use one agent for small, tightly coupled work. Parallelism can reduce elapsed time while increasing total token use.

## Partition and Dispatch

- Identify independent questions or deliverables. Investigate related failures together until their independence is established.
- Give each agent one bounded task, relevant evidence, ownership constraints, a completion condition, and a compact result format.
- Supply no conversation history by default. Reuse an existing agent for a related follow-up when its context is still useful.
- Parallel read-only work is appropriate when inputs are independent. Use one writer per worktree; separate writers need isolated workspaces and non-conflicting responsibilities.
- Select an available role/model appropriate to the task. Do not pay for a new agent merely to perform a lookup or a mechanical edit the controller can finish directly.

## Collect and Integrate

Use bounded waits with useful checkpoints; do not busy-poll. If an agent stalls, inspect partial results before narrowing, replacing, or continuing locally. Do not duplicate active work without a reason.

Read returned conclusions and evidence, check integration boundaries, and run only checks justified by the combined change and project requirements. Honor explicit no-test instructions. A full suite is not required merely because multiple agents participated.

For implementation with risk-routed review, `subagent-driven-development` owns that route. This skill does not add another review layer. Report actual delegation and limitations without claiming guaranteed cost or quality improvement.
