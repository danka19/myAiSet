---
name: using-git-worktrees
description: "Create or select isolation for concurrent, risky, or explicitly isolated repository work. Skip in-place maintenance and existing suitable worktrees."
---

# Using Git Worktrees

Use isolation when requested, required by project policy, or useful for concurrent/risky repository changes. Direct maintenance of an installed configuration or skills checkout may be performed in place when that is the authorized target and no conflicting work exists.

## Choose the Workspace

1. Inspect status, current branch, `git worktree list --porcelain`, Git directory/common directory, and submodule context. Reuse an existing suitable isolated workspace. A submodule is not proof of worktree isolation.
2. Follow the user's branch and starting-state choice. Otherwise align a descriptive branch with the active change/phase, starting from the appropriate stable branch. Preserve relevant uncommitted work; do not silently start from a base that omits it.
3. Prefer the host's native worktree mechanism when available. Otherwise use `git worktree add`. Do not create an unrelated user-visible task just to obtain isolation.
4. Honor the configured location; otherwise use the project's established location. A project-local worktree directory must be ignored before creation. Record the created path and branch for later ownership checks.

## Setup

Install dependencies or build only when needed by the requested work. Inspect project instructions rather than automatically running every ecosystem setup command. Obtain a baseline check when it helps distinguish existing failures and testing is authorized; user-excluded tests stay unrun.

If setup fails, diagnose the bounded cause. Continue in place only when that is safe and compatible with the requested workflow; a permissions failure does not itself authorize abandoning isolation. Report limitations without claiming a clean tested baseline.

Use `finishing-a-development-branch` for authorized integration or cleanup. Never reset, discard, or delete unrelated work to make workspace setup convenient.
