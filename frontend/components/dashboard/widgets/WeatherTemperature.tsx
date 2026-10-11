import { Droplet } from "lucide-react";
import WeatherIcon from "@/components/dashboard/widgets/WeatherIcon";
import { unitSymbol, type WeatherTemperatureData } from "@/lib/weather";

export default function WeatherTemperature({ data }: { data: WeatherTemperatureData }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{data.city}</p>
        <WeatherIcon condition={data.condition} className="text-amber-400" />
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-white">{Math.round(data.temperature)}°</span>
        <span className="text-sm text-zinc-500">{unitSymbol(data.units)}</span>
      </div>

      <p className="text-sm text-zinc-400">{data.condition}</p>

      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Droplet size={14} />
        Humidity {data.humidity}%
      </div>
    </div>
  );
}
