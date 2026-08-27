"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Panel } from "@/components/ui/Panel";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { layerCategory, templates, tools, toolsById } from "@/lib/data-loader";
import { downloadMarkdown, generateFromTemplate } from "@/lib/generator";
import { enhanceMarkdown } from "@/lib/llm-client";
import { recommendStack } from "@/lib/recommender";
import type { Budget, GeneratorOutput, ProjectType, Scale, SelectedStack, StackLayer, TeamSize } from "@/lib/types";

const layers: Array<[StackLayer, string]> = [["llm","Language model"],["framework","Agent framework"],["vector_db","Vector database"],["deployment","Deployment"],["coding_agent","Coding agent"]];
const emptyStack: SelectedStack = { llm: null, framework: null, vector_db: null, deployment: null, coding_agent: null };

export function StackWizard() {
  const initialType = useSearchParams().get("type") ?? undefined;
  const validInitial = templates.some((item) => item.id === initialType) ? initialType as ProjectType : "rag_chatbot";
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("My AI Project");
  const [projectType, setProjectType] = useState<ProjectType>(validInitial);
  const [domain, setDomain] = useState("knowledge management");
  const [scale, setScale] = useState<Scale>("mvp");
  const [budget, setBudget] = useState<Budget>("low");
  const [teamSize, setTeamSize] = useState<TeamSize>("solo");
  const [selectedStack, setSelectedStack] = useState<SelectedStack>(emptyStack);
  const [output, setOutput] = useState<GeneratorOutput | null>(null);
  const [activeDoc, setActiveDoc] = useState<"prd" | "architecture">("prd");
  const [apiKey, setApiKey] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState("");

  const recommendations = useMemo(() => recommendStack(projectType, domain, scale, budget), [projectType, domain, scale, budget]);
  const chooseRecommended = () => setSelectedStack(Object.fromEntries(layers.map(([layer]) => [layer, recommendations[layer][0]?.tool_id ?? null])) as SelectedStack);
  const proceedFromRecommendations = () => { chooseRecommended(); setStep(4); };
  const generate = () => {
    const result = generateFromTemplate({ projectName, projectType, domain, scale, budget, teamSize, selectedStack, tools: toolsById });
    setOutput(result); setStep(5); setError("");
  };
  const enhance = async () => {
    if (!output || !apiKey) return;
    setEnhancing(true); setError("");
    try {
      const key = activeDoc === "prd" ? "prdMarkdown" : "architectureMarkdown";
      const improved = await enhanceMarkdown(apiKey, output[key]);
      if (!improved) throw new Error("The provider returned no text.");
      setOutput({ ...output, [key]: improved });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Enhancement failed."); }
    finally { setEnhancing(false); }
  };

  return <main className="shell py-8">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Stack construction terminal</p><h1 className="mt-2 text-3xl font-bold">Build a decision-ready AI stack</h1></div><span className="mono text-xs text-[var(--muted)]">STEP <b className="text-[var(--orange)]">0{step}</b> / 05</span></div>
    <ol aria-label="Wizard progress" className="mb-6 grid grid-cols-5 gap-1">{["Project","Constraints","Rank","Customize","Export"].map((label,index) => <li key={label} className={`border-t-2 pt-2 font-mono text-[9px] uppercase ${index + 1 <= step ? "border-[var(--orange)] text-white" : "border-[var(--line)] text-[var(--muted)]"}`}>{label}</li>)}</ol>

    {step === 1 && <Panel title="01 / Project profile"><div className="p-5"><label className="block"><span className="eyebrow">Project name</span><input className="field mt-2" value={projectName} onChange={(event) => setProjectName(event.target.value)} /></label><p className="eyebrow mb-3 mt-7">What are you building?</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{templates.map((template) => <button key={template.id} onClick={() => setProjectType(template.id)} className={`min-h-28 border p-4 text-left transition ${projectType === template.id ? "border-[var(--orange)] bg-[#1a160e]" : "border-[var(--line)] bg-[#090c0f] hover:border-[#56616c]"}`}><span className="font-semibold">{template.name}</span><span className="mt-2 block text-xs leading-5 text-[var(--muted)]">{template.description}</span></button>)}</div><div className="mt-6 flex justify-end"><button disabled={!projectName.trim()} className="btn btn-primary" onClick={() => setStep(2)}>Set constraints →</button></div></div></Panel>}

    {step === 2 && <Panel title="02 / Operating constraints"><div className="grid gap-5 p-5 md:grid-cols-2"><Field label="Domain or industry"><input className="field" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="e.g. healthcare operations" /></Field><Field label="Target scale"><select className="field" value={scale} onChange={(event) => setScale(event.target.value as Scale)}><option value="prototype">Prototype</option><option value="mvp">Startup MVP</option><option value="production">Production</option><option value="enterprise">Enterprise</option></select></Field><Field label="Budget profile"><select className="field" value={budget} onChange={(event) => setBudget(event.target.value as Budget)}><option value="free">Free only</option><option value="low">Low · under $50/mo</option><option value="medium">Medium · under $500/mo</option><option value="high">High / enterprise</option></select></Field><Field label="Team size"><select className="field" value={teamSize} onChange={(event) => setTeamSize(event.target.value as TeamSize)}><option value="solo">Solo</option><option value="small">Small team</option><option value="large">Large team</option></select></Field><WizardNav back={() => setStep(1)} next={() => setStep(3)} nextLabel="Rank tools →" /></div></Panel>}

    {step === 3 && <Panel title="03 / Ranked recommendations" action={<span className="text-[var(--green)]">Deterministic model</span>}><div className="space-y-6 p-5">{layers.map(([layer,label]) => <section key={layer}><h2 className="eyebrow mb-2">{label}</h2><div className="grid gap-2 lg:grid-cols-3">{recommendations[layer].map((recommendation,index) => { const tool = toolsById[recommendation.tool_id]; return <article key={recommendation.tool_id} className={`border p-4 ${index === 0 ? "border-[#736037] bg-[#16140f]" : "border-[var(--line)] bg-[#090c0f]"}`}><div className="flex items-start justify-between gap-3"><div><span className="font-semibold">{tool.name}</span>{index===0 && <span className="tag ml-2 !border-[var(--orange)] !text-[var(--orange)]">Top fit</span>}</div><ScoreBar value={recommendation.score}/></div><p className="mt-3 text-xs leading-5 text-[#a6b0ba]">{recommendation.reason}</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]"><b>Tradeoff:</b> {recommendation.tradeoff}</p></article>; })}</div></section>)}<WizardNav back={() => setStep(2)} next={proceedFromRecommendations} nextLabel="Customize stack →" /></div></Panel>}

    {step === 4 && <Panel title="04 / Stack builder"><div className="p-5"><div className="grid gap-4 md:grid-cols-2">{layers.map(([layer,label]) => <Field key={layer} label={label}><select className="field" value={selectedStack[layer] ?? ""} onChange={(event) => setSelectedStack({...selectedStack,[layer]:event.target.value || null})}><option value="">Select a tool</option>{tools.filter((tool) => tool.category === layerCategory[layer]).map((tool) => <option key={tool.id} value={tool.id}>{tool.name} · {tool.provider}</option>)}</select>{selectedStack[layer] && <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{toolsById[selectedStack[layer]!]?.description}</p>}</Field>)}</div><WizardNav back={() => setStep(3)} next={generate} nextLabel="Generate files →" disabled={Object.values(selectedStack).some((value) => !value)} /></div></Panel>}

    {step === 5 && output && <div className="grid gap-4 xl:grid-cols-[1fr_330px]">
      <Panel title="05 / Generated output" action={<div className="flex gap-1"><button className={`btn !min-h-7 !px-2 !text-[9px] ${activeDoc === "prd" ? "!border-[var(--orange)]" : ""}`} onClick={() => setActiveDoc("prd")}>PRD.md</button><button className={`btn !min-h-7 !px-2 !text-[9px] ${activeDoc === "architecture" ? "!border-[var(--orange)]" : ""}`} onClick={() => setActiveDoc("architecture")}>ARCHITECTURE.md</button></div>}>
        <textarea aria-label="Generated markdown" className="min-h-[660px] w-full resize-y bg-[#080b0d] p-5 font-mono text-xs leading-6 text-[#c7d0d9] outline-none" value={activeDoc === "prd" ? output.prdMarkdown : output.architectureMarkdown} onChange={(event) => setOutput({...output,[activeDoc === "prd" ? "prdMarkdown" : "architectureMarkdown"]:event.target.value})}/>
      </Panel>
      <div className="space-y-4">
        <Panel title="Export"><div className="grid gap-2 p-4"><button className="btn btn-primary" onClick={() => downloadMarkdown("PRD.md",output.prdMarkdown)}>Download PRD.md</button><button className="btn" onClick={() => downloadMarkdown("ARCHITECTURE.md",output.architectureMarkdown)}>Download architecture</button><button className="btn" onClick={() => navigator.clipboard.writeText(activeDoc === "prd" ? output.prdMarkdown : output.architectureMarkdown)}>Copy active document</button></div></Panel>
        <Panel title="Optional AI enhancement"><div className="space-y-3 p-4">
          <p className="text-xs leading-5 text-[var(--muted)]"><b className="text-[var(--green)]">Free-tier only:</b> uses Gemini 3 Flash Preview through StackPilot&apos;s server proxy. Your key remains only in this form&apos;s memory, is forwarded once, and is never logged or persisted. Google may use free-tier prompts to improve its products.</p>
          <div className="field mono flex items-center justify-between text-xs"><span>GOOGLE GEMINI</span><span className="text-[var(--green)]">FREE TIER</span></div>
          <input className="field mono text-xs" type="password" autoComplete="off" placeholder="Google AI Studio API key" value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
          <button className="btn w-full" disabled={!apiKey || enhancing} onClick={enhance}>{enhancing ? "Enhancing…" : `Enhance ${activeDoc}`}</button>
          {error && <p role="alert" className="text-xs leading-5 text-[var(--red)]">{error}</p>}
        </div></Panel>
        <button className="btn w-full" onClick={() => setStep(4)}>← Edit stack</button>
      </div>
    </div>}
  </main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="eyebrow mb-2 block">{label}</span>{children}</label>; }
function WizardNav({ back, next, nextLabel, disabled=false }: { back:()=>void; next:()=>void; nextLabel:string; disabled?:boolean }) { return <div className="flex justify-between gap-3 md:col-span-2"><button className="btn" onClick={back}>← Back</button><button className="btn btn-primary" disabled={disabled} onClick={next}>{nextLabel}</button></div>; }
