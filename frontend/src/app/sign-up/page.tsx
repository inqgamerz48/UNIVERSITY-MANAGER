"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });

            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to sign up.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success("Signed up with Google!");
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to sign up with Google.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
            <div className="w-full max-w-md space-y-8 p-8 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        Create an account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-[var(--action-primary)] py-2 px-3 text-sm font-semibold text-white hover:bg-[var(--action-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {loading ? "Signing up..." : "Sign up"}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[var(--border-subtle)]" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-[var(--bg-secondary)] px-2 text-[var(--text-secondary)]">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M12.0003 20.45c4.656 0 8.16-3.235 8.16-7.986 0-.745-.092-1.396-.214-1.925h-7.946v3.42h4.636c-.183 1.135-.85 2.502-2.31 3.498v2.33h3.766c2.204-2.03 3.473-5.018 3.473-8.558 0-.909-.138-1.764-.318-2.585H12.0003v4.905h4.636c-1.05 3.018-3.953 5.345-7.636 5.345-4.57 0-8.28-3.71-8.28-8.28s3.71-8.28 8.28-8.28c2.096 0 3.992.705 5.502 2.15l3.52-3.52C15.86.828 13.985-.05 12.0003-.05 5.372-.05 0 5.322 0 11.95s5.372 12 12.0003 12z" fill="currentColor" />
                            </svg>
                            Sign up with Google
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/sign-in" className="font-medium text-[var(--action-primary)] hover:text-[var(--action-primary-hover)]">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
