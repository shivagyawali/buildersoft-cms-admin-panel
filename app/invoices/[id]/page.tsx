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

  if (isLoading) return <div className="flex justify-center py-16 relative z-10"><Spinner/></div>;
  if (!inv) return <div className="relative z-10 font-mono text-[11px] uppercase tracking-widest" style={{color:"var(--t3)"}}>Invoice not found</div>;

  return (
    <div className="animate-fade-in relative z-10 max-w-3xl">
      <div className="mb-6"><Link href="/invoices" className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors" style={{color:"var(--t3)"}} onMouseOver={e=>(e.currentTarget.style.color="var(--am)")} onMouseOut={e=>(e.currentTarget.style.color="var(--t3)")}><ArrowLeft size={12}/>Back to Invoices</Link></div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">{inv.invoiceNumber}</h1>
          {inv.client&&<p className="font-mono text-[10.5px] uppercase tracking-[0.12em] mt-1.5" style={{color:"var(--t3)"}}>{inv.client.firstName} {inv.client.lastName}</p>}
        </div>
        <span className={clsx("badge",getStatusColor(inv.status))}>{capitalize(inv.status)}</span>
      </div>
      <div className="hairline-strong mb-6"/>
      <div className="card overflow-hidden mb-5">
        <div className="grid grid-cols-3" style={{borderBottom:"1px solid var(--ln)"}}>
          {[["Issue Date",formatDate(inv.issueDate)],["Due Date",formatDate(inv.dueDate)],["Project",inv.project?.name??"—"]].map(([k,v])=>(
            <div key={k as string} className="px-5 py-4" style={{borderRight:"1px solid var(--ln)"}}>
              <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] mb-1" style={{color:"var(--t3)"}}>{k as string}</div>
              <div className="font-semibold text-[14px]" style={{color:"var(--t1)"}}>{v as string}</div>
            </div>
          ))}
        </div>
        {(inv.items??[]).length>0&&(
          <div>
            <div className="grid grid-cols-12 px-5 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{background:"var(--c3)",borderBottom:"1px solid var(--ln2)",color:"var(--t3)"}}>
              <span className="col-span-6">Description</span><span className="col-span-2 text-right">Qty</span><span className="col-span-2 text-right">Unit</span><span className="col-span-2 text-right">Total</span>
            </div>
            {(inv.items??[]).map((item:any)=>(
              <div key={item.id} className="grid grid-cols-12 px-5 py-3 text-[13.5px]" style={{borderBottom:"1px solid var(--ln)",color:"var(--t1)"}}>
                <span className="col-span-6">{item.description}</span>
                <span className="col-span-2 text-right" style={{color:"var(--t2)"}}>{item.quantity}</span>
                <span className="col-span-2 text-right" style={{color:"var(--t2)"}}>{formatCurrency(item.unitPrice)}</span>
                <span className="col-span-2 text-right font-semibold">{formatCurrency(item.total)}</span>
              </div>
            ))}
            <div className="px-5 py-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em]" style={{borderBottom:"1px solid var(--ln)",color:"var(--t3)"}}><span>Subtotal</span><span style={{color:"var(--t1)"}}>{formatCurrency(inv.subtotal)}</span></div>
            {Number(inv.taxAmount)>0&&<div className="px-5 py-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em]" style={{borderBottom:"1px solid var(--ln)",color:"var(--t3)"}}><span>Tax</span><span style={{color:"var(--t1)"}}>{formatCurrency(inv.taxAmount)}</span></div>}
            <div className="px-5 py-4 flex justify-between" style={{background:"var(--c3)"}}>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{color:"var(--t3)"}}>Total</span>
              <span className="font-display font-bold text-[22px]" style={{color:"var(--t1)"}}>{formatCurrency(inv.totalAmount)}</span>
            </div>
            {Number(inv.amountDue)>0&&inv.status!=="paid"&&(
              <div className="px-5 py-3 flex justify-between" style={{background:"var(--warn-bg)"}}>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{color:"var(--warn)"}}>Balance Due</span>
                <span className="font-display font-bold text-[18px]" style={{color:"var(--warn)"}}>{formatCurrency(inv.amountDue)}</span>
              </div>
            )}
          </div>
        )}
      </div>
      {inv.notes&&<div className="card p-4"><div className="font-mono text-[9.5px] uppercase tracking-[0.12em] mb-2" style={{color:"var(--t3)"}}>Notes</div><p className="text-[13px]" style={{color:"var(--t2)"}}>{inv.notes}</p></div>}
    </div>
  );
}
