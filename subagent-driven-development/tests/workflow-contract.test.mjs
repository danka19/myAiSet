import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const skillsRoot = path.resolve(testsDir, "..", "..");

async function skill(name) {
  return readFile(path.join(skillsRoot, name, "SKILL.md"), "utf8");
}

test("using-superpowers owns the explicit subagent dispatch contract", async () => {
  const text = await skill("using-superpowers");
  assert.match(text, /## Subagent Dispatch Contract/);
  assert.match(text, /fork_turns: "none"/);
  assert.match(text, /Omitting `fork_turns` is prohibited/);
  assert.match(text, /`fork_turns: "all"` is prohibited/);
  assert.match(text, /status, artifact paths, verification summary, and blockers/);
});

test("agent workflow skills reference one context owner", async () => {
  for (const name of ["subagent-driven-development", "dispatching-parallel-agents"]) {
    const text = await skill(name);
    assert.match(text, /using-superpowers.*Subagent Dispatch Contract/is, name);
    assert.doesNotMatch(text, /They should never inherit your session's context or history/, name);
  }
});

test("subagent-driven-development alone owns risk and task-review routing", async () => {
  const sdd = await skill("subagent-driven-development");
  const plans = await skill("writing-plans");
  const review = await skill("requesting-code-review");

  assert.match(sdd, /implementation and review unit is a risk-classified cluster/i);
  assert.doesNotMatch(plans, /fresh subagent per task|two-stage review/i);
  assert.doesNotMatch(
    review,
    /After each task in subagent-driven development|Review after EACH task/i,
  );
  assert.match(review, /subagent-driven-development.*owns.*task.*review/is);
});

test("scope admission covers findings from every source", async () => {
  const sdd = await skill("subagent-driven-development");
  const intake = await skill("phase-change-intake");
  const everySource = /controller.*worker.*reviewer.*architect.*test.*tool.*human/is;

  assert.match(sdd, /### Scope Admission Gate/);
  assert.match(sdd, everySource);
  assert.match(intake, everySource);
});

test("brainstorming has a closed non-design fast lane", async () => {
  const text = await skill("brainstorming");
  assert.match(text, /### Closed Fast Lane/);
  assert.match(text, /accepted spec or approved implementation plan/i);
  assert.match(text, /public contract.*security.*data.*architecture.*UX/is);
});
