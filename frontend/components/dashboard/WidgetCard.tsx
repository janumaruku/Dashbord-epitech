"use client";

import { useState, type PointerEvent } from "react";
import { GripVertical, Maximize2, MoreHorizontal, Trash2 } from "lucide-react";
import type { WidgetInstance } from "@/hooks/useWidgetInstances";
import type { CatalogWidget } from "@/hooks/useWidgetCatalog";
import { accentForWidget, isClockWidget, titleForWidget } from "@/lib/widgets";
import AnalogClock from "@/components/dashboard/widgets/AnalogClock";
import DigitalClock from "@/components/dashboard/widgets/DigitalClock";
import NoDataPlaceholder from "@/components/dashboard/NoDataPlaceholder";

type WidgetCardProps = {
  instance: WidgetInstance;
  widget?: CatalogWidget;
  onDragHandlePointerDown: (event: PointerEvent) => void;
  onResizeHandlePointerDown: (event: PointerEvent) => void;
  onDelete: () => void;
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
}: WidgetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const accent = accentForWidget(widget?.name ?? "");
  const title = widget ? titleForWidget(widget.name) : "Widget";
  const isClock = isClockWidget(widget?.name);

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

      <div className="flex flex-1 items-center justify-center px-5 py-4">
        {widget?.name === "analog_clock" && (
          <AnalogClock timezone={getConfigString(instance.config, "timezone", "UTC")} />
        )}
        {widget?.name === "digital_clock" && (
          <DigitalClock timezone={getConfigString(instance.config, "timezone", "UTC")} />
        )}
        {widget && !isClock && (
          <NoDataPlaceholder message="This widget's data service isn't connected yet." />
        )}
        {!widget && <NoDataPlaceholder message="Loading…" />}
      </div>

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
