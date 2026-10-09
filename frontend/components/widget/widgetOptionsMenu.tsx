"use client";

import { useEffect, useRef } from "react";
import { MoreVertical, Settings, Trash2 } from "lucide-react";

type WidgetOptionsMenuProps = {
  onConfigure: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function WidgetOptionsMenu({
  onConfigure,
  onDelete,
  isOpen,
  onOpenChange,
}: WidgetOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOpenChange]);

  function handleConfigure() {
    onOpenChange(false);
    onConfigure();
  }

  function handleDelete() {
    onOpenChange(false);
    onDelete();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        aria-label="Widget options"
        aria-expanded={isOpen}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-zinc-700 bg-zinc-950 p-1 shadow-lg">
          <button
            type="button"
            onClick={handleConfigure}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
          >
            <Settings size={15} />
            Configure
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-800"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}