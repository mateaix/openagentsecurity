import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("skills", () => {
  it("declare source guidance, defensive boundaries, and required output", async () => {
    const files = (await readdir(join(process.cwd(), "skills")))
      .filter((file) => file.endsWith(".md"))
      .sort();

    expect(files).toEqual(["evidence.md", "invariants.md", "review.md"]);

    for (const file of files) {
      const body = await readFile(join(process.cwd(), "skills", file), "utf8");
      expect(body).toContain("## Source Guidance");
      expect(body).toContain("## Defensive Boundary");
      expect(body).toContain("## Required Output");
      expect(body).toMatch(/OWASP|NIST|CISA|MITRE|OpenSSF|SLSA/);
    }
  });
});
