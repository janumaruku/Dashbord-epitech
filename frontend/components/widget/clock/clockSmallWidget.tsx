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

type ClockSmallWidgetProps = {
  city: string;
  timeZone: string;
  widgetType: ClockWidgetType;
  timeFormat: ClockTimeFormat;

  onConfigSave: (
    config: ClockConfig
  ) => void;
};

export default function ClockSmallWidget({
  city,
  timeZone,
  widgetType,
  timeFormat,
  onConfigSave,
}: ClockSmallWidgetProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [configOpen, setConfigOpen] =
    useState(false);

  const [now, setNow] =
    useState(new Date());

  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setNow(new Date());
        },
        1000
      );

    return () =>
      window.clearInterval(
        interval
      );
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

  function saveConfig(
    config: ClockConfig
  ) {
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

    console.log(
      "Delete clock widget"
    );
  }

  const timeParts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12:
          timeFormat === "12h",
      }
    ).formatToParts(now);

  const hours = Number(
    timeParts.find(
      (part) =>
        part.type === "hour"
    )?.value ?? 0
  );

  const minutes = Number(
    timeParts.find(
      (part) =>
        part.type === "minute"
    )?.value ?? 0
  );

  const seconds = Number(
    timeParts.find(
      (part) =>
        part.type === "second"
    )?.value ?? 0
  );

  const hourRotation =
    (hours % 12) * 30 +
    minutes * 0.5 +
    seconds / 120;

  const minuteRotation =
    minutes * 6 +
    seconds * 0.1;

  const secondRotation =
    seconds * 6;

  const formattedDate =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone,
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    ).format(now);

  const timeZoneLabel =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone,
        timeZoneName: "short",
      }
    )
      .formatToParts(now)
      .find(
        (part) =>
          part.type ===
          "timeZoneName"
      )?.value ?? "";

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white">
      <div className="shrink-0">
        <WidgetHeader
          title="CLOCK"
          onConfigure={
            openConfig
          }
          onDelete={
            openDeleteConfirm
          }
          menuOpen={
            menuOpen
          }
          onMenuOpenChange={
            setMenuOpen
          }
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 py-2">
        <p className="mb-1.5 text-xs text-zinc-400">
          {city}

          {timeZoneLabel &&
            ` · ${timeZoneLabel}`}
        </p>

        <div className="relative aspect-square w-24 shrink-0 rounded-full bg-zinc-800">
          {Array.from({
            length: 12,
          }).map(
            (_, index) => {
              const angle =
                index * 30;

              return (
                <div
                  key={
                    index
                  }
                  className="absolute left-1/2 top-1/2 h-full w-px"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  <div className="mx-auto mt-1.5 h-1 w-1 rounded-full bg-zinc-600" />
                </div>
              );
            }
          )}

          <div
            className="absolute left-1/2 top-1/2 h-[2px] w-[34%] origin-left rounded-full bg-zinc-100"
            style={{
              transform: `rotate(${hourRotation - 90}deg)`,
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 h-[2px] w-[42%] origin-left rounded-full bg-zinc-100"
            style={{
              transform: `rotate(${minuteRotation - 90}deg)`,
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 h-px w-[42%] origin-left bg-cyan-400"
            style={{
              transform: `rotate(${secondRotation - 90}deg)`,
            }}
          />

          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400" />
        </div>

        <p className="mt-1.5 text-xs text-zinc-500">
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
          timeZone={
            timeZone
          }
          widgetType={
            widgetType
          }
          timeFormat={
            timeFormat
          }
          onBack={
            backToMenuFromConfig
          }
          onClose={
            closeConfig
          }
          onSave={
            saveConfig
          }
        />
      )}

      {deleteOpen && (
        <WidgetDeleteConfirm
          onBack={
            backToMenuFromDelete
          }
          onClose={
            closeDeleteConfirm
          }
          onConfirm={
            confirmDelete
          }
        />
      )}
    </article>
  );
}