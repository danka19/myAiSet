---
name: writing-skills
description: "Create or revise reusable skill instructions, triggers, and supporting references. Skip ordinary prompts and project documentation."
---

# Writing Skills

Create concise, reusable instructions that add domain knowledge or a reliable specialized workflow. Use the available `skill-creator` guidance for Codex skill structure; do not load other authoring guides unless the target runtime requires them.

## Editing Workflow

1. Identify the intended trigger, result, and current failure or unnecessary cost. Inspect existing instructions and their callers before removing a contract or resource.
2. Keep the skill name stable. Write a short description with the actual use case; include exclusions only to prevent likely misrouting. Preserve relevant frontmatter and invocation policy.
3. Keep purpose, essential constraints, and routing in `SKILL.md`. Put substantial conditional procedures, schemas, or examples in references and say when to read them. Short skills need no routing layer.
4. Preserve user intent, permission boundaries, exact domain invariants, and required project gates. Replace generic warnings, repeated rules, mandatory narration, and broad activation slogans with observable conditions.
5. Prefer one authoritative instruction per concern. A reference to another skill is conditional unless that workflow actually needs it. Scripts are appropriate for deterministic repeated work, not for every instruction.
6. Inspect the resulting text, metadata, relative links, and diff. Commit intentional changes according to repository rules; push when the established workflow authorizes it.

## Behavioral Evaluation

For a consequential behavior change, realistic before/after scenarios can establish quality and cost. Use them when requested or warranted and authorized; avoid tests that merely match headings or wording. A narrow editorial change does not automatically require subagents or a full benchmark.

If the user says not to run tests, honor that request without asking again. Do not run validators, pressure scenarios, or evaluation agents as substitutes. Report the change as text-reviewed and behaviorally untested. This is a task-specific choice, not a permanent removal of quality checks.

For specific test-design pitfalls, consult [testing-skills-with-subagents.md](testing-skills-with-subagents.md). For another runtime's authoring requirements, consult its documentation only when relevant. Examples and evaluation material are optional references, not additional standing policy.
