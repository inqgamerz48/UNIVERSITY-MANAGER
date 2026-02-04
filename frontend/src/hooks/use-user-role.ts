import { useUser } from "@clerk/nextjs";

export type UserRole = "admin" | "faculty" | "student";

export function useUserRole() {
    const { user, isLoaded, isSignedIn } = useUser();

    // Default to 'student' if no role is found OR if user is not loaded yet
    // This is defensive coding to prevent unauthorized access during loading
    const role = (user?.publicMetadata?.role as UserRole) || "student";

    // Explicit check for loading state if strict check is needed elsewhere
    const isLoading = !isLoaded;

    return {
        role,
        isLoading,
        isSignedIn,
        user,
        isAdmin: role === "admin",
        isFaculty: role === "faculty",
        isStudent: role === "student"
    };
}
