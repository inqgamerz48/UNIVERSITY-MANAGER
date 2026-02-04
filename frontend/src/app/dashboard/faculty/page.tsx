"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Users, Loader2 } from "lucide-react";
import { facultyApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Faculty {
    id: number;
    first_name: string;
    last_name: string;
    employee_id: string;
    department: { name: string };
    designation?: string;
    email: string;
}

export default function FacultyPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await facultyApi.getAll();
            setFaculty(response.data);
        } catch (err: unknown) {
            const error = err as Error;
            const message = error.message || "Failed to load faculty";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const filteredFaculty = faculty.filter(
        (f) =>
            `${f.first_name} ${f.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex-between">
                <div>
                    <h1 className="page-title">Faculty</h1>
                    <p className="page-subtitle">Manage faculty members and staff</p>
                </div>
                <Link href="/dashboard/faculty/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Faculty
                </Link>
            </div>

            <div className="card">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by name or employee ID..."
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
                        <p className="text-[var(--text-muted)]">Loading faculty...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-[var(--error)] mb-4">{error}</p>
                        <button onClick={fetchFaculty} className="btn btn-secondary">
                            Retry
                        </button>
                    </div>
                ) : filteredFaculty.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Users size={48} className="text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-muted)] mb-2">
                            {searchQuery ? "No faculty found matching your search" : "No faculty yet"}
                        </p>
                        {!searchQuery && (
                            <Link href="/dashboard/faculty/new" className="btn btn-primary mt-4">
                                <Plus size={18} />
                                Add First Faculty
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFaculty.map((member) => (
                                    <tr key={member.id}>
                                        <td className="font-mono text-sm font-medium text-[var(--accent-gold)]">
                                            {member.employee_id}
                                        </td>
                                        <td className="font-medium">
                                            {member.first_name} {member.last_name}
                                        </td>
                                        <td>{member.department?.name || "N/A"}</td>
                                        <td>
                                            <span className="badge badge-copper">{member.designation || "Faculty"}</span>
                                        </td>
                                        <td className="text-[var(--text-muted)]">{member.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
