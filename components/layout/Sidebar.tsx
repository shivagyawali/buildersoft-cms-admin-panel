"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare,
  FileText, LogOut, HardHat, Settings, Clock, ChevronRight, ShieldCheck,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import clsx from "clsx";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, FolderKanban, CheckSquare,
  FileText, HardHat, Clock, Settings,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { getNavForRole } = usePermissions();

  const navItems = user ? getNavForRole(user.role) : [];
  const isAdmin = user?.role === "admin";

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{ width: "var(--sidebar-w)", background: "var(--bg-sidebar)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))", boxShadow: "0 4px 12px rgba(249,115,22,0.35)" }}
          >
            <HardHat size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm leading-tight tracking-tight" style={{ color: "rgba(240,235,224,0.95)" }}>
              Buildersoft
            </div>
            <div className="text-[9px] tracking-widest uppercase font-medium" style={{ color: "rgba(240,235,224,0.3)" }}>
              Construction CMS
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: "rgba(240,235,224,0.25)" }}>
          Main Menu
        </p>
        <ul className="space-y-0.5 mb-4">
          {navItems.map(({ href, label, icon }) => {
            const Icon = ICON_MAP[icon] ?? LayoutDashboard;
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link href={href} className={clsx("sidebar-link", active && "active")}>
                  <Icon size={15} style={{ color: active ? "var(--brand-400)" : "rgba(240,235,224,0.35)", flexShrink: 0 }} />
                  <span>{label}</span>
                  {active && <ChevronRight size={12} className="ml-auto" style={{ color: "var(--brand-400)" }} />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Admin section */}
        <div className="pt-3 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[9px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: "rgba(240,235,224,0.25)" }}>
            Account
          </p>
          <ul className="space-y-0.5">
            {isAdmin && (
              <li>
                <Link href="/admin/roles" className={clsx("sidebar-link", pathname.startsWith("/admin/roles") && "active")}>
                  <ShieldCheck size={15} style={{ color: pathname.startsWith("/admin/roles") ? "var(--brand-400)" : "rgba(240,235,224,0.35)", flexShrink: 0 }} />
                  <span>Roles & Permissions</span>
                  {pathname.startsWith("/admin/roles") && <ChevronRight size={12} className="ml-auto" style={{ color: "var(--brand-400)" }} />}
                </Link>
              </li>
            )}
            <li>
              <Link href="/settings" className={clsx("sidebar-link", pathname === "/settings" && "active")}>
                <Settings size={15} style={{ color: pathname === "/settings" ? "var(--brand-400)" : "rgba(240,235,224,0.35)", flexShrink: 0 }} />
                <span>Settings</span>
                {pathname === "/settings" && <ChevronRight size={12} className="ml-auto" style={{ color: "var(--brand-400)" }} />}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* User footer */}
      {user && (
        <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.3)", color: "var(--brand-300)" }}
            >
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "rgba(240,235,224,0.85)" }}>
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
