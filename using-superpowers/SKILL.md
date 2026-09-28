---
name: using-superpowers
description: "Resolve skill selection or workflow coordination when it is unclear which specialized process applies. Skip routine requests with an obvious route."
---

# Using Skills

Choose the smallest workflow that adds task-specific knowledge. Explicitly named skills apply; otherwise match the actual request to a precise trigger. Routine questions and edits do not need a process skill. Read a selected skill once, then only references needed for the current step.

Follow the host's instruction hierarchy. Skills do not override system/developer requirements or the user's explicit scope, permissions, and preferences. A user-approved action need not be approved again. Use the available skill-loading mechanism; filesystem-backed skills may be read with file tools when that is how the host provides them.

Use one owner for each decision: the project owns requirements and required gates; the selected execution workflow owns task routing. Do not stack parallel plans, reviews, or reports. Resolve routine reversible choices locally; ask only when a missing answer materially changes the result or authority is missing.

## Subagent Dispatch Contract

Consider the current session, a subagent, and a separate child session based on the work even when the user has not named an execution mode. Recommend a useful mode and obtain user agreement before launching a subagent or child session; reuse applicable prior agreement without asking again. Follow host authorization requirements. Delegate a bounded subtask when it benefits from independence, isolation, or parallel execution. Small connected work stays local. Use session-report for next-step recommendations without duplicating its model-routing table.

- Ordinary dispatch uses `fork_turns: "none"`. Omitting `fork_turns` is prohibited; `fork_turns: "all"` is prohibited. A bounded history window is appropriate only when necessary context cannot be conveyed accurately in a short brief.
- Supply one task, binding constraints, inputs, acceptance evidence, and relevant artifact paths. Preserve exact contract values; omit accumulated session history.
- Return status, artifact paths, verification summary, and blockers. Keep detailed logs and diffs in artifacts when their size warrants files.
- Use available role/model settings; do not invent capabilities or claim a model override occurred when it did not.

Consult the matching file in `references/` only when a platform's tool mapping is unclear.

## Child Session Coordination

Use a separate child session when work needs its own durable history, independent continuation, separate user discussion, or a different supported environment. Complexity or choosing another model alone is insufficient. Create and message sessions only within user agreement and the host's tool requirements; agreement to coordinate must cover follow-up messages needed for the task. Delegation preserves the original scope and permissions.

- Before dispatch, record the goal, binding decisions, permitted actions, relevant inputs, acceptance checks, stop conditions, artifact location, and report format. Use the minimum sufficient number of executors and parallelize independent work. Assign one owner to shared state documents; isolate concurrent writers.
- The parent owns collection, verification, and integration. Record each child session's actual identifier, task, workspace/branch where applicable, and result paths. Use available status, read, and bounded-wait tools; a completion notification is an additional signal, not the sole source of the result. Avoid busy polling and stop waiting once the needed result is collected.
- Distinguish executor finished, result obtained, result verified, and result incorporated into the parent outcome. User acceptance is a separate state when required. A child's completion claim does not establish acceptance.
- Read existing artifacts and partial results before restarting work after a missing report or interruption. Request only missing information or checks; repeat completed work only for a concrete reason such as changed inputs, an error, or missing necessary evidence.
- Maintain a compact recovery record at meaningful checkpoints: active session identifiers, assignments, completed/remaining work, artifact paths, checks, blockers, and the next collection step. Before a planned interruption, update it when possible. On resume verify actual session and artifact state before continuing. Preserve the project's existing progress record instead of creating a competing source of truth.
- Stop after agreed checks and integration. Preserve achieved results and explain blockers or scope limits. Promise continuation after application closure only when an available execution mechanism has been confirmed; a recovery record alone does not continue execution.
- The child returns a compact status, conclusions, artifacts, verification evidence, limitations, and next action if needed. The parent provides a self-contained user-facing result; links supplement the conclusions.
