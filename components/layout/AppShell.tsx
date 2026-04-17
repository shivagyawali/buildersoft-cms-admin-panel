"use client";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Spinner } from "@/components/ui/UI";
import ThemeToggle from "@/components/ui/ThemeToggle";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { getNavForRole } = usePermissions();
  const pathname = usePathname();
  const router = useRouter();
  const isAuth = AUTH_ROUTES.includes(pathname);

  // Route guard: redirect if role doesn't have access
  useEffect(() => {
    if (loading || isAuth || !user) return;
    if (pathname.startsWith("/admin/roles") && user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    // Check if current path is in allowed nav
    const navHrefs = getNavForRole(user.role).map(n => n.href);
    const isAllowed =
      pathname === "/settings" ||
      pathname.startsWith("/admin") ||
      navHrefs.some(h => pathname === h || (h !== "/dashboard" && pathname.startsWith(h)));
    if (!isAllowed) {
      router.replace("/dashboard");
    }
  }, [pathname, user, loading, isAuth, getNavForRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20h20M6 20V10l6-7 6 7v10" />
            </svg>
          </div>
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  if (isAuth || !user) return <>{children}</>;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <main className="flex-1" style={{ paddingLeft: "var(--sidebar-w)" }}>
        {/* Topbar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-8 py-3"
          style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
            <span>Buildersoft</span>
            <span>/</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
              {pathname === "/dashboard" ? "Dashboard" :
               pathname.startsWith("/clients") ? "Clients" :
               pathname.startsWith("/projects") ? "Projects" :
               pathname.startsWith("/tasks") ? "Tasks" :
               pathname.startsWith("/workers") ? "Workers" :
               pathname.startsWith("/invoice-periods") ? "Pay Periods" :
               pathname.startsWith("/invoices") ? "Invoices" :
               pathname.startsWith("/admin/roles") ? "Roles & Permissions" :
               pathname.startsWith("/settings") ? "Settings" : ""}
            </span>
          </div>
          <ThemeToggle />
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
