"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workersApi } from "@/lib/api";
import { Worker } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert, WorkerPopup } from "@/components/ui/UI";
import { Plus, HardHat, Pencil, Trash2, Mail, Phone, DollarSign, Info } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import clsx from "clsx";

const ROLES=["worker","foreman","supervisor","engineer","manager","subcontractor"];
const BLANK={firstName:"",lastName:"",email:"",phone:"",role:"worker",hourlyRate:"",overtimeRate:"",status:"active"};
interface FE{firstName?:string;lastName?:string;email?:string;}

export default function WorkersPage() {
  const qc=useQueryClient();
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<Worker|null>(null);
  const [delTarget,setDelTarget]=useState<Worker|null>(null);
  const [form,setForm]=useState(BLANK);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<FE>({});
  const [popup,setPopup]=useState<Worker|null>(null);

  const {data,isLoading}=useQuery({queryKey:["workers"],queryFn:()=>workersApi.list({limit:100})});
  const workers:Worker[]=extractArray<Worker>(data);

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e:FE={};if(!form.firstName.trim())e.firstName="Required";if(!form.lastName.trim())e.lastName="Required";if(!form.email.trim())e.email="Required";else if(!/\S+@\S+\.\S+/.test(form.email))e.email="Invalid";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(w:Worker)=>{setEditing(w);setForm({firstName:w.firstName,lastName:w.lastName,email:w.email,phone:w.phone??"",role:w.role,hourlyRate:String(w.hourlyRate??""),overtimeRate:String(w.overtimeRate??""),status:w.status});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));const p={...form,hourlyRate:form.hourlyRate?Number(form.hourlyRate):undefined,overtimeRate:form.overtimeRate?Number(form.overtimeRate):undefined};return editing?workersApi.update(editing.id,p):workersApi.create(p);},onSuccess:()=>{qc.invalidateQueries({queryKey:["workers"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>workersApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["workers"]});setDelTarget(null);}});

  return (
    <div className="animate-fade-in relative z-10">
      <PageHeader title="Workers" subtitle={`${workers.length} crew members`} action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>Add Worker</button>}/>
      <div className="card overflow-hidden">
        {isLoading?<div className="flex justify-center py-16"><Spinner/></div>:workers.length===0?(
          <EmptyState icon={<HardHat size={18}/>} title="No workers yet" description="Add your first crew member" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>Add Worker</button>}/>
        ):(
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["Worker","Contact","Role","Hourly","OT Rate","Status","Since",""].map(h=><th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>
                {workers.map(w=>(
                  <tr key={w.id}>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center font-mono text-[11px] font-semibold flex-shrink-0" style={{background:"var(--am3)",color:"var(--am)",borderRadius:2}}>{w.firstName[0]}{w.lastName[0]}</div>
                        <span className="font-semibold text-[14px]" style={{color:"var(--t1)"}}>{w.firstName} {w.lastName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-[12.5px] flex items-center gap-1.5" style={{color:"var(--t2)"}}><Mail size={10}/>{w.email}</div>
                      {w.phone&&<div className="text-[12px] flex items-center gap-1.5 mt-1" style={{color:"var(--t3)"}}><Phone size={10}/>{w.phone}</div>}
                    </td>
                    <td className="table-cell"><span className="badge" style={{background:"var(--c3)",color:"var(--t2)"}}>{capitalize(w.role)}</span></td>
                    <td className="table-cell">{w.hourlyRate!=null?<span className="font-display font-bold text-[14px] flex items-center gap-1" style={{color:"var(--ok)"}}><DollarSign size={11}/>{Number(w.hourlyRate).toFixed(2)}<span className="font-mono text-[10px] font-normal" style={{color:"var(--t3)"}}>/hr</span></span>:<span style={{color:"var(--t4)"}}>—</span>}</td>
                    <td className="table-cell">{w.overtimeRate!=null?<span className="font-display font-bold text-[14px]" style={{color:"var(--am)"}}>${Number(w.overtimeRate).toFixed(2)}<span className="font-mono text-[10px] font-normal" style={{color:"var(--t3)"}}>/hr</span></span>:<span style={{color:"var(--t4)"}}>—</span>}</td>
                    <td className="table-cell"><span className={clsx("badge",getStatusColor(w.status))}>{capitalize(w.status)}</span></td>
                    <td className="table-cell font-mono text-[11.5px]" style={{color:"var(--t3)"}}>{formatDate(w.createdAt)}</td>
                    <td className="table-cell">
                      <div className="row-action flex items-center gap-0.5 justify-end">
                        <button className="btn btn-ghost p-2" onClick={()=>setPopup(w)}><Info size={13}/></button>
                        <button className="btn btn-ghost p-2" onClick={()=>openEdit(w)}><Pencil size={13}/></button>
                        <button className="btn btn-ghost p-2" style={{color:"var(--err)",opacity:0.45}} onMouseOver={e=>{(e.currentTarget as HTMLElement).style.opacity="1";(e.currentTarget as HTMLElement).style.background="var(--err-bg)"}} onMouseOut={e=>{(e.currentTarget as HTMLElement).style.opacity="0.45";(e.currentTarget as HTMLElement).style.background="transparent"}} onClick={()=>setDelTarget(w)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit Worker":"Add Worker"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-x-5 gap-y-1">
          <Field label="First Name" required error={fe.firstName}><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John"/></Field>
          <Field label="Last Name" required error={fe.lastName}><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe"/></Field>
          <Field label="Email" required error={fe.email}><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@example.com"/></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123"/></Field>
          <Field label="Role"><select className="input" value={form.role} onChange={s("role")}>{ROLES.map(r=><option key={r} value={r}>{capitalize(r)}</option>)}</select></Field>
          <Field label="Status"><select className="input" value={form.status} onChange={s("status")}><option value="active">Active</option><option value="inactive">Inactive</option><option value="on_leave">On Leave</option></select></Field>
          <Field label="Hourly Rate (CAD)"><input type="number" className="input" value={form.hourlyRate} onChange={s("hourlyRate")} placeholder="0.00" min="0" step="0.01"/></Field>
          <Field label="Overtime Rate (CAD)"><input type="number" className="input" value={form.overtimeRate} onChange={s("overtimeRate")} placeholder="0.00" min="0" step="0.01"/></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--ln)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Add Worker"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Remove Worker" description={`Remove ${delTarget?.firstName} ${delTarget?.lastName}?`}/>
      {popup&&<WorkerPopup worker={popup} onClose={()=>setPopup(null)}/>}
    </div>
  );
}
