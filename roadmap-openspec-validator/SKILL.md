---
name: roadmap-openspec-validator
description: Use when creating, changing, auditing, planning, applying, syncing, archiving, or validating roadmap phases, accepted capability specs, active OpenSpec changes, phase ownership metadata, or roadmap inverse tables.
---

# Roadmap OpenSpec Validator

Keep roadmap phases and OpenSpec artifacts bidirectionally consistent. Treat the validator as a read-only gate; never let it rewrite project documents.

## Required workflow

1. Read `references/contract.md` before adding or changing phase metadata or inverse tables.
2. Identify the actual repository root containing `docs/ROADMAP.md` and `openspec/`.
3. Before an intended governance migration or repair, run the validator and preserve the failing diagnostics as RED evidence.
4. Edit the OpenSpec artifact metadata and both roadmap inverse tables together. Every accepted capability spec and every active change must have exactly one primary phase and exactly one inverse row.
5. Run:

   ```powershell
   node "$env:USERPROFILE\.codex\skills\roadmap-openspec-validator\scripts\validate-roadmap-openspec.mjs" --root "<repository-root>"
   ```

6. For machine-readable evidence, add `--json`. A nonzero exit code means the gate failed.
7. Resolve every error before completion. Report warnings explicitly; an uncovered draft phase is allowed, while an uncovered non-draft phase is an error.
8. Run the repository's native OpenSpec validation separately. This validator checks governance linkage, not OpenSpec schema correctness.

## Lifecycle boundary

Do not infer human acceptance from completed tasks, passing tests, an archived folder, or a closed phase. Keep lifecycle status explicit in the active-change metadata and roadmap row. Archive or sync only through the applicable OpenSpec workflow after the required human decision.

## Scope

Use only project-configured documentation paths. The script is deterministic, uses only Node.js standard-library modules, and performs no writes.
