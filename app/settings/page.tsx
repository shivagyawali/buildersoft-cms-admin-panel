"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { PageHeader, Field, Spinner, Alert, ThemeToggle, SectionDivider } from "@/components/ui/UI";
import { User, Lock, Shield, Sun, HardHat, CheckCircle2 } from "lucide-react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { permissions } = usePermissions();
  const [profileForm, setProfileForm] = useState({ phone: user?.phone??"", company: user?.company??"", firstName: user?.firstName??"", lastName: user?.lastName??"" });
  const [pwForm, setPwForm] = useState({ oldPassword:"", newPassword:"", confirmPassword:"" });
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwFE, setPwFE] = useState<{oldPassword?:string;newPassword?:string;confirmPassword?:string}>({});

  const sp=(k:string)=>(e:React.ChangeEvent<HTMLInputElement>)=>setProfileForm(p=>({...p,[k]:e.target.value}));
  const sw=(k:string)=>(e:React.ChangeEvent<HTMLInputElement>)=>{setPwForm(p=>({...p,[k]:e.target.value}));setPwFE(p=>({...p,[k]:undefined}));};

  const profileMut=useMutation({mutationFn:()=>authApi.updateProfile(profileForm),onSuccess:()=>{refreshUser();setProfileMsg("Profile updated!");setTimeout(()=>setProfileMsg(""),3000);}});
  const pwMut=useMutation({mutationFn:()=>authApi.changePassword({oldPassword:pwForm.oldPassword,newPassword:pwForm.newPassword}),onSuccess:()=>{setPwForm({oldPassword:"",newPassword:"",confirmPassword:""});setPwMsg("Password changed!");setTimeout(()=>setPwMsg(""),3000);},onError:(e:unknown)=>{const err=e as{response?:{data?:{message?:string}}};setPwErr(err?.response?.data?.message??"Failed to update");}});

  const validatePw=()=>{const e:{oldPassword?:string;newPassword?:string;confirmPassword?:string}={};if(!pwForm.oldPassword)e.oldPassword="Required";if(!pwForm.newPassword||pwForm.newPassword.length<8)e.newPassword="At least 8 chars";if(pwForm.newPassword!==pwForm.confirmPassword)e.confirmPassword="Passwords don't match";setPwFE(e);return!Object.keys(e).length;};
  const handlePwSubmit=(ev:React.FormEvent)=>{ev.preventDefault();setPwErr("");if(!validatePw())return;pwMut.mutate();};

  if(!user) return null;

  const myRoutes=permissions[user.role]??[];
  const isAdmin=user.role==="admin"||user.role==="superadmin";
  const ROLE_COLORS:Record<string,string>={superadmin:"var(--purple)",admin:"var(--err)",manager:"var(--acc)",supervisor:"var(--info)",worker:"var(--ok)",contractor:"var(--muted)"};
  const roleColor=ROLE_COLORS[user.role]??"var(--acc)";

  const ROUTE_LABELS:Record<string,string>={"/dashboard":"Dashboard","/clients":"Clients","/projects":"Projects","/tasks":"Tasks","/workers":"Workers","/invoice-periods":"Pay Periods","/invoices":"Invoices"};

  return (
    <div className="animate-fade-in max-w-2xl space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" icon={<User size={22}/>}/>

      {/* Profile card */}
      <div className="card card-accent p-6">
        <div className="flex items-center gap-5 mb-6 pb-5" style={{borderBottom:"1px solid var(--line)"}}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display text-[26px] flex-shrink-0"
            style={{background:`${roleColor}18`,color:roleColor,border:`2px solid ${roleColor}40`}}>
            {getInitials(user.firstName,user.lastName)}
          </div>
          <div>
            <p className="font-display text-[24px] tracking-wide" style={{color:"var(--tx)"}}>{user.firstName} {user.lastName}</p>
            <p className="text-[14px] mt-0.5" style={{color:"var(--tx-2)"}}>{user.email}</p>
            <span className="inline-flex items-center gap-1.5 badge mt-2" style={{background:`${roleColor}18`,color:roleColor}}>
              <HardHat size={11}/>{user.role.toUpperCase()}
            </span>
          </div>
        </div>

        <SectionDivider label="Edit Profile"/>
        {profileMsg&&<Alert type="success" message={profileMsg}/>}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="First Name"><input className="input" value={profileForm.firstName} onChange={sp("firstName")}/></Field>
          <Field label="Last Name"><input className="input" value={profileForm.lastName} onChange={sp("lastName")}/></Field>
          <div className="col-span-2"><label className="label">Email</label><input className="input opacity-60 cursor-not-allowed" value={user.email} readOnly/></div>
          <Field label="Phone"><input className="input" value={profileForm.phone} onChange={sp("phone")} placeholder="+1-555-0123"/></Field>
          <Field label="Company"><input className="input" value={profileForm.company} onChange={sp("company")} placeholder="Company name"/></Field>
        </div>
        <button className="btn btn-primary" onClick={()=>profileMut.mutate()} disabled={profileMut.isPending}>
          {profileMut.isPending&&<Spinner size="sm"/>}Save Profile
        </button>
      </div>

      {/* Password card */}
      <div className="card card-accent p-6">
        <SectionDivider label="Change Password"/>
        {pwMsg&&<Alert type="success" message={pwMsg}/>}
        {pwErr&&<Alert type="error" message={pwErr}/>}
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Field label="Current Password" error={pwFE.oldPassword}><input type="password" className="input" value={pwForm.oldPassword} onChange={sw("oldPassword")}/></Field>
          <Field label="New Password" error={pwFE.newPassword}><input type="password" className="input" value={pwForm.newPassword} onChange={sw("newPassword")}/></Field>
          <Field label="Confirm Password" error={pwFE.confirmPassword}><input type="password" className="input" value={pwForm.confirmPassword} onChange={sw("confirmPassword")}/></Field>
          <button type="submit" className="btn btn-primary" disabled={pwMut.isPending}>{pwMut.isPending&&<Spinner size="sm"/>}Update Password</button>
        </form>
      </div>

      {/* Theme */}
      <div className="card card-accent p-6">
        <SectionDivider label="Appearance"/>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[15px]" style={{color:"var(--tx)"}}>Interface Theme</p>
            <p className="text-[13px] mt-1" style={{color:"var(--tx-2)"}}>Toggle between light and dark mode</p>
          </div>
          <ThemeToggle/>
        </div>
      </div>

      {/* Access card */}
      <div className="card card-accent p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionDivider label="My Access"/>
          {isAdmin&&<Link href="/admin/roles" className="btn btn-secondary text-[12px]"><Shield size={13}/>Manage Roles</Link>}
        </div>
        <div className="rounded-xl p-4 mb-4" style={{background:`${roleColor}08`,border:`1.5px solid ${roleColor}20`}}>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge font-bold" style={{background:`${roleColor}18`,color:roleColor}}>{user.role.toUpperCase()}</span>
            <span className="text-[12px]" style={{color:"var(--tx-3)"}}>Your role · {myRoutes.length} sections accessible</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {myRoutes.map(href=>(
              <span key={href} className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-xl"
                style={{background:"var(--bg-raised)",border:"1px solid var(--line)",color:"var(--tx-2)"}}>
                <CheckCircle2 size={11} style={{color:roleColor}}/>{ROUTE_LABELS[href]||href}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
