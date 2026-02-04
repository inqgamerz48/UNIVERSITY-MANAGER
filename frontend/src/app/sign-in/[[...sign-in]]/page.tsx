import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass rounded-3xl p-12 animate-slideUp">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">🎓 UniManager</h1>
                    <p className="text-white/70">University Management System</p>
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-transparent shadow-none",
                            headerTitle: "text-white",
                            headerSubtitle: "text-white/70",
                            socialButtonsBlockButton:
                                "bg-white/15 border border-white/30 text-white hover:bg-white/25",
                            formFieldLabel: "text-white",
                            formFieldInput:
                                "bg-white/15 border-white/30 text-white placeholder:text-white/50",
                            formButtonPrimary:
                                "bg-gradient-to-r from-white/30 to-white/10 border border-white/40 hover:from-white/40 hover:to-white/20",
                            footerActionLink: "text-white hover:text-white/80",
                            dividerLine: "bg-white/20",
                            dividerText: "text-white/50",
                        },
                    }}
                />
            </div>
        </div>
    );
}
