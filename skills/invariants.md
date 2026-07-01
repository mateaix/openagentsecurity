---
name: openagentsecurity-invariants
description: Check whether a code change may break project security invariants.
---

# OpenAgentSecurity Invariants

Use this skill when a repository defines security invariants in
`.oas/invariants.yml`, or when a diff touches a security boundary that should be
treated as invariant even if the project has not configured it yet.

## Source Guidance

Use OWASP ASVS 5.0.0 for application security invariants, OWASP Secure Coding
Practices for implementation checks, MITRE CWE for weakness mapping, OWASP LLM
and Agentic AI guidance for model/tool boundaries, OWASP MCP guidance for MCP
server and tool trust boundaries, NIST AI RMF for governance expectations, and
CISA/NSA/Five Eyes guidance for oversight, monitoring, and secure deployment.

## Defensive Boundary

Do not prove invariant weakness by giving exploitation instructions. Express the
concern as a violated assumption, a safe regression test, or a required review
artifact. Keep validation scoped to the repository and approved test systems.

## Default Invariants

When the project has no explicit invariant, infer these defaults:

- Admin APIs require an admin role.
- Users cannot access another tenant's data.
- Protected endpoints require authentication.
- Session cookies remain HttpOnly, Secure, and SameSite-protected.
- Secrets are not committed and come from managed secret sources.
- Dependency and CI/CD changes preserve build integrity.
- Agent tools are least-privilege.
- Shell, filesystem, browser, network, and MCP tool access require review.
- High-impact agent actions require human approval.
- Agent tool calls and approval decisions are logged.

## Workflow

1. Read `.oas/invariants.yml` when present.
2. Match changed paths and added lines to invariant scope.
3. Decide whether the diff could weaken the invariant.
4. Map the invariant to required evidence IDs.
5. If an invariant is weakened or evidence is missing, recommend `fail` or
   `block` according to policy.

## Required Output

Return:

- Affected invariant IDs
- Whether each invariant is preserved, uncertain, or weakened
- Required evidence IDs
- Files and lines needing human review
- Gate recommendation

