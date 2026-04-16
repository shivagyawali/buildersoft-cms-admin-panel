"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { HardHat, Eye, EyeOff } from "lucide-react";
import { Spinner, Alert } from "@/components/ui/UI";
import Link from "next/link";

interface FormErrors { email?: string; password?: string; }

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!validate()) return;
    setLoading(true);
    try { await login(form.email, form.password); router.push("/dashboard"); }
    catch { setErr("Invalid email or password"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/50">
            <HardHat size={22} className="text-white" />
          </div>
          <h1 className="font-display font-700 text-white text-2xl">Buildersoft</h1>
          <p className="text-gray-600 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card p-6">
          {err && <Alert type="error" message={err} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={s("email")} placeholder="you@example.com" autoComplete="email" />
              {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} className="input pr-10" value={form.password} onChange={s("password")} placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {formErrors.password && <p className="text-xs text-red-400 mt-1">{formErrors.password}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading && <Spinner size="sm" />}Sign In
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account? <Link href="/auth/register" className="text-violet-400 hover:text-violet-300">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
