
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";


interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    logout: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUserRole = async (currentUser: User) => {
        try {
            const tokenResult = await currentUser.getIdTokenResult(true); // Force refresh
            const userRole = tokenResult.claims.role as string || "student";
            setRole(userRole);
        } catch (error) {
            console.error("Error fetching user role:", error);
            setRole("student"); // Fallback
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchUserRole(currentUser);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (user) {
            setLoading(true);
            await fetchUserRole(user);
            setLoading(false);
        }
    };

    const logout = async () => {
        await auth.signOut();
        setRole(null);
        router.push("/sign-in");
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
