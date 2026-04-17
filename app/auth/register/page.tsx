"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { HardHat, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" ,role:"worker"});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setErr("Passwords do not match"); return; }
    if (form.password.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setErr(""); setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password,form.role);
      router.push("/dashboard");
    } catch (error: any) {
      setErr(error?.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-base)" }}>
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))", boxShadow: "0 8px 24px rgba(249,115,22,0.35)" }}>
            <HardHat size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>Buildersoft</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Construction Management System</p>
        </div>

        <div className="rounded-2xl p-8"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-md)" }}>
          <h2 className="font-bold text-lg mb-1 font-display" style={{ color: "var(--text-primary)" }}>Create account</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>Get started with Buildersoft today</p>

          {err && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <AlertCircle size={14} />{err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <input className="input" value={form.firstName} onChange={f("firstName")} placeholder="John" required />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input" value={form.lastName} onChange={f("lastName")} placeholder="Doe" required />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={f("email")} placeholder="you@company.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} className="input pr-10" value={form.password} onChange={f("password")} placeholder="Min. 8 characters" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" className="input" value={form.confirmPassword} onChange={f("confirmPassword")} placeholder="Re-enter password" required />
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center mt-2" disabled={loading} style={{ width: "100%" }}>
              {loading ? <div className="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white" /> : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: "var(--text-tertiary)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium" style={{ color: "var(--brand-500)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
