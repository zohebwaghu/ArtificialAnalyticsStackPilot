import type { GeneratorInput, GeneratorOutput, StackLayer } from "@/lib/types";

const layers: Array<[StackLayer, string]> = [
  ["llm", "Language model"],
  ["framework", "Agent framework"],
  ["vector_db", "Vector store"],
  ["deployment", "Deployment"],
  ["coding_agent", "Coding agent"],
];

const selected = (input: GeneratorInput, layer: StackLayer) => {
  const id = input.selectedStack[layer];
  return id ? input.tools[id] : undefined;
};

export function generateFromTemplate(input: GeneratorInput): GeneratorOutput {
  const stackRows = layers.map(([layer, label]) => {
    const tool = selected(input, layer);
    return `| ${label} | ${tool?.name ?? "Not selected"} | ${tool?.description ?? "Choose during implementation."} |`;
  }).join("\n");
  const primary = selected(input, "llm")?.name ?? "a suitable language model";
  const framework = selected(input, "framework")?.name ?? "a lightweight orchestration layer";

  const prdMarkdown = `# PRD: ${input.projectName}

**One-liner:** A ${input.projectType.replaceAll("_", " ")} for ${input.domain}, built with ${primary} and ${framework}.

## 1. Problem and opportunity

Teams in ${input.domain} need a focused way to complete the core ${input.projectType.replaceAll("_", " ")} workflow without stitching together disconnected AI tools. The product will turn a clearly scoped user request into a reliable, reviewable result while keeping latency, cost, and operational complexity appropriate for a ${input.scale} deployment.

## 2. Users and jobs to be done

- Primary user: a ${input.domain} practitioner who needs accurate results without learning the underlying model stack.
- Operator: the ${input.teamSize} product team responsible for prompts, evaluations, content, and incidents.
- Job: submit source context or an instruction, review the system output, correct it when necessary, and export or act on the result.

## 3. Goals

- Deliver the primary workflow in fewer than three user decisions.
- Ground important claims in supplied context and expose uncertainty.
- Provide observable model latency, failures, cost, and quality signals.
- Support the selected ${input.scale} scale within a ${input.budget} budget profile.

## 4. Non-goals

- Training a foundation model from scratch.
- Fully autonomous high-impact decisions without human approval.
- Supporting every model provider in the first release.

## 5. Functional requirements

1. Accept and validate a user request and any permitted source material.
2. Route the request through ${framework} to ${primary}.
3. Return a structured result with status, provenance, and recoverable errors.
4. Capture explicit user feedback for offline evaluation.
5. Enforce rate, token, timeout, and content limits before model invocation.
6. Allow operators to change prompts and model configuration without changing the public contract.

## 6. Success criteria

- At least 90% task completion on the launch evaluation set.
- P95 end-to-end latency and per-task cost are measured before production rollout.
- Every model call has a trace identifier and sanitized error state.
- Zero secrets or sensitive source documents are written to client logs.

## 7. Risks and safeguards

The team will test hallucination, prompt injection, data leakage, and unsafe tool use. High-impact actions require explicit confirmation. Model outputs are untrusted data: validate structured responses, constrain tools, redact logs, and maintain a deterministic fallback path.

## 8. Delivery plan

1. Prototype the happy path and create a representative evaluation dataset.
2. Build the typed API boundary, persistence, and observability.
3. Run quality, security, cost, and load gates in staging.
4. Release gradually with rollback thresholds and operator runbooks.
`;

  const architectureMarkdown = `# Architecture: ${input.projectName}

## 1. System context

The system is a ${input.scale} ${input.projectType.replaceAll("_", " ")} for ${input.domain}. A typed application boundary separates user-facing code from model providers so prompts, vendors, and retrieval strategies can evolve independently.

## 2. Technology stack

| Layer | Choice | Rationale |
|---|---|---|
${stackRows}

## 3. Components

| Component | Responsibility |
|---|---|
| Web application | Input validation, accessible workflow, progress, and review UI |
| Application service | Authorization, rate limits, orchestration, and stable response contracts |
| AI gateway | Provider adapter, timeouts, retries, token budgets, and structured output validation |
| Retrieval layer | Ingestion, access-aware retrieval, citations, and freshness policy |
| Evaluation pipeline | Versioned datasets, regression checks, latency, quality, and cost reporting |
| Observability | Redacted traces, metrics, alerts, and incident correlation |

## 4. Interface contracts

\`\`\`typescript
interface TaskRequest {
  requestId: string;
  input: string;
  contextIds?: string[];
}

interface TaskResult {
  requestId: string;
  status: "completed" | "needs_review" | "failed";
  output?: unknown;
  citations?: Array<{ sourceId: string; excerpt: string }>;
  error?: { code: string; retryable: boolean };
}
\`\`\`

## 5. Request flow

1. Validate and authorize the request at the application boundary.
2. Retrieve only sources the caller may access.
3. Assemble a versioned prompt and invoke ${primary} through an adapter.
4. Validate the structured output; retry only transient, idempotent failures.
5. Return the result and record redacted quality and performance signals.

## 6. Security and reliability

- Keep provider secrets server-side in production and rotate them through the deployment secret store.
- Treat retrieved text and model output as untrusted input.
- Apply least privilege to every tool and require approval for consequential actions.
- Use bounded retries, circuit breakers, idempotency keys, and provider fallbacks.
- Never place personal or regulated content in prompts without an approved data policy.

## 7. Verification commands

\`\`\`bash
npm run lint
npm run typecheck
npm test
npm run build
\`\`\`
`;

  return { prdMarkdown, architectureMarkdown };
}

export function downloadMarkdown(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/markdown;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
