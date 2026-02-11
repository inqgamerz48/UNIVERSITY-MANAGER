import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileText, Bell, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Separate dashboards for Students, Faculty, Admins, and Super Admins with granular permissions.",
  },
  {
    icon: FileText,
    title: "Assignment Management",
    description: "Create, submit, and grade assignments with automatic tracking and notifications.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Instant updates for assignments, attendance, grades, and announcements.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into academic performance and institutional metrics.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Row-level security, JWT authentication, and role-based access control.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built on Next.js with Vercel Edge Network for sub-second page loads.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg gold-gradient flex items-center justify-center">
              <span className="text-black font-bold text-xl">U</span>
            </div>
            <span className="text-xl font-bold gold-text">UNI Manager</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="gold">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <Badge variant="secondary" className="mb-4">
              Powered by Vercel & Supabase
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600">
              College Management
              <br />
              Reimagined
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive unified platform for managing academic operations, attendance,
              assignments, complaints, and more - all in one place.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" className="gold">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Demo Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card hover:gold-border transition-all duration-300">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-gold-500 mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Institution?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of educational institutions using UNI Manager.
            </p>
            <Link href="/register">
              <Button size="lg" className="gold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 UNI Manager. Built with Next.js and Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
