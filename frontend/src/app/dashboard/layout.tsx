"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen">
                <Sidebar />
                <main className="main-content">
                    <Header />
                    <div className="animate-fade-up">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}

