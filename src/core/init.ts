import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface InitOptions {
  sourceRoot: string;
  projectDir: string;
  force: boolean;
  includeGithubAction?: boolean;
}

export interface InitResult {
  created: string[];
  skipped: string[];
}

export async function initProject(options: InitOptions): Promise<InitResult> {
  const mappings = [
    ["templates/policy.yml", ".oas/policy.yml"],
    ["templates/invariants.yml", ".oas/invariants.yml"],
    ["templates/evidence.yml", ".oas/evidence.yml"],
  ];

  if (options.includeGithubAction) {
    mappings.push(["templates/github-action.yml", ".github/workflows/oas.yml"]);
  }

  const created: string[] = [];
  const skipped: string[] = [];

  for (const [source, target] of mappings) {
    const sourceFile = join(options.sourceRoot, source);
    const targetFile = join(options.projectDir, target);

    if (!options.force && (await exists(targetFile))) {
      skipped.push(targetFile);
      continue;
    }

    await mkdir(dirname(targetFile), { recursive: true });
    await copyFile(sourceFile, targetFile);
    created.push(targetFile);
  }

  return { created, skipped };
}

async function exists(file: string): Promise<boolean> {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

