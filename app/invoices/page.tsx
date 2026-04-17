"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesApi, projectsApi, clientsApi } from "@/lib/api";
import { Invoice, Project, Client } from "@/types";
import { Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, FileText, Trash2, ArrowUpRight, X } from "lucide-react";
import { formatDate, formatCurrency, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const STATUSES = ["draft","sent","viewed","partially_paid","paid","overdue","cancelled"];
interface LI { description:string; quantity:string; unitPrice:string }
interface FE { clientId?:string; issueDate?:string; dueDate?:string; items?:string }

export default function InvoicesPage() {
  const qc = useQueryClient();
  const [sf, setSf] = useState("");
  const [open, setOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<Invoice|null>(null);
  const [form, setForm] = useState({projectId:"",clientId:"",issueDate:"",dueDate:"",taxAmount:"",notes:""});
  const [items, setItems] = useState<LI[]>([{description:"",quantity:"1",unitPrice:""}]);
  const [err, setErr] = useState("");
  const [fe, setFe] = useState<FE>({});

  const { data, isLoading } = useQuery({queryKey:["invoices",sf],queryFn:()=>invoicesApi.list({status:sf||undefined,limit:50})});
  const { data: projData } = useQuery({queryKey:["projects-inv"],queryFn:()=>projectsApi.list({limit:100})});
  const { data: clientData } = useQuery({queryKey:["clients-inv"],queryFn:()=>clientsApi.list({limit:100})});

  const invoices:Invoice[] = extractArray<Invoice>(data);
  const projects:Project[] = extractArray<Project>(projData);
  const clients:Client[]   = extractArray<Client>(clientData);

  const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const setItem=(i:number,k:keyof LI,v:string)=>setItems(p=>p.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const subtotal=items.reduce((s,it)=>s+(Number(it.quantity)||0)*(Number(it.unitPrice)||0),0);
  const tax=Number(form.taxAmount)||0;

  const validate=():boolean=>{const e:FE={};if(!form.clientId)e.clientId="Select a client";if(!form.issueDate)e.issueDate="Required";if(!form.dueDate)e.dueDate="Required";if(form.issueDate&&form.dueDate&&form.issueDate>form.dueDate)e.dueDate="Must be after issue date";if(!items.some(it=>it.description.trim()))e.items="At least one line item required";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setForm({projectId:"",clientId:"",issueDate:new Date().toISOString().slice(0,10),dueDate:"",taxAmount:"",notes:""});setItems([{description:"",quantity:"1",unitPrice:""}]);setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("Validation failed"));return invoicesApi.create({...form,taxAmount:tax,items:items.filter(it=>it.description).map(it=>({description:it.description,quantity:Number(it.quantity),unitPrice:Number(it.unitPrice)}))});},onSuccess:()=>{qc.invalidateQueries({queryKey:["invoices"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="Validation failed")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>invoicesApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["invoices"]});setDelTarget(null);}});

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="page-sub mb-1.5">Finance / Invoices</div>
          <h1 className="page-title">Billing Ledger</h1>
          <p className="text-[13px] text-[color:var(--t2)] mt-1">{invoices.length} {invoices.length===1?"invoice":"invoices"}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={14}/>New Invoice</button>
      </div>
      <div className="hairline-strong mb-5"/>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-px bg-[color:var(--ln)] border border-[color:var(--ln)] mb-6 w-fit">
        {[{key:"",label:"All"},...STATUSES.map(s=>({key:s,label:capitalize(s).replace("_"," ")}))].map(({key,label})=>(
          <button key={key} onClick={()=>setSf(key)} className={clsx("px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-all",sf===key?"bg-[color:var(--am)] text-black font-semibold":"bg-[color:var(--c2)] text-[color:var(--t3)] hover:bg-[color:var(--c3)] hover:text-[color:var(--t1)]")}>{label}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {isLoading?<div className="flex justify-center py-16"><Spinner/></div>:invoices.length===0?(
          <EmptyState icon={<FileText size={18}/>} title="No invoices yet" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={14}/>New Invoice</button>}/>
        ):(
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["Invoice #","Client","Issued","Due","Amount","Status",""].map(h=><th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>
                {invoices.map(inv=>(
                  <tr key={inv.id} className="table-row">
                    <td className="table-cell font-mono text-[12px] text-[color:var(--t3)]">{inv.invoiceNumber}</td>
                    <td className="table-cell">
                      <div className="text-[14px] font-medium">{inv.client?`${inv.client.firstName} ${inv.client.lastName}`:"—"}</div>
                      {inv.project?.name&&<div className="text-[11.5px] text-[color:var(--t3)] mt-0.5">{inv.project.name}</div>}
                    </td>
                    <td className="table-cell font-mono text-[12px] text-[color:var(--t2)]">{formatDate(inv.issueDate)}</td>
                    <td className="table-cell font-mono text-[12px] text-[color:var(--t2)]">{formatDate(inv.dueDate)}</td>
                    <td className="table-cell">
                      <div className="font-display font-bold text-[17px] leading-none tabular-nums">{formatCurrency(inv.totalAmount)}</div>
                      {Number(inv.amountDue)>0&&inv.status!=="paid"&&<div className="text-[11.5px] text-[color:var(--t3)] mt-1 font-mono">Due: {formatCurrency(inv.amountDue)}</div>}
                    </td>
                    <td className="table-cell"><span className={clsx("badge",getStatusColor(inv.status))}>{capitalize(inv.status).replace("_"," ")}</span></td>
                    <td className="table-cell">
                      <div className="row-action flex items-center gap-0.5 justify-end">
                        <Link href={`/invoices/${inv.id}`} className="btn btn-ghost p-2"><ArrowUpRight size={13}/></Link>
                        <button className="btn btn-ghost p-2 text-[color:var(--err)] opacity-40 hover:opacity-100 hover:bg-[color:var(--err-bg)] transition-all" onClick={()=>setDelTarget(inv)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title="New Invoice" size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <Field label="Client" required error={fe.clientId}><select className="input" value={form.clientId} onChange={set("clientId")}><option value="">Select client…</option>{clients.map(c=><option key={c.id} value={c.id}>{c.firstName} {c.lastName}{c.company?` — ${c.company}`:""}</option>)}</select></Field>
            <Field label="Project"><select className="input" value={form.projectId} onChange={set("projectId")}><option value="">Select project (optional)…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
            <Field label="Issue Date" required error={fe.issueDate}><input type="date" className="input" value={form.issueDate} onChange={set("issueDate")}/></Field>
            <Field label="Due Date" required error={fe.dueDate}><input type="date" className="input" value={form.dueDate} onChange={set("dueDate")}/></Field>
          </div>
          <div>
            <div className="label mb-2">Line Items{fe.items&&<span className="text-[color:var(--err)] ml-2 normal-case text-[11px]">{fe.items}</span>}</div>
            <div className="border border-[color:var(--ln)]">
              <div className="grid grid-cols-12 bg-[color:var(--c3)] px-4 py-2.5 border-b border-[color:var(--ln)]">
                <span className="col-span-6 label mb-0">Description</span>
                <span className="col-span-2 label mb-0 text-right">Qty</span>
                <span className="col-span-3 label mb-0 text-right">Unit Price</span>
                <span className="col-span-1"/>
              </div>
              {items.map((item,i)=>(
                <div key={i} className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-[color:var(--ln)] items-center">
                  <input className="input col-span-6 text-sm" placeholder="Work description…" value={item.description} onChange={e=>setItem(i,"description",e.target.value)}/>
                  <input type="number" className="input col-span-2 text-sm text-right" placeholder="1" value={item.quantity} onChange={e=>setItem(i,"quantity",e.target.value)}/>
                  <input type="number" className="input col-span-3 text-sm text-right" placeholder="0.00" value={item.unitPrice} onChange={e=>setItem(i,"unitPrice",e.target.value)}/>
                  <button onClick={()=>setItems(p=>p.filter((_,idx)=>idx!==i))} className="col-span-1 flex justify-center text-[color:var(--t3)] hover:text-[color:var(--err)] transition-colors"><X size={13}/></button>
                </div>
              ))}
              <div className="px-4 py-2">
                <button className="btn btn-ghost text-[11.5px] text-[color:var(--am)] py-1.5 px-2" onClick={()=>setItems(p=>[...p,{description:"",quantity:"1",unitPrice:""}])}><Plus size={12}/>Add line item</button>
              </div>
            </div>
          </div>
          <div className="border border-[color:var(--ln)] bg-[color:var(--c3)]">
            <div className="px-5 py-3 flex justify-between items-center border-b border-[color:var(--ln)]"><span className="label mb-0">Subtotal</span><span className="font-mono text-[13px]">{formatCurrency(subtotal)}</span></div>
            <div className="px-5 py-3 flex justify-between items-center border-b border-[color:var(--ln)]"><span className="label mb-0">Tax</span><input type="number" className="input w-28 text-right text-sm py-1.5" placeholder="0.00" value={form.taxAmount} onChange={set("taxAmount")}/></div>
            <div className="px-5 py-4 flex justify-between items-center"><span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold">Total</span><span className="font-display font-bold text-[22px] leading-none tabular-nums">{formatCurrency(subtotal+tax)}</span></div>
          </div>
          <Field label="Notes"><textarea className="input resize-none min-h-[60px]" placeholder="Payment terms, notes…" value={form.notes} onChange={set("notes")}/></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-[color:var(--ln)]">
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}Create Invoice</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Invoice" description={`Delete invoice ${delTarget?.invoiceNumber}?`}/>
    </div>
  );
}
