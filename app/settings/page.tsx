"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, Field, Spinner, Alert } from "@/components/ui/UI";
import { User, Lock, Shield, HardHat } from "lucide-react";
import { getInitials } from "@/lib/utils";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin:      ["Full access to all features", "User management", "Delete any record", "View all data", "Manage roles"],
  manager:    ["View & edit all projects", "Manage clients & invoices", "Assign workers", "View reports"],
  supervisor: ["View & edit assigned projects", "Manage tasks", "Assign workers to tasks"],
  worker:     ["View assigned tasks", "Update task progress", "View own schedule"],
};

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ phone: user?.phone ?? "", company: user?.company ?? "" });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwFormErrors, setPwFormErrors] = useState<{ oldPassword?: string; newPassword?: string; confirmPassword?: string }>({});

  const sp = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setProfileForm((p) => ({ ...p, [k]: e.target.value }));
  const sw = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => { setPwForm((p) => ({ ...p, [k]: e.target.value })); setPwFormErrors((p) => ({ ...p, [k]: undefined })); };

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
    const errs: any = {};
    if (!pwForm.oldPassword) errs.oldPassword = "Current password required";
    if (!pwForm.newPassword || pwForm.newPassword.length < 8) errs.newPassword = "At least 8 characters";
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setPwFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePwSubmit = (e: React.FormEvent) => { e.preventDefault(); setPwErr(""); if (!validatePw()) return; pwMut.mutate(); };

  if (!user) return null;
  const permissions = ROLE_PERMISSIONS[user.role] ?? ROLE_PERMISSIONS.worker;

  const sectionStyle = { background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", borderRadius: 16, padding: "24px", marginBottom: 16 };

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Profile */}
      <div style={sectionStyle}>
        <div className="flex items-center gap-4 mb-6 pb-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "var(--brand-500)" }}
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div>
            <p className="font-bold font-display" style={{ color: "var(--text-primary)" }}>{user.firstName} {user.lastName}</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{user.email}</p>
            <span
              className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
              style={{ background: "rgba(249,115,22,0.12)", color: "var(--brand-600)" }}
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

      {/* Password */}
      <div style={sectionStyle}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={14} style={{ color: "var(--text-tertiary)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Change Password</span>
        </div>
        {pwMsg && <Alert type="success" message={pwMsg} />}
        {pwErr && <Alert type="error" message={pwErr} />}
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Field label="Current Password" error={pwFormErrors.oldPassword}><input type="password" className="input" value={pwForm.oldPassword} onChange={sw("oldPassword")} /></Field>
          <Field label="New Password" error={pwFormErrors.newPassword}><input type="password" className="input" value={pwForm.newPassword} onChange={sw("newPassword")} /></Field>
          <Field label="Confirm New Password" error={pwFormErrors.confirmPassword}><input type="password" className="input" value={pwForm.confirmPassword} onChange={sw("confirmPassword")} /></Field>
          <button type="submit" className="btn btn-primary" disabled={pwMut.isPending}>
            {pwMut.isPending && <Spinner size="sm" />}Update Password
          </button>
        </form>
      </div>

      {/* Roles & Permissions */}
      <div style={sectionStyle}>
        <div className="flex items-center gap-2 mb-5">
          <Shield size={14} style={{ color: "var(--text-tertiary)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Roles & Permissions</span>
        </div>
        <div className="space-y-3">
          {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => {
            const isActive = user.role === role;
            return (
              <div
                key={role}
                className="rounded-xl p-4 transition-all"
                style={{
                  border: isActive ? "1px solid rgba(249,115,22,0.3)" : "1px solid var(--border-subtle)",
                  background: isActive ? "rgba(249,115,22,0.06)" : "var(--bg-sunken)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                    style={isActive
                      ? { background: "var(--brand-500)", color: "#fff" }
                      : { background: "var(--border-default)", color: "var(--text-tertiary)" }
                    }
                  >{role}</span>
                  {isActive && <span className="text-xs" style={{ color: "var(--brand-500)" }}>← Your role</span>}
                </div>
                <ul className="space-y-1">
                  {perms.map((p) => (
                    <li key={p} className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <div className="w-1 h-1 rounded-full" style={{ background: isActive ? "var(--brand-400)" : "var(--border-default)" }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
