"use client";

import { useRef, useState, type PointerEvent } from "react";
import {
  clampPosition,
  GRID_COLUMNS,
  GRID_GAP,
  ROW_HEIGHT,
  type Position,
} from "@/lib/widgets";
import type { WidgetInstance } from "@/hooks/useWidgetInstances";
import type { CatalogWidget } from "@/hooks/useWidgetCatalog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import WidgetCard from "@/components/dashboard/WidgetCard";

function stackedHeight(h: number): number {
  return h * ROW_HEIGHT + (h - 1) * GRID_GAP;
}

function noop() {}

type DashboardGridProps = {
  instances: WidgetInstance[];
  catalog: CatalogWidget[];
  onPositionChange: (id: string, position: Position) => void;
  onDelete: (id: string) => void;
  onRefetchDue: () => void;
};

type DragState = {
  instanceId: string;
  mode: "move" | "resize";
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPosition: Position;
  colWidth: number;
};

export default function DashboardGrid({
  instances,
  catalog,
  onPositionChange,
  onDelete,
  onRefetchDue,
}: DashboardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [liveOverride, setLiveOverride] = useState<Position | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  function beginDrag(
    instance: WidgetInstance,
    mode: "move" | "resize",
    event: PointerEvent,
  ) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const colWidth = (rect.width - (GRID_COLUMNS - 1) * GRID_GAP) / GRID_COLUMNS;

    (event.target as Element).setPointerCapture(event.pointerId);

    setDrag({
      instanceId: instance.id,
      mode,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPosition: instance.position,
      colWidth,
    });
    setLiveOverride(instance.position);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;

    const deltaX = event.clientX - drag.startClientX;
    const deltaY = event.clientY - drag.startClientY;
    const colUnit = drag.colWidth + GRID_GAP;
    const rowUnit = ROW_HEIGHT + GRID_GAP;

    const deltaCols = Math.round(deltaX / colUnit);
    const deltaRows = Math.round(deltaY / rowUnit);

    const next =
      drag.mode === "move"
        ? clampPosition({
            ...drag.startPosition,
            x: drag.startPosition.x + deltaCols,
            y: drag.startPosition.y + deltaRows,
          })
        : clampPosition({
            ...drag.startPosition,
            w: drag.startPosition.w + deltaCols,
            h: drag.startPosition.h + deltaRows,
          });

    setLiveOverride(next);
  }

  function endDrag() {
    if (drag && liveOverride) {
      onPositionChange(drag.instanceId, liveOverride);
    }
    setDrag(null);
    setLiveOverride(null);
  }

  if (!isDesktop) {
    const sorted = [...instances].sort((a, b) => {
      if (a.position.y !== b.position.y) return a.position.y - b.position.y;
      return a.position.x - b.position.x;
    });

    return (
      <div className="flex w-full min-w-0 flex-col gap-4">
        {sorted.map((instance) => {
          const widget = catalog.find((w) => w.id === instance.widget_id);

          return (
            <div
              key={instance.id}
              className="min-w-0"
              style={{ height: stackedHeight(instance.position.h) }}
            >
              <WidgetCard
                instance={instance}
                widget={widget}
                onDragHandlePointerDown={noop}
                onResizeHandlePointerDown={noop}
                onDelete={() => onDelete(instance.id)}
                onRefetchDue={onRefetchDue}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
        gridAutoRows: `${ROW_HEIGHT}px`,
        gap: `${GRID_GAP}px`,
      }}
    >
      {instances.map((instance) => {
        const widget = catalog.find((w) => w.id === instance.widget_id);
        const isDragging = drag?.instanceId === instance.id;
        const position = isDragging && liveOverride ? liveOverride : instance.position;

        return (
          <div
            key={instance.id}
            className={`relative ${isDragging ? "z-10 opacity-90" : ""}`}
            style={{
              gridColumn: `${position.x + 1} / span ${position.w}`,
              gridRow: `${position.y + 1} / span ${position.h}`,
            }}
          >
            <WidgetCard
              instance={instance}
              widget={widget}
              onDragHandlePointerDown={(event) => beginDrag(instance, "move", event)}
              onResizeHandlePointerDown={(event) => beginDrag(instance, "resize", event)}
              onDelete={() => onDelete(instance.id)}
              onRefetchDue={onRefetchDue}
            />
          </div>
        );
      })}
    </div>
  );
}
