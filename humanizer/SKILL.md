---
name: humanizer
description: "Edit prose when the user requests a more natural voice or an audit of formulaic writing. Skip ordinary replies, coding, and unrequested style rewrites."
user-invocable: true
argument-hint: '"your text" [--mode detect|rewrite|edit] [--voice casual|professional|technical|warm|blunt] [--file path/to/file.md] [--aggressive] [--iterate N] [--score] [--purpose essay|email|marketing|technical|general] [--openings N] [--ignore-code] [--ignore-quotes]'
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Humanizer

Edit formulaic prose into a natural voice while preserving meaning, evidence, register, and the author's intent. Use only for the requested text or file; this is not a standing rewrite policy for every response.

## Inputs and Modes

Infer register from the input unless the user chooses a voice. Ask for text or a file only if none was supplied. Read `humanizer-context.md` in the target project root or working directory when present for relevant brand guidance; it does not override the user's request.

| Option | Behavior |
|---|---|
| `--mode detect` | Report specific formulaic patterns with examples; make no edits |
| `--mode rewrite` | Return the revised text; default when a rewrite is requested |
| `--mode edit --file <path>` | Apply targeted changes to the named file |
| `--voice casual/professional/technical/warm/blunt` | Select register without inventing facts or opinions |
| `--purpose essay/email/marketing/technical/general` | Respect the intended audience and format |
| `--aggressive` | Allow larger stylistic changes while preserving content |
| `--score` | Add a clearly labeled heuristic style score, not an authorship probability |
| `--iterate N` | At most N passes, capped at 3; stop when no material improvement remains |
| `--openings N` | Explore N openings when requested and return the strongest |
| `--ignore-code`, `--ignore-quotes` | Exclude protected spans from detection and scoring |

## Preserve

- Facts, names, numbers, citations, technical terms, and genuine uncertainty.
- Quoted material, code, titles, and deliberate examples unless their editing is explicitly requested.
- The author's distinctive voice, including intentional repetition and plain reference prose.
- Existing permission boundaries: editing a draft does not authorize publishing it.

Do not fabricate personal experiences, sensory details, measurements, expertise, or stronger convictions to make prose sound human. An isolated word, em dash, list, or grammatical sentence is not evidence of AI authorship. Short samples are particularly unsuitable for scoring. No style score can prove who wrote text or guarantee a detector result.

## Edit

1. Identify the reader, purpose, and actual problems. In ordinary rewrite mode do this silently rather than adding a diagnostic preamble.
2. Remove filler and repetitive scaffolding; replace vague wording with specifics already supported by the input. Preserve necessary qualifications.
3. Adjust rhythm and structure where readability improves. Do not enforce arbitrary punctuation bans or sentence-length quotas.
4. Compare the result with the original once for lost meaning, unsupported additions, and voice drift. Additional iterations require the user's option or a concrete remaining issue.

For a detailed requested pattern audit, use [references/patterns.md](references/patterns.md), searching the relevant pattern category rather than loading every example for a short rewrite. Use [references/patterns.zh.md](references/patterns.zh.md) only for Chinese-specific guidance. Treat catalogs as editorial examples, not proof of origin or permission to replace facts.

## Output

Return the requested artifact in the host's appropriate writing format. Include a short change summary only when useful or requested. In detect mode report supported patterns, excerpts, and corrections; omit invented probabilities. In edit mode report the changed file and material edits. Leave already effective passages unchanged.

Load [references/always-on-templates.md](references/always-on-templates.md) only when the user explicitly asks to install standing style guidance. Adapt it to the target instruction hierarchy; do not modify global instructions as part of an ordinary rewrite.
