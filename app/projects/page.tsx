"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, clientsApi } from "@/lib/api";
import { Project, Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, FolderKanban, Pencil, Trash2, ArrowUpRight, Calendar, TrendingUp } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const STATUSES=["planning","active","on_hold","completed","cancelled"];
const PRIORITIES=["low","medium","high","urgent"];
const BLANK={name:"",description:"",clientId:"",budgetAmount:"",startDate:"",expectedEndDate:"",priority:"medium",status:"active",location:"",type:""};
interface FE{name?:string;clientId?:string;}

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

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=():boolean=>{const e:FE={};if(!form.name.trim())e.name="Name required";if(!form.clientId)e.clientId="Select a client";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(p:Project)=>{setEditing(p);setForm({name:p.name,description:p.description??"",clientId:p.clientId,budgetAmount:String(p.budgetAmount??""),startDate:p.startDate?.slice(0,10)??"",expectedEndDate:p.expectedEndDate?.slice(0,10)??"",priority:p.priority,status:p.status,location:p.location??"",type:p.type??""});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));const payload={name:form.name,description:form.description,clientId:form.clientId,budgetAmount:form.budgetAmount?Number(form.budgetAmount):undefined,startDate:form.startDate||undefined,expectedEndDate:form.expectedEndDate||undefined,priority:form.priority,status:form.status,location:form.location||undefined,type:form.type||undefined};return editing?projectsApi.update(editing.id,payload):projectsApi.create(payload);},onSuccess:()=>{qc.invalidateQueries({queryKey:["projects"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>projectsApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["projects"]});setDelTarget(null);}});
  const statusCounts=STATUSES.reduce((acc,st)=>{acc[st]=projects.filter(p=>p.status===st).length;return acc;},{} as Record<string,number>);
  const COLORS=[{bg:"var(--am3)",fg:"var(--am)"},{bg:"var(--bl2)",fg:"var(--bl)"},{bg:"var(--ok-bg)",fg:"var(--ok)"},{bg:"var(--err-bg)",fg:"var(--err)"},{bg:"var(--violet-bg)",fg:"var(--violet)"}];

  return (
    <div className="animate-fade-in relative z-10">
      <PageHeader title="Projects" subtitle={`${projects.length} projects`} action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>New Project</button>}/>
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {[{key:"",label:"All",count:projects.length},...STATUSES.map(st=>({key:st,label:capitalize(st),count:statusCounts[st]}))].map(({key,label,count})=>(
          <button key={key} onClick={()=>setStatusFilter(key)} className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] border transition-all" style={{borderRadius:2,...(statusFilter===key?{background:"var(--am3)",color:"var(--am)",borderColor:"rgba(232,160,32,0.3)"}:{background:"var(--c3)",color:"var(--t3)",borderColor:"var(--ln)"})}}>
            {label}<span style={{background:statusFilter===key?"rgba(232,160,32,0.2)":"var(--c5)",color:statusFilter===key?"var(--am)":"var(--t3)",padding:"1px 6px",borderRadius:2,fontSize:10}}>{count}</span>
          </button>
        ))}
      </div>
      {isLoading?<div className="flex justify-center py-16"><Spinner/></div>:projects.length===0?(
        <EmptyState icon={<FolderKanban size={18}/>} title="No projects" description="Create your first project" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>New Project</button>}/>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p:Project,i)=>{const col=COLORS[i%COLORS.length];return(
            <div key={p.id} className="card card-hover p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 flex items-center justify-center font-display font-bold text-[12px] flex-shrink-0" style={{background:col.bg,color:col.fg,borderRadius:2}}>{p.name[0]}</div>
                    <Link href={`/projects/${p.id}`} className="font-display font-bold text-[14px] uppercase tracking-[0.04em] truncate transition-colors" style={{color:"var(--t1)"}} onMouseOver={e=>(e.currentTarget.style.color="var(--am)")} onMouseOut={e=>(e.currentTarget.style.color="var(--t1)")}>{p.name}</Link>
                  </div>
                  {p.client&&<p className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{color:"var(--t3)"}}>{p.client.firstName} {p.client.lastName}</p>}
                </div>
                <div className="flex gap-0.5 ml-2 flex-shrink-0">
                  <button className="btn btn-ghost p-1.5" onClick={()=>openEdit(p)}><Pencil size={12}/></button>
                  <button className="btn btn-ghost p-1.5" style={{color:"var(--err)",opacity:0.4}} onMouseOver={e=>{(e.currentTarget as HTMLElement).style.opacity="1";(e.currentTarget as HTMLElement).style.background="var(--err-bg)"}} onMouseOut={e=>{(e.currentTarget as HTMLElement).style.opacity="0.4";(e.currentTarget as HTMLElement).style.background="transparent"}} onClick={()=>setDelTarget(p)}><Trash2 size={12}/></button>
                </div>
              </div>
              {p.description&&<p className="text-[12.5px] line-clamp-2" style={{color:"var(--t3)"}}>{p.description}</p>}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={clsx("badge",getStatusColor(p.status))}>{capitalize(p.status)}</span>
                <span className={clsx("badge",getStatusColor(p.priority))}>{capitalize(p.priority)}</span>
              </div>
              {typeof p.progress==="number"&&(
                <div>
                  <div className="flex justify-between font-mono text-[10px] mb-1.5" style={{color:"var(--t3)"}}><span>Progress</span><span>{p.progress}%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${p.progress}%`}}/></div>
                </div>
              )}
              <div className="flex items-center justify-between font-mono text-[10.5px] pt-2" style={{borderTop:"1px solid var(--ln)",color:"var(--t3)"}}>
                {p.expectedEndDate?<span className="flex items-center gap-1"><Calendar size={10}/>{formatDate(p.expectedEndDate)}</span>:<span/>}
                {p.budgetAmount&&<span className="flex items-center gap-1" style={{color:"var(--ok)"}}><TrendingUp size={10}/>${Number(p.budgetAmount).toLocaleString()}</span>}
                <Link href={`/projects/${p.id}`} className="flex items-center gap-1 transition-colors" style={{color:"var(--am)"}} onMouseOver={e=>(e.currentTarget.style.color="var(--am2)")} onMouseOut={e=>(e.currentTarget.style.color="var(--am)")}>Open<ArrowUpRight size={10}/></Link>
              </div>
            </div>
          );})}
        </div>
      )}
      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit Project":"New Project"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-x-5 gap-y-1">
          <div className="col-span-2"><Field label="Project Name" required error={fe.name}><input className="input" value={form.name} onChange={s("name")} placeholder="Project name"/></Field></div>
          <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[70px]" value={form.description} onChange={s("description")} placeholder="Brief description…"/></Field></div>
          <Field label="Client" required error={fe.clientId}><select className="input" value={form.clientId} onChange={s("clientId")}><option value="">Select client…</option>{clients.map(c=><option key={c.id} value={c.id}>{c.firstName} {c.lastName}{c.company?` — ${c.company}`:""}</option>)}</select></Field>
          <Field label="Budget (CAD)"><input type="number" className="input" value={form.budgetAmount} onChange={s("budgetAmount")} placeholder="0.00" min="0"/></Field>
          <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={s("startDate")}/></Field>
          <Field label="End Date"><input type="date" className="input" value={form.expectedEndDate} onChange={s("expectedEndDate")}/></Field>
          <Field label="Priority"><select className="input" value={form.priority} onChange={s("priority")}>{PRIORITIES.map(p=><option key={p} value={p}>{capitalize(p)}</option>)}</select></Field>
          <Field label="Status"><select className="input" value={form.status} onChange={s("status")}>{STATUSES.map(st=><option key={st} value={st}>{capitalize(st)}</option>)}</select></Field>
          <Field label="Location"><input className="input" value={form.location} onChange={s("location")} placeholder="Site address"/></Field>
          <Field label="Type"><input className="input" value={form.type} onChange={s("type")} placeholder="Residential, Commercial…"/></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--ln)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Create Project"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Project" description={`Delete "${delTarget?.name}"?`}/>
    </div>
  );
}
