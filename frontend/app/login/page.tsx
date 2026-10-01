import Header from "@/components/auth/login/header";
import LoginForm from "@/components/auth/login/loginForm";


export default function LoginPage() {
    return (
        <main className="relative min-h-screen bg-black px-4 text-white">
            <Header />
            <div className="flex min-h-screen items-center justify-center">
                <LoginForm />
            </div>
        </main>
    )
}