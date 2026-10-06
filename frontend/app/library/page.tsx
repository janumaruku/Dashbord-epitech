import Header from "@/components/library/header"

export default function LibraryPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Header />
            <p className="mt-4 text-zinc-400">
                Choose a widget to add to your dashboard.
            </p>
        </main>
    );
}