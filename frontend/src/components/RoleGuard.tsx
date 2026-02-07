"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (role && !allowedRoles.includes(role)) {
                router.push("/dashboard"); // Redirect unauthorized users
            }
        }
    }, [role, loading, router, allowedRoles]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    if (!role || !allowedRoles.includes(role)) {
        return null;
    }

    return <>{children}</>;
}
