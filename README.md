# OpenAgentSecurity

`oas` is a security gate for AI-generated code changes.

OpenAgentSecurity turns authoritative security guidance into agent skills,
pull request risk checks, required verification evidence, and merge gates.

It is not another generic AI code reviewer. It focuses on security-sensitive
changes made by coding agents before they are merged.

## Goals

- Bring security review workflows into Codex, Claude Code, Cursor, Windsurf,
  Copilot, and other agentic coding tools.
- Keep security rules traceable to public sources such as OWASP, MITRE, NIST,
  CISA, OpenSSF, and SLSA.
- Convert pull request risk into concrete verification evidence.
- Fail CI only when policy says risk or missing evidence should block merge.

## Early Scope

- Security change review for PR diffs.
- Security invariants for auth, access control, secrets, dependencies, CI/CD,
  MCP tools, and agent permissions.
- Skills and rules that can be compiled into multiple agent tool formats.
- A future `oas` CLI for initialization, scanning, reporting, and gating.

## Planned Commands

```bash
oas init
oas init --tool cursor
oas compile --tool all
oas scan --base main
oas gate --fail-on high
```

## Repository Layout

```txt
standards/      Public security source registry and mappings
rules/          Executable rule definitions derived from standards
skills/         Agent-facing security workflows
agents/         Multi-agent role definitions
integrations/   Generated tool-specific skill/rule formats
templates/      Project policy, invariant, evidence, and CI templates
examples/       Minimal reference projects and workflows
```

## Compliance First

OpenAgentSecurity should not copy long passages from standards into prompts or
rules. Rules should reference source IDs, URLs, versions, and licenses, then
express original verification logic in project-owned wording.

