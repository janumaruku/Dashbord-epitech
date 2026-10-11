import WeatherIcon from "@/components/dashboard/widgets/WeatherIcon";
import { dayLabel, unitSymbol, type WeatherForecastData } from "@/lib/weather";

export default function WeatherForecast({ data }: { data: WeatherForecastData }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{data.city}</p>
        <p className="text-xs text-zinc-500">{data.days.length} days</p>
      </div>

      <div className="flex w-full gap-2">
        {data.days.map((day) => (
          <div
            key={day.date}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg bg-zinc-800/60 px-2 py-3"
          >
            <p className="text-[11px] font-semibold uppercase text-zinc-500">
              {dayLabel(day.date)}
            </p>
            <WeatherIcon condition={day.condition} size={16} className="text-amber-400" />
            <p className="text-xs text-white">
              {Math.round(day.high)}° / {Math.round(day.low)}°{unitSymbol(data.units)}
            </p>
            <p className="text-center text-[10px] text-zinc-500">{day.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
