export type RiskLevel = "none" | "low" | "medium" | "high" | "block";

export interface RuleTriggers {
  paths?: string[];
  keywords?: string[];
}

export interface SecurityRule {
  id: string;
  title: string;
  sources: string[];
  risk: Exclude<RiskLevel, "none">;
  triggers: RuleTriggers;
  requiredEvidence: string[];
  gate?: {
    failOnMissingEvidence?: boolean;
  };
}

export interface ChangedFile {
  path: string;
  additions: string[];
}

export interface RuleMatch {
  ruleId: string;
  title: string;
  risk: Exclude<RiskLevel, "none">;
  path: string;
  reasons: string[];
  requiredEvidence: string[];
  failOnMissingEvidence: boolean;
}

export interface ScanResult {
  risk: RiskLevel;
  files: ChangedFile[];
  matches: RuleMatch[];
  requiredEvidence: string[];
  gate: {
    shouldFail: boolean;
    reasons: string[];
  };
}

