"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, clientsApi } from "@/lib/api";
import { Project, Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, FolderKanban, Pencil, Trash2, ExternalLink, Calendar, TrendingUp } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const STATUSES = ["planning", "active", "on_hold", "completed", "cancelled"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

const BLANK = {
  name: "", description: "", clientId: "", budgetAmount: "",
  startDate: "", expectedEndDate: "", priority: "medium", status: "active",
};

interface FormErrors { name?: string; clientId?: string; startDate?: string; }

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [delTarget, setDelTarget] = useState<Project | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data, isLoading } = useQuery({
    queryKey: ["projects", statusFilter],
    queryFn: () => projectsApi.list({ status: statusFilter || undefined, limit: 50 }),
  });
  const { data: clientData } = useQuery({
    queryKey: ["clients-select"],
    queryFn: () => clientsApi.list({ limit: 100 }),
  });

  const projects: Project[] = extractArray<Project>(data);
  const clients: Client[] = extractArray<Client>(clientData);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Project name is required";
    if (!form.clientId) errs.clientId = "Please select a client";
    if (form.startDate && form.expectedEndDate && form.startDate > form.expectedEndDate)
      errs.startDate = "Start date must be before end date";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setFormErrors({}); setOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description ?? "", clientId: p.clientId,
      budgetAmount: String(p.budgetAmount ?? ""),
      startDate: p.startDate?.slice(0, 10) ?? "",
      expectedEndDate: p.expectedEndDate?.slice(0, 10) ?? "",
      priority: p.priority, status: p.status,
    });
    setErr(""); setFormErrors({}); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      if (!validate()) return Promise.reject(new Error("Validation failed"));
      const payload = {
        name: form.name, description: form.description, clientId: form.clientId,
        budgetAmount: form.budgetAmount ? Number(form.budgetAmount) : undefined,
        startDate: form.startDate || undefined,
        expectedEndDate: form.expectedEndDate || undefined,
        priority: form.priority, status: form.status,
      };
      return editing ? projectsApi.update(editing.id, payload) : projectsApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); setOpen(false); },
    onError: (e: unknown) => { if ((e as Error).message !== "Validation failed") setErr(getErrMsg(e)); },
  });

  const delMut = useMutation({
    mutationFn: () => projectsApi.delete(delTarget!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); setDelTarget(null); },
  });

  const statusCounts = STATUSES.reduce((acc, st) => {
    acc[st] = projects.filter((p) => p.status === st).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""}`}
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={15} />New Project
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {[{ key: "", label: "All", count: projects.length }, ...STATUSES.map((st) => ({ key: st, label: capitalize(st), count: statusCounts[st] }))].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5"
            style={statusFilter === key
              ? { background: "rgba(249,115,22,0.12)", color: "var(--brand-600)", borderColor: "rgba(249,115,22,0.3)" }
              : { background: "var(--bg-sunken)", color: "var(--text-tertiary)", borderColor: "var(--border-subtle)" }
            }
          >
            {label}
            <span
              className="text-[10px] rounded-full px-1.5 py-0.5"
              style={statusFilter === key
                ? { background: "rgba(249,115,22,0.2)", color: "var(--brand-600)" }
                : { background: "var(--border-subtle)", color: "var(--text-tertiary)" }
              }
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={20} />}
          title="No projects"
          description="Create your first project to get started"
          action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15} />New Project</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p: Project) => (
            <div key={p.id} className="card card-hover p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-display font-bold text-sm transition-colors line-clamp-1"
                    style={{ color: "var(--text-primary)" }}
                    onMouseOver={e => (e.currentTarget as HTMLElement).style.color = "var(--brand-500)"}
                    onMouseOut={e => (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"}
                  >
                    {p.name}
                  </Link>
                  {p.client && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{p.client.firstName} {p.client.lastName}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button className="btn btn-ghost p-1.5" onClick={() => openEdit(p)}><Pencil size={12} /></button>
                  <button
                    className="btn btn-ghost p-1.5"
                    style={{ color: "rgba(239,68,68,0.4)" }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    onClick={() => setDelTarget(p)}
                  ><Trash2 size={12} /></button>
                </div>
              </div>

              {p.description && <p className="text-xs line-clamp-2" style={{ color: "var(--text-tertiary)" }}>{p.description}</p>}

              <div className="flex flex-wrap items-center gap-1.5">
                <span className={clsx("badge", getStatusColor(p.status))}>{capitalize(p.status)}</span>
                <span className={clsx("badge", getStatusColor(p.priority))}>{capitalize(p.priority)}</span>
              </div>

              {typeof p.progress === "number" && (
                <div>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-sunken)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${p.progress}%`, background: "linear-gradient(90deg, var(--brand-500), var(--brand-400))" }}
                    />
                  </div>
                </div>
              )}

              <div
                className="flex items-center justify-between text-xs pt-2"
                style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-tertiary)" }}
              >
                {p.expectedEndDate ? (
                  <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(p.expectedEndDate)}</span>
                ) : <span />}
                {p.budgetAmount && (
                  <span className="flex items-center gap-1" style={{ color: "#10b981" }}>
                    <TrendingUp size={11} />${Number(p.budgetAmount).toLocaleString()}
                  </span>
                )}
                <Link
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-1 transition-colors"
                  style={{ color: "var(--brand-500)" }}
                >
                  Open <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Project" : "New Project"} size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Project Name" required error={formErrors.name}>
              <input className="input" value={form.name} onChange={s("name")} placeholder="Enter project name" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Description">
              <textarea className="input resize-none min-h-[70px]" value={form.description} onChange={s("description")} placeholder="Brief description…" />
            </Field>
          </div>
          <Field label="Client" required error={formErrors.clientId}>
            <select className="input" value={form.clientId} onChange={s("clientId")}>
              <option value="">Select client…</option>
              {clients.map((c: Client) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}{c.company ? ` — ${c.company}` : ""}</option>
              ))}
            </select>
          </Field>
          <Field label="Budget (CAD)">
            <input type="number" className="input" value={form.budgetAmount} onChange={s("budgetAmount")} placeholder="0.00" min="0" />
          </Field>
          <Field label="Start Date" error={formErrors.startDate}>
            <input type="date" className="input" value={form.startDate} onChange={s("startDate")} />
          </Field>
          <Field label="End Date">
            <input type="date" className="input" value={form.expectedEndDate} onChange={s("expectedEndDate")} />
          </Field>
          <Field label="Priority">
            <select className="input" value={form.priority} onChange={s("priority")}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className="input" value={form.status} onChange={s("status")}>
              {STATUSES.map((st) => <option key={st} value={st}>{capitalize(st)}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}
            {editing ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()}
        loading={delMut.isPending} title="Delete Project"
        description={`Delete "${delTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
