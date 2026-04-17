"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workersApi } from "@/lib/api";
import { Worker } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, HardHat, Pencil, Trash2, Mail, Phone, DollarSign, Clock, Info, Activity, UserCheck } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import clsx from "clsx";

const ROLES=["worker","foreman","supervisor","engineer","manager","subcontractor"];
const BLANK={firstName:"",lastName:"",email:"",phone:"",role:"worker",hourlyRate:"",overtimeRate:"",status:"active"};
interface FE{firstName?:string;lastName?:string;email?:string}

const ROLE_ICONS:Record<string,string>={worker:"🪜",foreman:"📋",supervisor:"👷",engineer:"⚙️",manager:"💼",subcontractor:"🔧"};
const ROLE_COLORS=["#f97316","#3b82f6","#22c55e","#a855f7","#f59e0b","#06b6d4"];

export default function WorkersPage() {
  const qc=useQueryClient();
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<Worker|null>(null);
  const [delTarget,setDelTarget]=useState<Worker|null>(null);
  const [form,setForm]=useState(BLANK);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<FE>({});
  const [detailWorker,setDetailWorker]=useState<Worker|null>(null);
  const [statusFilter,setStatusFilter]=useState("");

  const {data,isLoading}=useQuery({queryKey:["workers"],queryFn:()=>workersApi.list({limit:100})});
  const workers:Worker[]=extractArray<Worker>(data);
  const filtered=statusFilter?workers.filter(w=>w.status===statusFilter):workers;

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e:FE={};if(!form.firstName.trim())e.firstName="Required";if(!form.lastName.trim())e.lastName="Required";if(!form.email.trim())e.email="Required";else if(!/\S+@\S+\.\S+/.test(form.email))e.email="Invalid";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(w:Worker)=>{setEditing(w);setForm({firstName:w.firstName,lastName:w.lastName,email:w.email,phone:w.phone??"",role:w.role,hourlyRate:String(w.hourlyRate??""),overtimeRate:String(w.overtimeRate??""),status:w.status});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));const p={...form,hourlyRate:form.hourlyRate?Number(form.hourlyRate):undefined,overtimeRate:form.overtimeRate?Number(form.overtimeRate):undefined};return editing?workersApi.update(editing.id,p):workersApi.create(p);},onSuccess:()=>{qc.invalidateQueries({queryKey:["workers"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>workersApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["workers"]});setDelTarget(null);}});

  const activeCount=workers.filter(w=>w.status==="active").length;
  const totalCost=workers.reduce((s,w)=>s+Number(w.hourlyRate||0),0);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Workers" subtitle={`${workers.length} crew members`} icon={<HardHat size={22}/>}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>Add Worker</button>}/>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {label:"Active Crew",value:activeCount,color:"var(--ok)",icon:<Activity size={16}/>},
          {label:"Total Members",value:workers.length,color:"var(--acc)",icon:<HardHat size={16}/>},
          {label:"Avg Hourly",value:workers.length?`$${(totalCost/workers.length).toFixed(0)}/hr`:"—",color:"var(--info)",icon:<DollarSign size={16}/>},
        ].map(({label,value,color,icon})=>(
          <div key={label} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`${color}18`,color,border:`1.5px solid ${color}30`}}>{icon}</div>
            <div>
              <div className="font-display text-[26px] leading-none" style={{color}}>{value}</div>
              <div className="font-mono text-[11px] mt-0.5" style={{color:"var(--tx-3)"}}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[{key:"",label:"All"},{key:"active",label:"Active"},{key:"inactive",label:"Inactive"},{key:"on_leave",label:"On Leave"}].map(({key,label})=>(
          <button key={key} onClick={()=>setStatusFilter(key)}
            className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
            style={statusFilter===key
              ?{background:"var(--acc)",color:"#fff",boxShadow:"var(--shadow-acc)"}
              :{background:"var(--bg-card)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
            {label}
          </button>
        ))}
      </div>

      {isLoading?<div className="flex justify-center py-20"><Spinner size="lg"/></div>:
       filtered.length===0?(<EmptyState icon={<HardHat size={28}/>} title="No Workers" description="Add your first crew member" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>Add Worker</button>}/>):(
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                {["Worker","Role","Contact","Hourly","OT Rate","Status",""].map(h=>(
                  <th key={h} className="tbl-head">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((w,i)=>{
                const color=ROLE_COLORS[ROLES.indexOf(w.role)%ROLE_COLORS.length];
                return(
                  <tr key={w.id}>
                    <td className="tbl-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13px] flex-shrink-0 relative" style={{background:`${color}18`,color,border:`1.5px solid ${color}30`}}>
                          {w.firstName[0]}{w.lastName[0]}
                          {w.status==="active"&&<div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{background:"var(--ok)",borderColor:"var(--bg-card)"}}/>}
                        </div>
                        <div>
                          <p className="font-semibold text-[14px]" style={{color:"var(--tx)"}}>{w.firstName} {w.lastName}</p>
                          <p className="font-mono text-[11px]" style={{color:"var(--tx-3)"}}>Hired {formatDate(w.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="tbl-cell">
                      <span className="flex items-center gap-1.5 text-[13px]">
                        <span>{ROLE_ICONS[w.role]||"👷"}</span>
                        <span style={{color:"var(--tx-2)"}}>{capitalize(w.role)}</span>
                      </span>
                    </td>
                    <td className="tbl-cell">
                      <p className="text-[12.5px] flex items-center gap-1.5" style={{color:"var(--tx-2)"}}><Mail size={11}/>{w.email}</p>
                      {w.phone&&<p className="text-[12px] flex items-center gap-1.5 mt-1" style={{color:"var(--tx-3)"}}><Phone size={11}/>{w.phone}</p>}
                    </td>
                    <td className="tbl-cell">
                      {w.hourlyRate!=null
                        ?<span className="font-display text-[16px] flex items-center gap-1" style={{color:"var(--ok)"}}>${Number(w.hourlyRate).toFixed(2)}<span className="font-sans text-[11px] font-normal" style={{color:"var(--tx-3)"}}>/hr</span></span>
                        :<span style={{color:"var(--tx-3)"}}>—</span>}
                    </td>
                    <td className="tbl-cell">
                      {w.overtimeRate!=null
                        ?<span className="font-display text-[16px]" style={{color:"var(--warn)"}}>${Number(w.overtimeRate).toFixed(2)}<span className="font-sans text-[11px] font-normal" style={{color:"var(--tx-3)"}}>/hr</span></span>
                        :<span style={{color:"var(--tx-3)"}}>—</span>}
                    </td>
                    <td className="tbl-cell"><span className={clsx("badge",getStatusColor(w.status))}>{capitalize(w.status)}</span></td>
                    <td className="tbl-cell">
                      <div className="row-act flex items-center gap-1 justify-end">
                        <button className="btn btn-ghost p-2 rounded-lg" onClick={()=>setDetailWorker(w)}><Info size={13}/></button>
                        <button className="btn btn-ghost p-2 rounded-lg" onClick={()=>openEdit(w)}><Pencil size={13}/></button>
                        <button className="btn btn-ghost p-2 rounded-lg" style={{color:"var(--err)"}} onClick={()=>setDelTarget(w)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
       )}

      {/* Detail modal */}
      {detailWorker&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setDetailWorker(null)}>
          <div className="absolute inset-0 backdrop-blur-sm" style={{background:"var(--bg-overlay)"}}/>
          <div className="relative w-full max-w-sm animate-slide-up card p-6" onClick={e=>e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{background:"linear-gradient(90deg,var(--acc),var(--acc-2))"}}/>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-display text-[20px]" style={{background:"var(--acc-subtle)",color:"var(--acc)",border:"1.5px solid var(--acc-border)"}}>
                {detailWorker.firstName[0]}{detailWorker.lastName[0]}
              </div>
              <div>
                <p className="font-display text-[22px] tracking-wide" style={{color:"var(--tx)"}}>{detailWorker.firstName} {detailWorker.lastName}</p>
                <p className="text-[12px] font-mono" style={{color:"var(--tx-3)"}}>{ROLE_ICONS[detailWorker.role]} {capitalize(detailWorker.role)}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[{label:"Email",v:detailWorker.email},{label:"Phone",v:detailWorker.phone},{label:"Hourly Rate",v:detailWorker.hourlyRate?`$${Number(detailWorker.hourlyRate).toFixed(2)}/hr`:null},{label:"Overtime Rate",v:detailWorker.overtimeRate?`$${Number(detailWorker.overtimeRate).toFixed(2)}/hr`:null},{label:"Hired",v:formatDate(detailWorker.createdAt)}].filter(r=>r.v).map(({label,v})=>(
                <div key={label} className="flex justify-between py-2.5" style={{borderBottom:"1px solid var(--line)"}}>
                  <span className="font-mono text-[11px] uppercase tracking-wide" style={{color:"var(--tx-3)"}}>{label}</span>
                  <span className="text-[13px] font-medium" style={{color:"var(--tx)"}}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wide" style={{color:"var(--tx-3)"}}>Status</span>
                <span className={clsx("badge",getStatusColor(detailWorker.status))}>{capitalize(detailWorker.status)}</span>
              </div>
            </div>
            <button className="btn btn-secondary w-full justify-center mt-4" onClick={()=>setDetailWorker(null)}>Close</button>
          </div>
        </div>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit Worker":"Add Worker"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required error={fe.firstName}><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John"/></Field>
          <Field label="Last Name" required error={fe.lastName}><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe"/></Field>
          <Field label="Email" required error={fe.email}><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@site.com"/></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123"/></Field>
          <Field label="Role"><select className="input" value={form.role} onChange={s("role")}>{ROLES.map(r=><option key={r} value={r}>{capitalize(r)}</option>)}</select></Field>
          <Field label="Status"><select className="input" value={form.status} onChange={s("status")}><option value="active">Active</option><option value="inactive">Inactive</option><option value="on_leave">On Leave</option></select></Field>
          <Field label="Hourly Rate (CAD)" hint="Base pay per hour"><input type="number" className="input" value={form.hourlyRate} onChange={s("hourlyRate")} placeholder="0.00" min="0" step="0.01"/></Field>
          <Field label="Overtime Rate (CAD)" hint="Overtime pay per hour"><input type="number" className="input" value={form.overtimeRate} onChange={s("overtimeRate")} placeholder="0.00" min="0" step="0.01"/></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Add Worker"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Remove Worker" description={`Remove ${delTarget?.firstName} ${delTarget?.lastName}?`}/>
    </div>
  );
}
