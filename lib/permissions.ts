// ─── Route permission config ───────────────────────────────────────────────
// Each nav item has a `roles` array. If empty → accessible to all authed users.
// The admin portal allows overriding these per-role at runtime (stored in localStorage
// and optionally synced to backend via /api/role-permissions).

export interface NavItem {
  href: string;
  label: string;
  icon: string; // lucide icon name
  roles: string[]; // empty = all roles
}

export const DEFAULT_NAV: NavItem[] = [
  { href: "/dashboard",       label: "Dashboard",   icon: "LayoutDashboard", roles: [] },
  { href: "/clients",         label: "Clients",     icon: "Users",           roles: ["admin", "manager"] },
  { href: "/projects",        label: "Projects",    icon: "FolderKanban",    roles: ["admin", "manager", "supervisor"] },
  { href: "/tasks",           label: "Tasks",       icon: "CheckSquare",     roles: [] },
  { href: "/workers",         label: "Workers",     icon: "HardHat",         roles: ["admin", "manager"] },
  { href: "/invoice-periods", label: "Pay Periods", icon: "Clock",           roles: ["admin", "manager"] },
  { href: "/invoices",        label: "Invoices",    icon: "FileText",        roles: ["admin", "manager"] },
];

export const ALL_ROLES = ["admin", "manager", "supervisor", "worker"] as const;
export type AppRole = (typeof ALL_ROLES)[number];

export const STORAGE_KEY = "buildersoft_role_permissions";

export type RolePermissionsMap = Record<string, string[]>; // role → allowed hrefs

/** Build a default map from DEFAULT_NAV */
export function buildDefaultPermissions(): RolePermissionsMap {
  const map: RolePermissionsMap = {};
  for (const role of ALL_ROLES) {
    map[role] = DEFAULT_NAV
      .filter(n => n.roles.length === 0 || n.roles.includes(role))
      .map(n => n.href);
  }
  return map;
}

/** Load from localStorage (admin-overridden) or fall back to defaults */
export function loadPermissions(): RolePermissionsMap {
  if (typeof window === "undefined") return buildDefaultPermissions();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return buildDefaultPermissions();
}

/** Persist admin changes to localStorage */
export function savePermissions(map: RolePermissionsMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** Get nav items visible to a specific role based on current permissions */
export function getNavForRole(role: string, permissions: RolePermissionsMap): NavItem[] {
  const allowed = permissions[role] ?? [];
  return DEFAULT_NAV.filter(n => allowed.includes(n.href));
}
