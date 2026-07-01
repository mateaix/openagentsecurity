#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Command } from "commander";
import { loadRules } from "./core/rules.js";
import { scanDiff } from "./core/scan.js";
import { toJson, toMarkdown } from "./core/report.js";

const program = new Command();

program
  .name("oas")
  .description("Security gates for AI-generated code changes.")
  .version("0.1.0");

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
    const rules = await loadRules(resolve(options.rules));
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
  .option("--fail-on <level>", "risk level that should fail", "high")
  .action(async (options) => {
    const report = JSON.parse(await readFile(resolve(options.report), "utf8")) as {
      risk: string;
      gate?: { shouldFail?: boolean; reasons?: string[] };
    };
    const shouldFail = report.gate?.shouldFail ?? riskAtLeast(report.risk, options.failOn);

    if (shouldFail) {
      console.error("OpenAgentSecurity gate failed.");
      for (const reason of report.gate?.reasons ?? []) console.error(`- ${reason}`);
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
