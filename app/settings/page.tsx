"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { PageHeader, Field, Spinner, Alert } from "@/components/ui/UI";
import { User, Lock, Shield, ExternalLink } from "lucide-react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { permissions } = usePermissions();
  const [profileForm, setProfileForm] = useState({ phone: user?.phone ?? "", company: user?.company ?? "" });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwFormErrors, setPwFormErrors] = useState<{ oldPassword?: string; newPassword?: string; confirmPassword?: string }>({});

  const sp = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setProfileForm(p => ({ ...p, [k]: e.target.value }));
  const sw = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => { setPwForm(p => ({ ...p, [k]: e.target.value })); setPwFormErrors(p => ({ ...p, [k]: undefined })); };

  const profileMut = useMutation({
    mutationFn: () => authApi.updateProfile(profileForm),
    onSuccess: () => { refreshUser(); setProfileMsg("Profile updated!"); setTimeout(() => setProfileMsg(""), 3000); },
  });

  const pwMut = useMutation({
    mutationFn: () => authApi.changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }),
    onSuccess: () => { setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); setPwMsg("Password changed!"); setTimeout(() => setPwMsg(""), 3000); },
    onError: (e: unknown) => { const err = e as { response?: { data?: { message?: string } } }; setPwErr(err?.response?.data?.message ?? "Failed to update password"); },
  });

  const validatePw = () => {
    const errs: Record<string, string> = {};
    if (!pwForm.oldPassword) errs.oldPassword = "Current password required";
    if (!pwForm.newPassword || pwForm.newPassword.length < 8) errs.newPassword = "At least 8 characters";
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setPwFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePwSubmit = (e: React.FormEvent) => { e.preventDefault(); setPwErr(""); if (!validatePw()) return; pwMut.mutate(); };

  if (!user) return null;

  const myAllowedRoutes = permissions[user.role] ?? [];
  const isAdmin = user.role === "admin";

  const card = { background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", borderRadius: 16, padding: 24, marginBottom: 16 } as const;

  const ROLE_COLOR: Record<string, string> = {
    admin: "#f87171", manager: "var(--brand-500)", supervisor: "#60a5fa", worker: "#34d399",
  };
  const roleColor = ROLE_COLOR[user.role] ?? "var(--brand-500)";

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Profile card */}
      <div style={card}>
        <div className="flex items-center gap-4 mb-6 pb-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", color: "var(--brand-500)" }}
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div>
            <p className="font-bold font-display text-base" style={{ color: "var(--text-primary)" }}>{user.firstName} {user.lastName}</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{user.email}</p>
            <span
              className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize"
              style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}30` }}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <User size={14} style={{ color: "var(--text-tertiary)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Edit Profile</span>
        </div>
        {profileMsg && <Alert type="success" message={profileMsg} />}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div><label className="label">First Name</label><input className="input opacity-50 cursor-not-allowed" value={user.firstName} readOnly /></div>
          <div><label className="label">Last Name</label><input className="input opacity-50 cursor-not-allowed" value={user.lastName} readOnly /></div>
          <div className="col-span-2"><label className="label">Email</label><input className="input opacity-50 cursor-not-allowed" value={user.email} readOnly /></div>
          <Field label="Phone"><input className="input" value={profileForm.phone} onChange={sp("phone")} placeholder="+1-555-0123" /></Field>
          <Field label="Company"><input className="input" value={profileForm.company} onChange={sp("company")} placeholder="Company name" /></Field>
        </div>
        <button className="btn btn-primary" onClick={() => profileMut.mutate()} disabled={profileMut.isPending}>
          {profileMut.isPending && <Spinner size="sm" />}Save Profile
        </button>
      </div>

      {/* Password card */}
      <div style={card}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={14} style={{ color: "var(--text-tertiary)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Change Password</span>
        </div>
        {pwMsg && <Alert type="success" message={pwMsg} />}
        {pwErr && <Alert type="error" message={pwErr} />}
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Field label="Current Password" error={pwFormErrors.oldPassword}><input type="password" className="input" value={pwForm.oldPassword} onChange={sw("oldPassword")} /></Field>
          <Field label="New Password" error={pwFormErrors.newPassword}><input type="password" className="input" value={pwForm.newPassword} onChange={sw("newPassword")} /></Field>
          <Field label="Confirm Password" error={pwFormErrors.confirmPassword}><input type="password" className="input" value={pwForm.confirmPassword} onChange={sw("confirmPassword")} /></Field>
          <button type="submit" className="btn btn-primary" disabled={pwMut.isPending}>
            {pwMut.isPending && <Spinner size="sm" />}Update Password
          </button>
        </form>
      </div>

      {/* My access card */}
      <div style={card}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shield size={14} style={{ color: "var(--text-tertiary)" }} />
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>My Access</span>
          </div>
          {isAdmin && (
            <Link href="/admin/roles" className="btn btn-secondary text-xs flex items-center gap-1.5">
              <ExternalLink size={12} />Manage All Roles
            </Link>
          )}
        </div>

        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: `${roleColor}08`, border: `1px solid ${roleColor}25` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide capitalize"
              style={{ background: `${roleColor}18`, color: roleColor }}
            >
              {user.role}
            </span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Your current role</span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
            You have access to <strong>{myAllowedRoutes.length}</strong> sections of the application.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {myAllowedRoutes.map(href => (
              <span
                key={href}
                className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                style={{ background: "var(--bg-sunken)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
              >
                {href === "/dashboard" ? "Dashboard" :
                 href === "/clients" ? "Clients" :
                 href === "/projects" ? "Projects" :
                 href === "/tasks" ? "Tasks" :
                 href === "/workers" ? "Workers" :
                 href === "/invoice-periods" ? "Pay Periods" :
                 href === "/invoices" ? "Invoices" : href}
              </span>
            ))}
          </div>
        </div>

        {isAdmin && (
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            As an admin, you can manage role permissions from the{" "}
            <Link href="/admin/roles" style={{ color: "var(--brand-500)" }} className="underline underline-offset-2">
              Roles & Permissions
            </Link>{" "}
            page.
          </p>
        )}
      </div>
    </div>
  );
}
