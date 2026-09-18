---
name: finishing-a-development-branch
description: "Integrate completed branch work through the authorized commit, push, PR, merge, or cleanup action."
---

# Finishing a Development Branch

Complete the integration action already authorized by the user or project workflow. Do not present a fixed menu when that choice is known. If no integration action is authorized, preserve the committed branch and report its state; ask a focused question only when the intended next step is unclear.

## Before Integration

Inspect branch, worktree, intentional diff, and the correct base. Preserve unrelated work. Reuse current evidence for the same snapshot; run affected or required gates only when authorized and needed. Disclose failed or skipped checks. A commit or draft PR can preserve unfinished validation; never call it release-ready or bypass a required merge gate.

## Actions

- Commit intentional changes according to project rules; stage explicit paths.
- Push or create/update a PR when authorized. Describe the problem, resulting behavior, validation, and limitations. Preserve the worktree for follow-up work.
- Merge only within explicit authorization and after required gates. Confirm the merged state before considering cleanup; validate affected integration behavior as required.
- Discard work only with explicit authorization identifying the affected branch/worktree and potential loss. Do not infer disposal permission from a completed task.

## Workspace Safety

Use `git worktree list --porcelain` and recorded provenance to identify ownership. A directory named `.worktrees` does not prove the agent created it. Preserve host-managed worktrees and detached HEAD state unless the requested action needs a supported transition.

Before removing an agent-created worktree, confirm a clean state, successful integration or authorized disposal, and the resolved path. Leave that directory before removal. Delete a merged branch with normal Git safety checks; do not force-push or force-delete without explicit scope. On Windows use one shell and literal paths for any filesystem cleanup.

Report the commit/PR and remaining limitations using `session-report` at the task's scale.
