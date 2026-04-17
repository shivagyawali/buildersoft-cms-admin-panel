"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { ALL_ROLES, DEFAULT_NAV, RolePermissionsMap } from "@/lib/permissions";
import { PageHeader, Alert } from "@/components/ui/UI";
import { ShieldCheck, RotateCcw, Save, Check, Info, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const ROLE_META: Record<string, { label: string; desc: string; color: string }> = {
  admin:      { label: "Admin",      desc: "Full system access",               color: "rgba(239,68,68,0.12)"   },
  manager:    { label: "Manager",    desc: "Manage projects, clients, billing", color: "rgba(249,115,22,0.12)"  },
  supervisor: { label: "Supervisor", desc: "Oversee projects and teams",        color: "rgba(59,130,246,0.12)"  },
  worker:     { label: "Worker",     desc: "Field worker, task access only",    color: "rgba(16,185,129,0.12)"  },
};

const ROLE_COLOR_TEXT: Record<string, string> = {
  admin: "#f87171", manager: "var(--brand-500)", supervisor: "#60a5fa", worker: "#34d399",
};

export default function AdminRolesPage() {
  const { user } = useAuth();
  const { permissions, updatePermissions, resetPermissions } = usePermissions();
  const router = useRouter();

  const [draft, setDraft] = useState<RolePermissionsMap>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(permissions)));
  }, [permissions]);

  if (!user || user.role !== "admin") return null;

  const toggle = (role: string, href: string) => {
    setDraft(prev => {
      const current = prev[role] ?? [];
      const next = current.includes(href)
        ? current.filter(h => h !== href)
        : [...current, href];
      // Dashboard always stays on
      const withDash = next.includes("/dashboard") ? next : ["/dashboard", ...next];
      return { ...prev, [role]: withDash };
    });
  };

  const handleSave = () => {
    updatePermissions(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetPermissions();
    setSaved(false);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(permissions);

  return (
    <div className="animate-fade-in max-w-5xl">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Control which navigation sections each role can access"
        action={
          <div className="flex items-center gap-2">
            <button
              className="btn btn-secondary flex items-center gap-2"
              onClick={handleReset}
              title="Reset to defaults"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save Changes</>}
            </button>
          </div>
        }
      />

      {/* Info banner */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
        style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.2)", color: "var(--text-secondary)" }}
      >
        <Info size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--brand-500)" }} />
        <span>
          Changes apply immediately for all users of that role. Dashboard access is always enabled.
          Admin role always retains full access and cannot be restricted.
        </span>
      </div>

      {saved && <Alert type="success" message="Permissions saved successfully! Changes are now live." />}

      {/* Permission matrix */}
      <div className="card overflow-hidden">
        {/* Header row */}
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `200px repeat(${ALL_ROLES.length}, 1fr)`,
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-sunken)",
          }}
        >
          <div className="px-5 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
            Navigation
          </div>
          {ALL_ROLES.map(role => (
            <div key={role} className="px-4 py-4 text-center" style={{ borderLeft: "1px solid var(--border-subtle)" }}>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                style={{ background: ROLE_META[role].color, color: ROLE_COLOR_TEXT[role] }}
              >
                {role === "admin" && <Lock size={10} />}
                {ROLE_META[role].label}
              </div>
              <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>{ROLE_META[role].desc}</p>
            </div>
          ))}
        </div>

        {/* Nav rows */}
        {DEFAULT_NAV.map((nav, idx) => (
          <div
            key={nav.href}
            className="grid"
            style={{
              gridTemplateColumns: `200px repeat(${ALL_ROLES.length}, 1fr)`,
              borderBottom: idx < DEFAULT_NAV.length - 1 ? "1px solid var(--border-subtle)" : "none",
              transition: "background 0.1s",
            }}
            onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-sunken)"}
            onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            {/* Nav label */}
            <div className="px-5 py-4 flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)" }}
              >
                <span style={{ fontSize: 12, color: "var(--brand-500)" }}>
                  {nav.href === "/dashboard" ? "⊞" :
                   nav.href === "/clients" ? "👥" :
                   nav.href === "/projects" ? "📁" :
                   nav.href === "/tasks" ? "✓" :
                   nav.href === "/workers" ? "⛑" :
                   nav.href === "/invoice-periods" ? "🕐" : "📄"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{nav.label}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{nav.href}</p>
              </div>
            </div>

            {/* Toggle per role */}
            {ALL_ROLES.map(role => {
              const isChecked = (draft[role] ?? []).includes(nav.href);
              const isLocked = role === "admin" || nav.href === "/dashboard";

              return (
                <div
                  key={role}
                  className="flex items-center justify-center px-4 py-4"
                  style={{ borderLeft: "1px solid var(--border-subtle)" }}
                >
                  <button
                    onClick={() => !isLocked && toggle(role, nav.href)}
                    disabled={isLocked}
                    className="relative w-10 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: isChecked
                        ? isLocked ? "rgba(249,115,22,0.4)" : "var(--brand-500)"
                        : "var(--bg-sunken)",
                      border: isChecked
                        ? "1px solid rgba(249,115,22,0.5)"
                        : "1px solid var(--border-default)",
                      cursor: isLocked ? "not-allowed" : "pointer",
                      boxShadow: isChecked && !isLocked ? "var(--shadow-brand)" : "none",
                    }}
                    title={isLocked ? `${nav.href === "/dashboard" ? "Dashboard" : "Admin"} access cannot be changed` : `Toggle ${nav.label} for ${role}`}
                  >
                    <span
                      className="absolute top-0.5 rounded-full transition-all duration-200"
                      style={{
                        width: 20,
                        height: 20,
                        background: isChecked ? "#fff" : "var(--text-tertiary)",
                        left: isChecked ? "calc(100% - 22px)" : 2,
                        opacity: isLocked ? 0.6 : 1,
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {ALL_ROLES.map(role => {
          const allowed = (draft[role] ?? []).filter(h => h !== "/dashboard");
          return (
            <div
              key={role}
              className="card p-4"
              style={{ borderTop: `3px solid ${ROLE_COLOR_TEXT[role]}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: ROLE_COLOR_TEXT[role] }}>
                  {ROLE_META[role].label}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: ROLE_META[role].color, color: ROLE_COLOR_TEXT[role] }}
                >
                  {(draft[role] ?? []).length} routes
                </span>
              </div>
              <ul className="space-y-1">
                {DEFAULT_NAV.filter(n => (draft[role] ?? []).includes(n.href)).map(n => (
                  <li key={n.href} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <Check size={10} style={{ color: ROLE_COLOR_TEXT[role], flexShrink: 0 }} />
                    {n.label}
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
