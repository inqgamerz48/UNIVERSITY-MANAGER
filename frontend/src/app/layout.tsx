import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "UniManager | The Scholar's Operating System",
  description: "Clarity. Focus. Speed. A minimalist university management system for focused academic work.",
  keywords: ["university management", "minimalist lms", "academic focus", "unimanager"],
  openGraph: {
    title: "UniManager | The Scholar's Operating System",
    description: "Streamline university operations with a premium, role-based platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--accent-gold)',
                  secondary: 'var(--bg-primary)',
                },
              },
            }}
          />
        </body>
      </html>
    </AuthProvider>
  );
}
