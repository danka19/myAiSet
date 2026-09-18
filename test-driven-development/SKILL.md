---
name: test-driven-development
description: "Use test-first development for changed executable behavior when tests are appropriate or required by the project. Skip prose, cosmetic edits, and explicit no-test requests."
---

# Test-Driven Development

Use a failing behavioral example to guide changes to executable behavior. Apply the project's testing policy and the user's current scope. Prose, cosmetic changes, generated output, and reversible configuration edits do not automatically need a new test. Explicit no-test instructions take precedence; disclose the resulting limitation.

## Behavioral Cycle

1. Name the observable behavior and meaningful failure or edge case.
2. Reuse an appropriate failing test or write a focused regression test. Run it and confirm failure comes from the missing behavior, not a broken fixture or typo.
3. Implement the smallest in-scope correction.
4. Run the affected test and required related checks. Fix the cause of a failure; do not weaken the expected behavior merely to get green.
5. Refactor only where needed for the requested change, preserving the evidence. Broaden checks when a changed boundary or project gate warrants it.

Tests should distinguish correct from incorrect behavior and remain useful when implementation details change. Use mocks for genuine external boundaries, not to assert that a mocked function behaves as configured. Existing relevant coverage may be sufficient for a mechanical refactor.

If code already exists, preserve valid work and add meaningful evidence where authorized; do not delete working code to recreate a test-first history. Report the actual order accurately. A test written after a fix can still be useful, but is not evidence that it caught the original defect unless demonstrated.

Read [testing-anti-patterns.md](testing-anti-patterns.md) only when designing mocks, test utilities, or diagnosing misleading tests. Completion claims follow `verification-before-completion`.
