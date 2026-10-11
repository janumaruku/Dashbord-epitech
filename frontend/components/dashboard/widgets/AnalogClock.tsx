"use client";

import { useTickingClock } from "@/hooks/useTickingClock";
import { getDateLabel, getTimeParts } from "@/lib/clock";

export default function AnalogClock({ timezone }: { timezone: string }) {
  const now = useTickingClock();
  const { hours, minutes, seconds } = getTimeParts(timezone, now);

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <svg viewBox="0 0 100 100" className="h-28 w-28">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          className="text-zinc-700"
          strokeWidth="2"
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          stroke="currentColor"
          className="text-white"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="16"
          stroke="currentColor"
          className="text-white"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="12"
          stroke="currentColor"
          className="text-blue-400"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondAngle} 50 50)`}
        />
        <circle cx="50" cy="50" r="2.5" fill="currentColor" className="text-white" />
      </svg>
      <p className="text-xs text-zinc-500">
        {timezone} · {getDateLabel(timezone, now)}
      </p>
    </div>
  );
}
