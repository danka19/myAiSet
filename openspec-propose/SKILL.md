---
name: openspec-propose
description: "Create a complete OpenSpec proposal for a requested capability or change when that workflow is selected."
license: MIT
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.4.1"
---

Propose a new change - create the change and generate all artifacts in one step.

I'll create a change with artifacts:
- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

When ready to implement, use the openspec-apply-change skill.

---

**Input**: The user's request should include a change name (kebab-case) OR a description of what they want to build.

## Documentation Governance

Creating or changing OpenSpec artifacts is a documentation change. After writing proposal, design, specs, or tasks:

- Update project documentation that records state, roadmap/status, context, architecture, verification habits, or open decisions when the new change affects them.
- Check for contradictions between `AGENTS.md`, `docs/`, and `openspec/`; resolve safe doc drift immediately and surface human decisions when scope/status changes are not safe to decide.
- Avoid duplicate active rules. If the same rule appears in multiple docs, keep the canonical source and replace other copies with references when possible.
- Record durable user decisions, ideas, objections, rejected behavior, and verification expectations in the smallest correct artifact before finishing.
- When the user answers proposal or clarification questions, record each durable answer as it arrives, even if other questions remain open. Do not wait for the last discussed point before updating artifacts.
- After final user acceptance of the proposal direction, review the full dialogue and ensure all accepted decisions, proposed ideas, rejected options, open questions, terminology, risks, and verification expectations are captured or explicitly reported as uncaptured.
- Run the narrowest relevant consistency checks, including `openspec validate --all --strict` when OpenSpec artifacts changed.

## Roadmap Ownership Gate

- Before creating artifacts, identify one existing primary execution phase for the change. If none fits, add or explicitly plan a roadmap phase before the proposal is complete.
- Add one `## Roadmap` section to `proposal.md` with `Execution phase: Pn`, `Related phases: ...`, and `Lifecycle status: ...`.
- Add exactly one matching row to `docs/ROADMAP.md` under `## Active Change Execution` in the same edit.
- Use `roadmap-openspec-validator` after artifact/doc updates. Errors block proposal completion; an uncovered draft phase is only a warning.

**Steps**

1. **If no clear input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → `add-user-auth`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```
   This creates a scaffolded change in the planning home resolved by the CLI with `.openspec.yaml`.

3. **Get the artifact build order**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to get:
   - `applyRequires`: array of artifact IDs needed before implementation (e.g., `["tasks"]`)
   - `artifacts`: list of all artifacts with their status and dependencies
   - `planningHome`, `changeRoot`, `artifactPaths`, and `actionContext`: path and scope context. Use these instead of assuming repo-local paths.

4. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is `ready` (dependencies satisfied)**:
      - Get instructions:
        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```
      - The instructions JSON includes:
        - `context`: Project background (constraints for you - do NOT include in output)
        - `rules`: Artifact-specific rules (constraints for you - do NOT include in output)
        - `template`: The structure to use for your output file
        - `instruction`: Schema-specific guidance for this artifact type
        - `resolvedOutputPath`: Resolved path or pattern to write the artifact
        - `dependencies`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using `template` as the structure and write it to `resolvedOutputPath`
      - Apply `context` and `rules` as constraints - but do NOT copy them into the file
      - Show brief progress: "Created <artifact-id>"

   b. **Continue until all `applyRequires` artifacts are complete**
      - After creating each artifact, re-run `openspec status --change "<name>" --json`
      - Check if every artifact ID in `applyRequires` has `status: "done"` in the artifacts array
      - Stop when all `applyRequires` artifacts are done

   c. **If an artifact requires user input** (unclear context):
      - Use **AskUserQuestion tool** to clarify
      - Then continue with creation

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

6. **Update related project docs**

   Review `AGENTS.md`, `docs/README.md`, `docs/ROADMAP.md`, `docs/CURRENT_PROJECT_AUDIT.md`, `docs/AI_STEP_VERIFICATION_CHECKLIST.md`, `docs/CONTEXT.md`, and relevant architecture/planning docs. Update only the files affected by the new change. If no updates are needed, state why in the final summary.
   Keep proposal phase metadata and the active-change inverse row identical, then run `roadmap-openspec-validator`.

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- What's ready: "All artifacts created! Ready for implementation."
- Prompt: "Ask me to apply the change (openspec-apply-change skill) to start working on the tasks."

**Artifact Creation Guidelines**

- Follow the `instruction` field from `openspec instructions` for each artifact type
- The schema defines what each artifact should contain - follow it
- Read dependency artifacts for context before creating new ones
- Use `template` as the structure for your output file - fill in its sections
- **IMPORTANT**: `context` and `rules` are constraints for YOU, not content for the file
  - Do NOT copy `<context>`, `<rules>`, `<project_context>` blocks into the artifact
  - These guide what you write, but should never appear in the output

**Guardrails**
- Create ALL artifacts needed for implementation (as defined by schema's `apply.requires`)
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user - but prefer making reasonable decisions to keep momentum
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next
- Do not finish after changing OpenSpec artifacts without checking related docs for stale state, contradictions, and duplicate rules
