# Implementer Brief

Choose the available profile under `SKILL.md` Risk Routing / Model Selection. Use the bounded dispatch contract; an inherited model is a fallback, not a claimed override.

Provide the worker with:
- Task/cluster name and one-line project context.
- Brief path containing exact requirements and acceptance evidence.
- Needed interfaces/accepted decisions not already in the brief.
- Worktree, baseline commit, owned files/boundaries, and report path.
- Authorized checks, explicit exclusions, and required commit policy.

## Worker Instructions

Read the brief and relevant project rules. Implement the requested behavior with focused reading and no unrelated refactoring. Make routine reversible choices within scope. Ask about consequential ambiguity or missing authority; keep independent work moving.

Use test-first development when appropriate and authorized. Run checks selected for the change and project gates; do not run a full suite merely because a commit is next. Honor explicit no-test instructions and report unverified behavior accurately.

Self-review the diff against requirements and meaningful risks. Preserve unrelated changes. Commit intentional work when required and record the exact commit range. If blocked, report the concrete missing input or capability and preserve useful partial results.

Write the report with status (`DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`), acceptance evidence per task, files/commits, actual checks, skipped checks, concerns, and remaining work. Return only status, artifact paths, verification summary, and blockers inline.
