import { formatDuration } from "@/lib/widgets";

type RefreshRateFieldProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function RefreshRateField({ value, onChange }: RefreshRateFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-zinc-300">Refresh rate · required</label>
      <p className="text-sm font-semibold text-white">
        {value} seconds · {formatDuration(value)}
      </p>
      <input
        type="range"
        min={5}
        max={3600}
        step={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
      <div className="flex justify-between text-xs text-zinc-600">
        <span>5 seconds</span>
        <span>3600 seconds</span>
      </div>
      <p className="text-xs text-zinc-600">Adjust in 5-second steps.</p>
    </div>
  );
}
