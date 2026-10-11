import { Inbox } from "lucide-react";

export default function NoDataPlaceholder({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <Inbox size={20} className="text-zinc-600" />
      <p className="text-xs text-zinc-500">{message ?? "No data yet"}</p>
    </div>
  );
}
