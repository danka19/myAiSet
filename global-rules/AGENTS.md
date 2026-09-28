# Persistent User Workflow

## Coding Projects (global conventions)

These apply in every code repository unless the project's `AGENTS.md` overrides them.

- Entry points: `AGENTS.md` is canonical; `CLAUDE.md` is a thin pointer to it and must never hold task text or separate rules.
- Language: project documentation in English; user-facing replies in Russian unless asked otherwise.
- Quality, thoughtful design, safety, and architecture matter more than the fastest implementation.
- Workflow skills are global in `~/.codex/skills` (`phase-planner`, `phase-step-runner`, `phase-full-runner`, `phase-change-intake`, `architecture-planner`, `openspec-*`, `handoff-to-claude`, `session-report`, `doc-sync-audit`, `project-starter-kit`). Never copy them into repositories; project-specific deltas go into the project `AGENTS.md`.
- End-of-session reports follow the `session-report` skill (short mode for bounded tasks, full mode for phase/architecture work).
- Commit intentional changes at the end of every work session; never leave large uncommitted diffs across sessions.
- Secrets live only in local ignored files (`.env.local`, `~/.codex/secrets/`); never in `config.toml`, repositories, or documentation.
- New projects and folders use kebab-case names without spaces or non-ASCII characters.
- New projects are bootstrapped with the `project-starter-kit` skill; existing projects migrate with its migration workflow.
- Run OpenSpec CLI setup as `openspec init --tools none` (same for `openspec update`); if it regenerates `.codex/skills/openspec-*` in a repository, delete them — the global skills cover the workflow.

## Personal Task Management

- Trello board `life` is the source of truth for personal tasks: https://trello.com/b/XePiSZrx
- Google Calendar is for time blocks and execution slots, not the full task list.
- Google Calendar `everyday tasks` is the target calendar for Codex-created recurring routines and protected execution blocks.
- Google Calendar `life` is reserved for Trello sync / Trello-related due-date visibility.
- When creating events in `everyday tasks`, do not add the user/self as an attendee; otherwise Google Calendar also shows an invitation copy in the primary calendar. Verify created/updated Codex events have no attendees unless the user explicitly asks for invitations.
- Calendar IDs:
  - `everyday tasks`: `d1c416ad44b2ed725b9e1ab3953a7f01786f3d12f398ed7575c4d7079f55e944@group.calendar.google.com`
  - `life`: `77b42b032ccfb1240734617ff9cf9471454ca5e46d1a9bb20783a3f1d995bf0f@group.calendar.google.com`
- Obsidian is for context, project notes, rules, and documentation; do not maintain a competing active todo list there when a task is already tracked in Trello.
- Trello `due date` means deadline, decision date, or review date.
- Google Calendar `[TASK] ...` events mean the user has allocated time to do the task.
- Not every Trello card should become a calendar event.
- On Trello board `life`, completed cards are moved automatically to the `Done` list when marked Complete.
- Trello archives all cards in `Done` automatically on the 1st of each month.
- When planning a day/week, inspect both Trello and Google Calendar, then create calendar slots only for tasks that need protected time.
- If a scheduled task is not completed, do not leave it silently in the past: reschedule it, move it to Waiting/Parking, or ask before deleting/archiving.
- Do not delete or bulk archive Trello cards without explicit confirmation.
- Prefer updating/commenting on an existing Trello card over creating a duplicate.

See also in the Obsidian vault: `Ассистент/Trello и календарь - управление задачами.md`.
