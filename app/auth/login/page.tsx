"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, AlertCircle, HardHat, Hammer, Wrench, Truck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try { await login(form.email, form.password); router.push("/dashboard"); }
    catch (error: any) { setErr(error?.response?.data?.message ?? "Invalid credentials"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)", fontFamily: "var(--font-sans)" }}>
      {/* LEFT PANEL — Construction art */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[520px] flex-shrink-0 relative overflow-hidden"
        style={{ background: "#0d1117" }}
      >
        {/* Grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        {/* Hazard stripes at top */}
        <div className="absolute top-0 left-0 right-0 h-2" style={{
          background: "repeating-linear-gradient(90deg, #f97316 0px, #f97316 24px, #1a1208 24px, #1a1208 48px)"
        }} />

        {/* Large construction icon */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-5">
          <HardHat size={320} color="#f97316" />
        </div>

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#f97316" }}>
              <HardHat size={24} color="#fff" />
            </div>
            <div>
              <div className="font-display text-[28px] leading-none tracking-wider text-white">BuilderSoft</div>
              <div className="font-mono text-[9px] tracking-[0.2em] mt-0.5" style={{ color: "rgba(249,115,22,0.6)" }}>CONSTRUCTION MANAGEMENT</div>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div style={{ width: 32, height: 3, background: "#f97316", borderRadius: 99 }} />
            <div style={{ width: 16, height: 3, background: "rgba(249,115,22,0.4)", borderRadius: 99 }} />
          </div>
          <h2 className="font-display text-[52px] leading-none tracking-wider text-white mb-4">
            BUILD.<br/>TRACK.<br/>DELIVER.
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)" }}>
            Full-stack construction management.<br/>
            Multi-tenant. Role-based access.<br/>
            Real-time project oversight.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {[
            { icon: <HardHat size={12} />, label: "Workers" },
            { icon: <Hammer size={12} />, label: "Projects" },
            { icon: <Wrench size={12} />, label: "Tasks" },
            { icon: <Truck size={12} />, label: "Invoices" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#f97316" }}>
              {icon}{label}
            </div>
          ))}
        </div>

        {/* Bottom hazard stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{
          background: "repeating-linear-gradient(90deg, #f97316 0px, #f97316 24px, #1a1208 24px, #1a1208 48px)"
        }} />
      </div>

      {/* RIGHT PANEL — Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--acc)" }}>
              <HardHat size={20} color="#fff" />
            </div>
            <div className="font-display text-[24px] tracking-wider" style={{ color: "var(--tx)" }}>BuilderSoft</div>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-[40px] leading-none tracking-wider mb-2" style={{ color: "var(--tx)" }}>
              SIGN IN
            </h1>
            <p className="text-[14px]" style={{ color: "var(--tx-2)" }}>Access your construction command center</p>
          </div>

          {err && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] mb-5"
              style={{ background: "var(--err-bg)", border: "1.5px solid rgba(220,38,38,0.3)", color: "var(--err)" }}>
              <AlertCircle size={14} />{err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" className="input" required autoComplete="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} className="input pr-12" required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                  style={{ color: "var(--tx-3)" }}
                  onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading} style={{ width: "100%", paddingTop: 12, paddingBottom: 12 }}>
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "spin 0.75s linear infinite" }} />
              ) : (
                <>
                  <HardHat size={16} />
                  Sign In to BuilderSoft
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] mt-6" style={{ color: "var(--tx-3)" }}>
            New to BuilderSoft?{" "}
            <Link href="/auth/register" style={{ color: "var(--acc)", fontWeight: 600 }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
