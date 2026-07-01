import type { ChangedFile } from "./types.js";

const gitDiffHeader = /^diff --git a\/(.+?) b\/(.+)$/;

export function parseDiff(diff: string): ChangedFile[] {
  const files: ChangedFile[] = [];
  let current: ChangedFile | undefined;

  for (const line of diff.split(/\r?\n/)) {
    const header = gitDiffHeader.exec(line);
    if (header) {
      current = { path: header[2] ?? header[1] ?? "", additions: [] };
      files.push(current);
      continue;
    }

    if (!current) continue;
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    if (line.startsWith("+")) current.additions.push(line.slice(1));
  }

  return files.filter((file) => file.path.length > 0);
}

