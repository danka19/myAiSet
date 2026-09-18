# Review and Fix Waves

## Freeze the Snapshot

Before dispatch, inspect acceptance coverage, available evidence, disclosed skipped checks, task commits, and clean worktree state. Record `BASE` and `HEAD` and generate the package for that range. If unrelated changes prevent a clean checkout, use an isolated snapshot rather than discarding them.

Freeze the reviewed task checkout until the verdict. Do not change code, tests, task docs, index, HEAD, or the review package. The reviewer is read-only on this checkout; its report belongs in a separate untracked/ignored artifact location. Verify the same snapshot when accepting the verdict. A changed snapshot requires a new review of the relevant changes, not acceptance of an old approval.

## Independent Judgment

Supply requirements and evidence without pre-grading the findings. The reviewer checks both specification compliance and implementation quality. Read beyond the diff when a concrete contract or regression risk requires it; no arbitrary one-file limit should prevent evaluating that risk. Avoid a full repository audit without cause.

Reuse adequate evidence for unchanged code; additional checks need a concrete unanswered concern and must respect user exclusions. Do not assume tests passed merely because an implementer reported DONE. Distinguish reported execution evidence from independently established code facts.

## Scope Firewall

- Blocking: a Critical/Important defect with a named violated requirement/invariant and code evidence, or a concrete regression/security/data-integrity risk introduced by the change.
- Follow-up: broader hardening, optional coverage, unrelated refactoring, or an improvement outside the accepted contract. Record it without silently expanding the task.
- Scope change required: a genuine correction changes the accepted contract or threat model. Obtain the specific decision before implementation; use phase intake only for active phase work.

Plan-mandated defects remain findings. Resolve the conflict rather than suppressing it or silently changing an accepted requirement. A requirement not verifiable from the diff is an evidence gap for the controller to resolve before declaring that requirement complete.

## Bounded Fixing

Use one consolidated blocking-fix wave and one re-review. The fixer receives all blocking findings and the affected checks; do not create one agent per finding or rerun the full suite after each edit. Further iteration needs new concrete evidence, such as a regression introduced by the fix. Stop an unproductive loop to revise the hypothesis or resolve a scope decision.

Run one final integration review for a full phase/feature branch when its workflow requires it. It consumes prior evidence and accumulated follow-ups while focusing on cross-cluster interactions. Do not duplicate every cluster review or add a broad review to a routine maintenance edit.
