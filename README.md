# UK Food Safety MCP

[![CI](https://github.com/Ansvar-Systems/uk-food-safety-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/uk-food-safety-mcp/actions/workflows/ci.yml)
[![GHCR](https://github.com/Ansvar-Systems/uk-food-safety-mcp/actions/workflows/ghcr-build.yml/badge.svg)](https://github.com/Ansvar-Systems/uk-food-safety-mcp/actions/workflows/ghcr-build.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

UK food safety and traceability regulations via the [Model Context Protocol](https://modelcontextprotocol.io). Query direct sales rules, labelling requirements, raw milk legality, assurance schemes, HACCP, and hygiene requirements -- all from your AI assistant.

Part of [Ansvar Open Agriculture](https://ansvar.eu/open-agriculture).

## Why This Exists

Small food producers, farm shops, and farmers market sellers need to navigate a patchwork of food safety regulations that differ by product, sales channel, and devolved administration. Raw milk rules alone can mean the difference between a legal business and a criminal offence depending on which side of the Scottish border you are. This MCP server makes these rules queryable.

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "uk-food-safety": {
      "command": "npx",
      "args": ["-y", "@ansvar/uk-food-safety-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add uk-food-safety npx @ansvar/uk-food-safety-mcp
```

### Streamable HTTP (remote)

```
https://mcp.ansvar.eu/uk-food-safety/mcp
```

### Docker (self-hosted)

```bash
docker run -p 3000:3000 ghcr.io/ansvar-systems/uk-food-safety-mcp:latest
```

### npm (stdio)

```bash
npx @ansvar/uk-food-safety-mcp
```

## Example Queries

Ask your AI assistant:

- "Can I sell raw milk from my farm in Scotland?"
- "What labelling do I need for eggs at a farmers market?"
- "What are the HACCP requirements for a farm shop?"
- "Do I need approval or just registration to sell cheese?"
- "What assurance schemes should I look at for a small dairy?"
- "What temperature controls apply to meat at a farmers market?"
- "What traceability records do I need for beef?"
- "What are the honey labelling rules for country of origin?"

## Stats

| Metric | Value |
|--------|-------|
| Tools | 11 (3 meta + 8 domain) |
| Jurisdiction | GB |
| Products | 16 |
| Product requirements | 44 (across 4 sales channels) |
| Assurance schemes | 5 |
| Hygiene rules | 8 activity types |
| Raw milk rules | 4 devolved administrations |
| Labelling rules | 34 field definitions |
| Data sources | FSA, FSS, DEFRA, UK legislation |
| License (data) | Open Government Licence v3 |
| License (code) | Apache-2.0 |
| Transport | stdio + Streamable HTTP |

## Tools

| Tool | Description |
|------|-------------|
| `about` | Server metadata and links |
| `list_sources` | Data sources with freshness info |
| `check_data_freshness` | Staleness status and refresh command |
| `search_food_safety` | FTS5 search across all food safety data |
| `get_product_requirements` | Requirements by product and sales channel |
| `get_traceability_rules` | Record-keeping and one-step-forward-one-step-back |
| `check_direct_sales_rules` | Farm gate, market, and online sales rules |
| `get_labelling_requirements` | Mandatory label fields by product |
| `get_assurance_scheme_requirements` | Red Tractor, SALSA, Soil Association, etc. |
| `get_hygiene_requirements` | HACCP, temperature, cleaning by activity |
| `check_raw_milk_rules` | Legality by devolved administration |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Raw Milk Rules (Critical)

| Administration | Status |
|---------------|--------|
| England | Permitted at farm gate and farmers markets only. Warning label required. |
| Scotland | **BANNED** for direct sale of cows milk (since 1983). |
| Wales | Permitted at farm gate and farmers markets only. Warning label required. |
| Northern Ireland | **PROHIBITED** -- all milk must be heat-treated. |

## Security Scanning

This repository runs security checks on every push:

- **CodeQL** -- static analysis for JavaScript/TypeScript
- **Gitleaks** -- secret detection across full history
- **Dependency review** -- via Dependabot
- **Container scanning** -- via GHCR build pipeline

See [SECURITY.md](SECURITY.md) for reporting policy.

## Disclaimer

This tool provides reference data for informational purposes only. It is not professional food safety or legal advice. Requirements vary by local authority. Always consult your Environmental Health Officer. See [DISCLAIMER.md](DISCLAIMER.md).

## Contributing

Issues and pull requests welcome. For security vulnerabilities, email security@ansvar.eu (do not open a public issue).

## License

Apache-2.0. Data sourced under Open Government Licence v3.
