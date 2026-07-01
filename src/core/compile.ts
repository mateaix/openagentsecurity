import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type IntegrationTool = "cursor" | "codex" | "claude-code" | "windsurf" | "copilot";

export interface CompileOptions {
  rootDir: string;
  outDir: string;
  tools: IntegrationTool[];
}

export interface CompileResult {
  files: string[];
}

export async function compileIntegrations(options: CompileOptions): Promise<CompileResult> {
  const skills = await readSkills(join(options.rootDir, "skills"));
  const files: string[] = [];

  for (const tool of options.tools) {
    const output = renderTool(tool, skills);
    await mkdir(join(options.outDir, output.dir), { recursive: true });
    const file = join(options.outDir, output.dir, output.file);
    await writeFile(file, output.content);
    files.push(file);
  }

  return { files };
}

async function readSkills(skillsDir: string): Promise<string[]> {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  return Promise.all(files.map((file) => readFile(join(skillsDir, file), "utf8")));
}

function renderTool(
  tool: IntegrationTool,
  skills: string[],
): { dir: string; file: string; content: string } {
  const body = renderSkillPack(skills);

  switch (tool) {
    case "cursor":
      return {
        dir: "cursor/rules",
        file: "oas.mdc",
        content: `---\ndescription: OpenAgentSecurity workflow for security-sensitive AI-generated code changes\nglobs: ""\nalwaysApply: false\n---\n${body}`,
      };
    case "codex":
      return {
        dir: "codex/openagentsecurity",
        file: "SKILL.md",
        content: `---\nname: openagentsecurity\ndescription: Security gates for AI-generated code changes.\n---\n${body}`,
      };
    case "claude-code":
      return {
        dir: "claude-code",
        file: "openagentsecurity.md",
        content: body,
      };
    case "windsurf":
      return {
        dir: "windsurf",
        file: ".windsurfrules",
        content: body,
      };
    case "copilot":
      return {
        dir: "copilot",
        file: "openagentsecurity.md",
        content: body,
      };
  }
}

function renderSkillPack(skills: string[]): string {
  return [
    "# OpenAgentSecurity",
    "",
    "Use OpenAgentSecurity when reviewing AI-generated code changes, security-sensitive diffs, required evidence, or merge gate decisions.",
    "",
    ...skills.map((skill) => skill.trim()),
    "",
  ].join("\n");
}

