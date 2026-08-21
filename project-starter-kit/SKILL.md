---
name: project-starter-kit
description: Bootstrap a new repository in the user's standard Codex working mode, or migrate an existing repository to it. Use when the user asks to start a new project from scratch, create the documentation structure, fill known context, add AGENTS.md rules, adopt a bidirectional roadmap and OpenSpec workflow, or prepare a repository so future Codex sessions can plan and implement disciplined changes.
---

# Project Starter Kit

Use this skill to initialize a new project with a durable operating system for Codex work: documentation, project rules, OpenSpec-first execution, mandatory roadmap ownership for specs/changes, audit files, verification checklist, isolated branch/worktree setup, phase planning, change-intake routing, architecture planning, step execution, and subagent coordination.

## Workflow

1. Confirm the target repository. If the user did not specify one, use the current working directory.
2. Identify the known project facts from the prompt, existing files, README, code, issues, or notes. Do not invent product decisions.
3. Run the bootstrap script:

```bash
python path/to/project-starter-kit/scripts/bootstrap_project.py --target /path/to/project --project-name "Project Name"
```

Use `--dry-run` first if the target already has documentation or `AGENTS.md`. Use `--force` only with explicit user approval because it overwrites starter files.

4. Edit the generated docs with known project facts:
   - `docs/README.md`: product summary, scope, current checkpoint, key decisions.
   - `docs/ROADMAP.md`: phase list, current phase, gates, known blockers.
   - `docs/CURRENT_PROJECT_AUDIT.md`: repository state, environment evidence, open risks.
   - `docs/CONTEXT.md`: domain vocabulary and relationship boundaries.
   - `AGENTS.md`: project-specific read order, language rules, secrets, safety boundaries, isolated worktree/branch requirements, OpenSpec-first branching, commit rhythm, and reporting requirements.
5. If the project will use OpenSpec/SDD, initialize with `openspec init --tools none` (the `openspec-*` workflow skills already exist globally in `~/.codex/skills`; per-tool generation would recreate local duplicates in `.codex/skills/`). Document the expected `openspec/` workflow before behavior implementation starts. Do not invent requirements; record unknowns or create proposals only from user decisions and evidence.
   OpenSpec-enabled projects must keep `docs/ROADMAP.md`: each accepted capability spec gets one primary roadmap phase, each active change gets one execution phase, and the roadmap contains both inverse tables. Use the global `roadmap-openspec-validator` skill.
6. If the user gave human decisions, persist them in the smallest correct durable doc and update `docs/AI_STEP_VERIFICATION_CHECKLIST.md` when the decision changes future verification.
7. Verify the generated structure:

```bash
python path/to/project-starter-kit/scripts/bootstrap_project.py --target /path/to/project --check
```

For OpenSpec-enabled projects, also run `roadmap-openspec-validator` after `openspec init` and after the first spec/change is added. An uncovered draft phase may warn; ownership errors must fail.

8. If the target is a git repository, run `git status --short`, stage only intended files, and create a commit when the project's `AGENTS.md` requires commits.

## Generated Structure

The script creates:

- `AGENTS.md` with required read order, project rules, branching guidance, secret rules, command rules, and final report requirements.
- `docs/README.md`, `docs/00_FILE_STRUCTURE.md`, `docs/ROADMAP.md`, `docs/CURRENT_PROJECT_AUDIT.md`, `docs/AI_STEP_VERIFICATION_CHECKLIST.md`, and `docs/CONTEXT.md`.
- `docs/phases/PHASE_PLAN_TEMPLATE.md` and `docs/phases/PHASE_0_PROJECT_FOUNDATION.md`.
- `docs/planning/`, `docs/audits/`, and `docs/handoffs/` placeholders.
- `CLAUDE.md` as a thin Claude entry point (read `AGENTS.md`, plus an Active Handoff slot).
- `.gitignore` and `.env.example` if absent.

Workflow skills are NOT copied into the project. They live globally in `~/.codex/skills`: `using-git-worktrees`, `architecture-planner`, `phase-change-intake`, `phase-planner`, `phase-step-runner`, `phase-full-runner`, `phase-status-audit`, `roadmap-openspec-validator`, `subagent-driven-development`, `openspec-*`, `handoff-to-claude`, `session-report`, `doc-sync-audit`.

## Skill Behavior

Keep the generated project documentation in English unless the target project explicitly chooses another documentation language. User-facing replies should follow the generated `AGENTS.md` language rule.

Treat generated files as a starting point, not truth. Replace placeholders with evidence from the target repository and user decisions. When evidence is missing, write `Unknown` or an explicit open decision instead of guessing.

Generated work assumes the newer workflow: OpenSpec artifacts hold accepted/proposed behavior and implementation tasks; roadmap phases own and schedule every accepted capability spec and active change through exactly one primary phase plus complete inverse tables; every implementation work item is spec-backed or explicitly docs/setup/ops-only; sequential roadmap work is blocked by pending human acceptance of prerequisite phases/steps, while explicitly independent work may proceed in parallel; uncovered draft phases may remain warnings, but every non-draft phase needs OpenSpec coverage; `phase-*` skills are used for explicit roadmap/phase work or a documented active phase; new phase feedback is routed through `phase-change-intake` when phase work is active; user answers to agent questions are captured as they arrive and the full dialogue is rechecked after final acceptance; closed specs/phases are integrated by PR to `main`; final reports for phase/step/roadmap/OpenSpec work are self-contained executive summaries with decisions, reasoning, tradeoffs, verification, risks, and next steps; advice questions are answered before any implementation unless the user explicitly asks for artifact changes.

Do not create `.codex/skills/` in the project. If a legacy project still has local copies of the generic workflow skills, delete them (the global versions in `~/.codex/skills` take over) and keep only truly project-specific instructions, moved into `AGENTS.md` or `docs/`.

## Migrating An Existing Project

For an existing repository: run the script with `--dry-run` first, keep existing docs that are richer than the templates, add only the missing pieces (`CLAUDE.md`, missing `docs/*` files, `docs/handoffs/`), delete legacy `.codex/skills/` copies of global skills, and align `AGENTS.md` with the current template (global-skills section, self-contained session-report rule, read-order scaling rule) without discarding project-specific rules.

After any `openspec init` or `openspec update` run, check for and delete regenerated `.codex/skills/openspec-*` directories unless the user explicitly wants local copies; prefer running those commands with `--tools none`.

Use subagents only when the current tooling exposes them and the task is bounded enough to review their output. Record subagent roles and token counts in the final report when available.
