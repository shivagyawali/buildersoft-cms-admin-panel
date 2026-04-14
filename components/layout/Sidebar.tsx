"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, Users, FolderKanban, CheckSquare, FileText, LogOut, HardHat, Settings, HardDriveIcon } from "lucide-react";
import { getInitials } from "@/lib/utils";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/workers", label: "Workers", icon: HardDriveIcon },
  { href: "/invoices", label: "Invoices", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col z-30 bg-stone-950">
      <div className="px-4 py-5 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0">
            <HardHat size={15} className="text-white" />
          </div>
          <div>
            <p className="font-display text-white text-sm leading-tight">Buildersoft</p>
            <p className="text-[10px] text-stone-500 tracking-widest uppercase mt-0.5">CMS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-medium text-stone-600 uppercase tracking-widest px-2 mb-2">Menu</p>
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link href={href} className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  active ? "bg-amber-600 text-white font-medium" : "text-stone-400 hover:text-white hover:bg-stone-800"
                )}>
                  <Icon size={15} />{label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-stone-800 space-y-1">
        <Link href="/settings" className={clsx(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
          pathname === "/settings" ? "bg-amber-600 text-white font-medium" : "text-stone-400 hover:text-white hover:bg-stone-800"
        )}>
          <Settings size={15} />Settings
        </Link>
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-stone-300 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-stone-600 truncate">{user.email}</p>
            </div>
            <button onClick={logout} className="p-1 text-stone-600 hover:text-stone-300 transition-colors" title="Logout">
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
