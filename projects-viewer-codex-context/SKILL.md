---
name: projects-viewer-codex-context
description: "Work in Projects Viewer: start its dashboard, retrieve agent context, use its read-only APIs, or update its agent workflow."
---

# Projects Viewer Codex Context

## Core Workflow

1. Confirm the current repository is Projects Viewer, normally `C:\Users\danoc\Documents\projects\projects-viewer`.
2. Read the project-local runbook `docs/AGENTS_USAGE.md` before substantial work when it exists.
3. If the local API is available, prefer the agent preflight packet over ad hoc context gathering:

   ```text
   GET /api/agent-preflight-packet?projectId=<id>&changeId=<change-id>&agentRole=<role>
   ```

4. If the local API is not available, use the documented fallback read order and state that the packet was unavailable.
5. Preserve Projects Viewer safety boundaries: read-only scanned projects, saved project IDs only, no arbitrary paths, no shell/action/task/calendar/remote/model/auth behavior through APIs or MCP.
6. When agent workflow, API usage, MCP configuration, verification commands, or safety boundaries change, update `docs/AGENTS_USAGE.md`.

## Detailed Reference

Read `references/projects-viewer-workflow.md` when you need exact startup commands, API examples, MCP tool names, fallback steps, or maintenance rules.
