"use client";

import { Search, Bell } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function Header() {
    const { user } = useUser();

    const firstName = user?.firstName || "User";
    const initials = user?.firstName?.[0] || "U";

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
                        <p className="text-sm font-medium">{user?.fullName || "User"}</p>
                        <p className="text-xs text-[var(--text-muted)]">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
