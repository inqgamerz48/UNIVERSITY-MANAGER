"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Building2, Loader2, Save } from "lucide-react";
import { facultyApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddFacultyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        employee_id: "",
        department_id: "",
        designation: "",
        qualification: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                department_id: parseInt(formData.department_id),
                clerk_id: "temp_clerk_id",
            };

            await facultyApi.create(payload);
            toast.success("Faculty added successfully!");
            router.push("/dashboard/faculty");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to add faculty");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/faculty" className="btn-ghost p-2 rounded-lg cursor-pointer">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="page-title">Add New Faculty</h1>
                    <p className="page-subtitle">Enter faculty member details</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card animate-fade-up">
                {/* Personal Info */}
                <div className="mb-10">
                    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <User size={18} className="text-[var(--accent-gold)]" />
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">First Name *</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Last Name *</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="mb-10">
                    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 size={18} className="text-[var(--accent-gold)]" />
                        Professional Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Employee ID *</label>
                            <input
                                type="text"
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="FAC001"
                            />
                        </div>
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
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Designation</label>
                            <select
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="">Select Designation</option>
                                <option value="Professor">Professor</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Assistant Professor">Assistant Professor</option>
                                <option value="HOD">HOD</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Qualification</label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className="input"
                                placeholder="Ph.D, M.Tech"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-5 justify-end pt-4 border-t border-[var(--border-subtle)]">
                    <Link href="/dashboard/faculty" className="btn btn-secondary cursor-pointer">
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
                                Save Faculty
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
