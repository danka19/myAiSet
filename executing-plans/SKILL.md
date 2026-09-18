---
name: executing-plans
description: "Execute an accepted implementation plan in the current session. Use for sequential work that does not benefit from delegation."
---

# Executing Plans

Execute an accepted plan to its authorized completion. Availability of subagent tools is not a reason to delegate.

1. Read the plan and applicable project rules. Check existing progress and Git state before repeating work.
2. Resolve concrete contradictions that block the next task. Continue independent tasks while a question is pending.
3. Implement coherent deliverables in dependency order. Record acceptance evidence against each item; keep the plan current without duplicating it in chat.
4. Run the checks required for the change, unless the user explicitly excluded them. Diagnose relevant failures within scope; an ordinary failure is not automatically a reason to ask permission.
5. Complete required documentation and commits, then the authorized integration action. Use `finishing-a-development-branch` only when branch integration or cleanup needs its guidance.

Use existing suitable isolation. Read `using-git-worktrees` only when isolation is needed. Use `subagent-driven-development` only for authorized, substantial independent execution or required independent review.

Pause dependent work for missing authority, unresolved consequential requirements, or an external blocker that cannot be resolved within scope. Do not stop after arbitrary batches, request permission to continue an approved plan, or repeatedly retry without new evidence. Record skipped checks honestly and do not mark a dependent acceptance gate passed.
