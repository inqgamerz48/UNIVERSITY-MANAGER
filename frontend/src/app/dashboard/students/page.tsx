"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, GraduationCap, Loader2 } from "lucide-react";
import { studentsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    roll_number: string;
    department: { name: string };
    semester: number;
    email: string;
}

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsApi.getAll();
            setStudents(response.data);
        } catch (err: unknown) {
            const error = err as Error;
            const message = error.message || "Failed to load students";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(
        (s) =>
            `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.roll_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex-between">
                <div>
                    <h1 className="page-title">Students</h1>
                    <p className="page-subtitle">Manage student records and information</p>
                </div>
                <Link href="/dashboard/students/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Student
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="card">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div className="card">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 size={40} className="animate-spin text-[var(--accent-gold)] mb-4" />
                        <p className="text-[var(--text-muted)]">Loading students...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-[var(--error)] mb-4">{error}</p>
                        <button onClick={fetchStudents} className="btn btn-secondary">
                            Retry
                        </button>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <GraduationCap size={48} className="text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-muted)] mb-2">
                            {searchQuery ? "No students found matching your search" : "No students yet"}
                        </p>
                        {!searchQuery && (
                            <Link href="/dashboard/students/new" className="btn btn-primary mt-4">
                                <Plus size={18} />
                                Add First Student
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Semester</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="font-mono text-sm font-medium text-[var(--accent-gold)]">
                                            {student.roll_number}
                                        </td>
                                        <td className="font-medium">
                                            {student.first_name} {student.last_name}
                                        </td>
                                        <td>{student.department?.name || "N/A"}</td>
                                        <td>
                                            <span className="badge badge-sage">Sem {student.semester}</span>
                                        </td>
                                        <td className="text-[var(--text-muted)]">{student.email}</td>
                                        <td>
                                            <button className="btn-ghost p-2 rounded-lg cursor-pointer">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
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
