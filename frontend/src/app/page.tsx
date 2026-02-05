import Hero from "@/components/landing/Hero";
import ProductFolio from "@/components/landing/ProductFolio";
import FeatureGrid from "@/components/landing/FeatureGrid";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden selection:bg-[var(--accent-gold)] selection:text-[var(--bg-primary)]">
      {/* Background Decorative Elements */}
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-gold)] opacity-[0.03] blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-gold)] opacity-[0.02] blur-[150px]" />
      </div>

      <main className="relative z-10">
        <Hero />
        <ProductFolio />
        <FeatureGrid />
      </main>

      <Footer />
    </div>
  );
}
