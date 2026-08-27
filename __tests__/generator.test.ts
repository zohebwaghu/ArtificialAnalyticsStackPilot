import { describe, expect, it } from "vitest";
import { toolsById } from "@/lib/data-loader";
import { generateFromTemplate } from "@/lib/generator";

describe("document generator", () => {
  it("generates project-specific, usable markdown", () => {
    const result = generateFromTemplate({
      projectName: "Clinical Notes Assistant",
      projectType: "document_processor",
      domain: "healthcare",
      scale: "production",
      budget: "medium",
      teamSize: "small",
      selectedStack: { llm: "claude-sonnet-4", framework: "llamaindex", vector_db: "pgvector", deployment: "vercel", coding_agent: "codex" },
      tools: toolsById,
    });
    expect(result.prdMarkdown).toContain("# PRD: Clinical Notes Assistant");
    expect(result.prdMarkdown).toContain("healthcare");
    expect(result.architectureMarkdown).toContain("| Language model | Claude Sonnet 4 |");
    expect(result.architectureMarkdown).toContain("interface TaskRequest");
  });
});
