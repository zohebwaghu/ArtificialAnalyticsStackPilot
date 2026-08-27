# StackPilot

StackPilot is a Bloomberg-terminal-inspired AI stack advisor. It compares curated tools, ranks them against project constraints, and exports a tailored `PRD.md` and `ARCHITECTURE.md`.

It also includes a curated skills and plugins marketplace with browser-local collections, upstream installation commands, an agency org chart, and a Graphiti-inspired temporal knowledge graph.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables are required for comparisons, recommendations, template generation, or export.

## Run with Docker

Build and run the production container:

```bash
docker compose up --build
```

Open `http://localhost:3000`. To use another host port, copy `.env.example` to `.env` and change `STACKPILOT_PORT`, or run:

```bash
STACKPILOT_PORT=8080 docker compose up --build
```

For containerized development with source mounts and hot reload:

```bash
docker compose -f compose.dev.yaml up --build
```

The production image uses Next.js standalone output, runs as the unprivileged `node` user, and exposes `/api/health` for container health checks. API keys are never included in the image. Users enter a free-tier Gemini key at runtime when they explicitly request document enhancement.

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
docker compose config
```

## Data and security

Tool records in `data/` are curated snapshots, validated at application load, and include review dates plus primary-source links. Verify current pricing, model availability, licenses, and benchmarks before production use.

Template generation runs locally without a key. Optional AI enhancement accepts only a documented free-tier Google Gemini key, sends it through a same-origin server proxy, and does not persist or log it. The key still transits the deployed StackPilot server and Google, so users should apply key restrictions and quotas.

Marketplace “Add” actions only update browser-local storage. They never execute an upstream install command. Users must inspect the linked repository, license, and command before installation.
