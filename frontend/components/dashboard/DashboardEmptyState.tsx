import { LayoutDashboard, Plus } from "lucide-react";

export default function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
        <LayoutDashboard size={22} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold text-white">Make this space your own</h2>
        <p className="max-w-sm text-sm text-zinc-400">
          Add your first widget to bring weather, GitHub activity, or a favorite feed into
          view.
        </p>
      </div>
      <button
        type="button"
        disabled
        title="The Add Widget flow isn't built yet."
        className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3.5 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={15} />
        Add widget
      </button>
    </div>
  );
}
