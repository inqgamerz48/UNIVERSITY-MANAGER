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
        <div className="w-full max-w-6xl mx-auto mt-32 px-4 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="card group cursor-default relative overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-gold)] opacity-0 group-hover:opacity-[0.05] blur-[50px] transition-opacity duration-500 rounded-full translate-x-10 -translate-y-10" />

                        <div className={`stat-icon ${feature.variant} mb-6 w-14 h-14 rounded-2xl flex items-center justify-center`}>
                            <feature.icon size={26} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-gold)] transition-colors">
                            {feature.title}
                        </h3>

                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
