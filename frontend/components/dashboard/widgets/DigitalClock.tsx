"use client";

import { useTickingClock } from "@/hooks/useTickingClock";
import { getDateLabel, getTimeParts, isValidTimezone } from "@/lib/clock";
import InvalidTimezoneNotice from "@/components/dashboard/widgets/InvalidTimezoneNotice";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function Digit({ value }: { value: string }) {
  return (
    <span className="rounded-md bg-zinc-800 px-2 py-1.5 font-mono text-2xl font-bold text-cyan-300">
      {value}
    </span>
  );
}

export default function DigitalClock({ timezone }: { timezone: string }) {
  const now = useTickingClock();

  if (!isValidTimezone(timezone)) {
    return <InvalidTimezoneNotice timezone={timezone} />;
  }

  const { hours, minutes, seconds } = getTimeParts(timezone, now);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-1">
        <Digit value={pad(hours)} />
        <span className="font-mono text-2xl font-bold text-zinc-600">:</span>
        <Digit value={pad(minutes)} />
        <span className="font-mono text-2xl font-bold text-zinc-600">:</span>
        <Digit value={pad(seconds)} />
      </div>
      <p className="text-xs text-zinc-500">
        {timezone} · {getDateLabel(timezone, now)}
      </p>
    </div>
  );
}
