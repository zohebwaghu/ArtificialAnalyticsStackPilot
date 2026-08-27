import { z } from "zod";
import rawMarketplace from "@/data/marketplace.json";
import type { MarketplaceItem } from "@/lib/types";

const marketplaceItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["skill", "plugin", "agent", "resource"]),
  category: z.enum(["engineering", "quality", "planning", "knowledge", "documents", "agents", "learning"]),
  source: z.string().min(1),
  source_url: z.url(),
  description: z.string().min(1),
  capabilities: z.array(z.string()).min(1),
  install_command: z.string().optional(),
  license: z.string().min(1),
  api_access: z.enum(["none", "free-tier"]),
  compatibility: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  reviewed_at: z.iso.date(),
});

export const marketplaceItems = z.array(marketplaceItemSchema).parse(rawMarketplace) as MarketplaceItem[];

export function filterMarketplace(query: string, kind: string, category: string) {
  const needle = query.trim().toLowerCase();
  return marketplaceItems.filter((item) => {
    const searchable = [item.name, item.source, item.description, ...item.capabilities, ...item.compatibility].join(" ").toLowerCase();
    return (!needle || searchable.includes(needle)) && (kind === "all" || item.kind === kind) && (category === "all" || item.category === category);
  });
}
