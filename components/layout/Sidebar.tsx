"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare,
  FileText, LogOut, HardHat, Settings, HardHat as WorkerIcon,
  Clock, ChevronRight,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/workers", label: "Workers", icon: WorkerIcon },
  { href: "/invoice-periods", label: "Pay Periods", icon: Clock },
  { href: "/invoices", label: "Invoices", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-30 bg-[#0c0c0f] border-r border-white/[0.05]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-900/50">
            <HardHat size={15} className="text-white" />
          </div>
          <div>
            <div className="font-display font-700 text-white text-sm leading-tight tracking-tight">
              Buildersoft
            </div>
            <div className="text-[9px] text-gray-600 tracking-widest uppercase font-medium">
              Management
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    "sidebar-link group",
                    active
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05] border border-transparent"
                  )}
                >
                  <Icon size={14} className={active ? "text-violet-400" : "text-gray-600 group-hover:text-gray-400"} />
                  <span className="text-sm">{label}</span>
                  {active && <ChevronRight size={12} className="ml-auto text-violet-500" />}
                </Link>
              </li>
            );
          })}
        </ul>

        {user && (["admin", "manager"].includes(user.role)) && (
          <>
            <p className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest px-3 mb-3 mt-5">
              Admin
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/settings"
                  className={clsx(
                    "sidebar-link group border",
                    pathname === "/settings"
                      ? "bg-violet-600/20 text-violet-300 border-violet-500/20"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05] border-transparent"
                  )}
                >
                  <Settings size={14} className="text-gray-600 group-hover:text-gray-400" />
                  <span className="text-sm">Settings</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {user && !["admin", "manager"].includes(user.role) && (
          <ul className="space-y-0.5 mt-2">
            <li>
              <Link
                href="/settings"
                className={clsx(
                  "sidebar-link group border",
                  pathname === "/settings"
                    ? "bg-violet-600/20 text-violet-300 border-violet-500/20"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05] border-transparent"
                )}
              >
                <Settings size={14} className="text-gray-600 group-hover:text-gray-400" />
                <span className="text-sm">Settings</span>
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {/* User Footer */}
      {user && (
        <div className="px-3 py-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-[11px] font-bold text-violet-300 flex-shrink-0">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-gray-600 truncate capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-1 text-gray-600 hover:text-red-400 transition-colors"
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
