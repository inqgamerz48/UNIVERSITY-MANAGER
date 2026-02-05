"use client";

import { motion } from "framer-motion";
import { Shield, Database, LayoutDashboard, Clock, Users, Globe } from "lucide-react";

const features = [
    {
        title: "Role-Based Access",
        description: "Granular permissions for Admins, Faculty, and Students ensuring secure data isolation.",
        icon: Shield,
        variant: "gold",
    },
    {
        title: "Start Instantly",
        description: "Pre-populated with mock data so you can experience the full power of the system immediately.",
        icon: Clock,
        variant: "sage",
    },
    {
        title: "Centralized Records",
        description: "A single source of truth for all academic department, subject, and student data.",
        icon: Database,
        variant: "blue",
    },
    {
        title: "Modern Interface",
        description: "Art-driven, dark-mode first design that treats enterprise software as a craft.",
        icon: LayoutDashboard,
        variant: "gold",
    },
    {
        title: "Faculty Portal",
        description: "Dedicated spaces for professors to manage coursework and student progress.",
        icon: Users,
        variant: "copper",
    },
    {
        title: "Global Standards",
        description: "Built on modern web standards ensuring accessibility and performance globally.",
        icon: Globe,
        variant: "sage",
    },
];

export default function FeatureGrid() {
    return (
        <div className="w-full max-w-7xl mx-auto mt-40 px-6 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="group cursor-default relative overflow-hidden bg-[var(--bg-secondary)]/50 backdrop-blur-sm border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30 transition-all duration-500 p-8 rounded-3xl"
                    >
                        {/* Hover Glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-gold)] opacity-0 group-hover:opacity-[0.08] blur-[80px] transition-opacity duration-700 rounded-full translate-x-12 -translate-y-12" />

                        <div className={`stat-icon ${feature.variant} mb-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                            <feature.icon size={28} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-4 group-hover:text-[var(--accent-gold)] transition-colors duration-300">
                            {feature.title}
                        </h3>

                        <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
