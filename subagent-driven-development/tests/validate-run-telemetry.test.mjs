import assert from "node:assert/strict";
import test from "node:test";

import {
  parseRolloutText,
  validateTelemetry,
} from "../scripts/validate-run-telemetry.mjs";

function call(taskName, agentType, forkTurns) {
  const args = { task_name: taskName, agent_type: agentType, message: "bounded" };
  if (forkTurns !== undefined) args.fork_turns = forkTurns;
  return JSON.stringify({
    type: "response_item",
    payload: {
      type: "function_call",
      namespace: "collaboration",
      name: "spawn_agent",
      arguments: JSON.stringify(args),
    },
  });
}

function tokens(total) {
  return JSON.stringify({
    type: "event_msg",
    payload: {
      type: "token_count",
      info: { total_token_usage: { total_tokens: total } },
    },
  });
}

function manifest(overrides = {}) {
  return {
    routes: [{ taskName: "task-1", role: "worker", forkTurns: "none" }],
    maxReviewLoops: 2,
    ...overrides,
  };
}

test("explicit none passes", () => {
  const parsed = parseRolloutText([tokens(100), call("task-1", "worker", "none"), tokens(140)].join("\n"));
  const result = validateTelemetry(parsed, manifest());
  assert.equal(result.ok, true);
  assert.equal(result.metrics.agentsCreated, 1);
});

test("omitted fork mode fails", () => {
  const result = validateTelemetry(parseRolloutText(call("task-1", "worker")), manifest());
  assert.match(result.violations.join("\n"), /fork_turns is omitted/);
});

test("all fork mode fails", () => {
  const result = validateTelemetry(parseRolloutText(call("task-1", "worker", "all")), manifest());
  assert.match(result.violations.join("\n"), /fork_turns.*all/);
});

test("justified positive fork mode passes", () => {
  const approved = manifest({
    routes: [{
      taskName: "task-1",
      role: "worker",
      forkTurns: "3",
      forkException: { turns: [2, 3, 4], reason: "Three binding decisions" },
    }],
  });
  const rollout = [tokens(10), call("task-1", "worker", "3"), tokens(20)].join("\n");
  const result = validateTelemetry(parseRolloutText(rollout), approved);
  assert.equal(result.ok, true);
});

test("unplanned route fails", () => {
  const result = validateTelemetry(parseRolloutText(call("task-2", "architect", "none")), manifest());
  assert.match(result.violations.join("\n"), /unplanned route/);
});

test("third review loop fails", () => {
  const reviewManifest = manifest({
    routes: [{ taskName: "review-1", role: "reviewer", forkTurns: "none" }],
  });
  const rollout = [1, 2, 3].map(() => call("review-1", "reviewer", "none")).join("\n");
  const result = validateTelemetry(parseRolloutText(rollout), reviewManifest);
  assert.match(result.violations.join("\n"), /review loops.*3.*maximum.*2/i);
});

test("cumulative token replay uses final minus initial baseline", () => {
  const parsed = parseRolloutText([tokens(100), tokens(140), tokens(175)].join("\n"));
  const result = validateTelemetry(parsed, manifest({ routes: [] }));
  assert.equal(result.metrics.tokens.initial, 100);
  assert.equal(result.metrics.tokens.final, 175);
  assert.equal(result.metrics.tokens.delta, 75);
});

test("unknown rollout schema reports telemetry_gap", () => {
  const parsed = parseRolloutText(JSON.stringify({ unfamiliar: true }));
  const result = validateTelemetry(parsed, manifest({ routes: [] }));
  assert.equal(result.ok, false);
  assert.match(result.telemetryGaps.join("\n"), /unrecognized rollout schema/i);
});
