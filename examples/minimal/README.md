# Minimal Example

This example shows the smallest OpenAgentSecurity flow.

```bash
npm run build
node dist/cli.js scan --diff examples/minimal/pr.diff --format markdown
node dist/cli.js scan --diff examples/minimal/pr.diff --format json --out .oas/report.json
node dist/cli.js gate --report .oas/report.json
node dist/cli.js gate --report .oas/report.json --evidence examples/minimal/evidence-pass.yml
```

The example diff modifies an admin API authorization path, so the scan should
match `oas.access-control` and require access-control evidence.
