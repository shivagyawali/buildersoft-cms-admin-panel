"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api";
import { Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Users, Search, Pencil, Trash2, ArrowUpRight, Phone, Mail, Building2 } from "lucide-react";
import { getInitials, formatDate, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";

const BLANK = { firstName:"",lastName:"",email:"",phone:"",company:"",address:"",city:"",province:"",postalCode:"",country:"",notes:"" };
interface FE { firstName?:string; lastName?:string; email?:string; }

export default function ClientsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client|null>(null);
  const [delTarget, setDelTarget] = useState<Client|null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");
  const [fe, setFe] = useState<FE>({});

  const { data, isLoading } = useQuery({ queryKey:["clients"], queryFn:()=>clientsApi.list({limit:100}) });
  const clients:Client[] = extractArray<Client>(data);
  const filtered = clients.filter(c=>`${c.firstName} ${c.lastName} ${c.email} ${c.company??""}`.toLowerCase().includes(search.toLowerCase()));

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{ setForm(p=>({...p,[k]:e.target.value})); setFe(p=>({...p,[k]:undefined})); };
  const validate=()=>{const e:FE={};if(!form.firstName.trim())e.firstName="Required";if(!form.lastName.trim())e.lastName="Required";if(!form.email.trim())e.email="Required";else if(!/\S+@\S+\.\S+/.test(form.email))e.email="Invalid email";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(c:Client)=>{setEditing(c);setForm({firstName:c.firstName,lastName:c.lastName,email:c.email,phone:c.phone??"",company:c.company??"",address:c.address??"",city:c.city??"",province:c.province??"",postalCode:c.postalCode??"",country:c.country??"",notes:c.notes??""});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));return editing?clientsApi.update(editing.id,form):clientsApi.create(form);},onSuccess:()=>{qc.invalidateQueries({queryKey:["clients"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>clientsApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["clients"]});setDelTarget(null);}});

  const COLORS=[{bg:"var(--am3)",fg:"var(--am)"},{bg:"var(--bl2)",fg:"var(--bl)"},{bg:"var(--ok-bg)",fg:"var(--ok)"},{bg:"var(--err-bg)",fg:"var(--err)"},{bg:"var(--violet-bg)",fg:"var(--violet)"}];

  return (
    <div className="animate-fade-in relative z-10">
      <PageHeader title="Clients" subtitle={`${clients.length} on file`} action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>New Client</button>} />
      <div className="relative mb-5 max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--t3)"}}/>
        <input className="input pl-9" placeholder="Search clients…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="card overflow-hidden">
        {isLoading?<div className="flex justify-center py-16"><Spinner/></div>:filtered.length===0?(
          <EmptyState icon={<Users size={18}/>} title="No clients yet" description="Add your first client" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>Add Client</button>}/>
        ):(
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["#","Client","Contact","Location","Since",""].map(h=><th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((c,i)=>{const col=COLORS[i%COLORS.length];return(
                  <tr key={c.id}>
                    <td className="table-cell font-mono text-[10.5px] w-10" style={{color:"var(--t3)"}}>{String(i+1).padStart(2,"0")}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-semibold" style={{background:col.bg,color:col.fg,borderRadius:2}}>{getInitials(c.firstName,c.lastName)}</div>
                        <div>
                          <div className="text-[14px] font-semibold" style={{color:"var(--t1)"}}>{c.firstName} {c.lastName}</div>
                          {c.company&&<div className="text-[11.5px] flex items-center gap-1 mt-0.5" style={{color:"var(--t3)"}}><Building2 size={10}/>{c.company}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-[12.5px] flex items-center gap-1.5" style={{color:"var(--t2)"}}><Mail size={10} className="flex-shrink-0"/>{c.email}</div>
                      {c.phone&&<div className="text-[12px] flex items-center gap-1.5 mt-1" style={{color:"var(--t3)"}}><Phone size={10} className="flex-shrink-0"/>{c.phone}</div>}
                    </td>
                    <td className="table-cell text-[13px]" style={{color:"var(--t2)"}}>{[c.city,c.province].filter(Boolean).join(", ")||"—"}</td>
                    <td className="table-cell font-mono text-[11.5px]" style={{color:"var(--t3)"}}>{formatDate(c.createdAt)}</td>
                    <td className="table-cell">
                      <div className="row-action flex items-center gap-0.5 justify-end">
                        <Link href={`/clients/${c.id}`} className="btn btn-ghost p-2"><ArrowUpRight size={13}/></Link>
                        <button className="btn btn-ghost p-2" onClick={()=>openEdit(c)}><Pencil size={13}/></button>
                        <button className="btn btn-ghost p-2" style={{color:"var(--err)",opacity:0.45}} onMouseOver={e=>{(e.currentTarget as HTMLElement).style.opacity="1";(e.currentTarget as HTMLElement).style.background="var(--err-bg)"}} onMouseOut={e=>{(e.currentTarget as HTMLElement).style.opacity="0.45";(e.currentTarget as HTMLElement).style.background="transparent"}} onClick={()=>setDelTarget(c)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit Client":"New Client"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-x-5 gap-y-1">
          <Field label="First Name" required error={fe.firstName}><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John"/></Field>
          <Field label="Last Name" required error={fe.lastName}><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe"/></Field>
          <Field label="Email" required error={fe.email}><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@example.com"/></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123"/></Field>
          <Field label="Company"><input className="input" value={form.company} onChange={s("company")} placeholder="Company name"/></Field>
          <Field label="Address"><input className="input" value={form.address} onChange={s("address")} placeholder="123 Main St"/></Field>
          <Field label="City"><input className="input" value={form.city} onChange={s("city")} placeholder="Toronto"/></Field>
          <Field label="Province"><input className="input" value={form.province} onChange={s("province")} placeholder="ON"/></Field>
          <Field label="Postal Code"><input className="input" value={form.postalCode} onChange={s("postalCode")} placeholder="M5H 2N2"/></Field>
          <Field label="Country"><input className="input" value={form.country} onChange={s("country")} placeholder="Canada"/></Field>
          <div className="col-span-2"><Field label="Notes"><textarea className="input resize-none min-h-[72px]" value={form.notes} onChange={s("notes")}/></Field></div>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--ln)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Create Client"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Client" description={`Delete ${delTarget?.firstName} ${delTarget?.lastName}?`}/>
    </div>
  );
}
