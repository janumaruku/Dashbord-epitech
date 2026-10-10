"use client";

import { useState } from "react";

import AddWidgetModal, {
  type NewWidgetConfig,
} from "@/components/dashboard/addWidgetModal";

type AddWidgetButtonProps = {
  compact?: boolean;
};

export default function AddWidgetButton({
  compact = false,
}: AddWidgetButtonProps) {
  const [modalOpen, setModalOpen] =
    useState(false);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleAddWidget(
    config: NewWidgetConfig
  ) {
    window.dispatchEvent(
      new CustomEvent(
        "dashboard:add-widget",
        {
          detail: config,
        }
      )
    );

    setModalOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label="Add widget"
        className={
          compact
            ? "flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-lg text-zinc-100 hover:bg-zinc-800"
            : "rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
        }
      >
        {compact
          ? "+"
          : "+ Add Widget"}
      </button>

      {modalOpen && (
        <AddWidgetModal
          onClose={closeModal}
          onAdd={
            handleAddWidget
          }
        />
      )}
    </>
  );
}