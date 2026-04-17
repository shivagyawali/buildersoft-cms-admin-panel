"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { usePermissions } from "@/lib/permissions-context";
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, FileText,
  LogOut, HardHat, Settings, Clock, ShieldCheck, Building2, Globe, 
  ChevronDown, Bell, Search, Hammer, UserCog,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/UI";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, FolderKanban, CheckSquare,
  FileText, HardHat, Clock, Settings, Building2, Globe,
};

// Construction SVG logo
function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="var(--acc)" />
      {/* Hard hat shape */}
      <path d="M6 20h20v2.5a1 1 0 01-1 1H7a1 1 0 01-1-1V20z" fill="white" opacity="0.9" />
      <path d="M16 7C11 7 7 10.5 7 15v2h18v-2c0-4.5-4-8-9-8z" fill="white" />
      <rect x="14" y="5" width="4" height="4" rx="1" fill="white" opacity="0.7" />
    </svg>
  );
}

export default function TopNav() {
  const pathname = usePathname();
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const { getNavForRole } = usePermissions();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = user ? getNavForRole(user.role) : [];

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && href !== "/superadmin" && pathname.startsWith(href));

  const ROLE_COLORS: Record<string, string> = {
    superadmin: "var(--purple)", admin: "var(--err)", manager: "var(--acc)",
    supervisor: "var(--info)", worker: "var(--ok)", contractor: "var(--muted)",
  };
  const roleColor = ROLE_COLORS[user?.role ?? ""] ?? "var(--acc)";

  // Group nav for overflow
  const mainNav = navItems.slice(0, 6);
  const moreNav = navItems.slice(6);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex flex-col"
      style={{ background: "var(--bg-topbar)" }}
    >
      {/* Orange accent strip at very top */}
      <div style={{ height: 3, background: "linear-gradient(90deg, var(--acc), var(--acc-2), var(--acc))", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />

      {/* Main nav bar */}
      <div className="flex items-center gap-0 px-5" style={{ height: "var(--topbar-h)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Brand */}
        <Link href={isSuperAdmin ? "/superadmin" : "/dashboard"} className="flex items-center gap-3 mr-6 flex-shrink-0">
          <LogoMark />
          <div>
            <div className="font-display text-[20px] leading-none tracking-wider text-white">BuilderSoft</div>
            <div className="font-mono text-[8px] leading-none tracking-[0.2em] mt-0.5" style={{ color: "rgba(251,146,60,0.7)" }}>
              {isSuperAdmin ? "PLATFORM ADMIN" : "CONSTRUCTION CMS"}
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-8 mr-5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Nav items */}
        <nav className="flex items-center gap-1 flex-1 overflow-hidden">
          {mainNav.map(({ href, label, icon }) => {
            const Icon = ICON_MAP[icon] ?? LayoutDashboard;
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all flex-shrink-0",
                  active
                    ? "text-white"
                    : "hover:text-white hover:bg-white/8"
                )}
                style={{
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  background: active ? "rgba(249,115,22,0.2)" : undefined,
                  boxShadow: active ? "inset 0 0 0 1px rgba(249,115,22,0.4)" : undefined,
                }}
              >
                <Icon size={14} style={{ color: active ? "var(--acc)" : undefined }} />
                <span>{label}</span>
                {active && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--acc)" }} />}
              </Link>
            );
          })}

          {/* Account nav */}
          {!isSuperAdmin && isAdmin && (
            <>
              <Link href="/admin/roles"
                className={clsx("flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all flex-shrink-0")}
                style={{
                  color: pathname.startsWith("/admin") ? "#fff" : "rgba(255,255,255,0.5)",
                  background: pathname.startsWith("/admin") ? "rgba(249,115,22,0.2)" : undefined,
                  boxShadow: pathname.startsWith("/admin") ? "inset 0 0 0 1px rgba(249,115,22,0.4)" : undefined,
                }}
                onMouseOver={e => { if (!pathname.startsWith("/admin")) (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseOut={e => { if (!pathname.startsWith("/admin")) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
              >
                <ShieldCheck size={14} style={{ color: pathname.startsWith("/admin") ? "var(--acc)" : undefined }} />
                <span>Roles</span>
              </Link>
              <Link href="/admin/users"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all flex-shrink-0"
                style={{ color: "rgba(255,255,255,0.5)" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
              >
                <UserCog size={14} />
                <span>Team</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <ThemeToggle />

          <Link
            href="/settings"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <Settings size={16} />
          </Link>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: userMenuOpen ? "rgba(255,255,255,0.06)" : "transparent" }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseOut={e => { if (!userMenuOpen) e.currentTarget.style.background = "transparent"; }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0"
                style={{ background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44` }}
              >
                {user ? getInitials(user.firstName, user.lastName) : "??"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[12px] font-medium leading-none text-white">{user?.firstName ?? ""}</div>
                <div className="text-[10px] leading-none mt-0.5 capitalize font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{user?.role}</div>
              </div>
              <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.4)", transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden animate-fade-in"
                style={{ background: "var(--bg-card)", border: "1.5px solid var(--line-strong)", boxShadow: "var(--shadow-lg)" }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-raised)" }}>
                  <p className="font-medium text-[14px]" style={{ color: "var(--tx)" }}>{user?.firstName} {user?.lastName}</p>
                  <p className="text-[12px] font-mono" style={{ color: "var(--tx-3)" }}>{user?.email}</p>
                  <span className="inline-block mt-1.5 badge text-[10px]" style={{ background: `${roleColor}18`, color: roleColor }}>
                    {user?.role}
                  </span>
                </div>
                <div className="p-1.5">
                  <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-[13px]"
                    style={{ color: "var(--tx-2)" }}
                    onClick={() => setUserMenuOpen(false)}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-sunken)"; (e.currentTarget as HTMLElement).style.color = "var(--tx)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--tx-2)"; }}
                  >
                    <Settings size={14} />Settings
                  </Link>
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-[13px] text-left"
                    style={{ color: "var(--err)" }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "var(--err-bg)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <LogOut size={14} />Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
