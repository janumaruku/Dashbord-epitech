import Link from "next/link";

export default function LoginForm() {
    return (
        <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
            <h1 className="mb-8 text-center text-3xl font-bold tracking-wide">
                Sign in to your dashboard
            </h1>
            <form className="flex flex-col gap-5">
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
                <button
                    type="submit"
                    className="mt-2 rounded-lg bg-white px-4 py-3 font-medium text-black hover:bg-zinc-200"
                    >
                    Sign in
                </button>
                <p className="text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-white hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    )
}