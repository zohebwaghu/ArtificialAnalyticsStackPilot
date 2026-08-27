import { getTemplate, getToolsByCategory, layerCategory } from "@/lib/data-loader";
import type { AITool, Budget, ProjectType, RankedRecommendation, Scale, StackLayer, StackRecommendation } from "@/lib/types";

const layers: StackLayer[] = ["llm", "framework", "vector_db", "deployment", "coding_agent"];

export function scoreToolForProject(tool: AITool, projectType: ProjectType, domain: string, scale: Scale, budget: Budget) {
  const template = getTemplate(projectType);
  const layer = layers.find((candidate) => layerCategory[candidate] === tool.category);
  let score = 45;

  if (layer) {
    const rank = template?.recommended_stack[layer].indexOf(tool.id) ?? -1;
    if (rank >= 0) score += 30 - rank * 6;
  }
  if (budget === "free") score += tool.pricing.free_tier ? 18 : -22;
  if (budget === "low" && tool.pricing.free_tier) score += 10;
  if (scale === "prototype" && tool.tags.some((tag) => ["easy-setup", "free-tier"].includes(tag))) score += 10;
  if (["production", "enterprise"].includes(scale) && tool.tags.includes("enterprise")) score += 12;

  const terms = domain.toLowerCase().split(/\W+/).filter((term) => term.length > 2);
  const searchable = [...tool.best_for, ...tool.tags].join(" ").toLowerCase();
  if (terms.some((term) => searchable.includes(term))) score += 8;

  return Math.max(0, Math.min(100, score));
}

function explain(tool: AITool, score: number, budget: Budget): RankedRecommendation {
  const freeFit = tool.pricing.free_tier ? "with a free starting path" : "as a paid managed option";
  return {
    tool_id: tool.id,
    score,
    reason: `${tool.name} fits ${tool.best_for.slice(0, 2).join(" and ")} ${freeFit}.`,
    tradeoff: budget === "free" && !tool.pricing.free_tier ? "No free tier; validate costs before committing." : `Optimized for ${tool.best_for[0]}; less specialized outside that area.`,
  };
}

export function recommendStack(projectType: ProjectType, domain: string, scale: Scale, budget: Budget): StackRecommendation {
  return Object.fromEntries(
    layers.map((layer) => {
      const ranked = getToolsByCategory(layerCategory[layer])
        .map((tool) => ({ tool, score: scoreToolForProject(tool, projectType, domain, scale, budget) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ tool, score }) => explain(tool, score, budget));
      return [layer, ranked];
    }),
  ) as StackRecommendation;
}
