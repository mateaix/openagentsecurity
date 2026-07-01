<p align="center">
  <img src="imgs/logo.png" alt="Open Agent Security logo" width="180" />
</p>

<h1 align="center">Open Agent Security</h1>

<p align="center">
  面向 AI 生成代码变更的安全门禁。
</p>

语言： [English](README.md) | 简体中文 | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | [Русский](README.ru-RU.md)

OpenAgentSecurity 将安全敏感的代码 diff 转换为必需验证证据和合并决策。

## 核心能力

- 扫描 git diff 或 PR diff 文件。
- 根据 YAML 规则识别安全敏感变更。
- 输出 Markdown 或 JSON 报告。
- 对高风险变更要求证据。
- 提供 CI 友好的合并门禁。
- 将安全 skills 编译到 Codex、Cursor、Claude Code、Windsurf 和 Copilot。

## 快速开始

```bash
npm install
npm run build
node dist/cli.js scan --diff examples/minimal/pr.diff --format markdown
```

生成 JSON 报告并执行门禁：

```bash
node dist/cli.js scan --diff examples/minimal/pr.diff --format json --out .oas/report.json
node dist/cli.js gate --report .oas/report.json --evidence examples/minimal/evidence-pass.yml
```

## 命令

```bash
oas init
oas compile --tool all
oas scan --base main
oas gate --report .oas/report.json --evidence .oas/evidence.yml --fail-on high
```

## 合规优先

OpenAgentSecurity 不复制标准长文本。规则只引用来源 ID、URL、版本和许可，并用项目自有表达描述验证逻辑。
