---
name: brainstorming
description: "Clarify an open-ended feature or design when consequential requirements remain undecided. Skip exact corrections and implementation of accepted plans."
---

# Brainstorming

Resolve consequential ambiguity before implementation. Use the existing user request, accepted decisions, and relevant project evidence; do not restart an already completed design discussion.

### Closed Fast Lane

Proceed with an accepted spec or approved implementation plan, or an exact corrective instruction, when no unresolved public contract, security, data, architecture, or UX decision changes the intended result. State routine assumptions briefly and perform the authorized work. A missing formal design document is not itself a reason to stop a bounded change.

## Open Design Work

1. Read the relevant entrypoint and only the code or documentation needed to understand the decision.
2. Identify the desired outcome, constraints, and unresolved choices. Ask concise questions whose answers materially affect the result; batch related questions where useful and continue independent work.
3. Compare alternatives only when there is a real tradeoff. Recommend the smallest design that satisfies the requirements.
4. Obtain a decision for costly-to-reverse choices or missing product requirements. Existing approval remains valid; do not add a second document-approval round for the same decision.
5. Record substantial accepted decisions in the project's canonical spec/design location. For a bounded change, the task and a short rationale may suffice.
6. Use `writing-plans` only when coordination needs a plan. Otherwise continue the requested implementation. Stop after design only if the user requested design alone.

## Boundaries

Do not invent user requirements or treat silence as approval. Design approval is not permission for unrelated publishing, destructive operations, or expanded scope. Preserve project architecture/security gates while avoiding repeated analysis of accepted decisions.

Use [visual-companion.md](visual-companion.md) only when a visual decision would benefit from the browser companion. Do not offer it as a mandatory preliminary step.
