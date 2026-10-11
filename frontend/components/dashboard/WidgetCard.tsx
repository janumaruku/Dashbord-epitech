"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { AlertTriangle, GripVertical, Maximize2, MoreHorizontal, Trash2 } from "lucide-react";
import type { WidgetInstance } from "@/hooks/useWidgetInstances";
import type { CatalogWidget } from "@/hooks/useWidgetCatalog";
import { accentForWidget, isClockWidget, titleForWidget } from "@/lib/widgets";
import { asRecord } from "@/lib/weather";
import type {
  WeatherConditionsData,
  WeatherForecastData,
  WeatherTemperatureData,
} from "@/lib/weather";
import type { GithubCommitsData, GithubProfileData, GithubReposData } from "@/lib/githubWidgets";
import type { RssLatestData, RssSummaryData } from "@/lib/rssWidgets";
import AnalogClock from "@/components/dashboard/widgets/AnalogClock";
import DigitalClock from "@/components/dashboard/widgets/DigitalClock";
import WeatherTemperature from "@/components/dashboard/widgets/WeatherTemperature";
import WeatherConditions from "@/components/dashboard/widgets/WeatherConditions";
import WeatherForecast from "@/components/dashboard/widgets/WeatherForecast";
import GithubProfile from "@/components/dashboard/widgets/GithubProfile";
import GithubRepos from "@/components/dashboard/widgets/GithubRepos";
import GithubCommits from "@/components/dashboard/widgets/GithubCommits";
import RssLatest from "@/components/dashboard/widgets/RssLatest";
import RssSummary from "@/components/dashboard/widgets/RssSummary";
import NoDataPlaceholder from "@/components/dashboard/NoDataPlaceholder";

type WidgetCardProps = {
  instance: WidgetInstance;
  widget?: CatalogWidget;
  onDragHandlePointerDown: (event: PointerEvent) => void;
  onResizeHandlePointerDown: (event: PointerEvent) => void;
  onDelete: () => void;
  onRefetchDue: () => void;
};

function getConfigString(
  config: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = config[key];
  return typeof value === "string" && value ? value : fallback;
}

function formatLastUpdated(fetchedAt: string | null) {
  if (!fetchedAt) return "No data yet";

  const date = new Date(fetchedAt);
  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));

  if (diffMinutes < 1) return "Last updated: just now";
  if (diffMinutes < 60) {
    return `Last updated: ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  return `Last updated: ${date.toLocaleString()}`;
}

export default function WidgetCard({
  instance,
  widget,
  onDragHandlePointerDown,
  onResizeHandlePointerDown,
  onDelete,
  onRefetchDue,
}: WidgetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const accent = accentForWidget(widget?.name ?? "");
  const title = widget ? titleForWidget(widget.name) : "Widget";
  const isClock = isClockWidget(widget?.name);
  const data = asRecord(instance.data);
  const refreshRateMs = instance.refresh_rate * 1000;

  useEffect(() => {
    if (isClock) return;

    const id = setInterval(onRefetchDue, refreshRateMs);
    return () => clearInterval(id);
  }, [isClock, refreshRateMs, onRefetchDue]);

  function renderContent() {
    if (widget?.name === "analog_clock") {
      return <AnalogClock timezone={getConfigString(instance.config, "timezone", "UTC")} />;
    }
    if (widget?.name === "digital_clock") {
      return <DigitalClock timezone={getConfigString(instance.config, "timezone", "UTC")} />;
    }
    if (!widget) {
      return <NoDataPlaceholder message="Loading…" />;
    }
    if (!data) {
      return <NoDataPlaceholder message={instance.warning ?? "No data yet"} />;
    }
    if (widget.name === "city_temperature") {
      return <WeatherTemperature data={data as unknown as WeatherTemperatureData} />;
    }
    if (widget.name === "current_conditions") {
      return <WeatherConditions data={data as unknown as WeatherConditionsData} />;
    }
    if (widget.name === "city_forecast") {
      return <WeatherForecast data={data as unknown as WeatherForecastData} />;
    }
    if (widget.name === "user_profile") {
      return <GithubProfile data={data as unknown as GithubProfileData} />;
    }
    if (widget.name === "recent_repos") {
      return <GithubRepos data={data as unknown as GithubReposData} />;
    }
    if (widget.name === "recent_commits") {
      return <GithubCommits data={data as unknown as GithubCommitsData} />;
    }
    if (widget.name === "feed_latest") {
      return <RssLatest data={data as unknown as RssLatestData} />;
    }
    if (widget.name === "feed_summary") {
      return (
        <RssSummary
          data={data as unknown as RssSummaryData}
          feedUrl={getConfigString(instance.config, "feed_url", "")}
        />
      );
    }
    return <NoDataPlaceholder message="This widget's data service isn't connected yet." />;
  }

  return (
    <div className="relative flex h-full flex-col rounded-2xl bg-zinc-900">
      <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            onPointerDown={onDragHandlePointerDown}
            className="mt-0.5 cursor-grab touch-none text-zinc-600 hover:text-zinc-400 active:cursor-grabbing"
            aria-label="Drag to move"
          >
            <GripVertical size={16} />
          </button>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p
              className={`text-[10px] font-semibold uppercase tracking-wide ${accent.textClass}`}
            >
              {accent.label}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="text-zinc-600 hover:text-zinc-400"
            aria-label="Widget options"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-rose-400 hover:bg-zinc-800"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex min-h-full flex-col items-center justify-center">
          {renderContent()}
        </div>
      </div>

      {data && instance.warning && (
        <div className="flex items-center gap-1.5 border-t border-zinc-800 px-5 py-2 text-[11px] text-amber-400">
          <AlertTriangle size={12} />
          {instance.warning}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-3">
        <p className="text-[11px] text-zinc-600">
          {isClock ? "Last updated: just now" : formatLastUpdated(instance.fetched_at)}
        </p>
        <button
          type="button"
          onPointerDown={onResizeHandlePointerDown}
          className="cursor-nwse-resize touch-none text-zinc-600 hover:text-zinc-400"
          aria-label="Drag to resize"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {confirmDelete && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-900/95 p-5 text-center">
          <p className="text-sm font-semibold text-white">Delete this widget?</p>
          <p className="text-xs text-zinc-400">This can&apos;t be undone.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-400"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
