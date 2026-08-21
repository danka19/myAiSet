---
name: evidence-audit
description: Use when performing a substantial verification or audit that evaluates multiple criteria or produces findings, risks, acceptance evidence, or product-quality judgments.
---

# Evidence Audit

## Overview

Make substantial audits durable and reproducible. A narrow command run or small bounded check does not need a separate audit artifact.

## Workflow

1. **Set the boundary.** Treat an audit request as authorization to inspect the target, collect evidence, and write the audit artifact. It does not authorize fixes, implementation tasks, issues, roadmap scope, or external work items.
2. **Define criteria first.** State the target, scope, evaluation criteria, severity scale, evidence needed, and known limitations before evaluating results.
3. **Find canonical context.** Search the repository's established audit location, plans, roadmap, current-state documents, and OpenSpec changes. Reference existing canonical material instead of repeating it.
4. **Collect reproducible evidence.** Record commands, inputs, environment or state, observations, and relevant artifact locations. Classify each result as a verified defect, verified limitation, pass, or unverified suspicion. Never present inference as confirmation.
5. **Write one dated audit artifact.** Use the repository's established audit location and naming convention. If none exists, ask where durable audits belong before creating a new convention.
6. **Report and decide remediation.** Summarize the durable record in chat and name its path. Continue into remediation only when the user explicitly authorized remediation work for the current audit findings and its identified scope. Without that authorization, the final user-facing response MUST end with an explicit remediation question, such as whether to create a spec or tasks for the confirmed findings.

## Audit Contract

The dated audit owns the criteria, evidence, results, findings, and residual risks for one verification session. Each finding contains:

- identifier and concise title;
- classification and severity;
- affected behavior and impact;
- reproducible evidence;
- verified root cause, or `not verified`;
- residual uncertainty;
- recommended next action;
- links to related canonical artifacts.

## Documentation Ownership

| Artifact | Owns |
|---|---|
| Dated audit | Observed criteria, evidence, findings, residual risks |
| OpenSpec | Proposed behavior, acceptance scenarios, design, implementation tasks |
| Roadmap | Ordering and phase placement, with links to audit and OpenSpec |
| Current-state docs | Status summary and canonical links |
| Final report | Concise outcome, audit path, remediation decision or question |

## Example

For a multi-criterion accessibility review, define keyboard, focus, semantics, and contrast criteria before testing. Record reproducible evidence and classifications in one dated audit, link existing requirements, then ask whether confirmed findings should become remediation work.

## Common Mistakes

- Ending with only a chat summary: write and name the dated audit.
- Copying findings into roadmap or OpenSpec: keep observations in the audit and link them.
- Turning suspicion into a defect: preserve the unverified classification and uncertainty.
- Creating remediation scope after a read-only audit: ask first unless the user explicitly authorized remediation for the current findings and identified scope.
