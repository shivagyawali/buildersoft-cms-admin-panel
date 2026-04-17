"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { HardHat, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getErrMsg } from "@/lib/utils";
import Cookies from "js-cookie";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", companyId: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setErr(""); setLoading(true);
    try {
      const res = await authApi.register({ ...form, companyId: form.companyId || undefined });
      const payload = res.data.data ?? res.data;
      Cookies.set("accessToken",  payload.accessToken,  { expires: 7 });
      Cookies.set("refreshToken", payload.refreshToken, { expires: 30 });
      router.push("/dashboard");
    } catch (error) { setErr(getErrMsg(error)); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative z-10" style={{ background: "var(--c0)" }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--am)", borderRadius: 2 }}>
            <HardHat size={16} color="#000" />
          </div>
          <div className="font-display font-bold text-[16px] uppercase tracking-[0.06em]" style={{ color: "var(--t1)" }}>BuilderSoft</div>
        </div>

        <div className="mb-8">
          <h1 className="font-display font-bold text-[28px] uppercase tracking-[0.05em] leading-none" style={{ color: "var(--t1)" }}>Register</h1>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] mt-2" style={{ color: "var(--t3)" }}>Create your account</p>
        </div>

        {err && (
          <div className="flex items-center gap-2 px-4 py-3 text-[12px] mb-5 font-mono"
            style={{ background: "var(--err-bg)", border: "1px solid rgba(192,57,43,0.3)", color: "var(--err)", borderRadius: 2 }}>
            <AlertCircle size={13} />{err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name</label>
              <input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John" required />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe" required />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={s("email")} placeholder="you@company.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={form.password} onChange={s("password")} placeholder="Min 8 characters" required />
          </div>
          <div>
            <label className="label">Company ID <span className="normal-case" style={{ color: "var(--t4)" }}>(optional)</span></label>
            <input className="input" value={form.companyId} onChange={s("companyId")} placeholder="Enter if you have one" />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
            {loading ? <div className="w-4 h-4 rounded-full animate-spin border-2 border-black/30 border-t-black" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[12.5px] mt-6 font-mono uppercase tracking-[0.1em]" style={{ color: "var(--t3)" }}>
          Have an account?{" "}
          <Link href="/auth/login" className="transition-colors" style={{ color: "var(--am)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
