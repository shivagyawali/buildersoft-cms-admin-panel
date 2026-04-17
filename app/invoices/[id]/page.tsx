"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { invoicesApi } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui/UI";
import { formatDate, formatCurrency, capitalize, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({ queryKey: ["invoice", id], queryFn: () => invoicesApi.get(id) });
  const inv = data?.data?.data ?? data?.data;

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg"/></div>;
  if (!inv) return <div className="font-mono text-[12px] uppercase tracking-widest" style={{color:"var(--tx-3)"}}>Invoice not found</div>;

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      <div><Link href="/invoices" className="flex items-center gap-2 text-[13px] font-medium transition-colors hover:underline" style={{color:"var(--tx-3)"}}><ArrowLeft size={14}/>Back to Invoices</Link></div>
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="font-display text-[42px] leading-none tracking-wider" style={{color:"var(--tx)"}}>{inv.invoiceNumber}</h1>{inv.client&&<p className="font-mono text-[12px] mt-1.5" style={{color:"var(--tx-3)"}}>{inv.client.firstName} {inv.client.lastName}{inv.client.company?` · ${inv.client.company}`:""}</p>}</div>
        <span className={clsx("badge mt-2",getStatusColor(inv.status))}>{capitalize(inv.status)}</span>
      </div>
      <div className="flex items-center gap-3"><div style={{height:2,width:48,background:"var(--acc)",borderRadius:99}}/><div style={{height:2,flex:1,background:"var(--line)"}}/></div>
      <div className="card overflow-hidden">
        <div className="grid grid-cols-3" style={{borderBottom:"1px solid var(--line)",background:"var(--bg-raised)"}}>
          {[["Issue Date",formatDate(inv.issueDate)],["Due Date",formatDate(inv.dueDate)],["Project",inv.project?.name??"—"]].map(([k,v])=>(
            <div key={k as string} className="px-5 py-4" style={{borderRight:"1px solid var(--line)"}}>
              <div className="label">{k as string}</div>
              <div className="font-semibold text-[15px]" style={{color:"var(--tx)"}}>{v as string}</div>
            </div>
          ))}
        </div>
        {(inv.items??[]).length>0&&<>
          <div className="grid grid-cols-12 px-5 py-3 font-mono text-[10.5px] uppercase tracking-widest" style={{background:"var(--bg-raised)",borderBottom:"1px solid var(--line)",color:"var(--tx-3)"}}><span className="col-span-6">Description</span><span className="col-span-2 text-right">Qty</span><span className="col-span-2 text-right">Unit</span><span className="col-span-2 text-right">Total</span></div>
          {(inv.items??[]).map((item:any)=>(
            <div key={item.id} className="grid grid-cols-12 px-5 py-3.5 text-[14px]" style={{borderBottom:"1px solid var(--line)",color:"var(--tx)"}}>
              <span className="col-span-6">{item.description}</span>
              <span className="col-span-2 text-right font-mono" style={{color:"var(--tx-2)"}}>{item.quantity}</span>
              <span className="col-span-2 text-right font-mono" style={{color:"var(--tx-2)"}}>{formatCurrency(item.unitPrice)}</span>
              <span className="col-span-2 text-right font-semibold">{formatCurrency(item.total)}</span>
            </div>
          ))}
          <div className="px-5 py-3 flex justify-between font-mono text-[12px]" style={{borderBottom:"1px solid var(--line)",color:"var(--tx-3)"}}><span>Subtotal</span><span>{formatCurrency(inv.subtotal)}</span></div>
          {Number(inv.taxAmount)>0&&<div className="px-5 py-3 flex justify-between font-mono text-[12px]" style={{borderBottom:"1px solid var(--line)",color:"var(--tx-3)"}}><span>Tax</span><span>{formatCurrency(inv.taxAmount)}</span></div>}
          <div className="px-5 py-4 flex justify-between items-center" style={{background:"var(--bg-raised)"}}><span className="font-mono text-[12px] uppercase tracking-widest" style={{color:"var(--tx-3)"}}>Total</span><span className="font-display text-[28px]" style={{color:"var(--tx)"}}>{formatCurrency(inv.totalAmount)}</span></div>
          {Number(inv.amountDue)>0&&inv.status!=="paid"&&<div className="px-5 py-3 flex justify-between" style={{background:"var(--warn-bg)"}}><span className="font-mono text-[12px] uppercase tracking-widest" style={{color:"var(--warn)"}}>Balance Due</span><span className="font-display text-[22px]" style={{color:"var(--warn)"}}>{formatCurrency(inv.amountDue)}</span></div>}
        </>}
      </div>
      {inv.notes&&<div className="card p-5"><div className="label">Notes</div><p className="text-[14px] leading-relaxed" style={{color:"var(--tx-2)"}}>{inv.notes}</p></div>}
    </div>
  );
}
