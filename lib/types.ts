export const toolCategories = [
  "llm",
  "agent_framework",
  "vector_db",
  "deployment",
  "coding_agent",
  "speech_model",
  "image_model",
  "video_model",
] as const;

export type ToolCategory = (typeof toolCategories)[number];
export type ProjectType =
  | "rag_chatbot"
  | "coding_agent"
  | "data_pipeline"
  | "image_gen_app"
  | "voice_assistant"
  | "video_analysis"
  | "document_processor"
  | "multimodal_app"
  | "autonomous_agent";
export type Scale = "prototype" | "mvp" | "production" | "enterprise";
export type Budget = "free" | "low" | "medium" | "high";
export type TeamSize = "solo" | "small" | "large";

export interface PricingInfo {
  model: "free" | "freemium" | "usage-based" | "subscription" | "open-source";
  free_tier: boolean;
  starting_price?: string;
}

export interface AITool {
  id: string;
  name: string;
  provider: string;
  category: ToolCategory;
  description: string;
  website_url: string;
  pricing: PricingInfo;
  best_for: string[];
  tags: string[];
  updated_at: string;
  metrics?: Record<string, string | number | boolean>;
}

export type StackLayer = "llm" | "framework" | "vector_db" | "deployment" | "coding_agent";
export type SelectedStack = Record<StackLayer, string | null>;

export interface RankedRecommendation {
  tool_id: string;
  score: number;
  reason: string;
  tradeoff: string;
}

export type StackRecommendation = Record<StackLayer, RankedRecommendation[]>;

export interface ProjectTemplate {
  id: ProjectType;
  name: string;
  description: string;
  recommended_stack: Record<StackLayer, string[]>;
  skills_required: string[];
  estimated_time: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  domains: string[];
}

export interface WizardAnswers {
  projectName: string;
  projectType: ProjectType;
  domain: string;
  scale: Scale;
  budget: Budget;
  teamSize: TeamSize;
}

export interface GeneratorInput extends WizardAnswers {
  selectedStack: SelectedStack;
  tools: Record<string, AITool>;
}

export interface GeneratorOutput {
  prdMarkdown: string;
  architectureMarkdown: string;
}

export type MarketplaceKind = "skill" | "plugin" | "agent" | "resource";

export interface MarketplaceItem {
  id: string;
  name: string;
  kind: MarketplaceKind;
  category: "engineering" | "quality" | "planning" | "knowledge" | "documents" | "agents" | "learning";
  source: string;
  source_url: string;
  description: string;
  capabilities: string[];
  install_command?: string;
  license: string;
  api_access: "none" | "free-tier";
  compatibility: string[];
  featured?: boolean;
  reviewed_at: string;
}
