---
name: openspec-apply-change
description: "Implement or continue tasks in an identified OpenSpec change. Skip work without an OpenSpec change or applicable project requirement."
license: MIT
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.4.1"
---

Implement tasks from an OpenSpec change.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

## Required Workflow Integration

OpenSpec implementation is a full project work session. Every active change has one roadmap execution phase even when that phase has no detailed plan. Before editing implementation files:

- Use `using-git-worktrees` to ensure the branch/worktree matches the active change id; if it does not, branch from `main` or the repository's default stable branch.
- Read the project `AGENTS.md` and required docs scaled to the change risk. A detailed phase plan may be absent, but the roadmap execution phase, change metadata, and inverse row remain mandatory.
- When applying an OpenSpec change as part of a new roadmap phase, use the phase handoff acceptance rule from `phase-planner`, `phase-step-runner`, and `phase-full-runner`: starting Phase N means Phase N-1 is human-accepted and must be closed in documentation unless the human explicitly says otherwise.
- Decide whether to use subagents. Use `subagent-driven-development` when the OpenSpec tasks are independent enough for implementer/reviewer loops in this session. For small tightly coupled changes, implement locally but still perform a reviewer-style self-check.
- Use `test-driven-development` for code behavior changes unless project rules explicitly say otherwise.
- Treat every spec/task/design/proposal edit as a documentation change: update related docs, check consistency, and avoid duplicate active rules before finishing.
- Use `roadmap-openspec-validator` before implementation and after any phase ownership, lifecycle, or roadmap-row update. The selected active change must have exactly one execution phase and one matching inverse row.
- End with `session-report`: OpenSpec implementation normally uses full mode when it touches product behavior, data contracts, security, multiple files, or user-visible behavior.
- Create a git commit before the final user-facing report when the repository has intentional changes and project rules require commits.

## Subagent Decision

Use subagents for OpenSpec work when at least one is true:

- `tasks.md` has two or more mostly independent implementation tasks.
- The change touches multiple modules, data contracts, security, or user-visible product behavior.
- A reviewer would materially reduce risk before marking OpenSpec tasks complete.

Do not use subagents when tasks are small, tightly coupled, or the current tooling policy does not permit spawning them. If subagents are not used for a risky change, state why in the final `session-report`.

## Documentation Governance

Changing OpenSpec proposal, design, specs, or tasks requires updating related docs, checking stale state, resolving contradictions, and avoiding duplicate active rules before finishing. If the user answers agent questions during implementation, record each durable answer immediately in the smallest correct artifact, even while other items are still being discussed. After final acceptance or completion, review the full dialogue and ensure all accepted decisions, proposed ideas, rejected options, open questions, terminology, risks, and verification expectations are captured or explicitly reported as uncaptured.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., name another change explicitly).

2. **Check status to understand the schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - `planningHome`, `changeRoot`, and `actionContext`: planning scope and edit constraints
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   This returns:
   - `contextFiles`: artifact ID -> array of concrete file paths (varies by schema - could be proposal/specs/design/tasks or spec/tests/implementation/docs)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using openspec-continue-change
   - If `state: "all_done"`: congratulate, suggest archive
   - Otherwise: proceed to implementation

   **Workspace guard:** If status JSON reports `actionContext.mode: "workspace-planning"` and `allowedEditRoots` is empty, explain that full workspace apply is not supported in this slice. Treat linked repos and folders as read-only context, ask the user to select an affected area through an explicit implementation workflow, and STOP before editing files.

4. **Read context files**

   Read every file path listed under `contextFiles` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI
   - Branch/worktree status from `using-git-worktrees`
   - Subagent decision: local, reviewer-only, or `subagent-driven-development`

6. **Implement tasks (loop until done or blocked)**

   If `subagent-driven-development` applies, treat the OpenSpec tasks artifact as the implementation plan. The change artifacts are the spec constraints, and the task reviewer must check both spec compliance and code quality.

   For each pending task:
   - Show which task is being worked on
   - Make the code changes required
   - Keep changes minimal and focused
   - Add or update tests proportional to risk
   - Run the narrowest meaningful verification for the task
   - Mark task complete in the tasks file: `- [ ]` → `- [x]`
   - Continue to next task

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

7. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - Verification commands run and results
   - Subagents used or reason they were not used
   - If all done: suggest archive, then PR to `main` after archive and final commit
   - If paused: explain why and wait for guidance

8. **Finish the work session**

   Before the final response:
   - If any OpenSpec artifact changed, update related project docs that describe state, roadmap/status, context, architecture, verification habits, or open decisions.
   - Keep `Lifecycle status` in the change proposal and active-change roadmap row synchronized. Completed tasks never imply human acceptance.
   - Check `AGENTS.md`, `docs/`, and `openspec/` for stale state, contradictions, duplicate active rules, and missing cross-references.
   - Run `openspec list`, `openspec list --specs`, and `openspec validate --all --strict` when relevant to the changed artifacts.
   - Run `roadmap-openspec-validator` and resolve all errors.
   - Run `git diff --check` when files changed.
   - Commit intentional changes when project rules require it.
   - If all OpenSpec tasks are complete, make the next action explicit: archive/sync the change and create or prepare a pull request to `main` after the archive commit. If `main` is unavailable, use the default stable branch and report the fallback.
   - Use `session-report` for the final response. Include a self-contained executive summary, change name, schema, task progress, requirements/scenarios affected, decisions and reasoning, verification evidence, docs updated, subagent usage, PR readiness/status, and the next action. Do not replace the explanation with links to changed artifacts.

**Output During Implementation**

```
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

**Output On Completion**

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive this change, then open a PR to `main`.
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- Do not treat missing phase/roadmap docs as permission for free-form work; OpenSpec artifacts are enough to govern implementation.
- Do not mark an OpenSpec task complete without implementation evidence and verification evidence.
- Do not finish after changing specs, tasks, design, or proposal artifacts without checking related docs for stale state, contradictions, and duplicate rules.
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names
- Finish with `session-report`; do not invent a custom free-form report for OpenSpec work.
- When an OpenSpec change is closed, the integration step is a pull request to `main` after archive/sync/docs/verification/commit; do not silently stop at local archive.

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly
