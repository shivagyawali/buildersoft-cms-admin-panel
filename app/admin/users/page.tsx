"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { User } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Users, Pencil, Trash2, ShieldCheck, Power } from "lucide-react";
import { getInitials, formatDate, getErrMsg, extractArray, capitalize } from "@/lib/utils";

const ROLES = ["admin","manager","supervisor","worker","contractor"];
const BLANK = { firstName:"",lastName:"",email:"",password:"",role:"worker",phone:"" };
interface FE { firstName?:string; lastName?:string; email?:string; password?:string; role?:string; }

const ROLE_COLORS: Record<string,{bg:string;color:string}> = {
  admin:      { bg:"var(--err-bg)",    color:"var(--err)" },
  manager:    { bg:"var(--am3)",       color:"var(--am)" },
  supervisor: { bg:"var(--info-bg)",   color:"var(--bl)" },
  worker:     { bg:"var(--ok-bg)",     color:"var(--ok)" },
  contractor: { bg:"var(--muted-bg)",  color:"var(--muted)" },
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User|null>(null);
  const [delTarget, setDelTarget] = useState<User|null>(null);
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState("");
  const [fe, setFe] = useState<FE>({});

  const { data, isLoading } = useQuery({ queryKey: ["company-users"], queryFn: () => usersApi.list({ limit: 100 }) });
  const users: User[] = extractArray<User>(data);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setFe(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: FE = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim())     e.email     = "Required";
    if (!editing && form.password.length < 8) e.password = "Min 8 chars";
    setFe(e);
    return !Object.keys(e).length;
  };

  const openCreate = () => { setEditing(null); setForm(BLANK); setErr(""); setFe({}); setOpen(true); };
  const openEdit   = (u: User) => {
    setEditing(u);
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: "", role: u.role, phone: u.phone ?? "" });
    setErr(""); setFe({}); setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      if (!validate()) return Promise.reject(new Error("v"));
      if (editing) return usersApi.update(editing.id, { firstName: form.firstName, lastName: form.lastName, phone: form.phone, role: form.role });
      return usersApi.create(form);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["company-users"] }); setOpen(false); },
    onError:   (e: unknown) => { if ((e as Error).message !== "v") setErr(getErrMsg(e)); },
  });

  const toggleMut = useMutation({
    mutationFn: (id: string) => usersApi.toggleActive(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["company-users"] }),
  });

  const delMut = useMutation({
    mutationFn: () => usersApi.delete(delTarget!.id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ["company-users"] }); setDelTarget(null); },
  });

  return (
    <div className="animate-fade-in relative z-10">
      <PageHeader title="Team Members" subtitle={`${users.length} users`}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>Add User</button>} />

      <div className="card overflow-hidden">
        {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> :
         users.length === 0 ? (
          <EmptyState icon={<Users size={18}/>} title="No team members yet" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={13}/>Add User</button>} />
         ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>{["User","Email","Role","Joined","Status",""].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
              <tbody>
                {users.map(u => {
                  const rc = ROLE_COLORS[u.role] ?? ROLE_COLORS.contractor;
                  return (
                    <tr key={u.id}>
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-semibold"
                            style={{ background: rc.bg, color: rc.color, borderRadius: 2 }}>
                            {getInitials(u.firstName, u.lastName)}
                          </div>
                          <div>
                            <div className="font-semibold text-[14px]" style={{ color: "var(--t1)" }}>{u.firstName} {u.lastName}</div>
                            {u.phone && <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--t3)" }}>{u.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-[13px]" style={{ color: "var(--t2)" }}>{u.email}</td>
                      <td className="table-cell">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]"
                          style={{ background: rc.bg, color: rc.color, borderRadius: 2 }}>
                          <ShieldCheck size={9}/>{u.role}
                        </span>
                      </td>
                      <td className="table-cell font-mono text-[11px]" style={{ color: "var(--t3)" }}>{formatDate(u.createdAt ?? "")}</td>
                      <td className="table-cell">
                        <span className={`badge status-${u.isActive !== false ? "active" : "inactive"}`}>
                          {u.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="row-action flex items-center gap-0.5 justify-end">
                          <button className="btn btn-ghost p-2" onClick={() => openEdit(u)}><Pencil size={13}/></button>
                          <button className="btn btn-ghost p-2 transition-colors"
                            style={{ color: u.isActive !== false ? "var(--warn)" : "var(--ok)" }}
                            onClick={() => toggleMut.mutate(u.id)} title={u.isActive !== false ? "Deactivate" : "Activate"}>
                            <Power size={13}/>
                          </button>
                          <button className="btn btn-ghost p-2" style={{ color: "var(--err)", opacity: 0.45 }}
                            onMouseOver={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "var(--err-bg)"; }}
                            onMouseOut={e => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                            onClick={() => setDelTarget(u)}><Trash2 size={13}/></button>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit User" : "Add User"} size="md">
        {err && <Alert type="error" message={err} />}
        <div className="grid grid-cols-2 gap-x-5 gap-y-1">
          <Field label="First Name" required error={fe.firstName}><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John"/></Field>
          <Field label="Last Name" required error={fe.lastName}><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe"/></Field>
          <Field label="Email" required error={fe.email}><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@company.com" disabled={!!editing}/></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123"/></Field>
          {!editing && (
            <div className="col-span-2">
              <Field label="Password" required error={fe.password}><input type="password" className="input" value={form.password} onChange={s("password")} placeholder="Min 8 characters"/></Field>
            </div>
          )}
          <div className="col-span-2">
            <Field label="Role"><select className="input" value={form.role} onChange={s("role")}>{ROLES.map(r => <option key={r} value={r}>{capitalize(r)}</option>)}</select></Field>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{ borderTop: "1px solid var(--ln)" }}>
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending && <Spinner size="sm"/>}{editing ? "Save Changes" : "Add User"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={() => delMut.mutate()}
        loading={delMut.isPending} title="Remove User"
        description={`Remove ${delTarget?.firstName} ${delTarget?.lastName} from the team?`} />
    </div>
  );
}
