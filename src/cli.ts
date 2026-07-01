#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { compileIntegrations, type IntegrationTool } from "./core/compile.js";
import { evaluateGate, loadEvidenceStatus } from "./core/evidence.js";
import { initProject } from "./core/init.js";
import { loadRules } from "./core/rules.js";
import { scanDiff } from "./core/scan.js";
import { toJson, toMarkdown } from "./core/report.js";

const program = new Command();
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

program
  .name("oas")
  .description("Security gates for AI-generated code changes.")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize OpenAgentSecurity config in a project.")
  .option("--project <dir>", "project directory", ".")
  .option("--github-action", "install GitHub Actions workflow", false)
  .option("--force", "overwrite existing files", false)
  .action(async (options) => {
    const result = await initProject({
      sourceRoot: packageRoot,
      projectDir: resolve(options.project),
      force: options.force,
      includeGithubAction: options.githubAction,
    });

    for (const file of result.created) console.log(`created ${file}`);
    for (const file of result.skipped) console.log(`skipped ${file}`);
  });

program
  .command("compile")
  .description("Compile source skills into tool-specific integration files.")
  .option("--tool <tools>", "comma-separated tools or all", "all")
  .option("--out <dir>", "output directory", "integrations")
  .action(async (options) => {
    const tools = parseTools(options.tool);
    const result = await compileIntegrations({
      rootDir: packageRoot,
      outDir: resolve(options.out),
      tools,
    });

    for (const file of result.files) console.log(`generated ${file}`);
  });

program
  .command("scan")
  .description("Scan a git diff and produce a security report.")
  .option("--base <ref>", "base ref to diff against")
  .option("--diff <file>", "read diff from file")
  .option("--rules <dir>", "rules directory", "rules")
  .option("--format <format>", "json or markdown", "markdown")
  .option("--out <file>", "write report to file")
  .action(async (options) => {
    const diff = await readDiff(options.diff, options.base);
    const rules = await loadRules(resolveRulesDir(options.rules));
    const result = scanDiff(diff, rules);
    const output = options.format === "json" ? toJson(result) : toMarkdown(result);

    if (options.out) {
      const outFile = resolve(options.out);
      await mkdir(dirname(outFile), { recursive: true });
      await writeFile(outFile, output);
    } else {
      process.stdout.write(output);
    }
  });

program
  .command("gate")
  .description("Evaluate a JSON scan report as a merge gate.")
  .option("--report <file>", "JSON report file", ".oas/report.json")
  .option("--evidence <file>", "YAML evidence status file")
  .option("--fail-on <level>", "risk level that should fail", "high")
  .action(async (options) => {
    const report = JSON.parse(await readFile(resolve(options.report), "utf8"));
    const evidence = options.evidence ? await loadEvidenceStatus(resolve(options.evidence)) : {};
    const gate = evaluateGate(report, {
      failOn: options.failOn,
      evidence,
    });

    if (gate.shouldFail) {
      console.error("OpenAgentSecurity gate failed.");
      for (const reason of gate.reasons) console.error(`- ${reason}`);
      process.exitCode = 1;
      return;
    }

    console.log("OpenAgentSecurity gate passed.");
  });

program.parseAsync();

async function readDiff(diffFile?: string, base?: string): Promise<string> {
  if (diffFile) return readFile(resolve(diffFile), "utf8");
  if (base) return execFileSync("git", ["diff", `${base}...HEAD`], { encoding: "utf8" });
  return execFileSync("git", ["diff", "--cached"], { encoding: "utf8" });
}

function riskAtLeast(actual: string, threshold: string): boolean {
  const rank: Record<string, number> = { none: 0, low: 1, medium: 2, high: 3, block: 4 };
  return (rank[actual] ?? 0) >= (rank[threshold] ?? 3);
}

function parseTools(input: string): IntegrationTool[] {
  const all: IntegrationTool[] = ["cursor", "codex", "claude-code", "windsurf", "copilot"];
  if (input === "all") return all;
  return input.split(",").map((tool) => tool.trim()) as IntegrationTool[];
}

function resolveRulesDir(input: string): string {
  if (input !== "rules") return resolve(input);
  return join(packageRoot, "rules");
}
