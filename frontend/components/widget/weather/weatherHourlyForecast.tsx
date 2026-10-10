import WeatherIcon from "@/components/widget/weather/weatherIcon";

type HourlyWeather = {
  time: string;
  temperature: number;
  weatherCode: number;
};

type WeatherHourlyForecastProps = {
  forecast: HourlyWeather[];
};

export default function WeatherHourlyForecast({
  forecast,
}: WeatherHourlyForecastProps) {
  return (
    <div className="grid w-full grid-cols-6 gap-1">
      {forecast.map((hour) => (
        <div
          key={hour.time}
          className="flex min-w-0 flex-col items-center justify-center"
        >
          <p className="whitespace-nowrap text-[10px] text-zinc-500 sm:text-xs">
            {hour.time}
          </p>

          <div className="my-0.5">
            <WeatherIcon
              weatherCode={hour.weatherCode}
              size={22}
            />
          </div>

          <p className="text-xs font-medium sm:text-sm">
            {hour.temperature}°
          </p>
        </div>
      ))}
    </div>
  );
}
