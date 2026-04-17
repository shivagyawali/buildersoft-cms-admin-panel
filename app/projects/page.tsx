"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, clientsApi } from "@/lib/api";
import { Project, Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, FolderKanban, Pencil, Trash2, ArrowRight, Calendar, TrendingUp, Layers, Target, Clock, Wrench } from "lucide-react";
import { formatDate, formatCurrency, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const STATUSES=["planning","active","on_hold","completed","cancelled"];
const PRIORITIES=["low","medium","high","urgent"];
const BLANK={name:"",description:"",clientId:"",budgetAmount:"",startDate:"",expectedEndDate:"",priority:"medium",status:"active",location:"",type:""};
interface FE{name?:string;clientId?:string}

const STATUS_ICONS: Record<string,any> = {
  planning:<Clock size={12}/>, active:<Wrench size={12}/>, on_hold:<Target size={12}/>,
  completed:<TrendingUp size={12}/>, cancelled:<Layers size={12}/>,
};

export default function ProjectsPage() {
  const qc=useQueryClient();
  const [statusFilter,setStatusFilter]=useState("");
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<Project|null>(null);
  const [delTarget,setDelTarget]=useState<Project|null>(null);
  const [form,setForm]=useState(BLANK);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<FE>({});

  const {data,isLoading}=useQuery({queryKey:["projects",statusFilter],queryFn:()=>projectsApi.list({status:statusFilter||undefined,limit:50})});
  const {data:clientData}=useQuery({queryKey:["clients-select"],queryFn:()=>clientsApi.list({limit:100})});
  const projects:Project[]=extractArray<Project>(data);
  const clients:Client[]=extractArray<Client>(clientData);

  const filtered = statusFilter ? projects : projects;
  const statusCounts=STATUSES.reduce((acc,st)=>{acc[st]=projects.filter(p=>p.status===st).length;return acc;},{} as Record<string,number>);

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=():boolean=>{const e:FE={};if(!form.name.trim())e.name="Name required";if(!form.clientId)e.clientId="Select a client";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(p:Project)=>{setEditing(p);setForm({name:p.name,description:p.description??"",clientId:p.clientId,budgetAmount:String(p.budgetAmount??""),startDate:p.startDate?.slice(0,10)??"",expectedEndDate:p.expectedEndDate?.slice(0,10)??"",priority:p.priority,status:p.status,location:(p as any).location??"",type:(p as any).type??""});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));const payload={name:form.name,description:form.description,clientId:form.clientId,budgetAmount:form.budgetAmount?Number(form.budgetAmount):undefined,startDate:form.startDate||undefined,expectedEndDate:form.expectedEndDate||undefined,priority:form.priority,status:form.status,location:form.location||undefined,type:form.type||undefined};return editing?projectsApi.update(editing.id,payload):projectsApi.create(payload);},onSuccess:()=>{qc.invalidateQueries({queryKey:["projects"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>projectsApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["projects"]});setDelTarget(null);}});

  const PRIORITY_COLORS:Record<string,string>={low:"var(--muted)",medium:"var(--info)",high:"var(--warn)",urgent:"var(--err)"};

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Projects" subtitle={`${projects.length} project${projects.length!==1?"s":""}`} icon={<FolderKanban size={22}/>}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Project</button>}/>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[{key:"",label:"All Projects",count:projects.length},...STATUSES.map(st=>({key:st,label:capitalize(st),count:statusCounts[st]}))].map(({key,label,count})=>(
          <button key={key} onClick={()=>setStatusFilter(key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
            style={statusFilter===key
              ?{background:"var(--acc)",color:"#fff",boxShadow:"var(--shadow-acc)"}
              :{background:"var(--bg-card)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
            {key&&STATUS_ICONS[key]}
            {label}
            <span className="text-[11px] px-1.5 py-0.5 rounded-full font-mono"
              style={{background:statusFilter===key?"rgba(255,255,255,0.2)":"var(--bg-sunken)",color:statusFilter===key?"#fff":"var(--tx-3)"}}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {isLoading?<div className="flex justify-center py-20"><Spinner size="lg"/></div>:
       projects.length===0?(
         <EmptyState icon={<FolderKanban size={28}/>} title="No Projects" description="Create your first construction project" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Project</button>}/>
       ):(
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
           {projects.map((p:Project)=>(
             <div key={p.id} className="card card-hover card-accent flex flex-col">
               <div className="p-5 flex-1">
                 <div className="flex items-start justify-between mb-3">
                   <div className="flex-1 min-w-0">
                     <Link href={`/projects/${p.id}`} className="font-display text-[20px] tracking-wide leading-none block truncate transition-colors"
                       style={{color:"var(--tx)"}}
                       onMouseOver={e=>(e.currentTarget.style.color="var(--acc)")}
                       onMouseOut={e=>(e.currentTarget.style.color="var(--tx)")}>
                       {p.name.toUpperCase()}
                     </Link>
                     {p.client&&<p className="text-[12px] mt-1 font-mono" style={{color:"var(--tx-3)"}}>{p.client.firstName} {p.client.lastName}</p>}
                   </div>
                   <div className="flex gap-1 ml-2 flex-shrink-0">
                     <button className="btn btn-ghost p-1.5 rounded-lg" onClick={()=>openEdit(p)}><Pencil size={12}/></button>
                     <button className="btn btn-ghost p-1.5 rounded-lg" style={{color:"var(--err)"}} onClick={()=>setDelTarget(p)}><Trash2 size={12}/></button>
                   </div>
                 </div>
                 {p.description&&<p className="text-[13px] line-clamp-2 mb-3" style={{color:"var(--tx-2)"}}>{p.description}</p>}
                 <div className="flex flex-wrap gap-2 mb-4">
                   <span className={clsx("badge",getStatusColor(p.status))}>{capitalize(p.status)}</span>
                   <span className="badge text-[10.5px] font-semibold" style={{background:`${PRIORITY_COLORS[p.priority]}18`,color:PRIORITY_COLORS[p.priority]}}>{capitalize(p.priority)}</span>
                 </div>
                 {typeof p.progress==="number"&&(
                   <div className="mb-3">
                     <div className="flex justify-between text-[11px] font-mono mb-1.5" style={{color:"var(--tx-3)"}}><span>Progress</span><span>{p.progress}%</span></div>
                     <div className="progress-track"><div className="progress-bar" style={{width:`${p.progress}%`}}/></div>
                   </div>
                 )}
               </div>
               <div className="px-5 py-3 flex items-center justify-between" style={{borderTop:"1px solid var(--line)",background:"var(--bg-raised)"}}>
                 <div className="flex items-center gap-3 text-[11px] font-mono" style={{color:"var(--tx-3)"}}>
                   {p.expectedEndDate&&<span className="flex items-center gap-1"><Calendar size={10}/>{formatDate(p.expectedEndDate)}</span>}
                   {p.budgetAmount&&<span className="flex items-center gap-1" style={{color:"var(--ok)"}}><TrendingUp size={10}/>{formatCurrency(p.budgetAmount)}</span>}
                 </div>
                 <Link href={`/projects/${p.id}`} className="btn btn-ghost p-1.5 rounded-lg text-[12px] flex items-center gap-1" style={{color:"var(--acc)"}}>
                   Open<ArrowRight size={12}/>
                 </Link>
               </div>
             </div>
           ))}
         </div>
       )}

      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit Project":"New Project"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Project Name" required error={fe.name}><input className="input" value={form.name} onChange={s("name")} placeholder="Downtown Tower Renovation"/></Field></div>
          <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[70px]" value={form.description} onChange={s("description")} placeholder="Project overview…"/></Field></div>
          <Field label="Client" required error={fe.clientId}><select className="input" value={form.clientId} onChange={s("clientId")}><option value="">Select client…</option>{clients.map(c=><option key={c.id} value={c.id}>{c.firstName} {c.lastName}{c.company?` — ${c.company}`:""}</option>)}</select></Field>
          <Field label="Budget (CAD)"><input type="number" className="input" value={form.budgetAmount} onChange={s("budgetAmount")} placeholder="0.00" min="0"/></Field>
          <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={s("startDate")}/></Field>
          <Field label="End Date"><input type="date" className="input" value={form.expectedEndDate} onChange={s("expectedEndDate")}/></Field>
          <Field label="Priority"><select className="input" value={form.priority} onChange={s("priority")}>{PRIORITIES.map(p=><option key={p} value={p}>{capitalize(p)}</option>)}</select></Field>
          <Field label="Status"><select className="input" value={form.status} onChange={s("status")}>{STATUSES.map(st=><option key={st} value={st}>{capitalize(st)}</option>)}</select></Field>
          <Field label="Location"><input className="input" value={form.location} onChange={s("location")} placeholder="123 Site Ave, Toronto ON"/></Field>
          <Field label="Type"><input className="input" value={form.type} onChange={s("type")} placeholder="Residential, Commercial, Infrastructure…"/></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Create Project"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Project" description={`Delete "${delTarget?.name}"? This cannot be undone.`}/>
    </div>
  );
}
