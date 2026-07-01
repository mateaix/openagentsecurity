<p align="center">
  <img src="imgs/logo.png" alt="Open Agent Security logo" width="180" />
</p>

<h1 align="center">Open Agent Security</h1>

<p align="center">
  AI 생성 코드 변경을 위한 보안 게이트.
</p>

Languages: [English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja-JP.md) | 한국어 | [Русский](README.ru-RU.md)

OpenAgentSecurity는 보안 민감 diff를 필요한 증거와 병합 결정으로 변환합니다.

## Features

- git diff 또는 PR diff 파일을 스캔합니다.
- YAML 규칙으로 보안 민감 변경을 탐지합니다.
- Markdown 또는 JSON 보고서를 생성합니다.
- 고위험 변경에는 증거를 요구합니다.
- CI 친화적인 병합 게이트를 제공합니다.
- Codex, Cursor, Claude Code, Windsurf, Copilot용 skills를 생성합니다.

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

OpenAgentSecurity는 표준 문서의 긴 원문을 복사하지 않습니다. 규칙은 source ID, URL, version, license를 참조하고 검증 로직은 프로젝트 고유 문장으로 작성합니다.
