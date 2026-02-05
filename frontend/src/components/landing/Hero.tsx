"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto pt-20 pb-10 px-4">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-gold mb-8 px-4 py-1.5 rounded-full border border-[var(--accent-gold)]/20 shadow-[0_0_20px_rgba(212,168,83,0.1)]"
            >
                <GraduationCap size={14} className="mr-2" />
                <span className="tracking-wide text-xs font-semibold uppercase">University Management System v1.0</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-[var(--text-primary)] mb-8 tracking-tight leading-[1.1]"
            >
                Academic Excellence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-secondary)] via-[var(--text-muted)] to-[var(--text-secondary)]">Meets Modern Craft</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl leading-relaxed text-balance"
            >
                Streamline university operations with a premium, role-based platform designed for
                administrators, faculty, and students. Efficient, secure, and beautiful.
            </motion.p>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
                <Link
                    href="/sign-in"
                    className="btn btn-primary h-14 px-8 text-lg shadow-[0_4px_20px_rgba(212,168,83,0.2)] hover:shadow-[0_4px_25px_rgba(212,168,83,0.3)] hover:-translate-y-0.5 transition-all"
                >
                    Get Started
                    <ArrowRight size={20} />
                </Link>
                <Link
                    href="/dashboard"
                    className="btn btn-secondary h-14 px-8 text-lg hover:-translate-y-0.5 transition-all"
                >
                    <LayoutDashboard size={20} />
                    View Dashboard
                </Link>
            </motion.div>
        </div>
    );
}
