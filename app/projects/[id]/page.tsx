"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, tasksApi, workersApi } from "@/lib/api";
import { Task, Worker } from "@/types";
import { PageHeader, Spinner, Modal, Field, ConfirmDialog, EmptyState, Alert, WorkerPopup } from "@/components/ui/UI";
import { ArrowLeft, Plus, CheckSquare, Pencil, Trash2, Calendar, Users, UserPlus, X, Info } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const TASK_BLANK = { title: "", description: "", priority: "medium", startDate: "", dueDate: "", assignedWorkerIds: [] as string[] };
const STATUSES = ["todo", "in_progress", "review", "done", "cancelled"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

interface TaskFormErrors { title?: string; }

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient();
  const [taskOpen, setTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [delTask, setDelTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState(TASK_BLANK);
  const [statusFilter, setStatusFilter] = useState("");
  const [taskErr, setTaskErr] = useState("");
  const [taskFormErrors, setTaskFormErrors] = useState<TaskFormErrors>({});
  const [workerPopup, setWorkerPopup] = useState<Worker | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["project", params.id], queryFn: () => projectsApi.get(params.id) });
  const { data: statsData } = useQuery({ queryKey: ["project-stats", params.id], queryFn: () => projectsApi.getStats(params.id) });
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", params.id, statusFilter],
    queryFn: () => tasksApi.listByProject(params.id, { status: statusFilter || undefined, limit: 100 }),
  });
  const { data: workersData } = useQuery({ queryKey: ["workers-list"], queryFn: () => workersApi.list({ limit: 100 }) });

  const project = data?.data?.data ?? data?.data;
  const tasks: Task[] = extractArray<Task>(tasksData);
  const stats = statsData?.data?.data ?? statsData?.data;
  const allWorkers: Worker[] = extractArray<Worker>(workersData);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTaskForm((p) => ({ ...p, [k]: e.target.value }));
    setTaskFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validateTask = () => {
    const errs: TaskFormErrors = {};
    if (!taskForm.title.trim()) errs.title = "Title is required";
    setTaskFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => { setEditTask(null); setTaskForm(TASK_BLANK); setTaskErr(""); setTaskFormErrors({}); setTaskOpen(true); };
  const openEdit = (t: Task) => {
    setEditTask(t);
    setTaskForm({
      title: t.title, description: t.description ?? "", priority: t.priority,
      startDate: t.startDate?.slice(0, 10) ?? "", dueDate: t.dueDate?.slice(0, 10) ?? "",
      assignedWorkerIds: t.assignedWorkers?.map((w) => w.id) ?? [],
    });
    setTaskErr(""); setTaskFormErrors({}); setTaskOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      if (!validateTask()) return Promise.reject(new Error("Validation failed"));
      const payload = {
        title: taskForm.title, description: taskForm.description,
        priority: taskForm.priority, projectId: params.id,
        startDate: taskForm.startDate || undefined,
        dueDate: taskForm.dueDate || undefined,
        assignedWorkerIds: taskForm.assignedWorkerIds,
      };
      return editTask ? tasksApi.update(editTask.id, payload) : tasksApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks", params.id] }); setTaskOpen(false); },
    onError: (e: unknown) => { if ((e as Error).message !== "Validation failed") setTaskErr(getErrMsg(e)); },
  });

  const delMut = useMutation({
    mutationFn: () => tasksApi.delete(delTask!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks", params.id] }); setDelTask(null); },
  });

  const progressMut = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => tasksApi.updateProgress(id, progress),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", params.id] }),
  });

  const toggleWorker = (wid: string) => {
    setTaskForm((p) => ({
      ...p,
      assignedWorkerIds: p.assignedWorkerIds.includes(wid)
        ? p.assignedWorkerIds.filter((id) => id !== wid)
        : [...p.assignedWorkerIds, wid],
    }));
  };

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!project) return <div className="text-gray-500 text-center py-24">Project not found</div>;

  return (
    <div className="animate-fade-in">
      <Link href="/projects" className="btn btn-ghost mb-6 -ml-2 text-gray-500"><ArrowLeft size={15} /> Back to Projects</Link>
      <PageHeader title={project.name} subtitle={project.client ? `${project.client.firstName} ${project.client.lastName}` : undefined} />

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={clsx("badge", getStatusColor(project.status))}>{capitalize(project.status)}</span>
        <span className={clsx("badge", getStatusColor(project.priority))}>{capitalize(project.priority)}</span>
        {project.expectedEndDate && (
          <span className="badge bg-white/[0.06] text-gray-400 flex items-center gap-1">
            <Calendar size={11} />Due {formatDate(project.expectedEndDate)}
          </span>
        )}
        {project.budgetAmount && (
          <span className="badge bg-emerald-950 text-emerald-400">Budget: ${Number(project.budgetAmount).toLocaleString()}</span>
        )}
      </div>

      {typeof project.progress === "number" && (
        <div className="card p-5 mb-6">
          <div className="flex justify-between text-sm mb-3">
            <span className="font-medium text-gray-300">Overall Progress</span>
            <span className="font-display font-600 text-violet-400">{project.progress}%</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
          </div>
          {stats && (
            <div className="flex gap-5 mt-3 text-xs text-gray-600">
              <span>{stats.totalTasks ?? 0} total</span>
              <span className="text-emerald-500">{stats.completedTasks ?? 0} completed</span>
              <span className="text-blue-500">{stats.inProgressTasks ?? 0} in progress</span>
            </div>
          )}
        </div>
      )}

      {/* Workers on project */}
      {project.workers && project.workers.length > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-gray-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Assigned Workers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.workers.map((w: Worker) => (
              <button
                key={w.id}
                onClick={() => setWorkerPopup(w)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/30 hover:bg-violet-950/20 transition-all text-xs text-gray-400"
              >
                <div className="w-5 h-5 rounded-lg bg-violet-600/20 flex items-center justify-center text-[9px] font-bold text-violet-400">
                  {w.firstName[0]}{w.lastName[0]}
                </div>
                {w.firstName} {w.lastName}
                <Info size={10} className="text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.06]">
          <span className="font-display font-600 text-white">Tasks</span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-0.5 bg-white/[0.04] p-0.5 rounded-xl">
              {["", ...STATUSES].map((st) => (
                <button key={st} onClick={() => setStatusFilter(st)}
                  className={clsx("px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                    statusFilter === st ? "bg-violet-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300")}>
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
          <div className="divide-y divide-white/[0.04]">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 text-sm">{t.title}</p>
                  {t.description && <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{t.description}</p>}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className={clsx("badge", getStatusColor(t.status))}>{capitalize(t.status)}</span>
                    <span className={clsx("badge", getStatusColor(t.priority))}>{capitalize(t.priority)}</span>
                    {t.dueDate && <span className="text-xs text-gray-600 flex items-center gap-1"><Calendar size={10} />{formatDate(t.dueDate)}</span>}
                    {t.assignedWorkers && t.assignedWorkers.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-violet-400">
                        <Users size={10} />{t.assignedWorkers.length} worker{t.assignedWorkers.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-28 hidden sm:block">
                    <div className="flex justify-between text-xs text-gray-600 mb-1"><span>Progress</span><span>{t.progress}%</span></div>
                    <input type="range" min={0} max={100} value={t.progress}
                      onChange={(e) => progressMut.mutate({ id: t.id, progress: Number(e.target.value) })}
                      className="w-full accent-violet-500 cursor-pointer h-1.5" />
                  </div>
                  <button className="btn btn-ghost p-1.5" onClick={() => openEdit(t)}><Pencil size={13} /></button>
                  <button className="btn btn-ghost p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-950/30" onClick={() => setDelTask(t)}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <Modal open={taskOpen} onClose={() => setTaskOpen(false)} title={editTask ? "Edit Task" : "New Task"} size="lg">
        {taskErr && <Alert type="error" message={taskErr} />}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Title" required error={taskFormErrors.title}>
              <input className="input" value={taskForm.title} onChange={s("title")} placeholder="Task title" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Description">
              <textarea className="input resize-none min-h-[60px]" value={taskForm.description} onChange={s("description")} placeholder="Description…" />
            </Field>
          </div>
          <Field label="Priority">
            <select className="input" value={taskForm.priority} onChange={s("priority")}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
            </select>
          </Field>
          <div />
          <Field label="Start Date">
            <input type="date" className="input" value={taskForm.startDate} onChange={s("startDate")} />
          </Field>
          <Field label="Due Date">
            <input type="date" className="input" value={taskForm.dueDate} onChange={s("dueDate")} />
          </Field>

          {/* Worker Assignment */}
          <div className="col-span-2">
            <Field label="Assign Workers">
              <div className="flex flex-wrap gap-2 mt-1">
                {allWorkers.map((w) => {
                  const selected = taskForm.assignedWorkerIds.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => toggleWorker(w.id)}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all",
                        selected
                          ? "bg-violet-600/20 text-violet-300 border-violet-500/40"
                          : "bg-white/[0.03] text-gray-500 border-white/[0.08] hover:border-white/20"
                      )}
                    >
                      <div className={clsx("w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold",
                        selected ? "bg-violet-500 text-white" : "bg-white/10 text-gray-500")}>
                        {w.firstName[0]}{w.lastName[0]}
                      </div>
                      {w.firstName} {w.lastName}
                      {selected && <X size={10} />}
                    </button>
                  );
                })}
                {allWorkers.length === 0 && (
                  <p className="text-xs text-gray-600">No workers available. Add workers first.</p>
                )}
              </div>
            </Field>
          </div>
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

      {workerPopup && <WorkerPopup worker={workerPopup} onClose={() => setWorkerPopup(null)} />}
    </div>
  );
}
