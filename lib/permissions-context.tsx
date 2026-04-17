"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  RolePermissionsMap,
  loadPermissions,
  savePermissions,
  buildDefaultPermissions,
  NavItem,
  getNavForRole,
  DEFAULT_NAV,
} from "./permissions";

interface PermCtx {
  permissions: RolePermissionsMap;
  updatePermissions: (map: RolePermissionsMap) => void;
  resetPermissions: () => void;
  getNavForRole: (role: string) => NavItem[];
  allNav: NavItem[];
}

const PermContext = createContext<PermCtx | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<RolePermissionsMap>(buildDefaultPermissions());

  useEffect(() => {
    setPermissions(loadPermissions());
  }, []);

  const updatePermissions = (map: RolePermissionsMap) => {
    setPermissions(map);
    savePermissions(map);
  };

  const resetPermissions = () => {
    const defaults = buildDefaultPermissions();
    setPermissions(defaults);
    savePermissions(defaults);
  };

  return (
    <PermContext.Provider value={{
      permissions,
      updatePermissions,
      resetPermissions,
      getNavForRole: (role) => getNavForRole(role, permissions),
      allNav: DEFAULT_NAV,
    }}>
      {children}
    </PermContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermContext);
  if (!ctx) throw new Error("usePermissions must be used inside PermissionsProvider");
  return ctx;
}
