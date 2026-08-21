import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { validateRepository } from '../scripts/validate-roadmap-openspec.mjs';

const roots = [];

async function put(root, relativePath, content) {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
}

async function replace(root, relativePath, from, to) {
  const target = path.join(root, relativePath);
  const content = await readFile(target, 'utf8');
  assert.ok(content.includes(from), `fixture text not found: ${from}`);
  await writeFile(target, content.replace(from, to), 'utf8');
}

async function createValidRepository() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'roadmap-openspec-validator-'));
  roots.push(root);
  await put(root, 'docs/ROADMAP.md', `# Roadmap

## Phase 0. Baseline

Status: closed.

Detailed plan: \`docs/phases/PHASE_0_BASELINE.md\`.

## Phase 1. Delivery

Status: planned.

Detailed plan: \`docs/phases/PHASE_1_DELIVERY.md\`.

## Phase 2. Future

Status: draft.

## Capability Spec Ownership

| Capability spec | Roadmap phase | Related phases |
|---|---|---|
| \`cap-one\` | \`P0\` | \`none\` |

## Active Change Execution

| Active change | Execution phase | Related phases | Lifecycle status |
|---|---|---|---|
| \`change-one\` | \`P1\` | \`none\` | \`planned\` |
`);
  await put(root, 'docs/phases/PHASE_0_BASELINE.md', '# Phase 0. Baseline\n\nStatus: closed.\n');
  await put(root, 'docs/phases/PHASE_1_DELIVERY.md', '# Phase 1. Delivery\n\nStatus: planned.\n');
  await put(root, 'openspec/specs/cap-one/spec.md', `## Roadmap

Roadmap phase: P0
Related phases: none

## Purpose

Fixture capability.
`);
  await put(root, 'openspec/changes/change-one/proposal.md', `## Roadmap

Execution phase: P1
Related phases: none
Lifecycle status: planned

## Why

Fixture change.
`);
  await put(root, 'openspec/changes/change-one/tasks.md', '- [ ] 1.1 Implement fixture.\n');
  return root;
}

function codes(result, kind = 'errors') {
  return result[kind].map((item) => item.code);
}

test.after(async () => {
  await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
});

test('valid mixed repository succeeds with an uncovered draft warning', async () => {
  const result = await validateRepository(await createValidRepository());
  assert.equal(result.ok, true);
  assert.deepEqual(codes(result), []);
  assert.ok(codes(result, 'warnings').includes('PHASE_DRAFT_UNCOVERED'));
});

test('related phases metadata is optional', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/specs/cap-one/spec.md', 'Related phases: none\n', '');
  const result = await validateRepository(root);
  assert.equal(result.ok, true);
  assert.ok(!codes(result).includes('RELATED_PHASES_INVALID'));
});

test('roadmap metadata may use Markdown list markers', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/specs/cap-one/spec.md', 'Roadmap phase: P0\nRelated phases: none', '- Roadmap phase: P0\n- Related phases: none');
  await replace(root, 'openspec/changes/change-one/proposal.md', 'Execution phase: P1\nRelated phases: none\nLifecycle status: planned', '- Execution phase: P1\n- Related phases: none\n- Lifecycle status: planned');
  assert.equal((await validateRepository(root)).ok, true);
});

test('missing capability primary phase fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/specs/cap-one/spec.md', 'Roadmap phase: P0\n', '');
  assert.ok(codes(await validateRepository(root)).includes('SPEC_PRIMARY_MISSING'));
});

test('multiple capability primary phases fail', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/specs/cap-one/spec.md', 'Roadmap phase: P0', 'Roadmap phase: P0\nRoadmap phase: P1');
  assert.ok(codes(await validateRepository(root)).includes('SPEC_PRIMARY_MULTIPLE'));
});

test('missing active change execution phase fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/changes/change-one/proposal.md', 'Execution phase: P1\n', '');
  assert.ok(codes(await validateRepository(root)).includes('CHANGE_EXECUTION_MISSING'));
});

test('unknown primary or related phase fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/changes/change-one/proposal.md', 'Related phases: none', 'Related phases: P9');
  assert.ok(codes(await validateRepository(root)).includes('PHASE_UNKNOWN'));
});

test('primary phase repeated as related fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/changes/change-one/proposal.md', 'Related phases: none', 'Related phases: P1');
  assert.ok(codes(await validateRepository(root)).includes('RELATED_REPEATS_PRIMARY'));
});

test('missing inverse row fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'docs/ROADMAP.md', '| `cap-one` | `P0` | `none` |\n', '');
  assert.ok(codes(await validateRepository(root)).includes('ROADMAP_ROW_MISSING'));
});

test('duplicate inverse row fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'docs/ROADMAP.md', '| `cap-one` | `P0` | `none` |', '| `cap-one` | `P0` | `none` |\n| `cap-one` | `P0` | `none` |');
  assert.ok(codes(await validateRepository(root)).includes('ROADMAP_ROW_DUPLICATE'));
});

test('inverse metadata mismatch fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'docs/ROADMAP.md', '| `change-one` | `P1` | `none` | `planned` |', '| `change-one` | `P0` | `none` | `planned` |');
  assert.ok(codes(await validateRepository(root)).includes('ROADMAP_METADATA_MISMATCH'));
});

test('roadmap row pointing to a missing artifact fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'docs/ROADMAP.md', '| `cap-one` | `P0` | `none` |', '| `cap-one` | `P0` | `none` |\n| `ghost-cap` | `P0` | `none` |');
  assert.ok(codes(await validateRepository(root)).includes('ROADMAP_ARTIFACT_MISSING'));
});

test('archived change remaining in active table fails', async () => {
  const root = await createValidRepository();
  await put(root, 'openspec/changes/archive/2026-01-01-old-change/proposal.md', '## Why\n\nArchived.\n');
  await replace(root, 'docs/ROADMAP.md', '| `change-one` | `P1` | `none` | `planned` |', '| `change-one` | `P1` | `none` | `planned` |\n| `2026-01-01-old-change` | `P1` | `none` | `accepted` |');
  assert.ok(codes(await validateRepository(root)).includes('ARCHIVED_CHANGE_LISTED'));
});

test('uncovered planned phase fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'docs/ROADMAP.md', 'Status: draft.\n\n## Capability', 'Status: planned.\n\n## Capability');
  assert.ok(codes(await validateRepository(root)).includes('PHASE_COVERAGE_MISSING'));
});

test('phase plan status mismatch fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'docs/phases/PHASE_1_DELIVERY.md', 'Status: planned.', 'Status: blocked.');
  assert.ok(codes(await validateRepository(root)).includes('PHASE_STATUS_MISMATCH'));
});

test('change lifecycle mismatch fails', async () => {
  const root = await createValidRepository();
  await replace(root, 'docs/ROADMAP.md', '| `change-one` | `P1` | `none` | `planned` |', '| `change-one` | `P1` | `none` | `accepted` |');
  assert.ok(codes(await validateRepository(root)).includes('CHANGE_STATUS_MISMATCH'));
});

test('complete tasks do not imply acceptance', async () => {
  const root = await createValidRepository();
  await replace(root, 'openspec/changes/change-one/proposal.md', 'Lifecycle status: planned', 'Lifecycle status: pending_acceptance');
  await replace(root, 'docs/ROADMAP.md', '| `change-one` | `P1` | `none` | `planned` |', '| `change-one` | `P1` | `none` | `pending_acceptance` |');
  await replace(root, 'openspec/changes/change-one/tasks.md', '- [ ]', '- [x]');
  const result = await validateRepository(root);
  assert.equal(result.ok, true);
  assert.ok(codes(result, 'warnings').includes('TASKS_COMPLETE_NOT_ACCEPTED'));
  assert.equal(result.changes[0].status, 'pending_acceptance');
});
