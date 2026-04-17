"use client";
import { useQuery } from "@tanstack/react-query";
import { superadminApi } from "@/lib/api";
import { PageHeader, Spinner, StatCard } from "@/components/ui/UI";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Building2, Users, FolderKanban, FileText, HardHat, TrendingUp, Globe } from "lucide-react";
import clsx from "clsx";

const PLAN_COLORS:Record<string,{bg:string;color:string}>={free:{bg:"var(--muted-bg)",color:"var(--muted)"},starter:{bg:"var(--info-bg)",color:"var(--info)"},pro:{bg:"var(--acc-subtle)",color:"var(--acc)"},enterprise:{bg:"var(--purple-bg)",color:"var(--purple)"}};

export default function SuperAdminPage() {
  const {data,isLoading}=useQuery({queryKey:["superadmin-overview"],queryFn:()=>superadminApi.overview()});
  const d=data?.data?.data??data?.data??null;

  if(isLoading||!d) return <div className="flex items-center justify-center py-32"><Spinner size="lg"/></div>;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden" style={{background:"linear-gradient(135deg,#0d1117,#1a2332)",border:"1.5px solid rgba(249,115,22,0.2)"}}>
        <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(249,115,22,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.04) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        <div className="absolute top-0 left-0 right-0 h-1" style={{background:"linear-gradient(90deg,var(--acc),var(--acc-2))"}}/>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5"><Globe size={200} color="#f97316"/></div>
        <div className="relative z-10">
          <p className="font-mono text-[11px] tracking-widest uppercase mb-2" style={{color:"rgba(249,115,22,0.7)"}}>● PLATFORM COMMAND</p>
          <h1 className="font-display text-[48px] leading-none tracking-wider text-white mb-2">PLATFORM<br/><span style={{color:"var(--acc)"}}>OVERVIEW</span></h1>
          <p className="text-[14px]" style={{color:"rgba(255,255,255,0.4)"}}>Full visibility across all {d.companies.total} registered companies</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger">
        <StatCard label="Companies" value={d.companies.total} icon={<Building2 size={18}/>} color="orange" sub={`${d.companies.active} active`}/>
        <StatCard label="Users" value={d.users.total} icon={<Users size={18}/>} color="blue" sub={`${d.users.active} active`}/>
        <StatCard label="Projects" value={d.projects.total} icon={<FolderKanban size={18}/>} color="green" sub={`${d.projects.active} running`}/>
        <StatCard label="Total Billed" value={formatCurrency(d.invoices.totalBilled)} icon={<FileText size={18}/>} color="yellow" sub={formatCurrency(d.invoices.outstanding)+" outstanding"}/>
        <StatCard label="Workers" value={d.workers.total} icon={<HardHat size={18}/>} color="violet" sub={`${d.workers.active} active`}/>
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(PLAN_COLORS).map(([plan,{bg,color}])=>(
          <div key={plan} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-[15px]" style={{background:bg,color,border:`1.5px solid ${color}30`}}>{plan[0].toUpperCase()}</div>
            <div>
              <div className="font-display text-[28px] leading-none" style={{color}}>{(d.companies.byPlan as any)[plan]??0}</div>
              <div className="font-mono text-[10px] uppercase tracking-wide mt-0.5" style={{color:"var(--tx-3)"}}>{plan}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent companies */}
        <div className="card card-accent overflow-hidden">
          <div className="flex items-center justify-between p-5" style={{borderBottom:"1px solid var(--line)"}}>
            <div className="flex items-center gap-2"><Building2 size={16} style={{color:"var(--acc)"}}/><h3 className="font-display text-[18px] tracking-wide" style={{color:"var(--tx)"}}>RECENT COMPANIES</h3></div>
            <Link href="/companies" className="flex items-center gap-1 text-[12px] font-medium" style={{color:"var(--acc)"}}>All <ArrowRight size={12}/></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["Company","Plan","Status","Since"].map(h=><th key={h} className="tbl-head">{h}</th>)}</tr></thead>
              <tbody>
                {(d.recentCompanies??[]).slice(0,6).map((c:any)=>{const pc=PLAN_COLORS[c.plan];return(
                  <tr key={c.id}>
                    <td className="tbl-cell">
                      <Link href={`/companies`} className="font-display text-[15px] tracking-wide transition-colors" style={{color:"var(--tx)"}} onMouseOver={e=>(e.currentTarget.style.color="var(--acc)")} onMouseOut={e=>(e.currentTarget.style.color="var(--tx)")}>{c.name}</Link>
                    </td>
                    <td className="tbl-cell"><span className="badge" style={{background:pc.bg,color:pc.color}}>{c.plan}</span></td>
                    <td className="tbl-cell"><span className={`badge status-${c.status}`}>{c.status}</span></td>
                    <td className="tbl-cell font-mono text-[11px]" style={{color:"var(--tx-3)"}}>{formatDate(c.createdAt)}</td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly growth */}
        <div className="card card-accent p-5">
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} style={{color:"var(--acc)"}}/><h3 className="font-display text-[18px] tracking-wide" style={{color:"var(--tx)"}}>GROWTH</h3></div>
          {(d.monthlyGrowth??[]).length===0?<p className="text-center py-8 font-mono text-[11px] uppercase tracking-widest" style={{color:"var(--tx-3)"}}>No data yet</p>:(
            <div className="space-y-3">
              {(d.monthlyGrowth??[]).map((m:any)=>{const max=Math.max(...(d.monthlyGrowth??[]).map((x:any)=>x.newCompanies),1);return(
                <div key={m.month}>
                  <div className="flex justify-between font-mono text-[11px] mb-1.5" style={{color:"var(--tx-3)"}}><span>{m.month}</span><span style={{color:"var(--acc)"}}>{m.newCompanies} new</span></div>
                  <div className="progress-track"><div className="progress-bar" style={{width:`${(m.newCompanies/max)*100}%`}}/></div>
                </div>
              );})}
            </div>
          )}
          <div className="mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
            {[{label:"Active",val:d.companies.active,c:"var(--ok)"},{label:"Trial",val:d.companies.trial,c:"var(--warn)"},{label:"Suspended",val:d.companies.suspended,c:"var(--err)"}].map(({label,val,c})=>(
              <div key={label} className="flex justify-between items-center mb-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wide" style={{color:"var(--tx-3)"}}>{label}</span>
                <span className="font-display text-[20px]" style={{color:c}}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
