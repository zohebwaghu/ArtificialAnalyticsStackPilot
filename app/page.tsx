import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { templates, tools } from "@/lib/data-loader";

const categories = [
  ["llm", "Language models", "/compare/llms", "Reasoning, context, openness, and modality"],
  ["agent_framework", "Agent frameworks", "/compare/frameworks", "Orchestration, tools, state, and complexity"],
  ["vector_db", "Vector databases", "/compare/vector-dbs", "Hosting, retrieval, scale, and free tiers"],
  ["deployment", "Deployment", "/compare/deployment", "Runtime, edge reach, operations, and cost"],
  ["coding_agent", "Coding agents", "/compare/coding-agents", "Repository workflows, IDEs, and autonomy"],
  ["models", "Media models", "/compare/models", "Speech, image, and video capabilities"],
] as const;

export default function Home() {
  return <main className="shell">
    <section className="grid min-h-[540px] items-center gap-12 py-20 lg:grid-cols-[1.15fr_.85fr]">
      <div>
        <p className="eyebrow mb-5">AI infrastructure intelligence / snapshot 2026.08</p>
        <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-[-.05em] sm:text-7xl">Choose your AI stack with <span className="text-[var(--orange)]">evidence.</span></h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-[#a6b0bb] sm:text-lg">Compare the tools that matter, rank them against your constraints, and leave with a usable PRD and architecture—not another bookmark folder.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link href="/build" className="btn btn-primary">Start stack wizard →</Link><Link href="/compare/llms" className="btn">Open comparison terminal</Link></div>
      </div>
      <Panel title="Market pulse" action={<span className="text-[var(--green)]">Live snapshot</span>}>
        <div className="grid grid-cols-2">
          {[[tools.length,"CURATED TOOLS"],[templates.length,"PROJECT BLUEPRINTS"],["08","STACK LAYERS"],["$0","OPERATOR API COST"]].map(([value,label]) => <div key={label} className="border-b border-r border-[var(--line)] p-6"><div className="mono text-3xl font-black text-[var(--green)]">{value}</div><div className="mt-2 font-mono text-[10px] tracking-wider text-[var(--muted)]">{label}</div></div>)}
        </div>
        <div className="p-4 font-mono text-[11px] leading-6 text-[var(--muted)]"><span className="text-[var(--orange)]">NOTICE //</span> Benchmark and pricing data are curated snapshots. Follow source links and verify decisions before production procurement.</div>
      </Panel>
    </section>

    <section>
      <div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Comparison matrix</p><h2 className="mt-2 text-2xl font-bold">Explore the stack layer by layer</h2></div><span className="mono hidden text-[10px] text-[var(--muted)] sm:block">SELECT MODULE ↓</span></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{categories.map(([category,name,href,description], index) => <Link href={href} key={category} className="panel group p-5 transition hover:border-[var(--orange)] hover:bg-[#12171c]"><div className="flex items-start justify-between"><span className="mono text-[11px] text-[var(--orange)]">0{index+1}</span><span className="text-[var(--muted)] group-hover:text-[var(--orange)]">↗</span></div><h3 className="mt-8 text-xl font-bold">{name}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p><p className="mono mt-5 text-[10px] uppercase text-[#65717c]">{category === "models" ? 3 : tools.filter((tool) => tool.category === category).length} instruments indexed</p></Link>)}</div>
    </section>
  </main>;
}
