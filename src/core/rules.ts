import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";
import type { SecurityRule } from "./types.js";

export async function loadRules(rulesDir: string): Promise<SecurityRule[]> {
  const entries = await readdir(rulesDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))
    .map((entry) => join(rulesDir, entry.name));

  const rules = await Promise.all(files.map(loadRule));
  return rules.sort((a, b) => a.id.localeCompare(b.id));
}

async function loadRule(file: string): Promise<SecurityRule> {
  const raw = await readFile(file, "utf8");
  return YAML.parse(raw) as SecurityRule;
}

