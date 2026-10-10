import Header from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import DashboardGrid from "@/components/dashboard/dashboardGrid";
import AddWidgetButton from "@/components/dashboard/addWidget";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="xl:flex">
        <SideBar />

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl font-semibold">
              Dashboard
            </h1>

            <div className="hidden xl:block">
              <AddWidgetButton />
            </div>

            <div className="xl:hidden">
              <AddWidgetButton compact />
            </div>
          </div>

          <div className="mt-4">
            <DashboardGrid />
          </div>
        </div>
      </div>
    </main>
  );
}