"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, projectsApi, workersApi } from "@/lib/api";
import { Task, Project, Worker } from "@/types";
import { PageHeader, Spinner, EmptyState, Modal, Field, ConfirmDialog, Alert } from "@/components/ui/UI";
import { CheckSquare, Plus, Pencil, Trash2, Calendar, Users, X } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import clsx from "clsx";

const BLANK = { title: "", description: "", priority: "medium", projectId: "", startDate: "", dueDate: "", assignedWorkerIds: [] as string[] };
const PRIORITIES = ["low", "medium", "high", "urgent"];
const STATUSES = ["todo", "in_progress", "review", "done", "cancelled"];
interface FormErrors { title?: string; projectId?: string; }

export default function TasksPage() {
  const qc = useQueryClient();
  const [selProject, setSelProject] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [delTask, setDelTask] = useState<Task | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data: projData } = useQuery({ queryKey: ["all-projects"], queryFn: () => projectsApi.list({ limit: 100 }) });
  const { data: workersData } = useQuery({ queryKey: ["workers-tasks"], queryFn: () => workersApi.list({ limit: 100 }) });
  const projects: Project[] = extractArray<Project>(projData);
  const allWorkers: Worker[] = extractArray<Worker>(workersData);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks-page", selProject, statusFilter],
    queryFn: () => tasksApi.listByProject(selProject, { status: statusFilter || undefined, limit: 100 }),
    enabled: !!selProject,
  });
  const tasks: Task[] = extractArray<Task>(data);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.projectId) errs.projectId = "Project is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const toggleWorker = (wid: string) => setForm((p) => ({ ...p, assignedWorkerIds: p.assignedWorkerIds.includes(wid) ? p.assignedWorkerIds.filter((id) => id !== wid) : [...p.assignedWorkerIds, wid] }));

  const openCreate = () => { setEditTask(null); setForm({ ...BLANK, projectId: selProject }); setErr(""); setFormErrors({}); setOpen(true); };
  const openEdit = (t: Task) => {
    setEditTask(t);
    setForm({ title: t.title, description: t.description ?? "", priority: t.priority, projectId: t.projectId, startDate: t.startDate?.slice(0, 10) ?? "", dueDate: t.dueDate?.slice(0, 10) ?? "", assignedWorkerIds: t.assignedWorkers?.map((w) => w.id) ?? [] });
    setErr(""); setFormErrors({}); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      if (!validate()) return Promise.reject(new Error("Validation failed"));
      const payload = { ...form, startDate: form.startDate || undefined, dueDate: form.dueDate || undefined };
      return editTask ? tasksApi.update(editTask.id, payload) : tasksApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks-page", selProject] }); setOpen(false); },
    onError: (e: unknown) => { if ((e as Error).message !== "Validation failed") setErr(getErrMsg(e)); },
  });

  const delMut = useMutation({
    mutationFn: () => tasksApi.delete(delTask!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks-page", selProject] }); setDelTask(null); },
  });

  const progressMut = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => tasksApi.updateProgress(id, progress),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks-page", selProject] }),
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Tasks" subtitle="Track work across all projects"
        action={selProject ? <button className="btn btn-primary" onClick={openCreate}><Plus size={15} />New Task</button> : undefined} />

      <div className="card p-4 mb-6">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Select a project</p>
        <div className="flex flex-wrap gap-2">
          {projects.length === 0 && <span className="text-sm text-gray-600">No projects found.</span>}
          {projects.map((p: Project) => (
            <button key={p.id} onClick={() => setSelProject(p.id)}
              className={clsx("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                selProject === p.id ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-900/30" : "bg-white/[0.03] text-gray-500 border-white/[0.08] hover:border-white/20 hover:text-gray-300")}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {!selProject ? (
        <EmptyState icon={<CheckSquare size={20} />} title="Select a project above" description="Then manage its tasks here" />
      ) : (
        <>
          <div className="flex gap-0.5 mb-5 bg-white/[0.04] p-0.5 rounded-xl w-fit">
            {["", ...STATUSES].map((st) => (
              <button key={st} onClick={() => setStatusFilter(st)}
                className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  statusFilter === st ? "bg-violet-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300")}>
                {st ? capitalize(st) : "All"}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> :
              tasks.length === 0 ? (
                <EmptyState icon={<CheckSquare size={18} />} title="No tasks" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={14} />Add Task</button>} />
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {tasks.map((t: Task) => (
                    <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-200 text-sm">{t.title}</p>
                        {t.description && <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{t.description}</p>}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className={clsx("badge", getStatusColor(t.status))}>{capitalize(t.status)}</span>
                          <span className={clsx("badge", getStatusColor(t.priority))}>{capitalize(t.priority)}</span>
                          {t.dueDate && <span className="text-xs text-gray-600 flex items-center gap-1"><Calendar size={10} />{formatDate(t.dueDate)}</span>}
                          {t.assignedWorkers && t.assignedWorkers.length > 0 && (
                            <span className="text-xs text-violet-400 flex items-center gap-1"><Users size={10} />{t.assignedWorkers.length} assigned</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-28 hidden sm:block">
                          <div className="flex justify-between text-xs text-gray-600 mb-1"><span>Progress</span><span>{t.progress}%</span></div>
                          <input type="range" min={0} max={100} value={t.progress}
                            onChange={(e) => progressMut.mutate({ id: t.id, progress: Number(e.target.value) })}
                            className="w-full accent-violet-500 cursor-pointer" />
                        </div>
                        <button className="btn btn-ghost p-1.5" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                        <button className="btn btn-ghost p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-950/30" onClick={() => setDelTask(t)}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editTask ? "Edit Task" : "New Task"} size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Title" required error={formErrors.title}><input className="input" value={form.title} onChange={s("title")} placeholder="Task title" /></Field></div>
          <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={form.description} onChange={s("description")} placeholder="Description…" /></Field></div>
          <Field label="Project" required error={formErrors.projectId}>
            <select className="input" value={form.projectId} onChange={s("projectId")}>
              <option value="">Select…</option>
              {projects.map((p: Project) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select className="input" value={form.priority} onChange={s("priority")}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
            </select>
          </Field>
          <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={s("startDate")} /></Field>
          <Field label="Due Date"><input type="date" className="input" value={form.dueDate} onChange={s("dueDate")} /></Field>
          <div className="col-span-2">
            <Field label="Assign Workers">
              <div className="flex flex-wrap gap-2 mt-1">
                {allWorkers.map((w) => {
                  const selected = form.assignedWorkerIds.includes(w.id);
                  return (
                    <button key={w.id} type="button" onClick={() => toggleWorker(w.id)}
                      className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all",
                        selected ? "bg-violet-600/20 text-violet-300 border-violet-500/40" : "bg-white/[0.03] text-gray-500 border-white/[0.08] hover:border-white/20")}>
                      <div className={clsx("w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold", selected ? "bg-violet-500 text-white" : "bg-white/10 text-gray-500")}>
                        {w.firstName[0]}{w.lastName[0]}
                      </div>
                      {w.firstName} {w.lastName}
                      {selected && <X size={10} />}
                    </button>
                  );
                })}
                {allWorkers.length === 0 && <p className="text-xs text-gray-600">No workers available.</p>}
              </div>
            </Field>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}{editTask ? "Save" : "Create Task"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTask} onClose={() => setDelTask(null)} onConfirm={() => delMut.mutate()}
        loading={delMut.isPending} title="Delete Task" description={`Delete "${delTask?.title}"?`} />
    </div>
  );
}
