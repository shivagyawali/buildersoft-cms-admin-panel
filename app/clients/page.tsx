"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api";
import { Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Users, Search, Pencil, Trash2, ArrowRight, Phone, Mail, Building2, MapPin, UserCheck } from "lucide-react";
import { getInitials, formatDate, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";

const BLANK = { firstName:"",lastName:"",email:"",phone:"",company:"",address:"",city:"",province:"",postalCode:"",country:"",notes:"" };
interface FE { firstName?:string; lastName?:string; email?:string }

const ACCENT_COLORS = ["#f97316","#3b82f6","#22c55e","#a855f7","#ef4444","#f59e0b","#06b6d4","#ec4899"];

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

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e:FE={};if(!form.firstName.trim())e.firstName="Required";if(!form.lastName.trim())e.lastName="Required";if(!form.email.trim())e.email="Required";else if(!/\S+@\S+\.\S+/.test(form.email))e.email="Invalid email";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(c:Client)=>{setEditing(c);setForm({firstName:c.firstName,lastName:c.lastName,email:c.email,phone:c.phone??"",company:c.company??"",address:c.address??"",city:c.city??"",province:c.province??"",postalCode:c.postalCode??"",country:c.country??"",notes:c.notes??""});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));return editing?clientsApi.update(editing.id,form):clientsApi.create(form);},onSuccess:()=>{qc.invalidateQueries({queryKey:["clients"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>clientsApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["clients"]});setDelTarget(null);}});

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Clients" subtitle={`${clients.length} client${clients.length!==1?"s":""} on record`} icon={<Users size={22}/>}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Client</button>}/>

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:"var(--tx-3)"}}/>
          <input className="input pl-11" placeholder="Search by name, email, company…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="font-mono text-[12px]" style={{color:"var(--tx-3)"}}>{filtered.length} results</div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg"/></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users size={28}/>} title="No Clients Found" description={search?"Try a different search term":"Add your first client to get started"} action={!search?<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>Add Client</button>:undefined}/>
      ) : (
        /* Card grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
          {filtered.map((c,i)=>{
            const color = ACCENT_COLORS[i%ACCENT_COLORS.length];
            return (
              <div key={c.id} className="card card-hover group relative overflow-hidden">
                {/* Color top strip */}
                <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-300" style={{background:`linear-gradient(90deg,${color},${color}88)`}}/>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display text-[16px] font-bold flex-shrink-0"
                        style={{background:`${color}18`,color,border:`1.5px solid ${color}40`}}>
                        {getInitials(c.firstName,c.lastName)}
                      </div>
                      <div>
                        <p className="font-semibold text-[15px]" style={{color:"var(--tx)"}}>{c.firstName} {c.lastName}</p>
                        {c.company&&<p className="text-[12px] flex items-center gap-1 mt-0.5" style={{color:"var(--tx-3)"}}><Building2 size={10}/>{c.company}</p>}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn btn-ghost p-1.5 rounded-lg" onClick={e=>{e.stopPropagation();openEdit(c)}}><Pencil size={13}/></button>
                      <button className="btn btn-ghost p-1.5 rounded-lg" style={{color:"var(--err)"}} onClick={e=>{e.stopPropagation();setDelTarget(c)}}><Trash2 size={13}/></button>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-[12.5px]" style={{color:"var(--tx-2)"}}><Mail size={11} style={{color:"var(--tx-3)"}}/>{c.email}</div>
                    {c.phone&&<div className="flex items-center gap-2 text-[12.5px]" style={{color:"var(--tx-2)"}}><Phone size={11} style={{color:"var(--tx-3)"}}/>{c.phone}</div>}
                    {(c.city||c.province)&&<div className="flex items-center gap-2 text-[12.5px]" style={{color:"var(--tx-2)"}}><MapPin size={11} style={{color:"var(--tx-3)"}}/>{[c.city,c.province].filter(Boolean).join(", ")}</div>}
                  </div>
                  <div className="flex items-center justify-between pt-3" style={{borderTop:"1px solid var(--line)"}}>
                    <span className="font-mono text-[11px]" style={{color:"var(--tx-3)"}}>Since {formatDate(c.createdAt)}</span>
                    <Link href={`/clients/${c.id}`} className="flex items-center gap-1 text-[12px] font-medium transition-colors" style={{color}}
                      onMouseOver={e=>(e.currentTarget.style.opacity="0.8")} onMouseOut={e=>(e.currentTarget.style.opacity="1")}>
                      View <ArrowRight size={12}/>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit Client":"New Client"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required error={fe.firstName}><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John"/></Field>
          <Field label="Last Name" required error={fe.lastName}><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe"/></Field>
          <Field label="Email" required error={fe.email}><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@example.com"/></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123"/></Field>
          <Field label="Company"><input className="input" value={form.company} onChange={s("company")} placeholder="Acme Construction"/></Field>
          <Field label="Address"><input className="input" value={form.address} onChange={s("address")} placeholder="123 Main St"/></Field>
          <Field label="City"><input className="input" value={form.city} onChange={s("city")} placeholder="Toronto"/></Field>
          <Field label="Province"><input className="input" value={form.province} onChange={s("province")} placeholder="ON"/></Field>
          <Field label="Postal Code"><input className="input" value={form.postalCode} onChange={s("postalCode")} placeholder="M5H 2N2"/></Field>
          <Field label="Country"><input className="input" value={form.country} onChange={s("country")} placeholder="Canada"/></Field>
          <div className="col-span-2"><Field label="Notes"><textarea className="input resize-none min-h-[80px]" value={form.notes} onChange={s("notes")} placeholder="Additional notes…"/></Field></div>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Create Client"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Client" description={`Remove ${delTarget?.firstName} ${delTarget?.lastName}? This cannot be undone.`}/>
    </div>
  );
}
