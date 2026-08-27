import Link from "next/link";

const nav = [
  ["/", "Overview"],
  ["/compare/llms", "Compare"],
  ["/marketplace", "Marketplace"],
  ["/templates", "Templates"],
  ["/about", "About"],
] as const;

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#07090bf2] backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-[1480px] items-center gap-5 px-[22px]">
        <Link href="/" className="mono text-[15px] font-black tracking-tight">
          <span className="text-[var(--orange)]">SP</span><span className="text-[var(--muted)]">{"//"}</span>STACKPILOT
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {nav.map(([href, label]) => <Link key={href} href={href} className="px-3 py-2 font-mono text-[11px] uppercase text-[var(--muted)] hover:text-white">{label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-mono text-[10px] text-[var(--green)] sm:inline">● DATA ONLINE</span>
          <Link className="btn btn-primary" href="/build">Build my stack →</Link>
        </div>
      </div>
    </header>
  );
}
