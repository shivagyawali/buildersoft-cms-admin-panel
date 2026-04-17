"use client";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { Spinner } from "@/components/ui/UI";
import ThemeToggle from "@/components/ui/ThemeToggle";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20h20M6 20V10l6-7 6 7v10"/>
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
        {/* Top bar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-end px-8 py-3"
          style={{
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <ThemeToggle />
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
