"use client";

import { ArrowLeft, X } from "lucide-react";

type WidgetDeleteConfirmProps = {
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function WidgetDeleteConfirm({
  onBack,
  onClose,
  onConfirm,
}: WidgetDeleteConfirmProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-80 max-w-[90vw] rounded-xl border border-zinc-700 bg-zinc-950 px-4 pb-4 pt-2 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="-mx-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <p className="text-lg font-semibold text-white">
            Delete widget
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-3 text-base leading-6 text-zinc-300">
          Are you sure you want to delete this widget?
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          This action cannot be undone.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-base text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md border border-red-900 bg-red-950/50 px-3 py-2 text-base font-medium text-red-300 hover:bg-red-900/60"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}