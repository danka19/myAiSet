---
name: handoff-to-claude
description: "Prepare or integrate a bounded Claude Code or Cowork handoff when the user explicitly requests delegation to Claude."
---

# Handoff to Claude

Codex stays the coordinator and implementation owner. Claude gets a bounded task with explicit acceptance criteria, then Codex reviews the diff, runs verification, updates docs, and commits.

## When to hand off

Use a handoff only when the expected quality gain is worth the extra context and time. Good candidates: complex UI work, architecture/design review, isolated well-specified modules. Do not hand off narrow, low-risk changes Codex can finish directly.

## Rules

1. `CLAUDE.md` in the project root is a stable entry point only. It must never contain task text. It says: read `AGENTS.md`, then read the active handoff file if one is listed.
2. Every handoff lives in its own file: `docs/handoffs/HANDOFF_<YYYY-MM-DD>_<topic>.md`.
3. One active handoff at a time per project unless the user explicitly says otherwise.

## Workflow

1. Create `docs/handoffs/HANDOFF_<date>_<topic>.md` with the sections from the template below.
2. Add a single line to `CLAUDE.md` under `## Active Handoff`: the path to the handoff file. Nothing else.
3. The human runs Claude on the task (or Cowork session does it).
4. When Claude reports done, Codex reviews: read the diff, check acceptance criteria, run the narrowest meaningful verification, update docs if behavior changed, and commit.
5. Close out: move the handoff file's status to `Done` with a short result note, and remove the `## Active Handoff` line from `CLAUDE.md`. A stale handoff pointer is worse than no handoff.

## Handoff file template

```markdown
# Handoff: <topic>

Status: Active | Done (<result, one line>)
Owner: Codex; Executor: Claude

## Task
<what to do, in plain language>

## Read before editing
<minimal list of files/docs actually needed — not the full project read order>

## Constraints
<safety rules, data rules, things Claude must not do>

## Expected files
<files likely to change; prefer minimal edits>

## Acceptance criteria
<objective checks; what Claude must report back: changed files, how it verified>
```
