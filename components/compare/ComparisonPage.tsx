import { Panel } from "@/components/ui/Panel";
import { ToolTable } from "@/components/ui/ToolTable";
import { getToolsByCategory } from "@/lib/data-loader";
import type { ToolCategory } from "@/lib/types";

export function ComparisonPage({ title, description, categories }: { title: string; description: string; categories: ToolCategory[] }) {
  const rows = categories.flatMap(getToolsByCategory);
  return <><div className="mb-6"><p className="eyebrow">Comparison terminal / {rows.length} results</p><h1 className="mt-2 text-3xl font-bold">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{description}</p></div><Panel title={`${title} instrument table`} action={<span className="text-[var(--green)]">● Indexed</span>}><ToolTable tools={rows} /></Panel></>;
}
