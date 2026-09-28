# Global Codex rules

`AGENTS.md` is the version-controlled source for the global rules installed at
`~/.codex/AGENTS.md`. The repository itself is installed at `~/.codex/skills`.

On Windows, update skills and install global rules together with:

```powershell
& "$HOME/.codex/skills/sync-global-rules.ps1"
```

The script pulls `origin/main` using fast-forward only, copies the rules into
Codex home, and verifies the content. It stops before pulling if the installed
rules contain changes absent from both the current repository copy and its
committed version. Reconcile those changes before running it again.

Edit `global-rules/AGENTS.md`, commit and push intentional changes, then run the
script to install them. A plain `git pull` updates the repository copy only;
run the script to update the active global rules too. This installation uses
a regular file because creating Windows symbolic links requires privileges
that may be unavailable.
