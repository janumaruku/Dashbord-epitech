import Header from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import DashboardGrid from "@/components/dashboard/dashboardGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-73px)]">
        <SideBar />

        <div className="min-w-0 flex-1 p-6">
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>

          <div className="mt-4">
            <DashboardGrid />
          </div>
        </div>
      </div>
    </main>
  );
}