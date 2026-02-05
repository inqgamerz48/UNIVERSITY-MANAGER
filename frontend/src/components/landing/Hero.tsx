"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (

        <div className="relative flex flex-col items-center text-center max-w-5xl mx-auto pt-32 pb-16 px-6">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 px-4 py-1.5 rounded-full border border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/5 backdrop-blur-sm"
            >
                <span className="text-sm font-medium text-[var(--accent-gold)] tracking-wide">University Management Reimagined</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold text-[var(--text-primary)] mb-8 tracking-tight leading-none"
            >
                The Gold Standard <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--accent-gold)] via-[#F9E9C3] to-[var(--accent-gold)]">In Academic Operations</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-3xl leading-relaxed text-balance font-light"
            >
                A unified, role-based operating system for modern universities.
                Seamlessly connect faculty, students, and administrators.
            </motion.p>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
                <Link
                    href="/sign-in"
                    className="btn btn-primary h-16 px-10 text-lg rounded-xl shadow-[0_4px_30px_rgba(212,168,83,0.25)] hover:shadow-[0_4px_40px_rgba(212,168,83,0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                    Get Started
                    <ArrowRight size={22} />
                </Link>
                <Link
                    href="/dashboard"
                    className="btn btn-secondary h-16 px-10 text-lg rounded-xl border-white/10 hover:bg-white/5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                >
                    <LayoutDashboard size={22} />
                    View Dashboard
                </Link>
            </motion.div>
        </div>
    );
}
