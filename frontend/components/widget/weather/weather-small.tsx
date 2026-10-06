"use client";

import { useState } from "react";
import { Cloud } from "lucide-react";
import WidgetOptionsMenu from "@/components/widget/WidgetOptionsMenu";
import WidgetDeleteConfirm from "@/components/widget/WidgetDeleteConfirm";

type WeatherSmallWidgetProps = {
  city: string;
  temperature: number;
  condition: string;
};

export default function WeatherSmallWidget({
  city,
  temperature,
  condition,
}: WeatherSmallWidgetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function configureWidget() {
    console.log("Configure widget");
  }

  function openDeleteConfirm() {
    setMenuOpen(false);
    setDeleteOpen(true);
  }

  function closeDeleteConfirm() {
    setDeleteOpen(false);
  }

  function backToMenu() {
    setDeleteOpen(false);
    setMenuOpen(true);
  }

  function confirmDelete() {
    setDeleteOpen(false);

    console.log("Delete widget");

    // Plus tard :
    // appel backend pour supprimer réellement le widget
  }

  return (
    <article className="relative w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-3 pb-2 text-white">
      <div className="absolute right-2 top-2">
        <WidgetOptionsMenu
          onConfigure={configureWidget}
          onDelete={openDeleteConfirm}
          isOpen={menuOpen}
          onOpenChange={setMenuOpen}
        />
      </div>

      {deleteOpen && (
        <WidgetDeleteConfirm
          onBack={backToMenu}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      )}

      <p className="text-base text-zinc-400">{city}</p>

      <div className="mt-4 flex items-center gap-9">
        <div>
          <p className="text-3xl font-semibold">
            {temperature}°C
          </p>

          <p className="mt-1 text-base text-zinc-400">
            {condition}
          </p>
        </div>

        <Cloud size={80} className="mt-2 text-zinc-400" />
      </div>

      <div className="mt-5 border-t border-zinc-800 pt-1">
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-white"
        >
          Open Weather
        </a>
      </div>
    </article>
  );
}