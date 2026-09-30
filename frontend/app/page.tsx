import Header from "@/components/dashboard/header";
import WeatherSmallWidget from "@/components/widget/weather/weather-small";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <section className="grid grid-cols-[repeat(auto-fit,minmax(224px,max-content))] gap-4 p-4 mt-8">
        <WeatherSmallWidget
           city="Paris"
           temperature={18}
           condition="Cloudly"
        />
        <WeatherSmallWidget
           city="Tokyo"
           temperature={25}
           condition="Cloudly"
        />
      </section>
    </main>
  )
}
