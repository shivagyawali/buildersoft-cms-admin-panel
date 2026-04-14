"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, Field, Spinner, Alert } from "@/components/ui/UI";
import { User, Lock } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ phone: user?.phone ?? "", company: user?.company ?? "" });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  const sp = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileForm((p) => ({ ...p, [k]: e.target.value }));
  const sw = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPwForm((p) => ({ ...p, [k]: e.target.value }));

  const profileMut = useMutation({
    mutationFn: () => authApi.updateProfile(profileForm),
    onSuccess: () => { refreshUser(); setProfileMsg("Profile updated successfully!"); setTimeout(() => setProfileMsg(""), 3000); },
  });

  const pwMut = useMutation({
    mutationFn: () => authApi.changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }),
    onSuccess: () => {
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg("Password changed successfully!"); setTimeout(() => setPwMsg(""), 3000);
    },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: { message?: string } } };
      setPwErr(err?.response?.data?.message ?? "Failed to update password");
    },
  });

  const handlePwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr("");
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwErr("Passwords do not match"); return; }
    pwMut.mutate();
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account" />

      {/* Profile */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-stone-100">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-xl font-semibold text-amber-700 flex-shrink-0">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div>
            <p className="font-semibold text-stone-900">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-stone-400">{user.email}</p>
            <p className="text-xs text-stone-400 capitalize mt-0.5">{user.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <User size={15} className="text-stone-400" />
          <span className="font-semibold text-stone-800 text-sm">Edit Profile</span>
        </div>

        {profileMsg && <Alert type="success" message={profileMsg} />}

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="label">First Name</label>
            <input className="input opacity-60 cursor-not-allowed" value={user.firstName} readOnly />
          </div>
          <div>
            <label className="label">Last Name</label>
            <input className="input opacity-60 cursor-not-allowed" value={user.lastName} readOnly />
          </div>
          <div className="col-span-2">
            <label className="label">Email</label>
            <input className="input opacity-60 cursor-not-allowed" value={user.email} readOnly />
          </div>
          <Field label="Phone">
            <input className="input" value={profileForm.phone} onChange={sp("phone")} placeholder="+1-555-0123" />
          </Field>
          <Field label="Company">
            <input className="input" value={profileForm.company} onChange={sp("company")} placeholder="Company name" />
          </Field>
        </div>
        <button className="btn btn-primary" onClick={() => profileMut.mutate()} disabled={profileMut.isPending}>
          {profileMut.isPending && <Spinner size="sm" />}Save Profile
        </button>
      </div>

      {/* Password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={15} className="text-stone-400" />
          <span className="font-semibold text-stone-800 text-sm">Change Password</span>
        </div>

        {pwMsg && <Alert type="success" message={pwMsg} />}
        {pwErr && <Alert type="error" message={pwErr} />}

        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Field label="Current Password"><input type="password" className="input" value={pwForm.oldPassword} onChange={sw("oldPassword")} required /></Field>
          <Field label="New Password"><input type="password" className="input" value={pwForm.newPassword} onChange={sw("newPassword")} required minLength={8} /></Field>
          <Field label="Confirm New Password"><input type="password" className="input" value={pwForm.confirmPassword} onChange={sw("confirmPassword")} required /></Field>
          <button type="submit" className="btn btn-primary" disabled={pwMut.isPending}>
            {pwMut.isPending && <Spinner size="sm" />}Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
