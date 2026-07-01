import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { compileIntegrations } from "../src/core/compile.js";

describe("compileIntegrations", () => {
  it("generates tool-specific files from source skills", async () => {
    const dir = await mkdtemp(join(tmpdir(), "oas-compile-"));

    const result = await compileIntegrations({
      rootDir: process.cwd(),
      outDir: dir,
      tools: ["cursor", "codex", "claude-code", "windsurf", "copilot"],
    });

    expect(result.files).toEqual(
      expect.arrayContaining([
        join(dir, "cursor/rules/oas.mdc"),
        join(dir, "codex/openagentsecurity/SKILL.md"),
        join(dir, "claude-code/openagentsecurity.md"),
        join(dir, "windsurf/.windsurfrules"),
        join(dir, "copilot/openagentsecurity.md"),
      ]),
    );

    await expect(readFile(join(dir, "cursor/rules/oas.mdc"), "utf8")).resolves.toContain(
      "OpenAgentSecurity",
    );
  });
});

