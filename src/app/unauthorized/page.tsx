"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const getDashboardUrl = () => {
    switch (user?.role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "/admin/dashboard";
      case "FACULTY":
        return "/faculty/dashboard";
      default:
        return "/student/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access this page.
          <br />
          Your current role: <span className="font-semibold">{user?.role}</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button className="gold" onClick={() => router.push(getDashboardUrl())}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
