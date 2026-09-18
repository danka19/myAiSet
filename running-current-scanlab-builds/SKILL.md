---
name: running-current-scanlab-builds
description: "Build, deploy, launch, or restart the current ScanLab application on Windows or RED OS when requested."
---

# Running Current ScanLab Builds

## Overview

Use the repository orchestrator as the only execution interface. It owns source
identity, complete test gates, safe transfer, exact-process replacement,
rollback, and evidence; do not reconstruct CMake, SSH, copy, or stop commands.

## Workflow

1. Locate the `ScanLabMultiplatform` repository and read
   `docs/runbooks/current-runtime-launch.md`.
2. Select source from the user request:
   - An unqualified “current/latest build” means fetched `origin/main`, even
     when Codex is inside a task worktree: use `-SourceMode Main`.
   - A request explicitly tied to the active task/branch/worktree means that
     exact worktree, including eligible dirty files: use `-SourceMode Task
     -TaskWorktree <exact-path>`.
   - If multiple task worktrees remain plausible, ask one question. Never
     guess, use old BUG paths, or treat a visible window as source identity.
3. Select `Both` unless the user names only `Windows` or `RedOS`.
4. Invoke `scripts/windows/Invoke-ScanLabRuntime.ps1`. Execute a launch request;
   use `-DryRun` only when the user requests a plan. Use `-ForceRebuild` only
   when explicitly requested or diagnostically required.
5. Never waive the orchestrator’s stub plus real-profile full CTest gates,
   even when the user says manual testing is enough.
6. Respect each platform result independently. A failed platform is not ready.
   Preserve the previous process before pre-launch failure and report the
   orchestrator’s rollback result after startup failure.

Example:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/windows/Invoke-ScanLabRuntime.ps1 -Platform Both -SourceMode Main
```

## Result Contract

Report, per platform: status, exact source identity, build/reuse decision,
profile, discovered/passed/failed tests, executable SHA-256, PID, log paths,
warnings, rollback, and retained build-directory path/bytes. Do not report
success when any required field is null, contradictory, or failed.

A completed nonzero `gphoto2 --auto-detect` is a camera warning and does not
block unrelated UI launch. SSH, host-key, timeout, malformed evidence, build,
test, hash, or startup errors are fatal. Do not perform physical-camera actions
unless explicitly requested.

State the acceptance boundary: verified process/window evidence proves that the
tested binary launched; it does not prove functional UI, visual/export quality,
external-camera behavior, or physical-camera acceptance.

## Common Mistakes

| Mistake | Required correction |
|---|---|
| Reuse a historical build path | Let the orchestrator resolve current identity. |
| Write ad hoc CMake/SSH/process commands | Invoke the versioned orchestrator. |
| Skip tests under time pressure | Keep the full gates; report failure or delay. |
| Treat window visibility as success | Require PID/path/hash/tests evidence. |
| Retry a crashing candidate blindly | Use the recorded rollback outcome. |
| Mark both ready after one succeeds | Report platform results independently. |
