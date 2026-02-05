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
                        className="group cursor-default relative overflow-hidden bg-[var(--bg-secondary)]/20 border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 transition-all duration-300 p-8 rounded-2xl"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className={`stat-icon ${feature.variant} mb-6 w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-gold)]/30 transition-colors`}>
                            <feature.icon size={24} strokeWidth={1.5} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] transition-colors" />
                        </div>

                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                            {feature.title}
                        </h3>

                        <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
