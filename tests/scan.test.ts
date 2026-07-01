import { describe, expect, it } from "vitest";
import { scanDiff } from "../src/core/scan.js";
import type { SecurityRule } from "../src/core/types.js";

const rules: SecurityRule[] = [
  {
    id: "oas.access-control",
    title: "Access control change review",
    sources: ["owasp.asvs", "mitre.cwe"],
    risk: "high",
    triggers: {
      paths: ["src/**/admin/**"],
      keywords: ["admin", "permission"],
    },
    requiredEvidence: ["non-admin-access-denied"],
    gate: { failOnMissingEvidence: true },
  },
  {
    id: "oas.dependencies",
    title: "Dependency and supply chain change review",
    sources: ["openssf.scorecard"],
    risk: "medium",
    triggers: {
      paths: ["package.json"],
      keywords: ["postinstall"],
    },
    requiredEvidence: ["dependency-audit-reviewed"],
    gate: { failOnMissingEvidence: false },
  },
];

describe("scanDiff", () => {
  it("matches security-sensitive paths and returns required evidence", () => {
    const diff = `diff --git a/src/api/admin/users.ts b/src/api/admin/users.ts
index 1111111..2222222 100644
--- a/src/api/admin/users.ts
+++ b/src/api/admin/users.ts
@@ -1,3 +1,4 @@
 export function listUsers(request) {
+  // admin permission changed
   return db.users.findMany();
 }
`;

    const result = scanDiff(diff, rules);

    expect(result.risk).toBe("high");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]?.ruleId).toBe("oas.access-control");
    expect(result.requiredEvidence).toEqual(["non-admin-access-denied"]);
    expect(result.gate.shouldFail).toBe(true);
  });

  it("keeps non-blocking medium dependency changes as warnings", () => {
    const diff = `diff --git a/package.json b/package.json
index 1111111..2222222 100644
--- a/package.json
+++ b/package.json
@@ -4,6 +4,7 @@
   "scripts": {
+    "postinstall": "node scripts/setup.js"
   }
 }
`;

    const result = scanDiff(diff, rules);

    expect(result.risk).toBe("medium");
    expect(result.requiredEvidence).toEqual(["dependency-audit-reviewed"]);
    expect(result.gate.shouldFail).toBe(false);
  });
});

