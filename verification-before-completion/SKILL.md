---
name: verification-before-completion
description: "Match completion claims to current evidence for changed artifacts. Skip unrelated research and repeated checks of unchanged results."
---

# Verification Before Completion

Make the exact claim supported by the available evidence. Inspection, an executed check, and an untested expectation are different evidence levels.

## Selecting Verification Scope

Use the project's verification matrix and the change's concrete risks. Run the complete selected command, inspect its result and exit status, and relate it to the exact claim. A focused check does not establish release readiness; a small local claim does not require the whole suite.

Reuse evidence for the same artifact snapshot and relevant environment. Re-run affected checks when changes invalidate that evidence. Required release/phase gates still apply; avoid repeating them solely to restate a result.

## Completion

- Check that the requested deliverable exists and the intentional diff matches the scope.
- For a bugfix, establish the relevant failure/reproduction and evidence that it is resolved when testing is authorized.
- Report what was actually checked and any remaining limitation. A subagent's completion message is not proof of the work product; inspect its evidence and changed artifacts.
- When the user explicitly excludes tests or a check cannot run, state that it was not run. Do not substitute another test runner, fabricate success, or silently mark an unverified gate passed.
- A commit or draft PR can preserve work with disclosed limitations when authorized; do not call it tested or release-ready without the required evidence.
