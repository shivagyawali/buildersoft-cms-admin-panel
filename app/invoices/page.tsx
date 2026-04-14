"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesApi, projectsApi, clientsApi } from "@/lib/api";
import { Invoice, Project, Client } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, FileText, Trash2, ExternalLink, X } from "lucide-react";
import { formatDate, formatCurrency, getStatusColor, capitalize, getErrMsg } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  const d = data as Record<string, unknown>;
  if (d?.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.data)) return inner.data as T[];
    if (Array.isArray(inner)) return inner as T[];
  }
  if (Array.isArray(d?.data)) return d.data as T[];
  if (Array.isArray(d)) return d as T[];
  return [];
}

const STATUSES = ["draft", "sent", "viewed", "partially_paid", "paid", "overdue", "cancelled"];
interface LineItem { description: string; quantity: string; unitPrice: string }

export default function InvoicesPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<Invoice | null>(null);
  const [form, setForm] = useState({
    projectId: "", clientId: "", issueDate: "", dueDate: "", taxAmount: "", notes: "",
  });
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: "1", unitPrice: "" }]);
  const [err, setErr] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", statusFilter],
    queryFn: () => invoicesApi.list({ status: statusFilter || undefined, limit: 50 }),
  });
  const { data: projData } = useQuery({
    queryKey: ["projects-inv"],
    queryFn: () => projectsApi.list({ limit: 100 }),
  });
  const { data: clientData } = useQuery({
    queryKey: ["clients-inv"],
    queryFn: () => clientsApi.list({ limit: 100 }),
  });

  const invoices: Invoice[] = extractArray<Invoice>(data);
  const projects: Project[] = extractArray<Project>(projData);
const clients= data?.data?.data?.invoices??[];
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const setItem = (i: number, k: keyof LineItem, v: string) =>
    setItems((p) => p.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));

  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  const tax = Number(form.taxAmount) || 0;

  const openCreate = () => {
    setForm({
      projectId: "", clientId: "",
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: "", taxAmount: "", notes: "",
    });
    setItems([{ description: "", quantity: "1", unitPrice: "" }]);
    setErr("");
    setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => invoicesApi.create({
      ...form,
      taxAmount: tax,
      items: items
        .filter((it) => it.description)
        .map((it) => ({
          description: it.description,
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
        })),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); setOpen(false); },
    onError: (e) => setErr(getErrMsg(e)),
  });

  const delMut = useMutation({
    mutationFn: () => invoicesApi.delete(delTarget!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); setDelTarget(null); },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`}
        action={
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} />New Invoice
          </button>
        }
      />

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {[{ key: "", label: "All" }, ...STATUSES.map((s) => ({ key: s, label: capitalize(s) }))].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              statusFilter === key
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<FileText size={20} />}
            title="No invoices yet"
            action={
              <button className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} />New Invoice
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {["Invoice #", "Client", "Issue Date", "Due Date", "Total", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-stone-400 uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-sm text-stone-700">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-stone-700">
                        {inv.client ? `${inv.client.firstName} ${inv.client.lastName}` : "—"}
                      </p>
                      <p className="text-xs text-stone-400">{inv.project?.name ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-600">{formatDate(inv.issueDate)}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-600">{formatDate(inv.dueDate)}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-stone-800 text-sm">{formatCurrency(inv.totalAmount)}</p>
                      {Number(inv.amountDue) > 0 && inv.status !== "paid" && (
                        <p className="text-xs text-stone-400">Due: {formatCurrency(inv.amountDue)}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={clsx("badge", getStatusColor(inv.status))}>{capitalize(inv.status)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/invoices/${inv.id}`} className="btn btn-ghost p-1.5">
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDelTarget(inv)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="New Invoice" size="lg">
        {err && <Alert type="error" message={err} />}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Client">
              <select className="input" value={form.clientId} onChange={sf("clientId")} required>
                <option value="">Select client…</option>
                {clients.map((c:any) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </Field>
            <Field label="Project">
              <select className="input" value={form.projectId} onChange={sf("projectId")} required>
                <option value="">Select project…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Issue Date">
              <input type="date" className="input" value={form.issueDate} onChange={sf("issueDate")} required />
            </Field>
            <Field label="Due Date">
              <input type="date" className="input" value={form.dueDate} onChange={sf("dueDate")} required />
            </Field>
          </div>

          {/* Line items */}
          <div>
            <label className="label">Line Items</label>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-400 uppercase tracking-wide border-b border-stone-200">
                <span className="col-span-6">Description</span>
                <span className="col-span-2 text-right">Qty</span>
                <span className="col-span-3 text-right">Unit Price</span>
                <span className="col-span-1" />
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-1.5 px-3 py-2 border-b border-stone-50 items-center">
                  <input
                    className="input col-span-6 text-sm" placeholder="Description"
                    value={item.description} onChange={(e) => setItem(i, "description", e.target.value)}
                  />
                  <input
                    type="number" className="input col-span-2 text-sm text-right" placeholder="1"
                    value={item.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)}
                  />
                  <input
                    type="number" className="input col-span-3 text-sm text-right" placeholder="0.00"
                    value={item.unitPrice} onChange={(e) => setItem(i, "unitPrice", e.target.value)}
                  />
                  <button
                    onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
                    className="col-span-1 flex justify-center text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="px-3 py-2">
                <button
                  className="btn btn-ghost text-xs text-amber-600 py-1"
                  onClick={() => setItems((p) => [...p, { description: "", quantity: "1", unitPrice: "" }])}
                >
                  <Plus size={13} />Add line
                </button>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-stone-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Tax</span>
              <input
                type="number" className="input w-28 text-right text-sm py-1" placeholder="0.00"
                value={form.taxAmount} onChange={sf("taxAmount")}
              />
            </div>
            <div className="flex justify-between font-semibold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total</span><span>{formatCurrency(subtotal + tax)}</span>
            </div>
          </div>

          <Field label="Notes">
            <textarea
              className="input resize-none min-h-[60px]" placeholder="Payment terms, notes…"
              value={form.notes} onChange={sf("notes")}
            />
          </Field>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm" />}Create Invoice
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={() => delMut.mutate()}
        loading={delMut.isPending}
        title="Delete Invoice"
        description={`Delete invoice ${delTarget?.invoiceNumber}?`}
      />
    </div>
  );
}