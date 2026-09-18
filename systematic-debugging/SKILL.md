---
name: systematic-debugging
description: "Investigate an unexplained bug, failing test, build failure, or runtime regression. Skip known mechanical corrections with an established cause."
---

# Systematic Debugging

Investigate the cause before selecting a fix. Scale investigation to the uncertainty: an error message with a verified direct cause does not need an elaborate diagnostic process.

1. Capture the failure, expected behavior, relevant error and environment. Reproduce when authorized; distinguish observed facts from hypotheses when reproduction is unavailable.
2. Inspect the relevant recent changes and trace the failing data/control path. Read neighboring contracts or a working example when they explain the discrepancy.
3. State the best-supported hypothesis and choose the smallest discriminating check. Add instrumentation only where an information gap warrants it. Do not print secrets or full environment dumps.
4. Apply the narrow in-scope fix. Preserve a meaningful regression test or reproduction where appropriate, then run affected checks and required gates.
5. If the hypothesis fails, use that evidence to revise it. Do not stack speculative fixes or repeat the same attempt unchanged.

After repeated failed hypotheses, reassess assumptions, environment, and boundaries. Multiple failures do not by themselves prove an architectural defect. Escalate to an architecture decision only when evidence shows a costly-to-reverse change is needed. Continue independent useful work while awaiting a necessary decision.

If the user excludes testing, use permitted inspection, label the cause/fix confidence accurately, and state that runtime behavior remains unverified. Do not claim an environment failure was fixed by an unrelated code change.

Read only the relevant supporting technique:
- [root-cause-tracing.md](root-cause-tracing.md): locate the origin of a bad value.
- [condition-based-waiting.md](condition-based-waiting.md): investigate asynchronous timing.
- [defense-in-depth.md](defense-in-depth.md): evaluate additional boundary validation after identifying the cause.
