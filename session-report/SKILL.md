---
name: session-report
description: "Report completed work or session status in the user standard format. Scale detail to the task; skip factual conversation without performed work."
---

# Session Report

Write user-facing reports in Russian unless requested otherwise. Lead with the outcome and scale detail to the work. The user should understand the result without opening supporting files.

## Short Mode

For bounded work, cover the result, material changes, actual verification or skipped checks, and any unresolved decision in a few sentences or bullets. Include the commit/PR or deliverable link when useful. No headings or empty report fields are required.

## Full Mode

For phase, architecture, or substantial OpenSpec work, also cover:
- Completed scope and remaining work.
- Decisions, reasoning, material tradeoffs, and user-visible effects.
- Required checks and their actual results; remaining manual checks with actionable steps.
- Documentation updates, or why none were needed.
- Skills/delegation used and usage figures only when measured.
- Dependency and human-acceptance status; no implied acceptance from a request to continue.

For OpenSpec include change/schema, task progress, affected requirements/scenarios, validation evidence, and archive readiness. For roadmap phases include the phase-status-audit result and unfinished or pending child work. For closed work include the PR URL/status to `main` or the documented stable-branch fallback, or the concrete PR blocker.

Reference the dated evidence record when a substantial audit was performed; do not start a new audit just to produce the report. Reconcile user corrections and accepted scope before declaring completion. Separate demonstrated outcomes from expectations; user-excluded tests are reported as not run.

End with the useful next action only when one exists. Do not create an approval request, full report ceremony, or repeated summary for an otherwise finished task.
