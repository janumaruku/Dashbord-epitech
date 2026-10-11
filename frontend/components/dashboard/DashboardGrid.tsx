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
import WidgetCard from "@/components/dashboard/WidgetCard";

type DashboardGridProps = {
  instances: WidgetInstance[];
  catalog: CatalogWidget[];
  onPositionChange: (id: string, position: Position) => void;
  onDelete: (id: string) => void;
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
}: DashboardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [liveOverride, setLiveOverride] = useState<Position | null>(null);

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
              onDelete={() => onDelete(instance.id)}
            />
            <div
              onPointerDown={(event) => beginDrag(instance, "resize", event)}
              className="absolute bottom-1.5 right-1.5 h-3 w-3 cursor-nwse-resize rounded-sm border-b-2 border-r-2 border-zinc-600 hover:border-zinc-400"
            />
          </div>
        );
      })}
    </div>
  );
}
