"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare,
  FileText, LogOut, HardHat, Settings, Clock, ChevronRight,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard",       label: "Dashboard",   icon: LayoutDashboard },
  { href: "/clients",         label: "Clients",     icon: Users },
  { href: "/projects",        label: "Projects",    icon: FolderKanban },
  { href: "/tasks",           label: "Tasks",       icon: CheckSquare },
  { href: "/workers",         label: "Workers",     icon: HardHat },
  { href: "/invoice-periods", label: "Pay Periods", icon: Clock },
  { href: "/invoices",        label: "Invoices",    icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{
        width: "var(--sidebar-w)",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
              boxShadow: "0 4px 12px rgba(249,115,22,0.35)",
            }}
          >
            <HardHat size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-orange-100 leading-tight tracking-tight">
              Buildersoft
            </div>
            <div className="text-[9px] tracking-widest uppercase font-medium" style={{ color: "rgba(240,235,224,0.3)" }}>
              Construction CMS
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="text-[9px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: "rgba(240,235,224,0.25)" }}>
          Main Menu
        </p>

        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={clsx("sidebar-link", active && "active")}>
              <Icon size={15} style={{ color: active ? "var(--brand-400)" : "rgba(240,235,224,0.3)", flexShrink: 0 }} />
              <span>{label}</span>
              {active && <ChevronRight size={12} className="ml-auto" style={{ color: "var(--brand-400)" }} />}
            </Link>
          );
        })}

        <div className="pt-4 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[9px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: "rgba(240,235,224,0.25)" }}>
            Account
          </p>
          <Link
            href="/settings"
            className={clsx("sidebar-link", pathname === "/settings" && "active")}
          >
            <Settings size={15} style={{ color: pathname === "/settings" ? "var(--brand-400)" : "rgba(240,235,224,0.3)" }} />
            <span>Settings</span>
            {pathname === "/settings" && <ChevronRight size={12} className="ml-auto" style={{ color: "var(--brand-400)" }} />}
          </Link>
        </div>
      </nav>

      {/* User Footer */}
      {user && (
        <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "rgba(249,115,22,0.2)",
                border: "1px solid rgba(249,115,22,0.3)",
                color: "var(--brand-300)",
              }}
            >
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "rgba(240,235,224,0.8)" }}>
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] capitalize truncate" style={{ color: "rgba(240,235,224,0.35)" }}>
                {user.role}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "rgba(240,235,224,0.3)" }}
              onMouseOver={e => (e.currentTarget.style.color = "#f87171")}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(240,235,224,0.3)")}
              title="Logout"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
