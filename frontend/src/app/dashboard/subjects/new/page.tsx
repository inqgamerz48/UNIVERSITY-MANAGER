"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Loader2, Save } from "lucide-react";
import { subjectsApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddSubjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        credits: "",
        department_id: "",
        semester: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                credits: parseInt(formData.credits),
                department_id: parseInt(formData.department_id),
            };

            await subjectsApi.create(payload);
            toast.success("Subject added successfully!");
            router.push("/dashboard/subjects");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to add subject");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/subjects" className="btn-ghost p-2 rounded-lg cursor-pointer">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="page-title">Add New Subject</h1>
                    <p className="page-subtitle">Create a new course subject</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card animate-fade-up">
                <div className="mb-10">
                    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen size={18} className="text-[var(--accent-gold)]" />
                        Subject Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Subject Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="Data Structures & Algorithms"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[var(--text-secondary)] text-sm mb-2">Subject Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="CS301"
                                />
                            </div>
                            <div>
                                <label className="block text-[var(--text-secondary)] text-sm mb-2">Credits *</label>
                                <input
                                    type="number"
                                    name="credits"
                                    value={formData.credits}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    max="6"
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[var(--text-secondary)] text-sm mb-2">Department *</label>
                                <select
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={handleChange}
                                    required
                                    className="select"
                                >
                                    <option value="">Select Department</option>
                                    <option value="1">Computer Science</option>
                                    <option value="2">Electronics</option>
                                    <option value="3">Mechanical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[var(--text-secondary)] text-sm mb-2">Semester</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="select"
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                        <option key={s} value={s}>Semester {s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="input resize-none"
                                placeholder="Course description..."
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-5 justify-end pt-4 border-t border-[var(--border-subtle)]">
                    <Link href="/dashboard/subjects" className="btn btn-secondary cursor-pointer">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Subject
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
