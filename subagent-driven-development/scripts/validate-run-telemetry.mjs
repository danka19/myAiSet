#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

function parseArguments(value) {
  if (value && typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function cumulativeTokens(payload) {
  const usage = payload?.info?.total_token_usage;
  if (!usage || typeof usage !== "object") return null;
  if (Number.isFinite(usage.total_tokens)) return usage.total_tokens;
  return null;
}

export function parseRolloutText(text) {
  const calls = [];
  const agentActivities = [];
  const tokenSamples = [];
  const telemetryGaps = [];
  let recognizedLines = 0;

  for (const [index, rawLine] of String(text).split(/\r?\n/).entries()) {
    if (!rawLine.trim()) continue;
    let event;
    try {
      event = JSON.parse(rawLine);
    } catch {
      telemetryGaps.push(`line ${index + 1}: invalid JSON`);
      continue;
    }

    if (event?.type === "response_item" && event.payload?.type === "function_call") {
      const name = event.payload.name;
      if (["spawn_agent", "followup_task", "wait_agent"].includes(name)) {
        recognizedLines += 1;
        const args = parseArguments(event.payload.arguments);
        if (!args) {
          telemetryGaps.push(`line ${index + 1}: unreadable ${name} arguments`);
        }
        calls.push({
          name,
          args,
          callId: event.payload.call_id ?? null,
          line: index + 1,
          timestamp: event.timestamp ?? null,
        });
      }
    }

    if (
      event?.type === "event_msg"
      && event.payload?.type === "sub_agent_activity"
      && event.payload?.kind === "started"
    ) {
      recognizedLines += 1;
      agentActivities.push({
        callId: event.payload.event_id ?? null,
        agentThreadId: event.payload.agent_thread_id ?? null,
        agentPath: event.payload.agent_path ?? null,
      });
    }

    if (event?.type === "event_msg" && event.payload?.type === "token_count") {
      recognizedLines += 1;
      const total = cumulativeTokens(event.payload);
      if (total === null) {
        telemetryGaps.push(`line ${index + 1}: token_count has no cumulative total`);
      } else {
        tokenSamples.push(total);
      }
    }
  }

  if (recognizedLines === 0) {
    telemetryGaps.push("unrecognized rollout schema: no supported calls or token samples");
  }

  return { calls, agentActivities, tokenSamples, telemetryGaps };
}

function increment(record, key) {
  const safeKey = key ?? "unknown";
  record[safeKey] = (record[safeKey] ?? 0) + 1;
}

function matchingRoute(routes, args) {
  return routes.find(
    (route) => route.taskName === args?.task_name && route.role === args?.agent_type,
  );
}

function followupRoute(parsed, routes, target) {
  const direct = routes.filter((route) => route.taskName === target);
  if (direct.length === 1) return direct[0];

  const activity = (parsed.agentActivities ?? []).find(
    (candidate) => candidate.agentThreadId === target || candidate.agentPath === target,
  );
  if (activity) {
    const spawn = (parsed.calls ?? []).find(
      (call) => call.name === "spawn_agent" && call.callId === activity.callId,
    );
    const viaSpawn = routes.filter(
      (route) => route.taskName === spawn?.args?.task_name
        && route.role === spawn?.args?.agent_type,
    );
    if (viaSpawn.length === 1) return viaSpawn[0];
  }

  const canonicalSuffix = routes.filter(
    (route) => !String(route.taskName).includes("/")
      && String(target).endsWith(`/${route.taskName}`),
  );
  return canonicalSuffix.length === 1 ? canonicalSuffix[0] : null;
}

export function validateTelemetry(parsed, manifest) {
  const routes = Array.isArray(manifest?.routes) ? manifest.routes : [];
  const maxReviewLoops = Number.isInteger(manifest?.maxReviewLoops)
    ? manifest.maxReviewLoops
    : 2;
  const violations = [];
  const telemetryGaps = [...(parsed.telemetryGaps ?? [])];
  const byRole = {};
  const byForkMode = {};
  const reviewLoops = {};
  const followupsByTask = {};
  let agentsCreated = 0;
  let followups = 0;
  let waits = 0;

  for (const call of parsed.calls ?? []) {
    if (call.name === "followup_task") {
      followups += 1;
      const args = call.args;
      if (!args) continue;
      const route = followupRoute(parsed, routes, args.target);
      if (!route) {
        violations.push(`${args.target ?? "unknown"}: unplanned followup target`);
        continue;
      }

      const taskName = route.taskName;

      increment(followupsByTask, taskName);
      const allowance = Number.isInteger(route.maxFollowups) ? route.maxFollowups : 0;
      if (followupsByTask[taskName] > allowance) {
        violations.push(
          `${taskName}: followups ${followupsByTask[taskName]} exceed allowance ${allowance}`,
        );
      }
      if (route.role === "reviewer") {
        increment(reviewLoops, taskName);
        if (reviewLoops[taskName] > maxReviewLoops) {
          violations.push(
            `${taskName}: review loops ${reviewLoops[taskName]} exceed maximum ${maxReviewLoops}`,
          );
        }
      }
      continue;
    }
    if (call.name === "wait_agent") {
      waits += 1;
      continue;
    }
    if (call.name !== "spawn_agent") continue;

    agentsCreated += 1;
    const args = call.args;
    if (!args) continue;
    increment(byRole, args.agent_type);
    increment(byForkMode, args.fork_turns ?? "omitted");

    if (args.fork_turns === undefined) {
      violations.push(`${args.task_name ?? "unknown"}: fork_turns is omitted`);
    } else if (args.fork_turns === "all") {
      violations.push(`${args.task_name ?? "unknown"}: fork_turns "all" is prohibited`);
    }

    const route = matchingRoute(routes, args);
    if (!route) {
      violations.push(
        `${args.task_name ?? "unknown"}/${args.agent_type ?? "unknown"}: unplanned route`,
      );
    } else {
      if (String(args.fork_turns) !== String(route.forkTurns)) {
        violations.push(`${args.task_name}: fork mode differs from manifest`);
      }
      if (/^[1-9]\d*$/.test(String(args.fork_turns))) {
        const exception = route.forkException;
        const turnIds = Array.isArray(exception?.turns) ? exception.turns : [];
        const validTurnIds = turnIds.every(
          (turn) => (Number.isInteger(turn) && turn > 0)
            || (typeof turn === "string" && turn.trim().length > 0),
        );
        const uniqueTurnIds = new Set(turnIds.map((turn) => String(turn))).size;
        if (
          !exception
          || turnIds.length !== Number(args.fork_turns)
          || !validTurnIds
          || uniqueTurnIds !== turnIds.length
          || !String(exception.reason ?? "").trim()
        ) {
          violations.push(`${args.task_name}: positive fork mode lacks exact-turn justification`);
        }
      }
    }

    if (args.agent_type === "reviewer") {
      increment(reviewLoops, args.task_name);
      if (reviewLoops[args.task_name] > maxReviewLoops) {
        violations.push(
          `${args.task_name}: review loops ${reviewLoops[args.task_name]} exceed maximum ${maxReviewLoops}`,
        );
      }
    }
  }

  let tokenMetrics = { available: false, initial: null, final: null, delta: null };
  if ((parsed.tokenSamples ?? []).length > 0) {
    const initial = parsed.tokenSamples[0];
    const final = parsed.tokenSamples.at(-1);
    if (final < initial) {
      telemetryGaps.push("cumulative token counter decreased during rollout");
    } else {
      tokenMetrics = { available: true, initial, final, delta: final - initial };
    }
  } else {
    telemetryGaps.push("cumulative token telemetry unavailable");
  }

  return {
    ok: violations.length === 0 && telemetryGaps.length === 0,
    violations,
    telemetryGaps: [...new Set(telemetryGaps)],
    metrics: {
      agentsCreated,
      byRole,
      byForkMode,
      followups,
      followupsByTask,
      waits,
      reviewLoops,
      tokens: tokenMetrics,
    },
  };
}

function parseCli(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!["--manifest", "--rollout", "--out"].includes(flag) || !value) {
      throw new Error("usage: validate-run-telemetry --manifest <json> --rollout <jsonl> [--out <json>]");
    }
    options[flag.slice(2)] = value;
  }
  if (!options.manifest || !options.rollout) {
    throw new Error("--manifest and --rollout are required");
  }
  return options;
}

async function main() {
  const options = parseCli(process.argv.slice(2));
  const [manifestText, rolloutText] = await Promise.all([
    readFile(path.resolve(options.manifest), "utf8"),
    readFile(path.resolve(options.rollout), "utf8"),
  ]);
  const result = validateTelemetry(parseRolloutText(rolloutText), JSON.parse(manifestText));
  const output = `${JSON.stringify(result, null, 2)}\n`;
  if (options.out) await writeFile(path.resolve(options.out), output, "utf8");
  process.stdout.write(output);
  process.exitCode = result.ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  });
}
