"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicePeriodsApi, workersApi } from "@/lib/api";
import { InvoicePeriod, Worker } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Clock, Pencil, Trash2, DollarSign } from "lucide-react";
import { formatDate, formatCurrency, getErrMsg, extractArray, capitalize } from "@/lib/utils";
import clsx from "clsx";

const BLANK = { workerId: "", startDate: "", endDate: "", regularHours: "", overtimeHours: "", hourlyRate: "", overtimeRate: "", notes: "" };
interface FormErrors { workerId?: string; startDate?: string; endDate?: string; regularHours?: string; }

export default function InvoicePeriodsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InvoicePeriod | null>(null);
  const [delTarget, setDelTarget] = useState<InvoicePeriod | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [workerFilter, setWorkerFilter] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["invoice-periods", workerFilter], queryFn: () => invoicePeriodsApi.list({ workerId: workerFilter || undefined, limit: 100 }) });
  const { data: workersData } = useQuery({ queryKey: ["workers-select"], queryFn: () => workersApi.list({ limit: 100 }) });

  const periods: InvoicePeriod[] = extractArray<InvoicePeriod>(data);
  const workers: Worker[] = extractArray<Worker>(workersData);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm((p) => {
      const updated = { ...p, [k]: val };
      // Auto-fill rates from selected worker
      if (k === "workerId") {
        const worker = workers.find((w) => w.id === val);
        if (worker) {
          updated.hourlyRate = String(worker.hourlyRate ?? "");
          updated.overtimeRate = String(worker.overtimeRate ?? "");
        }
      }
      return updated;
    });
    setFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.workerId) errs.workerId = "Please select a worker";
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";
    if (form.startDate && form.endDate && form.startDate > form.endDate) errs.endDate = "End date must be after start date";
    if (!form.regularHours || Number(form.regularHours) < 0) errs.regularHours = "Regular hours required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const calcTotal = () => {
    const reg = Number(form.regularHours) || 0;
    const ot = Number(form.overtimeHours) || 0;
    const rate = Number(form.hourlyRate) || 0;
    const otRate = Number(form.overtimeRate) || rate * 1.5;
    return reg * rate + ot * otRate;
  };

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setFormErrors({}); setOpen(true); };
  const openEdit = (p: InvoicePeriod) => {
    setEditing(p);
    setForm({ workerId: p.workerId, startDate: p.startDate.slice(0, 10), endDate: p.endDate.slice(0, 10), regularHours: String(p.regularHours), overtimeHours: String(p.overtimeHours), hourlyRate: String(p.hourlyRate), overtimeRate: String(p.overtimeRate), notes: p.notes ?? "" });
    setErr(""); setFormErrors({}); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      if (!validate()) return Promise.reject(new Error("Validation failed"));
      const payload = { workerId: form.workerId, startDate: form.startDate, endDate: form.endDate, regularHours: Number(form.regularHours), overtimeHours: Number(form.overtimeHours) || 0, hourlyRate: Number(form.hourlyRate) || 0, overtimeRate: Number(form.overtimeRate) || 0, totalPay: calcTotal(), notes: form.notes || undefined };
      return editing ? invoicePeriodsApi.update(editing.id, payload) : invoicePeriodsApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoice-periods"] }); setOpen(false); },
    onError: (e: unknown) => { if ((e as Error).message !== "Validation failed") setErr(getErrMsg(e)); },
  });

  const delMut = useMutation({
    mutationFn: () => invoicePeriodsApi.delete(delTarget!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoice-periods"] }); setDelTarget(null); },
  });

  const totalPayout = periods.reduce((s, p) => s + Number(p.totalPay), 0);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Pay Periods" subtitle="Worker invoice & overtime tracking"
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15} />New Period</button>} />

      {/* Summary */}
      {periods.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Total Periods</p>
            <p className="text-2xl font-display font-700 text-white">{periods.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Total Overtime Hours</p>
            <p className="text-2xl font-display font-700 text-amber-400">{periods.reduce((s, p) => s + Number(p.overtimeHours), 0)}h</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Total Payout</p>
            <p className="text-2xl font-display font-700 text-emerald-400">{formatCurrency(totalPayout)}</p>
          </div>
        </div>
      )}

      {/* Worker filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <button onClick={() => setWorkerFilter("")} className={clsx("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all", !workerFilter ? "bg-orange-500/10 text-orange-300 border-orange-500/25" : "bg-orange-50/5 dark:bg-black/[0.03] dark:bg-white/[0.03] text-gray-500 border-black/6 dark:border-white/[0.06] hover:border-white/[0.14]")}>All Workers</button>
        {workers.map((w) => (
          <button key={w.id} onClick={() => setWorkerFilter(w.id)} className={clsx("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all", workerFilter === w.id ? "bg-orange-500/10 text-orange-300 border-orange-500/25" : "bg-orange-50/5 dark:bg-black/[0.03] dark:bg-white/[0.03] text-gray-500 border-black/6 dark:border-white/[0.06] hover:border-white/[0.14]")}>
            {w.firstName} {w.lastName}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : periods.length === 0 ? (
          <EmptyState icon={<Clock size={20} />} title="No pay periods yet" description="Track worker hours and overtime by adding pay periods"
            action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15} />New Period</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/6 dark:border-white/[0.06] bg-orange-50/3 dark:bg-black/[0.02] dark:bg-white/[0.02]">
                  {["Worker", "Period", "Regular Hours", "Overtime Hours", "Rate", "OT Rate", "Total Pay", ""].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => {
                  const worker = workers.find((w) => w.id === p.workerId) ?? p.worker;
                  return (
                    <tr key={p.id} className="border-b border-black/5 dark:border-white/[0.04] hover:bg-orange-50/3 dark:bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
                      <td className="table-cell">
                        {worker ? (
                          <div>
                            <p className="text-sm font-medium text-gray-200">{worker.firstName} {worker.lastName}</p>
                            <p className="text-xs text-gray-600">{capitalize(worker.role)}</p>
                          </div>
                        ) : <span className="text-gray-600 text-sm">Unknown</span>}
                      </td>
                      <td className="table-cell">
                        <p className="text-sm text-gray-300">{formatDate(p.startDate)}</p>
                        <p className="text-xs text-gray-600">→ {formatDate(p.endDate)}</p>
                      </td>
                      <td className="table-cell text-sm text-gray-300">{p.regularHours}h</td>
                      <td className="table-cell">
                        <span className={clsx("text-sm font-semibold", Number(p.overtimeHours) > 0 ? "text-amber-400" : "text-gray-600")}>
                          {p.overtimeHours}h
                        </span>
                      </td>
                      <td className="table-cell text-sm text-gray-400">${Number(p.hourlyRate).toFixed(2)}/hr</td>
                      <td className="table-cell text-sm text-amber-400/80">${Number(p.overtimeRate).toFixed(2)}/hr</td>
                      <td className="table-cell">
                        <span className="font-display font-600 text-emerald-400 text-sm">{formatCurrency(p.totalPay)}</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1 justify-end">
                          <button className="btn btn-ghost p-1.5" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                          <button className="btn btn-ghost p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDelTarget(p)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Pay Period" : "New Pay Period"} size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Worker" required error={formErrors.workerId}>
              <select className="input" value={form.workerId} onChange={s("workerId")}>
                <option value="">Select worker…</option>
                {workers.map((w) => <option key={w.id} value={w.id}>{w.firstName} {w.lastName} — {capitalize(w.role)}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Start Date" required error={formErrors.startDate}>
            <input type="date" className="input" value={form.startDate} onChange={s("startDate")} />
          </Field>
          <Field label="End Date" required error={(formErrors as any).endDate}>
            <input type="date" className="input" value={form.endDate} onChange={s("endDate")} />
          </Field>
          <Field label="Regular Hours" required error={formErrors.regularHours}>
            <input type="number" className="input" value={form.regularHours} onChange={s("regularHours")} placeholder="e.g. 80" min="0" step="0.5" />
          </Field>
          <Field label="Overtime Hours">
            <input type="number" className="input" value={form.overtimeHours} onChange={s("overtimeHours")} placeholder="e.g. 10" min="0" step="0.5" />
          </Field>
          <Field label="Hourly Rate (CAD)">
            <input type="number" className="input" value={form.hourlyRate} onChange={s("hourlyRate")} placeholder="0.00" min="0" step="0.01" />
          </Field>
          <Field label="Overtime Rate (CAD)">
            <input type="number" className="input" value={form.overtimeRate} onChange={s("overtimeRate")} placeholder="0.00 (auto 1.5x)" min="0" step="0.01" />
          </Field>
          <div className="col-span-2">
            <Field label="Notes">
              <textarea className="input resize-none min-h-[60px]" value={form.notes} onChange={s("notes")} placeholder="Optional notes…" />
            </Field>
          </div>
          {(form.regularHours || form.overtimeHours) && (
            <div className="col-span-2 bg-orange-50/5 dark:bg-black/[0.03] dark:bg-white/[0.03] rounded-xl p-4 border border-black/6 dark:border-white/[0.06]">
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Pay Summary</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Regular</p>
                  <p className="text-emerald-400 font-semibold">{formatCurrency((Number(form.regularHours) || 0) * (Number(form.hourlyRate) || 0))}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Overtime</p>
                  <p className="text-amber-400 font-semibold">{formatCurrency((Number(form.overtimeHours) || 0) * (Number(form.overtimeRate) || (Number(form.hourlyRate) || 0) * 1.5))}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Total</p>
                  <p className="text-white font-display font-600 text-base">{formatCurrency(calcTotal())}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}{editing ? "Save Changes" : "Create Period"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()}
        loading={delMut.isPending} title="Delete Pay Period" description="Delete this pay period? This cannot be undone." />
    </div>
  );
}
