# StackPilot

StackPilot is a Bloomberg-terminal-inspired AI stack advisor. It compares curated tools, ranks them against project constraints, and exports a tailored `PRD.md` and `ARCHITECTURE.md`.

It also includes a curated skills and plugins marketplace with browser-local collections, upstream installation commands, an agency org chart, and a Graphiti-inspired temporal knowledge graph.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables are required for comparisons, recommendations, template generation, or export.

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Data and security

Tool records in `data/` are curated snapshots, validated at application load, and include review dates plus primary-source links. Verify current pricing, model availability, licenses, and benchmarks before production use.

Template generation runs locally without a key. Optional AI enhancement accepts only a documented free-tier Google Gemini key, sends it through a same-origin server proxy, and does not persist or log it. The key still transits the deployed StackPilot server and Google, so users should apply key restrictions and quotas.

Marketplace “Add” actions only update browser-local storage. They never execute an upstream install command. Users must inspect the linked repository, license, and command before installation.
