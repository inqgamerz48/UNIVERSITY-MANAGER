"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        logout();
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", session.user.id)
        .single();

      const { data: permissions } = await supabase
        .from("role_permissions")
        .select("permission_code")
        .eq("role", profile?.role || "STUDENT");

      setUser({
        id: session.user.id,
        email: session.user.email || "",
        role: (profile?.role || "STUDENT") as UserRole,
        fullName: profile?.full_name || "User",
        permissions: permissions?.map((p) => p.permission_code) || [],
      });
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, logout]);

  return <>{children}</>;
}
