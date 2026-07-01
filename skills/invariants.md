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

