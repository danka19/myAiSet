---
name: using-superpowers
description: "Resolve skill selection or workflow coordination when it is unclear which specialized process applies. Skip routine requests with an obvious route."
---

# Using Skills

Choose the smallest workflow that adds task-specific knowledge. Explicitly named skills apply; otherwise match the actual request to a precise trigger. Routine questions and edits do not need a process skill. Read a selected skill once, then only references needed for the current step.

Follow the host's instruction hierarchy. Skills do not override system/developer requirements or the user's explicit scope, permissions, and preferences. A user-approved action need not be approved again. Use the available skill-loading mechanism; filesystem-backed skills may be read with file tools when that is how the host provides them.

Use one owner for each decision: the project owns requirements and required gates; the selected execution workflow owns task routing. Do not stack parallel plans, reviews, or reports. Resolve routine reversible choices locally; ask only when a missing answer materially changes the result or authority is missing.

## Subagent Dispatch Contract

Delegate only when authorized and a bounded subtask benefits from independence, isolation, or parallel execution. Small connected work stays local.

- Ordinary dispatch uses `fork_turns: "none"`. Omitting `fork_turns` is prohibited; `fork_turns: "all"` is prohibited. A bounded history window is appropriate only when necessary context cannot be conveyed accurately in a short brief.
- Supply one task, binding constraints, inputs, acceptance evidence, and relevant artifact paths. Preserve exact contract values; omit accumulated session history.
- Return status, artifact paths, verification summary, and blockers. Keep detailed logs and diffs in artifacts when their size warrants files.
- Use available role/model settings; do not invent capabilities or claim a model override occurred when it did not.

Consult the matching file in `references/` only when a platform's tool mapping is unclear.
