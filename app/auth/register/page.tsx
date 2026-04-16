"use client";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { HardHat, Eye, EyeOff } from "lucide-react";
import { Spinner, Alert } from "@/components/ui/UI";
import Link from "next/link";
import { getErrMsg } from "@/lib/utils";

const ROLES = ["admin", "manager", "supervisor", "worker"];
interface FormErrors { firstName?: string; lastName?: string; email?: string; password?: string; role?: string; }

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "worker" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setFormErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = "First name required";
    if (!form.lastName.trim()) errs.lastName = "Last name required";
    if (!form.email.trim()) errs.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password || form.password.length < 8) errs.password = "At least 8 characters";
    if (!form.role) errs.role = "Select a role";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!validate()) return;
    setLoading(true);
    try { await authApi.register(form); router.push("/auth/login?registered=1"); }
    catch (e) { setErr(getErrMsg(e)); }
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
          <p className="text-gray-600 text-sm mt-1">Create your account</p>
        </div>

        <div className="card p-6">
          {err && <Alert type="error" message={err} />}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John" />
                {formErrors.firstName && <p className="text-xs text-red-400 mt-1">{formErrors.firstName}</p>}
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe" />
                {formErrors.lastName && <p className="text-xs text-red-400 mt-1">{formErrors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={s("email")} placeholder="you@example.com" />
              {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} className="input pr-10" value={form.password} onChange={s("password")} placeholder="Min 8 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {formErrors.password && <p className="text-xs text-red-400 mt-1">{formErrors.password}</p>}
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={s("role")}>
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              {formErrors.role && <p className="text-xs text-red-400 mt-1">{formErrors.role}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading && <Spinner size="sm" />}Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <Link href="/auth/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
