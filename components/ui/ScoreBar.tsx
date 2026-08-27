export function ScoreBar({ value }: { value: number }) {
  return <div className="flex min-w-28 items-center gap-2"><div className="h-1.5 flex-1 bg-[#222a31]"><div className="h-full bg-[var(--green)]" style={{ width: `${value}%` }} /></div><span className="metric w-7 text-right text-xs">{value}</span></div>;
}
