"use client";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { Spinner } from "@/components/ui/UI";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f11]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuth || !user) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#0f0f11]">
      <Sidebar />
      <main className="flex-1 pl-[220px]">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
