import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "STUDENT" | "FACULTY" | "ADMIN" | "SUPER_ADMIN";

interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      initialized: false,
      setUser: (user) => set({ user, isLoading: false, initialized: true }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, initialized: true }),
      hasPermission: (permission: string) => {
        const user = get().user;
        return user?.permissions?.includes(permission) ?? false;
      },
      hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
      },
    }),
    { name: "auth-storage" }
  )
);
