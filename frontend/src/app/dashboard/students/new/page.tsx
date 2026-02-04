"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, GraduationCap, Phone, Loader2, Save } from "lucide-react";
import { studentsApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddStudentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        roll_number: "",
        department_id: "",
        year: "",
        semester: "",
        phone: "",
        address: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Convert string IDs to numbers
            const payload = {
                ...formData,
                department_id: parseInt(formData.department_id),
                year: parseInt(formData.year),
                semester: parseInt(formData.semester),
                clerk_id: "temp_clerk_id", // Will be replaced with real Clerk ID
            };

            await studentsApi.create(payload);
            toast.success("Student added successfully!");
            router.push("/dashboard/students");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to add student");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/students" className="btn-ghost p-2 rounded-lg cursor-pointer">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="page-title">Add New Student</h1>
                    <p className="page-subtitle">Fill in the student details</p>
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
                            <label className="block text-[var(--text-secondary)] text-sm mb-3">First Name *</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="John"
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
                                placeholder="Doe"
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
                                placeholder="john.doe@university.edu"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Info */}
                <div className="mb-10">
                    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <GraduationCap size={18} className="text-[var(--accent-gold)]" />
                        Academic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Roll Number *</label>
                            <input
                                type="text"
                                name="roll_number"
                                value={formData.roll_number}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="CS2024001"
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
                                <option value="4">Civil</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Year *</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="select"
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Semester *</label>
                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                required
                                className="select"
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mb-10">
                    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <Phone size={18} className="text-[var(--accent-gold)]" />
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--text-secondary)] text-sm mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input"
                                placeholder="City, State"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-5 justify-end pt-4 border-t border-[var(--border-subtle)]">
                    <Link href="/dashboard/students" className="btn btn-secondary cursor-pointer">
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
                                Save Student
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
