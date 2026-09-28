import { Cloud, MoreVertical } from "lucide-react";

type WeatherSmallWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
}

export default function WeatherSmallWidget(
  {city,
  temperature,
  condition,
}: WeatherSmallWidgetProps) {
  return (
    <article className="relative w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-3 pb-2 text-white">
    <button
        type="button"
        className="absolute right-2 top-3 text-zinc-400"
        aria-label="Widget options"
      >
        <MoreVertical size={18} />
      </button>
      <p className="text-base text-zinc-400">{city}</p>

      <div className="mt-4 flex items-center gap-9">
        <div>
          <p className="text-3xl font-semibold">{temperature}°C</p>
          <p className="mt-1 text-base text-zinc-400">{condition}</p>
        </div>
        <Cloud size={80} className="mt-2 text-zinc-400" />
      </div>
       <div className="mt-5 border-t border-zinc-800 pt-1">
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-white"
        >
          Open Weather
        </a>
      </div>
    </article>
  );
}
