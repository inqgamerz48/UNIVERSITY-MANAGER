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

      // 1. Try to get role from metadata first (fastest)
      let role = session.user.user_metadata?.role;
      let fullName = session.user.user_metadata?.full_name;

      // 2. If no role in metadata, fetch from DB (fallback)
      if (!role) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();
        role = userData?.role;
      }

      // 3. If no name in metadata, fetch from profiles (fallback)
      if (!fullName) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", session.user.id)
          .single();
        fullName = profile?.full_name;
      }

      // Default to STUDENT/User if still missing
      role = role || "STUDENT";
      fullName = fullName || session.user.email?.split('@')[0] || "User";

      setUser({
        id: session.user.id,
        email: session.user.email || "",
        role: role as UserRole,
        fullName: fullName,
        permissions: [], // Permissions will be loaded by RBAC hooks if needed
      });

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, logout]);

  return <>{children}</>;
}
