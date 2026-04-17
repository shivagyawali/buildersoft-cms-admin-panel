"use client";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import TopNav from "./TopNav";
import { Spinner } from "@/components/ui/UI";
import { HardHat } from "lucide-react";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isSuperAdmin } = useAuth();
  const { getNavForRole } = usePermissions();
  const pathname = usePathname();
  const router   = useRouter();
  const isAuth   = AUTH_ROUTES.some(r => pathname.startsWith(r));

  useEffect(() => {
    if (loading || isAuth || !user) return;
    if (isSuperAdmin) {
      const allowed = ["/superadmin", "/companies", "/settings"];
      if (!allowed.some(r => pathname === r || pathname.startsWith(r + "/"))) router.replace("/superadmin");
      return;
    }
    if (pathname.startsWith("/admin") && user.role !== "admin") { router.replace("/dashboard"); return; }
    const navHrefs = getNavForRole(user.role).map(n => n.href);
    const ok = pathname === "/settings" || pathname.startsWith("/admin") ||
      navHrefs.some(h => pathname === h || (h !== "/dashboard" && pathname.startsWith(h)));
    if (!ok) router.replace("/dashboard");
  }, [pathname, user, loading, isAuth, getNavForRole, router, isSuperAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse-slow"
            style={{ background: "var(--acc-subtle)", border: "2px solid var(--acc-border)" }}
          >
            <HardHat size={32} style={{ color: "var(--acc)" }} />
          </div>
          <Spinner size="lg" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--tx-3)" }}>
            Loading BuilderSoft…
          </p>
        </div>
      </div>
    );
  }

  if (isAuth || !user) return <>{children}</>;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <TopNav />
      <main
        className="relative z-10"
        style={{ paddingTop: "calc(var(--topbar-h) + 3px)", minHeight: "100vh" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
