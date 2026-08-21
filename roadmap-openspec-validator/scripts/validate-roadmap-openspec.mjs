#!/usr/bin/env node

import { access, readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ALLOWED_STATUSES = new Set([
  'draft', 'planned', 'ready', 'in_progress', 'blocked',
  'pending_acceptance', 'accepted', 'closed', 'deferred',
  'cancelled', 'superseded'
]);

const normalized = (value) => value.trim().replace(/^`|`$/g, '');
const phaseId = (value) => {
  const match = normalized(value).match(/^P?(\d+)$/i);
  return match ? `P${Number(match[1])}` : null;
};

function diagnostic(code, message, file = null, item = null) {
  return { code, message, file, item };
}

function compareDiagnostic(a, b) {
  return [a.code, a.file ?? '', a.item ?? '', a.message].join('\0')
    .localeCompare([b.code, b.file ?? '', b.item ?? '', b.message].join('\0'));
}

function ensureInside(root, target) {
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path escapes repository root: ${target}`);
  }
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function safeRead(root, relativePath) {
  const target = path.resolve(root, relativePath);
  ensureInside(root, target);
  if (!(await exists(target))) return null;
  const actual = await realpath(target);
  ensureInside(root, actual);
  return readFile(actual, 'utf8');
}

async function directories(root, relativePath) {
  const target = path.resolve(root, relativePath);
  ensureInside(root, target);
  if (!(await exists(target))) return [];
  const actual = await realpath(target);
  ensureInside(root, actual);
  const entries = await readdir(actual, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

function section(content, heading) {
  const lines = content.split(/\r?\n/);
  const indexes = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() === `## ${heading}`) indexes.push(index);
  }
  if (indexes.length !== 1) return { count: indexes.length, text: '' };
  const start = indexes[0] + 1;
  let end = lines.length;
  for (let index = start; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }
  return { count: 1, text: lines.slice(start, end).join('\n') };
}

function values(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...text.matchAll(new RegExp(`^(?:-\\s+)?${escaped}:\\s*(.+?)\\s*$`, 'gmi'))].map((match) => normalized(match[1]));
}

function parseRelated(raw) {
  if (!raw || raw.toLowerCase() === 'none') return [];
  return raw.split(',').map((value) => phaseId(value)).filter(Boolean);
}

function parseArtifactMetadata(content, kind, file, id, errors) {
  const roadmap = section(content, 'Roadmap');
  const primaryKey = kind === 'spec' ? 'Roadmap phase' : 'Execution phase';
  const missingCode = kind === 'spec' ? 'SPEC_PRIMARY_MISSING' : 'CHANGE_EXECUTION_MISSING';
  const multipleCode = kind === 'spec' ? 'SPEC_PRIMARY_MULTIPLE' : 'CHANGE_EXECUTION_MULTIPLE';
  const primaryValues = roadmap.count === 1 ? values(roadmap.text, primaryKey) : [];
  if (roadmap.count === 0 || primaryValues.length === 0) {
    errors.push(diagnostic(missingCode, `${id} must declare exactly one ${primaryKey}`, file, id));
  } else if (roadmap.count > 1 || primaryValues.length > 1) {
    errors.push(diagnostic(multipleCode, `${id} declares multiple ${primaryKey} values`, file, id));
  }
  const primary = primaryValues.length === 1 ? phaseId(primaryValues[0]) : null;
  if (primaryValues.length === 1 && !primary) {
    errors.push(diagnostic('PHASE_INVALID', `${id} has invalid phase ${primaryValues[0]}`, file, id));
  }
  const relatedValues = roadmap.count === 1 ? values(roadmap.text, 'Related phases') : [];
  if (relatedValues.length > 1) {
    errors.push(diagnostic('RELATED_PHASES_INVALID', `${id} declares multiple Related phases values`, file, id));
  }
  const related = relatedValues.length === 1 ? parseRelated(relatedValues[0]) : [];
  const rawRelated = relatedValues.length === 1 && relatedValues[0].toLowerCase() !== 'none'
    ? relatedValues[0].split(',').map((value) => normalized(value))
    : [];
  if (rawRelated.some((value) => !phaseId(value))) {
    errors.push(diagnostic('PHASE_INVALID', `${id} has an invalid related phase`, file, id));
  }
  if (new Set(related).size !== related.length) {
    errors.push(diagnostic('RELATED_PHASE_DUPLICATE', `${id} repeats a related phase`, file, id));
  }
  if (primary && related.includes(primary)) {
    errors.push(diagnostic('RELATED_REPEATS_PRIMARY', `${id} repeats primary phase ${primary} as related`, file, id));
  }
  let status = null;
  if (kind === 'change') {
    const statuses = roadmap.count === 1 ? values(roadmap.text, 'Lifecycle status') : [];
    if (statuses.length !== 1 || !ALLOWED_STATUSES.has(statuses[0])) {
      errors.push(diagnostic('CHANGE_STATUS_INVALID', `${id} must declare one allowed Lifecycle status`, file, id));
    } else {
      [status] = statuses;
    }
  }
  return { id, primary, related, status, file };
}

function parsePhases(content, errors) {
  const lines = content.split(/\r?\n/);
  const phases = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^##\s+(?:Phase\s+(\d+)|P(\d+))(?:[.\s]|$)\s*(.*)$/i);
    if (!match) continue;
    const id = `P${Number(match[1] ?? match[2])}`;
    let end = lines.length;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (/^##\s+/.test(lines[cursor])) {
        end = cursor;
        break;
      }
    }
    const body = lines.slice(index + 1, end).join('\n');
    const statusMatch = body.match(/^Status:\s*([a-z_]+)\.?\s*$/mi);
    const status = statusMatch?.[1] ?? null;
    if (!status || !ALLOWED_STATUSES.has(status)) {
      errors.push(diagnostic('PHASE_STATUS_INVALID', `${id} must declare one allowed Status`, 'docs/ROADMAP.md', id));
    }
    const planMatch = body.match(/Detailed plan:\s*`([^`]+)`/i);
    phases.push({ id, title: match[3].trim(), status, plan: planMatch?.[1] ?? null });
    index = end - 1;
  }
  const counts = new Map();
  for (const phase of phases) counts.set(phase.id, (counts.get(phase.id) ?? 0) + 1);
  for (const [id, count] of counts) {
    if (count > 1) errors.push(diagnostic('PHASE_DUPLICATE', `${id} is declared ${count} times`, 'docs/ROADMAP.md', id));
  }
  return phases;
}

function parseTable(content, heading, expectedHeaders, errors) {
  const found = section(content, heading);
  if (found.count !== 1) {
    errors.push(diagnostic('ROADMAP_TABLE_INVALID', `${heading} must appear exactly once`, 'docs/ROADMAP.md', heading));
    return [];
  }
  const rows = found.text.split(/\r?\n/).filter((line) => line.trim().startsWith('|'));
  if (rows.length < 2) {
    errors.push(diagnostic('ROADMAP_TABLE_INVALID', `${heading} table header is missing`, 'docs/ROADMAP.md', heading));
    return [];
  }
  const cells = (line) => line.split('|').slice(1, -1).map((cell) => normalized(cell));
  const headers = cells(rows[0]);
  if (headers.join('|') !== expectedHeaders.join('|')) {
    errors.push(diagnostic('ROADMAP_TABLE_INVALID', `${heading} headers do not match the contract`, 'docs/ROADMAP.md', heading));
  }
  return rows.slice(2).map(cells).filter((row) => row.some(Boolean));
}

async function parsePlanStatuses(root, phases, errors) {
  const phaseById = new Map(phases.map((phase) => [phase.id, phase]));
  let files = [];
  try {
    files = (await readdir(path.join(root, 'docs/phases'), { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /^PHASE_.*\.md$/i.test(entry.name))
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  for (const name of files) {
    const relative = `docs/phases/${name}`;
    const content = await safeRead(root, relative);
    const header = content?.match(/^#\s+(?:Phase\s+(\d+)|P(\d+))(?:[.\s]|$)/mi);
    if (!header) continue;
    const id = `P${Number(header[1] ?? header[2])}`;
    const status = content.match(/^Status:\s*([a-z_]+)\.?\s*$/mi)?.[1] ?? null;
    const roadmapPhase = phaseById.get(id);
    if (roadmapPhase && status && roadmapPhase.status !== status) {
      errors.push(diagnostic('PHASE_STATUS_MISMATCH', `${id} is ${roadmapPhase.status} in roadmap and ${status} in phase plan`, relative, id));
    }
  }
}

export async function validateRepository(rootPath) {
  const root = await realpath(path.resolve(rootPath));
  const errors = [];
  const warnings = [];
  const roadmap = await safeRead(root, 'docs/ROADMAP.md');
  if (roadmap === null) {
    errors.push(diagnostic('ROADMAP_MISSING', 'docs/ROADMAP.md is required', 'docs/ROADMAP.md'));
  }
  const phases = roadmap ? parsePhases(roadmap, errors) : [];
  const phaseIds = new Set(phases.map((phase) => phase.id));
  const specRows = roadmap ? parseTable(roadmap, 'Capability Spec Ownership', ['Capability spec', 'Roadmap phase', 'Related phases'], errors) : [];
  const changeRows = roadmap ? parseTable(roadmap, 'Active Change Execution', ['Active change', 'Execution phase', 'Related phases', 'Lifecycle status'], errors) : [];

  const specs = [];
  for (const id of await directories(root, 'openspec/specs')) {
    const file = `openspec/specs/${id}/spec.md`;
    const content = await safeRead(root, file);
    if (content === null) {
      errors.push(diagnostic('SPEC_FILE_MISSING', `${id} is missing spec.md`, file, id));
      continue;
    }
    specs.push(parseArtifactMetadata(content, 'spec', file, id, errors));
  }

  const changes = [];
  for (const id of (await directories(root, 'openspec/changes')).filter((name) => name !== 'archive')) {
    const file = `openspec/changes/${id}/proposal.md`;
    const content = await safeRead(root, file);
    if (content === null) {
      errors.push(diagnostic('CHANGE_PROPOSAL_MISSING', `${id} is missing proposal.md`, file, id));
      continue;
    }
    const item = parseArtifactMetadata(content, 'change', file, id, errors);
    const tasks = await safeRead(root, `openspec/changes/${id}/tasks.md`);
    const taskMatches = tasks ? [...tasks.matchAll(/^- \[([ xX])\]\s+/gm)] : [];
    if (taskMatches.length > 0 && taskMatches.every((match) => match[1].toLowerCase() === 'x') && !['accepted', 'closed'].includes(item.status)) {
      warnings.push(diagnostic('TASKS_COMPLETE_NOT_ACCEPTED', `${id} has complete tasks but remains ${item.status}`, `openspec/changes/${id}/tasks.md`, id));
    }
    changes.push(item);
  }

  const archived = new Set(await directories(root, 'openspec/changes/archive'));
  const checkPhaseRefs = (item) => {
    for (const id of [item.primary, ...item.related].filter(Boolean)) {
      if (!phaseIds.has(id)) errors.push(diagnostic('PHASE_UNKNOWN', `${item.id} references unknown phase ${id}`, item.file, item.id));
    }
  };
  specs.forEach(checkPhaseRefs);
  changes.forEach(checkPhaseRefs);

  const specRowItems = specRows.map((row) => ({ id: row[0], primary: phaseId(row[1]), related: parseRelated(row[2]), file: 'docs/ROADMAP.md' }));
  const changeRowItems = changeRows.map((row) => ({ id: row[0], primary: phaseId(row[1]), related: parseRelated(row[2]), status: row[3], file: 'docs/ROADMAP.md' }));
  const reconcile = (artifacts, rows, kind) => {
    const artifactById = new Map(artifacts.map((item) => [item.id, item]));
    const rowGroups = new Map();
    for (const row of rows) rowGroups.set(row.id, [...(rowGroups.get(row.id) ?? []), row]);
    for (const artifact of artifacts) {
      const matches = rowGroups.get(artifact.id) ?? [];
      if (matches.length === 0) errors.push(diagnostic('ROADMAP_ROW_MISSING', `${artifact.id} is missing from ${kind} inverse table`, 'docs/ROADMAP.md', artifact.id));
      if (matches.length > 1) errors.push(diagnostic('ROADMAP_ROW_DUPLICATE', `${artifact.id} appears ${matches.length} times in ${kind} inverse table`, 'docs/ROADMAP.md', artifact.id));
      if (matches.length === 1) {
        const row = matches[0];
        if (artifact.primary !== row.primary || artifact.related.join(',') !== row.related.join(',')) {
          errors.push(diagnostic('ROADMAP_METADATA_MISMATCH', `${artifact.id} metadata does not match its roadmap row`, 'docs/ROADMAP.md', artifact.id));
        }
        if (kind === 'change' && artifact.status !== row.status) {
          errors.push(diagnostic('CHANGE_STATUS_MISMATCH', `${artifact.id} is ${artifact.status} in proposal and ${row.status} in roadmap`, 'docs/ROADMAP.md', artifact.id));
        }
      }
    }
    for (const row of rows) {
      if (!artifactById.has(row.id)) {
        const code = kind === 'change' && archived.has(row.id) ? 'ARCHIVED_CHANGE_LISTED' : 'ROADMAP_ARTIFACT_MISSING';
        errors.push(diagnostic(code, `${row.id} roadmap row has no active ${kind} artifact`, 'docs/ROADMAP.md', row.id));
      }
    }
  };
  reconcile(specs, specRowItems, 'spec');
  reconcile(changes, changeRowItems, 'change');

  const covered = new Set();
  for (const item of [...specs, ...changes]) {
    if (item.primary && phaseIds.has(item.primary)) covered.add(item.primary);
    for (const related of item.related) if (phaseIds.has(related)) covered.add(related);
  }
  for (const phase of phases) {
    if (covered.has(phase.id)) continue;
    const target = phase.status === 'draft' ? warnings : errors;
    const code = phase.status === 'draft' ? 'PHASE_DRAFT_UNCOVERED' : 'PHASE_COVERAGE_MISSING';
    target.push(diagnostic(code, `${phase.id} (${phase.status}) has no OpenSpec coverage`, 'docs/ROADMAP.md', phase.id));
  }
  await parsePlanStatuses(root, phases, errors);

  errors.sort(compareDiagnostic);
  warnings.sort(compareDiagnostic);
  const result = {
    ok: errors.length === 0,
    root,
    phases: phases.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1))),
    specs: specs.sort((a, b) => a.id.localeCompare(b.id)),
    changes: changes.sort((a, b) => a.id.localeCompare(b.id)),
    errors,
    warnings,
    summary: {
      phaseCount: phases.length,
      specCount: specs.length,
      changeCount: changes.length,
      errorCount: errors.length,
      warningCount: warnings.length
    }
  };
  return result;
}

export function formatHumanReport(result) {
  const lines = [
    `Roadmap/OpenSpec validation: ${result.ok ? 'PASS' : 'FAIL'}`,
    `Root: ${result.root}`,
    `Phases: ${result.summary.phaseCount}; specs: ${result.summary.specCount}; active changes: ${result.summary.changeCount}`,
    `Errors: ${result.summary.errorCount}; warnings: ${result.summary.warningCount}`
  ];
  for (const item of result.errors) lines.push(`ERROR ${item.code}: ${item.message}${item.file ? ` [${item.file}]` : ''}`);
  for (const item of result.warnings) lines.push(`WARN ${item.code}: ${item.message}${item.file ? ` [${item.file}]` : ''}`);
  return lines.join('\n');
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help')) {
    process.stdout.write('Usage: validate-roadmap-openspec.mjs --root <repository-root> [--json]\n');
    return 0;
  }
  const rootIndex = argv.indexOf('--root');
  if (rootIndex === -1 || !argv[rootIndex + 1]) {
    process.stderr.write('Missing required --root <repository-root>\n');
    return 2;
  }
  try {
    const result = await validateRepository(argv[rootIndex + 1]);
    process.stdout.write(`${argv.includes('--json') ? JSON.stringify(result, null, 2) : formatHumanReport(result)}\n`);
    return result.ok ? 0 : 1;
  } catch (error) {
    process.stderr.write(`Validation failed: ${error.message}\n`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await main();
}
