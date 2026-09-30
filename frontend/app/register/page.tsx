import Header from "@/components/auth/header";
import RegisterForm from "@/components/auth/registerForm"

export default function RegisterPage() {
    return (
        <main className="relative min-h-screen bg-black px-4 text-white">
            <Header />
            <div className="flex min-h-screen items-center justify-center">
                <RegisterForm />
            </div>
        </main>
    )
}