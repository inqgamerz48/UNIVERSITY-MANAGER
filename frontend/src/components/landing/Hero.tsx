"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (

        <div className="relative flex flex-col items-center text-center max-w-5xl mx-auto pt-32 pb-16 px-6">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-gold mb-10 px-5 py-2 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 shadow-[0_0_25px_rgba(212,168,83,0.15)] backdrop-blur-md"
            >
                <GraduationCap size={16} className="mr-2.5" />
                <span className="tracking-widest text-xs font-bold uppercase text-[var(--accent-gold)]">University Management System v1.0</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-[var(--text-primary)] mb-10 tracking-tight leading-[1.05]"
            >
                Academic Excellence <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--text-secondary)] via-[var(--text-muted)] to-[var(--text-secondary)] opacity-80">Meets Modern Craft</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-3xl leading-relaxed text-balance font-light"
            >
                Streamline university operations with a premium, role-based platform designed for
                administrators, faculty, and students. Efficient, secure, and beautiful.
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
    );
}
