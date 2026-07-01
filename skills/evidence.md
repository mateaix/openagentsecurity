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

