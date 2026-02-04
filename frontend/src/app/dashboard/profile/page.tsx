"use client";

import { useUser } from "@clerk/nextjs";
import { Lock, Mail, Bell, Shield, Users, GraduationCap } from "lucide-react";

const roleConfig: Record<string, { badge: string; icon: typeof Shield }> = {
    admin: { badge: "badge-rust", icon: Shield },
    faculty: { badge: "badge-blue", icon: Users },
    student: { badge: "badge-sage", icon: GraduationCap },
};

export default function ProfilePage() {
    const { user } = useUser();
    const role = (user?.publicMetadata?.role as string) || "student";
    const config = roleConfig[role] || roleConfig.student;
    const RoleIcon = config.icon;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">View and manage your account</p>
            </div>

            {/* Profile Card */}
            <div className="card animate-fade-up">
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-24 h-24 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-[var(--bg-primary)] font-display font-bold text-3xl">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-semibold">{user?.fullName || "User"}</h2>
                        <p className="text-[var(--text-secondary)]">{user?.primaryEmailAddress?.emailAddress}</p>
                        <span className={`badge ${config.badge} mt-2 inline-flex items-center gap-1.5`}>
                            <RoleIcon size={12} />
                            {role}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                        <div className="text-[var(--text-muted)] text-sm mb-1">First Name</div>
                        <div className="font-medium">{user?.firstName || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                        <div className="text-[var(--text-muted)] text-sm mb-1">Last Name</div>
                        <div className="font-medium">{user?.lastName || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                        <div className="text-[var(--text-muted)] text-sm mb-1">Email</div>
                        <div className="font-medium">{user?.primaryEmailAddress?.emailAddress || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                        <div className="text-[var(--text-muted)] text-sm mb-1">Last Sign In</div>
                        <div className="font-medium">{user?.lastSignInAt?.toLocaleDateString() || "-"}</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card animate-fade-up animate-delay-1">
                <h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="flex gap-5 flex-wrap">
                    <button className="btn btn-secondary cursor-pointer">
                        <Lock size={16} />
                        Change Password
                    </button>
                    <button className="btn btn-secondary cursor-pointer">
                        <Mail size={16} />
                        Update Email
                    </button>
                    <button className="btn btn-secondary cursor-pointer">
                        <Bell size={16} />
                        Notifications
                    </button>
                </div>
            </div>
        </div>
    );
}
