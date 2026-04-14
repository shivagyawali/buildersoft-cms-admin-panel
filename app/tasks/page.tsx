"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, projectsApi, workersApi } from "@/lib/api";
import { Task, Project, Worker } from "@/types";
import { PageHeader, Spinner, EmptyState, Modal, Field, ConfirmDialog, Alert } from "@/components/ui/UI";
import { CheckSquare, Plus, Pencil, Trash2, Calendar, User } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg } from "@/lib/utils";
import clsx from "clsx";

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data !== "object" || data === null) return [];
  const d = data as Record<string, unknown>;
  if ("data" in d && d.data !== undefined) return extractArray(d.data);
  for (const key in d) { if (Array.isArray(d[key])) return d[key] as T[]; }
  return [];
}

const BLANK = { title: "", description: "", priority: "medium", projectId: "", startDate: "", dueDate: "", assignedToId: "" };
const PRIORITIES = ["low", "medium", "high", "urgent"];
const STATUSES = ["todo", "in_progress", "review", "done", "cancelled"];

export default function TasksPage() {
  const qc = useQueryClient();
  const [selProject, setSelProject] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [delTask, setDelTask] = useState<Task | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");

  const { data: projData } = useQuery({ queryKey: ["all-projects"], queryFn: () => projectsApi.list({ limit: 100 }) });
  const { data: workersData } = useQuery({ queryKey: ["workers-list"], queryFn: () => workersApi.list({ limit: 100 }) });
  const { data, isLoading } = useQuery({
    queryKey: ["tasks-page", selProject, statusFilter],
    queryFn: () => tasksApi.listByProject(selProject, { status: statusFilter || undefined, limit: 100 }),
    enabled: !!selProject,
  });

  const projects: Project[] = extractArray<Project>(projData);
  const workers: Worker[] = extractArray<Worker>(workersData);
  const tasks: Task[] = extractArray<Task>(data);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const openCreate = () => { setEditTask(null); setForm({ ...BLANK, projectId: selProject }); setErr(""); setOpen(true); };
  const openEdit = (t: Task) => {
    setEditTask(t);
    setForm({ title: t.title, description: t.description ?? "", priority: t.priority, projectId: t.projectId, startDate: t.startDate?.slice(0, 10) ?? "", dueDate: t.dueDate?.slice(0, 10) ?? "", assignedToId: t.assignedToId ?? "" });
    setErr(""); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = { ...form, assignedToId: form.assignedToId || undefined };
      return editTask ? tasksApi.update(editTask.id, payload) : tasksApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks-page", selProject] }); setOpen(false); },
    onError: (e) => setErr(getErrMsg(e)),
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
        action={selProject ? <button className="btn btn-primary" onClick={openCreate}><Plus size={16} />New Task</button> : undefined}
      />

      <div className="card p-4 mb-6">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Select a project</p>
        <div className="flex flex-wrap gap-2">
          {projects.length === 0 && <span className="text-sm text-stone-400">No projects found.</span>}
          {projects.map((p) => (
            <button key={p.id} onClick={() => setSelProject(p.id)}
              className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                selProject === p.id ? "bg-amber-600 text-white border-amber-600" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50")}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {!selProject ? (
        <EmptyState icon={<CheckSquare size={20} />} title="Select a project above" description="Then manage its tasks here" />
      ) : (
        <>
          <div className="flex gap-0.5 mb-5 bg-stone-100 p-0.5 rounded-lg w-fit">
            {["", ...STATUSES].map((st) => (
              <button key={st} onClick={() => setStatusFilter(st)}
                className={clsx("px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  statusFilter === st ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
                {st ? capitalize(st) : "All"}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : tasks.length === 0 ? (
              <EmptyState icon={<CheckSquare size={18} />} title="No tasks"
                action={<button className="btn btn-primary" onClick={openCreate}><Plus size={14} />Add Task</button>} />
            ) : (
              <div className="divide-y divide-stone-50">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 text-sm">{t.title}</p>
                      {t.description && <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{t.description}</p>}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className={clsx("badge", getStatusColor(t.status))}>{capitalize(t.status)}</span>
                        <span className={clsx("badge", getStatusColor(t.priority))}>{capitalize(t.priority)}</span>
                        {t.dueDate && <span className="text-xs text-stone-400 flex items-center gap-1"><Calendar size={10} />{formatDate(t.dueDate)}</span>}
                        {t.assignedTo && (
                          <span className="text-xs text-stone-500 flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-full">
                            <User size={10} />{t.assignedTo.firstName} {t.assignedTo.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-28 hidden sm:block">
                        <div className="flex justify-between text-xs text-stone-400 mb-1"><span>Progress</span><span>{t.progress}%</span></div>
                        <input type="range" min={0} max={100} value={t.progress}
                          onChange={(e) => progressMut.mutate({ id: t.id, progress: Number(e.target.value) })}
                          className="w-full accent-amber-500 cursor-pointer" />
                      </div>
                      <button className="btn btn-ghost p-1.5" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                      <button className="btn btn-ghost p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50" onClick={() => setDelTask(t)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editTask ? "Edit Task" : "New Task"}>
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Title"><input className="input" value={form.title} onChange={s("title")} required /></Field></div>
          <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={form.description} onChange={s("description")} /></Field></div>
          <Field label="Project">
            <select className="input" value={form.projectId} onChange={s("projectId")} required>
              <option value="">Select…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select className="input" value={form.priority} onChange={s("priority")}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
            </select>
          </Field>
          <Field label="Assign To Worker">
            <select className="input" value={form.assignedToId} onChange={s("assignedToId")}>
              <option value="">Unassigned</option>
              {workers.map((w) => <option key={w.id} value={w.id}>{w.firstName} {w.lastName} ({capitalize(w.trade)})</option>)}
            </select>
          </Field>
          <div />
          <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={s("startDate")} /></Field>
          <Field label="Due Date"><input type="date" className="input" value={form.dueDate} onChange={s("dueDate")} /></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}{editTask ? "Save" : "Create Task"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTask} onClose={() => setDelTask(null)} onConfirm={() => delMut.mutate()} loading={delMut.isPending}
        title="Delete Task" description={`Delete "${delTask?.title}"?`} />
    </div>
  );
}
