---
name: requesting-code-review
description: "Request independent review for significant changes, an owning workflow gate, or an explicit review request. Skip routine micro-edits."
---

# Requesting Code Review

Use independent judgment for significant changes, explicit review requests, and required project gates. Self-review is sufficient for routine low-risk micro-edits unless the owning workflow requires more.

`subagent-driven-development` owns task and cluster review routing when active. This skill supplies the final review template without adding duplicate task reviews.

## Review Package

Record the actual baseline before implementation and the final snapshot. For a branch, determine its correct merge base. Do not assume `HEAD~1` covers a multi-commit change.

Supply the reviewer with:
- Requirements and binding constraints, including exact contract values.
- The immutable `BASE..HEAD` diff/package and relevant file paths.
- Evidence already collected, skipped checks, and known limitations.
- The desired review scope and a report artifact path for substantial findings.

Use [code-reviewer.md](code-reviewer.md) with an available reviewer profile and the bounded dispatch contract. Keep the reviewed snapshot unchanged until the verdict. Reviewers inspect code independently; the implementer's rationale does not determine severity.

## Findings

Resolve in-scope Critical/Important defects supported by code evidence. Keep hardening ideas and unrelated improvements as follow-ups. Consolidate blocking fixes into one wave and re-review the changed snapshot; do not dispatch one fixer per finding. Resolve conflicts with accepted requirements before changing the contract.

Reuse existing check results for unchanged code. New checks need a concrete unanswered concern; do not override an explicit no-test request. A skipped check remains a limitation, not a passing result.
