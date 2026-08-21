# Projects Viewer Codex Workflow

## Project

Default repository path:

```text
C:\Users\danoc\Documents\projects\projects-viewer
```

Project-local runbook:

```text
docs/AGENTS_USAGE.md
```

Read and maintain that file whenever agent workflow, API usage, MCP configuration, verification commands, or safety boundaries change.

## Start The Local API

From the repository root:

```powershell
npm run dev
```

Default URL:

```text
http://127.0.0.1:5173
```

Production-like local mode:

```powershell
npm run build
npm run server
```

One-shot scan:

```powershell
npm run scan
```

## Preferred Context Packet

Use the packet for substantial implementation, review, verification, or handoff work when the API is available.

List projects:

```powershell
Invoke-RestMethod "http://127.0.0.1:5173/api/projects"
```

Fetch a packet:

```powershell
Invoke-RestMethod "http://127.0.0.1:5173/api/agent-preflight-packet?projectId=<id>&agentRole=implementation"
```

With OpenSpec change:

```powershell
Invoke-RestMethod "http://127.0.0.1:5173/api/agent-preflight-packet?projectId=<id>&changeId=<change-id>&agentRole=reviewer"
```

Agent roles:

- `implementation`
- `reviewer`
- `verification`
- `handoff`

## Fallback When API Is Unavailable

Use this fallback and report that the API packet was unavailable:

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/00_FILE_STRUCTURE.md`
4. `docs/ROADMAP.md`
5. Relevant `docs/phases/PHASE_*.md`
6. Relevant `openspec/changes/<change-id>/`
7. `docs/CURRENT_PROJECT_AUDIT.md`
8. `docs/AI_STEP_VERIFICATION_CHECKLIST.md`
9. Task-specific docs only

## MCP Adapter

Project-scoped MCP config:

```text
.codex/config.toml
```

Server:

```text
server/projects-viewer-mcp.mjs
```

Read-only MCP tools:

- `list_projects`
- `get_agent_preflight_packet`
- `get_project_brief_report`
- `get_ai_context`
- `get_ai_findings`

The adapter calls the local HTTP API and does not start it. If a tool reports the API is unavailable, start `npm run dev`.

Override API URL for alternate local ports or tests:

```powershell
$env:PROJECTS_VIEWER_API_BASE_URL = "http://127.0.0.1:<port>"
```

## Safety Boundaries

Do not use Projects Viewer APIs or MCP tools to:

- pass arbitrary filesystem paths;
- run shell commands;
- create commits;
- create or update tasks;
- create or update calendar events;
- call remote model providers;
- pass auth tokens or API keys;
- start agent work automatically;
- modify scanned project folders.

Scanned projects are read-only inputs. `app-data/projects.config.json` is the source of tracked project paths.

## Verification

For API, MCP, or workflow changes:

```powershell
npm test -- tests/projects-viewer-mcp.test.mjs
npm test -- tests/agent-preflight-packet.test.mjs
npm test
npm run build
openspec list
openspec list --specs
openspec validate --all --strict
git diff --check
```

If a command cannot run, report the command, blocker, and risk.
