---
name: subagent-driven-development
description: "Execute accepted implementation clusters with authorized subagents when isolation or independent review benefits substantial work."
---

# Subagent-Driven Development

Execute accepted work using bounded context and risk-appropriate independent judgment. The implementation and review unit is a risk-classified cluster; atomic plan/OpenSpec tasks retain their own acceptance evidence.

Follow `using-superpowers` -> **Subagent Dispatch Contract**. Use local execution for small connected work; delegation is justified by isolation, independent review, or substantial parallel work, not by tool availability.

## Start and Resume

Read the relevant plan and constraints once. Check `.superpowers/sdd/progress.md` and Git history before redispatching completed work. Resolve consequential plan contradictions; continue already authorized independent work. Use an appropriate existing worktree or `using-git-worktrees` when isolation is needed.

## Risk Routing — Single Source of Truth

This skill owns task/cluster roles and review depth; phase coordinators own dependencies and final gates, not a second task-review route.

| Risk | Observable criterion | Route |
|---|---|---|
| Low | Defined reversible mechanical change; no public contract, schema, security, concurrency, or new boundary decision | Direct controller or useful `fast-worker`; focused evidence and self-review |
| Medium | Non-trivial behavior or integration across an existing component boundary | `worker`; focused evidence; one independent `reviewer` for the coherent cluster |
| High | New public contract/schema/migration, authorization/security, concurrency, irreversible effects, or costly-to-reverse boundary decision | Resolve architecture before implementation; use `architect` for an unresolved consequential decision, then `worker` and independent `reviewer` |

Accepted architecture is reused, not automatically reconsidered. A full phase/feature branch gets one final integration review as required by its project/owning workflow; a low-risk maintenance edit does not acquire a broad audit merely by using this skill.

### Scope Admission Gate

A finding from the controller, worker, reviewer, architect, test, tool, or human must be classified before expanding work. Correct in-contract defects within scope; record unrelated improvements as follow-ups. Changed public contracts, security/data boundaries, or acceptance requirements need a recorded decision. During phase work use `phase-change-intake`; outside it resolve the specific scope decision without introducing a phase workflow.

## Model Selection

Use available profiles and their actual model settings. Prefer a capable economical worker for defined implementation; reserve greater reasoning effort for ambiguous decisions and difficult review. Escalate when evidence shows the current route is insufficient. Do not hardcode prices, assume the cheapest model minimizes total cost, or override a profile through unsupported parameters. If profiles are unavailable, report inherited-model fallback.

## Load Details Only When Needed

- Before coordinating a substantial cluster: [references/execution.md](references/execution.md).
- When dispatching artifacts or recovering long-running work: [references/handoffs.md](references/handoffs.md).
- Before an independent review or fix wave: [references/review.md](references/review.md).
- Only for a requested/measured routing study: [references/telemetry.md](references/telemetry.md).

Use [implementer-prompt.md](implementer-prompt.md) or [task-reviewer-prompt.md](task-reviewer-prompt.md) for the selected role. Honor the user's test scope in briefs and reports. Skipped checks do not become passing acceptance evidence. Continue through the approved deliverable without routine permission pauses; report actual limits at completion.
