import Header from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-73px)]">
        <SideBar />

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">
            Services
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage the services available on your dashboard.
          </p>
        </div>
      </div>
    </main>
  );
}