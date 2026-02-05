import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export type UserRole = "admin" | "faculty" | "student";

export function useUserRole() {
    const { user, loading } = useAuth();
    const [role, setRole] = useState<UserRole>("student");
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        if (!loading && user) {
            // In Firebase, roles are in ID Token Result (Custom Claims)
            // We need to fetch it async
            user.getIdTokenResult().then((idTokenResult) => {
                const userRole = (idTokenResult.claims.role as UserRole) || "student";
                setRole(userRole);
                setRoleLoading(false);
            }).catch(() => {
                setRoleLoading(false);
            });
        } else if (!loading && !user) {
            setRoleLoading(false);
        }
    }, [user, loading]);

    return {
        role,
        isLoading: loading || roleLoading,
        isSignedIn: !!user,
        user,
        isAdmin: role === "admin",
        isFaculty: role === "faculty",
        isStudent: role === "student"
    };
}
