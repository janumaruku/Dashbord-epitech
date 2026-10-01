"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        // Temporaire : on considère que l'inscription a réussi
        const registrationSuccessful = true;

        if (registrationSuccessful) {
            router.push("/login");
        }
    }
    return (
        <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
            <h1 className="mb-8 text-center text-3xl font-bold tracking-wide">
                Sign up
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-sm text-zinc-300">
                        First name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        className="rounded-lg border border-zinc-600 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-sm text-zinc-300">
                        Last name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        className="rounded-lg border border-zinc-600 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm text-zinc-300">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="rounded-lg border border-zinc-600 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm text-zinc-300">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="rounded-lg border border-zinc-600 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="text-sm text-zinc-300">
                        Confirm password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        className="rounded-lg border border-zinc-600 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-2 rounded-lg bg-white px-4 py-3 font-medium text-black hover:bg-zinc-200"
                    >
                    Create account
                </button>
                <p className="text-center text-sm text-zinc-400">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-white hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    )
}