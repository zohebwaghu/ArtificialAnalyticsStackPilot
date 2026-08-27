import { describe, expect, it } from "vitest";
import { filterMarketplace, marketplaceItems } from "@/lib/marketplace";

describe("marketplace catalog", () => {
  it("contains only no-key or documented free-tier API entries", () => {
    expect(marketplaceItems.length).toBeGreaterThanOrEqual(15);
    expect(marketplaceItems.every((item) => ["none", "free-tier"].includes(item.api_access))).toBe(true);
  });

  it("filters across capability and kind", () => {
    const results = filterMarketplace("debugging", "skill", "all");
    expect(results.map((item) => item.id)).toContain("systematic-debugging");
    expect(results.every((item) => item.kind === "skill")).toBe(true);
  });

  it("keeps source and license provenance for every item", () => {
    expect(marketplaceItems.every((item) => item.source_url.startsWith("https://github.com/") && item.license.length > 1)).toBe(true);
  });
});
