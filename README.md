# OpenAgentSecurity

`oas` is a security gate for AI-generated code changes.

OpenAgentSecurity turns authoritative security guidance into agent skills,
pull request risk checks, required verification evidence, and merge gates.

It is not another generic AI code reviewer. It focuses on one release-critical
question:

> This AI-generated change touches security-sensitive code. What must be proven
> before it can merge?

## Why This Exists

Coding agents can now change authentication, authorization, dependencies,
CI/CD, MCP tools, and agent permissions faster than teams can review them.
Traditional scanners are still useful, but they usually answer "did this match
a known pattern?" OpenAgentSecurity answers "does this change require security
evidence before merge?"

## What v0.1.0 Does

- Scans git diffs or PR diff files.
- Matches security-sensitive changes against YAML rules.
- Produces Markdown or JSON reports.
- Requires evidence for high-risk changes.
- Provides a CI-friendly merge gate.
- Initializes `.oas/` policy files in a project.
- Compiles source skills into Codex, Cursor, Claude Code, Windsurf, and Copilot
  integration files.

## Install

From source:

```bash
git clone https://github.com/mateaix/openagentsecurity.git
cd openagentsecurity
npm install
npm run build
```

Run locally:

```bash
node dist/cli.js --help
```

After npm publishing, the intended command is:

```bash
npx @openagentsecurity/oas --help
```

## Quick Start

Scan the included example diff:

```bash
npm run build
node dist/cli.js scan --diff examples/minimal/pr.diff --format markdown
```

Generate a JSON report:

```bash
node dist/cli.js scan \
  --diff examples/minimal/pr.diff \
  --format json \
  --out .oas/report.json
```

Run the merge gate without evidence:

```bash
node dist/cli.js gate --report .oas/report.json
```

Expected result: the gate fails because the example changes an admin API and
does not provide required access-control evidence.

Run the merge gate with passing evidence:

```bash
node dist/cli.js gate \
  --report .oas/report.json \
  --evidence examples/minimal/evidence-pass.yml
```

Expected result: the gate passes.

## CLI

```bash
oas init
oas init --github-action
oas compile --tool all
oas scan --base main
oas scan --diff pr.diff --format json --out .oas/report.json
oas gate --report .oas/report.json --evidence .oas/evidence.yml --fail-on high
```

### `oas init`

Initializes project-local OpenAgentSecurity config:

```txt
.oas/
  policy.yml
  invariants.yml
  evidence.yml
```

Use `--github-action` to also create:

```txt
.github/workflows/oas.yml
```

Existing files are not overwritten unless `--force` is passed.

### `oas compile`

Compiles source skills into tool-specific formats:

```txt
integrations/
  codex/openagentsecurity/SKILL.md
  cursor/rules/oas.mdc
  claude-code/openagentsecurity.md
  windsurf/.windsurfrules
  copilot/openagentsecurity.md
```

### `oas scan`

Reads a diff, matches security rules, and writes a report.

Inputs:

- `--base <ref>`: run `git diff <ref>...HEAD`
- `--diff <file>`: scan an existing diff file
- `--rules <dir>`: override the built-in rules directory
- `--format markdown|json`
- `--out <file>`

### `oas gate`

Evaluates a JSON report and optional evidence file.

Evidence statuses that satisfy the gate:

- `pass`
- `provided`

Example:

```yaml
version: 0.1.0
evidence:
  non-admin-access-denied:
    status: pass
  cross-tenant-access-denied:
    status: provided
```

## GitHub Action

The repository includes a composite action entry point:

```yaml
name: OpenAgentSecurity

on:
  pull_request:

jobs:
  oas:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: mateaix/openagentsecurity@v0.1.0
        with:
          base: origin/main
          fail-on: high
          evidence: .oas/evidence.yml
```

## Rule Model

Rules are YAML files derived from public security guidance. Each rule declares:

- source references
- risk level
- path and keyword triggers
- required evidence
- gate behavior

Example:

```yaml
id: oas.access-control
title: Access control change review
sources:
  - owasp.asvs
  - owasp.secure-coding
  - mitre.cwe
risk: high
triggers:
  paths:
    - "src/**/admin/**"
  keywords:
    - role
    - permission
    - tenant
requiredEvidence:
  - non-admin-access-denied
  - cross-tenant-access-denied
gate:
  failOnMissingEvidence: true
```

## Compliance First

OpenAgentSecurity should not copy long passages from standards into prompts or
rules. Rules should reference source IDs, URLs, versions, and licenses, then
express original verification logic in project-owned wording.

Current public source registry includes OWASP, MITRE, NIST, CISA, OpenSSF, and
SLSA mappings in `standards/registry.yml`.

## Repository Layout

```txt
standards/      Public security source registry and mappings
rules/          Executable rule definitions derived from standards
skills/         Agent-facing security workflows
agents/         Multi-agent role definitions
integrations/   Generated tool-specific skill/rule formats
src/            TypeScript CLI and core runtime
templates/      Project policy, invariant, evidence, and CI templates
examples/       Minimal reference projects and workflows
```

## v0.1.0 Boundary

This release is intentionally small:

- No SaaS backend
- No account system
- No exploit generation
- No model dependency
- No automatic code modification

The first release proves the workflow: security-sensitive diff in, required
evidence and merge decision out.

