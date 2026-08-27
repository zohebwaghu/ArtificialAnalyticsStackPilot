import { z } from "zod";
import rawTemplates from "@/data/templates.json";
import rawTools from "@/data/tools.json";
import { toolCategories, type AITool, type ProjectTemplate, type StackLayer, type ToolCategory } from "@/lib/types";

const pricingSchema = z.object({
  model: z.enum(["free", "freemium", "usage-based", "subscription", "open-source"]),
  free_tier: z.boolean(),
  starting_price: z.string().optional(),
});

const toolSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  provider: z.string().min(1),
  category: z.enum(toolCategories),
  description: z.string().min(1),
  website_url: z.url(),
  pricing: pricingSchema,
  best_for: z.array(z.string()),
  tags: z.array(z.string()),
  updated_at: z.iso.date(),
  metrics: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const stackSchema = z.object({
  llm: z.array(z.string()),
  framework: z.array(z.string()),
  vector_db: z.array(z.string()),
  deployment: z.array(z.string()),
  coding_agent: z.array(z.string()),
});

const templateSchema = z.object({
  id: z.enum(["rag_chatbot", "coding_agent", "data_pipeline", "image_gen_app", "voice_assistant", "video_analysis", "document_processor", "multimodal_app", "autonomous_agent"]),
  name: z.string(),
  description: z.string(),
  recommended_stack: stackSchema,
  skills_required: z.array(z.string()),
  estimated_time: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  domains: z.array(z.string()),
});

export const tools: AITool[] = z.array(toolSchema).parse(rawTools) as AITool[];
export const templates: ProjectTemplate[] = z.array(templateSchema).parse(rawTemplates) as ProjectTemplate[];
export const toolsById = Object.fromEntries(tools.map((tool) => [tool.id, tool]));

export const layerCategory: Record<StackLayer, ToolCategory> = {
  llm: "llm",
  framework: "agent_framework",
  vector_db: "vector_db",
  deployment: "deployment",
  coding_agent: "coding_agent",
};

export function getToolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function getTemplate(id: string) {
  return templates.find((template) => template.id === id);
}
