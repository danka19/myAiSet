---
name: session-report
description: "Report completed work or session status in the user standard format, with a short plan and a model and reasoning recommendation for each next step. Scale detail to the task; skip factual conversation without performed work."
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

## Short Plan and Model Recommendation for the Next Step

In both short and full reports, accompany each proposed next step with a short concrete plan: 2–4 actions in execution order, including how the result will be checked. Keep it proportional to the step; a single concise sentence is enough for a small task. If there are several next steps, give each its own plan. Do not invent a next step or expand its scope merely to supply a plan.

In both short and full reports, place a recommended model, reasoning effort, and one short task-specific reason directly beside each next step that an AI agent can perform. If there are several next steps, recommend separately for each. For a purely human action or physical check, say that no model is needed; recommend one only for any distinct AI analysis afterward. Do not invent a next step just to include a recommendation.

In both short and full reports, recommend an execution mode for each useful AI-executable next step: current session, subagent, or separate child session. Give one brief task-specific reason. Consider all three even when the user has not explicitly requested delegation. Use the current session for small connected work, a subagent for a bounded independent subtask, and a child session for work requiring its own durable history or separate continuation. A model change alone does not justify a child session.

A recommendation does not launch an executor. Obtain user agreement before starting a recommended subagent or child session unless applicable agreement already exists; do not ask again for an authorized action. A reply accepting the stated execution mode counts as agreement. Follow the host's actual creation and messaging requirements. Keep already authorized current-session work moving while agreement on optional delegation is pending. Do not create next steps solely to offer execution modes. Coordination and child-session lifecycle are owned by `using-superpowers` -> Subagent Dispatch Contract and Child Session Coordination.
Use this compact Russian format (translate when another report language is requested):

> **Следующий шаг:** реализовать согласованную функцию и проверить результат.
> **Короткий план:** сверить входные условия → внести изменение → выполнить фокусную проверку и зафиксировать результат.
> **Рекомендуемая модель:** GPT-6 Sol · Medium — понятная реализация с проверкой логики.
> **Способ выполнения:** текущая сессия — работа связана с уже загруженным контекстом. Для субагента или дочерней сессии указать причину и запросить согласие, если оно ещё не дано.

Select the lightest model and effort that can reliably handle the specific task. Respect explicit user model choices and actual availability. This is a recommendation for the next step, not an instruction to switch the current model or spawn agents.

The user's accepted routing baseline (2026-09-24):

| Next-step workload | Starting recommendation |
| --- | --- |
| Small edits, extraction, structured summaries, clear repeatable work | GPT-6 Luna · Low–High, scaled to task difficulty |
| Implement an agreed feature, investigate an ordinary bug, everyday analysis | GPT-6 Sol · Medium |
| Serious review, complex logic, careful verification | GPT-6 Sol · High / Xhigh |
| Architecture, systemic failure analysis, ambiguous work across subsystems | GPT-6 Astra · Low (Light) / Medium |
| Exceptionally difficult work with many constraints | GPT-6 Astra · Xhigh / Max |
| Large task with meaningful independent workstreams | Ultra on a supported model, only with a concrete parallelism benefit |

Choose one specific starting effort in the report rather than copying a range. Max prioritizes deeper reasoning on a task; Ultra uses subagents for independent work and is not merely a higher single-agent effort. GPT-6 Luna supports up to Max, not Ultra. Most steps do not need Max or Ultra.

For an established GPT-5.6 workflow or when GPT-6 is unavailable, retain the appropriate available tier: Sol for complex work, Terra for balanced work, Luna for focused repeatable work. Do not treat the same tier name or effort across generations as equivalent. Recommend Max or Ultra only when their extra work is justified; do not invent fixed token budgets, time estimates, or guaranteed savings.

This table is a dated baseline, not a permanent model catalog. If availability or model guidance has changed, use current session metadata and, when necessary, `openai-docs` with [OpenAI model selection](https://developers.openai.com/api/docs/guides/model-selection) and [Codex models](https://learn.chatgpt.com/docs/models) to update the recommendation. Routine reports do not need a fresh model survey when the existing guidance is sufficient.
