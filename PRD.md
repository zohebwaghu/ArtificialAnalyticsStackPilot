# PRD: StackPilot — AI Project Stack Advisor + PRD Generator

**One-liner:** A Bloomberg-terminal-style comparison dashboard for AI tools (LLMs, frameworks, models, agents) that lets developers describe what they're building and walks away with a generated PRD.md + ARCHITECTURE.md ready to paste into their coding agent.

**Team:** Zoheb Waghu (solo) · **Type:** Portfolio project · **Stack:** Next.js + Vercel · **Budget:** Free tier (zero API cost to operator)

---

## 1. Problem & Why Now

**Who:** Developers and teams starting a new AI-powered project — indie hackers, hackathon teams, startup founders, students building capstone projects.

**The problem:** The AI tooling landscape is overwhelming. There are 100+ LLMs, 50+ inference providers, 20+ agent frameworks, 30+ vector DBs, and the "right" choice depends entirely on what you're building. Today, developers:
- Spend 2-5 hours researching which LLM/framework/stack fits their use case
- Read scattered blog posts, Reddit threads, and docs that are already outdated
- Make choices based on hype (whatever YC companies tweet about) rather than fit
- Start building with the wrong stack and realize it 2 weeks in
- Have no structured way to translate "I want to build X" into a concrete technical plan

**Why now:**
- The AI skills marketplace is exploding (skills-marketplace.com, agensi.io, mcpmarket.com) but none answer "what should I use for MY project?"
- Artificial Analysis benchmarks hardware/inference but doesn't help with stack decisions
- Claude Code, Cursor, Codex all accept PRD.md + ARCHITECTURE.md as input — generating these is the highest-leverage output we can provide
- The data (model benchmarks, framework comparisons, pricing) is all public and static — no API costs needed

**Why this is winnable as a portfolio project:**
- All comparison data is public (HuggingFace, artificialanalysis.ai, framework docs)
- Next.js + Vercel = free hosting, SSG for static pages, edge functions if needed
- LLM generation uses the USER's API key (client-side) — zero cost to operator
- Bloomberg terminal aesthetic is visually impressive in a portfolio

---

## 2. The Core Demo (60-90 seconds)

1. User lands on StackPilot — dark Bloomberg-terminal UI with AI tool comparison panels
2. User clicks "Build My Stack" → a guided wizard asks:
   - "What are you building?" (chatbot, RAG app, coding agent, image gen pipeline, data pipeline, etc.)
   - "What domain?" (healthcare, finance, e-commerce, education, etc.)
   - "What's your scale?" (prototype, startup MVP, enterprise)
   - "What's your budget?" (free, $50/mo, $500/mo, enterprise)
3. Dashboard updates in real-time: recommended LLMs, frameworks, vector DBs, deployment options — all filtered and ranked for their use case
4. User explores comparisons: click any category to see detailed benchmarks (speed, cost, quality, context window, etc.)
5. User clicks "Generate Project Files" → enters their API key (stays in browser)
6. System generates a complete PRD.md + ARCHITECTURE.md customized to their selections
7. User downloads both files, pastes into Claude Code / Cursor / Codex → starts building immediately

**The "wow" moment:** Going from "I want to build a medical chatbot" to a complete, professional PRD + architecture document with specific model recommendations, interface contracts, and implementation plan — in under 2 minutes.

---

## 3. Scope

### Must-Have (MVP)

- [ ] **F0: Project scaffold** — Next.js app with Bloomberg dark theme, responsive layout
- [ ] **F1: Static data layer** — JSON files with curated AI tool data (LLMs, frameworks, vector DBs, deployment platforms, agent frameworks)
- [ ] **F2: Comparison dashboard** — Interactive tables/charts comparing tools across dimensions (speed, cost, quality, context window, license)
- [ ] **F3: Stack wizard** — Guided flow: "What are you building?" → filtered recommendations
- [ ] **F4: Stack builder** — Shopping-cart-style selection of tools across each layer (LLM, framework, DB, deploy, etc.)
- [ ] **F5: PRD + ARCHITECTURE generator** — Hybrid template + LLM generation using user's API key
- [ ] **F6: Export** — Download PRD.md + ARCHITECTURE.md as files
- [ ] **F7: Deploy** — Live on Vercel with custom domain

### Nice-to-Have (post-MVP)

- [ ] Community-submitted tool reviews and ratings
- [ ] "Stack Gallery" — browse what other developers chose for similar projects
- [ ] Cost calculator (estimate monthly spend for selected stack)
- [ ] Integration with GitHub (create repo with generated files)
- [ ] Comparison sharing (shareable URL for a specific stack comparison)

### Explicitly Out of Scope

- [ ] User accounts / authentication (no login needed)
- [ ] Backend database (all data is static JSON, deployed with the app)
- [ ] Server-side LLM calls (user provides their own key, runs client-side)
- [ ] Real-time benchmark data (curated snapshots, updated manually)
- [ ] Paid tier / monetization (portfolio project, not a business)

---

## 4. Users & Core User Story

**As a** developer starting a new AI project,
**I want to** describe what I'm building and see which AI tools fit best,
**so that** I get a professional PRD + architecture document I can hand to my coding agent and start building immediately.

**Key flows:**

1. **Browse & Compare:** Land on dashboard → explore LLM comparisons → filter by use case → compare 2-3 options side by side
2. **Build My Stack:** Click wizard → answer 4-5 questions → see recommended stack → customize selections → generate PRD.md + ARCHITECTURE.md → download

---

## 5. Success Criteria

- [ ] Dashboard loads in <2 seconds (static data, SSG)
- [ ] Wizard flow completes in <60 seconds (4-5 questions)
- [ ] Generated PRD.md is >500 words with project-specific recommendations
- [ ] Generated ARCHITECTURE.md includes tech stack table, component breakdown, interface contracts, data model, and commands
- [ ] Both files are directly usable by Claude Code / Cursor / Codex without modification
- [ ] Lighthouse score >90 (performance, accessibility)
- [ ] Works on mobile (responsive Bloomberg layout)
- [ ] Deployed on Vercel with zero monthly cost

---

## 6. Data Model — What We're Comparing

### Category 1: LLMs (Language Models)

```json
{
  "id": "claude-sonnet-4",
  "name": "Claude Sonnet 4",
  "provider": "Anthropic",
  "category": "llm",
  "pricing": { "input_per_1m": 3.0, "output_per_1m": 15.0 },
  "context_window": 200000,
  "max_output": 64000,
  "speed_tps": 120,
  "quality_score": 92,
  "best_for": ["coding", "analysis", "long-context", "agentic"],
  "license": "proprietary",
  "multimodal": true,
  "tool_calling": true,
  "open_source": false,
  "tags": ["frontier", "coding", "enterprise"]
}
```

### Category 2: Agent Frameworks

```json
{
  "id": "langchain",
  "name": "LangChain / LangGraph",
  "category": "agent_framework",
  "language": "Python",
  "github_stars": 95000,
  "best_for": ["multi-step agents", "tool calling", "RAG"],
  "complexity": "high",
  "production_ready": true,
  "learning_curve": "steep",
  "tags": ["popular", "enterprise", "flexible"]
}
```

### Category 3: Vector Databases

```json
{
  "id": "pinecone",
  "name": "Pinecone",
  "category": "vector_db",
  "hosting": "managed",
  "free_tier": true,
  "max_dimensions": 20000,
  "best_for": ["RAG", "semantic search", "recommendations"],
  "latency_ms": 10,
  "pricing_model": "serverless",
  "tags": ["managed", "easy-setup", "scalable"]
}
```

### Category 4: Deployment Platforms

```json
{
  "id": "vercel",
  "name": "Vercel",
  "category": "deployment",
  "best_for": ["Next.js", "frontend", "edge functions"],
  "free_tier": true,
  "supports": ["Node.js", "Python (serverless)", "Edge"],
  "tags": ["frontend", "fast-deploy", "free-tier"]
}
```

### Category 5: Coding Agents

```json
{
  "id": "claude-code",
  "name": "Claude Code",
  "category": "coding_agent",
  "provider": "Anthropic",
  "ide_integration": ["terminal", "VS Code", "JetBrains"],
  "best_for": ["full-stack dev", "refactoring", "debugging"],
  "accepts_prd": true,
  "pricing": "usage-based",
  "tags": ["agentic", "terminal", "powerful"]
}
```

### Category 6: Speech / Image / Video Models

```json
{
  "id": "whisper-v3",
  "name": "Whisper Large V3",
  "category": "speech",
  "provider": "OpenAI",
  "task": "speech-to-text",
  "languages": 100,
  "open_source": true,
  "best_for": ["transcription", "multilingual"],
  "tags": ["open-source", "accurate"]
}
```

### Category 7: Project Templates (Maps User Intent → Stack)

```json
{
  "id": "rag-chatbot",
  "name": "RAG Chatbot",
  "description": "Retrieval-augmented generation chatbot with custom knowledge base",
  "recommended_stack": {
    "llm": ["claude-sonnet-4", "gpt-4o"],
    "framework": ["langchain", "llamaindex"],
    "vector_db": ["pinecone", "chroma"],
    "deployment": ["vercel", "railway"],
    "coding_agent": ["claude-code", "cursor"]
  },
  "skills_required": ["Python", "API design", "embeddings", "prompt engineering"],
  "estimated_time": "2-4 weeks",
  "difficulty": "intermediate",
  "domains": ["customer support", "knowledge management", "education"]
}
```

---

## 7. PRD + ARCHITECTURE Generation Strategy

### Template Layer (Free, No LLM)

Pre-built markdown templates with placeholders:
```markdown
# PRD: {{project_name}}

**One-liner:** A {{project_type}} for {{domain}} using {{primary_llm}} + {{framework}}.

## 1. Tech Stack
| Layer | Choice | Why |
|---|---|---|
| LLM | {{selected_llm}} | {{llm_reason}} |
| Framework | {{selected_framework}} | {{framework_reason}} |
...
```

The template fills in automatically from user selections. This works without any LLM call and produces a usable 70% complete document.

### LLM Layer (Optional, User's API Key)

If the user provides their API key (stored only in browser `sessionStorage`, never sent to our server):
- Call Claude/GPT to expand the template sections with project-specific descriptions
- Generate custom interface contracts based on the architecture
- Write project-specific user stories and success criteria
- Add domain-specific considerations (healthcare compliance, fintech security, etc.)

**Implementation:** Client-side `fetch()` to `api.anthropic.com` or `api.openai.com` directly from the browser. The API key never touches our backend.

---

## 8. Page Structure

```
/ (Home)
├── /compare
│   ├── /compare/llms           — LLM comparison table + filters
│   ├── /compare/frameworks     — Agent framework comparison
│   ├── /compare/vector-dbs     — Vector DB comparison
│   ├── /compare/deployment     — Deployment platform comparison
│   ├── /compare/coding-agents  — Coding agent comparison
│   └── /compare/models         — Speech/image/video model comparison
│
├── /build                      — Stack wizard (guided flow)
│   ├── Step 1: What are you building?
│   ├── Step 2: Domain & scale
│   ├── Step 3: Review recommendations
│   ├── Step 4: Customize stack
│   └── Step 5: Generate & download PRD.md + ARCHITECTURE.md
│
├── /templates                  — Browse project templates
│   ├── RAG Chatbot
│   ├── Coding Agent
│   ├── Data Pipeline
│   ├── Image Generation App
│   └── ... (15-20 templates)
│
└── /about                      — About + how it works
```

---

## 9. Constraints & Assumptions

**Constraints:**
- Zero server-side API costs (free Vercel tier, static data)
- LLM calls must be client-side (user's key) — CORS must be handled
- All comparison data curated manually (no real-time API scraping)
- Solo developer — must be buildable in ~40-60 hours total

**Assumptions:**
- Users have or can get a Claude/OpenAI API key for the generation step
- Template-only output (no LLM) is "good enough" for 80% of users
- Comparison data is updated manually every 2-4 weeks
- Bloomberg terminal aesthetic differentiates from generic dashboards

---

## 10. Open Questions

| Question | Resolution |
|---|---|
| How many tools to include at launch? | Start with 15-20 per category (top/popular only) |
| How to handle CORS for client-side LLM calls? | Anthropic API supports CORS; OpenAI may need a thin proxy |
| Should comparisons be interactive charts or tables? | Tables first (faster to build), charts for hero metrics |
| How to keep data current? | Manual JSON updates + GitHub Actions to remind every 2 weeks |

---

## 11. Timeline

```
Week 1: Foundation
  □ F0: Next.js scaffold + Bloomberg theme + responsive layout
  □ F1: Static data JSON files (LLMs, frameworks, vector DBs, etc.)
  □ F2: Comparison dashboard (tables + filters for 2-3 categories)

Week 2: Core Features
  □ F2: Remaining comparison categories
  □ F3: Stack wizard (guided flow, 4-5 steps)
  □ F4: Stack builder (selection + recommendations)

Week 3: Generation + Polish
  □ F5: PRD + ARCHITECTURE template engine
  □ F5: Client-side LLM integration (optional enhancement)
  □ F6: Export as .md files
  □ F7: Deploy to Vercel

Week 4: Polish + Content
  □ Expand data to 15-20 tools per category
  □ Add 15-20 project templates
  □ Lighthouse optimization
  □ README + portfolio write-up
```
