"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Building2,
    BookOpen,
    Settings,
    UserCircle,
    Shield,
} from "lucide-react";

const navSections = [
    {
        title: "Overview",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        title: "Academic",
        items: [
            { label: "Students", href: "/dashboard/students", icon: GraduationCap },
            { label: "Faculty", href: "/dashboard/faculty", icon: Users },
            { label: "Departments", href: "/dashboard/departments", icon: Building2 },
            { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
        ],
    },
    {
        title: "Administration",
        items: [
            { label: "User Management", href: "/dashboard/admin", icon: Shield, role: "admin" },
            { label: "Settings", href: "/dashboard/settings", icon: Settings },
        ],
    },
    {
        title: "Account",
        items: [
            { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
        ],
    },
];

import { useUserRole } from "@/hooks/use-user-role";

export default function Sidebar() {
    const pathname = usePathname();
    const { role: userRole } = useUserRole();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                UniManager
            </div>

            <nav className="flex-1">
                {navSections.map((section) => (
                    <div key={section.title} className="sidebar-section">
                        <div className="sidebar-title">{section.title}</div>
                        {section.items
                            .filter((item) => {
                                // If item has no specific role requirement, show it
                                if (!item.role) return true;
                                // If item requires 'admin', only show to admins
                                if (item.role === 'admin') return userRole === 'admin';
                                // Add more role checks here if needed in future
                                return true;
                            })
                            .map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`sidebar-link ${isActive ? "active" : ""}`}
                                    >
                                        <Icon size={20} strokeWidth={1.5} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                    </div>
                ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-[var(--border-subtle)]">
                <div className="px-3 py-2">
                    <p className="text-xs text-[var(--text-muted)]">UniManager v1.0</p>
                </div>
            </div>
        </aside>
    );
}
