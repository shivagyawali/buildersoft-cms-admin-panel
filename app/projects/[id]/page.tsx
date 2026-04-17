"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui/UI";
import { formatDate, formatCurrency, capitalize, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({ queryKey: ["project", id], queryFn: () => projectsApi.get(id) });
  const { data: statsData } = useQuery({ queryKey: ["project-stats", id], queryFn: () => projectsApi.getStats(id) });
  const p = data?.data?.data ?? data?.data;
  const s = statsData?.data?.data ?? statsData?.data;

  if (isLoading) return <div className="flex justify-center py-16 relative z-10"><Spinner/></div>;
  if (!p) return <div className="relative z-10 font-mono text-[11px] uppercase tracking-widest" style={{color:"var(--t3)"}}>Project not found</div>;

  return (
    <div className="animate-fade-in relative z-10">
      <div className="mb-6"><Link href="/projects" className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors" style={{color:"var(--t3)"}} onMouseOver={e=>(e.currentTarget.style.color="var(--am)")} onMouseOut={e=>(e.currentTarget.style.color="var(--t3)")}><ArrowLeft size={12}/>Back to Projects</Link></div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">{p.name}</h1>
          {p.client&&<p className="font-mono text-[10.5px] uppercase tracking-[0.12em] mt-1.5" style={{color:"var(--t3)"}}>{p.client.firstName} {p.client.lastName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx("badge",getStatusColor(p.status))}>{capitalize(p.status)}</span>
          <span className={clsx("badge",getStatusColor(p.priority))}>{capitalize(p.priority)}</span>
        </div>
      </div>
      <div className="hairline-strong mb-6"/>
      {p.description&&<p className="text-[14px] mb-6 leading-relaxed" style={{color:"var(--t2)"}}>{p.description}</p>}
      {typeof p.progress==="number"&&(
        <div className="mb-6">
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] mb-2" style={{color:"var(--t3)"}}><span>Overall Progress</span><span>{p.progress}%</span></div>
          <div className="progress-bar" style={{height:6}}><div className="progress-fill" style={{width:`${p.progress}%`,height:6}}/></div>
        </div>
      )}
      {s&&(
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {label:"Total Tasks",val:s.totalTasks,color:"var(--am)"},
            {label:"Done",val:s.completedTasks,color:"var(--ok)"},
            {label:"Total Billed",val:formatCurrency(s.invoices?.totalBilled),color:"var(--bl)"},
            {label:"Labor Cost",val:formatCurrency(s.labor?.totalCost),color:"var(--warn)"},
          ].map(({label,val,color})=>(
            <div key={label} className="kpi">
              <div className="kpi-label">{label}</div>
              <div className="kpi-value" style={{color}}>{val}</div>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {[["Start Date",p.startDate],["End Date",p.expectedEndDate],["Budget",formatCurrency(p.budgetAmount)],["Location",p.location]].filter(([,v])=>v).map(([k,v])=>(
          <div key={k as string} className="card p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] mb-1.5" style={{color:"var(--t3)"}}>{k as string}</div>
            <div className="font-display font-bold text-[16px]" style={{color:"var(--t1)"}}>{typeof v==="string"&&v.includes("-")&&v.length===10?formatDate(v):v as string}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
