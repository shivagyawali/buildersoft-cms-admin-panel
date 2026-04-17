"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workersApi } from "@/lib/api";
import { Worker } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert, WorkerPopup } from "@/components/ui/UI";
import { Plus, HardHat, Pencil, Trash2, Mail, Phone, DollarSign, Clock, Info } from "lucide-react";
import { formatDate, getStatusColor, capitalize, getErrMsg, extractArray } from "@/lib/utils";
import clsx from "clsx";

const ROLES = ["worker", "foreman", "supervisor", "engineer", "manager", "subcontractor"];
const BLANK = { firstName: "", lastName: "", email: "", phone: "", role: "worker", hourlyRate: "", overtimeRate: "", status: "active" };
interface FormErrors { firstName?: string; lastName?: string; email?: string; role?: string; }

export default function WorkersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [delTarget, setDelTarget] = useState<Worker | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [popup, setPopup] = useState<Worker | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["workers"], queryFn: () => workersApi.list({ limit: 100 }) });
  const workers: Worker[] = extractArray<Worker>(data);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.role) errs.role = "Role is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setFormErrors({}); setOpen(true); };
  const openEdit = (w: Worker) => {
    setEditing(w);
    setForm({ firstName: w.firstName, lastName: w.lastName, email: w.email, phone: w.phone ?? "", role: w.role, hourlyRate: String(w.hourlyRate ?? ""), overtimeRate: String(w.overtimeRate ?? ""), status: w.status });
    setErr(""); setFormErrors({}); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      if (!validate()) return Promise.reject(new Error("Validation failed"));
      const payload = { ...form, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined, overtimeRate: form.overtimeRate ? Number(form.overtimeRate) : undefined };
      return editing ? workersApi.update(editing.id, payload) : workersApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["workers"] }); setOpen(false); },
    onError: (e: unknown) => { if ((e as Error).message !== "Validation failed") setErr(getErrMsg(e)); },
  });

  const delMut = useMutation({
    mutationFn: () => workersApi.delete(delTarget!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["workers"] }); setDelTarget(null); },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Workers" subtitle={`${workers.length} worker${workers.length !== 1 ? "s" : ""}`}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15} />Add Worker</button>} />

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : workers.length === 0 ? (
          <EmptyState icon={<HardHat size={20} />} title="No workers yet" description="Add your first worker to get started"
            action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15} />Add Worker</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/6 dark:border-white/[0.06] bg-orange-50/3 dark:bg-black/[0.02] dark:bg-white/[0.02]">
                  {["Worker", "Contact", "Role", "Hourly", "Overtime", "Status", "Since", ""].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id} className="border-b border-black/5 dark:border-white/[0.04] hover:bg-orange-50/3 dark:bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400 flex-shrink-0">
                          {w.firstName[0]}{w.lastName[0]}
                        </div>
                        <p className="font-medium text-gray-200 text-sm">{w.firstName} {w.lastName}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} />{w.email}</p>
                      {w.phone && <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5"><Phone size={10} />{w.phone}</p>}
                    </td>
                    <td className="table-cell"><span className="badge bg-white/[0.06] text-gray-400">{capitalize(w.role)}</span></td>
                    <td className="table-cell">
                      {w.hourlyRate != null ? (
                        <span className="text-sm text-emerald-400 font-semibold flex items-center gap-1">
                          <DollarSign size={12} />{Number(w.hourlyRate).toFixed(2)}<span className="text-gray-600 font-normal">/hr</span>
                        </span>
                      ) : <span className="text-gray-600 text-sm">—</span>}
                    </td>
                    <td className="table-cell">
                      {w.overtimeRate != null ? (
                        <span className="text-sm text-amber-400 font-semibold flex items-center gap-1">
                          <Clock size={12} />{Number(w.overtimeRate).toFixed(2)}<span className="text-gray-600 font-normal">/hr</span>
                        </span>
                      ) : <span className="text-gray-600 text-sm">—</span>}
                    </td>
                    <td className="table-cell"><span className={clsx("badge", getStatusColor(w.status))}>{capitalize(w.status)}</span></td>
                    <td className="table-cell text-xs text-gray-600">{formatDate(w.createdAt)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="btn btn-ghost p-1.5 text-gray-500" onClick={() => setPopup(w)}><Info size={14} /></button>
                        <button className="btn btn-ghost p-1.5" onClick={() => openEdit(w)}><Pencil size={14} /></button>
                        <button className="btn btn-ghost p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDelTarget(w)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Worker" : "Add Worker"} size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required error={formErrors.firstName}>
            <input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John" />
          </Field>
          <Field label="Last Name" required error={formErrors.lastName}>
            <input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe" />
          </Field>
          <Field label="Email" required error={formErrors.email}>
            <input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@example.com" />
          </Field>
          <Field label="Phone">
            <input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123" />
          </Field>
          <Field label="Role" required error={formErrors.role}>
            <select className="input" value={form.role} onChange={s("role")}>
              {ROLES.map((r) => <option key={r} value={r}>{capitalize(r)}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className="input" value={form.status} onChange={s("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
          <Field label="Hourly Rate (CAD)">
            <input type="number" className="input" value={form.hourlyRate} onChange={s("hourlyRate")} placeholder="0.00" min="0" step="0.01" />
          </Field>
          <Field label="Overtime Rate (CAD)">
            <input type="number" className="input" value={form.overtimeRate} onChange={s("overtimeRate")} placeholder="0.00" min="0" step="0.01" />
          </Field>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}{editing ? "Save Changes" : "Add Worker"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()}
        loading={delMut.isPending} title="Remove Worker" description={`Remove ${delTarget?.firstName} ${delTarget?.lastName}? This cannot be undone.`} />

      {popup && <WorkerPopup worker={popup} onClose={() => setPopup(null)} />}
    </div>
  );
}
