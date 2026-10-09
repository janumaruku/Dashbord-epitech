import Header from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import WeatherSmallWidget from "@/components/widget/weather/weatherSmallWidget";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-73px)]">
        <SideBar />

        <div className="flex-1 p-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Dashboard
            </h1>

            <p className="mt-2 text-zinc-400">
              View and manage your widgets in one place.
            </p>
          </div>

          <section className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(256px,max-content))] gap-4">
            <WeatherSmallWidget
              city="Paris"
              temperature={18}
              condition="Cloudy"
              weatherCode={803}
            />

            <WeatherSmallWidget
              city="Tokyo"
              temperature={25}
              condition="Clear"
              weatherCode={800}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
