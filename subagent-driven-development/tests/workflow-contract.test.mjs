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
