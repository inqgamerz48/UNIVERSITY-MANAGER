"use client";

import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/stores/auth-store";

export function usePermission(permission: string): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.permissions?.includes(permission) ?? false;
}

export function useAnyPermission(permissions: string[]): boolean {
  const user = useAuthStore((state) => state.user);
  if (!user?.permissions) return false;
  return permissions.some((p) => user.permissions!.includes(p));
}

export function useAllPermissions(permissions: string[]): boolean {
  const user = useAuthStore((state) => state.user);
  if (!user?.permissions) return false;
  return permissions.every((p) => user.permissions!.includes(p));
}

export function useRole(allowedRoles: UserRole | UserRole[]): boolean {
  const user = useAuthStore((state) => state.user);
  if (!user) return false;
  const roleArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roleArray.includes(user.role as UserRole);
}
