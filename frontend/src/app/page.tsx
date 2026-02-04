import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-12 max-w-lg text-center animate-slideUp">
        <h1 className="text-5xl font-bold text-white mb-4">🎓 UniManager</h1>
        <p className="text-xl text-white/70 mb-8">
          Modern University Management System
        </p>
        <p className="text-white/60 mb-8">
          Streamline your university operations with role-based access control,
          real-time analytics, and a beautiful glassmorphism interface.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-in"
            className="glass-button px-8 py-4 rounded-xl inline-block"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="bg-white/5 border border-white/20 px-8 py-4 rounded-xl text-white hover:bg-white/10 transition inline-block"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
