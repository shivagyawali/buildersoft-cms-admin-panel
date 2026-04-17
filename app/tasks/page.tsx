"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, projectsApi, workersApi } from "@/lib/api";
import { Task, Project, Worker } from "@/types";
import { Spinner, EmptyState, Modal, Field, ConfirmDialog, Alert } from "@/components/ui/UI";
import { CheckSquare, Plus, Pencil, Trash2, Calendar, Users, X } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import clsx from "clsx";

const BLANK = {title:"",description:"",priority:"medium",projectId:"",startDate:"",dueDate:"",assignedWorkerIds:[] as string[]};
const PRIORITIES=["low","medium","high","urgent"];
const STATUSES=["todo","in_progress","review","done","cancelled"];

export default function TasksPage() {
  const qc=useQueryClient();
  const [selProject,setSelProject]=useState("");
  const [stFilter,setStFilter]=useState("");
  const [open,setOpen]=useState(false);
  const [editTask,setEditTask]=useState<Task|null>(null);
  const [delTask,setDelTask]=useState<Task|null>(null);
  const [form,setForm]=useState(BLANK);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<{title?:string;projectId?:string}>({});

  const {data:projData}=useQuery({queryKey:["all-projects"],queryFn:()=>projectsApi.list({limit:100})});
  const {data:workersData}=useQuery({queryKey:["workers-tasks"],queryFn:()=>workersApi.list({limit:100})});
  const projects:Project[]=extractArray<Project>(projData);
  const allWorkers:Worker[]=extractArray<Worker>(workersData);

  const {data,isLoading}=useQuery({queryKey:["tasks-page",selProject,stFilter],queryFn:()=>tasksApi.listByProject(selProject,{status:stFilter||undefined,limit:100}),enabled:!!selProject});
  const tasks:Task[]=extractArray<Task>(data);

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e:{title?:string;projectId?:string}={};if(!form.title.trim())e.title="Required";if(!form.projectId)e.projectId="Required";setFe(e);return!Object.keys(e).length;};
  const toggleWorker=(wid:string)=>setForm(p=>({...p,assignedWorkerIds:p.assignedWorkerIds.includes(wid)?p.assignedWorkerIds.filter(id=>id!==wid):[...p.assignedWorkerIds,wid]}));
  const openCreate=()=>{setEditTask(null);setForm({...BLANK,projectId:selProject});setErr("");setFe({});setOpen(true);};
  const openEdit=(t:Task)=>{setEditTask(t);setForm({title:t.title,description:t.description??"",priority:t.priority,projectId:t.projectId,startDate:t.startDate?.slice(0,10)??"",dueDate:t.dueDate?.slice(0,10)??"",assignedWorkerIds:t.assignedWorkers?.map(w=>w.id)??[]});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("Validation failed"));const payload={...form,startDate:form.startDate||undefined,dueDate:form.dueDate||undefined};return editTask?tasksApi.update(editTask.id,payload):tasksApi.create(payload);},onSuccess:()=>{qc.invalidateQueries({queryKey:["tasks-page",selProject]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="Validation failed")setErr(getErrMsg(e));}});
  const delMut=useMutation({mutationFn:()=>tasksApi.delete(delTask!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["tasks-page",selProject]});setDelTask(null);}});
  const progressMut=useMutation({mutationFn:({id,progress}:{id:string;progress:number})=>tasksApi.updateProgress(id,progress),onSuccess:()=>qc.invalidateQueries({queryKey:["tasks-page",selProject]})});

  const selName=projects.find(p=>p.id===selProject)?.name;

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="page-sub mb-1.5">Operations / Tasks</div>
          <h1 className="page-title">{selName?selName:"Field Tasks"}</h1>
          <p className="text-[13px] text-[color:var(--t2)] mt-1">{selProject?`${tasks.length} task${tasks.length!==1?"s":""}`:""} {!selProject?"Select a project to view tasks":""}</p>
        </div>
        {selProject&&<button className="btn btn-primary" onClick={openCreate}><Plus size={14}/>New Task</button>}
      </div>
      <div className="hairline-strong mb-5"/>

      {/* Project selector */}
      <div className="mb-6">
        <div className="label mb-2.5">Select Project</div>
        {projects.length===0?<p className="text-[12px] text-[color:var(--t3)] font-mono uppercase tracking-wide">No projects found.</p>:(
          <div className="flex flex-wrap gap-1.5">
            {projects.map(p=>(
              <button key={p.id} onClick={()=>{setSelProject(p.id);setStFilter("");}}
                className={clsx("px-4 py-2 text-[12.5px] font-medium border transition-all",selProject===p.id?"bg-[color:var(--am)] text-black border-[color:var(--am)]":"bg-[color:var(--c2)] text-[color:var(--t2)] border-[color:var(--ln2)] hover:border-[color:var(--am)] hover:text-[color:var(--am)]")} style={{borderRadius:2}}>{p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {!selProject?(
        <div className="card bp-grid flex items-center justify-center py-24">
          <div className="text-center"><CheckSquare size={22} className="mx-auto mb-3 text-[color:var(--t3)]"/><p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--t3)]">Select a project above to manage its tasks</p></div>
        </div>
      ):(
        <>
          <div className="flex gap-px bg-[color:var(--ln)] border border-[color:var(--ln)] mb-5 w-fit">
            {["",...STATUSES].map(st=>(
              <button key={st} onClick={()=>setStFilter(st)} className={clsx("px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-all",stFilter===st?"bg-[color:var(--am)] text-black font-semibold":"bg-[color:var(--c2)] text-[color:var(--t3)] hover:bg-[color:var(--c3)] hover:text-[color:var(--t1)]")}>
                {st?capitalize(st).replace("_"," "):"All"}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            {isLoading?<div className="flex justify-center py-12"><Spinner/></div>:tasks.length===0?(
              <EmptyState icon={<CheckSquare size={18}/>} title="No tasks" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={14}/>Add Task</button>}/>
            ):(
              <div className="divide-y divide-[color:var(--ln)]">
                {tasks.map(t=>(
                  <div key={t.id} className="flex items-center gap-5 px-6 py-4 hover:bg-[color:var(--c3)] transition-colors group">
                    {/* Progress ring */}
                    <div className="flex-shrink-0 relative w-9 h-9">
                      <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="var(--c5)" strokeWidth="3"/>
                        <circle cx="18" cy="18" r="14" fill="none" stroke="var(--am)" strokeWidth="3" strokeDasharray={`${2*Math.PI*14}`} strokeDashoffset={`${2*Math.PI*14*(1-(t.progress??0)/100)}`} strokeLinecap="square" className="transition-all duration-300"/>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-[color:var(--t3)]">{t.progress??0}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-[color:var(--t1)]">{t.title}</div>
                      {t.description&&<div className="text-[12.5px] text-[color:var(--t3)] mt-0.5 truncate">{t.description}</div>}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className={clsx("badge",getStatusColor(t.status))}>{capitalize(t.status).replace("_"," ")}</span>
                        <span className={clsx("badge",getStatusColor(t.priority))}>{capitalize(t.priority)}</span>
                        {t.dueDate&&<span className="text-[11px] text-[color:var(--t3)] font-mono flex items-center gap-1"><Calendar size={9}/>{formatDate(t.dueDate)}</span>}
                        {t.assignedWorkers&&t.assignedWorkers.length>0&&<span className="text-[11px] text-[color:var(--am)] font-mono flex items-center gap-1"><Users size={9}/>{t.assignedWorkers.length} assigned</span>}
                      </div>
                    </div>
                    <div className="w-28 hidden sm:block flex-shrink-0">
                      <input type="range" min={0} max={100} value={t.progress??0} onChange={e=>progressMut.mutate({id:t.id,progress:Number(e.target.value)})} style={{accentColor:"var(--am)"}} className="w-full cursor-pointer"/>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button className="btn btn-ghost p-2" onClick={()=>openEdit(t)}><Pencil size={13}/></button>
                      <button className="btn btn-ghost p-2 text-[color:var(--err)] hover:bg-[color:var(--err-bg)] transition-all" onClick={()=>setDelTask(t)}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} title={editTask?"Edit Task":"New Task"} size="lg">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <div className="col-span-2"><Field label="Title" required error={fe.title}><input className="input" value={form.title} onChange={s("title")} placeholder="Task title"/></Field></div>
          <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={form.description} onChange={s("description")} placeholder="Description…"/></Field></div>
          <Field label="Project" required error={fe.projectId}><select className="input" value={form.projectId} onChange={s("projectId")}><option value="">Select…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <Field label="Priority"><select className="input" value={form.priority} onChange={s("priority")}>{PRIORITIES.map(p=><option key={p} value={p}>{capitalize(p)}</option>)}</select></Field>
          <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={s("startDate")}/></Field>
          <Field label="Due Date"><input type="date" className="input" value={form.dueDate} onChange={s("dueDate")}/></Field>
          <div className="col-span-2">
            <Field label="Assign Workers">
              <div className="flex flex-wrap gap-2 mt-1">
                {allWorkers.map(w=>{const sel=form.assignedWorkerIds.includes(w.id);return(
                  <button key={w.id} type="button" onClick={()=>toggleWorker(w.id)} className={clsx("flex items-center gap-2 px-3 py-1.5 text-[12.5px] border transition-all",sel?"bg-[color:var(--am)] text-black border-[color:var(--am)]":"bg-[color:var(--c3)] text-[color:var(--t2)] border-[color:var(--ln2)] hover:border-[color:var(--am)] hover:text-[color:var(--am)]")} style={{borderRadius:2}}>
                    <span className="font-mono text-[10px]">{w.firstName[0]}{w.lastName[0]}</span>{w.firstName} {w.lastName}{sel&&<X size={10}/>}
                  </button>
                );})}
                {allWorkers.length===0&&<p className="text-[12px] text-[color:var(--t3)] font-mono uppercase tracking-wide">No workers on file.</p>}
              </div>
            </Field>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-[color:var(--ln)]">
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editTask?"Save":"Create Task"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTask} onClose={()=>setDelTask(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Delete Task" description={`Delete "${delTask?.title}"?`}/>
    </div>
  );
}
