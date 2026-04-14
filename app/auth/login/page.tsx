"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { HardHat, Eye, EyeOff } from "lucide-react";
import { Alert, Spinner } from "@/components/ui/UI";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-stone-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center">
            <HardHat size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display text-white text-lg leading-none">Buildersoft</p>
            <p className="text-[10px] text-stone-500 tracking-widest uppercase mt-0.5">
              Construction CMS
            </p>
          </div>
        </div>

        <div>
          <p className="font-display text-4xl text-white leading-snug mb-4">
            "Built for contractors
            <br />
            <span className="text-amber-500">who build things."</span>
          </p>
          <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
            Manage clients, track projects, handle invoicing — all in one clean
            interface designed for construction businesses.
          </p>
        </div>

        <div className="flex gap-10">
          {[
            ["500+", "Projects tracked"],
            ["99%", "Uptime"],
            ["2 min", "Setup time"],
          ].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="font-display text-2xl text-amber-500">{val}</p>
              <p className="text-xs text-stone-600 mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
              <HardHat size={16} className="text-white" />
            </div>
            <span className="font-display text-lg">Buildersoft</span>
          </div>

          <h1 className="font-display text-3xl text-stone-900 mb-1">Welcome back</h1>
          <p className="text-stone-400 text-sm mb-8">Sign in to your workspace</p>

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-2.5"
            >
              {loading ? <Spinner size="sm" /> : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-stone-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-amber-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
