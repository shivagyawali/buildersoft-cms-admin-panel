"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Users, Search, Pencil, Trash2, ExternalLink, Phone, Mail, Building2 } from "lucide-react";
import { getInitials, formatDate, getErrMsg } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data !== "object" || data === null) return [];
  const d = data as Record<string, unknown>;
  if ("clients" in d && Array.isArray(d.clients)) return d.clients as T[];
  if ("data" in d && d.data !== undefined) return extractArray(d.data);
  return [];
}

const BLANK = {
  firstName: "", lastName: "", email: "", phone: "",
  company: "", address: "", city: "", province: "", postalCode: "", country: "", notes: "",
};

export default function ClientsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [delTarget, setDelTarget] = useState<Client | null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsApi.list({ limit: 100 }),
  });

  const saveMut = useMutation({
    mutationFn: () => editing ? clientsApi.update(editing.id, form) : clientsApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients"] }); setOpen(false); },
    onError: (e) => setErr(getErrMsg(e)),
  });

  const delMut = useMutation({
    mutationFn: () => clientsApi.delete(delTarget!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients"] }); setDelTarget(null); },
  });

  const clients: Client[] = extractArray<Client>(data);

  const filtered = clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setOpen(true); };
  const openEdit = (c: Client) => {
    setEditing(c);
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone ?? "",
      company: c.company ?? "", address: c.address ?? "", city: c.city ?? "",
      province: c.province ?? "", postalCode: c.postalCode ?? "", country: c.country ?? "", notes: c.notes ?? "" });
    setErr(""); setOpen(true);
  };

  // Only allow editing/deleting own clients (or admin can do all)
  const canEdit = (c: Client) => !c.createdById || c.createdById === user?.id || user?.role === "admin";

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} client${clients.length !== 1 ? "s" : ""}`}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={16} />New Client</button>}
      />

      <div className="relative mb-6 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input className="input pl-9" placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Users size={20} />} title="No clients yet" description="Add your first client to get started"
            action={<button className="btn btn-primary" onClick={openCreate}><Plus size={16} />Add Client</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {["Client", "Contact", "Location", "Since", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-stone-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-700 flex-shrink-0">
                          {getInitials(c.firstName, c.lastName)}
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 text-sm">{c.firstName} {c.lastName}</p>
                          {c.company && <p className="text-xs text-stone-400 flex items-center gap-1"><Building2 size={10} />{c.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-stone-500 flex items-center gap-1"><Mail size={10} />{c.email}</p>
                      {c.phone && <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5"><Phone size={10} />{c.phone}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-500">{[c.city, c.province].filter(Boolean).join(", ") || "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-stone-400">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/clients/${c.id}`} className="btn btn-ghost p-1.5"><ExternalLink size={14} /></Link>
                        {canEdit(c) && <>
                          <button className="btn btn-ghost p-1.5" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                          <button className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDelTarget(c)}><Trash2 size={14} /></button>
                        </>}
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
          <Field label="First Name"><input className="input" value={form.firstName} onChange={s("firstName")} required /></Field>
          <Field label="Last Name"><input className="input" value={form.lastName} onChange={s("lastName")} required /></Field>
          <Field label="Email"><input type="email" className="input" value={form.email} onChange={s("email")} required /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} /></Field>
          <Field label="Company"><input className="input" value={form.company} onChange={s("company")} /></Field>
          <Field label="Address"><input className="input" value={form.address} onChange={s("address")} /></Field>
          <Field label="City"><input className="input" value={form.city} onChange={s("city")} /></Field>
          <Field label="Province"><input className="input" value={form.province} onChange={s("province")} /></Field>
          <Field label="Postal Code"><input className="input" value={form.postalCode} onChange={s("postalCode")} /></Field>
          <Field label="Country"><input className="input" value={form.country} onChange={s("country")} /></Field>
          <div className="col-span-2">
            <Field label="Notes"><textarea className="input resize-none min-h-[70px]" value={form.notes} onChange={s("notes")} /></Field>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}{editing ? "Save Changes" : "Create Client"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()} loading={delMut.isPending}
        title="Delete Client" description={`Delete ${delTarget?.firstName} ${delTarget?.lastName}? This cannot be undone.`} />
    </div>
  );
}
