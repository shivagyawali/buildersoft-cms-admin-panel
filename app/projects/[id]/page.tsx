"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui/UI";
import { formatDate, formatCurrency, capitalize, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, TrendingUp } from "lucide-react";
import clsx from "clsx";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({ queryKey: ["project", id], queryFn: () => projectsApi.get(id) });
  const { data: statsData } = useQuery({ queryKey: ["project-stats", id], queryFn: () => projectsApi.getStats(id) });
  const p = data?.data?.data ?? data?.data;
  const s = statsData?.data?.data ?? statsData?.data;

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg"/></div>;
  if (!p) return <div className="font-mono text-[12px] uppercase tracking-widest" style={{color:"var(--tx-3)"}}>Project not found</div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div><Link href="/projects" className="flex items-center gap-2 text-[13px] font-medium transition-colors hover:underline" style={{color:"var(--tx-3)"}}><ArrowLeft size={14}/>Back to Projects</Link></div>
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="font-display text-[42px] leading-none tracking-wider" style={{color:"var(--tx)"}}>{p.name.toUpperCase()}</h1>{p.client&&<p className="font-mono text-[12px] mt-1.5" style={{color:"var(--tx-3)"}}>{p.client.firstName} {p.client.lastName}</p>}</div>
        <div className="flex items-center gap-2 pt-2"><span className={clsx("badge",getStatusColor(p.status))}>{capitalize(p.status)}</span><span className={clsx("badge",getStatusColor(p.priority))}>{capitalize(p.priority)}</span></div>
      </div>
      <div className="flex items-center gap-3"><div style={{height:2,width:48,background:"var(--acc)",borderRadius:99}}/><div style={{height:2,flex:1,background:"var(--line)"}}/></div>
      {p.description&&<p className="text-[15px] leading-relaxed" style={{color:"var(--tx-2)"}}>{p.description}</p>}
      {typeof p.progress==="number"&&<div><div className="flex justify-between font-mono text-[11px] mb-2" style={{color:"var(--tx-3)"}}><span>Overall Progress</span><span>{p.progress}%</span></div><div className="progress-track" style={{height:8}}><div className="progress-bar" style={{width:`${p.progress}%`,height:8}}/></div></div>}
      {s&&<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[{label:"Tasks",val:s.totalTasks,c:"var(--acc)"},{label:"Done",val:s.completedTasks,c:"var(--ok)"},{label:"Total Billed",val:formatCurrency(s.invoices?.totalBilled),c:"var(--info)"},{label:"Labor Cost",val:formatCurrency(s.labor?.totalCost),c:"var(--warn)"}].map(({label,val,c})=><div key={label} className="kpi-tile"><div className="label">{label}</div><div className="font-display text-[28px] leading-none" style={{color:c}}>{val}</div></div>)}</div>}
      <div className="grid grid-cols-2 gap-4">{[[<Calendar size={14}/>,formatDate(p.startDate),"Start"],[<Calendar size={14}/>,formatDate(p.expectedEndDate),"End Date"],[<TrendingUp size={14}/>,formatCurrency(p.budgetAmount),"Budget"],[<MapPin size={14}/>,p.location,"Location"]].filter(([,v])=>v&&v!=="—").map(([icon,v,label],i)=><div key={i} className="card p-4"><div className="font-mono text-[10.5px] uppercase tracking-wide mb-1.5 flex items-center gap-2" style={{color:"var(--tx-3)"}}><span style={{color:"var(--acc)"}}>{icon as any}</span>{label as string}</div><div className="font-semibold text-[15px]" style={{color:"var(--tx)"}}>{v as string}</div></div>)}</div>
    </div>
  );
}
