"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesApi } from "@/lib/api";
import { PageHeader, Spinner, Modal, Field, Alert } from "@/components/ui/UI";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { formatDate, formatCurrency, getStatusColor, capitalize, getErrMsg } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";

const METHODS = ["cash", "cheque", "bank_transfer", "credit_card", "e_transfer", "other"];

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient();
  const [payOpen, setPayOpen] = useState(false);
  const [payForm, setPayForm] = useState({ amount: "", method: "bank_transfer", reference: "", notes: "" });
  const [payErr, setPayErr] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["invoice", params.id], queryFn: () => invoicesApi.get(params.id) });
  const invoice = data?.data?.data ?? data?.data;

  const sp = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setPayForm((p) => ({ ...p, [k]: e.target.value }));

  const payMut = useMutation({
    mutationFn: () => invoicesApi.recordPayment(params.id, { ...payForm, amount: Number(payForm.amount) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoice", params.id] }); setPayOpen(false); setPayErr(""); },
    onError: (e) => setPayErr(getErrMsg(e)),
  });

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!invoice) return <div className="text-stone-400 text-center py-24">Invoice not found</div>;

  const isPaid = invoice.status === "paid";

  return (
    <div className="animate-fade-in">
      <Link href="/invoices" className="btn btn-ghost mb-6 -ml-2 text-stone-500"><ArrowLeft size={16} /> Back to Invoices</Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="page-title font-mono">{invoice.invoiceNumber}</h1>
            <span className={clsx("badge", getStatusColor(invoice.status))}>{capitalize(invoice.status)}</span>
          </div>
          <p className="text-stone-400 text-sm">
            {invoice.client ? `${invoice.client.firstName} ${invoice.client.lastName}` : ""}{invoice.project ? ` — ${invoice.project.name}` : ""}
          </p>
        </div>
        {isPaid ? (
          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
            <CheckCircle size={16} /> Paid in full
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => { setPayForm({ amount: String(invoice.amountDue ?? ""), method: "bank_transfer", reference: "", notes: "" }); setPayOpen(true); }}>
            <CreditCard size={16} /> Record Payment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Dates */}
          <div className="card p-5 grid grid-cols-3 gap-4">
            {[["Issue Date", formatDate(invoice.issueDate)], ["Due Date", formatDate(invoice.dueDate)], ["Paid Date", invoice.paidDate ? formatDate(invoice.paidDate) : "—"]].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="font-medium text-stone-800 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Line items */}
          {invoice.items && invoice.items.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 font-semibold text-stone-800 text-sm">Line Items</div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {["Description", "Qty", "Unit Price", "Total"].map((h) => (
                      <th key={h} className={clsx("text-xs font-medium text-stone-400 uppercase tracking-wide px-5 py-2.5", h !== "Description" ? "text-right" : "text-left")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item: { description: string; quantity: number; unitPrice: number }, i: number) => (
                    <tr key={i} className="border-b border-stone-50">
                      <td className="px-5 py-3 text-sm text-stone-700">{item.description}</td>
                      <td className="px-5 py-3 text-sm text-stone-600 text-right">{item.quantity}</td>
                      <td className="px-5 py-3 text-sm text-stone-600 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-5 py-3 text-sm font-medium text-stone-800 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {invoice.notes && (
            <div className="card p-5">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-stone-600">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-sm font-semibold text-stone-700 mb-4">Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal)}</span></div>
              {Number(invoice.taxAmount) > 0 && <div className="flex justify-between text-stone-600"><span>Tax</span><span>{formatCurrency(invoice.taxAmount)}</span></div>}
              {Number(invoice.discount) > 0 && <div className="flex justify-between text-stone-600"><span>Discount</span><span>−{formatCurrency(invoice.discount)}</span></div>}
              <div className="flex justify-between font-semibold text-stone-900 pt-2 border-t border-stone-100 text-base">
                <span>Total</span><span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              {Number(invoice.amountPaid) > 0 && (
                <div className="flex justify-between text-emerald-600"><span>Paid</span><span>{formatCurrency(invoice.amountPaid)}</span></div>
              )}
              {Number(invoice.amountDue) > 0 && (
                <div className="flex justify-between font-semibold text-amber-700 pt-2 border-t border-stone-100">
                  <span>Amount Due</span><span>{formatCurrency(invoice.amountDue)}</span>
                </div>
              )}
            </div>
          </div>

          {invoice.client && (
            <div className="card p-5">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-3">Bill To</p>
              <div className="space-y-1 text-sm text-stone-600">
                <p className="font-medium text-stone-800">{invoice.client.firstName} {invoice.client.lastName}</p>
                {invoice.client.company && <p>{invoice.client.company}</p>}
                <p>{invoice.client.email}</p>
                {invoice.client.phone && <p>{invoice.client.phone}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Record Payment" size="sm">
        {payErr && <Alert type="error" message={payErr} />}
        <div className="space-y-4">
          <Field label="Amount (CAD)"><input type="number" className="input" value={payForm.amount} onChange={sp("amount")} required /></Field>
          <Field label="Payment Method">
            <select className="input" value={payForm.method} onChange={sp("method")}>
              {METHODS.map((m) => <option key={m} value={m}>{capitalize(m)}</option>)}
            </select>
          </Field>
          <Field label="Reference #"><input className="input" value={payForm.reference} onChange={sp("reference")} placeholder="Transaction ID, cheque #…" /></Field>
          <Field label="Notes"><textarea className="input resize-none min-h-[60px]" value={payForm.notes} onChange={sp("notes")} /></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn btn-secondary" onClick={() => setPayOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => payMut.mutate()} disabled={payMut.isPending}>
            {payMut.isPending && <Spinner size="sm" />}Record Payment
          </button>
        </div>
      </Modal>
    </div>
  );
}
