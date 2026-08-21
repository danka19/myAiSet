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

function followup(target) {
  return JSON.stringify({
    type: "response_item",
    payload: {
      type: "function_call",
      namespace: "collaboration",
      name: "followup_task",
      arguments: JSON.stringify({ target, message: "bounded follow-up" }),
    },
  });
}

function activity(callId, agentThreadId, agentPath) {
  return JSON.stringify({
    type: "event_msg",
    payload: {
      type: "sub_agent_activity",
      kind: "started",
      event_id: callId,
      agent_thread_id: agentThreadId,
      agent_path: agentPath,
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

test("reviewer followups are attributed and bounded", () => {
  const reviewManifest = manifest({
    routes: [{
      taskName: "review-1",
      role: "reviewer",
      forkTurns: "none",
      maxFollowups: 1,
    }],
  });
  const rollout = [
    tokens(10),
    call("review-1", "reviewer", "none"),
    followup("/root/review-1"),
    followup("/root/review-1"),
    tokens(20),
  ].join("\n");
  const result = validateTelemetry(parseRolloutText(rollout), reviewManifest);
  assert.match(result.violations.join("\n"), /followups 2 exceed allowance 1/i);
  assert.match(result.violations.join("\n"), /review loops 3 exceed maximum 2/i);
});

test("unplanned followup target fails", () => {
  const rollout = [tokens(10), followup("/root/not-planned"), tokens(20)].join("\n");
  const result = validateTelemetry(parseRolloutText(rollout), manifest());
  assert.match(result.violations.join("\n"), /unplanned followup target/i);
});

test("agent-id followup resolves through sub-agent activity", () => {
  const spawn = JSON.parse(call("review-1", "reviewer", "none"));
  spawn.payload.call_id = "call-review-1";
  const reviewManifest = manifest({
    routes: [{
      taskName: "review-1",
      role: "reviewer",
      forkTurns: "none",
      maxFollowups: 1,
    }],
  });
  const rollout = [
    tokens(10),
    JSON.stringify(spawn),
    activity("call-review-1", "agent-123", "/root/review-1"),
    followup("agent-123"),
    tokens(20),
  ].join("\n");
  const result = validateTelemetry(parseRolloutText(rollout), reviewManifest);
  assert.equal(result.ok, true);
  assert.equal(result.metrics.followupsByTask["review-1"], 1);
  assert.equal(result.metrics.reviewLoops["review-1"], 2);
});

test("full canonical followup names do not collapse nested routes", () => {
  const nestedManifest = manifest({
    routes: [{
      taskName: "/root/team-a/review",
      role: "reviewer",
      forkTurns: "none",
      maxFollowups: 1,
    }],
  });
  const rollout = [
    tokens(10),
    call("/root/team-a/review", "reviewer", "none"),
    followup("/root/team-a/review"),
    tokens(20),
  ].join("\n");
  const result = validateTelemetry(parseRolloutText(rollout), nestedManifest);
  assert.equal(result.ok, true);
  assert.equal(result.metrics.followupsByTask["/root/team-a/review"], 1);
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

test("partial cumulative token payload reports telemetry_gap", () => {
  const partial = JSON.stringify({
    type: "event_msg",
    payload: {
      type: "token_count",
      info: { total_token_usage: { input_tokens: 10 } },
    },
  });
  const result = validateTelemetry(parseRolloutText(partial), manifest({ routes: [] }));
  assert.equal(result.metrics.tokens.available, false);
  assert.match(result.telemetryGaps.join("\n"), /no cumulative total/i);
});

test("positive fork exception rejects duplicate or invalid turn identifiers", () => {
  for (const turns of [[2, 2, 4], [2, null, 4]]) {
    const invalid = manifest({
      routes: [{
        taskName: "task-1",
        role: "worker",
        forkTurns: "3",
        forkException: { turns, reason: "Binding decisions" },
      }],
    });
    const rollout = [tokens(10), call("task-1", "worker", "3"), tokens(20)].join("\n");
    const result = validateTelemetry(parseRolloutText(rollout), invalid);
    assert.match(result.violations.join("\n"), /lacks exact-turn justification/);
  }
});
