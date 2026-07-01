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

