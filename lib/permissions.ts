export interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles: string[];
  section?: string;
}

export const DEFAULT_NAV: NavItem[] = [
  { href: "/dashboard",       label: "Dashboard",    icon: "LayoutDashboard", roles: [],                                          section: "main" },
  { href: "/clients",         label: "Clients",      icon: "Users",           roles: ["admin","manager"],                         section: "main" },
  { href: "/projects",        label: "Projects",     icon: "FolderKanban",    roles: ["admin","manager","supervisor"],             section: "main" },
  { href: "/tasks",           label: "Tasks",        icon: "CheckSquare",     roles: [],                                          section: "main" },
  { href: "/workers",         label: "Workers",      icon: "HardHat",         roles: ["admin","manager"],                         section: "main" },
  { href: "/invoice-periods", label: "Pay Periods",  icon: "Clock",           roles: ["admin","manager"],                         section: "main" },
  { href: "/invoices",        label: "Invoices",     icon: "FileText",        roles: ["admin","manager"],                         section: "main" },
];

export const SUPERADMIN_NAV: NavItem[] = [
  { href: "/superadmin",          label: "Platform Overview", icon: "Globe",         roles: ["superadmin"], section: "super" },
  { href: "/companies",           label: "Companies",         icon: "Building2",     roles: ["superadmin"], section: "super" },
  { href: "/superadmin/users",    label: "All Users",         icon: "Users",         roles: ["superadmin"], section: "super" },
];

export const ALL_ROLES = ["admin", "manager", "supervisor", "worker", "contractor"] as const;
export type AppRole = (typeof ALL_ROLES)[number];

export const STORAGE_KEY = "BuilderSoft_role_permissions";
export type RolePermissionsMap = Record<string, string[]>;

export function buildDefaultPermissions(): RolePermissionsMap {
  const map: RolePermissionsMap = {};
  for (const role of ALL_ROLES) {
    map[role] = DEFAULT_NAV
      .filter(n => n.roles.length === 0 || n.roles.includes(role))
      .map(n => n.href);
  }
  return map;
}

export function loadPermissions(): RolePermissionsMap {
  if (typeof window === "undefined") return buildDefaultPermissions();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return buildDefaultPermissions();
}

export function savePermissions(map: RolePermissionsMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getNavForRole(role: string, permissions: RolePermissionsMap): NavItem[] {
  if (role === "superadmin") return SUPERADMIN_NAV;
  const allowed = permissions[role] ?? [];
  return DEFAULT_NAV.filter(n => allowed.includes(n.href));
}
