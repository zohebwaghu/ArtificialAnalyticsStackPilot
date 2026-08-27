"use client";

import { useMemo, useState } from "react";
import type { AITool } from "@/lib/types";

type SortKey = "name" | "provider" | "updated_at";

export function ToolTable({ tools }: { tools: AITool[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [freeOnly, setFreeOnly] = useState(false);
  const rows = useMemo(() => tools
    .filter((tool) => !freeOnly || tool.pricing.free_tier)
    .filter((tool) => [tool.name, tool.provider, ...tool.tags, ...tool.best_for].join(" ").toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => String(a[sort]).localeCompare(String(b[sort]))), [tools, query, sort, freeOnly]);

  return <>
    <div className="grid gap-3 border-b border-[var(--line)] p-3 sm:grid-cols-[1fr_170px_auto]">
      <label><span className="sr-only">Filter tools</span><input className="field mono text-xs" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="FILTER NAME, TAG, USE CASE…" /></label>
      <label><span className="sr-only">Sort tools</span><select className="field mono text-xs" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}><option value="name">SORT: NAME</option><option value="provider">SORT: PROVIDER</option><option value="updated_at">SORT: UPDATED</option></select></label>
      <label className="flex items-center gap-2 px-2 font-mono text-[11px] text-[var(--muted)]"><input type="checkbox" checked={freeOnly} onChange={(event) => setFreeOnly(event.target.checked)} /> FREE TIER</label>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead><tr className="bg-[#0a0d10] font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]"><th className="p-3">Tool</th><th>Provider</th><th>Best for</th><th>Pricing</th><th>Signals</th><th>Updated</th></tr></thead>
        <tbody>{rows.map((tool) => <tr key={tool.id} className="border-t border-[var(--line)] text-sm hover:bg-[#151b20]">
          <td className="p-3"><a href={tool.website_url} target="_blank" rel="noreferrer" className="font-semibold hover:text-[var(--orange)]">{tool.name} ↗</a><p className="mt-1 max-w-80 text-xs leading-5 text-[var(--muted)]">{tool.description}</p></td>
          <td className="font-mono text-xs">{tool.provider}</td>
          <td><div className="flex max-w-64 flex-wrap gap-1">{tool.best_for.slice(0, 3).map((item) => <span className="tag" key={item}>{item}</span>)}</div></td>
          <td className="font-mono text-xs"><span className={tool.pricing.free_tier ? "text-[var(--green)]" : ""}>{tool.pricing.model}</span></td>
          <td><div className="space-y-1 font-mono text-[10px] text-[var(--muted)]">{Object.entries(tool.metrics ?? {}).slice(0, 3).map(([key, value]) => <div key={key}><span className="text-[#637080]">{key.replaceAll("_", " ")}:</span> {String(value)}</div>)}</div></td>
          <td className="font-mono text-[10px] text-[var(--muted)]">{tool.updated_at}</td>
        </tr>)}</tbody>
      </table>
      {!rows.length && <p className="p-8 text-center text-sm text-[var(--muted)]">No tools match this filter.</p>}
    </div>
  </>;
}
