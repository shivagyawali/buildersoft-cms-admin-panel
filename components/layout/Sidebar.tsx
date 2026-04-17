"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, FileText,
  LogOut, HardHat, Settings, Clock, ShieldCheck, Building2, Globe,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import clsx from "clsx";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, FolderKanban, CheckSquare,
  FileText, HardHat, Clock, Settings, Building2, Globe,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const { getNavForRole } = usePermissions();

  const navItems = user ? getNavForRole(user.role) : [];

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && href !== "/superadmin" && pathname.startsWith(href));

  const ROLE_COLORS: Record<string, string> = {
    superadmin: "var(--violet)", admin: "var(--err)", manager: "var(--am)",
    supervisor: "var(--bl)", worker: "var(--ok)", contractor: "var(--muted)",
  };
  const roleColor = ROLE_COLORS[user?.role ?? ""] ?? "var(--am)";

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{ width: "var(--sidebar-w)", background: "var(--c1)", borderRight: "1px solid var(--ln)" }}
    >
      {/* Amber accent line */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[2px] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--am) 30%, var(--am) 70%, transparent)", opacity: 0.25 }}
      />

      {/* Brand */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid var(--ln)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--am)", borderRadius: 2, boxShadow: "0 4px 16px rgba(232,160,32,0.3)" }}
          >
            <HardHat size={16} color="#000" />
          </div>
          <div>
            <div className="font-display font-bold text-[16px] uppercase tracking-[0.06em] leading-none" style={{ color: "var(--t1)" }}>
              BuilderSoft
            </div>
            <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] mt-1" style={{ color: "var(--t3)" }}>
              {isSuperAdmin ? "Platform Admin" : "Construction CMS"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {isSuperAdmin && (
          <>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] px-3 mb-2" style={{ color: "var(--t4)" }}>
              Platform
            </p>
            <ul className="space-y-0.5 mb-4">
              {navItems.map(({ href, label, icon }) => {
                const Icon = ICON_MAP[icon] ?? LayoutDashboard;
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link href={href} className={clsx("sidebar-link", active && "active")}>
                      <Icon size={14} style={{ color: active ? "var(--am)" : "var(--t3)", flexShrink: 0 }} />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {!isSuperAdmin && (
          <>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] px-3 mb-2" style={{ color: "var(--t4)" }}>
              Main
            </p>
            <ul className="space-y-0.5 mb-4">
              {navItems.map(({ href, label, icon }) => {
                const Icon = ICON_MAP[icon] ?? LayoutDashboard;
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link href={href} className={clsx("sidebar-link", active && "active")}>
                      <Icon size={14} style={{ color: active ? "var(--am)" : "var(--t3)", flexShrink: 0 }} />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Account section */}
        <div className="pt-3 mt-1" style={{ borderTop: "1px solid var(--ln)" }}>
          <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] px-3 mb-2" style={{ color: "var(--t4)" }}>
            Account
          </p>
          <ul className="space-y-0.5">
            {isAdmin && !isSuperAdmin && (
              <li>
                <Link href="/admin/roles" className={clsx("sidebar-link", pathname.startsWith("/admin/roles") && "active")}>
                  <ShieldCheck size={14} style={{ color: pathname.startsWith("/admin/roles") ? "var(--am)" : "var(--t3)", flexShrink: 0 }} />
                  <span>Roles & Permissions</span>
                </Link>
              </li>
            )}
            {isAdmin && !isSuperAdmin && (
              <li>
                <Link href="/admin/users" className={clsx("sidebar-link", pathname.startsWith("/admin/users") && "active")}>
                  <Users size={14} style={{ color: pathname.startsWith("/admin/users") ? "var(--am)" : "var(--t3)", flexShrink: 0 }} />
                  <span>Team Members</span>
                </Link>
              </li>
            )}
            <li>
              <Link href="/settings" className={clsx("sidebar-link", pathname === "/settings" && "active")}>
                <Settings size={14} style={{ color: pathname === "/settings" ? "var(--am)" : "var(--t3)", flexShrink: 0 }} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* User footer */}
      {user && (
        <div className="px-3 py-4" style={{ borderTop: "1px solid var(--ln)" }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5"
            style={{ background: "var(--c3)", border: "1px solid var(--ln)", borderRadius: 2 }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center text-[11px] font-display font-bold flex-shrink-0"
              style={{ background: `${roleColor}18`, border: `1px solid ${roleColor}30`, color: roleColor, borderRadius: 2 }}
            >
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--t1)" }}>
                {user.firstName} {user.lastName}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] truncate" style={{ color: roleColor }}>
                {user.role}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 transition-colors flex-shrink-0"
              style={{ color: "var(--t4)", borderRadius: 2 }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--err)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--t4)")}
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
