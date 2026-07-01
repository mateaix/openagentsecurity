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

