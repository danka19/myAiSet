# Measured Routing Studies

Read only when the user requests routing telemetry or a project explicitly requires it. Ordinary execution uses the compact progress ledger without a measurement ceremony. Do not run this conformance check under a no-tests/no-validation instruction.

Paths below are relative to the parent skill directory. Record real observations, distinguish unavailable usage from zero, and do not equate routing conformance with behavioral quality or billing accuracy.

### Route Manifest

Before a cluster starts, record one closed route manifest entry with: included
task IDs, risk and its observable criterion, permitted routes, selected route
and reason, explicit fork mode, review allowance, and first expected artifact.
The permitted implementation routes are `direct-controller`, `fast-worker`,
`worker`, and `architect`; `explorer` is read-only and `reviewer` is review-only.
If the platform cannot select a named profile, record `platform-fallback`
separately instead of inventing a route. A route not present in this closed
list requires a scope decision before dispatch.

Before briefing work, name every affected boundary: executable, CLI command,
package, persistence, public contract, security, data, and verification
subsystem. Each affected boundary must already be authorized by the accepted
contract or by a recorded intake decision.

### Progress and Routing Evidence

Keep reporting durable but sparse. For every cluster, write one compact entry in the progress ledger at dispatch, at any circuit-breaker event, and at completion — never a status message after every tool call. The entry records:

- included task IDs, selected profile/direct-controller route, and the concrete routing reason;
- dispatch timestamp, first artifact timestamp, completion timestamp, and any observed wait/stall interval;
- analyst/architect decision: used or skipped, with the decision-sufficiency evidence from [execution.md](execution.md);
- focused tests/evidence per atomic task, review verdict when required, and any follow-up or scope decision.

Each dispatch declares its first expected artifact and a proportional checkpoint: normally a factual report within 15 minutes or a first implementation artifact within 30 minutes. If the checkpoint passes without an artifact or meaningful status, use the progress/stall procedure in [execution.md](execution.md). Record observed durations; never invent estimates of model "thinking time".

After a measured run, validate the route manifest against available Codex
rollout telemetry with:

```text
node scripts/validate-run-telemetry.mjs --manifest <routes.json> --rollout <rollout.jsonl> [--out <result.json>]
```

This is a post-run conformance check, not live dispatch interception or a
billing meter. It reports a `telemetry_gap` when the rollout schema or
cumulative token samples are unavailable; never replace missing data with a
zero. Record focused/full test runs and scope-admission decisions separately
because the rollout does not reliably classify them.
