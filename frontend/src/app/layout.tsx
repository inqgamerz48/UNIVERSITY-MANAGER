import type { Metadata } from "next";
import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs"; // Removing Clerk
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "UniManager - University Management System",
  description: "Modern university management platform for students, faculty, and administrators",
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
