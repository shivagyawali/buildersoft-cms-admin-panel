"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { Field, Spinner, Alert } from "@/components/ui/UI";
import { User, Lock, Shield, ExternalLink } from "lucide-react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

const ROLE_STYLES: Record<string,{bg:string;fg:string;border:string}> = {
  admin:      {bg:"rgba(192,57,43,0.14)",    fg:"var(--err)",    border:"rgba(192,57,43,0.3)"},
  manager:    {bg:"rgba(232,160,32,0.14)",   fg:"var(--am)",     border:"rgba(232,160,32,0.3)"},
  supervisor: {bg:"rgba(74,127,165,0.18)",   fg:"var(--bl)",     border:"rgba(74,127,165,0.3)"},
  worker:     {bg:"rgba(61,153,112,0.14)",   fg:"var(--ok)",     border:"rgba(61,153,112,0.3)"},
};
const ROUTE_LABELS: Record<string,string> = {
  "/dashboard":"Dashboard","/clients":"Clients","/projects":"Projects",
  "/tasks":"Tasks","/workers":"Workers","/invoice-periods":"Pay Periods",
  "/invoices":"Invoices","/admin":"Admin","/settings":"Settings",
};

export default function SettingsPage() {
  const {user,refreshUser}=useAuth();
  const {permissions}=usePermissions();
  const [pf,setPf]=useState({phone:user?.phone??"",company:user?.company??""});
  const [pw,setPw]=useState({oldPassword:"",newPassword:"",confirmPassword:""});
  const [pMsg,setPMsg]=useState("");
  const [wMsg,setWMsg]=useState("");
  const [wErr,setWErr]=useState("");
  const [wFe,setWFe]=useState<{oldPassword?:string;newPassword?:string;confirmPassword?:string}>({});

  const sp=(k:string)=>(e:React.ChangeEvent<HTMLInputElement>)=>setPf(p=>({...p,[k]:e.target.value}));
  const sw=(k:string)=>(e:React.ChangeEvent<HTMLInputElement>)=>{setPw(p=>({...p,[k]:e.target.value}));setWFe(p=>({...p,[k]:undefined}));};

  const profileMut=useMutation({mutationFn:()=>authApi.updateProfile(pf),onSuccess:()=>{refreshUser();setPMsg("Profile updated!");setTimeout(()=>setPMsg(""),3000);}});
  const pwMut=useMutation({mutationFn:()=>authApi.changePassword({oldPassword:pw.oldPassword,newPassword:pw.newPassword}),onSuccess:()=>{setPw({oldPassword:"",newPassword:"",confirmPassword:""});setWMsg("Password changed!");setTimeout(()=>setWMsg(""),3000);},onError:(e:unknown)=>{const err=e as {response?:{data?:{message?:string}}};setWErr(err?.response?.data?.message??"Failed to update password");}});

  const validatePw=()=>{const e:{oldPassword?:string;newPassword?:string;confirmPassword?:string}={};if(!pw.oldPassword)e.oldPassword="Required";if(!pw.newPassword||pw.newPassword.length<8)e.newPassword="Min 8 characters";if(pw.newPassword!==pw.confirmPassword)e.confirmPassword="Passwords do not match";setWFe(e);return!Object.keys(e).length;};
  const handlePwSubmit=(e:React.FormEvent)=>{e.preventDefault();setWErr("");if(!validatePw())return;pwMut.mutate();};

  if(!user)return null;
  const routes=permissions[user.role]??[];
  const isAdmin=user.role==="admin";
  const rs=ROLE_STYLES[user.role]??ROLE_STYLES.manager;

  return (
    <div className="animate-fade-in relative z-10 max-w-2xl">
      <div className="mb-6">
        <div className="page-sub mb-1.5">Account / Settings</div>
        <h1 className="page-title">Your Account</h1>
      </div>
      <div className="hairline-strong mb-7"/>

      {/* Identity card */}
      <div className="card mb-4">
        <div className="flex items-center gap-4 px-6 py-5 border-b border-[color:var(--ln)]">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center font-display font-bold text-lg border" style={{background:rs.bg,borderColor:rs.border,color:rs.fg,borderRadius:2}}>{getInitials(user.firstName,user.lastName)}</div>
          <div>
            <div className="font-display font-bold text-[20px] uppercase tracking-[0.04em] leading-none">{user.firstName} {user.lastName}</div>
            <div className="text-[13px] text-[color:var(--t2)] mt-1">{user.email}</div>
            <span className="inline-block mt-2 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] border" style={{background:rs.bg,color:rs.fg,borderColor:rs.border,borderRadius:2}}>{user.role}</span>
          </div>
        </div>

        {/* Profile form */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-5"><User size={13} className="text-[color:var(--t3)]"/><span className="label mb-0">Edit Profile</span></div>
          {pMsg&&<Alert type="success" message={pMsg}/>}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-5">
            <div><label className="label">First Name</label><input className="input opacity-40 cursor-not-allowed" value={user.firstName} readOnly/></div>
            <div><label className="label">Last Name</label><input className="input opacity-40 cursor-not-allowed" value={user.lastName} readOnly/></div>
            <div className="col-span-2"><label className="label">Email</label><input className="input opacity-40 cursor-not-allowed" value={user.email} readOnly/></div>
            <Field label="Phone"><input className="input" value={pf.phone} onChange={sp("phone")} placeholder="+1-555-0123"/></Field>
            <Field label="Company"><input className="input" value={pf.company} onChange={sp("company")} placeholder="Company name"/></Field>
          </div>
          <button className="btn btn-primary" onClick={()=>profileMut.mutate()} disabled={profileMut.isPending}>{profileMut.isPending&&<Spinner size="sm"/>}Save Profile</button>
        </div>
      </div>

      {/* Password card */}
      <div className="card mb-4">
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-5"><Lock size={13} className="text-[color:var(--t3)]"/><span className="label mb-0">Change Password</span></div>
          {wMsg&&<Alert type="success" message={wMsg}/>}
          {wErr&&<Alert type="error" message={wErr}/>}
          <form onSubmit={handlePwSubmit} className="space-y-1">
            <Field label="Current Password" error={wFe.oldPassword}><input type="password" className="input" value={pw.oldPassword} onChange={sw("oldPassword")}/></Field>
            <Field label="New Password" error={wFe.newPassword}><input type="password" className="input" value={pw.newPassword} onChange={sw("newPassword")}/></Field>
            <Field label="Confirm Password" error={wFe.confirmPassword}><input type="password" className="input" value={pw.confirmPassword} onChange={sw("confirmPassword")}/></Field>
            <div className="pt-3"><button type="submit" className="btn btn-primary" disabled={pwMut.isPending}>{pwMut.isPending&&<Spinner size="sm"/>}Update Password</button></div>
          </form>
        </div>
      </div>

      {/* Access card */}
      <div className="card">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2"><Shield size={13} className="text-[color:var(--t3)]"/><span className="label mb-0">My Access</span></div>
            {isAdmin&&<Link href="/admin/roles" className="btn btn-secondary text-[12px] py-1.5"><ExternalLink size={12}/>Manage Roles</Link>}
          </div>
          <div className="border p-4 mb-4" style={{background:rs.bg,borderColor:rs.border,borderRadius:2}}>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] border" style={{background:rs.bg,color:rs.fg,borderColor:rs.border}}>{user.role}</span>
              <span className="text-[12px] text-[color:var(--t3)]">Current role</span>
            </div>
            <p className="text-[13px] mb-3 text-[color:var(--t2)]">Access to <strong>{routes.length}</strong> sections.</p>
            <div className="flex flex-wrap gap-1.5">
              {routes.map(href=>(
                <span key={href} className="font-mono text-[10.5px] px-2.5 py-1 border" style={{background:"var(--c2)",border:"1px solid var(--ln)",color:"var(--t2)",borderRadius:2}}>{ROUTE_LABELS[href]??href}</span>
              ))}
            </div>
          </div>
          {isAdmin&&<p className="text-[12.5px] text-[color:var(--t3)]">Admin: manage permissions from <Link href="/admin/roles" className="text-[color:var(--am)] underline underline-offset-2">Roles &amp; Permissions</Link>.</p>}
        </div>
      </div>
    </div>
  );
}
