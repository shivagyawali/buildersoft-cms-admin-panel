"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesApi, projectsApi, clientsApi } from "@/lib/api";
import { Invoice, Project, Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert, StatCard } from "@/components/ui/UI";
import { Plus, FileText, Trash2, ArrowRight, X, DollarSign, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDate, formatCurrency, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const STATUSES=["draft","sent","viewed","partially_paid","paid","overdue","cancelled"];
interface LineItem{description:string;quantity:string;unitPrice:string}
interface FE{clientId?:string;issueDate?:string;dueDate?:string;items?:string}

export default function InvoicesPage() {
  const qc=useQueryClient();
  const [statusFilter,setStatusFilter]=useState("");
  const [open,setOpen]=useState(false);
  const [delTarget,setDelTarget]=useState<Invoice|null>(null);
  const [form,setForm]=useState({projectId:"",clientId:"",issueDate:"",dueDate:"",taxAmount:"",notes:""});
  const [items,setItems]=useState<LineItem[]>([{description:"",quantity:"1",unitPrice:""}]);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<FE>({});

  const {data,isLoading}=useQuery({queryKey:["invoices",statusFilter],queryFn:()=>invoicesApi.list({status:statusFilter||undefined,limit:50})});
  const {data:projData}=useQuery({queryKey:["projects-inv"],queryFn:()=>projectsApi.list({limit:100})});
  const {data:clientData}=useQuery({queryKey:["clients-inv"],queryFn:()=>clientsApi.list({limit:100})});

  const invoices:Invoice[]=extractArray<Invoice>(data);
  const projects:Project[]=extractArray<Project>(projData);
  const clients:Client[]=extractArray<Client>(clientData);

  const sf=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const setItem=(i:number,k:keyof LineItem,v:string)=>setItems(p=>p.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const subtotal=items.reduce((s,it)=>s+(Number(it.quantity)||0)*(Number(it.unitPrice)||0),0);
  const tax=Number(form.taxAmount)||0;

  const validate=():boolean=>{const e:FE={};if(!form.clientId)e.clientId="Select a client";if(!form.issueDate)e.issueDate="Required";if(!form.dueDate)e.dueDate="Required";if(!items.some(it=>it.description.trim()))e.items="Add at least one line item";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setForm({projectId:"",clientId:"",issueDate:new Date().toISOString().slice(0,10),dueDate:"",taxAmount:"",notes:""});setItems([{description:"",quantity:"1",unitPrice:""}]);setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));return invoicesApi.create({...form,taxAmount:tax,items:items.filter(it=>it.description).map(it=>({description:it.description,quantity:Number(it.quantity),unitPrice:Number(it.unitPrice)}))});},onSuccess:()=>{qc.invalidateQueries({queryKey:["invoices"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>invoicesApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["invoices"]});setDelTarget(null);}});

  const totalRevenue=invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+Number(i.totalAmount),0);
  const outstanding=invoices.filter(i=>["sent","viewed","partially_paid"].includes(i.status)).reduce((s,i)=>s+Number(i.amountDue||i.totalAmount),0);
  const overdueCount=invoices.filter(i=>i.status==="overdue").length;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Invoices" subtitle={`${invoices.length} invoice${invoices.length!==1?"s":""}`} icon={<FileText size={22}/>}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Invoice</button>}/>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard label="Total Invoices" value={invoices.length} icon={<FileText size={18}/>} color="blue" sub="All time"/>
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={<CheckCircle2 size={18}/>} color="green" sub="Collected"/>
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={<Clock size={18}/>} color="yellow" sub="Pending payment"/>
        <StatCard label="Overdue" value={overdueCount} icon={<AlertTriangle size={18}/>} color={overdueCount>0?"red":"green"} sub="Need attention"/>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {[{key:"",label:"All"},...STATUSES.map(s=>({key:s,label:capitalize(s)}))].map(({key,label})=>(
          <button key={key} onClick={()=>setStatusFilter(key)}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all"
            style={statusFilter===key
              ?{background:"var(--acc)",color:"#fff",boxShadow:"var(--shadow-acc)"}
              :{background:"var(--bg-card)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
            {label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {isLoading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:
         invoices.length===0?(<EmptyState icon={<FileText size={28}/>} title="No Invoices" description="Create your first invoice" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Invoice</button>}/>):(
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["Invoice #","Client","Project","Issued","Due","Amount","Status",""].map(h=><th key={h} className="tbl-head">{h}</th>)}</tr></thead>
              <tbody>
                {invoices.map(inv=>(
                  <tr key={inv.id}>
                    <td className="tbl-cell"><Link href={`/invoices/${inv.id}`} className="font-mono text-[13px] font-semibold hover:underline" style={{color:"var(--acc)"}}>{inv.invoiceNumber}</Link></td>
                    <td className="tbl-cell">
                      <p className="font-medium text-[14px]" style={{color:"var(--tx)"}}>{inv.client?`${inv.client.firstName} ${inv.client.lastName}`:"—"}</p>
                      {inv.client?.company&&<p className="text-[12px]" style={{color:"var(--tx-3)"}}>{inv.client.company}</p>}
                    </td>
                    <td className="tbl-cell text-[13px]" style={{color:"var(--tx-2)"}}>{inv.project?.name||"—"}</td>
                    <td className="tbl-cell font-mono text-[12px]" style={{color:"var(--tx-3)"}}>{formatDate(inv.issueDate)}</td>
                    <td className="tbl-cell font-mono text-[12px]" style={{color:inv.status==="overdue"?"var(--err)":"var(--tx-3)"}}>{formatDate(inv.dueDate)}</td>
                    <td className="tbl-cell">
                      <p className="font-display text-[16px]" style={{color:"var(--tx)"}}>{formatCurrency(inv.totalAmount)}</p>
                      {Number(inv.amountDue)>0&&inv.status!=="paid"&&<p className="text-[11px] font-mono" style={{color:"var(--warn)"}}>Due: {formatCurrency(inv.amountDue)}</p>}
                    </td>
                    <td className="tbl-cell"><span className={clsx("badge",getStatusColor(inv.status))}>{capitalize(inv.status)}</span></td>
                    <td className="tbl-cell">
                      <div className="row-act flex items-center gap-1 justify-end">
                        <Link href={`/invoices/${inv.id}`} className="btn btn-ghost p-2 rounded-lg"><ArrowRight size={13}/></Link>
                        <button className="btn btn-ghost p-2 rounded-lg" style={{color:"var(--err)"}} onClick={()=>setDelTarget(inv)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         )}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title="New Invoice" size="xl">
        {err&&<Alert type="error" message={err}/>}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Client" required error={fe.clientId}><select className="input" value={form.clientId} onChange={sf("clientId")}><option value="">Select client…</option>{clients.map(c=><option key={c.id} value={c.id}>{c.firstName} {c.lastName}{c.company?` — ${c.company}`:""}</option>)}</select></Field>
            <Field label="Project (optional)"><select className="input" value={form.projectId} onChange={sf("projectId")}><option value="">Select project…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
            <Field label="Issue Date" required error={fe.issueDate}><input type="date" className="input" value={form.issueDate} onChange={sf("issueDate")}/></Field>
            <Field label="Due Date" required error={fe.dueDate}><input type="date" className="input" value={form.dueDate} onChange={sf("dueDate")}/></Field>
          </div>
          <Field label={`Line Items${fe.items?<span>  — ${fe.items}</span>:""}`} error={fe.items}>
            <div className="card overflow-hidden mt-1">
              <div className="grid grid-cols-12 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest" style={{background:"var(--bg-raised)",borderBottom:"1px solid var(--line)",color:"var(--tx-3)"}}>
                <span className="col-span-6">Description</span><span className="col-span-2 text-right">Qty</span><span className="col-span-3 text-right">Unit Price</span><span className="col-span-1"/>
              </div>
              {items.map((item,i)=>(
                <div key={i} className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center" style={{borderBottom:"1px solid var(--line)"}}>
                  <input className="input col-span-6 text-[13px]" placeholder="Description" value={item.description} onChange={e=>setItem(i,"description",e.target.value)}/>
                  <input type="number" className="input col-span-2 text-[13px] text-right" placeholder="1" value={item.quantity} onChange={e=>setItem(i,"quantity",e.target.value)}/>
                  <input type="number" className="input col-span-3 text-[13px] text-right" placeholder="0.00" value={item.unitPrice} onChange={e=>setItem(i,"unitPrice",e.target.value)}/>
                  <button onClick={()=>setItems(p=>p.filter((_,idx)=>idx!==i))} className="col-span-1 flex justify-center btn btn-ghost p-1.5 rounded-lg" style={{color:"var(--err)"}}><X size={13}/></button>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button className="btn btn-ghost text-[12px] gap-1.5" style={{color:"var(--acc)"}} onClick={()=>setItems(p=>[...p,{description:"",quantity:"1",unitPrice:""}])}><Plus size={13}/>Add line</button>
              </div>
            </div>
          </Field>
          <div className="card p-4 space-y-2">
            <div className="flex justify-between text-[13.5px]" style={{color:"var(--tx-2)"}}><span>Subtotal</span><span className="font-mono">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between items-center text-[13.5px]" style={{color:"var(--tx-2)"}}>
              <span>Tax</span>
              <input type="number" className="input w-28 text-right text-[13px] py-1.5" placeholder="0.00" value={form.taxAmount} onChange={sf("taxAmount")}/>
            </div>
            <div className="flex justify-between items-center pt-2" style={{borderTop:"1px solid var(--line)"}}>
              <span className="font-semibold" style={{color:"var(--tx)"}}>Total</span>
              <span className="font-display text-[22px]" style={{color:"var(--tx)"}}>{formatCurrency(subtotal+tax)}</span>
            </div>
          </div>
          <Field label="Notes"><textarea className="input resize-none min-h-[60px]" placeholder="Payment terms, notes…" value={form.notes} onChange={sf("notes")}/></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}Create Invoice</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Invoice" description={`Delete invoice ${delTarget?.invoiceNumber}?`}/>
    </div>
  );
}
