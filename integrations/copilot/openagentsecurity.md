# OpenAgentSecurity

Use OpenAgentSecurity when reviewing AI-generated code changes, security-sensitive diffs, required evidence, or merge gate decisions.

---
name: openagentsecurity-evidence
description: Convert security risk into required verification evidence.
---

# OpenAgentSecurity Evidence

Use this skill after a security-sensitive change is identified.

## Workflow

1. Map each risk to required evidence from matching rules.
2. Prefer executable tests, CI logs, and scanner output over unchecked claims.
3. Mark manual evidence separately from automated evidence.
4. Block only when policy requires evidence and the evidence is missing.

## Evidence Types

- Automated test result
- Security scanner output
- Dependency audit result
- Manual verification note
- Reviewer approval
---
name: openagentsecurity-invariants
description: Check whether a code change may break project security invariants.
---

# OpenAgentSecurity Invariants

Use this skill when a repository defines security invariants in `.oas/invariants.yml`.

## Workflow

1. Read project invariants.
2. Match changed paths and symbols to invariant scope.
3. Decide whether the change could weaken an invariant.
4. Require evidence that the invariant still holds.

## Examples

- Admin APIs require an admin role.
- Tenant A cannot read tenant B data.
- Session cookies remain HttpOnly and Secure.
- Agent tools cannot gain shell or filesystem access without review.
---
name: openagentsecurity-review
description: Review security-sensitive code changes before merge.
---

# OpenAgentSecurity Review

Use this skill when reviewing code produced or modified by an AI coding agent.

## Workflow

1. Inspect the diff, not only the final files.
2. Match changed files and symbols against OpenAgentSecurity rules.
3. Identify security-sensitive changes in authentication, authorization,
   secrets, dependencies, CI/CD, MCP tools, and agent permissions.
4. Produce a concise risk summary with rule IDs and required evidence.
5. Do not provide exploit instructions or offensive payloads.

## Output

- Risk: low, medium, high, or block
- Matched rules
- Files requiring human review
- Required verification evidence
- Merge recommendation
