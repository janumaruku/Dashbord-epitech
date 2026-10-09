import WeatherIcon from "@/components/widget/weather/weatherIcon";

type DailyWeather = {
  day: string;
  minTemperature: number;
  maxTemperature: number;
  weatherCode: number;
};

type WeatherDailyForecastProps = {
  forecast: DailyWeather[];
};

export default function WeatherDailyForecast({
  forecast,
}: WeatherDailyForecastProps) {
  return (
    <div className="divide-y divide-zinc-800">
      {forecast.map((day) => (
        <div
          key={day.day}
          className="grid h-9 grid-cols-[1fr_40px_48px_48px] items-center"
        >
          <p className="text-sm text-zinc-300">
            {day.day}
          </p>

          <div className="flex justify-center">
            <WeatherIcon
              weatherCode={day.weatherCode}
              size={24}
            />
          </div>

          <p className="text-right text-sm text-zinc-500">
            {day.minTemperature}°
          </p>

          <p className="text-right text-sm font-medium">
            {day.maxTemperature}°
          </p>
        </div>
      ))}
    </div>
  );
}
