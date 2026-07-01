import { readFile } from "node:fs/promises";
import YAML from "yaml";
import type { ScanResult } from "./types.js";

export type EvidenceStatus = "pass" | "provided" | "fail" | "missing" | "unknown";
export type EvidenceStatusMap = Record<string, EvidenceStatus>;

export interface GateEvaluation {
  shouldFail: boolean;
  risk: string;
  missingEvidence: string[];
  reasons: string[];
}

export async function loadEvidenceStatus(file: string): Promise<EvidenceStatusMap> {
  const raw = await readFile(file, "utf8");
  const parsed = YAML.parse(raw) as {
    evidence?: Record<string, EvidenceStatus | { status?: EvidenceStatus }>;
  };
  const evidence = parsed.evidence ?? {};
  const statuses: EvidenceStatusMap = {};

  for (const [id, value] of Object.entries(evidence)) {
    statuses[id] = typeof value === "string" ? value : value.status ?? "unknown";
  }

  return statuses;
}

export function evaluateGate(
  report: ScanResult,
  options: { failOn: string; evidence?: EvidenceStatusMap },
): GateEvaluation {
  const evidence = options.evidence ?? {};
  const missingEvidence = report.requiredEvidence.filter((id) => !isPassingEvidence(evidence[id]));
  const riskRequiresGate = riskAtLeast(report.risk, options.failOn);
  const shouldFail = riskRequiresGate && missingEvidence.length > 0;
  const reasons = shouldFail
    ? [`missing required evidence: ${missingEvidence.join(", ")}`]
    : [];

  return {
    shouldFail,
    risk: report.risk,
    missingEvidence,
    reasons,
  };
}

function isPassingEvidence(status: EvidenceStatus | undefined): boolean {
  return status === "pass" || status === "provided";
}

function riskAtLeast(actual: string, threshold: string): boolean {
  const rank: Record<string, number> = { none: 0, low: 1, medium: 2, high: 3, block: 4 };
  return (rank[actual] ?? 0) >= (rank[threshold] ?? 3);
}

