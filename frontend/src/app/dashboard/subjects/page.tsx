"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, BookOpen, Loader2 } from "lucide-react";
import { subjectsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Subject {
    id: number;
    name: string;
    code: string;
    credits: number;
    department: { name: string };
}

export default function SubjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await subjectsApi.getAll();
            setSubjects(response.data);
        } catch (err: unknown) {
            const error = err as Error;
            const message = error.message || "Failed to load subjects";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex-between">
                <div>
                    <h1 className="page-title">Subjects</h1>
                    <p className="page-subtitle">Manage course subjects and credits</p>
                </div>
                <Link href="/dashboard/subjects/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Subject
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
                        <p className="text-[var(--text-muted)]">Loading subjects...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-[var(--error)] mb-4">{error}</p>
                        <button onClick={fetchSubjects} className="btn btn-secondary">
                            Retry
                        </button>
                    </div>
                ) : filteredSubjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <BookOpen size={48} className="text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-muted)] mb-2">
                            {searchQuery ? "No subjects found matching your search" : "No subjects yet"}
                        </p>
                        {!searchQuery && (
                            <Link href="/dashboard/subjects/new" className="btn btn-primary mt-4">
                                <Plus size={18} />
                                Add First Subject
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubjects.map((subject) => (
                                    <tr key={subject.id}>
                                        <td className="font-mono text-sm font-medium text-[var(--accent-gold)]">
                                            {subject.code}
                                        </td>
                                        <td className="font-medium">{subject.name}</td>
                                        <td>{subject.department?.name || "N/A"}</td>
                                        <td>
                                            <span className="badge badge-sage">{subject.credits} Credits</span>
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
