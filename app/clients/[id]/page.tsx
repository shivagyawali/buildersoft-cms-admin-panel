"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi, projectsApi, tasksApi, workerLogsApi, workersApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Project, Task, WorkerLog, Worker } from "@/types";
import { PageHeader, Spinner, StatCard, Modal, Field, Alert, ConfirmDialog, EmptyState } from "@/components/ui/UI";
import { ArrowLeft, Mail, Phone, Building2, MapPin, FileText, FolderKanban, Plus, CheckSquare, Clock, Pencil, Trash2, Calendar, User } from "lucide-react";
import { formatDate, formatCurrency, getInitials, getStatusColor, capitalize, getErrMsg } from "@/lib/utils";
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
const LOG_BLANK = { workerId: "", projectId: "", logDate: new Date().toISOString().slice(0, 10), hoursWorked: "", overtimeHours: "", logType: "regular", description: "", notes: "" };
const PRIORITIES = ["low", "medium", "high", "urgent"];
const TASK_STATUSES = ["todo", "in_progress", "review", "done", "cancelled"];
const LOG_TYPES = ["regular", "overtime", "weekend", "holiday"];

type Tab = "overview" | "projects" | "tasks" | "worker-logs";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");

  // Project state
  const [projOpen, setProjOpen] = useState(false);
  const [projForm, setProjForm] = useState({ name: "", description: "", budgetAmount: "", startDate: "", expectedEndDate: "", priority: "medium" });
  const [projErr, setProjErr] = useState("");

  // Task state
  const [taskOpen, setTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [delTask, setDelTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState(TASK_BLANK);
  const [selectedProject, setSelectedProject] = useState("");
  const [taskErr, setTaskErr] = useState("");

  // Worker log state
  const [logOpen, setLogOpen] = useState(false);
  const [editLog, setEditLog] = useState<WorkerLog | null>(null);
  const [delLog, setDelLog] = useState<WorkerLog | null>(null);
  const [logForm, setLogForm] = useState(LOG_BLANK);
  const [logErr, setLogErr] = useState("");

  // ── Queries ───────────────────────────────────────────────────
  const { data: clientData, isLoading } = useQuery({
    queryKey: ["client", params.id],
    queryFn: () => clientsApi.get(params.id),
  });
  const { data: statsData } = useQuery({
    queryKey: ["client-stats", params.id],
    queryFn: () => clientsApi.getStats(params.id),
  });
  const { data: projData } = useQuery({
    queryKey: ["client-projects", params.id],
    queryFn: () => projectsApi.list({ clientId: params.id, limit: 100 }),
    enabled: tab === "projects" || tab === "tasks" || tab === "worker-logs" || tab === "overview",
  });
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["client-tasks", params.id, selectedProject],
    queryFn: () => tasksApi.listByProject(selectedProject, { limit: 100 }),
    enabled: tab === "tasks" && !!selectedProject,
  });
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ["client-logs", params.id],
    queryFn: () => workerLogsApi.list({ clientId: params.id, limit: 100 }),
    enabled: tab === "worker-logs",
  });
  const { data: workersData } = useQuery({
    queryKey: ["workers-list"],
    queryFn: () => workersApi.list({ limit: 100 }),
  });

  // ── Mutations ─────────────────────────────────────────────────
  const projMut = useMutation({
    mutationFn: () => projectsApi.create({ ...projForm, clientId: params.id, budgetAmount: projForm.budgetAmount ? Number(projForm.budgetAmount) : undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["client-projects", params.id] }); setProjOpen(false); setProjForm({ name: "", description: "", budgetAmount: "", startDate: "", expectedEndDate: "", priority: "medium" }); },
    onError: (e) => setProjErr(getErrMsg(e)),
  });

  const taskSaveMut = useMutation({
    mutationFn: () => {
      const payload = { ...taskForm, projectId: selectedProject, assignedToId: taskForm.assignedToId || undefined };
      return editTask ? tasksApi.update(editTask.id, payload) : tasksApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["client-tasks", params.id, selectedProject] }); setTaskOpen(false); },
    onError: (e) => setTaskErr(getErrMsg(e)),
  });

  const taskDelMut = useMutation({
    mutationFn: () => tasksApi.delete(delTask!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["client-tasks", params.id, selectedProject] }); setDelTask(null); },
  });

  const progressMut = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => tasksApi.updateProgress(id, progress),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-tasks", params.id, selectedProject] }),
  });

  const logSaveMut = useMutation({
    mutationFn: () => {
      const payload = { ...logForm, clientId: params.id, hoursWorked: Number(logForm.hoursWorked), overtimeHours: Number(logForm.overtimeHours) || 0 };
      return editLog ? workerLogsApi.update(editLog.id, payload) : workerLogsApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["client-logs", params.id] }); setLogOpen(false); },
    onError: (e) => setLogErr(getErrMsg(e)),
  });

  const logDelMut = useMutation({
    mutationFn: () => workerLogsApi.delete(delLog!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["client-logs", params.id] }); setDelLog(null); },
  });

  const logApproveMut = useMutation({
    mutationFn: (id: string) => workerLogsApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-logs", params.id] }),
  });

  // ── Derived data ──────────────────────────────────────────────
  const client = clientData?.data?.data ?? clientData?.data;
  const stats = statsData?.data?.data ?? statsData?.data;
  const projects: Project[] = extractArray<Project>(projData);
  const tasks: Task[] = extractArray<Task>(tasksData);
  const logs: WorkerLog[] = extractArray<WorkerLog>(logsData);
  const workers: Worker[] = extractArray<Worker>(workersData);

  // ── Handlers ──────────────────────────────────────────────────
  const sp = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setProjForm((p) => ({ ...p, [k]: e.target.value }));
  const st = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setTaskForm((p) => ({ ...p, [k]: e.target.value }));
  const sl = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setLogForm((p) => ({ ...p, [k]: e.target.value }));

  const openCreateTask = () => { setEditTask(null); setTaskForm({ ...TASK_BLANK, assignedToId: "" }); setTaskErr(""); setTaskOpen(true); };
  const openEditTask = (t: Task) => {
    setEditTask(t);
    setTaskForm({ title: t.title, description: t.description ?? "", priority: t.priority, startDate: t.startDate?.slice(0, 10) ?? "", dueDate: t.dueDate?.slice(0, 10) ?? "", assignedToId: t.assignedToId ?? "" });
    setTaskErr(""); setTaskOpen(true);
  };

  const openCreateLog = () => { setEditLog(null); setLogForm({ ...LOG_BLANK, logDate: new Date().toISOString().slice(0, 10), projectId: projects[0]?.id ?? "" }); setLogErr(""); setLogOpen(true); };
  const openEditLog = (l: WorkerLog) => {
    setEditLog(l);
    setLogForm({ workerId: l.workerId, projectId: l.projectId, logDate: l.logDate?.slice(0, 10) ?? "", hoursWorked: String(l.hoursWorked), overtimeHours: String(l.overtimeHours ?? ""), logType: l.logType, description: l.description ?? "", notes: l.notes ?? "" });
    setLogErr(""); setLogOpen(true);
  };

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!client) return <div className="text-stone-400 text-center py-24">Client not found</div>;

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: FolderKanban },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "tasks", label: "Tasks", icon: CheckSquare },
    { key: "worker-logs", label: "Worker Logs", icon: Clock },
  ];

  return (
    <div className="animate-fade-in">
      <Link href="/clients" className="btn btn-ghost mb-6 -ml-2 text-stone-500">
        <ArrowLeft size={16} /> Back to Clients
      </Link>

      <PageHeader title={`${client.firstName} ${client.lastName}`} subtitle={client.company ?? "Individual Client"} />

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-xl w-fit">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={clsx("px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
              tab === key ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-xl font-semibold text-amber-700 mb-3">
                {getInitials(client.firstName, client.lastName)}
              </div>
              <h2 className="font-semibold text-stone-900">{client.firstName} {client.lastName}</h2>
              {client.company && <p className="text-sm text-stone-400">{client.company}</p>}
              <span className={clsx("badge mt-2", client.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-400")}>
                {client.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-stone-600"><Mail size={14} className="text-stone-400 flex-shrink-0" /><span className="truncate">{client.email}</span></div>
              {client.phone && <div className="flex items-center gap-2.5 text-stone-600"><Phone size={14} className="text-stone-400 flex-shrink-0" />{client.phone}</div>}
              {client.company && <div className="flex items-center gap-2.5 text-stone-600"><Building2 size={14} className="text-stone-400 flex-shrink-0" />{client.company}</div>}
              {(client.city || client.address) && (
                <div className="flex items-start gap-2.5 text-stone-600">
                  <MapPin size={14} className="text-stone-400 flex-shrink-0 mt-0.5" />
                  <span>{[client.address, client.city, client.province, client.postalCode].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>
            {client.notes && <div className="mt-5 pt-5 border-t border-stone-100"><p className="text-xs text-stone-400 uppercase tracking-wide mb-1.5">Notes</p><p className="text-sm text-stone-600">{client.notes}</p></div>}
            <p className="text-xs text-stone-400 mt-5 pt-5 border-t border-stone-100">Client since {formatDate(client.createdAt)}</p>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Projects" value={stats.totalProjects ?? 0} icon={<FolderKanban size={16} />} />
                <StatCard label="Invoices" value={stats.totalInvoices ?? 0} icon={<FileText size={16} />} />
                <StatCard label="Total Billed" value={formatCurrency(stats.totalBilled ?? 0)} icon={<FileText size={16} />} />
              </div>
            )}
            {projects.length > 0 && (
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-100 font-semibold text-stone-800">Recent Projects</div>
                <div className="divide-y divide-stone-50">
                  {projects.slice(0, 5).map((p) => (
                    <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors">
                      <span className="text-sm font-medium text-stone-700">{p.name}</span>
                      <div className="flex items-center gap-3">
                        {p.expectedEndDate && <span className="text-xs text-stone-400">{formatDate(p.expectedEndDate)}</span>}
                        <span className={clsx("badge", getStatusColor(p.status))}>{capitalize(p.status)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROJECTS TAB ─────────────────────────────────────── */}
      {tab === "projects" && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="btn btn-primary" onClick={() => setProjOpen(true)}><Plus size={16} />New Project</button>
          </div>
          {projects.length === 0 ? (
            <EmptyState icon={<FolderKanban size={20} />} title="No projects for this client"
              action={<button className="btn btn-primary" onClick={() => setProjOpen(true)}><Plus size={16} />New Project</button>} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="card p-5 hover:shadow-md transition-all">
                  <Link href={`/projects/${p.id}`} className="font-semibold text-stone-800 hover:text-amber-700 text-sm block mb-2">{p.name}</Link>
                  {p.description && <p className="text-xs text-stone-500 line-clamp-2 mb-3">{p.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={clsx("badge", getStatusColor(p.status))}>{capitalize(p.status)}</span>
                    <span className={clsx("badge", getStatusColor(p.priority))}>{capitalize(p.priority)}</span>
                  </div>
                  {p.expectedEndDate && <p className="text-xs text-stone-400 flex items-center gap-1"><Calendar size={11} />{formatDate(p.expectedEndDate)}</p>}
                </div>
              ))}
            </div>
          )}

          <Modal open={projOpen} onClose={() => setProjOpen(false)} title="New Project">
            {projErr && <Alert type="error" message={projErr} />}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="Project Name"><input className="input" value={projForm.name} onChange={sp("name")} required /></Field></div>
              <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={projForm.description} onChange={sp("description")} /></Field></div>
              <Field label="Budget (CAD)"><input type="number" className="input" value={projForm.budgetAmount} onChange={sp("budgetAmount")} /></Field>
              <Field label="Priority">
                <select className="input" value={projForm.priority} onChange={sp("priority")}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
                </select>
              </Field>
              <Field label="Start Date"><input type="date" className="input" value={projForm.startDate} onChange={sp("startDate")} /></Field>
              <Field label="End Date"><input type="date" className="input" value={projForm.expectedEndDate} onChange={sp("expectedEndDate")} /></Field>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button className="btn btn-secondary" onClick={() => setProjOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => projMut.mutate()} disabled={projMut.isPending}>
                {projMut.isPending && <Spinner size="sm" />}Create Project
              </button>
            </div>
          </Modal>
        </div>
      )}

      {/* ── TASKS TAB ────────────────────────────────────────── */}
      {tab === "tasks" && (
        <div>
          {/* Project selector */}
          <div className="card p-4 mb-5">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Select Project</p>
            <div className="flex flex-wrap gap-2">
              {projects.length === 0 && <span className="text-sm text-stone-400">No projects found. Create a project first.</span>}
              {projects.map((p) => (
                <button key={p.id} onClick={() => setSelectedProject(p.id)}
                  className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedProject === p.id ? "bg-amber-600 text-white border-amber-600" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300")}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {!selectedProject ? (
            <EmptyState icon={<CheckSquare size={20} />} title="Select a project above" description="Then manage its tasks here" />
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button className="btn btn-primary" onClick={openCreateTask}><Plus size={16} />Add Task</button>
              </div>
              <div className="card overflow-hidden">
                {tasksLoading ? (
                  <div className="flex justify-center py-10"><Spinner /></div>
                ) : tasks.length === 0 ? (
                  <EmptyState icon={<CheckSquare size={18} />} title="No tasks yet"
                    action={<button className="btn btn-primary" onClick={openCreateTask}><Plus size={14} />Add Task</button>} />
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
                          <div className="w-24 hidden sm:block">
                            <div className="flex justify-between text-xs text-stone-400 mb-1"><span>{t.progress}%</span></div>
                            <input type="range" min={0} max={100} value={t.progress}
                              onChange={(e) => progressMut.mutate({ id: t.id, progress: Number(e.target.value) })}
                              className="w-full accent-amber-500 cursor-pointer h-1.5" />
                          </div>
                          <button className="btn btn-ghost p-1.5" onClick={() => openEditTask(t)}><Pencil size={13} /></button>
                          <button className="btn btn-ghost p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50" onClick={() => setDelTask(t)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <Modal open={taskOpen} onClose={() => setTaskOpen(false)} title={editTask ? "Edit Task" : "New Task"}>
            {taskErr && <Alert type="error" message={taskErr} />}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="Title"><input className="input" value={taskForm.title} onChange={st("title")} required /></Field></div>
              <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={taskForm.description} onChange={st("description")} /></Field></div>
              <Field label="Priority">
                <select className="input" value={taskForm.priority} onChange={st("priority")}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
                </select>
              </Field>
              <Field label="Assign To Worker">
                <select className="input" value={taskForm.assignedToId} onChange={st("assignedToId")}>
                  <option value="">Unassigned</option>
                  {workers.map((w) => <option key={w.id} value={w.id}>{w.firstName} {w.lastName} ({capitalize(w.trade)})</option>)}
                </select>
              </Field>
              <Field label="Start Date"><input type="date" className="input" value={taskForm.startDate} onChange={st("startDate")} /></Field>
              <Field label="Due Date"><input type="date" className="input" value={taskForm.dueDate} onChange={st("dueDate")} /></Field>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button className="btn btn-secondary" onClick={() => setTaskOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => taskSaveMut.mutate()} disabled={taskSaveMut.isPending}>
                {taskSaveMut.isPending && <Spinner size="sm" />}{editTask ? "Save" : "Create Task"}
              </button>
            </div>
          </Modal>

          <ConfirmDialog open={!!delTask} onClose={() => setDelTask(null)} onConfirm={() => taskDelMut.mutate()} loading={taskDelMut.isPending}
            title="Delete Task" description={`Delete "${delTask?.title}"?`} />
        </div>
      )}

      {/* ── WORKER LOGS TAB ──────────────────────────────────── */}
      {tab === "worker-logs" && (
        <div>
          <div className="flex justify-end mb-4">
            <button className="btn btn-primary" onClick={openCreateLog}><Plus size={16} />Log Hours</button>
          </div>

          {logsLoading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : logs.length === 0 ? (
            <EmptyState icon={<Clock size={20} />} title="No worker logs yet"
              action={<button className="btn btn-primary" onClick={openCreateLog}><Plus size={16} />Log Hours</button>} />
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50">
                      {["Worker", "Project", "Date", "Hours", "Type", "Cost", "Status", ""].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-stone-400 uppercase tracking-wide px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l) => (
                      <tr key={l.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-stone-800">
                          {l.worker ? `${l.worker.firstName} ${l.worker.lastName}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-500">{l.project?.name ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-stone-500">{formatDate(l.logDate)}</td>
                        <td className="px-4 py-3 text-xs text-stone-800">
                          {l.hoursWorked}h
                          {Number(l.overtimeHours) > 0 && <span className="text-amber-600 ml-1">+{l.overtimeHours}OT</span>}
                        </td>
                        <td className="px-4 py-3"><span className={clsx("badge", getStatusColor(l.logType))}>{capitalize(l.logType)}</span></td>
                        <td className="px-4 py-3 text-xs font-medium text-stone-800">{l.totalCost ? formatCurrency(l.totalCost) : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={clsx("badge", {
                            pending: "bg-amber-50 text-amber-700",
                            approved: "bg-emerald-50 text-emerald-700",
                            rejected: "bg-red-50 text-red-700",
                            invoiced: "bg-blue-50 text-blue-700",
                          }[l.status] ?? "bg-stone-100 text-stone-600")}>
                            {capitalize(l.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            {l.status === "pending" && (
                              <button className="btn btn-ghost p-1.5 text-emerald-600 hover:bg-emerald-50 text-xs" onClick={() => logApproveMut.mutate(l.id)}>Approve</button>
                            )}
                            {l.status === "pending" && <button className="btn btn-ghost p-1.5" onClick={() => openEditLog(l)}><Pencil size={13} /></button>}
                            {l.status !== "invoiced" && (
                              <button className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDelLog(l)}><Trash2 size={13} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Modal open={logOpen} onClose={() => setLogOpen(false)} title={editLog ? "Edit Log" : "Log Worker Hours"}>
            {logErr && <Alert type="error" message={logErr} />}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Worker">
                <select className="input" value={logForm.workerId} onChange={sl("workerId")} required>
                  <option value="">Select worker…</option>
                  {workers.map((w) => <option key={w.id} value={w.id}>{w.firstName} {w.lastName} ({capitalize(w.trade)})</option>)}
                </select>
              </Field>
              <Field label="Project">
                <select className="input" value={logForm.projectId} onChange={sl("projectId")} required>
                  <option value="">Select project…</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
              <Field label="Date"><input type="date" className="input" value={logForm.logDate} onChange={sl("logDate")} required /></Field>
              <Field label="Log Type">
                <select className="input" value={logForm.logType} onChange={sl("logType")}>
                  {LOG_TYPES.map((t) => <option key={t} value={t}>{capitalize(t)}</option>)}
                </select>
              </Field>
              <Field label="Hours Worked"><input type="number" step="0.5" className="input" value={logForm.hoursWorked} onChange={sl("hoursWorked")} required /></Field>
              <Field label="Overtime Hours"><input type="number" step="0.5" className="input" value={logForm.overtimeHours} onChange={sl("overtimeHours")} placeholder="0" /></Field>
              <div className="col-span-2"><Field label="Description"><textarea className="input resize-none min-h-[60px]" value={logForm.description} onChange={sl("description")} /></Field></div>
              <div className="col-span-2"><Field label="Notes"><textarea className="input resize-none min-h-[50px]" value={logForm.notes} onChange={sl("notes")} /></Field></div>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button className="btn btn-secondary" onClick={() => setLogOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => logSaveMut.mutate()} disabled={logSaveMut.isPending}>
                {logSaveMut.isPending && <Spinner size="sm" />}{editLog ? "Save" : "Log Hours"}
              </button>
            </div>
          </Modal>

          <ConfirmDialog open={!!delLog} onClose={() => setDelLog(null)} onConfirm={() => logDelMut.mutate()} loading={logDelMut.isPending}
            title="Delete Log" description="Delete this worker log entry? This cannot be undone." />
        </div>
      )}
    </div>
  );
}
