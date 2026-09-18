---
name: receiving-code-review
description: "Evaluate and implement received code-review findings. Skip ordinary feature requests and self-review."
---

# Receiving Code Review

Evaluate feedback against the actual code, requirements, and supported environments before implementing it. A review is evidence to assess, not automatic permission to expand scope.

1. Read the findings and identify their dependencies.
2. Confirm the claimed defect or requirement gap with focused inspection.
3. Classify in-scope blockers, useful follow-ups, and unsupported findings. Explain disagreements using evidence.
4. Apply authorized corrections as a coherent fix wave. Continue independent clear fixes while asking about genuinely blocking ambiguity.
5. Run the checks covering the changed behavior and required gates when authorized. Re-review only the affected snapshot and scope.

Do not remove compatibility behavior without checking why it exists. A plan-mandated defect still needs resolution; do not silently contradict accepted requirements. A request to fix review findings authorizes the identified corrections, not unrelated redesign.

Respond with what changed, the supporting evidence, or the remaining question. Avoid automatic agreement and repeated restatement of the entire review.

Only post replies to GitHub when communication is explicitly authorized. Reply to an inline finding in its original comment thread rather than an unrelated top-level comment.
