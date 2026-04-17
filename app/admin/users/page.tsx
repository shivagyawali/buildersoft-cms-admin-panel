"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { User } from "@/types";
import { PageHeader, Modal, EmptyState, Spinner, ConfirmDialog, Field, Alert } from "@/components/ui/UI";
import { Plus, Users, Pencil, Trash2, Power, ShieldCheck } from "lucide-react";
import { getInitials, formatDate, getErrMsg, extractArray, capitalize } from "@/lib/utils";

const ROLES=["admin","manager","supervisor","worker","contractor"];
const BLANK={firstName:"",lastName:"",email:"",password:"",role:"worker",phone:""};
interface FE{firstName?:string;lastName?:string;email?:string;password?:string}
const ROLE_COLORS:Record<string,{bg:string;color:string}>={
  admin:{bg:"var(--err-bg)",color:"var(--err)"},manager:{bg:"var(--acc-subtle)",color:"var(--acc)"},
  supervisor:{bg:"var(--info-bg)",color:"var(--info)"},worker:{bg:"var(--ok-bg)",color:"var(--ok)"},
  contractor:{bg:"var(--muted-bg)",color:"var(--muted)"},
};

export default function AdminUsersPage() {
  const qc=useQueryClient();
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<User|null>(null);
  const [delTarget,setDelTarget]=useState<User|null>(null);
  const [form,setForm]=useState(BLANK);
  const [err,setErr]=useState("");
  const [fe,setFe]=useState<FE>({});

  const {data,isLoading}=useQuery({queryKey:["company-users"],queryFn:()=>usersApi.list({limit:100})});
  const users:User[]=extractArray<User>(data);

  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{setForm(p=>({...p,[k]:e.target.value}));setFe(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e:FE={};if(!form.firstName.trim())e.firstName="Required";if(!form.lastName.trim())e.lastName="Required";if(!form.email.trim())e.email="Required";if(!editing&&form.password.length<8)e.password="Min 8 chars";setFe(e);return!Object.keys(e).length;};
  const openCreate=()=>{setEditing(null);setForm(BLANK);setErr("");setFe({});setOpen(true);};
  const openEdit=(u:User)=>{setEditing(u);setForm({firstName:u.firstName,lastName:u.lastName,email:u.email,password:"",role:u.role,phone:u.phone??""});setErr("");setFe({});setOpen(true);};
  const saveMut=useMutation({mutationFn:()=>{if(!validate())return Promise.reject(new Error("v"));if(editing)return usersApi.update(editing.id,{firstName:form.firstName,lastName:form.lastName,phone:form.phone,role:form.role});return usersApi.create(form);},onSuccess:()=>{qc.invalidateQueries({queryKey:["company-users"]});setOpen(false);},onError:(e:unknown)=>{if((e as Error).message!=="v")setErr(getErrMsg(e));}});
  const toggleMut=useMutation({mutationFn:(id:string)=>usersApi.toggleActive(id),onSuccess:()=>qc.invalidateQueries({queryKey:["company-users"]})});
  const delMut=useMutation({mutationFn:()=>usersApi.delete(delTarget!.id),onSuccess:()=>{qc.invalidateQueries({queryKey:["company-users"]});setDelTarget(null);}});

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Team Members" subtitle={`${users.length} users in your company`} icon={<Users size={22}/>}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>Add User</button>}/>
      <div className="card overflow-hidden">
        {isLoading?<div className="flex justify-center py-16"><Spinner size="lg"/></div>:
         users.length===0?(<EmptyState icon={<Users size={28}/>} title="No Team Members" action={<button className="btn btn-primary" onClick={openCreate}><Plus size={15}/>Add User</button>}/>):(
          <table className="w-full">
            <thead><tr>{["Member","Email","Role","Joined","Status",""].map(h=><th key={h} className="tbl-head">{h}</th>)}</tr></thead>
            <tbody>
              {users.map(u=>{const rc=ROLE_COLORS[u.role]??ROLE_COLORS.contractor;return(
                <tr key={u.id}>
                  <td className="tbl-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-[11px] font-bold" style={{background:rc.bg,color:rc.color,border:`1.5px solid ${rc.color}30`}}>{getInitials(u.firstName,u.lastName)}</div>
                      <div>
                        <p className="font-semibold text-[14px]" style={{color:"var(--tx)"}}>{u.firstName} {u.lastName}</p>
                        {u.phone&&<p className="font-mono text-[11px]" style={{color:"var(--tx-3)"}}>{u.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="tbl-cell text-[13px]" style={{color:"var(--tx-2)"}}>{u.email}</td>
                  <td className="tbl-cell"><span className="badge flex items-center gap-1.5" style={{background:rc.bg,color:rc.color}}><ShieldCheck size={10}/>{u.role}</span></td>
                  <td className="tbl-cell font-mono text-[12px]" style={{color:"var(--tx-3)"}}>{formatDate(u.createdAt??"")}</td>
                  <td className="tbl-cell"><span className={`badge status-${u.isActive!==false?"active":"inactive"}`}>{u.isActive!==false?"Active":"Inactive"}</span></td>
                  <td className="tbl-cell">
                    <div className="row-act flex items-center gap-1 justify-end">
                      <button className="btn btn-ghost p-2 rounded-lg" onClick={()=>openEdit(u)}><Pencil size={13}/></button>
                      <button className="btn btn-ghost p-2 rounded-lg transition-colors" style={{color:u.isActive!==false?"var(--warn)":"var(--ok)"}} onClick={()=>toggleMut.mutate(u.id)}><Power size={13}/></button>
                      <button className="btn btn-ghost p-2 rounded-lg" style={{color:"var(--err)"}} onClick={()=>setDelTarget(u)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
         )}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Edit User":"Add User"} size="md">
        {err&&<Alert type="error" message={err}/>}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required error={fe.firstName}><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John"/></Field>
          <Field label="Last Name" required error={fe.lastName}><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe"/></Field>
          <Field label="Email" required error={fe.email}><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="john@company.com" disabled={!!editing}/></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={s("phone")} placeholder="+1-555-0123"/></Field>
          {!editing&&<div className="col-span-2"><Field label="Password" required error={fe.password}><input type="password" className="input" value={form.password} onChange={s("password")} placeholder="Min 8 characters"/></Field></div>}
          <div className="col-span-2"><Field label="Role"><select className="input" value={form.role} onChange={s("role")}>{ROLES.map(r=><option key={r} value={r}>{capitalize(r)}</option>)}</select></Field></div>
        </div>
        <div className="flex gap-3 justify-end mt-5 pt-4" style={{borderTop:"1px solid var(--line)"}}>
          <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending&&<Spinner size="sm"/>}{editing?"Save Changes":"Add User"}</button>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={()=>setDelTarget(null)} onConfirm={()=>delMut.mutate()} loading={delMut.isPending} title="Remove User" description={`Remove ${delTarget?.firstName} ${delTarget?.lastName}?`}/>
    </div>
  );
}
