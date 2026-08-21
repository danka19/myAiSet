# Bootstrap Workflow Reference

Use this reference when customizing a generated project starter beyond the default script.

## What To Fill First

1. Product summary and first valuable workflow in `docs/README.md`.
2. Current phase and gate in `docs/ROADMAP.md`.
3. Environment evidence and open risks in `docs/CURRENT_PROJECT_AUDIT.md`.
4. Domain terms and boundaries in `docs/CONTEXT.md`.
5. OpenSpec/SDD expectations and any known accepted requirements or proposed changes.
6. Project-specific safety, language, commit, branch, and reporting rules in `AGENTS.md`.
7. Phase change-intake routing rules when the project will use roadmap phases.

## What Not To Guess

- Customer or user commitments.
- Architecture decisions that have not been accepted.
- Production deployment shape.
- Security posture.
- Data-source rights.
- Quality or acceptance metrics without verification evidence.
- OpenSpec requirements, acceptance scenarios, or data contracts not supported by user decisions or repository evidence.

## Good First Manual Check

After generation, open `AGENTS.md` and confirm that a future Codex session can answer:

- which docs to read first;
- what branch to use;
- what must be verified before completion;
- where human decisions are recorded;
- where accepted and proposed behavior should live when OpenSpec applies;
- how new ideas during active phase work are routed before changing scope;
- what must never be committed;
- how phase planning and execution should work;
- what final reports must include, especially decisions, important details, manual-verification risk, and next steps.
