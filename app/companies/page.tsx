"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api";
import { Company } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert, StatCard } from "@/components/ui/UI";
import { Plus, Building2, Trash2, Power, Users, FolderKanban, HardHat, Globe, TrendingUp, ArrowRight } from "lucide-react";
import { formatDate, formatCurrency, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const PLANS=["free","starter","pro","enterprise"];
const PLAN_COLORS:Record<string,{bg:string;color:string}>={
  free:{bg:"var(--muted-bg)",color:"var(--muted)"},starter:{bg:"var(--info-bg)",color:"var(--info)"},
  pro:{bg:"var(--acc-subtle)",color:"var(--acc)"},enterprise:{bg:"var(--purple-bg)",color:"var(--purple)"},
};
const STATUS_COLORS:Record<string,string>={active:"var(--ok)",trial:"var(--warn)",suspended:"var(--err)",inactive:"var(--muted)"};
const BLANK_CO={name:"",email:"",phone:"",city:"",province:"",country:"",website:"",plan:"free",maxUsers:"5",maxProjects:"10",maxWorkers:"20",ownerFirstName:"",ownerLastName:"",ownerEmail:"",ownerPassword:""};

export default function CompaniesPage() {
  const qc=useQueryClient();
  const [open,setOpen]=useState(false);
  const [delTarget,setDelTarget]=useState<Company|null>(null);
  const [form,setForm]=useState(BLANK_CO);
  const [err,setErr]=useState("");
  const [search,setSearch]=useState("");
  const [statusFilter,setStatusFilter]=useState("");

  const {data,isLoading}=useQuery({queryKey:["companies",statusFilter,search],queryFn:()=>companiesApi.list({status:statusFilter||undefined,search:search||undefined,limit:50})});
  const companies:Company[]=extractArray<Company>(data);

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setForm(p=>({...p,[k]:e.target.value}));
  const createMut=useMutation({mutationFn:()=>companiesApi.create({...form,maxUsers:Number(form.maxUsers),maxProjects:Number(form.maxProjects),maxWorkers:Number(form.maxWorkers)}),onSuccess:()=>{qc.invalidateQueries({queryKey:["companies"]});setOpen(false);setForm(BLANK_CO);},onError:(e:unknown)=>setErr(getErrMsg(e))});
  const toggleMut=useMutation({mutationFn:(id:string)=>companiesApi.toggleStatus(id),onSuccess:()=>qc.invalidateQueries({queryKey:["companies"]})});
  const delMut=useMutation({mutationFn:()=>companiesApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["companies"]});setDelTarget(null);}});

  const activeCount=companies.filter(c=>c.status==="active").length;
  const proCount=companies.filter(c=>c.plan==="pro"||c.plan==="enterprise").length;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Companies" subtitle={`${companies.length} registered on platform`} icon={<Building2 size={22}/>}
        action={<button className="btn btn-primary" onClick={()=>{setErr("");setOpen(true);}}><Plus size={15}/>New Company</button>}/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard label="Total Companies" value={companies.length} icon={<Building2 size={18}/>} color="orange" sub="All time"/>
        <StatCard label="Active" value={activeCount} icon={<Globe size={18}/>} color="green" sub="Currently active"/>
        <StatCard label="Pro / Enterprise" value={proCount} icon={<TrendingUp size={18}/>} color="violet" sub="Premium plans"/>
        <StatCard label="Trial" value={companies.filter(c=>c.status==="trial").length} icon={<HardHat size={18}/>} color="yellow" sub="Evaluating"/>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <input className="input" placeholder="Search companies…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2">
          {["","active","trial","suspended","inactive"].map(st=>(
            <button key={st} onClick={()=>setStatusFilter(st)}
              className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all"
              style={statusFilter===st?{background:"var(--acc)",color:"#fff",boxShadow:"var(--shadow-acc)"}:{background:"var(--bg-card)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
              {st||"All"}
            </button>
          ))}
        </div>
      </div>

      {isLoading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:
       companies.length===0?(<EmptyState icon={<Building2 size={28}/>} title="No Companies" description="Register your first company" action={<button className="btn btn-primary" onClick={()=>setOpen(true)}><Plus size={15}/>New Company</button>}/>):(
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
          {companies.map(c=>{
            const pc=PLAN_COLORS[c.plan];const sc=STATUS_COLORS[c.status];
            return(
              <div key={c.id} className="card card-hover overflow-hidden">
                {/* Top color bar */}
                <div className="h-1" style={{background:`linear-gradient(90deg,${pc.color},${pc.color}88)`}}/>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display text-[18px]" style={{background:`${pc.color}18`,color:pc.color,border:`1.5px solid ${pc.color}30`}}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display text-[18px] tracking-wide leading-none" style={{color:"var(--tx)"}}>{c.name}</p>
                        <p className="font-mono text-[10px] mt-0.5" style={{color:"var(--tx-3)"}}>{c.slug}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="badge text-[10px]" style={{background:pc.bg,color:pc.color}}>{c.plan.toUpperCase()}</span>
                      <span className="badge text-[10px]" style={{background:`${sc}18`,color:sc}}>{c.status}</span>
                    </div>
                  </div>
                  {c.email&&<p className="text-[12.5px] mb-3" style={{color:"var(--tx-2)"}}>{c.email}</p>}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[{icon:<Users size={11}/>,val:c.maxUsers,label:"users"},{icon:<FolderKanban size={11}/>,val:c.maxProjects,label:"projects"},{icon:<HardHat size={11}/>,val:c.maxWorkers,label:"workers"}].map(({icon,val,label})=>(
                      <div key={label} className="text-center py-2 rounded-xl" style={{background:"var(--bg-raised)",border:"1px solid var(--line)"}}>
                        <div className="flex items-center justify-center gap-1 font-mono text-[11px] mb-0.5" style={{color:"var(--tx-3)"}}>{icon}</div>
                        <div className="font-display text-[16px] leading-none" style={{color:"var(--tx)"}}>{val}</div>
                        <div className="font-mono text-[9px] mt-0.5" style={{color:"var(--tx-3)"}}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3" style={{borderTop:"1px solid var(--line)"}}>
                    <span className="font-mono text-[11px]" style={{color:"var(--tx-3)"}}>Since {formatDate(c.createdAt)}</span>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost p-2 rounded-lg transition-colors" style={{color:c.status==="active"?"var(--warn)":"var(--ok)"}} onClick={()=>toggleMut.mutate(c.id)} title={c.status==="active"?"Suspend":"Activate"}><Power size={13}/></button>
                      <button className="btn btn-ghost p-2 rounded-lg" style={{color:"var(--err)"}} onClick={()=>setDelTarget(c)}><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
       )}

      <Modal open={open} onClose={()=>setOpen(false)} title="New Company" size="xl">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 mb-1 font-mono text-[10.5px] uppercase tracking-widest pt-1 pb-1" style={{color:"var(--acc)",borderLeft:"3px solid var(--acc)",paddingLeft:10}}>Company Details</div>
          <Field label="Company Name *"><input className="input" value={form.name} onChange={s("name")} placeholder="Acme Construction Ltd."/></Field>
          <Field label="Plan"><select className="input" value={form.plan} onChange={s("plan")}>{PLANS.map(p=><option key={p} value={p}>{p.toUpperCase()}</option>)}</select></Field>
          <Field label="Email"><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="info@company.com"/></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0100"/></Field>
          <Field label="City"><input className="input" value={form.city} onChange={s("city")} placeholder="Toronto"/></Field>
          <Field label="Country"><input className="input" value={form.country} onChange={s("country")} placeholder="Canada"/></Field>
          <div className="col-span-2 mt-1 mb-1 font-mono text-[10.5px] uppercase tracking-widest pt-1 pb-1" style={{color:"var(--info)",borderLeft:"3px solid var(--info)",paddingLeft:10}}>Plan Limits</div>
          <Field label="Max Users"><input type="number" className="input" value={form.maxUsers} onChange={s("maxUsers")} min="1"/></Field>
          <Field label="Max Projects"><input type="number" className="input" value={form.maxProjects} onChange={s("maxProjects")} min="1"/></Field>
          <Field label="Max Workers"><input type="number" className="input" value={form.maxWorkers} onChange={s("maxWorkers")} min="1"/></Field>
          <div/>
          <div className="col-span-2 mt-1 mb-1 font-mono text-[10.5px] uppercase tracking-widest pt-1 pb-1" style={{color:"var(--ok)",borderLeft:"3px solid var(--ok)",paddingLeft:10}}>Company Admin (optional)</div>
          <Field label="First Name"><input className="input" value={form.ownerFirstName} onChange={s("ownerFirstName")} placeholder="John"/></Field>
          <Field label="Last Name"><input className="input" value={form.ownerLastName} onChange={s("ownerLastName")} placeholder="Smith"/></Field>
          <Field label="Admin Email"><input type="email" className="input" value={form.ownerEmail} onChange={s("ownerEmail")} placeholder="admin@company.com"/></Field>
          <Field label="Admin Password"><input type="password" className="input" value={form.ownerPassword} onChange={s("ownerPassword")} placeholder="Min 8 chars"/></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>createMut.mutate()} disabled={createMut.isPending}>{createMut.isPending&&<Spinner size="sm"/>}Create Company</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Company" description={`Permanently delete "${delTarget?.name}" and ALL its data?`}/>
    </div>
  );
}
