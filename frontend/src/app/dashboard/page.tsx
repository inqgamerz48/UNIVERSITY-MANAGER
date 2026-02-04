"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { GraduationCap, Users, Building2, BookOpen, Clock, CheckCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const recentActivity = [
    { id: 1, action: "New student enrolled", subject: "John Doe - Computer Science", time: "2 mins ago", icon: GraduationCap },
    { id: 2, action: "Faculty assigned", subject: "Dr. Smith to CSE-301", time: "15 mins ago", icon: Users },
    { id: 3, action: "Course completed", subject: "Mathematics 101 - Final exam", time: "1 hour ago", icon: CheckCircle },
    { id: 4, action: "Schedule updated", subject: "Electronics Lab - Room 204", time: "2 hours ago", icon: Clock },
];

export default function DashboardPage() {
    const [statsData, setStatsData] = useState({
        total_students: 0,
        total_faculty: 0,
        total_departments: 0,
        total_subjects: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await api.get('/stats');
                setStatsData(response.data);
            } catch (err: unknown) {
                const error = err as Error;
                toast.error(error.message || "Failed to load stats");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const stats = [
        { title: "Total Students", value: statsData.total_students.toString(), change: "+12%", trend: "up" as const, icon: GraduationCap, variant: "gold" as const },
        { title: "Faculty Members", value: statsData.total_faculty.toString(), change: "+3%", trend: "up" as const, icon: Users, variant: "sage" as const },
        { title: "Departments", value: statsData.total_departments.toString(), change: "0%", trend: "up" as const, icon: Building2, variant: "copper" as const },
        { title: "Active Courses", value: statsData.total_subjects.toString(), change: "+8%", trend: "up" as const, icon: BookOpen, variant: "blue" as const },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={40} className="animate-spin text-[var(--accent-gold)]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid-stats">
                {stats.map((stat, index) => (
                    <div key={stat.title} className={`animate-fade-up animate-delay-${index + 1}`}>
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="card animate-fade-up" style={{ animationDelay: '0.25s' }}>
                <h2 className="text-xl font-display font-semibold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,83,0.12)] flex items-center justify-center">
                                    <Icon size={20} className="text-[var(--accent-gold)]" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.action}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{item.subject}</p>
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">{item.time}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
