"use client";

import { motion } from "framer-motion";

export default function ProductFolio() {
    return (
        <div className="relative w-full max-w-6xl mx-auto mt-24 px-6 opacity-0 animate-in fade-in zoom-in duration-1000 fill-mode-forwards">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[var(--accent-gold)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

            {/* The Folio Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full aspect-[16/10] bg-[#0A0E12] rounded-3xl border border-[var(--border-medium)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden group"
            >
                {/* Leather Folio Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-[0.15] pointer-events-none mix-blend-overlay" />

                {/* Inner Content (Dashboard Preview) */}
                <div className="absolute inset-[6px] md:inset-[12px] bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                    {/* Mock Dashboard UI - Replacing global glass styles with specific ones */}
                    <div className="w-full h-full flex flex-col">
                        {/* Mock Header */}
                        <div className="h-14 border-b border-[var(--border-subtle)] flex items-center px-6 gap-4 bg-[var(--bg-tertiary)]/50">
                            <div className="flex gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3.5 h-3.5 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="ml-6 h-8 w-96 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-subtle)]/50" />
                        </div>

                        {/* Mock Body */}
                        <div className="flex-1 flex">
                            {/* Mock Sidebar */}
                            <div className="w-72 border-r border-[var(--border-subtle)] p-6 hidden md:flex flex-col gap-4 bg-[var(--bg-secondary)]/30">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-10 w-full bg-[var(--bg-tertiary)]/50 rounded-xl opacity-60" />
                                ))}
                            </div>

                            {/* Mock Content */}
                            <div className="flex-1 p-8 bg-[var(--bg-primary)]/50 grid grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-40 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm" />
                                ))}
                                <div className="col-span-3 h-80 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm mt-2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reflection/Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 pointer-events-none" />
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
