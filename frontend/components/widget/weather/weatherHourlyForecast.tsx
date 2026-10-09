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
    <div className="grid grid-cols-6">
      {forecast.map((hour) => (
        <div
          key={hour.time}
          className="flex flex-col items-center"
        >
          <p className="text-xs text-zinc-500">
            {hour.time}
          </p>

          <div className="my-1">
            <WeatherIcon
              weatherCode={hour.weatherCode}
              size={26}
            />
          </div>

          <p className="text-sm font-medium">
            {hour.temperature}°
          </p>
        </div>
      ))}
    </div>
  );
}
