import { AlertTriangle } from "lucide-react";

export default function DashboardErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-400/10 text-rose-400">
        <AlertTriangle size={22} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold text-white">We couldn&apos;t load your dashboard</h2>
        <p className="text-sm text-zinc-400">Something went wrong, try again later</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-zinc-800 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-zinc-700"
      >
        Retry
      </button>
    </div>
  );
}
