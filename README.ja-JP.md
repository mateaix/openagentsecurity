<p align="center">
  <img src="imgs/logo.png" alt="Open Agent Security logo" width="180" />
</p>

<h1 align="center">Open Agent Security</h1>

<p align="center">
  AI 生成コード変更のためのセキュリティゲート。
</p>

Languages: [English](README.md) | [简体中文](README.zh-CN.md) | 日本語 | [한국어](README.ko-KR.md) | [Русский](README.ru-RU.md)

OpenAgentSecurity は、セキュリティに関わる diff を必要な証跡とマージ判断に変換します。

## Features

- git diff または PR diff ファイルをスキャンします。
- YAML ルールでセキュリティに関わる変更を検出します。
- Markdown または JSON レポートを生成します。
- 高リスク変更には証跡を要求します。
- CI で使える merge gate を提供します。
- Codex、Cursor、Claude Code、Windsurf、Copilot 向けに skills を生成します。

## Quick Start

```bash
npm install
npm run build
node dist/cli.js scan --diff examples/minimal/pr.diff --format markdown
```

```bash
node dist/cli.js scan --diff examples/minimal/pr.diff --format json --out .oas/report.json
node dist/cli.js gate --report .oas/report.json --evidence examples/minimal/evidence-pass.yml
```

## Commands

```bash
oas init
oas compile --tool all
oas scan --base main
oas gate --report .oas/report.json --evidence .oas/evidence.yml --fail-on high
```

## Compliance First

OpenAgentSecurity は標準文書の長文をコピーしません。ルールは source ID、URL、version、license を参照し、検証ロジックは独自の表現で記述します。
