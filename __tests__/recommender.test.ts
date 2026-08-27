import { describe, expect, it } from "vitest";
import { toolsById } from "@/lib/data-loader";
import { recommendStack, scoreToolForProject } from "@/lib/recommender";

describe("recommendation engine", () => {
  it("ranks a template-recommended RAG model first", () => {
    const result = recommendStack("rag_chatbot", "support", "mvp", "low");
    expect(["claude-sonnet-4", "gpt-5"]).toContain(result.llm[0].tool_id);
  });

  it("rewards free tools for free projects", () => {
    const free = scoreToolForProject(toolsById["gemini-2-5-pro"], "multimodal_app", "media", "prototype", "free");
    const paid = scoreToolForProject(toolsById["gpt-5"], "multimodal_app", "media", "prototype", "free");
    expect(free).toBeGreaterThan(paid);
  });

  it("keeps every score in range", () => {
    const result = recommendStack("autonomous_agent", "operations", "enterprise", "high");
    expect(Object.values(result).flat().every(({ score }) => score >= 0 && score <= 100)).toBe(true);
  });
});
