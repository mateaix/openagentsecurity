# OpenAgentSecurity

<p align="center">
  <img src="imgs/logo.png" alt="OpenAgentSecurity logo" width="180" />
</p>

<p align="center">
  Шлюзы безопасности для изменений кода, созданных AI.
</p>

Languages: [English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | Русский

OpenAgentSecurity преобразует чувствительные к безопасности diff в обязательные доказательства и решения о merge.

## Features

- Сканирует git diff или PR diff файлы.
- Находит чувствительные к безопасности изменения по YAML правилам.
- Создает отчеты в Markdown или JSON.
- Требует доказательства для высокорисковых изменений.
- Предоставляет CI-friendly merge gate.
- Генерирует skills для Codex, Cursor, Claude Code, Windsurf и Copilot.

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

OpenAgentSecurity не копирует длинные фрагменты стандартов. Правила ссылаются на source ID, URL, version и license, а логика проверки описывается собственными формулировками проекта.

