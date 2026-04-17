"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicePeriodsApi, workersApi } from "@/lib/api";
import { InvoicePeriod, Worker } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Clock, Pencil, Trash2, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { formatDate, formatCurrency, getErrMsg, extractArray, capitalize } from "@/lib/utils";

const BLANK={workerId:"",startDate:"",endDate:"",regularHours:"",overtimeHours:"",hourlyRate:"",overtimeRate:"",notes:""};
interface FE{workerId?:string;startDate?:string;endDate?:string;regularHours?:string}

export default function InvoicePeriodsPage() {
  const qc=useQueryClient();
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<InvoicePeriod|null>(null);
  const [delTarget,setDelTarget]=useState<InvoicePeriod|null>(null);
  const [form,setForm]=useState(BLANK);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<FE>({});
  const [workerFilter,setWorkerFilter]=useState("");

  const {data,isLoading}=useQuery({queryKey:["invoice-periods",workerFilter],queryFn:()=>invoicePeriodsApi.list({workerId:workerFilter||undefined,limit:100})});
  const {data:workersData}=useQuery({queryKey:["workers-select"],queryFn:()=>workersApi.list({limit:100})});

  const periods:InvoicePeriod[]=extractArray<InvoicePeriod>(data);
  const workers:Worker[]=extractArray<Worker>(workersData);

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
    const val=e.target.value;
    setForm(p=>{
      const updated={...p,[k]:val};
      if(k==="workerId"){const w=workers.find(w=>w.id===val);if(w){updated.hourlyRate=String(w.hourlyRate??"");updated.overtimeRate=String(w.overtimeRate??"")};}
      return updated;
    });
    setFe(p=>({...p,[k]:undefined}));
  };
  const validate=()=>{const e:FE={};if(!form.workerId)e.workerId="Select a worker";if(!form.startDate)e.startDate="Required";if(!form.endDate)e.endDate="Required";if(!form.regularHours||Number(form.regularHours)<0)e.regularHours="Required";setFe(e);return!Object.keys(e).length;};
  const calcTotal=()=>{const r=Number(form.regularHours)||0;const ot=Number(form.overtimeHours)||0;const rate=Number(form.hourlyRate)||0;const otRate=Number(form.overtimeRate)||rate*1.5;return r*rate+ot*otRate;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(p:InvoicePeriod)=>{setEditing(p);setForm({workerId:p.workerId,startDate:p.startDate.slice(0,10),endDate:p.endDate.slice(0,10),regularHours:String(p.regularHours),overtimeHours:String(p.overtimeHours),hourlyRate:String(p.hourlyRate),overtimeRate:String(p.overtimeRate),notes:p.notes??""});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));const payload={workerId:form.workerId,startDate:form.startDate,endDate:form.endDate,regularHours:Number(form.regularHours),overtimeHours:Number(form.overtimeHours)||0,hourlyRate:Number(form.hourlyRate)||0,overtimeRate:Number(form.overtimeRate)||0,totalPay:calcTotal(),notes:form.notes||undefined};return editing?invoicePeriodsApi.update(editing.id,payload):invoicePeriodsApi.create(payload);},onSuccess:()=>{qc.invalidateQueries({queryKey:["invoice-periods"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>invoicePeriodsApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["invoice-periods"]});setDelTarget(null);}});

  const totalPayout=periods.reduce((s,p)=>s+Number(p.totalPay),0);
  const totalOT=periods.reduce((s,p)=>s+Number(p.overtimeHours),0);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Pay Periods" subtitle="Worker payroll & overtime tracking" icon={<Clock size={22}/>}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Period</button>}/>

      {/* Summary */}
      {periods.length>0&&(
        <div className="grid grid-cols-3 gap-4">
          {[{label:"Total Periods",val:periods.length,color:"var(--acc)",icon:<Calendar size={18}/>},{label:"Total OT Hours",val:`${totalOT}h`,color:"var(--warn)",icon:<Clock size={18}/>},{label:"Total Payout",val:formatCurrency(totalPayout),color:"var(--ok)",icon:<DollarSign size={18}/>}].map(({label,val,color,icon})=>(
            <div key={label} className="card card-accent p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`${color}18`,color,border:`1.5px solid ${color}30`}}>{icon}</div>
              <div>
                <div className="font-display text-[28px] leading-none" style={{color}}>{val}</div>
                <div className="font-mono text-[11px] mt-0.5" style={{color:"var(--tx-3)"}}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Worker filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={()=>setWorkerFilter("")}
          className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all"
          style={!workerFilter?{background:"var(--acc)",color:"#fff",boxShadow:"var(--shadow-acc)"}:{background:"var(--bg-card)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
          All Workers
        </button>
        {workers.map(w=>(
          <button key={w.id} onClick={()=>setWorkerFilter(w.id)}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all"
            style={workerFilter===w.id?{background:"var(--acc)",color:"#fff",boxShadow:"var(--shadow-acc)"}:{background:"var(--bg-card)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
            {w.firstName} {w.lastName}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {isLoading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:
         periods.length===0?(<EmptyState icon={<Clock size={28}/>} title="No Pay Periods" description="Track worker hours and overtime" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Period</button>}/>):(
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["Worker","Period","Reg Hours","OT Hours","Rate","OT Rate","Total Pay",""].map(h=><th key={h} className="tbl-head">{h}</th>)}</tr></thead>
              <tbody>
                {periods.map(p=>{
                  const worker=workers.find(w=>w.id===p.workerId)??p.worker;
                  return(
                    <tr key={p.id}>
                      <td className="tbl-cell">
                        {worker?(
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold" style={{background:"var(--acc-subtle)",color:"var(--acc)",border:"1px solid var(--acc-border)"}}>
                              {worker.firstName[0]}{worker.lastName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-[14px]" style={{color:"var(--tx)"}}>{worker.firstName} {worker.lastName}</p>
                              <p className="text-[11px] font-mono" style={{color:"var(--tx-3)"}}>{capitalize(worker.role)}</p>
                            </div>
                          </div>
                        ):<span style={{color:"var(--tx-3)"}}>Unknown</span>}
                      </td>
                      <td className="tbl-cell">
                        <p className="font-mono text-[12.5px]" style={{color:"var(--tx)"}}>{formatDate(p.startDate)}</p>
                        <p className="font-mono text-[11px]" style={{color:"var(--tx-3)"}}>→ {formatDate(p.endDate)}</p>
                      </td>
                      <td className="tbl-cell font-display text-[16px]" style={{color:"var(--tx)"}}>{p.regularHours}h</td>
                      <td className="tbl-cell">
                        <span className="font-display text-[16px]" style={{color:Number(p.overtimeHours)>0?"var(--warn)":"var(--tx-3)"}}>{p.overtimeHours}h</span>
                      </td>
                      <td className="tbl-cell font-mono text-[12.5px]" style={{color:"var(--tx-2)"}}>${Number(p.hourlyRate).toFixed(2)}/hr</td>
                      <td className="tbl-cell font-mono text-[12.5px]" style={{color:"var(--warn)"}}>${Number(p.overtimeRate).toFixed(2)}/hr</td>
                      <td className="tbl-cell"><span className="font-display text-[18px]" style={{color:"var(--ok)"}}>{formatCurrency(p.totalPay)}</span></td>
                      <td className="tbl-cell">
                        <div className="row-act flex items-center gap-1 justify-end">
                          <button className="btn btn-ghost p-2 rounded-lg" onClick={()=>openEdit(p)}><Pencil size={13}/></button>
                          <button className="btn btn-ghost p-2 rounded-lg" style={{color:"var(--err)"}} onClick={()=>setDelTarget(p)}><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
         )}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit Pay Period":"New Pay Period"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Worker" required error={fe.workerId}><select className="input" value={form.workerId} onChange={s("workerId")}><option value="">Select worker…</option>{workers.map(w=><option key={w.id} value={w.id}>{w.firstName} {w.lastName} — {capitalize(w.role)}</option>)}</select></Field></div>
          <Field label="Start Date" required error={fe.startDate}><input type="date" className="input" value={form.startDate} onChange={s("startDate")}/></Field>
          <Field label="End Date" required error={(fe as any).endDate}><input type="date" className="input" value={form.endDate} onChange={s("endDate")}/></Field>
          <Field label="Regular Hours" required error={fe.regularHours}><input type="number" className="input" value={form.regularHours} onChange={s("regularHours")} placeholder="e.g. 80" min="0" step="0.5"/></Field>
          <Field label="Overtime Hours"><input type="number" className="input" value={form.overtimeHours} onChange={s("overtimeHours")} placeholder="0" min="0" step="0.5"/></Field>
          <Field label="Hourly Rate (CAD)"><input type="number" className="input" value={form.hourlyRate} onChange={s("hourlyRate")} placeholder="0.00" min="0" step="0.01"/></Field>
          <Field label="Overtime Rate (CAD)" hint="Auto: 1.5x if empty"><input type="number" className="input" value={form.overtimeRate} onChange={s("overtimeRate")} placeholder="0.00" min="0" step="0.01"/></Field>
          {(form.regularHours||form.overtimeHours)&&(
            <div className="col-span-2 card p-4 space-y-2">
              <p className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{color:"var(--tx-3)"}}>Pay Preview</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[{label:"Regular",val:formatCurrency((Number(form.regularHours)||0)*(Number(form.hourlyRate)||0)),color:"var(--ok)"},{label:"Overtime",val:formatCurrency((Number(form.overtimeHours)||0)*(Number(form.overtimeRate)||(Number(form.hourlyRate)||0)*1.5)),color:"var(--warn)"},{label:"Total",val:formatCurrency(calcTotal()),color:"var(--acc)"}].map(({label,val,color})=>(
                  <div key={label}>
                    <div className="font-display text-[22px] leading-none" style={{color}}>{val}</div>
                    <div className="font-mono text-[10px] mt-1" style={{color:"var(--tx-3)"}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="col-span-2"><Field label="Notes"><textarea className="input resize-none min-h-[60px]" value={form.notes} onChange={s("notes")} placeholder="Optional notes…"/></Field></div>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Create Period"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Pay Period" description="Delete this pay period?"/>
    </div>
  );
}
