# Artifact Handoffs

Use short inline briefs for small factual work and files for substantial requirements, diffs, and logs. Files avoid copying bulk material through the controller; the recipient still needs to read the relevant content.

## Implementation Brief

Use `scripts/task-brief PLAN_FILE N` from the skill directory for supported `Task N` plans, or write a bounded cluster brief. Include:
- One line explaining where the task fits.
- Exact requirements, included task IDs, scope/non-goals, and binding global constraints.
- Interfaces and accepted decisions needed from previous tasks.
- Authorized verification, skipped checks, expected result, and report path.

Send the brief path plus facts missing from it. Do not copy the whole plan or accumulated session summaries into the dispatch. The brief remains the requirements source.

## Reports and Review Packages

The implementer report records changed files/commits, acceptance evidence per task, commands and results actually obtained, skipped checks, concerns, and blockers. The inline response contains status, artifact paths, verification summary, and blockers.

Before review run `scripts/review-package BASE HEAD` from the skill directory and use its returned unique path. `BASE` is the recorded pre-cluster commit, never an assumed `HEAD~1`. Without the helper, redirect the commit list, stat, and contextual diff for the same range into one file. The final branch review uses the correct merge base.

The reviewer receives brief, implementer report, diff package, immutable SHAs, and a separate review-report path. Fix waves append evidence to the implementation report; the reviewer checks the updated snapshot and both specification/quality verdicts.

## Recovery

Use `.superpowers/sdd/progress.md` as the compact recovery map. At completion record task IDs, commit range, evidence, and any required review verdict. On resume compare the ledger with Git history instead of redispatching completed work. Preserve unfinished user changes. Temporary artifact loss is a recovery task, not permission to recreate completed implementation.
