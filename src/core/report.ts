import type { ScanResult } from "./types.js";

export function toMarkdown(result: ScanResult): string {
  const lines = [
    "## OpenAgentSecurity Report",
    "",
    `Risk: ${result.risk.toUpperCase()}`,
    "",
    "### Security-sensitive changes",
  ];

  if (result.matches.length === 0) {
    lines.push("", "No security-sensitive changes matched the current rules.");
  } else {
    for (const match of result.matches) {
      lines.push(
        "",
        `- ${match.path}`,
        `  - Rule: ${match.ruleId}`,
        `  - Risk: ${match.risk}`,
        `  - Evidence: ${match.requiredEvidence.join(", ") || "none"}`,
      );
    }
  }

  lines.push("", "### Required evidence");
  if (result.requiredEvidence.length === 0) {
    lines.push("", "No required evidence.");
  } else {
    for (const evidence of result.requiredEvidence) lines.push(`- [ ] ${evidence}`);
  }

  lines.push("", "### Merge gate", "", result.gate.shouldFail ? "FAILED" : "PASSED");
  for (const reason of result.gate.reasons) lines.push(`- ${reason}`);

  return `${lines.join("\n")}\n`;
}

export function toJson(result: ScanResult): string {
  return `${JSON.stringify(result, null, 2)}\n`;
}

