# Changelog

## Unreleased

- Refined source skills with explicit source guidance, defensive boundaries,
  required output sections, and agentic AI/MCP review workflows.
- Added `oas.agentic-tooling` rule for agent permissions, autonomy, approval
  boundaries, shell/filesystem/network/browser access, and tool-call logging.
- Expanded the standards registry with OWASP Agentic AI, OWASP MCP guidance,
  NIST AI RMF, and CISA/NSA/Five Eyes AI deployment guidance references.
- Expanded evidence and invariant templates for agent tool permissions, human
  approval boundaries, and action logging.

## 0.1.0 - 2026-07-01

Initial MVP release.

- Added `oas scan` for diff-based security rule matching.
- Added `oas gate` for evidence-aware merge gate evaluation.
- Added `oas init` for project-local `.oas` configuration.
- Added `oas compile` for Codex, Cursor, Claude Code, Windsurf, and Copilot integrations.
- Added public security source registry and initial rules for access control,
  auth/session, secrets, dependencies, and MCP tools.
- Added minimal example diff and evidence workflow.
- Added composite GitHub Action metadata.
