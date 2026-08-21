# Roadmap and OpenSpec phase contract

## Canonical phase identifiers

Declare roadmap phases in `docs/ROADMAP.md` with a canonical `P<n>` identifier and exactly one `Status:` value.

```markdown
## Phase 4. Agent Context

Status: in_progress.
```

Allowed lifecycle statuses are `draft`, `planned`, `ready`, `in_progress`, `blocked`, `pending_acceptance`, `accepted`, `closed`, `deferred`, `cancelled`, and `superseded`.

## Capability spec metadata

Every accepted capability spec at `openspec/specs/<spec-id>/spec.md` must contain one `## Roadmap` section with exactly one primary phase.

```markdown
## Roadmap

- Roadmap phase: P4
- Related phases: P1
```

Use `Related phases: none` when empty. Related phases are optional context, must exist, must be unique, and must not repeat the primary phase.

## Active change metadata

Every active change proposal at `openspec/changes/<change-id>/proposal.md` must contain:

```markdown
## Roadmap

- Execution phase: P4
- Related phases: P5
- Lifecycle status: in_progress
```

Archived changes must not remain in the active-change table.

## Mandatory inverse tables

Add both exact level-two headings and headers to `docs/ROADMAP.md`.

```markdown
## Capability Spec Ownership

| Capability spec | Roadmap phase | Related phases |
|---|---|---|
| `example-capability` | P4 | none |

## Active Change Execution

| Active change | Execution phase | Related phases | Lifecycle status |
|---|---|---|---|
| `example-change` | P4 | P5 | in_progress |
```

Every artifact has exactly one row. Every row points to an existing artifact. Row values must equal artifact metadata.

## Phase coverage

Every non-draft phase must own or relate to at least one accepted spec or active change. An uncovered draft phase produces a warning so early roadmap placeholders remain possible.

## Diagnostic policy

- Errors make the command exit nonzero and block completion.
- Warnings keep exit code zero but must be reported.
- A phase-plan status that contradicts the roadmap is an error.
- Fully checked tasks with a non-accepted lifecycle produce a warning; they never imply acceptance.
