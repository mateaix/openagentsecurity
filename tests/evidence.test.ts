import { mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { evaluateGate, loadEvidenceStatus } from "../src/core/evidence.js";
import type { ScanResult } from "../src/core/types.js";

const highRiskReport: ScanResult = {
  risk: "high",
  files: [],
  matches: [],
  requiredEvidence: ["non-admin-access-denied", "cross-tenant-access-denied"],
  gate: {
    shouldFail: true,
    reasons: ["oas.access-control requires evidence"],
  },
};

describe("evidence gate", () => {
  it("loads passing evidence statuses from yaml", async () => {
    const dir = await mkdtemp(join(tmpdir(), "oas-evidence-"));
    const file = join(dir, "evidence.yml");
    await writeFile(
      file,
      `version: 0.1.0
evidence:
  non-admin-access-denied:
    status: pass
  cross-tenant-access-denied:
    status: provided
`,
    );

    await expect(loadEvidenceStatus(file)).resolves.toEqual({
      "non-admin-access-denied": "pass",
      "cross-tenant-access-denied": "provided",
    });
  });

  it("passes high risk reports when all required evidence is present", () => {
    const gate = evaluateGate(highRiskReport, {
      failOn: "high",
      evidence: {
        "non-admin-access-denied": "pass",
        "cross-tenant-access-denied": "provided",
      },
    });

    expect(gate.shouldFail).toBe(false);
    expect(gate.missingEvidence).toEqual([]);
  });

  it("fails when required evidence is missing", () => {
    const gate = evaluateGate(highRiskReport, {
      failOn: "high",
      evidence: {
        "non-admin-access-denied": "pass",
      },
    });

    expect(gate.shouldFail).toBe(true);
    expect(gate.missingEvidence).toEqual(["cross-tenant-access-denied"]);
  });
});

