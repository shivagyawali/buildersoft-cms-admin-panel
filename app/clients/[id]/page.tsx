"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui/UI";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from "lucide-react";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({ queryKey: ["client", id], queryFn: () => clientsApi.get(id) });
  const { data: statsData } = useQuery({ queryKey: ["client-stats", id], queryFn: () => clientsApi.getStats(id) });
  const c = data?.data?.data ?? data?.data;
  const s = statsData?.data?.data ?? statsData?.data;

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg"/></div>;
  if (!c) return <div className="font-mono text-[12px] uppercase tracking-widest" style={{color:"var(--tx-3)"}}>Client not found</div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div><Link href="/clients" className="flex items-center gap-2 text-[13px] font-medium transition-colors hover:underline" style={{color:"var(--tx-3)"}}><ArrowLeft size={14}/>Back to Clients</Link></div>
      <PageHeader title={`${c.firstName} ${c.lastName}`} subtitle={c.company ?? c.email}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card card-accent p-5">
          <h3 className="font-display text-[16px] tracking-wide mb-4" style={{color:"var(--acc)"}}>CONTACT</h3>
          {[[<Mail size={13}/>, c.email],[<Phone size={13}/>, c.phone],[<Building2 size={13}/>, c.company],[<MapPin size={13}/>, [c.city,c.province,c.country].filter(Boolean).join(", ")]].filter(([,v])=>v).map(([icon,val],i)=>(
            <div key={i} className="flex items-center gap-3 py-2.5" style={{borderBottom:"1px solid var(--line)"}}>
              <span style={{color:"var(--tx-3)",flexShrink:0}}>{icon}</span>
              <span className="text-[13.5px]" style={{color:"var(--tx)"}}>{val as string}</span>
            </div>
          ))}
          <div className="pt-2.5 flex justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wide" style={{color:"var(--tx-3)"}}>Client since</span>
            <span className="font-mono text-[12px]" style={{color:"var(--tx)"}}>{formatDate(c.createdAt)}</span>
          </div>
        </div>
        {s&&(
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[{label:"Projects",val:s.totalProjects,color:"var(--acc)"},{label:"Invoices",val:s.totalInvoices,color:"var(--info)"},{label:"Total Billed",val:formatCurrency(s.totalBilled),color:"var(--ok)"},{label:"Outstanding",val:formatCurrency(s.outstanding),color:"var(--warn)"}].map(({label,val,color})=>(
              <div key={label} className="kpi-tile">
                <div className="label">{label}</div>
                <div className="font-display text-[32px] leading-none" style={{color}}>{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {c.notes&&<div className="card p-5"><h3 className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{color:"var(--tx-3)"}}>Notes</h3><p className="text-[14px] leading-relaxed" style={{color:"var(--tx-2)"}}>{c.notes}</p></div>}
    </div>
  );
}
