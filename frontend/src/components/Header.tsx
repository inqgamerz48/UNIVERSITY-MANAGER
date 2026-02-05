"use client";

import { Search, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user } = useAuth();

    const firstName = user?.displayName?.split(" ")[0] || "User";
    const initials = user?.displayName ? user.displayName.split(" ").map((n) => n[0]).join("").substring(0, 2) : "U";

    return (
        <header className="flex-between mb-8">
            <div>
                <h1 className="page-title">Welcome back, {firstName}</h1>
                <p className="page-subtitle">Here&apos;s what&apos;s happening today</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="input pl-11 w-64"
                    />
                </div>

                {/* Notifications */}
                <button className="btn-ghost p-3 rounded-xl relative cursor-pointer">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent-gold)] rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-subtle)]">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-[var(--bg-primary)] font-semibold">
                        {initials}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium">{user?.displayName || "User"}</p>
                        <p className="text-xs text-[var(--text-muted)]">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
