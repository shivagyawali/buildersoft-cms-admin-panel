"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api";
import { Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Users, Search, Pencil, Trash2, ExternalLink, Phone, Mail, Building2 } from "lucide-react";
import { getInitials, formatDate, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";

const BLANK = { firstName: "", lastName: "", email: "", phone: "", company: "", address: "", city: "", province: "", postalCode: "", country: "", notes: "" };
interface FormErrors { firstName?: string; lastName?: string; email?: string; }

export default function ClientsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [delTarget, setDelTarget] = useState<Client | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data, isLoading } = useQuery({ queryKey: ["clients"], queryFn: () => clientsApi.list({ limit: 100 }) });
  const clients: Client[] = extractArray<Client>(data);
  const filtered = clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setFormErrors({}); setOpen(true); };
  const openEdit = (c: Client) => {
    setEditing(c);
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone ?? "", company: c.company ?? "", address: c.address ?? "", city: c.city ?? "", province: c.province ?? "", postalCode: c.postalCode ?? "", country: c.country ?? "", notes: c.notes ?? "" });
    setErr(""); setFormErrors({}); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      if (!validate()) return Promise.reject(new Error("Validation failed"));
      return editing ? clientsApi.update(editing.id, form) : clientsApi.create(form);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients"] }); setOpen(false); },
    onError: (e: unknown) => { if ((e as Error).message !== "Validation failed") setErr(getErrMsg(e)); },
  });

  const delMut = useMutation({
    mutationFn: () => clientsApi.delete(delTarget!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients"] }); setDelTarget(null); },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Clients" subtitle={`${clients.length} client${clients.length !== 1 ? "s" : ""}`}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15} />New Client</button>} />

      <div className="relative mb-6 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input className="input pl-9" placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Users size={20} />} title="No clients yet" description="Add your first client to get started"
            action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15} />Add Client</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Client", "Contact", "Location", "Since", ""].map((h) => <th key={h} className="table-header">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 flex-shrink-0">
                          {getInitials(c.firstName, c.lastName)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-200 text-sm">{c.firstName} {c.lastName}</p>
                          {c.company && <p className="text-xs text-gray-600 flex items-center gap-1"><Building2 size={10} />{c.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} />{c.email}</p>
                      {c.phone && <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5"><Phone size={10} />{c.phone}</p>}
                    </td>
                    <td className="table-cell text-xs text-gray-500">{[c.city, c.province].filter(Boolean).join(", ") || "—"}</td>
                    <td className="table-cell text-xs text-gray-600">{formatDate(c.createdAt)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/clients/${c.id}`} className="btn btn-ghost p-1.5"><ExternalLink size={14} /></Link>
                        <button className="btn btn-ghost p-1.5" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                        <button className="btn btn-ghost p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-950/30" onClick={() => setDelTarget(c)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Client" : "New Client"} size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required error={formErrors.firstName}><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John" /></Field>
          <Field label="Last Name" required error={formErrors.lastName}><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe" /></Field>
          <Field label="Email" required error={formErrors.email}><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@example.com" /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123" /></Field>
          <Field label="Company"><input className="input" value={form.company} onChange={s("company")} placeholder="Company name" /></Field>
          <Field label="Address"><input className="input" value={form.address} onChange={s("address")} placeholder="123 Main St" /></Field>
          <Field label="City"><input className="input" value={form.city} onChange={s("city")} placeholder="Toronto" /></Field>
          <Field label="Province"><input className="input" value={form.province} onChange={s("province")} placeholder="ON" /></Field>
          <Field label="Postal Code"><input className="input" value={form.postalCode} onChange={s("postalCode")} placeholder="M5H 2N2" /></Field>
          <Field label="Country"><input className="input" value={form.country} onChange={s("country")} placeholder="Canada" /></Field>
          <div className="col-span-2"><Field label="Notes"><textarea className="input resize-none min-h-[70px]" value={form.notes} onChange={s("notes")} /></Field></div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}{editing ? "Save Changes" : "Create Client"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()}
        loading={delMut.isPending} title="Delete Client" description={`Delete ${delTarget?.firstName} ${delTarget?.lastName}? This cannot be undone.`} />
    </div>
  );
}
