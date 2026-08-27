import { Suspense } from "react";
import { StackWizard } from "@/components/wizard/StackWizard";

export default function BuildPage() {
  return <Suspense fallback={<main className="shell py-8"><div className="panel p-8 font-mono text-xs text-[var(--muted)]">INITIALIZING STACK TERMINAL…</div></main>}><StackWizard /></Suspense>;
}
