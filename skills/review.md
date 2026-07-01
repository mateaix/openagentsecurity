---
name: openagentsecurity-review
description: Review security-sensitive AI-generated code changes before merge.
---

# OpenAgentSecurity Review

Use this skill when reviewing code produced or modified by an AI coding agent,
especially when the diff touches authentication, authorization, secrets,
dependencies, CI/CD, MCP tools, agent permissions, or runtime autonomy.

## Source Guidance

Base the review on the project rules and these public guidance families:

- OWASP ASVS 5.0.0 for application security verification.
- OWASP Secure Coding Practices for secure code review patterns.
- OWASP Top 10 for LLM Applications and OWASP Agentic AI guidance for prompt,
  tool-use, autonomy, and data exposure risks.
- OWASP MCP security guidance for MCP server/tool trust boundaries.
- MITRE CWE for weakness taxonomy and explainable risk labels.
- NIST SSDF SP 800-218 for secure development, verification, and release gates.
- CISA/NSA/Five Eyes AI deployment guidance for human oversight, logging, and
  secure configuration of agentic systems.
- OpenSSF Scorecard and SLSA for dependency, CI/CD, and build integrity risks.

## Defensive Boundary

This skill is defensive. Do not generate exploit payloads, step-by-step attack
chains, bypass instructions, credential harvesting guidance, or offensive test
commands. When a risk needs validation, describe safe verification evidence,
bounded regression tests, configuration checks, or human review tasks.

## Review Workflow

1. Inspect the diff first. Do not judge only the final files.
2. Match changed files, symbols, configuration keys, and added lines against
   OpenAgentSecurity rules.
3. Classify each match by the changed security boundary:
   - identity and authentication
   - authorization and tenant isolation
   - secret handling and data exposure
   - injection and unsafe deserialization
   - dependency, CI/CD, and build integrity
   - MCP tool permission and agent autonomy
   - logging, approvals, and evidence trails
4. For agentic changes, check whether the PR grants new shell, filesystem,
   browser, network, MCP, or external API access.
5. For high-impact changes, check whether explicit human approval remains
   required before merge, deployment, destructive actions, or external calls.
6. Prefer concrete evidence requirements over broad advice.
7. Mark "block" only when the change is high risk and required evidence is
   missing or the security invariant is visibly weakened.

## Required Output

Return a concise report with:

- Risk: `low`, `medium`, `high`, or `block`
- Matched rule IDs and source families
- Security-sensitive files requiring human review
- Security invariants that may be affected
- Required evidence IDs
- Merge recommendation: `pass`, `warn`, `fail`, or `block`

