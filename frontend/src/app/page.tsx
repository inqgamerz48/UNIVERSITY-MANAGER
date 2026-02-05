import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden flex flex-col justify-between">

      {/* Texture: Washi Paper Grain (Subtle Noise) */}
      <div className="fixed inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]" />

      {/* Main Content: Centered & Balanced */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full max-w-[1600px] mx-auto">

        {/* Title Block: Vertical Rhythm */}
        <div className="text-center mb-24 md:mb-32">
          <h1 className="font-display text-7xl md:text-9xl tracking-tight leading-[0.9] text-[var(--text-primary)] mb-6">
            Uni<span className="text-[var(--text-muted)] italic serif">Manager</span>
          </h1>
          <p className="font-mono text-sm md:text-base text-[var(--text-secondary)] tracking-widest uppercase opacity-80">
            The Scholar&apos;s Operating System v2.0
          </p>
        </div>

        {/* The Two Paths: Massive Interaction Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

          {/* Path 1: The New Comer (Vermilion) */}
          <Link
            href="/sign-in"
            className="group relative h-64 md:h-80 w-full bg-[#DC2626] rounded-sm flex flex-col justify-between p-8 hover:bg-[#B91C1C] transition-colors duration-500 shadow-xl overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-white/70 text-sm">01 / BEGIN</span>
              <ArrowRight className="text-white w-8 h-8 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>

            <div className="relative z-10">
              <span className="block text-5xl md:text-6xl text-white font-display font-medium tracking-tight">
                Enter Dojo
              </span>
              <span className="block text-white/80 mt-2 font-mono text-xs">
                Create your academic profile
              </span>
            </div>

            {/* Hover Ink Blot Effect */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </Link>

          {/* Path 2: The Returning Scholar (Ink) */}
          <Link
            href="/dashboard"
            className="group relative h-64 md:h-80 w-full bg-[#1C1917] rounded-sm flex flex-col justify-between p-8 hover:bg-black transition-colors duration-500 shadow-xl overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-white/50 text-sm">02 / RESUME</span>
              <LayoutDashboard className="text-white/70 w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="relative z-10">
              <span className="block text-5xl md:text-6xl text-white font-display font-medium tracking-tight">
                Dashboard
              </span>
              <span className="block text-white/50 mt-2 font-mono text-xs">
                Access your console
              </span>
            </div>
          </Link>

        </div>

      </main>

      {/* Footer: Minimalist Haiku */}
      <footer className="relative z-10 py-12 px-6 w-full text-center border-t border-[var(--border-subtle)]">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1600px] mx-auto gap-8">

          <div className="font-mono text-xs text-[var(--text-muted)] text-left space-y-1">
            <p>DESIGNED FOR CLARITY</p>
            <p>BUILT FOR SPEED</p>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <span className="block font-display text-2xl">4.0</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">GPA Scale</span>
            </div>
            <div className="w-px h-8 bg-[var(--border-medium)]" />
            <div className="text-center">
              <span className="block font-display text-2xl">100%</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Uptime</span>
            </div>
          </div>

          <p className="font-mono text-xs text-[var(--text-muted)]">
            © 2026 UNIMANAGER INC.
          </p>
        </div>
      </footer>

    </div>
  );
}
