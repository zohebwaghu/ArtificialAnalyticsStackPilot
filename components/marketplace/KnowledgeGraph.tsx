"use client";

import { useState } from "react";

const nodes = [
  { id:"project", label:"AI PROJECT", type:"entity", x:380, y:225, color:"#ff9d00", detail:"The project being composed in StackPilot." },
  { id:"skills", label:"SKILLS", type:"entity", x:165, y:105, color:"#5da8ff", detail:"Repeatable instructions loaded when a task matches." },
  { id:"agents", label:"AGENTS", type:"entity", x:165, y:345, color:"#c084fc", detail:"Specialist roles with defined deliverables and boundaries." },
  { id:"tools", label:"TOOLS", type:"entity", x:595, y:105, color:"#41d68b", detail:"Models, frameworks, stores, and deployment platforms." },
  { id:"evidence", label:"EVIDENCE", type:"episode", x:595, y:345, color:"#ff6262", detail:"Source repositories and dated review snapshots." },
  { id:"plan", label:"STACK PLAN", type:"fact", x:380, y:470, color:"#ffd166", detail:"A reviewable selection of tools, skills, and agent roles." },
] as const;
const edges = [
  ["skills","project","extends"],["agents","project","operates"],["tools","project","powers"],["evidence","project","grounds"],
  ["project","plan","produces"],["evidence","plan","validates"],["skills","agents","equips"],["tools","agents","enables"],
] as const;

export function KnowledgeGraph() {
  const [selected, setSelected] = useState<(typeof nodes)[number]>(nodes[0]);
  const byId = Object.fromEntries(nodes.map((node) => [node.id,node]));
  return <div className="grid gap-4 p-5 lg:grid-cols-[1fr_270px]">
    <div className="overflow-hidden border border-[var(--line)] bg-[#080b0d]">
      <svg viewBox="0 0 760 560" role="img" aria-label="Temporal knowledge graph of a StackPilot project" className="h-auto w-full min-w-[620px]">
        <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#46515c"/></marker></defs>
        {edges.map(([from,to,label]) => { const a=byId[from], b=byId[to]; const mx=(a.x+b.x)/2, my=(a.y+b.y)/2; return <g key={`${from}-${to}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#46515c" strokeWidth="1.5" markerEnd="url(#arrow)"/><rect x={mx-34} y={my-9} width="68" height="18" fill="#080b0d"/><text x={mx} y={my+3} textAnchor="middle" fill="#798692" fontSize="9" fontFamily="monospace">{label}</text></g>; })}
        {nodes.map((node) => <g key={node.id} role="button" tabIndex={0} aria-label={`${node.label}: ${node.detail}`} onClick={() => setSelected(node)} onKeyDown={(event) => { if(event.key === "Enter" || event.key === " ") setSelected(node); }} className="cursor-pointer outline-none"><circle cx={node.x} cy={node.y} r={selected.id===node.id ? 48 : 41} fill="#0d1216" stroke={node.color} strokeWidth={selected.id===node.id ? 3 : 1.5}/><text x={node.x} y={node.y-3} textAnchor="middle" fill="#e6edf3" fontSize="11" fontWeight="bold" fontFamily="monospace">{node.label}</text><text x={node.x} y={node.y+14} textAnchor="middle" fill={node.color} fontSize="8" fontFamily="monospace">{node.type.toUpperCase()}</text></g>)}
      </svg>
    </div>
    <aside className="space-y-4"><div className="border border-[var(--line)] bg-[#090c0f] p-4"><span className="eyebrow">Selected {selected.type}</span><h3 className="mt-2 text-lg font-bold">{selected.label}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{selected.detail}</p></div><div className="border border-[var(--line)] p-4 font-mono text-[10px] leading-5 text-[var(--muted)]"><p><span className="text-[var(--green)]">VALID FROM</span> 2026-08-27</p><p><span className="text-[var(--orange)]">PROVENANCE</span> curated repository snapshot</p><p><span className="text-[var(--blue)]">ONTOLOGY</span> entity / fact / episode</p></div><p className="text-xs leading-5 text-[var(--muted)]">This zero-key visualization applies Graphiti’s temporal context-graph concepts; it does not run or impersonate the Graphiti service.</p></aside>
  </div>;
}
