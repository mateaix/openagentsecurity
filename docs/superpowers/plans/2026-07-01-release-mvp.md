# OpenAgentSecurity v0.1.0 Release MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a usable v0.1.0 MVP with a polished README, working CLI scan/gate/init/compile commands, examples, and release metadata.

**Architecture:** Keep the runtime small and file-based. Rules, skills, and templates remain source assets; the CLI loads local files, produces reports, compiles integrations, and initializes project config without a server.

**Tech Stack:** TypeScript, Node.js 20+, commander, yaml, minimatch, vitest.

---

### Task 1: Evidence-Aware Gate

**Files:**
- Create: `src/core/evidence.ts`
- Modify: `src/cli.ts`
- Test: `tests/evidence.test.ts`

- [ ] Write failing tests for `loadEvidenceStatus` and `evaluateGate`.
- [ ] Run `npm test` and confirm evidence tests fail because the module is missing.
- [ ] Implement YAML evidence loading and gate evaluation.
- [ ] Run `npm test` and confirm all tests pass.

### Task 2: Integration Compiler

**Files:**
- Create: `src/core/compile.ts`
- Modify: `src/cli.ts`
- Test: `tests/compile.test.ts`

- [ ] Write failing tests for generating Cursor, Codex, Claude Code, Windsurf, and Copilot integration files.
- [ ] Run `npm test` and confirm compile tests fail because the module is missing.
- [ ] Implement deterministic integration generation from `skills/*.md`.
- [ ] Run `npm test` and confirm all tests pass.

### Task 3: Project Initializer

**Files:**
- Create: `src/core/init.ts`
- Modify: `src/cli.ts`
- Test: `tests/init.test.ts`

- [ ] Write failing tests for copying `.oas/policy.yml`, `.oas/invariants.yml`, `.oas/evidence.yml`, and `.github/workflows/oas.yml`.
- [ ] Run `npm test` and confirm init tests fail because the module is missing.
- [ ] Implement no-overwrite-by-default initialization with `force` support.
- [ ] Run `npm test` and confirm all tests pass.

### Task 4: Release Docs

**Files:**
- Modify: `README.md`
- Create: `CHANGELOG.md`
- Create: `action.yml`
- Modify: `examples/minimal/README.md`

- [ ] Document the product positioning, install path, commands, evidence workflow, integrations, and compliance model.
- [ ] Add v0.1.0 changelog.
- [ ] Add a composite GitHub Action entry point for repository users.
- [ ] Run `npm test`, `npm run typecheck`, `npm run build`, YAML parse, example scan, and example gate.

