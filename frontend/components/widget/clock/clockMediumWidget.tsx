"use client";

import {
  useEffect,
  useState,
} from "react";

import WidgetHeader from "@/components/widget/widgetHeader";
import WidgetFooter from "@/components/widget/widgetFooter";
import WidgetDeleteConfirm from "@/components/widget/widgetDeleteConfirm";

import ClockConfigModal, {
  type ClockConfig,
  type ClockTimeFormat,
  type ClockWidgetType,
} from "@/components/widget/clock/clockConfigModal";

type ClockMediumWidgetProps = {
  city: string;
  timeZone: string;
  widgetType: ClockWidgetType;
  timeFormat: ClockTimeFormat;

  onConfigSave: (config: ClockConfig) => void;
  onDelete: () => void;
};

type DigitBoxProps = {
  value: string;
};

function DigitBox({
  value,
}: DigitBoxProps) {
  return (
    <div className="relative flex h-12 w-9 items-center justify-center overflow-hidden rounded-md bg-zinc-800 sm:h-20 sm:w-16 sm:rounded-lg">
      <div className="absolute left-0 right-0 top-1/2 border-t border-zinc-700" />

      <span className="relative z-10 font-mono text-2xl font-semibold text-cyan-400 sm:text-4xl">
        {value}
      </span>
    </div>
  );
}

export default function ClockMediumWidget({
  city,
  timeZone,
  widgetType,
  timeFormat,
  onConfigSave,
  onDelete,
}: ClockMediumWidgetProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setNow(new Date());
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  function openConfig() {
    setMenuOpen(false);
    setConfigOpen(true);
  }

  function closeConfig() {
    setConfigOpen(false);
  }

  function backToMenuFromConfig() {
    setConfigOpen(false);
    setMenuOpen(true);
  }

  function saveConfig(config: ClockConfig) {
    onConfigSave(config);
    setConfigOpen(false);
  }

  function openDeleteConfirm() {
    setMenuOpen(false);
    setDeleteOpen(true);
  }

  function closeDeleteConfirm() {
    setDeleteOpen(false);
  }

  function backToMenuFromDelete() {
    setDeleteOpen(false);
    setMenuOpen(true);
  }

  function confirmDelete() {
    setDeleteOpen(false);
    onDelete();
  }

  const timeParts =
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: timeFormat === "12h",
    }).formatToParts(now);

  const hours =
    timeParts.find(
      (part) => part.type === "hour"
    )?.value ?? "00";

  const minutes =
    timeParts.find(
      (part) => part.type === "minute"
    )?.value ?? "00";

  const seconds =
    timeParts.find(
      (part) => part.type === "second"
    )?.value ?? "00";

  const dayPeriod =
    timeParts.find(
      (part) => part.type === "dayPeriod"
    )?.value ?? "";

  const formattedDate =
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(now);

  const timeZoneLabel =
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      timeZoneName: "short",
    })
      .formatToParts(now)
      .find(
        (part) =>
          part.type === "timeZoneName"
      )?.value ?? "";

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white">
      <div className="shrink-0">
        <WidgetHeader
          title="CLOCK"
          onConfigure={openConfig}
          onDelete={openDeleteConfirm}
          menuOpen={menuOpen}
          onMenuOpenChange={setMenuOpen}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-2 sm:px-4 sm:py-3">
        <p className="mb-2 text-xs text-zinc-400 sm:mb-4 sm:text-sm">
          {city}

          {timeZoneLabel &&
            ` · ${timeZoneLabel}`}
        </p>

        <div className="flex w-full items-center justify-center gap-1 sm:gap-2">
          <DigitBox value={hours[0]} />
          <DigitBox value={hours[1]} />

          <span className="pb-1 text-xl font-semibold text-cyan-400 sm:text-3xl">
            :
          </span>

          <DigitBox value={minutes[0]} />
          <DigitBox value={minutes[1]} />

          <span className="pb-1 text-xl font-semibold text-cyan-400 sm:text-3xl">
            :
          </span>

          <DigitBox value={seconds[0]} />
          <DigitBox value={seconds[1]} />

          {timeFormat === "12h" &&
            dayPeriod && (
              <span className="ml-1 text-xs font-medium text-zinc-400 sm:text-sm">
                {dayPeriod}
              </span>
            )}
        </div>

        <p className="mt-2 text-xs text-zinc-500 sm:mt-5 sm:text-sm">
          {formattedDate}
        </p>
      </div>

      <div className="shrink-0">
        <WidgetFooter
          lastUpdated="just now"
          sourceUrl="https://time.is/"
          sourceName="Time"
        />
      </div>

      {configOpen && (
        <ClockConfigModal
          city={city}
          timeZone={timeZone}
          widgetType={widgetType}
          timeFormat={timeFormat}
          onBack={backToMenuFromConfig}
          onClose={closeConfig}
          onSave={saveConfig}
        />
      )}

      {deleteOpen && (
        <WidgetDeleteConfirm
          onBack={backToMenuFromDelete}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      )}
    </article>
  );
}