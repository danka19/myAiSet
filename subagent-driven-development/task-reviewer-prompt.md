# Task / Cluster Reviewer Brief

Provide the reviewer profile selected by `SKILL.md`, brief and report paths, exact binding constraints, `BASE_SHA`, `HEAD_SHA`, diff-package path, and a separate review-report path.

## Reviewer Instructions

Review specification compliance and code quality for every included task. Confirm HEAD and worktree match the immutable snapshot. If they differ, report the review invalidated and request a stable snapshot. Do not mutate the checkout, index, or branch; write findings only to the designated external/ignored report artifact.

Read the brief, implementation report, and diff. Verify implementation claims against code. Inspect related unchanged code when a concrete concern requires it, recording the concern and evidence. Do not substitute a broad audit for the requested review.

Reuse existing execution evidence for the same snapshot. Run an additional focused check only for a specific unanswered concern and when permitted; respect no-test instructions. Record missing evidence instead of assuming tests passed. Warnings are defects only when their meaning establishes a relevant issue.

For each finding state file/line, violated requirement or invariant, impact, and smallest safe correction. Classify it as Blocking Critical/Important, Follow-up, or Scope change required under `references/review.md`. Report plan-mandated defects rather than pre-grading them away. Mark requirements that cannot be established from available evidence as unresolved.

## Report

- Snapshot reviewed.
- Spec compliance for included tasks: compliant, issues, or unresolved evidence.
- Code quality: approved, needs blocking fixes, or scope change required.
- Findings with evidence and classification; omit empty categories.
- Checks actually performed and relevant limitations.

Return status, report path, verification summary, and blockers inline. Re-review a fix wave against the new snapshot and both verdicts.
