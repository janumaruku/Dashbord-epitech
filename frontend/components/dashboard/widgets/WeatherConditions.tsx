import { Gauge, Sun, Wind } from "lucide-react";
import type { WeatherConditionsData } from "@/lib/weather";

export default function WeatherConditions({ data }: { data: WeatherConditionsData }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm font-semibold text-white">{data.city}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Wind size={14} />
          Wind
        </div>
        <p className="text-zinc-300">
          {data.wind_speed} {data.wind_units} · {data.wind_direction}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Gauge size={14} />
          Pressure
        </div>
        <p className="text-zinc-300">{data.pressure.toLocaleString()} hPa</p>
      </div>

      {data.uv_index !== undefined && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Sun size={14} />
            UV index
          </div>
          <p className="text-zinc-300">
            {data.uv_index} · {data.uv_category}
          </p>
        </div>
      )}
    </div>
  );
}
