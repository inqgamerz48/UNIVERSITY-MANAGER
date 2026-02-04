"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Loader2, Save } from "lucide-react";
import { departmentsApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddDepartmentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await departmentsApi.create(formData);
            toast.success("Department added successfully!");
            router.push("/dashboard/departments");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to add department");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/departments" className="btn-ghost p-2 rounded-lg cursor-pointer">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="page-title">Add New Department</h1>
                    <p className="page-subtitle">Create a new department</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card animate-fade-up">
                <div className="mb-10">
                    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 size={18} className="text-[var(--accent-gold)]" />
                        Department Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Department Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="Computer Science"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Department Code *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="CS"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="input resize-none"
                                placeholder="Brief description of the department..."
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-5 justify-end pt-4 border-t border-[var(--border-subtle)]">
                    <Link href="/dashboard/departments" className="btn btn-secondary cursor-pointer">
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
                                Save Department
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
