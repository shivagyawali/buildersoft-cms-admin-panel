"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, clientsApi } from "@/lib/api";
import { Project, Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, FolderKanban, Pencil, Trash2, ExternalLink, Calendar } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];

  // 1. Already a plain array → return immediately
  if (Array.isArray(data)) {
    return data as T[];
  }

  // 2. Not an object → nothing to extract
  if (typeof data !== "object" || data === null) {
    return [];
  }

  const d = data as Record<string, unknown>;

  // 3. Recursively unwrap any number of { data: ... } wrappers (common in APIs)
  if ("data" in d && d.data !== undefined) {
    return extractArray(d.data);
  }

  // 4. Look for any key that contains an array (handles { ..., projects: [...] } or similar)
  for (const key in d) {
    if (Array.isArray(d[key])) {
      return d[key] as T[];
    }
  }

  // 5. If still nothing, recurse deeper into nested objects
  for (const key in d) {
    if (typeof d[key] === "object" && d[key] !== null) {
      const arr:any = extractArray(d[key]);
      if (arr.length > 0) return arr;
    }
  }

  return [];
}

const STATUSES = ["planning", "active", "on_hold", "completed", "cancelled"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

const BLANK = {
  name: "", description: "", clientId: "", budgetAmount: "",
  startDate: "", expectedEndDate: "", priority: "medium", status: "planning",
};

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [delTarget, setDelTarget] = useState<Project | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");

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

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      clientId: p.clientId,
      budgetAmount: String(p.budgetAmount ?? ""),
      startDate: p.startDate?.slice(0, 10) ?? "",
      expectedEndDate: p.expectedEndDate?.slice(0, 10) ?? "",
      priority: p.priority,
      status: p.status,
    });
    setErr(""); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = { ...form, budgetAmount: form.budgetAmount ? Number(form.budgetAmount) : undefined };
      return editing ? projectsApi.update(editing.id, payload) : projectsApi.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
    },
    onError: (e) => setErr(getErrMsg(e)),
  });

  const delMut = useMutation({
    mutationFn: () => projectsApi.delete(delTarget!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setDelTarget(null);
    },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""}`}
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} />New Project
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-xl w-fit">
        {["", ...STATUSES].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              statusFilter === st
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {st ? capitalize(st) : "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={20} />}
          title="No projects"
          description="Create your first project"
          action={
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} />New Project
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p: Project) => (
            <div key={p.id} className="card p-5 hover:shadow-md hover:border-stone-300 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-semibold text-stone-800 hover:text-amber-700 transition-colors line-clamp-1 text-sm"
                  >
                    {p.name}
                  </Link>
                  {p.client && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {p.client.firstName} {p.client.lastName}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button className="btn btn-ghost p-1 text-stone-400" onClick={() => openEdit(p)}>
                    <Pencil size={13} />
                  </button>
                  <button
                    className="btn btn-ghost p-1 text-red-300 hover:text-red-500 hover:bg-red-50"
                    onClick={() => setDelTarget(p)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {p.description && (
                <p className="text-xs text-stone-500 line-clamp-2 mb-3">{p.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className={clsx("badge", getStatusColor(p.status))}>{capitalize(p.status)}</span>
                <span className={clsx("badge", getStatusColor(p.priority))}>{capitalize(p.priority)}</span>
              </div>

              {typeof p.progress === "number" && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-stone-400 mb-1">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-stone-400">
                {p.expectedEndDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(p.expectedEndDate)}
                  </span>
                )}
                <Link
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-1 text-amber-600 hover:underline ml-auto"
                >
                  Open <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Project" : "New Project"} size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Project Name">
              <input className="input" value={form.name} onChange={s("name")} required />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Description">
              <textarea className="input resize-none min-h-[70px]" value={form.description} onChange={s("description")} />
            </Field>
          </div>

          <Field label="Client">
            <select className="input" value={form.clientId} onChange={s("clientId")} required>
              <option value="">Select client…</option>
              {clients.map((c: Client) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Budget (CAD)">
            <input type="number" className="input" value={form.budgetAmount} onChange={s("budgetAmount")} />
          </Field>

          <Field label="Start Date">
            <input type="date" className="input" value={form.startDate} onChange={s("startDate")} />
          </Field>

          <Field label="End Date">
            <input type="date" className="input" value={form.expectedEndDate} onChange={s("expectedEndDate")} />
          </Field>

          <Field label="Priority">
            <select className="input" value={form.priority} onChange={s("priority")}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {capitalize(p)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select className="input" value={form.status} onChange={s("status")}>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {capitalize(st)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending}
          >
            {saveMut.isPending && <Spinner size="sm" />}
            {editing ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={() => delMut.mutate()}
        loading={delMut.isPending}
        title="Delete Project"
        description={`Delete "${delTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}