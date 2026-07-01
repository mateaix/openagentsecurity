import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import YAML from "yaml";

describe("locales", () => {
  it("keeps all locale files on the same key set", async () => {
    const localeDir = join(process.cwd(), "locales");
    const files = (await readdir(localeDir)).filter((file) => file.endsWith(".yml")).sort();
    const parsed = await Promise.all(
      files.map(async (file) => YAML.parse(await readFile(join(localeDir, file), "utf8"))),
    );

    expect(files).toEqual(["en-US.yml", "ja-JP.yml", "ko-KR.yml", "ru-RU.yml", "zh-CN.yml"]);
    const [base, ...rest] = parsed.map((locale) => flattenKeys(locale));
    for (const keys of rest) expect(keys).toEqual(base);
  });
});

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  ).sort();
}
