"use client";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Spinner } from "@/components/ui/UI";
import { HardHat } from "lucide-react";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

const BREADCRUMB: Record<string, string> = {
  "/dashboard": "Dashboard", "/clients": "Clients", "/projects": "Projects",
  "/tasks": "Tasks", "/workers": "Workers", "/invoice-periods": "Pay Periods",
  "/invoices": "Invoices", "/settings": "Settings", "/admin/roles": "Roles & Permissions",
  "/admin/users": "Team Members", "/superadmin": "Platform Overview",
  "/companies": "Companies", "/superadmin/users": "All Users",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isSuperAdmin } = useAuth();
  const { getNavForRole } = usePermissions();
  const pathname = usePathname();
  const router   = useRouter();
  const isAuth   = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading || isAuth || !user) return;

    // Superadmin routes
    if (isSuperAdmin) {
      const allowed = ["/superadmin", "/companies", "/superadmin/users", "/settings"];
      if (!allowed.some(r => pathname === r || pathname.startsWith(r))) {
        router.replace("/superadmin");
      }
      return;
    }

    // Admin-only pages
    if (pathname.startsWith("/admin") && user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    // Check nav permissions
    const navHrefs = getNavForRole(user.role).map(n => n.href);
    const isAllowed =
      pathname === "/settings" ||
      pathname.startsWith("/admin") ||
      navHrefs.some(h => pathname === h || (h !== "/dashboard" && pathname.startsWith(h)));

    if (!isAllowed) router.replace("/dashboard");
  }, [pathname, user, loading, isAuth, getNavForRole, router, isSuperAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10" style={{ background: "var(--c0)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center" style={{ background: "var(--am)", borderRadius: 2 }}>
            <HardHat size={20} color="#000" />
          </div>
          <Spinner size="md" />
          <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--t3)" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (isAuth || !user) return <>{children}</>;

  // Breadcrumb label
  const crumb = Object.entries(BREADCRUMB).find(([k]) =>
    pathname === k || pathname.startsWith(k + "/")
  )?.[1] ?? "";

  return (
    <div className="flex min-h-screen relative z-10" style={{ background: "var(--c0)" }}>
      <Sidebar />
      <main className="flex-1" style={{ paddingLeft: "var(--sidebar-w)" }}>
        {/* Topbar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-8 py-3.5"
          style={{ background: "var(--c1)", borderBottom: "1px solid var(--ln)", height: 52 }}
        >
          <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <span style={{ color: "var(--t4)" }}>BuilderSoft</span>
            <span style={{ color: "var(--t4)" }}>/</span>
            <span style={{ color: "var(--t1)", fontWeight: 600 }}>{crumb}</span>
          </div>
          <div className="flex items-center gap-3">
            {user.companyId && (
              <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] px-2.5 py-1 hidden sm:block"
                style={{ background: "var(--am3)", color: "var(--am)", borderRadius: 2, border: "1px solid rgba(232,160,32,0.2)" }}>
                Company Scope
              </div>
            )}
            {isSuperAdmin && (
              <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] px-2.5 py-1"
                style={{ background: "var(--violet-bg)", color: "var(--violet)", borderRadius: 2, border: "1px solid rgba(142,107,191,0.25)" }}>
                Superadmin
              </div>
            )}
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
