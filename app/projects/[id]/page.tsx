"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, tasksApi, workersApi } from "@/lib/api";
import { Task, Worker } from "@/types";
import { PageHeader, Spinner, Modal, Field, ConfirmDialog, EmptyState, Alert } from "@/components/ui/UI";
import { ArrowLeft, Plus, CheckSquare, Pencil, Trash2, Calendar, User } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg } from "@/lib/utils";
import Link from "next/link";
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

const TASK_BLANK = { title: "", description: "", priority: "medium", startDate: "", dueDate: "", assignedToId: "" };
const STATUSES = ["todo", "in_progress", "review", "done", "cancelled"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient();
  const [taskOpen, setTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [delTask, setDelTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState(TASK_BLANK);
  const [statusFilter, setStatusFilter] = useState("");
  const [taskErr, setTaskErr] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["project", params.id], queryFn: () => projectsApi.get(params.id) });
  const { data: statsData } = useQuery({ queryKey: ["project-stats", params.id], queryFn: () => projectsApi.getStats(params.id) });
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", params.id, statusFilter],
    queryFn: () => tasksApi.listByProject(params.id, { status: statusFilter || undefined, limit: 100 }),
  });
  const { data: workersData } = useQuery({
    queryKey: ["workers-list"],
    queryFn: () => workersApi.list({ limit: 100 }),
  });

  const project = data?.data?.data ?? data?.data;
  const tasks: Task[] = extractArray<Task>(tasksData);
  const workers: Worker[] = extractArray<Worker>(workersData);
  const stats = statsData?.data?.data ?? statsData?.data;

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setTaskForm((p) => ({ ...p, [k]: e.target.value }));

  const openCreate = () => { setEditTask(null); setTaskForm(TASK_BLANK); setTaskErr(""); setTaskOpen(true); };
  const openEdit = (t: Task) => {
    setEditTask(t);
    setTaskForm({ title: t.title, description: t.description ?? "", priority: t.priority, startDate: t.startDate?.slice(0, 10) ?? "", dueDate: t.dueDate?.slice(0, 10) ?? "", assignedToId: t.assignedToId ?? "" });
    setTaskErr(""); setTaskOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = { ...taskForm, projectId: params.id, assignedToId: taskForm.assignedToId || undefined };
      return editTask ? tasksApi.update(editTask.id, payload) : tasksApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks", params.id] }); setTaskOpen(false); },
    onError: (e) => setTaskErr(getErrMsg(e)),
  });

  const delMut = useMutation({
    mutationFn: () => tasksApi.delete(delTask!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks", params.id] }); setDelTask(null); },
  });

  const progressMut = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => tasksApi.updateProgress(id, progress),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", params.id] }),
  });

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!project) return <div className="text-stone-400 text-center py-24">Project not found</div>;

  return (
    <div className="animate-fade-in">
      <Link href="/projects" className="btn btn-ghost mb-6 -ml-2 text-stone-500"><ArrowLeft size={16} /> Back to Projects</Link>
      <PageHeader title={project.name} subtitle={project.client ? `${project.client.firstName} ${project.client.lastName}` : undefined} />

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={clsx("badge", getStatusColor(project.status))}>{capitalize(project.status)}</span>
        <span className={clsx("badge", getStatusColor(project.priority))}>{capitalize(project.priority)}</span>
        {project.expectedEndDate && <span className="badge bg-stone-100 text-stone-600 flex items-center gap-1"><Calendar size={11} />Due {formatDate(project.expectedEndDate)}</span>}
        {project.budgetAmount && <span className="badge bg-stone-100 text-stone-600">Budget: ${Number(project.budgetAmount).toLocaleString()}</span>}
      </div>

      {typeof project.progress === "number" && (
        <div className="card p-5 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-stone-700">Overall Progress</span>
            <span className="font-semibold text-amber-600">{project.progress}%</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
          </div>
          {stats && (
            <div className="flex gap-5 mt-3 text-xs text-stone-400">
              <span>{stats.totalTasks ?? 0} total</span>
              <span>{stats.completedTasks ?? 0} completed</span>
              <span>{stats.inProgressTasks ?? 0} in progress</span>
            </div>
          )}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-stone-100">
          <span className="font-semibold text-stone-800">Tasks</span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-0.5 bg-stone-100 p-0.5 rounded-lg">
              {["", ...STATUSES].map((st) => (
                <button key={st} onClick={() => setStatusFilter(st)}
                  className={clsx("px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                    statusFilter === st ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
                  {st ? capitalize(st) : "All"}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={openCreate}><Plus size={14} />Add Task</button>
          </div>
        </div>

        {tasksLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : tasks.length === 0 ? (
          <EmptyState icon={<CheckSquare size={18} />} title="No tasks yet"
            action={<button className="btn btn-primary" onClick={openCreate}><Plus size={14} />Add Task</button>} />
        ) : (
          <div className="divide-y divide-stone-50">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm">{t.title}</p>
                  {t.description && <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{t.description}</p>}
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
                    <div className="flex justify-between text-xs text-stone-400 mb-1">
                      <span>Progress</span><span>{t.progress}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={t.progress}
                      onChange={(e) => progressMut.mutate({ id: t.id, progress: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer h-1.5" />
                  </div>
                  <button className="btn btn-ghost p-1.5" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                  <button className="btn btn-ghost p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50" onClick={() => setDelTask(t)}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={taskOpen} onClose={() => setTaskOpen(false)} title={editTask ? "Edit Task" : "New Task"}>
        {taskErr && <Alert type="error" message={taskErr} />}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Title"><input className="input" value={taskForm.title} onChange={s("title")} required /></Field></div>
          <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={taskForm.description} onChange={s("description")} /></Field></div>
          <Field label="Priority">
            <select className="input" value={taskForm.priority} onChange={s("priority")}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
            </select>
          </Field>
          <Field label="Assign To Worker">
            <select className="input" value={taskForm.assignedToId} onChange={s("assignedToId")}>
              <option value="">Unassigned</option>
              {workers.map((w) => <option key={w.id} value={w.id}>{w.firstName} {w.lastName} ({capitalize(w.trade)})</option>)}
            </select>
          </Field>
          <Field label="Start Date"><input type="date" className="input" value={taskForm.startDate} onChange={s("startDate")} /></Field>
          <Field label="Due Date"><input type="date" className="input" value={taskForm.dueDate} onChange={s("dueDate")} /></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setTaskOpen(false)}>Cancel</button>
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
