# OpenAgentSecurity

Use OpenAgentSecurity when reviewing AI-generated code changes, security-sensitive diffs, required evidence, or merge gate decisions.

---
name: openagentsecurity-evidence
description: Convert security risk into required verification evidence.
---

# OpenAgentSecurity Evidence

Use this skill after a security-sensitive change is identified. The goal is to
turn risk into proof that a reviewer, CI job, or release manager can verify.

## Source Guidance

Use NIST SSDF SP 800-218 for verification and release evidence, OWASP ASVS
5.0.0 for application security checks, OWASP Agentic AI and MCP guidance for
agent/tool evidence, CISA/NSA/Five Eyes AI deployment guidance for approval and
monitoring evidence, OpenSSF Scorecard for repository security, and SLSA for
build provenance and CI/CD integrity.

## Defensive Boundary

Evidence must be safe and reviewable. Do not request offensive exploitation,
credential collection, destructive tests, or unbounded scanning. Prefer bounded
unit tests, integration tests, policy checks, scanner summaries, audit logs, and
human approval records.

## Evidence Quality

Treat evidence as stronger in this order:

1. Automated regression test tied to the changed security invariant.
2. CI or scanner output with command, timestamp, and result.
3. Reviewable audit log or policy decision record.
4. Manual reviewer attestation with scope and date.
5. Unchecked prose claim.

Only `pass` and `provided` satisfy a gate. `missing`, `fail`, and `unknown` do
not satisfy required evidence.

## Workflow

1. Read matched rules and affected invariants.
2. List every required evidence ID.
3. For each evidence item, define the expected proof artifact.
4. Separate automated evidence from manual evidence.
5. If evidence is absent or too vague, mark it missing.
6. If a high-risk change lacks required evidence, recommend `fail` or `block`.

## Required Output

Return:

- Required evidence IDs
- Evidence type: automated, scanner, audit-log, manual-review, or approval
- Current status: `pass`, `provided`, `missing`, `fail`, or `unknown`
- Missing evidence list
- Gate recommendation
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
