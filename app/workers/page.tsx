"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workersApi } from "@/lib/api";
import { Worker } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Search, Pencil, Trash2, Phone, Mail, HardHat } from "lucide-react";
import { formatDate, getErrMsg, capitalize, getInitials } from "@/lib/utils";
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

const TRADES = ["general", "electrician", "plumber", "carpenter", "mason", "painter", "welder", "hvac", "roofer", "other"];
const BLANK = { firstName: "", lastName: "", email: "", phone: "", trade: "general", hourlyRate: "", overtimeRate: "", notes: "" };

export default function WorkersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [delTarget, setDelTarget] = useState<Worker | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["workers"],
    queryFn: () => workersApi.list({ limit: 100 }),
  });

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = { ...form, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined, overtimeRate: form.overtimeRate ? Number(form.overtimeRate) : undefined };
      return editing ? workersApi.update(editing.id, payload) : workersApi.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["workers"] }); setOpen(false); },
    onError: (e) => setErr(getErrMsg(e)),
  });

  const delMut = useMutation({
    mutationFn: () => workersApi.delete(delTarget!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["workers"] }); setDelTarget(null); },
  });

  const workers: Worker[] = extractArray<Worker>(data);
  const filtered = workers.filter((w) =>
    `${w.firstName} ${w.lastName} ${w.email} ${w.trade}`.toLowerCase().includes(search.toLowerCase())
  );

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setOpen(true); };
  const openEdit = (w: Worker) => {
    setEditing(w);
    setForm({ firstName: w.firstName, lastName: w.lastName, email: w.email, phone: w.phone ?? "",
      trade: w.trade, hourlyRate: String(w.hourlyRate ?? ""), overtimeRate: String(w.overtimeRate ?? ""), notes: w.notes ?? "" });
    setErr(""); setOpen(true);
  };

  const tradeColors: Record<string, string> = {
    electrician: "bg-yellow-50 text-yellow-700", plumber: "bg-blue-50 text-blue-700",
    carpenter: "bg-amber-50 text-amber-700", mason: "bg-stone-100 text-stone-600",
    painter: "bg-purple-50 text-purple-700", welder: "bg-red-50 text-red-700",
    hvac: "bg-cyan-50 text-cyan-700", roofer: "bg-orange-50 text-orange-700",
    general: "bg-stone-100 text-stone-600", other: "bg-stone-100 text-stone-500",
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Workers"
        subtitle={`${workers.length} worker${workers.length !== 1 ? "s" : ""}`}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={16} />New Worker</button>}
      />

      <div className="relative mb-6 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input className="input pl-9" placeholder="Search workers…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<HardHat size={20} />} title="No workers yet" description="Add your first worker to assign tasks and log hours"
            action={<button className="btn btn-primary" onClick={openCreate}><Plus size={16} />Add Worker</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {["Worker", "Contact", "Trade", "Rate", "Status", "Since", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-stone-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr key={w.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-semibold text-stone-700 flex-shrink-0">
                          {getInitials(w.firstName, w.lastName)}
                        </div>
                        <p className="font-medium text-stone-800 text-sm">{w.firstName} {w.lastName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-stone-500 flex items-center gap-1"><Mail size={10} />{w.email}</p>
                      {w.phone && <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5"><Phone size={10} />{w.phone}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={clsx("badge", tradeColors[w.trade] ?? "bg-stone-100 text-stone-600")}>{capitalize(w.trade)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-600">
                      {w.hourlyRate ? `$${w.hourlyRate}/hr` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={clsx("badge", w.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-400")}>
                        {capitalize(w.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-400">{formatDate(w.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="btn btn-ghost p-1.5" onClick={() => openEdit(w)}><Pencil size={14} /></button>
                        <button className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDelTarget(w)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Worker" : "New Worker"} size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name"><input className="input" value={form.firstName} onChange={s("firstName")} required /></Field>
          <Field label="Last Name"><input className="input" value={form.lastName} onChange={s("lastName")} required /></Field>
          <Field label="Email"><input type="email" className="input" value={form.email} onChange={s("email")} required /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} /></Field>
          <Field label="Trade">
            <select className="input" value={form.trade} onChange={s("trade")}>
              {TRADES.map((t) => <option key={t} value={t}>{capitalize(t)}</option>)}
            </select>
          </Field>
          <div />
          <Field label="Hourly Rate (CAD)"><input type="number" step="0.01" className="input" value={form.hourlyRate} onChange={s("hourlyRate")} placeholder="0.00" /></Field>
          <Field label="Overtime Rate (CAD)"><input type="number" step="0.01" className="input" value={form.overtimeRate} onChange={s("overtimeRate")} placeholder="0.00" /></Field>
          <div className="col-span-2">
            <Field label="Notes"><textarea className="input resize-none min-h-[70px]" value={form.notes} onChange={s("notes")} /></Field>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}{editing ? "Save Changes" : "Create Worker"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()} loading={delMut.isPending}
        title="Delete Worker" description={`Delete ${delTarget?.firstName} ${delTarget?.lastName}? This cannot be undone.`} />
    </div>
  );
}
