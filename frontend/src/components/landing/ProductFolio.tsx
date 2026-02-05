"use client";

import { motion } from "framer-motion";

export default function ProductFolio() {
    return (
        <div className="relative w-full max-w-6xl mx-auto mt-20 perspective-1000">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--accent-gold)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

            {/* The Folio Container */}
            <motion.div
                initial={{ rotateX: 20, opacity: 0, scale: 0.9 }}
                animate={{ rotateX: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="relative z-10 w-full aspect-[16/10] bg-[#0A0E12] rounded-2xl border border-[var(--border-medium)] shadow-2xl overflow-hidden group"
            >
                {/* Leather Folio Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-[0.2] pointer-events-none mix-blend-overlay" />

                {/* Inner Content (Dashboard Preview) */}
                <div className="absolute inset-[4px] md:inset-[8px] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                    {/* Mock Dashboard UI - Replacing global glass styles with specific ones */}
                    <div className="w-full h-full flex flex-col">
                        {/* Mock Header */}
                        <div className="h-12 border-b border-[var(--border-subtle)] flex items-center px-4 gap-2 bg-[var(--bg-tertiary)]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="ml-4 h-6 w-96 bg-[var(--bg-secondary)] rounded-md border border-[var(--border-subtle)]" />
                        </div>

                        {/* Mock Body */}
                        <div className="flex-1 flex">
                            {/* Mock Sidebar */}
                            <div className="w-64 border-r border-[var(--border-subtle)] p-4 hidden md:flex flex-col gap-3 bg-[var(--bg-secondary)]">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-8 w-full bg-[var(--bg-tertiary)] rounded-lg opacity-50" />
                                ))}
                            </div>

                            {/* Mock Content */}
                            <div className="flex-1 p-6 bg-[var(--bg-primary)] grid grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm" />
                                ))}
                                <div className="col-span-3 h-64 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm mt-2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reflection/Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 pointer-events-none" />
            </motion.div>

            {/* Caption */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-6 text-[var(--text-muted)] font-mono text-xs uppercase tracking-widest"
            >
                Figure 1.1: The Administrative Console
            </motion.div>
        </div>
    );
}
