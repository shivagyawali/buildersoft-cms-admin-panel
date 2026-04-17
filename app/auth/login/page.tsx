"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { HardHat, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (error: any) {
      setErr(error?.response?.data?.message ?? "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex relative z-10" style={{ background: "var(--c0)" }}>
      {/* Left panel - brand */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[420px] flex-shrink-0"
        style={{ background: "var(--c1)", borderRight: "1px solid var(--ln)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--am)", borderRadius: 2 }}>
            <HardHat size={16} color="#000" />
          </div>
          <div>
            <div className="font-display font-bold text-[16px] uppercase tracking-[0.06em]" style={{ color: "var(--t1)" }}>BuilderSoft</div>
            <div className="font-mono text-[8.5px] uppercase tracking-[0.16em]" style={{ color: "var(--t3)" }}>Construction CMS</div>
          </div>
        </div>

        <div>
          <div className="w-12 h-[2px] mb-6" style={{ background: "var(--am)" }} />
          <h2 className="font-display font-bold text-[36px] uppercase tracking-[0.03em] leading-none mb-4" style={{ color: "var(--t1)" }}>
            Multi-Tenant<br />Construction<br />Management
          </h2>
          <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--t2)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            Projects · Clients · Workers<br />
            Invoices · Pay Periods · Teams
          </p>
        </div>

        <div className="space-y-3">
          {[
            { role: "SuperAdmin",  desc: "Platform-wide oversight" },
            { role: "Admin",       desc: "Full company access" },
            { role: "Manager",     desc: "Projects & billing" },
            { role: "Supervisor",  desc: "Field oversight" },
            { role: "Worker",      desc: "Task access" },
          ].map(({ role, desc }) => (
            <div key={role} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 flex-shrink-0" style={{ background: "var(--am)", borderRadius: "50%" }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--t2)" }}>
                <span style={{ color: "var(--am)" }}>{role}</span> — {desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--am)", borderRadius: 2 }}>
              <HardHat size={16} color="#000" />
            </div>
            <div className="font-display font-bold text-[16px] uppercase tracking-[0.06em]" style={{ color: "var(--t1)" }}>BuilderSoft</div>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-bold text-[28px] uppercase tracking-[0.05em] leading-none" style={{ color: "var(--t1)" }}>Sign In</h1>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] mt-2" style={{ color: "var(--t3)" }}>
              Access your workspace
            </p>
          </div>

          {err && (
            <div className="flex items-center gap-2 px-4 py-3 text-[12px] mb-5 font-mono"
              style={{ background: "var(--err-bg)", border: "1px solid rgba(192,57,43,0.3)", color: "var(--err)", borderRadius: 2 }}>
              <AlertCircle size={13} />{err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email" className="input"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@company.com"
                required autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} className="input pr-10"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--t3)" }}
                  onClick={() => setShowPw(v => !v)}
                  onMouseOver={e => (e.currentTarget.style.color = "var(--am)")}
                  onMouseOut={e => (e.currentTarget.style.color = "var(--t3)")}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button
              type="submit" className="btn btn-primary w-full justify-center"
              disabled={loading} style={{ width: "100%", marginTop: 8 }}
            >
              {loading
                ? <div className="w-4 h-4 rounded-full animate-spin border-2 border-black/30 border-t-black" />
                : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[12.5px] mt-6 font-mono uppercase tracking-[0.1em]" style={{ color: "var(--t3)" }}>
            No account?{" "}
            <Link href="/auth/register" className="transition-colors" style={{ color: "var(--am)" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--am2)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--am)")}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
