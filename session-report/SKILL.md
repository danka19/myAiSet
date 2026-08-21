---
name: session-report
description: Produce the end-of-session user report in the user's standard format, scaled to task size. Use at the end of any work session, when the user asks for a work report, or when a project AGENTS.md requires a final report.
---

# Session Report

User-facing reports are written in Russian unless the user asks otherwise. Reports must be self-contained: the human should understand the result, main decisions, reasoning, and current project state without opening changed files. Links to files are supporting evidence, not a substitute for explanation.

## Pick the mode first

**Short mode** — for bounded tasks: small fixes, doc edits, single-file changes, question-driven investigations, anything under ~30 minutes of agent work.

**Full mode** — for phase work items, multi-file features, architecture changes, anything touching data contracts, security, or product behavior.

When unsure, use short mode and offer details on request.

OpenSpec implementation defaults to full mode when it touches product behavior, data contracts, security, multiple files, or user-visible behavior. Use short mode only for small spec/docs edits or narrow investigations.

## Short mode (4 points)

1. Task, in plain language.
2. What was done and what changed (files/modules, key counts or results).
3. How it was verified (or explicitly: not verified, and what a manual check would be).
4. Open questions / next human decision, if any.

## Full mode

Everything in short mode, plus:

5. Decisions and judgment calls made, with reasoning.
6. What changed for the end user.
7. Which changes require manual verification and the exact steps.
8. Documentation updated (which files) or why no update was needed.
9. Skills and subagents used (role names, token counts when available).

For phase, step, roadmap, architecture, or OpenSpec work, include an executive summary written in plain language:

- What was completed and what project state changed.
- Main decisions made and why those choices fit the specs, phase goal, architecture, or safety constraints.
- Important tradeoffs, rejected options, or assumptions when they shaped the result.
- The practical takeaway: what the human can now rely on, what remains uncertain, and what should happen next.

For OpenSpec implementation, include:

- Change name and schema.
- Task progress before and after the session.
- Requirements/scenarios or change artifacts touched.
- Verification evidence, including OpenSpec validation when relevant.
- Subagent decision: used roles, or why subagents were not used.
- Whether the change is ready to archive, paused, or still has remaining tasks.
- For closed OpenSpec changes or phases: PR target (`main` unless default stable branch fallback), PR URL/status, or blocker preventing PR creation.

## Rules

- When the session performed a substantial audit, **REQUIRED SUB-SKILL:** use `evidence-audit`; name the durable dated audit file in the final report and include the remediation decision or question.
- Never pad a short task into a full report. The report protocol must not cost more than the task.
- For phase, step, roadmap, architecture, or OpenSpec work, do not send the human to read files instead of explaining the outcome. Mention changed files only after summarizing their substance.
- If the user answered agent questions during the session, report where each durable answer was captured. Before final acceptance/completion reports, re-check the full dialogue so earlier accepted decisions and proposed ideas are not lost behind the last discussed point.
- For roadmap, phase, or step work, include whether `phase-status-audit` was run, which statuses were fixed, and whether any old phase plan still has unfinished, unmarked, invalid, or pending-acceptance items.
- Do not use free-form completion summaries for OpenSpec implementation; use the fields above.
- For closed specs/phases, do not omit PR status. Closing means archive/gate/docs/verification/commit plus PR creation or a clearly reported PR blocker.
- Numbers and file names beat adjectives. "Rewrote 3 of 14 validators, 2 tests added" beats "improved validation".
- End with the single most useful next action for the human, when one exists.
