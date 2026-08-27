"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { KnowledgeGraph } from "@/components/marketplace/KnowledgeGraph";
import { OrgChart } from "@/components/marketplace/OrgChart";
import { Panel } from "@/components/ui/Panel";
import { filterMarketplace, marketplaceItems } from "@/lib/marketplace";
import type { MarketplaceItem } from "@/lib/types";

type View = "catalog" | "collection" | "org" | "graph";
const storageKey = "stackpilot_marketplace_collection";
const collectionEvent = "stackpilot-collection-change";

function subscribeToCollection(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(collectionEvent, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(collectionEvent, callback); };
}

function getCollectionSnapshot() {
  return localStorage.getItem(storageKey) ?? "[]";
}

export function MarketplaceClient() {
  const [view,setView] = useState<View>("catalog");
  const [query,setQuery] = useState("");
  const [kind,setKind] = useState("all");
  const [category,setCategory] = useState("all");
  const savedSnapshot = useSyncExternalStore(subscribeToCollection,getCollectionSnapshot,()=>"[]");
  const saved = useMemo<string[]>(() => { try { return JSON.parse(savedSnapshot); } catch { return []; } },[savedSnapshot]);
  const persist = (next:string[]) => { localStorage.setItem(storageKey,JSON.stringify(next)); window.dispatchEvent(new Event(collectionEvent)); };
  const toggle = (id:string) => persist(saved.includes(id) ? saved.filter((item)=>item!==id) : [...saved,id]);
  const filtered = useMemo(() => filterMarketplace(query,kind,category),[query,kind,category]);
  const collection = marketplaceItems.filter((item)=>saved.includes(item.id));

  return <main className="shell py-9">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Capability exchange / verified sources</p><h1 className="mt-2 text-4xl font-black tracking-tight">Skills & plugins marketplace</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">Discover portable skills, agent teams, plugins, and engineering references. Build a local collection, inspect upstream terms, then copy the official install command when you are ready.</p></div><div className="mono text-right text-[10px] text-[var(--muted)]"><div><span className="text-[var(--green)]">{marketplaceItems.length}</span> CURATED ITEMS</div><div><span className="text-[var(--orange)]">{saved.length}</span> IN YOUR COLLECTION</div></div></div>
    <nav className="mt-7 flex gap-1 overflow-x-auto border-b border-[var(--line)] pb-2" aria-label="Marketplace views">{[["catalog","Catalog"],["collection",`My collection (${saved.length})`],["org","Agency org chart"],["graph","Knowledge graph"]].map(([id,label]) => <button key={id} onClick={()=>setView(id as View)} className={`btn whitespace-nowrap !text-[10px] ${view===id ? "!border-[var(--orange)] !text-[var(--orange)]" : ""}`}>{label}</button>)}</nav>

    {view === "catalog" && <><div className="my-5 grid gap-3 md:grid-cols-[1fr_170px_170px]"><input className="field mono text-xs" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="SEARCH CAPABILITY, SOURCE, AGENT…"/><select className="field mono text-xs" value={kind} onChange={(event)=>setKind(event.target.value)}><option value="all">ALL TYPES</option><option value="skill">SKILLS</option><option value="plugin">PLUGINS</option><option value="agent">AGENTS</option><option value="resource">RESOURCES</option></select><select className="field mono text-xs" value={category} onChange={(event)=>setCategory(event.target.value)}><option value="all">ALL CATEGORIES</option>{["engineering","quality","planning","knowledge","documents","agents","learning"].map((value)=><option value={value} key={value}>{value.toUpperCase()}</option>)}</select></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item)=><MarketplaceCard key={item.id} item={item} added={saved.includes(item.id)} onToggle={()=>toggle(item.id)}/>)}</div>{!filtered.length && <p className="panel p-10 text-center text-sm text-[var(--muted)]">No marketplace items match those filters.</p>}</>}
    {view === "collection" && <div className="mt-5">{collection.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{collection.map((item)=><MarketplaceCard key={item.id} item={item} added onToggle={()=>toggle(item.id)}/>)}</div> : <div className="panel p-12 text-center"><p className="text-lg font-bold">Your collection is empty</p><p className="mt-2 text-sm text-[var(--muted)]">Add skills and plugins from the catalog. Your choices stay in this browser.</p><button className="btn btn-primary mt-5" onClick={()=>setView("catalog")}>Browse catalog</button></div>}</div>}
    {view === "org" && <Panel className="mt-5" title="Agency topology / advisory roles"><OrgChart/></Panel>}
    {view === "graph" && <Panel className="mt-5" title="Context graph / temporal knowledge map" action={<a className="text-[var(--orange)]" target="_blank" rel="noreferrer" href="https://github.com/getzep/graphiti">GRAPHITI SOURCE ↗</a>}><KnowledgeGraph/></Panel>}
  </main>;
}

function MarketplaceCard({item,added,onToggle}:{item:MarketplaceItem;added:boolean;onToggle:()=>void}) {
  const [copied,setCopied] = useState(false);
  const copy = async () => { if(!item.install_command) return; await navigator.clipboard.writeText(item.install_command); setCopied(true); setTimeout(()=>setCopied(false),1200); };
  return <article className={`panel flex min-h-[360px] flex-col p-5 ${added ? "border-[var(--green)]" : ""}`}><div className="flex items-start justify-between gap-3"><div className="flex gap-1"><span className="tag !text-[var(--orange)]">{item.kind}</span><span className="tag">{item.category}</span></div>{item.featured && <span className="mono text-[9px] text-[var(--green)]">◆ FEATURED</span>}</div><h2 className="mt-5 text-xl font-bold">{item.name}</h2><a href={item.source_url} target="_blank" rel="noreferrer" className="mono mt-1 text-[10px] text-[var(--blue)] hover:underline">{item.source} ↗</a><p className="mt-4 text-sm leading-6 text-[#a7b1bb]">{item.description}</p><div className="mt-4 flex flex-wrap gap-1">{item.capabilities.map((capability)=><span className="tag" key={capability}>{capability}</span>)}</div><div className="mt-auto pt-5"><div className="mb-3 grid grid-cols-2 gap-2 font-mono text-[9px] text-[var(--muted)]"><span>LICENSE<br/><b className="text-[#b8c2cb]">{item.license}</b></span><span>API ACCESS<br/><b className="text-[var(--green)]">{item.api_access === "none" ? "NO KEY" : "FREE TIER"}</b></span></div>{item.install_command && <button onClick={copy} className="mb-2 w-full truncate border border-[var(--line)] bg-[#080b0d] px-3 py-2 text-left font-mono text-[10px] text-[var(--muted)] hover:border-[var(--blue)]" title={item.install_command}>{copied ? "COPIED ✓" : `$ ${item.install_command}`}</button>}<button className={`btn w-full ${added ? "!border-[var(--green)] !text-[var(--green)]" : "btn-primary"}`} onClick={onToggle}>{added ? "✓ Added · remove" : "+ Add to collection"}</button></div></article>;
}
