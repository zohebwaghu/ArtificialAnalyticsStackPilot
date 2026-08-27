const divisions = [
  { name: "Engineering", accent: "var(--blue)", agents: ["Software Architect", "AI Engineer", "Frontend Developer", "SRE"] },
  { name: "Design", accent: "#c084fc", agents: ["UI Designer", "UX Researcher", "Brand Guardian", "Whimsy Injector"] },
  { name: "Quality", accent: "var(--green)", agents: ["Code Reviewer", "Evidence Collector", "Reality Checker", "Incident Commander"] },
  { name: "Growth", accent: "var(--orange)", agents: ["Growth Hacker", "Content Creator", "Reddit Builder", "Analytics Reporter"] },
] as const;

export function OrgChart() {
  return <div className="p-5">
    <div className="mx-auto max-w-6xl text-center">
      <div className="mx-auto w-fit border border-[var(--orange)] bg-[#18140d] px-8 py-4">
        <span className="eyebrow">Human owner</span><h3 className="mt-1 font-bold">Product Director</h3><p className="mt-1 text-xs text-[var(--muted)]">Approves scope, risk, and release</p>
      </div>
      <div className="mx-auto h-7 w-px bg-[var(--line)]" />
      <div className="mx-auto w-fit border border-[var(--line)] bg-[var(--panel-2)] px-8 py-4">
        <span className="eyebrow">Orchestration</span><h3 className="mt-1 font-bold">Agency Lead</h3><p className="mt-1 text-xs text-[var(--muted)]">Routes work and consolidates evidence</p>
      </div>
      <div className="mx-auto h-7 w-px bg-[var(--line)]" />
      <div className="relative grid gap-3 lg:grid-cols-4 before:absolute before:-top-1 before:left-[12.5%] before:right-[12.5%] before:h-px before:bg-[var(--line)]">
        {divisions.map((division) => <section className="relative border border-[var(--line)] bg-[#090c0f] p-4 pt-5 text-left before:absolute before:-top-7 before:left-1/2 before:h-7 before:w-px before:bg-[var(--line)]" key={division.name}>
          <div className="mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:division.accent}}/><h4 className="font-mono text-xs font-bold uppercase">{division.name}</h4></div>
          <ul className="space-y-2">{division.agents.map((agent,index) => <li className="flex items-center justify-between border border-[#202932] bg-[#0d1216] px-3 py-2 text-xs" key={agent}><span>{agent}</span><span className="font-mono text-[9px] text-[var(--muted)]">A{index+1}</span></li>)}</ul>
        </section>)}
      </div>
    </div>
    <p className="mt-6 text-xs leading-5 text-[var(--muted)]">Derived as a compact planning view from the division-and-specialist pattern in <a className="text-[var(--orange)] hover:underline" href="https://github.com/msitarzewski/agency-agents" target="_blank" rel="noreferrer">msitarzewski/agency-agents ↗</a>. Roles are advisory; consequential decisions stay with the human owner.</p>
  </div>;
}
