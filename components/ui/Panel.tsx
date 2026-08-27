import type { ReactNode } from "react";

export function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel overflow-hidden ${className}`}><div className="panel-header"><span>{title}</span>{action}</div>{children}</section>;
}
