export default function RegisterForm() {
    return (
        <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-lg">
            <h1 className="mb-8 text-center text-3xl font-bold tracking-wide">
                REGISTER
            </h1>

            <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-sm text-zinc-300">
                        First name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        className="rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-zinc-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-sm text-zinc-300">
                        Last name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        className="rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-zinc-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm text-zinc-300">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-zinc-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm text-zinc-300">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-zinc-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="text-sm text-zinc-300">
                        Confirm password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        className="rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-zinc-500"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-2 rounded-lg bg-white px-4 py-3 font-medium text-black hover:bg-zinc-200"
                    >
                    Create account
                </button>
            </form>
        </div>
    )
}