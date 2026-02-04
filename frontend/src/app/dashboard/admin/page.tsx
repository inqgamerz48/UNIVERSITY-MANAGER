"use client";

import { useState, useEffect } from "react";
import { Search, Shield, Users, GraduationCap, Trash2, UserCircle, Loader2 } from "lucide-react";
import { usersApi } from "@/lib/api";
import toast from "react-hot-toast";

const roleConfig: Record<string, { badge: string; icon: typeof Shield }> = {
    admin: { badge: "badge-rust", icon: Shield },
    faculty: { badge: "badge-blue", icon: Users },
    student: { badge: "badge-sage", icon: GraduationCap },
};

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await usersApi.getAll();
            setUsers(data);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const filtered = users.filter((u) => {
        const matchesSearch = (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === "all" || u.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === "admin").length,
        faculty: users.filter(u => u.role === "faculty").length,
        students: users.filter(u => u.role === "student").length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="page-title">Admin Panel</h1>
                <p className="page-subtitle">Manage users and system settings</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-card animate-fade-up">
                    <div className="stat-icon gold">
                        <UserCircle size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-up animate-delay-1">
                    <div className="stat-icon copper">
                        <Shield size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.admins}</div>
                        <div className="stat-label">Admins</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-up animate-delay-2">
                    <div className="stat-icon blue">
                        <Users size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.faculty}</div>
                        <div className="stat-label">Faculty</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-up animate-delay-3">
                    <div className="stat-icon sage">
                        <GraduationCap size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.students}</div>
                        <div className="stat-label">Students</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card animate-fade-up animate-delay-4">
                <div className="flex gap-6 flex-wrap">
                    <div className="flex-1 min-w-[250px] relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input pl-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {["all", "admin", "faculty", "student"].map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${selectedRole === role
                                    ? "bg-[rgba(212,168,83,0.15)] text-[var(--accent-gold)]"
                                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-container animate-fade-up" style={{ animationDelay: '0.25s' }}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 size={40} className="animate-spin text-[var(--accent-gold)] mb-4" />
                        <p className="text-[var(--text-muted)]">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <UserCircle size={48} className="text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-muted)]">No users found</p>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => {
                                const config = roleConfig[user.role] || roleConfig.student;
                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-[var(--bg-primary)] font-semibold text-sm">
                                                    {(user.name || "U").split(" ").map((n: string) => n[0]).join("")}
                                                </div>
                                                <span className="font-medium">{user.name || "Unknown User"}</span>
                                            </div>
                                        </td>
                                        <td className="text-[var(--text-secondary)]">{user.email}</td>
                                        <td>
                                            <span className={`badge ${config.badge} capitalize`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.status === "active" ? "badge-sage" : "badge-rust"}`}>
                                                {user.status || "active"}
                                            </span>
                                        </td>
                                        <td className="text-[var(--text-muted)] text-sm">{user.lastLogin || "Never"}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn-ghost p-2 rounded-lg text-[var(--error)] hover:bg-[rgba(193,102,107,0.1)] cursor-pointer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
