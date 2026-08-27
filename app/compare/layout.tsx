import Link from "next/link";

const links = [["llms","LLMs"],["frameworks","Frameworks"],["vector-dbs","Vector DBs"],["deployment","Deployment"],["coding-agents","Coding agents"],["models","Media models"]];

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <main className="shell py-8"><div className="mb-5 flex gap-1 overflow-x-auto border-b border-[var(--line)] pb-2">{links.map(([slug,label]) => <Link className="btn whitespace-nowrap !min-h-8 !px-3 !text-[10px]" key={slug} href={`/compare/${slug}`}>{label}</Link>)}</div>{children}</main>;
}
