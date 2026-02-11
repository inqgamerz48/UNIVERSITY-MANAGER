import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 gold-glow">
            <span className="text-black font-bold text-3xl">U</span>
          </div>
          <h1 className="text-3xl font-bold gold-text">UNI Manager</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
