"use client";

import { GripVertical } from "lucide-react";
import WidgetOptionsMenu from "@/components/widget/widgetOptionsMenu";

type WidgetHeaderProps = {
  title: string;
  onConfigure: () => void;
  onDelete: () => void;
  menuOpen: boolean;
  onMenuOpenChange: (isOpen: boolean) => void;
};

export default function WidgetHeader({
  title,
  onConfigure,
  onDelete,
  menuOpen,
  onMenuOpenChange,
}: WidgetHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="widget-drag-handle cursor-grab rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white active:cursor-grabbing"
          aria-label="Move widget"
        >
          <GripVertical size={17} />
        </button>

        <p className="text-sm font-medium text-zinc-300">
          {title}
        </p>
      </div>

      <WidgetOptionsMenu
        onConfigure={onConfigure}
        onDelete={onDelete}
        isOpen={menuOpen}
        onOpenChange={onMenuOpenChange}
      />
    </div>
  );
}