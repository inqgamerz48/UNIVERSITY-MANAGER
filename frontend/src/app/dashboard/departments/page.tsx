"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Building2, Loader2 } from "lucide-react";
import { departmentsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Department {
    id: number;
    name: string;
    code: string;
    description?: string;
}

export default function DepartmentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await departmentsApi.getAll();
            setDepartments(response.data);
        } catch (err: unknown) {
            const error = err as Error;
            const message = error.message || "Failed to load departments";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const filteredDepartments = departments.filter(
        (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex-between">
                <div>
                    <h1 className="page-title">Departments</h1>
                    <p className="page-subtitle">Manage academic departments</p>
                </div>
                <Link href="/dashboard/departments/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Department
                </Link>
            </div>

            <div className="card">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 size={40} className="animate-spin text-[var(--accent-gold)] mb-4" />
                        <p className="text-[var(--text-muted)]">Loading departments...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-[var(--error)] mb-4">{error}</p>
                        <button onClick={fetchDepartments} className="btn btn-secondary">
                            Retry
                        </button>
                    </div>
                ) : filteredDepartments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Building2 size={48} className="text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-muted)] mb-2">
                            {searchQuery ? "No departments found matching your search" : "No departments yet"}
                        </p>
                        {!searchQuery && (
                            <Link href="/dashboard/departments/new" className="btn btn-primary mt-4">
                                <Plus size={18} />
                                Add First Department
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDepartments.map((dept) => (
                            <div key={dept.id} className="card hover:border-[var(--accent-gold)] transition-colors cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-[var(--bg-tertiary)]">
                                        <Building2 size={24} className="text-[var(--accent-gold)]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-display font-semibold text-lg mb-1">{dept.name}</h3>
                                        <p className="text-sm font-mono text-[var(--accent-copper)] mb-2">{dept.code}</p>
                                        {dept.description && (
                                            <p className="text-sm text-[var(--text-muted)] line-clamp-2">{dept.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
