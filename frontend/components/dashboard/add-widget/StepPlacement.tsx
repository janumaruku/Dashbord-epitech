import { GRID_COLUMNS, type Position } from "@/lib/widgets";
import RefreshRateField from "@/components/dashboard/RefreshRateField";

type StepPlacementProps = {
  refreshRate: number;
  onRefreshRateChange: (value: number) => void;
  position: Position;
  onPositionChange: (position: Position) => void;
};

export default function StepPlacement({
  refreshRate,
  onRefreshRateChange,
  position,
  onPositionChange,
}: StepPlacementProps) {
  function updateField(key: keyof Position, value: number) {
    onPositionChange({ ...position, [key]: Number.isFinite(value) ? value : 0 });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white">Refresh and placement</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Set an update interval and a starting spot on your dashboard.
        </p>
      </div>

      <RefreshRateField value={refreshRate} onChange={onRefreshRateChange} />

      <div className="flex flex-col gap-2 border-t border-zinc-800 pt-5">
        <p className="text-sm font-semibold text-white">Initial position</p>
        <p className="text-xs text-zinc-500">
          We found the first free spot that fits this widget. Edit below if you&apos;d
          like.
        </p>

        <div className="mt-2 grid grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">X · column</label>
            <input
              type="number"
              min={0}
              value={position.x}
              onChange={(event) => updateField("x", Number(event.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">Y · row</label>
            <input
              type="number"
              min={0}
              value={position.y}
              onChange={(event) => updateField("y", Number(event.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">W · width</label>
            <input
              type="number"
              min={1}
              value={position.w}
              onChange={(event) => updateField("w", Number(event.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">H · height</label>
            <input
              type="number"
              min={1}
              value={position.h}
              onChange={(event) => updateField("h", Number(event.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-600">
          {GRID_COLUMNS}-column grid. X and Y ≥ 0; width and height &gt; 0; X + width ≤{" "}
          {GRID_COLUMNS}.
        </p>
      </div>
    </div>
  );
}
