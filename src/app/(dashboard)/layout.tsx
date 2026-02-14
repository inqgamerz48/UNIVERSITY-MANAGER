"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ErrorBoundary } from "@/components/error-boundary";
import { DashboardSkeleton } from "@/components/ui/loading-states";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const supabase = createClient();

  // Middleware handles auth redirection, so we don't need this client-side check which causes race conditions
  // useEffect(() => {
  //   if (initialized && !user) {
  //     router.push("/login");
  //   }
  // }, [user, initialized, router]);

  if (!initialized) {
    return (
      <DashboardSkeleton />
    );
  }

  return (
    <ErrorBoundary>
      <DashboardShell>{children}</DashboardShell>
    </ErrorBoundary>
  );
}
