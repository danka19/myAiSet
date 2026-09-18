---
name: architecture-planner
description: "Plan new or changed architecture, data contracts, service boundaries, or security decisions. Skip already accepted designs and routine implementation."
---

# Architecture Planner

Use for an unresolved architecture decision or a requested architecture plan. Reuse accepted designs during ordinary implementation; do not repeat architecture review solely because a task touches existing boundaries.

## Workflow

1. Read applicable project rules and only the documents relevant to the architectural decision.
2. Search existing code, tests, and docs for related concepts.
3. Identify raw facts, accepted human decisions, open decisions, constraints, and risks.
4. Propose the smallest architecture that supports the next validated workflow.
5. Separate accepted decisions from options and unresolved questions.
6. Update durable docs when the plan changes architecture, setup, operations, security, roadmap status, or data contracts.

## Output Shape

Include:

- decision summary;
- module/service/data boundaries;
- tradeoffs;
- rejected options;
- verification strategy;
- documentation updates;
- open human decisions.
