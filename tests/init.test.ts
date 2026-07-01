import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { initProject } from "../src/core/init.js";

describe("initProject", () => {
  it("copies OAS templates into a project", async () => {
    const projectDir = await mkdtemp(join(tmpdir(), "oas-init-"));

    const result = await initProject({
      sourceRoot: process.cwd(),
      projectDir,
      force: false,
      includeGithubAction: true,
    });

    expect(result.created).toEqual(
      expect.arrayContaining([
        join(projectDir, ".oas/policy.yml"),
        join(projectDir, ".oas/invariants.yml"),
        join(projectDir, ".oas/evidence.yml"),
        join(projectDir, ".github/workflows/oas.yml"),
      ]),
    );
    await expect(readFile(join(projectDir, ".oas/policy.yml"), "utf8")).resolves.toContain(
      "failOn",
    );
  });

  it("does not overwrite existing files unless force is true", async () => {
    const projectDir = await mkdtemp(join(tmpdir(), "oas-init-"));
    const policyFile = join(projectDir, ".oas/policy.yml");
    await initProject({ sourceRoot: process.cwd(), projectDir, force: false });
    await writeFile(policyFile, "custom: true\n");

    const result = await initProject({ sourceRoot: process.cwd(), projectDir, force: false });

    expect(result.skipped).toContain(policyFile);
    await expect(readFile(policyFile, "utf8")).resolves.toBe("custom: true\n");
  });
});

