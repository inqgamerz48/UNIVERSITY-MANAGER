export default function Footer() {
    return (
        <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-12 px-4 mt-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h4 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">UniManager</h4>
                    <p className="text-sm text-[var(--text-secondary)] font-mono">
                        Crafted with Next.js 15 & Tailwind v4
                    </p>
                </div>

                <div className="flex gap-8 text-sm text-[var(--text-muted)]">
                    <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Documentation</a>
                    <a href="#" className="hover:text-[var(--text-primary)] transition-colors">GitHub</a>
                    <a href="#" className="hover:text-[var(--text-primary)] transition-colors">License</a>
                </div>
            </div>
        </footer>
    );
}
