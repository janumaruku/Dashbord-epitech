"use client";

import { useTickingClock } from "@/hooks/useTickingClock";
import { getDateLabel, getTimeParts, isValidTimezone } from "@/lib/clock";
import InvalidTimezoneNotice from "@/components/dashboard/widgets/InvalidTimezoneNotice";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function DigitTile({ value }: { value: string }) {
  return (
    <span className="relative flex h-[60px] w-11 items-center justify-center overflow-hidden rounded-lg bg-zinc-800 font-mono text-4xl font-bold text-cyan-400">
      {value}
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black" />
    </span>
  );
}

function ColonSeparator() {
  return (
    <span className="flex h-[60px] w-3.5 items-center justify-center font-mono text-3xl font-bold text-cyan-400">
      :
    </span>
  );
}

export default function DigitalClock({ timezone }: { timezone: string }) {
  const now = useTickingClock();

  if (!isValidTimezone(timezone)) {
    return <InvalidTimezoneNotice timezone={timezone} />;
  }

  const { hours, minutes, seconds } = getTimeParts(timezone, now);
  const [h1, h2] = pad(hours);
  const [m1, m2] = pad(minutes);
  const [s1, s2] = pad(seconds);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-1">
        <DigitTile value={h1} />
        <DigitTile value={h2} />
        <ColonSeparator />
        <DigitTile value={m1} />
        <DigitTile value={m2} />
        <ColonSeparator />
        <DigitTile value={s1} />
        <DigitTile value={s2} />
      </div>
      <p className="text-xs text-zinc-500">
        {timezone} · {getDateLabel(timezone, now)}
      </p>
    </div>
  );
}
