# Cluster Execution

Read when coordinating a substantial delegated cluster. The entrypoint owns risk routing and scope admission.

## Form a Cluster

Group atomic tasks only when they implement one component or bounded end-to-end flow, share accepted architecture, can be completed by one writer, and have separately identifiable acceptance evidence. Split at a new contract/security/schema decision, an acceptance dependency, or an unreviewably large diff. Adjacent task numbers alone are insufficient.

Record task IDs, risk and its observable reason, worker/direct route, binding boundaries, baseline commit, and completion evidence in one compact ledger entry. Use the existing plan/OpenSpec task source; do not create another competing requirements document.

## Decision Sufficiency

Dispatch implementation when the goal, affected inputs/outputs, invariants, acceptance evidence, and consequential decisions are established. Normal focused reading belongs to the worker. Add an explorer only for a specific missing fact that blocks progress and benefits from separate investigation. Use an architect for an unresolved costly-to-reverse decision, not for a second opinion on an accepted design.

## Execute

1. Supply a bounded brief and report location using the handoff reference.
2. Use one writing worker per worktree. Parallelize only independent read-only work or properly isolated deliverables; the controller should do useful non-overlapping work.
3. Complete each task's evidence, then self-review the coherent diff. Commit at the cluster boundary or the project's required cadence.
4. Low clusters use self-review. Medium/High clusters use one immutable review snapshot and the review reference. Do not treat every atomic task as a separate review unit.
5. Update each task status from its own evidence. User-skipped checks stay recorded as unrun; required acceptance gates cannot be silently marked passed.

## Implementer Status

- `DONE`: inspect artifacts and evidence, then follow the risk route.
- `DONE_WITH_CONCERNS`: resolve correctness/scope concerns; keep unrelated observations as follow-ups.
- `NEEDS_CONTEXT`: provide the missing fact or decision without resending history.
- `BLOCKED`: inspect partial results, correct the brief/environment, narrow the task, or escalate capability as appropriate. Do not repeat an unchanged failing dispatch.

## Progress and Stalls

Declare a first expected artifact and a proportional checkpoint. Use bounded waits; a quiet interval alone is not failure. When a checkpoint passes without an artifact or meaningful progress, ask once for concrete status. After a further bounded wait with no progress, interrupt and inspect partial work before continuing locally or replacing the agent. Record the stall once, preserve valid work, and avoid overlapping writers.

Record dispatch/completion and substantive scope changes in `.superpowers/sdd/progress.md`; do not log every tool call. Resume from the ledger and verified Git state after compaction. Process incidents such as an unavailable patch tool do not expand product scope.
