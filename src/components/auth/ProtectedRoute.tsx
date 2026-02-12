"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, UserRole } from "@/stores/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { user, initialized, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialized && !isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, initialized, isLoading, router, pathname]);

  if (!initialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500" />
      </div>
    );
  }

  if (!user) {
    return fallback || null;
  }

  if (requiredRole && !useRole(requiredRole)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (requiredPermission && !usePermission(requiredPermission)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Permission Required</h1>
        <p className="text-muted-foreground">You do not have the required permission.</p>
      </div>
    );
  }

  return <>{children}</>;
}

function usePermission(permission: string): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.permissions?.includes(permission) ?? false;
}

function useRole(allowedRoles: UserRole | UserRole[]): boolean {
  const user = useAuthStore((state) => state.user);
  if (!user) return false;
  const roleArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roleArray.includes(user.role as UserRole);
}
