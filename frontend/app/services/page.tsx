import Header from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="xl:flex">
        <SideBar />

        <div className="min-w-0 flex-1 p-4 sm:p-6">
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
