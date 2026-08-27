# Architecture: StackPilot

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 16.3 + React 19.2 + TypeScript 6 (App Router) | Static pages, React Server Components, current Active LTS platform |
| Styling | Tailwind CSS 4.3 + custom Bloomberg theme | CSS-first utilities, dark theme, data-dense layouts |
| Charts | Recharts + D3.js (select visualizations) | Recharts for standard charts, D3 for custom Bloomberg-style |
| Data store | Static JSON files (committed to repo) | Zero cost, version-controlled, SSG-compatible |
| State | React Context + URL search params | No external state library needed; URL params for shareable comparisons |
| LLM (generation) | Local templates; optional server-proxied Gemini free-tier BYOK | Zero operator model cost; submitted keys remain in component memory and are never persisted or logged |
| Template engine | Handlebars-style string interpolation | Simple, no dependency, fills PRD/ARCH templates |
| Deploy | Vercel or Docker (Node 24 Alpine, standalone output) | Managed zero-config hosting or a portable, minimal self-hosted image |
| Analytics | Vercel Analytics (free) or Plausible | Privacy-respecting, no cookie banner needed |

## 2. Component Breakdown

| Component | Responsibility | Complexity |
|---|---|---|
| **Bloomberg Theme** | Global dark theme, typography, panel components, responsive grid | M |
| **Data Layer** | Static JSON loader, type definitions, filter/sort utilities | S |
| **Comparison Tables** | Interactive sortable/filterable tables per category | M |
| **Comparison Charts** | Bar/radar/scatter charts for visual comparisons | M |
| **Stack Wizard** | Multi-step form: project type → domain → scale → budget → results | L |
| **Stack Builder** | Category-by-category tool selection with recommendations | M |
| **Template Engine** | PRD.md + ARCHITECTURE.md generation from selections | L |
| **LLM Enhancer** | Client-side API calls to enhance generated docs | M |
| **Export Module** | Download .md files, copy to clipboard | S |
| **Skills Marketplace** | Curated skill/plugin catalog, local collection, provenance and install commands | M |
| **Agency Org Chart** | Human-owned specialist-agent topology based on agency divisions | S |
| **Knowledge Graph** | Zero-key temporal entity/fact/episode visualization inspired by Graphiti | M |

## 3. Interface Contracts

### 3a. Data Schema (Static JSON → Components)

```typescript
// types/tools.ts

interface AITool {
  id: string;
  name: string;
  provider: string;
  category: ToolCategory;
  description: string;
  logo_url?: string;
  website_url: string;
  pricing: PricingInfo;
  best_for: string[];
  tags: string[];
  updated_at: string;  // ISO date of last data update
}

type ToolCategory =
  | 'llm'
  | 'agent_framework'
  | 'vector_db'
  | 'deployment'
  | 'coding_agent'
  | 'speech_model'
  | 'image_model'
  | 'video_model';

interface LLMTool extends AITool {
  category: 'llm';
  context_window: number;
  max_output: number;
  speed_tps: number;         // tokens per second
  quality_score: number;      // 0-100 composite
  input_cost_per_1m: number;
  output_cost_per_1m: number;
  multimodal: boolean;
  tool_calling: boolean;
  open_source: boolean;
  license: string;
}

interface FrameworkTool extends AITool {
  category: 'agent_framework';
  language: string;
  github_stars: number;
  production_ready: boolean;
  learning_curve: 'easy' | 'moderate' | 'steep';
  complexity: 'low' | 'medium' | 'high';
}

interface VectorDBTool extends AITool {
  category: 'vector_db';
  hosting: 'managed' | 'self-hosted' | 'both';
  free_tier: boolean;
  max_dimensions: number;
  latency_ms: number;
}

interface PricingInfo {
  model: 'free' | 'freemium' | 'usage-based' | 'subscription' | 'open-source';
  free_tier: boolean;
  starting_price?: string;
}
```

### 3b. Stack Wizard State

```typescript
// types/wizard.ts

interface WizardState {
  step: 1 | 2 | 3 | 4 | 5;

  // Step 1: What are you building?
  project_type: ProjectType | null;

  // Step 2: Domain & constraints
  domain: string | null;
  scale: 'prototype' | 'mvp' | 'production' | 'enterprise' | null;
  budget: 'free' | 'low' | 'medium' | 'high' | null;
  team_size: 'solo' | 'small' | 'large' | null;

  // Step 3: Recommended stack (computed)
  recommendations: StackRecommendation | null;

  // Step 4: User's final selections (can override recommendations)
  selected_stack: SelectedStack;

  // Step 5: Generated output
  generated_prd: string | null;
  generated_arch: string | null;
}

type ProjectType =
  | 'rag_chatbot'
  | 'coding_agent'
  | 'data_pipeline'
  | 'image_gen_app'
  | 'voice_assistant'
  | 'video_analysis'
  | 'recommendation_engine'
  | 'document_processor'
  | 'api_wrapper'
  | 'fine_tuning_pipeline'
  | 'multimodal_app'
  | 'autonomous_agent'
  | 'custom';

interface SelectedStack {
  llm: string | null;           // tool ID
  framework: string | null;
  vector_db: string | null;
  deployment: string | null;
  coding_agent: string | null;
  speech_model: string | null;
  image_model: string | null;
}

interface StackRecommendation {
  llm: RankedRecommendation[];
  framework: RankedRecommendation[];
  vector_db: RankedRecommendation[];
  deployment: RankedRecommendation[];
  coding_agent: RankedRecommendation[];
}

interface RankedRecommendation {
  tool_id: string;
  score: number;        // 0-100 fit score
  reason: string;       // Why this tool for this project
  tradeoff: string;     // What you give up
}
```

### 3c. Template Engine Interface

```typescript
// lib/generator.ts

interface GeneratorInput {
  project_name: string;
  project_type: ProjectType;
  domain: string;
  scale: string;
  budget: string;
  selected_stack: SelectedStack;
  tools: Record<string, AITool>;  // Full tool data for selected IDs
}

interface GeneratorOutput {
  prd_markdown: string;
  architecture_markdown: string;
}

// Template-only generation (no LLM, always available)
function generateFromTemplate(input: GeneratorInput): GeneratorOutput;

// LLM-enhanced generation (requires user's API key)
async function generateWithLLM(
  input: GeneratorInput,
  api_key: string
): Promise<GeneratorOutput>;
```

### 3d. Free-Tier LLM Enhancement Interface

```typescript
// lib/llm-client.ts

// Client calls a same-origin proxy. The key remains in component memory.
async function enhanceMarkdown(apiKey: string, markdown: string) {
  const response = await fetch('/api/enhance', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ apiKey, markdown }),
  });
  return response.json();
}

// app/api/enhance/route.ts
// Validates request size, applies a timeout, and forwards to the documented
// Gemini 3 Flash Preview free-tier endpoint with cache-control: no-store.
async function POST(request: Request): Promise<Response> {
  // The submitted key is never logged, cached, or persisted.
}
```

## 4. Data Model

```
ProjectTemplate --< StackRecommendation
       |                    |
       |                    ▼
       |              AITool (LLM | Framework | VectorDB | Deployment | ...)
       |                    |
       ▼                    ▼
  WizardState ──► SelectedStack ──► GeneratorInput ──► PRD.md + ARCHITECTURE.md
```

All data is static JSON. No database. No user accounts. The "state" lives in React Context during the session and URL search params for shareable comparisons.

## 5. Project Structure

```
stackpilot/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + Bloomberg theme
│   ├── page.tsx                  # Home: hero + category overview
│   ├── compare/
│   │   ├── layout.tsx            # Comparison page layout (sidebar + content)
│   │   ├── llms/page.tsx         # LLM comparison table
│   │   ├── frameworks/page.tsx   # Framework comparison
│   │   ├── vector-dbs/page.tsx   # Vector DB comparison
│   │   ├── deployment/page.tsx   # Deployment comparison
│   │   ├── coding-agents/page.tsx
│   │   └── models/page.tsx       # Speech/image/video
│   ├── build/
│   │   └── page.tsx              # Stack wizard (multi-step)
│   ├── templates/
│   │   ├── page.tsx              # Browse project templates
│   │   └── [id]/page.tsx         # Individual template detail
│   └── about/page.tsx
│
├── components/
│   ├── ui/                       # Bloomberg-themed primitives
│   │   ├── Panel.tsx             # Dark panel with header
│   │   ├── DataTable.tsx         # Sortable/filterable table
│   │   ├── ComparisonCard.tsx    # Side-by-side tool comparison
│   │   ├── RadarChart.tsx        # Multi-dimension comparison
│   │   ├── BarChart.tsx          # Single metric comparison
│   │   ├── Badge.tsx             # Tag/label component
│   │   ├── Select.tsx            # Dropdown selector
│   │   └── Ticker.tsx            # Bloomberg-style scrolling ticker
│   ├── wizard/
│   │   ├── WizardShell.tsx       # Step container + progress
│   │   ├── StepProjectType.tsx   # "What are you building?"
│   │   ├── StepDomain.tsx        # Domain + scale + budget
│   │   ├── StepRecommendations.tsx # Show recommended stack
│   │   ├── StepCustomize.tsx     # Override selections
│   │   └── StepGenerate.tsx      # Generate + download
│   ├── generator/
│   │   ├── TemplateEngine.tsx    # Fill templates from selections
│   │   ├── LLMEnhancer.tsx       # Client-side LLM call UI
│   │   ├── ApiKeyInput.tsx       # Secure key input (sessionStorage)
│   │   └── MarkdownPreview.tsx   # Preview generated docs
│   └── layout/
│       ├── TopBar.tsx            # Bloomberg-style top bar
│       ├── Sidebar.tsx           # Category navigation
│       └── Footer.tsx
│
├── data/                         # Static JSON (committed to repo)
│   ├── llms.json                 # 15-20 LLMs
│   ├── frameworks.json           # 10-15 agent frameworks
│   ├── vector-dbs.json           # 10-12 vector databases
│   ├── deployment.json           # 10-12 deployment platforms
│   ├── coding-agents.json        # 8-10 coding agents
│   ├── speech-models.json        # 8-10 speech models
│   ├── image-models.json         # 8-10 image models
│   ├── video-models.json         # 5-8 video models
│   └── templates.json            # 15-20 project templates
│
├── lib/
│   ├── types.ts                  # All TypeScript interfaces
│   ├── data-loader.ts            # Import and type-check JSON data
│   ├── recommender.ts            # Score/rank tools for a project type
│   ├── generator.ts              # PRD + ARCH template generation
│   ├── llm-client.ts             # Client-side LLM API calls
│   └── utils.ts                  # Formatters, sorters, filters
│
├── templates/                    # Markdown templates for generation
│   ├── prd-template.md           # PRD skeleton with {{placeholders}}
│   └── architecture-template.md  # ARCH skeleton with {{placeholders}}
│
├── styles/
│   └── bloomberg.css             # Bloomberg terminal theme variables
│
├── public/
│   ├── logos/                    # Tool logos (SVG)
│   └── og-image.png             # Open Graph preview
│
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── PRD.md                        # This file
├── ARCHITECTURE.md               # This file
└── README.md
```

## 6. Commands

| Action | Command |
|---|---|
| Install deps | `npm install` |
| Run dev | `npm run dev` (localhost:3000) |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` |
| Deploy | `git push origin main` (Vercel auto-deploys) |
| Build container | `docker build -t stackpilot:local .` |
| Run container | `docker compose up --build` |
| Container development | `docker compose -f compose.dev.yaml up --build` |
| Update data | Edit JSON files in `/data/`, commit, push |

## 7. Testing Expectations

**Minimum bar:**
- All comparison pages render without errors
- Wizard flow completes end-to-end (5 steps → generated output)
- Template-only generation produces valid markdown
- Client-side LLM call works with a real API key
- Mobile layout doesn't break

**Where tests live:** `__tests__/` (Jest + React Testing Library)

**Must NOT be broken:**
- Data loading (if JSON is malformed, nothing works)
- Template generation (the core value prop)
- Wizard state management (step transitions, selections persist)

## 8. Git Workflow

- Branch: `feature/<component>` (e.g., `feature/comparison-tables`, `feature/wizard`)
- Commits: Short imperative (`"add LLM comparison table with sort/filter"`)
- Merge: Direct to main (solo dev, Vercel preview deploys on every push)

## 9. Agent Boundaries (for Claude Code / Cursor)

- ✅ **Always do:** Write components, add data to JSON files, write/run tests, refactor
- ⚠️ **Ask first:** Changing TypeScript interfaces in `lib/types.ts`, adding new dependencies, modifying template markdown
- 🚫 **Never do:** Commit API keys, modify `.env` files, add server-side API routes that call external LLMs

## 10. Known Risks / Fallback Plan

| Risk | Mitigation |
|---|---|
| **CORS blocks client-side Anthropic calls** | Anthropic supports `anthropic-dangerous-direct-browser-access` header; OpenAI may need a Vercel edge function proxy (still free tier) |
| **Static data goes stale** | Add `updated_at` field to every tool; show "last updated" badge; GitHub Action reminds every 2 weeks |
| **Bloomberg theme takes too long** | Start with Tailwind dark mode defaults; add Bloomberg polish incrementally |
| **Template generation feels too generic** | The LLM enhancement layer is the fix — templates are the 70% baseline, LLM makes it 95% |
| **Too many tools to curate** | Launch with top 10 per category; expand based on traffic/requests |

## 11. Bloomberg Theme Spec

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-panel: #111111;
  --bg-panel-header: #1a1a1a;
  --bg-hover: #1e1e1e;
  --border: #2a2a2a;
  --text-primary: #e0e0e0;
  --text-secondary: #888888;
  --text-muted: #555555;
  --accent-orange: #ff8c00;   /* Bloomberg orange */
  --accent-green: #00ff88;
  --accent-red: #ff4444;
  --accent-blue: #4488ff;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-sans: 'Inter', -apple-system, sans-serif;
}
```

**Key visual rules:**
- Panels have 1px `--border` outlines, 2px border-radius
- Panel headers: uppercase, 11px mono font, letter-spacing 1px
- Data tables: alternating row backgrounds (`--bg-panel` / `--bg-primary`)
- Numbers: mono font, right-aligned
- Positive/negative: green/red (never for accessibility-only info)
- Hover states: `--bg-hover` background transition

## 12. Recommendation Engine Logic

```typescript
// lib/recommender.ts

function scoreToolForProject(
  tool: AITool,
  projectType: ProjectType,
  domain: string,
  scale: string,
  budget: string
): number {
  let score = 50; // Base score

  // Check if tool is in the template's recommended list
  const template = templates.find(t => t.id === projectType);
  if (template?.recommended_stack[tool.category]?.includes(tool.id)) {
    score += 30;
  }

  // Budget fit
  if (budget === 'free' && tool.pricing.free_tier) score += 15;
  if (budget === 'free' && !tool.pricing.free_tier) score -= 20;

  // Scale fit
  if (scale === 'prototype' && tool.tags.includes('easy-setup')) score += 10;
  if (scale === 'enterprise' && tool.tags.includes('enterprise')) score += 15;

  // Domain match
  if (tool.best_for.some(b => b.toLowerCase().includes(domain.toLowerCase()))) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}
```
