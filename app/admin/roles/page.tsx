"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { ALL_ROLES, DEFAULT_NAV, RolePermissionsMap } from "@/lib/permissions";
import { PageHeader, Alert, SectionDivider } from "@/components/ui/UI";
import { ShieldCheck, RotateCcw, Save, Check, Lock, Info } from "lucide-react";
import { useRouter } from "next/navigation";

const ROLE_META:Record<string,{label:string;desc:string;color:string}> = {
  admin:      {label:"Admin",      desc:"Full system access",               color:"var(--err)"},
  manager:    {label:"Manager",    desc:"Projects, clients, billing",       color:"var(--acc)"},
  supervisor: {label:"Supervisor", desc:"Oversee projects and teams",       color:"var(--info)"},
  worker:     {label:"Worker",     desc:"Field worker, tasks only",         color:"var(--ok)"},
  contractor: {label:"Contractor", desc:"Limited access",                   color:"var(--muted)"},
};

export default function AdminRolesPage() {
  const { user } = useAuth();
  const { permissions, updatePermissions, resetPermissions } = usePermissions();
  const router = useRouter();
  const [draft, setDraft] = useState<RolePermissionsMap>({});
  const [saved, setSaved] = useState(false);

  useEffect(()=>{ if(user&&user.role!=="admin"&&user.role!=="superadmin") router.replace("/dashboard"); },[user,router]);
  useEffect(()=>{ setDraft(JSON.parse(JSON.stringify(permissions))); },[permissions]);

  if(!user||(user.role!=="admin"&&user.role!=="superadmin")) return null;

  const toggle=(role:string,href:string)=>{setDraft(prev=>{const curr=prev[role]??[];const next=curr.includes(href)?curr.filter(h=>h!==href):[...curr,href];const withDash=next.includes("/dashboard")?next:["/dashboard",...next];return{...prev,[role]:withDash};});};
  const handleSave=()=>{updatePermissions(draft);setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const handleReset=()=>{resetPermissions();setSaved(false);};
  const hasChanges=JSON.stringify(draft)!==JSON.stringify(permissions);

  return (
    <div className="animate-fade-in max-w-5xl space-y-6">
      <PageHeader title="Roles & Permissions" subtitle="Control navigation access per role" icon={<ShieldCheck size={22}/>}
        action={
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary" onClick={handleReset}><RotateCcw size={14}/>Reset</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={!hasChanges}>
              {saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Changes</>}
            </button>
          </div>
        }/>

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-[13px]"
        style={{background:"var(--acc-subtle)",border:"1.5px solid var(--acc-border)",color:"var(--tx-2)"}}>
        <Info size={15} className="mt-0.5 flex-shrink-0" style={{color:"var(--acc)"}}/>
        <span>Changes apply immediately. Dashboard access is always enabled. Admin role always has full access.</span>
      </div>

      {saved&&<Alert type="success" message="Permissions saved! Changes are now live for all users."/>}

      <div className="card overflow-hidden">
        {/* Header row */}
        <div className="grid" style={{gridTemplateColumns:`220px repeat(${ALL_ROLES.length},1fr)`,borderBottom:"1.5px solid var(--line-strong)",background:"var(--bg-raised)"}}>
          <div className="px-5 py-4 font-mono text-[10.5px] uppercase tracking-widest" style={{color:"var(--tx-3)"}}>Section</div>
          {ALL_ROLES.map(role=>(
            <div key={role} className="px-4 py-4 text-center" style={{borderLeft:"1px solid var(--line)"}}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wide"
                style={{background:`${ROLE_META[role].color}18`,color:ROLE_META[role].color,border:`1px solid ${ROLE_META[role].color}30`}}>
                {role==="admin"&&<Lock size={10}/>}{ROLE_META[role].label}
              </div>
              <p className="text-[10px] mt-1 font-mono" style={{color:"var(--tx-3)"}}>{ROLE_META[role].desc}</p>
            </div>
          ))}
        </div>

        {DEFAULT_NAV.map((nav,idx)=>(
          <div key={nav.href} className="grid transition-colors" style={{gridTemplateColumns:`220px repeat(${ALL_ROLES.length},1fr)`,borderBottom:idx<DEFAULT_NAV.length-1?"1px solid var(--line)":"none"}}
            onMouseOver={e=>(e.currentTarget as HTMLElement).style.background="var(--acc-subtle)"}
            onMouseOut={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
            <div className="px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[16px] flex-shrink-0"
                style={{background:"var(--acc-subtle)",border:"1px solid var(--acc-border)"}}>
                {nav.href==="/dashboard"?"⬡":nav.href==="/clients"?"👥":nav.href==="/projects"?"🏗":nav.href==="/tasks"?"✓":nav.href==="/workers"?"👷":nav.href==="/invoice-periods"?"⏱":"📄"}
              </div>
              <div>
                <p className="font-semibold text-[14px]" style={{color:"var(--tx)"}}>{nav.label}</p>
                <p className="font-mono text-[10px]" style={{color:"var(--tx-3)"}}>{nav.href}</p>
              </div>
            </div>
            {ALL_ROLES.map(role=>{
              const isChecked=(draft[role]??[]).includes(nav.href);
              const isLocked=role==="admin"||nav.href==="/dashboard";
              const c=ROLE_META[role].color;
              return(
                <div key={role} className="flex items-center justify-center px-4 py-4" style={{borderLeft:"1px solid var(--line)"}}>
                  <button onClick={()=>!isLocked&&toggle(role,nav.href)} disabled={isLocked}
                    className="relative w-11 h-6 rounded-full transition-all duration-200"
                    style={{background:isChecked?c:"var(--bg-sunken)",border:`1.5px solid ${isChecked?c:isLocked?"transparent":"var(--line-strong)"}`,cursor:isLocked?"not-allowed":"pointer",boxShadow:isChecked&&!isLocked?`0 2px 8px ${c}50`:"none",opacity:isLocked?0.7:1}}>
                    <span className="absolute top-0.5 rounded-full transition-all duration-200"
                      style={{width:20,height:20,background:isChecked?"#fff":c+"60",left:isChecked?"calc(100% - 22px)":2}}/>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ALL_ROLES.filter(r=>r!=="contractor").map(role=>{
          const c=ROLE_META[role].color;
          const allowed=(draft[role]??[]);
          return(
            <div key={role} className="card p-4" style={{borderTop:`3px solid ${c}`}}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-[12px] uppercase tracking-wide" style={{color:c}}>{ROLE_META[role].label}</span>
                <span className="badge text-[10px]" style={{background:`${c}18`,color:c}}>{allowed.length} routes</span>
              </div>
              <ul className="space-y-1">
                {DEFAULT_NAV.filter(n=>allowed.includes(n.href)).map(n=>(
                  <li key={n.href} className="flex items-center gap-1.5 text-[12px]" style={{color:"var(--tx-2)"}}>
                    <Check size={10} style={{color:c,flexShrink:0}}/>{n.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
