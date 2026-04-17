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
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", password:"", companyId:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement>)=>setForm(p=>({...p,[k]:e.target.value}));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setErr(""); setLoading(true);
    try {
      const res = await authApi.register({ ...form, companyId: form.companyId || undefined });
      const payload = res.data.data ?? res.data;
      Cookies.set("accessToken", payload.accessToken, { expires: 7 });
      Cookies.set("refreshToken", payload.refreshToken, { expires: 30 });
      router.push("/dashboard");
    } catch (error) { setErr(getErrMsg(error)); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{background:"var(--bg)"}}>
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"var(--acc)"}}><HardHat size={20} color="#fff"/></div>
          <div className="font-display text-[24px] tracking-wider" style={{color:"var(--tx)"}}>BuilderSoft</div>
        </div>
        <div className="mb-8"><h1 className="font-display text-[38px] leading-none tracking-wider mb-2" style={{color:"var(--tx)"}}>REGISTER</h1><p className="text-[14px]" style={{color:"var(--tx-2)"}}>Create your BuilderSoft account</p></div>
        {err&&<div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] mb-5" style={{background:"var(--err-bg)",border:"1.5px solid rgba(220,38,38,0.3)",color:"var(--err)"}}><AlertCircle size={14}/>{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">First Name</label><input className="input" value={form.firstName} onChange={s("firstName")} placeholder="John" required/></div>
            <div><label className="label">Last Name</label><input className="input" value={form.lastName} onChange={s("lastName")} placeholder="Doe" required/></div>
          </div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={s("email")} placeholder="you@company.com" required/></div>
          <div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={s("password")} placeholder="Min 8 characters" required/></div>
          <div><label className="label">Company ID <span style={{color:"var(--tx-3)",textTransform:"none",fontSize:10}}>(optional)</span></label><input className="input" value={form.companyId} onChange={s("companyId")} placeholder="Enter if you have one"/></div>
          <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading} style={{width:"100%",paddingTop:12,paddingBottom:12}}>{loading?<div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" style={{animation:"spin 0.75s linear infinite"}}/>:<><HardHat size={16}/>Create Account</>}</button>
        </form>
        <p className="text-center text-[13px] mt-6" style={{color:"var(--tx-3)"}}>Have an account? <Link href="/auth/login" style={{color:"var(--acc)",fontWeight:600}}>Sign in</Link></p>
      </div>
    </div>
  );
}
