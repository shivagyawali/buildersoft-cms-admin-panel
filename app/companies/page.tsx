"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api";
import { Company } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert, PlanBadge, CompanyStatusBadge } from "@/components/ui/UI";
import { Plus, Building2, Pencil, Trash2, ArrowUpRight, Users, FolderKanban, HardHat, Power } from "lucide-react";
import { formatDate, formatCurrency, getErrMsg, extractArray } from "@/lib/utils";
import Link from "next/link";

const BLANK_COMPANY = { name:"",email:"",phone:"",address:"",city:"",province:"",country:"",website:"",description:"",plan:"free",maxUsers:"5",maxProjects:"10",maxWorkers:"20",ownerFirstName:"",ownerLastName:"",ownerEmail:"",ownerPassword:"" };
const PLANS = ["free","starter","pro","enterprise"];

export default function CompaniesPage() {
  const qc = useQueryClient();
  const [open, setOpen]           = useState(false);
  const [delTarget, setDelTarget] = useState<Company|null>(null);
  const [form, setForm]           = useState(BLANK_COMPANY);
  const [err, setErr]             = useState("");
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["companies", statusFilter, search],
    queryFn:  () => companiesApi.list({ status: statusFilter||undefined, search: search||undefined, limit: 50 }),
  });
  const companies: Company[] = extractArray<Company>(data);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const createMut = useMutation({
    mutationFn: () => companiesApi.create({
      ...form,
      maxUsers:    Number(form.maxUsers),
      maxProjects: Number(form.maxProjects),
      maxWorkers:  Number(form.maxWorkers),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["companies"] }); setOpen(false); setForm(BLANK_COMPANY); },
    onError:   (e: unknown) => setErr(getErrMsg(e)),
  });

  const toggleMut = useMutation({
    mutationFn: (id: string) => companiesApi.toggleStatus(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });

  const delMut = useMutation({
    mutationFn: () => companiesApi.delete(delTarget!.id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ["companies"] }); setDelTarget(null); },
  });

  const PLAN_COLORS: Record<string, string> = {
    free: "var(--muted)", starter: "var(--bl)", pro: "var(--am)", enterprise: "var(--violet)",
  };

  return (
    <div className="animate-fade-in relative z-10">
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} registered`}
        action={<button className="btn btn-primary" onClick={() => { setErr(""); setOpen(true); }}><Plus size={13}/>New Company</button>}
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <input className="input w-64" placeholder="Search companies…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {["","active","trial","suspended","inactive"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] border transition-all"
              style={{ borderRadius: 2, ...(statusFilter === s ? { background: "var(--am3)", color: "var(--am)", borderColor: "rgba(232,160,32,0.3)" } : { background: "var(--c3)", color: "var(--t3)", borderColor: "var(--ln)" }) }}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> :
         companies.length === 0 ? (
          <EmptyState icon={<Building2 size={18} />} title="No companies yet" description="Create your first company" action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={13}/>New Company</button>} />
         ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>{["Company","Contact","Plan","Limits","Stats","Status","Since",""].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.id}>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-display font-bold text-[12px]"
                          style={{ background: "var(--am3)", color: "var(--am)", borderRadius: 2 }}>
                          {c.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-display font-bold text-[14px] uppercase tracking-[0.04em]" style={{ color: "var(--t1)" }}>{c.name}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.08em] mt-0.5" style={{ color: "var(--t3)" }}>{c.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-[12.5px]" style={{ color: "var(--t2)" }}>
                      <div>{c.email || "—"}</div>
                      {c.city && <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--t3)" }}>{c.city}, {c.country}</div>}
                    </td>
                    <td className="table-cell"><PlanBadge plan={c.plan} /></td>
                    <td className="table-cell">
                      <div className="flex flex-col gap-1 font-mono text-[10px]" style={{ color: "var(--t3)" }}>
                        <span className="flex items-center gap-1"><Users size={9}/> {c.maxUsers} users</span>
                        <span className="flex items-center gap-1"><FolderKanban size={9}/> {c.maxProjects} proj</span>
                        <span className="flex items-center gap-1"><HardHat size={9}/> {c.maxWorkers} workers</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      {c.stats ? (
                        <div className="flex flex-col gap-1 font-mono text-[10px]" style={{ color: "var(--t2)" }}>
                          <span>{c.stats.users} users · {c.stats.projects} proj</span>
                          <span style={{ color: "var(--ok)" }}>{formatCurrency(c.stats.totalPaid)} paid</span>
                        </div>
                      ) : <span style={{ color: "var(--t4)" }}>—</span>}
                    </td>
                    <td className="table-cell"><CompanyStatusBadge status={c.status} /></td>
                    <td className="table-cell font-mono text-[11px]" style={{ color: "var(--t3)" }}>{formatDate(c.createdAt)}</td>
                    <td className="table-cell">
                      <div className="row-action flex items-center gap-0.5 justify-end">
                        <Link href={`/companies/${c.id}`} className="btn btn-ghost p-2"><ArrowUpRight size={13}/></Link>
                        <button
                          className="btn btn-ghost p-2 transition-colors"
                          style={{ color: c.status === "active" ? "var(--warn)" : "var(--ok)" }}
                          onClick={() => toggleMut.mutate(c.id)}
                          title={c.status === "active" ? "Suspend" : "Activate"}
                        >
                          <Power size={13}/>
                        </button>
                        <button className="btn btn-ghost p-2" style={{ color: "var(--err)", opacity: 0.45 }}
                          onMouseOver={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "var(--err-bg)"; }}
                          onMouseOut={e => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          onClick={() => setDelTarget(c)}>
                          <Trash2 size={13}/>
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

      {/* Create modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="New Company" size="xl">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-x-5 gap-y-1">
          <div className="col-span-2 mb-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] mb-3" style={{ color: "var(--am)", borderLeft: "2px solid var(--am)", paddingLeft: 8 }}>Company Details</div>
          </div>
          <Field label="Company Name *"><input className="input" value={form.name} onChange={s("name")} placeholder="Acme Construction Ltd." /></Field>
          <Field label="Plan"><select className="input" value={form.plan} onChange={s("plan")}>{PLANS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}</select></Field>
          <Field label="Email"><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="info@company.com" /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0100" /></Field>
          <Field label="City"><input className="input" value={form.city} onChange={s("city")} placeholder="Toronto" /></Field>
          <Field label="Province / State"><input className="input" value={form.province} onChange={s("province")} placeholder="ON" /></Field>
          <Field label="Country"><input className="input" value={form.country} onChange={s("country")} placeholder="Canada" /></Field>
          <Field label="Website"><input className="input" value={form.website} onChange={s("website")} placeholder="https://..." /></Field>

          <div className="col-span-2 mt-2 mb-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] mb-3" style={{ color: "var(--bl)", borderLeft: "2px solid var(--bl)", paddingLeft: 8 }}>Plan Limits</div>
          </div>
          <Field label="Max Users"><input type="number" className="input" value={form.maxUsers} onChange={s("maxUsers")} min="1" /></Field>
          <Field label="Max Projects"><input type="number" className="input" value={form.maxProjects} onChange={s("maxProjects")} min="1" /></Field>
          <Field label="Max Workers"><input type="number" className="input" value={form.maxWorkers} onChange={s("maxWorkers")} min="1" /></Field>
          <div />

          <div className="col-span-2 mt-2 mb-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] mb-3" style={{ color: "var(--ok)", borderLeft: "2px solid var(--ok)", paddingLeft: 8 }}>Company Admin (optional)</div>
          </div>
          <Field label="First Name"><input className="input" value={form.ownerFirstName} onChange={s("ownerFirstName")} placeholder="John" /></Field>
          <Field label="Last Name"><input className="input" value={form.ownerLastName} onChange={s("ownerLastName")} placeholder="Smith" /></Field>
          <Field label="Admin Email"><input type="email" className="input" value={form.ownerEmail} onChange={s("ownerEmail")} placeholder="admin@company.com" /></Field>
          <Field label="Admin Password"><input type="password" className="input" value={form.ownerPassword} onChange={s("ownerPassword")} placeholder="Min 8 chars" /></Field>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{ borderTop: "1px solid var(--ln)" }}>
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => createMut.mutate()} disabled={createMut.isPending}>
            {createMut.isPending && <Spinner size="sm" />}Create Company
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()}
        loading={delMut.isPending} title="Delete Company"
        description={`Permanently delete "${delTarget?.name}" and ALL its data? This cannot be undone.`} />
    </div>
  );
}
