import { minimatch } from "minimatch";
import { parseDiff } from "./diff.js";
import type { ChangedFile, RiskLevel, RuleMatch, ScanResult, SecurityRule } from "./types.js";

const riskRank: Record<RiskLevel, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  block: 4,
};

export function scanDiff(diff: string, rules: SecurityRule[]): ScanResult {
  const files = parseDiff(diff);
  const matches = files.flatMap((file) => matchFile(file, rules));
  const requiredEvidence = unique(matches.flatMap((match) => match.requiredEvidence));
  const risk = matches.reduce<RiskLevel>(
    (highest, match) => (riskRank[match.risk] > riskRank[highest] ? match.risk : highest),
    "none",
  );
  const blockingMatches = matches.filter((match) => match.failOnMissingEvidence);

  return {
    risk,
    files,
    matches,
    requiredEvidence,
    gate: {
      shouldFail: blockingMatches.some((match) => match.risk === "high" || match.risk === "block"),
      reasons: blockingMatches.map(
        (match) => `${match.ruleId} requires evidence: ${match.requiredEvidence.join(", ")}`,
      ),
    },
  };
}

function matchFile(file: ChangedFile, rules: SecurityRule[]): RuleMatch[] {
  return rules.flatMap((rule) => {
    const reasons: string[] = [];
    const pathPatterns = rule.triggers.paths ?? [];
    const keywords = rule.triggers.keywords ?? [];
    const pathMatched = pathPatterns.some((pattern) => minimatch(file.path, pattern, { dot: true }));

    if (pathMatched) reasons.push(`path matched ${pathPatterns.join(", ")}`);

    const additions = file.additions.join("\n").toLowerCase();
    const matchedKeywords = keywords.filter((keyword) => additions.includes(keyword.toLowerCase()));
    if (matchedKeywords.length > 0) reasons.push(`keywords matched ${matchedKeywords.join(", ")}`);

    if (!pathMatched && matchedKeywords.length === 0) return [];

    return [
      {
        ruleId: rule.id,
        title: rule.title,
        risk: rule.risk,
        path: file.path,
        reasons,
        requiredEvidence: rule.requiredEvidence,
        failOnMissingEvidence: rule.gate?.failOnMissingEvidence ?? false,
      },
    ];
  });
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

