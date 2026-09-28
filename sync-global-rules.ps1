$ErrorActionPreference = 'Stop'

# This repository is installed at <Codex home>/skills.
$repository = $PSScriptRoot
$source = Join-Path $repository 'global-rules/AGENTS.md'
$destination = Join-Path (Split-Path $repository -Parent) 'AGENTS.md'

function Normalize-Text([string] $value) {
    return ($value -replace "`r`n", "`n").TrimEnd("`r", "`n")
}

$previous = & git -C $repository show HEAD:global-rules/AGENTS.md
if ($LASTEXITCODE -ne 0) { throw 'Cannot read the committed global rules.' }
$previousText = Normalize-Text ($previous -join "`n")
$sourceText = Normalize-Text ([System.IO.File]::ReadAllText($source))
if (Test-Path -LiteralPath $destination) {
    $localText = Normalize-Text ([System.IO.File]::ReadAllText($destination))
    if ($localText -cne $previousText -and $localText -cne $sourceText) {
        throw 'Global AGENTS.md has local changes. Reconcile them with global-rules/AGENTS.md before syncing.'
    }
}

& git -C $repository pull --ff-only origin main
if ($LASTEXITCODE -ne 0) { throw 'Git update failed; global AGENTS.md was not replaced.' }

Copy-Item -LiteralPath $source -Destination $destination -Force
if ((Get-FileHash -LiteralPath $source).Hash -ne (Get-FileHash -LiteralPath $destination).Hash) {
    throw 'Global rules verification failed.'
}
Write-Output 'Skills updated; global AGENTS.md matches the repository copy.'
