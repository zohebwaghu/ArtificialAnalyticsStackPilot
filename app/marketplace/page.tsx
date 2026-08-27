import type { Metadata } from "next";
import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = { title: "Skills Marketplace", description: "Browse curated agent skills, plugins, specialist agents, and knowledge resources." };
export default function MarketplacePage(){ return <MarketplaceClient/>; }
