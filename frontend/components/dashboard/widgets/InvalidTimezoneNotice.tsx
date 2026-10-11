import { AlertTriangle } from "lucide-react";

export default function InvalidTimezoneNotice({ timezone }: { timezone: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <AlertTriangle size={20} className="text-rose-400" />
      <p className="text-xs text-zinc-500">
        &quot;{timezone}&quot; isn&apos;t a valid timezone. Edit this widget with an IANA
        name, e.g. Europe/Paris.
      </p>
    </div>
  );
}
