"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, projectsApi, workersApi } from "@/lib/api";
import { Task, Project, Worker } from "@/types";
import { PageHeader, Spinner, EmptyState, Modal, Field, ConfirmDialog, Alert } from "@/components/ui/UI";
import { CheckSquare, Plus, Pencil, Trash2, Calendar, Users, X, FolderKanban, CircleCheck, Clock, Zap } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import clsx from "clsx";

const BLANK={title:"",description:"",priority:"medium",projectId:"",startDate:"",dueDate:"",assignedWorkerIds:[] as string[]};
const PRIORITIES=["low","medium","high","urgent"];
const STATUSES=["todo","in_progress","review","done","cancelled"];
interface FE{title?:string;projectId?:string}

const STATUS_META:{[k:string]:{icon:any;color:string;bg:string}}={
  todo:{icon:<Clock size={12}/>,color:"var(--muted)",bg:"var(--muted-bg)"},
  in_progress:{icon:<Zap size={12}/>,color:"var(--acc)",bg:"var(--acc-subtle)"},
  review:{icon:<CircleCheck size={12}/>,color:"var(--info)",bg:"var(--info-bg)"},
  done:{icon:<CheckSquare size={12}/>,color:"var(--ok)",bg:"var(--ok-bg)"},
  cancelled:{icon:<X size={12}/>,color:"var(--err)",bg:"var(--err-bg)"},
};

export default function TasksPage() {
  const qc=useQueryClient();
  const [selProject,setSelProject]=useState("");
  const [statusFilter,setStatusFilter]=useState("");
  const [open,setOpen]=useState(false);
  const [editTask,setEditTask]=useState<Task|null>(null);
  const [delTask,setDelTask]=useState<Task|null>(null);
  const [form,setForm]=useState(BLANK);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<FE>({});

  const {data:projData}=useQuery({queryKey:["all-projects"],queryFn:()=>projectsApi.list({limit:100})});
  const {data:workersData}=useQuery({queryKey:["workers-tasks"],queryFn:()=>workersApi.list({limit:100})});
  const projects:Project[]=extractArray<Project>(projData);
  const allWorkers:Worker[]=extractArray<Worker>(workersData);

  const {data,isLoading}=useQuery({queryKey:["tasks-page",selProject,statusFilter],queryFn:()=>tasksApi.listByProject(selProject,{status:statusFilter||undefined,limit:100}),enabled:!!selProject});
  const tasks:Task[]=extractArray<Task>(data);

  const grouped=STATUSES.reduce((acc,st)=>{acc[st]=tasks.filter(t=>t.status===st);return acc;},{} as Record<string,Task[]>);

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e:FE={};if(!form.title.trim())e.title="Required";if(!form.projectId)e.projectId="Required";setFe(e);return!Object.keys(e).length;};
  const toggleWorker=(wid:string)=>setForm(p=>({...p,assignedWorkerIds:p.assignedWorkerIds.includes(wid)?p.assignedWorkerIds.filter(id=>id!==wid):[...p.assignedWorkerIds,wid]}));
  const openCreate=()=>{setEditTask(null);setForm({...BLANK,projectId:selProject});setErr("");setFe({});setOpen(true);};
  const openEdit=(t:Task)=>{setEditTask(t);setForm({title:t.title,description:t.description??"",priority:t.priority,projectId:t.projectId,startDate:t.startDate?.slice(0,10)??"",dueDate:t.dueDate?.slice(0,10)??"",assignedWorkerIds:t.assignedWorkers?.map(w=>w.id)??[]});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));const payload={...form,startDate:form.startDate||undefined,dueDate:form.dueDate||undefined};return editTask?tasksApi.update(editTask.id,payload):tasksApi.create(payload);},onSuccess:()=>{qc.invalidateQueries({queryKey:["tasks-page",selProject]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>tasksApi.delete(delTask!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["tasks-page",selProject]});setDelTask(null);}});
  const progressMut=useMutation({mutationFn:({id,progress}:{id:string;progress:number})=>tasksApi.updateProgress(id,progress),onSuccess:()=>qc.invalidateQueries({queryKey:["tasks-page",selProject]})});

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Tasks" subtitle="Track work across all projects" icon={<CheckSquare size={22}/>}
        action={selProject?<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>New Task</button>:undefined}/>

      {/* Project selector */}
      <div className="card p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{color:"var(--tx-3)"}}>Select Project</p>
        <div className="flex flex-wrap gap-2">
          {projects.length===0&&<span className="text-[13px]" style={{color:"var(--tx-3)"}}>No projects found</span>}
          {projects.map((p:Project)=>(
            <button key={p.id} onClick={()=>setSelProject(p.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
              style={selProject===p.id
                ?{background:"var(--acc)",color:"#fff",boxShadow:"var(--shadow-acc)"}
                :{background:"var(--bg-raised)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
              <FolderKanban size={13}/>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {!selProject ? (
        <EmptyState icon={<CheckSquare size={28}/>} title="Select a Project" description="Choose a project above to view and manage its tasks"/>
      ) : (
        <>
          {/* Status filters */}
          <div className="flex gap-2 flex-wrap">
            {[{key:"",label:"All Tasks",count:tasks.length},...STATUSES.map(st=>({key:st,label:capitalize(st),count:grouped[st]?.length||0}))].map(({key,label,count})=>{
              const meta=key?STATUS_META[key]:null;
              return(
                <button key={key} onClick={()=>setStatusFilter(key)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all"
                  style={statusFilter===key
                    ?{background:meta?meta.bg:"var(--acc-subtle)",color:meta?meta.color:"var(--acc)",border:`1.5px solid ${meta?meta.color+"40":"var(--acc-border)"}`}
                    :{background:"var(--bg-card)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
                  {meta&&meta.icon}
                  {label}
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{background:"rgba(0,0,0,0.08)",color:"inherit"}}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Kanban / list view */}
          {isLoading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:
           tasks.length===0?(
             <EmptyState icon={<CheckSquare size={24}/>} title="No Tasks" description="Add the first task for this project"
               action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>Add Task</button>}/>
           ):(
             statusFilter ? (
               /* List view when filtered */
               <div className="card overflow-hidden">
                 {tasks.map((t:Task)=>(
                   <div key={t.id} className="flex items-center gap-4 px-5 py-4 transition-all group"
                     style={{borderBottom:"1px solid var(--line)"}}>
                     <div className="flex-1 min-w-0">
                       <p className="font-semibold text-[14px]" style={{color:"var(--tx)"}}>{t.title}</p>
                       {t.description&&<p className="text-[12.5px] mt-0.5 line-clamp-1" style={{color:"var(--tx-3)"}}>{t.description}</p>}
                       <div className="flex flex-wrap items-center gap-2 mt-2">
                         <span className={clsx("badge",getStatusColor(t.status))}>{capitalize(t.status)}</span>
                         <span className={clsx("badge",getStatusColor(t.priority))}>{capitalize(t.priority)}</span>
                         {t.dueDate&&<span className="text-[11px] font-mono flex items-center gap-1" style={{color:"var(--tx-3)"}}><Calendar size={10}/>{formatDate(t.dueDate)}</span>}
                         {t.assignedWorkers&&t.assignedWorkers.length>0&&<span className="text-[11px] font-mono flex items-center gap-1" style={{color:"var(--acc)"}}><Users size={10}/>{t.assignedWorkers.length}</span>}
                       </div>
                     </div>
                     <div className="flex items-center gap-3 flex-shrink-0">
                       <div className="w-28 hidden sm:block">
                         <div className="flex justify-between text-[10px] font-mono mb-1" style={{color:"var(--tx-3)"}}><span>Progress</span><span>{t.progress}%</span></div>
                         <input type="range" min={0} max={100} value={t.progress}
                           onChange={e=>progressMut.mutate({id:t.id,progress:Number(e.target.value)})}
                           className="w-full cursor-pointer" style={{accentColor:"var(--acc)"}}/>
                       </div>
                       <button className="btn btn-ghost p-1.5 rounded-lg row-act" onClick={()=>openEdit(t)}><Pencil size={13}/></button>
                       <button className="btn btn-ghost p-1.5 rounded-lg row-act" style={{color:"var(--err)"}} onClick={()=>setDelTask(t)}><Trash2 size={13}/></button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               /* Kanban columns */
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                 {(["todo","in_progress","review","done"] as const).map(st=>{
                   const meta=STATUS_META[st];
                   const colTasks=grouped[st]||[];
                   return(
                     <div key={st} className="card overflow-hidden">
                       <div className="px-4 py-3 flex items-center justify-between" style={{background:"var(--bg-raised)",borderBottom:"1px solid var(--line)"}}>
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:meta.bg,color:meta.color}}>{meta.icon}</div>
                           <span className="font-semibold text-[13px]" style={{color:"var(--tx)"}}>{capitalize(st)}</span>
                         </div>
                         <span className="font-mono text-[11px] px-2 py-0.5 rounded-full" style={{background:meta.bg,color:meta.color}}>{colTasks.length}</span>
                       </div>
                       <div className="p-3 space-y-2 min-h-[120px]">
                         {colTasks.map((t:Task)=>(
                           <div key={t.id} className="card p-3 group cursor-default">
                             <div className="flex items-start justify-between gap-2 mb-2">
                               <p className="font-medium text-[13px] leading-snug" style={{color:"var(--tx)"}}>{t.title}</p>
                               <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                 <button className="btn btn-ghost p-1 rounded" onClick={()=>openEdit(t)}><Pencil size={11}/></button>
                                 <button className="btn btn-ghost p-1 rounded" style={{color:"var(--err)"}} onClick={()=>setDelTask(t)}><Trash2 size={11}/></button>
                               </div>
                             </div>
                             <div className="flex items-center gap-1.5 mb-2">
                               <span className={clsx("badge text-[10px]",getStatusColor(t.priority))}>{capitalize(t.priority)}</span>
                               {t.dueDate&&<span className="text-[10px] font-mono" style={{color:"var(--tx-3)"}}>{formatDate(t.dueDate)}</span>}
                             </div>
                             <div className="progress-track"><div className="progress-bar" style={{width:`${t.progress}%`}}/></div>
                           </div>
                         ))}
                         {colTasks.length===0&&<div className="h-12 rounded-xl flex items-center justify-center hazard-stripe" style={{border:"1.5px dashed var(--line-strong)"}}><span className="text-[11px] font-mono" style={{color:"var(--tx-3)"}}>Drop here</span></div>}
                       </div>
                     </div>
                   );
                 })}
               </div>
             )
           )}
        </>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title={editTask?"Edit Task":"New Task"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Title" required error={fe.title}><input className="input" value={form.title} onChange={s("title")} placeholder="Task title"/></Field></div>
          <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={form.description} onChange={s("description")} placeholder="Details…"/></Field></div>
          <Field label="Project" required error={fe.projectId}><select className="input" value={form.projectId} onChange={s("projectId")}><option value="">Select…</option>{projects.map((p:Project)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <Field label="Priority"><select className="input" value={form.priority} onChange={s("priority")}>{PRIORITIES.map(p=><option key={p} value={p}>{capitalize(p)}</option>)}</select></Field>
          <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={s("startDate")}/></Field>
          <Field label="Due Date"><input type="date" className="input" value={form.dueDate} onChange={s("dueDate")}/></Field>
          <div className="col-span-2">
            <Field label="Assign Workers">
              <div className="flex flex-wrap gap-2 mt-1">
                {allWorkers.map(w=>{
                  const sel=form.assignedWorkerIds.includes(w.id);
                  return(
                    <button key={w.id} type="button" onClick={()=>toggleWorker(w.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
                      style={sel?{background:"var(--acc-subtle)",color:"var(--acc)",border:"1.5px solid var(--acc-border)"}:{background:"var(--bg-raised)",color:"var(--tx-2)",border:"1.5px solid var(--line)"}}>
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold" style={{background:sel?"var(--acc)":"var(--bg-sunken)",color:sel?"#fff":"var(--tx-3)"}}>
                        {w.firstName[0]}{w.lastName[0]}
                      </div>
                      {w.firstName} {w.lastName}
                      {sel&&<X size={10}/>}
                    </button>
                  );
                })}
                {allWorkers.length===0&&<p className="text-[12px]" style={{color:"var(--tx-3)"}}>No workers available</p>}
              </div>
            </Field>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editTask?"Save":"Create Task"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTask} onClose={()=>setDelTask(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Task" description={`Delete "${delTask?.title}"?`}/>
    </div>
  );
}
