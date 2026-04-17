"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui/UI";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({ queryKey: ["client", id], queryFn: () => clientsApi.get(id) });
  const { data: statsData } = useQuery({ queryKey: ["client-stats", id], queryFn: () => clientsApi.getStats(id) });
  const c = data?.data?.data ?? data?.data;
  const s = statsData?.data?.data ?? statsData?.data;

  if (isLoading) return <div className="flex justify-center py-16 relative z-10"><Spinner/></div>;
  if (!c) return <div className="relative z-10 font-mono text-[11px] uppercase tracking-widest" style={{color:"var(--t3)"}}>Client not found</div>;

  return (
    <div className="animate-fade-in relative z-10">
      <div className="mb-6"><Link href="/clients" className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors" style={{color:"var(--t3)"}} onMouseOver={e=>(e.currentTarget.style.color="var(--am)")} onMouseOut={e=>(e.currentTarget.style.color="var(--t3)")}><ArrowLeft size={12}/>Back to Clients</Link></div>
      <PageHeader title={`${c.firstName} ${c.lastName}`} subtitle={c.company ?? c.email}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5">
          <div className="font-display font-bold text-[13px] uppercase tracking-[0.08em] mb-4" style={{color:"var(--am)"}}>Contact</div>
          {[["Email",c.email],["Phone",c.phone],["Company",c.company],["Address",[c.address,c.city,c.province].filter(Boolean).join(", ")],["Country",c.country]].filter(([,v])=>v).map(([k,v])=>(
            <div key={k as string} className="flex justify-between text-[13px] py-2" style={{borderBottom:"1px solid var(--ln)"}}>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{color:"var(--t3)"}}>{k as string}</span>
              <span style={{color:"var(--t1)"}}>{v as string}</span>
            </div>
          ))}
          <div className="flex justify-between text-[13px] py-2"><span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{color:"var(--t3)"}}>Since</span><span style={{color:"var(--t1)"}}>{formatDate(c.createdAt)}</span></div>
        </div>
        {s && (
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              {label:"Total Projects",val:s.totalProjects,color:"var(--am)"},
              {label:"Total Invoices",val:s.totalInvoices,color:"var(--bl)"},
              {label:"Total Billed",val:formatCurrency(s.totalBilled),color:"var(--ok)"},
              {label:"Outstanding",val:formatCurrency(s.outstanding),color:"var(--warn)"},
            ].map(({label,val,color})=>(
              <div key={label} className="kpi">
                <div className="kpi-label">{label}</div>
                <div className="kpi-value" style={{color}}>{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
